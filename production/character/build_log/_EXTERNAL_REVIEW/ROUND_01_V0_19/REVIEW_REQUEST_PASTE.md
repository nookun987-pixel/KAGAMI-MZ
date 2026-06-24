# REVIEW ROUND 01 — HERO MOUNT V0.19 (lock-for-dev gate)
Đính kèm ảnh: `ATTACH_V0_19_CONTACT_SHEET.png` (cùng folder). Dán prompt dưới vào **GPT Plus** và **Gemini Pro** RIÊNG, mỗi con 1 lần, kèm ảnh. KHÔNG nói cho chúng biết Lane B nghĩ gì.

## PROMPT (copy nguyên khối + đính ảnh)
```
You are a strict brand & art reviewer for MIKAGE ZENITH (a dark "signal" sci-fi music/visual IP).
Judge the attached image ONLY against the criteria below. Do NOT praise generically. Be blunt, flag failures, no hedging.

LOCKED BRAND CRITERIA (hard rules):
- Palette: ONLY void black #050508, porcelain white #f2eeea, electric violet #8F00FF.
  Violet is a SIGNAL (slit / core / one trace) — NEVER a fill, wash, big halo, or large area.
- Character mark: faceless porcelain helmet, EXACTLY TWO thin sensor slits, graphene underlayer.
  BANNED: human face/eyes/mouth, anime, neon-as-fill, gaming HUD, mascot, warm colors,
  crimson/gold as fill, any text/logo/watermark on the image.
- Read should be: cold, minimal, premium, crafted — NOT plastic toy / model-kit / raw clay blockout.

CANDIDATE CONTEXT:
- What this is: 3D hero-mount candidate "V0.19" — a rider on a mechanical steed, Blender/Eevee,
  stylized DEV blockout (not final). Grey background is the review render, ignore it.
- What this pass was supposed to do: make the STEED BODY read mechanical/paneled, not a smooth blob.
- Must be preserved (do NOT critique as if it should change): the rider, helmet, the two violet slits,
  the palette, and the overall pose/proportions.

ANSWER IN EXACTLY THIS FORMAT (nothing else):
VERDICT: PASS / HOLD / FAIL
BRAND CHECKS (each PASS/FAIL + 1 short reason):
- Violet = signal only (no fill/wash):
- Faceless helmet, exactly 2 slits:
- No banned elements (face/anime/neon/HUD/mascot/warm/crimson-gold-fill/text):
- Palette void/porcelain/violet only:
- Video spec (NA — still image):
TASK GOAL ACHIEVED (1-5): n — why
PREMIUM vs TOY/STOCK (1-5, 5=premium): n — name the single biggest weakness
DRIFT / ARTIFACT YOU NOTICE:
#1 FIX (most impactful, concrete, one thing):
CONFIDENCE (low/med/high):
```

---
## DÁN PHẢN HỒI VÀO ĐÂY (cho Lane B tổng hợp)
### GPT trả lời:
[[paste]]

### Gemini trả lời:
[[paste]]

---
## LANE B (đã chấm độc lập, giấu cho tới khi 2 con xong):
VERDICT: HOLD-able / nghiêng LOCK-FOR-DEV
- Violet = signal only: PASS (slit/core/1 seam).
- Faceless, 2 slit: PASS.
- Banned elements: PASS (không có).
- Palette: PASS.
TASK GOAL (paneled steed body): 3/5 — có thêm panel/segment nhưng 2 khối ovoid ngực/hông còn blob.
PREMIUM vs TOY: 2.5/5 — yếu nhất: tổng thể vẫn "chunky stylized blockout", chưa sleek.
DRIFT: không (rider/violet/đầu/chân giữ).
#1 FIX: gộp/định hình lại 2 khối ovoid thân thành 1 barrel liền mạch (hoặc chấp nhận & khoá-cho-dev).
CONFIDENCE: med.

## STANDARD VERDICT (Lane B điền sau khi có GPT+Gemini):
[[điền theo rubric trong MIKAGE_EXTERNAL_REVIEW_KIT_V0_1.md]]
