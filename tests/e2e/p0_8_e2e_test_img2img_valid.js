/**
 * P0-8: VALID FOOOCUS IMG2IMG TEST
 * End-to-End test using standard Fooocus image-to-image API
 * Uses only: input_image + denoise_strength (no custom control fields)
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const TEST_JOB_ID = `e2e_test_img2img_valid_${Date.now()}`;
const JOBS_DIR = path.join(process.cwd(), 'jobs');
const RUNS_DIR = path.join(process.cwd(), 'runs');

// Anchor image: existing ceramic output
const ANCHOR_IMAGE_PATH = path.join(process.cwd(), 'runs', 'GOLDEN_CERAMIC_MACRO', 'attempt-01', 'candidates', 'candidate-01', 'output.png');

console.log('=== P0-8: VALID FOOOCUS IMG2IMG TEST ===');
console.log(`Test Job ID: ${TEST_JOB_ID}`);
console.log(`Anchor Image: ${ANCHOR_IMAGE_PATH}`);
console.log(`Anchor exists: ${fs.existsSync(ANCHOR_IMAGE_PATH)}\n`);

// Pre-flight check
if (!fs.existsSync(ANCHOR_IMAGE_PATH)) {
  console.error('❌ ANCHOR_PRECHECK_FAIL: Anchor not found');
  process.exit(1);
}

// Ensure jobs directory exists
if (!fs.existsSync(JOBS_DIR)) {
  fs.mkdirSync(JOBS_DIR, { recursive: true });
}

// Create test job with NATIVE FOOOCUS IMG2IMG
const jobData = {
  job_id: TEST_JOB_ID,
  phase: "material_study",
  user_idea: "front-facing engineered ceramic industrial component, precision-manufactured matte white boron-carbide ceramic housing, exact symmetrical hard-surface geometry, clean beveled edges, visible mounting holes, readable industrial object silhouette, non-decorative, non-organic, premium studio isolation, controlled shadow, minimal environment, precision product photograph, tactile ceramic density, subtle mineral surface variation, no consumer gadget styling, no fashion styling",
  test_mode: true,
  max_candidates: 1,
  no_retry: false,
  render: {
    width: 1024,
    height: 1024,
    performance: "Quality",
    candidate_count: 1,
    steps: 40,
    guidance_scale: 7,
    lora_name: null,
    lora_weight: 0,
    style_selections: [],
    negative_prompt: "toy, toy-like, plastic, pvc, glossy polymer, glossy plastic, rubber, resin figurine, cute rounded object, abstract sculpture, decorative ceramic art, vase, ornament, porcelain decor, soft form, fashion lighting, product ad glow, neon, magenta spill, cyberpunk, emissive lighting, overexposed studio wash, reflective plastic sheen, translucent material, glassy surface, consumer electronics look, cheap commercial render, oversaturated, crimson overuse, color drift, bloom, neon light, emissive",
    // NATIVE FOOOCUS IMG2IMG ONLY:
    input_image: ANCHOR_IMAGE_PATH,
    denoise_strength: 0.30
  }
};

const jobFile = path.join(JOBS_DIR, `${TEST_JOB_ID}.json`);
fs.writeFileSync(jobFile, JSON.stringify(jobData, null, 2));

console.log('✅ Job file created:', jobFile);
console.log('📝 Standard Fooocus IMG2IMG config:');
console.log(`   - input_image: ${ANCHOR_IMAGE_PATH}`);
console.log(`   - denoise_strength: 0.30`);
console.log(`   - NO custom control fields`);
console.log(`   - NO LoRA`);
console.log(`\n📦 Payload excerpt (render section):`);
console.log(JSON.stringify(jobData.render, null, 2));

// Run orchestrator
console.log('\n🚀 Starting orchestrator...\n');
const startTime = Date.now();

const child = spawn('node', ['orchestrator.js', jobFile], {
  cwd: process.cwd(),
  stdio: 'pipe'
});

let output = '';
let error = '';

child.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  process.stdout.write(text);
});

child.stderr.on('data', (data) => {
  const text = data.toString();
  error += text;
  process.stderr.write(text);
});

child.on('close', (code) => {
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\n✅ Orchestrator completed in ${duration}s (exit code: ${code})\n`);

  const runDir = path.join(RUNS_DIR, TEST_JOB_ID);

  // ==================== MANDATORY OUTPUT REPORT ====================
  console.log('='.repeat(60));
  console.log('MANDATORY OUTPUT REPORT - P0-8 IMG2IMG');
  console.log('='.repeat(60));

  // A. Payload JSON used
  console.log('\nA. PAYLOAD JSON (render section):');
  console.log(JSON.stringify(jobData.render, null, 2));

  // B. Whether Fooocus accepted payload
  const renderPayloadPath = path.join(runDir, 'attempt-01', 'candidates', 'candidate-01', 'render_payload.json');
  const fooocusAccepted = fs.existsSync(renderPayloadPath);
  console.log(`\nB. FOOOCUS ACCEPTED PAYLOAD: ${fooocusAccepted ? 'YES' : 'NO / UNKNOWN'}`);

  if (fooocusAccepted) {
    try {
      const sentPayload = JSON.parse(fs.readFileSync(renderPayloadPath, 'utf8'));
      console.log('   Render payload found at:', renderPayloadPath);
      console.log('   Sent denoise:', sentPayload.denoise_strength);
      console.log('   Sent input_image:', sentPayload.input_image ? 'YES' : 'NO');
    } catch (e) {
      console.log('   Error reading payload:', e.message);
    }
  }

  // C. Output image description
  const outputPng = path.join(runDir, 'output.png');
  const hasOutput = fs.existsSync(outputPng);
  console.log(`\nC. OUTPUT IMAGE:`);
  console.log(`   Exists: ${hasOutput ? 'YES' : 'NO'}`);
  
  if (hasOutput) {
    const stats = fs.statSync(outputPng);
    console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);
    console.log(`   Path: ${outputPng}`);
  }

  // D. Whether noise pattern still occurs
  // This requires Gemini analysis
  const geminiFile = path.join(runDir, 'gemini_validation.json');
  let noiseStillOccurs = 'UNKNOWN';
  let geminiPassFail = 'UNKNOWN';
  
  if (fs.existsSync(geminiFile)) {
    try {
      const gemini = JSON.parse(fs.readFileSync(geminiFile, 'utf8'));
      geminiPassFail = gemini.pass_fail || 'UNKNOWN';
      
      // Check for noise-related fail rules
      const noiseRules = ['plastic_drift', 'neon_glow', 'abstract_noise', 'color_canon_violation'];
      const failedNoiseRules = (gemini.fail_rules || []).filter(r => noiseRules.some(nr => r.includes(nr)));
      noiseStillOccurs = failedNoiseRules.length > 0 ? 'YES - NOISE PATTERN STILL OCCURS' : 'NO - NOISE ELIMINATED';
      
      console.log(`\nD. NOISE PATTERN: ${noiseStillOccurs}`);
      console.log(`   Gemini fail_rules: ${(gemini.fail_rules || []).join(', ') || 'none'}`);
      console.log(`   Wrong reads: ${(gemini.wrong_reads || []).join(', ') || 'none'}`);
    } catch (e) {
      console.log(`\nD. NOISE PATTERN: UNKNOWN (Gemini parse error)`);
    }
  } else {
    console.log(`\nD. NOISE PATTERN: UNKNOWN (Gemini validation not found)`);
  }

  // E. Final decision
  const decisionFile = path.join(runDir, 'final_decision.json');
  let finalDecision = 'UNKNOWN';
  
  if (fs.existsSync(decisionFile)) {
    try {
      const decision = JSON.parse(fs.readFileSync(decisionFile, 'utf8'));
      finalDecision = decision.decision || 'UNKNOWN';
      console.log(`\nE. FINAL DECISION: ${finalDecision}`);
      console.log(`   Reason: ${decision.decision_reason || 'N/A'}`);
      console.log(`   Status: ${decision.status || 'N/A'}`);
    } catch (e) {
      console.log(`\nE. FINAL DECISION: UNKNOWN (parse error)`);
    }
  } else {
    console.log(`\nE. FINAL DECISION: UNKNOWN (file not found)`);
  }

  // F. Comparison vs p0_7
  console.log(`\nF. COMPARISON VS P0-7:`);
  console.log(`   p0_7: Used custom control fields (reproduction_anchor_mode, etc.)`);
  console.log(`   p0_8: Uses standard Fooocus IMG2IMG (input_image + denoise)`);
  console.log(`   p0_7: Failed with infrastructure hang`);
  console.log(`   p0_8: ${hasOutput ? 'Completed' : 'Did not complete'}`);

  // G. One-line conclusion
  console.log('\n' + '='.repeat(60));
  console.log('G. CONCLUSION:');
  
  if (finalDecision === 'ALLOW' && geminiPassFail === 'PASS') {
    console.log('   🟢 IMG2IMG WORKS');
  } else if (!hasOutput) {
    console.log('   🔴 BASE MODEL STILL BROKEN (no output generated)');
  } else if (geminiPassFail === 'FAIL') {
    console.log('   🔴 BASE MODEL STILL BROKEN (Gemini reject - quality issues persist)');
  } else {
    console.log('   🟡 UNCLEAR - check output manually');
  }
  console.log('='.repeat(60));

  // Final status
  const allChecks = {
    output_exists: hasOutput,
    fooocus_accepted: fooocusAccepted,
    decision_is_allow: finalDecision === 'ALLOW',
    gemini_passed: geminiPassFail === 'PASS'
  };

  const passed = Object.values(allChecks).filter(v => v).length;
  const total = Object.keys(allChecks).length;

  console.log(`\nFINAL: ${passed}/${total} checks passed`);
  console.log(`Test run: ${TEST_JOB_ID}`);
  console.log(`Run dir: ${runDir}`);

  process.exit(passed === total ? 0 : 1);
});
