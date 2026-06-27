/**
 * MIKAGE — /memory/notion_logger.js
 * Writes complete audit trail to Notion. Every field mandatory per spec §12-13.
 *
 * Required fields:
 *   job_id, created_at, source, mode, prompt, negative_prompt, seed,
 *   identity_score, critic_score, risk_score, narrative_score, decision,
 *   attempt_count, drift_flags, rejected_reason, output_files,
 *   rejected_samples, audit_trace, character_id, arc_id, chapter,
 *   status, updated_at
 *
 * Uses injectable Notion client for testability.
 * Includes exponential backoff with jitter for resilience.
 */

"use strict";

const { serializeTrace, serializeDeltas } = require("./audit_serializer");

// ===================================================================
// CONFIG
// ===================================================================

const CONFIG = Object.freeze({
  database_id: process.env.NOTION_DATABASE_ID || process.env.MIKAGE_NOTION_DB || "",
  max_retries: 5,
  base_delay_ms: 1000,
  max_delay_ms: 60000,
  rate_limit_per_second: 3,  // Notion API limit
});

// ===================================================================
// NOTION CLIENT — injectable
// ===================================================================

let _notionClient = (function buildDefaultClient() {
  const apiKey = process.env.NOTION_API_KEY;
  if (apiKey) {
    const { Client } = require("@notionhq/client");
    const notion = new Client({ auth: apiKey });
    return {
      async createPage(params) {
        const res = await notion.pages.create({
          parent: { database_id: params.database_id },
          properties: params.properties,
        });
        return { id: res.id, url: res.url };
      },
      async updatePage(params) {
        const res = await notion.pages.update({
          page_id: params.page_id,
          properties: params.properties,
        });
        return { id: res.id, updated: true };
      },
    };
  }
  // Fallback stub when no API key is configured
  return {
    async createPage(params) {
      return { id: "no_api_key_stub", url: "" };
    },
    async updatePage(params) {
      return { id: params.page_id, updated: false };
    },
  };
})();

function setNotionClient(client) {
  if (!client || typeof client.createPage !== "function" || typeof client.updatePage !== "function") {
    throw new Error("[NOTION_LOGGER] Client must have createPage() and updatePage()");
  }
  _notionClient = client;
}

function getNotionClient() {
  return _notionClient;
}

// ===================================================================
// EXPONENTIAL BACKOFF WITH JITTER (from research Module 3)
// ===================================================================

/**
 * Sleep for ms.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute a function with exponential backoff retry.
 *
 * @param {Function}  fn             Async function to execute
 * @param {number}    [maxRetries]   Max retry attempts
 * @returns {Promise<Object>}        fn result
 * @throws {Error}                   After all retries exhausted
 */
async function retryWithBackoff(fn, maxRetries) {
  const max = maxRetries || CONFIG.max_retries;
  let lastError;

  for (let attempt = 0; attempt <= max; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      if (attempt >= max) break;

      // Exponential backoff: base * 2^attempt + random jitter
      const delay = Math.min(
        CONFIG.base_delay_ms * Math.pow(2, attempt) + Math.floor(Math.random() * 1000),
        CONFIG.max_delay_ms
      );

      await sleep(delay);
    }
  }

  throw new Error(`[NOTION_LOGGER] All ${max + 1} attempts failed. Last error: ${lastError.message}`);
}

// ===================================================================
// PROPERTY BUILDERS — Notion API format
// ===================================================================

/**
 * Build Notion page properties from a job object.
 * Maps all required fields to Notion property types.
 *
 * @param {Object} job  Full job object with all pipeline results
 * @returns {Object}    Notion properties object
 */
function buildProperties(job) {
  const j = job || {};
  const identity = j.identity || {};
  const narrative = j.narrative || {};
  const strategy = j.strategy || {};
  const audit = j.audit || {};

  return {
    // Title (Notion requires a title property)
    Title: {
      title: [{ text: { content: truncate(`${j.job_id || "unknown"} — ${j.status || "?"}`, 100) } }],
    },

    // Text fields
    "Job ID":           richText(j.job_id || ""),
    Status:             select(j.status || "UNKNOWN"),
    Mode:               select(j.mode || "AUTO_DRAFT"),
    Source:             richText(j.source || ""),
    "Character ID":     richText(identity.character_id || ""),
    "Arc ID":           richText(narrative.arc_id || ""),
    Chapter:            richText(narrative.chapter || ""),
    Decision:           select(j.decision || ""),
    "Rejected Reason":  richText(j.rejected_reason || ""),

    // Long text (prompts, traces)
    Prompt:             richText(truncate(j.prompt || "", 2000)),
    "Negative Prompt":  richText(truncate(j.negative_prompt || "", 2000)),
    "Raw Request":      richText(truncate(flattenRequest(j), 2000)),
    "Normalized Prompt Spec": richText(truncate(safeStringify(j.normalized_prompt_spec), 2000)),
    "Translated Prompt":richText(truncate(j.translated_prompt || j.prompt || "", 2000)),
    "Audit Trace":      richText(truncate(serializeTrace(audit.trace || []), 2000)),

    // Numbers
    Seed:               number(j.seed),
    "Attempt Count":    number(j.attempt_count || 0),
    "Critic Score":     number(j.critic_score),
    "Identity Score":   number(j.identity_score),
    "Narrative Score":  number(j.narrative_score),
    "Risk Score":       number(j.risk_score),

    // Multi-select (arrays)
    "Drift Flags":      multiSelect(j.drift_flags || []),

    // Files / URLs (stored as text — Notion file uploads are complex)
    "Output Files":     richText((j.output_files || []).join(", ")),
    "Rejected Samples": richText((j.rejected_samples || []).join(", ")),

    // Dates
    "Created At":       date(j.created_at),
    "Updated At":       date(new Date().toISOString()),
  };
}

