const fs = require('fs');
const path = require('path');

async function testRagIntegrationPoint() {
  console.log('=== TESTING RAG INTEGRATION POINT ===');
  
  try {
    // Simulate the RAG integration point in orchestrator
    const intakeRequest = {
      job_id: "RAG_INTEGRATION_TEST",
      shot_type: "WEAPON_MACRO",
      generation_mode: "reproduction",
      user_idea: "test sword study"
    };
    
    console.log('Original intake:', intakeRequest);
    
    // Query Mikage Brain for relevant context (simulating orchestrator lines 3045-3053)
    const ragQuery = `${intakeRequest.shot_type} ${intakeRequest.generation_mode} ${intakeRequest.user_idea || ''}`;
    console.log(`[RAG] Query started: ${ragQuery}`);
    
    // Import and use the mock RAG function
    const { getMikageMemoryContext } = require('./rag/vertex_retriever_mock');
    const mikageMemoryContext = await getMikageMemoryContext(ragQuery);
    
    // Create RAG debug artifact (simulating orchestrator lines 3052-3092)
    const ragDebug = {
      rag_executed: true,
      query_used: ragQuery,
      top_k: 5,
      chunks_returned: 0,
      sources: [],
      error: null,
      context_preview: ""
    };
    
    // Inject memory context into intake request
    if (mikageMemoryContext) {
      intakeRequest.mikage_memory_context = mikageMemoryContext;
      console.log("[RAG] Injected Mikage memory context into intake");
      
      // Parse context for debug info
      const lines = mikageMemoryContext.split('\n');
      const memoryBlocks = lines.filter(line => line.startsWith('[MEMORY'));
      ragDebug.chunks_returned = memoryBlocks.length;
      ragDebug.context_preview = mikageMemoryContext.substring(0, 1500);
      
      // Extract sources
      memoryBlocks.forEach((block, index) => {
        const sourceLine = lines.find((line, i) => line.startsWith('Source:') && i > lines.indexOf(block));
        if (sourceLine) {
          ragDebug.sources.push({
            memory_id: index + 1,
            source: sourceLine.replace('Source:', '').trim()
          });
        }
      });
      
      console.log(`[RAG] Retrieved ${ragDebug.chunks_returned} chunks`);
    } else {
      console.log("[RAG] Fallback path used - no context retrieved");
      ragDebug.rag_executed = false;
      ragDebug.error = "No context returned";
    }
    
    // Create test directory and write RAG debug artifact
    const testDir = 'runs/RAG_INTEGRATION_TEST';
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(testDir, 'rag_context.json'), JSON.stringify(ragDebug, null, 2));
    fs.writeFileSync(path.join(testDir, 'intake_with_context.json'), JSON.stringify(intakeRequest, null, 2));
    
    console.log('\n=== INTEGRATION TEST RESULTS ===');
    console.log('RAG executed:', ragDebug.rag_executed);
    console.log('Chunks returned:', ragDebug.chunks_returned);
    console.log('Sources found:', ragDebug.sources.length);
    console.log('Context length:', mikageMemoryContext.length);
    console.log('Context injected:', !!intakeRequest.mikage_memory_context);
    console.log('Has memory header:', mikageMemoryContext.includes('=== MIKAGE MEMORY CONTEXT ==='));
    
    // Verify Gemini intake would receive context
    const wouldReceiveContext = intakeRequest.mikage_memory_context && 
                               intakeRequest.mikage_memory_context.includes('=== MIKAGE MEMORY CONTEXT ===');
    
    console.log('Gemini intake would receive context:', wouldReceiveContext);
    
    return {
      success: true,
      ragExecuted: ragDebug.rag_executed,
      chunksReturned: ragDebug.chunks_returned,
      contextInjected: wouldReceiveContext,
      artifactsCreated: ['rag_context.json', 'intake_with_context.json']
    };
    
  } catch (error) {
    console.error('❌ RAG integration test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

testRagIntegrationPoint().then(result => {
  console.log('\n=== FINAL INTEGRATION TEST RESULT ===');
  console.log('Success:', result.success);
  if (result.success) {
    console.log('RAG executed:', result.ragExecuted);
    console.log('Chunks returned:', result.chunksReturned);
    console.log('Context injected:', result.contextInjected);
    console.log('Artifacts created:', result.artifactsCreated.join(', '));
  }
});
