# DRIVE BRIDGE CONTRACT - PHASE 6.6

## Purpose

Lock the shared runtime contract between the local control plane, the Colab execution lane, and the dashboard.
All three must point at the same `mikage_runner` bus without adding another orchestration layer.

## Path Contract

| Role | Local staging | Shared Runtime (Google Drive) |
|------|---------------|-------------------------------|
| **Root** | `D:\KAGAMI-MZ\drive_staging` | `MyDrive/mikage_runner` |
| **Job inbox** | `D:\KAGAMI-MZ\drive_staging\job_inbox` | `MyDrive/mikage_runner/job_inbox` |
| **Claims** | `D:\KAGAMI-MZ\drive_staging\claims` | `MyDrive/mikage_runner/claims` |
| **Outputs** | `D:\KAGAMI-MZ\drive_staging\outputs` | `MyDrive/mikage_runner/outputs` |
| **Logs** | `D:\KAGAMI-MZ\drive_staging\logs` | `MyDrive/mikage_runner/logs` |

## Env Override

```txt
DRIVE_ROOT=<path>
```

- Default: `D:\KAGAMI-MZ\drive_staging`
- On Colab: `/content/drive/MyDrive/mikage_runner`
- All subfolders (`job_inbox/`, `claims/`, `outputs/`, `logs/`) are relative to `DRIVE_ROOT`

## Job File Contract

**Filename:** `{job_id}.json` inside `job_inbox/`

**Required top-level fields:**

```json
{
  "job_id": "JOB_...",
  "lane": "mask_macro",
  "idea": "user idea",
  "prompt": "compiled prompt",
  "execution_target": "colab_runner"
}
```

Additional metadata may be present, but these fields must always exist.

## Invariants

1. **Same shared root** - all runtime actors point at the same `mikage_runner` folder
2. **Same filename behavior** - `{job_id}.json` in `job_inbox/`
3. **Same control-plane write contract** - `job_id`, `lane`, `idea`, `prompt`, `execution_target`
4. **Final state anchor** - `outputs/{job_id}/result.json` is the only terminal state source
5. **Single inbox write** - one JSON file per dispatch, no append, no partial writes
6. **Flat contract** - `job_inbox/`, `claims/`, `outputs/`, and `logs/` stay flat and simple

## Lifecycle

```txt
LOCAL /run      -> job_inbox/{job_id}.json
COLAB claim     -> claims/{job_id}.json
COLAB artifacts -> outputs/{job_id}/output.png
COLAB final     -> outputs/{job_id}/result.json
DASHBOARD read  -> job_inbox + claims + outputs + logs
```

## State Mapping

- `pending`: inbox file exists, no claim, no terminal `result.json`
- `running`: claim file exists, no terminal `result.json`
- `completed`: `outputs/{job_id}/result.json` exists with success status
- `failed`: `outputs/{job_id}/result.json` exists with failure status

## Swap Procedure

To switch from local staging to real Google Drive:
1. Mount or sync the shared folder locally if the control plane is using the filesystem path.
2. Set `DRIVE_ROOT` to the mounted path, for example `G:\My Drive\mikage_runner`.
3. Share the same `mikage_runner` folder with the dashboard service account.
4. For the dashboard backend, configure Google Drive API credentials and point them at the same folder.
