# LANE A / CODEX TASK BRIEF — MATERIAL LOOKDEV (bounded, 1 render)
Soạn bởi Lane B · 2026-06-23 · STATUS: DRAFT chờ BOOS authorize.
Pha silhouette (clay) đã đóng ở V0.12 (8/8 điểm drift nắn xong). Task này MỞ material — vẫn KHÔNG đổi hình, KHÔNG motion, chưa bật violet mạnh.
BOOS đặt CURRENT_NEXT_TASK trong `docs/handoff/00_LATEST_CODEX_HANDOFF.md` thì Codex chạy. Mỗi task = 1 render.

## TASK
`MIKAGE_HERO_MOUNT_MATERIAL_EEVEE_V0_13`

## INPUT (khoá, không đổi hình)
- Base blend: `production/character/MIKAGE_HERO_MOUNT_BLADE_HEAD_EEVEE_V0_12.blend` (silhouette đã đóng).
- KHÔNG sửa geometry/silhouette. Chỉ gán material + lighting.

## 3 VẬT LIỆU TÁCH BẠCH (đúng brand)
1. **Porcelain** (vỏ/giáp ngoài, helmet): trắng `#f2eeea`, sáng-mờ, **phản xạ mềm** (soft specular, roughness vừa), không bóng gương, không nhựa.
2. **Graphite** (lót trong, tóc, mantle, chuôi blade): đen/xám tối, **ít phản xạ** (low reflectance, matte).
3. **Kim loại lạnh** (khớp mã, cạnh giáp, slab blade): steel lạnh, **cạnh sắc**, specular hẹp; có thể chớm Z-Blue `#4B5866` **non-emissive** (oxide thép nguội) — KHÔNG cyan sáng, KHÔNG warm.

## LIGHTING
- Key-light đủ sáng (rút kinh nghiệm V0.9 under-exposed) + **rim-light** tách khối khỏi nền void `#050508` + **contact shadow** dưới chân mã.

## RÀNG BUỘC
- Violet **GIỮ mức hiện tại** (2 slit + điểm móng) — violet pass mạnh để VÒNG SAU (V0.14).
- KHÔNG warm color, KHÔNG halo, KHÔNG flood, KHÔNG crimson, KHÔNG gold seams ở task này.
- KHÔNG đổi geometry/pose/rig/motion. KHÔNG canon-lock, KHÔNG PASS/final. Output = CANDIDATE.
- Dọn `.blend1` trước commit; KHÔNG push (operator push).

## ĐẦU RA
- `production/character/MIKAGE_HERO_MOUNT_MATERIAL_EEVEE_V0_13.blend`
- `production/character/reviews/..._V0_13_CONTACT_SHEET.png` (3–4 panel: full-mount + close porcelain/graphite/metal tách bạch; có thể 2 pass nếu cần)
- `production/character/reviews/..._V0_13_PROOF.md` + RESULT block.
→ Lane B drift-check 3 vật liệu vs brand → BOOS duyệt → VIOLET pass (V0.14) → MOTION (V0.15).
