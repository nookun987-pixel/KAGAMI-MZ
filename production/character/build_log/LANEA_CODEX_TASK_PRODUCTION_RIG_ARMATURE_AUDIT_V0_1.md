# LANE A / CODEX TASK BRIEF — MIKAGE PRODUCTION RIG ARMATURE AUDIT V0.1
Soan: Lane B (Cowork) - 2026-07-03 - STATUS: DRAFT - KHOA toi khi BOOS mo exception #37 (Thirty-seventh).
Governed by AGENTS.md "Thirty-seventh controlled exception" (`MIKAGE_PRODUCTION_RIG_ARMATURE_AUDIT_V0_1`).
Day la buoc CHUAN BI cho Stage B (deformation test, 8 pose tinh) trong `MIKAGE_LANE_A_ROADMAP.html`.
READ-ONLY AUDIT - KHONG sua/tao/xoa bat ky object/mesh/armature/material nao. Chi doc va bao cao.

> Ly do can audit truoc khi lam Stage B: `docs/reports/LANE_A_RIG_REPAIR_EXECUTION_RESULT_V0_1.md`
> (PASS, 2026-06-13) ghi nhan armature `MIKAGE_initial_armature_scaffold` + 29 mesh gan
> ONE_GROUP_RIGID_PROXY (moi mesh dinh CUNG vao dung 1 xuong, khong blend mem giua khop) - nhung
> tren file `MIKAGE_PRODUCTION_ACTOR_RIG_REPAIR_PASS_V0_1_FROM_FIRST_MOTION_TEST_V0_1.blend`, VOI
> TEN MESH HOAN TOAN KHAC (vd `arm_left_simple_black_column`, `torso_tapered_black_core`...) so voi
> file production hien tai `MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend` (dung ten nhu
> "master faceless helmet", "cloak and neck underlayer" theo proof V0.1). CHUA RO file hien tai co
> ke thua armature nay khong, hay hoan toan chua co rig. Can biet chinh xac truoc khi mo task
> nang cap weight-paint, tranh lam sai huong.

## SOURCE OF TRUTH
- File can audit: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend`
  (vua duoc tao o exception #36, PASS, CANDIDATE only).
- Doi chieu: `docs/reports/LANE_A_RIG_REPAIR_EXECUTION_RESULT_V0_1.md` (rig repair PASS cu, file khac).
- AGENTS.md dong 549 (va cac cho khac): "Production rig remains NO" - flag hien hanh, can xac nhan
  con dung voi file MOI nay khong.

## TASK
`MIKAGE_PRODUCTION_RIG_ARMATURE_AUDIT_V0_1` - 1 task. AUDIT ONLY, khong tao deliverable san xuat.

## INPUT (CHI doc, khong sua)
- `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend`
- `docs/reports/LANE_A_RIG_REPAIR_EXECUTION_RESULT_V0_1.md` (tham khao, khong sua)
- `production/character/reviews/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1_PROOF.md` (tham khao)

## CAU HOI CAN TRA LOI (bao cao het, khong bo sot)
1. File nay co object Armature nao khong? Neu co, ten gi? Co phai `MIKAGE_initial_armature_scaffold`
   (ke thua tu dong repair cu) hay armature moi/khac?
2. Neu co armature: liet ke TOAN BO mesh dang deform (co Armature modifier tro toi no), moi mesh
   dang gan vao BAO NHIEU vertex group (1 group = rigid proxy cung, >=2 group voi trong so blend =
   soft deformation that).
3. Neu KHONG co armature nao: xac nhan ro "NO_ARMATURE_FOUND = TRUE", day la static mesh thuan tuy.
4. Danh sach khop can co de test Stage B (vai/khuyu tay/hong/goi/cot song) - hien co ton tai bone
   nao tuong ung khong (dua theo ten group neu co, vd shoulder/elbow/hip/knee/spine hoac tuong duong)?
5. Neu co armature nhung binding la rigid-1-group (nhu file cu), xac nhan ro dieu do o day.
6. Blade (`sword_right_...` hoac ten tuong duong trong file nay) va halo dang bind vao dau (bone nao,
   hay parent truc tiep vao 1 object khac khong qua armature)?
7. KHONG thu pose/render gi trong task nay - chi doc metadata/node-tree/vertex-group cua file, giong
   cach `LANE_A_RIG_REPAIR_EXECUTION_RESULT_V0_1.md` da lam (metadata inspection, non-render).

## GATE (bat buoc dung 2 file - VAN theo dung convention, du day la audit)
- `output_files_allowed` = `contact_sheet.png` + `contact_sheet_review_report.md`.
- `contact_sheet.png` o day CHO PHEP la 1 anh don gian (vd screenshot outliner/vertex-group list, hoac
  1 render tinh KHONG doi gi, dung anh co san tu proof V0.1 neu khong can render moi) - MUC DICH la
  giu dung schema gate, khong bat buoc phai la contact-sheet 4-panel nhu cac task khac.
- `contact_sheet_review_report.md` = tra loi day du 7 cau hoi tren, cang chi tiet cang tot (ten tung
  mesh + tung vertex group + so luong).

## OUTPUT (real deliverables, ngoai gate)
- `docs/reports/MIKAGE_PRODUCTION_RIG_ARMATURE_AUDIT_V0_1.md` (bao cao day du, khong gioi han do dai,
  la ban chinh cua 7 cau tra loi tren).
- KHONG co blend moi nao duoc tao - day la audit, khong phai build task.

## VERIFY (bat buoc)
- File nguon `MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend` KHONG bi sua (byte-identical
  truoc/sau, bao ARMATURE_AUDIT_FILE_MODIFIED = NO).
- Khong co object/mesh/material/armature nao bi tao/xoa/doi trong qua trinh audit.
- `.blend1` = NONE sau task (neu Blender tu tao khi mo file de doc, phai don sach).
- `python .mikage/tools/verify_output.py` = PASS.

## FAIL CONDITIONS
- File nguon bi thay doi du chi 1 byte -> `BLOCKER = AUDIT_FILE_MODIFIED` (vi pham audit read-only).
- Khong the mo file de doc metadata -> `BLOCKER = FILE_UNREADABLE`, bao cao chi tiet loi.
- Gate sai schema -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.

## KHONG DUOC LAM
- KHONG sua/tao/xoa bat ky thu gi trong file .blend duoc audit.
- KHONG pose, KHONG render moi (dung anh co san neu can dien vao gate).
- KHONG tu y mo rong sang lam task rig-upgrade trong luot nay - day CHI la audit, doc va bao cao.
- KHONG push. KHONG deploy.
- KHONG de file nao khac ngoai 2 file gate trong `_tmp/mikage_production_rig_armature_audit_v0_1_gate/`.
- Xong thi DUNG, cho Lane B doc bao cao roi moi quyet buoc ke tiep (rig-upgrade task, pham vi se
  duoc soan RIENG dua tren ket qua audit nay).
- Neu SSOT conflict hoac scope drift: dung va bao cao.
