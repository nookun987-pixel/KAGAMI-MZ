# -*- coding: utf-8 -*-
r"""
MIKAGE BUILD LOG — STANDING HERO V0_5 (operator correction 2026-07-03 x2):
The v0_3/v0_4 rostrum-pan showed the WHOLE multi-panel proof sheet (including that sheet's
OWN baked labels, e.g. "BLOCKING front", "full body + blade") while my caption also drew on
top -> two different label voices fighting for the same frame ("text te le tua lua").

FIX (this version):
(1) HERO_CROP: before any beat, crop each source contact sheet down to ONE clean quadrant/panel
    (skips that sheet's own baked label strip via a top margin), so only MY caption carries text.
(2) STATIC HOLD instead of a diagonal pan: the cropped panel is centered and held STILL for the
    beat's duration (no motion) -> calm, steady, one readable caption at a time, like a lyric line
    over a held shot - matches "buoc di that cham nhung chac" (slow but sure steps), not a sweep.
(3) Caption content is unchanged: version chip + the two REAL per-round note lines (transcribed
    from dispatch/ruling records) - these are the "lyric" lines, but the content is technical
    build-log fact, not invented flavor text.

Still: FULL 0 -> final arc, chapters unchanged from v0_4 (incl. the V0.8.1 hue-fix milestone).

Supersedes v0_1/v0_2/v0_3/v0_4 scripts (kept for history — do not run).
Editorial format, music = PORCELAIN ASCENSION from 0:00.
HUE-SAFETY: MOTION V0.2 goes in UNGRADED — slit violet is operator-approved.

Run on the operator's machine:  python build_buildlog_standing_hero_v0_5.py
Needs: Python 3 + pillow + numpy, ffmpeg/ffprobe on PATH. Output = PROTOTYPE / NOT CANON-LOCKED, local only.
"""
import os, subprocess, tempfile, shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

HERE  = os.path.dirname(os.path.abspath(__file__))
REPO  = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
AUDIO = os.path.join(os.path.dirname(REPO), "MIKAGE ZENITH AUDIO")
FONTS = os.path.join(AUDIO, "tools", "mikage_short_toolkit")
REV   = os.path.join(REPO, "production", "character", "reviews")
P     = lambda n: os.path.join(REV, n)

MOT   = P("MIKAGE_STANDING_HERO_MOTION_V0_2.mp4")
MUSIC = os.path.join(AUDIO, "LIVE", "06. PORCELAIN ASCENSION", "1_MASTER", "PORCELAIN ASCENSION.wav")
OUT   = os.path.join(HERE, "MIKAGE_BUILDLOG_STANDING_HERO_V0_5.mp4")
OUT_HOOK = os.path.join(HERE, "MIKAGE_BUILDLOG_STANDING_HERO_V0_5_HOOK.mp4")

