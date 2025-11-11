# Clay's Personal Website - Architecture & Development Guide

## Project Overview

This is Clay Coffman's personal portfolio and bookshelf website built with Next.js. It serves as both a personal brand/resume site and a platform for managing and displaying book recommendations from a Supabase database.

**Repository**: `personal-site`
**Framework**: Next.js 15.4.4
**Deployment**: Vercel
**Package Manager**: pnpm
**Status**: Active maintenance

## Tech Stack

### Frontend
- **Next.js 15.4.4** - React framework with SSR/SSG support
- **React 19.1.1** - UI library
- **React DOM 19.1.1** - DOM rendering
- **TypeScript 5.7.2** - Type safety
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **PostCSS 8.4.32** - CSS transformations
- **Autoprefixer 10.4.16** - Browser prefix handling
- **React Select 5.8.0** - Dropdown/select component for sorting
- **FontAwesome 6.7.2** - Icon library (solid, brands)

### Backend/Database
- **Supabase** - PostgreSQL database + auth platform
- **Supabase JS Client 2.47.9** - Database client library
- **Next.js API Routes** - Serverless functions for backend logic

### Development Tools
- **ESLint 8.56.0** - Code quality
- **ESLint Config Next 14.0.4** - Next.js linting rules

### Configuration Files
- **jsconfig.json** - Babel macro configuration with path aliases
- **tsconfig.json** - TypeScript compilation settings
- **next.config.js** - Next.js configuration
- **tailwind.config.js** - Tailwind customization
- **postcss.config.js** - PostCSS plugin configuration
- **vercel.json** - Vercel deployment configuration
- **pnpm-lock.yaml** - Dependency lock file

## Project Structure

```
/src
├── /components        # Reusable React components
│   ├── avatar.jsx
│   ├── book-card.jsx
│   ├── book-list.jsx
│   ├── container.jsx
│   ├── cover-image.jsx
│   ├── date.jsx
│   ├── footer.jsx
│   ├── form.jsx
│   ├── header.jsx
│   ├── hero-post.jsx
│   ├── intro.jsx
│   ├── layout.jsx
│   ├── meta.jsx
│   ├── more-stories.jsx
│   ├── post-body.jsx
│   ├── post-header.jsx
│   ├── post-preview.jsx
│   ├── post-title.jsx
│   ├── protected-route.jsx
│   ├── section-separator.jsx
│   ├── seo.jsx
│   └── markdown-styles.module.css
│
├── /data              # Static data
│   └── profile.js     # Professional profile data (experiences, education, projects)
│
├── /lib               # Utility functions & helpers
│   ├── auth.js        # React Context for authentication
│   ├── books.js       # Supabase book CRUD operations
│   ├── constants.js   # Application constants
│   ├── supabase.ts    # Supabase client initialization & TypeScript types
│   └── supabase.js    # Legacy Supabase utilities
│
├── /pages             # Next.js pages (file-based routing)
│   ├── _app.jsx       # App wrapper with global providers
│   ├── _document.jsx  # HTML document wrapper
│   ├── index.jsx      # Home/About page
│   ├── /admin
│   │   ├── login.jsx  # Admin login page
│   │   └── books.jsx  # Book management dashboard (protected)
│   ├── /books
│   │   └── index.jsx  # Public bookshelf page
│   └── /api           # API routes
│       ├── /auth
│       │   └── login.js     # Authentication endpoint
│       ├── hello.js         # Example endpoint
│       └── /policies
│           └── create.js    # Database policy creation
│
├── /styles           # Global stylesheets
│   ├── globals.css
│   ├── Home.module.css
│   └── index.css
│
├── /types            # TypeScript type definitions
│   └── env.d.ts      # Environment variable types
│
└── /public           # Static assets
    ├── /assets       # Images and documents
    ├── /favicon      # Favicon files
    └── manifest files
```

## Key Features & Pages

### 1. Home Page (`/src/pages/index.jsx`)
- Professional profile display with photo
- Experience timeline (current and past roles)
- Side projects section
- Education and certifications
- Social links (LinkedIn, Twitter, GitHub)
- Responsive design using Tailwind CSS

### 2. Bookshelf (`/src/pages/books/index.jsx`)
- Display of books stored in Supabase database
- Filter/sort functionality (by rating, date completed, title)
- Static generation with 60-second revalidation
- Book cards with cover images
- Integration with Goodreads cover images and Vercel Blob storage

### 3. Admin Dashboard (`/src/pages/admin/books.jsx`)
- Protected route requiring authentication
- Add new books to database
- Edit book ratings
- Delete books
- Batch update functionality
- Sign out button

