const fs = require('fs-extra');
const path = require('path');

const tasksFile = path.join(__dirname, '../data/tasks.json');

function loadTasks() {
  try {
    return fs.readJsonSync(tasksFile, { throws: false }) || [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  fs.ensureDirSync(path.dirname(tasksFile));
  fs.writeJsonSync(tasksFile, tasks);
}

module.exports = { loadTasks, saveTasks };