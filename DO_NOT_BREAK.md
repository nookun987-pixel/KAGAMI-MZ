# DO_NOT_BREAK.md

Locked: 2026-03-23
Severity: CRITICAL — read before ANY edit to codebase

## What Must NEVER Be Modified Casually

### 1. State Machine Transitions (`core/state_machine.js`)

The `TRANSITION_MAP` defines every legal state change. The orchestrator, tests, and Notion status tracking all depend on this exact map.

- **DO NOT** add, remove, or rename states without updating: orchestrator.js, all test files, Notion database Status enum
- **DO NOT** remove the FAILED → LOGGED → DONE path
- **DO NOT** allow DONE to have outbound transitions
- **DO NOT** remove the DECIDED → NORMALIZED loop-back (refine loop depends on it)
- **If broken:** Every `applyTransition()` call in orchestrator.js will throw `StateTransitionError`. Pipeline dies immediately.

### 2. Canon Data in Precheck (`control/precheck.js`)

The `CANON` object (lines 16–168) is the single source of truth for identity rules. It contains:
- `MATERIALS_SUBJECT` — allowed on Mikage body
- `MATERIALS_ENVIRONMENT` — allowed in background only
- `FORBIDDEN_ABSOLUTE` — instant REJECT triggers (30+ terms)
- `GLAM_DRIFT_SIGNALS` — engagement drift markers
- `COLORS_FORBIDDEN` — colors banned on subject
- `NARRATIVE_TONES` / `NARRATIVE_TONES_FORBIDDEN` — mood vocabulary
- `STRATEGY_OBJECTIVES` / `STRATEGY_DRIFT_OBJECTIVES` — valid vs drift-prone goals
- `COMPOSITION` — hard numeric thresholds

- **DO NOT** remove items from `FORBIDDEN_ABSOLUTE` — they are the identity firewall
- **DO NOT** change `negative_space_min` below 0.40 — Canon mandate
- **DO NOT** add engagement-related objectives to `STRATEGY_OBJECTIVES`
- **If broken:** Jobs with forbidden content will pass precheck. Identity drift enters the pipeline unchecked. Renders may look "beautiful but not Mikage."

### 3. Negative Prompt Core (`middleware/constraints.js`)

`NEGATIVE_PROMPT_CORE` (67 terms) is injected into every render. It blocks plastic look, anime, organic softness, and all Canon-forbidden visual artifacts.

- **DO NOT** remove anti-AI terms (`plastic skin`, `over-smoothing`, `airbrushed`, etc.)
- **DO NOT** remove anti-Canon terms (`anime`, `curved katana`, `magic effects`, etc.)
- **If broken:** Fooocus renders will drift toward default AI aesthetics. Plastic skin, over-smooth surfaces, and anime features will appear.

### 4. Translator Guard Checks (`translator/translator_guard.js`)

The 7-check validation prevents Ollama from injecting creativity. The guard reads `CANON.FORBIDDEN_ABSOLUTE` from precheck.js and `NEGATIVE_PROMPT_CORE` from constraints.js.

- **DO NOT** loosen `TONE_SHIFT_MARKERS` — they catch "beautiful", "stunning", "gorgeous" etc.
- **DO NOT** remove `checkNoForbiddenInPositive` — it prevents Canon-banned terms from leaking into the render prompt
- **DO NOT** remove `checkNegativePreserved` — it ensures negative prompt terms survive translation
- **If broken:** Ollama can inject "beautiful ethereal goddess" or "anime style" into the positive prompt. Fooocus will render it.

### 5. Control Token Enforcement (`render/render_executor.js`)

`enforceToken()` validates that a control token was issued by precheck before allowing any render. The token must match the job_id and not be expired.

- **DO NOT** remove or bypass `enforceToken()` in `executeRender()`
- **DO NOT** allow render calls without a token
- **If broken:** Any module can call Fooocus directly, bypassing precheck. The entire control layer becomes theater.

### 6. Notion Write Logic (`memory/notion_logger.js`)

`buildProperties()` maps all 22 required fields to Notion property types. The Notion database schema must match these property names exactly.

- **DO NOT** rename property keys in `buildProperties()` without changing Notion database columns
- **DO NOT** remove `retryWithBackoff()` — Notion has a 3 req/sec rate limit
- **DO NOT** remove `sendToDLQ()` fallback — it's the last line of defense for audit data
- **If broken:** Notion writes fail silently or throw unhandled errors. Audit trail is lost. Jobs complete but leave no record.

### 7. Critic Merge Formula (`critic/critic_merge.js`)

```
quality_score = (rule_score * 0.6) + (vision_score * 0.4)
```

- **DO NOT** change the 0.6/0.4 weights without re-validating all threshold logic
- **DO NOT** remove the defense-in-depth rule (either layer FAIL → overall REJECT)
- **If broken:** Over-polished or structurally broken images pass critic. Drift detector may catch some, but the first defense line is gone.

