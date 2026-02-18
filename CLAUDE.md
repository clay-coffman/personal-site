# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Build SVG icon sprite
npm run build:icons

# Run development server (requires .env file - copy from .env.example)
npm run dev

# Production build
npm run build

# Production server (after build)
npm start

# Docker deployment
docker compose -f docker-compose.server.yml build
docker compose -f docker-compose.server.yml up -d

# Database migrations
npm run db:generate
npm run db:migrate
```

The dev server runs on port 5173. Production uses Express on port 3000 (mapped to 8082 in Docker).

## Architecture

React Router v7 personal website with SSR, Tailwind CSS v4, and a bookshelf/reading tracker backed by Calibre.

### Application Structure

- **`app/root.tsx`**: HTML shell, fonts, meta, flash messages
- **`app/routes.ts`**: Route configuration
- **`app/styles/app.css`**: Tailwind v4 `@theme` block, dark mode, custom `@utility` rules

### Routes (`app/routes/`)

- **`_index.tsx`**: Homepage (/)
- **`books.tsx`**: Bookshelf (/books) - displays 5-star books from Calibre
- **`blog.tsx`** / **`projects.tsx`**: Stubs
- **`admin_.login.tsx`**: Login form (/admin/login) - escapes admin layout
- **`admin.tsx`**: Admin layout with auth guard
- **`admin.books.tsx`**: Books CRUD dashboard (/admin/books)
- **`admin.logout.tsx`**: Logout action
- **`api.books.tsx`** / **`api.health.tsx`**: JSON resource routes
- **`covers.$bookId.tsx`**: Serves Calibre cover images

### Server Libraries (`app/lib/`)

- **`auth.server.ts`**: Cookie session storage, login/logout, `requireAuth()`
- **`calibre.server.ts`**: Reads Calibre `metadata.db` for 5-star books and cover paths
- **`db.server.ts`**: Drizzle ORM connection with better-sqlite3
- **`env.server.ts`**: Zod env validation
- **`root-loader.server.ts`**: Root layout loader (flash messages)
- **`admin-login.server.ts`** / **`admin-books.server.ts`**: Server-only loader/action for admin routes

### Database (`app/db/`)

- **`schema.ts`**: Drizzle schema for `books` and `users` tables

### Components (`app/components/`)

- **`ui/`**: Primitives (button, card, input, label, select, badge, table, dialog, icon, alert)
- **`page-layout.tsx`**: Sidebar + main content flex wrapper
- **`sidebar-nav.tsx`**: Fixed left sidebar with Bebas Neue nav links
- **`mobile-nav.tsx`**: Hamburger + slide-out menu for mobile
- **`hero-section.tsx`**: Full-viewport hero ("CLAY / COFFMAN")
- **`experience-section.tsx`** / **`skills-section.tsx`** / **`projects-section.tsx`** / **`education-section.tsx`**: Homepage sections
- **`book-card.tsx`** / **`book-grid.tsx`**: Book display components

### Data

- **`app/data/profile.ts`**: Static profile data (experiences, education, skills)
- **SQLite database**: `data/database.db` (auto-created)

### Icons

Source SVGs in `icons/`, built into `public/sprite.svg` via `npm run build:icons`.

## Environment Variables

Required in `.env` (see `.env.example`):
- `SECRET_KEY`: Session cookie secret
- `ADMIN_USERNAME` / `ADMIN_PASSWORD`: Admin login credentials
- `DATABASE_PATH`: SQLite file path (defaults to `./data/database.db`)
- `CALIBRE_LIBRARY`: Path to Calibre library (defaults to `/calibre`)
- `NODE_ENV`: `development` | `production`

## Key Patterns

- Server-only code uses `.server.ts` suffix to prevent client bundling
- Route files that need both UI and server code re-export `loader`/`action` from separate `.server.ts` files
- Dark mode uses `prefers-color-scheme` media query with CSS custom properties
- SVG icons use a sprite sheet consumed via `<Icon name="..." />` component
