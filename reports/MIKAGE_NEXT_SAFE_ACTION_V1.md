# MIKAGE_NEXT_SAFE_ACTION_V1

**Updated:** 2026-05-15 — post MIKAGE_CHARACTER_ANCHOR_V1_PLAN

---

## CURRENT PIPELINE STATE

| Gate | Status |
|---|---|
| CANON_LOCKED | NO |
| ASSET_LOCKED | NO |
| PROMPT_LIBRARY | DRAFT — canon patch applied (v0.1) |
| PROMPT_TEST_SET | V0_1_READY — can run now |
| SOURCE_PACK | V1_PARTIAL — 13 refs built |
| SILHOUETTE | V1_LOCK_SPEC WRITTEN — B=primary, D=secondary |
| ANCHOR_PLAN | V1 WRITTEN — generation phases 1–4 defined |
| ANCHOR_STATUS | NOT GENERATED — plan ready, awaiting human execution |
| ACTIVE_PALETTE | Electric violet #8F00FF / #7B2FFF |
| CRIMSON_STATUS | LEGACY/DEPRECATED for Character V1 |

---

## NEXT_SAFE_TASK

```
TASK: MIKAGE_CHARACTER_ANCHOR_V1_GENERATION_TEST
GOAL: Human executes generation phases P1→P4 from anchor plan.
      Agent scores resulting outputs against review checklist.
      First output passing all gates becomes CHARACTER ANCHOR V1.

HUMAN RUNS:
  1. Open: reports/MIKAGE_CHARACTER_ANCHOR_V1_PLAN.md
  2. Run Phase 1 (P1-A, P1-B, P1-C) — silhouette geometry validation
  3. Run Phase 2 (P2-A, P2-B, P2-C) — material zone validation
  4. Run Phase 3 (P3-A, P3-B, P3-C) — full figure candidates
  5. Run Phase 4 — select best passing output as anchor candidate
  6. Save candidate as: docs/character/anchor/CHARACTER_ANCHOR_V1_CANDIDATE.png
  7. Return output to agent for formal scoring

AGENT DOES:
  - Score output against MIKAGE_CHARACTER_ANCHOR_V1_REVIEW_CHECKLIST.md
  - Write MIKAGE_CHARACTER_ANCHOR_V1_RECORD.md
  - Update handoff and pointer

TOOL: Fooocus (recommended) or ComfyUI txt2img
      DO NOT USE 09E INPAINTING WORKFLOW — no base image exists yet
MODEL: juggernautXL_v8Rundiffusion.safetensors
SETTINGS: Steps=35, CFG=7.5, Sampler=dpmpp_2m karras, Aspect=2:3
PROMPTS: Section 6 of MIKAGE_CHARACTER_ANCHOR_V1_PLAN.md (ready to paste)
CHECKLIST: reports/MIKAGE_CHARACTER_ANCHOR_V1_REVIEW_CHECKLIST.md

DO NOT:
  Render agent-side. Canon-lock. Asset-lock. Claim production-ready.
```

---

## PARALLEL (can run any time without agent)

```
1. Run MIKAGE_CHARACTER_PROMPT_TEST_SET_V0_1.md Steps 1–8
   (separate from anchor plan — cross-validates prompt library)
   File: docs/character/MIKAGE_CHARACTER_PROMPT_TEST_SET_V0_1.md
   Tool: Fooocus or ComfyUI txt2img

2. Commit + push all pending work:
   cd D:\KAGAMI-MZ_SYNC_PUSH_V2
   git add docs/character/references/
   git add docs/character/silhouette/
   git add reports/
   git add docs/character/MIKAGE_CHARACTER_PROMPT_LIBRARY_v0.1.md
   git add docs/handoff/00_LATEST_CODEX_HANDOFF.md
   git commit -m "character: anchor V1 plan + review checklist

   Source pack V1 (13 refs), silhouette lock spec (B=primary, D=secondary).
   Anchor plan: 4-phase generation path defined, prompts ready to paste.
   Review checklist: 7 sections, 6 instant rejects, 8 silhouette checks,
   10 material checks, 15 drift checks, scoring table, anchor gate.
   NEXT: MIKAGE_CHARACTER_ANCHOR_V1_GENERATION_TEST"
   git push
```

---

## LOWER PRIORITY (do not switch lanes)

```
OPS-DB-03:
  Verify proof_pack_status, website_status, store_delivery_log_status
  for all 20 tracks. Track 16 missing fields.
  Do not start until CHARACTER lane reaches anchor image.
```

---

## FORBIDDEN (standing rules)

```
Do not render.
Do not use ComfyUI runtime agent-side.
Do not use Blender.
Do not approve canon.
Do not asset-lock anything.
Do not call candidates production-ready.
Do not create film/video/short/shotlist tasks.
```

---

*MIKAGE_NEXT_SAFE_ACTION_V1 — updated 2026-05-15 — no canon approved — no assets locked*
