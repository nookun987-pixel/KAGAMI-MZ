# MIKAGE — MODULE SPEC EXTRACTED FROM RESEARCH
## Source: Hệ Điều Hành Sáng Tạo Có Kiểm Soát (Auditable Creative OS)
## Architecture: LOCKED — No Redesign
## Output: Production-ready function specs (Node.js)

---

## EXTRACTION LOG

| Research Module | Mikage Target | Status |
|---|---|---|
| Module 1: Event-Driven Architecture + TraceId | /core/event_bus.js, /core/trace.js | EXTRACTED |
| Module 2: Scripted VRAM Management | /render/vram_manager.js | EXTRACTED |
| Module 3: API Bridge + Exponential Backoff | /memory/notion_bridge.js | EXTRACTED |
| Module 4: Wabi-sabi Hard Constraints JSON | /middleware/constraints.js | EXTRACTED |
| Module 5: Prompt Middleware Mapping | /middleware/mapper.js, /middleware/normalize.js | EXTRACTED |
| Module 6: Critic Agent Threshold Evaluation | /critic/rule_critic.js, /critic/vision_critic.js | EXTRACTED |
| Module 7: Conditional Abort Loop | /core/execution_lock.js | EXTRACTED |
| Module 8: Drift Detector Identity Lock | /drift/drift_detector.js, /drift/identity_score.js | EXTRACTED |
| Module 9: Audit Memory System | /memory/notion_logger.js, /memory/audit_serializer.js | EXTRACTED |
| Module 10: Execution Policy + Error Taxonomy | /control/policy.js, /control/risk.js | EXTRACTED |

### REJECTED (Non-executable)

- All neuroscience DMN references (theory only)
- Golden Ratio facial proportion math (Mikage has no human face — kitsune mask only)
- PickScore / LAION Aesthetic Predictor (requires model hosting outside Fooocus pipeline)
- CLIP Score / LPIPS distance metrics (same — external model dependency)
- Ukiyo-e anatomical ratio math (Canon uses three-axis rule, not human proportions)
- General explanation of how Stable Diffusion works (non-actionable)
- All academic citation prose

---

## /core

### /core/event_bus.js

**Purpose:** Decouple all pipeline stages via immutable event records. No direct function calls between modules.

**Inputs:**
```js
{
  event_type: String,    // "JOB_INGESTED" | "PRECHECKED" | "NORMALIZED" | etc.
  job_id: String,
  trace_id: String,      // UUID, created once at INGESTED, carried through entire lifecycle
  timestamp: ISO8601,
  payload: Object,       // stage-specific data
  source_module: String  // which module emitted
}
```

**Outputs:**
```js
{
  delivered_to: String[], // subscriber module names
  ack: Boolean
}
```

**Functions:**
```js
// Emit immutable event record
async function emit(event_type, job_id, trace_id, payload, source_module)

// Subscribe module to specific event types
function subscribe(event_type, handler_fn)

// Idempotency guard — prevent duplicate processing
// Maintains processed_event_ids Set in Redis
async function isProcessed(event_id) -> Boolean
async function markProcessed(event_id)
```

**Idempotency rule (from research):**
Before any side-effect (API call, GPU render, Notion write), check `isProcessed(event_id)`. If true, skip silently. This prevents duplicate Fooocus renders on retry.

---

### /core/trace.js

**Purpose:** Generate and propagate trace_id across entire job lifecycle. Every event, log entry, and Notion record carries the same trace_id.

**Functions:**
```js
// Generate trace_id at job intake — one per job, never regenerated
function createTraceId() -> String  // UUID v4

// Attach trace_id to any payload object
function attachTrace(payload, trace_id) -> Object

// Extract trace_id from incoming event
function extractTrace(event) -> String
```

---

### /core/state_machine.js

**Purpose:** Enforce strict linear state transitions. No state skipping.

**Valid transitions:**
```
INGESTED → STRUCTURED → PRECHECKED → NORMALIZED → TRANSLATED →
RENDERING → CRITIQUED → DRIFT_CHECKED → POSTCHECKED → DECIDED →
LOGGED → DONE
```

**Fail path from any state:**
```
{ANY_STATE} → FAILED → LOGGED → DONE
```

