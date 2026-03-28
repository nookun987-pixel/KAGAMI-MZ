const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(__dirname, '../data/tasks.json');

function ensureTasksFile() {
  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify({ tasks: [] }, null, 2));
  }
}

function loadTasks() {
  ensureTasksFile();
  try {
    return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
  } catch (error) {
    return { tasks: [] };
  }
}

function saveTasks(data) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2));
}

async function getStatus(taskId) {
  const data = loadTasks();
  
  if (taskId) {
    const task = data.tasks.find(t => t.task_id === taskId);
    if (!task) {
      return `TASK_ID: ${taskId}
STATUS: NOT_FOUND`;
    }
    
    return `TASK_ID: ${task.task_id}
STATUS: ${task.status}
TITLE: ${task.title}
UPDATED: ${task.updated_at}
RESULT: ${task.result_summary || 'PENDING'}
BLOCKER: ${task.blocker || 'NONE'}`;
  }
  
  // Return queue status
  const queued = data.tasks.filter(t => t.status === 'QUEUED');
  const running = data.tasks.filter(t => t.status === 'RUNNING');
  const blocked = data.tasks.filter(t => t.status === 'BLOCKED');
  
  return `QUEUE STATUS:
QUEUED: ${queued.length}
RUNNING: ${running.length}
BLOCKED: ${blocked.length}

RECENT TASKS:
${data.tasks.slice(-5).reverse().map(t => 
  `${t.task_id}: ${t.status} - ${t.title}`
).join('\n')}`;
}

module.exports = { getStatus };
