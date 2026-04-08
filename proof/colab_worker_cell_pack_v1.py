# CELL 1 — MOUNT DRIVE
# from google.colab import drive
# drive.mount('/content/drive')

# CELL 2 — IMPORT + PATHS
# import importlib.util
# import json
# import os
# import time
# from pathlib import Path
#
# ROOT = Path("/content/drive/MyDrive/mikage_runner")
# JOB_INBOX = ROOT / "job_inbox"
# OUTPUTS = ROOT / "outputs"
# CLAIMS = ROOT / "claims"
# LOGS = ROOT / "logs"
# WORKER_PATH = ROOT / "colab_worker.py"
# assert WORKER_PATH.exists(), f"missing worker: {WORKER_PATH}"
#
# spec = importlib.util.spec_from_file_location("mikage_worker", str(WORKER_PATH))
# worker = importlib.util.module_from_spec(spec)
# spec.loader.exec_module(worker)

# CELL 3 — ASSERT FOLDERS
# for folder in [ROOT, JOB_INBOX, OUTPUTS, CLAIMS, LOGS]:
#     folder.mkdir(parents=True, exist_ok=True)
#     print("OK", folder)

# CELL 4 — INSTALL DEPENDENCIES
# !pip -q install torch diffusers transformers accelerate safetensors sentencepiece

# CELL 5 — GPU CHECK
# import torch
# print("cuda_available =", torch.cuda.is_available())
# if torch.cuda.is_available():
#     print("gpu_name =", torch.cuda.get_device_name(0))

# CELL 6 — MODEL LOAD
# print("model_id =", worker.MODEL_ID)
# pipe = worker.load_pipeline()
# print("pipeline_loaded =", pipe is not None)

# CELL 7 — WORKER LOOP
# TARGET_JOBS = 10
# processed = 0
# started = time.time()
# while processed < TARGET_JOBS:
#     result = worker.scan_once()
#     if result:
#         processed += 1
#         print("processed", processed, result.get("job_id"))
#     else:
#         time.sleep(2)
#     if time.time() - started > 7200:
#         raise TimeoutError("worker loop timeout")

# CELL 8 — OPTIONAL SINGLE TEST JOB WRITER
# test_job = {
#   "job_id": "MASK-TEST-COLAB-001",
#   "lane": "MASK_MACRO",
#   "idea": "colab single test job",
#   "prompt": "matte black technical ceramic mask, centered front view, black void background, no human face",
#   "execution_target": "colab"
# }
# with open(JOB_INBOX / f"{test_job['job_id']}.json", "w", encoding="utf-8") as handle:
#     json.dump(test_job, handle, indent=2, ensure_ascii=False)
# print("wrote", test_job["job_id"])

# CELL 9 — BATCH SUMMARY EXPORT
# import hashlib
# REQUIRED = ["normalized_job.json", "request_payload.json", "execution_trace.json", "raw_response.json", "result.json", "output.png"]
# jobs = [
#   "MASK-BATCH-001","MASK-BATCH-002","MASK-BATCH-003","MASK-BATCH-004","MASK-BATCH-005",
#   "ENTITY-BATCH-001","ENTITY-BATCH-002","ENTITY-BATCH-003",
#   "WEAPON-BATCH-001","WEAPON-BATCH-002"
# ]
# summary = {"completed": 0, "png": 0, "full_artifacts": 0, "jobs": []}
# for job_id in jobs:
#     out_dir = OUTPUTS / job_id
#     present = [name for name in REQUIRED if (out_dir / name).exists()]
#     entry = {"job_id": job_id, "present": present}
#     if (out_dir / "result.json").exists():
#         summary["completed"] += 1
#     if (out_dir / "output.png").exists():
#         summary["png"] += 1
#         entry["sha256"] = hashlib.sha256((out_dir / "output.png").read_bytes()).hexdigest()
#     if len(present) == len(REQUIRED):
#         summary["full_artifacts"] += 1
#     summary["jobs"].append(entry)
# summary_path = Path("/content/drive/MyDrive/mikage_runner") / "batch_summary_export.json"
# summary_path.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
# print(summary_path)
