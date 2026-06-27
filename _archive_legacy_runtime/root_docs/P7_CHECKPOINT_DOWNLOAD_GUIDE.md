# MIKAGE CHECKPOINT DOWNLOAD GUIDE (P7-1)

## Status: Manual Download Required

**Lý do:** File checkpoint 6-7GB, download tự động qua curl/HTTP không ổn định.

---

## Model Cần Tải

### Ưu tiên #1: RealVisXL V4.0
- **File:** `realvisxlV40.safetensors`
- **Kích thước:** ~6.5 GB
- **Nguồn:** https://civitai.com/models/139562
- **Ưu điểm:** Product photography specialist, phù hợp Mikage canon

### Dự phòng #2: SDXL Base 1.0
- **File:** `sd_xl_base_1.0.safetensors`
- **Kích thước:** ~6.9 GB
- **Nguồn:** https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0
- **Ưu điểm:** Neutral, ít bias

### Dự phòng #3: ProtoVisionXL
- **File:** `protovisionxl.safetensors`
- **Kích thước:** ~6.5 GB
- **Nguồn:** https://civitai.com/models/138723

---

## Cách Tải Thủ Công

### Phương pháp 1: Hugging Face (khuyên dùng cho SDXL Base)
1. Mở browser: https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0
2. Click tab "Files and versions"
3. Tìm file: `sd_xl_base_1.0.safetensors`
4. Click download icon
5. Lưu vào: `D:\Fooocus-main\models\checkpoints\`

### Phương pháp 2: Civitai (cho RealVisXL)
1. Mở browser: https://civitai.com/models/139562
2. Click "Download" (có thể cần đăng nhập)
3. Chọn format: SafeTensor, fp16
4. Lưu vào: `D:\Fooocus-main\models\checkpoints\`
5. Đổi tên thành: `realvisxlV40.safetensors`

### Phương pháp 3: wget (nếu có)
```bash
cd D:\Fooocus-main\models\checkpoints
wget https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors
```

### Phương pháp 4: aria2c (nhanh nhất, có resume)
```bash
cd D:\Fooocus-main\models\checkpoints
aria2c -x 4 -s 4 "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors"
```

---

## Thư Mục Đích

```
D:\Fooocus-main\models\checkpoints\
├── juggernautXL_v8Rundiffusion.safetensors  (7.1 GB) [CURRENT]
├── realvisxlV40.safetensors                 (6.5 GB) [TARGET]
└── sdxl_base_1_0.safetensors                (6.9 GB) [FALLBACK]
```

---

## Kiểm Tra Sau Download

1. **Verify file size:**
   ```powershell
   Get-ChildItem D:\Fooocus-main\models\checkpoints\*.safetensors
   ```

2. **Verify file integrity:**
   - File .safetensors không bị corrupt
   - Size khớp với expected (±100MB chấp nhận được)

---

## Bước Tiếp Theo Sau Có Model

Sau khi download xong, chạy lại:
```bash
cd D:\KAGAMI-MZ
node p0_5_e2e_test.js
```

Pipeline sẽ:
1. Load model mới
2. Re-run với cùng subject test
3. So sánh kết quả
4. Chọn winner

---

## Ghi Chú

- **Thời gian download:** 15-45 phút tùy network
- **Dung lượng cần:** ~7GB free space
- **Không cần:** Extract, chỉ copy file .safetensors
- **Fooocus auto-detect:** Không cần config thêm để nhận model

---

*Task: P7-1 Checkpoint Download*
*Date: 2026-03-30*
