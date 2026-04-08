"use strict";

const assert = require("assert");
const { buildBringupChecklist } = require("../control_plane/local_control_agent/bringup_checklist");

const checklist = buildBringupChecklist();
assert.ok(checklist.machine_id);
assert.ok(checklist.node_role);
assert.ok(checklist.checks.repo_root.exists);
assert.ok(Array.isArray(checklist.checks.app_mappings));
assert.strictEqual(typeof checklist.checks.startup_urls.passed, "boolean");
console.log("PASS");
