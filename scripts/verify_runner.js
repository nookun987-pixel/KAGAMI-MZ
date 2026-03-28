#!/usr/bin/env node

/**
 * MIKAGE Verification Harness
 * 
 * Strict verification runner for testing the MIKAGE pipeline.
 * 
 * Usage: node scripts/verify_runner.js <test_case_name>
 * 
 * Features:
 * - Runs orchestrator.js with timeout (120000ms)
 * - Captures stdout + stderr
 * - Detects decision (PASS / REJECT / FAIL)
 * - Enforces HARD RULE: empty output_files → FAIL
 * - Writes structured output to scripts/test_output/<test_name>/<timestamp>/
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const TIMEOUT_MS = 600000;
const ROOT_DIR = path.resolve(__dirname, "..");
const TEST_CASES_DIR = path.join(__dirname, "test_cases");
const TEST_OUTPUT_DIR = path.join(__dirname, "test_output");

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: node scripts/verify_runner.js <test_case_name> [--timeout=<ms>]");
    process.exit(1);
  }
  
  let testName = args[0];
  let timeout = TIMEOUT_MS;
  
  // Parse optional timeout parameter
  const timeoutArg = args.find(arg => arg.startsWith('--timeout='));
  if (timeoutArg) {
    const timeoutValue = parseInt(timeoutArg.split('=')[1]);
    if (isNaN(timeoutValue) || timeoutValue <= 0) {
      console.error("Invalid timeout value. Must be a positive number.");
      process.exit(1);
    }
    timeout = timeoutValue;
  }
  
  return { testName, timeout };
}

/**
 * Load test case file
 */
function loadTestCase(testName) {
  const testCasePath = path.join(TEST_CASES_DIR, `${testName}.json`);
  if (!fs.existsSync(testCasePath)) {
    throw new Error(`Test case file not found: ${testCasePath}`);
  }
  return JSON.parse(fs.readFileSync(testCasePath, "utf-8"));
}

/**
 * Create output directory structure
 */
function createOutputDir(testName) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputDir = path.join(TEST_OUTPUT_DIR, testName, timestamp);
  fs.mkdirSync(outputDir, { recursive: true });
  return outputDir;
}

/**
 * Run orchestrator with timeout and capture output
 */
function runOrchestrator(testCase, outputDir, timeout = TIMEOUT_MS) {
  return new Promise((resolve) => {
    const consoleLogPath = path.join(outputDir, "console.log");
    const consoleLogStream = fs.createWriteStream(consoleLogPath, { flags: "w" });
    
    // Write test case to temp file for orchestrator
    const tempJobPath = path.join(outputDir, "job.json");
    fs.writeFileSync(tempJobPath, JSON.stringify(testCase, null, 2), "utf-8");
    
    const child = spawn("node", ["orchestrator.js", tempJobPath], {
      cwd: ROOT_DIR,
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env }
    });
    
    let stdout = "";
    let stderr = "";
    
    child.stdout.on("data", (data) => {
      const text = data.toString();
      stdout += text;
      consoleLogStream.write(`[STDOUT] ${text}`);
    });
    
    child.stderr.on("data", (data) => {
      const text = data.toString();
      stderr += text;
      consoleLogStream.write(`[STDERR] ${text}`);
    });
    
    const timeoutHandle = setTimeout(() => {
      child.kill("SIGKILL");
      resolve({
        exitCode: -1,
        signal: "TIMEOUT",
        stdout,
        stderr,
        error: `Process timed out after ${timeout}ms`
      });
    }, timeout);
    
    child.on("close", (code, signal) => {
      clearTimeout(timeoutHandle);
      consoleLogStream.end();
      resolve({
        exitCode: code,
        signal,
        stdout,
        stderr
      });
    });
    
    child.on("error", (error) => {
      clearTimeout(timeoutHandle);
      consoleLogStream.end();
      resolve({
        exitCode: -1,
        signal: "ERROR",
        stdout,
        stderr,
        error: error.message
      });
    });
  });
}

/**
 * Parse orchestrator output to extract job result
 */
function parseJobResult(stdout, outputDir) {
  try {
    // First try to look for job summary files in runs directory
    const runsDir = path.join(ROOT_DIR, "runs");
    if (fs.existsSync(runsDir)) {
      const runDirs = fs.readdirSync(runsDir).filter(d => 
        fs.statSync(path.join(runsDir, d)).isDirectory()
      ).sort().reverse();
      
      if (runDirs.length > 0) {
        const latestRunDir = path.join(runsDir, runDirs[0]);
        const summaryPath = path.join(latestRunDir, "job_summary.json");
        
        if (fs.existsSync(summaryPath)) {
          const summary = JSON.parse(fs.readFileSync(summaryPath, "utf-8"));
          
          // Copy relevant files to output directory
          const filesToCopy = [
            { name: "job_summary.json", source: summaryPath },
            { name: "validation.json", source: path.join(latestRunDir, "validation.json") },
            { name: "execution-steps.json", source: path.join(latestRunDir, "execution-steps.json") }
          ];
          
          filesToCopy.forEach(({ name, source }) => {
            if (fs.existsSync(source)) {
              fs.copyFileSync(source, path.join(outputDir, name));
            }
          });
          
          return summary;
        }
      }
    }
    
    // If no job summary found, try to parse FINAL STATE from stdout
    const finalStateMatch = stdout.match(/FINAL STATE:\s*\n([\s\S]*?)\n============================================================/);
    if (finalStateMatch) {
      try {
        const finalState = JSON.parse(finalStateMatch[1]);
        console.log(`📊 Parsed final state from stdout: decision=${finalState.decision}, output_files=${finalState.output_files?.length || 0}`);
        return finalState;
      } catch (parseError) {
        console.warn(`Failed to parse final state JSON: ${parseError.message}`);
      }
    }
  } catch (error) {
    console.warn(`Failed to parse job result: ${error.message}`);
  }
  
  return null;
}

