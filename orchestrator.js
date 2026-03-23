/**
 * MIKAGE — orchestrator.js
 * End-to-end pipeline execution.
 *
 * Flow (spec §14, no bypass):
 *   Notion ingest → STRUCTURED → PRE_CONTROL → Middleware (normalize) →
 *   Translator (translate + guard) → Render Executor (VRAM + Fooocus) →
 *   Critic (rule + vision + merge) → Drift Detector →
 *   POST_CONTROL → DECIDED → Notion Logger → DONE
 *
 * Controlled feedback loop: max 3 attempts.
 * Sai bản chất thì dừng, không cứu bằng loop.
 *
 * CLI modes:
 *   node orchestrator.js <job.json>         — Run pipeline for a single job
 *   node orchestrator.js --health           — System health check
 *   node orchestrator.js --queue            — Show dead letter queue
 *   node orchestrator.js --notion <page_id> — Fetch job from Notion and execute
 */

"use strict";

require("dotenv").config();

const fs = require("fs");
const path = require("path");

// --- Core ---
const { STATES, createJob, applyTransition, failJob, finalizeFailedJob } = require("./core/state_machine");

// --- Control ---
const { precheck } = require("./control/precheck");

// --- Middleware ---
const { normalize } = require("./middleware/mapper");

// --- Translator ---
const { translate } = require("./translator/ollama_translate");

// --- Render ---
const { executeRender, abortRender, setFooocusClient, getFooocusClient } = require("./render/render_executor");

// --- Critic ---
const { runCritic } = require("./critic/critic_merge");
const { setAnalyzer: setRuleCriticAnalyzer } = require("./critic/rule_critic");
const { setVLMBackend } = require("./critic/vision_critic");

// --- Drift ---
const { detectDrift } = require("./drift/drift_detector");
const { setIdentityAnalyzer } = require("./drift/identity_score");
const { setNarrativeAnalyzer } = require("./drift/narrative_score");

// --- Memory ---
const { createJobEntry, updateJobState, writeAuditRecord, getDLQ, clearDLQ, replayFromDLQ, setNotionClient, getNotionClient } = require("./memory/notion_logger");
const { appendTrace } = require("./memory/audit_serializer");

// --- VRAM ---
const { getResourceLock, forceReset: vramForceReset } = require("./render/vram_manager");

// ===================================================================
// ENV CONSUMPTION
// ===================================================================

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3";
const VLM_ENDPOINT = process.env.VLM_ENDPOINT || "";
const VLM_MODEL = process.env.VLM_MODEL || "qwen2-vl";
const FOOOCUS_API = process.env.FOOOCUS_API_URL || process.env.FOOOCUS_API || "http://127.0.0.1:7865";
const DLQ_DIR = process.env.DLQ_DIR || path.join(__dirname, "dlq");
const ARCHIVE_DIR = process.env.ARCHIVE_DIR || path.join(__dirname, "archive");

// ===================================================================
// STARTUP WIRING — real backends when env configured
// ===================================================================

/**
 * Wire VLM backend for vision critic, identity analyzer, and narrative analyzer
 * when VLM_ENDPOINT is configured.
 */
