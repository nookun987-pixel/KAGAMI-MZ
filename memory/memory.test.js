/**
 * MIKAGE — /memory/memory.test.js
 * Combined test suite for audit_serializer + notion_logger
 * Run: node memory/memory.test.js
 */

"use strict";

const audit = require("./audit_serializer");
const logger = require("./notion_logger");

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

// ===================================================================
// AUDIT SERIALIZER
// ===================================================================

console.log("\n=== AUDIT — CONSTANTS ===");

assert(audit.VALID_STEPS.length > 20, `${audit.VALID_STEPS.length} valid steps`);
assert(audit.VALID_STEPS.includes("INGESTED"), "INGESTED in steps");
assert(audit.VALID_STEPS.includes("PRECHECKED"), "PRECHECKED in steps");
assert(audit.VALID_STEPS.includes("CRITIQUED"), "CRITIQUED in steps");
assert(audit.VALID_STEPS.includes("DRIFT_CHECKED"), "DRIFT_CHECKED in steps");
assert(audit.VALID_STEPS.includes("FOOOCUS_RENDER"), "FOOOCUS_RENDER in steps");
assert(audit.VALID_RESULTS.length > 10, `${audit.VALID_RESULTS.length} valid results`);
assert(Object.isFrozen(audit.VALID_STEPS), "Steps frozen");

// ===================================================================
console.log("\n=== AUDIT — createTraceEntry ===");

{
  const entry = audit.createTraceEntry("PRE_CONTROL", "ALLOW", { identity_check: 0.88 });
  assert(entry.step === "PRE_CONTROL", "Step set");
  assert(entry.result === "ALLOW", "Result set");
  assert(entry.detail.identity_check === 0.88, "Detail preserved");
  assert(typeof entry.timestamp === "string", "Timestamp set");
  assert(new Date(entry.timestamp).getTime() > 0, "Timestamp is valid ISO8601");
}

{
  // Without detail
  const entry = audit.createTraceEntry("INGESTED", "OK");
  assert(entry.detail === undefined, "No detail when not provided");
}

{
  // Case normalization
  const entry = audit.createTraceEntry("pre_control", "OK");
  assert(entry.step === "PRE_CONTROL", "Step uppercased");
}

{
  // Null step throws
  let threw = false;
  try { audit.createTraceEntry(null, "OK"); } catch (_) { threw = true; }
  assert(threw, "Null step throws");
}

{
  // Null result throws
  let threw = false;
  try { audit.createTraceEntry("X", null); } catch (_) { threw = true; }
  assert(threw, "Null result throws");
}

// ===================================================================
console.log("\n=== AUDIT — createTraceEntryAt ===");

{
  const ts = "2026-03-22T12:00:00+07:00";
  const entry = audit.createTraceEntryAt("INGESTED", ts, "OK");
  assert(entry.timestamp === ts, "Explicit timestamp preserved");
}

// ===================================================================
console.log("\n=== AUDIT — appendTrace ===");

{
  const trace = [];
  const t1 = audit.appendTrace(trace, "INGESTED", "OK");
  assert(t1.length === 1, "Appended to empty");
  assert(trace.length === 0, "Original unchanged (immutable)");

  const t2 = audit.appendTrace(t1, "STRUCTURED", "OK");
  assert(t2.length === 2, "Appended second");
  assert(t1.length === 1, "First unchanged (immutable)");

  const t3 = audit.appendTrace(t2, "PRECHECKED", "ALLOW", { identity_check: 0.88 });
  assert(t3.length === 3, "Third with detail");
  assert(t3[2].detail.identity_check === 0.88, "Detail in appended entry");
}

{
  // Append to null trace
  const t = audit.appendTrace(null, "INGESTED", "OK");
  assert(t.length === 1, "Null trace treated as empty");
}

// ===================================================================
console.log("\n=== AUDIT — getLastEntry ===");

{
  const trace = [
    audit.createTraceEntry("INGESTED", "OK"),
    audit.createTraceEntry("STRUCTURED", "OK"),
    audit.createTraceEntry("PRECHECKED", "ALLOW"),
  ];
  const last = audit.getLastEntry(trace);
  assert(last.step === "PRECHECKED", "Last entry correct");
  assert(audit.getLastEntry([]) === null, "Empty → null");
  assert(audit.getLastEntry(null) === null, "Null → null");
}

