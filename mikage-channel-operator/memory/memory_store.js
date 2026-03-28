const fs = require('fs');
const path = require('path');
const config = require('../config');

const LOCAL_MEMORY_FILE = path.join(__dirname, '../data/content_memory.json');

class MemoryStore {
  constructor() {
    this.ensureLocalFile();
  }

  ensureLocalFile() {
    if (!fs.existsSync(LOCAL_MEMORY_FILE)) {
      fs.writeFileSync(LOCAL_MEMORY_FILE, JSON.stringify({ records: [] }, null, 2));
    }
  }

  loadLocalMemory() {
    try {
      const data = fs.readFileSync(LOCAL_MEMORY_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.warn('[MEMORY] Local file corrupted, creating new');
      return { records: [] };
    }
  }

  saveLocalMemory(data) {
    try {
      fs.writeFileSync(LOCAL_MEMORY_FILE, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('[MEMORY] Failed to save local:', error.message);
      return false;
    }
  }

  async saveContent(record) {
    const enrichedRecord = {
      content_id: record.content_id || this.generateId(),
      date: record.date || new Date().toISOString().split('T')[0],
      channel: record.channel || 'default',
      content_type: record.content_type || record.type || 'unknown',
      content_text: record.content_text || record.body || record.slides?.join(' ') || '',
      topic: record.topic || 'general',
      angle: record.angle || 'neutral',
      hook_type: record.hook_type || 'question',
      hook_used: record.hook_used || record.hook || '',
      views: record.views || null,
      likes: record.likes || null,
      saves: record.saves || null,
      clicks: record.clicks || null,
      performance_score: record.performance_score || null,
      result_score: record.result_score || '',
      ...record
    };

    if (config.USE_NOTION) {
      try {
        const { saveToNotion } = require('../services/notion');
        await saveToNotion({ contents: [enrichedRecord] });
        console.log('[MEMORY] ✓ Saved to Notion');
        return true;
      } catch (err) {
        console.warn(`[MEMORY] Notion failed: ${err.message}. Falling back to local.`);
      }
    }

    const localData = this.loadLocalMemory();
    localData.records.push(enrichedRecord);
    const saved = this.saveLocalMemory(localData);
    if (saved) {
      console.log('[MEMORY] ✓ Saved to local');
    }
    return saved;
  }

  async safeQueryRecent(limit = 20) {
    if (config.USE_NOTION) {
      try {
        // Notion implementation would go here
        // For now, fallback to local
      } catch (err) {
        console.warn(`[MEMORY] Notion query failed: ${err.message}`);
      }
    }

    const localData = this.loadLocalMemory();
    return localData.records
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }

  async safeQueryByTopic(topic, limit = 10) {
    if (config.USE_NOTION) {
      try {
        // Notion implementation would go here
      } catch (err) {
        console.warn(`[MEMORY] Notion query failed: ${err.message}`);
      }
    }

    const localData = this.loadLocalMemory();
    return localData.records
      .filter(record => record.topic === topic)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }

  async safeQueryTopPerformers(limit = 10) {
    if (config.USE_NOTION) {
      try {
        // Notion implementation would go here
      } catch (err) {
        console.warn(`[MEMORY] Notion query failed: ${err.message}`);
      }
    }

    const localData = this.loadLocalMemory();
    return localData.records
      .filter(record => record.performance_score !== null && record.performance_score > 0)
      .sort((a, b) => b.performance_score - a.performance_score)
      .slice(0, limit);
  }

  async safeQueryLowPerformers(limit = 10) {
    if (config.USE_NOTION) {
      try {
        // Notion implementation would go here
      } catch (err) {
        console.warn(`[MEMORY] Notion query failed: ${err.message}`);
      }
    }

    const localData = this.loadLocalMemory();
    return localData.records
      .filter(record => record.performance_score !== null && record.performance_score < 0.1)
      .sort((a, b) => a.performance_score - b.performance_score)
      .slice(0, limit);
  }

  generateId() {
    return 'content_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = new MemoryStore();
