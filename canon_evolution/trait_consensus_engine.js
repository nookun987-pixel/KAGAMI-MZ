"use strict";

function computeConsensusWeight(record = {}) {
  const metrics = record && record.metrics || {};
  const supportCount = Math.max(1, Number(metrics.support_count || record.support_count || 0));
  const identities = Array.isArray(record.identity_keys) ? record.identity_keys : [record.identity_key].filter(Boolean);
  const uniqueIdentities = new Set(identities).size;
  return Math.max(0, Math.min(1, uniqueIdentities / supportCount));
}

module.exports = {
  computeConsensusWeight,
};
