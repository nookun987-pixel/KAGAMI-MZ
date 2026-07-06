# LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_3

STATUS: revision of exception #55 (`MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2`). Operator ruling 2026-07-06:
V0_2's silhouette/shape = PASS (blade reads correctly at all 3 phases, keep it exactly as-is). V0_2's core
COLOR = FAIL: at the actual brightest/bloom-clipped pixels the signal reads as magenta/pink neon
(`R == B == 255`, clipped), not cold electric violet, even though off-peak sample points along the seam
measured blue-dominant. This is a narrow, material/render-only revision — no geometry change of any kind.

## 0. What changes vs V0_2, and why

- V0_2's proof sampled hue at points along the seam that were NOT the single brightest pixel, and reported
  PASS. Independent pixel scan of the actual rendered contact sheet found the true brightest core pixels
  clipped to `RGB(255, ~30-120, 255)` — R and B both maxed, which is magenta, not violet. The material's
  linear source color (`(0.274, 0.0, 1.0)`, correctly violet) is fine; the render's emission strength/bloom
  is pushing the highlight past clip, and at full clip R rises to equal B, destroying the blue-dominance
  that makes it read as violet instead of pink.
- FIX TARGET: reduce emission strength and/or bloom intensity/threshold on the core/seam material so that
  the ACTUAL BRIGHTEST rendered pixel of the core (not an arbitrary point along it) still measures
  clearly blue-dominant (see pass condition in section 5) — not just any point sampled off the peak.
- Contact sheet exposure/readability: the previous contact sheet's robe/cloak/helmet read as blown-out
  white, making color judgment harder. If useful, adjust ONLY the proof render's camera exposure / view
  transform for this output — do not change any locked material's base value to do this.

## 1. SCOPE — MATERIAL/LIGHT/RENDER SETTINGS ONLY

Do not touch: mesh geometry, proportions, ring, point-down tip, panel spacing/hierarchy, the
`ZB3_PHASE_CONTROL["blade_phase"]` driver system, rig, bones, or the weapon attachment point/transform.
Everything built in V0_2 for shape is APPROVED and must be reused byte-identical except for the
core/seam material's emission parameters (strength, and/or the scene's bloom threshold/intensity/radius
if bloom is a scene-level compositor setting rather than a per-material one — report which mechanism you
adjust and why).

## 2. BASE FILE

`production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2.blend`
(V0_2's own PASS-shape candidate). Do not base this on V0_1, V0_1's block silhouette, or the #52/#53
candidate files.

## 3. REQUIRED FIX

- Identify the actual brightest pixel of the core/seam emissive signal in the rendered output for P2 and
  for P3 (not an arbitrary point along the seam's length — the single hottest pixel, the one a viewer's
  eye is drawn to first).
- Adjust emission strength and/or bloom settings until that specific hottest pixel, when pixel-sampled
  from the actual rendered PNG (not a scene-linear/pre-tonemap value), measures clearly blue-dominant:
  `B` at least `40` above `R`, and `R` at least `20` below `G` is NOT required (G can stay low), but `R`
  must not equal or exceed `B`. State the exact before/after RGB at that peak pixel in the proof.
- The seam must remain a thin, controlled line — do not thicken it or let it wash across the panel
  surface while lowering brightness; if reducing strength makes the line read too dim/thin to see at
  contact-sheet thumbnail size, adjust bloom radius/threshold instead of just cranking strength down,
  and say which knob you turned.
- Re-render the front 3-phase contact sheet at a more readable exposure than V0_2's (V0_2's robe/helmet
  read fully blown-out white). Adjust only the proof camera's exposure/view-transform for this output —
  do not change any locked material.

## 4. REQUIRED DIAGNOSTIC PASSES (this round, not deferred)

To make the next review conclusive without another round-trip, include ALL of the following in the same
delivery:

1. **Beauty render** — final material + lighting + bloom, same as normal (this is what section 3 fixes).
2. **Core-only / no-bloom pass** — the same P2 and P3 frames re-rendered with bloom/glare disabled (or
   the compositor bloom node bypassed), isolating the base emissive material color before any bloom
   contribution. This directly separates "the material color is wrong" from "bloom is clipping it."
3. Pixel-sample BOTH passes at the same coordinates (the brightest pixel identified in section 3) and
   report all four numbers (beauty RGB, no-bloom RGB) side by side in the proof, with the R/B relationship
   called out explicitly for each.

## 5. PASS CONDITION (color)

- At the single brightest pixel of the core signal, in the BEAUTY (bloom-on) render, for both P2 and P3:
  `B - R >= 40` (clearly blue-dominant, no clip-to-magenta).
- The no-bloom pass at the same coordinate must also read blue-dominant (confirms the base material is
  correct, independent of bloom).
- Zero red/crimson pixels anywhere on the weapon at any phase (same test as V0_2, re-confirm).
- Seam remains a thin controlled line (not thickened, not washed) at the same approximate width as V0_2.
- ALL of V0_2's geometry/silhouette/rig/attachment verified byte-identical (hash or direct comparison) —
  this task must not have touched them.

## 6. FAIL

- Brightest pixel still clips to `R` within `39` of `B` or above it in the beauty render ->
  `BLOCKER = HUE_VIOLATION` (do not approximate or round favorably — report the real measured gap).
- No-bloom pass also reads non-blue-dominant (means the base material itself is off, not just bloom) ->
  `BLOCKER = HUE_VIOLATION`, report material node values found.
- Any geometry, proportion, rig, or attachment change versus V0_2 -> `BLOCKER = SCOPE_VIOLATION`.
- Seam noticeably thickened/washed to hide the fix -> `BLOCKER = SIGNAL_DISCIPLINE_VIOLATION`.
- Any red/crimson pixel found -> `BLOCKER = HUE_VIOLATION`.
- Gate mis-schema'd -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.

## 7. REQUIRED PROOF ARTIFACTS

1. Re-exported front 3-phase contact sheet, more readable exposure than V0_2.
2. Beauty vs no-bloom comparison sheet for P2 and P3 (section 4).
3. Pixel-sample table: brightest-pixel coordinates, beauty RGB/hex, no-bloom RGB/hex, B-R and B-G deltas,
   for P2 and P3, plus the two off-peak seam samples from V0_2 for continuity.
4. Explicit zero-red-pixel confirmation (same method as V0_2).
5. Confirmation every V0_2 geometry/silhouette/rig/attachment element is unchanged (hash or measurement).

## 8. ALLOWED OUTPUTS

- `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_3.blend`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_3_CONTACTSHEET_FRONT_P1P2P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_3_BEAUTY_VS_NOBLOOM_P2P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_3_KEYART_P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_3_PROOF.md`
- Gate `_tmp/mikage_zenith_blade_3phase_rebuild_v0_3_gate/` = ONLY `contact_sheet.png` +
  `contact_sheet_review_report.md` (report must include the peak-pixel beauty-vs-no-bloom table from
  section 7).

No canon-lock. No asset-lock. No production-ready/final claim (label CANDIDATE). No push. No deploy. Stop
after proof delivery for operator review. This is a narrow color/render fix only — if you find yourself
needing to touch geometry to make the color read correctly, STOP and report that as a conflict rather
than doing it.
