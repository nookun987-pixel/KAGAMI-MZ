# LANE A / CODEX TASK BRIEF — MIKAGE ROBE LOCOMOTION TEST V0.1 (Exit 2 start, no visible limbs)
Soan: Lane B (Cowork) - 2026-07-03 - STATUS: DRAFT - KHOA toi khi BOOS mo exception #45 (Forty-fifth).
Governed by AGENTS.md "Forty-fifth controlled exception" (`MIKAGE_ROBE_LOCOMOTION_TEST_V0_1`).

> Boi canh: Exit 1 (#43/#44) da xong toan bo. Theo dung roadmap, buoc tiep theo la Exit 2 (Stage C
> locomotion - can Mikage DI THAT). Truoc khi mo, Lane B kiem tra lai master reference goc
> (`production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png`) va phat hien: "VOID BODY MASS
> / DRAPED ROBE" la 1 trong 5 Immutable Identity Marks da khoa - Mikage KHONG duoc lo tay/chan rieng
> biet, toan bo than la 1 khoi ao choang lien tuc. Mesh 3D hien tai (`single_closed_draped_void_cloak`)
> dung theo canon nay, KHONG phai thieu sot. BOOS ruling 2026-07-03: lam locomotion bang cach LAC KHOI
> AO (1 mesh lien tuc dung dan hoi/dong tac lac), KHONG tao mesh tay/chan lo ra ngoai duoi bat ky hinh
> thuc nao. Day la 1 TEST kha thi (khong phai walk cycle hoan chinh cho Stage D), tren nhan vat rieng
> (chua ket hop moi truong).

## SOURCE OF TRUTH
- Nhan vat: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend`
  (rig 7-bone, PASS #40/#41). KHONG dung ban da ket hop moi truong - test rieng nhan vat truoc.
- Canon rang buoc: `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (VOID BODY MASS
  / DRAPED ROBE = immutable, KHONG duoc lo tay/chan).
- Halo ruling: `docs/handoff/HALO_RING_RULING_2026-07-03.md` (halo PHAI luon TRANG).

## TASK
`MIKAGE_ROBE_LOCOMOTION_TEST_V0_1` - 1 task. TEST KHA THI, KHONG phai walk cycle hoan chinh/final.

## BUOC 1 - THEM TOI DA 2 BONE PHU TRO (KHONG phai bone tay/chan)
- Duoc phep them TOI DA 2 bone MOI, la con cua `root`, CHI de tao chuyen dong lac/dan hoi cho phan
  duoi khoi ao (hem sway) - vi du `hem_sway_01`/`hem_sway_02`. Cac bone nay KHONG duoc mang hinh dang
  hay chuc nang cua chan/dui/goi - chi la helper bien dang vai lien tuc cua mesh ao, KHONG tao ra bat
  ky duong vien/khoang ho nao goi y co chan rieng ben trong.
- KHONG tao bat ky bone nao dat ten hoac dinh vi giong tay/chan (arm/leg/hand/foot/thigh/shin/knee/
  elbow/shoulder). Neu can ten, dung ten trung tinh nhu "hem_swing" hoac "drape_secondary".
- Bao cao ro vi tri/muc dich tung bone moi them.

## BUOC 2 - DONG TAC (robe-glide, KHONG buoc chan lo ra)
- `root` di chuyen tien ve truoc 1 khoang ngan (vd 1-2m) qua thoi luong test, kem 1 nhun len-xuong nhe
  (bob nho, khong qua ro) va hoi nghieng/lac luan phien 2 ben (gia lap trong luong chuyen doi nhu buoc
  di, NHUNG khong co chan/buoc chan hien ra).
- 2 bone hem-sway (neu dung) dao dong nhe de tao hieu ung vai/ao lac o phan duoi trong luc di chuyen.
- Khoi ao (`MASTER_MATCH_single_closed_draped_void_cloak`) PHAI luon la 1 khoi kin lien tuc - KHONG
  duoc xuat hien khoang ho/duong tach o day ao goi y co chan ben trong tai bat ky khung hinh nao.
- Helmet/halo/2 khe van gan cung vao `head` nhu cu (khong doi). Blade van gan cung vao `root` nhu cu
  (khong doi - blade di theo root khi root di chuyen, hop ly vi blade "canh nguoi").

## RANH GIOI - KHONG DUOC LAM
- KHONG tao bat ky mesh moi nao (dac biet KHONG mesh tay/chan/ban chan duoi bat ky hinh thuc nao).
- KHONG de khoi ao ho/tach lo ra khoang trong ben duoi tai bat ky khung hinh nao (vi pham VOID BODY MASS).
- KHONG doi geometry/silhouette goc cua mesh (chi them bien dang/dan hoi qua bone moi).
- KHONG doi mau khe/halo. KHONG lam animation blade rieng (blade van rigid theo root).
- KHONG render final/marketing. KHONG canon-lock/asset-lock/walk-cycle-final claim (chi la TEST).
- KHONG push. KHONG deploy.

## GATE (dung 2 file)
- `contact_sheet.png` = vai khung hinh dai dien qua chu ky di chuyen (dau/giua/cuoi), cho thay khoi ao
  lac tu nhien, KHONG lo khoang ho/chan.
- `contact_sheet_review_report.md` = vi tri/muc dich bone moi, mo ta dong tac (khoang cach di chuyen,
  bien do bob/lac), xac nhan khoi ao luon kin (khong ho), xac nhan halo/slit mau dung, xac nhan file
  nguon khong doi (neu co doi chieu).

## OUTPUT (real deliverables)
- `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_LOCOMOTION_TEST_V0_1.blend`
- `production/character/reviews/MIKAGE_ROBE_LOCOMOTION_TEST_V0_1.mp4`
- `production/character/reviews/MIKAGE_ROBE_LOCOMOTION_TEST_V0_1_KEYFRAMES.png`
- `production/character/reviews/MIKAGE_ROBE_LOCOMOTION_TEST_V0_1_PROOF.md`

## VERIFY
- Toi da 2 bone moi them, ten/vi tri/muc dich khong giong tay/chan.
- Khoi ao luon la 1 mesh kin lien tuc, khong ho/tach o bat ky khung hinh nao (VOID_BODY_MASS_INTACT = YES).
- Halo trang, slit hue dung `#8F00FF`, khong doi. Blade khong animate rieng, van rigid-to-root.
- `.blend1` = NONE. Gate dung 2 file (mp4 khong nam trong gate). `python .mikage/tools/verify_output.py` = PASS.

## FAIL CONDITIONS
- Khoi ao ho/lo khoang trong goi y co chan -> `BLOCKER = VOID_BODY_MASS_VIOLATION`.
- Tao mesh/bone dang tay/chan -> `BLOCKER = LIMB_GEOMETRY_VIOLATION`.
- Halo/slit doi mau -> `BLOCKER = HALO_COLOR_VIOLATION` / `SLIT_HUE_FAIL`.
- Blade animate rieng ngoai rigid-root -> `BLOCKER = SCOPE_VIOLATION`.
- Gate sai schema -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.

## SAU KHI PASS
- Day la TEST kha thi dau tien cho robe-glide locomotion. Lane B + operator xem xet: co thuyet phuc
  nhu "di chuyen" khong lo chan, co can tinh chinh them (bien do/toc do), truoc khi lam walk cycle
  chinh thuc (Stage D) hay ket hop lai voi moi truong hanh lang.
- Neu SSOT conflict hoac scope drift (vd phat hien can lo chan moi di chuyen thuyet phuc duoc): dung
  va bao cao cho Lane B/operator quyet dinh canon, KHONG tu y doi thiet ke.
