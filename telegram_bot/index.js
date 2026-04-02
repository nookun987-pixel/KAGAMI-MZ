const TelegramBot = require('node-telegram-bot-api');
const config = require('../telegram_bot_config');
const router = require('./router');
const guard = require('./duplicate_guard');

const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

console.log('[TELEGRAM] Mikage Operator Bot starting...');
console.log('[TELEGRAM] Duplicate guard active:', guard.getGuardStatus());

function logStep(command, step, chatId, msgId, extra = '') {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${command}] [${step}] chatId=${chatId} msgId=${msgId} ${extra}`);
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || '';
  const msgId = msg.message_id;
  
  // GUARD: Check if message already processed (duplicate detection)
  if (guard.isMessageProcessed(msgId)) {
    logStep('DUPLICATE', 'REJECTED_ALREADY_PROCESSED', chatId, msgId);
    return;
  }
  
  // Mark this message as being processed immediately
  guard.markMessageProcessed(msgId);
  
  // Only process commands
  if (!text.startsWith('/')) return;
  
  // Extract command (remove @botname if present)
  const command = text.split(' ')[0].split('@')[0];
  
  logStep(command, 'COMMAND_RECEIVED', chatId, msgId, `text="${text}"`);
  
  // Check if it's one of our new commands
  const newCommands = ['/boot', '/heal', '/proof', '/master_status', '/start_all', '/stop_all', '/restart_all'];
  if (newCommands.includes(command)) {
    logStep(command, 'COMMAND_MATCHED_NEW', chatId, msgId);
  }
  
  try {
    logStep(command, 'HANDLER_START', chatId, msgId);
    
    const response = await router.handleCommand(text, msg);
    
    logStep(command, 'HANDLER_SUCCESS', chatId, msgId, `response_length=${response ? response.length : 0}`);
    
    if (response) {
      logStep(command, 'SEND_MESSAGE_START', chatId, msgId);
      await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
      logStep(command, 'SEND_MESSAGE_SUCCESS', chatId, msgId);
    } else {
      logStep(command, 'NO_RESPONSE_TO_SEND', chatId, msgId);
    }
  } catch (error) {
    logStep(command, 'HANDLER_ERROR', chatId, msgId, `error="${error.message}"`);
    console.error(`[${command}] Full error:`, error);
    
    try {
      await bot.sendMessage(chatId, `ERROR: ${error.message}`);
      logStep(command, 'SEND_ERROR_MESSAGE_SUCCESS', chatId, msgId);
    } catch (sendError) {
      logStep(command, 'SEND_ERROR_MESSAGE_FAILED', chatId, msgId, `error="${sendError.message}"`);
    }
  }
});

bot.on('polling_error', (error) => {
  console.error('[TELEGRAM] Polling error:', error);
});

console.log('[TELEGRAM] Bot ready and listening for commands');

module.exports = { bot };
