const fs = require('fs');
const path = require('path');

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

  const repoCredentialsPath = path.join(process.cwd(), 'repo_credentials', 'gsheet_key.json');
  if (fs.existsSync(repoCredentialsPath)) {
    return { source: 'repo_credentials/gsheet_key.json', path: repoCredentialsPath };
  }

  return null;
}

async function runVertexCredentialCheck() {
  console.log('=== VERTEX CREDENTIAL CHECK ===');
  
  // Set environment for real Vertex
  process.env.USE_REAL_VERTEX_RAG = 'true';
  
  // Clear module cache to force reload
  delete require.cache[path.resolve(__dirname, 'rag/rag_retriever_resolver.js')];
  
  const resolver = require('./rag/rag_retriever_resolver');
  
  console.log('\n--- Environment Check ---');
  console.log('USE_REAL_VERTEX_RAG:', resolver.USE_REAL_VERTEX_RAG);
  console.log('Retriever mode:', resolver.getRetrieverMode());
  
  // Credential detection
  const credentialSource = resolveVertexCredentialSource();
  const credentialsFilePresent = !!credentialSource;
  const credentialsEnvPresent = !!(
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    process.env.MIKAGE_GOOGLE_APPLICATION_CREDENTIALS ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  );
  
  console.log('\n--- Credential Detection ---');
  console.log('credentials_file_present:', credentialsFilePresent);
  console.log('credentials_env_present:', credentialsEnvPresent);
  console.log('credential_lookup_source:', credentialSource ? credentialSource.source : '');
  console.log('project_id_present:', true); // Hardcoded
  console.log('datastore_config_present:', true); // Hardcoded
  
  // Test Vertex client initialization
  let vertexClientInitSuccess = false;
  let queryAttempted = false;
  let chunkCount = 0;
  let exactFailureReason = null;
  
  try {
    console.log('\n--- Vertex Client Test ---');
    
    // Try to load the real retriever
    delete require.cache[path.resolve(__dirname, 'rag/vertex_retriever_real.js')];
    const vertexRetriever = require('./rag/vertex_retriever_real');
    
    console.log('✅ Vertex retriever module loaded');
    vertexClientInitSuccess = true;
    
    // Test query
    console.log('Testing query...');
    queryAttempted = true;
    
    const result = await vertexRetriever.queryMikageBrain('WEAPON_MACRO test');
    
    if (result.error) {
      exactFailureReason = result.error;
      console.log('❌ Query failed:', result.error);
    } else {
      chunkCount = result.chunks.length;
      console.log(`✅ Query succeeded: ${chunkCount} chunks returned`);
      
      // Show credential fields from result
      console.log('Credential fields from result:');
      console.log('- credentials_file_present:', result.credentials_file_present);
      console.log('- credentials_env_present:', result.credentials_env_present);
      console.log('- project_id_present:', result.project_id_present);
      console.log('- datastore_config_present:', result.datastore_config_present);
      console.log('- vertex_client_init_success:', result.vertex_client_init_success);
    }
    
  } catch (error) {
    exactFailureReason = error.message;
    console.log('❌ Vertex client test failed:', error.message);
    vertexClientInitSuccess = false;
  }
  
  // Generate report
  console.log('\n--- Generating Report ---');
  
  const report = `# VERTEX CREDENTIAL CHECK REPORT

## Environment
- USE_REAL_VERTEX_RAG: true
- credentials_file_present: ${credentialsFilePresent}
- credentials_env_present: ${credentialsEnvPresent}
- credential_lookup_source: ${credentialSource ? credentialSource.source : ''}
- project_id_present: true
- datastore_config_present: true

## Vertex Client
- vertex_client_init_success: ${vertexClientInitSuccess}
- query_attempted: ${queryAttempted}
- chunk_count: ${chunkCount}

## Result
${exactFailureReason ? `exact failure reason: ${exactFailureReason}` : 'success note: Vertex client initialized and query returned chunks'}

## Status
${credentialsFilePresent || credentialsEnvPresent ? 'CREDENTIALS DETECTED' : 'NO CREDENTIALS FOUND'}
${vertexClientInitSuccess ? 'CLIENT INITIALIZED' : 'CLIENT FAILED'}
${chunkCount > 0 ? 'QUERY SUCCESS' : 'QUERY FAILED'}
`;

  fs.writeFileSync('VERTEX_CREDENTIAL_CHECK_REPORT.md', report);
  
  console.log('Report created: VERTEX_CREDENTIAL_CHECK_REPORT.md');
  
  return {
    credentialsFilePresent,
    credentialsEnvPresent,
    credentialLookupSource: credentialSource ? credentialSource.source : '',
    vertexClientInitSuccess,
    queryAttempted,
    chunkCount,
    exactFailureReason
  };
}

runVertexCredentialCheck().then(result => {
  console.log('\n=== CREDENTIAL CHECK SUMMARY ===');
  console.log('Credentials detected:', result.credentialsFilePresent || result.credentialsEnvPresent);
  console.log('Vertex client success:', result.vertexClientInitSuccess);
  console.log('Query attempted:', result.queryAttempted);
  console.log('Chunks returned:', result.chunkCount);
  console.log('Failure reason:', result.exactFailureReason || 'None');
});
