# Personal website

WIP personal site for hosting blog posts, photos, nfts, books, highlights, etc

built using nextjs (react + tailwindcss) and ghost as CMS. wanted to use ghost for membership tools and email, etc...

boilerplate was generated using 
``bash
npx create-next-app --example cms-ghost cms-ghost-app
```

## to run dev server locally

```bash
npm install
npm run dev
```
### .env

need to set the following

```bash
GHOST_API_URL=...
GHOST_API_KEY=...
READWISE_API_BASEURL=...
READWISE_ACCESS_TOKEN=...
```
