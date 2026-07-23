# MIKAGE ZENITH BLADE V0.12 — CURRENT STATUS

STATUS: CANDIDATE_ONLY  
CANON_LOCK: NO  
ASSET_LOCK: NO  
PRODUCTION_READY: NO  
STATUS_BASELINE: V0.12  
ARTIFACT_COMMIT: `1601620`  
RECORD_DATE: 2026-07-24

## 1. Mục đích

Chốt đúng trạng thái hiện hành của Zenith Blade để tránh gọi nhầm V0.12 là
asset hoàn thiện.

Tài liệu này là bản ghi trạng thái candidate. Nó không phải SSOT, không tạo
canon-lock, asset-lock hoặc production-ready claim.

## 2. Baseline hiện hành

Phiên bản hiện tại:

- `V0.12 candidate`

File Blender:

- `production/character/MIKAGE_HERO_MOUNT_BLADE_HEAD_EEVEE_V0_12.blend`

Proof và review:

- `production/character/reviews/MIKAGE_HERO_MOUNT_BLADE_HEAD_EEVEE_V0_12_PROOF.md`
- `production/character/reviews/MIKAGE_HERO_MOUNT_BLADE_HEAD_EEVEE_V0_12_CONTACT_SHEET.png`
- `production/character/keyart_candidates/MIKAGE_HERO_MOUNT_BLADE_HEAD_V0_12_DRIFT_CHECK.md`

## 3. Phần đã đạt ở V0.12

- Silhouette tổng thể của Blade trong hero-mount composition.
- Vị trí dọc sát hông.
- Quan hệ gauntlet–grip.
- Holster/docking đỡ đáy.
- Blade không còn che đầu steed.
- Không còn lỗi đọc hình như “khối hộp bay ngang”.
- Lane B drift-check ghi nhận mục Zenith Blade grip là “NẮN ĐẠT”.

V0.12 vì vậy được dùng làm geometry/integration baseline cho các pass tiếp
theo.

## 4. Phần chưa xác nhận hoặc chưa hoàn thiện

- Chưa canon-lock.
- Chưa asset-lock.
- Chưa production-ready.
- Chưa hoàn thiện cơ cấu Blade ở cấp hero detail.
- Chưa hoàn thiện vật liệu và bề mặt.
- Chưa có hero close-up đủ để xét chi tiết.
- Chưa hoàn thiện biểu hiện theo phase ở cấp lookdev/render.

## 5. Ruling về phạm vi V0.12

V0.12 là pass khóa hình khối và cách gắn Blade lên hero mount. Đây chưa phải
pass thiết kế Zenith Blade độc lập ở cấp production.

Không được dùng trạng thái “NẮN ĐẠT” của silhouette để suy ra rằng toàn bộ
Blade đã được duyệt canon, khóa asset hoặc sẵn sàng production.

## 6. Bước kế tiếp đề xuất

Mở một pass riêng:

`ZENITH_BLADE_HERO_DETAIL_LOOKDEV`

Pass này phải:

- Giữ nguyên silhouette, vị trí, grip và holster/docking của V0.12.
- Chỉ phát triển cơ cấu, vật liệu, bề mặt và biểu hiện phase theo SSOT.
- Không tự thêm cơ chế hoặc ngôn ngữ hình ảnh ngoài canon.
- Tạo candidate để operator review; không tự động tạo canon-lock.

Các gate `canon-lock`, `asset-lock` và `production-ready` là những quyết định
riêng, không tự động đạt sau lookdev.

## 7. Failback

Nếu lookdev làm lệch silhouette hoặc phá quan hệ grip/holster:

1. Quay lại V0.12 làm geometry baseline.
2. Loại bỏ phần drift.
3. Chỉ chỉnh chi tiết thứ cấp trong phạm vi được duyệt.
4. Không sửa bù bằng cách thay đổi silhouette, grip hoặc holster baseline.

## 8. Kết luận

`ZENITH BLADE V0.12 = GEOMETRY/INTEGRATION BASELINE CANDIDATE`

Đã đạt hình khối và cách gắn trên hero mount; chưa phải Zenith Blade asset
hoàn thiện.
