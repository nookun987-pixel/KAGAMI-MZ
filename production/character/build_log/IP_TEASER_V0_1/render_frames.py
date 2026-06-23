#!/usr/bin/env python3
import os, math, time, numpy as np
from PIL import Image, ImageDraw, ImageFont
START=time.time(); BUDGET=37
W,H=1080,1920; FPS=30; DUR=float(os.environ.get("DUR","6.0")); N=int(FPS*DUR)
VOID=(5,5,8); PORC=(242,238,234); SILVER=(170,170,186)
FD="/sessions/nifty-elegant-sagan/mnt/outputs/ep02/fonts"
HERO="/sessions/nifty-elegant-sagan/mnt/KAGAMI-MZ_SYNC_PUSH_V2/production/character/keyart_candidates/MIKAGE_SOLO_VIOLET_V0_4.png"
TF="/tmp/tf"; os.makedirs(TF,exist_ok=True)
def serif(s): return ImageFont.truetype(os.path.join(FD,"cinzel700.ttf"),s)
def mono(s):  return ImageFont.truetype(os.path.join(FD,"spacemono400.ttf"),s)
def sm(a,b,t):
    a*=DUR; b*=DUR
    if t<=a: return 0.0
    if t>=b: return 1.0
    x=(t-a)/(b-a); return x*x*(3-2*x)
src=Image.open(HERO).convert("RGB"); sc=max(W/src.width,H/src.height)
cov=src.resize((int(src.width*sc)+1,int(src.height*sc)+1),Image.LANCZOS)
cx=(cov.width-W)//2; cy=(cov.height-H)//2; HERO_COVER=cov.crop((cx,cy,cx+W,cy+H))
SLIT=(int(W*0.50),int(H*0.30)); ZSTEPS=20; ZCACHE=[]
for k in range(ZSTEPS):
    zf=1.0+0.045*(k/(ZSTEPS-1)); zw,zh=int(W*zf),int(H*zf)
    hz=HERO_COVER.resize((zw,zh),Image.LANCZOS); ox=(zw-W)//2; oy=(zh-H)//2
    ZCACHE.append(np.asarray(hz.crop((ox,oy,ox+W,oy+H)),np.float32))
yy,xx=np.mgrid[0:H,0:W]
rad=np.sqrt(((xx-W*0.5)/(W*0.7))**2+((yy-H*0.42)/(H*0.5))**2)
BG=np.clip(np.array(VOID,np.float32)+np.clip(1-rad,0,1)[...,None]*np.array([10,8,16],np.float32),0,255)
KS=np.exp(-(((xx-SLIT[0])**2+(yy-SLIT[1])**2)/(130*130))).astype(np.float32)[...,None]
KI=np.exp(-(((xx-SLIT[0])**2+(yy-SLIT[1])**2)/(320*320))).astype(np.float32)[...,None]
VIO=np.array([130,30,180],np.float32); VIO2=np.array([60,12,120],np.float32)
GR=[np.random.normal(0,5.0,(H,W,1)).astype(np.float32) for _ in range(16)]
SCRIM=(np.clip((yy-H*0.66)/(H*0.34),0,1).astype(np.float32)[...,None])*0.78
WMF=serif(64); TGF=mono(22)
def tracked(d,cxp,y,text,font,fill,tr):
    tot=sum((font.getbbox(c)[2]-font.getbbox(c)[0])+tr for c in text)-tr; x=cxp-tot/2
    for c in text:
        d.text((x,y),c,font=font,fill=fill); x+=(font.getbbox(c)[2]-font.getbbox(c)[0])+tr
done=0
for i in range(N):
    p=os.path.join(TF,f"f{i:04d}.jpg")
    if os.path.exists(p): continue
    if time.time()-START>BUDGET: break
    t=i/FPS; fr=BG.copy()
    ig=sm(0.04,0.30,t); pulse=0.5+0.5*math.cos(t*2*math.pi/2.2)
    fr=fr+KI*VIO2*(0.55*ig)
    fade=sm(0.17,0.50,t)
    if fade>0:
        k=int(round(sm(0.17,1.0,t)*(ZSTEPS-1))); fr=fr*(1-fade)+ZCACHE[k]*fade
    sp=sm(0.35,0.60,t); fr=fr+KS*VIO*((0.16+0.12*pulse)*sp+0.10*ig)
    fr=np.clip(fr+GR[i%16],0,255)
    sstr=sm(0.52,0.74,t)
    if sstr>0: fr=fr*(1-SCRIM*sstr)
    img=Image.fromarray(fr.astype(np.uint8),"RGB"); d=ImageDraw.Draw(img)
    wm=sm(0.55,0.78,t)
    if wm>0: tracked(d,W//2,int(H*0.79),"MIKAGE ZENITH",WMF,tuple(int(c*wm) for c in PORC),8)
    tg=sm(0.72,0.92,t)
    if tg>0: tracked(d,W//2,int(H*0.79)+96,"FROM THE VOID, IT LEARNED A SHAPE",TGF,tuple(int(c*tg) for c in SILVER),5)
    img.save(p,quality=96)
    done+=1
have=len([f for f in os.listdir(TF) if f.endswith('.jpg')])
print(f"RENDERED_THIS_RUN={done} HAVE={have}/{N}",flush=True)
