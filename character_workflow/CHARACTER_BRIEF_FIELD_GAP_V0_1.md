# CHARACTER_BRIEF_FIELD_GAP_V0_1

Generated: 2026-05-29 (read-only audit)
Scope: 3 nhân vật trong CHARACTER_CAST_LANE đang active — Mikage, Commander Lyre, LORA.
Mode: READ-ONLY. Không sửa bất kỳ brief nào.
Mục đích: liệt kê field/section nào ĐÃ CÓ vs CÒN TRỐNG ở mỗi brief, để operator quyết bổ sung.

## NGUỒN ĐÃ ĐỌC

| Nhân vật | File | Loại |
|---|---|---|
| Mikage | `character_workflow/MIKAGE_CHARACTER_PRODUCTION_BIBLE_V0_1.md` | Production Bible (operational guardrail) |
| Commander Lyre | `character_workflow/COMMANDER_LYRE_CHARACTER_BRIEF_V0_1.md` | Character Brief (formal field-table) |
| Commander Lyre | `character_workflow/COMMANDER_LYRE_VISUAL_SPEC_CLEAN_V0_1.md` | Visual Spec (clean source) |
| LORA | `character_workflow/LORA_ENTITY_RECORD_V0_1.md` | Entity Record (notebook extract, ngắn) |
| LORA | `character_workflow/LORA_VISUAL_BRIEF_V0_1.md` | Visual Brief (formal field-table) |
| LORA | `character_workflow/LORA_VISUAL_SPEC_CLEAN_V0_1.md` | Visual Spec (clean source) |

## CẢNH BÁO QUAN TRỌNG TRƯỚC KHI ĐỌC MATRIX

3 file CÓ CẤU TRÚC KHÁC NHAU:

- **Mikage Production Bible** dùng cấu trúc "operational rule" (HARD RULE → IDENTITY → SILHOUETTE → MATERIAL → HELMET → ARMOR → PROP → POSE → HAIR → TURNAROUND → SCALE → DRIFT CHECKLIST → BASELINE → NEXT TASK). Đây là file **guardrail anti-drift**, không phải brief mô tả.
- **Lyre Character Brief + Visual Spec** dùng cấu trúc "formal character brief" (ROLE → CANON REFS → VISUAL IDENTITY SUMMARY → BODY → HELMET → ARMOR → WEAPON → HAIR → COLOR → ANTI-DRIFT → PRODUCTION READINESS → MISSING ITEMS → NEXT TASK + Psychology / Narrative / Camera / Prompt Seed). Đây là file **mô tả + production-ready spec**.
- **LORA Visual Brief + Visual Spec** dùng cấu trúc tương tự Lyre nhưng giảm các mục cơ thể (vì LORA không có thân thể humanoid).

→ "Field thiếu ở Mikage" KHÔNG hẳn là thiếu thật — có thể là vì Mikage được mô tả ở **file khác** (`MIKAGE_ZENITH_CANON_V2.md`, `MIKAGE_WORLD_CORE.md`, `MIKAGE_CHARACTER_REFERENCE_SHEET_V1_CANON_LOCKED.md`, v.v.) và Production Bible chỉ là guardrail. Operator cần quyết: có muốn **đồng nhất cấu trúc** giữa 3 nhân vật không, hay giữ Mikage ở dạng guardrail-only và để brief mô tả Mikage nằm ở file canon riêng.

Matrix dưới đây chỉ so theo CONTENT có mặt **trong các file character_workflow đã đọc ở pass này**. KHÔNG cross-check nội dung canon V2 và World Core (việc đó là task riêng).

---

## MATRIX TỔNG (field vs nhân vật)

Ký hiệu: ✅ có / ⚠️ một phần (provisional / partial / CHUA_XAC_NHAN trong chính file) / ❌ không có / — không áp dụng.

