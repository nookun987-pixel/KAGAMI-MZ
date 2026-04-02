# IMAGE FAIL DIAGNOSIS

**Run ID:** `e2e_test_1774804613259`  
**Date:** 2026-03-30  
**Diagnosis:** GEMINI ABSTRACT REJECT  

---

## 1. TÓM TẮT THẤT BẠI

| Metric | Value |
|--------|-------|
| **Final Decision** | REJECT |
| **Gemini Pass/Fail** | FAIL |
| **Material Read** | "Abstract pattern, stylized texture, digital noise, woven pattern" |
| **Dominant Fail Reason** | MATERIAL_ABSENT |

**Gemini kết luận:**
> "The image fails because it is an abstract, texture-only composition with no discernible manufactured object. There is no ceramic material read, and the frame prioritizes pattern over object or material definition."

---

## 2. PHÂN TÍCH PROMPT GỬI VÀO FOOOCUS

### Prompt Chính (Final Prompt)
```
SUBJECT
Macro product photography material study of matte B4C technical ceramic.

MATERIAL
Solid porcelain-white #FAFAFA surface. Exquisite eggshell microtexture. 
Highly detailed subtle hairline fractures and micro-cracks. Strictly zero 
specular highlights. Cold and dry industrial ceramic feel.

COMPOSITION
Macro close-up. Clean negative space. Premium commercial readability. 
Material purity emphasis. Surface must clearly belong to a manufactured object. 
Visible edge, rim, bevel, curve, seam, or contour evidence required.
```

### Negative Prompt
```
plastic, glossy, shiny, PVC, toy-like, anime, cyberpunk, vibrant colors, 
neon, glitter, metal, glass, wet, smooth skin, low quality, blurry, 
watermark, text, messy background, oversaturated, specular highlights, 
ambient color wash, magenta spill, plaster, gypsum, chalk, concrete dust, 
carved stone, mineral banding, sedimentary pattern, rough rock, layered erosion, 
striated grooves, sculpted surface, powdery porous masonry...
```

### Vấn Đề Phát Hiện:
| Lỗi | Giải Thích |
|-----|-----------|
| **"Material study" quá mạnh** | Fooocus hiểu là "nghiên cứu chất liệu" → tạo texture abstract |
| **Thiếu subject concrete** | Không có "sphere", "vase", "plate", "tile" - chỉ có "surface" |
| **"Macro close-up" lỗi** | Quá zoom, mất context vật thể |
| **Negative thiếu** | Không có "abstract composition", "texture-only", "pattern without object" |

---

## 3. PHÂN TÍCH RENDER PAYLOAD

### Settings Từ `final_decision.json`
| Parameter | Requested | Actual | Issue |
|-----------|-----------|--------|-------|
| Width | 512 | **1024** | ⚠️ SIZE MISMATCH |
| Height | 512 | **1024** | ⚠️ Tăng gấp đôi |
| Steps | 20 | 20 | ✅ OK |
| Sampler | - | dpmpp_2m_sde_gpu | - |
| Scheduler | - | karras | - |
| Performance | Speed | Speed | - |

### Phát Hiện Quan Trọng:
- **Render size tự động upscale 2x** → có thể làm blur/mất detail
- **Không có style selections** (style: []) → đúng yêu cầu
- **Không auto-injected styles** → không bị drift từ style

---

## 4. PHÂN TÍCH LOCAL VALIDATOR FAIL

### Rules FAIL (Từ `post_validation.json`)
| Rule | Priority | Status | Ý Nghĩa |
|------|----------|--------|---------|
| **T3** | ABSOLUTE | ❌ FAIL | Edge/geometry issue |
| **T8** | ABSOLUTE | ❌ FAIL | Hard-surface identity |
| **T12** | ABSOLUTE | ❌ FAIL | Symmetry ratio < 98% |
| **C3** | CRITICAL | ❌ FAIL | Thumbnail subject retention |

### Signals Analyzer (Chỉ Số Quan Trọng)
| Signal | Value | Threshold | Status |
|--------|-------|-----------|--------|
| `geometry_symmetry_ratio` | **83.58%** | > 98% | ❌ FAIL |
| `recognition_time_seconds` | **0.8s** | < 1s | ⚠️ BORDERLINE |
| `primary_subject_confidence` | **0.51** | > 0.6 | ❌ LOW |
| `saliency_peak_zone` | **side_zone** | center | ❌ OFF-CENTER |
| `thumbnail_subject_retention` | **0** | > 0.5 | ❌ ZERO |
| `thumbnail_saliency_rank` | **background** | subject | ❌ BACKGROUND |

