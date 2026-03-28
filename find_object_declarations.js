const fs = require('fs');
const content = fs.readFileSync('orchestrator.js', 'utf8');
const lines = content.split('\n');
console.log('=== FINDING ACTUAL OBJECT DECLARATIONS ===');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.startsWith('const finalDecision = {')) {
    console.log(`Line ${i + 1}: ${line}`);
    // Show context
    for (let j = Math.max(0, i - 2); j <= Math.min(lines.length - 1, i + 10); j++) {
      console.log(`${j + 1}: ${lines[j]}`);
    }
    console.log('=== END OF OBJECT ===');
  }
}
