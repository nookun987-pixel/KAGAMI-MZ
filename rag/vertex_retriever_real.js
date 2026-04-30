"use strict";

// Real Vertex AI retriever implementation
const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ID = "gen-lang-client-0440215253";
const LOCATION = "global";
const DATA_STORE_ID = "mikage-brain_1774647243976";

// Lazy load Discovery Engine client
let searchServiceClient = null;

function getSearchClient() {
  if (!searchServiceClient) {
    const { SearchServiceClient } = require('@google-cloud/discoveryengine');
    searchServiceClient = new SearchServiceClient();
  }
  return searchServiceClient;
}

function normalizeCredentialInput(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function getCredentialLookupCandidates() {
  const candidates = [];
  const googleApplicationCredentials = normalizeCredentialInput(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  const mikageGoogleApplicationCredentials = normalizeCredentialInput(process.env.MIKAGE_GOOGLE_APPLICATION_CREDENTIALS);
  const googleApplicationCredentialsJson = normalizeCredentialInput(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  const repoCredentialsPath = path.join(process.cwd(), 'repo_credentials', 'gsheet_key.json');
  const legacyCredentialsPath = path.join(process.cwd(), 'service-account-key.json');

  if (googleApplicationCredentials) {
    candidates.push({
      source: 'GOOGLE_APPLICATION_CREDENTIALS',
      kind: 'path',
      path: path.resolve(googleApplicationCredentials)
    });
  }

  if (mikageGoogleApplicationCredentials && mikageGoogleApplicationCredentials !== googleApplicationCredentials) {
    candidates.push({
      source: 'MIKAGE_GOOGLE_APPLICATION_CREDENTIALS',
      kind: 'path',
      path: path.resolve(mikageGoogleApplicationCredentials)
    });
  }

  if (googleApplicationCredentialsJson) {
    candidates.push({
      source: 'GOOGLE_APPLICATION_CREDENTIALS_JSON',
      kind: 'json',
      json: googleApplicationCredentialsJson
    });
  }

  if (fs.existsSync(repoCredentialsPath)) {
    candidates.push({
      source: 'repo_credentials/gsheet_key.json',
      kind: 'path',
      path: repoCredentialsPath
    });
  }

  if (fs.existsSync(legacyCredentialsPath)) {
    candidates.push({
      source: 'service-account-key.json',
      kind: 'path',
      path: legacyCredentialsPath
    });
  }

  return candidates;
}

function readCredentialJson(candidate) {
  if (candidate.kind === 'json') {
    return JSON.parse(candidate.json);
  }

  if (!fs.existsSync(candidate.path)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(candidate.path, 'utf8'));
}

function getResolvedCredentialStatus() {
  const candidates = getCredentialLookupCandidates();

  for (const candidate of candidates) {
    try {
      const keyData = readCredentialJson(candidate);
      if (keyData && keyData.type && keyData.project_id && keyData.private_key) {
        return {
          candidate,
          keyData
        };
      }
    } catch (error) {
      console.error(`[RAG] Credential candidate invalid (${candidate.source}):`, error.message);
    }
  }

  return null;
}

/**
 * Real Vertex AI query implementation using Discovery Engine
 * @param {string} query - The search query
 * @returns {Promise<Object>} - Retrieved chunks and sources
 */
async function queryMikageBrain(query) {
  try {
    console.log(`[RAG] Querying real Vertex AI: ${query}`);
    
    // Get detailed credential status
    const credStatus = getCredentialStatus();
    
    console.log(`[RAG] Credential check: file=${credStatus.credentials_file_present}, env=${credStatus.credentials_env_present}, readable=${credStatus.credentials_file_readable}, parse_ok=${credStatus.service_account_json_parse_ok}`);
    
    if (!credStatus.credentials_file_present && !credStatus.credentials_env_present) {
      throw new Error("Google Cloud credentials not found - missing service-account-key.json and GOOGLE_APPLICATION_CREDENTIALS");
    }
    
    if (credStatus.credentials_file_present && (!credStatus.credentials_file_readable || !credStatus.service_account_json_parse_ok)) {
      throw new Error("Service account key file exists but is invalid or unreadable");
    }
    
    if (!credStatus.project_id_present) {
      throw new Error("Project ID not configured");
    }
    
    if (!credStatus.datastore_config_present) {
      throw new Error("Data store ID not configured");
    }
    
    console.log(`[RAG] Connecting to Vertex AI data store: ${DATA_STORE_ID}`);
    
    // Make real Vertex AI Discovery Engine API call
    const client = getSearchClient();
    const servingConfig = `projects/${PROJECT_ID}/locations/${LOCATION}/collections/default_collection/dataStores/${DATA_STORE_ID}/servingConfigs/default_config`;
    
    const searchRequest = {
      servingConfig: servingConfig,
      query: query,
      pageSize: 5,
      queryExpansionSpec: { condition: 'AUTO' },
      spellCorrectionSpec: { mode: 'AUTO' }
    };
    
    console.log(`[RAG] Executing search...`);
    const [searchResponse] = await client.search(searchRequest);
    
    // Handle response - check if it's an array or has results property
    let resultsArray = [];
    if (Array.isArray(searchResponse)) {
      resultsArray = searchResponse;
    } else if (searchResponse && Array.isArray(searchResponse.results)) {
      resultsArray = searchResponse.results;
    } else if (searchResponse && typeof searchResponse === 'object') {
      // Check if response has numeric keys (array-like object)
      const numericKeys = Object.keys(searchResponse).filter(k => /^\d+$/.test(k));
      if (numericKeys.length > 0) {
        resultsArray = numericKeys.map(k => searchResponse[k]);
      }
    }
    
    console.log(`[RAG] Response type: ${typeof searchResponse}, isArray: ${Array.isArray(searchResponse)}`);
    
    // Extract chunks from response
    const realChunks = [];
    
    if (resultsArray && resultsArray.length > 0) {
      console.log(`[RAG] Search returned ${resultsArray.length} results`);
      
      resultsArray.forEach((result, index) => {
        if (!result || !result.document) {
          console.log(`[RAG] Skipping result ${index} - no document`);
          return;
        }
        
        const document = result.document;
        if (document) {
          // Extract content from derivedStructData
          let content = '';
          let title = 'unknown';
          let uri = 'unknown';
          
          if (document.derivedStructData) {
            const structData = document.derivedStructData;
            
            // Handle protobuf struct format (fields with stringValue)
            if (structData.fields) {
              const fields = structData.fields;
              if (fields.title && fields.title.stringValue) {
                title = fields.title.stringValue;
              }
              if (fields.link && fields.link.stringValue) {
                uri = fields.link.stringValue;
              }
              // Build content from available fields
              const contentParts = [];
              if (fields.title && fields.title.stringValue) {
                contentParts.push(`Title: ${fields.title.stringValue}`);
              }
              if (fields.link && fields.link.stringValue) {
                contentParts.push(`Source: ${fields.link.stringValue}`);
              }
              content = contentParts.join('\n');
            } 
            // Handle regular object format with snippets
            else if (structData.snippets && structData.snippets.length > 0) {
              content = structData.snippets.map(s => s.content || s).join(' ');
            }
            // Fallback: stringify the struct data
            else {
              content = JSON.stringify(structData).substring(0, 500);
            }
          }
          
          realChunks.push({
            id: `vertex_chunk_${index + 1}`,
            content: content || `Document: ${document.name || document.id}`,
            score: result.relevanceScore || (result.rankSignals && result.rankSignals.semanticSimilarityScore) || 0.0,
            metadata: {
              title: title,
              uri: uri,
              source: 'vertex_ai_search',
              id: document.id || `doc_${index}`,
              name: document.name
            }
          });
        }
      });
    }

    if (realChunks.length === 0) {
      console.warn(`[RAG] No real chunks retrieved from Vertex AI`);
    } else {
      console.log(`[RAG] Retrieved ${realChunks.length} real chunks from Vertex AI`);
    }

    const sources = realChunks.map(chunk => ({
      id: chunk.id,
      title: chunk.metadata.title,
      uri: chunk.metadata.uri,
      score: chunk.score
    }));

    return {
      chunks: realChunks,
      sources: sources,
      query: query,
      totalResults: realChunks.length,
      fallback_used: false,
      vertex_client_init_success: true,
      api_response_received: true,
      ...credStatus
    };

  } catch (error) {
    console.error(`[RAG] Real Vertex AI query failed:`, error.message);
    
    // Return error result - do NOT fallback to mock in real mode
    return {
      chunks: [],
      sources: [],
      query: query,
      error: error.message,
      totalResults: 0,
      fallback_used: false,
      vertex_client_init_success: false,
      api_response_received: false,
      ...getCredentialStatus()
    };
  }
}

/**
 * Format retrieved chunks for prompt injection
 * @param {Object} result - Result from queryMikageBrain
 * @returns {string} - Formatted context string
 */
function formatRagContext(result) {
  if (!result.chunks || result.chunks.length === 0) {
    return "";
  }

  let context = "=== MIKAGE MEMORY CONTEXT ===\n";
  context += `Query: ${result.query}\n`;
  context += `Found ${result.chunks.length} relevant memories:\n\n`;

  result.chunks.forEach((chunk, index) => {
    context += `[MEMORY ${index + 1}]\n`;
    context += `Source: ${chunk.metadata.title} (${chunk.metadata.source})\n`;
    context += `Relevance: ${chunk.score}\n`;
    context += `Content: ${chunk.content}\n\n`;
  });

  context += "============================\n";
  
  return context;
}

/**
 * Main function to query and format context
 * @param {string} query - The search query
 * @returns {Promise<string>} - Formatted context for prompt
 */
async function getMikageMemoryContext(query) {
  try {
    const result = await queryMikageBrain(query);
    return formatRagContext(result);
  } catch (error) {
    console.error(`[RAG] Failed to get real Vertex memory context:`, error.message);
    return "";
  }
}

/**
 * Check if real Vertex is verified with detailed credential validation
 * @returns {boolean} - Whether real Vertex retrieval is verified
 */
function isRealVertexVerified() {
  const resolvedCredential = getResolvedCredentialStatus();

  if (!resolvedCredential) {
    return false;
  }

  return true;
}

/**
 * Check if cloud credentials are present with validation
 * @returns {boolean} - Whether cloud credentials are available
 */
function areCloudCredentialsPresent() {
  return isRealVertexVerified();
}

/**
 * Get detailed credential status for debugging
 * @returns {Object} - Detailed credential status
 */
function getCredentialStatus() {
  const legacyCredentialsFile = fs.existsSync(path.join(process.cwd(), 'service-account-key.json'));
  const credentialsEnv = !!(
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    process.env.MIKAGE_GOOGLE_APPLICATION_CREDENTIALS ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  );
  const resolvedCredential = getResolvedCredentialStatus();

  let credentialsFileReadable = false;
  let serviceAccountJsonParseOk = false;
  let credentialLookupSource = '';
  let credentialLookupPath = '';
  
  if (resolvedCredential) {
    try {
      const keyData = resolvedCredential.keyData;
      credentialsFileReadable = true;
      serviceAccountJsonParseOk = !!(keyData.type && keyData.project_id && keyData.private_key);
      credentialLookupSource = resolvedCredential.candidate.source;
      credentialLookupPath = resolvedCredential.candidate.kind === 'path' ? resolvedCredential.candidate.path : 'GOOGLE_APPLICATION_CREDENTIALS_JSON';
    } catch (error) {
      console.error('[RAG] Service account key validation failed:', error.message);
    }
  }
  
  return {
    credentials_file_present: legacyCredentialsFile,
    credentials_env_present: credentialsEnv,
    credentials_file_readable: credentialsFileReadable,
    service_account_json_parse_ok: serviceAccountJsonParseOk,
    credential_lookup_source: credentialLookupSource,
    credential_lookup_path: credentialLookupPath,
    project_id_present: !!PROJECT_ID,
    datastore_config_present: !!DATA_STORE_ID
  };
}

module.exports = {
  queryMikageBrain,
  formatRagContext,
  getMikageMemoryContext,
  isRealVertexVerified,
  areCloudCredentialsPresent,
  getCredentialStatus,
  PROJECT_ID,
  LOCATION,
  DATA_STORE_ID
};
