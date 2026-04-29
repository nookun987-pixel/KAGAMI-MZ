# Phase 2 — Source intake handoff (real renter leads)

## Trạng thái

- **Luồng nghiệp vụ chính (primary business path)** cho lead *người đi thuê thật* là **`input_real_demand/` → `output_vcp_real_demand_sale_ready.csv`**, với QC **V4 strict** và cột **`business_ready`**.
- **Không** mở rộng parser hay heuristic mới trong phase này; **không** Facebook automation, **không** browser automation, **không** chỉnh UI.
- Nguồn listing/HTML (`input_links.txt`, `input_raw/` …) vẫn có thể chạy song song khi cần tham chiếu, nhưng **không** là nguồn tin cậy cho “gọi sale ngay” như paste nhu cầu cá nhân.

## Operator làm gì

1. Paste bài / comment / tin nhắn thuê vào **một file `.txt` / một paste** trong `input_real_demand/`.
2. Chạy batch: **`RUN_REAL_DEMAND_BATCH.bat`** hoặc `python run_vcp_rent_scout.py --real-demand-only`.
3. Đọc **`REAL_DEMAND_HANDOFF.md`** và làm việc trên **`output_vcp_real_demand_sale_ready.csv`**.

Chi tiết: `input_real_demand/README_OPERATOR.md` và `input_real_demand/_FORMAT.txt`.

## Bước tiếp (sau Phase 2)

Khi intake ổn định và CSV đạt tin cậy nghiệp vụ, mới nối nguồn ngoài (Facebook group API/export, webhook, v.v.) — vẫn đổi ra **cùng định dạng `.txt` drop-in** trước khi nghĩ automation trình duyệt.

## File đầu ra “chính”

| Output | Ý nghĩa |
|--------|---------|
| `output_vcp_real_demand_sale_ready.csv` | Lead sale-ready từ renter-intent paste |
| `REAL_DEMAND_HANDOFF.md` | Báo cáo batch + file bị gate |

---

*Cập nhật: Phase 2 intake — real-demand-first.*
