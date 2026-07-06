# MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1 — CANDIDATE PROOF

> ⚠️ SUPERSEDED 2026-07-06 (operator BOOS, visual/canon ruling): technical validators below PASSED, but
> the operator ruled this candidate FAIL VISUAL/CANON — it reads as a transforming armor plate / shield /
> energy module, not a blade, and its red `#E60000` core color is reversed to electric violet `#8F00FF`
> for this weapon going forward. This file and the associated `.blend`/renders stay on disk as an audit
> trail only — NOT the production base. Revision dispatched as exception #55,
> `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2`, brief at
> `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_2.md`.

STATUS: PASS (technical validators only) — SUPERSEDED by operator visual ruling 2026-07-06, see banner above. No canon-lock, asset-lock, production-ready, or final claim.

## Scope and source

- Task: `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1` (`CONTACT_SHEET_ONLY`).
- Base: `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1.blend`.
- Output: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1.blend`.
- The superseded #52/#53 candidate blends were not opened, linked, or used as a base.
- Canon read-only sources: `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` and `docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` §0.5.
- Evidence source: `LOCAL_BLENDER_5.1_RENDER_AND_REOPEN_VERIFIED`.

## Required survey

- Legacy weapon objects in the approved base were baked/unparented. The observed attachment/world placement was `(1.08, -0.02, 1.75)`; the new phase control stores and preserves this exact value.
- No legacy blade shape key or driver was present to collide with this task.
- One shared custom property, `ZB3_PHASE_CONTROL["blade_phase"]`, selects `0=P1`, `1=P2`, `2=P3`; 44 visibility drivers bind the three phase collections to that property.
- Reopened saved blend successfully. Phase collection object counts: P1 `4`, P2 `20`, P3 `20`.

## Modeling choices for unpinned details

- Normalized length was modeled as `L=2.70 m` proxy scale at the inherited placement.
- Closed cross-section is `0.648 × 0.594 m`, equal to `0.24L × 0.22L`, intentionally near-square and dense.
- Crack layout uses asymmetric rectilinear channels rather than ornamental curves. P2/P3 use swapped, driver-controlled real shell-panel/frame meshes because the brief explicitly permits a swapped cracked mesh.
- Stretch items (Orbital-Logic text, acid vapor, thermal mirage, scorch scarring) were not attempted because this pass is the required contact-sheet geometry/material candidate.

## Phase result

- P1 Compact-Idle: one closed, full-size B4C monolith with flat ends, near-square cross-section, no point, edge, crossguard, wrapped grip, visible core, or emission.
- P2 Brutal Industrial Activation: shell panels partially separate; real red fracture-channel geometry and the black Titanium load frame become visible; emission is mid-strength.
- P3 Tri-Phase Final/Overdrive: panels fully split; black Titanium cage and ferro-calcium core are exposed; red emission is stronger than P2.
- Weapon materials are limited to off-white matte B4C, dark Titanium, and red core/cracks. No weapon material uses violet `#8F00FF`, orange, gold, or magenta.

## PHASE-BY-PHASE HUE CHECK

Samples are from the actual 1200×1200 phase renders used to assemble the contact sheet. Coordinates are `(x,y)` in each source phase image. Channel tests are `R-B` and `R-G`; positive values mean red dominance.

| Phase | Sample | RGB | Hex | R-B | R-G | Ruling |
|---|---:|---:|---:|---:|---:|---|
| P1 | `(678,442)` sealed shell over core | `(236,238,241)` | `#ECEEF1` | `-5` | `-2` | core/crack not exposed; no glow |
| P1 | `(678,660)` sealed shell over core | `(228,230,234)` | `#E4E6EA` | `-6` | `-2` | core/crack not exposed; no glow |
| P2 | `(500,939)` crack | `(244,77,86)` | `#F44D56` | `158` | `167` | red-dominant, mid-strength |
| P2 | `(632,772)` crack | `(242,115,125)` | `#F2737D` | `117` | `127` | red-dominant, mid-strength/bloom edge |
| P3 | `(663,885)` core/crack | `(252,57,64)` | `#FC3940` | `188` | `195` | strongly red-dominant |
| P3 | `(663,668)` core/crack | `(252,84,93)` | `#FC545D` | `159` | `168` | strongly red-dominant/bloom edge |

Additional scan result: P1 contains no red-dominant weapon pixel under the `R>G+25` and `R>B+25` test. P2 and P3 both pass red dominance, with P3 showing the stronger maximum delta. Material-node inspection confirms the red source is the `#E60000` family and no violet material exists on any `ZB3_*` weapon object.

## Locked preservation

- Pre/post deterministic mesh+transform hashes were computed for 28 helmet/slit/halo/cloak/armature objects. Reopened candidate property: `locked_all_unchanged = True`.
- Helmet geometry/material, both existing sensor slits and their unrelated violet signal, white halo, closed cloak, and armature were not edited.
- Weapon attachment placement remains `(1.08, -0.02, 1.75)`.
- The approved base blend is absent from `git status`; therefore it was not overwritten.

## Artifacts and validation

- `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1_WIREFRAME.png` — 1200×1200, inspected; P1 is flat-ended and block-like.
- `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1_CONTACTSHEET_P1P2P3.png` — 3600×1280, inspected; same review angle and labeled P1/P2/P3.
- `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1_KEYART_P3.png` — 1600×2000, inspected; P3 exposed frame/core candidate.
- Saved `.blend` reopened successfully in Blender 5.1.2.
- Gate schema: exactly `contact_sheet.png` and `contact_sheet_review_report.md`.
- `python .mikage/tools/verify_output.py` final output: `PASS`.
- `.blend1`: final filesystem search returned no result after the Blender backup was removed.

## Commands run

1. `git status --porcelain=v1`
2. `git branch --show-current`
3. `git log -1 --oneline`
4. Read active task, #54 exception, canon control map, both locked specs, and task brief.
5. `python .mikage/tools/validate_task.py` → `PASS` before build.
6. Blender base survey for attachment, weapon objects, and armature.
7. Blender 5.1 candidate build/render; system-Python contact-sheet composition.
8. Actual PNG inspection and Pillow RGB pixel sampling.
9. Blender reopen audit of the saved deliverable.
10. `python .mikage/tools/verify_output.py` (final result recorded after gate creation).

## Repository and delivery status

- Start evidence: visibly empty `git status --porcelain=v1`; branch `main`; HEAD `58a7988 Archive #53 candidate deliverables (superseded by #54) - audit trail only, not production base`.
- Changed files are restricted to the five real deliverables plus the two gate files.
- Commit status: `NOT_COMMITTED` (task requests stop after proof; no commit requested).
- Commit hash: `NONE_FOR_THIS_CANDIDATE`; base HEAD is `58a7988`.
- Push status: `NOT_PUSHED` (prohibited).
- Deploy status: `NOT_DEPLOYED` (prohibited).
- Blocker: `NONE`.
- Next safe action: operator reviews P1/P2/P3 visuals and rules on the candidate.

FINAL RESULT: PASS — CANDIDATE ONLY, pending operator visual ruling.
