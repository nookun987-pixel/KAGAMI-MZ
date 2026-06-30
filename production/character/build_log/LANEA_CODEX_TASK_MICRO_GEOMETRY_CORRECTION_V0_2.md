# LANE A / CODEX TASK BRIEF — MIKAGE MICRO GEOMETRY CORRECTION V0.2
Soạn: Lane B (Cowork) · 2026-06-30 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception #18.
Governed by AGENTS.md "Eighteenth controlled exception" (`MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2`).

> VERDICT trên `MATCH_3D_TO_MASTER_V0_1` = **PASS_WITH_FIX**. Hướng + thân DUYỆT.
> CHƯA canon-lock. Task này = 1 pass sửa nhỏ ĐÚNG 3 vùng, rồi review lại. KHÔNG lookdev finish.

## SOURCE OF TRUTH (master)
`production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f68…06429`). PHẢI mở đọc.

## TASK
`MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2` — 1 task = 1 render. CANDIDATE only.

## INPUT (base — CHỈ cái này)
- `production/character/production_actor/rig_derivatives/MIKAGE_MATCH_3D_TO_MASTER_V0_1.blend`.
  Báo `BASE_SELECTED` + `BODY_HASH_BEFORE`.
- CẤM: geometry RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4; không import scene.

## PRESERVE (KHÔNG đụng)
- Robe silhouette hiện tại · tỉ lệ thân hiện tại · đúng 2 khe (số lượng + vị trí tương đối) ·
  blade slab dọc · **hướng ovoid tổng thể của helmet** (KHÔNG quay lại wedge nhọn cũ) · faceless (no eyes/nose/mouth).

## FIX — CHỈ 3 vùng
### A. HELMET (bớt đọc trứng/mannequin)
- Giữ hướng ovoid, nhưng **bớt quả-trứng-hoàn-hảo**: thu nhẹ profile hai bên (lateral hẹp lại).
- Crown + cằm có định hướng hơn; thêm **character planar tiết chế** + bất đối xứng phẳng RẤT nhẹ → đọc như porcelain sculpture, không phải egg/alien-egg/mặt nạ generic.
- KHÔNG facial features. KHÔNG wedge nhọn. Giữ đúng 2 slit.

### B. HALO (ánh sáng, không phải ống)
- **Giảm rõ độ dày** vòng; tách xa sau đầu thêm chút.
- Đọc như **luminous light (emission/bloom)**, KHÔNG phải ống trắng đặc.
- **Side view KHÔNG được đọc thành thanh/cột trắng dựng đứng.**
- Halo KHÔNG sáng hơn helmet. Halo giữ TRẮNG (không violet).

### C. NECK / ROBE JOIN
- Giảm cảm giác cổ là **trụ đen cắm vào đầu**.
- Robe nhận chân helmet **tự nhiên thành 1 silhouette liền**.
- **KHÔNG canon-lock "graphene neck"** — vật liệu cổ để UNSPECIFIED, chờ operator quyết.

## RÀNG BUỘC
- Violet CHỈ trong 2 khe. Palette lock void `#050508` / porcelain `#f2eeea` / violet `#8F00FF`.
- No second body form. No V0.4 reuse. Geometry đổi CHỈ ở 3 vùng trên — báo `BODY_HASH_AFTER` + ghi rõ đổi gì.
- KHÔNG overwrite base. KHÔNG lookdev finish (material đẹp để vòng sau). Dọn `.blend1`. KHÔNG push/lock.

## OUTPUT (candidate)
- `production/character/production_actor/rig_derivatives/MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2.blend`
- `production/character/reviews/MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2_CONTACT_SHEET.png` (front · 3/4 · **side bắt buộc** · helmet+slits close)
- `production/character/reviews/MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2_PROOF.md` + RESULT block.

## FAIL = MICRO-FIX SCOPE DRIFT
Nếu đổi gì NGOÀI 3 vùng (robe silhouette, tỉ lệ thân, số/vị trí slit, blade, hay đẻ helmet form mới hẳn) → dừng, trả:
```
PASS_FAIL = FAIL
BLOCKER = MICRO_FIX_SCOPE_DRIFT
PRESERVE = robe silhouette · body proportions · two slits · vertical blade · overall ovoid helmet direction
FIXED_ONLY = generic egg read · halo thickness/read · neck-to-robe transition
```
→ Lane B drift-check (helmet character / halo side-read / neck join) vs master → BOOS duyệt. Final ruling = operator.
