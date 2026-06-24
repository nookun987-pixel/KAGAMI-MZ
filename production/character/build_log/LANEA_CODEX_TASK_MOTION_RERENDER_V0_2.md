# LANE A / CODEX TASK BRIEF — MOTION RE-RENDER trên mount refined (bounded, 1 render)
Soạn bởi Lane B · 2026-06-24 · **STATUS: AUTHORIZED — BOOS duyệt 2026-06-24 (dispatch qua Lane B). Codex chạy đúng task này, 1 render.**
Mount đã refine (V0.16 bevel rider + V0.17 steed equine/khớp, đều ĐẠT). Re-render motion V0.15 trên hình mới để beat reveal đẹp hơn. KHÔNG đổi hình/material/violet.

## TASK
`MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_18`

## INPUT (khoá)
- Base blend: `production/character/MIKAGE_HERO_MOUNT_STEED_REFINE_EEVEE_V0_17.blend`.
- KHÔNG đổi geometry/pose/material/violet. Chỉ camera + đèn động + pulse (như V0.15).

## LÀM (motion, Canvas spec — same recipe V0.15)
1. **Breathing zoom** 100→104→100, easing cosine/smoothstep, chậm.
2. **Light-sweep "awakening"** quét ngang porcelain 1 lần (tối → lộ khối → dịu).
3. **Violet slit pulse** ở 2 slit + core, thở nhẹ, tiết chế.

## RÀNG BUỘC (HARD)
- Spec: **1080×1920 · H.264 · yuv420p · 30fps · KHÔNG audio · ~6–8s**.
- HARD BANS: KHÔNG text/lyrics/logo/watermark · KHÔNG warm · KHÔNG flood/halo to/crimson/gold · KHÔNG đổi pose/geometry/material/violet.
- KHÔNG canon-lock/PASS. Output = CANDIDATE. Dọn frame tạm + `.blend1`, KHÔNG push.

## ĐẦU RA
- `production/character/MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_18.mp4` (1080×1920 h264/yuv420p 30fps no-audio ~6–8s)
- `production/character/reviews/..._V0_18_POSTER.png`
- `production/character/reviews/..._V0_18_PROOF.md` + RESULT (ffprobe WxH/fps/codec/pix_fmt/duration).
→ Lane B verify spec + drift-check motion → ghép nhạc PORCELAIN ASCENSION + caption → beat reveal v2 (thay bản cũ), và cập nhật vào film đầy đủ.
