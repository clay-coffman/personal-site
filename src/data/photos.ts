import photosData from "./photos.json";

export type AspectKind =
  | "ultrawide"
  | "wide"
  | "landscape"
  | "square"
  | "portrait"
  | "tall";

export interface AspectInfo {
  ratio: string;
  kind: AspectKind;
}

export interface Photo {
  id: string;
  url: string;
  caption: string | null;
  width: number;
  height: number;
  takenAt: string | null;
  lat: number | null;
  lng: number | null;
  aspect: AspectInfo;
  tripId: string;
  tripTitle: string;
  region: string | null;
  year: number | null;
}

export interface TripPhoto {
  id: string;
  url: string;
  caption: string | null;
  width: number;
  height: number;
  takenAt: string;
  lat: number | null;
  lng: number | null;
  aspect: AspectInfo;
}

export interface Trip {
  id: string;
  title: string;
  region: string | null;
  cover: {
    id: string;
    url: string;
    width: number;
    height: number;
    aspect: AspectInfo;
  };
  photos: TripPhoto[];
  count: number;
  year: number | null;
  month: string | null;
  startDate: string;
  endDate: string;
  days: number;
  lat: number | null;
  lng: number | null;
  tier: "featured" | "standard" | "compact";
}

interface PhotosFile {
  trips: Trip[];
  photos: Photo[];
}

const data = photosData as unknown as PhotosFile | Photo[];

// Tolerate the legacy flat-array shape until the next sync runs. Once a
// trip-shaped JSON is written, this branch is dead.
function normalize(): PhotosFile {
  if (Array.isArray(data)) return { trips: [], photos: [] };
  return data;
}

const file = normalize();

export const trips: Trip[] = file.trips;
export const photos: Photo[] = file.photos;
