# ZENITH_BLADE_FINAL_DESIGN_BOARD_V1 — composite/layout only (PIL).
# Layout source: build_board_v0.py (approved Board V0). V0 files are NOT touched.
# The four PENDING RENDER slots (1/7/8/11) and panel 9 are filled from the durable
# evidence path renders/board_v1_evidence/. Nothing is generated, upscaled,
# regenerated or substituted. Images are scaled/fitted only.
from PIL import Image, ImageDraw, ImageFont
import os, sys, hashlib, json

ROOT = r"D:\KAGAMI-MZ_SYNC_PUSH_V2"
OUTPNG = os.path.join(ROOT, "ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.png")
P  = r"_tmp\zenith_blade_hero_e1_ce15\hero_cohesion_correction01\pass_03"
R  = r"production\character\reviews"
E  = r"renders\board_v1_evidence"
FD = r"C:\Windows\Fonts"

MANIFEST = []
def cite(rel, panel, role):
    """Resolve + hash a cited source. Hard-fail (no substitution) if missing."""
    ap = os.path.join(ROOT, rel)
    if not os.path.exists(ap):
        print(f"FAIL_RULE_TRIGGERED panel={panel} path_unresolved={rel}")
        sys.exit(2)
    h = hashlib.sha256(open(ap, "rb").read()).hexdigest()
    MANIFEST.append({"panel": panel, "role": role, "path": rel.replace("\\", "/"),
                     "sha256": h, "bytes": os.path.getsize(ap)})
    return ap

def F(n, s):
    try: return ImageFont.truetype(os.path.join(FD, n), s)
    except Exception: return ImageFont.load_default()
f_title   = F("arialbd.ttf", 46)
f_sub     = F("arial.ttf", 20)
f_ptitle  = F("arialbd.ttf", 24)
f_plabel  = F("arial.ttf", 17)
f_small   = F("arial.ttf", 15)
f_mono    = F("consola.ttf", 15)
f_monob   = F("consolab.ttf", 16)

BG      = (8, 8, 11)
PANEL   = (17, 17, 22)
LINE    = (58, 58, 68)
WHITE   = (240, 238, 234)
DIM     = (152, 152, 162)
VIOLET  = (143, 0, 255)
AMBER   = (232, 190, 92)
RED     = (214, 92, 92)
GREEN   = (108, 200, 140)

def wrap(txt, fnt, maxw, d):
    out, cur = [], ""
    for w in txt.split():
        t = (cur + " " + w).strip()
        if d.textlength(t, font=fnt) <= maxw: cur = t
        else:
            if cur: out.append(cur)
            cur = w
    if cur: out.append(cur)
    return out

def content_crop(im, thresh=24, margin=10):
    g = im.convert("L").point(lambda v: 255 if v > thresh else 0)
    bb = g.getbbox()
    if not bb: return im
    return im.crop((max(0, bb[0]-margin), max(0, bb[1]-margin),
                    min(im.width, bb[2]+margin), min(im.height, bb[3]+margin)))

def alpha_mask_vis(path, size):
    im = Image.open(os.path.join(ROOT, path)).convert("RGBA")
    a = im.getchannel("A").point(lambda v: 255 if v >= 128 else 0)
    return Image.merge("RGB", (a, a, a)).resize((size, size), Image.NEAREST)

def place(canvas, d, box, img=None, title="", lines=(), tint=LINE):
    """box=(x,y,w,h). lines = list of (text, colour) or (text, colour, font)."""
    x, y, w, h = box
    d.rectangle([x, y, x+w, y+h], fill=PANEL, outline=tint)
    cap_h = 30 + 22*len(lines)
    img_area = (x+14, y+52, w-28, h-52-cap_h)
    if img is not None:
        # fit-to-area, never above 1:1 — no source image is ever upscaled
        sc = min(img_area[2]/img.width, img_area[3]/img.height, 1.0)
        im2 = img.resize((max(1,int(img.width*sc)), max(1,int(img.height*sc))), Image.LANCZOS)
        canvas.paste(im2, (int(img_area[0]+(img_area[2]-im2.width)/2),
                           int(img_area[1]+(img_area[3]-im2.height)/2)))
    d.text((x+14, y+14), title, font=f_ptitle, fill=WHITE)
    yy = y + h - cap_h + 4
    for ln in lines:
        txt, col = ln[0], ln[1]
        fnt = ln[2] if len(ln) > 2 else f_plabel
        d.text((x+14, yy), txt, font=fnt, fill=col); yy += 22