# ---- the arc: (chapter card, [(file, version label, note line 1, note line 2, secs), ...])
# notes = real record: dispatch DONE lines + operator rulings (handoff) + lock/approval records.
ARC = [
 ("01  ·  THE BLOCK", "IT BEGAN AS A BLOCK", "three blocking passes · silhouette only", [
  ("LANE_A_PUBLIC_TARGET_BLOCKING_PROOF_V0_1_CONTACT_SHEET.png", "BLOCKING V0.1",
   "first blocking - silhouette only, no detail", "checked against the Lane B public target", 4.2),
  ("LANE_A_PUBLIC_TARGET_BLOCKING_V0_2_REFINEMENT_PROOF_CONTACT_SHEET.png", "BLOCKING V0.2",
   "refinement pass on the same block", "proportions pulled toward the target", 3.8),
  ("LANE_A_PUBLIC_TARGET_BLOCKING_V0_3_SHAPE_POLISH_PROOF_CONTACT_SHEET.png", "BLOCKING V0.3",
   "shape polish", "RULING: blocking FROZEN - this envelope is law", 4.0),
 ]),
 ("02  ·  THE MASTER", "MATCHED TO THE DRAWING", "the 2D master sheet stays the law", [
  ("MIKAGE_MATCH_3D_TO_MASTER_V0_1_CONTACT_SHEET.png", "MATCH TO MASTER V0.1",
   "3D bent back onto the 2D master sheet", "silhouette / halo / slits re-aligned", 4.0),
  ("MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2_CONTACT_SHEET.png", "MICRO CORRECTION V0.2",
   "micro-geometry correction pass", "small drifts hunted down one by one", 3.6),
 ]),
 ("03  ·  THE HELMET", "FIVE PASSES OF PORCELAIN", "rebuilt until the crown ran clean", [
  ("MIKAGE_HELMET_ONLY_GEOMETRY_PASS_V0_3_CONTACT_SHEET.png", "HELMET V0.3",
   "helmet-only geometry pass", "FLAG: surface not clean yet", 4.0),
  ("MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4_CONTACT_SHEET.png", "HELMET V0.4",
   "rebuilt from blocking - cleaner base", "no patching on top of bad topology", 4.4),
  ("MIKAGE_HELMET_PROPORTION_REFINE_V0_5_CONTACT_SHEET.png", "HELMET V0.5",
   "proportion refine vs baseline V0.4", "no-slit variants tested - the two slits stay", 4.6),
  ("MIKAGE_HELMET_CONTROLLED_SUBDIV_V0_6_CONTACT_SHEET.png", "HELMET V0.6",
   "controlled subdivision", "FLAG: waviness under a moving light", 4.0),
  ("MIKAGE_HELMET_SURFACE_CONTROL_V0_7_CONTACT_SHEET.png", "HELMET V0.7",
   "surface control + light-rot diagnostic", "bands followed the LIGHT - geometry clean. LOCKED", 4.8),
 ]),
 ("04  ·  THE ONLY LIGHT", "PORCELAIN LOOKDEV", "clay first · then the finish", [
  ("MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_CLAY_VALIDATION.png", "LOOKDEV V0.8 · CLAY",
   "clay validation before any material", "the form must hold with nothing on it", 3.6),
  ("MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_CONTACT_SHEET.png", "LOOKDEV V0.8 · PORCELAIN",
   "porcelain hero lookdev", "FLAG logged: slit hue reads pink - not resolved yet", 4.8),
  ("MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1_CONTACT_SHEET.png", "LOOKDEV V0.8.1 · HUE FIX",
   "slit emission corrected to true violet", "OPERATOR APPROVED - supersedes V0.8 as the reference", 4.8),
 ]),
 ("05  ·  THE BODY", "FROM BLOCK TO CLOAK", "three rounds against the latex read", [
  ("MIKAGE_BODY_FORM_DEBLOCKOUT_V0_9_CONTACT_SHEET.png", "BODY V0.9",
   "torso de-blockout to a tall cloak", "RULING: FORM HOLD - reads latex-shell, folds weak", 4.2),
  ("MIKAGE_BODY_CLOAK_STRUCTURE_V0_10_CONTACT_SHEET.png", "BODY V0.10",
   "four asymmetric primary folds, shoulders dropped", "RULING: body geometry FROZEN at V0.10", 4.2),
  ("MIKAGE_BODY_LOOKDEV_MATTE_V0_11_CONTACT_SHEET.png", "BODY V0.11",
   "material only: matte graphite, heavy fabric", "the latex is gone", 4.0),
 ]),
 ("06  ·  THE ASSEMBLY", "ONE FIGURE", "head · cloak · blade · halo", [
  ("MIKAGE_STANDING_CHARACTER_CANDIDATE_V0_12_CONTACT_SHEET.png", "STANDING CANDIDATE V0.12",
   "first full assembly - standing candidate", "FLAGS: blade detached / body melts / key flat", 4.6),
 ]),
 ("07  ·  THE LOCK", "THE STANDING HERO", "two polish rounds · then the ruling", [
  ("MIKAGE_STANDING_HERO_POLISH_V0_13_CONTACT_SHEET.png", "HERO POLISH V0.13",
   "rim + dramatic key - technical PASS", "REFUSED: slit magenta / blade a panel / cloak flat", 4.6),
  ("MIKAGE_STANDING_HERO_POLISH_V0_14_CONTACT_SHEET.png", "HERO POLISH V0.14 vs V0.13",
   "all three flags cleared - slit back to violet", "pixel-sampled, not eyeballed", 4.6),
  ("MIKAGE_STANDING_HERO_POLISH_V0_14_HERO.png", "OFFICIAL STANDING HERO · V0.14",
   "OPERATOR RULING: ASSET-LOCKED", "the official standing hero", 5.0),
 ]),
]

