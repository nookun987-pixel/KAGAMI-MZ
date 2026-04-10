"use strict";

function buildDevExecutorSmokeHelper(taskId = "task_1775686148244") {
  return {
    taskId,
    label: "dev-executor-smoke-helper",
    status: "ready",
    validationMode: "bounded",
    allowedTargets: ["tests/dev_executor_generated_helper.js"],
  };
}

function isValidDevExecutorSmokeHelper(candidate) {
  return Boolean(
    candidate &&
    typeof candidate === "object" &&
    typeof candidate.taskId === "string" &&
    candidate.label === "dev-executor-smoke-helper" &&
    candidate.status === "ready" &&
    candidate.validationMode === "bounded" &&
    Array.isArray(candidate.allowedTargets) &&
    candidate.allowedTargets.includes("tests/dev_executor_generated_helper.js")
  );
}

function createValidatedDevExecutorSmokeHelper(taskId) {
  const helper = buildDevExecutorSmokeHelper(taskId);
  if (!isValidDevExecutorSmokeHelper(helper)) {
    throw new Error("dev executor smoke helper validation failed");
  }
  return helper;
}

module.exports = {
  buildDevExecutorSmokeHelper,
  isValidDevExecutorSmokeHelper,
  createValidatedDevExecutorSmokeHelper,
};

if (require.main === module) {
  const helper = createValidatedDevExecutorSmokeHelper();
  console.log(JSON.stringify(helper, null, 2));
}
