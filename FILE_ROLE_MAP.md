# FILE_ROLE_MAP.md

Locked: 2026-03-23
Total files: 32
Total lines: 12,120

## Criticality Legend

- **CRITICAL** — Modifying this file can break the pipeline. Requires full re-test.
- **IMPORTANT** — Key functionality. Changes need targeted re-test of affected module.
- **SUPPORT** — Test, config, or doc file. Changes do not affect runtime.
- **OPTIONAL** — Example or reference. Not loaded at runtime.

## Root Files

| File | Lines | Role | Criticality |
|---|---|---|---|
| `orchestrator.js` | 504 | End-to-end pipeline coordinator. Owns the render loop, state transitions, all decision routing, and Notion write orchestration. The main entry point. | **CRITICAL** |
| `orchestrator.test.js` | 225 | E2E pipeline test. 35 assertions. Verifies full INGESTED→DONE flow, PRE_CONTROL rejection, constraint violation handling, postControl decision matrix. | SUPPORT |
| `package.json` | 25 | NPM metadata. Script aliases for test commands. No dependencies (0 npm packages). | SUPPORT |
| `.env.example` | 36 | Template for environment variables. Not loaded by code — operator copies to `.env`. | OPTIONAL |
| `README_run.md` | 80 | Operational guide. Module map, decision table, hard rules summary. | OPTIONAL |

## core/

| File | Lines | Role | Criticality |
|---|---|---|---|
| `state_machine.js` | 330 | Strict linear state transitions. Defines all valid states (15), transition map, `applyTransition()` (immutable job updates), `failJob()`, `createJob()` factory. Every other module depends on this indirectly through orchestrator. | **CRITICAL** |
| `state_machine.test.js` | 375 | 90 assertions. Tests happy path, fail path, review path, reject path, refine loop, invalid transitions, immutability, unknown states. | SUPPORT |

## control/

| File | Lines | Role | Criticality |
|---|---|---|---|
| `precheck.js` | 620 | PRE-CONTROL gate. Contains the hardcoded `CANON` object (single source of truth for all identity rules). Scores identity/narrative/strategic alignment. Issues control tokens on ALLOW. Exports `validateToken()` used by render_executor. Exports `CANON` used by translator_guard. | **CRITICAL** |
| `precheck.test.js` | 480 | 72 assertions. Tests Canon data integrity, perfect job ALLOW, non-Canon material REVIEW, forbidden element REJECT, engagement bait REJECT, cheerful mood penalty, glam drift, negative space violation, token issuance/validation/expiry. | SUPPORT |

## middleware/

| File | Lines | Role | Criticality |
|---|---|---|---|
| `constraints.js` | 280 | Hard constraint values. `HARD_CONSTRAINTS` object with locked thresholds (negative_space >= 0.40, broken_symmetry = true, etc). `NEGATIVE_PROMPT_CORE` array (67 anti-AI/anti-Canon terms). `TEXTURE_REQUIREMENTS`, `MICRO_HUMANITY_MOTIFS`. Composition validation with REJECT on violation. Exports used by mapper.js and translator_guard.js. | **CRITICAL** |
| `mapper.js` | 530 | Deterministic mapping tables. 18 mood→lighting entries, 14 material→texture entries, 8 style→composition entries. `normalize()` assembles the full `structured_prompt_spec`. Injects locked subject identity. Compiles negative prompt. Rejects on constraint violation. | **CRITICAL** |
| `middleware.test.js` | 430 | 169 assertions. Tests constraint data integrity, negative prompt compilation/dedup/sort, composition validation (all 4 rules), all mapping directions, locked subject text, full normalize pipeline, determinism verification. | SUPPORT |

## translator/

| File | Lines | Role | Criticality |
|---|---|---|---|
| `translator_guard.js` | 540 | 7-check validation of translator output. Checks: output structure, added concepts (vocabulary diff), tone shift (40+ emotional markers), persona creation (28+ narrative markers), narrative break (18+ structural markers), Canon forbidden in positive, negative prompt preservation (80% threshold). Returns PASS or REJECT. Builds stricter re-translate input on rejection. | **CRITICAL** |
| `translator_guard.test.js` | 428 | 70 assertions. Tests each check individually, good translation PASS, tone shift/persona/narrative/forbidden REJECT, dropped negatives, multiple violations stacking, stricter input builder, empty spec edge case. | SUPPORT |
| `ollama_translate.js` | 490 | Two-mode translator. LOCAL mode: deterministic string assembly (default, zero drift, always passes guard). OLLAMA mode: sends to local Ollama with temperature=0, validates with guard, retries up to 2x. Filters meta-rules from positive prompt. Extracts technical notes. | **IMPORTANT** |
| `ollama_translate.test.js` | 489 | 136 assertions. Tests cleanSegment, isMetaRule, prompt assembly (full + minimal), dedup, negative assembly, technical notes extraction, LOCAL determinism, guard integration, Ollama payload builder, response parser (clean/markdown/embedded/garbage JSON), content integrity, prompt order. | SUPPORT |

## render/

