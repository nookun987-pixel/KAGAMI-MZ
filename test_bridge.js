const http = require('http');

const PORT = 3031;

// Simple test server
const server = http.createServer((req, res) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  Object.entries(cors).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  
  switch (path) {
    case '/health':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        system: "MIKAGE",
        status: "ONLINE",
        time: new Date().toISOString(),
        services: { test: "UP" }
      }));
      break;
      
    case '/create-job':
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        job_id: "job_test_" + Date.now(),
        status: "queued",
        execution_guard: "pending_approval",
        created_at: new Date().toISOString()
      }));
      break;
      
    case '/queue':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        jobs: [],
        count: 0
      }));
      break;
      
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "Not found" }));
      break;
  }
});

server.listen(PORT, () => {
  console.log(`🔗 Test Bridge running on http://localhost:${PORT}`);
});
