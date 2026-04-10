"""
Minimal patch: add 4 lifecycle prints to async_worker.py using exact string replacement.
No line-number math. No regex. Just find exact strings and replace them.
"""
import os, shutil

PATH = r"D:\Fooocus-main\modules\async_worker.py"
BAK = PATH + ".bak_v2"

with open(PATH, "r", encoding="utf-8") as f:
    src = f.read()

print(f"Original: {len(src)} bytes, {src.count(chr(10))} lines")

# Backup
shutil.copy2(PATH, BAK)

# --- PATCH 1: Module-level flag + thread start instrumentation ---
# Replace the bottom-of-file auto-start
OLD_START = "threading.Thread(target=worker, daemon=True).start()"
if OLD_START not in src:
    print("WARNING: bottom-of-file thread start not found, checking alternatives...")
    if "_worker_thread_ref" in src:
        print("Previous patch remnant found, cleaning...")
    else:
        print("ABORT: Cannot find thread start line")
        exit(1)

NEW_START = """# --- MIKAGE WORKER LIFECYCLE ---
import sys as _wl_sys
_worker_thread_ref = None
_worker_alive = False
_worker_in_loop = False
print('[WORKER_LIFECYCLE] module loaded, queue id=%d' % id(async_tasks), flush=True)
_wl_sys.stdout.flush()
_worker_thread_ref = threading.Thread(target=worker, daemon=True, name='fooocus_worker')
_worker_thread_ref.start()
print('[WORKER_LIFECYCLE] thread created, is_alive=%s' % _worker_thread_ref.is_alive(), flush=True)
_wl_sys.stdout.flush()"""

src = src.replace(OLD_START, NEW_START)

# --- PATCH 2: First line inside worker() ---
OLD_WORKER_ENTRY = """def worker():
    global async_tasks

    import os"""
NEW_WORKER_ENTRY = """def worker():
    global async_tasks
    print('[WORKER_LIFECYCLE] worker() ENTERED, tid=%s' % threading.current_thread().name, flush=True)
    import sys as _ws; _ws.stdout.flush()

    import os"""

src = src.replace(OLD_WORKER_ENTRY, NEW_WORKER_ENTRY)

# --- PATCH 3: After imports done (after "Started worker with PID") ---
OLD_PID = "    print(f'Started worker with PID {pid}')"
NEW_PID = """    print(f'Started worker with PID {pid}')
    print('[WORKER_LIFECYCLE] imports done, marking alive', flush=True)
    global _worker_alive; _worker_alive = True"""

src = src.replace(OLD_PID, NEW_PID)

# --- PATCH 4: Before while True loop ---
OLD_LOOP = """    while True:
        time.sleep(0.01)
        if len(async_tasks) > 0:
            task = async_tasks.pop(0)"""
NEW_LOOP = """    global _worker_in_loop; _worker_in_loop = True
    print('[WORKER_LIFECYCLE] entering poll loop, queue id=%d, len=%d' % (id(async_tasks), len(async_tasks)), flush=True)
    while True:
        time.sleep(0.01)
        if len(async_tasks) > 0:
            task = async_tasks.pop(0)
            print('[WORKER_LIFECYCLE] TASK POPPED, remaining=%d' % len(async_tasks), flush=True)"""

src = src.replace(OLD_LOOP, NEW_LOOP)

# --- PATCH 5: Wrap worker body try/except for boot crash ---
OLD_EXCEPT = """    except Exception as e:
        print(e)

    def progressbar"""
NEW_EXCEPT = """    except Exception as e:
        print('[WORKER_LIFECYCLE] gradio_root error (non-fatal): %s' % e, flush=True)

    def progressbar"""
src = src.replace(OLD_EXCEPT, NEW_EXCEPT)

# Verify syntax
with open(PATH, "w", encoding="utf-8") as f:
    f.write(src)

print(f"Patched: {len(src)} bytes, {src.count(chr(10))} lines")

# Syntax check
import py_compile
try:
    py_compile.compile(PATH, doraise=True)
    print("SYNTAX CHECK: PASS")
except py_compile.PyCompileError as e:
    print(f"SYNTAX CHECK: FAIL - {e}")
    # Restore
    shutil.copy2(BAK, PATH)
    print("Restored from backup")
    exit(1)

print("async_worker.py patched successfully")
