"use strict";

/**
 * MIKAGE — /core/invariants.js
 * Hard runtime invariants. If any of these fail, the pipeline MUST NOT proceed.
 * These are non-negotiable structural checks, not business-logic validation.
 *
 * Import and call these at gate boundaries in the orchestrator.
 */

const fs = require("fs");
const { validate, DECISION } = require("./schema_registry");

class InvariantViolation extends Error {
  constructor(invariant, detail) {
    super(`[INVARIANT] ${invariant}: ${detail}`);
    this.name = "InvariantViolation";
    this.invariant = invariant;
  }
}

// ---------------------------------------------------------------------------
// INV-1: No output file = no pass
// ---------------------------------------------------------------------------
function assertOutputExists(outputFilePath, jobId) {
  if (!outputFilePath || !fs.existsSync(outputFilePath)) {
    throw new InvariantViolation(
      "INV-1_NO_OUTPUT_NO_PASS",
      `job=${jobId}: no output file at "${outputFilePath || "(null)"}"`
    );
  }
}

// ---------------------------------------------------------------------------
// INV-2: Validator must have executed before any ALLOW decision
// ---------------------------------------------------------------------------
function assertValidatorExecuted(postValidation, jobId) {
  if (!postValidation || postValidation.validator_executed !== true) {
    throw new InvariantViolation(
      "INV-2_VALIDATOR_NOT_EXECUTED",
      `job=${jobId}: validator_executed is not true`
    );
  }
}

// ---------------------------------------------------------------------------
// INV-3: Only buildDecision() may emit ALLOW / REJECT / RETRY
//        Enforced by checking that finalDecision has valid schema
// ---------------------------------------------------------------------------
function assertFinalDecisionShape(finalDecision, jobId) {
  const result = validate("final_decision", finalDecision, { strict: false });
  if (!result.valid) {
    throw new InvariantViolation(
      "INV-3_FINAL_DECISION_SHAPE",
      `job=${jobId}: ${result.errors.join("; ")}`
    );
  }
  if (!Object.values(DECISION).includes(finalDecision.decision)) {
    throw new InvariantViolation(
      "INV-3_INVALID_DECISION_VALUE",
      `job=${jobId}: decision="${finalDecision.decision}" is not a valid DECISION enum`
    );
  }
}

// ---------------------------------------------------------------------------
// INV-4: Every artifact must link back to job_id
// ---------------------------------------------------------------------------
function assertArtifactLinked(artifact, jobId) {
  if (!artifact.job_id) {
    throw new InvariantViolation(
      "INV-4_ARTIFACT_UNLINKED",
      `artifact at "${artifact.file_path || "(unknown)"}" has no job_id`
    );
  }
  if (artifact.job_id !== jobId) {
    throw new InvariantViolation(
      "INV-4_ARTIFACT_MISMATCH",
      `artifact.job_id="${artifact.job_id}" does not match expected job_id="${jobId}"`
    );
  }
}

// ---------------------------------------------------------------------------
// INV-5: Status transitions must be validated
//        (Uses state_machine.js validateTransition)
// ---------------------------------------------------------------------------
function assertValidTransition(fromState, toState, jobId) {
  const { validateTransition } = require("./state_machine");
  if (!validateTransition(fromState, toState)) {
    throw new InvariantViolation(
      "INV-5_INVALID_TRANSITION",
      `job=${jobId}: ${fromState} → ${toState} is not allowed`
    );
  }
}

// ---------------------------------------------------------------------------
// INV-6: Canon registry may only contain ALLOW decisions
// ---------------------------------------------------------------------------
function assertCanonRecordIsAllow(record) {
  if (record.decision !== "ALLOW") {
    throw new InvariantViolation(
      "INV-6_CANON_NOT_ALLOW",
      `Attempted to write non-ALLOW decision "${record.decision}" to canon registry (job=${record.job_id})`
    );
  }
}

// ---------------------------------------------------------------------------
// INV-7: No duplicate active runs for same job
// ---------------------------------------------------------------------------
function assertNoActiveRunConflict(jobId, sharedState) {
  if (sharedState.activeJobId && sharedState.activeJobId === jobId) {
    throw new InvariantViolation(
      "INV-7_DUPLICATE_ACTIVE_RUN",
      `job=${jobId} is already active in shared_state`
    );
  }
}

// ---------------------------------------------------------------------------
// INV-8: ALLOW requires both validator AND Gemini when Gemini is enforced
// ---------------------------------------------------------------------------
function assertAllowRequirements(finalDecision, enforceGemini) {
  if (finalDecision.decision !== "ALLOW") return; // only check ALLOW

  if (!finalDecision.validator_executed) {
    throw new InvariantViolation(
      "INV-8_ALLOW_WITHOUT_VALIDATOR",
      `job=${finalDecision.job_id}: ALLOW issued without validator execution`
    );
  }

  if (enforceGemini && !finalDecision.gemini_validation_executed) {
    throw new InvariantViolation(
      "INV-8_ALLOW_WITHOUT_GEMINI",
      `job=${finalDecision.job_id}: ALLOW issued without Gemini execution (enforceGemini=true)`
    );
  }
}

// ---------------------------------------------------------------------------
// COMPOSITE: Run all pre-write invariants on a final decision
// ---------------------------------------------------------------------------
function assertPreWriteInvariants(finalDecision, { postValidation, outputFilePath, enforceGemini, sharedState }) {
  // INV-3: Shape check
  assertFinalDecisionShape(finalDecision, finalDecision.job_id);

  // INV-8: ALLOW requirements
  assertAllowRequirements(finalDecision, enforceGemini);

  // For ALLOW decisions, additional strict checks
  if (finalDecision.decision === "ALLOW") {
    // INV-1: Output must exist
    assertOutputExists(outputFilePath || finalDecision.output_file_path, finalDecision.job_id);
    // INV-2: Validator must have run
    assertValidatorExecuted(postValidation, finalDecision.job_id);
  }
}

module.exports = {
  InvariantViolation,
  assertOutputExists,
  assertValidatorExecuted,
  assertFinalDecisionShape,
  assertArtifactLinked,
  assertValidTransition,
  assertCanonRecordIsAllow,
  assertNoActiveRunConflict,
  assertAllowRequirements,
  assertPreWriteInvariants,
};
