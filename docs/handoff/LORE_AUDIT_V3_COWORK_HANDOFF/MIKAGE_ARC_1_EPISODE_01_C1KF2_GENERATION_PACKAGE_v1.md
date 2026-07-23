# MIKAGE ARC 1 — TẬP 1 — C1-KF2 GENERATION PACKAGE v1 (DESIGN LOCK)

> **Trạng thái:** `RULED — ASPECT LOCKED 16:9, SẴN SÀNG CHẠY.` (Operator 2026-07-21: khóa 16:9
> toàn Tập 1 — master 3840×2160, bản dựng nhẹ 1920×1080 — kèm quy tắc bố cục C1-KF2 ở §2.5.)
> Gói prompt cho đúng **một hình duy nhất: C1-KF2** — hình design-lock chốt thiết kế Mikage +
> Zenith Blade + căn buồng trước khi chạy 24 hình còn lại.
>
> **Lý do gói này tồn tại:** phiên Cowork hiện tại **không có công cụ tạo hình** (đã kiểm tra —
> không có image-generation tool nào kết nối). Khâu generate phải chạy trên pipeline hình ảnh
> quen thuộc của studio ở máy local (MJ / GPT Images / ComfyUI — theo lịch sử repo). Gói này là
> đầu vào hoàn chỉnh cho pipeline đó: một người (hoặc Codex) cầm nó chạy được ngay, không cần
> đọc lại chuỗi tài liệu thượng nguồn.
>
> **Nguồn:** `MIKAGE_ARC_1_EPISODE_01_SHOT_LIST_v1_1_RULED.md` (§0 + C1-KF2 + Blade continuity)
> · Entity Phase Spec (banner SHELL COLOR 2026-07-21 + mask canon §2) · `MIKAGE_ZENITH_BLADE_SPEC_V1.md`
> (P1 Compact-Idle) · mikage-zenith-design skill (helmet mark canon).

---

## 1. Hình cần tạo — mô tả một đoạn

Pho tượng Mikage toàn thân, chính diện, trong một buồng niêm phong cũ nằm sâu trong hạ tầng
White Monolith. Mikage **đứng bất động trên bệ** — đầu hơi cúi, vai khép, mọi khớp khóa cứng ở tư
thế bị-đặt, như một hiện vật chứ không phải một người. Toàn thân là vỏ sứ **porcelain `#F2EEEA`**
— trắng ngà, bề mặt sứ khoáng lì, hoàn hảo không một vết nứt. Mặt là helmet sứ kín dáng mặt nạ
Kitsune phẳng, **hai khe cảm biến ngang tối đen** — không mắt, không miệng, không sáng. Sau
vai/lưng nhô **một phần silhouette Zenith Blade** ở trạng thái Compact-Idle: khối B4C đóng kín,
phẳng, thẳng, tối hoàn toàn, không phát sáng — chỉ thấy đủ để biết nó tồn tại, không phá cảm giác
"pho tượng". Buồng xung quanh sạch, đối xứng, ánh sáng tối thiểu trung tính, mang dấu bị bỏ lại
lâu ngày: bụi thời gian ở mép, thiết bị chết, không bảng tên, không hồ sơ, không logo phe nào.

## 2. Prompt dựng sẵn (EN — cho image model)

**Positive:**

```
full-body frontal shot of a life-size porcelain statue standing on a low pedestal, sealed
ceramic android figure, ivory porcelain #F2EEEA matte mineral ceramic surface, flawless,
zero cracks, head slightly bowed, shoulders closed, joints rigidly locked in a placed pose,
faceless sealed helmet with flat kitsune-mask planar geometry, two thin horizontal sensor
slits completely dark and unlit, no eyes no mouth, partial silhouette of a large closed
rectangular slab weapon mounted flat against the back, matte dark, non-emissive,
old sealed vault chamber deep inside white monolithic infrastructure, symmetric
architecture, minimal cold neutral lighting, long-abandoned: fine dust at edges, dead
equipment panels, no signage no logos no text, cinematic still, hard sci-fi industrial,
high detail ceramic material study, muted grays and void black, single subject centered
```

**Negative:**

```
#FAFAFA pure white, plastic gloss, glossy toy, cracks, kintsugi, gold, red, crimson,
#E60000, orange, yellow, warm light, purple glow, violet light, glowing eyes, lit slits,
human face, eyes, mouth, skin, hair, anime, neon, gaming HUD, fantasy armor, samurai,
katana, curved blade, sword drawn, weapon glowing, text, letters, watermark, logo, emblem,
sitting, lying down, action pose, dynamic pose, motion blur, crowd, second character
```

