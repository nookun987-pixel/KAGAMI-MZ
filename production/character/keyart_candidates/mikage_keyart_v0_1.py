# -*- coding: utf-8 -*-
import math, numpy as np
from PIL import Image, ImageDraw, ImageFilter
SS=2
W,H=1600*SS,2400*SS
VOID=(5,5,8); POR=(242,238,234); POR_D=(150,146,150)
ROBE=(13,13,18); ROBE_HI=(40,40,50); VIOLET=(143,0,255)
rng=np.random.default_rng(513)
def S(v): return int(v*SS)
def render(mode):
    img=Image.new("RGB",(W,H),VOID); d=ImageDraw.Draw(img,"RGBA")
    cx=W*0.47
    bg=Image.new("L",(W,H),0); bd=ImageDraw.Draw(bg)
    bd.ellipse([cx-W*0.42,H*0.10,cx+W*0.42,H*0.78],fill=60)
    bg=bg.filter(ImageFilter.GaussianBlur(S(160)))
    img=Image.composite(Image.new("RGB",(W,H),(16,16,24)),img,bg)
    d=ImageDraw.Draw(img,"RGBA")
    hx,hy=cx,H*0.255; R=W*0.235
    halo=Image.new("RGBA",(W,H),(0,0,0,0)); hd=ImageDraw.Draw(halo); seg=170
    for i in range(seg):
        a0=-0.18+i/seg*(2*math.pi*0.93)
        x0=hx+R*math.cos(a0); y0=hy+R*math.sin(a0)
        wdt=S(20)*(0.35+0.65*math.sin(i/seg*math.pi))
        hd.ellipse([x0-wdt,y0-wdt,x0+wdt,y0+wdt],fill=(48,48,58,int(150*(0.4+0.6*math.sin(i/seg*math.pi)))))
    if mode=="violet":
        for i in range(28):
            a0=-0.18+(0.10+i/seg)*(2*math.pi*0.93)
            x0=hx+R*math.cos(a0); y0=hy+R*math.sin(a0)
            hd.ellipse([x0-S(5),y0-S(5),x0+S(5),y0+S(5)],fill=(143,0,255,90))
    halo=halo.filter(ImageFilter.GaussianBlur(S(3)))
    img=Image.alpha_composite(img.convert("RGBA"),halo).convert("RGB"); d=ImageDraw.Draw(img,"RGBA")
    shoulder_y=H*0.355
    hair=[(cx-S(120),hy-S(30)),(cx-S(205),hy+S(120)),(cx-S(225),shoulder_y+S(160)),
          (cx-S(150),shoulder_y+S(330)),(cx,shoulder_y+S(250)),(cx+S(150),shoulder_y+S(330)),
          (cx+S(225),shoulder_y+S(160)),(cx+S(205),hy+S(120)),(cx+S(120),hy-S(30))]
    d.polygon(hair,fill=(8,8,12,255))
    neck_y=hy+S(150); floor_y=H*0.93
    mantle=[(cx-S(86),neck_y),(cx-S(250),shoulder_y),(cx-S(232),shoulder_y+S(420)),
            (cx-S(280),floor_y),(cx-S(120),floor_y+S(36)),(cx,floor_y),(cx+S(120),floor_y+S(36)),
            (cx+S(280),floor_y),(cx+S(232),shoulder_y+S(420)),(cx+S(250),shoulder_y),(cx+S(86),neck_y)]
    d.polygon(mantle,fill=ROBE)
    for i in range(-5,6):
        x=cx+S(i*42); col=ROBE_HI if i%2 else (28,28,36)
        d.line([(x+S(8),shoulder_y+S(120)),(x,floor_y)],fill=col+(70,),width=S(2))
    d.polygon([(cx-S(70),shoulder_y+S(120)),(cx+S(70),shoulder_y+S(120)),(cx+S(110),floor_y-S(40)),(cx-S(110),floor_y-S(40))],fill=(6,6,10,150))
    for sgn in (-1,1):
        px=cx+sgn*S(205)
        pa=[(px-sgn*S(8),shoulder_y-S(28)),(px+sgn*S(78),shoulder_y-S(6)),(px+sgn*S(64),shoulder_y+S(96)),(px-sgn*S(20),shoulder_y+S(78))]
        d.polygon(pa,fill=(18,18,24,255))
        d.line([pa[1],pa[2]],fill=POR_D+(150,),width=S(2)); d.line([pa[0],pa[1]],fill=POR+(160,),width=S(2))
    oy=H*0.585
    d.polygon([(cx-S(150),oy-S(34)),(cx+S(150),oy-S(34)),(cx+S(158),oy+S(40)),(cx-S(158),oy+S(40))],fill=POR)
    d.line([(cx-S(158),oy+S(40)),(cx+S(158),oy+S(40))],fill=(120,116,120,255),width=S(2))
    d.polygon([(cx-S(26),oy+S(30)),(cx+S(26),oy+S(30)),(cx+S(34),oy+S(120)),(cx-S(34),oy+S(120))],fill=(214,210,206,255))
    if mode=="violet": d.line([(cx,oy+S(34)),(cx,oy+S(116))],fill=VIOLET+(120,),width=S(2))
    sc=S(2.7)
    helmP=[(-8,-52),(10,-50),(26,-34),(34,-16),(40,2),(34,18),(20,34),(6,46),(-8,48),(-24,34),(-36,10),(-40,-16),(-30,-42)]
    poly=[(hx+x*sc,hy+y*sc) for (x,y) in helmP]; d.polygon(poly,fill=POR)
    d.polygon([(hx+x*sc,hy+y*sc) for (x,y) in helmP if y>-6],fill=(214,210,206,140))
    d.line([(hx,hy-S(120)),(hx,hy+S(120))],fill=(180,176,180,90),width=S(1))
    for sy in (-S(18),S(20)):
        if mode=="violet":
            d.rounded_rectangle([hx-S(58),hy+sy-S(7),hx+S(58),hy+sy+S(7)],radius=S(7),fill=(143,0,255,255))
            d.rounded_rectangle([hx-S(58),hy+sy-S(3),hx+S(58),hy+sy+S(3)],radius=S(3),fill=(210,160,255,255))
        else:
            d.rounded_rectangle([hx-S(58),hy+sy-S(7),hx+S(58),hy+sy+S(7)],radius=S(7),fill=(30,30,38,255))
            d.rounded_rectangle([hx-S(58),hy+sy-S(2),hx+S(58),hy+sy+S(2)],radius=S(2),fill=(120,116,124,255))
    bx=cx+S(360); b_top=shoulder_y-S(40); b_bot=floor_y+S(60); bw=S(64)
    d.polygon([(bx-bw,b_top),(bx+bw,b_top),(bx+bw,b_bot),(bx-bw,b_bot)],fill=(20,20,26,255))
    d.line([(bx-bw,b_top),(bx-bw,b_bot)],fill=POR+(180,),width=S(3))
    edge_col=VIOLET if mode=="violet" else (150,146,150)
    d.line([(bx+bw,b_top),(bx+bw,b_bot)],fill=edge_col+(220,),width=S(3))
    d.line([(bx,b_top+S(20)),(bx,b_bot-S(20))],fill=(40,40,50,160),width=S(2))
    if mode=="violet":
        glow=Image.new("RGBA",(W,H),(0,0,0,0)); gd=ImageDraw.Draw(glow)
        gd.line([(bx+bw,b_top),(bx+bw,b_bot)],fill=(143,0,255,200),width=S(6))
        glow=glow.filter(ImageFilter.GaussianBlur(S(10)))
        img=Image.alpha_composite(img.convert("RGBA"),glow).convert("RGB"); d=ImageDraw.Draw(img,"RGBA")
    for _ in range(46):
        sx=cx+rng.uniform(-W*0.30,W*0.34); sy=rng.uniform(H*0.18,H*0.66)
        s=rng.uniform(S(5),S(26)); ang=rng.uniform(0,6.28)
        pts=[(sx+math.cos(ang+a)*s*rng.uniform(0.5,1.2),sy+math.sin(ang+a)*s*rng.uniform(0.5,1.2)) for a in (0,2.1,4.2)]
        d.polygon(pts,fill=POR+(int(rng.uniform(70,200)),))
    for _ in range(10):
        sx=cx+rng.uniform(-W*0.28,W*0.32); sy=rng.uniform(H*0.22,H*0.6)
        d.line([(sx,sy),(sx+rng.uniform(-S(60),S(60)),sy-rng.uniform(S(30),S(90)))],fill=POR+(40,),width=S(1))
    vig=Image.new("L",(W,H),0); vd=ImageDraw.Draw(vig)
    vd.ellipse([-W*0.25,-H*0.12,W*1.25,H*1.12],fill=255)
    vig=vig.filter(ImageFilter.GaussianBlur(S(220)))
    img=Image.composite(img,Image.new("RGB",(W,H),VOID),vig)
    arr=np.asarray(img).astype(np.int16)
    g=rng.normal(0,5.5,(H,W,1)).repeat(3,axis=2).astype(np.int16)
    img=Image.fromarray(np.clip(arr+g,0,255).astype(np.uint8))
    d=ImageDraw.Draw(img,"RGBA"); m=S(26)
    d.rectangle([m,m,W-m,H-m],outline=(90,86,92,140),width=S(2))
    return img.resize((1600,2400),Image.LANCZOS)
for mode in ("bw","violet"):
    render(mode).save(f"/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_HERO_KEYART_{mode.upper()}_V0_1.png"); print("saved",mode)
