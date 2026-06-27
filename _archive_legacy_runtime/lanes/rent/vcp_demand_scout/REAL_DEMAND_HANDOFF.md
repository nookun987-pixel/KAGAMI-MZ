# REAL DEMAND — paste nhu cầu thật (VCP)

- Nguồn: `input_real_demand/` (`.txt`, một file = một paste).
- Lead trong CSV: **4**
- **business_ready=yes**: **0** / 4
- Output: `output_vcp_real_demand_sale_ready.csv`

## Gate (phase 1 — không Facebook / không browser)

- Có keyword **VCP** + `demand_intent_ok` + **PERSONAL_DEMAND** trong text.
- **Loại** nếu khớp `LISTING_OR_AD_CONTEXT` (carousel/listing template).
- Parse + **V4 strict** + `confidence_level_for_real_demand_field` (medium→high chỉ khi cửa sổ có personal).
- **business_ready**: `has_contact` + ≥1 field nhu cầu còn lại sau V4 (không tính `source_title`).

## File bỏ qua (không đạt gate)

- `sample_05_reject_listing_template.txt` — `listing_or_ad_block_present`

## Mẫu (5 dòng đầu)

1. business_ready=no | contact='0912345678' | budget='25–30 triệu/tháng' | bedrooms='2PN'
2. business_ready=no | contact='0987123456' | budget='18 triệu / tháng' | bedrooms='1PN'
3. business_ready=no | contact='0903987654' | budget='' | bedrooms='3PN'
4. business_ready=no | contact='nhu.cau.thue.vcp@example.com' | budget='28 triệu/tháng' | bedrooms='2PN'

---

- **Path nghiệp vụ chính (real renter leads):** xem `PHASE2_SOURCE_INTAKE_HANDOFF.md` (cùng thư mục scout).