**Functions:**
```js
// Attempt state transition — throws if invalid
function transition(job, next_state) -> Job
// Returns: updated job with new state + timestamp in audit_trace

// Validate transition is legal
function canTransition(current_state, next_state) -> Boolean

// Get valid next states from current
function getNextStates(current_state) -> String[]
```

**Hard rule:** `transition()` appends to `audit_trace[]` automatically with step/timestamp/result.

---

### /core/execution_lock.js

**Purpose:** Enforce controlled feedback loop with hard abort. Max 3 iterations. No infinite loops.

**Functions:**
```js
// Initialize loop for a job
function initLoop(job_id) -> { attempt: 1, max_iteration: 3 }

// Evaluate whether to continue loop based on post-control decision
function evaluateLoop(job_id, decision) -> "CONTINUE" | "STOP"
// CONTINUE only if: decision === "CONDITIONAL" AND attempt < max_iteration
// STOP if: decision === "PASS" | "REJECT" | "REVIEW" | attempt >= max_iteration

// Increment attempt counter
function incrementAttempt(job_id) -> Number

// Conditional abort — kill render mid-step if critic detects unrecoverable error
// From research: abort at sampling step N if structural failure detected
async function abortRender(job_id, reason) -> void
// Actions: kill Fooocus process, free VRAM, log abort reason, emit ABORT event
```

**Refine-allowed conditions (from spec §10):**
- texture weak
- negative space insufficient
- lighting wrong mood
- subject placement off composition

**No-refine conditions (immediate STOP):**
- identity drift
- narrative drift
- glamour drift
- aesthetic DNA fundamentally wrong

---

## /control

### /control/precheck.js

**Purpose:** PRE-CONTROL gate. Evaluate identity/narrative/strategic alignment before any render.

**Inputs:**
```js
{
  identity: Object,       // character_id, persona, identity_version
  narrative: Object,      // arc_id, chapter, continuity_notes
  strategy: Object,       // objective, secondary_objective, campaign_tag
  art_direction: Object,  // mood, material, style, composition, forbidden
  raw_request: String
}
```

**Outputs:**
```js
{
  identity_check: Number,    // 0.0 - 1.0
  narrative_check: Number,   // 0.0 - 1.0
  strategic_check: Number,   // 0.0 - 1.0
  risk_score: Number,        // 0.0 - 1.0 (lower = safer)
  decision: "ALLOW" | "REVIEW" | "REJECT" | "AUTO_SAFE",
  reasons: String[]
}
```

**Functions:**
```js
// Score identity alignment against Canon material/visual DNA
function scoreIdentity(art_direction, identity) -> Number
// Checks: materials in Canon stack? Forbidden items present? Organic softness risk?

// Score narrative continuity
function scoreNarrative(narrative, art_direction) -> Number
// Checks: continuity_notes respected? E-I-P-R phase consistency? Anti-drift alignment?

// Score strategic alignment
function scoreStrategic(strategy, art_direction) -> Number
// Checks: objective matches campaign? Engagement bait detected? Trend chasing?

// Combined decision engine
function decide(identity_check, narrative_check, strategic_check, risk_score) -> String
// ALLOW: all >= 0.75 AND risk low
// REVIEW: any score 0.60-0.75
// REJECT: any score < 0.60 OR glam drift / trend chasing detected
// AUTO_SAFE: ambiguous but no hard violation — draft only, no publish
```

**Control token issuance:**
```js
// Only issued on ALLOW or explicit human override
function issueToken(job_id) -> { control_token: String, expires_in: 300 }
```

---

### /control/postcheck.js

**Purpose:** POST-CONTROL gate. Final decision after Critic + Drift.

**Inputs:**
```js
{
  critic_verdict: Object,  // from /critic/critic_merge.js
  drift_verdict: Object,   // from /drift/drift_detector.js
  attempt: Number,
  job: Object
}
```

**Outputs:**
```js
{
  risk_score: Number,
  decision: "AUTO_SAFE" | "REVIEW" | "REJECT" | "CONDITIONAL" | "PASS",
  publish_safe: Boolean
}
```

