# GEMINI DEEP RESEARCH BRIEF — MIKAGE IP PUBLIC MASTERPLAN (Lane A+B)
Soạn bởi Lane B · 2026-06-23 · Mục đích: 1 prompt copy-paste vào Gemini Deep Research.
Output mong muốn: roadmap hành động cho 1 người (solo operator) xây dựng public nhân vật + thế giới IP, mô phỏng cách các IP đã thành công, và cách phối hợp 2 lane A–B.

---

## CÁCH DÙNG
Copy nguyên khối ```PROMPT``` bên dưới dán vào Gemini (chọn Deep Research). Khi xong, đưa report về đây — Lane B sẽ rút thành plan thực thi + cập nhật masterplan repo.

---

```PROMPT
Bạn là chiến lược gia xây dựng IP (character/music/visual franchise) cho studio độc lập. Hãy làm một Deep Research và trả về một KẾ HOẠCH HÀNH ĐỘNG có dẫn nguồn, không lý thuyết suông.

=== BỐI CẢNH DỰ ÁN (có thật) ===
- Studio: Mikage Zenith — studio nhạc + visual-IP độc lập, AI-assisted, do MỘT người vận hành (solo operator vừa là giám đốc, nghệ sĩ, kỹ thuật, marketing).
- Bản sắc thương hiệu "signal": tối, tối giản, lạnh. Màu khoá: void đen #050508, porcelain trắng #f2eeea, electric violet #8F00FF (violet chỉ dùng như tín hiệu/điểm nhấn, không tô nền).
- Nhân vật chính: "Mikage" — vô diện, mũ giáp porcelain, đúng 2 khe cảm biến (không mặt người/mắt). Đang có: hero-mount (kỵ sĩ Mikage cưỡi "cơ giáp mã" — mech-steed), thế giới có "monolith". Roadmap còn 6 nhân vật nữa. Lore đã khoá ~7 thực thể.
- Nhạc: ~16 "transmissions" (single), 13 bài đã phát hành LIVE trên store (Spotify/Audiomack...). Ngôn ngữ thương hiệu: release = "transmission", kho phát hành = "the Launch Arc", CTA = "Listen now" (đã live) / "Pre-save" (chưa live).
- Pipeline sản xuất AI-assisted: viết/điều phối bằng AI agent + dựng 3D bằng Blender/Eevee + code (PIL/ffmpeg) cho video dọc 1080x1920; chưa có team, ngân sách nhỏ, thời gian là tài nguyên khan hiếm nhất.

=== MÔ HÌNH 2 LANE HIỆN TẠI (cần research cách tối ưu) ===
- Lane A = "build/canon": dựng nhân vật, rig, 3D, mesh, motion-test, kiểm soát kỹ thuật + canon nội bộ. Chậm, kỹ, không public.
- Lane B = "public engine": release nhạc, web card, short-video (Reels/TikTok/Shorts), caption/metadata, build-log công khai, trang web/thế giới.
- Vấn đề: 1 người chạy cả 2 lane. Cần biết phối hợp thế nào để vừa giữ chất lượng canon (Lane A) vừa ra public đều đặn (Lane B) mà không kiệt sức.

=== CÂU HỎI NGHIÊN CỨU (trả lời từng mục, có ví dụ + nguồn) ===
1. CASE STUDIES: Phân tích 6–10 IP character/music/visual đã thành công và được khởi tạo bởi solo hoặc team rất nhỏ. Mỗi case: ai làm, bắt đầu thế nào, TRÌNH TỰ public (reveal nhân vật → thế giới → narrative → fandom → monetize), mất bao lâu tới điểm bùng nổ, đòn bẩy chính là gì. Gợi ý đối tượng nghiên cứu (bổ sung thêm nếu có case tốt hơn): Hatsune Miku/Crypton, Gorillaz, Skibidi Toilet (DaFuq!?Boom!), Murder Drones (Liam Vickers/Glitch), Helluva Boss/Hazbin (Vivziepop), Hololive & mô hình VTuber độc lập, Genshin Impact (cách "lore drip"), Arcane/Riot (từ game ra screen), Lackadaisy, các "ARG/mystery brand" như Local58/The Backrooms.
2. LANE COORDINATION: Trong các studio nhỏ, "deep canon/build" và "public-facing" được phối hợp ra sao? Cadence nào? Cái gì PUBLIC ngay vs cái gì GIỮ KÍN để không lộ canon? Cách dùng "build-in-public / build-log / dev-log" làm nội dung mà không phải chờ thành phẩm hoàn chỉnh.
3. SOLO-OPERATOR PLAYBOOK: Quy trình tối thiểu để 1 người duy trì 1 IP sống: IP bible tối thiểu gồm gì, lịch phát hành nhạc + visual hợp lý, chọn nền tảng (YouTube/Shorts/TikTok/Spotify/web) theo thứ tự ưu tiên nào, cách build community từ 0, các bậc monetization (streaming, merch, membership, sync/license, commission). Đâu là việc NÊN tự động hoá/giao AI, đâu là việc người phải giữ.
4. AI-ASSISTED IP — RỦI RO & TÍNH CHÍNH DANH: Khán giả phản ứng thế nào với IP "AI-assisted"? Nên minh bạch tới đâu, framing thế nào (các case đã làm tốt/làm hỏng)? Rủi ro pháp lý/nền tảng cần biết.
5. ROADMAP CHO MIKAGE: Dựa trên trạng thái hiện tại (nhạc đã live, nhân vật 3D đang ở blockout, thế giới monolith ở concept, lore đã khoá), đề xuất roadmap THEO PHA (Phase 0→N) với: mục tiêu từng pha, milestone đo được, thứ tự ưu tiên cho 1 người, và "next 30/60/90 ngày" cụ thể. Nêu rõ điểm "nhân vật chính thức lên màn ảnh" nên ở pha nào và ở dạng gì (still reveal / motion-comic / 3D animation / MV) cho hợp sức solo.

=== ĐỊNH DẠNG OUTPUT ===
- Phần 1: Bảng so sánh case study (IP | quy mô khởi đầu | trình tự public | đòn bẩy chính | thời gian tới bùng nổ | bài học cho solo).
- Phần 2: Mô hình phối hợp Lane A–B đề xuất (sơ đồ cadence tuần/tháng + quy tắc public-vs-hold).
- Phần 3: Solo-operator playbook (checklist + lịch phát hành mẫu).
- Phần 4: Rủi ro AI-IP + cách xử lý.
- Phần 5: Roadmap Mikage theo pha + bảng "next 30/60/90 ngày".
- Mỗi khẳng định quan trọng kèm nguồn (link). Ưu tiên ví dụ thật, số liệu thật. Tránh lời khuyên chung chung kiểu "hãy nhất quán".
```