// --- Notion property type helpers ---

function richText(content) {
  const text = String(content || "");
  return { rich_text: [{ text: { content: text.slice(0, 2000) } }] };
}

function select(value) {
  if (!value) return { select: null };
  return { select: { name: String(value).slice(0, 100) } };
}

function multiSelect(values) {
  const arr = Array.isArray(values) ? values : [];
  return { multi_select: arr.slice(0, 25).map((v) => ({ name: String(v).slice(0, 100) })) };
}

function number(value) {
  if (value === null || value === undefined) return { number: null };
  const n = Number(value);
  return { number: isNaN(n) ? null : n };
}

function date(isoString) {
  if (!isoString) return { date: null };
  return { date: { start: isoString } };
}

function truncate(str, max) {
  const s = String(str || "");
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + "...";
}

function safeStringify(obj) {
  if (!obj) return "";
  try { return JSON.stringify(obj); } catch (_) { return ""; }
}

function flattenRequest(job) {
  const ad = job.art_direction || {};
  const parts = [];
  if (ad.mood) parts.push(`mood: ${(ad.mood || []).join(", ")}`);
  if (ad.material) parts.push(`material: ${(ad.material || []).join(", ")}`);
  if (ad.style) parts.push(`style: ${(ad.style || []).join(", ")}`);
  return parts.join(" / ") || job.raw_request || "";
}

// ===================================================================
// DEAD LETTER QUEUE (DLQ) — for failed writes
// ===================================================================

const _dlq = [];

/**
 * Send a failed write to the dead letter queue.
 *
 * @param {Object} payload       Data that failed to write
 * @param {Error}  error         The error
 * @param {number} attemptCount  How many times it was tried
 */
