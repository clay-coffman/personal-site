import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import payload from 'payload';
import path from 'path';
import { config } from 'dotenv';
import express from 'express';
import { User } from '../payload-types';

config();

const mapGenre = (rawGenre: string | undefined): string => {
  if (!rawGenre) return 'nonFiction';
  
  const normalized = rawGenre.toLowerCase().trim();
  
  const genreMap: Record<string, string> = {
    'business': 'nonFiction',
    'health & wellness': 'science',
    'health': 'science',
    'wellness': 'science',
    'biography': 'biography',
    'history': 'history',
    'science': 'science',
    'technology': 'technology',
    'fiction': 'fiction',
    'non-fiction': 'nonFiction',
    'nonfiction': 'nonFiction'
  };

  return genreMap[normalized] || 'nonFiction';
};

async function reimportBooks() {
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

    const rows: any[] = [];
    
    await new Promise((resolve, reject) => {
      const parser = parse({
        columns: (headers) => {
          console.log('Original headers:', headers);
          return headers.map((header: string) => {
            const cleaned = header.trim().replace(/['"]/g, '');
            console.log(`Mapping header: ${header} -> ${cleaned}`);
            return cleaned;
          });
        },
        skip_empty_lines: true,
        trim: true,
      });

      createReadStream(path.resolve(__dirname, '../../data/books.csv'))
        .pipe(parser)
        .on('data', (row) => rows.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`Read ${rows.length} rows from CSV`);
    let totalBooks = 0;

    for (const row of rows) {
      try {
        const title = row['Title']?.trim();
        
        if (!title) {
          console.log('Skipping row - no title:', row);
          continue;
        }

        const bookData = {
          title: title,
          author: row['Author']?.trim() || 'Unknown Author',
          rating: parseInt(row['Rating']) || 3,
          dateCompleted: row['Date Completed'] ? new Date(row['Date Completed']).toISOString() : null,
          genre: mapGenre(row['Genre'])
        };

        await payload.create({
          collection: 'books',
          data: bookData,
          user: adminUser,
        });
        
        totalBooks++;
        console.log(`Successfully created book ${totalBooks}: ${bookData.title}`);
      } catch (error) {
        console.error('Error creating book:', error);
      }
    }

    console.log(`Successfully imported ${totalBooks} books`);
    return totalBooks;
  } catch (error) {
    console.error('Failed to initialize:', error);
    throw error;
  }
}

reimportBooks()
  .then((total) => {
    console.log(`Migration completed successfully. Total books imported: ${total}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
