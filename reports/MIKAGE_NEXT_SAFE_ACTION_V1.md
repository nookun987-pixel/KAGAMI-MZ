# MIKAGE_NEXT_SAFE_ACTION_V1

**Updated:** 2026-05-15 — post canon conflict resolution
**Previous blocker:** RESOLVED — helmet/palette/hair discrepancies patched in prompt library v0.1

---

## CURRENT STATUS

Canon conflict resolution complete. Prompt library v0.1 now matches active Character V1 canon:
- Helmet: two ultra-narrow void-black sensor slits ✓
- Accent: electric violet #8F00FF ✓
- Hair: long heavy straight black hair ✓
- Crimson: marked legacy/deprecated ✓

---

## NEXT SAFE TASK

```
MIKAGE_CHARACTER_SOURCE_PACK_V1
Goal:   Build the minimum reference pack needed to run and score
        the character test set (Steps 1–8).
        Collect accessible locked references into one working folder
        so outputs can be compared against canon during review.

Actions:
  1. Copy SP-001 (UNIFIED_KEY_VISUAL_V4 copy) → docs/character/references/
  2. Copy SP-002 (ZENITH_BLADE_V2 copy)       → docs/character/references/
  3. Copy SP-003 (AUDIO_SHORT_VISUAL_CANON_V4) → docs/character/references/
  4. Copy good_ceramic discrimination samples (5 best) → docs/character/references/material/
  5. If user mounts D:\workspace\ComfyUI —
     copy HELMET_SIDE and HELMET_FRONT ortho refs → docs/character/references/helmet/
  6. Create MIKAGE_CHARACTER_SOURCE_PACK_V1_MANIFEST.md listing all files,
     their status, and their intended use during test set review

Output:
  docs/character/references/          (folder)
  docs/character/references/MIKAGE_CHARACTER_SOURCE_PACK_V1_MANIFEST.md

FORBIDDEN:
  - Do not render
  - Do not generate
  - Do not canon-lock or asset-lock
  - Do not add ComfyUI files unless that path is mounted

After source pack is built:
  Run generation from docs/character/MIKAGE_CHARACTER_PROMPT_TEST_SET_V0_1.md
  Step 1 first — helmet with sensor slits — compare against source pack references
```

---

## ALSO REQUIRED (before or during generation)

1. **Txt2img workflow** — `ASSET-BUILD-09E` is inpainting-only, cannot run Step 1–8.
   - Option A: Use Fooocus (simplest — paste prompt directly)
   - Option B: Save ComfyUI default workflow as `docs/handoff/MIKAGE_TXT2IMG_WORKFLOW_V1.json`

2. **Mount `D:\workspace\ComfyUI`** (optional but recommended) — gives access to:
   - `MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png`
   - `MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png`
   - Full component candidate set V1

---

## GENERATION READINESS CHECK

| Item | Status |
|---|---|
| Prompt library — helmet | ✓ PATCHED — sensor slits now correct |
| Prompt library — palette | ✓ PATCHED — #8F00FF violet active |
| Prompt library — hair | ✓ PATCHED — hair added to all full-body/silhouette prompts |
| Test set file | ✓ EXISTS — docs/character/MIKAGE_CHARACTER_PROMPT_TEST_SET_V0_1.md |
| Source pack references | ⚠ PENDING — MIKAGE_CHARACTER_SOURCE_PACK_V1 not yet built |
| Txt2img workflow | ⚠ PENDING — 09E workflow is inpainting-only |
| Canon rules alignment | ✓ RESOLVED |

---

*MIKAGE_NEXT_SAFE_ACTION_V1 — updated 2026-05-15 — no canon approved — no assets locked*
