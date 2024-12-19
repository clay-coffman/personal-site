import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
  cover_image?: string;
  date_completed?: string;
  currently_reading: boolean;
  genre?: string;
  topic?: string;
  created_at: string;
}

// Admin functions
export async function importBooksFromCSV(books: Omit<Book, 'id'>[]) {
  const { data, error } = await supabase
    .from('books')
    .insert(books)
    .select();

  if (error) throw error;
  return data;
}

// Client functions
export async function getBooks(sort: 'rating' | 'date_completed' | 'title' = 'rating') {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order(sort, { ascending: sort === 'title' });

  if (error) throw error;
  return data as Book[];
}

export async function getBook(id: number) {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Book;
}

export async function updateBook(id: number, book: Partial<Book>) {
  const { data, error } = await supabase
    .from('books')
    .update(book)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0] as Book;
}

export async function deleteBook(id: number) {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
