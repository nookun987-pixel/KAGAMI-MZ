# MIKAGE_MASTER_ASSET_INVENTORY_V0_1

Generated: 2026-05-29 (read-only audit)
Scope: All Mikage / Kagami folders accessible on D:\
Mode: READ-ONLY. No file was moved, renamed, deleted, merged, or modified.
Tool authority: agent could only mount subdirectories of D:\ — the D:\ filesystem root itself could not be mounted, so loose files sitting directly at `D:\*` are listed as CHUA_XAC_NHAN_NOT_ACCESSIBLE.

---

## MỤC 0 — BẢN ĐỒ NGUỒN

| # | Path (host) | Loại | Tổng file | Lần sửa gần nhất (folder mtime) | Trạng thái |
|---|---|---|---|---|---|
| 1 | `D:\KAGAMI-MZ` | repo gốc (legacy) | 66,443 | 2026-04-27 | STALE (không thấy commit gần đây trong file list; root .md mới nhất 2026-04-24) |
| 2 | `D:\KAGAMI-MZ_SYNC_PUSH` | repo "sync push" cũ | 0 (root: chỉ thư mục con test, không có file thường) | 2026-05-01 | STALE / NEAR-EMPTY — chỉ chứa `semantic_test_run/`, `state/`, `tests/`, `test_no_fake_pass_jobs/`, `test_stability_*` (đa số là job folder rỗng hoặc test scaffolding) |
| 3 | `D:\KAGAMI-MZ_SYNC_PUSH_V2` | repo đang làm việc (V2) | 3,038 | 2026-05-28 | **ACTIVE** — đây là repo Mikage hiện hành theo `CLAUDE.md` và `docs/handoff/00_LATEST_CODEX_HANDOFF.md` |
| 4 | `D:\MIKAGE ZENITH AUDIO` | kho nhạc + MV production | 3,367 | 2026-05-27 | **ACTIVE** — chứa 23 thư mục track (`00..23`), short, MV asset, report |
| 5 | `D:\mikage_upload` | snapshot upload Q1 2026 | 80 | 2026-03-27 | STALE — gồm canon V2 cũ, các *_final_decision.json / *_job_summary.json từ tháng 3/2026 |
| 6 | `D:\_mikage_tmp` | scratch / render scripts | 18 (root) + nhiều subfolder | 2026-05-19 | STALE-ACTIVE_MIX — có script render Porcelain/Title cards (May 19) nhưng phần lớn là quarantine/log/tmp |
| 7 | `D:\workspace` | model parking + ComfyUI + bản clone phụ | 9,126 | 2026-05-21 | MIXED — chứa `ComfyUI/`, `KAGAMI-MZ/` (clone phụ), `KAGAMI-MZ-main-final/`, `MIKAGE_RUNPOD_COMFYUI_STATIC_CHARACTER_PACK_V1/`, `MODEL_PARKING/` (5 .safetensors) |
| 8 | `D:\public_engine` | publish packages (gần như rỗng) | 0 (root: chỉ 2 thư mục con) | 2026-05-19 | STALE/EMPTY — chỉ có `publish_packages/白瓷夜行/` và `render_outputs/` (không có file trong khung quét bề mặt) |
| 9 | `D:\*` (loose files: `MIKAGE_TRACK_CATALOG_DATABASE_*.csv`, `MIKAGE_MEMORY_CATALOG_*.json`, `MIKAGE_SINGLE_OPERATOR_MEMORY_*.md`, `cleanup_report.json`) | rời ở root | CHUA_XAC_NHAN | CHUA_XAC_NHAN | CHUA_XAC_NHAN_NOT_ACCESSIBLE — tool không cho mount root `D:\`, chỉ subdir. Operator cần mount thư mục cha hoặc cấp truy cập từng file thì mới quét được. Lưu ý: trong V2 đã có bản tương đương: `MIKAGE_TRACK_CATALOG_DATABASE_V1_LOCKED_21.xlsx` (root V2) và `docs/handoff/MIKAGE_TRACK_CATALOG_DATABASE_V1.csv`, `docs/handoff/MIKAGE_SINGLE_OPERATOR_MEMORY.md`. |

ACTIVE = (3) KAGAMI-MZ_SYNC_PUSH_V2, (4) MIKAGE ZENITH AUDIO.
STALE / cần operator quyết = (1) KAGAMI-MZ, (2) KAGAMI-MZ_SYNC_PUSH, (5) mikage_upload, (8) public_engine.
MIXED / cần khoanh vùng = (6) _mikage_tmp, (7) workspace.

---

## MỤC 1 — HÌNH ẢNH NHÂN VẬT & BỐI CẢNH

Tổng số file ảnh (.png/.jpg/.jpeg/.webp) đếm được theo repo:

| Repo | Số ảnh |
|---|---|
| KAGAMI-MZ | 4,830 |
| KAGAMI-MZ_SYNC_PUSH_V2 | 709 |
| MIKAGE ZENITH AUDIO | 2,400 |
| workspace | 1,109 |
| mikage_upload | 0 |
| _mikage_tmp | 0 (root; subfolder chưa quét sâu) |
| KAGAMI-MZ_SYNC_PUSH | 0 |
| public_engine | 0 |

Vì khối lượng quá lớn để liệt kê từng file ở pass này, dưới đây chỉ ghi nhận **cụm ảnh có mục đích rõ ràng** (đã xác minh đường dẫn). Các ảnh khác được ghi nhận theo số đếm cụm và CHUA_XAC_NHAN cho từng tấm.

### 1.A — Cụm ảnh nhân vật Mikage (V2 — đã có cấu trúc canon)

Repo: `D:\KAGAMI-MZ_SYNC_PUSH_V2\character_workflow\`

| File | Loại | Phân loại dùng |
|---|---|---|
| `MIKAGE_TURNAROUND_V2_CURRENT_REFERENCE.png` | turnaround | INTERNAL_ONLY |
| `MIKAGE_CHARACTER_SCALE_LINEUP_V0_1.png` | scale lineup | INTERNAL_ONLY |
| `MIKAGE_CHARACTER_SCALE_LINEUP_V0_2_LORA_PATCH.png` | scale lineup (patch v0.2) | INTERNAL_ONLY |
| `CLEAN_BODY_CANDIDATE__P3A_R4_001_STRONG_CANDIDATE.png` | full-body candidate | DRAFT |
| `REFERENCE_BOARD_ONLY__P3A_R3_001_SPEC_BOARD_STRONG.png` | reference board | INTERNAL_ONLY |
| `model_sheet_candidates/MIKAGE_MODEL_SHEET_CANDIDATES_CONTACT_SHEET.png` | contact sheet | INTERNAL_ONLY |
| `model_sheet_candidates/P3A_R3_001_SPEC_BOARD_STRONG.png` | spec board | INTERNAL_ONLY |
| `model_sheet_v1_1_clean_package/CLEAN_BODY_CANDIDATE__P3A_R4_001_STRONG_CANDIDATE.png` | full-body candidate (dup of root copy) | INTERNAL_ONLY |
| `model_sheet_v1_1_clean_package/MIKAGE_TURNAROUND_V2_CURRENT_REFERENCE.png` | turnaround (dup) | INTERNAL_ONLY |
| `model_sheet_v1_1_clean_package/REFERENCE_BOARD_ONLY__P3A_R3_001_SPEC_BOARD_STRONG.png` | reference board (dup) | INTERNAL_ONLY |
| `mikage_full_body_canon_v1/03_CORE_ASSETS/PRIMARY_V2/a_highly_detailed_ultra_clean_concept_art_chara.png` | primary v2 concept art | DRAFT / CHUA_XAC_NHAN (status do operator) |
| `mikage_full_body_canon_v1/03_CORE_ASSETS/POSE_TEST_01/chiến_binh_máy_trong_bóng_tối.png` | pose test | DRAFT |
| `mikage_full_body_canon_v1/03_CORE_ASSETS/POSE_TEST_03/a_dramatic_high_detail_sci_fi_character_portrait.png` | portrait pose test | DRAFT |
| `mikage_full_body_canon_v1/04_VARIANT_ONLY/POSE_TEST_02/a_dark_studio_character_concept_art_scene_a_full.png` | variant only | DRAFT |
| `mikage_full_body_canon_v1/05_PRESENTATION_ONLY/ChatGPT Image *.png` (8 ảnh, 26–27 May 2026) | presentation only | INTERNAL_ONLY (do tên "PRESENTATION_ONLY") |

Cấu trúc canon (đã thấy thư mục): `00_READ_FIRST / 01_CANON_LOCK / 02_REFERENCE_SHEET / 03_CORE_ASSETS / 04_VARIANT_ONLY / 05_PRESENTATION_ONLY / 99_AUDIT`. Có `01_CANON_LOCK/MIKAGE_CHARACTER_REFERENCE_SHEET_V1_CANON_LOCKED_PACKAGE.zip` (locked package — KHÔNG mở/giải nén).

### 1.B — Cụm ảnh comparison / production actor (V2)

Repo: `D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\`

| File | Loại | Phân loại |
|---|---|---|
| `production_actor/review_previews_v0_2/MIKAGE_PRODUCTION_ACTOR_V0_1_VS_V0_2_COMPARISON.png` | comparison | INTERNAL_ONLY |

### 1.C — Cụm ảnh MV / cover / contact sheet (AUDIO)

Repo: `D:\MIKAGE ZENITH AUDIO\` (2,400 ảnh). Liệt kê mẫu đã verify đường dẫn:

| File | Loại | Phân loại |
|---|---|---|
| `CODEX_AUTO_REPAIR_26_OUTPUTS_CONTACT_SHEET_V1.png` (root) | contact sheet | INTERNAL_ONLY |
| `08. GLASS SKIN/GLASS_SKIN_COVER_TOOLOST_3000.jpg` | cover art (track) | PUBLIC_READY (đã rời sang TooLost theo tên — CHUA_XAC_NHAN do operator) |
| `08. GLASS SKIN/GLASS_SKIN_MAIN_CANVAS_TEST_V1_CONTACT_SHEET.png` | contact sheet | INTERNAL_ONLY |
| `08. GLASS SKIN/GLASS_SKIN_SHORT1_WITH_ENDCARD_CONTACT_SHEET.png` | contact sheet | INTERNAL_ONLY |
| `08. GLASS SKIN/GLASS_SKIN_SHORT2_FINAL_LAST_FRAME_CHECK.png` | frame check | INTERNAL_ONLY |
| `08. GLASS SKIN/GLASS_SKIN_SHORT3_1m52_2m22_WITH_ENDCARD_CONTACT_SHEET.png` | contact sheet | INTERNAL_ONLY |
| `07. THE ROOT ARCHITECT/THE_ROOT_ARCHITECT_TOOLOST_3000x3000.jpg` | cover art | PUBLIC_READY (theo tên TooLost) |
| `07. THE ROOT ARCHITECT/T07_THE_ROOT_ARCHITECT_CANVAS_TEST_V1_CONTACT_SHEET.png` | contact sheet | INTERNAL_ONLY |

> 2,310+ ảnh còn lại trong AUDIO (cover/keyframe/contact sheet trải 23 thư mục track): CHUA_XAC_NHAN (cần pass quét sâu riêng cho từng track).

### 1.D — Ảnh trong KAGAMI-MZ (legacy)

4,830 ảnh. CHUA_XAC_NHAN tổng thể; phần lớn ở các thư mục `artifacts/samples/`, `artifact_sync/<uuid>/`, `calibration_jobs/job_*` — đa số có vẻ là smoke/calibration output. Operator nên quyết: KAGAMI-MZ là "nguồn legacy", phần lớn ảnh ở đó nên coi như INTERNAL_ONLY / DRAFT cho đến khi đối chiếu version với V2.

### 1.E — Ảnh trong workspace

1,109 ảnh ở `D:\workspace\` — phân tán trong `ComfyUI/`, `KAGAMI-MZ/` (clone phụ), `KAGAMI-MZ-main-final/`, `MIKAGE_RUNPOD_COMFYUI_STATIC_CHARACTER_PACK_V1/`. CHUA_XAC_NHAN; nhiều khả năng là output runtime / model pack.

---

## MỤC 2 — 3D / RIG

### V2 — `D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\`

| File | Trạng thái (theo tên) | Dùng cho |
|---|---|---|
| `production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_1.blend` | candidate v0.1 | production actor base |
| `production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend` | candidate v0.2 (newer) | production actor base |
| `production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_FIRST_DIAGNOSTIC_CINEMATIC_PROOF_SHOT_V0_1.blend` | diagnostic | cinematic proof shot |
| `production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_FIRST_MOTION_TEST_FROM_APPROVED_GATE_V0_1.blend` | motion test | gate-approved derivative |
| `production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend` | rig | from locked blockout v0.2 |
| `proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_BLOCKOUT.blend` | proxy / blockout | proxy actor base |
| `proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_RIG_PREP_BLOCKOUT.blend` | rig prep | proxy rig prep |
| `proxy_actor/motion_tests/MIKAGE_PROXY_POSE_MOTION_TEST_FROM_ANCHOR_V1.blend` | motion test | proxy motion test |

Tổng: 8 .blend, KHÔNG có .obj/.glb/.fbx trong V2. Lock-status thực tế: CHUA_XAC_NHAN (chỉ suy từ tên file, chưa mở Blender để xác minh).

### workspace — 24 file 3D (.blend/.obj/.glb/.fbx)

Đã đếm 24 file 3D trong `D:\workspace\` (không liệt kê từng tên ở pass này — cần quét sâu). CHUA_XAC_NHAN: phần nào là clone của V2, phần nào là experiment riêng.

### Các repo khác

KAGAMI-MZ: 0 file 3D bề mặt. MIKAGE ZENITH AUDIO: 0. mikage_upload: 0. _mikage_tmp: 0. KAGAMI-MZ_SYNC_PUSH: 0. public_engine: 0.

---

## MỤC 3 — CANON & LORE (chữ)

### V2 — file canon ở root + docs

| File | Chủ đề | Trạng thái (theo tên) |
|---|---|---|
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\MIKAGE_ZENITH_CANON_V2.md` (18,495 B, 2026-04-28) | Canon thế giới Mikage Zenith v2 | NEWEST trong các bản trùng tên (xem MỤC 6) |
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\MIKAGE_WORLD_CORE.json` (11,572 B, 2026-04-28) | World core machine-readable | active |
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\MIKAGE_WORLD_CORE_READABLE.md` | World core readable | active |
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\MIKAGE_WORLD_CORE_RECOVERY_REPORT.md` | recovery report | reference |
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\MIKAGE_STRUCTURED_RULES.json` | rules | active |
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\MIKAGE_DOCTRINE_DIFF_LOG.md` | doctrine diff | reference |
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\MIKAGE_PASS_FAIL_CHECKLIST.md` | checklist | reference |
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\MIKAGE_PUBLIC_ENGINE_OPERATING_STANDARD_V1.md` | public engine standard | active (May 18) |
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\MIKAGE_MODULE_SPEC_FROM_RESEARCH.md` | module spec | reference |
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\mikage_color_canon.json` | color canon | active |
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\canon_imports\2026-05-28\MIKAGE — WORLD BIBLE DATABASE SYSTEM.md` | world bible import (May 28) | DRAFT / NEW |
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\canon_imports\2026-05-28\MIKAGE_CANON_RESEARCH_COMICS_WORLD_BUILDING (1).md` | world building research | DRAFT / NEW |
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\pipeline\01_CANON_ASSET_REGISTRY.md` | asset registry | reference |
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\reports\MIKAGE_CANON_CONFLICT_RESOLUTION_V1.md` | conflict resolution | reference |
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\reports\MIKAGE_SILHOUETTE_CANON_V1_LOCK_SPEC.md` | silhouette canon lock spec | reference |
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\character_workflow\mikage_full_body_canon_v1\01_CANON_LOCK\MIKAGE_CHARACTER_REFERENCE_SHEET_V1_CANON_LOCKED.md` | character ref sheet | tên gợi LOCKED — CHUA_XAC_NHAN trạng thái thực |
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\character_workflow\mikage_full_body_canon_v1\01_CANON_LOCK\MIKAGE_CHARACTER_REFERENCE_SHEET_V1_CANON_LOCKED.json` | character ref sheet (machine) | tên gợi LOCKED |

