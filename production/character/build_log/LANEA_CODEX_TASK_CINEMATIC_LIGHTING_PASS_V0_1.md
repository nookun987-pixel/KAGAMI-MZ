# LANE A / CODEX TASK BRIEF — MIKAGE CINEMATIC LIGHTING PASS V0.1
Soan: BOOS (operator) + cinematic-pass spec, formatted by Lane B (Cowork) - 2026-07-04 - STATUS: DRAFT -
QUEUED, KHOA toi khi BOOS mo exception #47 (Forty-seventh). Governed by AGENTS.md "Forty-seventh
controlled exception" (`MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1`).

> LUU Y THU TU: exception #46 (`MIKAGE_ROBE_LOCOMOTION_CLEANUP_V0_2`) dang OPEN tai thoi diem soan brief
> nay (2026-07-04). Lane A chi chay 1 task tai 1 thoi diem - task nay CHUA duoc dispatch, dang cho BOOS
> quyet dinh: (a) doi #46 dong roi moi mo #47, hoac (b) ngat #46 de uu tien lam cinematic pass truoc.
> KHONG tu y dispatch song song hai task.

> Boi canh: reference sheet + hero lookdev hien tai (`MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1`, active premium
> lookdev reference, duyet 2026-07-03) dung nhung anh sang deu kieu turntable - violet dang la mau son
> chu khong phai nguon sang, nen void phang khong co chieu sau, chua co khong khi quyen/rim/DOF. BOOS
> muon nang len "dien anh" bang 1 setup anh sang + vat lieu + camera + grade MOI, theo dung spec 6 lop
> BOOS cung cap (file `MZ-CINEMATIC-PASS.html`, dinh kem cung thu muc nay), KHONG duoc doi hinh khoi/
> geometry/canon mau da khoa.

## SOURCE OF TRUTH
- Source: `production/character/production_actor/rig_derivatives/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1.blend`
  (ACTIVE_PREMIUM_LOOKDEV_REFERENCE, material approved 2026-07-03, khong duoc chinh mau khe them ma
  khong co vong duyet moi).
- Reference spec day du: `production/character/build_log/MZ-CINEMATIC-PASS_REFERENCE_V0_1.html` (6 lop:
  anh sang / violet emission / khi quyen / vat lieu / may quay / grade + checklist thu tu tac dong).
- Halo ruling (BOOS xac nhan 2026-07-04, qua Lane B): **HALO TUYET DOI TRANG - ZERO violet, ke ca tu
  anh sang vat ly (bounce/rim/GI).** Day la hard constraint, KHONG duoc tu dien giai nguong "nhe" theo
  y rieng - neu setup anh sang lam halo bat BAT KY pixel violet nao o BAT KY frame nao, coi la FAIL.

## TASK
`MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1` - 1 task. LIGHTING + MATERIAL + CAMERA + GRADE pass tren 1
derivative MOI. KHONG doi geometry/rig/topology/canon mau vat the.

## VIEC CAN LAM (DO) - theo dung 6 lop trong spec, thu tu uu tien nhu checklist goc
1. **ANH SANG**: bo HDRI phu deu (hoac giam strength con rat thap, chi de bounce nhe). Dat 1 key light
   xien ~40-50 do mot ben, cao hon dau (key ratio ~1, fill 1/8-1/16). Rim/back light LANH (trang hoi
   xanh - KHONG duoc pha violet) dat phia sau lech de tach ao choang khoi nen void. Them negative fill
   (mang toi doi dien key) de tao khoi 3D ro cho mat su, cho phep than duoi chim han vao den.
2. **VIOLET EMISSION**: 2 khe = emission shader `#8F00FF`, strength du cao de loi clip sang (phuc vu
   bloom o buoc grade). Cho phep khe hat violet nhe len GO MA SU (bounce chap nhan duoc, do la hieu ung
   vat ly tu nguon sang chinh hang). **KHONG duoc de violet cham/bounce/tint len HALO duoi bat ky hinh
   thuc nao** - xem FAIL CONDITIONS. Khong wash violet ca canh, khong dung violet lam key/fill light.
3. **KHI QUYEN**: volumetric haze mat do rat thap phu scene (Cycles: World volume hoac box quanh canh;
   Eevee: bat Volumetric + Volumetric Shadows). Codex tu chon engine phu hop file .blend hien co va bao
   cao ly do trong proof. Tuy chon: god ray LANH (trang/lanh, KHONG violet) xuyen qua vanh halo.
4. **VAT LIEU**: helmet - subsurface nhe (radius nho, tint hoi am), roughness co bien thien (khong
   phang deu - them vet/xuoc micro), clearcoat mong cho lop men su. Ao choang - sheen/velvet nhe +
   fresnel de mep vai bat rim, giu nep gap doc duoc nhung than van chim vao den.
5. **MAY QUAY**: ~85mm, DOF nong (f/1.4-2.8), focus chot vao khe mat, halo va nen tan mem. Hoi
   low-angle nhe (uy nghi, KHONG qua dutch/lech). Bo cuc: dau o upper-third, chua khoang void tho phia
   doi dien huong nhin.
6. **GRADE + HAU KY**: view transform AgX hoac Filmic (Codex chon theo engine, bao cao ly do). Crush
   black ve gan `#050508`. CHI nhac rieng saturation/luminance cua dai violet, giu nen mono lanh - KHONG
   teal-orange, KHONG grade am khac. Bloom chon loc vao khe mat (+ rim neu co), threshold thap. Chromatic
   aberration rat nhe uu tien mep violet. Film grain min. Vignette nhe dua mat vao helmet.

