"use strict";

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { CODEX_COMMAND, CODEX_ARGS, TASK_ROOT } = require("./config");
const { log } = require("./audit_logger");

function runCodex(task) {
  const promptFile = path.join(TASK_ROOT, `${task.id}.prompt.txt`);
  fs.writeFileSync(promptFile, task.prompt);

  return new Promise((resolve) => {
    const proc = spawn(CODEX_COMMAND, [...CODEX_ARGS, promptFile], {
      shell: true,
    });

    let output = "";
    proc.stdout.on("data", (d) => (output += d.toString()));
    proc.stderr.on("data", (d) => (output += d.toString()));

    proc.on("close", () => {
      log("codex.run", { task: task.id });
      resolve(output);
    });
  });
}

module.exports = { runCodex };