W,H,FR = 1080,1920,30
VOID=(5,5,8); PORC=(242,238,234); SIL=(150,150,168); VIOLET=(143,0,255)
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
    tf=fit(d,title,CIN7,108,46,6,W-150); trk(d,870,title,tf,PORC,6)
    img=vdiv(img,1010); d=ImageDraw.Draw(img)
    if sub: trk(d,1052,sub,SP(26),SIL,4)
    trk(d,H-130,"PROTOTYPE  //  NOT CANON-LOCKED",SP(22),(150,122,180),3)
    grain(img,7).save(path)

def notes_overlay(path, version, note1, note2):
    """version chip top-left + bottom scrim with the two real per-round note lines."""
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    # version chip (top): dark strip so it reads over bright sheet panels
    vf=fit(d,version,CIN4,40,26,6,W-260)
    vw=sum(d.textlength(c,font=vf) for c in version)+6*(len(version)-1)
    d.rectangle([int(W/2-vw/2)-26,118,int(W/2+vw/2)+26,196],fill=(5,5,8,215))
    d.line([int(W/2-vw/2)-26,196,int(W/2+vw/2)+26,196],fill=(143,0,255,255),width=2)  # violet hairline = signal
    trk(d,132,version,vf,PORC,6)
    # bottom scrim + notes (Space Mono, the actual FLAG/RULING record)
    d.rectangle([0,1560,W,1830],fill=(5,5,8,205))
    f1=fit(d,note1,SP,27,18,3,W-90); trk(d,1606,note1,f1,PORC,3)
    f2=fit(d,note2,SP,27,18,3,W-90); trk(d,1668,note2,f2,(180,150,215),3)
    trk(d,1756,"PROTOTYPE  //  NOT CANON-LOCKED",SP(22),(150,122,180),3)
    img.save(path)

def hero_crop(img):
    """Crop a multi-panel proof sheet down to ONE clean quadrant/panel, skipping that
    sheet's own baked label strip (top margin, and bottom credit footer for wide strips)
    so only our caption carries text."""
    w,h = img.size
    asp = w/h
    cw = int(w*0.34)
    tm = int(h*0.10)  # skip a top label/header strip
    if asp > 1.6:
        bm = int(h*0.06)  # wide strips sometimes carry a bottom credit-footer line
        return img.crop((0, tm, cw, h-bm))
    ch = int(h*0.44)
    y2 = min(h, ch+tm)
    return img.crop((0, tm, cw, y2))

def clip_hold(src, version, note1, note2, secs, w, out):
    """Crop to one clean panel, center it STILL (no pan/sweep) for the whole beat -
    calm, steady, one readable caption at a time."""
    cropped = os.path.join(w, "crop_%s.png" % os.path.basename(out))
    hero_crop(Image.open(src)).save(cropped)
    ov = os.path.join(w, "ov_%s.png" % os.path.basename(out)); notes_overlay(ov, version, note1, note2)
    im = Image.open(cropped); sw, shh = im.size
    th = H; tw = int(sw*th/shh)
    if tw < W: tw = W; th = int(shh*W/sw)
    tw, th = tw//2*2, th//2*2
    sh(["ffmpeg","-y","-v","error","-loop","1","-t",str(secs),"-i",cropped,"-loop","1","-t",str(secs),"-i",ov,
        "-filter_complex",
        "[0:v]scale=%d:%d,pad=%d:%d:(ow-iw)/2:(oh-ih)/2:color=0x050508,crop=%d:%d:(iw-%d)/2:(ih-%d)/2[sheet];"
        "[sheet][1:v]overlay=0:0,format=yuv420p[o]"%(tw,th,max(W,tw),max(H,th),W,H,W,H),
        "-map","[o]","-t",str(secs),"-r",str(FR),"-c:v","libx264","-preset","medium","-crf","19",out])

