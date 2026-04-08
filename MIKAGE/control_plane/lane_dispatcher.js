"use strict";

const imageLane = require("../lanes/image/image_executor");
const cineLane = require("../lanes/cine/cine_executor");
const gameLane = require("../lanes/game/game_executor");
const contentLane = require("../lanes/content/content_executor");
const opsLane = require("../lanes/ops/ops_executor");

const DEFAULT_LANE_REGISTRY = {
  image: imageLane,
  cine: cineLane,
  game: gameLane,
  content: contentLane,
  ops: opsLane,
};

function getLaneExecutor(lane, registry = DEFAULT_LANE_REGISTRY) {
  const executor = registry[lane];

  if (!executor || typeof executor.execute !== "function") {
    throw new Error(`No lane executor registered for "${lane}".`);
  }

  return executor;
}

async function dispatchTask(taskSpec, options = {}) {
  if (!taskSpec || !taskSpec.lane) {
    throw new Error("Lane dispatcher requires a task spec with lane.");
  }

  const executor = getLaneExecutor(taskSpec.lane, options.registry || DEFAULT_LANE_REGISTRY);
  return executor.execute(taskSpec, options);
}

module.exports = {
  DEFAULT_LANE_REGISTRY,
  getLaneExecutor,
  dispatchTask,
};