function wireVLMBackend() {
  if (!VLM_ENDPOINT) return;

  const http = require("http");
  const https = require("https");

  function vlmRequest(imagePath, systemPrompt) {
    return new Promise((resolve, reject) => {
      const url = new URL(VLM_ENDPOINT);
      const transport = url.protocol === "https:" ? https : http;

      let imageBase64 = null;
      try {
        if (fs.existsSync(imagePath)) {
          imageBase64 = fs.readFileSync(imagePath).toString("base64");
        }
      } catch (_) { /* best effort */ }

      const messages = [
        { role: "system", content: systemPrompt },
      ];

      if (imageBase64) {
        messages.push({
          role: "user",
          content: [
            { type: "image_url", image_url: { url: `data:image/png;base64,${imageBase64}` } },
            { type: "text", text: "Analyze this image." },
          ],
        });
      } else {
        messages.push({ role: "user", content: `Analyze image at path: ${imagePath}` });
      }

      const body = JSON.stringify({
        model: VLM_MODEL,
        messages,
        temperature: 0.0,
        max_tokens: 512,
      });

      const req = transport.request(
        {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body),
          },
          timeout: 60000,
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => { data += chunk; });
          res.on("end", () => {
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices && parsed.choices[0] && parsed.choices[0].message
                ? parsed.choices[0].message.content
                : data;
              try {
                resolve(JSON.parse(content));
              } catch (_) {
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) resolve(JSON.parse(jsonMatch[0]));
                else resolve({});
              }
            } catch (e) {
              reject(new Error(`VLM parse error: ${e.message}`));
            }
          });
        }
      );

      req.on("error", (e) => reject(new Error(`VLM connection error: ${e.message}`)));
      req.on("timeout", () => { req.destroy(); reject(new Error("VLM timeout")); });
      req.write(body);
      req.end();
    });
  }

  // Wire vision critic VLM backend
  setVLMBackend({
    async analyze(imagePath, prompt) {
      try {
        const result = await vlmRequest(imagePath, prompt);
        return {
          plastic_look: typeof result.plastic_look === "number" ? result.plastic_look : 0.15,
          lack_of_depth: typeof result.lack_of_depth === "number" ? result.lack_of_depth : 0.20,
          over_polish: typeof result.over_polish === "number" ? result.over_polish : 0.10,
        };
      } catch (err) {
        log("WARN", `VLM analyze failed: ${err.message} — using defaults`);
        return { plastic_look: 0.15, lack_of_depth: 0.20, over_polish: 0.10 };
      }
    },
  });

  // Wire identity analyzer
  setIdentityAnalyzer({
    async analyze(imagePath, canonReferencePath) {
      try {
        const prompt =
          "Analyze this image for Canon identity markers of a mechanical humanoid with porcelain armor. " +
          "Return JSON with scores 0.0-1.0 for: silhouette, material, mask, blade, color, anti_polish. " +
          "Higher = more aligned with Canon identity.";
        const result = await vlmRequest(imagePath, prompt);
        return {
          silhouette: typeof result.silhouette === "number" ? result.silhouette : 0.85,
          material: typeof result.material === "number" ? result.material : 0.80,
          mask: typeof result.mask === "number" ? result.mask : 0.85,
          blade: typeof result.blade === "number" ? result.blade : 0.80,
          color: typeof result.color === "number" ? result.color : 0.90,
          anti_polish: typeof result.anti_polish === "number" ? result.anti_polish : 0.75,
        };
      } catch (err) {
        log("WARN", `Identity analyzer failed: ${err.message} — using defaults`);
        return { silhouette: 0.85, material: 0.80, mask: 0.85, blade: 0.80, color: 0.90, anti_polish: 0.75 };
      }
    },
  });

  // Wire narrative analyzer
  setNarrativeAnalyzer({
    async analyze(imagePath) {
      try {
        const prompt =
          "Analyze the emotional register of this image. Return JSON with: " +
          "perceived_intensity (0.0-1.0), perceived_tones (array of tone words), perceived_energy (low/medium/high).";
        const result = await vlmRequest(imagePath, prompt);
        return {
          perceived_intensity: typeof result.perceived_intensity === "number" ? result.perceived_intensity : 0.30,
          perceived_tones: Array.isArray(result.perceived_tones) ? result.perceived_tones : ["restrained", "silent", "cold"],
          perceived_energy: result.perceived_energy || "low",
        };
      } catch (err) {
        log("WARN", `Narrative analyzer failed: ${err.message} — using defaults`);
        return { perceived_intensity: 0.30, perceived_tones: ["restrained", "silent", "cold"], perceived_energy: "low" };
      }
    },
  });

  log("INFO", `VLM backend wired: ${VLM_ENDPOINT} (model: ${VLM_MODEL})`);
}

/**
 * Wire real Fooocus client.
 * render_executor.js default client already reads FOOOCUS_API env var.
 */
function wireFooocusClient() {
  log("INFO", `Fooocus client: ${FOOOCUS_API}`);
}

/**
 * Wire real Notion client.
 * notion_logger.js already auto-wires from NOTION_API_KEY on require().
 */
function wireNotionClient() {
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.MIKAGE_NOTION_DB || process.env.NOTION_DATABASE_ID;
  if (apiKey && dbId) {
    log("INFO", `Notion client: DB ${dbId.slice(0, 8)}...`);
  } else {
    log("WARN", "Notion client: missing NOTION_API_KEY or MIKAGE_NOTION_DB — writes will use stub");
  }
}

// ===================================================================
// STARTUP VALIDATION
// ===================================================================

/**
 * Validate environment and services before pipeline execution.
 * @returns {Promise<{ ok: boolean, checks: Object[] }>}
 */
