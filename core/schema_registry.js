"use strict";

/**
 * MIKAGE — /core/schema_registry.js
 * Canonical schema registry for all core entities.
 * Single source of truth for data structure validation.
 *
 * RULES:
 * - Every producer MUST call validate() before writing.
 * - Every consumer SHOULD call validate() after reading untrusted input.
 * - Missing required fields → hard fail (throws).
 * - Unknown fields are tolerated (forward-compat) but logged.
 */

// ---------------------------------------------------------------------------
// ENUM DEFINITIONS
// ---------------------------------------------------------------------------

const DECISION = Object.freeze({
  ALLOW: "ALLOW",
  REJECT: "REJECT",
  RETRY: "RETRY",
});

const JOB_STATUS = Object.freeze({
  DONE: "DONE",
  FAIL: "FAIL",
  RETRY: "RETRY",
});

const VERDICT = Object.freeze({
  PASS: "PASS",
  FAIL: "FAIL",
  REJECT: "REJECT",
  UNKNOWN: "UNKNOWN",
});

const BLOCK_LEVEL = Object.freeze({
  NONE: "NONE",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
  ABSOLUTE: "ABSOLUTE",
});

const SERVICE_STATUS = Object.freeze({
  ALIVE: "ALIVE",
  UNHEALTHY: "UNHEALTHY",
  DEAD: "DEAD",
});

const RUN_STATE = Object.freeze({
  RUNNING: "RUNNING",
  DONE: "DONE",
  FAILED_VALIDATION: "FAILED_VALIDATION",
  PASSED: "PASSED",
});

const GENERATION_MODE = Object.freeze({
  EXPLORATION: "exploration",
  REPRODUCTION: "reproduction",
});

const SHOT_TYPES = Object.freeze([
  "MATERIAL_MACRO",
  "MASK_MACRO",
  "ENTITY_MEDIUM",
  "WEAPON_MACRO",
  "material_study",
]);

// ---------------------------------------------------------------------------
// SCHEMA DEFINITIONS
// ---------------------------------------------------------------------------

/**
 * Schema format:
 *   field_name: { required: bool, type: string|function, enum?: array, default?: any }
 *
 * type can be: "string", "number", "boolean", "object", "array", or a validator function.
 */

