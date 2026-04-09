"use strict";

const assert = require("assert");

const { acquireSingletonLock, releaseSingletonLock } = require("../singleton_lock_manager");

const first = acquireSingletonLock("singleton_test", { owner_module: "test" });
assert.strictEqual(first.acquired, true);
const second = acquireSingletonLock("singleton_test", { owner_module: "test" });
assert.strictEqual(second.acquired, false);
assert.strictEqual(releaseSingletonLock("singleton_test"), true);
console.log("PASS");