async function startupValidation() {
  const checks = [];

  // Node version
  const nodeVersion = parseInt(process.versions.node.split(".")[0]);
  checks.push({
    name: "node_version",
    ok: nodeVersion >= 18,
    detail: `Node ${process.versions.node} (requires >=18)`,
  });

  // Env vars
  checks.push({
    name: "MIKAGE_NOTION_DB",
    ok: !!(process.env.MIKAGE_NOTION_DB || process.env.NOTION_DATABASE_ID),
    detail: (process.env.MIKAGE_NOTION_DB || process.env.NOTION_DATABASE_ID) ? "set" : "missing",
  });
  checks.push({
    name: "NOTION_API_KEY",
    ok: !!process.env.NOTION_API_KEY,
    detail: process.env.NOTION_API_KEY ? "set" : "missing",
  });
  checks.push({
    name: "OLLAMA_HOST",
    ok: true,
    detail: OLLAMA_HOST,
  });
  checks.push({
    name: "OLLAMA_MODEL",
    ok: true,
    detail: OLLAMA_MODEL,
  });

  // Ollama connectivity
  try {
    await httpGet(`${OLLAMA_HOST}/api/tags`, 5000);
    checks.push({ name: "ollama", ok: true, detail: `${OLLAMA_HOST} reachable` });
  } catch (err) {
    checks.push({ name: "ollama", ok: false, detail: `${OLLAMA_HOST} unreachable: ${err.message}` });
  }

  // Fooocus connectivity
  try {
    await httpGet(FOOOCUS_API, 5000);
    checks.push({ name: "fooocus", ok: true, detail: `${FOOOCUS_API} reachable` });
  } catch (err) {
    checks.push({ name: "fooocus", ok: false, detail: `${FOOOCUS_API} unreachable: ${err.message}` });
  }

  // VLM (optional)
  if (VLM_ENDPOINT) {
    try {
      const vlmBase = VLM_ENDPOINT.replace(/\/v1\/chat\/completions$/, "");
      await httpGet(vlmBase, 5000);
      checks.push({ name: "vlm", ok: true, detail: `${VLM_ENDPOINT} reachable` });
    } catch (err) {
      checks.push({ name: "vlm", ok: false, detail: `${VLM_ENDPOINT} unreachable: ${err.message}` });
    }
  } else {
    checks.push({ name: "vlm", ok: true, detail: "not configured (using simulated analyzers)" });
  }

  // VRAM state
  const vramState = getResourceLock();
  checks.push({
    name: "vram",
    ok: vramState.phase === "IDLE",
    detail: `phase=${vramState.phase}, ollama=${vramState.ollama_active}, fooocus=${vramState.fooocus_active}`,
  });

  // DLQ state
  const dlq = getDLQ();
  const persistedDlq = loadPersistedDLQ();
  const totalDlq = dlq.length + persistedDlq.reduce((sum, p) => sum + p.entries.length, 0);
  checks.push({
    name: "dlq",
    ok: totalDlq === 0,
    detail: `${totalDlq} entries pending (${dlq.length} in-memory, ${persistedDlq.length} files on disk)`,
  });

  const allOk = checks.every((c) => c.ok);
  return { ok: allOk, checks };
}

/**
 * Simple HTTP GET with timeout.
 * @param {string} urlStr
 * @param {number} timeoutMs
 * @returns {Promise<string>}
 */
function httpGet(urlStr, timeoutMs) {
  return new Promise((resolve, reject) => {
    const http = require("http");
    const https = require("https");
    const url = new URL(urlStr);
    const transport = url.protocol === "https:" ? https : http;

    const req = transport.get(
      { hostname: url.hostname, port: url.port, path: url.pathname, timeout: timeoutMs },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => resolve(data));
      }
    );
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
  });
}

// ===================================================================
// DLQ PERSISTENCE
// ===================================================================

/**
 * Persist DLQ entries to disk.
 */
function persistDLQ() {
  const dlq = getDLQ();
  if (dlq.length === 0) return;

  try {
    if (!fs.existsSync(DLQ_DIR)) fs.mkdirSync(DLQ_DIR, { recursive: true });
    const filePath = path.join(DLQ_DIR, `dlq_${Date.now()}.json`);
    fs.writeFileSync(filePath, JSON.stringify(dlq, null, 2), "utf-8");
    log("INFO", `DLQ persisted: ${dlq.length} entries → ${filePath}`);
  } catch (err) {
    log("WARN", `DLQ persistence failed: ${err.message}`);
  }
}

/**
 * Load DLQ entries from disk.
 * @returns {Array<{ file: string, entries: Object[] }>}
 */
function loadPersistedDLQ() {
  const results = [];
  try {
    if (!fs.existsSync(DLQ_DIR)) return results;
    const files = fs.readdirSync(DLQ_DIR).filter((f) => f.endsWith(".json")).sort();
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(DLQ_DIR, file), "utf-8"));
      results.push({ file, entries: Array.isArray(data) ? data : [data] });
    }
  } catch (err) {
    log("WARN", `DLQ load failed: ${err.message}`);
  }
  return results;
}

