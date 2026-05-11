# FILM-01B_IMPORT_COMFYUI_CANON_ASSETS_TO_FILM_SOURCE_PACK_V1_TASK

## 1. TASK

FILM-01B_IMPORT_COMFYUI_CANON_ASSETS_TO_FILM_SOURCE_PACK_V1

## 2. WHY THIS TASK EXISTS

FILM-01 collected a source pack only from the GitHub repo and missed the stronger local canon assets stored under the ComfyUI Mikage canon workspace.

The user identified that the current source pack is weak because it ignored the actual image work already produced in:

```txt
D:\workspace\ComfyUI\MIKAGE_CANON
```

This task corrects that gap.

## 3. ROLE

You are the local Codex worker. Your job is to inspect the local ComfyUI Mikage canon workspace, select stronger existing Mikage film proof source candidates, copy them into the film source pack, update the source pack manifest, update the 3-shot source map, update the handoff pointer, commit, and push.

Do not ask the user for clarification if the answer can be inspected from local files.

## 4. PRIMARY OBJECTIVE

Replace or supplement the weak FILM-01 visual candidates with stronger existing Mikage canon/source candidates from the ComfyUI workspace.

Target remains conservative:

```txt
MIKAGE_FILM_PROOF_01
20s 3-shot motion proof
source pack correction only
```

Do not produce video. Do not render. Do not generate images. Do not use ComfyUI runtime. Do not use Blender.

## 5. CURRENT ACTIVE LANE

```txt
MIKAGE SUPERPOWER SYSTEM / runtime skeleton / coordination system
```

Film sub-lane:

```txt
MIKAGE_FILM_PROOF_01 / source pack correction from existing ComfyUI canon assets
```

## 6. REQUIRED FIRST READS

Read these before editing:

1. `docs/handoff/00_LATEST_CODEX_HANDOFF.md`
2. `docs/handoff/FILM-01_COLLECT_MIKAGE_FILM_PROOF_01_SOURCE_PACK_V1_REPORT.md`
3. `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/SOURCE_PACK_MANIFEST.md`
4. `film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/SELECTED_3_SHOT_SOURCE_MAP.md`
5. `docs/handoff/MIKAGE_GITHUB_HANDOFF_BRIDGE_RULE_V0.md`
6. `.mikage_context`
7. `NEXT_TASK.md`

## 7. LOCAL COMFYUI SOURCE ROOT TO INSPECT

Inspect this local path:

```txt
D:\workspace\ComfyUI\MIKAGE_CANON
```

If this path does not exist, return BLOCKED with exact missing path.

## 8. PRIORITY SEARCH TARGETS

Search for existing files likely to be stronger than the current FILM-01 candidates.

Prioritize filenames and folders containing:

```txt
UNIFIED_KEY_VISUAL
KEY_VISUAL
AUDIO_SHORT_VISUAL_CANON
PUBLIC_WEBSITE_HERO
PUBLIC_YOUTUBE
PUBLIC_DECK_TITLE
HELMET_SOURCE
FACEPLATE
HALO
ORBITAL_UI
ZENITH_BLADE
COMP
PASS
LOCKED
CANDIDATE
```

Specifically check for filenames visible in the user's screenshot if present:

```txt
02_UNIFIED_KEY_VISUAL_V4_LOCKED.png
MIKAGE_PUBLIC_WEBSITE_HERO_16X9_NATIVE_SAFE_V1.png
MIKAGE_PUBLIC_YOUTUBE_COMMUNITY_16X9_NATIVE_SAFE_V1.png
MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_0001.png
MIKAGE_AUDIO_SHORT_VISUAL_CANON_V4_LOCKED.png
MIKAGE_AUDIO_SHORT_VISUAL_CANON_V1_RETRY_0001.png
MIKAGE_COMP_05A_HAIR_MASK_PORTRAIT_REVIEW_CANDIDATE.png
MIKAGE_COMP_05B_HAIR_MASK_PORTRAIT_REVIEW_CANDIDATE.png
MIKAGE_COMP_06C_ORBITAL_UI_LOW_CLUTTER_REVIEW_CANDIDATE.png
MIKAGE_COMP_06D_ORBITAL_UI_LOW_CLUTTER_ALT_REVIEW_CANDIDATE.png
MIKAGE_COMP_08A_HELMET_BUST_PURPLE_ALT_PASS_TECHNICAL.png
MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL.png
MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png
MIKAGE_COMP_02A_SENSOR_SLIT_CLOSEUP_PASS.png
MIKAGE_COMP_07A_ZENITH_BLADE_BASE_DETAIL_REVIEW_CANDIDATE.png
```

## 9. SELECTION RULES

Select exactly 3 stronger source candidates for the 20s proof:

```txt
SHOT_01_SIGNAL_VOID_OR_SYSTEM_WAKE
SHOT_02_MIKAGE_PRESENCE
SHOT_03_TITLE_OR_ICONIC_HERO
```