**Functions:**
```js
// Final decision matrix
function postDecide(critic_verdict, drift_verdict, attempt) -> Object
// PASS: critic PASS + drift PASS
// CONDITIONAL: fixable issues (texture/space/lighting) + attempt < max
// REVIEW: borderline — hold for human gate
// REJECT: drift heavy OR identity fail OR quality fail OR unfixable root error
// AUTO_SAFE: weak but safe — log only, no publish

// Publish safety gate
function isPublishSafe(decision, mode) -> Boolean
// Only true if decision === "PASS" AND mode !== "AUTO_DRAFT"
```

---

### /control/risk.js

**Purpose:** Score risk across multiple dimensions. Aggregate risk from all pipeline stages.

**Functions:**
```js
// Calculate composite risk from all available scores
function calculateRisk(identity_check, narrative_check, strategic_check, critic_score, drift_flags) -> Number

// Detect specific risk patterns
function detectGlamDrift(art_direction) -> Boolean
function detectTrendChasing(art_direction, strategy) -> Boolean
function detectEngagementBait(strategy) -> Boolean
```

---

### /control/policy.js

**Purpose:** Hard policy enforcement. These rules cannot be overridden by any module.

**Functions:**
```js
// Minimal decision policy — the 5 iron rules
const POLICY = {
  identity_over_engagement: true,     // If conflict → choose identity
  imperfection_over_polish: true,     // If conflict → choose imperfection
  silence_over_weak_output: true,     // If weak but safe → choose silence
  stop_over_unfixable_loop: true,     // If root drift → stop immediately
  reject_beautiful_non_mikage: true   // If beautiful but not Mikage → reject
};

// Check if output violates any iron rule
function enforcePolicy(job, decision_context) -> { allowed: Boolean, violated_rule: String | null }
```

**Error taxonomy (extracted from research Module 10):**

```js
const ERROR_CODES = {
  E3:  { name: "CONTEXT_MISMATCH",       layer: "PRE",    action: "restart_extraction" },
  E6:  { name: "SEMANTIC_DRIFT",          layer: "DRIFT",  action: "lock_identity_vectors" },
  E10: { name: "FABRICATED_CONTENT",      layer: "CRITIC", action: "abort_and_dlq" },
  E11: { name: "PARAMETRIC_OVERRELIANCE", layer: "RENDER", action: "inject_stronger_negatives" },
  E14: { name: "SPATIAL_MISALIGNMENT",    layer: "CRITIC", action: "recompose_bounding_box" }
};

// Classify error from critic/drift output
function classifyError(issues, drift_flags) -> { code: String, action: String }

// Track error frequency for system health monitoring
function trackErrorFrequency(error_code, job_id, timestamp)
```

---

## /middleware

### /middleware/constraints.js

**Purpose:** Hard constraint enforcement as structured JSON. Wabi-sabi rules quantified for machine execution.

**Functions:**
```js
// Return Mikage-specific hard constraints
// Adapted from research Module 4 — remapped to Canon values
function getMikageConstraints() -> Object
```

**Output (locked values):**
```js
{
  aesthetic_constraints: {
    philosophy: "Wabi-Sabi + Porcelain Minimalism",
    symmetry_tolerance: 0.4,          // from research — prevents AI perfection
    texture_requirements: [
      "micro-cracks",
      "uneven_matte_surface",
      "heat_stress_scarring",
      "kintsugi_gold_seams",
      "aged_grain_variation"
    ],
    spatial_composition_Ma: {
      negative_space_min: 0.40,        // Canon: >= 40%
      subject_max_ratio: 0.30,         // Canon: subject <= 30% of frame
      background_environment: 0.60     // Remaining 60%
    },
    broken_symmetry_required: true,
    imperfection_required: true,
    texture_variation_required: true
  },
  forbidden: [
    "perfect_symmetry",
    "plastic_skin",
    "glossy_luxury_finish",
    "over_smooth_surfaces",
    "generic_ai_beauty",
    "anime",
    "organic_softness_on_subject",
    "greebling",
    "neon_pollution",
    "magic_effects",
    "bloom_effects"
  ]
}
```

---

### /middleware/mapper.js

