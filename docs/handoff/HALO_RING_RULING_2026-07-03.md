# HALO RING RULING — 2026-07-03

STATUS: **OPERATOR-LOCKED CANON RULING.** Not asset-locked, not a render approval — this is a
color/identity rule, enforced going forward. Written by Cowork at operator's explicit instruction;
the ruling itself is the operator's, not proposed or inferred by Cowork.

SOURCE: operator message 2026-07-03, following a build-log review of `MIKAGE_BUILDLOG_STANDING_HERO_V0_7.mp4`
that flagged the halo ring as "silently becoming canon by repetition" across V0.7/V0.8/V0.12/standing-hero
renders without ever being formally locked. Operator reviewed the master 2D sheet
(`production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png`) and the existing `AGENTS.md`
immutable-marks language, then ruled explicitly: **"Giữ trắng."** ("Keep it white.")

---

## THE RULING

- **Halo ring = CANON.** It is the 4th character mark, alongside: faceless porcelain helmet · exactly
  two sensor slits · graphene neck. (Previously only 3 marks were treated as unambiguously locked; halo
  ring is now formally the 4th.)
- **Halo = WHITE porcelain. NEVER violet, at any state.**
- **Violet = ONLY the two sensor slits, at any state. Never anywhere else** (not on the halo, not on the
  body, not on the blade, not as background wash).

## STATE MACHINE (canon reference — not an asset lock)

This describes how the mark set behaves across the entity's states. It is a canon reference for future
lookdev/animation/render work, not a statement that any of these states are currently built or approved
as assets.

- **S0 · DORMANT (default, ~99% of the time):** slits dark / low ember · halo MATTE white, catching key
  light only · single cold light source · void dominates the frame.
- **S1 · AWARE:** slits IGNITE violet · halo stays matte white (no change to the halo).
- **S2 · COMBAT / confronting a threat:** slits full violet · halo GLOWS WHITE. This is the **only** state
  where a second light source is permitted — and that glow is WHITE, never violet.

## WHY THIS MATTERS (the actual risk being closed)

The halo ring has been rendering white and consistent for months in the current production-actor
pipeline (`MATCH_3D_TO_MASTER_V0_1` onward), and `AGENTS.md`'s own "immutable identity marks" line already
said white — but no single dated ruling had ever formally closed the question, and several older
`docs/handoff` reference documents (dated 2026-06-02, an earlier design-direction pass) explicitly say
the opposite: **"halo = violet orbital ring only."** Left unaddressed, those older docs would keep
resurfacing the wrong color to future sessions/Codex reads. This ruling closes that gap.

## FILES MARKED SUPERSEDED (2026-07-03, halo color only — content otherwise untouched, nothing deleted)

- `docs/handoff/CAST_RUNPOD_KIT_V1.md` (D4 ruling 2026-06-02: "halo = violet orbital ring only")
- `docs/handoff/MIKAGE_CHARACTER_BUILD_DIRECTION_REFERENCE_V1.md` (same D4 ruling, repeated 4 places)
- `docs/handoff/MIKAGE_ASSET_ANCHOR_INDEX_V1.md` (asset anchor described as "+ violet halo ring")

Each of those files got a one-line SUPERSEDED notice prepended, pointing back to this file. Their other
content (anchor KEEP/DROP status, phase specs, etc.) is unaffected and still current.

## KNOWN CONFLICTING ARTIFACTS NOT YET FIXED (flagged, not touched — operator to decide priority)

These render or describe a violet halo/ring and were NOT edited by this ruling (lower-priority /
design-system / archive material, per "extend don't delete, don't touch archive without instruction"):

- `design_system/AUDIT_REPORT_2026-05-29.md:220`, `design_system/README.md:171` — text says "violet halo."
- `design_system/reference/mikage_character_reveal_v02.html`, `design_system/assets/character/mikage_helmet.svg`,
  `design_system/ui_kits/website/primitives.jsx` — SVG/code assets that literally render a violet halo gradient.
- `reports/MIKAGE_CHARACTER_ANCHOR_V1_PLAN.md` and its generation-test report — violet ambient-halo prompt
  language for an image-gen test candidate, not a canon ruling but a lingering conflicting artifact.
- `production/character/keyart_candidates/*.py`, `production/character/build_log/EPISODE_0{2..6}/*.py` —
  older illustrative/keyart scripts with a violet-tinted `halo()` fill; archive/reference-only, not part of
  the current 3D pipeline. Left untouched per operator instruction.

If any of the `design_system/` files above are currently being used as a live reference for new work,
flag that specifically before reusing them — they carry the wrong halo color.

## IMMUTABLE IDENTITY MARKS — current canonical text (AGENTS.md, unchanged, already correct)

`AGENTS.md` already states this correctly (checked 2026-07-03, no edit needed):

> "Immutable identity marks: faceless porcelain helmet (no eyes/nose/mouth); exactly two sensor slits;
> violet `#8F00FF` emissive ONLY at the two slits; void-black body mass / draped robe; graphene neck;
> WHITE halo ring (white, not violet); official art = sculptural realism."

This ruling file is the first time that line has a dated, explicit operator confirmation attached to it.

— MIKAGE ZENITH / Studio OS
