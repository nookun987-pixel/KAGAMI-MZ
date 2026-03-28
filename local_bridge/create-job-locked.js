const { createQueuedJob } = require('../queue_manager_locked');
  
// Only accept POST requests
if (req.method !== 'POST') {
  res.writeHead(405, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Method not allowed' }));
  return;
}
  
  try {
    // Parse request body
    const body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    
    // Create queued job with strict validation
    const job = createQueuedJob(body);
    
    console.log(`[QUEUE] Job created: ${job.job_id}`);
    console.log(`[QUEUE] Status: ${job.status}, Guard: ${job.execution_guard}`);
    console.log(`[QUEUE] Type: ${job.job_type}, Priority: ${job.priority}`);
    
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      job_id: job.job_id,
      status: job.status,
      execution_guard: job.execution_guard,
      created_at: job.created_at,
      job_type: job.job_type,
      priority: job.priority
    }));
    
  } catch (error) {
    console.error('[QUEUE] Failed to create job:', error);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
