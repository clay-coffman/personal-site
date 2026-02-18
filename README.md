# Clay Coffman Personal Site

My personal site. Built with React Router v7 + Tailwind CSS. Hosted on my trusty little
hetzner server. Don't break it.

## Tech Stack

- **Framework**: React Router v7 with SSR
- **Styling**: Tailwind CSS v4 with custom theme
- **Database**: SQLite via Drizzle ORM + better-sqlite3
- **Authentication**: Cookie sessions
- **Books**: Calibre library integration
- **Production**: Express + Docker

## How to dev

```bash
npm install

# make sure .env exists!
cp .env.example .env

npm run build:icons
npm run dev
```