# ---------------- canvas ----------------
W = 3400
M = 40
TOP  = 200
RH1  = 1300      # row 1 — panels 1 / 2 / 3   (panel 1 = OUT1 portrait)
RH2  = 1080      # row 2 — panels 4 / 5 / 6   (V0 geometry, unchanged)
RH3  = 1200      # row 3 — panels 7 / 8 / 10
RH4  = 1300      # row 4 — panels 11 / 12 / 9 (panel 11 = OUT4 portrait)
RH5  = 700       # row 5 — panel 13 full width
TOP2 = TOP  + RH1 + 40
TOP3 = TOP2 + RH2 + 40
TOP4 = TOP3 + RH3 + 40
TOP5 = TOP4 + RH4 + 40
H    = TOP5 + RH5 + M

board = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(board)

d.text((M, 34), "ZENITH BLADE — FINAL DESIGN BOARD V1", font=f_title, fill=WHITE)
d.text((M, 92), "Complete design board — all 13 panels built. Composite/layout only; every image is an existing file on disk, scaled to fit. No render, retouch or regeneration in this task.",
       font=f_sub, fill=DIM)
d.text((M, 118), "Form basis: CE15 (operator ruling D1=A, 2026-08-06) · Camera policy D5=C · Built per ZENITH_BLADE_FINAL_DESIGN_BOARD_BUILD_SPEC.md · Layout source: approved Board V0 (V0 files unchanged)",
       font=f_sub, fill=DIM)
d.text((M, 144), "NOT a canon approval · NOT an asset lock · NOT production-ready. \"FINAL V1\" means the DESIGN BOARD is complete — nothing else.",
       font=f_sub, fill=AMBER)
d.line([(M, 178), (W-M, 178)], fill=LINE, width=2)

CW = (W - M*2 - 40*2) // 3

# ---- PANEL 1 — 85 mm hero (was PENDING RENDER #1) ----
im1 = Image.open(cite(os.path.join(E, "OUT1_HERO_P3_85MM_ANNOTATED.png"), 1,
                      "hero 85 mm perspective, annotated")).convert("RGB")
place(board, d, (M, TOP, CW, RH1), img=im1,
      title="1 — MAIN HERO · 85 mm PERSPECTIVE · P3",
      lines=[("RESOLVED — task ZENITH_BLADE_OUTSTANDING_RENDERS_01, 2026-08-06.", GREEN),
             ("renders/board_v1_evidence/OUT1_HERO_P3_85MM_ANNOTATED.png", DIM, f_small),
             ("85 mm persp · AgX Med-High Contrast · -0.35 EV · bg #050508 · core gate PASS (OUT1_CORE_GATE.json).", DIM, f_small)])

# ---- PANEL 2 — front ortho (V0, unchanged) ----
im2 = content_crop(Image.open(cite(os.path.join(P, "HC_front_P3.png"), 2, "front ortho P3")).convert("RGB"))
place(board, d, (M+CW+40, TOP, CW, RH1), img=im2,
      title="2 — FRONT · ORTHOGRAPHIC · P3",
      lines=[("CE15 pass_03 / HC_front_P3.png", DIM),
             ("Orthographic — satisfies D5=C directly.", GREEN)])

# ---- PANEL 3 — side ortho (V0, unchanged) ----
im3 = content_crop(Image.open(cite(os.path.join(P, "HC_side_P3.png"), 3, "side ortho P3")).convert("RGB"))
place(board, d, (M+(CW+40)*2, TOP, CW, RH1), img=im3,
      title="3 — SIDE · ORTHOGRAPHIC · P3",
      lines=[("CE15 pass_03 / HC_side_P3.png", DIM),
             ("Orthographic — satisfies D5=C directly.", GREEN)])

# ---- PANEL 4 — rear 3/4 (V0, unchanged) ----
im4 = content_crop(Image.open(cite(os.path.join(P, "HC_rear34_P3.png"), 4, "rear 3/4 P3")).convert("RGB"))
place(board, d, (M, TOP2, CW, RH2), img=im4,
      title="4 — REAR 3/4 · P3",
      lines=[("CE15 pass_03 / HC_rear34_P3.png", DIM),
             ("EXISTS — not missing evidence (verified).", GREEN)])

