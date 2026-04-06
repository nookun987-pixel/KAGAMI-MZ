/**
 * object_definition/object_intent_normalizer.js
 * 
 * Normalizes raw creative intent (from Gemini intake or user input)
 * into structured object-oriented design intent.
 *
 * INPUT:  raw intent string or intake object
 * OUTPUT: normalized design intent with object_class, subject, material hints
 *
 * This is the first gate: vague/abstract/texture-only intents are flagged
 * before any spec generation happens.
 */

"use strict";

const VALID_OBJECT_CLASSES = [
  "mask", "weapon", "vessel", "garment", "artifact",
  "architecture", "creature", "symbol",
];

const ABSTRACT_REJECT_PATTERNS = [
  /^(texture|abstract|mood|vibe|feeling|atmosphere|ambien)/i,
  /^(color palette|gradient|pattern field|noise)/i,
  /^(beautiful|stunning|gorgeous|epic)\s*$/i,
];

const OBJECT_CLASS_HINTS = {
  mask: [/mask/i, /kitsune/i, /hannya/i, /noh/i, /face\s*(piece|plate|cover)/i, /kabuki/i],
  weapon: [/sword/i, /katana/i, /blade/i, /spear/i, /naginata/i, /bow/i, /dagger/i, /axe/i, /weapon/i],
  vessel: [/bowl/i, /cup/i, /vase/i, /jar/i, /teapot/i, /vessel/i, /container/i, /urn/i],
  garment: [/kimono/i, /robe/i, /armor/i, /garment/i, /cloak/i, /haori/i],
  artifact: [/artifact/i, /relic/i, /talisman/i, /amulet/i, /charm/i, /totem/i, /idol/i],
  architecture: [/gate/i, /torii/i, /shrine/i, /temple/i, /tower/i, /bridge/i, /building/i],
  creature: [/dragon/i, /oni/i, /yokai/i, /spirit/i, /creature/i, /beast/i],
  symbol: [/crest/i, /emblem/i, /seal/i, /sigil/i, /mon\b/i, /symbol/i, /kanji/i],
};

const MATERIAL_HINTS = {
  ceramic: [/ceramic/i, /porcelain/i, /clay/i, /earthenware/i, /stoneware/i],
  metal: [/steel/i, /iron/i, /bronze/i, /gold/i, /silver/i, /copper/i, /metal/i, /forged/i],
  wood: [/wood/i, /lacquer/i, /carved\s*wood/i, /timber/i, /bamboo/i],
  stone: [/stone/i, /marble/i, /granite/i, /obsidian/i, /jade/i],
  fabric: [/silk/i, /cotton/i, /linen/i, /fabric/i, /woven/i, /cloth/i],
};

/**
 * Normalize raw creative intent into structured design intent.
 *
 * @param {string|object} rawIntent - Raw string or intake object with .prompt / .user_idea
 * @returns {{ ok: boolean, design_intent: object|null, rejection: object|null }}
 */
function normalizeIntent(rawIntent) {
  // Extract text
  let text = "";
  let meta = {};
  if (typeof rawIntent === "string") {
    text = rawIntent.trim();
  } else if (rawIntent && typeof rawIntent === "object") {
    text = (rawIntent.prompt || rawIntent.user_idea || rawIntent.intent || "").trim();
    meta = rawIntent;
  }

  if (!text) {
    return {
      ok: false,
      design_intent: null,
      rejection: { reason: "EMPTY_INTENT", detail: "No creative intent provided" },
    };
  }

  // Reject pure abstract/texture intents
  for (const pattern of ABSTRACT_REJECT_PATTERNS) {
    if (pattern.test(text)) {
      return {
        ok: false,
        design_intent: null,
        rejection: {
          reason: "ABSTRACT_REJECT",
          detail: `Intent '${text.slice(0, 80)}' is abstract/texture-only. Must describe a concrete designed object.`,
          matched_pattern: pattern.toString(),
        },
      };
    }
  }

  // Detect object class
  let detectedClass = null;
  let classConfidence = 0;
  for (const [cls, patterns] of Object.entries(OBJECT_CLASS_HINTS)) {
    for (const p of patterns) {
      if (p.test(text)) {
        detectedClass = cls;
        classConfidence = 0.9;
        break;
      }
    }
    if (detectedClass) break;
  }

  if (!detectedClass) {
    // Attempt fallback: if text mentions "object" or "design" generically
    if (/object|design|product|item|piece/i.test(text)) {
      detectedClass = "artifact";
      classConfidence = 0.5;
    }
  }

  if (!detectedClass) {
    return {
      ok: false,
      design_intent: null,
      rejection: {
        reason: "NO_OBJECT_CLASS",
        detail: `Cannot identify a concrete object class in: '${text.slice(0, 120)}'. Must mention a recognizable designed object.`,
        hint: `Valid classes: ${VALID_OBJECT_CLASSES.join(", ")}`,
      },
    };
  }

  // Detect material hints
  let detectedMaterial = null;
  for (const [mat, patterns] of Object.entries(MATERIAL_HINTS)) {
    for (const p of patterns) {
      if (p.test(text)) {
        detectedMaterial = mat;
        break;
      }
    }
    if (detectedMaterial) break;
  }

  // Extract subject noun phrase (rough heuristic: longest noun-like segment)
  const subjectHint = extractSubjectHint(text);

  return {
    ok: true,
    design_intent: {
      raw_text: text,
      object_class: detectedClass,
      class_confidence: classConfidence,
      subject_hint: subjectHint,
      material_hint: detectedMaterial,
      meta,
      normalized_at: new Date().toISOString(),
    },
    rejection: null,
  };
}

/**
 * Extract the most likely subject noun phrase from intent text.
 */
function extractSubjectHint(text) {
  // Remove common prompt scaffolding
  let clean = text
    .replace(/extreme\s+macro\s+product\s+photography[,.]?\s*/i, "")
    .replace(/premium\s+studio\s+close-up[,.]?\s*/i, "")
    .replace(/single\s+dominant\s+subject[,.]?\s*/i, "")
    .replace(/high[\s-]quality[,.]?\s*/i, "")
    .replace(/detailed[,.]?\s*/i, "")
    .trim();

  // Take first meaningful clause (before first major separator)
  const clauses = clean.split(/[,;]/);
  for (const clause of clauses) {
    const trimmed = clause.trim();
    if (trimmed.length > 5 && /\b(mask|sword|vessel|artifact|weapon|garment|creature|gate|shrine|crest)\b/i.test(trimmed)) {
      return trimmed;
    }
  }
  return clauses[0] ? clauses[0].trim() : clean.slice(0, 100);
}

module.exports = {
  normalizeIntent,
  VALID_OBJECT_CLASSES,
  OBJECT_CLASS_HINTS,
  MATERIAL_HINTS,
};
