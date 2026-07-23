# MIKAGE ARC 1 — TẬP 1 — ZERO-I2V PRODUCTION PLAN v1

> **Operator ruling (2026-07-22):** Tập 1 **KHÔNG dùng image-to-video dưới bất kỳ hình thức nào.**
> Không keyframe nào đi qua I2V, không phát sinh chi phí video generation. Pipeline =
> `STILL-IMAGE CINEMATIC / MOTION-COMIC PRODUCTION`. Định dạng thành phẩm:
> **`CINEMATIC ILLUSTRATED EPISODE — 16:9`** — không gọi là full animation.
>
> **Cam kết:** `I2V_USAGE: 0` · `PAID_VIDEO_GENERATION: 0`
>
> File này là kế hoạch sản xuất bổ sung — không sửa canon, không sửa shot list đã ruled.

---

## 1. Trạng thái kho keyframe (đã check + rename 2026-07-22)

`EP01_THE_SEAL_2026-07-21/02_KEYFRAMES/` — nhận 44 file, **12 bản trùng md5 đã dời vào `_DUP/`**,
còn **32 hình unique, đã rename theo mã cảnh** (đối chiếu từng hình bằng mắt trước khi đặt tên):

| File mới | Vai trò | Ghi chú nghiệm thu |
|---|---|---|
| `C1-KF1.png` | Toàn cảnh đại sảnh, tượng nhỏ | ĐẠT — mắt tối |
| `C1-KF2__MASTER_DESIGN_LOCK.png` | **Anchor 10/10 đã duyệt** | chuẩn design cho cả tập |
| `C1-KF2_ALT1.png` | Alt góc thấp, gần hơn | dự phòng |
| `C1-KF3.png` (+`_ALT1`) | Cận mặt nạ, mắt TỐI, halo | ĐẠT |
| `C1-KF4.png` | Tượng + dải quét ngang | ĐẠT |
| `C2-KF1.png` | Macro bề mặt sứ, vệt sáng nghẹt | ĐẠT |
| `C2-KF2.png` | Điểm xung đơn trong tối | ĐẠT — trung tính, không dạng tim |
| `C2-KF3.png` | Đúp phơi: xung + dải quét | ĐẠT |
| `C3-KF1.png` | Lưới thành phố mưa đêm, mảng tối | ĐẠT |
| `C3-KF2.png` | "Black code in the rain" bề mặt | ĐẠT |
| `C3-KF3.png` | Vệt tín hiệu men đường dây | ĐẠT — nguồn vô danh |
| `C3-KF4.png` (+`_ALT1`) | Chuỗi dị thường dạng glyph | ĐẠT — không chữ thật |
| `C4-KF1.png` | Giao điểm hạ tầng chết (tường ống dẫn, tối vừa) | ĐẠT |
| `C4-KF3.png` | Cùng bối cảnh, thiết bị THỨC (sáng dần) | plate môi trường — tượng ghép lớp khi dựng |
| `C4-KF4.png` (+`_ALT1`) | Cận vai tượng, vệt tín hiệu CHẠM (điểm lóe) | ĐẠT — mắt vẫn tối |
| `C5-KF1.png` (+`_ALT1`) | Ash-to-code: tro dữ liệu tụ dòng | ĐẠT |
| `C5-KF2.png` | Lõi năng lượng sáng dần giữa sảnh ống | ĐẠT — sáng trung tính, không màu ấm |
| `C5-KF3B.png` | Tay bắt đầu rời thân, tro sau lưng | mắt tối ✔ |
| `C5-KF3C.png` | Tay mở rộng hai bên | mắt tối ✔ |
| `C5-KF3D.png` | Tư thế chủ động hoàn chỉnh, sảnh sáng thiết bị | mắt tối ✔ |
| `C5-KF4.png` | Boot-sequence 4 bậc + ô cuối TRỐNG | ĐẠT — đúng ruling tên |
| `C5-KF6.png` (+`_ALT1`) | Cận mặt, MẮT TÍM #8F00FF | hình tím duy nhất ✔ |
| `C6-KF1.png` | Sảnh ống gần đen (sập điện, dư ảnh) | ĐẠT |
| `C6-KF2.png` | Quầng cháy sém quanh bệ + hơi nước | ĐẠT — không màu ấm |
| `C6-KF3.png` (+`_ALT1`) | Log glyph chết giữa dòng | ĐẠT |
| `C6-KF4.png` | Toàn cảnh tối, chỉ 2 mắt tím | hình đóng tập ✔ |

**Thiếu đúng 1 mốc: `C4-KF2`** (tín hiệu thấm qua ống dẫn về buồng). Không cần generate thêm —
xử lý zero-cost: crop/đảo sáng từ `C3-KF3` (vệt tín hiệu trong hạ tầng) composite lên nền
`C4-KF1`, thêm overlay vệt sáng lan. Nếu bồ vẫn muốn 1 hình riêng thì generate đúng 1 ảnh — quyết
sau, không chặn dựng.

