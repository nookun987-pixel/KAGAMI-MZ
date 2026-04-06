/**
 * MIKAGE — /render/render.test.js
 * Combined test suite for vram_manager.js + render_executor.js
 * Run: node render/render.test.js
 */

"use strict";

const vram = require("./vram_manager");
const executor = require("./render_executor");
const { issueToken } = require("../control/precheck");

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, label) {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(label);
    console.error(`  FAIL: ${label}`);
  }
}

function assertThrows(fn, errorType, label) {
  try {
    fn();
    failed++;
    failures.push(`${label} (no throw)`);
    console.error(`  FAIL: ${label} — expected throw`);
  } catch (e) {
    if (e instanceof errorType) {
      passed++;
    } else {
      failed++;
      failures.push(`${label} (wrong: ${e.name})`);
      console.error(`  FAIL: ${label} — expected ${errorType.name}, got ${e.name}: ${e.message}`);
    }
  }
}

// ===================================================================
// Mock shell executor — no real GPU commands
// ===================================================================

const mockShell = {
  commands: [],
  exec(cmd) {
    this.commands.push(cmd);
    return "";
  },
  reset() {
    this.commands = [];
  },
};

// Install mock before all tests
vram.setShellExecutor(mockShell);

// Helper: reset VRAM to clean state
function resetVRAM() {
  vram.forceReset("test reset");
  mockShell.reset();
}

// ===================================================================
// Test fixture: normalized spec
// ===================================================================

const TEST_SPEC = {
  subject: "Mikage Zenith, fully mechanical humanoid, strict hard-surface anatomy",
  lighting: ["chiaroscuro 4:1", "single key light from above 45 degrees"],
  texture: ["matte B4C ceramic", "gold kintsugi seams"],
  composition_rules: ["negative space >= 40%", "wide establishing 2.76:1", "film grain present"],
  negative_prompt: ["anime", "plastic skin", "organic softness", "curved blade"],
};

// ===================================================================
console.log("\n=== VRAM — INITIAL STATE ===");
// ===================================================================

resetVRAM();

{
  const lock = vram.getResourceLock();
  assert(lock.ollama_active === false, "Initial: ollama inactive");
  assert(lock.fooocus_active === false, "Initial: fooocus inactive");
  assert(lock.parallel_allowed === false, "Parallel always false");
  assert(lock.phase === "IDLE", "Initial phase: IDLE");
}

// ===================================================================
console.log("\n=== VRAM — LOAD / UNLOAD OLLAMA ===");
// ===================================================================

resetVRAM();

{
  const loadResult = vram.loadModel("OLLAMA", "test_001");
  assert(loadResult.action === "LOAD", "Load action");
  assert(loadResult.model === "OLLAMA", "Load model OLLAMA");
  assert(loadResult.env.OLLAMA_KEEP_ALIVE === "0", "KEEP_ALIVE=0 enforced");

  const lock = vram.getResourceLock();
  assert(lock.ollama_active === true, "Ollama now active");
  assert(lock.phase === "OLLAMA_ACTIVE", "Phase: OLLAMA_ACTIVE");

  const unloadResult = vram.unloadModel("OLLAMA");
  assert(unloadResult.action === "UNLOAD", "Unload action");

  const lock2 = vram.getResourceLock();
  assert(lock2.ollama_active === false, "Ollama now inactive");
}

// ===================================================================
console.log("\n=== VRAM — LOAD / UNLOAD FOOOCUS ===");
// ===================================================================

resetVRAM();

