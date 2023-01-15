import React from "react";
import BookCard from "@/components/book-card";

export default function BookList({ books }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {books.map((book) => (
          <BookCard
            key={book.id}
            title={book.fields["Title"]}
            id={book.id}
            author={book.fields["Author"]}
            cover_image_url={book.fields["Cover Image"]}
            rating={book.fields["Rating"]}
          />
        ))}
      </div>
    </>
  );
}
