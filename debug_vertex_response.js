/**
 * Debug Vertex AI Response Structure
 */

process.env.GOOGLE_APPLICATION_CREDENTIALS = 'service-account-key.json';
process.env.USE_REAL_VERTEX_RAG = 'true';

const { SearchServiceClient } = require('@google-cloud/discoveryengine');

const PROJECT_ID = 'gen-lang-client-0440215253';
const LOCATION = 'global';
const DATA_STORE_ID = 'mikage-brain_1774647243976';
const servingConfig = `projects/${PROJECT_ID}/locations/${LOCATION}/collections/default_collection/dataStores/${DATA_STORE_ID}/servingConfigs/default_config`;

const client = new SearchServiceClient();

(async () => {
  console.log('=== VERTEX AI API DEBUG ===\n');
  console.log('Serving Config:', servingConfig);
  
  try {
    console.log('\nExecuting search...');
    const [response] = await client.search({
      servingConfig: servingConfig,
      query: 'mask',
      pageSize: 5
    }, { timeout: 30000 });
    
    console.log('\n=== RESPONSE KEYS ===');
    console.log(Object.keys(response));
    
    console.log('\n=== TOTAL SIZE ===');
    console.log(response.totalSize);
    
    console.log('\n=== RESULTS ===');
    console.log('Type:', typeof response.results);
    console.log('Is Array:', Array.isArray(response.results));
    console.log('Length:', response.results ? response.results.length : 0);
    
    if (response.results && response.results.length > 0) {
      console.log('\n=== FIRST RESULT ===');
      const first = response.results[0];
      console.log('Keys:', Object.keys(first));
      
      if (first.document) {
        console.log('\nDocument keys:', Object.keys(first.document));
        console.log('Document id:', first.document.id);
        console.log('Document name:', first.document.name);
        
        if (first.document.derivedStructData) {
          console.log('\nDerivedStructData keys:', Object.keys(first.document.derivedStructData));
          console.log('Snippets:', first.document.derivedStructData.snippets);
          console.log('Link:', first.document.derivedStructData.link);
        }
      }
      
      console.log('\nRelevance Score:', first.relevanceScore);
    } else {
      console.log('\nNo results found in datastore');
    }
    
    // Check raw response
    console.log('\n=== RAW RESPONSE (first 2000 chars) ===');
    console.log(JSON.stringify(response, null, 2).substring(0, 2000));
    
  } catch (error) {
    console.error('\n=== ERROR ===');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
})();