**Purpose:** Fixed mapping table. Convert artistic language → structured render parameters.

**Functions:**
```js
// Map mood array → lighting spec
function mapMoodToLighting(mood_array) -> String[]
// Example: ["melancholic", "restrained"] → ["low-key directional 45°", "chiaroscuro 4:1", ...]

// Map material array → texture spec
function mapMaterialToTexture(material_array) -> String[]
// Example: ["weathered ceramic"] → ["micro-cracks matte B4C", "uneven wear patterns", ...]

// Map style array → composition rules
function mapStyleToComposition(style_array) -> String[]
// Example: ["wabi-sabi"] → ["negative space >= 40%", "broken symmetry", ...]

// Map narrative → symbolic restraint level
function mapNarrativeToRestraint(narrative) -> String
// Example: fragment_03 / Establisher → "maximum restraint, minimum visual noise"

// Map strategy → output mode boundary
function mapStrategyToMode(strategy) -> String
// Example: identity_consistency → "strict Canon adherence, no creative deviation"
```

**No freeform mapping. Every input keyword has a predetermined output.**

---

### /middleware/normalize.js

**Purpose:** Assemble final normalized prompt spec from all mapper outputs. Single structured object ready for translator.

**Inputs:**
```js
{
  lighting: String[],          // from mapMoodToLighting
  texture: String[],           // from mapMaterialToTexture
  composition_rules: String[], // from mapStyleToComposition
  constraints: Object,         // from constraints.js
  negative_prompt: String[]    // assembled from forbidden + constraints
}
```

**Outputs:**
```js
{
  normalized_prompt_spec: {
    subject: String,            // locked identity description from Canon
    lighting: String[],
    texture: String[],
    composition_rules: String[],
    negative_prompt: String[]
  }
}
```

**Functions:**
```js
// Assemble complete normalized spec
function normalize(mapped_lighting, mapped_texture, mapped_composition, constraints) -> Object

// Inject Canon-locked subject description (never generated, always static)
function injectIdentity(identity_version) -> String
// Returns: locked prompt from mikage_prompt_locked.txt

// Compile negative prompt from all sources
function compileNegativePrompt(constraints_forbidden, art_direction_forbidden) -> String[]
// Deduplicates, orders by priority
```

**Anti-plastic-look injection (from research Module 5):**
Middleware automatically injects anti-AI tokens into negative prompt:
```js
const ANTI_AI_NEGATIVES = [
  "plastic skin", "over-smoothing", "3d render", "CGI",
  "airbrushed", "digital painting look", "artificial sharpness"
];
```

---

## /translator

### /translator/ollama_translate.js

**Purpose:** Convert structured prompt spec → flat Fooocus-compatible prompt strings. Translation only. Zero creativity.

**Inputs:**
```js
{
  task: "translate_to_render_prompt_only",
  rules: {
    no_creativity: true,
    preserve_identity: true,
    preserve_constraints: true
  },
  structured_prompt_spec: Object  // from /middleware/normalize.js
}
```

**Outputs:**
```js
{
  positive_prompt: String,     // single flat prompt string
  negative_prompt: String,     // single flat negative string
  technical_notes: String[]    // render hints (e.g., "preserve negative space")
}
```

**Functions:**
```js
// Send structured spec to Ollama, receive flat prompts
async function translate(structured_prompt_spec) -> Object

// Validate Ollama is loaded before call
async function ensureOllamaReady() -> Boolean
```

---

### /translator/translator_guard.js

**Purpose:** Validate Ollama output has not exceeded translator authority. Reject if creativity detected.

**Functions:**
```js
// Compare Ollama output against input spec
function validateTranslation(input_spec, ollama_output) -> { valid: Boolean, violations: String[] }

// Specific checks:
function checkNoAddedConcepts(input_spec, output) -> Boolean
function checkNoToneShift(input_spec, output) -> Boolean
function checkNoPersonaCreation(output) -> Boolean
function checkNoNarrativeBreak(input_spec, output) -> Boolean

// If any check fails → reject output, re-translate with stricter instruction
async function rejectAndRetranslate(input_spec, violations) -> Object
```

