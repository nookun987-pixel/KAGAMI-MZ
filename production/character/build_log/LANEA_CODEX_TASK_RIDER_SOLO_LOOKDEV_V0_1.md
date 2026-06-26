# LANE A / CODEX TASK BRIEF — RIDER SOLO LOOKDEV (relight, bounded)
Soạn bởi Lane B · 2026-06-26 · STATUS: DRAFT chờ BOOS authorize (commit = authorize).

Tiếp method đã thắng ở đầu (V2): Blender giữ hình → relight void-black + glazed material → hero render.
⚠️ RELIGHT + MATERIAL ONLY. **KHÔNG đổi geometry / silhouette / rig / pose / framing.** 1 task = 1 render.
Head trên rider = đầu CŨ ở pass này (ghép đầu V2 là task kế tiếp).

## TASK
`MIKAGE_RIDER_SOLO_LOOKDEV_V0_1`

## INPUT
- Base blend: `production/character/MIKAGE_RIDER_SOLO_EEVEE_V0_3.blend` (rider đứng đơn, đã có giáp + helmet + kiếm).
  *(Operator xác nhận nếu có rider blend mới hơn nên dùng.)*

## LIGHTING (đúng divine art-direction)
- **1 key thống trị** (area, trên-trái, chếch xuống, Rembrandt), fill ~0 → ~2/3 figure chìm vào void.
- **Rim mảnh** tách silhouette khỏi nền. World/background = **void đen `#050508` tuyệt đối** (không xám). Film transparent off.
- Camera **3/4 nhẹ, góc thấp hero**; full-body framing (giữ pose hiện tại). Fine grain.

## MATERIAL (glazed sacred porcelain — như đầu V2)
- Giáp/vỏ porcelain: base `#f2eeea`, SSS ~0.2 (Random Walk, radius nhỏ-lạnh), Coat 1.0 / Coat Rough ~0.08, base Rough ~0.3 + noise variation, craquelure micro-bump rất nhẹ.
- Underlayer/graphene/tóc: graphite tối matte. Kiếm slab: kim loại lạnh, cạnh sắc.
- **2 khe sensor helmet**: giữ — dormant ĐEN mặc định; violet = state AWAKENED bật riêng (nếu helmet hỗ trợ toggle → render cả 2; nếu không → render dormant + ghi rõ).

## RÀNG BUỘC
- Violet chỉ trong 2 khe (khi bật). KHÔNG warm/halo/flood/cyan/gold. KHÔNG đổi geometry/rig/pose/proportion.
- KHÔNG canon-lock, KHÔNG PASS/final. Output = CANDIDATE. Dọn `.blend1`. KHÔNG push.

## ĐẦU RA
- `production/character/MIKAGE_RIDER_SOLO_LOOKDEV_EEVEE_V0_1.blend`
- `production/character/reviews/MIKAGE_RIDER_SOLO_LOOKDEV_V0_1_CONTACT_SHEET.png` (3/4 hero full-body, dormant + awakened nếu có + close giáp/material)
- `production/character/reviews/MIKAGE_RIDER_SOLO_LOOKDEV_V0_1_PROOF.md` + RESULT block.
→ Lane B drift-check (silhouette giữ nguyên? material/đèn đạt?) → BOOS duyệt → ghép đầu V2 lên rider → re-render.