| File | Lines | Role | Criticality |
|---|---|---|---|
| `vram_manager.js` | 420 | Sequential VRAM lifecycle with phase state machine. Enforces: no parallel Ollama + Fooocus, OLLAMA_KEEP_ALIVE=0, clear VRAM between phases. Zombie GPU process detection via nvidia-smi + ollama ps cross-reference. Kill zombies. Force reset on emergency. Injectable shell executor for testing. | **CRITICAL** |
| `render_executor.js` | 310 | Token-gated render orchestration. `enforceToken()` blocks all renders without valid precheck token. Coordinates: Ollama VRAM phase → translate → Fooocus VRAM phase → render → cleanup. Injectable Fooocus client. VRAM force reset on unexpected errors. | **CRITICAL** |
| `render.test.js` | 530 | 98 assertions. Tests VRAM initial state, load/unload Ollama + Fooocus, parallel block, double load block, unload without load, clear, zombie detection/kill, resource conflict, force reset, full lifecycle, token enforcement (valid/mismatch/null/expired), render packet builder, full executeRender, Fooocus failure + VRAM cleanup, abort, shell commands. | SUPPORT |

## critic/

| File | Lines | Role | Criticality |
|---|---|---|---|
| `rule_critic.js` | 300 | Layer 1: 5 rule-based checks (negative space, symmetry, texture variation, surface smoothness, subject ratio). Weighted aggregate. Any single check < 0.40 = automatic FAIL. Injectable image analyzer. | **IMPORTANT** |
| `vision_critic.js` | 230 | Layer 2: 3 VLM detections (plastic look, lack of depth, over-polish). Task-aligned prompt for VLM. Score = 1.0 - confidence. Injectable VLM backend. | **IMPORTANT** |
| `critic_merge.js` | 120 | Combines: quality_score = rule * 0.6 + vision * 0.4. Defense-in-depth: either layer FAIL → overall REJECT. Either layer REVIEW → caps at REVIEW. | **CRITICAL** |
| `critic.test.js` | 550 | 106 assertions. Tests thresholds, perfect image PASS, each individual check failure, all-fail, borderline REVIEW, catastrophic single check, vision detections, individual evaluators, clamping, merge formula, merge verdicts (8 combinations), full pipeline good/bad, rule pass + vision fail, rule fail + vision pass. | SUPPORT |

## drift/

| File | Lines | Role | Criticality |
|---|---|---|---|
| `identity_score.js` | 170 | 6-dimension Canon identity scoring: silhouette (0.20), material (0.20), mask (0.15), blade (0.15), color (0.15), anti_polish (0.15). Weights sum to 1.0. Any dimension < 0.60 = failed. Injectable analyzer. | **IMPORTANT** |
| `narrative_score.js` | 310 | E-I-P-R phase alignment. `inferPhase()` maps chapter strings to phases. `scoreIntensityAlignment()` checks perceived intensity against phase range. `scoreToneAlignment()` against Canon tone vocabulary. `scoreContinuityCoherence()` against continuity_notes. Injectable analyzer. | **IMPORTANT** |
| `drift_detector.js` | 340 | Final drift assessment. `detectFlags()` produces 11 drift flag types from identity + narrative + critic cross-reference. `determineVerdict()` with hard gates (identity < 0.60 = REJECT, identity_erosion = REJECT). `isRefineable()` classifies terminal vs fixable drift. | **CRITICAL** |
| `drift.test.js` | 480 | 104 assertions. Tests markers integrity, weight sum, computeIdentityScore (good/bad/mixed/empty/clamping), pipeline, phase inference, intensity/tone/continuity scoring, full scoreNarrative, flags integrity, determineVerdict (11 cases), isRefineable (9 cases), detectFlags, full detectDrift (good/bad/plastic/with critic), null path. | SUPPORT |

## memory/

| File | Lines | Role | Criticality |
|---|---|---|---|
| `audit_serializer.js` | 310 | Trace entry builder: `createTraceEntry(step, result, detail?)`. Immutable `appendTrace()`. Query helpers. Entry/trace validation (structure + chronological order). Delta records for efficient storage. Serialization within Notion 2000-char limits. | **IMPORTANT** |
| `notion_logger.js` | 390 | Notion API write layer. `buildProperties()` maps all 22 required fields to Notion property types. `createJobEntry()`, `updateJobState()` (partial), `writeAuditRecord()` (final). Exponential backoff with jitter (5 retries, 1s–60s). Dead letter queue for failed writes. Injectable Notion client. | **CRITICAL** |
| `memory.test.js` | 520 | 135 assertions. Tests trace creation/append/query/validation, chronological order detection, delta records, serialization roundtrip, property builder (full + empty), job validation, createJobEntry, updateJobState (partial), writeAuditRecord, DLQ (send/get/replay/clear), retryWithBackoff (success/retry/exhaust), failed write → DLQ, partial update isolation. | SUPPORT |

## scripts/

| File | Lines | Role | Criticality |
|---|---|---|---|
| `run_all_tests.js` | 60 | Aggregate test runner. Executes all 10 test files, parses RESULTS lines, reports total. | SUPPORT |

## examples/

| File | Lines | Role | Criticality |
|---|---|---|---|
| `job_sample.json` | 45 | Sample Canon-compliant job input. Used by `node orchestrator.js examples/job_sample.json`. | OPTIONAL |

## Summary

| Criticality | Count | Files |
|---|---|---|
| **CRITICAL** | 10 | orchestrator.js, state_machine.js, precheck.js, constraints.js, mapper.js, translator_guard.js, vram_manager.js, render_executor.js, critic_merge.js, drift_detector.js, notion_logger.js |
| **IMPORTANT** | 5 | ollama_translate.js, rule_critic.js, vision_critic.js, identity_score.js, narrative_score.js, audit_serializer.js |
| SUPPORT | 12 | All *.test.js files + run_all_tests.js |
| OPTIONAL | 4 | .env.example, README_run.md, job_sample.json, package.json |
