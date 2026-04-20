/**
 * Shared helpers for content-sync scripts: branch prep, commit/push,
 * flag parsing, and optional Uptime Kuma heartbeat.
 *
 * All functions operate on an explicit `cwd` so callers keep control of
 * where git runs.
 */

import { execSync } from "node:child_process";

export function parseFlags(argv) {
  return {
    dryRun: argv.includes("--dry-run"),
    noPush: argv.includes("--no-push"),
  };
}

export function prepareBranch({ branch, cwd }) {
  console.log(`syncing git state from origin/${branch}`);
  run(`git fetch origin ${branch}`, cwd);
  run(`git checkout ${branch}`, cwd);
  run(`git reset --hard origin/${branch}`, cwd);
}

export function hasChanges(cwd) {
  return runSilent("git status --porcelain", cwd).trim().length > 0;
}

export function commitAndPush({
  paths,
  message,
  botName,
  botEmail,
  branch,
  noPush,
  cwd,
}) {
  if (!hasChanges(cwd)) {
    console.log("no changes — exiting without commit");
    return false;
  }
  console.log("committing");
  const pathArgs = paths.map(shellQuote).join(" ");
  run(`git add ${pathArgs}`, cwd);
  run(
    `git -c user.name=${shellQuote(botName)} -c user.email=${shellQuote(botEmail)} commit -m ${shellQuote(message)}`,
    cwd,
  );
  if (noPush) {
    console.log("--no-push: leaving commit local");
    return true;
  }
  console.log(`pushing to origin/${branch}`);
  try {
    run(`git push origin ${branch}`, cwd);
  } catch {
    console.log(`push rejected — rebasing on origin/${branch} and retrying`);
    run(`git fetch origin ${branch}`, cwd);
    run(`git rebase origin/${branch}`, cwd);
    run(`git push origin ${branch}`, cwd);
  }
  return true;
}

export async function pingKuma(envVar) {
  const url = process.env[envVar];
  if (!url) return;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`kuma ping ${envVar} returned ${res.status}`);
    }
  } catch (err) {
    console.warn(`kuma ping ${envVar} failed: ${err.message}`);
  }
}

function run(cmd, cwd) {
  return execSync(cmd, { cwd, stdio: "inherit" });
}

function runSilent(cmd, cwd) {
  return execSync(cmd, { cwd }).toString();
}

function shellQuote(s) {
  return `'${String(s).replace(/'/g, `'\\''`)}'`;
}
