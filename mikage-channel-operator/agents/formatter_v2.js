const fs = require('fs');
const path = require('path');
const config = require('../config');

const PROMPT = fs.readFileSync(path.join(__dirname, '../prompts/formatter_v2_prompt.txt'), 'utf-8');

async function format(source, memory, openai) {
  const memoryContext = {
    recentCount: memory.recent.length,
    sameTopicCount: memory.sameTopic.length,
    winnersCount: memory.winners.length,
    losersCount: memory.losers.length,
    hooksToReuse: memory.hooksToReuse.slice(0, 3),
    hooksToAvoid: memory.hooksToAvoid.slice(0, 3),
    anglesToAvoid: memory.anglesToAvoid.slice(0, 2),
    structuresSeen: memory.structuresSeen.slice(0, 3)
  };

  const fullPrompt = PROMPT 
    + '\n\nSOURCE TEXT:\n' + source
    + '\n\nMEMORY CONTEXT:\n' + JSON.stringify(memoryContext, null, 2);

  try {
    const res = await openai.chat.completions.create({
      model: config.MODEL_NAME,
      messages: [{ role: 'user', content: fullPrompt }],
      temperature: 0.7,
    });

    const raw = res.choices[0].message.content.trim();
    
    // Remove markdown if present
    let cleanRaw = raw;
    if (raw.startsWith('```json')) {
      cleanRaw = raw.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (raw.startsWith('```')) {
      cleanRaw = raw.replace(/```\s*/, '').replace(/```\s*$/, '');
    }
    
    // Hard JSON parse guard
    let parsed;
    try {
      parsed = JSON.parse(cleanRaw);
    } catch (parseError) {
      console.warn('[FORMATTER_V2] Invalid JSON, attempting repair...');
      
      // Retry with repair prompt
      const repairPrompt = `Fix this JSON to be valid. Return ONLY the contents array JSON, no markdown:\n${cleanRaw}`;
      const repairRes = await openai.chat.completions.create({
        model: config.MODEL_NAME,
        messages: [{ role: 'user', content: repairPrompt }],
        temperature: 0.1,
      });
      
      const repairedRaw = repairRes.choices[0].message.content.trim();
      const cleanRepaired = repairedRaw.startsWith('```json') ? 
        repairedRaw.replace(/```json\s*/, '').replace(/```\s*$/, '') : repairedRaw;
      
      // Try to parse as full object first
      try {
        parsed = JSON.parse(cleanRepaired);
      } catch (secondError) {
        // If that fails, try to parse as just the contents array
        try {
          const contentsArray = JSON.parse(cleanRepaired);
          parsed = { contents: contentsArray };
        } catch (thirdError) {
          throw new Error(`JSON repair failed: ${thirdError.message}`);
        }
      }
    }

    // Validate structure
    if (!parsed.contents || !Array.isArray(parsed.contents)) {
      throw new Error('Invalid formatter output: missing contents array');
    }

    // Ensure each content item has required fields for validator compatibility
    const enrichedContents = parsed.contents.map((item, index) => {
      const enriched = {
        content_type: item.content_type || item.type,
        content_text: item.content_text || item.body || item.slides?.join(' ') || '',
        topic: item.topic || 'general',
        angle: item.angle || 'neutral',
        hook_type: item.hook_type || 'question',
        hook_used: item.hook_used || item.hook || '',
        status: item.status || 'ready',
        ...item
      };

      // Preserve legacy fields for validator compatibility
      if (item.type && !item.content_type) enriched.type = item.type;
      if (item.hook && !item.hook_used) enriched.hook = item.hook;
      if (item.body && !item.content_text) enriched.body = item.body;
      if (item.cta) enriched.cta = item.cta;
      if (item.slides) enriched.slides = item.slides;

      return enriched;
    });

    // Normalize carousel slide counts
    const normalizedContents = enrichedContents.map((item, index) => {
      if (item.type === "carousel" && Array.isArray(item.slides)) {
        if (item.slides.length !== 7) {
          console.log(`[FORMATTER_V2] fixing carousel[${index}] from ${item.slides.length} -> 7`);

          if (item.slides.length > 7) {
            item.slides = item.slides.slice(0, 7);
          } else {
            const last = item.slides[item.slides.length - 1];
            while (item.slides.length < 7) {
              item.slides.push(last);
            }
          }
        } else {
          console.log(`[FORMATTER_V2] carousel[${index}] already 7`);
        }
      }

      return item;
    });

    console.log(`[FORMATTER_V2] generated=${normalizedContents.length}`);
    
    return {
      contents: normalizedContents
    };

  } catch (error) {
    console.error('[FORMATTER_V2] Error:', error.message);
    throw new Error(`Formatter v2 failed: ${error.message}`);
  }
}

module.exports = { format };
