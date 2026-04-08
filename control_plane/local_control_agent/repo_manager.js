"use strict";

const { execSync } = require("child_process");
const { REPO_ROOT } = require("./config");
const { log } = require("./audit_logger");

function run(cmd) {
  return execSync(cmd, { cwd: REPO_ROOT, stdio: "pipe" }).toString();
}

function status() {
  const out = run("git status --porcelain");
  log("repo.status", { out });
  return out;
}

function commit(message) {
  const msg = message || "auto commit";
  run("git add .");
  run("git commit -m \"" + msg + "\"");
  log("repo.commit", { message: msg });
}

function push() {
  run("git push");
  log("repo.push");
}

module.exports = {
  status,
  commit,
  push,
};