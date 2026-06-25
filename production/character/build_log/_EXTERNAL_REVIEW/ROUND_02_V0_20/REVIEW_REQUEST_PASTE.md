# REVIEW ROUND 02 — HERO MOUNT V0.20 (lock-for-dev gate)
Đính kèm: `ATTACH_V0_20_CLEAN_CROP.png` (crop sạch, KHÔNG nhãn — đã sửa lỗi round 01). Dán prompt vào **GPT Plus** + **Gemini Pro** riêng, kèm ảnh. KHÔNG nói Lane B nghĩ gì.

## PROMPT (copy + đính ảnh)
```
You are a strict brand & art reviewer for MIKAGE ZENITH (a dark "signal" sci-fi music/visual IP).
Judge the attached image ONLY against the criteria below. Do NOT praise generically. Be blunt, flag failures.

LOCKED BRAND CRITERIA (hard rules):
- Palette: ONLY void black #050508, porcelain white #f2eeea, electric violet #8F00FF.
  Violet is a SIGNAL (slit/core/one trace) — NEVER a fill, wash, big halo, or large area.
- Character mark: faceless porcelain helmet, EXACTLY TWO thin sensor slits, graphene underlayer.
  BANNED: human face/eyes/mouth, anime, neon-as-fill, gaming HUD, mascot, warm colors,
  crimson/gold as fill, any text/logo/watermark.
- Read should be: cold, minimal, premium, crafted — NOT plastic toy / model-kit / raw clay blockout.

CANDIDATE CONTEXT:
- What this is: 3D hero-mount candidate "V0.20" — rider on a mechanical steed, Blender/Eevee, stylized DEV asset.
  Grey background is the review render; ignore it. (This is a clean crop, no labels.)
- What this pass did: replaced the steed's two smooth ovoid body masses with one faceted/paneled barrel chassis.
- Must be preserved (do NOT critique as if it should change): rider, helmet, two violet slits, palette, pose.

ANSWER IN EXACTLY THIS FORMAT (nothing else):
VERDICT: PASS / HOLD / FAIL
BRAND CHECKS (each PASS/FAIL + 1 short reason):
- Violet = signal only (no fill/wash):
- Faceless helmet, exactly 2 slits:
- No banned elements (face/anime/neon/HUD/mascot/warm/crimson-gold-fill/text):
- Palette void/porcelain/violet only:
- Video spec (NA — still image):
TASK GOAL ACHIEVED — steed body now reads as one mechanical chassis, not a blob (1-5): n — why
PREMIUM vs TOY/STOCK (1-5, 5=premium): n — name the single biggest remaining weakness
DRIFT / ARTIFACT YOU NOTICE:
#1 FIX (most impactful, concrete, one thing):
CONFIDENCE (low/med/high):
```

---
## DÁN PHẢN HỒI
### GPT:
[[paste]]
### Gemini:
[[paste]]

---
## LANE B (chấm độc lập, giấu tới khi 2 con xong):
VERDICT: nghiêng PASS / LOCK-FOR-DEV
- Brand: Violet signal PASS · faceless 2-slit PASS · no banned PASS · palette PASS.
TASK GOAL (chassis thay blob): 4/5 — 2 khối ovoid đã thành chassis paneled faceted, profile blob gần hết.
PREMIUM vs TOY: 3.5/5 — khá hơn hẳn; còn hơi chunky stylized nhưng mạch lạc, đủ cho dev hero.
DRIFT: không (rider/violet/đầu/chân giữ).
#1 FIX (nếu muốn đẩy tiếp): thống nhất tiết tấu panel rider↔steed cho liền 1 ngôn ngữ; hoặc DỪNG, lock-for-dev.
CONFIDENCE: med-high.

## STANDARD VERDICT (Lane B điền sau khi có GPT+Gemini):
[[điền theo rubric]]
