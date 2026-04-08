"use strict";

const assert = require("assert");
const fs = require("fs");

const config = require("../control_plane/local_control_agent/config");
const { writeSessionState, getSessionState } = require("../control_plane/session_manager");

if (fs.existsSync(config.USER_SESSION_STATE)) fs.unlinkSync(config.USER_SESSION_STATE);
if (fs.existsSync(config.AGENT_SESSION_STATE)) fs.unlinkSync(config.AGENT_SESSION_STATE);

const written = writeSessionState({
  user_session: {
    requested_by: "test_user",
    reviewed_by: "test_reviewer",
    approval_state: "approved",
    last_action: "WAKE_VERIFY",
  },
});

assert.strictEqual(written.user_session.requested_by, "test_user");
const state = getSessionState();
assert.strictEqual(state.user_session.requested_by, "test_user");
assert.ok(state.agent_session.session_type === "agent_session");

console.log("PASS");
