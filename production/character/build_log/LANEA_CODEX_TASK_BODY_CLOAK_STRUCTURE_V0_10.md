# LANE A / CODEX TASK BRIEF — MIKAGE BODY CLOAK STRUCTURE V0.10
Soạn: Lane B (Cowork) · 2026-07-01 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception #27.
Governed by AGENTS.md "Twenty-seventh controlled exception" (MIKAGE_BODY_CLOAK_STRUCTURE_V0_10).

> V0.9 PASS scope/kỹ thuật nhưng FORM HOLD: silhouette đúng (cao-dọc, đáy thẳng) nhưng đọc như "chuông latex" —
> vai phồng thành 1 mái vòm liên tục, mặt trước phẳng thiếu trọng lượng vải, primary folds của V0.8 bị xóa gần hết,
> strict side mỏng như tấm slab. Task này = 1 pass STRUCTURE để ra CLOAK VẢI NẶNG mà GIỮ silhouette V0.9. THÂN ONLY.
> KHÔNG material. KHÔNG mở lại helmet/slit/blade/camera/light. Xong DỪNG cho owner review.

## SOURCE OF TRUTH
- Master: production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png (sha256 b86f68…06429).
- Visual spec: docs/mikage_character_visual_spec.md.

## INPUT (base — CHỈ cái này, KHÔNG quay lại V0.8)
- production/character/production_actor/rig_derivatives/MIKAGE_BODY_FORM_DEBLOCKOUT_V0_9.blend
  Báo BASE_SELECTED + BODY_HASH_BEFORE + HELMET_HASH_BEFORE + BLADE_HASH_BEFORE.
- CẤM: RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 / V0.8; không import scene.

## PRESERVE LOCKED (hash phải giữ nguyên như V0.9)
Helmet (toàn bộ) · 2 slit · Zenith Blade · camera/framing · world · TẤT CẢ material + lighting.
**Chỉ mesh THÂN đổi.** Giữ silhouette cao-dọc + đáy thẳng của V0.9. Không dời neck join.

## CLOAK STRUCTURE — thân ONLY (đúng 6 điểm operator chốt)
1. **Hạ độ phồng 2 vai NHẸ** — bỏ cảm giác mái vòm tròn liên tục; vai có góc/khối, không phải quả bóng.
2. **Tạo 3–5 primary folds LỚN, dọc, bất đối xứng nhẹ** (không đều nhau, không mirror).
3. **Nếp bắt đầu DƯỚI xương vai** — KHÔNG chụm hết vào cổ.
4. Giữ **2 mép ngoài gần thẳng đứng** — KHÔNG cho trumpet/loe quay lại.
5. **Tăng NHẸ độ sâu trước–sau** ở strict side → đọc thành cloak bao quanh thân, KHÔNG phải tấm phẳng/slab.
6. **Giữ đáy nặng, ổn định** — không sóng nhỏ, không micro-fold vụn.

## SUCCESS TEST
Đọc là **cloak vải nặng** (trọng lượng + 3–5 nếp chính đọc rõ), vai bớt phồng (không mái vòm), strict side có độ dày trước–sau (không slab),
silhouette cao-dọc + đáy thẳng V0.9 GIỮ, không loe, không latex-shell; helmet/slit/blade/camera/material Y HỆT V0.9 (hash).

## RÀNG BUỘC
- KHÔNG material trong task geometry này. Palette lock. Violet chỉ 2 khe. No V0.4 reuse.
- Đổi mesh thân → báo BODY_HASH_AFTER + vert/face count; xác nhận HELMET/BLADE/camera/material hash KHÔNG đổi.
- Dọn .blend1. KHÔNG overwrite base. KHÔNG push/lock/canon.

## OUTPUT (candidate)
- production/character/production_actor/rig_derivatives/MIKAGE_BODY_CLOAK_STRUCTURE_V0_10.blend
- production/character/reviews/MIKAGE_BODY_CLOAK_STRUCTURE_V0_10_CONTACT_SHEET.png (front · 3/4 · strict side · so vs V0.9)
- production/character/reviews/MIKAGE_BODY_CLOAK_STRUCTURE_V0_10_PROOF.md + RESULT block
- Gate CONTACT_SHEET_ONLY: _tmp/mikage_body_cloak_structure_v0_10_gate/ chỉ chứa contact_sheet.png + contact_sheet_review_report.md.

## FAIL (per operator)
- Nếu V0.10 hiện NHIỀU nếp nhỏ, LOE đáy, hoặc DRIFT helmet/blade/camera/material → revert về V0.9 (KHÔNG quay lại V0.8),
  PASS_FAIL=FAIL, BLOCKER=CLOAK_STRUCTURE_DRIFT, liệt kê.

→ Stop sau proof. Lane B drift-check (nếp chính đọc rõ? vai bớt phồng? side có depth? silhouette+đáy giữ? locked hash?) → BOOS ruling.
