"use strict";

function yesNo(value) {
  return value ? "YES" : "NO";
}

function buildProofSummaryMarkdown(proofPack = {}) {
  const lines = [
    "# MIKAGE RUN PROOF",
    "",
    `Run ID: ${proofPack.run_id || "UNKNOWN"}`,
    `Lane: ${proofPack.lane || "unknown"}`,
    `Attempts: ${proofPack.attempts ?? 0}`,
    `Final Status: ${proofPack.final_status || "UNKNOWN"}`,
    `Final Reason: ${proofPack.final_reason || "NONE"}`,
    `Self-Repair Used: ${yesNo(proofPack.self_repair_used)}`,
    `Canon Packet Applied: ${yesNo(proofPack.canon_packet_applied)}`,
    `Cost Used: ${Number(proofPack.cost_used || 0).toFixed(2)}`,
    "",
    "## Key Evidence",
  ];

  const artifacts = Array.isArray(proofPack.artifacts) ? proofPack.artifacts : [];
  const imageArtifact = artifacts.find((artifact) => artifact.type === "image");
  const decisionArtifact = artifacts.find((artifact) => artifact.type === "decision");

  lines.push(`- Final decision file ${decisionArtifact && decisionArtifact.exists ? "exists" : "missing"}`);
  if (imageArtifact && imageArtifact.exists) {
    lines.push("- Output image exists");
  } else {
    lines.push("- No real output image exists");
  }
  lines.push(`- Execution transport ${proofPack.key_signals && proofPack.key_signals.transport_ok ? "succeeded" : "failed"}`);

  if (proofPack.final_status === "ALLOW") {
    lines.push("- Final quality gate allowed the run");
  } else if (proofPack.final_status === "REJECT") {
    lines.push("- Execution completed but final quality gate rejected output");
  } else if (proofPack.final_status === "STOP") {
    lines.push("- Run stopped before approval due to control-plane guard");
  } else {
    lines.push("- Run finished without a successful allow verdict");
  }

  return `${lines.join("\n")}\n`;
}

module.exports = {
  buildProofSummaryMarkdown,
};
