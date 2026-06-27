# SYSTEM_BASELINE.md

Locked: 2026-03-23
Repo: `D:\KAGAMI-MZ`
Tests: 1015/1015 pass
Pipeline status: DONE / ALLOW
Codebase: 12,120 lines across 32 files, 0 npm dependencies

## System Overview

Mikage is a controlled creative operating system that enforces identity-first AI image generation through a strict 12-state pipeline. Every render job passes through precheck scoring, prompt normalization, translation, VRAM-managed rendering, dual-layer critic evaluation, drift detection, and audit logging to Notion. The system rejects beautiful output that is not Mikage. Silence is preferred over weak output. No step can bypass the control layer.

The system runs entirely on a local machine with Ollama for LLM translation (optional — LOCAL mode is default and recommended), Fooocus for Stable Diffusion rendering, and Notion API for persistent audit storage. All Canon identity rules (materials, colors, composition, forbidden elements) are hardcoded in `control/precheck.js` and `middleware/constraints.js`. There are no external config files for Canon data.

## Active Components

| Component | Role | Status |
|---|---|---|
| **Notion API** | Audit database — stores all job records, scores, traces, decisions | Auth OK, write OK |
| **Ollama** | LLM prompt translator (optional — LOCAL mode bypasses it) | Running, GPU offload OK |
| **Fooocus** | Stable Diffusion image renderer via API | Running, render OK |
| **Orchestrator** | End-to-end pipeline runner (`node orchestrator.js <job.json>`) | DONE / ALLOW confirmed |
| **Node.js** | Runtime for all modules (>=18 required) | Working |
| **nvidia-smi** | GPU VRAM monitoring + zombie process detection | Used by `vram_manager.js` |

## Current Model Names

| Model | Used By | Hardcoded Location |
|---|---|---|
| `llama3` | Ollama translator | `translator/ollama_translate.js` line 26, `render/vram_manager.js` line 262 |
| Stable Diffusion (via Fooocus) | Image rendering | Configured in Fooocus server, not in Mikage code |

## Active Endpoints

| Service | URL | Port | Used By |
|---|---|---|---|
| Ollama API | `http://localhost:11434/api/generate` | 11434 | `translator/ollama_translate.js`, `render/vram_manager.js` |
| Fooocus API | `http://localhost:7865` | 7865 | `render/render_executor.js` (via injectable client) |
| Notion API | `https://api.notion.com/v1/pages` | 443 | `memory/notion_logger.js` (via injectable client) |
| nvidia-smi | local CLI | N/A | `render/vram_manager.js` |

## Environment Variables In Use

Variables actually consumed by code at runtime:

| Variable | Consumed By |
|---|---|
| `MIKAGE_NOTION_DB` | `memory/notion_logger.js` |
| `TRANSLATOR_MODE` | `orchestrator.js` |
| `RENDER_WIDTH` | `orchestrator.js` |
| `RENDER_HEIGHT` | `orchestrator.js` |
| `RENDER_PERFORMANCE` | `orchestrator.js` |

Variables documented in `.env.example` but consumed by external services or not yet wired:

| Variable | For |
|---|---|
| `NOTION_API_KEY` | Notion SDK (external) |
| `OLLAMA_HOST` | Ollama server config |
| `OLLAMA_MODEL` | Ollama server config |
| `OLLAMA_KEEP_ALIVE` | Ollama server config |
| `FOOOCUS_API_URL` | Fooocus client (injectable) |
| `FOOOCUS_ALWAYS_HIGH_VRAM` | Fooocus server flag |
| `MAX_RENDER_ATTEMPTS` | Documented, uses hardcoded 3 in job schema |
| `LOG_LEVEL` | Documented, not yet consumed |

## Exact Repo Root Path

```
D:\KAGAMI-MZ
```

## What Is Confirmed Working

- Full pipeline: INGESTED → STRUCTURED → PRECHECKED → NORMALIZED → TRANSLATED → RENDERING → CRITIQUED → DRIFT_CHECKED → POSTCHECKED → DECIDED → LOGGED → DONE
- State machine: all valid transitions enforced, invalid transitions throw
- Precheck: Canon identity/narrative/strategic scoring, token issuance on ALLOW
- Middleware: deterministic mood→lighting, material→texture, style→composition mapping
- Translator: LOCAL mode assembly passes guard 100% of the time
- Translator guard: 7-check validation catches tone shift, persona injection, narrative break, forbidden terms, negative prompt drops
- VRAM manager: sequential lifecycle with zombie detection (mocked in test, real nvidia-smi in production)
- Render executor: token-gated, VRAM-managed render with Fooocus client injection
- Critic: rule-based (5 checks) + vision-based (3 detections), weighted merge, defense-in-depth verdicts
- Drift detector: 6-dimension identity scoring, E-I-P-R narrative alignment, 11 drift flag types, refineability check
- Notion logger: creates entries, partial updates, final audit records, exponential backoff with jitter, dead letter queue
- Audit serializer: structured trace entries, delta records, serialization within Notion 2000-char limits
- Controlled feedback loop: max 3 attempts, terminal drift stops loop immediately
- Test suite: 1015 assertions across 10 test files, 0 failures
