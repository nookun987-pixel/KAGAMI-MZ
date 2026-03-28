async function getCostStatus() {
  try {
    // Load cost data from shared state
    const { getCostData } = require('./shared_state');
    const costData = getCostData();
    
    const today = new Date().toISOString().split('T')[0];
    const todayCost = costData.filter(c => c.date === today)
      .reduce((sum, c) => sum + (c.amount || 0), 0);
    
    // Calculate week and month (simplified)
    const weekCost = costData
      .filter(c => {
        const costDate = new Date(c.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return costDate >= weekAgo;
      })
      .reduce((sum, c) => sum + (c.amount || 0), 0);
    
    const monthCost = costData
      .filter(c => {
        const costDate = new Date(c.date);
        const currentMonth = costDate.getMonth();
        const currentYear = costDate.getFullYear();
        const now = new Date();
        return currentMonth === now.getMonth() && currentYear === now.getFullYear();
      })
      .reduce((sum, c) => sum + (c.amount || 0), 0);
    
    // Top spenders
    const topSpenders = costData
      .filter(c => c.category === 'API')
      .sort((a, b) => (b.amount || 0) - (a.amount || 0))
      .slice(0, 3);
    
    return `COST STATUS:

💰 TODAY: $${todayCost.toFixed(4)}
📅 THIS WEEK: $${weekCost.toFixed(4)}  
📆 THIS MONTH: $${monthCost.toFixed(4)}

🔝 TOP SPENDERS:
${topSpenders.map(s => 
  `  ${s.provider || 'API'}: $${(s.amount || 0).toFixed(4)} (${s.description})`
).join('\n')}

📊 BREAKDOWN:
  API Costs: $${costData.filter(c => c.category === 'API').reduce((sum, c) => sum + (c.amount || 0), 0).toFixed(4)}
  Compute: $${costData.filter(c => c.category === 'COMPUTE').reduce((sum, c) => sum + (c.amount || 0), 0).toFixed(4)}
  Recurring: $${costData.filter(c => c.category === 'RECURRING').reduce((sum, c) => sum + (c.amount || 0), 0).toFixed(4)}

⚠️  ALERTS: ${costData.filter(c => c.amount > 1).length} high-cost transactions`;
    
  } catch (error) {
    return `COST STATUS ERROR: ${error.message}`;
  }
}

module.exports = { getCostStatus };