### V2 — brief / bible / spec nhân vật

| File | Nhân vật | Trạng thái (theo tên) |
|---|---|---|
| `character_workflow/MIKAGE_CHARACTER_PRODUCTION_BIBLE_V0_1.md` | Mikage | DRAFT v0.1 |
| `character_workflow/COMMANDER_LYRE_CHARACTER_BRIEF_V0_1.md` | Commander Lyre | DRAFT v0.1 |
| `character_workflow/COMMANDER_LYRE_VISUAL_SPEC_CLEAN_V0_1.md` | Commander Lyre | DRAFT v0.1 |
| `character_workflow/LORA_ENTITY_RECORD_V0_1.md` | LORA | DRAFT v0.1 |
| `character_workflow/LORA_VISUAL_BRIEF_V0_1.md` | LORA | DRAFT v0.1 |
| `character_workflow/LORA_VISUAL_SPEC_CLEAN_V0_1.md` | LORA | DRAFT v0.1 |
| `character_workflow/MIKAGE_CHARACTER_SCALE_LINEUP_V0_1.md` | cast | DRAFT v0.1 |
| `character_workflow/MIKAGE_CHARACTER_SCALE_LINEUP_V0_2_LORA_PATCH.md` | cast (+LORA) | DRAFT v0.2 patch |
| `character_workflow/HEIGHT_SCALE_PROVISIONAL.md` | cast | provisional |
| `character_workflow/PACKAGE_MANIFEST.md` | meta | reference |
| `character_workflow/READ_FIRST.md` | meta | reference |
| `character_workflow/TURNAROUND_V2_OPERATOR_APPROVAL.md` | Mikage turnaround | tên gợi OPERATOR_APPROVAL — CHUA_XAC_NHAN |