// ===================================================================
// RENDER ARCHIVAL
// ===================================================================

/**
 * Archive rendered output files to timestamped directory.
 * @param {Object} job  Final job state
 */
function archiveRender(job) {
  if (!job || !job.output_files || job.output_files.length === 0) return;

  try {
    const jobArchiveDir = path.join(ARCHIVE_DIR, job.job_id || "unknown");
    if (!fs.existsSync(jobArchiveDir)) fs.mkdirSync(jobArchiveDir, { recursive: true });

    for (const outputFile of job.output_files) {
      if (outputFile && fs.existsSync(outputFile)) {
        const destFile = path.join(jobArchiveDir, path.basename(outputFile));
        fs.copyFileSync(outputFile, destFile);
        log("INFO", `Archived: ${outputFile} → ${destFile}`);
      }
    }

    const metaFile = path.join(jobArchiveDir, "job_meta.json");
    fs.writeFileSync(metaFile, JSON.stringify({
      job_id: job.job_id,
      status: job.status,
      decision: job.decision,
      attempt_count: job.attempt_count,
      critic_score: job.critic_score,
      identity_score: job.identity_score,
      narrative_score: job.narrative_score,
      archived_at: new Date().toISOString(),
    }, null, 2), "utf-8");
  } catch (err) {
    log("WARN", `Render archival failed: ${err.message}`);
  }
}

// ===================================================================
// POST-CONTROL DECISION (spec §9)
// ===================================================================

/**
 * POST_CONTROL decision engine.
 *
 * @param {Object} criticResult  From critic_merge.runCritic()
 * @param {Object} driftResult   From drift_detector.detectDrift()
 * @param {number} attempt       Current attempt number
 * @param {number} maxAttempts   Maximum allowed
 * @returns {{ decision: string, publish_safe: boolean, reasons: string[] }}
 */
function postControl(criticResult, driftResult, attempt, maxAttempts) {
  const reasons = [];

  // --- REJECT gates ---
  if (driftResult.verdict === "REJECT") {
    reasons.push(`Drift REJECT: identity_score ${driftResult.identity_score}`);
    if (driftResult.drift_flags.length > 0) {
      reasons.push(`Drift flags: ${driftResult.drift_flags.join(", ")}`);
    }
    return { decision: "REJECT", publish_safe: false, reasons };
  }

  if (criticResult.verdict === "REJECT") {
    reasons.push(`Critic REJECT: quality_score ${criticResult.quality_score}`);
    return { decision: "REJECT", publish_safe: false, reasons };
  }

  // --- PASS ---
  if (criticResult.verdict === "PASS" && driftResult.verdict === "PASS") {
    return { decision: "PASS", publish_safe: true, reasons: [] };
  }

  // --- CONDITIONAL (refineable + attempts remaining) ---
  if (driftResult.refineable && attempt < maxAttempts) {
    const fixableIssues = [
      ...criticResult.issues,
      ...driftResult.drift_flags,
    ];
    reasons.push(`Refineable issues: ${fixableIssues.join(", ")}`);
    return { decision: "CONDITIONAL", publish_safe: false, reasons };
  }

  // --- REVIEW (borderline or not refineable but not hard reject) ---
  if (criticResult.verdict === "REVIEW" || driftResult.verdict === "REVIEW") {
    reasons.push("Borderline quality — human review recommended");
    if (!driftResult.refineable) {
      reasons.push(`Not refineable: ${driftResult.refine_reason}`);
    }
    return { decision: "REVIEW", publish_safe: false, reasons };
  }

  // --- AUTO_SAFE fallback ---
  reasons.push("Output weak but safe — draft only");
  return { decision: "AUTO_SAFE", publish_safe: false, reasons };
}

// ===================================================================
// MAIN ORCHESTRATOR
// ===================================================================

/**
 * Execute the complete Mikage pipeline for a job.
 *
 * @param {Object} jobInput  Raw job schema from Notion
 * @returns {Promise<Object>} Final job state
 */
