const { buildRuntimeSnapshot } = require("../lib/google_drive_runtime");

export default async function handler(req, res) {
  try {
    const snapshot = await buildRuntimeSnapshot();
    const jobs = snapshot.jobs.map((job) => ({
      job_id: job.job_id,
      status: job.status,
      execution_guard: job.status === "pending" ? "awaiting_colab_claim" : "shared_drive_live",
      created_at: job.created_at || job.claimed_at || job.completed_at || job.failed_at || snapshot.generated_at,
      started_at: job.claimed_at || null,
      finished_at: job.completed_at || job.failed_at || null,
      lane: job.lane,
      execution_target: job.execution_target,
      error: job.result && (job.result.error || job.result.error_reason) || null,
    }));

    res.status(200).json({
      count: jobs.length,
      jobs,
      proof: snapshot.proof,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
