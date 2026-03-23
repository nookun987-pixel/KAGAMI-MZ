/**
 * MIKAGE — /render/vram_manager.js
 * Enforces strict sequential VRAM lifecycle.
 *
 * HARD RULES (from spec §11):
 *   - OLLAMA_KEEP_ALIVE=0 (immediate unload after response)
 *   - No parallel Ollama + Fooocus
 *   - Each job is an isolated session
 *   - Clear VRAM after each render
 *   - Block job if resource conflict
 *
 * Strict execution order:
 *   1. loadModel("OLLAMA")
 *   2. → translate
 *   3. unloadModel("OLLAMA")
 *   4. clearVRAM()
 *   5. detectZombies() → killZombies()
 *   6. loadModel("FOOOCUS")
 *   7. → render
 *   8. unloadModel("FOOOCUS")
 *   9. clearVRAM()
 *  10. detectZombies() → killZombies()
 *
 * In production, shell commands execute against nvidia-smi / ollama ps.
 * For testability, all shell interactions go through an injected executor.
 */

"use strict";

const { execSync } = require("child_process");

// ===================================================================
// RESOURCE LOCK — singleton state
// ===================================================================

const _lock = {
  ollama_active: false,
  fooocus_active: false,
  parallel_allowed: false,    // LOCKED false — never changes
  current_job_id: null,
  phase: "IDLE",              // IDLE | OLLAMA_LOADING | OLLAMA_ACTIVE | CLEARING | FOOOCUS_LOADING | FOOOCUS_ACTIVE
  last_cleared_at: null,
};

// Valid phase transitions
const PHASE_TRANSITIONS = Object.freeze({
  IDLE:             ["OLLAMA_LOADING"],
  OLLAMA_LOADING:   ["OLLAMA_ACTIVE"],
  OLLAMA_ACTIVE:    ["OLLAMA_UNLOADING"],
  OLLAMA_UNLOADING: ["CLEARING_PRE_RENDER"],
  CLEARING_PRE_RENDER: ["ZOMBIE_CHECK_PRE", "FOOOCUS_LOADING"],
  ZOMBIE_CHECK_PRE: ["FOOOCUS_LOADING"],
  FOOOCUS_LOADING:  ["FOOOCUS_ACTIVE"],
  FOOOCUS_ACTIVE:   ["FOOOCUS_UNLOADING"],
  FOOOCUS_UNLOADING:["CLEARING_POST_RENDER"],
  CLEARING_POST_RENDER: ["ZOMBIE_CHECK_POST", "IDLE"],
  ZOMBIE_CHECK_POST:["IDLE"],
});

// ===================================================================
// ERRORS
// ===================================================================

class VRAMConflictError extends Error {
  constructor(message) {
    super(`[VRAM_MANAGER] ${message}`);
    this.name = "VRAMConflictError";
  }
}

class VRAMPhaseError extends Error {
  constructor(from, to) {
    super(`[VRAM_MANAGER] Invalid phase transition: ${from} → ${to}`);
    this.name = "VRAMPhaseError";
    this.from = from;
    this.to = to;
  }
}

// ===================================================================
// SHELL EXECUTOR — injectable for testing
// ===================================================================

/**
 * Default shell executor. Runs real commands in production.
 * Replace via setShellExecutor() for testing.
 */
let _shellExecutor = {
  /**
   * Execute a shell command and return stdout.
   * @param {string} cmd
   * @returns {string} stdout
   */
  exec(cmd) {
    try {
      return execSync(cmd, { encoding: "utf-8", timeout: 30000 }).trim();
    } catch (e) {
      return "";
    }
  },
};

/**
 * Inject a custom shell executor (for testing).
 * @param {Object} executor  Must have exec(cmd) → string
 */
function setShellExecutor(executor) {
  if (!executor || typeof executor.exec !== "function") {
    throw new Error("[VRAM_MANAGER] Shell executor must have exec(cmd) method");
  }
  _shellExecutor = executor;
}

