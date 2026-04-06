"use strict";

function safeClone(value, fallback = null) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_) {
    return fallback;
  }
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
}

function normalizeArtifacts(raw = {}) {
  const artifacts = [];
  const directArtifacts = toArray(raw.artifacts);
  for (const artifact of directArtifacts) {
    if (artifact && artifact.type && artifact.path) {
      artifacts.push({ type: artifact.type, path: artifact.path });
    }
  }

  const outputFile = raw.output_file_path || raw.output_file || (raw.best_candidate && raw.best_candidate.output_path) || raw.path;
  if (outputFile) {
    artifacts.push({ type: "image", path: outputFile });
  }

  return artifacts;
}

function normalizeExecutionResponse(rawResponse, packet = {}) {
  const raw = safeClone(rawResponse, null);
  if (!raw || typeof raw !== "object") {
    return {
      status: "FAIL",
      transport_ok: true,
      execution_ok: false,
      result_type: null,
      artifacts: [],
      raw_response_present: raw !== null,
      raw_response: raw,
      error_type: "MALFORMED_RESPONSE",
      error_reason: "response is not a structured object",
      run_id: packet.run_id || null,
      attempt: packet.attempt || null,
      target: packet.target || null,
    };
  }

  const artifacts = normalizeArtifacts(raw);
  const successLike = raw.status === "SUCCESS" || raw.status === "DONE" || raw.decision === "ALLOW" || raw.execution_ok === true;
  const failureLike = raw.status === "FAIL" || raw.status === "FAILED" || raw.decision === "REJECT" || raw.execution_ok === false;

  if (successLike && artifacts.length === 0) {
    return {
      status: "FAIL",
      transport_ok: true,
      execution_ok: false,
      result_type: raw.result_type || null,
      artifacts: [],
      raw_response_present: true,
      raw_response: raw,
      error_type: "MALFORMED_RESPONSE",
      error_reason: "missing artifacts",
      run_id: packet.run_id || null,
      attempt: packet.attempt || null,
      target: packet.target || null,
    };
  }

  if (failureLike) {
    return {
      status: "FAIL",
      transport_ok: true,
      execution_ok: false,
      result_type: raw.result_type || null,
      artifacts: artifacts,
      raw_response_present: true,
      raw_response: raw,
      error_type: "EXECUTION_FAILURE",
      error_reason: raw.error || raw.error_reason || raw.reason || "backend returned failed status",
      run_id: packet.run_id || null,
      attempt: packet.attempt || null,
      target: packet.target || null,
    };
  }

  if (!successLike) {
    return {
      status: "FAIL",
      transport_ok: true,
      execution_ok: false,
      result_type: raw.result_type || null,
      artifacts: artifacts,
      raw_response_present: true,
      raw_response: raw,
      error_type: "MALFORMED_RESPONSE",
      error_reason: "unrecognized execution response",
      run_id: packet.run_id || null,
      attempt: packet.attempt || null,
      target: packet.target || null,
    };
  }

  return {
    status: "SUCCESS",
    transport_ok: true,
    execution_ok: true,
    result_type: raw.result_type || "image_generation",
    artifacts,
    raw_response_present: true,
    raw_response: raw,
    error_type: null,
    error_reason: null,
    run_id: packet.run_id || null,
    attempt: packet.attempt || null,
    target: packet.target || null,
  };
}

module.exports = {
  normalizeExecutionResponse,
};
