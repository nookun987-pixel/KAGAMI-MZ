# VCP_RENT_DEMAND — real source test

## Metrics

- URL sources attempted: **12**
- URL reachable (HTTP OK, body ≥500B): **10**
- URL blocked (HTTP 401/403/429/451): **1**
- URL failed / empty / short: **1**
- Local raw files (non-`_` prefix): **0**
- Total pipeline sources scanned: **17**
- Supply leads: **6** (H/W/C: 6/0/0)
- Demand leads: **4** (H/W/C: 0/4/0)
- Tổng dòng lead (supply+demand): **10**

## Kết luận (V1)

- **Pipeline:** Có thể chạy trên nguồn HTML công khai (trang môi giới/tin) và sinh lead có cấu trúc.
- **Nguồn ổn nhất cho lane VCP:** Các site **môi giới / aggregators** (HTML dài, đủ keyword `Vinhomes Central Park`, `cho thuê` / `tìm thuê`, giá `triệu/tháng`, SĐT) — ví dụ nhóm trang tương tự giakhanhland, chothuecanhocaocap, batdongsan **tin tức**.
- **Tiếp tục lane VCP:** Nên — với điều kiện ưu tiên **URL đọc được** + bổ sung **input_raw** khi MXH chặn bot.

- Supply CSV: `D:\KAGAMI-MZ\lanes\rent\vcp_demand_scout\output_vcp_supply_leads.csv`
- Demand CSV: `D:\KAGAMI-MZ\lanes\rent\vcp_demand_scout\output_vcp_demand_leads.csv`
