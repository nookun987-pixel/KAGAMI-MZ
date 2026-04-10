const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const QUEUE_DIR = path.join(ROOT, 'queue');
const QUEUE_FILE = path.join(QUEUE_DIR, 'jobs.json');
const AUDIT_LOG = path.join(QUEUE_DIR, 'audit.log');

// Strict job schema validation
const JOB_SCHEMA = {
  required_fields: [
    'job_type',
    'user_idea',
    'priority',
    'requested_outputs',
    'mode'
  ],
  valid_job_types: ['creative', 'test', 'validation'],
  valid_priorities: ['low', 'normal', 'high', 'urgent'],
  valid_modes: ['standard', 'debug', 'production'],
  valid_requested_outputs: ['png', 'json', 'logs', 'validation']
};

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

// Write audit log
function writeAuditLog(event, jobId, details = {}) {
  ensureQueue();
  const timestamp = new Date().toISOString();
  const logEntry = JSON.stringify({
    timestamp,
    event,
    job_id: jobId,
    ...details
  });
  
  fs.appendFileSync(AUDIT_LOG, logEntry + '\n', 'utf8');
  console.log(`[AUDIT] ${event}: ${jobId}`, details);
}

// Validate job payload
function validateJobPayload(payload) {
  const errors = [];
  
  // Check required fields
  JOB_SCHEMA.required_fields.forEach(field => {
    if (!payload[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Validate enum values
  if (payload.job_type && !JOB_SCHEMA.valid_job_types.includes(payload.job_type)) {
    errors.push(`Invalid job_type: ${payload.job_type}. Valid: ${JOB_SCHEMA.valid_job_types.join(', ')}`);
  }
  
  if (payload.priority && !JOB_SCHEMA.valid_priorities.includes(payload.priority)) {
    errors.push(`Invalid priority: ${payload.priority}. Valid: ${JOB_SCHEMA.valid_priorities.join(', ')}`);
  }
  
  if (payload.mode && !JOB_SCHEMA.valid_modes.includes(payload.mode)) {
    errors.push(`Invalid mode: ${payload.mode}. Valid: ${JOB_SCHEMA.valid_modes.join(', ')}`);
  }
  
  if (payload.requested_outputs && !Array.isArray(payload.requested_outputs)) {
    errors.push(`requested_outputs must be an array`);
  } else if (payload.requested_outputs) {
    const invalidOutputs = payload.requested_outputs.filter(output => 
      !JOB_SCHEMA.valid_requested_outputs.includes(output)
    );
    if (invalidOutputs.length > 0) {
      errors.push(`Invalid requested_outputs: ${invalidOutputs.join(', ')}. Valid: ${JOB_SCHEMA.valid_requested_outputs.join(', ')}`);
    }
  }
  
  return errors;
}

// Generate job ID
function generateJobId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 5);
  return `job_${timestamp}_${random}`;
}

// Create queued job
function createQueuedJob(payload, createdBy = 'command_center') {
  const errors = validateJobPayload(payload);
  if (errors.length > 0) {
    throw new Error(`Job validation failed: ${errors.join(', ')}`);
  }
  
  const queue = readQueue();
  const job = {
    job_id: generateJobId(),
    created_at: new Date().toISOString(),
    source: 'command_center',
    execution_guard: 'pending_approval',
    status: 'queued',
    created_by: createdBy,
    ...payload
  };
  
  queue.jobs.push(job);
  writeQueue(queue);
  
  // Audit log
  writeAuditLog('queued', job.job_id, {
    job_type: job.job_type,
    priority: job.priority,
    user_idea: job.user_idea.substring(0, 100) + '...'
  });
  
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

// Update job status with validation
function updateJobStatus(jobId, newStatus, updates = {}) {
  const queue = readQueue();
  const jobIndex = queue.jobs.findIndex(job => job.job_id === jobId);

  if (jobIndex === -1) {
    throw new Error(`Job not found: ${jobId}`);
  }

  const currentJob = queue.jobs[jobIndex];

  if (!isValidTransition(currentJob.status, newStatus)) {
    throw new Error(`Invalid status transition: ${currentJob.status} -> ${newStatus}`);
  }

  const updatedJob = {
    ...currentJob,
    ...updates,
    status: newStatus
  };

  queue.jobs[jobIndex] = updatedJob;
  writeQueue(queue);

  writeAuditLog('status_changed', jobId, {
    from_status: currentJob.status,
    to_status: newStatus,
    details: updates
  });

  return updatedJob;
}

// Validate status transitions
function isValidTransition(from, to) {
  const validTransitions = {
    queued: ['approved', 'rejected'],
    approved: ['running'],
    running: ['done', 'failed'],
    done: [],
    failed: [],
    rejected: []
  };

  return validTransitions[from]?.includes(to) || false;
}

// Approve job for execution
function approveJob(jobId) {
  return updateJobStatus(jobId, 'approved', { 
    execution_guard: 'approved',
    approved_at: new Date().toISOString()
  });
}

// Start job execution
function startJob(jobId) {
  return updateJobStatus(jobId, 'running', { 
    started_at: new Date().toISOString()
  });
}

// Complete job
function completeJob(jobId, result) {
  return updateJobStatus(jobId, 'done', { 
    finished_at: new Date().toISOString(),
    result: result
  });
}

// Fail job
function failJob(jobId, error) {
  return updateJobStatus(jobId, 'failed', { 
    finished_at: new Date().toISOString(),
    error: error
  });
}

// Reject job
function rejectJob(jobId, reason) {
  return updateJobStatus(jobId, 'rejected', { 
    finished_at: new Date().toISOString(),
    rejection_reason: reason
  });
}

// Timeout job
function timeoutJob(jobId) {
  return updateJobStatus(jobId, 'failed', { 
    finished_at: new Date().toISOString(),
    error: 'Job timeout (5 minutes)'
  });
}

module.exports = {
  ensureQueue,
  readQueue,
  writeQueue,
  validateJobPayload,
  createQueuedJob,
  getJobsByStatus,
  getJobById,
  updateJobStatus,
  isValidTransition,
  approveJob,
  startJob,
  completeJob,
  failJob,
  rejectJob,
  timeoutJob,
  writeAuditLog
};
