"""
RUNTIME PROBE: Trace the exact worker lifecycle boundary.
Connects to the running bridge process and checks:
1. Did worker thread start?
2. Did worker enter main loop?
3. Did worker pop the queued task?
4. Did sampling start?

Uses the bridge's /v1/generation/text-to-img endpoint with a minimal payload
and monitors bridge logs + queue state via diagnostic endpoints.
"""
import sys, os, time, json, threading, http.client

BRIDGE_HOST = "127.0.0.1"
BRIDGE_PORT = 7865
TIMEOUT_SECONDS = 120

def log(msg):
    print(f"[PROBE {time.strftime('%H:%M:%S')}] {msg}", flush=True)

def http_get(path):
    try:
        conn = http.client.HTTPConnection(BRIDGE_HOST, BRIDGE_PORT, timeout=5)
        conn.request("GET", path)
        resp = conn.getresponse()
        body = resp.read().decode("utf-8", errors="replace")
        conn.close()
        return resp.status, body
    except Exception as e:
        return None, str(e)

def http_post_json(path, data):
    try:
        body = json.dumps(data).encode("utf-8")
        conn = http.client.HTTPConnection(BRIDGE_HOST, BRIDGE_PORT, timeout=TIMEOUT_SECONDS)
        conn.request("POST", path, body=body, headers={"Content-Type": "application/json"})
        resp = conn.getresponse()
        resp_body = resp.read().decode("utf-8", errors="replace")
        conn.close()
        return resp.status, resp_body
    except Exception as e:
        return None, str(e)