# ---- PANEL 5 — silhouettes (V0, unchanged) ----
cite(os.path.join(P, "SIL_ce15_128.png"), 5, "silhouette alpha mask 128 px")
cite(os.path.join(P, "SIL_ce15_064.png"), 5, "silhouette alpha mask 64 px")
x5, y5 = M+CW+40, TOP2
d.rectangle([x5, y5, x5+CW, y5+RH2], fill=PANEL, outline=LINE)
d.text((x5+14, y5+14), "5 — SILHOUETTE · 64 / 128 px", font=f_ptitle, fill=WHITE)
s_size = 400
s128 = alpha_mask_vis(os.path.join(P, "SIL_ce15_128.png"), s_size)
s64  = alpha_mask_vis(os.path.join(P, "SIL_ce15_064.png"), s_size)
board.paste(s128, (x5+60, y5+110)); board.paste(s64, (x5+60+s_size+60, y5+110))
d.rectangle([x5+60, y5+110, x5+60+s_size, y5+110+s_size], outline=LINE)
d.rectangle([x5+60+s_size+60, y5+110, x5+60+s_size*2+60, y5+110+s_size], outline=LINE)
d.text((x5+60, y5+120+s_size), "128 px", font=f_plabel, fill=WHITE)
d.text((x5+60+s_size+60, y5+120+s_size), "64 px", font=f_plabel, fill=WHITE)
yy = y5+110+s_size+56
for ln, col in [("Deviation 0 px beyond anti-alias vs CE14 baseline.", GREEN),
                ("Source: SIL_ce15_128.png · SIL_ce15_064.png (alpha masks).", DIM),
                ("CAVEAT — CE12 has NO alpha silhouette mask:", AMBER)]:
    d.text((x5+14, yy), ln, font=f_plabel, fill=col); yy += 24
for ln in wrap("_tmp/zenith_blade_hero_e1_ce12/silhouette_fusion01/pass_01/SF_sil_64.png and SF_sil_128.png "
               "are thumbnail-scale COLOUR renders (RGB, 128x72), not masks. The CE12<->CE13 0 px comparison "
               "cannot be re-displayed from retained artifacts.", f_small, CW-28, d):
    d.text((x5+14, yy), ln, font=f_small, fill=DIM); yy += 19

# ---- PANEL 6 — P1/P2/P3 strip (V0, unchanged) ----
x6, y6 = M+(CW+40)*2, TOP2
d.rectangle([x6, y6, x6+CW, y6+RH2], fill=PANEL, outline=LINE)
d.text((x6+14, y6+14), "6 — P1 / P2 / P3 STATE STRIP", font=f_ptitle, fill=WHITE)
ph = 700
sub_w = (CW - 28 - 20) // 3
yimg = y6 + 60
for i, (ph_name, fn, note, col) in enumerate([
        ("P1 COMPACT-IDLE", "HC_authored_P1.png", "core OFF", DIM),
        ("P2 ACTIVATION",   "HC_authored_P2.png", "core OFF", DIM),
        ("P3 OVERDRIVE",    "HC_authored_P3.png", "single violet core ON", VIOLET)]):
    im = content_crop(Image.open(cite(os.path.join(P, fn), 6, f"state strip {ph_name}")).convert("RGB"))
    sc = min(sub_w/im.width, ph/im.height)
    im2b = im.resize((int(im.width*sc), int(im.height*sc)))
    px = x6 + 14 + i*(sub_w+10) + (sub_w-im2b.width)//2
    board.paste(im2b, (px, yimg))
    d.text((x6+14+i*(sub_w+10), yimg+ph+8), ph_name, font=f_plabel, fill=WHITE)
    d.text((x6+14+i*(sub_w+10), yimg+ph+30), note, font=f_small, fill=col)
yy = yimg+ph+62
for ln, col in [("Authored-light rig · frames 1 / 31 / 61.", DIM),
                ("Assembled from 3 separate files (composite only, no re-render).", DIM),
                ("Verified: P1 violet=0 · P2 violet=0 · P3 ROI=2879 (gate >=2500) · global 0.139% (gate <=5%).", GREEN)]:
    for l2 in wrap(ln, f_small, CW-28, d):
        d.text((x6+14, yy), l2, font=f_small, fill=col); yy += 19

# ---- PANEL 7 — core/spine section (was PENDING RENDER #2) ----
im7 = Image.open(cite(os.path.join(E, "OUT2_CORE_SPINE_SECTION_ANNOTATED.png"), 7,
                      "core/spine true section, annotated")).convert("RGB")
