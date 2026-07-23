# MIKAGE ZENITH BLADE HERO DETAIL — GATE A AUDIT V0.1

TASK_ID: `ZENITH_BLADE_HERO_DETAIL_GATE_A_AUDIT_V0_1`
STATUS: `AUDIT_EVIDENCE_ONLY`
GATE_A_RESULT: `PASS_AUDIT_ONLY`
GATE_B_AUTHORIZATION: `BLOCKED`
BLOCKER: `BLADE_MECHANICS_AND_MATERIAL_CANON_SOURCE_UNCONFIRMED`
CANON_LOCK: `NO`
ASSET_LOCK: `NO`
PRODUCTION_READY: `NO`
BLENDER_ASSET_CREATED_OR_MODIFIED: `NO`
PUSH_DONE: `NO`
DATE: `2026-07-24`

## 1. Scope

This task audited the existing Zenith Blade V0.12 geometry/integration baseline
and the authority available for a future hero-detail lookdev pass.

The task did not build or render an asset. It did not edit or save any `.blend`
file. The output is bounded audit evidence only.

Source inspected:

`production/character/MIKAGE_HERO_MOUNT_BLADE_HEAD_EEVEE_V0_12.blend`

Outputs:

- `production/character/reviews/MIKAGE_ZENITH_BLADE_HERO_DETAIL_GATE_A_AUDIT_V0_1.md`
- `production/character/reviews/MIKAGE_ZENITH_BLADE_HERO_DETAIL_GATE_A_GEOMETRY_MANIFEST_V0_1.json`

## 2. Canon authority audit

| Authority | Authorized scope | Gate A result |
| --- | --- | --- |
| `docs/architecture/MIKAGE_CANON_CONTROL_MAP.md` | Defines the only authorized SSOT set and draft/canon discipline. | Read and applied. |
| `docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` | Entity phases, synchronized weapon phase names and general phase read. | Sufficient for the phase matrix below. |
| `docs/mikage_character_visual_spec.md` | Character silhouette, material-layer quality and forbidden visual drift. | Applicable as form/quality constraint. |
| `design_system/mikage-cine-color-contract.md` | Cine palette and the narrow violet exception. | Sufficient for the weapon color constraints below. |
| `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` | Separate Blade specification referenced by the Entity Phase Spec. | Not in the Canon Control Map SSOT list; not used as canon. |

The Entity Phase Spec explicitly says the weapon is specified separately. The
Canon Control Map does not authorize the separate Blade Spec as SSOT.
Therefore detailed Blade mechanics, construction, material composition,
surface definition and mechanical motion remain without confirmed canon
authority.

No draft, proof, drift-check or self-described “locked” Blade document was
used to fill this gap.

## 3. Authorized phase matrix

| Phase | Authorized weapon name | Allowed Gate A interpretation |
| --- | --- | --- |
| P1 | `Compact-Idle` | Closed/compact full-size block; phase name and general read only. |
| P2 | `Brutal Industrial Activation` | Activation/shell-split general read only; no inferred mechanism. |
| P3 | `Tri-Phase Final / Overdrive` | Final/overdrive general read only; no inferred mechanism. |

Color ruling:

```text
WEAPON_RED: FORBIDDEN_ALL_PHASES
P1_VIOLET_CORE: NO
P2_VIOLET_CORE: NO
P3_VIOLET_CORE: ALLOWED_SIGNAL_ONLY
VIOLET_FILL_WASH_HALO: FORBIDDEN
```

The Entity Phase Spec's older P3 weapon-core red mapping is superseded by its
own scope note and the Cine Color Contract. Crimson/red entity treatment must
not be transferred to the weapon.

## 4. Source preservation evidence

Before Blender inspection:

```text
SHA256: 38780C45F96F31D540B9C98707FC426ACE6CB3FBEAED9F1FAFB1706CDEDE944F
SIZE_BYTES: 362558
LAST_WRITE_TIME: 2026-06-24 00:09:25
```

After Blender inspection:

```text
SHA256: 38780C45F96F31D540B9C98707FC426ACE6CB3FBEAED9F1FAFB1706CDEDE944F
SIZE_BYTES: 362558
LAST_WRITE_TIME: 2026-06-24 00:09:25
```

Result:

`SOURCE_V0_12_UNCHANGED: YES`

No Blender save operation was called.

## 5. Blender inspection evidence

Resolved executable:

`C:\Program Files\Blender Foundation\Blender 5.1\blender.exe`

Direct background smoke result:

```text
BLENDER_BACKGROUND_SMOKE_PASS
Blender 5.1.2
```

Manifest-generation run:

