"use strict";

const assert = require("assert");

const {
  parseCommand,
  handleTelegramCommand,
  buildJobStatusMessage,
  buildFailureMessage,
} = require("../control_plane/telegram_bot");

assert.deepStrictEqual(parseCommand("/taotask fix report loop"), {
  name: "/taotask",
  arg: "fix report loop",
});

assert.ok(buildJobStatusMessage({
  latest_job: {
    task_id: "task_1",
    status: "DISPATCHED",
    report: null,
  },
}, { jobs: [] }).includes("RUNNING"));

assert.ok(buildFailureMessage({
  failure_center: {
    failures: [{
      failure_id: "failure_1",
      message: "retry me",
    }],
  },
}).includes("/thulai failure_1"));

const calls = [];
async function fakeApi(baseUrl, method, route, body) {
  calls.push({ baseUrl, method, route, body });
  if (route === "/api/task/create") {
    return {
      status: "PASS",
      task: {
        task_id: "task_1",
        approval_id: "approval_1",
      },
    };
  }
  if (route === "/api/task/list") {
    return {
      status: "PASS",
      tasks: {
        pending: [{
          approval_id: "approval_1",
          task_id: "task_1",
          summary: "build report builder",
          tool_name: "codex.build_task",
          risk_level: "medium",
        }],
      },
    };
  }
  if (route === "/api/task/approve") {
    return {
      status: "PASS",
      approval: {
        approval_id: body.id,
        task_id: "task_1",
      },
    };
  }
  if (route === "/api/task/reject") {
    return {
      status: "BLOCKED",
      approval: {
        approval_id: body.id,
        task_id: "task_1",
      },
    };
  }
  if (route === "/api/system/status") {
    return {
      status: "PASS",
      system_state: "running",
      agent_status: "watching",
      latest_job: {
        task_id: "task_1",
        status: "SUCCEEDED",
        report: {
          what_was_done: "report loop updated",
          result: "success",
        },
      },
    };
  }
  if (route === "/api/job/list") {
    return {
      status: "PASS",
      jobs: [{
        job_id: "job_1",
        task_id: "task_1",
        status: "SUCCEEDED",
        report: {
          what_was_done: "report loop updated",
          result: "success",
        },
      }],
    };
  }
  if (route === "/api/failure-center") {
    return {
      status: "PASS",
      failure_center: {
        failures: [{
          failure_id: "failure_1",
          message: "executor failed once",
          failure_code: "EXECUTION_FAILED",
        }],
      },
    };
  }
  if (route === "/api/retry/failure_1") {
    return {
      status: "PASS",
      entry: {
        failure_id: "failure_1",
      },
    };
  }
  if (route === "/api/system/pause") return { status: "PASS" };
  if (route === "/api/system/resume") return { status: "PASS" };
  if (route === "/api/system/restart") return { status: "PASS" };
  throw new Error(`Unhandled route ${route}`);
}

(async () => {
  const baseUrl = "http://127.0.0.1:3030";

  const created = await handleTelegramCommand(baseUrl, "/taotask build report builder", fakeApi);
  assert.ok(created.includes("TASK CREATED"));
  assert.ok(created.includes("approval_1"));
  assert.ok(created.includes("next: /duyet approval_1"));

  const approvals = await handleTelegramCommand(baseUrl, "/choduyet", fakeApi);
  assert.ok(approvals.includes("APPROVAL MESSAGE"));
  assert.ok(approvals.includes("/duyet approval_1"));
  assert.ok(approvals.includes("/tuchoi approval_1"));

  const approved = await handleTelegramCommand(baseUrl, "/duyet approval_1", fakeApi);
  assert.ok(approved.includes("APPROVED"));
  assert.ok(approved.includes("next: /job"));

  const rejected = await handleTelegramCommand(baseUrl, "/tuchoi approval_1", fakeApi);
  assert.ok(rejected.includes("REJECTED"));
  assert.ok(rejected.includes("next: /choduyet"));

  const job = await handleTelegramCommand(baseUrl, "/job", fakeApi);
  assert.ok(job.includes("JOB STATUS"));
  assert.ok(job.includes("report loop updated"));
  assert.ok(job.includes("next: /taotask <noi dung>"));

  const status = await handleTelegramCommand(baseUrl, "/trangthai", fakeApi);
  assert.ok(status.includes("SYSTEM STATUS"));
  assert.ok(status.includes("running"));
  assert.ok(status.includes("next: /job"));

  const failure = await handleTelegramCommand(baseUrl, "/loi", fakeApi);
  assert.ok(failure.includes("FAILURE MESSAGE"));
  assert.ok(failure.includes("/thulai failure_1"));
  assert.ok(failure.includes("next: /thulai failure_1"));

  const retry = await handleTelegramCommand(baseUrl, "/thulai", fakeApi);
  assert.ok(retry.includes("RETRY STARTED"));
  assert.ok(retry.includes("next: /job"));

  const paused = await handleTelegramCommand(baseUrl, "/dung", fakeApi);
  assert.ok(paused.includes("SYSTEM PAUSED"));
  assert.ok(paused.includes("next: /trangthai"));

  const resumed = await handleTelegramCommand(baseUrl, "/tieptuc", fakeApi);
  assert.ok(resumed.includes("SYSTEM RESUMED"));
  assert.ok(resumed.includes("next: /trangthai"));

  const restarted = await handleTelegramCommand(baseUrl, "/restart", fakeApi);
  assert.ok(restarted.includes("SYSTEM RESTARTED"));
  assert.ok(restarted.includes("next: /trangthai"));

  assert.ok(calls.some((call) => call.route === "/api/task/create" && call.body.content === "build report builder"));
  assert.ok(calls.some((call) => call.route === "/api/task/approve" && call.body.id === "approval_1"));
  assert.ok(calls.some((call) => call.route === "/api/task/reject" && call.body.id === "approval_1"));
  assert.ok(calls.some((call) => call.route === "/api/job/list"));
  assert.ok(calls.some((call) => call.route === "/api/system/status"));
  assert.ok(calls.some((call) => call.route === "/api/failure-center"));
  assert.ok(calls.some((call) => call.route === "/api/retry/failure_1"));
  console.log("PASS");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
