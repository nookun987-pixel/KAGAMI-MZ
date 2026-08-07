# MIKAGE ACTOR REFERENCE AUDIT 01 — SOURCE MANIFEST

**Task:** `MIKAGE_ACTOR_REFERENCE_AUDIT_01` · **Date:** 2026-08-07 · **Mode:** strictly read-only
**Parent:** [MIKAGE_ACTOR_REFERENCE_AUDIT_01.md](MIKAGE_ACTOR_REFERENCE_AUDIT_01.md) ·
[MIKAGE_ACTOR_VARIANT_INVENTORY_01.md](MIKAGE_ACTOR_VARIANT_INVENTORY_01.md)

Every hash computed with `sha256sum` from the file on disk during this audit. None hand-typed, none
carried over, none invented. Where a hash also appears in an existing repo manifest, it matched.

---

## 1. Produced artifacts (new files only)

| File | SHA-256 | Bytes |
|---|---|---|
| `MIKAGE_ACTOR_REFERENCE_AUDIT_01.md` | `d19aa8f404691d961a50a08a0f047beeea000f5e3d19de2bcb1491003c07680a` | 15563 |
| `MIKAGE_ACTOR_VARIANT_INVENTORY_01.md` | `7c5ab67a9ea5756f9e5e54d13a93e88d1786bcb5c80c70da2e9e7b366a3edef1` | 6850 |

> This manifest is written last and does not hash itself. Verify by recomputing its sha256 from disk.

---

## 2. Scenes read (Blender headless, read-only — sha256 identical pre/post)

| Path | SHA-256 pre-read | SHA-256 post-read | Result |
|---|---|---|---|
| `renders/board_v1_evidence/ZENITH_BLADE_CE15_SOURCE.blend` | `465b212ef49a4b8ad3eacd682757d9fe0512fa5d242c1b09611439b9c76c3129` | identical | **UNCHANGED** |
| `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89.blend` | `15e61aa961d4bfe10a0217f6a2ddf36373622744554564411c4c58a178c94b89` | identical | **UNCHANGED** |

Invocation: `blender --background <file> --factory-startup --python <script> -- <out.json>`.
The inspection script contains no `save`, `write`, `ops.wm.save*` or file-creation call targeting the
repo; its only output is JSON written to the session scratchpad **outside** the repository.

---

## 3. Cited evidence

### 3.1 Actor / rig lineage records

| Path | SHA-256 |
|---|---|
| `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_1.blend` | `c7a14de05c603da15a6e1b5f5dd43bbb7356107e567fd9d11fce44e4b7c2ae94` |
| `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend` | `d6910500b71cbf662f94d920d0bc51955e5313b863cf5787229c770808db8996` |
| `docs/reports/MIKAGE_PRODUCTION_RIG_ARMATURE_AUDIT_V0_1.md` | `bbfa9fbd2b71fd91bc082792fb7c5440375fd5ac52287d7eb16d3b928b0e488a` |
| `docs/reports/MIKAGE_MESH_TOPOLOGY_AUDIT_V0_1.md` | `8ee921ed9e20c78ba9a2b53d03a5de8ee6d095bd661b4664170e3a846e850148` |
| `production/character/reviews/MIKAGE_PRODUCTION_RIG_READINESS_AUDIT_V0_1.md` | `9318075342d03dee62d9709514d042c635143e5e723737a03ca8d0915d8e09fb` |
| `production/character/reviews/MIKAGE_MESH_PREP_OPERATOR_REVIEW_V0_1.md` | `37745df405c7e7d046d2d1bf8ac72a8bdf40e6b828b203b6572c3b60eb7f8be0` |
| `production/character/reviews/MIKAGE_MESH_PREP_BEFORE_RIG_TEST_V0_1_PROOF.md` | `4fb53c2c0bf2749e2ca7b45c18df51fb48854446d0d2f9482b6e6e4868546561` |

### 3.2 V0.89 collision proof — the tested actor build

