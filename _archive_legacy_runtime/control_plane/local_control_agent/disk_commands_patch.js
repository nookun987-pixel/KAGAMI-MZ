"use strict";

const { scanDisk, safeClean } = require("./disk_maintenance_agent");

async function handleDiskCommand(command) {
  if (command.startsWith("disk scan")) {
    const target = command.replace("disk scan", "").trim() || "C:\\";
    return scanDisk(target);
  }

  if (command.startsWith("disk clean")) {
    return "REQUIRES APPROVAL: run disk scan first";
  }

  if (command.startsWith("disk clean safe")) {
    const target = command.replace("disk clean safe", "").trim() || "C:\\";
    const grouped = scanDisk(target);
    return safeClean(grouped);
  }

  return null;
}

module.exports = { handleDiskCommand };