**Ghi chú trạng thái C5-KF3A và C5-KF5:** không cần ảnh riêng — KF3A (đầu cúi, khớp khóa) dùng
chính master `C1-KF2`; KF5 (khoảng lặng) dùng `C5-KF3D` hạ sáng bằng mask. Đúng tinh thần "giảm
số ảnh bằng ảnh gốc + mask + dịch vài pixel".

## 2. Phân loại sản xuất (4 nhóm theo ruling)

**MASTER STILL (13)** — ảnh gốc chuẩn, nguồn cho mọi derived:
`C1-KF1 · C1-KF2__MASTER · C1-KF3 · C1-KF4 · C2-KF2 · C3-KF1 · C3-KF2 · C3-KF3 · C4-KF1 ·
C5-KF2 · C5-KF6 · C6-KF2 · C6-KF4`

**DERIVED CROP (từ master, không generate mới):**
- Từ `C1-KF2__MASTER`: toàn cảnh → trung cảnh → cận (3 cỡ khung mở tập); trạng thái C5-KF3A.
- Từ `C1-KF3`: crop khe mắt cực cận (nhịp trước khi tím).
- Từ `C3-KF3`: crop chặt vệt tín hiệu → chất liệu cho C4-KF2.
- Từ `C5-KF3D`: hạ sáng mask → C5-KF5 khoảng lặng.
- Từ `C6-KF4`: crop trung cảnh 2 mắt tím (nhịp áp chót trước khi lùi ra toàn cảnh).

**LAYERED COMPOSITE (tách lớp trong compositor):**
- `C1-KF2__MASTER`: tách lớp tượng / bệ / hậu cảnh → parallax nhẹ, camera tiến-lùi vài pixel.
- `C4-KF3` (plate) + lớp tượng cắt từ master → cảnh "buồng thức dậy quanh tượng bất động".
- `C4-KF2` (mốc thiếu): nền `C4-KF1` + vệt sáng từ `C3-KF3` + overlay lan.
- Khe/mắt tím `C5-KF6`: mask mắt sáng bằng compositing (đã có ảnh gốc tím — chỉ cần match khi
  ghép chuỗi, không generate thêm).
- Mưa, bụi, hơi nước, dải quét, log glyph, nhiễu: overlay local toàn tập.

**SEQUENTIAL STILL STATE (chuỗi trạng thái tĩnh — thức tỉnh):**
`C1-KF2__MASTER (=KF3A, khóa)` → `C5-KF3B (tay rời thân)` → `C5-KF3C (tay mở rộng)` →
`C5-KF3D (chủ động hoàn chỉnh, mắt tối)` → `[derived KF5: KF3D hạ sáng]` → `C5-KF6 (mắt tím)` →
`C6-KF1 (sập điện)`.
Cắt giữa các trạng thái bằng: flash rất ngắn · nhiễu hình · khung đen 2–4 frame · âm khóa cơ khí
· heat shimmer · transient của DIGITAL ASH. Không I2V, không cố nội suy chuyển động trơn.

## 3. Luật dựng (chống MV-slideshow cũ)

- KHÔNG "một ảnh + zoom chậm 10s + đổi ảnh theo nhạc". Cắt theo **quan hệ nhân–quả của truyện**,
  nhanh/chậm theo diễn biến, không theo bar nhạc.
- Mỗi master khai thác đa cỡ khung (toàn/trung/cận) trước khi sang ảnh mới.
- Camera move chỉ tiến/lùi/dịch ngang rất nhẹ trên lớp đã tách; puppet warp rất nhẹ nếu cần.
- Ánh sáng đổi bằng mask, không regenerate.
- **Không lyric trên màn hình.** Sound design dẫn hành động thay cho chuyển động AI.
- Track theo shot list đã ruled: C1–C2 không nhạc · C3–C4 STATIC · C5 DIGITAL ASH · C6 cắt cứng,
  outro mưa + nhịp dao động lõi.

## 4. RESULT

```
KEYFRAMES_CHECKED: 44 nhận · 12 dup (md5) → _DUP/ · 32 unique RENAMED theo mã cảnh
COVERAGE: 24/25 mốc truyện có ảnh gốc hoặc derived-plan · thiếu duy nhất C4-KF2 → xử lý bằng composite, không generate bắt buộc
CANON_CHECK_TOÀN_KHO: mắt tối đến C5-KF6 ✔ · không Blade (đúng ruling) ✔ · không màu ấm ✔ · không chữ thật ✔ · tím chỉ ở C5-KF6/C6-KF4 ✔ · không lộ mặt người ✔
PHÂN_LOẠI: MASTER STILL 13 · DERIVED CROP theo kế hoạch §2 · LAYERED COMPOSITE §2 · SEQUENTIAL STILL STATE chuỗi thức tỉnh 7 bậc
I2V_USAGE: 0
PAID_VIDEO_GENERATION: 0
FORMAT: CINEMATIC ILLUSTRATED EPISODE — 16:9 · 3840×2160
CANON/SHOT-LIST: không sửa — đây là kế hoạch sản xuất bổ sung
NEXT: dựng local theo §2–§3 (editor/compositor) → bản cắt nháp Tập 1
```
