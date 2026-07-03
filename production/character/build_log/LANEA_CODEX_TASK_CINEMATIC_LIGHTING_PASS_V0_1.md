# LANE A / CODEX TASK BRIEF — MIKAGE CINEMATIC LIGHTING PASS V0.1 (3-STATE)
Soan: BOOS (operator) + cinematic-pass spec + THIRD AXIS S2 shotlist, formatted by Lane B (Cowork) -
2026-07-04 - STATUS: DRAFT - QUEUED, KHOA toi khi BOOS commit dispatch va mo exception #47
(Forty-seventh) chinh thuc. Governed by AGENTS.md "Forty-seventh controlled exception"
(`MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1`).

> LICH SU: exception #46 (`MIKAGE_ROBE_LOCOMOTION_CLEANUP_V0_2`) da PASS va CLOSED 2026-07-04. Task nay
> la #47, queued ngay sau, dang cho BOOS commit dispatch (chua chay Codex).

> REVISION 2026-07-04 (BOOS, qua shotlist `MZ-SHOTLIST-THIRDAXIS-S2.html` cho track THIRD AXIS): scope
> ban dau (1 derivative, 1 cap BEFORE/AFTER) DUOC THAY the bang 1 STATE MACHINE 3 buoc dung cho canh
> "ignition" cua short THIRD AXIS S2 COMBAT REVEAL. Xuat 3 KHUC RIENG (video ngan, KHONG phai 1 clip
> lien co transition), moi khuc dat ten ro theo state de BOOS tu cat nhip ignition khi dung rieng
> (Lane A KHONG lam viec cat/ghep/export short - viec do thuoc pipeline khac).

> Boi canh goc: reference sheet + hero lookdev hien tai (`MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1`, active
> premium lookdev reference, duyet 2026-07-03) dung nhung anh sang deu kieu turntable - violet dang la
> mau son chu khong phai nguon sang, nen void phang khong co chieu sau. Setup anh sang/vat lieu/camera/
> grade 6 lop (spec goc) van la NEN TANG KY THUAT cho ca 3 state - diem khac biet GIUA 3 state CHI la
> cuong do emission cua khe va halo (xem STATE MACHINE ben duoi), KHONG doi light-rig/camera/vat lieu
> giua cac state.

## SOURCE OF TRUTH
- Source: `production/character/production_actor/rig_derivatives/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1.blend`
  (ACTIVE_PREMIUM_LOOKDEV_REFERENCE, material approved 2026-07-03, khong duoc chinh mau khe them ma
  khong co vong duyet moi).
- Reference spec ky thuat (lighting 6 lop): `production/character/build_log/MZ-CINEMATIC-PASS_REFERENCE_V0_1.html`.
- Shotlist boi canh (KHONG phai brief ky thuat, chi de hieu tai sao can 3 state rieng): shotlist goc
  BOOS cung cap cho track THIRD AXIS (ISRC `QT62U2610012`, release 2026-07-09 PRE-SAVE). Task nay CHI
  lam phan render 3 state (tuong duong "asset C - than clip" trong shotlist) - KHONG lam caption, KHONG
  lam cover-card, KHONG lam text overlay, KHONG cat/ghep/export theo beat map. Nhung phan do thuoc
  pipeline/lane khac, ngoai scope Lane A.
- Halo ruling (BOOS xac nhan 2026-07-04, tai xac nhan qua shotlist): **HALO LUON LA TRANG PORCELAIN -
  ZERO violet duoi bat ky hinh thuc nao (mau son, bounce, GI, rim), o CA 3 state.** Diem khac nhau GIUA
  cac state la halo CO PHAT SANG (glow) hay khong - KHONG BAO GIO la halo doi sang mau violet.

## TASK
`MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1` - 1 task, xuat 3 deliverable rieng (S0/S1/S2). LIGHTING +
MATERIAL + CAMERA + GRADE pass tren 1 derivative MOI duy nhat (chua toan bo 3 state, vd bang 3
scene/frame-range/light-state rieng trong cung file .blend - Codex tu quyet ky thuat, bao cao cach lam).
KHONG doi geometry/rig/topology/canon mau vat the.

## STATE MACHINE (BAT BUOC - day la thay doi chinh so voi brief V0.1 ban dau)

