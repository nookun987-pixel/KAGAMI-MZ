# LANE A / CODEX TASK BRIEF — HELMET HEAD LOOKDEV (bounded, 1 render)
Soạn bởi Lane B · 2026-06-26 · STATUS: DRAFT chờ BOOS authorize (commit = authorize).

Lý do: AI 2D elevation kịch trần ở "clay" vì nguồn là blockout. Helmet cần đẩy lookdev THẬT ở HEAD.
⚠️ Task này **reopen + edit helmet HEAD geometry** (ngược với invariant "do not change helmet / two slits"
của mọi gate trước) — CỐ Ý, giới hạn CHỈ ở HEAD, không đụng body/rig/mount/blade. 1 task = 1 render.

## TASK
`MIKAGE_HELMET_HEAD_LOOKDEV_EEVEE_V0_1`

## INPUT
- Base blend: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_HERO_REAL_LOOKDEV_V0_1.blend`
  *(Operator xác nhận nếu có base helmet-isolated sạch hơn.)*
- Isolate HEAD/helmet (+ hood/hair thuộc head). **KHÔNG đụng body / rig / mount / blade.**

## GEOMETRY — bounded facet refine (CHỈ helmet head)
- Hạ chiều cao đầu ~**8%**, mở thái dương ~**5%**, đáy helmet **phẳng & gọn** (bỏ "trứng").
- **Rebuild facet**: mặt phẳng LỚN có chủ đích theo crown / temple / jaw; tránh nhiều tam giác nhỏ hội tụ giữa mặt.
- GIỮ: đúng **2 khe ngang**, tỉ lệ vẫn nhận diện được, không mặt/mắt/miệng, không chi tiết lạ.

## SLITS — 2 trạng thái (QUAN TRỌNG)
- **Recess** 2 khe CHÌM vào sứ (lõm), **mảnh hơn ~20%**.
- **MẶC ĐỊNH = ĐEN / DORMANT** (Mikage đang "ngủ"): khe đen, KHÔNG phát sáng. Đây là look chính.
- **Violet = trạng thái THỨC GIẤC**, làm thành emissive **bật riêng** (vật liệu/light toggle). Chỉ dùng cho khoảnh khắc reveal.
- → Render **CẢ 2**: (A) dormant khe đen, (B) awakened khe violet.

## MATERIAL
- **Porcelain GLAZED bán mờ**: subsurface nhẹ + clearcoat mỏng, roughness vừa, micro-variation — KHÔNG nhựa/xốp/clay.
- Lót / graphene / hair: **graphite tối matte**.

## LIGHTING / CAMERA
- **1 key thống trị 45° lệch, nâng cao chếch xuống (Rembrandt), fill ~0** → 2/3 khối chìm vào void `#050508`.
- **Rim mảnh, sáng hơn key 1–2 stop** (tách silhouette khỏi nền đen). **Backlight nâng cao = halo/nimbus sau crown**.
- Camera **góc THẤP (hero, nhìn lên)** + **3/4 nhẹ**; **HEAD hero crop** (cắt ở cổ). Negative space nhiều. Haze nhẹ + god-ray. Fine grain.

## DIVINE ART-DIRECTION — anti-toy (BẮT BUỘC; chi tiết: `MZ_DIVINE_HELMET_ARTDIRECTION.md`)
Mục tiêu: đọc thành **thần/uy lực**, KHÔNG phải hộp đồ chơi.
- **Silhouette CAO DỌC ≥1.5:1**, sọ nặng / hàm thuôn, hình **nêm góc cạnh** (không tròn/trứng). Khe **nằm trên** đường giữa → vùng sứ trống lớn dưới → "nhìn xuống" người xem.
- **Chamfer nhất quán mọi cạnh** để bắt 1 vệt specular ("ping") — KHÔNG cạnh sắc 0-radius. Phân cấp **primary→secondary→tertiary**; panel seam có độ sâu + chủ đích; topology quad sạch, **không tam giác hội tụ giữa mặt**.
- Dồn chi tiết vào focal (viền khe, cổ); crown/má là **mặt phẳng nghỉ**. Đối xứng + chính diện, tối đa **1 micro-asymmetry**.
- **Material sứ thiêng (Cycles):** base `#F2EEEA` (không pure white); **SSS 0.15–0.25** Random Walk, IOR ~1.54; roughness thân **0.25–0.4** + **Coat 0.5–1.0 / Coat Rough 0.05–0.1**; **noise phá roughness đều** + craquelure bump rất nhẹ + smudge/vân tay mờ + edge-wear curvature. Graphene: anisotropic gần-đen `#0A0A0C`, matte sâu. HDRI EXR 8k + grain.

## RÀNG BUỘC
- Khe **đen mặc định**; violet **KHÔNG bật sẵn**, chỉ là state awakening riêng. Violet (khi bật) **chỉ trong 2 khe**.
- KHÔNG warm/halo/flood/cyan/gold. KHÔNG đụng body/mount/rig/motion/blade.
- KHÔNG canon-lock, KHÔNG PASS/final. Output = **CANDIDATE**. Dọn `.blend1`. **KHÔNG push** (operator push).

## ĐẦU RA
- `production/character/MIKAGE_HELMET_HEAD_LOOKDEV_EEVEE_V0_1.blend`
- `production/character/reviews/MIKAGE_HELMET_HEAD_LOOKDEV_V0_1_CONTACT_SHEET.png` (3/4 hero **DORMANT khe đen** + 3/4 **AWAKENED khe violet** + close facet/material)
- `production/character/reviews/MIKAGE_HELMET_HEAD_LOOKDEV_V0_1_PROOF.md` + RESULT block.
→ Lane B drift-check (silhouette + material + slit) → BOOS duyệt → AI final sheen (fal Kontext low-strength) trên render 3/4 → hero public.
