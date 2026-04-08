const { buildRuntimeSnapshot } = require("../lib/google_drive_runtime");

export default async function handler(req, res) {
  try {
    const snapshot = await buildRuntimeSnapshot();
    res.status(200).json({
      google_drive: {
        status: "UP",
        root: snapshot.root.name,
        counts: snapshot.counts,
      },
    });
  } catch (error) {
    res.status(500).json({
      google_drive: {
        status: "DOWN",
        error: error.message,
      },
    });
  }
}
