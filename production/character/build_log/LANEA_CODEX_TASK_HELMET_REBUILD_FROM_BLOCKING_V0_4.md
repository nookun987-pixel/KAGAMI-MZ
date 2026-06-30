# LANE A / CODEX TASK BRIEF — MIKAGE HELMET REBUILD FROM BLOCKING V0.4
Soạn: Lane B (Cowork) · 2026-06-30 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception #20.
Governed by AGENTS.md "Twentieth controlled exception" (`MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4`).

> V0.3 FAIL = HELMET_NEEDS_REBUILD_FROM_BLOCKING (operator xác nhận). Helmet **dựng lại từ khối**
> theo spec khóa — KHÔNG nắn mesh oval V0.2/V0.3. Mọi thứ ngoài helmet giữ byte-identical. KHÔNG lookdev.

## SOURCE OF TRUTH (đọc cả 2)
1. Master: `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f68…06429`).
2. Helmet target khóa: `production/character/build_log/MIKAGE_HELMET_BLOCKING_SPEC_V0_1.md`.

## TASK
`MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4` — 1 task = 1 render. CANDIDATE only.

## INPUT (base — CHỈ cái này)
- `production/character/production_actor/rig_derivatives/MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2.blend`
  (bản halo/cổ/robe đã duyệt). Báo `BASE_SELECTED` + `BODY_HASH_BEFORE`.
- **Mesh helmet oval V0.3 BỎ HẲN, không edit.** Dựng helmet mới từ khối.
- CẤM: geometry RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4; không import scene.

## PRESERVE byte-identical (verify hash + transform)
Robe · neck · halo · blade · camera scale · toàn bộ body. **Chỉ helmet là mesh mới.**
- Hàm nêm helmet mới phải **cắm vừa vào graphene-neck opening hiện có** (chỉnh chân helmet cho khớp neck, KHÔNG dời neck).
- Nếu không seat được mà không đụng neck → **STOP, báo**, đừng lặng lẽ sửa neck.

## REBUILD helmet từ blocking (theo spec khóa)
1. **FACE-PLANE** trước: phẳng, rộng, **lõm nhẹ**, mang đúng 2 slit.
2. **CROWN/BROW BREAK**: vòm sọ sau tách face-plane bằng đường gãy **đọc được ở 3/4**.
3. **Thái dương thu nhẹ** (không phồng tròn); **hàm NÊM** cắm vào neck (không cằm tròn).
4. **Side**: rõ mặt trước gần phẳng vs sọ sau cong.
5. **Tổng thể THẤP + BÈ hơn V0.2/V0.3** — không kéo dọc.
6. Faceless porcelain only: không feature mặt; không fox/kitsune/samurai/anime/gaming-mask; không seam/vent/panel; không hộp/cơ khí.

## SUCCESS TEST (tự kiểm trước khi PASS)
Tắt slit + material + đèn (ý niệm) → **silhouette vẫn đọc MIKAGE** (face-plane + crown break + wedge jaw), không mannequin/egg. 3/4 thấy khối. Side rõ trước-phẳng/sau-cong.

## RÀNG BUỘC
- Violet chỉ 2 khe. Palette lock. No second body form. No V0.4 web reuse.
- Helmet mới → báo `BODY_HASH_AFTER`, helmet-mesh hash mới, xác nhận MỌI preserve-region hash KHÔNG đổi.
- KHÔNG overwrite base. **KHÔNG lookdev/material.** Dọn `.blend1`. KHÔNG push/lock.

## OUTPUT (candidate)
- `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4.blend`
- `production/character/reviews/MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4_CONTACT_SHEET.png`
  (front · **strict side** · 3/4 · helmet close-up · **silhouette comparison vs V0.3**)
- `production/character/reviews/MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4_PROOF.md` + RESULT block.

## FAIL
- `HELMET_SCOPE_DRIFT` — đổi gì ngoài mesh helmet → dừng, liệt kê.
- **FALLBACK nếu dựng tự do VẪN ra oval/egg:** DỪNG dựng tự do. Trả `PASS_FAIL = FAIL`,
  `BLOCKER = NEEDS_LOCKED_2D_PROFILE_GUIDE` → operator khóa profile guide 2D front+side cho helmet rồi extrude. Không polish thêm trên V0.3.

→ Stop sau proof cho owner review. Lane B drift-check theo SUCCESS TEST → BOOS duyệt. Final ruling = operator.
