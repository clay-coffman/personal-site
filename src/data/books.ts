import booksData from "./books.json";

export interface Book {
  id: number;
  title: string;
  author: string;
  authorSort: string;
  tags: string[];
  coverUrl: string | null;
}

export const books: Book[] = booksData as Book[];
