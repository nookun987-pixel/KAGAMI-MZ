const { spawn, exec } = require('child_process');
const path = require('path');
const http = require('http');
const { getState, updateState } = require('../telegram_bot/shared_state');

const ROOT = process.env.ROOT || process.cwd();

// Service configurations
const SERVICE_CONFIG = {
  fooocus: {
    name: 'fooocus',
    port: 7865,
    healthPath: '/',
    startCmd: ['python', ['scripts/fooocus_bridge.js'], { cwd: ROOT, detached: true, stdio: 'ignore', windowsHide: true }],
    stopCmd: (pid) => `taskkill /PID ${pid} /T /F`,
    stateKey: 'fooocusPid',
    timeout: 30000
  },
  ollama: {
    name: 'ollama',
    port: 11434,
    healthPath: '/api/tags',
    startCmd: ['ollama serve', [], { cwd: ROOT, detached: true, stdio: 'ignore', windowsHide: true, shell: true }],
    stopCmd: () => 'taskkill /IM ollama.exe /T /F',
    stateKey: 'ollamaPid',
    timeout: 30000
  }
};

class ServiceRunner {
  constructor() {
    this.runningOperations = new Map();
    this.operationTimeouts = new Map();
  }

  isOperationLocked(service) {
    return this.runningOperations.has(service);
  }

  lockOperation(service, operation) {
    this.runningOperations.set(service, operation);
    // Auto-unlock after timeout
    const timeout = setTimeout(() => {
      this.unlockOperation(service);
    }, 60000); // 60 second max lock
    this.operationTimeouts.set(service, timeout);
  }

  unlockOperation(service) {
    this.runningOperations.delete(service);
    const timeout = this.operationTimeouts.get(service);
    if (timeout) {
      clearTimeout(timeout);
      this.operationTimeouts.delete(service);
    }
  }

