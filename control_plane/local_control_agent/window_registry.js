"use strict";

const config = require("./config");

const APP_REGISTRY = {
  chrome: {
    app: config.MACHINE_PROFILE.chrome_path,
    args: [],
    focus_title: config.MACHINE_PROFILE.window_titles.chrome,
  },
  vscode: {
    app: config.MACHINE_PROFILE.vscode_path,
    args: [config.ROOT],
    focus_title: config.MACHINE_PROFILE.window_titles.vscode,
  },
  cmd: {
    app: config.MACHINE_PROFILE.cmd_path,
    args: [],
    focus_title: config.MACHINE_PROFILE.window_titles.cmd,
  },
};

const TAB_TARGETS = {
  chatgpt: "https://chatgpt.com",
  github: "https://github.com/nookun987-pixel/KAGAMI-MZ",
  drive: process.env.MIKAGE_GOOGLE_DRIVE_URL || "https://drive.google.com/",
  localhost: process.env.MIKAGE_LOCALHOST_URL || `http://127.0.0.1:${config.MACHINE_PROFILE.localhost_ports[0] || 3032}`,
};

const TAB_TITLE_HINTS = {
  chatgpt: [String(config.MACHINE_PROFILE.window_titles.chatgpt || "ChatGPT").toLowerCase(), "openai"],
  github: [String(config.MACHINE_PROFILE.window_titles.github || "GitHub").toLowerCase(), "pull request", "kagami-mz"],
  drive: [String(config.MACHINE_PROFILE.window_titles.drive || "Google Drive").toLowerCase(), "my drive", "drive"],
  localhost: [String(config.MACHINE_PROFILE.window_titles.localhost || "127.0.0.1").toLowerCase(), "localhost"],
};

function getAppTarget(name) {
  return APP_REGISTRY[String(name || "").toLowerCase()] || null;
}

function getFocusTitle(name) {
  const target = getAppTarget(name);
  return target ? target.focus_title : null;
}

function getTabTarget(name) {
  return TAB_TARGETS[String(name || "").toLowerCase()] || null;
}

function getStartupUrls() {
  const urls = [...config.MACHINE_PROFILE.startup_urls];
  if (process.env.MIKAGE_GOOGLE_DRIVE_URL) {
    urls.push(process.env.MIKAGE_GOOGLE_DRIVE_URL);
  }
  return urls;
}

function getStartupApps() {
  return config.MACHINE_PROFILE.startup_apps.map((app) => ({ app }));
}

function getStartupFullApps() {
  return [
    { app: "chrome" },
    { app: "vscode" },
    { app: "cmd" },
  ];
}

function getStartupFullUrls() {
  return [
    "https://chatgpt.com",
    "https://github.com/nookun987-pixel/KAGAMI-MZ",
    getTabTarget("drive"),
    getTabTarget("localhost"),
  ].filter(Boolean);
}

module.exports = {
  APP_REGISTRY,
  TAB_TARGETS,
  TAB_TITLE_HINTS,
  getAppTarget,
  getFocusTitle,
  getTabTarget,
  getStartupUrls,
  getStartupApps,
  getStartupFullApps,
  getStartupFullUrls,
};
