# LANE A / CODEX TASK BRIEF — MIKAGE PRODUCTION RIG BIND V0.1 (first real bind of the visible mesh)
Soan: Lane B (Cowork) - 2026-07-03 - STATUS: DRAFT - KHOA toi khi BOOS mo exception #38 (Thirty-eighth).
Governed by AGENTS.md "Thirty-eighth controlled exception" (`MIKAGE_PRODUCTION_RIG_BIND_V0_1`).
Day la buoc chuan bi thay the cho task "nang cap weight-paint" ban dau du kien - audit
(`MIKAGE_PRODUCTION_RIG_ARMATURE_AUDIT_V0_1`, exception #37, PASS) phat hien viec can lam LON HON:

> Armature `MIKAGE_initial_armature_scaffold` (23 bone: root/pelvis/spine_01/spine_02/chest/neck/head/
> clavicle.L-R/upper_arm.L-R/forearm.L-R/hand.L-R/thigh.L-R/shin.L-R/foot.L-R/toe.L-R) CHI dang gan vao
> 29 mesh KHOI CU (legacy blockout, dang AN, khong hien thi). Hinh dang THAT dang hien thi (helmet/ao/
> blade/halo hien tai, ten kieu `PUBLIC_BLOCK_...`, `MASTER_MATCH_white_halo_ring`) hoan toan CHUA
> gan vao xuong nao - khong Armature modifier, khong vertex group, khong parent. Nghia la nhan vat
> dang thay trong render dep KHONG THE cu dong duoc - no la static mesh thuan tuy.
> Task nay = gan LAN DAU hinh dang that dang hien thi vao bo xuong co san (khong tao xuong moi, khong
> doi so luong/vi tri bone), voi deform MEM (blend nhieu group) o cac vung than/ao co the/can cong,
> va gan CUNG (rigid parent, khong deform mem) cho cac phu kien cung (helmet/blade/halo) vi day la
> vat cung khong can bien dang nhu vai.

## SOURCE OF TRUTH
- File: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend`
  (PASS o exception #36, CANDIDATE).
- Audit vua xong: `docs/reports/MIKAGE_PRODUCTION_RIG_ARMATURE_AUDIT_V0_1.md` (exception #37, PASS) -
  DOC KY truoc khi lam, day la nguon du lieu chinh xac nhat ve tinh trang hien tai.
- Halo ruling: `docs/handoff/HALO_RING_RULING_2026-07-03.md` (halo PHAI luon trang).
- Master 2D: `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png`.

## TASK
`MIKAGE_PRODUCTION_RIG_BIND_V0_1` - 1 task. CANDIDATE only. Day la buoc chuan bi TRUOC Stage B
(8-pose deformation test) - khong phai Stage B chinh no.

## INPUT (1 file base)
- `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend`.
  Bao BASE_SELECTED + FULL_STATE_HASH_BEFORE.

## BUOC 1 - KHAO SAT (bat buoc lam va bao cao TRUOC khi bind)
- Liet ke TOAN BO mesh object dang VISIBLE + render-enabled trong file (khong tinh cac mesh legacy
  an di da liet ke trong audit #37). Voi moi mesh: ten, hinh dang tong quat (vd "1 khoi ao lien tu
  vai xuong chan", "helmet rieng", "2 tam blade rieng", "1 vong halo"), va no TUONG UNG voi vung than
  the nao (head/torso-cloak/blade/halo/khac).
- Dua tren khao sat that (khong dua theo suy doan truoc), quyet dinh mesh nao can DEFORM MEM (theo
  than/ao co kha nang cong - vd khi cui nguoi, xoay hong) va mesh nao chi can GAN CUNG (helmet/blade/
  halo/phu kien cung - khong deform, chi di theo 1 bone nhu vat cung that su gan vao nguoi).

## BUOC 2 - GAN XUONG (allowed change)
- CHI dung bo xuong co san `MIKAGE_initial_armature_scaffold` (23 bone). KHONG them/bot/doi vi tri bone.
- Mesh THAN/AO (deform mem): gan Armature modifier + vertex group, CHO PHEP mem o cac vung khop
  (vd vung eo/hong giua pelvis-spine_01-spine_02-chest neu ao la 1 khoi lien tu vai den chan) sao cho
  KHONG bi rach/xuyen khi test pose sau nay. Day la lan dau co deform mem that (khac voi 29 mesh cu
  chi rigid 1-group).
- Mesh HELMET/BLADE/HALO (gan cung, khong deform): dung Child-Of constraint hoac Armature modifier
  VOI DUNG 1 group weight=1.0 (rigid, khong blend) toi bone tuong ung (head cho helmet+halo, hand.R
  cho blade neu blade phai di theo tay - neu blade dang la 1 vat dat CANH nguoi khong cam tay, co the
  giu tinh la static/parent vao root/pelvis thay vi hand.R - QUYET dua tren hinh dang that, bao cao ro
  ly do chon).
- HALO: theo `docs/handoff/HALO_RING_RULING_2026-07-03.md`, PHAI giu mau TRANG - task nay CHI gan
  transform (di theo dau khi xoay), KHONG duoc doi material/mau cua halo.
- KHONG tao mesh moi, KHONG doi geometry/silhouette cua bat ky mesh nao, KHONG doi material nao
  (ke ca cua helmet/ao/blade/halo/khe) - CHI them binding (modifier/constraint/vertex-group).

## RANH GIOI - KHONG DUOC LAM
- KHONG doi bo xuong (them/bot/di chuyen bone).
- KHONG doi geometry/silhouette/proportions cua bat ky mesh nao.
- KHONG doi material/mau cua bat ky thu gi (giu nguyen tu V0.8.1 da tich hop o exception #36).
- KHONG pose thu trong task nay ngoai 1 pose test NHE de kiem tra binding hoat dong (vd xoay chest
  nhe 10-15 do de xem ao co theo khong bi rach) - KHONG lam 8-pose deformation test day du (do la
  Stage B, task rieng sau khi binding nay PASS).
- KHONG render final/marketing - chi render kiem tra binding (co the dung goc don gian).
- KHONG sua 29 mesh legacy an di (giu nguyen tu audit #37, khong dung/xoa).
- KHONG canon-lock/asset-lock/production-rig-ready claim.

## GATE (dung 2 file)
- `contact_sheet.png` = anh kiem tra binding: it nhat 1 goc THUONG (T-pose/pose hien tai) + 1 goc SAU
  KHI xoay/nghieng nhe de chung minh binding hoat dong khong rach/xuyen. 3600x900 hoac tuong duong,
  rieng cua ban.
- `contact_sheet_review_report.md` = ket qua khao sat Buoc 1 (danh sach mesh + phan loai deform-mem/
  gan-cung) + chi tiet binding da lam cho tung mesh (group nao, weight nao) + ket qua test pose nhe +
  HALO_COLOR_CHECK (van trang) + BODY/MATERIAL hash truoc-sau (phai KHONG doi ngoai phan binding).

## OUTPUT (real deliverables)
- `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_BIND_V0_1.blend`
- `production/character/reviews/MIKAGE_PRODUCTION_RIG_BIND_V0_1_CONTACT_SHEET.png`
- `production/character/reviews/MIKAGE_PRODUCTION_RIG_BIND_V0_1_PROOF.md`

## VERIFY
- Geometry/silhouette/material cua tat ca mesh KHONG doi (chi them binding, khong doi mesh data/material node).
- Bone count/vi tri KHONG doi (van 23 bone y het).
- Test pose nhe (10-15 do) khong lam ao/than rach/xuyen ro rang.
- HALO_COLOR_CHECK = trang.
- `.blend1` = NONE.
- `python .mikage/tools/verify_output.py` = PASS.

## FAIL CONDITIONS
- Geometry/material bi doi ngoai y muon -> `BLOCKER = BIND_SIDE_EFFECT_DRIFT`.
- Test pose nhe van rach/xuyen nghiem trong -> `BLOCKER = BIND_INSUFFICIENT` (bao cao ro vung loi,
  KHONG tu y mo rong sang sua mesh/geometry de vay).
- Halo doi mau -> `BLOCKER = HALO_COLOR_VIOLATION`.
- Gate sai schema -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.

## SAU KHI PASS
- Day la dieu kien can (khong phai Stage B). Sau PASS, Lane B se soan RIENG task Stage B (8-pose
  deformation test day du) tren file `MIKAGE_PRODUCTION_RIG_BIND_V0_1.blend` nay.
- Neu SSOT conflict hoac scope drift: dung va bao cao.
