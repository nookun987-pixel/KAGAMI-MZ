/**
 * MIKAGE — /translator/ollama_translate.js
 * Converts structured_prompt_spec → flat Fooocus-compatible prompt strings.
 *
 * Two modes:
 *   1. LOCAL — deterministic string assembly (no LLM, zero drift risk)
 *   2. OLLAMA — sends to local Ollama instance, validates output with guard
 *
 * LOCAL mode is the DEFAULT and RECOMMENDED path.
 * Ollama adds latency, VRAM cost, and drift risk for a task that is
 * pure mechanical concatenation. Use Ollama only when explicitly requested.
 *
 * Output format: { positive_prompt: String, negative_prompt: String, technical_notes: String[] }
 */

"use strict";

const { validateTranslation, buildStricterInput } = require("./translator_guard");

// ===================================================================
// CONFIG
// ===================================================================

const CONFIG = Object.freeze({
  ollama_endpoint: (process.env.OLLAMA_HOST || process.env.OLLAMA_URL || "http://localhost:11434") + "/api/generate",
  ollama_model: process.env.OLLAMA_MODEL || "llama3",
  ollama_timeout_ms: parseInt(process.env.OLLAMA_TIMEOUT_MS) || 60000,
  max_retranslate_attempts: 2,
  mode: process.env.TRANSLATOR_MODE || "LOCAL",  // "LOCAL" | "OLLAMA"
});

// ===================================================================
// LOCAL TRANSLATOR — deterministic, zero drift
// ===================================================================

/**
 * Assemble a flat positive prompt from structured spec.
 * Pure string concatenation. No LLM. No creativity.
 *
 * Order follows Canon prompt template:
 *   1. Identity (subject)
 *   2. Material/Texture
 *   3. Detail (composition rules)
 *   4. Lighting
 *   5. Environment hints (extracted from texture/composition)
 *   6. Technical (lens, grain, aspect ratio)
 *
 * @param {Object} spec  normalized structured_prompt_spec
 * @returns {string}      flat comma-separated positive prompt
 */
function assemblePositivePrompt(spec) {
  if (!spec) throw new Error("[TRANSLATOR] spec is null");

  const segments = [];

  // --- 1. Identity ---
  if (spec.subject) {
    segments.push(spec.subject.trim());
  }

  // --- 2. Texture / Material ---
  if (Array.isArray(spec.texture)) {
    for (const t of spec.texture) {
      const cleaned = cleanSegment(t);
      if (cleaned) segments.push(cleaned);
    }
  }

  // --- 3. Lighting ---
  if (Array.isArray(spec.lighting)) {
    for (const l of spec.lighting) {
      const cleaned = cleanSegment(l);
      if (cleaned) segments.push(cleaned);
    }
  }

  // --- 4. Composition / Detail ---
  if (Array.isArray(spec.composition_rules)) {
    for (const c of spec.composition_rules) {
      const cleaned = cleanSegment(c);
      // Skip meta-rules that aren't prompt-friendly
      if (cleaned && !isMetaRule(cleaned)) {
        segments.push(cleaned);
      }
    }
  }

  // Deduplicate (case-insensitive, preserving first occurrence)
  const seen = new Set();
  const deduped = [];
  for (const seg of segments) {
    const key = seg.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(seg);
    }
  }

  return deduped.join(", ");
}

/**
 * Assemble a flat negative prompt from structured spec.
 *
 * @param {Object} spec  normalized structured_prompt_spec
 * @returns {string}      flat comma-separated negative prompt
 */
function assembleNegativePrompt(spec) {
  if (!spec) throw new Error("[TRANSLATOR] spec is null");

  const negatives = Array.isArray(spec.negative_prompt) ? spec.negative_prompt : [];

  // Deduplicate
  const seen = new Set();
  const deduped = [];
  for (const n of negatives) {
    const key = n.toLowerCase().trim();
    if (key && !seen.has(key)) {
      seen.add(key);
      deduped.push(n.trim());
    }
  }

  return deduped.join(", ");
}

/**
 * Extract technical notes from composition rules.
 * These are non-prompt instructions for the render executor.
 *
 * @param {Object} spec
 * @returns {string[]}
 */
function extractTechnicalNotes(spec) {
  const notes = [];

  if (Array.isArray(spec.composition_rules)) {
    for (const rule of spec.composition_rules) {
      const r = rule.toLowerCase();
      if (r.includes("negative space")) {
        notes.push("preserve negative space >= 40%");
      }
      if (r.includes("broken symmetry")) {
        notes.push("avoid centered symmetry");
      }
      if (r.includes("2.76:1") || r.includes("2.39:1") || r.includes("2.35:1")) {
        notes.push("enforce anamorphic aspect ratio");
      }
      if (r.includes("micro-humanity")) {
        notes.push("ensure at least 1 micro-humanity motif visible");
      }
      if (r.includes("foreground")) {
        notes.push("foreground depth element required");
      }
      if (r.includes("film grain")) {
        notes.push("film grain texture layer active");
      }
    }
  }

  // Deduplicate
  return [...new Set(notes)];
}

