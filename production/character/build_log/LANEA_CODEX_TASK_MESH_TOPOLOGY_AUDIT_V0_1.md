# LANE A / CODEX TASK BRIEF — MIKAGE MESH TOPOLOGY + SKELETON-FIT AUDIT V0.1
Soan: Lane B (Cowork) - 2026-07-03 - STATUS: DRAFT - KHOA toi khi BOOS mo exception #39 (Thirty-ninth).
Governed by AGENTS.md "Thirty-ninth controlled exception" (`MIKAGE_MESH_TOPOLOGY_AUDIT_V0_1`).
READ-ONLY AUDIT - KHONG sua/tao/xoa bat ky object/mesh/armature/material nao. Chi doc va bao cao.

> Boi canh: exception #38 (`MIKAGE_PRODUCTION_RIG_BIND_V0_1`) dung dung theo stop-condition -
> `BLOCKER = BIND_SIDE_EFFECT_DRIFT`: khong gian bo xuong `MIKAGE_initial_armature_scaffold` (23 bone,
> dung cho hinh khoi CU) khong khop voi hinh dang THAT dang hien thi (helmet/ao/blade/halo hien tai).
> Ngay o neutral pose, gan binding lam helmet/ao/blade tach/xoay lech nghiem trong. Truoc khi quyet
> dinh sua vi tri 23 bone cu hay lam bo xuong moi, can biet CHINH XAC hinh dang/topology that dang
> hien thi (ao la 1 khoi lien tu vai xuong chan, hay co cac phan tay/chan tach rieng nhu thiet ke cu?)
> va so sanh KHONG GIAN cu the giua mesh va bone hien co.

## SOURCE OF TRUTH
- File can audit: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend`
  (KHONG doi tu exception #36 - candidate loi cua #38 da bi xoa, day van la file goc).
- Doi chieu: `docs/reports/MIKAGE_PRODUCTION_RIG_ARMATURE_AUDIT_V0_1.md` (audit #37 - danh sach 23 bone
  + 29 mesh legacy da gan).
- Master 2D: `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png`.

## TASK
`MIKAGE_MESH_TOPOLOGY_AUDIT_V0_1` - 1 task. AUDIT ONLY, khong tao deliverable san xuat, khong sua gi.

## CAU HOI CAN TRA LOI (bao cao het, khong bo sot)
1. Liet ke TOAN BO mesh object VISIBLE + render-enabled (khong tinh 29 mesh legacy an di da audit
   o #37). Voi moi mesh: ten, bounding-box dimensions (world space, X/Y/Z), va mo ta hinh dang
   (vd "1 khoi lien tuc tu vai xuong chan, khong tach doan", "helmet rieng biet", "2-3 mieng blade
   rieng", "1 vong halo").
2. Hinh dang THAN/AO hien tai: co phai 1 KHOI LIEN TUC (khong co mesh tay/chan tach rieng ro rang
   nhu thiet ke cu blockout), hay van co cac phan tach biet (upper arm / forearm / thigh / shin rieng)?
   Day la cau hoi quan trong nhat - anh huong truc tiep den viec co can day du 23 bone hay khong.
3. Bounding box + vi tri world-space cua TUNG bone trong `MIKAGE_initial_armature_scaffold` (23 bone,
   head + tail position cua moi bone), de so sanh voi bounding box mesh o cau 1.
4. Voi moi cap (bone, mesh tuong ung ve mat ten/chuc nang), tinh khoang cach/lech giua vi tri bone va
   vi tri thuc te cua phan mesh do (vd bone `upper_arm.L` nam o dau so voi vung vai/tay cua mesh ao
   hien tai - neu ao la 1 khoi lien tuc thi khong co "vung tay" ro rang, ghi ro dieu do).
5. Uoc luong: SO BONE THUC SU CAN THIET cho hinh dang hien tai la bao nhieu va o dau (vd neu ao la
   1 khoi lien tuc chi can uon o vung eo/hong/nguc, co the chi can 4-6 bone: root/pelvis/spine_01/
   spine_02/chest/neck/head, khong can rieng tay/chan) - day la UOC LUONG DE THAM KHAO, khong phai
   quyet dinh cuoi, Lane B/operator se quyet dua tren so lieu nay.
6. Blade (cac mesh PUBLIC_BLOCK*blade*) va halo (`MASTER_MATCH_white_halo_ring`): vi tri world-space
   + kich thuoc, de xac dinh chung can gan vao bone nao (head cho halo; kiem tra xem blade dang dat
   canh nguoi hay dinh vao tay - dua theo vi tri thuc te, khong doan).
7. Khong pose, khong render moi (dung anh co san cho gate neu can), khong sua bat ky thu gi.

## GATE (dung 2 file - giu dung schema)
- `contact_sheet.png` = anh co san (tu proof #36 hoac tuong tu) - khong bat buoc render moi.
- `contact_sheet_review_report.md` = tom tat 7 cau tra loi tren.

## OUTPUT (real deliverable)
- `docs/reports/MIKAGE_MESH_TOPOLOGY_AUDIT_V0_1.md` (bao cao day du, khong gioi han do dai).
- KHONG co blend moi - day la audit, khong phai build task.

## VERIFY
- File nguon KHONG bi sua (SHA-256 truoc/sau giong het, bao MESH_AUDIT_FILE_MODIFIED = NO).
- `.blend1` = NONE sau task.
- `python .mikage/tools/verify_output.py` = PASS.

## FAIL CONDITIONS
- File nguon bi doi -> `BLOCKER = MESH_AUDIT_FILE_MODIFIED`.
- Khong mo doc duoc -> `BLOCKER = FILE_UNREADABLE`.
- Gate sai schema -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.

## KHONG DUOC LAM
- KHONG sua/tao/xoa bat ky thu gi trong file duoc audit.
- KHONG pose, KHONG render moi.
- KHONG tu y mo rong sang lam task sua-xuong/lam-xuong-moi trong luot nay - CHI audit va bao cao.
- KHONG push. KHONG deploy.
- KHONG de file nao khac ngoai 2 file gate trong `_tmp/mikage_mesh_topology_audit_v0_1_gate/`.
- Xong thi DUNG, cho Lane B doc bao cao roi moi quyet: sua vi tri 23 bone cu, hay lam bo xuong moi
  cho hinh hien tai (quyet dinh nay thuoc ve operator, dua tren so lieu that tu audit nay).
- Neu SSOT conflict hoac scope drift: dung va bao cao.