### KAGAMI-MZ (legacy)

- `D:\KAGAMI-MZ\MIKAGE_MASTER_STATUS.md` (Apr 24, 18,432 B) — không có ở V2.
- `D:\KAGAMI-MZ\mikage_master_operating_blueprint.md` (Apr 23, 11,715 B) — không có ở V2.
- `D:\KAGAMI-MZ\CLEANUP_PHASE1_REPORT.md` (Apr 19) — không có ở V2.
- `D:\KAGAMI-MZ\docs\architecture\MIKAGE_ZENITH_CANON_V2.md` (17,879 B, 2026-03-24) — bản canon V2 **cũ hơn** bản V2-repo.
- JSON: `MIKAGE_CONTEXT_CORE.json`, `MIKAGE_FRAME_LOGIC.json`, `MIKAGE_IDENTITY_LOCK.json` ở root KAGAMI-MZ — không có ở V2.

### mikage_upload (Mar 2026 snapshot)

- `mikage_upload/MIKAGE_ZENITH_CANON_V2.md` (17,879 B, 2026-03-24) — trùng size với bản KAGAMI-MZ/docs/architecture.
- `mikage_upload/CANON_V2.md` (4,874 B, 2026-03-24) — bản canon ngắn, cũ.
- `mikage_upload/PASS_FAIL_CHECKLIST.md` (4,874 B, 2026-03-24) — cũ.
- `mikage_upload/CANON_SEARCH_REPORT.txt` (524 B, 2026-03-27).

