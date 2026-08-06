# -*- coding: utf-8 -*-
r"""
MIKAGE BUILD LOG - THE ZENITH BLADE (CE arc), per 00_BUILD_LOG_STANDARD.md SCOPE RULE.

Covers the NEXT arc only: CE01 -> CE15 candidate cycle, the evidence campaign, the design
board V0->V1, and the canon lock (2026-08-04 -> 2026-08-06). Does NOT re-bundle
MIKAGE_BUILDLOG_BLADE_V0_2 (V0.13->V0.26, built 2026-07-25) - one origins beat only, labelled
PRIOR ARC.

Editorial format inherited verbatim from build_buildlog_blade.py: void/porcelain/violet,
Cinzel titles, Space Mono captions, 1080x1920/24fps, bracket-framed proof stills, grain,
PROTOTYPE // NOT CANON-LOCKED on every card. ASCII-only glyphs (Space Mono has no arrow).

COMPOSITE ONLY. No Blender, no render, no AI generation. Every frame is an existing file on
disk, contain-fit scaled - never cropped into the subject, never content-altered.

MUSIC: PORCELAIN ASCENSION _INSTRUMENTAL (LIVE) - the standard's section-1 locked track, and an
instrumental. CTA is therefore unambiguously `Listen now`.

Run:  python build_buildlog_zenith_blade.py [stage]
Stages: setup, ch1, ch2, ch3, ch4, final, cleanup, all
Needs: Python 3 + pillow + numpy, ffmpeg/ffprobe on PATH. AUDIO root override via
MIKAGE_AUDIO_ROOT. Output = v0.1 DRAFT, PROTOTYPE / NOT CANON-LOCKED, local only.
"""
import os, subprocess, tempfile, shutil, json, hashlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

HERE  = os.path.dirname(os.path.abspath(__file__))
REPO  = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
AUDIO = os.environ.get("MIKAGE_AUDIO_ROOT") or os.path.join(os.path.dirname(REPO), "MIKAGE ZENITH AUDIO")
FONTS = os.path.join(AUDIO, "tools", "mikage_short_toolkit")
MUSIC = os.path.join(AUDIO, "LIVE", "06. PORCELAIN ASCENSION", "1_MASTER",
                     "PORCELAIN ASCENSION_INSTRUMENTAL.wav")
OPDIR = r"C:\Users\nt\Claude\Projects\Mikage Zenith — Studio OS\BLADE_V0.1"

R = lambda *p: os.path.join(REPO, *p)
CE  = lambda n, *p: R("_tmp", "zenith_blade_hero_e1_ce%02d" % n, *p)
P3  = lambda f: CE(15, "hero_cohesion_correction01", "pass_03", f)
EVD = lambda f: R("renders", "board_v1_evidence", f)

S_OPEN = EVD("OUT1_HERO_P3_85MM.png")
# PRIOR-ARC bridge still. NOTE: MIKAGE_ZENITH_BLADE_LOCKED_4x5.png was measured WARM
# (avg RGB 29,24,21 - R above B) and is therefore EXCLUDED under the studio no-warm-colour
# ban. It cannot be colour-corrected: that would alter evidence content. This thumbnail is
# the same arc, measured cool/violet (avg RGB 20,16,28) and brand-compatible.
S00 = os.path.join(OPDIR, "MIKAGE_BLADE_BUILD_THUMBNAIL_4x5.png")
S01 = CE(1, "clean_replay02", "pass6_preview", "REPLAY02_PASS6_hero_34.png")
S02 = CE(2, "form02", "pass_01", "FORM02_PASS01_hero.png")
S03 = CE(4, "architecture01", "pass_01", "ARCH01_PASS01_p1_hero34.png")
S04 = CE(5, "architecture02", "pass_01", "ARCH02_PASS01_monolith_hero.png")
S05 = CE(6, "architecture03", "pass_01", "ARCH03_PASS01_hero.png")
S06 = CE(9, "architecture03_rebuild", "MOTION_f61.png")
S07 = CE(12, "silhouette_fusion01", "pass_01", "SF_hero_P3.png")
S08 = CE(13, "final_form_polish01", "pass_01", "FP_hero_P3.png")
S09 = CE(14, "hero_design_pass01", "pass_01", "HP_hero_P3.png")
S10 = P3("HC_hero_P3.png")
S11 = P3("HC_authored_P3.png")
S12 = EVD("OUT1_HERO_P3_85MM_ANNOTATED.png")
S13 = EVD("OUT2_CORE_SPINE_SECTION_ANNOTATED.png")
S14 = EVD("OUT3_EXPLODED_LOADPATH_ANNOTATED.png")
S15 = EVD("OUT4_SCALE_VS_HUMAN_ANNOTATED.png")
S16 = R("ZENITH_BLADE_DESIGN_BOARD_V0.png")
S17 = R("ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.png")

