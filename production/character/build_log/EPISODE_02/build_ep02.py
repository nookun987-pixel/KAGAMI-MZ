#!/usr/bin/env python3
# MIKAGE ZENITH — BUILD LOG EPISODE 02 : INTO THE WORLD
# Forward step after EP01 (silhouette->steed->mount). 1080x1350, brand-locked.
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

W, H = 1080, 1350
VOID    = (5, 5, 8)
VOID2   = (12, 12, 18)
PORC    = (242, 238, 234)
SILVER  = (160, 160, 176)
SILVER2 = (120, 120, 138)
VIOLET  = (143, 0, 255)
VIOLET2 = (123, 47, 255)
DIMV    = (70, 40, 110)

FD = os.path.join(os.path.dirname(__file__), "fonts")
SRC = "/sessions/nifty-elegant-sagan/mnt/KAGAMI-MZ_SYNC_PUSH_V2/production/character/keyart_candidates"
OUT = os.path.join(os.path.dirname(__file__), "world")
os.makedirs(OUT, exist_ok=True)

def serif(sz):  return ImageFont.truetype(os.path.join(FD, "cinzel700.ttf"), sz)
def serifr(sz): return ImageFont.truetype(os.path.join(FD, "cinzel400.ttf"), sz)
def body(sz):   return ImageFont.truetype(os.path.join(FD, "shippori500.ttf"), sz)
def mono(sz):   return ImageFont.truetype(os.path.join(FD, "spacemono400.ttf"), sz)

EP = "02"
FOOTER = "INTO THE WORLD"
TOTAL = 8

def tracked(draw, xy, text, font, fill, track=0, anchor="la"):
    x, y = xy
    if anchor == "ma":
        total = sum((font.getbbox(c)[2]-font.getbbox(c)[0]) + track for c in text) - track
        x = xy[0] - total/2
    for c in text:
        draw.text((x, y), c, font=font, fill=fill)
        x += (font.getbbox(c)[2]-font.getbbox(c)[0]) + track

def wrap(draw, text, font, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=font) <= maxw: cur = t
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

def base():
    img = Image.new("RGB", (W, H), VOID)
    g = Image.new("L", (W, H), 0)
    ImageDraw.Draw(g).ellipse((W*0.1, H*0.05, W*0.9, H*0.7), fill=28)
    g = g.filter(ImageFilter.GaussianBlur(220))
    img = Image.composite(Image.new("RGB", (W, H), VOID2), img, g)
    return img

def chrome(img, idx):
    d = ImageDraw.Draw(img); m = 30
    d.rectangle((m, m, W-m, H-m), outline=(40, 36, 52), width=2)
    ty = 52
    tracked(d, (m+24, ty), "MIKAGE ZENITH", mono(17), SILVER, track=3)
    rt = f"BUILD LOG // {EP}"
    rw = sum((mono(17).getbbox(c)[2]-mono(17).getbbox(c)[0])+3 for c in rt)-3
    tracked(d, (W-m-24-rw, ty), rt, mono(17), SILVER, track=3)
    d.line((m+24, ty+34, W-m-24, ty+34), fill=(46, 40, 60), width=1)
    by = H-66
    d.line((m+24, by-14, W-m-24, by-14), fill=(46, 40, 60), width=1)
    tracked(d, (m+24, by), FOOTER, mono(14), DIMV, track=3)
    pg = f"{idx:02d} / {TOTAL:02d}"
    pw = sum((mono(14).getbbox(c)[2]-mono(14).getbbox(c)[0])+3 for c in pg)-3
    tracked(d, (W-m-24-pw, by), pg, mono(14), SILVER2, track=3)
    return img

def halo(img, cx, cy, r=120):
    layer = Image.new("RGB", (W, H), (0,0,0))
    ImageDraw.Draw(layer).ellipse((cx-r, cy-r, cx+r, cy+r), fill=(60, 12, 120))
    layer = layer.filter(ImageFilter.GaussianBlur(60))
    img = ImageChops.screen(img, layer)
    d = ImageDraw.Draw(img)
    d.ellipse((cx-r*0.42, cy-r*0.42, cx+r*0.42, cy+r*0.42), outline=VIOLET2, width=2)
    d.ellipse((cx-12, cy-12, cx+12, cy+12), fill=VIOLET)
    return img

