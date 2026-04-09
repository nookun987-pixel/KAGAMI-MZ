"use strict";

const assert = require("assert");
const fs = require("fs");

const service = require("../commander_service");
const { runLiveOperationScenario } = require("../live_operation_runner");

(async () => {
  const result = await runLiveOperationScenario({
    requested_by: "test_live_operation_proof_flow",
    reviewed_by: "test_live_operation_proof_flow",
  });

  assert.strictEqual(result.status, "PASS");
  assert.ok(result.approval);
  assert.ok(result.executor_job);
  assert.ok(result.result_ingest);
  assert.ok(fs.existsSync(result.proof.artifact_path));
  assert.ok(fs.existsSync(result.friction_report.artifact_path));
  assert.ok(fs.existsSync(result.anomalies.artifact_path));

  const proofs = service.getLiveOperationProofs();
  assert.strictEqual(proofs.status, "PASS");
  assert.ok(proofs.live_operation_proofs.items.some((item) => item.proof.task_id === result.task_id));

  console.log("PASS");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
