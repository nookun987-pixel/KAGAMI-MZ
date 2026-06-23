# DRIFT-CHECK — Material lookdev V0.13 vs brand
Lane B QC · 2026-06-23 · Ảnh đã mở: `reviews/MIKAGE_HERO_MOUNT_MATERIAL_EEVEE_V0_13_CONTACT_SHEET.png` (4800×900, 4 panel, có màu).
KHÔNG canon-lock, KHÔNG PASS/final. Output = CANDIDATE.

## 3 VẬT LIỆU
**Porcelain `#f2eeea`: ĐẠT.** Vỏ/giáp/helmet trắng, sáng-mờ, **phản xạ mềm**, không bóng gương/nhựa. Đọc rõ là chất sứ. ✔
**Graphite matte: ĐẠT.** Lót/tóc/mantle/đốt bụng tối, ít phản xạ — tương phản tốt với porcelain. ✔
**Cold-steel + Z-Blue `#4B5866` non-emissive: ĐẠT.** Khớp mã/cạnh/slab blade lạnh, không warm, không cyan sáng. Z-Blue hơi nhẹ (tinh tế) — ổn. ✔

## LIGHTING / PRESERVATION
- Key đủ sáng (hết under-expose như V0.9) + rim tách khối khỏi nền void + contact shadow dưới chân ✔.
- Geometry/silhouette/pose giữ nguyên (315 mesh match V0.12) ✔ · violet giữ mức cũ ✔ · không warm/halo/flood/crimson/gold ✔.

## CỜ VÀNG (anti-toy — xử ở vòng sau, không chặn)
- Bề mặt còn **mịn/sạch** → có nguy cơ "figurine/đồ chơi nhựa" (tiêu chí anti-toy). Đề xuất V0.14/grade: thêm **fine grain** + chớm hao mòn cạnh để chất sứ/thép "thật", bớt model-kit.
- Helmet 2-slit + core chưa nổi (violet đang giữ thấp) → để **violet pass** làm điểm focal.

## KẾT LUẬN
- Material lookdev NẮN ĐẠT — palette đúng brand, 3 chất tách bạch, exposure đã sửa. **Đây là bản "đẹp" đầu tiên.**
- Là ứng viên REVEAL ảnh tĩnh, NHƯNG beat reveal mạnh nên cưỡi lên **V0.14 violet pass** (slit/core sáng = "nó sống") + thêm grain anti-toy. Khi đó crop rider close panel 2 làm hero still.

## BƯỚC KẾ
`MIKAGE_HERO_MOUNT_VIOLET_GRAIN_EEVEE_V0_14`: bật violet signal (slit + core + 1 điểm nhấn, đúng mức tiết chế) + fine grain anti-toy + giữ material V0.13. → rồi MOTION V0.15.
