# LANE A / CODEX TASK BRIEF — MIKAGE STAGE B AXIAL DEFORMATION TEST V0.1 (scoped-down, axial-only)
Soan: Lane B (Cowork) - 2026-07-03 - STATUS: DRAFT - KHOA toi khi BOOS mo exception #41 (Forty-first).
Governed by AGENTS.md "Forty-first controlled exception" (`MIKAGE_STAGE_B_AXIAL_DEFORMATION_V0_1`).

> Boi canh: exception #40 (`MIKAGE_PRODUCTION_RIG_REBUILD_V0_1`, PASS) tao rig moi `MIKAGE_axial_rig_v0_1`
> voi DUNG 7 bone truc (root/pelvis/spine_01/spine_02/chest/neck/head), 0 bone tay/chan (audit #39 xac
> nhan mesh khong co hinh tay/chan rieng). Stage B goc trong `MIKAGE_LANE_A_ROADMAP.html` doi 8 pose gom
> ca tay/chan (arms raised, left step, right step, blade hold) - VAT LY KHONG LAM DUOC voi rig 7-bone-truc
> nay, khong phai loi rig. BOOS ruling 2026-07-03: THU GON Stage B lan nay CHI test cac pose lam duoc
> bang bone truc (khong bo Stage B, chi doi bo pose set cho khop kha nang rig THAT).
> Cac pose tay/chan (arms raised/left step/right step) va blade-hold that su (cam tay) BI HOAN LAI toi khi
> co 1 task rieng xay them hinh tay/chan + bone tuong ung (chua duoc mo, chua duoc dat ten).

## SOURCE OF TRUTH
- File base: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend`
  (KHONG doi tu exception #40 - day la candidate PASS moi nhat).
- Doi chieu: `docs/reports/MIKAGE_MESH_TOPOLOGY_AUDIT_V0_1.md` (audit #39, xac nhan khong co tay/chan).
- Halo ruling: `docs/handoff/HALO_RING_RULING_2026-07-03.md` (halo PHAI luon TRANG).
- Roadmap Stage B goc (tham khao, KHONG ap dung nguyen van vi vuot kha nang rig): Stage B section trong
  roadmap operator cung cap 2026-07-03 (8-pose list, arms/legs).

## TASK
`MIKAGE_STAGE_B_AXIAL_DEFORMATION_V0_1` - 1 task. CANDIDATE only. Day la Gate B RUT GON (axial-only),
khong phai Gate B day du theo roadmap goc (thieu tay/chan).

## POSE SET (6 pose, TAT CA CHI DUNG 7 bone truc san co - KHONG bone tay/chan)
1. `neutral` - baseline, tat ca bone o rest transform.
2. `quarter_turn` - xoay yaw ~45-90 do tren `root` hoac `pelvis` (ca nguoi quay, blade di theo vi no gan root).
3. `forward_bend` - cui nguoi: pitch forward ~20-30 do tren `chest` (co the them chut tren `spine_02`).
4. `side_pose` - nghieng nguoi sang 1 ben: roll/lateral bend ~15-20 do tren `chest` hoac `spine_02`.
5. `head_turn` - xoay dau nhe: yaw ~30-45 do tren `neck` hoac `head` (helmet/halo phai di theo dung, khong tach roi khoi co).
6. `backward_lean` - nga nguoi ra sau nhe: pitch backward ~10-15 do tren `chest` (kiem tra cloak khong xuyen/rach o huong nguoc lai voi forward_bend).

KHONG lam: `arms_raised`, `left_step`, `right_step`, hay `blade_hold` (cam tay) - vat ly khong co bone/mesh
tay/chan de thuc hien. Neu Codex thay can them bone/mesh de lam duoc cac pose nay, DUNG va bao cao, KHONG
tu y tao them (ngoai scope task nay).

## SOI LOI (moi pose ghi ro)
- Meo vai/hong tai vung chuyen tiep bone (neu co dau hieu tuong tu, ghi ro du khong co vai that).
- Cloak xuyen/rach o vung uon (bung/hong/nguc).
- Helmet/halo co lech khoi dinh dau (head bone) khong.
- Blade co giu dung vi tri gan voi root khong (khong duoc troi/lech doc lap khoi than khi xoay/cui).
- Halo mau (phai luon trang, moi pose).
- Slit mau (phai luon gan #8F00FF, khong magenta).

## RANH GIOI - KHONG DUOC LAM
- KHONG tao bone/mesh tay/chan moi trong task nay.
- KHONG doi geometry/material cua bat ky mesh nao (chi keyframe/pose bone).
- KHONG doi bo xuong `MIKAGE_axial_rig_v0_1` (khong them/bot/di chuyen bone).
- KHONG dung/sua bo xuong cu `MIKAGE_initial_armature_scaffold` hoac 29 mesh legacy.
- KHONG render final/marketing. KHONG canon-lock/asset-lock/production-rig-ready claim.
- KHONG push. KHONG deploy.

## GATE (dung 2 file)
- `contact_sheet.png` = 6 pose (neutral/quarter_turn/forward_bend/side_pose/head_turn/backward_lean),
  bo cuc luoi 2x3 hoac 3x2, nhan ten pose ro rang.
- `contact_sheet_review_report.md` = ket qua tung pose: co rach/xuyen khong, helmet/halo/blade co giu
  dung vi tri khong, halo/slit mau gi (pixel sample), pose nao FAIL neu co.

## OUTPUT (real deliverables)
- `production/character/production_actor/rig_derivatives/MIKAGE_STAGE_B_AXIAL_DEFORMATION_V0_1.blend`
- `production/character/reviews/MIKAGE_STAGE_B_AXIAL_DEFORMATION_V0_1_CONTACT_SHEET.png`
- `production/character/reviews/MIKAGE_STAGE_B_AXIAL_DEFORMATION_V0_1_PROOF.md`

## VERIFY
- Geometry/material cua tat ca mesh KHONG doi (chi bone pose/keyframe thay doi).
- Bo xuong cu + 29 mesh legacy KHONG bi dung cham.
- Bo xuong moi `MIKAGE_axial_rig_v0_1` van dung 7 bone, khong them/bot.
- Ca 6 pose render, moi pose bao cao ro PASS/FAIL rieng.
- HALO_COLOR_CHECK = trang moi pose. SLIT_HUE_CHECK gan #8F00FF moi pose.
- `.blend1` = NONE.
- `python .mikage/tools/verify_output.py` = PASS.

## FAIL CONDITIONS
- 1 hoac nhieu pose rach/xuyen nghiem trong khong sua duoc trong pham vi pose/weight hien co ->
  `BLOCKER = STAGE_B_DEFORMATION_FAIL` (ghi ro pose nao, vung nao, KHONG tu y doi geometry de vay).
- Helmet/halo/blade tach roi hoac lech khoi bone cha o bat ky pose nao -> `BLOCKER = RIGID_ATTACH_FAIL`.
- Halo doi mau -> `BLOCKER = HALO_COLOR_VIOLATION`.
- Dung cham bo xuong cu/mesh legacy hoac doi so bone rig moi -> `BLOCKER = SCOPE_VIOLATION`.
- Gate sai schema -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.

## SAU KHI PASS
- Day la Gate B RUT GON (axial-only). Operator quyet dinh buoc ke tiep: mo task xay tay/chan de lam
  Stage B day du (arms raised/left step/right step/blade hold that), hoac di thang sang Exit 1/Exit 2
  cua roadmap voi gioi han "khong co dong tac tay/chan" cho toi khi co task do.
- Neu SSOT conflict hoac scope drift: dung va bao cao.
