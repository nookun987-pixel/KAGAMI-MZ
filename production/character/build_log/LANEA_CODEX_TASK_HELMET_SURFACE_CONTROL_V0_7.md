# LANE A / CODEX TASK BRIEF — MIKAGE HELMET SURFACE CONTROL V0.7
Soạn: Lane B (Cowork) · 2026-07-01 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception #23.
Governed by AGENTS.md "Twenty-third controlled exception" (`MIKAGE_HELMET_SURFACE_CONTROL_V0_7`).

> V0.6 giữ tỉ lệ V0.5 nhưng SIMPLE subdiv để lại: crown gợn bậc · temple gãy · mặt trước nhô như VISOR
> (rõ ở góc 3/4 trên & dưới). Task này = 1 **surface-control** dùng **Catmull–Clark + support loop** dọn sạch
> mà KHÔNG đổi tỉ lệ/silhouette. Helmet-ONLY. **KHÔNG material/lookdev/đèn.** Xong DỪNG cho owner review.

## SOURCE OF TRUTH (đọc cả 2)
1. Master: `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f68…06429`).
2. Helmet target: `production/character/build_log/MIKAGE_HELMET_BLOCKING_SPEC_V0_1.md`.

## TASK
`MIKAGE_HELMET_SURFACE_CONTROL_V0_7` — 1 task = 1 render. CANDIDATE only.

## INPUT (base — CHỈ cái này)
- `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6.blend`.
  Báo `BASE_SELECTED` + `BODY_HASH_BEFORE`.
- CẤM: geometry RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4; không import scene.

## PRESERVE LOCKED (KHÔNG đổi)
Helmet **scale · jaw width · slit placement · silhouette + tỉ lệ tổng**. Robe/neck/halo/blade/camera/body byte-identical.
**Chỉ BỀ MẶT helmet đổi.** Jaw vẫn seat vào neck (không dời neck). Không seat được mà không đụng neck → STOP, báo.

## SURFACE-CONTROL — helmet ONLY
1. Crown gợn bậc → **1 cung nông LIỀN MẠCH sạch**.
2. Làm mượt **crown→temple** mà KHÔNG tròn lại egg.
3. **Giảm phần mặt trước nhô như visor** — đặc biệt ở góc **3/4 trên và 3/4 dưới**.
4. Giữ face-plane rộng/gần phẳng, nhưng **blend rìa của nó vào vỏ bằng support loop có kiểm soát**.
5. Giữ **wedge jaw** hẹp.
6. Giữ đúng **2 slit mỏng lõm**; **bỏ mọi đọc brow-band / visor chạy ngang** quanh khe.
7. Dùng **Catmull–Clark + support geometry** chỗ cần — **KHÔNG SIMPLE subdiv đơn thuần**.
8. **KHÔNG material lookdev.**

## SUCCESS TEST (tự kiểm trước PASS)
Crown 1 cung liền sạch · **không còn visor nhô** ở góc trên/dưới · đọc sealed porcelain shell ở 3/4 trên VÀ dưới ·
face-plane còn rõ · không robot · không egg · không gợn low-poly · tỉ lệ V0.6 giữ.

## RÀNG BUỘC
- Violet chỉ 2 khe. Palette lock. No second body form. No V0.4 web reuse.
- Helmet đổi → báo `BODY_HASH_AFTER`, helmet-mesh hash + vert/face count, xác nhận MỌI preserve-region hash KHÔNG đổi.
- KHÔNG overwrite base. **KHÔNG material/lookdev/đèn.** Dọn `.blend1`. KHÔNG push/lock.

## OUTPUT (candidate)
- `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_SURFACE_CONTROL_V0_7.blend`
- `production/character/reviews/MIKAGE_HELMET_SURFACE_CONTROL_V0_7_CONTACT_SHEET.png`
  (front · strict side · 3/4 chuẩn · **3/4 TRÊN (elevated)** · **3/4 DƯỚI (low)** · **WIREFRAME close-up** · so vs V0.6)
- `production/character/reviews/MIKAGE_HELMET_SURFACE_CONTROL_V0_7_PROOF.md` + RESULT block.

## FAIL
- `HELMET_SCOPE_DRIFT` — đổi tỉ lệ/scale/silhouette hoặc vùng non-helmet → dừng, liệt kê.
- **FALLBACK nếu Catmull–Clark làm tròn form:** revert V0.6, **chỉ thêm support loop cục bộ ở crown/temple/rìa face-plane**,
  KHÔNG full-subdiv mất kiểm soát, KHÔNG material/đèn che. Trả `PASS_FAIL = FAIL`, `BLOCKER = CC_ROUNDED_FORM`.

→ Stop sau proof cho owner review. Lane B drift-check (crown liền · hết visor ở góc trên/dưới · face-plane rõ) → BOOS duyệt. Final ruling = operator.
