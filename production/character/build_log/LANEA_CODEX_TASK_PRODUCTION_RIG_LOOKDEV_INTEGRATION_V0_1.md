# LANE A / CODEX TASK BRIEF — MIKAGE PRODUCTION RIG LOOKDEV INTEGRATION V0.1
Soan: Lane B (Cowork) - 2026-07-03 - STATUS: DRAFT - KHOA toi khi BOOS mo exception #36 (Thirty-sixth).
Governed by AGENTS.md "Thirty-sixth controlled exception" (`MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1`).
Day la Stage A ("Integration") trong `MIKAGE_LANE_A_ROADMAP.html` (BOOS gui 2026-07-03) — buoc dau tien
sau khi lookdev premium duoc duyet, TRUOC deformation test (Stage B).

> Hien co 2 dong rieng chua hop nhat:
> (1) `MIKAGE_STANDING_HERO_POLISH_V0_14.blend` = ASSET-LOCKED, la HINH THE chinh thuc (geometry/pose/
>     proportions da duyet, dung lam base cho turnaround V0.2 + Canvas Motion V0.2 dang co).
> (2) `MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1.blend` = ACTIVE_PREMIUM_LOOKDEV_REFERENCE (duyet 2026-07-03),
>     la bo MATERIAL/LOOKDEV rieng (porcelain, khe da fix dung `#8F00FF`, khong con magenta).
> CHUA XAC NHAN: V0.14 hien tai co dang dung dung bo material premium nay chua, hay van dung material
> cu tu truoc khi co dong V0.8/V0.8.1. Task nay = hop nhat: LAY geometry tu V0.14 (khong doi), AP material
> da duyet tu V0.8.1 (khong tu che lai cong thuc material), tao 1 file production hop nhat.

## SOURCE OF TRUTH
- Master 2D: `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png`.
- Color contract: `design_system/mikage-cine-color-contract.md` (VIOLET `#8F00FF` = CHI o 2 khe).
- Halo ring ruling (moi, 2026-07-03): `docs/handoff/HALO_RING_RULING_2026-07-03.md` — halo la mark thu 4,
  PHAI luon TRANG, khong bao gio violet, o moi trang thai. Proof cua task nay PHAI xac nhan halo van trang.
- Lookdev approval: `production/character/reviews/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1_APPROVAL.md` (V0.8.1 =
  ACTIVE_PREMIUM_LOOKDEV_REFERENCE, mau khe target blue-dominant violet `#9D0CEB`/`#9203E9`).
- Asset lock: `production/character/reviews/MIKAGE_STANDING_HERO_POLISH_V0_14_ASSET_LOCK.md` (geometry khoa).

## TASK
`MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1` - 1 task. CANDIDATE only. KHONG canon-lock/asset-lock moi.

## INPUT (2 file base - CHI 2 cai nay)
- GEOMETRY SOURCE (khoa, khong sua): `production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_14.blend`.
- MATERIAL SOURCE (tham chieu, khong sua cong thuc): `production/character/production_actor/rig_derivatives/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1.blend`.
- Bao `BASE_SELECTED` (ca 2) + `BODY_HASH_BEFORE` (cua V0.14) + `MATERIAL_RECIPE_HASH_BEFORE` (cua V0.8.1,
  neu co cach hash material node tree; neu khong, liet ke ten + gia tri cac material node lien quan).
- CAM: geometry RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4; khong import scene khac.

## GEOMETRY LOCKED (tu V0.14 - khong doi 1 ly nao)
KHONG doi ty le/silhouette/face-plane/crown/temple/jaw/slit placement/pose/camera-angle-goc/blade
position/halo geometry. Xac nhan `BODY_HASH` sau task = Y HET V0.14 truoc task.

## ALLOWED CHANGE (chi 1 thu - AP material, khong tu che)
- Ap dung bo material da duyet tu V0.8.1 (porcelain shell, graphite underlayer, blade material, 2 khe
  emission) LEN geometry cua V0.14. KHONG tu dieu chinh/tune lai cong thuc material - dung dung nhu
  V0.8.1 da duoc duyet (BOOS_APPROVAL = YES).
