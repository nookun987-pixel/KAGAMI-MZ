/**
 * MIKAGE — /core/state_machine.test.js
 * Full test suite for state_machine.js
 * Run: node core/state_machine.test.js
 */

"use strict";

const {
  STATES,
  validateTransition,
  getNextStates,
  isTerminal,
  applyTransition,
  applyTransitionSequence,
  failJob,
  finalizeFailedJob,
  createJob,
  getTransitionMap,
  validateTrace,
  StateTransitionError,
  InvalidStateError,
  MissingJobFieldError,
} = require("./state_machine");

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, label) {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(label);
    console.error(`  FAIL: ${label}`);
  }
}

function assertThrows(fn, errorType, label) {
  try {
    fn();
    failed++;
    failures.push(`${label} (no throw)`);
    console.error(`  FAIL: ${label} — expected ${errorType.name}, got no error`);
  } catch (e) {
    if (e instanceof errorType) {
      passed++;
    } else {
      failed++;
      failures.push(`${label} (wrong error: ${e.name})`);
      console.error(`  FAIL: ${label} — expected ${errorType.name}, got ${e.name}: ${e.message}`);
    }
  }
}

// ===========================================================================
console.log("\n=== HAPPY PATH TRANSITIONS ===");
// ===========================================================================

const HAPPY_PATH = [
  "INGESTED", "STRUCTURED", "PRECHECKED", "NORMALIZED", "TRANSLATED",
  "RENDERING", "CRITIQUED", "DRIFT_CHECKED", "POSTCHECKED", "DECIDED",
  "LOGGED", "DONE",
];

for (let i = 0; i < HAPPY_PATH.length - 1; i++) {
  const from = HAPPY_PATH[i];
  const to = HAPPY_PATH[i + 1];
  assert(
    validateTransition(from, to) === true,
    `Happy path: ${from} → ${to}`
  );
}

// ===========================================================================
console.log("\n=== FULL HAPPY PATH JOB WALKTHROUGH ===");
// ===========================================================================

{
  let job = createJob("mikage_test_001", { mode: "AUTO_DRAFT" });
  assert(job.status === STATES.INGESTED, "createJob starts at INGESTED");
  assert(job.audit.trace.length === 1, "createJob has 1 trace entry");
  assert(job.audit.trace[0].step === STATES.INGESTED, "First trace is INGESTED");

  job = applyTransition(job, STATES.STRUCTURED);
  assert(job.status === STATES.STRUCTURED, "Transition to STRUCTURED");

  job = applyTransition(job, STATES.PRECHECKED, { identity_check: 0.88 });
  assert(job.status === STATES.PRECHECKED, "Transition to PRECHECKED");
  assert(job.audit.trace[2].detail.identity_check === 0.88, "Detail preserved in trace");

  job = applyTransition(job, STATES.NORMALIZED);
  job = applyTransition(job, STATES.TRANSLATED);
  job = applyTransition(job, STATES.RENDERING);
  job = applyTransition(job, STATES.CRITIQUED);
  job = applyTransition(job, STATES.DRIFT_CHECKED);
  job = applyTransition(job, STATES.POSTCHECKED);
  job = applyTransition(job, STATES.DECIDED);
  job = applyTransition(job, STATES.LOGGED);
  job = applyTransition(job, STATES.DONE);
  assert(job.status === STATES.DONE, "Full happy path reaches DONE");
  assert(job.audit.trace.length === 12, "12 trace entries for 12 states");
}

// ===========================================================================
console.log("\n=== FAIL PATH FROM EVERY NON-TERMINAL STATE ===");
// ===========================================================================

const FAILABLE_STATES = [
  "INGESTED", "STRUCTURED", "PRECHECKED", "NORMALIZED", "TRANSLATED",
  "RENDERING", "CRITIQUED", "DRIFT_CHECKED", "POSTCHECKED", "DECIDED",
  "LOGGED", "REVIEW", "REJECTED",
];

