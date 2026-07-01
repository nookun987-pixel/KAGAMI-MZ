# LANE A / CODEX TASK BRIEF — MIKAGE STANDING HERO POLISH V0.14 (LIGHTING / CAMERA + SLIT-HUE)
Soạn: Lane B (Cowork) · 2026-07-01 · STATUS: DRAFT — KHÓA tới khi BOOS mở exception #31.
Governed by AGENTS.md "Thirty-first controlled exception" (MIKAGE_STANDING_HERO_POLISH_V0_14).

> V0.13 hero polish = kỹ thuật PASS nhưng operator ruling = KHÔNG lock. 3 cờ còn lại:
> (1) **khe ra HỒNG/MAGENTA, không phải violet #8F00FF** (fail canon — cờ số 1),
> (2) **Zenith Blade đọc như tấm panel tách rời**, gần chìm vào void,
> (3) **cloak phẳng lì, chưa tách hẳn khỏi void**.
> Task này = polish 1 vòng, scope KHÓA CHẶT: **CAMERA + ĐÈN**, cộng **1 khe hẹp material = chỉ đổi HUE emission 2 khe**.
> KHÔNG đổi geometry. KHÔNG dời/xoay object nào (kể cả blade). KHÔNG đổi material khác ngoài hue 2 khe. CANDIDATE. Xong DỪNG.

## SOURCE OF TRUTH
- Master: production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png (sha256 b86f68…06429).
- Recipe: production/character/MIKAGE_HERO_LOOKDEV_RECIPE_V1.md · design_system/mikage-cine-color-contract.md.
- Violet LOCK: electric violet **#8F00FF** (secondary #7B2FFF). Violet = SIGNAL, chỉ ở 2 khe. Magenta/hồng = FAIL.

## INPUT (base — CHỈ cái này)
- production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_13.blend
  Báo BASE_SELECTED + BODY_HASH_BEFORE + BODY_HASH_AFTER (phải KHÔNG đổi).
- Lý do dùng V0.13 làm base (không phải V0.12): giữ nguyên toàn bộ camera/đèn đã cải thiện ở V0.13, chỉ thêm 3 fix.
- CẤM: bản cũ hơn / RIDER / HERO-MOUNT / STEED / FIGURE_V0.4; không import scene.

## LOCKED (KHÔNG đổi)
- TOÀN BỘ mesh geometry (đầu + thân + blade) — BODY_HASH / mesh-state hash unchanged vs V0.13.
- **Transform mọi object KHÔNG đổi** — không dời/không xoay/không scale bất kỳ mesh nào, KỂ CẢ BLADE.
  (blade xử bằng GÓC CAMERA + RIM ĐÈN, tuyệt đối không đụng transform.)
- Material: helmet porcelain · thân matte graphite · blade · halo — **hash KHÔNG đổi**.
- Halo: KHÔNG làm sáng hơn V0.13.

## ĐƯỢC LÀM (camera + đèn + 1 khe hẹp material)
1. **KHE — bắt buộc (cờ số 1):**
   - Đặt emission 2 khe về **chính xác #8F00FF** (linearize đúng, đừng nhập sRGB thẳng vào linear socket → lệch hue).
   - Nếu **bloom/glare** kéo hue sang hồng: **giảm bloom threshold/intensity** trên khe (bloom là compositor/đèn, không phải geometry).
   - Đây là **khe material DUY NHẤT được đổi**, và **chỉ hue + emission strength của 2 khe**. Không đổi node nào khác, không đổi material khác.
   - **CHỈ đúng hai khe được phép có violet.** Không thêm violet ở đâu khác.
2. **ZENITH BLADE — bắt buộc (cờ số 2):**
   - **KHÔNG dời / xoay / scale blade.**
   - Thêm **1 cold edge rim rất mảnh** dọc MỘT cạnh blade để nó đọc là vật thể (đèn rim, không phải material, không phải glow).
   - Chỉnh **camera nhẹ** (góc + khoảng cách) để blade **chạm / giao rõ với silhouette thân** — không còn là phiến trôi tách rời.
   - Blade vẫn **gần đen**, KHÔNG biến thành kiếm phát sáng, KHÔNG thêm violet lên blade.
