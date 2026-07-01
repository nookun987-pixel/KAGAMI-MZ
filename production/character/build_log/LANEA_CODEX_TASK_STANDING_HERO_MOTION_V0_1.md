# LANE A / CODEX TASK BRIEF — MIKAGE STANDING HERO MOTION V0.1 (SPOTIFY CANVAS)
Soạn: Lane B (Cowork) · 2026-07-02 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception #32.
Governed by AGENTS.md "Thirty-second controlled exception" (MIKAGE_STANDING_HERO_MOTION_V0_1).

> Standing hero V0.14 đã ASSET-LOCKED (commit 64cd46f). Task này = **awakening / motion pass**: biến hero khóa
> thành 1 clip Spotify Canvas dọc. **HÌNH KHÓA CỨNG.** Chỉ camera + đèn + nhịp violet (pulse). Motion là 1 derivative MỚI —
> KHÔNG sửa asset khóa (blend/PNG V0.14 giữ nguyên byte). CANDIDATE. Xong DỪNG.

## SOURCE OF TRUTH
- Master: production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png (sha256 b86f68…06429).
- Locked hero: production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_14.blend (sha256 c0d8a9…239a).
- Lock record: production/character/reviews/MIKAGE_STANDING_HERO_POLISH_V0_14_ASSET_LOCK.md.
- Violet LOCK: #8F00FF, chỉ ở 2 khe.

## INPUT (base — CHỈ cái này)
- production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_14.blend
  Báo BASE_SELECTED + BODY_HASH_BEFORE + BODY_HASH_AFTER (phải KHÔNG đổi). KHÔNG overwrite base khóa.
- CẤM: bản khác / RIDER / HERO-MOUNT / STEED; không import scene.

## CANVAS SPEC (baseline kỹ thuật — bắt buộc)
- **1080 × 1920 · H.264 / yuv420p · 30 fps · KHÔNG audio · ~6–8 giây.**
- Motion: **breathing zoom 100 → 104 → 100 %**, cosine/smoothstep pulse (không giật, không linear).
- Loop mượt: frame đầu ≈ frame cuối (Canvas lặp vô hạn).

## LOCKED (KHÔNG đổi)
- TOÀN BỘ mesh geometry — BODY_HASH / mesh-state hash unchanged vs V0.14.
- **Transform mọi object KHÔNG đổi** — không dời/xoay/scale mesh nào, KỂ CẢ BLADE.
- Material: **HUE + cấu trúc mọi material giữ nguyên** (helmet · thân · blade · halo · 2 khe). Khe giữ hue #8F00FF.
- Asset khóa V0.14 (blend + HERO.png) KHÔNG bị chỉnh — motion blend là file MỚI, tách riêng.

## ĐƯỢC LÀM (camera + đèn + pulse ONLY)
1. **Camera breathing zoom** 100→104→100 % (cosine), reframe về khung dọc 9:16 (1080×1920) — chỉ góc + khoảng cách + zoom, KHÔNG dời mesh. Full-body vẫn trong khung.
2. **Violet slit pulse (awakening):** animate **CHỈ emission STRENGTH của 2 khe** theo nhịp dormant → awakened → dormant (mờ → bừng violet → mờ). **Hue khóa #8F00FF** (không đổi màu, chỉ độ sáng). Đây là SIGNAL trung tâm của clip.
3. (Tùy chọn, tiết chế) **halo resonance** cực nhẹ + **key light** trôi chậm lạnh + **blade cold rim** lung linh rất nhẹ — tất cả trong palette, lạnh, không thành đèn nhấp nháy.
4. Fine grain giữ. Void black `#050508`. Single-key mood.

## HARD BANS (Canvas — vi phạm = FAIL)
- KHÔNG text / lyrics / logo / watermark / chữ cháy khung.
- KHÔNG mặt người / da (helmet faceless porcelain = OK, KHÔNG phải mặt người).
- KHÔNG màu ấm. KHÔNG anime. KHÔNG UI/HUD giả.
- Violet chỉ 2 khe; KHÔNG violet lên blade/thân/nền; KHÔNG neon fill / full-screen wash.
- KHÔNG slow-mo lạm dụng ngoài breathing pulse; motion tối giản, chậm.

## SUCCESS TEST
- Clip 1080×1920 30fps ~6–8s, yuv420p H.264, no audio, loop mượt.
- Breathing zoom đọc rõ nhưng tinh; khe violet pulse dormant→awakened→dormant, hue giữ #8F00FF.
- Hình/transform/material-hue KHÔNG drift vs V0.14 (hash). Void single-key giữ. Không phạm ban nào.

## VERIFY (bắt buộc)
- Reopen motion blend sạch; BODY_HASH + transform hash unchanged vs V0.14; material hue unchanged (chỉ slit-strength có keyframe).
- ffprobe clip: xác nhận 1080x1920, 30fps, yuv420p, no audio stream, duration 6–8s.
- Pixel-sample khe ở frame awakened: violet gần #8F00FF, không magenta (SLIT_HUE_PIXEL_SAMPLE).
- Keyframes strip (dormant / mid / awakened) cho người soi.

## OUTPUT (candidate)
- production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_MOTION_V0_1.blend (motion blend, KHÔNG overwrite V0.14)
- production/character/reviews/MIKAGE_STANDING_HERO_MOTION_V0_1.mp4
- production/character/reviews/MIKAGE_STANDING_HERO_MOTION_V0_1_KEYFRAMES.png (dormant · mid · awakened)
- production/character/reviews/MIKAGE_STANDING_HERO_MOTION_V0_1_PROOF.md + RESULT block (kèm SLIT_HUE_PIXEL_SAMPLE + ffprobe)
- Gate CONTACT_SHEET_ONLY: _tmp/mikage_standing_hero_motion_v0_1_gate/ CHỈ chứa contact_sheet.png (= keyframes strip) + contact_sheet_review_report.md. (mp4 KHÔNG được nằm trong gate folder — verify_output cấm.)

## FAIL
- Đổi geometry/transform/material-hue (hash drift) → PASS_FAIL=FAIL, BLOCKER=MOTION_DRIFT; revert (base V0.14 giữ nguyên).
- Khe đổi màu (không phải chỉ strength) hoặc ngả magenta → BLOCKER=SLIT_HUE_FAIL.
- Sai spec Canvas (không 1080×1920 / có audio / sai fps/codec) → BLOCKER=CANVAS_SPEC_FAIL.
- Phạm hard ban (text/warm/violet tràn...) → BLOCKER=CANVAS_BAN_VIOLATION.

→ Stop sau proof. Lane B drift-check (spec đúng? khe pulse đúng hue? không drift? không phạm ban?) → BOOS ruling.
  PASS + approve → clip Canvas cho track + xài lại làm money-shot động trong video build-log.
