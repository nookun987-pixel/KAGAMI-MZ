# MIKAGE — FAKE-3D-FROM-2D MOTION: RESEARCH + RECOMMENDED PIPELINE V1

**Status:** `RESEARCH + RECOMMENDATION` · 2026-06-27 · cited from market/studio sources (see end).
**Purpose:** reduce dependence on slow/expensive 3D (Blender/Codex) by moving a virtual camera over **wide 2D artwork** to fake 3D motion — for fanpage cards, Spotify Canvas, and the web hero. Tools chosen for a **non-technical** operator.

---

## 0. TL;DR (đọc cái này là đủ để bắt đầu)

1. **Brand của mày là trường hợp DỄ NHẤT.** Vấn đề khó nhất của 2.5D là "lỗ hổng phía sau vật khi nó di chuyển" — phải vẽ lại nền bị che. Nhưng nền của mày là **void đen**, nên cái lỗ đó… cũng chỉ là void đen. Gần như **không phải vá gì**. Nền tối + 1 nhân vật tương phản cao = cắt lớp dễ, không bị "rách mép". → cái style tối-tối-giản của mày vốn là điều kiện lý tưởng, không phải hạn chế.
2. **Không cần Blender cho phần lớn motion.** Lấy **1 ảnh hero phẳng** (đã có), tách 2–3 lớp (nhân vật / blade / halo / nền), cho camera đẩy chậm → ra clip "3D" cho fanpage + Canvas + web. Blender chỉ còn cần khi muốn pose/cảnh thật sự mới.
3. **Tool dễ nhất, làm được ngay, miễn phí:** **CapCut "3D Zoom"** (AI tự tách nền, 1 chạm, xuất đúng 1080×1920). Đó là default. Muốn điều khiển đường camera tinh hơn → **Immersity AI** (trả ~$5 để hết watermark).
4. **Quy tắc để KHÔNG bị quê ("ảnh 3D Facebook" rung rinh):** move **chậm và nhỏ**, lớp gần nhanh hơn lớp xa vừa phải (chênh tốc 0.2–0.5, đừng quá 0.7). Violet halo để **lớp riêng**, đừng nướng vào mép nhân vật.

---

## 1. CÁC KỸ THUẬT (dễ → khó, nói cho dễ hiểu)

| Kỹ thuật | Là gì | Độ khó | Khi nào dùng |
|---|---|---|---|
| **Ken Burns (pan/zoom)** | Phóng/đẩy chậm trên 1 ảnh phẳng. Không có chiều sâu thật. | Cực dễ (1 chạm) | Khi chỉ cần ảnh "thở", chưa cần tách lớp. Khớp đúng spec Canvas "breathing zoom 100→104→100%". |
| **Depth-map displacement (AI)** | AI đoán "bản đồ độ sâu" (trắng=gần, đen=xa) rồi đẩy pixel theo đó → cả ảnh có chiều sâu liên tục. | Dễ (gần 1 chạm với AI) | Cách nhanh nhất để 1 ảnh "phồng" thành 3D. Chính là cái CapCut 3D Zoom / Immersity làm. |
| **2.5D parallax nhiều lớp** | Tách ảnh thành lớp (gần/giữa/xa), cho chạy tốc khác nhau khi camera move. Hậu duệ số của "multiplane camera" Disney. | Trung bình (công ở khâu cắt lớp + vá nền) | Khi muốn kiểm soát chính xác lớp nào đi bao nhiêu — chất hơn, premium hơn. |
| **Camera projection (2.5D matte)** | Chiếu ảnh lên khối 3D thô rồi cho camera đi xuyên. | Cao (dân VFX) | Cảnh môi trường lớn, perspective thật. **Không cần cho mày lúc này.** |
| **Multiplane camera** | Bản gốc vật lý của Disney (1937, *Snow White*). | (lịch sử) | Bối cảnh — mọi cái trên là phiên bản số của nó. |

**Tham chiếu thẩm mỹ:** Makoto Shinkai (*Your Name*) chính là "camera trượt trên các lớp tranh phẳng + bokeh trên lớp gần" — đỉnh cao của look camera-trên-2D. Đó là hướng đẹp để nhắm tới.

---

## 2. VÌ SAO STYLE CỦA MÀY LÀ "EASY MODE" (điểm quan trọng nhất)

