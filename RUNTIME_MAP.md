# RUNTIME_MAP.md

Locked: 2026-03-23
Entry point: `node orchestrator.js <job.json>`

## Full Execution Flow

```
                         ┌─────────────────────────┐
                         │   job.json (from Notion) │
                         └───────────┬─────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │  1. INGEST — createJob()         │
                    │     core/state_machine.js        │
                    │     State: INGESTED               │
                    └────────────────┬────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │  2. STRUCTURE — validate schema   │
                    │     State: STRUCTURED             │
                    │     → Notion: createJobEntry()   │
                    └────────────────┬────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │  3. PRE-CONTROL — precheck()     │
                    │     control/precheck.js          │
                    │     State: PRECHECKED             │
                    │     Scores: identity, narrative,  │
                    │       strategic, risk             │
                    │     Decision: ALLOW/REVIEW/REJECT │
                    └────┬───────────┬────────────┬───┘
                         │           │            │
                   ALLOW ▼     REVIEW ▼      REJECT ▼
              Token issued   HALT (human)   FAIL→LOG→DONE
                         │
            ┌────────────▼─────── RENDER LOOP (max 3) ──────────┐
            │                                                     │
            │  ┌──────────────────────────────────────────┐      │
            │  │  4. NORMALIZE — normalize()               │      │
            │  │     middleware/mapper.js                   │      │
            │  │     middleware/constraints.js              │      │
            │  │     State: NORMALIZED                      │      │
            │  │     Output: structured_prompt_spec         │      │
            │  └────────────────┬──────────────────────────┘      │
            │                   │                                  │
            │  ┌────────────────▼──────────────────────────┐      │
            │  │  5. TRANSLATE — translate()                │      │
            │  │     translator/ollama_translate.js         │      │
            │  │     translator/translator_guard.js         │      │
            │  │     State: TRANSLATED                      │      │
            │  │     VRAM: Load Ollama → Translate →        │      │
            │  │           Unload → Clear → Zombie check    │      │
            │  │     Output: positive_prompt, negative_prompt│      │
            │  └────────────────┬──────────────────────────┘      │
            │                   │                                  │
            │  ┌────────────────▼──────────────────────────┐      │
            │  │  6. RENDER — executeRender()               │      │
            │  │     render/render_executor.js              │      │
            │  │     render/vram_manager.js                 │      │
            │  │     State: RENDERING                       │      │
            │  │     VRAM: Load Fooocus → Render →          │      │
            │  │           Unload → Clear → Zombie check    │      │
            │  │     Token validation enforced              │      │
            │  │     Output: image file, seed               │      │
            │  └────────────────┬──────────────────────────┘      │
            │                   │                                  │
            │  ┌────────────────▼──────────────────────────┐      │
            │  │  7. CRITIC — runCritic()                   │      │
            │  │     critic/rule_critic.js (Layer 1)        │      │
            │  │     critic/vision_critic.js (Layer 2)      │      │
            │  │     critic/critic_merge.js                 │      │
            │  │     State: CRITIQUED                        │      │
            │  │     quality_score = rule*0.6 + vision*0.4  │      │
            │  └────────────────┬──────────────────────────┘      │
            │                   │                                  │
            │  ┌────────────────▼──────────────────────────┐      │
            │  │  8. DRIFT — detectDrift()                  │      │
            │  │     drift/identity_score.js                │      │
            │  │     drift/narrative_score.js               │      │
            │  │     drift/drift_detector.js                │      │
            │  │     State: DRIFT_CHECKED                    │      │
            │  │     Output: identity_score, drift_flags,   │      │
            │  │       verdict, refineable                  │      │
            │  └────────────────┬──────────────────────────┘      │
            │                   │                                  │
            │  ┌────────────────▼──────────────────────────┐      │
            │  │  9. POST-CONTROL — postControl()           │      │
            │  │     orchestrator.js (inline function)      │      │
            │  │     State: POSTCHECKED → DECIDED            │      │
            │  │     Decision:                              │      │
            │  │       PASS → break loop → LOG → DONE       │      │
            │  │       REJECT → REJECTED → LOG → DONE       │      │
            │  │       REVIEW → break loop → LOG → DONE     │      │
            │  │       AUTO_SAFE → break loop → LOG → DONE  │      │
            │  │       CONDITIONAL → loop back to step 4    │      │
            │  └────────────────┬──────────────────────────┘      │
            │                   │                                  │
            └───────────────────┘ (CONDITIONAL loops back)        │
                                                                   │
            ┌──────────────────────────────────────────────────────┘
            │
            ▼
     ┌──────────────────────────────────┐
     │  10. LOG — writeAuditRecord()     │
     │      memory/notion_logger.js     │
     │      memory/audit_serializer.js  │
     │      State: LOGGED → DONE         │
     │      → Notion: final write        │
     └──────────────────────────────────┘
```

## Entry Points

| Entry | Command | Purpose |
|---|---|---|
| Pipeline runner | `node orchestrator.js <job.json>` | Execute full pipeline for one job |
| Test suite | `node scripts/run_all_tests.js` | Run all 1015 tests |
| Individual test | `node <module>/<module>.test.js` | Run single module tests |

