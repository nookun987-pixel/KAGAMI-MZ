const express = require('express');
const app = express();

// Parse JSON bodies
app.use(express.json());

// In-memory storage (no database for V1)
const jobs = new Map();
const runs = [];
let startTime = Date.now();

// GET / - System status
app.get('/', (req, res) => {
  res.json({
    system: "MIKAGE_BRAIN",
    status: "ONLINE",
    mode: "CONTROL_PLANE_ONLY"
  });
});

// GET /health - Health check with uptime
app.get('/health', (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  res.json({
    ok: true,
    system: "MIKAGE_BRAIN",
    uptime: uptime
  });
});

// GET /services - Service status
app.get('/services', (req, res) => {
  res.json({
    server: "online",
    render_lane: "not_attached_yet",
    colab_worker: "not_connected_yet"
  });
});

// POST /create-job - Create a new job
app.post('/create-job', (req, res) => {
  const jobId = `job_${Date.now()}`;
  const job = {
    job_id: jobId,
    status: "QUEUED",
    created_at: new Date().toISOString(),
    payload: req.body
  };
  
  jobs.set(jobId, job);
  
  res.json({
    ok: true,
    job_id: jobId,
    status: "QUEUED",
    received_payload: req.body
  });
});

// GET /job/:job_id - Get job status
app.get('/job/:job_id', (req, res) => {
  const job = jobs.get(req.params.job_id);
  if (!job) {
    return res.status(404).json({
      ok: false,
      error: "Job not found"
    });
  }
  
  res.json({
    ok: true,
    job: job
  });
});

// GET /latest-run - Get latest run info
app.get('/latest-run', (req, res) => {
  const latestRun = runs.length > 0 ? runs[runs.length - 1] : null;
  
  res.json({
    ok: true,
    latest_run: latestRun,
    note: latestRun ? null : "No runs yet"
  });
});

// GET /artifacts/latest - Get latest artifacts
app.get('/artifacts/latest', (req, res) => {
  res.json({
    ok: true,
    artifacts: []
  });
});

// POST /command - Execute a system command by intent
const { handleCommand } = require("../commands/handler");
let commandSeq = 0;
app.post('/command', async (req, res) => {
  const { intent } = req.body || {};
  if (!intent || typeof intent !== "string") {
    return res.status(400).json({ ok: false, error: "Missing or invalid 'intent' string" });
  }
  commandSeq++;
  const commandId = `CMD-${Date.now()}-${String(commandSeq).padStart(4, "0")}`;
  console.log(`[COMMAND] received: ${commandId} intent=${intent}`);
  try {
    const result = await handleCommand(commandId, intent);
    res.json(result);
  } catch (err) {
    console.error(`[COMMAND][${commandId}] crash: ${err.message}`);
    res.status(500).json({ ok: false, command_id: commandId, intent, error: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Not found",
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    ok: false,
    error: "Internal server error"
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`MIKAGE_BRAIN server running on port ${PORT}`);
  console.log(`Mode: CONTROL_PLANE_ONLY`);
  console.log(`Ready for Colab worker connection...`);
});

module.exports = app;
