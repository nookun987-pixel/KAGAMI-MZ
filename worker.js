"use strict";

require("dotenv").config();

const fs = require("fs");
const path = require("path");

const { ensureServicesReady } = require("./service_manager");
const { runRuntimeJob } = require("./orchestrator_runtime");

const QUEUE_ROOT = path.resolve(process.env.QUEUE_ROOT || path.join(__dirname, "queue"));
const QUEUE_FILE = path.join(QUEUE_ROOT, "jobs.json");
const RUNS_ROOT = path.resolve(process.env.RUNS_ROOT || path.join(__dirname, "runs"));
const WORKER_POLL_MS = parseInt(process.env.WORKER_POLL_MS || "5000", 10);

function ensureQueueFile() {
  fs.mkdirSync(QUEUE_ROOT, { recursive: true });
  if (!fs.existsSync(QUEUE_FILE)) {
    fs.writeFileSync(QUEUE_FILE, JSON.stringify({ jobs: [] }, null, 2), "utf-8");
  }
}

function readQueue() {
  ensureQueueFile();
  return JSON.parse(fs.readFileSync(QUEUE_FILE, "utf-8"));
}

function writeQueue(queue) {
  ensureQueueFile();
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), "utf-8");
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    if (!fs.existsSync(filePath)) {
  console.log(`[WORKER] Missing final_decision.json → skipping job`);
  return null;
}
  }
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

function reconcileCompletedRunningJobs() {
  const queue = readQueue();
  let changed = false;
  for (const job of queue.jobs) {
    if (job.status !== "RUNNING") continue;
    const finalDecisionPath = path.join(RUNS_ROOT, job.job_id, "final_decision.json");
    const finalDecision = readJsonIfExists(finalDecisionPath);
    if (!finalDecision) {
      throw new Error(`[WORKER] final_decision.json exists but is empty/invalid for job ${job.job_id}`);
    }
    job.status = finalDecision.decision === "ALLOW" ? "DONE" : "REJECT";
    job.runtime_result = {
      job_id: job.job_id,
      decision: finalDecision.decision,
      status: finalDecision.status,
      final_decision_path: finalDecisionPath,
      output_files: finalDecision.output_files || [],
    };
    job.completed_at = new Date().toISOString();
    job.updated_at = new Date().toISOString();
    changed = true;
  }
  if (changed) {
    writeQueue(queue);
  }
  return changed;
}

function enqueueJob(job) {
  const queue = readQueue();
  const normalized = {
    ...job,
    status: "READY",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  queue.jobs.push(normalized);
  writeQueue(queue);
  return normalized;
}

function nextReadyJob(queue) {
  return queue.jobs.find((job) => job.status === "READY");
}

async function processNextJob() {
  const queue = readQueue();
  const job = nextReadyJob(queue);
  if (!job) return null;

  job.status = "RUNNING";
  job.started_at = new Date().toISOString();
  job.updated_at = new Date().toISOString();
  writeQueue(queue);

  try {
    const services = await ensureServicesReady();
    job.service_health = services;
    if (!services.overall_ok) {
      throw new Error("RUNTIME_SERVICES_NOT_READY");
    }

    const result = await runRuntimeJob(job);
    job.status = result.decision === "ALLOW" ? "DONE" : "REJECT";
    job.runtime_result = result;
    job.completed_at = new Date().toISOString();
    job.updated_at = new Date().toISOString();
    writeQueue(queue);
    return result;
  } catch (error) {
    job.status = "REJECT";
    job.error = error.message;
    job.completed_at = new Date().toISOString();
    job.updated_at = new Date().toISOString();
    writeQueue(queue);
    return {
      job_id: job.job_id,
      status: "REJECT",
      decision: "REJECT",
      error: error.message,
    };
  }
}

async function startWorker() {
  ensureQueueFile();
  console.log(`[WORKER] polling ${QUEUE_FILE} every ${WORKER_POLL_MS}ms`);
  while (true) {
    try {
      reconcileCompletedRunningJobs();
      const result = await processNextJob();
      if (result) {
        console.log(`[WORKER] processed job ${result.job_id} -> ${result.decision || result.status}`);
      }
    } catch (error) {
      console.error(`[WORKER] loop error: ${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, WORKER_POLL_MS));
  }
}

if (require.main === module) {
  startWorker().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}

module.exports = {
  enqueueJob,
  readQueue,
  processNextJob,
  startWorker,
};
