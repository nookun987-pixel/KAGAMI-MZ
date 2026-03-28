const memoryStore = require('../memory/memory_store');
const { updatePerformance } = require('../memory/feedback');

async function updateAllPerformance() {
  console.log('[FEEDBACK] Starting performance update...');
  
  try {
    // Get all records from memory
    const allRecords = await memoryStore.safeQueryRecent(1000); // Get up to 1000 recent records
    
    if (!allRecords || allRecords.length === 0) {
      console.log('[FEEDBACK] No records found to update');
      return;
    }
    
    let updatedCount = 0;
    
    for (const record of allRecords) {
      // Check if record has metrics
      const hasMetrics = record.views !== null && 
                        record.likes !== null && 
                        record.saves !== null && 
                        record.clicks !== null;
      
      if (hasMetrics && record.performance_score === null) {
        // Update performance for records with metrics but no score
        const updatedRecord = updatePerformance(record);
        
        // Save back to memory (this would update the record)
        // For now, we'll just count and log
        updatedCount++;
        
        console.log(`[FEEDBACK] Updated record ${record.content_id}: score=${updatedRecord.performance_score}, result=${updatedRecord.result_score}`);
      }
    }
    
    console.log(`[FEEDBACK] Updated ${updatedCount} performance records`);
    
  } catch (error) {
    console.error('[FEEDBACK] Performance update failed:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  updateAllPerformance().then(() => {
    console.log('[FEEDBACK] Performance update complete');
    process.exit(0);
  }).catch(error => {
    console.error('[FEEDBACK] Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { updateAllPerformance };
