# MIKAGE SYSTEM ARCHITECTURE MASTER

**Version:** V1.0
**Date:** 2026-04-06
**Status:** ACTIVE SYSTEM MAP

---

# 1. SYSTEM OVERVIEW

MIKAGE là hệ thống AI end-to-end gồm 3 lớp chính:

```
CONTROL PLANE  →  EXECUTION PIPELINE  →  MEMORY + LEARNING
```

---

# 2. CURRENT SYSTEM STATE

## ✅ VERIFIED (ĐANG HOẠT ĐỘNG)

### CONTROL LAYER

* command_map.json → intent + route + phase safety
* handler.js → state machine command execution
* command_history.json → logging

### PIPELINE CORE

* orchestrator.js → điều phối toàn bộ hệ
* gemini_intake → intake structured JSON
* gemini_precheck → filter + revise
* claude_spec_bridge → build prompt
* execution_lane_router → chọn lane

### EXECUTION

* Google Lane (PRIMARY)
* Imagen API
* Colab Runner

### VALIDATION

* rule_engine (canon rules)
* analyzers (VLM + signals)
* drift detector
* Gemini Judge (FINAL GATE)

### MEMORY

* canon_memory_registry.json (ALLOW only)
* intel_registry.json (INTEL lane)

### TRAINING LOOP

* fail_classifier.js
* patch_engine.js
* ab_retest_runner.js
* training_case_writer.js

---

## ⚠️ PARTIAL / CHƯA HOÀN CHỈNH

* Auto retry execution (chưa fully stable)
* Patched rerender loop (chưa production-ready)
* Image anchor consistency (đang bug/phụ thuộc bridge)
* Vertex RAG (đã connect nhưng chưa full usage)

---

## ❌ CHƯA CÓ

* SYSTEM ARCHITECTURE MAP (file này)
* CHANGELOG / SYSTEM LOG
* CENTRAL STATE VIEW (global system state)
* FULL AUTOMATION LOOP (no human touch)

---

# 3. FULL EXECUTION FLOW

```
USER / COMMAND
    ↓
Command Layer (command_map.json)
    ↓
Orchestrator Entry
    ↓
Gemini Intake
    ↓
Gemini Precheck (PASS / REVISE / REJECT)
    ↓
Claude Spec Builder
    ↓
Prompt Package
    ↓
Execution Lane Router
    ↓
Colab Runner → Imagen API
    ↓
output.png + result_bundle.json
    ↓
Local Validation (rule_engine + analyzers)
    ↓
Gemini Judge (FINAL GATE)
    ↓
final_decision.json
    ↓
IF ALLOW → Canon Memory Write
    ↓
IF FAIL → Training Loop → Patch → Retry
```

---

# 4. SYSTEM LAYERS

## 4.1 CONTROL PLANE

Files:

* commands/command_map.json
* commands/handler.js
* mikage-server/server.js

Function:

* nhận intent
* validate phase
* route execution
* enforce safety

---

## 4.2 EXECUTION BRAIN

File:

* orchestrator.js

Function:

* điều phối toàn bộ pipeline
* build prompt
* gọi render
* gọi validator
* quyết định PASS/REJECT

---

## 4.3 EXECUTION LANE

Primary:

* Google Imagen API
* Colab Runner

Fallback:

* Local Fooocus (deprecated)

---

## 4.4 VALIDATION LAYER

Components:

* rule_engine → canon rules
* analyzers → semantic signals
* drift_detector → identity drift
* Gemini Judge → final decision

Rule:

```
NO IMAGE = NO PASS
NO VALIDATOR = NO PASS
NO GEMINI PASS = NO PASS
```

---

## 4.5 MEMORY LAYER

### Canon Memory

* only ALLOW records
* dùng cho continuity

### Intel Memory

* lưu scout / evaluation
* dùng cho training loop

---

## 4.6 TRAINING LOOP

Flow:

```
FAIL → classify → patch → retest → store case
```

Purpose:

* cải thiện prompt
* giảm drift
* tăng pass rate

---

# 5. CURRENT PROBLEMS (CRITICAL)

⚠️ NO SINGLE SOURCE OF TRUTH
→ hệ đang split logic

⚠️ MATERIAL DRIFT (B4C → plastic / abstract)

⚠️ ABSTRACT FRAME ISSUE
→ model tạo texture thay vì object

⚠️ IMG2IMG / ANCHOR chưa ổn định

⚠️ PIPELINE DEPENDS ON PROMPT QUALITY
→ chưa có strong identity lock

---

# 6. SYSTEM RULES (LOCKED)

* Gemini = FINAL GATE (không bypass)
* Canon = ABSOLUTE
* No abstract composition
* One subject only
* Manufactured object must be readable

---

# 7. NEXT PHASE ROADMAP

## PHASE 3 (CURRENT → STABILIZE)

* Fix image anchor (img2img)
* Fix material realism
* Lock subject readability
* Stabilize training loop

---

## PHASE 4 (EXECUTION AUTOMATION)

* auto retry loop
* patched rerender stable
* execution without manual trigger

---

## PHASE 5 (FULL SYSTEM)

* Control → Execution → Memory fully automated
* Notion sync
* Task system
* Multi-agent coordination

---

## PHASE 6 (SCALE)

* Cloud deployment
* Multi-lane execution
* Cost optimization
* Batch rendering

---

# 8. REQUIRED ADDITIONS (MISSING SYSTEMS)

⚠️ SYSTEM CHANGELOG FILE
→ SYSTEM_CHANGELOG.md

⚠️ GLOBAL STATE FILE
→ system_state.json

⚠️ TASK MANAGEMENT LAYER
→ Notion / Task DB integration

⚠️ ERROR MONITORING
→ failure dashboard

---

# 9. FINAL VERDICT

MIKAGE hiện tại:

```
INFRA:      STABLE
PIPELINE:   WORKING
QUALITY:    UNSTABLE
CONTROL:    STRONG
AUTOMATION: PARTIAL
```

---

# 10. CORE IDENTITY

MIKAGE ≠ IMAGE GENERATOR

MIKAGE =
**AI OPERATED STUDIO SYSTEM**

* Intake → Thinking → Execution → Judgment → Memory → Learning

---

# END
