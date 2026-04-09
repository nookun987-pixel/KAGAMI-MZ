"use strict";

require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const CALLBACK_PREFIX = "cb:";
const MAX_CALLBACK_BYTES = 64;

async function callApi(baseUrl, method, route, body = null) {
  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return response.json();
}

function parseCommand(text) {
  const normalized = String(text || "").trim();
  if (!normalized.startsWith("/")) return { name: "", arg: "" };
  const [name, ...rest] = normalized.split(/\s+/);
  return {
    name: name.toLowerCase(),
    arg: rest.join(" ").trim(),
  };
}

function shortStatusBadge(value) {
  const status = String(value || "").toUpperCase();
  if (["DISPATCHED", "RUNNING", "PENDING"].includes(status)) return "RUNNING";
  if (status === "SUCCEEDED") return "DONE";
  if (["FAILED", "FAIL", "BLOCKED", "INGEST_ERROR", "EXPIRED"].includes(status)) return "FAILED";
  if (status === "PAUSED") return "PAUSED";
  return status || "UNKNOWN";
}

function firstPendingApproval(payload) {
  return (((payload || {}).tasks || {}).pending || [])[0] || null;
}

function firstFailure(payload) {
  return (((payload || {}).failure_center || {}).failures || [])[0] || null;
}

function buildTaskCreatedMessage(result) {
  if (result.status !== "PASS" || !result.task) {
    return [
      `ACTION FAILED: ${result.reason || result.error || "task_create_failed"}`,
      "- next: /taotask <noi dung ro hon>",
    ].join("\n");
  }
  return [
    "TASK CREATED",
    `- task id: ${result.task.task_id}`,
    `- approval id: ${result.task.approval_id}`,
    `- next: /duyet ${result.task.approval_id}`,
  ].join("\n");
}

function buildApprovalListMessage(payload) {
  const items = ((payload || {}).tasks || {}).pending || [];
  if (!items.length) {
    return "APPROVAL MESSAGE\n- no pending approval\n- next: /taotask <noi dung>";
  }
  const item = items[0];
  return [
    "APPROVAL MESSAGE",
    `- what was done: ${item.summary || item.task_id || item.approval_id}`,
    `- what needs approval: ${item.tool_name || "write action"} / ${item.risk_level || "unknown"}`,
    `- /duyet ${item.approval_id}`,
    `- /tuchoi ${item.approval_id}`,
  ].join("\n");
}

function buildApprovalResolvedMessage(result, verb) {
  const approval = result.approval || {};
  const label = verb === "approved" ? "APPROVED" : "REJECTED";
  const next = verb === "approved"
    ? "/job"
    : "/choduyet";
  return [
    label,
    `- task: ${approval.task_id || "unknown"}`,
    `- approval id: ${approval.approval_id || "unknown"}`,
    `- next: ${next}`,
  ].join("\n");
}

function buildJobStatusMessage(statusPayload, jobsPayload) {
  const latestJob = (statusPayload || {}).latest_job || (((jobsPayload || {}).jobs || [])[0] || null);
  if (!latestJob) {
    return [
      "JOB STATUS",
      "- current task: none",
      "- current stage: idle",
      "- status: DONE",
      "- short result: no active job",
      "- next: /taotask <noi dung>",
    ].join("\n");
  }
  const report = latestJob.report || null;
  const stage = report ? "REPORT" : latestJob.status || "UNKNOWN";
  const summary = report
    ? `${report.what_was_done || report.result || "result ready"}`
    : "waiting for execution result";
  const next = shortStatusBadge(latestJob.status) === "DONE"
    ? "/taotask <noi dung>"
    : "/job";
  return [
    "JOB STATUS",
    `- current task: ${latestJob.task_id || latestJob.job_id}`,
    `- current stage: ${stage}`,
    `- status: ${shortStatusBadge(latestJob.status)}`,
    `- short result: ${summary}`,
    `- next: ${next}`,
  ].join("\n");
}

