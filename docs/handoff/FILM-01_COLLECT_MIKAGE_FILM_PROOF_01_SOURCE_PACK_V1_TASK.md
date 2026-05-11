# FILM-01_COLLECT_MIKAGE_FILM_PROOF_01_SOURCE_PACK_V1_TASK

## 1. TASK

FILM-01_COLLECT_MIKAGE_FILM_PROOF_01_SOURCE_PACK_V1

## 2. ROLE

You are the local Codex worker. Your job is to collect a clean repo-local source pack for `MIKAGE_FILM_PROOF_01` based on the completed FILM-00 readiness audit.

Do not ask the user for clarification if the answer can be inspected from the repo.

## 3. PRIMARY OBJECTIVE

Create a dedicated source pack for the first Mikage film proof.

The source pack must be conservative and must support only the first recommended scope from FILM-00:

```txt
20s 3-shot motion proof
```

Do not produce a video. Do not render. Do not generate images. Do not use ComfyUI or Blender.

## 4. CURRENT ACTIVE LANE

```txt
MIKAGE SUPERPOWER SYSTEM / runtime skeleton / coordination system
```

Film sub-lane for this task:

```txt
MIKAGE_FILM_PROOF_01 / source pack collection only
```

## 5. REQUIRED FIRST READS

Read these files before doing anything else:

1. `docs/handoff/00_LATEST_CODEX_HANDOFF.md`
2. `docs/handoff/FILM-00_AUDIT_MIKAGE_FILM_PROOF_READINESS_FROM_REPO_V1_REPORT.md`
3. `docs/handoff/MIKAGE_GITHUB_HANDOFF_BRIDGE_RULE_V0.md`
4. `docs/handoff/MIKAGE_SUPERPOWERS_RUNTIME_SPEC_V1.md`
5. `.mikage_context`
6. `NEXT_TASK.md`

## 6. CANDIDATE SOURCE AREAS FROM FILM-00

Inspect and collect from these candidate paths only if they exist and are usable:

### Canon/style docs

- `MIKAGE_ZENITH_CANON_V2.md`
- `canon/MIKAGE_VISUAL_CONTRACT_V1.json`
- `docs/mikage_character_visual_spec.md`
- `docs/mikage_shot_and_lighting_spec.md`
- `docs/mikage_universe_visual_system.md`
- `docs/handoff/MIKAGE_CHARACTER_REVIVAL_REGISTRY_V1.md`

### Candidate static visuals

- `docs/archive/root_legacy_artifacts_20260430/GOLDEN_MASK_001.png`
- `docs/archive/root_legacy_artifacts_20260430/golden_mask_batch_001.png`
- `docs/archive/root_legacy_artifacts_20260430/img_1.png`
- `docs/archive/root_legacy_artifacts_20260430/img_2.png`
- `docs/archive/root_legacy_artifacts_20260430/img_3.png`
- `docs/archive/root_legacy_artifacts_20260430/img_4.png`
- `MIKAGE_COMMANDER_PACKAGE_V1/runs/GOOGLE_LANE_E2E_001/GOOGLE_LANE_E2E_001.png`
- `post_anchor_images/base_anchor.png`

## 7. REQUIRED OUTPUT FOLDER

Create this folder:

```txt
film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1
```

Inside it, create:

```txt
film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/README.md
film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/SOURCE_PACK_MANIFEST.md
film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/SELECTED_3_SHOT_SOURCE_MAP.md
film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/canon_refs/
film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/visual_candidates/
film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/rejected_or_archive_only/
```

## 8. SOURCE PACK RULES

The source pack must clearly label every selected item as one of:

```txt
APPROVED_FOR_FILM_PROOF_SOURCE
CANDIDATE_REQUIRES_HUMAN_REVIEW
ARCHIVE_ONLY_DO_NOT_USE_DIRECTLY
REJECTED_DO_NOT_USE
MISSING
```

Do not claim an asset is approved unless repo evidence supports that exact claim.

If approval status is unclear, label it:

```txt
CANDIDATE_REQUIRES_HUMAN_REVIEW
```

## 9. 3-SHOT PROOF REQUIREMENT

