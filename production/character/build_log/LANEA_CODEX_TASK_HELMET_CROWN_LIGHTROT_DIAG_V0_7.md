# LANE A / CODEX TASK BRIEF — MIKAGE HELMET CROWN LIGHT-ROTATION DIAGNOSTIC (V0.7)
Soạn: Lane B (Cowork) · 2026-07-01 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception #25.
Governed by AGENTS.md "Twenty-fifth controlled exception" (MIKAGE_HELMET_CROWN_LIGHTROT_DIAG_V0_7).

> Mục đích DUY NHẤT: phân định mấy DẢI SÁNG NGANG trên crown (rõ ở góc 3/4) là
> (a) phản chiếu từ setup đèn → GEOMETRY SẠCH, hay (b) residual surface waviness → GEOMETRY.
> Đây là DIAGNOSTIC. **KHÔNG đổi geometry. KHÔNG đổi lookdev.** Chỉ xoay 1 đèn trung tính rồi render so sánh.

## SOURCE OF TRUTH
- Master: production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png (sha256 b86f68…06429).
- Helmet target: production/character/build_log/MIKAGE_HELMET_BLOCKING_SPEC_V0_1.md.

## INPUT (base — CHỈ cái này)
- production/character/production_actor/rig_derivatives/MIKAGE_HELMET_SURFACE_CONTROL_V0_7.blend
  Báo BASE_SELECTED + BODY_HASH_BEFORE. (Dùng bản GEOMETRY V0.7, KHÔNG dùng bản lookdev V0.8.)
- CẤM: mọi geometry RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 / V0.8; không import scene.

## METHOD (diagnostic — không đổi hình)
1. Set vật liệu helmet về NEUTRAL clay matte (low specular) để loại nhiễu từ material bóng; TẮT halo.
2. 1 đèn Area trung tính. Camera cố định ở góc 3/4 (góc thấy rõ dải sáng crown nhất) — GIỮ NGUYÊN camera qua cả 4 khung.
3. Xoay ĐÈN quanh crown 4 vị trí, mỗi bước ~15–20° (ví dụ azimuth 0° / +18° / +36° / +54°). Chỉ đèn xoay, KHÔNG động camera/mesh.
4. Render 4 khung crown-3/4 vào 1 contact sheet, đánh số góc đèn từng khung.

## ĐỌC KẾT QUẢ (ghi rõ trong report)
- Dải sáng DI CHUYỂN theo đèn qua 4 khung → bề mặt SẠCH, highlight là do đèn → VERDICT = PASS, chốt V0.7 làm geometry base.
- Dải sáng ĐỨNG YÊN đúng chỗ trên mesh dù đèn xoay → residual crown waviness → VERDICT = LOCAL_FIX_NEEDED →
  đề xuất task tiếp `MIKAGE_HELMET_CROWN_SUPPORT_FIX_V0_7_1` (CHỈ sửa local crown support/vertex flow;
  KHÔNG tăng subdiv level; KHÔNG động jaw/slit/dimensions/silhouette).

## RÀNG BUỘC
- KHÔNG đổi geometry (BODY_HASH phải KHÔNG đổi — đây là diagnostic). Jaw/slit/dimensions/silhouette giữ nguyên.
- Palette lock. Violet chỉ 2 khe (ở diagnostic clay có thể để khe tối). No second body form. No V0.4 reuse.
- Dọn .blend1. KHÔNG overwrite base. KHÔNG push/lock/canon.

## OUTPUT (candidate)
- production/character/reviews/MIKAGE_HELMET_CROWN_LIGHTROT_DIAG_V0_7_CONTACT_SHEET.png (4 góc đèn, crown-3/4)
- production/character/reviews/MIKAGE_HELMET_CROWN_LIGHTROT_DIAG_V0_7_PROOF.md + RESULT block (BODY_HASH unchanged? verdict PASS hay LOCAL_FIX_NEEDED?)
- Gate verify (CONTACT_SHEET_ONLY): _tmp/mikage_helmet_crown_lightrot_diag_v0_7_gate/ chỉ chứa contact_sheet.png + contact_sheet_review_report.md.

→ Stop sau proof cho owner review. Lane B đọc contact sheet (bands move hay fixed?) → BOOS ra ruling cuối.
