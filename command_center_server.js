#!/usr/bin/env node
"use strict";

const path = require("path");
const ROOT = __dirname;
require("dotenv").config({ path: path.join(ROOT, ".env") });

const http = require("http");
const fs = require("fs");
const { spawn, exec } = require("child_process");

const PORT = 3030;
const STATE_FILE = path.join(ROOT, ".command_center_state.json");
const HTML_FILE = path.join(ROOT, "command-center.html");
const DEFAULT_JOB_ID = "mask-macro-001";
const RUNS_DIR = path.join(ROOT, "runs");
const JOBS_DIR = path.join(ROOT, "jobs");
const QUEUE_FILE = path.join(ROOT, "queue", "jobs.json");
let activeRun = null;

// ── helpers ──────────────────────────────────────────────────────────

function nowIso() {
  return new Date().toISOString();
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return null;
  }
}

function readState() {
  const base = {
    fooocusPid: null,
    runtimePid: null,
    lastActionAt: null,
    lastLog: "",
    selectedJobId: DEFAULT_JOB_ID,
    currentStep: "IDLE",
    runState: "IDLE",
    latestServerMessage: "",
    latestErrorMessage: "",
    activeJobId: null,
    activeRunLabel: null,
    transitionHistory: [],
    runStatusByJob: {},
    lastStatusWriteSource: null,
    lastStatusReadSource: null,
  };
  try {
    if (!fs.existsSync(STATE_FILE)) return base;
    return { ...base, ...JSON.parse(fs.readFileSync(STATE_FILE, "utf8")) };
  } catch (_) {
    return base;
  }
}

function writeState(next) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(next, null, 2), "utf8");
}

function appendLog(message) {
  const state = readState();
  const line = `[${nowIso()}] ${message}`;
  state.lastActionAt = nowIso();
  state.lastLog = `${line}\n\n${state.lastLog || ""}`.slice(0, 120000);
  writeState(state);
}

function updateState(patch) {
  const state = readState();
  const next = { ...state, ...patch };
  writeState(next);
  return next;
}

function trimHistory(items, max = 60) {
  return Array.isArray(items) ? items.slice(-max) : [];
}

function getJobRuntimeState(state, jobId) {
  const existing = state.runStatusByJob && state.runStatusByJob[jobId];
  return {
    job_id: jobId,
    state: "QUEUED",
    current_step: "JOB_CREATED",
    latest_server_message: "",
    latest_error_message: "",
    state_history: [],
    step_history: [],
    updated_at: null,
    status_write_source: null,
    last_message_at: null,
    ...existing,
  };
}

function appendTransition(history, nextValue, source, message) {
  if (!nextValue) return trimHistory(history);
  const last = Array.isArray(history) && history.length ? history[history.length - 1] : null;
  if (last && last.value === nextValue && last.source === source && last.message === message) {
    return trimHistory(history);
  }
  return trimHistory([
    ...(Array.isArray(history) ? history : []),
    {
      value: nextValue,
      at: nowIso(),
      source,
      message: message || "",
    },
  ]);
}

function rankStep(step) {
  const order = [
    "IDLE",
    "JOB_CREATED",
    "RUN_STARTED",
    "GEMINI_INTAKE",
    "PRECHECK",
    "CLAUDE_SPEC",
    "RENDER",
    "VALIDATOR",
    "JUDGE",
    "DONE",
    "REJECT",
    "FAIL",
  ];
  const index = order.indexOf(String(step || "").toUpperCase());
  return index === -1 ? 0 : index;
}

function pickDominantStep(currentStep, candidateStep) {
  if (!candidateStep) return currentStep || "IDLE";
  if (!currentStep) return candidateStep;
  const currentUpper = String(currentStep).toUpperCase();
  const candidateUpper = String(candidateStep).toUpperCase();
  if (["DONE", "REJECT", "FAIL"].includes(candidateUpper)) return candidateStep;
  if (["DONE", "REJECT", "FAIL"].includes(currentUpper)) return currentStep;
  return rankStep(candidateUpper) >= rankStep(currentUpper) ? candidateStep : currentStep;
}

function persistRunStatus(jobId, patch = {}, source = "unknown") {
  const state = readState();
  const jobState = getJobRuntimeState(state, jobId);
  const next = { ...jobState };

  if (patch.state) {
    next.state = patch.state;
    next.state_history = appendTransition(next.state_history, patch.state, source, patch.message || patch.latest_server_message || "");
  }
  if (patch.current_step) {
    const resolvedStep = pickDominantStep(next.current_step, patch.current_step);
    if (resolvedStep !== next.current_step || !Array.isArray(next.step_history) || next.step_history.length === 0) {
      next.current_step = resolvedStep;
      next.step_history = appendTransition(next.step_history, resolvedStep, source, patch.message || patch.latest_server_message || "");
    }
  }
  if (Object.prototype.hasOwnProperty.call(patch, "latest_server_message")) {
    next.latest_server_message = patch.latest_server_message || "";
  }
  if (Object.prototype.hasOwnProperty.call(patch, "latest_error_message")) {
    next.latest_error_message = patch.latest_error_message || "";
  }
  next.updated_at = nowIso();
  next.status_write_source = source;
  next.last_message_at = nowIso();

  state.runStatusByJob = state.runStatusByJob || {};
  state.runStatusByJob[jobId] = next;
  state.transitionHistory = trimHistory([
    ...(Array.isArray(state.transitionHistory) ? state.transitionHistory : []),
    {
      at: nowIso(),
      job_id: jobId,
      state: next.state,
      current_step: next.current_step,
      source,
      message: patch.message || patch.latest_server_message || patch.latest_error_message || "",
    },
  ]);
  state.lastStatusWriteSource = source;
  if (state.activeJobId === jobId || state.selectedJobId === jobId || patch.promote_selected === true) {
    state.selectedJobId = jobId;
    state.currentStep = next.current_step;
    state.runState = next.state;
    if (Object.prototype.hasOwnProperty.call(patch, "latest_server_message")) {
      state.latestServerMessage = next.latest_server_message;
    }
    if (Object.prototype.hasOwnProperty.call(patch, "latest_error_message")) {
      state.latestErrorMessage = next.latest_error_message;
    }
  }
  writeState(state);
  return next;
}

function setServerMessage(message, extraPatch = {}) {
  appendLog(message);
  updateState({
    latestServerMessage: message,
    ...extraPatch,
  });
  if (extraPatch && extraPatch.activeJobId) {
    persistRunStatus(extraPatch.activeJobId, {
      latest_server_message: message,
      state: extraPatch.runState || undefined,
      current_step: extraPatch.currentStep || undefined,
      message,
    }, "setServerMessage");
  }
}

function setServerError(message, extraPatch = {}) {
  appendLog(`ERROR: ${message}`);
  updateState({
    latestErrorMessage: message,
    ...extraPatch,
  });
  if (extraPatch && extraPatch.activeJobId) {
    persistRunStatus(extraPatch.activeJobId, {
      latest_error_message: message,
      state: extraPatch.runState || undefined,
      current_step: extraPatch.currentStep || undefined,
      message,
    }, "setServerError");
  }
}

function hasGeminiKey() {
  return !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_KEY);
}

function hasNotionKey() {
  return !!process.env.NOTION_API_KEY;
}

function hasNotionDb() {
  return !!process.env.MIKAGE_NOTION_DB;
}

function sendJson(res, code, data) {
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(data, null, 2));
}

function sendHtml(res, html) {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  });
  res.end(html);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => data += chunk);
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function execPromise(command, options = {}) {
  return new Promise((resolve) => {
    exec(command, {
      cwd: ROOT,
      windowsHide: true,
      maxBuffer: 1024 * 1024 * 20,
      ...options
    }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        code: error && typeof error.code !== "undefined" ? error.code : 0,
        stdout: stdout || "",
        stderr: stderr || "",
        error: error ? String(error.message || error) : null
      });
    });
  });
}

