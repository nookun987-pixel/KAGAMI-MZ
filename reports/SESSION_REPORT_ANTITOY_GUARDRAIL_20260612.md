# SESSION REPORT — ANTI-TOY GUARDRAIL PATCH — 2026-06-12

## CONTEXT
- Operator duyệt: triển khai guardrail anti-toy đã phân tích. EDIT FILE ONLY.
- TUYỆT ĐỐI KHÔNG: render · set operator_approval_token · ComfyUI/Blender · asset-lock ·
  canon-lock · gọi production-ready/PASS · đổi CURRENT_NEXT_TASK · đổi lane.
- Lane = CHARACTER_CAST_LANE (Lane B), giữ nguyên.
- Lý do gốc: 6 tiêu chí pass + prompt cũ chống nun/mannequin nhưng KHÔNG chặn lỗi
  "đồ chơi con nít" (plastic/figurine/CGI sạch) → cần vá negative + positive + thêm
  tiêu chí pass material/scale.

## THAY ĐỔI 1 — NEGATIVE PROMPT (`tools/cast_render_kit/cast_jobs.json`, job `mikage_p1_imperial`)
TRƯỚC (đuôi):
> ... human eyes, skin, anime, readable text, watermark, extra limbs, lowres

SAU (đuôi):
> ... human eyes, skin, anime, readable text, watermark, extra limbs, lowres,
> **toy, plastic, figurine, action figure, vinyl, glossy plastic, smooth clean surface,
> CGI-clean, cartoon, chibi, miniature, model kit**

## THAY ĐỔI 2 — POSITIVE PROMPT (cùng job)
Chèn trước câu kết "Cinematic, anamorphic, hard sci-fi.":
> **Weathered worn metal, scratched edges, grime, brushed anisotropic metal, PBR photoreal,
> monumental towering scale, low camera angle, 85mm, shallow depth of field,
> hard key light, bright rim light.**

Mục tiêu: thêm vi-bề-mặt (chống nhựa nhẵn) + cue kích thước (chống figurine) + lighting
cứng (lộ khối/trọng lượng). Không đổi material spec lõi (black-glass + B4C + blade
titan đen / core crimson #E60000 GIỮ NGUYÊN). Không đổi checkpoint/steps/cfg/sampler/seeds.

## THAY ĐỔI 3 — TIÊU CHÍ PASS THỨ 7 (`reports/MIKAGE_FINISHED_LOOK_DIRECTION_RULING_20260610.md`)
Thêm tiêu chí 7 (ANTI-TOY): "Surface đọc như kim loại/gốm THẬT có hao mòn + cảm giác
KÍCH THƯỚC LỚN — KHÔNG nhìn như figurine nhựa / đồ chơi con nít / model kit / CGI sạch bóng."
6 tiêu chí gốc giữ nguyên (chuyển sang list đánh số 1–6 cho dễ tick).

## VERIFY (read-only, máy)
- `cast_jobs.json` = JSON hợp lệ (json.load PASS).
- 12/12 token anti-toy có trong negative · 11/11 cue có trong positive.
- `operator_approval_token` của `mikage_p1_imperial` = **null** (KHÔNG đổi).
- Cả **7/7 job** vẫn `operator_approval_token = null` → **RENDER GATE VẪN ĐÓNG**.

## STATUS DISCIPLINE
- CANON_LOCK = NO · ASSET_LOCK = NO · RENDER_ALLOWED (Claude) = NO
- MIKAGE_FINAL_COMPLETE = NOT CLAIMED · không có gì PASS/production-ready ở đây.
- CURRENT_NEXT_TASK = OPERATOR_RUN_DIRECTION_TEST_MIKAGE_P1 (KHÔNG đổi).
- Đây chỉ là patch guardrail prompt-layer + tiêu chí review. Không render, không lock.

## NEXT (operator-owned)
Operator set token + chạy RunPod direction test job `mikage_p1_imperial` (2 seeds) với
prompt đã vá → mang ảnh về → Cowork verify theo **7** tiêu chí (gồm tiêu chí anti-toy mới)
→ operator chốt A/B/C.
