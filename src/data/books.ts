import booksData from "./books.json";

export interface Book {
  id: number;
  title: string;
  author: string;
  authorSort: string;
  tags: string[];
  hasCover: boolean;
}

export const books: Book[] = booksData as Book[];
