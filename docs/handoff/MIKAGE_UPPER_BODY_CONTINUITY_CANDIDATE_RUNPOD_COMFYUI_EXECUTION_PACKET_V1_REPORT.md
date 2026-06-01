# MIKAGE_UPPER_BODY_CONTINUITY_CANDIDATE_RUNPOD_COMFYUI_EXECUTION_PACKET_V1_REPORT

TASK_ID: PHASE5_UPPER_BODY_CANDIDATE_RUNPOD_EXECUTION_PACKET_V1
DATE: 2026-06-01
LANE: CHARACTER_CAST_LANE / ASSET-RESET chain (unchanged)
TYPE: NO-RENDER RunPod/ComfyUI execution packet (operator-run)

## RESULT

Created a ready-to-run RunPod RTX 4090 ComfyUI execution packet for ONE upper-body continuity candidate. It reuses the proven bust-bridge stack (juggernautXL_v8 + ip-adapter_sdxl + clip_vision_g + diffusers_xl_canny_mid; dpmpp_2m/karras, 25 steps, CFG 7), re-pointed so the accepted bust 09A is the primary continuity base, extended to a 768×1152 upper-body crop. Includes pod setup, 4-model download list, approved inputs + exclusions, framing decision (outpaint vs identity-regenerate), verbatim prompts, settings, quick-pass gate, and return-for-scoring flow. No render performed by Claude; operator executes on the pod.

## FILES_READ

- `docs/handoff/ASSET-BUILD-02_BUST_BRIDGE_LOCAL_COMFYUI_EXECUTION_PACKET_V1.md`
- `docs/handoff/ASSET-BUILD-06_EXTERNAL_GPU_API_EXECUTION_PACKET_V2.md` (proven node map + settings)
- `docs/handoff/MIKAGE_UPPER_BODY_CONTINUITY_CANDIDATE_RENDER_REQUEST_SPEC_V1.md`
- `docs/handoff/MIKAGE_PHASE5_UPPER_BODY_CONSISTENCY_PLANNING_V1.md`
- `docs/handoff/MIKAGE_BODY_CONTINUITY_CONSTRAINT_SPEC_V1.md`

## FILES_CHANGED

- CREATED: `docs/handoff/MIKAGE_UPPER_BODY_CONTINUITY_CANDIDATE_RUNPOD_COMFYUI_EXECUTION_PACKET_V1.md`
- CREATED: `docs/handoff/MIKAGE_UPPER_BODY_CONTINUITY_CANDIDATE_RUNPOD_COMFYUI_EXECUTION_PACKET_V1_REPORT.md` (this report)
- MODIFIED: `docs/handoff/00_LATEST_CODEX_HANDOFF.md` (pointer: execution packet ready, awaiting RunPod run)

## VERIFY_STATUS

- Packet + report on disk: PASS
- Settings traced to proven ASSET-BUILD-06 V2 packet (not invented): PASS
- Approved sources + exclusions consistent with AR-14/AR-15/render-request spec: PASS
- Hardware note correct — 1660/6GB insufficient, RTX 4090 required: PASS
- No render performed by Claude (ASSET_GENERATED_BY_CLAUDE = NO): PASS
- Model download URLs: CHUA_XAC_NHAN (not pinned; operator uses same sources as bust render — verify filenames)
- Bust 09A on-disk path: CHUA_XAC_NHAN (nested `09\09`; verify before upload)
- Git push: PENDING (local machine; sandbox git inoperable)

## ISSUES_FOUND

- Framing (bust → upper-body) needs an outpaint or identity-regenerate step — flagged as the one operator choice point (packet §5). Not auto-resolvable on paper.
- Model download URLs not pinned; operator reuses prior sources.
- Git not operable from Cowork sandbox.

## NEXT_SAFE_TASK

Operator rents RunPod RTX 4090, runs this packet to produce ONE upper-body candidate (4 seeds), applies the quick-pass gate, then returns the selected candidate path to Cowork for UB-1…UB-10 + AR-15 §9 + AR-14 §9 scoring. No film/video/short/shotlist opened.

## PROHIBITED ACTIONS CONFIRMED

- RENDER_EXECUTED_BY_CLAUDE: NO
- COMFYUI_RUNTIME_USED_BY_CLAUDE: NO
- BLENDER_USED: NO
- IMAGE_GENERATED_BY_CLAUDE: NO
- VIDEO_GENERATED: NO
- FILM_TASK_CREATED: NO
- SHOTLIST_CREATED: NO
- CANON_APPROVAL_CREATED: NO
- ASSET_LOCK_CREATED: NO
- CANDIDATES_CALLED_PRODUCTION_READY: NO
- BUST_PROMOTED_BEYOND_PHASE4_REFERENCE: NO
- PHASE5_STARTED: NO (internal scope only)
- ASSET_GENERATED_BY_CLAUDE: NO
