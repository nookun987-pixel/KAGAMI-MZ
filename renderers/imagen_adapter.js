"use strict";

/**
 * Imagen Adapter for Google Execution Lane
 * Handles Imagen API calls and result persistence
 * 
 * STRICT RULES:
 * - If no image returned → HARD FAIL
 * - If output_files == [] → HARD FAIL
 * - All errors must be captured in result bundle
 */

const fs = require('fs');
const path = require('path');

// Google Cloud SDK
let PredictionServiceClient;
try {
  const aiplatform = require('@google-cloud/aiplatform');
  PredictionServiceClient = aiplatform.v1.PredictionServiceClient;
} catch (e) {
  console.warn('[IMAGEN] @google-cloud/aiplatform not installed, will use REST fallback');
}

/**
 * Build Imagen request from structured job payload
 * @param {Object} jobPayload - Render job payload per contract
 * @returns {Object} - Imagen API request body
 */
function buildImagenRequest(jobPayload) {
  const config = jobPayload.imagen_config || {};
  
  // Map aspect ratio to dimensions if width/height not specified
  let width = jobPayload.width;
  let height = jobPayload.height;
  
  if (!width || !height) {
    const aspectMap = {
      "1:1": { w: 1024, h: 1024 },
      "3:4": { w: 768, h: 1024 },
      "4:3": { w: 1024, h: 768 },
      "9:16": { w: 576, h: 1024 },
      "16:9": { w: 1024, h: 576 },
      "21:9": { w: 1024, h: 438 }
    };
    const mapped = aspectMap[jobPayload.aspect_ratio] || aspectMap["1:1"];
    width = width || mapped.w;
    height = height || mapped.h;
  }
  
  return {
    prompt: jobPayload.prompt,
    negativePrompt: jobPayload.negative_prompt || "",
    aspectRatio: jobPayload.aspect_ratio || "1:1",
    sampleCount: config.number_of_images || 1,
    seed: jobPayload.seed,
    guidanceScale: config.guidance_scale || 7.5,
    safetyFilterLevel: config.safety_filter_level || "block_some",
    personGeneration: config.person_generation || "dont_allow"
  };
}

/**
 * Call Imagen API via Google Cloud SDK or REST
 * @param {Object} request - Imagen request body
 * @param {string} projectId - GCP project ID
 * @returns {Promise<Object>} - API response
 */
async function callImagenAPI(request, projectId) {
  const PROJECT_ID = projectId || process.env.GOOGLE_CLOUD_PROJECT || "gen-lang-client-0440215253";
  const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
  const MODEL = "imagen-3.0-generate-001";
  
  console.log(`[IMAGEN] Calling API for project: ${PROJECT_ID}`);
  console.log(`[IMAGEN] Location: ${LOCATION}, Model: ${MODEL}`);
  console.log(`[IMAGEN] Prompt length: ${request.prompt?.length || 0} chars`);
  
  try {
    // Try SDK first
    if (PredictionServiceClient) {
      return await callImagenSDK(request, PROJECT_ID, LOCATION, MODEL);
    }
    
    // Fallback to REST API
    return await callImagenREST(request, PROJECT_ID, LOCATION, MODEL);
    
  } catch (error) {
    console.error(`[IMAGEN] API call failed: ${error.message}`);
    
    // Return structured error for result bundle
    return {
      error: true,
      error_code: "IMAGEN_API_FAILED",
      error_message: error.message,
      error_stage: "imagen_api"
    };
  }
}

/**
 * Call Imagen API via Google Cloud SDK
 */
async function callImagenSDK(request, projectId, location, modelId) {
  const client = new PredictionServiceClient({
    apiEndpoint: `${location}-aiplatform.googleapis.com`
  });
  
  const endpoint = `projects/${projectId}/locations/${location}/publishers/google/models/${modelId}`;
  
  const parameters = {
    sampleCount: request.sampleCount || 1,
    seed: request.seed ? { value: request.seed.toString() } : undefined,
    aspectRatio: request.aspectRatio || "1:1",
    guidanceScale: request.guidanceScale || 7.5,
    safetyFilterLevel: request.safetyFilterLevel || "block_some",
    personGeneration: request.personGeneration || "dont_allow"
  };
  
  const instance = {
    prompt: request.prompt
  };
  
  if (request.negativePrompt) {
    instance.negativePrompt = request.negativePrompt;
  }
  
  const [response] = await client.predict({
    endpoint,
    instances: [instance],
    parameters
  });
  
  // Parse predictions
  const predictions = response.predictions.map((pred, idx) => {
    const b64Data = pred.structValue?.fields?.bytesBase64Encoded?.stringValue ||
                   pred.bytesBase64Encoded;
    
    return {
      bytesBase64Encoded: b64Data,
      mimeType: "image/png",
      width: 1024,
      height: 1024,
      index: idx
    };
  }).filter(p => p.bytesBase64Encoded);
  
  return {
    predictions,
    success: predictions.length > 0
  };
}

