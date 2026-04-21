#!/usr/bin/env node
/**
 * Ongoing sync: pushes every book in the local Calibre library into the user's
 * Hardcover library as "owned". Idempotent via a cache keyed by Calibre book ID,
 * so nightly runs only do real work for newly-ingested books.
 *
 * Match strategy, in order:
 *   1. ISBN lookup (edition by isbn_13/isbn_10) — strongest signal.
 *   2. Title + author search with scoring — fallback when no ISBN is present.
 *   Low-confidence matches are routed to a review file instead of auto-added.
 *
 * Flags:
 *   --dry-run    Read the library and print matches; no Hardcover writes or
 *                cache updates.
 *   --limit N    Process only the first N new books (sanity checks).
 *
 * Env:
 *   HARDCOVER_API_KEY   required
 *   CALIBRE_LIBRARY     optional; defaults to /opt/staging/calibre-library
 *   KUMA_PUSH_SYNC_CWA_HARDCOVER   optional; Uptime Kuma heartbeat URL
 */

import Database from "better-sqlite3";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  searchBooks,
  findBookByIsbn,
  addToLibrary,
  addToList,
  findUserList,
} from "./lib/hardcover.mjs";
import { pingKuma } from "./lib/git-sync.mjs";

const HOME = homedir();
const CALIBRE_LIBRARY =
  process.env.CALIBRE_LIBRARY || "/opt/staging/calibre-library";
const STATE_DIR = join(HOME, ".local", "state", "about-clay");
const CACHE_PATH = join(STATE_DIR, "cwa-books-imported.json");
const REVIEW_PATH = join(HOME, "cwa-books-needs-review.json");
const SLEEP_MS = 250;

const DRY_RUN = process.argv.includes("--dry-run");
const limitIdx = process.argv.indexOf("--limit");
const LIMIT = limitIdx >= 0 ? parseInt(process.argv[limitIdx + 1], 10) : null;

function loadJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf-8"));
}

function saveJson(path, data) {
  mkdirSync(STATE_DIR, { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const dbPath = join(CALIBRE_LIBRARY, "metadata.db");
if (!existsSync(dbPath)) {
  console.error(`error: ${dbPath} not found`);
  process.exit(1);
}

console.log(`reading ${dbPath}`);
const conn = new Database(dbPath, { readonly: true, fileMustExist: true });
const rows = conn
  .prepare(
    `
    SELECT
      b.id,
      b.title,
      b.author_sort,
      GROUP_CONCAT(DISTINCT a.name) AS authors,
      (
        SELECT i.val
        FROM identifiers i
        WHERE i.book = b.id AND LOWER(i.type) = 'isbn'
        LIMIT 1
      ) AS isbn
    FROM books b
    LEFT JOIN books_authors_link ba ON b.id = ba.book
    LEFT JOIN authors a ON ba.author = a.id
    GROUP BY b.id
    ORDER BY b.id ASC
    `,
  )
  .all();
conn.close();
console.log(`  ${rows.length} books in library`);

const ownedList = await findUserList("owned");
if (!ownedList) {
  console.error('error: could not resolve user list with slug "owned"');
  process.exit(1);
}
console.log(`owned list: id=${ownedList.id}`);

const cache = loadJson(CACHE_PATH, {});
const review = { generated_at: new Date().toISOString(), entries: [] };
// Review file is always reset at the start so it reflects the latest run.

const queue = [];
for (const row of rows) {
  if (cache[row.id]?.bookId) continue;
  queue.push(row);
  if (LIMIT && queue.length >= LIMIT) break;
}
console.log(
  `  ${queue.length} new (unimported) books to process` +
    (LIMIT ? ` (limited to ${LIMIT})` : ""),
);
if (DRY_RUN) console.log("dry-run: no writes will happen");

function parseAuthorSort(authorSort) {
  if (!authorSort) return "";
  if (authorSort.includes(", ")) {
    const [last, first] = authorSort.split(", ", 2);
    return `${first} ${last}`;
  }
  return authorSort;
}

let added = 0;
let lowConfidence = 0;
let notFound = 0;
let errors = 0;

for (let i = 0; i < queue.length; i++) {
  const row = queue[i];
  const author = row.authors || parseAuthorSort(row.author_sort);
  const prefix = `[${i + 1}/${queue.length}] calibre#${row.id}`;

  try {
    let match = null;
    let via = null;
    if (row.isbn) {
      match = await findBookByIsbn(row.isbn);
      if (match) via = "isbn";
    }
    if (!match) {
      const hits = await searchBooks({
        title: row.title,
        author,
        limit: 5,
      });
      if (hits.length > 0 && hits[0].confidence !== "low") {
        match = hits[0];
        via = "search";
      } else if (hits.length > 0) {
        lowConfidence++;
        review.entries.push({
          calibreId: row.id,
          calibreTitle: row.title,
          calibreAuthor: author,
          calibreIsbn: row.isbn || null,
          reason: "low_confidence",
          candidates: hits.slice(0, 3).map((h) => ({
            id: h.id,
            title: h.title,
            authors: h.authors,
            confidence: h.confidence,
            score: h.score,
            usersCount: h.usersCount,
          })),
        });
        console.log(
          `${prefix} LOW-CONF "${row.title}" → "${hits[0].title}" (score=${hits[0].score.toFixed(1)})`,
        );
        await sleep(SLEEP_MS);
        continue;
      } else {
        notFound++;
        review.entries.push({
          calibreId: row.id,
          calibreTitle: row.title,
          calibreAuthor: author,
          calibreIsbn: row.isbn || null,
          reason: "not_found",
        });
        console.log(`${prefix} NOT FOUND "${row.title}" by ${author}`);
        await sleep(SLEEP_MS);
        continue;
      }
    }

    if (DRY_RUN) {
      console.log(
        `${prefix} DRY-RUN via=${via} → "${match.title}" (hc=${match.id})`,
      );
      added++;
      await sleep(SLEEP_MS);
      continue;
    }

    const libResult = await addToLibrary({
      bookId: match.id,
      editionId: match.editionId || null,
    });
    const listResult = await addToList({
      bookId: match.id,
      listId: ownedList.id,
      editionId: match.editionId || null,
    });
    cache[row.id] = {
      bookId: match.id,
      editionId: match.editionId || null,
      slug: match.slug,
      title: match.title,
      userBookId: libResult.id,
      listBookId: listResult.id,
      via,
      importedAt: new Date().toISOString(),
    };
    saveJson(CACHE_PATH, cache);
    console.log(
      `${prefix} ADDED via=${via} "${match.title}" (hc=${match.id}, user_book=${libResult.id})`,
    );
    added++;
  } catch (err) {
    errors++;
    console.error(`${prefix} ERROR: ${err.message}`);
    review.entries.push({
      calibreId: row.id,
      calibreTitle: row.title,
      calibreAuthor: author,
      reason: "error",
      error: err.message,
    });
  }

  await sleep(SLEEP_MS);
}

if (review.entries.length > 0) {
  saveJson(REVIEW_PATH, review);
  console.log(`wrote ${review.entries.length} review entries to ${REVIEW_PATH}`);
}

console.log(
  `\ndone — added: ${added}, low-conf: ${lowConfidence},` +
    ` not-found: ${notFound}, errors: ${errors}`,
);

if (!DRY_RUN) {
  await pingKuma("KUMA_PUSH_SYNC_CWA_HARDCOVER");
}
