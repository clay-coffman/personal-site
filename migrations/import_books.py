#!/usr/bin/env python3
"""
Script to import books data into SQLite database
Can import from JSON export or directly from Supabase
"""

import os
import sys
import json
from datetime import datetime

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from extensions import db
from models.book import Book

def import_from_json(json_file):
    """Import books from JSON file"""
    app = create_app()

    with app.app_context():
        # Read JSON file
        with open(json_file, 'r') as f:
            books_data = json.load(f)

        count = 0
        for book_data in books_data:
            # Check if book already exists
            existing = Book.query.filter_by(
                title=book_data.get('title'),
                author=book_data.get('author')
            ).first()

            if existing:
                print(f"Skipping duplicate: {book_data.get('title')}")
                continue

            # Create new book
            book = Book(
                title=book_data.get('title'),
                author=book_data.get('author'),
                rating=book_data.get('rating'),
                cover_image=book_data.get('cover_image'),
                currently_reading=book_data.get('currently_reading', False),
                genre=book_data.get('genre'),
                topic=book_data.get('topic')
            )

            # Parse date_completed if present
            if book_data.get('date_completed'):
                try:
                    # Handle different date formats
                    date_str = book_data['date_completed']
                    if 'T' in date_str:
                        # ISO format
                        book.date_completed = datetime.fromisoformat(date_str.replace('Z', '+00:00')).date()
                    else:
                        # Simple date format
                        book.date_completed = datetime.strptime(date_str, '%Y-%m-%d').date()
                except Exception as e:
                    print(f"Error parsing date for {book_data.get('title')}: {e}")

            db.session.add(book)
            count += 1

        db.session.commit()
        print(f"Successfully imported {count} books")

def create_sample_data():
    """Create some sample book data for testing"""
    app = create_app()

    with app.app_context():
        sample_books = [
            {
                'title': 'The Lean Startup',
                'author': 'Eric Ries',
                'rating': 5,
                'cover_image': 'https://images-na.ssl-images-amazon.com/images/I/51Zymoq7UnL._SX325_BO1,204,203,200_.jpg',
                'date_completed': '2023-06-15',
                'genre': 'Business',
                'topic': 'Entrepreneurship'
            },
            {
                'title': 'Atomic Habits',
                'author': 'James Clear',
                'rating': 5,
                'cover_image': 'https://images-na.ssl-images-amazon.com/images/I/51-uspgqWIL._SX329_BO1,204,203,200_.jpg',
                'date_completed': '2023-08-20',
                'genre': 'Self-Help',
                'topic': 'Productivity'
            },
            {
                'title': 'Deep Work',
                'author': 'Cal Newport',
                'rating': 4,
                'cover_image': 'https://images-na.ssl-images-amazon.com/images/I/51vmivI5KvL._SX332_BO1,204,203,200_.jpg',
                'date_completed': '2023-09-10',
                'genre': 'Productivity',
                'topic': 'Focus'
            },
            {
                'title': 'The Phoenix Project',
                'author': 'Gene Kim',
                'rating': 4,
                'cover_image': 'https://images-na.ssl-images-amazon.com/images/I/51n9t-b+E9L._SX328_BO1,204,203,200_.jpg',
                'date_completed': '2023-10-05',
                'genre': 'Technology',
                'topic': 'DevOps'
            },
            {
                'title': 'Thinking, Fast and Slow',
                'author': 'Daniel Kahneman',
                'rating': 5,
                'cover_image': 'https://images-na.ssl-images-amazon.com/images/I/41shZGS-G+L._SX330_BO1,204,203,200_.jpg',
                'date_completed': '2023-11-12',
                'currently_reading': False,
                'genre': 'Psychology',
                'topic': 'Decision Making'
            }
        ]

        count = 0
        for book_data in sample_books:
            # Check if book already exists
            existing = Book.query.filter_by(
                title=book_data['title'],
                author=book_data['author']
            ).first()

            if existing:
                print(f"Skipping duplicate: {book_data['title']}")
                continue

            book = Book(
                title=book_data['title'],
                author=book_data['author'],
                rating=book_data['rating'],
                cover_image=book_data.get('cover_image'),
                currently_reading=book_data.get('currently_reading', False),
                genre=book_data.get('genre'),
                topic=book_data.get('topic')
            )

            if book_data.get('date_completed'):
                book.date_completed = datetime.strptime(book_data['date_completed'], '%Y-%m-%d').date()

            db.session.add(book)
            count += 1

        db.session.commit()
        print(f"Successfully created {count} sample books")

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Import books into database')
    parser.add_argument('--json', help='Path to JSON file to import')
    parser.add_argument('--sample', action='store_true', help='Create sample data')

    args = parser.parse_args()

    if args.json:
        if os.path.exists(args.json):
            import_from_json(args.json)
        else:
            print(f"File not found: {args.json}")
    elif args.sample:
        create_sample_data()
    else:
        print("Please provide either --json <file> or --sample flag")
        parser.print_help()