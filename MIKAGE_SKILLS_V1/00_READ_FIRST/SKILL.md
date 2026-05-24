---
name: mikage-read-first
description: Mikage operating baseline for any AI, Codex, or Claude tab before doing Mikage work. Use before media, release, catalog, caption, handoff, discovery, or task-writing work.
---

# Mikage Read First

## Purpose

Use this skill as the first working-method reference before any Mikage task. This Skill Pack is a source of reusable instructions, not an autonomous agent or new agent framework.

## Required Read Order

Before action, read:

1. `docs/handoff/MIKAGE_SINGLE_OPERATOR_MEMORY.md`
2. `docs/handoff/00_LATEST_CODEX_HANDOFF.md`
3. `docs/handoff/MIKAGE_AGENT_READ_FIRST_PROMPT.txt`
4. The relevant `MIKAGE_SKILLS_V1/*/SKILL.md` file for the task.

Use recorded facts from memory, catalog, and handoff. Do not ask again for information already recorded there.

## Lanes

Lane A is public/release-facing work: captions, links, promotion, discovery, short videos, music visualizers, and final deliverables.

Lane B is internal production work: character pipeline, asset planning, diagnostics, gates, review reports, and repository handoffs.

Keep Lane A and Lane B separate unless the operator explicitly bridges them.

## CHUA_XAC_NHAN Rule

If a fact is missing, uncertain, or not source-confirmed, write `CHUA_XAC_NHAN`.

Do not infer:

- release status
- public link status
- live/searchable status
- approval status
- final/pass status
- source audio identity

## Pass Rule

Do not claim `PASS`, `DONE`, `LIVE`, `APPROVED`, or `FINAL` unless the required files or source evidence have been checked.

For media work, verify with tool output before reporting success.

For text/task work, read back created or updated files before reporting success.

## Safety Rules

- Do not edit media files unless the task explicitly allows it.
- Do not touch approved finals unless explicitly instructed.
- Do not reopen closed repair batches unless the operator explicitly selects that work.
- Do not create a new agent framework from this Skill Pack.
- Do not add external dependencies unless explicitly approved.
