const fs = require('fs-extra');
const path = require('path');
const sharedState = require('./shared_state');

class ArtifactRegistry {
  constructor() {
    this.artifactDirs = [
      path.join(__dirname, '..', 'data'),
      path.join(__dirname, '..', 'output'),
      path.join(__dirname, '..', 'artifacts')
    ];
    this.knownArtifacts = [
      'output.png',
      'final_decision.json',
      'job_summary.json',
      'pipeline_final_verdict.txt',
      'quality_test_001.json',
      'quality_test_002.json',
      'quality_test_003.json',
      'recovery_scan_results.json',
      'rag_test_mask.json',
      'rag_test_stable.json',
      'rag_test_weapon.json'
    ];
  }

  scanForArtifacts() {
    const artifacts = [];
    for (const dir of this.artifactDirs) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (this.knownArtifacts.includes(file) || file.endsWith('.png') || file.endsWith('.json') || file.endsWith('.txt')) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            artifacts.push({
              path: filePath,
              name: file,
              modified: stats.mtime.toISOString(),
              size: stats.size
            });
          }
        }
      }
    }
    // Sort by modified time, latest first
    artifacts.sort((a, b) => new Date(b.modified) - new Date(a.modified));
    // Update shared state
    sharedState.setArtifacts(artifacts);
    return artifacts.slice(0, 10); // Return latest 10
  }

  getLatestArtifacts() {
    return sharedState.getArtifacts().slice(0, 10);
  }

  registerArtifact(filePath, name) {
    const artifact = {
      path: filePath,
      name: name,
      modified: new Date().toISOString(),
      size: fs.statSync(filePath).size
    };
    sharedState.addArtifact(artifact);
  }
}

const artifactRegistry = new ArtifactRegistry();

module.exports = artifactRegistry;