| State | Khe (slit emission) | Halo | Khung hinh |
|---|---|---|---|
| **S0 DORMANT** | Toi / gan tat, hoac ember rat thap (KHONG full) | MATTE trang - khong phat sang, chi phan xa anh sang ngoai | Void-dominant, gan den tuyen, cang/cho |
| **S1 AWARE** | FULL tim - loi khe gan clip, bao hoa manh (giong "wow" cua V0.1 ban dau) | VAN MATTE trang - CHUA bung sang, chi la vat lieu trang thu dong | Rim mong tren porcelain, tim bat dau hat nhe len go ma |
| **S2 COMBAT** | FULL tim - giu nguyen cuong do nhu S1 | GLOW trang MANH - **day la nguon sang thu 2 DUY NHAT duoc phep trong toan bo he thong** | Frame "wow" chinh - dinh cua cinematic pass, ung vien thumbnail |

Ca 3 state dung CHUNG 1 light-rig/camera/vat lieu/grade approach (theo 6 lop trong spec ky thuat) -
CHI khac nhau o (a) cuong do emission cua 2 khe va (b) halo co glow hay khong. KHONG doi goc camera,
khong doi vi tri key/rim giua cac state (tru khi can thiet ky thuat toi thieu, bao cao neu co).

## VIEC CAN LAM (DO) - ky thuat nen (ap dung cho ca 3 state, chi khac cuong do emission theo bang tren)
1. **ANH SANG**: bo HDRI phu deu (hoac giam strength con rat thap, chi de bounce nhe). Dat 1 key light
   xien ~40-50 do mot ben, cao hon dau (key ratio ~1, fill 1/8-1/16). Rim/back light LANH (trang hoi
   xanh - KHONG duoc pha violet) dat phia sau lech de tach ao choang khoi nen void. Them negative fill
   (mang toi doi dien key) de tao khoi 3D ro cho mat su, cho phep than duoi chim han vao den. Setup nay
   GIONG NHAU o ca 3 state.
2. **VIOLET EMISSION (khe)**: emission shader `#8F00FF`.
   - S0: strength rat thap (gan tat / ember), KHONG duoc doc la "full".
   - S1 va S2: strength CAO - "khe FULL tim", loi khe gan clip trang-tim, bao hoa manh. Cho phep khe hat
     violet nhe len GO MA SU o ca S1/S2 (bounce chap nhan duoc, hieu ung vat ly tu nguon sang chinh
     hang). **KHONG duoc de violet cham/bounce/tint len HALO o BAT KY state nao** - xem FAIL CONDITIONS.
   - Khong wash violet ca canh o bat ky state nao, khong dung violet lam key/fill light.
3. **HALO (TRANG, khong phai violet - cuong do khac nhau theo state)**:
   - S0 va S1: halo MATTE - vat lieu trang thu dong, KHONG tang emission strength rieng cua halo (chi
     bat sang gian tiep tu key/rim nhu vat the thuong).
   - S2 CHI: tang emission strength cua chinh vat lieu halo de no TU PHAT SANG trang manh (mau giu
     nguyen trang/near-white/cool-neutral, TUYET DOI khong pha violet vao gia tri mau) + bloom o buoc
     grade de no "no" sang trong khung hinh. Day la nua con lai cua "frame wow" S2 (cung voi khe full
     tim). Cang manh cang tot mien la mau do pixel van la trang/near-white/cool-neutral thuan tuy.
4. **KHI QUYEN**: volumetric haze mat do rat thap phu scene (Cycles: World volume hoac box quanh canh;
   Eevee: bat Volumetric + Volumetric Shadows). Codex tu chon engine phu hop file .blend hien co va bao
   cao ly do trong proof. Tuy chon: god ray LANH (trang/lanh, KHONG violet) xuyen qua vanh halo - neu
   dung, ap dung nhat quan ca 3 state (khong chi rieng S2).
5. **VAT LIEU**: helmet - subsurface nhe (radius nho, tint hoi am), roughness co bien thien (khong
   phang deu - them vet/xuoc micro), clearcoat mong cho lop men su. Ao choang - sheen/velvet nhe +
   fresnel de mep vai bat rim, giu nep gap doc duoc nhung than van chim vao den. Giong nhau ca 3 state.
6. **MAY QUAY**: ~85mm, DOF nong (f/1.4-2.8), focus chot vao khe mat, halo va nen tan mem. Hoi
   low-angle nhe (uy nghi, KHONG qua dutch/lech). Bo cuc: dau o upper-third, chua khoang void tho phia
   doi dien huong nhin, VOID CHIEM TOI THIEU 70% khung hinh o ca 3 state. Cung 1 goc camera cho ca 3
   state (de BOOS cat nhip lien mach duoc).
7. **GRADE + HAU KY**: view transform AgX hoac Filmic (Codex chon theo engine, bao cao ly do). Crush
   black ve gan `#050508`. CHI nhac rieng saturation/luminance cua dai violet, giu nen mono lanh - KHONG
   teal-orange, KHONG grade am khac. Bloom chon loc vao khe (ca 3 state) VA vao halo (CHI o S2), threshold
   thap du de "no" ro o S2. Chromatic aberration rat nhe uu tien mep violet. Film grain min. Vignette
   nhe dua mat vao helmet. Grade curve giong nhau ca 3 state (chi khac gia tri bloom do nguon sang khac).

