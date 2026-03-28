"use strict";

// RAG retriever resolver - unified interface for mock vs real Vertex selection
const USE_REAL_VERTEX_RAG = process.env.USE_REAL_VERTEX_RAG === 'true';

let retrieverInstance = null;

/**
 * Get the appropriate RAG retriever based on environment configuration
 * @returns {Object} - RAG retriever with getMikageMemoryContext function
 */
function getRagRetriever() {
  if (retrieverInstance) {
    return retrieverInstance;
  }

  if (USE_REAL_VERTEX_RAG) {
    console.log("[RAG] Using real Vertex AI retriever");
    try {
      retrieverInstance = require('./vertex_retriever_real');
    } catch (error) {
      console.error("[RAG] Failed to load real Vertex retriever, falling back to mock:", error.message);
      retrieverInstance = require('./vertex_retriever_mock');
    }
  } else {
    console.log("[RAG] Using mock retriever");
    retrieverInstance = require('./vertex_retriever_mock');
  }

  return retrieverInstance;
}

/**
 * Unified RAG interface - delegates to selected retriever
 * @param {string} query - The search query
 * @returns {Promise<string>} - Formatted context for prompt
 */
async function getMikageMemoryContext(query) {
  const retriever = getRagRetriever();
  return await retriever.getMikageMemoryContext(query);
}

/**
 * Get current retriever mode for artifact tagging
 * @returns {string} - "mock" or "vertex"
 */
function getRetrieverMode() {
  return USE_REAL_VERTEX_RAG ? 'vertex' : 'mock';
}

/**
 * Check if real Vertex is verified (uses actual retriever's credential check)
 * @returns {boolean} - Whether real Vertex retrieval is verified
 */
function isRealVertexVerified() {
  if (!USE_REAL_VERTEX_RAG) {
    return false;
  }
  
  try {
    const retriever = getRagRetriever();
    return retriever.isRealVertexVerified();
  } catch (error) {
    return false;
  }
}

/**
 * Check if cloud credentials are present (uses actual retriever's credential check)
 * @returns {boolean} - Whether cloud credentials are available
 */
function areCloudCredentialsPresent() {
  if (!USE_REAL_VERTEX_RAG) {
    return false;
  }
  
  try {
    const retriever = getRagRetriever();
    return retriever.areCloudCredentialsPresent();
  } catch (error) {
    return false;
  }
}

module.exports = {
  getMikageMemoryContext,
  getRetrieverMode,
  isRealVertexVerified,
  areCloudCredentialsPresent,
  USE_REAL_VERTEX_RAG
};
