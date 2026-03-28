"use strict";

const fs = require("fs");
const path = require("path");

const PACK_DIR = "D:\\KAGAMI-MZ\\runs\\shot3_weapon_consistency_batch_v3";

async function main() {
  fs.rmSync(PACK_DIR, { recursive: true, force: true });
  fs.mkdirSync(PACK_DIR, { recursive: true });

  const promptCore = [
    "Hero product shot of a single massive engineered greatsword, unmistakably a sword, one dominant object only, full sword visible from tip to base, perfectly straight long blade, rigid linear silhouette, extreme length dominance, blade occupies the main vertical axis of the frame, clear sword hierarchy: tip, edge, spine, blade body, base, no ambiguity of function",
    "",
    "heavy industrial brutalist geometry, thick spine clearly visible, sharp defined edge, wedge-like sword tip, no curvature, no ornament, no decorative guard, no segmentation into gadget parts, not a device, not a tool, not a machine part",
    "",
    "matte charcoal-black graphene composite body (#0A0A0A), dark titanium structural joints, subtle micro texture, restrained deep crimson core (#E60000) visible only through extremely thin seams along the blade spine, no glow spread, no red flood",
    "",
    "front-on view only, zero side profile, zero perspective tilt, zero rotation, centered composition, full vertical framing with tip and base fully visible, no crop, no camera deviation from locked master, no cinematic angle, no dramatic perspective",
    "",
    "outline must match locked master silhouette logic exactly, preserve exact guard width, preserve exact blade width progression, preserve exact tip language, preserve exact overall proportions, no spear narrowing, no slab side read, no widening, no redesign",
    "",
    "one single continuous straight blade, no secondary objects, no segmentation, no mechanical/device features, no extra visual storytelling elements",
    "",
    "shadow-dominant lighting (70%), black void background, minimal ground reflection, soft diffuse highlights, no specular plastic shine",
    "",
    "premium industrial product photography, ultra clear sword read in under one second, full-length silhouette, no abstraction, constrained reproduction behavior",
  ].join("\n");

  const negative = [
    "circular object, ring, fan, turbine, engine, propeller, wheel",
    "abstract object, sculpture, ambiguous object, texture study, macro crop",
    "curved blade, katana, axe, hammer, gun, knife, machete",
    "fantasy ornament, rune, decorative guard",
    "neon glow, RGB lighting, oversaturated red",
    "lava sword, fire effects, explosion",
    "glossy plastic, chrome, toy-like surface",
    "soft silhouette, unclear edge",
    "handle-heavy object, mechanism-heavy object, segmented gadget, sci-fi component, tool head, industrial device",
    "cropped sword, partial blade, short silhouette, compressed object, stubby proportions",
    "text, logo, markings, letters, symbols",
    "side profile, perspective tilt, rotation, off-center framing, foreshortening, wide guard, narrow spear tip, slab side read, outline drift, proportion drift, tip redesign, guard redesign, body redesign",
  ].join("\n");

  const variants = [
    ["candidate-01", 4203501, "tiny material micro-variation only: slightly denser matte grain on major blade planes, geometry and camera unchanged"],
    ["candidate-02", 4203502, "tiny seam variation only: crimson seam remains ultra-thin and shifts minimally near upper spine junction, geometry and camera unchanged"],
    ["candidate-03", 4203503, "tiny finish nuance only: diffuse finish softens slightly while outline, proportions, and camera stay unchanged"],
    ["candidate-04", 4203504, "tiny surface nuance only: micro texture reads fractionally tighter near the central blade body, geometry and camera unchanged"],
  ];

  const results = [];
  for (const [id, seed, nuance] of variants) {
    const candidateDir = path.join(PACK_DIR, id);
    fs.mkdirSync(candidateDir, { recursive: true });
    const payload = {
      prompt: `${promptCore}\n${nuance}`,
      negative_prompt: negative,
      seed,
      width: 1024,
      height: 1536,
      performance_selection: "Quality",
      style_selections: [],
      image_number: 1,
      guidance_scale: 7,
      steps: 24,
      disable_refiner: true,
      sampler: "dpmpp_2m_sde_gpu",
      scheduler: "karras",
      sharpness: 1.8,
    };

    fs.writeFileSync(path.join(candidateDir, "request.json"), JSON.stringify(payload, null, 2));
    const response = await fetch("http://127.0.0.1:7865/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`${id} failed: ${response.status} ${await response.text()}`);
    }
    const items = await response.json();
    const item = items[0];
    fs.copyFileSync(item.url, path.join(candidateDir, "output.png"));
    const meta = { id, seed, source: item.url, saved: path.join(candidateDir, "output.png"), nuance };
    fs.writeFileSync(path.join(candidateDir, "response.json"), JSON.stringify(item, null, 2));
    fs.writeFileSync(path.join(candidateDir, "meta.json"), JSON.stringify(meta, null, 2));
    results.push(meta);
    console.log(`${id} ${seed}`);
  }

  fs.writeFileSync(path.join(PACK_DIR, "index.json"), JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
