// Pure helpers for clustering photos into trips and picking covers/tiers.
// No I/O — safe to call from sync scripts and tests.

const MS_PER_DAY = 86400000;
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export function centroid(photos) {
  const geo = photos.filter((p) => p.lat != null && p.lng != null);
  if (!geo.length) return { lat: null, lng: null };
  const lat = geo.reduce((s, p) => s + p.lat, 0) / geo.length;
  const lng = geo.reduce((s, p) => s + p.lng, 0) / geo.length;
  return { lat, lng };
}

// Walk photos in chronological order. Open a new trip when either:
//   - more than dayGap days passed since the previous photo, OR
//   - the next photo's location is more than distKm from the running centroid
//     (only checked when both ends have GPS).
export function clusterTrips(photos, { dayGap = 5, distKm = 50 } = {}) {
  const sorted = [...photos].sort(
    (a, b) => Date.parse(a.takenAt) - Date.parse(b.takenAt),
  );
  const trips = [];
  let current = null;

  for (const p of sorted) {
    if (!current) {
      current = { photos: [p] };
      trips.push(current);
      continue;
    }
    const last = current.photos[current.photos.length - 1];
    const daysGap =
      (Date.parse(p.takenAt) - Date.parse(last.takenAt)) / MS_PER_DAY;

    let geoBreak = false;
    if (p.lat != null && p.lng != null) {
      const c = centroid(current.photos);
      if (c.lat != null) {
        geoBreak = haversineKm(p, c) > distKm;
      }
    }

    if (daysGap > dayGap || geoBreak) {
      current = { photos: [p] };
      trips.push(current);
    } else {
      current.photos.push(p);
    }
  }
  return trips;
}

// Cover heuristic: prefer landscape, then aspect proximity to 3:2, then pixels.
// Operates on photos with { width, height } — call sites can map their fields.
export function pickCover(photos) {
  const landscapes = photos.filter((p) => p.width >= p.height * 1.2);
  const pool = landscapes.length ? landscapes : photos;
  return [...pool].sort((a, b) => {
    const dA = Math.abs(a.width / a.height - 1.5);
    const dB = Math.abs(b.width / b.height - 1.5);
    if (Math.abs(dA - dB) > 0.1) return dA - dB;
    return b.width * b.height - a.width * a.height;
  })[0];
}

// Map a photo's native aspect to one of six allowed display aspects.
// Returns a CSS aspect-ratio string + a coarse kind label.
export function aspectClass(photo) {
  if (!photo || !photo.width || !photo.height) {
    return { ratio: "3 / 2", kind: "landscape" };
  }
  const r = photo.width / photo.height;
  if (r >= 2.0) return { ratio: "21 / 9", kind: "ultrawide" };
  if (r >= 1.55) return { ratio: "16 / 9", kind: "wide" };
  if (r >= 1.25) return { ratio: "3 / 2", kind: "landscape" };
  if (r >= 0.9) return { ratio: "1 / 1", kind: "square" };
  if (r >= 0.7) return { ratio: "4 / 5", kind: "portrait" };
  return { ratio: "3 / 4", kind: "tall" };
}

// Featured / standard / compact. Auto-demote anything whose cover isn't
// landscape — featured spreads with a square or portrait hero look bad.
export function classifyTier(trip) {
  const cover = trip.cover;
  const coverAspect = cover ? cover.width / cover.height : 0;
  const isLandscape = coverAspect >= 1.25;
  const bigCover = cover && cover.width >= 4000 && isLandscape;
  if (trip.count >= 15 && trip.days >= 3 && bigCover) return "featured";
  if (trip.count <= 5 || trip.days <= 1) return "compact";
  return "standard";
}

export function monthAbbrev(date) {
  return MONTHS[new Date(date).getUTCMonth()];
}

export function daysBetween(start, end) {
  return Math.ceil((Date.parse(end) - Date.parse(start)) / MS_PER_DAY) + 1;
}

// Pick a representative date for the trip — the median photo's takenAt.
export function medianTakenAt(photos) {
  const sorted = [...photos]
    .map((p) => Date.parse(p.takenAt))
    .filter((t) => !Number.isNaN(t))
    .sort((a, b) => a - b);
  if (!sorted.length) return null;
  return new Date(sorted[Math.floor(sorted.length / 2)]).toISOString();
}