| # | Field | Mikage (Bible) | Lyre (Brief + Spec) | LORA (Brief + Spec) |
|---|---|---|---|---|
| 1 | Canon name + alias | ⚠️ (tên có trong §1, không có bảng formal) | ✅ §1 brief | ✅ §1 brief |
| 2 | Public role | ❌ không có formal field | ✅ "The Imperial Operative" | ✅ "Root Architect / System Presence" |
| 3 | Entity type | ⚠️ "porcelain executor / ceremonial synthetic warrior" trong §1 | ✅ "Antagonist — fictional humanoid" | ✅ "Non-humanoid system entity" |
| 4 | Allegiance / Faction | ❌ không nêu rõ faction Mikage thuộc về | ✅ "The White Monolith / Empire" | ⚠️ CHUA_XAC_NHAN (explicit) |
| 5 | Function | ⚠️ ngụ ý qua §1 | ✅ "High Inquisitor / Overseer" | ✅ "System-level control / refactor" |
| 6 | Narrative function vs các nhân vật khác | ❌ không có | ✅ "foil and ideological wall against Mikage" | ✅ "system above Lyre, architecture beneath Mikage" |
| 7 | Psychology / Behavior | ❌ không có section | ✅ Spec §11 | ✅ Spec §7 |
| 8 | Ideological position | ❌ không có | ✅ "Empire — order through control" | ✅ "refactor through absolute system law" |
| 9 | Canon Source References (bảng) | ❌ không có | ✅ §2 brief (8 nguồn) | ✅ §2 brief (4 nguồn, ghi rõ "ABSENT" trong Canon V2) |
| 10 | Visual Identity Summary (so sánh với nhân vật khác) | ❌ không có | ✅ §3 brief (bảng 8 axis) | ✅ §3 brief (bảng 8 axis × 3 nhân vật) |
| 11 | Body / Silhouette spec | ⚠️ Bible §2 (silhouette rule, không có height number trong section này) | ✅ §4 brief + §5 spec | — (LORA không có body) |
| 12 | Height | ⚠️ 180 cm provisional (Bible §10) | ⚠️ 188 cm provisional | — N/A (architectural scale) |
| 13 | Head / Helmet geometry | ✅ Bible §4 + §11 drift check | ✅ §5 brief + §3 spec | — (LORA không có helmet) |
| 14 | Armor material stack | ✅ Bible §5 + §3 material rule | ✅ §6 brief + §4 spec | — (LORA dùng motif kiến trúc, không phải armor) |
| 15 | Weapon system | ✅ Bible §6 (Zenith Blade) | ✅ §7 brief + §6 spec (Molecular Monowire / Force-field Lyre) | — N/A (LORA không chiến đấu) |
| 16 | Shield / Barrier interpretation | ❌ không có (Mikage không có shield) | ✅ §7 brief + §7 spec | — N/A |
| 17 | Hair spec | ✅ Bible §8 | ✅ §8 brief + §8 spec (optional) | — N/A |
| 18 | Color palette (bảng có hex) | ⚠️ Bible §3 "white + black + violet" — KHÔNG có hex chính thức trong file này; có `mikage_color_canon.json` ngoài | ✅ §9 brief (bảng 5 màu có hex) | ⚠️ §5 brief — Gold hex CHUA_XAC_NHAN |
| 19 | Negative rules / Anti-drift | ✅ Bible §11 + §1/§2/§3/§4/§5/§7 các forbidden | ✅ §10 brief + §13 spec | ✅ §6 brief + §9 spec |
| 20 | Damage system | ⚠️ ngụ ý qua §11 ("controlled / heavy / deliberate") — không có field rõ | ✅ "Does not fracture" | ✅ "Does not take damage — is the system" |
| 21 | Pose rule | ✅ Bible §7 | ⚠️ chỉ trong Spec §5 silhouette + §11 psychology, không có pose section riêng | — N/A |
| 22 | Turnaround / Production Sheet rule | ✅ Bible §9 | ❌ không có (chưa có turnaround) | ❌ không có (không humanoid) |
| 23 | Scale rule | ✅ Bible §10 (180 cm provisional) | ⚠️ chỉ có height trong §4 brief, không có "scale rule" section | ✅ §5 spec (architectural scale) |
| 24 | Production Readiness Status (bảng) | ❌ không có (Bible chỉ nêu "Asset lock: NO") | ✅ §11 brief (bảng 13 dòng) | ✅ §7 brief (bảng 17 dòng) |
| 25 | Missing Items Still Unresolved (list) | ❌ không có | ✅ §12 brief (5 mục) | ✅ §8 brief (9 mục) |
| 26 | Voice / dialogue profile | ❌ không có | ❌ MISSING (acknowledged §11) | ❌ MISSING (acknowledged §7 readiness) |
| 27 | Camera / Lighting rule | ❌ không có | ✅ Spec §10 | ✅ Spec §6 |
| 28 | Design Philosophy section | ❌ không có | ✅ Spec §2 ("Porcelain Minimalism") | ✅ Spec §2 ("System Presence") |
| 29 | Narrative Conflict Axis | ❌ không có | ✅ Spec §12 | ✅ Spec §8 |
| 30 | Production Prompt Seed | ❌ không có | ✅ Spec §14 | ✅ Spec §10 (KEY_VISUAL_01) |
| 31 | Current Approved Working Baseline | ✅ Bible §12 (reference board + clean body + turnaround + height) | ❌ không có baseline tương đương | ❌ không có baseline tương đương |
| 32 | Drift Checklist (operational) | ✅ Bible §11 (6 mục) | ⚠️ chỉ ở dạng list anti-drift §10 brief, không có "drift check order" như Mikage | ⚠️ tương tự — chỉ anti-drift list |
| 33 | Visual asset hiện có (concept art / portrait riêng) | ✅ có turnaround V2 + clean body candidate + reference board + lineup | ❌ MISSING (acknowledged §11) | ❌ MISSING (acknowledged §7) |
| 34 | 3D model | ✅ có 8 .blend (production actor + proxy + rig derivatives) | ❌ MISSING (acknowledged §11) | ❌ MISSING (acknowledged §7) — và LORA không có body nên không cần model thân thể |
| 35 | Anthropomorphic form decision | ✅ ngụ ý (humanoid female-coded) | ✅ ngụ ý (humanoid) | ⚠️ CHUA_XAC_NHAN — chưa quyết có avatar humanoid hay không |
| 36 | Canon V2 presence | ✅ có (Mikage là main subject) | ⚠️ §8.2 + §7.1/7.2/3.3/10.1/11 (theo §2 brief Lyre) — có nhưng 6 dòng | ❌ ABSENT — LORA có zero presence trong Canon V2 (theo §2 brief LORA) |
| 37 | Next Safe Task | ✅ Bible §13 | ✅ §13 brief (3 step) | ✅ §9 brief (4 step) |

