const serviceRunner = require('./service_runner');
const verificationLayer = require('./verification_layer');
const proofReader = require('../mikage-operator/lib/proof_reader');

class MasterControl {
  constructor() {
    this.globalLock = false;
    this.lastOperation = null;
  }

  isLocked() {
    return this.globalLock;
  }

  lock(operation) {
    this.globalLock = true;
    this.lastOperation = operation;
    // Auto-unlock after 2 minutes as safety
    setTimeout(() => {
      this.globalLock = false;
    }, 120000);
  }

  unlock() {
    this.globalLock = false;
    this.lastOperation = null;
  }

  // ─── BOOT ─────────────────────────────────────────────────────────
  async boot() {
    if (this.isLocked()) {
      return {
        success: false,
        error: `Another operation in progress: ${this.lastOperation}`,
        verdict: 'BLOCKED'
      };
    }

    this.lock('boot');
    const results = [];

    try {
      // 1. Start Fooocus
      const fooocusResult = await serviceRunner.startService('fooocus');
      results.push({
        service: 'Fooocus',
        action: 'START',
        before: fooocusResult.wasAlreadyRunning ? 'RUNNING' : 'STOPPED',
        after: fooocusResult.success ? 'ALIVE' : 'FAILED',
        error: fooocusResult.error || null
      });

      // 2. Start Ollama
      const ollamaResult = await serviceRunner.startService('ollama');
      results.push({
        service: 'Ollama',
        action: 'START',
        before: ollamaResult.wasAlreadyRunning ? 'RUNNING' : 'STOPPED',
        after: ollamaResult.success ? 'ALIVE' : 'FAILED',
        error: ollamaResult.error || null
      });

      // 3. Check keys
      const geminiCheck = verificationLayer.checkGeminiKey();
      const visionCheck = verificationLayer.checkVisionValidator();

      results.push({
        service: 'Gemini Key',
        action: 'CHECK',
        before: geminiCheck.status,
        after: geminiCheck.status,
        error: geminiCheck.status === 'MISSING' ? 'Key not in .env' : null
      });

      results.push({
        service: 'Vision Validator',
        action: 'CHECK',
        before: visionCheck.status,
        after: visionCheck.status,
        error: null
      });

      // 4. Final verification
      const finalVerify = await verificationLayer.verifySystem();

      this.unlock();

      return {
        success: true,
        results,
        verdict: finalVerify.verdict,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.unlock();
      return {
        success: false,
        error: error.message,
        results,
        verdict: 'ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ─── HEAL ─────────────────────────────────────────────────────────
  async heal() {
    if (this.isLocked()) {
      return {
        success: false,
        error: `Another operation in progress: ${this.lastOperation}`,
        verdict: 'BLOCKED'
      };
    }

    this.lock('heal');

    try {
      // 1. Detect broken services
      const detection = await verificationLayer.detectBrokenServices();
      
      if (detection.allHealthy) {
        this.unlock();
        return {
          success: true,
          wasBroken: [],
          actionsTaken: [],
          stillBroken: [],
          verdict: 'HEALTHY',
          timestamp: new Date().toISOString()
        };
      }

      const wasBroken = detection.broken.map(b => b.service);
      const actionsTaken = [];
      const stillBroken = [];

      // 2. Try to fix auto-fixable services
      for (const item of detection.broken) {
        if (item.autoFixable && (item.service === 'fooocus' || item.service === 'ollama')) {
          const restartResult = await serviceRunner.restartService(item.service);
          
          if (restartResult.success && restartResult.health?.alive) {
            actionsTaken.push({
              service: item.service,
              action: 'RESTARTED',
              result: 'SUCCESS'
            });
          } else {
            actionsTaken.push({
              service: item.service,
              action: 'RESTARTED',
              result: 'FAILED',
              error: restartResult.error || 'Health check failed after restart'
            });
            stillBroken.push(item.service);
          }
        } else {
          actionsTaken.push({
            service: item.service,
            action: 'MANUAL_REQUIRED',
            result: 'SKIPPED',
            reason: 'Not auto-fixable'
          });
          stillBroken.push(item.service);
        }
      }

      // 3. Final verification
      const finalCheck = await verificationLayer.detectBrokenServices();
      const remainingBroken = finalCheck.broken.map(b => b.service);

      this.unlock();

      return {
        success: remainingBroken.length === 0,
        wasBroken,
        actionsTaken,
        stillBroken: remainingBroken,
        verdict: remainingBroken.length === 0 ? 'HEALED' : 'PARTIAL',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.unlock();
      return {
        success: false,
        error: error.message,
        verdict: 'ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ─── PROOF ──────────────────────────────────────────────────────────
  async proof() {
    const [systemProof, imageLaneProof, proof] = await Promise.all([
      verificationLayer.verifySystem(),
      verificationLayer.verifyImageLane(),
      proofReader.generateCommanderProof()
    ]);

    return {
      system: {
        fooocus: systemProof.services.fooocus.status,
        ollama: systemProof.services.ollama.status,
        telegram: systemProof.services.telegram.status,
        gemini: systemProof.keys.gemini.status,
        vision: systemProof.keys.vision.status
      },
      imageLane: {
        latestRun: imageLaneProof.latestRun,
        outputPng: imageLaneProof.outputPng ? 'PRESENT' : 'MISSING',
        postValidation: imageLaneProof.postValidation,
        geminiValidation: imageLaneProof.geminiValidation,
        finalDecision: imageLaneProof.finalDecision,
        verdict: imageLaneProof.verdict
      },
      latestRun: proof.latest_run_proof,
      queue: proof.task_queue_proof,
      timestamp: new Date().toISOString()
    };
  }

  // ─── MASTER STATUS ────────────────────────────────────────────────
  async masterStatus() {
    const [systemProof, imageLaneProof, allServices] = await Promise.all([
      verificationLayer.verifySystem(),
      verificationLayer.verifyImageLane(),
      serviceRunner.getAllServicesStatus()
    ]);

    // Get latest run info
    let latestRun = null;
    try {
      const runsDir = require('path').join(process.cwd(), 'runs');
      const fs = require('fs');
      
      if (fs.existsSync(runsDir)) {
        const runs = fs.readdirSync(runsDir)
          .filter(f => fs.statSync(require('path').join(runsDir, f)).isDirectory())
          .sort((a, b) => {
            const aStat = fs.statSync(require('path').join(runsDir, a));
            const bStat = fs.statSync(require('path').join(runsDir, b));
            return bStat.mtimeMs - aStat.mtimeMs;
          });
        
        if (runs.length > 0) {
          latestRun = runs[0];
        }
      }
    } catch {
      // Ignore
    }

    return {
      services: {
        fooocus: {
          status: systemProof.services.fooocus.status,
          port: systemProof.services.fooocus.port
        },
        ollama: {
          status: systemProof.services.ollama.status,
          port: systemProof.services.ollama.port
        },
        telegram: {
          status: systemProof.services.telegram.status
        }
      },
      keys: {
        gemini: systemProof.keys.gemini.status,
        vision: systemProof.keys.vision.status
      },
      imageLane: {
        verdict: imageLaneProof.verdict,
        latestRun: imageLaneProof.latestRun
      },
      latestRun: latestRun,
      overall: systemProof.verdict,
      timestamp: new Date().toISOString()
    };
  }

  // ─── START ALL ────────────────────────────────────────────────────
  async startAll() {
    if (this.isLocked()) {
      return {
        success: false,
        error: `Another operation in progress: ${this.lastOperation}`,
        verdict: 'BLOCKED'
      };
    }

    this.lock('start-all');

    const results = [];
    
    try {
      // Start in sequence
      const fooocusResult = await serviceRunner.startService('fooocus');
      results.push({ service: 'fooocus', ...fooocusResult });

      const ollamaResult = await serviceRunner.startService('ollama');
      results.push({ service: 'ollama', ...ollamaResult });

      const allSuccess = results.every(r => r.success);
      
      this.unlock();

      return {
        success: allSuccess,
        results,
        verdict: allSuccess ? 'STARTED' : 'PARTIAL',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.unlock();
      return {
        success: false,
        error: error.message,
        results,
        verdict: 'ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ─── STOP ALL ─────────────────────────────────────────────────────
  async stopAll() {
    if (this.isLocked()) {
      return {
        success: false,
        error: `Another operation in progress: ${this.lastOperation}`,
        verdict: 'BLOCKED'
      };
    }

    this.lock('stop-all');

    const results = [];
    
    try {
      // Stop in sequence (reverse order)
      const ollamaResult = await serviceRunner.stopService('ollama');
      results.push({ service: 'ollama', ...ollamaResult });

      const fooocusResult = await serviceRunner.stopService('fooocus');
      results.push({ service: 'fooocus', ...fooocusResult });

      const allSuccess = results.every(r => r.success);
      
      this.unlock();

      return {
        success: allSuccess,
        results,
        verdict: allSuccess ? 'STOPPED' : 'PARTIAL',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.unlock();
      return {
        success: false,
        error: error.message,
        results,
        verdict: 'ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ─── RESTART ALL ──────────────────────────────────────────────────
  async restartAll() {
    if (this.isLocked()) {
      return {
        success: false,
        error: `Another operation in progress: ${this.lastOperation}`,
        verdict: 'BLOCKED'
      };
    }

    this.lock('restart-all');

    const results = [];
    
    try {
      // Restart in sequence
      const fooocusResult = await serviceRunner.restartService('fooocus');
      results.push({ service: 'fooocus', ...fooocusResult });

      const ollamaResult = await serviceRunner.restartService('ollama');
      results.push({ service: 'ollama', ...ollamaResult });

      const allSuccess = results.every(r => r.success && r.health?.alive);
      
      this.unlock();

      return {
        success: allSuccess,
        results,
        verdict: allSuccess ? 'RESTARTED' : 'PARTIAL',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.unlock();
      return {
        success: false,
        error: error.message,
        results,
        verdict: 'ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }
}

const masterControl = new MasterControl();

module.exports = masterControl;
