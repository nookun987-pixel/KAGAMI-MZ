# NEXT TASK

## Expand approved_object_library with more master samples

**Objective:** Add more approved object specs (weapon, vessel, etc.) to `memory/approved_object_library.json` so the Object Definition Lane can match more intents from the approved library instead of building bare skeletons.

**Steps:**
1. Define 2–3 new master specs (e.g., Zenith Blade weapon, Hannya mask) following `OBJECT_SPEC_SCHEMA.json`
2. Add them to `approved_object_library.json`
3. Run `node object_definition/test_object_definition_lane.js` to verify
4. Run `node object_definition/test_integration_pipeline.js` to verify integration

---

## DO NOT

- Do not modify object_definition lane internals
- Do not rewrite orchestrator flow
- Do not touch command layer or UI
- Do not expand scope beyond object library enrichment