## RANH GIOI - KHONG DUOC LAM
- KHONG doi geometry, rig, bone, topology cua nhan vat duoi bat ky hinh thuc nao.
- KHONG doi mau canon nen: helmet van `#F2EEEA`, ao choang van void black, slit van `#8F00FF`.
- KHONG de violet cham/bounce/tint len HALO - halo phai giu trang/near-white/cool-neutral tai MOI
  pixel, MOI frame trong contact sheet. Day la FAIL cung, khong tu dien giai nguong "nhe".
- KHONG wash violet toan canh, KHONG dung violet lam key hoac fill light.
- KHONG doi teal-orange hoac bat ky huong grade nao khac ngoai mono lanh + dai violet tach rieng.
- KHONG animate blade, KHONG them mesh/bone moi, KHONG them moi truong/set (hanh lang, v.v.) trong task
  nay - chi lighting/material/camera/grade tren derivative dung mot minh nhan vat.
- KHONG push. KHONG deploy. KHONG canon-lock. KHONG claim production-ready/final/Stage-D.

## GATE (dung 2 file)
- `contact_sheet.png` = toi thieu 2 cap BEFORE/AFTER cung goc camera (before = render turntable hien
  tai tu source khong doi anh sang, after = ket qua cinematic pass) + 1-2 frame/goc rieng cho thay ro
  rim, violet emission-bounce, va khi quyen. Codex de xuat bo cuc cu the trong proof, ghi ro goc nao.
- `contact_sheet_review_report.md` = liet ke tung lop (1-6) da ap dung + gia tri thong so thuc te dung
  (goc key, cuong do emission, mat do haze, focal/f-stop, duong cong grade, engine da chon + ly do).
  **BAT BUOC**: 1 muc rieng "HALO COLOR CHECK" - lay mau pixel halo tai it nhat 4 diem/goc khac nhau
  tren MOI frame trong contact sheet, ghi ro gia tri RGB/hex do duoc, xac nhan khong co violet drift.
  Khong duoc chi mo ta bang loi ("halo van trang") ma khong co so lieu do duoc.

## OUTPUT (real deliverables)
- `production/character/production_actor/rig_derivatives/MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1.blend`
- `production/character/reviews/MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1_CONTACT_SHEET.png`
- `production/character/reviews/MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1_PROOF.md`

## PASS CONDITIONS
- Geometry/rig/topology nhan vat khong doi so voi source (hash confirm neu co the).
- Halo o MOI frame/goc trong contact sheet = trang/near-white/cool-neutral, xac nhan bang so lieu pixel
  sample, khong co violet do duoc o bat ky diem nao.
- Violet CHI xuat hien o: 2 khe mat + bounce nhe tren go ma su + (neu co) diem sang tim trong bokeh
  hau canh - KHONG o rim/mep vai/moi truong.
- Anh sang co huong ro rang (khong con turntable-flat), rim tach duoc ao choang khoi nen void, negative
  fill tao khoi 3D ro cho mat su.
- Vat lieu su doc duoc SSS/roughness-variation/clearcoat, khong con doc "nhua".
- Grade: mono lanh + crush black, khong teal-orange, khong wash mau khac ngoai dai violet.
- Khong doi mau canon nen (helmet/ao/slit).
- Contact sheet co du cap BEFORE/AFTER de so sanh truc tiep.
- Validator PASS (neu co script ap dung), khong con `.blend1`.
- Khong push/deploy/canon-lock.

## FAIL CONDITIONS
- Halo bat bat ky violet pixel nao (do duoc qua sample, du chi 1 diem/1 frame) -> `BLOCKER =
  HALO_COLOR_VIOLATION`.
- Violet wash toan canh hoac dung lam key/fill light -> `BLOCKER = VIOLET_IN_ENVIRONMENT`.
- Geometry/rig/topology thay doi ngoai pham vi anh sang/vat lieu/camera/grade -> `BLOCKER =
  SCOPE_VIOLATION` (ghi ro thay doi cu the).
- Mau canon nen (helmet/ao/slit hue) drift khoi gia tri khoa -> `BLOCKER = CANON_COLOR_DRIFT`.
- Gate sai schema (khong dung 2 file, hoac thieu muc HALO COLOR CHECK co so lieu trong report) ->
  `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.

## NEU FAIL (huong xu ly)
Neu halo bat violet do bounce/rim/GI ma khong tranh duoc bang chinh lai light-rig/vat lieu thong
thuong (giam emission strength khe, doi goc rim, them occlusion/flag chan): DUNG va bao cao chinh xac
nguyen nhan (bounce tu dau, cuong do bao nhieu, da thu chinh gi). KHONG tu y ha thap chat luong hieu ung
de "che" ma khong bao cao - day la ranh gioi canon, operator se ra ruling tiep (co the nam trong exception
moi neu can noi long).

## SAU KHI PASS
Lane B + operator xem contact sheet BEFORE/AFTER, so sanh truc tiep voi diagnosis trong spec goc, quyet
dinh dung lam premium cinematic reference moi hay can chinh them 1 vong (vd cuong do rim, gia tri crush
black, mat do haze).