### 4. Admin Login (`/src/pages/admin/login.jsx`)
- Simple username/password authentication
- Environment variable-based credentials
- Redirect to books dashboard on success

## Authentication System

**Provider**: `AuthContext` (`/src/lib/auth.js`)
- Simple React Context-based authentication
- Credentials checked against `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables
- API endpoint: `POST /api/auth/login`
- Stores user state in context
- `ProtectedRoute` component wraps admin pages to enforce authentication

**How it works**:
1. User submits credentials on `/admin/login`
2. Credentials sent to `/api/auth/login` endpoint
3. Backend validates against env variables
4. On success, user context is updated
5. `ProtectedRoute` component checks user state and redirects if needed

## Database (Supabase)

### Configuration
- **Client**: Initialized in `/src/lib/supabase.ts`
- **Environment Variables Required**:
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anonymous key for client-side access

### Tables
- **books** - Stores book metadata
  - `id` (number, primary key)
  - `title` (string)
  - `author` (string)
  - `rating` (number, 1-5)
  - `cover_image` (string, optional URL)
  - `date_completed` (date, optional)
  - `currently_reading` (boolean)
  - `genre` (string, optional)
  - `topic` (string, optional)
  - `created_at` (timestamp)

### CRUD Operations (`/src/lib/books.js`)
- `getBooks(sort)` - Fetch all books with sorting
- `addBook(book)` - Insert new book
- `updateBook(id, updates)` - Update single book
- `updateBooks(updates)` - Batch update multiple books
- `deleteBook(id)` - Delete a book

## API Routes

### `POST /api/auth/login`
**Purpose**: Authenticate admin users
**Body**: `{ username, password }`
**Response**: `{ success: true }` or error

### `POST /api/policies/create`
**Purpose**: Create Supabase RLS (Row Level Security) policies
**Used**: Database initialization
**Operations**:
- Creates public read policy
- Creates authenticated write policy

### `GET /api/hello`
**Purpose**: Example endpoint
**Response**: `{ name: 'John Doe' }`

## Build & Development Commands

### Development
```bash
pnpm dev
# Starts Next.js dev server at http://localhost:3000
```

### Production Build
```bash
pnpm build
# Compiles Next.js application to `.next` directory
```

### Production Server
```bash
pnpm start
# Runs compiled Next.js server (requires `pnpm build` first)
```

### Linting
```bash
pnpm lint
# Runs ESLint with Next.js configuration
```

## Environment Variables

### Required for Development
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
ADMIN_USERNAME=<admin-username>
ADMIN_PASSWORD=<admin-password>
```

### Notes
- Prefix `NEXT_PUBLIC_` variables are exposed to the browser
- Admin credentials should be kept secure (use `.env.local` locally)
- See README.md for deployment variable setup with AWS Amplify

## Configuration Files

### tsconfig.json
- Target: ES5
- Strict mode enabled
- Module resolution: bundler
- Path aliases: `@/*` → `./src/*`

### next.config.js
- Image optimization for Goodreads (`i.gr-assets.com`) and Vercel Blob storage
- Webpack fallback for `fs` module (disabled)
- React Strict Mode enabled
- X-Powered-By header disabled
- Compression enabled

### tailwind.config.js
- **JIT Mode**: Enabled for faster builds
- **Custom Colors**:
  - `accent-1`, `accent-2`, `accent-7` - Brand colors
  - `tradefoundry` - Orange brand color
  - `success` - Blue success state
  - `cyan` - Cyan accent

- **Custom Fonts** (via Google Fonts):
  - `display`: Koulen (headings)
  - `title`: Josefin Sans (titles)
  - `body`: Forum (body text)

- **Content paths**: Configured for `/src` directory structure

## Component Architecture

### Layout Components
- **Layout** - Main page wrapper with Meta and Footer
- **Container** - Responsive content container
- **Header** - Navigation header with links
- **Meta** - SEO and favicon metadata

### Content Components
- **BookCard** - Individual book display card
- **BookList** - Grid of book cards
- **Intro** - Personal introduction section
- **Avatar** - Profile picture component
- **Footer** - Page footer

### UI Components
- **Form** - Generic form wrapper
- **SectionSeparator** - Visual dividers
- **ProtectedRoute** - Authentication wrapper

## Styling Approach

1. **Tailwind CSS** - Primary utility-first styling
2. **CSS Modules** - For component-scoped styles (e.g., `markdown-styles.module.css`)
3. **Global CSS** - In `/src/styles/globals.css`
4. **Custom Theme** - Extended in `tailwind.config.js`

## Deployment