**Guard logic:**
```
IF output contains keywords NOT in input_spec.subject
   AND NOT in input_spec.texture
   AND NOT in input_spec.lighting
   AND NOT in input_spec.composition_rules
→ VIOLATION: added_concept
→ REJECT translator output
```

---

## /render

### /render/vram_manager.js

**Purpose:** Enforce strict sequential VRAM lifecycle. No parallel Ollama + Fooocus. Zombie process detection.

**Functions:**
```js
// Execute full VRAM lifecycle for one job
async function executeVRAMLifecycle(job_id, phase) -> void
// phase: "OLLAMA" | "FOOOCUS"

// Load model into VRAM
async function loadModel(model_type) -> void

// Unload model from VRAM
async function unloadModel(model_type) -> void

// Clear VRAM completely
async function clearVRAM() -> void

// Detect zombie runner processes (from research Module 2)
// Cross-reference: ollama ps vs nvidia-smi active processes
async function detectZombies() -> { found: Boolean, pids: Number[] }

// Kill zombie processes
async function killZombies(pids) -> void

// Resource lock state
function getResourceLock() -> { ollama_active: Boolean, fooocus_active: Boolean, parallel_allowed: false }

// Block job if resource conflict
function checkResourceConflict() -> Boolean
```

**Strict execution order:**
```
1. loadModel("OLLAMA")
2. translate()
3. unloadModel("OLLAMA")
4. clearVRAM()
5. detectZombies() → killZombies() if found
6. loadModel("FOOOCUS")
7. render()
8. unloadModel("FOOOCUS")
9. clearVRAM()
10. detectZombies() → killZombies() if found
```

**Environment:**
```
OLLAMA_KEEP_ALIVE=0  (mandatory — immediate unload after response)
```

---

### /render/fooocus_client.js

**Purpose:** Interface to Fooocus renderer. Receives only: prompt, negative_prompt, seed, dimensions, quality.

**Inputs:**
```js
{
  engine: "fooocus",
  prompt: String,           // from translator
  negative_prompt: String,  // from translator
  seed: Number | null,      // null = random
  width: Number,            // e.g., 1024
  height: Number,           // e.g., 384 (for 2.76:1)
  styles: [],               // empty — no Fooocus style presets
  performance: "Quality",
  attempt: Number
}
```

**Outputs:**
```js
{
  output_file: String,       // path to rendered image
  seed_used: Number,
  render_time_ms: Number,
  status: "OK" | "FAILED" | "ABORTED"
}
```

**Functions:**
```js
// Submit render job to Fooocus API
async function submitRender(render_packet) -> Object

// Check render status
async function checkStatus(render_id) -> String

// Abort in-progress render (triggered by execution_lock.js)
async function abortRender(render_id) -> void
```

**Fooocus has ZERO identity logic.** It receives flat strings and renders. All intelligence is upstream.

---

### /render/render_executor.js

**Purpose:** Orchestrate the complete render pipeline with control token validation.

**Functions:**
```js
// Execute render with full lifecycle
async function executeRender(job, control_token) -> Object

// Validate control token before allowing render
function validateToken(control_token) -> Boolean
// If invalid or expired → block render, return error

// Full sequence:
// 1. validateToken()
// 2. vram_manager.executeVRAMLifecycle("OLLAMA")
// 3. ollama_translate.translate()
// 4. translator_guard.validateTranslation()
// 5. vram_manager.executeVRAMLifecycle("FOOOCUS")
// 6. fooocus_client.submitRender()
// 7. return result for critic
```

---

## /critic

### /critic/rule_critic.js

**Purpose:** Layer 1 — Rule-based hard checks. No AI. Pure constraint validation.

**Inputs:**
```js
{
  image_path: String,
  constraints: Object    // from /middleware/constraints.js
}
```

**Outputs:**
```js
{
  rule_score: Number,      // 0.0 - 1.0
  issues: String[],
  verdict: "PASS" | "FAIL"
}
```

