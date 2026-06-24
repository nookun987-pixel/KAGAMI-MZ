# LANE A / CODEX TASK BRIEF — STEED BODY REFINE (bounded, 1 render) — pass mount cuối
Soạn bởi Lane B · 2026-06-24 · **STATUS: AUTHORIZED — BOOS duyệt 2026-06-24 (dispatch qua Lane B). Codex chạy đúng task này, 1 render.**
V0.17 đã sửa đầu+chân steed (ĐẠT). Ở góc rộng (V0.18 motion) thân steed còn đọc "blob trơn 2 cục". Task này panel/segment thân cho ra "ngựa-máy". Coi như PASS REFINE MOUNT CUỐI — xong thì mount khoá-cho-dev.

## TASK
`MIKAGE_HERO_MOUNT_STEED_BODY_REFINE_EEVEE_V0_19`

## INPUT (khoá)
- Base blend: `production/character/MIKAGE_HERO_MOUNT_STEED_REFINE_EEVEE_V0_17.blend`.
- GIỮ nguyên: rider/blade/helmet/violet/material, đầu+chân steed (V0.17), tỉ lệ/pose/bố cục, vị trí rider ngồi.

## LÀM 1 ĐIỂM (chỉ thân steed)
- Thân/torso: bỏ "blob trơn 2 cục" → khối barrel cơ khí có **panel/segment** (đường chia mảng porcelain + bevel nhỏ như rider), chuyển tiếp cổ→thân→hông mượt mà đọc được. Vẫn faceless, không màu mới, stylized — KHÔNG realistic-hoá, KHÔNG thêm chi tiết thừa.

## RÀNG BUỘC (HARD)
- CHỈ sửa mesh thân steed. KHÔNG đụng rider/blade/helmet/violet/material hex, KHÔNG đụng đầu+chân (đã đạt).
- Giữ tỉ lệ + chỗ rider ngồi (rider không bị hở/lún). KHÔNG phình to/dời pose.
- KHÔNG canon-lock/PASS. Output = CANDIDATE. Dọn `.blend1`, KHÔNG push.

## ĐẦU RA
- `production/character/MIKAGE_HERO_MOUNT_STEED_BODY_REFINE_EEVEE_V0_19.blend`
- `production/character/reviews/..._V0_19_CONTACT_SHEET.png` (4 panel: full-mount góc rộng + thân close + rider-seat check + hero-crop)
- `production/character/reviews/..._V0_19_PROOF.md` + RESULT (mesh trước/sau, xác nhận rider/violet/đầu/chân không đổi).
→ Lane B drift-check (thân hết blob? rider ngồi đúng? violet nguyên?) → mount KHOÁ-CHO-DEV → re-render motion cuối + ghép reveal. Sau đó Codex chuyển: world scene / rig validation (chờ BOOS re-point).
