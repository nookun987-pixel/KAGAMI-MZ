# 00_LATEST_CODEX_HANDOFF

## 1. Latest Completed Task

`MIKAGE_CHARACTER_ANCHOR_V1_PASS_DECISION_REPORT` - complete.

## 2. Confirmed Pushed State

Use commit `4970acd` as the confirmed pushed state.

```text
4970acd character: R4 helmet-only inpaint PASS for Anchor V1
```

Commit `4970acd` contains:

- `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png`
- `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001_MASK.png`
- `reports/SCORE_P3A_R4_HELMET_INPAINT_ANCHOR_CANDIDATE.md`

## 3. Latest Result

R4 helmet-only inpaint output exists and scored **100/100 PASS**.

The usable Anchor V1 candidate is:

```text
docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png
```

The inpaint preserved body, shoulders/pauldrons, armor, sword, hair, pose, lighting, palette, and background. The helmet contains exactly two separate ultra-thin horizontal void-black sensor slits with a visible white porcelain gap.

No canon lock or asset lock has been claimed.

## 4. Current Decision State

| Field | Value |
|---|---|
| CURRENT_BEST_BASE | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| ANCHOR_V1_STATUS | `PASS_AS_USABLE_CANDIDATE` |
| FULL_BODY_R6_ALLOWED | NO |
| NEXT_SAFE_TASK | `PREPARE_ANCHOR_V1_LOCK_REVIEW` |
| CANON_LOCK_STATUS | `NOT_LOCKED` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |

## 5. Latest Report Paths

- `reports/SCORE_P3A_R4_HELMET_INPAINT_ANCHOR_CANDIDATE.md`
- `reports/MIKAGE_CHARACTER_ANCHOR_V1_PASS_DECISION_REPORT.md`

## 6. Next Safe Task

```text
PREPARE_ANCHOR_V1_LOCK_REVIEW
```

Prepare a lock review package using `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` as the current best base. Do not run full-body R6 generation.

## 7. Forbidden Until Lock Review

- Do not claim canon lock.
- Do not claim asset lock.
- Do not run full-body R6.
- Do not replace the current best base with R5.
- Do not change source pack or silhouette lock spec.