function buildFailureMessage(payload) {
  const failure = firstFailure(payload);
  if (!failure) {
    return "FAILURE MESSAGE\n- no active failure\n- retry command: none\n- next: /job";
  }
  return [
    "FAILURE MESSAGE",
    `- failure summary: ${failure.message || failure.failure_code || failure.failure_id}`,
    `- retry command: /thulai ${failure.failure_id}`,
    `- next: /thulai ${failure.failure_id}`,
  ].join("\n");
}

function buildSuggestionsMessage(payload) {
  const suggestions = (payload || {}).suggestions || [];
  if (!suggestions.length) {
    return "SUGGESTED NEXT TASKS\n- system looks clear — no urgent suggestions\n- next: /taotask <noi dung>";
  }
  const lines = ["SUGGESTED NEXT TASKS"];
  suggestions.forEach((s) => {
    lines.push(`${s.rank}. [${s.rule}] ${s.reason}`);
    lines.push(`   → ${s.trigger_command}`);
  });
  lines.push(`- trigger any with /taotask <noi dung> or the command shown`);
  return lines.join("\n");
}

// Returns a callback_data string safe for Telegram's 64-byte limit.
// The prefix "cb:" (3 bytes) leaves 61 bytes for the command.
function safeCallbackData(triggerCommand) {
  const raw = CALLBACK_PREFIX + String(triggerCommand || "");
  // Truncate conservatively — ASCII-safe slice
  return raw.slice(0, MAX_CALLBACK_BYTES);
}

// Decode callback_data back to a command string, or null if not ours.
function decodeCallbackData(data) {
  const s = String(data || "");
  if (!s.startsWith(CALLBACK_PREFIX)) return null;
  return s.slice(CALLBACK_PREFIX.length);
}

const RULE_BUTTON_LABELS = {
  FAILURE_RETRY: "Fix failure",
  INCOMPLETE_MIXED: "Resume task",
  STALE_APPROVAL: "Approve pending",
  REPO_CHANGED: "Summarize changes",
  IDLE_INSPECTION: "Check status",
};

function buildSuggestionInlineKeyboard(suggestions) {
  if (!suggestions || !suggestions.length) return null;
  return {
    inline_keyboard: suggestions.map((s) => [
      {
        text: `▶ ${RULE_BUTTON_LABELS[s.rule] || "Run"}`,
        callback_data: safeCallbackData(s.trigger_command),
      },
    ]),
  };
}

function buildDigestReply(digest) {
  const d = digest || {};
  const sys = d.system || {};
  const approvals = d.approvals || {};
  const failures = d.failures || {};
  const stalled = d.stalled || {};
  const suggestions = d.suggestions || [];

  const date = d.generated_at
    ? new Date(d.generated_at).toISOString().slice(0, 16).replace("T", " ")
    : "now";

  const lines = [`DAILY DIGEST — ${date}`];
  lines.push("─────────────────────────────");

  // System
  const repoTag = sys.repo_clean === true ? "clean" : sys.repo_clean === false ? "dirty" : "unknown";
  lines.push(`SYSTEM: ${sys.state || "unknown"} | repo: ${repoTag}`);
  if (sys.branch) lines.push(`branch: ${sys.branch}`);

  // Approvals
  lines.push("");
  if (approvals.pending_count > 0) {
    const staleNote = approvals.stale_count > 0 ? ` (${approvals.stale_count} stale >30min)` : "";
    lines.push(`APPROVALS: ${approvals.pending_count} pending${staleNote}`);
    (approvals.items || []).forEach((a) => {
      const age = a.age_minutes != null ? ` ${a.age_minutes}min ago` : "";
      lines.push(`  · ${a.summary || a.approval_id}${age}`);
    });
  } else {
    lines.push("APPROVALS: none pending");
  }

  // Failures
  lines.push("");
  if (failures.total_open > 0) {
    lines.push(`FAILURES: ${failures.total_open} open (${failures.retryable_count} retryable)`);
    (failures.code_summary || []).forEach(({ code, count }) => {
      lines.push(`  · ${code}${count > 1 ? ` ×${count}` : ""}`);
    });
  } else {
    lines.push("FAILURES: none");
  }

  // Stalled
  lines.push("");
  if (stalled.count > 0) {
    lines.push(`STALLED: ${stalled.count} mixed task(s) blocked`);
    (stalled.items || []).forEach((t) => {
      lines.push(`  · ${t.task_id} step ${t.current_step}/${t.total_steps}`);
    });
  } else {
    lines.push("STALLED: none");
  }

  // Cost & timing (24h window)
  const ct = d.cost_timing;
  if (ct && ct.reports_in_window > 0) {
    lines.push("");
    const costStr = ct.total_cost_units != null ? ` | ${ct.total_cost_units} units total` : "";
    const avgDur  = ct.avg_duration_label ? ` avg ${ct.avg_duration_label}` : "";
    lines.push(`COST & TIME (24h, ${ct.reports_in_window} tasks):${avgDur}${costStr}`);
  }

  // Suggestions
  lines.push("");
  if (suggestions.length) {
    lines.push("SUGGESTED ACTIONS:");
    suggestions.forEach((s) => {
      lines.push(`${s.rank}. [${s.rule}] ${s.reason.slice(0, 60)}`);
    });
    lines.push("─────────────────────────────");
    lines.push("Tap a button to execute:");
  } else {
    lines.push("SUGGESTED ACTIONS: none");
    lines.push("─────────────────────────────");
  }

  const text = lines.join("\n");
  const reply_markup = buildSuggestionInlineKeyboard(suggestions);
  return reply_markup ? { text, reply_markup } : { text };
}

