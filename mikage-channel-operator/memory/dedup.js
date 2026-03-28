function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ')    // Collapse whitespace
    .trim();
}

function similarityScore(a, b) {
  if (!a || !b) return 0;
  
  const normA = normalizeText(a);
  const normB = normalizeText(b);
  
  if (!normA || !normB) return 0;
  
  const tokensA = normA.split(' ');
  const tokensB = normB.split(' ');
  
  // Token overlap approach
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }
  
  const union = new Set([...tokensA, ...tokensB]).size;
  
  if (union === 0) return 0;
  
  return intersection / union;
}

function isDuplicate(newItem, previousItems) {
  if (!newItem || !Array.isArray(previousItems)) return false;
  
  const newText = newItem.content_text || newItem.body || newItem.hook || '';
  
  // Check against recent content_text
  for (const item of previousItems) {
    const existingText = item.content_text || item.body || item.hook || '';
    
    // Compare full content
    const fullSimilarity = similarityScore(newText, existingText);
    if (fullSimilarity > 0.70) {
      console.log(`[DEDUP] Duplicate detected: similarity=${fullSimilarity.toFixed(3)}`);
      return true;
    }
    
    // Compare hooks specifically
    if (newItem.hook_used && item.hook_used) {
      const hookSimilarity = similarityScore(newItem.hook_used, item.hook_used);
      if (hookSimilarity > 0.80) {
        console.log(`[DEDUP] Duplicate hook detected: similarity=${hookSimilarity.toFixed(3)}`);
        return true;
      }
    }
  }
  
  return false;
}

module.exports = {
  normalizeText,
  similarityScore,
  isDuplicate
};
