"use strict";

const { createTask } = require("./task_writer");
const repo = require("./repo_manager");
const { runCodex } = require("./codex_dispatcher");

async function handle(command) {
  if (command.startsWith("repo status")) {
    return repo.status();
  }

  if (command.startsWith("repo commit")) {
    repo.commit(command.replace("repo commit", "").trim());
    return "committed";
  }

  if (command.startsWith("repo push")) {
    repo.push();
    return "pushed";
  }

  if (command.startsWith("build")) {
    const task = createTask(command);
    const result = await runCodex(task);
    return result;
  }

  return "unknown command";
}

module.exports = { handle };