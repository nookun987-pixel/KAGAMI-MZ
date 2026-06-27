"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const { routeIntent } = require("./control_plane/intent_router");
const { createTaskSpec, createJobId } = require("./control_plane/task_planner");
const { dispatchTask } = require("./control_plane/lane_dispatcher");
const { detectIssues, finalizeRun } = require("./control_plane/run_monitor");
const { judgeTask } = require("./control_plane/final_judge");
const { ControlMemory } = require("./control_plane/control_memory");
const { runMikage } = require("./index");
const { execute, getRuntimePaths } = require("./lanes/image/image_executor");
const { readJson } = require("./shared/utils/fs_utils");
const { routeFailure } = require("../execution/failure_router");
const { buildRepairAction } = require("../execution/repair_engine");
const { extractQualityFailurePacket } = require("../evaluation/quality_failure_extractor");
const { compileCanonPatchPacket } = require("../canon_evolution/canon_patch_compiler");
const { runVisionCritic } = require("../critic/vision_critic");

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

function makeTempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "mikage-control-plane-"));
}

function makeDriveRoot() {
  const driveRoot = path.join(makeTempRoot(), "mikage_runner");
  fs.mkdirSync(path.join(driveRoot, "job_inbox"), { recursive: true });
  fs.mkdirSync(path.join(driveRoot, "claims"), { recursive: true });
  fs.mkdirSync(path.join(driveRoot, "outputs"), { recursive: true });
  return driveRoot;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
}

function scheduleSuccessfulWorker(runtimePaths, options = {}) {
  const claimDelayMs = options.claimDelayMs || 50;
  const resultDelayMs = options.resultDelayMs || 120;
  const claimStatus = options.claimStatus || "claimed";
  const judgeOutput = options.judgeOutput || {
    source: "unavailable",
    status: "UNAVAILABLE",
    quality_score: null,
    overall_score: null,
    failure_codes: [],
    notes: ["GEMINI_API_KEY_MISSING"],
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      writeJson(runtimePaths.claimFilePath, {
        job_id: path.basename(runtimePaths.jobFilePath, ".json"),
        worker_id: "colab-worker-01",
        claimed_at: options.claimedAt || new Date().toISOString(),
        status: claimStatus,
      });
    }, claimDelayMs);

    setTimeout(() => {
      fs.mkdirSync(runtimePaths.outputDir, { recursive: true });
      fs.writeFileSync(runtimePaths.outputImagePath, "fake-image", "utf-8");
      writeJson(runtimePaths.judgeOutputFilePath, judgeOutput);
      writeJson(runtimePaths.resultFilePath, {
        job_id: path.basename(runtimePaths.jobFilePath, ".json"),
        status: options.resultStatus || "SUCCESS",
        completed_at: new Date().toISOString(),
        output_image_path: `outputs/${path.basename(runtimePaths.jobFilePath, ".json")}/output.png`,
        judge_output_path: `outputs/${path.basename(runtimePaths.jobFilePath, ".json")}/judge_output.json`,
        judge_output: judgeOutput,
      });
      resolve();
    }, resultDelayMs);
  });
}

