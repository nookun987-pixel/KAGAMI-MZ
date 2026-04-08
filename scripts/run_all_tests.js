/**
 * MIKAGE — scripts/run_all_tests.js
 * Runs all test suites and reports aggregate results.
 * Usage: node scripts/run_all_tests.js
 */

"use strict";

const { execSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const SUITES = [
  { name: "MIKAGE/control_plane",    file: "MIKAGE/mikage.test.js" },
  { name: "core/state_machine",      file: "core/state_machine.test.js" },
  { name: "control/precheck",        file: "control/precheck.test.js" },
  { name: "middleware",              file: "middleware/middleware.test.js" },
  { name: "translator/guard",       file: "translator/translator_guard.test.js" },
  { name: "translator/ollama",      file: "translator/ollama_translate.test.js" },
  { name: "render",                  file: "render/render.test.js" },
  { name: "critic",                  file: "critic/critic.test.js" },
  { name: "drift",                   file: "drift/drift.test.js" },
  { name: "memory",                  file: "memory/memory.test.js" },
  { name: "orchestrator (e2e)",      file: "orchestrator.test.js" },
];

let totalPassed = 0;
let totalFailed = 0;
const results = [];

console.log("\n" + "=".repeat(60));
console.log("MIKAGE — FULL TEST SUITE");
console.log("=".repeat(60) + "\n");

for (const suite of SUITES) {
  const filePath = path.join(ROOT, suite.file);
  try {
    const output = execSync(`node "${filePath}"`, {
      encoding: "utf-8",
      cwd: ROOT,
      timeout: 60000,
    });

    const match = output.match(/RESULTS:\s*(\d+)\s*passed,\s*(\d+)\s*failed/);
    const p = match ? parseInt(match[1]) : 0;
    const f = match ? parseInt(match[2]) : 0;

    totalPassed += p;
    totalFailed += f;

    const status = f === 0 ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
    results.push({ name: suite.name, passed: p, failed: f, status: f === 0 ? "PASS" : "FAIL" });
    console.log(`  ${status} ${suite.name.padEnd(28)} ${p} passed${f > 0 ? `, ${f} FAILED` : ""}`);

  } catch (err) {
    totalFailed++;
    results.push({ name: suite.name, passed: 0, failed: 1, status: "ERROR" });
    console.log(`  \x1b[31m✗\x1b[0m ${suite.name.padEnd(28)} ERROR: ${err.message.split("\n")[0]}`);
  }
}

console.log("\n" + "-".repeat(60));
console.log(`  TOTAL: ${totalPassed} passed, ${totalFailed} failed`);
console.log("-".repeat(60) + "\n");

process.exit(totalFailed > 0 ? 1 : 0);
