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
  - MODEL downloads still NOT granted beyond the two Phase-1 files (IP-Adapter SD1.5, CLIP vision,
    ControlNet aux/models): LIST them for separate operator approval. (Pip/runtime deps above are
    the only exception.)
  - No `D:\MIKAGE ZENITH AUDIO` changes. No website/public/audio/short/release changes.
  - No canon-lock. No asset-lock. No final / production-ready / PASS / verified claim.
    No push. No deploy. SAMPLE label on all outputs. Candidate/test only.
  - Required validation before reporting done: confirm ONLY the three `MZ_FACELESS_*` files
    above were created; confirm no existing workflow JSON was modified; if a test image was
    rendered, open and inspect the actual PNG (do not infer success from script completion).
  - On drift or SSOT conflict: stop and report.
