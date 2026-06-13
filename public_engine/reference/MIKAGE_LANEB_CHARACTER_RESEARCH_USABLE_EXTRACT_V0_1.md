# MIKAGE — LANE B USABLE EXTRACT từ tài liệu "Phát triển nhân vật, phác thảo, render"

> LANE: B (Public Engine) · STATUS: REFERENCE ONLY · DATE: 2026-06-13
> Nguồn: file upload `Phát triển nhân vật, phác thảo, render.md` (báo cáo nghiên cứu ngành, nội dung gốc thuộc Lane A).
> Mục đích: lọc ra phần CÓ THỂ dùng cho Lane B (brief ảnh bìa, mood board, ngôn ngữ mô tả ánh sáng/vật liệu cho caption & website). KHÔNG dùng để rig / blender / render / sculpt.

## Ranh giới (đọc trước)
- File này KHÔNG approve canon, KHÔNG asset-lock, KHÔNG claim production-ready/final/PASS.
- Toàn bộ kỹ thuật sản xuất 3D (ZBrush, retopo, UV, rig FK/IK, weight paint, Arnold/Cycles/UE5) = Lane A, chỉ liệt kê làm tham chiếu, Lane B KHÔNG thực thi.
- Brand canon thắng mọi xung đột: helmet sứ không mặt, đúng 2 khe sensor, violet `#8F00FF` là SIGNAL (halo/điểm focus) — không phải fill/wash. CTA: `Listen now` (LIVE) hoặc `Pre-save` (chưa phát hành), không trộn.

## 1. Silhouette / Thumbnail → dùng cho brief ảnh bìa & short hook
Nguyên lý "đọc được nhân vật chỉ qua hình bóng đen" áp thẳng vào việc brief bố cục ảnh bìa và frame mở của short:
- Ưu tiên 1 silhouette mạnh, tỷ lệ đặc trưng, đọc được ở thumbnail nhỏ (feed Spotify/TikTok bị thu rất nhỏ).
- Tương phản sáng-tối thô trước, chi tiết sau — hợp với nền void black `#050508` + 1 vệt violet làm điểm dẫn mắt.
- Checklist brief: chủ thể chiếm bao nhiêu khung, hướng nhìn/hướng nghiêng, khoảng trống âm (negative space) để chừa chỗ đặt tên track/wordmark.

## 2. Line of action / Gesture → cảm giác chuyển động cho short
- "Đường chuyển động chủ đạo" + nét dài liền mạch = ngôn ngữ để mô tả nhịp cho frame động: chậm, breathing, không giật.
- Khớp với spec Canvas đã có (breathing zoom 100→104→100%, cosine pulse) — đây là phần mô tả/brief, KHÔNG phải lệnh render.

## 3. Ánh sáng → từ vựng mô tả hero cover trong brief gửi image-gen
Phần hữu ích nhất cho Lane B. Dùng làm vocabulary khi viết brief ảnh public (không phải để Lane B tự render):
- **Nguồn nhỏ = bóng sắc cạnh; nguồn lớn = bóng mềm.** → muốn khối mặt nạ sứ rõ cạnh thì brief "small hard source"; muốn dịu thì "large soft source".
- **Narrow lighting** (sáng từ phía mặt quay khỏi camera) tả khối/góc cạnh tốt hơn, cho chiều sâu điện ảnh → hợp tinh thần "calm, minimal, mysterious".
- **Broad lighting** làm phẳng, nhẹ — thường tránh cho hero shot.
- **Inverse-square falloff**: ánh sáng tắt dần theo khoảng cách để cảnh không bị "dẹt" — brief nên nói rõ "let background fall to black".

## 4. PBR vocabulary → mô tả vật liệu nhất quán trong caption/website
Dùng các thuật ngữ chuẩn để mô tả vật liệu Mikage thống nhất (text public, không phải texture map thật):
- **Albedo/Base color** = màu gốc (porcelain `#f2eeea`), tách khỏi ánh sáng.
- **Roughness** = độ nhám: "matte aged urushi" (gold seams) vs "smooth porcelain".
- **Metallic**: dùng cho mô tả lớp graphene underlayer / seams, không biến violet thành kim loại bóng tràn.
- **Normal/microdetail**: "fine grain", "hairline" — khớp ngôn ngữ brand (hairlines, fine grain).

## 5. Mood board / reference tooling (Lane B workflow)
- PureRef (kéo-thả, always-on-top, giữ ảnh ~72 DPI tránh lag) hoặc Milanote/Miro để dựng bảng reference public trước khi brief.
- Đây là gợi ý công cụ tổ chức reference cho Lane B, không phải bước sản xuất.

## 6. KHÔNG dùng cho Lane B (đánh dấu rõ Lane A)
- Sculpt/retopo/UV/rig/skinning/weight paint → Lane A.
- So sánh render engine (Arnold/Cycles/UE5/Marmoset) → tham chiếu, Lane B không chạy render.
- Phần đào tạo/cộng đồng VN → không liên quan task hiện tại.

## NEXT (Lane B, an toàn)
- Khi cần brief ảnh bìa/hero cho track public, dùng mục 1–4 làm checklist ngôn ngữ.
- Không mở task render/short/shotlist mới nếu chưa có gate cho phép.
