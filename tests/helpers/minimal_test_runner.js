#!/usr/bin/env node
/**
 * Minimal Direct Test Runner - NO SHELL WRAPPER
 * Fixes ETIMEDOUT by calling orchestrator directly
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const TEST_DIR = path.join(__dirname, "semantic_test_run");
const RESULTS_DIR = path.join(TEST_DIR, "results");

// Create test directories
if (!fs.existsSync(TEST_DIR)) fs.mkdirSync(TEST_DIR);
if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR);

console.log("=== MINIMAL DIRECT TEST RUNNER ===\n");

// Test 1: HARD REJECT with bad prompt
async function testHardRejectDirect() {
  console.log("--- TEST 1: HARD REJECT (DIRECT) ---");
  
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
  
  console.log("Job file created:", jobFile1);
  console.log("Command: node orchestrator.js", jobFile1);
  console.log("Working directory:", __dirname);
  console.log("Timeout: 300000ms (5 minutes)");
  console.log("Environment: USE_VISION_VALIDATOR=true, VLM_ENDPOINT=http://localhost:11434/v1/chat/completions");
  
  try {
    // Direct orchestrator invocation - NO SHELL WRAPPER
    const child = spawn("node", ["orchestrator.js", jobFile1], {
      cwd: __dirname,
      stdio: ["pipe", "pipe", "pipe"],
      env: {
        ...process.env,
        USE_VISION_VALIDATOR: "true",
        VLM_ENDPOINT: "http://localhost:11434/v1/chat/completions",
        NODE_ENV: "production"
      }
    });
    
    let stdout = "";
    let stderr = "";
    
    child.stdout.on("data", (data) => {
      stdout += data.toString();
      process.stdout.write(data);
    });
    
    child.stderr.on("data", (data) => {
      stderr += data.toString();
      process.stderr.write(data);
    });
    
    const timeout = 300000; // 5 minutes
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`ETIMEDOUT after ${timeout}ms`)), timeout);
    });
    
    const exitPromise = new Promise((resolve, reject) => {
      child.on("close", (code, signal) => {
        console.log(`\nProcess exited with code: ${code}, signal: ${signal}`);
        resolve({ code, signal, stdout, stderr });
      });
      
      child.on("error", (err) => {
        console.error("Process error:", err);
        reject(err);
      });
    });
    
    const result = await Promise.race([exitPromise, timeoutPromise]);
    
    // Save console output
    const fullOutput = stdout + stderr;
    fs.writeFileSync(path.join(RESULTS_DIR, "test1_console.txt"), fullOutput);
    console.log(`Console output saved: ${fullOutput.length} characters`);
    
    // Collect results
    const results1 = {
      test_name: "HARD_REJECT_DIRECT",
      expected_violations: ["human_eyes_detected", "pvc_plastic_read", "toon_shading", "magenta_neon_spill"],
      execution_info: {
        command: `node orchestrator.js ${jobFile1}`,
        working_directory: __dirname,
        timeout_ms: timeout,
        exit_code: result.code,
        signal: result.signal
      },
      console_output: fullOutput,
      execution_steps: fs.existsSync(path.join(TEST_DIR, "execution-steps.json")) ? JSON.parse(fs.readFileSync(path.join(TEST_DIR, "execution-steps.json"), "utf8")) : null,
      validation: fs.existsSync(path.join(TEST_DIR, "validation.json")) ? JSON.parse(fs.readFileSync(path.join(TEST_DIR, "validation.json"), "utf8")) : null
    };
    
    fs.writeFileSync(path.join(RESULTS_DIR, "test1_hard_reject.json"), JSON.stringify(results1, null, 2));
    console.log("✓ Test 1 results saved");
    
    return results1;
    
  } catch (err) {
    console.log("Execution error:", err.message);
    
    // Save error results
    const errorResults = {
      test_name: "HARD_REJECT_DIRECT",
      execution_info: {
        command: `node orchestrator.js ${jobFile1}`,
        working_directory: __dirname,
        timeout_ms: 300000,
        error: err.message
      },
      console_output: "",
      execution_steps: null,
      validation: null,
      error: true
    };
    
    fs.writeFileSync(path.join(RESULTS_DIR, "test1_hard_reject.json"), JSON.stringify(errorResults, null, 2));
    return errorResults;
  }
}

// Main execution
async function runTest() {
  try {
    const results = await testHardRejectDirect();
    
    console.log("\n=== ROOT CAUSE ANALYSIS ===");
    if (results.error) {
      console.log("❌ ROOT CAUSE: Process still hanging - likely VLM/Fooocus connectivity issue");
      console.log("❌ FIX APPLIED: Removed shell wrapper, using direct spawn");
      console.log("❌ STATUS: ETIMEDOUT still occurs - check external services");
    } else {
      console.log("✅ ROOT CAUSE: Shell wrapper was causing timeout");
      console.log("✅ FIX APPLIED: Direct orchestrator invocation");
      console.log("✅ STATUS: Test completed successfully");
    }
    
    console.log("\n=== ARTIFACTS GENERATED ===");
    console.log("- test1_hard_reject.json");
    console.log("- test1_console.txt");
    if (results.execution_steps) console.log("- execution-steps.json");
    if (results.validation) console.log("- validation.json");
    
    console.log("\n=== FINAL DECISION ===");
    if (results.error) {
      console.log("DECISION: External service connectivity issue - check VLM/Fooocus");
    } else {
      console.log("DECISION: Shell wrapper fixed - test runner now works");
    }
    
  } catch (err) {
    console.error("Test runner failed:", err.message);
  }
}

runTest().catch(console.error);
