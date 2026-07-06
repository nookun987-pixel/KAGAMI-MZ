# MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2 — CANDIDATE PROOF

> ⚠️ PARTIALLY SUPERSEDED 2026-07-06 (operator BOOS, direct visual review): SILHOUETTE/SHAPE = PASS,
> approved, kept as-is for the next revision. Core COLOR = FAIL — Lane B (Cowork) independently
> pixel-scanned the rendered contact sheet and found the actual brightest core pixels clipped to
> `RGB(255,~30-120,255)` (R equals B = magenta), not blue-dominant violet, even though the hue-check
> samples below (taken off the peak) do measure blue-dominant. Color-only revision dispatched as
> exception #56, `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_3`, brief at
> `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_3.md`. This file's
> `.blend` and geometry remain the shape reference/base for V0_3 — only its material/render output is
> superseded.

STATUS: PASS (silhouette/shape only) — color PARTIALLY SUPERSEDED by operator ruling 2026-07-06, see banner above. No canon-lock, asset-lock, production-ready, or final claim.

## Scope and operator override

- Task: `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2` (`CONTACT_SHEET_ONLY`).
- Base: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1.blend`.
- Output: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2.blend`.
- V0.1's `ZB3_PHASE_CONTROL["blade_phase"]`, phase values `0/1/2`, attachment `(1.08, -0.02, 1.75)`, phase collections, and visibility-driver pattern were reused. The #52/#53 candidate blends were not opened or used.
- `production/character/build_log/ZENITH_BLADE_SLAB_REFERENCE.svg` was used for shape proportions only.
- Per the Fifty-fifth operator ruling, violet `#8F00FF` and the slab silhouette override the stale red/closed-block SSOT clauses only. No SSOT file was edited.

## Geometry choices

- Length proxy: `L=2.70`; width: `0.648`, giving `W/L=0.24`.
- Blunt chisel point occupies the final `13%` of length and tapers in both front and side profiles.
- Grip ring is centered at mid-shaft.
- P2 shell separation is approximately `2.7×` V0.1's P2 gap. Secondary shell ends are shortened and flat so they cannot create a multi-prong tip.
- P3 central blade width is `0.76×` the sealed width; each secondary panel is only `0.14×` sealed width and `0.72L` long. The central point is therefore the primary silhouette.
- The violet signal is one continuous thin seam, slightly proud of the central blade face for unoccluded proof rendering; it is not a surface wash.

## SILHOUETTE SELF-CHECK

The silhouette pass was rendered before final material/lighting work at `192×256` per phase and assembled into the required sheet.

| Phase | Result | Reasoning |
|---|---|---|
| P1 Sealed | YES | Broad parallel slab body, visible mid-shaft ring, and single blunt chisel point remain legible at thumbnail size. |
| P2 Activating | YES | One dominant straight pointed blade remains; shortened flat shell ends create opening without extra tips or a shield/module read. |
| P3 Exposed Core | YES | Broad central pointed shaft reads first; two narrow flat-ended secondary panels do not outweigh it. |

An initial technical silhouette render was inconclusive because the helper switched to Eevee over a black background. After correcting the renderer, P2 initially showed a three-prong read; shading remained paused while the secondary shell ends were shortened/flattened. The final sheet above is the corrected all-YES gate.

## Phase result

- P1: sealed, non-emissive straight B4C slab with one point and grip ring; no visible seam.
- P2: clearly opened structure with dark Titanium visible and one continuous mid-strength violet seam; blade silhouette remains dominant.
- P3: fully separated secondary armor around one broad central pointed blade; full-strength continuous violet seam.
- Front proof camera is true front-on so the structural seam and primary blade hierarchy are measurable rather than occluded.
- Side proof shows the central blade thickness, continuous signal, and chisel-point profile.

## PHASE-BY-PHASE HUE CHECK

Samples are from the actual `1200×1400` phase renders used in the front contact sheet. Coordinates are `(x,y)`. Tests are `B-R` and `B-G`; positive values mean blue-dominant.

