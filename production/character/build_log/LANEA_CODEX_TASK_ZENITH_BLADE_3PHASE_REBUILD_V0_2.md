# LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_2

STATUS: revision of exception #54 (`MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1`). V0_1 = FAIL VISUAL/CANON
(operator ruling 2026-07-06, full text in `docs/handoff/00_LATEST_CODEX_HANDOFF.md` DISPATCH #55). Technical
validators passed on V0_1 but the rendered result reads as a transforming armor plate / shield / energy
module, not a **blade**. This revision keeps the phase-driver rig V0_1 built and only rebuilds visual
hierarchy (silhouette + material) so all three phases read unmistakably as one weapon: a slab blade.

## 0. What changes vs V0_1, and why

Operator visual ruling 2026-07-06 (ground truth for this task, overrides the color/silhouette premise
of V0_1's brief):

- **Silhouette**: V0_1's P1 (a squared brutalist block with no point/no grip) does not read as a blade at
  any phase, including P3 (two flat panels around a rod reads as two doors around a power core, not a
  sword). This revision REINSTATES the vetted slab silhouette from exception #52 (`ZENITH_BLADE_SLAB_REFERENCE.svg`,
  same folder as this brief) — that geometry was confirmed correct by Lane B in #52 (W/L ratio ~0.240,
  chisel tip in the last ~13% of length, grip ring at mid-shaft). Reuse ONLY the shape reference from that
  file, not the #52/#53 `.blend` candidates and not their color.
- **Color**: V0_1 used a red/crimson `#E60000` core per the table in `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md`
  + `docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` §0.5. Operator ruling 2026-07-06 reverses this for
  the weapon's public-facing core signal: the Zenith Blade core is **electric violet `#8F00FF`**, controlled
  as a thin seam signal (same hue family as the helmet slits, never a full-surface wash). Crimson/red is
  BANNED on this weapon at every phase.
- ⚠️ **Open SSOT conflict, not resolved by this brief**: `MIKAGE_ZENITH_BLADE_SPEC_V1.md` and
  `MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` §0.5 still read RED core / closed-block silhouette on disk — this
  brief does not edit those two locked files. Do not treat them as current for weapon color/silhouette until
  the operator formally updates them or approves this V0_2 candidate. If anything else in those two files
  (unrelated to weapon color/silhouette — e.g. the P1/P2/P3 phase-name/state-machine structure itself) is
  ambiguous against this brief, STOP and report; only the color+silhouette clause is known-overridden.
- **Rig, attachment, and the 3-phase driver logic built in V0_1 are correct and KEPT.** This is a material/
  geometry revision on top of the existing `ZB3_PHASE_CONTROL["blade_phase"]` (0/1/2) driver system, not a
  from-scratch rebuild.

## 1. UNITS

Normalized weapon LENGTH L = 1.0 (long axis), same convention as V0_1 and #52.

## 2. BASE FILE