/**
 * Clean a segment string for prompt use.
 * Removes explanatory prefixes and normalizes whitespace.
 */
function cleanSegment(str) {
  if (!str) return "";
  return str
    .replace(/—/g, ",")                   // em-dash to comma
    .replace(/\s+/g, " ")                 // collapse whitespace
    .replace(/^\s*[-•]\s*/, "")           // strip leading bullets
    .trim();
}

/**
 * Check if a composition rule is a meta-rule (not suitable for prompt text).
 * Meta-rules are enforcement constraints, not visual descriptions.
 */
function isMetaRule(str) {
  const s = str.toLowerCase();
  const metaPatterns = [
    "required",
    "must be",
    "must have",
    "at least",
    "enforce",
    ">=",
    "<=",
    ">",
    "three-axis rule",
    "70/30 ratio",
  ];
  return metaPatterns.some((p) => s.includes(p));
}

/**
 * LOCAL translate — no Ollama, pure assembly.
 *
 * @param {Object} spec  structured_prompt_spec from mapper.normalize()
 * @returns {Object}     { positive_prompt, negative_prompt, technical_notes, mode: "LOCAL" }
 */
function translateLocal(spec) {
  const positive_prompt = assemblePositivePrompt(spec);
  const negative_prompt = assembleNegativePrompt(spec);
  const technical_notes = extractTechnicalNotes(spec);

  return {
    positive_prompt,
    negative_prompt,
    technical_notes,
    mode: "LOCAL",
  };
}

// ===================================================================
// OLLAMA TRANSLATOR — LLM path (optional, higher risk)
// ===================================================================

/**
 * Build the Ollama request payload.
 * Includes strict system prompt that locks Ollama to translation-only mode.
 *
 * @param {Object} spec  structured_prompt_spec
 * @returns {Object}     Ollama API request body
 */
function buildOllamaPayload(spec) {
  const systemPrompt =
    "You are a PROMPT TRANSLATOR. You convert structured image generation specifications " +
    "into flat comma-separated prompt strings for Stable Diffusion / Fooocus.\n\n" +
    "ABSOLUTE RULES:\n" +
    "- Output ONLY a JSON object with positive_prompt and negative_prompt fields\n" +
    "- positive_prompt: single flat comma-separated string\n" +
    "- negative_prompt: single flat comma-separated string\n" +
    "- Do NOT add ANY words, concepts, or descriptions not present in the input\n" +
    "- Do NOT add emotional adjectives (beautiful, stunning, gorgeous, etc.)\n" +
    "- Do NOT add narrative elements (scene, story, character feelings)\n" +
    "- Do NOT add camera directions (pan, zoom, fade)\n" +
    "- Do NOT reinterpret or enhance the input creatively\n" +
    "- PRESERVE every negative prompt term from the input exactly\n" +
    "- You are a mechanical translator, not an artist\n\n" +
    "OUTPUT FORMAT (JSON only, no markdown, no explanation):\n" +
    '{"positive_prompt": "...", "negative_prompt": "..."}';

  const userPrompt =
    "Translate this structured specification into flat prompt strings.\n\n" +
    JSON.stringify(spec, null, 2);

  return {
    model: CONFIG.ollama_model,
    prompt: userPrompt,
    system: systemPrompt,
    stream: false,
    options: {
      temperature: 0.0,    // zero creativity
      top_p: 0.1,          // minimal sampling variance
      num_predict: 512,
    },
  };
}

/**
 * Parse Ollama response text into structured output.
 * Handles JSON extraction from potentially messy LLM output.
 *
 * @param {string} responseText  Raw text from Ollama
 * @returns {Object|null}        Parsed { positive_prompt, negative_prompt } or null
 */
function parseOllamaResponse(responseText) {
  if (!responseText || typeof responseText !== "string") return null;

  // Try direct JSON parse
  try {
    const parsed = JSON.parse(responseText.trim());
    if (parsed.positive_prompt && parsed.negative_prompt) return parsed;
  } catch (_) {
    // Not clean JSON — try extraction
  }

  // Try extracting JSON from markdown code blocks
  const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1].trim());
      if (parsed.positive_prompt && parsed.negative_prompt) return parsed;
    } catch (_) {
      // Failed
    }
  }

  // Try finding JSON object in text
  const braceMatch = responseText.match(/\{[\s\S]*"positive_prompt"[\s\S]*"negative_prompt"[\s\S]*\}/);
  if (braceMatch) {
    try {
      const parsed = JSON.parse(braceMatch[0]);
      if (parsed.positive_prompt && parsed.negative_prompt) return parsed;
    } catch (_) {
      // Failed
    }
  }

  return null;
}

