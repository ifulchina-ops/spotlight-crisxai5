// Spotlight @crisxai5: AI & Crypto Expert on X — make.fun entry (Node 22, stdlib only).
//
// The entry is the X post itself: an original spotlight card for @crisxai5, posted
// publicly with the play code in its text. This program's only job is to hand the
// post's address to the grader: it copies POST.json from the repository root into
// the output directory, where the house reads it and fetches the post's counts.
//
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Deterministic by construction: a byte-for-byte copy, no clock, no network,
// no randomness — two runs write identical bytes.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(OUTPUT_DIR, { recursive: true });

// Fail loudly on a malformed POST.json instead of handing the gate a bad file:
// it must parse as JSON and name a post URL.
const postPath = join(BOT_DIR, "POST.json");
let post: unknown;
try {
  post = JSON.parse(readFileSync(postPath, "utf8"));
} catch (err) {
  console.error(`POST.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof post !== "object" || post === null || typeof (post as { url?: unknown }).url !== "string") {
  console.error("POST.json must be a JSON object with a string \"url\" field.");
  process.exit(1);
}

try {
  copyFileSync(postPath, join(OUTPUT_DIR, "POST.json"));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
