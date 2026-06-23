# LANE A / CODEX TASK BRIEF — BLADE GRIP + STEED HEAD READ (bounded, 1 render)
Soạn bởi Lane B · 2026-06-23 · STATUS: DRAFT chờ BOOS authorize.
Nối tiếp rider V0.11 (đã chấp nhận candidate). Task này đóng nốt 2 điểm hở silhouette cuối (#8 blade, #1 đọc đầu mã). KHÔNG material sâu, KHÔNG motion.
BOOS đặt CURRENT_NEXT_TASK trong `docs/handoff/00_LATEST_CODEX_HANDOFF.md` thì Codex chạy. Mỗi task = 1 render.

## TASK
`MIKAGE_HERO_MOUNT_BLADE_HEAD_EEVEE_V0_12`

## INPUT (khoá, không redesign)
- Base blend: `production/character/MIKAGE_HERO_MOUNT_RIDER_SILHOUETTE_EEVEE_V0_11.blend`.
- Ref blade/head: `MIKAGE_SOLO_BW_V0_4` (rider+blade) + `MIKAGE_STEED_SKELETON_BW_V0_5` (đầu mã). DRAFT, không SSOT.
- Drift nguồn: `keyart_candidates/MIKAGE_HERO_MOUNT_RIDER_V0_11_DRIFT_CHECK.md` (mục #8) + `..._STEED_V0_10_DRIFT_CHECK.md` (mục #1).

## SỬA ĐÚNG 2 ĐIỂM
8. **Zenith Blade grip**: gom slab về **gauntlet nắm chuôi** (đáy tựa holster/docking), bớt cảm giác "khối hộp to" ở hông. Dời blade để KHÔNG chĩa ngang che vùng đầu mã.
1. **Đọc đầu mã**: tinh chỉnh đầu equine wedge cho **đọc rõ** (mõm/hàm tách khỏi chassis) — hình đã có từ V0.10, lần này chỉ làm rõ + thêm góc chụp.

## RÀNG BUỘC
- Vẫn **grayscale clay**, chưa material sâu.
- Violet **giữ nguyên** (2 slit rider + điểm móng) — KHÔNG thêm violet.
- KHÔNG đụng rider armor/tóc/mantle V0.11, KHÔNG đổi steed body V0.10 (chỉ làm rõ đầu), KHÔNG rig/motion, KHÔNG warm/halo/flood.
- KHÔNG canon-lock, KHÔNG PASS/final. Output = CANDIDATE.
- Dọn `.blend1` trước commit; KHÔNG push (operator push).

## ĐẦU RA
- `production/character/MIKAGE_HERO_MOUNT_BLADE_HEAD_EEVEE_V0_12.blend`
- `production/character/reviews/..._V0_12_CONTACT_SHEET.png` (4 panel: full-mount + blade-grip close + steed-head close isolated + 3-4 tổng; grayscale)
- `production/character/reviews/..._V0_12_PROOF.md` + RESULT block.
→ Lane B drift-check #8 + #1 → BOOS duyệt → đóng pha silhouette, mở **MATERIAL LOOKDEV**.
