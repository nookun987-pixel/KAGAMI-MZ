# LANE A / CODEX TASK BRIEF — MIKAGE BODY LOOKDEV / MATERIAL TUNE V0.11
Soạn: Lane B (Cowork) · 2026-07-01 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception #28.
Governed by AGENTS.md "Twenty-eighth controlled exception" (MIKAGE_BODY_LOOKDEV_MATTE_V0_11).

> Body GEOMETRY đã CHỐT ở V0.10 (operator PASS). Vấn đề còn lại là "latex/bóng" — nghiêng về MATERIAL.
> Task này = LOOKDEV THÂN ONLY: đẩy cloak về **graphite matte / vải nặng**, khử specular. GIỮ NGUYÊN geometry V0.10.
> KHÔNG đổi hình. KHÔNG đổi material helmet/blade/slit. KHÔNG đổi camera/đèn. Xong DỪNG cho owner review.

## SOURCE OF TRUTH
- Master: production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png (sha256 b86f68…06429).
- Recipe/contract: production/character/MIKAGE_HERO_LOOKDEV_RECIPE_V1.md · design_system/mikage-cine-color-contract.md.

## INPUT (base — CHỈ cái này)
- production/character/production_actor/rig_derivatives/MIKAGE_BODY_CLOAK_STRUCTURE_V0_10.blend
  Báo BASE_SELECTED + BODY_HASH_BEFORE (geometry phải KHÔNG đổi ở output).
- CẤM: RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 / V0.8 / V0.9; không import scene.

## LOCKED (KHÔNG đổi — hash/giá trị giữ nguyên)
- TOÀN BỘ geometry (helmet + thân) — BODY_HASH unchanged.
- Material helmet (glazed porcelain) · blade (cold metal) · 2 khe violet.
- Camera/framing · world · **đèn/lighting setup**.
Chỉ **material của THÂN/cloak** được chỉnh.

## MATERIAL TUNE — thân/cloak ONLY
1. **Giảm specular/roughness cao** → bề mặt **matte graphite lì**, đọc như **vải nặng**, KHÔNG bóng cao su/nhựa.
2. Base thân = graphite tối (deep matte), trong palette (không warm, không neon).
3. Giữ nhịp fold V0.10 đọc được bằng shading mềm — không dùng vân/normal map giả để chế thêm nếp.
4. Không thêm hoa văn, decal, sheen kim loại, hay logo.

## SUCCESS TEST
Thân đọc **áo choàng vải nặng, mờ/lì**, specular tiết chế (không latex/nhựa); silhouette + fold + hem V0.10 GIỮ;
helmet/blade/slit material + camera + đèn Y HỆT V0.10 (hash/nhìn không drift); palette lock; không robot.

## RÀNG BUỘC
- BODY_HASH (geometry) KHÔNG đổi — xác nhận. Chỉ node material thân đổi; báo material name + thay đổi chính.
- Palette lock void `#050508` / porcelain `#f2eeea` / violet `#8F00FF`. Violet chỉ 2 khe.
- Dọn .blend1. KHÔNG overwrite base. KHÔNG push/lock/canon.

## OUTPUT (candidate)
- production/character/production_actor/rig_derivatives/MIKAGE_BODY_LOOKDEV_MATTE_V0_11.blend
- production/character/reviews/MIKAGE_BODY_LOOKDEV_MATTE_V0_11_CONTACT_SHEET.png (front · 3/4 · strict side · so vs V0.10)
- production/character/reviews/MIKAGE_BODY_LOOKDEV_MATTE_V0_11_PROOF.md + RESULT block
- Gate CONTACT_SHEET_ONLY: _tmp/mikage_body_lookdev_matte_v0_11_gate/ chỉ chứa contact_sheet.png + contact_sheet_review_report.md.

## FAIL (per operator)
- Nếu specular quá gắt, cloak đọc như nhựa/cao su, HOẶC lỡ đụng geometry / helmet / blade / camera / đèn →
  dừng, PASS_FAIL=FAIL, BLOCKER=BODY_MATERIAL_DRIFT, liệt kê; revert về V0.10 (KHÔNG quay lại V0.9).

→ Stop sau proof. Lane B drift-check (thân đọc vải mờ? specular tiết chế? geometry+lock giữ?) → BOOS ruling.