Prepare source mapping for exactly 3 shots:

```txt
SHOT_01_SIGNAL_VOID
SHOT_02_MIKAGE_PRESENCE
SHOT_03_TITLE_OR_SYSTEM_WAKE
```

For each shot, specify:

```txt
- intended purpose
- candidate source image path
- source confidence
- known risk
- whether human review is required
```

If fewer than 3 usable candidate visuals exist, return `BLOCKED` with exact missing items.

## 10. AUDIO RULE

Do not add audio unless a rights-cleared repo-local audio file exists.

If no audio is found, set:

```txt
AUDIO_STATUS: MISSING_REPO_LOCAL_AUDIO
FIRST_PROOF_AUDIO_DECISION: SILENT_PROOF_OR_EXTERNAL_AUDIO_PENDING
```

## 11. DO NOT

- Do not generate images.
- Do not generate video.
- Do not render.
- Do not use ComfyUI.
- Do not use Blender.
- Do not edit locked canon assets.
- Do not create public deployment.
- Do not create canon approval.
- Do not create asset lock.
- Do not revive old failed image/render/3D routes.
- Do not copy huge unrelated archives into the source pack.

## 12. REQUIRED REPORT

Create:

```txt
docs/handoff/FILM-01_COLLECT_MIKAGE_FILM_PROOF_01_SOURCE_PACK_V1_REPORT.md
```

The report must include:

```md
# FILM-01_COLLECT_MIKAGE_FILM_PROOF_01_SOURCE_PACK_V1_REPORT

## 1. RESULT
PASS_SOURCE_PACK_CREATED / PARTIAL_SOURCE_PACK_NEEDS_HUMAN_REVIEW / BLOCKED

## 2. FILES_READ
List files actually read.

## 3. FOLDERS_CREATED
List folders created.

## 4. FILES_CREATED
List files created.

## 5. FILES_COPIED_OR_REFERENCED
List source files copied or referenced. State which one.

## 6. SELECTED_3_SHOT_SOURCE_MAP
List SHOT_01, SHOT_02, SHOT_03 mapping.

## 7. ASSET_STATUS_TABLE
Columns:
- asset
- status
- reason
- risk

## 8. AUDIO_STATUS
State whether repo-local audio exists.

## 9. USABLE_FOR_NEXT_STEP
YES / PARTIAL / NO

## 10. PROHIBITED_ACTIONS_CONFIRMED
Confirm:
- IMAGE_TASK_CREATED: NO
- VIDEO_TASK_CREATED: NO
- RENDER_STARTED: NO
- COMFYUI_USED: NO
- BLENDER_USED: NO
- PUBLIC_DEPLOY_CREATED: NO
- CANON_APPROVAL_CREATED: NO
- ASSET_LOCK_CREATED: NO

## 11. NEXT_SAFE_TASK
Return exactly one next safe task.

If PASS_SOURCE_PACK_CREATED or PARTIAL_SOURCE_PACK_NEEDS_HUMAN_REVIEW:
FILM-02_CREATE_MIKAGE_FILM_PROOF_01_20S_3_SHOT_SHOTLIST_V1

If BLOCKED:
Return exact blocker.
```

## 13. UPDATE POINTER

Update:

```txt
docs/handoff/00_LATEST_CODEX_HANDOFF.md
```

It must point to this FILM-01 report and the correct next safe task.

## 14. GIT REQUIREMENT

Run:

```txt
git status --short
git add docs/handoff/FILM-01_COLLECT_MIKAGE_FILM_PROOF_01_SOURCE_PACK_V1_REPORT.md
git add docs/handoff/00_LATEST_CODEX_HANDOFF.md
git add film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1
git commit -m "Collect Mikage film proof source pack"
git push
```

If push fails, do not claim success. Report exact blocker.

## 15. FINAL RESPONSE TO USER

Return only:

```txt
RESULT:
REPORT_PATH:
SOURCE_PACK_PATH:
POINTER_UPDATED:
COMMIT_HASH:
PUSH_SUCCEEDED:
USABLE_FOR_NEXT_STEP:
NEXT_SAFE_TASK:
BLOCKERS:
```
