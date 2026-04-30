const fs = require('fs');

const filesToDelete = [
  'vertex_credential_check.js',
  'final_vertex_verification.js'
];

filesToDelete.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`Deleted: ${file}`);
    } catch (err) {
      console.log(`Failed to delete: ${file} - ${err.message}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
