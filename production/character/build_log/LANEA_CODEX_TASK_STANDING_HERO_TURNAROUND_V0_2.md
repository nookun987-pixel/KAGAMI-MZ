# LANE A / CODEX TASK BRIEF — MIKAGE STANDING HERO TURNAROUND V0.2 (CAMERA REFRAME + FILL LIGHT FIX)
Soạn: Lane B (Cowork) · 2026-07-02 · Governed by AGENTS.md "Thirty-fifth controlled exception" (MIKAGE_STANDING_HERO_TURNAROUND_V0_2).

> V0.1 = TECHNICAL_VALIDATION PASS nhưng VISUAL_REFERENCE_GATE = HOLD_FOR_FIX (chưa được approve làm master reference). Lỗi: nhân vật chỉ chiếm ~26–27% panel (quá nhỏ để soi chi tiết); 180 BACK / 225 / 270 LEFT thiếu sáng, thân áo nhập vào nền.
> Task này = SỬA ĐÚNG 2 THỨ: camera framing + fill/back light cho 3 góc yếu. KHÔNG mở lại model/material. CANDIDATE. Xong DỪNG.

## INPUT (base — CHỈ cái này)
- production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_TURNAROUND_V0_1.blend (giữ nguyên setup camera-rig + light-rig đã validate của V0.1; KHÔNG overwrite; tạo derivative mới)
- Báo BASE_SELECTED + BODY_HASH_BEFORE/AFTER (identical).

## LOCKED (KHÔNG đổi)
- TOÀN BỘ geometry — BODY_HASH unchanged vs V0.1.
- Character pose.
- MỌI material + material values (khe giữ #8F00FF, tĩnh, KHÔNG animate).
- Blade position.
- Helmet + slit geometry.
- 8 camera angles / rotation / thứ tự (chỉ đổi distance/scale, KHÔNG đổi angle).
- Labels.
- Render dimensions.
- Base file hashes.

## ĐƯỢC LÀM
1. **Camera reframe (cả 8 view):** tăng chiều cao nhân vật full-figure từ ~26–27% lên 78–82% panel height (mục tiêu 80%). Giữ đủ helmet + toàn thân + blade + đáy hình trong khung. CÙNG scale + căn dọc cho cả 8 view. Chỉnh camera distance hoặc orthographic scale (theo đúng loại camera hiện có) — KHÔNG đổi rotation/view angle/focal perspective.
2. **Lighting (chỉ fill/back):** thêm/chỉnh fill hoặc back light trung tính để 180, 225, 270 đọc rõ shoulder contour, torso volume, mép áo, silhouette đáy, tách blade khỏi nền. Giữ nguyên void-black #050508. KHÔNG tăng exposure toàn cảnh. KHÔNG cháy/clip helmet. KHÔNG đổi màu khe (#8F00FF, không lệch pink/magenta).

## OUTPUT (real deliverables)
- production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_TURNAROUND_V0_2.blend
- production/character/reviews/MIKAGE_STANDING_HERO_TURNAROUND_V0_2_SHEET.png (8 view 4×2, nhãn góc)
- production/character/reviews/MIKAGE_STANDING_HERO_TURNAROUND_V0_2_PROOF.md (báo % figure-fill trước/sau, xác nhận không crop, xác nhận hash khớp mọi mục LOCKED, NEW_ANGLE_MESH_FLAG = NONE)
- production/character/reference/turnaround_v0_2/MIKAGE_TURNAROUND_000.png … _315.png (8 view rời)

## GATE (verify — _tmp/mikage_standing_hero_turnaround_v0_2_gate/)
CONTACT_SHEET_ONLY = ĐÚNG 2 file: `contact_sheet.png` (= turnaround sheet) + `contact_sheet_review_report.md`. KHÔNG mp4, KHÔNG .blend1, KHÔNG file thừa.

## ACCEPTANCE GATE
- Figure fill: 75–85% panel height, target 80%.
- KHÔNG cắt helmet, blade, đáy thân.
- 180 / 225 / 270 đọc được hình khối, KHÔNG còn silhouette đen đặc.
- 000 / 045 / 315 KHÔNG cháy helmet.
- Toàn bộ geometry/transform/material hash KHÔNG đổi vs V0.1.
- NEW_ANGLE_MESH_FLAG = NONE.
- `python .mikage\tools\verify_output.py` PASS.

## FAIL / STOP
- Không đạt figure-fill hoặc vẫn tối 180/225/270 → giữ trạng thái HOLD_FOR_FIX, CHỈ sửa lại camera scale hoặc fill-light gây fail. KHÔNG mở rộng sang sửa model/material. KHÔNG cần vòng dựng hình mới.
- Đổi geometry/material/transform ngoài phạm vi → BLOCKER = TURNAROUND_DRIFT (revert; V0.1 giữ nguyên).
- Khe magenta / violet tràn ngoài khe → BLOCKER = SLIT_HUE_FAIL.
- KHÔNG push · KHÔNG canon-lock · KHÔNG claim final/production-ready/verified · CANDIDATE only · dọn .blend1.

## NEXT
PASS (figure fill 75–85%, 180/225/270 đọc được hình khối, mọi hash khớp) → Lane B drift-check + BOOS review sheet → nếu duyệt: sheet = reference đa góc chính thức (VISUAL_REFERENCE_GATE = PASS, APPROVED_AS_MASTER_REFERENCE quyết bởi BOOS). FAIL → báo BLOCKER cụ thể, giữ HOLD_FOR_FIX, dừng.
