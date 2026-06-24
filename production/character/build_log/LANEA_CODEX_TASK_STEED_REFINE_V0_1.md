# LANE A / CODEX TASK BRIEF — STEED REFINE (bounded, 1 render)
Soạn bởi Lane B · 2026-06-24 · **STATUS: AUTHORIZED — BOOS duyệt 2026-06-24 (dispatch qua Lane B). Codex chạy đúng task này, 1 render.**
Drift-check Lane B: rider đã tới trần blockout (V0.16 bevel ổn). Phần đọc "lồi lõm/blob" nhất giờ là CON STEED (đầu tròn như khối cầu, chân như que). Task này CHỈ sửa steed. KHÔNG đụng rider/blade/material/violet.

## TASK
`MIKAGE_HERO_MOUNT_STEED_REFINE_EEVEE_V0_17`

## INPUT (khoá)
- Base blend: `production/character/MIKAGE_HERO_MOUNT_GEOMETRY_REFINE_EEVEE_V0_16.blend`.
- GIỮ nguyên: rider toàn bộ, blade, bố cục/tỉ lệ tổng mount, pose, vị trí steed, material slots, violet users.

## LÀM 2 ĐIỂM (chỉ steed, stylized — không thực-tế hoá)
1. **Đầu steed → dáng equine**: bỏ khối cầu/blob; tạo muzzle thuôn dài + hàm + cổ chuyển tiếp, vẫn mặt máy faceless (KHÔNG mắt/lỗ mũi chi tiết, KHÔNG thêm màu). Giữ chất porcelain/graphite như hiện tại.
2. **Chân steed → có khớp**: thay "que" bằng chân có khối + khớp đọc được (vai/khuỷu/gối/hock), móng/đế tiếp đất rõ. Giữ 4 chân, giữ stance hiện tại (không đổi pose mount).

## RÀNG BUỘC (HARD)
- CHỈ sửa mesh steed. KHÔNG đụng rider/blade/helmet/violet/material hex.
- Giữ tỉ lệ tổng + vị trí steed dưới rider (rider vẫn ngồi đúng chỗ). KHÔNG phình to/dời.
- Stylized, ăn khớp ngôn ngữ khối hiện có (porcelain mảng + bevel nhỏ). KHÔNG realistic-hoá, KHÔNG warm/flood.
- KHÔNG canon-lock, KHÔNG PASS/final. Output = CANDIDATE.
- Dọn `.blend1` trước commit; KHÔNG push.

## ĐẦU RA
- `production/character/MIKAGE_HERO_MOUNT_STEED_REFINE_EEVEE_V0_17.blend`
- `production/character/reviews/..._V0_17_CONTACT_SHEET.png` (4 panel: full-mount + steed head close + steed leg/joint close + hero-crop dọc nền tối)
- `production/character/reviews/..._V0_17_PROOF.md` + RESULT (mesh trước/sau, xác nhận rider/violet/material không đổi).
→ Lane B drift-check: steed đọc "ngựa-máy" chưa, rider/violet còn nguyên → BOOS duyệt → re-render motion trên mount mới.

## PARKED
- Re-sculpt rider premium · ghép world scene · rig validation.
