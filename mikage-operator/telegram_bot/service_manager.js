const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const sharedState = require('./shared_state');

class ServiceManager {
  constructor() {
    this.processes = {};
    this.loadProcesses();
  }

  loadProcesses() {
    const services = sharedState.getServices();
    // Restore running processes if any
    Object.keys(services).forEach(service => {
      if (services[service].status === 'running') {
        // Note: In a real scenario, we'd need to track PIDs, but for simplicity, assume not running on restart
        services[service].status = 'stopped';
      }
    });
    sharedState.setServices(services);
  }

  async startService(serviceName) {
    const services = sharedState.getServices();
    if (!services[serviceName]) {
      services[serviceName] = { status: 'stopped', pid: null, lastCheck: null };
    }

    if (services[serviceName].status === 'running') {
      return { success: false, message: `${serviceName} already running` };
    }

    try {
      let command, args;
      switch (serviceName) {
        case 'fooocus':
          // Assume Fooocus is started via a script or command
          command = 'python';
          args = ['launch.py', '--port', '7860']; // Example, adjust as needed
          break;
        case 'ollama':
          command = 'ollama';
          args = ['serve'];
          break;
        case 'command_center':
          command = 'node';
          args = [path.join(__dirname, '..', 'command_center_server.js')];
          break;
        default:
          return { success: false, message: `Unknown service: ${serviceName}` };
      }

      const proc = spawn(command, args, { cwd: path.join(__dirname, '..'), detached: true, stdio: 'ignore' });
      proc.unref();

      services[serviceName].status = 'starting';
      services[serviceName].pid = proc.pid;
      services[serviceName].lastCheck = new Date().toISOString();
      sharedState.setServices(services);

      // Wait a bit and check health
      setTimeout(() => this.healthCheck(serviceName), 5000);

      return { success: true, message: `${serviceName} starting`, pid: proc.pid };
    } catch (error) {
      services[serviceName].status = 'error';
      sharedState.setServices(services);
      return { success: false, message: `Failed to start ${serviceName}: ${error.message}` };
    }
  }

  async stopService(serviceName) {
    const services = sharedState.getServices();
    if (!services[serviceName] || services[serviceName].status !== 'running') {
      return { success: false, message: `${serviceName} not running` };
    }

    try {
      if (services[serviceName].pid) {
        process.kill(services[serviceName].pid, 'SIGTERM');
      }
      services[serviceName].status = 'stopped';
      services[serviceName].pid = null;
      sharedState.setServices(services);
      return { success: true, message: `${serviceName} stopped` };
    } catch (error) {
      return { success: false, message: `Failed to stop ${serviceName}: ${error.message}` };
    }
  }

  async restartService(serviceName) {
    await this.stopService(serviceName);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return this.startService(serviceName);
  }

  async healthCheck(serviceName) {
    const services = sharedState.getServices();
    if (!services[serviceName]) {
      return { status: 'unknown', message: 'Service not configured' };
    }

    try {
      let isHealthy = false;
      switch (serviceName) {
        case 'fooocus':
          // Check if port 7860 is listening
          isHealthy = await this.checkPort(7860);
          break;
        case 'ollama':
          // Check if port 11434 is listening (default Ollama port)
          isHealthy = await this.checkPort(11434);
          break;
        case 'command_center':
          // Check if port 3000 is listening (assume default)
          isHealthy = await this.checkPort(3000);
          break;
        default:
          isHealthy = false;
      }

      services[serviceName].status = isHealthy ? 'running' : 'stopped';
      services[serviceName].lastCheck = new Date().toISOString();
      sharedState.setServices(services);

      return { status: services[serviceName].status, message: `${serviceName} is ${services[serviceName].status}` };
    } catch (error) {
      services[serviceName].status = 'error';
      sharedState.setServices(services);
      return { status: 'error', message: `Health check failed: ${error.message}` };
    }
  }

  async checkPort(port) {
    return new Promise((resolve) => {
      exec(`netstat -an | find "LISTENING" | find ":${port} "`, (error, stdout) => {
        resolve(!error && stdout.includes(`:${port} `));
      });
    });
  }

  getServiceStatus(serviceName) {
    const services = sharedState.getServices();
    return services[serviceName] || { status: 'unknown' };
  }

  getAllStatuses() {
    const services = sharedState.getServices();
    const statuses = {};
    for (const service of ['fooocus', 'ollama', 'command_center']) {
      statuses[service] = this.getServiceStatus(service);
    }
    return statuses;
  }
}

const serviceManager = new ServiceManager();

module.exports = serviceManager;