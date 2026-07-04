# -*- coding: utf-8 -*-
r"""
MIKAGE BUILD LOG - build TODAY's cine-threshold entry (NEW milestones only, 2026-07-04).
Covers: exception #46 (robe locomotion cleanup) -> #47 (3-state S0/S1/S2 ignition lighting,
PASS, independently verified) -> #48 (staged environment + moving hero camera, PASS,
independently verified). Ends on a "what's next" card for the queued AI-enhance dial-in
(exception #49) - explicitly marked NOT YET DONE, no fabricated footage. Does NOT re-bundle
the published 2D->form film, the locomotion entry, or the standing-hero entry.

Editorial format matches the standing-hero / locomotion entries exactly: void/porcelain/violet,
Cinzel titles, Space Mono captions, PORCELAIN ASCENSION from 0:00, PROTOTYPE / NOT CANON-LOCKED.
All footage here is the actual governed reviews/ deliverables (PASS + independently verified by
Cowork) - no re-render, no new claims of PASS/canon-lock/final.

Run on the operator's machine:  python build_buildlog_cine_threshold.py
Needs: Python 3 + pillow + numpy, ffmpeg/ffprobe on PATH. Output = PROTOTYPE / NOT CANON-LOCKED, local only.
Paths are computed relative to this file (no machine-specific absolute paths), except AUDIO which
can be overridden with the MIKAGE_AUDIO_ROOT env var (defaults to the sibling audio root, matching
every other build-log script in this folder).
"""
import os, subprocess, tempfile, shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

HERE  = os.path.dirname(os.path.abspath(__file__))
REPO  = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
AUDIO = os.environ.get("MIKAGE_AUDIO_ROOT") or os.path.join(os.path.dirname(REPO), "MIKAGE ZENITH AUDIO")
FONTS = os.path.join(AUDIO, "tools", "mikage_short_toolkit")
REV   = os.path.join(REPO, "production", "character", "reviews")

L47_S0 = os.path.join(REV, "MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1_S0_DORMANT.mp4")
L47_S1 = os.path.join(REV, "MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1_S1_AWARE.mp4")
L47_S2 = os.path.join(REV, "MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1_S2_COMBAT.mp4")
L48_S0 = os.path.join(REV, "MIKAGE_ROBE_HERO_CINE_STAGING_V0_1_S0_DORMANT.mp4")
L48_S1 = os.path.join(REV, "MIKAGE_ROBE_HERO_CINE_STAGING_V0_1_S1_AWARE.mp4")
L48_S2 = os.path.join(REV, "MIKAGE_ROBE_HERO_CINE_STAGING_V0_1_S2_COMBAT.mp4")
L48_HERO = os.path.join(REV, "MIKAGE_ROBE_HERO_CINE_STAGING_V0_1_HERO_CLIP.mp4")
L48_STILL = os.path.join(REV, "MIKAGE_ROBE_HERO_CINE_STAGING_V0_1_S2_STILL.png")
MUSIC = os.path.join(AUDIO, "LIVE", "06. PORCELAIN ASCENSION", "1_MASTER", "PORCELAIN ASCENSION.wav")
OUT   = os.path.join(HERE, "MIKAGE_BUILDLOG_CINE_THRESHOLD_V0_1.mp4")
OUT_HOOK = os.path.join(HERE, "MIKAGE_BUILDLOG_CINE_THRESHOLD_V0_1_HOOK.mp4")

W,H,FR = 1080,1920,24
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
    tf=fit(d,title,CIN7,100,42,6,W-150); trk(d,870,title,tf,PORC,6)
    img=vdiv(img,1010); d=ImageDraw.Draw(img)
    if sub: trk(d,1052,sub,SP(24),SIL,3)
    trk(d,H-130,"PROTOTYPE  //  NOT CANON-LOCKED",SP(22),(150,122,180),3)
    grain(img,7).save(path)

def label_overlay(path, label):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    trk(d,150,label,CIN4(36),PORC,7)
    trk(d,1740,"PROTOTYPE  //  NOT CANON-LOCKED",SP(22),(150,122,180),3)
    img.save(path)

def still(path, secs, out):
    sh(["ffmpeg","-y","-v","error","-loop","1","-t",str(secs),"-i",path,
        "-vf","scale=1080:1920,format=yuv420p","-r",str(FR),
        "-c:v","libx264","-preset","veryfast","-crf","19",out])

def clip_image(src, label, secs, w, out):
    ov=os.path.join(w,"ov_%s.png"%os.path.basename(out)); label_overlay(ov,label)
    im=Image.open(src).convert("RGB")
    r=min(980/im.width, 1500/im.height); im=im.resize((int(im.width*r),int(im.height*r)),Image.LANCZOS)
    cv=base(); px,py=(W-im.width)//2,(H-im.height)//2; cv.paste(im,(px,py))
    d=ImageDraw.Draw(cv); x0,y0=px-6,py-6; x1,y1=px+im.width+6,py+im.height+6
    for cx,cy in [(x0,y0),(x1,y0),(x0,y1),(x1,y1)]:
        d.line([cx-18,cy,cx+18,cy],fill=(130,126,140),width=1); d.line([cx,cy-18,cx,cy+18],fill=(130,126,140),width=1)
    base_png=os.path.join(w,"img_%s.png"%os.path.basename(out)); grain(cv,3).save(base_png)
    sh(["ffmpeg","-y","-v","error","-loop","1","-t",str(secs),"-i",base_png,"-loop","1","-i",ov,
        "-filter_complex","[0:v][1:v]overlay=0:0:shortest=1,format=yuv420p","-t",str(secs),"-r",str(FR),
        "-c:v","libx264","-preset","veryfast","-crf","19",out])