### AUDIO

Không có canon "thế giới Mikage" trong `D:\MIKAGE ZENITH AUDIO\`; thay vào đó là canon **âm thanh / video** từng track (xem MỤC 5).

---

## MỤC 4 — TÀI SẢN THEO NHÂN VẬT

| Nhân vật | Canon text | Hình | 3D/Rig | Brief | MỨC SẴN SÀNG |
|---|---|---|---|---|---|
| Mikage | có (CANON_V2 + WORLD_CORE + Character Reference Sheet "LOCKED" + Production Bible v0.1) | có (turnaround V2, lineup, model sheet candidates, full_body_canon_v1, comparison V0_1 vs V0_2) | có (8 .blend: production_actor + proxy_actor + rig derivatives) | có | **HAS_ASSETS_NOT_PUBLIC** (chưa xác minh "public-ready" — không có bản signed-off public ngoài turnaround) |
| Commander Lyre | có (brief v0.1 + visual spec clean v0.1) | CHUA_XAC_NHAN (chỉ thấy trong lineup `MIKAGE_CHARACTER_SCALE_LINEUP_V0_2_LORA_PATCH.png` — chưa thấy turnaround/portrait riêng) | KHÔNG | có | **TEXT_ONLY (+ xuất hiện trong lineup chung)** |
| LORA | có (entity record v0.1 + visual brief v0.1 + visual spec clean v0.1) | có gián tiếp (`MIKAGE_CHARACTER_SCALE_LINEUP_V0_2_LORA_PATCH.png`) | KHÔNG | có | **TEXT_ONLY (+ xuất hiện trong lineup chung)** |
| ARCHON-IX / LYRA-0 | CHUA_XAC_NHAN — không thấy brief riêng trong các thư mục đã quét bề mặt | CHUA_XAC_NHAN | KHÔNG | KHÔNG | **NOTHING (theo pass quét bề mặt)** |
| Dr. Aris | CHUA_XAC_NHAN — không thấy brief riêng | CHUA_XAC_NHAN | KHÔNG | KHÔNG | **NOTHING (theo pass quét bề mặt)** |
| Tai Vane | CHUA_XAC_NHAN — không thấy brief riêng | CHUA_XAC_NHAN | KHÔNG | KHÔNG | **NOTHING (theo pass quét bề mặt)** |

Ghi chú: pass này grep theo các từ khóa `lyre|lora|archon|aris|tai_vane|lyra`. Nếu nhân vật được tham chiếu trong canon nội dung (chứ không phải tên file), pass này SẼ KHÔNG bắt được — cần pass nội dung (grep nội dung) ở bước sau theo lệnh operator.

---

## MỤC 5 — NHẠC

### Nơi chứa track

- `D:\MIKAGE ZENITH AUDIO\` — kho chính, 23 thư mục track đánh số (`00. COMPANNY LIMITED` … `23. AFTER THE SIGNNAL`) + `DON'T LOOK BACK` (không số).
- Trong AUDIO đếm được 83 file `.mp3/.wav/.flac/.m4a` và 304 file `.mp4/.mov` (master / short / canvas test).
- Mẫu xác minh (`08. GLASS SKIN`): có `GLASS SKIN.wav`, `GLASS_SKIN_COVER_TOOLOST_3000.jpg`, `GLASS_SKIN_CLEAN_LYRIC_TOOLOST.txt`, `GLASS_SKIN_AI_RIGHTS_PROOF_PACK_UPLOAD_V2.pdf`, các short MP4 + verify report.
- Mẫu xác minh (`07. THE ROOT ARCHITECT`): có `THE ROOT ARCHITECT.wav`, `THE_ROOT_ARCHITECT_TOOLOST_3000x3000.jpg`, `THE_ROOT_ARCHITECT_CLEAN_LYRIC_TOOLOST.txt`, `THE_ROOT_ARCHITECT_AI_RIGHTS_PROOF_PACK_UPLOAD.pdf`, MV asset audit + canvas test.

