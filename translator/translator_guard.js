/**
 * MIKAGE — /translator/translator_guard.js
 * Validates Ollama output has not exceeded translator authority.
 * Ollama is a TRANSLATOR ONLY — zero creativity permitted.
 *
 * Checks:
 *   1. No added concepts (terms not traceable to input spec)
 *   2. No tone shift (emotional language injected)
 *   3. No persona creation (new characters, names, backstory)
 *   4. No narrative break (story elements, plot, dialogue)
 *   5. No forbidden Canon terms leaked into positive prompt
 *   6. Negative prompt preserved (no dropped terms)
 *
 * On any violation → REJECT translator output.
 */

"use strict";

const { CANON } = require("../control/precheck");
const { NEGATIVE_PROMPT_CORE } = require("../middleware/constraints");

// ===================================================================
// VOCABULARY THAT OLLAMA MUST NEVER INJECT
// ===================================================================

// Creative/emotional words that signal Ollama is adding mood/narrative
const TONE_SHIFT_MARKERS = Object.freeze([
  "beautiful", "gorgeous", "stunning", "breathtaking", "magnificent",
  "amazing", "wonderful", "incredible", "spectacular", "glorious",
  "ethereal", "dreamlike", "magical", "mystical", "enchanting",
  "whimsical", "fantasy", "fairy", "angel", "demon",
  "lovely", "pretty", "cute", "adorable", "charming",
  "sexy", "seductive", "sensual", "alluring", "provocative",
  "epic", "legendary", "mythic", "heroic", "divine",
  "terrifying", "horrifying", "nightmarish", "grotesque",
  "joyful", "happy", "cheerful", "playful", "fun",
  "romantic", "passionate", "loving", "tender",
]);

// Persona/narrative injection markers
const PERSONA_MARKERS = Object.freeze([
  "she feels", "she thinks", "she wants", "she dreams",
  "he feels", "he thinks", "his desire",
  "the warrior", "the goddess", "the queen", "the princess",
  "the hero", "the savior", "the chosen",
  "a story of", "once upon", "in a world where",
  "backstory", "origin story", "flashback",
  "inner monologue", "thoughts racing",
  "with a smile", "tears in", "laughing", "crying",
  "speaks softly", "whispers", "screams",
  "friendship", "love interest", "rival",
  "companion", "sidekick", "mentor",
]);

// Structural additions that indicate Ollama went beyond translation
const STRUCTURAL_ADDITIONS = Object.freeze([
  "scene:", "act:", "chapter:", "setting:",
  "character description:", "mood:", "theme:",
  "inspired by", "in the style of", "reminiscent of",
  "similar to", "like a", "as if",
  "imagine", "picture", "envision", "visualize",
  "camera slowly", "camera pans", "camera zooms",
  "fade to", "cut to", "dissolve",
  "soundtrack", "music", "sound effect",
]);

// Canon forbidden terms that must NEVER appear in positive prompt
// (they belong in negative prompt only)
const CANON_FORBIDDEN_IN_POSITIVE = Object.freeze([
  ...CANON.FORBIDDEN_ABSOLUTE,
  ...CANON.COLORS_FORBIDDEN,
]);

// ===================================================================
// UTILITY
// ===================================================================

function norm(str) {
  return String(str || "").toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Extract all meaningful tokens from a string.
 * Removes common SD syntax (parentheses, colons, weights) and splits on delimiters.
 */
function tokenize(str) {
  return norm(str)
    .replace(/[()[\]{}]/g, " ")     // remove brackets
    .replace(/:\d+\.?\d*/g, " ")    // remove SD weights like :1.2
    .replace(/[,.:;|]/g, " ")       // split on punctuation
    .split(/\s+/)
    .filter((t) => t.length > 2);   // drop very short tokens
}

/**
 * Extract multi-word phrases (2-3 word ngrams) from a string.
 */
function extractPhrases(str) {
  const words = norm(str).replace(/[,.:;|()\[\]{}]/g, " ").split(/\s+/).filter(Boolean);
  const phrases = [];
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(words[i] + " " + words[i + 1]);
    if (i < words.length - 2) {
      phrases.push(words[i] + " " + words[i + 1] + " " + words[i + 2]);
    }
  }
  return phrases;
}

/**
 * Build the full vocabulary set from the input spec.
 * Any token in the output must be traceable to this set (or to Canon-safe common words).
 */
