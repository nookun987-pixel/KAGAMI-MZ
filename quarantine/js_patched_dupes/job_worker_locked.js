const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { 
  readQueue, 
  getJobsByStatus, 
  getJobById, 
  startJob, 
  completeJob, 
  failJob,
  timeoutJob,
  writeAuditLog
} = require('./queue_manager_locked');

const ROOT = __dirname;
const ORCHESTRATOR_PATH = path.join(ROOT, 'orchestrator.js');
const JOBS_DIR = path.join(ROOT, 'jobs');
const RUNS_DIR = path.join(ROOT, 'runs');

// Required artifacts for every executed job
const REQUIRED_ARTIFACTS = [
  'run_manifest.json',
  'job_summary.json', 
  'final_decision.json',
  'gemini_validation.json',
  'output.png',
  'execution_log.txt'
];

class JobWorker {
  constructor() {
    this.running = false;
    this.currentJob = null;
    this.pollInterval = null;
  }
  
  // Start worker process
  start() {
    if (this.running) {
      console.log('[WORKER] Already running');
      return;
    }
    
    this.running = true;
    console.log('[WORKER] Starting job worker...');
    
    // Poll queue every 2 seconds
    this.pollInterval = setInterval(() => this.pollQueue(), 2000);
  }
  
  // Stop worker process
  stop() {
    this.running = false;
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    
    console.log('[WORKER] Job worker stopped');
  }
  
  // Poll queue for jobs
  async pollQueue() {
    try {
      // Get queued jobs
      const queuedJobs = getJobsByStatus('queued');
      
      for (const job of queuedJobs) {
        // Check if job is approved
        if (job.execution_guard === 'approved') {
          await this.executeJob(job);
        } else {
          console.log(`[WORKER] Job ${job.job_id} waiting for approval (guard: ${job.execution_guard})`);
        }
      }
    } catch (error) {
      console.error('[WORKER] Queue poll error:', error);
    }
  }
  
  // Execute a job
  async executeJob(job) {
    if (this.currentJob) {
      console.log(`[WORKER] Busy, skipping job ${job.job_id}`);
      return;
    }
    
    console.log(`[WORKER] Starting job: ${job.job_id}`);
    
    // Update job status to running
    startJob(job.job_id);
    this.currentJob = job;
    
    try {
      // Phase 2: Execution Mapping
      // 1. Create job file for orchestrator
      const jobFile = path.join(JOBS_DIR, `${job.job_id}.json`);
      const jobDir = path.dirname(jobFile);
      
      if (!fs.existsSync(jobDir)) {
        fs.mkdirSync(jobDir, { recursive: true });
      }
      
      // Create orchestrator input file
      const orchestratorInput = {
        job_id: job.job_id,
        user_idea: job.user_idea,
        job_type: job.job_type,
        priority: job.priority,
        mode: job.mode,
        requested_outputs: job.requested_outputs,
        source: 'command_center',
        created_at: job.created_at
      };
      
      fs.writeFileSync(jobFile, JSON.stringify(orchestratorInput, null, 2), 'utf8');
      
      // 2. Create run directory
      const runDir = path.join(RUNS_DIR, job.job_id);
      if (!fs.existsSync(runDir)) {
        fs.mkdirSync(runDir, { recursive: true });
      }
      
      // 3. Create run manifest
      const runManifest = {
        job_id: job.job_id,
        started_at: new Date().toISOString(),
        orchestrator_input: orchestratorInput,
        worker_pid: process.pid,
        required_artifacts: REQUIRED_ARTIFACTS
      };
      
      fs.writeFileSync(
        path.join(runDir, 'run_manifest.json'), 
        JSON.stringify(runManifest, null, 2), 
        'utf8'
      );
      
      // 4. Run orchestrator
      const result = await this.runOrchestrator(job.job_id);
      
      if (result.success) {
        console.log(`[WORKER] Job ${job.job_id} completed successfully`);
        
        // Phase 3: Artifact verification
        const artifacts = this.verifyArtifacts(job.job_id);
        
        completeJob(job.job_id, { 
          status: 'done', 
          output: result.output,
          artifacts: artifacts
        });
        
        writeAuditLog('job_completed', job.job_id, {
          artifacts_found: artifacts.found,
          artifacts_missing: artifacts.missing
        });
        
      } else {
        console.log(`[WORKER] Job ${job.job_id} failed: ${result.error}`);
        
        failJob(job.job_id, result.error);
        
        writeAuditLog('job_failed', job.job_id, {
          error: result.error,
          exit_code: result.exitCode
        });
      }
      
    } catch (error) {
      console.error(`[WORKER] Job ${job.job_id} error:`, error);
      
      failJob(job.job_id, error.message);
      
      writeAuditLog('job_error', job.job_id, {
        error: error.message,
        stack: error.stack
      });
      
    } finally {
      this.currentJob = null;
    }
  }
  
  // Run orchestrator process
  runOrchestrator(jobId) {
    return new Promise((resolve) => {
      console.log(`[WORKER] Running orchestrator for job: ${jobId}`);
      
      const jobFile = path.join(JOBS_DIR, `${jobId}.json`);
      const runDir = path.join(RUNS_DIR, jobId);
      const logFile = path.join(runDir, 'execution_log.txt');
      
      const child = spawn('node', [ORCHESTRATOR_PATH, jobFile], {
        stdio: 'pipe',
        cwd: ROOT
      });
      
      let output = '';
      let errorOutput = '';
      
      // Capture stdout and stderr
      child.stdout.on('data', (data) => {
        output += data.toString();
        // Append to execution log
        fs.appendFileSync(logFile, `[STDOUT] ${data.toString()}`, 'utf8');
      });
      
      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
        // Append to execution log
        fs.appendFileSync(logFile, `[STDERR] ${data.toString()}`, 'utf8');
      });
      
      child.on('close', (code) => {
        const result = {
          exitCode: code,
          success: code === 0,
          output: output,
          error: errorOutput
        };
        
        // Write final status to log
        fs.appendFileSync(logFile, `[EXIT] Process exited with code: ${code}\n`, 'utf8');
        
        resolve(result);
      });
      
      // Timeout after 5 minutes
      setTimeout(() => {
        if (!child.killed) {
          child.kill();
          timeoutJob(jobId);
          writeAuditLog('job_timeout', jobId, { timeout: '5 minutes' });
          resolve({ success: false, error: 'Job timeout (5 minutes)', exitCode: -1 });
        }
      }, 5 * 60 * 1000);
    });
  }
  
  // Verify required artifacts
  verifyArtifacts(jobId) {
    const runDir = path.join(RUNS_DIR, jobId);
    const found = [];
    const missing = [];
    
    REQUIRED_ARTIFACTS.forEach(artifact => {
      const artifactPath = path.join(runDir, artifact);
      if (fs.existsSync(artifactPath)) {
        found.push(artifact);
      } else {
        missing.push(artifact);
      }
    });
    
    return { found, missing };
  }
}

// Auto-start worker
const worker = new JobWorker();
worker.start();

// Handle process termination
process.on('SIGINT', () => {
  console.log('[WORKER] Received SIGINT, stopping...');
  worker.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('[WORKER] Received SIGTERM, stopping...');
  worker.stop();
  process.exit(0);
});

module.exports = JobWorker;