// Returns { text, reply_markup? } for commands that render suggestion buttons.
function buildSuggestionsReply(payload) {
  const suggestions = (payload || {}).suggestions || [];
  const text = buildSuggestionsMessage(payload);
  const reply_markup = buildSuggestionInlineKeyboard(suggestions);
  return reply_markup ? { text, reply_markup } : { text };
}

function buildSystemActionMessage(label, result) {
  if (result.status !== "PASS") {
    return [
      `ACTION FAILED: ${result.reason || result.error || "system_action_failed"}`,
      "- next: /trangthai",
    ].join("\n");
  }
  return `${label}\n- next: /trangthai`;
}

function buildRetryMessage(result) {
  if (result.status !== "PASS") {
    return [
      `ACTION FAILED: ${result.reason || result.error || "retry_failed"}`,
      "- next: /loi",
    ].join("\n");
  }
  const failureId = result.failure_id || (result.entry && result.entry.failure_id) || "latest";
  return [
    "RETRY STARTED",
    `- failure: ${failureId}`,
    "- next: /job",
  ].join("\n");
}

async function handleTelegramCommand(baseUrl, text, apiClient = callApi) {
  const command = parseCommand(text);

  if (command.name === "/taotask" && command.arg) {
    const result = await apiClient(baseUrl, "POST", "/api/task/create", {
      content: command.arg,
      requested_by: "telegram_operator",
    });
    return buildTaskCreatedMessage(result);
  }

  if (command.name === "/choduyet" || (command.name === "/duyet" && !command.arg) || (command.name === "/tuchoi" && !command.arg)) {
    const result = await apiClient(baseUrl, "GET", "/api/task/list");
    return buildApprovalListMessage(result);
  }

  if (command.name === "/duyet" && command.arg) {
    const result = await apiClient(baseUrl, "POST", "/api/task/approve", {
      id: command.arg,
      reviewed_by: "telegram_operator",
    });
    return result.status === "PASS"
      ? buildApprovalResolvedMessage(result, "approved")
      : `ACTION FAILED: ${result.reason || result.error || "approve_failed"}`;
  }

  if (command.name === "/tuchoi" && command.arg) {
    const result = await apiClient(baseUrl, "POST", "/api/task/reject", {
      id: command.arg,
      reviewed_by: "telegram_operator",
    });
    return result.approval
      ? buildApprovalResolvedMessage(result, "rejected")
      : `ACTION FAILED: ${result.reason || result.error || "reject_failed"}`;
  }

  if (command.name === "/job") {
    const [statusPayload, jobsPayload] = await Promise.all([
      apiClient(baseUrl, "GET", "/api/system/status"),
      apiClient(baseUrl, "GET", "/api/job/list"),
    ]);
    return buildJobStatusMessage(statusPayload, jobsPayload);
  }

  if (command.name === "/trangthai") {
    const [statusPayload, suggestionsPayload, digestPayload] = await Promise.all([
      apiClient(baseUrl, "GET", "/api/system/status"),
      apiClient(baseUrl, "GET", "/api/suggestions"),
      apiClient(baseUrl, "GET", "/api/digest"),
    ]);
    const jobText = buildJobStatusMessage(statusPayload, { jobs: [] }).split("\n").slice(1).join("\n");
    const suggestText = buildSuggestionsMessage(suggestionsPayload);
    const ct = (digestPayload || {}).cost_timing;
    const ctLine = ct && ct.reports_in_window > 0
      ? `- 24h: ${ct.reports_in_window} tasks | avg ${ct.avg_duration_label || "?"} | ${ct.total_cost_units != null ? ct.total_cost_units + " units" : "?"}`
      : null;
    const lines = [
      "SYSTEM STATUS",
      `- system: ${statusPayload.system_state || "unknown"}`,
      `- agent: ${statusPayload.agent_status || "unknown"}`,
      jobText,
    ];
    if (ctLine) { lines.push(""); lines.push(ctLine); }
    lines.push(""); lines.push(suggestText);
    const text = lines.join("\n");
    const reply_markup = buildSuggestionInlineKeyboard((suggestionsPayload || {}).suggestions || []);
    return reply_markup ? { text, reply_markup } : text;
  }

  if (command.name === "/goi") {
    const payload = await apiClient(baseUrl, "GET", "/api/suggestions");
    return buildSuggestionsReply(payload);
  }

  if (command.name === "/tongket") {
    const digest = await apiClient(baseUrl, "GET", "/api/digest");
    return buildDigestReply(digest);
  }

  if (command.name === "/loi") {
    const result = await apiClient(baseUrl, "GET", "/api/failure-center");
    return buildFailureMessage(result);
  }

  if (command.name === "/thulai") {
    let failureId = command.arg;
    if (!failureId) {
      const failurePayload = await apiClient(baseUrl, "GET", "/api/failure-center");
      const latest = firstFailure(failurePayload);
      if (!latest) {
        return [
          "ACTION FAILED: no_retryable_failure",
          "- next: /job",
        ].join("\n");
      }
      failureId = latest.failure_id;
    }
    const result = await apiClient(baseUrl, "POST", `/api/retry/${encodeURIComponent(failureId)}`);
    return buildRetryMessage({ ...result, failure_id: failureId });
  }

  if (command.name === "/dung") {
    const result = await apiClient(baseUrl, "POST", "/api/system/pause");
    return buildSystemActionMessage("SYSTEM PAUSED", result);
  }

  if (command.name === "/tieptuc") {
    const result = await apiClient(baseUrl, "POST", "/api/system/resume");
    return buildSystemActionMessage("SYSTEM RESUMED", result);
  }

  if (command.name === "/restart") {
    const result = await apiClient(baseUrl, "POST", "/api/system/restart");
    return buildSystemActionMessage("SYSTEM RESTARTED", result);
  }

  return [
    "ACTION FAILED: unsupported_command",
    "- next: /trangthai",
  ].join("\n");
}