---

## PLAN 6 BƯỚC (Gemini xác nhận, 2026-06-23) + ghi chú Lane B
1. Case study IP solo/độc lập (Skibidi Toilet, Hazbin Hotel, The Backrooms, Lackadaisy) → trình tự ra mắt, thời gian bùng nổ, đòn bẩy chính.
   **+ Lane B bổ sung:** thêm ≥2 IP DẪN DẮT BẰNG NHẠC (Hatsune Miku/Crypton, Gorillaz, VTuber-nhạc Hololive) vì Mikage gốc-nhạc — làm rõ trình tự nhạc → nhân vật → thế giới → fandom.
2. Mô hình phối hợp Lane A (deep build) ↔ Lane B (public presence) ở studio nhỏ: tần suất xuất hiện + cách vận hành dev-log.
3. Cẩm nang solo operator: IP bible tối giản, lịch tích hợp nhạc + hình ảnh, phân phối nền tảng tối ưu, phương án thương mại hoá.
4. Rủi ro pháp lý/bản quyền + phản ứng cộng đồng với tác phẩm AI-assisted; giải pháp framing minh bạch & hiệu quả.
5. Tác vụ nên tự động hoá bằng AI vs tác vụ cốt lõi solo bắt buộc tự làm (tối ưu thời gian + chất lượng canon).
6. Tổng hợp bối cảnh Mikage → lộ trình theo giai đoạn + cột mốc + hành động cụ thể 30/60/90 ngày.

---

## SAU KHI CÓ REPORT (Lane B sẽ làm)
- Rút report → cập nhật `MIKAGE_IP_TO_SCREEN_MASTERPLAN` (thêm pha public + cadence A–B).
- Map "next 30/60/90" vào việc thực tế Lane B (release schedule, build-log, motion-comic, web/world page).
- Đối chiếu với canon/brand guardrails (violet=signal, helmet 2-slit, không canon-lock vội).
