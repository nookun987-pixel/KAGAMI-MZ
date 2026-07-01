# LANE A / CODEX TASK BRIEF — MIKAGE STANDING HERO MOTION V0.2 (PULSE RE-CURVE)
Soạn: Lane B (Cowork) · 2026-07-02 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception #33.
Governed by AGENTS.md "Thirty-third controlled exception" (MIKAGE_STANDING_HERO_MOTION_V0_2).

> Motion V0.1 = kỹ thuật PASS (spec đúng, không drift, khe violet) nhưng operator ruling = KHÔNG approve:
> tương phản dormant→awakened quá nhẹ, dormant còn sáng, cú "thức" chưa bật — sợ nền tảng nén xong 3 trạng thái càng giống nhau.
> Task này = **tune ĐÚNG đường cong emission 2 khe**. KHÔNG đụng model/camera/spec. CANDIDATE. Xong DỪNG.

## INPUT (base — CHỈ cái này)
- production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_MOTION_V0_1.blend
  Báo BASE_SELECTED + BODY_HASH_BEFORE/AFTER (KHÔNG đổi). KHÔNG overwrite base.
- Lý do base = V0.1 (không phải V0.14): giữ nguyên camera framing + breathing zoom + spec của V0.1, chỉ vẽ lại đường cong pulse.

## LOCKED (KHÔNG đổi)
- TOÀN BỘ geometry — BODY_HASH unchanged vs V0.1/V0.14.
- Transform mọi object KHÔNG đổi (kể cả blade).
- Material HUE + cấu trúc KHÔNG đổi — khe giữ #8F00FF. Halo, thân, blade material giữ.
- **Camera framing + breathing zoom + thời lượng + codec + fps giữ Y HỆT V0.1** (1080×1920 · H.264 yuv420p · 30fps · no audio · ~6.03s).
- Peak violet awakened giữ mức HIỆN TẠI. **KHÔNG tăng bloom.**
- Asset khóa V0.14 KHÔNG đụng.

## ĐƯỢC LÀM (CHỈ đường cong emission STRENGTH của 2 khe)
Vẽ lại nhịp pulse (chỉ độ sáng khe, hue #8F00FF giữ):
- **DORMANT:** gần như tắt — violet rất tối, **~10–15% mức awakened**. Đây là điểm chính: trạng thái ngủ phải đọc ĐÚNG là ngủ.
- **MID:** **~35–45%**.
- **AWAKENED:** **giữ nguyên peak hiện tại** (không tăng).
- **Ignition nhanh hơn:** cú bật dormant→awakened xảy ra gọn ở khoảng **60–75% clip** (~3.6–4.5s), không rải đều cả clip.
- **Loop mượt vẫn phải giữ:** frame đầu ≈ frame cuối. Sau peak, ease nhanh về dormant ở đoạn cuối để loop liền (mostly dormant → ignition spike ~65% → awakened ngắn → decay về dormant).
- Breathing zoom giữ rất nhẹ như V0.1 (không đụng).

## SUCCESS TEST
- Dormant đọc rõ là "tắt/ngủ" (tối hẳn so awakened); cú thức bật rõ **kể cả trên màn hình nhỏ / sau nén social**.
- Awakened có lực hơn mà KHÔNG tăng sáng/bloom — nhờ tương phản, không nhờ hiệu ứng.
- KHÔNG thành neon / pulse kiểu gaming. Hue giữ #8F00FF, không magenta.
- Spec + camera + geometry + transform Y HỆT V0.1 (hash + ffprobe).

## VERIFY (bắt buộc)
- Reopen V0.2 blend sạch; BODY_HASH + transform unchanged vs V0.1; material hue unchanged (chỉ slit-strength keyframe khác).
- ffprobe: 1080x1920, 30fps, yuv420p, no audio, ~6.03s (khớp V0.1).
- **Báo mức emission 3 trạng thái theo % của peak** (dormant/mid/awakened) để xác nhận đúng đường cong (dormant 10–15%, mid 35–45%, awakened 100%).
- Pixel-sample khe frame awakened: violet gần #8F00FF, không magenta.
- Keyframes strip dormant/mid/awakened cho soi tương phản.

## OUTPUT (candidate)
- production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_MOTION_V0_2.blend (KHÔNG overwrite V0.1)
- production/character/reviews/MIKAGE_STANDING_HERO_MOTION_V0_2.mp4
- production/character/reviews/MIKAGE_STANDING_HERO_MOTION_V0_2_KEYFRAMES.png
- production/character/reviews/MIKAGE_STANDING_HERO_MOTION_V0_2_PROOF.md + RESULT (kèm emission %/trạng thái + ffprobe + SLIT_HUE_PIXEL_SAMPLE)
- Gate CONTACT_SHEET_ONLY: _tmp/mikage_standing_hero_motion_v0_2_gate/ CHỈ contact_sheet.png (=keyframes strip) + contact_sheet_review_report.md. KHÔNG mp4 trong gate folder.

## FAIL
- Đổi geometry/transform/material-hue / camera framing / spec (hash/ffprobe drift) → BLOCKER=MOTION_DRIFT.
- Khe đổi màu / magenta → SLIT_HUE_FAIL.
- Tăng bloom hoặc tăng peak để "ăn gian" tương phản → BLOCKER=BLOOM_CHEAT (dùng tương phản, không tăng sáng).

## NẾU V0.2 VẪN CHƯA ĐỦ KHÁC BIỆT (ghi cho vòng sau, KHÔNG làm ở task này)
- Đừng tăng sáng awakened nữa. Thay vào đó (V0.3): dormant TẮT HẲN trong 1–1.5s đầu → ignition rất ngắn → giữ awakened ổn định tới cuối (chấp nhận loop bằng cách reset ở đầu).

→ Stop sau proof. Lane B drift-check (dormant đủ tối? ignition bật? không drift? không bloom-cheat?) → BOOS ruling.
