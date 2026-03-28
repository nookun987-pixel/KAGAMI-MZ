const config = require('./config');
const { saveLocal } = require('./services/storage');

console.log('=== NOTION FALLBACK TEST ===');

// MODE 1: Test without Notion credentials
console.log('\nMODE 1: No Notion credentials');
console.log('NOTION_API_KEY:', config.NOTION_API_KEY ? 'SET' : 'EMPTY');
console.log('NOTION_DB_ID:', config.NOTION_DB_ID ? 'SET' : 'EMPTY');
console.log('USE_NOTION:', config.USE_NOTION);

if (!config.USE_NOTION) {
  console.log('✓ System correctly disabled Notion integration');
  
  // Test local save
  const testData = {
    status: 'ready',
    contents: [
      { type: 'short_post', hook: 'Test', body: 'Test body', cta: 'Test CTA', status: 'ready' }
    ]
  };
  
  try {
    saveLocal(testData);
    console.log('✓ Local save works without Notion');
  } catch (error) {
    console.log('✗ Local save failed:', error.message);
  }
} else {
  console.log('✗ Notion integration enabled but credentials missing');
}

// MODE 2: Test with fake Notion credentials
console.log('\nMODE 2: Fake Notion credentials test');
const originalApiKey = config.NOTION_API_KEY;
const originalDbId = config.NOTION_DB_ID;

// Temporarily set fake credentials
process.env.NOTION_API_KEY = 'fake_key_12345';
process.env.NOTION_DB_ID = 'fake_db_id_12345';

// Reload config
delete require.cache[require.resolve('./config')];
const testConfig = require('./config');

console.log('Fake NOTION_API_KEY:', testConfig.NOTION_API_KEY ? 'SET' : 'EMPTY');
console.log('Fake NOTION_DB_ID:', testConfig.NOTION_DB_ID ? 'SET' : 'EMPTY');
console.log('USE_NOTION with fake:', testConfig.USE_NOTION);

if (testConfig.USE_NOTION) {
  console.log('✓ System would attempt Notion push with fake credentials');
  
  // Simulate the fallback logic from index.js
  async function testFallback() {
    const testData = {
      status: 'ready',
      contents: [
        { type: 'short_post', hook: 'Test', body: 'Test body', cta: 'Test CTA', status: 'ready' }
      ]
    };
    
    try {
      const { saveToNotion } = require('./services/notion');
      await saveToNotion(testData);
      console.log('✗ Unexpected: Notion push succeeded with fake credentials');
    } catch (err) {
      console.log('✓ Notion push failed as expected:', err.message);
      console.log('✓ Falling back to local save...');
      saveLocal({ status: 'ready', ...testData });
      console.log('✓ Local fallback save successful');
    }
  }
  
  testFallback().catch(console.error);
}

// Restore original config
process.env.NOTION_API_KEY = originalApiKey;
process.env.NOTION_DB_ID = originalDbId;
