const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const RUNS_DIR = path.join(ROOT, 'runs');
const DATA_DIR = path.join(ROOT, 'data');

function readJsonSafe(filePath) {
    try {
        if (!fs.existsSync(filePath)) return null;
        const content = fs.readFileSync(filePath, 'utf8');
        if (!content.trim()) return null;
        return JSON.parse(content);
    } catch (err) {
        return { _error: 'PARSE_FAIL', _file: filePath, _message: err.message };
    }
}

function httpGet(url, timeout = 5000) {
    return new Promise((resolve) => {
        const req = http.get(url, (res) => {
            resolve({ 
                statusCode: res.statusCode, 
                alive: res.statusCode >= 200 && res.statusCode < 300 
            });
        });
        req.on('error', (err) => {
            resolve({ statusCode: 0, alive: false, error: err.code || err.message });
        });
        req.setTimeout(timeout, () => {
            req.destroy();
            resolve({ statusCode: 0, alive: false, error: 'timeout' });
        });
    });
}

async function checkFooocus() {
    const result = await httpGet('http://127.0.0.1:7865/');
    return result.alive ? 'ALIVE' : 'DEAD';
}

async function checkOllama() {
    const result = await httpGet('http://127.0.0.1:11434/api/tags');
    return result.alive ? 'ALIVE' : 'DEAD';
}

function checkGeminiKey() {
    const envPath = path.join(ROOT, '.env');
    if (!fs.existsSync(envPath)) return 'MISSING';
    const content = fs.readFileSync(envPath, 'utf8');
    const hasKey = content.includes('GEMINI_API_KEY') && content.match(/GEMINI_API_KEY=[^\s]+/);
    return hasKey ? 'PRESENT' : 'MISSING';
}

function checkVisionValidator() {
    const envPath = path.join(ROOT, '.env');
    if (!fs.existsSync(envPath)) return 'missing';
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/USE_VISION_VALIDATOR=(true|false)/i);
    return match ? match[1].toLowerCase() : 'missing';
}

function getLatestRunFolder() {
    if (!fs.existsSync(RUNS_DIR)) return null;
    const entries = fs.readdirSync(RUNS_DIR, { withFileTypes: true })
        .filter(e => e.isDirectory() && !e.name.startsWith('--') && !e.name.startsWith('_'))
        .map(e => ({
            name: e.name,
            path: path.join(RUNS_DIR, e.name),
            mtime: fs.statSync(path.join(RUNS_DIR, e.name)).mtime
        }))
        .sort((a, b) => b.mtime - a.mtime);
    return entries[0] || null;
}

function checkFileExists(folderPath, filename) {
    return fs.existsSync(path.join(folderPath, filename));
}

function readRunJson(folderPath, filename) {
    return readJsonSafe(path.join(folderPath, filename));
}

function listArtifacts(folderPath) {
    if (!fs.existsSync(folderPath)) return [];
    return fs.readdirSync(folderPath)
        .filter(f => f.endsWith('.json') || f.endsWith('.png') || f.endsWith('.txt'))
        .map(f => ({
            name: f,
            size: fs.statSync(path.join(folderPath, f)).size,
            modified: fs.statSync(path.join(folderPath, f)).mtime.toISOString()
        }))
        .sort((a, b) => new Date(b.modified) - new Date(a.modified));
}

