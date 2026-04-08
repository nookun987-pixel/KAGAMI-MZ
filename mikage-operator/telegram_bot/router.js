const taskManager = require('./task_manager');
const serviceManager = require('./service_manager');
const artifactRegistry = require('./artifact_registry');
const reportSystem = require('./report_system');
const reportProject = require('./report_project');
const reportCost = require('./report_cost');

function handleMessage(bot, msg) {
  const text = msg.text || '';
  const chatId = msg.chat.id;

  if (text.startsWith('/')) {
    const parts = text.split(' ');
    const cmd = parts[0].substring(1);
    const args = parts.slice(1).join(' ');

    switch (cmd) {
      case 'task':
        if (!args.trim()) {
          bot.sendMessage(chatId, 'Usage: /task <instruction>');
          return;
        }
        const taskId = taskManager.createTask(args, `Execute: ${args}`, 'orchestrator');
        bot.sendMessage(chatId, `Task ${taskId} created`);
        break;
      case 'run':
        if (!args.trim()) {
          bot.sendMessage(chatId, 'Usage: /run <job>');
          return;
        }
        const runTaskId = taskManager.createTask(args, `Run: ${args}`, determineExecutor(args));
        bot.sendMessage(chatId, `Task ${runTaskId} queued`);
        break;
      case 'status':
        const statusTaskId = args.trim() || 'latest';
        const statusTask = taskManager.getTask(statusTaskId);
        if (!statusTask) {
          bot.sendMessage(chatId, `Task ${statusTaskId} not found`);
          return;
        }
        bot.sendMessage(chatId, formatTask(statusTask));
        break;
      case 'latest':
        const latest = taskManager.getLatestTask();
        if (!latest) {
          bot.sendMessage(chatId, 'No tasks');
          return;
        }
        bot.sendMessage(chatId, formatTask(latest));
        break;
      case 'queue':
        const pending = taskManager.getPendingTasks();
        const running = taskManager.getRunningTasks();
        bot.sendMessage(chatId, `Pending: ${pending.length}\nRunning: ${running.length}`);
        break;
      case 'system':
        const sysReport = reportSystem.generateSystemReport();
        bot.sendMessage(chatId, reportSystem.formatSystemReport(sysReport));
        break;
      case 'project':
        const projReport = reportProject.generateProjectReport();
        bot.sendMessage(chatId, reportProject.formatProjectReport(projReport));
        break;
      case 'cost':
        const costReport = reportCost.generateCostReport();
        bot.sendMessage(chatId, reportCost.formatCostReport(costReport));
        break;
      case 'restart':
        if (!args.trim()) {
          bot.sendMessage(chatId, 'Usage: /restart <service>');
          return;
        }
        serviceManager.restartService(args.trim()).then(result => {
          bot.sendMessage(chatId, result.success ? `${args.trim()} restarted` : `Failed: ${result.message}`);
        });
        break;
      case 'approve':
        // Placeholder
        bot.sendMessage(chatId, 'Approval not implemented');
        break;
      case 'reject':
        // Placeholder
        bot.sendMessage(chatId, 'Rejection not implemented');
        break;
      case 'artifacts':
        const artifacts = artifactRegistry.getLatestArtifacts();
        let artMsg = 'Latest artifacts:\n';
        artifacts.forEach(art => {
          artMsg += `${art.name} (${art.modified})\n`;
        });
        bot.sendMessage(chatId, artMsg);
        break;
      case 'help':
        bot.sendMessage(chatId, 'Commands:\n/task <inst> - Create task\n/run <job> - Run job\n/status [id] - Status\n/latest - Latest task\n/queue - Queue status\n/system - System report\n/project - Project report\n/cost - Cost report\n/restart <svc> - Restart service\n/approve - Approve\n/reject - Reject\n/artifacts - Latest artifacts\n/help - Help');
        break;
      default:
        bot.sendMessage(chatId, 'Unknown command');
    }
  } else {
    bot.sendMessage(chatId, 'Use /help');
  }
}

function determineExecutor(command) {
  if (command.includes('content')) return 'channel_operator';
  if (command.includes('start') || command.includes('stop')) return 'service_action';
  if (command.includes('.js')) return 'local_script';
  return 'orchestrator';
}

function formatTask(task) {
  return `ID: ${task.task_id}\nStatus: ${task.status}\nCommand: ${task.raw_command}\nResult: ${task.result_summary || 'None'}\nBlocker: ${task.blocker || 'None'}`;
}

module.exports = { handleMessage };