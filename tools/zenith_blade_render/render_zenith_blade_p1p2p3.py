#!/usr/bin/env python3
# MIKAGE — Zenith Blade render, locked P1/P2/P3 (structure canon V2.5).
# NO render by Claude/Cowork. OPERATOR runs this ON the RunPod pod (ComfyUI API on :8188).
# ControlNet (canny) holds the locked blade geometry from the prepared control PNGs;
# prompts carry the locked materials (B4C white outer / black Ti inner / #E60000 core).
#
# PREP ON POD (once, in a terminal) — upload the 2 control images first:
#   $COMFY/input/ZBLADE_CTRL_P1.png      (closed block  -> P1)
#   $COMFY/input/ZBLADE_CTRL_OPEN.png    (shell open    -> P2, P3)
# RUN:
#   cd $COMFY && python3 /workspace/render_zenith_blade_p1p2p3.py
# Outputs: $COMFY/output/  (prefix MIKAGE_ZENITH_BLADE_P1/P2/P3_REVIEW_CANDIDATE_...)

import json, urllib.request, time

S    = "http://127.0.0.1:8188"
CKPT = "realvisxlV50.safetensors"
CN   = "diffusers_xl_canny_mid.safetensors"
DATE = "20260602"

NEG = ("character, person, hand, arm, wielder, body, face, scene, environment, floor, props, "
       "katana curve, curved scimitar, thin elegant blade, slender, fantasy ornament, glowing runes, "
       "laser sword, lightsaber, plasma, chrome glossy mirror, anime, cartoon, "
       "popsicle, ice cream, ice cream bar, lollipop, candy, dessert, food, toy, miniature, cute, "
       "low quality, blurry, jpeg artifact, watermark, text labels, ui frame")

# phase -> (control image, positive prompt, controlnet strength)
PHASES = {
  "P1": ("ZBLADE_CTRL_P1.png",
    "isolated MASSIVE 350kg monolithic obelisk weapon, brutalist architecture, a long faceted dense ceramic beam "
    "with a decisive flat-cut top, sharp square edges, NO pointed tip, NO crossguard, NO wrapped grip, NOT a sword, "
    "looks like a frozen reactor core block, smooth matte white Boron Carbide #FAFAFA that swallows light, sterile cold luxurious, "
    "ultra-thin pressure grooves down the body, a faint blurred deep red #E60000 imprisoned far beneath the white ceramic, no glow no LED, "
    "rectangular hydraulic drive-hub with flush concentric mechanical rings, flat titanium flux-pinning base, "
    "heavy industrial hardware, silent dormant, single object centered vertical, neutral dark background, flat diffuse lighting",
    0.74),
  "P2": ("ZBLADE_CTRL_OPEN.png",
    "isolated heavy industrial greatsword 350kg, white B4C porcelain shell SPLITTING OPEN along kintsugi cracks, "
    "black rusty titanium internal frame beginning to show through gaps, ferro-calcium core warming faint red, "
    "0.5mm flux-pinning gaps, brutal industrial geometry, "
    "single object centered vertical, neutral dark background, flat diffuse lighting", 0.6),
  "P3": ("ZBLADE_CTRL_OPEN.png",
    "isolated heavy industrial greatsword 350kg, B4C porcelain shell FULLY SPLIT floating outward, "
    "exposed black rusty titanium frame around a blazing red-hot ferro-calcium core #E60000, "
    "red glowing monospaced code text wrapping the blade at a slight angle, thermal mirage heat distortion, "
    "acidic steam vapor off the edge, max overload, "
    "single object centered vertical, neutral dark background, flat diffuse lighting", 0.55),
}
SEEDS = [3101, 3102, 3103]

def graph(phase, ctrl, pos, cn_str, seed):
    return {
      "4":  {"class_type":"CheckpointLoaderSimple","inputs":{"ckpt_name":CKPT}},
      "6":  {"class_type":"CLIPTextEncode","inputs":{"text":pos,"clip":["4",1]}},
      "7":  {"class_type":"CLIPTextEncode","inputs":{"text":NEG,"clip":["4",1]}},
      "10": {"class_type":"LoadImage","inputs":{"image":ctrl}},
      "20": {"class_type":"Canny","inputs":{"image":["10",0],"low_threshold":0.3,"high_threshold":0.7}},
      "21": {"class_type":"ControlNetLoader","inputs":{"control_net_name":CN}},
      "22": {"class_type":"ControlNetApplyAdvanced","inputs":{
                "positive":["6",0],"negative":["7",0],"control_net":["21",0],"image":["20",0],
                "strength":cn_str,"start_percent":0.0,"end_percent":0.85}},
      "14": {"class_type":"EmptyLatentImage","inputs":{"width":832,"height":1216,"batch_size":1}},
      "15": {"class_type":"KSampler","inputs":{
                "seed":seed,"steps":34,"cfg":7.0,"sampler_name":"dpmpp_2m","scheduler":"karras","denoise":1.0,
                "model":["4",0],"positive":["22",0],"negative":["22",1],"latent_image":["14",0]}},
      "16": {"class_type":"VAEDecode","inputs":{"samples":["15",0],"vae":["4",2]}},
      "17": {"class_type":"SaveImage","inputs":{"images":["16",0],
                "filename_prefix":"ZBLADE_%s_s%d_RC"%(phase,seed)}},
    }

ids=[]
for phase,(ctrl,pos,cn_str) in PHASES.items():
    for seed in SEEDS:
        data=json.dumps({"prompt":graph(phase,ctrl,pos,cn_str,seed)}).encode()
        pid=json.load(urllib.request.urlopen(S+"/prompt",data=data))["prompt_id"]
        ids.append((phase,seed,pid)); print("queued",phase,seed,pid)

for phase,seed,pid in ids:
    while True:
        time.sleep(3)
        h=json.load(urllib.request.urlopen(S+"/history/"+pid))
        if pid in h:
            for n,o in h[pid]["outputs"].items():
                for im in o.get("images",[]): print("SAVED",phase,seed,im["filename"])
            break
print("DONE -> $COMFY/output/  (9 candidates: P1/P2/P3 x 3 seeds)")