def main():
    results = {}

    # --- FACT 0: Bridge alive? ---
    log("Checking bridge health...")
    status, body = http_get("/")
    if status != 200:
        log(f"BRIDGE DOWN: status={status} body={body}")
        results["bridge_alive"] = False
        dump_results(results)
        return
    log(f"Bridge alive: HTTP {status}")
    results["bridge_alive"] = True

    # --- FACT 0.5: Queue status before request ---
    status, body = http_get("/v1/generation/queue-status")
    log(f"Queue status pre-request: HTTP {status} body={body}")
    try:
        qs = json.loads(body)
        results["queue_before"] = qs
    except:
        results["queue_before"] = body

    # --- Send minimal render request in background thread ---
    # We'll monitor queue status while the request is in-flight
    render_result = {"status": None, "body": None, "error": None, "elapsed": None}

    def do_render():
        payload = {
            "prompt": "white cube on grey background",
            "negative_prompt": "blurry",
            "seed": 42,
            "width": 512,
            "height": 512,
            "performance_selection": "Speed",
            "steps": 4,
            "disable_refiner": True,
            "image_number": 1,
            "async_process": False,
            "style_selections": [],
            "guidance_scale": 4.0,
            "sharpness": 2.0,
            "generation_mode": "exploration",
        }
        t0 = time.time()
        log("Sending render request...")
        s, b = http_post_json("/v1/generation/text-to-img", payload)
        render_result["status"] = s
        render_result["body"] = b[:2000] if b else None
        render_result["elapsed"] = time.time() - t0
        log(f"Render returned: HTTP {s}, {len(b) if b else 0} bytes, {render_result['elapsed']:.1f}s")

    render_thread = threading.Thread(target=do_render, daemon=True)
    render_thread.start()

    # --- Poll queue status every 2s to observe lifecycle ---
    log("Polling queue status to detect worker lifecycle...")
    t_start = time.time()
    poll_log = []
    task_was_queued = False
    task_was_popped = False
    render_finished = False

    while time.time() - t_start < TIMEOUT_SECONDS:
        time.sleep(2)

        if render_result["status"] is not None:
            render_finished = True
            log("Render request completed.")
            break

        status, body = http_get("/v1/generation/queue-status")
        elapsed = time.time() - t_start
        try:
            qs = json.loads(body)
            qlen = qs.get("queue_length", -1)
        except:
            qlen = -1

        entry = {"t": round(elapsed, 1), "queue_length": qlen}
        poll_log.append(entry)

        if qlen > 0 and not task_was_queued:
            task_was_queued = True
            log(f"  t={elapsed:.1f}s: TASK QUEUED (queue_length={qlen})")
        elif qlen == 0 and task_was_queued and not task_was_popped:
            task_was_popped = True
            log(f"  t={elapsed:.1f}s: TASK POPPED (queue_length=0)")
        else:
            if int(elapsed) % 10 < 3:
                log(f"  t={elapsed:.1f}s: queue_length={qlen}")

    # Wait for render thread
    render_thread.join(timeout=10)

    # --- Analyze ---
    results["render_http_status"] = render_result["status"]
    results["render_elapsed_s"] = render_result["elapsed"]
    results["render_body_preview"] = render_result["body"][:500] if render_result["body"] else None
    results["poll_log"] = poll_log
    results["task_was_queued"] = task_was_queued
    results["task_was_popped"] = task_was_popped

    # --- Determine 4 facts ---
    # FACT 1: Did worker thread start?
    # Evidence: if queue_length ever goes from >0 to 0, worker popped it.
    # If queue stays at >0 forever, worker is NOT running.
    # Also: if render returns HTTP 200 with base64, worker ran.

    render_ok = render_result["status"] == 200
    has_base64 = render_result["body"] and "base64" in render_result["body"][:500]

    # Check if queue was stuck
    queue_stuck = task_was_queued and not task_was_popped and not render_ok
    queue_never_seen = not task_was_queued and not render_ok

    log("")
    log("=" * 60)
    log("WORKER LIFECYCLE VERDICT")
    log("=" * 60)

    if render_ok and has_base64:
        log("FACT 1: Worker thread started?     YES (render returned image)")
        log("FACT 2: Worker entered main loop?   YES (task was processed)")
        log("FACT 3: Worker popped queued task?   YES (render completed)")
        log("FACT 4: Sampling started?            YES (base64 image in response)")
        results["verdict"] = "ALL_PASS"
        results["facts"] = {
            "worker_started": True,
            "worker_entered_loop": True,
            "worker_popped_task": True,
            "sampling_started": True,
        }
    elif render_ok and not has_base64:
        log("FACT 1: Worker thread started?     YES (render returned HTTP 200)")
        log("FACT 2: Worker entered main loop?   YES")
        log("FACT 3: Worker popped queued task?   YES")
        log("FACT 4: Sampling started?            UNCLEAR (no base64 in response)")
        log(f"  Response preview: {render_result['body'][:300]}")
        results["verdict"] = "RENDER_OK_NO_IMAGE"
        results["facts"] = {
            "worker_started": True,
            "worker_entered_loop": True,
            "worker_popped_task": True,
            "sampling_started": "UNCLEAR",
        }
    elif queue_stuck:
        stuck_duration = poll_log[-1]["t"] if poll_log else 0
        log(f"FACT 1: Worker thread started?     NO EVIDENCE")
        log(f"FACT 2: Worker entered main loop?   NO (queue stuck at >0 for {stuck_duration}s)")
        log(f"FACT 3: Worker popped queued task?   NO")
        log(f"FACT 4: Sampling started?            NO")
        log(f"  >>> BOUNDARY FAILURE: Worker thread is not consuming from async_tasks queue <<<")
        results["verdict"] = "WORKER_NOT_CONSUMING"
        results["facts"] = {
            "worker_started": "NO_EVIDENCE",
            "worker_entered_loop": False,
            "worker_popped_task": False,
            "sampling_started": False,
        }
    elif render_result["status"] is not None:
        log(f"FACT 1-4: Render returned HTTP {render_result['status']}")
        log(f"  Body: {render_result['body'][:500]}")
        results["verdict"] = f"HTTP_{render_result['status']}"
        results["facts"] = {"raw_status": render_result["status"]}
    else:
        log("FACT 1-4: Render timed out with no response")
        results["verdict"] = "TIMEOUT"
        results["facts"] = {"timeout": True}

    dump_results(results)

def dump_results(results):
    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "runs", "worker_lifecycle_probe.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(results, f, indent=2, default=str)
    log(f"Results saved: {out_path}")

if __name__ == "__main__":
    main()