`production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1.blend`
(V0_1's own candidate output — reuse its rig/attachment/phase-driver system; do NOT start over from
`MIKAGE_ROBE_HERO_CINE_STAGING_V0_1.blend`, and do NOT touch the #52/#53 candidate files).

## 3. P1 — SEALED BLADE (closed, idle)

- Silhouette must read as a blade at a glance, not a block: a straight, rigid SLAB body (not curved, not
  katana-style) with a clearly tapered/pointed tip in the last ~13% of length (chisel point, point-down
  when worn on the back), and a visible mid-shaft grip ring. Use `ZENITH_BLADE_SLAB_REFERENCE.svg`
  proportions as the geometry baseline: width/length ratio in the 0.22-0.26 range.
- Sealed state: no visible crack/seam, no glow, core fully internal. Non-emissive.
- Shell material: same B4C ceramic matte off-white family as V0_1 (`#FAFAFA` family) — keep this part of
  V0_1 unchanged, it was not the problem.
- Attachment: same rigid attachment point/parent V0_1 used, same world transform. Do not move it.

## 4. P2 — ACTIVATING (partial split, blade still primary read)

- The two shell layers separate MORE than V0_1 — target roughly 2-3x the gap V0_1 rendered at this phase
  (V0_1's P2 gap was barely visible at contact-sheet thumbnail size; this must read as a real structural
  opening, not three status-light dots on a closed surface).
- Black Titanium inner frame becomes visible in the opening (keep V0_1's Titanium material, it was
  correct).
- Core signal: ONE thin violet `#8F00FF` seam line becomes visible in the opening, at a MID emission
  strength (clearly dimmer than P3, clearly brighter than P1's off state). Do NOT use three separate
  glowing dot/dash marks — one continuous seam, following the crack line.
- The blade's straight-slab silhouette (tip + grip ring) must remain the dominant read at this phase —
  the opening should look like the weapon's shell cracking, not like a separate accessory activating.

## 5. P3 — EXPOSED COMBAT CORE (full split, blade reads strongest here)

- Full separation: shell panels reach maximum opening (same or greater extent than V0_1's P3).
- A single, straight, solid CENTRAL blade/shaft element must be exposed between the two outer shell
  panels, with a legible sword-point tip. This central element is the PRIMARY silhouette read at this
  phase — camera framing and proportions must make it read first, before the two outer panels.
- The two outer white shell panels read as secondary armor plating around that central blade — they must
  not be sized/lit so they read as two independent doors, wings, or shields. If needed, narrow the outer
  panels and/or widen the central blade relative to V0_1's proportions to fix this hierarchy.
- Core: violet `#8F00FF` seam at FULL strength along the central blade's edge — still a thin controlled
  seam line, not a flood/wash across the panel surfaces. Pixel-sample must land in the blue-dominant
  violet family (B clearly above R), not pink/lavender drift (the same drift class caught in #52/#53:
  avoid `#DBB1F5`/`#A36BCC`-style pale results — saturate toward true `#8F00FF`).
- BAN at every phase: red/crimson/`#E60000` family anywhere on this weapon; orange; gold; pink/magenta.

## 6. SILHOUETTE SELF-CHECK (new requirement, run before finishing material/lighting)

- Render a pure black-on-white (or white-on-black) silhouette of each phase (P1/P2/P3), same camera as
  the main contact sheet, downscaled to a small thumbnail (approx. 128-200px on the long edge).
- Visually self-assess each thumbnail: does it read as a slab blade (point + straight body + grip ring
  visible or implied) at that size, not a block/shield/module? Record a YES/NO + one-line reasoning per
  phase in the proof.
- If any phase self-assesses NO at this stage, STOP before applying final materials/lighting to that
  phase and report which phase failed the silhouette check and why — do not proceed to spend time on
  shading a silhouette that has not passed. This mirrors the operator's fallback plan if this revision
  does not resolve the read.

## 7. REQUIRED PROOF ARTIFACTS

1. Wireframe of P1 (confirms point tip + grip ring + straight slab body).
2. A 3-phase FRONT contact sheet: P1/P2/P3, same camera angle as V0_1's, each labeled.
3. A SIDE-view render of P3 (new — V0_1 only had front views; side view must show the central blade
   projecting/legible from the side, not just from the front).
4. The silhouette self-check thumbnail sheet from section 6 (3 phases, black/white).
5. Key art: P3 hero still, violet core lit.
6. Pixel-sample the rendered core/seam at 2+ points per phase (P1 off/dim, P2 mid, P3 full) and report
   real RGB/hex values with a blue-dominance channel test (B minus R, B minus G — positive means violet-
   leaning, the inverse of V0_1's red-dominance test). Also explicitly confirm zero red/crimson pixels
   found on the weapon at any phase (state the negative result, don't just omit it).
7. Confirm every LOCKED item (helmet/slits/halo/cloak/rig/attachment, same list as V0_1 §8) unchanged by
   hash or direct measurement.

## 8. LOCKED (unchanged, do not touch)

Same as V0_1: helmet geometry/material; both sensor-slit meshes/shape/count and their own `#8F00FF`
emission (unrelated to this weapon, do not conflate — the slits already correctly use this hue, this task
brings the weapon's core to the SAME hue family, that is intentional and not a conflict); white Enso halo
and its S0/S1/S2 material; closed single-volume cloak; existing 7 axial + 2 drape-sway bones; existing
weapon attachment point/location; void `#050508`.

## 9. HARD BANS

Red/crimson/`#E60000` family anywhere on the weapon at any phase · orange/gold/pink/magenta core ·
violet appearing as a full-surface wash/flood rather than a thin controlled seam · P1 glowing/already
active · a P2 that still reads as three isolated status lights rather than one structural crack seam · a
P3 where the two outer panels outweigh the central blade in the silhouette read · katana curvature or any
non-rectilinear blade curve · attachment point moved · any LOCKED item (§8) changed.

## 10. SUCCESS

- P1/P2/P3 each independently read as a slab blade at thumbnail silhouette size (section 6 self-check
  all YES, or corrected until YES before finishing shading).
- P2 shows a clearly larger structural gap than V0_1 with one continuous violet seam, blade silhouette
  still dominant.
- P3 shows a single straight central blade with legible sword point as the primary read, outer panels
  clearly secondary, violet core at full strength, blue-dominant pixel-sample confirmed.
- Zero red/crimson pixels on the weapon at any phase.
- Weapon attachment point unchanged; every LOCKED item verified unchanged.
- Gate folder holds exactly `contact_sheet.png` + `contact_sheet_review_report.md`.
- `python .mikage\tools\verify_output.py` prints PASS. No `.blend1` remains.

## 11. FAIL

- Any phase's silhouette self-check reads NO and is not corrected before finishing -> `BLOCKER = SILHOUETTE_NOT_BLADE`
- Any red/crimson pixel found anywhere on the weapon at any phase -> `BLOCKER = HUE_VIOLATION`
- Violet reads as a wash/flood instead of a thin seam -> `BLOCKER = SIGNAL_DISCIPLINE_VIOLATION`
- P2 gap not meaningfully larger than V0_1's, or still reads as status-light dots -> `BLOCKER = P2_INSUFFICIENT_ACTIVATION`
- P3's outer panels outweigh the central blade in the silhouette -> `BLOCKER = SILHOUETTE_NOT_BLADE`
- Attachment point moved or any LOCKED item (§8) changed -> `BLOCKER = SCOPE_VIOLATION`
- Gate mis-schema'd -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`

## 12. ALLOWED OUTPUTS

- `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2.blend`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2_WIREFRAME.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2_CONTACTSHEET_FRONT_P1P2P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2_SIDEVIEW_P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2_SILHOUETTE_THUMBNAILS.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2_KEYART_P3.png`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2_PROOF.md`
- Gate `_tmp/mikage_zenith_blade_3phase_rebuild_v0_2_gate/` = ONLY `contact_sheet.png` +
  `contact_sheet_review_report.md` (report must include a PHASE-BY-PHASE HUE CHECK section with real
  numbers for P1/P2/P3, blue-dominance framing, AND the silhouette self-check YES/NO table from §6).

No canon-lock. No asset-lock. No production-ready/final claim (label CANDIDATE). No push. No deploy. Stop
after proof delivery for operator review. On any ambiguity in exact proportions not pinned down
numerically above or in `ZENITH_BLADE_SLAB_REFERENCE.svg`: make a reasonable modeling choice, state it
explicitly in the proof, do not block on it. On any OTHER SSOT conflict beyond the color/silhouette
override already stated in §0, or scope drift: stop and report — operator decision, not to be resolved
unilaterally.
