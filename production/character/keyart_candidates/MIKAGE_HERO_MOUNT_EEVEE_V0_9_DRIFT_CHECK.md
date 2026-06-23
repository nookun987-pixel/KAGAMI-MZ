# DRIFT-CHECK — Hero Mount EEVEE progression (V0.8 rider + V0.9 motion) vs blueprint V0.4/V0.5
Lane B QC · 2026-06-23 · Input cho vòng shape-correction kế của Codex.
Blueprint = DRAFT art-direction reference (KHÔNG phải SSOT). KHÔNG canon-lock, KHÔNG gọi PASS/final/production-ready. Mọi output = CANDIDATE.

Nguồn xem (ảnh thật đã mở):
- `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER_CONTACT_SHEET.png` (3 view × 2 pass, bright)
- `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_9_MOTION_KEYFRAMES.png` (3 frame, low-key)
- `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_9_MOTION.mp4`

## SPEC CHECK — V0.9 motion (tool-verified, ffprobe)
- 1080×1920 · H.264 · yuv420p · 30fps · 180 frame = **6.0s** · no audio → ĐÚNG Canvas spec (6–8s). VERIFIED.
- CỜ ĐỎ EXPOSURE: keyframes rất tối/under-exposed (đúng như note formation reel — V0.9 đã phải grade lift ở Lane B mới dùng được). Bản render gốc chưa đủ sáng để public trực tiếp; cần Codex nâng exposure/key-light ở vòng sau, hoặc tiếp tục grade Lane B.

## TIẾN ĐỘ 8 ĐIỂM LỆCH (so drift-check V0.1)
| # | Mục | V0.1 | V0.8/V0.9 | Trạng thái |
|---|-----|------|-----------|-----------|
| 1 | Đầu cơ giáp mã = equine wedge | hộp nhỏ | vẫn khối hộp nhỏ, chưa ra wedge trán/mõm/hàm | **CÒN HỞ** |
| 2 | Thân: spine cong + withers/croup + keel | hộp phẳng | chassis dài liền hơn nhưng **chưa thấy spine cong**, 2 khối nhô + keel chưa rõ | **HỞ MỘT PHẦN** |
| 3 | Chân: khớp+piston, stride so le, móng to | que song song | **đã có** khớp trụ + móng/khối tiếp đất + thế chân so le nhẹ; piston/cơ bắp còn mảnh | **NẮN MỘT PHẦN (tốt lên)** |
| 4 | Rider armor breakdown (pauldron/cuirass/lót/đốt bụng) | mannequin trơn | **đã có** pauldron góc cạnh + thân phân lớp; còn boxy, cuirass/đốt bụng chưa sắc | **NẮN MỘT PHẦN** |
| 5 | Khối tóc đen dài sau lưng | không có | chưa đọc rõ khối tóc trong stills | **CÒN HỞ** |
| 6 | Mantle V-taper sau vai | không có | chưa đọc rõ mantle taper | **CÒN HỞ** |
| 7 | Helmet egg + đúng 2 slit | ok hơi trơn | **GIỮ ĐÚNG**: egg + facet nhẹ + đúng 2 slit violet (pass violet) | **ĐẠT (giữ)** |
| 8 | Zenith Blade: gauntlet nắm + đáy tựa holster | trôi trước | slab đã sát thân/cạnh hông nhưng **đọc như khối hộp to**, quan hệ gauntlet-grip chưa rõ trong ảnh | **HỞ MỘT PHẦN** |

## TỔNG
- Hướng đúng, khối đã "đầy" hơn nhiều so V0.1 (rider có giáp, mã có chân khớp + móng, helmet giữ 2-slit chuẩn). Vẫn ở mức **grayscale clay blockout** — chưa material sâu.
- Violet vẫn tiết chế đúng: chỉ ở 2 slit (pass violet). KHÔNG flood. ĐẠT signal rule.
- 3 việc kéo silhouette lên hạng tiếp theo, ưu tiên: **(1) đầu equine wedge**, **(2) spine cong + 2 mass + keel cho mã**, **(5+6) khối tóc + mantle cho rider**. Blade (8) gom grip về gauntlet cho đỡ đọc-như-hộp.
- Exposure V0.9 motion phải xử lý trước khi đưa làm payoff public ở chất gốc.

## NEXT (đề xuất cho Codex, mỗi mục = 1 render bounded)
1. `…SHAPE_CORRECTION_STEED_V0_x`: đầu equine wedge + spine cong + withers/croup + keel. (điểm 1,2)
2. `…RIDER_SILHOUETTE_V0_x`: thêm khối tóc + mantle V-taper, sắc hoá cuirass/đốt bụng. (điểm 4,5,6)
3. `…BLADE_GRIP_V0_x`: gom slab về gauntlet, giảm cảm giác khối-hộp. (điểm 8)
4. Motion: nâng key-light/exposure để bản gốc đủ sáng (giảm phụ thuộc grade). (cờ exposure)

KHÔNG render cho tới khi BOOS authorize đúng task trong `docs/handoff/00_LATEST_CODEX_HANDOFF.md`.
