# MIKAGE — RunPod Deploy Guide

**Target:** RunPod RTX 4090 pod, PyTorch 2.x template, 50GB+ disk.

---

## Steps (do them in order)

### 1. Pack the project (on your Windows PC)

```powershell
cd D:\KAGAMI-MZ
powershell -ExecutionPolicy Bypass -File deploy\runpod_pack.ps1
```

This creates `mikage_runpod_pack.zip` in `D:\KAGAMI-MZ\`.

### 2. Create a RunPod pod

- **GPU:** RTX 4090 (24GB VRAM)
- **Template:** RunPod PyTorch 2.1+ (CUDA 12.1)
- **Disk:** 50GB minimum (models need space)
- **Expose ports:** `3000, 7865` (TCP)

### 3. Upload the zip to the pod

Use RunPod's file manager, or from the pod terminal:

```bash
# Option A: Upload via RunPod web UI to /workspace/

# Option B: If hosted somewhere
cd /workspace && wget YOUR_URL/mikage_runpod_pack.zip
```

### 4. Unzip

```bash
cd /workspace
mkdir -p KAGAMI-MZ
unzip mikage_runpod_pack.zip -d KAGAMI-MZ
```

### 5. Run bootstrap (one time)

```bash
bash /workspace/KAGAMI-MZ/deploy/runpod_bootstrap.sh
```

Wait for it to finish. It installs everything.

### 6. Set your API key

```bash
nano /workspace/KAGAMI-MZ/.env
```

Change `GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE` to your real key. Save (`Ctrl+O`, `Enter`, `Ctrl+X`).

### 7. Start all services

```bash
bash /workspace/KAGAMI-MZ/deploy/runpod_start.sh
```

This starts Fooocus Bridge + Server + Worker. First run takes 2-5 minutes (model download).

### 8. Verify

```bash
bash /workspace/KAGAMI-MZ/deploy/runpod_healthcheck.sh
```

All checks should show `[PASS]`.

### 9. Quick bridge test (no API keys needed)

```bash
source /workspace/venv/bin/activate
cd /workspace/KAGAMI-MZ
python deploy/test_e2e_render.py
```

This sends a prompt directly to the Fooocus bridge and saves a PNG.
If this passes, the bridge → Fooocus → image path is confirmed working.

### 10. Full pipeline test (requires GEMINI_API_KEY)

```bash
source /workspace/venv/bin/activate
cd /workspace/KAGAMI-MZ
python -m pipeline.orchestrator "porcelain kitsune mask, crimson seam, obsidian void"
```

### 11. Check output

Output is in `/workspace/KAGAMI-MZ/runs/<job_id>/output.png`.

---

## Quick Reference

| Service         | Port | Check                                |
|-----------------|------|--------------------------------------|
| Fooocus Bridge  | 7865 | `curl http://127.0.0.1:7865/`        |
| Mikage Server   | 3000 | `curl http://127.0.0.1:3000/health`  |
| Worker          | —    | `tmux attach -t mikage-worker`       |

## Troubleshooting

- **View logs:** `tail -f /workspace/logs/fooocus_bridge.log`
- **Attach to service:** `tmux attach -t mikage-bridge`
- **List sessions:** `tmux list-sessions`
- **Restart everything:** run `runpod_start.sh` again (it kills old sessions first)
- **Out of VRAM:** Check `nvidia-smi`, kill other processes