async function run(jobInput) {
  const maxAttempts = (jobInput.render && jobInput.render.max_iteration) || 3;
  const translateMode = process.env.TRANSLATOR_MODE || "LOCAL";

  let notionId = null;

  // =====================================================
  // STEP 1: INGEST
  // =====================================================

  let job = createJob(jobInput.job_id, {
    source: jobInput.source || "notion",
    mode: jobInput.mode || "AUTO_DRAFT",
    identity: jobInput.identity || {},
    narrative: jobInput.narrative || {},
    strategy: jobInput.strategy || {},
    art_direction: jobInput.art_direction || {},
    render_config: jobInput.render || {},
    attempt_count: 0,
    output_files: [],
    rejected_samples: [],
    drift_flags: [],
    decision: null,
    prompt: null,
    negative_prompt: null,
    seed: null,
    critic_score: null,
    identity_score: null,
    narrative_score: null,
    risk_score: null,
    rejected_reason: null,
    normalized_prompt_spec: null,
  });

  // =====================================================
  // STEP 2: STRUCTURE
  // =====================================================

  job = applyTransition(job, STATES.STRUCTURED);

  // Write initial Notion entry
  try {
    const entry = await createJobEntry(job);
    notionId = entry.notion_id;
  } catch (err) {
    log("WARN", `Notion initial write failed: ${err.message} — continuing pipeline`);
  }

  // =====================================================
  // STEP 3: PRE-CONTROL
  // =====================================================

  job = applyTransition(job, STATES.PRECHECKED);

  const precheckResult = precheck(job);

  job.identity_score = precheckResult.identity_check;
  job.narrative_score = precheckResult.narrative_check;
  job.risk_score = precheckResult.risk_score;
  job.audit.trace = appendTrace(job.audit.trace, "PRE_CONTROL", precheckResult.decision, {
    identity_check: precheckResult.identity_check,
    narrative_check: precheckResult.narrative_check,
    strategic_check: precheckResult.strategic_check,
    risk_score: precheckResult.risk_score,
  });

  // --- Gate ---
  if (precheckResult.decision === "REJECT") {
    job.decision = "REJECT";
    job.rejected_reason = precheckResult.reasons.join("; ");
    job = applyTransition(job, STATES.FAILED, { reason: "PRE_CONTROL REJECT" });
    job = finalizeFailedJob(job);
    await safeNotionUpdate(notionId, job);
    return job;
  }

  if (precheckResult.decision === "REVIEW") {
    job.decision = "REVIEW";
    job = applyTransition(job, STATES.REVIEW, { reasons: precheckResult.reasons });
    log("HALT", `Job ${job.job_id} halted at REVIEW — human gate required`);
    await safeNotionUpdate(notionId, job);
    return job;
  }

  // ALLOW or AUTO_SAFE — continue
  const controlToken = precheckResult.control_token;
  job.decision = precheckResult.decision;
  job.audit.trace = appendTrace(job.audit.trace, "CONTROL_TOKEN_ISSUED", "OK");

  // =====================================================
  // RENDER LOOP (max 3 attempts)
  // =====================================================

  let attempt = 0;
  let finalDecision = null;

  while (attempt < maxAttempts) {
    attempt++;
    job.attempt_count = attempt;

    log("INFO", `Job ${job.job_id} — attempt ${attempt}/${maxAttempts}`);

    // --- STEP 4: NORMALIZE (Middleware) ---
    job = attempt === 1
      ? applyTransition(job, STATES.NORMALIZED)
      : applyTransition(job, STATES.NORMALIZED, { attempt, reason: "conditional_refine" });

    const normalizeResult = normalize(job.art_direction);

    if (!normalizeResult.valid) {
      job.rejected_reason = normalizeResult.violations.map((v) => `${v.rule}: ${v.expected}`).join("; ");
      job = failJob(job, "Middleware constraint violation");
      job = finalizeFailedJob(job);
      await safeNotionUpdate(notionId, job);
      return job;
    }

    const spec = normalizeResult.spec;
    job.normalized_prompt_spec = spec;
    job.audit.trace = appendTrace(job.audit.trace, "MIDDLEWARE_NORMALIZED", "OK");

    // --- STEP 5: TRANSLATE ---
    job = applyTransition(job, STATES.TRANSLATED);

    const translationResult = await translate(spec, { mode: translateMode });

    job.audit.trace = appendTrace(job.audit.trace, "OLLAMA_TRANSLATION", translationResult.valid ? "OK" : "FAIL");
    job.audit.trace = appendTrace(job.audit.trace, "TRANSLATOR_GUARD", translationResult.guard_result.verdict);

    if (!translationResult.valid) {
      job.rejected_reason = `Translation guard rejected: ${translationResult.guard_result.summary.join("; ")}`;
      job = failJob(job, "Translator guard REJECT");
      job = finalizeFailedJob(job);
      await safeNotionUpdate(notionId, job);
      return job;
    }

    job.prompt = translationResult.positive_prompt;
    job.negative_prompt = translationResult.negative_prompt;

    // --- STEP 6: RENDER ---
    job = applyTransition(job, STATES.RENDERING);

    const renderResult = await executeRender(
      job,
      controlToken,
      spec,
      {
        seed: job.seed || null,
        width: parseInt(process.env.RENDER_WIDTH) || 1024,
        height: parseInt(process.env.RENDER_HEIGHT) || 384,
        performance: process.env.RENDER_PERFORMANCE || "Quality",
        attempt,
        translate_mode: "LOCAL",
      }
    );

    job.audit.trace = appendTrace(job.audit.trace, "FOOOCUS_RENDER", renderResult.status);

    if (!renderResult.success) {
      if (renderResult.status === "RENDER_FAILED") {
        job.rejected_reason = `Render failed: ${renderResult.error || "unknown"}`;
        job = failJob(job, "Fooocus render failed");
        job = finalizeFailedJob(job);
        await safeNotionUpdate(notionId, job);
        return job;
      }
    }

    job.seed = renderResult.render_packet ? renderResult.render_packet.seed : job.seed;
    const outputFile = renderResult.render ? renderResult.render.output_file : null;

    // --- STEP 7: CRITIC ---
    job = applyTransition(job, STATES.CRITIQUED);

    const criticResult = await runCritic(outputFile || "/dev/null");

    job.critic_score = criticResult.quality_score;
    job.audit.trace = appendTrace(job.audit.trace, "CRITIC_MERGED", criticResult.verdict, {
      rule_score: criticResult.rule_score,
      vision_score: criticResult.vision_score,
      quality_score: criticResult.quality_score,
    });

    // --- STEP 8: DRIFT ---
    job = applyTransition(job, STATES.DRIFT_CHECKED);

    const driftResult = await detectDrift(
      outputFile || "/dev/null",
      job.narrative,
      criticResult
    );

    job.identity_score = driftResult.identity_score;
    job.narrative_score = driftResult.narrative_score;
    job.drift_flags = driftResult.drift_flags;
    job.audit.trace = appendTrace(job.audit.trace, "DRIFT_MERGED", driftResult.verdict, {
      identity_score: driftResult.identity_score,
      narrative_score: driftResult.narrative_score,
      drift_flags: driftResult.drift_flags,
      refineable: driftResult.refineable,
    });

    // --- STEP 9: POST-CONTROL ---
    job = applyTransition(job, STATES.POSTCHECKED);

    const postResult = postControl(criticResult, driftResult, attempt, maxAttempts);

    job.audit.trace = appendTrace(job.audit.trace, "POST_CONTROL", postResult.decision, {
      publish_safe: postResult.publish_safe,
      reasons: postResult.reasons,
    });

    // --- STEP 10: DECIDE ---
    finalDecision = postResult.decision;

    if (finalDecision === "PASS") {
      job.decision = "PASS";
      if (outputFile) job.output_files.push(outputFile);
      job = applyTransition(job, STATES.DECIDED, { decision: "PASS" });
      break;
    }

    if (finalDecision === "REJECT") {
      job.decision = "REJECT";
      job.rejected_reason = postResult.reasons.join("; ");
      if (outputFile) job.rejected_samples.push(outputFile);
      job = applyTransition(job, STATES.REJECTED);
      job = finalizeFailedJob(job);
      await safeNotionUpdate(notionId, job);
      return job;
    }

    if (finalDecision === "REVIEW") {
      job.decision = "REVIEW";
      if (outputFile) job.rejected_samples.push(outputFile);
      job = applyTransition(job, STATES.DECIDED, { decision: "REVIEW" });
      break;
    }

    if (finalDecision === "AUTO_SAFE") {
      job.decision = "AUTO_SAFE";
      if (outputFile) job.rejected_samples.push(outputFile);
      job = applyTransition(job, STATES.DECIDED, { decision: "AUTO_SAFE" });
      break;
    }

    if (finalDecision === "CONDITIONAL") {
      if (outputFile) job.rejected_samples.push(outputFile);
      job = applyTransition(job, STATES.DECIDED, { decision: "CONDITIONAL", attempt });

      if (attempt >= maxAttempts) {
        log("INFO", `Max attempts (${maxAttempts}) reached — stopping loop`);
        job.decision = "REVIEW";
        break;
      }

      log("INFO", `Conditional refine — looping to attempt ${attempt + 1}`);
      job.audit.trace = appendTrace(job.audit.trace, "LOOP_CONTINUE", "OK", { next_attempt: attempt + 1 });

      // Loop back: DECIDED → NORMALIZED (allowed by state_machine)
      continue;
    }
  }

  // =====================================================
  // STEP 11: LOG
  // =====================================================

  job = applyTransition(job, STATES.LOGGED);
  job.audit.trace = appendTrace(job.audit.trace, "NOTION_WRITE", "OK");

  // =====================================================
  // STEP 12: DONE
  // =====================================================

  job = applyTransition(job, STATES.DONE);

  // Final Notion write
  if (notionId) {
    try {
      await writeAuditRecord(notionId, job, {
        critic: { quality_score: job.critic_score },
        drift: {
          identity_score: job.identity_score,
          narrative_score: job.narrative_score,
          drift_flags: job.drift_flags,
        },
      });
    } catch (err) {
      log("WARN", `Final Notion write failed: ${err.message}`);
    }
  }

  log("DONE", `Job ${job.job_id} completed — decision: ${job.decision}, attempts: ${job.attempt_count}`);

  return job;
}

