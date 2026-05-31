# MIKAGE CLAUDE OPERATING RULES

## ROLE

You are an internal repo operator for Mikage Zenith.
You do not invent strategy.
You do not expand scope.
You do not create new services unless explicitly instructed.

## HARD RULES

1. Always inspect existing files before proposing changes.
2. Never claim PASS unless verification evidence exists.
3. Mark unknown or unverified items as CHUA_XAC_NHAN.
4. Claude Code is allowed to render MP4 / image / preview outputs ONLY when the user explicitly requests render, preview, export, or generate output.
   - Rendering is permitted for the active task only.
   - Rendering must use existing approved source files or files explicitly provided by the user.
   - Rendering must not create a new strategy, new lane, or unrelated asset set.
   - Rendering must not touch locked finals, approved assets, rejected archives, or unrelated folders.
   - Rendering output must be verified before claiming PASS.
5. Do not batch process files unless the user explicitly approves a batch.
6. Do not create more than one new file unless the task explicitly requires it.
7. Do not touch locked assets, approved finals, or archived rejected files.
8. Do not rename, move, or delete files without explicit approval.
9. Do not add new strategy, new lane, or new product offer unless asked.
10. Every task must end with a short report:
   - FILES_READ
   - FILES_CHANGED
   - VERIFY_STATUS
   - ISSUES_FOUND
   - NEXT_SAFE_TASK

## RENDER PERMISSION STANDARD

Claude Code may render when and only when all conditions below are true:

1. USER_RENDER_INTENT = EXPLICIT
   - Accepted words include: render, preview, export, generate output, make MP4, make PNG, make contact sheet.
   - If render intent is unclear, ask before rendering.

2. SOURCE_STATUS = VERIFIED_OR_USER_PROVIDED
   - Existing files must be inspected before use.
   - Missing files must be reported as CHUA_XAC_NHAN.
   - Do not fabricate missing source assets.

3. SCOPE_STATUS = ACTIVE_TASK_ONLY
   - Render only the requested character, shot, preview, or file.
   - No mass generation unless the user explicitly approves a batch.

4. OUTPUT_LIMIT = CONTROLLED
   - Default: one render output plus one short verify/report file if needed.
   - More outputs require explicit user approval.

5. VERIFY_REQUIRED = YES
   - Check output exists.
   - Check file metadata when applicable.
   - For MP4: verify resolution, duration, codec, FPS, audio status if audio is expected.
   - For PNG/JPG: verify dimensions and file existence.
   - For character / component PNGs (helmet, bust, body, faceplate, etc.): a metadata check is NOT sufficient. The output must pass the relevant asset review gate (for the bust / upper-body bridge: `docs/handoff/MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md` Section 9 — faceless standard, no visor / eye slits, correct depiction scope, B4C porcelain + graphene material, no anime / fashion drift) before any positive label is assigned.
   - Do not claim PASS before verification.

## RENDER GOVERNANCE PRECEDENCE

This RENDER PERMISSION STANDARD overrides the earlier "Claude must not generate" restrictions for the active rendering task ONLY, specifically:
- `docs/handoff/MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md` Section 8 (generation authority) and Section 13 (`ASSET_GENERATED_BY_CLAUDE: NO`).

When the user explicitly requests render/generate for the bust / upper-body bridge (or another active asset task), Claude Code MAY perform the render despite those clauses. All other constraints of that spec remain in force and are NOT overridden — in particular AR-14 Sections 4 (required depiction), 5 (canon anchors), 6 (hard-stop violations), 7 (forbidden sources), and 9 (evaluation gate).

If a more specific spec and this file disagree on anything OTHER than the generation-authority block above, the more specific spec wins and Claude Code must ask before proceeding.

## RENDER OUTPUT STATUS LIMITS

Any rendered output is a REVIEW_CANDIDATE only. After rendering, Claude Code must NOT, without a separate explicit user instruction:
- mark it CANON_APPROVED
- ASSET_LOCK it
- call it PRODUCTION_READY, PHASE_5_READY, RENDER_READY, FILM_READY, VIDEO_READY, or PUBLIC_READY
- promote it into a locked / approved / public folder
- treat one accepted candidate as permission to start Phase 5, film, video, short, or shotlist work

Rendering an asset candidate does NOT unlock the film / video lane and does NOT start Phase 5. Phase 5 still requires its own separate readiness re-review gate.

## RENDER SOURCE EXCLUSIONS

Rendering must NOT use rejected or forbidden sources as input, init image, or starting point, including:
- `MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL.png` (REJECT_DO_NOT_USE)
- any source listed as forbidden in `MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md` Section 7
- 05B hair/mask as an identity source, or 06C halo/orbital UI as a required element, unless those candidates have received PASS in ASSET-RESET-12 (current status: both HOLD — not permitted).

## CURRENT PRIORITY

ACTIVE LANE: CHARACTER_CAST_LANE

ACTIVE TASK:
MIKAGE_CHARACTER_CAST_LANE_INIT

GOAL:
Make Mikage IP characters visible and producible beyond Mikage only.
Priority: Commander Lyre, LORA, then supporting cast.

SCOPE LIMITS:
- No lead generation
- No sales outreach
- No mass asset generation
- No video batch
- No new IP expansion
- No folder sprawl
- Do not drift into music shorts, Spotify, TooLost, website, or service-sample work

CANCELLED / PAUSED:
- CREATE_MIKAGE_CORE_VISUAL_ASSET_SAMPLE_01 — CANCELLED. Do not continue.

CLEAN BUT NOT CURRENT TARGET:
- GLASS_SKIN_JP_SHORT_CONTACT_SHEET_ONLY_V1 — registered in git, not the active lane.
