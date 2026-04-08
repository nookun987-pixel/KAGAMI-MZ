"use strict";

function evaluateQualityRetryGuard(context = {}) {
  const attempts = Array.isArray(context.attempts) ? context.attempts : [];
  const qualityFailurePacket = context.qualityFailurePacket || {};
  const currentAttempt = Number.isInteger(context.currentAttempt) ? context.currentAttempt : 1;
  const maxAttempts = Number.isInteger(context.maxAttempts) ? context.maxAttempts : 2;
  const primaryCode = String(qualityFailurePacket.primary_failure_code || "");

  const previousSame = attempts
    .map((attempt) => attempt.qualityFailurePacket && attempt.qualityFailurePacket.primary_failure_code || "")
    .filter((code) => code && code === primaryCode)
    .length;
  const repeatedCount = primaryCode ? previousSame + 1 : 0;
  const repeatedFailure = Boolean(primaryCode && repeatedCount >= 2);
  const maxReached = currentAttempt >= maxAttempts;
  const hardStop = repeatedFailure || maxReached;

  let reason = "";
  if (repeatedFailure) {
    reason = `Repeated quality failure persisted: ${primaryCode}`;
  } else if (maxReached) {
    reason = "Max retry cap reached.";
  }

  return {
    allow_retry: !hardStop,
    hard_stop: hardStop,
    repeated_failure_code: repeatedFailure ? primaryCode : "",
    repeated_failure_count: repeatedCount,
    current_attempt: currentAttempt,
    max_attempts: maxAttempts,
    reason,
  };
}

module.exports = {
  evaluateQualityRetryGuard,
};
