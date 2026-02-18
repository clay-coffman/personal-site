import Database from "better-sqlite3";
import { existsSync } from "fs";
import { join } from "path";
import { getEnv } from "./env.server";

export interface CalibreBook {
  id: number;
  title: string;
  author: string;
  authorSort: string;
  path: string;
  hasCover: boolean;
  tags: string[];
}

function getCalibrePaths() {
  const library = getEnv().CALIBRE_LIBRARY;
  const db = join(library, "metadata.db");
  return { library, db };
}

export function getFavoriteBooks(): CalibreBook[] {
  const { db } = getCalibrePaths();

  if (!existsSync(db)) {
    return [];
  }

  const conn = new Database(db, { readonly: true, fileMustExist: true });

  const query = `
    SELECT
      b.id,
      b.title,
      b.author_sort,
      b.path,
      b.has_cover,
      GROUP_CONCAT(DISTINCT a.name) as authors,
      GROUP_CONCAT(DISTINCT t.name) as tags
    FROM books b
    JOIN books_ratings_link br ON b.id = br.book
    JOIN ratings r ON br.rating = r.id
    LEFT JOIN books_authors_link ba ON b.id = ba.book
    LEFT JOIN authors a ON ba.author = a.id
    LEFT JOIN books_tags_link bt ON b.id = bt.book
    LEFT JOIN tags t ON bt.tag = t.id
    WHERE r.rating = 10
    GROUP BY b.id
    ORDER BY b.author_sort ASC
  `;

  const rows = conn.prepare(query).all() as Array<{
    id: number;
    title: string;
    author_sort: string;
    path: string;
    has_cover: number;
    authors: string | null;
    tags: string | null;
  }>;

  conn.close();

  const { library } = getCalibrePaths();

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    author: row.authors
      ? formatAuthors(row.authors)
      : parseAuthorSort(row.author_sort),
    authorSort: row.author_sort,
    path: row.path,
    hasCover:
      Boolean(row.has_cover) &&
      existsSync(join(library, row.path, "cover.jpg")),
    tags: row.tags ? row.tags.split(",") : [],
  }));
}

function formatAuthors(authors: string): string {
  return authors
    .split(",")
    .map((a) => a.trim())
    .map((a) => a.replace(/\s*\([^)]*\)/, ""))
    .join(", ");
}

export function parseAuthorSort(authorSort: string): string {
  if (!authorSort) return "";
  if (authorSort.includes(", ")) {
    const parts = authorSort.split(", ", 2);
    return `${parts[1]} ${parts[0]}`;
  }
  return authorSort;
}

export function getCoverPath(bookId: number): string | null {
  const { library, db } = getCalibrePaths();

  if (!existsSync(db)) {
    return null;
  }

  const conn = new Database(db, { readonly: true, fileMustExist: true });

  const row = conn
    .prepare("SELECT path, has_cover FROM books WHERE id = ?")
    .get(bookId) as { path: string; has_cover: number } | undefined;

  conn.close();

  if (!row || !row.has_cover) {
    return null;
  }

  const coverPath = join(library, row.path, "cover.jpg");
  if (existsSync(coverPath)) {
    return coverPath;
  }

  return null;
}