{
  // Must go through Ollama phase first to reach FOOOCUS-eligible state
  // Or use forceReset + direct phase manipulation
  // Since FOOOCUS_LOADING requires prior clearing, let's do full sequence

  // Simulate: Ollama phase complete, now load Fooocus
  vram.loadModel("OLLAMA", "test_002");
  vram.unloadModel("OLLAMA");
  vram.clearVRAM("PRE_RENDER");

  // Skip zombie check for direct test — transition to FOOOCUS_LOADING
  const lock0 = vram.getResourceLock();
  assert(lock0.phase === "CLEARING_PRE_RENDER", "At CLEARING_PRE_RENDER");

  // Zombie check transitions to ZOMBIE_CHECK_PRE → then FOOOCUS_LOADING
  vram.zombieCheckpoint("PRE");

  const loadResult = vram.loadModel("FOOOCUS", "test_002");
  assert(loadResult.action === "LOAD", "Load Fooocus");
  assert(loadResult.model === "FOOOCUS", "Model is FOOOCUS");

  const lock = vram.getResourceLock();
  assert(lock.fooocus_active === true, "Fooocus active");
  assert(lock.ollama_active === false, "Ollama still inactive");

  const unloadResult = vram.unloadModel("FOOOCUS");
  assert(unloadResult.action === "UNLOAD", "Unload Fooocus");
}

// ===================================================================
console.log("\n=== VRAM — PARALLEL FORBIDDEN ===");
// ===================================================================

resetVRAM();

{
  vram.loadModel("OLLAMA", "test_003");

  assertThrows(
    () => vram.loadModel("FOOOCUS", "test_003"),
    vram.VRAMConflictError,
    "Cannot load Fooocus while Ollama active"
  );
}

resetVRAM();

{
  // Get to Fooocus phase
  vram.loadModel("OLLAMA", "test_004");
  vram.unloadModel("OLLAMA");
  vram.clearVRAM("PRE_RENDER");
  vram.zombieCheckpoint("PRE");
  vram.loadModel("FOOOCUS", "test_004");

  assertThrows(
    () => vram.loadModel("OLLAMA", "test_004"),
    vram.VRAMConflictError,
    "Cannot load Ollama while Fooocus active"
  );
}

// ===================================================================
console.log("\n=== VRAM — DOUBLE LOAD FORBIDDEN ===");
// ===================================================================

resetVRAM();

{
  vram.loadModel("OLLAMA", "test_005");

  assertThrows(
    () => vram.loadModel("OLLAMA", "test_005"),
    vram.VRAMConflictError,
    "Cannot double-load Ollama"
  );
}

// ===================================================================
console.log("\n=== VRAM — UNLOAD WITHOUT LOAD ===");
// ===================================================================

resetVRAM();

{
  assertThrows(
    () => vram.unloadModel("OLLAMA"),
    vram.VRAMConflictError,
    "Cannot unload Ollama that is not loaded"
  );
}

// ===================================================================
console.log("\n=== VRAM — CLEAR VRAM ===");
// ===================================================================

resetVRAM();

{
  vram.loadModel("OLLAMA", "test_006");
  vram.unloadModel("OLLAMA");

  const clearResult = vram.clearVRAM("PRE_RENDER");
  assert(clearResult.action === "CLEAR_VRAM", "Clear action");
  assert(clearResult.stage === "PRE_RENDER", "Stage is PRE_RENDER");

  const lock = vram.getResourceLock();
  assert(lock.last_cleared_at !== null, "last_cleared_at set");
}

// ===================================================================
console.log("\n=== VRAM — ZOMBIE DETECTION ===");
// ===================================================================

resetVRAM();

{
  // Mock nvidia-smi returning a zombie ollama process
  const zombieShell = {
    commands: [],
    exec(cmd) {
      this.commands.push(cmd);
      if (cmd.includes("nvidia-smi --query")) {
        return "12345, ollama_runner, 4096 MiB";
      }
      if (cmd.includes("ollama ps")) {
        return "";  // No models running according to ollama
      }
      return "";
    },
  };
  vram.setShellExecutor(zombieShell);

  const detection = vram.detectZombies();
  assert(detection.found === true, "Zombie detected");
  assert(detection.zombies.length > 0, "Zombie process listed");
  assert(detection.zombies[0].pid === "12345", "Correct PID");

  const killResult = vram.killZombies(detection.zombies);
  assert(killResult.killed === 1, "1 zombie killed");
  assert(killResult.pids.includes("12345"), "Correct PID killed");
  assert(zombieShell.commands.some((c) => c.includes("kill -9 12345")), "Kill command issued");

  // Restore mock
  vram.setShellExecutor(mockShell);
}

