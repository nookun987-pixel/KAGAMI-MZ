# MIKAGE_PHASE_2_DECISION_BOARD_V0_1

```
STATUS: DECISION_BOARD — 7 món chờ operator, trả lời 1 message duy nhất
ROADMAP: MIKAGE_NARRATIVE_EXECUTION_ROADMAP_V1.md Phase 2
DATE: 2026-06-13
CÁCH TRẢ LỜI: 1 dòng kiểu "2.1=C, 2.3=A, còn lại default" — em áp toàn bộ trong 1 lượt.
DEFAULT TOÀN CỤC: không chọn = giữ nguyên trạng an toàn (cột Default).
```

## 2.1 — Clean Digital Gold hex (mở HUD LORA)

LORA visual motif = "Clean Digital Gold" (Golden Patch event) nhưng chưa có mã hex. Các vàng hiện có trong canon đều KHÔNG khớp ngữ nghĩa "clean digital":

| Option | Hex | Nguồn gốc | Rủi ro |
|---|---|---|---|
| A | #FFD700 Imperial Gold | Canon V2 §3.2 (Royal Machine — collectible mode) | Lẫn với mode collectible, hơi "trang sức" |
| B | #C39A52 Kintsugi urushi-gold | Cine color contract (LOCKED, seams only) | Mâu thuẫn ngữ nghĩa: kintsugi = matte/aged, LORA cần clean/digital; còn đụng quyền "seams only" |
| C | #E6B800 [PROPOSAL_HEX — mã MỚI, không có trong canon] | Đề xuất: vàng số sạch, nằm giữa A và B, không trùng vùng nào | Là invention — cần anh gật mới thành lock |
| **Default** | **GIỮ HELD** | HUD LORA tiếp tục treo | Không rủi ro |

## 2.2 — Archive Tower type spec (mở HUD Tai Vane)

| Option | Spec | Nguồn |
|---|---|---|
| A | Monospaced ultra-small (như HUD Orbital Logic §10.1) · màu porcelain #FAFAFA · layout chỉ mục truy vấn–kết quả | Lắp từ §10.1 có sẵn, chỉ đổi màu sang trung tính (đỏ = Mikage, cyan = Empire — Tai Vane trung lập nên trắng) |
| **Default** | **GIỮ HELD** | |

## 2.3 — WEAPON_DRIFT_001: khiên Lyre là gì?

Nguồn lệch: Canon V2 §8.2 "Unbreakable Shield (vertical plasma pillar discharge)" + §11.4 "shield vents vertical white/cyan plasma" vs FACTIONS_V2_5 "etched on Lyre's Unbreakable Shield face (per D2 Option A, **if** shield = physical object)".

| Option | Nghĩa | Hệ quả |
|---|---|---|
| A (khuyên) | Khiên = VẬT THỂ vật lý, mặt khiên khắc được sigil, và NÓ xả cột plasma dọc | Thỏa cả 3 nguồn cùng lúc — drift đóng được sạch |
| B | Khiên = thuần cột plasma không vật thể | Mâu thuẫn FACTIONS_V2_5 (không có mặt khiên để khắc) — phải sửa file kia |
| **Default** | **GIỮ CHƯA XÁC NHẬN** | drift tiếp tục treo |

## 2.4 — LORA public "Root Architect" framing

| Option | Nghĩa |
|---|---|
| **Default (khuyên): GIỮ INTERNAL** | "Root Architect" chỉ dùng nội bộ; public copy không nhắc |
| MỞ PUBLIC | Cần thêm public-copy review riêng — không khuyên lúc này |

## 2.5 — Canonical outcome Scene 2

| Option | Nghĩa |
|---|---|
| **Default (khuyên): KEEP_UNRESOLVED tiếp** | Giá trị của scene là lựa chọn chưa ngã ngũ; chỉ chốt khi medium thật (MV/truyện) bắt buộc |
| A hoặc B | Chốt 1 nhánh thành canon event — một chiều, khó lùi |

## 2.6 — Câu nói Branch B (đang B-2 default-recommendation)

| Option | Line |
|---|---|
| **Default: CONFIRM B-2** | `"The cost is mine."` |
| Đảo B-1 | `"This one is carried."` |

## 2.7 — Height lock Mikage / Lyre

| Option | Nghĩa |
|---|---|
| **Default: GIỮ PROVISIONAL** | 180cm / 188cm tạm, không lock |
| LOCK | Chốt số chính thức vào canon layer — chỉ cần khi vào production scale thật |

---

## Operator Answer Slot — DECIDED 2026-06-13 (BOOS: "2.1=C, 2.3=A, còn lại default")

```
2.1 = C  → Clean Digital Gold = #E6B800 [LOCKED — PROPOSAL_HEX được operator gật thành lock]
2.2 = default → Tai Vane HUD GIỮ HELD
2.3 = A  → WEAPON_DRIFT_001 RESOLVED: khiên Lyre = VẬT THỂ vật lý, mặt khắc được sigil,
           xả cột plasma dọc trắng/cyan (thỏa Canon V2 §8.2 + §11.4 + FACTIONS_V2_5 D2-A)
2.4 = default → LORA "Root Architect" GIỮ INTERNAL
2.5 = default → Scene 2 canonical outcome = KEEP_UNRESOLVED
2.6 = default → B-2 "The cost is mine." = CONFIRMED chính thức
2.7 = default → heights GIỮ PROVISIONAL 180/188
```

## Sau khi có trả lời, em sẽ (1 lượt, không hỏi):
1. Áp quyết định vào: VOICE_PROFILE_LOCK (HUD §3/§6 nếu mở) · Canon proposals note cho 2.3 · các file scene/script liên quan 2.5/2.6.
2. Ghi bảng này thành DECIDED + ngày.
3. Chuyển Phase 3: đóng gói NARRATIVE_PACKAGE_V1 + pointer append + final audit + 1 lệnh commit duy nhất.
