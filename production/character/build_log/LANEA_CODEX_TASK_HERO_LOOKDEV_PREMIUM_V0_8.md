# LANE A / CODEX TASK BRIEF — MIKAGE HERO LOOKDEV PREMIUM V0.8
Soạn: Lane B (Cowork) · 2026-07-01 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception #24.
Governed by AGENTS.md "Twenty-fourth controlled exception" (`MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8`).

> V0.7 geometry DUYỆT + **KHÓA**. Đây là pass LOOKDEV đầu: **material + đèn only, KHÔNG đổi geometry**
> (trừ 1 fallback hẹp ở dưới). Mục tiêu: blocking sạch → hero render porcelain premium theo recipe.
> Làm 2 STAGE: A) clay trung tính validate → B) porcelain thật. Xong DỪNG cho owner review.

## SOURCE OF TRUTH
- Master: `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 `b86f68…06429`).
- Recipe: `production/character/MIKAGE_HERO_LOOKDEV_RECIPE_V1.md` · `docs/mikage_character_visual_spec.md` · `design_system/mikage-cine-color-contract.md`.

## TASK
`MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8` — 1 task. CANDIDATE only.

## INPUT (base — CHỈ cái này)
- `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_SURFACE_CONTROL_V0_7.blend`.
  Báo `BASE_SELECTED` + `BODY_HASH_BEFORE`.
- CẤM: geometry RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4; không import scene.

## GEOMETRY LOCKED
KHÔNG đổi tỉ lệ/silhouette/face-plane/crown/temple/jaw/slit placement/bất kỳ mesh nào.
**Xác nhận `BODY_HASH` KHÔNG đổi ở output** (lookdev không được sửa hình). Chỉ fallback hẹp dưới mới được chạm perimeter.

## STAGE A — NEUTRAL CLAY VALIDATION (làm TRƯỚC)
Render figure khóa bằng **clay off-white matte, low specular, TẮT halo, 1 đèn studio mềm lớn**, trung tính.
Xác nhận **rìa face-plane KHÔNG đọc thành tấm faceplate/seam cơ khí riêng.** Giao clay proof.

## STAGE B — FINAL PORCELAIN LOOKDEV (chỉ khi clay đọc sạch)
- Helmet/shell = **semi-matte glazed porcelain** (base `#f2eeea`), micro-surface nhẹ — KHÔNG bóng nhựa, KHÔNG phẳng lì.
- Thân/underlayer = graphite matte sâu / void mass; blade = kim loại lạnh; halo = trắng, tiết chế, **không sáng hơn helmet**.
- Đúng **2 slit violet lõm mảnh**; violet `#8F00FF` **cường độ tiết chế**; violet CHỈ ở khe.
- KHÔNG khung cơ khí, KHÔNG seam/panel line thừa, KHÔNG chi tiết trang trí.
- Môi trường = void-black `#050508`; **1 key directional** (Rembrandt trên-trái chếch xuống); **rim mềm có kiểm soát** tách silhouette; fill ~0 (~2/3 chìm void); fine grain. **KHÔNG đèn cyberpunk/neon, không color wash.**

## SUCCESS TEST
Đọc porcelain semi-matte premium (không nhựa) · silhouette V0.7 giữ · face-plane LIỀN với shell (không seam faceplate) ·
2 khe violet tiết chế là tín hiệu DUY NHẤT · void-black single-key cine · không robot, không cyberpunk.

## RÀNG BUỘC
- Palette lock void `#050508` / porcelain `#f2eeea` / violet `#8F00FF`. No second body form. No V0.4 reuse.
- Dọn `.blend1`. KHÔNG overwrite base. KHÔNG push/lock/canon-lock/public-ready.

## OUTPUT (candidate)
- `production/character/production_actor/rig_derivatives/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8.blend`
- `production/character/reviews/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_CLAY_VALIDATION.png` (Stage A)
- `production/character/reviews/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_CONTACT_SHEET.png` (Stage B: front · 3/4 · side · helmet close)
- `production/character/reviews/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_PROOF.md` + RESULT block (BODY_HASH unchanged? clay clean? materials? lighting? violet restrained 2 khe? void bg?).

## FAIL
- `GEOMETRY_CHANGED_IN_LOOKDEV` — nếu BODY_HASH đổi ngoài fallback hẹp, hoặc silhouette/tỉ lệ đổi → dừng, báo.
- **NARROW FALLBACK:** nếu clay Stage-A VẪN hiện đường seam chỗ face-plane gặp shell → CHỈ được chỉnh **perimeter normals / local support** tại seam đó (không đổi silhouette/tỉ lệ/scale/slit). Ghi rõ đổi gì + BODY_HASH mới.

→ Stop sau proof cho owner review. Lane B drift-check (clay sạch · porcelain không nhựa · violet tiết chế · void cine) → BOOS duyệt. Final ruling = operator.
