# CODEGRAPH MIKAGE TEST REPORT V0

Date: 2026-05-23
Repo tested: `D:\KAGAMI-MZ_SYNC_PUSH_V2`
Tool tested: `@colbymchenry/codegraph@0.9.3`
Official README: https://github.com/colbymchenry/codegraph

## Required Status

install_success: YES
index_success: YES
repo_path_indexed: `D:\KAGAMI-MZ_SYNC_PUSH_V2`
files_detected_count: 608 files reported by `codegraph status`; 606 file nodes indexed
useful_for_mikage: YES
next_safe_task: Review this report, then decide whether `.codegraph/` should be kept, ignored, or deleted before any commit.

## Environment Check

Node/npm were available:

- `node --version`: `v24.13.1`
- `npm --version`: `11.8.0`

CodeGraph was installed/used through `npx @colbymchenry/codegraph`, following the README command pattern.

## Index Result

Commands used:

- `npx @colbymchenry/codegraph init D:\KAGAMI-MZ_SYNC_PUSH_V2`
- `npx @colbymchenry/codegraph index D:\KAGAMI-MZ_SYNC_PUSH_V2`
- `npx @colbymchenry/codegraph status D:\KAGAMI-MZ_SYNC_PUSH_V2`

Index summary:

- `.codegraph/` created: YES
- `.codegraph/codegraph.db` created: YES
- `.codegraph/.gitignore` created: YES
- Files: 608
- Nodes: 6,658
- Edges: 15,027
- DB size: 15.92 MB
- Backend: `node:sqlite built-in`
- Indexed languages reported: JavaScript, Python, YAML
- Status: index up to date

## CodeGraph Query Checks

### Where is the latest handoff file?

CodeGraph returned code-symbol context from `system_visualization/flow_snapshot_writer.py`, including `LATEST_MD_PATH`, `LATEST_JSON_PATH`, and `find_latest_run_dir`.

Evaluation: PARTIAL. CodeGraph found code related to latest generated flow snapshots, but did not identify the operator handoff document.

Direct repo evidence:

- `docs/handoff/00_LATEST_CODEX_HANDOFF.md`

### Where is the master control board?

CodeGraph returned:

- `lib/master_control.js`
- `telegram_bot/router.js`

Evaluation: PARTIAL. CodeGraph correctly found the master control implementation, but no explicit Markdown "master control board" document path was confirmed.

Direct repo evidence:

- `lib/master_control.js`
- `telegram_bot/router.js`
- `AUDIT_SYSTEM_STATE.md` references `lib/master_control.js` as master control.

### Where is the Mikage public engine standard?

CodeGraph returned rule-engine code symbols such as `runRuleEngine` in validator files.

Evaluation: MISS for the operating standard document.

Direct repo evidence:

- `MIKAGE_PUBLIC_ENGINE_OPERATING_STANDARD_V1.md`
- `docs/handoff/00_LATEST_CODEX_HANDOFF.md` references `PUBLIC_ENGINE_STANDARD_FILE = D:\KAGAMI-MZ_SYNC_PUSH_V2\MIKAGE_PUBLIC_ENGINE_OPERATING_STANDARD_V1.md`

### Where are Lane B music/public files tracked?

CodeGraph returned run tracker and failure tracking code symbols.

Evaluation: PARTIAL/MISS for the public operating file locations.

Direct repo evidence:

- `public_engine/track_packages`
- `public_engine/render_packages`
- `public_engine/gpt_web_render_archive`
- `docs/handoff/00_LATEST_CODEX_HANDOFF.md` references these public engine package and archive paths.

### What file should an agent read first before doing Mikage work?

CodeGraph returned general code reader symbols such as `readJson`, `readRunJson`, and a test variable named `first`.

Evaluation: MISS for the operating instruction.

Direct repo evidence:

- `docs/handoff/MIKAGE_AGENT_READ_FIRST_PROMPT.txt`
- `docs/handoff/MIKAGE_SINGLE_OPERATOR_MEMORY.md`
- `AGENTS.md`

The direct read-first prompt says to read `docs/handoff/MIKAGE_SINGLE_OPERATOR_MEMORY.md` before any Mikage task.

## Errors And Limits

- `rg.exe` failed in this repo with `Access is denied`; PowerShell `Get-ChildItem` plus `Select-String` was used as fallback for direct repo evidence.
- CodeGraph indexed code-oriented files and reported JavaScript, Python, and YAML. It did not reliably answer questions whose source of truth is Markdown operating documentation.
- No explicit master control board document path was conclusively identified; CodeGraph and direct search point to the master control implementation at `lib/master_control.js`.

## Mikage Usefulness Assessment

CodeGraph is useful for Mikage code navigation, especially finding implementation symbols, classes, functions, imports, and routes. It is not sufficient by itself for operator handoff, Lane B public file tracking, or source-of-truth process questions unless those documents are indexed or paired with direct text search.

Final assessment:

useful_for_mikage: YES, with the limitation that operational Markdown handoff questions still require direct file search or a documentation-aware index.

## Safety Notes

- No music/audio masters were modified.
- No rendered MP4 files were modified.
- No release metadata was modified.
- No TooLost catalog values were modified.
- No website production files were modified.
- No commit was made.
