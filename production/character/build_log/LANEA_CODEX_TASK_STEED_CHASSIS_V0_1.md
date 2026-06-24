# LANE A / CODEX TASK BRIEF — STEED CHASSIS UNIFY (bounded, 1 render)
Soạn bởi Lane B · 2026-06-24 · **STATUS: AUTHORIZED — BOOS duyệt 2026-06-24 (dispatch qua Lane B).**
Nguồn quyết định: REVIEW 3-ĐẦU round 01 (Lane B + GPT + Gemini) — đồng thuận #1 fix. KHÔNG đụng rider/violet/đầu/chân.

## TASK
`MIKAGE_HERO_MOUNT_STEED_CHASSIS_EEVEE_V0_20`

## INPUT (khoá)
- Base blend: `production/character/MIKAGE_HERO_MOUNT_STEED_BODY_REFINE_EEVEE_V0_19.blend`.
- GIỮ nguyên: rider/blade/helmet/violet/material, đầu+chân steed, **tỉ lệ + vị trí rider ngồi**.

## LÀM 1 ĐIỂM (theo đồng thuận 3-đầu)
- Thay **2 khối ovoid trơn (ngực + hông)** bằng **MỘT barrel chassis liền, faceted**: 2–3 mảng giáp lớn lồng/khớp nhau (interlocking armor planes) chạy liên tục cổ→thân→hông, bevel nhỏ như rider. **Tích hợp** các panel side đang "lửng lơ" vào chassis (đọc như truyền lực vào thân, không trôi). Bỏ hẳn profile "blob".

## RÀNG BUỘC (HARD)
- CHỈ sửa mesh THÂN steed. KHÔNG đụng rider/blade/helmet/violet/material hex, KHÔNG đụng đầu+chân.
- GIỮ tỉ lệ tổng + chỗ rider ngồi (rider không hở/lún). KHÔNG phình to/dời pose.
- Stylized, ăn ngôn ngữ khối hiện có. KHÔNG realistic-hoá, KHÔNG warm/flood, KHÔNG thêm màu.
- KHÔNG canon-lock/PASS. Output = CANDIDATE. Dọn `.blend1`, KHÔNG push.

## ĐẦU RA (lưu ý cho vòng review sau)
- `production/character/MIKAGE_HERO_MOUNT_STEED_CHASSIS_EEVEE_V0_20.blend`
- `production/character/reviews/..._V0_20_CONTACT_SHEET.png` (4 panel) — **VÀ** 1 file crop SẠCH `..._V0_20_REVIEW_CROP.png` (1 góc 3/4 toàn mount, **KHÔNG nhãn/chữ overlay**) để gửi review 3-đầu (round 01 bị Gemini ding nhãn contact-sheet).
- `production/character/reviews/..._V0_20_PROOF.md` + RESULT (mesh trước/sau, xác nhận rider/violet/đầu/chân/tỉ lệ không đổi).
→ Lane B drift-check → review 3-đầu round 02 (dùng crop sạch) → BOOS chốt lock-for-dev.
