"use strict";

const fs = require("fs");
const path = require("path");

const REGISTRY_PATH = path.join(__dirname, "tool_schema_registry.json");

function readRegistry() {
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
}

function isTypeMatch(value, expected) {
  if (expected === "string") return typeof value === "string";
  if (expected === "number") return typeof value === "number" && Number.isFinite(value);
  if (expected === "boolean") return typeof value === "boolean";
  if (expected === "string[]") return Array.isArray(value) && value.every((item) => typeof item === "string");
  if (expected === "object[]") return Array.isArray(value) && value.every((item) => item && typeof item === "object" && !Array.isArray(item));
  if (expected === "object") return !!value && typeof value === "object" && !Array.isArray(value);
  return false;
}

function validateToolCommand(command) {
  const registry = readRegistry();
  const entry = registry[String(command.action || "")];
  if (!entry) {
    return {
      valid: false,
      tool_type: "unknown",
      reason: "tool_not_registered",
      schema: null,
    };
  }
  const payload = command.payload || {};
  for (const [field, expected] of Object.entries(entry.input_schema || {})) {
    if (!(field in payload)) {
      return {
        valid: false,
        tool_type: entry.type || "unknown",
        reason: `missing_field:${field}`,
        schema: entry,
      };
    }
    if (!isTypeMatch(payload[field], expected)) {
      return {
        valid: false,
        tool_type: entry.type || "unknown",
        reason: `invalid_field_type:${field}:${expected}`,
        schema: entry,
      };
    }
  }
  return {
    valid: true,
    tool_type: entry.type || "unknown",
    reason: "schema_valid",
    schema: entry,
  };
}

module.exports = {
  REGISTRY_PATH,
  readRegistry,
  validateToolCommand,
};
