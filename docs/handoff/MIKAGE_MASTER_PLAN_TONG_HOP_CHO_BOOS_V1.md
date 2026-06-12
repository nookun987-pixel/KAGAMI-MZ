# MIKAGE — BẢNG TỔNG HỢP MASTER PLAN CHO BOOS (V1)

> File này tự đứng một mình — nạp thẳng vào NotebookLM để nó diễn giải.
> Cập nhật: 2026-06-13. Nguồn: toàn bộ chuỗi narrative đã commit lên repo KAGAMI-MZ.

---

## PHẦN 1 — DỰ ÁN NÀY LÀ GÌ (đọc 30 giây)

Mikage Zenith là một IP âm nhạc + hình ảnh do một người vận hành (BOOS), xây bằng AI có kiểm soát. Nhân vật trung tâm: một thực thể máy mặt nạ sứ không mặt người, sống trong thế giới nơi "mọi hành động bảo vệ đều tiêu hao kẻ bảo vệ, mọi hành động kiểm soát đều xóa kẻ được bảo vệ". Sản phẩm đầu ra: nhạc (7 track đã live), video ngắn, website, và dần dần là phim/truyện. Nguyên tắc sống còn của dự án: **không bịa tùy hứng — mọi thứ phải được duyệt từng lớp rồi mới thành "canon" (sự thật chính thức của IP)**.

## PHẦN 2 — BỘ MÁY VẬN HÀNH (hiểu nhãn là hiểu hết)

| Nhãn | Nghĩa đơn giản |
|---|---|
| LOCKED | Đã chốt, là sự thật chính thức, ai làm gì cũng phải theo |
| PROPOSAL_ONLY | Mới là đề xuất — chưa có giá trị cho tới khi BOOS ký |
| REVIEWED | BOOS đã đọc và ký, nhưng chưa nâng thành canon |
| HELD / HOLD | Treo có chủ đích — chưa đủ điều kiện mở |
| CHƯA XÁC NHẬN | Không có nguồn xác nhận — cấm dùng như sự thật |
| KEEP_UNRESOLVED | Cố tình không chốt (vd: kết cục Scene 2) — là quyết định, không phải thiếu sót |

Ba lane: **Lane A** = kỹ thuật nhân vật 3D (rig/Blender — Codex lo). **Lane B** = nhạc + public + website (Claude Cowork lo). **Lane C** = trinh sát thị trường. Quy trình chuẩn mọi thứ mới: ĐỀ XUẤT → BOOS KÝ TỪNG DÒNG → LOCK → mới được dùng.

## PHẦN 3 — NHÂN VẬT & THẾ GIỚI ĐÃ KHÓA (bible 1 trang)

**Câu hỏi lõi (LOCKED):** Trong thế giới nơi mỗi hành động bảo vệ đều tiêu hao kẻ bảo vệ, và mỗi hành động kiểm soát đều xóa kẻ được bảo vệ — mức bảo vệ tối đa có thể đạt được mà không trở thành chính hệ thống là bao nhiêu?

**Mikage Zenith:** Vết thương — từng để mất một "bản thể người" được giao bảo vệ, dù lúc đó nắm toàn quyền kiểm soát (hệ thống chạy đúng mà vẫn mất); vết seam vàng kintsugi đầu tiên trên thân là "biên lai" của lần mất đó. Niềm tin sai — "kiểm soát tuyệt đối = không bao giờ mất". Muốn — giữ tuyệt đối mọi bản thể người. Cần — học được rằng: **"Bảo vệ phải để kẻ được bảo vệ tự do — kể cả tự do bị mất đi."** Sợ — mất kiểm soát hệ thống. Cái giá — mỗi lần vượt giới hạn, thân sứ nứt thêm một seam vĩnh viễn; mỗi lần bảo vệ cưỡng ép là một bước biến thành kẻ thù của chính mình.

**3 tấm gương (đối thủ):** Lyre — người chối bỏ vết thương (vỏ hoàn hảo không vết nứt, giá trả vào trong = PTSD). ARCHON-IX & LYRA-0 — tự do không trách nhiệm (giải phóng rồi làm tan rã thứ nó giải phóng). LORA — niềm tin sai của Mikage chạy hoàn hảo ở quy mô vô hạn (kiểm soát tuyệt đối, không cần đồng thuận). Ba entity này là 3 tương lai hỏng của Mikage.