| Path | SHA-256 |
|---|---|
| `production/character/reviews/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89_PROOF.md` | `d1f37d0541bf7e7877c2256ada06204cc43cc1c0428bd6b0579f0600e5a63c97` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89_REPORT.json` | `9c3b54c233cd2617fa2ab3b825dbe096e676c984a180252135be64cea45d5fdb` |
| `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_COLLISION_OWNERSHIP_V0_87.blend` (V0.89's declared source) | `b9a4c05cd6eef28ccc1f98d0f929d69e2f1c93097ee6c7a206c2538db74ce8df` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_COLLISION_OWNERSHIP_V0_87_PROOF.md` | `495ab448a88b402c6105da555b198c0a51010c66468826f25ee4c984921bcbd4` |

### 3.3 EDGE_B1 — source of the 1.753685 m figure and the scale factor

| Path | SHA-256 |
|---|---|
| `production/character/reviews/MIKAGE_ZENITH_BLADE_EDGE_B1_PROOF.md` | `b4b367b9142bbbe4348ccc73a610eafcb9601a8f0ed13803953e6153d909300f` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_EDGE_B1_REPORT.json` | `aaf63959ce0205472e08e964e43f5f9cbc6fea0bd926a9063a16be4abfb60e3f` |

### 3.4 OUT4 / board — source of the 3.45 m and proxy figures

| Path | SHA-256 |
|---|---|
| `renders/board_v1_evidence/RUN_LOG_outstanding_renders_v2.json` | `6879fe6e74fc2dc26b04dc992d34c97732bb313a97542ebc995c1ad73274a9ff` ✅ matches Board V1 manifest |
| `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md` | `30471b4e61a70513e2cc64eb0149ddd7770c61b4236193d27159f77f8e273179` ✅ matches canon lock evidence block |

### 3.5 Contract and doctrine

| Path | SHA-256 |
|---|---|
| `ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md` | `22861dda206318e356b1539a1851b1f4d431e15558f2b7d0e09ae5db87cd6250` |
| `ZENITH_BLADE_OPERATION_DOCTRINE_V1.md` | `963e70108c329cc6fd4d7c15d47044a6c87b9e04f4478f2d47deb1dc7adc36e1` ✅ matches paperwork registry |
| `renders/board_v1_evidence/BASELINE_METHOD.md` (tripwire scope rule cited in §4b) | `a01a0973daff6ad4df7f93a42fdb3c4ca36527c8a3f84b30f71c2c2c781f5891` ✅ matches Board V1 manifest |

---

## 4. Integrity verification — pre and post

| Check | Expected | Pre | Post | Result |
|---|---|---|---|---|
| Workstation tripwire v2 | `3a62ac63849609a37ee3282bcb10259061039db76133ee3623d2ed279bcc44c9` | match | match | **UNCHANGED** |
| Tripwire file count | 79 | 79 | 79 | **UNCHANGED** |
| CE15 anchor, `_tmp` original | `465b212ef49a4b8ad3eacd682757d9fe0512fa5d242c1b09611439b9c76c3129` | match | match | **UNCHANGED** |
| CE15 anchor, durable copy | same | match | match | **UNCHANGED** |
| `ZENITH_BLADE_PAPERWORK_VALIDATOR.py` | PASS | PASS | PASS | **UNCHANGED** |
| Tracked modifications **by this task** | 0 | — | 0 | **CLEAN** |
| Tracked modifications carried in from `ZENITH_BLADE_DOCTRINE_ISSUE_01` | — | 4 | 4 | untouched, not reverted |

---

## 5. Method statement

- **Read-only.** No `.blend` was saved, edited, created or deleted. Blender ran in `--background
  --factory-startup` mode purely to evaluate scene data.
- **No repo file was written** except the three new deliverables in §1.
- **No value was estimated, merged or averaged across variants.** Where a height could not be
  isolated, the audit says so and marks it UNCONFIRMED rather than approximating.
- **No hash was hand-typed.** All were computed from disk in this session.
- No collision run, no asset lock, no production claim, no geometry or material action.

---

*End of MIKAGE_ACTOR_REFERENCE_AUDIT_01_SOURCE_MANIFEST. No commit, no push.*
