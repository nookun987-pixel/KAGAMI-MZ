# Zenith Blade V0.85 — Collision Overlay and Bounded Clearance Proof

## Result

```text
BASELINE_REPRODUCTION: PASS
OWNERSHIP_EXCLUSION: PARTIAL
ATTACHMENT_TRANSLATION_SWEEP: NO_VALID_REPAIR
ATTACHMENT_ROTATION_SWEEP: NO_VALID_REPAIR
P3_COLLISION_OVERLAY: GENERATED_AND_INSPECTED

DERIVATIVE_CREATED: NO
STATUS: BLOCKED_BY_REPAIR_SCOPE
INTEGRATION_READY: NO
ASSET_LOCK: NO
PRODUCTION_READY: NO
```

## Source integrity

- Source:
  `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_DECOUPLED_CHAIN5_INTEGRATION_V0_84.blend`
- SHA-256 before:
  `F1B74214EDE009684625F3E6358E17F4014BFD38070CE7011BE09678F10270B4`
- Source was opened in Blender `5.1.2` background mode.
- Source was not saved or overwritten.

## Pass 1 — reproduction and overlay

The neutral P1/P2/P3 baseline reproduced the existing classification:

- 32 phase records total.
- 3 marker-reference records.
- 4 contact-shadow visual-helper candidates.
- 25 physical or unresolved records.

The inspected P3 overlay is:

`production/character/reviews/MIKAGE_ZENITH_BLADE_BOUNDED_CLEARANCE_V0_85_OVERLAY.png`

Color key:

- Red: Blade shell, hub, spine-key and rail collision participants.
- Cyan/white: actor arm, mitten, bridge and sleeve collision participants.
- Yellow: marker/helper objects.

The overlay does not support treating every remaining overlap as harmless
grip or docking contact. The shell/hub envelope visibly occupies the actor
arm/grip region, consistent with the machine BVH report.

## Pass 2 — ownership exclusions

`hand_right_sword_hold_marker` is excluded as an independent measurement
reference.

`A2_right_graphite_wrist_to_body_contact_shadow` remains only an exclusion
candidate. Its name indicates a visual helper, but the scene contains no
explicit collision-ownership property authorizing automatic exclusion.

No arm, mitten, shoulder bridge or upper-sleeve mesh was excluded.

## Pass 3 — bounded repair search

### Translation sweep

The attachment root was tested in memory along X/Y/Z at:

```text
±0.002, ±0.005, ±0.010, ±0.020, ±0.030 and ±0.050 m
```

Every candidate reproduced:

```text
PHYSICAL_TRIANGLE_OVERLAPS: 1302
PAIR_RECORDS_ACROSS_P1_P2_P3: 54
```

The secondary-grip IK follows the Blade translation, pulling the hand/arm
chain with it and preserving the same overlap topology.

### Rotation sweep

The attachment root was rotated in memory around the handle on X/Y/Z at:

```text
±1°, ±2°, ±3°, ±5° and ±8°
```

No rotation reduced the overlap score. The smallest nonzero marker delta was:

```text
0.0178673237 m
```

This exceeds the required tolerance:

```text
0.00001 m
```

Therefore no tested rotation was a valid candidate.

## Why no V0.85 blend was saved

The controlled gate permits only an attachment-root or secondary-grip
offset. Neither permitted adjustment produced a collision improvement while
preserving registration. Saving an unchanged derivative or a candidate that
fails registration would falsely imply progress.

No geometry, material, actor mesh, rig hierarchy, phase mechanism or source
asset was changed.

## Ruling

```text
V0.84_TECHNICAL_ARCHITECTURE: PRESERVED
V0.84_POSE_RELATIVE_CLEARANCE: PRESERVED_BY_SOURCE
V0.85_BOUNDED_CLEARANCE: FAIL_NO_VALID_OFFSET_SOLUTION

ZERO_UNCLASSIFIED_PHYSICAL_PENETRATION: FAIL
MARKER_REGISTRATION_FOR_REPAIR_CANDIDATE: FAIL
INTEGRATION_READY: NO
```

## Next safe action

Open a separate bounded correction gate that permits one of:

1. actor-side grip-pose/attachment-interface correction while keeping the rig
   hierarchy unchanged; or
2. handle-registration orientation correction around a fixed accepted hold
   point.

The next gate must preserve the docking-primary architecture and secondary
grip concept. It must not return to a hand-parented Blade or redesign the
Blade shell to hide the integration failure.
