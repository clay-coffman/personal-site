#!/usr/bin/env node
/**
 * One-shot importer: reads ~/catalog.json (a list of physical books with
 * title + author) and adds each to the user's Hardcover library as "owned".
 *
 * Idempotent via a cache file at ~/.local/state/about-clay/physical-books-imported.json.
 * Low-confidence matches are written to ~/physical-books-needs-review.json
 * instead of being auto-added.
 *
 * Flags:
 *   --dry-run    Do not call Hardcover mutations or update the cache.
 *   --limit N    Process only the first N entries (for sanity checks).
 *
 * Env:
 *   HARDCOVER_API_KEY   required
 *   CATALOG_PATH        optional; defaults to $HOME/catalog.json
 */

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
  addToLibrary,
  addToList,
  findUserList,
} from "./lib/hardcover.mjs";

const HOME = homedir();
const CATALOG = process.env.CATALOG_PATH || join(HOME, "catalog.json");
const STATE_DIR = join(HOME, ".local", "state", "about-clay");
const CACHE_PATH = join(STATE_DIR, "physical-books-imported.json");
const REVIEW_PATH = join(HOME, "physical-books-needs-review.json");
const SLEEP_MS = 250;

const DRY_RUN = process.argv.includes("--dry-run");
const limitIdx = process.argv.indexOf("--limit");
const LIMIT = limitIdx >= 0 ? parseInt(process.argv[limitIdx + 1], 10) : null;

function normalizeKey({ title, author }) {
  return `${title}|${author}`.toLowerCase().replace(/\s+/g, " ").trim();
}

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

const catalog = loadJson(CATALOG, null);
if (!catalog || !Array.isArray(catalog.books)) {
  console.error(`error: ${CATALOG} is missing or has no "books" array`);
  process.exit(1);
}

const ownedList = await findUserList("owned");
if (!ownedList) {
  console.error('error: could not resolve user list with slug "owned"');
  process.exit(1);
}
console.log(`owned list: id=${ownedList.id} (${ownedList.books_count} books)`);

const cache = loadJson(CACHE_PATH, {});
const review = { entries: [] };

const entries = LIMIT ? catalog.books.slice(0, LIMIT) : catalog.books;
console.log(`processing ${entries.length}/${catalog.books.length} catalog entries`);
if (DRY_RUN) console.log("dry-run: no writes will happen");

let added = 0;
let skippedCached = 0;
let lowConfidence = 0;
let notFound = 0;
let errors = 0;

for (let i = 0; i < entries.length; i++) {
  const entry = entries[i];
  const key = normalizeKey(entry);
  const cached = cache[key];

  if (cached?.bookId) {
    skippedCached++;
    continue;
  }

  const prefix = `[${i + 1}/${entries.length}]`;
  try {
    const hits = await searchBooks({
      title: entry.title,
      author: entry.author,
      limit: 5,
    });

    if (hits.length === 0) {
      console.log(`${prefix} NOT FOUND: "${entry.title}" by ${entry.author}`);
      notFound++;
      review.entries.push({ catalog: entry, reason: "not_found", candidates: [] });
      await sleep(SLEEP_MS);
      continue;
    }

    const top = hits[0];
    if (top.confidence === "low") {
      console.log(
        `${prefix} LOW-CONF: "${entry.title}" by ${entry.author}` +
          ` → top="${top.title}" (score=${top.score.toFixed(1)})`,
      );
      lowConfidence++;
      review.entries.push({
        catalog: entry,
        reason: "low_confidence",
        candidates: hits.slice(0, 3).map((h) => ({
          id: h.id,
          title: h.title,
          authors: h.authors,
          slug: h.slug,
          confidence: h.confidence,
          score: h.score,
          usersCount: h.usersCount,
        })),
      });
      await sleep(SLEEP_MS);
      continue;
    }

    if (DRY_RUN) {
      console.log(
        `${prefix} DRY-RUN ${top.confidence.padEnd(6)} "${top.title}" by ${top.authors.join(", ")} (score=${top.score.toFixed(1)})`,
      );
      added++;
      await sleep(SLEEP_MS);
      continue;
    }

    const libResult = await addToLibrary({ bookId: top.id });
    const listResult = await addToList({ bookId: top.id, listId: ownedList.id });
    cache[key] = {
      bookId: top.id,
      slug: top.slug,
      title: top.title,
      userBookId: libResult.id,
      listBookId: listResult.id,
      importedAt: new Date().toISOString(),
    };
    saveJson(CACHE_PATH, cache);
    console.log(
      `${prefix} ADDED ${top.confidence} "${top.title}" (book=${top.id}, user_book=${libResult.id})`,
    );
    added++;
  } catch (err) {
    errors++;
    console.error(`${prefix} ERROR on "${entry.title}": ${err.message}`);
    review.entries.push({
      catalog: entry,
      reason: "error",
      error: err.message,
    });
  }

  await sleep(SLEEP_MS);
}

if (review.entries.length > 0) {
  saveJson(REVIEW_PATH, {
    generated_at: new Date().toISOString(),
    entries: review.entries,
  });
  console.log(`wrote ${review.entries.length} review entries to ${REVIEW_PATH}`);
}

console.log(
  `\ndone — added: ${added}, cached-skip: ${skippedCached},` +
    ` low-conf: ${lowConfidence}, not-found: ${notFound}, errors: ${errors}`,
);
