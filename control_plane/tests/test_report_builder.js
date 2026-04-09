"use strict";

const assert = require("assert");

const { buildExecutionReport } = require("../report_builder");

const report = buildExecutionReport({
  normalized: {
    job_id: "job_1",
    task_id: "task_1",
    status: "success",
    changed_files: ["x.js"],
    output: "patched x.js",
    error: null,
  },
  next_step: "review_result_in_ui_or_telegram",
});

assert.strictEqual(report.job_id, "job_1");
assert.strictEqual(report.result, "success");
assert.strictEqual(report.next_step, "review_result_in_ui_or_telegram");
console.log("PASS");
