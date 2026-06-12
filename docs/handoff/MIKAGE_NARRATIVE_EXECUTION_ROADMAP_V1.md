# MIKAGE_NARRATIVE_EXECUTION_ROADMAP_V1

```
STATUS: EXECUTION_ROADMAP — operating mode chuyển sang PHASE BATCH
CREATED: 2026-06-13 (operator yêu cầu: "lập kế hoạch chi tiết từng bước,
         không thể nào cứ 1 bước lại hỏi")
MODE: Trong 1 phase, agent chạy TOÀN BỘ task của phase đó KHÔNG hỏi giữa chừng.
      Chỉ dừng ở cuối phase với 1 bảng review duy nhất + 1 lệnh commit duy nhất.
EMERGENCY_STOP: Nếu giữa phase phát hiện mâu thuẫn canon / thiếu nguồn → flag
      CHUA_XAC_NHAN và đi tiếp phần còn lại, KHÔNG đoán, KHÔNG dừng cả phase.
GIỚI HẠN KHÔNG ĐỔI (mọi phase): no render · no canon-V2 edit · no asset-lock ·
      no public copy · no ComfyUI/Blender · no Lyre→Lyra-0 · operator commit thủ công.
```

## TRẠNG THÁI XUẤT PHÁT (đã xong, đã push)

Core Question C + wound layer + mirrors (LOCKED) · 7-step plan · Scene 2 treatment + script (REVIEWED, B-2, KEEP_UNRESOLVED) · voice profiles ×6 (LOCKED, HUD ×2 HELD) · pointer registered (commit 1b2249f, script 89b6849).

---

## PHASE 1 — HOÀN THIỆN BỘ 3 CẢNH TEST (agent tự chạy hết, ~1 lượt)

| # | Task | Output |
|---|---|---|
| 1.1 | Scene 1 "Distorted Normal" treatment (format y hệt Scene 2: beats, micro-moments, no dialogue, PASS self-check) | MIKAGE_SCENE_1_DISTORTED_NORMAL_TREATMENT_V0_1.md |
| 1.2 | Scene 3 "Wound Reveal" treatment (Dr. Aris xuất hiện ở mức 4-fact, THIN_SOURCE floor, seam kể chuyện thay lời) | MIKAGE_SCENE_3_WOUND_REVEAL_TREATMENT_V0_1.md |
| 1.3 | Scene 1 script (HUD-driven như Scene 2; dự kiến 0 lời thành tiếng) | MIKAGE_SCENE_1_SCRIPT_DRAFT_V0_1.md |
| 1.4 | Scene 3 script (Aris nói theo voice lock §5 — tay nghề, ngắn; Mikage HUD; KHÔNG kể wound bằng thoại) | MIKAGE_SCENE_3_SCRIPT_DRAFT_V0_1.md |
| 1.5 | Self-audit cả 4 file (voice-law check, no-invent check, micro-moment check) + 1 BẢNG REVIEW GỘP duy nhất | MIKAGE_PHASE_1_REVIEW_PACKET_V0_1.md |

**Anh chỉ làm:** đọc 1 review packet → gõ "gật phase 1" (hoặc sửa điểm nào ghi điểm đó) → chạy 1 lệnh commit.

## PHASE 2 — DECISION BOARD MỘT LẦN (gom hết món chờ anh quyết, trả lời 1 lượt)

Em soạn 1 file board gom TOÀN BỘ quyết định tồn đọng, mỗi món có sẵn phương án đề xuất + default an toàn — anh chỉ tick:

| # | Món | Default đề xuất |
|---|---|---|
| 2.1 | Clean Digital Gold hex (mở HUD LORA) | đề xuất 2-3 candidate hex từ palette canon |
| 2.2 | Archive Tower type spec (mở HUD Tai Vane) | đề xuất từ §10.1 hiện có |
| 2.3 | WEAPON_DRIFT_001 — khiên Lyre | tóm 2 phương án A/B từ các nguồn lệch |
| 2.4 | LORA public "Root Architect" framing | default = GIỮ INTERNAL |
| 2.5 | Canonical outcome Scene 2 (A/B) | default = KEEP_UNRESOLVED tiếp |
| 2.6 | B-2 confirm chính thức (hiện là default-recommendation) | default = giữ B-2 |
| 2.7 | Mikage/Lyre height lock | default = giữ provisional |

**Anh chỉ làm:** trả lời 1 message dạng "2.1=B, 2.3=A, còn lại default" → em áp toàn bộ vào các file liên quan trong 1 lượt.

## PHASE 3 — ĐÓNG GÓI NARRATIVE PACKAGE V1 (agent tự chạy hết)

| # | Task |
|---|---|
| 3.1 | MIKAGE_NARRATIVE_PACKAGE_V1.md — master file hợp nhất: core question, bible 1 trang, 3 scene (treatment+script), voice rules, decision đã chốt — MỌI THỨ trace về lock, 0 lore mới |
| 3.2 | Cập nhật pointer: append block PHASE_1-3_COMPLETE vào 00_LATEST_CODEX_HANDOFF.md (không đụng Lane A) |
| 3.3 | Final integrity audit: grep toàn bộ file chuỗi narrative — 0 PENDING sót, 0 mâu thuẫn nhãn, list CHUA_XAC_NHAN cuối cùng |

**Anh chỉ làm:** 1 lệnh commit cuối.

## PHASE 4 — CẦU NỐI SANG SẢN XUẤT (tùy chọn, mở khi anh muốn)

| # | Task | Ghi chú |
|---|---|---|
| 4.1 | Story↔Track mapping: gắn 3 scene + core question vào các track catalog (Lane B material: caption tone, lore-drip theo narrative) | cần em đọc track catalog — vẫn 0 render |
| 4.2 | Board-prep spec cho Scene 2 (mô tả khung hình theo brand canon, CHƯA phải storyboard render) | board HOLD chỉ được mở ở phase này |
| 4.3 | Lore-drip schedule khớp Growth Cadence hiện có | không tự đặt start week |

## LUẬT VẬN HÀNH PHASE MODE

1. Trong phase: em KHÔNG hỏi. Gặp thiếu nguồn → ghi CHUA_XAC_NHAN, làm tiếp.
2. Cuối phase: đúng 1 review packet + 1 bảng quyết định + 1 lệnh commit.
3. Anh "gật phase N" = duyệt cả packet; muốn sửa thì ghi số mục, em sửa rồi đi tiếp luôn không hỏi lại.
4. Thứ tự mặc định: 1 → 2 → 3 → 4. Anh có quyền đảo/bỏ phase bằng 1 dòng.
5. Mọi file mới đều nằm docs/handoff/, một commit gộp mỗi phase.
```
TRIGGER: "go phase 1" → em chạy 1.1→1.5 một mạch.
```
