const fs = require('fs');
const decision = JSON.parse(fs.readFileSync('runs/WEAPON_BASELINE_TEST_001/final_decision.json', 'utf8'));

console.log('=== AUDIT FIELDS CHECK ===');
console.log('preservation_mode_used:', decision.preservation_mode_used);
console.log('baseline_applied:', decision.baseline_applied);
console.log('override_applied:', decision.override_applied);
console.log('override_reason:', decision.override_reason);
console.log('anchor_image_used:', decision.anchor_image_used);
console.log('effective_denoise_strength:', decision.effective_denoise_strength);
console.log('effective_preservation_strength:', decision.effective_preservation_strength);
console.log('composition_lock_strength:', decision.composition_lock_strength);
console.log('silhouette_lock_strength:', decision.silhouette_lock_strength);
console.log('reconstruction_priority:', decision.reconstruction_priority);
console.log('prompt_reduction_applied:', decision.prompt_reduction_applied);

console.log('\n=== RENDER RESULT ===');
console.log('Status:', decision.status);
console.log('Decision:', decision.decision);
console.log('Reason:', decision.decision_reason);
console.log('Render error:', decision.render ? decision.render.error : 'No render object');

console.log('\n=== VALIDATION ===');
if (decision.subject_diagnostics) {
  console.log('Manufactured object read:', decision.subject_diagnostics.manufactured_object_read);
  console.log('Material read:', decision.subject_diagnostics.material_read);
  console.log('Abstract risk:', decision.subject_diagnostics.abstract_risk);
}
