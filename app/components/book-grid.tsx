import { BookCard } from "./book-card";
import type { CalibreBook } from "~/lib/calibre.server";

export function BookGrid({ books }: { books: CalibreBook[] }) {
  if (books.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted">No books found. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
