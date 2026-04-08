const { spawn } = require('child_process');
const path = require('path');
const taskManager = require('./task_manager');
const serviceManager = require('./service_manager');
const artifactRegistry = require('./artifact_registry');

async function execute(task, callback) {
  const executorType = task.executor_type;
  taskManager.setTaskRunning(task.task_id);

  try {
    let result;
    if (executorType === 'orchestrator') {
      result = await executeOrchestrator(task);
    } else if (executorType === 'channel_operator') {
      result = await executeChannelOperator(task);
    } else if (executorType === 'service_action') {
      result = await executeServiceAction(task);
    } else if (executorType === 'local_script') {
      result = await executeLocalScript(task);
    } else if (executorType === 'reporting') {
      result = await executeReporting(task);
    } else {
      result = await executeDefault(task);
    }

    if (result.success) {
      taskManager.setTaskCompleted(task.task_id, result.output, result.artifact_paths);
    } else {
      taskManager.setTaskFailed(task.task_id, result.blocker);
    }

    callback(result);
  } catch (error) {
    taskManager.setTaskFailed(task.task_id, error.message);
    callback({ success: false, output: '', blocker: error.message, artifact_paths: [] });
  }
}

async function executeOrchestrator(task) {
  // Auto-recovery: check services
  const requiredServices = ['ollama']; // Assume orchestrator needs Ollama
  for (const service of requiredServices) {
    const status = await serviceManager.healthCheck(service);
    if (status.status !== 'running') {
      const startResult = await serviceManager.startService(service);
      if (!startResult.success) {
        return { success: false, output: '', blocker: `Failed to start ${service}`, artifact_paths: [] };
      }
      // Wait for health
      await new Promise(resolve => setTimeout(resolve, 10000));
      const recheck = await serviceManager.healthCheck(service);
      if (recheck.status !== 'running') {
        return { success: false, output: '', blocker: `${service} failed to start`, artifact_paths: [] };
      }
    }
  }

  return new Promise((resolve) => {
    const child = spawn('node', ['orchestrator.js', task.raw_command], { cwd: path.join(__dirname, '..') });
    let output = '';
    child.stdout.on('data', (data) => output += data.toString());
    child.stderr.on('data', (data) => output += data.toString());
    child.on('close', (code) => {
      const artifactPaths = artifactRegistry.scanForArtifacts();
      resolve({
        success: code === 0,
        output: output,
        blocker: code !== 0 ? 'Execution failed' : '',
        artifact_paths: artifactPaths
      });
    });
  });
}

async function executeChannelOperator(task) {
  // Similar auto-recovery if needed
  return new Promise((resolve) => {
    const child = spawn('node', ['mikage-channel-operator/index.js'], { cwd: path.join(__dirname, '..') });
    let output = '';
    child.stdout.on('data', (data) => output += data.toString());
    child.stderr.on('data', (data) => output += data.toString());
    child.on('close', (code) => {
      const artifactPaths = artifactRegistry.scanForArtifacts();
      resolve({
        success: code === 0,
        output: output,
        blocker: code !== 0 ? 'Channel operator failed' : '',
        artifact_paths: artifactPaths
      });
    });
  });
}

async function executeServiceAction(task) {
  const action = task.raw_command.split(' ')[1]; // e.g., /run start fooocus
  const service = task.raw_command.split(' ')[2];
  let result;
  if (action === 'start') {
    result = await serviceManager.startService(service);
  } else if (action === 'stop') {
    result = await serviceManager.stopService(service);
  } else if (action === 'restart') {
    result = await serviceManager.restartService(service);
  } else {
    result = { success: false, message: 'Unknown action' };
  }
  return {
    success: result.success,
    output: result.message,
    blocker: result.success ? '' : result.message,
    artifact_paths: []
  };
}

async function executeLocalScript(task) {
  const script = task.raw_command.replace('/run ', '');
  return new Promise((resolve) => {
    const child = spawn('node', [script], { cwd: path.join(__dirname, '..') });
    let output = '';
    child.stdout.on('data', (data) => output += data.toString());
    child.stderr.on('data', (data) => output += data.toString());
    child.on('close', (code) => {
      resolve({
        success: code === 0,
        output: output,
        blocker: code !== 0 ? 'Script failed' : '',
        artifact_paths: []
      });
    });
  });
}

async function executeReporting(task) {
  // Reporting is handled in router, not here
  return { success: true, output: 'Report generated', blocker: '', artifact_paths: [] };
}

async function executeDefault(task) {
  return { success: false, output: '', blocker: 'Unknown executor type', artifact_paths: [] };
}

module.exports = { execute };