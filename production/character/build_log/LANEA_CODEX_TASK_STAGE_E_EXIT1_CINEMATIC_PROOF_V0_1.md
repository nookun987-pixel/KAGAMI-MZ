# LANE A / CODEX TASK BRIEF — MIKAGE STAGE E EXIT 1 CINEMATIC PROOF SHOT V0.1
Soan: Lane B (Cowork) - 2026-07-03 - STATUS: DRAFT - KHOA toi khi BOOS mo exception #43 (Forty-third).
Governed by AGENTS.md "Forty-third controlled exception" (`MIKAGE_STAGE_E_EXIT1_CINEMATIC_PROOF_V0_1`).

> Boi canh: rig (#40 PASS) + Gate B axial-only (#41 PASS) + hanh lang moi truong (#42 PASS) deu xong.
> Roadmap Stage E dinh nghia canh: "Mikage hanh lang toi, khe dormant -> camera push-in cham -> khe
> ignite violet -> (Exit 2) buoc 3-5 buoc -> dung -> ha Zenith Blade canh nguoi -> cut to black."
> EXIT 1 (BOOS chon 2026-07-03) = BO QUA buoc di (khong co bone/mesh chan de di), CHI con: dung + ignite
> + nghieng dau/dich trong luong nhe + blade da nam san trong khung (rigid o root, khong doi) + camera
> push-in + cut to black. Day la PROOF SHOT dau tien ket hop CA 3 thu: rig, environment, sensor-anim,
> camera - KHONG phai canh final/marketing.

## SOURCE OF TRUTH
- Nhan vat: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend`
  (rig 7-bone, PASS #40/#41 - dung ban nay, KHONG dung ban Stage B vi ban do co pose test da bake).
- Moi truong: `production/environment/sets/MIKAGE_HALLWAY_ENVIRONMENT_V0_1.blend` (PASS #42, doc lap,
  camera tham khao da xac nhan tai `(0,-10,2.45)` 48mm, target `(0,10,2.25)`, nhan vat dat o `(0,8,0)`).
- Halo ruling: `docs/handoff/HALO_RING_RULING_2026-07-03.md` (halo PHAI luon TRANG).
- Tham khao duong cong slit (KHONG bat buoc giong het, chi tham khao): exception #33
  (`MIKAGE_STANDING_HERO_MOTION_V0_2`, dormant ~2% cua peak, ignite nhanh ~60-75% clip).

## TASK
`MIKAGE_STAGE_E_EXIT1_CINEMATIC_PROOF_V0_1` - 1 task. CANDIDATE / PROOF SHOT only, KHONG phai final.

## BUOC 1 - KET HOP (KHONG sua 2 file goc)
- Tao 1 file .blend MOI (derivative), append/link nhan vat (`MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend`,
  pose neutral) + moi truong (`MIKAGE_HALLWAY_ENVIRONMENT_V0_1.blend`) vao CHUNG 1 scene, dat nhan vat
  dung vi tri da xac nhan o exception #42 (marker `(0,8,0)`). 2 file goc KHONG duoc sua (bao
  CHARACTER_FILE_MODIFIED = NO, ENVIRONMENT_FILE_MODIFIED = NO).

## BUOC 2 - DONG TAC (CHI dung 7 bone truc + khe, KHONG tay/chan, KHONG di)
- Khe cam bien: strength dormant (~2% peak) -> ignite nhanh (~60-75% thoi luong clip) -> giu awakened
  toi cuoi. Hue GIU NGUYEN `#8F00FF` (chi doi strength, khong doi mau).
- Nghieng dau/dich trong luong NHE: xoay `neck`/`head` vai do, co the xoay/dich nhe `chest`/`spine_02`
  (giong cach lam o exception #41, chi bien do nho hon, mang tinh dien xuat khong phai test bien dang).
- Blade: KHONG dong, giu nguyen rigid tren `root` (da "nam san trong khung" dung y roadmap).
- Camera: push-in CHAM tu vi tri hien tai (`(0,-10,2.45)`) tien gan hon doc truc hanh lang (Codex chon
  khoang cach cuoi hop ly, bao cao ro). KHONG doi FOV dot ngot, chuyen dong muot.
- Cut to black: fade sang den o cuoi clip (compositing don gian).

## THONG SO KY THUAT (proof shot, CHUA phai spec final)
- Do phan giai: Codex chon hop ly cho 1 canh cinematic ngang (vd 1920x1080), bao cao ro do phan giai +
  fps + thoi luong da dung. KHONG bat buoc theo dung Spotify Canvas spec (do la spec rieng cho Canvas
  loop, khong ap dung cho proof shot nay).
- Khong bat buoc co audio.
- Thoi luong hop ly cho 1 proof shot (vd 6-10s) - Codex bao cao ro so lieu that dung.

## RANH GIOI - KHONG DUOC LAM
- KHONG sua file nhan vat hoac file moi truong goc (chi lam viec tren 1 derivative moi).
- KHONG tao bone/mesh tay/chan. KHONG lam buoc di (walk) - day la EXIT 1, bo qua hoan toan phan di.
- KHONG doi mau khe (chi doi strength). KHONG de halo doi mau (phai luon trang).
- KHONG de violet xuat hien trong vat lieu/anh sang moi truong.
- KHONG doi geometry/material cua nhan vat hoac moi truong.
- KHONG render final/marketing/public-ready claim. KHONG canon-lock/asset-lock.
- KHONG push. KHONG deploy.

## GATE (dung 2 file)
- `contact_sheet.png` = tam frame dai dien (vd dormant / mid push-in / ignite / cuoi truoc fade), nhan
  ro tung frame.
- `contact_sheet_review_report.md` = mo ta chuyen dong (khe strength curve, camera push-in tu-den,
  goc nghieng dau/dich trong luong), xac nhan halo trang/slit hue dung, xac nhan 2 file goc khong doi,
  do phan giai/fps/thoi luong that dung.

## OUTPUT (real deliverables)
- `production/environment/rig_derivatives/MIKAGE_STAGE_E_EXIT1_CINEMATIC_PROOF_V0_1.blend` (scene ket hop)
- `production/environment/reviews/MIKAGE_STAGE_E_EXIT1_CINEMATIC_PROOF_V0_1.mp4`
- `production/environment/reviews/MIKAGE_STAGE_E_EXIT1_CINEMATIC_PROOF_V0_1_KEYFRAMES.png` (contact sheet ban day du, co the trung voi gate)
- `production/environment/reviews/MIKAGE_STAGE_E_EXIT1_CINEMATIC_PROOF_V0_1_PROOF.md`

## VERIFY
- 2 file nguon (nhan vat + moi truong) KHONG doi (hash truoc/sau giong het).
- Khe hue giu `#8F00FF`, chi strength doi. Halo trang xuyen suot.
- Khong co violet trong moi truong.
- Khong co bone/mesh tay/chan moi, khong co buoc di.
- ffprobe xac nhan do phan giai/fps/thoi luong nhu Codex bao cao.
- `.blend1` = NONE. `python .mikage/tools/verify_output.py` = PASS.
- Gate dung 2 file (mp4 KHONG duoc nam trong gate folder - giong quy tac cac task MOTION truoc).

## FAIL CONDITIONS
- File nguon (nhan vat/moi truong) bi sua -> `BLOCKER = SOURCE_FILE_MODIFIED`.
- Khe doi mau/magenta -> `BLOCKER = SLIT_HUE_FAIL`.
- Halo doi mau -> `BLOCKER = HALO_COLOR_VIOLATION`.
- Violet xuat hien trong moi truong -> `BLOCKER = VIOLET_IN_ENVIRONMENT`.
- Tao bone/mesh tay chan hoac lam buoc di -> `BLOCKER = SCOPE_VIOLATION`.
- Gate sai schema (vd mp4 lot vao gate) -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.

## SAU KHI PASS
- Day la PROOF SHOT dau tien - Lane B + operator xem xet truoc khi quyet dinh: co dung lam template
  cho cinematic that, co can Exit 2 (locomotion) sau nay khong, hay can round sua tiep.
- Neu SSOT conflict hoac scope drift: dung va bao cao.