---

## TỔNG KẾT THEO NHÂN VẬT

### MIKAGE

**ĐÃ CÓ trong Bible**: helmet rule, armor rule, weapon (sword) rule, pose rule, hair rule, turnaround rule, scale rule (180 cm provisional), drift checklist, approved working baseline, hard rule + 1 character identity statement, color rule (text only).

**MISSING / KHÔNG CÓ trong Production Bible** (so với cấu trúc Lyre/LORA brief):
1. Canon Source References bảng (Mikage có canon V2 nhưng Bible không liệt kê reference)
2. Visual Identity Summary kiểu bảng so sánh
3. Psychology / Behavior section
4. Narrative function statement (mối quan hệ với Lyre / LORA / The Convergence)
5. Ideological position statement
6. Damage system field (kintsugi fracture được nói trong Lyre brief §3 nhưng KHÔNG có trong Mikage Bible chính)
7. Color palette bảng có hex (file `mikage_color_canon.json` có thể có nhưng KHÔNG được tham chiếu trong Bible — operator nên cross-link)
8. Production Readiness Status bảng
9. Missing Items Unresolved list
10. Voice / dialogue profile
11. Camera / Lighting rule
12. Design Philosophy section ("Kintsugi Fracture" hay tương đương "Porcelain Minimalism" của Lyre)
13. Production Prompt Seed (Mikage chưa có prompt seed canonical)

**Lưu ý**: nhiều mục trong list trên có thể đã nằm ở file Mikage khác (`MIKAGE_ZENITH_CANON_V2.md`, `MIKAGE_WORLD_CORE.md`, character reference sheet "LOCKED" trong `01_CANON_LOCK/`). Pass này KHÔNG mở các file đó để verify — cần task riêng "cross-link Mikage canon sources" nếu operator muốn xác nhận.

### COMMANDER LYRE

**ĐÃ CÓ (rất đầy đủ structurally)**: Role + Canon refs + Visual Identity Summary + Body + Helmet + Armor + Weapon + Shield interpretation + Hair + Color (hex) + Anti-drift + Psychology + Narrative axis + Camera/Lighting + Production Prompt Seed + Production Readiness Status + Missing Items + Next Task.

**MISSING (acknowledged trong file)**:
1. Voice / dialogue profile (§11 readiness MISSING)
2. Any visual concept art (§11 readiness MISSING — "Zero images exist")
3. Any 3D reference / model (§11 readiness MISSING)
4. Official canon height lock (188 cm vẫn provisional)
5. `MIKAGE_CHARACTER_SCALE_LINEUP_V0_3_COMMANDER_LYRE_PATCH_PACKAGE.zip` — đăng ký trong CHARACTER_PACKAGE_REGISTRY nhưng KHÔNG có trên đĩa (theo §12 brief)

**MISSING (gap so với Mikage Bible structure)**:
6. Turnaround / Production Sheet rule (Mikage có §9, Lyre KHÔNG có)
7. Pose rule riêng (Mikage có §7, Lyre chỉ nói posture + body language)
8. Operational Drift Checklist 6-step (Mikage có §11, Lyre chỉ có anti-drift list)
9. Current Approved Working Baseline block (Mikage có §12, Lyre KHÔNG có baseline tương đương)

### LORA

**ĐÃ CÓ**: Role + Canon refs (ghi rõ ABSENT trong Canon V2) + Visual Identity Summary 3-axis + Visual Form Spec (motifs + scale + forbidden) + Color palette (bảng) + Anti-drift + Psychology + Narrative function + Camera/Lighting + KEY_VISUAL_01 Production Prompt Seed + Production Readiness + Missing Items + Next Task + Design Philosophy ("System Presence") + Scale Rule (architectural).

