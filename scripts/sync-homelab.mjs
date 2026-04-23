#!/usr/bin/env node
/**
 * Syncs self-hosted services from a Homepage dashboard config (services.yaml)
 * into src/data/homelab.json. Only services explicitly marked `public: true`
 * in the YAML are included — everything else stays private. Mirrors the flow
 * of sync-books.mjs and sync-photos.mjs.
 *
 * Flags:
 *   --dry-run    Write homelab.json locally; skip git.
 *   --no-push    Commit but do not push.
 *
 * Env (required):
 *   HOMEPAGE_CONFIG_DIR  Path to the Homepage config dir on disk
 *                        (e.g. /opt/homepage/config). The script reads
 *                        `${HOMEPAGE_CONFIG_DIR}/services.yaml`.
 * Env (optional):
 *   SYNC_BRANCH            git branch (default: main)
 *   KUMA_PUSH_SYNC_HOMELAB heartbeat URL
 *
 * Homepage YAML conventions honored:
 *   - Sections become `category`
 *   - `href` → `url`
 *   - `description` → `description`
 *   - `public: true` is required for inclusion (opt-in)
 *   - Custom `upstream: <url>` and `tags: [..]` fields are passed through
 *     (Homepage ignores unknown keys).
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import {
  parseFlags,
  prepareBranch,
  commitAndPush,
  pingKuma,
} from "./lib/git-sync.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

const { dryRun: DRY_RUN, noPush: NO_PUSH } = parseFlags(process.argv);
const BRANCH = process.env.SYNC_BRANCH || "main";

const BOT_NAME = "homepage-sync[bot]";
const BOT_EMAIL = "noreply@about-clay.com";

const { HOMEPAGE_CONFIG_DIR } = process.env;

if (!HOMEPAGE_CONFIG_DIR) {
  console.error("error: HOMEPAGE_CONFIG_DIR is required");
  process.exit(1);
}

const servicesYamlPath = join(HOMEPAGE_CONFIG_DIR, "services.yaml");
if (!existsSync(servicesYamlPath)) {
  console.error(`error: ${servicesYamlPath} not found`);
  process.exit(1);
}

if (!DRY_RUN) {
  prepareBranch({ branch: BRANCH, cwd: repoRoot });
}

console.log(`reading ${servicesYamlPath}`);
const doc = yaml.load(readFileSync(servicesYamlPath, "utf-8"));

if (!Array.isArray(doc)) {
  console.error("error: services.yaml root must be a list of sections");
  process.exit(1);
}

const services = [];
let totalSeen = 0;

for (const sectionObj of doc) {
  if (!sectionObj || typeof sectionObj !== "object") continue;
  const entries = Object.entries(sectionObj);
  if (entries.length !== 1) continue;
  const [sectionName, sectionServices] = entries[0];
  if (!Array.isArray(sectionServices)) continue;

  for (const serviceObj of sectionServices) {
    if (!serviceObj || typeof serviceObj !== "object") continue;
    const svcEntries = Object.entries(serviceObj);
    if (svcEntries.length !== 1) continue;
    const [serviceName, config] = svcEntries[0];
    if (!config || typeof config !== "object") continue;

    totalSeen++;

    if (config.public !== true) continue;

    const href = typeof config.href === "string" ? config.href : "";
    const description =
      typeof config.description === "string" ? config.description : "";

    services.push({
      name: serviceName,
      description,
      url: href,
      ...(typeof config.upstream === "string"
        ? { upstream: config.upstream }
        : {}),
      category: sectionName,
      ...(Array.isArray(config.tags) && config.tags.length > 0
        ? { tags: config.tags.map(String) }
        : {}),
    });
  }
}

console.log(
  `  ${services.length} public service(s) (of ${totalSeen} total in services.yaml)`,
);

const outPath = join(repoRoot, "src", "data", "homelab.json");
const newJson = JSON.stringify(services, null, 2) + "\n";
const existingJson = existsSync(outPath) ? readFileSync(outPath, "utf-8") : "";

if (newJson !== existingJson) {
  writeFileSync(outPath, newJson);
  console.log(`wrote ${services.length} services to src/data/homelab.json`);
} else {
  console.log("no changes to homelab.json");
}

if (DRY_RUN) {
  console.log("dry-run: skipping git");
  process.exit(0);
}

commitAndPush({
  paths: ["src/data/homelab.json"],
  message: `sync homelab: ${services.length} entries`,
  botName: BOT_NAME,
  botEmail: BOT_EMAIL,
  branch: BRANCH,
  noPush: NO_PUSH,
  cwd: repoRoot,
});

await pingKuma("KUMA_PUSH_SYNC_HOMELAB");

console.log("done");