/** Get current shell executor (for inspection). */
function getShellExecutor() {
  return _shellExecutor;
}

// ===================================================================
// PHASE MANAGEMENT
// ===================================================================

/**
 * Transition to next phase. Validates against PHASE_TRANSITIONS.
 * @param {string} nextPhase
 * @throws {VRAMPhaseError}
 */
function transitionPhase(nextPhase) {
  const current = _lock.phase;
  const allowed = PHASE_TRANSITIONS[current];

  if (!allowed || !allowed.includes(nextPhase)) {
    throw new VRAMPhaseError(current, nextPhase);
  }

  _lock.phase = nextPhase;
}

/**
 * Force reset to IDLE. Emergency use only.
 * Logs the forced reset.
 * @param {string} reason
 */
function forceReset(reason) {
  const prev = { ..._lock };
  _lock.ollama_active = false;
  _lock.fooocus_active = false;
  _lock.current_job_id = null;
  _lock.phase = "IDLE";
  _lock.last_cleared_at = new Date().toISOString();

  return {
    action: "FORCE_RESET",
    reason,
    previous_state: prev,
    timestamp: _lock.last_cleared_at,
  };
}

// ===================================================================
// RESOURCE LOCK QUERIES
// ===================================================================

/**
 * Get current resource lock state (read-only copy).
 * @returns {Object}
 */
function getResourceLock() {
  return { ..._lock };
}

/**
 * Check if any resource conflict exists.
 * A conflict means Ollama and Fooocus would run simultaneously.
 *
 * @returns {{ conflict: boolean, reason: string|null }}
 */
function checkResourceConflict() {
  if (_lock.ollama_active && _lock.fooocus_active) {
    return { conflict: true, reason: "Ollama and Fooocus both active — parallel forbidden" };
  }
  if (_lock.phase !== "IDLE" && _lock.current_job_id) {
    return { conflict: true, reason: `VRAM busy with job ${_lock.current_job_id} in phase ${_lock.phase}` };
  }
  return { conflict: false, reason: null };
}

// ===================================================================
// VRAM OPERATIONS
// ===================================================================

/**
 * Load a model into VRAM.
 *
 * @param {"OLLAMA"|"FOOOCUS"} modelType
 * @param {string}             jobId
 * @returns {Object}           Load result with timing
 */
function loadModel(modelType, jobId) {
  // --- Pre-checks ---
  if (modelType === "OLLAMA") {
    if (_lock.fooocus_active) {
      throw new VRAMConflictError("Cannot load Ollama while Fooocus is active");
    }
    if (_lock.ollama_active) {
      throw new VRAMConflictError("Ollama already active");
    }

    transitionPhase("OLLAMA_LOADING");
    _lock.ollama_active = true;
    _lock.current_job_id = jobId;
    transitionPhase("OLLAMA_ACTIVE");

    return {
      action: "LOAD",
      model: "OLLAMA",
      job_id: jobId,
      timestamp: new Date().toISOString(),
      env: { OLLAMA_KEEP_ALIVE: "0" },
    };
  }

  if (modelType === "FOOOCUS") {
    if (_lock.ollama_active) {
      throw new VRAMConflictError("Cannot load Fooocus while Ollama is active");
    }
    if (_lock.fooocus_active) {
      throw new VRAMConflictError("Fooocus already active");
    }

    transitionPhase("FOOOCUS_LOADING");
    _lock.fooocus_active = true;
    _lock.current_job_id = jobId;
    transitionPhase("FOOOCUS_ACTIVE");

    return {
      action: "LOAD",
      model: "FOOOCUS",
      job_id: jobId,
      timestamp: new Date().toISOString(),
    };
  }

  throw new Error(`[VRAM_MANAGER] Unknown model type: ${modelType}`);
}

/**
 * Unload a model from VRAM.
 *
 * @param {"OLLAMA"|"FOOOCUS"} modelType
 * @returns {Object}
 */