### Catalog (CSV/JSON/XLSX)

| File | Vị trí | Ghi chú |
|---|---|---|
| `MIKAGE_TRACK_CATALOG_DATABASE_V1_LOCKED_21.xlsx` (11,599 B, 2026-05-16) | `D:\KAGAMI-MZ_SYNC_PUSH_V2\` (root) | bản LOCKED 21 (theo tên) trong V2 |
| `MIKAGE_TRACK_CATALOG_DATABASE_V1.csv` | `D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff\` | bản CSV trong handoff |
| `MIKAGE_30_TRACK_SONIC_AUDIT_V1.csv` (9,012 B, 2026-05-24) | `D:\MIKAGE ZENITH AUDIO\` (root) | audit sonic 30 track |
| `MIKAGE_30_TRACK_SONIC_AUDIT_V1.md` (15,883 B, 2026-05-24) | `D:\MIKAGE ZENITH AUDIO\` (root) | audit sonic 30 track (readable) |
| `MIKAGE_SHORT_VIDEO_ACTIVE_FUTURE_SHORTS_PRIORITY_V1.csv` | `D:\MIKAGE ZENITH AUDIO\` (root) | priority shorts |
| `MIKAGE_SHORT_VIDEO_FAIL_AUDIT_REPORT_V1.csv` | `D:\MIKAGE ZENITH AUDIO\` (root) | fail audit |
| `MIKAGE_SHORT_VIDEO_REPAIR_TRIAGE_REPORT_V1.csv` | `D:\MIKAGE ZENITH AUDIO\` (root) | repair triage |
| `D:\MIKAGE_TRACK_CATALOG_DATABASE_*.csv` (loose ở D:\ root) | CHUA_XAC_NHAN_NOT_ACCESSIBLE | tool không mount được root D:\ — operator cần xác nhận có còn tồn tại không |

### Memory / single operator

| File | Vị trí | Ghi chú |
|---|---|---|
| `MIKAGE_SINGLE_OPERATOR_MEMORY.md` | `D:\KAGAMI-MZ_SYNC_PUSH_V2\docs\handoff\` | bản trong V2 |
| `D:\MIKAGE_SINGLE_OPERATOR_MEMORY_*.md` (loose) | CHUA_XAC_NHAN_NOT_ACCESSIBLE | có thể trùng tên với bản trong V2 — operator cần đối chiếu |
| `D:\MIKAGE_MEMORY_CATALOG_*.json` (loose) | CHUA_XAC_NHAN_NOT_ACCESSIBLE | không thấy bản tương đương trong V2 |
| `D:\cleanup_report.json` (loose) | CHUA_XAC_NHAN_NOT_ACCESSIBLE | — |

Tổng số track theo cấu trúc thư mục AUDIO: **24 thư mục track** (`00..23` + `DON'T LOOK BACK`). Tổng số track theo catalog V1 LOCKED 21: tên file gợi 21 track. Có lệch số → cần operator đối chiếu (xem MỤC 6).