def clip_video_framed(src, label, w, out, secs=None):
    ov=os.path.join(w,"ov_%s.png"%os.path.basename(out)); label_overlay(ov,label)
    bg=os.path.join(w,"bg_%s.png"%os.path.basename(out))
    r=min(900/720, 1460/1280); fw,fh=int(720*r),int(1280*r)
    cv=base(); px,py=(W-fw)//2,(H-fh)//2
    d=ImageDraw.Draw(cv); x0,y0=px-6,py-6; x1,y1=px+fw+6,py+fh+6
    for cx,cy in [(x0,y0),(x1,y0),(x0,y1),(x1,y1)]:
        d.line([cx-18,cy,cx+18,cy],fill=(130,126,140),width=1); d.line([cx,cy-18,cx,cy+18],fill=(130,126,140),width=1)
    grain(cv,5).save(bg)
    dur_args = ["-t", str(secs)] if secs else []
    sh(["ffmpeg","-y","-v","error","-loop","1","-i",bg,"-i",src,"-loop","1","-i",ov,
        "-filter_complex","[1:v]scale=%d:%d[fg];[0:v][fg]overlay=%d:%d:shortest=1[bg1];[bg1][2:v]overlay=0:0:shortest=1,format=yuv420p"%(fw,fh,px,py),
        *dur_args,"-r",str(FR),"-c:v","libx264","-preset","veryfast","-crf","19",out])

WORK = os.environ.get("MIKAGE_CT_WORK") or os.path.join(tempfile.gettempdir(), "mikage_ct_work")
MANIFEST = os.path.join(WORK, "manifest.txt")

def _append_manifest(path):
    with open(MANIFEST, "a") as f: f.write(path + "\n")

def title_card(name, header, title, sub, secs=2.4):
    c=os.path.join(WORK,name+".png"); card(c,header,title,sub)
    s=os.path.join(WORK,"s_"+name+".mp4"); still(c,secs,s); _append_manifest(s)

def stage_setup():
    os.makedirs(WORK, exist_ok=True)
    open(MANIFEST,"w").close()
    for p in (L47_S0,L47_S1,L47_S2,L48_S0,L48_S1,L48_S2,L48_HERO,L48_STILL,MUSIC):
        if not os.path.exists(p): print("!! MISSING:",p); raise SystemExit(1)
    print("setup ok, WORK=",WORK)

def stage_open_ch1():
    title_card("c0","BUILD LOG  //  CINEMATIC THRESHOLD","IT ENTERS THE FRAME","STAGING - IGNITION - CAMERA -- 2026-07-04",2.8)
    title_card("t1","01  ·  THE LIGHT","THREE STATES OF WAKING","dormant - aware - combat -- one light rig")
    for src,lab in [(L47_S0,"S0 DORMANT"),(L47_S1,"S1 AWARE"),(L47_S2,"S2 COMBAT")]:
        sc=os.path.join(WORK,"sc1_%s.mp4"%lab.replace(" ","_")); clip_video_framed(src,lab,WORK,sc); _append_manifest(sc)
    print("ch1 done")

def stage_ch2():
    title_card("t2","02  ·  THE STAGE","A ROOM APPEARS","reflective floor - monoliths - Z-Blue depth - haze")
    for src,lab in [(L48_S0,"S0 RESTAGED"),(L48_S1,"S1 RESTAGED"),(L48_S2,"S2 RESTAGED")]:
        sc=os.path.join(WORK,"sc2_%s.mp4"%lab.replace(" ","_")); clip_video_framed(src,lab,WORK,sc); _append_manifest(sc)
    print("ch2 done")

def stage_ch3_ch4_end():
    title_card("t3","03  ·  THE APPROACH","IGNITION","push-in / crane -- closest frame = combat")
    sc=os.path.join(WORK,"sc3.mp4"); clip_video_framed(L48_HERO,"HERO CLIP CAMERA MOVE",WORK,sc); _append_manifest(sc)
    title_card("t4","04  ·  WHAT'S NEXT","BEFORE THE SKIN","AI-enhance dial-in queued -- not yet run",3.0)
    sc=os.path.join(WORK,"sc4.mp4"); clip_image(L48_STILL,"S2 STILL AI-ENHANCE BASE QUEUED",3.5,WORK,sc); _append_manifest(sc)
    title_card("e","MIKAGE ZENITH","IT ENTERS THE FRAME","Listen now  --  PORCELAIN ASCENSION",3.0)
    print("ch3/ch4/end done")

def stage_finalize():
    seg=[l.strip() for l in open(MANIFEST) if l.strip()]
    cl=os.path.join(WORK,"cl.txt"); open(cl,"w").write("".join("file '%s'\n"%x for x in seg))
    vid=os.path.join(WORK,"vid.mp4")
    try: sh(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",cl,"-c","copy",vid])
    except subprocess.CalledProcessError:
        sh(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",cl,"-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p","-r",str(FR),vid])
    dur=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",vid]).decode().strip())
    au=os.path.join(WORK,"au.m4a"); fade=dur-2.0
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
    stage_setup(); stage_open_ch1(); stage_ch2(); stage_ch3_ch4_end(); stage_finalize(); stage_cleanup()

STAGES = {
    "setup": stage_setup, "ch1": stage_open_ch1, "ch2": stage_ch2,
    "ch34": stage_ch3_ch4_end, "final": stage_finalize, "cleanup": stage_cleanup, "all": main,
}

if __name__=="__main__":
    import sys
    stage = sys.argv[1] if len(sys.argv) > 1 else "all"
    STAGES[stage]()
