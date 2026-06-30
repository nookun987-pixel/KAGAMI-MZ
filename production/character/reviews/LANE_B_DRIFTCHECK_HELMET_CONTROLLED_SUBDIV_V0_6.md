# LANE B — DRIFT-CHECK: MIKAGE HELMET CONTROLLED SUBDIV V0.6
Soạn: Lane B (Cowork) · 2026-07-01 · STATUS: DRAFT chờ BOOS visual ruling.
Review `MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6` vs exception #22 + locked helmet target + master.
(Lane B zoom helmet 2.2× từ contact sheet để soi crown/face-plane/wireframe.)

## RESULT = PASS (form helmet hoàn tất — smooth porcelain, giữ toàn bộ identity)

| Yêu cầu #22 | Kết quả (soi zoom + proof) | Verdict |
|---|---|---|
| Mượt facet, đọc porcelain không low-poly | bề mặt subdiv mượt (138→1480v), đọc porcelain tạo hình | ✓ |
| Giữ NGUYÊN tỉ lệ + silhouette V0.5 | evaluated dims giữ <1e-7 so V0.5 | ✓ |
| Crown = 1 cung nông LIỀN (không bump/3 múi) | crown 1 cung parabol liền, không bump, không tóc | ✓ |
| Giữ face-plane trước rộng/gần phẳng | face-plane còn nguyên, front-plane vs sọ sau đọc ở 3/4 + side | ✓ |
| Temple không gãy, wedge jaw seat neck | temple mềm, jaw nêm seat Z=3.500 (neck không dời) | ✓ |
| 2 slit mỏng nông frameless | đúng 2 khe, mỏng, không khung cơ khí | ✓ |
| Không tròn lại egg / không robot | wireframe sạch, không egg, không low-poly | ✓ |

### Scope / honesty (proof)
- `NON_HELMET_HASH` + `PRESERVED_OBJECT_STATE` + `CAMERA_HASH` before=after (byte-identical). ✓
- Chỉ helmet đổi (SIMPLE subdiv → không Catmull co rút) · jaw seat giữ · transform (0,0,0)/(1,1,1). ✓
- Không material/lookdev/đèn · `.blend1`=0 · no lock/commit/push. ✓
- Master + spec đọc thật · output reopen-verified · PNG inspect thật. ✓

### Đọc thẳng
Đây là **điểm kết của khâu FORM**. Helmet giờ là vỏ porcelain mượt, có mặt-trước phẳng + crown arc liền +
hàm nêm + 2 khe mảnh — đọc ra "the sealed one", không egg, không robot. Geometry toàn figure coi như **đủ để khóa**
ở body hash `00BF87…`. Bước còn lại KHÔNG phải form nữa — là **lookdev premium** (material + đèn).

### Khuyến nghị
Khóa geometry ở V0.6 → giao 1 task lookdev finish (porcelain SSS/coat + 1-key Rembrandt + rim mảnh + void grain)
trên toàn figure, geometry LOCK. Đó là bước biến blocking sạch thành hero render premium.

### Notes
- CANDIDATE. Final visual ruling = operator. No canon-lock/asset-lock/public-ready.
- Không trên critical path launch (2D). Asset 3D song song.

PASS_FAIL (review) = PASS · LANE_A_BLENDS_MODIFIED = NO · PUSH_DONE = NO
