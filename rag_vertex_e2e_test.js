/**
 * Real Vertex AI E2E Retrieval Test
 * Tests actual Vertex AI call with credentials
 */

const fs = require('fs');
const path = require('path');

console.log('=== REAL VERTEX E2E RETRIEVAL TEST ===\n');

function normalizeCredentialInput(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function resolveVertexCredentialSource() {
  const googleApplicationCredentials = normalizeCredentialInput(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  if (googleApplicationCredentials) {
    return { source: 'GOOGLE_APPLICATION_CREDENTIALS', path: googleApplicationCredentials };
  }

  const mikageGoogleApplicationCredentials = normalizeCredentialInput(process.env.MIKAGE_GOOGLE_APPLICATION_CREDENTIALS);
  if (mikageGoogleApplicationCredentials) {
    return { source: 'MIKAGE_GOOGLE_APPLICATION_CREDENTIALS', path: mikageGoogleApplicationCredentials };
  }

  const googleApplicationCredentialsJson = normalizeCredentialInput(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  if (googleApplicationCredentialsJson) {
    return { source: 'GOOGLE_APPLICATION_CREDENTIALS_JSON', json: googleApplicationCredentialsJson };
  }

  const repoCredentialsPath = path.join(__dirname, 'repo_credentials', 'gsheet_key.json');
  if (fs.existsSync(repoCredentialsPath)) {
    return { source: 'repo_credentials/gsheet_key.json', path: repoCredentialsPath };
  }

  return { source: 'service-account-key.json', path: path.join(__dirname, 'service-account-key.json') };
}

// Set env vars if not already set
const credentialSource = resolveVertexCredentialSource();
if (credentialSource.path) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialSource.path;
}
if (credentialSource.json) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON = credentialSource.json;
}
process.env.USE_REAL_VERTEX_RAG = 'true';

console.log('Environment:');
console.log('  Selected credential source:', credentialSource.source);
console.log('  GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'SET' : 'NOT SET');
console.log('  GOOGLE_APPLICATION_CREDENTIALS_JSON:', process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ? 'SET' : 'NOT SET');
console.log('  USE_REAL_VERTEX_RAG:', process.env.USE_REAL_VERTEX_RAG);
console.log('  Credentials file exists:', process.env.GOOGLE_APPLICATION_CREDENTIALS ? fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS) : 'N/A');

// Load the RAG resolver
const { getMikageMemoryContext, getRetrieverMode, isRealVertexVerified } = require('./rag/rag_retriever_resolver');

const testQuery = 'white ceramic mask macro shot';

(async () => {
  try {
    console.log('\n=== PRE-CALL CHECKS ===');
    const retrieverMode = getRetrieverMode();
    const realVertexVerified = isRealVertexVerified();
    
    console.log('1. retriever_mode:', retrieverMode);
    console.log('2. real_vertex_verified (before call):', realVertexVerified);
    
    console.log('\n=== EXECUTING VERTEX CALL ===');
    console.log('Query:', testQuery);
    const startTime = Date.now();
    
    const context = await getMikageMemoryContext(testQuery);
    
    const duration = Date.now() - startTime;
    console.log('Call completed in', duration, 'ms');
    
    console.log('\n=== POST-CALL RESULTS ===');
    console.log('3. Context returned:', context ? 'YES' : 'NO (empty string)');
    console.log('4. Context length:', context ? context.length : 0);
    
    // Parse chunks
    let chunks = [];
    if (context) {
      const lines = context.split('\n');
      const memoryBlocks = lines.filter(l => l.startsWith('[MEMORY'));
      chunks = memoryBlocks.map((block, idx) => {
        const blockIdx = lines.indexOf(block);
        const sourceLine = lines.find((l, i) => l.startsWith('Source:') && i > blockIdx);
        return {
          id: `chunk_${idx + 1}`,
          source: sourceLine ? sourceLine.replace('Source:', '').trim() : 'unknown'
        };
      });
    }
    
    console.log('5. Chunks count:', chunks.length);
    
    // Create artifact output
    const artifactOutput = {
      retriever_mode: retrieverMode,
      real_vertex_verified: realVertexVerified,
      query: testQuery,
      context: context || "",
      chunks: chunks
    };
    
    console.log('\n=== ARTIFACT OUTPUT ===');
    console.log(JSON.stringify(artifactOutput, null, 2));
    
    // Final verification
    console.log('\n=== VERIFICATION ===');
    const checks = {
      'retriever_mode === "vertex"': retrieverMode === 'vertex',
      'real_vertex_verified === true': realVertexVerified === true,
      'chunks.length > 0': chunks.length > 0,
      'rag_context has real chunks': chunks.length > 0 && chunks[0].source !== 'unknown',
      'context injected (length > 0)': (context || '').length > 0
    };
    
    Object.entries(checks).forEach(([check, passed]) => {
      console.log(`  ${passed ? '✅' : '❌'} ${check}: ${passed}`);
    });
    
    const allPassed = Object.values(checks).every(v => v);
    console.log('\n=== FINAL RESULT: ' + (allPassed ? 'PASS' : 'FAIL') + ' ===');
    
    // Write test result
    const result = {
      timestamp: new Date().toISOString(),
      test: 'vertex_e2e_retrieval',
      query: testQuery,
      retriever_mode: retrieverMode,
      real_vertex_verified: realVertexVerified,
      chunk_count: chunks.length,
      context_length: context ? context.length : 0,
      duration_ms: duration,
      artifact_output: artifactOutput,
      checks: checks,
      result: allPassed ? 'PASS' : 'FAIL'
    };
    
    fs.writeFileSync('rag_vertex_e2e_result.json', JSON.stringify(result, null, 2));
    console.log('Result saved to: rag_vertex_e2e_result.json');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED WITH ERROR:', error.message);
    console.error(error.stack);
    
    const result = {
      timestamp: new Date().toISOString(),
      test: 'vertex_e2e_retrieval',
      query: testQuery,
      error: error.message,
      result: 'FAIL'
    };
    fs.writeFileSync('rag_vertex_e2e_result.json', JSON.stringify(result, null, 2));
    process.exit(1);
  }
})();