function startTelegramBot(options = {}) {
  const token = options.token || process.env.TELEGRAM_BOT_TOKEN || process.env.MIKAGE_TELEGRAM_BOT_TOKEN;
  if (!token) {
    return { enabled: false, reason: "missing_token" };
  }
  const baseUrl = options.baseUrl || `http://127.0.0.1:${options.port || 3030}`;
  const allowList = String(
    options.allowList
      || process.env.TELEGRAM_CHAT_ID
      || process.env.MIKAGE_TELEGRAM_ALLOWED_CHAT_IDS
      || ""
  )
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const bot = new TelegramBot(token, { polling: true });

  // Unified send: handles both plain strings and { text, reply_markup } objects.
  async function sendReply(chatId, reply) {
    if (reply && typeof reply === "object" && reply.text) {
      const opts = reply.reply_markup ? { reply_markup: reply.reply_markup } : {};
      await bot.sendMessage(chatId, reply.text, opts);
    } else {
      await bot.sendMessage(chatId, String(reply || ""));
    }
  }

  bot.on("message", async (message) => {
    const chatId = String(message.chat.id);
    if (allowList.length && !allowList.includes(chatId)) {
      await bot.sendMessage(chatId, "BLOCKED: chat not allowed");
      return;
    }
    const text = String(message.text || "").trim();
    try {
      const reply = await handleTelegramCommand(baseUrl, text, callApi);
      await sendReply(chatId, reply);
    } catch (error) {
      await bot.sendMessage(chatId, `ACTION FAILED: ${error.message}\n- next: /trangthai`);
    }
  });

  // Button tap handler: decode callback_data → route through existing command logic.
  bot.on("callback_query", async (query) => {
    const chatId = String(query.message && query.message.chat && query.message.chat.id || "");
    const data = String(query.data || "");
    if (allowList.length && !allowList.includes(chatId)) {
      await bot.answerCallbackQuery(query.id, { text: "BLOCKED" });
      return;
    }
    const command = decodeCallbackData(data);
    if (!command) {
      await bot.answerCallbackQuery(query.id, { text: "unknown action" });
      return;
    }
    try {
      // Acknowledge the tap immediately so Telegram stops the spinner.
      await bot.answerCallbackQuery(query.id, { text: "Running..." });
      const reply = await handleTelegramCommand(baseUrl, command, callApi);
      await sendReply(chatId, reply);
    } catch (error) {
      await bot.sendMessage(chatId, `ACTION FAILED: ${error.message}\n- next: /trangthai`);
    }
  });

  return { enabled: true, bot, baseUrl };
}

