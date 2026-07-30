# Zenith Blade FORM_A1 — Directional Silhouette Proof

## Technical result

```text
SERIES: FORM_A
ROUND: A1
STATUS: TECHNICAL_EVIDENCE_COMPLETE_AWAITING_OPERATOR_VISUAL_RULING
CHANGED_OBJECTS: ZB45_SHELL_LL, ZB45_SHELL_LR
UNAUTHORIZED_CHANGED_OBJECTS: 0
FROZEN_INTERFACE_MAX_VERTEX_DELTA_M: 0.000000000000
MARKER_HANDLE_MAX_WORLD_DELTA_M: 0.000000024214
MITTEN_PHASE_RECORDS: 0
MITTEN_PHYSICAL_OVERLAPS: 0
SPINE_AXIS_DEVIATION_M: 0.000000000000
BLADE_ACTOR_HEIGHT_RATIO: 0.684273308
RELATIVE_SCALE_RANGE: 0.670–0.698
RELATIVE_SCALE_IN_RANGE: TRUE
VISUAL_GATES_1_2_3: AWAITING_OPERATOR_JUDGMENT
```

## Pre-edit classification

- Object inventory classified before editing: `197` objects.
- ALLOWED outer-shell objects: `ZB45_SHELL_LL, ZB45_SHELL_LR, ZB45_SHELL_UL, ZB45_SHELL_UR`.
- FROZEN objects: `193`.
- Unclear objects: `0`.
- Per-vertex freeze was additionally applied to every shell vertex at or above registration world Z `2.119999886 m`, the tailward/interface side established by the read-only directional reference.

## Form edit

- Edited only the forward/lower attack-end vertices of `ZB45_SHELL_LL` and `ZB45_SHELL_LR`.
- Created a straight forward taper, a controlled left/right asymmetry landmark, and a short blunt directional tip.
- Upper/tail interface, grip, docking, auxiliary grip, registration, actor, mitten, rig, phase controls, signal endpoints/carrier, materials, lights, object scale and scene scale were untouched.
- No bevel/chamfer pass, retopo, UV, bake, texture, wear or material edit.

## Machine validation

| Check | Actual |
|---|---:|
| Frozen interface maximum per-vertex delta | `0.000000000000 m` |
| Marker/handle maximum world delta | `0.000000024214 m` |
| P1 mitten overlaps | `0` |
| P2 mitten overlaps | `0` |
| P3 mitten overlaps | `0` |
| Spine-axis deviation | `0.000000000000 m` |
| Blade total length | `4.892554045 m` |
| Actor total height | `7.149999842 m` |
| Blade / actor height | `0.684273308` |

Base V0.89 SHA-256 remained `15E61AA961D4BFE10A0217F6A2DDF36373622744554564411C4C58A178C94B89`. Output blend SHA-256 is
`63C868B8BCA4B6A1EBB3E0E6228F5A7843864EB1D6F4DE52EFAC8A35F7282FD5`.

## Evidence package

- `MIKAGE_ZENITH_BLADE_FORM_A1_CONTACT_SHEET.png`: six governed views.
- `MIKAGE_ZENITH_BLADE_FORM_A1_SILHOUETTE_TEST.png`: solid-black tests at exact `1024`, `256`, and `128` px long dimension.
- `MIKAGE_ZENITH_BLADE_FORM_A1_HERO_COMPARE.png`: `PREVIOUS | FORM_A1 | REFERENCE` under one temporary unsaved `85 mm` hero camera.

The V0.42 reference is a read-only DRAFT comparison reference, not canon.
Visual gates 1–3 are not judged here. Final ruling belongs only to the operator.
All three evidence images were opened and inspected after composition.
The saved output blend was reopened successfully in Blender 5.1.2 with all `197` objects present.
No canon-lock, asset-lock, production-ready claim, push or deploy.
