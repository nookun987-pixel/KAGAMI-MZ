import math, numpy as np, sys
from PIL import Image, ImageDraw, ImageFilter
W,H=1600,2400
VOID=(5,5,8); POR=(236,232,228); POR_D=(120,118,122); UNDER=(16,16,21); GRAPH=(30,30,38)
VIOLET=(143,0,255); GOLD=(195,150,82)
rng=np.random.default_rng(303)
def render(mode):
    img=Image.new("RGB",(W,H),VOID); d=ImageDraw.Draw(img,"RGBA")
    cx=W*0.46
    # radial lift
    bg=Image.new("L",(W,H),0); ImageDraw.Draw(bg).ellipse([cx-560,H*0.06,cx+560,H*0.82],fill=58); bg=bg.filter(ImageFilter.GaussianBlur(150))
    img=Image.composite(Image.new("RGB",(W,H),(15,15,22)),img,bg); d=ImageDraw.Draw(img,"RGBA")
    hy=H*0.205; R=W*0.205
    # ENSO halo
    halo=Image.new("RGBA",(W,H),(0,0,0,0)); hd=ImageDraw.Draw(halo); seg=160
    for i in range(seg):
        a0=-0.2+i/seg*(2*math.pi*0.93); x0=cx+R*math.cos(a0); y0=hy+R*math.sin(a0)
        w=14*(0.35+0.65*math.sin(i/seg*math.pi))
        hd.ellipse([x0-w,y0-w,x0+w,y0+w],fill=(52,52,62,int(140*(0.4+0.6*math.sin(i/seg*math.pi)))))
    if mode=="violet":
        for i in range(22):
            a0=-0.2+(0.5+i/seg)*(2*math.pi*0.93); x0=cx+R*math.cos(a0); y0=hy+R*math.sin(a0)
            hd.ellipse([x0-5,y0-5,x0+5,y0+5],fill=(143,0,255,80))
    halo=halo.filter(ImageFilter.GaussianBlur(2)); img=Image.alpha_composite(img.convert("RGBA"),halo).convert("RGB"); d=ImageDraw.Draw(img,"RGBA")
    shy=H*0.305; waist=H*0.55; hip=H*0.60; floor=H*0.93
    # ---- LONG BLACK HAIR (distinct mass behind, falls past shoulders; not over slits) ----
    d.polygon([(cx-90,hy-10),(cx-220,shy+40),(cx-250,H*0.74),(cx-150,H*0.80),(cx-70,H*0.66),
               (cx,H*0.60),(cx+70,H*0.66),(cx+150,H*0.80),(cx+250,H*0.74),(cx+220,shy+40),(cx+90,hy-10)],fill=(7,7,11,255))
    # ---- MANTLE V-taper (subordinate accent, behind shoulders, upper back only) ----
    d.polygon([(cx-120,shy-20),(cx-300,shy+30),(cx-250,waist+60),(cx,waist),(cx+250,waist+60),(cx+300,shy+30),(cx+120,shy-20)],fill=(13,13,19,235))
    d.line([(cx-300,shy+30),(cx-250,waist+60)],fill=(34,34,44,150),width=2)
    d.line([(cx+300,shy+30),(cx+250,waist+60)],fill=(34,34,44,150),width=2)
    # ===== ARMOR (white angular, black underlayer) =====
    def plate(pts,hi=True):
        d.polygon(pts,fill=POR)
        # black underlayer shadow on lower/inner
        ys=[p[1] for p in pts]; 
    # chest slab (rectangular hard)
    d.polygon([(cx-150,shy+10),(cx+150,shy+10),(cx+160,waist-40),(cx-160,waist-40)],fill=UNDER)  # underlayer torso
    d.polygon([(cx-128,shy+24),(cx+128,shy+24),(cx+120,waist-110),(cx-120,waist-110)],fill=POR)   # chest plate
    d.line([(cx,shy+30),(cx,waist-115)],fill=(150,148,150,120),width=2)
    d.line([(cx-120,waist-110),(cx+120,waist-110)],fill=UNDER+(255,),width=6)
    # abdomen segments (black underlayer w/ thin white ribs)
    for k in range(3):
        yy=waist-95+k*30
        d.polygon([(cx-95,yy),(cx+95,yy),(cx+88,yy+20),(cx-88,yy+20)],fill=(40,40,50,255))
    # pauldrons (hard angular, white + black under)
    for sgn in (-1,1):
        px=cx+sgn*150
        d.polygon([(px-sgn*6,shy-46),(px+sgn*96,shy-30),(px+sgn*80,shy+86),(px-sgn*20,shy+70)],fill=POR)
        d.polygon([(px+sgn*96,shy-30),(px+sgn*80,shy+86),(px+sgn*56,shy+78),(px+sgn*70,shy-22)],fill=UNDER)
        d.line([(px-sgn*6,shy-46),(px+sgn*96,shy-30)],fill=(255,255,255,120),width=2)
    # upper arms (armored, at sides)
    for sgn in (-1,1):
        ax=cx+sgn*168
        d.polygon([(ax-sgn*30,shy+70),(ax+sgn*30,shy+78),(ax+sgn*24,waist-30),(ax-sgn*34,waist-40)],fill=(150,148,150,255))
        d.polygon([(ax-sgn*30,shy+70),(ax-sgn*34,waist-40),(ax-sgn*18,waist-44),(ax-sgn*16,shy+74)],fill=UNDER)
    # hips (narrow armored)
    d.polygon([(cx-110,hip-20),(cx+110,hip-20),(cx+96,hip+70),(cx-96,hip+70)],fill=(150,148,150,255))
    d.polygon([(cx-86,hip-6),(cx+86,hip-6),(cx+74,hip+54),(cx-74,hip+54)],fill=UNDER)
    # legs (two armored greaves, separated)
    for sgn in (-1,1):
        lx=cx+sgn*52
        # thigh
        d.polygon([(lx-sgn*40,hip+60),(lx+sgn*44,hip+60),(lx+sgn*40,H*0.74),(lx-sgn*44,H*0.74)],fill=POR)
        d.polygon([(lx-sgn*40,hip+60),(lx-sgn*44,H*0.74),(lx-sgn*24,H*0.74),(lx-sgn*22,hip+64)],fill=UNDER)
        # shin
        d.polygon([(lx-sgn*38,H*0.745),(lx+sgn*40,H*0.745),(lx+sgn*34,floor),(lx-sgn*30,floor)],fill=(150,148,150,255))
        d.polygon([(lx-sgn*38,H*0.745),(lx-sgn*30,floor),(lx-sgn*12,floor),(lx-sgn*16,H*0.75)],fill=UNDER)
        d.line([(lx-sgn*40,hip+60),(lx+sgn*44,hip+60)],fill=(255,255,255,90),width=2)
        # knee joint
        d.ellipse([lx-22,H*0.74-18,lx+22,H*0.74+18],fill=(150,148,150,255)); d.ellipse([lx-9,H*0.74-9,lx+9,H*0.74+9],fill=UNDER)
    # center black gap between legs
    d.polygon([(cx-10,hip+70),(cx+10,hip+70),(cx+8,floor),(cx-8,floor)],fill=VOID+(255,))
    # ---- KINTSUGI hairline (restrained, single seam on chest) ----
    seam=[(cx-40,shy+60),(cx-10,shy+150),(cx-30,waist-180),(cx+6,waist-130)]
    kc=GOLD if mode=="violet" else (150,146,150)
    for i in range(len(seam)-1): d.line([seam[i],seam[i+1]],fill=kc+(200,),width=2)
    # ===== HELMET (bare porcelain, 2 slits, no centre line) =====
    sc=2.9; helmP=[(-8,-52),(10,-50),(26,-34),(34,-16),(40,2),(34,18),(20,34),(6,46),(-8,48),(-24,34),(-36,10),(-40,-16),(-30,-42)]
    d.polygon([(cx+x*sc,hy+y*sc) for (x,y) in helmP],fill=POR)
    d.polygon([(cx+x*sc,hy+y*sc) for (x,y) in helmP if y>2],fill=(206,202,198,150))
    for sy in (-16,20):
        if mode=="violet":
            g=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(g).rounded_rectangle([cx-58,hy+sy-8,cx+58,hy+sy+8],radius=8,fill=(143,0,255,255)); g=g.filter(ImageFilter.GaussianBlur(6))
            img=Image.alpha_composite(img.convert("RGBA"),g).convert("RGB"); d=ImageDraw.Draw(img,"RGBA")
            d.rounded_rectangle([cx-56,hy+sy-5,cx+56,hy+sy+5],radius=5,fill=(160,30,255,255)); d.rounded_rectangle([cx-56,hy+sy-2,cx+56,hy+sy+2],radius=2,fill=(225,185,255,255))
        else:
            d.rounded_rectangle([cx-56,hy+sy-6,cx+56,hy+sy+6],radius=6,fill=(34,34,42,255)); d.rounded_rectangle([cx-56,hy+sy-2,cx+56,hy+sy+2],radius=2,fill=(120,118,124,255))
    # ===== ZENITH BLADE (massive rectangular slab, PLANTED at right, hand on it) =====
    bx=cx+W*0.265; bw=46; b_top=shy-70; b_bot=floor+70
    d.polygon([(bx-bw,b_top),(bx+bw,b_top),(bx+bw,b_bot),(bx-bw,b_bot)],fill=(30,30,38,255))      # blade body graphite
    d.polygon([(bx-bw,b_top),(bx-bw+14,b_top),(bx-bw+14,b_bot),(bx-bw,b_bot)],fill=POR)            # porcelain edge strip
    d.line([(bx,b_top+20),(bx,b_bot-20)],fill=(60,60,72,200),width=2)                              # centre fuller
    d.line([(bx+bw,b_top),(bx+bw,b_bot)],fill=(VIOLET if mode=="violet" else (150,146,150))+(230,),width=3)  # signal edge
    # cross-guard/hilt at grip height + HAND resting
    gy0=waist-10
    d.rectangle([bx-bw-26,gy0-10,bx+bw+8,gy0+18],fill=(150,148,150,255))
    d.ellipse([bx-bw-30,gy0-2,bx-bw+6,gy0+40],fill=POR)  # gauntlet hand on guard
    if mode=="violet":
        gl=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(gl).line([(bx+bw,b_top),(bx+bw,b_bot)],fill=(143,0,255,200),width=6); gl=gl.filter(ImageFilter.GaussianBlur(9))
        img=Image.alpha_composite(img.convert("RGBA"),gl).convert("RGB"); d=ImageDraw.Draw(img,"RGBA")
    # grain + vignette + frame
    vig=Image.new("L",(W,H),0); ImageDraw.Draw(vig).ellipse([-W*0.25,-H*0.16,W*1.25,H*1.16],fill=255); vig=vig.filter(ImageFilter.GaussianBlur(230))
    img=Image.composite(img,Image.new("RGB",(W,H),VOID),vig)
    arr=np.asarray(img).astype(np.int16); g=rng.normal(0,5.0,(H,W,1)).repeat(3,axis=2).astype(np.int16)
    img=Image.fromarray(np.clip(arr+g,0,255).astype(np.uint8))
    ImageDraw.Draw(img,"RGBA").rectangle([26,26,W-26,H-26],outline=(86,84,90,140),width=2)
    return img
m=sys.argv[1] if len(sys.argv)>1 else "bw"
render(m).save(f"/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_SOLO_{m.upper()}_V0_3.png")
Image.open(f"/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_SOLO_{m.upper()}_V0_3.png").resize((600,900),Image.LANCZOS).save(f"/sessions/exciting-eloquent-dijkstra/mnt/outputs/SOLO_{m}_prev.png")
print("done",m)
