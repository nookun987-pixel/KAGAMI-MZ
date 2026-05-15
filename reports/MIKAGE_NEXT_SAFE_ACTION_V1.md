# MIKAGE_NEXT_SAFE_ACTION_V1

**Updated:** 2026-05-15 — post MIKAGE_CHARACTER_ANCHOR_V1_GENERATION_TEST (FAIL — GENERATION_BLOCKER)

---

## CURRENT PIPELINE STATE

| Gate | Status |
|---|---|
| CANON_LOCKED | NO |
| ASSET_LOCKED | NO |
| PROMPT_LIBRARY | DRAFT — canon patch applied (v0.1) |
| SOURCE_PACK | V1_PARTIAL — 13 refs built |
| SILHOUETTE | V1_LOCK_SPEC WRITTEN — B=primary, D=secondary |
| ANCHOR_PLAN | V1 WRITTEN — generation phases 1–4 defined |
| ANCHOR_STATUS | **BLOCKED — no qualifying full-body generation exists in repo** |
| ANCHOR_CANDIDATES_DIR | `docs/character/anchor_v1_candidates/` — CREATED, EMPTY |
| ACTIVE_PALETTE | Electric violet #8F00FF / #7B2FFF |
| KNOWN_DRIFT_RISK | Low-poly face mask drift (EX-01 confirmed) |

---

## BLOCKER

```
Agent cannot generate images.
ComfyUI at localhost:8188 unreachable from Linux sandbox (EXIT:7).
Standing rules: no render agent-side.
All existing repo images fail anchor gate (see TEST_REPORT).
```

---

## NEXT_SAFE_TASK — HUMAN GENERATION RUN

```
REQUIRED HUMAN ACTION:
  Open Fooocus on Windows (or ComfyUI txt2img)
  DO NOT use the 09E inpainting workflow — requires base image, none exists yet
  Load model: juggernautXL_v8Rundiffusion.safetensors

  RUN P3-A FIRST (sword planted primary):
    Positive + Negative: reports/MIKAGE_CHARACTER_ANCHOR_V1_PLAN.md Section 6
    Settings: Steps=35, CFG=7.5, dpmpp_2m karras, 2:3 portrait
    Batch: 5–8 seeds

  HARDENED ADDITIONS (add before running — addresses EX-01 face mask drift):
    Positive addition: sealed matte white porcelain helmet no facial features,
      two ultra-narrow horizontal void-black sensor slits at eye level only,
      no face shape no nose no mouth no chin no jaw
    Negative addition: face mask, polygon face, low poly face, faceted face,
      geometric face, open face, visor face, human face shape, face topology,
      face plate, iron man mask

  SAVE all outputs (even partial candidates) to:
    docs/character/anchor_v1_candidates/
    Name format: P3A_seed[number]_[brief_note].png

  RETURN to agent with list of saved filenames.
  Agent runs full checklist and scores each image.

  IF P3-A produces no passing candidates after 8 seeds:
    Run P3-B (three-quarter view) — same settings
  IF P3-B also fails:
    Run P3-C (atmospheric presence) — same settings
```

---

## REFERENCE: KNOWN DRIFT PATTERNS

From EX-01 failure (GOOGLE_LANE_E2E_001 low-poly face mask):

| Drift type | Description | Negative to add |
|---|---|---|
| Face mask drift | Model produces geometric face mask instead of sealed helmet | `face mask, polygon face, low poly face, faceted face, geometric face` |
| Eye socket drift | Dark oval holes = eye sockets, not sensor slits | `eye sockets, eye holes, circular eye, oval eye, face eye` |
| Face topology drift | Low-poly triangulated face geometry | `face topology, facial structure, nose bridge, jaw line` |

From EX-02 observation (LOCKED helmet close-up):
- Model CAN produce sealed helmet with correct proportions and violet halo
- Slit design historically defaulted to angular/V-shape before spec was written
- Prompt must explicitly specify: `two ultra-narrow HORIZONTAL parallel void-black sensor slits` — the word "horizontal" and "parallel" are critical

---

## POSITIVE: WHAT IS READY TO RUN

```
Prompts: MIKAGE_CHARACTER_ANCHOR_V1_PLAN.md Section 6 — 3 prompts ready to paste
Checklist: MIKAGE_CHARACTER_ANCHOR_V1_REVIEW_CHECKLIST.md — 7 sections ready
Output dir: docs/character/anchor_v1_candidates/ — created and empty
Model: juggernautXL_v8Rundiffusion.safetensors (confirmed in 09E workflow)
Settings: Steps=35, CFG=7.5, dpmpp_2m karras confirmed from 09E workflow
```

---

## PARALLEL (can run without waiting)

```
Commit + push all pending work:
  cd D:\KAGAMI-MZ_SYNC_PUSH_V2
  git add docs/character/ reports/ docs/handoff/
  git commit -m "character: anchor V1 plan + generation test report (BLOCKER)

  Anchor plan V1: 4 phases, 3 paste-ready prompts, material zones 1-5.
  Review checklist: 7 sections, IR/SG/MZ/drift/scoring/anchor/reject gates.
  Generation test: FAIL — all existing images fail IR gate. No full-body exists.
  EX-01 drift documented: low-poly face mask (juggernautXL default).
  Hardened prompt additions written. Anchor candidates dir created.
  NEXT: Human runs P3-A in Fooocus → save to anchor_v1_candidates/"
  git push
```

---

## FORBIDDEN (standing rules)

```
Do not render agent-side.
Do not use ComfyUI runtime from sandbox.
Do not use Blender.
Do not approve canon.
Do not asset-lock anything.
Do not call candidates production-ready.
Do not create film/video/short/shotlist tasks.
```

---

*MIKAGE_NEXT_SAFE_ACTION_V1 — updated 2026-05-15 — ANCHOR BLOCKED — human generation required*
