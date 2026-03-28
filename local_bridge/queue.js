export default async function handler(req, res) {
  const { getJobsByStatus } = require('../queue_manager');
  
  // Only accept GET requests
  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }
  
  try {
    // Get queued jobs
    const queuedJobs = getJobsByStatus('queued');
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      jobs: queuedJobs,
      count: queuedJobs.length
    }));
    
  } catch (error) {
    console.error('[QUEUE] Failed to get queued jobs:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
}
