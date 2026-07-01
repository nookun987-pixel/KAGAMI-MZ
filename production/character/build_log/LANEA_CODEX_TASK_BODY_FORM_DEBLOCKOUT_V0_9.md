# LANE A / CODEX TASK BRIEF — MIKAGE BODY FORM DE-BLOCKOUT V0.9
Soạn: Lane B (Cowork) · 2026-07-01 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception #26.
Governed by AGENTS.md "Twenty-sixth controlled exception" (MIKAGE_BODY_FORM_DEBLOCKOUT_V0_9).

> Đầu/helmet đã đóng băng ở V0.7 (geometry) + V0.8 (porcelain lookdev). Task này CHỈ nắn form THÂN:
> đưa silhouette thân từ khối proxy/blockout trơn → **khối áo choàng cao-dọc** đọc được. THÂN ONLY.
> KHÔNG mở lại helmet/slit/blade/camera/material. Xong DỪNG cho owner review.

## SOURCE OF TRUTH
- Master: production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png (sha256 b86f68…06429).
- Visual spec: docs/mikage_character_visual_spec.md (female-coded non-sexual read, sacred vertical flow, tall silhouette).

## INPUT (base — CHỈ cái này)
- production/character/production_actor/rig_derivatives/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8.blend
  Báo BASE_SELECTED + BODY_HASH_BEFORE + HELMET_HASH_BEFORE + component hashes.
- CẤM: mọi geometry RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4; không import scene.

## PRESERVE LOCKED (KHÔNG đổi — hash phải giữ nguyên)
Helmet (toàn bộ) · 2 slit (vị trí + số lượng) · Zenith Blade · camera/framing · world · TẤT CẢ material + lighting V0.8.
**Chỉ mesh THÂN (torso/vai/cổ-áo/áo choàng) được đổi.** Jaw vẫn seat vào cổ; không dời neck join của helmet.

## DE-BLOCKOUT — thân ONLY (1 area group: silhouette áo choàng)
1. Đưa khối cone proxy → **áo choàng/robe cao-dọc**: thiết lập vai có khối, ngực/torso phẳng-vừa, và **thân buông thẳng đứng** (vertical skirt fall), không loe kèn trumpet.
2. Cổ→vai chuyển tiếp tự nhiên (không thắt ống, không cổ dày cơ khí).
3. Cấu trúc nếp chính (primary folds) đủ đọc chất vải — KHÔNG micro-fold vụn (để round sau).
4. Female-coded **non-sexual**, sacred vertical flow; giữ tổng chiều cao/tỉ lệ trong envelope blockout hiện tại (đừng đổi hẳn chiều cao).
5. Giữ **geometric/điêu khắc**, KHÔNG thêm tóc, KHÔNG thêm prop/giáp/khoá/panel trang trí ở round này.

## SUCCESS TEST
Thân đọc là **áo choàng cao-dọc có khối vai + buông thẳng**, không còn cone trơn/proxy; chuyển cổ-vai tự nhiên;
helmet/slit/blade/camera/material Y HỆT V0.8 (hash unchanged); không robot, không loe váy, không thêm chi tiết ngoài phạm vi.

## RÀNG BUỘC
- Đổi mesh THÂN → báo BODY_HASH_AFTER + vert/face count; xác nhận HELMET_HASH / BLADE_HASH / camera / material hash KHÔNG đổi.
- Palette lock. Violet chỉ 2 khe. No second body form. No V0.4 reuse.
- Dọn .blend1. KHÔNG overwrite base. KHÔNG push/lock/canon.

## OUTPUT (candidate)
- production/character/production_actor/rig_derivatives/MIKAGE_BODY_FORM_DEBLOCKOUT_V0_9.blend
- production/character/reviews/MIKAGE_BODY_FORM_DEBLOCKOUT_V0_9_CONTACT_SHEET.png (front · 3/4 · strict side · so vs V0.8)
- production/character/reviews/MIKAGE_BODY_FORM_DEBLOCKOUT_V0_9_PROOF.md + RESULT block (helmet/slit/blade/camera/material hash unchanged? thân đổi hợp lệ?)
- Gate CONTACT_SHEET_ONLY: _tmp/mikage_body_form_deblockout_v0_9_gate/ chỉ chứa contact_sheet.png + contact_sheet_review_report.md.

## FAIL
- SCOPE_DRIFT: nếu helmet/slit/blade/camera/material đổi dù task chỉ sửa thân → dừng, PASS_FAIL=FAIL, BLOCKER=BODY_SCOPE_DRIFT, liệt kê cái drift; revert, KHÔNG sửa bù trên file đã drift.
- FALLBACK nếu de-blockout làm mất seat cổ-đầu: revert, chỉ nắn từ vai xuống, KHÔNG đụng neck join.

→ Stop sau proof. Lane B drift-check (thân cao-dọc? helmet/blade/camera/material y hệt?) → BOOS ruling.
