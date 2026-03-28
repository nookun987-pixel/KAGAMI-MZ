const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = process.env.ROOT || process.cwd();

class VerificationLayer {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5000; // 5 seconds
  }

  _getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.time < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  _setCached(key, data) {
    this.cache.set(key, { data, time: Date.now() });
  }

  async httpCheck(url, timeout = 5000) {
    const cacheKey = `http_${url}`;
    const cached = this._getCached(cacheKey);
    if (cached) return cached;

    return new Promise((resolve) => {
      const req = http.get(url, (res) => {
        const result = {
          alive: res.statusCode >= 200 && res.statusCode < 300,
          statusCode: res.statusCode,
          error: null
        };
        this._setCached(cacheKey, result);
        resolve(result);
      });
      
      req.on('error', (err) => {
        const result = {
          alive: false,
          statusCode: null,
          error: err.code || err.message
        };
        this._setCached(cacheKey, result);
        resolve(result);
      });
      
      req.setTimeout(timeout, () => {
        req.destroy();
        const result = {
          alive: false,
          statusCode: null,
          error: 'timeout'
        };
        this._setCached(cacheKey, result);
        resolve(result);
      });
    });
  }

  async checkFooocus() {
    const result = await this.httpCheck('http://127.0.0.1:7865/');
    return {
      service: 'fooocus',
      port: 7865,
      alive: result.alive,
      status: result.alive ? 'ALIVE' : 'DEAD',
      error: result.error
    };
  }

  async checkOllama() {
    const result = await this.httpCheck('http://127.0.0.1:11434/api/tags');
    return {
      service: 'ollama',
      port: 11434,
      alive: result.alive,
      status: result.alive ? 'ALIVE' : 'DEAD',
      error: result.error
    };
  }

  checkEnvFile() {
    const envPath = path.join(ROOT, '.env');
    try {
      const exists = fs.existsSync(envPath);
      if (!exists) {
        return { present: false, keys: [], missing: true };
      }
      const content = fs.readFileSync(envPath, 'utf8');
      const keys = [];
      const lines = content.split('\n');
      for (const line of lines) {
        const match = line.match(/^([A-Z_]+)=/);
        if (match) {
          keys.push(match[1]);
        }
      }
      return { present: true, keys, missing: false, keyCount: keys.length };
    } catch (error) {
      return { present: false, keys: [], missing: true, error: error.message };
    }
  }

  checkGeminiKey() {
    const envCheck = this.checkEnvFile();
    if (!envCheck.present) return { present: false, status: 'MISSING' };
    
    const hasKey = envCheck.keys.some(k => 
      k.includes('GEMINI') || k.includes('GOOGLE_API')
    );
    
    return {
      present: hasKey,
      status: hasKey ? 'PRESENT' : 'MISSING'
    };
  }

  checkVisionValidator() {
    const envCheck = this.checkEnvFile();
    if (!envCheck.present) return { enabled: false, status: 'missing' };
    
    const envPath = path.join(ROOT, '.env');
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/USE_VISION_VALIDATOR=(\w+)/);
      const enabled = match && (match[1] === 'true' || match[1] === '1');
      
      return {
        enabled,
        status: enabled ? 'enabled' : 'disabled'
      };
    } catch {
      return { enabled: false, status: 'unknown' };
    }
  }

  checkTelegramBot() {
    // Check if the bot process is running by checking if we can reach the operator state
    try {
      const statePath = path.join(ROOT, 'mikage-operator', 'data', 'state.json');
      if (fs.existsSync(statePath)) {
        const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
        return {
          running: true,
          status: 'ALIVE',
          lastUpdate: state.last_updated || null
        };
      }
      return { running: false, status: 'UNKNOWN', lastUpdate: null };
    } catch {
      return { running: false, status: 'UNKNOWN', lastUpdate: null };
    }
  }

  async verifySystem() {
    const [fooocus, ollama, gemini, vision, telegram] = await Promise.all([
      this.checkFooocus(),
      this.checkOllama(),
      this.checkGeminiKey(),
      this.checkVisionValidator(),
      this.checkTelegramBot()
    ]);

    const allAlive = fooocus.alive && ollama.alive && gemini.present;
    const partial = (fooocus.alive || ollama.alive) && gemini.present;

    return {
      services: { fooocus, ollama, telegram },
      keys: { gemini, vision },
      verdict: allAlive ? 'ONLINE' : (partial ? 'PARTIAL' : 'OFFLINE'),
      timestamp: new Date().toISOString()
    };
  }

  async verifyImageLane() {
    const runsDir = path.join(ROOT, 'runs');
    
    // Find latest run folder
    let latestRun = null;
    let latestTime = 0;
    
    try {
      if (fs.existsSync(runsDir)) {
        const entries = fs.readdirSync(runsDir);
        for (const entry of entries) {
          const runPath = path.join(runsDir, entry);
          const stats = fs.statSync(runPath);
          if (stats.isDirectory() && stats.mtimeMs > latestTime) {
            latestTime = stats.mtimeMs;
            latestRun = entry;
          }
        }
      }
    } catch {
      // Ignore errors
    }

    if (!latestRun) {
      return {
        latestRun: null,
        outputPng: false,
        postValidation: null,
        geminiValidation: null,
        finalDecision: null,
        verdict: 'NO RUNS'
      };
    }

    const runPath = path.join(runsDir, latestRun);
    
    // Check artifacts
    const outputPng = fs.existsSync(path.join(runPath, 'output.png'));
    
    let postValidation = null;
    try {
      const postValPath = path.join(runPath, 'post_validation.json');
      if (fs.existsSync(postValPath)) {
        postValidation = JSON.parse(fs.readFileSync(postValPath, 'utf8'));
      }
    } catch {
      // Ignore
    }

    let geminiValidation = null;
    try {
      const gemValPath = path.join(runPath, 'gemini_validation.json');
      if (fs.existsSync(gemValPath)) {
        geminiValidation = JSON.parse(fs.readFileSync(gemValPath, 'utf8'));
      }
    } catch {
      // Ignore
    }

    let finalDecision = null;
    try {
      const finalPath = path.join(runPath, 'final_decision.json');
      if (fs.existsSync(finalPath)) {
        finalDecision = JSON.parse(fs.readFileSync(finalPath, 'utf8'));
      }
    } catch {
      // Ignore
    }

    const locked = outputPng && 
                   postValidation?.status === 'PASS' &&
                   geminiValidation?.pass_fail === 'PASS' &&
                   finalDecision?.decision === 'ALLOW';

    return {
      latestRun,
      outputPng,
      postValidation: postValidation?.status || 'MISSING',
      geminiValidation: geminiValidation?.pass_fail || 'MISSING',
      finalDecision: finalDecision?.decision || 'MISSING',
      verdict: locked ? 'IMAGE LANE LOCKED' : 'NOT LOCKED'
    };
  }

  async detectBrokenServices() {
    const [fooocus, ollama, gemini] = await Promise.all([
      this.checkFooocus(),
      this.checkOllama(),
      this.checkGeminiKey()
    ]);

    const broken = [];
    
    if (!fooocus.alive) {
      broken.push({
        service: 'fooocus',
        issue: fooocus.error || 'Service not responding',
        autoFixable: true
      });
    }
    
    if (!ollama.alive) {
      broken.push({
        service: 'ollama',
        issue: ollama.error || 'Service not responding',
        autoFixable: true
      });
    }
    
    if (!gemini.present) {
      broken.push({
        service: 'gemini_key',
        issue: 'API key not configured in .env',
        autoFixable: false
      });
    }

    return {
      allHealthy: broken.length === 0,
      brokenCount: broken.length,
      broken,
      timestamp: new Date().toISOString()
    };
  }
}

const verificationLayer = new VerificationLayer();

module.exports = verificationLayer;
