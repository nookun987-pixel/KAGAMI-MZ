const taskManager = require('./task_manager');
const serviceManager = require('./service_manager');
const artifactRegistry = require('./artifact_registry');
const reportSystem = require('./report_system');
const reportProject = require('./report_project');
const reportCost = require('./report_cost');
const executorRouter = require('./executor_router');

async function handleCommand(text, msg) {
    if (!text || !text.startsWith('/')) {
        return 'Invalid command';
    }

    const trimmed = text.trim();
    const parts = trimmed.split(/\s+/);
    const rawCmd = parts[0];
    const cmd = rawCmd.split('@')[0].replace('/', '').toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
        case 'run':
            return await handleRun(args);
        case 'task':
            return handleTask(args);
        case 'status':
            return handleStatus(args);
        case 'latest':
            return handleLatest();
        case 'queue':
            return handleQueue();
        case 'system':
            return handleSystem();
        case 'project':
            return handleProject();
        case 'cost':
            return handleCost();
        case 'restart':
            return await handleRestart(args);
        case 'artifacts':
            return handleArtifacts();
        case 'approve':
            return handleApprove(args);
        case 'reject':
            return handleReject(args);
        case 'help':
            return handleHelp();
        default:
            return 'Unknown command. Use /help';
    }
}

async function handleRun(args) {
    if (!args.length) return 'Usage: /run <job_name>';
    const jobName = args.join(' ');
    const taskId = taskManager.createTask(jobName, 'Execute: ' + jobName, 'orchestrator');
    const task = taskManager.getTask(taskId);
    const normalized = executorRouter.normalizeRunRequest(jobName);
    const result = await executorRouter.dispatchRun(task, normalized);
    const lines = [
        'TASK_ID: ' + result.task_id,
        'RUN_ID: ' + result.run_id,
        'STATUS: ' + result.status,
        'EXECUTOR: ' + result.executor_type,
        'RESULT: ' + result.message,
        'BLOCKER: ' + (result.success ? 'NONE' : result.message)
    ];
    return lines.join('\n');
}

function handleTask(args) {
    if (!args.length) return 'Usage: /task <instruction>';
    const instruction = args.join(' ');
    const taskId = taskManager.createTask(instruction, 'Task: ' + instruction, 'orchestrator');
    return 'Task ' + taskId + ' created';
}

function handleStatus(args) {
    const taskId = args[0] || 'latest';
    const task = taskId === 'latest' ? taskManager.getLatestTask() : taskManager.getTask(taskId);
    if (!task) return 'Task ' + taskId + ' not found';
    return formatTask(task);
}

function handleLatest() {
    const task = taskManager.getLatestTask();
    if (!task) return 'No tasks';
    return formatTask(task);
}

function handleQueue() {
    const pending = taskManager.getPendingTasks();
    const running = taskManager.getRunningTasks();
    return 'Pending: ' + pending.length + ' Running: ' + running.length;
}

async function handleSystem() {
    const statuses = await serviceManager.getAllServiceStatus();
    const lines = ['SYSTEM'];
    for (const [name, info] of Object.entries(statuses)) {
        lines.push(name.toUpperCase() + ': ' + info.status + ' ' + info.detail);
    }
    return lines.join('\n');
}

function handleProject() {
    if (reportProject && typeof reportProject.getReport === 'function') {
        return reportProject.getReport();
    }
    return 'Project report';
}

function handleCost() {
    if (reportCost && typeof reportCost.getReport === 'function') {
        return reportCost.getReport();
    }
    return 'Cost report';
}

async function handleRestart(args) {
    if (!args.length) return 'Usage: /restart <service>';
    const service = args[0];
    const result = await serviceManager.restartService(service);
    const lines = [
        'SERVICE: ' + service,
        'STATUS: ' + (result.success ? 'RESTARTED' : 'FAILED'),
        'DETAIL: ' + result.message
    ];
    return lines.join('\n');
}

function handleArtifacts() {
    const artifacts = artifactRegistry.getLatestArtifacts(5);
    if (!artifacts || !artifacts.length) return 'No artifacts';
    const names = artifacts.map(a => a.name).join(' ');
    return 'Artifacts: ' + names;
}

function handleApprove(args) {
    if (!args.length) return 'Usage: /approve <task_id>';
    const taskId = args[0];
    const task = taskManager.getTask(taskId);
    if (!task) return 'Task ' + taskId + ' not found';
    if (task.status !== 'WAITING_APPROVAL') return 'Task ' + taskId + ' not awaiting approval';
    taskManager.updateTaskStatus(taskId, 'DONE');
    return 'Task ' + taskId + ' approved';
}

function handleReject(args) {
    if (!args.length) return 'Usage: /reject <task_id> [reason]';
    const taskId = args[0];
    const reason = args.slice(1).join(' ') || 'No reason';
    const task = taskManager.getTask(taskId);
    if (!task) return 'Task ' + taskId + ' not found';
    if (task.status !== 'WAITING_APPROVAL') return 'Task ' + taskId + ' not awaiting approval';
    taskManager.updateTaskStatus(taskId, 'FAIL', { blocker: reason });
    return 'Task ' + taskId + ' rejected: ' + reason;
}

function handleHelp() {
    return 'Commands: /run /task /status /latest /queue /system /project /cost /restart /artifacts /approve /reject /help';
}

function determineExecutor(command) {
    if (command.includes('channel')) return 'channel_operator';
    if (command.includes('service')) return 'service_manager';
    if (command.includes('.js')) return 'local_script';
    return 'orchestrator';
}

function formatTask(task) {
    const lines = [
        'TASK_ID: ' + task.task_id,
        'STATUS: ' + task.status,
        'TYPE: ' + (task.executor_type || 'unknown'),
        'TITLE: ' + task.title,
        'RESULT: ' + (task.result_summary || 'None'),
        'BLOCKER: ' + (task.blocker || 'None'),
        'RELATED_RUN: ' + (task.related_run_id || 'NONE')
    ];
    return lines.join('\n');
}

module.exports = { handleCommand };
