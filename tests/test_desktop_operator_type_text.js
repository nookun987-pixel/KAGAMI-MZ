"use strict";

const assert = require("assert");
const fs = require("fs");
const crypto = require("crypto");
const desktopOperator = require("../control_plane/local_control_agent/desktop_operator");

const text = "hello mikage";
const result = desktopOperator.typeText(
  { text },
  {
    commandId: "desktop_type_text_test",
    uiExecutor: () => ({ status: 0, stdout: "", stderr: "" }),
  }
);

assert.strictEqual(result.status, "PASS");
const report = JSON.parse(fs.readFileSync(result.report_path, "utf8"));
assert.strictEqual(report.action, "desktop.type_text");
assert.strictEqual(report.typed_text_hash, crypto.createHash("sha256").update(text).digest("hex"));
console.log("PASS");
