TASK: CE15_ACTOR_COLLISION_REPROOF_04  (DIAGNOSE HAND CHAIN -> RUN IF CLEAR)

CONTEXT
REPROOF_03: control-driven rig confirmed; head chain articulates via
head_ctrl; hand.R chain frozen even via hand.R_ctrl with IK muted. Cause
UNCONFIRMED. This task diagnoses by instrumentation (no guessing), applies
a minimal fix IF the root cause is found and the fix is reversible inside
the staging file, and continues to the full gate ONLY if §2.7 then passes
on BOTH chains.

AUTHORIZATION
Open/save staging blend only (save ONLY if a fix is applied and verified;
new sha = anchor v2 declared). Sources byte-identical. Tripwire 79.
NOT AUTHORIZED: source edits · rig semantic redesign (that would be a
new-rig project -> stop and report instead) · forcing any pass · asset
lock · commit · push.

STEP D1 — INSTRUMENTED DIAGNOSIS of the hand.R chain. Candidates to test
one at a time, measuring after each (never assume):
  a. DEPENDENCY CYCLE: parse Blender's stdout/stderr for "Dependency
     cycle detected" — if hand.R_ctrl is (directly or via parents)
     dependent on the armature/hand bone, the depsgraph silently drops
     the constraint. Report the full cycle if present.
  b. Constraint spaces: COPY_LOCATION/ROTATION target_space/owner_space
     combinations that map world motion to zero.
  c. Bone locks: hand.R lock_location/rotation/scale states.
  d. Control parenting: hand.R_ctrl's parent chain and whether moving it
     in the measured space actually changes its own world matrix (measure
     the CTRL's world matrix delta first — if the ctrl itself doesn't
     move, the bone never will).
  e. Constraint evaluation order / duplicate constraints / drivers on
     the constraint influence.
  Report each candidate's measured result, including the negatives.

STEP D2 — HEAD MAGNITUDE CHECK (the flagged 0.893287 m for +30°):
compute the expected arc from the head bone pivot to the hair mesh bound
and compare. If the discrepancy is a bind/scale artifact, identify it —
it may share a root cause with D1.

STEP D3 — MINIMAL FIX (only if D1 found the root cause)
Apply the smallest reversible change inside staging (e.g. re-parent a
ctrl, correct a constraint space, clear a lock). Document before/after.
Re-run §2.7 on BOTH chains (head + hand.R): both must show clearly
nonzero, anatomically-correct displacement. If the fix would change rig
semantics or touch sources: STOP and report options instead.

STEP D4 — IF AND ONLY IF §2.7 PASSES BOTH CHAINS: continue REPROOF_03's
Steps 3-5 unchanged (verify geometry 1.753685/0.853542/1.200000 · author
poses on the CONTROL layer as reconstructible data · run 5x3 matrix per
METHOD_V1 with per-pose drift > 0 recorded · verdict + paperwork,
whitelist three, anchor v2). PASS -> authorized_next_step =
PRODUCTION_ASSET_LOCK_SIGNATURE. Any overlap -> FAIL with numbers.
If §2.7 still fails: BLOCKED report with the full diagnostic table.

VALIDATION
Sources byte-identical · tripwire 79 · validator PASS · every cited path
resolves · git whitelist three only (none if no fix applied).
CLOSE with the standard RESULT block. Mark unknowns UNCONFIRMED.
