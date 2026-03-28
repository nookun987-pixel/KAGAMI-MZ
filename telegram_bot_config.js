require('dotenv').config({ path: __dirname + '/.env' });

module.exports = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || undefined,
  MODEL_NAME: process.env.MODEL_NAME || 'gpt-4o-mini',
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_DB_ID: process.env.NOTION_DB_ID,
  USE_NOTION: !!(process.env.NOTION_API_KEY && process.env.NOTION_DB_ID),
};
