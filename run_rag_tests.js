const fs = require('fs');
const { spawn } = require('child_process');

async function runRagTest(jobFile) {
  console.log(`\n=== RUNNING RAG TEST: ${jobFile} ===`);
  
  return new Promise((resolve) => {
    const child = spawn('node', ['orchestrator.js', jobFile], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: __dirname
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      process.stdout.write(output);
    });
    
    child.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      process.stderr.write(output);
    });
    
    child.on('close', (code) => {
      console.log(`\n--- ${jobFile} completed with code ${code} ---`);
      
      // Extract job ID from file
      const jobData = JSON.parse(fs.readFileSync(jobFile, 'utf8'));
      const jobId = jobData.job_id;
      
      // Check RAG artifact
      const ragPath = `runs/${jobId}/rag_context.json`;
      let ragData = null;
      let ragExists = false;
      
      if (fs.existsSync(ragPath)) {
        ragExists = true;
        ragData = JSON.parse(fs.readFileSync(ragPath, 'utf8'));
      }
      
      // Check Gemini intake for context
      const intakePath = `runs/${jobId}/gemini_intake.json`;
      let intakeHasContext = false;
      
      if (fs.existsSync(intakePath)) {
        const intakeData = JSON.parse(fs.readFileSync(intakePath, 'utf8'));
        intakeHasContext = intakeData.prompt && intakeData.prompt.includes('=== MIKAGE MEMORY CONTEXT ===');
      }
      
      resolve({
        jobFile,
        jobId,
        exitCode: code,
        ragExists,
        ragData,
        intakeHasContext,
        stdout,
        stderr
      });
    });
    
    child.on('error', (error) => {
      console.error(`Process error for ${jobFile}:`, error);
      resolve({
        jobFile,
        jobId: 'unknown',
        exitCode: -1,
        ragExists: false,
        ragData: null,
        intakeHasContext: false,
        error: error.message
      });
    });
  });
}

async function runAllTests() {
  const tests = [
    'rag_test_mask.json',
    'rag_test_weapon.json', 
    'rag_test_stable.json'
  ];
  
  const results = [];
  
  for (const test of tests) {
    if (fs.existsSync(test)) {
      const result = await runRagTest(test);
      results.push(result);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log(`Test file not found: ${test}`);
    }
  }
  
  // Generate report
  console.log('\n=== RAG VALIDATION REPORT ===');
  
  let report = '# RAG LIVE VALIDATION REPORT\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;
  
  results.forEach(result => {
    report += `## Test: ${result.jobFile}\n`;
    report += `- Job ID: ${result.jobId}\n`;
    report += `- Exit Code: ${result.exitCode}\n`;
    report += `- RAG Artifact Exists: ${result.ragExists}\n`;
    
    if (result.ragData) {
      report += `- RAG Executed: ${result.ragData.rag_executed}\n`;
      report += `- Chunks Returned: ${result.ragData.chunks_returned}\n`;
      report += `- Query: "${result.ragData.query_used}"\n`;
      report += `- Sources: ${result.ragData.sources.length}\n`;
      if (result.ragData.error) {
        report += `- Error: ${result.ragData.error}\n`;
      }
    }
    
    report += `- Gemini Intake Has Context: ${result.intakeHasContext}\n`;
    report += `\n`;
  });
  
  // Summary
  const successfulRag = results.filter(r => r.ragData && r.ragData.rag_executed && r.ragData.chunks_returned > 0).length;
  const contextInjected = results.filter(r => r.intakeHasContext).length;
  
  report += `## Summary\n`;
  report += `- Tests Run: ${results.length}\n`;
  report += `- RAG Successful: ${successfulRag}/${results.length}\n`;
  report += `- Context Injected: ${contextInjected}/${results.length}\n`;
  report += `- Success Rate: ${Math.round((successfulRag / results.length) * 100)}%\n`;
  
  fs.writeFileSync('RAG_LIVE_VALIDATION_REPORT.md', report);
  console.log('Report written to RAG_LIVE_VALIDATION_REPORT.md');
  
  console.log('\n=== FINAL SUMMARY ===');
  console.log(`RAG Successful: ${successfulRag}/${results.length}`);
  console.log(`Context Injected: ${contextInjected}/${results.length}`);
  console.log(`Success Rate: ${Math.round((successfulRag / results.length) * 100)}%`);
}

runAllTests().catch(console.error);