function buildInputVocabulary(inputSpec) {
  const vocab = new Set();

  // Flatten all input fields into tokens
  const fields = [
    inputSpec.subject || "",
    ...(inputSpec.lighting || []),
    ...(inputSpec.texture || []),
    ...(inputSpec.composition_rules || []),
    ...(inputSpec.negative_prompt || []),
  ];

  for (const field of fields) {
    for (const token of tokenize(field)) {
      vocab.add(token);
    }
  }

  // Add common SD vocabulary that translators are allowed to use
  // These are technical terms, not creative additions
  const SD_COMMON = [
    "masterpiece", "best", "quality", "high", "resolution", "detailed",
    "ultra", "sharp", "focus", "depth", "field", "realistic",
    "photorealistic", "raw", "photo", "shot", "camera",
    "wide", "angle", "close", "portrait", "full", "body",
    "lighting", "light", "dark", "shadow", "contrast",
    "background", "foreground", "ambient", "atmospheric",
    "matte", "satin", "metallic", "surface", "texture",
    "cinematic", "film", "grain", "analog", "anamorphic",
    "lens", "bokeh", "noise", "vignette",
    "negative", "space", "composition", "framing",
    "black", "white", "red", "crimson", "gold", "grey", "gray",
    "industrial", "mechanical", "hard", "surface", "armor",
    "porcelain", "ceramic", "carbon", "fiber", "titanium",
    "kintsugi", "crack", "fracture", "seam",
    "sci-fi", "sci", "cyberpunk", "brutalist", "concrete",
    "rain", "mist", "fog", "steam", "smoke", "dust",
    "straight", "blade", "sword", "weapon", "massive",
    "helmet", "mask", "visor", "eye", "slit",
    "hair", "flowing", "long", "heavy",
    "glow", "internal", "energy", "heated",
    "void", "optical", "sensor",
    "rim", "key", "fill", "backlight",
    "chiaroscuro", "subsurface", "scattering",
    "the", "and", "with", "from", "into", "through",
    "very", "extremely", "slightly", "subtle", "faint",
    "not", "without", "lack", "absence",
  ];

  for (const word of SD_COMMON) {
    vocab.add(word);
  }

  return vocab;
}


// ===================================================================
// VALIDATION CHECKS
// ===================================================================

/**
 * Check 1: No added concepts.
 * Every significant token in Ollama output must be traceable to the input vocabulary.
 *
 * @param {Object} inputSpec    structured_prompt_spec sent to Ollama
 * @param {Object} output       Ollama output { positive_prompt, negative_prompt }
 * @returns {{ passed: boolean, foreignTokens: string[] }}
 */
function checkNoAddedConcepts(inputSpec, output) {
  const vocab = buildInputVocabulary(inputSpec);
  const outputTokens = tokenize(output.positive_prompt || "");

  const foreign = [];
  for (const token of outputTokens) {
    if (!vocab.has(token)) {
      // Check if it's a substring of any vocab word or vice versa
      let found = false;
      for (const v of vocab) {
        if (v.includes(token) || token.includes(v)) {
          found = true;
          break;
        }
      }
      if (!found) {
        foreign.push(token);
      }
    }
  }

  // Allow up to 3 foreign tokens (tolerance for minor SD syntax variations)
  // but flag them. More than 3 = creative addition.
  return {
    passed: foreign.length <= 3,
    foreignTokens: foreign,
  };
}

/**
 * Check 2: No tone shift.
 * Scan for emotional/creative vocabulary that signals Ollama is adding mood.
 *
 * @param {Object} output  Ollama output
 * @returns {{ passed: boolean, violations: string[] }}
 */
