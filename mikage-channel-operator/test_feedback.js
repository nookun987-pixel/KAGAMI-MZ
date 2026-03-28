const { calcScore, classify, updatePerformance } = require('./memory/feedback');

function testFeedback() {
  console.log('=== TESTING FEEDBACK SCORING ===');
  
  // Test 1: Score calculation
  console.log('\nTest 1: Score calculation');
  
  const test1 = { views: 1000, likes: 50, saves: 20, clicks: 30 };
  const score1 = calcScore(test1);
  const expected1 = (50 * 1 + 20 * 2 + 30 * 3) / 1000; // (50 + 40 + 90) / 1000 = 0.18
  console.log(`Test 1 - Expected: ${expected1.toFixed(3)}, Got: ${score1.toFixed(3)}`);
  
  if (Math.abs(score1 - expected1) < 0.001) {
    console.log('✓ Score calculation works');
  } else {
    console.log('✗ Score calculation failed');
    return false;
  }
  
  // Test 2: Zero views edge case
  console.log('\nTest 2: Zero views edge case');
  const test2 = { views: 0, likes: 10, saves: 5, clicks: 2 };
  const score2 = calcScore(test2);
  console.log(`Zero views score: ${score2}`);
  
  if (score2 === 0) {
    console.log('✓ Zero views handled correctly');
  } else {
    console.log('✗ Zero views not handled correctly');
    return false;
  }
  
  // Test 3: Missing metrics edge case
  console.log('\nTest 3: Missing metrics edge case');
  const test3 = { views: 1000, likes: null, saves: undefined, clicks: 0 };
  const score3 = calcScore(test3);
  console.log(`Missing metrics score: ${score3}`);
  
  if (score3 === 0) {
    console.log('✓ Missing metrics handled correctly');
  } else {
    console.log('✗ Missing metrics not handled correctly');
    return false;
  }
  
  // Test 4: Classification
  console.log('\nTest 4: Classification');
  
  const classifications = [
    { score: 0.18, expected: 'win', desc: 'High score' },
    { score: 0.05, expected: 'lose', desc: 'Low positive score' },
    { score: 0, expected: '', desc: 'Zero score' },
    { score: null, expected: '', desc: 'Null score' },
    { score: undefined, expected: '', desc: 'Undefined score' }
  ];
  
  for (const test of classifications) {
    const result = classify(test.score);
    console.log(`${test.desc} (${test.score}): ${result} (expected: ${test.expected})`);
    
    if (result !== test.expected) {
      console.log(`✗ Classification failed for ${test.desc}`);
      return false;
    }
  }
  
  console.log('✓ Classification works');
  
  // Test 5: Performance update
  console.log('\nTest 5: Performance update');
  const record = {
    content_id: 'test_123',
    views: 1000,
    likes: 50,
    saves: 20,
    clicks: 30,
    performance_score: null,
    result_score: ''
  };
  
  const updated = updatePerformance(record);
  
  if (updated.performance_score === 0.18 && updated.result_score === 'win') {
    console.log('✓ Performance update works');
  } else {
    console.log('✗ Performance update failed');
    console.log(`Expected score: 0.18, got: ${updated.performance_score}`);
    console.log(`Expected result: win, got: ${updated.result_score}`);
    return false;
  }
  
  console.log('\n=== FEEDBACK TESTS PASSED ===');
  return true;
}

const success = testFeedback();
process.exit(success ? 0 : 1);
