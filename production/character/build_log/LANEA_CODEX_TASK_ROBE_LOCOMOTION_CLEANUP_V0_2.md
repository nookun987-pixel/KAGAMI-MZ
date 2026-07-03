# LANE A / CODEX TASK BRIEF — MIKAGE ROBE LOCOMOTION CLEANUP V0.2
Soan: BOOS (operator), formatted by Lane B (Cowork) - 2026-07-03 - STATUS: DRAFT - KHOA toi khi BOOS
mo exception #46 (Forty-sixth). Governed by AGENTS.md "Forty-sixth controlled exception"
(`MIKAGE_ROBE_LOCOMOTION_CLEANUP_V0_2`).

> Boi canh: exception #45 (`MIKAGE_ROBE_LOCOMOTION_TEST_V0_1`) PASS ve ky thuat (topology/hash/mau/
> khong lo chan deu dat) nhung sau khi operator xem lai ky, ruling da SUA: frame cuoi (120) co 1 khoi
> den hinh nem tach len tren halo - nhin ky giong vung mesh co/collar bi keo sai hon la meo phoi canh
> don thuan. Chuyen dong hien tai cung doc hoi giong "ca khoi truot va co nho" chu chua tao cam giac
> Mikage chu dong di chuyen co trong luong. RULING: KHONG nang thang len Stage D (walk cycle chinh
> thuc). Mo 1 exception nho de lam sach truoc: xac dinh dung nguyen nhan hinh nem, sua vung anh huong
> cua helper, giam bien do bob/lean, giu nguyen quang duong/thoi luong.

## SOURCE OF TRUTH
- Source: `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_LOCOMOTION_TEST_V0_1.blend`
  (exception #45, PASS ky thuat nhung VISUAL STATE = HOLD FOR CLEANUP).
- Commit baseline (theo Codex): `65b9b97`.
- Giu nguyen canon: closed draped void cloak, khong lo hoac goi y tay/chan.

## TASK
`MIKAGE_ROBE_LOCOMOTION_CLEANUP_V0_2` - 1 task. CANDIDATE / CLEANUP, KHONG phai Stage D, KHONG phai
locomotion production-ready.

## VAN DE (PROBLEM)
- Cac frame chuyen dong cuoi (khoang 96-120) cho thay 1 khoi den hinh nem/coi tach ra phia tren halo.
- Nguyen nhan chinh xac CHUA duoc xac nhan.
- Test hien tai hop le ve ky thuat nhung CHUA du sach ve hinh anh de nang len Stage D.

## VIEC CAN LAM (DO)
1. Xac dinh dung object hoac vung vertex tao ra khoi nem den trong frame 96-120.
2. Dam bao helmet, halo, neck connector va collar tren cung luon coherent xuyen suot qua trinh root
   di chuyen (khong tach roi, khong lech khong gian transform).
3. Gioi han bien dang robe thu cap (secondary deformation) chu yeu o vung giua va duoi cua khoi ao.
4. Giu phan than tren va helmet on dinh; chuyen dong phai doc nhu robe-glide co kiem soat, KHONG phai
   scaling hay troi noi.
5. Giam bob tu 0.028 m xuong khoang 0.018 m.
6. Giam lean tu ±1.4° xuong khoang ±0.8°.
7. Giu nguyen quang duong root 1.5 m va thoi luong 5 giay.
8. KHONG them mesh, tay/chan, bone moi (ngoai 2 helper da co), animation blade, thay doi vat lieu,
   hoac moi truong.
9. Giu halo trang va dung 2 slit emission `#8F00FF`.

## RANH GIOI - KHONG DUOC LAM
- KHONG them mesh/bone moi ngoai pham vi sua 2 helper da co (`drape_secondary_lower`/`_upper`).
- KHONG tao/goi y tay chan duoi bat ky hinh thuc nao.
- KHONG doi mau halo/slit/blade. KHONG animate blade rieng.
- KHONG che dau artifact bang cach crop camera - phai sua tan goc nguyen nhan.
- KHONG lam Stage D (walk cycle day du) trong task nay.
- KHONG push. KHONG deploy. KHONG canon-lock.

## GATE (dung 2 file)
- `contact_sheet.png` = 5 frame (0, 30, 60, 90, 120).
- `contact_sheet_review_report.md` = xac nhan nguyen nhan that su cua hinh nem, ket qua sua, so lieu
  bob/lean moi, xac nhan halo/collar/helmet coherent xuyen suot.

## OUTPUT (real deliverables)
- `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_LOCOMOTION_CLEANUP_V0_2.blend`
- `production/character/reviews/MIKAGE_ROBE_LOCOMOTION_CLEANUP_V0_2.mp4` (720x1280, 24fps, 5s, khong audio)
- `production/character/reviews/MIKAGE_ROBE_LOCOMOTION_CLEANUP_V0_2_KEYFRAMES.png` (5 frame: 0/30/60/90/120)
- `production/character/reviews/MIKAGE_ROBE_LOCOMOTION_CLEANUP_V0_2_PROOF.md` (phai neu ro nguyen nhan
  da xac nhan cua hinh nem, khong chi phong doan)

## PASS CONDITIONS
- Khong con hinh nem, collar tach roi, hay object nao vuot ra ngoai halo.
- Halo la 1 vong tron sach o MOI frame.
- Helmet va than tren khong bi scale/tach/troi ro rang.
- Robe van la 1 mesh kin: 0 boundary edge, 0 non-manifold edge.
- Khong lo hoac goi y chan.
- Quang duong root van dung 1.5 m.
- Validator PASS. `.blend1` = NONE.
- Khong push/deploy/canon-lock.

## FAIL CONDITIONS
- Nguyen nhan hinh nem van chua duoc xac dinh -> `BLOCKER = WEDGE_CAUSE_UNCONFIRMED`.
- Sua bang cach crop/an camera thay vi sua goc -> `BLOCKER = COSMETIC_FIX_ONLY`.
- Halo/helmet/blade/slit mau hoac topology cloak thay doi -> `BLOCKER = SCOPE_VIOLATION` (ghi ro thay
  doi cu the).
- Gate sai schema -> `BLOCKER = VALIDATOR_SCHEMA_MISMATCH`.

## NEU FAIL (huong xu ly tiep, ghi trong proof neu xay ra)
Neu giam helper van con hinh nem:
1. Tat `drape_secondary_upper`.
2. Chi giu root motion va `drape_secondary_lower`.
3. Khoa toan bo vertex tu vai tro len khoi secondary deformation.
4. Kiem tra parent inverse va constraint space cua halo, helmet va neck connector.
Neu can buoc nay, dung sau khi thu va bao cao ro, KHONG tu y mo rong scope them.

## SAU KHI PASS
- Halo sach toan doan, co/dau/cloak khong tach nhau, chuyen dong mang cam giac khoi ao tien co trong
  luong (khong phai vat troi). Co the dung ban nay lam nen de mo Stage D chinh thuc.
- Neu SSOT conflict hoac scope drift: dung va bao cao.
