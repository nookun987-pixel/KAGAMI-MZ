const { normalizeIdeaRequest } = require('./idea_intake');
const job = require('./weapon_baseline_test_job.json');

console.log('=== WEAPON BASELINE TEST INPUT ===');
console.log('Job ID:', job.job_id);
console.log('Shot Type:', job.shot_type);
console.log('Generation Mode:', job.generation_mode);
console.log('Anchor Image:', job.anchor_image_path);
console.log('Seed:', job.render.seed);

const intake = normalizeIdeaRequest(job);

console.log('\n=== ENFORCEMENT RESULTS ===');
console.log('Effective preservation_mode:', intake.preservation_mode);
console.log('Baseline applied:', intake.weapon_baseline_applied);
console.log('Override applied:', intake.weapon_baseline_override_applied);
console.log('Override reason:', intake.weapon_baseline_override_reason);
console.log('Effective denoise_strength:', intake.denoise_strength);
console.log('Effective anchor_strength:', intake.anchor_strength);
console.log('Effective composition_lock_strength:', intake.composition_lock_strength);
console.log('Effective silhouette_lock_strength:', intake.silhouette_lock_strength);
console.log('Reconstruction priority:', intake.reconstruction_priority);
console.log('Prompt reduction:', intake.prompt_weight_reduction_when_anchor_present);
