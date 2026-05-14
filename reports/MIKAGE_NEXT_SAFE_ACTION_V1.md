# MIKAGE_NEXT_SAFE_ACTION_V1

**Updated:** 2026-05-15 — post MIKAGE_CHARACTER_SOURCE_PACK_V1
**Previous blocker:** RESOLVED — source pack built

---

## CURRENT STATUS

Source pack built. 13 reference files in `docs/character/references/`. One gap: no isolated helmet reference (ComfyUI not mounted). Workaround available via SP-001 full-character frame.

| Item | Status |
|---|---|
| Prompt library | ✓ Canon-patched — helmet slits, violet, hair |
| Test set | ✓ Ready — docs/character/MIKAGE_CHARACTER_PROMPT_TEST_SET_V0_1.md |
| Source pack | ✓ Built — docs/character/references/ (13 files) |
| Isolated helmet ref | ⚠ MISSING — mount ComfyUI to resolve |
| Txt2img workflow | ⚠ PENDING — use Fooocus or save ComfyUI default |

---

## NEXT SAFE TASK

```
MIKAGE_SILHOUETTE_CANON_V1
Goal:   Define the locked silhouette specification for Character V1.
        Extract silhouette rules from prompt library, structured rules, and world core.
        Create a single authoritative silhouette reference document
        combining: shape hierarchy, proportion rules, read-distance requirements,
        hair mass position, sword diagonal angle, pauldron-to-head width ratio.
        Generate a canon SVG silhouette diagram (no AI generation — vector only).

Input:
  docs/character/MIKAGE_CHARACTER_PROMPT_LIBRARY_v0.1.md (Section 2.2)
  MIKAGE_STRUCTURED_RULES.json (body, silhouette rules)
  MIKAGE_WORLD_CORE.json (silhouette_rules, readability)
  docs/character/references/mask_body_silhouette/REF_SP001_UNIFIED_KEY_VISUAL_V4__MASK_BODY_SILHOUETTE.png

Output:
  docs/character/MIKAGE_SILHOUETTE_CANON_V1.md
    — Shape hierarchy with proportions
    — Sensor slit position on helmet
    — Hair mass: position, volume, direction
    — Sword diagonal angle range
    — Pauldron width ratio (vs head)
    — Read-distance rules
  docs/character/MIKAGE_SILHOUETTE_CANON_V1.svg
    — Canon silhouette diagram (vector, no AI)

FORBIDDEN:
  Do not render. Do not generate images. Do not canon-lock. Do not asset-lock.
```

---

## OPTIONAL BEFORE SILHOUETTE CANON

```
If user mounts D:\workspace\ComfyUI:
  Copy MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png
  and MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png
  into docs/character/references/helmet/
  → Enables proper isolated helmet review for Steps 1 and 5
```

---

## GENERATION READINESS

All blockers resolved for running MIKAGE_CHARACTER_PROMPT_TEST_SET_V0_1 Steps 1–8 when ready. Use Fooocus (simplest) or ComfyUI default txt2img workflow. Score each output against source pack references in `docs/character/references/`.

---

*MIKAGE_NEXT_SAFE_ACTION_V1 — updated 2026-05-15 — no canon approved — no assets locked*
