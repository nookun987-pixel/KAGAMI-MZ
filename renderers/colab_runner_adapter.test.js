"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

function resetRenderersModuleCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.includes("\\renderers\\colab_runner_adapter.js")) {
      delete require.cache[key];
    }
  }
}

test("colab runner adapter uses job_inbox -> claims -> outputs/result.json shared contract", async () => {
  const sharedRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mikage-shared-"));
  const runRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mikage-runs-"));

  process.env.DRIVE_ROOT = sharedRoot;
  process.env.COLAB_POLL_INTERVAL_MS = "25";
  process.env.COLAB_TIMEOUT_MS = "1500";

  resetRenderersModuleCache();
  const { submitToColab, pollForCompletion, buildJobContract } = require("./colab_runner_adapter");

  const contract = buildJobContract({
    job_id: "RUN-SHARED-001",
    execution_target: "colab_runner",
    prompt: "render the product cleanly",
    idea: "render the product cleanly",
    lane: "mask_macro",
  });

  assert.equal(contract.job_id, "RUN-SHARED-001");
  assert.equal(contract.lane, "mask_macro");
  assert.equal(contract.idea, "render the product cleanly");
  assert.equal(contract.prompt, "render the product cleanly");
  assert.equal(contract.execution_target, "colab_runner");

  const submission = await submitToColab(
    {
      job_id: "RUN-SHARED-001",
      execution_target: "colab_runner",
      prompt: "render the product cleanly",
      idea: "render the product cleanly",
      lane: "mask_macro",
    },
    { shot_type: "mask_macro", structured_prompt: "render the product cleanly" },
    {
      run_dir: path.join(runRoot, "RUN-SHARED-001"),
      output_png: path.join(runRoot, "RUN-SHARED-001", "output.png"),
    }
  );

  assert.equal(fs.existsSync(submission.job_file_path), true);
  assert.equal(submission.job_file_path.endsWith(path.join("job_inbox", "RUN-SHARED-001.json")), true);

  const workerPromise = new Promise((resolve) => {
    setTimeout(() => {
      fs.mkdirSync(path.dirname(submission.claim_path), { recursive: true });
      fs.writeFileSync(submission.claim_path, JSON.stringify({
        job_id: "RUN-SHARED-001",
        claimed_at: "2026-04-06T00:00:00.000Z",
        worker_id: "colab-test",
      }, null, 2), "utf8");

      fs.mkdirSync(submission.output_dir, { recursive: true });
      fs.writeFileSync(path.join(submission.output_dir, "output.png"), "fake-image", "utf8");
      fs.writeFileSync(submission.result_path, JSON.stringify({
        job_id: "RUN-SHARED-001",
        status: "SUCCESS",
        output_file_path: path.join(submission.output_dir, "output.png"),
        completed_at: "2026-04-06T00:01:00.000Z",
      }, null, 2), "utf8");
      resolve();
    }, 100);
  });

  const [completion] = await Promise.all([
    pollForCompletion(submission, 1500),
    workerPromise,
  ]);

  assert.equal(completion.status, "SUCCESS");
  assert.equal(completion.state, "SUCCESS");
  assert.equal(completion.result_path, submission.result_path);
  assert.equal(completion.result.status, "SUCCESS");
});
