# RUNPOD OPERATOR RUNBOOK — CAST BATCH V2 (rebuilt 2026-06-10)

OPERATOR-RUN ONLY. Claude khong render. Output = REVIEW CANDIDATES (khong PASS/anchor/asset-lock).

## 0. Chuan bi (1 lan)
1. Push repo len GitHub tu Windows (kit nam o `tools/cast_render_kit/`).
2. Thue pod GPU 24GB+ (RTX 4090 ok), template co ComfyUI hoac Ubuntu + cai ComfyUI:
   `git clone https://github.com/comfyanonymous/ComfyUI /workspace/ComfyUI && cd /workspace/ComfyUI && pip install -r requirements.txt`
3. Tai checkpoint RealVisXL V5.0 vao `/workspace/ComfyUI/models/checkpoints/RealVisXL_V5.0_fp16.safetensors`
   (neu ten file khac -> sua field `checkpoint` trong cast_jobs.json cho khop).
4. Clone repo vao pod: `git clone <repo> /workspace/KAGAMI-MZ`

## 1. Bat token (QUYET DINH DUYET CUA OPERATOR)
Mo `tools/cast_render_kit/cast_jobs.json`, voi TUNG job muon render, doi
`"operator_approval_token": null` -> `"operator_approval_token": "BOOS-20260610"` (chuoi tuy y, khac null).
Job nao token van null se bi GATE skip.

## 2. Chay
```
cd /workspace/ComfyUI && python3 main.py --listen 127.0.0.1 --port 8188 &   # cho "Starting server"
cd /workspace/KAGAMI-MZ/tools/cast_render_kit
python3 render_cast_batch.py --dry-run          # kiem tra 7 job build workflow ok
python3 render_cast_batch.py                    # render that (2 seeds/job -> toi da 14 PNG)
```
Output PNG: `/workspace/ComfyUI/output/` (prefix = job id). Gom ve `/workspace/cast_out` hoac tai thang ve may.

## 3. Sau khi render
- Tai ~14 PNG ve may -> dua cho Cowork verify tung job theo checklist brief (Cowork KHONG tu PASS).
- Mikage P1-P3 muon fidelity cao hon: bat IP-Adapter voi anchor A1 (helmet) + A2 (body) + A3 (blade)
  theo MIKAGE_ASSET_ANCHOR_INDEX_V1 — can ComfyUI_IPAdapter_plus (tuy chon, khong bat buoc vong dau).

## RUN ORDER
LORA -> Lyre -> LYRA -> ARCHON-IX -> Mikage P1 -> P2 -> P3