place(board, d, (M, TOP3, CW, RH3), img=im7,
      title="7 — CORE / SPINE SECTION",
      lines=[("TRUE SECTION EVIDENCE — not an engineering section drawing.", AMBER),
             ("RESOLVED — task ZENITH_BLADE_OUTSTANDING_RENDERS_01, 2026-08-06.", GREEN),
             ("renders/board_v1_evidence/OUT2_CORE_SPINE_SECTION_ANNOTATED.png", DIM, f_small),
             ("Cut plane world Z = 0.376932 (through P3 core centre). Boolean DIFFERENCE on 32 duplicates,", DIM, f_small),
             ("modifier NOT applied, originals untouched. Cutter bounds min (-1.987736, -2.184326, 0.376932)", DIM, f_small),
             ("max (2.485636, 2.094163, 2.924670). No clearance dimensions are asserted.", DIM, f_small)])

# ---- PANEL 8 — exploded load path (was PENDING RENDER #3) ----
im8 = Image.open(cite(os.path.join(E, "OUT3_EXPLODED_LOADPATH_ANNOTATED.png"), 8,
                      "exploded load-path, annotated")).convert("RGB")
place(board, d, (M+CW+40, TOP3, CW, RH3), img=im8,
      title="8 — EXPLODED LOAD-PATH",
      lines=[("LOAD-PATH EVIDENCE DIAGRAM — not a manufacturing exploded view.", AMBER),
             ("RESOLVED — task ZENITH_BLADE_OUTSTANDING_RENDERS_01, 2026-08-06.", GREEN),
             ("renders/board_v1_evidence/OUT3_EXPLODED_LOADPATH_ANNOTATED.png", DIM, f_small),
             ("Translation-only on duplicates along world -Y; NO rotation, no geometry edit.", DIM, f_small),
             ("Step 0.12 blade width (0.056805 m); max total 0.48 blade width — within the 0.55 budget.", DIM, f_small),
             ("Depicts the D2=C unified chassis definition; chassis/spine and hub are the ANCHOR.", DIM, f_small)])

# ---- PANEL 10 — chassis callout (V0, unchanged) ----
im10 = content_crop(Image.open(cite(os.path.join(P, "HC_wireframe_material_proof.png"), 10,
                                    "wireframe over shaded material")).convert("RGB"))
x10, y10 = M+(CW+40)*2, TOP3
d.rectangle([x10, y10, x10+CW, y10+RH3], fill=PANEL, outline=LINE)
d.text((x10+14, y10+14), "10 — CHASSIS CALLOUT", font=f_ptitle, fill=WHITE)
ia = (x10+14, y10+52, CW-28, RH3-52-190)
sc = min(ia[2]/im10.width, ia[3]/im10.height)
i10 = im10.resize((int(im10.width*sc), int(im10.height*sc)))
board.paste(i10, (int(ia[0]+(ia[2]-i10.width)/2), ia[1]))
yy = y10 + RH3 - 186
d.text((x10+14, yy), "UNIFIED DEFINITION (operator ruling D2=C):", font=f_plabel, fill=WHITE); yy += 24
for l2 in wrap("Central load spine + paired recessed rails + two structural lobes surrounding the central P3 slot; "
               "upper hub, lower Flux-Pinning base, and collars are load-transition modules.", f_small, CW-28, d):
    d.text((x10+14, yy), l2, font=f_small, fill=VIOLET); yy += 19
yy += 6
for l2 in wrap("Source: HC_wireframe_material_proof.png (topology over shaded material). "
               "Annotation layer only — no re-render.", f_small, CW-28, d):
    d.text((x10+14, yy), l2, font=f_small, fill=DIM); yy += 19

# ---- PANEL 11 — scale / dimension (was PENDING RENDER #4) ----
im11 = Image.open(cite(os.path.join(E, "OUT4_SCALE_VS_HUMAN_ANNOTATED.png"), 11,
                       "scale vs human reference, annotated")).convert("RGB")
place(board, d, (M, TOP4, CW, RH4), img=im11,
      title="11 — SCALE / DIMENSION",
      lines=[("RESOLVED — task ZENITH_BLADE_OUTSTANDING_RENDERS_01, 2026-08-06.", GREEN),
             ("renders/board_v1_evidence/OUT4_SCALE_VS_HUMAN_ANNOTATED.png", DIM, f_small),
             ("Measured 1.200000 m = 47.2441 in — INSIDE canon 35-58 in (0.889-1.4732 m).", GREEN, f_small),
             ("Prior \"dimension conflict\" WITHDRAWN: it was an un-converted unit check, not a disagreement.", GREEN, f_small),
             ("Reference is a TEMPORARY 1.75 m primitive proxy per spec — NOT a character asset.", AMBER, f_small),
             ("In-scene actor height UNCONFIRMED — see panel 13.", AMBER, f_small)])