  async httpGet(url, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const req = http.get(url, (res) => {
        resolve({ statusCode: res.statusCode, statusMessage: res.statusMessage });
      });
      req.on('error', reject);
      req.setTimeout(timeout, () => {
        req.destroy();
        reject(new Error('timeout'));
      });
    });
  }

  async healthCheck(serviceName) {
    const config = SERVICE_CONFIG[serviceName];
    if (!config) {
      return { status: 'UNKNOWN', alive: false, error: 'Unknown service' };
    }

    const healthUrl = `http://127.0.0.1:${config.port}${config.healthPath}`;
    
    try {
      const response = await this.httpGet(healthUrl, 5000);
      const isHealthy = response.statusCode >= 200 && response.statusCode < 300;
      
      // Update state
      updateState(state => {
        if (!state.services) state.services = {};
        state.services[serviceName] = {
          name: serviceName,
          status: isHealthy ? 'ALIVE' : 'UNHEALTHY',
          last_checked_at: new Date().toISOString(),
          health_target: healthUrl,
          detail: `HTTP ${response.statusCode}`
        };
        return state;
      });
      
      return {
        status: isHealthy ? 'ALIVE' : 'UNHEALTHY',
        alive: isHealthy,
        error: isHealthy ? null : `HTTP ${response.statusCode}`,
        port: config.port
      };
    } catch (error) {
      const detail = error.code || error.message;
      
      // Update state
      updateState(state => {
        if (!state.services) state.services = {};
        state.services[serviceName] = {
          name: serviceName,
          status: 'DEAD',
          last_checked_at: new Date().toISOString(),
          health_target: healthUrl,
          detail: detail
        };
        return state;
      });
      
      return { status: 'DEAD', alive: false, error: detail, port: config.port };
    }
  }

  async isPidRunning(pid) {
    if (!pid) return false;
    return new Promise((resolve) => {
      exec(`tasklist /FI "PID eq ${pid}"`, (err, stdout) => {
        resolve(!err && stdout.includes(String(pid)));
      });
    });
  }

  async startService(serviceName) {
    const config = SERVICE_CONFIG[serviceName];
    if (!config) {
      return { success: false, error: 'Unknown service: ' + serviceName };
    }

    if (this.isOperationLocked(serviceName)) {
      return { success: false, error: `Operation already in progress for ${serviceName}` };
    }

    this.lockOperation(serviceName, 'start');

    try {
      // Check if already running
      const state = getState();
      const existingPid = state[config.stateKey];
      
      if (await this.isPidRunning(existingPid)) {
        // Check health
        const health = await this.healthCheck(serviceName);
        if (health.alive) {
          this.unlockOperation(serviceName);
          return { success: true, message: `${serviceName} already running. PID=${existingPid}`, wasAlreadyRunning: true };
        }
      }

      // Start service
      const [cmd, args, opts] = config.startCmd;
      const child = spawn(cmd, args, opts);
      child.unref();

      // Wait a moment for startup
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update state with new PID
      updateState(s => {
        s[config.stateKey] = child.pid;
        return s;
      });

      // Wait for health check
      let attempts = 0;
      const maxAttempts = 10;
      const interval = 3000;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, interval));
        
        const isRunning = await this.isPidRunning(child.pid);
        if (!isRunning) {
          this.unlockOperation(serviceName);
          return { success: false, error: `${serviceName} process died during startup` };
        }

        const health = await this.healthCheck(serviceName);
        if (health.alive) {
          this.unlockOperation(serviceName);
          return { 
            success: true, 
            message: `${serviceName} started and healthy. PID=${child.pid}`,
            pid: child.pid,
            health: health
          };
        }
        
        attempts++;
      }

      this.unlockOperation(serviceName);
      return { 
        success: false, 
        error: `${serviceName} started but health check timed out`,
        pid: child.pid
      };

    } catch (error) {
      this.unlockOperation(serviceName);
      return { success: false, error: error.message };
    }
  }

  async stopService(serviceName) {
    const config = SERVICE_CONFIG[serviceName];
    if (!config) {
      return { success: false, error: 'Unknown service: ' + serviceName };
    }

    if (this.isOperationLocked(serviceName)) {
      return { success: false, error: `Operation already in progress for ${serviceName}` };
    }

    this.lockOperation(serviceName, 'stop');

    try {
      const state = getState();
      const pid = state[config.stateKey];

      // Check if actually running
      const isRunning = pid ? await this.isPidRunning(pid) : false;
      
      if (!isRunning) {
        // Clear PID from state
        updateState(s => {
          s[config.stateKey] = null;
          return s;
        });
        this.unlockOperation(serviceName);
        return { success: true, message: `${serviceName} was not running`, wasAlreadyStopped: true };
      }

      // Execute stop command
      const stopCmd = config.stopCmd(pid);
      
      return new Promise((resolve) => {
        exec(stopCmd, (error, stdout, stderr) => {
          // Update state
          updateState(s => {
            s[config.stateKey] = null;
            return s;
          });

          this.unlockOperation(serviceName);
          
          if (error && !stderr.includes('not found')) {
            resolve({ 
              success: false, 
              error: `Failed to stop ${serviceName}: ${error.message}`,
              stderr: stderr
            });
          } else {
            resolve({ 
              success: true, 
              message: `Stopped ${serviceName}. PID=${pid}`,
              stdout: stdout,
              stderr: stderr
            });
          }
        });
      });

    } catch (error) {
      this.unlockOperation(serviceName);
      return { success: false, error: error.message };
    }
  }

  async restartService(serviceName) {
    if (this.isOperationLocked(serviceName)) {
      return { success: false, error: `Operation already in progress for ${serviceName}` };
    }

    this.lockOperation(serviceName, 'restart');

    try {
      // Stop
      const stopResult = await this.stopService(serviceName);
      
      // Wait
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Start
      const startResult = await this.startService(serviceName);
      
      // Verify health after restart
      if (startResult.success) {
        await new Promise(resolve => setTimeout(resolve, 2500));
        const health = await this.healthCheck(serviceName);
        
        this.unlockOperation(serviceName);
        
        return {
          success: health.alive,
          message: health.alive 
            ? `${serviceName} restarted successfully` 
            : `${serviceName} restarted but health check failed`,
          stopResult: { success: stopResult.success, message: stopResult.message },
          startResult: { success: startResult.success, message: startResult.message },
          health: health
        };
      } else {
        this.unlockOperation(serviceName);
        return {
          success: false,
          error: startResult.error,
          stopResult: { success: stopResult.success, message: stopResult.message },
          startResult: { success: startResult.success, error: startResult.error }
        };
      }
    } catch (error) {
      this.unlockOperation(serviceName);
      return { success: false, error: error.message };
    }
  }

  async getServiceStatus(serviceName) {
    const config = SERVICE_CONFIG[serviceName];
    if (!config) return { name: serviceName, status: 'UNKNOWN' };

    const state = getState();
    const pid = state[config.stateKey];
    const isRunning = pid ? await this.isPidRunning(pid) : false;
    
    return {
      name: serviceName,
      pid: pid,
      running: isRunning,
      status: isRunning ? 'RUNNING' : 'STOPPED'
    };
  }

  async getAllServicesStatus() {
    const result = {};
    for (const serviceName of Object.keys(SERVICE_CONFIG)) {
      result[serviceName] = await this.getServiceStatus(serviceName);
    }
    return result;
  }
}

const serviceRunner = new ServiceRunner();

module.exports = serviceRunner;
