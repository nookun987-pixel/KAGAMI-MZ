# MIKAGE — LANE B ROADMAP / PUBLIC TRACKER (living)
Lane B · cập nhật 2026-06-23. SSOT theo dõi: mỗi mốc → SẢN XUẤT xong chưa · QUYẾT public · CAPTION.
Quy tắc (build-log directive): mỗi mốc Mikage = 2 đầu ra → (1) asset sản xuất + (2) build-log công khai. Kể 1 bước tiến/post, không xả nháp. Premium, editorial, không stock-look. Closed-author: KHÔNG lộ master asset (.blend/stem/rig).
Neo plan: `MIKAGE_IP_EXECUTION_PLAN_V0_1.md` (30/60/90).

## CỘT TRẠNG THÁI
- SẢN XUẤT: DONE / WIP / TODO
- PUBLIC: PUBLIC (đăng) · PROCESS (build-log nhẹ) · HOLD (chờ bản đẹp hơn) · FILE (chỉ lưu nội bộ)
- CAPTION: ✓ (đã draft) / – (chưa)

## A. PIPELINE NHÂN VẬT (hero-mount 3D)
| Mốc | Sản xuất | Public | Caption | Ghi chú |
|-----|----------|--------|---------|---------|
| Silhouette clay (V0.10 steed + V0.11 rider + V0.12 blade/head) — 8/8 drift nắn xong | DONE | **PROCESS** | ✓ | Build-log "process" nhẹ được; bản REVEAL đẹp để dành material/motion |
| Material lookdev V0.13 (porcelain/graphite/cold-steel) | DONE (b68d721) | HOLD | – | Bản "đẹp" đầu tiên, palette đúng; cờ vàng anti-toy (bề mặt còn mịn) → xử ở V0.14 |
| Violet pass + anti-toy grain V0.14 | WIP (Codex) | **PUBLIC (reveal still)** | ✓ draft | Slit/core bật violet = "nó sống"; crop rider close → hero still + caption |
| Motion V0.15 (breathing + light-sweep + violet pulse) | **DONE (Codex 24/06)** | **PROCESS (chờ chốt đăng)** | ✓ | Verify ĐẠT: 1080×1920 h264/yuv420p 30fps 6s no-audio, no-text, palette đúng, motion ổn (look stylized chấp nhận). Lane B ghép nhạc → `build_log/HERO_REVEAL_MOTION_V0_1/MIKAGE_HERO_REVEAL_MOTION_PORCELAIN_V0_1.mp4` + caption A/B |
| Ghép scene + world monolith | TODO | HOLD | – | Sau khi hero xong |
| **Trang public Character + World (candidate V0.1)** | **DONE (24/06)** | **PROCESS (chờ BOOS duyệt)** | ✓ draft | HTML branded self-contained: hero helmet-trần (foundation V0.4) + world monolith V0.1, copy minimal-mysterious, palette lock. File: `public_engine/character_world_page_candidate/MIKAGE_CHARACTER_WORLD_CANDIDATE_V0_1.html` (+ bản dọc `..._VERTICAL_CANDIDATE_V0_1.html`). NOT public/NOT canon-lock; chờ operator sign-off public-reveal gate |
| **Post package ENTITY+WORLD V0.1 (BOOS duyệt look 24/06)** | **DONE (24/06)** | **PROCESS (chờ chốt đăng)** | ✓ | Gói post: MP4 reveal dọc 1080×1920/30fps/h264/yuv420p/5.5s/no-audio (PIL+ffmpeg, no Blender) + 2 still (entity, world) + caption A/B. Folder: `public_engine/character_world_page_candidate/post_package/`. No chữ trên hình, no master leak |
| **Build-log gather/film + nhạc (24/06)** | **DONE (24/06)** | **PROCESS (chờ chốt đăng)** | ✓ | 2 bản trong `build_log/GATHER_REEL_V0_1/`: (a) `..._GATHER_PORCELAIN_V0_1.mp4` 29s tight cho Shorts/TikTok; (b) `..._FILM_FULL_V0_3.mp4` ~101s gom HẾT (4 clip + **6 episode** + **motion V0.15 làm cao trào kết**) cho YouTube/FB. Nhạc PORCELAIN ASCENSION (WAV gốc→AAC 1 lần), caption A/B/C |
| **EPISODE_05 "SKIN & SIGNAL" (tạo mới 24/06)** | **DONE (24/06)** | **PROCESS** | ✓ | Mắt xích còn thiếu EP04(clay)→EP06(nhạc): clay có material V0.13 + violet slit V0.14. 8 slide đúng template + font brand, dùng review V0.13/V0.14 thật. Script `EPISODE_05/build_ep05.py`. Honest: ghi rõ anti-toy còn WIP, candidate |
| **Drift-check V0.14 (Codex render 24/06)** | n/a | FILE | – | Violet ĐẠT (slit/core/1 seam, tiết chế, hoof hạ cold steel) ✅; anti-toy CHƯA đạt (porcelain còn đọc nhựa/clay sáng — albedo cao + light phẳng) ⚠; geometry giữ nguyên. → CHƯA crop reveal; cần micro-pass material trước |
| **Drift-check V0.14B anti-toy (Codex 24/06)** | n/a | FILE | – | Đèn/AO/contact-shadow khá hơn ✅, violet+geometry giữ ✅; nhưng VẪN model-kit — gốc giờ là HÌNH KHỐI BLOCKOUT, không phải material → CHẠM TRẦN material. Quyết (operator): (1) chấp nhận look dev + đi MOTION V0.15, hoặc (2) dispatch GEOMETRY REFINEMENT trước reveal. Note: `reviews/..._V0_14B_LANEB_DRIFTCHECK.md` |

