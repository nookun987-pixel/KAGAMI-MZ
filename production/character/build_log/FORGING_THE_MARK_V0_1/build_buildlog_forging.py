# -*- coding: utf-8 -*-
r"""MIKAGE BUILD LOG - FORGING THE MARK. Engine = build_buildlog_locomotion.py.
Music = THE LANDAUER PARADOX from 1:27. Self-contained in ./src. PROTOTYPE / NOT CANON-LOCKED."""
import os, subprocess, tempfile, shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

HERE  = os.path.dirname(os.path.abspath(__file__))
REPO  = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
AUDIO = os.path.join(os.path.dirname(REPO), "MIKAGE ZENITH AUDIO")
FONTS = os.path.join(AUDIO, "tools", "mikage_short_toolkit")
SRC   = os.path.join(HERE, "src")
MARK  = os.path.join(SRC, "01_mark.png")
FORM  = os.path.join(SRC, "02_form.png")
WAKE  = os.path.join(SRC, "awaken.mp4")
MUSIC = os.path.join(SRC, "track.wav")
MUSIC_START = 87
ITER = [
    (os.path.join(SRC,"iter","i1_blockout.png"),    "ITER 01  -  BLOCKOUT"),
    (os.path.join(SRC,"iter","i2_wedge.png"),       "ITER 02  -  WEDGE"),
    (os.path.join(SRC,"iter","i3_reshape.png"),     "ITER 03  -  RESHAPE"),
    (os.path.join(SRC,"iter","i4_relight.png"),     "ITER 04  -  RELIGHT"),
    (os.path.join(SRC,"iter","i5_reshape_awk.png"), "ITER 05  -  SLIT TEST"),
    (os.path.join(SRC,"iter","i6_relight_awk.png"), "ITER 06  -  AWAKENED"),
]
OUT   = os.path.join(HERE, "MIKAGE_BUILDLOG_FORGING_THE_MARK_LANDAUER.mp4")
OUT_HOOK = os.path.join(HERE, "MIKAGE_BUILDLOG_FORGING_HOOK.mp4")

W,H,FR = 1080,1920,30
VOID=(5,5,8); PORC=(242,238,234); SIL=(150,150,168); VIOLET=(143,0,255)
CIN7=lambda s:ImageFont.truetype(os.path.join(FONTS,"cinzel700.ttf"),s)
CIN4=lambda s:ImageFont.truetype(os.path.join(FONTS,"cinzel400.ttf"),s)
SP  =lambda s:ImageFont.truetype(os.path.join(FONTS,"spacemono400.ttf"),s)
PRESET="veryfast"

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
def label_overlay(path, label):
    img=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    trk(d,150,label,CIN4(40),PORC,8)
    trk(d,1740,"PROTOTYPE  //  NOT CANON-LOCKED",SP(22),(150,122,180),3)
    img.save(path)
def title_clip(w,name,header,title,sub,secs,seg):
    c=os.path.join(w,name+".png"); card(c,header,title,sub); s=os.path.join(w,name+".mp4")
    sh(["ffmpeg","-y","-v","error","-loop","1","-t",str(secs),"-i",c,"-vf","scale=1080:1920,format=yuv420p","-r",str(FR),"-c:v","libx264","-preset",PRESET,"-crf","19",s]); seg.append(s)