;(async () => {
try {

console.log("\n=== INTENT ROUTER ===");

{
  const intent = routeIntent("create ceramic mask hero frame");
  assert(intent.intent_type === "image", "image request routes to image lane");
  assert(intent.goal === "create ceramic mask hero frame", "goal preserved");
  assert(intent.priority === "normal", "default priority normal");
}

{
  const intent = routeIntent({ goal: "deploy queue watchdog for control plane", priority: "high" });
  assert(intent.intent_type === "ops", "ops request routes to ops lane");
  assert(intent.priority === "high", "explicit priority preserved");
}

console.log("\n=== TASK PLANNER ===");

{
  const task = createTaskSpec(
    { intent_type: "image", goal: "create ceramic mask hero frame", constraints: [], priority: "high" },
    { date: new Date("2026-04-07T00:00:00Z"), sequence: 1 }
  );

  assert(task.job_id === "AUTO_20260407_001", "job id matches required format");
  assert(task.lane === "image", "task lane set");
  assert(task.execution_plan.steps[1] === "dispatch_render", "image plan uses render dispatch step");
  assert(task.success_criteria.length === 3, "success criteria included");
}

{
  const jobId = createJobId(12, new Date("2026-04-07T00:00:00Z"));
  assert(jobId === "AUTO_20260407_012", "job id sequence padded");
}

console.log("\n=== REAL IMAGE LANE ===");

{
  const unavailable = await runVisionCritic({ imagePath: "/tmp/none.png" });
  assert(unavailable.status === "UNAVAILABLE", "vision critic returns UNAVAILABLE when no live judge exists");
}

{
  const driveRoot = makeDriveRoot();
  const task = createTaskSpec(
    { intent_type: "image", goal: "create ceramic mask hero frame", constraints: [], priority: "normal" },
    { date: new Date("2026-04-07T00:00:00Z"), sequence: 2 }
  );
  const runtimePaths = getRuntimePaths(task, { driveRoot });

  const workerPromise = scheduleSuccessfulWorker(runtimePaths);
  const result = await execute(task, {
    driveRoot,
    pollIntervalMs: 20,
    timeoutMs: 1000,
    staleClaimMs: 500,
  });
  await workerPromise;

  assert(fs.existsSync(path.join(driveRoot, "job_inbox", `${task.job_id}.json`)), "executor writes job_inbox/<job_id>.json");
  assert(result.status === "completed", "success path reaches completed");
  assert(result.validator_result.passed === true, "success path validator passes");
  assert(result.metadata.observed_states.some((entry) => entry.state === "claimed"), "claim detected through claim file");
  assert(result.artifacts.some((artifact) => artifact.type === "result_json"), "result.json artifact returned");
  assert(result.artifacts.some((artifact) => artifact.type === "image"), "output.png artifact returned");
  assert(result.artifacts.some((artifact) => artifact.type === "judge_output_json"), "judge_output.json artifact returned");
  assert(result.validator_result.proof_blocked === true, "quality proof blocked when judge is not live");
}

{
  const driveRoot = makeDriveRoot();
  const task = createTaskSpec(
    { intent_type: "image", goal: "create ceramic mask hero frame", constraints: [], priority: "normal" },
    { date: new Date("2026-04-07T00:00:00Z"), sequence: 21 }
  );
  const runtimePaths = getRuntimePaths(task, { driveRoot });

  const workerPromise = scheduleSuccessfulWorker(runtimePaths, {
    judgeOutput: {
      source: "live",
      status: "REJECT",
      quality_score: 0.34,
      overall_score: 0.34,
      failure_codes: ["OBJECT_UNREADABLE"],
      notes: ["subject silhouette unclear"],
    },
  });
  const result = await execute(task, {
    driveRoot,
    pollIntervalMs: 20,
    timeoutMs: 1000,
    staleClaimMs: 500,
  });
  await workerPromise;

  assert(result.metadata.judge_output.source === "live", "judge_output returned from worker payload");
  assert(result.validator_result.critic_merge.source === "live", "critic merge uses live judge output");
}

{
  const driveRoot = makeDriveRoot();
  const task = createTaskSpec(
    { intent_type: "image", goal: "create ceramic mask hero frame", constraints: [], priority: "normal" },
    { date: new Date("2026-04-07T00:00:00Z"), sequence: 3 }
  );
  const runtimePaths = getRuntimePaths(task, { driveRoot });

  const workerPromise = new Promise((resolve) => {
    setTimeout(() => {
      writeJson(runtimePaths.claimFilePath, {
        job_id: task.job_id,
        worker_id: "colab-worker-01",
        claimed_at: new Date().toISOString(),
        status: "claimed",
      });
    }, 30);

    setTimeout(() => {
      fs.mkdirSync(runtimePaths.outputDir, { recursive: true });
      writeJson(runtimePaths.resultFilePath, {
        job_id: task.job_id,
        status: "SUCCESS",
        completed_at: new Date().toISOString(),
      });
      resolve();
    }, 90);
  });

  const laneResult = await execute(task, {
    driveRoot,
    pollIntervalMs: 20,
    timeoutMs: 1000,
    staleClaimMs: 500,
  });
  await workerPromise;

  const monitor = finalizeRun(task, laneResult);
  const decision = judgeTask(task, laneResult, monitor);

  assert(laneResult.status === "rejected", "missing image forces rejected lane status");
  assert(monitor.fatal_issues.includes("missing output.png"), "monitor detects missing output.png");
  assert(decision.decision === "REJECT", "missing image rejects final decision");
}

{
  const driveRoot = makeDriveRoot();
  const task = createTaskSpec(
    { intent_type: "image", goal: "create ceramic mask hero frame", constraints: [], priority: "normal" },
    { date: new Date("2026-04-07T00:00:00Z"), sequence: 4 }
  );
  const runtimePaths = getRuntimePaths(task, { driveRoot });

  const workerPromise = new Promise((resolve) => {
    setTimeout(() => {
      writeJson(runtimePaths.claimFilePath, {
        job_id: task.job_id,
        worker_id: "colab-worker-01",
        claimed_at: new Date().toISOString(),
        status: "claimed",
      });
    }, 20);

    setTimeout(() => {
      fs.mkdirSync(runtimePaths.outputDir, { recursive: true });
      fs.writeFileSync(runtimePaths.outputImagePath, "fake-image", "utf-8");
      fs.writeFileSync(runtimePaths.resultFilePath, "{bad json", "utf-8");
      resolve();
    }, 60);
  });

  const laneResult = await execute(task, {
    driveRoot,
    pollIntervalMs: 20,
    timeoutMs: 1000,
    staleClaimMs: 500,
  });
  await workerPromise;

  const monitor = finalizeRun(task, laneResult);
  const decision = judgeTask(task, laneResult, monitor);

  assert(laneResult.status === "rejected", "malformed result rejects lane");
  assert(monitor.fatal_issues.includes("malformed result.json"), "monitor detects malformed result.json");
  assert(decision.decision === "REJECT", "malformed result rejects final decision");
}

{
  const driveRoot = makeDriveRoot();
  const task = createTaskSpec(
    { intent_type: "image", goal: "create ceramic mask hero frame", constraints: [], priority: "normal" },
    { date: new Date("2026-04-07T00:00:00Z"), sequence: 5 }
  );

  const laneResult = await execute(task, {
    driveRoot,
    pollIntervalMs: 20,
    timeoutMs: 120,
    staleClaimMs: 500,
  });
  const monitor = finalizeRun(task, laneResult);
  const decision = judgeTask(task, laneResult, monitor);

  assert(laneResult.status === "timeout", "timeout path returns timeout");
  assert(monitor.fatal_issues.includes("timeout"), "monitor detects timeout");
  assert(decision.decision === "REJECT", "timeout rejects final decision");
}

{
  const driveRoot = makeDriveRoot();
  const task = createTaskSpec(
    { intent_type: "image", goal: "create ceramic mask hero frame", constraints: [], priority: "normal" },
    { date: new Date("2026-04-07T00:00:00Z"), sequence: 6 }
  );
  const runtimePaths = getRuntimePaths(task, { driveRoot });

  writeJson(runtimePaths.claimFilePath, {
    job_id: task.job_id,
    worker_id: "colab-worker-01",
    claimed_at: "2026-04-07T00:00:00.000Z",
    status: "claimed",
  });

  const laneResult = await execute(task, {
    driveRoot,
    pollIntervalMs: 20,
    timeoutMs: 200,
    staleClaimMs: 10,
  });
  const issues = detectIssues(task, laneResult, {
    startedAt: "2026-04-07T00:00:00.000Z",
    now: "2026-04-07T00:10:00.000Z",
    staleAfterMs: 10,
  });

  assert(laneResult.validator_result.signals.includes("stale claim"), "stale claim detected by executor");
  assert(issues.issues.includes("stale claim"), "monitor detects stale claim");
}

console.log("\n=== CONTROL MEMORY ===");

{
  const tempRoot = makeTempRoot();
  const memory = new ControlMemory({ memoryRoot: tempRoot });
  const nextSequence = memory.getNextSequence(new Date("2026-04-07T00:00:00Z"));
  assert(nextSequence === 1, "empty memory starts sequence at 1");

  memory.recordRun({
    job_id: "AUTO_20260407_001",
    intent: { intent_type: "image", goal: "create ceramic mask hero frame" },
    taskSpec: { lane: "image" },
    runRecord: {},
    laneResult: {},
    monitorReport: {},
    decision: { decision: "ALLOW" },
  });

  assert(memory.getRunHistory().runs.length === 1, "memory records run history");
  assert(memory.getCanonMemory().patterns.length === 1, "memory stores successful pattern");
}

console.log("\n=== END TO END CONTROL PLANE ===");

{
  const driveRoot = makeDriveRoot();
  const tempRoot = makeTempRoot();
  const memory = new ControlMemory({ memoryRoot: path.join(tempRoot, "memory") });
  const task = createTaskSpec(
    { intent_type: "image", goal: "create ceramic mask hero frame", constraints: [], priority: "normal" },
    { date: new Date("2026-04-07T00:00:00Z"), sequence: 1 }
  );
  const runtimePaths = getRuntimePaths(task, { driveRoot });

  const workerPromise = scheduleSuccessfulWorker(runtimePaths, {
    claimDelayMs: 30,
    resultDelayMs: 90,
  });

  const result = await runMikage("create ceramic mask hero frame", {
    memory,
    driveRoot,
    timeoutMs: 1000,
    pollIntervalMs: 20,
    staleClaimMs: 500,
    date: new Date("2026-04-07T00:00:00Z"),
  });
  await workerPromise;

  assert(result.intent.intent_type === "image", "e2e routes to image");
  assert(result.taskSpec.job_id === "AUTO_20260407_001", "e2e planner generates stable job id");
  assert(result.monitorReport.state === "completed", "e2e monitor completes");
  assert(result.decision.decision === "ALLOW", "e2e final judge allows valid image run");
}

console.log("\n=== META HARNESS AUTO RETRY ===");

{
  let calls = 0;
  const tempRoot = makeTempRoot();
  const traceRoot = path.join(tempRoot, "traces");
  const memory = new ControlMemory({ memoryRoot: path.join(tempRoot, "memory") });
  const registry = {
    image: {
      async execute(taskSpec) {
        calls += 1;
        const traceDir = path.join(tempRoot, "lane-artifacts", taskSpec.job_id);
        fs.mkdirSync(traceDir, { recursive: true });

        if (calls === 1) {
          return {
            job_id: taskSpec.job_id,
            lane: "image",
            status: "timeout",
            summary: "first attempt timeout",
            artifacts: [],
            validator_result: { passed: false, signals: ["timeout"], issues: ["timeout"] },
            error: "timeout",
            started_at: new Date().toISOString(),
            finished_at: new Date().toISOString(),
            metadata: { queue_state: "queued" },
          };
        }

        const resultPath = path.join(traceDir, "result.json");
        const imagePath = path.join(traceDir, "output.png");
        writeJson(resultPath, { job_id: taskSpec.job_id, status: "completed" });
        fs.writeFileSync(imagePath, "image", "utf-8");

        return {
          job_id: taskSpec.job_id,
          lane: "image",
          status: "completed",
          summary: "second attempt success",
          artifacts: [
            { type: "result_json", path: resultPath },
            { type: "image", path: imagePath },
          ],
          validator_result: { passed: true, signals: [], issues: [] },
          error: null,
          started_at: new Date().toISOString(),
          finished_at: new Date().toISOString(),
          metadata: {
            queue_state: "completed",
            result: { job_id: taskSpec.job_id, status: "completed" },
          },
        };
      },
    },
  };

  const result = await runMikage("ceramic mask hero frame", {
    memory,
    registry,
    traceRoot,
    maxAttempts: 2,
    timeoutMs: 50,
    date: new Date("2026-04-07T00:00:00Z"),
  });

  assert(calls === 2, "outer loop auto-retries exactly once");
  assert(result.decision.decision === "ALLOW", "auto-retry case ends in allow");
  assert(result.taskSpec.job_id.endsWith("_R02"), "retry attempt uses suffixed job id");

  const trace1 = path.join(traceRoot, "AUTO_20260407_001", "attempt-01", "raw_execution_trace.json");
  const trace2 = path.join(traceRoot, "AUTO_20260407_001_R02", "attempt-02", "raw_execution_trace.json");
  const prompt2 = path.join(traceRoot, "AUTO_20260407_001_R02", "attempt-02", "full_prompt.txt");
  const response2 = path.join(traceRoot, "AUTO_20260407_001_R02", "attempt-02", "full_response.txt");
  const analyzer2 = path.join(traceRoot, "AUTO_20260407_001_R02", "attempt-02", "analyzer_full.json");
  const judge2 = path.join(traceRoot, "AUTO_20260407_001_R02", "attempt-02", "judge_full.json");
  const failureRoute2 = path.join(traceRoot, "AUTO_20260407_001_R02", "attempt-02", "failure_route.json");
  const repairAction2 = path.join(traceRoot, "AUTO_20260407_001_R02", "attempt-02", "repair_action.json");
  const qualityPacket2 = path.join(traceRoot, "AUTO_20260407_001_R02", "attempt-02", "quality_failure_packet.json");
  const repairPatch2 = path.join(traceRoot, "AUTO_20260407_001_R02", "attempt-02", "repair_patch_packet.json");
  const retryDecision2 = path.join(traceRoot, "AUTO_20260407_001_R02", "attempt-02", "quality_retry_decision.json");
  const scoreDelta2 = path.join(traceRoot, "AUTO_20260407_001_R02", "attempt-02", "quality_score_delta.json");
  const lineage2 = path.join(traceRoot, "AUTO_20260407_001_R02", "attempt-02", "retry_lineage.json");
  const finalDecision2 = path.join(traceRoot, "AUTO_20260407_001_R02", "attempt-02", "final_decision_snapshot.json");

  assert(fs.existsSync(trace1), "attempt 1 raw trace exists");
  assert(fs.existsSync(trace2), "attempt 2 raw trace exists");
  assert(fs.existsSync(prompt2), "full_prompt.txt exists");
  assert(fs.existsSync(response2), "full_response.txt exists");
  assert(fs.existsSync(analyzer2), "analyzer_full.json exists");
  assert(fs.existsSync(judge2), "judge_full.json exists");
  assert(fs.existsSync(failureRoute2), "failure_route.json exists");
  assert(fs.existsSync(repairAction2), "repair_action.json exists");
  assert(fs.existsSync(qualityPacket2), "quality_failure_packet.json exists");
  assert(fs.existsSync(repairPatch2), "repair_patch_packet.json exists");
  assert(fs.existsSync(retryDecision2), "quality_retry_decision.json exists");
  assert(fs.existsSync(scoreDelta2), "quality_score_delta.json exists");
  assert(fs.existsSync(lineage2), "retry_lineage.json exists");
  assert(fs.existsSync(finalDecision2), "final_decision_snapshot.json exists");

  const attempt1Trace = readJson(trace1, {});
  const attempt2Judge = readJson(judge2, {});
  assert(attempt1Trace.failureRoute.failure_type === "timeout", "failure router classifies timeout");
  assert(attempt2Judge.repairAction.repairable === false, "final attempt no further retry");
  assert(attempt1Trace.repairAction.repair_class === "runtime", "runtime repair class recorded");
  assert(readJson(lineage2, {}).original_job_id === "AUTO_20260407_001", "retry lineage records original job id");
}

{
  let calls = 0;
  const tempRoot = makeTempRoot();
  const traceRoot = path.join(tempRoot, "traces");
  const memory = new ControlMemory({ memoryRoot: path.join(tempRoot, "memory") });
  const registry = {
    image: {
      async execute(taskSpec) {
        calls += 1;
        const outDir = path.join(tempRoot, "proof-blocked", taskSpec.job_id);
        fs.mkdirSync(outDir, { recursive: true });
        const resultPath = path.join(outDir, "result.json");
        const imagePath = path.join(outDir, "output.png");
        fs.writeFileSync(imagePath, "image", "utf-8");
        writeJson(resultPath, {
          job_id: taskSpec.job_id,
          status: "completed",
        });
        return {
          job_id: taskSpec.job_id,
          lane: "image",
          status: "completed",
          summary: "success without live judge",
          artifacts: [
            { type: "result_json", path: resultPath },
            { type: "image", path: imagePath },
          ],
          validator_result: {
            passed: true,
            signals: [],
            issues: [],
          },
          error: null,
          started_at: new Date().toISOString(),
          finished_at: new Date().toISOString(),
          metadata: {
            queue_state: "completed",
            result: { job_id: taskSpec.job_id, status: "completed" },
          },
        };
      },
    },
  };

  const result = await runMikage("ceramic mask hero frame", {
    memory,
    registry,
    traceRoot,
    maxAttempts: 2,
    timeoutMs: 50,
    date: new Date("2026-04-07T00:00:00Z"),
  });

  const packet = readJson(path.join(traceRoot, "AUTO_20260407_001", "attempt-01", "quality_failure_packet.json"), null);
  const retryDecision = readJson(path.join(traceRoot, "AUTO_20260407_001", "attempt-01", "quality_retry_decision.json"), {});
  assert(calls === 1, "index does not retry quality proof when judge is not live");
  assert(packet === null, "quality packet is not fabricated without live judge");
  assert(retryDecision.proof_blocked === true, "index marks proof blocked when judge is not live");
  assert(result.qualityFailurePacket === null, "attempt result keeps quality packet null without live judge");
}

console.log("\n=== CANON-AWARE IMAGE INTELLIGENCE V1 ===");

{
  const packet = extractQualityFailurePacket({
    judgeOutput: {
      status: "REJECT",
      quality_score: 0.21,
      failure_codes: ["OBJECT_UNREADABLE", "ABSTRACT_COMPOSITION"],
    },
    validatorResult: {
      passed: false,
      signals: ["object_unreadable", "abstract_composition"],
      issues: [],
    },
  });

  assert(packet.primary_failure_code === "OBJECT_UNREADABLE", "judge output normalized into stable quality packet");
  assert(packet.failure_codes.includes("ABSTRACT_COMPOSITION"), "multiple quality codes normalized");
}

{
  const packet = extractQualityFailurePacket({
    judgeOutput: {
      source: "live",
      status: "REJECT",
      quality_score: 0.31,
      failure_codes: ["OBJECT_UNREADABLE"],
      notes: [],
    },
  });
  assert(packet.primary_failure_code === "OBJECT_UNREADABLE", "quality packet builds from live judge_output");
}

{
  const patch = compileCanonPatchPacket({
    taskSpec: { lane: "image", objective: "ceramic mask hero frame" },
    qualityFailurePacket: {
      repair_class: "quality",
      failure_codes: ["OBJECT_UNREADABLE"],
    },
    canonMemory: {
      traits: {
        dominant_traits: ["mask hero faceplate"],
        supportive_traits: ["front-facing framing"],
        blocked_traits: ["tiny distant object"],
        must_have_traits: ["ceramic forehead crest"],
      },
    },
  });

  assert(patch.prompt_patch.positive_additions.includes("clear readable hero object"), "OBJECT_UNREADABLE generates identity-focused patch packet");
  assert(patch.canon_patch.dominant_traits.includes("mask hero faceplate"), "canon memory reused in patch packet");
  assert(patch.prompt_patch.negative_additions.includes("tiny distant object"), "blocked traits injected into patch packet");
}

{
  const patch = compileCanonPatchPacket({
    taskSpec: { lane: "image", objective: "ceramic mask hero frame" },
    qualityFailurePacket: {
      repair_class: "quality",
      failure_codes: ["ABSTRACT_COMPOSITION"],
      primary_failure_codes: ["ABSTRACT_COMPOSITION"],
    },
    canonMemory: {},
  });

  assert(patch.prompt_patch.negative_additions.includes("abstract composition"), "ABSTRACT_COMPOSITION generates anti-abstract framing patch");
  assert(patch.recovery_mode === "STRONG_OBJECT_RECOVERY", "ABSTRACT_COMPOSITION activates strong recovery mode");
  assert(patch.prompt_patch.positive_additions.includes("force non-abstract composition"), "strong anti-abstract prompt bundle emitted");
}

{
  const packet = extractQualityFailurePacket({
    judgeOutput: {
      source: "live",
      status: "REJECT",
      quality_score: 0.22,
      failure_codes: [],
      notes: "atmospheric composition, mood over subject, difficult to identify form, symbolic non-literal framing",
    },
  });

  assert(packet.failure_codes.includes("ABSTRACT_COMPOSITION"), "abstract wording normalization maps to ABSTRACT_COMPOSITION");
  assert(packet.failure_codes.includes("OBJECT_UNREADABLE"), "object-read wording normalization maps to OBJECT_UNREADABLE");
  assert(packet.failure_codes.includes("SYMBOLIC_FRAMING"), "symbolic wording normalization maps to SYMBOLIC_FRAMING");
}

{
  const packet = extractQualityFailurePacket({
    judgeOutput: {
      source: "live",
      status: "REJECT",
      quality_score: 0.48,
      failure_codes: [],
      notes: "generic product render, weak identity, overly clean cg perfection, decorative geometry, lightweight accessory-like object",
    },
  });

  assert(packet.failure_codes.includes("GENERIC_OBJECT"), "generic wording normalization maps to GENERIC_OBJECT");
  assert(packet.failure_codes.includes("WEAK_IDENTITY"), "identity wording normalization maps to WEAK_IDENTITY");
  assert(packet.failure_codes.includes("CG_PERFECTION"), "cg perfection normalization maps correctly");
}

{
  const packet = extractQualityFailurePacket({
    judgeOutput: {
      source: "live",
      status: "PASS",
      quality_score: 0.9,
      failure_codes: [],
      notes: "The image displays abstract geometric models but all objects are easily readable and composition is clear.",
    },
  });

  assert(packet.failure_codes.length === 0, "pass notes do not fabricate failure codes from descriptive wording");
}

{
  const patch = compileCanonPatchPacket({
    taskSpec: { lane: "image", objective: "mikage hero artifact" },
    qualityFailurePacket: {
      repair_class: "quality",
      failure_codes: ["GENERIC_OBJECT", "WEAK_IDENTITY"],
      primary_failure_codes: ["GENERIC_OBJECT", "WEAK_IDENTITY"],
    },
    canonMemory: {},
  });

  assert(patch.recovery_mode === "STRONG_OBJECT_RECOVERY", "identity failures activate strong recovery mode");
  assert(patch.prompt_patch.positive_additions.includes("emphasize engineered ceramic artifact"), "identity patch emits structural prompt reinforcement");
}

{
  let calls = 0;
  let retryConstraints = null;
  const tempRoot = makeTempRoot();
  const traceRoot = path.join(tempRoot, "traces");
  const memory = new ControlMemory({ memoryRoot: path.join(tempRoot, "memory") });
  writeJson(path.join(tempRoot, "memory", "canon_memory.json"), {
    traits: {
      dominant_traits: ["hero mask silhouette"],
      supportive_traits: ["front-facing readable shot"],
      blocked_traits: ["abstract composition"],
      must_have_traits: ["ceramic brow ridge"],
    },
    patterns: [],
  });
  const registry = {
    image: {
      async execute(taskSpec) {
        calls += 1;
        if (calls === 2) {
          retryConstraints = taskSpec.constraints || [];
        }

        if (calls === 1) {
          return {
            job_id: taskSpec.job_id,
            lane: "image",
            status: "rejected",
            summary: "quality failure",
            artifacts: [],
            validator_result: {
              passed: false,
              signals: ["object_unreadable"],
              issues: ["object_unreadable"],
              quality_score: 0.2,
            },
            error: "object_unreadable",
            started_at: new Date().toISOString(),
            finished_at: new Date().toISOString(),
            metadata: {
              judge_output: {
                source: "live",
                status: "REJECT",
                quality_score: 0.2,
                failure_codes: ["OBJECT_UNREADABLE"],
              },
            },
          };
        }

        const outDir = path.join(tempRoot, "quality-pass", taskSpec.job_id);
        fs.mkdirSync(outDir, { recursive: true });
        const resultPath = path.join(outDir, "result.json");
        const imagePath = path.join(outDir, "output.png");
        writeJson(resultPath, { job_id: taskSpec.job_id, status: "completed" });
        fs.writeFileSync(imagePath, "image", "utf-8");

        return {
          job_id: taskSpec.job_id,
          lane: "image",
          status: "completed",
          summary: "quality repaired",
          artifacts: [
            { type: "result_json", path: resultPath },
            { type: "image", path: imagePath },
          ],
          validator_result: {
            passed: true,
            signals: [],
            issues: [],
            quality_score: 0.92,
          },
          error: null,
          started_at: new Date().toISOString(),
          finished_at: new Date().toISOString(),
          metadata: {
            judge_output: {
              source: "live",
              status: "ALLOW",
              quality_score: 0.92,
              failure_codes: [],
            },
          },
        };
      },
    },
  };

  const result = await runMikage("ceramic mask hero frame", {
    memory,
    registry,
    traceRoot,
    maxAttempts: 3,
    timeoutMs: 50,
    date: new Date("2026-04-07T00:00:00Z"),
  });

  const attempt1Dir = path.join(traceRoot, "AUTO_20260407_001", "attempt-01");
  const attempt2Dir = path.join(traceRoot, "AUTO_20260407_001_R02", "attempt-02");
  const packet1 = readJson(path.join(attempt1Dir, "quality_failure_packet.json"), {});
  const patch1 = readJson(path.join(attempt1Dir, "repair_patch_packet.json"), {});
  const decision1 = readJson(path.join(attempt1Dir, "quality_retry_decision.json"), {});
  const delta2 = readJson(path.join(attempt2Dir, "quality_score_delta.json"), {});

  assert(packet1.primary_failure_code === "OBJECT_UNREADABLE", "failed image attempt produces quality_failure_packet.json");
  assert(patch1.canon_patch.dominant_traits.includes("hero mask silhouette"), "repair_patch_packet.json reuses canon dominant traits");
  assert(decision1.retry_allowed === true, "quality retry decision allows canon-aware retry");
  assert(Array.isArray(retryConstraints) && retryConstraints.includes("clear readable hero object"), "second attempt uses modified prompt controls");
  assert(delta2.improved === true && delta2.delta > 0, "score improvement writes quality_score_delta.json");
  assert(result.decision.decision === "ALLOW", "quality retry path can recover to allow");
}

{
  let calls = 0;
  const tempRoot = makeTempRoot();
  const traceRoot = path.join(tempRoot, "traces");
  const memory = new ControlMemory({ memoryRoot: path.join(tempRoot, "memory") });
  const registry = {
    image: {
      async execute(taskSpec) {
        calls += 1;
        return {
          job_id: taskSpec.job_id,
          lane: "image",
          status: "rejected",
          summary: "repeated abstract failure",
          artifacts: [],
          validator_result: {
            passed: false,
            signals: ["abstract_composition"],
            issues: ["abstract_composition"],
            quality_score: 0.15,
          },
          error: "abstract_composition",
          started_at: new Date().toISOString(),
          finished_at: new Date().toISOString(),
          metadata: {
            judge_output: {
              source: "live",
              status: "REJECT",
              quality_score: 0.15,
              failure_codes: ["ABSTRACT_COMPOSITION"],
            },
          },
        };
      },
    },
  };

  const result = await runMikage("ceramic mask hero frame", {
    memory,
    registry,
    traceRoot,
    maxAttempts: 3,
    timeoutMs: 50,
    date: new Date("2026-04-07T00:00:00Z"),
  });

  const attempt2Repair = readJson(path.join(traceRoot, "AUTO_20260407_001_R02", "attempt-02", "repair_action.json"), {});
  const attempt2RetryDecision = readJson(path.join(traceRoot, "AUTO_20260407_001_R02", "attempt-02", "quality_retry_decision.json"), {});

  assert(calls === 2, "repeated same failure triggers safe stop");
  assert(attempt2RetryDecision.hard_stop === true, "quality retry guard hard-stops repeated failure");
  assert(attempt2Repair.repairable === false, "repair engine stops non-repairable repeated quality failure");
  assert(result.decision.decision === "REJECT", "safe stop returns final reject on repeated quality failure");
}

console.log("\n=== FAILURE ROUTER V2 ===");

{
  const canonRoute = routeFailure({
    taskSpec: { lane: "image" },
    laneResult: { validator_result: { passed: false, signals: ["canon_fail"] } },
    monitorReport: { fatal_issues: ["validator fail"] },
    decision: { decision: "REJECT" },
  });
  assert(canonRoute.repair_class === "canon", "canon failure class detected");
  assert(canonRoute.retry_allowed === true, "canon failure allows retry");
}

{
  const qualityRoute = routeFailure({
    taskSpec: { lane: "image" },
    laneResult: { validator_result: { passed: false, signals: ["abstract_composition"] } },
    monitorReport: { fatal_issues: ["validator fail"] },
    decision: { decision: "REJECT" },
  });
  assert(qualityRoute.failure_type === "abstract_composition", "quality failure type detected");
  assert(qualityRoute.repair_class === "quality", "quality repair class detected");
}

{
  const runtimeRoute = routeFailure({
    taskSpec: { lane: "image" },
    laneResult: { status: "timeout", validator_result: { passed: false, signals: ["timeout"] } },
    monitorReport: { fatal_issues: ["timeout"] },
    decision: { decision: "REJECT" },
  });
  assert(runtimeRoute.repair_class === "runtime", "runtime repair class detected");
  assert(runtimeRoute.repair_strategy === "retry_with_longer_timeout", "runtime strategy detected");
}

console.log("\n=== REPAIR ENGINE V2 ===");

{
  const root = makeTempRoot();
  const rawTracePath = path.join(root, "raw_execution_trace.json");
  writeJson(rawTracePath, {
    taskSpec: { job_id: "AUTO_20260407_900" },
    options: { timeoutMs: 5000 },
  });

  const repair = buildRepairAction(
    { raw_execution_trace_path: rawTracePath },
    {
      failure_type: "timeout",
      responsible_module: "runtime/drive_queue/runtime.js",
      repair_strategy: "retry_with_longer_timeout",
      repair_class: "runtime",
      retry_allowed: true,
    },
    { attemptIndex: 1, maxAttempts: 2, timeoutMs: 5000 }
  );

  assert(repair.repairable === true, "runtime repairable");
  assert(repair.actions.includes("increase_timeout"), "runtime repair action emitted");
  assert(repair.next_options.timeoutMs > 5000, "timeout increased");
}

{
  const repair = buildRepairAction(
    { raw_execution_trace_path: path.join(makeTempRoot(), "missing.json") },
    {
      failure_type: "abstract_composition",
      responsible_module: "MIKAGE/lanes/image",
      repair_strategy: "anti_abstract_reinforcement",
      repair_class: "quality",
      retry_allowed: true,
    },
    { attemptIndex: 1, maxAttempts: 2 }
  );

  assert(repair.repair_class === "quality", "quality repair class emitted");
  assert(repair.actions.includes("anti_abstract_reinforcement"), "quality action emitted");
  assert(repair.actions.includes("strong_object_recovery"), "strong object recovery action emitted");
  assert(repair.prompt_patch.negative_additions.includes("abstract composition"), "quality prompt patch emitted");
}

{
  const repair = buildRepairAction(
    { raw_execution_trace_path: path.join(makeTempRoot(), "missing.json") },
    {
      failure_type: "generic_object",
      responsible_module: "MIKAGE/lanes/image",
      repair_strategy: "identity_lock_reinforcement",
      repair_class: "quality",
      retry_allowed: true,
    },
    { attemptIndex: 1, maxAttempts: 2 }
  );

  assert(repair.actions.includes("identity_lock_reinforcement"), "identity lock action emitted");
  assert(repair.prompt_patch.positive_additions.includes("engineered ceramic artifact"), "identity prompt bundle emitted");
}

{
  const tempRoot = makeTempRoot();
  const traceRoot = path.join(tempRoot, "traces");
  const attempts = [
    {
      qualityFailurePacket: {
        score: 0.4,
        primary_failure_code: "ABSTRACT_COMPOSITION",
        primary_failure_codes: ["ABSTRACT_COMPOSITION", "OBJECT_CENTRALITY_WEAK"],
        secondary_failure_codes: ["FUNCTIONAL_FORM_WEAK"],
      },
    },
    {
      qualityFailurePacket: {
        score: 0.91,
        primary_failure_code: "FUNCTIONAL_FORM_WEAK",
        primary_failure_codes: ["FUNCTIONAL_FORM_WEAK"],
        secondary_failure_codes: [],
      },
    },
  ];
  const delta = require("../execution/quality_delta_reporter").writeQualityDeltaReport("AUTO_20260407_777", attempts, { traceRoot });
  assert(delta.report.primary_failure_removed === true, "delta report marks primary failure removed");
  assert(delta.report.verdict === "RECOVERY_MAJOR_IMPROVED", "delta report emits major improved verdict");
}

{
  const tempRoot = makeTempRoot();
  const traceRoot = path.join(tempRoot, "traces");
  const attempts = [
    {
      qualityFailurePacket: {
        score: 0.5,
        primary_failure_code: "GENERIC_OBJECT",
        primary_failure_codes: ["GENERIC_OBJECT", "WEAK_IDENTITY"],
        secondary_failure_codes: ["CG_PERFECTION"],
      },
    },
    {
      qualityFailurePacket: {
        score: 0.88,
        primary_failure_code: "",
        primary_failure_codes: [],
        secondary_failure_codes: [],
      },
    },
  ];
  const delta = require("../execution/quality_delta_reporter").writeQualityDeltaReport("AUTO_20260407_778", attempts, { traceRoot });
  assert(delta.report.identity_improved === true, "delta report marks identity improved");
  assert(delta.report.generic_removed === true, "delta report marks generic removed");
}

{
  const repair = buildRepairAction(
    { raw_execution_trace_path: path.join(makeTempRoot(), "missing.json") },
    {
      failure_type: "canon_fail",
      responsible_module: "MIKAGE/lanes/image",
      repair_strategy: "canon_lock_boost",
      repair_class: "canon",
      retry_allowed: true,
    },
    { attemptIndex: 1, maxAttempts: 2 }
  );

  assert(repair.repair_class === "canon", "canon repair class emitted");
  assert(repair.actions.includes("canon_lock_boost"), "canon lock boost action emitted");
  assert(repair.canon_patch.must_have_replay.length > 0, "canon patch emitted");
}

{
  const repair = buildRepairAction(
    { raw_execution_trace_path: path.join(makeTempRoot(), "missing.json") },
    {
      failure_type: "timeout",
      responsible_module: "runtime/drive_queue/runtime.js",
      repair_strategy: "retry_with_longer_timeout",
      repair_class: "runtime",
      retry_allowed: true,
    },
    { attemptIndex: 2, maxAttempts: 2, timeoutMs: 5000 }
  );

  assert(repair.repairable === false, "hard stop at max retry cap");
  assert(repair.notes.includes("Max retry cap reached."), "max retry note emitted");
}

console.log("\n" + "=".repeat(60));
console.log(`RESULTS: ${passed} passed, ${failed} failed`);

if (failures.length > 0) {
  console.log("\nFAILURES:");
  for (const failure of failures) {
    console.log(`  • ${failure}`);
  }
}

console.log("=".repeat(60) + "\n");

process.exit(failed > 0 ? 1 : 0);

} catch (err) {
  console.error("TEST RUNNER ERROR:", err);
  process.exit(1);
}
})();
