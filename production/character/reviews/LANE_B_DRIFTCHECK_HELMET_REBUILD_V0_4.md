# LANE B — DRIFT-CHECK: MIKAGE HELMET REBUILD FROM BLOCKING V0.4
Soạn: Lane B (Cowork) · 2026-06-30 · STATUS: DRAFT chờ BOOS visual ruling.
Review `MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4` vs locked spec `MIKAGE_HELMET_BLOCKING_SPEC_V0_1.md` + master.

## RESULT = PASS (helmet thoát khỏi đọc egg/mannequin; đạt success test)

| Spec target | Kết quả | Verdict |
|---|---|---|
| Face-plane trước phẳng/lõm nhẹ mang 2 khe | mặt trước rộng, gần phẳng, lõm nhẹ; 2 khe **recessed** trong topology | ✓ |
| Crown/brow break đọc ở 3/4 | front plane lùi giữa band khe và crown → break đọc được ở 3/4 | ✓ |
| Thái dương thu, không phồng tròn | góc trước chuyển vào temple plane hẹp | ✓ |
| Hàm NÊM vào neck, không cằm tròn | thuôn 2 tầng vào base quanh neck opening | ✓ |
| Side: trước-phẳng vs sau-cong | strict side tách rõ | ✓ |
| Thấp + bè hơn V0.3 | H 0.80 × W 0.71 — thấp/bè hơn oval đã bỏ | ✓ |
| Faceless, 2 khe, không feature/mask | không feature/seam/vent/mask cơ khí | ✓ |
| **SUCCESS TEST** (tắt slit/material/đèn vẫn đọc Mikage) | unlit + no-slit silhouette vẫn distinct, không egg | ✓ PASS |

### Scope / honesty (proof)
- Preserve byte-identical: robe/neck/halo/blade/slit/camera/body — hash KHÔNG đổi (E4F2DD…, camera 728C66…). ✓
- Oval mesh V0.3 **bỏ hẳn** (không edit/reuse); helmet mới `85v/74f`, hash `1AB765…`. ✓
- Hàm seat vào neck (overlap 0.025) **không dời neck**. ✓
- Chỉ helmet mesh đổi · `HELMET_SCOPE_DRIFT = NO` · no lookdev/lock/push. ✓
- Master + spec mở đọc thật · output reopen-verified · PNG inspect thật. ✓

### Đọc thẳng (caveat trung thực)
- Đây là **blocking-resolution** (85v) → các mặt còn **góc cạnh/hard**. Để thành "porcelain sculpture"
  mượt cần 1 pass **bevel/subdiv nhẹ** hoặc để lookdev (shade smooth + subdiv) lo. KHÔNG phải đổi form.
- Helmet giờ **nhỏ/gọn hơn** so với cloak lớn — đúng hướng master (đầu khiêm tốn trên void body), nhưng
  scale/tỉ lệ đầu-thân là **visual ruling của operator** nếu muốn chỉnh.

### Notes
- CANDIDATE. Final visual ruling = operator. No canon-lock/asset-lock/public-ready.
- Không trên critical path launch (2D). Asset 3D song song.

PASS_FAIL (review) = PASS · LANE_A_BLENDS_MODIFIED = NO · PUSH_DONE = NO