// ===================================================================
console.log("\n=== AUDIT — getEntriesByStep / getEntriesByResult ===");

{
  const trace = [
    audit.createTraceEntry("INGESTED", "OK"),
    audit.createTraceEntry("PRE_CONTROL", "REVIEW"),
    audit.createTraceEntry("HUMAN_GATE", "PENDING"),
    audit.createTraceEntry("PRE_CONTROL", "ALLOW"),
  ];

  const preEntries = audit.getEntriesByStep(trace, "PRE_CONTROL");
  assert(preEntries.length === 2, "2 PRE_CONTROL entries");

  const reviews = audit.getEntriesByResult(trace, "REVIEW");
  assert(reviews.length === 1, "1 REVIEW result");
}

// ===================================================================
console.log("\n=== AUDIT — traceLength ===");

assert(audit.traceLength([1, 2, 3]) === 3, "Length 3");
assert(audit.traceLength([]) === 0, "Empty length 0");
assert(audit.traceLength(null) === 0, "Null length 0");

// ===================================================================
console.log("\n=== AUDIT — validateEntry ===");

{
  const good = audit.createTraceEntry("INGESTED", "OK");
  const r = audit.validateEntry(good);
  assert(r.valid === true, "Good entry valid");
  assert(r.errors.length === 0, "No errors");
}

{
  const r = audit.validateEntry(null);
  assert(r.valid === false, "Null entry invalid");
}

{
  const r = audit.validateEntry({ step: "X", timestamp: "not-a-date", result: "OK" });
  assert(r.valid === false, "Bad timestamp invalid");
}

{
  const r = audit.validateEntry({ step: "X", timestamp: new Date().toISOString() });
  assert(r.valid === false, "Missing result invalid");
}

{
  // detail must be object
  const r = audit.validateEntry({
    step: "X", timestamp: new Date().toISOString(), result: "OK", detail: "string-not-object",
  });
  assert(r.valid === false, "String detail invalid");
}

// ===================================================================
console.log("\n=== AUDIT — validateTrace ===");

{
  const trace = [
    audit.createTraceEntry("INGESTED", "OK"),
    audit.createTraceEntry("STRUCTURED", "OK"),
  ];
  // Small delay to ensure chronological
  const r = audit.validateTrace(trace);
  assert(r.valid === true, "Valid trace");
}

{
  assert(audit.validateTrace(null).valid === false, "Null trace invalid");
  assert(audit.validateTrace([]).valid === false, "Empty trace invalid");
}

{
  // Out of order timestamps
  const trace = [
    audit.createTraceEntryAt("STRUCTURED", "2026-03-22T12:01:00Z", "OK"),
    audit.createTraceEntryAt("INGESTED", "2026-03-22T12:00:00Z", "OK"),
  ];
  const r = audit.validateTrace(trace);
  assert(r.errors.some((e) => e.includes("chronological")), "Detects out-of-order");
}

// ===================================================================
console.log("\n=== AUDIT — createDelta ===");

{
  const prev = {
    status: "PRECHECKED",
    identity_score: 0.72,
    decision: "REVIEW",
    drift_flags: [],
    output_files: [],
    rejected_samples: [],
  };
  const curr = {
    status: "NORMALIZED",
    identity_score: 0.88,
    decision: "ALLOW",
    drift_flags: ["plastic_finish_drift"],
    output_files: ["/tmp/render.png"],
    rejected_samples: [],
  };

  const delta = audit.createDelta(prev, curr);
  assert(delta.change_count > 0, `${delta.change_count} changes detected`);
  assert(delta.changes.status.from === "PRECHECKED", "Status from");
  assert(delta.changes.status.to === "NORMALIZED", "Status to");
  assert(delta.changes.identity_score.from === 0.72, "Score from");
  assert(delta.changes.identity_score.to === 0.88, "Score to");
  assert(delta.changes.decision.from === "REVIEW", "Decision from");
  assert(delta.changes.drift_flags.added[0] === "plastic_finish_drift", "Flag added");
  assert(delta.changes.output_files.added[0] === "/tmp/render.png", "File added");
  assert(typeof delta.timestamp === "string", "Delta has timestamp");
}

{
  // No changes
  const delta = audit.createDelta({ status: "X" }, { status: "X" });
  assert(delta.change_count === 0, "No changes → count 0");
}

{
  // Null inputs
  const delta = audit.createDelta(null, null);
  assert(typeof delta === "object", "Null inputs don't crash");
}