async function generateCommanderProof() {
    const latestRun = getLatestRunFolder();
    const runPath = latestRun ? latestRun.path : null;
    
    // System Proof
    const fooocusStatus = await checkFooocus();
    const ollamaStatus = await checkOllama();
    const geminiKeyStatus = checkGeminiKey();
    const visionValidator = checkVisionValidator();
    
    // Image Lane Proof
    let imageLaneProof = {
        latest_run_path: runPath || 'MISSING',
        output_png: 'MISSING',
        post_validation: 'MISSING',
        gemini_validation: 'MISSING',
        final_decision: 'MISSING',
        final_reason: '',
        verdict: 'IMAGE LANE NOT LOCKED'
    };
    
    if (runPath) {
        imageLaneProof.output_png = checkFileExists(runPath, 'output.png') ? 'PRESENT' : 'MISSING';
        
        const postVal = readRunJson(runPath, 'post_validation.json');
        imageLaneProof.post_validation = postVal ? (postVal.pass_fail || 'PARSE_FAIL') : 'MISSING';
        
        const geminiVal = readRunJson(runPath, 'gemini_validation.json');
        imageLaneProof.gemini_validation = geminiVal ? (geminiVal.pass_fail || 'PARSE_FAIL') : 'MISSING';
        
        const finalDec = readRunJson(runPath, 'final_decision.json');
        imageLaneProof.final_decision = finalDec ? (finalDec.decision || 'PARSE_FAIL') : 'MISSING';
        imageLaneProof.final_reason = finalDec ? (finalDec.reason || finalDec.reject_reason || '') : '';
        
        // Verdict calculation
        const allPass = 
            fooocusStatus === 'ALIVE' &&
            imageLaneProof.output_png === 'PRESENT' &&
            imageLaneProof.post_validation === 'PASS' &&
            imageLaneProof.gemini_validation === 'PASS' &&
            imageLaneProof.final_decision === 'ALLOW';
        
        imageLaneProof.verdict = allPass ? 'IMAGE LANE LOCKED' : 'IMAGE LANE NOT LOCKED';
    }
    
    // Latest Run Proof
    let latestRunProof = {
        run_folder: latestRun ? latestRun.name : 'NONE',
        created_at: latestRun ? latestRun.mtime.toISOString() : '-',
        artifacts: runPath ? listArtifacts(runPath) : [],
        summary: {}
    };
    
    if (runPath) {
        const jobSummary = readRunJson(runPath, 'job_summary.json');
        if (jobSummary && !jobSummary._error) {
            latestRunProof.summary = {
                job_id: jobSummary.job_id || '-',
                status: jobSummary.status || '-',
                result: jobSummary.result || '-'
            };
        }
    }
    
    // Failure Center
    let failureCenter = {
        latest_reject_reason: imageLaneProof.final_reason || '-',
        failed_rules: [],
        validator_fail_source: '-',
        gemini_fail_source: '-',
        no_image_fail: imageLaneProof.output_png === 'MISSING'
    };
    
    if (runPath) {
        const postVal = readRunJson(runPath, 'post_validation.json');
        if (postVal && postVal.failed_rules) {
            failureCenter.failed_rules = postVal.failed_rules;
            failureCenter.validator_fail_source = 'post_validation';
        }
        
        const geminiVal = readRunJson(runPath, 'gemini_validation.json');
        if (geminiVal && geminiVal.fail_reasons) {
            failureCenter.gemini_fail_source = geminiVal.fail_reasons.join(' | ');
        }
    }
    
    // Task/Queue Proof (from data dir)
    const tasks = readJsonSafe(path.join(DATA_DIR, 'tasks.json')) || [];
    const runs = readJsonSafe(path.join(DATA_DIR, 'runs.json')) || [];
    
    const taskProof = {
        pending: tasks.filter(t => t.status === 'NEW' || t.status === 'PENDING').length,
        running: tasks.filter(t => t.status === 'RUNNING').length,
        failed: tasks.filter(t => t.status === 'FAIL' || t.status === 'FAILED').length,
        done: tasks.filter(t => t.status === 'DONE' || t.status === 'COMPLETED').length,
        latest_task: tasks.length > 0 ? tasks[tasks.length - 1] : null
    };
    
    // Cost/Runtime Proof
    const costs = readJsonSafe(path.join(DATA_DIR, 'costs.json')) || [];
    
    let runtimeProof = {
        total_runs: runs.length,
        latest_duration: '-',
        average_duration: '-',
        total_cost: costs.reduce((sum, c) => sum + (c.amount || 0), 0)
    };
    
    if (runPath) {
        const renderTiming = readRunJson(runPath, 'render_timing.json');
        if (renderTiming && renderTiming.total_duration_ms) {
            runtimeProof.latest_duration = (renderTiming.total_duration_ms / 1000).toFixed(1) + 's';
        }
    }
    
    return {
        timestamp: new Date().toISOString(),
        system_proof: {
            fooocus: fooocusStatus,
            ollama: ollamaStatus,
            gemini_key: geminiKeyStatus,
            use_vision_validator: visionValidator,
            telegram_bot: 'ALIVE' // Assuming we're running in the bot context
        },
        image_lane_proof: imageLaneProof,
        latest_run_proof: latestRunProof,
        failure_center: failureCenter,
        task_queue_proof: taskProof,
        cost_runtime_proof: runtimeProof
    };
}

module.exports = {
    generateCommanderProof,
    readJsonSafe,
    checkFooocus,
    checkOllama,
    checkGeminiKey,
    checkVisionValidator,
    getLatestRunFolder,
    listArtifacts
};
