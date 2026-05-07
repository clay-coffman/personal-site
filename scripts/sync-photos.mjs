#!/usr/bin/env node
/**
 * Syncs photos from a specific Immich album into src/data/photos.json.
 * Asset bytes are mirrored to an R2 bucket (served at R2_PHOTOS_PUBLIC_URL);
 * only the JSON metadata is committed.
 *
 * After fetching, photos are clustered into trips by time + location, each trip
 * is reverse-geocoded (Nominatim), named (Claude Haiku), assigned a cover and
 * tier, and the result is written as { trips, photos } so the site can render
 * the trip-clustered design.
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
 *   ANTHROPIC_API_KEY      enables LLM trip naming; falls back to region name
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
import {
  aspectClass,
  centroid,
  classifyTier,
  clusterTrips,
  daysBetween,
  medianTakenAt,
  monthAbbrev,
  pickCover,
} from "./lib/trip-clustering.mjs";
import { initGeocodeCache, reverseGeocode } from "./lib/geocode.mjs";
import { initTripNameCache, nameTrip } from "./lib/llm-trip-name.mjs";

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

const cacheDir = join(__dirname, ".cache");
initGeocodeCache(join(cacheDir, "geocode.json"));
initTripNameCache(join(cacheDir, "trip-names.json"));

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

const RAW_EXTENSIONS = new Set([
  "cr2", "cr3", "nef", "arw", "dng", "raf", "orf", "rw2", "pef", "srw", "x3f",
]);

function isRawAsset(asset) {
  const ext = (asset.originalFileName || "").split(".").pop()?.toLowerCase();
  if (ext && RAW_EXTENSIONS.has(ext)) return true;
  const mime = (asset.originalMimeType || "").toLowerCase();
  return mime.startsWith("image/x-");
}

console.log(`fetching album ${IMMICH_ALBUM_ID}`);
const album = await fetchAlbum();
const allImages = (album.assets || []).filter(
  (a) => String(a.type).toUpperCase() === "IMAGE",
);
const albumAssets = allImages.filter((a) => !isRawAsset(a));
const skippedRaw = allImages.length - albumAssets.length;
console.log(
  `  album "${album.albumName}" → ${albumAssets.length} image assets` +
    (skippedRaw ? ` (skipped ${skippedRaw} RAW)` : ""),
);

let existingR2 = new Set();
if (!DRY_RUN) {
  existingR2 = listR2Files(R2_PHOTOS_REMOTE, "photos/");
  console.log(`  ${existingR2.size} existing photos in R2`);
}

// Build the raw photo list — same fields as before, plus aspect bucket and a
// tripId/title/region/year that we'll fill in after clustering.
const rawPhotos = [];
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
  const lat = asset.exifInfo?.latitude ?? asset.latitude ?? null;
  const lng = asset.exifInfo?.longitude ?? asset.longitude ?? null;

  rawPhotos.push({
    id: asset.id,
    url: `${PUBLIC_PHOTOS}/${filename}`,
    caption: captionFor(asset),
    width,
    height,
    takenAt,
    year: takenAt ? new Date(takenAt).getUTCFullYear() : null,
    lat,
    lng,
    aspect: aspectClass({ width, height }),
    originalFileName: asset.originalFileName || null,
  });
}

// Photos without takenAt can't cluster — drop them from trip clustering but
// keep them visible in a synthetic "Undated" trip if there are any.
const datedPhotos = rawPhotos.filter((p) => p.takenAt);
const undatedPhotos = rawPhotos.filter((p) => !p.takenAt);
if (undatedPhotos.length) {
  console.warn(
    `  ${undatedPhotos.length} photo(s) have no takenAt — dropping from trip clustering`,
  );
}

console.log(`clustering ${datedPhotos.length} photos into trips`);
const rawClusters = clusterTrips(datedPhotos, { dayGap: 5, distKm: 50 });
console.log(`  ${rawClusters.length} trips`);

const trips = [];
for (const cluster of rawClusters) {
  // Sort photos within trip desc so the JSON is reader-friendly.
  const photos = [...cluster.photos].sort(
    (a, b) => Date.parse(b.takenAt) - Date.parse(a.takenAt),
  );
  const cover = pickCover(photos);
  const startDate = new Date(
    Math.min(...photos.map((p) => Date.parse(p.takenAt))),
  ).toISOString();
  const endDate = new Date(
    Math.max(...photos.map((p) => Date.parse(p.takenAt))),
  ).toISOString();
  const c = centroid(photos);
  const median = medianTakenAt(photos);
  const year = median ? new Date(median).getUTCFullYear() : null;
  const month = median ? monthAbbrev(median) : null;
  const days = daysBetween(startDate, endDate);

  // Stable trip ID — month + rounded centroid (or "nogps").
  const idLat = c.lat != null ? Math.round(c.lat) : null;
  const idLng = c.lng != null ? Math.round(c.lng) : null;
  const geoTag =
    idLat != null && idLng != null ? `${idLat}_${idLng}` : "nogps";
  const yyyymm = `${year}-${String(new Date(median).getUTCMonth() + 1).padStart(2, "0")}`;
  const id = `trip-${yyyymm}-${geoTag}`;

  // Reverse-geocode (cached, rate-limited).
  let region = null;
  if (c.lat != null && c.lng != null) {
    const r = await reverseGeocode({ lat: c.lat, lng: c.lng });
    region = r.region;
  }

  // LLM-name (cached by trip ID).
  const sampleFilenames = photos
    .slice(0, 8)
    .map((p) => p.originalFileName)
    .filter(Boolean);
  const title = await nameTrip({
    tripId: id,
    region,
    startDate,
    endDate,
    lat: c.lat,
    lng: c.lng,
    sampleFilenames,
  });

  const trip = {
    id,
    title,
    region,
    cover: {
      id: cover.id,
      url: cover.url,
      width: cover.width,
      height: cover.height,
      aspect: cover.aspect,
    },
    photos: photos.map((p) => ({
      id: p.id,
      url: p.url,
      caption: p.caption,
      width: p.width,
      height: p.height,
      takenAt: p.takenAt,
      lat: p.lat,
      lng: p.lng,
      aspect: p.aspect,
    })),
    count: photos.length,
    year,
    month,
    startDate,
    endDate,
    days,
    lat: c.lat,
    lng: c.lng,
    tier: null, // filled below
  };
  trip.tier = classifyTier(trip);
  trips.push(trip);
}

// Sort trips desc by endDate so trips[0] is the most-recent.
trips.sort((a, b) => Date.parse(b.endDate) - Date.parse(a.endDate));

// Flat denormalized photo list for the lightbox / counters.
const flatPhotos = trips.flatMap((t) =>
  t.photos.map((p) => ({
    ...p,
    tripId: t.id,
    tripTitle: t.title,
    region: t.region,
    year: t.year,
  })),
);

if (!DRY_RUN) {
  const validIds = new Set(rawPhotos.map((p) => `${p.id}.jpg`));
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
const newJson =
  JSON.stringify({ trips, photos: flatPhotos }, null, 2) + "\n";
const existingJson = existsSync(outPath) ? readFileSync(outPath, "utf-8") : "";

if (newJson !== existingJson) {
  writeFileSync(outPath, newJson);
  console.log(
    `wrote ${trips.length} trips / ${flatPhotos.length} photos to src/data/photos.json`,
  );
} else {
  console.log("no changes to photos.json");
}

if (DRY_RUN) {
  console.log("dry-run: skipping git");
  process.exit(0);
}

commitAndPush({
  paths: ["src/data/photos.json"],
  message: `sync photos: ${trips.length} trips, ${flatPhotos.length} photos`,
  botName: BOT_NAME,
  botEmail: BOT_EMAIL,
  branch: BRANCH,
  noPush: NO_PUSH,
  cwd: repoRoot,
});

await pingKuma("KUMA_PUSH_SYNC_PHOTOS");

console.log("done");
