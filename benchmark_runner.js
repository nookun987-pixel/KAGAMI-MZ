"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = __dirname;
const JOBS = [
  "jobs/white-ceramic-study-004.json",
  "jobs/mask-macro-ui-001.json",
];
const MATRIX = [
  { id: "A", sampler: "dpmpp_2m_sde_gpu", steps: "24", guidance: "6.2", seedPolicy: "locked" },
  { id: "B", sampler: "dpmpp_2m_sde_gpu", steps: "32", guidance: "6.8", seedPolicy: "small_spread" },
];

function readJsonSafe(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (_) {
    return null;
  }
}

function runCase(jobRel, config) {
  const env = {
    ...process.env,
    SHOT_SAMPLER_OVERRIDE: config.sampler,
    SHOT_STEPS_OVERRIDE: config.steps,
    SHOT_GUIDANCE_OVERRIDE: config.guidance,
    SHOT_SEED_POLICY_OVERRIDE: config.seedPolicy,
    SHOT_CANDIDATE_COUNT_OVERRIDE: "1",
  };
  const command = spawnSync("node", ["orchestrator.js", jobRel], {
    cwd: ROOT,
    env,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 10,
  });
  const job = readJsonSafe(path.join(ROOT, jobRel));
  const summary = job ? readJsonSafe(path.join(ROOT, "runs", job.job_id, "job_summary.json")) : null;
  return {
    config_id: config.id,
    job_file: jobRel,
    job_id: job && job.job_id,
    shot_type: summary && summary.shot_type,
    sampler: config.sampler,
    steps: config.steps,
    guidance: config.guidance,
    seed_policy: config.seedPolicy,
    exit_code: command.status,
    decision: summary && summary.decision,
    dominant_fail_reason: summary && summary.dominant_fail_reason,
    candidate_level: summary && summary.candidate_level,
    best_candidate: summary && summary.best_candidate_summary,
  };
}

const results = [];
for (const job of JOBS) {
  for (const config of MATRIX) {
    results.push(runCase(job, config));
  }
}

const reportDir = path.join(ROOT, "runs", "benchmark_reports");
fs.mkdirSync(reportDir, { recursive: true });
const target = path.join(reportDir, "latest_benchmark_matrix.json");
fs.writeFileSync(target, JSON.stringify(results, null, 2), "utf8");
console.log(JSON.stringify({ report: target, results }, null, 2));