for (const state of FAILABLE_STATES) {
  assert(
    validateTransition(state, STATES.FAILED) === true,
    `Fail path: ${state} → FAILED`
  );
}

// DONE and FAILED cannot transition to FAILED
assert(
  validateTransition(STATES.DONE, STATES.FAILED) === false,
  "DONE cannot fail (terminal)"
);
assert(
  validateTransition(STATES.FAILED, STATES.FAILED) === false,
  "FAILED cannot fail again"
);

// ===========================================================================
console.log("\n=== FAIL → LOGGED → DONE ===");
// ===========================================================================

{
  let job = createJob("mikage_fail_001");
  job = applyTransition(job, STATES.STRUCTURED);
  job = applyTransition(job, STATES.PRECHECKED);
  job = failJob(job, "aged silk not in Canon");
  assert(job.status === STATES.FAILED, "failJob transitions to FAILED");
  assert(job.audit.trace[3].detail.reason === "aged silk not in Canon", "Fail reason in trace");

  job = finalizeFailedJob(job);
  assert(job.status === STATES.DONE, "finalizeFailedJob reaches DONE");
  assert(job.audit.trace.length === 6, "INGESTED+STRUCTURED+PRECHECKED+FAILED+LOGGED+DONE = 6 entries");
}

// ===========================================================================
console.log("\n=== REVIEW PATH ===");
// ===========================================================================

{
  // PRECHECKED → REVIEW → PRECHECKED (re-run after human gate)
  assert(
    validateTransition(STATES.PRECHECKED, STATES.REVIEW) === true,
    "PRECHECKED → REVIEW"
  );
  assert(
    validateTransition(STATES.REVIEW, STATES.PRECHECKED) === true,
    "REVIEW → PRECHECKED (human gate resolved)"
  );
  assert(
    validateTransition(STATES.REVIEW, STATES.FAILED) === true,
    "REVIEW → FAILED (human gate rejected)"
  );

  let job = createJob("mikage_review_001");
  job = applyTransition(job, STATES.STRUCTURED);
  job = applyTransition(job, STATES.PRECHECKED);
  job = applyTransition(job, STATES.REVIEW, { reason: "identity_check 0.72" });
  assert(job.status === STATES.REVIEW, "Job enters REVIEW");

  // Human resolves → re-run precheck
  job = applyTransition(job, STATES.PRECHECKED, { identity_check: 0.88, rerun: true });
  assert(job.status === STATES.PRECHECKED, "Re-enters PRECHECKED after review");
}

// ===========================================================================
console.log("\n=== REJECTED PATH ===");
// ===========================================================================

{
  assert(
    validateTransition(STATES.POSTCHECKED, STATES.REJECTED) === true,
    "POSTCHECKED → REJECTED"
  );
  assert(
    validateTransition(STATES.REJECTED, STATES.LOGGED) === true,
    "REJECTED → LOGGED"
  );

  let job = createJob("mikage_reject_001");
  job = applyTransitionSequence(job, [
    STATES.STRUCTURED, STATES.PRECHECKED, STATES.NORMALIZED,
    STATES.TRANSLATED, STATES.RENDERING, STATES.CRITIQUED,
    STATES.DRIFT_CHECKED, STATES.POSTCHECKED, STATES.REJECTED,
    STATES.LOGGED, STATES.DONE,
  ]);
  assert(job.status === STATES.DONE, "Rejected job finalizes to DONE");
}

// ===========================================================================
console.log("\n=== CONDITIONAL REFINE LOOP (DECIDED → NORMALIZED) ===");
// ===========================================================================

