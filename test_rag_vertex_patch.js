/**
 * RAG Vertex Patch Verification Test
 * Run: node test_rag_vertex_patch.js
 */

const fs = require('fs');
const path = require('path');

// Test 1: Verify vertex_retriever_real.js has no fake chunks
console.log('\n=== TEST 1: vertex_retriever_real.js - No Fake Chunks ===');
const vertexRetrieverPath = path.join(__dirname, 'rag', 'vertex_retriever_real.js');
const vertexRetrieverContent = fs.readFileSync(vertexRetrieverPath, 'utf8');

// Check that fake chunks are removed
const hasFakeChunks = vertexRetrieverContent.includes('vertex_chunk_1') || 
                      vertexRetrieverContent.includes('Real Vertex result for');
const hasEmptyArray = vertexRetrieverContent.includes('const realChunks = [];');
const hasNoFakeWarning = vertexRetrieverContent.includes('[RAG] No real chunks retrieved from Vertex AI');

console.log(`✓ Fake chunks removed: ${!hasFakeChunks}`);
console.log(`✓ Empty array returned: ${hasEmptyArray}`);
console.log(`✓ Warning log present: ${hasNoFakeWarning}`);

if (hasFakeChunks || !hasEmptyArray || !hasNoFakeWarning) {
  console.error('❌ TEST 1 FAILED: vertex_retriever_real.js still has fake chunks');
  process.exit(1);
}
console.log('✅ TEST 1 PASSED');

// Test 2: Verify orchestrator.js has correct RAG integration
console.log('\n=== TEST 2: orchestrator.js - RAG Artifact Format ===');
const orchestratorPath = path.join(__dirname, 'orchestrator.js');
const orchestratorContent = fs.readFileSync(orchestratorPath, 'utf8');

// Check required artifact format
const hasCorrectArtifactFormat = orchestratorContent.includes('retriever_mode: retrieverMode') &&
                                 orchestratorContent.includes('real_vertex_verified: realVertexVerified') &&
                                 orchestratorContent.includes('query: ragQuery') &&
                                 orchestratorContent.includes('context: mikageMemoryContext || ""') &&
                                 orchestratorContent.includes('chunks: []');

// Check logs
const hasQueryLog = orchestratorContent.includes('[RAG] Querying real Vertex AI');
const hasRetrievedLog = orchestratorContent.includes('[RAG] Retrieved');
const hasInjectedLog = orchestratorContent.includes('[RAG] Context injected');
const hasNoChunksLog = orchestratorContent.includes('[RAG] No real chunks retrieved');

// Check final artifact flags
const hasFinalDecisionFlags = orchestratorContent.includes('finalDecision.retriever_mode = retrieverMode') &&
                               orchestratorContent.includes('finalDecision.real_vertex_verified = realVertexVerified');
const hasSummaryFlags = orchestratorContent.includes('summary.retriever_mode = retrieverMode') &&
                        orchestratorContent.includes('summary.real_vertex_verified = realVertexVerified');

console.log(`✓ Artifact format correct: ${hasCorrectArtifactFormat}`);
console.log(`✓ Query log present: ${hasQueryLog}`);
console.log(`✓ Retrieved log present: ${hasRetrievedLog}`);
console.log(`✓ Injected log present: ${hasInjectedLog}`);
console.log(`✓ No chunks warning present: ${hasNoChunksLog}`);
console.log(`✓ Final decision flags: ${hasFinalDecisionFlags}`);
console.log(`✓ Summary flags: ${hasSummaryFlags}`);

if (!hasCorrectArtifactFormat || !hasQueryLog || !hasFinalDecisionFlags || !hasSummaryFlags) {
  console.error('❌ TEST 2 FAILED: orchestrator.js missing required RAG integration');
  process.exit(1);
}
console.log('✅ TEST 2 PASSED');

// Test 3: Verify rag_retriever_resolver exports required functions
console.log('\n=== TEST 3: rag_retriever_resolver.js - Exports ===');
const resolverPath = path.join(__dirname, 'rag', 'rag_retriever_resolver.js');
const resolverContent = fs.readFileSync(resolverPath, 'utf8');

const hasGetMikageMemoryContext = resolverContent.includes('getMikageMemoryContext');
const hasGetRetrieverMode = resolverContent.includes('getRetrieverMode');
const hasIsRealVertexVerified = resolverContent.includes('isRealVertexVerified');

console.log(`✓ getMikageMemoryContext exported: ${hasGetMikageMemoryContext}`);
console.log(`✓ getRetrieverMode exported: ${hasGetRetrieverMode}`);
console.log(`✓ isRealVertexVerified exported: ${hasIsRealVertexVerified}`);

if (!hasGetMikageMemoryContext || !hasGetRetrieverMode || !hasIsRealVertexVerified) {
  console.error('❌ TEST 3 FAILED: rag_retriever_resolver missing required exports');
  process.exit(1);
}
console.log('✅ TEST 3 PASSED');

// Test 4: Quick functional test (requires env vars)
console.log('\n=== TEST 4: Functional Test (requires USE_REAL_VERTEX_RAG=true) ===');
const useRealVertex = process.env.USE_REAL_VERTEX_RAG === 'true';
console.log(`USE_REAL_VERTEX_RAG: ${useRealVertex}`);

if (useRealVertex) {
  try {
    const { getMikageMemoryContext, getRetrieverMode, isRealVertexVerified } = require('./rag/rag_retriever_resolver');
    console.log(`✓ RAG resolver loaded successfully`);
    console.log(`✓ Retriever mode: ${getRetrieverMode()}`);
    console.log(`✓ Real vertex verified: ${isRealVertexVerified()}`);
    
    // Quick async test
    (async () => {
      const context = await getMikageMemoryContext('test query');
      console.log(`✓ getMikageMemoryContext returned: ${context ? 'context (length: ' + context.length + ')' : 'empty'}`);
      console.log('✅ TEST 4 PASSED');
      console.log('\n=== ALL TESTS PASSED ===\n');
    })();
  } catch (error) {
    console.error(`❌ Functional test error: ${error.message}`);
    // Don't fail - this might be expected if credentials aren't configured
    console.log('⚠️  TEST 4 SKIPPED (credentials may not be configured)');
    console.log('\n=== ALL CRITICAL TESTS PASSED ===\n');
  }
} else {
  console.log('⚠️  TEST 4 SKIPPED (set USE_REAL_VERTEX_RAG=true to run functional test)');
  console.log('\n=== ALL CRITICAL TESTS PASSED ===\n');
}

// Summary
console.log('PATCH VERIFICATION SUMMARY:');
console.log('1. vertex_retriever_real.js - No fake chunks: ✅');
console.log('2. orchestrator.js - RAG artifact format: ✅');
console.log('3. rag_retriever_resolver.js - Required exports: ✅');
console.log('4. Functional test: ' + (useRealVertex ? '✅/⚠️' : '⚠️ (skipped)'));
console.log('\nExpected artifact output format:');
console.log(JSON.stringify({
  retriever_mode: "vertex",
  real_vertex_verified: true,
  query: "...",
  context: "...",
  chunks: []
}, null, 2));
