# MIKAGE_RIDER_SOLO_LOOKDEV_V0_1 Proof

Status: CANDIDATE ONLY.

## Scope

- Task: `MIKAGE_RIDER_SOLO_LOOKDEV_V0_1`
- Source blend: `production/character/MIKAGE_RIDER_SOLO_EEVEE_V0_3.blend`
- Output blend: `production/character/MIKAGE_RIDER_SOLO_LOOKDEV_EEVEE_V0_1.blend`
- Contact sheet: `production/character/reviews/MIKAGE_RIDER_SOLO_LOOKDEV_V0_1_CONTACT_SHEET.png`
- Gate report: `_tmp/mikage_rider_solo_lookdev_gate/gate_report.txt`
- Pass type: relight and material only.

## Work Performed

- Created a rider-solo lookdev derivative from the V0.3 source blend.
- Replaced lighting with one upper-left Rembrandt-style area key and one thin cool rim light.
- Set world/background to void black `#050508`, film transparent off, and compositor disabled.
- Assigned glazed sacred porcelain material to visible white helmet/armor parts.
- Assigned dark graphite material to underlayer, hair, joints, core, and shadow parts.
- Assigned cold metal material to blade/sword parts.
- Kept the helmet slit count at exactly two visible slit objects.
- Saved the blend in dormant state with black slit material.
- Rendered an awakened state by temporarily toggling only the two slit materials to violet for the contact sheet.
- Used the existing source `side_view_orthographic_camera_v0_2_layout` for visible render panels because the active source camera renders empty; camera object/data was not modified.

## Validation

- Source blend reopened: yes.
- Output blend reopened: yes.
- Source mesh count: 267.
- Output mesh count: 267.
- Common mesh vertex hashes unchanged: yes.
- Common mesh/object transforms unchanged: yes.
- Common camera transforms/data unchanged: yes.
- Armatures in source: 0.
- Armatures in output: 0.
- Rig/pose unchanged: yes; no armature or pose data exists in this blend, and all object transforms are unchanged.
- Active camera preserved in output: `rider_solo_v03_temp_camera`.
- Render camera used for contact sheet: existing source camera `side_view_orthographic_camera_v0_2_layout`; camera data unchanged.
- Output world background node: approximately `#050508`.
- Film transparent: off.
- Output lights: `MZ_RIDER_SOLO_one_rembrandt_upper_left_key`, `MZ_RIDER_SOLO_thin_cool_rim`.
- Visible helmet slit objects: `v08_rider_two_slit_signal_lower_only`, `v08_rider_two_slit_signal_upper_only`.
- Contact sheet dimensions: `3600 x 1800`.
- Contact sheet opened and inspected: yes.
- Gate verifier command: `python .mikage\tools\verify_output.py`.
- Gate verifier result: PASS.
- `.blend1` backup result: removed; none left under `production/character`.

## Visual Note

The contact sheet shows the existing rider silhouette on a void-black field, with dormant black slits and an awakened violet-only slit state. The material pass gives the armor a brighter glazed porcelain read, keeps the underlayer/hair dark graphite, and gives blade parts a colder metal material. The source active camera renders empty, so the render panels use the existing visible source camera without changing camera transforms or data.

## Blocker

None for the requested candidate deliverables.
