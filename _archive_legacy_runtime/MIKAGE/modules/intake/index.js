"use strict";

const { routeIntent } = require("../../control_plane/intent_router");
const { createTaskSpec } = require("../../control_plane/task_planner");
const { buildDnaLockPacket } = require("../../../canon_evolution/dna_lock_packet");
const { buildVariationEnvelope } = require("../../../canon_evolution/variation_envelope");
const { generateVariantSpec } = require("../../../canon_evolution/variant_generator");

function run(input, context = {}) {
  const memory = context.memory;
  const laneRegistry = context.laneRegistry || memory.getLaneRegistry();
  const canonMemory = context.canonMemory || memory.getCanonMemory();
  const variantRequest = context.variantRequest || input && typeof input === "object" && input.variant_request || null;
  const intent = routeIntent(input, { laneRegistry });
  const taskSpec = createTaskSpec(intent, {
    sequence: Number.isInteger(context.sequence) ? context.sequence : memory.getNextSequence(context.date || new Date()),
    date: context.date || new Date(),
    memoryHints: memory.getPatternHints(intent),
  });

  taskSpec.context.dominant_reference = canonMemory.dominant_reference || null;
  taskSpec.context.requested_render_mode = Array.isArray(taskSpec.constraints)
    ? (taskSpec.constraints.find((item) => String(item).startsWith("RENDER_MODE:")) || "").split(":")[1] || ""
    : "";

  if (variantRequest && variantRequest.enabled !== false) {
    const dnaLockPacket = buildDnaLockPacket({
      canonMemory,
      lane: taskSpec.lane,
    });
    const variationEnvelope = buildVariationEnvelope({
      variantSlot: variantRequest.variantSlot,
      requested: variantRequest.requestedAxes,
    });
    const variantSpec = generateVariantSpec({
      taskSpec,
      dnaLockPacket,
      variationEnvelope,
      variantFamily: variantRequest.variantFamily || taskSpec.context.requested_render_mode || "HERO_LOCK",
      renderMode: taskSpec.context.requested_render_mode || "",
    });
    taskSpec.context.dna_lock_packet = dnaLockPacket;
    taskSpec.context.variation_envelope = variationEnvelope;
    taskSpec.context.variant_spec = variantSpec;
  }

  return {
    intent,
    taskSpec,
    canonMemory,
    laneRegistry,
    approvedVariantRegistry: context.approvedVariantRegistry || memory.getApprovedVariantRegistry(),
    maxAttempts: Number.isInteger(context.maxAttempts) ? context.maxAttempts : 2,
  };
}

module.exports = {
  run,
};
