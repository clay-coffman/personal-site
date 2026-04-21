#!/usr/bin/env node
/**
 * Syncs Readwise highlights tagged `publish` into src/data/highlights.json.
 * Mirrors the flow of scripts/sync-books.mjs.
 *
 * Flags:
 *   --dry-run    Write highlights.json locally; do not touch git.
 *   --no-push    Commit but do not push.
 *
 * Env:
 *   READWISE_TOKEN   required; token from https://readwise.io/access_token
 *   SYNC_BRANCH      optional; git branch to sync against (default: main)
 */

import {
  existsSync,
  writeFileSync,
  readFileSync,
  mkdirSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseFlags,
  prepareBranch,
  commitAndPush,
  pingKuma,
} from "./lib/git-sync.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

const { dryRun: DRY_RUN, noPush: NO_PUSH } = parseFlags(process.argv);
const BRANCH = process.env.SYNC_BRANCH || "main";

const PUBLISH_TAG = "publish";
const BOT_NAME = "readwise-sync[bot]";
const BOT_EMAIL = "noreply@about-clay.com";

const token = process.env.READWISE_TOKEN;
if (!token) {
  console.error("error: READWISE_TOKEN is required");
  process.exit(1);
}

async function fetchAllBooks() {
  const out = [];
  let cursor = null;
  while (true) {
    const url = new URL("https://readwise.io/api/v2/export/");
    if (cursor) url.searchParams.set("pageCursor", cursor);
    const res = await fetch(url, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`readwise export failed: ${res.status} ${body}`);
    }
    const page = await res.json();
    out.push(...page.results);
    cursor = page.nextPageCursor;
    if (!cursor) break;
  }
  return out;
}

function extractHighlights(books) {
  const rows = [];
  for (const book of books) {
    if (book.is_deleted) continue;
    for (const hl of book.highlights || []) {
      if (hl.is_deleted) continue;
      const tagNames = (hl.tags || []).map((t) => t.name);
      if (!tagNames.includes(PUBLISH_TAG)) continue;
      rows.push({
        id: hl.id,
        text: hl.text,
        note: hl.note || null,
        bookTitle: book.readable_title || book.title,
        bookAuthor: book.author,
        category: book.category,
        sourceUrl: book.source_url || null,
        highlightedAt: hl.highlighted_at || hl.created_at,
        tags: tagNames.filter((t) => t !== PUBLISH_TAG),
        readwiseUrl: hl.readwise_url,
      });
    }
  }
  rows.sort((a, b) => {
    const ta = a.highlightedAt ? new Date(a.highlightedAt).valueOf() : 0;
    const tb = b.highlightedAt ? new Date(b.highlightedAt).valueOf() : 0;
    return tb - ta;
  });
  return rows;
}

if (!DRY_RUN) {
  prepareBranch({ branch: BRANCH, cwd: repoRoot });
}

console.log("fetching readwise export");
const books = await fetchAllBooks();
console.log(`  ${books.length} books`);

const highlights = extractHighlights(books);
console.log(`  ${highlights.length} highlights tagged "${PUBLISH_TAG}"`);

const dataDir = join(repoRoot, "src", "data");
mkdirSync(dataDir, { recursive: true });
const outPath = join(dataDir, "highlights.json");
const newJson = JSON.stringify(highlights, null, 2) + "\n";
const existingJson = existsSync(outPath) ? readFileSync(outPath, "utf-8") : "";

if (newJson !== existingJson) {
  writeFileSync(outPath, newJson);
  console.log(`wrote ${highlights.length} highlights to src/data/highlights.json`);
} else {
  console.log("no changes to highlights.json");
}

if (DRY_RUN) {
  console.log("dry-run: skipping git");
  process.exit(0);
}

commitAndPush({
  paths: ["src/data/highlights.json"],
  message: `sync highlights: ${highlights.length} entries`,
  botName: BOT_NAME,
  botEmail: BOT_EMAIL,
  branch: BRANCH,
  noPush: NO_PUSH,
  cwd: repoRoot,
});

await pingKuma("KUMA_PUSH_SYNC_HIGHLIGHTS");

console.log("done");
