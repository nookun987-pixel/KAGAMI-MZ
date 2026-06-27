"use strict";

const path = require("path");

const { ensureDir, writeJson, nowIso } = require("../shared/utils/fs_utils");

function createStubLane(laneName) {
  async function execute(taskSpec, options = {}) {
    const artifactsRoot = options.artifactsRoot
      || path.resolve(__dirname, "..", "shared", "memory", "artifacts", laneName, taskSpec.job_id);

    ensureDir(artifactsRoot);

    const planReceiptPath = path.join(artifactsRoot, `${laneName}_plan_receipt.json`);
    writeJson(planReceiptPath, {
      lane: laneName,
      job_id: taskSpec.job_id,
      objective: taskSpec.objective,
      created_at: nowIso(),
      status: "waiting_for_real_executor",
    });

    return {
      status: "waiting",
      artifacts: [
        {
          type: "plan_receipt",
          label: `${laneName}_plan_receipt`,
          path: planReceiptPath,
        },
      ],
      validator_result: {
        passed: false,
        issues: [`${laneName} lane executor is scaffolded but not connected to a real runtime yet.`],
      },
      summary: `${laneName} lane accepted the task but is waiting for a real executor.`,
    };
  }

  return { execute };
}

module.exports = { createStubLane };
