# -*- coding: utf-8 -*-
r"""
MIKAGE BUILD LOG — build FILM_FULL_V0_4 (append "IT LEARNS TO WALK" gait chapter).

Run on the operator's machine:   python build_film_v04.py
Requires: Python 3 + pillow + numpy, and ffmpeg/ffprobe on PATH.

What it does (per 00_BUILD_LOG_STANDARD.md):
  base film V0_3  +  new closing chapter (V1.4 gait, graded)  ->  FILM_FULL_V0_4.mp4
  music = PORCELAIN ASCENSION from 0:00 (LIVE) re-laid over the full length, faded.
  also writes a ~29s hook cut for Shorts/TikTok.
Output stays PROTOTYPE / NOT CANON-LOCKED. Local only. No push.
"""
import os, subprocess, tempfile, shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

# ---- absolute paths (operator machine) ----
REPO   = r"D:\KAGAMI-MZ_SYNC_PUSH_V2"
AUDIO  = r"D:\MIKAGE ZENITH AUDIO"
GREEL  = os.path.join(REPO, r"production\character\build_log\GATHER_REEL_V0_1")
BASE   = os.path.join(GREEL, "MIKAGE_BUILDLOG_FILM_FULL_V0_3.mp4")
GAIT   = os.path.join(REPO, r"production\character\reviews\MIKAGE_HERO_MOUNT_V1_4_GAIT_PROOF.mp4")
MUSIC  = os.path.join(AUDIO, r"LIVE\06. PORCELAIN ASCENSION\1_MASTER\PORCELAIN ASCENSION.wav")
FONTS  = os.path.join(AUDIO, r"tools\mikage_short_toolkit")
OUT    = os.path.join(GREEL, "MIKAGE_BUILDLOG_FILM_FULL_V0_4.mp4")
OUT_HOOK = os.path.join(GREEL, "MIKAGE_BUILDLOG_GATHER_PORCELAIN_V0_2_HOOK.mp4")

W, H = 1080, 1920
CIN7 = lambda s: ImageFont.truetype(os.path.join(FONTS, "cinzel700.ttf"), s)
CIN4 = lambda s: ImageFont.truetype(os.path.join(FONTS, "cinzel400.ttf"), s)
SP   = lambda s: ImageFont.truetype(os.path.join(FONTS, "spacemono400.ttf"), s)
VOID=(5,5,8); PORC=(242,238,234); SIL=(150,150,168); VIOLET=(143,0,255)

def sh(a): subprocess.run(a, check=True)
def probe(path, sel, ent):
    return subprocess.check_output(["ffprobe","-v","error","-select_streams",sel,
        "-show_entries",ent,"-of","csv=p=0",path]).decode().strip()