- Halo ring material: PHAI la TRANG matte/porcelain (theo HALO_RING_RULING_2026-07-03), KHONG duoc de
  hoac tao thanh violet o buoc nay du V0.8.1 hay V0.14 truoc day co the vinh material halo khac nhau -
  neu 1 trong 2 file nguon co halo khong-trang, FLAG trong proof, KHONG tu y sua ma khong bao cao.
- Neu material V0.8.1 khong co san mot phan nao do (vd blade material chua tung duoc lam trong dong
  lookdev do), giu nguyen material V0.14 cho phan do va FLAG ro trong proof (khong tu sang tac moi).

## GATE (bat buoc dung 2 file)
- `output_files_allowed` trong active_task.yaml (Lane B se set) = DUNG
  `contact_sheet.png` + `contact_sheet_review_report.md`.
- `contact_sheet.png` = contact sheet 4-panel (front / three-quarter / strict side / helmet close-up),
  3600x900, cung goc/khung hinh nhu cac contact sheet V0.14/turnaround da co, ANH SAU KHI HOP NHAT MATERIAL.
- `contact_sheet_review_report.md` = BASE_SELECTED (2 file) + BODY_HASH before/after (V0.14) + material
  nguon (V0.8.1) duoc ap nhu the nao (liet ke tung material node) + SLIT_HUE_PIXEL_SAMPLE truoc/sau +
  HALO_COLOR_CHECK (phai = white) + PASS/FAIL cac dieu kien duoi.

## OUTPUT (real deliverables, ngoai gate)
- `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend`
- `production/character/reviews/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1_CONTACT_SHEET.png`
- `production/character/reviews/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1_PROOF.md`

## VERIFY (bat buoc - day chinh la Gate A cua Lane A Roadmap)
- Reopen sach; BODY_HASH + transform + pose + camera + blade position + halo geometry KHONG doi vs V0.14.
- Render "y het turnaround tinh hien tai" ve pose/khung/goc (khong phai anh moi lay goc khac).
- SLIT_HUE_PIXEL_SAMPLE tren view front va view helmet close-up: phai doc violet gan `#8F00FF`
  (target blue-dominant `#9D0CEB`/`#9203E9` theo V0.8.1 approval), KHONG magenta/hong.
- VIOLET_OUTSIDE_TWO_SLITS = NO.
- HALO_COLOR_CHECK = WHITE, khong violet, o render nay (dormant state).
- Blade render dung trong khung, khong bien mat/tach roi khoi body.
- `.blend1` = NONE sau cleanup.
- `python .mikage/tools/verify_output.py` = PASS.

## FAIL CONDITIONS
- Geometry/pose/camera/blade-position/halo-geometry drift vs V0.14 -> `BLOCKER = INTEGRATION_GEOMETRY_DRIFT`,
  revert, KHONG tu y doi them.
- Khe van magenta/hong hoac violet lan ra ngoai khe -> `BLOCKER = SLIT_HUE_FAIL`.
- Halo doc ra violet/khong con trang -> `BLOCKER = HALO_COLOR_VIOLATION` (vi pham ruling 2026-07-03).
- Material V0.8.1 khong ap duoc len V0.14 vi ly do ky thuat (topology khac, node ten khac...) ->
  `BLOCKER = MATERIAL_TRANSPLANT_INCOMPATIBLE`, dung lai, bao cao chi tiet, KHONG tu sang tac material moi.
- Gate sai schema -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.

## KHONG DUOC LAM
- KHONG canon-lock / asset-lock / final / PASS / production-ready / verified (chi CANDIDATE).
- KHONG tu tune lai cong thuc material V0.8.1 (chi ap dung nhu da duyet).
- KHONG doi geometry/pose/camera cua V0.14.
- KHONG push. KHONG deploy. KHONG doi file khac ngoai danh sach tren.
- KHONG de file nao khac ngoai 2 file gate trong `_tmp/mikage_production_rig_lookdev_integration_v0_1_gate/`.
- Xong thi DUNG, cho owner review. Final visual ruling thuoc ve operator.
- Neu SSOT conflict hoac scope drift: dung va bao cao.
