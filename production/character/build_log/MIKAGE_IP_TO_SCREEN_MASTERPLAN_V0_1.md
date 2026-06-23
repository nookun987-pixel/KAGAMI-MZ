# MIKAGE — IP TO SCREEN · MASTER PLAN V0.1
Lane B (Public Engine) · 2026-06-23 · STATUS: PROPOSAL, chờ BOOS chốt 1 quyết định ở §5

Mục tiêu BOOS: "lôi các mảnh IP ra màn ảnh, hoàn chỉnh càng sớm càng tốt, render."
Đây là việc lớn → inspect + plan + chờ duyệt rồi mới chạy hàng loạt (CLAUDE.md).

---

## 1. CÁC MẢNH IP & TRẠNG THÁI HIỆN TẠI (verified từ repo/memory)
| # | Mảnh IP | Asset khoá | Trạng thái | Lên màn ảnh? |
|---|---------|-----------|-----------|--------------|
| A | Mikage (hero) | MIKAGE_SOLO_*_V0_4 | FOUNDATION shape LOCKED | Teaser PIL ✅ (IP_TEASER_V0_1) |
| B | Cơ giáp mã (steed) | MIKAGE_STEED_SKELETON_BW_V0_5 | SHAPE LOCKED (grayscale) | chưa |
| C | Hero mount (rider+steed) | MIKAGE_HERO_MOUNT_V0_2 | LAYOUT PROOF (rider=proxy) | chưa |
| D | Thế giới (monolith) | MIKAGE_WORLD_MONOLITH_*_V0_1 | candidate | build-log EP02 ✅ (tĩnh) |
| E | 3D blockout | MIKAGE_HERO_MOUNT_EEVEE_V0_1 | Lane A blockout thô, pipeline chạy | chưa public |
| F | 6 nhân vật còn lại | — | chưa thiết kế (roadmap form) | chưa |
| G | Nhạc (16 transmissions) | catalog locked | LIVE (tool-verified) | build-log EP06 ✅ |

Quy tắc giữ nguyên: KHÔNG canon-lock, KHÔNG gọi final/production-ready; violet=signal; helmet 2-slit; không dùng bản key-art có obi (ruling 22/06).

---

## 2. "HOÀN CHỈNH" NGHĨA LÀ GÌ — 2 TẦNG
- **Tầng 1 — STYLIZED MOTION (Lane B, PIL/ffmpeg, làm ĐƯỢC NGAY, không gate):**
  teaser/Canvas-loop dọc 1080×1920 từ asset đã khoá (như IP_TEASER_V0_1). Nhanh, on-brand, dùng để public liền.
- **Tầng 2 — RENDER VẬT LIỆU/3D THẬT (cần runtime ngoài PIL → GATE, cần BOOS duyệt task + chọn pipeline):**
  porcelain/graphite/cold-steel + chiều sâu + chuyển động nhân vật. Đây mới là "hoàn chỉnh" cao cấp.

---

## 3. LANE SPLIT
- **Lane B (em):** stylized motion ngay; đóng gói public; caption/posting; viết drift-check; dựng shotlist/keyframe direction cho Lane A; QC drift vs canon.
- **Lane A (Codex + Blender/runtime):** material lookdev + 3D/animation render thật. Em KHÔNG tự chạy; em viết handoff, BOOS duyệt, Codex chạy.

---

## 4. THỨ TỰ ĐỀ XUẤT (sớm → hoàn chỉnh)
1. **Lane B ngay (không gate):** motion teaser cho B (steed), C (mount), D (world) cùng style A → đủ 1 bộ "IP reel" 4 mảnh ra màn ảnh trong hôm nay.
2. **Gate mở (sau khi BOOS chốt §5):** Lane A render material/3D theo thứ tự A → B → C → D.
3. **Lane B đóng gói:** ghép render thật thành reel hoàn chỉnh + build-log EP04/EP05.
4. Sau khi 1 nhân vật hoàn chỉnh: nhân pipeline ra 6 nhân vật còn lại (F).

---

## 5. QUYẾT ĐỊNH CẦN BOOS CHỐT (mở khoá tầng 2)
**Chọn pipeline "hoàn chỉnh" (render thật):**
- (A) **Lane A 3D — Blender/Eevee (Codex):** pipeline đã chạy (EEVEE_V0_1), kiểm soát hình khối/độ sâu tốt; cần vòng shape-correction + material. Chậm hơn, chắc hơn.
- (B) **fal i2v animated-cinematic + code (Lane B/A phối):** từ key-art đã khoá → chuyển động "animated-cinematic myth" (đúng memory direction); nhanh ra "đẹp", nhưng kiểm soát canon/độ ổn định khó hơn.
- (C) **Hybrid:** Eevee dựng base 3D → i2v/grade phủ điện ảnh lên. Cao cấp nhất, nhiều bước nhất.

Em cần BOOS chọn (A/B/C) + xác nhận cho phép Lane B chạy ngay bộ stylized motion tầng 1 (không gate).
Chốt xong: em viết handoff Codex tầng 2 + chạy tầng 1 song song.

---

## 6. QUYẾT ĐỊNH BOOS (2026-06-23)
- Pipeline tầng 2 = **(A) Lane A 3D — Blender/Eevee (Codex).** fal/i2v KHÔNG dùng đợt này.
- Tầng 1 stylized motion (steed/mount/world) = **TẠM GÁC** — dồn sức vào tầng 2.
- Hành động kế: Lane B viết handoff Codex (`LANEA_CODEX_HANDOFF_IP_TO_SCREEN_V0_1.md`); BOOS duyệt task render đầu tiên (hero A) rồi Codex chạy.
