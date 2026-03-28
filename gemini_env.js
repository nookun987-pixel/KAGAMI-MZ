"use strict";

const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

function getGeminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
  const source = process.env.GEMINI_API_KEY
    ? "GEMINI_API_KEY"
    : process.env.GOOGLE_API_KEY
      ? "GOOGLE_API_KEY"
      : "none";
  return {
    apiKey,
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    hasKey: !!apiKey,
    source,
    envFileDetected: fs.existsSync(path.join(__dirname, ".env")),
    cwd: process.cwd(),
  };
}

module.exports = {
  getGeminiConfig,
};
