import math, numpy as np, sys
from PIL import Image, ImageDraw, ImageFilter
W,H=1600,2400
VOID=(5,5,8); POR=(236,232,228); POR_D=(120,118,122); UNDER=(15,15,20)
VIOLET=(143,0,255); GOLD=(195,150,82)
rng=np.random.default_rng(304)
def render(mode):
    img=Image.new("RGB",(W,H),VOID); d=ImageDraw.Draw(img,"RGBA")
    cx=W*0.46
    bg=Image.new("L",(W,H),0); ImageDraw.Draw(bg).ellipse([cx-560,H*0.05,cx+560,H*0.80],fill=56); bg=bg.filter(ImageFilter.GaussianBlur(150))
    img=Image.composite(Image.new("RGB",(W,H),(15,15,22)),img,bg); d=ImageDraw.Draw(img,"RGBA")
    hy=H*0.205; R=W*0.225          # ensō slightly bigger
    halo=Image.new("RGBA",(W,H),(0,0,0,0)); hd=ImageDraw.Draw(halo); seg=160
    for i in range(seg):
        a0=-0.2+i/seg*(2*math.pi*0.93); x0=cx+R*math.cos(a0); y0=hy+R*math.sin(a0)
        w=15*(0.35+0.65*math.sin(i/seg*math.pi))
        hd.ellipse([x0-w,y0-w,x0+w,y0+w],fill=(54,54,64,int(150*(0.4+0.6*math.sin(i/seg*math.pi)))))
    if mode=="violet":
        for i in range(20):
            a0=-0.2+(0.52+i/seg)*(2*math.pi*0.93); x0=cx+R*math.cos(a0); y0=hy+R*math.sin(a0)
            hd.ellipse([x0-5,y0-5,x0+5,y0+5],fill=(143,0,255,80))
    halo=halo.filter(ImageFilter.GaussianBlur(2)); img=Image.alpha_composite(img.convert("RGBA"),halo).convert("RGB"); d=ImageDraw.Draw(img,"RGBA")
    shy=H*0.305; waist=H*0.55; hip=H*0.60; floor=H*0.915
    # ground plane + soft fog
    d.rectangle([0,int(floor),W,H],fill=(8,8,12,255)); d.line([(0,floor),(W,floor)],fill=(30,30,40,140),width=2)
    # ---- LONG BLACK HAIR (heavier, wider, with cool rim so it reads) ----
    hair=[(cx-100,hy-20),(cx-250,shy+40),(cx-285,H*0.74),(cx-170,H*0.82),(cx-80,H*0.66),
          (cx,H*0.60),(cx+80,H*0.66),(cx+170,H*0.82),(cx+285,H*0.74),(cx+250,shy+40),(cx+100,hy-20)]
    d.polygon(hair,fill=(9,9,13,255))
    # hair cool rim on left back edge
    rimc=(70,72,92) if mode=="bw" else (120,90,180)
    d.line([(cx-250,shy+40),(cx-285,H*0.74),(cx-170,H*0.82)],fill=rimc+(200,),width=3)
    d.line([(cx-100,hy-20),(cx-250,shy+40)],fill=rimc+(150,),width=2)
    # ---- MANTLE V-taper (subordinate, a touch wider for intent) ----
    d.polygon([(cx-128,shy-22),(cx-320,shy+28),(cx-262,waist+70),(cx,waist),(cx+262,waist+70),(cx+320,shy+28),(cx+128,shy-22)],fill=(13,13,19,235))
    d.line([(cx-320,shy+28),(cx-262,waist+70)],fill=(36,36,46,160),width=2)
    d.line([(cx+320,shy+28),(cx+262,waist+70)],fill=(30,30,40,150),width=2)
    # ===== ARMOR =====
    d.polygon([(cx-150,shy+10),(cx+150,shy+10),(cx+160,waist-40),(cx-160,waist-40)],fill=UNDER)
    d.polygon([(cx-128,shy+24),(cx+128,shy+24),(cx+120,waist-110),(cx-120,waist-110)],fill=POR)
    d.line([(cx-120,waist-110),(cx+120,waist-110)],fill=UNDER+(255,),width=6)
    for k in range(3):
        yy=waist-95+k*30; d.polygon([(cx-95,yy),(cx+95,yy),(cx+88,yy+20),(cx-88,yy+20)],fill=(38,38,48,255))
    # pauldrons wider (+6%)
    for sgn in (-1,1):
        px=cx+sgn*162
        d.polygon([(px-sgn*6,shy-52),(px+sgn*104,shy-34),(px+sgn*86,shy+92),(px-sgn*22,shy+74)],fill=POR)
        d.polygon([(px+sgn*104,shy-34),(px+sgn*86,shy+92),(px+sgn*60,shy+84),(px+sgn*76,shy-26)],fill=UNDER)
        d.line([(px-sgn*6,shy-52),(px+sgn*104,shy-34)],fill=(255,255,255,130),width=2)
    for sgn in (-1,1):
        ax=cx+sgn*180
        d.polygon([(ax-sgn*30,shy+76),(ax+sgn*30,shy+84),(ax+sgn*24,waist-30),(ax-sgn*34,waist-40)],fill=(150,148,150,255))
        d.polygon([(ax-sgn*30,shy+76),(ax-sgn*34,waist-40),(ax-sgn*18,waist-44),(ax-sgn*16,shy+80)],fill=UNDER)
    d.polygon([(cx-104,hip-20),(cx+104,hip-20),(cx+90,hip+70),(cx-90,hip+70)],fill=(150,148,150,255))
    d.polygon([(cx-82,hip-6),(cx+82,hip-6),(cx+70,hip+54),(cx-70,hip+54)],fill=UNDER)
    # legs slimmer/closer (gọn thân dưới)
    for sgn in (-1,1):
        lx=cx+sgn*46
        d.polygon([(lx-sgn*36,hip+60),(lx+sgn*40,hip+60),(lx+sgn*36,H*0.74),(lx-sgn*40,H*0.74)],fill=POR)
        d.polygon([(lx-sgn*36,hip+60),(lx-sgn*40,H*0.74),(lx-sgn*22,H*0.74),(lx-sgn*20,hip+64)],fill=UNDER)
        d.polygon([(lx-sgn*34,H*0.745),(lx+sgn*36,H*0.745),(lx+sgn*30,floor),(lx-sgn*26,floor)],fill=(150,148,150,255))
        d.polygon([(lx-sgn*34,H*0.745),(lx-sgn*26,floor),(lx-sgn*10,floor),(lx-sgn*14,H*0.75)],fill=UNDER)
        d.ellipse([lx-20,H*0.74-16,lx+20,H*0.74+16],fill=(150,148,150,255)); d.ellipse([lx-8,H*0.74-8,lx+8,H*0.74+8],fill=UNDER)
    d.polygon([(cx-9,hip+70),(cx+9,hip+70),(cx+7,floor),(cx-7,floor)],fill=VOID+(255,))
    # kintsugi
    seam=[(cx-40,shy+60),(cx-10,shy+150),(cx-30,waist-180),(cx+6,waist-130)]
    kc=GOLD if mode=="violet" else (140,138,142)
    for i in range(len(seam)-1): d.line([seam[i],seam[i+1]],fill=kc+(200,),width=2)
    # ===== HELMET bigger (+9%) =====
    sc=3.18; hyh=hy
    helmP=[(-8,-52),(10,-50),(26,-34),(34,-16),(40,2),(34,18),(20,34),(6,46),(-8,48),(-24,34),(-36,10),(-40,-16),(-30,-42)]
    d.polygon([(cx+x*sc,hyh+y*sc) for (x,y) in helmP],fill=POR)
    d.polygon([(cx+x*sc,hyh+y*sc) for (x,y) in helmP if y>2],fill=(208,204,200,150))
    for sy in (-18,22):
        if mode=="violet":
            g=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(g).rounded_rectangle([cx-64,hyh+sy-9,cx+64,hyh+sy+9],radius=9,fill=(143,0,255,255)); g=g.filter(ImageFilter.GaussianBlur(6))
            img=Image.alpha_composite(img.convert("RGBA"),g).convert("RGB"); d=ImageDraw.Draw(img,"RGBA")
            d.rounded_rectangle([cx-62,hyh+sy-5,cx+62,hyh+sy+5],radius=5,fill=(160,30,255,255)); d.rounded_rectangle([cx-62,hyh+sy-2,cx+62,hyh+sy+2],radius=2,fill=(225,185,255,255))
        else:
            d.rounded_rectangle([cx-62,hyh+sy-6,cx+62,hyh+sy+6],radius=6,fill=(34,34,42,255)); d.rounded_rectangle([cx-62,hyh+sy-2,cx+62,hyh+sy+2],radius=2,fill=(120,118,124,255))
    # ===== ZENITH BLADE heavier + ground contact =====
    bx=cx+W*0.275; bw=64; b_top=shy-90; b_bot=int(floor)
    # cast shadow on ground
    sh=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(sh).ellipse([bx-150,floor-14,bx+120,floor+44],fill=(0,0,0,150)); sh=sh.filter(ImageFilter.GaussianBlur(16))
    img=Image.alpha_composite(img.convert("RGBA"),sh).convert("RGB"); d=ImageDraw.Draw(img,"RGBA")
    d.polygon([(bx-bw,b_top),(bx+bw,b_top),(bx+bw,b_bot),(bx-bw,b_bot)],fill=(32,32,40,255))
    d.polygon([(bx-bw,b_top),(bx-bw+18,b_top),(bx-bw+18,b_bot),(bx-bw,b_bot)],fill=POR)
    d.line([(bx,b_top+20),(bx,b_bot-10)],fill=(60,60,72,200),width=2)
    d.line([(bx+bw,b_top),(bx+bw,b_bot)],fill=(VIOLET if mode=="violet" else (150,146,150))+(230,),width=3)
    d.polygon([(bx-bw-6,b_bot-30),(bx+bw+6,b_bot-30),(bx+bw,b_bot),(bx-bw,b_bot)],fill=(40,40,50,255)) # base foot
    gy0=waist+6
    d.rectangle([bx-bw-30,gy0-12,bx+bw+10,gy0+22],fill=(150,148,150,255))   # guard
    d.ellipse([bx-bw-36,gy0-4,bx-bw+10,gy0+48],fill=POR)                    # gauntlet
    d.ellipse([bx-bw-30,gy0+2,bx-bw+4,gy0+40],fill=(150,148,150,255))
    if mode=="violet":
        gl=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(gl).line([(bx+bw,b_top),(bx+bw,b_bot)],fill=(143,0,255,200),width=6); gl=gl.filter(ImageFilter.GaussianBlur(9))
        img=Image.alpha_composite(img.convert("RGBA"),gl).convert("RGB"); d=ImageDraw.Draw(img,"RGBA")
    # figure cast shadow
    sh2=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(sh2).ellipse([cx-200,floor-16,cx+150,floor+50],fill=(0,0,0,140)); sh2=sh2.filter(ImageFilter.GaussianBlur(20))
    img=Image.alpha_composite(img.convert("RGBA"),sh2).convert("RGB")
    # ===== LIGHTING PASS: cool directional key (upper-left) + deepen right =====
    arr=np.asarray(img).astype(np.float32)
    yy,xx=np.mgrid[0:H,0:W]
    # light map: brighter upper-left, darker lower-right
    Lx=1.0 - (xx/W-0.30)*0.42 - (yy/H-0.18)*0.18
    Lx=np.clip(Lx,0.62,1.18)[...,None]
    arr=arr*Lx
    # cool tint in shadows
    shadow=np.clip(1.0-arr.mean(2,keepdims=True)/120,0,1)
    arr[...,2]+=shadow[...,0]*8; arr[...,0]-=shadow[...,0]*3
    img=Image.fromarray(np.clip(arr,0,255).astype(np.uint8)); d=ImageDraw.Draw(img,"RGBA")
    # ===== RIM LIGHT (cool) on right contour =====
    rl=(150,160,190) if mode=="bw" else (180,140,225)
    d.line([(cx+44*sc/2,hyh-150),(cx+128,shy-40)],fill=rl+(0,),width=1) # noop guard
    rim_pts=[(cx+128,shy+24),(cx+120,waist-110)]
    d.line([(cx+266,shy-34),(cx+248,shy+84)],fill=rl+(150,),width=3)   # right pauldron rim
    d.line([(cx+120,shy+30),(cx+112,waist-110)],fill=rl+(120,),width=2) # chest right rim
    d.line([(cx+46+36,hip+62),(cx+46+30,floor)],fill=rl+(120,),width=2) # right leg rim
    # helmet right rim
    d.line([(cx+40*sc,hyh-10),(cx+20*sc,hyh+34*1)],fill=rl+(140,),width=2)
    # blade right edge already violet/porcelain; add cool rim left edge of blade
    d.line([(bx-bw,b_top),(bx-bw,b_bot)],fill=rl+(110,),width=2)
    # grain + vignette + frame
    vig=Image.new("L",(W,H),0); ImageDraw.Draw(vig).ellipse([-W*0.25,-H*0.15,W*1.25,H*1.15],fill=255); vig=vig.filter(ImageFilter.GaussianBlur(230))
    img=Image.composite(img,Image.new("RGB",(W,H),VOID),vig)
    arr=np.asarray(img).astype(np.int16); g=rng.normal(0,4.6,(H,W,1)).repeat(3,axis=2).astype(np.int16)
    img=Image.fromarray(np.clip(arr+g,0,255).astype(np.uint8))
    ImageDraw.Draw(img,"RGBA").rectangle([26,26,W-26,H-26],outline=(86,84,90,140),width=2)
    return img
m=sys.argv[1] if len(sys.argv)>1 else "bw"
render(m).save(f"/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_SOLO_{m.upper()}_V0_4.png")
Image.open(f"/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_SOLO_{m.upper()}_V0_4.png").resize((600,900),Image.LANCZOS).save(f"/sessions/exciting-eloquent-dijkstra/mnt/outputs/S4_{m}_prev.png")
print("done",m)
