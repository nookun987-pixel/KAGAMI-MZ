# SESSION_RESUME_NOTE — 2026-05-31

Đọc file này + `docs/handoff/00_LATEST_CODEX_HANDOFF.md` khi bắt đầu phiên sau.

## TRẠNG THÁI CHỐT HÔM NAY

- TRUE_CURRENT_PHASE: Phase 4 — Component Integration (hoàn tất).
- PHASE5_ALLOWED_TO_BE_PROPOSED: YES (chỉ review nội bộ; KHÔNG film/video/short/shotlist; KHÔNG motion render; KHÔNG canon-lock).
- Git: commit `69da1c5` đã push lên `github.com/nookun987-pixel/KAGAMI-MZ.git` (main). Sạch.
- RunPod: đã TERMINATE. Không còn pod chạy.

## ĐÃ XONG (chuỗi ASSET-RESET / BRIDGE)

1. Held candidates (ASSET-RESET-12): 05B HOLD, 06C HOLD, 08B REJECT.
2. Stack manifest V2 (ASSET-RESET-13): đã áp quyết định.
3. Bust bridge spec (ASSET-RESET-14): đã có; material amended.
4. Render bust bridge trên RunPod RTX 4090 (SDXL Juggernaut + IP-Adapter + ControlNet canny img2img refine).
5. AR-14 §9 review → INCLUDE_AS_PHASE4_REFERENCE cho bản "Ảnh 1" (smooth monocoque porcelain).
6. Phase 5 readiness gate (ASSET-RESET-16): PASS 5/5.

## FILE ẢNH CUỐI (bust bridge accepted)

`D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\09\09_BUST_UPPER_BODY_BRIDGE\MIKAGE_COMP_09A_BUST_UPPER_BODY_BRIDGE_REVIEW_CANDIDATE.png`
(= copy của MIKAGE_COMP_09_BUST_BRIDGE_REFINE_00001_; gốc 00001/00002 giữ làm provenance)
- Lưu ý: folder bị lồng 2 lớp `09\09` — có thể flatten cho gọn (tùy chọn, không bắt buộc).

## QUYẾT ĐỊNH THIẾT KẾ ĐÃ CHỐT (binding)

- Mikage bust = SMOOTH monocoque porcelain (bề mặt trơn liền khối). Panel-gap + graphene = OPTIONAL, không bắt buộc.
- Refine policy: "smooth primary, detail secondary" — chỉ micro-seam; CẤM panel lớn / graphene rõ / khe visor. Faceless tuyệt đối là hard-stop.

## GOVERNANCE (đã sửa hôm nay)

- CLAUDE.md: thêm RENDER PERMISSION STANDARD + RENDER GOVERNANCE PRECEDENCE (override AR-14 §8/§13 cho task render khi user yêu cầu rõ) + RENDER OUTPUT STATUS LIMITS + RENDER SOURCE EXCLUSIONS.
- Bust spec: đã thêm GOVERNANCE PRECEDENCE NOTE.

## NEXT_SAFE_TASK (mai chọn 1)

- A) `ASSET-RESET-15_DEFINE_BODY_CONTINUITY_CONSTRAINT_SPEC_NO_RENDER_V1` (đã unblock).
- B) Phase 5 upper-body consistency planning (no-render).
- Cả hai đều KHÔNG render, KHÔNG mở film/video lane.

## CÒN TREO (tùy chọn, không gấp)

- Flatten folder `09\09` thành `09_BUST_UPPER_BODY_BRIDGE` 1 lớp.
- Nếu muốn refine micro-seam: thuê lại pod, tải lại 4 model (~13GB), dùng `/workspace/render_refine.py` lối cũ.

## RÀNG BUỘC GIỮ NGUYÊN

- Không tự canon-approve / asset-lock / production-ready / public.
- Không mở Phase 5 thật (mới chỉ "được phép đề xuất").
- Film / video / short / shotlist vẫn ĐÓNG.
- Git không thao tác được từ Cowork sandbox → commit/push làm trên máy hoặc Claude Code.
