# ĐỐI CHIẾU 3 CANON JSON CŨ (repo gốc) ↔ MIKAGE_ZENITH_CANON_V2.md (SSOT sync)

> Read-only audit · 2026-06-13 · KHÔNG sửa/copy/phong canon. Mọi quyết định gom/bỏ/giải-xung-đột là của operator.
> Nguồn cũ: `D:\KAGAMI-MZ\` (root). Nguồn mới: `KAGAMI-MZ_SYNC_PUSH_V2\exports\grapuco_system_review\02_CANON_AND_RULES\MIKAGE_ZENITH_CANON_V2.md` (616 dòng, 16 mục).

---

## VERDICT NHANH

| File cũ | Loại | Verdict | Hành động đề xuất |
|---|---|---|---|
| `MIKAGE_CONTEXT_CORE.json` | **KHÔNG phải canon** — state kỹ thuật pipeline (04/17) | Đã lỗi thời hoàn toàn | ARCHIVE/DROP — không gom vào canon |
| `MIKAGE_FRAME_LOGIC.json` | Film/image-gen (shot discipline) | ~70% trùng V2 §5; còn vài luật QA độc nhất | Trích phần độc nhất làm doc REFERENCE |
| `MIKAGE_IDENTITY_LOCK.json` | Film/image-gen (visual canon) | V2 hút ~85%; còn chi tiết khoáng + **3 xung đột màu** | Gom phần khoáng; **operator phán xung đột màu** |

---

## 1. CONTEXT_CORE.json → KHÔNG GOM

Đây là file trạng thái pipeline tháng 4 (phase = BUSINESS_PACKAGING), nội dung là: FAL SDXL img2img, Vertex RAG writer/lane, ComfyUI two-image backend, validator code paths, `important_files` trỏ vào `core/identity/*.js`, `rag/*.js`...
→ Toàn bộ là Lane A kỹ thuật, đã bị hệ handoff hiện tại thay. **Không có IP-canon nào để gom.** Giữ lại chỉ như ghi chú lịch sử nếu muốn, không đưa vào SSOT.

## 2. FRAME_LOGIC.json → TRÍCH PHẦN ĐỘC NHẤT (reference)

V2 §5 (Camera/Cinematography) đã có: ARRI Alexa 65, anamorphic 2.39/2.76:1, Ma 70%, dolly tĩnh không rung, prime lens 35/50/85/100mm. **Trùng.**

**V2 CHƯA có (độc nhất ở FRAME_LOGIC, đáng giữ làm reference QA):**
- Luật **30-40-30 frame zone** (background 30 chứa distortion / transition 30 / safe-zone 40 **bất khả xâm phạm**, pixel-warp & chromatic-aberration tolerance = 0).
- **forbidden_line_positions**: cấm đường ngang ở cổ (neck_cut), cấm chéo cắt mặt (face_bisect), kiến trúc nền không được cắt silhouette.
- Danh sách **6 environment APPROVED / 6 FORBIDDEN** cụ thể (concrete phẳng, brutalist 1-point, metal grid... vs cyberpunk alley, fantasy, outdoor...).
- **Readability QA**: mask = điểm nóng saliency duy nhất; đọc được ở thumbnail 25%; product ≥30% frame.

⚠️ Lưu ý không phải xung đột: aspect 2.76:1 (cine) ≠ 1080×1920 9:16 (shorts/canvas) — **khác mục đích output**, không phải mâu thuẫn.

## 3. IDENTITY_LOCK.json → V2 hút phần lớn, CÒN 3 XUNG ĐỘT MÀU

**V2 đã có (trùng/đầy hơn):** B4C #FAFAFA armor, graphene #0A0A0A, Zenith Blade 350kg #E60000 800°C, palette 80/15/5, lighting 4:1 chiaroscuro, physics Landauer + kintsugi, hard bans, mask fox-not-kitsune, hair, eye apertures void black.

**V2 CHƯA có (chi tiết khoáng độc nhất — gom được, không xung đột):**
- Nguồn gốc khoáng của màu: Gofun (vỏ hàu), Sumi ink carbon, Bengala iron oxide (sắc tố Jomon).
- Lý lẽ "non-color": #FFFFFF = chân không số, #000000 = void chết → cấm dùng.
- "Subtractive Mineral Logic" + trần bão hoà **max saturation HSL 0.65**.
- Lighting đặt tên In'ei Reisan + dịch nhiệt độ Gosai (Ao-zumi / Cha-boku) + highlight anisotropic.
- Sub-palette chi tiết (whites / blacks / crimsons).

### ⚠️ 3 XUNG ĐỘT MÀU — CẦN OPERATOR PHÁN (không tự xử)

| Món | IDENTITY_LOCK (cũ, 04) | ZENITH_CANON_V2 (SSOT sync) | Cine-color contract (handoff, 06/04) |
|---|---|---|---|
| **Crimson** | primary **#8E050F** (blood-iron, range →#9D2933), cấm #FF0000, sat≤0.65 | **#E60000** (đỏ tươi bão hoà cao) | (không định nghĩa lại crimson) |
| **Violet** | **KHÔNG có** (cấm neon tím) | env mode **#BF00FF** + Royal Violet #8000B0 | **#8F00FF** (slit-only signal) |
| **Cyan / steel** | cấm cyan trên thân | env mode **Cyan #00FFFF** | **Z-Blue #4B5866** (thay "cold cyan") |
| **Kintsugi gold** | hairline only, không hex | gold resin (không hex) | **#C39A52** matte urushi |

→ **3 nguồn nói 3 kiểu.** Theo CLAUDE.md (two-layer canon): BRAND/cine-contract thắng cho UI/public; film/image-gen là reference-only; khi xung đột BRAND thắng. Nhưng V2 tự xưng "SSOT V2.0" → có **căng thẳng quyền lực** giữa V2 và cine-contract 06/04. Đây là món operator phải chốt: **ai là SSOT màu cuối — V2 hay cine-color contract?**

---

## ĐỀ XUẤT (chờ duyệt, không tự làm)
1. CONTEXT_CORE → archive, gạch khỏi danh sách "chưa gom".
2. FRAME_LOGIC → trích 4 luật QA độc nhất thành 1 file reference ngắn trong sync.
3. IDENTITY_LOCK → gom chi tiết khoáng vào V2 (phần không xung đột); **3 xung đột màu để operator ra 1 ruling** chốt SSOT màu.
