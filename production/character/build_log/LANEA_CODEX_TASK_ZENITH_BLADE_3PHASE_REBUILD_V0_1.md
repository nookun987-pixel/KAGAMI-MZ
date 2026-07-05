# LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_1

STATUS: replaces exceptions #52 (`MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1`) and #53 (`..._V0_1_1`) entirely.
Both were built from `CODEX_ZENITH_BLADE_REMODEL_BRIEF.md`, a single-state violet-seam premise that
conflicts with canon that was ALREADY LOCKED before that brief was written. Do not extend, reference,
or reuse the #52/#53 candidate `.blend` files as a base — they encode the wrong silhouette (a bladed
slab) and the wrong hue (`#8F00FF` violet) for this weapon.

## 0. Why this replaces #52/#53 (operator-confirmed 2026-07-06)

Ground truth, read directly from two already-locked repo files (both locked 2026-06-02, before
#52/#53 were ever dispatched):

- `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` — STRUCTURE CANON LOCKED. Synced weapon<->entity
  3-phase model, table in §0.1/§0.5.
- `docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` §0.5 — same table, operator-approved
  2026-06-02, explicitly states: *"Earlier blade-mode mapping (Silent/Pulse/Overload) was a wrong
  fill and is retired."* This is the second time a simplified blade-mode idea has been retired by
  the operator; do not reinvent a third.

The locked table:

| Phase | Weapon (Zenith Blade) | Entity (Mikage) |
|---|---|---|
| P1 | `Compact-Idle` — closed brutal B4C block, plates contracted, flux-pinned to back, core dim/idle 43°C | `Imperial Clean` |
| P2 | `Brutal Industrial Activation` — B4C shell splits (Kintsugi), near threshold, industrial wear | `Fallen / Exile` |
| P3 | `Tri-Phase Final / Overdrive` — full release, core `#E60000` max, Orbital-Logic UI, acid vapor | `Execution` |

This is a CLOSED BLOCK that splits open across 3 phases, not a sword. It is NOT the slab shape from
#52/#53, and its core color is RED `#E60000`, not violet. Violet stays reserved for the helmet slits
only (unrelated, unchanged, see LOCKED section).

## 1. UNITS

Normalized weapon LENGTH L = 1.0 (the long axis of the closed P1 block). All fractions below are of L.

## 2. P1 — COMPACT-IDLE (base geometry, build this first)

- Shape: a closed, smooth, BRUTALIST MONOLITH / BLOCK. Rectangular in cross-section, plates flush
  and contracted shut. This is explicitly NOT a blade silhouette:
  - no pointed tip / no chisel point
  - no crossguard or tsuba
  - no wrapped/exposed grip (grip is internal/sealed at P1)
  - no visible seam glow (core is dim/idle, effectively dark)
- Proportions (starting point, adjust to read as a dense hand-carried block, not a slab or a rod):
  width/thickness close to square in cross-section (roughly 0.20-0.28L each), length L = 1.0.
- Attachment: flux-pinned to the back — use the SAME rigid attachment point/parenting the current
  blade objects already use (root/pelvis-adjacent, per exception #40's rigid-attach pattern). Do not
  invent a new attachment bone. The back-mount vs hand-grip two-state carry system itself is a
  SEPARATE, already-deferred task (see `docs/handoff/00_LATEST_CODEX_HANDOFF.md` blade two-state
  note) — do not build hand-grip rigging as part of this task.
- Outer shell material: Boron Carbide (B4C) ceramic, matte, `#FAFAFA`-family off-white, sterility
  reads 100% (no scratches/wear at P1). Non-emissive.
- Core: sealed inside the block at P1, not visible. If a driver/parameter is used to preview it,
  emission strength at P1 must read as near-zero / dim (idle 43°C, not glowing).

## 3. P2 — BRUTAL INDUSTRIAL ACTIVATION

- The B4C shell shows Kintsugi-style fracture: real geometric split lines opening across the block
  (a shape-key deform pulling shell panels apart, OR a swapped/visible secondary "cracked" mesh —
  your choice, report which and why).
- Cracks reveal a black, rusty-industrial TITANIUM inner frame underneath the B4C shell (this inner
  material must exist as its own material, only visible through P2/P3 crack openings).
- Cracks are filled/lit with a red glow — conductive resin / "quantum blood" `#E60000` family, at a
  MID emission strength (clearly less than P3, clearly more than P1's near-zero).
- Overall wear: near-threshold industrial wear/scoring may appear on the shell edges at the crack
  lines only — do not add wear anywhere else on the shell.

## 4. P3 — TRI-PHASE FINAL / OVERDRIVE

- Full release: B4C shell panels fully split/open (max extent of the P2 deform/mesh swap).
- Titanium inner frame fully visible.
- Core at FULL emissive strength, color `#E60000` (pure red, not orange, not magenta/violet).
- Optional/stretch, do not block PASS on these if they are out of scope for a single Blender pass:
  Orbital-Logic UI text-wrap around the core, acid-vapor thermal mirage, heat-scorch scarring on the
  shell. If skipped, state explicitly in the proof which stretch items were not attempted and why —
  do not silently omit them without saying so.

## 5. STATE DRIVER

- Expose ONE parameter/driver (e.g. a custom property `blade_phase` 0/1/2, or 3 named actions/shape-
  key values) that switches P1 <-> P2 <-> P3, following the same state-machine precedent already in
  this rig (S0/S1/S2 lighting states from exception #40/#48). Do not build 3 disconnected static
  files with no shared driver unless a shared driver proves impractical — report if so.

## 6. MATERIALS SUMMARY

- Outer shell (P1 intact / P2-P3 remaining panels): B4C ceramic matte `#FAFAFA` family, non-emissive.
- Inner frame (visible P2-P3 only): matte black/dark rusty titanium, non-emissive.
- Core / crack glow: emissive `#E60000` family (red-dominant: R clearly above both G and B — the
  inverse of the #8F00FF blue-dominant test used for the helmet slits). Strength scales idle-dim (P1)
  -> mid (P2) -> max (P3).
- BAN: no violet/`#8F00FF` anywhere on this weapon at any phase. No chrome/gloss plastic. No warm
  colors outside the red core/crack family (no orange, no gold except literal kintsugi-line color if
  used, no pink/magenta drift — pixel-sample and verify red-dominant, the same discipline used to
  catch the #52/#53 pink-drift bug).

## 7. HARD BANS (silhouette + color)

sword/blade silhouette at P1 (point, edge, crossguard, wrapped grip) · katana curvature · any curve
(block is rectilinear) · violet/`#8F00FF` anywhere on this weapon · orange/gold/pink core color ·
fine anime-thin proportions · a P1 that already glows (P1 must read dim/idle).

## 8. LOCKED (unchanged, do not touch)

Helmet geometry/material; both sensor-slit meshes, shape, count, and their `#8F00FF` blue-dominant
violet emission (this hue stays correct and untouched — it belongs to the helmet, never the blade);
white Enso halo ring and its S0/S1/S2-driven material; closed single-volume cloak (288 verts, 0
boundary/non-manifold edges); existing 7 axial + 2 drape-sway bones and their positions/weights; the
existing rigid attachment point/parent for the weapon (location only — do not move it); void `#050508`.

## 9. REQUIRED SURVEY (report in proof before/alongside build)

1. Confirm the exact current blade attachment bone/parent and world-space transform, so the new P1
   block replaces the old slab meshes AT THE SAME ATTACHMENT, without moving it.
2. Confirm no existing shape-key or driver already exists on the old blade objects that this task
   would collide with.
3. Base file to use: `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1.blend`
   (exception #48's PASS derivative — the LAST version before #52/#53 touched the blade; do NOT base
   this on the #52 or #53 `.blend` files).

## 10. REQUIRED PROOF ARTIFACTS

1. Wireframe/build-log view of the P1 closed block (confirms no point/crossguard/grip-wrap).
2. A 3-state contact sheet: P1 / P2 / P3 renders side by side, same camera angle, each labeled.
3. Key art: P3 (Overdrive) hero still, core lit red.
4. Pixel-sample the rendered core/crack at 2+ points per phase (P1, P2, P3) and report real RGB/hex
   values with a red-dominance channel test (R minus B, R minus G), the same method used to catch
   the #52/#53 violet pink-drift. P1 must read near-off/dim; P3 must read clearly red-dominant
   `#E60000` family, not orange/pink/violet.
5. Confirm every LOCKED item (§8) unchanged by hash or direct measurement, same rigor as prior
   exceptions.

## 11. SUCCESS

- P1 reads as a closed brutalist block with no blade silhouette features (verified by wireframe +
  visual inspection).
- P2 shows real geometric crack/split with Titanium frame visible underneath and mid-strength red
  glow in the cracks.
- P3 shows full open/split, Titanium frame fully visible, core at max red emission, pixel-sampled
  red-dominant (not orange/pink/violet).
- Weapon attachment point unchanged from the current rig.
- Every LOCKED item (§8) verified unchanged.
- Gate folder holds exactly `contact_sheet.png` + `contact_sheet_review_report.md`.
- `python .mikage\tools\verify_output.py` prints PASS. No `.blend1` remains.

## 12. FAIL

- Any blade/sword silhouette feature present at P1 -> `BLOCKER = SILHOUETTE_VIOLATION`
- Any violet/`#8F00FF` pixel found anywhere on the weapon at any phase -> `BLOCKER = HUE_VIOLATION`
- Core reads orange/pink/magenta instead of red-dominant at P3 -> `BLOCKER = HUE_VIOLATION`
- P1 core already glowing/bright -> `BLOCKER = STATE_MACHINE_VIOLATION`
- Attachment point moved -> `BLOCKER = SCOPE_VIOLATION`
- Any LOCKED item (§8) changed -> `BLOCKER = SCOPE_VIOLATION` (report exactly what changed)
- Gate mis-schema'd -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`

## 13. ALLOWED OUTPUTS

- `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1.blend`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1_WIREFRAME.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1_CONTACTSHEET_P1P2P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1_KEYART_P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1_PROOF.md`
- Gate `_tmp/mikage_zenith_blade_3phase_rebuild_v0_1_gate/` = ONLY `contact_sheet.png` +
  `contact_sheet_review_report.md` (report must include a PHASE-BY-PHASE HUE CHECK section with real
  numbers for P1/P2/P3).

No canon-lock. No asset-lock. No production-ready/final claim (label CANDIDATE). No push. No deploy.
Stop after proof delivery for operator review. On any ambiguity in the spec above (e.g. exact block
proportions, exact crack pattern) that the two locked spec files don't pin down numerically: make a
reasonable modeling choice, state it explicitly as a choice in the proof, and do not block on it —
this is a first-pass geometry build, not a final-precision claim.

On SSOT conflict beyond what's already resolved in §0, or scope drift: stop and report — this is an
operator decision, not to be resolved unilaterally.
