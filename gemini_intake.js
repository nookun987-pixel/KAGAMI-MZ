"use strict";

const fs = require("fs");
const path = require("path");
const { getGeminiConfig } = require("./gemini_env");
const { callGeminiWithState, extractResponseText } = require("./gemini/gemini_call_adapter");
const { applyLaneRuleToIntake, normalizeLaneShotType } = require("./lane_rules");
const { applyColorCanonToIntake } = require("./color_rules");

const DEFAULT_FORBIDDEN_READS = [
  "plaster",
  "gypsum",
  "chalk",
  "concrete",
  "carved stone",
  "mineral banding",
  "rough rock",
  "glossy plastic",
  "PVC sheen",
  "toy-like finish",
];

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

function buildBaseStructuredIntake(intakeRequest) {
  const userIdea = normalizeText(intakeRequest && intakeRequest.user_idea);
  const phase = normalizeText(intakeRequest && intakeRequest.phase) || "material_study";
  const shotType = normalizeLaneShotType(intakeRequest && intakeRequest.shot_type);
  const materialStudy = phase === "material_study";

  return applyColorCanonToIntake(applyLaneRuleToIntake({
    creative_intent:
      normalizeText(intakeRequest && intakeRequest.priority_target) ||
      "Manufactured object study with locked material identity and immediate readability.",
    subject: {
      type: "manufactured_object",
      identity: userIdea || "engineered ceramic object",
      must_have: [
        "exactly one manufactured object as the clear subject",
        "visible contour evidence such as edge, rim, bevel, seam, or curvature",
        "material visibly attached to the object, not floating as texture",
      ],
      must_not_have: [
        "texture-only crop",
        "atmosphere-first framing",
        "abstract-first composition",
        "subject dissolved into background",
      ],
    },
    material: {
      primary: materialStudy ? "matte B4C technical ceramic" : "engineered matte ceramic",
      surface: "porcelain-white eggshell microtexture",
      finish: "dry matte engineered finish",
      forbidden_reads: DEFAULT_FORBIDDEN_READS.slice(),
    },
    composition: {
      shot_type: materialStudy ? "macro product study" : "product study",
      framing: "single dominant object, centered or compositionally dominant",
      camera: "macro close-up with readable contour evidence",
      background: "controlled minimal background",
    },
    lighting: {
      style: "controlled low-key product lighting",
      constraints: [
        "no ambient color wash",
        "no neon spill",
        "no glossy hotspots",
      ],
    },
    core_risks: [
      "abstract drift",
      "texture-only drift",
      "material misread as plaster, stone, or glossy plastic",
    ],
    anti_drift_rules: [
      "always preserve one clearly readable manufactured object",
      "do not let texture or atmosphere become the subject",
      "keep material identity locked and explicit",
    ],
    success_criteria: [
      "manufactured object read is immediate",
      "matte ceramic read is immediate",
      "image does not collapse into abstract texture or atmosphere",
    ],
    direction_summary:
      userIdea ||
      "Single manufactured ceramic object with locked matte material identity and clear contour readability.",
    shot_type: shotType,
  }));
}