3. **CLOAK — xử cùng vòng (cờ số 3):**
   - 1 dải **rim / bounce lạnh cực yếu** để hiện **vai · cạnh thân · đáy cloak** — đọc được KHỐI.
   - KHÔNG thêm nếp vải giả, KHÔNG sửa mesh, KHÔNG đổi material cloak. Mục tiêu = đọc khối, KHÔNG phải làm áo chi tiết hơn.
   - Vẫn **monolithic** — tách khỏi void nhưng không vỡ thành nhiều mảng.
4. Fine grain giữ. Full-body vẫn thấy trọn. Single-key void mood giữ.

## VERIFY KHE (bắt buộc — pixel sample, KHÔNG chỉ node value)
- Sau render, **lấy pixel sample vùng 2 khe** trên PNG hero + contact sheet.
- Báo giá trị hex/RGB trung bình mẫu được. PASS nếu đọc **violet (blue > red hoặc blue ≈ red, không phải red > blue rõ)** và gần #8F00FF trong dung sai hợp lý.
- FAIL nếu mẫu vẫn ngả magenta/hồng (red trội) → PASS_FAIL=FAIL, BLOCKER=SLIT_HUE_FAIL, đừng lock.

## SUCCESS TEST
- Khe đọc **đúng violet, không magenta** (xác nhận bằng pixel sample).
- Blade đọc ngay là **vũ khí đi cùng Mikage** (rim + camera), không còn panel trôi.
- Cloak **tách khỏi void** nhưng vẫn monolithic.
- **Không drift khỏi V0.13**: geometry + transform + mọi material NGOÀI hue-khe = y hệt V0.13 (hash).
- Vẫn faceless porcelain + graphite cloak + 2 khe violet + halo trắng, void, single-key.

## RÀNG BUỘC / CẤM
- KHÔNG đổi geometry. KHÔNG đổi/ dời / xoay / scale transform bất kỳ object nào (kể cả blade).
- KHÔNG đổi material nào khác ngoài **hue + emission strength của 2 khe**. Xác nhận: helmet/body/blade/halo material hash UNCHANGED; chỉ slit-emission material CHANGED (ghi rõ before/after, chỉ hue).
- KHÔNG thêm violet ngoài 2 khe. KHÔNG làm halo sáng hơn. KHÔNG blade phát sáng.
- KHÔNG neon / warm / color wash; giữ single-key void mood; rim lạnh, trong palette.
- Dọn .blend1. KHÔNG overwrite base V0.13. KHÔNG push / lock / canon. Nhãn CANDIDATE / NOT CANON-LOCKED.

## OUTPUT (candidate)
- production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_14.blend
- production/character/reviews/MIKAGE_STANDING_HERO_POLISH_V0_14_HERO.png (hero 3/4 full-body money-shot, bản polish)
- production/character/reviews/MIKAGE_STANDING_HERO_POLISH_V0_14_CONTACT_SHEET.png (hero · front · so vs V0.13)
- production/character/reviews/MIKAGE_STANDING_HERO_POLISH_V0_14_PROOF.md + RESULT block (kèm SLIT_HUE_PIXEL_SAMPLE)
- Gate CONTACT_SHEET_ONLY: _tmp/mikage_standing_hero_polish_v0_14_gate/ CHỈ chứa contact_sheet.png + contact_sheet_review_report.md.

## FAIL
- Đổi geometry / transform / material-ngoài-hue-khe (hash drift) → PASS_FAIL=FAIL, BLOCKER=HERO_POLISH_DRIFT, liệt kê; revert V0.13.
- Khe vẫn magenta sau fix → PASS_FAIL=FAIL, BLOCKER=SLIT_HUE_FAIL.
- **Nếu blade VẪN đọc như panel dù đã rim + chỉnh camera** → **DỪNG polish, BÁO** (BLOCKER=BLADE_READS_PANEL). ĐỪNG lén dời blade.
  Operator sẽ mở riêng 1 vòng COMPOSITION (V0.15) có quyền đổi blade transform. Không dời mesh trong task này.

→ Stop sau proof. Lane B drift-check (khe đúng violet? blade đọc gắn? cloak tách khối? không drift V0.13?) → BOOS ruling.
  PASS + operator approve → hero V0.14 thay V0.13 làm money-shot cho video build-log (bước A).
