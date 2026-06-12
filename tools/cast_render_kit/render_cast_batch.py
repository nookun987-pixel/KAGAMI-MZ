#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""MIKAGE cast batch renderer — ComfyUI API, stdlib only. OPERATOR-RUN (Claude khong render).
GATE: tu choi chay job co operator_approval_token=null (tru --dry-run).
Usage:  python3 render_cast_batch.py [--jobs cast_jobs.json] [--host 127.0.0.1:8188]
                                     [--out /workspace/cast_out] [--only id1,id2] [--dry-run]
Output = REVIEW CANDIDATES. Khong PASS / khong anchor / khong asset-lock tu script nay."""
import json, time, uuid, argparse, urllib.request, urllib.error, os, sys

def build_workflow(job, seed):
    return {
        "1": {"class_type":"CheckpointLoaderSimple","inputs":{"ckpt_name":job["checkpoint"]}},
        "2": {"class_type":"CLIPTextEncode","inputs":{"clip":["1",1],"text":job["positive"]}},
        "3": {"class_type":"CLIPTextEncode","inputs":{"clip":["1",1],"text":job["negative"]}},
        "4": {"class_type":"EmptyLatentImage","inputs":{"width":job["width"],"height":job["height"],"batch_size":1}},
        "5": {"class_type":"KSampler","inputs":{"model":["1",0],"positive":["2",0],"negative":["3",0],
              "latent_image":["4",0],"seed":seed,"steps":job["steps"],"cfg":job["cfg"],
              "sampler_name":job["sampler"],"scheduler":job["scheduler"],"denoise":1.0}},
        "6": {"class_type":"VAEDecode","inputs":{"samples":["5",0],"vae":["1",2]}},
        "7": {"class_type":"SaveImage","inputs":{"images":["6",0],"filename_prefix":f"{job['id']}_s{seed}"}},
    }

def post_prompt(host, wf):
    req = urllib.request.Request(f"http://{host}/prompt",
        data=json.dumps({"prompt":wf,"client_id":str(uuid.uuid4())}).encode(),
        headers={"Content-Type":"application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)["prompt_id"]

def wait_done(host, pid, timeout=1800):
    t0=time.time()
    while time.time()-t0 < timeout:
        try:
            with urllib.request.urlopen(f"http://{host}/history/{pid}", timeout=15) as r:
                h=json.load(r)
            if pid in h and h[pid].get("outputs"): return h[pid]["outputs"]
        except urllib.error.URLError: pass
        time.sleep(5)
    raise TimeoutError(pid)

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--jobs", default=os.path.join(os.path.dirname(__file__),"cast_jobs.json"))
    ap.add_argument("--host", default="127.0.0.1:8188")
    ap.add_argument("--out",  default="/workspace/cast_out")
    ap.add_argument("--only", default="")
    ap.add_argument("--dry-run", action="store_true")
    a=ap.parse_args()
    data=json.load(open(a.jobs,encoding="utf-8"))
    only=set(x for x in a.only.split(",") if x)
    order=data.get("$run_order") or [j["id"] for j in data["jobs"]]
    by={j["id"]:j for j in data["jobs"]}
    os.makedirs(a.out,exist_ok=True)
    ran=0
    for jid in order:
        if only and jid not in only: continue
        job=by[jid]
        if job.get("operator_approval_token") in (None,"","null") and not a.dry_run:
            print(f"[GATE] {jid}: token=null -> SKIP (operator chua duyet). Dung --dry-run de kiem tra workflow.")
            continue
        for seed in job["seeds"]:
            wf=build_workflow(job,seed)
            if a.dry_run:
                print(f"[DRY] {jid} seed={seed} {job['width']}x{job['height']} ok ({len(job['positive'])}+ chars)")
                continue
            pid=post_prompt(a.host,wf)
            print(f"[RUN] {jid} seed={seed} prompt_id={pid} ...")
            outs=wait_done(a.host,pid)
            print(f"[DONE] {jid} seed={seed} -> {json.dumps(outs)[:160]}")
            ran+=1
    print(f"[SUMMARY] executed={ran} (REVIEW CANDIDATES only — no PASS/anchor/asset-lock)")

if __name__=="__main__":
    main()