```text
PROTECTED_OBJECTS_FOUND=6
PROTECTED_OBJECTS_MISSING=0
BLENDER_VERSION=5.1.2
```

The Blender run opened V0.12 in background mode for metadata inspection only.
It did not render and did not save a source or derivative `.blend`.

## 6. Protected-object audit

All six expected protected objects were found:

| Object | Type | Vertices | Vertex/topology SHA-256 |
| --- | --- | ---: | --- |
| `v12_blade_graphite_handle_inside_gauntlet_grip` | MESH | 8 | `AEC9B5201307ED341A023A3D31BCA699B7C1018A90AB0D0FE9140EE22F56725B` |
| `v12_blade_porcelain_gauntlet_clamp_wrapping_handle` | MESH | 8 | `1E5F2233F725A12E2D48C8204D63C2DC70C0ADCC23E9B0001C35A5A7E7BC2EB5` |
| `v12_blade_graphite_bridge_to_existing_gauntlet` | MESH | 8 | `A671ACF7EB03B055C8B9D76A43F0E44FAF7D1A55632FAAF2BE22128B9A3A4562` |
| `v12_zenith_blade_slab_vertical_close_to_hip_not_horizontal` | MESH | 8 | `8B43AF138A4291F0FD35BF597B3588864347C50D18745F9C75ECD0D40B3A7530` |
| `v12_zenith_blade_graphite_centerline_inset` | MESH | 8 | `90A4F6362B874ED7B8D535339CC7135EB067A029DF1E91A23F67690BB1D73FCB` |
| `v12_zenith_blade_lower_holster_docking_foot` | MESH | 8 | `D053EC5AC084D0EAAE6FB9D8E93DF878F2624AC8488CE62F8C241B19317F8680` |

The JSON manifest additionally records object type, parent, local/world
transforms, mesh counts, bounding-box dimensions, and relative vectors and
distances to the gauntlet and holster.

Protected baseline relationships remain the future drift-check baseline:

- Blade silhouette.
- Vertical position close to the hip.
- Gauntlet–grip relationship.
- Graphite bridge to the existing gauntlet.
- Lower holster/docking support.
- Blade clearance from the steed head.

## 7. Candidate evidence classification

The following were treated as draft/candidate evidence only:

- V0.12 proof.
- Lane B V0.12 drift-check.
- V0.12 current-status ruling.

Their `PASS`, `8/8`, `CLOSED` or `NẮN ĐẠT` language was not used to claim
canon-lock, asset-lock or production readiness.

## 8. Commands and evidence

Commands/actions run:

- Verified clean Git status.
- Resolved Blender through the standard installation directory.
- Verified Blender executable metadata.
- Verified no Blender process was running.
- Ran Blender 5.1.2 background factory-startup smoke test.
- Captured source SHA-256, size and timestamp.
- Opened V0.12 in Blender 5.1.2 background mode with a Base64-transported,
  metadata-only audit script.
- Wrote and parsed the bounded JSON geometry manifest.
- Rechecked source SHA-256, size and timestamp.

Evidence source:

`LOCAL_POWERSHELL_STDOUT + BLENDER_5_1_2_BACKGROUND_STDOUT + DIRECT_JSON_PARSE`

Two failed preflight attempts from earlier continuations were not treated as
PASS evidence:

- `blender.exe --version` timed out without stdout.
- The first inline audit script had a PowerShell quoting `SyntaxError`.

The successful smoke and Base64 audit runs supersede those failed attempts for
execution evidence; the failures remain disclosed here.

## 9. Gate result

```text
GATE_A_RESULT: PASS_AUDIT_ONLY
PROTECTED_OBJECT_SET: MATCHED_6_OF_6
SOURCE_V0_12_UNCHANGED: YES
PHASE_MATRIX: CONFIRMED_AT_GENERAL_SSOT_LEVEL
BLADE_MECHANICS_DETAIL_AUTHORITY: UNCONFIRMED
BLADE_MATERIAL_DETAIL_AUTHORITY: UNCONFIRMED
GATE_B_AUTHORIZATION: BLOCKED
BLENDER_ASSET_CREATED_OR_MODIFIED: NO
CANON_LOCK: NO
ASSET_LOCK: NO
PRODUCTION_READY: NO
PUSH_DONE: NO
```

## 10. Next safe action

Operator must create or explicitly promote a valid Blade mechanics/material
SSOT through the Canon Source Discipline before Gate B can be opened.

Until that authority exists, do not build mechanics, define detailed
materials/surfaces, create a hero-detail `.blend`, render a candidate, or
upgrade any asset gate.