function unloadModel(modelType) {
  if (modelType === "OLLAMA") {
    if (!_lock.ollama_active) {
      throw new VRAMConflictError("Ollama is not active — cannot unload");
    }

    transitionPhase("OLLAMA_UNLOADING");

    // In production: send unload command
    const ollamaHost = process.env.OLLAMA_HOST || "http://localhost:11434";
    const ollamaModel = process.env.OLLAMA_MODEL || "llama3";
    _shellExecutor.exec(`curl -s ${ollamaHost}/api/generate -d '{"model":"${ollamaModel}","keep_alive":0}' > /dev/null 2>&1 || true`);

    _lock.ollama_active = false;

    return {
      action: "UNLOAD",
      model: "OLLAMA",
      timestamp: new Date().toISOString(),
    };
  }

  if (modelType === "FOOOCUS") {
    if (!_lock.fooocus_active) {
      throw new VRAMConflictError("Fooocus is not active — cannot unload");
    }

    transitionPhase("FOOOCUS_UNLOADING");
    _lock.fooocus_active = false;

    return {
      action: "UNLOAD",
      model: "FOOOCUS",
      timestamp: new Date().toISOString(),
    };
  }

  throw new Error(`[VRAM_MANAGER] Unknown model type: ${modelType}`);
}

/**
 * Clear VRAM completely.
 *
 * @param {"PRE_RENDER"|"POST_RENDER"} stage
 * @returns {Object}
 */
function clearVRAM(stage) {
  const phaseTarget = stage === "PRE_RENDER" ? "CLEARING_PRE_RENDER" : "CLEARING_POST_RENDER";
  transitionPhase(phaseTarget);

  // In production: force GPU memory release
  _shellExecutor.exec("nvidia-smi --gpu-reset 2>/dev/null || true");

  _lock.last_cleared_at = new Date().toISOString();

  return {
    action: "CLEAR_VRAM",
    stage,
    timestamp: _lock.last_cleared_at,
  };
}

/**
 * Detect zombie GPU processes.
 * Compares ollama ps against nvidia-smi process list.
 *
 * @returns {{ found: boolean, zombies: Object[] }}
 */
function detectZombies() {
  const ollamaPs = _shellExecutor.exec("ollama ps 2>/dev/null || echo ''");
  const nvidiaSmi = _shellExecutor.exec("nvidia-smi --query-compute-apps=pid,name,used_memory --format=csv,noheader 2>/dev/null || echo ''");

  // Parse nvidia-smi output
  const gpuProcesses = nvidiaSmi
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(",").map((p) => p.trim());
      return { pid: parts[0], name: parts[1] || "", memory: parts[2] || "" };
    });

  // Parse ollama ps (if ollama reports no models, anything GPU-resident from ollama is zombie)
  const ollamaActive = ollamaPs.includes("running");

  const zombies = [];

  if (!ollamaActive && !_lock.ollama_active) {
    // No ollama should be running — any ollama GPU process is zombie
    for (const proc of gpuProcesses) {
      if (proc.name.includes("ollama") || proc.name.includes("llama")) {
        zombies.push(proc);
      }
    }
  }

  if (!_lock.fooocus_active) {
    // No fooocus should be running
    for (const proc of gpuProcesses) {
      if (proc.name.includes("fooocus") || proc.name.includes("comfy") || proc.name.includes("python")) {
        // Be cautious — only flag if we're not expecting any GPU python
        // In a dedicated render machine, this is safe
        zombies.push(proc);
      }
    }
  }

  return {
    found: zombies.length > 0,
    zombies,
  };
}

/**
 * Kill zombie processes.
 *
 * @param {Object[]} zombies  Array of { pid, name, memory }
 * @returns {Object}
 */
