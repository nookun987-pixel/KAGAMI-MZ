const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { 
  readQueue, 
  getJobsByStatus, 
  getJobById, 
  approveJob, 
  startJob, 
  completeJob, 
  failJob 
} = require('./queue_manager');

const ROOT = __dirname;
const ORCHESTRATOR_PATH = path.join(ROOT, 'orchestrator.js');

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
      // Prepare job file for orchestrator
      const jobFile = path.join(ROOT, 'jobs', `${job.job_id}.json`);
      const jobDir = path.dirname(jobFile);
      
      if (!fs.existsSync(jobDir)) {
        fs.mkdirSync(jobDir, { recursive: true });
      }
      
      fs.writeFileSync(jobFile, JSON.stringify(job.input, null, 2), 'utf8');
      
      // Run orchestrator
      const result = await this.runOrchestrator(job.job_id);
      
      if (result.success) {
        console.log(`[WORKER] Job ${job.job_id} completed successfully`);
        completeJob(job.job_id, { status: 'done', output: result.output });
      } else {
        console.log(`[WORKER] Job ${job.job_id} failed: ${result.error}`);
        failJob(job.job_id, result.error);
      }
      
    } catch (error) {
      console.error(`[WORKER] Job ${job.job_id} error:`, error);
      failJob(job.job_id, error.message);
    } finally {
      this.currentJob = null;
    }
  }
  
  // Run orchestrator process
  runOrchestrator(jobId) {
    return new Promise((resolve) => {
      console.log(`[WORKER] Running orchestrator for job: ${jobId}`);
      
      const child = spawn('node', [ORCHESTRATOR_PATH, jobId], {
        stdio: 'pipe',
        cwd: ROOT
      });
      
      let output = '';
      let errorOutput = '';
      
      child.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output });
        } else {
          resolve({ success: false, error: errorOutput || `Process exited with code ${code}` });
        }
      });
      
      // Timeout after 5 minutes
      setTimeout(() => {
        if (!child.killed) {
          child.kill();
          resolve({ success: false, error: 'Job timeout (5 minutes)' });
        }
      }, 5 * 60 * 1000);
    });
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
