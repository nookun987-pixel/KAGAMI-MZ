# LANE A / CODEX TASK BRIEF — PUBLIC FIGURE BLOCKING (reorient to public poster target)
Soạn bởi Lane B (Cowork) · 2026-06-30 · STATUS: DRAFT chờ BOOS authorize (commit = authorize).

Mục tiêu: kéo actor từ "rig proxy kỹ thuật" về đúng **public target** (poster Lane B): Mikage ĐỨNG, cao-dọc, áo choàng đen dọc, helmet wedge faceless + 2 khe violet, blade slab dọc cạnh thân. Đây là blocking/silhouette pass — KHÔNG phải rig, KHÔNG phải mount/gait. Đóng băng nhánh mount/steed ở V1.5.

## TASK
`MIKAGE_PUBLIC_FIGURE_BLOCKING_V0_1`

## INPUT — ⚠️ BASE SELECTION GATE (bắt buộc, làm TRƯỚC khi đụng geometry)
KHÔNG mặc định lấy nguyên `MIKAGE_RIDER_HEAD_GRAFT_EEVEE_V0_1.blend` — đó là nhánh mount/rider, nguy cơ kéo theo rig / constraint / driver / proxy / collection của mount sang public figure.

1. **BODY BASE = latest CLEAN standing public-figure / production-actor blend.** Ứng viên (mới nhất trước):
   `production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_PUBLIC_TARGET_BLOCKING_V0_3.blend` → `_V0_2` → `_V0_1` (hoặc `_HERO_REAL_LOOKDEV_V0_1` / `_WEIGHT_REVIEW_PASS_V0_1`). Chọn cái mới nhất PASS dependency-check (#4).
2. **HEAD = chỉ append/transfer wedge head V2 + đúng 2 slit assemblies** (dormant black + awakened violet) từ nguồn head gốc sạch nhất: `MIKAGE_HELMET_HEAD_LOOKDEV_EEVEE_V0_1.blend`. KHÔNG import nguyên scene rider/graft.
3. Chỉ được dùng TOÀN BỘ Rider Head Graft scene NẾU verifier xác nhận: mount/steed objects = 0 · mount actions = 0 · rider constraints/drivers = 0 · không phụ thuộc mount branch. Không thỏa → KHÔNG dùng.
4. **MOUNT_DEPENDENCY_CHECK trên BODY BASE đã chọn:** mount/steed objects = 0 · mount actions/NLA = 0 · constraints/drivers trỏ rig mount = 0 · mount collection = 0. Fail bất kỳ mục → loại base đó, thử base kế.
5. **Trước khi sửa geometry, BÁO bắt buộc:** `BASE_SELECTED` · `BASE_REASON` · `MOUNT_DEPENDENCY_CHECK` (từng mục, số 0 / non-0) · `HEAD_TRANSFER_METHOD` · `BODY_HASH_BEFORE`.
6. **Nếu KHÔNG có standing base sạch → STOP**, không đụng geometry, trả đúng:
```
PASS_FAIL = FAIL
BLOCKER = NO_CLEAN_STANDING_PUBLIC_FIGURE_BASE
NEXT_SAFE_ACTION = operator identifies or creates a clean standing body base; no geometry edited
```
1 task = 1 render.

## ACTION (geometry / blocking — KHÔNG rig)
1. **Head:** chỉ mang wedge head V2 + 2 khe (đã lock) lên BODY BASE bằng append/transfer object (KHÔNG import nguyên scene). KHÔNG nắn lại head.
2. **Silhouette → cao đứng dọc:** bỏ khối vai bè kiểu T; thu vai vào/xuống cho thân đọc thẳng đứng (poster = tall vertical).
3. **Thân → khối áo choàng ĐEN dọc:** thay khối torso/chân stack-block bằng **áo choàng/mantle đen rủ xuống đất**, đọc dọc-hẹp. Giáp sứ/graphite đọc bên trong, nhưng **silhouette trội = cloak đen cao**. (Bỏ cuống cổ chìm void.)
4. **Blade slab dựng DỌC cạnh thân** (mũi xuống), không cắt chéo ngang người.
5. **Relight void-black theo recipe:** 1 key Rembrandt (trên-trái, chếch xuống) + rim mảnh, fill ~0 (~2/3 chìm void), world `#050508`. Material: vỏ = glazed porcelain (base `#f2eeea`), cloak/underlayer = graphite matte tối.

## RÀNG BUỘC
- **Faceless** — không mắt/mũi/miệng. Violet **chỉ trong 2 khe**, không halo/wash/flood/gold.
- KHÔNG nắn lại đầu wedge V2 lock. KHÔNG đụng nhánh mount/steed/gait. KHÔNG claim production rig ready. KHÔNG canon-lock/PASS — output = **CANDIDATE**.
- Dọn `.blend1`. KHÔNG push.

## ĐẦU RA
- `production/character/MIKAGE_PUBLIC_FIGURE_BLOCKING_EEVEE_V0_1.blend`
- `production/character/reviews/MIKAGE_PUBLIC_FIGURE_BLOCKING_V0_1_CONTACT_SHEET.png` (front · 3/4 · side · close helmet+blade; dormant + awakened)
- `production/character/reviews/MIKAGE_PUBLIC_FIGURE_BLOCKING_V0_1_PROOF.md` + RESULT block (head wedge unchanged? silhouette đứng-dọc? cloak đen trội? blade dọc? violet chỉ trong khe?)
→ Lane B drift-check vs poster public (silhouette/helmet/slit/body-mass/blade) → BOOS duyệt → pass tới lookdev finish theo `MIKAGE_HERO_LOOKDEV_RECIPE_V1.md`.
