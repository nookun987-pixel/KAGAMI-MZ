# LANE B — DRIFT-CHECK: MIKAGE MICRO GEOMETRY CORRECTION V0.2
Soạn: Lane B (Cowork) · 2026-06-30 · STATUS: DRAFT chờ BOOS visual ruling.
Review `MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2` vs 3 vùng fix của exception #18 + master.

## RESULT = PASS on B+C · helmet (A) IMPROVED-BUT-BORDERLINE → operator ruling

| Vùng | Yêu cầu #18 | Kết quả | Verdict |
|---|---|---|---|
| **B Halo** | mỏng lại · tách xa · ánh sáng không phải ống · side không thành thanh trắng | tiết diện còn 36% · Y 0.30→0.44 · yaw 8° · side = ellipse mảnh | ✓ FIXED |
| **C Neck/robe** | bỏ trụ đen cắm đầu · robe nhận helmet liền · không lock graphene | 5 graduated ring → silhouette liền · neck material UNSPECIFIED | ✓ FIXED |
| **A Helmet** | bớt trứng/mannequin · hẹp lateral · planar character tiết chế · giữ ovoid/faceless/2 khe | hẹp nhẹ + six-plane rhythm + **asymmetry sub-percent** | ⚠ improved nhưng close-up vẫn đọc trứng trơn |

### Scope / honesty (proof)
- Robe / 2 khe / blade: hash + transform KHÔNG đổi. ✓ Preserve đúng.
- Chỉ 3 vùng A/B/C đổi · mesh datablock 101/101 · no second form · `MICRO_FIX_SCOPE_DRIFT = NO`. ✓
- No lookdev · neck material không lock · no canon-lock/asset-lock/push. ✓
- Master mở đọc thật · output reopen-verified · PNG inspect thật. ✓

### Đọc thẳng
Halo + cổ-robe: đạt, đáng khóa. Helmet: đỡ hơn V0.1 nhưng asymmetry quá nhẹ (sub-percent) nên
mặt trước/close-up vẫn hơi generic. 2 đường đi hợp lý — quyết định của operator:
1. **Chấp nhận helmet, qua lookdev finish.** Porcelain SSS + 1-key Rembrandt + rim sẽ tự tạo phần lớn
   "sculptural porcelain" mà clay phẳng Eevee đang giấu. Chỉ động lại helmet geometry NẾU sau lookdev vẫn generic.
2. **1 pass helmet-only nữa** (crown ridge / brow plane / cheek plane / chin rõ hơn — character THẤY ĐƯỢC,
   không sub-percent), preserve mọi thứ khác, rồi mới lookdev.

### Notes
- CANDIDATE. Final visual ruling = operator. No canon-lock/asset-lock/public-ready.
- Không trên critical path launch (2D). Asset 3D song song.

PASS_FAIL (review) = PASS (B+C) / HOLD (A pending ruling) · LANE_A_BLENDS_MODIFIED = NO · PUSH_DONE = NO
