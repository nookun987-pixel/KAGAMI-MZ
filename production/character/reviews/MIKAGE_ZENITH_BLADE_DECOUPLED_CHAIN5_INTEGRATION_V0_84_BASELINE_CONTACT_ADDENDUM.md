# Zenith Blade V0.84 — Baseline Contact Ownership Addendum

## Scope

Read-only Blender metadata and neutral BVH ownership audit of:

`production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_DECOUPLED_CHAIN5_INTEGRATION_V0_84.blend`

Blender was opened in background mode without saving. No geometry, material,
rig, action, driver, constraint or transform was edited.

## Integrity

- Blender: `5.1.2`
- Source SHA-256 before:
  `F1B74214EDE009684625F3E6358E17F4014BFD38070CE7011BE09678F10270B4`
- Source SHA-256 after:
  `F1B74214EDE009684625F3E6358E17F4014BFD38070CE7011BE09678F10270B4`
- Source preserved: `PASS`
- Blend saved during audit: `NO`

## Classification policy

1. `NON_PHYSICAL_REFERENCE`: an independently owned measurement/reference
   object, not an actor collision surface.
2. `NON_PHYSICAL_VISUAL_HELPER_CANDIDATE`: the name and role indicate a
   visual helper, but no explicit collision-ownership flag exists; it cannot
   be excluded until the operator or owning pipeline records that policy.
3. `PHYSICAL_OR_UNRESOLVED_GEOMETRY`: renderable actor/body geometry, or a
   mesh for which no evidence authorizes exclusion from collision.

## Neutral baseline pairs

| Phase | Blade object | Actor/reference object | Triangle pairs | Classification |
|---|---|---|---:|---|
| P1 | `ZB45_SHELL_UL` | `hand_right_sword_hold_marker` | 4 | Non-physical reference |
| P1 | `ZB45_SHELL_UR` | `A2_right_continuous_black_upper_arm_attached_plane` | 14 | Physical or unresolved |
| P1 | `ZB45_SHELL_UR` | `A2_right_porcelain_mitten_hand_attached_read` | 12 | Physical or unresolved |
| P1 | `ZB45_SHELL_UR` | `A2_right_shoulder_to_arm_continuity_graphite_bridge` | 18 | Physical or unresolved |
| P1 | `ZB46_DRIVE_HUB` | `A2_right_continuous_black_upper_arm_attached_plane` | 12 | Physical or unresolved |
| P1 | `ZB46_HUB_SHOULDER_R` | `A2_right_continuous_black_upper_arm_attached_plane` | 23 | Physical or unresolved |
| P1 | `ZB46_HUB_SHOULDER_R` | `A2_right_shoulder_to_arm_continuity_graphite_bridge` | 20 | Physical or unresolved |
| P1 | `ZB46_HUB_SPINE_KEY` | `A2_right_shoulder_to_arm_continuity_graphite_bridge` | 18 | Physical or unresolved |
| P1 | `ZB46_RECESSED_RAIL_R` | `A2_right_continuous_black_upper_arm_attached_plane` | 22 | Physical or unresolved |
| P1 | `ZB46_RECESSED_RAIL_R` | `A2_right_graphite_wrist_to_body_contact_shadow` | 16 | Visual-helper candidate |
| P2 | `ZB45_SHELL_UL` | `hand_right_sword_hold_marker` | 4 | Non-physical reference |
| P2 | `ZB45_SHELL_UR` | `A2_right_continuous_black_upper_arm_attached_plane` | 14 | Physical or unresolved |
| P2 | `ZB45_SHELL_UR` | `A2_right_porcelain_mitten_hand_attached_read` | 12 | Physical or unresolved |
| P2 | `ZB45_SHELL_UR` | `A2_right_shoulder_to_arm_continuity_graphite_bridge` | 20 | Physical or unresolved |
| P2 | `ZB46_DRIVE_HUB` | `A2_right_continuous_black_upper_arm_attached_plane` | 12 | Physical or unresolved |
| P2 | `ZB46_HUB_SHOULDER_R` | `A2_right_continuous_black_upper_arm_attached_plane` | 23 | Physical or unresolved |
| P2 | `ZB46_HUB_SHOULDER_R` | `A2_right_shoulder_to_arm_continuity_graphite_bridge` | 20 | Physical or unresolved |
| P2 | `ZB46_HUB_SPINE_KEY` | `A2_right_shoulder_to_arm_continuity_graphite_bridge` | 18 | Physical or unresolved |
| P2 | `ZB46_RECESSED_RAIL_R` | `A2_right_continuous_black_upper_arm_attached_plane` | 22 | Physical or unresolved |
| P2 | `ZB46_RECESSED_RAIL_R` | `A2_right_graphite_wrist_to_body_contact_shadow` | 16 | Visual-helper candidate |
| P3 | `ZB45_SHELL_UL` | `hand_right_sword_hold_marker` | 4 | Non-physical reference |
| P3 | `ZB45_SHELL_UL` | `PUBLIC_BLOCK_V03_right_upper_sleeve_clean_vertical` | 24 | Physical or unresolved |
| P3 | `ZB45_SHELL_UR` | `A2_right_continuous_black_upper_arm_attached_plane` | 16 | Physical or unresolved |
| P3 | `ZB45_SHELL_UR` | `A2_right_graphite_wrist_to_body_contact_shadow` | 14 | Visual-helper candidate |
| P3 | `ZB45_SHELL_UR` | `A2_right_porcelain_mitten_hand_attached_read` | 22 | Physical or unresolved |
| P3 | `ZB45_SHELL_UR` | `A2_right_shoulder_to_arm_continuity_graphite_bridge` | 23 | Physical or unresolved |
| P3 | `ZB46_DRIVE_HUB` | `A2_right_continuous_black_upper_arm_attached_plane` | 12 | Physical or unresolved |
| P3 | `ZB46_HUB_SHOULDER_R` | `A2_right_continuous_black_upper_arm_attached_plane` | 23 | Physical or unresolved |
| P3 | `ZB46_HUB_SHOULDER_R` | `A2_right_shoulder_to_arm_continuity_graphite_bridge` | 20 | Physical or unresolved |
| P3 | `ZB46_HUB_SPINE_KEY` | `A2_right_shoulder_to_arm_continuity_graphite_bridge` | 18 | Physical or unresolved |
| P3 | `ZB46_RECESSED_RAIL_R` | `A2_right_continuous_black_upper_arm_attached_plane` | 22 | Physical or unresolved |
| P3 | `ZB46_RECESSED_RAIL_R` | `A2_right_graphite_wrist_to_body_contact_shadow` | 16 | Visual-helper candidate |