**Functions:**
```js
// Check negative space ratio (must be >= 40%)
function checkNegativeSpace(image_path) -> { pass: Boolean, measured: Number }

// Check symmetry (must be broken — symmetry_tolerance 0.4)
function checkSymmetry(image_path) -> { pass: Boolean, symmetry_score: Number }

// Check texture variation (must have variation — no uniform smooth areas)
function checkTextureVariation(image_path) -> { pass: Boolean, variance: Number }

// Check surface smoothness (must NOT be too smooth)
function checkSurfaceSmoothness(image_path) -> { pass: Boolean, smoothness: Number }

// Check "AI beauty" artifacts (generic polished look detection)
function checkAIBeauty(image_path) -> { pass: Boolean, ai_score: Number }

// Aggregate all rule checks
function runAllRules(image_path, constraints) -> Object
```

**Fail conditions (any single fail = verdict FAIL):**
- negative_space < 0.40
- symmetry too perfect (> 0.6 symmetry score)
- texture variance below threshold
- surface smoothness above threshold
- AI beauty score above threshold

---

### /critic/vision_critic.js

**Purpose:** Layer 2 — AI vision analysis. VLM-based detection of 3 specific issues only.

**Inputs:**
```js
{
  image_path: String,
  identity_reference: String  // path to Canon reference image
}
```

**Outputs:**
```js
{
  vision_score: Number,   // 0.0 - 1.0
  issues: String[],
  verdict: "PASS" | "REVIEW" | "FAIL"
}
```

**Functions:**
```js
// Detect plastic/synthetic look
async function detectPlasticLook(image_path) -> { detected: Boolean, confidence: Number }

// Detect lack of depth (foreground/background separation)
async function detectLackOfDepth(image_path) -> { detected: Boolean, confidence: Number }

// Detect over-polish (too clean, too perfect)
async function detectOverPolish(image_path) -> { detected: Boolean, confidence: Number }

// Run all vision checks
async function runVisionCritic(image_path) -> Object
```

**Task-aligned prompting for VLM (from research Module 6):**
```
"Analyze this image for synthesis artifacts and style compliance.
Locate areas with over-smoothed surfaces creating plastic effect.
Evaluate physical texture authenticity.
Assess asymmetric light distribution.
Check foreground-background depth separation.
Do NOT evaluate subjective beauty. Report structural issues only."
```

---

### /critic/critic_merge.js

**Purpose:** Combine Layer 1 (rules) + Layer 2 (vision) into single verdict.

**Functions:**
```js
// Weighted merge: rule_score * 0.6 + vision_score * 0.4
function mergeScores(rule_score, vision_score) -> Number

// Combined verdict
function mergeVerdicts(quality_score) -> "PASS" | "REVIEW" | "REJECT"
// < 0.60 → REJECT
// 0.60 - 0.75 → REVIEW
// >= 0.75 → PASS
```

---

## /drift

### /drift/identity_score.js

**Purpose:** Score how much the output matches Mikage Canon identity. Not "is it beautiful" — "is it still Mikage."

**Functions:**
```js
// Compare rendered output against Canon reference
async function scoreIdentity(image_path, canon_reference) -> Number
// Checks: silhouette correct? Material reads as B4C? Mask geometry intact?
// Blade visible and straight? Color within Fallen Ivory palette?

// Compare against narrative expectations
async function scoreNarrative(image_path, narrative) -> Number
// Checks: tone matches arc phase? Emotional register correct?

// Score aesthetic integrity (anti-polish)
async function scoreAntiPolish(image_path) -> Number
// Checks: imperfection present? Texture honest? Not over-rendered?
```

---

### /drift/drift_detector.js

**Purpose:** Final drift assessment. Flag specific drift types.

**Inputs:**
```js
{
  image_path: String,
  identity_score: Number,
  narrative_score: Number,
  anti_polish_score: Number
}
```

**Outputs:**
```js
{
  identity_score: Number,
  narrative_score: Number,
  aesthetic_integrity_score: Number,
  anti_polish_score: Number,
  drift_flags: String[],
  verdict: "PASS" | "REVIEW" | "REJECT"
}
```

**Functions:**
```js
// Run full drift detection
async function detectDrift(image_path, scores) -> Object

// Flag specific drift types
function flagDrift(scores) -> String[]
// Possible flags:
// "glamour_drift" — output looks commercial/luxury
// "symmetry_drift" — too symmetrical
// "plastic_finish_drift" — synthetic surface quality
// "trend_bait_drift" — follows current AI trends, not Canon
// "narrative_break" — doesn't match arc/chapter mood
// "luxury_editorial_overreach" — too polished editorial look
```

