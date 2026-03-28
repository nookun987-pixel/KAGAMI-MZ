const memoryStore = require('./memory_store');

async function retrieveContext({ topic, channel }) {
  try {
    const recent = await memoryStore.safeQueryRecent(20);
    const sameTopic = await memoryStore.safeQueryByTopic(topic, 10);
    const winners = await memoryStore.safeQueryTopPerformers(10);
    const losers = await memoryStore.safeQueryLowPerformers(10);

    // Extract hooks from winners and losers
    const hooksToReuse = winners
      .filter(item => item.hook_used && item.hook_used.trim())
      .map(item => item.hook_used)
      .slice(0, 5);

    const hooksToAvoid = losers
      .filter(item => item.hook_used && item.hook_used.trim())
      .map(item => item.hook_used)
      .slice(0, 5);

    // Extract losing angles to avoid
    const anglesToAvoid = losers
      .filter(item => item.angle && item.angle.trim())
      .map(item => item.angle)
      .slice(0, 3);

    // Extract structure signatures for anti-repeat
    const structuresSeen = recent
      .map(item => {
        const text = item.content_text || '';
        const words = text.toLowerCase().split(/\s+/).slice(0, 10);
        return words.join('_');
      })
      .slice(0, 5);

    const context = {
      recent,
      sameTopic,
      winners,
      losers,
      hooksToReuse,
      hooksToAvoid,
      anglesToAvoid,
      structuresSeen
    };

    console.log(`[MEMORY] recent=${recent.length} sameTopic=${sameTopic.length} winners=${winners.length} losers=${losers.length}`);
    return context;

  } catch (error) {
    console.error('[MEMORY] Retrieval failed:', error.message);
    // Return empty context on failure
    return {
      recent: [],
      sameTopic: [],
      winners: [],
      losers: [],
      hooksToReuse: [],
      hooksToAvoid: [],
      anglesToAvoid: [],
      structuresSeen: []
    };
  }
}

module.exports = { retrieveContext };
