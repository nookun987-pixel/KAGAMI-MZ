/**
 * object_definition/object_spec_generator.js
 *
 * Generates a full ObjectSpec JSON from a normalized design intent.
 * Uses the approved_object_library for known objects (exact match),
 * or builds a new spec from design_reference_registry + intent hints.
 *
 * INPUT:  normalized design_intent (from object_intent_normalizer)
 * OUTPUT: full ObjectSpec conforming to OBJECT_SPEC_SCHEMA.json
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { loadSafeApprovedLibrary } = require("../memory/approved_object_memory");
const {
  loadCleanedDesignReferences,
  persistSanitizedDesignReferences,
} = require("../canon_evolution/design_reference_sanitizer");
const { resolveCanonV2 } = require("../canon_evolution/canon_v2_resolver");

const SCHEMA_PATH = path.join(__dirname, "OBJECT_SPEC_SCHEMA.json");
const LIBRARY_PATH = path.join(__dirname, "..", "memory", "approved_object_library.json");

/**
 * Load JSON file safely.
 */
function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function dedupeStrings(values) {
  const seen = new Set();
  const output = [];
  for (const value of values || []) {
    const normalized = String(value || "").trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(normalized);
  }
  return output;
}

function isMaskIntent(designIntent) {
  const objectClass = String(designIntent && designIntent.object_class || "").toLowerCase();
  const rawText = String(designIntent && designIntent.raw_text || "").toLowerCase();
  return objectClass === "mask" || rawText.includes("mask");
}

function applyMaskMacroDefaults(spec, designIntent, reference) {
  const referenceFeatures = Array.isArray(reference && reference.key_features) ? reference.key_features : [];
  const readableAs = String(spec.readable_as || designIntent.subject_hint || "technical ceramic mask").trim();
  spec.readable_as = readableAs;
  spec.identity_core.function = "manufactured ceremonial artifact for controlled visual production";
  spec.identity_core.one_sentence =
    `A viewer sees this and immediately knows it is a sealed technical ceramic mask artifact, not a face, costume, or creature.`;
  spec.topology = {
    ...spec.topology,
    primary_form: "engineered symmetrical faceplate",
    symmetry: "perfect_bilateral",
    orientation: "frontal",
    dominant_axis: "vertical",
  };
  spec.silhouette_rules = {
    ...spec.silhouette_rules,
    must_read_as: "a severe symmetrical manufactured mask artifact",
    key_contour_features: dedupeStrings([
      "sealed eye band",
      "center seam",
      "engineered cheek planes",
      "heavy jaw plate",
      "strict bilateral contour",
      ...referenceFeatures.slice(0, 4),
    ]),
    forbidden_silhouettes: dedupeStrings([
      ...(spec.silhouette_rules && spec.silhouette_rules.forbidden_silhouettes || []),
      "horn silhouette",
      "animal ear silhouette",
      "helmet silhouette",
      "halo ring silhouette",
      "asymmetrical profile drift",
    ]),
  };
  spec.must_have_parts = [
    {
      part_name: "sealed_eye_region",
      description: "sealed eye region with no readable human eyes",
      visibility: "required_visible",
    },
    {
      part_name: "engineered_cheek_planes",
      description: "engineered cheek planes with sharp manufactured edge logic",
      visibility: "required_visible",
    },
    {
      part_name: "jaw_plate",
      description: "dense lower jaw plate as hard technical ceramic structure",
      visibility: "required_visible",
    },
    {
      part_name: "symmetry_axis",
      description: "perfect bilateral symmetry around a centered vertical axis",
      visibility: "required_visible",
    },
  ];
  spec.forbidden_parts = dedupeStrings([
    ...(spec.forbidden_parts || []),
    "visible eyes",
    "human facial anatomy",
    "horns",
    "animal ears",
    "halo rings",
    "wearable straps",
    "fabric trim",
    "helmet shell cues",
  ]);
  spec.material_truth = {
    primary_material: "boron carbide (B4C) technical ceramic",
    surface_finish: "matte black",
    texture_descriptor: "micro-pitted technical ceramic, sub-micron grain structure, anisotropic micro-shadowing",
    secondary_material: "none visible",
    forbidden_materials: dedupeStrings([
      ...((spec.material_truth && spec.material_truth.forbidden_materials) || []),
      "plastic",
      "PVC",
      "resin",
      "vinyl",
      "fabric",
      "leather",
      "rubber",
    ]),
  };
  spec.common_misreads = dedupeStrings([
    ...(spec.common_misreads || []).map((item) => item && item.misread).filter(Boolean),
    "human face",
    "character portrait",
    "cosplay helmet",
    "toy mask",
    "resin prop",
    "halo-framed icon",
  ]).map((misread) => ({
    misread,
    cause: "mask canon drift",
  }));
  spec.anti_misread_rules = [
    ...((spec.anti_misread_rules || []).filter(Boolean)),
    {
      rule: "Must read as one manufactured technical ceramic mask artifact, not a human or character face",
      enforcement: "both",
    },
    {
      rule: "No visible eyes, no horn shapes, no ear extensions, no halo or framing ring",
      enforcement: "both",
    },
    {
      rule: "No cosplay, wearable helmet, fabric trim, leather, plastic, resin, or toy surface reads",
      enforcement: "both",
    },
    {
      rule: "Background must remain black void with centered frontal artifact composition",
      enforcement: "both",
    },
  ];
  spec.part_priority_order = [
    "sealed_eye_region",
    "symmetry_axis",
    "engineered_cheek_planes",
    "jaw_plate",
  ];
}

