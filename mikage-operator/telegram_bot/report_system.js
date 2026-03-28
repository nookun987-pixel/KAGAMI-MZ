const serviceManager = require('./service_manager');
const taskManager = require('./task_manager');
const sharedState = require('./shared_state');

function generateSystemReport() {
  const services = serviceManager.getAllStatuses();
  const tasks = taskManager.getAllTasks();
  const runs = sharedState.getRuns();
  const alerts = sharedState.getAlerts();

  const report = {
    timestamp: new Date().toISOString(),
    services: services,
    task_summary: {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      running: tasks.filter(t => t.status === 'running').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      failed: tasks.filter(t => t.status === 'failed').length
    },
    recent_runs: runs.slice(-5),
    active_alerts: alerts.filter(a => !a.resolved).slice(-5)
  };

  return report;
}

function formatSystemReport(report) {
  let output = `SYSTEM REPORT\n`;
  output += `Timestamp: ${report.timestamp}\n\n`;
  output += `SERVICES:\n`;
  for (const [service, status] of Object.entries(report.services)) {
    output += `${service}: ${status.status} (last check: ${status.lastCheck || 'never'})\n`;
  }
  output += `\nTASKS:\n`;
  output += `Total: ${report.task_summary.total}\n`;
  output += `Pending: ${report.task_summary.pending}\n`;
  output += `Running: ${report.task_summary.running}\n`;
  output += `Completed: ${report.task_summary.completed}\n`;
  output += `Failed: ${report.task_summary.failed}\n`;

  if (report.recent_runs.length > 0) {
    output += `\nRECENT RUNS:\n`;
    report.recent_runs.forEach(run => {
      output += `${run.timestamp}: ${run.command} - ${run.status}\n`;
    });
  }

  if (report.active_alerts.length > 0) {
    output += `\nACTIVE ALERTS:\n`;
    report.active_alerts.forEach(alert => {
      output += `${alert.timestamp}: ${alert.message}\n`;
    });
  }

  return output;
}

module.exports = { generateSystemReport, formatSystemReport };