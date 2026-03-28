const brain = require('./brain');
const approval = require('./approval');
const stateStore = require('./state_store');
const executor = require('../executor/local_executor');

function handleMessage(bot, msg) {
  const text = msg.text || '';
  const chatId = msg.chat.id;

  if (text.startsWith('/')) {
    const parts = text.split(' ');
    const cmd = parts[0];
    switch (cmd) {
      case '/help':
        bot.sendMessage(chatId, 'Commands:\n/help - Show this help\n/status - Show current status\n/run content - Run content command\n/log last - Show last log\n/retry last - Retry last job\n/memory last - Show last memory\n/approve - Approve pending action\n/reject - Reject pending action');
        break;
      case '/status':
        const status = stateStore.getStatus();
        bot.sendMessage(chatId, `Status:\n${status}`);
        break;
      case '/run':
        const name = parts[1];
        if (!name) {
          bot.sendMessage(chatId, 'Usage: /run <command_name>');
          return;
        }
        executor.runCommand(name, (result) => {
          bot.sendMessage(chatId, `Result:\n${result}`);
        });
        break;
      case '/log':
        if (parts[1] === 'last') {
          const log = stateStore.getLastLog();
          bot.sendMessage(chatId, `Last log:\n${log}`);
        } else {
          bot.sendMessage(chatId, 'Usage: /log last');
        }
        break;
      case '/retry':
        if (parts[1] === 'last') {
          const retryCount = stateStore.getRetryCount();
          const threshold = parseInt(process.env.RETRY_APPROVAL_THRESHOLD) || 3;
          if (retryCount >= threshold) {
            approval.requestApproval((approved) => {
              if (approved) {
                executor.retryLast((result) => {
                  bot.sendMessage(chatId, `Retry result:\n${result}`);
                });
              } else {
                bot.sendMessage(chatId, 'Retry rejected');
              }
            });
            bot.sendMessage(chatId, 'Approval required for retry. Reply "yes" or "/approve" to approve, "no" or "/reject" to reject.');
          } else {
            executor.retryLast((result) => {
              bot.sendMessage(chatId, `Retry result:\n${result}`);
            });
          }
        } else {
          bot.sendMessage(chatId, 'Usage: /retry last');
        }
        break;
      case '/memory':
        if (parts[1] === 'last') {
          const mem = memoryBridge.getLast();
          bot.sendMessage(chatId, `Last memory:\n${mem}`);
        } else {
          bot.sendMessage(chatId, 'Usage: /memory last');
        }
        break;
      case '/approve':
        approval.approve();
        bot.sendMessage(chatId, 'Approved');
        break;
      case '/reject':
        approval.reject();
        bot.sendMessage(chatId, 'Rejected');
        break;
      default:
        bot.sendMessage(chatId, 'Unknown command. Use /help');
    }
  } else {
    const lower = text.toLowerCase();
    if (lower === 'yes') {
      approval.approve();
      bot.sendMessage(chatId, 'Approved');
    } else if (lower === 'no') {
      approval.reject();
      bot.sendMessage(chatId, 'Rejected');
    } else {
      const response = brain.map(text);
      bot.sendMessage(chatId, response);
    }
  }
}

module.exports = { handleMessage };