# AGENTS — Governance Entry Guard

## Repo Entry Protocol

Before any task starts, the agent must declare:

- ACTIVE_LANE: Current lane or phase being worked on.
- RESPONSE_MODE: Required answer/work mode.
- TASK_TYPE: Type of task being performed.
- EXACT_TARGET_FILE: Exact file to modify, or `NONE` for read-only tasks.
- ALLOWED_FILES: Files allowed to be modified for this task.
- FORBIDDEN_FILES: Files or folders that must not be touched.
- TIME_LIMIT: Maximum time allowed for the task.
- COMMAND_LIMIT: Maximum number of commands allowed.
- STATUS_WRITEBACK_TARGET: Where the result/status must be written or reported.
- SUCCESS_CHECK: Exact check required before claiming PASS.
- CANON_SOURCE: Which SSOT file authorizes the canon used in this task, or `NONE` for non-canon/process tasks. (See Canon Source Discipline.)
- DRAFT_INPUTS: Any draft/report/AI-research referenced. Must be labelled DRAFT. A draft may NOT be treated as canon.

No task may proceed if any of these fields are missing.

## Stop Conditions

Stop immediately and report blocker if any condition is true:

- Dirty repo detected before task start.
- Unexpected untracked files appear during task.
- Required command output is missing or inconclusive.
- Planned action touches files outside allowed scope.
- Any `.env` or secret file is involved.
- Task requires runtime, sync, push, deploy, GSheet, Telegram, or external service actions.
- Declared time limit is exceeded.
- Declared command limit is exceeded.
- User approval is required but has not been given.
- The current workspace is not confirmed.

## Windows Command Rule

When running commands in Windows PowerShell or CMD:

- Do not chain commands with `&&`.
- Run required verification commands one by one.
- Prefer simple commands with visible stdout:
  - `git status --porcelain=v1`
  - `git branch --show-current`
  - `git log -1 --oneline`
- If command output is missing, empty when it should not be, or inconclusive, stop and report blocker.
- Do not continue into code changes when repo state cannot be verified.
- If Windsurf command output is unreliable, request external Windows CMD verification.
- Do not treat missing stdout as success.
- Do not claim repo clean unless `git status --porcelain=v1` is visibly empty from a reliable command source.

## External CMD Evidence Fallback

If Windsurf command output is incomplete but external Windows CMD output has been provided by the operator:

- The agent may use the external CMD output as repo-state evidence.
- The external CMD output must include all required checks:
  - `git status --porcelain=v1`
  - `git branch --show-current`
  - `git log -1 --oneline`
- The agent must quote or summarize the observed external CMD evidence in the status report.
- The agent must clearly mark the evidence source as `EXTERNAL_CMD_VERIFIED`.
- If external CMD shows:
  - empty `git status --porcelain=v1`
  - branch = `main`
  - latest commit visible
  then the agent may treat repo state as verified.
- If external CMD output is missing any required check, the agent must stop and report blocker.
- External CMD fallback does not allow bypassing scope rules.
- External CMD fallback does not allow runtime, sync, push, or secret inspection.
- External CMD fallback only resolves repo-state verification issues caused by unreliable Windsurf stdout.

## Canon Source Discipline

Read `docs\architecture\MIKAGE_CANON_CONTROL_MAP.md` BEFORE any canon-touching task.

### SSOT — the ONLY canon (only the operator edits these)

- `docs\handoff\MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md`   (phase P1/P2/P3 + mask ruling)
- `design_system\mikage-cine-color-contract.md`          (cine color; violet only at the 2 slits or a P3 core)
- `docs\mikage_character_visual_spec.md`                  (character form spec)
- `docs\mikage_universe_visual_system.md`                 (world/universe visual)
- `mikage-zenith-design` skill                            (BRAND/UI canon — wins for web/UI)

### Rules

1. DRAFT != CANON. Any external report / deep-research / GPT-Gemini output = DRAFT. It may NOT override SSOT and may NOT be cited as canon. A draft becomes canon ONLY when the operator hand-writes the point into an SSOT file (plus a changelog line).
2. No agent edits SSOT. Only the operator promotes draft -> canon.
3. On layer conflict: BRAND/interface canon wins for web/UI; cine canon only for MV/world-art.

### STOP and report blocker if:

- An external/report doc claims "locked / Vx.x" but is NOT in the SSOT list above.
- A task cites name-collision IPs (e.g. Reo Mikage/Blue Lock, Souji Mikage/Utena, Kamisama Kiss) OR borrows Evangelion mechanics (A.T. Field wings, Berserk mode, S2 auto-regen, Blood Type Blue) as Mikage canon.
- Violet is used as fill / wash / ambient / halo (allowed ONLY at the two sensor slits or a P3 core).
- Head ratio, hair, or Ensō position is changed without that change already existing in an SSOT file.

## Current Scope Lock

- Active work is `GOVERNANCE / OPERATOR_REST_MODE_V0` for broad work.
- Rest Mode remains closed for broad runtime/sync/lane work.
- One controlled exception is open:
  - `MIKAGE_COMPLETION_LOOKDEV_V0_1_RUNTIME_PHASE = COMPLETED_SUPERSEDED_AS_ACTIVE_OUTPUT_TARGET`
  - `MIKAGE_COMPLETION_LOOKDEV_V0_2_RUNTIME_PHASE = COMPLETED_SUPERSEDED_AS_ACTIVE_OUTPUT_TARGET`
  - `MIKAGE_FORMAL_MATERIAL_SILHOUETTE_REVIEW_V0_1_PHASE = COMPLETED_SUPERSEDED_AS_ACTIVE_OUTPUT_TARGET`
  - `MIKAGE_PUBLIC_HERO_RENDER_CANDIDATE_V0_1_PHASE = OPEN`
  - Only allowed next task: `MIKAGE PUBLIC HERO RENDER CANDIDATE V0.1`
  - Only allowed outputs:
    - `production/character/reviews/MIKAGE_PUBLIC_HERO_RENDER_CANDIDATE_V0_1_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_PUBLIC_HERO_RENDER_CANDIDATE_V0_1_PROOF.md`
  - Source/reference files for the allowed task:
    - `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_COMPLETION_LOOKDEV_V0_2.blend`
    - `production/character/reviews/MIKAGE_COMPLETION_LOOKDEV_V0_2_PROOF.md`
    - `production/character/reviews/MIKAGE_COMPLETION_LOOKDEV_V0_2_PROOF_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_FORMAL_MATERIAL_SILHOUETTE_REVIEW_V0_1.md`
    - `docs/mikage_character_visual_spec.md`
    - `docs/mikage_universe_visual_system.md`
    - `design_system/mikage-cine-color-contract.md`
  - Source V0.1 must not be overwritten.
  - Source V0.3 must not be overwritten.
  - No `.blend` edits.
  - Candidate proof only.
  - No asset lock.
  - No public render ready claim.
  - No production rig ready claim.
  - No website/public deployment.
- Second controlled exception is open:
  - `LANE_A_RIG_REPAIR_EXECUTION_V0_1 = OPEN`
  - Only allowed next task: `LANE_A_RIG_REPAIR_EXECUTION_V0_1`
  - Only allowed source blend:
    - `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_FIRST_MOTION_TEST_FROM_APPROVED_GATE_V0_1.blend`
  - Only allowed output blend:
    - `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_REPAIR_PASS_V0_1_FROM_FIRST_MOTION_TEST_V0_1.blend`
  - Only allowed proof report:
    - `docs/reports/LANE_A_RIG_REPAIR_EXECUTION_RESULT_V0_1.md`
  - Inspect/repair only the 29 intended deforming meshes listed in `LANE_A_RIG_REPAIR_PLAN_V1.md`.
  - Keep `hand_right_sword_hold_marker` unbound.
  - Keep `reference_anchor_v1_plane_hidden_from_render` unbound.
  - Save only the approved derivative output blend.
  - Run metadata inspection and non-render in-memory pose check only.
  - No render.
  - No push.
  - No deploy.
  - No website/public/audio/short/release changes.
  - No production rig ready claim.
- Third controlled exception is open:
  - `MIKAGE_HERO_MOUNT_EEVEE_V0_1 = OPEN`
  - Lane B restriction waived for THIS task only (Lane A executes a Lane-B-originated render request).
  - CANON NOTE: inputs below are DRAFT ART-DIRECTION REFERENCE ONLY, not canon. They do NOT override SSOT. On conflict, `docs/mikage_character_visual_spec.md` wins. "LOCK" in these filenames = Lane-B working status, not canon lock.
  - Only allowed next task: `MIKAGE_HERO_MOUNT_EEVEE_V0_1`
  - Allowed inputs (reference only):
    - `production/character/keyart_candidates/MIKAGE_SOLO_BW_V0_4.png`
    - `production/character/keyart_candidates/MIKAGE_STEED_SKELETON_BW_V0_5.png`
    - `production/character/keyart_candidates/MIKAGE_HERO_MOUNT_V0_2.png`
    - `production/character/keyart_candidates/LANEA_BLENDER_HANDOFF_BRIEF.md`
  - Allowed outputs (candidate only):
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_1_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_1_PROOF.md`
    - new `.blend` under `production/character/` (do NOT overwrite existing actor/proxy blends)
  - Render permission GRANTED (Blender + Eevee, local, single still + clay).
  - Build FRESH from blueprints. Do NOT reuse/modify `production_actor` or `proxy_actor` blends.
  - No canon-lock. No asset-lock. No final/production-ready claim. No push. No deploy. Candidate proof only.
  - On drift or SSOT conflict: stop and report.
- Fourth controlled exception is open:
  - `MIKAGE_HERO_MOUNT_EEVEE_V0_2 = OPEN`
  - Lane B restriction waived for THIS task only. Inputs below = DRAFT art-direction reference, not canon; SSOT `docs/mikage_character_visual_spec.md` wins on conflict.
  - Only allowed next task: `MIKAGE_HERO_MOUNT_EEVEE_V0_2` (shape-correction lookdev, continue from V0.1 blend)
  - Allowed inputs:
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_1.blend`
    - `production/character/keyart_candidates/MIKAGE_HERO_MOUNT_EEVEE_V0_1_DRIFT_CHECK.md`
    - `production/character/keyart_candidates/MIKAGE_SOLO_BW_V0_4.png`
    - `production/character/keyart_candidates/MIKAGE_STEED_SKELETON_BW_V0_5.png`
  - Allowed outputs (candidate only):
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_2_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_2_PROOF.md`
    - new `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_2.blend`
  - Render permission GRANTED (Blender + Eevee, local, clay + violet-signal still).
  - Fix only the 8 drift points in the drift-check. Do NOT redesign beyond them. Keep violet = signal only.
  - No canon-lock. No asset-lock. No final claim. No push. No deploy. `.blend1` backups must be deleted before final status. Candidate proof only.
  - On SSOT conflict: stop and report.
- Fifth controlled exception is open:
  - `MIKAGE_HERO_MOUNT_EEVEE_V0_3 = OPEN`
  - Lane B restriction waived for THIS task only. This is a small silhouette-readability correction candidate, not a redesign. Inputs below are DRAFT art-direction reference only and do not override SSOT. On conflict, `docs/mikage_character_visual_spec.md` wins.
  - Only allowed next task: `MIKAGE_HERO_MOUNT_EEVEE_V0_3` (small silhouette-readability correction, continue from V0.2 blend)
  - Allowed inputs:
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_2.blend`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_2_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_2_PROOF.md`
    - `production/character/keyart_candidates/MIKAGE_SOLO_BW_V0_4.png`
    - `production/character/keyart_candidates/MIKAGE_STEED_SKELETON_BW_V0_5.png`
  - Allowed outputs (candidate only):
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_3.blend`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_3_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_3_PROOF.md`
  - Render permission GRANTED (Blender + Eevee, local, full-frame clay + preserved violet-signal still).
  - Allowed correction scope is limited to these three silhouette groups:
    1. Equine readability:
       - Add or strengthen a clearly readable equine head and neck.
       - Raise withers and croup enough to create a readable curved equine topline instead of a flat platform.
    2. Load-bearing legs:
       - Correct all four legs with heavier upper-leg mass, controlled taper, readable hoof or terminal support, and a slightly wider stance only where required for weight readability.
    3. Rider seating:
       - Lower Mikage into the mount body.
       - Reduce the visible stacked docking/platform mass beneath the rider so the silhouette reads as riding, not standing on a platform.
  - Locked preservation:
    - Preserve the current grayscale material treatment.
    - Preserve the existing violet signal treatment exactly; violet remains signal only.
    - Preserve Mikage identity, helmet language, weapon design, and the overall mount concept.
  - Explicitly prohibited:
    - No full mount redesign.
    - No new armor language, decorative panels, cables, wings, horns, tail systems, or large secondary forms.
    - No Mikage helmet, face-rule, body-identity, or canonical proportion changes beyond the minimum seating adjustment.
    - No blade redesign.
    - No new colors, crimson, red, gold, ambient violet, halo, or additional glow.
    - No rigging, animation, UV work, production-finalization work, or unrelated cleanup.
    - Do not overwrite V0.2.
  - Required review render:
    - Exact resolution: `3600 x 1800`.
    - Exact layout: `3 views x 2 passes`.
    - Pass 1: grayscale/clay readability.
    - Pass 2: identical geometry with preserved violet signal.
    - Every panel must be full-frame and show the complete rider and mount, including head, neck, topline, all four legs, and hoof/support terminals.
    - No silhouette-critical cropping.
  - Required validation before PASS:
    - Reopen the saved V0.3 `.blend`.
    - Confirm V0.2 was not modified.
    - Confirm only whitelisted task files changed, plus `AGENTS.md` for this approved exception.
    - Confirm the final PNG is exactly `3600 x 1800`.
    - Open and inspect the actual rendered PNG; do not infer visual success from script completion.
    - Confirm no `.blend1` remains.
  - Required proof must record:
    - source V0.2 file,
    - output V0.3 file,
    - exact three approved correction groups performed,
    - confirmation that no redesign was performed,
    - grayscale lock result,
    - violet-signal lock result,
    - image dimensions and full-frame result,
    - `.blend1` result,
    - files changed,
    - commands run,
    - evidence source,
    - repository status,
    - PASS/FAIL,
    - blocker,
    - next safe action,
    - commit status and commit hash,
    - push status.
  - Stop after producing and committing the V0.3 candidate and its review evidence.
  - No visual approval claim. No production-ready claim. No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.
- Sixth controlled exception is open:
  - `MIKAGE_HERO_MOUNT_EEVEE_V0_4 = OPEN`
  - Lane B restriction waived for THIS task only. This is a STEED BODY + HEAD RE-MASS candidate (larger than a correction: the steed torso/head geometry MAY be rebuilt). Inputs below are DRAFT art-direction reference only and do not override SSOT. On conflict, `docs/mikage_character_visual_spec.md` wins.
  - Only allowed next task: `MIKAGE_HERO_MOUNT_EEVEE_V0_4` (steed re-mass, continue from V0.3 blend)
  - Allowed inputs:
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_3.blend`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_3_CONTACT_SHEET.png`
    - `production/character/keyart_candidates/MIKAGE_STEED_SKELETON_BW_V0_5.png`
    - `production/character/keyart_candidates/MIKAGE_SOLO_BW_V0_4.png`
  - Allowed outputs (candidate only):
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_4.blend`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_4_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_4_PROOF.md`
  - Render permission GRANTED (Blender + Eevee, local, full-frame clay + preserved violet-signal still).
  - Re-mass scope is limited to the STEED only:
    1. Rebuild the steed TORSO as a curved organic equine mass — readable withers, croup, curved topline, and belly keel — matching `MIKAGE_STEED_SKELETON_BW_V0_5.png`. It must NOT read as a flat platform.
    2. Add a clearly readable equine HEAD and NECK at the front per V0.5; graphite, no violet.
    3. Blend the existing V0.3 four legs into the new body so they read load-bearing under organic mass.
  - Locked preservation:
    - Preserve grayscale material treatment and the existing violet signal exactly (violet = rider two slits + hoof points only).
    - Preserve Mikage rider identity, helmet language (exactly two slits), weapon/blade design, and the overall rider-on-mount concept.
    - The rider may be RE-SEATED to sit into the new curved back, but NOT remodeled.
  - Explicitly prohibited:
    - No rider redesign, no blade redesign, no helmet/face-rule/proportion change beyond seating.
    - No new colors, crimson, red, gold, ambient violet, halo, or added glow.
    - No rigging, animation, UV, production-finalization, or unrelated cleanup.
    - Do not overwrite V0.2 or V0.3.
  - Required review render: exact `3600 x 1800`, exact `3 views x 2 passes` (clay readability + identical geometry with violet signal). Every panel full-frame showing the complete rider and mount — head, neck, topline, all four legs, hoof/support terminals. No silhouette-critical cropping.
  - Required validation before PASS: reopen the saved V0.4 `.blend`; confirm V0.2 and V0.3 were not modified; confirm only whitelisted task files changed (plus `AGENTS.md` for this exception); confirm final PNG is exactly `3600 x 1800`; open and inspect the actual rendered PNG (do not infer success from script completion); confirm no `.blend1` remains.
  - Required proof must record: source V0.3 file, output V0.4 file, the re-mass groups performed, confirmation that rider/blade/helmet were not redesigned, grayscale lock result, violet-signal lock result, image dimensions and full-frame result, `.blend1` result, files changed, commands run, evidence source, repository status, PASS/FAIL, blocker, next safe action, commit status and hash, push status.
  - Stop after producing and committing the V0.4 candidate and its review evidence.
  - No visual approval claim. No production-ready claim. No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.
- Seventh controlled exception is open:
  - `MIKAGE_HERO_MOUNT_EEVEE_V0_5 = OPEN`
  - Lane B restriction waived for THIS task only. This is a STEED DETAIL-REFINEMENT candidate (still grayscale clay; refine forms toward the sleek mechanical-equine read of `MIKAGE_STEED_SKELETON_BW_V0_5.png`). Inputs below are DRAFT art-direction reference only and do not override SSOT. On conflict, `docs/mikage_character_visual_spec.md` wins.
  - Only allowed next task: `MIKAGE_HERO_MOUNT_EEVEE_V0_5` (steed detail refinement, continue from V0.4 blend)
  - Allowed inputs:
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_4.blend`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_4_CONTACT_SHEET.png`
    - `production/character/keyart_candidates/MIKAGE_STEED_SKELETON_BW_V0_5.png`
  - Allowed outputs (candidate only):
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_5.blend`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_5_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_5_PROOF.md`
  - Render permission GRANTED (Blender + Eevee, local, full-frame clay + preserved violet-signal still).
  - Detail-refinement scope is limited to the STEED only, keeping the V0.4 overall mass and proportions:
    1. Sharpen the steed HEAD into a readable equine wedge (forehead, muzzle, jaw) instead of a rounded pod; graphite, no violet.
    2. Slim the four legs into articulated PISTON legs (knee/hock joints + piston shafts) while keeping them load-bearing, with larger compressed hooves.
    3. Add chassis PANEL PLANES / seams over the curved torso (flat plated surfaces, not a smooth blob), and VARY the torso mass — cinch the waist so it is not a uniform rounded lump — so the silhouette reads as a sleek machine with rhythm. Panel lines may reveal inner machine-frame structure. Preserve the curved topline / withers / croup.
    4. Resolve the BODY-TO-LEG transition: add a hip shroud / armor plate and a minimal mechanical joint where the rounded torso meets each leg, so the join is not abrupt. Keep it monolithic and purposeful. NO loose cables, hoses, or decorative clutter (brand: no wasted ornament).
  - Locked preservation:
    - Preserve grayscale material treatment and the existing violet signal exactly (violet = rider two slits + hoof points only). NO material/shading change yet — still clay.
    - Preserve Mikage rider identity, helmet language (exactly two slits), weapon/blade design, the rider seating, and the V0.4 mount mass.
  - Explicitly prohibited:
    - No rider, blade, or helmet redesign. No proportion change to the overall mount mass.
    - No new colors, crimson, red, gold, ambient violet, halo, or added glow. No material/lookdev shading pass.
    - No rigging, animation, UV, production-finalization, or unrelated cleanup.
    - Do not overwrite V0.2, V0.3, or V0.4.
  - Required review render: exact `3600 x 1800`, exact `3 views x 2 passes` (clay readability + identical geometry with preserved violet signal). Every panel full-frame showing the complete rider and mount — head, neck, topline, all four legs, hoof/support terminals. No silhouette-critical cropping.
  - Required validation before PASS: reopen the saved V0.5 `.blend`; confirm V0.2/V0.3/V0.4 were not modified; confirm only whitelisted task files changed (plus `AGENTS.md` for this exception); confirm final PNG is exactly `3600 x 1800`; open and inspect the actual rendered PNG; confirm no `.blend1` remains.
  - Required proof must record: source V0.4 file, output V0.5 file, the three refinement groups performed, confirmation that rider/blade/helmet/mass were not redesigned, grayscale lock result, violet-signal lock result, image dimensions and full-frame result, `.blend1` result, files changed, commands run, evidence source, repository status, PASS/FAIL, blocker, next safe action, commit status and hash, push status.
  - Stop after producing and committing the V0.5 candidate and its review evidence.
  - No visual approval claim. No production-ready claim. No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.
- Eighth controlled exception is open:
  - `MIKAGE_HERO_MOUNT_EEVEE_V0_6 = OPEN`
  - Lane B restriction waived for THIS task only. This is a GRAYSCALE MATERIAL LOOKDEV candidate (step 2 of the IP-to-screen plan: materials + lighting only; the V0.5 silhouette is locked and must NOT change). Inputs below are DRAFT art-direction reference only and do not override SSOT. On conflict, `docs/mikage_character_visual_spec.md` wins.
  - Only allowed next task: `MIKAGE_HERO_MOUNT_EEVEE_V0_6` (material lookdev, continue from V0.5 blend)
  - Allowed inputs:
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_5.blend`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_5_CONTACT_SHEET.png`
  - Allowed outputs (candidate only):
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_6.blend`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_6_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_6_PROOF.md`
  - Render permission GRANTED (Blender + Eevee, local, full-frame material lookdev still).
  - Material-lookdev scope (NO geometry/silhouette change — materials, shading, and lighting only):
    1. Assign three DISTINCT materials, separated by value and reflectance: porcelain (rider shell + armor: light value, soft/blurred reflection), graphite (underlayer + hair mass: dark, low reflectance), cold steel (steed chassis: mid value, sharp cool specular edges).
    2. Read the hair as a solid mass, not strands.
    3. Lighting: add a grounded contact shadow under the hooves and a cool rim-light on head, hair, withers, and croup to separate forms from the void.
  - Locked preservation:
    - Do NOT change any geometry, silhouette, proportion, or the V0.5 mount/rider/blade/helmet forms. Materials + lights only.
    - Palette LOCK: void `#050508`, porcelain `#f2eeea`, violet `#8F00FF`. Steel and graphite are neutral cool greys. Violet = signal only (rider two slits + hoof points).
  - Explicitly prohibited:
    - No new colors, crimson, red, warm tones, gold, ambient violet, halo, full-screen wash, or added glow.
    - No geometry edit, no rigging, no animation, no UV redo beyond what material assignment strictly needs, no production-finalization, no unrelated cleanup.
    - Do not overwrite V0.2, V0.3, V0.4, or V0.5.
  - Required review render: exact `3600 x 1800`, exact `3 views x 2 passes` (Pass 1 = material with neutral cool light, no violet; Pass 2 = identical with violet signal restored). Every panel full-frame showing the complete rider and mount. No silhouette-critical cropping.
  - Required validation before PASS: reopen the saved V0.6 `.blend`; confirm V0.2/V0.3/V0.4/V0.5 were not modified; confirm only whitelisted task files changed (plus `AGENTS.md` for this exception); confirm final PNG is exactly `3600 x 1800`; open and inspect the actual rendered PNG; confirm no `.blend1` remains; confirm no geometry was altered.
  - Required proof must record: source V0.5 file, output V0.6 file, the materials assigned, lighting added, confirmation that geometry was not changed, palette/violet-signal lock result, image dimensions and full-frame result, `.blend1` result, files changed, commands run, evidence source, repository status, PASS/FAIL, blocker, next safe action, commit status and hash, push status.
  - Stop after producing and committing the V0.6 candidate and its review evidence.
  - No visual approval claim. No production-ready claim. No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.
- Ninth controlled exception is open:
  - `MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION = OPEN`
  - Lane B restriction waived for THIS task only. This is a MOTION render candidate (step 4 of the IP-to-screen plan: camera + light + violet pulse animation on the locked V0.6 model; NO geometry, material, or rig change). Inputs below are DRAFT art-direction reference only and do not override SSOT. On conflict, `docs/mikage_character_visual_spec.md` wins.
  - Only allowed next task: `MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION` (motion render, continue from V0.6 blend)
  - Allowed inputs:
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_6.blend`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_6_CONTACT_SHEET.png`
  - Allowed outputs (candidate only):
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION.blend`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION.mp4`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION_KEYFRAMES.png`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION_PROOF.md`
  - Render permission GRANTED (Blender + Eevee, local, animated clip).
  - Motion scope (animation of CAMERA, LIGHT, and violet signal ONLY — the model is static, no rig/deformation/locomotion):
    1. Breathing camera zoom 100 -> 104 -> 100 % on a cosine/smoothstep pulse, framing the full rider+mount inside a vertical frame.
    2. Slow cool light-sweep across the forms (rim travels), preserving the V0.6 materials and void background.
    3. Subtle violet pulse on the rider two slits (and hoof points), staying signal-only — never a flood.
  - Frame spec (LOCKED): `1080 x 1920`, H.264, `yuv420p`, 30 fps, ~6-8 s, NO audio.
  - Locked preservation:
    - Do NOT change geometry, materials, proportions, or palette. Camera/light/violet animation only.
    - Palette LOCK: void `#050508`, porcelain `#f2eeea`, violet `#8F00FF` (signal only). No warm color, no full-screen violet wash.
  - Explicitly prohibited:
    - No rig, no character deformation, no leg/locomotion animation, no walk cycle.
    - No geometry or material edit. No new colors, crimson, red, gold, halo, or added glow. No audio. No text/logo/lyrics burned into the clip.
    - Do not overwrite V0.2-V0.6.
  - Required validation before PASS: reopen the saved motion `.blend`; confirm V0.2-V0.6 were not modified; confirm only whitelisted task files changed (plus `AGENTS.md` for this exception); confirm the mp4 is exactly `1080 x 1920`, 30 fps, yuv420p, no audio; open and inspect the actual rendered keyframe sheet and the mp4; confirm no `.blend1` remains.
  - Required proof must record: source V0.6 file, output motion files, the camera/light/violet animation performed, confirmation that geometry/material were not changed, frame-spec result (resolution/fps/pix_fmt/duration/no-audio), `.blend1` result, files changed, commands run, evidence source, repository status, PASS/FAIL, blocker, next safe action, commit status and hash, push status.
  - Stop after producing and committing the motion candidate and its review evidence.
  - No visual approval claim. No production-ready claim. No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.
- Tenth controlled exception is open:
  - `MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER = OPEN`
  - Lane B restriction waived for THIS task only. This is a RIDER DETAIL pass to finish the Mikage character on the locked mount (rider geometry + materials only; steed and mount mass stay locked). Inputs below are DRAFT art-direction reference only and do not override SSOT. On conflict, `docs/mikage_character_visual_spec.md` wins.
  - Only allowed next task: `MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER` (rider detail, continue from V0.6 blend)
  - Allowed inputs:
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_6.blend`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_6_CONTACT_SHEET.png`
    - `production/character/keyart_candidates/MIKAGE_SOLO_BW_V0_4.png`
  - Allowed outputs (candidate only):
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER.blend`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER_PROOF.md`
  - Render permission GRANTED (Blender + Eevee, local, full-frame material lookdev still).
  - Detail scope is limited to the RIDER (Mikage) only, brought up to `MIKAGE_SOLO_BW_V0_4.png` at proper hero scale:
    1. Helmet: egg form, EXACTLY two sensor slits, subtle grayscale facets.
    2. Armor: angular white pauldrons, layered chest cuirass, graphite underlayer, abdominal plates.
    3. Long black hair mass behind the rider; V-taper mantle accent behind the shoulders.
    4. Zenith Blade as a slab gripped in a gauntlet (handle + holster registered), not floating.
    5. Increase rider scale/presence so it reads as the protagonist riding, not a small proxy.
    6. Assign the V0.6 materials to the new rider parts (porcelain shell + armor, graphite underlayer + hair).
  - Locked preservation:
    - Do NOT change the steed geometry (V0.5), the overall mount mass, or the V0.6 material/lighting setup and palette.
    - Palette LOCK: void `#050508`, porcelain `#f2eeea`, violet `#8F00FF` (signal only: rider two slits + hoof points). No warm color, no flood.
  - Explicitly prohibited:
    - No steed redesign. No new colors, crimson, red, gold, halo, or added glow. No rig, no animation, no locomotion.
    - Do not overwrite V0.2-V0.7.
  - Required review render: exact `3600 x 1800`, exact `3 views x 2 passes` (material, no violet / material + violet). Include at least one full-mount context view AND at least two TIGHT rider close-up panels (rider full figure or upper body; the mount MAY be cropped) so the Mikage character detail — helmet two slits, pauldrons/cuirass, hair mass, mantle, blade-in-gauntlet — reads large and clearly.
  - Required validation before PASS: reopen the saved V0.8 `.blend`; confirm V0.2-V0.7 were not modified; confirm only whitelisted task files changed (plus `AGENTS.md` for this exception); confirm final PNG is exactly `3600 x 1800`; open and inspect the actual rendered PNG; confirm no `.blend1` remains; confirm steed geometry unchanged.
  - Required proof must record: source V0.6 file, output V0.8 file, the rider detail groups performed, confirmation that the steed was not changed, material/palette/violet-signal lock result, image dimensions and full-frame result, `.blend1` result, files changed, commands run, evidence source, repository status, PASS/FAIL, blocker, next safe action, commit status and hash, push status.
  - Stop after producing and committing the V0.8 rider candidate and its review evidence.
  - No visual approval claim. No production-ready claim. No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.
- Eleventh controlled exception is open:
  - `MIKAGE_RIDER_SOLO_EEVEE_V0_1 = OPEN`
  - Lane B restriction waived for THIS task only. Goal: ISOLATE the Mikage rider from the V0.8 mount and render him SOLO so the character reads and can be finished (the mount is burying the character). Inputs below are DRAFT art-direction reference only and do not override SSOT. On conflict, `docs/mikage_character_visual_spec.md` wins.
  - Only allowed next task: `MIKAGE_RIDER_SOLO_EEVEE_V0_1` (rider isolation render, from V0.8 blend)
  - Allowed inputs:
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER.blend`
    - `production/character/keyart_candidates/MIKAGE_SOLO_BW_V0_4.png`
  - Allowed outputs (candidate only):
    - `production/character/MIKAGE_RIDER_SOLO_EEVEE_V0_1.blend`
    - `production/character/reviews/MIKAGE_RIDER_SOLO_EEVEE_V0_1_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_RIDER_SOLO_EEVEE_V0_1_PROOF.md`
  - Render permission GRANTED (Blender + Eevee, local, full-frame material lookdev still).
  - Scope (ISOLATE + RENDER only — no rider geometry redesign in this task):
    1. In a new blend derived from V0.8, HIDE/EXCLUDE the steed and all mount chassis/cargo so only the Mikage rider (+ Zenith Blade) renders.
    2. Frame the rider as a SOLO HERO: full figure plus an upper-body close, large in frame.
    3. Background MUST be void black `#050508` (not viewport grey).
    4. Keep the V0.6 materials on the rider (porcelain shell/armor, graphite underlayer/hair). Violet = signal only, the two slits.
  - Locked preservation:
    - Do NOT redesign or re-proportion the rider geometry in this task; this is isolation + framing + render only.
    - Palette LOCK: void `#050508`, porcelain `#f2eeea`, violet `#8F00FF` (signal only). No warm color, no flood, no halo.
  - Explicitly prohibited:
    - No rider geometry edit, no steed edit, no new colors, no rig, no animation.
    - Do not overwrite V0.2-V0.8.
  - Required review render: exact `3600 x 1800`, `3 views x 2 passes` (material, no violet / material + violet), rider large and fully visible on void black. No grey background.
  - Required validation before PASS: reopen the saved solo `.blend`; confirm V0.2-V0.8 were not modified; confirm only whitelisted task files changed (plus `AGENTS.md` for this exception); confirm final PNG is exactly `3600 x 1800`; open and inspect the actual rendered PNG; confirm background is void black; confirm no `.blend1` remains.
  - Required proof must record: source V0.8 file, output solo files, what was hidden/excluded, framing, background-void result, material/palette/violet-signal lock result, image dimensions, `.blend1` result, files changed, commands run, evidence source, repository status, PASS/FAIL, blocker, next safe action, commit status and hash, push status.
  - Stop after producing and committing the rider-solo candidate and its review evidence.
  - No visual approval claim. No production-ready claim. No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.
