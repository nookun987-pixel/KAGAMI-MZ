"use strict";

const assert = require("assert");
const { commitReviewed } = require("../control_plane/local_control_agent/repo_manager");

try {
  commitReviewed("reviewed commit", []);
  console.error("Expected commitReviewed to fail without files");
  process.exit(1);
} catch (error) {
  assert.ok(String(error.message).includes("reviewed_stage_requires_explicit_files"));
  console.log("PASS");
}
