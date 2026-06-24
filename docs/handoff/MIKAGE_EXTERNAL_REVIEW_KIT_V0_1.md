# MIKAGE — EXTERNAL REVIEW KIT V0.1 (3-đầu: GPT + Gemini + Lane B)
Mục đích: chống lệch khi Lane B vừa viết brief vừa tự chấm. Ở MỐC QUAN TRỌNG (trước public / trước canon-lock / câu hỏi "đẹp/đủ chưa"), gửi candidate cho **GPT Plus** và **Gemini Pro** chấm ĐỘC LẬP, rồi Lane B tổng hợp 3 ý → 1 STANDARD VERDICT. BOOS chốt cuối.

## NGUYÊN TẮC (đọc 1 lần)
1. **KHÔNG đưa verdict Lane B cho GPT/Gemini** trong lúc hỏi → tránh chúng hùa theo. Chấm xong mới đối chiếu.
2. Gửi **cùng 1 prompt + cùng 1 ảnh** cho cả 2 con → so sánh công bằng.
3. Ép **output cố định** (khối dưới) → 3 verdict so được.
4. **Brand-rule fail** (objective) thắng "đẹp/xấu" (subjective): chỉ cần 1 reviewer chỉ ra fail brand có thật → HOLD để sửa, dù 2 con kia khen.
5. Dùng ở **mốc**, không phải từng micro-pass (chậm + nhiễu). 1 vòng = 1 lần hỏi.

---

## PHẦN A — PROMPT DÁN SANG GPT / GEMINI (kèm ảnh)
> Copy nguyên khối dưới, điền 3 chỗ [[...]], đính ảnh, dán vào GPT và Gemini riêng.

```
You are a strict brand & art reviewer for MIKAGE ZENITH (a dark "signal" sci-fi music/visual IP).
Judge the attached image ONLY against the criteria below. Do NOT praise generically. Be blunt, flag failures, no hedging.

LOCKED BRAND CRITERIA (treat as hard rules):
- Palette: ONLY void black #050508, porcelain white #f2eeea, electric violet #8F00FF.
  Violet is a SIGNAL (slit / core / one trace) — NEVER a fill, wash, big halo, or large area.
- Character mark: faceless porcelain helmet, EXACTLY TWO thin sensor slits, graphene underlayer.
  BANNED: human face/eyes/mouth, anime, neon-as-fill, gaming HUD, mascot, warm colors,
  crimson/gold as fill, any text/logo/watermark on the image.
- Read should be: cold, minimal, premium, crafted — NOT plastic toy / model-kit / raw clay blockout.
- (If it is video) Spec must be vertical 1080x1920, 30fps, no on-screen text. (Ignore if still image.)

CANDIDATE CONTEXT:
- Task / what this is: [[điền: vd "3D hero-mount candidate V0.19 — Blender/Eevee, stylized dev blockout"]]
- What it WAS SUPPOSED to do this pass: [[điền: vd "make the steed body read mechanical (paneled), not a smooth blob"]]
- What MUST be preserved (do not critique as if it should change): [[điền: vd "rider, helmet, two violet slits, palette, pose"]]

ANSWER IN EXACTLY THIS FORMAT (nothing else):
VERDICT: PASS / HOLD / FAIL
BRAND CHECKS (each PASS/FAIL + 1 short reason):
- Violet = signal only (no fill/wash):
- Faceless helmet, exactly 2 slits:
- No banned elements (face/anime/neon/HUD/mascot/warm/crimson-gold-fill/text):
- Palette void/porcelain/violet only:
- Video spec 1080x1920/30fps/no-text (or NA):
TASK GOAL ACHIEVED (1-5): n — why
PREMIUM vs TOY/STOCK (1-5, 5=premium): n — name the single biggest weakness
DRIFT / ARTIFACT YOU NOTICE:
#1 FIX (most impactful, concrete, one thing):
CONFIDENCE (low/med/high):
```

---

## PHẦN B — RUBRIC TỔNG HỢP (Lane B làm sau khi có 2 phản hồi)
Lane B gom 3 verdict (Lane B + GPT + Gemini) thành STANDARD VERDICT:

1. **Brand checks**: nếu BẤT KỲ reviewer nào fail 1 rule brand → Lane B kiểm lại bằng ảnh. Có thật → mục đó FAIL, kết quả ≥ HOLD (không cho PASS).
2. **Task goal & Premium score**: lấy trung vị 3 điểm. Lệch > 2 điểm giữa các con → ghi "tranh cãi", nêu lý do mỗi bên.
3. **#1 FIX**: gom 3 đề xuất; fix nào ≥2 reviewer nhắc = ưu tiên số 1.
4. STANDARD VERDICT = PASS / HOLD + (các fix ưu tiên) + (cái phải giữ). **BOOS chốt** lock hay sửa.

### Khối STANDARD VERDICT (Lane B điền)
```
STANDARD VERDICT (round __, [[asset]]):
- Brand: PASS / FAIL ở: ...
- Task goal (median): n/5
- Premium (median): n/5   [đồng thuận? / tranh cãi: ...]
- #1 FIX (đa số): ...
- Phụ: ...
- ĐỀ NGHỊ: LOCK-FOR-DEV / SỬA (dispatch ...) — chờ BOOS chốt.
```

---

## DÙNG KHI NÀO
- Trước khi LOCK mount/asset cho-dev, trước khi đăng public, trước khi BOOS định canon-lock, hoặc khi Lane B với BOOS bất đồng "đẹp/đủ chưa".
- KHÔNG dùng cho mỗi micro-pass kỹ thuật (spec/drift) — cái đó Lane B tự gate.
