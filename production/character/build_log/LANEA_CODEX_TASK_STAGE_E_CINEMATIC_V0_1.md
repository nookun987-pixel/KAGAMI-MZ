# LANE A / CODEX TASK BRIEF — MIKAGE STAGE E CINEMATIC V0.1 (real cinematic, template = Exit 1 proof)
Soan: Lane B (Cowork) - 2026-07-03 - STATUS: DRAFT - KHOA toi khi BOOS mo exception #44 (Forty-fourth).
Governed by AGENTS.md "Forty-fourth controlled exception" (`MIKAGE_STAGE_E_CINEMATIC_V0_1`).

> Boi canh: exception #43 (`MIKAGE_STAGE_E_EXIT1_CINEMATIC_PROOF_V0_1`, PASS) la proof shot dau tien
> ket hop rig + hanh lang + sensor-anim + camera push-in + cut to black, o do phan giai thap (1280x720,
> chi de test kha thi). BOOS ruling 2026-07-03: dung proof nay LAM TEMPLATE cho cinematic THAT - giu
> NGUYEN toan bo choreography da duyet (dormant->ignite->camera push->cut to black, cung goc camera,
> cung bien do dien xuat truc), CHI nang do phan giai/chat luong render. Giu ngang 16:9 (KHONG doi sang
> doc). KHONG can audio o vong nay.

## SOURCE OF TRUTH
- Template (dung LAM NEN, mo rong tu day - KHONG lam lai tu dau): `production/environment/rig_derivatives/MIKAGE_STAGE_E_EXIT1_CINEMATIC_PROOF_V0_1.blend`
  (proof PASS #43 - giu nguyen choreography: khe dormant->ignite->awakened, dien xuat truc nhe,
  camera push 3 unit, fade to black).
- Nhan vat/moi truong nguon (doc-only doi chieu, KHONG can sua lai vi da nam trong template roi):
  `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend`,
  `production/environment/sets/MIKAGE_HALLWAY_ENVIRONMENT_V0_1.blend`.
- Halo ruling: `docs/handoff/HALO_RING_RULING_2026-07-03.md` (halo PHAI luon TRANG).

## TASK
`MIKAGE_STAGE_E_CINEMATIC_V0_1` - 1 task. CANDIDATE (chua phai final/marketing) nhung la ban "that"
dau tien, khac voi proof shot #43 (chi de test kha thi).

## THAY DOI CHO PHEP (chi day, KHONG doi choreography)
- Nang do phan giai: it nhat `1920x1080` (16:9, KHONG doi sang doc/9:16). Giu dung ty le khung hinh
  va bo cuc camera nhu proof #43 (khong crop lai, khong doi goc nhin, chi upres).
- Co the nang chat luong render (samples/anti-aliasing/denoise) de hinh anh net hon, min hon - KHONG
  doi anh sang/vat lieu/mau sac da duyet.
- Co the dieu chinh nhe thoi luong neu can (vd them 1-2s dau/cuoi de "tho" hon) nhung PHAI giu dung
  thu tu choreography: dormant -> ignite -> awakened -> cut to black. Bao cao ro so lieu that dung.
- KHONG audio trong task nay (BOOS ruling: chua can, im lang nhu proof).

## RANH GIOI - KHONG DUOC LAM (giu nguyen tu #43)
- KHONG sua 2 file nguon (nhan vat, moi truong) - van chi lam viec tren derivative.
- KHONG doi mau khe (chi duoc doi strength, hue giu `#8F00FF`).
- KHONG doi mau halo (phai luon trang).
- KHONG de violet xuat hien trong moi truong.
- KHONG tao bone/mesh tay chan moi. KHONG lam locomotion/di bo.
- KHONG dong blade rieng (giu rigid-to-root nhu cu).
- KHONG doi ty le khung hinh sang doc/9:16.
- KHONG audio. KHONG canon-lock/asset-lock/final-marketing claim (van la CANDIDATE).
- KHONG push. KHONG deploy.

## GATE (dung 2 file)
- `contact_sheet.png` = cac frame dai dien (dormant/mid-push/ignite/awakened/cut-black), do phan giai
  moi.
- `contact_sheet_review_report.md` = xac nhan do phan giai/fps/thoi luong that dung (ffprobe), xac nhan
  choreography giu nguyen dung thu tu, halo/slit mau dung, khong co audio, 2 file nguon khong doi.

## OUTPUT (real deliverables)
- `production/environment/rig_derivatives/MIKAGE_STAGE_E_CINEMATIC_V0_1.blend`
- `production/environment/reviews/MIKAGE_STAGE_E_CINEMATIC_V0_1.mp4`
- `production/environment/reviews/MIKAGE_STAGE_E_CINEMATIC_V0_1_KEYFRAMES.png`
- `production/environment/reviews/MIKAGE_STAGE_E_CINEMATIC_V0_1_PROOF.md`

## VERIFY
- 2 file nguon (nhan vat + moi truong) KHONG doi (hash truoc/sau giong het).
- ffprobe xac nhan do phan giai >= 1920x1080, ty le 16:9, khong audio.
- Khe hue giu `#8F00FF`. Halo trang xuyen suot. Khong violet trong moi truong.
- Khong bone/mesh tay chan moi. Khong locomotion. Blade khong animate rieng.
- Choreography giu dung thu tu: dormant -> ignite -> awakened -> cut to black.
- `.blend1` = NONE. Gate dung 2 file (mp4 KHONG nam trong gate). `python .mikage/tools/verify_output.py` = PASS.

## FAIL CONDITIONS
- File nguon bi sua -> `BLOCKER = SOURCE_FILE_MODIFIED`.
- Khe doi mau/magenta -> `BLOCKER = SLIT_HUE_FAIL`.
- Halo doi mau -> `BLOCKER = HALO_COLOR_VIOLATION`.
- Violet xuat hien trong moi truong -> `BLOCKER = VIOLET_IN_ENVIRONMENT`.
- Tao bone/mesh tay chan, lam locomotion, hoac dong blade rieng -> `BLOCKER = SCOPE_VIOLATION`.
- Doi ty le khung hinh sang doc, hoac them audio -> `BLOCKER = SPEC_DEVIATION`.
- Gate sai schema -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.

## SAU KHI PASS
- Day la ban cinematic "that" dau tien - Lane B + operator xem xet, quyet dinh: dung lam ban chinh
  cho publishing, can them round polish (color grade, audio rieng sau), hay mo Exit 2 (locomotion).
- Neu SSOT conflict hoac scope drift: dung va bao cao.