// ===================================================================
console.log("\n=== VRAM — NO ZOMBIES ===");
// ===================================================================

resetVRAM();

{
  const detection = vram.detectZombies();
  assert(detection.found === false, "No zombies when shell returns empty");
  assert(detection.zombies.length === 0, "Empty zombie list");
}

// ===================================================================
console.log("\n=== VRAM — RESOURCE CONFLICT CHECK ===");
// ===================================================================

resetVRAM();

{
  const check1 = vram.checkResourceConflict();
  assert(check1.conflict === false, "No conflict when idle");

  vram.loadModel("OLLAMA", "test_007");
  const check2 = vram.checkResourceConflict();
  assert(check2.conflict === true, "Conflict when busy");
  assert(check2.reason.includes("test_007"), "Reason includes job id");
}

// ===================================================================
console.log("\n=== VRAM — FORCE RESET ===");
// ===================================================================

{
  // Don't reset first — leave in dirty state
  const resetResult = vram.forceReset("emergency cleanup");
  assert(resetResult.action === "FORCE_RESET", "Force reset action");
  assert(resetResult.reason === "emergency cleanup", "Reset reason");

  const lock = vram.getResourceLock();
  assert(lock.phase === "IDLE", "Phase reset to IDLE");
  assert(lock.ollama_active === false, "Ollama cleared");
  assert(lock.fooocus_active === false, "Fooocus cleared");
}

// ===================================================================
console.log("\n=== VRAM — FULL LIFECYCLE (beginOllamaPhase + beginFooocusPhase) ===");
// ===================================================================

resetVRAM();

{
  // Ollama phase
  const ollamaPhase = vram.beginOllamaPhase("test_lifecycle");
  assert(ollamaPhase.steps.length > 0, "Ollama phase has load step");

  const lock1 = vram.getResourceLock();
  assert(lock1.ollama_active === true, "Ollama active during phase");

  // Simulate: translation happens here
  // ...

  // Complete Ollama phase
  const ollamaCompleteSteps = ollamaPhase.complete();
  assert(ollamaCompleteSteps.length >= 2, "Ollama complete has unload + clear + zombie steps");

  const lock2 = vram.getResourceLock();
  assert(lock2.ollama_active === false, "Ollama inactive after complete");

  // Fooocus phase
  const fooocusPhase = vram.beginFooocusPhase("test_lifecycle");
  assert(fooocusPhase.steps.length > 0, "Fooocus phase has load step");

  const lock3 = vram.getResourceLock();
  assert(lock3.fooocus_active === true, "Fooocus active during phase");

  // Simulate: render happens here
  // ...

  // Complete Fooocus phase
  const fooocusCompleteSteps = fooocusPhase.complete();
  assert(fooocusCompleteSteps.length >= 2, "Fooocus complete has unload + clear + zombie steps");

  const lock4 = vram.getResourceLock();
  assert(lock4.fooocus_active === false, "Fooocus inactive after complete");
  assert(lock4.phase === "IDLE", "Back to IDLE after full lifecycle");
}

// ===================================================================
console.log("\n=== VRAM — beginFooocusPhase BLOCKED BY OLLAMA ===");
// ===================================================================

resetVRAM();

{
  vram.loadModel("OLLAMA", "test_block");

  assertThrows(
    () => vram.beginFooocusPhase("test_block"),
    vram.VRAMConflictError,
    "Fooocus phase blocked while Ollama active"
  );

  vram.forceReset("cleanup");
}

// ===================================================================
console.log("\n=== EXECUTOR — TOKEN ENFORCEMENT ===");
// ===================================================================

