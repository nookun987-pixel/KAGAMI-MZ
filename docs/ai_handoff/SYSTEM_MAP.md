# SYSTEM MAP

## Active Architecture

Mikage runs as a hub-controlled module system.

```text
CONTROL HUB
-> intake module
-> generation module
-> validation module
-> decision module
-> memory placeholder
```

## Hub

- `MIKAGE/index.js`
  - Single orchestration hub
  - Calls modules in strict order
  - Owns trace writing and final memory handoff

## Modules

- `MIKAGE/modules/intake/index.js` -> normalize input, inject canon rules, prepare prompt spec
- `MIKAGE/modules/generation/index.js` -> build render payload, dispatch live lane, return raw result
- `MIKAGE/modules/validation/index.js` -> run monitor and analyzers, enforce hard validation signals
- `MIKAGE/modules/decision/index.js` -> deterministic judge layer, final decision, retry and repair decision
- `MIKAGE/modules/memory/index.js` -> placeholder runtime interface only, no long-term ingestion yet

## Trace Writing

- `execution/raw_trace_store.js` writes attempt-level evidence including `final_decision.json`.

## Hard Rule

- NO IMAGE = NO PASS