- Twelfth controlled exception is open:
  - `MIKAGE_RIDER_SOLO_EEVEE_V0_2 = OPEN`
  - Lane B restriction waived for THIS task only. This is a RIDER DETAIL-BUILD pass on the isolated solo rider: add the missing Mikage V0.4 features so the character reads (the solo render revealed the rider is still a crude blockout). Inputs below are DRAFT art-direction reference only and do not override SSOT. On conflict, `docs/mikage_character_visual_spec.md` wins.
  - Only allowed next task: `MIKAGE_RIDER_SOLO_EEVEE_V0_2` (rider detail-build, continue from solo V0.1 blend)
  - Allowed inputs:
    - `production/character/MIKAGE_RIDER_SOLO_EEVEE_V0_1.blend`
    - `production/character/keyart_candidates/MIKAGE_SOLO_BW_V0_4.png`
  - Allowed outputs (candidate only):
    - `production/character/MIKAGE_RIDER_SOLO_EEVEE_V0_2.blend`
    - `production/character/reviews/MIKAGE_RIDER_SOLO_EEVEE_V0_2_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_RIDER_SOLO_EEVEE_V0_2_PROOF.md`
  - Render permission GRANTED (Blender + Eevee, local, full-frame material lookdev still).
  - Detail-build scope, bringing the solo rider up to `MIKAGE_SOLO_BW_V0_4.png`:
    1. Add a long black HAIR MASS behind/around the head (graphite, solid mass).
    2. Add a V-TAPER MANTLE accent behind the shoulders.
    3. Build LAYERED ARMOR: angular white pauldrons, a raised chest cuirass, graphite underlayer at torso sides/joints, segmented abdominal plates.
    4. Helmet: keep egg form + EXACTLY two slits, add subtle facets.
    5. ZENITH BLADE: gripped in a gauntlet/hand (visible handle), slab held, not floating beside.
    6. Refine proportions away from generic mannequin: define chest, waist, and limb taper per V0.4.
  - Locked preservation:
    - Solo isolation kept (no steed). Background void black `#050508`.
    - Palette LOCK: void `#050508`, porcelain `#f2eeea`, violet `#8F00FF` (signal only: two slits). No warm color, no flood, no halo, no new colors.
  - Explicitly prohibited:
    - No steed work. No rig, no animation. No crimson/red/gold/ambient violet.
    - Do not overwrite V0.2-V0.8 or the solo V0.1 blend.
  - Required review render: exact `3600 x 1800`, `3 views x 2 passes` (material, no violet / material + violet), rider large on void black, full figure + an upper-body close so armor/hair/mantle/blade read.
  - Required validation before PASS: reopen the saved V0.2 solo `.blend`; confirm prior blends were not modified; confirm only whitelisted task files changed (plus `AGENTS.md` for this exception); confirm final PNG is exactly `3600 x 1800`; confirm void-black background; open and inspect the actual rendered PNG; confirm no `.blend1` remains.
  - Required proof must record: source solo V0.1 file, output V0.2 file, the detail-build groups performed, palette/violet-signal lock result, background-void result, image dimensions, `.blend1` result, files changed, commands run, evidence source, repository status, PASS/FAIL, blocker, next safe action, commit status and hash, push status.
  - Stop after producing and committing the V0.2 rider candidate and its review evidence.
  - No visual approval claim. No production-ready claim. No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.
- Thirteenth controlled exception is open:
  - `MIKAGE_RIDER_SOLO_EEVEE_V0_3 = OPEN`
  - Lane B restriction waived for THIS task only. This is a RIDER GEOMETRY-UPGRADE + correct-exposure render pass toward final, on the solo rider (the V0.2 reads but is still blocky and the prior render was over-exposed). Inputs below are DRAFT art-direction reference only and do not override SSOT. On conflict, `docs/mikage_character_visual_spec.md` wins.
  - Only allowed next task: `MIKAGE_RIDER_SOLO_EEVEE_V0_3` (rider geometry upgrade, continue from solo V0.2 blend)
  - Allowed inputs:
    - `production/character/MIKAGE_RIDER_SOLO_EEVEE_V0_2.blend`
    - `production/character/keyart_candidates/MIKAGE_SOLO_BW_V0_4.png`
  - Allowed outputs (candidate only):
    - `production/character/MIKAGE_RIDER_SOLO_EEVEE_V0_3.blend`
    - `production/character/reviews/MIKAGE_RIDER_SOLO_EEVEE_V0_3_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_RIDER_SOLO_EEVEE_V0_3_PROOF.md`
  - Render permission GRANTED (Blender + Eevee, local, full-frame still).
  - Geometry-upgrade scope (toward `MIKAGE_SOLO_BW_V0_4.png`, keeping the established silhouette):
    1. BLADE GRIP: the gauntlet hand must visibly wrap the Zenith Blade handle; the blade is held under control and registered to the hand, not floating beside the body.
    2. DE-BLOCKY: bevel the hard cubes, taper the limbs, and define chest / waist / shoulder transitions so the figure reads as a refined porcelain warrior, not a stacked mannequin — without changing the overall pose or silhouette read.
    3. HAIR: a longer, clearly readable black hair mass.
    4. MANTLE: a clearer V-taper mantle behind the shoulders.
  - Render quality (BAKE the correct look so no rescue-grade is needed):
    - LOWER the exposure / key so porcelain holds its form and does NOT blow to flat white; preserve tonal separation between porcelain, black undersuit/graphite, and metal.
    - Slits = controlled COOL violet `#8F00FF`, LOW glow, not hot magenta / not debug-pink.
    - Add a subtle cool rim-light to separate the figure from the void; keep background void black `#050508`.
  - Locked preservation:
    - Solo isolation kept (no steed). Palette LOCK void/porcelain/violet, violet = signal (exactly two slits) only. No warm color, no flood, no halo, no new colors.
  - Explicitly prohibited:
    - No steed work, no rig, no animation, no pose change, no new colors.
    - Do not overwrite V0.2-V0.8 or the solo V0.1/V0.2 blends.
  - Required review render: exact `3600 x 1800`, `3 views x 2 passes` (material, no violet / material + violet), rider large on void black, full figure + an upper-body close so grip/armor/hair/mantle read; porcelain must NOT be blown out.
  - Required validation before PASS: reopen the saved V0.3 solo `.blend`; confirm prior blends not modified; confirm only whitelisted task files changed (plus `AGENTS.md`); confirm final PNG exactly `3600 x 1800`; confirm void-black background and that highlights are not clipped; open and inspect the actual rendered PNG; confirm no `.blend1` remains.
  - Required proof must record: source V0.2 file, output V0.3 file, the geometry-upgrade groups performed, exposure/slit/rim render result, palette/violet-signal lock result, background-void result, image dimensions, `.blend1` result, files changed, commands run, evidence source, repository status, PASS/FAIL, blocker, next safe action, commit status and hash, push status.
  - Stop after producing and committing the V0.3 rider candidate and its review evidence.
  - No visual approval claim. No production-ready claim. No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.
- Fourteenth controlled exception is open:
  - `MIKAGE_HERO_MOUNT_EEVEE_V0_9_MOTION = OPEN`
  - Lane B restriction waived for THIS task only. Goal: assemble the UPGRADED V0.3 rider onto the steed (one hero mount) and render a correct-exposure MOTION clip that matches the approved THE FIRST FORM look. Inputs below are DRAFT art-direction reference only and do not override SSOT. On conflict, `docs/mikage_character_visual_spec.md` wins.
  - Only allowed next task: `MIKAGE_HERO_MOUNT_EEVEE_V0_9_MOTION`
  - Allowed inputs:
    - `production/character/MIKAGE_RIDER_SOLO_EEVEE_V0_3.blend`
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_6.blend`
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER.blend`
  - Allowed outputs (candidate only):
    - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_9_MOTION.blend`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_9_MOTION.mp4`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_9_MOTION_KEYFRAMES.png`
    - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_9_MOTION_PROOF.md`
  - Render permission GRANTED (Blender + Eevee, local, animated clip).
  - Assembly scope (combine, do NOT redesign geometry):
    1. Bring the steed back (un-hide it in the V0.3 blend if its geometry is present, else append the steed objects from the V0.6 mount) and seat the UPGRADED V0.3 rider on the steed back per the V0.8 mount seating.
    2. No new modeling beyond what seating/parenting requires; keep V0.3 rider and steed geometry as-is.
  - Motion scope (animation of CAMERA, LIGHT, violet ONLY — static model, no rig/locomotion):
    1. Breathing camera zoom 100 -> 104 -> 100 % cosine, framing the full rider+mount in a vertical frame.
    2. Slow cool light-sweep; subtle violet pulse on the rider two slits + hoof points (signal only).
  - Render quality (match THE FIRST FORM): LOWER exposure so porcelain holds form (no blown white); slits = controlled cool violet `#8F00FF`, low glow; subtle rim-light; background void black `#050508`.
  - Frame spec (LOCKED): `1080 x 1920`, H.264, `yuv420p`, 30 fps, ~6-8 s, NO audio. No burned text/logo/lyrics.
  - Locked preservation: palette void/porcelain/violet; violet = signal (exactly two slits) only; no warm color, no flood, no new colors; faceless helmet. Do not overwrite prior blends.
  - Required validation before PASS: reopen the saved motion `.blend`; confirm prior blends not modified; confirm only whitelisted task files changed (plus `AGENTS.md`); confirm mp4 is exactly `1080 x 1920`, 30 fps, yuv420p, no audio; confirm highlights not clipped and background void black; open and inspect the keyframe sheet and mp4; confirm no `.blend1` remains.
  - Required proof must record: source files, output motion files, assembly performed (steed restore + seating), camera/light/violet animation, exposure/slit/rim result, frame-spec result, palette/violet-signal lock, `.blend1` result, files changed, commands run, evidence source, repository status, PASS/FAIL, blocker, next safe action, commit status and hash, push status.
  - Stop after producing and committing the motion candidate and its review evidence.
  - No visual approval claim. No production-ready claim. No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.
- Fifteenth controlled exception is open:
  - `ZENITH_BLADE_HERO_DETAIL_GATE_A_AUDIT_V0_1 = OPEN`
  - ACTIVE_LANE: `LANE_A / ZENITH_BLADE_HERO_DETAIL_GATE_A`
  - RESPONSE_MODE: `AUDIT_ONLY_WITH_BOUNDED_OUTPUTS`
  - TASK_TYPE: `Blender metadata/geometry audit plus canon-authority gap report; no build and no render`
  - EXACT_TARGET_FILE: `production/character/reviews/MIKAGE_ZENITH_BLADE_HERO_DETAIL_GATE_A_AUDIT_V0_1.md`
  - ALLOWED_FILES:
    - `AGENTS.md`
    - `production/character/reviews/MIKAGE_ZENITH_BLADE_HERO_DETAIL_GATE_A_AUDIT_V0_1.md`
    - `production/character/reviews/MIKAGE_ZENITH_BLADE_HERO_DETAIL_GATE_A_GEOMETRY_MANIFEST_V0_1.json`
    - `.mikage/tasks/active_task.yaml`
  - FORBIDDEN_FILES:
    - Every canon/SSOT file.
    - `production/character/MIKAGE_HERO_MOUNT_BLADE_HEAD_EEVEE_V0_12.blend` (source; read/inspect only, never save or overwrite).
    - Every other `.blend`, image, proof, drift-check, current-status, website, roster, queue, archive, audio, runtime, sync, deploy, external-service, `.env`, secret or credential file.
    - Any file not explicitly listed under ALLOWED_FILES.
  - TIME_LIMIT: `30 minutes`
  - COMMAND_LIMIT: `20`
  - STATUS_WRITEBACK_TARGET: `production/character/reviews/MIKAGE_ZENITH_BLADE_HERO_DETAIL_GATE_A_AUDIT_V0_1.md`
  - SUCCESS_CHECK:
    - Required governance files are present and read before audit.
    - Source V0.12 SHA-256, size and timestamp are captured before and after inspection and remain identical.
    - Protected V0.12 Blade objects are confirmed and recorded in the geometry manifest.
    - The phase matrix uses only authorized SSOT terminology.
    - Missing detailed mechanics/material authority is recorded without inference.
    - Gate B remains blocked.
    - Only allowed files are staged and committed locally; repo is clean after commit; no push.
  - CANON_SOURCE:
    - Phase relationship: `docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md`
    - Character form: `docs/mikage_character_visual_spec.md`
    - Cine color: `design_system/mikage-cine-color-contract.md`
    - Canon authority map: `docs/architecture/MIKAGE_CANON_CONTROL_MAP.md`
  - DRAFT_INPUTS:
    - `production/character/reviews/MIKAGE_HERO_MOUNT_BLADE_HEAD_EEVEE_V0_12_PROOF.md`
    - `production/character/keyart_candidates/MIKAGE_HERO_MOUNT_BLADE_HEAD_V0_12_DRIFT_CHECK.md`
    - `production/character/reviews/MIKAGE_ZENITH_BLADE_V0_12_CURRENT_STATUS.md`
    - All three are candidate/audit evidence only and must not override SSOT.
  - Only allowed next task for this exception: `ZENITH_BLADE_HERO_DETAIL_GATE_A_AUDIT_V0_1`.
  - Source input:
    - `production/character/MIKAGE_HERO_MOUNT_BLADE_HEAD_EEVEE_V0_12.blend`
  - Required bounded outputs:
    - `production/character/reviews/MIKAGE_ZENITH_BLADE_HERO_DETAIL_GATE_A_AUDIT_V0_1.md`
    - `production/character/reviews/MIKAGE_ZENITH_BLADE_HERO_DETAIL_GATE_A_GEOMETRY_MANIFEST_V0_1.json`
  - Gate ruling:
    - `TASK_SPEC_STATUS = PASS_AS_GOVERNANCE_RULING`
    - `GATE_A_AUTHORIZATION = OPEN_AUDIT_ONLY_WITH_BOUNDED_OUTPUTS`
    - `GATE_B_AUTHORIZATION = BLOCKED`
    - `BLOCKER = BLADE_MECHANICS_AND_MATERIAL_CANON_SOURCE_UNCONFIRMED`
    - `OUTPUT_STATUS = AUDIT_EVIDENCE_ONLY`
    - `AUTO_LOCK = NO`
    - `CANON_LOCK = NO`
    - `ASSET_LOCK = NO`
    - `PRODUCTION_READY = NO`
    - `PUSH_DONE = NO`
  - Gate A permissions:
    - Read the authorized SSOT files and the candidate evidence inputs.
    - Run local, non-render Blender metadata inspection against source V0.12.
    - Record source hash/size/timestamp and protected-object geometry metadata.
    - Create only the audit report and geometry manifest listed above.
    - Update `.mikage/tasks/active_task.yaml` only as required by the repository task validator.
  - Gate A prohibitions:
    - No source or output `.blend` save.
    - No geometry, transform, parenting, material, shader, light, camera, world or render-setting change.
    - No render, animation, motion output or visual candidate creation.
    - No mechanics/material invention and no use of `MIKAGE_ZENITH_BLADE_SPEC_V1.md` as canon while it remains outside the Canon Control Map SSOT list.
    - No Gate B work and no `ZENITH_BLADE_HERO_DETAIL_LOOKDEV_V0_1.blend` creation.
  - Protected V0.12 relationships:
    - Blade silhouette.
    - Vertical position close to the hip.
    - Gauntlet-grip relationship.
    - Graphite bridge to the existing gauntlet.
    - Lower holster/docking support.
    - Blade clearance from the steed head.
  - Protected V0.12 object names to confirm during audit:
    - `v12_blade_graphite_handle_inside_gauntlet_grip`
    - `v12_blade_porcelain_gauntlet_clamp_wrapping_handle`
    - `v12_blade_graphite_bridge_to_existing_gauntlet`
    - `v12_zenith_blade_slab_vertical_close_to_hip_not_horizontal`
    - `v12_zenith_blade_graphite_centerline_inset`
    - `v12_zenith_blade_lower_holster_docking_foot`
  - Geometry manifest requirements for every protected object:
    - Object name and type.
    - Parent relationship.
    - Local and world transforms.
    - Mesh vertex, edge and polygon counts when applicable.
    - Deterministic hash of vertex coordinates and topology when applicable.
    - Bounding-box dimensions.
    - Relative position to the gauntlet and holster.
  - Phase/color audit ruling:
    - P1: `Compact-Idle`.
    - P2: `Brutal Industrial Activation`.
    - P3: `Tri-Phase Final / Overdrive`.
    - `WEAPON_RED = FORBIDDEN_ALL_PHASES`
    - `P1_VIOLET_CORE = NO`
    - `P2_VIOLET_CORE = NO`
    - `P3_VIOLET_CORE = ALLOWED_SIGNAL_ONLY`
    - `VIOLET_FILL_WASH_HALO = FORBIDDEN`
  - Required audit report content:
    - Task/status headers, source/output paths and evidence-source classification.
    - SSOT authority table and explicit Blade-mechanics/material authority gap.
    - Exact phase matrix and superseding weapon-color ruling.
    - Protected-object audit and manifest summary.
    - Source before/after SHA-256, size and timestamp.
    - Commands run, files changed, validation results and repository status.
    - `GATE_A_RESULT`, `GATE_B_AUTHORIZATION`, blocker and one next safe action.
    - Explicit statement that no Blender asset candidate was created or modified.
  - Required validation before local commit:
    - Source V0.12 hash, size and timestamp remain unchanged.
    - Both bounded outputs exist and parse/read successfully.
    - Geometry manifest contains all confirmed protected objects or records a missing/renamed-object blocker.
    - `git diff --check` and `git diff --cached --check` pass.
    - Only ALLOWED_FILES are staged.
    - `validate_task.py` / `verify_output.py`, if run, are supporting evidence only; direct source and manifest checks remain mandatory.
    - No `.blend1` or unexpected temporary/untracked file remains.
  - Commit ruling:
    - One local commit allowed after all validation passes.
    - Suggested message: `docs: audit Zenith Blade V0.12 hero-detail Gate A`
    - No push, amend, merge, tag, PR or remote update.
  - Failback/stop:
    - Missing or renamed protected object: stop and record `BLOCKED: PROTECTED_OBJECT_SET_MISMATCH`.
    - Canon-source conflict or missing authority: record the gap; do not infer and do not open Gate B.
    - Source hash/size/timestamp drift: stop, do not commit, and report `FAIL: SOURCE_V0_12_CHANGED`.
    - Unexpected file or scope drift: stop before commit and report the exact path.
  - Final Gate A output remains audit evidence only. No visual approval, canon-lock, asset-lock, production-ready or public-render-ready claim.
- `RENT` / `GARA` / `Image` / `Call` runtime must not run during this phase.
- Dirty original repo `D:\KAGAMI-MZ` is HOLD only.
- Clean workspace is `D:\KAGAMI-MZ_SYNC_PUSH_V2`.
- Current clean branch baseline is `main`.
- Do not touch `D:\KAGAMI-MZ` unless the task is explicitly read-only classification.
- No Lane B.
- No website / HTML.
- No roster / queue.
- No Z-Blue archive/history cleanup.
- No push.
- Production rig remains `NO`.
- Public render ready remains `NO`.
- Asset lock remains `NO`.

## ROOT ARTIFACT CREATION LOCK

- Agents must not create new files directly in the repository root unless the user explicitly authorizes the exact filename.
- Temporary outputs, smoke results, debug files, generated reports, screenshots, images, JSON test outputs, and local run artifacts must go under one of:
  - `runtime/`
  - `data/`
  - `docs/archive/`
  - `docs/reports/`
  - `_tmp/` outside repo when possible
- If a task creates an unexpected root file, the task must STOP before commit and report:
  - file name
  - command that created it
  - whether it is tracked, untracked, or ignored
  - recommended cleanup action
- Do not use `git clean -fdx` for root cleanup unless explicitly approved by the user.
- Tracked root files must not be moved by pattern. They require an approved move list and rename-only verification.

## Required Source-of-Truth Files

The agent must read these files before proposing the next action:

- `AGENTS.md`
- `docs\architecture\MIKAGE_CANON_CONTROL_MAP.md`
- `docs\agent_dev_task_board.md`
- `docs\architecture\MIKAGE_AUTOPILOT_GUARD_V0.md`
- `docs\architecture\MIKAGE_REPO_BUTLER_MAP.md`

If any required file is missing, stop and report blocker.

## Operator Rule

- Once Operator Rest Mode is active, user must not be asked to manually courier long tasks.
- Agent must read current repo state and task board before proposing the next action.
- Agent must propose one next safe action only.
- Agent must not ask the user to choose between many technical options.
- Agent must not continue from chat memory alone.
- Repo files are the source of truth.

## Allowed Current Phase Actions

During `GOVERNANCE / OPERATOR_REST_MODE_V0`, allowed actions are limited to:

- Read governance files.
- Verify repo state.
- Use external CMD evidence only when Windsurf stdout is unreliable.
- Update one explicitly declared governance file if approved.
- Execute the single controlled exception `MIKAGE_PUBLIC_HERO_RENDER_CANDIDATE_V0_1_PHASE = OPEN` only when the task is exactly `MIKAGE PUBLIC HERO RENDER CANDIDATE V0.1` and the output set is exactly the two listed candidate proof files.
- Execute the controlled exception `LANE_A_RIG_REPAIR_EXECUTION_V0_1 = OPEN` only when the task is exactly `LANE_A_RIG_REPAIR_EXECUTION_V0_1` and the output set is exactly the approved derivative blend plus the approved proof report listed above.
- Execute the controlled exception `MIKAGE_HERO_MOUNT_EEVEE_V0_1 = OPEN` only when the task is exactly `MIKAGE_HERO_MOUNT_EEVEE_V0_1` and outputs are exactly the two listed candidate files (+ new blend).
- Execute the controlled exception `MIKAGE_HERO_MOUNT_EEVEE_V0_2 = OPEN` only when the task is exactly `MIKAGE_HERO_MOUNT_EEVEE_V0_2` and outputs are exactly the listed candidate files (+ new blend).
- Execute the controlled exception `MIKAGE_HERO_MOUNT_EEVEE_V0_3 = OPEN` only when the task is exactly `MIKAGE_HERO_MOUNT_EEVEE_V0_3` and outputs are exactly the listed candidate files (+ new blend), with corrections limited to the three approved silhouette groups.
- Execute the controlled exception `MIKAGE_HERO_MOUNT_EEVEE_V0_4 = OPEN` only when the task is exactly `MIKAGE_HERO_MOUNT_EEVEE_V0_4` and outputs are exactly the three listed candidate files (+ new blend), with changes limited to the approved steed re-mass scope (steed torso, head/neck, and leg blending only; rider, blade, and helmet not redesigned).
- Execute the controlled exception `MIKAGE_HERO_MOUNT_EEVEE_V0_5 = OPEN` only when the task is exactly `MIKAGE_HERO_MOUNT_EEVEE_V0_5` and outputs are exactly the three listed candidate files (+ new blend), with changes limited to the approved steed detail-refinement scope (equine wedge head, piston legs, torso chassis planes + waist rhythm, body-to-leg hip-joint shroud; no cables/clutter; still grayscale clay; rider, blade, helmet, and overall mount mass not changed).
- Execute the controlled exception `MIKAGE_HERO_MOUNT_EEVEE_V0_6 = OPEN` only when the task is exactly `MIKAGE_HERO_MOUNT_EEVEE_V0_6` and outputs are exactly the three listed candidate files (+ new blend), with changes limited to the approved material-lookdev scope (porcelain/graphite/cold-steel materials, contact shadow, rim-light; no geometry change; palette + violet-signal locked).
- Execute the controlled exception `MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION = OPEN` only when the task is exactly `MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION` and outputs are exactly the four listed candidate files (+ new motion blend), with changes limited to the approved motion scope (camera breathing zoom, light-sweep, violet pulse; static model, no rig/locomotion; geometry/material/palette locked; 1080x1920 H.264 yuv420p 30fps no audio).
- Execute the controlled exception `MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER = OPEN` only when the task is exactly `MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER` and outputs are exactly the three listed candidate files (+ new blend), with changes limited to the approved rider-detail scope (Mikage helmet/armor/hair/mantle/blade to the V0.4 spec + material assignment to rider parts only; steed geometry, mount mass, V0.6 materials/lighting, and palette locked).
- Execute the controlled exception `MIKAGE_RIDER_SOLO_EEVEE_V0_1 = OPEN` only when the task is exactly `MIKAGE_RIDER_SOLO_EEVEE_V0_1` and outputs are exactly the three listed candidate files (+ new blend), with changes limited to isolating the rider (hide steed/chassis), solo hero framing, void-black background, and render only (no rider/steed geometry redesign; materials + violet-signal locked).
- Execute the controlled exception `MIKAGE_RIDER_SOLO_EEVEE_V0_2 = OPEN` only when the task is exactly `MIKAGE_RIDER_SOLO_EEVEE_V0_2` and outputs are exactly the three listed candidate files (+ new blend), with changes limited to the approved rider detail-build scope (hair mass, mantle, layered armor, helmet facets, blade-in-gauntlet, proportion refine to the V0.4 spec; solo isolation + void black + palette/violet-signal locked; no steed).
- Execute the controlled exception `MIKAGE_RIDER_SOLO_EEVEE_V0_3 = OPEN` only when the task is exactly `MIKAGE_RIDER_SOLO_EEVEE_V0_3` and outputs are exactly the three listed candidate files (+ new blend), with changes limited to the approved rider geometry-upgrade scope (blade grip wrap, de-blocky/taper, hair, mantle) plus correct-exposure render (no blown porcelain, cool controlled-violet slits, subtle rim, void black); solo isolation, no steed, no pose change, palette/violet-signal locked.
- Execute the controlled exception `MIKAGE_HERO_MOUNT_EEVEE_V0_9_MOTION = OPEN` only when the task is exactly `MIKAGE_HERO_MOUNT_EEVEE_V0_9_MOTION` and outputs are exactly the four listed candidate files (+ new motion blend), with changes limited to assembling the V0.3 rider onto the steed (no geometry redesign) and a camera/light/violet motion render (correct exposure, cool slits, rim, void black; 1080x1920 H.264 yuv420p 30fps no audio; no burned text).
- Execute the controlled exception `ZENITH_BLADE_HERO_DETAIL_GATE_A_AUDIT_V0_1 = OPEN` only when the task is exactly `ZENITH_BLADE_HERO_DETAIL_GATE_A_AUDIT_V0_1`; allow SSOT/candidate-evidence reads, local non-render Blender metadata inspection of source V0.12, and creation of only the bounded audit report plus geometry manifest (and `.mikage/tasks/active_task.yaml` only if required by validation). Gate B, `.blend` creation/edit, rendering, mechanics/material invention, status upgrade and push remain blocked.
- Report next safe action.
- Write structured status back to the requested target.

## Forbidden Current Phase Actions

During this phase, the agent must not:

- Run RENT lane.
- Run GARA lane.
- Run Image lane.
- Run Call lane.
- Run sync.
- Send Telegram messages.
- Append to GSheet.
- Inspect `.env` or credential files.
- Push to GitHub unless the user explicitly approves push for that exact task.
- Use `git add .`.
- Modify multiple files unless explicitly approved.
- Modify or delete files in `D:\KAGAMI-MZ`.

## Required Completion Report

Every task must end with this report structure:

- FILES_CHANGED =
- COMMANDS_RUN =
- EVIDENCE_SOURCE =
- REPO_STATUS =
- SUCCESS_CHECK =
- PASS_FAIL =
- BLOCKER =
- NEXT_SAFE_ACTION =
- COMMIT_DONE =
- PUSH_DONE =

The agent must not say PASS unless the success check has visible evidence.

- Fifteenth controlled exception is open:
  - `MZ_LANE_B_COMFYUI_FACELESS_TEST_WORKFLOW_V0_1 = OPEN`
  - LANE NOTE: This is a Lane B image-gen task, operator-authorized. This exception opens
    Lane B scope for THIS task only. The Lane A Blender scope lock above is unaffected.
  - CANON NOTE: outputs are SAMPLE working assets. Image-gen canon = REFERENCE ONLY; it does
    NOT override SSOT brand canon. On conflict, BRAND canon (mikage-zenith-design /
    `docs/mikage_character_visual_spec.md`) wins. "TEST" status = working, not canon.
  - Only allowed next task: `MZ_LANE_B_COMFYUI_FACELESS_TEST_WORKFLOW_V0_1`
    (prepare a ComfyUI test workflow for the faceless porcelain character — NO batch render).
  - Read-only inventory allowed (list, do not modify):
    - `D:\workspace\ComfyUI\custom_nodes\`
    - `D:\workspace\ComfyUI\models\` (checkpoints, controlnet, ipadapter, clip_vision, loras, vae)
    - existing reference workflows under
      `D:\workspace\MIKAGE_RUNPOD_COMFYUI_STATIC_CHARACTER_PACK_V1\` and any
      `image_canon_gate` / `MIKAGE_CANON` standard in `D:\workspace\ComfyUI\`
  - Only allowed NEW output files (create only; do NOT overwrite anything existing):
    - `D:\workspace\MIKAGE_RUNPOD_COMFYUI_STATIC_CHARACTER_PACK_V1\MZ_FACELESS_TEST_V1.json`
    - `D:\workspace\MIKAGE_RUNPOD_COMFYUI_STATIC_CHARACTER_PACK_V1\MZ_FACELESS_TEST_V1_REF.json`
    - `D:\workspace\MIKAGE_RUNPOD_COMFYUI_STATIC_CHARACTER_PACK_V1\MZ_FACELESS_TEST_V1_REPORT.md`
  - Existing workflow JSONs (`MIKAGE_COMFYUI_*`) must not be modified or overwritten.
  - ComfyUI run permission GRANTED for THIS task only: PROMPT-TUNING render budget = up to 8
    SAMPLE test images total per request (e.g. a few seeds of a reworded prompt), solely to dial
    in the faceless-helmet look. NOT production batch; stop at 8 and report.
  - PHASE-1 DOWNLOAD GRANTED (operator-approved 2026-06-26) — ONLY these two files:
    - `Realistic_Vision_V6.0_NV_B1_fp16.safetensors` (~2.13 GB) -> `D:\workspace\ComfyUI\models\checkpoints\`
      from https://huggingface.co/SG161222/Realistic_Vision_V6.0_B1_noVAE
    - `vae-ft-mse-840000-ema-pruned.safetensors` (335 MB) -> `D:\workspace\ComfyUI\models\vae\`
      from https://huggingface.co/stabilityai/sd-vae-ft-mse-original
  - ENV SETUP GRANTED (operator-approved 2026-06-26): the local ComfyUI Python runtime is not
    installed; the only system Python (3.14) has NO PyTorch CUDA wheel. Codex MAY install
    `Python 3.12.x` (CPython, python.org / winget — interpreter only, no system-wide PATH hijack
    needed), build a venv at `D:\workspace\ComfyUI\venv` FROM Python 3.12, and pip-install the
    runtime deps to make ComfyUI start — specifically: PyTorch + torchvision with a CUDA build
    that supports a GTX 1660 SUPER (Turing, sm_75; e.g. cu124), then `requirements.txt`
    (and `manager_requirements` if needed). These downloads (Python 3.12 + torch ~2-3 GB) ARE
    allowed for THIS setup only. Verify `torch.cuda.is_available() == True` before rendering.
  - After env + Phase-1 models: point `MZ_FACELESS_TEST_V1.json` to the checkpoint + VAE, launch
    ComfyUI with 1660-safe flags (`--use-pytorch-cross-attention --preview-method latent2rgb
    --reserve-vram 0.4`; do NOT force fp16), then render within the prompt-tuning budget above.
    (Create the `checkpoints` / `vae` folders if missing.)
  - CHECKPOINT-SWAP DOWNLOAD GRANTED (operator-approved 2026-06-26): Realistic Vision is too
    human-biased for a faceless object. Codex MAY download ONE additional SD1.5 checkpoint:
    `DreamShaper 8` (SD1.5, pruned fp16 `.safetensors`, ~2 GB) into
    `D:\workspace\ComfyUI\models\checkpoints\`, from Hugging Face (e.g. `Lykon/dreamshaper-8` or
    `Lykon/DreamShaper`). If that exact file is unavailable, pick another versatile/object-capable
    SD1.5 checkpoint and state which. Keep Realistic Vision on disk too.
  - MODEL downloads still NOT granted beyond the files named above (IP-Adapter SD1.5, CLIP vision,
    ControlNet aux/models): LIST them for separate operator approval. (Pip/runtime deps + the one
    DreamShaper checkpoint above are the only exceptions.)
  - FAL.AI IMAGE-GEN GRANTED (operator-approved 2026-06-26): Codex MAY call the fal.ai API to
    generate CINEMATIC variations of the Mikage character from a control image + prompt
    (img2img / ControlNet / Flux-style, keeping the faceted helmet + two violet "=" slits).
    - API key: load `FAL_KEY` from `D:\workspace\.env` (operator placed it there). NEVER print, log, or commit the key.
    - Control input (read-only): `D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\keyart_candidates\MIKAGE_SOLO_VIOLET_V0_4.png` (or a crop of it).
    - SPEND CAP this round: at most 10 generated images (~under $2). Stop at 10 and report.
    - Output ONLY to: `D:\workspace\MZ_FAL_CINEMATIC_OUT\` (create it). Save each PNG SAMPLE-labelled.
    - Do NOT modify any canon/keyart source. Do NOT auto-escalate spend.
  - No `D:\MIKAGE ZENITH AUDIO` changes. No website/public/audio/short/release changes.
  - No canon-lock. No asset-lock. No final / production-ready / PASS / verified claim.
    No push. No deploy. SAMPLE label on all outputs. Candidate/test only.
  - Required validation before reporting done: confirm ONLY the three `MZ_FACELESS_*` files
    above were created; confirm no existing workflow JSON was modified; if a test image was
    rendered, open and inspect the actual PNG (do not infer success from script completion).
  - On drift or SSOT conflict: stop and report.
- Sixteenth controlled exception is open:
  - `MIKAGE_V0_2_HERO_FINISH_LOOKDEV_V0_1 = OPEN`
  - Lane B restriction waived for THIS task only. This is a LOOKDEV / MATERIAL / LIGHTING finish on the operator-accepted V0.2 standing figure. The FORM was accepted by the operator's eye = Lane-B/operator working status, NOT a canon-lock. Geometry is LOCKED and must NOT change — materials, shading, lighting only. Inputs below are DRAFT art-direction reference only and do not override SSOT. On conflict, `docs/mikage_character_visual_spec.md` + `production/character/MIKAGE_HERO_LOOKDEV_RECIPE_V1.md` win.
  - Only allowed next task: `MIKAGE_V0_2_HERO_FINISH_LOOKDEV_V0_1` (lookdev finish, from the V0.2 completion-lookdev source)
  - Allowed inputs:
    - `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_COMPLETION_LOOKDEV_V0_2.blend`
    - `production/character/reviews/MIKAGE_PUBLIC_HERO_RENDER_CANDIDATE_V0_1_CONTACT_SHEET.png`
    - `production/character/MIKAGE_HERO_LOOKDEV_RECIPE_V1.md`
    - `docs/mikage_character_visual_spec.md`
    - `design_system/mikage-cine-color-contract.md`
  - Allowed outputs (candidate only):
    - new `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_HERO_FINISH_LOOKDEV_V0_1.blend`
    - `production/character/reviews/MIKAGE_HERO_FINISH_LOOKDEV_V0_1_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_HERO_FINISH_LOOKDEV_V0_1_PROOF.md`
  - Render permission GRANTED (Blender, local; Cycles preferred for glazed-porcelain SSS/coat, Eevee allowed only if it achieves the recipe look; full-frame hero still + contact sheet).
  - Lookdev scope (NO geometry/silhouette change — materials, shading, lighting only) per `MIKAGE_HERO_LOOKDEV_RECIPE_V1`:
    1. Material: helmet/shell = glazed sacred porcelain (base `#f2eeea`, soft SSS, clear coat, subtle craquelure micro-bump — not flat plastic); body/underlayer = deep matte graphite / black mass; blade = cold metal.
    2. Lighting: 1-key Rembrandt from upper-left angled down; thin restrained rim to separate the silhouette; fill near zero so ~2/3 sinks into the void; fine grain.
    3. World/background = `#050508` absolute.
  - Locked preservation:
    - Do NOT change any geometry, silhouette, proportion, the faceted wedge helmet, the exactly two violet slits, the vertical blade position, or body mass. Materials + lights only.
    - Confirm the V0.2 source mesh hashes are UNCHANGED in the output (geometry preserved).
    - Palette LOCK: void `#050508`, porcelain `#f2eeea`, violet `#8F00FF`. Violet ONLY inside the two slits — no halo, wash, flood, neon, gold, crimson, or extra accent colour.
  - Explicitly prohibited:
    - No geometry edit, no silhouette / helmet / blade / body change, no rebuild, no rig, no animation, no UV redo beyond what material assignment strictly needs.
    - No halo flood, neon wash, ambient violet, or extra colours.
    - Do not overwrite the V0.2 source blend.
  - Required review render: full-frame hero still + a contact sheet (front · 3/4 · side · helmet+slits close); show the complete figure, no silhouette-critical cropping.
  - Required validation before PASS: reopen the saved finish `.blend`; confirm the V0.2 source was NOT modified and its mesh hashes are unchanged (geometry preserved); confirm only whitelisted task files changed (plus `AGENTS.md` for this exception); open and inspect the actual rendered PNG (do not infer success from script completion); confirm violet only in the two slits and void background; confirm no `.blend1` remains.
  - Required proof must record: source V0.2 file + hash, output finish file, materials assigned, lighting added, confirmation geometry/mesh-hash unchanged, palette/violet-signal lock result, files changed, commands run, evidence source, repository status, PASS/FAIL, blocker, next safe action, commit status and hash, push status.
  - Fallback if it still reads toy/clay after finish: do NOT touch geometry. In order — (1) lower fill further, (2) raise shadow/light contrast, (3) deepen porcelain material (less plastic), (4) thin the rim, (5) read body mass heavier in shadow, (6) keep violet small/contained. Only revisit silhouette if lookdev cannot fix it.
  - No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy. Candidate proof only.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.

