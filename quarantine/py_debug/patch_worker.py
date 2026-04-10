"""
Patch async_worker.py with deterministic lifecycle logging.
Also verify file integrity first.
"""
import sys, os, shutil

WORKER_PATH = r"D:\Fooocus-main\modules\async_worker.py"
BACKUP_PATH = WORKER_PATH + ".bak_prelifecycle"

# --- Step 1: Read and verify ---
with open(WORKER_PATH, "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"[PATCH] File: {WORKER_PATH}")
print(f"[PATCH] Lines: {len(lines)}")
print(f"[PATCH] Size: {os.path.getsize(WORKER_PATH)} bytes")

# Find key landmarks
worker_def_line = None
worker_loop_line = None
thread_start_line = None
async_tasks_decl_line = None

for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped == "def worker():":
        worker_def_line = i
    if stripped == "while True:" and worker_def_line is not None and i > worker_def_line:
        if worker_loop_line is None:
            worker_loop_line = i
    if "threading.Thread(target=worker" in stripped and ".start()" in stripped:
        thread_start_line = i
    if stripped == "async_tasks = []":
        async_tasks_decl_line = i

print(f"[PATCH] worker_def_line: {worker_def_line + 1 if worker_def_line is not None else 'NOT FOUND'}")
print(f"[PATCH] worker_loop_line: {worker_loop_line + 1 if worker_loop_line is not None else 'NOT FOUND'}")
print(f"[PATCH] thread_start_line: {thread_start_line + 1 if thread_start_line is not None else 'NOT FOUND'}")
print(f"[PATCH] async_tasks_decl: {async_tasks_decl_line + 1 if async_tasks_decl_line is not None else 'NOT FOUND'}")

if any(x is None for x in [worker_def_line, worker_loop_line, thread_start_line, async_tasks_decl_line]):
    print("[PATCH] ABORT: Could not find all landmarks. File may be corrupted.")
    # Show context around expected locations
    for i in range(190, min(200, len(lines))):
        print(f"  {i+1}: {lines[i].rstrip()}")
    sys.exit(1)

# --- Step 2: Backup ---
shutil.copy2(WORKER_PATH, BACKUP_PATH)
print(f"[PATCH] Backup saved: {BACKUP_PATH}")

# --- Step 3: Apply patches ---

# Patch A: Add module-level worker lifecycle flag AFTER async_tasks = []
insert_after_tasks = async_tasks_decl_line + 1
lifecycle_block = [
    "\n",
    "# --- MIKAGE LIFECYCLE INSTRUMENTATION ---\n",
    "import sys as _sys\n",
    "_worker_thread_ref = None\n",
    "_worker_alive = False\n",
    "_worker_entered_loop = False\n",
    "_worker_boot_error = None\n",
    "# --- END LIFECYCLE VARS ---\n",
    "\n",
]
lines[insert_after_tasks:insert_after_tasks] = lifecycle_block
# Adjust line numbers after insertion
offset1 = len(lifecycle_block)
worker_def_line += offset1
worker_loop_line += offset1
thread_start_line += offset1

# Patch B: Instrument worker() — inject right after "def worker():" + "global async_tasks"
# Find the "global async_tasks" line inside worker()
global_line = None
for i in range(worker_def_line, min(worker_def_line + 5, len(lines))):
    if "global async_tasks" in lines[i]:
        global_line = i
        break

if global_line is None:
    print("[PATCH] ABORT: Cannot find 'global async_tasks' inside worker()")
    sys.exit(1)

# Check if there's already a WORKER_DIAG line (from previous failed patch)
has_diag = any("WORKER_DIAG" in lines[j] for j in range(global_line, min(global_line + 10, len(lines))))

worker_entry_block = []
if not has_diag:
    worker_entry_block = [
        "    global _worker_alive, _worker_entered_loop, _worker_boot_error\n",
        "    print('[WORKER_DIAG] worker() ENTERED', flush=True)\n",
        "    _sys.stdout.flush()\n",
    ]
    lines[global_line + 1:global_line + 1] = worker_entry_block
    offset2 = len(worker_entry_block)
    worker_loop_line += offset2
    thread_start_line += offset2
else:
    print("[PATCH] WORKER_DIAG already present, cleaning up old patch...")
    # Remove old DIAG lines
    clean_start = global_line + 1
    clean_end = clean_start
    while clean_end < len(lines) and ("WORKER_DIAG" in lines[clean_end] or "sys.stdout.flush" in lines[clean_end] or "_worker_alive" in lines[clean_end]):
        clean_end += 1
    del lines[clean_start:clean_end]
    # Recalculate
    for i, line in enumerate(lines):
        if line.strip() == "while True:" and i > worker_def_line:
            worker_loop_line = i
            break
    for i, line in enumerate(lines):
        if "threading.Thread(target=worker" in line.strip() and ".start()" in line.strip():
            thread_start_line = i
            break
    # Re-insert clean version
    worker_entry_block = [
        "    global _worker_alive, _worker_entered_loop, _worker_boot_error\n",
        "    print('[WORKER_DIAG] worker() ENTERED', flush=True)\n",
        "    _sys.stdout.flush()\n",
    ]
    lines[global_line + 1:global_line + 1] = worker_entry_block
    offset2 = len(worker_entry_block)
    worker_loop_line += offset2
    thread_start_line += offset2

# Patch C: Add "imports done" marker after the import block inside worker()
# Find "Started worker with PID" line
pid_line = None
for i in range(worker_def_line, min(worker_def_line + 60, len(lines))):
    if "Started worker with PID" in lines[i]:
        pid_line = i
        break

if pid_line is not None:
    imports_done_block = [
        "    print('[WORKER_DIAG] imports done, PID=%d' % pid, flush=True)\n",
        "    _worker_alive = True\n",
    ]
    lines[pid_line + 1:pid_line + 1] = imports_done_block
    offset3 = len(imports_done_block)
    worker_loop_line += offset3
    thread_start_line += offset3

# Patch D: Add "entered loop" marker right before "while True:"
# Find the while True line again (recalculate)
for i in range(worker_def_line, len(lines)):
    if lines[i].strip() == "while True:":
        worker_loop_line = i
        break

loop_entry_block = [
    "    _worker_entered_loop = True\n",
    "    print('[WORKER_DIAG] entering main poll loop, async_tasks id=%d' % id(async_tasks), flush=True)\n",
]
lines[worker_loop_line:worker_loop_line] = loop_entry_block
offset4 = len(loop_entry_block)
thread_start_line += offset4

# Patch E: Add task-popped log after "task = async_tasks.pop(0)"
for i in range(worker_loop_line, len(lines)):
    if "task = async_tasks.pop(0)" in lines[i]:
        task_pop_block = [
            "            print('[WORKER_DIAG] TASK POPPED, queue_remaining=%d' % len(async_tasks), flush=True)\n",
        ]
        lines[i + 1:i + 1] = task_pop_block
        thread_start_line += len(task_pop_block)
        break

# Patch F: Wrap worker() body in try/except to catch boot crashes
# Find the actual "while True:" again
for i in range(worker_def_line, len(lines)):
    if lines[i].strip() == "while True:" and "_worker_entered_loop = True" in lines[i-2]:
        # Add try/except around everything between global line and while True
        # Actually easier: wrap the whole worker body. Find first import line after global
        first_import = global_line + len(worker_entry_block) + 1
        # Insert try before imports
        lines.insert(first_import, "    try:\n")
        # Find while True again
        for j in range(first_import, len(lines)):
            if lines[j].strip() == "while True:":
                # Insert except before while True
                except_block = [
                    "    except Exception as _boot_err:\n",
                    "        _worker_boot_error = str(_boot_err)\n",
                    "        import traceback as _tb\n",
                    "        print('[WORKER_DIAG] BOOT CRASH: %s' % _boot_err, flush=True)\n",
                    "        _tb.print_exc()\n",
                    "        _sys.stdout.flush()\n",
                    "        return\n",
                    "\n",
                ]
                lines[j:j] = except_block
                break
        break

# Patch G: Replace bottom-of-file thread start with safe bootstrap
for i in range(len(lines) - 1, -1, -1):
    if "threading.Thread(target=worker" in lines[i] and ".start()" in lines[i]:
        thread_start_line = i
        break

new_start_block = [
    "# --- MIKAGE SAFE WORKER BOOTSTRAP ---\n",
    "print('[WORKER_DIAG] module loaded, creating worker thread...', flush=True)\n",
    "_worker_thread_ref = threading.Thread(target=worker, daemon=True, name='fooocus_worker')\n",
    "_worker_thread_ref.start()\n",
    "print('[WORKER_DIAG] worker thread started, is_alive=%s' % _worker_thread_ref.is_alive(), flush=True)\n",
]
lines[thread_start_line:thread_start_line + 1] = new_start_block

# --- Step 4: Write ---
with open(WORKER_PATH, "w", encoding="utf-8") as f:
    f.writelines(lines)

new_size = os.path.getsize(WORKER_PATH)
new_lines = len(open(WORKER_PATH, "r", encoding="utf-8").readlines())
print(f"[PATCH] Written: {new_size} bytes, {new_lines} lines")
print("[PATCH] async_worker.py patched successfully")
