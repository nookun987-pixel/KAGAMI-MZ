# P0 CONTRACT FORENSICS FOR FOOOCUS PROXY
## Generated: 2026-03-31

---

## 1. EXECUTIVE SUMMARY

This report documents the exact I/O contract between MIKAGE proxy and Fooocus Gradio for image inputs.

**STATUS: FORENSIC LOGGING INJECTED, TESTS READY**

---

## 2. PROXY-SIDE ANALYSIS (fooocus_proxy.py)

### 2.1 Current Image Encoding Logic

```python
# Location: d:\KAGAMI-MZ\scripts\fooocus_proxy.py:206-219

# Image input block
# Encode image as base64 data URI — Fooocus gradio_hijack expects this format
uov_value = None
if img2img and uov_image_path and os.path.isfile(uov_image_path):
    with open(uov_image_path, "rb") as f:
        raw_bytes = f.read()
    uov_b64 = base64.b64encode(raw_bytes).decode()
    uov_value = f"data:image/png;base64,{uov_b64}"
    print(f"[PROXY] UoV image encoded: {len(uov_b64)} chars base64")
args.extend([
    img2img,                                                    # Input Image checkbox
    "uov",                                                      # current_tab
    "Vary (Subtle)" if img2img else "Disabled",                 # Upscale or Variation
    uov_value,                                                  # UoV Image (handle_file for gradio_client)
    ...
])
```

### 2.2 What Proxy Currently Sends

**Image Argument Format:**
- Type: `str` (base64 data URI) or `None`
- Format when present: `data:image/png;base64,{base64_encoded_bytes}`
- Argument position: Index 18 (19th argument in 152-arg list)

### 2.3 Forensic Logging Added (Line 330-344)

```python
# FORENSIC LOGGING: Log exact image input values before sending to Gradio
print("[PROXY FORENSIC] ========== PAYLOAD ANALYSIS ==========")
for i, val in enumerate(args):
    if val is not None:
        val_type = type(val).__name__
        val_str = str(val)[:200] if not isinstance(val, (list, dict, tuple)) else str(val)[:200]
        is_data_uri = isinstance(val, str) and val.startswith("data:image")
        has_upload = isinstance(val, str) and "/upload" in val
        is_local_path = isinstance(val, str) and os.path.isfile(val)
        if is_data_uri or has_upload or is_local_path or (isinstance(val, str) and len(val) > 100):
            print(f"[PROXY FORENSIC] arg[{i}]: type={val_type}, data_uri={is_data_uri}, upload_path={has_upload}, local_exists={is_local_path}")
            print(f"[PROXY FORENSIC] arg[{i}] preview: {val_str[:200]}...")
```

**Logged Fields:**
- `type(value)` - Python type name
- `first 200 chars` - String preview
- `startswith("data:image")` - Data URI check
- `contains "/upload"` - Upload path check  
- `is local path exists?` - File existence check

---

## 3. WEBSOCKET PROTOCOL ANALYSIS

### 3.1 Connection Details

- **URL:** `ws://127.0.0.1:7865/queue/join`
- **Fn Index:** 67 (GENERATE_FN_INDEX)
- **Protocol:** Gradio 3.x WebSocket queue protocol

### 3.2 Message Flow

1. `send_hash` → Client responds with fn_index + session_hash
2. `send_data` → Client sends args array (152 elements)
3. `process_starts` → Fooocus begins processing
4. `process_completed` → Result returned

### 3.3 Payload Structure

```json
{
  "fn_index": 67,
  "data": [152 arguments],
  "session_hash": "<12_char_hash>"
}
```

---

## 4. 152-ARGUMENT LIST STRUCTURE

| Index Range | Content |
|-------------|---------|
| 0 | Gradio state placeholder (None) |
| 1-14 | Basic generation params (prompt, styles, aspect, etc.) |
| 15-29 | LoRA slots (5 × [enabled, name, weight]) |
| 30 | Input Image checkbox (bool) |
| 31 | current_tab (str: "uov" or "ip") |
| 32 | Upscale or Variation (str) |
| **33** | **UoV Image - IMAGE INPUT GOES HERE** |
| 34 | Outpaint Direction (list) |
| 35 | Inpaint Image |
| 36 | Inpaint Additional Prompt |
| 37 | Mask Upload |
| 38-67 | Advanced settings |
| 68-83 | ControlNet slots (4 × [image, stop, weight, type]) |
| 84-91 | GroundingDINO + enhance header |
| 92-139 | Enhance slots (3 × 16 params) |

