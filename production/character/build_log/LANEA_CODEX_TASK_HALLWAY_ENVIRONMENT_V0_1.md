# LANE A / CODEX TASK BRIEF — MIKAGE HALLWAY ENVIRONMENT V0.1 (new set, void-black corridor)
Soan: Lane B (Cowork) - 2026-07-03 - STATUS: DRAFT - KHOA toi khi BOOS mo exception #42 (Forty-second).
Governed by AGENTS.md "Forty-second controlled exception" (`MIKAGE_HALLWAY_ENVIRONMENT_V0_1`).

> Boi canh: Roadmap Stage E (`MIKAGE_LANE_A_ROADMAP.html`) mo ta canh cinematic proof shot la "Mikage
> hanh lang toi". Ra soat toan bo repo xac nhan CHUA TUNG co asset moi truong/hanh lang nao - moi render
> nhan vat tu truoc den gio chi dung nen void-black `#050508` phang (dung recipe lookdev da khoa trong
> AGENTS.md), khong co set/geometry moi truong. BOOS ruling 2026-07-03: mo task RIENG xay 1 hanh lang
> toi don gian TRUOC khi lam Exit 1 (cinematic proof shot). Day la loai task MOI (environment/set build),
> khac voi cac task rig/character truoc gio.

## SOURCE OF TRUTH (brand canon - PHAI theo dung)
- Palette LOCK: void black `#050508` (chu dao), porcelain `#f2eeea` (accent RAT han che, co the bo qua),
  electric violet `#8F00FF`/secondary `#7B2FFF` la SIGNAL (chi cho 2 khe cam bien nhan vat) - KHONG
  dung violet trong moi truong/set nay duoi bat ky hinh thuc nao (khong day den violet, khong wash mau).
- Aesthetic: wide negative space, near-zero radius (goc canh sac, brutalist), hairline chi tiet, fine
  grain, khong neon, khong gaming HUD, khong fantasy/samurai, khong clutter.
- Lookdev recipe da khoa (AGENTS.md): "Environment = void-black #050508; single directional key light...
  NO cyberpunk/neon lighting, no colored wash" - ap dung nguyen tac nay cho ca set moi truong nay.
- Nhan vat doi chieu (KHONG sua): `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend`
  (rig moi 7-bone, PASS o exception #40/#41).

## TASK
`MIKAGE_HALLWAY_ENVIRONMENT_V0_1` - 1 task. Xay MOI 1 environment set, KHONG dung/sua file nhan vat
hien co. Day la file/asset loai MOI trong repo (chua tung co truoc `production/environment/`).

## BUOC 1 - XAY SET (moi truong)
- Tao 1 file .blend MOI: mot hanh lang/corridor don gian, toi, dai (perspective converge ve 1 diem xa),
  tuong + san + (co the) tran, hinh khoi don gian (khong chi tiet ruom ra), mau toi thuoc ho void-black
  (co the co bien do sang toi/graphite de doc duoc chieu sau, KHONG dung porcelain sang ro hay violet).
- 1 bo den toi thieu: 1 key light lanh, mo, doc theo hanh lang (co the co vai diem sang phu/rim de doc
  duoc do sau/tuong), KHONG anh sang mau, KHONG neon, KHONG wash toan canh.
- Khong dat nhan vat vao file goc cua set - set phai la 1 file doc lap, sach, co the tai su dung.

## BUOC 2 - TEST TUONG THICH (KHONG PHAI CINEMATIC)
- Trong 1 file/scene RIENG (vd ban sao lam viec, KHONG sua file set goc va KHONG sua file nhan vat goc):
  dat nhan vat (tu `MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend`, pose neutral, KHONG doi geometry/rig) dung
  o 1 vi tri hop ly trong hanh lang, kiem tra ty le (scale) va bo cuc camera co hop ly khong.
- Render 2 goc don gian: (1) hanh lang trong (khong nhan vat), (2) hanh lang + nhan vat dung o vi tri
  danh dau, cung 1 camera/goc nhin, KHONG dong (khong push-in, khong animation).
- Day la kiem tra ty le/tuong thich TINH - KHONG phai canh cinematic Exit 1 (se la task rieng sau).

## RANH GIOI - KHONG DUOC LAM
- KHONG sua file nhan vat goc `MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend` (chi doc/tham chieu de test ty le).
- KHONG dung violet trong bat ky vat lieu/anh sang nao cua moi truong.
- KHONG lam animation/camera push-in/slit ignite trong task nay - do la Exit 1 (task rieng, sau).
- KHONG dung/sua bo xuong cu hoac 29 mesh legacy cua nhan vat.
- KHONG render final/marketing. KHONG canon-lock/asset-lock/production-ready claim (moi truong nay la
  CANDIDATE, chua phai canon location).
- KHONG push. KHONG deploy.

## GATE (dung 2 file)
- `contact_sheet.png` = 2 goc (hanh lang trong / hanh lang + nhan vat), nhan ro moi goc.
- `contact_sheet_review_report.md` = mo ta hinh dang set, vat lieu/mau dung (xac nhan KHONG co violet),
  ty le nhan vat trong khung co hop ly khong, ghi chu ky thuat (kich thuoc hanh lang, vi tri camera).

## OUTPUT (real deliverables)
- `production/environment/sets/MIKAGE_HALLWAY_ENVIRONMENT_V0_1.blend` (set doc lap, KHONG co nhan vat).
- `production/environment/reviews/MIKAGE_HALLWAY_ENVIRONMENT_V0_1_CONTACT_SHEET.png`
- `production/environment/reviews/MIKAGE_HALLWAY_ENVIRONMENT_V0_1_PROOF.md`

## VERIFY
- File nhan vat goc KHONG bi sua (hash truoc/sau giong het, bao CHARACTER_FILE_MODIFIED = NO).
- Vat lieu/anh sang moi truong KHONG co violet o bat ky diem nao (VIOLET_IN_ENVIRONMENT = NO).
- Set la 1 file doc lap, co the tai su dung rieng khong can nhan vat.
- Gate dung 2 file. `python .mikage/tools/verify_output.py` = PASS. `.blend1` = NONE.

## FAIL CONDITIONS
- File nhan vat goc bi sua -> `BLOCKER = CHARACTER_FILE_MODIFIED`.
- Violet xuat hien trong moi truong (vat lieu/anh sang) -> `BLOCKER = VIOLET_IN_ENVIRONMENT`.
- Set khong tach biet duoc voi nhan vat (phu thuoc cung 1 file) -> `BLOCKER = SET_NOT_STANDALONE`.
- Gate sai schema -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.

## SAU KHI PASS
- Day la nen tang moi truong cho Exit 1. Sau PASS, Lane B soan task rieng lam canh cinematic that
  (dormant -> ignite, camera push-in cham, nghieng dau/dich trong luong, cut to black) tren set nay.
- Neu SSOT conflict hoac scope drift: dung va bao cao.
