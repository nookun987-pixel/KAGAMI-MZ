# LANE A / CODEX TASK BRIEF — MATCH 3D PRODUCTION ACTOR TO 2D MASTER
Soạn: Lane B (Cowork) · 2026-06-30 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception mới.

> ⚠️ GOVERNANCE GATE (đọc trước, bắt buộc):
> Task này SỬA GEOMETRY (helmet/torso/cloak) → khác task finish lookdev (geometry-locked).
> Exception #16 (`MIKAGE_V0_2_HERO_FINISH_LOOKDEV_V0_1`) CHỈ cho lookdev, KHÔNG cho sửa hình.
> → Cần BOOS thêm exception mới vào AGENTS.md (vd "Seventeenth controlled exception
> = `MIKAGE_MATCH_3D_TO_MASTER_V0_1 = OPEN`") + clean-repo gate (`git stash push -u`).
> Codex KHÔNG được chạy khi chưa có exception này. Chưa mở → trả:
> `PASS_FAIL = FAIL` / `BLOCKER = MATCH_3D_TO_MASTER_NOT_OPEN`.

## SOURCE OF TRUTH (master, chỉ 1)
IN-REPO: `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png`
(sha256 `b86f6817cbc4f7d6a861b8e9f111f78096ca173f5bf5c5966a378069c0e06429`). PHẢI mở đọc tấm PNG này.
Mọi quyết định hình bám tấm này.
Immutable: faceless porcelain helmet · đúng 2 sensor slits · violet emissive CHỈ ở khe ·
void-black body mass / draped robe · graphene neck · WHITE HALO RING · sculptural realism.

## TASK
`MIKAGE_MATCH_3D_TO_MASTER_V0_1` — kéo bản 3D về khớp master. 1 task = 1 render. CANDIDATE only.

## INPUT (base — KHÔNG lấy nhánh khác)
- Base = dòng PRODUCTION-ACTOR: `production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_HERO_FINISH_LOOKDEV_V0_1.blend`
  (hoặc `_COMPLETION_LOOKDEV_V0_2.blend`). Báo `BASE_SELECTED` + `BODY_HASH_BEFORE`.
- **CẤM dùng geometry từ:** RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 web. KHÔNG import scene khác.

## KEEP (giữ nguyên — đã đúng hướng)
- Thân tối cao-dọc (dark vertical body direction).
- Đúng 2 khe violet.
- Blade slab dựng dọc cạnh thân.

## FIX (kéo về master)
1. **Helmet:** bỏ đọc tròn/bát giác → về **faceless porcelain helmet** theo master (no eyes/nose/mouth).
   (Nếu BOOS pin riêng dáng "tall wedge" thì làm wedge; chưa pin thì bám "faceless porcelain" của master.)
2. **Giảm đọc robot:** bớt tấm-máy ở ngực/tay (chest-panel / proxy plates).
3. **Thân → khối cloak rủ kín** (closed draped void-cloak mass), không stack-block.
4. **Khớp silhouette + tỉ lệ master** (cao, kín, thanh).
5. **Giữ faceless tuyệt đối.**
6. **WHITE HALO RING:** thêm theo master (halo TRẮNG sau đầu). Không đổi sang violet wash.

## RÀNG BUỘC
- Violet CHỈ trong 2 khe — không halo violet/wash/flood/gold/crimson. Palette lock.
- KHÔNG tạo form thân thứ 2. KHÔNG tái dùng geometry V0.4 foundation.
- KHÔNG claim final/canon/production-ready → OUTPUT = **3D CANON CANDIDATE**.
- Dọn `.blend1`. KHÔNG push. Báo `BODY_HASH_AFTER` (sẽ đổi vì có sửa hình — ghi rõ thay đổi gì).

## OUTPUT
- `production/character/production_actor/rig_derivatives/MIKAGE_MATCH_3D_TO_MASTER_V0_1.blend`
- `production/character/reviews/MIKAGE_MATCH_3D_TO_MASTER_V0_1_CONTACT_SHEET.png` (front · 3/4 · side · close helmet+slits)
- `production/character/reviews/MIKAGE_MATCH_3D_TO_MASTER_V0_1_PROOF.md` + RESULT block.

## FAIL = DESIGN DRIFT (dừng ngay nếu)
Codex đẻ thêm dáng thân mới / tái dùng V0.4 / coi draft là form canon khác → trả:
```
PASS_FAIL = FAIL
BLOCKER = DESIGN_DRIFT
SOURCE_OF_TRUTH = MIKAGE_CHARACTER_REFERENCE_16x9.png
EXPECTED = ONE 3D IMPLEMENTATION OF THE MASTER
```
→ Lane B drift-check vs master (helmet/slit/halo/cloak/silhouette) → BOOS duyệt visual. Final ruling = operator.
