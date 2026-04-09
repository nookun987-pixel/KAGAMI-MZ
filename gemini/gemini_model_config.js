"use strict";

/**
 * Central Gemini model registry.
 * Change model aliases here — call sites should NEVER hard-code model strings.
 *
 * To migrate to Gemini 3: set env vars or update the fallback strings below.
 * THINKING_SIGNATURE_SUPPORTED_PREFIXES controls which models get signature injection.
 */

const MODEL_ALIASES = {
  intake:    process.env.GEMINI_INTAKE_MODEL    || process.env.GEMINI_MODEL        || "gemini-2.5-flash",
  validator: process.env.GEMINI_VALIDATOR_MODEL || process.env.GEMINI_VISION_MODEL || "gemini-2.5-flash",
  judge:     process.env.GEMINI_JUDGE_MODEL     || process.env.GEMINI_MODEL        || "gemini-2.5-flash",
  runtime:   process.env.GEMINI_RUNTIME_MODEL   || process.env.GEMINI_MODEL        || "gemini-2.5-flash",
};

/**
 * Models whose prefixes support the thinking_signature handshake.
 * Updated here when Gemini 3 (or Pro variants) confirm the feature.
 */
const THINKING_SIGNATURE_SUPPORTED_PREFIXES = [
  "gemini-3",
  // "gemini-2.5-pro",  // Uncomment when confirmed
];

function resolveModel(role) {
  return MODEL_ALIASES[String(role)] || MODEL_ALIASES.intake;
}

function supportsThinkingSignature(model) {
  const m = String(model || "").toLowerCase();
  return THINKING_SIGNATURE_SUPPORTED_PREFIXES.some((prefix) => m.startsWith(prefix));
}

module.exports = { resolveModel, supportsThinkingSignature, MODEL_ALIASES };
