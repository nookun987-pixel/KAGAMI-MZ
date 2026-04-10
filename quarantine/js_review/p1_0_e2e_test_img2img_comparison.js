/**
 * P1-0: TEXT2IMG vs IMG2IMG COMPARISON TEST
 * Side-by-side comparison to prove img2img is working
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const TEST_ID = `comparison_${Date.now()}`;
const JOBS_DIR = path.join(process.cwd(), 'jobs');
const RUNS_DIR = path.join(process.cwd(), 'runs');

const ANCHOR_IMAGE_PATH = path.join(process.cwd(), 'runs', 'GOLDEN_CERAMIC_MACRO', 'attempt-01', 'candidates', 'candidate-01', 'output.png');

if (!fs.existsSync(ANCHOR_IMAGE_PATH)) {
  console.error('❌ ANCHOR_MISSING');
  process.exit(1);
}

if (!fs.existsSync(JOBS_DIR)) fs.mkdirSync(JOBS_DIR, { recursive: true });

const PROMPT = "ceramic industrial component, matte white surface, studio lighting";
const NEGATIVE = "toy, plastic, neon, abstract pattern";
const SEED = 12345;
const STEPS = 20;

// TEST A: Pure text2img
const jobText2Img = {
  job_id: `${TEST_ID}_A_text2img`,
  phase: "comparison",
  user_idea: PROMPT,
  test_mode: true,
  max_candidates: 1,
  no_retry: false,
  render: {
    width: 1024,
    height: 1024,
    performance: "Quality",
    candidate_count: 1,
    steps: STEPS,
    seed: SEED,
    guidance_scale: 7,
    lora_name: null,
    lora_weight: 0,
    style_selections: [],
    negative_prompt: NEGATIVE
    // NO input_image - pure text2img
  }
};

// TEST B: IMG2IMG with same prompt/seed + denoise 0.05
const jobImg2Img = {
  job_id: `${TEST_ID}_B_img2img`,
  phase: "comparison",
  user_idea: PROMPT,
  test_mode: true,
  max_candidates: 1,
  no_retry: false,
  render: {
    width: 1024,
    height: 1024,
    performance: "Quality",
    candidate_count: 1,
    steps: STEPS,
    seed: SEED,
    guidance_scale: 7,
    lora_name: null,
    lora_weight: 0,
    style_selections: [],
    negative_prompt: NEGATIVE,
    // NATIVE FOOOCUS IMG2IMG ONLY:
    input_image: ANCHOR_IMAGE_PATH,
    denoise_strength: 0.05
  }
};

// Write job files
fs.writeFileSync(path.join(JOBS_DIR, `${jobText2Img.job_id}.json`), JSON.stringify(jobText2Img, null, 2));
fs.writeFileSync(path.join(JOBS_DIR, `${jobImg2Img.job_id}.json`), JSON.stringify(jobImg2Img, null, 2));

console.log('=== P1-0: TEXT2IMG vs IMG2IMG COMPARISON ===');
console.log(`Test ID: ${TEST_ID}`);
console.log(`Prompt: ${PROMPT}`);
console.log(`Seed: ${SEED}`);
console.log(`Anchor: ${ANCHOR_IMAGE_PATH}\n`);

console.log('Job files created:');
console.log(`  A (text2img): ${jobText2Img.job_id}`);
console.log(`  B (img2img):  ${jobImg2Img.job_id}\n`);

console.log('Run these commands in separate terminals:\n');
console.log('Terminal 1 (text2img):');
console.log(`  node orchestrator.js jobs/${jobText2Img.job_id}.json`);
console.log('\nTerminal 2 (img2img):');
console.log(`  node orchestrator.js jobs/${jobImg2Img.job_id}.json`);
console.log('\nThen compare outputs visually.');

// Summary report structure
const report = {
  test_id: TEST_ID,
  anchor_image: ANCHOR_IMAGE_PATH,
  prompt: PROMPT,
  seed: SEED,
  test_a: {
    job_id: jobText2Img.job_id,
    type: 'text2img',
    input_image: null,
    denoise: null,
    expected: 'abstract/noise pattern (no anchor influence)'
  },
  test_b: {
    job_id: jobImg2Img.job_id,
    type: 'img2img',
    input_image: ANCHOR_IMAGE_PATH,
    denoise: 0.05,
    expected: 'anchor shape preserved (~95%)'
  },
  comparison_criteria: {
    if_a_and_b_similar: 'img2img NOT working (input image ignored)',
    if_b_retains_anchor: 'img2img working correctly',
    if_b_is_noise: 'denoise too high or wiring broken'
  }
};

const reportPath = path.join(RUNS_DIR, `${TEST_ID}_comparison_plan.json`);
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`\nReport saved: ${reportPath}`);
console.log('\nEXPECTED OUTCOME:');
console.log('- A (text2img): Abstract noise pattern');
console.log('- B (img2img): Should look like anchor with minor variations');
console.log('- If A == B: img2img wiring broken');
console.log('- If B ≈ anchor: img2img working ✅');
