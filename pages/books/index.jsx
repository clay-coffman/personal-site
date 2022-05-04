import Head from "next/head";
import Header from "@/components/header";
import Container from "@/components/container";
import Layout from "@/components/layout";
import { getBooks } from "../../lib/readwise";
import BookCard from "@/components/book-card";

export async function getStaticProps() {
  const books = await getBooks();

  return { props: { books } };
}

export default function BookList({ books }) {
  return (
    <>
      <Layout>
        <Container>
          <Head>
            <title>Books</title>
          </Head>
          <Header />
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
            These are books that I have read.
          </h1>
          <p className="md:text-xl md:text-left mb-4">
            They are synced over from Readwise using their API. You should be
            able to view all of my highlights by clicking on a book.
          </p>
          <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {books.map((book) => (
              <BookCard
                key={book.id}
                title={book.title}
                id={book.id}
                author={book.author}
                cover_image_url={book.cover_image_url}
                highlights_url={book.highlights_url}
              />
            ))}
          </div>
        </Container>
      </Layout>
    </>
  );
}
