const fs = require('fs');
const path = require('path');

async function runRealVertexValidation() {
  console.log('=== REAL VERTEX LIVE VALIDATION ===');
  
  // Set environment for real Vertex
  process.env.USE_REAL_VERTEX_RAG = 'true';
  
  // Clear module cache to force reload
  delete require.cache[path.resolve(__dirname, 'rag/rag_retriever_resolver.js')];
  
  const resolver = require('./rag/rag_retriever_resolver');
  
  console.log('\n--- Environment Check ---');
  console.log('USE_REAL_VERTEX_RAG:', resolver.USE_REAL_VERTEX_RAG);
  console.log('Retriever mode:', resolver.getRetrieverMode());
  console.log('Real Vertex verified:', resolver.isRealVertexVerified());
  console.log('Cloud credentials present:', resolver.areCloudCredentialsPresent());
  
  const jobs = [
    { job_id: 'REAL_VERTEX_TEST_A', shot_type: 'WEAPON_MACRO', generation_mode: 'reproduction', user_idea: 'sword identity test' },
    { job_id: 'REAL_VERTEX_TEST_B', shot_type: 'MASK_MACRO', generation_mode: 'creative', user_idea: 'mask composition study' },
    { job_id: 'REAL_VERTEX_TEST_C', shot_type: 'WHITE_CERAMIC_MACRO', generation_mode: 'creative', user_idea: 'ceramic material test' }
  ];
  
  const results = [];
  
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    console.log(`\n--- Job ${String.fromCharCode(65 + i)}: ${job.job_id} ---`);
    
    try {
      // Simulate the RAG integration point
      const ragQuery = `${job.shot_type} ${job.generation_mode} ${job.user_idea}`;
      console.log(`Query: ${ragQuery}`);
      
      const mikageMemoryContext = await resolver.getMikageMemoryContext(ragQuery);
      
      // Create RAG debug artifact
      const ragDebug = {
        rag_executed: true,
        query_used: ragQuery,
        top_k: 5,
        chunks_returned: 0,
        sources: [],
        error: null,
        context_preview: "",
        retriever_mode: resolver.getRetrieverMode(),
        real_vertex_verified: resolver.isRealVertexVerified(),
        cloud_credentials_present: resolver.areCloudCredentialsPresent(),
        context_injected: false,
        fallback_used: false
      };
      
      if (mikageMemoryContext) {
        ragDebug.context_injected = true;
        ragDebug.context_preview = mikageMemoryContext.substring(0, 200);
        
        // Parse context for chunk info
        const lines = mikageMemoryContext.split('\n');
        const memoryBlocks = lines.filter(line => line.startsWith('[MEMORY'));
        ragDebug.chunks_returned = memoryBlocks.length;
        
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
        
        console.log(`✅ Context injected, ${ragDebug.chunks_returned} chunks returned`);
      } else {
        console.log('❌ No context returned');
        ragDebug.rag_executed = false;
      }
      
      // Create artifact
      const testDir = `runs/${job.job_id}`;
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(testDir, 'rag_context.json'), JSON.stringify(ragDebug, null, 2));
      
      results.push({
        job: String.fromCharCode(65 + i),
        jobId: job.job_id,
        rag_executed: ragDebug.rag_executed,
        retriever_mode: ragDebug.retriever_mode,
        real_vertex_verified: ragDebug.real_vertex_verified,
        chunk_count: ragDebug.chunks_returned,
        fallback_used: ragDebug.fallback_used,
        context_injected: ragDebug.context_injected,
        evidence: ragDebug.error || `${ragDebug.chunks_returned} chunks retrieved`
      });
      
    } catch (error) {
      console.log(`❌ Job ${job.job_id} failed:`, error.message);
      
      results.push({
        job: String.fromCharCode(65 + i),
        jobId: job.job_id,
        rag_executed: false,
        retriever_mode: resolver.getRetrieverMode(),
        real_vertex_verified: false,
        chunk_count: 0,
        fallback_used: true,
        context_injected: false,
        evidence: `Error: ${error.message}`
      });
    }
  }
  
  // Generate final report
  console.log('\n=== GENERATING FINAL REPORT ===');
  
  let report = `# REAL VERTEX LIVE VALIDATION REPORT

## Environment
- USE_REAL_VERTEX_RAG: ${resolver.USE_REAL_VERTEX_RAG}
- credentials present: ${resolver.areCloudCredentialsPresent()}
- retriever mode observed: ${resolver.getRetrieverMode()}

`;

  results.forEach(result => {
    report += `## Job ${result.job}
- rag_executed: ${result.rag_executed}
- retriever_mode: ${result.retriever_mode}
- real_vertex_verified: ${result.real_vertex_verified}
- chunk_count: ${result.chunk_count}
- fallback_used: ${result.fallback_used}
- context_injected: ${result.context_injected}
- evidence: ${result.evidence}

`;
  });
  
  // Determine final verdict
  const allVertex = results.every(r => r.retriever_mode === 'vertex');
  const allVerified = results.every(r => r.real_vertex_verified === true);
  const allChunks = results.every(r => r.chunk_count > 0);
  const noFallback = results.every(r => r.fallback_used === false);
  
  report += `## Final Verdict\n`;
  
  if (allVertex && allVerified && allChunks && noFallback) {
    report += `REAL VERTEX LIVE VERIFIED`;
  } else if (allVertex && !allVerified) {
    report += `REAL VERTEX PARTIAL / FALLBACK DETECTED`;
  } else {
    report += `REAL VERTEX NOT VERIFIED`;
  }
  
  fs.writeFileSync('REAL_VERTEX_LIVE_VALIDATION_REPORT.md', report);
  
  console.log('\n=== FINAL RESULTS ===');
  console.log('All used vertex:', allVertex);
  console.log('All verified:', allVerified);
  console.log('All returned chunks:', allChunks);
  console.log('No fallback:', noFallback);
  
  return {
    allVertex,
    allVerified,
    allChunks,
    noFallback,
    verdict: allVertex && allVerified && allChunks && noFallback ? 'REAL VERTEX LIVE VERIFIED' : 
             allVertex && !allVerified ? 'REAL VERTEX PARTIAL / FALLBACK DETECTED' : 
             'REAL VERTEX NOT VERIFIED'
  };
}

runRealVertexValidation().then(result => {
  console.log(`\nFinal verdict: ${result.verdict}`);
});