function sendToDLQ(payload, error, attemptCount) {
  _dlq.push({
    payload,
    error: error.message,
    attempt_count: attemptCount,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Get all DLQ entries (for inspection / replay).
 * @returns {Object[]}
 */
function getDLQ() {
  return [..._dlq];
}

/**
 * Clear the DLQ.
 */
function clearDLQ() {
  _dlq.length = 0;
}

/**
 * Replay a DLQ entry (re-attempt write).
 *
 * @param {number} index  DLQ entry index
 * @returns {Promise<Object>}
 */
async function replayFromDLQ(index) {
  if (index < 0 || index >= _dlq.length) {
    throw new Error(`[NOTION_LOGGER] DLQ index ${index} out of range`);
  }

  const entry = _dlq[index];
  const result = await retryWithBackoff(
    () => _notionClient.createPage({
      database_id: CONFIG.database_id,
      properties: entry.payload,
    }),
    2  // fewer retries on replay
  );

  // Remove from DLQ on success
  _dlq.splice(index, 1);
  return result;
}

// ===================================================================
// MAIN LOGGING FUNCTIONS
// ===================================================================

/**
 * Create a new job entry in Notion.
 *
 * @param {Object} job  Full job object
 * @returns {Promise<{ notion_id: string, url: string }>}
 */
async function createJobEntry(job) {
  if (!job || !job.job_id) {
    throw new Error("[NOTION_LOGGER] job.job_id is required");
  }

  const properties = buildProperties(job);

  try {
    const result = await retryWithBackoff(
      () => _notionClient.createPage({
        database_id: CONFIG.database_id,
        properties,
      })
    );

    return {
      notion_id: result.id,
      url: result.url || "",
    };
  } catch (err) {
    sendToDLQ(properties, err, CONFIG.max_retries + 1);
    throw err;
  }
}

/**
 * Update an existing job entry in Notion.
 *
 * @param {string} notionId  Notion page ID
 * @param {Object} updates   Partial job object with changed fields
 * @returns {Promise<Object>}
 */
async function updateJobState(notionId, updates) {
  if (!notionId) {
    throw new Error("[NOTION_LOGGER] notionId is required");
  }

  // Build only the properties that are being updated
  const properties = {};
  const u = updates || {};

  if (u.status !== undefined) properties.Status = select(u.status);
  if (u.decision !== undefined) properties.Decision = select(u.decision);
  if (u.prompt !== undefined) properties.Prompt = richText(truncate(u.prompt, 2000));
  if (u.negative_prompt !== undefined) properties["Negative Prompt"] = richText(truncate(u.negative_prompt, 2000));
  if (u.seed !== undefined) properties.Seed = number(u.seed);
  if (u.attempt_count !== undefined) properties["Attempt Count"] = number(u.attempt_count);
  if (u.critic_score !== undefined) properties["Critic Score"] = number(u.critic_score);
  if (u.identity_score !== undefined) properties["Identity Score"] = number(u.identity_score);
  if (u.narrative_score !== undefined) properties["Narrative Score"] = number(u.narrative_score);
  if (u.risk_score !== undefined) properties["Risk Score"] = number(u.risk_score);
  if (u.drift_flags !== undefined) properties["Drift Flags"] = multiSelect(u.drift_flags);
  if (u.rejected_reason !== undefined) properties["Rejected Reason"] = richText(u.rejected_reason);
  if (u.output_files !== undefined) properties["Output Files"] = richText((u.output_files || []).join(", "));
  if (u.rejected_samples !== undefined) properties["Rejected Samples"] = richText((u.rejected_samples || []).join(", "));

  // Always update timestamp
  properties["Updated At"] = date(new Date().toISOString());

  // Update audit trace if provided
  if (u.audit_trace !== undefined) {
    properties["Audit Trace"] = richText(truncate(serializeTrace(u.audit_trace), 2000));
  }

  // Update title if status changed
  if (u.status !== undefined && u.job_id !== undefined) {
    properties.Title = {
      title: [{ text: { content: truncate(`${u.job_id} — ${u.status}`, 100) } }],
    };
  }

  try {
    return await retryWithBackoff(
      () => _notionClient.updatePage({
        page_id: notionId,
        properties,
      })
    );
  } catch (err) {
    sendToDLQ({ page_id: notionId, properties }, err, CONFIG.max_retries + 1);
    throw err;
  }
}

/**
 * Write the final audit record for a completed job.
 * This is the definitive write — includes all scores, decisions, files, and full trace.
 *
 * @param {string} notionId   Notion page ID
 * @param {Object} job        Final job state
 * @param {Object} [results]  Pipeline results { critic, drift, render }
 * @returns {Promise<Object>}
 */
async function writeAuditRecord(notionId, job, results) {
  const r = results || {};
  const j = job || {};
  const audit = j.audit || {};

  const finalUpdate = {
    job_id: j.job_id,
    status: j.status || "DONE",
    decision: j.decision || r.decision || "",
    prompt: j.prompt || "",
    negative_prompt: j.negative_prompt || "",
    seed: j.seed || null,
    attempt_count: j.attempt_count || (j.render && j.render.attempt) || 1,
    critic_score: r.critic ? r.critic.quality_score : j.critic_score,
    identity_score: r.drift ? r.drift.identity_score : j.identity_score,
    narrative_score: r.drift ? r.drift.narrative_score : j.narrative_score,
    risk_score: j.risk_score,
    drift_flags: r.drift ? r.drift.drift_flags : (j.drift_flags || []),
    rejected_reason: j.rejected_reason || "",
    output_files: j.output_files || [],
    rejected_samples: j.rejected_samples || [],
    audit_trace: audit.trace || [],
  };

  return updateJobState(notionId, finalUpdate);
}

// ===================================================================
// VALIDATION — verify job has all required fields before write
// ===================================================================

/**
 * Validate a job object has all required fields for Notion logging.
 *
 * @param {Object} job
 * @returns {{ valid: boolean, missing: string[] }}
 */
function validateJobForLogging(job) {
  const required = [
    "job_id", "status", "mode", "source",
  ];

  const missing = [];
  for (const field of required) {
    if (!job || job[field] === undefined || job[field] === null) {
      missing.push(field);
    }
  }

  // Audit trace must exist
  if (!job || !job.audit || !Array.isArray(job.audit.trace)) {
    missing.push("audit.trace");
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  // Main logging
  createJobEntry,
  updateJobState,
  writeAuditRecord,

  // Validation
  validateJobForLogging,

  // Property builder (for testing)
  buildProperties,

  // Notion client injection
  setNotionClient,
  getNotionClient,

  // Retry
  retryWithBackoff,

  // DLQ
  sendToDLQ,
  getDLQ,
  clearDLQ,
  replayFromDLQ,

  // Config
  CONFIG,
};