**MISSING (acknowledged trong file)**:
1. ANTHROPOMORPHIC_FORM — chưa quyết có humanoid avatar hay không
2. FACTION assignment — chưa gán Empire / Third Axis / khác
3. Gold hex value — "clean digital gold" là hướng, chưa lock hex
4. Canon V2 entry — LORA hoàn toàn không có trong canon V2 hiện hành
5. PHYSICAL_SERVER_LOCATION — CHUA_XAC_NHAN
6. Voice / dialogue profile
7. Any visual concept art
8. Any 3D reference / model
9. `MIKAGE_LORA_VISUAL_FORM_BRIEF_V0_1_PACKAGE.zip` — đăng ký trong CHARACTER_PACKAGE_REGISTRY nhưng KHÔNG có trên đĩa (theo §8 brief)

**MISSING (theo structure không áp dụng)**: body / helmet / armor / weapon / shield / hair / pose / turnaround — đều — vì LORA non-humanoid theo decision hiện hành.

---

## GAP CHUNG CHO CẢ 3 NHÂN VẬT

1. **Voice / dialogue profile** — KHÔNG nhân vật nào có. Nếu cast lane muốn ra short / MV / film proof có dialogue, đây là missing chung.
2. **Production Prompt Seed cho Mikage** — Lyre có, LORA có, Mikage KHÔNG. Mikage có nhiều ảnh đã có rồi nên không cần prompt seed để gen, nhưng nếu cần prompt-baseline cho consistency cross-tool, đây vẫn là gap.
3. **Cross-character relationship table** — Lyre brief §3 + LORA brief §3 có bảng so 3 nhân vật. Mikage Bible KHÔNG có bảng tương đương. Nếu operator muốn 1 file "source of truth" cho mối quan hệ 3 nhân vật, đây là gap.
4. **Canon Source References cho Mikage** — Lyre §2 và LORA §2 đều liệt kê nguồn canon được dùng để derive brief. Mikage Bible KHÔNG có bảng nguồn → khó audit khi canon update.
5. **Production Readiness Status table cho Mikage** — Lyre §11 và LORA §7 đều có bảng readiness. Mikage Bible chỉ ghi "Asset lock: NO" ở §12 → khó để operator biết Mikage đang ở stage nào của public-readiness.
6. **2 ZIP package đăng ký trong CHARACTER_PACKAGE_REGISTRY nhưng KHÔNG có trên đĩa**:
   - `MIKAGE_CHARACTER_SCALE_LINEUP_V0_3_COMMANDER_LYRE_PATCH_PACKAGE.zip` (đăng ký, file vắng)
   - `MIKAGE_LORA_VISUAL_FORM_BRIEF_V0_1_PACKAGE.zip` (đăng ký, file vắng)
   → registry vs disk mismatch — cần task riêng đọc `CHARACTER_PACKAGE_REGISTRY_2026-05-23.md` để xác nhận toàn bộ. CHUA_XAC_NHAN list đầy đủ ở pass này.

---

## PRIORITY GỢI Ý (operator quyết, không tự thực thi)

1. **(P1 — text only)** Thêm vào Mikage Production Bible: Production Readiness Status table + Canon Source References table + Cross-character relationship table. KHÔNG cần đụng ảnh / 3D.
2. **(P1 — text only)** Quyết ANTHROPOMORPHIC_FORM của LORA: có avatar humanoid hay là pure system-field-only. Đây là blocker để LORA có thể xuất hiện cùng frame với Mikage / Lyre.
3. **(P1 — text only)** Quyết FACTION của LORA (Empire / Third Axis / Above-both). Đây là blocker để LORA có thể được tham chiếu trong canon V2.
4. **(P2 — text only)** Lock canon V2 entry cho Commander Lyre (mở rộng từ 6 dòng) và thêm entry cho LORA — cần operator approve.
5. **(P2 — verification)** Kiểm tra `MIKAGE_CHARACTER_SCALE_LINEUP_V0_3_COMMANDER_LYRE_PATCH_PACKAGE.zip` và `MIKAGE_LORA_VISUAL_FORM_BRIEF_V0_1_PACKAGE.zip` — có thật không, ở đâu, hay đăng ký nhầm.
6. **(P3 — operational)** Tạo voice / dialogue profile cho cả 3 (chỉ cần khi cast lane vào giai đoạn cần audio output).
7. **(P3 — operational)** Tạo Production Prompt Seed cho Mikage để đồng bộ với Lyre + LORA — chỉ làm khi cast lane vào giai đoạn cần prompt baseline cho cross-tool.

KHÔNG ĐỀ XUẤT: render concept Lyre / LORA, tạo turnaround mới, lock asset, lock canon, batch ảnh. Toàn bộ những việc đó vi phạm hard rules trong CLAUDE.md.

---

— END OF FIELD GAP AUDIT V0.1 —
