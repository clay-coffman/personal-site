import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import payload from 'payload';
import path from 'path';
import { config } from 'dotenv';
import express from 'express';
import { User } from '../payload-types';

config();

async function importBooks() {
  try {
    const app = express();
    
    console.log('Initializing Payload...');
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
      mongoURL: process.env.MONGODB_URI || 'mongodb://localhost/books-cms',
      express: app,
    });

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error('Admin credentials not found in environment variables');
    }

    // Create an admin user if it doesn't exist
    let adminUser: User | null = null;
    try {
      const response = await payload.login({
        collection: 'users',
        data: {
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
        },
      });
      adminUser = response.user;
    } catch (error) {
      console.error('Failed to login with admin credentials:', error);
      process.exit(1);
    }

    if (!adminUser) {
      throw new Error('Failed to create or login admin user');
    }

    const parser = parse({
      columns: (headers) => {
        console.log('Original headers:', headers);
        // Convert headers to clean format
        return headers.map((header: string) => {
          const cleaned = header.trim().replace(/['"]/g, '');
          console.log(`Mapping header: ${header} -> ${cleaned}`);
          return cleaned;
        });
      },
      skip_empty_lines: true,
      trim: true,
    });

    const csvPath = path.resolve(__dirname, '../../data/books.csv');
    console.log('Reading CSV from:', csvPath);
    
    let totalBooks = 0;

    createReadStream(csvPath)
      .pipe(parser)
      .on('data', async (row: any) => {
        try {
          console.log('Raw row:', row);
          
          const title = row.Title?.trim();
          
          if (!title) {
            console.log('Row keys:', Object.keys(row));
            console.log('Skipping row due to missing title:', row);
            return;
          }

          const bookData = {
            title: title,
            author: row.Author?.trim() || 'Unknown Author',
            rating: parseInt(row.Rating) || 3,
            dateCompleted: row['Date Completed'] ? new Date(row['Date Completed']).toISOString() : new Date().toISOString(),
            coverImage: row['Cover Image']?.trim() || 'https://via.placeholder.com/150',
            genre: 'fiction' as const
          };
          
          console.log('Attempting to create book:', bookData);
          
          try {
            const createdBook = await payload.create({
              collection: 'books',
              data: bookData,
              user: adminUser,
            });
            
            totalBooks++;
            console.log(`Successfully imported book: ${bookData.title}`);
            console.log('Created book:', createdBook);
          } catch (createError: any) {
            console.error('Failed to create book:', {
              error: createError.message,
              data: createError.data,
              bookData,
            });
          }
        } catch (error) {
          console.error('Failed to process row:', error);
        }
      })
      .on('end', () => {
        console.log(`Import completed. Total books imported: ${totalBooks}`);
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
      });
  } catch (error) {
    console.error('Failed to initialize:', error);
    process.exit(1);
  }
}

importBooks();