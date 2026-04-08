"use strict";

const { dispatchTask } = require("../../control_plane/lane_dispatcher");
const { createRunRecord, transitionRun } = require("../../control_plane/run_monitor");

async function run(taskSpec, options = {}) {
  let runRecord = createRunRecord(taskSpec);
  runRecord = transitionRun(runRecord, "running");

  const laneResult = await dispatchTask(taskSpec, {
    artifactsRoot: options.artifactsRoot,
    driveRoot: options.driveRoot,
    pollIntervalMs: options.pollIntervalMs,
    timeoutMs: options.timeoutMs,
    staleClaimMs: options.staleClaimMs,
    registry: options.registry,
  });

  runRecord = transitionRun(runRecord, laneResult.status);

  return {
    runRecord,
    laneResult,
  };
}

module.exports = {
  run,
};
