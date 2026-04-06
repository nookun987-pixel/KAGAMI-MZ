"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

function setupEnv() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mikage-canon-"));
  process.env.CANON_GENERALIZATION_REGISTRY_PATH = path.join(root, "memory", "canon_generalization_registry.json");
  return root;
}

function clearModuleCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.includes("\\canon\\")) {
      delete require.cache[key];
    }
  }
}

function loadModules() {
  clearModuleCache();
  return {
    registry: require("./canon_case_registry"),
    generalizer: require("./canon_generalizer"),
    compiler: require("./canon_rule_compiler"),
  };
}

function buildEvidence() {
  return [
    {
      run_id: "RUN-001",
      status: "approved",
      lane: "mask",
      traits: {
        material: ["matte technical ceramic", "micro-pitted surface"],
        identity: ["faceless sacred mask read"],
        silhouette: ["clean primary object read"],
        composition: ["single focal subject", "clear object readability"],
      },
    },
    {
      run_id: "RUN-002",
      status: "approved",
      lane: "mask",
      traits: {
        material: ["matte technical ceramic"],
        identity: ["faceless sacred mask read"],
        silhouette: ["clean primary object read"],
        composition: ["single focal subject"],
      },
    },
    {
      run_id: "RUN-003",
      status: "approved",
      lane: "weapon",
      traits: {
        material: ["matte technical ceramic"],
        identity: ["engineered manufactured object read"],
        silhouette: ["clean primary object read"],
        composition: ["clear object readability"],
      },
    },
    {
      run_id: "RUN-004",
      status: "rejected",
      lane: "mask",
      reject_patterns: ["plastic gloss", "fragmented composition"],
    },
    {
      run_id: "RUN-005",
      status: "rejected",
      lane: "mask",
      reject_patterns: ["plastic gloss", "fragmented composition"],
    },
    {
      run_id: "RUN-006",
      status: "rejected",
      lane: "weapon",
      reject_patterns: ["plastic gloss"],
    },
    {
      run_id: "RUN-007",
      status: "approved",
      lane: "environment",
      traits: {
        material: ["weathered stone"],
        identity: ["architectural backdrop"],
        silhouette: ["broad scene read"],
        composition: ["deep environment framing"],
      },
    },
  ];
}

test("TEST 1: approved evidence creates positive canon traits", () => {
  setupEnv();
  const { generalizer } = loadModules();
  const result = generalizer.generalizeCanonEvidence(buildEvidence());
  const maskRecord = result.records.find((record) => record.scope === "lane" && record.lane === "mask");

  assert.equal(result.ok, true);
  assert.equal(maskRecord.traits.material.includes("matte technical ceramic"), true);
  assert.equal(maskRecord.traits.silhouette.includes("clean primary object read"), true);
});

test("TEST 2: repeated failures create negative canon traits", () => {
  setupEnv();
  const { generalizer } = loadModules();
  const result = generalizer.generalizeCanonEvidence(buildEvidence());
  const maskRecord = result.records.find((record) => record.scope === "lane" && record.lane === "mask");

  assert.equal(maskRecord.negative_traits.includes("plastic gloss"), true);
  assert.equal(maskRecord.negative_traits.includes("fragmented composition"), true);
});

test("TEST 3: lane-specific canon stays isolated", () => {
  setupEnv();
  const { generalizer } = loadModules();
  const result = generalizer.generalizeCanonEvidence(buildEvidence());
  const maskRecord = result.records.find((record) => record.scope === "lane" && record.lane === "mask");
  const weaponRecord = result.records.find((record) => record.scope === "lane" && record.lane === "weapon");

  assert.equal(maskRecord.traits.identity.includes("faceless sacred mask read"), true);
  assert.equal(maskRecord.traits.identity.includes("engineered manufactured object read"), false);
  assert.equal(weaponRecord.traits.identity.includes("engineered manufactured object read"), true);
});

test("TEST 4: cross-lane canon only includes recurring traits", () => {
  setupEnv();
  const { generalizer } = loadModules();
  const result = generalizer.generalizeCanonEvidence(buildEvidence());
  const crossLane = result.records.find((record) => record.scope === "cross-lane");

  assert.equal(crossLane.traits.material.includes("matte technical ceramic"), true);
  assert.equal(crossLane.traits.material.includes("weathered stone"), false);
  assert.equal(crossLane.traits.silhouette.includes("clean primary object read"), true);
});

test("TEST 5: compiled canon packet returns structured positive/negative rules", () => {
  setupEnv();
  const { generalizer, compiler } = loadModules();
  const result = generalizer.generalizeCanonEvidence(buildEvidence());
  const packet = compiler.compileCanonPacket({ lane: "mask" }, result.records);

  assert.equal(Array.isArray(packet.positive_rules), true);
  assert.equal(Array.isArray(packet.negative_rules), true);
  assert.equal(packet.positive_rules.some((rule) => /Preserve matte technical ceramic/i.test(rule)), true);
  assert.equal(packet.negative_rules.some((rule) => /Reject plastic gloss/i.test(rule)), true);
});

test("TEST 6: generalized canon persists to registry", () => {
  setupEnv();
  const { generalizer, registry } = loadModules();
  generalizer.generalizeCanonEvidence(buildEvidence(), { persist: true });
  const stored = registry.readCanonCaseRegistry();

  assert.equal(stored.length >= 3, true);
  assert.equal(stored.some((entry) => entry.scope === "cross-lane"), true);
});

test("TEST 7: future run query resolves correct canon packet", () => {
  setupEnv();
  const { generalizer, compiler, registry } = loadModules();
  generalizer.generalizeCanonEvidence(buildEvidence(), { persist: true });
  const queried = registry.queryCanonCases({ lane: "mask" });
  const packet = compiler.compileCanonPacket({ lane: "mask" }, queried);

  assert.equal(packet.scope, "lane+cross-lane");
  assert.equal(packet.source_count >= 3, true);
  assert.equal(packet.positive_traits.material.includes("matte technical ceramic"), true);
});

test("TEST 8: unrelated lane evidence does not pollute another lane packet", () => {
  setupEnv();
  const { generalizer, compiler } = loadModules();
  const result = generalizer.generalizeCanonEvidence(buildEvidence());
  const packet = compiler.compileCanonPacket({ lane: "mask" }, result.records);

  assert.equal(packet.positive_rules.some((rule) => /weathered stone/i.test(rule)), false);
  assert.equal(packet.positive_rules.some((rule) => /architectural backdrop/i.test(rule)), false);
});
