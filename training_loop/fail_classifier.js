/**
 * training_loop/fail_classifier.js
 * Classify validation failures into failure classes
 */

function normalizeInput(input) {
  if (!input || typeof input !== 'object') return {};
  return input;
}

function extractFailureContext(finalDecision) {
  if (!finalDecision) return null;
  
  // Handle string
  if (typeof finalDecision === 'string') {
    const lower = finalDecision.toLowerCase();
    if (lower.includes('reject') || lower.includes('fail')) {
      return { hasFailure: true, source: 'string' };
    }
    return null;
  }
  
  // Handle object
  if (typeof finalDecision === 'object') {
    const status = (finalDecision.status || '').toLowerCase();
    const result = (finalDecision.result || '').toLowerCase();
    const decision = (finalDecision.decision || '').toLowerCase();
    
    if (status.includes('reject') || status.includes('fail') ||
        result.includes('reject') || result.includes('fail') ||
        decision.includes('reject') || decision.includes('fail') ||
        finalDecision.rejected === true) {
      return { hasFailure: true, source: 'object' };
    }
  }
  
  return null;
}

function classifyFailure(validationSignals, finalDecision) {
  console.log('[FAIL_CLASSIFIER] Starting classification...');
  
  // Normalize inputs
  const signals = normalizeInput(validationSignals);
  const failureContext = extractFailureContext(finalDecision);
  
  const failureClasses = [];
  
  // Rule 1: Silhouette check
  if (signals.silhouette_clear === false) {
    failureClasses.push('SILHOUETTE_FAIL');
    console.log('[FAIL_CLASSIFIER] Detected: SILHOUETTE_FAIL');
  }
  
  // Rule 2: Plastic material check
  if (signals.plastic_read === true) {
    failureClasses.push('PLASTIC_MATERIAL_FAIL');
    console.log('[FAIL_CLASSIFIER] Detected: PLASTIC_MATERIAL_FAIL');
  }
  
  // Rule 3: Texture only check
  if (signals.texture_only === true) {
    failureClasses.push('TEXTURE_ONLY_FAIL');
    console.log('[FAIL_CLASSIFIER] Detected: TEXTURE_ONLY_FAIL');
  }
  
  // Rule 4: Multi-object check
  if (signals.object_count > 1) {
    failureClasses.push('MULTI_OBJECT_FAIL');
    console.log('[FAIL_CLASSIFIER] Detected: MULTI_OBJECT_FAIL');
  }
  
  // Rule 5: Visible eyes check
  if (signals.eyes_visible === true) {
    failureClasses.push('VISIBLE_EYES_FAIL');
    console.log('[FAIL_CLASSIFIER] Detected: VISIBLE_EYES_FAIL');
  }
  
  // Determine severity
  let severity = 'LOW';
  if (failureClasses.includes('VISIBLE_EYES_FAIL') || 
      failureClasses.includes('MULTI_OBJECT_FAIL') ||
      failureClasses.length >= 3) {
    severity = 'HIGH';
    console.log('[FAIL_CLASSIFIER] Severity: HIGH');
  } else if (failureClasses.length >= 1 && failureClasses.length <= 2) {
    severity = 'MEDIUM';
    console.log('[FAIL_CLASSIFIER] Severity: MEDIUM');
  } else if (failureContext && failureClasses.length === 0) {
    severity = 'LOW';
    console.log('[FAIL_CLASSIFIER] Severity: LOW (no specific fail class)');
  }
  
  // Determine primary failure (priority order)
  const priorityOrder = [
    'VISIBLE_EYES_FAIL',
    'MULTI_OBJECT_FAIL',
    'SILHOUETTE_FAIL',
    'PLASTIC_MATERIAL_FAIL',
    'TEXTURE_ONLY_FAIL'
  ];
  
  let primaryFailure = 'UNKNOWN_FAILURE';
  for (const failClass of priorityOrder) {
    if (failureClasses.includes(failClass)) {
      primaryFailure = failClass;
      break;
    }
  }
  
  console.log(`[FAIL_CLASSIFIER] Primary failure: ${primaryFailure}`);
  console.log(`[FAIL_CLASSIFIER] Total failure classes: ${failureClasses.length}`);
  
  return {
    failure_class: failureClasses,
    primary_failure: primaryFailure,
    severity: severity
  };
}

module.exports = {
  classifyFailure
};
