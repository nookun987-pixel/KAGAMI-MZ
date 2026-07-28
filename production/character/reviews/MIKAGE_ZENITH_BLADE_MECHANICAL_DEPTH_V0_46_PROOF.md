# MIKAGE ZENITH BLADE — MECHANICAL DEPTH V0.46 PROOF

## Status

`MECHANICAL_DEPTH_CANDIDATE_PASS`

This is not final visual approval, asset promotion, asset lock,
integration-ready, or production-ready status. Final visual ruling belongs to
the operator.

## Authority and lineage

- Canon source: `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md`
- Operator direction:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_V0_45_OPERATOR_RULING.md`
- Source:
  `production/character/MIKAGE_ZENITH_BLADE_BRUTALIST_CORRECTION_V0_45.blend`
- Output:
  `production/character/MIKAGE_ZENITH_BLADE_MECHANICAL_DEPTH_V0_46.blend`
- Source SHA-256 before:
  `3AB81E68BA4816A6CD16C2D34D5B5434DD19057E8D254547A9A1318A2D7EDD9D`
- Source SHA-256 after:
  `3AB81E68BA4816A6CD16C2D34D5B5434DD19057E8D254547A9A1318A2D7EDD9D`
- Output SHA-256:
  `97630E228EEE6CCEDBE151470A5F8EBAA992D169BBBD779FE84DCCE2FB317DE6`
- Source unchanged: `PASS`
- Saved derivative reopened: `PASS`

## Controlled work performed

- Increased shell body depth on the Y axis without changing the front contour.
- Rebuilt the upper drive hierarchy as a cross-member, central spine key, and
  two plate shoulders.
- Rebuilt the lower Flux-Pinning hierarchy as a wide base, central spine
  receiver, and two compression cheeks.
- Added two recessed functional rails beside the central spine.
- Added four minimal load joints aligned to the rails across the upper/lower
  plate seam.
- Preserved four existing shell plates and their phase transforms.
- Preserved flat termination, outer contour, material assignments, core
  treatment, and actor context.

## Machine checks

- Plate count: `4`
- Recessed rail count: `2`
- Load-joint count: `4`
- Hub hierarchy present: `PASS`
- Flux-base hierarchy present: `PASS`
- Source preservation: `PASS`
- Output reopen: `PASS`
- V0.46 `.blend1` present: `NO`
- Machine evidence: `_tmp/zenith_blade_v0_46_mechanical/result.json`

## Render inspection

Evidence:
`production/character/reviews/MIKAGE_ZENITH_BLADE_MECHANICAL_DEPTH_V0_46_CONTACT_SHEET.png`

- Actual image inspected after render: `YES`
- Image dimensions: `2700 x 1780`
- P1 front/3/4: shell remains closed and core/rails remain concealed.
- P2 front/3/4: paired guidance structure and seam joints are readable; violet
  remains off.
- P3 front/3/4: exactly one central violet core remains visible.
- Three-quarter mass: visibly deeper than V0.45.
- Upper and lower endpoints: now use multi-part structural hierarchy tied to
  the central load path rather than isolated marker blocks.
- Ornament added: `NO`
- Outer silhouette redesign: `NO`

## Gate

```text
V0.45_OPERATOR_DIRECTION_RECORDED: PASS
V0.46_MECHANICAL_DEPTH: CANDIDATE_PASS
350KG_DEPTH_READ: PASS_FOR_REVIEW
PAIRED_RAILS: PASS
SEAM_LOAD_JOINTS: PASS
DRIVE_HUB_HIERARCHY: PASS_FOR_REVIEW
FLUX_BASE_HIERARCHY: PASS_FOR_REVIEW
P1_CLOSED: PASS
P2_SIGNAL_OFF: PASS
P3_SINGLE_CORE: PASS
SOURCE_PRESERVATION: PASS

ASSET_PROMOTION: HOLD
ASSET_LOCK: NO
PRODUCTION_READY: NO
FINAL_VISUAL_APPROVAL: OPERATOR_PENDING
```

## Next safe action

Obtain the operator visual ruling on the V0.46 contact sheet. If accepted,
open a separate read-only phase, intersection, repeatability, and attachment
validation gate. Do not repair visual shortcomings inside that validation.
