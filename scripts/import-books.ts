require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync'); 
const { supabase } = require('../src/lib/supabase');

function formatDate(dateStr: string): string | null {
  if (!dateStr || dateStr.trim() === '') return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
}

async function importBooks() {
  const csvPath = path.join(process.cwd(), 'src', 'data', 'books.csv');
  const fileContent = fs.readFileSync(csvPath, { encoding: 'utf-8' });

  // First, clear existing data
  const { error: deleteError } = await supabase
    .from('books')
    .delete()
    .neq('id', 0); // Delete all records

  if (deleteError) {
    console.error('Error clearing existing data:', deleteError);
    return;
  }

  try {
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true, 
    });

    const books = records.map((record: any) => {
      console.log('Processing book:', record.Title); // Debug log
      return {
        title: record.Title?.trim() || '',
        author: record.Author?.trim() || '',
        rating: parseInt(record.Rating) || 0,
        date_completed: formatDate(record['Date Completed']),
        cover_image: record['Cover Image']?.trim() || '',
        currently_reading: record['Currently Reading'] === 'checked',
        genre: record.Genre?.trim() || '',
        topic: record.Topic?.trim() || '',
        notes: record.Notes?.trim() || '',
        date_started: formatDate(record['Date Started']),
      };
    });

    const { data, error: uploadError } = await supabase
      .from('books')
      .insert(books)
      .select();

    if (uploadError) {
      console.error('Error uploading to Supabase:', uploadError);
      return;
    }

    console.log(`Successfully imported ${books.length} books to Supabase!`);
  } catch (error) {
    console.error('Error processing CSV:', error);
  }
}

importBooks();
