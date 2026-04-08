const sharedState = require('./shared_state');

class TaskManager {
  constructor() {
    // Tasks are managed in sharedState
  }

  createTask(rawCommand, objective = '', executorType = 'unknown') {
    const task = {
      title: rawCommand.split(' ')[0] || 'unknown',
      raw_command: rawCommand,
      objective: objective,
      status: 'pending',
      executor_type: executorType,
      result_summary: '',
      blocker: '',
      artifact_paths: []
    };
    const taskId = sharedState.addTask(task);
    return taskId;
  }

  updateTask(taskId, updates) {
    sharedState.updateTask(taskId, updates);
  }

  getTask(taskId) {
    if (taskId === 'latest') return this.getLatestTask();
    return sharedState.getTasks().find(t => t.task_id === taskId);
  }

  getAllTasks() {
    return sharedState.getTasks();
  }

  getPendingTasks() {
    return sharedState.getTasks().filter(t => t.status === 'pending');
  }

  getRunningTasks() {
    return sharedState.getTasks().filter(t => t.status === 'running');
  }

  getCompletedTasks() {
    return sharedState.getTasks().filter(t => t.status === 'completed');
  }

  getFailedTasks() {
    return sharedState.getTasks().filter(t => t.status === 'failed');
  }

  getLatestTask() {
    const tasks = sharedState.getTasks();
    return tasks.length > 0 ? tasks[tasks.length - 1] : null;
  }

  setTaskRunning(taskId) {
    this.updateTask(taskId, { status: 'running' });
  }

  setTaskCompleted(taskId, resultSummary = '', artifactPaths = []) {
    this.updateTask(taskId, { status: 'completed', result_summary: resultSummary, artifact_paths: artifactPaths });
  }

  setTaskFailed(taskId, blocker = '') {
    this.updateTask(taskId, { status: 'failed', blocker: blocker });
  }

  // Legacy methods for compatibility
  queueTask(task) {
    this.updateTask(task.task_id, { status: 'queued' });
  }

  processQueue() {
    const pending = this.getPendingTasks();
    if (pending.length > 0) {
      this.setTaskRunning(pending[0].task_id);
      // Assume execution is handled elsewhere
    }
  }
}

const taskManager = new TaskManager();

module.exports = taskManager;


function retryTask(taskId) {
  const task = getTask(taskId);
  if (!task || task.status !== 'FAIL') return null;
  task.status = 'QUEUED';
  task.updated_at = new Date().toISOString();
  updateTask(task);
  return task;
}

function approveTask(taskId) {
  const task = getTask(taskId);
  if (!task || task.status !== 'WAITING_APPROVAL') return false;
  task.status = 'QUEUED';
  task.updated_at = new Date().toISOString();
  updateTask(task);
  return true;
}

function rejectTask(taskId) {
  const task = getTask(taskId);
  if (!task || task.status !== 'WAITING_APPROVAL') return false;
  task.status = 'BLOCKED';
  task.updated_at = new Date().toISOString();
  updateTask(task);
  return true;
}

function getLogs(taskId) {
  const task = getTask(taskId);
  return task ? task.result : null;
}

function getArtifact(taskId) {
  const task = getTask(taskId);
  return task ? task.artifact_path : null;
}

module.exports = {
  createTask,
  getTask,
  getLatestTask,
  getQueue,
  retryTask,
  approveTask,
  rejectTask,
  getLogs,
  getArtifact
};