/**
 * Call Imagen API via REST (fallback)
 */
async function callImagenREST(request, projectId, location, modelId) {
  const fetch = (await import('node-fetch')).default;
  const { GoogleAuth } = require('google-auth-library');
  
  function normalizeCredentialInput(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  function resolveImagenCredentialPath() {
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

    const legacyKeyPath = path.join(process.cwd(), 'service-account-key.json');
    if (fs.existsSync(legacyKeyPath)) {
      return { source: 'service-account-key.json', path: legacyKeyPath };
    }

    return null;
  }

  // Explicitly load service account credentials
  const credentialSelection = resolveImagenCredentialPath();
  let auth;
  
  if (credentialSelection && credentialSelection.path && fs.existsSync(credentialSelection.path)) {
    console.log(`[IMAGEN] Using service account key (${credentialSelection.source}): ${credentialSelection.path}`);
    auth = new GoogleAuth({
      keyFile: credentialSelection.path,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
  } else if (credentialSelection && credentialSelection.json) {
    console.log(`[IMAGEN] Using service account JSON from ${credentialSelection.source}`);
    auth = new GoogleAuth({
      credentials: JSON.parse(credentialSelection.json),
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
  } else {
    console.log('[IMAGEN] Using default credentials');
    auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
  }
  
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  
  if (!token.token) {
    throw new Error('Failed to get access token - check GOOGLE_APPLICATION_CREDENTIALS');
  }
  
  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:predict`;
  
  const body = {
    instances: [{
      prompt: request.prompt,
      ...(request.negativePrompt && { negativePrompt: request.negativePrompt })
    }],
    parameters: {
      sampleCount: request.sampleCount || 1,
      ...(request.seed && { seed: request.seed.toString() }),
      aspectRatio: request.aspectRatio || "1:1",
      guidanceScale: request.guidanceScale || 7.5,
      safetyFilterLevel: request.safetyFilterLevel || "block_some",
      personGeneration: request.personGeneration || "dont_allow",
      // Disable watermark when using seed for reproducibility
      ...(request.seed && { addWatermark: false })
    }
  };
  
  console.log(`[IMAGEN] Sending request to ${url}`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[IMAGEN] API error ${response.status}: ${errorText}`);
    throw new Error(`API error ${response.status}: ${errorText}`);
  }
  
  const data = await response.json();
  console.log(`[IMAGEN] Response received: ${data.predictions?.length || 0} predictions`);
  
  return {
    predictions: (data.predictions || []).map((pred, idx) => ({
      bytesBase64Encoded: pred.bytesBase64Encoded,
      mimeType: "image/png",
      width: 1024,
      height: 1024,
      index: idx
    })),
    success: (data.predictions || []).length > 0
  };
}

/**
 * Save images from Imagen response
 * @param {Object} imagenResponse - API response
 * @param {string} outputDir - Output directory
 * @param {string} jobId - Job ID for naming
 * @returns {Array<Object>} - List of saved file info
 */
function saveImages(imagenResponse, outputDir, jobId) {
  const outputFiles = [];
  
  if (!imagenResponse.predictions || !Array.isArray(imagenResponse.predictions)) {
    console.error("[IMAGEN] No predictions in response");
    return outputFiles;
  }
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  imagenResponse.predictions.forEach((prediction, index) => {
    try {
      if (prediction.bytesBase64Encoded) {
        const imageBuffer = Buffer.from(prediction.bytesBase64Encoded, 'base64');
        const filename = index === 0 ? `${jobId}.png` : `${jobId}_${index + 1}.png`;
        const filepath = path.join(outputDir, filename);
        
        fs.writeFileSync(filepath, imageBuffer);
        
        outputFiles.push({
          path: filepath,
          type: "image",
          mime_type: "image/png",
          size_bytes: imageBuffer.length,
          width: prediction.width || 0,
          height: prediction.height || 0,
          index: index
        });
        
        console.log(`[IMAGEN] Saved image: ${filepath} (${imageBuffer.length} bytes)`);
      }
    } catch (error) {
      console.error(`[IMAGEN] Failed to save image ${index}: ${error.message}`);
    }
  });
  
  return outputFiles;
}

/**
 * Execute render job end-to-end
 * @param {Object} jobPayload - Render job payload
 * @returns {Promise<Object>} - Result bundle per contract
 */
async function executeRenderJob(jobPayload) {
  const startedAt = new Date().toISOString();
  const jobId = jobPayload.job_id;
  const outputDir = jobPayload.output_path || path.join(process.cwd(), 'outputs', jobId);
  
  console.log(`\n[EXEC] Starting render job: ${jobId}`);
  console.log(`[EXEC] Output dir: ${outputDir}`);
  
  // Initialize result bundle
  const resultBundle = {
    version: "1.0.0",
    job_id: jobId,
    status: "FAIL",
    output_files: [],
    primary_output: null,
    render_payload: jobPayload,
    render_response_raw: null,
    rag_context: null,
    execution_lane_info: {
      platform: "local",
      runtime: "nodejs",
      gpu_available: false,
      execution_timestamp: startedAt
    },
    error: null,
    timing: {
      started_at: startedAt,
      rag_completed_at: null,
      imagen_started_at: null,
      imagen_completed_at: null,
      total_duration_ms: 0
    },
    started_at: startedAt,
    completed_at: null
  };
  
  try {
    // Step 1: RAG retrieval (if enabled)
    if (jobPayload.rag_enabled) {
      console.log("[EXEC] RAG enabled - calling Vertex...");
      const ragStart = Date.now();
      
      try {
        // Import RAG resolver
        const { getMikageMemoryContext, getRetrieverMode, isRealVertexVerified } = 
          require('../rag/rag_retriever_resolver');
        
        const ragQuery = jobPayload.rag_query || `${jobPayload.shot_type} ${jobPayload.user_idea || ''}`;
        const context = await getMikageMemoryContext(ragQuery);
        
        resultBundle.rag_context = {
          retriever_mode: getRetrieverMode(),
          real_vertex_verified: isRealVertexVerified(),
          query: ragQuery,
          context: context || "",
          chunks: [] // Will be populated if context exists
        };
        
        if (context) {
          const lines = context.split('\n');
          const memoryBlocks = lines.filter(l => l.startsWith('[MEMORY'));
          memoryBlocks.forEach((block, idx) => {
            const blockIdx = lines.indexOf(block);
            const sourceLine = lines.find((l, i) => l.startsWith('Source:') && i > blockIdx);
            resultBundle.rag_context.chunks.push({
              id: `chunk_${idx + 1}`,
              content: block,
              score: 0.0,
              metadata: { source: sourceLine || 'unknown' }
            });
          });
        }
        
        resultBundle.timing.rag_completed_at = new Date().toISOString();
        console.log(`[EXEC] RAG complete: ${resultBundle.rag_context.chunks.length} chunks`);
        
      } catch (ragError) {
        console.error(`[EXEC] RAG failed: ${ragError.message}`);
        resultBundle.error = {
          code: "RAG_FAILED",
          message: ragError.message,
          stage: "rag_retrieval",
          retryable: true
        };
      }
    }
    
    // Step 2: Call Imagen API
    console.log("[EXEC] Calling Imagen API...");
    resultBundle.timing.imagen_started_at = new Date().toISOString();
    
    const imagenRequest = buildImagenRequest(jobPayload);
    const imagenResponse = await callImagenAPI(imagenRequest);
    
    resultBundle.render_response_raw = imagenResponse;
    resultBundle.timing.imagen_completed_at = new Date().toISOString();
    
    // Check for API errors
    if (imagenResponse.error) {
      throw new Error(`Imagen API error: ${imagenResponse.error_message}`);
    }
    
    // Step 3: Save images
    const outputFiles = saveImages(imagenResponse, outputDir, jobId);
    resultBundle.output_files = outputFiles;
    
    // HARD FAIL if no images
    if (outputFiles.length === 0) {
      throw new Error("HARD FAIL: No output images generated");
    }
    
    // Set primary output
    const primaryImage = outputFiles.find(f => f.type === "image" && f.index === 0);
    resultBundle.primary_output = primaryImage ? primaryImage.path : null;
    
    // Save render_payload.json artifact
    fs.writeFileSync(
      path.join(outputDir, "render_payload.json"),
      JSON.stringify(jobPayload, null, 2)
    );
    
    // Save render_response_raw.json artifact
    fs.writeFileSync(
      path.join(outputDir, "render_response_raw.json"),
      JSON.stringify(imagenResponse, null, 2)
    );
    
    // Save rag_context.json if used
    if (resultBundle.rag_context) {
      fs.writeFileSync(
        path.join(outputDir, "rag_context.json"),
        JSON.stringify(resultBundle.rag_context, null, 2)
      );
    }
    
    // Mark success
    resultBundle.status = "SUCCESS";
    console.log(`[EXEC] Success: ${outputFiles.length} images saved`);
    
  } catch (error) {
    console.error(`[EXEC] Job failed: ${error.message}`);
    resultBundle.status = "FAIL";
    resultBundle.error = {
      code: error.code || "EXECUTION_FAILED",
      message: error.message,
      stage: error.stage || "imagen_api",
      retryable: false
    };
  }
  
  // Finalize
  const completedAt = new Date().toISOString();
  resultBundle.completed_at = completedAt;
  resultBundle.timing.total_duration_ms = 
    new Date(completedAt).getTime() - new Date(startedAt).getTime();
  
  // Save result bundle
  fs.writeFileSync(
    path.join(outputDir, "result_bundle.json"),
    JSON.stringify(resultBundle, null, 2)
  );
  
  console.log(`[EXEC] Completed in ${resultBundle.timing.total_duration_ms}ms`);
  console.log(`[EXEC] Status: ${resultBundle.status}`);
  
  return resultBundle;
}

module.exports = {
  buildImagenRequest,
  callImagenAPI,
  saveImages,
  executeRenderJob
};
