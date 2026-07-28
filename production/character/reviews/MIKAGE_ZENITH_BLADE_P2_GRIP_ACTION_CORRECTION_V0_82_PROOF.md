# V0.82 P2 Grip Action Correction — Rejected

Multiple bake methods were tested in the bounded derivative. None preserved a
valid P2 registration result; the final measured P2 delta remained
approximately `0.554496 m`.

The source stayed hash-identical and frames 1/61 were preserved, but:

```text
BUILD_PASS: NO
PROMOTION: NO
```

The failed `.blend` candidate is not retained. This pass led to the correct
finding that nine actor/control actions—not only the armature action—were
coupled to Blade phase time.

