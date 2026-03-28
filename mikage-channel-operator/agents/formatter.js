const fs = require('fs');
const path = require('path');
const config = require('../config');

const PROMPT = fs.readFileSync(path.join(__dirname, '../prompts/formatter_prompt.txt'), 'utf-8');

async function format(extractedData, openai) {
  const fullPrompt = PROMPT + '\n' + JSON.stringify(extractedData, null, 2);

  const res = await openai.chat.completions.create({
    model: config.MODEL_NAME,
    messages: [{ role: 'user', content: fullPrompt }],
    temperature: 0.5,
  });

  const raw = res.choices[0].message.content.trim();
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed.contents)) {
    throw new Error('Formatter output missing contents array');
  }

  const shortPosts = parsed.contents.filter(c => c.type === 'short_post');
  const carousels = parsed.contents.filter(c => c.type === 'carousel');
  const captions = parsed.contents.filter(c => c.type === 'caption');

  console.log(`[FORMATTER] ✓ ${shortPosts.length} short_posts, ${carousels.length} carousels, ${captions.length} captions`);
  return parsed;
}

module.exports = { format };
