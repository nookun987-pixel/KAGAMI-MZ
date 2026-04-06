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

const SCHEMA_PATH = path.join(__dirname, "OBJECT_SPEC_SCHEMA.json");
const LIBRARY_PATH = path.join(__dirname, "..", "memory", "approved_object_library.json");
const REGISTRY_PATH = path.join(__dirname, "..", "memory", "design_reference_registry.json");

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

/**
 * Try to find an existing approved spec that matches the design intent.
 */
function findApprovedSpec(designIntent) {
  const library = loadJSON(LIBRARY_PATH);
  if (!library || !library.objects) return null;

  const cls = designIntent.object_class;
  const text = (designIntent.raw_text || "").toLowerCase();

  for (const obj of library.objects) {
    if (obj.object_class !== cls) continue;
    // Match by identity keywords in readable_as or identity_core.name
    const name = (obj.identity_core.name || "").toLowerCase();
    const readable = (obj.readable_as || "").toLowerCase();
    if (text.includes(name.split(" ")[0]) || name.split(" ").some(w => w.length > 3 && text.includes(w))) {
      return obj;
    }
    if (readable.split(" ").filter(w => w.length > 4).some(w => text.includes(w))) {
      return obj;
    }
  }
  return null;
}

/**
 * Find a design reference that matches the intent.
 */
function findDesignReference(designIntent) {
  const registry = loadJSON(REGISTRY_PATH);
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

  // 1. Try approved library first (exact match = reuse locked spec)
  const approved = findApprovedSpec(designIntent);
  if (approved) {
    console.log(`[OBJECT_SPEC] Found approved spec: ${approved.object_id}`);
    return { ok: true, spec: approved, source: "approved_library", errors: [] };
  }

  // 2. Find design reference for skeleton building
  const reference = findDesignReference(designIntent);
  if (reference) {
    console.log(`[OBJECT_SPEC] Using reference: ${reference.ref_id}`);
  }

  // 3. Build skeleton spec
  const spec = buildSkeletonSpec(designIntent, reference);

  // 4. Validate
  const validation = validateSpec(spec);
  if (!validation.ok) {
    return { ok: false, spec, source: "generated_skeleton", errors: validation.errors };
  }

  console.log(`[OBJECT_SPEC] Generated spec: ${spec.object_id} (class=${spec.object_class})`);
  return { ok: true, spec, source: reference ? "reference_skeleton" : "bare_skeleton", errors: [] };
}

module.exports = {
  generateObjectSpec,
  findApprovedSpec,
  findDesignReference,
  validateSpec,
};