- Seventeenth controlled exception is open:
  - `MIKAGE_MATCH_3D_TO_MASTER_V0_1 = OPEN`
  - Lane B restriction waived for THIS task only. Purpose: pull the 3D production-actor draft toward the approved 2D canon design master so there is ONE 3D implementation of the master — NOT a new form. Unlike the Sixteenth exception (lookdev only), THIS task IS PERMITTED to edit geometry (helmet / chest panels / body-to-cloak mass / silhouette / proportions) for the sole purpose of matching the master. This is working status, NOT a canon-lock. SSOT wins on any conflict.
  - SOURCE OF TRUTH (master) = the 2D design master, now IN-REPO at `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f6817cbc4f7d6a861b8e9f111f78096ca173f5bf5c5966a378069c0e06429`; copied from Studio OS FANDOM_KIT, identical bytes). Codex MUST open and read this PNG as the design reference. Immutable identity marks: faceless porcelain helmet (no eyes/nose/mouth); exactly two sensor slits; violet `#8F00FF` emissive ONLY at the two slits; void-black body mass / draped robe; graphene neck; WHITE halo ring (white, not violet); official art = sculptural realism. The master does NOT pin a specific "wedge" helmet shape — it locks "faceless porcelain"; a wedge shape is only required if the operator explicitly pins it. **[OPERATOR RULING 2026-07-03: the WHITE halo ring line above is now a dated, explicit-confirmed canon lock — see `docs/handoff/HALO_RING_RULING_2026-07-03.md` for the full ruling + S0/S1/S2 state-machine reference. Do not follow any older doc that says "violet halo ring" (3 files marked SUPERSEDED for this reason).]**
  - Only allowed next task: `MIKAGE_MATCH_3D_TO_MASTER_V0_1`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_MATCH_3D_TO_MASTER_V0_1.md`.
  - Allowed base input (PRODUCTION-ACTOR line ONLY): `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_HERO_FINISH_LOOKDEV_V0_1.blend` (or `_COMPLETION_LOOKDEV_V0_2.blend`). Report BASE_SELECTED + BODY_HASH_BEFORE.
  - PROHIBITED inputs: NO geometry from the RIDER / HEAD-GRAFT / HERO-MOUNT / STEED lines or from the `FIGURE_V0.4` web prototype. No importing another scene.
  - Allowed references: `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (the master, MUST read), `docs/mikage_character_visual_spec.md`, `production/character/MIKAGE_HERO_LOOKDEV_RECIPE_V1.md`, `design_system/mikage-cine-color-contract.md`.
  - Allowed outputs (candidate only):
    - new `production/character/production_actor/rig_derivatives/MIKAGE_MATCH_3D_TO_MASTER_V0_1.blend`
    - `production/character/reviews/MIKAGE_MATCH_3D_TO_MASTER_V0_1_CONTACT_SHEET.png` (front · 3/4 · side · helmet+slits close)
    - `production/character/reviews/MIKAGE_MATCH_3D_TO_MASTER_V0_1_PROOF.md`
  - KEEP (already on-direction): dark vertical body; exactly two violet slits; vertical slab blade beside the body.
  - FIX toward master: (1) helmet → faceless porcelain per master (drop the round/octagonal read; wedge only if operator pins it); (2) reduce robot/chest-panel/proxy-plate reading; (3) reshape body toward a closed draped void-cloak mass (no stack-block); (4) match master silhouette + proportions (tall, closed, slender); (5) preserve faceless absolutely; (6) add the WHITE halo ring per master.
  - Locked: violet ONLY in the two slits (no violet halo / wash / flood / gold / crimson). Palette LOCK void `#050508` / porcelain `#f2eeea` / violet `#8F00FF`. No second body form. No reuse of V0.4 foundation geometry. Geometry WILL change (this task edits form) — record BODY_HASH_AFTER and exactly what changed; do NOT overwrite the base blend.
  - Render permission GRANTED (Blender, local; Cycles preferred; full-frame hero still + contact sheet). Inspect the actual rendered PNG before any PASS claim.
  - FAIL = DESIGN DRIFT: if Codex invents another body form, reuses V0.4/RIDER geometry, or treats a development draft as an alternate canon form → stop and return `PASS_FAIL = FAIL`, `BLOCKER = DESIGN_DRIFT`, `SOURCE_OF_TRUTH = MIKAGE_CHARACTER_REFERENCE_16x9.png`, `EXPECTED = ONE 3D IMPLEMENTATION OF THE MASTER`.
  - Clean-repo gate required before run (`git stash push -u` if dirty). No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy. Candidate proof only.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.

- Eighteenth controlled exception is open:
  - `MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2 = OPEN`
  - Operator verdict on `MIKAGE_MATCH_3D_TO_MASTER_V0_1` = PASS_WITH_FIX. Body direction APPROVED (void-black draped robe, faceless porcelain helmet, exactly two violet slits, vertical blade, single standing public form). NOT yet canon-locked. Purpose of THIS task: one constrained MICRO geometry-correction pass on three named areas only, then re-review. NO lookdev finish in this task. SSOT + the 2D master win on any conflict.
  - SOURCE OF TRUTH (master) = `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f6817cbc4f7d6a861b8e9f111f78096ca173f5bf5c5966a378069c0e06429`). Codex MUST open and read it.
  - Only allowed next task: `MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_MICRO_GEOMETRY_CORRECTION_V0_2.md`.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_MATCH_3D_TO_MASTER_V0_1.blend`. Report BASE_SELECTED + BODY_HASH_BEFORE.
  - PROHIBITED inputs: any RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 geometry; no scene import.
  - PRESERVE (do NOT change): current robe silhouette; current body proportions; exactly two slits (count + relative position); vertical Zenith Blade slab; overall ovoid helmet DIRECTION (do not return to the old pointed wedge); faceless (no eyes/nose/mouth).
  - FIX ONLY these three areas:
    1. HELMET — keep the ovoid direction but reduce the perfect egg/mannequin read: slightly narrow the lateral profile, give the crown and chin a little more direction, introduce restrained sculptural planar character + very slight planar asymmetry so it reads as porcelain sculpture, not a perfect egg or alien-egg/generic mask. No facial features. No pointed-wedge return. Keep exactly two slits.
    2. HALO — reduce physical ring thickness markedly; separate it slightly further behind the helmet; make it read as luminous light (emission/bloom), NOT a solid white tube. Side view must NOT read as a vertical white slab/column. Halo must NOT be brighter than the helmet. Halo stays WHITE (no violet).
    3. NECK / ROBE JOIN — soften the hard neck-post transition; let the dark robe mass receive the helmet base naturally into one continuous silhouette. Do NOT canon-lock "graphene neck"; neck material remains UNSPECIFIED pending operator ruling.
  - Locked: violet ONLY in the two slits (no violet halo/wash/flood/gold/crimson). Palette LOCK void `#050508` / porcelain `#f2eeea` / violet `#8F00FF`. No second body form. No V0.4 geometry reuse. Geometry WILL change in the three named areas only — record BODY_HASH_AFTER + exactly what changed; do NOT overwrite the base blend.
  - Render permission GRANTED (Blender, local; full-frame hero still + contact sheet front/3-4/side/helmet-close). Inspect the actual PNG before any PASS claim. Side view MUST be shown (halo + neck join are judged there).
  - Allowed outputs (candidate only):
    - new `production/character/production_actor/rig_derivatives/MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2.blend`
    - `production/character/reviews/MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2_PROOF.md`
  - FAIL = MICRO-FIX SCOPE DRIFT: if anything outside the three named areas changes (robe silhouette, body proportions, slit count/position, blade, or a wholesale new helmet form) → stop and return `PASS_FAIL = FAIL`, `BLOCKER = MICRO_FIX_SCOPE_DRIFT`, listing what drifted.
  - Clean-repo gate required before run (`git stash push -u` if dirty). NO lookdev finish. No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy. Candidate proof only.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.

- Nineteenth controlled exception is open:
  - `MIKAGE_HELMET_ONLY_GEOMETRY_PASS_V0_3 = OPEN`
  - Operator verdict on V0.2: halo + neck/robe + slits APPROVED; the HELMET still reads as an elongated mannequin/egg and is not yet hero-grade. This task = ONE final helmet-ONLY geometry pass, then stop for owner review. NO lookdev, NO material change. SSOT + the 2D master win on conflict.
  - SOURCE OF TRUTH (master) = `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f6817cbc4f7d6a861b8e9f111f78096ca173f5bf5c5966a378069c0e06429`). Codex MUST open and read it.
  - Only allowed next task: `MIKAGE_HELMET_ONLY_GEOMETRY_PASS_V0_3`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_HELMET_ONLY_GEOMETRY_PASS_V0_3.md`.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2.blend`. Report BASE_SELECTED + BODY_HASH_BEFORE.
  - PROHIBITED inputs: any RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 geometry; no scene import.
  - PRESERVE COMPLETELY UNCHANGED (verify by hash + transform): robe, neck, halo, blade, camera scale, and all body geometry. Only the helmet mesh may change.
  - CORRECT ONLY the helmet:
    1. Reduce the elongated egg impression: shorten total helmet height ~6–8%; widen the middle/lower mass ~4–6%; remove the pointed downward chin taper.
    2. Strengthen the existing six-plane radial rhythm: broad, subtle sculptural planes; a clearer side-plane break in three-quarter view; a slightly flatter crown; a controlled lower termination instead of a smooth mannequin oval.
    3. Preserve all locked identity rules: completely faceless porcelain shell; exactly two thin parallel recessed sensor slits; no eyes/nose/mouth or facial anatomy; no fox/kitsune/samurai/anime/gaming-mask language; no extra seams/vents/panels/decorative detail; do NOT turn it into a box or mechanical helmet.
  - Locked: violet ONLY in the two slits. Palette LOCK void `#050508` / porcelain `#f2eeea` / violet `#8F00FF`. No second body form. No V0.4 reuse. Helmet geometry WILL change — record BODY_HASH_AFTER, helmet-mesh hash before/after, and confirm every preserved region hash is unchanged. Do NOT overwrite the base blend.
  - Render permission GRANTED (Blender, local). Required panels: front · three-quarter · STRICT side · helmet close-up · silhouette comparison against V0.2. Inspect the actual PNG before any PASS claim.
  - Allowed outputs (candidate only):
    - new `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_ONLY_GEOMETRY_PASS_V0_3.blend`
    - `production/character/reviews/MIKAGE_HELMET_ONLY_GEOMETRY_PASS_V0_3_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_HELMET_ONLY_GEOMETRY_PASS_V0_3_PROOF.md`
  - FAIL = HELMET SCOPE DRIFT: if anything other than the helmet mesh changes → stop, `PASS_FAIL = FAIL`, `BLOCKER = HELMET_SCOPE_DRIFT`, list what drifted.
  - FALLBACK if the result still reads generic/mannequin after this pass: STOP micro-fixing. Do NOT keep adding detail and do NOT use material/lookdev to hide geometry. Report `PASS_FAIL = FAIL`, `BLOCKER = HELMET_NEEDS_REBUILD_FROM_BLOCKING`, and recommend rebuilding the helmet from large primary blocking off the locked Mikage silhouette as a separate authorized task.
  - Clean-repo gate required before run (`git stash push -u` if dirty). NO lookdev. No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.

- Twentieth controlled exception is open:
  - `MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4 = OPEN`
  - V0.3 returned `HELMET_NEEDS_REBUILD_FROM_BLOCKING` (operator-confirmed). The helmet is REBUILT from primary blocking off a now-locked helmet design target — NOT a tweak of the V0.2/V0.3 oval mesh. Everything except the helmet stays byte-identical. NO lookdev/material. SSOT + 2D master win on conflict.
  - SOURCE OF TRUTH = `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f6817cbc4f7d6a861b8e9f111f78096ca173f5bf5c5966a378069c0e06429`) + the locked helmet design target `production/character/build_log/MIKAGE_HELMET_BLOCKING_SPEC_V0_1.md`. Codex MUST read both.
  - Only allowed next task: `MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_HELMET_REBUILD_FROM_BLOCKING_V0_4.md`.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2.blend` (the approved halo/neck/robe version). Report BASE_SELECTED + BODY_HASH_BEFORE. The V0.3 oval helmet mesh is DISCARDED, not edited.
  - PROHIBITED inputs: any RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 geometry; no scene import.
  - PRESERVE byte-identical (verify by hash + transform): robe, neck, halo, blade, camera scale, and all body geometry. The new helmet's wedge jaw must SEAT into the existing graphene-neck opening (adapt the helmet base to the preserved neck; do NOT move the neck). If seating is impossible without touching the neck, STOP and report rather than silently editing the neck.
  - REBUILD the helmet from primary blocking per the locked spec:
    1. A clear, wide, slightly CONCAVE front FACE-PLANE carrying the exactly-two sensor slits.
    2. A readable CROWN/BROW BREAK separating the back skull from the face-plane (must read in three-quarter view).
    3. Temples narrowed (not round-bulged); a WEDGE lower jaw tucking into the neck (no round chin).
    4. Side profile clearly distinguishes the near-flat front from the curved back skull.
    5. Overall LOWER and WIDER than V0.2/V0.3 — not vertically elongated.
    6. Faceless porcelain only: no eyes/nose/mouth/anatomy; no fox/kitsune/samurai/anime/gaming-mask; no seams/vents/panels/decorative detail; not a box or mechanical helmet.
  - Locked: violet ONLY in the two slits. Palette LOCK void `#050508` / porcelain `#f2eeea` / violet `#8F00FF`. No second body form. No V0.4 (web prototype) geometry reuse. Helmet geometry is new — record BODY_HASH_AFTER, new helmet-mesh hash, and confirm every preserved-region hash is unchanged. Do NOT overwrite the base blend.
  - Render permission GRANTED (Blender, local). Required panels: front · STRICT side · three-quarter · helmet close-up · silhouette comparison against V0.3. Inspect the actual PNG before any PASS claim.
  - SUCCESS TEST (Codex self-checks before PASS; Lane B re-checks): with slits, material, and lighting conceptually OFF, the silhouette still reads as Mikage (face-plane + crown break + wedge jaw), not a mannequin/egg.
  - Allowed outputs (candidate only):
    - new `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4.blend`
    - `production/character/reviews/MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4_PROOF.md`
  - FAIL = HELMET SCOPE DRIFT: if anything other than the helmet mesh changes → stop, `PASS_FAIL = FAIL`, `BLOCKER = HELMET_SCOPE_DRIFT`, list what drifted.
  - FALLBACK if the free-built result STILL reads oval/egg: STOP free building. Report `PASS_FAIL = FAIL`, `BLOCKER = NEEDS_LOCKED_2D_PROFILE_GUIDE`, and recommend the operator lock a 2D front+side profile guide for the helmet, to be extruded to 3D. No further polish on the V0.3 form is permitted.
  - Clean-repo gate required before run (`git stash push -u` if dirty). NO lookdev. No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.

- Twenty-first controlled exception is open:
  - `MIKAGE_HELMET_PROPORTION_REFINE_V0_5 = OPEN`
  - V0.4 helmet blocking direction is APPROVED, but proportion + faceted hardness are not yet hero-grade. This task refines the helmet's SCALE and softens its hard chamfers so it reads as sculpted porcelain, NOT a low-poly robot — still a helmet-ONLY geometry pass. NO subdivision/smooth-final, NO lookdev/material. SSOT + 2D master win on conflict.
  - SOURCE OF TRUTH = `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f6817cbc4f7d6a861b8e9f111f78096ca173f5bf5c5966a378069c0e06429`) + locked helmet target `production/character/build_log/MIKAGE_HELMET_BLOCKING_SPEC_V0_1.md`. Codex MUST read both.
  - Only allowed next task: `MIKAGE_HELMET_PROPORTION_REFINE_V0_5`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_HELMET_PROPORTION_REFINE_V0_5.md`.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4.blend`. Report BASE_SELECTED + BODY_HASH_BEFORE.
  - PROHIBITED inputs: any RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 geometry; no scene import.
  - PRESERVE byte-identical (verify hash + transform): robe, neck, halo, blade, camera scale, and all body geometry. Only the helmet mesh may change. The helmet's lower jaw must still SEAT into the existing graphene-neck opening after rescale (adapt the helmet base; do NOT move the neck). If impossible without touching the neck, STOP and report.
  - REFINE the helmet ONLY:
    1. Increase the helmet scale ~15% relative to the shoulders and cloak (more visual weight).
    2. Widen the UPPER helmet slightly, but keep the LOWER jaw narrow.
    3. Soften the flat top into a shallow CROWN ARC; do NOT return to an egg.
    4. Reduce the harsh TEMPLE and JAW chamfers so the silhouette reads as sculpted porcelain, not a low-poly robot.
    5. Keep the front face-plane broad and nearly flat, but reduce the box-like width.
    6. Make the two slit recesses THINNER and SHALLOWER; no mechanical frames or gaming-style sockets.
    7. Keep faceless porcelain: no eyes/nose/mouth, no fox/kitsune/samurai/anime/gaming-mask, no seams/vents/panels/decorative detail, not a box or mechanical helmet. Keep exactly two slits.
  - Locked: violet ONLY in the two slits. Palette LOCK void `#050508` / porcelain `#f2eeea` / violet `#8F00FF`. No second body form. No V0.4 (web prototype) geometry reuse. Helmet geometry changes — record BODY_HASH_AFTER, helmet-mesh hash before/after, confirm every preserved-region hash unchanged. Do NOT overwrite the base blend.
  - Render permission GRANTED (Blender, local). Required panels: front · STRICT side · three-quarter · NO-SLIT silhouette. Produce this sheet BEFORE any subdivision or lookdev. Inspect the actual PNG before any PASS claim.
  - SUCCESS TEST: head carries enough visual weight; silhouette still distinct with slits off; reads as shaped porcelain (one controlled mass), not many flat planes bolted together; not a low-poly robot.
  - Allowed outputs (candidate only):
    - new `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_PROPORTION_REFINE_V0_5.blend`
    - `production/character/reviews/MIKAGE_HELMET_PROPORTION_REFINE_V0_5_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_HELMET_PROPORTION_REFINE_V0_5_PROOF.md`
  - FAIL = HELMET SCOPE DRIFT: if anything other than the helmet mesh changes → stop, `PASS_FAIL = FAIL`, `BLOCKER = HELMET_SCOPE_DRIFT`, list what drifted.
  - FALLBACK if it still reads boxy/mechanical after rescale: lock V0.4-direction as base and fix the three zones SEPARATELY in order crown → temple → jaw. No lookdev/material/lighting may be used to hide the silhouette before those three zones pass.
  - Clean-repo gate required before run (`git stash push -u` if dirty). NO subdivision-final, NO lookdev. No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.

- Twenty-second controlled exception is open:
  - `MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6 = OPEN`
  - V0.5 helmet proportion/silhouette is APPROVED (BLOCKING APPROVED — no further scale or head/body proportion change). This task = one CONTROLLED SUBDIVISION geometry pass that smooths the blocking facets WITHOUT changing the V0.5 silhouette or restoring an egg. Still helmet-ONLY geometry. NO material/lookdev/kintsugi/hair/cinematic lighting. SSOT + 2D master win on conflict.
  - SOURCE OF TRUTH = `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f6817cbc4f7d6a861b8e9f111f78096ca173f5bf5c5966a378069c0e06429`) + locked helmet target `production/character/build_log/MIKAGE_HELMET_BLOCKING_SPEC_V0_1.md`. Codex MUST read both.
  - Only allowed next task: `MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_HELMET_CONTROLLED_SUBDIV_V0_6.md`.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_PROPORTION_REFINE_V0_5.blend`. Report BASE_SELECTED + BODY_HASH_BEFORE.
  - PROHIBITED inputs: any RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 geometry; no scene import.
  - PRESERVE byte-identical (verify hash + transform): robe, neck, halo, blade, camera scale, and all body geometry. Only the helmet mesh may change. The helmet's lower jaw must still SEAT into the existing graphene-neck opening (do NOT move the neck). If impossible without touching the neck, STOP and report.
  - CONTROLLED SUBDIVISION — helmet ONLY:
    1. Preserve the V0.5 proportions and silhouette exactly; smooth the polygon facets so the surface reads as shaped porcelain rather than low-poly.
    2. Retain the broad near-flat front FACE-PLANE, the shallow CROWN ARC, the temple transition, and the narrowed WEDGE jaw. Add SUPPORT GEOMETRY (support loops) where needed so subdivision does NOT round the form back into an egg and does NOT inflate the jaw.
    3. The CROWN must become ONE shallow continuous arc — NO central bump, NO multi-lobed / hair-like silhouette, NO three-lobe read.
    4. Keep exactly two THIN, SHALLOW, FRAMELESS recessed slits.
    5. Faceless porcelain only: no eyes/nose/mouth/anatomy, no fox/kitsune/samurai/anime/gaming-mask, no seams/vents/panels/decorative detail, not a box or mechanical helmet.
  - Locked: violet ONLY in the two slits. Palette LOCK void `#050508` / porcelain `#f2eeea` / violet `#8F00FF`. No second body form. No V0.4 (web prototype) geometry reuse. Helmet geometry changes (subdiv) — record BODY_HASH_AFTER, helmet-mesh hash + final vert/face count, confirm every preserved-region hash unchanged. Do NOT overwrite the base blend. NO material assignment change, NO lighting change.
  - Render permission GRANTED (Blender, local). Required panels: front · STRICT side · three-quarter · NO-SLIT silhouette · WIREFRAME · before/after (V0.5 vs V0.6) comparison. Inspect the actual PNG before any PASS claim.
  - SUCCESS TEST: surface reads smoother/porcelain; crown is one continuous shallow arc (no bump/lobes); temple not broken; jaw still crisp enough; not a low-poly robot AND not a re-rounded egg; V0.5 identity preserved.
  - Allowed outputs (candidate only):
    - new `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6.blend`
    - `production/character/reviews/MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6_PROOF.md`
  - FAIL = HELMET SCOPE DRIFT: if anything other than the helmet mesh changes → stop, `PASS_FAIL = FAIL`, `BLOCKER = HELMET_SCOPE_DRIFT`, list what drifted.
  - FALLBACK if subdivision rounds the form or loses the face-plane: revert to V0.5; ADD more support loops at crown / temple / jaw; do NOT use material or lighting to hide the issue. Report `PASS_FAIL = FAIL`, `BLOCKER = SUBDIV_ROUNDED_FORM`.
  - Clean-repo gate required before run (`git stash push -u` if dirty). NO lookdev/material/lighting. No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.

- Twenty-third controlled exception is open:
  - `MIKAGE_HELMET_SURFACE_CONTROL_V0_7 = OPEN`
  - V0.6 kept the V0.5 proportions but SIMPLE subdivision left a stepped crown, broken temple transitions, and a forward visor-like projection of the upper face-plane (visible from elevated/low three-quarter). This task = one final SURFACE-CONTROL geometry pass using controlled Catmull–Clark + support loops to clean those defects WITHOUT changing proportions or silhouette. Still helmet-ONLY geometry. NO material/lookdev/lighting. SSOT + 2D master win on conflict.
  - SOURCE OF TRUTH = `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f6817cbc4f7d6a861b8e9f111f78096ca173f5bf5c5966a378069c0e06429`) + locked helmet target `production/character/build_log/MIKAGE_HELMET_BLOCKING_SPEC_V0_1.md`. Codex MUST read both.
  - Only allowed next task: `MIKAGE_HELMET_SURFACE_CONTROL_V0_7`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_HELMET_SURFACE_CONTROL_V0_7.md`.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6.blend`. Report BASE_SELECTED + BODY_HASH_BEFORE.
  - PROHIBITED inputs: any RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 geometry; no scene import.
  - PRESERVE LOCKED (do NOT change): helmet scale, jaw width, slit placement, overall silhouette + proportions, and byte-identical robe/neck/halo/blade/camera/all body geometry. Only the helmet SURFACE may change; the jaw must still seat into the existing neck (do NOT move the neck). If impossible without touching the neck, STOP and report.
  - SURFACE-CONTROL pass — helmet ONLY:
    1. Replace the visibly stepped crown contour with ONE clean shallow continuous arc.
    2. Smooth the crown-to-temple transition WITHOUT rounding the helmet into an egg.
    3. Reduce the forward visor-like projection of the upper face-plane, especially from elevated and low three-quarter angles.
    4. Keep the face-plane broad and near-flat, but blend its perimeter into the shell with controlled support loops.
    5. Preserve the narrowed wedge jaw.
    6. Keep exactly two thin recessed slits; REMOVE any continuous brow-band / visor reading around them.
    7. Use controlled Catmull–Clark + support geometry where needed — NOT SIMPLE subdivision alone.
    8. NO material lookdev.
  - Locked: violet ONLY in the two slits. Palette LOCK void `#050508` / porcelain `#f2eeea` / violet `#8F00FF`. No second body form. No V0.4 (web prototype) geometry reuse. Helmet geometry changes — record BODY_HASH_AFTER, helmet-mesh hash + final vert/face count, confirm every preserved-region hash unchanged. Do NOT overwrite the base blend.
  - Render permission GRANTED (Blender, local). Required panels: front · strict side · standard three-quarter · ELEVATED three-quarter · LOW three-quarter · WIREFRAME close-up · silhouette comparison vs V0.6. Inspect the actual PNG before any PASS claim.
  - SUCCESS TEST: crown is one clean continuous arc; NO forward visor projection from high or low angles; reads as a sealed porcelain shell from elevated AND low three-quarter; face-plane still clear; not a robot, not an egg, no low-poly stepping; V0.6 proportions preserved.
  - Allowed outputs (candidate only):
    - new `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_SURFACE_CONTROL_V0_7.blend`
    - `production/character/reviews/MIKAGE_HELMET_SURFACE_CONTROL_V0_7_CONTACT_SHEET.png`
    - `production/character/reviews/MIKAGE_HELMET_SURFACE_CONTROL_V0_7_PROOF.md`
  - FAIL = HELMET SCOPE DRIFT: if anything other than the helmet surface changes (proportion, scale, silhouette, or any non-helmet region) → stop, `PASS_FAIL = FAIL`, `BLOCKER = HELMET_SCOPE_DRIFT`, list what drifted.
  - FALLBACK if Catmull–Clark rounds the form: revert to V0.6; add ONLY local support loops at crown / temple / face-plane perimeter; do NOT apply uncontrolled full subdivision; do NOT use material/lighting to hide it. Report `PASS_FAIL = FAIL`, `BLOCKER = CC_ROUNDED_FORM`.
  - Clean-repo gate required before run (`git stash push -u` if dirty). NO lookdev/material/lighting. No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.

- Twenty-fourth controlled exception is open:
  - `MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8 = OPEN`
  - V0.7 geometry is operator-APPROVED and now GEOMETRY-LOCKED. This is the first LOOKDEV pass: MATERIAL + LIGHTING only, NO geometry change (one narrow exception in the fallback below). Goal: turn the clean blocking into a premium porcelain hero render per `MIKAGE_HERO_LOOKDEV_RECIPE_V1`. SSOT + 2D master win on conflict.
  - SOURCE OF TRUTH = `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f6817cbc4f7d6a861b8e9f111f78096ca173f5bf5c5966a378069c0e06429`); references `production/character/MIKAGE_HERO_LOOKDEV_RECIPE_V1.md`, `docs/mikage_character_visual_spec.md`, `design_system/mikage-cine-color-contract.md`. Codex MUST read the master + recipe.
  - Only allowed next task: `MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_HERO_LOOKDEV_PREMIUM_V0_8.md`.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_SURFACE_CONTROL_V0_7.blend`. Report BASE_SELECTED + BODY_HASH_BEFORE.
  - PROHIBITED inputs: any RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 geometry; no scene import.
  - GEOMETRY LOCKED: do NOT change proportions, silhouette, face-plane, crown, temple, jaw, slit placement, or any mesh. Confirm BODY_HASH is UNCHANGED at output (lookdev must not alter geometry). Only the narrow fallback below may touch perimeter normals/support.
  - STAGE A — NEUTRAL CLAY VALIDATION (do this FIRST): render the locked figure in matte off-white clay, low specular, NO halo (hide the halo), one large soft studio light, neutral. Confirm the face-plane perimeter does NOT read as a separate mechanical faceplate / seam. Deliver this clay proof.
  - STAGE B — FINAL PORCELAIN LOOKDEV (only after clay reads clean): 
    - Helmet/shell = semi-matte glazed porcelain (base `#f2eeea`), subtle micro-surface only — NOT glossy plastic, NOT flat.
    - Body/underlayer = deep matte graphite / void mass; blade = cold metal; halo = white, restrained, not brighter than the helmet.
    - Exactly two thin violet recessed slits; violet `#8F00FF` intensity RESTRAINED; violet ONLY at the slits.
    - No mechanical frames, no extra seams or panel lines, no decorative detail.
    - Environment = void-black `#050508`; single directional key light (Rembrandt upper-left, angled down); soft controlled rim to separate the silhouette; fill near zero (~2/3 sinks into void); fine grain. NO cyberpunk/neon lighting, no colored wash.
  - Render permission GRANTED (Blender, local; Cycles preferred for glazed-porcelain SSS/coat; Eevee only if it matches the recipe). Inspect actual PNGs before any PASS claim.
  - SUCCESS TEST: reads as premium semi-matte porcelain (not plastic); V0.7 silhouette preserved; face-plane continuous with the shell (no faceplate seam); two restrained violet slits are the only signal; void-black, single-key cine read; not robot, not cyberpunk.
  - Allowed outputs (candidate only):
    - new `production/character/production_actor/rig_derivatives/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8.blend`
    - `production/character/reviews/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_CLAY_VALIDATION.png` (Stage A neutral clay proof)
    - `production/character/reviews/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_CONTACT_SHEET.png` (Stage B premium lookdev: front · 3/4 · side · helmet close)
    - `production/character/reviews/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_PROOF.md`
  - FAIL = GEOMETRY DRIFT: if BODY_HASH changes outside the narrow perimeter fallback, or silhouette/proportion changes → stop, `PASS_FAIL = FAIL`, `BLOCKER = GEOMETRY_CHANGED_IN_LOOKDEV`.
  - NARROW FALLBACK: if the Stage-A clay proof still shows a seam-like line where the face-plane meets the shell, you MAY adjust ONLY the perimeter normals / local support at that seam — no silhouette, proportion, scale, or slit change. Record exactly what changed and the new BODY_HASH.
  - Clean-repo gate required before run (`git stash push -u` if dirty). No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.

- Twenty-fifth controlled exception is open:
  - `MIKAGE_HELMET_CROWN_LIGHTROT_DIAG_V0_7 = OPEN`
  - Diagnostic only: rotate one neutral area light around the crown and render four three-quarter angles to decide whether the horizontal highlight bands on the crown are lighting reflections (geometry clean) or residual surface waviness (geometry). NO geometry change, NO lookdev.
  - Only allowed next task: `MIKAGE_HELMET_CROWN_LIGHTROT_DIAG_V0_7`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_HELMET_CROWN_LIGHTROT_DIAG_V0_7.md`.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_SURFACE_CONTROL_V0_7.blend` (the geometry base, NOT the V0.8 lookdev). Report BASE_SELECTED + BODY_HASH_BEFORE + BODY_HASH_AFTER (must be identical).
  - PROHIBITED inputs: any RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 / V0.8 geometry; no scene import.
  - Method: set the helmet to a neutral matte clay for the test, hide the halo, keep the camera fixed on ONE three-quarter angle that shows the crown bands, and rotate ONE neutral area light in ~15-20 degree steps (four azimuths). Light only; do not move the camera or any mesh. Render the four frames into one contact sheet, each labeled with its light angle.
  - GEOMETRY LOCKED: no geometry edit, no subdivision-level increase, no support-loop change in this task (any fix is a separate `MIKAGE_HELMET_CROWN_SUPPORT_FIX_V0_7_1`). Confirm BODY_HASH unchanged.
  - Verdict rule (write it in the proof): bands TRACK the light across the four frames = surface clean = PASS, V0.7 confirmed as the geometry base; bands STAY FIXED on the same mesh location = LOCAL_FIX_NEEDED, recommend `MIKAGE_HELMET_CROWN_SUPPORT_FIX_V0_7_1` (local crown support / vertex flow only; no subdivision raise; no jaw / slit / dimension / silhouette change).
  - Render permission GRANTED (Blender, local). Inspect the actual PNG before stating a verdict.
  - Allowed outputs (candidate only): `production/character/reviews/MIKAGE_HELMET_CROWN_LIGHTROT_DIAG_V0_7_CONTACT_SHEET.png` + `..._PROOF.md`; the gate folder `_tmp/mikage_helmet_crown_lightrot_diag_v0_7_gate/` must hold ONLY `contact_sheet.png` + `contact_sheet_review_report.md`.
  - Clean-repo gate required before run (`git stash push -u` if dirty). No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.

