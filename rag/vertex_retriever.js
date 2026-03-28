"use strict";

const { DiscoveryEngine } = require("@google-cloud/discoveryengine").v1;

// Configuration
const PROJECT_ID = "gen-lang-client-0440215253";
const LOCATION = "global";
const DATA_STORE_ID = "mikage-brain_1774647243976";

// Initialize client
const client = new DiscoveryEngine({
  projectId: PROJECT_ID,
  apiEndpoint: `${LOCATION}-discoveryengine.googleapis.com`
});

/**
 * Query Mikage Brain cloud memory using Vertex AI Search
 * @param {string} query - The search query
 * @returns {Promise<Object>} - Retrieved chunks and sources
 */
async function queryMikageBrain(query) {
  try {
    console.log(`[RAG] Querying Mikage Brain: ${query}`);
    
    // Build the request
    const request = {
      parent: `projects/${PROJECT_ID}/locations/${LOCATION}/collections/default_collection/dataStores/${DATA_STORE_ID}`,
      servingConfig: `projects/${PROJECT_ID}/locations/${LOCATION}/collections/default_collection/dataStores/${DATA_STORE_ID}/servingConfigs/default_search`,
      query: {
        query: query,
        pageSize: 5
      }
    };

    // Execute the search
    const response = await client.search(request);

    // Process results
    const chunks = [];
    const sources = [];

    if (response.results && response.results.length > 0) {
      response.results.forEach((result, index) => {
        const chunk = {
          id: result.id || `chunk_${index}`,
          content: result.document?.derivedStructData?.content || result.document?.content || "",
          score: result.relevanceScore || 0,
          metadata: {
            title: result.document?.derivedStructData?.title || result.document?.title || "",
            uri: result.document?.derivedStructData?.uri || result.document?.uri || "",
            source: result.document?.derivedStructData?.source || result.document?.source || "unknown"
          }
        };
        
        chunks.push(chunk);
        
        sources.push({
          id: chunk.id,
          title: chunk.metadata.title,
          uri: chunk.metadata.uri,
          score: chunk.score
        });
      });
    }

    console.log(`[RAG] Retrieved ${chunks.length} chunks from Mikage Brain`);
    
    return {
      chunks: chunks,
      sources: sources,
      query: query,
      totalResults: response.totalSize || chunks.length
    };

  } catch (error) {
    console.error(`[RAG] Failed to query Mikage Brain:`, error.message);
    console.error(`[RAG] Error details:`, error);
    
    // Return empty result on failure
    return {
      chunks: [],
      sources: [],
      query: query,
      error: error.message,
      totalResults: 0
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
    console.error(`[RAG] Failed to get Mikage memory context:`, error.message);
    return "";
  }
}

module.exports = {
  queryMikageBrain,
  formatRagContext,
  getMikageMemoryContext,
  PROJECT_ID,
  LOCATION,
  DATA_STORE_ID
};
