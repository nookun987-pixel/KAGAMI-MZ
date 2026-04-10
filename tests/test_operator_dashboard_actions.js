"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

class FakeElement {
  constructor(id) {
    this.id = id;
    this.innerHTML = "";
    this.textContent = "";
    this.className = "";
    this.disabled = false;
    this.value = "";
    this.listeners = {};
  }

  addEventListener(event, handler) {
    this.listeners[event] = handler;
  }

  async click() {
    if (this.disabled) return;
    if (this.listeners.click) {
      await this.listeners.click({ target: this });
    }
  }
}

function createDocument(ids) {
  const elements = new Map(ids.map((id) => [id, new FakeElement(id)]));
  return {
    getElementById(id) {
      if (!elements.has(id)) {
        elements.set(id, new FakeElement(id));
      }
      return elements.get(id);
    },
    elements,
  };
}

function buildResponse(payload) {
  return {
    ok: true,
    async json() {
      return payload;
    },
  };
}

async function main() {
  const dashboardJs = fs.readFileSync(path.join(__dirname, "..", "control_plane", "ui", "dashboard.js"), "utf8");
  const document = createDocument([
    "task-input",
    "create-task",
    "approval-focus",
    "pending-count",
    "current-job-view",
    "job-caption",
    "short-result",
    "status-badge",
    "system-quick",
    "approve-latest",
    "reject-latest",
    "retry-latest",
    "pause-system",
    "resume-system",
    "restart-system",
    "action-feedback",
  ]);

  const calls = [];
  let intervalFn = null;
  const state = {
    approvals: [],
    jobs: [],
    failures: [],
    system_state: "running",
    branch: "phase-e-autonomy",
    agent_status: "watching",
    nextTaskId: 1,
    nextApprovalId: 1,
    nextJobId: 1,
  };

  async function fetchStub(route, options = {}) {
    const method = options.method || "GET";
    const body = options.body ? JSON.parse(options.body) : null;
    calls.push({ route, method, body });

    if (route === "/api/task/list") {
      return buildResponse({ status: "PASS", tasks: { pending: state.approvals } });
    }
    if (route === "/api/job/list") {
      return buildResponse({ status: "PASS", jobs: state.jobs });
    }
    if (route === "/api/system/status") {
      return buildResponse({
        status: "PASS",
        system_state: state.system_state,
        agent_status: state.agent_status,
        branch: state.branch,
      });
    }
    if (route === "/api/failure-center") {
      return buildResponse({ status: "PASS", failure_center: { failures: state.failures } });
    }
    if (route === "/api/task/create" && method === "POST") {
      const taskId = `task_${state.nextTaskId++}`;
      const approvalId = `approval_${state.nextApprovalId++}`;
      state.approvals = [{
        approval_id: approvalId,
        task_id: taskId,
        summary: body.content,
        tool_name: "codex.build_task",
        risk_level: "medium",
      }];
      return buildResponse({ status: "PASS", task: { task_id: taskId, approval_id: approvalId } });
    }
    if (route === "/api/task/approve" && method === "POST") {
      const approval = state.approvals[0];
      state.approvals = [];
      state.jobs = [{
        job_id: `job_${state.nextJobId++}`,
        task_id: approval.task_id,
        status: "DISPATCHED",
        started_at: "2026-04-09T10:00:00.000Z",
        finished_at: null,
        report: null,
        result_ingest: null,
      }];
      return buildResponse({ status: "PASS", approval, job: state.jobs[0] });
    }
    if (route === "/api/task/reject" && method === "POST") {
      const approval = state.approvals[0] || null;
      state.approvals = [];
      return buildResponse({ status: "BLOCKED", approval });
    }
    if (route.startsWith("/api/retry/") && method === "POST") {
      const failure = state.failures[0];
      state.failures = [];
      return buildResponse({ status: "PASS", entry: { task_id: failure ? failure.task_id : null } });
    }
    if (route === "/api/system/pause" && method === "POST") {
      state.system_state = "paused";
      state.agent_status = "stopped";
      return buildResponse({ status: "PASS", system_state: "paused" });
    }
    if (route === "/api/system/resume" && method === "POST") {
      state.system_state = "running";
      state.agent_status = "watching";
      return buildResponse({ status: "PASS", system_state: "running" });
    }
    if (route === "/api/system/restart" && method === "POST") {
      state.system_state = "running";
      state.agent_status = "watching";
      return buildResponse({ status: "PASS", system_state: "running" });
    }

    throw new Error(`Unhandled fetch ${method} ${route}`);
  }

  const context = {
    document,
    fetch: fetchStub,
    console,
    setInterval(fn) {
      intervalFn = fn;
      return 1;
    },
    clearInterval() {},
    encodeURIComponent,
  };

  vm.runInNewContext(dashboardJs, context, { filename: "dashboard.js" });

  await new Promise((resolve) => setImmediate(resolve));
  assert.ok(intervalFn, "refresh interval should be registered");

  const taskInput = document.getElementById("task-input");
  taskInput.value = "build bounded operator report";
  await document.getElementById("create-task").click();
  assert.strictEqual(document.getElementById("action-feedback").textContent, "TASK CREATED");
  assert.strictEqual(state.approvals.length, 1);
  assert.ok(calls.some((call) => call.route === "/api/task/create" && call.body.content === "build bounded operator report"));

  await document.getElementById("approve-latest").click();
  assert.strictEqual(document.getElementById("action-feedback").textContent, "APPROVED");
  assert.strictEqual(state.jobs.length, 1);
  assert.ok(calls.some((call) => call.route === "/api/task/approve" && call.body.id === "approval_1"));

  state.jobs[0].status = "SUCCEEDED";
  state.jobs[0].finished_at = "2026-04-09T10:00:05.000Z";
  state.jobs[0].result_ingest = { status: "success" };
  state.jobs[0].report = {
    what_was_done: "Report loop updated.",
    result: "success",
    next_step: "review_result_in_ui_or_telegram",
  };
  await intervalFn();
  assert.ok(document.getElementById("short-result").innerHTML.includes("Report loop updated."));

  state.approvals = [{
    approval_id: "approval_2",
    task_id: "task_2",
    summary: "reject me",
    tool_name: "codex.build_task",
    risk_level: "medium",
  }];
  await intervalFn();
  await document.getElementById("reject-latest").click();
  assert.strictEqual(document.getElementById("action-feedback").textContent, "REJECTED");
  assert.ok(calls.some((call) => call.route === "/api/task/reject" && call.body.id === "approval_2"));

  state.failures = [{
    failure_id: "failure_1",
    task_id: "task_1",
    message: "executor failed once",
    failure_code: "EXECUTION_FAILED",
  }];
  await intervalFn();
  assert.strictEqual(document.getElementById("retry-latest").disabled, false);
  await document.getElementById("retry-latest").click();
  assert.strictEqual(document.getElementById("action-feedback").textContent, "RETRY STARTED");
  assert.ok(calls.some((call) => call.route === "/api/retry/failure_1"));

  await document.getElementById("pause-system").click();
  assert.strictEqual(document.getElementById("action-feedback").textContent, "SYSTEM PAUSED");
  assert.strictEqual(state.system_state, "paused");

  await document.getElementById("resume-system").click();
  assert.strictEqual(document.getElementById("action-feedback").textContent, "SYSTEM RESUMED");
  assert.strictEqual(state.system_state, "running");

  await document.getElementById("restart-system").click();
  assert.strictEqual(document.getElementById("action-feedback").textContent, "SYSTEM RESTARTED");
  assert.ok(calls.some((call) => call.route === "/api/system/restart"));

  assert.strictEqual(document.getElementById("approve-latest").disabled, true);
  assert.strictEqual(document.getElementById("pause-system").disabled, false);
  assert.strictEqual(document.getElementById("resume-system").disabled, true);

  console.log("PASS");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