function normalizeStructuredIntake(candidate, intakeRequest) {
  const base = buildBaseStructuredIntake(intakeRequest);
  const subjectCandidate =
    candidate && typeof candidate.subject === "object" && !Array.isArray(candidate.subject)
      ? candidate.subject
      : {};
  const materialCandidate =
    candidate && typeof candidate.material === "object" && !Array.isArray(candidate.material)
      ? candidate.material
      : {};
  const compositionCandidate =
    candidate && typeof candidate.composition === "object" && !Array.isArray(candidate.composition)
      ? candidate.composition
      : {};
  const lightingCandidate =
    candidate && typeof candidate.lighting === "object" && !Array.isArray(candidate.lighting)
      ? candidate.lighting
      : {};

  return applyColorCanonToIntake(applyLaneRuleToIntake({
    creative_intent:
      normalizeText(candidate && (candidate.creative_intent || candidate.objective)) ||
      base.creative_intent,
    subject: {
      type:
        normalizeText(subjectCandidate.type) ||
        normalizeText(candidate && candidate.subject_type) ||
        "manufactured_object",
      identity:
        normalizeText(subjectCandidate.identity) ||
        normalizeText(candidate && typeof candidate.subject === "string" ? candidate.subject : "") ||
        base.subject.identity,
      must_have: dedupeStrings([
        ...toArray(subjectCandidate.must_have),
        ...toArray(candidate && candidate.pass_signal),
        ...base.subject.must_have,
      ]),
      must_not_have: dedupeStrings([
        ...toArray(subjectCandidate.must_not_have),
        ...toArray(candidate && candidate.fail_signal),
        ...toArray(candidate && candidate.likely_drifts),
        ...base.subject.must_not_have,
      ]),
    },
    material: {
      primary:
        normalizeText(materialCandidate.primary) ||
        normalizeText(candidate && candidate.material_primary) ||
        base.material.primary,
      surface:
        normalizeText(materialCandidate.surface) ||
        normalizeText(candidate && candidate.material_surface) ||
        base.material.surface,
      finish:
        normalizeText(materialCandidate.finish) ||
        normalizeText(candidate && candidate.material_finish) ||
        base.material.finish,
      forbidden_reads: dedupeStrings([
        ...toArray(materialCandidate.forbidden_reads),
        ...toArray(candidate && candidate.fail_signal),
        ...base.material.forbidden_reads,
      ]),
    },
    composition: {
      shot_type:
        normalizeText(compositionCandidate.shot_type) ||
        normalizeText(candidate && candidate.phase_target) ||
        base.composition.shot_type,
      framing: normalizeText(compositionCandidate.framing) || base.composition.framing,
      camera: normalizeText(compositionCandidate.camera) || base.composition.camera,
      background: normalizeText(compositionCandidate.background) || base.composition.background,
    },
    lighting: {
      style: normalizeText(lightingCandidate.style) || base.lighting.style,
      constraints: dedupeStrings([
        ...toArray(lightingCandidate.constraints),
        ...base.lighting.constraints,
      ]),
    },
    core_risks: dedupeStrings([
      ...toArray(candidate && candidate.core_risks),
      ...base.core_risks,
    ]),
    anti_drift_rules: dedupeStrings([
      ...toArray(candidate && candidate.anti_drift_rules),
      ...base.anti_drift_rules,
    ]),
    success_criteria: dedupeStrings([
      ...toArray(candidate && candidate.success_criteria),
      ...toArray(candidate && candidate.pass_signal),
      ...base.success_criteria,
    ]),
    direction_summary:
      normalizeText(candidate && candidate.direction_summary) ||
      base.direction_summary,
    shot_type: normalizeLaneShotType(
      compositionCandidate.shot_type ||
      candidate && candidate.shot_type ||
      intakeRequest && intakeRequest.shot_type
    ),
  }));
}

function sanitizeGeminiText(text) {
  let s = String(text || "").trim();
  // Remove markdown fences: ```json ... ``` or ``` ... ```
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  // Strip any text before first { and after last }
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return "";
  return s.slice(first, last + 1);
}

function extractJson(text) {
  const raw = String(text || "").trim();
  if (!raw) return null;
  // 1. Direct parse
  try {
    return JSON.parse(raw);
  } catch (_) {}
  // 2. Sanitize (strip fences, extract { ... })
  const sanitized = sanitizeGeminiText(raw);
  if (!sanitized) return null;
  try {
    return JSON.parse(sanitized);
  } catch (_) {}
  // 3. Greedy regex fallback
  const match = sanitized.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (_) {
    return null;
  }
}

function buildFallback(intakeRequest) {
  return normalizeStructuredIntake(
    {
      core_risks: ["Gemini API key missing"],
      direction_summary: intakeRequest && intakeRequest.user_idea,
    },
    intakeRequest
  );
}

async function runGeminiIntake(intakeRequest, promptPath, jobId = null) {
  const rubric = fs.readFileSync(path.resolve(promptPath), "utf-8");
  const gemini = getGeminiConfig();

  if (!gemini.hasKey) {
    return {
      ...buildFallback(intakeRequest),
      connector_status: "fallback_local",
      gemini_executed: false,
      parse_ok: true,
      error: "GEMINI_API_KEY missing",
    };
  }

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${rubric}\n\nInput:\n${JSON.stringify(intakeRequest, null, 2)}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  };

  const resolvedJobId = jobId || (intakeRequest && intakeRequest.job_id) || null;
  const { payload, response, geminiTrace } = await callGeminiWithState({
    model: gemini.model,
    apiKey: gemini.apiKey,
    body,
    jobId: resolvedJobId,
    role: "intake",
  });

  const text = extractResponseText(payload);

  const parsed = extractJson(text);
  if (!response.ok || !parsed) {
    return {
      ...buildFallback(intakeRequest),
      connector_status: "gemini_failed",
      gemini_executed: true,
      parse_ok: false,
      http_status: response.status,
      raw_text: String(text || "").slice(0, 2000),
      error: !response.ok ? JSON.stringify(payload).slice(0, 2000) : "Gemini response was not valid JSON",
      gemini_trace: geminiTrace,
    };
  }

  return {
    ...normalizeStructuredIntake(parsed, intakeRequest),
    connector_status: "gemini",
    gemini_executed: true,
    parse_ok: true,
    model: gemini.model,
    gemini_trace: geminiTrace,
  };
}

module.exports = {
  runGeminiIntake,
};
