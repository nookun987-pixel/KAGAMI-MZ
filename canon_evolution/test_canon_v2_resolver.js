"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

test("canon v2 resolver returns scored lane traits in live output shape", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mikage-canon-v2-"));
  process.env.CANON_TRAIT_REGISTRY_PATH = path.join(root, "canon_trait_registry.json");
  fs.writeFileSync(process.env.CANON_TRAIT_REGISTRY_PATH, JSON.stringify({
    version: "2.0.0",
    records: [
      {
        lane: "mask",
        identity_key: "mask::canon",
        identity_keys: ["mask::canon", "mask::canon-b"],
        group: "material",
        trait: "matte black technical ceramic",
        trait_signature: "material::matte black technical ceramic",
        created_at: new Date().toISOString(),
        metrics: {
          support_count: 5,
          success_total: 5,
          readability_total: 5,
          semantic_total: 5,
          canon_alignment_total: 5,
          conflict_count: 0,
        },
      },
      {
        lane: "mask",
        identity_key: "mask::canon",
        identity_keys: ["mask::canon", "mask::canon-b"],
        group: "anti-drift negatives",
        trait: "human face read",
        trait_signature: "anti-drift negatives::human face read",
        created_at: new Date().toISOString(),
        metrics: {
          support_count: 4,
          success_total: 4,
          readability_total: 4,
          semantic_total: 4,
          canon_alignment_total: 4,
          conflict_count: 0,
        },
      }
    ],
  }, null, 2));

  delete require.cache[require.resolve("./canon_v2_resolver")];
  const { resolveCanonV2 } = require("./canon_v2_resolver");
  const resolved = resolveCanonV2({ lane: "MASK_MACRO" });

  assert.equal(resolved.reused, true);
  assert.ok(resolved.dominant_traits.some((entry) => /technical ceramic/i.test(entry.trait)));
  assert.ok(resolved.negative_enforcements.some((entry) => /human face read/i.test(entry.trait)));
  assert.ok(resolved.source_keys.includes("mask::canon"));
});
