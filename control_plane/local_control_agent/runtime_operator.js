"use strict";

const net = require("net");
const { STARTUP_PROFILE } = require("./config");

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("error", () => resolve(false));
    socket.on("timeout", () => resolve(false));
    socket.connect(port, "127.0.0.1");
  });
}

async function health() {
  const ports = STARTUP_PROFILE.service_ports;
  const results = {};
  for (const p of ports) {
    results[p] = await checkPort(p);
  }
  return results;
}

module.exports = { health };