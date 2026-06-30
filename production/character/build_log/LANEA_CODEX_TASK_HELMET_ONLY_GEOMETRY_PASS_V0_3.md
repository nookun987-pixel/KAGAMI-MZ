# LANE A / CODEX TASK BRIEF — MIKAGE HELMET-ONLY GEOMETRY PASS V0.3
Soạn: Lane B (Cowork) · 2026-06-30 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception #19.
Governed by AGENTS.md "Nineteenth controlled exception" (`MIKAGE_HELMET_ONLY_GEOMETRY_PASS_V0_3`).

> Verdict V0.2: halo + cổ-robe + slits DUYỆT. Helmet vẫn đọc mannequin/trứng → 1 pass helmet-ONLY cuối.
> KHÔNG lookdev, KHÔNG material. Xong DỪNG cho owner review.

## SOURCE OF TRUTH (master)
`production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f68…06429`). PHẢI mở đọc.

## TASK
`MIKAGE_HELMET_ONLY_GEOMETRY_PASS_V0_3` — 1 task = 1 render. CANDIDATE only.

## INPUT (base — CHỈ cái này)
- `production/character/production_actor/rig_derivatives/MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2.blend`.
  Báo `BASE_SELECTED` + `BODY_HASH_BEFORE`.
- CẤM: geometry RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4; không import scene.

## PRESERVE — GIỮ NGUYÊN HOÀN TOÀN (verify bằng hash + transform)
Robe · neck · halo · blade · camera scale · toàn bộ body geometry. **CHỈ mesh helmet được đổi.**

## CORRECT ONLY — helmet
1. **Bớt đọc trứng dài:**
   - giảm tổng chiều cao helmet ~**6–8%**
   - nới khối giữa/dưới ~**4–6%**
   - **bỏ chóp cằm nhọn chĩa xuống**
2. **Mạnh hơn six-plane radial rhythm:**
   - mặt phẳng sculptural rộng, tiết chế
   - **side-plane break rõ hơn ở góc 3/4**
   - crown phẳng nhẹ
   - lower termination có kiểm soát, **không phải oval mannequin trơn**
3. **Giữ mọi luật identity khóa:**
   - vỏ porcelain faceless hoàn toàn
   - **đúng 2 khe slit mảnh song song, lõm**
   - không mắt/mũi/miệng / không giải phẫu mặt
   - không fox / kitsune / samurai / anime / gaming-mask
   - không thêm seam / vent / panel / chi tiết trang trí
   - **không biến thành hộp / mũ cơ khí**

## RÀNG BUỘC
- Violet CHỈ trong 2 khe. Palette lock void `#050508` / porcelain `#f2eeea` / violet `#8F00FF`.
- Helmet geometry đổi → báo `BODY_HASH_AFTER`, helmet-mesh hash before/after, và xác nhận MỌI preserve-region hash KHÔNG đổi.
- KHÔNG overwrite base. **KHÔNG lookdev / material.** Dọn `.blend1`. KHÔNG push/lock.

## OUTPUT (candidate)
- `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_ONLY_GEOMETRY_PASS_V0_3.blend`
- `production/character/reviews/MIKAGE_HELMET_ONLY_GEOMETRY_PASS_V0_3_CONTACT_SHEET.png`
  (front · 3/4 · **strict side** · helmet close-up · **silhouette comparison vs V0.2**)
- `production/character/reviews/MIKAGE_HELMET_ONLY_GEOMETRY_PASS_V0_3_PROOF.md` + RESULT block.

## FAIL
- `HELMET_SCOPE_DRIFT` — nếu đổi gì ngoài mesh helmet → dừng, liệt kê cái drift.
- **FALLBACK nếu sau pass này helmet VẪN generic/mannequin:** DỪNG vi mô. KHÔNG đắp thêm chi tiết,
  KHÔNG dùng material/lookdev che lỗi geometry. Trả `PASS_FAIL = FAIL`,
  `BLOCKER = HELMET_NEEDS_REBUILD_FROM_BLOCKING`, đề xuất dựng lại helmet từ khối lớn theo silhouette Mikage khóa (task riêng).

→ Stop sau proof cho owner review. Lane B drift-check (silhouette read · side · 3/4 break) → BOOS duyệt. Final ruling = operator.
