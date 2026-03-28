const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3031;
const ROOT = __dirname;
const RUNS_DIR = path.join(ROOT, 'runs');

// Helper functions
function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (_) {
    return null;
  }
}

function getLatestRun() {
  if (!fs.existsSync(RUNS_DIR)) return null;
  
  const runs = fs.readdirSync(RUNS_DIR)
    .map(name => ({
      name,
      path: path.join(RUNS_DIR, name),
      stats: fs.statSync(path.join(RUNS_DIR, name))
    }))
    .filter(run => run.stats.isDirectory())
    .sort((a, b) => b.stats.mtime - a.stats.mtime);
  
  return runs.length > 0 ? runs[0] : null;
}

async function probeService(url, timeoutMs = 3000) {
  if (!url) return { ok: false, status: 0, error: "URL_MISSING" };
  
  return new Promise((resolve) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    
    fetch(url, { signal: controller.signal })
      .then(r => resolve({ ok: r.ok, status: r.status, error: null }))
      .catch(e => resolve({ ok: false, status: 0, error: e.message }))
      .finally(() => clearTimeout(timer));
  });
}

// API endpoints
const server = http.createServer(async (req, res) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  Object.entries(cors).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  
  try {
    switch (path) {
      case '/health':
        const orchestrator = await probeService('http://localhost:3030/health');
        const fooocus = await probeService('http://127.0.0.1:7865/');
        const ollama = await probeService('http://127.0.0.1:11434/api/tags');
        const gemini = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_KEY);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          system: "MIKAGE",
          status: orchestrator.ok && fooocus.ok ? "ONLINE" : "DEGRADED",
          time: new Date().toISOString(),
          services: {
            orchestrator: {
              status: orchestrator.ok ? "UP" : "DOWN",
              detail: orchestrator.error || `HTTP ${orchestrator.status}`
            },
            fooocus: {
              status: fooocus.ok ? "UP" : "DOWN", 
              detail: fooocus.error || `HTTP ${fooocus.status}`
            },
            ollama: {
              status: ollama.ok ? "UP" : "DOWN",
              detail: ollama.error || `HTTP ${ollama.status}`
            },
            gemini: {
              status: gemini ? "KEY_SET" : "NO_KEY",
              detail: gemini ? "API key configured" : "GEMINI_API_KEY not set"
            }
          }
        }));
        break;
        
      case '/services':
        const servicesHealth = await probeAllServices();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(servicesHealth));
        break;
        
      case '/latest-run':
        const latestRun = getLatestRun();
        if (!latestRun) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "No runs found" }));
          break;
        }
        
        const finalDecision = readJsonSafe(path.join(latestRun.path, 'final_decision.json'));
        const geminiValidation = readJsonSafe(path.join(latestRun.path, 'gemini_validation.json'));
        const jobSummary = readJsonSafe(path.join(latestRun.path, 'job_summary.json'));
        const outputPath = path.join(latestRun.path, 'output.png');
        const outputExists = fs.existsSync(outputPath);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          job_id: latestRun.name,
          timestamp: latestRun.stats.mtime.toISOString(),
          final_decision: finalDecision,
          gemini_validation: geminiValidation,
          job_summary: jobSummary,
          output_exists: outputExists
        }));
        break;
        
      case '/logs':
        const latestRunForLogs = getLatestRun();
        if (!latestRunForLogs) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ logs: ["No runs found"] }));
          break;
        }
        
        const logFiles = ['gemini_intake.log', 'orchestrator.log', 'render.log'].map(file => 
          path.join(latestRunForLogs.path, file)
        ).filter(file => fs.existsSync(file));
        
        const logs = logFiles.map(logFile => {
          try {
            const content = fs.readFileSync(logFile, 'utf8');
            const lines = content.split('\n').filter(line => line.trim());
            return lines.slice(-10); // Last 10 lines
          } catch (e) {
            return [`Error reading ${path.basename(logFile)}: ${e.message}`];
          }
        }).flat();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ logs }));
        break;
        
      case '/artifacts/latest':
        const latestRunForArtifacts = getLatestRun();
        if (!latestRunForArtifacts) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "No runs found" }));
          break;
        }
        
        const artifactsDir = latestRunForArtifacts.path;
        const artifacts = fs.readdirSync(artifactsDir).map(file => {
          const filePath = path.join(artifactsDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: stats.size,
            modified: stats.mtime.toISOString(),
            type: stats.isDirectory() ? 'directory' : 'file'
          };
        });
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ artifacts }));
        break;
        
      // Queue endpoints (locked)
      case '/queue':
        const queueHandler = require('./local_bridge/queue-locked');
        await queueHandler(req, res);
        break;
        
      case '/approve-job':
        const approveHandler = require('./local_bridge/approve-job-locked');
        await approveHandler(req, res);
        break;
        
      case '/create-job':
        const createHandler = require('./local_bridge/create-job-locked');
        await createHandler(req, res);
        break;
        
      default:
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Not found" }));
        break;
    }
  } catch (error) {
    console.error('[BRIDGE] Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
});

async function probeAllServices() {
  const orchestrator = await probeService('http://localhost:3030/health');
  const fooocus = await probeService('http://127.0.0.1:7865/');
  const ollama = await probeService('http://127.0.0.1:11434/api/tags');
  const gemini = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_KEY);
  
  return {
    orchestrator: {
      status: orchestrator.ok ? "UP" : "DOWN",
      detail: orchestrator.error || `HTTP ${orchestrator.status}`
    },
    fooocus: {
      status: fooocus.ok ? "UP" : "DOWN", 
      detail: fooocus.error || `HTTP ${fooocus.status}`
    },
    ollama: {
      status: ollama.ok ? "UP" : "DOWN",
      detail: ollama.error || `HTTP ${ollama.status}`
    },
    gemini: {
      status: gemini ? "KEY_SET" : "NO_KEY",
      detail: gemini ? "API key configured" : "GEMINI_API_KEY not set"
    }
  };
}

server.listen(PORT, () => {
  console.log(`🔗 Mikage Local Bridge running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET /health - System health status`);
  console.log(`   GET /services - Service health details`);
  console.log(`   GET /latest-run - Latest run information`);
  console.log(`   GET /logs - Latest run logs`);
  console.log(`   GET /artifacts/latest - Latest run artifacts`);
  console.log(`   GET /queue - Get queued jobs`);
  console.log(`   POST /create-job - Create queued job`);
  console.log(`   POST /approve-job - Approve job for execution`);
});
