# RUNTIME BOUNDARY

## Active Runtime Contract

Ordered path:

1. `start_mikage.bat`
2. `MIKAGE/index.js`
3. `MIKAGE/modules/intake/index.js`
4. `MIKAGE/modules/generation/index.js`
5. `MIKAGE/modules/validation/index.js`
6. `MIKAGE/modules/decision/index.js`
7. `MIKAGE/modules/memory/index.js`
8. `runtime/drive_queue/runtime.js`
9. `runtime/colab_worker/colab_one_click_worker.ipynb`

## Runtime Boundary Rules

- control-plane portability work must not alter image/render execution behavior
- desktop operator / observer / bridge logic may observe or orchestrate workflow, but may not mutate render contract
- local control agent may report runtime state, but is not the image runtime itself

## Protected Runtime Files

- `start_mikage.bat`
- `MIKAGE/index.js`
- `runtime/drive_queue/runtime.js`
- `runtime/colab_worker/*`

## Runtime-Safe Read-Only Status Mapping

Allowed:
- reading branch / commit / repo cleanliness
- reading bridge status
- reading local agent status
- reading snapshot/report manifests
- observing desktop context

Not allowed without explicit runtime task:
- changing `/generate` path assumptions
- changing Drive queue contract
- changing Colab worker output contract
- changing image lane control semantics

## Active Services

- `local_control_agent` for filesystem-bridge command handling
- `commander_bridge` filesystem contract
- image runtime remains `Drive queue + Colab worker`

## Hard Rule

- NO IMAGE = NO PASS