- Twenty-sixth controlled exception is open:
  - `MIKAGE_BODY_FORM_DEBLOCKOUT_V0_9 = OPEN`
  - Helmet is FROZEN at V0.7 geometry + V0.8 lookdev. This task refines the BODY ONLY: de-blockout the smooth proxy-cone torso/robe into a tall vertical cloak. Helmet, the two slits, the Zenith Blade, the camera, and ALL materials/lighting stay hash-identical to V0.8. SSOT + 2D master win on conflict.
  - SOURCE OF TRUTH = `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f6817cbc4f7d6a861b8e9f111f78096ca173f5bf5c5966a378069c0e06429`); reference `docs/mikage_character_visual_spec.md`. Codex MUST read the master.
  - Only allowed next task: `MIKAGE_BODY_FORM_DEBLOCKOUT_V0_9`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_BODY_FORM_DEBLOCKOUT_V0_9.md`.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8.blend`. Report BASE_SELECTED + BODY_HASH_BEFORE + HELMET_HASH_BEFORE + BLADE_HASH_BEFORE.
  - PROHIBITED inputs: any RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 geometry; no scene import.
  - LOCKED (must stay hash-identical): helmet geometry, the two slits (count + placement), the Zenith Blade, camera/framing, world, and every material/lighting node from V0.8. Only the body mesh (torso, shoulders, neck-of-robe, cloak/skirt) may change. Do NOT move the helmet neck join / jaw seat.
  - BODY DE-BLOCKOUT (one area group — the cloak silhouette): turn the proxy cone into a tall vertical cloak with shoulder mass, a natural neck-to-shoulder transition, and a straight vertical fall (no trumpet flare); establish PRIMARY folds only (no micro-fold detail this round); female-coded non-sexual, sacred vertical flow; keep overall height/proportion within the current blockout envelope; add NO hair, props, armor, or decorative panels this round.
  - Render permission GRANTED (Blender, local; keep the V0.8 materials/lighting). Inspect the actual PNG before any PASS claim.
  - SUCCESS TEST: body reads as a tall vertical cloak (shoulder mass + straight fall), no smooth proxy cone, no trumpet; natural neck-to-shoulder; helmet/slit/blade/camera/material identical to V0.8; not a robot; no out-of-scope detail.
  - Allowed outputs (candidate only): new `MIKAGE_BODY_FORM_DEBLOCKOUT_V0_9.blend` + `..._CONTACT_SHEET.png` (front · 3/4 · strict side · compare vs V0.8) + `..._PROOF.md` in production/character/reviews; the gate folder `_tmp/mikage_body_form_deblockout_v0_9_gate/` holds ONLY `contact_sheet.png` + `contact_sheet_review_report.md`.
  - FAIL = BODY_SCOPE_DRIFT: if the helmet, slits, blade, camera, or any material changes → stop, `PASS_FAIL = FAIL`, `BLOCKER = BODY_SCOPE_DRIFT`, list what drifted; revert, do NOT patch on the drifted file.
  - FALLBACK if de-blockout breaks the head-neck seat: revert; refine from the shoulders down only; do not touch the neck join.
  - Clean-repo gate required before run (`git stash push -u` if dirty). No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.

- Twenty-seventh controlled exception is open:
  - `MIKAGE_BODY_CLOAK_STRUCTURE_V0_10 = OPEN`
  - V0.9 is the technical base (FORM HOLD): its tall vertical silhouette and straight hem are correct, but the body reads like a smooth latex bell (shoulder dome, flat front, V0.8 primary folds erased, slab-thin side). This task adds CLOAK STRUCTURE (heavy-fabric read) to the BODY ONLY while keeping the V0.9 silhouette. NO material edit. Helmet, slits, blade, camera, lighting, materials stay hash-identical to V0.9.
  - SOURCE OF TRUTH = `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f6817cbc4f7d6a861b8e9f111f78096ca173f5bf5c5966a378069c0e06429`); reference `docs/mikage_character_visual_spec.md`.
  - Only allowed next task: `MIKAGE_BODY_CLOAK_STRUCTURE_V0_10`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_BODY_CLOAK_STRUCTURE_V0_10.md`.
  - Allowed base input (ONLY this; do NOT go back to V0.8): `production/character/production_actor/rig_derivatives/MIKAGE_BODY_FORM_DEBLOCKOUT_V0_9.blend`. Report BASE_SELECTED + BODY_HASH_BEFORE + HELMET_HASH_BEFORE + BLADE_HASH_BEFORE.
  - PROHIBITED inputs: any RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 / V0.8 geometry; no scene import.
  - LOCKED (hash-identical to V0.9): helmet geometry, the two slits, the Zenith Blade, camera/framing, world, and every material/lighting node. Only the body mesh may change. No material edit in this geometry task. Do NOT move the helmet neck join / jaw seat.
  - CLOAK STRUCTURE (body only, the six operator points): (1) reduce the shoulder dome slightly so shoulders read as mass not a balloon; (2) add 3-5 large vertical primary folds, slightly asymmetric (not mirrored, not evenly spaced); (3) folds start below the shoulder line, not all converging at the neck; (4) keep the two outer edges nearly vertical, no trumpet return; (5) slightly increase front-to-back depth so the strict-side reads as a wrapping cloak, not a flat slab; (6) keep a heavy stable hem, no small waves, no micro-folds.
  - Render permission GRANTED (Blender, local; keep the V0.9 materials/lighting). Inspect the actual PNG before any PASS claim.
  - SUCCESS TEST: reads as a heavy-fabric cloak (3-5 asymmetric folds read clearly, shoulders are mass not a dome, strict side has front-back depth), the V0.9 tall vertical silhouette + straight heavy hem preserved, no trumpet, no small hem waves, no latex-shell; helmet/slit/blade/camera/material identical to V0.9.
  - Allowed outputs (candidate only): new `MIKAGE_BODY_CLOAK_STRUCTURE_V0_10.blend` + `..._CONTACT_SHEET.png` (front · 3/4 · strict side · compare vs V0.9) + `..._PROOF.md` in production/character/reviews; the gate folder `_tmp/mikage_body_cloak_structure_v0_10_gate/` holds ONLY `contact_sheet.png` + `contact_sheet_review_report.md`.
  - FAIL = CLOAK_STRUCTURE_DRIFT: if V0.10 shows many micro-folds, a flared hem, or any helmet/blade/camera/material drift → stop, `PASS_FAIL = FAIL`, `BLOCKER = CLOAK_STRUCTURE_DRIFT`, list what drifted; revert to V0.9 (NOT V0.8), do not patch on the drifted file.
  - Clean-repo gate required before run (`git stash push -u` if dirty). No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.

- Twenty-eighth controlled exception is open:
  - `MIKAGE_BODY_LOOKDEV_MATTE_V0_11 = OPEN`
  - Body GEOMETRY is FROZEN at V0.10 (operator PASS). The remaining "latex/gloss" read is a MATERIAL problem. This task is a BODY LOOKDEV / MATERIAL TUNE ONLY: push the cloak toward deep matte graphite / heavy cloth and kill the specular. NO geometry edit. Helmet material, blade material, the two slits, camera, and lighting stay unchanged.
  - SOURCE OF TRUTH = `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f6817cbc4f7d6a861b8e9f111f78096ca173f5bf5c5966a378069c0e06429`); references `production/character/MIKAGE_HERO_LOOKDEV_RECIPE_V1.md`, `design_system/mikage-cine-color-contract.md`.
  - Only allowed next task: `MIKAGE_BODY_LOOKDEV_MATTE_V0_11`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_BODY_LOOKDEV_MATTE_V0_11.md`.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_BODY_CLOAK_STRUCTURE_V0_10.blend`. Report BASE_SELECTED + BODY_HASH_BEFORE + BODY_HASH_AFTER (must be identical - no geometry edit).
  - PROHIBITED inputs: any RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 / V0.8 / V0.9 geometry; no scene import.
  - LOCKED: ALL geometry (BODY_HASH unchanged), the helmet material, the blade material, the two slits, camera/framing, world, and the lighting setup. Only the body/cloak material may change.
  - MATERIAL TUNE (body only): raise roughness / reduce specular so the cloak reads as deep matte graphite heavy cloth (not latex, rubber, plastic, glossy, or wet); base = deep matte graphite within palette; keep the V0.10 fold rhythm readable via soft shading (no faked normal/bump fold map); no patterns, decals, metallic sheen, or logos.
  - Render permission GRANTED (Blender, local; keep the V0.10 lighting). Inspect the actual PNG before any PASS claim.
  - SUCCESS TEST: cloak reads deep matte heavy cloth with restrained specular (no latex/rubber); V0.10 silhouette + folds + heavy straight hem still read; helmet/blade/slit material, camera, and lighting identical to V0.10; palette locked; violet only at the two slits.
  - Allowed outputs (candidate only): new `MIKAGE_BODY_LOOKDEV_MATTE_V0_11.blend` + `..._CONTACT_SHEET.png` (front · 3/4 · strict side · compare vs V0.10) + `..._PROOF.md` in production/character/reviews; the gate folder `_tmp/mikage_body_lookdev_matte_v0_11_gate/` holds ONLY `contact_sheet.png` + `contact_sheet_review_report.md`.
  - FAIL = BODY_MATERIAL_DRIFT: if the specular stays harsh, the cloak reads plastic/rubber, or any geometry / helmet / blade / camera / lighting changes → stop, `PASS_FAIL = FAIL`, `BLOCKER = BODY_MATERIAL_DRIFT`, list what drifted; revert to V0.10 (NOT V0.9).
  - Clean-repo gate required before run (`git stash push -u` if dirty). No canon-lock. No asset-lock. No public-render-ready claim. No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.

- Twenty-ninth controlled exception is open:
  - `MIKAGE_STANDING_CHARACTER_CANDIDATE_V0_12 = OPEN`
  - Head (V0.7 geometry + V0.8 porcelain) and body (V0.10 geometry + V0.11 matte) are locked. This task ASSEMBLES and RENDERS a full-body STANDING hero as the final standing character CANDIDATE. NO geometry edit, NO material edit. Only camera framing and hero lighting change for presentation. CANDIDATE only - no canon/asset lock.
  - SOURCE OF TRUTH = `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f6817cbc4f7d6a861b8e9f111f78096ca173f5bf5c5966a378069c0e06429`); references `production/character/MIKAGE_HERO_LOOKDEV_RECIPE_V1.md`, `design_system/mikage-cine-color-contract.md`.
  - Only allowed next task: `MIKAGE_STANDING_CHARACTER_CANDIDATE_V0_12`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_STANDING_CHARACTER_CANDIDATE_V0_12.md`.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_BODY_LOOKDEV_MATTE_V0_11.blend`. Report BASE_SELECTED + BODY_HASH_BEFORE + BODY_HASH_AFTER (must be identical - no geometry edit).
  - PROHIBITED inputs: any RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 / older-version geometry; no scene import.
  - LOCKED: ALL geometry (BODY_HASH unchanged) and ALL materials (helmet porcelain, body matte graphite, blade, slits, halo). Only camera framing and lighting may change.
  - PRESENTATION (allowed): frame the camera full-body standing (whole figure from top of helmet to hem, headroom + void above/below) - deliver a hero three-quarter, a clean front, a strict side; tune hero lighting per recipe (single Rembrandt key upper-left angled down, soft rim to separate silhouette from void, fill near zero, fine grain); high-quality render (Cycles preferred for porcelain SSS/coat, Eevee if it matches the recipe). No neon/warm/color wash; keep single-key void mood.
  - SUCCESS TEST: the full-body standing figure reads coherently - glossy porcelain head, matte graphite cloak, cold blade, two violet slits, white halo, on void, single-key cine; tall vertical silhouette; not a robot, not cyberpunk; no out-of-scope detail; geometry + materials identical to V0.11.
  - Allowed outputs (candidate only): new `MIKAGE_STANDING_CHARACTER_CANDIDATE_V0_12.blend` + `..._CONTACT_SHEET.png` (hero 3/4 · front · strict side, FULL BODY) + `..._HERO.png` (single hero 3/4 full-body money-shot) + `..._PROOF.md` in production/character/reviews; the gate folder `_tmp/mikage_standing_character_candidate_v0_12_gate/` holds ONLY `contact_sheet.png` + `contact_sheet_review_report.md`.
  - FAIL = STANDING_CANDIDATE_DRIFT: if any geometry or material changes (hash drift), or an out-of-scope detail / neon / warm color is added, or the single-key void mood is lost → stop, `PASS_FAIL = FAIL`, `BLOCKER = STANDING_CANDIDATE_DRIFT`, list what drifted; revert to V0.11.
  - Clean-repo gate required before run (`git stash push -u` if dirty). No canon-lock. No asset-lock. No public-render-ready claim (label CANDIDATE / NOT CANON-LOCKED). No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.

- Thirtieth controlled exception is open:
  - `MIKAGE_STANDING_HERO_POLISH_V0_13 = OPEN`
  - V0.12 standing candidate PASS. Hero polish for the three operator flags (blade reads detached, dark body merges into void, key is flat). CAMERA + LIGHTING ONLY. NO geometry edit, NO material edit, NO object transform change (the blade is handled by camera angle, not by moving it). CANDIDATE only.
  - SOURCE OF TRUTH = `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f6817cbc4f7d6a861b8e9f111f78096ca173f5bf5c5966a378069c0e06429`); references `production/character/MIKAGE_HERO_LOOKDEV_RECIPE_V1.md`, `design_system/mikage-cine-color-contract.md`.
  - Only allowed next task: `MIKAGE_STANDING_HERO_POLISH_V0_13`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_STANDING_HERO_POLISH_V0_13.md`.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_STANDING_CHARACTER_CANDIDATE_V0_12.blend`. Report BASE_SELECTED + BODY_HASH_BEFORE + BODY_HASH_AFTER (must be identical).
  - PROHIBITED inputs: any older-version / RIDER / HERO-MOUNT / STEED / FIGURE_V0.4 geometry; no scene import.
  - LOCKED: ALL mesh geometry (BODY_HASH / mesh-state unchanged), ALL materials, and ALL object transforms (do NOT move or rotate any object, including the blade). Only camera and lighting may change.
  - POLISH (allowed): add a soft cold rim light (within palette) to separate the dark graphite body from the void (a rim edge, not a flood fill); push the Rembrandt key more directional/dramatic with a deeper shadow side, keeping single-key void mood (no neon/warm/color wash); frame the 3/4 hero camera so the blade reads as belonging to the figure (beside/behind the shoulder) using camera angle and distance only; fine grain; full-body framing.
  - SUCCESS TEST: dark body separated from void by a cold rim; key reads dramatic and directional with depth; blade reads integrated via composition; still faceless porcelain head, graphite cloak, two violet slits, white halo, on void, single-key; geometry + materials + transforms identical to V0.12.
  - Allowed outputs (candidate only): new `MIKAGE_STANDING_HERO_POLISH_V0_13.blend` + `..._HERO.png` (polished full-body 3/4 money-shot) + `..._CONTACT_SHEET.png` (hero · front · compare vs V0.12) + `..._PROOF.md` in production/character/reviews; the gate folder `_tmp/mikage_standing_hero_polish_v0_13_gate/` holds ONLY `contact_sheet.png` + `contact_sheet_review_report.md`.
  - FAIL = HERO_POLISH_DRIFT: if any geometry, material, or transform changes (hash drift), or neon/warm/color wash is added, or the single-key void mood is lost → stop, `PASS_FAIL = FAIL`, `BLOCKER = HERO_POLISH_DRIFT`, list what drifted; revert to V0.12. If the blade cannot read integrated by camera alone, report it (do NOT move the mesh).
  - Clean-repo gate required before run (`git stash push -u` if dirty). No canon-lock. No asset-lock. No public-render-ready claim (label CANDIDATE / NOT CANON-LOCKED). No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.

- Thirty-first controlled exception is open:
  - `MIKAGE_STANDING_HERO_POLISH_V0_14 = OPEN`
  - V0.13 hero polish = technical PASS but operator ruling = NOT LOCKED. Three remaining flags: (1) the two slits read MAGENTA/pink, NOT violet #8F00FF (canon FAIL — flag #1); (2) the Zenith Blade reads as a detached panel near the void; (3) the cloak reads flat and barely separated from the void. One polish round, scope LOCKED HARD: CAMERA + LIGHTING, plus ONE narrow material exception = hue/emission of the TWO SLITS ONLY. NO geometry edit, NO object-transform change (blade NOT moved), NO other material change. CANDIDATE only.
  - SOURCE OF TRUTH = `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f6817cbc4f7d6a861b8e9f111f78096ca173f5bf5c5966a378069c0e06429`); references `production/character/MIKAGE_HERO_LOOKDEV_RECIPE_V1.md`, `design_system/mikage-cine-color-contract.md`. Violet LOCK = electric violet `#8F00FF`; magenta/pink = FAIL.
  - Only allowed next task: `MIKAGE_STANDING_HERO_POLISH_V0_14`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_STANDING_HERO_POLISH_V0_14.md`.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_13.blend` (V0.13, to keep its camera/lighting gains and only add the three fixes). Report BASE_SELECTED + BODY_HASH_BEFORE + BODY_HASH_AFTER (must be identical).
  - PROHIBITED inputs: any older-version / V0.12 / RIDER / HERO-MOUNT / STEED / FIGURE_V0.4 geometry; no scene import.
  - LOCKED: ALL mesh geometry (BODY_HASH / mesh-state unchanged vs V0.13); ALL object transforms (do NOT move / rotate / scale any object, including the blade); ALL materials EXCEPT the two-slit emission (helmet, body, blade, halo materials unchanged). Halo not made brighter.
  - NARROW MATERIAL EXCEPTION (the only material change permitted): set the two-slit emission to exactly `#8F00FF` (linearize correctly), and reduce bloom/glare on the slits if bloom skews the hue toward pink. Only hue + emission strength of the two slits; no other node, no other material. Violet stays in the two slits only.
  - POLISH (allowed, lighting + camera): add a very thin cold edge rim along one side of the blade so it reads as an object (rim light, not material, not glow), and nudge the camera (angle + distance only) so the blade touches / clearly intersects the body silhouette — blade stays near-black, no glow, no violet on it; add a very faint cold rim/bounce to reveal the shoulder, body edge, and cloak hem (read the mass, do NOT add fake folds or edit the mesh; stays monolithic); keep fine grain, full-body framing, single-key void mood.
  - SLIT-HUE VERIFY (mandatory, pixel-sample not node value): after render, sample the two-slit pixels on the hero + contact sheet PNGs, report the mean hex/RGB; PASS only if it reads violet (not red-dominant magenta) and near #8F00FF within reasonable tolerance.
  - SUCCESS TEST: slits read true violet (confirmed by pixel sample); blade reads as a weapon belonging to Mikage (rim + camera); cloak separated from void yet monolithic; no drift from V0.13 (geometry + transforms + all materials except slit-hue identical, by hash); still faceless porcelain head, graphite cloak, two violet slits, white halo, on void, single-key.
  - Allowed outputs (candidate only): new `MIKAGE_STANDING_HERO_POLISH_V0_14.blend` + `..._HERO.png` + `..._CONTACT_SHEET.png` (hero · front · compare vs V0.13) + `..._PROOF.md` (with SLIT_HUE_PIXEL_SAMPLE) in production/character/reviews; the gate folder `_tmp/mikage_standing_hero_polish_v0_14_gate/` holds ONLY `contact_sheet.png` + `contact_sheet_review_report.md`.
  - FAIL: any geometry / transform / non-slit-material change (hash drift) → `PASS_FAIL = FAIL`, `BLOCKER = HERO_POLISH_DRIFT`, revert to V0.13. Slits still magenta after fix → `BLOCKER = SLIT_HUE_FAIL`. If the blade STILL reads as a panel after rim + camera → STOP and report `BLOCKER = BLADE_READS_PANEL`; do NOT move the mesh — the operator will open a separate composition round (V0.15) with blade-transform rights.
  - Clean-repo gate required before run (`git stash push -u` if dirty). No canon-lock. No asset-lock. No public-render-ready claim (label CANDIDATE / NOT CANON-LOCKED). No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.
  - RESULT 2026-07-02: V0.14 = PASS, operator APPROVED + ASSET-LOCKED as the official standing hero (commit 64cd46f; lock record `production/character/reviews/MIKAGE_STANDING_HERO_POLISH_V0_14_ASSET_LOCK.md`). This exception is now CLOSED / delivered.

