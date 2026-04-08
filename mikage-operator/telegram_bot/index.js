require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const router = require('./router');

const token = process.env.TELEGRAM_BOT_TOKEN;
const allowedChatId = process.env.TELEGRAM_ALLOWED_CHAT_ID;

if (!token || !allowedChatId) {
  console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_ALLOWED_CHAT_ID in .env');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  if (msg.chat.id.toString() !== allowedChatId) {
    console.log(`Ignored message from unauthorized chat: ${msg.chat.id}`);
    return;
  }
  router.handleMessage(bot, msg);
});

console.log('Mikage Operator Bot started');