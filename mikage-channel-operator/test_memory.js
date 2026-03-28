const memoryStore = require('./memory/memory_store');
const { retrieveContext } = require('./memory/retriever');

async function testMemory() {
  console.log('=== TESTING MEMORY STORE ===');
  
  // Test 1: Empty DB returns valid empty arrays
  console.log('\nTest 1: Empty DB behavior');
  const recent = await memoryStore.safeQueryRecent(20);
  const sameTopic = await memoryStore.safeQueryByTopic('test_topic', 10);
  const winners = await memoryStore.safeQueryTopPerformers(10);
  const losers = await memoryStore.safeQueryLowPerformers(10);
  
  console.log(`recent: ${recent.length} items`);
  console.log(`sameTopic: ${sameTopic.length} items`);
  console.log(`winners: ${winners.length} items`);
  console.log(`losers: ${losers.length} items`);
  
  if (Array.isArray(recent) && Array.isArray(sameTopic) && 
      Array.isArray(winners) && Array.isArray(losers)) {
    console.log('✓ Empty DB returns valid arrays');
  } else {
    console.log('✗ Empty DB test failed');
    return false;
  }
  
  // Test 2: Save and retrieve records
  console.log('\nTest 2: Save and retrieve records');
  const testRecord = {
    content_type: 'short_post',
    content_text: 'Test content about AI and automation',
    topic: 'ai_automation',
    angle: 'neutral',
    hook_type: 'question',
    hook_used: 'Is AI replacing humans?',
    views: 1000,
    likes: 50,
    saves: 20,
    clicks: 30,
    performance_score: 0.16,
    result_score: 'win'
  };
  
  const saved = await memoryStore.saveContent(testRecord);
  if (saved) {
    console.log('✓ Record saved successfully');
  } else {
    console.log('✗ Record save failed');
    return false;
  }
  
  // Test 3: Retrieve by topic
  console.log('\nTest 3: Retrieve by topic');
  const topicResults = await memoryStore.safeQueryByTopic('ai_automation', 5);
  console.log(`Found ${topicResults.length} items for topic 'ai_automation'`);
  
  if (topicResults.length > 0 && topicResults[0].topic === 'ai_automation') {
    console.log('✓ Topic query works');
  } else {
    console.log('✗ Topic query failed');
    return false;
  }
  
  // Test 4: Retrieval context
  console.log('\nTest 4: Retrieval context');
  const context = await retrieveContext({ topic: 'ai_automation', channel: 'default' });
  
  const expectedKeys = ['recent', 'sameTopic', 'winners', 'losers', 'hooksToReuse', 'hooksToAvoid', 'anglesToAvoid', 'structuresSeen'];
  const hasAllKeys = expectedKeys.every(key => Array.isArray(context[key]));
  
  if (hasAllKeys) {
    console.log('✓ Retrieval context structure valid');
    console.log(`Context summary: recent=${context.recent.length}, winners=${context.winners.length}, losers=${context.losers.length}`);
  } else {
    console.log('✗ Retrieval context structure invalid');
    return false;
  }
  
  console.log('\n=== MEMORY TESTS PASSED ===');
  return true;
}

testMemory().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Memory test error:', error);
  process.exit(1);
});
