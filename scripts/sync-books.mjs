#!/usr/bin/env node
/**
 * Syncs the books in a named Hardcover list (e.g. "share-public") into
 * src/data/books.json and downloads their covers into public/covers/.
 * Replaces the previous Calibre-SQLite-based flow — the data source is now
 * Hardcover's GraphQL API, and membership is curated manually in Hardcover.
 *
 * Flags:
 *   --dry-run    Write books.json + covers locally; do not touch git.
 *   --no-push    Commit but do not push.
 *
 * Env:
 *   HARDCOVER_API_KEY   required; see scripts/lib/hardcover.mjs
 *   HARDCOVER_LIST      required; slug of the user's list to render (e.g. "share-public")
 *   SYNC_BRANCH         optional; git branch to sync against (default: main)
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseFlags,
  prepareBranch,
  commitAndPush,
  pingKuma,
} from "./lib/git-sync.mjs";
import { findUserList, getList } from "./lib/hardcover.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

const { dryRun: DRY_RUN, noPush: NO_PUSH } = parseFlags(process.argv);
const BRANCH = process.env.SYNC_BRANCH || "main";
const LIST_SLUG = process.env.HARDCOVER_LIST;

const BOT_NAME = "hardcover-sync[bot]";
const BOT_EMAIL = "noreply@about-clay.com";

if (!LIST_SLUG) {
  console.error("error: HARDCOVER_LIST (slug of the Hardcover list) is required");
  process.exit(1);
}

async function downloadCover(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  cover fetch ${url} → ${res.status}, skipping`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const tmpPath = `${destPath}.tmp`;
  writeFileSync(tmpPath, buf);
  renameSync(tmpPath, destPath);
  return true;
}

if (!DRY_RUN) {
  prepareBranch({ branch: BRANCH, cwd: repoRoot });
}

const list = await findUserList(LIST_SLUG);
if (!list) {
  console.error(`error: no Hardcover list found with slug "${LIST_SLUG}"`);
  process.exit(1);
}
console.log(`reading list "${list.name}" (id=${list.id}, books_count=${list.books_count})`);

const listBooks = await getList({ listId: list.id });
console.log(`  ${listBooks.length} books in list`);

const coversDir = join(repoRoot, "public", "covers");
mkdirSync(coversDir, { recursive: true });

const books = [];
for (const book of listBooks) {
  let hasCover = false;
  if (book.imageUrl) {
    try {
      hasCover = await downloadCover(
        book.imageUrl,
        join(coversDir, `${book.id}.jpg`),
      );
    } catch (err) {
      console.warn(`  cover fetch failed for ${book.id}: ${err.message}`);
    }
  }
  books.push({
    id: book.id,
    title: book.title,
    author: book.author,
    authorSort: book.authorSort,
    tags: book.tags,
    hasCover,
  });
}

const validIds = new Set(books.filter((b) => b.hasCover).map((b) => String(b.id)));
const existingCovers = readdirSync(coversDir).filter((f) => f.endsWith(".jpg"));
for (const file of existingCovers) {
  const id = file.replace(/\.jpg$/, "");
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

commitAndPush({
  paths: ["src/data/books.json", "public/covers/"],
  message: `sync books: ${books.length} entries`,
  botName: BOT_NAME,
  botEmail: BOT_EMAIL,
  branch: BRANCH,
  noPush: NO_PUSH,
  cwd: repoRoot,
});

await pingKuma("KUMA_PUSH_SYNC_BOOKS");

console.log("done");
