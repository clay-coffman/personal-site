#!/usr/bin/env node
/**
 * Syncs the books in a named Hardcover list (e.g. "share-public") into
 * src/data/books.json. Cover images are mirrored to the R2 bucket at
 * R2_PHOTOS_PUBLIC_URL/covers/{id}.jpg; only the metadata JSON is committed.
 *
 * Flags:
 *   --dry-run        Write books.json locally; skip R2 uploads and git.
 *   --no-push        Commit but do not push.
 *   --force-covers   Re-upload all covers to R2 even if already present
 *                    (use when the sync logic has changed what source it picks).
 *
 * Env:
 *   HARDCOVER_API_KEY     required; see scripts/lib/hardcover.mjs
 *   HARDCOVER_LIST        required; slug of the user's list to render (e.g. "share-public")
 *   R2_PHOTOS_REMOTE      required; e.g. r2-photos:personal-site-photos
 *   R2_PHOTOS_PUBLIC_URL  required; e.g. https://media.about-clay.com
 *   SYNC_BRANCH           optional; git branch to sync against (default: main)
 */

import {
  existsSync,
  readFileSync,
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
import {
  listR2Files,
  uploadToR2,
  deleteFromR2,
} from "./lib/r2-sync.mjs";
import { findUserList, getList } from "./lib/hardcover.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

const {
  dryRun: DRY_RUN,
  noPush: NO_PUSH,
  forceCovers: FORCE_COVERS,
} = parseFlags(process.argv);
const BRANCH = process.env.SYNC_BRANCH || "main";

const BOT_NAME = "hardcover-sync[bot]";
const BOT_EMAIL = "noreply@about-clay.com";

const LIST_SLUG = process.env.HARDCOVER_LIST;
const R2_REMOTE = process.env.R2_PHOTOS_REMOTE;
const R2_PUBLIC_URL = process.env.R2_PHOTOS_PUBLIC_URL;

for (const [name, value] of Object.entries({
  HARDCOVER_LIST: LIST_SLUG,
  R2_PHOTOS_REMOTE: R2_REMOTE,
  R2_PHOTOS_PUBLIC_URL: R2_PUBLIC_URL,
})) {
  if (!value) {
    console.error(`error: ${name} is required`);
    process.exit(1);
  }
}

const PUBLIC_COVERS = `${R2_PUBLIC_URL.replace(/\/$/, "")}/covers`;

async function uploadCoverToR2(imageUrl, filename) {
  const res = await fetch(imageUrl);
  if (!res.ok) {
    console.warn(`  cover fetch ${imageUrl} → ${res.status}, skipping`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  uploadToR2(R2_REMOTE, `covers/${filename}`, buf);
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
console.log(
  `reading list "${list.name}" (id=${list.id}, books_count=${list.books_count})`,
);

const listBooks = await getList({ listId: list.id });
console.log(`  ${listBooks.length} books in list`);

let existingR2 = new Set();
if (!DRY_RUN) {
  existingR2 = listR2Files(R2_REMOTE, "covers/");
  console.log(`  ${existingR2.size} existing covers in R2`);
}

const books = [];
for (const book of listBooks) {
  const filename = `${book.id}.jpg`;
  let coverUrl = null;
  if (book.imageUrl) {
    coverUrl = `${PUBLIC_COVERS}/${filename}`;
    if (!DRY_RUN && (!existingR2.has(filename) || FORCE_COVERS)) {
      console.log(`  uploading cover ${filename}`);
      try {
        const uploaded = await uploadCoverToR2(book.imageUrl, filename);
        if (!uploaded) coverUrl = null;
      } catch (err) {
        console.warn(`  cover upload failed for ${book.id}: ${err.message}`);
        coverUrl = null;
      }
    }
  }
  books.push({
    id: book.id,
    title: book.title,
    slug: book.slug || null,
    author: book.author,
    authorSort: book.authorSort,
    tags: book.tags,
    coverUrl,
  });
}

if (!DRY_RUN) {
  const validKeys = new Set(
    books.filter((b) => b.coverUrl).map((b) => `${b.id}.jpg`),
  );
  for (const existing of existingR2) {
    if (!validKeys.has(existing)) {
      console.log(`  removing orphan cover from R2: ${existing}`);
      deleteFromR2(R2_REMOTE, `covers/${existing}`);
    }
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
  `  with covers: ${books.filter((b) => b.coverUrl).length}, without: ${
    books.filter((b) => !b.coverUrl).length
  }`,
);

if (DRY_RUN) {
  console.log("dry-run: skipping git");
  process.exit(0);
}

commitAndPush({
  paths: ["src/data/books.json"],
  message: `sync books: ${books.length} entries`,
  botName: BOT_NAME,
  botEmail: BOT_EMAIL,
  branch: BRANCH,
  noPush: NO_PUSH,
  cwd: repoRoot,
});

await pingKuma("KUMA_PUSH_SYNC_BOOKS");

console.log("done");
