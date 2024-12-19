import BookCard from "./book-card";

export default function BookList({ books }) {
  if (!books || books.length === 0) {
    return (
      <div className="text-center text-gray-600 py-10">
        No books found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {books.map((book) => (
        <BookCard
          key={book.id}
          title={book.title}
          author={book.author}
          rating={book.rating}
          coverImage={book.cover_image}
          dateCompleted={book.date_completed}
        />
      ))}
    </div>
  );
}
