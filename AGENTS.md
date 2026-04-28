# Repository Guidelines

## Project Structure & Module Organization

This is a static Astro 5 personal site. Routes live in `src/pages/`, shared UI in `src/components/`, page shells in `src/layouts/`, and Tailwind v4 styles in `src/styles/app.css`. Blog posts are MDX files in `src/content/blog/`, validated by `src/content.config.ts`. Generated data lives in `src/data/`; JSON files such as `books.json`, `photos.json`, and `homelab.json` are updated by scripts. SVG icons belong in `icons/`; generated assets and the icon sprite live in `public/`. Automation and sync utilities are in `scripts/`.

## Build, Test, and Development Commands

- `npm install`: install dependencies using `package-lock.json`.
- `npm run dev`: rebuild `public/sprite.svg`, then start Astro at `http://localhost:4321`.
- `npm run build`: rebuild icons and produce the static site in `dist/`; use this as the primary validation command.
- `npm run preview`: serve the built `dist/` output locally.
- `npm run build:icons`: regenerate the SVG sprite from `icons/`.
- `npm run sync-*`: refresh generated data from external services; these require service-specific environment variables.

## Coding Style & Naming Conventions

Use TypeScript, Astro components, MDX, and ES modules. Match existing two-space indentation. Name Astro components in PascalCase, for example `HeroSection.astro`; utility modules use camelCase, for example `cdnImage.ts`. Prefer vanilla `<script>` blocks inside Astro components. Use Tailwind classes and utilities from `src/styles/app.css`; merge conditional class names with `cn()` from `src/lib/cn.ts`. Add icons as SVG files in `icons/`, then consume them through `<Icon name="..." />`.

## Testing Guidelines

There is no separate test runner configured. For code, content, and data changes, run `npm run build` and fix Astro, TypeScript, MDX, or schema errors. For visual changes, run `npm run dev` and check affected routes at desktop and mobile widths. When editing sync scripts, prefer dry-run flags where available, for example `npm run sync-books -- --dry-run`.

## Commit & Pull Request Guidelines

Recent history uses concise subject lines, often Conventional Commit style with scopes, such as `fix(theme): lift light-mode contrast` and `feat(homelab): add /homelab page`. Keep commits focused and include generated JSON or `public/sprite.svg` only when expected. Pull requests should describe the change, list validation commands, link issues, and include screenshots for UI changes.

## Security & Configuration Tips

Do not commit secrets or local credentials. Sync scripts depend on environment variables for Hardcover, Immich, R2, Readwise, and Homepage data; keep those in host-specific env files outside normal source changes. Cloudflare Pages deploys from `main`, with cache headers in `public/_headers` and Node pinned by `.node-version`.
