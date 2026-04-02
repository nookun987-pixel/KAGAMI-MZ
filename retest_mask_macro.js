// Re-test script for MASK_MACRO with render backend fixes
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const ORCHESTRATOR_PATH = path.join(ROOT, 'orchestrator.js');
const JOBS_DIR = path.join(ROOT, 'jobs');

// Generate new job ID with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const jobId = `MASK_MACRO_RETEST_${timestamp}`;

// Create job file with same MASK brief as MASK_MACRO_RUN_01
const jobData = {
  job_id: jobId,
  type: "render",
  shot_type: "MASK_MACRO",
  entity_id: "kitsune_mask_macro",
  entity_class: "mask_macro_study",
  zone: "white_monolith",
  status: "RETRY",
  render: {
    width: 1152,
    height: 1152,
    performance: "Quality"
    // Note: render_executor now forces:
    // - base_model: "realvisxlV50_v40BakedVAE.safetensors"
    // - guidance_scale: 4.0
    // - styles: []
    // - style_selections: []
  },
  input: {
    prompt: "Extreme macro product photography, premium studio close-up, single dominant subject, a symmetrical Japanese kitsune porcelain mask, matte porcelain-white B4C ceramic shell, dry dense engineered technical ceramic surface, ultra-controlled eggshell microtexture, visible sparse fine hairline fracture detail, controlled deep crimson kintsugi accent seam along cheekbone, void-black hollow eye slits, clearly manufactured artifact, precise industrial form, visible rim bevel and edge thickness, sharp contour silhouette, high material separation, premium low-key studio lighting, soft overhead key light, gentle side fill, shallow controlled depth of field, clean dark background, no environmental distraction, object readability first, non-reflective matte ceramic finish",
    negative_prompt: "abstract, texture field, atmosphere, fog, soft fantasy blur, decorative clutter, anime, neon glow, cyberpunk, distortion, organic face, visible human skin, human eyes, asymmetrical mask, overexposed ceramic, cheap render finish, toy, figurine, plastic gloss, orange accent, orange contamination, red spill, blurry crop, atmosphere-only frame, painterly, grain, noise, messy background, glossy, shiny, reflective, polished, wet, specular, lacquer, PVC, plaster, stone"
  }
};

// Ensure jobs directory exists
if (!fs.existsSync(JOBS_DIR)) {
  fs.mkdirSync(JOBS_DIR, { recursive: true });
}

// Write job file
const jobFile = path.join(JOBS_DIR, `${jobId}.json`);
fs.writeFileSync(jobFile, JSON.stringify(jobData, null, 2), 'utf8');
console.log(`[RETEST] Job file created: ${jobFile}`);

  // Run orchestrator with full path to job file
  const jobFilePath = path.join(JOBS_DIR, `${jobId}.json`);
  console.log(`[RETEST] Starting job: ${jobId}`);
  console.log(`[RETEST] Job file: ${jobFilePath}`);
  console.log(`[RETEST] Waiting for render... (this may take 2-5 minutes)`);

  const child = spawn('node', [ORCHESTRATOR_PATH, jobFilePath], {
    stdio: 'inherit',
    cwd: ROOT
  });

child.on('close', (code) => {
  console.log(`\n[RETEST] Job completed with code: ${code}`);
  
  // Find the run directory
  const runsDir = path.join(ROOT, 'runs');
  const entries = fs.readdirSync(runsDir)
    .filter(e => e.includes(jobId) || e.startsWith(jobId))
    .map(e => {
      const stat = fs.statSync(path.join(runsDir, e));
      return { name: e, mtime: stat.mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);
  
  if (entries.length > 0) {
    const runDir = path.join(runsDir, entries[0].name);
    console.log(`[RETEST] Run directory: ${runDir}`);
    
    // Check for output files
    const outputPng = path.join(runDir, 'output.png');
    const finalDecision = path.join(runDir, 'final_decision.json');
    
    if (fs.existsSync(outputPng)) {
      console.log(`[RETEST] Output image: ${outputPng}`);
    }
    if (fs.existsSync(finalDecision)) {
      const decision = JSON.parse(fs.readFileSync(finalDecision, 'utf8'));
      console.log(`[RETEST] Final decision:`, JSON.stringify(decision, null, 2));
    }
  }
  
  process.exit(code);
});
