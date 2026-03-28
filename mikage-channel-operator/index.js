const OpenAI = require('openai');
const config = require('./config');
const { extract } = require('./agents/extractor');
const { format: formatV1 } = require('./agents/formatter');
const { format } = require('./agents/formatter_v2');
const { validate } = require('./agents/validator');
const { saveLocal } = require('./services/storage');
const { retrieveContext } = require('./memory/retriever');
const memoryStore = require('./memory/memory_store');
const { isDuplicate } = require('./memory/dedup');
const fs = require('fs');

async function main() {
  // Parse input
  const args = process.argv.slice(2);
  let sourceText = '';

  for (const arg of args) {
    if (arg.startsWith('--input=')) {
      sourceText = arg.slice('--input='.length);
    } else if (arg.startsWith('--file=')) {
      const filePath = arg.slice('--file='.length);
      sourceText = fs.readFileSync(filePath, 'utf-8');
    }
  }

  if (!sourceText.trim()) {
    console.error('Usage: node index.js --input="your source text" OR --file=path/to/source.txt');
    process.exit(1);
  }

  if (!config.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY in .env');
    process.exit(1);
  }

  const openaiOpts = { apiKey: config.OPENAI_API_KEY };
  if (config.OPENAI_BASE_URL) openaiOpts.baseURL = config.OPENAI_BASE_URL;
  const openai = new OpenAI(openaiOpts);

  console.log('=== MIKAGE CHANNEL OPERATOR v2 ===');
  console.log(`Model: ${config.MODEL_NAME}`);
  console.log(`Input: ${sourceText.slice(0, 80)}...`);
  console.log('');

  // Extract topic and channel for memory retrieval
  const topic = extractTopic(sourceText);
  const channel = 'default'; // Could be parameterized later

  // STEP 1 — RETRIEVAL
  console.log('[STEP 1] Retrieving memory context...');
  const memory = await retrieveContext({ topic, channel });

  // STEP 2 — EXTRACT
  console.log('[STEP 2] Extracting insights, hooks, proofs...');
  const extracted = await extract(sourceText, openai);

  // STEP 3 — FORMAT WITH MEMORY
  console.log('[STEP 3] Formatting content with memory...');
  const formatted = await format(extracted, memory, openai);

  // STEP 3.5 — FIX COUNT CONSISTENCY
  console.log('[STEP 3.5] Fixing count consistency...');
  for (const content of formatted.contents) {
    if (content.content_type === 'carousel' && content.slides) {
      const actualCount = content.slides.length;
      // Fix content_text
      content.content_text = content.content_text.replace(/(\d+)/g, actualCount);
      // Fix hook_used
      if (content.hook_used) {
        content.hook_used = content.hook_used.replace(/(\d+)/g, actualCount);
      }
      // Fix slides text (replace numbers that are not slide indices)
      content.slides = content.slides.map((slide, index) => {
        return slide.replace(/(\d+)/g, (match, num) => {
          const n = parseInt(num);
          if (n === index + 1) return num; // keep slide number like "Slide 1:"
          return actualCount.toString();
        });
      });
    }
  }
  console.log('[STEP 3.5] ✓ Count consistency fixed');

  // STEP 4 — VALIDATE
  console.log('[STEP 4] Validating...');
  const validation = await validate(formatted, sourceText, openai);

  if (!validation.pass) {
    console.error(`\n✗ REJECTED: ${validation.reason}`);
    // Save rejection log
    saveLocal({
      status: 'rejected',
      reason: validation.reason,
      extracted,
      formatted,
    });
    process.exit(2);
  }

  // STEP 5 — DEDUP CHECK
  console.log('[STEP 5] Checking for duplicates...');
  const recentItems = await memoryStore.safeQueryRecent(50);
  const validContents = [];
  let duplicateCount = 0;

  for (const content of formatted.contents) {
    if (isDuplicate(content, recentItems)) {
      duplicateCount++;
      console.log(`[DEDUP] Rejected duplicate: ${content.hook_used || content.content_text?.slice(0, 50)}...`);
    } else {
      validContents.push(content);
    }
  }

  console.log(`[DEDUP] rejected=${duplicateCount}, kept=${validContents.length}`);

  // STEP 6 — SAVE
  console.log('[STEP 6] Saving...');
  const finalData = { ...formatted, contents: validContents };

  // Save to local output.json (preserve v1 behavior)
  saveLocal({ status: 'ready', ...finalData });

  // Save to memory store (new v2 behavior)
  for (const content of validContents) {
    await memoryStore.saveContent({
      ...content,
      topic,
      channel,
      date: new Date().toISOString().split('T')[0]
    });
  }

  // STEP 7 — FEEDBACK UPDATE (if metrics exist)
  const { updateAllPerformance } = require('./jobs/update_performance');
  try {
    await updateAllPerformance();
  } catch (err) {
    console.warn('[FEEDBACK] Update failed:', err.message);
  }

  console.log('\n✓ DONE — Content pipeline complete');
  console.log(JSON.stringify(formatted, null, 2));
}

function extractTopic(text) {
  // Simple topic extraction - could be enhanced
  const words = text.toLowerCase().split(/\s+/);
  const keywords = words.filter(word => word.length > 5).slice(0, 3);
  return keywords.join('_') || 'general';
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
