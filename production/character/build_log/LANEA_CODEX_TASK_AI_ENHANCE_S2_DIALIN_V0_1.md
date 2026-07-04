# LANE A CODEX TASK — AI-ENHANCE DIAL-IN (S2/HERO FRAME)

TASK_ID: `MIKAGE_AI_ENHANCE_S2_DIALIN_V0_1`
GOVERNANCE: `AGENTS.md` — Forty-ninth controlled exception.
LANE: A (render pipeline). TOOL: ComfyUI (local), Flux.1-dev img2img + 2×ControlNet + Redux.
SCOPE: Bước 1 CHỈ — dial-in trên đúng 1 frame (S2 still). KHÔNG áp dụng cho S0/S1/hero clip ở task này.
Bước 2 (áp dụng setting đã chốt cho S0/S1 + xử lý flicker cho clip) là một exception RIÊNG, sau khi
operator duyệt bản dial-in này.

## SOURCE OF TRUTH

- Brief gốc (operator, giữ nguyên tinh thần): `production/character/build_log/MZ-BRIEF-AI-ENHANCE_REFERENCE_V0_1.html`.
- Base image (bắt buộc, không đổi): `production/character/reviews/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1_S2_STILL.png`
  (full-res 1440×2560, kết quả PASS của exception #48, đã verify độc lập).
- Depth AOV: xuất trực tiếp từ `production/character/production_actor/rig_derivatives/MIKAGE_ROBE_HERO_CINE_STAGING_V0_1.blend`
  tại đúng frame/camera đã dùng để render S2 still (Z hoặc Mist AOV) — KHÔNG dùng depth-estimate từ ảnh.
- Canny/Line: xuất từ chính S2 still ở trên (không phải từ ảnh AI đã sinh) — phải giữ đúng 2 khe + vòng
  halo + viền cloak/silhouette hiện có.
- Redux reference (khoá nhận diện): `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png`.
- Đọc trước: `AGENTS.md` (toàn bộ 5 Immutable Identity Marks + rule halo trắng tuyệt đối), `docs/handoff/00_LATEST_CODEX_HANDOFF.md`.

## VIỆC CẦN LÀM (DO)

1. Dựng node stack ComfyUI đúng như brief: BASE Flux.1-dev (img2img) + CTRL1 Depth (giữ khối/pose) +
   CTRL2 Canny/Line (giữ khe+halo+viền) + REDUX (canon ref sheet, giữ porcelain/violet) → Sampler → VAE.
2. Chạy nhiều seed × 3 mức denoise: `0.45` / `0.55` / `0.65`. Cố định seed khi so sánh giữa các mức
   denoise (đổi 1 biến tại 1 thời điểm).
3. ControlNet strength: Canny `0.8–1.0` (ưu tiên cao nhất — giữ khe+halo), Depth `0.5–0.7`, Redux weight
   `0.4–0.6`, Flux guidance `~3.5`, steps `24–30`.
4. Prompt dùng đúng bản trong brief gốc (positive + negative, copy-ready, không tự viết lại).
5. Với mỗi ứng viên, tự chấm theo CANON GATE (mục dưới) trước khi đưa vào contact sheet — loại ngay
   ứng viên nào fail bất kỳ mục nào, không đưa vào để "operator tự chọn".
6. Chọn 1 ứng viên tốt nhất qua được canon gate VÀ "cine nhất" (chất liệu sứ thật hơn, khí quyển rõ hơn,
   vẫn đúng canon) — đây là bản đề xuất, KHÔNG tự ý gọi là final/production-ready.
7. Ghi lại chính xác workflow đã dùng: seed, denoise, ControlNet strengths, guidance, steps — để lần sau
   lặp lại được hoặc áp dụng cho S0/S1 (bước sau, không phải task này).

## HARD CANON (không thương lượng)

- Faceless — không được mọc mặt/mắt/mũi/miệng lên helmet dưới bất kỳ hình thức nào AI có thể "vẽ đè" ra.
- Đúng 2 khe, đúng vị trí/hình dạng như base image — không đổi số lượng, không đổi hình.
- Halo giữ trắng/neutral tuyệt đối — không được ám tím hoặc đổi màu.
- Violet CHỈ ở 2 khe — không leak ra cloak/nền/sàn/halo.
- Silhouette giữ nguyên draped robe — không lộ tay/chân, không thêm giáp, không đổi hình khối cloak.
- Không anime/cel-shading — hướng cinematic realism đúng như positive prompt.
- Không tự đổi geometry/rig — đây là ảnh 2D enhance, không chạm .blend gốc.
- Không batch xử lý cho clip (sẽ flicker) — CHỈ 1 still, task này không đụng tới video.

## GATE

Gate folder `_tmp/mikage_ai_enhance_s2_dialin_v0_1_gate/` CHỈ được chứa đúng 2 file:
- `contact_sheet.png` — lưới so sánh: base S2 still (không AI) + ít nhất 3 ứng viên qua được canon gate
  (một cho mỗi mức denoise 0.45/0.55/0.65 nếu có ứng viên nào ở mức đó pass), mỗi ô ghi rõ seed+denoise.
- `contact_sheet_review_report.md` — PHẢI có các mục sau, với số liệu thật (không mô tả suông):
  - **CANON GATE CHECK** — với MỖI ứng viên trong contact sheet: pass/fail từng dòng của canon gate
    (mặt/mắt, số khe, halo color numeric sample tại ≥4 điểm, violet-leak check, silhouette check).
  - **HALO COLOR CHECK** — sample RGB/hex tại ≥4 điểm trên halo của ứng viên được chọn.
  - **WORKFLOW RECORD** — seed, denoise, ControlNet strengths (canny/depth/redux), guidance, steps của
    ứng viên được chọn (để tái lập hoặc áp dụng cho S0/S1 ở bước sau).
  - **RECOMMENDATION** — 1 ứng viên đề xuất + lý do ngắn gọn tại sao đây là bản tốt nhất qua gate.

## OUTPUT

- `production/character/reviews/MIKAGE_AI_ENHANCE_S2_DIALIN_V0_1_CANDIDATE.png` — ứng viên được đề xuất,
  full-res.
- `production/character/reviews/MIKAGE_AI_ENHANCE_S2_DIALIN_V0_1_PROOF.md` — mirror đầy đủ nội dung report
  ở gate (candidate/canon-gate/halo-check/workflow-record/recommendation), cộng thêm danh sách toàn bộ
  ứng viên đã thử (kể cả bị loại) và lý do loại.
- KHÔNG tạo/sửa file `.blend` nào trong task này.

## PASS CONDITIONS

- Ít nhất 1 ứng viên qua được toàn bộ CANON GATE (không mọc mặt, đúng 2 khe, halo trắng không ám tím,
  violet không leak, silhouette không đổi, không anime).
- Report có đủ 4 mục bắt buộc (CANON GATE CHECK / HALO COLOR CHECK / WORKFLOW RECORD / RECOMMENDATION)
  với số liệu thật.
- Gate đúng 2 file. `python .mikage/tools/verify_output.py` in `PASS`.
- Không đổi geometry/rig/.blend. Không xử lý clip/video.

## FAIL CONDITIONS

- `FACE_GEOMETRY_VIOLATION` — AI vẽ ra mặt/mắt/mũi/miệng ở bất kỳ ứng viên nào được đưa vào contact sheet.
- `SLIT_COUNT_VIOLATION` — số khe hoặc hình dạng khe sai ở ứng viên được chọn.
- `HALO_COLOR_VIOLATION` — halo ám tím hoặc đổi màu ở ứng viên được chọn.
- `VIOLET_LEAK_VIOLATION` — violet lan ra ngoài 2 khe.
- `SILHOUETTE_VIOLATION` — lộ tay/chân, thêm giáp, đổi hình khối cloak.
- `STYLE_VIOLATION` — kết quả ngả anime/cel-shading thay vì cinematic realism.
- `SCOPE_VIOLATION` — đụng vào clip/video hoặc sửa file `.blend`.
- `VALIDATOR_SCHEMA_MISMATCH` — gate sai file hoặc thiếu mục bắt buộc trong report.

## NẾU FAIL

Dừng lại, báo cáo đúng FAIL code + ứng viên nào fail dòng nào. Không tự ý hạ tiêu chuẩn canon gate để
"cho qua". Không tự chuyển sang thử tool/model khác ngoài Flux.1-dev + ControlNet + Redux đã chỉ định
mà không hỏi operator trước.

## SAU KHI PASS

Operator soi canon gate lần cuối trên contact sheet + candidate. Nếu duyệt: Lane B (Cowork) nhận
candidate PNG để hậu kỳ (bloom/crush-black/grain/vignette nếu cần) và ráp vào shotlist THIRD AXIS S2
COMBAT REVEAL. Bước 2 (áp dụng workflow đã chốt cho S0/S1, và giải pháp temporal cho clip) là một
exception riêng sau, không tự động nối tiếp task này.

Không canon-lock. Không asset-lock. Không gọi "final"/"production-ready". Không push.
