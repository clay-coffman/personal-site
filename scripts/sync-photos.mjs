#!/usr/bin/env node
/**
 * Syncs photos from a specific Immich album into src/data/photos.json.
 * Asset bytes are mirrored to an R2 bucket (served at R2_PHOTOS_PUBLIC_URL);
 * only the JSON metadata is committed. Mirrors the flow of sync-books.mjs.
 *
 * Flags:
 *   --dry-run    Write photos.json locally; skip R2 uploads and git.
 *   --no-push    Commit but do not push.
 *
 * Env (required):
 *   IMMICH_API_KEY, IMMICH_API_URL, IMMICH_ALBUM_ID
 *   R2_PHOTOS_REMOTE       e.g. r2-photos:personal-site-photos
 *   R2_PHOTOS_PUBLIC_URL   e.g. https://media.about-clay.com
 * Env (optional):
 *   SYNC_BRANCH            git branch (default: main)
 *   KUMA_PUSH_SYNC_PHOTOS  heartbeat URL
 */

import {
  existsSync,
  mkdirSync,
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

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

const { dryRun: DRY_RUN, noPush: NO_PUSH } = parseFlags(process.argv);
const BRANCH = process.env.SYNC_BRANCH || "main";

const BOT_NAME = "immich-sync[bot]";
const BOT_EMAIL = "noreply@about-clay.com";

const {
  IMMICH_API_KEY,
  IMMICH_API_URL,
  IMMICH_ALBUM_ID,
  R2_PHOTOS_REMOTE,
  R2_PHOTOS_PUBLIC_URL,
} = process.env;

for (const [name, value] of Object.entries({
  IMMICH_API_KEY,
  IMMICH_API_URL,
  IMMICH_ALBUM_ID,
  R2_PHOTOS_REMOTE,
  R2_PHOTOS_PUBLIC_URL,
})) {
  if (!value) {
    console.error(`error: ${name} is required`);
    process.exit(1);
  }
}

const IMMICH_BASE = IMMICH_API_URL.replace(/\/$/, "");
const PUBLIC_PHOTOS = `${R2_PHOTOS_PUBLIC_URL.replace(/\/$/, "")}/photos`;

async function fetchAlbum() {
  const url = `${IMMICH_BASE}/api/albums/${IMMICH_ALBUM_ID}`;
  const res = await fetch(url, {
    headers: { "x-api-key": IMMICH_API_KEY, Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(
      `immich album fetch failed: ${res.status} ${await res.text()}`,
    );
  }
  return res.json();
}

async function uploadAssetToR2(assetId, filename) {
  const url = `${IMMICH_BASE}/api/assets/${assetId}/thumbnail?size=preview`;
  const res = await fetch(url, { headers: { "x-api-key": IMMICH_API_KEY } });
  if (!res.ok) {
    throw new Error(
      `immich asset fetch ${assetId}: ${res.status} ${await res.text()}`,
    );
  }
  const buf = Buffer.from(await res.arrayBuffer());
  uploadToR2(R2_PHOTOS_REMOTE, `photos/${filename}`, buf);
}

function captionFor(asset) {
  const desc = asset.exifInfo?.description?.trim();
  return desc || null;
}

if (!DRY_RUN) {
  prepareBranch({ branch: BRANCH, cwd: repoRoot });
}

console.log(`fetching album ${IMMICH_ALBUM_ID}`);
const album = await fetchAlbum();
const albumAssets = (album.assets || []).filter(
  (a) => String(a.type).toUpperCase() === "IMAGE",
);
console.log(
  `  album "${album.albumName}" → ${albumAssets.length} image assets`,
);

let existingR2 = new Set();
if (!DRY_RUN) {
  existingR2 = listR2Files(R2_PHOTOS_REMOTE, "photos/");
  console.log(`  ${existingR2.size} existing photos in R2`);
}

const photos = [];
for (const asset of albumAssets) {
  const width = asset.exifInfo?.exifImageWidth;
  const height = asset.exifInfo?.exifImageHeight;
  if (!width || !height) {
    console.warn(
      `  skipping ${asset.id} (${asset.originalFileName || ""}): missing dimensions`,
    );
    continue;
  }
  const filename = `${asset.id}.jpg`;
  if (!DRY_RUN && !existingR2.has(filename)) {
    console.log(`  uploading ${filename}`);
    await uploadAssetToR2(asset.id, filename);
  }
  const takenAt =
    asset.exifInfo?.dateTimeOriginal ??
    asset.takenAt ??
    asset.fileCreatedAt ??
    null;
  const year = takenAt ? new Date(takenAt).getFullYear() : null;
  const latitude = asset.exifInfo?.latitude ?? asset.latitude ?? null;
  const longitude = asset.exifInfo?.longitude ?? asset.longitude ?? null;

  photos.push({
    id: asset.id,
    url: `${PUBLIC_PHOTOS}/${filename}`,
    caption: captionFor(asset),
    width,
    height,
    takenAt,
    year,
    ...(latitude != null && longitude != null
      ? { latitude, longitude }
      : {}),
  });
}

photos.sort((a, b) => {
  const at = a.takenAt ? Date.parse(a.takenAt) : null;
  const bt = b.takenAt ? Date.parse(b.takenAt) : null;
  if (at == null && bt == null) return 0;
  if (at == null) return 1;
  if (bt == null) return -1;
  return bt - at;
});

if (!DRY_RUN) {
  const validIds = new Set(photos.map((p) => `${p.id}.jpg`));
  for (const existing of existingR2) {
    if (!validIds.has(existing)) {
      console.log(`  removing orphan from R2: ${existing}`);
      deleteFromR2(R2_PHOTOS_REMOTE, `photos/${existing}`);
    }
  }
}

const dataDir = join(repoRoot, "src", "data");
mkdirSync(dataDir, { recursive: true });
const outPath = join(dataDir, "photos.json");
const newJson = JSON.stringify(photos, null, 2) + "\n";
const existingJson = existsSync(outPath) ? readFileSync(outPath, "utf-8") : "";

if (newJson !== existingJson) {
  writeFileSync(outPath, newJson);
  console.log(`wrote ${photos.length} photos to src/data/photos.json`);
} else {
  console.log("no changes to photos.json");
}

if (DRY_RUN) {
  console.log("dry-run: skipping git");
  process.exit(0);
}

commitAndPush({
  paths: ["src/data/photos.json"],
  message: `sync photos: ${photos.length} entries`,
  botName: BOT_NAME,
  botEmail: BOT_EMAIL,
  branch: BRANCH,
  noPush: NO_PUSH,
  cwd: repoRoot,
});

await pingKuma("KUMA_PUSH_SYNC_PHOTOS");

console.log("done");
