import { useState } from "react";
import Container from "@/components/container";
import Head from "next/head";
import Header from "@/components/header";
import Layout from "@/components/layout";
import BookList from "@/components/book-list";
import { supabase } from "@/lib/supabase";
import Select from "react-select";

export async function getStaticProps() {
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching books:', error);
    return {
      props: {
        books: [],
        error: error.message,
      },
      revalidate: 60,
    };
  }

  return {
    props: {
      books,
      error: null,
    },
    revalidate: 60,
  };
}

export default function Books({ books: initialBooks, error: initialError }) {
  const [books, setBooks] = useState(initialBooks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [sortBy, setSortBy] = useState({ label: "Highest Rated", value: "rating" });

  const sortOptions = [
    { label: "Highest Rated", value: "rating" },
    { label: "Recently Read", value: "date_completed" },
    { label: "Title (A-Z)", value: "title" },
  ];

  const handleSort = async (selectedOption) => {
    setLoading(true);
    setSortBy(selectedOption);
    
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order(selectedOption.value, { ascending: selectedOption.value === 'title' });

    if (error) {
      console.error('Error sorting books:', error);
      setError(error.message);
    } else {
      setBooks(data);
      setError(null);
    }
    
    setLoading(false);
  };

  return (
    <Layout>
      <Container>
        <Head>
          <title>Bookshelf | Clay Coffman</title>
        </Head>
        <Header />
        
        <div className="mt-16 mb-8">
          <h1 className="font-title text-4xl md:text-6xl font-bold tracking-tighter leading-tight mb-8">
            Bookshelf
          </h1>
          
          <p className="font-body text-sm md:text-xl md:text-left mb-8">
            Inspired by{" "}
            <a
              href="https://patrickcollison.com/bookshelf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Patrick Collison's bookshelf
            </a>
            {", "}
            this is a pretty accurate digital representation of the physical
            books on my bookshelves right now. The stars indicate how I felt
            about a book. You can filter using the drop-down. Using{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Supabase
            </a>{" "}
            for a backend.
          </p>

          <div className="flex font-body pb-4">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={handleSort}
              isDisabled={loading}
              className="w-48"
              classNamePrefix="select"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded mb-8">
            Error loading books: {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-pulse text-gray-600">Loading books...</div>
          </div>
        ) : (
          <BookList books={books} />
        )}
      </Container>
    </Layout>
  );
}
