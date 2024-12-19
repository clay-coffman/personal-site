import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import Container from '@/components/container';
import Head from 'next/head';
import ProtectedRoute from '@/components/protected-route';
import { useAuth } from '@/lib/auth';
import { getBooks, addBook, deleteBook, updateBooks } from '@/lib/books';
import Select from 'react-select';

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
  const [pendingUpdates, setPendingUpdates] = useState({});
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
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setLoading(true);
      setError(null);

      try {
        const success = await deleteBook(id);
        if (success) {
          setBooks(books.filter((book) => book.id !== id));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRatingChange = (bookId, newRating) => {
    setPendingUpdates((prev) => ({
      ...prev,
      [bookId]: { ...prev[bookId], rating: newRating },
    }));
  };

  const saveRatingChanges = async () => {
    setLoading(true);
    setError(null);

    try {
      const updates = Object.entries(pendingUpdates).map(([id, updates]) => ({
        id: parseInt(id),
        updates,
      }));

      const success = await updateBooks(updates);
      if (success) {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            pendingUpdates[book.id]
              ? { ...book, ...pendingUpdates[book.id] }
              : book
          )
        );
        setPendingUpdates({});
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ratingOptions = [
    { value: 1, label: '⭐' },
    { value: 2, label: '⭐⭐' },
    { value: 3, label: '⭐⭐⭐' },
    { value: 4, label: '⭐⭐⭐⭐' },
    { value: 5, label: '⭐⭐⭐⭐⭐' },
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>Manage Books</title>
        </Head>
        <Container>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Manage Books</h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Sign Out
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Book Title</label>
                  <input
                    type="text"
                    value={newBook.title}
                    onChange={(e) =>
                      setNewBook({ ...newBook, title: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Enter book title"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Author</label>
                  <input
                    type="text"
                    value={newBook.author}
                    onChange={(e) =>
                      setNewBook({ ...newBook, author: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Enter author name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Rating (1-5 stars)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newBook.rating}
                    onChange={(e) =>
                      setNewBook({ ...newBook, rating: parseInt(e.target.value) })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Date Completed</label>
                  <input
                    type="date"
                    value={newBook.date_completed}
                    onChange={(e) =>
                      setNewBook({ ...newBook, date_completed: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={newBook.cover_image}
                  onChange={(e) =>
                    setNewBook({ ...newBook, cover_image: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="https://example.com/book-cover.jpg"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                Add Book
              </button>
            </form>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Current Books</h2>
              {Object.keys(pendingUpdates).length > 0 && (
                <button
                  onClick={saveRatingChanges}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
                >
                  Save Changes
                </button>
              )}
            </div>
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            <div className="space-y-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="p-4 border rounded flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{book.title}</h3>
                    <p className="text-gray-600">{book.author}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-48">
                      <Select
                        value={ratingOptions.find(
                          (option) =>
                            option.value ===
                            (pendingUpdates[book.id]?.rating ?? book.rating)
                        )}
                        onChange={(option) =>
                          handleRatingChange(book.id, option.value)
                        }
                        options={ratingOptions}
                        isSearchable={false}
                      />
                    </div>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
}