def title_card(path):
    img = Image.new("RGB",(W,H),VOID)
    halo=Image.new("RGB",(W,H),VOID); ImageDraw.Draw(halo).ellipse([W//2-340,760,W//2+340,1240],fill=(20,5,32))
    img=Image.blend(img,halo.filter(ImageFilter.GaussianBlur(200)),0.7); d=ImageDraw.Draw(img)
    def trk(y,t,f,fill,tr):
        x=W/2-(sum(d.textlength(c,font=f) for c in t)+tr*(len(t)-1))/2
        for c in t: d.text((x,y),c,font=f,fill=fill); x+=d.textlength(c,font=f)+tr
    trk(150,"MIKAGE ZENITH",CIN4(38),SIL,13)
    trk(214,"BUILD LOG  //  07",SP(24),(110,106,118),8)
    # auto-fit title
    s=110; tt="IT LEARNS TO WALK"
    while s>50:
        f=CIN7(s)
        if sum(d.textlength(c,font=f) for c in tt)+6*(len(tt)-1) <= W-150: break
        s-=2
    trk(880,tt,CIN7(s),PORC,6)
    g=Image.new("RGB",(W,H),(0,0,0)); ImageDraw.Draw(g).line([(W//2-70,1010),(W//2+70,1010)],fill=VIOLET,width=3)
    img=Image.composite(Image.new("RGB",(W,H),VIOLET),img,g.filter(ImageFilter.GaussianBlur(4)).convert("L").point(lambda v:min(255,v*2)))
    d=ImageDraw.Draw(img); trk(1052,"PROTOTYPE  //  NOT CANON-LOCKED",SP(24),(150,122,180),3)
    rng=np.random.default_rng(7); n=rng.normal(0,4,(H,W,1)).repeat(3,2)
    Image.fromarray(np.clip(np.asarray(img).astype(np.int16)+n.astype(np.int16),0,255).astype(np.uint8)).save(path)

def frame_overlay(path):
    """static branded overlay for the gait footage chapter (labels top/bottom, footage full-width center)."""
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    def trk(y,t,f,fill,tr):
        x=W/2-(sum(d.textlength(c,font=f) for c in t)+tr*(len(t)-1))/2
        for c in t: d.text((x,y),c,font=f,fill=fill); x+=d.textlength(c,font=f)+tr
    trk(150,"IT LEARNS TO WALK",CIN4(40),PORC,8)
    trk(1740,"PROTOTYPE  //  NOT CANON-LOCKED",SP(22),(150,122,180),3)
    img.save(path)

def main():
    for p in (BASE,GAIT,MUSIC):
        if not os.path.exists(p): print("!! MISSING:",p); return
    w=tempfile.mkdtemp()
    try:
        fps = probe(BASE,"v:0","stream=r_frame_rate") or "30/1"
        fr = 30
        # 1) title card clip (2.6s)
        tc=os.path.join(w,"title.png"); title_card(tc)
        title_mp4=os.path.join(w,"title.mp4")
        sh(["ffmpeg","-y","-v","error","-loop","1","-t","2.6","-i",tc,"-vf","scale=1080:1920,format=yuv420p",
            "-r",str(fr),"-c:v","libx264","-preset","medium","-crf","19",title_mp4])
        # 2) gait chapter: graded + slowed + framed full-width on void
        ov=os.path.join(w,"ov.png"); frame_overlay(ov)
        gait_mp4=os.path.join(w,"gait.mp4")
        # grade dark, scale to width 1080 (=>1080x607), slow 3x, center on void canvas, overlay labels
        sh(["ffmpeg","-y","-v","error","-i",GAIT,"-loop","1","-i",ov,
            "-filter_complex",
            "[0:v]eq=brightness=-0.14:contrast=1.28:gamma=0.88,colorbalance=bs=0.06:bm=0.03,"
            "scale=1080:-2,setpts=3.0*PTS,format=yuv420p,pad=1080:1920:0:(1920-ih)/2:color=0x050508[v];"
            "[v][1:v]overlay=0:0:shortest=1,format=yuv420p[o]",
            "-map","[o]","-r",str(fr),"-c:v","libx264","-preset","medium","-crf","19",gait_mp4])
        # 3) base film video only (drop its audio)
        base_v=os.path.join(w,"base_v.mp4")
        sh(["ffmpeg","-y","-v","error","-i",BASE,"-an","-c:v","copy",base_v])
        # 4) concat base + title + gait  (try copy, fallback re-encode)
        cl=os.path.join(w,"cl.txt")
        open(cl,"w").write("file '%s'\nfile '%s'\nfile '%s'\n"%(base_v,title_mp4,gait_mp4))
        vid=os.path.join(w,"vid.mp4")
        try:
            sh(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",cl,"-c","copy",vid])
        except subprocess.CalledProcessError:
            sh(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",cl,
                "-c:v","libx264","-preset","medium","-crf","19","-pix_fmt","yuv420p","-r",str(fr),vid])
        dur=float(probe(vid,"v:0","format=duration") or subprocess.check_output(
            ["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",vid]).decode().strip())
        # 5) music PORCELAIN ASCENSION from 0:00, full length, fade out
        au=os.path.join(w,"au.m4a"); fade=dur-2.0
        sh(["ffmpeg","-y","-v","error","-ss","0","-t","%.2f"%dur,"-i",MUSIC,
            "-af","afade=t=in:st=0:d=0.5,afade=t=out:st=%.2f:d=2.0"%fade,
            "-ar","48000","-ac","2","-c:a","aac","-b:a","320k",au])
        # 6) mux -> FILM_FULL_V0_4
        tmp_out=OUT+".tmp.mp4"
        sh(["ffmpeg","-y","-v","error","-i",vid,"-i",au,"-map","0:v:0","-map","1:a:0","-c:v","copy","-c:a","copy","-shortest",tmp_out])
        os.replace(tmp_out,OUT)
        print("FILM saved:",OUT,"dur=%.1fs"%dur)
        # 7) hook cut: last ~29s (the gait reveal) for Shorts/TikTok
        start=max(0,dur-29)
        tmp_hook=OUT_HOOK+".tmp.mp4"
        sh(["ffmpeg","-y","-v","error","-ss","%.2f"%start,"-i",OUT,"-t","29","-c","copy",tmp_hook])
        os.replace(tmp_hook,OUT_HOOK)
        print("HOOK saved:",OUT_HOOK)
    finally:
        shutil.rmtree(w, ignore_errors=True)

if __name__ == "__main__":
    main()