{
  const token = issueToken("test_exec_001");

  // Valid token + matching job
  executor.enforceToken(token, "test_exec_001");
  passed++;
  // If we got here, no throw = pass

  // No token
  assertThrows(
    () => executor.enforceToken(null, "test_exec_001"),
    executor.RenderTokenError,
    "Null token throws"
  );

  // Wrong job_id
  assertThrows(
    () => executor.enforceToken(token, "wrong_job_id"),
    executor.RenderTokenError,
    "Mismatched job_id throws"
  );

  // Expired token
  const expiredToken = {
    ...token,
    issued_at: new Date(Date.now() - 400000).toISOString(),
    expires_in: 300,
  };
  assertThrows(
    () => executor.enforceToken(expiredToken, "test_exec_001"),
    executor.RenderTokenError,
    "Expired token throws"
  );
}

// ===================================================================
console.log("\n=== EXECUTOR — buildRenderPacket ===");
// ===================================================================

{
  const translation = {
    positive_prompt: "Mikage Zenith, porcelain armor, chiaroscuro 4:1",
    negative_prompt: "anime, plastic skin, organic softness",
  };

  const packet = executor.buildRenderPacket(translation, {
    seed: 42,
    width: 1024,
    height: 384,
    performance: "Quality",
    attempt: 1,
  });

  assert(packet.engine === "fooocus", "Engine is fooocus");
  assert(packet.prompt === translation.positive_prompt, "Prompt from translation");
  assert(packet.negative_prompt === translation.negative_prompt, "Negative from translation");
  assert(packet.seed === 42, "Seed passed through");
  assert(packet.width === 1024, "Width set");
  assert(packet.height === 384, "Height set (2.76:1)");
  assert(packet.performance === "Quality", "Performance mode");
  assert(Array.isArray(packet.styles) && packet.styles.length === 0, "No Fooocus styles");
}

// ===================================================================
console.log("\n=== EXECUTOR — buildRenderPacket DEFAULTS ===");
// ===================================================================

{
  const packet = executor.buildRenderPacket(
    { positive_prompt: "test", negative_prompt: "test" },
    {}
  );
  assert(packet.width === 1024, "Default width 1024");
  assert(packet.height === 384, "Default height 384");
  assert(packet.performance === "Quality", "Default quality");
  assert(packet.seed === null, "Default seed null");
  assert(packet.attempt === 1, "Default attempt 1");
}

// ===================================================================
// ASYNC TESTS — wrapped in IIFE for CommonJS compatibility
// ===================================================================