| Phase | Sample | RGB | Hex | B-R | B-G | Ruling |
|---|---:|---:|---:|---:|---:|---|
| P1 | `(592,607)` sealed centerline | `(155,163,182)` | `#9BA3B6` | `27` | `19` | cool reflected light only; no saturated signal/emission |
| P1 | `(603,1189)` sealed lower centerline | `(71,79,95)` | `#474F5F` | `24` | `16` | dark/cool, non-emissive |
| P2 | `(606,1186)` seam | `(133,43,255)` | `#852BFF` | `122` | `212` | saturated blue-dominant violet, mid state |
| P2 | `(592,943)` seam | `(140,87,255)` | `#8C57FF` | `115` | `168` | blue-dominant violet/bloom edge |
| P3 | `(603,1190)` seam | `(136,29,255)` | `#881DFF` | `119` | `226` | saturated blue-dominant violet, full state |
| P3 | `(591,607)` seam | `(135,80,255)` | `#8750FF` | `120` | `175` | blue-dominant violet/bloom edge |

The source node color is linear `(0.274, 0.0, 1.0)`, corresponding to the intended electric-violet family. P2 strength is `0.65`; P3 is `1.20`. The signal remains a thin line.

### Zero-red result

ZERO red/crimson pixels were found on the weapon at any phase. A weapon-region scan of every phase using the red test `R > B + 35` and `R > G + 35` returned `0` for P1, `0` for P2, and `0` for P3. Reopened-blend material audit also returned no `ZB55_*` material containing `RED` or `E60000`; weapon materials are B4C, black Titanium, grip-ring metal, and electric violet only.

## Locked preservation and reopen audit

- Saved V0.2 blend reopened successfully in Blender 5.1.2.
- `ZB3_PHASE_CONTROL` retained values `0/1/2` and the original phase-name string.
- Attachment remains `(1.08, -0.02, 1.75)`.
- Deterministic pre/post mesh+transform hashes for 28 helmet/slit/halo/cloak/armature objects produced `locked55_all_unchanged = True`.
- Reopened phase collection counts: P1 `2`, P2 `5`, P3 `5`; 12 phase geometry objects retain visibility drivers against the same control property.
- Helmet, sensor slits, halo, cloak, rig bones, and V0.1 base were not modified.

## Required artifacts

- `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2_WIREFRAME.png` — `1200×1400`, inspected.
- `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2_CONTACTSHEET_FRONT_P1P2P3.png` — `3600×1480`, inspected.
- `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2_SIDEVIEW_P3.png` — `1200×1400`, inspected.
- `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2_SILHOUETTE_THUMBNAILS.png` — `768×310`, inspected.
- `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2_KEYART_P3.png` — `1600×2000`, inspected.
- Gate contains exactly `contact_sheet.png` and `contact_sheet_review_report.md`.

## Commands and repository status

- Pre-start: empty `git status --porcelain=v1`; branch `main`; HEAD `bc3061a Log session lesson: #54 FAIL visual/canon ruling + SSOT conflict flag process`.
- `python .mikage/tools/validate_task.py` → `PASS` before build.
- Blender silhouette-only geometry gate; actual thumbnail inspection and correction before shading.
- Blender final render iterations; actual PNG inspection; Pillow RGB/channel scans.
- Blender saved-file reopen audit.
- `python .mikage/tools/verify_output.py` final output: `PASS`.
- Blender's automatic V0.2 `.blend1` backup was detected and removed; the final filesystem check leaves none.
- Changed files are restricted to the seven real deliverables plus the two gate files.
- Commit status: `NOT_COMMITTED`; commit hash for this candidate: `NONE`.
- Push: `NOT_PUSHED` (prohibited). Deploy: `NOT_DEPLOYED` (prohibited).
- Blocker: `NONE`.
- Next safe action: operator reviews front, side, silhouette, and key-art evidence and rules on the candidate.

FINAL RESULT: PASS — CANDIDATE ONLY, pending operator visual ruling.