const SCHEMAS = {
  // -------------------------------------------------------------------------
  // TASK — Telegram-originated task object (shared_state.tasks[])
  // Owner: telegram_bot/shared_state.js (create), telegram_bot/router.js (update)
  // Storage: data/shared_state.json .tasks[]
  // -------------------------------------------------------------------------
  task: {
    task_id:              { required: true,  type: "string" },
    title:                { required: true,  type: "string" },
    raw_command:          { required: false, type: "string", default: "" },
    normalized_objective: { required: false, type: "string", default: "" },
    executor_type:        { required: false, type: "string", default: "manual" },
    priority:             { required: false, type: "string", default: "medium" },
    status:               { required: true,  type: "string" },
    created_at:           { required: true,  type: "string" },
    updated_at:           { required: true,  type: "string" },
    result_summary:       { required: false, type: "string", default: "" },
    blocker:              { required: false, type: "string", default: "" },
    artifact_paths:       { required: false, type: "array",  default: [] },
    related_run_id:       { required: false, type: "string", default: null },
  },

  // -------------------------------------------------------------------------
  // RUN — A single orchestrator execution pass.
  // Owner: orchestrator.js (create + update)
  // Storage: runs/{job_id}/ directory
  // -------------------------------------------------------------------------
  run: {
    job_id:    { required: true,  type: "string" },
    run_dir:   { required: true,  type: "string" },
    status:    { required: true,  type: "string", enum: Object.values(JOB_STATUS) },
    decision:  { required: true,  type: "string", enum: Object.values(DECISION) },
    shot_type: { required: true,  type: "string" },
    created_at:{ required: true,  type: "string" },
  },

  // -------------------------------------------------------------------------
  // ARTIFACT — Output file reference, always linked to a run.
  // Owner: orchestrator.js (create)
  // Storage: runs/{job_id}/ files
  // -------------------------------------------------------------------------
  artifact: {
    job_id:     { required: true,  type: "string" },
    file_path:  { required: true,  type: "string" },
    file_type:  { required: true,  type: "string" },  // "png", "json", "txt"
    created_at: { required: true,  type: "string" },
  },

  // -------------------------------------------------------------------------
  // SERVICE_STATE — External service health record.
  // Owner: lib/service_runner.js (sole writer)
  // Storage: data/shared_state.json .services{}
  // -------------------------------------------------------------------------
  service_state: {
    status:          { required: true,  type: "string", enum: Object.values(SERVICE_STATUS) },
    last_checked_at: { required: true,  type: "string" },
    health_target:   { required: false, type: "string", default: "" },
    detail:          { required: false, type: "string", default: "" },
    pid:             { required: false, type: "number", default: null },
  },

  // -------------------------------------------------------------------------
  // RENDER_RESULT — Output of render/render_executor.js.
  // Owner: render/render_executor.js (create)
  // Consumer: orchestrator.js
  // -------------------------------------------------------------------------
  render_result: {
    success:         { required: true,  type: "boolean" },
    output_file:     { required: false, type: "string", default: null },
    error:           { required: false, type: "string", default: null },
    transport:       { required: false, type: "string", default: null },
    render_time_ms:  { required: false, type: "number", default: null },
  },

  // -------------------------------------------------------------------------
  // VALIDATOR_RESULT — Output of post-render validation (rule engine + analyzers).
  // Owner: orchestrator.js via validators/mikage_rule_engine.js
  // Consumer: orchestrator.js buildDecision()
  // Storage: runs/{job_id}/post_validation.json
  // -------------------------------------------------------------------------
  validator_result: {
    stage:              { required: true,  type: "string" },
    verdict:            { required: true,  type: "string", enum: Object.values(VERDICT) },
    validator_executed: { required: true,  type: "boolean" },
    failed_checks:      { required: false, type: "array",  default: [] },
    critical_failures:  { required: false, type: "array",  default: [] },
    hard_reject_hits:   { required: false, type: "array",  default: [] },
    forbidden_hits:     { required: false, type: "array",  default: [] },
    blocking_unknown_rules: { required: false, type: "array", default: [] },
    analyzer_signals:   { required: false, type: "object", default: {} },
    analyzer_summary:   { required: false, type: "object", default: {} },
    rule_engine:        { required: false, type: "object", default: null },
    scores:             { required: false, type: "object", default: null },
    drift:              { required: false, type: "object", default: null },
  },

  // -------------------------------------------------------------------------
  // GEMINI_RESULT — Output of Gemini vision validation.
  // Owner: gemini_connector.js / gemini_validator.js
  // Consumer: orchestrator.js buildDecision()
  // Storage: runs/{job_id}/gemini_validation.json
  // -------------------------------------------------------------------------
  gemini_result: {
    pass_fail:                   { required: true,  type: "string", enum: ["PASS", "FAIL"] },
    gemini_validation_executed:  { required: true,  type: "boolean" },
    parse_ok:                    { required: true,  type: "boolean" },
    model:                       { required: false, type: "string", default: null },
    error:                       { required: false, type: "string", default: null },
    fail_rules:                  { required: false, type: "array",  default: [] },
    wrong_reads:                 { required: false, type: "array",  default: [] },
    correct_reads:               { required: false, type: "array",  default: [] },
    material_read:               { required: false, type: "string", default: null },
    severity:                    { required: false, type: "string", default: null },
    fix_direction:               { required: false, type: "array",  default: [] },
    summary:                     { required: false, type: "string", default: null },
  },

  // -------------------------------------------------------------------------
  // FINAL_DECISION — The one and only gate output. Nothing else may emit ALLOW/REJECT.
  // Owner: orchestrator.js buildDecision() (SOLE OWNER)
  // Storage: runs/{job_id}/final_decision.json
  // -------------------------------------------------------------------------
  final_decision: {
    job_id:                     { required: true,  type: "string" },
    status:                     { required: true,  type: "string", enum: Object.values(JOB_STATUS) },
    decision:                   { required: true,  type: "string", enum: Object.values(DECISION) },
    decision_reason:            { required: true,  type: "string" },
    output_files:               { required: true,  type: "array" },
    output_file_path:           { required: false, type: "string", default: null },
    validator_executed:         { required: true,  type: "boolean" },
    gemini_validation_executed: { required: true,  type: "boolean" },
    shot_type:                  { required: false, type: "string", default: null },
    generation_mode:            { required: false, type: "string", default: null },
    failed_rules:               { required: false, type: "array",  default: [] },
    scores:                     { required: false, type: "object", default: null },
    timestamps:                 { required: false, type: "object", default: null },
  },

  // -------------------------------------------------------------------------
  // SHARED_STATE — Top-level shape of data/shared_state.json.
  // Owner: telegram_bot/shared_state.js (primary), orchestrator.js (terminal update only)
  // -------------------------------------------------------------------------
  shared_state: {
    tasks:        { required: true, type: "array",  default: [] },
    services:     { required: true, type: "object", default: {} },
    runs:         { required: true, type: "array",  default: [] },
    artifacts:    { required: true, type: "array",  default: [] },
    costs:        { required: true, type: "array",  default: [] },
    alerts:       { required: true, type: "array",  default: [] },
    activeJobId:  { required: false, type: "string", default: null },
    currentStep:  { required: false, type: "string", default: null },
    runState:     { required: false, type: "string", default: null },
    lastJobId:    { required: false, type: "string", default: null },
    lastDecision: { required: false, type: "string", default: null },
    lastStatus:   { required: false, type: "string", default: null },
    completedAt:  { required: false, type: "string", default: null },
  },

  // -------------------------------------------------------------------------
  // CANON_RECORD — Entry in runs/canon_memory_registry.json.
  // Owner: orchestrator.js writeOfficialCanonRecord() (SOLE OWNER)
  // Invariant: Only ALLOW decisions get written.
  // -------------------------------------------------------------------------
  canon_record: {
    job_id:           { required: true,  type: "string" },
    timestamp:        { required: true,  type: "string" },
    output_file_path: { required: true,  type: "string" },
    entity_id:        { required: false, type: "string", default: null },
    decision:         { required: true,  type: "string", enum: ["ALLOW"] },
    failed_rules:     { required: false, type: "array",  default: [] },
    canon_version:    { required: false, type: "string", default: "v2" },
  },
};

