# LANE B — FORM UNIFICATION LOCK (PROPOSAL)
Soạn: Lane B (Cowork) · 2026-06-30 · STATUS: DRAFT chờ BOOS authorize (commit = authorize).
Mục đích: chấm dứt tình trạng nhiều "form Mikage" trong repo. Quy mọi bản về 1 master.
Bản đầy đủ (coordinator side) = `Mikage Zenith — Studio OS/MIKAGE_FORM_SSOT_2026-06-30.md`.

## MASTER (chỉ 1)
Mikage canon = **REFERENCE SHEET 2D** (Studio OS `FANDOM_KIT/MIKAGE_CHARACTER_REFERENCE_16x9.png`).
Bất biến: helmet wedge faceless · đúng 2 khe violet (chỉ trong khe) · áo choàng đen dọc ·
Zenith Blade slab thẳng dọc · palette void `#050508` / porcelain `#f2eeea` / violet `#8F00FF`.

## PHÂN LOẠI MỌI BUILD TRONG REPO
- **DRAFT-3D #1 (được tiếp nếu cần 3D):** dòng PRODUCTION-ACTOR —
  `production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_COMPLETION_LOOKDEV_V0_2.blend`
  → `_HERO_FINISH_LOOKDEV_V0_1.blend`. Mesh hash khóa `3914AF…E8DFD`.
- **REFERENCE-ONLY (đóng băng):** RIDER (`MIKAGE_RIDER_HEAD_GRAFT_EEVEE_V0_1.blend`,
  `MIKAGE_RIDER_SOLO_EEVEE_V0_*`) + toàn bộ HERO-MOUNT/STEED line
  (`MIKAGE_HERO_MOUNT_EEVEE_V0_1` … `V1_5`, `_STEED_*`). Không public, không gọi "Mikage".

## LUẬT
1. Chỉ 1 Mikage = MASTER 2D. Mọi build 3D là diễn giải, không phải form riêng.
2. CẤM tạo build mới trừ khi khớp master + ghi vào registry (file SSOT Studio OS).
3. Cần 3D → chỉ tiếp dòng PRODUCTION-ACTOR, drift-check vs master trước khi dùng.
4. Không claim final/canon/production-ready. Chốt canon = chỉ operator.

## ĐỀ XUẤT SỬA SSOT `docs/mikage_character_visual_spec.md` (operator tự sửa)
Thêm mục đầu file:
```
## 0. CANONICAL FORM LOCK
- Mikage canon form = 2D reference sheet (FANDOM_KIT/MIKAGE_CHARACTER_REFERENCE_16x9.png).
- All 3D builds are DRAFT interpretations of this master, not independent forms.
- Active 3D draft line = PRODUCTION-ACTOR (mesh hash 3914AF…E8DFD). RIDER + HERO-MOUNT = reference-only, frozen.
- No new form may be created unless it matches this master and is logged in the form registry.
```

LANE_A_BLENDS_MODIFIED = NO · PUSH_DONE = NO · canon-lock = chỉ operator sau khi đọc.
