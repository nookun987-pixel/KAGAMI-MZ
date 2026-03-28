"use strict";

const fs = require("fs");
const path = require("path");

const PACK_DIR = "D:\\KAGAMI-MZ\\runs\\shot3_weapon_consistency_batch";

async function main() {
  fs.rmSync(PACK_DIR, { recursive: true, force: true });
  fs.mkdirSync(PACK_DIR, { recursive: true });

  const masterPrompt = [
    "Hero product shot of a single massive engineered greatsword, unmistakably a sword, one dominant object only, full sword visible from tip to base, perfectly straight long blade, rigid linear silhouette, extreme length dominance, blade occupies the main vertical axis of the frame, clear sword hierarchy: tip, edge, spine, blade body, base, no ambiguity of function",
    "",
    "heavy industrial brutalist geometry, thick spine clearly visible, sharp defined edge, wedge-like sword tip, no curvature, no ornament, no decorative guard, no segmentation into gadget parts, not a device, not a tool, not a machine part",
    "",
    "matte charcoal-black graphene composite body (#0A0A0A), dark titanium structural joints, subtle micro texture, restrained deep crimson core (#E60000) visible only through extremely thin seams along the blade spine, no glow spread, no red flood",
    "",
    "low-angle cinematic framing, centered composition, black void background, minimal ground reflection, strong negative space, shadow-dominant lighting (70%), soft diffuse highlights, no specular plastic shine",
    "",
    "subtle heat haze and pressure distortion near blade edge, very controlled, no explosion, no flame",
    "",
    "premium industrial product photography, ultra clear sword read in under one second, full-length silhouette, no abstraction, no cropped silhouette",
    "",
    "camera distance: moderate full-length framing, sword dominates vertical axis from tip to base",
    "light intensity: deep shadow split, very restrained highlight",
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
  ].join("\n");

  const variants = [
    ["candidate-01", 4203301, "subtle surface behavior: slightly denser matte micro-grain on the blade planes, silhouette unchanged"],
    ["candidate-02", 4203302, "minor seam distribution: crimson seam remains ultra-thin but shifts slightly higher near the upper spine junction, silhouette unchanged"],
    ["candidate-03", 4203303, "slight weight balance nuance: lower blade body feels fractionally heavier and more grounded, silhouette unchanged"],
    ["candidate-04", 4203304, "restrained material micro-detail: titanium junctions read a touch more structural, silhouette unchanged"],
    ["candidate-05", 4203305, "tiny finish difference: blade planes stay matte and dry with a slightly finer diffuse finish, silhouette unchanged"],
  ];

  const results = [];
  for (const [id, seed, nuance] of variants) {
    const candidateDir = path.join(PACK_DIR, id);
    fs.mkdirSync(candidateDir, { recursive: true });
    const prompt = `${masterPrompt}\n${nuance}`;
    const payload = {
      prompt,
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
