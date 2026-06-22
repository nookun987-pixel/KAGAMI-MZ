import math, numpy as np, sys
from PIL import Image, ImageDraw, ImageFilter
W,H=1600,2400
VOID=(5,5,8); POR=(242,238,234); POR_D=(150,146,150); VIOLET=(143,0,255)
rng=np.random.default_rng(606)
def render(mode):
    # base vertical gradient (fog lift near ground)
    grad=np.zeros((H,W,3),np.uint8)
    for y in range(H):
        t=(y/H); v=int(6+18*t)
        grad[y,:]=(5+int(v*0.5),5+int(v*0.5),9+int(v))
    img=Image.fromarray(grad); d=ImageDraw.Draw(img,"RGBA")
    gy=int(H*0.86); cx=W*0.52
    # ---- FAR band: distant monoliths in fog (low contrast, pale) ----
    for (x,w,h,tone) in [(180,90,900,30),(330,60,1150,26),(1180,120,1000,32),(1360,70,1250,24),(1460,50,820,22)]:
        d.rectangle([x,gy-h,x+w,gy],fill=(tone,tone,tone+4,255))
    # fog veil over far band
    fog=Image.new("L",(W,H),0); ImageDraw.Draw(fog).rectangle([0,int(gy-700),W,gy],fill=120)
    fog=fog.filter(ImageFilter.GaussianBlur(120))
    img=Image.composite(Image.new("RGB",(W,H),(16,16,22)),img,fog); d=ImageDraw.Draw(img,"RGBA")
    # ranks of receding small blocks (repetition -> sublime)
    for i in range(7):
        bx=200+i*180; bh=120+ (i%3)*40; bt=44-i*3
        d.rectangle([bx,gy-bh,bx+70,gy],fill=(bt,bt,bt+3,200))
    # ---- MID band: WHITE MONOLITH (huge smooth slab, vertical light-shaft) ----
    mw=int(W*0.30); mx0=int(cx-mw/2); mx1=int(cx+mw/2); mtop=int(H*0.10)
    # body: cold grey gradient, lighter top -> darker base
    for y in range(mtop,gy):
        t=(y-mtop)/(gy-mtop); g=int(70-44*t)
        d.line([(mx0,y),(mx1,y)],fill=(g,g,g+6,255))
    # subtle module seams (brutalist repetition)
    for k in range(1,9):
        yy=mtop+k*(gy-mtop)//9
        d.line([(mx0,yy),(mx1,yy)],fill=(20,20,26,120),width=2)
    d.line([(mx0,mtop),(mx0,gy)],fill=(12,12,16,255),width=4)
    d.line([(mx1,mtop),(mx1,gy)],fill=(12,12,16,255),width=4)
    # vertical LIGHT-SHAFT aperture (Boullée: light as ornament)
    sx=int(cx)
    if mode=="violet":
        gl=Image.new("RGBA",(W,H),(0,0,0,0)); gg=ImageDraw.Draw(gl)
        gg.line([(sx,mtop+20),(sx,gy-10)],fill=(143,0,255,200),width=22); gl=gl.filter(ImageFilter.GaussianBlur(26))
        img=Image.alpha_composite(img.convert("RGBA"),gl).convert("RGB"); d=ImageDraw.Draw(img,"RGBA")
        d.line([(sx,mtop+20),(sx,gy-10)],fill=(150,0,255,255),width=8)
        d.line([(sx,mtop+20),(sx,gy-10)],fill=(225,185,255,255),width=3)
        # apex slit (2-slit echo)
        d.line([(sx-40,mtop+60),(sx+40,mtop+60)],fill=(225,185,255,255),width=5)
    else:
        gl=Image.new("RGBA",(W,H),(0,0,0,0)); gg=ImageDraw.Draw(gl)
        gg.line([(sx,mtop+20),(sx,gy-10)],fill=(220,220,228,200),width=16); gl=gl.filter(ImageFilter.GaussianBlur(22))
        img=Image.alpha_composite(img.convert("RGBA"),gl).convert("RGB"); d=ImageDraw.Draw(img,"RGBA")
        d.line([(sx,mtop+20),(sx,gy-10)],fill=(240,240,246,255),width=5)
    # low fog hugging monolith base
    fog2=Image.new("L",(W,H),0); ImageDraw.Draw(fog2).ellipse([mx0-200,gy-180,mx1+200,gy+120],fill=160)
    fog2=fog2.filter(ImageFilter.GaussianBlur(70))
    img=Image.composite(Image.new("RGB",(W,H),(20,20,27)),img,fog2); d=ImageDraw.Draw(img,"RGBA")
    # ---- ground ----
    d.rectangle([0,gy,W,H],fill=(7,7,11,255)); d.line([(0,gy),(W,gy)],fill=(34,34,44,150),width=2)
    # reflection of shaft on wet ground
    if mode=="violet":
        d.line([(sx,gy),(sx,gy+120)],fill=(143,0,255,90),width=6)
    # ---- FOREGROUND: tiny hooded Mikage for scale ----
    fx=int(cx-mw*0.42); fy=gy; fh=92
    d.polygon([(fx-fh*0.18,fy-fh),(fx+fh*0.18,fy-fh),(fx+fh*0.22,fy),(fx-fh*0.22,fy)],fill=(6,6,10,255)) # cloak
    d.polygon([(fx-fh*0.16,fy-fh),(fx,fy-fh*1.12),(fx+fh*0.16,fy-fh)],fill=(6,6,10,255)) # hood
    if mode=="violet":
        d.line([(fx-6,fy-fh*0.86),(fx+6,fy-fh*0.86)],fill=(210,170,255,255),width=2)
    else:
        d.line([(fx-6,fy-fh*0.86),(fx+6,fy-fh*0.86)],fill=(190,190,198,255),width=2)
    # long shadow from figure
    d.polygon([(fx-fh*0.22,fy),(fx-fh*0.22,fy),(fx-260,fy+40),(fx-240,fy+46)],fill=(0,0,0,120))
    # ---- ash particles ----
    for _ in range(150):
        x=rng.uniform(0,W); y=rng.uniform(H*0.15,gy+80); s=rng.uniform(1,3.5)
        d.ellipse([x-s,y-s,x+s,y+s],fill=POR+(int(rng.uniform(24,90)),))
    # vignette
    vig=Image.new("L",(W,H),0); ImageDraw.Draw(vig).ellipse([-W*0.25,-H*0.18,W*1.25,H*1.18],fill=255); vig=vig.filter(ImageFilter.GaussianBlur(240))
    img=Image.composite(img,Image.new("RGB",(W,H),VOID),vig)
    arr=np.asarray(img).astype(np.int16); g=rng.normal(0,5.0,(H,W,1)).repeat(3,axis=2).astype(np.int16)
    img=Image.fromarray(np.clip(arr+g,0,255).astype(np.uint8))
    ImageDraw.Draw(img,"RGBA").rectangle([24,24,W-24,H-24],outline=(80,78,86,140),width=2)
    return img
m=sys.argv[1] if len(sys.argv)>1 else "violet"
render(m).save(f"/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_WORLD_MONOLITH_{m.upper()}_V0_1.png")
Image.open(f"/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_WORLD_MONOLITH_{m.upper()}_V0_1.png").resize((1067,1600),Image.LANCZOS).save(f"/sessions/exciting-eloquent-dijkstra/mnt/outputs/WORLD_{m}_prev.png")
print("done",m)
