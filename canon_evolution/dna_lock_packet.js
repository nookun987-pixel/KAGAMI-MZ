"use strict";

function dedupe(values) {
  return [...new Set((values || []).filter(Boolean).map((value) => String(value).trim()).filter(Boolean))];
}

function buildDnaLockPacket(context = {}) {
  const canonMemory = context.canonMemory || {};
  const dominantReference = context.dominantReference || canonMemory.dominant_reference || {};
  const sourceJobId = dominantReference.job_id || context.baseArtifactJobId || "MIKAGE_BASE";
  const dnaId = context.baseDnaId || `DNA_${sourceJobId}`;

  return {
    dna_id: dnaId,
    source_job_id: sourceJobId,
    source_lane: context.lane || "image",
    contract_version: "CONTROLLED_EVOLUTION_V1",
    material_dna: dedupe([]
      .concat(dominantReference.material_traits || [])
      .concat([
        "technical ceramic read",
        "matte non-plastic finish",
        "micro-imperfect surface truth",
      ])),
    edge_dna: dedupe([
      "micro erosion on exposed edges",
      "slight irregular bevel",
      "non-uniform edge wear",
    ]),
    silhouette_grammar: dedupe([]
      .concat(dominantReference.silhouette_traits || [])
      .concat([
        "front dominant silhouette",
        "coherent mask proportion logic",
      ])),
    color_law: dedupe(canonMemory.color_law || [
      "restricted charcoal ceramic palette",
      "controlled off-white mineral accent",
    ]),
    identity_anchors: dedupe([]
      .concat(dominantReference.framing_traits || [])
      .concat([
        "engineered ceramic artifact",
        "industrial mounting logic",
        "single subject hero framing",
      ])),
    hard_forbidden_traits: dedupe([]
      .concat(dominantReference.blocked_traits || [])
      .concat([
        "generic product render",
        "white glossy plastic shell",
        "fashion accessory styling",
      ])),
  };
}

module.exports = {
  buildDnaLockPacket,
};
