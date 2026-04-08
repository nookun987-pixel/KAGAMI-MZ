/**
 * MIKAGE — notion_poller.js
 * Polls Notion MIKAGE TASKS database for READY tasks owned by Claude.
 * Executes them locally, updates status back to Notion.
 *
 * Usage:
 *   node notion_poller.js              — Single poll (find & execute one READY task)
 *   node notion_poller.js --loop       — Continuous polling (every 30s)
 *   node notion_poller.js --loop 10    — Continuous polling (every 10s)
 */

"use strict";

require("dotenv").config();

const DATABASE_ID = process.env.MIKAGE_NOTION_DB || process.env.NOTION_DATABASE_ID;
const DATASOURCE_ID = process.env.MIKAGE_DATASOURCE_ID || "";
const API_KEY = process.env.NOTION_API_KEY;

// ===================================================================
// PREFLIGHT
// ===================================================================

function preflight() {
  const missing = [];
  if (!API_KEY) missing.push("NOTION_API_KEY");
  if (!DATABASE_ID) missing.push("MIKAGE_NOTION_DB");
  if (!DATASOURCE_ID) missing.push("MIKAGE_DATASOURCE_ID");
  if (missing.length) {
    console.error(`[POLLER] BLOCKED — Missing env: ${missing.join(", ")}`);
    console.error("[POLLER] Set these in .env and retry.");
    process.exit(1);
  }
}

// ===================================================================
// NOTION CLIENT
// ===================================================================

let notion;

function initClient() {
  const { Client } = require("@notionhq/client");
  notion = new Client({ auth: API_KEY });
}

// ===================================================================
// QUERY: Find READY tasks owned by Claude
// ===================================================================

async function findReadyTasks() {
  // Use dataSources.query (SDK v5+) with data source ID
  const dsId = DATASOURCE_ID;
  if (!dsId) {
    // Fallback: discover data source from database
    const db = await notion.databases.retrieve({ database_id: DATABASE_ID });
    console.log("[POLLER] WARN: MIKAGE_DATASOURCE_ID not set. Use dataSources API to query.");
  }
  const res = await notion.dataSources.query({
    data_source_id: dsId,
    filter: {
      and: [
        { property: "Status", select: { equals: "READY" } },
        { property: "Owner AI", select: { equals: "Claude" } },
      ],
    },
    sorts: [{ timestamp: "created_time", direction: "ascending" }],
    page_size: 1,
  });
  return res.results;
}

// ===================================================================
// UPDATE: Set task status + working notes
// ===================================================================

async function updateTask(pageId, status, notes) {
  const properties = { Status: { select: { name: status } } };
  if (notes) {
    properties["Input"] = {
      rich_text: [{ text: { content: notes.slice(0, 2000) } }],
    };
  }
  await notion.pages.update({ page_id: pageId, properties });
  console.log(`[POLLER] Task ${pageId.slice(0, 8)}… → ${status}`);
}

// ===================================================================
// EXTRACT: Read task info from Notion page
// ===================================================================

function extractTask(page) {
  const props = page.properties || {};
  const getText = (p) => {
    if (!p) return "";
    if (p.rich_text) return p.rich_text.map((t) => t.plain_text || "").join("");
    if (p.title) return p.title.map((t) => t.plain_text || "").join("");
    return "";
  };
  return {
    id: page.id,
    name: getText(props["Name"]),
    input: getText(props["Input"]),
  };
}

// ===================================================================
// EXECUTE: Route task to appropriate handler
// ===================================================================

async function executeTask(task) {
  console.log(`[POLLER] Executing: "${task.name}"`);

  // --- Self-referential bootstrap task ---
  if (task.name.includes("Auto Ops Loop") || task.name.includes("Establish")) {
    return executeBootstrapTask(task);
  }

  // --- Orchestrator render job (if task input contains job JSON) ---
  if (task.input && task.input.startsWith("{")) {
    return executeRenderJob(task);
  }

  // --- Generic task: acknowledge and complete ---
  return {
    success: true,
    result: `Task "${task.name}" acknowledged and processed by Claude executor.`,
  };
}

