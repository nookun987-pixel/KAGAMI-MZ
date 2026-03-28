const fs = require('fs');
const path = require('path');
const config = require('../config');

const PROMPT = fs.readFileSync(path.join(__dirname, '../prompts/validator_prompt.txt'), 'utf-8');

async function validate(formattedData, sourceText, openai) {
  const fullPrompt = PROMPT + '\n' + JSON.stringify(formattedData, null, 2) +
    '\n\nSOURCE DATA (để cross-check):\n' + sourceText;

  const res = await openai.chat.completions.create({
    model: config.MODEL_NAME,
    messages: [{ role: 'user', content: fullPrompt }],
    temperature: 0.2,
  });

  const raw = res.choices[0].message.content.trim();
  const parsed = JSON.parse(raw);

  if (typeof parsed.pass !== 'boolean') {
    throw new Error('Validator output missing pass field');
  }

  console.log(`[VALIDATOR] ${parsed.pass ? '✓ PASS' : '✗ FAIL'} ${parsed.reason || ''}`);
  return parsed;
}

module.exports = { validate };
