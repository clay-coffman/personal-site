import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/layout";
import { getBooks } from "../../lib/readwise";

export async function getStaticProps(context) {
  const books = await getBooks();

  return { props: { books } };
}

export default function BookList({ books }) {
  return (
    <Layout>
      <Head>
        <title>Books</title>
      </Head>
      <h2 className="pt-6">
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
      <p className="text-3xl">Books</p>

      <p className="text-base pt-6">These are books I have read</p>
      <br></br>

      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <Link href={`/books/${book.id}`}>
              <a>{book.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
