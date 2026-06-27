"use strict";

const SUPPORTED_INTENTS = ["image", "cine", "game", "content", "ops"];

const INTENT_KEYWORDS = {
  image: ["image", "render", "shot", "frame", "poster", "mask", "visual", "key art"],
  cine: ["cine", "cinematic", "sequence", "scene", "storyboard", "camera", "video"],
  game: ["game", "combat", "encounter", "level", "system", "boss", "playable"],
  content: ["content", "post", "thread", "caption", "article", "copy", "campaign"],
  ops: ["ops", "deploy", "monitor", "automation", "audit", "service", "queue"],
};

function inferPriority(text, explicitPriority) {
  if (explicitPriority && ["low", "normal", "high", "critical"].includes(explicitPriority)) {
    return explicitPriority;
  }

  const normalized = String(text || "").toLowerCase();

  if (/\b(critical|p0|immediately|immediate)\b/.test(normalized)) return "critical";
  if (/\b(high|urgent|asap|priority)\b/.test(normalized)) return "high";
  if (/\b(low|later|nice to have)\b/.test(normalized)) return "low";
  return "normal";
}

function inferConstraints(input) {
  if (Array.isArray(input && input.constraints)) {
    return input.constraints.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  }

  return [];
}

function classifyIntent(goal, laneRegistry) {
  const normalizedGoal = String(goal || "").toLowerCase();
  const scores = Object.fromEntries(SUPPORTED_INTENTS.map((lane) => [lane, 0]));

  for (const lane of SUPPORTED_INTENTS) {
    const registryAliases = (((laneRegistry || {}).lanes || {})[lane] || {}).aliases || [];
    const keywords = [...INTENT_KEYWORDS[lane], ...registryAliases];

    for (const keyword of keywords) {
      if (keyword && normalizedGoal.includes(String(keyword).toLowerCase())) {
        scores[lane] += 1;
      }
    }
  }

  let winner = "ops";
  let topScore = -1;

  for (const lane of SUPPORTED_INTENTS) {
    if (scores[lane] > topScore) {
      winner = lane;
      topScore = scores[lane];
    }
  }

  if (topScore <= 0) {
    return "ops";
  }

  return winner;
}

function routeIntent(input, options = {}) {
  const normalizedInput = typeof input === "string" ? { goal: input } : (input || {});
  const laneRegistry = options.laneRegistry || {};
  const goal = String(normalizedInput.goal || normalizedInput.objective || normalizedInput.prompt || "").trim();

  if (!goal) {
    throw new Error("Intent router requires a non-empty goal.");
  }

  const intent_type = SUPPORTED_INTENTS.includes(normalizedInput.intent_type)
    ? normalizedInput.intent_type
    : classifyIntent(goal, laneRegistry);

  return {
    intent_type,
    goal,
    constraints: inferConstraints(normalizedInput),
    priority: inferPriority(goal, normalizedInput.priority),
    signals: {
      source: normalizedInput.source || "direct_input",
      classified_by: SUPPORTED_INTENTS.includes(normalizedInput.intent_type) ? "explicit_intent" : "keyword_router",
    },
  };
}

module.exports = {
  SUPPORTED_INTENTS,
  routeIntent,
  classifyIntent,
  inferPriority,
};
