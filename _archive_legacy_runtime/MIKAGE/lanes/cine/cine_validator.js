"use strict";

function validateCineResult(result) {
  return {
    passed: Boolean(result && Array.isArray(result.artifacts) && result.artifacts.length > 0),
    issues: [],
  };
}

module.exports = {
  validateCineResult,
};
