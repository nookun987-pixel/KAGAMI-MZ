# LANE A / CODEX TASK BRIEF — MIKAGE HELMET PROPORTION REFINE V0.5
Soạn: Lane B (Cowork) · 2026-06-30 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception #21.
Governed by AGENTS.md "Twenty-first controlled exception" (`MIKAGE_HELMET_PROPORTION_REFINE_V0_5`).

> V0.4 hướng khối DUYỆT, nhưng tỉ lệ đầu-thân + chamfer cứng chưa hero-grade (đang giống robot low-poly).
> Task này chỉnh **scale + làm mềm chamfer** → đọc như porcelain tạo hình. Helmet-ONLY.
> **KHÔNG subdiv-final, KHÔNG lookdev/material.** Xong DỪNG cho owner review.

## SOURCE OF TRUTH (đọc cả 2)
1. Master: `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f68…06429`).
2. Helmet target: `production/character/build_log/MIKAGE_HELMET_BLOCKING_SPEC_V0_1.md`.

## TASK
`MIKAGE_HELMET_PROPORTION_REFINE_V0_5` — 1 task = 1 render. CANDIDATE only.

## INPUT (base — CHỈ cái này)
- `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4.blend`.
  Báo `BASE_SELECTED` + `BODY_HASH_BEFORE`.
- CẤM: geometry RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4; không import scene.

## PRESERVE byte-identical (verify hash + transform)
Robe · neck · halo · blade · camera scale · toàn bộ body. **Chỉ helmet mesh đổi.**
- Sau khi scale, hàm helmet vẫn phải **seat vào graphene-neck opening hiện có** (chỉnh chân helmet, KHÔNG dời neck).
- Không seat được mà không đụng neck → **STOP, báo.**

## REFINE helmet ONLY
1. **Tăng scale helmet ~15%** so với vai + cloak (đầu có trọng lượng thị giác hơn).
2. **Nới phần TRÊN** helmet nhẹ, nhưng **giữ hàm dưới hẹp**.
3. **Đỉnh phẳng → cung crown nông** (shallow arc); KHÔNG quay lại egg.
4. **Giảm chamfer temple + jaw gãy mạnh** → silhouette đọc porcelain tạo hình, không robot low-poly.
5. **Giữ face-plane trước rộng/gần phẳng, nhưng bớt bề ngang vuông kiểu hộp.**
6. **2 slit recess MỎNG + NÔNG hơn**; không khung cơ khí / socket kiểu game.
7. Faceless porcelain: không feature mặt; không fox/kitsune/samurai/anime/gaming-mask; không seam/vent/panel; không hộp/cơ khí. Giữ đúng 2 slit.

## SUCCESS TEST (tự kiểm trước PASS)
Đầu đủ trọng lượng thị giác · tắt slit silhouette vẫn distinct · đọc như **1 khối porcelain tạo hình có kiểm soát**, không phải nhiều mặt phẳng ghép · không robot low-poly.

## RÀNG BUỘC
- Violet chỉ 2 khe. Palette lock. No second body form. No V0.4 web reuse.
- Helmet đổi → báo `BODY_HASH_AFTER`, helmet-mesh hash before/after, xác nhận MỌI preserve-region hash KHÔNG đổi.
- KHÔNG overwrite base. **KHÔNG subdiv-final, KHÔNG lookdev/material.** Dọn `.blend1`. KHÔNG push/lock.

## OUTPUT (candidate)
- `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_PROPORTION_REFINE_V0_5.blend`
- `production/character/reviews/MIKAGE_HELMET_PROPORTION_REFINE_V0_5_CONTACT_SHEET.png`
  (front · **strict side** · 3/4 · **no-slit silhouette** — sheet này TRƯỚC mọi subdiv/lookdev)
- `production/character/reviews/MIKAGE_HELMET_PROPORTION_REFINE_V0_5_PROOF.md` + RESULT block.

## FAIL
- `HELMET_SCOPE_DRIFT` — đổi gì ngoài mesh helmet → dừng, liệt kê.
- **FALLBACK nếu sau scale vẫn vuông/cơ khí:** khóa hướng V0.4 làm base, sửa RIÊNG 3 vùng theo thứ tự
  **crown → temple → jaw**. KHÔNG dùng lookdev/material/đèn che lỗi silhouette trước khi 3 vùng này đạt.

→ Stop sau proof cho owner review. Lane B drift-check theo success test → BOOS duyệt. Final ruling = operator.
