# HERO MOUNT V0.2 — LAYOUT / INTEGRATION PROOF (honest tier)
Date 2026-06-22. Sau 2 vòng GPT review hero-mount.

## TẦNG ĐÚNG (không gọi sai)
- **ĐẠT**: layout/integration proof — vị trí rider, tỉ lệ rider↔mount, vị trí blade, điểm ngồi, hướng chân, bố cục ngang, CG 2D tĩnh sơ bộ nằm trong vùng đỡ trước–sau.
- **CHƯA**: material candidate · final key-art.
- **THÀNH THẬT**: rider trong composite là **PROXY vẽ lại bằng PIL vector**, KHÔNG phải asset Mikage V0.4 ghép nguyên. Nên các đặc điểm V0.4 (pauldron, graphite layering, tóc khối nặng, 2 chân ôm chassis, đốt bụng) đọc chưa đủ. Đây là giới hạn của tầng PIL phẳng, không phải shape sai.

## TRẠNG THÁI LOCK (giữ nguyên)
- Mikage **V0.4** = FOUNDATION shape LOCKED (MIKAGE_SOLO_*_V0_4.png).
- Cơ giáp mã **V0.5** = SHAPE LOCKED (MIKAGE_STEED_SKELETON_BW_V0_5.png).
- Hero Mount **V0.2** = LAYOUT PROOF (placement reference only).

## HANDOFF — lần render vật liệu thật (KHÔNG làm bằng PIL nữa)
Khi nâng lên material/final, BẮT BUỘC:
1. Dùng **Mikage V0.4 nguyên silhouette** + **Steed V0.5 nguyên shape** làm reference khoá. KHÔNG redesign đầu/thân/chân/docking/blade.
2. Dùng `MIKAGE_HERO_MOUNT_V0_2.png` CHỈ làm bản hướng dẫn placement (side-view khoá).
3. Material pass thật: porcelain (sáng mờ, phản xạ mềm) vs graphite (tối, ít phản) vs kim loại steed (cạnh lạnh) phải tách 3 vật liệu; tóc thành khối; contact shadow; rim-light đầu/tóc/withers/croup.
4. Grayscale material test TRƯỚC; chỉ bật violet (slit + sensor mã + móng, đúng mức hiện tại) SAU khi khối khớp.
5. Việc này cần **runtime render khác PIL** (image/3D) → cần BOOS duyệt đúng task runtime (ngoài tầng hiện tại; theo CLAUDE.md không tự ý dùng).

## WATCHLIST mang theo
Rider có thể +5–8% (giữ helmet không chibi) · pose tĩnh (bản phi để sau) · stance width + tải blade chỉ chứng minh được ở 3D.
