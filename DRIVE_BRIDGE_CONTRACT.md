# DRIVE BRIDGE CONTRACT — PHASE 6.6

## Purpose

Lock the shared path contract between local dispatcher staging and Colab Drive inbox.
Swapping from local staging to real Google Drive must not change job format, filename behavior, or execution_target.

## Path Contract

| Role | Current (local staging) | Future (Google Drive) |
|------|------------------------|-----------------------|
| **Root** | `D:\KAGAMI-MZ\drive_staging` | `MyDrive/mikage_runner` |
| **Job inbox** | `D:\KAGAMI-MZ\drive_staging\job_inbox` | `MyDrive/mikage_runner/job_inbox` |
| **Job processing** | `D:\KAGAMI-MZ\drive_staging\job_processing` | `MyDrive/mikage_runner/job_processing` |
| **Job done** | `D:\KAGAMI-MZ\drive_staging\job_done` | `MyDrive/mikage_runner/job_done` |
| **Job failed** | `D:\KAGAMI-MZ\drive_staging\job_failed` | `MyDrive/mikage_runner/job_failed` |
| **Outputs** | `D:\KAGAMI-MZ\drive_staging\outputs` | `MyDrive/mikage_runner/outputs` |

## Env Override

```
DRIVE_ROOT=<path>
```

- Default: `D:\KAGAMI-MZ\drive_staging`
- On Colab: `/content/drive/MyDrive/mikage_runner`
- All subfolders (`job_inbox/`, `job_done/`, etc.) are relative to `DRIVE_ROOT`

## Job File Contract

**Filename:** `{job_id}.json` inside `job_inbox/`

**Schema:**

```json
{
  "job_id": "JOB_{spec_job_id}_{iso_timestamp}",
  "patched_job_spec": { ... },
  "execution_target": "colab_runner",
  "created_at": "ISO-8601"
}
```

## Invariants

1. **Same JSON contract** — identical schema whether written to local staging or real Drive
2. **Same filename behavior** — `{job_id}.json` in `job_inbox/`
3. **Same execution_target** — always `"colab_runner"`
4. **Single write** — one `writeFileSync` per job, no append, no partial
5. **No retry** — writer does not retry on failure
6. **No queue** — inbox is a flat folder of JSON files, not a queue system

## Lifecycle

```
LOCAL writes   →  job_inbox/{job_id}.json
COLAB picks up →  moves to job_processing/{job_id}.json
COLAB succeeds →  moves to job_done/{job_id}.json   + writes outputs/{job_id}/
COLAB fails    →  moves to job_failed/{job_id}.json
LOCAL polls    →  reads job_done or job_failed, writes execution_result.json locally
```

## Swap Procedure

To switch from local staging to real Google Drive:
1. Install Google Drive for Desktop
2. Set `DRIVE_ROOT` to the mounted Drive path (e.g., `G:\My Drive\mikage_runner`)
3. No code changes required
