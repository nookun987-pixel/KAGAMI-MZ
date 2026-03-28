require('dotenv').config();
console.log('[BOT] dotenv loaded');

if (global.__MIKAGE_BOT_STARTED__) {
    console.log('[BOT] Already running, exiting');
    process.exit(0);
}
global.__MIKAGE_BOT_STARTED__ = true;
console.log('[BOT] Startup guard set');

const TelegramBot = require('node-telegram-bot-api');
console.log('[BOT] TelegramBot module loaded');
const router = require('./router');
console.log('[BOT] router loaded');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
console.log('[BOT] TOKEN exists:', !!TOKEN);
const ALLOWED_IDS = process.env.TELEGRAM_ALLOWED_CHAT_IDS?.split(',').map(id => id.trim()) || [];
console.log('[BOT] ALLOWED_IDS:', ALLOWED_IDS);

if (!TOKEN) {
    console.error('[BOT] TELEGRAM_BOT_TOKEN missing');
    process.exit(1);
}

console.log('[BOT] Creating TelegramBot instance...');
const bot = new TelegramBot(TOKEN, { polling: true });
console.log('[BOT] TelegramBot instance created');

const isAuthorized = (chatId) => {
    if (ALLOWED_IDS.length === 0) return true;
    return ALLOWED_IDS.includes(String(chatId));
};

let messageCount = 0;
let sendCount = 0;

console.log('[BOT] BOT_INSTANCE_CREATED');
console.log('[BOT] MESSAGE_LISTENER_REGISTERED');

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || '';
    const msgId = msg.message_id;
    messageCount++;
    console.log(`[BOT] Message #${messageCount} received: msgId=${msgId} chatId=${chatId} text="${text}"`);

    if (!text.startsWith('/')) {
        console.log(`[BOT] Message #${messageCount} ignored: not a command`);
        return;
    }

    if (!isAuthorized(chatId)) {
        console.log(`[BOT] Message #${messageCount} rejected: unauthorized chatId=${chatId}`);
        return;
    }

    console.log(`[BOT] Message #${messageCount} authorized: processing command`);

    try {
        const reply = await router.handleCommand(text, msg);
        console.log(`[BOT] Message #${messageCount} router returned: "${reply?.substring(0, 50)}..."`);
        if (reply) {
            sendCount++;
            console.log(`[BOT] SEND_MESSAGE_CALLED msgId=${msgId} sendCount=${sendCount}`);
            console.log(`[BOT] Message #${messageCount} sending reply #${sendCount} to chatId=${chatId}`);
            await bot.sendMessage(chatId, reply, { parse_mode: 'Markdown' });
            console.log(`[BOT] Message #${messageCount} reply #${sendCount} sent successfully`);
        } else {
            console.log(`[BOT] Message #${messageCount} no reply to send`);
        }
    } catch (err) {
        sendCount++;
        console.log(`[BOT] SEND_MESSAGE_CALLED msgId=${msgId} sendCount=${sendCount} (error path)`);
        console.log(`[BOT] Message #${messageCount} ERROR sending reply #${sendCount}: ${err.message}`);
        await bot.sendMessage(chatId, `ERR: ${err.message}`);
    }
});

bot.on('polling_error', (err) => {
    console.error('[BOT] Polling error:', err.message);
});

console.log('[BOT] Mikage Operator Bot active');
module.exports = bot;