# Calibre Books Integration

Display 5-star rated books from your Calibre library on clay.bio/books.

## Overview

```
Calibre Library (mounted volume)
├── metadata.db  ──→  /books route queries directly
└── */cover.jpg  ──→  /covers/<id> route serves images
```

The Flask app reads directly from Calibre's `metadata.db` and serves covers from
the mounted library.

## Architecture

- **Calibre library**:
  `/mnt/volume-hil-1/ncdata/personal-1/files/Books/Calibre/`
- **Mounted in container as**: `/calibre` (read-only)
- **Books route**: Queries `/calibre/metadata.db` for 5-star books
- **Covers route**: Serves `/calibre/{book_path}/cover.jpg`

## Display

Each book shows:

- Cover image (thumbnail)
- Title
- Author
- Genre (if set in Calibre)

Sorted by author last name A-Z (using Calibre's `author_sort` field).

## Setup

### 1. Add Volume Mount

In `docker-compose.server.yml`:

```yaml
services:
  web:
    volumes:
      - /mnt/volume-hil-1/ncdata/personal-1/files/Books/Calibre:/calibre:ro
```

### 2. Rebuild Container

```bash
cd /opt/personal-site
docker compose -f docker-compose.server.yml build
docker compose -f docker-compose.server.yml up -d
```

## Calibre Database Query

5-star books query (Calibre stores 5 stars as rating value 10):

```sql
SELECT
    b.id,
    b.title,
    b.author_sort,
    b.path,
    GROUP_CONCAT(t.name) as tags
FROM books b
JOIN books_ratings_link br ON b.id = br.book
JOIN ratings r ON br.rating = r.id
LEFT JOIN books_tags_link bt ON b.id = bt.book
LEFT JOIN tags t ON bt.tag = t.id
WHERE r.rating = 10
GROUP BY b.id
ORDER BY b.author_sort ASC
```

## Routes

- `GET /books` - Display all 5-star books from Calibre
- `GET /covers/<int:book_id>` - Serve cover image for a Calibre book

## Notes

- Calibre's `author_sort` stores names as "Last, First" for proper sorting
- The `path` column contains the book's folder path (e.g.,
  `Author Name/Book Title (123)`)
- Cover images are at `{library_path}/{book_path}/cover.jpg`
- Mount is read-only for safety