{
  assert(
    validateTransition(STATES.DECIDED, STATES.NORMALIZED) === true,
    "DECIDED → NORMALIZED (refine loop)"
  );

  let job = createJob("mikage_loop_001");
  job = applyTransitionSequence(job, [
    STATES.STRUCTURED, STATES.PRECHECKED, STATES.NORMALIZED,
    STATES.TRANSLATED, STATES.RENDERING, STATES.CRITIQUED,
    STATES.DRIFT_CHECKED, STATES.POSTCHECKED, STATES.DECIDED,
  ]);

  // Loop back for refinement (attempt 2)
  job = applyTransition(job, STATES.NORMALIZED, { attempt: 2, reason: "texture_weak" });
  assert(job.status === STATES.NORMALIZED, "Loops back to NORMALIZED for refine");

  // Complete second pass
  job = applyTransitionSequence(job, [
    STATES.TRANSLATED, STATES.RENDERING, STATES.CRITIQUED,
    STATES.DRIFT_CHECKED, STATES.POSTCHECKED, STATES.DECIDED,
    STATES.LOGGED, STATES.DONE,
  ]);
  assert(job.status === STATES.DONE, "Second pass completes to DONE");
}

// ===========================================================================
console.log("\n=== INVALID TRANSITIONS (must reject) ===");
// ===========================================================================

const INVALID_TRANSITIONS = [
  ["INGESTED", "NORMALIZED"],       // skip STRUCTURED and PRECHECKED
  ["INGESTED", "RENDERING"],        // skip to render
  ["INGESTED", "DONE"],             // skip everything
  ["STRUCTURED", "TRANSLATED"],     // skip PRECHECKED and NORMALIZED
  ["PRECHECKED", "RENDERING"],      // skip NORMALIZED and TRANSLATED
  ["NORMALIZED", "CRITIQUED"],      // skip TRANSLATED and RENDERING
  ["RENDERING", "POSTCHECKED"],     // skip CRITIQUED and DRIFT_CHECKED
  ["CRITIQUED", "DECIDED"],         // skip DRIFT_CHECKED and POSTCHECKED
  ["DONE", "INGESTED"],             // can't restart from terminal
  ["DONE", "STRUCTURED"],           // terminal is terminal
  ["LOGGED", "INGESTED"],           // can't restart
  ["FAILED", "RENDERING"],          // can't render from FAILED
  ["FAILED", "PRECHECKED"],         // can't re-enter pipeline from FAILED
];

for (const [from, to] of INVALID_TRANSITIONS) {
  assert(
    validateTransition(from, to) === false,
    `Invalid blocked: ${from} → ${to}`
  );
}

// ===========================================================================
console.log("\n=== INVALID TRANSITIONS THROW ON applyTransition ===");
// ===========================================================================

{
  const job = createJob("mikage_throw_001");

  assertThrows(
    () => applyTransition(job, STATES.RENDERING),
    StateTransitionError,
    "INGESTED → RENDERING throws StateTransitionError"
  );

  assertThrows(
    () => applyTransition(job, STATES.DONE),
    StateTransitionError,
    "INGESTED → DONE throws StateTransitionError"
  );
}

// ===========================================================================
console.log("\n=== UNKNOWN STATE THROWS ===");
// ===========================================================================

assertThrows(
  () => validateTransition("INGESTED", "EXPLODING"),
  InvalidStateError,
  'Unknown state "EXPLODING" throws InvalidStateError'
);

assertThrows(
  () => validateTransition("BANANA", "STRUCTURED"),
  InvalidStateError,
  'Unknown state "BANANA" throws InvalidStateError'
);

// ===========================================================================
console.log("\n=== MALFORMED JOB THROWS ===");
// ===========================================================================

assertThrows(
  () => applyTransition(null, STATES.STRUCTURED),
  MissingJobFieldError,
  "null job throws MissingJobFieldError"
);

assertThrows(
  () => applyTransition({}, STATES.STRUCTURED),
  MissingJobFieldError,
  "empty object throws MissingJobFieldError"
);

assertThrows(
  () => applyTransition({ job_id: "x", status: "INGESTED" }, STATES.STRUCTURED),
  MissingJobFieldError,
  "missing audit throws MissingJobFieldError"
);