---

## MỤC 6 — TRÙNG LẶP & MÂU THUẪN

### 6.1 — `MIKAGE_ZENITH_CANON_V2.md` xuất hiện ở 3 nơi

| Path | Size | mtime | Đánh giá |
|---|---|---|---|
| `D:\KAGAMI-MZ_SYNC_PUSH_V2\MIKAGE_ZENITH_CANON_V2.md` | 18,495 B | 2026-04-28 04:34 | **NEWEST + LARGEST** — bản trong repo active |
| `D:\KAGAMI-MZ\docs\architecture\MIKAGE_ZENITH_CANON_V2.md` | 17,879 B | 2026-03-24 21:12 | older, smaller (legacy) |
| `D:\mikage_upload\MIKAGE_ZENITH_CANON_V2.md` | 17,879 B | 2026-03-24 21:12 | older, smaller (cùng bản với KAGAMI-MZ/docs/architecture theo size) |

Khả năng cao bản V2-repo là "evolved" từ bản Mar-24. CHUA_XAC_NHAN diff nội dung (chưa diff vì sẽ phải đọc file lớn — operator quyết có làm pass diff hay không).

### 6.2 — `MIKAGE_WORLD_CORE.json`

- `D:\KAGAMI-MZ_SYNC_PUSH_V2\MIKAGE_WORLD_CORE.json` (11,572 B, 2026-04-28) — có.
- KAGAMI-MZ: không thấy ở root (không có trong `ls *.json`). Có thể nằm sâu — CHUA_XAC_NHAN ở pass này.

