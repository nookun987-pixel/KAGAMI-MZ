# OBJECT DEFINITION LANE V1 — STATUS LOCK

**Verdict: PASS**
**Locked: 2026-04-06T02:01+07:00**
**Test: 35/35 passed**

---

## Files Created (8)

| # | File | Role |
|---|------|------|
| 1 | `object_definition/OBJECT_SPEC_SCHEMA.json` | Locked schema — 11 required fields |
| 2 | `object_definition/object_intent_normalizer.js` | Raw intent → design intent; rejects abstract/vague/empty |
| 3 | `object_definition/object_spec_generator.js` | Design intent → ObjectSpec (library match or skeleton build) |
| 4 | `object_definition/object_readability_gate.js` | Structural readability check: PASS / REVISE / REJECT |
| 5 | `object_definition/prompt_compiler.js` | ObjectSpec → render prompt + hard negatives |
| 6 | `object_definition/test_object_definition_lane.js` | End-to-end test — 6 test groups, 35 assertions |
| 7 | `memory/approved_object_library.json` | Approved object specs ready for render |
| 8 | `memory/design_reference_registry.json` | Cultural/design references for spec generation |

---

## Pipeline Flow

```
raw creative intent
  → object_intent_normalizer    (REJECT if abstract / vague / empty)
  → object_spec_generator       (match approved library OR build skeleton)
  → object_readability_gate     (PASS / REVISE / REJECT + score)
  → prompt_compiler             (spec → prompt + hard negatives)
  → existing spec/precheck flow
```

---

## Object Spec Schema Summary

**11 required fields** defined in `OBJECT_SPEC_SCHEMA.json`:

| Field | Type | Purpose |
|-------|------|---------|
| `object_class` | enum | mask, weapon, vessel, garment, artifact, architecture, creature, symbol |
| `identity_core` | object | name, origin, function, one_sentence — what the object IS |
| `readable_as` | string | Plain language: what a human viewer immediately recognizes |
| `topology` | object | primary_form, symmetry, orientation, dominant_axis |
| `silhouette_rules` | object | must_read_as + key_contour_features + forbidden_silhouettes |
| `must_have_parts` | array | Parts required for readability (part_name, description, visibility) |
| `forbidden_parts` | array | Parts that must NEVER appear |
| `material_truth` | object | primary_material, surface_finish, texture_descriptor, forbidden_materials |
| `common_misreads` | array | Known AI failure modes (misread + cause) |
| `anti_misread_rules` | array | Explicit rules to prevent misreads (rule + enforcement method) |
| `part_priority_order` | array | Ordered part list for prompt token weighting |

---

## Readability Gate Contract

**Input:** ObjectSpec
**Output:**

```json
{
  "verdict": "PASS | REVISE | REJECT",
  "reasons": ["..."],
  "fatal_flags": ["..."],
  "object_readable_as": "...",
  "readability_score": 0-100
}
```

| Verdict | Condition |
|---------|-----------|
| **PASS** | Score ≥ 60, no fatal flags |
| **REVISE** | Score < 60, no fatal flags |
| **REJECT** | Any fatal flag present |

**Fatal flags:**
- `MISSING_OBJECT_CLASS`
- `MISSING_READABLE_AS`
- `MISSING_IDENTITY_CORE`
- `NO_MUST_HAVE_PARTS`
- `NO_SILHOUETTE_RULES`
- `ABSTRACT_TRAP_IN_READABLE_AS`

**Quality checks (reduce score):**
- Too few required_visible parts
- Unspecified material
- Missing texture_descriptor
- No anti_misread_rules
- No common_misreads
- Unspecified topology
- No forbidden_silhouettes

---

## Prompt Compiler Role

Compiles a gate-passed ObjectSpec into two outputs:

- **prompt** — structured positive prompt built from:
  1. Shot prefix (macro product photography framing)
  2. Identity anchor (`readable_as`)
  3. Material truth (surface, texture)
  4. Must-have parts in `part_priority_order` sequence
  5. Anti-misread positive rules
  6. Silhouette contour features
  7. Topology hints
  8. Framing + lighting suffix

- **negative_prompt** — hard negatives built from:
  1. Anti-misread negative rules
  2. Forbidden parts
  3. Forbidden materials
  4. Forbidden silhouettes
  5. Common misread descriptions
  6. Universal object photography negatives

---

## Approved Object Library Contents

**1 master sample: `MASK_KITSUNE_CERAMIC_001`**

| Field | Value |
|-------|-------|
| object_class | mask |
| identity_core.name | Kitsune Porcelain Mask |
| readable_as | a symmetrical Japanese kitsune porcelain mask — white ceramic, fox-shaped, clearly a manufactured artifact |
| topology | ovoid with tapered snout, bilateral, frontal, vertical |
| must_have_parts | fox_ears, eye_slits, snout_bridge, cheekbones, rim_edge, mouth_line |
| forbidden_parts | human eyes, fur, organic skin, teeth, nose holes, straps, ornaments |
| material_truth | matte engineered ceramic, crimson kintsugi accent, eggshell microtexture |
| common_misreads | human face, abstract texture, flat 2D, realistic fox, generic oval, glossy figurine |
| anti_misread_rules | 8 rules (positive + negative enforcement) |
| part_priority_order | fox_ears → eye_slits → snout_bridge → rim_edge → cheekbones → mouth_line |
| approved | true |

**Design references (registry):** kitsune_noh_mask, hannya_mask

---

## Test Results — 35/35 PASS

| Test | Description | Result |
|------|-------------|--------|
| 1 | Kitsune mask intent → approved library match → PASS gate → compiled prompt | **13/13 PASS** |
| 2 | Abstract "texture field" intent → REJECT at normalizer | **3/3 PASS** |
| 3 | Vague "something beautiful" intent → REJECT at normalizer | **2/2 PASS** |
| 4 | Empty intent → REJECT | **2/2 PASS** |
| 5 | Unknown weapon → skeleton spec → gate evaluates | **7/7 PASS** |
| 6 | Mask master direct from library → gate PASS → full compile | **8/8 PASS** |

**Compiled mask master prompt:** 1605 chars positive, 927 chars negative, 15 compilation notes.
