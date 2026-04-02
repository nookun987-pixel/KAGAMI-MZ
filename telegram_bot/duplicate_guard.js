/**
 * Duplicate Guard Module for Telegram Bot
 * Prevents duplicate processing of messages and runs
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const MESSAGE_REGISTRY_FILE = path.join(DATA_DIR, 'message_registry.json');
const RUN_REGISTRY_FILE = path.join(DATA_DIR, 'run_registry.json');
const ACTIVE_TASKS_FILE = path.join(DATA_DIR, 'active_tasks.json');

// In-memory registries
let messageRegistry = new Set();
let runRegistry = new Set();
let activeTasks = new Map();
let registryLoaded = false;

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Load registries from disk
function loadRegistries() {
  if (registryLoaded) return;
  
  ensureDataDir();
  
  try {
    if (fs.existsSync(MESSAGE_REGISTRY_FILE)) {
      const data = JSON.parse(fs.readFileSync(MESSAGE_REGISTRY_FILE, 'utf8'));
      messageRegistry = new Set(data.messages || []);
    }
  } catch (e) {
    console.error('[GUARD] Error loading message registry:', e.message);
    messageRegistry = new Set();
  }
  
  try {
    if (fs.existsSync(RUN_REGISTRY_FILE)) {
      const data = JSON.parse(fs.readFileSync(RUN_REGISTRY_FILE, 'utf8'));
      runRegistry = new Set(data.runs || []);
    }
  } catch (e) {
    console.error('[GUARD] Error loading run registry:', e.message);
    runRegistry = new Set();
  }
  
  try {
    if (fs.existsSync(ACTIVE_TASKS_FILE)) {
      const data = JSON.parse(fs.readFileSync(ACTIVE_TASKS_FILE, 'utf8'));
      activeTasks = new Map(Object.entries(data.tasks || {}));
    }
  } catch (e) {
    console.error('[GUARD] Error loading active tasks:', e.message);
    activeTasks = new Map();
  }
  
  registryLoaded = true;
  console.log(`[GUARD] Loaded: ${messageRegistry.size} messages, ${runRegistry.size} runs, ${activeTasks.size} active tasks`);
}

// Save registries to disk
function saveRegistries() {
  ensureDataDir();
  
  try {
    fs.writeFileSync(MESSAGE_REGISTRY_FILE, JSON.stringify({
      messages: Array.from(messageRegistry),
      lastUpdated: new Date().toISOString()
    }, null, 2));
  } catch (e) {
    console.error('[GUARD] Error saving message registry:', e.message);
  }
  
  try {
    fs.writeFileSync(RUN_REGISTRY_FILE, JSON.stringify({
      runs: Array.from(runRegistry),
      lastUpdated: new Date().toISOString()
    }, null, 2));
  } catch (e) {
    console.error('[GUARD] Error saving run registry:', e.message);
  }
  
  try {
    fs.writeFileSync(ACTIVE_TASKS_FILE, JSON.stringify({
      tasks: Object.fromEntries(activeTasks),
      lastUpdated: new Date().toISOString()
    }, null, 2));
  } catch (e) {
    console.error('[GUARD] Error saving active tasks:', e.message);
  }
}

// Check if message has been processed
function isMessageProcessed(messageId) {
  loadRegistries();
  return messageRegistry.has(String(messageId));
}

// Mark message as processed
function markMessageProcessed(messageId) {
  loadRegistries();
  messageRegistry.add(String(messageId));
  
  // Limit registry size to prevent memory issues (keep last 1000)
  if (messageRegistry.size > 1000) {
    const entries = Array.from(messageRegistry);
    messageRegistry = new Set(entries.slice(-500));
  }
  
  saveRegistries();
}

// Check if run exists
function isRunExists(runId) {
  loadRegistries();
  return runRegistry.has(String(runId));
}

// Register a new run
function registerRun(runId) {
  loadRegistries();
  
  if (runRegistry.has(String(runId))) {
    return false; // Already exists
  }
  
  runRegistry.add(String(runId));
  saveRegistries();
  return true;
}

// Check if task is active
function isTaskActive(taskId) {
  loadRegistries();
  const task = activeTasks.get(String(taskId));
  
  if (!task) return false;
  
  // Check if task has expired (30 minutes timeout)
  const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
  if (task.startedAt < thirtyMinutesAgo) {
    // Task expired, clean it up
    activeTasks.delete(String(taskId));
    saveRegistries();
    return false;
  }
  
  return task.status === 'RUNNING';
}

// Lock a task
function lockTask(taskId, metadata = {}) {
  loadRegistries();
  
  if (isTaskActive(taskId)) {
    return false; // Task already running
  }
  
  activeTasks.set(String(taskId), {
    status: 'RUNNING',
    startedAt: Date.now(),
    ...metadata
  });
  
  saveRegistries();
  return true;
}

// Unlock a task
function unlockTask(taskId) {
  loadRegistries();
  
  const task = activeTasks.get(String(taskId));
  if (task) {
    task.status = 'COMPLETED';
    task.completedAt = Date.now();
    saveRegistries();
  }
}

// Get active tasks count
function getActiveTaskCount() {
  loadRegistries();
  let count = 0;
  
  for (const [taskId, task] of activeTasks) {
    if (task.status === 'RUNNING') {
      // Check if expired
      const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
      if (task.startedAt < thirtyMinutesAgo) {
        activeTasks.delete(taskId);
      } else {
        count++;
      }
    }
  }
  
  return count;
}

// Get guard status for reporting
function getGuardStatus() {
  loadRegistries();
  return {
    messagesTracked: messageRegistry.size,
    runsTracked: runRegistry.size,
    activeTasks: getActiveTaskCount(),
    activeTaskDetails: Array.from(activeTasks.entries()).filter(([_, t]) => t.status === 'RUNNING')
  };
}

// Clear all registries (use with caution)
function clearRegistries() {
  messageRegistry.clear();
  runRegistry.clear();
  activeTasks.clear();
  saveRegistries();
  console.log('[GUARD] All registries cleared');
}

module.exports = {
  isMessageProcessed,
  markMessageProcessed,
  isRunExists,
  registerRun,
  isTaskActive,
  lockTask,
  unlockTask,
  getActiveTaskCount,
  getGuardStatus,
  clearRegistries
};
