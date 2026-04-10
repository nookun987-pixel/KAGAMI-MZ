const fs = require('fs');
const path = require('path');

async function testVertexCredentials() {
  console.log('=== TESTING VERTEX CREDENTIALS ===');
  
  try {
    // Test if we can load the real Vertex retriever
    console.log('Testing real Vertex retriever import...');
    
    // Clear any cached module
    delete require.cache[path.resolve(__dirname, 'rag/vertex_retriever.js')];
    
    const vertexRetriever = require('./rag/vertex_retriever.js');
    console.log('✅ Real Vertex retriever module loaded');
    
    // Test basic query
    const testQuery = 'WEAPON_MACRO test';
    console.log(`Testing query: ${testQuery}`);
    
    const result = await vertexRetriever.queryMikageBrain(testQuery);
    console.log('Query result:', {
      chunksReturned: result.chunks.length,
      hasError: !!result.error,
      sources: result.sources.length
    });
    
    if (result.error) {
      console.log('❌ Vertex query failed:', result.error);
      return false;
    }
    
    if (result.chunks.length === 0) {
      console.log('❌ Vertex query returned no chunks');
      return false;
    }
    
    console.log('✅ Vertex credentials verified and working');
    return true;
    
  } catch (error) {
    console.log('❌ Vertex credentials test failed:', error.message);
    console.log('❌ Real Vertex retrieval not available');
    return false;
  }
}

async function createRealVertexTest() {
  console.log('=== CHECKING VERTEX READINESS ===');
  
  const credentialsReady = await testVertexCredentials();
  
  if (!credentialsReady) {
    console.log('\n❌ VERTEX NOT READY - CANNOT PROCEED WITH LIVE VALIDATION');
    
    // Create failure report
    const report = `# REAL VERTEX LIVE VALIDATION REPORT

## Environment
- USE_REAL_VERTEX_RAG: true
- credentials present: false
- retriever mode observed: mock (fallback)

## Job A
- rag_executed: SKIPPED
- retriever_mode: mock
- real_vertex_verified: false
- chunk_count: 0
- fallback_used: true
- context_injected: false
- evidence: Vertex credentials not available

## Job B
- rag_executed: SKIPPED
- retriever_mode: mock
- real_vertex_verified: false
- chunk_count: 0
- fallback_used: true
- context_injected: false
- evidence: Vertex credentials not available

## Job C
- rag_executed: SKIPPED
- retriever_mode: mock
- real_vertex_verified: false
- chunk_count: 0
- fallback_used: true
- context_injected: false
- evidence: Vertex credentials not available

## Final Verdict
REAL VERTEX NOT VERIFIED
`;
    
    fs.writeFileSync('REAL_VERTEX_LIVE_VALIDATION_REPORT.md', report);
    console.log('Report created: REAL_VERTEX_LIVE_VALIDATION_REPORT.md');
    
    return false;
  }
  
  console.log('\n✅ VERTEX READY - PROCEEDING WITH LIVE VALIDATION');
  return true;
}

createRealVertexTest().then(ready => {
  if (ready) {
    console.log('\n=== READY FOR LIVE VERTEX VALIDATION ===');
    console.log('Please run 3 live jobs with USE_REAL_VERTEX_RAG=true');
  } else {
    console.log('\n=== VERTEX NOT READY ===');
    console.log('Cannot proceed with live validation');
  }
});
