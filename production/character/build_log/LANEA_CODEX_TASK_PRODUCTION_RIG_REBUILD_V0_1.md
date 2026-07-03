# LANE A / CODEX TASK BRIEF — MIKAGE PRODUCTION RIG REBUILD V0.1 (new fitted 7-bone axial rig)
Soan: Lane B (Cowork) - 2026-07-03 - STATUS: DRAFT - KHOA toi khi BOOS mo exception #40 (Fortieth).
Governed by AGENTS.md "Fortieth controlled exception" (`MIKAGE_PRODUCTION_RIG_REBUILD_V0_1`).

> Boi canh (audit #37 + #39, ca hai PASS): bo xuong cu `MIKAGE_initial_armature_scaffold` (23 bone)
> chi gan vao 29 mesh legacy AN di, khong khop khong gian voi hinh dang THAT (audit #39 xac nhan:
> ao/than la 1 KHOI LIEN TUC, khong co mesh tay/chan rieng; 16 bone tay/chan KHONG can thiet; 7 bone
> truc (root->head) dung SO LUONG nhung SAI VI TRI - head bone thap hon tam helmet that ~2.062 don vi).
> BOOS ruling 2026-07-03: xay bo xuong MOI, 7 bone truc, dat dung vi tri theo so lieu audit #39; blade
> gan CUNG vao root/pelvis (khong phai tay - audit xac nhan khong co mesh tay/grip). Bo xuong cu +
> 29 mesh legacy GIU NGUYEN, khong dung, khong xoa (extend, dung xoa).

## SOURCE OF TRUTH
- File base: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend`
  (KHONG doi tu exception #36).
- Du lieu vi tri: `docs/reports/MIKAGE_MESH_TOPOLOGY_AUDIT_V0_1.md` (audit #39) - DUNG so lieu bbox/vi tri
  o day de dat bone, KHONG doan.
- Doi chieu: `docs/reports/MIKAGE_PRODUCTION_RIG_ARMATURE_AUDIT_V0_1.md` (audit #37).
- Halo ruling: `docs/handoff/HALO_RING_RULING_2026-07-03.md` (halo PHAI luon TRANG).

## TASK
`MIKAGE_PRODUCTION_RIG_REBUILD_V0_1` - 1 task. CANDIDATE only.

## BUOC 1 - TAO ARMATURE MOI (khong dung/sua armature cu)
- Tao 1 Armature object MOI, ten `MIKAGE_axial_rig_v0_1` (KHONG dung lai ten `MIKAGE_initial_armature_scaffold`
  de tranh nham lan voi bo xuong cu).
- Dung DUNG 7 bone truc, dat vi tri theo so lieu audit #39 muc 5 (uoc luong Z, dieu chinh cho khop
  bounding box mesh that o muc 1 va 6 cua audit do): `root` (~Z 0.14, day cloak), `pelvis` (~Z 0.5-0.8),
  `spine_01` (~Z 1.2), `spine_02` (~Z 1.8), `chest` (~Z 2.5-3.0), `neck` (~Z 3.3-3.5), `head` (~Z 3.96,
  can giua helmet - dung tam helmet that tu audit #39 muc 1, KHONG dung vi tri head cu).
- KHONG tao 16 bone tay/chan (clavicle/upper_arm/forearm/hand/thigh/shin/foot/toe) - audit xac nhan
  khong co mesh tuong ung, giu don gian dung 7 bone.
- Bo xuong cu `MIKAGE_initial_armature_scaffold` + 29 mesh legacy: GIU NGUYEN, KHONG dung, KHONG xoa,
  KHONG sua.

## BUOC 2 - GAN MESH (binding)
- `MASTER_MATCH_single_closed_draped_void_cloak` (1 khoi lien tuc, than+ao): gan Armature modifier +
  vertex group vao `MIKAGE_axial_rig_v0_1`, MEM (blend nhieu bone) qua vung chuyen tiep root/pelvis/
  spine_01/spine_02/chest/neck de co the cong o eo/hong/nguc ma khong rach.
- `MASTER_MATCH_faceless_porcelain_helmet`, `PUBLIC_BLOCK_V03_sensor_slit_left/right_violet_only`,
  `MASTER_MATCH_white_halo_ring`: gan CUNG (rigid, weight=1.0 hoac Child-Of constraint) vao bone `head`.
  Halo PHAI giu mau TRANG (chi doi transform, khong doi material).
- `PUBLIC_BLOCK_V03_zenith_blade_crisp_front_plane`, `PUBLIC_BLOCK_zenith_blade_dark_edge`,
  `PUBLIC_BLOCK_zenith_blade_vertical_slab`: gan CUNG vao bone `root` hoac `pelvis` (dua theo vi tri
  world-space thuc te tu audit #39 muc 6 de chon dung bone - blade dat CANH nguoi, khong phai cam tay).
  Bao ro chon bone nao va ly do.
- KHONG doi geometry/silhouette/material cua bat ky mesh nao. Slit van tim `#8F00FF`, halo van trang.

## BUOC 3 - TEST NHE (sanity check, KHONG phai Stage B day du)
- 1 pose test nhe: xoay `chest` hoac `spine_02` khoang 10-15 do, kiem tra cloak deform muot, khong
  rach/xuyen, helmet/halo/blade di dung theo bone tuong ung.
- Render 1 contact sheet don gian: 1 goc neutral + 1 goc sau khi xoay nhe, chung minh binding hoat dong.

## RANH GIOI - KHONG DUOC LAM
- KHONG dung/sua/xoa bo xuong cu hoac 29 mesh legacy.
- KHONG doi geometry/material cua bat ky mesh visible nao.
- KHONG lam Stage B day du (8 pose) trong task nay.
- KHONG render final/marketing.
- KHONG canon-lock/asset-lock/production-rig-ready claim.
- KHONG push. KHONG deploy.

## GATE (dung 2 file)
- `contact_sheet.png` = 2 goc (neutral + pose test nhe).
- `contact_sheet_review_report.md` = chi tiet: vi tri 7 bone moi (head/tail that), mesh nao gan vao
  bone nao (mem hay cung), ket qua test pose, HALO_COLOR_CHECK, hash geometry/material truoc-sau
  (phai KHONG doi ngoai phan them binding).

## OUTPUT (real deliverables)
- `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend`
- `production/character/reviews/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1_CONTACT_SHEET.png`
- `production/character/reviews/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1_PROOF.md`

## VERIFY
- Geometry/silhouette/material cua tat ca mesh visible KHONG doi (chi them armature moi + binding).
- Bo xuong cu + 29 mesh legacy KHONG bi dung cham.
- 7 bone moi dat dung vi tri theo audit #39 (bao cao toa do that dat duoc, so sanh voi uoc luong).
- Test pose nhe khong rach/xuyen nghiem trong.
- HALO_COLOR_CHECK = trang.
- `.blend1` = NONE.
- `python .mikage/tools/verify_output.py` = PASS.

## FAIL CONDITIONS
- Geometry/material bi doi ngoai y muon -> `BLOCKER = REBUILD_SIDE_EFFECT_DRIFT`.
- Test pose van rach/xuyen nghiem trong -> `BLOCKER = REBUILD_BIND_INSUFFICIENT` (bao cao ro, khong
  tu y sua geometry de vay).
- Halo doi mau -> `BLOCKER = HALO_COLOR_VIOLATION`.
- Dung cham bo xuong cu/mesh legacy -> `BLOCKER = LEGACY_TOUCHED`.
- Gate sai schema -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.

## SAU KHI PASS
- Day la dieu kien can cuoi cung. Sau PASS, Lane B soan task Stage B that (8-pose deformation test
  day du) tren file `MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend` nay.
- Neu SSOT conflict hoac scope drift: dung va bao cao.
