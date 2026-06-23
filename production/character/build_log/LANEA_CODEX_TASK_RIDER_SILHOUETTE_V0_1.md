# LANE A / CODEX TASK BRIEF — RIDER SILHOUETTE (bounded, 1 render)
Soạn bởi Lane B · 2026-06-23 · STATUS: DRAFT chờ BOOS authorize.
Nối tiếp steed V0.10 (đã chấp nhận candidate). Task này CHỈ sửa rider, KHÔNG đụng steed/blade-position, KHÔNG material sâu, KHÔNG motion.
BOOS đặt CURRENT_NEXT_TASK trong `docs/handoff/00_LATEST_CODEX_HANDOFF.md` thì Codex mới chạy. Mỗi task = 1 render.

## TASK
`MIKAGE_HERO_MOUNT_RIDER_SILHOUETTE_EEVEE_V0_11`

## INPUT (khoá, không redesign)
- Base blend: `production/character/MIKAGE_HERO_MOUNT_STEED_SHAPE_CORRECTION_EEVEE_V0_10.blend` (giữ steed V0.10 + rider V0.8).
- Ref rider: `MIKAGE_SOLO_BW_V0_4` (DRAFT art-direction, không SSOT).
- Drift nguồn: `keyart_candidates/MIKAGE_HERO_MOUNT_EEVEE_V0_9_DRIFT_CHECK.md` mục 4,5,6.

## SỬA ĐÚNG 3 ĐIỂM, CHỈ RIDER
4. **Armor breakdown**: sắc hoá pauldron góc cạnh + cuirass + lót graphite + **đốt bụng phân đoạn** (bớt cảm giác thân hộp trơn).
5. **Tóc**: thêm **khối tóc đen dài sau lưng** (graphite, đọc rõ thành mảng tóc, không phải block vuông).
6. **Mantle**: thêm **mantle V-taper** phụ sau vai.
- Helmet giữ nguyên (egg + đúng 2 slit). Blade giữ nguyên vị trí (task riêng sau).

## RÀNG BUỘC
- Vẫn **grayscale clay**, chưa material sâu.
- Violet **giữ nguyên mức hiện tại** (2 slit rider + điểm móng) — KHÔNG thêm violet.
- KHÔNG đụng steed V0.10, KHÔNG đổi pose/rig/motion, KHÔNG đổi màu/warm/halo/flood.
- KHÔNG canon-lock, KHÔNG PASS/final. Output = CANDIDATE.
- Dọn `.blend1` trước commit; KHÔNG push (operator push).

## ĐẦU RA
- `production/character/MIKAGE_HERO_MOUNT_RIDER_SILHOUETTE_EEVEE_V0_11.blend`
- `production/character/reviews/..._V0_11_CONTACT_SHEET.png` (3–4 panel: full-mount context + rider close upper-body + rider back-3/4 để thấy tóc+mantle; grayscale)
- `production/character/reviews/..._V0_11_PROOF.md` + RESULT block.
→ Lane B drift-check mục 4,5,6 → BOOS duyệt mới mở task blade-grip / material.
