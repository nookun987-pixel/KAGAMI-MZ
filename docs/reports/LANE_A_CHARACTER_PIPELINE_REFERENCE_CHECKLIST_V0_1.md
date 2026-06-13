# LANE A CHARACTER PIPELINE REFERENCE CHECKLIST V0.1

## Purpose
- Capture a reference-only character pipeline checklist extracted from the operator-provided document:
  - `C:\Users\THIS PC\Downloads\Phat trien nhan vat, phac thao, render.md`
- Apply the checklist only as quality-review context for Lane A / final character validation.
- Do not replace `LANE_A_RIG_REPAIR_PLAN_V1.md`.
- Do not open a runtime, render, sync, deploy, push, or production-ready claim.

## Current Lane A Anchor
- Active comparison anchor:
  - `LANE_A_RIG_REPAIR_PLAN_V1.md`
- Lane A repair scope remains:
  - inspect and repair binding evidence for the 29 intended deforming meshes;
  - keep marker/helper and reference-only objects excluded from binding repair;
  - do not overwrite the selected base blend;
  - save only an explicitly approved derivative during a later repair execution task;
  - do not claim production rig ready from proxy binding repair.

## Reference Checklist

### Visual Readability
- Silhouette must read clearly at distance.
- Large shape language must remain recognizable without relying on small details.
- Pose should avoid a stiff, frozen read.
- Line of action should remain legible in validation poses.
- Armor, underlayer, sword, and accent shapes should preserve the intended black/white/violet hierarchy.

### Model Consistency
- Scale and proportion should remain consistent with the locked visual reference sheet.
- Character mass should remain coherent across head, torso, shoulders, arms, legs, and sword.
- Faceless helmet read must stay clean.
- Sensor slits should not introduce extra face-like marks.
- Repeated armor parts should keep left/right consistency unless an intentional asymmetry is documented.

### Mesh And Deformation Review
- Joint-adjacent areas should be checked for deformation artifacts during pose checks.
- Shoulder, elbow, hip, knee, ankle, neck, and wrist regions should not collapse or distort unexpectedly.
- Rigid armor parts may use simple one-group style binding when they are intended to follow one bone.
- Bendable or shared-influence areas should not be treated as complete from one-group binding alone.
- Any object classified as marker/helper or reference-only must stay outside binding repair unless a later gate explicitly changes that role.

### Rig Review
- Parent-child hierarchy should be understandable from the validation evidence.
- FK/IK needs are not required for the current proxy repair claim, but must be considered before any production rig ready claim.
- Pose checks should cover representative upper-body and lower-body movement.
- A successful proxy pose check is not enough to claim a final production control rig.

### Material And Texture Readiness
- Porcelain armor, matte black underlayer, and violet accents should have clear material logic.
- PBR readiness should eventually account for base color, roughness, metallic, and normal detail.
- Material and texture evidence should be captured in a manifest before any final character completion claim.
- Missing UV/material proof remains a final completion gap, not a reason to block the narrow Lane A binding repair by itself.

### Lighting And Render Readiness
- Lighting/render principles from the reference document are useful for later review only.
- No render should be run under this report.
- Public/final render readiness must remain governed by separate render gates and proof files.
- Render appearance must not be used to bypass rig, mesh, material, or validation evidence.

## How To Use This Checklist In Lane A
- During a future Lane A repair result review, classify each inspected mesh as:
  - rigid armor or prop attachment;
  - bendable deformation surface;
  - marker/helper;
  - reference-only object.
- For each repaired or inspected deforming mesh, record:
  - armature modifier target;
  - vertex group names;
  - vertex membership evidence;
  - whether one-group binding is acceptable or multi-bone weighting is required later.
- During pose verification, check both technical binding and visual readability:
  - does the mesh follow the expected bone;
  - does the silhouette stay readable;
  - does the pose create unwanted face-like, body, or armor artifacts;
  - does the result remain a proxy repair rather than a production rig completion claim.

## Scope Locks
- BLEND_EDIT_DONE = NO
- RENDER_DONE = NO
- RUNTIME_DONE = NO
- SYNC_DONE = NO
- PUSH_DONE = NO
- PRODUCTION_RIG_READY = NOT_CLAIMED
- PUBLIC_RENDER_READY = NOT_CLAIMED_BY_THIS_REPORT
- ASSET_LOCK = NOT_CLAIMED_BY_THIS_REPORT

## Evidence Source
- Repo state verified before creation by `git status --porcelain=v1` with empty output.
- Required source-of-truth files were read:
  - `AGENTS.md`
  - `docs/agent_dev_task_board.md`
  - `docs/architecture/MIKAGE_AUTOPILOT_GUARD_V0.md`
  - `docs/architecture/MIKAGE_REPO_BUTLER_MAP.md`
- Lane A anchor read:
  - `LANE_A_RIG_REPAIR_PLAN_V1.md`
- External operator reference read with UTF-8:
  - `C:\Users\THIS PC\Downloads\Phat trien nhan vat, phac thao, render.md`

## Decision
- PASS_AS_REFERENCE_CHECKLIST_ONLY.
- This checklist can support future validation/gap-audit wording.
- It does not authorize runtime, render, blend edits, sync, push, website work, or production-ready claims.