## Findings

- `hand_right_sword_hold_marker` is independently parented to the actor
  armature and is a registration reference. Its three phase records are not
  physical penetrations.
- `A2_right_graphite_wrist_to_body_contact_shadow` is a mesh named and used
  as a visual contact-shadow helper. Four phase records are candidates for
  exclusion, but the file contains no explicit collision-ownership property.
- The upper-arm plane, mitten, shoulder bridge and upper sleeve are mesh
  actor components. They are visible/renderable and have no metadata that
  permits treating their contacts as measurement-only.
- The remaining 25 phase records therefore cannot be accepted as intentional
  grip/docking contacts from metadata alone.
- P3 introduces a shell-to-upper-sleeve pair with 24 triangle overlaps. This
  is not a grip marker or docking-base pair and remains a specific blocker.

## Ruling

```text
V0.84_TECHNICAL_ARCHITECTURE: PASS
V0.84_POSE_RELATIVE_CLEARANCE: PASS
V0.84_BASELINE_CONTACT_OWNERSHIP_AUDIT: HOLD

NON_PHYSICAL_REFERENCE_RECORDS: 3
VISUAL_HELPER_CANDIDATE_RECORDS: 4
PHYSICAL_OR_UNRESOLVED_RECORDS: 25
REAL_PENETRATION_COUNT: UNRESOLVED

INTEGRATION_READY: NO
ASSET_LOCK: NO
PRODUCTION_READY: NO
```

## Next safe action

Open a bounded visual collision-overlay gate for the 25 unresolved records.
The gate may define an explicit collision-ownership exclusion for genuine
visual helpers, but must not move the Blade, actor, rig or phase mechanism.
If any shell, hub, rail or spine penetration into the sleeve, arm, mitten or
shoulder remains visible, open a separate bounded attachment-offset clearance
repair. Do not return to a hand-parented Blade architecture.
