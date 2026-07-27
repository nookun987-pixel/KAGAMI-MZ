# -*- coding: utf-8 -*-
r"""
MIKAGE BUILD LOG - THE ZENITH BLADE (new entry, per 00_BUILD_LOG_STANDARD.md SCOPE RULE).
v2 REWORK 2026-07-25: v1 was still-image-only (contact sheets shrunk into small bracket boxes)
-- operator flagged it as low production value and pointed out real motion footage already
exists and was not used. v2 replaces/augments with actual rendered motion wherever it exists:
  - cold open: MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1 S0_DORMANT -> S1_AWARE (real ignition, eyes
    lighting up), not a static PNG.
  - V0.17 chapter: MIKAGE_ZENITH_BLADE_FINALIZATION_V0_17_MOTION.mp4 (real render motion), not
    the static keyframe sheet.
  - new bridge chapter: MIKAGE_ZENITH_BLADE_CANON_BUILD_2D_TO_3D_V0_18.mp4 excerpt (real
    block-to-form motion).
  - finale: MIKAGE_ZENITH_BLADE_DEVELOPMENT_FILM_V0_19.mp4 excerpt -- the "03 / MIKAGE + ZENITH
    BLADE - STANDING HERO CANVAS - OPERATOR APPROVED" beat (~t=30-36s), the only motion asset in
    this whole arc marked OPERATOR APPROVED. Full-bleed, not boxed.
  Still-only milestones (V0.13-16: only contact sheets/keyframes exist, no motion) are now
  rendered near-full-frame (not shrunk into a small bracket box) and held longer for legibility.
  Milestones with a REVIEW_CROP (single clean subject) now use that instead of the multi-panel
  CONTACT_SHEET (same info, far more legible at this frame size).

Covers the Blade-only development arc built 2026-07-24 (all mtimes that day): V0.13 native
mechanics integration -> V0.14 deterministic phase timeline -> V0.15 shell cohesion
(operator-promoted SSOT) -> V0.16 surface/load-path registration -> V0.17 controlled
finalization -> V0.18/19 build motion (real footage, review-candidate, not yet public) ->
V0.20 hero-read refinement -> V0.21 controlled geometry finish -> V0.22 standalone extraction ->
V0.23 standalone form refinement -> V0.24 canon convergence -> V0.25 mechanical definition ->
V0.26 material fidelity (current candidate). Source doc:
production/character/build_log/MIKAGE_ZENITH_BLADE_DEVELOPMENT_BUILD_LOG_V0_1.md
Does NOT re-bundle any already-published chapter/film. Character/rider/steed/rig/website/
release work stays out of scope (Blade-only per that record) except where the Blade appears
inside already-existing V0.18/V0.19 review-candidate footage (not yet public).

STATUS OF SOURCE MATERIAL: every still/clip here is a REVIEW_CANDIDATE from
production/character/reviews/. V0.26 has NOT been operator-approved, asset-locked, or declared
production-ready/final/PASS. (The one exception: the V0.19 finale excerpt IS itself marked
"OPERATOR APPROVED" inside its own source film's on-screen chapter label -- that claim comes
from the source film, not fabricated here.) Every card is stamped PROTOTYPE // NOT CANON-LOCKED.

Editorial format matches every other GATHER_REEL entry: void/porcelain/violet, Cinzel titles,
Space Mono captions, 1080x1920/24fps. Music = operator-selected track for this entry (see
MUSIC below), muxed from 0:00.

Run:  python build_buildlog_blade.py [stage]
Stages: setup, ch1 (hook+open+01-03), ch2 (04-06incl.new bridge), ch3 (07-09), ch4 (10-12+finale+end), final, cleanup, all
Needs: Python 3 + pillow + numpy, ffmpeg/ffprobe on PATH. AUDIO root override via
MIKAGE_AUDIO_ROOT (defaults to the sibling "MIKAGE ZENITH AUDIO" folder). Output = PROTOTYPE /
NOT CANON-LOCKED, local only.
"""
import os, subprocess, tempfile, shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

HERE  = os.path.dirname(os.path.abspath(__file__))
REPO  = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
AUDIO = os.environ.get("MIKAGE_AUDIO_ROOT") or os.path.join(os.path.dirname(REPO), "MIKAGE ZENITH AUDIO")
FONTS = os.path.join(AUDIO, "tools", "mikage_short_toolkit")
REV   = os.path.join(REPO, "production", "character", "reviews")
BL    = os.path.join(REPO, "production", "character", "build_log")
# MUSIC: operator swap 2026-07-25 -- use the UPCOMING track "OVERWRITE" instead of the
# default-locked PORCELAIN ASCENSION (explicit operator override of 00_BUILD_LOG_STANDARD.md
# section 1 "do not change without operator" -- this IS that operator change).
MUSIC = os.path.join(AUDIO, "UPCOMING", "覆写 · OVERWRITE", "1_MASTER", "覆写 · OVERWRITE.wav")

