const fs = require("fs");
const path = require("path");

function repoPath(relativePath) {
  return path.join(process.cwd(), relativePath);
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function existsAny(relativePaths) {
  return relativePaths.some(exists);
}

describe("MIKAGE system invariants", () => {
  test("source of truth registry exists", () => {
    expect(exists("system/source_of_truth_registry.json")).toBe(true);
  });

  test("pre-edit plan template exists", () => {
    expect(exists("system/templates/pre_edit_plan.md")).toBe(true);
  });

  test("agent task gate exists", () => {
    expect(exists("system/agent_task_gate.md")).toBe(true);
  });

  test("execution lane playbook exists", () => {
    expect(exists("system/playbooks/playbook_execution_lane.md")).toBe(true);
  });

  test("artifact contract playbook exists", () => {
    expect(exists("system/playbooks/playbook_artifact_contract.md")).toBe(true);
  });

  test("canon validation playbook exists", () => {
    expect(exists("system/playbooks/playbook_canon_validation.md")).toBe(true);
  });

  test("execution lane canonical file exists", () => {
    expect(exists("core/execution_lane_router.js")).toBe(true);
  });

  test("artifact contract canonical files exist", () => {
    expect(exists("core/runtime/artifact_metadata_normalizer.js")).toBe(true);
    expect(exists("integrations/google/gcs_artifact_store.js")).toBe(true);
  });

  test("canon contract files exist", () => {
    expect(existsAny([
      "CANON_V2.md",
      "docs/architecture/MIKAGE_ZENITH_CANON_V2.md",
      "artifacts/exports/grapuco_system_review/02_CANON_AND_RULES/MIKAGE_ZENITH_CANON_V2.md"
    ])).toBe(true);
    expect(existsAny([
      "STRUCTURED_RULES.json",
      "canon/rules/MIKAGE_STRUCTURED_RULES.json",
      "artifacts/exports/grapuco_system_review/02_CANON_AND_RULES/MIKAGE_STRUCTURED_RULES.json"
    ])).toBe(true);
    expect(existsAny([
      "PASS_FAIL_CHECKLIST.md",
      "docs/architecture/MIKAGE_PASS_FAIL_CHECKLIST.md",
      "artifacts/exports/grapuco_system_review/02_CANON_AND_RULES/MIKAGE_PASS_FAIL_CHECKLIST.md"
    ])).toBe(true);
  });

  test("docs are not treated as canonical truth in registry", () => {
    const registry = JSON.parse(read("system/source_of_truth_registry.json"));

    for (const domain of Object.values(registry.domains)) {
      expect(domain.forbidden_as_truth).toContain("README.md");
    }
  });

  test("global rules enforce code-first behavior", () => {
    const registry = JSON.parse(read("system/source_of_truth_registry.json"));

    expect(registry.global_rules).toContain("CODE_FIRST_DOCS_AFTER");
    expect(registry.global_rules).toContain("NO_DOCS_AS_SOURCE_OF_TRUTH");
  });

  test("execution router exposes known lane marker", () => {
    if (!exists("core/execution_lane_router.js")) {
      return;
    }

    const src = read("core/execution_lane_router.js");
    expect(src.includes("vertex_imagen")).toBe(true);
  });

  test("no-image-no-pass guard remains represented in orchestration layer", () => {
    const candidateFiles = [
      "core/orchestration/orchestrator.js",
      "render/image_loop/run_and_proof.js",
      "render/image_loop/run_strict_loop_proof.js"
    ].filter(exists);

    const combined = candidateFiles.map(read).join("\n");

    const hasGuard =
      combined.includes("NO IMAGE = NO PASS") ||
      combined.includes("no real image on disk") ||
      combined.includes("output.png");

    expect(hasGuard).toBe(true);
  });
});
