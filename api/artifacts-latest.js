const { buildRuntimeSnapshot } = require("../lib/google_drive_runtime");

export default async function handler(req, res) {
  try {
    const snapshot = await buildRuntimeSnapshot();
    const latestArtifacts = snapshot.jobs
      .flatMap((job) => job.artifacts.map((artifact) => ({
        ...artifact,
        job_id: job.job_id,
      })))
      .sort((a, b) => String(b.modifiedTime || "").localeCompare(String(a.modifiedTime || "")))
      .slice(0, 20);

    res.status(200).json(latestArtifacts);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}
