# Site Cleanup Punch List

Audit from 2026-05-06. All items resolved.

## Outright boilerplate to delete

- [x] **Delete `src/content/blog/hello-world.mdx`**
- [x] **Delete `src/components/SectionHeader.astro`**
- [x] **Rip out the highlights pipeline** — components, data, sync script,
      npm script, CLAUDE.md reference all removed.

## Stale content / copy

- [x] **`profile.ts` personal-site project blurb** — Hardcover/Immich/R2.
- [x] **`CLAUDE.md` Calibre + file-structure block** — updated to current state.
- [x] **`HeroSection.astro`** — uses `{profile.location}`.
- [x] **`index.astro` meta description** — site-specific copy.
- [x] **`WritingSection.astro` blurb** — present-tense, no broken promises.
- [x] **`bookshelf.astro` description** — clarified ("Books I keep coming
      back to" instead of ambiguous "highlights").

## Unfinished / half-wired

- [x] **`/subscribe` page de-dupe** — `bare` prop on `SubscribeForm`.
- [x] **`/projects` page** — deleted; homepage "all projects →" link
      removed (homepage `#code` section is the only project surface now).
- [x] **Nav label drift** — `/blog` → `/writing` everywhere (TopNav, hero,
      WritingSection, RSS link, page title/h1). `public/_redirects` 301s old
      URLs. Internal content collection still named `blog`.
- [x] **`profile.ts` skills** — added Lua, Cloudflare, Bun, SQLite, Neovim,
      chezmoi; removed Flask; added new "AI workflows" bucket (Claude Code,
      git worktrees, hooks).

## Smaller nits

- [x] **`BooksSection.astro` empty-state** — removed; books.json always has
      data.
- [x] **`HomeFooter` email** — confirmed (Firefox Relay alias, intentional).
- [x] **`Footer.astro` vs `HomeFooter.astro`** — `Footer.astro` now mirrors
      HomeFooter's link set (email/linkedin/github/rss + location + © year),
      minus the big-name banner. Subpages are no longer dead-ends.

## Notes

- Internal content collection is still named `"blog"` (in `content.config.ts`
  and `getCollection("blog", ...)`). Renaming would touch every consumer for
  no URL/UX benefit. Left alone.
- `/blog → /writing` redirect is via `public/_redirects` (Cloudflare Pages).
  Verify it works after deploy — locally Astro doesn't honor `_redirects`.
- Education list kept as-is (all 5 entries) per user decision.
