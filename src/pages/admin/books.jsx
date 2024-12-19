import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import Container from '@/components/container';
import Head from 'next/head';
import ProtectedRoute from '@/components/protected-route';
import { useAuth } from '@/lib/auth';
import { getBooks, addBook, deleteBook } from '@/lib/books';

export async function getStaticProps() {
  const books = await getBooks();
  return {
    props: {
      books,
    },
    revalidate: 60,
  };
}

export default function AdminBooks({ books: initialBooks }) {
  const [books, setBooks] = useState(initialBooks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signOut } = useAuth();
  const router = useRouter();

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    rating: 5,
    date_completed: '',
    cover_image: '',
  });

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const book = await addBook(newBook);
      if (book) {
        setBooks([...books, book]);
        setNewBook({
          title: '',
          author: '',
          rating: 5,
          date_completed: '',
          cover_image: '',
        });
        router.replace(router.asPath);
      }
    } catch (err) {
      setError('Failed to add book');
      console.error(err);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    setLoading(true);
    setError(null);

    try {
      const success = await deleteBook(id);
      if (success) {
        setBooks(books.filter((book) => book.id !== id));
      }
    } catch (err) {
      setError('Failed to delete book');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>Manage Books | Clay Coffman</title>
        </Head>
        <Container>
          <div className="py-10">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Manage Books</h1>
              <button
                onClick={handleSignOut}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded mb-4">
                {error}
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Book Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      required
                      value={newBook.title}
                      onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                      className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter book title"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                      Author
                    </label>
                    <input
                      id="author"
                      type="text"
                      required
                      value={newBook.author}
                      onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                      className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter author name"
                    />
                  </div>

                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                      Rating (1-5 stars)
                    </label>
                    <input
                      id="rating"
                      type="number"
                      required
                      min="1"
                      max="5"
                      value={newBook.rating}
                      onChange={(e) => setNewBook({ ...newBook, rating: parseInt(e.target.value) })}
                      className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="date_completed" className="block text-sm font-medium text-gray-700 mb-1">
                      Date Completed
                    </label>
                    <input
                      id="date_completed"
                      type="date"
                      required
                      value={newBook.date_completed}
                      onChange={(e) => setNewBook({ ...newBook, date_completed: e.target.value })}
                      className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Image URL
                    </label>
                    <input
                      id="cover_image"
                      type="url"
                      value={newBook.cover_image}
                      onChange={(e) => setNewBook({ ...newBook, cover_image: e.target.value })}
                      className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/book-cover.jpg"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                  >
                    {loading ? 'Adding Book...' : 'Add Book'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Current Books</h2>
              <div className="space-y-4">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-medium">{book.title}</h3>
                      <p className="text-gray-600 text-sm">{book.author}</p>
                      <p className="text-yellow-500 text-sm">{'★'.repeat(book.rating)}{'☆'.repeat(5-book.rating)}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(book.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
}
