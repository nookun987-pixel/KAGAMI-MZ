# DEMAND — handoff cho sale (VCP)

- Tổng lead demand: **4**
- HOT / WARM / COLD: **0** / **4** / **0**
- File sale-ready: `output_vcp_demand_sale_ready.csv`
- File đầy đủ (tham chiếu): `output_vcp_demand_leads.csv`

## QC (sale-ready đã validate)

- Lead có contact hợp lệ (SĐT/email): **4** / 4
- Lead có budget hợp lệ: **3** / 4
- Lead có urgency hợp lệ: **1** / 4
- Lead có area hợp lệ (có m²/sqm…): **1** / 4
- Lead có bedrooms (PN): **4** / 4
- **business_ready=yes** (contact + ≥1 chi tiết tin cậy sau V4): **0** / 4

## 10 dòng mẫu đầu (sale-ready, đã sắp HOT → score)

1. **WARM** (score 75) | has_contact — Nhu cầu (thuê) | 2PN | Park 5 | 25–30 triệu/tháng | có SĐT/email
   - `real_demand:sample_01_personal_2pn_budget_zalo.txt` | Liên hệ: 0912345678
2. **WARM** (score 75) | has_contact — Nhu cầu (thuê) | 1PN | Landmark 81 | 18 triệu / tháng | có SĐT/email
   - `real_demand:sample_02_tim_thue_landmark_studio.txt` | Liên hệ: 0987123456
3. **WARM** (score 75) | has_contact — Nhu cầu (thuê) | 3PN | Park 3 | 100 m2 | gấp | có SĐT/email
   - `real_demand:sample_03_can_thue_gap_park3_dientich.txt` | Liên hệ: 0903987654
4. **WARM** (score 75) | has_contact — Nhu cầu (thuê) | 2PN | Central 2 | 28 triệu/tháng | có SĐT/email
   - `real_demand:sample_04_toi_can_thue_central2_email.txt` | Liên hệ: nhu.cau.thue.vcp@example.com

## QC field confidence (V4 strict)

Export sale-ready đã qua **V4 strict**: mọi field không đạt **confidence=high** bị để trống (kể cả area / urgency / move-in / tower / unit / apartment_type). Cột **business_ready**: `yes` chỉ khi có contact hợp lệ và còn ít nhất một chi tiết tin cậy.

- Gợi ý rule tiếp (field yếu nhất): Không có field business nào bị gắn low trên toàn bộ lead hiện tại.

- 1. Đáng tin: budget, bedrooms, price_text_raw | Chưa đáng tin: —
- 2. Đáng tin: budget, bedrooms, price_text_raw | Chưa đáng tin: —
- 3. Đáng tin: bedrooms | Chưa đáng tin: —
- 4. Đáng tin: budget, bedrooms, price_text_raw | Chưa đáng tin: —
