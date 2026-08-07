# -*- coding: utf-8 -*-
"""
ZENITH_BLADE_PAPERWORK_VALIDATOR
================================

Byte-frozen enforcement for the Zenith Blade paperwork package.

Created 2026-08-07 by task `ZENITH_BLADE_PAPERWORK_ISSUE_01`.

NOTE ON PROVENANCE: the issuing brief said "extend the validator". No validator existed
to extend -- a repo-wide search for a byte-frozen/paperwork enforcement script over *.py
and *.js returned nothing. This file is therefore NEW, not an extension. Recorded here so
the record is accurate.

WHAT IT ENFORCES
  1. CORE_FROZEN      - signed/locked documents that must never change without an errata.
  2. paperwork_registry - the seven documents signed 2026-08-06, read live from
                        ZENITH_BLADE_FINAL_DESIGN_BOARD_V1_MANIFEST.json so the list
                        cannot drift out of sync with the manifest.
  3. Workstation tripwire v2 (mtime+path over blade .blend files) and the CE15 content anchor.
  4. No residual "PENDING OPERATOR SIGNATURE" anywhere in the package.
  5. Guard lines (ASSET LOCK / PRODUCTION READY: NOT ISSUED) still present.
  6. The manifest reparses as JSON.

USAGE
  python ZENITH_BLADE_PAPERWORK_VALIDATOR.py            # run from repo root
  exit 0 = PASS, exit 1 = FAIL

TO ADD A DOCUMENT TO ENFORCEMENT
  Signed paperwork -> add it to `paperwork_registry.documents` in the manifest; this
  validator picks it up automatically. Anything else -> add it to CORE_FROZEN below.

THIS SCRIPT GRANTS NOTHING. It does not asset-lock, approve, or mark anything
production-ready. It only detects unauthorized edits.
"""

import hashlib
import json
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.abspath(__file__))
MANIFEST = "ZENITH_BLADE_FINAL_DESIGN_BOARD_V1_MANIFEST.json"

# --- 1. core byte-frozen list (signed/locked before the 2026-08-06 paperwork round) -------
CORE_FROZEN = {
    "ZENITH_BLADE_CANON_LOCK_V1.md":
        "a2f340678aa27725c3f09b6fd42c4ebc3017946425ffcdd4832575bf2541427c",
    "ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md":
        "ad30196a92cd7003e1381b3a5325a27a495b30784aa67a072bd70452b96448a2",
    "ZENITH_BLADE_MATERIAL_CANON_V1.md":
        "5b4c04f3777fa3685c5d47134b016a957f48bcd56f5e4ed00d874f5d926e2d20",
    "ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md":
        "033858de1214e1427c3c3b9ee5548c765d275d382c1230c9b465033752affadd",
    "ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.png":
        "62deec95df990893324ef376719c026ad14a8ce86b64fd213c58e439be9dd8d5",
    "ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md":
        "30471b4e61a70513e2cc64eb0149ddd7770c61b4236193d27159f77f8e273179",
    "ZENITH_BLADE_LINEAGE_AUDIT_01.md":
        "6e9c268f53bfb742c19d6f43a760d9c2c8f2464aea4647c0d6de003d5d86af2e",
    "ZENITH_BLADE_DELTA_TABLE_01.md":
        "bbdc5823ad671808e3e270f8f3b2c5748d4ce40c1fd3df30200ea6bb45084a8a",
    "ZENITH_BLADE_MOCK_VS_CE15_SIDEBYSIDE.png":
        "e050acf0351942669e5ab6f5ab7a065c88898cb86559be3cf263e5144d7f75ba",
    "MIKAGE_ZENITH_CANON_V2.md":
        "4bafe29a2d8a60c4c54a6de4dd6920b003ddf56679f72bc79c405a7e7b1d5e9c",
    "design_system/mikage-cine-color-contract.md":
        "5c2b73a35890df0a92a8e72a0b4257d71be41ca0092e9b9d4e0075b82a18ab2b",
    "docs/handoff/MIKAGE_ZENITH_STRUCTURE_APPROVAL_AND_LOCK_READINESS_20260602.md":
        "e48335bb83663a37acb1728c4c944e0f6359e3a193ced8dc816eb5105b3b629c",
    "docs/MIKAGE_OFFICIAL_VISUAL_BOUNDARY_V1.md":
        "285acc72321b5ad44341278a3b70d8f5db34f47bb54d4d01cc5763a5e29b7274",
    # --- actor reference programme, 2026-08-07 (MIKAGE_ACTOR_STAGE_BUILD_01) ---
    "MIKAGE_ACTOR_REFERENCE_AUDIT_01.md":
        "d19aa8f404691d961a50a08a0f047beeea000f5e3d19de2bcb1491003c07680a",
    "MIKAGE_ACTOR_VARIANT_INVENTORY_01.md":
        "7c5ab67a9ea5756f9e5e54d13a93e88d1786bcb5c80c70da2e9e7b366a3edef1",
    "MIKAGE_ACTOR_STAGE_BUILD_01_REPORT.md":
        "b8a1013ef312d9f19fb9a08249e024f693185b73c8f20c2a4db3ca3128fd866c",
    # --- collision re-proof, 2026-08-07 (verdict BLOCKED) ---
    "MIKAGE_CE15_COLLISION_REPROOF_01.md":
        "745f1f2f08b861980d6436d286e068b388a9dcc44a45bdb78ba4a2781945b90a",
    "MIKAGE_CE15_COLLISION_REPROOF_01_REPORT.json":
        "f3b96746591d3a20ed38daafe5151a612f9db39f55208f8f83db068c73a514bd",
    # --- collision re-proof 02, 2026-08-07 (verdict BLOCKED, R1 infeasible) ---
    "MIKAGE_CE15_COLLISION_REPROOF_02.md":
        "70ad3024d48604d009ded088934b4dc1f043197c64a0595024cc8a304e69f4f3",
    "MIKAGE_CE15_COLLISION_REPROOF_02_REPORT.json":
        "29201a7bf4af555d4a67f734d8147400a7af004ef4e442c948efd81b376a2dc9",
    # --- collision re-proof 03, 2026-08-07 (BLOCKED; corrects REPROOF_02 diagnosis) ---
    "MIKAGE_CE15_COLLISION_REPROOF_03.md":
        "702a11f62f8f808632e30bc59f0028fbea82e7588ef9594a3077ed1d28ede9ca",
    "MIKAGE_CE15_COLLISION_REPROOF_03_REPORT.json":
        "d04ef234deb618a4b496b0ad16b640dea07b05236a8990dc441efefc89e4c81b",
}

