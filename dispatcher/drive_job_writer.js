/**
 * dispatcher/drive_job_writer.js
 * PHASE 6.5 — Drive Job Writer
 *
 * Single-purpose module: write a patched_job_spec as a job file
 * into the Google Drive job_inbox folder for Colab runner pickup.
 *
 * - JSON only
 * - No UI, no loop, no retry, no queue
 * - Single write operation
 * - Logs path written
 */

"use strict";

const fs = require("fs");
const path = require("path");

const DRIVE_ROOT = process.env.DRIVE_ROOT || path.resolve(__dirname, "..", "drive_staging");
const JOB_INBOX = path.join(DRIVE_ROOT, "job_inbox");

/**
 * Write a patched_job_spec into Drive job_inbox as a single JSON file.
 *
 * @param {object} patchedJobSpec - The full patched_job_spec object
 * @returns {{ job_id: string, file_path: string }} Written job info
 */
function writeJobToInbox(patchedJobSpec) {
  // Generate job_id
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const specId = (patchedJobSpec.job_spec && patchedJobSpec.job_spec.job_id) || "UNKNOWN";
  const job_id = `JOB_${specId}_${ts}`;

  // Build job envelope
  const jobFile = {
    job_id,
    patched_job_spec: patchedJobSpec,
    execution_target: "colab_runner",
    created_at: new Date().toISOString(),
  };

  // Ensure inbox exists
  if (!fs.existsSync(JOB_INBOX)) {
    fs.mkdirSync(JOB_INBOX, { recursive: true });
  }

  // Write single file
  const filePath = path.join(JOB_INBOX, `${job_id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(jobFile, null, 2), "utf-8");

  console.log(`DISPATCHED: ${job_id}`);
  console.log(`  path: ${filePath}`);

  return { job_id, file_path: filePath };
}

module.exports = { writeJobToInbox, JOB_INBOX, DRIVE_ROOT };
