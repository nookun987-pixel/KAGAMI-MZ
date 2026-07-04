# LANE A / CODEX TASK BRIEF — MIKAGE ROBE HERO CINE STAGING V0.1
"Towering Cloaked Shadow" — bong choang ap dao, khong phai mo hinh.
Soan: BOOS (operator) + cine-staging spec, formatted by Lane B (Cowork) - 2026-07-04 - STATUS: DRAFT -
QUEUED, KHOA toi khi BOOS commit dispatch va mo exception #48 (Forty-eighth) chinh thuc. Governed by
AGENTS.md "Forty-eighth controlled exception" (`MIKAGE_ROBE_HERO_CINE_STAGING_V0_1`).

> BOI CANH / Y DINH: exception #47 (3-state cinematic lighting pass) da PASS, nhung van doc "chi la mo
> hinh" vi thieu san khau (environment) + camera tinh, KHONG PHAI vi thieu giap than. Audit read-only
> vua lam xac nhan: giap than KHONG ton tai trong mesh production hien dung, va canon da khoa CHU DONG
> CAM lo tay/chan rieng ("VOID BODY MASS / DRAPED ROBE" la 1 trong 5 Immutable Identity Mark). BOOS
> ruling 2026-07-04: chon DUONG A - giu nguyen draped robe, KHONG them giap, KHONG lo tay/chan duoi bat
> ky hinh thuc nao. Nang chat luong bang SAN KHAU + ANH SANG CANH + CAMERA MOVE, khong phai them hinh
> khoi moi.

## SOURCE OF TRUTH
- Source: `production/character/production_actor/rig_derivatives/MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1.blend`
  (exception #47, PASS 2026-07-04 - chua san 3 state S0/S1/S2 da lit theo 6-lop ky thuat nen: key xien +
  rim lanh + negative fill + volumetric haze nhe + porcelain SSS/roughness-variation/clearcoat + cloak
  sheen/fresnel + camera 85mm DOF nong + grade AgX/Filmic). Task nay MO RONG derivative nay, KHONG dung
  lai tu dau.
- Canon audit tham chieu (bat buoc doc truoc khi lam): audit read-only 2026-07-04 (Cowork, cung phien
  lam viec) xac nhan mesh production hien tai = 1 khoi cloak lien tuc (khong tay/chan tach roi), rig =
  7 bone axial (khong bone tay/chan), blade = 3 mesh slab rigid-to-root. AGENTS.md (Immutable Identity
  Marks, "VOID BODY MASS / DRAPED ROBE" bat bien) va docs/reports/MIKAGE_MESH_TOPOLOGY_AUDIT_V0_1.md.
- Halo/state-machine ruling da khoa tu #47 (TAI XAC NHAN, khong doi): halo TUYET DOI TRANG - ZERO violet
  o CA 3 state, ke ca tu bounce/GI/rim/god-ray/haze. Halo CHI glow o S2 (nguon sang thu 2 DUY NHAT duoc
  phep), matte o S0/S1.

## TASK
`MIKAGE_ROBE_HERO_CINE_STAGING_V0_1` - 1 task. Mo rong derivative #47 bang: (1) environment/san khau,
(2) tinh chinh anh sang canh (halo/khe lam "practical light" that), (3) camera move, (4) blocking toi
gian. KHONG doi geometry/rig/topology/canon mau. KHONG them giap/tay/chan duoi bat ky hinh thuc nao.

## VIEC CAN LAM (DO)
1. **SAN KHAU (environment)**: san phan chieu mo (wet/polished, roughness ~0.25-0.4) hat lai halo + khe
   violet + bong nhan vat - KHONG phai guong hoan hao, phan chieu mo co keshiki, cho nhan vat "dung o
   dau do" thay vi troi noi. Dung slab toi hien co canh nhan vat lam monolith tien/hau canh, dat lech,
   do bong dai. Them 1-2 mat phang xa mo dan vao mau Z-Blue `#4B5866` de tao lop khi quyen sau - KHONG
   lap day, giu void >=70% khung hinh xuyen suot.
2. **KHI QUYEN**: volumetric haze mong, mat do thap de rim + halo + god-ray bam vao khong khi - day la
   thu bien anh phang thanh "co khong khi". Khong khoi day - mong, lanh.