/**
 * Determine verification result
 */
function determineResult(jobResult, executionResult) {
  const result = {
    decision: "FAIL",
    reasons: [],
    output_files: [],
    job_decision: null,
    exit_code: executionResult.exitCode,
    signal: executionResult.signal
  };
  
  // HARD RULE: If execution failed (timeout, crash, etc.)
  if (executionResult.exitCode !== 0 || executionResult.signal) {
    result.reasons.push(`Execution failed: exit=${executionResult.exitCode}, signal=${executionResult.signal}`);
    if (executionResult.error) {
      result.reasons.push(executionResult.error);
    }
    return result;
  }
  
  // Parse job result
  if (!jobResult) {
    result.reasons.push("No job result found - orchestrator may have failed silently");
    return result;
  }
  
  result.job_decision = jobResult.decision;
  result.output_files = jobResult.output_files || [];
  
  // HARD RULE: If output_files is empty → FAIL
  if (!result.output_files || result.output_files.length === 0) {
    result.reasons.push("HARD RULE: No output files generated");
    return result;
  }
  
  // Map job decision to verification decision
  switch (jobResult.decision) {
    case "PASS":
      result.decision = "PASS";
      break;
    case "REJECT":
      result.decision = "REJECT";
      result.reasons.push("Job was REJECTED by pipeline");
      break;
    case "REVIEW":
      result.decision = "FAIL";
      result.reasons.push("Job ended in REVIEW state (not PASS)");
      break;
    case "AUTO_SAFE":
      result.decision = "FAIL";
      result.reasons.push("Job ended in AUTO_SAFE state (not PASS)");
      break;
    default:
      result.decision = "FAIL";
      result.reasons.push(`Unknown job decision: ${jobResult.decision}`);
  }
  
  // Add Mikage rule engine results if available
  if (jobResult.block_level && jobResult.block_level !== "NONE") {
    result.reasons.push(`Mikage block level: ${jobResult.block_level}`);
  }
  
  if (jobResult.failed_rules && jobResult.failed_rules.length > 0) {
    result.reasons.push(`Failed rules: ${jobResult.failed_rules.join(", ")}`);
  }
  
  return result;
}

/**
 * Write result files
 */
function writeResults(outputDir, testCase, executionResult, jobResult, verificationResult) {
  // result.json
  const resultPath = path.join(outputDir, "result.json");
  fs.writeFileSync(resultPath, JSON.stringify({
    test_case: testCase,
    execution: executionResult,
    job_result: jobResult,
    verification: verificationResult,
    timestamp: new Date().toISOString()
  }, null, 2), "utf-8");
  
  // summary.txt
  const summaryPath = path.join(outputDir, "summary.txt");
  const summaryLines = [
    `=== MIKAGE VERIFICATION RESULT ===`,
    `Test Case: ${testCase.job_id || "unknown"}`,
    `Timestamp: ${new Date().toISOString()}`,
    `Decision: ${verificationResult.decision}`,
    `Job Decision: ${verificationResult.job_decision || "N/A"}`,
    `Exit Code: ${verificationResult.exit_code}`,
    `Signal: ${verificationResult.signal || "N/A"}`,
    `Output Files: ${verificationResult.output_files.length}`,
    ``,
    `=== REASONS ===`,
    ...verificationResult.reasons.map(r => `- ${r}`),
    ``,
    `=== OUTPUT FILES ===`,
    ...verificationResult.output_files.map(f => `- ${f}`),
    ``,
    `=== VERIFICATION STATUS ===`,
    verificationResult.decision === "PASS" ? "✅ PASSED" : "❌ FAILED"
  ];
  
  fs.writeFileSync(summaryPath, summaryLines.join("\n"), "utf-8");
}

/**
 * Main verification function
 */
async function runVerification() {
  try {
    const { testName, timeout } = parseArgs();
    console.log(`🔍 Starting verification for: ${testName} (timeout: ${timeout}ms)`);
    
    // Load test case
    const testCase = loadTestCase(testName);
    console.log(`📋 Loaded test case: ${testCase.job_id}`);
    
    // Create output directory
    const outputDir = createOutputDir(testName);
    console.log(`📁 Output directory: ${outputDir}`);
    
    // Run orchestrator
    console.log(`🚀 Running orchestrator.js...`);
    const executionResult = await runOrchestrator(testCase, outputDir, timeout);
    
    // Parse job result
    console.log(`📊 Parsing job result...`);
    const jobResult = parseJobResult(executionResult.stdout, outputDir);
    
    // Determine verification result
    console.log(`⚖️ Determining verification result...`);
    const verificationResult = determineResult(jobResult, executionResult);
    
    // Write results
    console.log(`💾 Writing results...`);
    writeResults(outputDir, testCase, executionResult, jobResult, verificationResult);
    
    // Print summary
    console.log(`\n=== VERIFICATION COMPLETE ===`);
    console.log(`Test: ${testName}`);
    console.log(`Decision: ${verificationResult.decision}`);
    console.log(`Output: ${outputDir}`);
    
    if (verificationResult.decision === "PASS") {
      console.log(`✅ VERIFICATION PASSED`);
    } else {
      console.log(`❌ VERIFICATION FAILED`);
      console.log(`Reasons:`);
      verificationResult.reasons.forEach(reason => console.log(`  - ${reason}`));
    }
    
    process.exit(verificationResult.decision === "PASS" ? 0 : 1);
    
  } catch (error) {
    console.error(`❌ Verification error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runVerification();
}

module.exports = { runVerification };
