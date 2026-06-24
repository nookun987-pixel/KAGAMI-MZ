# LANE A / CODEX TASK BRIEF — ANTI-TOY MATERIAL MICRO-PASS (bounded, 1 render)
Soạn bởi Lane B · 2026-06-24 · **STATUS: AUTHORIZED — BOOS duyệt 2026-06-24 (dispatch qua Lane B). Codex chạy đúng task này, 1 render.**
Nối tiếp V0.14 (violet ĐẠT, đã chấp nhận phần signal). Drift-check Lane B: bề mặt porcelain còn đọc như **nhựa/clay sáng (model-kit)** — albedo blowout + đèn phẳng. Task này CHỈ sửa "vẻ đồ chơi". KHÔNG đổi hình, KHÔNG motion, KHÔNG đụng violet (đã đạt).

## TASK
`MIKAGE_HERO_MOUNT_ANTITOY_EEVEE_V0_14B`

## INPUT (khoá)
- Base blend: `production/character/MIKAGE_HERO_MOUNT_VIOLET_GRAIN_EEVEE_V0_14.blend`.
- KHÔNG đổi geometry/pose/silhouette/rig. KHÔNG đổi vị trí/độ mạnh violet (giữ nguyên slit/core/1 seam).

## LÀM 3 ĐIỂM (mục tiêu: hết "đồ chơi", ra "vật thể")
1. **Đèn như vật thể, không phải mannequin studio**: 1 key có hướng + fill mềm + rim lạnh để tạo khối; giảm blowout (hạ exposure/cường độ key) để porcelain không cháy trắng; thêm **contact shadow** dưới chân/vó (đừng để nhân vật "trôi"). Nền giữ tối/void-ish, KHÔNG nền xám phẳng sáng.
2. **Phá bề mặt nhựa**: tăng **fine grain** rõ hơn (đang quá mịn), thêm **biến thiên roughness** + **chớm hao mòn/ám bụi ở khe/cạnh** (subtle, ở cavity & edge), porcelain = matte có chút sheen — KHÔNG bóng nhựa, KHÔNG glossy.
3. **Giữ palette canon**: porcelain `#f2eeea` / void `#050508` / cold-steel Z-Blue `#4b5866` / violet `#8F00FF` (signal). **KHÔNG đổi hex porcelain** — chỉ chỉnh ánh sáng + shading + grain để value đọc đúng. KHÔNG warm/crimson/gold/flood.

## RÀNG BUỘC
- KHÔNG đổi geometry/pose/violet. KHÔNG thêm/bớt mesh.
- KHÔNG canon-lock, KHÔNG PASS/final. Output = CANDIDATE.
- Dọn `.blend1` trước commit; KHÔNG push.

## ĐẦU RA
- `production/character/MIKAGE_HERO_MOUNT_ANTITOY_EEVEE_V0_14B.blend`
- `production/character/reviews/..._V0_14B_CONTACT_SHEET.png` (4 panel: full-mount + rider close helmet/slit + 1 panel soi grain/edge-wear + **1 hero-crop dọc trên nền tối = ứng viên reveal**)
- `production/character/reviews/..._V0_14B_PROOF.md` + RESULT block.
→ Lane B drift-check "hết đồ chơi" + grain đọc được + đèn có khối → BOOS duyệt → REVEAL ảnh tĩnh (Lane B crop+caption) → rồi MOTION V0.15.