/**
 * Try to find an existing approved spec that matches the design intent.
 */
function findApprovedSpec(designIntent) {
  const safeLibrary = loadSafeApprovedLibrary();
  const library = safeLibrary.library;
  if (!library || !library.objects) {
    return {
      spec: null,
      approved_memory_reused: false,
      approved_memory_identity: null,
      memory_sanitation_applied: true,
    };
  }

  const cls = designIntent.object_class;
  const text = (designIntent.raw_text || "").toLowerCase();

  for (const obj of library.objects) {
    if (obj.object_class !== cls) continue;
    // Match by identity keywords in readable_as or identity_core.name
    const name = (obj.identity_core.name || "").toLowerCase();
    const readable = (obj.readable_as || "").toLowerCase();
    if (text.includes(name.split(" ")[0]) || name.split(" ").some(w => w.length > 3 && text.includes(w))) {
      return {
        spec: obj,
        approved_memory_reused: true,
        approved_memory_identity: obj.object_id || null,
        memory_sanitation_applied: safeLibrary.memory_sanitation_applied === true,
      };
    }
    if (readable.split(" ").filter(w => w.length > 4).some(w => text.includes(w))) {
      return {
        spec: obj,
        approved_memory_reused: true,
        approved_memory_identity: obj.object_id || null,
        memory_sanitation_applied: safeLibrary.memory_sanitation_applied === true,
      };
    }
  }
  return {
    spec: null,
    approved_memory_reused: false,
    approved_memory_identity: null,
    memory_sanitation_applied: safeLibrary.memory_sanitation_applied === true,
  };
}

/**
 * Find a design reference that matches the intent.
 */
function findDesignReference(designIntent) {
  persistSanitizedDesignReferences();
  const registry = loadCleanedDesignReferences();
  if (!registry || !registry.references) return null;

  const cls = designIntent.object_class;
  const text = (designIntent.raw_text || "").toLowerCase();

  for (const ref of registry.references) {
    if (ref.object_class !== cls) continue;
    const refName = (ref.canonical_name || "").toLowerCase();
    if (refName.split(" ").some(w => w.length > 3 && text.includes(w))) {
      return ref;
    }
  }
  return null;
}

/**
 * Build a skeleton spec from design intent + reference (if any).
 * This is a deterministic builder — no LLM call.
 */
