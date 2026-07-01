# LANE A / CODEX TASK BRIEF — MIKAGE STANDING HERO POLISH V0.13
Soạn: Lane B (Cowork) · 2026-07-01 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception #30.
Governed by AGENTS.md "Thirtieth controlled exception" (MIKAGE_STANDING_HERO_POLISH_V0_13).

> V0.12 standing candidate PASS. 3 cờ polish operator nêu: (1) blade đọc tách rời, (2) thân tối tan vào void,
> (3) key hơi phẳng. Task này = HERO POLISH: chỉ **CAMERA + ĐÈN** cho ra money-shot đẹp hẳn.
> KHÔNG đổi geometry. KHÔNG đổi material. KHÔNG đổi transform mesh (kể cả blade). CANDIDATE. Xong DỪNG.

## SOURCE OF TRUTH
- Master: production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png (sha256 b86f68…06429).
- Recipe: production/character/MIKAGE_HERO_LOOKDEV_RECIPE_V1.md · design_system/mikage-cine-color-contract.md.

## INPUT (base — CHỈ cái này)
- production/character/production_actor/rig_derivatives/MIKAGE_STANDING_CHARACTER_CANDIDATE_V0_12.blend
  Báo BASE_SELECTED + BODY_HASH_BEFORE + BODY_HASH_AFTER (phải KHÔNG đổi).
- CẤM: bản cũ hơn / RIDER / HERO-MOUNT / STEED / FIGURE_V0.4; không import scene.

## LOCKED (KHÔNG đổi)
- TOÀN BỘ mesh geometry (đầu + thân + blade) — BODY_HASH / mesh-state hash unchanged.
- TOÀN BỘ material (helmet porcelain · thân matte graphite · blade · 2 khe violet · halo).
- **Transform mọi object KHÔNG đổi** (không dời/không xoay mesh, kể cả blade — blade xử bằng GÓC CAMERA, không phải dời).
- Palette lock. Violet chỉ 2 khe.

## ĐƯỢC LÀM (camera + đèn ONLY)
1. **Rim light:** thêm 1 rim mềm (lạnh, trong palette) tách **thân graphite tối** khỏi void — mép thân đọc rõ, không tan biến. Rim là viền, KHÔNG phải fill tràn.
2. **Key kịch tính hơn:** đẩy Rembrandt key mạnh/định hướng hơn, bóng bên tối sâu hơn — vẫn **single-key mood**, KHÔNG neon/warm/color wash.
3. **Camera composition:** dàn khung 3/4 hero sao cho **blade đọc thuộc về nhân vật** (nằm cạnh/sau vai, trong dòng chảy silhouette) thay vì phiến trôi tách rời. Chỉ bằng góc + khoảng cách camera.
4. Fine grain. Full-body vẫn thấy trọn.

## SUCCESS TEST
Hero đọc "đỉnh" hơn V0.12: thân **tách khỏi void bằng rim**, key **kịch tính có chiều**, blade **đọc gắn với nhân vật** qua bố cục;
vẫn faceless porcelain + graphite cloak + 2 khe violet + halo, void single-key; geometry+material+transform Y HỆT V0.12 (hash).

## RÀNG BUỘC
- Geometry + material + transform KHÔNG đổi — xác nhận hash. Chỉ camera + đèn (thêm rim, chỉnh key) đổi.
- KHÔNG dời/ xoay blade hay bất kỳ mesh nào. Nếu bố cục camera KHÔNG thể làm blade đọc gắn → BÁO (đừng dời mesh), operator xử pass riêng.
- Dọn .blend1. KHÔNG overwrite base. KHÔNG push/lock/canon. Nhãn CANDIDATE / NOT CANON-LOCKED.

## OUTPUT (candidate)
- production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_13.blend
- production/character/reviews/MIKAGE_STANDING_HERO_POLISH_V0_13_HERO.png (hero 3/4 full-body money-shot, bản polish)
- production/character/reviews/MIKAGE_STANDING_HERO_POLISH_V0_13_CONTACT_SHEET.png (hero · front · so vs V0.12)
- production/character/reviews/MIKAGE_STANDING_HERO_POLISH_V0_13_PROOF.md + RESULT block
- Gate CONTACT_SHEET_ONLY: _tmp/mikage_standing_hero_polish_v0_13_gate/ chỉ chứa contact_sheet.png + contact_sheet_review_report.md.

## FAIL
- Nếu đổi geometry/material/transform (hash drift), thêm neon/warm/color wash, hoặc mất void single-key mood →
  dừng, PASS_FAIL=FAIL, BLOCKER=HERO_POLISH_DRIFT, liệt kê; revert về V0.12.

→ Stop sau proof. Lane B drift-check (rim tách thân? key có chiều? blade đọc gắn? geometry/material/transform giữ?) → BOOS ruling. PASS → hero polish này thay hero V0.12 làm money-shot cho video build-log (bước A).