def vseam(img, cx, y0, y1, segs=7, gap=14):
    # thin, broken violet seam — honors 22/06 ruling (no top cross / laser bar)
    layer = Image.new("RGB", (W, H), (0,0,0))
    ld = ImageDraw.Draw(layer)
    n = (y1-y0)//segs
    yy = y0
    while yy < y1:
        ld.line((cx, yy, cx, min(yy+n-gap, y1)), fill=(90, 20, 150), width=4)
        yy += n
    layer = layer.filter(ImageFilter.GaussianBlur(6))
    img = ImageChops.screen(img, layer)
    d = ImageDraw.Draw(img)
    yy = y0
    while yy < y1:
        d.line((cx, yy, cx, min(yy+n-gap, y1)), fill=VIOLET, width=2)
        yy += n
    return img

def place_image(img, path, box, label=None):
    x0,y0,x1,y1 = box
    d = ImageDraw.Draw(img)
    d.rectangle(box, outline=(54, 48, 68), width=2)
    pad = 16
    iw, ih = x1-x0-2*pad, y1-y0-2*pad
    src = Image.open(path).convert("RGB")
    sr, br = src.width/src.height, iw/ih
    if sr > br: nw, nh = iw, int(iw/sr)
    else:       nh, nw = ih, int(ih*sr)
    src = src.resize((nw, nh), Image.LANCZOS)
    img.paste(src, (x0+pad+(iw-nw)//2, y0+pad+(ih-nh)//2))
    if label: tracked(d, (x0+8, y1+12), label, mono(13), SILVER2, track=2)
    return img

def bullets(img, x, y, items, gap=110, bw=900):
    d = ImageDraw.Draw(img)
    for it in items:
        cx, cy = x+6, y+11
        d.polygon([(cx, cy-7),(cx+7, cy),(cx, cy+7),(cx-7, cy)], fill=VIOLET)
        ly = y
        for ln in wrap(d, it, mono(22), bw):
            d.text((x+30, ly), ln, font=mono(22), fill=PORC); ly += 32
        y += max(gap, (ly-y)+30)
    return img

def paras(img, x, y, blocks, font, fill, maxw, lh=40, pgap=22):
    d = ImageDraw.Draw(img)
    for blk in blocks:
        for ln in wrap(d, blk, font, maxw):
            d.text((x, y), ln, font=font, fill=fill); y += lh
        y += pgap
    return y

def centered(d, y, lines, font, fill, track=2, lh=50):
    for ln in lines:
        tracked(d, (W/2, y), ln, font, fill, track=track, anchor="ma"); y += lh
    return y

# ---------- SLIDES ----------
def slide_title():
    img = base(); d = ImageDraw.Draw(img)
    tracked(d, (W/2, 200), "BUILD LOG", mono(22), VIOLET2, track=14, anchor="ma")
    ty = 296
    for ln in ["INTO THE", "WORLD"]:
        tracked(d, (W/2, ty), ln, serif(80), PORC, track=4, anchor="ma"); ty += 96
    # tagline 2 — short mono subtitle
    tracked(d, (W/2, 540), "From the void, it learned a shape.", mono(20), SILVER, track=1, anchor="ma")
    # divider
    d.line((W//2-70, 600, W//2+70, 600), fill=DIMV, width=1)
    # tagline 1 — signature statement (both taglines now live on slide 1)
    centered(d, 648, ["An entity from the void, awakened by",
                      "one human hand and many machine minds."],
             serifr(27), PORC, track=2, lh=48)
    img = halo(img, W//2, 1000, r=140)
    return chrome(img, 1)

def slide_premise():
    img = base(); d = ImageDraw.Draw(img)
    d.text((54, 150), "WHERE IT STANDS", font=serif(46), fill=PORC)
    paras(img, 56, 280, [
        "Episode 01 locked the shape: a faceless signal, its mount, the way they ride.",
        "But a shape needs a place to exist. Before any scene, the world needs its first landmark — something the entity can stand against.",
        "So this transmission steps back from the figure and builds the void it stands in.",
    ], body(27), SILVER, 940, lh=44, pgap=26)
    img = halo(img, W//2, 1080, r=120)
    return chrome(img, 2)

def slide_landmark():
    img = base(); d = ImageDraw.Draw(img)
    d.text((54, 150), "THE FIRST LANDMARK", font=serif(42), fill=PORC)
    img = place_image(img, f"{SRC}/MIKAGE_WORLD_MONOLITH_BW_V0_1.png", (54, 240, 1026, 880),
                      "WORLD MONOLITH V0.1 — GRAYSCALE")
    paras(img, 56, 930, [
        "One slab in an empty field. A monolith — colossal, industrial, silent — with a single light seam down its face.",
        "Distant towers set the scale. A lone figure at its base proves how small the signal still is.",
    ], body(24), SILVER, 960, lh=38, pgap=18)
    return chrome(img, 3)

def slide_seam():
    img = base(); d = ImageDraw.Draw(img)
    d.text((54, 150), "THE ONLY LIGHT", font=serif(46), fill=PORC)
    paras(img, 56, 270, [
        "In this world, violet is not decoration. It is the only light — kept to a thin, broken seam in the monolith's face.",
        "No warm color. No glow that fills the frame. The dark stays dark, so the signal means something.",
    ], body(26), SILVER, 940, lh=42, pgap=24)
    img = vseam(img, W//2, 560, 1180, segs=8, gap=18)
    d = ImageDraw.Draw(img)
    tracked(d, (W/2, 1210), "VIOLET = SIGNAL, NEVER A FILL", mono(14), SILVER2, track=3, anchor="ma")
    return chrome(img, 4)

def slide_ride():
    img = base(); d = ImageDraw.Draw(img)
    d.text((54, 150), "THE RIDE", font=serif(46), fill=PORC)
    img = place_image(img, f"{SRC}/MIKAGE_HERO_RIDE_MONOLITH_BW_V0_2.png", (54, 240, 1026, 790),
                      "HERO RIDE V0.2 — LAYOUT PROOF")
    paras(img, 56, 840, [
        "Entity and mount, placed against the landmark. This is a layout test — scale, distance, and stance, nothing more.",
        "The rider is still a stand-in proxy. What it proves: the world can hold them, and they read as one silhouette in it.",
    ], body(25), SILVER, 960, lh=40, pgap=20)
    return chrome(img, 5)

def slide_rules():
    img = base(); d = ImageDraw.Draw(img)
    d.text((54, 150), "WORLD RULES", font=serif(46), fill=PORC)
    tracked(d, (56, 230), "GRAYSCALE-FIRST, SIGNAL-ONLY", mono(15), SILVER2, track=2)
    img = bullets(img, 60, 320, [
        "A void field — black, deep, mostly empty.",
        "One monolith. A single landmark, not a skyline.",
        "Violet only in the seam — thin, broken, never a bar.",
        "Distant towers for scale; a lone figure for awe.",
        "No warm light. No clutter. No fake UI.",
    ], gap=130, bw=900)
    return chrome(img, 6)

def slide_honest():
    img = base(); d = ImageDraw.Draw(img)
    d.text((54, 150), "WHAT'S LOCKED — AND WHAT ISN'T", font=serif(36), fill=PORC)
    img = bullets(img, 60, 280, [
        "LOCKED: the world's mood — void, monolith, seam.",
        "LOCKED: the ride layout — scale and stance hold.",
        "NOT YET: material and depth — this is grayscale.",
        "NOT YET: the real rider, lit and surfaced.",
        "NOT canon. A candidate, not an asset-lock.",
    ], gap=110, bw=900)
    paras(img, 56, 880, [
        "The order is deliberate: mood before material, layout before light. Lock what the world feels like first; everything rendered later has somewhere honest to stand.",
    ], body(24), SILVER2, 960, lh=40, pgap=18)
    return chrome(img, 7)

def slide_next():
    img = base(); d = ImageDraw.Draw(img)
    d.text((54, 150), "NEXT TRANSMISSION", font=serif(44), fill=PORC)
    paras(img, 56, 280, [
        "Next, the world gets lit. A real material pass — porcelain, graphite, cold steel — then motion, as the entity rides toward the monolith.",
        "From a locked shape to a living frame.",
    ], body(26), SILVER, 960, lh=42, pgap=22)
    img = halo(img, W//2, 760, r=130)
    d = ImageDraw.Draw(img)
    tracked(d, (W/2, 1120), "MIKAGE ZENITH", serifr(34), PORC, track=8, anchor="ma")
    tracked(d, (W/2, 1185), "FROM THE VOID TO THE WORLD", mono(15), VIOLET2, track=4, anchor="ma")
    d.ellipse((W//2-5, 1240, W//2+5, 1250), fill=VIOLET)
    d.line((W//2-60, 1245, W//2-12, 1245), fill=DIMV, width=1)
    d.line((W//2+12, 1245, W//2+60, 1245), fill=DIMV, width=1)
    return chrome(img, 8)

slides = [slide_title, slide_premise, slide_landmark, slide_seam,
          slide_ride, slide_rules, slide_honest, slide_next]
for i, fn in enumerate(slides, 1):
    fn().save(os.path.join(OUT, f"slide_{i}.png"))
    print("saved slide", i)
print("DONE")
