# VCP_RENT_DEMAND_SCOUT_V1 — intake nhanh

## Path chính (real renter leads) — Phase 2

**Nguồn nghiệp vụ ưu tiên:** paste nhu cầu thật vào **`input_real_demand/*.txt`**, chạy **`RUN_REAL_DEMAND_BATCH.bat`** (hoặc `python run_vcp_rent_scout.py --real-demand-only`).  
Đầu ra sale: **`output_vcp_real_demand_sale_ready.csv`** + **`REAL_DEMAND_HANDOFF.md`**.

- Định dạng file: `input_real_demand/_FORMAT.txt`
- Hướng dẫn operator: `input_real_demand/README_OPERATOR.md`
- Handoff chiến lược: **`PHASE2_SOURCE_INTAKE_HANDOFF.md`**

---

## Legacy: operator listing / URL (4 bước)

1. Copy bài / HTML **từ trang tin** vào `input_raw/` hoặc dùng `input_links.txt` (tên file **không** bắt đầu `_` nếu muốn runner đọc).
2. Có thể thêm dòng đầu `SOURCE: <url>` để trace.
3. Chạy: `python run_vcp_rent_scout.py` (full pipeline: URL + raw + real-demand folder).
4. Tham chiếu: `output_vcp_demand_leads.csv`, `output_vcp_supply_leads.csv` — **không** thay thế CSV real-demand cho lead “gọi ngay” từ paste cá nhân.

Mẫu trống: `input_raw/_PASTE_REAL_DEMAND_HERE.txt.example` — copy thành file mới rồi điền (prefix `_` = mẫu, runner **không** quét).

## Chuẩn bị kỹ thuật

- Python 3.9+ và `requests` (`pip install requests`).

## Đầu vào thêm (tùy)

- `input_links.txt` — URL công khai (mỗi dòng một link, `#` là comment).
- `input_raw/*.txt` — paste thủ công khi MXH chặn bot.

## Đầu ra

| File | Nội dung |
|------|----------|
| **`output_vcp_real_demand_sale_ready.csv`** | **Chính** — demand paste thật, QC V4, `business_ready` |
| **`REAL_DEMAND_HANDOFF.md`** | Tóm tắt batch real-demand + file bị gate |
| `output_vcp_demand_sale_ready.csv` | Sale-ready từ pipeline listing (tham chiếu) |
| `output_vcp_demand_leads.csv` | Lead demand đầy đủ (listing / URL / raw) |
| `output_vcp_supply_leads.csv` | Lead supply (cho thuê / listing) |
| `VCP_RENT_SELF_CHECK_REPORT.md` | Tóm tắt chạy |
| `VCP_REAL_SOURCE_TEST_REPORT.md` | Thống kê URL vs file local |

Chi tiết rule lane & keyword: `profile_VCP_RENT_DEMAND.json`. Hướng dẫn paste cho sale: `OPERATOR_INTAKE_NOTE.md`.
