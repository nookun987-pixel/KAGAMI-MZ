# LANE A / CODEX TASK BRIEF — MIKAGE HERO LOOKDEV PREMIUM V0.8.1 (SLIT HUE FIX)
Soan: Lane B (Cowork) - 2026-07-03 - STATUS: DRAFT - KHOA toi khi BOOS mo exception #35 (Thirty-fifth).
Governed by AGENTS.md "Thirty-fifth controlled exception" (`MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1`).

> V0.8 (commit local, chua push) co 2 van de chan PASS:
> (1) direct PNG inspection cua `MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_CONTACT_SHEET.png` cho thay 2 khe doc
>     ro la MAGENTA/HONG, khong phai violet `#8F00FF` da lock trong color contract.
> (2) proof cu tu bao PASS_FAIL=FAIL voi BLOCKER=VALIDATOR_SCHEMA_MISMATCH (active_task.yaml khong
>     whitelist contact_sheet.png/contact_sheet_review_report.md cho CONTACT_SHEET_ONLY).
> Task nay = **MATERIAL FIX ONLY**: dua 2 khe ve dung `#8F00FF`, dong thoi tao dung 2 file gate de
> verify_output.py chay PASS. KHONG dong lai geometry/camera/light-rig da co o V0.8.

## SOURCE OF TRUTH
- Master: `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png`.
- Color contract: `design_system/mikage-cine-color-contract.md` (VIOLET `#8F00FF` = sole emissive exception,
  slit halo / P3 overdrive core only).
- Prior proof (FAIL, for context only): `production/character/reviews/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_PROOF.md`.

## TASK
`MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1` - 1 task. CANDIDATE only.

## INPUT (base - CHI cai nay)
- `production/character/production_actor/rig_derivatives/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8.blend`.
  Bao `BASE_SELECTED` + `BODY_HASH_BEFORE`.
- CAM: geometry RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4; khong import scene khac.

## GEOMETRY LOCKED
KHONG doi ty le/silhouette/face-plane/crown/temple/jaw/slit placement/camera/light-rig/bat ky mesh nao.
Xac nhan `BODY_HASH` KHONG doi o output.

## ALLOWED CHANGE (chi 1 thu)
- Chinh LAI emission color cua 2 node material khe (`PUBLIC_BLOCK_V03_sensor_slit_left_violet_only`,
  `PUBLIC_BLOCK_V03_sensor_slit_right_violet_only`) ve dung `#8F00FF` (khong dung P3-only hex neu render
  engine doc sai gamma - phai pixel-sample lai anh xuat ra, khong chi doc node value).
- Neu can, giam nhe bloom/exposure CHI o vung khe de tranh no trang xoa mau (khong duoc tang do sang
  tong the scene, khong duoc doi vi tri/kich thuoc khe).
- Khong doi bat ky material nao khac (porcelain/graphite/blade/halo giu nguyen V0.8).

## GATE SCHEMA FIX (bat buoc)
- `output_files_allowed` trong active_task.yaml (Lane B se set) = DUNG
  `contact_sheet.png` + `contact_sheet_review_report.md`.
- `contact_sheet.png` = contact sheet 4-panel giong V0.8 (front/3q/side/helmet close-up), 3600x900,
  ANH DA FIX MAU (khong phai anh cu).
- `contact_sheet_review_report.md` = tom tat SLIT_HUE_PIXEL_SAMPLE truoc/sau + BODY_HASH before/after +
  PASS/FAIL cac dieu kien duoi.

## OUTPUT (real deliverables, ngoai gate)
- `production/character/production_actor/rig_derivatives/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1.blend`
- `production/character/reviews/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1_CONTACT_SHEET.png`
- `production/character/reviews/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1_PROOF.md`

## VERIFY (bat buoc)
- Reopen sach; BODY_HASH + transform + moi material KHAC khe unchanged vs V0.8.
- SLIT_HUE_PIXEL_SAMPLE tren anh xuat (khong phai node value) tren view front va view helmet close-up:
  phai doc violet gan `#8F00FF`, KHONG magenta/hong.
- VIOLET_OUTSIDE_TWO_SLITS = NO.
- `.blend1` = NONE sau cleanup.
- `python .mikage/tools/verify_output.py` = PASS.

## FAIL CONDITIONS
- Van con magenta/hong sau fix -> `BLOCKER = SLIT_HUE_FAIL` (dung lai, KHONG tu y doi them thu khac).
- Geometry/camera/light-rig/material-khac-khe drift -> `BLOCKER = LOOKDEV_FIX_DRIFT`, revert V0.8.
- Gate van sai schema -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`, dung lai bao Lane B.

## KHONG DUOC LAM
- KHONG canon-lock / asset-lock / final / PASS / production-ready / verified (chi CANDIDATE).
- KHONG push. KHONG deploy. KHONG doi file khac ngoai danh sach tren.
- KHONG de file nao khac ngoai 2 file gate trong `_tmp/mikage_hero_lookdev_premium_v0_8_1_gate/`.
- Xong thi DUNG, cho owner review. Final visual ruling thuoc ve operator.
- Neu SSOT conflict hoac scope drift: dung va bao cao.
