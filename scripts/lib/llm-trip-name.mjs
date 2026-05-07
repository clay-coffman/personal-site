// Generate a short, place-evocative trip title via Anthropic Claude Haiku.
// Cached on disk by trip ID so re-runs never re-name an existing trip.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5";

let cachePath = null;
let cache = null;

export function initTripNameCache(path) {
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

function fallbackTitle({ region, startDate }) {
  if (region) return region;
  if (startDate) {
    const d = new Date(startDate);
    return d.toLocaleString("en-US", { month: "long", year: "numeric" });
  }
  return "Untitled Trip";
}

export async function nameTrip({
  tripId,
  region,
  startDate,
  endDate,
  lat,
  lng,
  sampleFilenames = [],
}) {
  if (cache == null) {
    throw new Error(
      "trip-name cache not initialized — call initTripNameCache()",
    );
  }
  if (cache[tripId]) return cache[tripId];

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn(
      `  ANTHROPIC_API_KEY missing; using fallback title for ${tripId}`,
    );
    cache[tripId] = fallbackTitle({ region, startDate });
    persist();
    return cache[tripId];
  }

  const prompt = [
    `Region: ${region || "unknown"}`,
    `Date range: ${startDate} to ${endDate}`,
    lat != null && lng != null
      ? `Centroid: ${lat.toFixed(2)}, ${lng.toFixed(2)}`
      : "Centroid: unknown",
    sampleFilenames.length
      ? `Sample filenames: ${sampleFilenames.slice(0, 8).join(", ")}`
      : "",
    "",
    "Give this photo trip a short title that evokes the place — max 3 words, title case.",
    "Prefer the specific landscape, range, town, or park (e.g. 'Wind River Range', 'Banff', 'Big Sur') over generic phrases like 'Photo Trip' or 'September 2024'.",
    "Reply with only the title, no quotes, no punctuation.",
  ]
    .filter(Boolean)
    .join("\n");

  let title;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 32,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) {
      console.warn(
        `  anthropic ${res.status} for ${tripId}; using fallback title`,
      );
      title = fallbackTitle({ region, startDate });
    } else {
      const json = await res.json();
      const raw = json?.content?.[0]?.text?.trim();
      title = raw ? raw.replace(/^["']|["']$/g, "").trim() : null;
      if (!title) title = fallbackTitle({ region, startDate });
    }
  } catch (err) {
    console.warn(
      `  anthropic call failed for ${tripId}: ${err.message}; using fallback`,
    );
    title = fallbackTitle({ region, startDate });
  }

  cache[tripId] = title;
  persist();
  return title;
}
