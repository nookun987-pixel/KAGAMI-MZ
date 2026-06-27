# 00 — START HERE · MIKAGE ZENITH SINGLE SOURCE OF TRUTH (INDEX)

**Status:** `ACTIVE INDEX` · created 2026-06-27 · maintainer: operator (BOOS BỚP)
**What this is:** the ONE file to open first. It does not contain canon — it **points** to the
single authoritative file for every topic, so no session has to re-improvise or re-ask.
**What this is NOT:** not a canon lock, not an approval, not a replacement for the locked canon
files it points to. It changes nothing it references.

> If a topic below has a conflict between two files, the file named here under "AUTHORITATIVE"
> wins. Everything in §LEGACY is historical — do not treat it as current truth.

---

## 1. READ ORDER (every new session)
1. `CLAUDE.md` (repo root) — durable rules + lane discipline.
2. **this file** (`00_START_HERE_SOURCE_OF_TRUTH.md`) — where everything lives.
3. `docs/handoff/MIKAGE_OPERATOR_MEMORY_COMPACT_READ_FIRST_V2.md` — operator memory (identity, business, music/short rules, links).
4. `docs/handoff/00_LATEST_CODEX_HANDOFF.md` — the CURRENT task (`CURRENT_NEXT_TASK`) only.
5. `docs/MIKAGE_SESSION_CHECKLIST.md` + `docs/MIKAGE_SESSION_LESSONS.md` — process + mistakes already learned.

That is the whole context load. Do **not** ask the operator to re-explain anything that lives in these files.

---

## 2. AUTHORITATIVE FILE PER TOPIC (the map)

| Topic | AUTHORITATIVE source | Notes |
|---|---|---|
| Durable rules / lane discipline | `CLAUDE.md` (root) | Wins on rules. Lane A = system/rig · Lane B = music/public. |
| Current task | `docs/handoff/00_LATEST_CODEX_HANDOFF.md` → `CURRENT_NEXT_TASK` | Do only this. Transient status lives here, not in CLAUDE.md. |
| Operator memory (identity/business/process) | `docs/handoff/MIKAGE_OPERATOR_MEMORY_COMPACT_READ_FIRST_V2.md` | Company, MST, socials, CTA rule, short workflow, music rules. |
| **Narrative / lore canon** | `docs/handoff/MIKAGE_NARRATIVE_CORE_LOCK_V0_1.md` | LOCKED 2026-06-13/14. Entropy Economy, the wound, mirrors (Lyre/ARCHON-IX/LORA), kintsugi. **Build all public lore from here.** |
| Lore support docs (outlines) | `docs/handoff/` → `MIKAGE_CHARACTER_SYSTEM_V0_1_OUTLINE`, `MIKAGE_WORLD_BACKGROUND_WITHOUT_GEOGRAPHY_V0_1_OUTLINE`, `MIKAGE_TRANSMISSION_SYSTEM_V0_1_OUTLINE`, `MIKAGE_IP_CORE_V0_1_OUTLINE`, `MIKAGE_FULL_7_STEP_CHARACTER_WORLD_PLAN_V0_1`, `MIKAGE_VOICE_PROFILE_LOCK_V0_1`, `MIKAGE_LORE_DRIP_SCHEDULE_V0_1`, `MIKAGE_PUBLIC_LORE_CADENCE_OVERLAY_V0_1_OUTLINE` | Outlines/locks that expand the narrative core. Check here before writing any lore. |
| Character VISUAL canon (concept) | `docs/character/CHARACTER_CONCEPT_MIKAGE_v0.1.md` + `docs/mikage_character_visual_spec.md` | NOTE: v0.1 helmet text ("no slit") is **superseded** by brand canon (two slits). |
| Character RIG pipeline (Blender) | `production/character/` (`build_log/`, `reviews/`, `keyart_candidates/`) | Versioned chain V0.x→V2. Lane A. Codex runs Blender, not the assistant. |
| Build-log film standard | `production/character/build_log/00_BUILD_LOG_STANDARD.md` | One build-log system. Extend, never reinvent. |
| Brand / UI / public-page canon | `mikage-zenith-design` skill + CLAUDE.md "Two-layer canon" | Void `#050508` · porcelain `#f2eeea` · violet `#8F00FF` (signal only). Cinzel/Shippori/Space Mono. Wins for all public/interface work. |
| Cine / film color contract | `design_system/mikage-cine-color-contract.md` | Violet `#8F00FF`, Z-Blue `#4B5866`, Kintsugi gold `#C39A52`. Film/MV layer only — does NOT drive brand UI. |
| Release list + LIVE/PRE-SAVE status | `docs/handoff/MIKAGE_RELEASE_REGISTRY.md` | Re-export from TooLost. CTA: `Listen now` (live) / `Pre-save` (unreleased), never mixed. |
| Spotify Canvas spec | `docs/handoff/spotify_canvas/MIKAGE_SPOTIFY_CANVAS_TASK_FORMAT_STANDARD_V1.md` | 1080×1920 · H.264 · 30fps · 6–8s. Hard visual bans in CLAUDE.md. |
| Short / hook video standard | external audio root: `MIKAGE_SHORT_HOOK_SYSTEM/00_STANDARD/MIKAGE_SHORT_STANDARD.md` | 1080×1920, 30fps, AAC ≥317k (use 448k for quiet tracks), 3s endcard. |
| Agent governance layer | `docs/handoff/MIKAGE_AGENT_GOVERNANCE_LAYER_V1.md` | Read before any mutation task. |
| Hard gate (Codex tasks) | `.mikage/tasks/active_task.yaml` + `.mikage/tools/validate_task.py` / `verify_output.py` | Must PASS before/after a Codex task. |
| Public engine standard | `MIKAGE_PUBLIC_ENGINE_OPERATING_STANDARD_V1.md` | Location UNCONFIRMED in this repo — may live in `D:\public_engine`. Confirm. |
| Fanpage character + lore AD brief | `docs/character/MIKAGE_CHARACTER_LORE_AND_FANPAGE_AD_BRIEF_V0_1.md` | DRAFT. **Must be reconciled with the narrative-core lock above before publishing.** |

