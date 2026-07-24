# MIKAGE ZENITH BLADE — DEVELOPMENT BUILD LOG V0.1

STATUS: `BLADE_ONLY_IMPLEMENTATION_RECORD`  
CURRENT_ASSET: `MIKAGE_ZENITH_BLADE_MATERIAL_FIDELITY_V0_26.blend`  
CURRENT_ASSET_STATUS: `REVIEW_CANDIDATE_ONLY`

This record covers Zenith Blade development only. It intentionally excludes
character, rider, steed, mount, rig, film, audio, website and release work.

## 1. Canon authority

The implementation is governed by:

- `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md`
- `docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md`
- `design_system/mikage-cine-color-contract.md`

Current structural authority is the operator-promoted V0.15 ruling:

1. Four mechanically linked outer shell plates.
2. P1 closes into one continuous full-size monolithic contour.
3. P2 opens horizontally around a central load-bearing structure; no Blade violet.
4. P3 opens wider and exposes exactly one electric-violet central core.
5. Internal mechanism consists of a dark central spine, paired recessed rails
   and minimal upper/lower structural joints.
6. Upper drive hub and lower Flux-Pinning connector are functional load paths.
7. No red/crimson weapon signal; violet is P3-core-only.
8. Form language is monolithic brutalism, controlled chamfers and functional
   segmentation without ornament.

Implementation values such as object names, offsets, bevel widths, frame
numbers and emission strengths are not canon.

## 2. Superseded experimental branch

### V0.8–V0.9 — three-phase rebuild and driver repair

- V0.9 repaired phase visibility wiring without approving the design.
- It used two violet seam objects and displayed violet in both P2 and P3.
- Its geometry was later recorded as oversized relative to the registered
  Blade baseline.
- V0.9 remains historical evidence only. It is not a valid geometry source for
  the current asset and its P2-violet behavior conflicts with current SSOT.
- Key commit: `8efb01b`.

### V0.9.1–V0.12 — signal correction and candidate mechanics/materials

- V0.9.1 limited Blade violet to P3.
- V0.10 explored candidate industrial mechanics.
- V0.11 refined the overdrive mechanism.
- V0.12 established candidate porcelain and dark-Titanium material separation.
- These passes supplied implementation evidence but did not establish canon.
- Key commits: `e5ee0d9`, `4733bbd`, `551db38`, `5bb6bd8`.

## 3. Current implementation lineage

### V0.13 — native mechanics integration

- Rebuilt mechanics around the registered V0.12 slab rather than copying the
  oversized V0.9 geometry.
- Established P1 closed, P2 split with signal off and P3 wider with one core.
- Commit: `84294f1`.

### V0.14 — deterministic phase timeline

- Registered constant phase boundaries at frames 1, 31 and 61.
- Verified no early interpolation drift.
- Commits: `bc18f83`, `ea03651`.

### V0.15 — shell cohesion and operator promotion

- Rebuilt four shell panels around one shared contour.
- Added the central spine, paired rails, collars, upper load bridge and lower
  docking tongue.
- Operator promoted the eight structural/form rules into Blade SSOT.
- Candidate commit: `d7527bd`.
- Authority commit: `1343308`.

### V0.16 / V0.16.1 — surface and load-path registration

- Assigned candidate B4C, graphite and cold-steel roles.
- Defined the upper drive-hub and lower Flux-Pinning load transitions.
- Corrected weapon-side guard/docking contact registration.
- Commits: `9bfe2cf`, `0add537`.

### V0.17 — controlled finalization candidate

- Smoothed the visual phase transitions while protecting materials and geometry.
- Added controlled review lighting and camera evidence.
- Commit: `714fac7`.

### V0.20 — hero-read refinement

- Refined exposure, light separation, B4C/Titanium distinction and load-path
  readability without changing protected geometry.
- Candidate commit: `d5ae01f`.
- Proof commit: `04d429b`.

### V0.21 — controlled geometry finish

- Added restrained non-destructive chamfers to the existing shell and
  load-bearing parts.
- Preserved transforms, parent relationships and phase samples.
- Candidate commit: `39fed4e`.
- Proof commit: `4d0efe6`.

### V0.22 — standalone extraction

- Extracted only weapon-owned shell, core, spine, rails, collars, drive hub and
  Flux-Pinning base into a fresh standalone scene.
- Removed all integration fixtures and unrelated scene ownership.
- Candidate commit: `901f03f`.
- Proof commit: `eb2b79f`.

### V0.23 — standalone form refinement

- Refined connected seams, local depth, hub/base hierarchy and P3-core
  presentation inside the protected silhouette.
- Did not change topology or front X/Z envelope.
- Candidate commit: `268e961`.
- Proof commit: `0abb7e7`.

### V0.24 — canon convergence

- Reasserted B4C porcelain, dark Titanium and cold-steel roles.
- Reframed evidence to judge the complete standalone weapon.
- Rejected two renders whose title bands obscured silhouette before accepting
  the third framing.
- Candidate commit: `0c86e51`.
- Proof commit: `1e97c19`.

### V0.25 — mechanical definition

- Tightened shell chamfers and strengthened spine, rail, collar, upper-hub and
  lower-base depth hierarchy.
- Preserved topology, front X/Z envelope, ownership and phase X spacing.
- Rejected two mechanical gates whose dark components were insufficiently
  readable; accepted the corrected evidence exposure.
- Candidate commit: `65a1010`.
- Proof commit: `002da54`.

### V0.26 — material fidelity

- Added restrained B4C mineral micro-surface without geometry displacement.
- Refined dark Titanium and paired cold-steel reflectance.
- Reduced the existing P3 core emission to prevent clipping while retaining
  the electric-violet signal.
- Geometry, transforms, modifiers, ownership and phase behavior match V0.25.
- Output SHA-256:
  `741023E6F3A220128E5D11BE222EB45D2AEA814DCA5A3A97D5EAED5B1D4B9123`.
- Candidate/proof commits are recorded in the V0.26 proof after commit.

## 4. Rejected directions and lessons

- Do not treat visually attractive historical output as authority. V0.9 is a
  superseded candidate, not the current source.
- Do not allow P2 violet; the weapon signal is P3-only.
- Do not judge a render from script completion. Every accepted gate followed
  direct inspection of the actual PNG.
- Do not use evidence lighting changes as asset material changes.
- Do not add detail merely to fill empty space. Every visible division must
  explain shell connection, load transfer, rail guidance, drive-hub function
  or Flux-Pinning support.
- Standalone development must precede any future integration review.

## 5. Current milestone

V0.26 currently provides:

- one standalone weapon-owned scene;
- four connected B4C shell plates;
- a protected monolithic P1 silhouette;
- deterministic P1/P2/P3 phase behavior;
- a dark central Titanium load path;
- paired recessed cold-steel rails;
- defined upper drive hub and lower Flux-Pinning base;
- one P3 electric-violet core;
- material, phase and clean-review evidence.

It does not claim:

- operator visual approval;
- asset lock;
- production readiness;
- integration readiness;
- permission to alter SSOT.

## 6. Current limitations and next safe action

- Material micro-detail is procedural and review-grade; no UV production pass
  has been performed.
- The standalone file does not validate any external attachment clearance.
- No deformation, rigging or animation-production validation exists.
- Final visual ruling remains with the operator.

Next safe action: operator reviews the V0.26 material gate, phase gate and clean
crop. Any further Blade work must start from V0.26 under a new controlled
exception and remain bounded by the Blade SSOT.
