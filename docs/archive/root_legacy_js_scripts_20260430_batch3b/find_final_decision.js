/**
 * find_final_decision.js
 *
 * PURPOSE:
 * Find the REAL final decision writer in the repo.
 * This script does NOT make decision logic changes.
 * It only scans files and reports which file actually writes final_decision.json
 * or contains the true ALLOW/REJECT gate logic.
 *
 * USAGE:
 *   node find_final_decision.js
 *   node find_final_decision.js D:\\KAGAMI-MZ
 */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

const TARGET_EXTENSIONS = new Set([
  ".js",
  ".cjs",
  ".mjs",
  ".ts",
  ".json",
]);

const IGNORE_DIRS = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  ".turbo",
  ".idea",
  ".vscode",
]);

const SEARCH_PATTERNS = [
  "final_decision.json",
  "ALLOW",
  "REJECT",
  "validator_executed",
  "gemini_validation",
  "output.png",
  "writeFileSync",
  "job_summary",
];

function safeReadText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function walk(dir, out = []) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walk(fullPath, out);
      continue;
    }

    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (!TARGET_EXTENSIONS.has(ext)) continue;

    out.push(fullPath);
  }

  return out;
}

function scoreFile(content, filePath) {
  let score = 0;
  const hits = [];

  for (const pattern of SEARCH_PATTERNS) {
    if (content.includes(pattern)) {
      hits.push(pattern);
      score += 1;
    }
  }

  if (content.includes("final_decision.json")) score += 8;
  if (content.includes("writeFileSync") || content.includes("fs.writeFileSync")) score += 4;
  if (content.includes("ALLOW") && content.includes("REJECT")) score += 4;
  if (content.includes("validator_executed")) score += 2;
  if (content.includes("gemini_validation")) score += 2;
  if (content.includes("output.png")) score += 2;
  if (/finalDecision|final_decision|decision/i.test(path.basename(filePath))) score += 2;

  return { score, hits };
}

function extractInterestingLines(content) {
  const lines = content.split(/\r?\n/);
  const matches = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      line.includes("final_decision.json") ||
      line.includes("ALLOW") ||
      line.includes("REJECT") ||
      line.includes("validator_executed") ||
      line.includes("gemini_validation") ||
      line.includes("output.png") ||
      line.includes("writeFileSync")
    ) {
      matches.push({
        lineNumber: i + 1,
        text: line.trim(),
      });
    }
  }

  return matches.slice(0, 30);
}

function main() {
  console.log(`Scanning repo: ${ROOT}`);
  const files = walk(ROOT);
  const candidates = [];

  for (const filePath of files) {
    const content = safeReadText(filePath);
    if (!content) continue;

    const { score, hits } = scoreFile(content, filePath);
    if (score <= 0) continue;

    candidates.push({
      filePath,
      score,
      hits,
      snippets: extractInterestingLines(content),
    });
  }

  candidates.sort((a, b) => b.score - a.score);

  const result = {
    root: ROOT,
    scanned_file_count: files.length,
    candidate_count: candidates.length,
    top_candidates: candidates.slice(0, 10).map((c) => ({
      filePath: c.filePath,
      score: c.score,
      hits: c.hits,
      snippets: c.snippets,
    })),
    most_likely_real_final_decision_writer: candidates[0]
      ? {
          filePath: candidates[0].filePath,
          score: candidates[0].score,
          hits: candidates[0].hits,
          snippets: candidates[0].snippets,
        }
      : null,
  };

  const outputPath = path.join(ROOT, "find_final_decision_report.json");
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf8");

  if (!candidates.length) {
    console.log("No candidates found.");
    console.log(`Report written: ${outputPath}`);
    process.exit(0);
  }

  console.log("");
  console.log("TOP CANDIDATES:");
  console.log("===============");
  for (const candidate of candidates.slice(0, 5)) {
    console.log(`\nFILE: ${candidate.filePath}`);
    console.log(`SCORE: ${candidate.score}`);
    console.log(`HITS: ${candidate.hits.join(", ")}`);
    for (const s of candidate.snippets.slice(0, 8)) {
      console.log(`  [L${s.lineNumber}] ${s.text}`);
    }
  }

  console.log("");
  console.log(`Report written: ${outputPath}`);
}

main();