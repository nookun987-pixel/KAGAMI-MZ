# Zenith Blade V0.87 — Static Collision Ownership Cleanup

## Result

```text
STATIC_COLLISION_OWNERSHIP: PASS
NON_PHYSICAL_OBJECTS_CLASSIFIED: 5
ACTOR_MITTEN_OWNERSHIP: PHYSICAL_INCLUDED
MITTEN_PHASE_RECORDS: 9
MITTEN_PHYSICAL_OVERLAPS: 216
INTEGRATION_READY: NO
NEXT_GATE: V0.88_MITTEN_INTERFACE_GEOMETRY_AUDIT
```

## Ownership decisions

The following objects are explicitly marked `NON_PHYSICAL_EXCLUDED` in the
new derivative:

- `hand_right_sword_hold_marker` — registration reference.
- `A2_right_graphite_wrist_to_body_contact_shadow` — visual helper.
- `A2_right_continuous_black_upper_arm_attached_plane` — static,
  non-rig attachment-intent proxy.
- `A2_right_shoulder_to_arm_continuity_graphite_bridge` — static,
  non-rig attachment-intent proxy.
- `PUBLIC_BLOCK_V03_right_upper_sleeve_clean_vertical` — public blockout
  proxy.

`A2_right_porcelain_mitten_hand_attached_read` remains explicitly
`PHYSICAL_INCLUDED`.

## Independent mitten result

Each phase contains three Blade-to-mitten records:

- `ZB45_SHELL_UL`: 18 triangle pairs.
- `ZB45_SHELL_UR`: 18 triangle pairs.
- `ZB46_RECESSED_RAIL_R`: 36 triangle pairs.

Across P1/P2/P3:

```text
RECORDS: 9
TRIANGLE OVERLAPS: 216
```

Ownership cleanup does not resolve or conceal this physical blocker.

## Preservation

- Source V0.84 was not overwritten.
- No geometry, material, phase, driver, rig hierarchy or transform changed.
- Only collision-ownership metadata was added in the V0.87 derivative.
- Docking-primary and secondary-grip architecture remain unchanged.

## Ruling

V0.87 closes the static ownership ambiguity. It does not authorize
integration-ready status. Open V0.88 only for a bounded mitten-interface
geometry audit and proof before authorizing any geometry correction.
