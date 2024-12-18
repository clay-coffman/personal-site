import payload from 'payload';
import { config } from 'dotenv';
import express from 'express';

config();

async function cleanupDuplicates() {
  try {
    const app = express();
    
    console.log('Initializing Payload...');
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
      mongoURL: process.env.MONGODB_URI || 'mongodb://localhost/books-cms',
      express: app,
    });

    // Get all books
    const books = await payload.find({
      collection: 'books',
      limit: 1000,
    });

    console.log(`Found ${books.docs.length} total books`);

    // Create a map to track unique books by title
    const uniqueBooks = new Map();

    // Keep the newer version of each book
    books.docs.forEach(book => {
      const existing = uniqueBooks.get(book.title);
      if (!existing || new Date(book.createdAt) > new Date(existing.createdAt)) {
        uniqueBooks.set(book.title, book);
      }
    });

    console.log(`Found ${uniqueBooks.size} unique books`);

    // Delete all books first
    console.log('Deleting all books...');
    for (const book of books.docs) {
      await payload.delete({
        collection: 'books',
        id: book.id,
      });
    }

    // Re-create only the unique books
    console.log('Re-creating unique books...');
    for (const book of uniqueBooks.values()) {
      const { id, createdAt, updatedAt, url, filename, mimeType, filesize, width, height, sizes, ...bookData } = book;
      await payload.create({
        collection: 'books',
        data: {
          ...bookData,
          coverImage: null, // Set coverImage to null for now
        },
      });
      console.log(`Re-created book: ${book.title}`);
    }

    console.log('Successfully cleaned up duplicate books');
    process.exit(0);
  } catch (error) {
    console.error('Failed to clean up duplicates:', error);
    process.exit(1);
  }
}

cleanupDuplicates();