## Key Files and Their Roles

| File | Role | Calls | Called By |
|---|---|---|---|
| `orchestrator.js` | Pipeline coordinator. Owns the render loop, state transitions, and decision routing. | state_machine, precheck, mapper, translate, executeRender, runCritic, detectDrift, notion_logger, audit_serializer | CLI / external trigger |
| `core/state_machine.js` | Enforces strict linear state transitions. No state skipping. Immutable job updates. | (none — leaf module) | orchestrator, all test files |
| `control/precheck.js` | PRE-CONTROL gate. Scores identity/narrative/strategic. Issues control tokens. Contains hardcoded Canon (CANON object). | (none — leaf module) | orchestrator, render_executor, translator_guard |
| `middleware/constraints.js` | Hard constraint values + negative prompt core (67 terms). Composition validation. | (none — leaf module) | mapper, translator_guard |
| `middleware/mapper.js` | Deterministic mapping tables. mood→lighting, material→texture, style→composition. Assembles normalized_prompt_spec. | constraints | orchestrator |
| `translator/ollama_translate.js` | Converts structured spec → flat prompt strings. LOCAL mode (deterministic) or OLLAMA mode (LLM). | translator_guard | orchestrator, render_executor |
| `translator/translator_guard.js` | 7-check validation of translator output. Rejects creative additions. | precheck.CANON, constraints.NEGATIVE_PROMPT_CORE | ollama_translate |
| `render/vram_manager.js` | Sequential VRAM lifecycle. Phase state machine. Zombie detection via nvidia-smi/ollama ps. | (shell commands) | render_executor |
| `render/render_executor.js` | Token-gated render orchestration. Coordinates VRAM phases + Fooocus client. | vram_manager, ollama_translate, precheck.validateToken | orchestrator |
| `critic/rule_critic.js` | Layer 1: 5 rule-based checks (negative space, symmetry, texture, smoothness, subject ratio). | (injectable analyzer) | critic_merge |
| `critic/vision_critic.js` | Layer 2: 3 VLM-based detections (plastic look, depth, over-polish). | (injectable VLM backend) | critic_merge |
| `critic/critic_merge.js` | Combines rule*0.6 + vision*0.4. Defense-in-depth verdicts. | rule_critic, vision_critic | orchestrator |
| `drift/identity_score.js` | 6-dimension Canon identity scoring (silhouette, material, mask, blade, color, anti-polish). | (injectable analyzer) | drift_detector |
| `drift/narrative_score.js` | E-I-P-R phase alignment + tone + continuity scoring. | (injectable analyzer) | drift_detector |
| `drift/drift_detector.js` | Final drift assessment. 11 flag types. Verdict + refineability. | identity_score, narrative_score | orchestrator |
| `memory/audit_serializer.js` | Trace entry builder, delta records, serialization/deserialization. | (none — leaf module) | notion_logger, orchestrator |
| `memory/notion_logger.js` | Notion API write with exponential backoff, DLQ, partial updates. | audit_serializer | orchestrator |

## Data Flow Between Modules

```
job.json
  → orchestrator reads identity, narrative, strategy, art_direction
    → precheck receives all 4 blocks, returns scores + decision + token
      → mapper.normalize receives art_direction, returns structured_prompt_spec
        → translate receives spec, returns positive_prompt + negative_prompt
          → render_executor receives token + spec, calls Fooocus, returns image path + seed
            → runCritic receives image path, returns quality_score + verdict
              → detectDrift receives image path + narrative + critic result, returns identity_score + flags
                → postControl receives critic + drift results, returns final decision
                  → notion_logger receives full job state, writes to Notion
```

## Where Failures Can Happen

| Point | What Fails | System Response |
|---|---|---|
| PRE-CONTROL | Identity < 0.60, forbidden element, engagement bait | REJECT → FAIL → LOG → DONE |
| PRE-CONTROL | Identity 0.60–0.75, ambiguous narrative | REVIEW → HALT (human gate) |
| Middleware | Composition constraint violation (neg space < 0.40, symmetry disabled) | FAIL → LOG → DONE |
| Translator guard | Ollama adds concepts, tone shifts, persona, forbidden terms in positive | FAIL → LOG → DONE |
| Fooocus | GPU OOM, API unreachable, render crash | RENDER_FAILED → VRAM cleanup → FAIL → LOG → DONE |
| VRAM manager | Zombie processes, Ollama/Fooocus parallel conflict | VRAMConflictError, forceReset on unexpected error |
| Critic | quality_score < 0.60 | REJECT at POST-CONTROL |
| Drift | identity_score < 0.60, identity_erosion (3+ dimensions) | REJECT at POST-CONTROL (not refineable) |
| Drift | plastic_finish, symmetry_drift (refineable) | CONDITIONAL → loop back (up to 3x) |
| Notion | API 503, rate limit, auth failure | Exponential backoff (5 retries), then DLQ. Pipeline continues. |
| Notion | All retries exhausted | Entry saved to in-memory DLQ. Job still completes. Warning logged. |
