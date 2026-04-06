# STORAGE POLICY LOCK

## D:\ Drive Purpose

D:\ is **code and runtime only**. It is not long-term artifact storage.

## Rules

### Runs are ephemeral
- `D:\KAGAMI-MZ\runs\*` contents are ephemeral unless explicitly locked by a phase contract.
- Any run older than 7 days can be removed without notice.
- Only runs referenced by an active execution proof or locked phase should be preserved.

### Outputs are reproducible
- `D:\Fooocus-main\outputs\` — deleted. Local Fooocus is forbidden per Phase 6.
- Any future generated images are written to Google Drive via Colab, not locally.

### Local staging is temporary
- `D:\KAGAMI-MZ\drive_staging\` must not accumulate data once the real Google Drive path is mounted.
- When `DRIVE_ROOT` points to a real Drive mount, local staging should be cleared.

### Fooocus models
- Local Fooocus execution is **forbidden** per Phase 6 architecture lock.
- Only `juggernautXL_v8Rundiffusion.safetensors` (6.6 GB) is retained as emergency backup.
- All other checkpoints, clip_vision, and controlnet models have been removed.
- `D:\Fooocus-main\env\` (Python venv) has been removed. Recreatable if ever needed.

### Ollama
- `D:\ollama\` (6.2 GB) is outside Mikage scope. User-managed.

### Games / Media
- `D:\stream\` (46 GB), `D:\Riot Games\` (37.6 GB) are outside Mikage scope. User-managed.

## Enforcement

Before any Phase creates large artifacts on D:\, it must:
1. Check free space (`Get-Volume -DriveLetter D`)
2. Target Google Drive or C:\ for large outputs
3. Clean ephemeral runs before generating new ones

## Cleanup executed: 2026-04-06

| Deleted | Size |
|---------|------|
| `Fooocus-main\env` | 5.15 GB |
| `Fooocus-main\models\checkpoints` (2 of 3) | ~13 GB |
| `Fooocus-main\models\clip_vision` | 1.84 GB |
| `Fooocus-main\models\controlnet` | 1.68 GB |
| `Fooocus-main\outputs` | 0.36 GB |
| `KAGAMI-MZ\runs\*` (all run artifacts) | ~0.3 GB |
| **Total freed** | **~22.7 GB** |