---

## 3. LOCAL FOLDER TRUTH (from CLAUDE.md)
- `D:\KAGAMI-MZ_SYNC_PUSH_V2` = active working repo (this).
- `D:\KAGAMI-MZ` = original repo, HOLD only, not main.
- `D:\MIKAGE ZENITH AUDIO` = external audio / short-hook root (unstructured). Do not modify unless explicitly targeted.
- `D:\public_engine` = separate public-engine folder.
- `D:\workspace` = experiments only.

---

## 4. LEGACY / PARKED — NOT CURRENT TRUTH (do not read as authoritative)

These describe an **older automated image-generation runtime** ("MIKAGE hub + modules + lanes",
Drive-queue / Colab / Vertex / RAG / LoRA / ComfyUI / RunPod). They are **not** the current
studio-production lanes and several mislabel the live docs. Treat as historical until the
operator confirms archive. Detailed list + recommended action: see
`docs/MIKAGE_REPO_AUDIT_AND_CLEANUP_REPORT_V0_1.md`.

- `docs/ai_handoff/` (whole pack: `SOURCE_OF_TRUTH.md`, `SYSTEM_MAP.md`, `ACTIVE_FILES_INDEX.md`, …)
  — describes the old hub runtime; its `SOURCE_OF_TRUTH.md` wrongly calls `docs/handoff` "legacy".
  **The opposite is true for current work.**
- Root status/lock/report files: `P0_*`, `P7_*`, `P8_*`, `RAG_*`, `REAL_VERTEX_*`, `VERTEX_*`,
  `SYSTEM_*`, `ARCHITECTURE_*`, `IMAGE_*`, `VM_*`, `MODEL_*`, `STRICT_IMAGE_LOOP_SPEC.md`, etc.
- Runtime code dirs (old stack): `MIKAGE/`, `control_plane/`, `control_core/`, `execution/`,
  `evaluation/`, `critic/`, `memory/`, `runtime/`, `deploy/`, `lanes/`, `archive_legacy/`.

> NONE of the above is deleted or moved by this index. Archiving is an operator decision.

---

## 5. THE ONE RULE THAT KEEPS THIS CLEAN
Before building anything: find the topic in §2, open the AUTHORITATIVE file, extend it.
Never start a parallel doc/folder/name for an output type that already has one.
Mark unknowns `UNCONFIRMED`; never canon-lock, asset-lock, or claim PASS without operator approval.

*Index only. Points to canon; never overrides it. Update this map when an authoritative file moves.*
