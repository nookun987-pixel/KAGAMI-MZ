const { buildRuntimeSnapshot } = require("../lib/google_drive_runtime");

export default async function handler(req, res) {
  try {
    const snapshot = await buildRuntimeSnapshot();
    const latest = snapshot.jobs.find((job) => ["completed", "failed", "running", "pending"].includes(job.status)) || null;

    if (!latest) {
      res.status(200).json({ job_id: null, timestamp: null, output_exists: false });
      return;
    }

    res.status(200).json({
      job_id: latest.job_id,
      timestamp: latest.completed_at || latest.failed_at || latest.claimed_at || latest.created_at || null,
      final_decision: latest.result ? { decision: latest.status.toUpperCase(), raw: latest.result } : null,
      output_exists: latest.artifacts.some((artifact) => /\.(png|jpg|jpeg|webp)$/i.test(artifact.name)),
      status: latest.status,
      state_anchor: latest.state_anchor,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}
