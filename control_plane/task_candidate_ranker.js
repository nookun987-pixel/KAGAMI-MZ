"use strict";

function scoreCandidate(candidate) {
  return (
    Number(candidate.goal_relevance || 0) * 5 +
    Number(candidate.unblock_value || 0) * 4 +
    Number(candidate.safety || 0) * 3 +
    Number(candidate.testability || 0) * 2 -
    Number(candidate.scope_size || 0) * 2 -
    Number(candidate.approval_cost || 0)
  );
}

function rankTaskCandidates(candidates = []) {
  return candidates
    .map((candidate) => ({
      ...candidate,
      score: scoreCandidate(candidate),
    }))
    .sort((a, b) => b.score - a.score);
}

module.exports = {
  scoreCandidate,
  rankTaskCandidates,
};
