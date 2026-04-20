import highlightsData from "./highlights.json";

export interface Highlight {
  id: number;
  text: string;
  note: string | null;
  bookTitle: string;
  bookAuthor: string;
  category: string;
  sourceUrl: string | null;
  highlightedAt: string;
  tags: string[];
  readwiseUrl: string;
}

export const highlights: Highlight[] = highlightsData as Highlight[];