def clip_motion_ungraded(src, version, note1, note2, loops, w, out):
    ov=os.path.join(w,"ov_mot.png"); notes_overlay(ov,version,note1,note2)
    sh(["ffmpeg","-y","-v","error","-stream_loop",str(loops),"-i",src,"-loop","1","-i",ov,
        "-filter_complex","[0:v][1:v]overlay=0:0:shortest=1,format=yuv420p[o]",
        "-map","[o]","-r",str(FR),"-c:v","libx264","-preset","medium","-crf","19",out])

def still(path, secs, out):
    sh(["ffmpeg","-y","-v","error","-loop","1","-t",str(secs),"-i",path,
        "-vf","scale=1080:1920,format=yuv420p","-r",str(FR),
        "-c:v","libx264","-preset","medium","-crf","19",out])

def main():
    need=[MOT,MUSIC]+[P(f) for _,_,_,items in ARC for f,_,_,_,_ in items]
    missing=[p for p in need if not os.path.exists(p)]
    if missing:
        for p in missing: print("!! MISSING:",p)
        return
    w=tempfile.mkdtemp(); seg=[]; n=[0]
    def title_card(header, title, sub, secs=2.2):
        n[0]+=1; c=os.path.join(w,"c%02d.png"%n[0]); card(c,header,title,sub)
        s=os.path.join(w,"s%02d.mp4"%n[0]); still(c,secs,s); seg.append(s)
    try:
        title_card("BUILD LOG  //  STANDING HERO","IT STANDS","from a block to the official hero — every round on record",2.8)
        for header,title,sub,items in ARC:
            title_card(header,title,sub)
            for f,ver,n1,n2,secs in items:
                n[0]+=1; sc=os.path.join(w,"m%02d.mp4"%n[0])
                clip_hold(P(f),ver,n1,n2,secs,w,sc); seg.append(sc)
        title_card("08  ·  IT WAKES","FIRST CANVAS","V0.1 refused - too soft · V0.2 re-curved · APPROVED")
        sc=os.path.join(w,"m_mot.mp4")
        clip_motion_ungraded(MOT,"CANVAS V0.2 · APPROVED","dormant 2% -> ignition -> dormant","V0.1 REFUSED: contrast too soft -> re-curve",1,w,sc); seg.append(sc)
        title_card("MIKAGE ZENITH","IT STANDS","Listen now  —  PORCELAIN ASCENSION",3.0)
        cl=os.path.join(w,"cl.txt"); open(cl,"w").write("".join("file '%s'\n"%x for x in seg))
        vid=os.path.join(w,"vid.mp4")
        try: sh(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",cl,"-c","copy",vid])
        except subprocess.CalledProcessError:
            sh(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",cl,"-c:v","libx264","-preset","medium","-crf","19","-pix_fmt","yuv420p","-r",str(FR),vid])
        dur=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",vid]).decode().strip())
        au=os.path.join(w,"au.m4a"); fade=dur-2.0
        sh(["ffmpeg","-y","-v","error","-ss","0","-t","%.2f"%dur,"-i",MUSIC,"-af","afade=t=in:st=0:d=0.6,afade=t=out:st=%.2f:d=2.0"%fade,"-ar","48000","-ac","2","-c:a","aac","-b:a","320k",au])
        tmp=OUT+".tmp.mp4"; sh(["ffmpeg","-y","-v","error","-i",vid,"-i",au,"-map","0:v:0","-map","1:a:0","-c:v","copy","-c:a","copy","-shortest",tmp]); os.replace(tmp,OUT)
        print("BUILD LOG saved:",OUT,"dur=%.1fs"%dur)
        start=max(0,dur-18); th=OUT_HOOK+".tmp.mp4"
        sh(["ffmpeg","-y","-v","error","-ss","%.2f"%start,"-i",OUT,"-t","18","-c","copy",th]); os.replace(th,OUT_HOOK)
        print("HOOK saved:",OUT_HOOK)
    finally:
        shutil.rmtree(w, ignore_errors=True)

if __name__=="__main__":
    main()
