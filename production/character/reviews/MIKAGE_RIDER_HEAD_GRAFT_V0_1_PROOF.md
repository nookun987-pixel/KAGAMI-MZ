# MIKAGE_RIDER_HEAD_GRAFT_V0_1 Proof

Status: CANDIDATE ONLY.

## Scope

- Task: `MIKAGE_RIDER_HEAD_GRAFT_V0_1`
- Rider source blend: `production/character/MIKAGE_RIDER_SOLO_LOOKDEV_EEVEE_V0_1.blend`
- V2 head source blend: `production/character/MIKAGE_HELMET_HEAD_LOOKDEV_EEVEE_V0_1.blend`
- Output blend: `production/character/MIKAGE_RIDER_HEAD_GRAFT_EEVEE_V0_1.blend`
- Contact sheet: `production/character/reviews/MIKAGE_RIDER_HEAD_GRAFT_V0_1_CONTACT_SHEET.png`
- Gate report: `_tmp/mikage_rider_head_graft_gate/gate_report.txt`

## Work Performed

- Created a new graft derivative from the rider solo lookdev source.
- Removed the old rider head/slit assembly: 9 old head-related objects.
- Imported the V2 wedge head assembly from the helmet lookdev blend: helmet shell, two dormant black recessed slits, and two awakened violet slit objects.
- Uniformly scaled and positioned the V2 head to the old head bounds and neck join.
- Preserved dormant black as the default saved slit state.
- Rendered a separate awakened contact-sheet state by toggling only the two V2 slit objects to violet.
- Re-rendered the contact sheet with dormant full-body, awakened full-body, and a neck/head join close crop.

## Validation

- Output blend reopened: yes.
- Body mesh count compared: 258.
- Body mesh hashes unchanged versus rider source: yes.
- Body object transforms unchanged versus rider source: yes.
- Camera transforms/data unchanged versus rider source: yes.
- Lights/world unchanged versus rider source: yes.
- Armatures in rider source: 0.
- Armatures in output: 0.
- Rig/pose unchanged: yes; no armature or pose data exists, and all non-head object transforms are unchanged.
- Old head objects in source: 9.
- Old head objects remaining in output: 0.
- V2 graft objects in output: 5.
- Dormant black slit objects: 2.
- Awakened violet slit objects: 2.
- Violet containment: slit objects only.
- Contact sheet dimensions: `3600 x 1800`.
- Contact sheet opened and inspected: yes.
- Gate verifier command: `python .mikage\tools\verify_output.py`.
- Gate verifier result: PASS.
- `.blend1` backup result: removed; none left under `production/character`.

## Visual Note

The contact sheet shows a single V2 wedge head on the rider body. The old round head is removed, with no visible duplicate head or z-fight. The graft is scaled to the old head height and seated at the existing neck join. Dormant and awakened states keep exactly two slits, with violet contained to the awakened slits only.

## Blocker

None for the requested candidate deliverables.
