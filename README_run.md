# MIKAGE — Controlled Creative OS

## Requirements

- Node.js >= 18
- Ollama (local, for OLLAMA translator mode only)
- Fooocus (local, for image rendering)
- Notion API key (for audit logging)

## Setup

```bash
cp .env.example .env
# Edit .env with your Notion database ID and API key
```

## Run Tests (980+ assertions)

```bash
node scripts/run_all_tests.js
```

## Run Single Job

```bash
node orchestrator.js examples/job_sample.json
```

## Pipeline Flow

```
INGESTED → STRUCTURED → PRECHECKED → NORMALIZED → TRANSLATED →
RENDERING → CRITIQUED → DRIFT_CHECKED → POSTCHECKED → DECIDED →
LOGGED → DONE
```

## Module Map

```
mikage/
  orchestrator.js              End-to-end pipeline runner
  package.json
  .env.example

  core/
    state_machine.js           Strict linear state transitions

  control/
    precheck.js                PRE-CONTROL gate (identity/narrative/strategic scoring)

  middleware/
    constraints.js             Canon hard constraints + negative prompt core
    mapper.js                  mood→lighting, material→texture, style→composition

  translator/
    translator_guard.js        Validates Ollama output (7 checks, any fail = REJECT)
    ollama_translate.js        LOCAL deterministic assembly or OLLAMA LLM translation

  render/
    vram_manager.js            Sequential VRAM lifecycle, zombie detection
    render_executor.js         Token-gated render orchestration

  critic/
    rule_critic.js             Layer 1: negative space, symmetry, texture, smoothness
    vision_critic.js           Layer 2: plastic look, depth, over-polish (VLM)
    critic_merge.js            quality_score = (rule * 0.6) + (vision * 0.4)

  drift/
    identity_score.js          6 Canon dimensions (silhouette, material, mask, blade, color, anti-polish)
    narrative_score.js         E-I-P-R phase alignment + tone + continuity
    drift_detector.js          11 drift flags, verdict, refineability check

  memory/
    audit_serializer.js        Trace entry builder, delta records, serialization
    notion_logger.js           Notion write with backoff, DLQ, all 22 required fields

  scripts/
    run_all_tests.js           Aggregate test runner

  examples/
    job_sample.json            Sample Canon-compliant job input
```

## Decisions

| Decision | Meaning |
|---|---|
| ALLOW | All checks pass, token issued, pipeline continues |
| REVIEW | Human gate required, pipeline halted |
| REJECT | Hard violation, pipeline terminated |
| AUTO_SAFE | Ambiguous but safe, draft only, no publish |
| CONDITIONAL | Refineable issues, loop back (max 3 attempts) |
| PASS | Final output accepted |

## Hard Rules

- Identity over engagement
- Imperfection over polish
- Silence over weak output
- Stop over unfixable loop
- Reject beautiful non-Mikage
