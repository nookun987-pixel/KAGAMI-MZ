const guard = require('./duplicate_guard');

async function runCommand(command, msg) {
  const taskId = 'task_' + Date.now();
  
  // GUARD: Check if task already running
  if (!guard.lockTask(taskId, { type: 'run_command', command, created: new Date().toISOString() })) {
    return `TASK_BLOCKED: Task already running. Cannot start duplicate.`;
  }
  
  // GUARD: Check active task count
  if (guard.getActiveTaskCount() > 1) { // >1 because we just locked our task
    guard.unlockTask(taskId);
    return `TASK_BLOCKED: Another task is already running. Active: ${guard.getActiveTaskCount()}`;
  }
  
  try {
    console.log(`[EXECUTOR] Running: ${command}`);
    
    // Basic command execution for now
    const { spawn } = require('child_process');
    
    return new Promise((resolve) => {
      const proc = spawn('cmd', ['/c', command], { 
        cwd: 'D:\\KAGAMI-MZ',
        stdio: 'pipe'
      });
      
      let output = '';
      let error = '';
      
      proc.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      proc.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      proc.on('close', (code) => {
        // Release task lock on completion
        guard.unlockTask(taskId);
        
        const result = code === 0 ? output : `ERROR: ${error}`;
        
        resolve(`TASK_ID: ${taskId}
STATUS: ${code === 0 ? 'DONE' : 'FAIL'}
COMMAND_RUN: ${command}
RESULT: ${result.slice(0, 500)}${result.length > 500 ? '...' : ''}
ARTIFACTS: Check latest run directory
BLOCKER: ${code !== 0 ? error : 'NONE'}
NEXT ACTION: ${code !== 0 ? 'Check error logs' : 'Review results'}`);
      });
    });
    
  } catch (error) {
    guard.unlockTask(taskId);
    return `TASK_ID: ${taskId}
STATUS: FAIL
COMMAND_RUN: ${command}
RESULT: Execution failed
ARTIFACTS: None
BLOCKER: ${error.message}
NEXT ACTION: Fix command syntax`;
  }
}

module.exports = { runCommand };
