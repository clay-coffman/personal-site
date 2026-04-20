# TODO

Ongoing work tracked in the repo. For closed items, check `git log`.

## Photos sync (blocked on prerequisites)

Goal: daily sync from Immich → R2 → `src/data/photos.json`, same systemd
timer pattern as books / highlights. Per-photo asset goes to R2 (not git)
to keep the repo small.

Prereqs needed before `scripts/sync-photos.mjs` can be written:

- [ ] **Immich API key + URL.** Generate at Immich → Account → API Keys.
  Add `IMMICH_API_KEY` and `IMMICH_API_URL` to `/root/.secrets/tokens.sh`
  on cloud-hil-1.
- [ ] **R2 bucket + custom domain.** Create a public bucket (e.g.
  `personal-site-photos`) and attach a custom domain (e.g.
  `photos.about-clay.com`) via the Cloudflare dashboard. Bucket creation
  can be done via rclone; the custom-domain step requires the dashboard.
- [ ] **Opt-in filter.** Decide which Immich album or tag marks a photo
  as publishable — suggested: album literally named `publish`, mirroring
  the Readwise `publish` tag pattern.
- [ ] **Consuming page.** Confirm whether the R5 redesign already has a
  photos page/component or whether one needs to be created. Current
  `src/data/photos.ts` contains hardcoded placeholders.

Once prereqs are ready, implementation follows the existing
`scripts/sync-highlights.mjs` shape and delegates git ops to
`scripts/lib/git-sync.mjs`.

## Kuma heartbeat observability (optional)

Add `KUMA_PUSH_SYNC_BOOKS` / `KUMA_PUSH_SYNC_HIGHLIGHTS` /
`KUMA_PUSH_SYNC_PHOTOS` env vars to each systemd service and the
matching Uptime Kuma monitors. `pingKuma()` helper already exists in
`scripts/lib/git-sync.mjs`; just needs the env URLs.

## Quotes sync (deferred)

Source not yet chosen. Options:
- Readwise highlights tagged `quote` (reuses existing Readwise infra).
- Plain-text/yaml file maintained in Obsidian, rclone-synced to the
  host, then parsed by `sync-quotes.mjs`.
- Hardcoded `src/data/quotes.ts` if the list stays short.

## Redesign → main

`r5-rust-redesign` branch is the active dev branch. Once merged to
`main`, drop `SYNC_BRANCH=r5-rust-redesign` from the two systemd service
units in `/etc/systemd/system/personal-site-sync-*.service` (default is
`main`).
