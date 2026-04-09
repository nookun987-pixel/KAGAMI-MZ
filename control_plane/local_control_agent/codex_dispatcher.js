"use strict";

const fs = require("fs");
const path = require("path");

const { buildTaskContract, writeTaskContractArtifact } = require("../task_contract");
const { buildTaskBrief, writeTaskBriefArtifact } = require("../task_brief_builder");
const { buildCodexDispatchPack, writeCodexDispatchPackArtifact } = require("../codex_dispatch_pack_builder");
const config = require("./config");
const { getGovernorStatus } = require("../process_governor");
const { governedSpawnSync } = require("../process_governor");

function buildCodexTask(command) {
  const normalized = {
    ...command,
    payload: {
      ...(command.payload || {}),
      task_id: command.payload && command.payload.task_id || `codex_${Date.now()}`,
      objective: command.payload && (command.payload.objective || command.payload.task) || "",
      scope_in: command.payload && command.payload.scope_in || command.payload && command.payload.files || ["control_plane"],
      scope_out: command.payload && command.payload.scope_out || [
        "start_mikage.bat",
        "MIKAGE/index.js",
        "runtime/drive_queue/runtime.js",
        "runtime/colab_worker/*",
      ],
      success_criteria: command.payload && command.payload.success_criteria || [
        "bounded implementation completed",
        "required tests pass",
      ],
      executor: "codex",
      task_type: command.payload && command.payload.task_type || "operator_action",
    },
  };
  const contractResult = buildTaskContract(normalized, {
    tool_type: "write",
    executor: "codex",
    status: "dispatch_ready",
  });
  if (contractResult.status !== "PASS") {
    return { status: "BLOCKED", reason: contractResult.reason };
  }
  const contract = contractResult.contract;
  const taskContractPath = writeTaskContractArtifact(contract);
  const brief = buildTaskBrief(contract, {
    tests_required: command.payload && command.payload.tests_required || ["node MIKAGE\\mikage.test.js"],
  }).brief;
  const taskBriefPath = writeTaskBriefArtifact(contract.task_id, brief);
  const dispatch = buildCodexDispatchPack(contract, brief, {
    files_expected_to_change: contract.target_files,
  }).dispatch;
  const dispatchPath = writeCodexDispatchPackArtifact(contract.task_id, dispatch);
  return {
    status: "PASS",
    taskId: contract.task_id,
    task_contract_path: taskContractPath,
    task_brief_path: taskBriefPath,
    dispatch_pack_path: dispatchPath,
    record: dispatch,
    process_governor: getGovernorStatus(20),
  };
}

function handoffDispatchPack(input = {}) {
  if (!input.job_id || !input.dispatch_pack_path) {
    return { status: "FAIL", reason: "missing_job_id_or_dispatch_pack_path" };
  }
  const handoffRef = path.join(config.STATE_DIR, `${input.job_id}.executor_handoff.json`);
  const handoffRecord = {
    job_id: input.job_id,
    task_id: input.dispatch && input.dispatch.task_id || null,
    dispatch_pack_path: input.dispatch_pack_path,
    dispatch_id: input.dispatch && input.dispatch.dispatch_id || null,
    status: "DISPATCHED",
    handed_off_at: new Date().toISOString(),
  };
  fs.mkdirSync(path.dirname(handoffRef), { recursive: true });
  fs.writeFileSync(handoffRef, JSON.stringify(handoffRecord, null, 2), "utf8");
  const workerPath = path.join(config.ROOT, "control_plane", "codex_executor_worker.js");
  const workerRun = governedSpawnSync({
    command: process.execPath,
    args: [workerPath, handoffRef],
    cwd: config.ROOT,
    timeout_ms: 360000,
    windowsHide: true,
    visible_window: false,
    owner_module: "codex_dispatcher",
    task_id: input.dispatch && input.dispatch.task_id || null,
    workflow_id: input.workflow_id || null,
    singleton_key: `codex_dispatch:${input.job_id}`,
    kill_policy: "timeout_kill",
    rate_limit_exempt: true,
  });
  if (workerRun.status !== "PASS") {
    return {
      status: "FAIL",
      reason: workerRun.reason || (workerRun.result && workerRun.result.error) || "executor_worker_failed",
      handoff_ref: handoffRef,
      worker: workerRun,
    };
  }
  let parsedResult = null;
  try {
    parsedResult = JSON.parse(workerRun.result.stdout || "{}");
  } catch (_) {
    return {
      status: "FAIL",
      reason: "invalid_executor_worker_output",
      handoff_ref: handoffRef,
      worker: workerRun,
    };
  }
  if (parsedResult.status !== "PASS" || !parsedResult.outcome_payload) {
    return {
      status: "FAIL",
      reason: parsedResult.reason || "executor_worker_no_outcome",
      handoff_ref: handoffRef,
      worker: workerRun,
      worker_output: parsedResult,
    };
  }
  return {
    status: "DISPATCHED",
    handoff_ref: handoffRef,
    execution_result: parsedResult.outcome_payload,
    worker: {
      process_id: workerRun.process && workerRun.process.process_id || null,
      pid: workerRun.result && workerRun.result.pid || null,
      stdout_preview: workerRun.result && workerRun.result.stdout_preview || "",
    },
  };
}

module.exports = {
  buildCodexTask,
  handoffDispatchPack,
};
