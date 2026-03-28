const fs = require('fs');
const content = fs.readFileSync('orchestrator.js', 'utf8');
const lines = content.split('\n');
console.log('=== FINAL DECISION REFERENCES ===');
lines.forEach((line, i) => {
  if (line.includes('finalDecision')) {
    console.log(`${i + 1}: ${line}`);
  }
});