# ---- PANEL 12 — rig handoff (V0, unchanged) ----
x12, y12 = M+CW+40, TOP4
im12 = content_crop(Image.open(cite(os.path.join(R, "MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89_CONTACT_SHEET.png"),
                                    12, "V0.89 mitten-interface contact sheet")).convert("RGB"))
d.rectangle([x12, y12, x12+CW, y12+RH4], fill=PANEL, outline=LINE)
d.text((x12+14, y12+14), "12 — RIG INTEGRATION HANDOFF", font=f_ptitle, fill=WHITE)
ia = (x12+14, y12+52, CW-28, 560)
sc = min(ia[2]/im12.width, ia[3]/im12.height)
i12 = im12.resize((int(im12.width*sc), int(im12.height*sc)))
board.paste(i12, (int(ia[0]+(ia[2]-i12.width)/2), ia[1]))
yy = y12 + 52 + 560 + 24
d.text((x12+14, yy), "V0.89 ACTOR ASSET — LINKED, NOT MERGED", font=f_plabel, fill=WHITE); yy += 26
for ln, col in [
    ("CE15 = weapon-form authority. V0.89 = actor-integration authority.", DIM),
    ("Consumption by link/reference only. Neither file overwrites the other.", DIM),
    ("Geometry is NOT merged.", WHITE),
    ("V0.89's 0-overlap / 8-pose result was proven against the PREVIOUS weapon form.", AMBER),
    ("CE15 <-> actor collision: NOT VERIFIED — never run.", RED),
    ("Any form change => re-link + fresh full validation (see handoff contract).", DIM)]:
    for l2 in wrap(ln, f_small, CW-28, d):
        d.text((x12+14, yy), l2, font=f_small, fill=col); yy += 19

# ---- PANEL 9 — material palette (was DEFERRED; now built from OUT5) ----
im9 = Image.open(cite(os.path.join(E, "OUT5_MATERIAL_SWATCH_CARD.png"), 9,
                      "material swatch card")).convert("RGB")
place(board, d, (M+(CW+40)*2, TOP4, CW, RH4), img=im9,
      title="9 — MATERIAL PALETTE",
      lines=[("NOT RECONCILED — MAT_C arc (hex) vs V0.29 arc (linear RGB) for graphite / titanium / steel.", AMBER),
             ("D3 ruled PORCELAIN ONLY. The two arcs are carried separately, never merged or averaged.", AMBER, f_small),
             ("renders/board_v1_evidence/OUT5_MATERIAL_SWATCH_CARD.png", DIM, f_small),
             ("Swatches drawn in sRGB from documented values (PIL). No .blend opened, no material read.", DIM, f_small)])

# ---- ROW 5 — PANEL 13 canon status, full width ----
d.rectangle([M, TOP5, W-M, TOP5+RH5], fill=PANEL, outline=LINE)
d.text((M+14, TOP5+14), "13 — CANON STATUS & UNRESOLVED EVIDENCE", font=f_ptitle, fill=WHITE)
d.text((M+600, TOP5+22), "updated for V1 — evidence legitimately changed, so the V0 list is NOT carried verbatim; every change is stamped with provenance",
       font=f_small, fill=DIM)
colw = (W - M*2 - 60) // 2
LX = M+14
RX = M+14+colw+32

# left column — status + resolved
yy = TOP5 + 56
d.text((LX, yy), "STATUS", font=f_plabel, fill=WHITE); yy += 26
for ln, col in [
    ("CE15 = VISUAL-FORM AUTHORITY (operator ruling D1=A, 2026-08-06).", GREEN),
    ("CE15 is NOT a production asset lock.", RED),
    ("No asset lock or production-ready status is in force anywhere in the project.", RED),
    ("The single historical grant (V0.33) was revoked by V0.41.", DIM)]:
    for l2 in wrap(ln, f_small, colw, d):
        d.text((LX, yy), l2, font=f_small, fill=col); yy += 20
yy += 12
d.text((LX, yy), "RESOLVED SINCE V0 — provenance: task ZENITH_BLADE_OUTSTANDING_RENDERS_01, 2026-08-06",
       font=f_plabel, fill=GREEN); yy += 28
