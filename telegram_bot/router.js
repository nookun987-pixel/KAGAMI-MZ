const { runCommand } = require('./executor_router');
const { getStatus } = require('./task_manager');
const { getLatest } = require('./artifact_registry');
const { getSystemStatus } = require('./report_system');
const { getProjectStatus } = require('./report_project');
const { getCostStatus } = require('./report_cost');
const { restartService } = require('./service_manager');
const { getTasks } = require('./shared_state');
const masterControl = require('../lib/master_control');
const guard = require('./duplicate_guard');

async function handleCommand(text, msg) {
  const parts = text.split(' ');
  const rawCommand = parts[0];
  const args = parts.slice(1);
  
  // Strip @botname suffix if present
  const command = rawCommand.split('@')[0];
  
  switch (command) {
    case '/run':
      return await runCommand(args.join(' '), msg);
    
    case '/task':
      return await runCommand(args.join(' '), msg);
    
    case '/status':
      return await getStatus(args[0]);
    
    case '/latest':
      return await getLatest();
    
    case '/queue':
      return await getStatus('queue');
    
    case '/system':
      return await getSystemStatus();
    
    case '/project':
      return await getProjectStatus();
    
    case '/cost':
      return await getCostStatus();
    
    case '/restart':
      return await restartService(args[0]);
    
    case '/artifacts':
      return await getLatest();
    
    case '/approve':
      return await approveTask(args[0]);
    
    case '/reject':
      return await rejectTask(args[0]);
    
    // ─── MASTER CONTROL COMMANDS ────────────────────────────────────
    
    case '/boot':
      return await handleBoot();
    
    case '/heal':
      return await handleHeal();
    
    case '/proof':
      return await handleProof();
    
    case '/master_status':
      return await handleMasterStatus();
    
    case '/start_all':
      return await handleStartAll();
    
    case '/stop_all':
      return await handleStopAll();
    
    case '/restart_all':
      return await handleRestartAll();
    
    // ─── IMAGE LANE COMMANDS ─────────────────────────────────────────
    
    case '/image_status':
      return await handleImageStatus();
    
    case '/image_last':
      return await handleImageLast();
    
    case '/image_fail':
      return await handleImageFail();
    
    case '/image_artifacts':
      return await handleImageArtifacts();
    
    case '/image_test':
      return await handleImageTest();
    
    case '/help':
      return `*MIKAGE OPERATOR COMMANDS*
/run <job> - Execute job
/task <instruction> - Execute task  
/status [task_id] - Get task status
/latest - Latest artifacts
/queue - Queue status
/system - System status
/project - Project status
/cost - Cost status
/restart <service> - Restart service
/artifacts - Artifact inventory
/approve <task_id> - Approve task
/reject <task_id> - Reject task

*OPERATIONS CAPTAIN*
/boot - Boot system services
/heal - Detect and fix broken services
/proof - System proof verification
/master_status - Master system status
/start_all - Start all services
/stop_all - Stop all services
/restart_all - Restart all services

*IMAGE LANE*
/image_status - Image lane status
/image_last - Latest run info
/image_fail - Failure diagnostics
/image_artifacts - Latest artifacts
/image_test - Run lightweight test job
/help - Show this help`;
    
    default:
      return 'ERROR: Unknown command. Use /help';
  }
}

// ─── MASTER CONTROL HANDLERS ─────────────────────────────────────