// ---------------------------------------------------------------------------
// VALIDATION ENGINE
// ---------------------------------------------------------------------------

class SchemaValidationError extends Error {
  constructor(entityType, field, message) {
    super(`[SCHEMA] ${entityType}.${field}: ${message}`);
    this.name = "SchemaValidationError";
    this.entityType = entityType;
    this.field = field;
  }
}

/**
 * Validate an object against a named schema.
 *
 * @param {string} entityType  Key in SCHEMAS (e.g. "final_decision")
 * @param {Object} obj         The object to validate
 * @param {Object} [opts]      Options
 * @param {boolean} [opts.strict=true]  If true, throws on failure. If false, returns { valid, errors }.
 * @returns {{ valid: boolean, errors: string[] }}
 * @throws {SchemaValidationError} When strict=true and validation fails
 */
function validate(entityType, obj, opts = {}) {
  const strict = opts.strict !== false;
  const schema = SCHEMAS[entityType];
  if (!schema) {
    const msg = `Unknown entity type: "${entityType}"`;
    if (strict) throw new SchemaValidationError(entityType, "_schema", msg);
    return { valid: false, errors: [msg] };
  }

  if (!obj || typeof obj !== "object") {
    const msg = "Object is null or not an object";
    if (strict) throw new SchemaValidationError(entityType, "_root", msg);
    return { valid: false, errors: [msg] };
  }

  const errors = [];

  for (const [field, spec] of Object.entries(schema)) {
    const value = obj[field];
    const missing = value === undefined || value === null;

    // Required field check
    if (spec.required && missing) {
      errors.push(`${entityType}.${field}: required field missing`);
      continue;
    }

    // Skip optional missing fields
    if (missing) continue;

    // Type check
    if (spec.type && typeof spec.type === "string") {
      const actualType = Array.isArray(value) ? "array" : typeof value;
      if (actualType !== spec.type) {
        errors.push(`${entityType}.${field}: expected ${spec.type}, got ${actualType}`);
      }
    }

    // Enum check
    if (spec.enum && !spec.enum.includes(value)) {
      errors.push(`${entityType}.${field}: value "${value}" not in enum [${spec.enum.join(", ")}]`);
    }
  }

  if (errors.length > 0 && strict) {
    throw new SchemaValidationError(entityType, errors[0].split(":")[0], errors.join("; "));
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Apply defaults for optional fields that are missing.
 * Returns a new object (does not mutate input).
 */
function applyDefaults(entityType, obj) {
  const schema = SCHEMAS[entityType];
  if (!schema) return obj;

  const result = { ...obj };
  for (const [field, spec] of Object.entries(schema)) {
    if (result[field] === undefined && spec.default !== undefined) {
      result[field] = spec.default;
    }
  }
  return result;
}

/**
 * Get the schema definition for an entity type.
 */
function getSchema(entityType) {
  return SCHEMAS[entityType] || null;
}

/**
 * List all registered entity types.
 */
function getEntityTypes() {
  return Object.keys(SCHEMAS);
}

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

module.exports = {
  // Enums
  DECISION,
  JOB_STATUS,
  VERDICT,
  BLOCK_LEVEL,
  SERVICE_STATUS,
  RUN_STATE,
  GENERATION_MODE,
  SHOT_TYPES,

  // Schema operations
  validate,
  applyDefaults,
  getSchema,
  getEntityTypes,

  // Errors
  SchemaValidationError,

  // Raw schemas (for introspection/testing)
  SCHEMAS,
};
