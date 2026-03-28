const sharedState = require('./shared_state');
const taskManager = require('./task_manager');

function generateCostReport() {
  const costs = sharedState.getCosts();
  const tasks = taskManager.getAllTasks();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const failedTasks = tasks.filter(t => t.status === 'failed').length;

  // Mock cost calculation: assume each task costs $0.10
  const estimatedCost = totalTasks * 0.10;
  const actualCost = costs.reduce((sum, cost) => sum + (cost.amount || 0), 0);

  const report = {
    timestamp: new Date().toISOString(),
    total_tasks: totalTasks,
    completed_tasks: completedTasks,
    failed_tasks: failedTasks,
    estimated_cost: estimatedCost,
    actual_cost: actualCost,
    cost_breakdown: costs.slice(-10) // Last 10 costs
  };

  return report;
}

function formatCostReport(report) {
  let output = `COST REPORT\n`;
  output += `Timestamp: ${report.timestamp}\n\n`;
  output += `TASKS:\n`;
  output += `Total: ${report.total_tasks}\n`;
  output += `Completed: ${report.completed_tasks}\n`;
  output += `Failed: ${report.failed_tasks}\n\n`;
  output += `COSTS:\n`;
  output += `Estimated: $${report.estimated_cost.toFixed(2)}\n`;
  output += `Actual: $${report.actual_cost.toFixed(2)}\n\n`;
  output += `RECENT COSTS:\n`;
  report.cost_breakdown.forEach(cost => {
    output += `${cost.timestamp}: ${cost.description} - $${cost.amount || 0}\n`;
  });

  return output;
}

module.exports = { generateCostReport, formatCostReport };