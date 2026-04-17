#!/usr/bin/env node
/**
 * Syncs 5-star books from a Calibre library into src/data/books.json and
 * public/covers/. Intended to run on the Hetzner host that has the library
 * mounted, but also supports local dry-runs for iteration.
 *
 * Flags:
 *   --dry-run    Write books.json + covers locally; do not touch git.
 *   --no-push    Commit but do not push (useful for review before pushing).
 *
 * Env:
 *   CALIBRE_LIBRARY   Path to Calibre library root (default: /calibre).
 */

import Database from "better-sqlite3";
import {
  existsSync,
  mkdirSync,
  copyFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
  readFileSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

const CALIBRE_LIBRARY = process.env.CALIBRE_LIBRARY || "/calibre";
const DRY_RUN = process.argv.includes("--dry-run");
const NO_PUSH = process.argv.includes("--no-push");

const BOT_NAME = "calibre-sync[bot]";
const BOT_EMAIL = "noreply@about-clay.com";

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: repoRoot, stdio: "inherit", ...opts });
}

function runSilent(cmd) {
  return execSync(cmd, { cwd: repoRoot }).toString();
}

function formatAuthors(authors) {
  return authors
    .split(",")
    .map((a) => a.trim())
    .map((a) => a.replace(/\s*\([^)]*\)/, ""))
    .join(", ");
}

function parseAuthorSort(authorSort) {
  if (!authorSort) return "";
  if (authorSort.includes(", ")) {
    const [last, first] = authorSort.split(", ", 2);
    return `${first} ${last}`;
  }
  return authorSort;
}

const dbPath = join(CALIBRE_LIBRARY, "metadata.db");
if (!existsSync(dbPath)) {
  console.error(`error: ${dbPath} not found`);
  console.error(`set CALIBRE_LIBRARY to the directory containing metadata.db`);
  process.exit(1);
}

if (!DRY_RUN) {
  console.log("syncing git state from origin/main");
  run("git fetch origin main");
  run("git reset --hard origin/main");
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
      b.path,
      b.has_cover,
      GROUP_CONCAT(DISTINCT a.name) AS authors,
      GROUP_CONCAT(DISTINCT t.name) AS tags
    FROM books b
    JOIN books_ratings_link br ON b.id = br.book
    JOIN ratings r ON br.rating = r.id
    LEFT JOIN books_authors_link ba ON b.id = ba.book
    LEFT JOIN authors a ON ba.author = a.id
    LEFT JOIN books_tags_link bt ON b.id = bt.book
    LEFT JOIN tags t ON bt.tag = t.id
    WHERE r.rating = 10
    GROUP BY b.id
    ORDER BY b.author_sort ASC
    `,
  )
  .all();
conn.close();

const coversDir = join(repoRoot, "public", "covers");
mkdirSync(coversDir, { recursive: true });

const books = [];
for (const row of rows) {
  const coverSrc = join(CALIBRE_LIBRARY, row.path, "cover.jpg");
  let hasCover = false;
  if (row.has_cover && existsSync(coverSrc)) {
    copyFileSync(coverSrc, join(coversDir, `${row.id}.jpg`));
    hasCover = true;
  }
  books.push({
    id: row.id,
    title: row.title,
    author: row.authors
      ? formatAuthors(row.authors)
      : parseAuthorSort(row.author_sort),
    authorSort: row.author_sort,
    tags: row.tags ? row.tags.split(",") : [],
    hasCover,
  });
}

// Orphan cleanup: delete covers whose id is no longer in the 5-star list.
const validIds = new Set(books.filter((b) => b.hasCover).map((b) => b.id));
const existingCovers = readdirSync(coversDir).filter((f) => f.endsWith(".jpg"));
for (const file of existingCovers) {
  const id = Number(file.replace(/\.jpg$/, ""));
  if (!validIds.has(id)) {
    unlinkSync(join(coversDir, file));
    console.log(`  removed orphan cover: ${file}`);
  }
}

const booksJsonPath = join(repoRoot, "src", "data", "books.json");
const newJson = JSON.stringify(books, null, 2) + "\n";
const existingJson = existsSync(booksJsonPath)
  ? readFileSync(booksJsonPath, "utf-8")
  : "";

if (newJson !== existingJson) {
  writeFileSync(booksJsonPath, newJson);
}

console.log(`wrote ${books.length} books to src/data/books.json`);
console.log(
  `  with covers: ${books.filter((b) => b.hasCover).length}, without: ${
    books.filter((b) => !b.hasCover).length
  }`,
);

if (DRY_RUN) {
  console.log("dry-run: skipping git");
  process.exit(0);
}

const status = runSilent("git status --porcelain").trim();
if (!status) {
  console.log("no changes — exiting without commit");
  process.exit(0);
}

console.log("committing");
run("git add src/data/books.json public/covers/");
run(
  `git -c user.name="${BOT_NAME}" -c user.email="${BOT_EMAIL}" commit -m "sync books: ${books.length} entries"`,
);

if (NO_PUSH) {
  console.log("--no-push: leaving commit local");
  process.exit(0);
}

console.log("pushing");
try {
  run("git push origin main");
} catch {
  console.log("push rejected — rebasing on origin/main and retrying");
  run("git fetch origin main");
  run("git rebase origin/main");
  run("git push origin main");
}

console.log("done");
