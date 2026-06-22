# LANE A — BLENDER HANDOFF BRIEF · Mikage Hero Mount
FROM: Lane B (public engine) · FOR: Codex / Lane A (Blender · rig · Eevee) · 2026-06-22 · Operator: BOOS BỚP
> Đây là REQUEST + spec từ Lane B. Lane A SỞ HỮU khâu thực thi (model/rig/material/render). Brief này KHÔNG ghi đè
> `00_LATEST_CODEX_HANDOFF.md` — operator quyết định khi nào giao cho Codex.

## 0. MỤC TIÊU
Render **1 tấm hero key-art tĩnh**: Mikage (kỵ sĩ) cưỡi **cơ giáp mã**, side-view, **Eevee**, dựng từ **blueprint Lane B đã khóa**.
Output = bản material chất lượng để (a) làm key-art công khai, (b) seed **Build Log 02**.

## 1. RÀNG BUỘC CỨNG (do-not)
- **KHÔNG dùng lại** rig `production_actor` / `proxy_actor` `.blend` cũ — **operator không ưng**. Dựng **MỚI** từ blueprint V0.4/V0.5.
- **KHÔNG redesign** shape đã khóa: helmet sứ trần **đúng 2 slit** (không 3) · giáp trắng góc cạnh + lót đen · **tóc đen dài** khối riêng · **mantle = accent** (KHÔNG hood, KHÔNG obi) · **Zenith Blade = slab chữ nhật** (không katana) cầm/cắm có cấu trúc · chassis mã theo V0.5.
- **Khóa side-view + camera** theo layout V0.2.
- **Grayscale material test TRƯỚC**; bật violet SAU khi khối đọc đúng.
- **Violet = signal only**: 2 slit rider + sensor đầu mã + điểm móng rất tiết chế. KHÔNG fill/wash.
- **Palette LOCK**: void `#050508` · porcelain `#f2eeea` · violet `#8F00FF` (phụ `#7B2FFF`).

## 2. INPUT (đều ở `D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\keyart_candidates\`)
- Blueprint nhân vật (front): `MIKAGE_SOLO_BW_V0_4.png` (+ `..._VIOLET_V0_4.png` ref accent)
- Blueprint mã (side): `MIKAGE_STEED_SKELETON_BW_V0_5.png`
- Layout/camera (CHỈ placement, KHÔNG mesh): `MIKAGE_HERO_MOUNT_V0_2.png`
- Luật bám: `MIKAGE_FOUNDATION_LOCK_V0_4.md` · `MECH_STEED_SHAPE_LOCK_V0_5.md` · `OPERATOR_RULINGS_2026-06-22.md` · `HERO_MOUNT_V0_2_LAYOUT_PROOF.md` · `MIKAGE_DESIGN_BRIEF_V0_1.md`

## 3. BUILD (gợi ý)
1. Import V0.4 (front) + V0.5 (side) làm **reference plane** ortho.
2. Model **Mikage** từ V0.4 (helmet · giáp + lót · tóc khối · mantle accent · slab).
3. Model **cơ giáp mã** geometry MỚI từ V0.5 (chassis liền · cổ+đầu sensor · 4 chân khớp+piston · docking plate).
4. Pose rider ngồi trên docking plate theo V0.2; check CG nằm trong vùng đỡ.
5. Camera khớp khung side V0.2.
6. **Material 3 chất tách bạch**: porcelain (diffuse mềm, hơi sheen/SSS) · graphite (tối, matte) · kim loại mã (spec thấp, cạnh lạnh).
7. **Lighting**: low-key, 1 key lạnh + rim mảnh (đầu/tóc/withers/croup). Eevee: AO + soft shadow + bloom CHỈ trên violet.
8. Clay/grayscale lookdev → review → bật emissive violet (slit/sensor/móng).

## 4. OUTPUT
- 1 hero still PNG ≥ **2560×1440** + 1 crop **1080×1350** cho build log.
- 1 **clay/grayscale** render (cho slide before/after của Build Log 02).
- Lưu `production/character/renders/`, tên `MIKAGE_HERO_MOUNT_EEVEE_V0_1`.

## 5. ACCEPTANCE GATE
Thumbnail nhỏ đọc ngay: **kỵ sĩ sứ vô diện (2 slit) + giáp + tóc dài + slab blade**, NGỒI trên **mã cơ khí 4 chân có trọng lượng**, thành **một đơn vị**. Không monk · blade là vũ khí không phải cột · 3 vật liệu tách · violet tiết chế. Lệch → quay về V0.4/V0.5, KHÔNG ứng biến.

## 6. TRẢ VỀ LANE B
Giao lại **final render + clay** → Lane B dựng **Build Log 02** ("blueprint → render") + web card + short teaser. Đúng nhịp 2-đầu-ra.