function buildSkeletonSpec(designIntent, reference) {
  const objectId = `${designIntent.object_class.toUpperCase()}_${Date.now()}`;
  const material = designIntent.material_hint || "unknown";
  const subject = designIntent.subject_hint || designIntent.raw_text.slice(0, 60);

  const spec = {
    spec_version: "1.0.0",
    object_id: objectId,
    object_class: designIntent.object_class,
    identity_core: {
      name: subject,
      origin: reference ? reference.cultural_origin : "unspecified",
      function: "designed object for visual production",
      one_sentence: `A viewer sees this and immediately knows it is ${subject}.`,
    },
    readable_as: subject,
    topology: {
      primary_form: "unspecified",
      symmetry: "bilateral",
      orientation: "frontal",
      dominant_axis: "vertical",
    },
    silhouette_rules: {
      must_read_as: `the outline of ${subject}`,
      key_contour_features: reference
        ? reference.silhouette_landmarks || []
        : [],
      forbidden_silhouettes: [
        "amorphous blob",
        "flat plane without depth",
        "unrecognizable abstract shape",
      ],
    },
    must_have_parts: reference
      ? reference.key_features.slice(0, 6).map((f) => ({
          part_name: f.replace(/\s+/g, "_").toLowerCase().slice(0, 40),
          description: f,
          visibility: "required_visible",
        }))
      : [
          {
            part_name: "primary_form",
            description: `The main body of the ${designIntent.object_class}`,
            visibility: "required_visible",
          },
        ],
    forbidden_parts: [
      "human body parts (unless the object is a creature)",
      "text or watermarks",
      "unrelated background objects",
    ],
    material_truth: {
      primary_material: material,
      surface_finish: material === "ceramic" ? "matte" : "unspecified",
      texture_descriptor: material === "ceramic"
        ? "dry dense engineered surface, eggshell microtexture"
        : `${material} surface`,
      forbidden_materials: ["plastic", "PVC"],
    },
    common_misreads: reference
      ? reference.common_ai_failures.map((f) => ({
          misread: f,
          cause: "common AI generation failure",
        }))
      : [
          {
            misread: "abstract texture field instead of object",
            cause: "prompt lacks object-centric anchoring",
          },
        ],
    anti_misread_rules: [
      {
        rule: "Must be a single readable designed object, not an abstract scene",
        enforcement: "both",
      },
      {
        rule: "Subject must occupy clear central frame",
        enforcement: "positive_prompt",
      },
      {
        rule: "No abstract texture fills replacing the object",
        enforcement: "negative_prompt",
      },
    ],
    part_priority_order: reference
      ? reference.key_features.slice(0, 6).map((f) =>
          f.replace(/\s+/g, "_").toLowerCase().slice(0, 40)
        )
      : ["primary_form"],
    approved: false,
    approved_at: null,
  };

  if (isMaskIntent(designIntent)) {
    applyMaskMacroDefaults(spec, designIntent, reference);
  }

  return spec;
}

function applyCanonEvolutionToSpec(spec, evolution) {
  const dominantTraits = Array.isArray(evolution && evolution.dominant_traits) ? evolution.dominant_traits : [];
  const supportiveTraits = Array.isArray(evolution && evolution.supportive_traits) ? evolution.supportive_traits : [];
  const provisionalSupportive = Array.isArray(evolution && evolution.provisional_supportive) ? evolution.provisional_supportive : [];
  const readabilityCues = Array.isArray(evolution && evolution.readability_cues) ? evolution.readability_cues : [];
  const negativeEnforcements = Array.isArray(evolution && evolution.negative_enforcements) ? evolution.negative_enforcements : [];
  const blockedTraits = Array.isArray(evolution && evolution.blocked_traits) ? evolution.blocked_traits : [];

  if (!evolution || evolution.reused !== true) {
    spec.canon_evolution = {
      reused: false,
      source_keys: [],
      dominant_traits: [],
      supportive_traits: [],
      provisional_supportive: [],
      blocked_traits: [],
      readability_cues: [],
      negative_enforcements: [],
    };
    return spec;
  }

  const positiveTraitValues = dedupeStrings([
    ...dominantTraits.map((entry) => entry && entry.trait),
    ...supportiveTraits.map((entry) => entry && entry.trait),
    ...provisionalSupportive.map((entry) => entry && entry.trait),
    ...readabilityCues.map((entry) => entry && entry.trait),
  ]);
  const negativeTraitValues = dedupeStrings([
    ...negativeEnforcements.map((entry) => entry && entry.trait),
    ...blockedTraits.map((entry) => entry && entry.trait),
  ]);

  spec.material_truth = spec.material_truth || {};
  spec.material_truth.texture_descriptor = dedupeStrings([
    spec.material_truth.texture_descriptor,
    ...positiveTraitValues,
  ]).join(", ");
  spec.silhouette_rules = spec.silhouette_rules || {};
  spec.silhouette_rules.key_contour_features = dedupeStrings([
    ...(spec.silhouette_rules.key_contour_features || []),
    ...positiveTraitValues,
  ]);
  spec.anti_misread_rules = [
    ...((spec.anti_misread_rules || []).filter(Boolean)),
    ...positiveTraitValues.map((trait) => ({
      rule: `Preserve evolved canon trait: ${trait}`,
      enforcement: "positive_prompt",
    })),
    ...negativeTraitValues.map((trait) => ({
      rule: `No ${trait}`,
      enforcement: "negative_prompt",
    })),
  ];
  spec.canon_evolution = {
    reused: true,
    source_keys: evolution.source_keys || [],
    dominant_traits: dominantTraits,
    supportive_traits: supportiveTraits,
    provisional_supportive: provisionalSupportive,
    blocked_traits: blockedTraits,
    readability_cues: readabilityCues,
    negative_enforcements: negativeEnforcements,
  };
  return spec;
}

