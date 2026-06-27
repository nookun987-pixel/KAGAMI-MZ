"use strict";

// Mock RAG implementation for validation testing
const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ID = "gen-lang-client-0440215253";
const LOCATION = "global";
const DATA_STORE_ID = "mikage-brain_1774647243976";

/**
 * Mock query Mikage Brain for validation testing
 * @param {string} query - The search query
 * @returns {Promise<Object>} - Retrieved chunks and sources
 */
async function queryMikageBrain(query) {
  try {
    console.log(`[RAG] Querying Mikage Brain: ${query}`);
    
    // Mock successful retrieval with sample data
    const mockChunks = [
      {
        id: "mock_chunk_1",
        content: `Previous ${query.split(' ')[0]} run failed due to abstract composition issues. Need stronger subject presence and clearer manufactured object read.`,
        score: 0.92,
        metadata: {
          title: "final_decision.json",
          uri: "runs/previous_run/final_decision.json",
          source: "validation_failure"
        }
      },
      {
        id: "mock_chunk_2", 
        content: `${query.split(' ')[0]} canon rules require: 1) Clear subject silhouette 2) Manufactured object readability 3) No abstract atmosphere 4) Material-first composition`,
        score: 0.87,
        metadata: {
          title: "STRUCTURED_RULES.json",
          uri: "canon/STRUCTURED_RULES.json",
          source: "canon_rules"
        }
      }
    ];

    const sources = mockChunks.map(chunk => ({
      id: chunk.id,
      title: chunk.metadata.title,
      uri: chunk.metadata.uri,
      score: chunk.score
    }));

    console.log(`[RAG] Retrieved ${mockChunks.length} chunks from Mikage Brain`);
    
    return {
      chunks: mockChunks,
      sources: sources,
      query: query,
      totalResults: mockChunks.length
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
