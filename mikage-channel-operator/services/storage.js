const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '../data/output.json');

function saveLocal(data) {
  // Append to existing if file exists
  let existing = { runs: [] };
  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
    } catch (_) {
      existing = { runs: [] };
    }
  }

  existing.runs.push({
    timestamp: new Date().toISOString(),
    ...data,
  });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(existing, null, 2), 'utf-8');
  console.log(`[STORAGE] ✓ Saved to ${OUTPUT_PATH}`);
  return OUTPUT_PATH;
}

module.exports = { saveLocal };