**TOTAL: 152 arguments**

---

## 5. FOOOCUS-SIDE CONTRACT (From Code Analysis)

### 5.1 Expected Image Input Format

Based on proxy code comments and Gradio 3.x conventions:

**Option A: Base64 Data URI (What proxy currently sends)**
```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
```

**Option B: Gradio File Object**
```python
{"name": "/path/to/file.png", "data": "...", "is_file": True}
```

**Option C: File Path String**
```
"/absolute/path/to/uploaded/image.png"
```

**Option D: Upload URL**
```
"/file=/tmp/gradio/.../image.png"
```

### 5.2 Critical Code Path in Fooocus

The comment at line 207 states:
```python
# Encode image as base64 data URI — Fooocus gradio_hijack expects this format
```

This indicates the proxy **believes** Fooocus expects data URIs, but this needs verification against actual Fooocus code.

---

## 6. TEST SCRIPTS CREATED

### 6.1 Test A: Direct txt2img
**File:** `d:\KAGAMI-MZ\p0_forensic_test_a_direct.js`
- Direct WebSocket to Fooocus (port 7865)
- No proxy involved
- No image input (txt2img only)
- Purpose: Establish baseline

### 6.2 Test B: Proxy txt2img  
**File:** `d:\KAGAMI-MZ\p0_forensic_test_b_proxy_txt2img.js`
- Through proxy (port 7866)
- No image input
- Purpose: Test proxy without image complications

### 6.3 Test C: Proxy img2img with denoise=0.01
**File:** `d:\KAGAMI-MZ\p0_forensic_test_c_proxy_img2img.js`
- Through proxy with image input
- Very low denoise (0.01) for minimal variation
- Tests actual image input contract

---

## 7. FORENSIC INJECTOR CREATED

**File:** `d:\KAGAMI-MZ\p0_inject_fooocus_forensic.py`

Injects logging into Fooocus to capture:
- `python type(x)`
- `repr(x)[:300]`
- `is None?`
- `startswith("data:image")`
- `contains "/file=" or "/upload"`

---

## 8. PENDING ACTIONS

To complete the forensic analysis, the following must be executed:

### 8.1 Run Forensic Injector
```bash
cd d:\KAGAMI-MZ
python p0_inject_fooocus_forensic.py
```

### 8.2 Start Fooocus (if not running)
```bash
cd D:\Fooocus-main
python webui.py --listen --port 7865
```

### 8.3 Start Proxy (in separate terminal)
```bash
cd d:\KAGAMI-MZ
python scripts/fooocus_proxy.py
```

### 8.4 Run Tests
```bash
# Test A - Direct
cd d:\KAGAMI-MZ
node p0_forensic_test_a_direct.js

# Test B - Proxy txt2img
node p0_forensic_test_b_proxy_txt2img.js

# Test C - Proxy img2img
node p0_forensic_test_c_proxy_img2img.js
```

### 8.5 Collect Logs
- Proxy logs will show `[PROXY FORENSIC]` entries
- Fooocus logs will show `[FOOOCUS FORENSIC]` entries (after injection)
- Compare arg[18] (image input) at both sides

---

## 9. HYPOTHESIS: POTENTIAL CONTRACT MISMATCH

**Current Proxy Behavior:** Sends base64 data URI via WebSocket JSON payload

**Potential Fooocus Expectation:** One of:
1. File upload via Gradio's `/upload` endpoint, then reference by path
2. `gradio_client.handle_file()` wrapper object
3. Raw file path string pointing to already-uploaded file
4. Dictionary with file metadata

**Root Cause Candidate:** Gradio 3.x WebSocket protocol may not accept inline base64 for Image components. Instead, it may require:
1. Pre-upload to `/upload` endpoint
2. Reference the uploaded file path in WebSocket payload

---

## 10. FILES MODIFIED/CREATED

| File | Purpose |
|------|---------|
| `scripts/fooocus_proxy.py` | Added forensic logging at line 330-344 |
| `p0_forensic_test_a_direct.js` | Test A script |
| `p0_forensic_test_b_proxy_txt2img.js` | Test B script |
| `p0_forensic_test_c_proxy_img2img.js` | Test C script |
| `p0_inject_fooocus_forensic.py` | Fooocus logging injector |
| `P0_FORENSIC_REPORT.md` | This report |

---

**END OF PHASE 1 FORENSICS**

Next: Execute tests to capture actual contract mismatch data.