async function resolveLiveChatId(token) {
  const explicit = process.env.TELEGRAM_CHAT_ID || process.env.MIKAGE_TELEGRAM_CHAT_ID || "";
  if (explicit.trim()) {
    return { status: "PASS", chat_id: explicit.trim(), source: "env" };
  }
  const updates = await fetch(`https://api.telegram.org/bot${token}/getUpdates?limit=20`).then((r) => r.json());
  if (!updates.ok) {
    return { status: "BLOCKED", reason: updates.description || "get_updates_failed" };
  }
  const latest = (updates.result || []).slice().reverse().find((item) => item.message && item.message.chat && item.message.chat.id);
  if (!latest) {
    return { status: "BLOCKED", reason: "chat_id_not_found_in_updates" };
  }
  return {
    status: "PASS",
    chat_id: String(latest.message.chat.id),
    source: "updates",
  };
}

async function sendStartupMessage(token, chatId, text = "MIKAGE OPERATOR LIVE") {
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  }).then((r) => r.json());
  if (!response.ok) {
    return {
      status: "FAIL",
      reason: response.description || "send_message_failed",
      response,
    };
  }
  return {
    status: "PASS",
    message_id: response.result && response.result.message_id,
  };
}

module.exports = {
  callApi,
  parseCommand,
  shortStatusBadge,
  buildTaskCreatedMessage,
  buildApprovalListMessage,
  buildApprovalResolvedMessage,
  buildJobStatusMessage,
  buildFailureMessage,
  buildSuggestionsMessage,
  buildSuggestionsReply,
  buildDigestReply,
  buildSuggestionInlineKeyboard,
  safeCallbackData,
  decodeCallbackData,
  buildSystemActionMessage,
  buildRetryMessage,
  handleTelegramCommand,
  resolveLiveChatId,
  sendStartupMessage,
  startTelegramBot,
};

if (require.main === module) {
  (async () => {
    const token = process.env.TELEGRAM_BOT_TOKEN || process.env.MIKAGE_TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.error("missing_token");
      process.exit(1);
    }
    const me = await fetch(`https://api.telegram.org/bot${token}/getMe`).then((r) => r.json());
    const started = startTelegramBot({});
    const chat = await resolveLiveChatId(token);
    let startup = { status: "BLOCKED", reason: "chat_id_unavailable" };
    if (chat.status === "PASS") {
      startup = await sendStartupMessage(token, chat.chat_id, "MIKAGE OPERATOR LIVE");
    }
    console.log(JSON.stringify({
      enabled: started.enabled,
      bot_username: me.ok && me.result ? me.result.username : null,
      chat,
      startup,
    }, null, 2));
  })().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
