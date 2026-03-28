const files = ['api/status.ts', 'api/status-api.ts'];
const fs = require('fs');

files.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`Deleted: ${file}`);
    } catch (err) {
      console.log(`Failed to delete: ${file}`);
    }
  }
});
