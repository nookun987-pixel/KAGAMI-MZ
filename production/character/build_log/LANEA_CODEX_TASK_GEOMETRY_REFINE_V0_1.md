# LANE A / CODEX TASK BRIEF — GEOMETRY REFINE (bounded, 1 render)
Soạn bởi Lane B · 2026-06-24 · **STATUS: AUTHORIZED — BOOS duyệt 2026-06-24 (dispatch qua Lane B). Codex chạy đúng task này, 1 render.**
Drift-check Lane B (V0.14B): material đã chạm trần — phần "đồ chơi/model-kit" còn lại là HÌNH KHỐI (mảng vuông, cạnh 90°, helmet hơi hộp). Task này nâng HÌNH, KHÔNG đổi material/violet/pose.

## TASK
`MIKAGE_HERO_MOUNT_GEOMETRY_REFINE_EEVEE_V0_16`

## INPUT (khoá)
- Base blend: `production/character/MIKAGE_HERO_MOUNT_ANTITOY_EEVEE_V0_14B.blend`.
- GIỮ nguyên: silhouette tổng, tỉ lệ, pose, bố cục rider+steed+blade, material slots, violet users.

## LÀM 2 ĐIỂM (de-toy bằng hình, tiết chế)
1. **Bevel / bo cạnh toàn cục (rider)**: thêm chamfer NHỎ ở các cạnh 90° của giáp porcelain + blade (bevel width nhỏ, 2–3 segment) để đọc như sứ chế tác, không phải khối raw. KHÔNG làm tròn mất chất góc cạnh — chỉ "mềm cạnh".
2. **Helmet gọn lại**: bớt "hộp" — đưa khối helmet về ovoid sạch hơn theo key-art (vẫn faceless, **đúng 2 sensor slit**, giữ graphene underlayer). KHÔNG thêm chi tiết mặt/mắt.

## RÀNG BUỘC (HARD)
- KHÔNG đổi tỉ lệ/pose/silhouette tổng, KHÔNG dời bố cục. Bevel nhỏ, không phình khối.
- KHÔNG đổi material/hex/violet (slit/core/1 seam giữ nguyên). KHÔNG warm/flood.
- Helmet: vẫn faceless, đúng 2 slit — KHÔNG thêm mặt/mắt/miệng.
- KHÔNG canon-lock, KHÔNG PASS/final. Output = CANDIDATE.
- Dọn `.blend1` trước commit; KHÔNG push.

## ĐẦU RA
- `production/character/MIKAGE_HERO_MOUNT_GEOMETRY_REFINE_EEVEE_V0_16.blend`
- `production/character/reviews/..._V0_16_CONTACT_SHEET.png` (4 panel: full-mount + helmet close (soi bevel+ovoid) + 1 panel cạnh giáp before/after + 1 hero-crop dọc nền tối)
- `production/character/reviews/..._V0_16_PROOF.md` + RESULT (mesh count before/after, bevel applied, violet users unchanged).
→ Lane B drift-check: hết model-kit chưa, silhouette/2-slit còn nguyên, violet/material không đổi → BOOS duyệt → reveal still "hero final" hoặc re-render motion trên hình mới.

## PARKED (không làm trong task này)
- Steed equine-head + khớp chân thật (pass riêng sau).
- Ghép scene + world monolith.