## HARD RULES (tu shotlist, ap dung TOAN BO 3 state - khong duoc vi pham o bat ky state nao)
- Violet CHI o 2 khe cam bien. KHONG BAO GIO len halo / body / blade / nen, o MOI state.
- Halo LUON trang porcelain. S0/S1 = matte (khong phat sang). S2 = glow trang - nguon sang thu 2 DUY
  NHAT duoc phep trong toan bo setup.
- Void chiem toi thieu 70% khung hinh o ca 3 state. Violet toi da ~5% khung hinh, 1 diem phat duy nhat
  (2 khe). Khong warm wash.
- Official layer = cine realism. KHONG anime / speed line / cel shading / neon HUD trong asset nay.

## RANH GIOI - KHONG DUOC LAM
- KHONG doi geometry, rig, bone, topology cua nhan vat duoi bat ky hinh thuc nao.
- KHONG doi mau canon nen: helmet van `#F2EEEA`, ao choang van void black, slit van `#8F00FF`.
- KHONG de violet cham/bounce/tint len HALO o BAT KY state nao - halo phai giu trang/near-white/
  cool-neutral tai MOI pixel, MOI frame, CA 3 state. Day la FAIL cung, khong tu dien giai nguong "nhe".
- KHONG cho halo glow o S0/S1 (chi S2 duoc glow) - vi pham thu tu ignition la SCOPE_VIOLATION.
- KHONG wash violet toan canh, KHONG dung violet lam key hoac fill light, o bat ky state nao.
- KHONG doi teal-orange hoac bat ky huong grade nao khac ngoai mono lanh + dai violet tach rieng.
- KHONG animate blade, KHONG them mesh/bone moi, KHONG them moi truong/set (hanh lang, v.v.) trong task
  nay - chi lighting/material/camera/grade tren derivative dung mot minh nhan vat.
- KHONG lam anime/speed-line/cel-shade/neon-HUD style o bat ky state nao.
- KHONG cat/ghep/export theo beat map, KHONG lam caption/cover-card/text overlay - ngoai scope Lane A.
- KHONG push. KHONG deploy. KHONG canon-lock. KHONG claim production-ready/final/Stage-D.

## GATE (dung 2 file)
- `contact_sheet.png` = 1 frame dai dien cho MOI state (toi thieu 3 frame: S0 | S1 | S2, cung 1 goc
  camera de so sanh truc tiep), sap xep ro rang co nhan ten state tren tung frame (co the ghi de text
  don gian hoac chu thich trong report). Neu Codex thay can them frame phu (vd rim/haze close-up) thi
  them, nhung toi thieu phai co du 3 frame dai dien 3 state.
- `contact_sheet_review_report.md` = liet ke tung lop ky thuat (1-7) da ap dung + gia tri thong so thuc
  te dung (goc key, cuong do emission khe/halo THEO TUNG STATE, mat do haze, focal/f-stop, duong cong
  grade, engine da chon + ly do). **BAT BUOC**: 1 muc rieng "HALO COLOR CHECK" - lay mau pixel halo tai
  it nhat 4 diem/goc khac nhau, TREN CA 3 STATE, ghi ro gia tri RGB/hex do duoc, xac nhan khong co
  violet drift o state nao. Khong duoc chi mo ta bang loi ma khong co so lieu do duoc. Cung ghi ro
  cuong do emission halo o S0/S1 (phai gan 0 / mac dinh vat lieu) vs S2 (cao) de xac nhan glow chi xay
  ra dung 1 state.

## OUTPUT (real deliverables)
- `production/character/production_actor/rig_derivatives/MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1.blend`
  (chua ca 3 state, Codex bao cao cach to chuc - scene rieng / frame-range rieng / light-state rieng).
- `production/character/reviews/MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1_S0_DORMANT.mp4`
- `production/character/reviews/MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1_S1_AWARE.mp4`
- `production/character/reviews/MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1_S2_COMBAT.mp4`
  (moi clip: video ngan, static hold hoac chuyen dong toi thieu - KHONG phai locomotion/animation day
  du, chi giu tu the/trang thai on dinh de BOOS cat nhip khi dung; cung goc camera/framing ca 3 clip;
  do phan giai/fps/thoi luong Codex tu chon va bao cao, uu tien vertical 9:16 neu hop ly voi source).
