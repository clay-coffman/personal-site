/**
 * Shared helpers for pushing/pulling media assets against an rclone R2 remote.
 * All functions take an explicit `remote` (e.g. "r2-photos:personal-site-photos")
 * and a key (full path under the bucket, e.g. "covers/123.jpg").
 */

import { spawnSync } from "node:child_process";

/**
 * List file names directly under a prefix in the remote. Returns a Set of
 * filenames (no path segments). Treats "directory not found" as empty.
 */
export function listR2Files(remote, prefix) {
  const res = spawnSync(
    "rclone",
    ["lsf", "--files-only", `${remote}/${prefix}`],
    { encoding: "utf-8" },
  );
  const err = (res.stderr || "").trim();
  if (res.status !== 0) {
    if (/directory not found|does not exist|404/i.test(err)) return new Set();
    throw new Error(`rclone lsf ${prefix} failed: ${err || res.stdout}`);
  }
  return new Set(
    res.stdout.split("\n").map((l) => l.trim()).filter(Boolean),
  );
}

/**
 * Upload a buffer to remote/key via `rclone rcat`. Throws on failure.
 */
export function uploadToR2(remote, key, buffer) {
  const res = spawnSync(
    "rclone",
    ["rcat", `${remote}/${key}`],
    { input: buffer },
  );
  if (res.status !== 0) {
    throw new Error(
      `rclone rcat ${key} failed: ${(res.stderr || "").toString().trim()}`,
    );
  }
}

/**
 * Delete a single file at remote/key. Warns on failure; does not throw.
 */
export function deleteFromR2(remote, key) {
  const res = spawnSync(
    "rclone",
    ["deletefile", `${remote}/${key}`],
    { encoding: "utf-8" },
  );
  if (res.status !== 0) {
    console.warn(
      `rclone deletefile ${key} failed: ${res.stderr || res.stdout}`,
    );
  }
}
