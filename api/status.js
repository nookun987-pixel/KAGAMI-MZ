const { buildRuntimeSnapshot } = require("../lib/google_drive_runtime");

export default async function handler(req, res) {
  try {
    const snapshot = await buildRuntimeSnapshot();
    const selectedJobId = req.query && req.query.job_id ? String(req.query.job_id) : null;
    const selectedJob = selectedJobId
      ? snapshot.jobs.find((job) => job.job_id === selectedJobId) || null
      : snapshot.jobs[0] || null;

    res.status(200).json({
      system: "MIKAGE",
      status: "ONLINE",
      time: snapshot.generated_at,
      services: {
        google_drive: {
          status: "UP",
          detail: `Reading ${snapshot.root.name} via Google Drive API`,
        },
      },
      counts: snapshot.counts,
      jobs: snapshot.jobs,
      selected_job_id: selectedJob && selectedJob.job_id || null,
      selected_job: selectedJob,
      proof: snapshot.proof,
    });
  } catch (error) {
    res.status(500).json({
      system: "MIKAGE",
      status: "OFFLINE",
      time: new Date().toISOString(),
      error: error.message,
      services: {
        google_drive: {
          status: "DOWN",
          detail: error.message,
        },
      },
    });
  }
}