/**
 * Validate a spec against required fields from the schema.
 */
function validateSpec(spec) {
  const schema = loadJSON(SCHEMA_PATH);
  if (!schema) return { ok: true, errors: [] }; // skip if schema missing

  const required = schema.required || [];
  const errors = [];
  for (const field of required) {
    if (spec[field] === undefined || spec[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  return { ok: errors.length === 0, errors };
}

/**
 * Generate an ObjectSpec from normalized design intent.
 *
 * @param {object} designIntent - Output from object_intent_normalizer
 * @returns {{ ok: boolean, spec: object|null, source: string, errors: string[] }}
 */
function generateObjectSpec(designIntent) {
  if (!designIntent || !designIntent.object_class) {
    return { ok: false, spec: null, source: "none", errors: ["No design intent provided"] };
  }

  const evolution = resolveCanonV2({
    lane: designIntent.object_class,
    object_class: designIntent.object_class,
  });

  // 1. Try approved library first (exact match = reuse locked spec)
  const approved = findApprovedSpec(designIntent);
  if (approved.spec) {
    const approvedSpec = JSON.parse(JSON.stringify(approved.spec));
    applyCanonEvolutionToSpec(approvedSpec, evolution);
    console.log(`[OBJECT_SPEC] Found approved spec: ${approvedSpec.object_id}`);
    return {
      ok: true,
      spec: approvedSpec,
      source: "approved_library",
      errors: [],
      approved_memory_reused: approved.approved_memory_reused,
      approved_memory_identity: approved.approved_memory_identity,
      memory_sanitation_applied: approved.memory_sanitation_applied,
      canon_evolution_reused: evolution.reused === true,
      canon_evolution_source_keys: evolution.source_keys || [],
    };
  }

  // 2. Find design reference for skeleton building
  const reference = findDesignReference(designIntent);
  if (reference) {
    console.log(`[OBJECT_SPEC] Using reference: ${reference.ref_id}`);
  }

  // 3. Build skeleton spec
  const spec = buildSkeletonSpec(designIntent, reference);
  applyCanonEvolutionToSpec(spec, evolution);

  // 4. Validate
  const validation = validateSpec(spec);
  if (!validation.ok) {
    return {
      ok: false,
      spec,
      source: "generated_skeleton",
      errors: validation.errors,
      approved_memory_reused: false,
      approved_memory_identity: null,
      memory_sanitation_applied: approved.memory_sanitation_applied === true,
      canon_evolution_reused: evolution.reused === true,
      canon_evolution_source_keys: evolution.source_keys || [],
    };
  }

  console.log(`[OBJECT_SPEC] Generated spec: ${spec.object_id} (class=${spec.object_class})`);
  return {
    ok: true,
    spec,
    source: reference ? "reference_skeleton" : "bare_skeleton",
    errors: [],
    approved_memory_reused: false,
    approved_memory_identity: null,
    memory_sanitation_applied: approved.memory_sanitation_applied === true,
    canon_evolution_reused: evolution.reused === true,
    canon_evolution_source_keys: evolution.source_keys || [],
  };
}

module.exports = {
  generateObjectSpec,
  findApprovedSpec,
  findDesignReference,
  validateSpec,
};
