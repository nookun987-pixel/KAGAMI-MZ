# MIKAGE_NEXT_SAFE_ACTION_V1

**Updated:** 2026-05-15 — post MIKAGE_SILHOUETTE_CANON_V1

---

## CURRENT STATUS

4 silhouette candidates created as SVG (A/B/C/D) + thumbnail readability sheet.
A, B, D scored STRONG (90–91). C scored CONDITIONAL (85).
**Human visual review required before selecting primary silhouette.**

---

## IMMEDIATE HUMAN ACTION REQUIRED

Open these files and visually review at screen size:

```
docs/character/silhouette/SILHOUETTE_THUMBNAIL_SHEET.svg   ← start here
docs/character/silhouette/SILHOUETTE_A_THE_DIAGONAL.svg
docs/character/silhouette/SILHOUETTE_B_THE_MONOLITH.svg
docs/character/silhouette/SILHOUETTE_C_THE_CARRY.svg
docs/character/silhouette/SILHOUETTE_D_THE_PRESENCE.svg
```

Step back from screen. Check: helmet readable? sword slab readable? hair mass readable?
Return your verdict: which 1–2 candidates to carry forward.

---

## NEXT AGENT TASK (after human selects candidate)

```
MIKAGE_SILHOUETTE_CANON_V1_LOCK_SPEC
Goal:   Write the locked silhouette spec document based on selected candidate.
        Define exact proportions from the chosen SVG geometry:
          — helmet rx/ry ratio
          — pauldron width ratio vs helmet
          — sword dimensions and angle
          — hair mass position and volume
          — cloak hierarchy
          — negative space rules
        Create MIKAGE_SILHOUETTE_CANON_V1.md as authoritative spec.

Input:  Human selection from A/B/C/D
        docs/character/silhouette/SILHOUETTE_[X]_[NAME].svg (selected)

Output: docs/character/MIKAGE_SILHOUETTE_CANON_V1.md

FORBIDDEN: Do not canon-lock. Do not render. Do not asset-lock.
```

---

## PARALLEL PATH — generation can start now

The prompt library is patched and the source pack is built. Generation does not need to wait for silhouette lock. Run character test set Steps 1–8 independently at any time:

```
File: docs/character/MIKAGE_CHARACTER_PROMPT_TEST_SET_V0_1.md
Tool: Fooocus (simplest) or ComfyUI default txt2img workflow
Start: Step 1 — Helmet with sensor slits
Compare: docs/character/references/ (SP-001, material refs)
```

---

*MIKAGE_NEXT_SAFE_ACTION_V1 — updated 2026-05-15 — no canon approved — no assets locked*
