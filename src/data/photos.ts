import photosData from "./photos.json";

export interface Photo {
  id: string;
  url: string;
  caption: string;
  width: number;
  height: number;
  takenAt: string | null;
  year: number | null;
  latitude?: number;
  longitude?: number;
}

export const photos: Photo[] = photosData as Photo[];