3. **ANH SANG CANH (cine lighting, tinh chinh tu #47)**: key xien ~40-50 do mot ben, cao hon dau, LANH.
   Rim mau Z-Blue phia sau tach khoi choang den khoi void (thieu rim = cloak bien mat vao nen). Negative
   fill (mang toi) doi dien key de mot ben chim han - tao khoi cho vai + su.
4. **HALO + KHE = PRACTICAL LIGHT THAT**: halo (CHI o S2, glow trang) phai la nguon sang THAT trong scene
   - hat sang xuong san, bam vao haze, god-ray xuyen qua vong halo. Khe violet emission hat tim nhe len
   go ma su + mat trong halo (nhu #47). Day la anh sang "trong canh" that su tuong tac moi truong, khong
   chi la emission tu than khong anh huong gi xung quanh.
5. **VAT LIEU**: giu nguyen cong thuc #47 (porcelain SSS nhe + roughness-variation + clearcoat mong;
   cloak matte + sheen/fresnel mep). TUY CHON (khong bat buoc): kintsugi gold `#C39A52` matte tren seam
   vai (CHI bat raking light, khong tu phat sang), crimson `#A24759` CHI o seam/core - rat restrained,
   khong duoc doc thanh mau chu dao moi.
6. **MAY QUAY**: ~85mm, DOF nong focus khe mat, low-angle nhin len (chat dai tuong niem/ap dao). Camera
   CHUYEN DONG: crane cham tu duoi len HOAC push-in cham, diem gan nhat trung VOI ignition halo (S2).
   Micro-parallax cho co chieu. Cung goc/framing nhat quan voi 3 state clip rieng (muc 7 duoi).
7. **DIEN (blocking toi gian)**: cloak drift nhe theo luong khi (KHONG bay lo). Dau ngang cham o chuyen
   S0->S1. Halo bung + settle o S2. HET - khong them dong tac. KHONG buoc di, KHONG lo tay/chan duoi bat
   ky hinh thuc nao (kha ca ngu y qua bong do/rim tao ao giac hinh tay/chan).

## HARD CANON (khong duoc vi pham - tai xac nhan tu #47 + audit + ruling BOOS 2026-07-04)
- Giu NGUYEN draped robe. KHONG them giap. KHONG tach/lo tay chan duoi bat ky hinh thuc nao (ke ca ngu
  y qua anh sang/bong do/rim tao ao giac hinh dang tay chan). Day la Immutable Identity Mark bat bien.
- Violet CHI o 2 khe (+ P3 core neu ap dung). KHONG len halo/cloak/san/nen/haze/god-ray duoi bat ky
  hinh thuc nao.
- Halo trang: matte o S0/S1, glow trang CHI o S2 - dung state machine da khoa o #47. KHONG am tim ke ca
  qua haze/god-ray bat mau tu khe.
- Void >=70% khung hinh, o MOI state VA moi frame trong camera move cua hero clip.
- Palette: lanh + subtractive mineral, keshiki moi be mat. KHONG warm ambient wash. KHONG pure #000/#FFF
  tuyet doi phang. Z-Blue `#4B5866` la mau lanh phu DUY NHAT ngoai violet (gold/crimson neu dung phai
  rat restrained, matte, khong tu phat sang).
- KHONG animate blade doc lap, KHONG them mesh/bone moi ngoai pham vi anh sang/vat lieu/moi truong/
  camera cua task nay.
- KHONG push. KHONG deploy. KHONG canon-lock. KHONG claim production-ready/final.

## GATE (dung 2 file)
- `contact_sheet.png` = toi thieu 3 frame dai dien 3 state (S0/S1/S2) TRONG environment/anh sang moi
  (de so sanh voi #47 "phang" cu) + toi thieu 1 frame tu hero clip TAI DIEM CAMERA GAN NHAT (ignition
  S2). Nhan ro tung frame la state nao / hero-clip-closest.
- `contact_sheet_review_report.md` = liet ke tung hang muc (1-7) da ap dung + thong so thuc te (goc key,
  Z-Blue rim intensity, haze density, floor roughness, focal/f-stop, camera move type + toc do, engine).
  **BAT BUOC** muc "HALO COLOR CHECK" giong #47 - lay mau pixel halo >=4 diem/frame tren CA 3 state VA
  tren frame hero-clip-closest, ghi so lieu RGB/hex, xac nhan khong violet drift. **BAT BUOC** muc "VOID
  OCCUPANCY" - do % void tren tat ca frame trong contact sheet, xac nhan >=70%.

## OUTPUT (real deliverables)
- `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1.blend`
- `production/character/reviews/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1_S0_DORMANT.mp4` (state restaged)
- `production/character/reviews/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1_S1_AWARE.mp4` (state restaged)
- `production/character/reviews/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1_S2_COMBAT.mp4` (state restaged)
- `production/character/reviews/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1_HERO_CLIP.mp4` (camera move, ignition
  tai diem gan nhat)
- `production/character/reviews/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1_S2_STILL.png` (full-res, ung vien
  thumbnail/hero - lay tai frame S2 dep nhat)
- `production/character/reviews/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1_PROOF.md` (neu ro thong so rieng tung
  hang muc + tung state, khong gop chung)

## PASS CONDITIONS
- Geometry/rig/topology nhan vat khong doi so voi source #47 (hash confirm neu co the).
- Halo o MOI frame/state/goc (ca 3 state clip VA hero clip) = trang/near-white/cool-neutral, xac nhan
  bang so lieu pixel sample, khong violet drift o bat ky diem/frame nao.
- State machine dung nhu #47: S0 = khe toi + halo matte; S1 = khe full tim + halo van matte; S2 = khe
  full tim + halo glow trang manh - CA 3 phai phan biet ro, dung thu tu.
- Environment/anh sang moi doc RO RANG khac #47 cu: co san phan chieu, co monolith/depth layer Z-Blue,
  co haze bat rim/god-ray - khong con "phang/mo hinh trong hop den".
- Hero clip co camera move that (crane-up hoac push-in), diem gan nhat TRUNG voi ignition halo S2.
- Void >=70% khung hinh o MOI frame duoc kiem tra (ca 3 state va hero clip).
- Khong xuat hien giap/tay/chan duoi bat ky hinh thuc nao (ke ca ngu y qua anh sang/bong do).
- Palette dung: lanh + Z-Blue phu, khong warm wash, khong pure black/white phang.
- Validator PASS (neu co script ap dung), khong con `.blend1`.
- Khong push/deploy/canon-lock.

## FAIL CONDITIONS
- Halo bat violet pixel nao (do duoc, du 1 diem/1 frame/1 state/hero-clip) -> `BLOCKER =
  HALO_COLOR_VIOLATION`.
- Halo glow sai state (S0/S1 glow, S2 khong glow) -> `BLOCKER = STATE_MACHINE_VIOLATION`.
- Xuat hien hinh dang/goi y giap, tay, chan duoi bat ky hinh thuc (mesh moi, hoac anh sang/bong tao ao
  giac) -> `BLOCKER = LIMB_GEOMETRY_VIOLATION` hoac `ARMOR_SCOPE_VIOLATION`.
- Void < 70% o bat ky frame nao -> `BLOCKER = VOID_RATIO_VIOLATION`.
- Violet wash moi truong/san/haze, hoac dung lam key/fill -> `BLOCKER = VIOLET_IN_ENVIRONMENT`.
- Warm ambient wash, hoac mau khac ngoai Z-Blue/violet xuat hien manh -> `BLOCKER = PALETTE_VIOLATION`.
- Geometry/rig/topology thay doi ngoai pham vi anh sang/vat lieu/moi truong/camera -> `BLOCKER =
  SCOPE_VIOLATION` (ghi ro thay doi cu the).
- Camera khong move, hoac ignition khong trung diem gan nhat -> `BLOCKER = CAMERA_STAGING_INCOMPLETE`.
- Gate sai schema (thieu HALO COLOR CHECK hoac VOID OCCUPANCY co so lieu) -> `BLOCKER =
  VALIDATOR_SCHEMA_MISMATCH`.

## NEU FAIL (huong xu ly)
Neu halo/violet drift do haze/god-ray bat mau tu khe ma khong tranh duoc bang chinh light-rig/haze
density thong thuong: DUNG va bao cao chinh xac nguyen nhan + da thu chinh gi. KHONG tu y ha haze/rim
de "che" loi ma khong bao cao. Day la ranh gioi canon, operator ra ruling tiep.

## SAU KHI PASS
Lane B (Cowork) nhan still S2 full-res de hau ky rieng (bloom, crush black, grain, vignette) + rap vao
shotlist THIRD AXIS S2 COMBAT REVEAL (ngoai scope task nay - Codex KHONG lam hau ky/cat/ghep). Codex
dung anh sang/san khau/camera THAT; Lane B lam hau ky + ghep shotlist. KHONG ai duoc PASS canon/asset-
lock tru operator.