- **Lỗ hổng nền gần như biến mất:** void đen che mọi khoảng trống sau khi lớp di chuyển → khỏi inpaint phức tạp (đây là rào cản #1 của 2.5D, mày né được).
- **Tách lớp dễ:** porcelain sáng trên void đen = tương phản cao = silhouette sạch, ít "rách mép".
- **Nền phẳng tối không bị kéo giãn:** vùng đồng màu không có chi tiết để smear khi displace.
- **Negative space là lợi thế:** càng tối giản, hiệu ứng càng sang; mắt có chỗ nghỉ, focal point đứng yên trong khi chiều sâu khẽ dịch.
- **1 lưu ý hợp brand:** depth-map ghét glow/fog/mép mờ (gây smear). Nên giữ **silhouette nhân vật sắc**; để **violet halo thành lớp riêng** rồi cho nó dịch nhẹ — đừng feather vào mép subject ở lớp depth.

---

## 3. TOOL — XẾP HẠNG CHO NGƯỜI KHÔNG KỸ THUẬT

| Tool | Làm gì | Dễ (1=cực dễ) | Giá | 1080×1920 / loop? | Giới hạn |
|---|---|---|---|---|---|
| **CapCut – 3D Zoom** | AI tách subject/nền, đẩy subject ra trước → parallax thật, 1 chạm | 1 | Free 1080p (vài hiệu ứng Pro mới có watermark) | Có — canvas 9:16, xuất 1080×1920 @30fps H.264; cắt 6–8s + loop | Cần ảnh nét, độ phân giải cao; ảnh rối/thấp sẽ tách hỏng |
| **CapCut – keyframe zoom tay** | Scale 100→104→100% = "breathing zoom" đúng spec Canvas | 2 | Free, không watermark | Có, loop sạch vì về đúng frame đầu | Chỉ zoom phẳng (không tách chiều sâu) trừ khi ghép 3D Zoom |
| **Immersity AI** (LeiaPix cũ) | Chuyên 2D→3D: tạo depth, **tự đặt đường camera** (đẩy/orbit nhẹ), xuất MP4 | 2 | Không free thật; ~100 credit dùng thử. Bản free 720p + watermark, **không thương mại**. Trả ~$5+ để sạch | Bản trả tới 4K → hạ về 1080×1920 dễ; đường camera lý tưởng cho loop ngắn | Bản free có watermark + non-commercial → phải trả tiền mới xài cho public |
| **Canva – Magic Grab + Photo animation** | Tách fore/back rồi animate từng lớp; có preset Parallax/Zoom/Breathe | 2–3 | Free cơ bản; Magic Grab cần Canva Pro (~$15/th) | Có — design 1080×1920, xuất MP4 | Preset parallax 1-ảnh khá nhẹ; muốn sâu phải làm tay |
| **App điện thoại** (Parallax 3D Photo, DPTH, PopPic…) | Ảnh → AI depth → clip parallax ngắn | 1 | Freemium | Phần lớn xuất clip dọc cho Reels/Shorts | Res + watermark tuỳ app; motion preset, ít kiểm soát |
| **AI image-to-video** (Kling / Runway / Pika) | Ảnh → video có **điều khiển camera** (push/dolly) | 2 | Theo giây/sub (Kling ~$0.07/s; Runway ~$0.15–0.20/s) | Hỗ trợ dọc, native 4K (Kling) → crop dễ | **Generative** → có thể "vẽ lại" làm lệch artwork gốc. Với ảnh brand cố định, rủi ro drift |

**Khuyến nghị xếp hạng cho mày:** ① **CapCut 3D Zoom** (mặc định: free, đúng spec, không watermark nếu không dùng asset Pro) → ② **Immersity AI** (khi cần đường camera đẹp hơn, chịu trả ~$5) → ③ **Canva Magic Grab** (nếu đã quen Canva) → ④ Kling/Runway chỉ khi muốn motion AI vượt mức "đẩy nhẹ" (chấp nhận drift + tốn tiền).

> Lưu ý brand-lock: tool **depth-warp** (CapCut/Immersity/Canva) **giữ nguyên ảnh gốc**; tool **generative** (Runway/Kling/Pika) vẽ lại → dễ lệch canon. Ưu tiên depth-warp.

---

## 4. PIPELINE CỤ THỂ — 1 ảnh hero đẻ ra cả 3 thứ

**Chuẩn bị artwork (làm 1 lần, đúng cách là sau này nhàn):**
- Xuất hero ở bản **rộng/lớn**, nhân vật **không chạm sát mép** (chừa lề để camera đẩy).
- Tách sẵn **3–4 lớp** trên file gốc: `nhân vật` · `blade` · `violet halo (lớp riêng)` · `void + grain`. Giữ mép nhân vật sắc.
- Vì nền là void: gần như không cần vá lỗ. Nếu có, chỉ cần kéo giãn rìa void ra sau subject một chút.

**→ A. Clip fanpage (3–8s):** CapCut → 3D Zoom (hoặc keyframe zoom) → canvas 9:16 → đẩy **chậm** vào mặt nạ, halo violet dịch nhẹ trễ hơn subject → xuất 1080×1920. Dùng cho post countdown / next transmission / keyart động.

**→ B. Spotify Canvas:** cùng cái clip, làm **loop kín**: motion đối xứng 100→104→100% (về đúng frame đầu) **hoặc** rebound (chạy xuôi rồi ngược). Xuất MP4 H.264, **~7.9s** (tránh đúng 8.000s gây lỗi upload), <20MB, **không tiếng**. Giữ nội dung chính xa mép (vài máy crop rìa).

**→ C. Web hero (universe page):** cách dễ nhất = **dùng chính clip loop làm video nền hero** (muted + autoplay + loop), nén **<5MB**, có **ảnh tĩnh fallback cho mobile**. Muốn parallax thật phản ứng scroll/chuột mà không code → **Framer** (dễ nhất) hoặc **Webflow**. Parallax theo chuột bằng depth-map = mức code (tao viết được snippet nếu cần).

---

## 5. LUẬT GIỮ "PREMIUM", KHÔNG BỊ QUÊ

- **Move nhỏ + chậm.** Lớp gần đi nhiều hơn lớp xa, nhưng chênh tốc ~0.2–0.5; **>0.7 là bắt đầu rung/say**. "Parallax đẹp là khi xem thấy mượt mà không chỉ ra được tại sao."
- **Neo điểm chạm.** Chỗ nhân vật chạm "đất" phải cùng độ sâu, kẻo nó "trôi/lửng lơ".
- **Đừng nướng glow/halo vào mép subject** ở lớp depth — tách halo ra lớp riêng, cho dịch nhẹ. (Khớp đúng canon "violet là tín hiệu, lớp riêng".)
- **Chữ/nét mảnh** dễ smear khi 3D — để chữ ở lớp phẳng 2D phía trên, đừng đẩy sâu.
- **Thiết kế theo lớp NGAY TỪ ĐẦU** > cắt từ ảnh phẳng sau. Từ nay vẽ/dựng hero là tách lớp luôn.
- **Move ít chỗ cho hoàn hảo** > animate mọi thứ. Chọn 2–3 thứ (subject + halo + 1 hạt grain) là đủ sang.

---

## 6. SPOTIFY CANVAS — SPEC CHÍNH XÁC (xác nhận từ trang Spotify)

- Dọc **9:16**, **720–1080px chiều cao**, khuyến nghị **1080×1920**.
- Dài **3–8s** (né đúng 8.000s → để ~7.9s). **MP4/H.264**, **<20MB**, **24–30fps** (mày khoá 30), **không tiếng**.
- Loop: Continuous (frame đầu = cuối) / Rebound (xuôi-ngược) / Hard cut khéo. Tránh cắt nhanh/nhấp nháy; **subtle thắng aggressive** — trùng đúng gu brand.
- Spec trong CLAUDE.md của mày (1080×1920·H.264·yuv420p·30fps·6–8s) **đã hợp lệ**.

---

## 7. TÁC ĐỘNG LÊN VỤ "NGHẼN VÌ BLENDER"

- Phần lớn motion public giờ **không cần Codex/Blender** — chạy bằng 1 ảnh hero + tool depth-warp.
- Blender chỉ còn cần khi muốn **pose/góc/cảnh 3D thật sự mới**. Hiếm, có kế hoạch.
- Nghĩa là: Codex hết token → **mặt public vẫn chạy** (card tĩnh + clip 2.5D từ ảnh sẵn). Đúng cái mày lo, giờ gỡ được.

---

## Nguồn (đã đối chiếu)
- Kỹ thuật & multiplane: en.wikipedia.org/wiki/Multiplane_camera · petapixel.com (Disney multiplane) · motionarray.com (animate flat 2D) · kelp.agency · en.wikipedia.org/wiki/Ken_Burns_effect
- Depth-map / AI parallax: arpatech.com · reelmind.ai · morphic.com
- Anime/look: canmom.art (Shinkai compositing) · adobe Animate layer depth
- Canvas + cách làm loop: support.spotify.com/.../canvas-guidelines · orphiq.com · epitrite.com · calvinwest.com · artist.tools · artists.spotify.com
- Tool (CapCut/Canva/Immersity/AI video): capcut.com/resource/capcut-3d-zoom · hollyland (export specs) · canva.com/features/photo-animation · app.immersity.ai · skywork.ai (Immersity guide) · ulazai.com / soloa.ai / eesel.ai (Runway/Kling/Pika)
- Web hero/parallax không-code: framer.com/blog/parallax · framer.university · help.webflow.com (parallax on scroll) · designtlc.com / thegeckoagency.com (hero video best practice)
- Pitfalls/prep: photoshopcafe.com (FB 3D rules) · learnopengl.com (parallax mapping) · docs.wallpaperengine.io · beverlyboy.com · toolify.ai (Parallax Maker) · domestika.org · pixelfreestudio.com · garagefarm.net

*Research draft — không canon-lock. Số liệu free-tier của Immersity khác nhau giữa nguồn → kiểm tra app.immersity.ai trước khi dựa vào.*