TRIPWIRE_V2 = "3a62ac63849609a37ee3282bcb10259061039db76133ee3623d2ed279bcc44c9"
TRIPWIRE_COUNT = 79
CE15_ANCHOR = "465b212ef49a4b8ad3eacd682757d9fe0512fa5d242c1b09611439b9c76c3129"
# Collision staging anchor -- OUTSIDE the tripwire scope by design (filename carries
# neither "zenith" nor "blade"). Recorded so an unexpected change is visible.
STAGING_BLEND = "production/character/staging/MIKAGE_COLLISION_STAGE_01.blend"
STAGING_ANCHOR = "229c727f516b3653943c03ea687f796bd5101dd1ce30be1579d9ba4248c17e01"

CE15_PATHS = [
    "_tmp/zenith_blade_hero_e1_ce15/hero_cohesion_correction01/"
    "MIKAGE_ZENITH_BLADE_HERO_COHESION_CORRECTION_01_FIRST_PASSING_CANDIDATE.blend",
    "renders/board_v1_evidence/ZENITH_BLADE_CE15_SOURCE.blend",
]

# Files scanned for residual pre-signature language and for guard lines.
PACKAGE_MD = [
    "ZENITH_BLADE_WARM_COLOUR_RULING_V1.md",
    "MIKAGE_CINE_COLOR_CONTRACT_ERRATA_01.md",
    "MIKAGE_ZENITH_CANON_V2_ERRATA_01.md",
    "ZENITH_BLADE_V0_1_DISPOSITION.md",
    "ZENITH_BLADE_DELTA_TABLE_01_ERRATA_01.md",
    "ZENITH_BLADE_OPERATOR_RULING_GAP7_ERRATA_01.md",
    "MIKAGE_ZENITH_STRUCTURE_APPROVAL_ERRATA_01.md",
    "MIKAGE_ZENITH_BLADE_OPERATOR_PROMOTION_PACKET_V0_1_SUPERSEDED_NOTE.md",
    "ZENITH_BLADE_OPERATION_DOCTRINE_V1.md",
    "ZENITH_BLADE_BOARD_V1_MD_ERRATA_01.md",
    "MIKAGE_ACTOR_DESIGNATION_RULING_V1.md",
    "ZENITH_BLADE_OPERATION_DOCTRINE_V1_ERRATA_01.md",
    "MIKAGE_COLLISION_METHOD_V1.md",
]

fails = []
warns = []


