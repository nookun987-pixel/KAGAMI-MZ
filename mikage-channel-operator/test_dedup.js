const { normalizeText, similarityScore, isDuplicate } = require('./memory/dedup');

function testDedup() {
  console.log('=== TESTING DEDUPLICATION ===');
  
  // Test 1: Text normalization
  console.log('\nTest 1: Text normalization');
  const testText = "Hello, World! This is a TEST...";
  const normalized = normalizeText(testText);
  console.log(`Original: "${testText}"`);
  console.log(`Normalized: "${normalized}"`);
  
  if (normalized === 'hello world this is a test') {
    console.log('✓ Normalization works');
  } else {
    console.log('✗ Normalization failed');
    return false;
  }
  
  // Test 2: Similarity scoring
  console.log('\nTest 2: Similarity scoring');
  const text1 = "AI is replacing human jobs in many industries";
  const text2 = "Artificial intelligence is replacing human jobs across many industries";
  const text3 = "The weather is nice today";
  
  const score1 = similarityScore(text1, text2);
  const score2 = similarityScore(text1, text3);
  
  console.log(`Similar text1 vs text2: ${score1.toFixed(3)}`);
  console.log(`Different text1 vs text3: ${score2.toFixed(3)}`);
  
  if (score1 > 0.50 && score2 < 0.30) {
    console.log('✓ Similarity scoring works');
  } else {
    console.log('✗ Similarity scoring failed');
    return false;
  }
  
  // Test 3: Duplicate detection
  console.log('\nTest 3: Duplicate detection');
  
  const newItem = {
    content_text: "AI is replacing human jobs in many industries",
    hook_used: "Are robots taking over our jobs?"
  };
  
  const previousItems = [
    {
      content_text: "Artificial intelligence is replacing human jobs across many industries",
      hook_used: "Are robots taking over our jobs?"
    },
    {
      content_text: "The weather is nice today",
      hook_used: "What a beautiful day!"
    }
  ];
  
  const isDup1 = isDuplicate(newItem, previousItems);
  console.log(`Similar content duplicate: ${isDup1}`);
  
  if (isDup1) {
    console.log('✓ Similar content detected as duplicate');
  } else {
    console.log('✗ Similar content not detected as duplicate');
    return false;
  }
  
  const differentItem = {
    content_text: "Machine learning is transforming healthcare",
    hook_used: "How AI is saving lives in medicine"
  };
  
  const isDup2 = isDuplicate(differentItem, previousItems);
  console.log(`Different content duplicate: ${isDup2}`);
  
  if (!isDup2) {
    console.log('✓ Different content not detected as duplicate');
  } else {
    console.log('✗ Different content incorrectly detected as duplicate');
    return false;
  }
  
  console.log('\n=== DEDUPLICATION TESTS PASSED ===');
  return true;
}

const success = testDedup();
process.exit(success ? 0 : 1);