for ln in [
    "85 mm perspective hero on CE15 form - RESOLVED (OUT1_HERO_P3_85MM_ANNOTATED.png)",
    "Core/spine section render - RESOLVED (OUT2_CORE_SPINE_SECTION_ANNOTATED.png)",
    "Exploded load-path diagram - RESOLVED (OUT3_EXPLODED_LOADPATH_ANNOTATED.png)",
    "Scale-vs-human image - RESOLVED (OUT4_SCALE_VS_HUMAN_ANNOTATED.png)",
    "Scale/dimension: measured 1.200000 m = 47.2441 in is INSIDE the canon range 35-58 in "
    "(0.889-1.4732 m). The prior \"conflict\" is WITHDRAWN - it was an un-converted unit check, "
    "not a real disagreement. Provenance: OUT4 + evaluated-scene measurement.",
]:
    d.text((LX, yy), "•", font=f_small, fill=GREEN)
    for l2 in wrap(ln, f_small, colw-20, d):
        d.text((LX+16, yy), l2, font=f_small, fill=DIM); yy += 19
    yy += 4

# right column — still open
yy = TOP5 + 56
d.text((RX, yy), "STILL OPEN — carried VERBATIM from V0, nothing reconciled, merged or dropped",
       font=f_plabel, fill=AMBER); yy += 28
for ln in [
    "CE15 <-> actor collision/clearance - NOT VERIFIED (V0.89's 0-overlap 8-pose result was proven against the previous form)",
    "CE12 alpha silhouette mask - MISSING (its sil files are thumbnail colour renders)",
    "CE12/CE13 standalone written rulings - MISSING (session-record only)",
    "Material arcs MAT_C vs V0.29 (graphite/titanium/steel) - NOT RECONCILED",
    "Canon-authority promotion packet - OPEN / PENDING",
    "PHYSICAL_VOLUME_EXACT_VALUE - NOT VERIFIED",
]:
    d.text((RX, yy), "•", font=f_small, fill=AMBER)
    for l2 in wrap(ln, f_small, colw-20, d):
        d.text((RX+16, yy), l2, font=f_small, fill=DIM); yy += 19
    yy += 4
yy += 8
d.text((RX, yy), "NEW IN V1", font=f_plabel, fill=AMBER); yy += 26
d.text((RX, yy), "•", font=f_small, fill=AMBER)
for l2 in wrap("In-scene actor height - UNCONFIRMED. The evaluated scene's non-blade meshes measure 3.450 m "
               "top-to-bottom because overlaid PUBLIC_BLOCK blade variants dominate the bounding box; the only "
               "armature present is MIKAGE_initial_armature_scaffold (0.19 m scaffold, per task brief - not "
               "re-verified here). No in-scene reference of plausible human height exists, so OUT4 used a "
               "TEMPORARY 1.75 m primitive proxy per spec. The proxy is NOT a character asset.", f_small, colw-20, d):
    d.text((RX+16, yy), l2, font=f_small, fill=DIM); yy += 19

# ---- footer / boundary statement ----
fy = TOP5 + RH5 - 76
d.line([(M+14, fy-10), (W-M-14, fy-10)], fill=LINE, width=1)
d.text((M+14, fy), "BOUNDARY — \"FINAL … V1\" means the DESIGN BOARD is complete. This is an evidence/design document.",
       font=f_plabel, fill=WHITE)
d.text((M+14, fy+24), "NOT canon approval · NOT asset lock · NOT production-ready. Production asset lock remains BLOCKED on the CE15 <-> actor collision/clearance re-proof.",
       font=f_plabel, fill=RED)
d.text((M+14, fy+50), "ZENITH_BLADE_FINAL_DESIGN_BOARD_V1 · assembled 2026-08-06 · composite/layout only · no render, retouch or regeneration produced in this task · sources cited from renders/board_v1_evidence/ (durable) and CE15 pass_03",
       font=f_small, fill=(110,110,120))

board.save(OUTPNG)
json.dump(MANIFEST, open(os.path.join(
    r"C:\Users\nt\AppData\Local\Temp\claude\D--KAGAMI-MZ-SYNC-PUSH-V2\ec061856-4fbb-4c0c-9196-a8cc95dd1f5c\scratchpad",
    "v1_manifest.json"), "w"), indent=1)
print("SAVED", OUTPNG, board.size)
print("CITED_PATHS_RESOLVED", len(MANIFEST))
