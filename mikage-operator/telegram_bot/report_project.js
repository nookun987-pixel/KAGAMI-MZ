const fs = require('fs-extra');
const path = require('path');
const taskManager = require('./task_manager');

function generateProjectReport() {
  const projectRoot = path.join(__dirname, '..');
  const files = getProjectFiles(projectRoot);
  const recentTasks = taskManager.getAllTasks().slice(-10);
  const fileCount = countFilesByType(files);

  const report = {
    timestamp: new Date().toISOString(),
    project_root: projectRoot,
    file_count: files.length,
    file_types: fileCount,
    recent_tasks: recentTasks.map(t => ({
      id: t.task_id,
      command: t.raw_command,
      status: t.status,
      created: t.created_at
    }))
  };

  return report;
}

function getProjectFiles(dir, maxDepth = 3, currentDepth = 0) {
  if (currentDepth > maxDepth) return [];
  let files = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files = files.concat(getProjectFiles(fullPath, maxDepth, currentDepth + 1));
      } else if (stat.isFile()) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore errors
  }
  return files;
}

function countFilesByType(files) {
  const counts = {};
  files.forEach(file => {
    const ext = path.extname(file);
    counts[ext] = (counts[ext] || 0) + 1;
  });
  return counts;
}

function formatProjectReport(report) {
  let output = `PROJECT REPORT\n`;
  output += `Timestamp: ${report.timestamp}\n`;
  output += `Project Root: ${report.project_root}\n`;
  output += `Total Files: ${report.file_count}\n\n`;
  output += `FILE TYPES:\n`;
  for (const [type, count] of Object.entries(report.file_types)) {
    output += `${type || 'no extension'}: ${count}\n`;
  }
  output += `\nRECENT TASKS:\n`;
  report.recent_tasks.forEach(task => {
    output += `${task.id}: ${task.command} - ${task.status} (${task.created})\n`;
  });

  return output;
}

module.exports = { generateProjectReport, formatProjectReport };