// ===========================================================================
console.log("\n=== IMMUTABILITY ===");
// ===========================================================================

{
  const original = createJob("mikage_immutable_001");
  const updated = applyTransition(original, STATES.STRUCTURED);

  assert(original.status === STATES.INGESTED, "Original unchanged after transition");
  assert(updated.status === STATES.STRUCTURED, "Updated has new state");
  assert(original.audit.trace.length === 1, "Original trace unchanged");
  assert(updated.audit.trace.length === 2, "Updated trace has new entry");
  assert(original.audit.trace !== updated.audit.trace, "Trace arrays are different references");
}

// ===========================================================================
console.log("\n=== isTerminal ===");
// ===========================================================================

assert(isTerminal(STATES.DONE) === true, "DONE is terminal");
assert(isTerminal(STATES.INGESTED) === false, "INGESTED is not terminal");
assert(isTerminal(STATES.FAILED) === false, "FAILED is not terminal (must go to LOGGED)");

// ===========================================================================
console.log("\n=== getNextStates ===");
// ===========================================================================

{
  const fromIngested = getNextStates(STATES.INGESTED);
  assert(fromIngested.includes(STATES.STRUCTURED), "INGESTED can go to STRUCTURED");
  assert(fromIngested.includes(STATES.FAILED), "INGESTED can go to FAILED");
  assert(fromIngested.length === 2, "INGESTED has exactly 2 exits");

  const fromDone = getNextStates(STATES.DONE);
  assert(fromDone.length === 0, "DONE has 0 exits");
}

// ===========================================================================
console.log("\n=== getTransitionMap (serializable) ===");
// ===========================================================================

{
  const map = getTransitionMap();
  assert(typeof map === "object", "getTransitionMap returns object");
  assert(Array.isArray(map.INGESTED), "Map values are arrays");
  assert(map.INGESTED.includes("STRUCTURED"), "Map contains INGESTED → STRUCTURED");
}

// ===========================================================================
console.log("\n=== validateTrace ===");
// ===========================================================================

{
  const validTrace = [
    { step: "INGESTED", timestamp: "t1", result: "OK" },
    { step: "STRUCTURED", timestamp: "t2", result: "OK" },
    { step: "PRECHECKED", timestamp: "t3", result: "OK" },
  ];
  assert(validateTrace(validTrace) === null, "Valid trace passes");

  const invalidTrace = [
    { step: "INGESTED", timestamp: "t1", result: "OK" },
    { step: "RENDERING", timestamp: "t2", result: "OK" },
  ];
  assert(
    typeof validateTrace(invalidTrace) === "string",
    "Invalid trace returns error string"
  );

  assert(
    typeof validateTrace([]) === "string",
    "Empty trace returns error"
  );
}

// ===========================================================================
console.log("\n=== applyTransitionSequence ===");
// ===========================================================================

{
  const job = createJob("mikage_seq_001");
  const final = applyTransitionSequence(job, [STATES.STRUCTURED, STATES.PRECHECKED]);
  assert(final.status === STATES.PRECHECKED, "Sequence applies multiple transitions");
  assert(final.audit.trace.length === 3, "Sequence appends all trace entries");

  // Sequence with invalid step throws
  assertThrows(
    () => applyTransitionSequence(job, [STATES.STRUCTURED, STATES.RENDERING]),
    StateTransitionError,
    "Invalid sequence throws at point of failure"
  );
}

// ===========================================================================
// RESULTS
// ===========================================================================

console.log("\n" + "=".repeat(60));
console.log(`RESULTS: ${passed} passed, ${failed} failed`);

if (failures.length > 0) {
  console.log("\nFAILURES:");
  for (const f of failures) {
    console.log(`  • ${f}`);
  }
}

console.log("=".repeat(60) + "\n");

process.exit(failed > 0 ? 1 : 0);
