"use strict";

function validateGameResult(result) {
  return {
    passed: Boolean(result && Array.isArray(result.artifacts) && result.artifacts.length > 0),
    issues: [],
  };
}

module.exports = {
  validateGameResult,
};
