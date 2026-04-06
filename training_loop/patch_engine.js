/**
 * training_loop/patch_engine.js
 * Map failure classes to patch plans
 */

const actionMapping = {
  'SILHOUETTE_FAIL': [
    'inject_single_object_lock',
    'inject_no_fragment_rule'
  ],
  'PLASTIC_MATERIAL_FAIL': [
    'inject_anti_plastic_negative',
    'inject_ceramic_microstructure'
  ],
  'TEXTURE_ONLY_FAIL': [
    'inject_object_readability_rule',
    'inject_no_texture_only_rule'
  ],
  'MULTI_OBJECT_FAIL': [
    'inject_single_object_lock',
    'reject_disconnected_shapes'
  ],
  'VISIBLE_EYES_FAIL': [
    'inject_no_eye_visibility_rule'
  ]
};

const targetMapping = {
  'SILHOUETTE_FAIL': ['composition', 'topology'],
  'PLASTIC_MATERIAL_FAIL': ['material'],
  'TEXTURE_ONLY_FAIL': ['readability'],
  'MULTI_OBJECT_FAIL': ['composition', 'topology'],
  'VISIBLE_EYES_FAIL': ['identity']
};

function generatePatchPlan(failureClass) {
  console.log('[PATCH_ENGINE] Generating patch plan...');
  console.log(`[PATCH_ENGINE] Input failure classes: ${JSON.stringify(failureClass)}`);
  
  // Handle empty/null input
  if (!failureClass || !Array.isArray(failureClass) || failureClass.length === 0) {
    console.log('[PATCH_ENGINE] No failures - returning empty patch plan');
    return {
      patch_targets: [],
      actions: []
    };
  }
  
  const actions = new Set();
  const targets = new Set();
  
  for (const failClass of failureClass) {
    // Add actions
    const mappedActions = actionMapping[failClass];
    if (mappedActions) {
      for (const action of mappedActions) {
        actions.add(action);
        console.log(`[PATCH_ENGINE] Mapped ${failClass} -> action: ${action}`);
      }
    }
    
    // Add targets
    const mappedTargets = targetMapping[failClass];
    if (mappedTargets) {
      for (const target of mappedTargets) {
        targets.add(target);
        console.log(`[PATCH_ENGINE] Mapped ${failClass} -> target: ${target}`);
      }
    }
  }
  
  const result = {
    patch_targets: Array.from(targets),
    actions: Array.from(actions)
  };
  
  console.log(`[PATCH_ENGINE] Generated ${result.actions.length} unique actions`);
  console.log(`[PATCH_ENGINE] Generated ${result.patch_targets.length} unique targets`);
  
  return result;
}

module.exports = {
  generatePatchPlan
};
