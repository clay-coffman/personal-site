# about-clay.com

Personal site for Clay Coffman. Static Astro site deployed on Cloudflare Pages.

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Sync books from Calibre

The `/bookshelf` page reads `src/data/books.json`, populated from a Calibre library
by `scripts/sync-books.mjs`. This runs on the Hetzner host that has the library
mounted — not locally, not in CF Pages build.

```bash
CALIBRE_LIBRARY=/calibre npm run sync-books             # full sync + push
CALIBRE_LIBRARY=/calibre npm run sync-books -- --dry-run  # preview
```

See `CLAUDE.md` for architecture details.
