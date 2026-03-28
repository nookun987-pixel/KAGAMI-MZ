export default async function handler(req, res) {
  const bridgeUrl = process.env.LOCAL_MIKAGE_BRIDGE_URL || 'http://localhost:3031';
  
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
    
    // Proxy to local bridge
    const response = await fetch(`${bridgeUrl}/approve-job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id })
    });
    
    const data = await response.json();
    
    res.status(response.ok ? 200 : 500).json(data);
    
  } catch (error) {
    console.error('[API] Approve job failed:', error);
    res.status(500).json({ error: error.message });
  }
}