- Thirty-second controlled exception is open:
  - `MIKAGE_STANDING_HERO_MOTION_V0_1 = OPEN`
  - The standing hero V0.14 is ASSET-LOCKED. This task = awakening / motion pass: turn the locked hero into ONE vertical Spotify Canvas clip. GEOMETRY LOCKED. Only camera + lighting + the violet slit pulse (emission STRENGTH keyframe) may change. The motion is a NEW derivative — the locked V0.14 blend/PNG are NOT modified. CANDIDATE only.
  - SOURCE OF TRUTH = `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f6817cbc4f7d6a861b8e9f111f78096ca173f5bf5c5966a378069c0e06429`); locked hero `production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_14.blend` (sha256 `c0d8a9785c794683004561ceffa59f378f629ec83b2a498c1f42e20b9394239a`). Violet LOCK `#8F00FF`, two slits only.
  - Only allowed next task: `MIKAGE_STANDING_HERO_MOTION_V0_1`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_STANDING_HERO_MOTION_V0_1.md`.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_14.blend`. Do NOT overwrite it. Report BASE_SELECTED + BODY_HASH_BEFORE + BODY_HASH_AFTER (must be identical).
  - CANVAS SPEC (mandatory): 1080 × 1920 · H.264 / yuv420p · 30 fps · NO audio · ~6–8 s; breathing zoom 100 → 104 → 100 % cosine; smooth loop (first frame ≈ last).
  - LOCKED: ALL mesh geometry (BODY_HASH unchanged vs V0.14); ALL object transforms (no move/rotate/scale, including the blade); ALL material HUE + structure (helmet, body, blade, halo, two slits) — slits keep `#8F00FF`. The locked V0.14 asset files are untouched.
  - ALLOWED (camera + lighting + pulse): camera breathing zoom + reframe to 9:16 (angle/distance/zoom only, mesh not moved, full body kept in frame); animate ONLY the two-slit emission STRENGTH as a dormant→awakened→dormant pulse (hue locked `#8F00FF`, brightness only); optional restrained halo resonance + slow cold key drift + faint cold blade-rim shimmer, all within palette, void black, single-key, fine grain.
  - HARD BANS (Canvas; violation = FAIL): no text/lyrics/logo/watermark; no human face or skin (faceless porcelain helmet is OK); no warm colors; no anime; no fake UI/HUD; violet only in the two slits (no violet on blade/body/background, no neon fill or full-screen wash); minimal slow motion beyond the breathing pulse.
  - VERIFY (mandatory): reopen motion blend clean; BODY_HASH + transform hashes unchanged vs V0.14; material hue unchanged (only slit-strength keyframed); ffprobe confirms 1080x1920 / 30fps / yuv420p / no audio / 6–8 s; pixel-sample the slit at the awakened frame (violet near #8F00FF, not magenta — SLIT_HUE_PIXEL_SAMPLE); keyframe strip (dormant/mid/awakened).
  - Allowed outputs (candidate only): new `MIKAGE_STANDING_HERO_MOTION_V0_1.blend` (rig_derivatives) + `..._V0_1.mp4` + `..._V0_1_KEYFRAMES.png` + `..._V0_1_PROOF.md` in production/character/reviews; the gate folder `_tmp/mikage_standing_hero_motion_v0_1_gate/` holds ONLY `contact_sheet.png` (= keyframes strip) + `contact_sheet_review_report.md` (mp4 must NOT be in the gate folder — verify_output forbids it).
  - FAIL: geometry/transform/material-hue drift → `BLOCKER = MOTION_DRIFT`; slit changed color or magenta → `BLOCKER = SLIT_HUE_FAIL`; wrong Canvas spec → `BLOCKER = CANVAS_SPEC_FAIL`; hard-ban violation → `BLOCKER = CANVAS_BAN_VIOLATION`. In all cases stop; the locked V0.14 asset stays untouched.
  - Clean-repo gate required before run (`git stash push -u` if dirty). No canon-lock. No asset-lock. No public-render-ready claim (label CANDIDATE / NOT CANON-LOCKED). No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.
  - RESULT 2026-07-02: V0.1 = PASS technical (spec 1080x1920/30fps/yuv420p/6.03s/no-audio, no drift, slit violet #9718F8) but operator ruling = NOT approved — dormant→awakened contrast too weak. Re-curve pass V0.2 opened below. This exception CLOSED / delivered.

- Thirty-third controlled exception is open:
  - `MIKAGE_STANDING_HERO_MOTION_V0_2 = OPEN`
  - Motion V0.1 came back PASS technical but was NOT approved (the dormant→awakened pulse reads too flat; dormant is still bright; risk that platform compression flattens the three states further). This task = re-curve the two-slit emission STRENGTH animation ONLY. Do NOT touch model, camera framing, breathing zoom, duration, codec, or spec. CANDIDATE only.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_MOTION_V0_1.blend` (keeps V0.1 camera framing + breathing zoom + spec; only the pulse curve changes). Do NOT overwrite it. Report BASE_SELECTED + BODY_HASH_BEFORE/AFTER (identical).
  - LOCKED: ALL geometry (BODY_HASH unchanged); ALL object transforms (incl. blade); ALL material hue + structure (slits stay `#8F00FF`); camera framing + breathing zoom + duration + codec + fps identical to V0.1 (1080x1920 · H.264 yuv420p · 30fps · no audio · ~6.03s); the awakened peak brightness stays at the CURRENT level (no bloom increase); the locked V0.14 asset is untouched.
  - BASELINE (Codex-confirmed): V0.1 dormant = 0.05 = 5% of peak; the goal is a DARKER dormant, so the target must be BELOW 5% (the earlier "10–15%" was a mistaken figure set before the baseline was known).
  - ALLOWED (only the two-slit emission STRENGTH curve, hue locked): DORMANT ≈ near-off, ~2% of awakened (range 0–3%, MUST be below V0.1's 5%; keep a faint violet ember so the loop stays alive); MID ~30–40%; AWAKENED = current peak (unchanged); ignition (dormant→awakened) happens fast around 60–75% of the clip (~3.6–4.5s), not spread evenly; keep a smooth loop (first frame ≈ last — mostly dormant, an ignition spike ~65%, brief awakened, quick decay back to dormant); breathing zoom stays as-is.
  - SUCCESS: dormant reads clearly "off/asleep"; the awakening punches even on a small phone screen / after social compression; awakened has more force via CONTRAST, not extra brightness or bloom; not neon / not a gaming pulse; hue stays #8F00FF, not magenta; spec + camera + geometry + transform identical to V0.1.
  - VERIFY (mandatory): reopen clean; BODY_HASH + transform unchanged vs V0.1; material hue unchanged (only slit-strength keyframe differs); ffprobe 1080x1920/30fps/yuv420p/no-audio/~6.03s; report the emission level of each state as a % of peak (dormant ~2% and below V0.1's 5%, mid ~30–40%, awakened 100%); pixel-sample the awakened slit (violet near #8F00FF, not magenta); keyframe strip dormant/mid/awakened.
  - Allowed outputs (candidate only): new `MIKAGE_STANDING_HERO_MOTION_V0_2.blend` + `..._V0_2.mp4` + `..._V0_2_KEYFRAMES.png` + `..._V0_2_PROOF.md` in production/character/reviews; gate folder `_tmp/mikage_standing_hero_motion_v0_2_gate/` holds ONLY `contact_sheet.png` (= keyframe strip) + `contact_sheet_review_report.md` (no mp4 in the gate folder).
  - FAIL: geometry/transform/material-hue/camera/spec drift → `BLOCKER = MOTION_DRIFT`; slit color change / magenta → `BLOCKER = SLIT_HUE_FAIL`; raising bloom or peak to fake contrast → `BLOCKER = BLOOM_CHEAT`. If V0.2 still lacks separation, do NOT raise the awakened level further — the next round (V0.3) instead kills dormant fully for the first 1–1.5s, then a very short ignition, then holds awakened to the end (noted for later; not this task).
  - Clean-repo gate required before run (`git stash push -u` if dirty). No canon-lock. No asset-lock. No public-render-ready claim (label CANDIDATE / NOT CANON-LOCKED). No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.
  - RESULT 2026-07-02: V0.2 = PASS; operator APPROVED as the official standing-hero Spotify Canvas (supersedes V0.1; approval record `production/character/reviews/MIKAGE_STANDING_HERO_MOTION_V0_2_APPROVAL.md`). This exception is now CLOSED / delivered.

- Thirty-fourth controlled exception is open:
  - `MIKAGE_STANDING_HERO_TURNAROUND_V0_1 = OPEN`
  - Standing hero V0.14 = ASSET-LOCKED official still; Canvas motion V0.2 = APPROVED; build-log video = HOLD by operator ruling 2026-07-02. This task = a 360-degree TURNAROUND REFERENCE SHEET orbiting the LOCKED V0.14 asset. CAMERA rig + a neutral cold light rig inside a NEW derivative ONLY. CANDIDATE only.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_14.blend`. Do NOT overwrite it. Report BASE_SELECTED + BODY_HASH_BEFORE/AFTER (identical).
  - LOCKED: ALL geometry (BODY_HASH unchanged); ALL object transforms (incl. blade + halo); ALL material hue + structure (slits stay `#8F00FF`, static, no emission animation); void background `#050508`; violet only in the two slits; the locked V0.14 blend + renders untouched.
  - ALLOWED: 8 azimuth cameras at exact 45° steps (000 front / 045 / 090 right / 135 / 180 back / 225 / 270 left / 315), same lens (85–135mm equiv) / height / distance / full-body framing for all 8; one neutral COLD even light rig (key+fill+rim) in the derivative only so the form reads at every angle including the back (no warm, halo not brighter than helmet); render 8 identical-size portrait views (≥900×1600) + assemble a 4×2 sheet with small angle labels (internal review artifact only).
  - SUCCESS: 8 consistent views (silhouette height varies ≤2%); form readable at every angle; slit pixel sample on view 000 = violet near #8F00FF, not magenta; V0.14 hashes unchanged.
  - Mesh issues discovered at NEW angles (all prior reviews were 3/4-front): do NOT fix — render all 8 views anyway and FLAG them in the proof for the operator to rule on.
  - Allowed outputs (candidate only): `MIKAGE_STANDING_HERO_TURNAROUND_V0_1.blend` (rig_derivatives) + `..._V0_1_SHEET.png` + `..._V0_1_PROOF.md` (reviews) + 8 individual view PNGs in `production/character/reference/turnaround_v0_1/`; gate folder `_tmp/mikage_standing_hero_turnaround_v0_1_gate/` holds ONLY `contact_sheet.png` + `contact_sheet_review_report.md`.
  - FAIL: any geometry/transform/material change → `BLOCKER = TURNAROUND_DRIFT`; magenta slits or violet outside the slits → `BLOCKER = SLIT_HUE_FAIL`.
  - Clean-repo gate required before run (`git stash push -u` if dirty). No canon-lock. No asset-lock. No public-render-ready claim (label CANDIDATE / NOT CANON-LOCKED). No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.

- Thirty-fifth controlled exception is open:
  - `MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1 = OPEN`
  - V0.8 direct-PNG inspection confirmed the two slits render magenta/pink, not the locked `#8F00FF`; V0.8's own proof separately self-reported FAIL due to a gate-schema mismatch (active_task.yaml did not whitelist contact_sheet.png / contact_sheet_review_report.md). This task = a SLIT-HUE MATERIAL FIX ONLY, plus a corrected gate schema, on a NEW derivative from V0.8. The V0.8 blend and its renders stay untouched.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8.blend`. Do NOT overwrite it. Report BASE_SELECTED + BODY_HASH_BEFORE/AFTER (identical).
  - LOCKED: ALL geometry (BODY_HASH unchanged); ALL object transforms; camera; light rig; every material except the two slit emission colors; void background `#050508`; violet only in the two slits.
  - ALLOWED: adjust ONLY the two slit materials' emission color so the ACTUAL RENDERED PIXEL reads violet near `#8F00FF` (not just the shader node value); a narrow bloom/exposure trim scoped to the slit region only, if needed to stop a washed-out read, with no change to overall scene exposure.
  - SUCCESS: SLIT_HUE_PIXEL_SAMPLE on the front view and the helmet close-up view reads violet near `#8F00FF`, not magenta; VIOLET_OUTSIDE_TWO_SLITS = NO; all non-slit hashes unchanged vs V0.8; gate folder holds exactly `contact_sheet.png` + `contact_sheet_review_report.md` and `python .mikage\tools\verify_output.py` prints PASS.
  - Allowed outputs (candidate only): `MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1.blend` (rig_derivatives) + `..._V0_8_1_CONTACT_SHEET.png` + `..._V0_8_1_PROOF.md` (reviews); gate folder `_tmp/mikage_hero_lookdev_premium_v0_8_1_gate/` holds ONLY `contact_sheet.png` + `contact_sheet_review_report.md`.
  - FAIL: slits still read magenta or violet spills outside the slits -> `BLOCKER = SLIT_HUE_FAIL`; any geometry/camera/light-rig/non-slit-material change -> `BLOCKER = LOOKDEV_FIX_DRIFT`; gate still mis-schema'd -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - Clean-repo gate required before run (`git stash push -u` if dirty). No canon-lock. No asset-lock. No public-render-ready claim (label CANDIDATE / NOT CANON-LOCKED). No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.
raising global exposure, not clipping the helmet, and not shifting slit hue.
  - SUCCESS TEST: figure fill 75-85% (target 80%) on all 8 views with no cropping; 180/225/270 read as legible form, not flat black silhouette; 000/045/315 do not clip the helmet; SLIT_HUE_PIXEL_SAMPLE on view 000 stays violet near #8F00FF; all geometry/transform/material hashes unchanged vs V0.1; NEW_ANGLE_MESH_FLAG = NONE (mesh issues, if any, are FLAGGED not fixed).
  - Allowed outputs (candidate only): new `MIKAGE_STANDING_HERO_TURNAROUND_V0_2.blend` (rig_derivatives) + `..._V0_2_SHEET.png` + `..._V0_2_PROOF.md` (reviews, with before/after figure-fill %) + 8 individual view PNGs in `production/character/reference/turnaround_v0_2/`; gate folder `_tmp/mikage_standing_hero_turnaround_v0_2_gate/` holds ONLY `contact_sheet.png` + `contact_sheet_review_report.md`.
  - FAIL: any geometry/transform/camera-angle/material change → `BLOCKER = TURNAROUND_DRIFT`, revert to V0.1. Magenta slits or violet outside the slits → `BLOCKER = SLIT_HUE_FAIL`. Figure fill or 180/225/270 legibility still fails after this pass → `BLOCKER = FRAMING_LIGHT_FAIL`; stay `HOLD_FOR_FIX`; do NOT expand scope into model/material rework; no new geometry round.
  - Clean-repo gate required before run (`git stash push -u` if dirty). No canon-lock. No asset-lock. No public-render-ready claim (label CANDIDATE / NOT CANON-LOCKED). No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator.
  - On SSOT conflict or scope drift: stop and report.
  - RESULT 2026-07-02: V0.2 = PASS (TECHNICAL_STATUS = REPORTED_PASS, independently checked by Lane B: proof hashes self-consistent before/after, gate exactly 2 files, no .blend1, `python .mikage/tools/verify_output.py` = PASS, figure fill 78.81-81.25% all views, slit sample #8C09F9 near #8F00FF). Operator ruling 2026-07-02: **VISUAL_REFERENCE_GATE = PASS, TURNAROUND_REFERENCE_APPROVED = YES.** No V0.3 opened — figure fill and back/225/270 legibility both landed in range; further iteration judged low value. `MIKAGE_STANDING_HERO_TURNAROUND_V0_2` is APPROVED as the official multi-angle turnaround reference (NOT canon-locked, NOT asset-locked — reference status only). Commit local `c02c5fc` (not independently verified from sandbox — git worktree path not reachable there — taken on operator's report), NOT pushed. If a real downstream need arises later (e.g. brighter detail pass, helmet/blade close-up, orthographic technical sheet), open a separate supplement task (e.g. `MIKAGE_STANDING_HERO_DETAIL_SHEET_V0_1` / `TURNAROUND_SUPPLEMENT_V0_1`) rather than reopening V0.2. This exception is now CLOSED / delivered.

- Thirty-sixth controlled exception is open:
  - `MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1 = OPEN`
  - Stage A ("Integration") of `MIKAGE_LANE_A_ROADMAP.html` (operator-supplied roadmap, 2026-07-03). Two separate lineages exist and have never been unified: `MIKAGE_STANDING_HERO_POLISH_V0_14` (ASSET-LOCKED geometry/pose/proportions, the official standing hero) and `MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1` (ACTIVE_PREMIUM_LOOKDEV_REFERENCE, approved material set with the corrected slit hue). This task transplants the APPROVED V0.8.1 materials onto the LOCKED V0.14 geometry, producing one unified production derivative. Geometry unchanged; material recipe applied as-approved, not re-tuned.
  - Allowed base inputs (ONLY these two): `production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_14.blend` (geometry source, locked) and `production/character/production_actor/rig_derivatives/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1.blend` (material source, apply as-is). Do NOT overwrite either. Report BASE_SELECTED (both) + BODY_HASH_BEFORE/AFTER for V0.14 (must be identical).
  - LOCKED: ALL geometry, transforms, pose, camera, blade position, and halo geometry (from V0.14, BODY_HASH unchanged); the V0.8.1 material recipe itself (apply node-for-node, do not re-tune).
  - ALLOWED: apply the approved V0.8.1 materials (porcelain shell, graphite underlayer, blade material, two slit emission materials) onto the corresponding V0.14 geometry slots. If a V0.8.1 material has no compatible slot on V0.14 (topology/naming mismatch), keep V0.14's existing material for that part and FLAG it in the proof — do not invent a new material.
  - HALO REQUIREMENT: per `docs/handoff/HALO_RING_RULING_2026-07-03.md` (halo ring = canon, 4th identity mark, WHITE only, never violet, at any state) — the integrated output's halo MUST render white. If either source file's halo is not white, FLAG it in the proof; do not silently correct or silently accept it.
  - SUCCESS: SLIT_HUE_PIXEL_SAMPLE on the front view and helmet close-up reads violet near `#8F00FF` (target blue-dominant `#9D0CEB`/`#9203E9` per the V0.8.1 approval), not magenta; VIOLET_OUTSIDE_TWO_SLITS = NO; HALO_COLOR_CHECK = white on both views; blade renders intact/attached; BODY_HASH + all transforms/pose/camera/blade-position/halo-geometry unchanged vs V0.14; gate folder holds exactly `contact_sheet.png` + `contact_sheet_review_report.md` and `python .mikage\tools\verify_output.py` prints PASS.
  - Allowed outputs (candidate only): `MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend` (rig_derivatives) + `..._V0_1_CONTACT_SHEET.png` + `..._V0_1_PROOF.md` (reviews); gate folder `_tmp/mikage_production_rig_lookdev_integration_v0_1_gate/` holds ONLY `contact_sheet.png` + `contact_sheet_review_report.md`.
  - FAIL: any geometry/pose/camera/blade-position/halo-geometry drift vs V0.14 → `BLOCKER = INTEGRATION_GEOMETRY_DRIFT`; slits still magenta or violet spills outside the slits → `BLOCKER = SLIT_HUE_FAIL`; halo renders non-white → `BLOCKER = HALO_COLOR_VIOLATION`; V0.8.1 material cannot be technically transplanted onto V0.14 → `BLOCKER = MATERIAL_TRANSPLANT_INCOMPATIBLE` (report details, do not invent a substitute); gate mis-schema'd → `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - Clean-repo gate required before run (`git stash push -u` if dirty). No canon-lock. No asset-lock. No public-render-ready claim (label CANDIDATE / NOT CANON-LOCKED). No push. No deploy. Stop after proof delivery for owner review.
  - Final visual ruling belongs to the operator. This is Gate A of the Lane A Roadmap — a PASS here is the prerequisite the operator will judge before authorizing Stage B (deformation test, 8-pose contact sheet).
  - On SSOT conflict or scope drift: stop and report.
  - RESULT 2026-07-03: PASS. Lane B independently verified (gate exactly 2 files, `python .mikage/tools/verify_output.py` = PASS, no `.blend1`, proof hashes for geometry/pose/camera/blade-position/halo-geometry identical before/after, contact sheet visually inspected directly — halo white on all 4 views, slit violet clean with no bleed, blade intact). Operator also had a GPT-drafted review confirm the same visual PASS, but GPT's proposed next task ("locomotion smoke test", continuous walk+turn+blade-raise) was REJECTED by operator ruling 2026-07-03: stay on the roadmap's own Stage B (8 static poses), not a continuous clip, because discrete poses isolate exactly which body part clips — a continuous test would not. Commit local `3863e39` (per Codex report). This exception is now CLOSED / delivered.

- Thirty-seventh controlled exception is open:
  - `MIKAGE_PRODUCTION_RIG_ARMATURE_AUDIT_V0_1 = OPEN`
  - READ-ONLY AUDIT, no edits of any kind. Before dispatching Stage B (8-pose deformation test) of `MIKAGE_LANE_A_ROADMAP.html`, a discrepancy was found: `docs/reports/LANE_A_RIG_REPAIR_EXECUTION_RESULT_V0_1.md` (PASS, 2026-06-13) documents an armature (`MIKAGE_initial_armature_scaffold`) with 29 meshes bound rigid-single-bone-per-part — but that report ran on `MIKAGE_PRODUCTION_ACTOR_RIG_REPAIR_PASS_V0_1_FROM_FIRST_MOTION_TEST_V0_1.blend`, an entirely different file with entirely different mesh names (e.g. `arm_left_simple_black_column`) than the current production file `MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend` (mesh names like "master faceless helmet" per its own proof). It is unknown whether the current file inherits any armature at all. This task inspects and reports only — it does not fix, build, or pose anything.
  - Allowed input (read-only, in-memory inspection only): `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend`. Do NOT save this file under any name. Do NOT create, delete, or modify any object/mesh/armature/bone/vertex-group/material in it.
  - REQUIRED ANSWERS (all 7, with specifics — names/counts, not just yes/no): (1) does an Armature object exist, what is it named, does it match `MIKAGE_initial_armature_scaffold` or is it different/new; (2) for every deforming mesh, its Armature-modifier target and vertex-group count/names (rigid single-group vs soft multi-group); (3) if no armature exists, state `NO_ARMATURE_FOUND = TRUE` explicitly; (4) whether joint-equivalent bones exist for shoulder/elbow/hip/knee/spine; (5) confirm explicitly if binding is rigid-1-group like the old file; (6) how the blade and halo are bound (bone, or direct parent without armature); (7) no pose/render attempted in this task.
  - Allowed outputs (real deliverable): `docs/reports/MIKAGE_PRODUCTION_RIG_ARMATURE_AUDIT_V0_1.md` (full written answers to all 7 questions). No new `.blend` file is created — this is audit-only, not a build task.
  - Gate: `_tmp/mikage_production_rig_armature_audit_v0_1_gate/` holds ONLY `contact_sheet.png` (an existing image is acceptable — no new render required) + `contact_sheet_review_report.md` (summary of audit findings).
  - SUCCESS: audited blend is byte-identical before/after (`ARMATURE_AUDIT_FILE_MODIFIED = NO`); all 7 questions answered with specifics; gate holds exactly the two allowed files; `python .mikage\tools\verify_output.py` prints PASS; no `.blend1` remains.
  - FAIL: the audited blend was modified in any way → `BLOCKER = AUDIT_FILE_MODIFIED`; file cannot be opened/read → `BLOCKER = FILE_UNREADABLE` (report details); gate mis-schema'd → `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - No canon-lock. No asset-lock. No rig-upgrade work in this task (that is a separate, future exception scoped from this audit's actual findings). No push. No deploy. Stop after the audit report for Lane B review.
  - On SSOT conflict or scope drift: stop and report.
  - RESULT 2026-07-03: PASS. Audited file unmodified (SHA-256 before/after identical). KEY FINDING: `MIKAGE_initial_armature_scaffold` (23 bones) is bound only to the 29 hidden legacy blockout meshes from the older rig-repair pass — the currently VISIBLE production geometry (helmet/cloak/blade/halo, the actual asset rendered in every contact sheet to date) has zero Armature modifier, vertex group, or parent binding whatsoever. It is pure static mesh. This is a materially bigger finding than "rigid needs to become soft" — the visible asset has never been bound to the skeleton at all. Operator ruling 2026-07-03: proceed directly to a from-scratch bind task (see Thirty-eighth exception below) rather than pausing for further re-planning. This exception is now CLOSED / delivered.

- Thirty-eighth controlled exception is open:
  - `MIKAGE_PRODUCTION_RIG_BIND_V0_1 = OPEN`
  - First real bind of the visible production mesh to the existing skeleton, following the Thirty-seventh exception's finding that the visible geometry (helmet/cloak/blade/halo) has zero armature/parent binding — only 29 hidden legacy meshes are bound. This task surveys every visible mesh, classifies each as needing soft deformation (flexible body/cloak) or rigid attachment (hard accessories: helmet, blade, halo), and binds accordingly using ONLY the 23 existing bones in `MIKAGE_initial_armature_scaffold` — no new bones, no bone repositioning, no geometry or material changes.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend`. Do not overwrite it.
  - REQUIRED SURVEY (before binding): list every visible, render-enabled mesh not already covered by the Thirty-seventh exception's audit, its general shape, and which body region it corresponds to. Classify soft-deform vs rigid-attach with reasoning.
  - ALLOWED BINDING: soft-deformation meshes get an Armature modifier + vertex groups with blended weights across adjacent bones at real joint regions present in the mesh (e.g. a continuous cloak spanning pelvis/spine_01/spine_02/chest). Rigid-accessory meshes (helmet, blade, halo) get a Child-Of constraint or a single weight=1.0 group to the appropriate bone (head for helmet/halo; hand.R or root/pelvis for the blade depending on the actual geometry — report the choice and why). Halo color must stay white per `docs/handoff/HALO_RING_RULING_2026-07-03.md` — binding transform only, no material change.
  - LOCKED: bone count and positions (still exactly 23, unchanged); geometry/silhouette/proportions of every mesh; every material and color including the halo (white) and the two slit emission materials (violet). Only binding data (modifiers, vertex groups, constraints) may be added.
  - TEST SCOPE: one light test pose only (~10-15 degrees on a relevant bone) to confirm the new binding deforms without obvious tearing — this is a binding sanity check, NOT the full 8-pose Stage B deformation test (that remains a separate future exception on this task's output).
  - SUCCESS: every visible mesh surveyed and classified with reasoning; soft-deform meshes show genuine blended multi-bone weights at the real joint regions; rigid-accessory meshes move correctly with their bone; bone count/positions unchanged; geometry/silhouette/materials (halo white, slits violet) unchanged; light test pose shows no severe tearing/clipping; gate folder holds exactly `contact_sheet.png` + `contact_sheet_review_report.md`; `python .mikage\tools\verify_output.py` prints PASS.
  - Allowed outputs (candidate only): `MIKAGE_PRODUCTION_RIG_BIND_V0_1.blend` (rig_derivatives) + `..._V0_1_CONTACT_SHEET.png` + `..._V0_1_PROOF.md` (reviews); gate folder `_tmp/mikage_production_rig_bind_v0_1_gate/` holds ONLY the two allowed files.
  - FAIL: geometry/material changes needed beyond binding → `BLOCKER = BIND_SIDE_EFFECT_DRIFT`; light test pose still shows severe tearing/clipping unresolved within binding-only scope → `BLOCKER = BIND_INSUFFICIENT` (do not expand into mesh/geometry edits); halo changes color → `BLOCKER = HALO_COLOR_VIOLATION`; gate mis-schema'd → `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - No canon-lock. No asset-lock. No production-rig-ready claim. No push. No deploy. No full 8-pose Stage B test in this task. Stop after proof delivery for owner review.
  - On SSOT conflict or scope drift: stop and report.
  - RESULT 2026-07-03: STOPPED, `BLOCKER = BIND_SIDE_EFFECT_DRIFT`. The existing armature's bone positions (fitted to older blockout geometry) do not spatially match the current visible production mesh — even at neutral pose, binding caused severe helmet/cloak/blade misalignment that could not be resolved within binding-only scope (would require bone repositioning or geometry changes, both outside this exception). Codex handled correctly: deleted the failed candidate, confirmed base SHA-256 unchanged, clean repo, no commit/push, no scope expansion. This exception is now CLOSED / delivered. Operator ruling 2026-07-03: audit the actual current mesh topology (Thirty-ninth exception below) before deciding whether to reposition the old 23 bones or build a new armature.

- Thirty-ninth controlled exception is open:
  - `MIKAGE_MESH_TOPOLOGY_AUDIT_V0_1 = OPEN`
  - READ-ONLY AUDIT, no edits of any kind. Following the Thirty-eighth exception's `BIND_SIDE_EFFECT_DRIFT` stop, this task determines the actual current mesh topology and its spatial relationship to the existing armature, before any decision to reposition bones or build a new skeleton.
  - Allowed input (read-only, in-memory inspection only): `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend`. Do NOT save under any name. Do NOT create, delete, or modify anything in it.
  - REQUIRED ANSWERS (all 7, with specifics): (1) every visible mesh's name, world-space bounding box, and shape description; (2) whether the body/cloak is one continuous volume or has separate limb parts — the single most important question, since it determines whether the full 23-bone humanoid skeleton is even the right shape; (3) world-space head/tail position and bounding box for all 23 existing bones; (4) spatial offset between each functionally-corresponding bone/mesh pair; (5) a reasoned estimate (not a decision) of how many bones and roughly where they'd need to be for the current geometry; (6) blade and halo world-space position/size for future attachment planning; (7) confirm no pose/render was attempted.
  - Allowed outputs (real deliverable): `docs/reports/MIKAGE_MESH_TOPOLOGY_AUDIT_V0_1.md` (full written answers). No new `.blend` file — audit-only.
  - Gate: `_tmp/mikage_mesh_topology_audit_v0_1_gate/` holds ONLY `contact_sheet.png` (existing image acceptable, no new render required) + `contact_sheet_review_report.md`.
  - SUCCESS: audited blend byte-identical before/after; all 7 questions answered with specifics; gate holds exactly the two allowed files; `python .mikage\tools\verify_output.py` prints PASS; no `.blend1` remains.
  - FAIL: audited blend modified in any way → `BLOCKER = MESH_AUDIT_FILE_MODIFIED`; file cannot be opened/read → `BLOCKER = FILE_UNREADABLE`; gate mis-schema'd → `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - No canon-lock. No asset-lock. No bone-reposition or new-armature-build work in this task (separate future exception, scoped from these findings). No push. No deploy. Stop after the audit report for Lane B/operator review.
  - On SSOT conflict or scope drift: stop and report.
  - RESULT 2026-07-03: PASS. Audited file unmodified. KEY FINDING: 8 visible non-legacy meshes; `MASTER_MATCH_single_closed_draped_void_cloak` (body/cloak) is ONE continuous volume, no separate limb meshes — the 16 limb bones (clavicle/upper_arm/forearm/hand/thigh/shin/foot/toe, both sides) in the old 23-bone armature have no corresponding geometry at all. The existing `head` bone (~Z 1.720-2.080) sits ~2.062 units below the actual helmet bbox center (~Z 3.96-4.05) — a decisive vertical mismatch confirming the old armature does not fit current geometry. Blade slabs sit beside the body (min lateral gap ~0.098 from the cloak) with no hand-grip mesh, making root/pelvis attachment more spatially defensible than a hand bone. Reasoned estimate: ~7 axial bones (root/pelvis/spine_01/spine_02/chest/neck/head) at approximate Z 0.14/0.5-0.8/1.2/1.8/2.5-3.0/3.3-3.5/3.96 cover the current shape; this is an estimate for Lane B/operator to decide from, not a build decision made by Codex. Operator ruling 2026-07-03: build a NEW 7-bone axial armature (not 8 — no dedicated blade-control bone), with the blade rigidly attached to root/pelvis (not a hand bone, since no hand mesh exists). See Fortieth exception below. This exception is now CLOSED / delivered.

- Fortieth controlled exception is open:
  - `MIKAGE_PRODUCTION_RIG_REBUILD_V0_1 = OPEN`
  - Following the Thirty-ninth exception's topology findings, this task builds a NEW, properly-fitted armature and binds the actual visible production mesh to it — the direct resolution to the Thirty-eighth exception's `BIND_SIDE_EFFECT_DRIFT` stop.
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend` (unchanged since exception #36). Do NOT overwrite it.
  - REQUIRED BUILD: a NEW Armature object named `MIKAGE_axial_rig_v0_1` (not reusing `MIKAGE_initial_armature_scaffold`'s name), with exactly 7 bones (root, pelvis, spine_01, spine_02, chest, neck, head) positioned per the real coordinates in `docs/reports/MIKAGE_MESH_TOPOLOGY_AUDIT_V0_1.md` section 5, with `head` centered on the actual helmet bounding box (section 1/6 of that audit, not the old head-bone position). Do NOT create any of the 16 limb bones — the topology audit confirmed no corresponding mesh exists.
  - ALLOWED BINDING: `MASTER_MATCH_single_closed_draped_void_cloak` gets soft, blended multi-bone weights across the root/pelvis/spine_01/spine_02/chest/neck chain. Helmet, both sensor-slit meshes, and `MASTER_MATCH_white_halo_ring` get rigid attachment (weight=1.0 or Child-Of) to `head` (halo stays white per `docs/handoff/HALO_RING_RULING_2026-07-03.md` — transform only, no material change). The three blade slab meshes get rigid attachment to `root` or `pelvis` (choice based on real world-space position data from the audit; Codex must report which bone and why — no hand bone, since no hand mesh exists).
  - LOCKED: the old armature `MIKAGE_initial_armature_scaffold` and its 29 bound legacy meshes stay completely untouched (no reference, no deletion, no modification); geometry/silhouette/proportions of every visible mesh; every material and color including halo (white) and the two slit emission materials (violet).
  - TEST SCOPE: one light test pose only (10-15 degrees on chest or spine_02) to confirm the cloak deforms smoothly without tearing and that helmet/halo/blade move correctly with their bone — NOT the full 8-pose Stage B deformation test (that remains a separate future exception on this task's output).
  - SUCCESS: new armature has exactly 7 bones at the audited positions; old armature/legacy meshes untouched; cloak shows genuine blended multi-bone weights; helmet/slits/halo move rigidly with head and halo stays white; blade moves rigidly with root or pelvis with reasoning reported; geometry/silhouette/materials unchanged outside binding; light test pose shows no severe tearing/clipping; gate folder holds exactly `contact_sheet.png` + `contact_sheet_review_report.md`; `python .mikage\tools\verify_output.py` prints PASS; no `.blend1` remains.
  - Allowed outputs (candidate only): `MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend` (rig_derivatives) + `..._CONTACT_SHEET.png` + `..._PROOF.md` (reviews); gate folder `_tmp/mikage_production_rig_rebuild_v0_1_gate/` holds ONLY the two allowed files.
  - FAIL: geometry/material changes needed beyond binding → `BLOCKER = REBUILD_SIDE_EFFECT_DRIFT`; light test pose still shows severe tearing/clipping unresolved within binding-only scope → `BLOCKER = REBUILD_BIND_INSUFFICIENT` (do not expand into mesh/geometry edits); halo changes color → `BLOCKER = HALO_COLOR_VIOLATION`; old armature or any of the 29 legacy meshes touched → `BLOCKER = LEGACY_TOUCHED`; gate mis-schema'd → `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - No canon-lock. No asset-lock. No production-rig-ready claim (label CANDIDATE / NOT CANON-LOCKED). No push. No deploy. No full 8-pose Stage B test in this task. Stop after proof delivery for owner review.
  - On SSOT conflict or scope drift: stop and report.
  - RESULT 2026-07-03: PASS. Lane B independently verified: gate exactly 2 files, `python .mikage/tools/verify_output.py` = PASS, no `.blend1`, proof + gate report hashes self-consistent (GEOMETRY/MATERIAL/OLD-ARMATURE-PLUS-29-LEGACY hashes reported unchanged, old armature still 23 bones bound to the same 29 legacy targets). New armature `MIKAGE_axial_rig_v0_1` has exactly 7 bones (root/pelvis/spine_01/spine_02/chest/neck/head), 0 limb bones created, head center Z=3.9618101 matching the audited helmet bbox center. Cloak soft-bound (max 2 groups/vertex) across the axial chain; helmet/slits/halo rigid to head; blade rigid to root (reasoned: audit #39 found the slabs standing independently beside the cloak with no hand/grip mesh). Contact sheet visually inspected directly (neutral vs. spine_02 12° local-Y test): no tearing/clipping, halo stays white (`#C0BEBA` sample) and centered on both, slits blue-dominant violet (`#870DFF`/`#880DFF`, near locked `#8F00FF`), blade position unchanged between the two views (consistent with rigid-root attachment against a spine_02-only rotation), subtle silhouette/specular shift visible on the torso confirming the cloak did deform under test. Commit local `3c10dc8` (per Codex report, not independently git-verified — sandbox cannot reach D:). Not pushed. This exception is now CLOSED / delivered.

- Forty-first controlled exception is open:
  - `MIKAGE_STAGE_B_AXIAL_DEFORMATION_V0_1 = OPEN`
  - Roadmap Stage B (`MIKAGE_LANE_A_ROADMAP.html`) originally specifies 8 poses including arm/leg
    motion (arms raised, left step, right step) and a hand-held blade-hold pose. The rebuilt rig
    (exception #40) has exactly 7 axial bones and ZERO limb bones — physically incapable of those
    poses, since audit #39 confirmed no separate arm/leg/hand mesh exists at all. BOOS ruling
    2026-07-03: scope this Stage B pass DOWN to only the poses achievable with the axial-only rig;
    do not attempt or fake arm/leg/hand poses. The full 8-pose roadmap Stage B remains deferred to a
    future task once limb geometry/bones exist (not yet opened, not yet named).
  - Allowed base input (ONLY this): `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend` (unchanged since exception #40). Do NOT overwrite it.
  - REQUIRED POSE SET (exactly 6, all using only the 7 existing axial bones — no limb bones, no new bones): `neutral` (rest); `quarter_turn` (yaw ~45-90° on root or pelvis); `forward_bend` (pitch forward ~20-30° on chest, optionally assisted by spine_02); `side_pose` (lateral bend ~15-20° on chest or spine_02); `head_turn` (yaw ~30-45° on neck or head); `backward_lean` (pitch backward ~10-15° on chest). Do NOT attempt `arms_raised`, `left_step`, `right_step`, or a true hand-held `blade_hold` — no bone/mesh exists for these; if achieving them seems to require new bones/mesh, STOP and report rather than improvising.
  - LOCKED: the new armature `MIKAGE_axial_rig_v0_1` keeps exactly 7 bones (no additions/removals/repositioning); the old armature and its 29 legacy meshes stay untouched; all mesh geometry and materials unchanged (pose/keyframe only); halo stays white; slits stay violet near `#8F00FF` at every pose.
  - SUCCESS: all 6 poses rendered and individually reported PASS/FAIL; no severe tearing/clipping at any pose (or clearly flagged with location if present); helmet/halo/blade remain rigidly attached to their parent bone at every pose (no separation/drift); halo white and slit hue near `#8F00FF` sampled at every pose; rig bone count unchanged at 7; old armature/legacy untouched; gate folder holds exactly `contact_sheet.png` + `contact_sheet_review_report.md`; `python .mikage\tools\verify_output.py` prints PASS; no `.blend1` remains.
  - Allowed outputs (candidate only): `MIKAGE_STAGE_B_AXIAL_DEFORMATION_V0_1.blend` (rig_derivatives) + `..._CONTACT_SHEET.png` + `..._PROOF.md` (reviews); gate folder `_tmp/mikage_stage_b_axial_deformation_v0_1_gate/` holds ONLY the two allowed files.
  - FAIL: one or more poses show severe tearing/clipping unfixable within pose/weight scope → `BLOCKER = STAGE_B_DEFORMATION_FAIL` (report which pose, which region, no unilateral geometry changes); helmet/halo/blade separates or drifts from its parent bone at any pose → `BLOCKER = RIGID_ATTACH_FAIL`; halo changes color → `BLOCKER = HALO_COLOR_VIOLATION`; old armature/legacy touched or new rig's bone count changed → `BLOCKER = SCOPE_VIOLATION`; gate mis-schema'd → `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - No canon-lock. No asset-lock. No production-rig-ready claim (label CANDIDATE / NOT CANON-LOCKED). No push. No deploy. No limb-bone/mesh creation in this task. Stop after proof delivery for owner review.
  - On SSOT conflict or scope drift: stop and report.
  - RESULT 2026-07-03: PASS. Lane B independently verified: gate exactly 2 files, `python .mikage/tools/verify_output.py` = PASS, no `.blend1`, geometry/material/new-rig-rest/old-armature-plus-29-legacy hashes all reported unchanged, rig bone count unchanged (7/7, 0 new/repositioned/removed), no forbidden limb/hand poses attempted. All 6 poses (neutral, quarter_turn, forward_bend, side_pose, head_turn, backward_lean) rendered and individually PASS per Codex's report; halo achromatic/white and slit near `#8F00FF` sampled at every pose. Contact sheet visually inspected directly: 5/6 panels read clean and match the report. `side_pose` shows an unexplained compositing difference — the head/halo appears as a smaller partial inset in the top-left corner rather than the top-center full-size framing used in the other 5 panels, and the cloak reads as a more pronounced S-curve than the reported "15° lateral bend" alone would suggest. Operator reviewed this directly and ruled 2026-07-03: ACCEPT AS-IS — technical pass conditions (hashes, rigid attachment, halo/slit color) are all satisfied; the framing difference is noted for awareness but not treated as a deformation failure. No Codex follow-up requested. Commit local `411b3d7` (per Codex report, not independently git-verified — sandbox cannot reach D:). Not pushed. This exception is now CLOSED / delivered. OPEN NOTE for future work: if `side_pose` framing/S-curve recurs or worsens in a later rig pass, revisit before trusting it blindly.

- Forty-second controlled exception is open:
  - `MIKAGE_HALLWAY_ENVIRONMENT_V0_1 = OPEN`
  - Roadmap Stage E's cinematic proof shot describes Mikage standing in a dark hallway, but a full repo
    audit found NO environment/set asset has ever been built — every character render to date uses only
    a plain void-black `#050508` backdrop (the locked lookdev recipe). BOOS ruling 2026-07-03: open a
    SEPARATE task to build a simple, minimal, void-black corridor environment FIRST, before attempting
    Exit 1 (the actual cinematic proof shot). This is a NEW asset category (environment/set), distinct
    from all prior character-rig work, and must stay standalone (reusable without depending on the
    character file).
  - Allowed inputs: create new environment files under `production/environment/` (new tree, does not
    exist yet). Read-only reference (scale/compatibility check ONLY, no modification): `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend` (neutral pose).
  - REQUIRED BUILD: one new standalone environment `.blend` — a simple, dark, elongated corridor with
    perspective convergence, minimal wall/floor/ceiling geometry, tonal void-black/graphite materials
    (no porcelain-bright surfaces), one dim cold key light along the corridor axis plus optional rim/
    fill for depth legibility. HARD BAN: no violet anywhere in the environment's materials or lighting
    (violet stays reserved exclusively for the character's two sensor slits per the halo/violet canon
    ruling); no neon, no colored wash, no cyberpunk lighting, no clutter/fantasy/gaming-HUD elements.
  - REQUIRED COMPATIBILITY CHECK (static only, NOT the cinematic itself): in a separate working
    scene/file (not modifying either source), place the reference character (neutral pose) at a marked
    position in the corridor and render two static views — empty corridor, and corridor with the
    character — same camera, no animation, no push-in, to confirm scale and framing read correctly.
  - LOCKED: the character reference file is read-only in this task (report CHARACTER_FILE_MODIFIED = NO);
    the new environment set must be fully standalone (usable without the character file being present).
  - SUCCESS: environment set exists as a standalone file; no violet anywhere in its materials/lighting;
    character reference file hash unchanged; two-view compatibility contact sheet renders clean with
    plausible character scale/framing; gate folder holds exactly `contact_sheet.png` + `contact_sheet_review_report.md`; `python .mikage\tools\verify_output.py` prints PASS; no `.blend1` remains.
  - Allowed outputs (candidate only): `production/environment/sets/MIKAGE_HALLWAY_ENVIRONMENT_V0_1.blend` + `production/environment/reviews/MIKAGE_HALLWAY_ENVIRONMENT_V0_1_CONTACT_SHEET.png` + `..._PROOF.md`; gate folder `_tmp/mikage_hallway_environment_v0_1_gate/` holds ONLY the two allowed files.
  - FAIL: character reference file modified in any way → `BLOCKER = CHARACTER_FILE_MODIFIED`; violet appears anywhere in the environment's materials or lighting → `BLOCKER = VIOLET_IN_ENVIRONMENT`; the set cannot stand alone without the character file → `BLOCKER = SET_NOT_STANDALONE`; gate mis-schema'd → `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - No canon-lock. No asset-lock. No production-ready or canon-location claim (label CANDIDATE / NOT CANON-LOCKED). No animation, no camera push-in, no slit-ignite animation in this task (that is Exit 1, a separate future task). No push. No deploy. Stop after proof delivery for owner review.
  - On SSOT conflict or scope drift: stop and report.
  - RESULT 2026-07-03: PASS. Lane B independently verified: gate exactly 2 files, `python .mikage/tools/verify_output.py` = PASS, no `.blend1`. Standalone reopen confirmed 21 `ENV_`-prefixed objects, zero external libraries, zero character objects, zero animation actions — the set stands alone. Corridor `6.4×5.6×34.0` units, void-black + cool-graphite materials only, two dim cold area lights, deterministic material/light scan for violet returned empty (`VIOLET_IN_ENVIRONMENT = NO`). Character reference file hash independently recomputed by Lane B (`f5f17e2e7bc18d387bb7477d158def823604ccf829fb660b0a986ee7980ec0c5`) matches Codex's reported hash exactly, and file mtime confirms no write since exception #40 — `CHARACTER_FILE_MODIFIED = NO` confirmed, not just trusted. Contact sheet visually inspected directly: corridor reads clean, dark, cold-toned with legible perspective convergence; character (right panel) reads at a plausible scale within the inner portal, halo white, slits the only violet in frame, blade visible beside the figure. Commit local `c4ac950` (per Codex report, not independently git-verified — sandbox cannot reach D:). Not pushed. This exception is now CLOSED / delivered.

- Forty-third controlled exception is open:
  - `MIKAGE_STAGE_E_EXIT1_CINEMATIC_PROOF_V0_1 = OPEN`
  - Rig (#40), Gate B axial-only (#41), and hallway environment (#42) all PASS. This task combines all
    three into the roadmap's Stage E cinematic proof shot via EXIT 1 (BOOS-selected 2026-07-03): NO
    locomotion (no limb bones/mesh exist), only standing + sensor-slit dormant-to-ignite + a subtle
    head-tilt/weight-shift using the existing 7 axial bones + the blade already resting in frame
    (rigid on root, unchanged) + a slow camera push-in + cut to black. This is a PROOF SHOT combining
    rig/environment/sensor-anim/camera for the first time — NOT a final or marketing render.
  - Allowed base inputs (read-only reference, do NOT modify either): `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend` (neutral pose) and `production/environment/sets/MIKAGE_HALLWAY_ENVIRONMENT_V0_1.blend` (camera at `(0,-10,2.45)` 48mm confirmed in exception #42, character marker `(0,8,0)`). Combine into a NEW derivative scene only.
  - ALLOWED: slit emission STRENGTH animation only (dormant ~2% of peak → fast ignite ~60-75% of clip → hold awakened; hue stays locked `#8F00FF`, reference the curve shape from exception #33 loosely, not mandatory to match exactly); subtle rotation on `neck`/`head` and optionally `chest`/`spine_02` for a head-tilt/weight-shift (smaller magnitude than the Gate B test poses — performance, not a deformation stress test); slow camera push-in along the hallway axis from the confirmed camera position (Codex chooses a reasonable end position/duration and reports it); a simple cut-to-black fade at the end.
  - LOCKED: both source files stay byte-unchanged (report SOURCE_FILE_MODIFIED = NO for each); no new bones/mesh of any kind (still only the 7 existing axial bones, still 0 limb bones); the blade's rigid-to-root attachment is unchanged (no separate blade animation); halo stays white throughout; slit hue stays `#8F00FF` (strength only); environment stays violet-free.
  - TECHNICAL SPEC: this is a proof shot, not a locked distribution spec — Codex chooses a reasonable resolution (e.g. 1920×1080), fps, and duration (~6-10s) and reports the actual values via ffprobe; audio not required. Do NOT assume or apply the Spotify Canvas spec (1080×1920/loop) — that is a separate, unrelated spec for a different deliverable.
  - SUCCESS: both source files hash-unchanged; slit hue unchanged (`#8F00FF`) with only strength animated per a dormant→ignite→awakened curve; halo stays white at every sampled frame; no violet anywhere in the environment; no limb bones/mesh created; no walk/locomotion attempted; camera push-in and cut-to-black both present and smooth; ffprobe-confirmed technical spec reported accurately; gate folder holds exactly `contact_sheet.png` + `contact_sheet_review_report.md` (the `.mp4` itself stays OUT of the gate folder, same rule as prior MOTION tasks); `python .mikage\tools\verify_output.py` prints PASS; no `.blend1` remains.
  - Allowed outputs (candidate only): `production/environment/rig_derivatives/MIKAGE_STAGE_E_EXIT1_CINEMATIC_PROOF_V0_1.blend` + `..._V0_1.mp4` + `..._V0_1_KEYFRAMES.png` + `..._V0_1_PROOF.md` (reviews); gate folder `_tmp/mikage_stage_e_exit1_cinematic_proof_v0_1_gate/` holds ONLY the two allowed files (no mp4 in the gate folder).
  - FAIL: either source file modified → `BLOCKER = SOURCE_FILE_MODIFIED`; slit hue drifts/magenta → `BLOCKER = SLIT_HUE_FAIL`; halo changes color → `BLOCKER = HALO_COLOR_VIOLATION`; violet appears in the environment → `BLOCKER = VIOLET_IN_ENVIRONMENT`; any limb bone/mesh created or locomotion attempted → `BLOCKER = SCOPE_VIOLATION`; gate mis-schema'd (including mp4 placed in the gate folder) → `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - No canon-lock. No asset-lock. No final/marketing/production-ready claim (label CANDIDATE / PROOF SHOT). No push. No deploy. No locomotion, no new bones/mesh in this task. Stop after proof delivery for owner review.
  - On SSOT conflict or scope drift: stop and report.
  - RESULT 2026-07-03: PASS. Lane B independently verified: gate exactly 2 files, `python .mikage/tools/verify_output.py` = PASS, no `.blend1`, `ffprobe` independently run and confirmed H.264/yuv420p/1280×720/24fps/7.000s/no-audio exactly as reported. Both source-file hashes independently recomputed by Lane B — character `f5f17e2e...ec0c5` matches the value on record since exception #40; environment `cebf49ac...d4a8c` confirmed via unchanged mtime predating this task's start — `SOURCE_FILE_MODIFIED = NO` for both, confirmed not just trusted. Slit hue stayed on the locked linear input `(0.05,0,1,1)` (`#8F00FF`) with only Emission Strength keyed (dormant 2% of peak → fast ignite ~4.17-4.67s → held awakened); performance limited to small rotations on spine_02/chest/neck/head (1-4°), no new bones/mesh, no locomotion; all three blade objects unanimated, still rigid-to-root; environment violet scan empty; halo unanimated/white throughout. Lane B extracted and visually inspected the actual 5-frame keyframe sheet directly: dormant reads dim, ignite/awakened read clearly violet, final frame reads correctly near-black — matches the proof's narrative with no anomalies. Commit local `dd703a4` (per Codex report, not independently git-verified — sandbox cannot reach D:). Not pushed. This exception is now CLOSED / delivered.

- Forty-fourth controlled exception is open:
  - `MIKAGE_STAGE_E_CINEMATIC_V0_1 = OPEN`
  - Exception #43's proof shot (H.264/1280×720/24fps/7s) validated the full rig+environment+sensor-
    anim+camera choreography at low resolution, purely to test feasibility. BOOS ruling 2026-07-03: use
    that proof AS A TEMPLATE for the real cinematic — extend the SAME derivative, keep the SAME
    choreography (dormant → ignite → awakened → cut to black, same camera push, same axial performance
    magnitude), ONLY raise resolution/render quality. Stay landscape 16:9 (do NOT switch to vertical
    9:16/Canvas format). No audio in this pass (BOOS ruling: not yet needed, silent like the proof).
  - Allowed base input (extend, do NOT rebuild from scratch): `production/environment/rig_derivatives/MIKAGE_STAGE_E_EXIT1_CINEMATIC_PROOF_V0_1.blend` (exception #43's PASS derivative). Read-only reference (do not modify): the original character and environment source files.
  - ALLOWED: raise resolution to at least 1920×1080 (16:9, same aspect/framing/camera angle as the proof — upres only, no recrop); raise render quality (samples/anti-aliasing/denoise) without changing approved lighting/materials/colors; minor duration adjustment (e.g. a second or two of breathing room at start/end) IF the choreography order (dormant → ignite → awakened → cut to black) stays intact — Codex reports the actual final numbers.
  - LOCKED (unchanged from #43): both original source files stay byte-identical; slit hue stays `#8F00FF` (strength-only animation); halo stays white and unanimated; no violet anywhere in the environment; no new bones/mesh; no locomotion/walk; blade stays unanimated/rigid-to-root; aspect ratio stays 16:9 landscape; no audio track.
  - SUCCESS: ffprobe confirms resolution ≥1920×1080, 16:9 aspect, no audio; both source files hash-unchanged; slit/halo colors correct at every sampled frame; no environment violet; no new bones/mesh/locomotion; blade unanimated; choreography order preserved; gate folder holds exactly `contact_sheet.png` + `contact_sheet_review_report.md` (mp4 stays outside); `python .mikage\tools\verify_output.py` prints PASS; no `.blend1` remains.
  - Allowed outputs (candidate only): `production/environment/rig_derivatives/MIKAGE_STAGE_E_CINEMATIC_V0_1.blend` + `..._V0_1.mp4` + `..._V0_1_KEYFRAMES.png` + `..._V0_1_PROOF.md` (reviews); gate folder `_tmp/mikage_stage_e_cinematic_v0_1_gate/` holds ONLY the two allowed files.
  - FAIL: either source file modified → `BLOCKER = SOURCE_FILE_MODIFIED`; slit hue drift/magenta → `BLOCKER = SLIT_HUE_FAIL`; halo color change → `BLOCKER = HALO_COLOR_VIOLATION`; violet in environment → `BLOCKER = VIOLET_IN_ENVIRONMENT`; new bones/mesh, locomotion, or independent blade animation → `BLOCKER = SCOPE_VIOLATION`; aspect ratio switched to vertical or audio added → `BLOCKER = SPEC_DEVIATION`; gate mis-schema'd → `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - No canon-lock. No asset-lock. No final/marketing/production-ready claim (label CANDIDATE). No push. No deploy. No locomotion, no new bones/mesh, no audio in this task. Stop after proof delivery for owner review.
  - On SSOT conflict or scope drift: stop and report.
  - RESULT 2026-07-03: PASS. Lane B independently verified: gate exactly 2 files, `python .mikage/tools/verify_output.py` = PASS, no `.blend1`, `ffprobe` independently run and confirmed H.264/yuv420p/1920×1080/16:9/24fps/7.000s/no-audio exactly as reported. Template hash independently recomputed by Lane B (`40e80265...a5949`) matches Codex's reported value exactly, and both original source files (character `f5f17e2e...ec0c5`, environment `cebf49ac...d4a8c`) remain unchanged from their values on record — extension confirmed, not a rebuild. Choreography signature (slit strength/hue, camera transform, all axial-bone pose values) matched exactly between template and derivative at every sampled frame; rig still exactly 7 bones; no new bones/mesh; no locomotion; all three blades unanimated/rigid-to-root; environment violet scan empty; halo unanimated/white. Lane B visually inspected the actual 5-frame keyframe sheet directly: same choreography as #43 but visibly sharper at 1080p, no anomalies. Commit local `a7446bb` (per Codex report, not independently git-verified — sandbox cannot reach D:). Not pushed. This exception is now CLOSED / delivered.

- Forty-fifth controlled exception is open:
  - `MIKAGE_ROBE_LOCOMOTION_TEST_V0_1 = OPEN`
  - Exit 1 (#43/#44) is fully complete per the roadmap's own branch design. The only remaining roadmap
    branch is Exit 2 (Stage C locomotion). Before dispatching any limb-building task, Lane B re-checked
    the master 2D reference (`production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png`) and
    found "VOID BODY MASS / DRAPED ROBE" is one of only 5 locked Immutable Identity Marks — Mikage must
    NEVER show separate visible arms/legs; the current single-cloak mesh is deliberately faithful to
    this, not an incomplete asset. BOOS ruling 2026-07-03: locomotion must be achieved by swaying the
    SAME single continuous cloak volume (a "robe-glide"), never by building visible limb geometry. This
    task is a feasibility TEST only (not a final walk cycle), on the character alone (not yet
    recombined with the hallway environment).
  - Allowed base input (read-only reference for the character; do NOT use the environment-combined derivative): `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend`.
  - ALLOWED: add AT MOST 2 new bones, children of `root`, used ONLY as secondary cloth-sway helpers for the lower cloak hem (e.g. `hem_sway_01`/`hem_sway_02` or similarly neutral names) — these must never be named, shaped, or positioned like a leg/thigh/shin/knee/foot/arm/hand/elbow/shoulder, and must never create a gap/split at the cloak's hem that implies legs underneath; animate `root` translating forward a short distance (~1-2m) with a subtle vertical bob and a slight alternating side lean/weight-shift (implying stepping without ever showing a step), and the 2 hem-sway bones oscillating for secondary cloth motion.
  - LOCKED: the cloak stays one closed, continuous mesh volume at every sampled frame (no gap/split implying legs); helmet/halo/two slits stay rigidly attached to `head`, unchanged; all three blade meshes stay rigidly attached to `root`, unanimated independently; halo stays white; slit hue stays `#8F00FF`; no new mesh of any kind, especially nothing limb-shaped.
  - SUCCESS: at most 2 new bones added, none limb-named/shaped/positioned; cloak remains a single closed volume at every sampled frame (`VOID_BODY_MASS_INTACT = YES`); root translates forward with a bob/lean-only "robe-glide" motion; halo white, slit hue `#8F00FF` unchanged; blade unanimated/rigid-to-root; gate folder holds exactly `contact_sheet.png` + `contact_sheet_review_report.md` (mp4 stays outside); `python .mikage\tools\verify_output.py` prints PASS; no `.blend1` remains.
  - Allowed outputs (candidate only): `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_LOCOMOTION_TEST_V0_1.blend` + `..._V0_1.mp4` + `..._V0_1_KEYFRAMES.png` + `..._V0_1_PROOF.md` (reviews); gate folder `_tmp/mikage_robe_locomotion_test_v0_1_gate/` holds ONLY the two allowed files.
  - FAIL: the cloak shows any gap/split implying legs underneath at any frame → `BLOCKER = VOID_BODY_MASS_VIOLATION`; any limb-shaped mesh or limb-named/positioned bone is created → `BLOCKER = LIMB_GEOMETRY_VIOLATION`; halo/slit color changes → `BLOCKER = HALO_COLOR_VIOLATION` / `BLOCKER = SLIT_HUE_FAIL`; blade animated independently of root → `BLOCKER = SCOPE_VIOLATION`; gate mis-schema'd → `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - No canon-lock. No asset-lock. No final walk-cycle/production-ready claim (label CANDIDATE / FEASIBILITY TEST). No push. No deploy. Stop after proof delivery for owner review. If achieving convincing locomotion seems to require showing legs, STOP and report — this is a canon decision for the operator, not something to resolve unilaterally.
  - On SSOT conflict or scope drift: stop and report.
  - RESULT 2026-07-03: PASS. Lane B independently verified: gate exactly 2 files, `python .mikage/tools/verify_output.py` = PASS, no `.blend1`, `ffprobe` independently run and confirmed H.264/yuv420p/720×1280/24fps/5.000s/no-audio exactly as reported. Source file hash independently recomputed (`f5f17e2e...ec0c5`) matches the value on record unchanged. Exactly 2 new bones added (`drape_secondary_lower`, `drape_secondary_upper`), both horizontal cloth-sway helpers parented to root, neither limb-named/shaped/positioned; mesh/object counts unchanged (101/139); cloak topology unchanged (288 vertices, 0 boundary/non-manifold edges) confirming `VOID_BODY_MASS_INTACT = YES`; halo/slit colors and blade rigid-attachment all unchanged. Lane B visually inspected the actual 5-frame keyframe sheet directly: frames 1-4 read as a clean continuous cloak with no gap/split implying legs. Frame 5 (closest approach to camera after the 1.5m advance) shows an unexplained dark wedge/triangular shape above the halo not present in the other 4 frames and not addressed in the proof — most likely a perspective/FOV artifact from the character approaching very close to a fixed camera, but not confirmed. Operator reviewed this directly and ruled 2026-07-03: ACCEPT AS-IS — technical pass conditions (topology, hashes, colors, no-limb-geometry) are all satisfied; the frame-5 artifact is noted for awareness but not treated as a failure. No Codex follow-up requested. Commit local `65b9b97` (per Codex report, not independently git-verified — sandbox cannot reach D:). Not pushed. This exception is now CLOSED / delivered. OPEN NOTE for future work: if a close-camera approach is used again (locomotion toward camera), check the halo/head region at the closest frames for this same wedge artifact before trusting it blindly.
  - RULING REVISED 2026-07-03 (BOOS, after closer review): the earlier "ACCEPT AS-IS" was premature. On closer look, the frame-120 wedge reads more like a mesh region (collar/neck-connector area) being pulled wrong than pure camera perspective distortion, and the overall motion still reads as ambiguous between "gliding" and "shrinking," not a deliberate weighted advance. REVISED STATUS: `MIKAGE_ROBE_LOCOMOTION_TEST_V0_1` stays feasibility-PASS (topology/hash/color/no-limb conditions genuinely hold) but its VISUAL state is `HOLD FOR CLEANUP` — NOT locomotion-production-ready, NOT a valid base for Stage D yet. A follow-up cleanup pass is opened as exception #46 (Forty-sixth) below to isolate the wedge's real cause and refine the motion before any Stage D promotion.

- Forty-sixth controlled exception is open:
  - `MIKAGE_ROBE_LOCOMOTION_CLEANUP_V0_2 = OPEN`
  - Exception #45's revised ruling: the frame-120 dark wedge above the halo likely reflects a real
    mesh-region problem (collar/neck-connector area pulled wrong by `drape_secondary_upper`'s influence
    reaching too high), not pure camera distortion, and the overall motion reads ambiguous between
    gliding and shrinking. This task isolates the wedge's confirmed root cause and refines the motion —
    NOT a Stage D (full walk cycle) promotion.
  - Allowed base input (extend, not rebuild): `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_LOCOMOTION_TEST_V0_1.blend` (commit baseline `65b9b97` per Codex). Preserve canon: closed draped void cloak, no visible/implied limbs.
  - REQUIRED: (1) identify the exact object/vertex region creating the dark wedge in frames 96-120 — report the CONFIRMED cause, not a guess; (2) keep helmet, halo, neck connector, and upper collar visually coherent throughout root movement (no detachment, no transform-space mismatch); (3) restrict secondary robe deformation primarily to the middle/lower cloak; (4) keep upper torso and helmet stable — motion must read as a controlled, weighted robe-glide, not scaling or floating; (5) reduce bob from 0.028m to ~0.018m; (6) reduce lean from ±1.4° to ~±0.8°; (7) preserve the same 1.5m root travel and 5-second duration; (8) do not add mesh, limbs, new bones (beyond refining the existing 2 helpers), blade animation, material changes, or environment; (9) halo stays white, both slit emissions stay `#8F00FF`.
  - IF STILL WEDGED after reducing helper influence: disable `drape_secondary_upper` entirely, keep only root motion + `drape_secondary_lower`, lock all vertices from shoulder-up out of secondary deformation, and check the parent-inverse/constraint space of halo, helmet, and the neck connector — report which remedy was needed, do not silently expand scope further.
  - LOCKED: no new mesh; no new bones beyond adjusting the existing 2 helpers; no blade animation/material changes; no environment; halo white; slit hue `#8F00FF`; cloak stays one closed mesh (0 boundary/non-manifold edges); no visible/implied limbs.
  - SUCCESS: no wedge, detached collar, or object crossing outside the halo at any frame; halo is a clean circle in every frame; helmet/upper body show no visible scale/detach/drift; cloak remains one closed mesh (0 boundary/non-manifold edges); no visible/implied legs; root travel stays 1.5m over 5s; gate folder holds exactly `contact_sheet.png` (frames 0/30/60/90/120) + `contact_sheet_review_report.md`; `python .mikage\tools\verify_output.py` prints PASS; no `.blend1` remains.
  - Allowed outputs (candidate only): `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_LOCOMOTION_CLEANUP_V0_2.blend` + `..._V0_2.mp4` (720×1280, 24fps, 5s, no audio) + `..._V0_2_KEYFRAMES.png` + `..._V0_2_PROOF.md` (reviews, must state the CONFIRMED wedge cause); gate folder `_tmp/mikage_robe_locomotion_cleanup_v0_2_gate/` holds ONLY the two allowed files.
  - FAIL: wedge cause remains unidentified/unconfirmed → `BLOCKER = WEDGE_CAUSE_UNCONFIRMED`; the fix only hides the artifact via camera cropping rather than fixing the root cause → `BLOCKER = COSMETIC_FIX_ONLY`; halo/helmet/blade/slit color or cloak topology changes → `BLOCKER = SCOPE_VIOLATION` (report exactly what changed); gate mis-schema'd → `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - No canon-lock. No asset-lock. No Stage D/production-ready claim (label CANDIDATE / CLEANUP). No push. No deploy. Stop after proof delivery for owner review.
  - On SSOT conflict or scope drift: stop and report.
  - RESULT 2026-07-04: PASS. Lane B independently verified: gate exactly 2 files (`contact_sheet.png` + `contact_sheet_review_report.md`), `python .mikage/tools/verify_output.py` = PASS, no `.blend1`, `ffprobe` independently run and confirmed H.264/yuv420p/720×1280/24fps/5.000000s/no-audio exactly as reported. Source file hash independently recomputed (`0931101a9ad0b3c00c016c7d5f9770c47c2de189263396b93504796c125f6d07`) matches the value on record unchanged. Confirmed wedge cause: `neck_matte_black_underlayer` remained bound to the legacy `FIRST_PASS_ARMATURE_BIND_MIKAGE_initial_armature_scaffold` while helmet/halo/cloak already used the axial rig `MIKAGE_axial_rig_v0_1`; root travel was also keyed on local-Y, which the root basis mapped to world-Z (vertical descent) instead of forward depth. Remedy: neck connector rigid-bound to axial bone `neck` via `MIKAGE_AXIAL_RIGID_NECK`; root travel remapped to the depth axis (camera unchanged, not a crop/hide fix); bob reduced 0.028→0.018m, lean reduced ±1.4°→±0.8°, 1.5m/5s travel preserved. No new mesh/object/bone (mesh/object counts unchanged 101/139; total bones nine = original seven plus the existing two helpers, `drape_secondary_upper` restricted to Z≤1.20m at halved weight). Cloak remains one closed mesh (288 vertices, 0 boundary/non-manifold edges), no visible/implied legs; halo white, slits `#8F00FF`, blades rigid-to-root and unanimated. Lane B visually inspected the actual 5-frame keyframe sheet directly: halo reads as a clean complete circle in every frame, no wedge/detachment/crossing, motion reads as a controlled approach rather than vertical sinking or scaling. Commit local `b405bd1` (per Codex report, not independently git-verified — sandbox cannot reach D:). Not pushed. This exception is now CLOSED / delivered.

- Forty-seventh controlled exception is open:
  - `MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1 = OPEN` (3-STATE revision, superseding the original single-derivative scope)
  - Exception #46 (robe locomotion cleanup) closed 2026-07-04. BOOS ruling 2026-07-04: the character reference sheet and hero lookdev currently read as a flat turntable-lit "sample," not a cinematic "scene." BOOS supplied a 6-layer cinematic lighting spec (lighting / violet-emission / atmosphere / material / camera / grade). REVISED 2026-07-04 (same day, via shotlist `MZ-SHOTLIST-THIRDAXIS-S2.html` for track THIRD AXIS, ISRC `QT62U2610012`, release 2026-07-09): the single-derivative BEFORE/AFTER scope is replaced by a 3-STATE ignition sequence for the THIRD AXIS S2 COMBAT REVEAL short — output 3 SEPARATE short clips (S0/S1/S2), not one continuous transitioning clip, each clearly named by state so BOOS can cut the ignition rhythm himself in a separate edit pass (cutting/captions/cover-card/placement are explicitly OUT of Lane A scope — this task is render-only).
  - Allowed base input (extend, do not rebuild): `production/character/production_actor/rig_derivatives/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1.blend` (ACTIVE_PREMIUM_LOOKDEV_REFERENCE, approved 2026-07-03). Full spec sheet: `production/character/build_log/MZ-CINEMATIC-PASS_REFERENCE_V0_1.html`. Full brief (3-state, authoritative for exact wording): `production/character/build_log/LANEA_CODEX_TASK_CINEMATIC_LIGHTING_PASS_V0_1.md`.
  - STATE MACHINE (hard, defines the 3 required deliverables): **S0 DORMANT** — slits dark/near-off (low ember, NOT full), halo MATTE white (no added emission, void-dominant framing). **S1 AWARE** — slits FULL violet emission (near-clip, strongly saturated), halo STILL MATTE white (no glow yet). **S2 COMBAT** — slits FULL violet (same intensity as S1) AND halo GLOWS white strongly (the halo's own material emission raised; this is the ONLY state and the ONLY permitted second light source in the whole system). All 3 states share the same light-rig/camera/material/grade approach from the 6-layer spec — only slit and halo emission intensity differ between states.
  - REQUIRED (shared technical base, applied identically across all 3 states unless noted): (1) replace flat/even lighting with a single angled key (~40-50°) + low fill + negative fill + a cool rim/back light separating the cloak from the void background; (2) slit emission `#8F00FF` — near-off at S0, full/near-clip at S1 and S2 (bounce onto porcelain cheeks allowed at S1/S2 only); (3) halo emission stays at passive/matte level at S0 and S1 — raised only at S2 for the glow; (4) a very low-density volumetric haze (Codex chooses engine approach, reports which/why), applied consistently across all 3 states if used; (5) porcelain helmet subtle SSS + non-uniform roughness + thin clearcoat, cloak faint sheen/fresnel — same across all 3 states; (6) camera ~85mm, shallow DOF (f/1.4-2.8) focused on the slits, slight low angle, upper-third head placement, VOID occupying at least 70% of frame — same camera framing across all 3 states so the clips cut together; (7) grade with AgX or Filmic (report which), crush blacks toward `#050508`, lift only the violet band, selective bloom on the slits (all states) and additionally on the halo (S2 only), very light CA on violet edges, fine grain, light vignette.
  - LOCKED (hard, non-negotiable, ALL 3 states): **halo stays absolute white/near-white/cool-neutral at every sampled pixel of every frame in every state — zero violet, including from bounce/GI/rim/glow/bloom.** Halo glow is REQUIRED at S2 and FORBIDDEN at S0/S1 — violating this state order is a scope violation, not just a color violation. No geometry/rig/topology change. Canon base colors unchanged (helmet `#F2EEEA`, void black cloak, slit `#8F00FF`). No violet used as key/fill or washed across the whole scene, at any state. No teal-orange or any grade direction besides cool-mono + separated violet band. No blade animation, no new mesh/bone, no environment/set added. No anime/cel-shading/speed-lines/neon-HUD styling at any state (per shotlist "official layer = cine realism"). No cutting/editing/captions/cover-card work — deliverables are the 3 raw state clips only.
  - SUCCESS: geometry/rig/topology unchanged from source (hash-confirm if possible); halo pixel-sampled at ≥4 points per frame across all 3 states shows no violet drift (numeric RGB/hex reported); state machine reads correctly — S0 dim slits + matte halo, S1 full slits + matte halo, S2 full slits + glowing white halo, clearly distinguishable and in ascending intensity order; violet elsewhere appears only at the slits + soft cheek bounce (S1/S2) + optional background bokeh; directional lighting with a working rim separates cloak from void in all 3 states; porcelain reads SSS/roughness-variation, not "plastic"; grade is cool-mono + separated violet, not teal-orange, consistent across states; void occupies ≥70% of frame in all 3 states; the 3 clips are named `_S0_DORMANT` / `_S1_AWARE` / `_S2_COMBAT` and share the same camera framing; `python .mikage/tools/verify_output.py` prints PASS; no `.blend1` remains.
  - Allowed outputs (candidate only): `production/character/production_actor/rig_derivatives/MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1.blend` (contains all 3 states) + `..._V0_1_S0_DORMANT.mp4` + `..._V0_1_S1_AWARE.mp4` + `..._V0_1_S2_COMBAT.mp4` + `..._V0_1_PROOF.md` (reviews, must report each state's numbers separately); gate folder `_tmp/mikage_cinematic_lighting_pass_v0_1_gate/` holds ONLY `contact_sheet.png` (≥3 frames, one per state, same camera angle, clearly labeled) + `contact_sheet_review_report.md`.
  - FAIL: any violet pixel detected on the halo at any sampled point/frame/state → `BLOCKER = HALO_COLOR_VIOLATION`; halo glows at S0/S1 or fails to glow at S2, or slits are not correctly dim/full per state → `BLOCKER = STATE_MACHINE_VIOLATION`; violet used as key/fill or washed across the environment at any state → `BLOCKER = VIOLET_IN_ENVIRONMENT`; geometry/rig/topology changed outside lighting/material/camera/grade → `BLOCKER = SCOPE_VIOLATION` (report exactly what changed); canon base color (helmet/cloak/slit hue) drifts → `BLOCKER = CANON_COLOR_DRIFT`; anime/cel-shading/speed-line/neon-HUD styling appears at any state → `BLOCKER = STYLE_VIOLATION`; gate mis-schema'd or missing per-state halo-sample confirmation in the report → `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - No canon-lock. No asset-lock. No production-ready/final claim (label CANDIDATE). No push. No deploy. No cutting/editing/export beyond the 3 raw state clips. Stop after proof delivery for owner review.
  - On SSOT conflict or scope drift, or if halo violet-bounce cannot be avoided through normal light-rig/material adjustment: stop and report — this is a canon boundary decision for the operator, not to be resolved unilaterally.
  - RESULT 2026-07-04: PASS. Lane B independently verified: gate exactly 2 files (`contact_sheet.png` + `contact_sheet_review_report.md`), `python .mikage/tools/verify_output.py` = PASS, no `.blend1`. `ffprobe` independently run on all 3 clips and confirmed H.264/yuv420p/720×1280/24fps/2.000000s/no-audio exactly as reported for `_S0_DORMANT`, `_S1_AWARE`, `_S2_COMBAT`. Source file hash independently recomputed (`c2c3ade3741d6c01b805fdd9f63721bfa421c51f6216cb62943269107bdc5d29`) matches the proof exactly — source unchanged. State strengths as reported: S0 slit `0.18`/halo `0.0`, S1 slit `28.0`/halo `0.0`, S2 slit `28.0`/halo `18.0` — halo emission is exactly zero at S0/S1 and only raised at S2. Lane B visually inspected the actual contact sheet directly: S0 shows a faint dim violet ember at the slits with a thin passive-white halo ring; S1 shows fully saturated violet slits with the halo still thin/passive (no glow); S2 shows the same full violet slits plus a strongly glowing white halo — state order reads correctly and is clearly ascending. Halo color check reported 4 sample points per state, all neutral/cool-white with no red-violet channel separation (e.g. S2 samples `#FAFAFA`/`#FDFDFD`/`#ACADB2`/`#FCFCFC`) — `HALO_COLOR_VIOLATION = NO`, confirmed by Lane B reading the actual numeric values, not just trusting the label. Void occupancy reported 82.85% (S0) / 82.42% (S1) / 74.26% (S2), all ≥70%. Geometry hash reported unchanged (`ca02a61f...29359a`), mesh/armature counts unchanged (101/1). No blade animation, no new mesh/bone/environment. Commit local `96cf8e3` (per Codex report, not independently git-verified — sandbox cannot reach D:). Not pushed. This exception is now CLOSED / delivered.

- Forty-eighth controlled exception is open:
  - `MIKAGE_ROBE_HERO_CINE_STAGING_V0_1 = OPEN` ("Towering Cloaked Shadow" — cine staging + lighting, extends #47)
  - Exception #47 (3-state cinematic lighting pass) closed 2026-07-04, PASS, but still reads "like a model" for lack of staging/environment and a static camera — NOT for lack of body armor. A read-only audit (same day, Cowork) confirmed no body-armor mesh exists in the current production character and that current locked canon actively forbids showing separate arms/legs ("VOID BODY MASS / DRAPED ROBE" is one of 5 Immutable Identity Marks). BOOS ruling 2026-07-04: ROUTE A — keep the draped robe as-is, do NOT add armor or reveal limbs; instead upgrade via staging + cine lighting + camera movement only.
  - Allowed base input (extend, do not rebuild): `production/character/production_actor/rig_derivatives/MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1.blend` (exception #47's PASS derivative, already has the 3-state S0/S1/S2 six-layer lighting base). Full brief: `production/character/build_log/LANEA_CODEX_TASK_ROBE_HERO_CINE_STAGING_V0_1.md`. Reference spec: `production/character/build_log/MZ-BRIEF-ROBE-HERO-CINE_REFERENCE_V0_1.html`.
  - REQUIRED: (1) add a staged environment — a soft reflective floor (roughness ~0.25-0.4) catching halo/slit/figure reflections, the existing dark slab(s) used as offset foreground/background monoliths casting long shadows, 1-2 distant planes fading into Z-Blue `#4B5866` for atmospheric depth, all while keeping void ≥70% of frame; (2) a thin low-density volumetric haze so rim/halo/god-rays read in the air; (3) refine the #47 lighting into true cine staging: angled cool key (~40-50°), a Z-Blue rim separating the cloak from the void, negative fill opposite the key; (4) make the S2-only halo glow and the slit emission behave as practical lights that actually cast onto the floor/haze/god-rays through the halo ring, not just self-emission; (5) keep the #47 material recipe (porcelain SSS/roughness-variation/clearcoat, cloak matte+sheen/fresnel); optionally very restrained matte kintsugi-gold `#C39A52` on cloak seams (raking light only) and crimson `#A24759` only at seam/core accents — optional, not required; (6) camera ~85mm, shallow DOF on the slits, low angle, and now MOVING (slow crane-up or push-in), with the closest camera point landing exactly on the S2 halo ignition; (7) minimal blocking only — gentle cloak drift, a slow head-lift across S0→S1, halo bloom+settle at S2 — no walking, no limb reveal of any kind including implied via lighting/shadow.
  - LOCKED (hard, non-negotiable, unchanged from #47 plus new): draped robe stays exactly as-is — no armor added, no arms/legs separated or implied via lighting/shadow trickery (Immutable Identity Mark). Halo stays absolute white/near-white/cool-neutral at every sampled pixel, every frame, every state AND in the new hero camera-move clip — zero violet including from bounce/GI/rim/haze/god-ray. Halo glow stays S2-only (matte at S0/S1). Void stays ≥70% of frame in every state clip and every frame of the hero clip. No warm ambient wash; no flat pure black/white; Z-Blue is the only secondary cool color besides violet. No independent blade animation, no new mesh/bone outside lighting/material/environment/camera scope.
  - SUCCESS: geometry/rig/topology unchanged from the #47 source; halo pixel-sampled at ≥4 points per frame across all 3 restaged state clips AND the hero clip shows zero violet drift (numeric RGB/hex reported); the new environment/lighting is visibly distinct from #47's flat set (reflective floor, monolith depth layers, haze catching rim/god-ray all present); the hero clip has genuine camera movement (crane-up or push-in) with the closest frame landing on S2 ignition; void ≥70% verified on every checked frame; no armor/limb geometry or lighting-implied limb shapes appear anywhere; palette stays cool + Z-Blue accent only, no warm wash; `python .mikage/tools/verify_output.py` prints PASS; no `.blend1` remains.
  - Allowed outputs (candidate only): `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1.blend` + restaged `..._S0_DORMANT.mp4` / `..._S1_AWARE.mp4` / `..._S2_COMBAT.mp4` + `..._HERO_CLIP.mp4` (camera move) + `..._S2_STILL.png` (full-res hero/thumbnail candidate) + `..._PROOF.md` (reviews, each item/state reported separately); gate folder `_tmp/mikage_robe_hero_cine_staging_v0_1_gate/` holds ONLY `contact_sheet.png` (≥3 state frames + ≥1 hero-clip-closest frame, labeled) + `contact_sheet_review_report.md` (must include a HALO COLOR CHECK section and a VOID OCCUPANCY section with real measured numbers).
  - FAIL: any violet pixel detected on the halo at any sampled point/frame/state/hero-clip → `BLOCKER = HALO_COLOR_VIOLATION`; halo glows outside S2 or fails to glow at S2 → `BLOCKER = STATE_MACHINE_VIOLATION`; any armor/limb geometry or shape implied via lighting/shadow → `BLOCKER = LIMB_GEOMETRY_VIOLATION` / `ARMOR_SCOPE_VIOLATION`; void occupancy <70% on any checked frame → `BLOCKER = VOID_RATIO_VIOLATION`; violet washed into environment/floor/haze or used as key/fill → `BLOCKER = VIOLET_IN_ENVIRONMENT`; warm ambient wash or a non-Z-Blue/violet color reads strongly → `BLOCKER = PALETTE_VIOLATION`; geometry/rig/topology changed outside lighting/material/environment/camera scope → `BLOCKER = SCOPE_VIOLATION` (report exactly what changed); camera does not move or ignition does not land on the closest point → `BLOCKER = CAMERA_STAGING_INCOMPLETE`; gate mis-schema'd or missing the HALO COLOR CHECK / VOID OCCUPANCY numeric sections → `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - No canon-lock. No asset-lock. No production-ready/final claim (label CANDIDATE). No push. No deploy. Stop after proof delivery for owner review.
  - On SSOT conflict or scope drift, or if halo/violet drift from haze/god-ray bounce cannot be avoided through normal light-rig/haze-density adjustment: stop and report exactly what was tried — this is a canon boundary decision for the operator, not to be resolved unilaterally.
  - RESULT 2026-07-04: PASS. Lane B independently verified: gate exactly 2 files (`contact_sheet.png` + `contact_sheet_review_report.md`), `python .mikage/tools/verify_output.py` = PASS, no `.blend1`. `ffprobe` independently run on all 3 restaged state clips and the hero clip, confirmed H.264/720×1280/24fps exactly as reported — states 2.000000s each, hero clip 4.000000s, all no-audio; S2 still confirmed 1440×2560. Void occupancy independently recomputed at threshold ≤24-all-channels on 5 extracted frames: S0 `88.29%`, S1 `88.22%`, S2 `80.94%`, hero start `89.19%`, hero end `81.71%` — matches Codex's reported numbers exactly to 2 decimal places. Halo pixel-sampled independently around the ring circumference on S0/S1/S2/hero frames: all lit halo pixels neutral/near-neutral (e.g. S2 in the `#FAFAFA`–`#FDFDFD` range, R≈G≈B), matte at S0/S1, glowing only at S2 — `HALO_COLOR_VIOLATION = NO`, confirmed by Lane B reading actual numeric values. Camera movement independently confirmed genuine (frame 0 vs frame 95 direct comparison — figure clearly closer/larger at the end); ignition timing independently confirmed at source frame ~80/96 (frame 70 extracted = halo matte, frame 80 extracted = halo glowing, void ratio drop from ~88% to ~80.9% matches the reported ignition point exactly). Lane B visually inspected every extracted frame plus the gate contact sheet directly: single robe mass throughout, no armor, no limb geometry or limb-implying lighting/shadow at any state or in the hero clip. Staged environment independently confirmed present (brightened/cropped floor region of an S2 frame shows the reflective floor + monolith, cool/neutral tones, no violet or warm wash). NOT independently verified (sandbox cannot reach D: git or open `.blend` in Blender): commit hash `8a407cf` and the internal mesh/rig SHA-256 diff claim in the proof — both low-risk, same known sandbox limitation as #46/#47. Not pushed. This exception is now CLOSED / delivered. Next per brief: Lane B takes the S2 still for post (bloom/crush-black/grain/vignette) and THIRD AXIS shotlist assembly — not yet started.

- Forty-ninth controlled exception is open:
  - `MIKAGE_AI_ENHANCE_S2_DIALIN_V0_1 = OPEN` (ComfyUI Flux img2img + 2xControlNet + Redux — AI-enhance render→cine-frame pass, dial-in on 1 frame only)
  - Operator uploaded a new brief (`MZ-BRIEF-AI-ENHANCE.html`, tool = ComfyUI local, Flux.1-dev img2img + Depth ControlNet + Canny/Line ControlNet + Redux) proposing a step beyond lighting/staging: use AI img2img on the Blender render itself to add real porcelain material detail, atmosphere, and "cinematic" degree that lighting/grade alone cannot produce, while ControlNet locks silhouette + the 2 slits + halo so canon cannot drift. Scope explicitly limited to Step 1 of the brief's own two-step plan: dial-in on exactly 1 frame (the exception #48 S2 still), not S0/S1, not the hero clip/video (brief itself flags img2img-per-frame will flicker on video and must not be batched onto a clip).
  - Base image (fixed, do not substitute): `production/character/reviews/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1_S2_STILL.png` (exception #48's independently-verified PASS still, 1440x2560). Depth AOV must be exported directly from `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1.blend` at the same camera/frame (not depth-estimated from the image). Canny/Line must be derived from the same S2 still. Redux reference = `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_AI_ENHANCE_S2_DIALIN_V0_1.md`. Reference spec: `production/character/build_log/MZ-BRIEF-AI-ENHANCE_REFERENCE_V0_1.html`.
  - REQUIRED: (1) build the exact node stack (Flux.1-dev img2img + Depth ControlNet + Canny/Line ControlNet + Redux); (2) run multiple seeds across 3 denoise levels 0.45/0.55/0.65 (fixed seed while comparing denoise); (3) ControlNet strengths canny 0.8-1.0 (highest priority, holds slits+halo), depth 0.5-0.7, redux weight 0.4-0.6, guidance ~3.5, steps 24-30; (4) use the exact positive/negative prompt text from the brief, not a rewritten one; (5) self-screen every candidate against the canon gate before it goes in the contact sheet — reject internally, do not hand rejects to the operator to filter; (6) pick exactly one recommended candidate that passes canon gate and reads most cinematic; (7) record the exact workflow (seed/denoise/ControlNet strengths/guidance/steps) used for the chosen candidate.
  - LOCKED (hard, non-negotiable): faceless helmet — AI must not paint in eyes/nose/mouth/face under any circumstance; exactly 2 slits, same position/shape as the base image; halo stays absolute white/neutral, zero violet tint; violet confined to the 2 slits only, no leak onto cloak/floor/background/halo; silhouette unchanged — draped robe only, no armor, no limb reveal; cinematic realism only, no anime/cel-shading; no geometry/rig/.blend change (this is a 2D image pass); no clip/video processing of any kind in this task (still-image only, per the brief's own flicker warning).
  - SUCCESS: at least one candidate clears every canon-gate line (no face, exactly 2 correctly-shaped slits, halo neutral/white with numeric samples reported, no violet leak, silhouette intact, no anime drift); gate report includes CANON GATE CHECK (per-candidate pass/fail), HALO COLOR CHECK (numeric RGB/hex, >=4 points on the chosen candidate), WORKFLOW RECORD (seed/denoise/ControlNet strengths/guidance/steps), and RECOMMENDATION sections with real data, not description alone; gate holds exactly `contact_sheet.png` + `contact_sheet_review_report.md`; `python .mikage/tools/verify_output.py` prints PASS; no `.blend` created or modified; no video/clip file produced or touched.
  - Allowed outputs (candidate only): `production/character/reviews/MIKAGE_AI_ENHANCE_S2_DIALIN_V0_1_CANDIDATE.png` + `MIKAGE_AI_ENHANCE_S2_DIALIN_V0_1_PROOF.md` (full mirror of the gate report plus a list of all rejected candidates and why); gate folder `_tmp/mikage_ai_enhance_s2_dialin_v0_1_gate/` holds ONLY `contact_sheet.png` (base S2 still + >=3 canon-gate-passing candidates, one per denoise level where available, each labeled with seed+denoise) + `contact_sheet_review_report.md`.
  - FAIL: AI paints a face/eyes/mouth onto the helmet on any candidate shown in the contact sheet -> `BLOCKER = FACE_GEOMETRY_VIOLATION`; wrong slit count or shape on the chosen candidate -> `BLOCKER = SLIT_COUNT_VIOLATION`; halo tinted violet or off-white on the chosen candidate -> `BLOCKER = HALO_COLOR_VIOLATION`; violet leaks outside the 2 slits -> `BLOCKER = VIOLET_LEAK_VIOLATION`; limb reveal, armor, or silhouette change -> `BLOCKER = SILHOUETTE_VIOLATION`; result reads anime/cel-shaded instead of cinematic realism -> `BLOCKER = STYLE_VIOLATION`; any clip/video touched or any `.blend` created/modified -> `BLOCKER = SCOPE_VIOLATION`; gate mis-schema'd or missing a required report section -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - No canon-lock. No asset-lock. No production-ready/final claim (label CANDIDATE). No push. No deploy. No clip/video work — still-image dial-in only. Step 2 (apply the locked workflow to S0/S1, and a temporal-stable solution for video) is a separate future exception, not an automatic continuation of this one.
  - On canon-gate failure across all candidates, or if the operator's brief and observed ComfyUI behavior conflict (e.g. ControlNet cannot hold the halo/slits at any usable denoise): stop and report exactly what was tried — this is an operator decision, not to be resolved by lowering the canon-gate bar or switching tools/models unapproved.
  - BLOCKED 2026-07-04 (infra, not canon): Codex found no ComfyUI runtime/process and no Flux.1-dev / Depth ControlNet / Canny ControlNet / Redux model cache on C:/D:/G:. Correctly stopped rather than self-installing or substituting tooling. No candidate generated, no output/gate created, `.blend`/S0-S1/video all untouched, validator not run. Exception stays OPEN, not closed and not failed on canon grounds, pending operator: install/point Codex at the required stack, or defer this pass and keep using the #48 raw Blender S2 still for Lane B post instead.
  - Operator installed the full model stack same day (flux1-dev-fp8, ControlNet Union-Pro, Redux, SigCLIP, text encoders) in `D:\workspace\ComfyUI\models`, independently confirmed by Cowork.
  - BLOCKED 2026-07-04 #2 (hardware/runtime, not canon): all 3 configurations Codex tried (normal VRAM fp8; low-VRAM + CPU VAE + disable smart memory; low-VRAM default weight dtype) crashed at `load_diffusion_model` with a Windows fatal access violation before the sampler. Safetensors header read fine (1,442 keys); PyTorch 2.6/CUDA 12.4 on the GTX 1660 SUPER 6GB cannot materialize the 17.2GB flux1-dev-fp8 UNET even with offload. Correctly did not switch model/tool, did not touch `.blend`/stills/video, repo stays clean, no candidate/gate created, validator not run. Exception stays OPEN, pending operator decision: (a) try a GGUF-quantized Flux.1-dev checkpoint (needs the ComfyUI-GGUF custom node) as the standard low-VRAM path, (b) another lower-memory approach, or (c) defer AI-enhance and keep using the #48 raw Blender S2 still.
  - OPERATOR AUTHORIZATION 2026-07-04 (explicit, exact-scope amendment to the LOCKED "no model/tool switch without asking" rule above): operator approved switching the base diffusion-model FILE ONLY from `flux1-dev-fp8.safetensors` to a GGUF-quantized Flux.1-dev checkpoint (e.g. `city96/FLUX.1-dev-gguf`, Q4_K_S or Q3_K_S recommended for this 6GB card — lower quant if still unstable), loaded via the ComfyUI-GGUF custom node (`UnetLoaderGGUF`). This is still the same Flux.1-dev model, same ControlNet Union-Pro, same Redux/SigCLIP, same text encoders, same prompt/canon-gate rules from the original brief — ONLY the UNET file format/precision changes for VRAM reasons. Everything else in this exception's REQUIRED/LOCKED/FAIL sections still applies unchanged. Installing the ComfyUI-GGUF custom node (`pip install gguf` + node repo into `custom_nodes/`) is authorized as part of this same amendment. Any further tool/model change beyond this specific GGUF swap still requires asking first.
  - BLOCKED 2026-07-04 #3 (performance, not canon, not crash): Q4_K_S GGUF loads fine, reaches the sampler, no crash/OOM - but measured ~363 sec/step, ~2h37m per single candidate at the brief's 1440x2560 target. Codex correctly did not escalate to Q3_K_S (only authorized on crash/OOM, neither occurred) and stopped the sampler before producing output rather than burn hours on an unapproved deviation. No candidate/gate created, `.blend`/video untouched, temp workflow cleaned up, repo clean, validator not run. Exception stays OPEN, third BLOCKED report in a row, pending operator decision: (a) accept ~2h37m/candidate and let it run long, (b) drop dial-in resolution well below 1440x2560 (e.g. native 720x1280) to explore cheaply then do one full-res run of the chosen recipe, (c) fewer steps for exploration, (d) drop AI-enhance and use the #48 raw Blender S2 still directly.
  - OPERATOR AUTHORIZATION 2026-07-04 #2 (execution-path amendment, supersedes local-ComfyUI-only default): operator approved moving exception #49's execution from local ComfyUI to the **fal.ai hosted API** (`fal-ai/flux-general/image-to-image` endpoint) given 3 consecutive local BLOCKED reports (missing models -> hardware crash -> ~2h37m/candidate impractical runtime). This is a cloud API named in this repo's standing tool restrictions, now explicitly approved for this exact task only. Full mapping/details: `production/character/build_log/LANEA_CODEX_TASK_AI_ENHANCE_S2_DIALIN_V0_1_FAL_ADDENDUM.md`. Everything from the original brief (canon gate, denoise ladder, prompt, gate/report requirements, FAIL codes) is UNCHANGED - only the execution mechanism (server-side API vs local GPU) differs. Operator creates the fal.ai account/API key himself (`FAL_KEY` env var) - nobody else handles the key value. Estimated cost ~$0.28/image at the S2 still's resolution; start with a handful of candidates, not a large batch, and report actual spend.

- Fiftieth controlled exception is open:
  - `MIKAGE_HAIR_ADD_V0_1 = OPEN` (add long/thick black hair to the production rig — closes a canon gap, not a redesign)
  - Lane B (Cowork) audit finding 2026-07-04: `docs/world/MIKAGE_LORE_WORLD_CANON_V0_6_SSOT.md` line 27 locks "tóc đen dài dày" (long, thick, dense black hair) as part of the character identity. The current production rig (through `MIKAGE_ROBE_HERO_CINE_STAGING_V0_1.blend`, exception #48's PASS derivative) has NO hair geometry at all — confirmed by direct visual inspection of the approved `MIKAGE_STANDING_HERO_TURNAROUND_V0_2` reference (front view, all 8 angles) and every render produced this session. This is a gap between locked lore and the actual asset, not a stylistic option. Operator ruling 2026-07-04: fix the rig directly (this exception), do not paper over it with prompt text in any AI-generation pass, and do not use the current hairless turnaround as an identity reference for anything until this is resolved.
  - Allowed base input (extend, do NOT rebuild from scratch): `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1.blend` (exception #48's PASS derivative, current production rig — 101 mesh objects, 1 armature `MIKAGE_axial_rig_v0_1` with 9 bones: 7 axial + `drape_secondary_upper`/`drape_secondary_lower`, S0/S1/S2 three-state lighting). Read-only reference (do not modify): `docs/world/MIKAGE_LORE_WORLD_CANON_V0_6_SSOT.md` (line 27, the hair spec) and `production/character/reference/turnaround_v0_2/MIKAGE_TURNAROUND_000.png` (for silhouette/scale context only).
  - REQUIRED SURVEY (before building, report in the proof): (1) confirm no existing hair mesh, particle system, or curve-hair object exists anywhere in the base file; (2) exact world-space bounding box and shape of the helmet mesh, to plan hair attachment points that do not intersect or hide it; (3) exact position of both sensor-slit meshes, to confirm the planned hair silhouette will not cross them at any of the 8 turnaround angles.
  - REQUIRED BUILD: add a NEW hair mesh (or grouped set of hair-mass meshes) reading as one heavy, dense, long black mass — a solid sculpted/low-poly volume in keeping with this asset's existing stylized low-poly language (NOT a fine-strand particle/groom system; NOT anime-thin bangs/twintails). Hair originates from the back and sides of the helmet only — never crossing the face plane, never touching or overlapping either sensor slit at any angle. Length: reads as "long" against the current body scale — extends at least to shoulder height, may extend further down the back/cloak line. Material: flat matte black or near-black, no specular highlights or colors that could read as a second signal color; must not introduce any violet, warm, or off-canon hue.
  - ALLOWED RIG WORK: rigid-attach the hair mass to the `head` bone (same pattern as helmet/slits/halo in exception #40), OR add up to 2 NEW dedicated hair-sway bones (parented to `head`, following the precedent set by `drape_secondary_upper`/`drape_secondary_lower` in exception #45/#46) if a small secondary-motion sway is wanted for future locomotion/turn shots. Do not add more than 2 new bones. Do not touch, reposition, or reweight any of the existing 9 bones or their current bindings.
  - LOCKED (hard, non-negotiable, unchanged from prior exceptions): helmet geometry/material; both sensor-slit meshes, shape, count, and violet emission color (`#8F00FF` family, blue-dominant, no magenta); the white Enso halo ring, its geometry, and its unanimated/white-only material at S0/S1, glow only at S2; the closed single-volume cloak (288 vertices, 0 boundary/non-manifold edges) — no limb geometry implied or revealed; the three blade slab objects and their rigid-to-root attachment; the existing 7 axial bones + 2 drape-sway bones and their current positions/weights; the S0/S1/S2 lighting state values; void `#050508`.
  - REQUIRED PROOF ARTIFACTS: a NEW 8-angle turnaround (same `000,045,090,135,180,225,270,315` azimuth convention as `MIKAGE_STANDING_HERO_TURNAROUND_V0_2`) showing the hair from every angle, with explicit callouts confirming (a) no slit coverage at any angle, (b) helmet silhouette still legible, (c) back view (180°) shows the actual length/density clearly. This turnaround supersedes `MIKAGE_STANDING_HERO_TURNAROUND_V0_2` for future reference use once it passes.
  - SUCCESS: hair mesh present, reads as one heavy dense long black mass (not fine strands, not anime); does not cross or shadow-obscure either slit at any of the 8 angles; helmet silhouette (oversized rounded head shape) still clearly legible; no more than 2 new bones added, both hair-specific and parented to `head`; every locked item above (helmet/slits/halo/cloak/blade/existing rig/lighting/void) verified unchanged by hash or direct measurement; 8-angle turnaround produced and visually clean at every angle; gate folder holds exactly `contact_sheet.png` + `contact_sheet_review_report.md`; `python .mikage/tools/verify_output.py` prints PASS; no `.blend1` remains.
  - Allowed outputs (candidate only): `production/character/production_actor/rig_derivatives/MIKAGE_HAIR_ADD_V0_1.blend` + `production/character/reference/turnaround_hair_v0_1/` (8 individual PNGs, same naming convention as `turnaround_v0_2`) + `production/character/reviews/MIKAGE_HAIR_ADD_V0_1_SHEET.png` + `..._PROOF.md`; gate folder `_tmp/mikage_hair_add_v0_1_gate/` holds ONLY `contact_sheet.png` (all 8 angles, labeled) + `contact_sheet_review_report.md`.
  - FAIL: hair crosses, shadows, or visually breaks either sensor slit at any angle -> `BLOCKER = HAIR_SLIT_COVERAGE`; hair reads as fine anime-style strands/twintails instead of one heavy mass -> `BLOCKER = HAIR_STYLE_VIOLATION`; helmet silhouette becomes unclear/hidden -> `BLOCKER = HELMET_SILHOUETTE_VIOLATION`; any locked geometry/material/rig item listed above is modified -> `BLOCKER = LOCKED_ASSET_MODIFIED`; more than 2 new bones added, or an existing bone repositioned/reweighted -> `BLOCKER = RIG_SCOPE_VIOLATION`; hair introduces a new color outside flat black/near-black -> `BLOCKER = COLOR_VIOLATION`; gate mis-schema'd -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - No canon-lock. No asset-lock. No production-ready/final claim (label CANDIDATE). No push. No deploy. Does not replace `MIKAGE_STANDING_HERO_TURNAROUND_V0_2` as the frozen approval-of-record until the operator explicitly rules on the new turnaround — Codex may state it "supersedes for reference purposes pending operator review" only. Stop after proof delivery for Lane B/operator review.
  - On SSOT conflict (e.g. hair length/density is ambiguous beyond "long, thick, dense") or scope drift: stop and report — do not guess canon, do not invent a specific hairstyle beyond what the SSOT states.

- Fifty-first controlled exception is open:
  - `MIKAGE_CINE_REVIEW_FRAME_V0_1 = OPEN` (Phase 1 of the Cine Presentation System roadmap — reusable review-chrome overlay, template only, no character/rig change)
  - Operator uploaded `MZ-ROADMAP-CINE-PRESENTATION-SYSTEM.html` (6-phase roadmap toward studio-grade asset presentation) and `MZ-P1-CINE-REVIEW-FRAME.html` (Phase 1 pixel-target mockup + build brief). Lane B (Cowork) patched both per operator's Phase 0 ruling 2026-07-04 before dispatch: (1) armor is OUT_OF_SCOPE for this track, not a blocker — no armor added anywhere in this exception; (2) Zenith Blade shape canon is LOCKED but hand/back-attachment readiness stays UNCONFIRMED and does not gate this task; (3) layer = CINE confirmed; (4) the mockup's crimson accent tick contradicted the Canon Guard's own "crimson only on-model, seam/sacred" rule — patched to a silver `#a0a0b0` accent tick in the v2 files below; (5) "P3 core" renamed `ZENITH_BLADE_CORE` to avoid confusion with roadmap Phase 3 (that rename lives in the SPEC B text for the NEXT exception, not this one); (6) the 16:9 frame is explicitly a REVIEW-MASTER format — portrait/Canvas exports (Phase 4, future) are a separate derivative that does not automatically inherit this chrome. Patched references: `production/character/build_log/MZ-ROADMAP-CINE-PRESENTATION-SYSTEM_V2.html` and `production/character/build_log/MZ-P1-CINE-REVIEW-FRAME_V3.html` (authoritative for exact coordinates/wording — supersede the originally uploaded files on every point listed above).
  - ROUND 2 (operator, same day, before round-1 patch was known to have been merged): operator independently re-uploaded the P1 mockup with Mikage-native codename/metadata — corner stamp `鏡`, STAGE-block studio stamp `MZ`, project tag `PROJECT ZENITH`, and fake HUD readouts referencing REAL canon (`STATE S1 · AWARE` = the SPEC B lighting state machine; `PHASE P2 · LANDAUER` = the ENTITY's 3-phase structural model, verified against `docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` section 0.5 — operator-approved 2026-06-02, not invented). Lane B merged round 1's crimson/format fixes into round 2's re-upload (round 2 did not yet contain them) and flagged one more naming-collision risk of the same class as "P3 core": "PHASE P2" reads ambiguously next to the roadmap's own "Phase 1-5" numbering, so it is relabeled `ENT-PHASE P2` in the merged file — flagged to operator, not unilaterally forced. Merged, final file: `production/character/build_log/MZ-P1-CINE-REVIEW-FRAME_V3.html` (supersedes the V2 patch entirely).
  - SCOPE: this exception is Phase 1 ONLY (the presentation-frame overlay). Phase 2 (SPEC B, cinematic lighting pass) is explicitly NOT dispatched with this one — operator instruction: do not send both phases at once, lighting waits for Phase 1's own PASS gate first.
  - Allowed base input (read/reference only, do NOT modify): `production/character/build_log/MZ-P1-CINE-REVIEW-FRAME_V3.html` (authoritative pixel target + build brief, coordinates/colors/fields all specified inside). One existing flat render of the character (any already-approved contact sheet or still under `production/character/reviews/`) for the required "overlay on an old render" proof — Codex may pick any one clearly-labeled existing PASS render for this purpose, not a new render.
  - REQUIRED BUILD: a reusable 2-layer overlay template — (1) CHROME layer: static, matches the exact coordinates/colors/type given in the V3 build brief (top menu bar, stage label block with a SILVER accent tick — not crimson, corner ticks, right-mid reticle, bottom readouts, scrub bar); (2) DATA layer: text fields that vary per shot (`STAGE`, `ASSET_ID`, `ASSET_NAME`, `DATE`, `CODENAME`) without moving or restyling the chrome. Prefer Build Option A from the brief (Blender compositor node-group with driven text), falling back to Option B (PNG overlay + separate text render/comp) only if A is impractical — report which was used and why.
  - LOCKED (hard, per the patched Canon Guard): type = Space Mono only inside the chrome (no serif/sans in chrome); ZERO crimson anywhere in the chrome (accent tick is silver `#a0a0b0`, not `#9d2933` — crimson stays reserved for on-model seam/sacred use only, never in UI chrome); ZERO violet anywhere in the chrome (violet only ever appears in the render layer itself, at the character's slits); radius 0 throughout the chrome; grain/noise floor stays present per the base cine contract; no `#000`/`#fff` pure values in the chrome; chrome must not cover or obscure the subject region (keep density low, generous negative space).
  - REQUIRED PROOF: overlay the finished chrome template on top of ONE existing flat/plain render (character, any state) and produce a labeled comparison (before = flat render alone, after = render + chrome). This is the actual gate test from the roadmap: does it read as a studio asset-review, not a gaming HUD.
  - SUCCESS: chrome matches the V3 build brief's coordinates/colors/type; silver accent tick present, no crimson found anywhere in the chrome; no violet found anywhere in the chrome; data fields (STAGE/ASSET_ID/ASSET_NAME/DATE/CODENAME) demonstrated changing without moving/restyling the chrome (at least 2 different STAGE values shown, e.g. WIREFRAME and CINE); before/after overlay comparison on an existing render reads as studio review-chrome, not a game HUD; radius 0 confirmed; gate folder holds exactly `contact_sheet.png` + `contact_sheet_review_report.md`; `python .mikage/tools/verify_output.py` prints PASS; no `.blend1` remains; no character/rig/geometry file modified by this task.
  - Allowed outputs (candidate only, template + proof, NOT a new hero render): `production/character/production_actor/rig_derivatives/MIKAGE_CINE_REVIEW_FRAME_V0_1.blend` (if Option A) and/or `production/character/reference/MIKAGE_CINE_REVIEW_FRAME_V0_1_CHROME.png` (if Option B) + `production/character/reviews/MIKAGE_CINE_REVIEW_FRAME_V0_1_OVERLAY_TEST.png` (before/after comparison) + `..._PROOF.md`; gate folder `_tmp/mikage_cine_review_frame_v0_1_gate/` holds ONLY the two allowed files.
  - FAIL: any crimson pixel found anywhere in the chrome -> `BLOCKER = CRIMSON_IN_CHROME`; any violet pixel found anywhere in the chrome -> `BLOCKER = VIOLET_IN_CHROME`; chrome coordinates/type/colors deviate from the V3 build brief without asking first -> `BLOCKER = SPEC_DEVIATION`; data fields cannot be changed independently of the chrome (i.e. chrome moves/restyles per shot) -> `BLOCKER = TEMPLATE_NOT_REUSABLE`; overlay-on-render proof reads as a gaming HUD (neon, glow, rounded corners, icons/emoji) rather than studio review-chrome -> `BLOCKER = STYLE_VIOLATION`; any character/rig/geometry file touched -> `BLOCKER = SCOPE_VIOLATION`; gate mis-schema'd -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - No canon-lock. No asset-lock. No production-ready/final claim (label CANDIDATE). No push. No deploy. Phase 2 (SPEC B / cinematic lighting pass) is a separate future exception, dispatched only after the operator reviews and passes this one — do not begin Phase 2 work as part of this exception even if it seems like a natural continuation.
  - On SSOT/spec conflict, or if the V3 build brief's coordinates cannot be matched exactly for a stated reason: stop and report — do not silently approximate colors/positions or invent chrome elements not in the brief.

- Fifty-second controlled exception is open:
  - `MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1 = OPEN` (rebuild the Zenith Blade mesh to canon slab proportions — a geometry fix, not a relight; current mesh tapers to a needle/katana profile and has never matched the locked slab spec)
  - Operator uploaded `CODEX_ZENITH_BLADE_REMODEL_BRIEF.md` + `ZENITH_BLADE_SLAB_REFERENCE.svg` 2026-07-05. Confirmed by repo read: no prior exception has ever changed blade shape — #40 through #51 all list the three blade slab meshes as rigidly-attached-to-root and unanimated/unchanged.
  - Allowed base input: `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1.blend` (exception #48's PASS derivative). Full brief: `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_SLAB_REMODEL_V0_1.md`. Reference: `production/character/build_log/ZENITH_BLADE_SLAB_REFERENCE.svg`.
  - REQUIRED: rebuild the three blade slab mesh objects to: (1) broad rectangular slab, width 0.22–0.26 of blade length, parallel edges for ~87% of length; (2) last 13% only chisels to a blunt ~0.02L tip; (3) single centered emissive seam, `#8F00FF`, only emissive part of the weapon; (4) matte titanium grip ring (`#D6D6D6`) at exact mid-shaft; (5) short matte dark grip above. Dead straight, no curve.
  - LOCKED: helmet geometry/material; both slit meshes/shape/count/`#8F00FF`; white halo geometry + unanimated material (glow only S2); closed single-volume cloak (288 verts, 0 boundary/non-manifold edges); existing 7 axial + 2 drape-sway bones, positions/weights; S0/S1/S2 lighting values; void `#050508`. Blade's rigid-to-root ATTACHMENT POINT does not move — mesh shape/material only.
  - HARD BANS: needle taper, katana curvature, longsword/greatsword profile, crossguard/tsuba, fuller, any curve.
  - REQUIRED PROOF: (1) wireframe/build-log view showing the wide parallel-edge slab; (2) 360° turntable (or the 8-angle set used for the hero turnaround) confirming broad from every angle except edge-on; (3) hero key-art still, seam lit violet.
  - SUCCESS: width/length ratio 0.22–0.26 measured on render; silhouette matches locked comic KF05 slab; no taper except last ~13%; seam single centered line; ring at exact mid-shaft; every LOCKED item unchanged by hash/measurement; gate = exactly `contact_sheet.png` + `contact_sheet_review_report.md`; `verify_output.py` PASS; no `.blend1`.
  - FAIL: ratio outside range → `BLOCKER = SLAB_PROPORTION_FAIL`; taper before last 13% → `BLOCKER = TAPER_VIOLATION`; any curve → `BLOCKER = CURVATURE_VIOLATION`; seam/ring mispositioned → `BLOCKER = SEAM_RING_POSITION_FAIL`; any locked item changed → `BLOCKER = SCOPE_VIOLATION`; silhouette diverges from KF05 → `BLOCKER = SILHOUETTE_DRIFT`; gate mis-schema'd → `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - Allowed outputs: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1.blend` + `..._WIREFRAME.png` + `..._TURNTABLE.png` (or `.mp4`, outside gate) + `..._KEYART.png` + `..._PROOF.md`; gate `_tmp/mikage_zenith_blade_slab_remodel_v0_1_gate/` = ONLY the 2 gate files (report must include a WIDTH/LENGTH RATIO section with the real number).
  - No canon-lock. No asset-lock. No production-ready claim (CANDIDATE). No push. No deploy. Stop after proof for operator review — Lane B pulls/replaces the public site/deck cards after BOOS rules, not Codex.
  - Queued by Lane B (Cowork) 2026-07-05, blocked on operator commit (same as exception #50).

- Fifty-third controlled exception is open:
  - `MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1_1 = OPEN` (narrow follow-up to #52: fix blade seam emission hue, material/render only, geometry stays locked)
  - Lane B (Cowork) independently pixel-sampled the rendered seam of #52's candidate (not the material node value) and found it reads pale pink/lavender (`#DBB1F5` core, `#A36BCC` falloff edge) instead of the required blue-dominant violet — the same class of drift previously found and fixed on the helmet slits (V0.8 -> V0.8.1). Geometry itself confirmed correct (W/L=0.240, in range).
  - Allowed base input: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1.blend` (exception #52's candidate — geometry locked from here, do not touch mesh/transform). Full brief: `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_SLAB_REMODEL_V0_1_1.md`.
  - REQUIRED: adjust the blade seam's emissive material only (reduce red channel of the linear emission input and/or bloom/exposure, same fix pattern as the V0.8.1 slit fix); re-render the same 3 proof assets; pixel-sample the actual rendered seam at 2+ points and report real RGB/hex values, compared against the helmet slit reference samples (`#870DFF`, `#9718F8` family).
  - LOCKED: everything from #52 PLUS blade geometry itself (slab proportions/tip/seam shape/ring position/grip) — material/color on the seam emission ONLY.
  - SUCCESS: rendered seam pixel-sampled reads blue-dominant violet (red notably below blue) at 2+ points, real values reported; geometry measurements identical to #52; ring/grip/slab materials unchanged; gate exactly 2 files; `verify_output.py` PASS; no `.blend1`.
  - FAIL: rendered pixel still pink/magenta → `BLOCKER = SLIT_HUE_FAIL`; any geometry/transform change → `BLOCKER = SCOPE_VIOLATION`; gate mis-schema'd → `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - Out of scope: the KF05 comic-panel comparison from #52's original brief — no such file found in either repo by Lane B; dropped, do not block on it again. Do not touch public site/deck cards.
  - Allowed outputs: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1_1.blend` + re-rendered `..._WIREFRAME.png` / `..._TURNTABLE.png` / `..._KEYART.png` + `..._PROOF.md` (with real pixel-sample values); gate `_tmp/mikage_zenith_blade_slab_remodel_v0_1_1_gate/` = ONLY the 2 gate files.
  - No canon-lock. No asset-lock. No production-ready claim (CANDIDATE). No push. No deploy. Stop after proof for operator review.
  - Queued by Lane B (Cowork) 2026-07-05, blocked on operator commit (must commit #52's outputs first — see handoff note).
  - ⚠️ RETIRED 2026-07-06 (operator BOOS, data-safety catch — "zenith blade có 3 pha 3 trạng thái, kiểm tra lại dữ liệu"): exceptions #52 AND #53 were both dispatched from `CODEX_ZENITH_BLADE_REMODEL_BRIEF.md`, a single-state violet-seam premise. That premise conflicts with canon ALREADY LOCKED on 2026-06-02 — before this brief was ever written: `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` + `MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` §0.5 specify a SYNCED 3-PHASE weapon (P1 `Compact-Idle` closed B4C block / P2 `Brutal Industrial Activation` cracked-open / P3 `Overdrive` core `#E60000` RED — not a bladed slab, not violet). Lane B (Cowork) never cross-checked the incoming brief against this existing lock before dispatching #52 — that is the actual error, not anything Codex did; Codex's geometry/color execution against the (wrong) brief it was given was technically correct both times. Candidate `.blend`/render outputs from #52/#53 are left on disk as an audit trail only (each PROOF.md now carries a superseded banner) — they are NOT the production blade and must not be pulled into any deck/site/public asset. Real rebuild dispatched as the Fifty-fourth controlled exception below.

- Fifty-fourth controlled exception is open:
  - `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1 = OPEN` (rebuild the Zenith Blade as the real locked 3-phase B4C/Titanium weapon — replaces #52/#53 entirely, see retirement note above)
  - Operator ruling 2026-07-06: rebuild per the 3-phase canon already locked 2026-06-02, remove/flag the wrong single-state violet slab work so it does not cause confusion going forward.
  - Allowed base input: `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1.blend` (exception #48's PASS derivative — the LAST version before #52/#53 touched the blade; do NOT base this on the #52 or #53 candidate `.blend` files). Full brief: `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_1.md`. Canon source: `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` + `docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` §0.5 (both read-only, already locked).
  - REQUIRED: build P1 `Compact-Idle` as a closed brutalist B4C monolith block (no blade silhouette — no point, no crossguard, no wrapped grip), flux-pinned to the same existing attachment point; add P2 `Brutal Industrial Activation` (Kintsugi shell crack revealing black Titanium inner frame, mid-strength red glow) and P3 `Overdrive` (shell fully split, Titanium frame exposed, core at max emissive `#E60000`) as driven states (shape-key/driver, following the existing S0/S1/S2 state-machine precedent). Full detail in the brief.
  - LOCKED: helmet geometry/material; both slit meshes/shape/count/`#8F00FF` (unchanged, unrelated to this weapon); white halo + S0/S1/S2 material; closed single-volume cloak; existing 7 axial + 2 drape-sway bones; existing weapon attachment point/location (do not move it). Full list in the brief §8.
  - HARD BANS: sword/blade silhouette at P1, any curve, violet/`#8F00FF` anywhere on this weapon at any phase, orange/gold/pink core color, a P1 that already glows.
  - REQUIRED PROOF: wireframe of the P1 block; a P1/P2/P3 contact sheet; P3 hero key art; pixel-sampled core/crack hue at 2+ points per phase with a red-dominance channel test (R minus B, R minus G) — same discipline that caught the #52/#53 pink-drift bug, applied here to rule OUT violet/orange/pink.
  - SUCCESS: P1 reads as a closed block with no blade features; P2 shows real crack geometry + Titanium frame + mid-red glow; P3 shows full split + max red core, pixel-sampled red-dominant; attachment point unchanged; every LOCKED item verified unchanged; gate exactly 2 files; `verify_output.py` PASS; no `.blend1`.
  - FAIL: blade silhouette at P1 → `BLOCKER = SILHOUETTE_VIOLATION`; violet found on the weapon at any phase → `BLOCKER = HUE_VIOLATION`; core reads orange/pink/magenta at P3 → `BLOCKER = HUE_VIOLATION`; P1 already glowing → `BLOCKER = STATE_MACHINE_VIOLATION`; attachment moved or any LOCKED item changed → `BLOCKER = SCOPE_VIOLATION`; gate mis-schema'd → `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - Allowed outputs: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1.blend` + `..._WIREFRAME.png` + `..._CONTACTSHEET_P1P2P3.png` + `..._KEYART_P3.png` + `..._PROOF.md`; gate `_tmp/mikage_zenith_blade_3phase_rebuild_v0_1_gate/` = ONLY the 2 gate files (report must include a PHASE-BY-PHASE HUE CHECK section with real numbers for P1/P2/P3).
  - No canon-lock. No asset-lock. No production-ready claim (CANDIDATE). No push. No deploy. Stop after proof for operator review — Lane B pulls/replaces public site/deck cards after BOOS rules, not Codex.
  - On ambiguity in exact block proportions/crack pattern not pinned down numerically by the two locked spec files: make a reasonable modeling choice, state it explicitly in the proof, do not block on it. On any OTHER SSOT conflict or scope drift: stop and report — operator decision, not to be resolved unilaterally.
  - Queued by Lane B (Cowork) 2026-07-06, blocked on operator commit.

- ⚠️ RULED 2026-07-06 (operator BOOS, visual/canon ruling): `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1` (Fifty-fourth controlled exception, directly above) = FAIL VISUAL/CANON. Both validators passed but the rendered result reads as a transforming armor plate / shield / energy module, not a **blade** - P1 has no point/grip, P2 reads as three status lights not a structural crack, P3 reads as two doors around a power rod. Separately, the operator reverses the core-color premise that #54 itself was built on: the Zenith Blade core is now ruled **electric violet `#8F00FF`** (thin controlled seam, same hue family as the helmet slits), not red `#E60000`. This does NOT edit `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` or `MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` section 0.5 - both still read RED core/closed-block silhouette on disk and are now stale on that specific question pending a formal spec update; do not treat them as current for weapon color/silhouette until BOOS updates or approves the revision below. V0_1 candidate files (blend/renders/proof) stay on disk as an audit trail only, not the production base - see revision dispatched as the Fifty-fifth controlled exception below.

- Fifty-fifth controlled exception is open:
  - `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2 = OPEN` (revise #54's visual hierarchy so all 3 phases read as a slab blade with a violet core - replaces #54 as the active target, keeps its rig/attachment/phase-driver system)
  - Operator ruling 2026-07-06: reinstate the vetted slab silhouette from exception #52 (`ZENITH_BLADE_SLAB_REFERENCE.svg`, shape reference only) and switch the core seam to electric violet `#8F00FF`, banning red/crimson on this weapon entirely.
  - Allowed base input: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1.blend` (V0_1's own candidate - reuse its rig/attachment/phase-driver system; do NOT start over from `MIKAGE_ROBE_HERO_CINE_STAGING_V0_1.blend`, and do NOT touch the #52/#53 candidate files). Full brief: `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_2.md`.
  - REQUIRED: P1 sealed slab blade with clear point-down tip, straight body, visible grip ring, non-emissive. P2 shell separation 2-3x wider than V0_1 with ONE continuous violet seam (not three dot lights), blade silhouette still dominant. P3 full split exposing a single straight central blade with legible point as the PRIMARY silhouette read (outer panels clearly secondary), violet core at full strength. Full detail in the brief.
  - LOCKED: helmet geometry/material; both slit meshes/shape/count/`#8F00FF` (unrelated to this weapon; the weapon now shares this hue family intentionally, not a conflict); white halo + S0/S1/S2 material; closed single-volume cloak; existing 7 axial + 2 drape-sway bones; existing weapon attachment point/location. Full list in the brief section 8.
  - HARD BANS: red/crimson/`#E60000` anywhere on the weapon at any phase, violet as a full-surface wash/flood instead of a thin seam, a P2 that still reads as status-light dots, a P3 where outer panels outweigh the central blade, katana curvature, attachment moved, any LOCKED item changed.
  - REQUIRED PROOF: silhouette self-check (black/white thumbnail per phase, YES/NO blade-read call); wireframe of P1; front 3-phase contact sheet; NEW side-view render of P3; key art; pixel-sampled core/seam hue at 2+ points per phase with a blue-dominance channel test (B minus R, B minus G) plus an explicit zero-red-pixels confirmation.
  - SUCCESS: all 3 phases pass the silhouette self-check; P2 gap clearly larger with one violet seam; P3 central blade dominant with full-strength violet core, blue-dominant pixel-sample; zero red/crimson found; attachment unchanged; every LOCKED item verified unchanged; gate exactly 2 files; `verify_output.py` PASS; no `.blend1`.
  - FAIL: any phase fails the silhouette self-check and is not corrected -> `BLOCKER = SILHOUETTE_NOT_BLADE`; any red/crimson pixel found -> `BLOCKER = HUE_VIOLATION`; violet reads as a wash -> `BLOCKER = SIGNAL_DISCIPLINE_VIOLATION`; P2 still reads as status lights -> `BLOCKER = P2_INSUFFICIENT_ACTIVATION`; P3 outer panels outweigh the blade -> `BLOCKER = SILHOUETTE_NOT_BLADE`; attachment moved or LOCKED item changed -> `BLOCKER = SCOPE_VIOLATION`; gate mis-schema'd -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - Allowed outputs: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2.blend` + `..._WIREFRAME.png` + `..._CONTACTSHEET_FRONT_P1P2P3.png` + `..._SIDEVIEW_P3.png` + `..._SILHOUETTE_THUMBNAILS.png` + `..._KEYART_P3.png` + `..._PROOF.md`; gate `_tmp/mikage_zenith_blade_3phase_rebuild_v0_2_gate/` = ONLY the 2 gate files (report must include the PHASE-BY-PHASE HUE CHECK with blue-dominance numbers AND the silhouette self-check table).
  - No canon-lock. No asset-lock. No production-ready claim (CANDIDATE). No push. No deploy. Stop after proof for operator review.
  - On ambiguity in exact proportions not pinned down numerically by the brief or `ZENITH_BLADE_SLAB_REFERENCE.svg`: make a reasonable modeling choice, state it explicitly in the proof, do not block on it. On any OTHER SSOT conflict beyond the color/silhouette override already stated, or scope drift: stop and report - operator decision, not to be resolved unilaterally.
  - Queued by Lane B (Cowork) 2026-07-06, blocked on operator commit.

- RULED 2026-07-06 (operator BOOS, direct visual review of the V0_2 contact sheet): silhouette/shape =
  PASS (blade reads correctly at all 3 phases, keep it exactly as-is, this part is approved). Core COLOR
  = FAIL - independent pixel scan (Lane B, Cowork) of the actual rendered contact sheet found the true
  brightest core pixels clipped to RGB(255,~30-120,255) (R equals B, i.e. magenta), not blue-dominant
  violet, even though V0_2's own proof sampled off-peak seam points that did measure blue-dominant. Root
  cause: emission/bloom strong enough to clip R up to meet B at the hottest pixel. This is a narrow
  material/render-only revision - V0_2's geometry/silhouette is not touched.

- Fifty-sixth controlled exception is open:
  - `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_3 = OPEN` (fix core color/bloom clipping only, reuse V0_2's shape byte-identical)
  - Allowed base input: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_2.blend` (V0_2's own PASS-shape candidate; do NOT touch geometry, rig, or attachment). Full brief: `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_3.md`.
  - REQUIRED: identify the actual brightest core pixel (not an arbitrary seam point) for P2 and P3; adjust emission strength and/or bloom threshold/intensity until that peak pixel measures clearly blue-dominant (B minus R >= 40) in the beauty render; also render a no-bloom diagnostic pass at the same coordinates to isolate base material color from bloom clipping; re-export the front contact sheet at more readable exposure. Full detail in the brief.
  - SCOPE LOCK: no mesh/geometry/proportion/rig/attachment change of any kind versus V0_2 - material and render settings only.
  - HARD BANS: red/crimson anywhere on the weapon, seam thickened/washed to mask the fix, sampling only an off-peak point instead of the true brightest pixel, any geometry change.
  - REQUIRED PROOF: re-exported contact sheet; beauty-vs-no-bloom comparison sheet for P2/P3; pixel-sample table at the peak pixel for both passes with B-R/B-G deltas; explicit zero-red confirmation; V0_2 geometry/rig/attachment verified unchanged.
  - SUCCESS: peak-pixel B minus R >= 40 in beauty render for P2 and P3; no-bloom pass also blue-dominant at that coordinate; zero red/crimson; seam still thin; V0_2 shape byte-identical; gate exactly 2 files; `verify_output.py` PASS; no `.blend1`.
  - FAIL: peak pixel still clips (R within 39 of B or above) -> `BLOCKER = HUE_VIOLATION`; no-bloom pass also non-blue-dominant -> `BLOCKER = HUE_VIOLATION`; any geometry/rig/attachment change -> `BLOCKER = SCOPE_VIOLATION`; seam thickened/washed -> `BLOCKER = SIGNAL_DISCIPLINE_VIOLATION`; gate mis-schema'd -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - Allowed outputs: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_3.blend` + `..._CONTACTSHEET_FRONT_P1P2P3.png` + `..._BEAUTY_VS_NOBLOOM_P2P3.png` + `..._KEYART_P3.png` + `..._PROOF.md`; gate `_tmp/mikage_zenith_blade_3phase_rebuild_v0_3_gate/` = ONLY the 2 gate files.
  - No canon-lock. No asset-lock. No production-ready claim (CANDIDATE). No push. No deploy. Stop after proof for operator review.
  - Queued by Lane B (Cowork) 2026-07-06, blocked on operator commit.

- RULED 2026-07-06 (Codex run result, `BLOCKER = HUE_VIOLATION`): `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_3`
  (Fifty-sixth controlled exception, directly above) = FAIL. At the true brightest core pixel, P2
  `(596,210)` and P3 `(595,210)`, BOTH the beauty render AND the no-bloom diagnostic pass read pure white -
  `RGB(255,254,255)` / `RGB(255,255,255)`, `B-R=0`. Reported honestly, no retry, no gate, no push, no PASS
  claim. This rules out bloom as the primary cause (V0_3's fix target) - the no-bloom pass should have
  stayed blue-dominant if bloom were the culprit, and it did not. Likely real cause: emission strength high
  enough that the view transform (Filmic/AgX) desaturates the highlight to white regardless of bloom, per
  the operator's own stated fallback order step (2).

- Fifty-seventh controlled exception is open:
  - `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4 = OPEN` (fix core color via emission-strength reduction, reuse V0_2/V0_3's shape byte-identical)
  - Allowed base input: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_3.blend` (shape still V0_2's approved shape; do NOT touch geometry, rig, or attachment). Full brief: `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_4.md`.
  - REQUIRED: before changing anything, report the core/seam material's emission strength, base emission color, and the scene-linear pre-tonemap radiance at the P2/P3 peak pixel if exposable; then substantially reduce emission strength (not a small notch) and/or apply a compositor-level highlight-desaturation correction, re-measure the peak pixel in both beauty and no-bloom passes. Full detail in the brief.
  - SCOPE LOCK: no mesh/geometry/proportion/rig/attachment change of any kind versus V0_2/V0_3 - material and render settings only.
  - HARD BANS: red/crimson anywhere on the weapon, seam thickened/washed to mask the fix, sampling only an off-peak point instead of the true brightest pixel, any geometry change.
  - REQUIRED PROOF: re-exported contact sheet; beauty-vs-no-bloom comparison sheet for P2/P3; pixel-sample table at the peak pixel for both passes with B-R/B-G deltas plus the scene-linear value; explicit zero-red confirmation; V0_2/V0_3 geometry/rig/attachment verified unchanged.
  - SUCCESS: peak-pixel B minus R >= 40 in beauty render for P2 and P3 with neither channel a flat 255/255/255; no-bloom pass also blue-dominant at that coordinate; zero red/crimson; seam still thin; shape byte-identical; gate exactly 2 files; `verify_output.py` PASS; no `.blend1`.
  - FAIL: peak pixel still clips to white or (R within 39 of B or above) -> `BLOCKER = HUE_VIOLATION`; no-bloom pass also non-blue-dominant -> `BLOCKER = HUE_VIOLATION`; any geometry/rig/attachment change -> `BLOCKER = SCOPE_VIOLATION`; seam thickened/washed -> `BLOCKER = SIGNAL_DISCIPLINE_VIOLATION`; gate mis-schema'd -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - Allowed outputs: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4.blend` + `..._CONTACTSHEET_FRONT_P1P2P3.png` + `..._BEAUTY_VS_NOBLOOM_P2P3.png` + `..._KEYART_P3.png` + `..._PROOF.md`; gate `_tmp/mikage_zenith_blade_3phase_rebuild_v0_4_gate/` = ONLY the 2 gate files.
  - No canon-lock. No asset-lock. No production-ready claim (CANDIDATE). No push. No deploy. Stop after proof for operator review.
  - Queued by Lane B (Cowork) 2026-07-06, blocked on operator commit.

- V0_4 RESULT (recorded 2026-07-07): TECHNICAL_STATUS = CANDIDATE_PASS, BOOS VISUAL RULING = FAIL_VISUAL.
  Codex execution and honesty were correct. Failure was in what was measured/targeted: (1) the peak-pixel
  gate sampled bloom-clipped near-white highlights (#B9B2FF/#C0BAFF), while the core BODY median reads
  cobalt/indigo (P2 hue 243.9deg R/B 0.19, P3 hue 245.1deg R/B 0.15) versus brand #8F00FF (273.6deg, 0.56) -
  the emission base color (0.015, 0.0, 0.800) has almost no red and can never render violet at any strength;
  (2) strengths cut to equal 0.05/0.05 erased the MID->MAX separation (P3 per-pixel luminance ~12% LOWER
  than P2). Full ruling: `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4_VISUAL_RULING.md`.

- Fifty-eighth controlled exception is open:
  - `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_5 = OPEN` (one combined pass: correct core hue to electric violet AND restore MID->MAX phase separation; reuse V0_4's shape byte-identical)
  - Allowed base input: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_4.blend`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_5.md`.
  - LOCK LIFTED BY OPERATOR RULING: the emission base COLOR may (must) change - gain red toward #8F00FF. Everything else stays locked: geometry, silhouette, seam geometry/position/width, ZB3_PHASE_CONTROL drivers, rig, camera, pose, attachment (1.08, -0.02, 1.75).
  - METHOD CHANGE (binding): color gate = MEDIAN of solid core-body pixels in the final PNG, excluding bloom, clipped (any channel 255) and edge/antialias pixels. Never the peak pixel. Marked sampling-regions image is a required deliverable.
  - COLOR GATE: P2 and P3 core-body median hue 268-280deg, R/B 0.45-0.65, reference center #8F00FF. AUTO-FAIL below 260deg or R/B < 0.40.
  - PHASE GATE: P3 core-body median linear luminance >= 1.5x P2; P3 same hue band as P2 (differentiating by shifting P3 bluer is a FAIL); physical seam width identical; P3 bloom envelope may expand around the same single line.
  - HARD BANS: red/crimson anywhere; second seam / duplicated line; seam thickening; violet wash onto the blade body; gating on the peak pixel; any geometry/rig/camera/attachment change.
  - REQUIRED PROOF: P1/P2/P3 contact sheet (phases distinguishable at thumbnail size); median RGB / HSV hue / R-to-B / linear luminance table for P2+P3; sampling-regions image; initial+final validator reports; zero-red scan; P1 zero-emissive check; geometry/rig hash audit vs V0_4; blend reopen audit of final color+strengths.
  - FAIL: median hue < 260deg or R/B < 0.40 -> `BLOCKER = HUE_VIOLATION`; P3 < 1.5x P2 luminance or P3 only bluer -> `BLOCKER = PHASE_SEPARATION_VIOLATION`; validator measured peak/bloom instead of core body -> `BLOCKER = FAIL_VALIDATION_METHOD`; geometry change -> `BLOCKER = SCOPE_VIOLATION`; seam thickened/washed/second line -> `BLOCKER = SIGNAL_DISCIPLINE_VIOLATION`; gate mis-schema'd -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.
  - Allowed outputs: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_5.blend` + `..._CONTACTSHEET_FRONT_P1P2P3.png` + `..._SAMPLING_REGIONS_P2P3.png` + `..._KEYART_P3.png` + `..._PROOF.md`; gate `_tmp/mikage_zenith_blade_3phase_rebuild_v0_5_gate/` = ONLY the 2 gate files.
  - No canon-lock. No asset-lock. No production-ready claim (CANDIDATE). No push. No deploy. Stop after proof for operator review.
  - Queued by Lane B (Cowork) 2026-07-07, blocked on operator commit.

- V0_5 RESULT (recorded 2026-07-07): honest STOP, `BLOCKER = COLOR_AND_PHASE_GATE_FAIL`. Codex execution
  correct. Lane B analysis: ~80% of core pixels clip in the tonemapped PNG, making the 1.5x luminance gate
  physically unmeasurable there (P3 measured dimmer at 4x strength because only the dim fringe survives the
  clip exclusion); hue 264-265 deg, ~5-10 deg short. Analysis file:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_5_BLOCKER_ANALYSIS.md`.

- Fifty-ninth controlled exception is open:
  - `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6 = OPEN` (measurable gate set; reuse V0_5's shape byte-identical)
  - Allowed base input: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_5.blend`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_6.md`.
  - GATES: (A) PNG core-body median hue 268-280 deg + R/B 0.45-0.65, both phases, auto-FAIL <260/<0.40; (B) P2 core-line clipped fraction <= 40% (NEW - P2 strength comes DOWN); (C) ENERGY in scene-linear EXR only: P3 >= 1.5x P2 median luminance over the same full-seam mask (NEVER on the PNG); (D) P3 glow envelope area >= 1.3x P2 on the PNG (NEW - visual MAX read).
  - Sampling mask must cover the FULL seam length, above and below the grip ring.
  - HARD BANS: red/crimson; second seam; physical seam thickening; violet wash; hue-shifting P3 bluer; measuring energy on the PNG; partial-seam masks; any geometry/rig/camera/attachment change.
  - REQUIRED PROOF: contact sheet (phases readable at thumbnail size); GATE_TABLE.md with every number; full-seam sampling-regions image; EXR medians + ratio; envelope areas + threshold; zero-red scan; P1 zero-emissive; hash audit vs V0_5; blend reopen audit.
  - FAIL codes: HUE_VIOLATION / P2_CLIP_VIOLATION / PHASE_SEPARATION_VIOLATION / FAIL_VALIDATION_METHOD / SCOPE_VIOLATION / SIGNAL_DISCIPLINE_VIOLATION.
  - Allowed outputs: `..._V0_6.blend` + `..._V0_6_CONTACTSHEET_FRONT_P1P2P3.png` + `..._V0_6_SAMPLING_REGIONS_P2P3.png` + `..._V0_6_GATE_TABLE.md` + `..._V0_6_KEYART_P3.png` + `..._V0_6_PROOF.md`; gate `_tmp/mikage_zenith_blade_3phase_rebuild_v0_6_gate/` = ONLY the 2 gate files.
  - No canon-lock. No asset-lock. No production-ready claim (CANDIDATE). No push. No deploy. Stop after proof for operator review.
  - Queued by Lane B (Cowork) 2026-07-07, blocked on operator commit.

- V0_6 RESULT (recorded 2026-07-10): honest STOP, all three gates FAIL, no retry - Codex execution
  correct. Emission color linear (0.33,0.0,1.0); P2 strength 0.014, P3 0.145. Measured: P2 hue 265.85 /
  P3 267.27 deg; P2 clip fraction 0.6937; EXR ratio 0.6012 (P3 dimmer); envelope ratio 1.2039. Lane B
  independent scan confirmed the numbers AND found the root cause is a MEASUREMENT/CLIPPER artifact, not
  base color: the hot core body already reads ~274 deg (on-brand #8F00FF) but ~71% of it clips to B=255,
  so the unclipped-body hue gate only samples the dim green-contaminated bloom fringe (G ~33-43) and reads
  266 deg. Strength 0.014 still clips 0.69 => the CLIPPER is glare/bloom, not emission strength. Analysis:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6_BLOCKER_ANALYSIS.md`.

- Sixtieth controlled exception is open:
  - `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_7 = OPEN` (bloom-discipline + EXR-hue gate; reuse V0_6 shape byte-identical). Operator BOOS ruling 2026-07-10: attack the clipper, measure hue pre-tonemap, do NOT nudge base color again.
  - Allowed base input: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_6.blend`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_7.md`.
  - EMISSION BASE COLOR LOCKED this round at linear (0.33,0.0,1.0) - isolate the bloom variable. May change ONLY: per-phase glare/bloom (threshold/intensity/size), per-phase emission strengths, proof exposure.
  - GATES: (A) PRIMARY - P2 AND P3 core-line clipped fraction <= 40% on the final PNG (de-clip the body via glare/bloom, not by killing emission); (B) HUE measured on SCENE-LINEAR EXR core-body (pre-tonemap, unclipped), both phases: hue 268-280 deg + R/B 0.45-0.65, ref #8F00FF, auto-FAIL <260/<0.40 (also report PNG body hue on the now-unclipped body as cross-check); (C) ENERGY in EXR with a mask that TRACKS P3 phase geometry and EXCLUDES the split-gap/background: P3 >= 1.5x P2 median linear luminance, report mask definition + both medians + ratio; (D) P3 glow envelope area >= 1.3x P2 on the PNG, same threshold both phases, report threshold.
  - Sampling mask covers the FULL seam length, above and below the grip ring, with clip/edge exclusions marked per region.
  - HARD BANS: changing the emission base color/hex; red/crimson; second seam; physical seam thickening; violet wash; hue-shifting P3 bluer; measuring the hue or energy gate on clipped PNG pixels; partial-seam masks; any geometry/rig/camera/attachment change.
  - REQUIRED PROOF: contact sheet (phases readable at thumbnail); GATE_TABLE.md with every number (PNG clip fractions P2+P3, EXR body hue/R-B per phase, EXR energy medians+ratio+mask definition, envelope areas+threshold); full-seam sampling-regions image; EXR-body sampling proof; zero-red scan; P1 zero-emissive; hash audit vs V0_6; blend reopen audit (color unchanged + strengths + bloom settings).
  - FAIL codes: P2_CLIP_VIOLATION / HUE_VIOLATION / PHASE_SEPARATION_VIOLATION / FAIL_VALIDATION_METHOD / SCOPE_VIOLATION / SIGNAL_DISCIPLINE_VIOLATION.
  - Allowed outputs: `..._V0_7.blend` + `..._V0_7_CONTACTSHEET_FRONT_P1P2P3.png` + `..._V0_7_SAMPLING_REGIONS_P2P3.png` + `..._V0_7_GATE_TABLE.md` + `..._V0_7_KEYART_P3.png` + `..._V0_7_PROOF.md`; gate `_tmp/mikage_zenith_blade_3phase_rebuild_v0_7_gate/` = ONLY the 2 gate files.
  - No canon-lock. No asset-lock. No production-ready claim (CANDIDATE). No push. No deploy. Stop after proof for operator review.
  - Queued by Lane B (Cowork) 2026-07-10, blocked on operator commit.

- V0_7 RESULT (recorded 2026-07-11): honest STOP, all three gates FAIL, no retry - Codex execution
  correct. Glare tamed (clip 0.69->0.58); MID strength 0.02, MAX 0.09; base color linear (0.33,0,1.0)
  audited unchanged. Lane B verified the numbers and proved TWO things: (1) the COLOR is a perfect
  #8F00FF - gate B failed only because it measures on scene-linear EXR (where #8F00FF = hue 256.5 /
  R/B 0.275) but compares to the DISPLAY-space band 268-280 / 0.45-0.65 (#8F00FF's sRGB values). EXR
  body measured 256.3 / 0.278 == #8F00FF linear; converted linear->sRGB = 271.4 / 0.564 == #8F00FF
  display; PNG cross-check + Lane B scan = ~268-269 / 0.50 (in the display band). A correct blade
  CANNOT pass gate B as written = FAIL_VALIDATION_METHOD. (2) PHASE SEPARATION is the one real
  unsolved problem: EXR energy P2 0.7302 vs P3 0.7179 = ratio 0.983 (~equal) despite MAX strength
  4.5x MID; EXR body medians near-identical. Strength is not reaching the core - suspect glare
  Maximum=4.0 clamping, or the phase driver not swapping MID->MAX. Analysis:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_7_BLOCKER_ANALYSIS.md`.

- Sixty-first controlled exception is open:
  - `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_8 = OPEN` (gate-fix + phase-wiring diagnosis; reuse V0_7 shape byte-identical). Operator BOOS ruling 2026-07-11: color #8F00FF is verified correct; fix the mis-specified gates and DIAGNOSE the phase wiring before tuning.
  - Allowed base input: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_7.blend`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_8.md`.
  - EMISSION BASE COLOR LOCKED at linear (0.33,0.0,1.0). May change ONLY: per-phase glare/bloom, per-phase emission strengths, proof exposure, and the MEASUREMENT METHOD for the color gate.
  - GATE B (COLOR) FIXED: measure hue/R-B in DISPLAY/sRGB space (unclipped PNG body, or EXR body converted linear->sRGB), band 268-280 deg + R/B 0.45-0.65, ref #8F00FF, auto-FAIL <260/<0.40. Never compare a linear measurement to the display band. (V0_7 color already passes ~271 deg / R/B 0.56 under this method - this is now a confirm gate.)
  - GATE C (PHASE) DIAGNOSIS-FIRST: before choosing any MAX strength, Codex MUST report per-phase SOURCE emitter radiance, confirm the ZB3_PHASE driver actually swaps MID->MAX between P2 and P3, and confirm glare "Maximum" is not clamping the core to a shared ceiling (measure core with glare Maximum raised/disabled). If the driver does not swap or glare clamps, report PHASE_WIRING_BLOCKER with the finding and STOP. Only after wiring is understood, set MAX so EXR core energy P3 >= 1.5x P2 over the phase-aware mask.
  - GATE A (BODY INTEGRITY) REDEFINED: replace clip-fraction<=40% with: a solid unclipped in-band violet body must EXIST along the full seam (report unclipped in-band body pixel count + that every sampled cross-section has >=1 unclipped in-band pixel), with controlled bloom. Report clip fraction as INFO only.
  - GATE D (envelope): P3 glow envelope area >= 1.3x P2 on the display PNG, same threshold both phases (secondary to gate C energy).
  - HARD BANS: changing emission base color/hex; red/crimson; second seam; seam thickening; violet wash; hue-shifting P3 bluer; comparing color measurements across color spaces; faking phase separation without fixing the wiring; any geometry/rig/camera/attachment change.
  - REQUIRED PROOF: contact sheet; GATE_TABLE.md (display-space body hue/R-B P2+P3 + method, per-phase source emitter radiance, driver-swap confirmation, glare-clamp check, EXR core energy P2/P3/ratio + mask def, unclipped-body pixel counts, envelope areas+threshold); full-seam sampling-regions image; zero-red; P1 zero-emissive; hash audit vs V0_7; blend reopen audit (base color unchanged + strengths + glare settings).
  - FAIL codes: PHASE_WIRING_BLOCKER / PHASE_SEPARATION_VIOLATION / HUE_VIOLATION / BODY_INTEGRITY_VIOLATION / FAIL_VALIDATION_METHOD / SCOPE_VIOLATION / SIGNAL_DISCIPLINE_VIOLATION.
  - Allowed outputs: `..._V0_8.blend` + `..._V0_8_CONTACTSHEET_FRONT_P1P2P3.png` + `..._V0_8_SAMPLING_REGIONS_P2P3.png` + `..._V0_8_GATE_TABLE.md` + `..._V0_8_KEYART_P3.png` + `..._V0_8_PROOF.md`; gate `_tmp/mikage_zenith_blade_3phase_rebuild_v0_8_gate/` = ONLY the 2 gate files.
  - No canon-lock. No asset-lock. No production-ready claim (CANDIDATE). No push. No deploy. Stop after proof for operator review.
  - Queued by Lane B (Cowork) 2026-07-11, blocked on operator commit.

- V0_8 RESULT (recorded 2026-07-11): honest STOP at the diagnosis-first gate, `PHASE_WIRING_BLOCKER` -
  Codex execution correct. ROOT CAUSE of the whole 8-round phase-separation failure FOUND:
  `ZB3_PHASE_CONTROL["blade_phase"]` does not swap phase visibility. In every requested phase
  (P1/P2/P3), `ZB3_P3_CONTINUOUS_VIOLET_SEAM` (MAX, strength 0.09) stays VISIBLE and
  `ZB3_P2_CONTINUOUS_VIOLET_SEAM` (MID, strength 0.02) stays HIDDEN - so every "P2"/"P3" render showed
  the SAME object (EXR energy ratio 1.0013 despite a real 4.5x source-strength difference on the hidden
  object). Also CONFIRMED: the display-space color gate PASSES (P2 269.17 / P3 269.42 deg, R/B 0.51/0.50)
  and body-integrity PASSES - color is DONE. Analysis:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_8_BLOCKER_ANALYSIS.md`.

- Sixty-second controlled exception is open:
  - `MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_9 = OPEN` (VISIBILITY-DRIVER REPAIR ONLY; reuse V0_8 shape byte-identical). Operator BOOS ruling 2026-07-11: repair the driver in isolation, no glare/strength/color tuning this round.
  - SCOPE EXPANSION AUTHORIZED: the standing lock "do not modify the ZB3_PHASE_CONTROL driver system" is LIFTED for this task, LIMITED to the phase-VISIBILITY wiring/expression of the two seam objects. Everything else stays locked.
  - Allowed base input: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_8.blend`. Full brief: `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_9.md`.
  - MAY CHANGE: only the phase-visibility driver/wiring so `blade_phase` swaps correctly. MUST NOT CHANGE: mesh geometry, proportions, seam geometry/position/width, rig BONES, camera, pose, attachment (1.08,-0.02,1.75), emission base color (linear 0.33,0,1.0), material strengths (MID 0.02 / MAX 0.09), glare/bloom settings, exposure.
  - TARGET BEHAVIOR: P1 = both violet seams hidden/emissive-off (P1 zero-emissive stays true); P2 = `ZB3_P2_CONTINUOUS_VIOLET_SEAM` visible+emissive, `ZB3_P3_CONTINUOUS_VIOLET_SEAM` hidden; P3 = `ZB3_P3_CONTINUOUS_VIOLET_SEAM` visible+emissive, `ZB3_P2_CONTINUOUS_VIOLET_SEAM` hidden. Both hide_viewport AND hide_render must be driven consistently.
  - GATE (visibility audit): from the reopened blend, driver-evaluated, report per-phase visible/hidden + emissive state of BOTH seam objects; all three phases must match target. Corroborate with EXR core energy P2 vs P3 (should now reflect the ~4.5x difference) - REPORTED as evidence the swap works, NOT tuned to a target this round.
  - NON-REGRESSION: geometry/silhouette/rig-bones/camera/pose/attachment byte-identical vs V0_8; emission base color + material strengths + glare settings unchanged; display-space color still passes; zero red; one line.
  - HARD BANS: touching mesh geometry / rig bones / camera / pose / attachment; changing base color, strengths, or glare; tuning MAX for the >=1.5x energy target (that is V0_10); second seam; seam thickening; violet wash.
  - FAIL codes: DRIVER_REPAIR_FAILED (swap still wrong after edit) / SCOPE_VIOLATION / SIGNAL_DISCIPLINE_VIOLATION / FAIL_VALIDATION_METHOD.
  - REQUIRED PROOF: contact sheet (P1/P2/P3 now visibly distinct); GATE_TABLE.md (per-phase seam-object visibility+emissive audit, target vs actual; EXR core energy P2/P3/ratio as corroboration; display color confirm; geometry hash audit vs V0_8; base color/strengths/glare unchanged audit; driver expression before/after); full-seam sampling-regions image; zero-red; P1 zero-emissive.
  - Allowed outputs: `..._V0_9.blend` + `..._V0_9_CONTACTSHEET_FRONT_P1P2P3.png` + `..._V0_9_SAMPLING_REGIONS_P2P3.png` + `..._V0_9_GATE_TABLE.md` + `..._V0_9_KEYART_P3.png` + `..._V0_9_PROOF.md`; gate `_tmp/mikage_zenith_blade_3phase_rebuild_v0_9_gate/` = ONLY the 2 gate files.
  - next-if-pass = V0_10 re-runs the full color+energy+envelope battery on the now-correct phases.
  - No canon-lock. No asset-lock. No production-ready claim (CANDIDATE). No push. No deploy. Stop after proof for operator review.
  - Queued by Lane B (Cowork) 2026-07-11, blocked on operator commit.