**Tham số (LOCKED):** khung **16:9** — master `3840×2160`, bản dựng nhẹ `1920×1080`. Áp cho
toàn bộ Tập 1, không riêng hình này.

### 2.5 Quy tắc bố cục C1-KF2 (operator ruling)

- Mikage đứng chính giữa, chiếm khoảng **45–55% chiều cao khung**.
- Chừa nhiều khoảng tối và kiến trúc hai bên để căn buồng có quy mô.
- Người + helmet + Blade nằm trong **vùng trung tâm dọc-an-toàn** — để sau này cắt được
  poster hoặc 9:16 mà không mất chủ thể.
- **Không crop sát** đầu, chân, bệ, hoặc silhouette Blade.

**Thêm vào cuối positive prompt (nguyên văn):**

```
cinematic widescreen composition, 16:9 aspect ratio, full-body subject with generous
environmental space, symmetrical monumental framing, subject centered within
vertical-safe crop area, 4K film still
```

## 3. Checklist nghiệm thu hình ra (operator đối chiếu trước khi duyệt design lock)

| # | Kiểm tra | Đạt khi |
|---|---|---|
| 1 | Màu vỏ | Trắng ngà `#F2EEEA`, lì — KHÔNG trắng tinh `#FAFAFA`, không bóng nhựa |
| 2 | Vỏ nguyên vẹn | Không một vết nứt, không kintsugi, không vàng, không đỏ |
| 3 | Tư thế | Đứng trên bệ, đầu hơi cúi, vai khép, khớp khóa — KHÔNG ngồi/nằm/động tác |
| 4 | Mặt | Helmet Kitsune phẳng kín; 2 khe ngang TỐI ĐEN; không mắt/miệng/da/tóc |
| 5 | Blade | Silhouette một phần sau vai/lưng; khối phẳng thẳng đóng kín; TỐI, không emissive, không tím/đỏ; KHÔNG dáng katana/kiếm cong |
| 6 | Buồng | Cũ, sạch, đối xứng, sáng trung tính tối thiểu; có dấu bỏ lại lâu ngày; KHÔNG chữ/logo/bảng tên |
| 7 | Ánh sáng | Chỉ trung tính/lạnh; không vàng/cam/đỏ; KHÔNG tím ở bất kỳ đâu (tím chỉ có từ C5-KF6) |
| 8 | Chữ | Không ký tự nào trong hình |

Hình đạt cả 8 → operator duyệt design lock → thiết kế Mikage/Blade/buồng này trở thành chuẩn
tham chiếu cho 24 hình còn lại (các hình sau generate bám hình này làm style/character anchor).
Hình trượt bất kỳ dòng nào → chạy lại, không sửa checklist cho khớp hình.

## 4. Ghi chú tham chiếu nội bộ (cho người chạy pipeline)

- Mark nhân vật canon-locked (dáng helmet + 2 khe) có tại design skill:
  `assets/character/mikage_helmet.svg` — dùng đối chiếu hình học khe/mặt nạ, không phải để chèn
  vào hình.
- 3 key visual film-proof đã LOCKED làm nguồn tham chiếu nội bộ (UNIFIED_KEY_VISUAL_V4,
  AUDIO_SHORT_VISUAL_CANON_V4, ZENITH_BLADE_V2 — theo Transmission System outline §6): nếu
  pipeline hỗ trợ image-reference, ưu tiên ZENITH_BLADE_V2 cho dáng Blade. Các file này KHÔNG
  được duyệt public — chỉ dùng làm reference generate nội bộ.
- Kết quả nên lưu theo convention hiện có của studio, đề xuất:
  `production/.../EPISODE_01/C1-KF2_DESIGN_LOCK_v1.png` — vị trí chính xác do operator/Codex
  quyết theo cấu trúc thư mục production hiện hành. `UNCONFIRMED`.

## RESULT

```
FILE: MIKAGE_ARC_1_EPISODE_01_C1KF2_GENERATION_PACKAGE_v1.md — RULED (aspect + bố cục khóa 2026-07-21)
SCOPE: đúng 1 hình — C1-KF2 (design lock); 24 hình còn lại CHƯA chạy, chờ hình này được duyệt
GENERATE_IN_SESSION: KHÔNG THỂ — phiên Cowork không có image-generation tool; chạy trên pipeline local của studio
PROMPT: positive + negative + checklist nghiệm thu 8 dòng — tự chứa, không cần đọc lại tài liệu thượng nguồn
ASPECT: LOCKED — 16:9
MASTER_RESOLUTION: 3840x2160 (bản dựng nhẹ 1920x1080)
C1-KF2: GENERATE FIRST
NEXT: chạy prompt → nộp hình → operator đối chiếu checklist §3 → duyệt design lock → mới generate 24 hình còn lại
```
