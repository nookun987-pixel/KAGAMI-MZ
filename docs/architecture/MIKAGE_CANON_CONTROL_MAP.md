# MIKAGE — CANON CONTROL MAP

> MỤC ĐÍCH: 1 chỗ duy nhất để BOOS control canon, chống mỗi report AI mới làm loạn Lane A/Lane B.
> DATE: 2026-06-14 · Lane B đề xuất · canon-lock = chỉ operator. Cả Codex (Lane A) lẫn Claude (Lane B) đọc file này TRƯỚC.

## 3 LUẬT GỐC
1. **SSOT là canon DUY NHẤT.** Chỉ file trong mục SSOT bên dưới là sự thật. Không ai (agent nào) tự sửa SSOT — chỉ **operator** sửa.
2. **DRAFT ≠ CANON.** Mọi report AI / deep-research / output GPT-Gemini = DRAFT. Để NGOÀI `docs/` canon. KHÔNG override SSOT. Chỉ thành canon khi **operator tự tay** chép điểm đó vào 1 file SSOT.
3. **Lane trỏ về cùng SSOT, không lane nào tự đẻ canon.** Conflict giữa 2 layer → **BRAND/interface canon thắng** cho web/UI; **film/cine canon** chỉ cho MV/world-art.

## SSOT — CANON KHOÁ (authoritative)
| File | Vai trò | Khoá |
|---|---|---|
| `KAGAMI/docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` | Cung 3 phase P1/P2/P3 + mask ruling | 🔒 02/06 |
| `KAGAMI/design_system/mikage-cine-color-contract.md` | Màu cine (violet chỉ slit/P3 core, 70% shadow…) | 🔒 04/06 |
| `KAGAMI/docs/mikage_character_visual_spec.md` | Spec hình nhân vật (silhouette, material, forbidden) | canon |
| `KAGAMI/docs/mikage_universe_visual_system.md` | Hệ hình vũ trụ / world | canon |
| `mikage-zenith-design` skill | BRAND/UI canon (web, release page) | 🔒 wins for UI |

> Lane B làm việc form V0.2 = **derived từ SSOT**, chưa phải SSOT cho tới khi operator khoá.

## DRAFT / REFERENCE — KHÔNG phải canon
| File | Tình trạng |
|---|---|
| `Kế Hoạch Phát Triển Nhân Vật Mikage.md` (upload) | DRAFT — có ≥7 điểm chỏi canon (xem `MIKAGE_DEEPRESEARCH_DRAFT_CONFLICTS_2026-06-14.md`). KHÔNG bỏ vào docs/. |
| `MIKAGE_IP_CHARACTER_FORM_DEEP_RESEARCH_V0_1/V0_2_MERGED.md` | RESEARCH — recommendation, chưa canon-lock. |
| Mọi report AI tương lai | mặc định DRAFT cho tới khi operator nâng cấp. |

## LANE OWNERSHIP
| | Lane A — Codex | Lane B — Claude Cowork |
|---|---|---|
| Sở hữu | system/build/control, **rig/mesh/Blender/deformation**, source audit | public/visual-render, character page public/reference, release/short/website, **character form-explore (2D/render)** |
| Governed by | `AGENTS.md` (entry guard) | `CLAUDE.md` + handoff Lane B |
| Canon-lock | KHÔNG (operator) | KHÔNG (operator) |
| Đọc trước | file này + AGENTS.md | file này + handoff |

## QUY TRÌNH NÂNG DRAFT → CANON (chỉ operator)
1. Operator chọn điểm trong DRAFT muốn nhận.
2. Operator (hoặc Lane A theo lệnh) **ghi tay** vào file SSOT tương ứng.
3. Ghi 1 dòng changelog (ngày + điểm).
4. Từ đó agent mới được coi là canon. Trước bước này: agent phải treat là DRAFT, không dùng.

## CỜ ĐỎ — agent phải STOP + báo nếu thấy
- Report ngoài tự xưng "locked/V2.x" mà không nằm trong SSOT.
- Dẫn nguồn IP trùng tên (Blue Lock, Utena, Eva…) hoặc mượn cơ chế Evangelion (A.T. Field, berserk, S2 regen) làm canon Mikage.
- Violet làm fill/wash/halo (chỉ được ở 2 slit hoặc P3 core).
- Đổi tỉ lệ đầu / thêm tóc / đổi vị trí Ensō mà không có trong SSOT.
