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

## SLITS
- **Recess** 2 khe CHÌM vào sứ (lõm + emissive bên trong), **mảnh hơn ~20%**, glow **tiết chế** — không LED nổi.

## MATERIAL
- **Porcelain GLAZED bán mờ**: subsurface nhẹ + clearcoat mỏng, roughness vừa, micro-variation — KHÔNG nhựa/xốp/clay.
- Lót / graphene / hair: **graphite tối matte**.

## LIGHTING / CAMERA
- **1 key-light mạnh MỘT BÊN**; bên kia **chìm hẳn vào void `#050508`**. Rim mảnh. Fine grain.
- Camera **3/4 nhẹ** (KHÔNG chính diện), **HEAD hero crop** (cắt ở cổ).

## RÀNG BUỘC
- Violet **chỉ trong 2 khe**. KHÔNG warm/halo/flood/cyan/gold. KHÔNG đụng body/mount/rig/motion/blade.
- KHÔNG canon-lock, KHÔNG PASS/final. Output = **CANDIDATE**. Dọn `.blend1`. **KHÔNG push** (operator push).

## ĐẦU RA
- `production/character/MIKAGE_HELMET_HEAD_LOOKDEV_EEVEE_V0_1.blend`
- `production/character/reviews/MIKAGE_HELMET_HEAD_LOOKDEV_V0_1_CONTACT_SHEET.png` (3/4 hero + close facet/slit/material)
- `production/character/reviews/MIKAGE_HELMET_HEAD_LOOKDEV_V0_1_PROOF.md` + RESULT block.
→ Lane B drift-check (silhouette + material + slit) → BOOS duyệt → AI final sheen (fal Kontext low-strength) trên render 3/4 → hero public.
