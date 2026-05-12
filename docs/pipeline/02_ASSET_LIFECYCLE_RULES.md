# 02_ASSET_LIFECYCLE_RULES

## 1. Purpose

Defines the complete lifecycle of a Mikage asset from first generation through canon lock,
downstream use, and eventual deprecation. Every status is defined precisely. Every
transition requires documented evidence.

---

## 2. Asset Statuses

### 2.1 MISSING_REQUIRED

The slot is defined in the pipeline spec but no asset exists yet.
A MISSING_REQUIRED slot blocks the current phase from completing.

- No downstream use permitted.
- Blocks all phase advancement conditions that depend on this slot.
- Requires a BUILD task to fill it.

### 2.2 REVIEW_CANDIDATE

An asset has been generated and placed in the candidate folder. It has not yet passed
the Quick-Pass Gate or formal evaluation.

- No downstream use permitted until gate result.
- May not be referenced as a reference, source, or anchor.
- Must have: generation date, seed, workflow script, output path documented.
- Quick-Pass Gate must be applied before advancing.

### 2.3 TEMP_REFERENCE

An asset has passed formal evaluation (INCLUDE_AS_PHASE4_REFERENCE or equivalent) and
is included in the active phase stack. It is not canon-locked.

- May be used as IP-Adapter conditioning source in approved workflow scripts.
- May be used as img2img base if explicitly listed in an approved execution packet.
- May not be called production-ready, canon-approved, or asset-locked.
- May not be used for public output, film plates, or cinematic production.
- Status may be downgraded to FAILED_DO_NOT_USE if new evidence reveals violations.

### 2.4 LOCKED_CANON

An asset has received human canon approval and an asset lock document.
This is the highest status an asset can hold.

- May be used as anchor / conditioning source in any approved workflow.
- May be used as a production reference if a separate production-readiness gate passes.
- Cannot be modified, replaced, or overridden without explicit human decision and new evidence.
- LOCKED_CANON status alone does not grant film plate, public output, or cinematic use.

### 2.5 FAILED_DO_NOT_USE

An asset has failed a gate, been identified as a wrong run, been explicitly rejected,
or been found to violate constraints at any point.

- No use of any kind.
- Must be documented with: date, failure reason, evidence report path.
- Cannot be promoted to any other status without explicit human decision and new evidence.
- The physical file is retained (not deleted) as an audit artifact.

### 2.6 DEPRECATED

An asset has been superseded by a newer version and is no longer actively used.

- May be read for historical context only.
- Must not influence active production decisions.
- Must not be used as a source, reference, or anchor.

### 2.7 UNKNOWN_NEEDS_REVIEW

An asset exists in the file system but its status is unclear or undocumented.

- No use permitted until status is resolved.
- A review task must be created within one task cycle.
- After review: assign correct status and document.

---

## 3. Lifecycle Transitions

```
MISSING_REQUIRED
      │
      ▼  [BUILD task + generation attempt]
REVIEW_CANDIDATE
      │
      ├─[Quick-Pass Gate FAIL]────────────────► FAILED_DO_NOT_USE
      │
      ├─[Formal evaluation INCLUDE_AS_PHASE4_REFERENCE]──► TEMP_REFERENCE
      │
      └─[Formal evaluation REJECT / HOLD_FOR_REWORK]───► FAILED_DO_NOT_USE
                                                          (or back to MISSING_REQUIRED)

TEMP_REFERENCE
      │
      ├─[Human canon approval + asset lock]──► LOCKED_CANON
      │
      ├─[New violation found]─────────────────► FAILED_DO_NOT_USE
      │
      └─[Superseded by V2]────────────────────► DEPRECATED

LOCKED_CANON
      │
      ├─[Superseded by new version + human decision]──► DEPRECATED
      │
      └─[Cannot be modified — any output derived from a locked asset
         without approved workflow is FAILED_DO_NOT_USE]

UNKNOWN_NEEDS_REVIEW
      │
      └─[Review task complete]────────────────► any valid status above
```

---

## 4. Evidence Requirements Per Transition

| Transition | Required evidence |
|---|---|
| MISSING_REQUIRED → REVIEW_CANDIDATE | Execution packet path, script path, seed, output path, generation date |
| REVIEW_CANDIDATE → TEMP_REFERENCE | Evidence package: candidate path, review report, anchor comparison table, Quick-Pass Gate PASS, formal evaluation record |
| REVIEW_CANDIDATE → FAILED_DO_NOT_USE | Fail report with: violation list, Quick-Pass Gate result, date |
| TEMP_REFERENCE → LOCKED_CANON | Human canon approval document + asset lock document |
| Any status → FAILED_DO_NOT_USE | Failure evidence: date, reason, report path |
| Any status → DEPRECATED | Supersession evidence: new version path, decision record |
| UNKNOWN_NEEDS_REVIEW → (any) | Review task report + status assignment |

---

## 5. Wrong Run Protocol

A **wrong run** occurs when a ComfyUI generation produces output that does not match
the approved execution packet on any of these axes:

| Axis | Expected source | Check method |
|---|---|---|
| Output filename prefix | Execution packet Section 2 | String match |
| Output directory | Execution packet Section 1 | Path match |
| Resolution (W×H) | Execution packet Section 6 | Image metadata |
| Batch size | Execution packet Section 6 | File count per run |
| Script path | Execution packet header | File identity |
| Task ID / packet version | Execution packet header | Document identity |

If any axis mismatches:
1. Do not accept the output as a candidate.
2. Assign status FAILED_DO_NOT_USE to all outputs from the run.
3. Create a wrong-run report documenting: actual vs expected values for each axis.
4. Create a repair task before any new generation attempt.

---

## 6. No Retry Without Repair

After any FAILED_DO_NOT_USE outcome from a generation attempt:

1. A repair task (ASSET-BUILD-0N repair) must complete before re-run.
2. The repair task must identify the root cause.
3. The repair task must produce a corrected execution packet or script.
4. Static validation must pass on the corrected workflow.
5. Only then may a new generation attempt be authorised.

---

## 7. Asset Naming Convention

All candidate outputs must follow this convention (from ASSET-BUILD-02 Section 2):

```
MIKAGE_BUST_BRIDGE_CAND_[XX]_[STATUS]_[DATE].png
```

| Token | Values |
|---|---|
| `[XX]` | Two-digit sequence: 01, 02, 03… |
| `[STATUS]` | REVIEW_CANDIDATE · HOLD_REWORK · DISCARD |
| `[DATE]` | YYYYMMDD |

Forbidden tokens in any output filename: `PASS · CANON · LOCKED · APPROVED · PRODUCTION · FINAL`

Any output with a forbidden token in its filename is automatically FAILED_DO_NOT_USE.
Any output with a non-compliant filename (e.g., `test_minimal_00001_`) is automatically FAILED_DO_NOT_USE.