### 6.3 — Khác biệt file ở root V2 vs root KAGAMI-MZ

KAGAMI-MZ root có nhưng V2 root KHÔNG có:

- `CLEANUP_PHASE1_REPORT.md` (Apr 19)
- `MIKAGE_MASTER_STATUS.md` (Apr 24)
- `mikage_master_operating_blueprint.md` (Apr 23)

V2 root có nhưng KAGAMI-MZ root KHÔNG có: ~70 file `.md` mới (theo diff đã chạy) gồm `MIKAGE_ZENITH_CANON_V2.md`, `MIKAGE_WORLD_CORE*`, `P0..P8` reports, `RAG_*` reports, `REAL_VERTEX_*`, `MIKAGE_PUBLIC_ENGINE_OPERATING_STANDARD_V1.md`, `MIKAGE_DOCTRINE_DIFF_LOG.md`, v.v. → V2 thực sự là superset hiện hành.

### 6.4 — Ảnh nhân vật trùng trong cùng V2

- `MIKAGE_TURNAROUND_V2_CURRENT_REFERENCE.png` xuất hiện ở `character_workflow/` (root) **và** `character_workflow/model_sheet_v1_1_clean_package/`.
- `CLEAN_BODY_CANDIDATE__P3A_R4_001_STRONG_CANDIDATE.png` xuất hiện ở `character_workflow/` **và** `character_workflow/model_sheet_v1_1_clean_package/`.
- `REFERENCE_BOARD_ONLY__P3A_R3_001_SPEC_BOARD_STRONG.png` xuất hiện ở `character_workflow/` **và** `character_workflow/model_sheet_v1_1_clean_package/`.

→ "clean_package" có thể là bản đóng gói. Cần operator xác nhận đâu là canonical path, KHÔNG tự gộp.

### 6.5 — Workspace có bản clone KAGAMI-MZ

`D:\workspace\` chứa các thư mục `KAGAMI-MZ/`, `KAGAMI-MZ-main-final/`, `MIKAGE_RUNPOD_COMFYUI_STATIC_CHARACTER_PACK_V1/` — có khả năng chồng lấn với `D:\KAGAMI-MZ\` và `D:\KAGAMI-MZ_SYNC_PUSH_V2\` ở mức file. CHUA_XAC_NHAN tỉ lệ trùng (cần checksum pass).

### 6.6 — Registry / manifest tham chiếu file không có trên đĩa

- `character_workflow/mikage_full_body_canon_v1/99_AUDIT/MIKAGE_CHARACTER_CANON_SYNC_FILE_MANIFEST_V1.json` tồn tại — nội dung CHUA_XAC_NHAN (chưa mở ở pass này; nếu mở sẽ vi phạm "không sửa" nhưng READ là OK — chỉ chưa cần ở pass quét tổng).
- `MIKAGE_TRACK_CATALOG_DATABASE_V1_LOCKED_21.xlsx` tên gợi 21 track; AUDIO có 24 thư mục track. Lệch 3 → cần operator đối chiếu (có thể track 22/23/`DON'T LOOK BACK` chưa vào catalog, hoặc catalog tính khác).

### 6.7 — File có vẻ là rác / tạm

