"use strict";

const fs = require("fs");
const { executeDispatch: executeDevDispatch } = require("./dev_executor_backend");
const { WEB_TASK_TYPES, executeDispatch: executeWebDispatch } = require("./web_ops_backend");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function main() {
  const handoffRef = process.argv[2];
  if (!handoffRef || !fs.existsSync(handoffRef)) {
    process.stdout.write(JSON.stringify({
      status: "FAIL",
      reason: "missing_handoff_ref",
    }));
    process.exit(1);
  }

  const handoff = readJson(handoffRef);
  const dispatch = handoff.dispatch_pack_path && fs.existsSync(handoff.dispatch_pack_path)
    ? readJson(handoff.dispatch_pack_path)
    : null;

  if (!dispatch) {
    process.stdout.write(JSON.stringify({
      status: "FAIL",
      reason: "dispatch_pack_missing",
      job_id: handoff.job_id || null,
      task_id: handoff.task_id || null,
    }));
    process.exit(1);
  }

  const isWebTask = WEB_TASK_TYPES.has(String(dispatch.task_type || "").trim());
  const outcomePayload = isWebTask
    ? await executeWebDispatch(dispatch, handoff)
    : executeDevDispatch(dispatch, handoff);
  const result = {
    status: "PASS",
    executor: isWebTask ? "web_ops_backend" : "dev_executor_backend",
    job_id: handoff.job_id,
    task_id: handoff.task_id || dispatch.task_id || null,
    outcome_payload: outcomePayload,
  };
  process.stdout.write(JSON.stringify(result));
}

main().catch((error) => {
  process.stdout.write(JSON.stringify({
    status: "FAIL",
    reason: error && error.message || "executor_worker_unhandled_error",
  }));
  process.exit(1);
});