async function isPidRunning(pid) {
  if (!pid) return false;
  const result = await execPromise(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`);
  const text = `${result.stdout}\n${result.stderr}`.trim();
  if (!text) return false;
  if (text.includes("No tasks are running")) return false;
  if (text.includes("INFO: No tasks are running")) return false;
  return text.includes(`"${pid}"`) || text.includes(`,${pid},`);
}

// ── service probing ──────────────────────────────────────────────────

async function probeUrl(url, timeoutMs = 4000) {
  if (!url) return { ok: false, status: 0, error: "URL_MISSING" };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const r = await fetch(url, { signal: controller.signal });
    return { ok: r.ok, status: r.status, error: null };
  } catch (e) {
    return { ok: false, status: 0, error: e.message };
  } finally {
    clearTimeout(timer);
  }
}

async function probeAllServices() {
  const fooocusUrl = process.env.FOOOCUS_HEALTH_URL || "http://127.0.0.1:7865/";
  const ollamaUrl = process.env.OLLAMA_HEALTH_URL || "http://127.0.0.1:11434/api/tags";
  const geminiOk = hasGeminiKey();
  const notionKeyOk = hasNotionKey();
  const notionDbOk = hasNotionDb();

  const [fooocus, ollama] = await Promise.all([
    probeUrl(fooocusUrl),
    probeUrl(ollamaUrl)
  ]);

  // Queue info
  let queueSize = 0;
  let currentRunningJob = null;
  try {
    if (fs.existsSync(QUEUE_FILE)) {
      const q = JSON.parse(fs.readFileSync(QUEUE_FILE, "utf8"));
      const jobs = q.jobs || [];
      queueSize = jobs.filter(j => j.status === "READY").length;
      const running = jobs.find(j => j.status === "RUNNING");
      currentRunningJob = running ? running.job_id : null;
    }
  } catch (_) {}

  return {
    fooocus: { status: fooocus.ok ? "UP" : "DOWN", detail: fooocus.error || `HTTP ${fooocus.status}` },
    ollama: { status: ollama.ok ? "UP" : "DOWN", detail: ollama.error || `HTTP ${ollama.status}` },
    gemini: {
      status: geminiOk ? "KEY_SET" : "NO_KEY",
      detail: geminiOk ? "API key configured" : "GEMINI_API_KEY / GOOGLE_API_KEY / GOOGLE_AI_KEY not set"
    },
    notion: {
      status: notionKeyOk && notionDbOk ? "READY" : notionKeyOk ? "DB_MISSING" : "NO_KEY",
      detail: notionKeyOk
        ? notionDbOk
          ? "NOTION_API_KEY + MIKAGE_NOTION_DB configured"
          : "NOTION_API_KEY set, MIKAGE_NOTION_DB missing"
        : "NOTION_API_KEY not set"
    },
    queue_size: queueSize,
    current_running_job: currentRunningJob
  };
}

// ── job/run helpers ──────────────────────────────────────────────────

function getRunPaths(jobId) {
  const runDir = path.join(RUNS_DIR, jobId);
  return {
    runDir,
    intakeRequest: path.join(runDir, "intake_request.json"),
    geminiIntake: path.join(runDir, "gemini_intake.json"),
    geminiPrecheck: path.join(runDir, "gemini_precheck.json"),
    promptPackage: path.join(runDir, "prompt_package.json"),
    finalDecision: path.join(runDir, "final_decision.json"),
    geminiValidation: path.join(runDir, "gemini_validation.json"),
    outputPng: path.join(runDir, "output.png"),
    postValidation: path.join(runDir, "post_validation.json"),
    preValidation: path.join(runDir, "pre_validation.json"),
    jobSummary: path.join(runDir, "job_summary.json"),
    geminiRuntimeCheck: path.join(runDir, "gemini_runtime_check.json"),
    geminiRuntimeProbe: path.join(runDir, "gemini_runtime_probe.json"),
    promptAfter: path.join(runDir, "prompt_after.json"),
    finalPayload: path.join(runDir, "final_payload.json")
  };
}

function normalizeText(value) {
  return String(value || "").trim();
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];
  return [value];
}

function dedupeStrings(values) {
  const out = [];
  const seen = new Set();
  for (const value of values || []) {
    const cleaned = normalizeText(value);
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
  }
  return out;
}

const KNOWN_ARTIFACTS = [
  "output.png",
  "final_decision.json",
  "gemini_validation.json",
  "post_validation.json",
  "pre_validation.json",
  "job_summary.json",
  "gemini_runtime_check.json",
  "gemini_runtime_probe.json",
  "render_payload.json",
  "render_response_raw.json",
  "render_timing.json",
  "output_metadata.json",
  "final_payload.json",
  "request.json",
  "response.json",
  "error.json"
];

function listArtifacts(jobId) {
  const runDir = path.join(RUNS_DIR, jobId);
  if (!fs.existsSync(runDir)) return [];
  try {
    return fs.readdirSync(runDir)
      .filter(f => {
        try { return fs.statSync(path.join(runDir, f)).isFile(); } catch (_) { return false; }
      })
      .map(f => {
        const stats = fs.statSync(path.join(runDir, f));
        return { name: f, size: stats.size, modified: stats.mtime.toISOString() };
      })
      .sort((a, b) => String(b.modified || "").localeCompare(String(a.modified || "")));
  } catch (_) {
    return [];
  }
}

function buildLatentProbe(jobId, latestRun, artifacts) {
  const orderedArtifacts = Array.isArray(artifacts) ? artifacts.slice() : [];
  return {
    job_id: jobId,
    gemini_pass_fail: latestRun ? latestRun.gemini_pass_fail : null,
    gemini_reason: latestRun ? latestRun.decision_reason : null,
    material_read: latestRun ? latestRun.material_read : null,
    wrong_reads: latestRun && Array.isArray(latestRun.wrong_reads) ? latestRun.wrong_reads : [],
    newest_artifacts: orderedArtifacts.slice(0, 10),
    json_filenames: orderedArtifacts
      .filter((artifact) => artifact.name.toLowerCase().endsWith(".json"))
      .slice(0, 10)
      .map((artifact) => ({ name: artifact.name, modified: artifact.modified })),
  };
}

function buildCanonRecoveryHints(finalDecision, geminiValidation) {
  const failedRules = finalDecision && Array.isArray(finalDecision.failed_rules) ? finalDecision.failed_rules : [];
  const wrongReads = geminiValidation && Array.isArray(geminiValidation.wrong_reads) ? geminiValidation.wrong_reads : [];
  const hints = [];

  if (failedRules.includes("T5")) {
    hints.push("T5: center one dominant object, keep full silhouette visible, and remove any crop or edge loss.");
  }
  if (failedRules.includes("T6")) {
    hints.push("T6: push dense matte ceramic hardness; suppress painted panel, laminate, plaster, and plastic surface cues.");
  }
  if (failedRules.includes("T11")) {
    hints.push("T11: restore Mikage sacred-tech severity with colder, stricter, more brutalist atmosphere and less generic studio softness.");
  }
  if (failedRules.includes("T12")) {
    hints.push("T12: tighten canonical form language and engineered symmetry; remove casual or ambiguous shape cues.");
  }
  if (wrongReads.some((item) => /plaster|gypsum|chalk|concrete|stone|mineral/i.test(String(item)))) {
    hints.push("Material drift: remove masonry/mineral reads and reinforce non-porous engineered ceramic with eggshell-fine surface control.");
    hints.push("Need manufactured contour evidence, not flat texture field.");
  }
  if (wrongReads.some((item) => /plastic|pvc|toy|gloss/i.test(String(item)))) {
    hints.push("Surface drift: remove glossy/plastic/toy cues and keep finish dry, matte, and hard.");
  }

  return [...new Set(hints)];
}

function readArtifactContent(jobId, filename) {
  // Security: only allow known safe patterns
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return { error: "Invalid filename" };
  }
  const filePath = path.join(RUNS_DIR, jobId, filename);
  if (!fs.existsSync(filePath)) return { error: "File not found" };
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".json") {
    const data = readJsonSafe(filePath);
    return data !== null ? { content: data } : { error: "JSON parse failed" };
  }
  if (ext === ".txt" || ext === ".log") {
    try {
      return { content: fs.readFileSync(filePath, "utf8").slice(0, 50000) };
    } catch (_) {
      return { error: "Read failed" };
    }
  }
  return { error: "Only JSON/TXT artifacts can be previewed" };
}

function findLatestImageInDir(dirPath) {
  if (!fs.existsSync(dirPath)) return null;
  let best = null;
  for (const entry of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, entry);
    let stats = null;
    try {
      stats = fs.statSync(fullPath);
    } catch (_) {
      continue;
    }
    if (stats.isDirectory()) {
      const nested = findLatestImageInDir(fullPath);
      if (nested && (!best || String(nested.modified || "").localeCompare(String(best.modified || "")) > 0)) {
        best = nested;
      }
      continue;
    }
    if (!stats.isFile()) continue;
    if (!/\.(png|jpg|jpeg)$/i.test(entry)) continue;
    if (!best || stats.mtimeMs > best.mtimeMs) {
      best = {
        absolutePath: fullPath,
        modified: stats.mtime.toISOString(),
        mtimeMs: stats.mtimeMs,
      };
    }
  }
  return best;
}

function resolveOutputImage(jobId) {
  const paths = getRunPaths(jobId);
  const finalDecision = readJsonSafe(paths.finalDecision);

  const preferred = dedupeStrings([
    finalDecision && finalDecision.output_file_path,
    paths.outputPng,
    finalDecision && finalDecision.best_candidate && finalDecision.best_candidate.output_path,
  ]);

  for (const candidatePath of preferred) {
    if (candidatePath && fs.existsSync(candidatePath)) {
      return {
        exists: true,
        absolutePath: candidatePath,
        source: "declared",
      };
    }
  }

  const latestNested = findLatestImageInDir(paths.runDir);
  if (!latestNested) {
    return { exists: false, absolutePath: null, source: null };
  }
  return {
    exists: true,
    absolutePath: latestNested.absolutePath,
    source: "scanned",
  };
}

function detectStepFromMessage(message) {
  const text = normalizeText(message);
  if (!text) return null;
  if (/run job started|starting test|ui .* test started/i.test(text)) return "RUN_STARTED";
  if (/gemini intake/i.test(text)) return "GEMINI_INTAKE";
  if (/precheck/i.test(text)) return "PRECHECK";
  if (/claude|spec bridge|prompt package|prompt_before|prompt_after/i.test(text)) return "CLAUDE_SPEC";
  if (/render_executor|sending render|submitting render|output dir|http timeout|capture timeout|render complete/i.test(text)) return "RENDER";
  if (/validator|post_validation|run_all_analyzers|rule_engine/i.test(text)) return "VALIDATOR";
  if (/gemini judge|gemini validator|gemini_validation|judge rendered/i.test(text)) return "JUDGE";
  if (/finished for .*|\"decision\": \"ALLOW\"|\"decision\":\"ALLOW\"/i.test(text)) return "DONE";
  if (/GEMINI_PRECHECK_REJECT|precheck rejected/i.test(text)) return "REJECT";
  if (/exited with code|failed for|ERROR:/i.test(text)) return "FAIL";
  return null;
}

function inferStepFromArtifacts(jobId) {
  const paths = getRunPaths(jobId);
  const precheck = readJsonSafe(paths.geminiPrecheck);
  const finalDecision = readJsonSafe(paths.finalDecision);
  if (finalDecision) {
    if (Array.isArray(finalDecision.failed_rules) && finalDecision.failed_rules.includes("GEMINI_PRECHECK_REJECT")) {
      return "REJECT";
    }
    if (finalDecision.decision === "ALLOW") return "DONE";
    if (finalDecision.decision === "REJECT" || finalDecision.status === "FAIL") return "FAIL";
    return "DONE";
  }
  if (fs.existsSync(paths.geminiValidation)) return "JUDGE";
  if (fs.existsSync(paths.postValidation)) return "VALIDATOR";
  if (resolveOutputImage(jobId).exists || fs.existsSync(paths.finalPayload)) return "RENDER";
  if (fs.existsSync(paths.promptPackage) || fs.existsSync(paths.promptAfter)) return "CLAUDE_SPEC";
  if (precheck) return precheck.status === "REJECT" ? "REJECT" : "PRECHECK";
  if (fs.existsSync(paths.geminiIntake)) return "GEMINI_INTAKE";
  if (fs.existsSync(paths.intakeRequest)) return "JOB_CREATED";
  return "IDLE";
}

function inferStateFromArtifacts(jobId) {
  const finalDecision = readJsonSafe(getRunPaths(jobId).finalDecision);
  if (finalDecision) {
    if (Array.isArray(finalDecision.failed_rules) && finalDecision.failed_rules.includes("GEMINI_PRECHECK_REJECT")) {
      return "REJECTED";
    }
    if (finalDecision.decision === "ALLOW") return "COMPLETED";
    if (finalDecision.status === "FAIL" || finalDecision.decision === "REJECT") return "FAILED";
  }
  const step = inferStepFromArtifacts(jobId);
  if (["GEMINI_INTAKE", "PRECHECK", "CLAUDE_SPEC", "RENDER", "VALIDATOR", "JUDGE", "RUN_STARTED"].includes(step)) {
    return "RUNNING";
  }
  if (step === "JOB_CREATED") return "JOB_CREATED";
  return "QUEUED";
}

function inferCurrentStep(jobId) {
  const state = readState();
  const jobState = getJobRuntimeState(state, jobId);
  return pickDominantStep(jobState.current_step, inferStepFromArtifacts(jobId));
}

function inferRunStatus(jobId) {
  const state = readState();
  const jobState = getJobRuntimeState(state, jobId);
  if (activeRun && activeRun.jobId === jobId) return "RUNNING";
  const artifactState = inferStateFromArtifacts(jobId);
  if (artifactState && artifactState !== "QUEUED") return artifactState;
  if (jobState && jobState.state && jobState.state !== "QUEUED") return jobState.state;
  return "QUEUED";
}

function syncRunStatusFromArtifacts(jobId, source = "artifact_scan") {
  const step = inferStepFromArtifacts(jobId);
  const state = activeRun && activeRun.jobId === jobId ? "RUNNING" : inferStateFromArtifacts(jobId);
  return persistRunStatus(jobId, {
    state,
    current_step: step,
    message: `${source}: ${state} / ${step}`,
  }, source);
}

function buildIntakeSummary(jobId) {
  const intake = readJsonSafe(getRunPaths(jobId).geminiIntake);
  if (!intake) return null;
  return {
    creative_intent: intake.creative_intent || null,
    subject: dedupeStrings([
      intake.subject && intake.subject.type,
      intake.subject && intake.subject.identity,
      ...(intake.subject && Array.isArray(intake.subject.must_have) ? intake.subject.must_have.slice(0, 3) : []),
    ]),
    material: dedupeStrings([
      intake.material && intake.material.primary,
      intake.material && intake.material.surface,
      intake.material && intake.material.finish,
    ]),
    composition: dedupeStrings([
      intake.composition && intake.composition.shot_type,
      intake.composition && intake.composition.framing,
      intake.composition && intake.composition.camera,
      intake.composition && intake.composition.background,
    ]),
    direction_summary: intake.direction_summary || null,
  };
}

function buildPrecheckSummary(jobId) {
  const paths = getRunPaths(jobId);
  const precheck = readJsonSafe(paths.geminiPrecheck);
  const intake = readJsonSafe(paths.geminiIntake);
  const finalDecision = readJsonSafe(paths.finalDecision);
  if (!precheck) return null;
  return {
    status: precheck.status,
    risk_level: precheck.risk_level || null,
    issues: Array.isArray(precheck.issues) ? precheck.issues : [],
    fixes: Array.isArray(precheck.fixes) ? precheck.fixes : [],
    revised_applied: precheck.status === "REVISE" && !!(intake && intake.precheck_status === "REVISE"),
    stopped_before_render: precheck.status === "REJECT" && !!(finalDecision && Array.isArray(finalDecision.failed_rules) && finalDecision.failed_rules.includes("GEMINI_PRECHECK_REJECT")),
    failed_rule: finalDecision && Array.isArray(finalDecision.failed_rules) ? finalDecision.failed_rules.find((item) => item === "GEMINI_PRECHECK_REJECT") || null : null,
    revised_summary: precheck.status === "REVISE" && precheck.revised_intake ? {
      subject: precheck.revised_intake.subject ? `${precheck.revised_intake.subject.type || ""} | ${precheck.revised_intake.subject.identity || ""}`.trim() : null,
      material: precheck.revised_intake.material ? `${precheck.revised_intake.material.primary || ""} | ${precheck.revised_intake.material.surface || ""} | ${precheck.revised_intake.material.finish || ""}`.trim() : null,
      composition: precheck.revised_intake.composition ? `${precheck.revised_intake.composition.shot_type || ""} | ${precheck.revised_intake.composition.framing || ""}`.trim() : null,
      direction_summary: precheck.revised_intake.direction_summary || null,
    } : null,
  };
}

function buildSpecSummary(jobId) {
  const promptPackage = readJsonSafe(getRunPaths(jobId).promptPackage);
  if (!promptPackage) return null;
  return {
    phase_target: promptPackage.phase_target || null,
    shot_type: promptPackage.render_spec && promptPackage.render_spec.shot_type || null,
    intake_summary: promptPackage.intake_summary || null,
    prompt_summary: normalizeText(promptPackage.structured_prompt).slice(0, 280) || null,
    negative_summary: normalizeText(promptPackage.negative_prompt).slice(0, 220) || null,
  };
}

function buildFinalDecisionSummary(jobId) {
  const latest = getLatestRunInfo(jobId);
  const finalDecision = readJsonSafe(getRunPaths(jobId).finalDecision);
  if (!finalDecision && !latest) return null;
  return {
    decision: latest.decision || finalDecision && finalDecision.decision || null,
    failed_rules: latest.failed_rules || finalDecision && finalDecision.failed_rules || [],
    dominant_fail_reason: latest.dominant_fail_reason || finalDecision && finalDecision.dominant_fail_reason || null,
    decision_reason: latest.decision_reason || finalDecision && finalDecision.decision_reason || null,
  };
}

function buildOutputSummary(jobId) {
  const latest = getLatestRunInfo(jobId);
  const finalPayload = readJsonSafe(getRunPaths(jobId).finalPayload);
  const image = resolveOutputImage(jobId);
  return {
    has_image: image.exists,
    image_url: image.exists ? `/api/output-image?job_id=${encodeURIComponent(jobId)}&t=${Date.now()}` : null,
    seed: latest.seed || finalPayload && finalPayload.seed || null,
    preset: finalPayload && (finalPayload.render_profile || finalPayload.performance || finalPayload.preset) || null,
    run_folder_path: getRunPaths(jobId).runDir,
  };
}

// ── reject diagnostics ───────────────────────────────────────────────

function diagnoseReject(jobId) {
  const paths = getRunPaths(jobId);
  const finalDecision = readJsonSafe(paths.finalDecision);
  const geminiPrecheck = readJsonSafe(paths.geminiPrecheck);
  const geminiValidation = readJsonSafe(paths.geminiValidation);
  const postValidation = readJsonSafe(paths.postValidation);
  const preValidation = readJsonSafe(paths.preValidation);
  const jobSummary = readJsonSafe(paths.jobSummary);
  const outputExists = fs.existsSync(paths.outputPng);

  const diag = {
    job_id: jobId,
    has_output_png: outputExists,
    reject_reasons: [],
    detail: {}
  };

  // 1. No real image
  if (!outputExists) {
    diag.reject_reasons.push("NO_REAL_IMAGE");
    diag.detail.no_real_image = "output.png does not exist in run directory";
  }

  if (geminiPrecheck && geminiPrecheck.status === "REJECT") {
    diag.reject_reasons.unshift("PRECHECK_REJECT");
    diag.detail.precheck_reject = {
      status: geminiPrecheck.status,
      issues: geminiPrecheck.issues || [],
      fixes: geminiPrecheck.fixes || [],
    };
  }

  // 2. Local validator fail (pre or post)
  if (preValidation && preValidation.status === "FAIL") {
    diag.reject_reasons.push("PRE_VALIDATION_FAIL");
    diag.detail.pre_validation = {
      status: preValidation.status,
      failed_rules: preValidation.failed_rules || preValidation.errors || []
    };
  }
  if (postValidation && postValidation.status === "FAIL") {
    diag.reject_reasons.push("POST_VALIDATION_FAIL");
    diag.detail.post_validation = {
      status: postValidation.status,
      failed_rules: postValidation.failed_rules || postValidation.errors || []
    };
  }

  // 3. Gemini fail
  if (finalDecision) {
    if (finalDecision.gemini_pass_fail === "FAIL") {
      diag.reject_reasons.push("GEMINI_FAIL");
      diag.detail.gemini_fail = {
        gemini_pass_fail: finalDecision.gemini_pass_fail,
        wrong_reads: finalDecision.wrong_reads || [],
        material_read: geminiValidation ? geminiValidation.material_read : null
      };
    }

    // 4. JSON parse fail
    if (finalDecision.gemini_error && String(finalDecision.gemini_error).includes("parse")) {
      diag.reject_reasons.push("JSON_PARSE_FAIL");
      diag.detail.json_parse_fail = finalDecision.gemini_error;
    }

    // 5. HTTP auth fail
    if (finalDecision.gemini_error && (
      String(finalDecision.gemini_error).includes("401") ||
      String(finalDecision.gemini_error).includes("403") ||
      String(finalDecision.gemini_error).includes("auth") ||
      String(finalDecision.gemini_error).includes("API key")
    )) {
      diag.reject_reasons.push("HTTP_AUTH_FAIL");
      diag.detail.http_auth_fail = finalDecision.gemini_error;
    }

    // General Gemini execution failure
    if (finalDecision.gemini_validation_executed === false) {
      diag.reject_reasons.push("GEMINI_NOT_EXECUTED");
      diag.detail.gemini_not_executed = finalDecision.gemini_error || "Gemini was not executed";
    }

    if (geminiValidation && geminiValidation.parse_ok === false) {
      if (!diag.reject_reasons.includes("JSON_PARSE_FAIL")) {
        diag.reject_reasons.push("JSON_PARSE_FAIL");
        diag.detail.json_parse_fail = finalDecision.gemini_error || "Gemini response could not be parsed";
      }
    }

    // Failed rules from final decision
    if (finalDecision.failed_rules && finalDecision.failed_rules.length > 0) {
      diag.detail.failed_rules = finalDecision.failed_rules;
    }
  }

  // If final_decision itself doesn't exist
  if (!finalDecision) {
    diag.reject_reasons.push("NO_FINAL_DECISION");
    diag.detail.no_final_decision = "final_decision.json not found — pipeline may not have completed";
  }

  if (diag.reject_reasons.length === 0 && finalDecision && finalDecision.decision !== "ALLOW") {
    diag.reject_reasons.push("UNKNOWN_REJECT");
    diag.detail.unknown = "Rejected but no specific failure pattern detected";
  }

  return diag;
}

// ── latest run info ──────────────────────────────────────────────────

function getLatestRunInfo(jobId) {
  const paths = getRunPaths(jobId);
  const fd = readJsonSafe(paths.finalDecision);
  const js = readJsonSafe(paths.jobSummary);
  const gv = readJsonSafe(paths.geminiValidation);
  const promptAfter = readJsonSafe(paths.promptAfter);
  const finalPayload = readJsonSafe(paths.finalPayload);

  let updatedAt = null;
  try {
    if (fs.existsSync(paths.runDir)) {
      updatedAt = fs.statSync(paths.runDir).mtime.toISOString();
    }
  } catch (_) {}

  return {
    job_id: jobId,
    status: fd ? fd.status : (js ? js.status : null),
    decision: fd ? fd.decision : (js ? js.decision : null),
    decision_reason: fd ? fd.decision_reason : null,
    gemini_pass_fail: fd ? fd.gemini_pass_fail : null,
    gemini_executed: fd ? fd.gemini_validation_executed : null,
    gemini_parse_ok: gv ? gv.parse_ok : null,
    gemini_error: fd ? fd.gemini_error : null,
    failed_rules: fd ? fd.failed_rules : null,
    wrong_reads: fd ? fd.wrong_reads : null,
    material_read: gv ? gv.material_read : null,
    correction_guidance: buildCanonRecoveryHints(fd, gv),
    shot_type: (fd && fd.shot_type) || (js && js.shot_type) || (promptAfter && promptAfter.shot_type) || null,
    final_prompt: (fd && fd.final_prompt) || (js && js.final_prompt) || (promptAfter && promptAfter.structured_prompt) || null,
    negative_prompt: (fd && fd.negative_prompt) || (js && js.negative_prompt) || (promptAfter && promptAfter.negative_prompt) || null,
    seed: (fd && fd.seed) || (js && js.seed) || (finalPayload && finalPayload.seed) || null,
    dominant_fail_reason: (fd && fd.dominant_fail_reason) || null,
    subject_recovery_mode_active: !!(fd && fd.subject_diagnostics && fd.subject_diagnostics.subject_recovery_mode_active),
    subject_diagnostics: fd ? fd.subject_diagnostics : null,
    candidates: fd && Array.isArray(fd.candidates) ? fd.candidates : [],
    best_candidate_summary: fd ? fd.best_candidate_summary || null : null,
    candidate_level: fd ? fd.candidate_level || null : null,
    attempt_count: js ? (js.attempt_count || 1) : (fd ? (fd.attempt_count || 1) : null),
    output_exists: resolveOutputImage(jobId).exists,
    updated_at: updatedAt
  };
}

// ── list recent runs ─────────────────────────────────────────────────

function listRecentRuns(limit = 15) {
  if (!fs.existsSync(RUNS_DIR)) return [];
  return fs.readdirSync(RUNS_DIR)
    .map(name => path.join(RUNS_DIR, name))
    .filter(p => { try { return fs.statSync(p).isDirectory(); } catch (_) { return false; } })
    .map(runPath => {
      const jobId = path.basename(runPath);
      const fd = readJsonSafe(path.join(runPath, "final_decision.json"));
      const gv = readJsonSafe(path.join(runPath, "gemini_validation.json"));
      const js = readJsonSafe(path.join(runPath, "job_summary.json"));
      const outputExists = resolveOutputImage(jobId).exists;
      let mtime = null;
      try { mtime = fs.statSync(runPath).mtime.toISOString(); } catch (_) {}
      return {
        job_id: jobId,
        output_exists: outputExists,
        decision: fd ? fd.decision : null,
        status: fd ? fd.status : null,
        gemini_pass_fail: fd ? fd.gemini_pass_fail : null,
        failed_rules: fd ? fd.failed_rules : null,
        material_read: gv ? gv.material_read : null,
        correction_guidance: buildCanonRecoveryHints(fd, gv),
        decision_reason: fd ? fd.decision_reason : null,
        shot_type: fd ? fd.shot_type : (js ? js.shot_type : null),
        dominant_fail_reason: fd ? fd.dominant_fail_reason : null,
        candidate_level: fd ? fd.candidate_level : null,
        updated_at: mtime
      };
    })
    .sort((a, b) => String(b.updated_at || "").localeCompare(String(a.updated_at || "")))
    .slice(0, limit);
}

// ── service control ──────────────────────────────────────────────────

function ensureMaskJob(jobId = DEFAULT_JOB_ID) {
  ensureDir(JOBS_DIR);
  const job = {
    job_id: jobId,
    type: "render",
    input: {
      prompt: "Extreme macro product photography of a perfectly symmetrical kitsune mask, ultra-detailed material study, porcelain-white matte B4C technical ceramic, dry eggshell microtexture, sparse ultra-fine hairline fractures, one restrained vertical kintsugi seam with deep internal crimson #E60000 glow, crack embedded beneath ceramic surface, hollow void-black eye sockets, sacred emotionless presence, zero specular highlights, zero gloss, zero plastic feel, cold industrial ceramic readability, brutal chiaroscuro lighting, black minimal background, premium commercial realism, razor-sharp surface definition, 8K, 100mm macro lens, f/2.8",
      negative_prompt: "plastic, glossy, shiny, wet, polished porcelain, lacquer, resin, PVC, toy-like, stone, plaster, gypsum, concrete, paper texture, overgrown crack network, lava, magma, neon red, sci-fi glow strips, cyberpunk, anime, ornate fantasy mask, visible face, visible eyes, asymmetry, soft blur, low detail, cluttered background, text, watermark"
    }
  };
  const filePath = path.join(JOBS_DIR, `${jobId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(job, null, 2), "utf8");
  const state = readState();
  state.selectedJobId = jobId;
  writeState(state);
  return filePath;
}

function slugifyJobId(value) {
  const cleaned = normalizeText(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || `idea-${Date.now()}`;
}

function createIdeaJob(body = {}) {
  ensureDir(JOBS_DIR);
  const userIdea = normalizeText(body.user_idea);
  if (!userIdea) {
    throw new Error("user_idea is required");
  }
  const jobId = slugifyJobId(body.job_id || body.title || `idea-${Date.now()}`);
  const job = {
    job_id: jobId,
    phase: normalizeText(body.phase) || "material_study",
    user_idea: userIdea,
    render: {
      width: Number(body.width) || 1024,
      height: Number(body.height) || 1024,
      performance: normalizeText(body.performance) || "Quality",
    },
  };
  const filePath = path.join(JOBS_DIR, `${jobId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(job, null, 2), "utf8");
  updateState({
    selectedJobId: jobId,
    latestServerMessage: `Job created: ${jobId}`,
    latestErrorMessage: "",
    currentStep: "JOB_CREATED",
    runState: "JOB_CREATED",
  });
  persistRunStatus(jobId, {
    state: "JOB_CREATED",
    current_step: "JOB_CREATED",
    latest_server_message: `Job created: ${jobId}`,
    latest_error_message: "",
    promote_selected: true,
    message: `Job created: ${jobId}`,
  }, "createIdeaJob");
  appendLog(`Created idea job ${jobId}`);
  return { jobId, filePath, job };
}

function clearRunTracking(extraPatch = {}) {
  const previousJobId = activeRun && activeRun.jobId ? activeRun.jobId : null;
  if (activeRun && activeRun.monitor) {
    clearInterval(activeRun.monitor);
  }
  activeRun = null;
  updateState({
    activeJobId: null,
    activeRunLabel: null,
    ...extraPatch,
  });
  if (previousJobId && (extraPatch.currentStep || extraPatch.runState)) {
    persistRunStatus(previousJobId, {
      state: extraPatch.runState,
      current_step: extraPatch.currentStep,
      latest_server_message: extraPatch.latestServerMessage,
      latest_error_message: extraPatch.latestErrorMessage,
      message: extraPatch.latestServerMessage || extraPatch.latestErrorMessage || "",
    }, "clearRunTracking");
  }
}

function startBackgroundCommand({ jobId, label, command, args, env = {} }) {
  if (activeRun && activeRun.child && !activeRun.child.killed) {
    return {
      ok: false,
      error: `Another job is already running: ${activeRun.jobId}`,
      job_id: activeRun.jobId,
    };
  }

  const child = spawn(command, args, {
    cwd: ROOT,
    env: { ...process.env, ...env },
    windowsHide: true,
    shell: false,
  });

  activeRun = { jobId, label, child, startedAt: nowIso() };
  updateState({
    selectedJobId: jobId,
    activeJobId: jobId,
    activeRunLabel: label,
    currentStep: "RUN_STARTED",
    runState: "RUNNING",
    latestServerMessage: `${label} started for ${jobId}`,
    latestErrorMessage: "",
  });
  persistRunStatus(jobId, {
    state: "RUNNING",
    current_step: "RUN_STARTED",
    latest_server_message: `${label} started for ${jobId}`,
    latest_error_message: "",
    promote_selected: true,
    message: `${label} started for ${jobId}`,
  }, "startBackgroundCommand");
  appendLog(`${label} started for ${jobId}`);
  activeRun.monitor = setInterval(() => {
    syncRunStatusFromArtifacts(jobId, "artifact_monitor");
  }, 1500);

  child.stdout.on("data", (chunk) => {
    const text = normalizeText(String(chunk || ""));
    if (!text) return;
    appendLog(`${label} stdout (${jobId}): ${text}`);
    const detectedStep = detectStepFromMessage(text);
    updateState({ latestServerMessage: text, currentStep: detectedStep || readState().currentStep, runState: "RUNNING" });
    persistRunStatus(jobId, {
      state: "RUNNING",
      current_step: detectedStep || inferCurrentStep(jobId),
      latest_server_message: text,
      message: text,
    }, "stdout");
    syncRunStatusFromArtifacts(jobId, "stdout_artifact_sync");
  });

  child.stderr.on("data", (chunk) => {
    const text = normalizeText(String(chunk || ""));
    if (!text) return;
    appendLog(`${label} stderr (${jobId}): ${text}`);
    const detectedStep = detectStepFromMessage(text) || inferCurrentStep(jobId);
    updateState({ latestErrorMessage: text, currentStep: detectedStep, runState: "RUNNING" });
    persistRunStatus(jobId, {
      state: "RUNNING",
      current_step: detectedStep,
      latest_error_message: text,
      message: text,
    }, "stderr");
    syncRunStatusFromArtifacts(jobId, "stderr_artifact_sync");
  });

  child.on("error", (error) => {
    const message = `${label} failed for ${jobId}: ${error.message}`;
    setServerError(message, { currentStep: "FAIL", runState: "FAILED", activeJobId: jobId });
    clearRunTracking({
      currentStep: "FAIL",
      runState: "FAILED",
      latestErrorMessage: message,
    });
  });

  child.on("close", (code) => {
    syncRunStatusFromArtifacts(jobId, "close_pre_final_sync");
    const finalDecision = readJsonSafe(getRunPaths(jobId).finalDecision);
    const status = finalDecision
      ? Array.isArray(finalDecision.failed_rules) && finalDecision.failed_rules.includes("GEMINI_PRECHECK_REJECT")
        ? "REJECTED"
        : finalDecision.decision === "ALLOW"
          ? "COMPLETED"
          : "FAILED"
      : code === 0
        ? inferStateFromArtifacts(jobId) || "COMPLETED"
        : "FAILED";
    const finalStep = status === "COMPLETED" ? "DONE" : status === "REJECTED" ? "REJECT" : status === "FAILED" ? "FAIL" : inferCurrentStep(jobId);

    if (code === 0) {
      setServerMessage(`${label} finished for ${jobId}`, {
        currentStep: finalStep,
        runState: status,
        activeJobId: jobId,
      });
    } else {
      setServerError(`${label} exited with code ${code} for ${jobId}`, {
        currentStep: finalStep,
        runState: status,
        activeJobId: jobId,
      });
    }
    clearRunTracking({
      currentStep: finalStep,
      runState: status,
      latestServerMessage: code === 0 ? `${label} finished for ${jobId}` : undefined,
      latestErrorMessage: code === 0 ? undefined : `${label} exited with code ${code} for ${jobId}`,
    });
  });

  return {
    ok: true,
    started: true,
    job_id: jobId,
    label,
    pid: child.pid,
  };
}

function startIdeaRun(jobId) {
  const jobFile = path.join(JOBS_DIR, `${jobId}.json`);
  if (!fs.existsSync(jobFile)) {
    return { ok: false, error: `Job file not found for ${jobId}` };
  }
  return startBackgroundCommand({
    jobId,
    label: "Run Job",
    command: "node",
    args: ["orchestrator.js", jobFile],
  });
}

async function startFooocus() {
  const state = readState();
  if (await isPidRunning(state.fooocusPid)) {
    return { ok: true, message: `Fooocus already running. PID=${state.fooocusPid}` };
  }
  const child = spawn("python", ["scripts/fooocus_bridge.py"], {
    cwd: ROOT, detached: true, stdio: "ignore", windowsHide: true
  });
  child.unref();
  state.fooocusPid = child.pid;
  writeState(state);
  appendLog(`Started Fooocus bridge. PID=${child.pid}`);
  return { ok: true, message: `Started Fooocus bridge. PID=${child.pid}` };
}

async function stopFooocus() {
  const state = readState();
  if (!state.fooocusPid) return { ok: true, message: "Fooocus has no tracked PID." };
  const pid = state.fooocusPid;
  const result = await execPromise(`taskkill /PID ${pid} /T /F`);
  state.fooocusPid = null;
  writeState(state);
  appendLog(`Stopped Fooocus bridge. Old PID=${pid}`);
  return { ok: true, message: `Stopped Fooocus. PID=${pid}`, stdout: result.stdout, stderr: result.stderr };
}

async function startOllama() {
  const state = readState();
  const child = spawn(process.env.OLLAMA_START_CMD || "ollama serve", {
    cwd: process.env.OLLAMA_START_CWD || ROOT,
    detached: true,
    stdio: "ignore",
    windowsHide: true,
    shell: true
  });
  child.unref();
  state.ollamaPid = child.pid;
  writeState(state);
  appendLog(`Started Ollama. PID=${child.pid}`);
  return { ok: true, message: `Started Ollama. PID=${child.pid}` };
}

async function stopOllama() {
  const state = readState();
  const result = await execPromise('taskkill /IM ollama.exe /T /F');
  state.ollamaPid = null;
  writeState(state);
  appendLog("Stopped Ollama");
  return { ok: true, message: "Stopped Ollama", stdout: result.stdout, stderr: result.stderr };
}

async function restartOllama() {
  await stopOllama();
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const startResult = await startOllama();
  await new Promise((resolve) => setTimeout(resolve, 2500));
  const health = await probeUrl(process.env.OLLAMA_HEALTH_URL || "http://127.0.0.1:11434/api/tags");
  appendLog(`Restarted Ollama. Health=${health.ok ? "UP" : "DOWN"} ${health.error || health.status}`);
  return {
    ...startResult,
    health: {
      status: health.ok ? "UP" : "DOWN",
      detail: health.error || `HTTP ${health.status}`
    }
  };
}

async function startRuntime() {
  const state = readState();
  if (await isPidRunning(state.runtimePid)) {
    return { ok: true, message: `Runtime already running. PID=${state.runtimePid}` };
  }
  const child = spawn("node", ["server.js"], {
    cwd: ROOT, detached: true, stdio: "ignore", windowsHide: true
  });
  child.unref();
  state.runtimePid = child.pid;
  writeState(state);
  appendLog(`Started Runtime server.js. PID=${child.pid}`);
  return { ok: true, message: `Started Runtime server.js. PID=${child.pid}` };
}

async function stopRuntime() {
  const state = readState();
  if (!state.runtimePid) return { ok: true, message: "Runtime has no tracked PID." };
  const pid = state.runtimePid;
  const result = await execPromise(`taskkill /PID ${pid} /T /F`);
  state.runtimePid = null;
  writeState(state);
  appendLog(`Stopped Runtime. PID=${pid}`);
  return { ok: true, message: `Stopped Runtime. PID=${pid}`, stdout: result.stdout, stderr: result.stderr };
}

async function runMaskTest(jobId = DEFAULT_JOB_ID) {
  ensureMaskJob(jobId);
  const command = [
    "set RENDER_PROFILE=FAST_TEST",
    "set FAST_WIDTH=512",
    "set FAST_HEIGHT=512",
    "set FAST_STEPS=16",
    "set FAST_DISABLE_REFINER=true",
    `node orchestrator.js jobs\\${jobId}.json`
  ].join("&& ");
  appendLog(`Starting test job=${jobId}`);
  const result = await execPromise(command);
  appendLog(
    `Finished test job=${jobId}\nOK=${result.ok}\n` +
    (result.stdout ? `STDOUT:\n${result.stdout}\n` : "") +
    (result.stderr ? `STDERR:\n${result.stderr}\n` : "") +
    (result.error ? `ERROR:\n${result.error}\n` : "")
  );
  return result;
}

async function runUiBehaviorTest(caseName = "PASS") {
  const caseId = String(caseName || "PASS").toUpperCase();
  const configs = {
    PASS: {
      jobId: "ui-pass-case",
      userIdea: "Macro study of a single manufactured ceramic respirator shell with matte B4C technical ceramic and readable rim contour.",
      geminiIntake: {
        creative_intent: "Single manufactured object with immediate matte ceramic readability.",
        subject: {
          type: "manufactured_object",
          identity: "ceramic respirator shell",
          must_have: [
            "exactly one manufactured object as the clear subject",
            "visible rim and bevel contour evidence",
            "material visibly attached to the object",
          ],
          must_not_have: [
            "texture-only frame",
            "atmosphere-first image",
            "abstract-first composition",
          ],
        },
        material: {
          primary: "matte B4C technical ceramic",
          surface: "porcelain-white eggshell microtexture",
          finish: "dry matte engineered finish",
          forbidden_reads: ["plaster", "gypsum", "glossy plastic"],
        },
        composition: {
          shot_type: "macro product study",
          framing: "single dominant object centered in frame",
          camera: "macro close-up with readable contour evidence",
          background: "controlled minimal background",
        },
        lighting: {
          style: "controlled low-key product lighting",
          constraints: ["no ambient color wash", "no glossy hotspots"],
        },
        core_risks: ["material drift"],
        anti_drift_rules: ["always preserve one clearly readable manufactured object"],
        success_criteria: ["manufactured object read is immediate", "matte ceramic read is immediate"],
        direction_summary: "UI PASS CASE direction summary",
        connector_status: "gemini",
        gemini_executed: true,
        parse_ok: true,
      },
    },
    REVISE: {
      jobId: "ui-revise-case",
      userIdea: "A ceramic object in a moody frame, maybe a product surface, maybe something atmospheric.",
      geminiIntake: {
        creative_intent: "moody ceramic atmosphere board",
        subject: {
          type: "object",
          identity: "ceramic form",
          must_have: ["single object"],
          must_not_have: ["busy scene"],
        },
        material: {
          primary: "ceramic",
          surface: "",
          finish: "",
          forbidden_reads: ["plaster"],
        },
        composition: {
          shot_type: "",
          framing: "",
          camera: "",
          background: "soft mood background",
        },
        lighting: {
          style: "",
          constraints: [],
        },
        core_risks: ["abstract drift"],
        anti_drift_rules: [],
        success_criteria: [],
        direction_summary: "UI REVISE SENTINEL",
        connector_status: "gemini",
        gemini_executed: true,
        parse_ok: true,
      },
    },
    REJECT: {
      jobId: "ui-reject-case",
      userIdea: "Abstract ceramic atmosphere with texture and light only.",
      geminiIntake: {
        creative_intent: "abstract atmosphere board",
        subject: {
          type: "atmosphere",
          identity: "texture",
          must_have: [],
          must_not_have: [],
        },
        material: {
          primary: "ceramic",
          surface: "",
          finish: "",
          forbidden_reads: [],
        },
        composition: {
          shot_type: "",
          framing: "",
          camera: "",
          background: "",
        },
        lighting: {
          style: "",
          constraints: [],
        },
        core_risks: ["abstract drift"],
        anti_drift_rules: [],
        success_criteria: [],
        direction_summary: "UI REJECT CASE",
        connector_status: "gemini",
        gemini_executed: true,
        parse_ok: true,
      },
    },
  };

  const config = configs[caseId];
  if (!config) {
    return { ok: false, error: `Unknown test case ${caseId}` };
  }

  const modulePaths = {
    render: path.resolve(ROOT, "render", "render_executor.js"),
    intake: path.resolve(ROOT, "gemini_intake.js"),
    connector: path.resolve(ROOT, "gemini_connector.js"),
    analyzers: path.resolve(ROOT, "analyzers", "run_all_analyzers.js"),
    drift: path.resolve(ROOT, "drift", "drift_detector.js"),
    orchestrator: path.resolve(ROOT, "orchestrator.js"),
  };
  const originals = {};
  for (const key of Object.keys(modulePaths)) {
    try {
      originals[key] = require.cache[modulePaths[key]];
      delete require.cache[modulePaths[key]];
    } catch (_) {
      originals[key] = undefined;
    }
  }

  const pngPath = path.join(RUNS_DIR, "_ui_test_sources", `${config.jobId}.png`);
  ensureDir(path.dirname(pngPath));
  fs.writeFileSync(
    pngPath,
    Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WnS1xQAAAAASUVORK5CYII=", "base64")
  );

  const baseSignals = {
    bounding_box_width_percentage: 40,
    distorted_pixel_ratio: 0,
    pixel_displacement: 0,
    rgb_glitch_count: 0,
    mesh_deformation_delta: 0,
    boundary_intersection: 0,
    edge_blur_radius: 0,
    pixel_bleed_percentage: 0,
    high_frequency_pixel_density_delta: 0.1,
    edge_halo_detection: 0,
    z_blue_delta_e: 0,
    z_blue_color_shift_detected: 0,
    saliency_peak_zone: "product_safe_zone",
    rgb_chromatic_split_noise: 0,
    vhs_noise_pattern: 0,
    line_angle_deviation: 0,
    grid_snap_variance: 0,
    exposure_value_delta: 0,
    histogram_clipping: 0,
    geometry_symmetry_ratio: 99,
    line_curvature_degree: 0,
    ornament_bounding_box: 0,
    human_eyes_detected: 0,
    face_mesh_visible: 0,
    high_gloss_specular: 0,
    pvc_plastic_read: 0,
    missing_weave_texture: 0,
    soft_fabric_folds_on_joints: 0,
    magenta_neon_spill: 0,
    chaotic_particle_bloom: 0,
    toon_shading: 0,
    chibi_proportions: 0,
    cyan_magenta_overload: 0,
    lens_flare_spam: 0,
    silhouette_read_time: 0.3,
    edge_separation_score: 1,
    recognition_time_seconds: 0.5,
    primary_subject_confidence: 1,
    logo_overlap_ratio: 0,
    branding_zone_distortion_contact: 0,
    thumbnail_subject_retention: 1,
    thumbnail_saliency_rank: "subject",
    product_color_delta_e: 0,
    regional_hsv_shift: 0,
    _vlm_status: "completed",
    _analyzer_status: {},
  };

  require.cache[modulePaths.intake] = {
    id: modulePaths.intake,
    filename: modulePaths.intake,
    loaded: true,
    exports: {
      runGeminiIntake: async () => config.geminiIntake,
    },
  };
  require.cache[modulePaths.connector] = {
    id: modulePaths.connector,
    filename: modulePaths.connector,
    loaded: true,
    exports: {
      validateGeminiRuntime: async () => ({ ok: true, http_status: 200, error: null, model: "mock-gemini" }),
      judgeRenderedImage: async () => ({
        decision: "PASS",
        material_read: "matte ceramic",
        drift_flags: [],
        fail_rules: [],
        corrections: [],
        confidence: 0.96,
        raw: {
          pass_fail: "PASS",
          material_read: "matte ceramic",
          correct_reads: ["manufactured object", "matte ceramic"],
          wrong_reads: [],
          fail_rules: [],
          fix_direction: [],
          summary: "PASS",
          confidence: 0.96,
          gemini_validation_executed: true,
          parse_ok: true,
          error: null,
        },
      }),
    },
  };
  require.cache[modulePaths.render] = {
    id: modulePaths.render,
    filename: modulePaths.render,
    loaded: true,
    exports: {
      executeRender: async () => ({
        success: true,
        render: {
          output_file: pngPath,
          seed_used: 321,
          render_time_ms: 10,
          status: "RENDERED",
        },
      }),
    },
  };
  require.cache[modulePaths.analyzers] = {
    id: modulePaths.analyzers,
    filename: modulePaths.analyzers,
    loaded: true,
    exports: {
      runAllAnalyzers: async () => baseSignals,
    },
  };
  require.cache[modulePaths.drift] = {
    id: modulePaths.drift,
    filename: modulePaths.drift,
    loaded: true,
    exports: {
      detectDrift: async () => ({
        identity_score: 0.92,
        narrative_score: 0.88,
        aesthetic_integrity_score: 0.9,
        anti_polish_score: 0.82,
        drift_flags: [],
        verdict: "PASS",
        refineable: true,
        refine_reason: "none",
        identity_detail: {},
        narrative_detail: {},
      }),
    },
  };

  delete require.cache[modulePaths.orchestrator];
  updateState({
    selectedJobId: config.jobId,
    activeJobId: config.jobId,
    activeRunLabel: `UI ${caseId} test`,
    currentStep: "RUNNING",
    latestServerMessage: `UI ${caseId} test started`,
    latestErrorMessage: "",
  });
  appendLog(`UI ${caseId} test started`);

  try {
    const { orchestrate } = require(modulePaths.orchestrator);
    const summary = await orchestrate({
      job_id: config.jobId,
      user_idea: config.userIdea,
      phase: "material_study",
      render: {
        width: 1024,
        height: 1024,
        performance: "Speed",
      },
    });
    const result = {
      ok: true,
      job_id: config.jobId,
      summary,
      test_case: caseId,
    };
    setServerMessage(`UI ${caseId} test completed`, {
      currentStep: inferCurrentStep(config.jobId),
      activeJobId: null,
      activeRunLabel: null,
    });
    return result;
  } catch (error) {
    setServerError(`UI ${caseId} test failed: ${error.message}`, {
      currentStep: "FAILED",
      activeJobId: null,
      activeRunLabel: null,
    });
    return {
      ok: false,
      job_id: config.jobId,
      error: error.message,
      test_case: caseId,
    };
  } finally {
    for (const key of Object.keys(modulePaths)) {
      delete require.cache[modulePaths[key]];
      if (originals[key]) {
        require.cache[modulePaths[key]] = originals[key];
      }
    }
  }
}

// ── full dashboard status (legacy compat + enhanced) ─────────────────

async function getDashboardStatus(selectedJobId) {
  const state = readState();
  const jobId = selectedJobId || state.activeJobId || state.selectedJobId || DEFAULT_JOB_ID;
  syncRunStatusFromArtifacts(jobId, "status_read_sync");
  const refreshedState = readState();
  const effectiveState = refreshedState.activeJobId ? refreshedState : state;
  const jobRuntimeState = getJobRuntimeState(effectiveState, jobId);
  const resolvedRunState = inferRunStatus(jobId);
  const resolvedCurrentStep = inferCurrentStep(jobId);
  const latestRun = getLatestRunInfo(jobId);
  const healthServices = await probeAllServices();
  const diag = diagnoseReject(jobId);
  const artifacts = listArtifacts(jobId);
  effectiveState.lastStatusReadSource = "api/status";
  writeState(effectiveState);

  return {
    selected_job_id: jobId,
    fooocus_running: await isPidRunning(state.fooocusPid),
    fooocus_pid: state.fooocusPid,
    runtime_running: await isPidRunning(state.runtimePid),
    runtime_pid: state.runtimePid,
    services: healthServices,
    latest_run: latestRun,
    reject_diagnostics: diag,
    artifacts,
    latent_probe: buildLatentProbe(jobId, latestRun, artifacts),
    recent_runs: listRecentRuns(15),
    last_action_at: state.lastActionAt,
    last_log: state.lastLog || "",
    run_view: {
      intake_summary: buildIntakeSummary(jobId),
      precheck: buildPrecheckSummary(jobId),
      spec_summary: buildSpecSummary(jobId),
      run_status: {
        state: resolvedRunState,
        current_step: resolvedCurrentStep,
        latest_server_message: jobRuntimeState.latest_server_message || effectiveState.latestServerMessage || "",
        latest_error_message: jobRuntimeState.latest_error_message || effectiveState.latestErrorMessage || "",
        state_history: jobRuntimeState.state_history || [],
        step_history: jobRuntimeState.step_history || [],
        status_write_source: jobRuntimeState.status_write_source || state.lastStatusWriteSource || "unknown",
        status_read_source: "api/status",
      },
      final_decision: buildFinalDecisionSummary(jobId),
      output: buildOutputSummary(jobId),
    }
  };
}

// ── HTML page ────────────────────────────────────────────────────────

function pageHtml() {
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Mikage Command Center</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root{
      --bg:#050505;--bg2:#0a0a0a;--panel:#0d0d0d;--panel2:#111111;
      --line:#333333;--text:#f2f2f2;--muted:#8b8b8b;
      --red:#e60000;--green:#d9d9d9;--yellow:#efc45b;
      --bad:#ff6d6d;--blue:#d9d9d9;
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;font-family:Consolas,"Courier New",monospace;color:var(--text);
      background:linear-gradient(180deg,var(--bg2),var(--bg));
    }
    .wrap{max-width:1540px;margin:0 auto;padding:24px}
    .topbar{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:18px;flex-wrap:wrap}
    .headline h1{margin:0;font-size:28px;letter-spacing:.6px}
    .headline .sub{color:var(--muted);font-size:13px}
    .chipline{display:flex;flex-wrap:wrap;gap:10px}
    .chip{padding:8px 12px;border-radius:0;background:#111;border:1px solid var(--line);color:var(--muted);font-size:12px}

    .layout{display:grid;grid-template-columns:340px 1fr 340px;gap:18px}
    .col{display:grid;gap:18px;align-content:start}

    .panel{background:var(--panel);border:1px solid var(--line);border-radius:0;box-shadow:none;overflow:hidden}
    .panel-head{padding:14px 18px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:12px}
    .panel-title{margin:0;font-size:16px;font-weight:700}
    .panel-body{padding:14px 18px 16px}

    .btn-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .btn{border:1px solid var(--line);outline:none;border-radius:0;padding:11px 12px;font-weight:700;cursor:pointer;color:#fff;transition:none;box-shadow:none;font-size:13px;background:#000}
    .btn:hover{background:#fff;color:#000}
    .btn:active{background:#000;color:#fff}
    .btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
    .btn.primary{background:#000}
    .btn.secondary{background:#111}
    .btn.good{background:#000}
    .btn.danger{background:#2a0000;color:#fff;border-color:#5a0000}
    .btn.danger:hover{background:#fff;color:#000}
    .btn.wide{grid-column:1/-1}

    .svc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .svc{background:var(--panel2);border:1px solid var(--line);border-radius:0;padding:12px}
    .svc .label{font-size:11px;color:var(--muted);margin-bottom:4px}
    .svc .val{font-size:15px;font-weight:700}

    .stats{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
    .stat{background:var(--panel2);border:1px solid var(--line);border-radius:0;padding:12px;min-height:70px}
    .stat .label{font-size:11px;color:var(--muted);margin-bottom:4px}
    .stat .value{font-size:17px;font-weight:700;word-break:break-word}
    .stat .value.big{font-size:22px}

    .ok{color:var(--green)}.bad{color:var(--bad)}.warn{color:var(--yellow)}.blue{color:var(--blue)}

    .kv{background:var(--panel2);border:1px solid var(--line);border-radius:0;padding:12px;margin-bottom:10px}
    .kv .label{font-size:11px;color:var(--muted);margin-bottom:4px}
    .mono{font-family:Consolas,monospace;white-space:pre-wrap;word-break:break-word;font-size:13px}

    .image-card{background:#09090d;border:1px solid var(--line);border-radius:0;padding:12px;min-height:400px;display:flex;align-items:center;justify-content:center;position:relative}
    .image-card img{max-width:100%;max-height:600px;border-radius:0;display:block;box-shadow:none}
    .image-empty{color:var(--muted);font-size:13px}

    .log{height:220px;overflow:auto;background:#09090d;border:1px solid var(--line);border-radius:0;padding:12px;font-family:Consolas,monospace;white-space:pre-wrap;word-break:break-word;color:#dbe4ff;font-size:12px}

    .runs{display:grid;gap:8px;max-height:480px;overflow:auto}
    .run-item{background:var(--panel2);border:1px solid var(--line);border-radius:0;padding:10px;cursor:pointer;transition:none}
    .run-item:hover{background:#fff;color:#000}
    .run-item.active{border-color:var(--red);box-shadow:none}
    .run-top{display:flex;justify-content:space-between;gap:8px;margin-bottom:6px;align-items:center}
    .run-id{font-weight:700;font-size:13px}
    .pill{border-radius:0;padding:4px 8px;font-size:10px;font-weight:700;background:#111;color:#fff;border:1px solid var(--line)}
    .pill.pass{background:#fff;color:#000}.pill.fail{background:#2a0000;color:#fff}.pill.wait{background:#111;color:#fff}
    .mini{font-size:11px;color:var(--muted);line-height:1.5}

    .diag-item{background:var(--panel2);border:1px solid var(--line);border-radius:0;padding:10px;margin-bottom:8px}
    .diag-tag{display:inline-block;padding:3px 8px;border-radius:0;font-size:11px;font-weight:700;margin-right:6px;margin-bottom:4px}
    .diag-tag.red{background:#5f1f1f;color:#ff8a8a}
    .diag-tag.yellow{background:#5f4a16;color:#efc45b}
    .diag-detail{font-size:12px;color:var(--muted);margin-top:4px}

    .art-tabs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
    .art-tab{padding:6px 10px;border-radius:0;background:#111;border:1px solid var(--line);color:var(--muted);font-size:11px;cursor:pointer;font-weight:600}
    .art-tab:hover{background:#fff;color:#000}
    .art-tab.active{border-color:var(--red);color:var(--text)}
    .art-preview{background:#09090d;border:1px solid var(--line);border-radius:0;padding:12px;max-height:400px;overflow:auto;font-family:Consolas,monospace;white-space:pre-wrap;word-break:break-word;color:#dbe4ff;font-size:12px}
    .latent-list{display:grid;gap:6px}
    .latent-row{border:1px solid var(--line);padding:8px;background:#111}

    @media(max-width:1280px){.layout{grid-template-columns:1fr 1fr}}
    @media(max-width:800px){.layout{grid-template-columns:1fr}.svc-grid,.stats,.btn-grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="topbar">
      <div class="headline">
        <h1>MIKAGE COMMAND CENTER</h1>
        <div class="sub">Monitor pipeline / control services / inspect artifacts / diagnose rejects</div>
      </div>
      <div class="chipline">
        <div class="chip">Port: 3030</div>
        <div class="chip" id="chipJob">Job: -</div>
        <div class="chip" id="chipQueue">Queue: -</div>
        <div class="chip" id="chipAction">Last: -</div>
      </div>
    </div>

    <div class="layout">
      <!-- LEFT COLUMN -->
      <div class="col">
        <!-- Service control -->
        <div class="panel">
          <div class="panel-head"><div class="panel-title">Service Control</div></div>
          <div class="panel-body">
            <div class="btn-grid">
              <button class="btn primary" onclick="apiAction('/api/start-fooocus')">Start Fooocus</button>
              <button class="btn danger" onclick="apiAction('/api/stop-fooocus')">Stop Fooocus</button>
              <button class="btn primary" onclick="apiAction('/api/start-ollama')">Start Ollama</button>
              <button class="btn danger" onclick="apiAction('/api/stop-ollama')">Stop Ollama</button>
              <button class="btn secondary wide" onclick="apiAction('/api/restart-ollama')">Restart Ollama</button>
              <button class="btn primary" onclick="apiAction('/api/start-runtime')">Start Runtime</button>
              <button class="btn danger" onclick="apiAction('/api/stop-runtime')">Stop Runtime</button>
              <button class="btn secondary" onclick="apiAction('/api/create-job')">Create Job</button>
              <button class="btn good" onclick="apiAction('/api/run-mask-test')">Run Test</button>
              <button class="btn secondary wide" onclick="refreshAll()">Refresh All</button>
            </div>
          </div>
        </div>

        <!-- System health -->
        <div class="panel">
          <div class="panel-head"><div class="panel-title">System Health</div></div>
          <div class="panel-body">
            <div class="svc-grid">
              <div class="svc"><div class="label">Fooocus</div><div id="svcFooocus" class="val">-</div></div>
              <div class="svc"><div class="label">Ollama</div><div id="svcOllama" class="val">-</div></div>
              <div class="svc"><div class="label">Gemini</div><div id="svcGemini" class="val">-</div></div>
              <div class="svc"><div class="label">Notion</div><div id="svcNotion" class="val">-</div></div>
              <div class="svc"><div class="label">Queue Size</div><div id="svcQueue" class="val">-</div></div>
              <div class="svc"><div class="label">Running Job</div><div id="svcRunning" class="val">-</div></div>
            </div>
          </div>
        </div>

        <!-- Recent runs -->
        <div class="panel">
          <div class="panel-head"><div class="panel-title">Recent Runs</div></div>
          <div class="panel-body"><div id="runsList" class="runs"></div></div>
        </div>
      </div>

      <!-- CENTER COLUMN -->
      <div class="col">
        <!-- Latest run -->
        <div class="panel">
          <div class="panel-head"><div class="panel-title">Latest Run</div></div>
          <div class="panel-body">
            <div class="stats">
              <div class="stat"><div class="label">Job ID</div><div id="runJobId" class="value blue">-</div></div>
              <div class="stat"><div class="label">Decision</div><div id="runDecision" class="value big">-</div></div>
              <div class="stat"><div class="label">Status</div><div id="runStatus" class="value">-</div></div>
              <div class="stat"><div class="label">Attempts</div><div id="runAttempts" class="value">-</div></div>
              <div class="stat"><div class="label">Gemini</div><div id="runGemini" class="value">-</div></div>
              <div class="stat"><div class="label">Updated</div><div id="runUpdated" class="value" style="font-size:12px">-</div></div>
            </div>
            <div class="kv" style="margin-top:10px">
              <div class="label">Reason</div>
              <div id="runReason" class="mono">-</div>
            </div>
            <div class="kv">
              <div class="label">Failed Rules</div>
              <div id="runFailedRules" class="mono">-</div>
            </div>
            <div class="kv">
              <div class="label">Wrong Reads</div>
              <div id="runWrongReads" class="mono">-</div>
            </div>
            <div class="kv">
              <div class="label">Shot Type</div>
              <div id="runShotType" class="mono">-</div>
            </div>
            <div class="kv">
              <div class="label">Seed</div>
              <div id="runSeed" class="mono">-</div>
            </div>
            <div class="kv">
              <div class="label">Dominant Fail Reason</div>
              <div id="runDominantFail" class="mono">-</div>
            </div>
            <div class="kv">
              <div class="label">Subject Recovery Mode</div>
              <div id="runSubjectRecovery" class="mono">-</div>
            </div>
            <div class="kv">
              <div class="label">Correction Guidance</div>
              <div id="runGuidance" class="mono">-</div>
            </div>
            <div class="kv">
              <div class="label">BEST CANDIDATE SUMMARY</div>
              <div id="runBestCandidate" class="mono">-</div>
            </div>
            <div class="kv">
              <div class="label">Final Prompt</div>
              <div id="runFinalPrompt" class="mono">-</div>
            </div>
            <div class="kv">
              <div class="label">Negative Prompt</div>
              <div id="runNegativePrompt" class="mono">-</div>
            </div>
          </div>
        </div>

        <!-- Output image -->
        <div class="panel">
          <div class="panel-head"><div class="panel-title">Output Preview</div></div>
          <div class="panel-body">
            <div class="image-card">
              <img id="outputImage" src="" alt="output" style="display:none">
              <div id="imageEmpty" class="image-empty">No output.png</div>
            </div>
          </div>
        </div>

        <!-- Reject diagnostics -->
        <div class="panel">
          <div class="panel-head"><div class="panel-title">Reject Diagnostics</div></div>
          <div class="panel-body" id="diagPanel">
            <div class="mini">Select a run to see diagnostics</div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><div class="panel-title">Candidates</div></div>
          <div class="panel-body" id="candidatePanel">
            <div class="mini">No candidate batch</div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="col">
        <!-- Artifact viewer -->
        <div class="panel">
          <div class="panel-head"><div class="panel-title">Artifacts</div></div>
          <div class="panel-body">
            <div id="artTabs" class="art-tabs"></div>
            <div id="artPreview" class="art-preview">Select an artifact to preview</div>
          </div>
        </div>

        <!-- System log -->
        <div class="panel">
          <div class="panel-head"><div class="panel-title">System Log</div></div>
          <div class="panel-body">
            <div id="log" class="log">Loading...</div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><div class="panel-title">LATENT PROBE</div></div>
          <div class="panel-body">
            <div class="kv">
              <div class="label">Gemini Feedback</div>
              <div id="latentGemini" class="mono">-</div>
            </div>
            <div class="kv">
              <div class="label">Newest Artifacts</div>
              <div id="latentArtifacts" class="latent-list"></div>
            </div>
            <div class="kv">
              <div class="label">Latest JSON Files</div>
              <div id="latentJson" class="latent-list"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

<script>
"use strict";

let currentJob = null;
let currentArtifact = null;
let _busy = false;

function safe(fn) {
  return async function() {
    try { await fn.apply(this, arguments); }
    catch(e) { console.error(e); writeLog('UI error: ' + String(e)); }
  };
}

function writeLog(msg) {
  const el = document.getElementById('log');
  if (el) el.textContent = msg;
}

function $(id) { return document.getElementById(id); }

function setText(id, val, cls) {
  const el = $(id);
  if (!el) return;
  el.textContent = val != null ? String(val) : '-';
  if (cls !== undefined) el.className = el.className.replace(/ (ok|bad|warn|blue)/g, '') + (cls ? ' ' + cls : '');
}

function svcClass(status) {
  if (status === 'UP' || status === 'KEY_SET') return 'ok';
  if (status === 'DOWN' || status === 'NO_KEY') return 'bad';
  return 'warn';
}

function decClass(d, s) {
  if (String(d || '').includes('ALLOW')) return 'ok';
  if (String(d || '').includes('REJECT') || String(s || '').includes('FAIL')) return 'bad';
  return 'warn';
}

function pillClass(d) {
  if (String(d || '').includes('ALLOW')) return 'pass';
  if (String(d || '').includes('REJECT')) return 'fail';
  return 'wait';
}

function arrStr(v) {
  if (Array.isArray(v) && v.length) return v.join(' | ');
  if (v && typeof v === 'string') return v;
  return '-';
}

async function safeFetch(url, opts) {
  try {
    const r = await fetch(url, opts);
    const text = await r.text();
    try { return JSON.parse(text); }
    catch(_) { return { error: 'Invalid JSON response', raw: text.slice(0, 500) }; }
  } catch(e) {
    return { error: String(e) };
  }
}

const apiAction = safe(async function(url, body) {
  if (_busy) return;
  _busy = true;
  document.querySelectorAll('.btn').forEach(b => b.disabled = true);
  try {
    const data = await safeFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    writeLog(JSON.stringify(data, null, 2));
    await refreshAll();
  } finally {
    _busy = false;
    document.querySelectorAll('.btn').forEach(b => b.disabled = false);
  }
});

function chooseRun(jobId) {
  currentJob = jobId;
  currentArtifact = null;
  refreshAll();
}

async function loadArtifact(filename) {
  if (!currentJob) return;
  currentArtifact = filename;
  renderArtTabs();
  const ext = (filename || '').split('.').pop().toLowerCase();
  if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
    $('artPreview').innerHTML = '<img src="/artifact-file?job_id=' + encodeURIComponent(currentJob) + '&file=' + encodeURIComponent(filename) + '&t=' + Date.now() + '" style="max-width:100%;border-radius:8px">';
    return;
  }
  const data = await safeFetch('/api/artifact-content?job_id=' + encodeURIComponent(currentJob) + '&file=' + encodeURIComponent(filename));
  if (data.error) {
    $('artPreview').textContent = 'Error: ' + data.error;
  } else {
    $('artPreview').textContent = typeof data.content === 'object' ? JSON.stringify(data.content, null, 2) : String(data.content);
  }
}

function renderArtTabs() {
  const el = $('artTabs');
  if (!el) return;
  if (!window._currentArtifacts || !window._currentArtifacts.length) {
    el.innerHTML = '<div class="mini">No artifacts</div>';
    return;
  }
  el.innerHTML = window._currentArtifacts.map(a => {
    const active = a.name === currentArtifact ? 'active' : '';
    return '<div class="art-tab ' + active + '" onclick="loadArtifact(\\''+a.name+'\\')">'+a.name+'</div>';
  }).join('');
}

function renderLatentProbe(latent) {
  $('latentGemini').textContent = latent
    ? [latent.gemini_pass_fail || '-', latent.gemini_reason || '-', arrStr(latent.wrong_reads || [])].join(' | ')
    : '-';

  $('latentArtifacts').innerHTML = latent && latent.newest_artifacts && latent.newest_artifacts.length
    ? latent.newest_artifacts.map(function(item) {
        return '<div class="latent-row mono">' + escHtml(item.name + ' | ' + item.modified) + '</div>';
      }).join('')
    : '<div class="mini">No artifacts</div>';

  $('latentJson').innerHTML = latent && latent.json_filenames && latent.json_filenames.length
    ? latent.json_filenames.map(function(item) {
        return '<div class="latent-row mono">' + escHtml(item.name + ' | ' + item.modified) + '</div>';
      }).join('')
    : '<div class="mini">No JSON artifacts</div>';
}

function renderDiag(diag) {
  const el = $('diagPanel');
  if (!el) return;
  if (!diag || !diag.reject_reasons || diag.reject_reasons.length === 0) {
    const decision = window._latestRun ? window._latestRun.decision : null;
    if (decision === 'ALLOW') {
      el.innerHTML = '<div style="color:var(--green);font-weight:700;font-size:15px">ALLOW — No reject signals</div>';
    } else if (!decision) {
      el.innerHTML = '<div class="mini">No diagnostics available</div>';
    } else {
      el.innerHTML = '<div class="mini">No specific reject pattern detected</div>';
    }
    return;
  }

  const reasonLabels = {
    PRECHECK_REJECT: 'Job stopped before render (precheck reject)',
    NO_REAL_IMAGE: 'No real output.png',
    PRE_VALIDATION_FAIL: 'Local pre-validation FAIL',
    POST_VALIDATION_FAIL: 'Local post-validation FAIL',
    GEMINI_FAIL: 'Gemini final gate FAIL',
    JSON_PARSE_FAIL: 'Gemini JSON parse error',
    HTTP_AUTH_FAIL: 'HTTP auth / API key error',
    GEMINI_NOT_EXECUTED: 'Gemini was not executed',
    NO_FINAL_DECISION: 'No final_decision.json',
    UNKNOWN_REJECT: 'Unknown reject'
  };

  var latestGuidance = window._latestRun && window._latestRun.correction_guidance ? window._latestRun.correction_guidance : [];
  let html = '';
  for (const reason of diag.reject_reasons) {
    const label = reasonLabels[reason] || reason;
    const detail = diag.detail[reason.toLowerCase()] || diag.detail[Object.keys(diag.detail).find(k => k.toLowerCase().replace(/_/g,'') === reason.toLowerCase().replace(/_/g,''))] || '';
    const detailStr = typeof detail === 'object' ? JSON.stringify(detail, null, 2) : String(detail || '');
    html += '<div class="diag-item"><div class="diag-tag red">' + label + '</div>' +
      (detailStr && detailStr !== '{}' ? '<div class="diag-detail mono">' + escHtml(detailStr) + '</div>' : '') +
    '</div>';
  }
  if (latestGuidance && latestGuidance.length) {
    html += '<div class="diag-item"><div class="diag-tag yellow">Operator guidance</div><div class="diag-detail mono">' + escHtml(latestGuidance.join('\n')) + '</div></div>';
  }
  if (window._latestRun && window._latestRun.subject_diagnostics) {
    var sd = window._latestRun.subject_diagnostics;
    var subjectColor = (!sd.subject_present || !sd.material_read || !sd.manufactured_object_read) ? 'red' : 'yellow';
    html += '<div class="diag-item"><div class="diag-tag ' + subjectColor + '">SUBJECT CHECK</div><div class="diag-detail mono">' +
      escHtml(
        'subject_present: ' + (sd.subject_present ? 'yes' : 'no') + '\n' +
        'manufactured_object_read: ' + (sd.manufactured_object_read ? 'yes' : 'no') + '\n' +
        'material_read: ' + (sd.material_read ? 'yes' : 'no') + '\n' +
        'abstract_risk: ' + (sd.abstract_risk || '-')
      ) +
      '</div></div>';
  }
  el.innerHTML = html;
}

function renderCandidates(candidates, bestSummary) {
  var el = $('candidatePanel');
  if (!el) return;
  if (!candidates || !candidates.length) {
    el.innerHTML = '<div class="mini">No candidate batch</div>';
    return;
  }
  el.innerHTML = candidates.map(function(candidate) {
    var sd = candidate.subject_diagnostics || {};
    var best = bestSummary && bestSummary.selected_candidate_id === candidate.candidate_id;
    var imgPath = candidate.output_path ? '/artifact-file?job_id=' + encodeURIComponent(currentJob || '') + '&file=' + encodeURIComponent(candidate.candidate_id + '/output.png') : '';
    return '<div class="diag-item">' +
      '<div class="diag-tag ' + (best ? 'yellow' : 'gray') + '">' + escHtml(candidate.candidate_id + (best ? ' BEST' : '')) + '</div>' +
      '<div class="diag-detail mono">' + escHtml(
        'seed: ' + (candidate.seed ?? '-') + '\n' +
        'score: ' + (candidate.candidate_score ?? '-') + '\n' +
        'level: ' + (candidate.candidate_level || '-') + '\n' +
        'dominant_fail_reason: ' + (candidate.dominant_fail_reason || '-') + '\n' +
        'subject_present: ' + (sd.subject_present ? 'yes' : 'no') + '\n' +
        'manufactured_object_read: ' + (sd.manufactured_object_read ? 'yes' : 'no') + '\n' +
        'material_read: ' + (sd.material_read ? 'yes' : 'no') + '\n' +
        'abstract_risk: ' + (sd.abstract_risk || '-') + '\n' +
        'validator_summary: ' + arrStr(candidate.local_diagnostics || [])
      ) + '</div></div>';
  }).join('');
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderRuns(runs, selectedId) {
  const el = $('runsList');
  if (!el) return;
  if (!runs || !runs.length) {
    el.innerHTML = '<div class="mini">No runs found</div>';
    return;
  }
  el.innerHTML = runs.map(function(run) {
    var active = run.job_id === selectedId ? 'active' : '';
    var d = run.decision || run.status || 'UNKNOWN';
    var pc = pillClass(d);
    return '<div class="run-item '+active+'" onclick="chooseRun(\\''+escHtml(run.job_id)+'\\')">'+
      '<div class="run-top"><div class="run-id">'+escHtml(run.job_id)+'</div><div class="pill '+pc+'">'+escHtml(d)+'</div></div>'+
      '<div class="mini">Gemini: '+(run.gemini_pass_fail||'-')+' | Output: '+(run.output_exists?'yes':'no')+' | Shot: '+(run.shot_type||'-')+'</div>'+
      '<div class="mini">'+escHtml((run.decision_reason || '').slice(0, 90) || (arrStr(run.correction_guidance) || '-'))+'</div>'+
      '<div class="mini">'+escHtml((run.dominant_fail_reason || '').slice(0, 70) || '-'))+'</div>'+
      '<div class="mini">'+(run.updated_at||'-')+'</div>'+
    '</div>';
  }).join('');
}

const refreshAll = safe(async function() {
  var query = currentJob ? ('?job_id=' + encodeURIComponent(currentJob)) : '';
  var data = await safeFetch('/api/status' + query);
  if (data.error && !data.selected_job_id) {
    writeLog('Refresh error: ' + (data.error || 'Unknown'));
    return;
  }

  currentJob = data.selected_job_id || currentJob;

  // Chips
  setText('chipJob', 'Job: ' + (data.selected_job_id || '-'));
  setText('chipQueue', 'Queue: ' + ((data.services && data.services.queue_size) || 0));
  setText('chipAction', 'Last: ' + (data.last_action_at || '-'));

  // Services
  var svc = data.services || {};
  var fStatus = svc.fooocus || {};
  var oStatus = svc.ollama || {};
  var gStatus = svc.gemini || {};
  var nStatus = svc.notion || {};

  // Fooocus: combine probe + PID
  var fLabel = fStatus.status || 'UNKNOWN';
  if (data.fooocus_running) fLabel = 'UP (PID ' + data.fooocus_pid + ')';
  setText('svcFooocus', fLabel, svcClass(fStatus.status || (data.fooocus_running ? 'UP' : 'DOWN')));
  setText('svcOllama', oStatus.status || '-', svcClass(oStatus.status));
  setText('svcGemini', gStatus.status || '-', svcClass(gStatus.status));
  setText('svcNotion', nStatus.status || '-', svcClass(nStatus.status));
  setText('svcQueue', String(svc.queue_size || 0));
  setText('svcRunning', svc.current_running_job || 'none', svc.current_running_job ? 'yellow' : '');

  // Latest run
  var lr = data.latest_run || {};
  window._latestRun = lr;
  setText('runJobId', lr.job_id || '-', 'blue');
  setText('runDecision', lr.decision || '-', decClass(lr.decision, lr.status));
  $('runDecision').className = 'value big ' + decClass(lr.decision, lr.status);
  setText('runStatus', lr.status || '-', decClass(lr.decision, lr.status));
  setText('runAttempts', lr.attempt_count != null ? String(lr.attempt_count) : '-');
  setText('runGemini', lr.gemini_pass_fail || '-', lr.gemini_pass_fail === 'PASS' ? 'ok' : (lr.gemini_pass_fail === 'FAIL' ? 'bad' : 'warn'));
  setText('runUpdated', lr.updated_at || '-');
  $('runReason').textContent = arrStr(lr.decision_reason);
  $('runFailedRules').textContent = arrStr(lr.failed_rules);
  $('runWrongReads').textContent = arrStr(lr.wrong_reads);
  $('runShotType').textContent = arrStr(lr.shot_type);
  $('runSeed').textContent = arrStr(lr.seed);
  $('runDominantFail').textContent = arrStr(lr.dominant_fail_reason);
  $('runSubjectRecovery').textContent = lr.subject_recovery_mode_active ? 'ACTIVE' : 'OFF';
  $('runGuidance').textContent = arrStr(lr.correction_guidance);
  $('runBestCandidate').textContent = lr.best_candidate_summary
    ? arrStr([
        lr.best_candidate_summary.selected_candidate_id || '-',
        lr.best_candidate_summary.why_selected || '-',
        lr.best_candidate_summary.usable_level || '-',
        lr.best_candidate_summary.dominant_fail_reason || '-',
      ])
    : '-';
  $('runFinalPrompt').textContent = arrStr(lr.final_prompt);
  $('runNegativePrompt').textContent = arrStr(lr.negative_prompt);

  // Image
  var img = $('outputImage');
  var empty = $('imageEmpty');
  if (lr.output_exists) {
    img.src = '/artifact-file?job_id=' + encodeURIComponent(data.selected_job_id||'') + '&file=output.png&t=' + Date.now();
    img.style.display = 'block';
    empty.style.display = 'none';
  } else {
    img.style.display = 'none';
    empty.style.display = 'block';
  }

  // Reject diagnostics
  renderDiag(data.reject_diagnostics);
  renderCandidates(lr.candidates || [], lr.best_candidate_summary || null);

  // Artifacts
  window._currentArtifacts = data.artifacts || [];
  renderArtTabs();
  var stillExists = currentArtifact && window._currentArtifacts.some(function(a){ return a.name === currentArtifact; });
  if (!stillExists) currentArtifact = null;
  if (!currentArtifact && window._currentArtifacts.length) {
    // Auto-load final_decision if available
    var autoLoad = window._currentArtifacts.find(function(a){return a.name === 'final_decision.json';});
    if (autoLoad) loadArtifact(autoLoad.name);
  }

  // Runs list
  renderRuns(data.recent_runs || [], data.selected_job_id);
  renderLatentProbe(data.latent_probe || null);

  // Log
  $('log').textContent = data.last_log || 'No log';
});

refreshAll();
setInterval(refreshAll, 8000);
</script>
</body>
</html>`;
}

function commanderPageHtml() {
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Commander Proof Board</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root{
      --bg:#050505;--bg2:#0a0a0a;--panel:#0d0d0d;--panel2:#111111;
      --line:#333333;--text:#f2f2f2;--muted:#8b8b8b;
      --red:#e60000;--green:#00c853;--yellow:#ffc107;
      --pass:#00c853;--fail:#ff1744;--wait:#ffc107;
    }
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{height:100%;font-family:Consolas,"Courier New",monospace;color:var(--text);background:var(--bg)}
    .wrap{max-width:1600px;margin:0 auto;padding:20px}
    header{border-bottom:2px solid var(--line);padding-bottom:15px;margin-bottom:20px}
    h1{font-size:24px;letter-spacing:1px;text-transform:uppercase}
    .subtitle{color:var(--muted);font-size:12px;margin-top:5px}
    .timestamp{color:var(--muted);font-size:11px;margin-top:10px}
    
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}
    @media(max-width:1200px){.grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:800px){.grid{grid-template-columns:1fr}}
    
    .panel{background:var(--panel);border:1px solid var(--line);padding:15px}
    .panel-header{border-bottom:1px solid var(--line);padding-bottom:10px;margin-bottom:15px}
    .panel-title{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px}
    
    .row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #222}
    .row:last-child{border-bottom:none}
    .label{font-size:11px;color:var(--muted);text-transform:uppercase}
    .value{font-size:13px;font-weight:600}
    
    .status{font-weight:700;text-transform:uppercase}
    .alive{color:var(--green)}
    .dead{color:var(--red)}
    .present{color:var(--green)}
    .missing{color:var(--red)}
    .pass{color:var(--pass)}
    .fail{color:var(--fail)}
    .locked{color:var(--green);font-size:16px;font-weight:700}
    .not-locked{color:var(--fail);font-size:16px;font-weight:700}
    .mono{font-family:Consolas,monospace;font-size:11px}
    
    .verdict-box{border:2px solid var(--line);padding:15px;text-align:center;margin-top:15px}
    .verdict-text{font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:1px}
    
    .artifact-list{list-style:none}
    .artifact-list li{padding:5px 0;font-size:11px;border-bottom:1px solid #1a1a1a}
    .artifact-list li:before{content:"› ";color:var(--muted)}
    
    .fail-reason{color:var(--fail);font-size:11px;margin-top:10px;padding:10px;background:#1a0505;border-left:3px solid var(--fail)}
    .refresh-bar{text-align:center;padding:15px;border-top:2px solid var(--line);margin-top:20px}
    .refresh-btn{background:var(--panel2);border:1px solid var(--line);color:var(--text);padding:10px 30px;cursor:pointer;font-family:inherit;font-size:12px;text-transform:uppercase}
    .refresh-btn:hover{background:var(--line)}
    
    .json-view{background:#0a0a0a;border:1px solid #222;padding:10px;font-size:10px;max-height:150px;overflow:auto;margin-top:10px}
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>Commander Proof Board</h1>
      <div class="subtitle">Real-time system verification dashboard</div>
      <div class="timestamp" id="timestamp">Loading...</div>
    </header>
    
    <div class="grid">
      <!-- PANEL 1: System Proof -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">1. System Proof</div>
        </div>
        <div class="row">
          <span class="label">Fooocus</span>
          <span class="value status" id="sys-fooocus">-</span>
        </div>
        <div class="row">
          <span class="label">Ollama</span>
          <span class="value status" id="sys-ollama">-</span>
        </div>
        <div class="row">
          <span class="label">Telegram Bot</span>
          <span class="value status" id="sys-telegram">-</span>
        </div>
        <div class="row">
          <span class="label">Gemini Key</span>
          <span class="value status" id="sys-gemini">-</span>
        </div>
        <div class="row">
          <span class="label">Vision Validator</span>
          <span class="value status" id="sys-vision">-</span>
        </div>
      </div>
      
      <!-- PANEL 2: Image Lane Proof -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">2. Image Lane Proof</div>
        </div>
        <div class="row">
          <span class="label">Latest Run</span>
          <span class="value mono" id="lane-path">-</span>
        </div>
        <div class="row">
          <span class="label">output.png</span>
          <span class="value status" id="lane-output">-</span>
        </div>
        <div class="row">
          <span class="label">Post Validation</span>
          <span class="value status" id="lane-post">-</span>
        </div>
        <div class="row">
          <span class="label">Gemini Validation</span>
          <span class="value status" id="lane-gemini">-</span>
        </div>
        <div class="row">
          <span class="label">Final Decision</span>
          <span class="value status" id="lane-decision">-</span>
        </div>
        <div class="verdict-box">
          <div class="verdict-text" id="lane-verdict">CHECKING...</div>
        </div>
      </div>
      
      <!-- PANEL 3: Latest Run Proof -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">3. Latest Run Proof</div>
        </div>
        <div class="row">
          <span class="label">Run Folder</span>
          <span class="value mono" id="run-folder">-</span>
        </div>
        <div class="row">
          <span class="label">Created</span>
          <span class="value" id="run-created">-</span>
        </div>
        <div class="row">
          <span class="label">Job ID</span>
          <span class="value" id="run-jobid">-</span>
        </div>
        <div class="row">
          <span class="label">Status</span>
          <span class="value" id="run-status">-</span>
        </div>
        <div style="margin-top:10px">
          <div class="label">Artifacts Present</div>
          <ul class="artifact-list" id="run-artifacts"></ul>
        </div>
      </div>
      
      <!-- PANEL 4: Task/Queue Proof -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">4. Task/Queue Proof</div>
        </div>
        <div class="row">
          <span class="label">Pending</span>
          <span class="value" id="task-pending">-</span>
        </div>
        <div class="row">
          <span class="label">Running</span>
          <span class="value" id="task-running">-</span>
        </div>
        <div class="row">
          <span class="label">Failed</span>
          <span class="value" id="task-failed">-</span>
        </div>
        <div class="row">
          <span class="label">Done</span>
          <span class="value" id="task-done">-</span>
        </div>
        <div style="margin-top:15px;padding-top:15px;border-top:1px solid #222">
          <div class="label">Latest Task</div>
          <div class="value mono" id="task-latest" style="margin-top:5px">-</div>
        </div>
      </div>
      
      <!-- PANEL 5: Failure Center -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">5. Failure Center</div>
        </div>
        <div class="row">
          <span class="label">Latest Reject Reason</span>
        </div>
        <div class="fail-reason" id="fail-reason">-</div>
        <div class="row" style="margin-top:15px">
          <span class="label">Failed Rules</span>
        </div>
        <div id="fail-rules" class="mono" style="padding:10px;background:#0a0a0a;font-size:10px">-</div>
        <div class="row" style="margin-top:15px">
          <span class="label">Validator Source</span>
          <span class="value" id="fail-validator">-</span>
        </div>
        <div class="row">
          <span class="label">No-Image Fail</span>
          <span class="value" id="fail-noimage">-</span>
        </div>
      </div>
      
      <!-- PANEL 6: Cost/Runtime Proof -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">6. Cost/Runtime Proof</div>
        </div>
        <div class="row">
          <span class="label">Total Runs</span>
          <span class="value" id="cost-runs">-</span>
        </div>
        <div class="row">
          <span class="label">Latest Duration</span>
          <span class="value" id="cost-latest">-</span>
        </div>
        <div class="row">
          <span class="label">Average Duration</span>
          <span class="value" id="cost-avg">-</span>
        </div>
        <div class="row">
          <span class="label">Total Cost</span>
          <span class="value" id="cost-total">-</span>
        </div>
      </div>
    </div>
    
    <div class="refresh-bar">
      <button class="refresh-btn" onclick="loadProof()">Refresh Proof Board</button>
    </div>
  </div>

<script>
async function safeFetch(url) {
  try {
    const r = await fetch(url);
    const text = await r.text();
    try { return JSON.parse(text); }
    catch(_) { return { error: 'Invalid JSON' }; }
  } catch(e) { return { error: String(e) }; }
}

function setStatus(id, value, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
  el.className = 'value status';
  if (type) el.classList.add(type);
}

async function loadProof() {
  const data = await safeFetch('/api/commander-proof');
  if (data.error) {
    document.getElementById('timestamp').textContent = 'Error: ' + data.error;
    return;
  }
  
  document.getElementById('timestamp').textContent = 'Updated: ' + data.timestamp;
  
  // System Proof
  const sys = data.system_proof;
  setStatus('sys-fooocus', sys.fooocus, sys.fooocus === 'ALIVE' ? 'alive' : 'dead');
  setStatus('sys-ollama', sys.ollama, sys.ollama === 'ALIVE' ? 'alive' : 'dead');
  setStatus('sys-telegram', sys.telegram_bot, sys.telegram_bot === 'ALIVE' ? 'alive' : 'dead');
  setStatus('sys-gemini', sys.gemini_key, sys.gemini_key === 'PRESENT' ? 'present' : 'missing');
  setStatus('sys-vision', sys.use_vision_validator);
  
  // Image Lane Proof
  const lane = data.image_lane_proof;
  document.getElementById('lane-path').textContent = lane.latest_run_path.split('/').pop() || '-';
  setStatus('lane-output', lane.output_png, lane.output_png === 'PRESENT' ? 'pass' : 'fail');
  setStatus('lane-post', lane.post_validation, lane.post_validation === 'PASS' ? 'pass' : (lane.post_validation === 'FAIL' ? 'fail' : ''));
  setStatus('lane-gemini', lane.gemini_validation, lane.gemini_validation === 'PASS' ? 'pass' : (lane.gemini_validation === 'FAIL' ? 'fail' : ''));
  setStatus('lane-decision', lane.final_decision, lane.final_decision === 'ALLOW' ? 'pass' : (lane.final_decision === 'REJECT' ? 'fail' : ''));
  
  const verdictEl = document.getElementById('lane-verdict');
  if (lane.verdict === 'IMAGE LANE LOCKED') {
    verdictEl.textContent = 'IMAGE LANE LOCKED';
    verdictEl.className = 'verdict-text locked';
  } else {
    verdictEl.textContent = 'IMAGE LANE NOT LOCKED';
    verdictEl.className = 'verdict-text not-locked';
  }
  
  // Latest Run Proof
  const run = data.latest_run_proof;
  document.getElementById('run-folder').textContent = run.run_folder;
  document.getElementById('run-created').textContent = run.created_at ? new Date(run.created_at).toLocaleString() : '-';
  document.getElementById('run-jobid').textContent = run.summary.job_id || '-';
  document.getElementById('run-status').textContent = run.summary.status || '-';
  
  const artList = document.getElementById('run-artifacts');
  artList.innerHTML = '';
  if (run.artifacts && run.artifacts.length) {
    run.artifacts.forEach(a => {
      const li = document.createElement('li');
      li.textContent = a.name + ' (' + (a.size/1024).toFixed(1) + 'KB)';
      artList.appendChild(li);
    });
  } else {
    artList.innerHTML = '<li>No artifacts</li>';
  }
  
  // Task Queue Proof
  const task = data.task_queue_proof;
  document.getElementById('task-pending').textContent = task.pending;
  document.getElementById('task-running').textContent = task.running;
  document.getElementById('task-failed').textContent = task.failed;
  document.getElementById('task-done').textContent = task.done;
  if (task.latest_task) {
    document.getElementById('task-latest').textContent = task.latest_task.task_id + ' | ' + task.latest_task.status;
  } else {
    document.getElementById('task-latest').textContent = 'No tasks';
  }
  
  // Failure Center
  const fail = data.failure_center;
  document.getElementById('fail-reason').textContent = fail.latest_reject_reason || 'None';
  document.getElementById('fail-rules').textContent = fail.failed_rules && fail.failed_rules.length ? fail.failed_rules.join(' | ') : 'None';
  document.getElementById('fail-validator').textContent = fail.validator_fail_source;
  document.getElementById('fail-noimage').textContent = fail.no_image_fail ? 'YES' : 'NO';
  
  // Cost Runtime Proof
  const cost = data.cost_runtime_proof;
  document.getElementById('cost-runs').textContent = cost.total_runs;
  document.getElementById('cost-latest').textContent = cost.latest_duration;
  document.getElementById('cost-avg').textContent = cost.average_duration;
  document.getElementById('cost-total').textContent = '$' + cost.total_cost.toFixed(2);
}

loadProof();
setInterval(loadProof, 10000);
</script>
</body>
</html>`;
}

// ── HTTP server ──────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  // CORS
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  try {
    const parsed = new URL(req.url, `http://${req.headers.host}`);

    // ── GET /commander ─── Commander Proof Board
    if (req.method === "GET" && parsed.pathname === "/commander") {
      const html = commanderPageHtml();
      return sendHtml(res, html);
    }

    // ── GET / ─── serve UI
    if (req.method === "GET" && parsed.pathname === "/") {
      const html = fs.existsSync(HTML_FILE) ? fs.readFileSync(HTML_FILE, "utf8") : pageHtml();
      return sendHtml(res, html);
    }

    if (req.method === "GET" && parsed.pathname === "/command-center.html") {
      const html = fs.existsSync(HTML_FILE) ? fs.readFileSync(HTML_FILE, "utf8") : pageHtml();
      return sendHtml(res, html);
    }

    // ── GET /api/status ─── full dashboard data
    if (req.method === "GET" && parsed.pathname === "/api/status") {
      const requestedJobId = parsed.searchParams.get("job_id");
      if (requestedJobId) {
        const state = readState();
        state.selectedJobId = requestedJobId;
        writeState(state);
      }
      return sendJson(res, 200, await getDashboardStatus(requestedJobId));
    }

    // ── GET /api/health-probe ─── probe all services
    if (req.method === "GET" && parsed.pathname === "/api/health-probe") {
      return sendJson(res, 200, await probeAllServices());
    }

    // ── GET /api/artifacts ─── list artifacts for a job
    if (req.method === "GET" && parsed.pathname === "/api/artifacts") {
      const jobId = parsed.searchParams.get("job_id") || readState().selectedJobId;
      return sendJson(res, 200, { job_id: jobId, artifacts: listArtifacts(jobId) });
    }

    // ── GET /api/artifact-content ─── preview artifact JSON/txt
    if (req.method === "GET" && parsed.pathname === "/api/artifact-content") {
      const jobId = parsed.searchParams.get("job_id") || readState().selectedJobId;
      const file = parsed.searchParams.get("file");
      if (!file) return sendJson(res, 400, { error: "Missing file parameter" });
      return sendJson(res, 200, readArtifactContent(jobId, file));
    }

    // ── GET /api/system ─── system report
    if (req.method === "GET" && parsed.pathname === "/api/commander-proof") {
      const proofReader = require('./mikage-operator/lib/proof_reader');
      const proof = await proofReader.generateCommanderProof();
      return sendJson(res, 200, proof);
    }

    // ── GET /api/system ─── system report
    if (req.method === "GET" && parsed.pathname === "/api/system") {
      const report = generateSystemReport();
      return sendJson(res, 200, report);
    }

    // ── GET /api/project ─── project report
    if (req.method === "GET" && parsed.pathname === "/api/project") {
      const report = generateProjectReport();
      return sendJson(res, 200, report);
    }

    // ── GET /api/cost ─── cost report
    if (req.method === "GET" && parsed.pathname === "/api/cost") {
      const report = generateCostReport();
      return sendJson(res, 200, report);
    }

    // ── GET /api/artifacts ─── latest artifacts
    if (req.method === "GET" && parsed.pathname === "/api/artifacts-latest") {
      const artifacts = getLatestArtifacts();
      return sendJson(res, 200, artifacts);
    }

    // ── GET /artifact-file ─── serve raw artifact file (png, json, etc)
    if (req.method === "GET" && parsed.pathname === "/artifact-file") {
      const jobId = parsed.searchParams.get("job_id") || readState().selectedJobId;
      const file = parsed.searchParams.get("file");
      if (!file || file.includes("..") || file.includes("/") || file.includes("\\")) {
        return sendJson(res, 400, { error: "Invalid file parameter" });
      }
      const filePath = path.join(RUNS_DIR, jobId, file);
      if (!fs.existsSync(filePath)) {
        return sendJson(res, 404, { error: "File not found" });
      }
      const ext = path.extname(file).toLowerCase();
      const types = { ".json": "application/json", ".txt": "text/plain", ".png": "image/png", ".jpg": "image/jpeg" };
      res.writeHead(200, {
        "Content-Type": types[ext] || "application/octet-stream",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*"
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    if (req.method === "GET" && parsed.pathname === "/api/output-image") {
      const jobId = parsed.searchParams.get("job_id") || readState().selectedJobId;
      const image = resolveOutputImage(jobId);
      if (!image.exists || !image.absolutePath || !fs.existsSync(image.absolutePath)) {
        return sendJson(res, 404, { error: "No output image available" });
      }
      const ext = path.extname(image.absolutePath).toLowerCase();
      const types = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };
      res.writeHead(200, {
        "Content-Type": types[ext] || "application/octet-stream",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*"
      });
      fs.createReadStream(image.absolutePath).pipe(res);
      return;
    }

    // ── GET /api/reject-diagnostics ─── diagnose reject for a job
    if (req.method === "GET" && parsed.pathname === "/api/reject-diagnostics") {
      const jobId = parsed.searchParams.get("job_id") || readState().selectedJobId;
      return sendJson(res, 200, diagnoseReject(jobId));
    }

    // ── POST /api/start-fooocus
    if (req.method === "POST" && parsed.pathname === "/api/start-fooocus") {
      return sendJson(res, 200, await startFooocus());
    }

    // ── POST /api/stop-fooocus
    if (req.method === "POST" && parsed.pathname === "/api/stop-fooocus") {
      return sendJson(res, 200, await stopFooocus());
    }

    // ── POST /api/start-ollama
    if (req.method === "POST" && parsed.pathname === "/api/start-ollama") {
      return sendJson(res, 200, await startOllama());
    }

    // ── POST /api/stop-ollama
    if (req.method === "POST" && parsed.pathname === "/api/stop-ollama") {
      return sendJson(res, 200, await stopOllama());
    }

    // ── POST /api/restart-ollama
    if (req.method === "POST" && parsed.pathname === "/api/restart-ollama") {
      return sendJson(res, 200, await restartOllama());
    }

    // ── POST /api/start-runtime
    if (req.method === "POST" && parsed.pathname === "/api/start-runtime") {
      return sendJson(res, 200, await startRuntime());
    }

    // ── POST /api/stop-runtime
    if (req.method === "POST" && parsed.pathname === "/api/stop-runtime") {
      return sendJson(res, 200, await stopRuntime());
    }

    // ── POST /api/create-job
    if (req.method === "POST" && parsed.pathname === "/api/create-job") {
      const body = await parseBody(req).catch(() => ({}));
      if (body.user_idea) {
        try {
          const created = createIdeaJob(body);
          return sendJson(res, 200, {
            ok: true,
            mode: "idea_job",
            job_id: created.jobId,
            job_path: created.filePath,
            job: created.job,
          });
        } catch (error) {
          return sendJson(res, 400, { ok: false, error: error.message });
        }
      }
      const jobId = body.job_id || DEFAULT_JOB_ID;
      const jobPath = ensureMaskJob(jobId);
      appendLog(`Created test job: ${jobPath}`);
      return sendJson(res, 200, { ok: true, mode: "mask_test_job", job_path: jobPath, job_id: jobId });
    }

    if (req.method === "POST" && parsed.pathname === "/api/run-job") {
      const body = await parseBody(req).catch(() => ({}));
      const jobId = body.job_id || readState().selectedJobId;
      if (!jobId) return sendJson(res, 400, { ok: false, error: "Missing job_id" });
      const result = startIdeaRun(jobId);
      return sendJson(res, result.ok ? 200 : 409, result);
    }

    // ── POST /api/run-mask-test
    if (req.method === "POST" && parsed.pathname === "/api/run-mask-test") {
      const body = await parseBody(req).catch(() => ({}));
      const jobId = body.job_id || readState().selectedJobId || DEFAULT_JOB_ID;
      const result = await runMaskTest(jobId);
      return sendJson(res, result.ok ? 200 : 500, { ...result, job_id: jobId });
    }

    if (req.method === "POST" && parsed.pathname === "/api/run-test") {
      const body = await parseBody(req).catch(() => ({}));
      const caseName = body.case_name || body.case || "PASS";
      const result = await runUiBehaviorTest(caseName);
      return sendJson(res, result.ok ? 200 : 500, result);
    }

    // ── MASTER CONTROL API routes ──────────────────────────────────────────
    
    // POST /api/master/boot
    if (req.method === "POST" && parsed.pathname === "/api/master/boot") {
      const masterControl = require('./lib/master_control');
      const result = await masterControl.boot();
      return sendJson(res, result.success ? 200 : 500, result);
    }

    // POST /api/master/heal
    if (req.method === "POST" && parsed.pathname === "/api/master/heal") {
      const masterControl = require('./lib/master_control');
      const result = await masterControl.heal();
      return sendJson(res, result.success ? 200 : 500, result);
    }

    // GET /api/master/proof
    if (req.method === "GET" && parsed.pathname === "/api/master/proof") {
      const masterControl = require('./lib/master_control');
      const result = await masterControl.proof();
      return sendJson(res, 200, result);
    }

    // GET /api/master/status
    if (req.method === "GET" && parsed.pathname === "/api/master/status") {
      const masterControl = require('./lib/master_control');
      const result = await masterControl.masterStatus();
      return sendJson(res, 200, result);
    }

    // POST /api/master/start-all
    if (req.method === "POST" && parsed.pathname === "/api/master/start-all") {
      const masterControl = require('./lib/master_control');
      const result = await masterControl.startAll();
      return sendJson(res, result.success ? 200 : 500, result);
    }

    // POST /api/master/stop-all
    if (req.method === "POST" && parsed.pathname === "/api/master/stop-all") {
      const masterControl = require('./lib/master_control');
      const result = await masterControl.stopAll();
      return sendJson(res, result.success ? 200 : 500, result);
    }

    // POST /api/master/restart-all
    if (req.method === "POST" && parsed.pathname === "/api/master/restart-all") {
      const masterControl = require('./lib/master_control');
      const result = await masterControl.restartAll();
      return sendJson(res, result.success ? 200 : 500, result);
    }

    // ── GET /output.png ─── legacy compat
    if (req.method === "GET" && parsed.pathname === "/output.png") {
      const jobId = parsed.searchParams.get("job_id") || readState().selectedJobId || DEFAULT_JOB_ID;
      const image = resolveOutputImage(jobId);
      if (!image.exists || !image.absolutePath) return sendJson(res, 404, { error: "No output image" });
      res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "no-store" });
      fs.createReadStream(image.absolutePath).pipe(res);
      return;
    }

    // ── 404
    sendJson(res, 404, { error: "Endpoint not found" });

  } catch (err) {
    // Catch-all: always return valid JSON, never crash
    try {
      sendJson(res, 500, { error: "Internal server error", message: String(err.message || err) });
    } catch (_) {
      res.end('{"error":"fatal"}');
    }
  }
});

function generateSystemReport() {
  const state = readState();
  const services = {
    fooocus: { status: state.fooocusPid ? 'running' : 'stopped', pid: state.fooocusPid },
    ollama: { status: state.runtimePid ? 'running' : 'stopped', pid: state.runtimePid },
    command_center: { status: 'running', pid: process.pid }
  };
  const tasks = readJsonSafe(path.join(ROOT, 'data', 'tasks.json')) || [];
  const runs = readJsonSafe(path.join(ROOT, 'data', 'runs.json')) || [];
  const alerts = readJsonSafe(path.join(ROOT, 'data', 'alerts.json')) || [];

  return {
    timestamp: nowIso(),
    services: services,
    task_summary: {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      running: tasks.filter(t => t.status === 'running').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      failed: tasks.filter(t => t.status === 'failed').length
    },
    recent_runs: runs.slice(-5),
    active_alerts: alerts.filter(a => !a.resolved).slice(-5)
  };
}

function generateProjectReport() {
  const projectRoot = ROOT;
  const files = getProjectFiles(projectRoot);
  const tasks = readJsonSafe(path.join(ROOT, 'data', 'tasks.json')) || [];
  const fileCount = countFilesByType(files);

  return {
    timestamp: nowIso(),
    project_root: projectRoot,
    file_count: files.length,
    file_types: fileCount,
    recent_tasks: tasks.slice(-10).map(t => ({
      id: t.task_id,
      command: t.raw_command,
      status: t.status,
      created: t.created_at
    }))
  };
}

function generateCostReport() {
  const costs = readJsonSafe(path.join(ROOT, 'data', 'costs.json')) || [];
  const tasks = readJsonSafe(path.join(ROOT, 'data', 'tasks.json')) || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const failedTasks = tasks.filter(t => t.status === 'failed').length;

  const estimatedCost = totalTasks * 0.10;
  const actualCost = costs.reduce((sum, cost) => sum + (cost.amount || 0), 0);

  return {
    timestamp: nowIso(),
    total_tasks: totalTasks,
    completed_tasks: completedTasks,
    failed_tasks: failedTasks,
    estimated_cost: estimatedCost,
    actual_cost: actualCost,
    cost_breakdown: costs.slice(-10)
  };
}

function getLatestArtifacts() {
  const artifacts = readJsonSafe(path.join(ROOT, 'data', 'artifacts.json')) || [];
  return artifacts.slice(0, 10);
}

function getProjectFiles(dir, maxDepth = 3, currentDepth = 0) {
  if (currentDepth > maxDepth) return [];
  let files = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files = files.concat(getProjectFiles(fullPath, maxDepth, currentDepth + 1));
      } else if (stat.isFile()) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore errors
  }
  return files;
}

function countFilesByType(files) {
  const counts = {};
  files.forEach(file => {
    const ext = path.extname(file);
    counts[ext] = (counts[ext] || 0) + 1;
  });
  return counts;
}

server.listen(PORT, "127.0.0.1", () => {
  console.log(
    `[COMMAND_CENTER] GEMINI key present ${hasGeminiKey()} | NOTION key present ${hasNotionKey()} | DB present ${hasNotionDb()}`
  );
  console.log(`Mikage Command Center running at: http://127.0.0.1:${PORT}`);
  appendLog(`Command Center started on port ${PORT}`);
});