### 8. Drift Hard Gates (`drift/drift_detector.js`)

```
identity_score < 0.60 → REJECT (immediate, no loop)
identity_erosion flag → REJECT (regardless of score)
```

- **DO NOT** lower the 0.60 threshold — it's the absolute minimum for "still Mikage"
- **DO NOT** remove `isRefineable()` terminal checks — they prevent infinite loops on unfixable drift
- **If broken:** Identity-broken images enter the refine loop and waste 3 render cycles before failing anyway. Or worse, they pass.

## Known Fragile Areas

| Area | Why Fragile | Impact If Disturbed |
|---|---|---|
| `translator_guard.js` ← `precheck.js` coupling | Guard imports `CANON` from precheck. If CANON structure changes, guard checks may silently miss violations. | Forbidden terms leak into positive prompt. |
| `translator_guard.js` ← `constraints.js` coupling | Guard imports `NEGATIVE_PROMPT_CORE`. If constraints add/remove terms, guard's preservation check threshold may not match. | Guard reports false positive/negative on negative prompt preservation. |
| `render_executor.js` ← `precheck.js` coupling | Executor imports `validateToken()`. If token format changes in precheck, executor rejects all renders. | Pipeline halts at render stage with token errors. |
| `vram_manager.js` phase state machine | Internal `PHASE_TRANSITIONS` map. If phases are reordered, load/unload sequence breaks. | GPU memory leaked. Parallel Ollama + Fooocus. OOM crash. |
| `orchestrator.js` state transition sequence | Must call `applyTransition()` in exact order matching `TRANSITION_MAP`. Any skip = throw. | Pipeline crash at the skipped transition. |
| Notion property names | `buildProperties()` keys must match Notion database column names exactly. Case-sensitive. | Notion API 400 errors. Audit trail not written. |
| `OLLAMA_KEEP_ALIVE=0` | Hardcoded in vram_manager curl command. If Ollama server is configured differently, unload may not happen. | VRAM not released after translation. Fooocus OOM on render. |

## Module Coupling Map

```
orchestrator.js
  ├── core/state_machine.js          (no upstream deps)
  ├── control/precheck.js            (no upstream deps — contains CANON)
  ├── middleware/mapper.js
  │     └── middleware/constraints.js (no upstream deps — contains NEGATIVE_PROMPT_CORE)
  ├── translator/ollama_translate.js
  │     └── translator/translator_guard.js
  │           ├── control/precheck.js (reads CANON)
  │           └── middleware/constraints.js (reads NEGATIVE_PROMPT_CORE)
  ├── render/render_executor.js
  │     ├── control/precheck.js (reads validateToken)
  │     ├── translator/ollama_translate.js
  │     └── render/vram_manager.js (no upstream deps)
  ├── critic/critic_merge.js
  │     ├── critic/rule_critic.js (no upstream deps)
  │     └── critic/vision_critic.js (no upstream deps)
  ├── drift/drift_detector.js
  │     ├── drift/identity_score.js (no upstream deps)
  │     └── drift/narrative_score.js (no upstream deps)
  └── memory/notion_logger.js
        └── memory/audit_serializer.js (no upstream deps)
```

**Cross-module couplings (the dangerous ones):**
- `translator_guard` → `precheck.CANON` + `constraints.NEGATIVE_PROMPT_CORE`
- `render_executor` → `precheck.validateToken`
- `mapper` → `constraints` (validation + negative prompt compilation)

## Rules For Future Edits

### Safe to edit (no re-test of other modules needed)

- Adding new terms to `FORBIDDEN_ABSOLUTE` in precheck.js (stricter = safe)
- Adding new terms to `NEGATIVE_PROMPT_CORE` in constraints.js (stricter = safe)
- Adding new mood/material/style entries to mapper.js lookup tables (additive = safe)
- Adding new drift flag types to drift_detector.js (additive = safe)
- Changing log messages in orchestrator.js
- Editing `examples/job_sample.json`
- Editing `README_run.md`, `.env.example`, or any `.md` doc

### Requires full re-test (`node scripts/run_all_tests.js`)

- Any change to `CANON` object structure in precheck.js
- Any change to `NEGATIVE_PROMPT_CORE` in constraints.js
- Any change to state names or transitions in state_machine.js
- Any change to scoring formulas (precheck, critic_merge, identity_score, narrative_score)
- Any change to threshold values (precheck decision boundaries, critic verdicts, drift hard gates)
- Any change to `buildProperties()` in notion_logger.js
- Any change to `enforceToken()` or `issueToken()` in precheck.js
- Any change to VRAM phase transitions in vram_manager.js

### Requires manual E2E verification (run orchestrator against real services)

- Changing Ollama model name
- Changing Ollama endpoint URL
- Changing Fooocus API client implementation
- Changing Notion database schema
- Changing VLM backend implementation
- Any change to render_executor.js `executeRender()` flow
