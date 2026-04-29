# VCP scout — báo cáo tự kiểm (SUPPLY vs DEMAND)

- Profile: `VCP_RENT_DEMAND` — OK: True
- Số keyword đã nạp: 15
- Số nguồn đã quét (URL + file local): 17

## Supply (nguồn hàng / cho thuê)
- Lead giữ: **6** — HOT/WARM/COLD: 6/0/0
- CSV: `D:\KAGAMI-MZ\lanes\rent\vcp_demand_scout\output_vcp_supply_leads.csv`

## Demand (người cần thuê)
- Lead giữ: **4** — HOT/WARM/COLD: 0/4/0
- CSV: `D:\KAGAMI-MZ\lanes\rent\vcp_demand_scout\output_vcp_demand_leads.csv`

## Lỗi fetch (tối đa 50)
- https://alonhadat.com.vn/tim-kiem/cho-thue-can-ho-vinhomes-central-park: fetch HTTP 404
- https://batdongsan.com.vn/cho-thue-can-ho-chung-cu-vinhomes-central-park-binh-thanh: fetch HTTP 403

## Mẫu Supply (text_raw rút gọn)
1. tier=HOT score=100 | var litespeed_docref=sessionStorage.getItem("litespeed_docref");litespeed_docref&&(Object.defineProperty(document,"referrer",{get:function(){return litespeed_docref}}),sessionStorage.removeItem("lites...
2. tier=HOT score=100 | (function(w,i,g){w[g]=w[g]||[];if(typeof w[g].push=='function')w[g].push(i)}) (window,'GTM-MMVJT5G','google_tags_first_party');(function(w,d,s,l){w[l]=w[l]||[];(function(){w[l].push(arguments);})('set...
3. tier=HOT score=90 | ﻿ Tôi cần cho thuê căn hộ mới hoàn thiện Vinhomes Central Park quận Bình Thạnh window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('conf...
4. tier=HOT score=90 | <!-- var SESSIONURL = "s=cf26077de80a71d2bddcef3fb4781e51&"; var SECURITYTOKEN = "guest"; var IMGDIR_MISC = "styles/nhadat/misc"; var IMGDIR_BUTTON = "styles/nhadat/buttons"; var vb_disable_ajax = par...
5. tier=HOT score=100 | Cho thuê vinhomes central park mới nhất 2026 a,h1,h2,h3,h4,h5,h6,li,p,ul{margin:0;padding:0}h1,h2,h3{font-size:18px}:focus{outline:0}body{margin:0;padding:0;color:#333;font-family:Arial,Helvetica,Sans...

## Mẫu Demand (text_raw rút gọn)
1. tier=WARM score=75 | Tôi cần thuê căn hộ 2PN tại Vinhomes Central Park, ưu tiên tòa Park 5 gần công viên. Ngân sách mình có thể chi khoảng 25–30 triệu/tháng, có thể thương lượng nếu căn đẹp. Cần vào ở đầu tháng sau vì hợp...
2. tier=WARM score=75 | Mình muốn thuê studio hoặc 1PN ở Landmark 81 thuộc Vinhomes Central Park. Budget khoảng 18 triệu / tháng, không hút thuốc, ở một mình. Muốn vào ở trong tuần này nếu có căn phù hợp. SĐT: 0987123456 ...
3. tier=WARM score=75 | Em cần thuê gấp căn 3 phòng ngủ tại VCP, tòa Park 3. Diện tích khoảng 100 m2 là được, không cần nội thất quá xịn. Giá mong muốn tầm 35–40 triệu mỗi tháng. Liên hệ: 0903987654 (call sau 18h). ...
4. tier=WARM score=75 | Tôi cần thuê căn 2PN tại Central 2 trong khu Vinhomes Central Park. Ngân sách tối đa 28 triệu/tháng. Cần căn sạch, ban công thoáng. Có thể nhận nhà cuối tháng. Email: nhu.cau.thue.vcp@example.com ...
