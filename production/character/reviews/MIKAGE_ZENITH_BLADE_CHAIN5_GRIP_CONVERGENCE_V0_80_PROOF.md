# V0.80 Chain-5 Grip Convergence — Rejected

Build/reopen passed and pose-only grip convergence passed, but full phase
validation failed because the actor deformation-smoke actions also advanced
at frame 31.

```text
P1 marker delta: <= 0.000001 m
P2 marker delta: ~0.554496 m
P3 marker delta: <= 0.000001 m
PROMOTION: NO
```

The failure established that actor action time and Blade phase time had to be
decoupled. The failed `.blend` candidate is not retained.