# --- real motion sources (operator-requested 2026-07-25 pass) ---
HOOK_S0 = os.path.join(REV, "MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1_S0_DORMANT.mp4")   # eyes off
HOOK_S1 = os.path.join(REV, "MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1_S1_AWARE.mp4")     # eyes ignite
V17_MOTION = os.path.join(REV, "MIKAGE_ZENITH_BLADE_FINALIZATION_V0_17_MOTION.mp4")
V18_BUILD  = os.path.join(REV, "MIKAGE_ZENITH_BLADE_CANON_BUILD_2D_TO_3D_V0_18.mp4")
V19_FILM   = os.path.join(REV, "MIKAGE_ZENITH_BLADE_DEVELOPMENT_FILM_V0_19.mp4")
V19_HERO_START, V19_HERO_DUR = 30.0, 6.0   # "03 MIKAGE + ZENITH BLADE / STANDING HERO CANVAS / OPERATOR APPROVED"

# chapter stills -- milestones without motion footage; REVIEW_CROP preferred over CONTACT_SHEET
# where both exist (single clean subject reads far better at this frame size than a small grid).
C13 = os.path.join(REV, "MIKAGE_ZENITH_BLADE_NATIVE_INTEGRATION_V0_13_CONTACT_SHEET.png")
C14 = os.path.join(REV, "MIKAGE_ZENITH_BLADE_PHASE_TIMELINE_V0_14_KEYFRAMES.png")
C15 = os.path.join(REV, "MIKAGE_ZENITH_BLADE_SHELL_COHESION_V0_15_CONTACT_SHEET.png")
C16 = os.path.join(REV, "MIKAGE_ZENITH_BLADE_PRODUCTION_SURFACE_LOADPATH_V0_16_CONTACT_SHEET.png")
C20 = os.path.join(REV, "MIKAGE_ZENITH_BLADE_HERO_READ_REFINEMENT_V0_20_REVIEW_CROP.png")
C21 = os.path.join(REV, "MIKAGE_ZENITH_BLADE_CONTROLLED_GEOMETRY_FINISH_V0_21_REVIEW_CROP.png")
C22 = os.path.join(REV, "MIKAGE_ZENITH_BLADE_STANDALONE_ASSET_V0_22_REVIEW_CROP.png")
C23 = os.path.join(REV, "MIKAGE_ZENITH_BLADE_STANDALONE_FORM_REFINEMENT_V0_23_REVIEW_CROP.png")
C24 = os.path.join(REV, "MIKAGE_ZENITH_BLADE_CANON_CONVERGENCE_V0_24_REVIEW_CROP.png")
C25 = os.path.join(REV, "MIKAGE_ZENITH_BLADE_CANON_MECHANICAL_DEFINITION_V0_25_REVIEW_CROP.png")
C26 = os.path.join(REV, "MIKAGE_ZENITH_BLADE_MATERIAL_FIDELITY_V0_26_REVIEW_CROP.png")

OUT      = os.path.join(HERE, "MIKAGE_BUILDLOG_BLADE_V0_2.mp4")
OUT_HOOK = os.path.join(HERE, "MIKAGE_BUILDLOG_BLADE_V0_2_HOOK.mp4")

W,H,FR = 1080,1920,24
VOID=(5,5,8); PORC=(242,238,234); SIL=(150,150,168); VIOLET=(143,0,255)
VOID_HEX = "0x05050A"
CIN7=lambda s:ImageFont.truetype(os.path.join(FONTS,"cinzel700.ttf"),s)
CIN4=lambda s:ImageFont.truetype(os.path.join(FONTS,"cinzel400.ttf"),s)
SP  =lambda s:ImageFont.truetype(os.path.join(FONTS,"spacemono400.ttf"),s)