function checkNoToneShift(output) {
  const text = norm(output.positive_prompt || "");
  const violations = [];

  for (const marker of TONE_SHIFT_MARKERS) {
    if (text.includes(norm(marker))) {
      violations.push(marker);
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

/**
 * Check 3: No persona creation.
 * Scan for character-building, narrative, or backstory injection.
 *
 * @param {Object} output  Ollama output
 * @returns {{ passed: boolean, violations: string[] }}
 */
function checkNoPersonaCreation(output) {
  const text = norm(output.positive_prompt || "");
  const violations = [];

  for (const marker of PERSONA_MARKERS) {
    if (text.includes(norm(marker))) {
      violations.push(marker);
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

/**
 * Check 4: No narrative break.
 * Scan for structural additions (scene directions, camera moves, narrative framing).
 *
 * @param {Object} output  Ollama output
 * @returns {{ passed: boolean, violations: string[] }}
 */
function checkNoNarrativeBreak(output) {
  const text = norm(output.positive_prompt || "");
  const violations = [];

  for (const marker of STRUCTURAL_ADDITIONS) {
    if (text.includes(norm(marker))) {
      violations.push(marker);
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

/**
 * Check 5: No Canon-forbidden terms in positive prompt.
 * These terms must only appear in negative_prompt, never in positive.
 *
 * @param {Object} output  Ollama output
 * @returns {{ passed: boolean, violations: string[] }}
 */
function checkNoForbiddenInPositive(output) {
  const text = norm(output.positive_prompt || "");
  const violations = [];

  for (const term of CANON_FORBIDDEN_IN_POSITIVE) {
    const t = norm(term);
    if (t && text.includes(t)) {
      violations.push(term);
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

/**
 * Check 6: Negative prompt preservation.
 * Critical negative terms from input must not be dropped by Ollama.
 * We check that at least 80% of the input negative terms survive in the output.
 *
 * @param {Object} inputSpec  structured_prompt_spec
 * @param {Object} output     Ollama output
 * @returns {{ passed: boolean, dropped: string[], preservationRate: number }}
 */
function checkNegativePreserved(inputSpec, output) {
  const inputNegatives = (inputSpec.negative_prompt || []).map(norm);
  const outputNegText = norm(output.negative_prompt || "");

  if (inputNegatives.length === 0) {
    return { passed: true, dropped: [], preservationRate: 1.0 };
  }

  const dropped = [];
  let preserved = 0;

  for (const neg of inputNegatives) {
    if (!neg) continue;
    // Check if the core concept survives (allow minor rewording)
    const coreWords = neg.split(/\s+/).filter((w) => w.length > 3);
    const found = coreWords.length === 0 || coreWords.some((w) => outputNegText.includes(w));

    if (found) {
      preserved++;
    } else {
      dropped.push(neg);
    }
  }

  const rate = preserved / inputNegatives.length;

  return {
    passed: rate >= 0.80,
    dropped,
    preservationRate: Math.round(rate * 100) / 100,
  };
}

/**
 * Check 7: Output structure validity.
 * Ollama must return { positive_prompt: String, negative_prompt: String }.
 * Both must be non-empty strings.
 *
 * @param {Object} output
 * @returns {{ passed: boolean, violations: string[] }}
 */
function checkOutputStructure(output) {
  const violations = [];

  if (!output || typeof output !== "object") {
    violations.push("Output is null or not an object");
    return { passed: false, violations };
  }

  if (typeof output.positive_prompt !== "string" || output.positive_prompt.trim().length === 0) {
    violations.push("positive_prompt is missing or empty");
  }

  if (typeof output.negative_prompt !== "string" || output.negative_prompt.trim().length === 0) {
    violations.push("negative_prompt is missing or empty");
  }

  // Minimum length sanity — a real prompt should be at least 50 chars
  if (output.positive_prompt && output.positive_prompt.trim().length < 50) {
    violations.push(`positive_prompt suspiciously short (${output.positive_prompt.trim().length} chars)`);
  }

  // Maximum length sanity — SD has ~77 token limit per CLIP chunk, but we allow longer
  // because Fooocus handles long prompts. Flag if absurdly long (> 3000 chars).
  if (output.positive_prompt && output.positive_prompt.length > 3000) {
    violations.push(`positive_prompt excessively long (${output.positive_prompt.length} chars) — may indicate narrative injection`);
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}


// ===================================================================
// MAIN VALIDATION FUNCTION
// ===================================================================

/**
 * @typedef {Object} GuardResult
 * @property {boolean}  valid         True if all checks pass
 * @property {Object[]} violations    Array of { check, passed, detail }
 * @property {string}   verdict       "PASS" | "REJECT"
 * @property {string[]} summary       Human-readable summary of violations
 */

/**
 * Validate Ollama translator output against the input spec.
 * Any single check failure → REJECT.
 *
 * @param {Object} inputSpec   structured_prompt_spec sent to Ollama
 * @param {Object} output      Ollama output { positive_prompt, negative_prompt, technical_notes? }
 * @returns {GuardResult}
 */
function validateTranslation(inputSpec, output) {
  const checks = [];
  const summary = [];

  // --- 0. Structure ---
  const c0 = checkOutputStructure(output);
  checks.push({ check: "output_structure", ...c0 });
  if (!c0.passed) {
    for (const v of c0.violations) summary.push(`[STRUCTURE] ${v}`);
    // Early return — can't check content of broken output
    return {
      valid: false,
      violations: checks,
      verdict: "REJECT",
      summary,
    };
  }

  // --- 1. Added concepts ---
  const c1 = checkNoAddedConcepts(inputSpec, output);
  checks.push({ check: "no_added_concepts", passed: c1.passed, foreignTokens: c1.foreignTokens });
  if (!c1.passed) {
    summary.push(`[ADDED_CONCEPTS] Foreign tokens: ${c1.foreignTokens.join(", ")}`);
  }

  // --- 2. Tone shift ---
  const c2 = checkNoToneShift(output);
  checks.push({ check: "no_tone_shift", ...c2 });
  if (!c2.passed) {
    summary.push(`[TONE_SHIFT] Emotional language injected: ${c2.violations.join(", ")}`);
  }

  // --- 3. Persona creation ---
  const c3 = checkNoPersonaCreation(output);
  checks.push({ check: "no_persona_creation", ...c3 });
  if (!c3.passed) {
    summary.push(`[PERSONA] Narrative injection: ${c3.violations.join(", ")}`);
  }

  // --- 4. Narrative break ---
  const c4 = checkNoNarrativeBreak(output);
  checks.push({ check: "no_narrative_break", ...c4 });
  if (!c4.passed) {
    summary.push(`[NARRATIVE] Structural addition: ${c4.violations.join(", ")}`);
  }

  // --- 5. Forbidden in positive ---
  const c5 = checkNoForbiddenInPositive(output);
  checks.push({ check: "no_forbidden_in_positive", ...c5 });
  if (!c5.passed) {
    summary.push(`[FORBIDDEN] Canon-forbidden in positive prompt: ${c5.violations.join(", ")}`);
  }

  // --- 6. Negative preservation ---
  const c6 = checkNegativePreserved(inputSpec, output);
  checks.push({ check: "negative_preserved", ...c6 });
  if (!c6.passed) {
    summary.push(`[NEG_DROP] Dropped negatives (${c6.preservationRate * 100}% preserved): ${c6.dropped.slice(0, 5).join(", ")}`);
  }

  const allPassed = checks.every((c) => c.passed);

  return {
    valid: allPassed,
    violations: checks.filter((c) => !c.passed),
    verdict: allPassed ? "PASS" : "REJECT",
    summary,
  };
}


// ===================================================================
// STRICTER RE-TRANSLATE INSTRUCTION
// ===================================================================

/**
 * Build a stricter Ollama input after a guard rejection.
 * Adds explicit warnings about the specific violations found.
 *
 * @param {Object}   inputSpec    Original structured_prompt_spec
 * @param {string[]} violations   Summary of what went wrong
 * @returns {Object}              New Ollama input with stricter rules
 */
function buildStricterInput(inputSpec, violations) {
  return {
    task: "translate_to_render_prompt_only",
    rules: {
      no_creativity: true,
      preserve_identity: true,
      preserve_constraints: true,
      strict_mode: true,
      previous_violations: violations,
      explicit_warnings: [
        "DO NOT add any words, concepts, or descriptions not present in the input spec",
        "DO NOT add emotional or aesthetic adjectives (beautiful, stunning, epic, etc.)",
        "DO NOT create characters, names, backstory, or narrative",
        "DO NOT add camera movements, scene transitions, or sound descriptions",
        "ONLY translate the structured spec into a flat comma-separated prompt string",
        "PRESERVE every negative prompt term exactly as given",
        `PREVIOUS ATTEMPT REJECTED FOR: ${violations.join("; ")}`,
      ],
    },
    structured_prompt_spec: inputSpec,
  };
}


// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  // Main validation
  validateTranslation,

  // Individual checks (for testing)
  checkNoAddedConcepts,
  checkNoToneShift,
  checkNoPersonaCreation,
  checkNoNarrativeBreak,
  checkNoForbiddenInPositive,
  checkNegativePreserved,
  checkOutputStructure,

  // Re-translate helper
  buildStricterInput,

  // Vocabulary (for inspection)
  TONE_SHIFT_MARKERS,
  PERSONA_MARKERS,
  STRUCTURAL_ADDITIONS,
};
