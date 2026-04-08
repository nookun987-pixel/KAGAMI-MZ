"use strict";

const fs = require("fs");
const path = require("path");
const config = require("./config");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function runtimeHealth() {
  const entrypoints = readJson(config.ENTRYPOINTS_REGISTRY);
  const paths = [
    path.join(config.ROOT, "start_mikage.bat"),
    path.join(config.ROOT, "MIKAGE", "index.js"),
    path.join(config.ROOT, "runtime", "drive_queue", "runtime.js"),
    path.join(config.ROOT, "runtime", "colab_worker", "colab_one_click_worker.ipynb"),
  ];
  return {
    active_runtime: entrypoints.live_render_path,
    entrypoints: entrypoints.live_entrypoints,
    files_exist: paths.map((filePath) => ({
      path: filePath,
      exists: fs.existsSync(filePath),
    })),
  };
}

module.exports = {
  runtimeHealth,
};
