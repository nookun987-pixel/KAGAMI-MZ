const { spawn } = require('child_process');

async function getSystemStatus() {
  try {
    // Check key services
    const services = await checkServices();
    
    // Get system info
    const systemInfo = await getSystemInfo();
    
    return `SYSTEM STATUS:

🖥️  SERVICES:
${services.map(s => `  ${s.status} ${s.name} - ${s.details}`).join('\n')}

📊 SYSTEM:
  CPU: ${systemInfo.cpu}%
  Memory: ${systemInfo.memory}%
  Uptime: ${systemInfo.uptime}

🔄 LATEST RUN: ${systemInfo.latestRun}
📋 QUEUE: ${systemInfo.queueSize} tasks

⚠️  ALERTS: ${systemInfo.alerts.length || 0}
${systemInfo.alerts.map(a => `  • ${a}`).join('\n')}`;
    
  } catch (error) {
    return `SYSTEM STATUS ERROR: ${error.message}`;
  }
}

async function checkServices() {
  const services = [];
  
  // Check Fooocus (if installed)
  try {
    const result = await runCommand('tasklist | findstr python');
    const fooocusRunning = result.stdout.includes('python') && result.stdout.includes('fooocus');
    services.push({
      name: 'Fooocus',
      status: fooocusRunning ? '🟢' : '🔴',
      details: fooocusRunning ? 'Running' : 'Stopped'
    });
  } catch (error) {
    services.push({
      name: 'Fooocus',
      status: '🟡',
      details: 'Unknown'
    });
  }
  
  // Check Ollama
  try {
    const result = await runCommand('tasklist | findstr ollama');
    const ollamaRunning = result.stdout.includes('ollama');
    services.push({
      name: 'Ollama',
      status: ollamaRunning ? '🟢' : '🔴',
      details: ollamaRunning ? 'Running' : 'Stopped'
    });
  } catch (error) {
    services.push({
      name: 'Ollama',
      status: '🟡',
      details: 'Unknown'
    });
  }
  
  return services;
}

async function getSystemInfo() {
  return {
    cpu: Math.floor(Math.random() * 30) + 10, // Placeholder
    memory: Math.floor(Math.random() * 40) + 30, // Placeholder
    uptime: '2d 14h', // Placeholder
    latestRun: 'run_' + Date.now().toString().slice(-6),
    queueSize: 0,
    alerts: []
  };
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    const proc = spawn('cmd', ['/c', command], { stdio: 'pipe' });
    
    let stdout = '';
    let stderr = '';
    
    proc.stdout.on('data', (data) => stdout += data.toString());
    proc.stderr.on('data', (data) => stderr += data.toString());
    
    proc.on('close', (code) => {
      resolve({ stdout, stderr, code });
    });
    
    proc.on('error', reject);
  });
}

module.exports = { getSystemStatus };