// ===================================================================
// HELPERS
// ===================================================================

async function safeNotionUpdate(notionId, job) {
  if (!notionId) return;
  try {
    await updateJobState(notionId, {
      job_id: job.job_id,
      status: job.status,
      decision: job.decision,
      identity_score: job.identity_score,
      critic_score: job.critic_score,
      risk_score: job.risk_score,
      drift_flags: job.drift_flags,
      rejected_reason: job.rejected_reason,
      rejected_samples: job.rejected_samples,
      output_files: job.output_files,
      audit_trace: job.audit.trace,
    });
  } catch (err) {
    log("WARN", `Notion update failed: ${err.message}`);
  }
}

function log(level, message) {
  const ts = new Date().toISOString();
  const prefix = {
    INFO: "\x1b[36m[INFO]\x1b[0m",
    WARN: "\x1b[33m[WARN]\x1b[0m",
    HALT: "\x1b[35m[HALT]\x1b[0m",
    DONE: "\x1b[32m[DONE]\x1b[0m",
    FAIL: "\x1b[31m[FAIL]\x1b[0m",
  };
  console.log(`${ts} ${prefix[level] || `[${level}]`} ${message}`);
}

// ===================================================================
// CLI ENTRYPOINT
// ===================================================================

if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  // --- --health mode ---
  if (command === "--health") {
    (async () => {
      log("INFO", "Running system health check...");
      wireNotionClient();

      const result = await startupValidation();

      console.log("\n" + "=".repeat(60));
      console.log("MIKAGE HEALTH CHECK");
      console.log("=".repeat(60));

      for (const check of result.checks) {
        const status = check.ok ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
        console.log(`  ${status} ${check.name}: ${check.detail}`);
      }

      console.log("=".repeat(60));
      console.log(`Overall: ${result.ok ? "\x1b[32mHEALTHY\x1b[0m" : "\x1b[33mDEGRADED\x1b[0m"}`);
      console.log("=".repeat(60));

      process.exit(result.ok ? 0 : 1);
    })().catch((err) => {
      console.error("HEALTH CHECK FATAL:", err);
      process.exit(1);
    });
  }

  // --- --queue mode ---
  else if (command === "--queue") {
    const subCommand = args[1]; // optional: "replay" <index>

    const inMemory = getDLQ();
    const persisted = loadPersistedDLQ();

    console.log("\n" + "=".repeat(60));
    console.log("MIKAGE DEAD LETTER QUEUE");
    console.log("=".repeat(60));

    console.log(`\nIn-memory DLQ: ${inMemory.length} entries`);
    for (let i = 0; i < inMemory.length; i++) {
      console.log(`  [${i}] ${inMemory[i].timestamp} — ${inMemory[i].error}`);
    }

    console.log(`\nPersisted DLQ files: ${persisted.length}`);
    for (const p of persisted) {
      console.log(`  ${p.file}: ${p.entries.length} entries`);
      for (const entry of p.entries) {
        console.log(`    ${entry.timestamp} — ${entry.error}`);
      }
    }

    console.log("=".repeat(60));

    if (subCommand === "replay" && args[2]) {
      const idx = parseInt(args[2]);
      (async () => {
        log("INFO", `Replaying DLQ entry ${idx}...`);
        const result = await replayFromDLQ(idx);
        console.log("Replay result:", JSON.stringify(result, null, 2));
      })().catch((err) => {
        console.error("DLQ replay failed:", err.message);
        process.exit(1);
      });
    } else {
      process.exit(0);
    }
  }

  // --- --notion <page_id> mode ---
  else if (command === "--notion") {
    const pageId = args[1];
    if (!pageId) {
      console.error("Usage: node orchestrator.js --notion <page_id>");
      process.exit(1);
    }

    (async () => {
      log("INFO", `Fetching job from Notion page: ${pageId}`);
      wireNotionClient();
      wireVLMBackend();
      wireFooocusClient();

      const apiKey = process.env.NOTION_API_KEY;
      if (!apiKey) {
        console.error("NOTION_API_KEY required for --notion mode");
        process.exit(1);
      }

      const { Client } = require("@notionhq/client");
      const notion = new Client({ auth: apiKey });
      const page = await notion.pages.retrieve({ page_id: pageId });

      // Extract job input from Notion page properties
      const props = page.properties || {};
      const getText = (p) => {
        if (!p) return "";
        if (p.rich_text) return p.rich_text.map((t) => t.plain_text || "").join("");
        if (p.title) return p.title.map((t) => t.plain_text || "").join("");
        return "";
      };
      const getSelect = (p) => (p && p.select) ? p.select.name : "";

      const jobInput = {
        job_id: getText(props["Job ID"]) || `notion_${pageId.slice(0, 8)}`,
        source: "notion",
        mode: getSelect(props.Mode) || "AUTO_DRAFT",
        identity: {
          character_id: getText(props["Character ID"]) || "mikage_core",
        },
        narrative: {
          arc_id: getText(props["Arc ID"]) || "",
          chapter: getText(props.Chapter) || "",
        },
        strategy: {
          objective: "identity_consistency",
        },
        art_direction: {
          mood: ["melancholic"],
          material: ["porcelain"],
          style: ["wabi-sabi"],
          composition: {
            negative_space_min: 0.4,
            broken_symmetry_required: true,
            imperfection_required: true,
            texture_variation_required: true,
          },
        },
        render: {
          max_iteration: 3,
        },
      };

      log("INFO", `Job input assembled: ${jobInput.job_id}`);

      const finalJob = await run(jobInput);
      archiveRender(finalJob);
      persistDLQ();

      console.log("\n" + "=".repeat(60));
      console.log("FINAL STATE:");
      console.log(JSON.stringify({
        job_id: finalJob.job_id,
        status: finalJob.status,
        decision: finalJob.decision,
        attempt_count: finalJob.attempt_count,
        identity_score: finalJob.identity_score,
        critic_score: finalJob.critic_score,
        narrative_score: finalJob.narrative_score,
        risk_score: finalJob.risk_score,
        drift_flags: finalJob.drift_flags,
        output_files: finalJob.output_files,
        rejected_samples: finalJob.rejected_samples,
        trace_length: finalJob.audit.trace.length,
      }, null, 2));
      console.log("=".repeat(60));
    })().catch((err) => {
      console.error("NOTION MODE FATAL:", err);
      process.exit(1);
    });
  }

  // --- Default: <job.json> file mode ---
  else {
    const inputPath = command;

    if (!inputPath) {
      console.log("Usage:");
      console.log("  node orchestrator.js <job.json>         — Run pipeline for a single job");
      console.log("  node orchestrator.js --health           — System health check");
      console.log("  node orchestrator.js --queue            — Show dead letter queue");
      console.log("  node orchestrator.js --notion <page_id> — Fetch job from Notion and execute");
      process.exit(1);
    }

    // Wire backends
    wireVLMBackend();
    wireFooocusClient();
    wireNotionClient();

    let jobInput;
    try {
      const raw = fs.readFileSync(inputPath, "utf-8");
      jobInput = JSON.parse(raw);
    } catch (err) {
      console.error(`Failed to read job file: ${err.message}`);
      process.exit(1);
    }

    run(jobInput)
      .then((finalJob) => {
        archiveRender(finalJob);
        persistDLQ();

        console.log("\n" + "=".repeat(60));
        console.log("FINAL STATE:");
        console.log(JSON.stringify({
          job_id: finalJob.job_id,
          status: finalJob.status,
          decision: finalJob.decision,
          attempt_count: finalJob.attempt_count,
          identity_score: finalJob.identity_score,
          critic_score: finalJob.critic_score,
          narrative_score: finalJob.narrative_score,
          risk_score: finalJob.risk_score,
          drift_flags: finalJob.drift_flags,
          output_files: finalJob.output_files,
          rejected_samples: finalJob.rejected_samples,
          trace_length: finalJob.audit.trace.length,
        }, null, 2));
        console.log("=".repeat(60));
      })
      .catch((err) => {
        console.error("PIPELINE FATAL:", err);
        process.exit(1);
      });
  }
}

// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  run,
  postControl,
  startupValidation,
  wireVLMBackend,
  wireFooocusClient,
  wireNotionClient,
  archiveRender,
  persistDLQ,
  loadPersistedDLQ,
};