## B. NHẠC / CATALOG (SSOT = MIKAGE_CATALOG_SSOT_RECONCILED_2026-06-23.csv)
| Mốc | Sản xuất | Public | Caption | Ghi chú |
|-----|----------|--------|---------|---------|
| 20 track LIVE (≤23/06) | DONE | **PUBLIC** | – | Nhãn "Listen now:" — cần web card + post cho track chưa có |
| 23 track PRE-SAVE | DONE (lịch) | **PUBLIC** | – | Nhãn "Pre-save:" theo ngày; #34 COMES BACK COLD live hôm nay |
| 5 track thiếu link | WIP | HOLD | – | `Link: CHƯA XÁC NHẬN` đến khi có smartlink |

## C. PLAN 30/60/90 (từ execution plan)
| Mốc | Trạng thái | Ghi chú |
|-----|-----------|---------|
| 30d: reconcile catalog SSOT | **DONE** | 43/20live/23pre, tool-verified |
| 30d: build-log EP01–06 → chuỗi nội dung khán giả | TODO | Có sẵn 6 EP, cần đóng gói lại theo audience |
| 30d: mỗi release nối nhạc+visual+1 mảnh lore | TODO | Cần template post |
| 60d: format short thống nhất + đo retention/save/profile-visit | TODO | Sau khi có motion V0.15 |
| 90d: Fanwork Guidelines V0.1 (closed-author) | TODO | Chỉ mở khi có nhu cầu fan thật |

## NEXT PUBLIC ACTIONS (Lane B, theo thứ tự)
1. Caption mốc silhouette (draft sẵn — xem CAPTIONS bên dưới). Chờ BOOS duyệt visual mới đăng.
2. Khi V0.13 material ra: chọn 1 still làm REVEAL ảnh tĩnh + caption.
3. Khi V0.15 motion ra: cắt short dọc 1080×1920 làm beat reveal chính + caption.
4. Web card cho 20 track LIVE (nhãn Listen now) + lịch Pre-save 23 track.
5. **Duyệt trang Character+World candidate V0.1** (mở HTML). OK → mở public-reveal gate cho hero helmet-trần + world monolith; chưa OK → ghi sửa.

## CAPTIONS (draft, chưa đăng)
### [SILHOUETTE COMPLETE — process build-log]
> From the void, it learned a shape.
>
> Blueprint → clay → a standing form. The rider, the steed, the blade —
> every line pulled back to one silhouette. No skin yet. Just the shape.
>
> — MIKAGE ZENITH
>
> (Process / dev milestone · stylized · not final)
> #MikageZenith #3DArt #Blender3D #CharacterDesign #BuildLog #DevLog #Porcelain #DarkArt

### [ENTITY + WORLD — page candidate / build-log]
> An entity from the void, awakened by one human hand and many machine minds.
>
> Porcelain over graphene. Two sensor slits. One violet trace — and a single
> signal standing in the dark, with someone small enough to follow it.
>
> — MIKAGE ZENITH
>
> (Reference page · candidate · stylized · not final)
> #MikageZenith #CharacterDesign #WorldBuilding #Porcelain #Violet #DarkArt #BuildLog

### [HERO REVEAL — still, chờ V0.14 violet+grain]
> It learned a shape. Then it lit one signal.
>
> Porcelain. Graphite. Cold steel. Two slits, and a single violet trace —
> the first light from the void.
>
> — MIKAGE ZENITH
>
> (Hero reveal · stylized · not final)
> #MikageZenith #CharacterDesign #3DArt #Blender3D #Porcelain #Violet #DarkArt #BuildLog

### [MOTION REVEAL — chờ V0.15, placeholder]
> _draft khi có clip motion — beat reveal chính._