def clip_image(src, label, secs, w, seg):
    ov=os.path.join(w,"ov_"+label[:4]+".png"); label_overlay(ov,label)
    im=Image.open(src).convert("RGB"); r=980/im.width; im=im.resize((980,int(im.height*r)),Image.LANCZOS)
    cv=base(); cv.paste(im,((W-980)//2,(H-im.height)//2))
    d=ImageDraw.Draw(cv); x0,y0=(W-980)//2-6,(H-im.height)//2-6; x1,y1=x0+992,y0+im.height+12
    for cx,cy in [(x0,y0),(x1,y0),(x0,y1),(x1,y1)]:
        d.line([cx-18,cy,cx+18,cy],fill=(130,126,140),width=1); d.line([cx,cy-18,cx,cy+18],fill=(130,126,140),width=1)
    bp=os.path.join(w,"i_"+label[:4]+".png"); grain(cv,3).save(bp); out=os.path.join(w,"sc_"+label[:4]+".mp4")
    sh(["ffmpeg","-y","-v","error","-loop","1","-t",str(secs),"-i",bp,"-loop","1","-i",ov,"-filter_complex","[0:v][1:v]overlay=0:0:shortest=1,format=yuv420p","-t",str(secs),"-r",str(FR),"-c:v","libx264","-preset",PRESET,"-crf","19",out]); seg.append(out)
def clip_montage(items, secs, w, seg):
    for i,(src,lab) in enumerate(items):
        ov=os.path.join(w,"ovm%d.png"%i); im0=Image.new("RGBA",(W,H),(0,0,0,0)); dd=ImageDraw.Draw(im0)
        trk(dd,150,lab,CIN4(34),PORC,6); trk(dd,1740,"RAW 3D  //  WORK IN PROGRESS",SP(22),(150,122,180),3); im0.save(ov)
        im=Image.open(src).convert("RGB"); r=820/im.width; im=im.resize((820,int(im.height*r)),Image.LANCZOS)
        cv=base(); cv.paste(im,((W-820)//2,(H-im.height)//2))
        d=ImageDraw.Draw(cv); x0,y0=(W-820)//2-6,(H-im.height)//2-6; x1,y1=x0+832,y0+im.height+12
        for cx,cy in [(x0,y0),(x1,y0),(x0,y1),(x1,y1)]:
            d.line([cx-16,cy,cx+16,cy],fill=(120,116,130),width=1); d.line([cx,cy-16,cx,cy+16],fill=(120,116,130),width=1)
        bp=os.path.join(w,"m%d.png"%i); grain(cv,3+i).save(bp); out=os.path.join(w,"mclip%d.mp4"%i)
        sh(["ffmpeg","-y","-v","error","-loop","1","-t",str(secs),"-i",bp,"-loop","1","-i",ov,"-filter_complex","[0:v][1:v]overlay=0:0:shortest=1,format=yuv420p","-t",str(secs),"-r",str(FR),"-c:v","libx264","-preset",PRESET,"-crf","19",out]); seg.append(out)
def clip_vid(src, label, w, seg):
    ov=os.path.join(w,"ovv.png"); label_overlay(ov,label); out=os.path.join(w,"scwake.mp4")
    sh(["ffmpeg","-y","-v","error","-i",src,"-loop","1","-i",ov,"-filter_complex","[0:v]scale=1080:1920,format=yuv420p[v];[v][1:v]overlay=0:0:shortest=1,format=yuv420p[o]","-map","[o]","-r",str(FR),"-c:v","libx264","-preset",PRESET,"-crf","19",out]); seg.append(out)

def main():
    for p in (MARK,FORM,WAKE,MUSIC):
        if not os.path.exists(p): print("!! MISSING:",p); return
    w=tempfile.mkdtemp(); seg=[]
    try:
        title_clip(w,"open","BUILD LOG  //  THE MARK","FORGING THE MARK","2D MARK . 3D ROUNDS . RELIGHT . IT WAKES",2.8,seg)
        title_clip(w,"t1","01  -  THE MARK","WHERE IT BEGINS","a porcelain helmet . two thin slits . faceless",2.4,seg)
        clip_image(MARK,"THE MARK - 2D",4.0,w,seg)
        title_clip(w,"t2","02  -  THE FORGING","ROUND AFTER ROUND","blockout . wedge . reshape . relight",2.4,seg)
        clip_montage(ITER,0.5,w,seg)
        title_clip(w,"t3","03  -  THE FORM","FORGED IN LIGHT","tall wedge . void black . a single key",2.4,seg)
        clip_image(FORM,"FINAL RELIGHT",3.6,w,seg)
        title_clip(w,"t4","04  -  THE SIGNAL","IT WAKES","black until it wakes . then violet",2.4,seg)
        clip_vid(WAKE,"AWAKENING",w,seg)
        title_clip(w,"end","MIKAGE ZENITH","THE MARK IS THE SILENCE","Listen now  -  THE LANDAUER PARADOX",3.2,seg)
        cl=os.path.join(w,"cl.txt"); open(cl,"w").write("".join("file '%s'\n"%x for x in seg)); vid=os.path.join(w,"vid.mp4")
        try: sh(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",cl,"-c","copy",vid])
        except subprocess.CalledProcessError:
            sh(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",cl,"-c:v","libx264","-preset",PRESET,"-crf","19","-pix_fmt","yuv420p","-r",str(FR),vid])
        dur=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",vid]).decode().strip())
        au=os.path.join(w,"au.m4a"); fade=max(0.1,dur-2.0)
        sh(["ffmpeg","-y","-v","error","-ss",str(MUSIC_START),"-t","%.2f"%dur,"-i",MUSIC,"-af","afade=t=in:st=0:d=0.6,afade=t=out:st=%.2f:d=2.0"%fade,"-ar","48000","-ac","2","-c:a","aac","-b:a","320k",au])
        tmp=OUT+".tmp.mp4"; sh(["ffmpeg","-y","-v","error","-i",vid,"-i",au,"-map","0:v:0","-map","1:a:0","-c:v","copy","-c:a","copy","-shortest",tmp]); os.replace(tmp,OUT)
        print("BUILD LOG saved:",OUT,"dur=%.1fs"%dur)
        start=max(0,dur-16); th=OUT_HOOK+".tmp.mp4"
        sh(["ffmpeg","-y","-v","error","-ss","%.2f"%start,"-i",OUT,"-t","16","-c","copy",th]); os.replace(th,OUT_HOOK)
        print("HOOK saved:",OUT_HOOK)
    finally:
        shutil.rmtree(w, ignore_errors=True)

if __name__=="__main__":
    main()