### Vercel Configuration
File: `vercel.json`
```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### Deployment Notes
- Hosted on Vercel
- Uses AWS Amplify for environment variables (see README.md)
- Static generation with ISR (Incremental Static Regeneration) for book pages (60-second revalidation)
- Environment variables must be configured in Vercel dashboard

## Key Architectural Patterns

### 1. Static Generation with ISR
- Book listing page uses `getStaticProps` with `revalidate: 60`
- Generates static HTML at build time, revalidates every 60 seconds
- Allows fast page loads with fresh data

### 2. Client-Side Data Fetching
- Book sorting handled client-side with React state
- Dynamic filtering without page reload

### 3. Batch Operations
- `updateBooks()` uses Supabase `upsert` for efficient bulk updates
- Reduces database round trips

### 4. Context-Based Authentication
- Simple, lightweight auth without external services
- User state persists during session
- Credentials validated server-side

### 5. API-First Backend
- All database operations go through Supabase client
- API routes for special operations (auth, policies)
- Clear separation between frontend and backend logic

## Data Flow Examples

### Loading Books
1. `getStaticProps` in `/pages/books/index.jsx` fetches from Supabase at build time
2. HTML generated and served statically
3. Revalidation triggered every 60 seconds
4. User can sort/filter client-side (re-fetches data from Supabase)

### Adding a Book (Admin)
1. User submits form in `/admin/books.jsx`
2. `addBook()` called from `/src/lib/books.js`
3. Supabase client inserts into `books` table
4. Book added to local component state
5. UI updates optimistically

### User Login
1. Form submitted to `/api/auth/login` POST endpoint
2. Credentials validated against env variables
3. Response triggers `useAuth().signIn()`
4. AuthContext updates with user state
5. Router redirects to `/admin/books`

## Recent Changes (from git log)
- Update experiences profile data
- Update admin functionality
- Remove old API endpoints
- Fixed admin login
- Multiple performance and cleanup commits

## Best Practices & Conventions

1. **File Organization**
   - Components in `/components` with `.jsx` extension
   - Utility functions in `/lib`
   - Static data in `/data`
   - Pages follow Next.js file-based routing

2. **Naming Conventions**
   - Components: PascalCase (e.g., `BookCard`)
   - Files: kebab-case (e.g., `book-card.jsx`)
   - Functions: camelCase

3. **Component Props**
   - Destructured in function parameters
   - JSDoc comments for public APIs

4. **Error Handling**
   - Try/catch blocks in async operations
   - Error states in React components
   - Console logging for debugging

5. **Styling**
   - Prefer Tailwind utilities
   - CSS modules for complex component styles
   - Color/spacing from Tailwind config

## Common Development Tasks

### Adding a New Page
1. Create file in `/src/pages` (e.g., `/pages/projects.jsx`)
2. Export default React component
3. Import Layout and Container
4. Use Tailwind for styling

### Adding a New Component
1. Create in `/src/components` with `.jsx` extension
2. Use prop destructuring
3. Export as default
4. Import in pages or other components

### Connecting to Database
1. Import Supabase functions from `/lib/books.js` or `/lib/supabase.ts`
2. Use Supabase client methods (select, insert, update, delete)
3. Handle errors with try/catch
4. Update component state with results

### Styling a Component
1. Use Tailwind utility classes in `className`
2. For complex styles, create CSS module
3. Reference theme colors from `tailwind.config.js`
4. Test responsive breakpoints (sm, md, lg, xl)

## Testing

**Current Status**: No test framework configured
- ESLint configured for code quality
- Manual testing recommended for features
- Deployment pipeline via Vercel

## Troubleshooting

### Build Issues
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `pnpm install`
- Check environment variables are set

### Database Issues
- Verify Supabase credentials in `.env.local`
- Check RLS policies on `books` table
- Review Supabase logs for query errors

### Authentication Issues
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` env vars
- Check browser cookies/localStorage
- Ensure `/api/auth/login` endpoint is accessible

## Resources & Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

## Notes for Future Development

1. The project has legacy references to `src/frontend` and `src/backend` directories in gitignore, but current structure uses flat `/src` organization.

2. TypeScript is partially used (Supabase types in `.ts` files) but most components are JSX. Consider gradually migrating to full TypeScript.

3. Authentication is simple and environment-variable based. For production with multiple users, consider Supabase Auth or similar service.

4. No testing framework configured. Jest or Vitest could be added for unit/integration testing.

5. The `/api/policies/create` endpoint suggests initial database RLS setup. This may have been a one-time setup operation.

6. Font loading from Google Fonts happens in `_document.jsx`. Consider preloading critical fonts for performance.

---

**Last Updated**: November 2024
**Maintained By**: Clay Coffman
