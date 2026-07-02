# LANE A / CODEX TASK BRIEF — MIKAGE STANDING HERO TURNAROUND V0.1 (360° REFERENCE SHEET)
Soạn: Lane B (Cowork) · 2026-07-02 · Governed by AGENTS.md "Thirty-fourth controlled exception" (MIKAGE_STANDING_HERO_TURNAROUND_V0_1).

> Standing hero V0.14 = ASSET-LOCKED (official). Canvas motion V0.2 = APPROVED. Build-log video = HOLD (ruling BOOS 2026-07-02).
> Task này = quay quanh asset ĐÃ LOCK để ra **model sheet 360° = reference canon đa góc** cho mọi bước sau (pose mới, rig, close-up).
> KHÔNG đụng geometry/material/transform. CANDIDATE. Xong DỪNG.

## INPUT (base — CHỈ cái này)
- production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_14.blend (ASSET-LOCKED — KHÔNG overwrite; tạo derivative mới)
- Báo BASE_SELECTED + BODY_HASH_BEFORE/AFTER (identical).

## LOCKED (KHÔNG đổi)
- TOÀN BỘ geometry — BODY_HASH unchanged vs V0.14.
- Transform mọi object (kể cả blade, halo).
- MỌI material (hue + structure). Khe giữ #8F00FF, trạng thái tĩnh như V0.14 (KHÔNG animate).
- Void background #050508. Violet CHỈ ở 2 khe.
- Asset V0.14 gốc (blend + PNG) KHÔNG bị đụng.

## ĐƯỢC LÀM
1. Tạo derivative `MIKAGE_STANDING_HERO_TURNAROUND_V0_1.blend` từ V0.14.
2. **Camera rig turnaround:** 8 góc azimuth cách đều 45° (000=front · 045 · 090=right · 135 · 180=back · 225 · 270=left · 315). CÙNG lens / height / distance / framing full-body cho cả 8. Long lens (85–135mm equiv) hạn chế méo phối cảnh. Elevation ~ngang ngực, full-figure + margin đều.
3. **Neutral light rig (CHỈ trong derivative này):** thay hero single-key bằng setup even trung tính LẠNH (key+fill+rim) đủ đọc form ở MỌI góc kể cả lưng — turnaround là tài liệu reference, không phải mood shot. KHÔNG warm, KHÔNG để halo sáng hơn helmet, KHÔNG đổi material.
4. Render 8 view (mỗi view ≥900×1600 portrait, cùng size) + ghép **sheet 4×2** nhãn góc nhỏ (nhãn = review nội bộ, KHÔNG phải public asset).

## OUTPUT (real deliverables)
- production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_TURNAROUND_V0_1.blend
- production/character/reviews/MIKAGE_STANDING_HERO_TURNAROUND_V0_1_SHEET.png (8 view 4×2, nhãn góc)
- production/character/reviews/MIKAGE_STANDING_HERO_TURNAROUND_V0_1_PROOF.md
- production/character/reference/turnaround_v0_1/MIKAGE_TURNAROUND_000.png … _315.png (8 view rời)

## GATE (verify — _tmp/mikage_standing_hero_turnaround_v0_1_gate/)
CONTACT_SHEET_ONLY = ĐÚNG 2 file: `contact_sheet.png` (= turnaround sheet) + `contact_sheet_review_report.md`. KHÔNG mp4, KHÔNG file thừa.

## VERIFY (bắt buộc)
- Reopen derivative sạch; BODY_HASH + object transforms unchanged vs V0.14; material hash unchanged.
- Đủ 8 view, đúng thứ tự góc, cùng framing (chênh chiều cao silhouette ≤2% giữa các view).
- SLIT_HUE_PIXEL_SAMPLE trên view 000: violet gần #8F00FF, không magenta.
- V0.14 base blend + PNG hash y nguyên.
- `python .mikage\tools\verify_output.py` PASS.

## FAIL / STOP
- Đổi geometry/material/transform → BLOCKER = TURNAROUND_DRIFT (revert; V0.14 giữ nguyên).
- Khe magenta / violet tràn ngoài khe → BLOCKER = SLIT_HUE_FAIL.
- Góc lưng/nghiêng lộ lỗi mesh chưa từng thấy (mọi review trước là 3/4-front) → KHÔNG tự sửa mesh; vẫn render đủ 8 view, ghi FLAG chi tiết trong proof để operator quyết.
- KHÔNG push · KHÔNG canon-lock · KHÔNG claim final · CANDIDATE only · dọn .blend1.

## NEXT
PASS → Lane B drift-check + BOOS review sheet → nếu duyệt: sheet = reference đa góc chính thức (căn cứ pose mới / rig / close-up). FAIL → báo BLOCKER, dừng.
