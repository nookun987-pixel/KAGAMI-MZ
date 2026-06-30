# LANE A / CODEX TASK BRIEF — MIKAGE HELMET CONTROLLED SUBDIV V0.6
Soạn: Lane B (Cowork) · 2026-06-30 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception #22.
Governed by AGENTS.md "Twenty-second controlled exception" (`MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6`).

> V0.5 = BLOCKING APPROVED (không đổi scale/tỉ lệ nữa). Task này = 1 **controlled subdivision** làm
> mượt facet mà KHÔNG đổi silhouette V0.5, KHÔNG tròn lại thành egg. Helmet-ONLY geometry.
> **KHÔNG material/lookdev/kintsugi/hair/đèn cine.** Xong DỪNG cho owner review.

## SOURCE OF TRUTH (đọc cả 2)
1. Master: `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f68…06429`).
2. Helmet target: `production/character/build_log/MIKAGE_HELMET_BLOCKING_SPEC_V0_1.md`.

## TASK
`MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6` — 1 task = 1 render. CANDIDATE only.

## INPUT (base — CHỈ cái này)
- `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_PROPORTION_REFINE_V0_5.blend`.
  Báo `BASE_SELECTED` + `BODY_HASH_BEFORE`.
- CẤM: geometry RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4; không import scene.

## PRESERVE byte-identical (verify hash + transform)
Robe · neck · halo · blade · camera scale · toàn bộ body. **Chỉ helmet mesh đổi.**
- Sau subdiv, hàm vẫn **seat vào graphene-neck opening** (không dời neck). Không seat được mà không đụng neck → STOP, báo.

## CONTROLLED SUBDIVISION — helmet ONLY
1. **Giữ NGUYÊN tỉ lệ + silhouette V0.5**; chỉ làm mượt facet → bề mặt đọc porcelain tạo hình, không low-poly.
2. Giữ **face-plane trước rộng/gần phẳng + crown arc nông + temple transition + wedge jaw hẹp**. Thêm **support loop** ở chỗ cần để subdiv **KHÔNG tròn lại thành egg** và **KHÔNG phồng hàm**.
3. **Crown = 1 cung nông LIỀN MẠCH** — KHÔNG bump giữa, KHÔNG 3 múi / không đọc thành tóc.
4. Giữ đúng **2 slit mỏng, nông, frameless**.
5. Faceless porcelain only: không feature; không fox/kitsune/samurai/anime/gaming-mask; không seam/vent/panel; không hộp/cơ khí.

## SUCCESS TEST (tự kiểm trước PASS)
Bề mặt mượt hơn/porcelain · crown 1 cung liền (không bump/múi) · temple không gãy · jaw còn sắc vừa đủ ·
không robot low-poly VÀ không egg tròn lại · giữ nhận diện V0.5.

## RÀNG BUỘC
- Violet chỉ 2 khe. Palette lock. No second body form. No V0.4 web reuse.
- Helmet đổi (subdiv) → báo `BODY_HASH_AFTER`, helmet-mesh hash + vert/face count cuối, xác nhận MỌI preserve-region hash KHÔNG đổi.
- KHÔNG overwrite base. **KHÔNG material/lookdev/đèn.** Dọn `.blend1`. KHÔNG push/lock.

## OUTPUT (candidate)
- `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6.blend`
- `production/character/reviews/MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6_CONTACT_SHEET.png`
  (front · **strict side** · 3/4 · **no-slit silhouette** · **WIREFRAME** · **before/after V0.5↔V0.6**)
- `production/character/reviews/MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6_PROOF.md` + RESULT block.

## FAIL
- `HELMET_SCOPE_DRIFT` — đổi gì ngoài mesh helmet → dừng, liệt kê.
- **FALLBACK nếu subdiv làm tròn form / mất face-plane:** revert V0.5, **TĂNG support loop ở crown/temple/jaw**,
  KHÔNG dùng material/đèn che lỗi. Trả `PASS_FAIL = FAIL`, `BLOCKER = SUBDIV_ROUNDED_FORM`.

→ Stop sau proof cho owner review. Lane B drift-check (crown liền · face-plane giữ · không egg) → BOOS duyệt. Final ruling = operator.
