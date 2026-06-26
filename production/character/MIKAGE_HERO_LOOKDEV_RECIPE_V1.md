# MIKAGE — HERO LOOKDEV RECIPE V1 (the winning recipe)
> Chốt từ phiên 2026-06-26 (helmet HERO V2). Lần sau làm hero MỚI: **bắt đầu từ đây, không bò lại từ đầu.**
> Nguyên tắc gốc: **Blender giữ HÌNH → relight + material → finish 2D → production.** AI chỉ để concept, KHÔNG để "giữ+nâng" form đã lock (nó drift).

## 4 THỨ ĐÃ LOCK (chuẩn "đẹp kiểu Mikage")
1. **FORM** — tall vertical wedge (cao:rộng ≥1.5:1), sọ nặng / hàm thuôn, **facet lớn có chủ đích + chamfer nhất quán** (bắt 1 vệt specular), 2 khe recessed. KHÔNG tròn/trứng/toy. (Helmet V2 hash `c68d2b813f75...`.)
2. **LIGHTING** — 1 key Rembrandt (area, trên-trái, chếch xuống), fill ~0 → ~2/3 khối chìm void; **rim mảnh** tách silhouette; camera 3/4 góc thấp hero; fine grain.
3. **VOID BLACK** — world/background = `#050508` tuyệt đối (KHÔNG xám). Film transparent off. Bỏ cuống cổ (chìm vào void).
4. **SLIT RULE** — dormant = **khe ĐEN** (Mikage ngủ); awakened = **lõi violet `#8F00FF` MẢNH** (~38% chiều cao khe, giảm sáng ~30%), nằm SÂU trong hốc, **chỉ trong khe** (clip vào silhouette). Violet là signal, không bao giờ fill/halo/wash.

## MATERIAL (glazed sacred porcelain — Cycles)
- Vỏ/giáp: base `#f2eeea`; **SSS ~0.2** (Random Walk, radius nhỏ-lạnh); **Coat 1.0 / Coat Rough ~0.08**; base Rough ~0.3 + **noise variation** (đừng để roughness phẳng lì); craquelure micro-bump rất nhẹ.
- Underlayer/graphene/tóc: graphite tối matte. Kiếm slab: kim loại lạnh, cạnh sắc.

## PIPELINE (đúng thứ tự — đừng đảo)
1. **FORM trong Blender** (geometry). Lock form TRƯỚC. Không bao giờ relight một form sai.
2. **RELIGHT trong Blender** (đèn + material ONLY, KHÔNG đụng geometry/rig/pose). → đây là cú nhảy chất thật (đèn 3D ăn theo facet). 2D grade chỉ là nửa bước.
3. **FINISH 2D** trên render (local, không reshape): slit dormant/awakened (composite violet lên CÙNG 1 master dormant → cặp trùng khít pixel cho animation); clean nền (clamp về void + xoá speck **targeted**, KHÔNG remask toàn ảnh); **zoom-verify mép trước khi xong**.
4. **PRODUCTION**: upscale LANCZOS 2x; Canvas 1080×1920 (helmet giữa ~74% bề ngang, pad void, awakening = violet ramp tại chỗ, 6s loop, H264/yuv420p/30fps/no-audio); caption theo build-log standard.

## ANTI-TOY checklist (20% craft quyết định draft → hero)
cao-dọc không tròn · chamfer bắt sáng · facet lớn có chủ đích · chiaroscuro 1 nguồn · void đen · violet chỉ là signal · silhouette sạch · slit recessed gọn.

## RULE quy trình (để KHÔNG bò lại từng bước)
- **Bắt đầu từ hero V2 base, không làm lại từ 0.**
- **Mỗi vòng chỉ sửa 1 NHÓM lỗi**, không đập đi làm lại toàn bộ.
- Review phải chỉ **đúng lỗi + đúng tầng sửa**: hình→Blender geometry · sáng/chất→Blender relight · signal/nền→2D composite. Không "làm đẹp hơn" chung chung.
- Sau mỗi composite/cleanup: **ZOOM mép kiểm tra**; hỏng thì **revert**, retouch local đúng điểm, KHÔNG remask.

## ASSET CHUẨN (V2)
`production/character/keyart_candidates/MIKAGE_HELMET_HERO_V2_DORMANT.png` · `..._AWAKENED.png` · Canvas `MZ_AWAKENING_CANVAS_V2_1080x1920.mp4` · spec đầy đủ ở `MZ_DIVINE_HELMET_ARTDIRECTION.md`.