function logCommandStep(command, step, chatId, msgId, extra = '') {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [CMD:${command}] [${step}] chatId=${chatId} msgId=${msgId} ${extra}`);
}

async function handleBoot() {
  const ts = Date.now();
  const log = (step, extra = '') => logCommandStep('/boot', step, 'unknown', ts, extra);
  
  log('HANDLER_START');
  
  try {
    log('MASTER_CONTROL_CALL');
    const result = await masterControl.boot();
    log('MASTER_CONTROL_SUCCESS', `verdict=${result.verdict}`);
    
    if (result.verdict === 'BLOCKED') {
      log('BLOCKED_RETURN');
      return `BOOT BLOCKED
Operation locked: ${result.error}`;
    }
    
    let output = `BOOT RESULT\n\n`;
    
    for (const r of result.results) {
      const before = r.before || 'UNKNOWN';
      const after = r.after || 'FAILED';
      output += `${r.service}: ${before} -> ${after}\n`;
      if (r.error) {
        output += `  ERROR: ${r.error}\n`;
      }
    }
    
    output += `\nSystem verdict: ${result.verdict}`;
    log('HANDLER_SUCCESS', `output_length=${output.length}`);
    return output;
  } catch (error) {
    log('HANDLER_ERROR', `error=${error.message}`);
    console.error('[handleBoot] ERROR:', error);
    return `BOOT ERROR\n${error.message}`;
  }
}

async function handleHeal() {
  const ts = Date.now();
  const log = (step, extra = '') => logCommandStep('/heal', step, 'unknown', ts, extra);
  
  log('HANDLER_START');
  
  try {
    log('MASTER_CONTROL_CALL');
    const result = await masterControl.heal();
    log('MASTER_CONTROL_SUCCESS', `verdict=${result.verdict}`);
    
    if (result.verdict === 'BLOCKED') {
      log('BLOCKED_RETURN');
      return `HEAL BLOCKED
Operation locked: ${result.error}`;
    }
    
    let output = `HEAL RESULT\n\n`;
    
    if (result.wasBroken.length === 0) {
      output += `Broken:\n- None\n\n`;
    } else {
      output += `Broken:\n`;
      for (const s of result.wasBroken) {
        output += `- ${s}\n`;
      }
      output += `\n`;
    }
    
    if (result.actionsTaken && result.actionsTaken.length > 0) {
      output += `Action:\n`;
      for (const a of result.actionsTaken) {
        output += `- ${a.service}: ${a.action} -> ${a.result}\n`;
      }
      output += `\n`;
    }
    
    if (result.stillBroken && result.stillBroken.length > 0) {
      output += `Now:\n`;
      for (const s of result.stillBroken) {
        output += `- ${s} STILL BROKEN\n`;
      }
      output += `\n`;
    } else if (result.wasBroken.length > 0) {
      output += `Now:\n- All services healed\n\n`;
    }
    
    output += `System verdict: ${result.verdict}`;
    log('HANDLER_SUCCESS', `output_length=${output.length}`);
    return output;
  } catch (error) {
    log('HANDLER_ERROR', `error=${error.message}`);
    console.error('[handleHeal] ERROR:', error);
    return `HEAL ERROR\n${error.message}`;
  }
}

async function handleProof() {
  const ts = Date.now();
  const log = (step, extra = '') => logCommandStep('/proof', step, 'unknown', ts, extra);
  
  log('HANDLER_START');
  
  try {
    log('MASTER_CONTROL_CALL');
    const result = await masterControl.proof();
    log('MASTER_CONTROL_SUCCESS');
    
    // Read shared_state for terminal state info
    const fs = require('fs');
    const path = require('path');
    const statePath = path.join(process.cwd(), 'data/shared_state.json');
    let sharedState = null;
    try {
      if (fs.existsSync(statePath)) {
        sharedState = JSON.parse(fs.readFileSync(statePath, 'utf8'));
      }
    } catch (e) {
      // ignore
    }
    
    let output = `PROOF RESULT\n\n`;
    
    output += `System:\n`;
    output += `- Fooocus: ${result.system.fooocus}\n`;
    output += `- Ollama: ${result.system.ollama}\n`;
    output += `- Telegram: ${result.system.telegram}\n`;
    output += `- Gemini: ${result.system.gemini}\n`;
    output += `- Vision: ${result.system.vision}\n\n`;
    
    output += `Image Lane:\n`;
    output += `- Latest Run: ${result.imageLane.latestRun || 'NONE'}\n`;
    output += `- Output: ${result.imageLane.outputPng}\n`;
    output += `- Post Val: ${result.imageLane.postValidation}\n`;
    output += `- Gemini: ${result.imageLane.geminiValidation}\n`;
    output += `- Decision: ${result.imageLane.finalDecision}\n`;
    output += `- Verdict: ${result.imageLane.verdict}\n`;
    
    // Show shared_state terminal info if available
    if (sharedState && sharedState.lastJobId) {
      output += `- Run State: ${sharedState.runState || 'UNKNOWN'}\n`;
      output += `- Last Decision: ${sharedState.lastDecision || 'N/A'}\n`;
      output += `- Last Status: ${sharedState.lastStatus || 'N/A'}\n`;
      if (sharedState.completedAt) {
        output += `- Completed: ${sharedState.completedAt}\n`;
      }
    }
    
    // Explicit messaging for services online but no run
    if (result.system.fooocus === 'ALIVE' && result.system.ollama === 'ALIVE' && !result.imageLane.latestRun) {
      output += `\n⚠️ services online but no run yet\n`;
    }
    
    // Show active job info
    if (sharedState && sharedState.activeJobId) {
      output += `\n⚠️ Active Job: ${sharedState.activeJobId}\n`;
      output += `- Step: ${sharedState.currentStep || 'UNKNOWN'}\n`;
      output += `- State: ${sharedState.runState || 'RUNNING'}\n`;
    }
    
    if (result.queue) {
      output += `\nQueue: P:${result.queue.pending} R:${result.queue.running} F:${result.queue.failed} D:${result.queue.done}\n`;
    }
    
    output += `\nFinal Verdict: ${result.imageLane.verdict === 'IMAGE LANE LOCKED' ? 'LOCKED' : 'NOT LOCKED'}`;
    
    log('HANDLER_SUCCESS', `output_length=${output.length}`);
    return output;
  } catch (error) {
    log('HANDLER_ERROR', `error=${error.message}`);
    console.error('[handleProof] ERROR:', error);
    return `PROOF ERROR\n${error.message}`;
  }
}

async function handleMasterStatus() {
  const ts = Date.now();
  const log = (step, extra = '') => logCommandStep('/master_status', step, 'unknown', ts, extra);
  
  log('HANDLER_START');
  
  try {
    log('MASTER_CONTROL_CALL');
    const result = await masterControl.masterStatus();
    log('MASTER_CONTROL_SUCCESS');
    
    let output = `MASTER STATUS\n\n`;
    
    output += `Services:\n`;
    output += `- Fooocus: ${result.services.fooocus.status} (port ${result.services.fooocus.port})\n`;
    output += `- Ollama: ${result.services.ollama.status} (port ${result.services.ollama.port})\n`;
    output += `- Telegram Bot: ${result.services.telegram.status}\n\n`;
    
    output += `Keys:\n`;
    output += `- Gemini: ${result.keys.gemini}\n`;
    output += `- Vision: ${result.keys.vision}\n\n`;
    
    output += `Image Lane:\n`;
    output += `- Verdict: ${result.imageLane.verdict}\n`;
    output += `- Latest Run: ${result.imageLane.latestRun || 'NONE'}\n\n`;
    
    if (result.latestRun) {
      output += `Latest Run: ${result.latestRun}\n\n`;
    }
    
    output += `Overall: ${result.overall}`;
    
    log('HANDLER_SUCCESS', `output_length=${output.length}`);
    return output;
  } catch (error) {
    log('HANDLER_ERROR', `error=${error.message}`);
    console.error('[handleMasterStatus] ERROR:', error);
    return `MASTER STATUS ERROR\n${error.message}`;
  }
}

async function handleStartAll() {
  const result = await masterControl.startAll();
  
  if (result.verdict === 'BLOCKED') {
    return `START ALL BLOCKED
Operation locked: ${result.error}`;
  }
  
  let output = `START ALL RESULT\n\n`;
  
  for (const r of result.results) {
    output += `${r.service}: ${r.success ? 'STARTED' : 'FAILED'}\n`;
    if (r.error) {
      output += `  ERROR: ${r.error}\n`;
    }
  }
  
  output += `\nVerdict: ${result.verdict}`;
  return output;
}

async function handleStopAll() {
  const result = await masterControl.stopAll();
  
  if (result.verdict === 'BLOCKED') {
    return `STOP ALL BLOCKED
Operation locked: ${result.error}`;
  }
  
  let output = `STOP ALL RESULT\n\n`;
  
  for (const r of result.results) {
    output += `${r.service}: ${r.success ? 'STOPPED' : 'FAILED'}\n`;
    if (r.error) {
      output += `  ERROR: ${r.error}\n`;
    }
  }
  
  output += `\nVerdict: ${result.verdict}`;
  return output;
}

async function handleRestartAll() {
  const result = await masterControl.restartAll();
  
  if (result.verdict === 'BLOCKED') {
    return `RESTART ALL BLOCKED
Operation locked: ${result.error}`;
  }
  
  let output = `RESTART ALL RESULT\n\n`;
  
  for (const r of result.results) {
    output += `${r.service}: ${r.success ? 'RESTARTED' : 'FAILED'}\n`;
    if (r.error) {
      output += `  ERROR: ${r.error}\n`;
    }
  }
  
  output += `\nVerdict: ${result.verdict}`;
  return output;
}

// ─── IMAGE LANE HANDLERS ─────────────────────────────────────────

async function handleImageStatus() {
  const proofReader = require('../lib/proof_reader');
  const result = await proofReader.getImageLaneProof();
  
  let output = `IMAGE LANE STATUS\n\n`;
  output += `Latest Run: ${result.latest_run_path.split('/').pop() || 'NONE'}\n`;
  output += `output.png: ${result.output_png}\n`;
  output += `Post Validation: ${result.post_validation}\n`;
  output += `Gemini Validation: ${result.gemini_validation}\n`;
  output += `Final Decision: ${result.final_decision}\n\n`;
  output += `Verdict: ${result.verdict}`;
  return output;
}

async function handleImageLast() {
  const fs = require('fs');
  const path = require('path');
  const runsDir = path.join(process.cwd(), 'runs');
  
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
  } catch (e) {
    return `ERROR: Cannot read runs directory: ${e.message}`;
  }
  
  if (!latestRun) {
    return `NO RUNS FOUND\n\nNo runs in ${runsDir}`;
  }
  
  const runPath = path.join(runsDir, latestRun);
  
  // Read run info
  let jobId = 'unknown';
  let status = 'unknown';
  try {
    const jobSummaryPath = path.join(runPath, 'job_summary.json');
    if (fs.existsSync(jobSummaryPath)) {
      const jobSummary = JSON.parse(fs.readFileSync(jobSummaryPath, 'utf8'));
      jobId = jobSummary.job_id || latestRun;
      status = jobSummary.status || 'unknown';
    }
  } catch {
    // ignore
  }
  
  const outputExists = fs.existsSync(path.join(runPath, 'output.png'));
  const finalExists = fs.existsSync(path.join(runPath, 'final_decision.json'));
  
  let output = `LATEST RUN\n\n`;
  output += `Folder: ${latestRun}\n`;
  output += `Job ID: ${jobId}\n`;
  output += `Status: ${status}\n`;
  output += `Created: ${new Date(latestTime).toLocaleString()}\n\n`;
  output += `Artifacts:\n`;
  output += `- output.png: ${outputExists ? 'PRESENT' : 'MISSING'}\n`;
  output += `- final_decision.json: ${finalExists ? 'PRESENT' : 'MISSING'}`;
  return output;
}

async function handleImageFail() {
  const proofReader = require('../lib/proof_reader');
  const result = await proofReader.getFailureCenter();
  
  let output = `FAILURE CENTER\n\n`;
  output += `Latest Reject: ${result.latest_reject_reason || 'None'}\n`;
  output += `Failed Rules: ${result.failed_rules && result.failed_rules.length ? result.failed_rules.join(', ') : 'None'}\n`;
  output += `Validator Source: ${result.validator_fail_source}\n`;
  output += `No-Image Fail: ${result.no_image_fail ? 'YES' : 'NO'}`;
  return output;
}

async function handleImageArtifacts() {
  const fs = require('fs');
  const path = require('path');
  const runsDir = path.join(process.cwd(), 'runs');
  
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
  } catch (e) {
    return `ERROR: Cannot read runs directory: ${e.message}`;
  }
  
  if (!latestRun) {
    return `NO RUNS FOUND\n\nNo runs in ${runsDir}`;
  }
  
  const runPath = path.join(runsDir, latestRun);
  let artifacts = [];
  
  try {
    if (fs.existsSync(runPath)) {
      const files = fs.readdirSync(runPath);
      artifacts = files.map(f => {
        const stats = fs.statSync(path.join(runPath, f));
        return { name: f, size: stats.size, modified: stats.mtime.toISOString() };
      }).sort((a, b) => new Date(b.modified) - new Date(a.modified));
    }
  } catch (e) {
    return `ERROR: Cannot read run artifacts: ${e.message}`;
  }
  
  let output = `ARTIFACTS\n\n`;
  output += `Run: ${latestRun}\n\n`;
  
  if (artifacts.length === 0) {
    output += `No artifacts found`;
  } else {
    artifacts.slice(0, 15).forEach(a => {
      const sizeKB = (a.size / 1024).toFixed(1);
      output += `- ${a.name} (${sizeKB}KB)\n`;
    });
    if (artifacts.length > 15) {
      output += `\n+ ${artifacts.length - 15} more artifacts`;
    }
  }
  return output;
}

async function handleImageTest() {
  const { spawn } = require('child_process');
  const fs = require('fs');
  const path = require('path');
  
  // GUARD: Check if task already running
  const testJobId = `telegram_test_${Date.now()}`;
  
  if (!guard.lockTask(testJobId, { type: 'image_test', created: new Date().toISOString() })) {
    return `IMAGE TEST BLOCKED

Task already running. Cannot start duplicate test.
Wait for completion or run /image_status.`;
  }
  
  // Also check via guard for any active image test
  if (guard.getActiveTaskCount() > 0) {
    const guardStatus = guard.getGuardStatus();
    guard.unlockTask(testJobId); // Release our lock
    return `IMAGE TEST BLOCKED

Another task is already running.
Active tasks: ${guardStatus.activeTaskCount}
Run /image_status to check.`;
  }
  
  // Check if services are running first
  const proofReader = require('../lib/proof_reader');
  const sysProof = await proofReader.getSystemProof();
  
  if (sysProof.fooocus !== 'ALIVE' || sysProof.ollama !== 'ALIVE') {
    guard.unlockTask(testJobId);
    return `IMAGE TEST BLOCKED

Services not ready:
- Fooocus: ${sysProof.fooocus}
- Ollama: ${sysProof.ollama}

Run /boot first to start services.`;
  }
  
  // Check shared state as additional guard
  const statePath = path.join(process.cwd(), 'data/shared_state.json');
  let state = { activeJobId: null };
  try {
    if (fs.existsSync(statePath)) {
      state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    }
  } catch (e) {
    // ignore
  }
  
  if (state.activeJobId) {
    guard.unlockTask(testJobId);
    return `IMAGE TEST BLOCKED

Job already running: ${state.activeJobId}
Wait for completion or run /image_status.`;
  }
  
  // Register the run_id to prevent duplicates
  if (!guard.registerRun(testJobId)) {
    guard.unlockTask(testJobId);
    return `IMAGE TEST BLOCKED

Run ID ${testJobId} already exists (duplicate detected).`;
  }
  const jobsDir = path.join(process.cwd(), 'jobs');
  
  if (!fs.existsSync(jobsDir)) {
    fs.mkdirSync(jobsDir, { recursive: true });
  }
  
  const jobFile = path.join(jobsDir, `${testJobId}.json`);
  const jobData = {
    job_id: testJobId,
    phase: "material_study",
    user_idea: "A single engineered ceramic sphere, manufactured object, perfectly smooth hard-surface boron carbide ceramic (B4C), matte porcelain finish. Centered composition, full object clearly visible. Environment: minimal brutalist concrete background. Lighting: strict chiaroscuro 4:1 ratio, single directional hard light. Color: Porcelain White #FAFAFA main surface, Obsidian Black #0A0A0A background. Surface: perfectly engineered symmetry, no plastic look, no glossy reflection. Camera: straight-on, neutral lens, no distortion, no blur. FORBIDDEN: human elements, eyes, fabric, organic material, cyberpunk/neon, particles, smoke, fog, multiple objects, abstract composition. OUTPUT: exactly one manufactured object, high clarity subject, zero ambiguity.",
    test_mode: true,
    max_candidates: 1,
    no_retry: true,
    skip_strict_validation: true,
    render: {
      width: 512,
      height: 512,
      performance: "Speed",
      candidate_count: 1
    }
  };
  
  fs.writeFileSync(jobFile, JSON.stringify(jobData, null, 2));
  
  // Start the job in background
  const child = spawn('node', ['orchestrator.js', jobFile], {
    cwd: process.cwd(),
    detached: true,
    stdio: 'ignore',
    windowsHide: true
  });
  
  child.unref();
  
  // Update state
  state.activeJobId = testJobId;
  state.currentStep = 'RUN_STARTED';
  state.runState = 'RUNNING';
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  
  return `IMAGE TEST STARTED

Job ID: ${testJobId}
Type: Lightweight test render
Status: RUNNING

Use /proof in 30-60 seconds to check completion.`;
}

async function approveTask(taskId) {
  return `TASK_ID: ${taskId}
STATUS: APPROVED
ACTION: Task approved for execution`;
}

async function rejectTask(taskId) {
  return `TASK_ID: ${taskId}
STATUS: REJECTED  
ACTION: Task rejected`;
}

module.exports = { handleCommand };
