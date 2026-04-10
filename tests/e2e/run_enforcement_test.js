const fs = require('fs');
const { normalizeIdeaRequest } = require('./idea_intake');
const job = require('./weapon_baseline_test_job.json');

const results = {
  job_id: job.job_id,
  shot_type: job.shot_type,
  generation_mode: job.generation_mode,
  anchor_image_path: job.anchor_image_path,
  seed: job.render.seed
};

const intake = normalizeIdeaRequest(job);

results.preservation_mode = intake.preservation_mode;
results.weapon_baseline_applied = intake.weapon_baseline_applied;
results.weapon_baseline_override_applied = intake.weapon_baseline_override_applied;
results.weapon_baseline_override_reason = intake.weapon_baseline_override_reason;
results.denoise_strength = intake.denoise_strength;
results.anchor_strength = intake.anchor_strength;
results.composition_lock_strength = intake.composition_lock_strength;
results.silhouette_lock_strength = intake.silhouette_lock_strength;
results.reconstruction_priority = intake.reconstruction_priority;
results.prompt_weight_reduction_when_anchor_present = intake.prompt_weight_reduction_when_anchor_present;

fs.writeFileSync('enforcement_results.json', JSON.stringify(results, null, 2));
console.log('Enforcement test results written to enforcement_results.json');
