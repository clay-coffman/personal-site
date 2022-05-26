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
          <p className="font-body md:text-xl md:text-left mb-4">
            These are some of my favorite book highlights (synced over using the{" "}
            <span className="hover:text-blue-600">
              <a href="https://readwise.io/">Readwise API</a>
            </span>
            . This isn't necessarily a comprehensive list of every book I've
            read since I don't highlight everything (and I haven't had a Kindle
            that long).{" "}
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
