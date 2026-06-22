import math, numpy as np, sys
from PIL import Image, ImageDraw, ImageFilter
W,H=2400,1350
VOID=(5,5,8); POR=(242,238,234); POR_D=(150,146,150); VIOLET=(143,0,255)
rng=np.random.default_rng(414)
def render(mode):
    gy=int(H*0.84)
    grad=np.zeros((H,W,3),np.uint8)
    for y in range(H):
        t=y/H; grad[y,:]=(5+int(8*t),5+int(8*t),9+int(13*t))
    img=Image.fromarray(grad); d=ImageDraw.Draw(img,"RGBA")
    # ===== FAR BAND: White Monolith + distant blocks in fog =====
    mcx=int(W*0.45); mw=int(W*0.185); mx0=mcx-mw//2; mx1=mcx+mw//2; mtop=int(H*0.045)
    # distant ranks
    for (x,w,h,t) in [(W*0.16,70,560,26),(W*0.24,46,420,22),(W*0.66,90,640,28),(W*0.74,52,440,22),(W*0.80,34,320,20)]:
        x=int(x); d.rectangle([x,gy-h,x+w,gy],fill=(t,t,t+3,255))
    # monolith body gradient (cold)
    for y in range(mtop,gy):
        t=(y-mtop)/(gy-mtop); g=int(64-40*t)
        d.line([(mx0,y),(mx1,y)],fill=(g,g,g+6,255))
    for k in range(1,8):
        yy=mtop+k*(gy-mtop)//8; d.line([(mx0,yy),(mx1,yy)],fill=(18,18,24,120),width=2)
    d.line([(mx0,mtop),(mx0,gy)],fill=(11,11,15,255),width=3); d.line([(mx1,mtop),(mx1,gy)],fill=(11,11,15,255),width=3)
    # vertical light shaft
    sx=mcx
    if mode=="violet":
        gl=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(gl).line([(sx,mtop+18),(sx,gy)],fill=(143,0,255,210),width=20); gl=gl.filter(ImageFilter.GaussianBlur(24))
        img=Image.alpha_composite(img.convert("RGBA"),gl).convert("RGB"); d=ImageDraw.Draw(img,"RGBA")
        d.line([(sx,mtop+18),(sx,gy)],fill=(150,0,255,255),width=7); d.line([(sx,mtop+18),(sx,gy)],fill=(225,185,255,255),width=3)
        d.line([(sx-34,mtop+52),(sx+34,mtop+52)],fill=(225,185,255,255),width=4)
    else:
        gl=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(gl).line([(sx,mtop+18),(sx,gy)],fill=(220,220,228,200),width=14); gl=gl.filter(ImageFilter.GaussianBlur(20))
        img=Image.alpha_composite(img.convert("RGBA"),gl).convert("RGB"); d=ImageDraw.Draw(img,"RGBA")
        d.line([(sx,mtop+18),(sx,gy)],fill=(240,240,246,255),width=4)
    # fog band over far/mid
    fog=Image.new("L",(W,H),0); ImageDraw.Draw(fog).rectangle([0,gy-360,W,gy+40],fill=150); fog=fog.filter(ImageFilter.GaussianBlur(90))
    img=Image.composite(Image.new("RGB",(W,H),(17,17,24)),img,fog); d=ImageDraw.Draw(img,"RGBA")
    # ground
    d.rectangle([0,gy,W,H],fill=(6,6,10,255)); d.line([(0,gy),(W,gy)],fill=(30,30,40,140),width=2)
    if mode=="violet": d.line([(sx,gy),(sx,gy+90)],fill=(143,0,255,80),width=5)
    # ===== MID BAND: rider on mech-steed (facing LEFT toward monolith), placed + scaled =====
    s=0.60; bx=int(W*0.66); by=gy   # ground contact center
    LCX=1165
    def P(lx,ly): return (bx+(lx-LCX)*s, by+(ly-1118)*s)
    def wln(p0,p1,w,col): d.line([P(*p0),P(*p1)],fill=col,width=max(1,int(w*s)))
    glows=[]
    rimL = (185,120,255) if mode=="violet" else (120,120,134)  # rim toward monolith (left)
    def hoof(fx):
        a=P(fx,1118-30); b=P(fx,1118+6)
        d.polygon([(a[0]-13*s,a[1]),(a[0]+13*s,a[1]),(b[0]+6*s,b[1]),(b[0]-6*s,b[1])],fill=(16,16,22,255))
        if mode=="violet":
            g=Image.new("RGBA",(W,H),(0,0,0,0)); c=P(fx,1118); ImageDraw.Draw(g).ellipse([c[0]-26*s,c[1]-6,c[0]+26*s,c[1]+12],fill=(143,0,255,150)); glows.append(g)
    # far legs
    cf=(24,24,32)
    wln((1450,705),(1495,855),18,cf+(255,)); wln((1495,855),(1455,950),15,cf+(255,)); wln((1455,950),(1475,1118),13,cf+(255,)); hoof(1475)
    wln((915,690),(905,865),18,cf+(255,)); wln((905,865),(915,1118),15,cf+(255,)); hoof(915)
    # body
    d.polygon([P(930,560),P(1050,533),P(1380,533),P(1500,562),P(1505,690),P(1380,716),P(1050,716),P(920,688)],fill=(13,13,19,255))
    d.ellipse([*P(1380,498),*P(1575,722)],fill=(14,14,20,255))
    d.ellipse([*P(852,548),*P(1012,716)],fill=(14,14,20,255))
    d.polygon([P(930,566),P(995,544),P(862,452),P(792,486),P(852,548),P(905,560)],fill=(13,13,19,255))
    d.polygon([P(862,452),P(792,486),P(815,520),P(900,470)],fill=(8,8,12,255))
    # head
    d.polygon([P(806,468),P(772,478),P(706,556),P(690,612),P(720,632),P(770,604),P(818,520)],fill=(96,94,99,255))
    d.polygon([P(806,468),P(772,478),P(716,548),P(792,512)],fill=(70,68,73,255))
    wln((800,470),(786,418),5,POR_D+(255,)); wln((820,474),(834,420),5,POR_D+(255,))
    if mode=="violet":
        g=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(g).line([P(740,560),P(786,548)],fill=(143,0,255,255),width=int(11*s)+2); g=g.filter(ImageFilter.GaussianBlur(5)); glows.append(g)
        d.line([P(742,560),P(784,549)],fill=(220,170,255,255),width=max(2,int(5*s)))
    else:
        d.line([P(742,559),P(784,548)],fill=(40,40,50,255),width=max(2,int(6*s)))
    # near legs
    cn=(15,15,21)
    wln((1450,712),(1500,860),22,cn+(255,)); wln((1500,860),(1455,958),18,cn+(255,)); wln((1455,958),(1480,1118),15,cn+(255,)); hoof(1480)
    wln((930,700),(918,872),22,cn+(255,)); wln((918,872),(930,1118),18,cn+(255,)); hoof(930)
    # RIDER hooded
    rx=1180
    d.polygon([P(rx-70,360),P(rx-160,500),P(rx-130,700),P(rx+30,724),P(rx+150,566),P(rx+118,384)],fill=(17,17,24,255))
    d.polygon([P(rx-74,300),P(rx-96,248),P(rx-32,196),P(rx+42,192),P(rx+100,250),P(rx+82,332),P(rx-8,346)],fill=(18,18,25,255))
    d.polygon([P(rx-32,238),P(rx-42,302),P(rx+10,326),P(rx+54,302),P(rx+46,238),P(rx+8,214)],fill=(7,7,11,255))
    d.polygon([P(rx-16,240),P(rx-24,296),P(rx+8,312),P(rx+40,296),P(rx+32,240),P(rx+8,224)],fill=(74,73,78,255))
    for sy in (258,282):
        if mode=="violet":
            g=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(g).line([P(rx-16,sy),P(rx+28,sy)],fill=(143,0,255,255),width=int(8*s)+2); g=g.filter(ImageFilter.GaussianBlur(4)); glows.append(g)
            d.line([P(rx-14,sy),P(rx+26,sy)],fill=(220,180,255,255),width=max(2,int(3)))
        else:
            d.line([P(rx-14,sy),P(rx+26,sy)],fill=(205,205,210,255),width=2)
    # ---- RIM LIGHT on left contour (toward monolith) ----
    rim=[(862,452),(792,486),(706,556),(690,612)]  # neck->head left edge
    for i in range(len(rim)-1): d.line([P(*rim[i]),P(*rim[i+1])],fill=rimL+(220,),width=3)
    d.line([P(852,548),P(905,690)],fill=rimL+(180,),width=3)          # chest rim
    d.line([P(rx-96,248),P(rx-74,300)],fill=rimL+(210,),width=3)      # hood rim
    d.line([P(rx-160,500),P(rx-130,700)],fill=rimL+(170,),width=3)    # cloak rim
    for g in glows: img=Image.alpha_composite(img.convert("RGBA"),g).convert("RGB")
    d=ImageDraw.Draw(img,"RGBA")
    # ===== FORE: ash + low rubble silhouettes =====
    for (x,w,h) in [(120,260,40),(2050,300,52),(900,180,26)]:
        d.polygon([(x,gy+200),(x+w*0.3,gy+120),(x+w*0.7,gy+150),(x+w,gy+200)],fill=(4,4,7,255))
    for _ in range(150):
        x=rng.uniform(0,W); y=rng.uniform(H*0.3,gy+120); ssz=rng.uniform(1,3.5)
        d.ellipse([x-ssz,y-ssz,x+ssz,y+ssz],fill=POR+(int(rng.uniform(22,90)),))
    vig=Image.new("L",(W,H),0); ImageDraw.Draw(vig).ellipse([-W*0.18,-H*0.18,W*1.18,H*1.18],fill=255); vig=vig.filter(ImageFilter.GaussianBlur(250))
    img=Image.composite(img,Image.new("RGB",(W,H),VOID),vig)
    arr=np.asarray(img).astype(np.int16); g=rng.normal(0,4.6,(H,W,1)).repeat(3,axis=2).astype(np.int16)
    img=Image.fromarray(np.clip(arr+g,0,255).astype(np.uint8))
    ImageDraw.Draw(img,"RGBA").rectangle([22,22,W-22,H-22],outline=(78,76,84,140),width=2)
    return img
m=sys.argv[1] if len(sys.argv)>1 else "violet"
render(m).save(f"/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_HERO_RIDE_MONOLITH_{m.upper()}_V0_2.png")
Image.open(f"/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_HERO_RIDE_MONOLITH_{m.upper()}_V0_2.png").resize((1600,900),Image.LANCZOS).save(f"/sessions/exciting-eloquent-dijkstra/mnt/outputs/HERO_{m}_prev2.png")
print("done",m)
