"use strict";

const TelegramBot = require("node-telegram-bot-api");

function parseWorkflowCommand(text) {
  const match = String(text || "").trim().match(/^\/workflow\s+([a-zA-Z0-9_-]+)/);
  return match ? match[1].toUpperCase() : null;
}

function buildTelegramHandlers(service) {
  return {
    "/status": async () => service.getStatus(),
    "/health": async () => service.getHealth(),
    "/start_agent": async () => service.startAgent(),
    "/stop_agent": async () => service.stopAgent(),
    "/restart_agent": async () => service.restartAgent(),
    "/repo": async () => service.runBridgeCommand({
      action: "repo.status",
      payload: {},
      approval_status: "auto_allow",
      requested_by: "telegram",
      wait: true,
    }),
    "/desk": async () => service.runBridgeCommand({
      action: "desktop.capture_desktop_state",
      payload: {},
      approval_status: "auto_allow",
      requested_by: "telegram",
      wait: true,
    }),
    "/snapshot": async () => service.runBridgeCommand({
      action: "system.snapshot",
      payload: {},
      approval_status: "auto_allow",
      requested_by: "telegram",
      wait: true,
    }),
    "/alerts": async () => {
      const status = service.getStatus();
      return {
        status: "PASS",
        blockers: status.snapshot ? (status.snapshot.blockers || []) : [],
        latest_report: status.latest_report || null,
      };
    },
  };
}

function formatTelegramResponse(result) {
  return JSON.stringify(result, null, 2);
}

function startTelegramOperator(service, options = {}) {
  const token = options.token || process.env.MIKAGE_TELEGRAM_BOT_TOKEN;
  if (!token) {
    return {
      enabled: false,
      reason: "missing_token",
    };
  }

  const allowList = String(options.allowList || process.env.MIKAGE_TELEGRAM_ALLOWED_CHAT_IDS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const handlers = buildTelegramHandlers(service);
  const bot = new TelegramBot(token, { polling: true });

  bot.on("message", async (message) => {
    const chatId = String(message.chat.id);
    if (allowList.length && !allowList.includes(chatId)) {
      await bot.sendMessage(message.chat.id, "BLOCKED: chat not allowed");
      return;
    }

    const text = String(message.text || "").trim();
    const workflow = parseWorkflowCommand(text);
    try {
      if (workflow) {
        const result = await service.runWorkflow(workflow);
        await bot.sendMessage(message.chat.id, formatTelegramResponse(result));
        return;
      }
      const handler = handlers[text];
      if (!handler) {
        await bot.sendMessage(message.chat.id, "BLOCKED: unsupported command");
        return;
      }
      const result = await handler();
      await bot.sendMessage(message.chat.id, formatTelegramResponse(result));
    } catch (error) {
      await bot.sendMessage(message.chat.id, JSON.stringify({
        status: "FAIL",
        error: error.message,
      }, null, 2));
    }
  });

  return {
    enabled: true,
    bot,
  };
}

module.exports = {
  parseWorkflowCommand,
  buildTelegramHandlers,
  startTelegramOperator,
};
