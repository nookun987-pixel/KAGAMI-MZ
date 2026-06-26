# MIKAGE_HELMET_HEAD_LOOKDEV_V0_1 Proof

Status: CANDIDATE ONLY.

## Source

- Source blend: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_HERO_REAL_LOOKDEV_V0_1.blend`
- Iterated blend: `production/character/MIKAGE_HELMET_HEAD_LOOKDEV_EEVEE_V0_1.blend`
- Sculpt target: `D:/workspace/MZ_FAL_CINEMATIC_OUT/SAMPLE_CONCEPT_01_seed7601.png`
- Hero/light reference: `D:/workspace/MZ_FAL_CINEMATIC_OUT/SAMPLE_CONCEPT_06_seed7606.png`
- Task brief: `production/character/build_log/LANEA_CODEX_TASK_HELMET_HEAD_LOOKDEV_V0_1.md`
- Gate: `.mikage/tasks/active_task.yaml`

## Outputs

- Lookdev blend: `production/character/MIKAGE_HELMET_HEAD_LOOKDEV_EEVEE_V0_1.blend`
- Contact sheet: `production/character/reviews/MIKAGE_HELMET_HEAD_LOOKDEV_V0_1_CONTACT_SHEET.png`
- Proof: `production/character/reviews/MIKAGE_HELMET_HEAD_LOOKDEV_V0_1_PROOF.md`
- Gate report: `_tmp/mikage_helmet_head_lookdev_gate/gate_report.txt`

## Work Performed

- Iterated the existing head-only lookdev blend for a relight/material pass only.
- Did not edit helmet geometry, silhouette, slit placement, slit count, or camera framing.
- Replaced the prior lighting with one upper-left Rembrandt-style area key and one thin rear/side rim light.
- Set the world/background to void black and hid halo/nimbus objects from render; no halo ring is visible in the rendered contact sheet.
- Updated the porcelain material to glazed sacred porcelain: `#f2eeea` base, subsurface approximately `0.2`, coat `1.0`, coat roughness approximately `0.08`, base roughness approximately `0.3`, subtle noise roughness variation, and faint micro-bump craquelure.
- Kept graphite/black underlayer treatment and kept separate dormant black and awakened violet slit states.
- Rendered dormant 3/4 hero and awakened 3/4 hero panels into a `3600 x 1800` contact sheet.

## Scope Result

- Head-only lookdev: yes.
- Body/mount/rig/blade geometry edits: none. Source objects are preserved in the derivative and hidden for the isolated head render.
- Canon/asset lock claim: none.
- Public/final claim: none.
- Push: none.

## Validation

- Output blend reopened: yes.
- Head-only collection found: yes.
- Helmet mesh found: `HEAD_LOOKDEV_V0_1_fixed_tall_wedge_clean_slits_helmet`.
- Helmet dimensions: approximately `1.022 x 0.828 x 1.700`.
- Helmet vertex hash before material pass: `c68d2b813f75d66efca8e7ecf456446f3b9e950f3afc759cb2181e6913b7846e`.
- Helmet vertex hash after material pass/reopen: `c68d2b813f75d66efca8e7ecf456446f3b9e950f3afc759cb2181e6913b7846e`.
- Geometry unchanged: yes.
- Dormant black slit recesses found: 2.
- Awakened violet slit objects found: 2.
- Bridge/lip objects between slits found: 0.
- Saved blend default slit state: dormant black/unlit; awakened violet objects are separate and hidden by default.
- Visible halo/nimbus objects: 0.
- Relight objects: `HEAD_LOOKDEV_relight_single_rembrandt_key`, `HEAD_LOOKDEV_relight_thin_bright_rim`.
- Contact sheet inspected: yes.
- Contact sheet dimensions: `3600 x 1800`.
- `.blend1` backup result: removed; none left under `production/character`.
- Gate verifier command: `python .mikage\tools\verify_output.py`.
- Gate verifier result: PASS.

## Visual Note

The contact sheet shows the same head-only wedge geometry with a more sacred glazed porcelain read, stronger single-side key direction, and a thin rim edge without a halo ring. Dormant and awakened states preserve exactly two slit objects. The panel interiors still read as very dark gray in Eevee rather than absolute black, but the far side is reduced into deep shadow and the sheet background remains void black.

## Blocker

None for the requested candidate deliverables.