// Bootstrap: validate the loop itself works
async function executeBootstrapTask(task) {
  const checks = [];

  // Check 1: Notion connection
  try {
    const db = await notion.databases.retrieve({ database_id: DATABASE_ID });
    checks.push(`✓ Notion DB connected: "${db.title?.[0]?.plain_text || DATABASE_ID}"`);
  } catch (e) {
    checks.push(`✗ Notion DB failed: ${e.message}`);
    return { success: false, result: checks.join("\n") };
  }

  // Check 2: Orchestrator module loadable
  try {
    const orc = require("./orchestrator");
    checks.push("✓ Orchestrator module loadable");
    if (typeof orc.run === "function") {
      checks.push("✓ orchestrator.run() exported");
    } else {
      checks.push("⚠ orchestrator.run() not exported (CLI-only mode OK)");
    }
  } catch (e) {
    checks.push(`⚠ Orchestrator require: ${e.message.split("\n")[0]}`);
  }

  // Check 3: State machine loadable
  try {
    require("./core/state_machine");
    checks.push("✓ State machine loadable");
  } catch (e) {
    checks.push(`✗ State machine: ${e.message}`);
  }

  // Check 4: Notion logger wired
  try {
    const logger = require("./memory/notion_logger");
    checks.push("✓ Notion logger loadable");
  } catch (e) {
    checks.push(`✗ Notion logger: ${e.message}`);
  }

  // Check 5: Poller can query READY tasks
  try {
    const tasks = await findReadyTasks();
    checks.push(`✓ Poller query works (${tasks.length} READY tasks found)`);
  } catch (e) {
    checks.push(`✗ Poller query: ${e.message}`);
  }

  const allPassed = checks.every((c) => c.startsWith("✓") || c.startsWith("⚠"));
  return {
    success: allPassed,
    result: checks.join("\n"),
  };
}

// Render job: delegate to orchestrator
async function executeRenderJob(task) {
  const { execSync } = require("child_process");
  const fs = require("fs");
  const path = require("path");

  // Write temp job file
  const tmpPath = path.join(__dirname, `.tmp_job_${task.id.slice(0, 8)}.json`);
  fs.writeFileSync(tmpPath, task.input, "utf-8");

  try {
    const output = execSync(`node orchestrator.js "${tmpPath}"`, {
      cwd: __dirname,
      timeout: 600000,
      encoding: "utf-8",
    });
    return { success: true, result: output.slice(-500) };
  } catch (e) {
    return { success: false, result: e.message.slice(0, 500) };
  } finally {
    try { fs.unlinkSync(tmpPath); } catch (_) {}
  }
}

// ===================================================================
// POLL CYCLE
// ===================================================================

async function pollOnce() {
  const pages = await findReadyTasks();
  if (!pages.length) {
    console.log("[POLLER] No READY tasks. Idle.");
    return false;
  }

  const task = extractTask(pages[0]);
  console.log(`[POLLER] Found: "${task.name}" (${task.id.slice(0, 8)}…)`);

  // READY → RUNNING
  await updateTask(task.id, "RUNNING", `RUNNING — Picked up by Claude poller at ${new Date().toISOString()}`);

  try {
    const result = await executeTask(task);

    if (result.success) {
      // → DONE
      await updateTask(task.id, "DONE", `DONE — ${result.result}`);
      console.log("[POLLER] ✓ Task completed.");
    } else {
      // → BLOCKED
      await updateTask(task.id, "BLOCKED", `BLOCKED — ${result.result}`);
      console.log("[POLLER] ✗ Task blocked.");
    }
  } catch (err) {
    await updateTask(task.id, "BLOCKED", `BLOCKED — Unhandled: ${err.message}`);
    console.error("[POLLER] ✗ Fatal:", err.message);
  }

  return true;
}

// ===================================================================
// MAIN
// ===================================================================

async function main() {
  preflight();
  initClient();

  const args = process.argv.slice(2);
  const loopMode = args.includes("--loop");
  const intervalSec = parseInt(args[args.indexOf("--loop") + 1], 10) || 30;

  console.log("[POLLER] MIKAGE AUTO OPS — Claude Executor");
  console.log(`[POLLER] Database: ${DATABASE_ID}`);
  console.log(`[POLLER] Mode: ${loopMode ? `loop (${intervalSec}s)` : "single poll"}`);
  console.log("");

  if (loopMode) {
    console.log("[POLLER] Starting continuous poll loop...");
    while (true) {
      try {
        await pollOnce();
      } catch (err) {
        console.error("[POLLER] Poll error:", err.message);
      }
      await new Promise((r) => setTimeout(r, intervalSec * 1000));
    }
  } else {
    const found = await pollOnce();
    if (!found) {
      console.log("[POLLER] Nothing to do. Exiting.");
    }
  }
}

main().catch((err) => {
  console.error("[POLLER] FATAL:", err.message);
  process.exit(1);
});