def sha(rel):
    p = os.path.join(REPO, rel)
    if not os.path.isfile(p):
        return None
    h = hashlib.sha256()
    with open(p, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def check_frozen(label, table):
    for rel, expected in sorted(table.items()):
        actual = sha(rel)
        if actual is None:
            fails.append("%s: MISSING FILE %s" % (label, rel))
        elif actual != expected:
            fails.append("%s: HASH CHANGED %s\n    expected %s\n    observed %s\n"
                         "    -> an unauthorized edit. Revert it, or issue an errata and "
                         "update the frozen value deliberately." % (label, rel, expected, actual))
        else:
            print("  OK  %-78s %s" % (rel, expected[:16]))


print("ZENITH BLADE PAPERWORK VALIDATOR")
print("repo:", REPO)

print("\n[1] CORE byte-frozen documents (%d)" % len(CORE_FROZEN))
check_frozen("CORE_FROZEN", CORE_FROZEN)

print("\n[2] paperwork_registry (read live from the manifest)")
mpath = os.path.join(REPO, MANIFEST)
registry = {}
if not os.path.isfile(mpath):
    fails.append("manifest missing: " + MANIFEST)
else:
    try:
        with open(mpath, encoding="utf-8") as fh:
            man = json.load(fh)
        print("  OK  manifest reparses as JSON")
    except Exception as exc:  # noqa: BLE001
        man = None
        fails.append("manifest does not reparse as JSON: %s" % exc)
    if man is not None:
        docs = man.get("paperwork_registry", {}).get("documents", [])
        if not docs:
            fails.append("paperwork_registry.documents is empty or absent")
        for e in docs:
            registry[e["path"]] = e["sha256"]
        check_frozen("paperwork_registry", registry)

print("\n[3] workstation tripwire v2 + CE15 anchor")
try:
    names = []
    for root, dirs, files in os.walk(REPO):
        if "node_modules" in root or os.sep + ".git" in root:
            continue
        for f in files:
            if f.endswith(".blend"):
                rel = os.path.relpath(os.path.join(root, f), REPO).replace(os.sep, "/")
                if "node_modules" in rel.lower():
                    continue
                if "zenith" in rel.lower() or "blade" in rel.lower():
                    names.append("./" + rel)
    if len(names) != TRIPWIRE_COUNT:
        fails.append("tripwire COUNT %d != expected %d -- a blade .blend was added, removed "
                     "or renamed (check the file set before the hash)" % (len(names), TRIPWIRE_COUNT))
    else:
        print("  OK  tripwire count %d" % len(names))
    lines = []
    for n in sorted(names):
        lines.append("%d %s" % (int(os.path.getmtime(os.path.join(REPO, n[2:]))), n))
    got = hashlib.sha256(("\n".join(lines) + "\n").encode()).hexdigest()
    if got != TRIPWIRE_V2:
        warns.append("tripwire hash %s != expected %s.\n    NOTE: this pure-python "
                     "reimplementation must match the canonical shell method in\n"
                     "    renders/board_v1_evidence/BASELINE_METHOD.md. If the count is "
                     "correct, re-run the\n    canonical command before treating this as a "
                     "real Blender write." % (got[:16], TRIPWIRE_V2[:16]))
    else:
        print("  OK  tripwire v2 %s" % TRIPWIRE_V2[:16])
except Exception as exc:  # noqa: BLE001
    warns.append("tripwire check could not run: %s" % exc)

a = sha(STAGING_BLEND)
if a is None:
    warns.append("staging blend missing: " + STAGING_BLEND)
elif a != STAGING_ANCHOR:
    warns.append("staging anchor CHANGED at %s\n    expected %s\n    observed %s\n"
                 "    -> the collision stage was rebuilt; re-verify its measurements "
                 "before using it." % (STAGING_BLEND, STAGING_ANCHOR, a))
else:
    print("  OK  staging anchor %s" % STAGING_BLEND)

for p in CE15_PATHS:
    a = sha(p)
    if a is None:
        fails.append("CE15 anchor MISSING: " + p)
    elif a != CE15_ANCHOR:
        fails.append("CE15 anchor CHANGED at %s\n    expected %s\n    observed %s"
                     % (p, CE15_ANCHOR, a))
    else:
        print("  OK  CE15 anchor %s" % p)

print("\n[4] no residual PENDING OPERATOR SIGNATURE")
for rel in PACKAGE_MD:
    p = os.path.join(REPO, rel)
    if not os.path.isfile(p):
        fails.append("package file missing: " + rel)
        continue
    txt = open(p, encoding="utf-8").read()
    if "PENDING OPERATOR SIGNATURE" in txt:
        fails.append("residual 'PENDING OPERATOR SIGNATURE' in %s" % rel)
    else:
        print("  OK  %s" % rel)

print("\n[5] guard lines intact (ASSET LOCK / PRODUCTION READY: NOT ISSUED)")
for rel in PACKAGE_MD:
    p = os.path.join(REPO, rel)
    if not os.path.isfile(p):
        continue
    txt = open(p, encoding="utf-8").read()
    if "NOT ISSUED" not in txt:
        fails.append("guard line 'NOT ISSUED' absent from %s" % rel)
    else:
        print("  OK  %s" % rel)

print("\n" + "=" * 78)
for w in warns:
    print("WARN: %s" % w)
if fails:
    print("RESULT: FAIL (%d)" % len(fails))
    for f in fails:
        print("  - %s" % f)
    sys.exit(1)
print("RESULT: PASS -- %d core + %d registry documents byte-frozen and unchanged."
      % (len(CORE_FROZEN), len(registry)))
print("No asset lock, no production-ready status, and no canon authority is granted by this check.")
sys.exit(0)
