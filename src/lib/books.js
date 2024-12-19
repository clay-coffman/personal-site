import { supabase } from './supabase';

/**
 * Fetches all books from the database
 * @param {string} sort - Field to sort by ('rating', 'title', or 'date_completed')
 * @returns {Promise<Array>} Array of books
 */
export async function getBooks(sort = 'rating') {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order(sort, { ascending: sort === 'title' });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

/**
 * Adds a new book to the database
 * @param {Object} book - Book object to add
 * @returns {Promise<Object|null>} Added book or null if error
 */
export async function addBook(book) {
  try {
    const { data, error } = await supabase
      .from('books')
      .insert([book])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error adding book:', error);
    return null;
  }
}

/**
 * Updates an existing book
 * @param {string|number} id - Book ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object|null>} Updated book or null if error
 */
export async function updateBook(id, updates) {
  try {
    const { data, error } = await supabase
      .from('books')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error updating book:', error);
    return null;
  }
}

/**
 * Deletes a book from the database
 * @param {string|number} id - Book ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteBook(id) {
  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting book:', error);
    return false;
  }
}
