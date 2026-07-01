# APPROVAL — MIKAGE STANDING HERO CANVAS (MOTION V0.2)
Record type: APPROVAL · Authority: OPERATOR RULING (BOOS BỚP / Phi Hùng) · Date: 2026-07-02
Recorded by: Lane B (Cowork). Documents an OPERATOR-authorized approval; not a self-approval by the agent.

## OWNER RULING (verbatim intent)
APPROVE `MIKAGE_STANDING_HERO_MOTION_V0_2` AS THE OFFICIAL STANDING HERO CANVAS.
- Dormant 2%: PASS
- Mid 35%: PASS
- Awakened 100%: PASS
- Ignition timing: PASS
- Violet hue: PASS
- Body / transform / camera drift: NONE
- Canvas technical specification: PASS
- V0.2 supersedes V0.1
- Create approval record and commit
- Do NOT push until a separate push gate
- Do NOT reopen pulse tuning unless downstream compression visibly destroys the dormant→awakened contrast

## WHAT IS APPROVED
The V0.2 vertical Spotify Canvas clip and its motion derivative blend. Pairs with the locked
still hero `MIKAGE_STANDING_HERO_POLISH_V0_14` (asset-lock record in this folder) as one unified
standing-hero asset set. Geometry/material line is unchanged — motion only re-curved the two-slit
emission STRENGTH; the locked V0.14 still asset was not touched.

| Asset | Path | sha256 |
|---|---|---|
| Motion Canvas blend (APPROVED) | production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_MOTION_V0_2.blend | fbba41671497e3f155c41a415b3d4ed2077b8c89228390a09fad6af8e235a16b |
| Canvas mp4 (APPROVED, 1080×1920, 6.03s) | production/character/reviews/MIKAGE_STANDING_HERO_MOTION_V0_2.mp4 | f41819d818736b355102f117665a52113c7edbb9494be9e5aac9e30a834187fb |
| Keyframes strip | production/character/reviews/MIKAGE_STANDING_HERO_MOTION_V0_2_KEYFRAMES.png | 0340a5c32d4b6c2a884ff3466e48c95b214c9617fe4ee3636afd46d87fabbdd6 |
| Codex proof | production/character/reviews/MIKAGE_STANDING_HERO_MOTION_V0_2_PROOF.md | 17b83fb1c202f11a96aa8bba0dbbad98ed77322f090eeedba990f8084623bb67 |

## VERIFICATION ON RECORD
- Emission curve (Codex): dormant 2% · mid 35% · awakened 100% of peak; fast ignition ~65–70% of the clip; smooth loop.
- Canvas spec (Codex + Lane B ffprobe): 1080×1920 · H.264 · yuv420p · 30 fps · 6.033 s · no audio stream.
- BODY_HASH / object transforms / camera framing / material hue / spec UNCHANGED vs V0.1; only the two-slit emission STRENGTH curve changed; awakened peak + bloom NOT increased.
- Contrast dormant→awakened confirmed on the keyframe strip (dormant reads clearly off; awakening punches from a dark baseline). Note: a broad pixel-mean metric is unreliable here (bloom scatter) — the visual strip + the authoritative emission percentages are the basis.

## STATUS + GUARDRAILS
- Status: APPROVED as the official standing-hero Canvas. To be committed locally. NOT pushed (awaiting a separate push gate).
- V0.1 is retained as candidate history only (its blend is the V0.2 base). V0.1 is NOT for public use.
- Do NOT reopen the pulse tuning (no V0.3) unless a real, post-compression upload visibly collapses the dormant→awakened contrast. If that happens: verify the compressed output file first, then adjust at the export / delivery / contrast layer — return to the animation source only with evidence the source itself fails.

## PAIRED ASSET SET
- Still hero (locked): `MIKAGE_STANDING_HERO_POLISH_V0_14` — commit 64cd46f, record `MIKAGE_STANDING_HERO_POLISH_V0_14_ASSET_LOCK.md`.
- Motion Canvas (approved): `MIKAGE_STANDING_HERO_MOTION_V0_2` — this record.
