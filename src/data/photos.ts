export interface Photo {
  caption: string;
  aspect: string;
  tint: string;
  location?: string;
  year?: number;
}

/**
 * Placeholder photo data. Rendered as tinted gradient tiles until real
 * images (and Immich integration with map + geoloc) land.
 */
export const photos: Photo[] = [
  { caption: "Wasatch, first snow", aspect: "4/5", tint: "#c2410c", location: "Utah", year: 2026 },
  { caption: "Sugar House, late afternoon", aspect: "3/2", tint: "#9a3412", location: "Salt Lake City", year: 2026 },
  { caption: "I-80, westbound", aspect: "3/4", tint: "#7c2d12", location: "Utah", year: 2025 },
  { caption: "Antelope Island, eastside", aspect: "1/1", tint: "#c2410c", location: "Utah", year: 2025 },
  { caption: "Little Cottonwood", aspect: "4/3", tint: "#9a3412", location: "Utah", year: 2025 },
  { caption: "Downtown, State & 200", aspect: "2/3", tint: "#7c2d12", location: "Salt Lake City", year: 2025 },
];
