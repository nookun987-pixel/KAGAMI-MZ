async function getProjectStatus() {
  try {
    // Load project status from shared state
    const { getTasks } = require('./shared_state');
    const tasks = getTasks();
    
    const openTasks = tasks.filter(t => t.status === 'NEW' || t.status === 'QUEUED');
    const blockedTasks = tasks.filter(t => t.status === 'BLOCKED');
    const runningTasks = tasks.filter(t => t.status === 'RUNNING');
    const recentTasks = tasks.filter(t => t.status === 'DONE').slice(-5);
    
    return `PROJECT STATUS:

📋 OPEN TASKS: ${openTasks.length}
${openTasks.map(t => 
  `  🆕 ${t.task_id}: ${t.title}`
).join('\n')}

🚧 BLOCKED TASKS: ${blockedTasks.length}
${blockedTasks.map(t => 
  `  🛑 ${t.task_id}: ${t.title} - ${t.blocker}`
).join('\n')}

🔄 RUNNING TASKS: ${runningTasks.length}
${runningTasks.map(t => 
  `  ⚡ ${t.task_id}: ${t.title}`
).join('\n')}

✅ RECENT COMPLETIONS:
${recentTasks.map(t => 
  `  ✅ ${t.task_id}: ${t.title} (${t.updated_at})`
).join('\n')}

📊 SUMMARY:
  Total Tasks: ${tasks.length}
  Success Rate: ${tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100) : 0}%
  Avg Duration: N/A`;
    
  } catch (error) {
    return `PROJECT STATUS ERROR: ${error.message}`;
  }
}

module.exports = { getProjectStatus };
