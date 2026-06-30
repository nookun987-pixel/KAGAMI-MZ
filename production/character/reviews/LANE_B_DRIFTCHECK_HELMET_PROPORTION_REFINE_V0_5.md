# LANE B — DRIFT-CHECK: MIKAGE HELMET PROPORTION REFINE V0.5
Soạn: Lane B (Cowork) · 2026-06-30 · STATUS: DRAFT chờ BOOS visual ruling.
Review `MIKAGE_HELMET_PROPORTION_REFINE_V0_5` vs spec V0.5 (exception #21) + locked helmet target + master.

## RESULT = PASS (đạt mọi target tỉ lệ + làm mềm khối)

| Target V0.5 (operator) | Kết quả | Verdict |
|---|---|---|
| Scale +~15% so vai/cloak | width +13.3% · depth +13.8% · height +15.5% → đầu có trọng lượng | ✓ |
| Nới phần trên, giữ hàm dưới hẹp | upper mass nới, jaw base hẹp | ✓ |
| Đỉnh phẳng → cung crown nông | flat top thay bằng shallow crown arc, không egg | ✓ |
| Giảm chamfer temple/jaw gãy | chạy corrective crown→temple→jaw → chuyển tiếp mềm hơn | ✓ |
| Face-plane rộng/phẳng nhưng bớt vuông hộp | broad nhưng đọc less box-like | ✓ |
| 2 slit recess mỏng + nông hơn | recess dựng lại thin/shallow; đúng 2 slit | ✓ |
| No-slit silhouette sheet trước subdiv/lookdev | có; silhouette đọc được khi tắt slit/material/đèn | ✓ |

### Scope / honesty (proof)
- `NON_HELMET_MESH_HASH` before=after (E4F2DD…) · camera hash before=after (728C66…). Preserve byte-identical. ✓
- Chỉ helmet đổi (hash 1AB765→CFB299, topo 85→138v) · jaw seat 3.500↔3.525 không dời neck. ✓
- Không subsurf · không lookdev/material · `.blend1`=0 · no lock/commit/push. ✓
- Master + spec đọc thật · output reopen-verified. ✓

### Đọc thẳng
Form helmet giờ **đạt**: đầu đủ trọng lượng, crown arc nông, hàm nêm, face-plane, slit mảnh, chamfer mềm.
Đây là độ phân giải **blocking** (138v) nên bề mặt vẫn hơi faceted — phần "porcelain sculpture" mượt cuối
cùng là việc của **shade-smooth + subdiv nhẹ + material + đèn**, KHÔNG phải đổi form nữa. Form đã đủ để khóa.

### Khuyến nghị
Khóa form helmet ở V0.5 (hash body `AEB4C1…`) → qua **lookdev premium** (smooth/subdiv + porcelain SSS +
Rembrandt + rim + void) trên toàn figure, geometry khóa. Nếu sau lookdev vẫn đọc boxy thì mới quay lại geo.

### Notes
- CANDIDATE. Final visual ruling = operator. No canon-lock/asset-lock/public-ready.
- Không trên critical path launch (2D). Asset 3D song song.

PASS_FAIL (review) = PASS · LANE_A_BLENDS_MODIFIED = NO · PUSH_DONE = NO
