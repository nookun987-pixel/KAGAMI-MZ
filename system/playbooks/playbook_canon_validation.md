# CANON VALIDATION PLAYBOOK

## READ IN ORDER
1. `CANON_V2.md`
2. `STRUCTURED_RULES.json`
3. `PASS_FAIL_CHECKLIST.md`
4. `render/validators/rule_engine.js`
5. related analyzers and validation runners

## CHECKLIST
- hard fail rules are not weakened unintentionally
- ALLOW cannot happen without validator execution
- NO IMAGE = NO PASS remains enforced
- semantic signals still map correctly into rule engine
- canon docs sync after code only

## COMMON FAILURES
- prompt rules changed but checklist not updated
- analyzer signal names changed and rule engine mapping breaks
- UNKNOWN validator state slips through as PASS
- docs claim canon behavior that runtime does not enforce

## ACCEPTANCE
- canon gate remains strict
- validation path is internally consistent
- no-image-no-pass invariant remains true
- docs sync happens after canonical code and rules are correct
