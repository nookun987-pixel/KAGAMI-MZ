"use strict";

function toNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function inferLane(context = {}) {
  return String(
    context.lane ||
    context.shot_type ||
    (context.render_spec && context.render_spec.shot_type) ||
    "unknown"
  ).trim() || "unknown";
}

function buildExecutionPacket(context = {}, options = {}) {
  const run_id = context.run_id || context.job_id || "RUN-UNKNOWN";
  const attempt = Math.max(1, toNumber(
    options.attempt ?? context.attempt ?? context.attempt_count,
    1
  ));
  const lane = inferLane(context);
  const target = String(options.target || context.execution_target || context.target || process.env.MIKAGE_EXECUTION_TARGET || "orchestrator_local");
  const spec = {
    prompt: context.prompt || context.positive_prompt || context.structured_prompt || context.user_idea || "",
    negative_prompt: context.negative_prompt || "",
    job_payload: context.job_payload || context.original_job || context,
  };
  const canon_packet = context.canon_packet || context.generalized_canon_packet || null;

  return {
    run_id,
    attempt,
    lane,
    target,
    spec,
    canon_packet,
    metadata: {
      caller: options.caller || context.caller || "mikage-control-plane",
      timestamp: options.timestamp || context.timestamp || new Date().toISOString(),
    },
  };
}

module.exports = {
  buildExecutionPacket,
};
