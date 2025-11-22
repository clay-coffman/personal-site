// Script to export books from Supabase to JSON
// Run from the root Next.js project: node flask-app/migrations/export_supabase_books.js

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from the Next.js project
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function exportBooks() {
    try {
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching books:', error);
            return;
        }

        const outputPath = path.join(__dirname, 'books_export.json');
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

        console.log(`Successfully exported ${data.length} books to ${outputPath}`);
    } catch (error) {
        console.error('Export failed:', error);
    }
}

exportBooks();