# DEPRECATED OR UNTRUSTED AREAS

- `execution_lane` -> deprecated -> Legacy execution stack. Not the active hub-controlled runtime.
- `renderers` -> deprecated -> Legacy renderer bridge area. Not the single active Drive queue runtime.
- `system_control_plane` -> deprecated -> Older control stack. Current source of truth is MIKAGE/ plus modules.
- `control_core` -> deprecated -> Historical control area not used by the active hub flow.
- `orchestrator.js` -> deprecated -> Historical entrypoint. Live hub entry is start_mikage.bat -> MIKAGE/index.js.
- `server.js` -> deprecated -> Historical server entrypoint. Not the proven active runtime path for the image lane.
- `execution/execution_connector.js` -> untrusted_for_active_runtime -> Contains connector and bridge references that are not the current active image-lane source of truth.
- `docs/handoff` -> untrusted_for_current_handoff -> Legacy docs area. New handoff pack lives in docs/ai_handoff.
- `memory/README_DEPRECATED.md` -> deprecated -> Marker for older memory area. Current runtime memory interface is wrapped by MIKAGE/modules/memory/index.js.
- `state/run_state_authority.js` -> deprecated -> Historical state authority. Not the current source of truth for the handoff pack.

## Notes

- Non-image lanes are UNVERIFIED unless proven by active artifacts.
- Legacy bridge and proxy wording must not be treated as current runtime truth.
