const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const QUEUE_DIR = path.join(ROOT, 'queue');
const QUEUE_FILE = path.join(QUEUE_DIR, 'jobs.json');

// Ensure queue directory exists
function ensureQueue() {
  if (!fs.existsSync(QUEUE_DIR)) {
    fs.mkdirSync(QUEUE_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(QUEUE_FILE)) {
    fs.writeFileSync(QUEUE_FILE, JSON.stringify({ jobs: [] }, 'utf8'));
  }
}

// Read queue
function readQueue() {
  ensureQueue();
  try {
    const data = fs.readFileSync(QUEUE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read queue:', error);
    return { jobs: [] };
  }
}

// Write queue
function writeQueue(queue) {
  ensureQueue();
  try {
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write queue:', error);
  }
}

// Generate job ID
function generateJobId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 5);
  return `job_${timestamp}_${random}`;
}

// Create queued job
function createQueuedJob(payload) {
  const queue = readQueue();
  const job = {
    job_id: generateJobId(),
    created_at: new Date().toISOString(),
    status: 'queued',
    input: payload,
    source: 'command_center',
    execution_guard: 'pending_approval'
  };
  
  queue.jobs.push(job);
  writeQueue(queue);
  
  return job;
}

// Get jobs by status
function getJobsByStatus(status) {
  const queue = readQueue();
  return queue.jobs.filter(job => job.status === status);
}

// Get job by ID
function getJobById(jobId) {
  const queue = readQueue();
  return queue.jobs.find(job => job.job_id === jobId);
}

// Update job status
function updateJobStatus(jobId, updates) {
  const queue = readQueue();
  const jobIndex = queue.jobs.findIndex(job => job.job_id === jobId);
  
  if (jobIndex !== -1) {
    queue.jobs[jobIndex] = { ...queue.jobs[jobIndex], ...updates };
    writeQueue(queue);
    return queue.jobs[jobIndex];
  }
  
  return null;
}

// Approve job for execution
function approveJob(jobId) {
  return updateJobStatus(jobId, { 
    execution_guard: 'approved',
    approved_at: new Date().toISOString()
  });
}

// Start job execution
function startJob(jobId) {
  return updateJobStatus(jobId, { 
    status: 'running',
    started_at: new Date().toISOString()
  });
}

// Complete job
function completeJob(jobId, result) {
  return updateJobStatus(jobId, { 
    status: result.status || 'done',
    completed_at: new Date().toISOString(),
    result: result
  });
}

// Fail job
function failJob(jobId, error) {
  return updateJobStatus(jobId, { 
    status: 'failed',
    failed_at: new Date().toISOString(),
    error: error
  });
}

module.exports = {
  ensureQueue,
  readQueue,
  writeQueue,
  createQueuedJob,
  getJobsByStatus,
  getJobById,
  updateJobStatus,
  approveJob,
  startJob,
  completeJob,
  failJob
};
