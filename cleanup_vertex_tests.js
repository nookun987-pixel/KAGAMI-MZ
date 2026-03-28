const fs = require('fs');

const filesToDelete = [
  'check_vertex_readiness.js',
  'run_real_vertex_validation.js'
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
