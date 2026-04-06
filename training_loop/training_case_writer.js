/**
 * training_loop/training_case_writer.js
 * Write training cases to memory file
 */

const fs = require('fs');
const path = require('path');

const MEMORY_DIR = path.join(__dirname, '..', 'memory');
const TRAINING_FILE = path.join(MEMORY_DIR, 'training_cases.json');

function ensureMemoryDir() {
  if (!fs.existsSync(MEMORY_DIR)) {
    console.log('[TRAINING_WRITER] Creating memory directory...');
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
  }
}

function readExistingCases() {
  if (!fs.existsSync(TRAINING_FILE)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(TRAINING_FILE, 'utf-8');
    if (!content.trim()) {
      return [];
    }
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    console.log('[TRAINING_WRITER] Warning: file exists but not an array, resetting');
    return [];
  } catch (err) {
    console.log(`[TRAINING_WRITER] Warning: failed to read file (${err.message}), resetting`);
    return [];
  }
}

function writeTrainingCase(caseData) {
  console.log('[TRAINING_WRITER] Writing training case...');
  
  // Ensure directory exists
  ensureMemoryDir();
  
  // Read existing cases
  const existingCases = readExistingCases();
  console.log(`[TRAINING_WRITER] Found ${existingCases.length} existing cases`);
  
  // Dedupe: skip if job_id already exists in cases
  const isDuplicate = existingCases.some(c => c.job_id === caseData.job_id);
  if (isDuplicate) {
    console.log(`[TRAINING_WRITER] Dedupe: job ${caseData.job_id} already exists, skipping`);
    return true;
  }
  
  // Create new case with timestamp
  const newCase = {
    job_id: caseData.job_id,
    failure_class: caseData.failure_class,
    patch_plan: caseData.patch_plan,
    ab_result: caseData.ab_result,
    timestamp: new Date().toISOString()
  };
  
  // Append
  existingCases.push(newCase);
  
  // Write back
  try {
    fs.writeFileSync(TRAINING_FILE, JSON.stringify(existingCases, null, 2));
    console.log(`[TRAINING_WRITER] Successfully wrote case for job: ${caseData.job_id}`);
    console.log(`[TRAINING_WRITER] Total cases: ${existingCases.length}`);
    return true;
  } catch (err) {
    console.error(`[TRAINING_WRITER] Failed to write: ${err.message}`);
    return false;
  }
}

module.exports = {
  writeTrainingCase
};
