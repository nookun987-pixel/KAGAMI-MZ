const fs = require('fs');
const path = require('path');
const config = require('../config');

const PROMPT = fs.readFileSync(path.join(__dirname, '../prompts/extractor_prompt.txt'), 'utf-8');

async function extract(sourceText, openai) {
  const fullPrompt = PROMPT + '\n' + sourceText;

  const res = await openai.chat.completions.create({
    model: config.MODEL_NAME,
    messages: [{ role: 'user', content: fullPrompt }],
    temperature: 0.4,
  });

  const raw = res.choices[0].message.content.trim();
  const parsed = JSON.parse(raw);

  // Validate structure
  if (!Array.isArray(parsed.insights) || !Array.isArray(parsed.hooks) || !Array.isArray(parsed.proofs)) {
    throw new Error('Extractor output missing required arrays: insights, hooks, proofs');
  }

  console.log(`[EXTRACTOR] ✓ ${parsed.insights.length} insights, ${parsed.hooks.length} hooks, ${parsed.proofs.length} proofs`);
  return parsed;
}

module.exports = { extract };
