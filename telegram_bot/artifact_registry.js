const fs = require('fs');
const path = require('path');

const ARTIFACTS_FILE = path.join(__dirname, '../data/artifacts.json');
const RUNS_DIR = path.join(__dirname, '../runs');

function ensureArtifactsFile() {
  if (!fs.existsSync(ARTIFACTS_FILE)) {
    fs.writeFileSync(ARTIFACTS_FILE, JSON.stringify({ artifacts: [] }, null, 2));
  }
}

function loadArtifacts() {
  ensureArtifactsFile();
  try {
    return JSON.parse(fs.readFileSync(ARTIFACTS_FILE, 'utf-8'));
  } catch (error) {
    return { artifacts: [] };
  }
}

function saveArtifacts(data) {
  fs.writeFileSync(ARTIFACTS_FILE, JSON.stringify(data, null, 2));
}

async function getLatest() {
  const data = loadArtifacts();
  
  // Get latest run directory
  if (fs.existsSync(RUNS_DIR)) {
    const runDirs = fs.readdirSync(RUNS_DIR)
      .filter(name => name.startsWith('run_'))
      .sort()
      .reverse();
    
    if (runDirs.length > 0) {
      const latestRun = runDirs[0];
      const runPath = path.join(RUNS_DIR, latestRun);
      
      let artifacts = [];
      try {
        artifacts = fs.readdirSync(runPath);
      } catch (error) {
        console.warn('[ARTIFACTS] Cannot read run directory:', error.message);
      }
      
      return `LATEST RUN: ${latestRun}

ARTIFACTS:
${artifacts.map(f => `  📁 ${f}`).join('\n')}

PATH: ${runPath}

RECENT DECISIONS:
${data.artifacts.slice(-3).reverse().map(a => 
  `  📄 ${a.path} (${new Date(a.timestamp).toLocaleString()})`
).join('\n')}`;
    }
  }
  
  return 'NO ARTIFACTS FOUND';
}

module.exports = { getLatest };
