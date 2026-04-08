"use strict";

const assert = require("assert");
const { resolveNodeRole } = require("../control_plane/node_role");

const commander = resolveNodeRole({ node_role: "commander" });
assert.strictEqual(commander.role_id, "commander");
assert.strictEqual(commander.permissions.reviewed_repo_mutation, true);

const support = resolveNodeRole({ node_role: "support_node" });
assert.strictEqual(support.role_id, "support_node");
assert.strictEqual(support.permissions.reviewed_repo_mutation, false);
console.log("PASS");