/**
 * Call Ollama API and translate the spec.
 * Requires Ollama to be running locally.
 *
 * @param {Object}  spec     structured_prompt_spec
 * @param {Object}  [opts]   { endpoint, model, timeout_ms }
 * @returns {Promise<Object>} { positive_prompt, negative_prompt, technical_notes, mode: "OLLAMA" }
 * @throws {Error}           If Ollama is unreachable or response is unparseable
 */
async function translateOllama(spec, opts) {
  const endpoint = (opts && opts.endpoint) || CONFIG.ollama_endpoint;
  const timeoutMs = (opts && opts.timeout_ms) || CONFIG.ollama_timeout_ms;

  const payload = buildOllamaPayload(spec);

  // Dynamic import http module (Node built-in, no npm dependency)
  const http = require("http");
  const url = new URL(endpoint);

  const body = JSON.stringify(payload);

  const response = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      req.destroy();
      reject(new Error(`[TRANSLATOR] Ollama timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          clearTimeout(timer);
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`[TRANSLATOR] Ollama response parse error: ${e.message}`));
          }
        });
      }
    );

    req.on("error", (e) => {
      clearTimeout(timer);
      reject(new Error(`[TRANSLATOR] Ollama connection error: ${e.message}`));
    });

    req.write(body);
    req.end();
  });

  // Extract response text
  const responseText = response.response || response.message || "";
  const parsed = parseOllamaResponse(responseText);

  if (!parsed) {
    throw new Error("[TRANSLATOR] Failed to parse Ollama output as valid JSON with positive_prompt and negative_prompt");
  }

  return {
    positive_prompt: parsed.positive_prompt,
    negative_prompt: parsed.negative_prompt,
    technical_notes: extractTechnicalNotes(spec),
    mode: "OLLAMA",
    raw_response: responseText,
  };
}

// ===================================================================
// MAIN TRANSLATE FUNCTION — with guard integration
// ===================================================================

/**
 * @typedef {Object} TranslationResult
 * @property {boolean}  valid              Guard validation result
 * @property {string}   positive_prompt    Flat prompt string
 * @property {string}   negative_prompt    Flat negative string
 * @property {string[]} technical_notes    Non-prompt render hints
 * @property {string}   mode               "LOCAL" | "OLLAMA"
 * @property {Object}   guard_result       Full guard validation output
 * @property {number}   attempts           How many translation attempts
 */

/**
 * Translate a structured_prompt_spec into flat render prompts.
 *
 * Pipeline:
 *   1. Translate (LOCAL or OLLAMA)
 *   2. Run translator_guard.validateTranslation()
 *   3. If guard rejects + OLLAMA mode → retry with stricter input (max 2 retries)
 *   4. Return validated result
 *
 * @param {Object}  spec     structured_prompt_spec from mapper.normalize()
 * @param {Object}  [opts]   { mode: "LOCAL"|"OLLAMA", endpoint, model, timeout_ms }
 * @returns {Promise<TranslationResult>}
 */
async function translate(spec, opts) {
  if (!spec || typeof spec !== "object") {
    throw new Error("[TRANSLATOR] spec is null or not an object");
  }

  const mode = (opts && opts.mode) || CONFIG.mode;
  const maxAttempts = (mode === "OLLAMA") ? CONFIG.max_retranslate_attempts + 1 : 1;

  let output = null;
  let guardResult = null;
  let currentSpec = spec;
  let attempt = 0;

  for (attempt = 1; attempt <= maxAttempts; attempt++) {
    // --- Step 1: Translate ---
    if (mode === "LOCAL") {
      output = translateLocal(currentSpec);
    } else if (mode === "OLLAMA") {
      output = await translateOllama(currentSpec, opts);
    } else {
      throw new Error(`[TRANSLATOR] Unknown mode: ${mode}`);
    }

    // --- Step 2: Guard validation ---
    guardResult = validateTranslation(spec, output);

    // --- Step 3: Pass or retry ---
    if (guardResult.valid) {
      break;
    }

    // LOCAL mode never retries — deterministic output won't change
    if (mode === "LOCAL") {
      break;
    }

    // OLLAMA mode: build stricter input and retry
    if (attempt < maxAttempts) {
      const stricter = buildStricterInput(spec, guardResult.summary);
      currentSpec = stricter.structured_prompt_spec;
      // Note: stricter.rules will be sent as part of the next Ollama payload
    }
  }

  return {
    valid: guardResult.valid,
    positive_prompt: output.positive_prompt,
    negative_prompt: output.negative_prompt,
    technical_notes: output.technical_notes,
    mode: output.mode,
    guard_result: guardResult,
    attempts: attempt,
  };
}

// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  // Main entry
  translate,

  // Mode-specific translators
  translateLocal,
  translateOllama,

  // Assembly functions (for testing)
  assemblePositivePrompt,
  assembleNegativePrompt,
  extractTechnicalNotes,

  // Ollama helpers (for testing)
  buildOllamaPayload,
  parseOllamaResponse,

  // Internal helpers (for testing)
  cleanSegment,
  isMetaRule,

  // Config
  CONFIG,
};
