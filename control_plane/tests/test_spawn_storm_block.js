"use strict";

const assert = require("assert");

const config = require("../local_control_agent/config");
const { writeJson } = require("../local_control_agent/bridge_writer");
const { governedSpawn } = require("../process_governor");
const { acquireSingletonLock, releaseSingletonLock } = require("../singleton_lock_manager");

(async () => {
  writeJson(config.SPAWN_RATE_LIMITER_PATH, { generated_at: null, launches: [], failures: [], cooldown_until: null });
  const firstLock = acquireSingletonLock("storm_singleton", { owner_module: "test_spawn_storm" });
  assert.strictEqual(firstLock.acquired, true);
  const blocked = await governedSpawn({
    command: process.execPath,
    args: ["-e", "setTimeout(()=>{},1000)"],
    owner_module: "test_spawn_storm",
    singleton_key: "storm_singleton",
    wait_for_exit: false,
    detached: true,
    timeout_ms: 2000,
  });
  assert.strictEqual(blocked.status, "BLOCKED");
  releaseSingletonLock("storm_singleton");
  console.log("PASS");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