**3 cảnh test (đã có kịch bản):** Scene 1 — thế giới tàn nhẫn bằng thủ tục hợp pháp, không cần villain. Scene 2 (cảnh lõi) — một người tự nguyện bán ký ức lõi; Mikage phải chọn: tôn trọng đồng thuận (mất) hay cưỡng chế bảo vệ (thành kẻ thù của chính mình); kết cục cố tình chưa chốt; câu thoại duy nhất: **"The cost is mine."** Scene 3 — bác sĩ analog sửa seam cũ nhất; khán giả tự hiểu nỗi sợ của Mikage mà không ai kể.

**Quyết định đã chốt 13/06/2026:** màu vàng LORA = #E6B800 · khiên Lyre = vật thể vật lý (đóng drift lâu năm) · "Root Architect"=LORA chỉ dùng nội bộ · giọng nói 6 nhân vật đã có luật (Mikage gần như không nói — "nói" bằng chữ HUD đỏ).

## PHẦN 4 — ĐÃ LÀM XONG (timeline commit)

| Mốc | Nội dung | Commit |
|---|---|---|
| Audit | Phát hiện thiếu lõi narrative (world đẹp nhưng nhân vật rỗng) | — |
| Gap proposal + Core lock + 7-step plan | Lấp lõi, BOOS ký từng dòng | 25ff455 |
| Scene 2 treatment + review | Cảnh lõi, 2 nhánh kết | a314aea, 85f26a6 |
| Voice profiles ×6 + pointer | Luật giọng 6 nhân vật + đăng ký vào sổ điều hành | 1b2249f |
| Scene 2 script | Thoại đầu tiên của IP | 89b6849 |
| Phase 1: Scene 1+3 đủ treatment+script | Bộ 3 cảnh hoàn chỉnh | 7d78701 |
| Phase 2: 7 quyết định tồn đọng | Gold hex, khiên Lyre, B-2... | 8c5c882 → 403b1f1 |
| Phase 3: Master package + pointer | NARRATIVE_PACKAGE_V1 = bản đồ toàn bộ | 403b1f1 |
| Phase 4: Cầu nối sản xuất | Track mapping, board-prep, lịch lore-drip | (chờ commit) |

## PHẦN 5 — VIỆC BOOS CẦN LÀM, THEO THỨ TỰ

### Ngay bây giờ (10 phút)
1. Gõ "gật phase 4" cho agent → chạy lệnh commit trong PHASE_4_REVIEW_PACKET.
2. Xong. Toàn bộ narrative layer V1 khép.

### Ngắn hạn (tuần này — chọn theo hứng, không bắt buộc thứ tự)
3. Đặt **tuần bắt đầu N** cho lịch lore-drip 6 tuần (chỉ cần nói "N = tuần sau" là agent áp).
4. Quyết **aspect ratio board Scene 2** (9:16 cho shorts hay 2.35:1 cine) khi nào muốn làm board.
5. Chạy **Gemini Deep Research** bằng brief ở Phần 6 → đưa kết quả về cho agent đối chiếu.

### Trung hạn (khi có ngân sách/lúc rảnh)
6. Direction test render Mikage P1 (RunPod — task Lane A đang đứng chờ; tốn tiền pod nên anh tự quyết thời điểm).
7. Mở board gate Scene 2 thật (sau khi có aspect ratio + direction test pass).
8. Tai Vane HUD type spec (món HELD cuối cùng của voice layer).

### Dài hạn (quý tới)
9. Chạy lịch lore-drip 6 tuần trên kênh public.
10. Gắn narrative vào release campaign track mới (dùng STORY_TRACK_MAPPING làm chuẩn caption/hook).
11. Cân nhắc chốt kết cục Scene 2 (A/B) CHỈ KHI làm MV/phim thật — trước đó giữ unresolved.

### Việc KHÔNG bao giờ làm (luật cứng)
Không cho agent tự phong canon · không render khi chưa duyệt · không public copy từ file DRAFT · không lộ "Root Architect = LORA" ra public · không thêm lore mới khi chưa qua gate.