### Kết Luận Analyzer:
- **Ảnh không có subject center rõ ràng**
- **Peak saliency ở góc (0.74, 0.69)** thay vì center
- **Không có object nào được retain trong thumbnail**
- **Geometry symmetry thấp** (83% vs yêu cầu 98%)

---

## 5. PHÂN TÍCH GEMINI VALIDATION

### Gemini Read Sai:
| Yêu Cầu | Gemini Đọc Thành |
|---------|-----------------|
| "B4C ceramic object" | "Abstract pattern" |
| "Manufactured object" | "Texture-only frame" |
| "Clear contour/edge" | "Digital noise" |
| "Material study" | "Woven pattern" |

### Gemini Fail Rules:
```
[
  "abstract composition",
  "texture-only frame", 
  "manufactured object not readable",
  "material clearly belongs to one manufactured object, not a wall, slab, or floating texture field",
  "clear manufactured object read with contour evidence such as edge, rim, bevel, seam, or curvature"
]
```

---

## 6. NGUYÊN NHÂN GỐC RỄ

### Root Cause 1: Prompt Gây Abstract
```
"Macro product photography material study" 
→ Fooocus nghĩ: "à, chỉ cần texture đẹp, không cần object"
```

### Root Cause 2: Thiếu Subject Definition
- Không có từ cụ thể: "sphere", "dish", "plate", "component", "part"
- Chỉ có chung chung: "surface", "material", "texture"

### Root Cause 3: Composition Drift
- "Macro close-up" → quá zoom, mất context
- "Clean negative space" → nhiều background, ít subject
- Không có "centered", "dominant subject", "main object"

### Root Cause 4: Thiếu Anti-Abstract Negative
| Thiếu Trong Negative | Nên Thêm |
|---------------------|----------|
| abstract composition | ✅ |
| texture-only frame | ✅ |
| no subject | ✅ |
| pattern without object | ✅ |
| background dominates | ✅ |

---

## 7. HÌNH ẢNH THỰC TẾ (output.png)

**File:** `D:\KAGAMI-MZ\runs\e2e_test_1774804613259\output.png`  
**Size:** 2973 KB (1024x1024)  

### Gemini Mô Tả:
> "Abstract, texture-only composition with no discernible manufactured object."

### Analyzer Phát Hiện:
- **Saliency peak ở vị trí (0.74, 0.69)** - góc phải dưới
- **Center dominance ratio 1.02** - gần như không có center subject
- **Subject confidence 51%** - dưới ngưỡng readable

---

## 8. KẾT LUẬN CHÍNH

| # | Vấn Đề | Mức Độ |
|---|--------|--------|
| 1 | Prompt quá chú trọng "material study" gây abstract | 🔴 CRITICAL |
| 2 | Thiếu subject concrete (sphere, dish, component) | 🔴 CRITICAL |
| 3 | "Macro close-up" gây loss of context | 🔴 CRITICAL |
| 4 | Thiếu anti-abstract negative prompts | 🟡 HIGH |
| 5 | Render size mismatch (512→1024) | 🟡 MEDIUM |
| 6 | Saliency off-center (peak ở góc) | 🔴 CRITICAL |
| 7 | Symmetry ratio 83% < 98% requirement | 🔴 CRITICAL |

### Blocker Lớn Nhất:
**PROMPT ABSTRACT DRIFT** - Prompt tuy có nói "manufactured object" nhưng ngôn ngữ quá nặng về material/texture, khiến AI sinh ra pattern abstract thay vì object rõ ràng.

---

## 9. HƯỚNG SỬA

### Sửa 1: Đổi Subject Line
```diff
- Macro product photography material study of matte B4C technical ceramic
+ Product photography of single engineered ceramic sphere, matte B4C technical ceramic material
```

### Sửa 2: Thêm Object Definition
```
OBJECT: Single ceramic sphere, approximately 10cm diameter, perfectly smooth matte surface with subtle eggshell microtexture. Full sphere visible with clear silhouette against background.
```

### Sửa 3: Bỏ "Macro Close-up"
```diff
- Macro close-up
+ Medium shot showing full object
```

### Sửa 4: Thêm Anti-Abstract Negative
```
abstract composition, texture-only frame, pattern without object, background dominates, no clear subject, fragmented composition, decorative texture study, material swatch, abstract art, texture macro without context
```

---

**End of Diagnosis**  
*Created: 2026-03-30*  
*Run Reference: e2e_test_1774804613259*
