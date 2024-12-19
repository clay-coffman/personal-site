import { useState, useEffect } from "react";
import React from "react";
import Select from "react-select";

import Container from "@/components/container";
import Head from "next/head";
import Header from "@/components/header";
import Layout from "@/components/layout";
import BookList from "@/components/book-list";
import { getBooks } from "@/lib/books";

export async function getServerSideProps() {
  // this sets the INITIAL state
  const books = await getBooks();

  return { props: { books } };
}

export default function Books({ books }) {
  // get books
  const [data, setData] = useState(books);
  // selected is the current sort option
  const [sortBy, setSortBy] = useState("Rating");

  // called when select input is changed
  const handleChange = (selectedOption) => {
    const value = selectedOption.value;
    // get sortBy param value from
    setSortBy(value);
  };

  // this updates on initial render
  useEffect(() => {
    const sortArray = (type) => {
      const sorted = [...data].sort((a, b) => {
        if (type === "Rating") {
          return b.fields.Rating - a.fields.Rating;
        } else if (type === "Date Completed") {
          return new Date(b.fields["Date Completed"]) - new Date(a.fields["Date Completed"]);
        } else {
          return a.fields.Title.localeCompare(b.fields.Title);
        }
      });
      return sorted;
    };

    const sortedBooks = sortArray(sortBy);
    setData(sortedBooks);
  }, [sortBy, data]);

  // sort options (passed to select component)
  const sort_options = [
    { label: "Highest Rated", value: "Rating" },
    { label: "Recently Read", value: "Date Completed" },
    { label: "Title (A-Z)", value: "Title" },
  ];

  return (
    <>
      <main>
        <Layout>
          <Container>
            <Head>
              <title>Bookshelf</title>
            </Head>
            <Header />
            <p className="font-body text-sm md:text-xl md:text-left mb-4">
              Inspired by{" "}
              <span className="text-blue-600">
                <a
                  href="https://patrickcollison.com/bookshelf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Patrick Collisons bookshelf
                </a>
              </span>
              {", "}
              this is a pretty accurate digital representation of the physical
              books on my bookshelves right now. The stars indicate how I felt
              about a book. You can filter using the drop-down. Using{" "}
              <span className="text-blue-600">
                <a
                  href="https://payloadcms.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Payload CMS
                </a>
              </span>{" "}
              for a backend.
            </p>
            <div className="flex font-body pb-4">
              <Select options={sort_options} onChange={handleChange} />
            </div>
            <BookList books={data} />
          </Container>
        </Layout>
      </main>
    </>
  );
}