def sh(a): subprocess.run(a, check=True)
def base():
    img=Image.new("RGB",(W,H),VOID); halo=Image.new("RGB",(W,H),VOID)
    ImageDraw.Draw(halo).ellipse([W//2-360,760,W//2+360,1240],fill=(20,5,32))
    return Image.blend(img,halo.filter(ImageFilter.GaussianBlur(200)),0.7)
def trk(d,y,t,f,fill,tr):
    x=W/2-(sum(d.textlength(c,font=f) for c in t)+tr*(len(t)-1))/2
    for c in t: d.text((x,y),c,font=f,fill=fill); x+=d.textlength(c,font=f)+tr
def fit(d,t,fn,hi,lo,tr,maxw):
    s=hi
    while s>lo:
        f=fn(s)
        if sum(d.textlength(c,font=f) for c in t)+tr*(len(t)-1)<=maxw: return f
        s-=2
    return fn(lo)
def vdiv(img,y):
    g=Image.new("RGB",(W,H),(0,0,0)); ImageDraw.Draw(g).line([(W//2-70,y),(W//2+70,y)],fill=VIOLET,width=3)
    return Image.composite(Image.new("RGB",(W,H),VIOLET),img,g.filter(ImageFilter.GaussianBlur(4)).convert("L").point(lambda v:min(255,v*2)))
def grain(img,seed):
    rng=np.random.default_rng(seed); n=rng.normal(0,4,(H,W,1)).repeat(3,2)
    return Image.fromarray(np.clip(np.asarray(img).astype(np.int16)+n.astype(np.int16),0,255).astype(np.uint8))

def card(path, header, title, sub):
    img=base(); d=ImageDraw.Draw(img)
    trk(d,150,"MIKAGE ZENITH",CIN4(38),SIL,13); trk(d,214,header,SP(24),(110,106,118),8)
    tf=fit(d,title,CIN7,100,42,6,W-150); trk(d,870,title,tf,PORC,6)
    img=vdiv(img,1010); d=ImageDraw.Draw(img)
    if sub: trk(d,1052,sub,SP(24),SIL,3)
    trk(d,H-130,"PROTOTYPE  //  NOT CANON-LOCKED",SP(22),(150,122,180),3)
    grain(img,7).save(path)

def label_overlay(path, label, small=False):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    trk(d,150,label,CIN4(34 if small else 36),PORC,7)
    trk(d,1770 if small else 1740,"PROTOTYPE  //  NOT CANON-LOCKED",SP(22),(150,122,180),3)
    img.save(path)

def still(path, secs, out):
    sh(["ffmpeg","-y","-v","error","-loop","1","-t",str(secs),"-i",path,
        "-vf","scale=1080:1920,format=yuv420p","-r",str(FR),
        "-c:v","libx264","-preset","veryfast","-crf","19",out])

def clip_image(src, label, secs, w, out, maxw=1040, maxh=1780):
    """proof-style still: framed with corner brackets, used for review/proof material only."""
    ov=os.path.join(w,"ov_%s.png"%os.path.basename(out)); label_overlay(ov,label)
    im=Image.open(src).convert("RGB")
    r=min(maxw/im.width, maxh/im.height); im=im.resize((int(im.width*r),int(im.height*r)),Image.LANCZOS)
    cv=base(); px,py=(W-im.width)//2,(H-im.height)//2; cv.paste(im,(px,py))
    d=ImageDraw.Draw(cv); x0,y0=px-6,py-6; x1,y1=px+im.width+6,py+im.height+6
    for cx,cy in [(x0,y0),(x1,y0),(x0,y1),(x1,y1)]:
        d.line([cx-18,cy,cx+18,cy],fill=(130,126,140),width=1); d.line([cx,cy-18,cx,cy+18],fill=(130,126,140),width=1)
    base_png=os.path.join(w,"img_%s.png"%os.path.basename(out)); grain(cv,3).save(base_png)
    sh(["ffmpeg","-y","-v","error","-loop","1","-t",str(secs),"-i",base_png,"-loop","1","-i",ov,
        "-filter_complex","[0:v][1:v]overlay=0:0:shortest=1,format=yuv420p","-t",str(secs),"-r",str(FR),
        "-c:v","libx264","-preset","veryfast","-crf","19",out])

def full_bleed(src, w, out, start=0.0, dur=None, label=None, small_label=False):
    """real footage, no bracket box: scale-to-fit within the 1080x1920 canvas on void, centered.
    This is the 'finished shot' treatment (matches the FLAGSHIP film's hero-clip convention),
    distinct from clip_image's 'proof/review' bracket treatment."""
    ov=os.path.join(w,"ov_%s.png"%os.path.basename(out))
    if label:
        label_overlay(ov, label, small_label)
    else:
        Image.new("RGBA",(W,H),(0,0,0,0)).save(ov)
    ss = ["-ss", str(start)] if start else []
    tt = ["-t", str(dur)] if dur else []
    sh(["ffmpeg","-y","-v","error", *ss, "-i", src, *tt, "-loop","1","-i",ov,
        "-filter_complex",
        "[0:v]scale=%d:%d:force_original_aspect_ratio=decrease,pad=%d:%d:(ow-iw)/2:(oh-ih)/2:color=%s,setsar=1,fps=%d[v];[v][1:v]overlay=0:0:shortest=1,format=yuv420p"%(W,H,W,H,VOID_HEX,FR),
        "-c:v","libx264","-preset","veryfast","-crf","19","-an",out])

WORK = os.environ.get("MIKAGE_BLADE_WORK") or os.path.join(tempfile.gettempdir(), "mikage_blade_buildlog_work")
MANIFEST = os.path.join(WORK, "manifest.txt")

def _append_manifest(path):
    with open(MANIFEST, "a") as f: f.write(path + "\n")

def title_card(name, header, title, sub, secs=2.0):
    c=os.path.join(WORK,name+".png"); card(c,header,title,sub)
    s=os.path.join(WORK,"s_"+name+".mp4"); still(c,secs,s); _append_manifest(s)

def chapter_still(n, src, label, header, title, sub, secs=4.2, maxw=1040, maxh=1780):
    title_card("t%s"%n, header, title, sub)
    sc=os.path.join(WORK,"c%s.mp4"%n)
    clip_image(src, label, secs, WORK, sc, maxw, maxh)
    _append_manifest(sc)

def chapter_motion(n, src, label, header, title, sub, start=0.0, dur=None, small_label=False):
    title_card("t%s"%n, header, title, sub)
    sc=os.path.join(WORK,"c%s.mp4"%n)
    full_bleed(src, WORK, sc, start, dur, label, small_label)
    _append_manifest(sc)

def stage_setup():
    os.makedirs(WORK, exist_ok=True)
    open(MANIFEST,"w").close()
    need=[HOOK_S0,HOOK_S1,V17_MOTION,V18_BUILD,V19_FILM,
          C13,C14,C15,C16,C20,C21,C22,C23,C24,C25,C26,MUSIC]
    miss=[p for p in need if not os.path.exists(p)]
    if miss:
        for p in miss: print("!! MISSING:",p)
        raise SystemExit(1)
    print("setup ok, WORK=",WORK)

def stage_open_ch1():
    # cold-open hook: REAL ignition motion (dormant -> aware), full-bleed, no title text yet
    hk0=os.path.join(WORK,"hook0.mp4"); full_bleed(HOOK_S0,WORK,hk0,label="MIKAGE ZENITH",small_label=True); _append_manifest(hk0)
    hk1=os.path.join(WORK,"hook1.mp4"); full_bleed(HOOK_S1,WORK,hk1,label="THE MASK",small_label=True); _append_manifest(hk1)
    title_card("c0","BUILD LOG  //  THE ZENITH BLADE","MONOLITH. MECHANISM. SIGNAL.","V0.13 -> V0.26  ·  2026-07-24",2.6)
    chapter_still("01",C13,"V0.13 · NATIVE INTEGRATION","01  ·  THE INTEGRATION","REBUILT FROM THE SLAB","P1 closed · P2 split, no signal · P3 one core")
    chapter_still("02",C14,"V0.14 · PHASE TIMELINE","02  ·  THE TIMELINE","THE PHASES LOCK","frame 1 · frame 31 · frame 61 · no drift")
    chapter_still("03",C15,"V0.15 · SHELL COHESION","03  ·  THE SHELL","ONE SHARED CONTOUR","four plates · spine · rails · promoted SSOT")
    print("ch1 done")

def stage_ch2():
    chapter_still("04",C16,"V0.16 · SURFACE / LOAD-PATH","04  ·  THE LOAD PATH","WHAT CARRIES WHAT","B4C · graphite · cold steel · drive hub · flux-pinning")
    # V0.17: real render motion, not a static keyframe
    title_card("t05","V0.17 · CONTROLLED FINALIZATION","05  ·  THE FINISH","transitions smoothed · real render motion")
    c05=os.path.join(WORK,"c05.mp4"); full_bleed(V17_MOTION,WORK,c05,label="V0.17 · FINALIZATION MOTION",small_label=True); _append_manifest(c05)
    # NEW bridge chapter: real 2D->3D build motion (V0.18), addresses "still-image only" gap
    title_card("t06","V0.18 · CANON BUILD","06  ·  THE BUILD, IN MOTION","block to form · real render, not a slideshow")
    c06=os.path.join(WORK,"c06.mp4"); full_bleed(V18_BUILD,WORK,c06,start=0.0,dur=6.0,label="V0.18 · 2D -> 3D BUILD",small_label=True); _append_manifest(c06)
    print("ch2 done")

def stage_ch3():
    chapter_still("07",C20,"V0.20 · HERO-READ REFINEMENT","07  ·  THE HERO READ","MADE TO BE SEEN","exposure · light separation · material distinction")
    chapter_still("08",C21,"V0.21 · CONTROLLED GEOMETRY FINISH","08  ·  THE CHAMFER","RESTRAINED EDGES","non-destructive chamfers · nothing else moved")
    chapter_still("09",C22,"V0.22 · STANDALONE EXTRACTION","09  ·  STANDALONE","CUT FREE","weapon-only scene · fixtures removed")
    print("ch3 done")

def stage_ch4a():
    chapter_still("10",C23,"V0.23 · STANDALONE FORM REFINEMENT","10  ·  THE REFINEMENT","THE SEAMS SETTLE","connected seams · hub / base hierarchy")
    chapter_still("11",C24,"V0.24 · CANON CONVERGENCE","11  ·  CONVERGENCE","ROLES, REASSERTED","porcelain · titanium · cold steel · one silhouette")
    print("ch4a done")

def stage_ch4b():
    chapter_still("12",C25,"V0.25 · MECHANICAL DEFINITION","12  ·  THE MECHANISM","DEPTH, TIGHTENED","spine · rails · collars · load hierarchy")
    chapter_still("13",C26,"V0.26 · MATERIAL FIDELITY","13  ·  THE SIGNAL","ONE VIOLET CORE","P3-only signal · current candidate, not approved",4.6,780,1300)
    print("ch4b done")

def stage_ch4c():
    # finale: real motion, the ONLY beat in this arc the source film itself marks operator-approved
    title_card("t14","MIKAGE + ZENITH BLADE","14  ·  IT IS WORN","standing hero canvas · operator-approved read",2.6)
    c14=os.path.join(WORK,"c14.mp4"); full_bleed(V19_FILM,WORK,c14,start=V19_HERO_START,dur=V19_HERO_DUR,label="V0.19 FILM EXCERPT · OPERATOR-APPROVED READ",small_label=True); _append_manifest(c14)
    title_card("e","MIKAGE ZENITH","THE ZENITH BLADE","覆写 · OVERWRITE",3.0)
    print("ch4c/end done")

def stage_ch4_end():
    stage_ch4a(); stage_ch4b(); stage_ch4c()

def stage_finalize():
    seg=[l.strip() for l in open(MANIFEST) if l.strip()]
    cl=os.path.join(WORK,"cl.txt"); open(cl,"w").write("".join("file '%s'\n"%x for x in seg))
    vid=os.path.join(WORK,"vid.mp4")
    try: sh(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",cl,"-c","copy",vid])
    except subprocess.CalledProcessError:
        sh(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",cl,"-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p","-r",str(FR),vid])
    dur=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",vid]).decode().strip())
    au=os.path.join(WORK,"au.m4a"); fade=max(0.1,dur-2.0)
    sh(["ffmpeg","-y","-v","error","-ss","0","-t","%.2f"%dur,"-i",MUSIC,"-af","afade=t=in:st=0:d=0.6,afade=t=out:st=%.2f:d=2.0"%fade,"-ar","48000","-ac","2","-c:a","aac","-b:a","320k",au])
    tmp=OUT+".tmp.mp4"; sh(["ffmpeg","-y","-v","error","-i",vid,"-i",au,"-map","0:v:0","-map","1:a:0","-c:v","copy","-c:a","copy","-shortest",tmp]); os.replace(tmp,OUT)
    print("BUILD LOG saved:",OUT,"dur=%.1fs"%dur)
    start=max(0,dur-18); th=OUT_HOOK+".tmp.mp4"
    sh(["ffmpeg","-y","-v","error","-ss","%.2f"%start,"-i",OUT,"-t","18","-c","copy",th]); os.replace(th,OUT_HOOK)
    print("HOOK saved:",OUT_HOOK)

def stage_cleanup():
    shutil.rmtree(WORK, ignore_errors=True)
    print("cleaned up", WORK)

def main():
    stage_setup(); stage_open_ch1(); stage_ch2(); stage_ch3(); stage_ch4_end(); stage_finalize(); stage_cleanup()

STAGES = {
    "setup": stage_setup, "ch1": stage_open_ch1, "ch2": stage_ch2, "ch3": stage_ch3,
    "ch4a": stage_ch4a, "ch4b": stage_ch4b, "ch4c": stage_ch4c,
    "ch4": stage_ch4_end, "final": stage_finalize, "cleanup": stage_cleanup, "all": main,
}

if __name__=="__main__":
    import sys
    stage = sys.argv[1] if len(sys.argv) > 1 else "all"
    STAGES[stage]()
