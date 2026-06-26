# LANE A / CODEX TASK BRIEF — RIDER HEAD GRAFT (V2 head onto rider)
Soạn bởi Lane B · 2026-06-26 · STATUS: DRAFT chờ BOOS authorize (commit = authorize).

Mục tiêu: thay đầu cũ (tròn) trên rider bằng **đầu V2 đã lock** (tall wedge, 2 khe recessed, dormant/awakened).
Tái dùng công sức đầu, KHÔNG nắn lại. Body/rig/pose/blade GIỮ NGUYÊN. 1 task = 1 render.

## TASK
`MIKAGE_RIDER_HEAD_GRAFT_V0_1`

## INPUT
- Rider base: `production/character/MIKAGE_RIDER_SOLO_LOOKDEV_EEVEE_V0_1.blend` (đã relit void-black).
- Head V2 source: `production/character/MIKAGE_HELMET_HEAD_LOOKDEV_EEVEE_V0_1.blend` (wedge đã lock, hash `c68d2b813f75...`).

## ACTION (geometry — CHỈ phần đầu)
1. Import mesh đầu V2 (helmet + 2 khe + emissive states) từ head V2 blend vào rider blend.
2. **Định vị + scale + xoay** đầu V2 khớp cổ rider (đúng vị trí đầu cũ, tỉ lệ hợp thân). Snap đáy đầu vào điểm cổ.
3. **Xoá đầu cũ** của rider hoàn toàn (không còn 2 đầu, không z-fight).
4. Giữ nguyên dormant black / awakened violet states của đầu V2.
5. Material đầu = glazed porcelain (như V2); khớp lighting void-black hiện có của rider.

## RÀNG BUỘC
- **KHÔNG đổi geometry/rig/pose body dưới cổ, KHÔNG đổi blade, KHÔNG đổi camera/framing/world.**
- Chỉ thao tác: remove old head + add V2 head + transform (move/scale/rotate) cho khớp cổ.
- Violet chỉ trong 2 khe. KHÔNG warm/halo/flood/gold. KHÔNG canon-lock/PASS. Output = CANDIDATE. Dọn `.blend1`. KHÔNG push.

## ĐẦU RA
- `production/character/MIKAGE_RIDER_HEAD_GRAFT_EEVEE_V0_1.blend`
- `production/character/reviews/MIKAGE_RIDER_HEAD_GRAFT_V0_1_CONTACT_SHEET.png` (3/4 full-body hero dormant + awakened + close cổ-đầu khớp)
- `production/character/reviews/MIKAGE_RIDER_HEAD_GRAFT_V0_1_PROOF.md` + RESULT block (xác nhận body hash unchanged, chỉ head thay).
→ Lane B drift-check (thân giữ nguyên? đầu V2 khớp cổ tự nhiên?) → BOOS duyệt → pass nắn form THÂN.
