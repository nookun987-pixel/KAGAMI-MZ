# RULING — MIKAGE FINISHED-LOOK DIRECTION (operator, 2026-06-10)

## PHÁN QUYẾT (nguyên văn ý operator)
```text
REV-B DIRECTION = HOLD
FAIL_REASON = TOO_NUN_MANNEQUIN / TOO_PASSIVE / NOT_ENOUGH_COMBAT_FRAME
KEEP = MASK + VIOLET SLITS + PALETTE (đen/trắng/tím)
DISCARD = BODY LANGUAGE + ROBE + HALO + BLADE PRESENTATION (blade dựng như cột)
```
- Ảnh composed (operator gửi) + FINISHED_IMPRESSION_V0_1 (Cowork) = cùng failure mode: "manơ-canh / bà sơ / tượng nhà thờ". KHÔNG dùng làm north star.
- Đích phải đọc là: **"đứng yên nhưng có thể giết"** — không phải "đứng yên để trưng bày".
- Hướng A/B/C: hiện đang QUÁ A (monolith thần quyền) — dịch về phía B (combat executor). Mức cân cuối = operator chốt sau khi xem ảnh direction-test.

## TÁC ĐỘNG PHẠM VI
1. **4-view V2.2 REV-C (technical reference)**: GIỮ NGUYÊN OPERATOR_VISUAL_PASS — đây là sheet tích hợp canon, không phải mood render. Tuy nhiên khi direction B được chốt qua render test, có thể mở 1 vòng rework reference (armor structure rõ hơn, tay có cơ cấu) — PENDING, không tự làm.
2. **Render prompt layer (cast_jobs.json `mikage_p1_imperial`)**: THAY positive bằng prompt combat-frame do operator viết + negative lock chống nun/mannequin. ĐÃ ÁP DỤNG phiên này.
3. **FINISHED_IMPRESSION_V0_1**: status = DIRECTION_REJECTED (giữ file làm lịch sử; mask/slits/palette vẫn đúng).
4. Từ khóa CẤM trong mọi prompt Mikage sau này: sacred, robe, ceremonial, halo, standing still, pillar, nun, priest, church, mannequin, statue, monk, gown, passive doll. Từ khóa TĂNG: combat frame, armored torso, joint structure, mechanical weight, execution unit, black-glass plating, weapon integration.
5. Blade trong key visual: vũ khí TÍCH HỢP với tay/stance (heavy but usable) — không phải cột trang trí. Material giữ BLADE_SPEC 🔒: titan đen + lõi crimson #E60000 (KHÔNG trắng, KHÔNG lõi tím).

## TIÊU CHÍ PASS ẢNH KẾ TIẾP (operator đặt)
Vai có lực · tay có cấu trúc · torso có giáp thật · chân đứng có trọng lượng · blade là vũ khí của Mikage · vẫn lạnh tối giản nhưng không "bà sơ robot".

## GHI CHÚ MÂU THUẪN CẦN THEO DÕI (không tự giải)
Prompt combat-frame của operator không nhắc tóc dài/female-coded/skirt (Layer A 06-03). Direction test sẽ cho thấy operator muốn giữ bao nhiêu phần Layer A trong hướng B — KHÔNG tự bỏ Layer A khỏi spec cho tới khi operator phán sau test.

NEXT = operator-run RunPod: chạy RIÊNG job `mikage_p1_imperial` (direction test, 2 seeds) TRƯỚC khi nổ full batch — nhìn ảnh rồi mới chốt A/B/C.
