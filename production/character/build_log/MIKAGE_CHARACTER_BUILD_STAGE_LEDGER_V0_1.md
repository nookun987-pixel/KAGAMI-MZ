# MIKAGE — CHARACTER BUILD STAGE LEDGER (V0.1)
Soạn: Lane B (Cowork) · 2026-07-01 · STATUS: PROTOTYPE / NOT CANON-LOCKED · reference index, KHÔNG phải film.
Mục đích: gom lại các giai đoạn xây Mikage (helmet + thân) theo thứ tự, làm nguồn cho video build-log
sau này (dựng theo `00_BUILD_LOG_STANDARD.md` §6 — GATHER_REEL, PORCELAIN ASCENSION từ 0:00).
Dates = mtime của proof (xấp xỉ). Trạng thái ghi trung thực; chưa cái nào canon-lock/final.

---

## BẮC ĐẨU: 2D MASTER = nguồn chân lý
- `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png` (sha256 b86f68…06429) — mọi giai đoạn phải khớp cái này.
- Luật hình: faceless porcelain · ĐÚNG 2 khe ngang · void `#050508` / porcelain `#f2eeea` / violet `#8F00FF` chỉ ở khe.

## PHA 0 — Khớp 3D vào master
| Stage | Ngày | Làm gì | Trạng thái |
|---|---|---|---|
| MATCH_3D_TO_MASTER V0.1 | 06-30 | Kéo bản 3D về đúng 2D master | proof có · CANDIDATE |
| MICRO_GEOMETRY_CORRECTION V0.2 | ~06-30 | Sửa vi hình sau match | proof có · CANDIDATE |
| PUBLIC_TARGET_BLOCKING V0.1→V0.3 | ~06 | Blockout hình khối public target | V0.3 freeze record có |

## PHA 1 — Hình học HELMET (đầu)
| Stage | Ngày | Làm gì | Trạng thái |
|---|---|---|---|
| HELMET_HEAD_LOOKDEV V0.1 | 06-26 | Lookdev đầu helmet lần đầu | proof có |
| HELMET_ONLY_GEOMETRY_PASS V0.3 | 06-30 | Cô lập helmet, pass hình học | proof có |
| HELMET_REBUILD_FROM_BLOCKING V0.4 | 06-30 | Dựng lại helmet từ blocking | proof có · drift-check Lane B |
| HELMET_PROPORTION_REFINE V0.5 | 06-30 | Nắn tỉ lệ | proof có · drift-check Lane B |
| HELMET_CONTROLLED_SUBDIV V0.6 | 06-30 | Subdiv có kiểm soát (để lại visor/crown-step) | proof có · drift-check Lane B |
| **HELMET_SURFACE_CONTROL V0.7** | 06-30 | Catmull–Clark + support cage → **dọn visor nhô + crown gợn bậc**; tỉ lệ/jaw/slit giữ | **CANDIDATE PASS** · drift-check PASS |
| HELMET_CROWN_LIGHTROT_DIAG V0.7 | 07-01 | Xoay đèn 4 góc → dải sáng chạy theo đèn = geometry SẠCH | **PASS** · commit a044931 |
→ **V0.7 = CONFIRMED geometry base của đầu.** Không nắn helmet thêm.

## PHA 2 — Lookdev HELMET (chất liệu + đèn)
| Stage | Ngày | Làm gì | Trạng thái |
|---|---|---|---|
| **HERO_LOOKDEV_PREMIUM V0.8** | 07-01 | Stage A clay validate (face-plane liền) → Stage B porcelain premium (semi-matte glazed, halo trắng tiết chế, 2 khe violet, void 1-key Rembrandt) | **CANDIDATE** · verify PASS · commit 82d1fa2 · cờ: soi lại màu khe `#8F00FF` |

## PHA 3 — Hình học THÂN (áo choàng)
| Stage | Ngày | Làm gì | Trạng thái |
|---|---|---|---|
| BODY_FORM_DEBLOCKOUT V0.9 | 07-01 | Cone proxy → áo choàng cao-dọc, đáy thẳng (không loe) | PASS scope · **ruling = FORM HOLD** (đọc như "chuông latex", folds yếu) → dùng làm technical base |
| **BODY_CLOAK_STRUCTURE V0.10** | 07-01 | Hạ phồng vai · 4 primary folds bất đối xứng · thêm depth trước–sau · đáy nặng | **PASS thật** (dispatch #18) · **ruling = FREEZE body geometry ở V0.10** |

## PHA 4 — Lookdev THÂN (chất liệu)
| Stage | Ngày | Làm gì | Trạng thái |
|---|---|---|---|
| **BODY_LOOKDEV_MATTE V0.11** | 07-01 | Material tune thân → graphite matte / vải nặng, khử specular (latex); geometry V0.10 + helmet/blade/camera/đèn khoá | **ĐANG CHẠY** (dispatch #19, exception #28) |

## LANE SONG SONG (không thuộc line này)
- HERO_MOUNT (rider + steed) V0.1→V1.5: nhánh nhân-mã cưỡi + motion/gait riêng, kho `reviews/MIKAGE_HERO_MOUNT_*`. Không trộn vào line character actor ở trên.

---

## CÒN LẠI ĐỂ "HOÀN CHỈNH" (rồi mới dựng video)
1. Chốt form THÂN (sau V0.10 — hoặc vòng nữa nếu cần).
2. Lookdev toàn thân (refresh material thân cho ra vải nặng, không latex).
3. (Tùy chọn) awakening/motion pass — bước cuối.
4. **VIDEO BUILD-LOG:** dựng theo `00_BUILD_LOG_STANDARD.md` §6 — GATHER_REEL, PORCELAIN ASCENSION từ 0:00,
   chapter titles Cinzel, từng pha ở trên = 1 chương, kết signature `— MIKAGE ZENITH`. PROTOTYPE / NOT CANON-LOCKED.

## GHI CHÚ TRUNG THỰC
- Ngày = mtime proof, không phải commit-date chính xác → coi là xấp xỉ.
- Version helmet không chạy tuyến tính 1→7 (V0.1 head-lookdev là nhánh sớm; V0.2 = micro-geo). Ledger sắp theo THỨ TỰ BUILD, không phải số.
- Chưa stage nào canon-lock/asset-lock/final. Tất cả CANDIDATE tới khi operator ra ruling.