- `D:\_mikage_tmp\comfyui_startup_stderr.log` (17,805 B, 2026-05-01) + `comfyui_startup_stdout.log` (0 B, 2026-05-01) — log runtime cũ.
- `D:\_mikage_tmp\aider_quarantine_20260430/` — quarantine folder.
- `D:\KAGAMI-MZ_SYNC_PUSH\semantic_test_run/`, `test_no_fake_pass_jobs/`, `test_stability_*/` — empty/test scaffolding cũ.
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\artifact_sync\<uuid>/` (nhiều UUID) — sync artifact, có thể cleanup được nhưng KHÔNG tự ý.

### 6.8 — KAGAMI-MZ_SYNC_PUSH gần như rỗng

`D:\KAGAMI-MZ_SYNC_PUSH\` chỉ chứa 7 thư mục test, không có file thường ở mọi cấp đã quét. Có thể là repo cũ bị xoá nội dung nhưng còn thư mục.

### 6.9 — public_engine gần như rỗng

`D:\public_engine\` chỉ có `publish_packages/白瓷夜行/` và `render_outputs/`, 0 file thường ở pass này. Tên `白瓷夜行` (Bạch Sứ Dạ Hành / Porcelain Night Walk) trùng nhánh "Porcelain" trong `_mikage_tmp/render_porcelain_*` scripts — có thể là dữ liệu publish của bài "Porcelain Ascension" (track 06 trong AUDIO).

---

## MỤC 7 — KẾT LUẬN & ĐỀ XUẤT (không thực thi)

### 7.1 — Tài sản Mikage có thể public NGAY (theo tên file, không tự đánh giá thẩm mỹ)

- **Track masters đã có TooLost package**: `08. GLASS SKIN`, `07. THE ROOT ARCHITECT` (cover 3000x3000, clean lyric, AI rights proof PDF — đủ pack upload). Các track khác trong `D:\MIKAGE ZENITH AUDIO\` cần kiểm tra từng thư mục để xác nhận có pack TooLost đầy đủ chưa. **Public-ready theo tên, CHUA_XAC_NHAN approval thực tế của operator.**
- **Mikage turnaround V2**: `D:\KAGAMI-MZ_SYNC_PUSH_V2\character_workflow\MIKAGE_TURNAROUND_V2_CURRENT_REFERENCE.png` — tên gợi "current reference", có file `TURNAROUND_V2_OPERATOR_APPROVAL.md` đi kèm. CHUA_XAC_NHAN trạng thái approval.
- **Mikage Character Reference Sheet V1 CANON LOCKED package**: `character_workflow/mikage_full_body_canon_v1/01_CANON_LOCK/MIKAGE_CHARACTER_REFERENCE_SHEET_V1_CANON_LOCKED_PACKAGE.zip` — tên gợi locked package, có thể đã sẵn sàng. CHUA_XAC_NHAN nội dung.

### 7.2 — Thiếu gì quan trọng nhất

- **Visuals riêng cho Commander Lyre và LORA**: chỉ có brief/spec text + xuất hiện chung trong scale lineup; chưa có turnaround / portrait riêng (theo grep bề mặt). Đây là lane đang active theo `CLAUDE.md` (CHARACTER_CAST_LANE → priority Lyre, LORA).
- **Brief / hình cho ARCHON-IX / LYRA-0, Dr. Aris, Tai Vane**: không tìm thấy ở pass bề mặt.
- **Catalog đối chiếu giữa 21-track (catalog) vs 24-folder (AUDIO)**: chưa khớp.
- **Truy cập loose D:\ files** (track catalog CSV, memory catalog JSON, single-operator memory, cleanup_report): chưa quét được.

### 7.3 — Đề xuất "nguồn sự thật" duy nhất (chỉ đề xuất, KHÔNG gộp)

- **Repo code + canon + character workflow**: nên là `D:\KAGAMI-MZ_SYNC_PUSH_V2`. Đây đã là repo có CLAUDE.md active, có canon V2 mới nhất, có character_workflow đầy đủ.
- **Kho nhạc + MV**: nên là `D:\MIKAGE ZENITH AUDIO`. Cấu trúc 23+1 thư mục track đang là kho âm thanh + video duy nhất có dữ liệu thật.
- `D:\KAGAMI-MZ` (legacy) và `D:\mikage_upload` (Q1 snapshot): nên giữ **read-only** làm tham chiếu lịch sử; KHÔNG xoá đến khi đã đối chiếu chéo các file unique ở MỤC 6.3.
- `D:\KAGAMI-MZ_SYNC_PUSH` và `D:\public_engine`: gần như rỗng, ứng cử viên archive sau khi operator xác nhận đã ra hết dữ liệu.

### 7.4 — 3 việc dọn dẹp ưu tiên (chỉ liệt kê, operator quyết)

1. **Đối chiếu chéo 3 bản `MIKAGE_ZENITH_CANON_V2.md`** (V2 vs KAGAMI-MZ/docs/architecture vs mikage_upload) → quyết bản nào là canonical; archive 2 bản còn lại.
2. **Lấp visual cho Commander Lyre + LORA** (theo CHARACTER_CAST_LANE đang active): tạo turnaround / portrait riêng, không gộp vào lineup chung.
3. **Quét sâu `D:\workspace\KAGAMI-MZ\` + `D:\workspace\KAGAMI-MZ-main-final\`** xem có file nào không có trong `D:\KAGAMI-MZ_SYNC_PUSH_V2\` (unique) trước khi quyết archive workspace.

---

## NHẬT KÝ QUÉT

- Pass scan này chỉ đếm file theo extension + spot-check thư mục con bề mặt. KHÔNG đọc nội dung file (trừ tên + size + mtime).
- KHÔNG file nào bị move/rename/delete/sửa.
- File `D:\KAGAMI-MZ_SYNC_PUSH_V2\MIKAGE_MASTER_ASSET_INVENTORY_V0_1.md` (file này) là file duy nhất được tạo ở pass này.
- CHUA_XAC_NHAN được ghi rõ ở mọi mục có suy đoán.

— END OF INVENTORY V0.1 —
