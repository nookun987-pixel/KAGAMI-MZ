export default async function handler(req, res) {
  const { getJobById, approveJob } = require('../queue_manager');
  
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
    
    const { job_id } = body;
    
    if (!job_id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing job_id' }));
      return;
    }
    
    // Get job
    const job = getJobById(job_id);
    
    if (!job) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Job not found' }));
      return;
    }
    
    // Approve job
    const updatedJob = approveJob(job_id);
    
    console.log(`[APPROVAL] Job approved: ${job_id}`);
    console.log(`[APPROVAL] Previous guard: ${job.execution_guard}`);
    console.log(`[APPROVAL] New guard: ${updatedJob.execution_guard}`);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      job_id: job_id,
      previous_guard: job.execution_guard,
      current_guard: updatedJob.execution_guard,
      approved_at: updatedJob.approved_at
    }));
    
  } catch (error) {
    console.error('[APPROVAL] Failed to approve job:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
}
