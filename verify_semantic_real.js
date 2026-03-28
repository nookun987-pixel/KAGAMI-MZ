#!/usr/bin/env node
/**
 * Semantic Control Loop Verification Suite - Windows Compatible
 * Tests all three scenarios: HARD REJECT, AUTO-RETRY, VLM HARD DEPENDENCY
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const TEST_DIR = path.join(__dirname, "semantic_test_run");
const RESULTS_DIR = path.join(TEST_DIR, "results");

// Create test directories
if (!fs.existsSync(TEST_DIR)) fs.mkdirSync(TEST_DIR);
if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR);

console.log("=== SEMANTIC CONTROL LOOP VERIFICATION ===\n");

// Test 1: HARD REJECT
async function testHardReject() {
  console.log("--- TEST 1: HARD REJECT ---");
  
  const job1 = {
    job_id: "semantic_hard_reject_001",
    notion_page_id: "test_page_001",
    prompt: "anime style, chibi proportions, visible human eyes through mask, glossy plastic toy-like material, bright magenta neon spill",
    color_mode: "neon wound",
    shot_type: "portrait",
    environment: "cyberpunk city",
    priority: "normal",
    max_attempts: 1
  };
  
  const jobFile1 = path.join(TEST_DIR, "job_hard_reject.json");
  fs.writeFileSync(jobFile1, JSON.stringify(job1, null, 2));
  
  try {
    console.log("Running job with intentional violations (max_attempts=1)...");
    
    // Windows environment setup and execution
    const console1Log = path.join(TEST_DIR, 'console1.log');
    const batchScript = `@echo off
set USE_VISION_VALIDATOR=true
set VLM_ENDPOINT=http://localhost:11434/v1/chat/completions
set NODE_ENV=production
cd /d ${__dirname}
node orchestrator.js "${jobFile1}" > "${console1Log}" 2>&1
echo %ERRORLEVEL%`;
    
    const batchFile = path.join(TEST_DIR, "test1.bat");
    fs.writeFileSync(batchFile, batchScript);
    
    const result = execSync(`cmd /c "${batchFile}"`, {
      cwd: __dirname,
      encoding: "utf8",
      timeout: 300000
    });
    
    console.log("Process exit code:", result.trim());
    
    // Read console output
    if (fs.existsSync(path.join(TEST_DIR, "console1.log"))) {
      const consoleOutput = fs.readFileSync(path.join(TEST_DIR, "console1.log"), "utf8");
      console.log("Console output length:", consoleOutput.length, "characters");
      
      // Save console output
      fs.writeFileSync(path.join(RESULTS_DIR, "test1_console.txt"), consoleOutput);
    }
    
  } catch (err) {
    console.log("Execution error:", err.message);
  }
  
  // Collect results
  const results1 = {
    test_name: "HARD_REJECT",
    expected_violations: ["human_eyes_detected", "pvc_plastic_read", "toon_shading", "magenta_neon_spill"],
    console_output: fs.existsSync(path.join(TEST_DIR, "console1.log")) ? fs.readFileSync(path.join(TEST_DIR, "console1.log"), "utf8") : "No console log found",
    execution_steps: fs.existsSync(path.join(TEST_DIR, "execution-steps.json")) ? JSON.parse(fs.readFileSync(path.join(TEST_DIR, "execution-steps.json"), "utf8")) : null,
    validation: fs.existsSync(path.join(TEST_DIR, "validation.json")) ? JSON.parse(fs.readFileSync(path.join(TEST_DIR, "validation.json"), "utf8")) : null
  };
  
  fs.writeFileSync(path.join(RESULTS_DIR, "test1_hard_reject.json"), JSON.stringify(results1, null, 2));
  console.log("✓ Test 1 results saved\n");
  
  return results1;
}

// Test 2: AUTO-RETRY
async function testAutoRetry() {
  console.log("--- TEST 2: AUTO-RETRY ---");
  
  const job2 = {
    job_id: "semantic_auto_retry_001", 
    notion_page_id: "test_page_002",
    prompt: "anime style, chibi proportions, visible human eyes through mask, glossy plastic toy-like material, bright magenta neon spill",
    color_mode: "neon wound",
    shot_type: "portrait", 
    environment: "cyberpunk city",
    priority: "normal",
    max_attempts: 3
  };
  
  const jobFile2 = path.join(TEST_DIR, "job_auto_retry.json");
  fs.writeFileSync(jobFile2, JSON.stringify(job2, null, 2));
  
  try {
    console.log("Running job with auto-retry (max_attempts=3)...");
    
    const console2Log = path.join(TEST_DIR, 'console2.log');
    const batchScript = `@echo off
set USE_VISION_VALIDATOR=true
set VLM_ENDPOINT=http://localhost:11434/v1/chat/completions
set NODE_ENV=production
cd /d ${__dirname}
node orchestrator.js "${jobFile2}" > "${console2Log}" 2>&1
echo %ERRORLEVEL%`;
    
    const batchFile = path.join(TEST_DIR, "test2.bat");
    fs.writeFileSync(batchFile, batchScript);
    
    const result = execSync(`cmd /c "${batchFile}"`, {
      cwd: __dirname,
      encoding: "utf8",
      timeout: 600000
    });
    
    console.log("Process exit code:", result.trim());
    
    // Read console output
    if (fs.existsSync(path.join(TEST_DIR, "console2.log"))) {
      const consoleOutput = fs.readFileSync(path.join(TEST_DIR, "console2.log"), "utf8");
      fs.writeFileSync(path.join(RESULTS_DIR, "test2_console.txt"), consoleOutput);
    }
    
  } catch (err) {
    console.log("Execution error:", err.message);
  }
  
  const results2 = {
    test_name: "AUTO_RETRY",
    max_attempts: 3,
    console_output: fs.existsSync(path.join(TEST_DIR, "console2.log")) ? fs.readFileSync(path.join(TEST_DIR, "console2.log"), "utf8") : "No console log found",
    execution_steps: fs.existsSync(path.join(TEST_DIR, "execution-steps.json")) ? JSON.parse(fs.readFileSync(path.join(TEST_DIR, "execution-steps.json"), "utf8")) : null,
    validation: fs.existsSync(path.join(TEST_DIR, "validation.json")) ? JSON.parse(fs.readFileSync(path.join(TEST_DIR, "validation.json"), "utf8")) : null
  };
  
  fs.writeFileSync(path.join(RESULTS_DIR, "test2_auto_retry.json"), JSON.stringify(results2, null, 2));
  console.log("✓ Test 2 results saved\n");
  
  return results2;
}

// Test 3: VLM HARD DEPENDENCY
async function testVLMDependency() {
  console.log("--- TEST 3: VLM HARD DEPENDENCY ---");
  
  const job3 = {
    job_id: "semantic_vlm_dependency_001",
    notion_page_id: "test_page_003", 
    prompt: "Mikage character portrait",
    color_mode: "fallen ivory",
    shot_type: "portrait",
    environment: "minimal studio",
    priority: "normal",
    max_attempts: 1
  };
  
  const jobFile3 = path.join(TEST_DIR, "job_vlm_dependency.json");
  fs.writeFileSync(jobFile3, JSON.stringify(job3, null, 2));
  
  try {
    console.log("Running job with broken VLM config...");
    
    const console3Log = path.join(TEST_DIR, 'console3.log');
    const batchScript = `@echo off
set USE_VISION_VALIDATOR=true
set VLM_ENDPOINT=
set NODE_ENV=production
cd /d ${__dirname}
node orchestrator.js "${jobFile3}" > "${console3Log}" 2>&1
echo %ERRORLEVEL%`;
    
    const batchFile = path.join(TEST_DIR, "test3.bat");
    fs.writeFileSync(batchFile, batchScript);
    
    const result = execSync(`cmd /c "${batchFile}"`, {
      cwd: __dirname,
      encoding: "utf8",
      timeout: 30000
    });
    
    console.log("Process exit code:", result.trim());
    
    // Read console output
    if (fs.existsSync(path.join(TEST_DIR, "console3.log"))) {
      const consoleOutput = fs.readFileSync(path.join(TEST_DIR, "console3.log"), "utf8");
      fs.writeFileSync(path.join(RESULTS_DIR, "test3_console.txt"), consoleOutput);
    }
    
  } catch (err) {
    console.log("Expected failure:", err.message);
  }
  
  const results3 = {
    test_name: "VLM_DEPENDENCY",
    vlm_config: {
      USE_VISION_VALIDATOR: "true",
      VLM_ENDPOINT: ""
    },
    console_output: fs.existsSync(path.join(TEST_DIR, "console3.log")) ? fs.readFileSync(path.join(TEST_DIR, "console3.log"), "utf8") : "No console log found",
    execution_steps: fs.existsSync(path.join(TEST_DIR, "execution-steps.json")) ? JSON.parse(fs.readFileSync(path.join(TEST_DIR, "execution-steps.json"), "utf8")) : null,
    validation: fs.existsSync(path.join(TEST_DIR, "validation.json")) ? JSON.parse(fs.readFileSync(path.join(TEST_DIR, "validation.json"), "utf8")) : null
  };
  
  fs.writeFileSync(path.join(RESULTS_DIR, "test3_vlm_dependency.json"), JSON.stringify(results3, null, 2));
  console.log("✓ Test 3 results saved\n");
  
  return results3;
}

// Generate summary
function generateSummary(results) {
  const summary = {
    test_suite: "SEMANTIC_CONTROL_LOOP_VERIFICATION",
    timestamp: new Date().toISOString(),
    tests: results,
    overall_status: "COMPLETED"
  };
  
  fs.writeFileSync(path.join(RESULTS_DIR, "summary.txt"), JSON.stringify(summary, null, 2));
  console.log("✓ Summary generated\n");
  
  return summary;
}

// Main execution
async function runTests() {
  try {
    const results1 = await testHardReject();
    const results2 = await testAutoRetry(); 
    const results3 = await testVLMDependency();
    
    const summary = generateSummary([results1, results2, results3]);
    
    console.log("=== VERIFICATION COMPLETE ===");
    console.log("Results saved to:", RESULTS_DIR);
    console.log("Files generated:");
    console.log("- test1_hard_reject.json");
    console.log("- test2_auto_retry.json");
    console.log("- test3_vlm_dependency.json");
    console.log("- test1_console.txt");
    console.log("- test2_console.txt");
    console.log("- test3_console.txt");
    console.log("- summary.txt");
    
  } catch (err) {
    console.error("Test suite failed:", err.message);
  }
}

runTests().catch(console.error);