Preferred selection logic:

- Use a locked or public-safe key visual for SHOT_02 or SHOT_03 if found.
- Use orbital UI / halo / system visual for SHOT_01 if found.
- Use helmet/faceplate close-up only if it is clearly marked PASS, LOCKED, or public-safe.
- Do not use weak placeholder blocks from `post_anchor_images/base_anchor.png` unless no stronger alternative exists.
- Do not use abstract texture-only images unless specifically useful for SHOT_01 background and clearly labeled as candidate.

Every selected item must still be labeled honestly:

```txt
APPROVED_FOR_FILM_PROOF_SOURCE
CANDIDATE_REQUIRES_HUMAN_REVIEW
ARCHIVE_ONLY_DO_NOT_USE_DIRECTLY
REJECTED_DO_NOT_USE
MISSING
```

Do not claim approval unless a nearby file/report/filename clearly supports it.

## 10. REQUIRED SOURCE PACK UPDATE

Update this folder:

```txt
film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1
```

Create this subfolder:

```txt
film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/comfyui_canon_candidates
```

Copy selected stronger files into it. Preserve readable names and append status labels.

Update:

```txt
film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/SOURCE_PACK_MANIFEST.md
film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/SELECTED_3_SHOT_SOURCE_MAP.md
film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1/README.md
```

The updated selected map must prefer the stronger ComfyUI canon candidates over the weak original FILM-01 candidates where appropriate.

## 11. AUDIO RULE

Do not add audio unless repo-local or local rights-cleared audio is explicitly found and safe.

If not found, keep:

```txt
AUDIO_STATUS: MISSING_REPO_LOCAL_AUDIO
FIRST_PROOF_AUDIO_DECISION: SILENT_PROOF_OR_EXTERNAL_AUDIO_PENDING
```

## 12. DO NOT

- Do not render.
- Do not start ComfyUI.
- Do not use Blender.
- Do not generate images.
- Do not generate video.
- Do not modify locked source assets.
- Do not create public deployment.
- Do not create canon approval.
- Do not create asset lock.
- Do not copy huge folders wholesale.
- Do not continue failed image/render/3D routes.

## 13. REQUIRED REPORT

Create:

```txt
docs/handoff/FILM-01B_IMPORT_COMFYUI_CANON_ASSETS_TO_FILM_SOURCE_PACK_V1_REPORT.md
```

The report must include:

```md
# FILM-01B_IMPORT_COMFYUI_CANON_ASSETS_TO_FILM_SOURCE_PACK_V1_REPORT

## 1. RESULT
PASS_SOURCE_PACK_STRENGTHENED / PARTIAL_NEEDS_HUMAN_REVIEW / BLOCKED

## 2. FILES_READ
List files actually read.

## 3. LOCAL_AREAS_INSPECTED
List local ComfyUI folders inspected.

## 4. STRONGER_ASSETS_FOUND
List stronger candidate assets found from ComfyUI canon.

## 5. FILES_COPIED
List copied files and destinations.

## 6. UPDATED_3_SHOT_SOURCE_MAP
List SHOT_01, SHOT_02, SHOT_03 with selected source, confidence, and review requirement.

## 7. OLD_FILM_01_CANDIDATE_STATUS
State whether original FILM-01 weak candidates are replaced, retained as fallback, or moved to archive-only.

## 8. AUDIO_STATUS
State audio status.

## 9. USABLE_FOR_FILM_02
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

If usable:
FILM-02_CREATE_MIKAGE_FILM_PROOF_01_20S_3_SHOT_SHOTLIST_V1

If blocked:
Return exact blocker.
```

## 14. UPDATE POINTER

Update:

```txt
docs/handoff/00_LATEST_CODEX_HANDOFF.md
```

It must point to this FILM-01B report and the correct next safe task.

## 15. GIT REQUIREMENT

Run:

```txt
git status --short
git add docs/handoff/FILM-01B_IMPORT_COMFYUI_CANON_ASSETS_TO_FILM_SOURCE_PACK_V1_REPORT.md
git add docs/handoff/00_LATEST_CODEX_HANDOFF.md
git add film_proofs/MIKAGE_FILM_PROOF_01/source_pack_v1
git commit -m "Import ComfyUI canon assets into Mikage film source pack"
git push
```

If push fails, do not claim success. Report exact blocker.

## 16. FINAL RESPONSE TO USER

Return only:

```txt
RESULT:
REPORT_PATH:
SOURCE_PACK_PATH:
COMFYUI_SOURCE_ROOT_INSPECTED:
POINTER_UPDATED:
COMMIT_HASH:
PUSH_SUCCEEDED:
USABLE_FOR_FILM_02:
NEXT_SAFE_TASK:
BLOCKERS:
```
