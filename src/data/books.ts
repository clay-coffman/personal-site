import booksData from "./books.json";

export interface Book {
  id: number;
  title: string;
  slug: string | null;
  author: string;
  authorSort: string;
  tags: string[];
  coverUrl: string | null;
}

export const books: Book[] = booksData as Book[];
