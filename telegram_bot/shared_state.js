const fs = require('fs');
const path = require('path');

const { validate: validateSchema } = require('../core/schema_registry');

const STATE_FILE = path.join(__dirname, '../data/shared_state.json');

function ensureStateFile() {
  if (!fs.existsSync(STATE_FILE)) {
    fs.writeFileSync(STATE_FILE, JSON.stringify({
      tasks: [],
      services: {},
      runs: [],
      artifacts: [],
      costs: [],
      alerts: []
    }, null, 2));
  }
}

function loadState() {
  ensureStateFile();
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  } catch (error) {
    console.error('[STATE] Load error:', error.message);
    return {
      tasks: [],
      services: {},
      runs: [],
      artifacts: [],
      costs: [],
      alerts: []
    };
  }
}

function saveState(state) {
  const result = validateSchema('shared_state', state, { strict: false });
  if (!result.valid) {
    const msg = `[SCHEMA] Cannot write shared_state: ${result.errors.join("; ")}`;
    console.error(msg);
    throw new Error(msg);
  }
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
    return true;
  } catch (error) {
    console.error('[STATE] Save error:', error.message);
    throw error;
  }
}

function getTasks() {
  const state = loadState();
  return state.tasks;
}

function getCostData() {
  const state = loadState();
  return state.costs;
}

function updateTask(taskId, updates) {
  const state = loadState();
  const taskIndex = state.tasks.findIndex(t => t.task_id === taskId);
  
  if (taskIndex !== -1) {
    state.tasks[taskIndex] = { 
      ...state.tasks[taskIndex], 
      ...updates,
      updated_at: new Date().toISOString()
    };
    saveState(state);
    return state.tasks[taskIndex];
  }
  
  return null;
}

function addTask(task) {
  const state = loadState();
  const newTask = {
    task_id: 'task_' + Date.now(),
    title: task.title || 'Untitled Task',
    raw_command: task.command || '',
    normalized_objective: task.objective || '',
    executor_type: task.executor_type || 'manual',
    priority: task.priority || 'medium',
    status: 'NEW',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    result_summary: '',
    blocker: '',
    artifact_paths: [],
    related_run_id: null
  };
  
  state.tasks.push(newTask);
  saveState(state);
  return newTask;
}

function logCost(costEntry) {
  const state = loadState();
  const newCost = {
    id: 'cost_' + Date.now(),
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    provider: costEntry.provider || 'Unknown',
    category: costEntry.category || 'API',
    model: costEntry.model || '',
    task_id: costEntry.task_id || null,
    input_tokens: costEntry.input_tokens || 0,
    output_tokens: costEntry.output_tokens || 0,
    amount: costEntry.amount || 0,
    description: costEntry.description || ''
  };
  
  state.costs.push(newCost);
  saveState(state);
  return newCost;
}

function getState() {
  return loadState();
}

function updateState(mutator) {
  const state = loadState();
  const newState = mutator(state);
  saveState(newState || state);
  return newState || state;
}

module.exports = {
  getState,
  updateState,
  getTasks,
  getCostData,
  updateTask,
  addTask,
  logCost
};
