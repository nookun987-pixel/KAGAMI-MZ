# LYRE BRIEF V0.3 — VERIFICATION REVIEW (Cowork, 2026-06-10)

MODE = REVIEW_ONLY. Không sửa brief, không render, không PASS asset.

## CHECKLIST vs nguồn hiện hành
| Check | Kết quả |
|---|---|
| Khớp Lock 1A (05-29, operator-approved): #FAFAFA + under-suit nickel-gray + cyan emission static + red #E60000 giấu spine vents + force-field weapon system | ✔ V0.3 giữ đúng; visor 1 khe cyan duy nhất, cấm cheek lines |
| Sửa đủ 6 residual của attempt_006 (pose tay sau lưng, shield disc hiện diện dormant, bỏ knee lights, material chalky-matte, backdrop Empire, aspect 2.35:1) | ✔ từng mục có positive+negative riêng (§4) |
| Không regress các win của V0.2 (genderless column, cyan-only, no pistol/amber) | ✔ ghi rõ "Kept from V0.2" |
| Khớp ruling shield (Lock 1A: force-field, không phải khiên cầm) | ✔ disc emitter dormant trên cẳng tay — đúng hướng force-field; WEAPON_DRIFT_001 không bị brief này promote |
| Aspect bug gốc (square) | ✔ ĐÃ HẾT BLOCKER: RunPod kit (cast_jobs.json job `lyre_p1_v0_3`) chạy ComfyUI local — honor width/height, không cần fix FAL gate nữa |
| DRIFT_COLOR_001 (cyan vs Z-Blue contract 06-04) | KHÔNG chặn brief: cyan của Lyre là EMISSION UI theo Lock 1A operator-approved; Z-Blue thay "cold cyan" áp cho wash môi trường/cine. Nếu operator tick ngược lại thì chỉ cần sửa 1 dòng emission trong prompt |

## VERDICT
`BRIEF_V0_3_CONSISTENT — READY_FOR_OPERATOR_TOKEN`
Việc duy nhất còn lại là việc của operator: set `operator_approval_token` + chạy cast_render_kit (RunPod, operator-run). Không có lý do kỹ thuật nào để sửa brief thêm trước render thử.

NEXT_SAFE_TASK = operator set token khi muốn render Lyre attempt_007 (cùng batch với LORA V0.2 / LYRA V0.1 / ARCHON-IX V0.1 / Mikage P1-P3).
