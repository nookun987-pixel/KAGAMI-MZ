# Zenith Blade V0.63 — Pose / Deformation Clearance Retest

## Result

```text
V0.63_VALIDATION: FAIL
ATTACHMENT_FOLLOW: PASS
RIGHT_MITTEN_FOLLOW: PASS
CLOAK_PROXY_COVERAGE: PASS
MARKER_REGISTRATION: FAIL
POSE_INDUCED_COLLISION_CLEARANCE: FAIL
SOURCE_V0.62_UNCHANGED: PASS

INTEGRATION_READY: NO
```

## Improvements proven after V0.62

- Blade and existing right mitten now visibly follow `hand.R`.
- Maximum right-mitten/handle distance drift across the pose matrix:
  `0.00000019 m`.
- Deterministic cloak-left and cloak-right transform coverage executed.
- Bone poses and cloak transform were restored after the audit.
- V0.62 was opened read-only and remained hash-identical.

## Blocking findings

### Marker/source-proof discrepancy

The actual V0.60 source contains:

- `hand_right_sword_hold_marker` world position: `[0, 0, 0]`
- `ZB48_HANDLE_REGISTERED_TO_HAND_MARKER` world position:
  `[1.05499995, -0.025, 2.11999989]`

Therefore the earlier claimed marker delta `[0,0,0]` is not supported by the
actual objects. V0.63 correctly reports a neutral delta of approximately:

```text
[-1.05500007, 0.02500000, -2.11999989]
```

The previous check mixed local marker coordinates with handle world
coordinates. V0.63 corrected the coordinate-space error.

### Pose-induced collision records

Neutral has pre-existing overlap records. Relative to that neutral baseline,
the following poses introduce new object-pair overlaps:

- hand hold: `0`
- torso left: `13`
- torso right: `7`
- wide stance: `0`
- crouch: `0`
- shoulder/elbow limit: `0`
- cloak left: `1`
- cloak right: `5`

The torso-twist failures include Blade shell/load-joint/rail contact with
right sleeve, wrist/thumb, shoulder/body-gap, torso and helmet review meshes.

The cloak proxy failures are concentrated at P2:

- cloak left: `ZB46_RECESSED_RAIL_L` ↔ cloak mass
- cloak right: central spine, functional rails and recessed rails ↔ cloak mass

The exact pair and triangle-overlap counts are preserved in the JSON report.

## Evidence

- Report:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_POSE_CLEARANCE_V0_63_REPORT.json`
- Contact sheet:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_POSE_CLEARANCE_V0_63_CONTACT_SHEET.png`
- Source:
  `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_ATTACHMENT_RIG_COVERAGE_V0_62.blend`

## Next safe action

Open a bounded V0.64 registration correction that moves only the hold marker
to the accepted handle registration point and keeps the handle/Blade fixed.
Collision repair must be a separate ruling because it requires choosing
between attachment offset/pose limits and actor clearance treatment.

No Blade-form, material, actor-mesh or phase redesign is authorized.
