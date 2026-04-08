const { buildRuntimeSnapshot } = require("../lib/google_drive_runtime");

export default async function handler(req, res) {
  try {
    const snapshot = await buildRuntimeSnapshot();
    const logs = snapshot.logs.flatMap((file) => {
      if (!file.lines.length) {
        return [`[${file.name}] <empty>`];
      }
      return file.lines.map((line) => `[${file.name}] ${line}`);
    });

    res.status(200).json({
      logs,
      files: snapshot.logs.map((file) => ({
        name: file.name,
        modifiedTime: file.modifiedTime,
      })),
    });
  } catch (error) {
    res.status(500).json({
      logs: [`Google Drive logs unavailable: ${error.message}`],
    });
  }
}
