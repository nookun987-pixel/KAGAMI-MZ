/**
 * dispatcher/drive_job_writer.js
 * DEPRECATED: legacy dispatch helper retained for migration support.
 *
 * Active Drive queue runtime is runtime/drive_queue/runtime.js
 * Active control plane is MIKAGE/
 */

"use strict";

const path = require("path");
const driveRuntime = require("../runtime/drive_queue/runtime");

const DRIVE_ROOT = process.env.DRIVE_ROOT || path.resolve(__dirname, "..", "drive_staging");
const JOB_INBOX = driveRuntime.resolveDrivePaths({ driveRoot: DRIVE_ROOT }).jobInboxDir;

function writeJobToInbox(patchedJobSpec) {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const specId = (patchedJobSpec.job_spec && patchedJobSpec.job_spec.job_id) || "UNKNOWN";
  const job_id = `JOB_${specId}_${ts}`;

  const jobFile = {
    job_id,
    patched_job_spec: patchedJobSpec,
    execution_target: "colab_runner",
    created_at: new Date().toISOString(),
  };

  const written = driveRuntime.writeJob(jobFile, { driveRoot: DRIVE_ROOT });

  console.log(`DISPATCHED: ${job_id}`);
  console.log(`  path: ${written.jobFilePath}`);

  return { job_id, file_path: written.jobFilePath };
}

module.exports = { writeJobToInbox, JOB_INBOX, DRIVE_ROOT };
