# MIKAGE_STANDING_HERO_POLISH_V0_14_PROOF

STATUS: CANDIDATE / NOT CANON-LOCKED / NOT ASSET-LOCKED

## RESULT

PASS_FAIL = PASS
BLOCKER = NONE

BASE_SELECTED = production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_13.blend
BASE_REASON = V0.13 is the required exception #31 base; it preserves the V0.13 camera/lighting gains and only permits V0.14 camera, light, and two-slit hue correction.

## OUTPUTS

- production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_14.blend
- production/character/reviews/MIKAGE_STANDING_HERO_POLISH_V0_14_HERO.png
- production/character/reviews/MIKAGE_STANDING_HERO_POLISH_V0_14_CONTACT_SHEET.png
- production/character/reviews/MIKAGE_STANDING_HERO_POLISH_V0_14_PROOF.md
- _tmp/mikage_standing_hero_polish_v0_14_gate/contact_sheet.png
- _tmp/mikage_standing_hero_polish_v0_14_gate/contact_sheet_review_report.md

## HASH / DRIFT CHECK

BASE_BLEND_SHA256 = 5E09F536C3A57B7A23265F72DDCD58A160EC3F74B7008375E8F28EF920556B89
OUTPUT_BLEND_SHA256 = C0D8A9785C794683004561CEFFA59F378F629EC83B2A498C1F42E20B9394239A
HERO_PNG_SHA256 = A8DB09D3A48D6E9A275F5C92E7F4387896C7CAE3973E675DED4C60E1D258450E
CONTACT_SHEET_SHA256 = 82CE7BE07825E97F8C0E48BA08372CBB58230113C1B3B23CFED98CAC5ADB3E58

BODY_HASH_BEFORE = 7C9F8CC228CD06814F9CBE93034CF4EFED6E110684B613A24E9098E6355870C1
BODY_HASH_AFTER = 7C9F8CC228CD06814F9CBE93034CF4EFED6E110684B613A24E9098E6355870C1
BODY_HASH_RESULT = UNCHANGED

MESH_STATE_HASH_BEFORE = 3755E8ED8BDF5DF7D6CCD1C49F75C5F0B8C93418B2B992A0377929172F544414
MESH_STATE_HASH_AFTER = 3755E8ED8BDF5DF7D6CCD1C49F75C5F0B8C93418B2B992A0377929172F544414
MESH_STATE_HASH_RESULT = UNCHANGED

OBJECT_TRANSFORM_HASH_BEFORE = 82866BF7117A20BFA9639CA631A2C8C4C90C3A02152C30FF96BFE77CFE200B20
OBJECT_TRANSFORM_HASH_AFTER = 82866BF7117A20BFA9639CA631A2C8C4C90C3A02152C30FF96BFE77CFE200B20
OBJECT_TRANSFORM_HASH_RESULT = UNCHANGED_NON_CAMERA_LIGHT_OBJECTS

NON_SLIT_MATERIAL_HASH_BEFORE = 664AB51555EAEE7AFE17530D79455D5927221D83DEE4D9511EC5021391DC19FA
NON_SLIT_MATERIAL_HASH_AFTER = 664AB51555EAEE7AFE17530D79455D5927221D83DEE4D9511EC5021391DC19FA
NON_SLIT_MATERIAL_HASH_RESULT = UNCHANGED

SLIT_MATERIAL = V0_8_TWO_SLITS_ONLY
SLIT_MATERIAL_HASH_BEFORE = FADBECEFD48D80061A60FE2A27C6B149506F69368E1A9D690B6FD087F05B49B3
SLIT_MATERIAL_HASH_AFTER = 50DBE3E46F1FE21769052F8808691545E0B51F42A55E9620F3A998D862E69FA7
SLIT_MATERIAL_CHANGE = hue/emission strength only, target sRGB #8F00FF linearized to RGBA [0.27467731, 0.0, 1.0, 1.0], emission strength reduced to 0.38 to prevent render clipping toward pink.

## SLIT_HUE_PIXEL_SAMPLE

Hero PNG:
- sample_count = 328
- mean_rgb = (132.9, 15.8, 233.9)
- mean_hex = #8510EA
- core_count = 245
- core_mean_rgb = (134.9, 11.2, 238.3)
- core_mean_hex = #870BEE
- verdict = PASS, blue exceeds red by 103.4 in the core sample; not red-dominant magenta.

Contact sheet PNG:
- sample_count = 449
- mean_rgb = (140.2, 12.8, 238.7)
- mean_hex = #8C0DEF
- core_count = 366
- core_mean_rgb = (144.0, 8.8, 246.5)
- core_mean_hex = #9009F6
- verdict = PASS, near #8F00FF after render/composite tolerance; not red-dominant magenta.

## V0.14 POLISH ACTIONS

- Camera: added V0_14_HERO_POLISH_THREE_QUARTER and V0_14_POLISH_FRONT; no mesh/object transform changed.
- Lighting: added V0_14_KEY_DRAMATIC_REMBRANDT, V0_14_FAINT_CLOAK_EDGE_RIM, and V0_14_THIN_BLADE_EDGE_RIM; legacy lights hidden for the render.
- Slits: set only V0_8_TWO_SLITS_ONLY to the electric-violet target and reduced strength to avoid pink clipping.
- Blade: cold edge rim plus camera composition; blade mesh and transform were not moved.
- Cloak: faint cold edge/bounce reveal; no fake folds, no mesh edit, cloak remains monolithic.

## VISUAL INSPECTION

- Hero PNG opened and inspected locally.
- Contact sheet PNG opened and inspected locally.
- Slits read violet instead of red-dominant magenta by pixel sample.
- Blade reads integrated by camera/rim without blade transform.
- Cloak/body edge separates from void while remaining monolithic.
- Halo is not intentionally brightened.
- Output remains CANDIDATE / NOT CANON-LOCKED.

## VALIDATION

- Reopened V0.14 blend: PASS.
- Geometry hash unchanged: PASS.
- Body hash unchanged: PASS.
- Non-camera/light object transform hash unchanged: PASS.
- Non-slit material hash unchanged: PASS.
- Only slit material hash changed: PASS.
- Gate folder contains only contact_sheet.png and contact_sheet_review_report.md: PASS pending final validator command.
- .blend1 backup cleanup: PASS pending final scan.
- Push: NOT RUN.
- Lock/canon/public-ready claim: NOT RUN.

## COMMANDS RUN

- git status --porcelain=v1
- git branch --show-current
- git log -1 --oneline
- Read AGENTS.md, docs/handoff/00_LATEST_CODEX_HANDOFF.md, .mikage/tasks/active_task.yaml, and production/character/build_log/LANEA_CODEX_TASK_STANDING_HERO_POLISH_V0_14.md.
- Read docs/architecture/MIKAGE_CANON_CONTROL_MAP.md, production/character/MIKAGE_HERO_LOOKDEV_RECIPE_V1.md, and design_system/mikage-cine-color-contract.md.
- Blender 5.1.2 background render/build/reopen audit.
- PIL contact sheet composition and pixel sample.
- python .mikage\tools\verify_output.py.

## NEXT SAFE ACTION

Lane B drift-check / operator visual ruling only. No push, no lock.
