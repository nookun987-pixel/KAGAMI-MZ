# LANE A / CODEX HANDOFF — IP TO SCREEN (3D / Blender-Eevee)
Soạn bởi Lane B · 2026-06-23 · STATUS: DRAFT cho BOOS duyệt.
Pipeline đã chốt = **Blender/Eevee 3D** (không fal/i2v đợt này).
Lane B soạn brief — BOOS duyệt & đặt CURRENT_NEXT_TASK trong `docs/handoff/00_LATEST_CODEX_HANDOFF.md`.
Codex KHÔNG render cho tới khi BOOS authorize đúng task. Mỗi task = 1 render, không chạy cả loạt.

---

## 0. RÀNG BUỘC CỨNG (không vi phạm)
- Reference KHOÁ, KHÔNG redesign: Mikage **V0.4** silhouette (`MIKAGE_SOLO_*_V0_4`), Cơ giáp mã **V0.5** shape (`MIKAGE_STEED_SKELETON_BW_V0_5`), Hero Mount **V0.2** = placement guide (`MIKAGE_HERO_MOUNT_V0_2`), World **V0.1** (`MIKAGE_WORLD_MONOLITH_*_V0_1`).
- Helmet: vô diện, **đúng 2 sensor slit**, KHÔNG mặt người/mắt. Không hood, không obi (ruling 22/06).
- Palette LOCK: void `#050508` · porcelain `#f2eeea` · violet `#8F00FF`. **Violet = signal** (slit/core/seam), không phải fill/wash. Z-Blue `#4B5866` non-emissive. Kintsugi gold seams only.
- Grayscale material test TRƯỚC, bật violet SAU khi khối khớp.
- KHÔNG canon-lock, KHÔNG gọi final/PASS/production-ready. Mọi output = CANDIDATE.
- Canvas tech spec (motion): 1080×1920 · H.264/yuv420p · 30fps · ~6–8s · no audio · breathing zoom 100→104→100%.
- **ĐÃ CÓ: `MIKAGE_HERO_MOUNT_EEVEE_V0_1`** (3D blockout hero+steed, clay+violet, render hôm qua — pipeline governance→Blender→output ĐÃ CHẠY). Tiếp tục SỬA trên base này, KHÔNG dựng lại từ 0, KHÔNG đụng rig `production_actor` cũ.
- Blocker tồn từ hôm qua (BOOS xử nhanh): xoá `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_1.blend1` (Blender auto-backup, vô hại) → `git status --porcelain=v1` → stage đúng 3 output đã duyệt (.blend + contact sheet + proof) → commit, KHÔNG push. Nên thêm `*.blend1`/`*.blend2` vào `.gitignore` để khỏi vướng lần sau.

## 1. THỨ TỰ (mỗi mảnh = 1 chuỗi gate)
A. Mikage hero (solo) → B. Cơ giáp mã → C. Hero mount (rider+steed) → D. World/monolith → (sau) ghép scene.

## 2. MỖI MẢNH ĐI 4 BƯỚC (gate giữa từng bước; Lane B drift-check + BOOS duyệt mới qua bước sau)
1. **Shape-correction 3D** (sửa blockout về đúng silhouette khoá) → contact sheet stills.
2. **Grayscale material lookdev** (3 vật liệu tách bạch: porcelain sáng-mờ phản xạ mềm / graphite tối ít phản / kim loại lạnh cạnh sắc; contact shadow; rim-light) → stills.
3. **Violet signal pass** (slit + core + điểm nhấn, đúng mức tiết chế) → stills.
4. **Motion** (Canvas spec: breathing zoom + light-sweep chậm) → mp4 1080×1920.

## 3. SHAPE-CORRECTION CHECKLIST — đã có sẵn từ drift-check (dùng nguyên)
Nguồn: `keyart_candidates/MIKAGE_HERO_MOUNT_EEVEE_V0_1_DRIFT_CHECK.md`.
**Cơ giáp mã (B):** đầu equine wedge (không hộp) · chassis liền + spine cong + 2 khối nhô (withers+croup) + keel bụng · 4 chân khớp gối/hock+piston, nhịp so le, móng to+bóng nén.
**Rider (A trong C):** giáp pauldron trắng góc cạnh + giáp ngực + lót graphite + đốt bụng · khối tóc đen dài sau lưng · mantle V-taper phụ sau vai · helmet egg + 2 slit (thêm facet nhẹ, giữ 2 slit).
**Zenith Blade:** slab cầm bằng gauntlet, đáy tựa docking/holster, KHÔNG trôi tách thân.

## 4. ĐẦU RA & REVIEW
- Mỗi bước: lưu vào `production/character/renders/` + `_PROOF.md` ở `production/character/reviews/`.
- Lane B kéo output, viết drift-check vs ref khoá, báo BOOS. BOOS duyệt mới mở bước kế.
- Đóng mỗi task bằng RESULT block (CREATED/MODIFIED/POINTER_UPDATED/COMMIT_HASH/PUSH_SUCCEEDED/NEXT_SAFE_TASK/BLOCKERS).

## 5. TASK ĐẦU TIÊN (bounded — chỉ 1 render) — TIẾP TỪ EEVEE_V0_1
Bước 0 (BOOS): duyệt dọn `.blend1` + commit 3 output đã có (xem §0).
`MIKAGE_HERO_MOUNT_SHAPE_CORRECTION_EEVEE_V0_2` —
SỬA blockout EEVEE_V0_1 theo drift-check §3 (đầu equine wedge, spine cong + withers/croup + keel, chân khớp+piston+stride+móng to; rider armor breakdown + tóc khối + mantle; blade gắn gauntlet+holster). Vẫn grayscale clay, chưa material sâu, violet giữ mức hiện tại. Render contact sheet + proof cho Lane B drift-check.
→ Chờ BOOS authorize render task này.

## 6. SONG SONG (Lane B, không gate)
Khi Codex chạy A, Lane B chuẩn bị: shotlist/keyframe direction cho từng mảnh, build-log EP04 (material) khung sẵn, QC drift mỗi vòng. (Stylized motion tầng 1 đang TẠM GÁC theo lệnh BOOS.)