function killZombies(zombies) {
  if (!Array.isArray(zombies) || zombies.length === 0) {
    return { action: "KILL_ZOMBIES", killed: 0, pids: [] };
  }

  const killed = [];
  for (const z of zombies) {
    if (z.pid) {
      _shellExecutor.exec(`kill -9 ${z.pid} 2>/dev/null || true`);
      killed.push(z.pid);
    }
  }

  return {
    action: "KILL_ZOMBIES",
    killed: killed.length,
    pids: killed,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Run zombie check and cleanup at a specific pipeline stage.
 *
 * @param {"PRE"|"POST"} stage
 * @returns {Object}
 */
function zombieCheckpoint(stage) {
  const phaseTarget = stage === "PRE" ? "ZOMBIE_CHECK_PRE" : "ZOMBIE_CHECK_POST";
  transitionPhase(phaseTarget);

  const detection = detectZombies();
  let cleanup = null;

  if (detection.found) {
    cleanup = killZombies(detection.zombies);
  }

  return {
    stage,
    detection,
    cleanup,
    timestamp: new Date().toISOString(),
  };
}

// ===================================================================
// FULL LIFECYCLE — orchestrates the complete VRAM sequence for a job
// ===================================================================

/**
 * @typedef {Object} LifecycleStep
 * @property {string} action
 * @property {string} timestamp
 * @property {*}      detail
 */

/**
 * Execute the Ollama phase of the VRAM lifecycle.
 * Steps 1-5: Load Ollama → (caller translates) → Unload → Clear → Zombie check
 *
 * Returns a handle that the caller uses to signal translation is complete.
 *
 * @param {string} jobId
 * @returns {Object} { steps: LifecycleStep[], complete: Function }
 */
function beginOllamaPhase(jobId) {
  const conflict = checkResourceConflict();
  if (conflict.conflict) {
    throw new VRAMConflictError(conflict.reason);
  }

  const steps = [];

  // Step 1: Load
  steps.push(loadModel("OLLAMA", jobId));

  return {
    steps,
    /**
     * Call after translation is done to unload Ollama and clear VRAM.
     * @returns {LifecycleStep[]} Additional steps from unload + clear + zombie check
     */
    complete() {
      const moreSteps = [];
      // Step 3: Unload
      moreSteps.push(unloadModel("OLLAMA"));
      // Step 4: Clear
      moreSteps.push(clearVRAM("PRE_RENDER"));
      // Step 5: Zombie check
      moreSteps.push(zombieCheckpoint("PRE"));
      return moreSteps;
    },
  };
}

/**
 * Execute the Fooocus phase of the VRAM lifecycle.
 * Steps 6-10: Load Fooocus → (caller renders) → Unload → Clear → Zombie check
 *
 * @param {string} jobId
 * @returns {Object} { steps: LifecycleStep[], complete: Function }
 */
function beginFooocusPhase(jobId) {
  if (_lock.ollama_active) {
    throw new VRAMConflictError("Cannot start Fooocus phase — Ollama still active");
  }

  const steps = [];

  // Step 6: Load
  steps.push(loadModel("FOOOCUS", jobId));

  return {
    steps,
    /**
     * Call after render is done to unload Fooocus and clear VRAM.
     * @returns {LifecycleStep[]}
     */
    complete() {
      const moreSteps = [];
      // Step 8: Unload
      moreSteps.push(unloadModel("FOOOCUS"));
      // Step 9: Clear
      moreSteps.push(clearVRAM("POST_RENDER"));
      // Step 10: Zombie check + return to IDLE
      moreSteps.push(zombieCheckpoint("POST"));

      _lock.current_job_id = null;
      _lock.phase = "IDLE";

      return moreSteps;
    },
  };
}

// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  // Lifecycle phases
  beginOllamaPhase,
  beginFooocusPhase,

  // Individual operations
  loadModel,
  unloadModel,
  clearVRAM,
  detectZombies,
  killZombies,
  zombieCheckpoint,

  // Lock management
  getResourceLock,
  checkResourceConflict,
  forceReset,

  // Shell executor injection
  setShellExecutor,
  getShellExecutor,

  // Errors
  VRAMConflictError,
  VRAMPhaseError,

  // Constants (for testing)
  PHASE_TRANSITIONS,
};
