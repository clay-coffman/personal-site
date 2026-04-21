# TODO

Ongoing work tracked in the repo. For closed items, check `git log`.

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
