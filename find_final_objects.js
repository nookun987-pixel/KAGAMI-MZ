const fs = require('fs');
const content = fs.readFileSync('orchestrator.js', 'utf8');
const lines = content.split('\n');
console.log('=== FINDING FINAL DECISION OBJECT CREATION ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('finalDecision') && lines[i].includes('{')) {
    console.log(`Line ${i + 1}: ${lines[i]}`);
    // Show context
    for (let j = Math.max(0, i - 2); j <= Math.min(lines.length - 1, i + 5); j++) {
      console.log(`${j + 1}: ${lines[j]}`);
    }
    console.log('---');
  }
}
