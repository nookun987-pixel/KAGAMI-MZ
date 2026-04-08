const { buildRuntimeSnapshot } = require("../lib/google_drive_runtime");

export default async function handler(req, res) {
  try {
    const snapshot = await buildRuntimeSnapshot();
    res.status(200).json(snapshot);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      proof: {
        dashboard_source: "google_drive_api",
      },
    });
  }
}
