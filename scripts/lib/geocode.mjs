// Reverse-geocode a lat/lng to a region name via Nominatim (free, OSM).
// Cached on disk between runs so we don't hammer the public endpoint, and
// rate-limited to one request every ~1.1s per Nominatim's TOS.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/reverse";
const USER_AGENT = "about-clay-site-sync/1.0 (clay@about-clay.com)";
const MIN_GAP_MS = 1100;

let cachePath = null;
let cache = null;
let lastCall = 0;

export function initGeocodeCache(path) {
  cachePath = path;
  if (existsSync(path)) {
    try {
      cache = JSON.parse(readFileSync(path, "utf-8"));
    } catch {
      cache = {};
    }
  } else {
    cache = {};
  }
}

function persist() {
  if (!cachePath) return;
  mkdirSync(dirname(cachePath), { recursive: true });
  writeFileSync(cachePath, JSON.stringify(cache, null, 2) + "\n");
}

function bucketKey(lat, lng) {
  // ~11 km buckets — collapses repeat trips to the same place.
  return `${lat.toFixed(1)},${lng.toFixed(1)}`;
}

async function gate() {
  const now = Date.now();
  const wait = MIN_GAP_MS - (now - lastCall);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall = Date.now();
}

function regionFromAddress(addr) {
  if (!addr) return null;
  // US/CA/AU/etc. prefer state. Otherwise prefer country.
  const cc = (addr.country_code || "").toLowerCase();
  if (["us", "ca", "au"].includes(cc) && addr.state) return addr.state;
  if (addr.state && addr.country) return addr.state;
  return addr.country || addr.state || null;
}

export async function reverseGeocode({ lat, lng }) {
  if (lat == null || lng == null) return { region: null };
  if (cache == null) {
    throw new Error("geocode cache not initialized — call initGeocodeCache()");
  }
  const key = bucketKey(lat, lng);
  if (key in cache) return cache[key];

  await gate();
  const url = `${NOMINATIM_BASE}?lat=${lat}&lon=${lng}&format=json&zoom=6&addressdetails=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });
  if (!res.ok) {
    console.warn(`  nominatim ${res.status} for ${key}; leaving region null`);
    cache[key] = { region: null };
    persist();
    return cache[key];
  }
  const json = await res.json();
  const region = regionFromAddress(json.address);
  cache[key] = { region };
  persist();
  return cache[key];
}
