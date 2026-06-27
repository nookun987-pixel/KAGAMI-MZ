"use strict";

function validateOpsResult(result) {
  return {
    passed: Boolean(result && Array.isArray(result.artifacts) && result.artifacts.length > 0),
    issues: [],
  };
}

module.exports = {
  validateOpsResult,
};
