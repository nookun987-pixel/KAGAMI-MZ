"use strict";

const { TAB_TITLE_HINTS, getFocusTitle } = require("./window_registry");

function normalizeWindowList(rawWindows) {
  return (Array.isArray(rawWindows) ? rawWindows : [])
    .map((entry) => ({
      title: String(entry.title || "").trim(),
      process: String(entry.process || "").trim().toLowerCase(),
      pid: Number.isFinite(Number(entry.pid)) ? Number(entry.pid) : null,
    }))
    .filter((entry) => entry.title);
}

function inferBrowserContext(activeWindow, windows) {
  const activeTitle = String(activeWindow && activeWindow.title || "").toLowerCase();
  const openTitles = windows.map((entry) => String(entry.title || "").toLowerCase());
  for (const [target, hints] of Object.entries(TAB_TITLE_HINTS)) {
    if (hints.some((hint) => activeTitle.includes(hint))) {
      return {
        target,
        source: "active_window",
      };
    }
    if (openTitles.some((title) => hints.some((hint) => title.includes(hint)))) {
      return {
        target,
        source: "open_windows",
      };
    }
  }
  return {
    target: null,
    source: "unknown",
  };
}

function verifyWindowTarget(target, activeWindow, windows) {
  const normalizedTarget = String(target || "").toLowerCase();
  const expectedTitle = String(getFocusTitle(normalizedTarget) || "").toLowerCase();
  if (!expectedTitle) {
    return {
      target: normalizedTarget,
      matched: false,
      reason: "unsupported_target",
    };
  }
  const activeTitle = String(activeWindow && activeWindow.title || "").toLowerCase();
  if (activeTitle.includes(expectedTitle)) {
    return {
      target: normalizedTarget,
      matched: true,
      reason: "active_window_match",
    };
  }
  const openMatch = windows.some((entry) => String(entry.title || "").toLowerCase().includes(expectedTitle));
  return {
    target: normalizedTarget,
    matched: openMatch,
    reason: openMatch ? "open_window_match" : "not_found",
  };
}

function verifyTabTarget(target, browserContext) {
  const normalizedTarget = String(target || "").toLowerCase();
  const matched = String(browserContext && browserContext.target || "").toLowerCase() === normalizedTarget;
  return {
    target: normalizedTarget,
    matched,
    reason: matched ? "browser_context_match" : "browser_context_mismatch",
  };
}

module.exports = {
  normalizeWindowList,
  inferBrowserContext,
  verifyWindowTarget,
  verifyTabTarget,
};