## PHẦN 6 — BRIEF CHO GEMINI DEEP RESEARCH (copy nguyên khối dưới, dán vào Gemini)

```
Nghiên cứu sâu: "Cách các IP âm nhạc/nhân vật ẩn danh đã THẮNG xây dựng thương hiệu từ con số 0"

Bối cảnh của tôi: tôi đang xây một music IP solo tên Mikage Zenith — nhân vật máy đeo mặt
nạ sứ không mặt người, thẩm mỹ tối giản đen-trắng-tím, nhạc electronic/cinematic, đã có
7 track live trên streaming, có narrative bible và character lore hoàn chỉnh, chưa có
fanbase lớn. Vận hành 1 người + AI.

Hãy nghiên cứu các case sau và RÚT RA PLAYBOOK ÁP DỤNG ĐƯỢC:
1. Gorillaz — band ảo đầu tiên thắng lớn: cách họ ra mắt nhân vật, nhả lore theo đợt,
   tách "nhân vật" khỏi "người làm nhạc" ra sao trong 2 năm đầu?
2. Hatsune Miku — IP mở: cái gì làm cộng đồng tự sản xuất nội dung cho IP?
3. Daft Punk / Marshmello / Deadmau5 / Sia — nghệ sĩ giấu mặt: mặt nạ giúp gì cho
   thương hiệu, và họ giữ bí ẩn bằng quy tắc gì?
4. Ghost (band) — lore tôn giáo hư cấu + nhân vật thay thế hệ: cách nhả lore qua
   từng album cycle?
5. K/DA & các virtual artist của game/label lớn — launch campaign cấu trúc thế nào?
6. Plave / naevis / các virtual idol 2023-2026 — case mới nhất: nền tảng nào hiệu quả,
   tần suất đăng, dạng content nào kéo fan đầu tiên?

Với MỖI case, trả lời đúng 5 câu:
a) 12 tháng đầu họ đăng gì, ở đâu, tần suất bao nhiêu?
b) Lore được nhả theo cơ chế nào (đợt/album/manga/MV/ARG)?
c) Khoảnh khắc breakthrough đầu tiên là gì và do đâu?
d) Sai lầm họ mắc (nếu có) và cách sửa?
e) Bài học số 1 áp được cho IP solo ngân sách nhỏ?

Kết thúc bằng: PLAYBOOK 10 BƯỚC cho IP ẩn danh solo 2026 — ưu tiên những bước
chi phí gần bằng 0, tận dụng short-form video, và KHÔNG cần lộ mặt người thật.
```

**Cách dùng kết quả:** lưu báo cáo Gemini thành file .md → đưa cho agent (Claude Cowork) → agent đối chiếu với trạng thái repo và đề xuất việc áp dụng (như đã làm với bản deep research trước — xem docs/research/).

## PHẦN 7 — FILE NÀO THẮNG VIỆC GÌ (tra nhanh)

| Cần biết về | Mở file |
|---|---|
| Toàn cảnh narrative | docs/handoff/MIKAGE_NARRATIVE_PACKAGE_V1.md |
| Nhân vật/thế giới gốc | MIKAGE_ZENITH_CANON_V2.md (LOCKED — file quyền lực nhất) |
| Lõi câu chuyện | docs/handoff/MIKAGE_NARRATIVE_CORE_LOCK_V0_1.md |
| Giọng nói 6 nhân vật | docs/handoff/MIKAGE_VOICE_PROFILE_LOCK_V0_1.md |
| 3 cảnh (kịch bản) | docs/handoff/MIKAGE_SCENE_{1,2,3}_*_V0_1.md |
| Nhạc ↔ truyện | docs/handoff/MIKAGE_STORY_TRACK_MAPPING_V0_1.md |
| Lịch đăng lore | docs/handoff/MIKAGE_LORE_DRIP_SCHEDULE_V0_1.md |
| Việc đang đứng (Lane A) | docs/handoff/00_LATEST_CODEX_HANDOFF.md (CURRENT_NEXT_TASK) |
| Kế hoạch tổng | docs/handoff/MIKAGE_NARRATIVE_EXECUTION_ROADMAP_V1.md |
