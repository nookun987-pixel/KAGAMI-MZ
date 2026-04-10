# MIKAGE CHECKPOINT MANUAL DOWNLOAD - FINAL INSTRUCTIONS

## Date: 2026-03-30
## Status: Automated download FAILED - Manual download REQUIRED

---

## Automated Download Attempts Log:

| Method | Result | Notes |
|--------|--------|-------|
| curl | ❌ Failed | Exit code 1, no output |
| PowerShell Invoke-WebRequest | ❌ Failed | Exit code 1, no output |
| Python urllib | ❌ Failed | No progress |
| Python requests streaming | ❌ Stalled | Running but no file created |
| aria2c | ❌ Not available | Command not found |
| Python requests + Civitai headers | ❌ Stalled | Running 6+ min, no file |

**Conclusion:** Automated download of 6-7GB checkpoint files consistently failing.
Network environment có thể có bandwidth limits hoặc file quá lớn.

---

## REQUIRED ACTION: Manual Download

### Step 1: Download RealVisXL V4.0 (Priority #1)

**Via Browser:**
1. Mở Chrome/Edge/Firefox
2. Truy cập: **https://civitai.com/models/139562**
3. Click nút **"Download"** (màu xanh)
4. Chọn options:
   - **Format:** SafeTensor ✓
   - **Size:** Full (không chọn pruned) ✓
   - **FP:** fp16 ✓
5. Click **"Download"**
6. File sẽ tải về: `realvisxlV40.safetensors` (~6.5 GB)
7. **Copy/Move file vào:**
   ```
   D:\Fooocus-main\models\checkpoints\
   ```

### Step 2: Alternative - SDXL Base 1.0 (Priority #2)

**Via HuggingFace (đáng tin cậy hơn Civitai):**
1. Mở browser
2. Truy cập: **https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0**
3. Click tab **"Files and versions"**
4. Tìm file: `sd_xl_base_1.0.safetensors`
5. Click **download icon** (mũi tên xuống)
6. Lưu vào: `D:\Fooocus-main\models\checkpoints\`

**Via wget (nếu có Git Bash hoặc WSL):**
```bash
cd /d/Fooocus-main/models/checkpoints
wget https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors
```

### Step 3: Alternative - ProtoVisionXL (Priority #3)

**Via Browser:**
1. https://civitai.com/models/138723
2. Download SafeTensor version
3. Move to checkpoints folder

---

## Verification After Download

### Check files exist:
```powershell
dir D:\Fooocus-main\models\checkpoints\*.safetensors
```

Expected output:
```
juggernautXL_v8Rundiffusion.safetensors  7.1 GB
realvisxlV40.safetensors                 6.5 GB  [NEW]
```

### Verify file size (phải đúng ±100MB):
- RealVisXL V4.0: ~6.5 GB (6,500,000,000 bytes)
- SDXL Base 1.0: ~6.9 GB (6,900,000,000 bytes)

---

## Next Steps After Model Ready

1. **Update config** (tùy chọn, Fooocus tự động nhận model):
   ```json
   // D:\KAGAMI-MZ\config.txt
   {
       "default_model": "realvisxlV40.safetensors"
   }
   ```

2. **Restart Fooocus bridge** (nếu đang chạy):
   ```bash
   # Stop current bridge
   # Start lại để load model mới
   python scripts/fooocus_bridge.py
   ```

3. **Run comparison test:**
   ```bash
   cd D:\KAGAMI-MZ
   node p0_5_e2e_test.js
   ```

---

## Timeline Estimate

| Step | Time |
|------|------|
| Download RealVisXL | 20-40 min (tùy network) |
| Copy to folder | 2-5 min |
| Restart services | 2 min |
| Run test | 5-8 min |
| **Total** | **30-60 min** |

---

## Blocker Summary

```
┌────────────────────────────────────────────────────────────┐
│  BLOCKER: Checkpoint download requires manual intervention │
│  Automated methods failed on 6-7GB file download          │
│  Action: User must download via browser                    │
└────────────────────────────────────────────────────────────┘
```

---

## Files Reference

- Download Guide: `D:\KAGAMI-MZ\P7_CHECKPOINT_DOWNLOAD_GUIDE.md`
- Status Report: `D:\KAGAMI-MZ\P7_CHECKPOINT_STATUS_REPORT.md`
- Model Audit: `D:\KAGAMI-MZ\MODEL_BASELINE_AUDIT.md`
- Winner Selection: `D:\KAGAMI-MZ\IMAGE_MODEL_WINNER.md`

---

*Ready to proceed with P7-2 through P7-6 once checkpoint is available.*
