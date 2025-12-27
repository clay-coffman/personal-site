"""
Calibre library integration.

Reads directly from Calibre's metadata.db to get 5-star rated books.
"""

import sqlite3
import os
from pathlib import Path


def get_calibre_paths():
    """Get Calibre library and database paths from environment."""
    library = os.environ.get('CALIBRE_LIBRARY', '/calibre')
    db = os.path.join(library, 'metadata.db')
    return library, db


def get_favorite_books():
    """
    Get all 5-star rated books from Calibre, sorted by author last name A-Z.

    Returns list of dicts with: id, title, author, author_sort, path, tags
    """
    library, db = get_calibre_paths()

    if not os.path.exists(db):
        return []

    conn = sqlite3.connect(f'file:{db}?mode=ro', uri=True)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Calibre stores 5 stars as rating value 10
    query = """
        SELECT
            b.id,
            b.title,
            b.author_sort,
            b.path,
            b.has_cover,
            GROUP_CONCAT(DISTINCT a.name) as authors,
            GROUP_CONCAT(DISTINCT t.name) as tags
        FROM books b
        JOIN books_ratings_link br ON b.id = br.book
        JOIN ratings r ON br.rating = r.id
        LEFT JOIN books_authors_link ba ON b.id = ba.book
        LEFT JOIN authors a ON ba.author = a.id
        LEFT JOIN books_tags_link bt ON b.id = bt.book
        LEFT JOIN tags t ON bt.tag = t.id
        WHERE r.rating = 10
        GROUP BY b.id
        ORDER BY b.author_sort ASC
    """

    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()

    books = []
    for row in rows:
        books.append({
            'id': row['id'],
            'title': row['title'],
            'author': row['authors'] or parse_author_sort(row['author_sort']),
            'author_sort': row['author_sort'],
            'path': row['path'],
            'has_cover': row['has_cover'],
            'tags': row['tags'].split(',') if row['tags'] else []
        })

    return books


def parse_author_sort(author_sort):
    """Convert 'Last, First' to 'First Last' for display."""
    if not author_sort:
        return ''
    if ', ' in author_sort:
        parts = author_sort.split(', ', 1)
        return f'{parts[1]} {parts[0]}'
    return author_sort


def get_cover_path(book_id):
    """
    Get the filesystem path to a book's cover image.

    Returns the path if it exists, None otherwise.
    """
    library, db = get_calibre_paths()

    if not os.path.exists(db):
        return None

    conn = sqlite3.connect(f'file:{db}?mode=ro', uri=True)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute('SELECT path, has_cover FROM books WHERE id = ?', (book_id,))
    row = cursor.fetchone()
    conn.close()

    if not row or not row['has_cover']:
        return None

    cover_path = Path(library) / row['path'] / 'cover.jpg'
    if cover_path.exists():
        return str(cover_path)

    return None
