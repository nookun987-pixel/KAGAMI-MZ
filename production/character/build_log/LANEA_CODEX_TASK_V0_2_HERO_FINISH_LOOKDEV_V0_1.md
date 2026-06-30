# LANE A / CODEX TASK BRIEF — MIKAGE V0.2 HERO FINISH LOOKDEV
Soạn bởi Lane B (Cowork) · 2026-06-30 · STATUS: DRAFT chờ BOOS authorize (commit = authorize).
Governed by AGENTS.md "Sixteenth controlled exception" (`MIKAGE_V0_2_HERO_FINISH_LOOKDEV_V0_1`).

Mục tiêu: ĐÁNH THỨC con V0.2 (form đã được operator duyệt) thành hero render PREMIUM bằng lookdev + material + lighting. **FORM IS APPROVED — DO NOT CHANGE GEOMETRY.** Cảm giác "toy/clay" hiện tại = chưa finish material+đèn, không phải hỏng hình.

## TASK
`MIKAGE_V0_2_HERO_FINISH_LOOKDEV_V0_1`

## INPUT
- Source (form đã duyệt): `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_COMPLETION_LOOKDEV_V0_2.blend` (122 objects; hash `C1FEE…EC1B`).
- Reference: `MIKAGE_HERO_LOOKDEV_RECIPE_V1.md`, `docs/mikage_character_visual_spec.md`, `design_system/mikage-cine-color-contract.md`.

## ACTION (LOOKDEV ONLY — không đụng geometry)
1. **Material** theo recipe: helmet/shell = glazed sacred porcelain (`#f2eeea`, SSS mềm, clear coat, craquelure micro-bump rất nhẹ — KHÔNG nhựa phẳng); thân/underlayer = graphite matte tối / black mass; blade = kim loại lạnh.
2. **Lighting**: 1 key Rembrandt trên-trái chếch xuống; rim mảnh tách silhouette; fill ~0 (~2/3 chìm void); fine grain.
3. **World** = `#050508` tuyệt đối.

## RÀNG BUỘC
- **KHÔNG đổi geometry/silhouette/helmet wedge/2 khe/vị trí blade/khối thân.** Material + đèn only. Verify mesh hash V0.2 KHÔNG đổi ở output.
- Violet **chỉ trong 2 khe** — không halo/wash/flood/neon/gold/crimson/màu phụ. Palette lock void `#050508` · porcelain `#f2eeea` · violet `#8F00FF`.
- KHÔNG overwrite V0.2 source. KHÔNG rig/anim/UV (ngoài mức material cần). KHÔNG canon-lock/asset-lock/public-ready. Dọn `.blend1`. KHÔNG push.

## ĐẦU RA (candidate only)
- `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_HERO_FINISH_LOOKDEV_V0_1.blend`
- `production/character/reviews/MIKAGE_HERO_FINISH_LOOKDEV_V0_1_CONTACT_SHEET.png` (front · 3/4 · side · close helmet+slits, full-frame)
- `production/character/reviews/MIKAGE_HERO_FINISH_LOOKDEV_V0_1_PROOF.md` + RESULT block (mesh hash unchanged? material applied? lighting upgraded? violet chỉ trong khe? void bg? `.blend1` cleaned?)

## FALLBACK nếu vẫn "toy/clay" sau finish (KHÔNG đập geometry)
1) hạ fill hơn · 2) tăng tương phản sáng/chìm · 3) porcelain bớt nhựa, thêm chiều sâu · 4) rim mảnh hơn · 5) body mass nặng hơn trong bóng · 6) violet nhỏ, kín. Chỉ xem lại silhouette khi lookdev hết cách.

→ Lane B drift-check vs recipe + SSOT → BOOS duyệt visual. Final visual ruling = operator.
