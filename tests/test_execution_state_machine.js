"use strict";

const assert = require("assert");

const {
  createExecutionStateRecord,
  transitionExecutionState,
} = require("../control_plane/execution_state_machine");

let record = createExecutionStateRecord({
  task_id: "task_alpha",
  action: "repo.status",
  requested_by: "test",
});
record = transitionExecutionState(record, "planned");
record = transitionExecutionState(record, "approved");
record = transitionExecutionState(record, "executing");
record = transitionExecutionState(record, "done");

assert.strictEqual(record.state, "done");
assert.strictEqual(record.history.length, 5);

let threw = false;
try {
  transitionExecutionState(record, "planned");
} catch (error) {
  threw = /invalid_transition/.test(error.message);
}
assert.strictEqual(threw, true);

console.log("PASS");