// ===================================================================
console.log("\n=== AUDIT — serialize / deserialize ===");

{
  const trace = [
    audit.createTraceEntry("INGESTED", "OK"),
    audit.createTraceEntry("PRECHECKED", "ALLOW", { score: 0.88 }),
  ];
  const serialized = audit.serializeTrace(trace);
  assert(typeof serialized === "string", "Serialized is string");
  assert(serialized.includes("INGESTED"), "Contains step");

  const deserialized = audit.deserializeTrace(serialized);
  assert(Array.isArray(deserialized), "Deserialized is array");
  assert(deserialized.length === 2, "2 entries restored");
  assert(deserialized[0].step === "INGESTED", "Step restored");
  assert(deserialized[1].detail.score === 0.88, "Detail restored");
}

{
  // Deserialize garbage
  assert(audit.deserializeTrace(null).length === 0, "Null → empty");
  assert(audit.deserializeTrace("not json").length === 0, "Bad JSON → empty");
  assert(audit.deserializeTrace("").length === 0, "Empty → empty");
}

{
  // Serialize null
  assert(audit.serializeTrace(null) === "[]", "Null → []");
}

// ===================================================================
// NOTION LOGGER
// ===================================================================

// Setup mock Notion client
const mockNotion = {
  pages: [],
  updates: [],
  failNext: false,
  async createPage(params) {
    if (this.failNext) { this.failNext = false; throw new Error("Notion API error"); }
    const page = { id: `page_${this.pages.length}`, url: "https://notion.so/test", properties: params.properties };
    this.pages.push(page);
    return page;
  },
  async updatePage(params) {
    if (this.failNext) { this.failNext = false; throw new Error("Notion API error"); }
    this.updates.push(params);
    return { id: params.page_id, updated: true };
  },
  reset() { this.pages = []; this.updates = []; this.failNext = false; },
};

logger.setNotionClient(mockNotion);

