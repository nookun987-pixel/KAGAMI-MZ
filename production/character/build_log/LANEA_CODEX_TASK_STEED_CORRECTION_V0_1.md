# LANE A / CODEX TASK BRIEF — STEED SHAPE-CORRECTION (bounded, 1 render)
Soạn bởi Lane B · 2026-06-23 · STATUS: DRAFT chờ BOOS authorize.
Nối tiếp `LANEA_CODEX_HANDOFF_IP_TO_SCREEN_V0_1.md`. Base hiện tại = EEVEE **V0.9** (đã có rider + motion). Task này CHỈ sửa khối mã, KHÔNG đụng rider, KHÔNG material sâu, KHÔNG motion.
BOOS đặt CURRENT_NEXT_TASK trong `docs/handoff/00_LATEST_CODEX_HANDOFF.md` thì Codex mới chạy. Mỗi task = 1 render.

## TASK
`MIKAGE_HERO_MOUNT_STEED_SHAPE_CORRECTION_EEVEE_V0_10`

## INPUT (khoá, không redesign)
- Base blend: `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_9_MOTION.blend` (hoặc bản static gần nhất nếu sạch hơn cho still — Codex chọn, ghi rõ trong proof).
- Reference shape mã: `MIKAGE_STEED_SKELETON_BW_V0_5` (DRAFT art-direction, không SSOT).
- Drift-check nguồn: `keyart_candidates/MIKAGE_HERO_MOUNT_EEVEE_V0_9_DRIFT_CHECK.md` (mục 1 & 2).

## SỬA ĐÚNG 2 ĐIỂM (chỉ khối mã)
1. **Đầu** = equine wedge: trán → mõm → hàm, không còn khối hộp; khe cảm biến nằm trong đầu (giữ tinh thần helmet, KHÔNG mặt người/mắt).
2. **Thân** = chassis liền có **spine cong**, + 2 khối nhô **withers (vai)** và **croup (mông)**, + **keel** bụng. Bỏ cảm giác hộp phẳng.

## RÀNG BUỘC
- Vẫn **grayscale clay**, chưa material sâu.
- Violet **giữ nguyên mức V0.9** (chỉ 2 slit rider + điểm móng) — KHÔNG thêm violet ở task này.
- KHÔNG đụng rider (armor/tóc/mantle/blade) — để task riêng sau.
- KHÔNG rig/animation/locomotion mới. KHÔNG đổi màu/warm/halo/flood.
- KHÔNG canon-lock, KHÔNG PASS/final/production-ready. Output = CANDIDATE.
- Dọn `.blend1` trước commit; KHÔNG push (operator push).

## ĐẦU RA
- `production/character/MIKAGE_HERO_MOUNT_STEED_SHAPE_CORRECTION_EEVEE_V0_10.blend`
- `production/character/reviews/..._V0_10_CONTACT_SHEET.png` (3 view: side / 3-4 / front; grayscale)
- `production/character/reviews/..._V0_10_PROOF.md` + RESULT block.
→ Lane B kéo về drift-check mục 1&2, báo BOOS. BOOS duyệt mới mở task rider.
