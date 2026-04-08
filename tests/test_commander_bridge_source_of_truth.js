"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const runtime = JSON.parse(fs.readFileSync(path.join(ROOT, "state", "system_entrypoints.json"), "utf8"));
assert.strictEqual(runtime.live_entrypoints[0].path, "start_mikage.bat");
assert.strictEqual(runtime.live_render_path.queue_runtime, "runtime/drive_queue/runtime.js");
assert.strictEqual(runtime.live_render_path.worker_path, "runtime/colab_worker/colab_one_click_worker.ipynb");
console.log("PASS");
