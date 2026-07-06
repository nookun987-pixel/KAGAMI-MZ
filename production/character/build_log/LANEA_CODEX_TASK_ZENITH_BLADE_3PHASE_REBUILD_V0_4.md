# LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_4

STATUS: revision of exception #56 (`MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_3`). V0_3 result: `BLOCKER =
HUE_VIOLATION`. At the true brightest core pixel, P2 `(596,210)` and P3 `(595,210)`, BOTH the beauty
render AND the no-bloom diagnostic pass read `RGB(255,254,255)` / `RGB(255,255,255)` - pure white,
`B-R=0`. Reported honestly, no retry, no gate, no push, no PASS claim - correct behavior.

## 0. Why this is a different failure than V0_3 diagnosed, and what it actually means

V0_3 assumed the problem was bloom clipping R up to meet B (a post-process glow effect blowing out the
highlight). That would predict the no-bloom pass should still read blue-dominant even if the beauty pass
doesn't. It did not - the no-bloom pass ALSO reads pure white. That rules out bloom as the primary cause.

The much more likely explanation: the emission strength on the core/seam material is high enough that the
scene-linear (pre-tonemap) radiance at that pixel is far outside 0-1 range in all three channels once the
view transform (Filmic or AgX, whichever this project uses) tone-maps it - both of these view transforms
deliberately DESATURATE very bright highlights toward white to preserve highlight detail, which is a
built-in feature of the tone curve, not a bug. A correctly-hued but WAY too bright emissive value will
render as white after tonemapping even with bloom completely off. This matches the operator's stated
fallback order exactly: step (1) bloom off/reduced was V0_3, already tried and insufficient; this task is
step (2), reduce emission strength - not by a small notch this time, but enough to actually land inside the
tone-mapper's hue-preserving range, plus step (3) if needed (a compositor-level highlight-desaturation
correction, keeping the base hex unchanged).

## 1. SCOPE - MATERIAL/LIGHT/RENDER SETTINGS ONLY (same boundary as V0_3)

Do not touch: mesh geometry, proportions, ring, point-down tip, panel spacing/hierarchy, the
`ZB3_PHASE_CONTROL["blade_phase"]` driver system, rig, bones, or the weapon attachment point/transform.
Reuse V0_3's (= V0_2's) shape byte-identical. Only the core/seam material's emission strength, and/or scene
bloom settings, and/or a compositor-level tonemap/highlight correction may change.

## 2. BASE FILE

`production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_3.blend`
(V0_3's own candidate - shape is still V0_2's approved shape, byte-identical; only material/render settings
differ going into this task). Do not base this on V0_1, V0_2 directly, or the #52/#53 candidate files.

## 3. REQUIRED DIAGNOSTIC FIRST (before changing anything) - report the scene-linear value

Before touching emission strength, report the core/seam material's actual EMISSION STRENGTH value and its
base emission COLOR (the raw shader input, e.g. `(0.274, 0.0, 1.0)` if unchanged from V0_2/V0_3), and the
scene-linear (pre-tonemap, pre-color-management) rendered radiance at the P2/P3 peak pixel coordinates if
your render pipeline can expose it (e.g. an EXR pass or the raw float buffer before view transform). This
tells us whether the base color itself is still correct (expected: yes, unchanged since V0_2) and exactly
how far over 1.0 the radiance is running at peak - the actual measurement needed to pick a real fix instead
of guessing at a strength number.

## 4. REQUIRED FIX

- Reduce the core/seam emission strength enough that the peak pixel's scene-linear radiance lands within a
  range the view transform renders as blue-dominant, not desaturated white. Do not treat this as a small
  tweak - if V0_3's no-bloom pass still blew fully white, V0_3 did not reduce bloom's contribution enough
  to prove the base value was already fine; treat emission strength as the primary suspect and cut it
  substantially, then re-measure, iterating if needed within this task.
- If reducing strength enough to fix hue makes the line read too dim at contact-sheet thumbnail size,
  compensate with bloom RADIUS (spread) rather than strength/threshold, so the line still reads as a bright
  accent without re-introducing the desaturation-to-white problem at its core.
- Alternative/additional fix if strength reduction alone still fights readability: apply a compositor-level
  correction that prevents the highlight from desaturating (e.g. clamping the emission before the view
  transform, or a custom tonemap node solely for this material's contribution) - keep the base hex
  unchanged, report exactly which mechanism you used and why.
- Re-render the front 3-phase contact sheet at a readable exposure (same requirement as V0_3 - V0_2's
  robe/helmet blew to solid white; confirm this round doesn't repeat that on the surrounding character
  either).

## 5. REQUIRED DIAGNOSTIC PASSES (same as V0_3, still required)

1. Beauty render (final material + lighting + bloom).
2. Core-only / no-bloom pass (bloom/glare disabled) at the same P2/P3 coordinates.
3. Pixel-sample BOTH passes at the identified peak pixel, report all numbers side by side, PLUS the new
   scene-linear/pre-tonemap value requested in section 3.

## 6. PASS CONDITION (color)

- At the single brightest pixel of the core signal, BEAUTY (bloom-on) render, both P2 and P3:
  `B - R >= 40`, and neither channel should read as a flat 255/255/255 (i.e., not desaturated white).
- No-bloom pass at the same coordinate also reads blue-dominant (confirms base material correctness).
- Zero red/crimson pixels anywhere on the weapon at any phase.
- Seam remains a thin controlled line (not thickened, not washed).
- ALL V0_2/V0_3 geometry/silhouette/rig/attachment verified byte-identical.

## 7. FAIL

- Brightest pixel still clips to white or `R` within 39 of `B` (or above it) in the beauty render ->
  `BLOCKER = HUE_VIOLATION` (report the real measured RGB, do not round favorably).
- No-bloom pass also fails the same test -> `BLOCKER = HUE_VIOLATION`, report material node values AND the
  scene-linear radiance requested in section 3.
- Any geometry, proportion, rig, or attachment change versus V0_2/V0_3 -> `BLOCKER = SCOPE_VIOLATION`.
- Seam noticeably thickened/washed to hide the fix -> `BLOCKER = SIGNAL_DISCIPLINE_VIOLATION`.
- Any red/crimson pixel found -> `BLOCKER = HUE_VIOLATION`.
- Gate mis-schema'd -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.

## 8. REQUIRED PROOF ARTIFACTS

1. Re-exported front 3-phase contact sheet, readable exposure.
2. Beauty vs no-bloom comparison sheet for P2 and P3.
3. Pixel-sample table: peak coordinates, beauty RGB/hex, no-bloom RGB/hex, scene-linear/pre-tonemap value,
   B-R and B-G deltas, for P2 and P3, plus V0_2's and V0_3's numbers for continuity.
4. Explicit zero-red-pixel confirmation.
5. Confirmation every V0_2 geometry/silhouette/rig/attachment element is unchanged (hash or measurement).

## 9. ALLOWED OUTPUTS

- `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4.blend`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4_CONTACTSHEET_FRONT_P1P2P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4_BEAUTY_VS_NOBLOOM_P2P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4_KEYART_P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4_PROOF.md`
- Gate `_tmp/mikage_zenith_blade_3phase_rebuild_v0_4_gate/` = ONLY `contact_sheet.png` +
  `contact_sheet_review_report.md` (must include the section-3 scene-linear diagnostic and the full
  peak-pixel table).

No canon-lock. No asset-lock. No production-ready/final claim (label CANDIDATE). No push. No deploy. Stop
after proof delivery for operator review. If this task finds itself needing to touch geometry to make color
read correctly, STOP and report that as a conflict rather than doing it.
