# MIKAGE IMAGE MODEL BASELINE AUDIT

## [P6-1] MODEL HIỆN TẠI

### Checkpoint đang dùng:
- **File:** `juggernautXL_v8Rundiffusion.safetensors`
- **Path:** `D:\Fooocus-main\models\checkpoints\juggernautXL_v8Rundiffusion.safetensors`
- **Size:** 7.1 GB (SDXL base model)

### Cấu hình:
- **Config file:** `D:\KAGAMI-MZ\config.txt`
- **Checkpoint path:** `D:\Fooocus-main\models\checkpoints`
- **Fooocus bridge:** `scripts/fooocus_bridge.py`
- **Model selection:** Fooocus auto-loads first available .safetensors (alphabetically)

### Xác nhận model load:
```
Fooocus loads modules.config → path_checkpoints
→ Tìm file .safetensors đầu tiên trong thư mục
→ Auto-load: juggernautXL_v8Rundiffusion.safetensors
```

### Vấn đề với model hiện tại:
- **Type:** General purpose SDXL base model
- **Bias:** Art/fantasy/cinematic scenes
- **Abstract pattern tendency:** HIGH
- **Color hallucination:** HIGH (neon, oversaturated)
- **Object readability:** LOW (tạo atmospheric scenes thay vì isolated objects)
- **Canon compatibility:** UNSUITABLE for Mikage hard-surface industrial ceramic

### Kết luận P6-1:
**BLOCKER CONFIRMED:** `juggernautXL_v8Rundiffusion` không phù hợp với Mikage canon.
Cần thay bằng model có thiên hướng product photography / industrial realism.

---

## [P6-2] CHECKPOINT ỨNG VIÊN

### Tiêu chí chọn model:
- ✅ Realism / product photography bias
- ✅ Low color hallucination (ít neon)
- ✅ Controllable geometry / hard-surface friendly
- ✅ Industrial / studio lighting compatibility
- ❌ Không chọn: anime, fantasy, art-style, cinematic-action

### 3 Model ứng viên được đề xuất:

#### **CANDIDATE 1: RealVisXL V4.0**
- **Purpose:** Product photography & realistic rendering
- **Pros:** 
  - Thiên hướng realism mạnh
  - Object silhouette rõ ràng
  - Studio lighting dễ control
  - Ít neon/artistic drift
- **Cons:** Có thể quá "photographic" nếu prompt không chặt
- **Suitability:** HIGH - Phù hợp hard-surface industrial ceramic
- **Download:** civitai.com/models/139562

#### **CANDIDATE 2: SDXL Base 1.0 (Stability AI)**
- **Purpose:** Neutral base model
- **Pros:**
  - Không bias mạnh về hướng nào
  - Dễ điều khiển bằng prompt
  - Không có art-style mặc định
- **Cons:** Cần prompt chi tiết hơn
- **Suitability:** MEDIUM-HIGH - Cần test để xác nhận
- **Download:** huggingface.co/stabilityai/stable-diffusion-xl-base-1.0

#### **CANDIDATE 3: ProtoVisionXL**
- **Purpose:** High-fidelity realistic renders
- **Pros:**
  - Detail cao, texture tốt
  - Material rendering tốt
  - Industrial object friendly
- **Cons:** Có thể nặng về skin/portrait
- **Suitability:** MEDIUM - Cần kiểm tra với ceramic objects
- **Download:** civitai.com/models/138723

### **REJECTED Models (Không test):**
- JuggernautXL (current) - Fantasy/art bias
- DreamShaperXL - Artistic bias cao
- AnimagineXL - Anime only
- PonyXL - Artistic bias

### Status hiện tại:
**BLOCKER:** Chỉ có 1 model trong `D:\Fooocus-main\models\checkpoints`
→ Cần acquire thêm ít nhất 1 model từ candidate list trên.

---

*Audit Date: 2026-03-30*
*Task: P6-1 Model Baseline Audit*
