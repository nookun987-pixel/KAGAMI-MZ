const { spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const stateStore = require('../agent/state_store');
const memoryBridge = require('../agent/memory_bridge');

const commandsFile = path.join(__dirname, '../config/commands.json');
const commands = fs.readJsonSync(commandsFile);
const runsDir = path.join(__dirname, '../data/runs');
fs.ensureDirSync(runsDir);

function runCommand(name, callback) {
  if (!commands[name]) {
    callback('Command not found');
    return;
  }
  const cmd = commands[name];
  const timestamp = Date.now();
  const runDir = path.join(runsDir, timestamp.toString());
  fs.ensureDirSync(runDir);
  const stdoutFile = path.join(runDir, 'stdout.log');
  const stderrFile = path.join(runDir, 'stderr.log');

  const child = spawn(cmd.command, cmd.args || [], { shell: false, cwd: cmd.cwd || process.cwd() });

  let stdout = '';
  let stderr = '';

  child.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  child.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  child.on('close', (code) => {
    let cleanedStdout = stdout.split('\n').filter(line => 
      !line.includes('dotenv') && 
      !line.includes('tip:') && 
      !line.includes('run anywhere') &&
      !line.includes('override existing env vars')
    ).join('\n');
    const log = `Exit code: ${code}\nStdout: ${cleanedStdout}\nStderr: ${stderr}`;
    stateStore.setLastLog(log);
    stateStore.setLastJob({ name, timestamp, code });
    memoryBridge.setLast(`Ran ${name} at ${timestamp}`);
    callback(log);
  });
}

function retryLast(callback) {
  const lastJob = stateStore.getLastJob();
  if (!lastJob) {
    callback('No last job');
    return;
  }
  stateStore.incrementRetryCount();
  runCommand(lastJob.name, callback);
}

module.exports = { runCommand, retryLast };