- `production/character/reviews/MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1_PROOF.md` (phai neu ro thong so
  rieng cua tung state, khong gop chung).

## PASS CONDITIONS
- Geometry/rig/topology nhan vat khong doi so voi source (hash confirm neu co the).
- Halo o MOI frame/goc/state trong contact sheet = trang/near-white/cool-neutral, xac nhan bang so lieu
  pixel sample, khong co violet do duoc o bat ky diem/state nao.
- Violet CHI xuat hien o: 2 khe mat + bounce nhe tren go ma su (S1/S2) - KHONG o rim/mep vai/moi truong/
  halo, o bat ky state nao.
- **STATE MACHINE dung**: S0 = khe toi/gan tat + halo matte; S1 = khe full tim + halo VAN matte; S2 =
  khe full tim + halo glow trang manh. Ca 3 phai phan biet ro rang, dung thu tu cuong do tang dan.
- **"FRAME WOW" S2** (ruling BOOS 2026-07-04): khe FULL tim + halo GLOW trang CUNG xuat hien trong clip
  S2 - day la frame/clip duy nhat co ca hai. Halo van phai do mau la trang/near-white/cool-neutral thuan
  tuy (xem HALO COLOR CHECK) - "glow manh" la cuong do sang, KHONG phai lech mau.
- Anh sang co huong ro rang (khong con turntable-flat) o ca 3 state, rim tach duoc ao choang khoi nen
  void, negative fill tao khoi 3D ro cho mat su.
- Vat lieu su doc duoc SSS/roughness-variation/clearcoat, khong con doc "nhua", ca 3 state.
- Grade: mono lanh + crush black, khong teal-orange, khong wash mau khac ngoai dai violet, nhat quan
  ca 3 state.
- Khong doi mau canon nen (helmet/ao/slit).
- Void chiem toi thieu 70% khung hinh, khong yeu to anime/cel/neon-HUD, o ca 3 state.
- 3 clip dat ten dung theo quy uoc (`_S0_DORMANT` / `_S1_AWARE` / `_S2_COMBAT`), cung goc camera de cat
  noi tiep duoc.
- Validator PASS (neu co script ap dung), khong con `.blend1`.
- Khong push/deploy/canon-lock.

## FAIL CONDITIONS
- Halo bat bat ky violet pixel nao (do duoc qua sample, du chi 1 diem/1 frame/1 state) -> `BLOCKER =
  HALO_COLOR_VIOLATION`.
- Halo glow xuat hien o S0 hoac S1 (chi duoc phep o S2), hoac S2 khong glow -> `BLOCKER =
  STATE_MACHINE_VIOLATION`.
- Khe khong dat "full tim" o S1/S2, hoac S0 da "full" tu dau (khong con phan biet duoc dormant) ->
  `BLOCKER = STATE_MACHINE_VIOLATION`.
- Violet wash toan canh hoac dung lam key/fill light, o bat ky state nao -> `BLOCKER =
  VIOLET_IN_ENVIRONMENT`.
- Geometry/rig/topology thay doi ngoai pham vi anh sang/vat lieu/camera/grade -> `BLOCKER =
  SCOPE_VIOLATION` (ghi ro thay doi cu the).
- Mau canon nen (helmet/ao/slit hue) drift khoi gia tri khoa -> `BLOCKER = CANON_COLOR_DRIFT`.
- Yeu to anime/cel-shade/speed-line/neon-HUD xuat hien o bat ky state nao -> `BLOCKER =
  STYLE_VIOLATION`.
- Gate sai schema (khong dung 2 file, hoac thieu muc HALO COLOR CHECK theo tung state trong report) ->
  `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.

## NEU FAIL (huong xu ly)
Neu halo bat violet do bounce/rim/GI ma khong tranh duoc bang chinh lai light-rig/vat lieu thong
thuong (giam emission strength khe, doi goc rim, them occlusion/flag chan): DUNG va bao cao chinh xac
nguyen nhan (bounce tu dau, cuong do bao nhieu, da thu chinh gi, o state nao). KHONG tu y ha thap chat
luong hieu ung de "che" ma khong bao cao - day la ranh gioi canon, operator se ra ruling tiep.

## SAU KHI PASS
Lane B + operator xem 3 clip S0/S1/S2 truc tiep, xac nhan state machine doc dung tu "ngu" -> "thuc
tinh" -> "chien dau" truoc khi giao lai cho BOOS cat nhip ignition trong short THIRD AXIS S2 (ngoai
scope task nay). Neu dat, co the dung lam premium cinematic reference moi cho cac track/short khac
tuong tu; neu chua dat co the can chinh them 1 vong (vd cuong do rim, gia tri crush black, mat do haze).
