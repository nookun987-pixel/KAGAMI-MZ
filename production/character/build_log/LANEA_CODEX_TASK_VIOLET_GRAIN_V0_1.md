# LANE A / CODEX TASK BRIEF — VIOLET SIGNAL + ANTI-TOY GRAIN (bounded, 1 render)
Soạn bởi Lane B · 2026-06-23 · STATUS: DRAFT chờ BOOS authorize.
Nối tiếp material V0.13 (đã chấp nhận). Task này bật violet signal + thêm grain anti-toy. KHÔNG đổi hình, KHÔNG motion.
BOOS đặt CURRENT_NEXT_TASK trong handoff thì Codex chạy. Mỗi task = 1 render.

## TASK
`MIKAGE_HERO_MOUNT_VIOLET_GRAIN_EEVEE_V0_14`

## INPUT (khoá)
- Base blend: `production/character/MIKAGE_HERO_MOUNT_MATERIAL_EEVEE_V0_13.blend`.
- KHÔNG đổi geometry/material gốc — chỉ thêm violet emissive + grain + tinh chỉnh surface.

## LÀM 2 ĐIỂM
1. **Violet signal pass** (`#8F00FF`): bật emissive ở **2 sensor slit helmet + core** + tối đa 1 điểm nhấn (vd seam ngực). **TIẾT CHẾ** — violet = SIGNAL (halo/trace mảnh), KHÔNG fill, KHÔNG wash, KHÔNG quầng to. Slit mã giữ graphite (không violet).
2. **Anti-toy surface**: thêm **fine grain** + chớm hao mòn cạnh trên porcelain/steel để bớt "figurine nhựa/model-kit". Giữ palette, không đổi hình.

## RÀNG BUỘC
- KHÔNG warm/halo to/flood/crimson/gold. KHÔNG đổi geometry/pose/rig/motion.
- Violet CHỈ ở slit/core/1 seam — nếu lan ra mảng lớn là SAI.
- KHÔNG canon-lock, KHÔNG PASS/final. Output = CANDIDATE.
- Dọn `.blend1` trước commit; KHÔNG push.

## ĐẦU RA
- `production/character/MIKAGE_HERO_MOUNT_VIOLET_GRAIN_EEVEE_V0_14.blend`
- `production/character/reviews/..._V0_14_CONTACT_SHEET.png` (4 panel: full-mount + rider close helmet/slit + steed + 1 hero-crop dọc ứng viên reveal)
- `production/character/reviews/..._V0_14_PROOF.md` + RESULT block.
→ Lane B drift-check violet tiết chế + grain → BOOS duyệt → đây là **REVEAL ảnh tĩnh** (Lane B crop+caption) → rồi MOTION V0.15.