ALL_SOURCES = [S_OPEN, S00, S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11,
               S12, S13, S14, S15, S16, S17]

OUT = os.path.join(HERE, "MIKAGE_BUILDLOG_ZENITH_BLADE_V0_1.mp4")
SHOTMAN = os.path.join(HERE, "MIKAGE_BUILDLOG_ZENITH_BLADE_V0_1_SHOT_MANIFEST.md")

W, H, FR = 1080, 1920, 24
VOID = (5, 5, 8); PORC = (242, 238, 234); SIL = (150, 150, 168); VIOLET = (143, 0, 255)
VOID_HEX = "0x05050A"
CIN7 = lambda s: ImageFont.truetype(os.path.join(FONTS, "cinzel700.ttf"), s)
CIN4 = lambda s: ImageFont.truetype(os.path.join(FONTS, "cinzel400.ttf"), s)
SP   = lambda s: ImageFont.truetype(os.path.join(FONTS, "spacemono400.ttf"), s)

def sh(a): subprocess.run(a, check=True)

def base():
    img = Image.new("RGB", (W, H), VOID); halo = Image.new("RGB", (W, H), VOID)
    ImageDraw.Draw(halo).ellipse([W // 2 - 360, 760, W // 2 + 360, 1240], fill=(20, 5, 32))
    return Image.blend(img, halo.filter(ImageFilter.GaussianBlur(200)), 0.7)

def trk(d, y, t, f, fill, tr):
    x = W / 2 - (sum(d.textlength(c, font=f) for c in t) + tr * (len(t) - 1)) / 2
    for c in t:
        d.text((x, y), c, font=f, fill=fill); x += d.textlength(c, font=f) + tr

def fit(d, t, fn, hi, lo, tr, maxw):
    s = hi
    while s > lo:
        f = fn(s)
        if sum(d.textlength(c, font=f) for c in t) + tr * (len(t) - 1) <= maxw: return f
        s -= 2
    return fn(lo)

def vdiv(img, y):
    g = Image.new("RGB", (W, H), (0, 0, 0))
    ImageDraw.Draw(g).line([(W // 2 - 70, y), (W // 2 + 70, y)], fill=VIOLET, width=3)
    return Image.composite(Image.new("RGB", (W, H), VIOLET), img,
                           g.filter(ImageFilter.GaussianBlur(4)).convert("L").point(lambda v: min(255, v * 2)))

def grain(img, seed):
    rng = np.random.default_rng(seed); n = rng.normal(0, 4, (H, W, 1)).repeat(3, 2)
    return Image.fromarray(np.clip(np.asarray(img).astype(np.int16) + n.astype(np.int16), 0, 255).astype(np.uint8))

def card(path, header, title, sub):
    img = base(); d = ImageDraw.Draw(img)
    trk(d, 150, "MIKAGE ZENITH", CIN4(38), SIL, 13)
    trk(d, 214, header, SP(24), (110, 106, 118), 8)
    tf = fit(d, title, CIN7, 100, 42, 6, W - 150); trk(d, 870, title, tf, PORC, 6)
    img = vdiv(img, 1010); d = ImageDraw.Draw(img)
    if sub: trk(d, 1052, sub, SP(24), SIL, 3)
    trk(d, H - 130, "PROTOTYPE  //  NOT CANON-LOCKED", SP(22), (150, 122, 180), 3)
    grain(img, 7).save(path)

def end_card(path):
    img = base(); d = ImageDraw.Draw(img)
    trk(d, 150, "MIKAGE ZENITH", CIN4(38), SIL, 13)
    trk(d, 214, "BUILD LOG  //  THE ZENITH BLADE", SP(24), (110, 106, 118), 8)
    trk(d, 700, "THE ZENITH BLADE", CIN7(76), PORC, 6)
    img = vdiv(img, 820); d = ImageDraw.Draw(img)
    rows = [("CE15  ·  VISUAL FORM AUTHORITY", PORC),
            ("CANON LOCK  ·  APPROVED  2026-08-06", (168, 120, 230)),
            ("MATERIAL CANON  ·  RECONCILED  2026-08-06", (168, 120, 230)),
            ("", SIL),
            ("ASSET LOCK  ·  NOT ISSUED", (196, 108, 108)),
            ("PRODUCTION READY  ·  NOT ISSUED", (196, 108, 108))]
    y = 890
    for t, c in rows:
        if t: trk(d, y, t, SP(26), c, 3)
        y += 46
    trk(d, 1330, "PORCELAIN ASCENSION", SP(24), SIL, 4)
    trk(d, H - 130, "PROTOTYPE  //  NOT CANON-LOCKED", SP(22), (150, 122, 180), 3)
    grain(img, 11).save(path)

def label_overlay(path, label, caption=None, small=False):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    trk(d, 150, label, CIN4(34 if small else 36), PORC, 7)
    if caption: trk(d, 1700, caption, SP(21), SIL, 2)
    trk(d, 1770, "PROTOTYPE  //  NOT CANON-LOCKED", SP(22), (150, 122, 180), 3)
    img.save(path)

def still(path, secs, out):
    sh(["ffmpeg", "-y", "-v", "error", "-loop", "1", "-t", str(secs), "-i", path,
        "-vf", "scale=1080:1920,format=yuv420p", "-r", str(FR),
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", out])

def clip_image(src, label, secs, w, out, caption=None, maxw=1000, maxh=1330):
    """bracket-framed proof still; contain-fit only - never crops into the subject."""
    ov = os.path.join(w, "ov_%s.png" % os.path.basename(out)); label_overlay(ov, label, caption)
    im = Image.open(src).convert("RGB")
    r = min(maxw / im.width, maxh / im.height)
    im = im.resize((max(1, int(im.width * r)), max(1, int(im.height * r))), Image.LANCZOS)
    cv = base(); px, py = (W - im.width) // 2, (H - im.height) // 2 - 40
    cv.paste(im, (px, py))
    d = ImageDraw.Draw(cv); x0, y0 = px - 6, py - 6; x1, y1 = px + im.width + 6, py + im.height + 6
    for cx, cy in [(x0, y0), (x1, y0), (x0, y1), (x1, y1)]:
        d.line([cx - 18, cy, cx + 18, cy], fill=(130, 126, 140), width=1)
        d.line([cx, cy - 18, cx, cy + 18], fill=(130, 126, 140), width=1)
    bp = os.path.join(w, "img_%s.png" % os.path.basename(out)); grain(cv, 3).save(bp)
    sh(["ffmpeg", "-y", "-v", "error", "-loop", "1", "-t", str(secs), "-i", bp, "-loop", "1", "-i", ov,
        "-filter_complex", "[0:v][1:v]overlay=0:0:shortest=1,format=yuv420p", "-t", str(secs),
        "-r", str(FR), "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", out])

def full_bleed_still(src, w, out, secs, label=None):
    """cold open: existing still, contain-fit on void, no bracket, minimal text."""
    ov = os.path.join(w, "ovfb_%s.png" % os.path.basename(out))
    if label: label_overlay(ov, label, None, True)
    else: Image.new("RGBA", (W, H), (0, 0, 0, 0)).save(ov)
    im = Image.open(src).convert("RGB")
    r = min(W / im.width, H / im.height)
    im = im.resize((max(1, int(im.width * r)), max(1, int(im.height * r))), Image.LANCZOS)
    cv = base(); cv.paste(im, ((W - im.width) // 2, (H - im.height) // 2))
    bp = os.path.join(w, "fb_%s.png" % os.path.basename(out)); grain(cv, 5).save(bp)
    sh(["ffmpeg", "-y", "-v", "error", "-loop", "1", "-t", str(secs), "-i", bp, "-loop", "1", "-i", ov,
        "-filter_complex", "[0:v][1:v]overlay=0:0:shortest=1,format=yuv420p", "-t", str(secs),
        "-r", str(FR), "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", out])

WORK = os.environ.get("MIKAGE_ZBLADE_WORK") or os.path.join(tempfile.gettempdir(), "mikage_zblade_buildlog")
MANIFEST = os.path.join(WORK, "manifest.txt")
SHOTS = []

def _app(p):
    with open(MANIFEST, "a") as f: f.write(p + "\n")

def title_card(name, header, title, sub, secs=2.0):
    c = os.path.join(WORK, name + ".png"); card(c, header, title, sub)
    s = os.path.join(WORK, "s_" + name + ".mp4"); still(c, secs, s); _app(s)

def chapter(n, src, label, header, title, sub, caption=None, secs=4.2, maxw=1000, maxh=1330):
    title_card("t%s" % n, header, title, sub)
    sc = os.path.join(WORK, "c%s.mp4" % n)
    clip_image(src, label, secs, WORK, sc, caption, maxw, maxh)
    _app(sc); SHOTS.append((n, src, label, secs))

def beat(n, src, label, caption=None, secs=3.4, maxw=1000, maxh=1330):
    sc = os.path.join(WORK, "c%s.mp4" % n)
    clip_image(src, label, secs, WORK, sc, caption, maxw, maxh)
    _app(sc); SHOTS.append((n, src, label, secs))

def stage_setup():
    os.makedirs(WORK, exist_ok=True); open(MANIFEST, "w").close()
    miss = [p for p in ALL_SOURCES + [MUSIC] if not os.path.exists(p)]
    for p in miss: print("!! MISSING:", p)
    if miss: raise SystemExit(1)
    for f in ("cinzel700.ttf", "cinzel400.ttf", "spacemono400.ttf"):
        if not os.path.exists(os.path.join(FONTS, f)):
            print("!! MISSING FONT:", f); raise SystemExit(1)
    print("setup ok, WORK=", WORK)

def stage_ch1():
    op = os.path.join(WORK, "open.mp4")
    full_bleed_still(S_OPEN, WORK, op, 4.0, "MIKAGE ZENITH"); _app(op)
    SHOTS.append(("OPEN", S_OPEN, "cold open", 4.0))
    title_card("c0", "BUILD LOG  //  THE ZENITH BLADE", "THE FORM THAT WON",
               "CE01 -> CE15  ·  2026-08-04 to 2026-08-06", 2.8)
    chapter("00", S00, "PRIOR ARC  ·  BEFORE THIS CYCLE", "00  ·  WHERE IT STOOD",
            "THE PREVIOUS RECORD", "already logged - V0.13 to V0.26 - not retold here",
            "operator archive - date UNCONFIRMED - its 'V0.1 LOCKED' label is that arc's own, superseded", 3.6)
    chapter("01", S01, "CE01 · INTERFACE STUDY", "01  ·  THE INTERFACE",
            "HOW IT MEETS THE HAND", "2026-08-04", "the grip is decided before the blade is")
    chapter("02", S02, "CE02 · FORM 02", "02  ·  THE SILHOUETTE",
            "SEARCHING FOR A READ", "2026-08-04", "a shape you can name at 64 px, or it fails")
    print("ch1 done")

def stage_ch2():
    chapter("03", S03, "CE04 · ARCHITECTURE 01", "03  ·  THE CABINET PROBLEM",
            "IT READ AS A BOX", "2026-08-04", "the cabinet problem -- reads as a box, not a blade")
    chapter("04", S04, "CE05 · ARCHITECTURE 02", "04  ·  ONE MASS",
            "STILL NOT A SILHOUETTE", "2026-08-04", "one mass. still not a silhouette.")
    chapter("05", S05, "CE06 · ARCHITECTURE 03", "05  ·  THE INSIGHT",
            "THE CHASSIS OWNS IT", "2026-08-05", "the chassis owns the silhouette")
    chapter("06", S06, "CE09 · ARCHITECTURE 03 REBUILD", "06  ·  THE REBUILD",
            "BUILT AGAIN, CLEANLY", "2026-08-06", "rebuilt from the corrected architecture")
    print("ch2 done")

def stage_ch3():
    chapter("07", S07, "CE12 · SILHOUETTE FUSION", "07  ·  FUSION",
            "THE OUTLINE SETTLES", "2026-08-06", "0 px deviation beyond anti-alias vs baseline")
    chapter("08", S08, "CE13 · FINAL FORM POLISH", "08  ·  THE POLISH",
            "THE SEAMS SETTLE", "2026-08-06", "edges resolved - nothing else moved")
    chapter("09", S09, "CE14 · HERO DESIGN PASS", "09  ·  THE HERO READ",
            "MADE TO BE SEEN", "2026-08-06", "value separation - material distinction")
    chapter("10", S10, "CE15 · HERO COHESION CORRECTION", "10  ·  THE FORM THAT WON",
            "CE15", "2026-08-06 - visual form authority",
            "four plates - spine - rails - one core", 4.6)
    beat("11", S11, "CE15 · P3 OVERDRIVE", "P3 only - single recessed core - restrained signal", 3.8)
    print("ch3 done")

def stage_ch4():
    title_card("t12", "THE EVIDENCE CAMPAIGN", "11  ·  PROVE IT",
               "four outstanding renders - 2026-08-06", 2.2)
    beat("12", S12, "OUT1 · 85 mm PERSPECTIVE HERO", "the hero plate the policy actually required")
    beat("13", S13, "OUT2 · CORE / SPINE SECTION",
         "true section evidence -- not an engineering drawing")
    beat("14", S14, "OUT3 · EXPLODED LOAD-PATH",
         "load-path evidence diagram -- not a manufacturing exploded view")
    beat("15", S15, "OUT4 · SCALE VS HUMAN", "1.200 m = 47.24 in -- inside canon 35-58 in")
    title_card("t16", "THE DESIGN BOARD", "12  ·  THE DOSSIER",
               "V0 partial -> V1 complete - 2026-08-06", 2.2)
    beat("16", S16, "BOARD V0 · FOUR SLOTS OPEN", "8 built - 4 pending render - 1 deferred", 3.6)
    beat("17", S17, "BOARD V1 · THIRTEEN PANELS", "13 built - 0 pending", 4.0)
    e = os.path.join(WORK, "end.png"); end_card(e)
    se = os.path.join(WORK, "s_end.mp4"); still(e, 3.4, se); _app(se)
    print("ch4 done")

def stage_finalize():
    seg = [l.strip() for l in open(MANIFEST) if l.strip()]
    cl = os.path.join(WORK, "cl.txt")
    open(cl, "w").write("".join("file '%s'\n" % x for x in seg))
    vid = os.path.join(WORK, "vid.mp4")
    try:
        sh(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", cl, "-c", "copy", vid])
    except subprocess.CalledProcessError:
        sh(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", cl,
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p",
            "-r", str(FR), vid])
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries",
                                         "format=duration", "-of", "csv=p=0", vid]).decode().strip())
    au = os.path.join(WORK, "au.m4a"); fade = max(0.1, dur - 2.0)
    sh(["ffmpeg", "-y", "-v", "error", "-ss", "0", "-t", "%.2f" % dur, "-i", MUSIC,
        "-af", "afade=t=in:st=0:d=0.8,afade=t=out:st=%.2f:d=2.0" % fade,
        "-ar", "48000", "-ac", "2", "-c:a", "aac", "-b:a", "320k", au])
    tmp = OUT + ".tmp.mp4"
    sh(["ffmpeg", "-y", "-v", "error", "-i", vid, "-i", au, "-map", "0:v:0", "-map", "1:a:0",
        "-c:v", "copy", "-c:a", "copy", "-shortest", tmp])
    os.replace(tmp, OUT)
    print("BUILD LOG saved:", OUT, "dur=%.1fs" % dur)

def stage_cleanup():
    shutil.rmtree(WORK, ignore_errors=True); print("cleaned up", WORK)

def main():
    stage_setup(); stage_ch1(); stage_ch2(); stage_ch3(); stage_ch4(); stage_finalize()

STAGES = {"setup": stage_setup, "ch1": stage_ch1, "ch2": stage_ch2, "ch3": stage_ch3,
          "ch4": stage_ch4, "final": stage_finalize, "cleanup": stage_cleanup, "all": main}

if __name__ == "__main__":
    import sys
    STAGES[sys.argv[1] if len(sys.argv) > 1 else "all"]()
