"use strict";

const assert = require("assert");

const { recordStabilityAnomaly, readStabilityAnomalyRegistry, collectProofAnomalies } = require("../stability_anomaly_registry");

const taskId = `task_anomaly_${Date.now()}`;
const proof = {
  workflow_id: `task_${taskId}`,
  task_id: taskId,
  final_verdict: "PASS",
  refs: ["proof_ref"],
  approval_item: { reason: "approval_required" },
};

const anomalies = collectProofAnomalies({
  proof,
  workflow_summary: { current_stage: "failed" },
  status_view: { latest_task_runs: {}, latest_executor_jobs: {} },
  lifecycle: { events: [{ stage: "planned", status: "PASS" }, { stage: "planned", status: "PASS" }] },
});
assert.ok(anomalies.length >= 3);

const first = recordStabilityAnomaly(anomalies[0]);
const second = recordStabilityAnomaly(anomalies[0]);
assert.strictEqual(first.anomaly_id, second.anomaly_id);
assert.ok(second.count >= 2);

const registry = readStabilityAnomalyRegistry();
assert.ok(Array.isArray(registry.anomalies));
assert.ok(registry.anomalies.some((item) => item.anomaly_id === first.anomaly_id));

console.log("PASS");
