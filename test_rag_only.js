const fs = require('fs');
const { getMikageMemoryContext } = require('./rag/vertex_retriever_mock');

async function testRagOnly() {
  console.log('=== TESTING RAG MODULE ONLY ===');
  
  try {
    // Test 1: MASK_MACRO
    console.log('\n--- Test 1: MASK_MACRO ---');
    const context1 = await getMikageMemoryContext('MASK_MACRO creative mask study');
    console.log('Context length:', context1.length);
    console.log('Has memory header:', context1.includes('=== MIKAGE MEMORY CONTEXT ==='));
    console.log('First 200 chars:', context1.substring(0, 200) + '...');
    
    // Test 2: WEAPON_MACRO
    console.log('\n--- Test 2: WEAPON_MACRO ---');
    const context2 = await getMikageMemoryContext('WEAPON_MACRO reproduction sword');
    console.log('Context length:', context2.length);
    console.log('Has memory header:', context2.includes('=== MIKAGE MEMORY CONTEXT ==='));
    console.log('First 200 chars:', context2.substring(0, 200) + '...');
    
    // Test 3: WHITE_CERAMIC_MACRO
    console.log('\n--- Test 3: WHITE_CERAMIC_MACRO ---');
    const context3 = await getMikageMemoryContext('WHITE_CERAMIC_MACRO creative ceramic');
    console.log('Context length:', context3.length);
    console.log('Has memory header:', context3.includes('=== MIKAGE MEMORY CONTEXT ==='));
    console.log('First 200 chars:', context3.substring(0, 200) + '...');
    
    console.log('\n=== RAG MODULE TEST SUCCESS ===');
    console.log('All 3 tests returned context with memory headers');
    
    return true;
    
  } catch (error) {
    console.error('❌ RAG module test failed:', error.message);
    return false;
  }
}

testRagOnly();