**Hard gates:**
```
identity_score < 0.60 → REJECT (immediate, no loop)
0.60 - 0.75 → REVIEW
>= 0.75 → PASS
```

---

## /memory

### /memory/notion_bridge.js

**Purpose:** Resilient Notion API communication with exponential backoff and dead letter queue.

**Functions:**
```js
// Write to Notion with retry logic
async function writeToNotion(database_id, properties) -> Object

// Exponential backoff with jitter (from research Module 3)
async function retryWithBackoff(fn, maxRetries = 5) -> Object
// Delay: Math.min(baseDelay * 2^attempt + randomJitter, maxDelay)
// Jitter: Math.random() * 1000
// Respects Notion rate limit: 3 requests/second

// Adaptive polling for Notion (no native webhooks)
async function pollForChanges(database_id, callback) -> void
// Active: poll every 1s when events flowing
// Idle: exponential backoff up to 5min when quiet

// Dead letter queue for failed writes
async function sendToDLQ(payload, error, attempt_count) -> void
async function replayFromDLQ(dlq_entry) -> Object
```

---

### /memory/notion_logger.js

**Purpose:** Write complete audit trail to Notion. Every field mandatory.

**Functions:**
```js
// Create new job row in Notion
async function createJobEntry(job) -> String  // returns Notion page ID

// Update job row with new state
async function updateJobState(notion_id, updates) -> void

// Write final audit record
async function writeAuditRecord(job) -> void
```

**Required fields per §12-13:**
```
job_id, created_at, source, mode, prompt, negative_prompt, seed,
identity_score, critic_score, risk_score, decision, attempt_count,
drift_flags, rejected_reason, output_files, rejected_samples, audit_trace
```

---

### /memory/audit_serializer.js

**Purpose:** Serialize audit trace into Notion-compatible format. Store deltas, not full state.

**Functions:**
```js
// Serialize audit trace array to Notion-safe format
function serializeTrace(audit_trace) -> String

// Create delta record (from research Module 9)
// Store only what changed between iterations, not full state
function createDelta(previous_state, current_state) -> Object
// Example: { changed_field: "negative_prompt", added: ["heat-warped carbon fiber"], removed: ["aged silk"] }

// Deserialize for replay/debugging
function deserializeTrace(notion_trace_string) -> Object[]
```

---

## NON-BYPASS ENFORCEMENT (from spec §14)

Every render call MUST carry a valid control_token:
```js
{
  job_id: String,
  control_token: "prechecked_allow_signed",
  expires_in: 300  // seconds
}
```

**If token missing, invalid, or expired → render_executor.js blocks the job.**

No module may call fooocus_client.js directly. The only valid path:

```
Gemini/Claude → precheck.js (issues token) → normalize.js → ollama_translate.js
→ translator_guard.js → render_executor.js (validates token) → fooocus_client.js
→ rule_critic.js → vision_critic.js → critic_merge.js → drift_detector.js
→ postcheck.js → notion_logger.js
```

---

## IMPLEMENTATION PRIORITY (from spec §17)

| Order | File | Reason |
|---|---|---|
| 1 | /core/state_machine.js | Pipeline backbone — nothing runs without valid state transitions |
| 2 | /control/precheck.js | Gate everything — no render without identity/narrative/strategic check |
| 3 | /middleware/constraints.js | Hard constraints must exist before mapper can reference them |
| 4 | /middleware/mapper.js | Fixed mapping table — deterministic, testable |
| 5 | /translator/translator_guard.js | Prevent Ollama from exceeding authority |
| 6 | /render/vram_manager.js | Resource safety — prevent OOM and zombie processes |
| 7 | /critic/rule_critic.js | First line of quality defense |
| 8 | /drift/drift_detector.js | Identity protection — the core reason this system exists |
| 9 | /memory/notion_logger.js | Audit trail — without this, nothing is traceable |
| 10 | /core/event_bus.js | Decouple modules — can be added after v1 works sequentially |