// Wrap async tests
;(async () => {
try {

// ===================================================================
console.log("\n=== LOGGER — buildProperties ===");

{
  const props = logger.buildProperties({
    job_id: "mikage_test_001",
    status: "DONE",
    mode: "AUTO_DRAFT",
    source: "notion",
    identity: { character_id: "mikage_core" },
    narrative: { arc_id: "arc_001", chapter: "fragment_03" },
    prompt: "test positive prompt",
    negative_prompt: "test negative",
    seed: 42,
    attempt_count: 2,
    critic_score: 0.82,
    identity_score: 0.88,
    narrative_score: 0.85,
    risk_score: 0.10,
    decision: "ALLOW",
    drift_flags: ["plastic_finish_drift"],
    rejected_reason: "",
    output_files: ["/tmp/render.png"],
    rejected_samples: ["/tmp/reject.png"],
    audit: { trace: [{ step: "INGESTED", timestamp: "T", result: "OK" }] },
    created_at: "2026-03-22T12:00:00Z",
  });

  // Title
  assert(props.Title.title[0].text.content.includes("mikage_test_001"), "Title has job_id");

  // Text fields
  assert(props["Job ID"].rich_text[0].text.content === "mikage_test_001", "Job ID");
  assert(props.Status.select.name === "DONE", "Status");
  assert(props.Mode.select.name === "AUTO_DRAFT", "Mode");
  assert(props["Character ID"].rich_text[0].text.content === "mikage_core", "Character ID");
  assert(props["Arc ID"].rich_text[0].text.content === "arc_001", "Arc ID");
  assert(props.Chapter.rich_text[0].text.content === "fragment_03", "Chapter");
  assert(props.Decision.select.name === "ALLOW", "Decision");
  assert(props.Prompt.rich_text[0].text.content === "test positive prompt", "Prompt");
  assert(props["Negative Prompt"].rich_text[0].text.content === "test negative", "Negative");

  // Numbers
  assert(props.Seed.number === 42, "Seed");
  assert(props["Attempt Count"].number === 2, "Attempt count");
  assert(props["Critic Score"].number === 0.82, "Critic score");
  assert(props["Identity Score"].number === 0.88, "Identity score");
  assert(props["Narrative Score"].number === 0.85, "Narrative score");
  assert(props["Risk Score"].number === 0.10, "Risk score");

  // Multi-select
  assert(props["Drift Flags"].multi_select[0].name === "plastic_finish_drift", "Drift flag");

  // Files
  assert(props["Output Files"].rich_text[0].text.content.includes("render.png"), "Output files");
  assert(props["Rejected Samples"].rich_text[0].text.content.includes("reject.png"), "Rejected samples");

  // Dates
  assert(props["Created At"].date.start === "2026-03-22T12:00:00Z", "Created at");
  assert(props["Updated At"].date !== null, "Updated at set");

  // Audit trace
  assert(props["Audit Trace"].rich_text[0].text.content.includes("INGESTED"), "Trace serialized");
}

// ===================================================================
console.log("\n=== LOGGER — buildProperties EMPTY JOB ===");

{
  const props = logger.buildProperties({});
  assert(props.Title.title[0].text.content.includes("unknown"), "Empty job has fallback title");
  assert(props.Seed.number === null, "Null seed");
  assert(props["Drift Flags"].multi_select.length === 0, "Empty flags");
}

// ===================================================================
console.log("\n=== LOGGER — validateJobForLogging ===");

{
  const r1 = logger.validateJobForLogging({
    job_id: "x", status: "DONE", mode: "AUTO_DRAFT", source: "notion",
    audit: { trace: [{ step: "X", timestamp: "T", result: "OK" }] },
  });
  assert(r1.valid === true, "Complete job valid");
}

{
  const r2 = logger.validateJobForLogging({});
  assert(r2.valid === false, "Empty job invalid");
  assert(r2.missing.length > 0, `Missing fields: ${r2.missing.join(", ")}`);
}

{
  const r3 = logger.validateJobForLogging({ job_id: "x", status: "Y", mode: "Z", source: "S" });
  assert(r3.valid === false, "Missing audit.trace invalid");
  assert(r3.missing.includes("audit.trace"), "Reports audit.trace missing");
}

// ===================================================================
console.log("\n=== LOGGER — createJobEntry ===");

mockNotion.reset();

{
  const result = await logger.createJobEntry({
    job_id: "mikage_create_001",
    status: "INGESTED",
    mode: "AUTO_DRAFT",
    source: "notion",
    audit: { trace: [] },
  });

  assert(result.notion_id === "page_0", "Page created");
  assert(result.url.includes("notion"), "URL returned");
  assert(mockNotion.pages.length === 1, "1 page in mock");
  assert(mockNotion.pages[0].properties["Job ID"].rich_text[0].text.content === "mikage_create_001", "Job ID stored");
}

{
  // Null job throws
  let threw = false;
  try { await logger.createJobEntry(null); } catch (_) { threw = true; }
  assert(threw, "Null job throws");
}

{
  // Missing job_id throws
  let threw = false;
  try { await logger.createJobEntry({}); } catch (_) { threw = true; }
  assert(threw, "Missing job_id throws");
}

// ===================================================================
console.log("\n=== LOGGER — updateJobState ===");

mockNotion.reset();

{
  const result = await logger.updateJobState("page_123", {
    status: "PRECHECKED",
    job_id: "mikage_update_001",
    identity_score: 0.88,
    decision: "ALLOW",
    drift_flags: ["symmetry_drift"],
  });

  assert(result.updated === true, "Update succeeded");
  assert(mockNotion.updates.length === 1, "1 update in mock");

  const props = mockNotion.updates[0].properties;
  assert(props.Status.select.name === "PRECHECKED", "Status updated");
  assert(props.Decision.select.name === "ALLOW", "Decision updated");
  assert(props["Identity Score"].number === 0.88, "Score updated");
  assert(props["Drift Flags"].multi_select[0].name === "symmetry_drift", "Flags updated");
  assert(props["Updated At"].date !== null, "Updated timestamp set");
  assert(props.Title.title[0].text.content.includes("PRECHECKED"), "Title updated with status");
}

{
  // Null notionId throws
  let threw = false;
  try { await logger.updateJobState(null, {}); } catch (_) { threw = true; }
  assert(threw, "Null notionId throws");
}

// ===================================================================
console.log("\n=== LOGGER — writeAuditRecord ===");

mockNotion.reset();

{
  const job = {
    job_id: "mikage_audit_001",
    status: "DONE",
    prompt: "final prompt here",
    negative_prompt: "final negative",
    seed: 123456,
    risk_score: 0.10,
    audit: { trace: [{ step: "DONE", timestamp: "T", result: "OK" }] },
  };

  const results = {
    critic: { quality_score: 0.82 },
    drift: { identity_score: 0.88, narrative_score: 0.85, drift_flags: ["color_drift"] },
  };

  await logger.writeAuditRecord("page_final", job, results);

  assert(mockNotion.updates.length === 1, "Audit record written");
  const props = mockNotion.updates[0].properties;
  assert(props["Critic Score"].number === 0.82, "Critic from results");
  assert(props["Identity Score"].number === 0.88, "Identity from results");
  assert(props["Narrative Score"].number === 0.85, "Narrative from results");
  assert(props["Drift Flags"].multi_select[0].name === "color_drift", "Flags from results");
  assert(props.Seed.number === 123456, "Seed from job");
}

// ===================================================================
console.log("\n=== LOGGER — DLQ ===");

logger.clearDLQ();

{
  // Manually add to DLQ
  logger.sendToDLQ({ test: true }, new Error("test error"), 3);
  const dlq = logger.getDLQ();
  assert(dlq.length === 1, "1 entry in DLQ");
  assert(dlq[0].error === "test error", "Error message stored");
  assert(dlq[0].attempt_count === 3, "Attempt count stored");
  assert(typeof dlq[0].timestamp === "string", "Timestamp stored");
}

{
  // Replay from DLQ
  const result = await logger.replayFromDLQ(0);
  assert(result.id !== undefined, "Replay succeeded");
  assert(logger.getDLQ().length === 0, "Entry removed from DLQ after replay");
}

{
  // Replay out of range
  let threw = false;
  try { await logger.replayFromDLQ(99); } catch (_) { threw = true; }
  assert(threw, "Out-of-range DLQ index throws");
}

logger.clearDLQ();
assert(logger.getDLQ().length === 0, "DLQ cleared");

// ===================================================================
console.log("\n=== LOGGER — retryWithBackoff ===");

{
  // Succeeds first try
  let calls = 0;
  const result = await logger.retryWithBackoff(async () => {
    calls++;
    return { ok: true };
  }, 3);
  assert(result.ok === true, "First try succeeds");
  assert(calls === 1, "Called once");
}

{
  // Fails then succeeds
  let calls = 0;
  const result = await logger.retryWithBackoff(async () => {
    calls++;
    if (calls < 3) throw new Error("transient");
    return { ok: true };
  }, 5);
  assert(result.ok === true, "Succeeds on retry");
  assert(calls === 3, "Retried twice before success");
}

{
  // All retries exhausted
  let threw = false;
  try {
    await logger.retryWithBackoff(async () => {
      throw new Error("permanent");
    }, 1);
  } catch (e) {
    threw = e.message.includes("attempts failed");
  }
  assert(threw, "All retries exhausted throws");
}

// ===================================================================
console.log("\n=== LOGGER — FAILED WRITE → DLQ ===");

logger.clearDLQ();
mockNotion.reset();

{
  // Force Notion to fail permanently
  const failNotion = {
    async createPage() { throw new Error("503 Service Unavailable"); },
    async updatePage() { throw new Error("503 Service Unavailable"); },
  };
  logger.setNotionClient(failNotion);

  let threw = false;
  try {
    await logger.createJobEntry({
      job_id: "mikage_fail_001",
      status: "INGESTED",
      audit: { trace: [] },
    });
  } catch (_) {
    threw = true;
  }

  assert(threw, "Failed write throws");
  assert(logger.getDLQ().length === 1, "Failed write sent to DLQ");
  assert(logger.getDLQ()[0].error.includes("503"), "DLQ has error detail");

  // Restore mock
  logger.setNotionClient(mockNotion);
  logger.clearDLQ();
}

// ===================================================================
console.log("\n=== LOGGER — PARTIAL UPDATE (only changed fields) ===");

mockNotion.reset();

{
  await logger.updateJobState("page_partial", { critic_score: 0.77 });
  const props = mockNotion.updates[0].properties;

  // Only critic_score and Updated At should be set
  assert(props["Critic Score"].number === 0.77, "Critic score set");
  assert(props["Updated At"] !== undefined, "Updated At always set");
  assert(props.Status === undefined, "Status not set (not in update)");
  assert(props.Seed === undefined, "Seed not set");
}

// ===================================================================
// RESULTS
// ===================================================================

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

} catch (err) {
  console.error("TEST RUNNER ERROR:", err);
  process.exit(1);
}
})();
