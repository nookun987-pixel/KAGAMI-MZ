const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const FOOOCUS_OUTPUT_DIR = 'D:/Fooocus-main/outputs';

// Debug: Check current state of Fooocus outputs
function debugFooocusOutputs() {
  console.log('[DEBUG] Checking Fooocus outputs...');
  
  if (!fs.existsSync(FOOOCUS_OUTPUT_DIR)) {
    console.log('[DEBUG] Fooocus output directory does not exist');
    return;
  }
  
  const outputDirs = fs.readdirSync(FOOOCUS_OUTPUT_DIR)
    .filter(name => name.match(/^\d{4}-\d{2}-\d{2}$/))
    .sort()
    .reverse();
  
  console.log(`[DEBUG] Found ${outputDirs.length} output directories: ${outputDirs.join(', ')}`);
  
  // Check today's directory
  const today = new Date().toISOString().split('T')[0];
  const todayDir = path.join(FOOOCUS_OUTPUT_DIR, today);
  
  if (fs.existsSync(todayDir)) {
    const files = fs.readdirSync(todayDir)
      .filter(file => file.endsWith('.png'))
      .sort();
    
    console.log(`[DEBUG] Today's directory (${todayDir}) has ${files.length} PNG files: ${files.join(', ')}`);
    
    // Show file times
    files.forEach(file => {
      const filePath = path.join(todayDir, file);
      const stat = fs.statSync(filePath);
      console.log(`[DEBUG] ${file}: mtime=${stat.mtime.toISOString()}, mtimeMs=${stat.mtimeMs}`);
    });
  } else {
    console.log(`[DEBUG] Today's directory (${todayDir}) does not exist`);
  }
}

// Simulate orchestrator capture logic
function simulateOrchestratorCapture(startMs) {
  console.log(`[DEBUG] Simulating orchestrator capture with startMs=${startMs} (${new Date(startMs).toISOString()})`);
  
  let newest = null;
  let newestMtime = startMs;
  
  const scan = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      console.log(`[DEBUG] Cannot read directory ${dir}: ${e.message}`);
      return;
    }
    
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(full);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
        try {
          const stat = fs.statSync(full);
          console.log(`[DEBUG] Found PNG: ${full}, mtimeMs=${stat.mtimeMs}, newestMtime=${newestMtime}, isNewer=${stat.mtimeMs > newestMtime}`);
          
          if (stat.mtimeMs > newestMtime) {
            newestMtime = stat.mtimeMs;
            newest = full;
            console.log(`[DEBUG] Newer PNG found: ${newest}`);
          }
        } catch (e) {
          console.log(`[DEBUG] Cannot stat ${full}: ${e.message}`);
        }
      }
    }
  };
  
  scan(FOOOCUS_OUTPUT_DIR);
  
  console.log(`[DEBUG] Final result: newest=${newest}, newestMtime=${newestMtime}`);
  return newest;
}

// Test capture scenarios
function testCaptureScenarios() {
  console.log('\n=== CAPTURE SCENARIO TESTS ===\n');
  
  // Scenario 1: Current time (should find existing files)
  const now = Date.now();
  console.log('\n--- Scenario 1: Current time ---');
  const result1 = simulateOrchestratorCapture(now - 60000); // 1 minute ago
  console.log(`Result: ${result1}`);
  
  // Scenario 2: Future time (should find nothing)
  console.log('\n--- Scenario 2: Future time ---');
  const future = Date.now() + 60000; // 1 minute in future
  const result2 = simulateOrchestratorCapture(future);
  console.log(`Result: ${result2}`);
  
  // Scenario 3: Very old time (should find newest)
  console.log('\n--- Scenario 3: Old time ---');
  const old = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago
  const result3 = simulateOrchestratorCapture(old);
  console.log(`Result: ${result3}`);
}

// Main execution
async function main() {
  console.log('[DEBUG] Render capture debug analysis');
  
  // Check current state
  debugFooocusOutputs();
  
  // Test capture scenarios
  testCaptureScenarios();
}

main().catch(console.error);
