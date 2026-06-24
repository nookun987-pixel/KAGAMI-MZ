# LANE A / CODEX TASK BRIEF — HERO MOUNT MOTION (bounded, 1 render)
Soạn bởi Lane B · 2026-06-24 · **STATUS: AUTHORIZED — BOOS duyệt 2026-06-24 (dispatch qua Lane B). Codex chạy đúng task này, 1 render.**
Nối tiếp V0.14B (material/đèn chấp nhận cho build-log). Đây là payoff ĐỘNG — "nó sống". KHÔNG đổi hình, KHÔNG đổi material/violet. Chỉ camera + đèn động + pulse.

## TASK
`MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_15`

## INPUT (khoá)
- Base blend: `production/character/MIKAGE_HERO_MOUNT_ANTITOY_EEVEE_V0_14B.blend`.
- KHÔNG đổi geometry/pose/mesh/material/violet users.

## LÀM 3 ĐIỂM (motion, Canvas spec)
1. **Breathing zoom**: camera 100% → 104% → 100% qua cả clip, easing cosine/smoothstep, chậm, không bounce.
2. **Light-sweep "awakening"**: 1 key/rim quét ngang porcelain một lần (sáng dần từ tối → lộ khối → dịu) — khoảnh khắc lộ diện. Mượt, không nhấp nháy.
3. **Violet slit pulse**: emissive ở 2 slit + core **thở** nhẹ (tiết chế, biên độ nhỏ) — signal, KHÔNG flood/wash.

## RÀNG BUỘC (HARD)
- Spec: **1080×1920 · H.264 · yuv420p · 30fps · KHÔNG audio · ~6–8s**. (Lane B ghép nhạc + caption sau.)
- HARD BANS: KHÔNG text/lyrics/logo/watermark; KHÔNG warm color; KHÔNG flood/halo to/crimson/gold; KHÔNG đổi pose/geometry.
- KHÔNG canon-lock, KHÔNG PASS/final. Output = CANDIDATE.
- Dọn frame tạm + `.blend1` trước commit; KHÔNG push.

## ĐẦU RA
- `production/character/MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_15.mp4` (1080×1920, h264/yuv420p, 30fps, no audio)
- `production/character/reviews/..._V0_15_POSTER.png` (1 frame đỉnh)
- `production/character/reviews/..._V0_15_PROOF.md` + RESULT block (ffprobe: WxH/fps/codec/pix_fmt/duration).
→ Lane B verify spec + drift-check motion (breathing/sweep/pulse, no text, palette) → ghép nhạc PORCELAIN ASCENSION + caption → beat reveal chính (Reels/Shorts).

## PARKED (không làm trong task này)
- GEOMETRY REFINEMENT (bo/bevel khối, equine head, khớp thật) cho "hero final" — chỉ chạy khi BOOS re-point riêng.
