# LANE A / CODEX TASK BRIEF — MIKAGE FINAL STANDING CHARACTER CANDIDATE V0.12
Soạn: Lane B (Cowork) · 2026-07-01 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception #29.
Governed by AGENTS.md "Twenty-ninth controlled exception" (MIKAGE_STANDING_CHARACTER_CANDIDATE_V0_12).

> Đầu (V0.7 geometry + V0.8 porcelain) và thân (V0.10 geometry + V0.11 matte) đều đã CHỐT.
> Task này = RÁP + RENDER 1 **hero đứng full-body** làm **final standing character CANDIDATE**.
> KHÔNG đổi geometry. KHÔNG đổi material. Chỉ dàn CAMERA full-figure + ĐÈN hero cho ra ảnh cine.
> Đây là CANDIDATE để operator duyệt — KHÔNG final/canon/asset-lock. Xong DỪNG.

## SOURCE OF TRUTH
- Master: production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png (sha256 b86f68…06429).
- Recipe: production/character/MIKAGE_HERO_LOOKDEV_RECIPE_V1.md · design_system/mikage-cine-color-contract.md.

## INPUT (base — CHỈ cái này)
- production/character/production_actor/rig_derivatives/MIKAGE_BODY_LOOKDEV_MATTE_V0_11.blend
  Báo BASE_SELECTED + BODY_HASH_BEFORE + BODY_HASH_AFTER (geometry phải KHÔNG đổi).
- CẤM: RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 / bản cũ hơn; không import scene.

## LOCKED (KHÔNG đổi)
- TOÀN BỘ geometry (đầu + thân) — BODY_HASH unchanged.
- TOÀN BỘ material: helmet glazed porcelain · thân matte graphite (V0.11) · blade cold metal · 2 khe violet · halo trắng.
- Palette lock void `#050508` / porcelain `#f2eeea` / violet `#8F00FF`. Violet chỉ ở 2 khe.

## ĐƯỢC LÀM (presentation ONLY)
1. **Camera:** dàn khung **full-body đứng** — thấy trọn thân từ đỉnh helmet tới hem, chừa headroom + void trên/dưới. Ưu tiên 1 hero 3/4 + 1 front sạch + 1 strict side.
2. **Đèn hero:** theo recipe — 1 key Rembrandt trên-trái chếch xuống + rim mềm tách silhouette khỏi void, fill gần 0 (~2/3 chìm void), fine grain. Có thể tinh chỉnh cho premium cine, NHƯNG giữ single-key mood, KHÔNG neon/warm/color wash.
3. Render chất lượng cao (Cycles ưu tiên nếu hợp porcelain SSS/coat; Eevee nếu khớp recipe).

## SUCCESS TEST
1 nhân vật đứng full-body đọc mạch lạc: **đầu sứ bóng + thân vải graphite mờ + blade lạnh + 2 khe violet + halo trắng, trên void, single-key cine.**
Silhouette cao-dọc; không robot, không cyberpunk, không chi tiết ngoài phạm vi; geometry + material Y HỆT V0.11 (hash).

## RÀNG BUỘC
- BODY_HASH (geometry) + mọi material KHÔNG đổi — xác nhận. Chỉ camera + đèn đổi.
- Dọn .blend1. KHÔNG overwrite base. KHÔNG push/lock/canon/asset-lock. Nhãn CANDIDATE / NOT CANON-LOCKED.

## OUTPUT (candidate)
- production/character/production_actor/rig_derivatives/MIKAGE_STANDING_CHARACTER_CANDIDATE_V0_12.blend
- production/character/reviews/MIKAGE_STANDING_CHARACTER_CANDIDATE_V0_12_CONTACT_SHEET.png (hero 3/4 · front · strict side — FULL BODY)
- production/character/reviews/MIKAGE_STANDING_CHARACTER_CANDIDATE_V0_12_HERO.png (1 khung hero 3/4 full-body, money-shot cho video build-log)
- production/character/reviews/MIKAGE_STANDING_CHARACTER_CANDIDATE_V0_12_PROOF.md + RESULT block
- Gate CONTACT_SHEET_ONLY: _tmp/mikage_standing_character_candidate_v0_12_gate/ chỉ chứa contact_sheet.png + contact_sheet_review_report.md.

## FAIL
- Nếu geometry HOẶC bất kỳ material đổi (hash drift), hoặc thêm chi tiết/neon/warm, hoặc mất mood single-key void →
  dừng, PASS_FAIL=FAIL, BLOCKER=STANDING_CANDIDATE_DRIFT, liệt kê; revert về V0.11.

→ Stop sau proof. Lane B drift-check (full-body mạch lạc? đầu+thân+blade+halo ăn khớp? geometry+material giữ?) → BOOS ruling. Nếu PASS → đây là hero frame cho video build-log.
