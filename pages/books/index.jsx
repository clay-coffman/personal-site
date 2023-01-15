import { useState, useEffect } from "react";
import React from "react";
import Head from "next/head";
import Header from "@/components/header";
import Container from "@/components/container";
import Layout from "@/components/layout";
import BookList from "@/components/book-list";
import { getBooks } from "@/lib/airtable";

// something to fix an error in react select due to ssr?
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), {
  ssr: false,
});

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

  // useEffect = Componnetdidmount - runs after render
  // this updates on initial render
  useEffect(() => {
    // sorts books by sortBy from state
    const sortArray = (property) => {
      let sorted = [];
      console.log(`sort by ${property}`);
      // check the property here and use correct sort function
      switch (property) {
        case "Rating":
          // TODO at some point, handle when a book doesn't have a rating (lol)
          // right now, it just breaks and doesn't work at all...
          sorted = [...data].sort(
            (a, b) => b.fields[property] - a.fields[property]
          );
          break;
        case "Title":
          sorted = [...data].sort((a, b) =>
            a.fields[property].localeCompare(b.fields[property])
          );
          break;
        case "Date Completed":
          sorted = [...data].sort((a, b) => {
            const dateA = Date.parse(a.fields[property]);
            const dateB = Date.parse(b.fields[property]);
            return dateB - dateA;
          });
          break;
        default:
          sorted = data;
      }
      console.log(sorted);
      return sorted;
    };

    const sortedBooks = sortArray(sortBy);
    setData(sortedBooks);
  }, [data, sortBy]);

  // sort options (passed to select component)
  const sort_options = [
    { label: "Highest Rated", value: "Rating" },
    { label: "Recently Read", value: "Date Completed" },
    { label: "Title (A-Z)", value: "Title" },
  ];

  return (
    <>
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
                href="https://airtable.com/shrbhyeOxYShcdgCU/tblFKk2Z5THzqPENb"
                target="_blank"
                rel="noopener noreferrer"
              >
                Airtable
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
    </>
  );
}
