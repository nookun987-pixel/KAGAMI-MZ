const { spawn } = require('child_process');

async function restartService(serviceName) {
  const services = {
    'fooocus': {
      start: 'cd D:\\KAGAMI-MZ && python launch.py',
      check: 'tasklist | findstr python'
    },
    'ollama': {
      start: 'ollama serve',
      check: 'tasklist | findstr ollama'
    }
  };
  
  const service = services[serviceName?.toLowerCase()];
  if (!service) {
    return `SERVICE: ${serviceName}
STATUS: ERROR
ACTION: Unknown service. Use: fooocus, ollama`;
  }
  
  try {
    console.log(`[SERVICE] Restarting ${serviceName}...`);
    
    // Check if running
    const checkResult = await runCommand(service.check);
    const isRunning = checkResult.stdout.includes(serviceName);
    
    if (isRunning) {
      // Stop service (basic approach)
      await runCommand(`taskkill /f /im ${serviceName}.exe 2>nul || taskkill /f /im python.exe 2>nul`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    }
    
    // Start service
    console.log(`[SERVICE] Starting ${serviceName}...`);
    const startResult = await runCommand(service.start, 10000); // 10 second timeout
    
    return `SERVICE: ${serviceName}
STATUS: RESTARTED
ACTION: Service restart initiated
COMMAND_RUN: ${service.start}
RESULT: ${startResult.success ? 'Service starting' : 'Start failed'}
ARTIFACTS: None
BLOCKER: ${startResult.success ? 'NONE' : 'Service failed to start'}
NEXT ACTION: ${startResult.success ? 'Monitor health' : 'Check service configuration'}`;
    
  } catch (error) {
    return `SERVICE: ${serviceName}
STATUS: ERROR
ACTION: Restart failed
BLOCKER: ${error.message}
NEXT ACTION: Check service logs`;
  }
}

function runCommand(command, timeout = 5000) {
  return new Promise((resolve) => {
    const proc = spawn('cmd', ['/c', command], { stdio: 'pipe' });
    
    let stdout = '';
    let stderr = '';
    let resolved = false;
    
    proc.stdout.on('data', (data) => stdout += data.toString());
    proc.stderr.on('data', (data) => stderr += data.toString());
    
    proc.on('close', (code) => {
      if (!resolved) {
        resolved = true;
        resolve({ stdout, stderr, code, success: code === 0 });
      }
    });
    
    proc.on('error', () => {
      if (!resolved) {
        resolved = true;
        resolve({ stdout, stderr, code: 1, success: false });
      }
    });
    
    // Timeout
    if (timeout) {
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          proc.kill();
          resolve({ stdout, stderr: 'TIMEOUT', code: 1, success: false });
        }
      }, timeout);
    }
  });
}

module.exports = { restartService };