(async () => {
try {

// ===================================================================
console.log("\n=== EXECUTOR — FULL executeRender (LOCAL mode) ===");
// ===================================================================

resetVRAM();

{
  const mockFooocus = {
    renderCalled: false,
    lastPacket: null,
    async submitRender(packet) {
      this.renderCalled = true;
      this.lastPacket = packet;
      return {
        output_file: "/tmp/mikage_test.png",
        seed_used: 123456789,
        render_time_ms: 5000,
        status: "OK",
      };
    },
    async abortRender() {},
  };
  executor.setFooocusClient(mockFooocus);

  const token = issueToken("test_full_001");
  const job = { job_id: "test_full_001" };

  const result = await executor.executeRender(job, token, TEST_SPEC, {
    seed: 42,
    translate_mode: "LOCAL",
  });

  assert(result.success === true, "Render succeeded");
  assert(result.status === "RENDERED", "Status RENDERED");
  assert(result.job_id === "test_full_001", "Job ID preserved");
  assert(result.translation.valid === true, "Translation valid");
  assert(typeof result.translation.positive_prompt === "string", "Has positive prompt");
  assert(result.translation.positive_prompt.includes("Mikage Zenith"), "Prompt has identity");
  assert(result.render.status === "OK", "Fooocus returned OK");
  assert(result.render.output_file === "/tmp/mikage_test.png", "Output file path");
  assert(result.render.seed_used === 123456789, "Seed recorded");
  assert(result.render_packet.engine === "fooocus", "Packet engine");
  assert(result.render_packet.seed === 123456789, "Seed populated from render");
  assert(result.vram_trace.length >= 6, `VRAM trace has ${result.vram_trace.length} steps`);
  assert(mockFooocus.renderCalled === true, "Fooocus submitRender was called");
  assert(result.total_time_ms >= 0, "Total time recorded");

  const lock = vram.getResourceLock();
  assert(lock.phase === "IDLE", "VRAM back to IDLE after render");
  assert(lock.ollama_active === false, "Ollama inactive");
  assert(lock.fooocus_active === false, "Fooocus inactive");
}

// ===================================================================
console.log("\n=== EXECUTOR — TOKEN MISMATCH BLOCKS RENDER ===");
// ===================================================================

resetVRAM();

{
  const token = issueToken("different_job");
  let threw = false;
  try {
    await executor.executeRender({ job_id: "test_mismatch_001" }, token, TEST_SPEC);
  } catch (e) {
    threw = e instanceof executor.RenderTokenError;
  }
  assert(threw, "Token mismatch blocks render");
}

// ===================================================================
console.log("\n=== EXECUTOR — NO TOKEN BLOCKS RENDER ===");
// ===================================================================

resetVRAM();

{
  let threw = false;
  try {
    await executor.executeRender({ job_id: "test_notoken" }, null, TEST_SPEC);
  } catch (e) {
    threw = e instanceof executor.RenderTokenError;
  }
  assert(threw, "No token blocks render");
}

// ===================================================================
console.log("\n=== EXECUTOR — FOOOCUS FAILURE STILL CLEANS VRAM ===");
// ===================================================================

resetVRAM();

{
  executor.setFooocusClient({
    async submitRender() { throw new Error("GPU exploded"); },
    async abortRender() {},
  });

  const token = issueToken("test_fail_001");
  const result = await executor.executeRender({ job_id: "test_fail_001" }, token, TEST_SPEC, {
    translate_mode: "LOCAL",
  });

  assert(result.success === false, "Render failed");
  assert(result.status === "RENDER_FAILED", "Status RENDER_FAILED");
  assert(result.error === "GPU exploded", "Error message preserved");

  const lock = vram.getResourceLock();
  assert(lock.phase === "IDLE", "VRAM cleaned up after failure");
  assert(lock.fooocus_active === false, "Fooocus released after failure");
}

// ===================================================================
console.log("\n=== EXECUTOR — ABORT RENDER ===");
// ===================================================================

resetVRAM();

{
  let abortCalled = false;
  executor.setFooocusClient({
    async submitRender() { return { status: "OK" }; },
    async abortRender() { abortCalled = true; },
  });

  const result = await executor.abortRender("test_abort_001", "critic detected structural failure");

  assert(result.action === "ABORT", "Abort action");
  assert(result.job_id === "test_abort_001", "Abort job_id");
  assert(result.reason.includes("structural failure"), "Abort reason");
  assert(abortCalled === true, "Fooocus abortRender was called");

  const lock = vram.getResourceLock();
  assert(lock.phase === "IDLE", "VRAM reset after abort");
}

// ===================================================================
console.log("\n=== EXECUTOR — SHELL COMMANDS ISSUED ===");
// ===================================================================

resetVRAM();
mockShell.reset();

{
  executor.setFooocusClient({
    async submitRender() { return { output_file: "/tmp/t.png", seed_used: 1, render_time_ms: 1, status: "OK" }; },
    async abortRender() {},
  });

  const token = issueToken("test_shell_001");
  await executor.executeRender({ job_id: "test_shell_001" }, token, TEST_SPEC, {
    translate_mode: "LOCAL",
  });

  const cmds = mockShell.commands;
  assert(cmds.some((c) => c.includes("nvidia-smi")), "nvidia-smi called for VRAM clear");
  assert(cmds.some((c) => c.includes("ollama")), "Ollama commands issued");
}

// ===================================================================
// RESULTS
// ===================================================================

console.log("\n" + "=".repeat(60));
console.log(`RESULTS: ${passed} passed, ${failed} failed`);

if (failures.length > 0) {
  console.log("\nFAILURES:");
  for (const f of failures) {
    console.log(`  • ${f}`);
  }
}

console.log("=".repeat(60) + "\n");

process.exit(failed > 0 ? 1 : 0);

} catch (err) {
  console.error("TEST RUNNER ERROR:", err);
  process.exit(1);
}
})();
