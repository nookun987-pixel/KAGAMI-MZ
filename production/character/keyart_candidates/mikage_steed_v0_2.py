import math, numpy as np, sys
from PIL import Image, ImageDraw, ImageFilter
W,H=2400,1350
VOID=(5,5,8); POR=(242,238,234); POR_D=(150,146,150); VIOLET=(143,0,255)
rng=np.random.default_rng(909)
def render(mode):
    gy=1118
    grad=np.zeros((H,W,3),np.uint8)
    for y in range(H):
        t=max(0,(y-600)/(H-600)); grad[y,:]=(5+int(10*t),5+int(10*t),9+int(14*t))
    img=Image.fromarray(grad); d=ImageDraw.Draw(img,"RGBA")
    if mode=="violet":
        hz=Image.new("RGBA",(W,H),(0,0,0,0)); hd=ImageDraw.Draw(hz)
        hd.ellipse([W*0.28,gy-200,W*0.82,gy+120],fill=(143,0,255,44)); hz=hz.filter(ImageFilter.GaussianBlur(95))
        img=Image.alpha_composite(img.convert("RGBA"),hz).convert("RGB"); d=ImageDraw.Draw(img,"RGBA")
    for (x,w,h,a) in [(150,80,470,255),(270,42,320,255),(1900,95,520,255),(2040,48,350,255),(2120,32,250,255),(1120,28,170,200)]:
        d.rectangle([x,gy-h,x+w,gy],fill=(11,11,17,a)); d.line([(x,gy-h),(x+w,gy-h)],fill=(40,40,52,120),width=2)
    d.rectangle([0,gy,W,H],fill=(7,7,11,255)); d.line([(0,gy),(W,gy)],fill=(40,40,52,150),width=2)
    glows=[]
    def cyl(x,y,r,ec):
        d.ellipse([x-r,y-r,x+r,y+r],fill=ec+(255,)); d.ellipse([x-r*0.42,y-r*0.42,x+r*0.42,y+r*0.42],fill=(38,38,48,255))
    def hoof(fx):
        d.polygon([(fx-13,gy-30),(fx+13,gy-30),(fx+6,gy+6),(fx-6,gy+6)],fill=(18,18,24,255))
        if mode=="violet":
            g=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(g).ellipse([fx-28,gy-6,fx+28,gy+16],fill=(143,0,255,150)); glows.append(g)
    def seg(p0,p1,wn,col,ec):
        d.line([p0,p1],fill=col+(255,),width=wn); d.line([p0,p1],fill=ec+(110,),width=3)
    # FAR legs (lighter)
    col_f=(24,24,32); ec_f=POR_D
    seg((1450,705),(1495,855),18,col_f,ec_f); seg((1495,855),(1455,950),15,col_f,ec_f); seg((1455,950),(1475,gy),13,col_f,ec_f); cyl(1495,855,11,ec_f); hoof(1475)
    seg((915,690),(905,865),18,col_f,ec_f); seg((905,865),(915,gy),15,col_f,ec_f); cyl(905,865,11,ec_f); hoof(915)
    # BODY barrel (long, low)
    d.polygon([(930,560),(1050,533),(1380,533),(1500,562),(1505,690),(1380,716),(1050,716),(920,688)],fill=(13,13,19,255))
    d.line([(950,556),(1050,536),(1380,536),(1488,560)],fill=POR_D+(140,),width=3)
    d.ellipse([1380,498,1575,722],fill=(14,14,20,255))           # hindquarter
    d.line([(1500,520),(1556,610),(1520,710)],fill=POR_D+(110,),width=3)
    d.ellipse([852,548,1012,716],fill=(14,14,20,255))            # chest
    # NECK arch up-left
    d.polygon([(930,566),(995,544),(862,452),(792,486),(852,548),(905,560)],fill=(13,13,19,255))
    # MANE (dark)
    d.polygon([(862,452),(792,486),(815,520),(900,470)],fill=(8,8,12,255))
    # HEAD equine muzzle (porcelain)
    head=[(806,468),(772,478),(706,556),(690,612),(720,632),(770,604),(818,520)]
    d.polygon(head,fill=(208,204,200,255))
    d.polygon([(806,468),(772,478),(716,548),(792,512)],fill=(150,146,150,255))   # shade upper
    d.polygon([(690,612),(720,632),(770,604),(742,596)],fill=(120,118,122,255))   # muzzle tip shade
    # ears
    seg((800,470),(786,418),5,POR_D,POR_D); seg((820,474),(834,420),5,POR_D,POR_D)
    # eye sensor slit
    if mode=="violet":
        g=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(g).line([(740,560),(786,548)],fill=(143,0,255,255),width=11); g=g.filter(ImageFilter.GaussianBlur(6)); glows.append(g)
        d.line([(742,560),(784,549)],fill=(220,170,255,255),width=5)
    else:
        d.line([(742,559),(784,548)],fill=(40,40,50,255),width=6)
    # NEAR legs (darker, on top)
    col_n=(15,15,21); ec_n=POR
    seg((1450,712),(1500,860),22,col_n,ec_n); seg((1500,860),(1455,958),18,col_n,ec_n); seg((1455,958),(1480,gy),15,col_n,ec_n); cyl(1500,860,14,ec_n); hoof(1480)
    seg((930,700),(918,872),22,col_n,ec_n); seg((918,872),(930,gy),18,col_n,ec_n); cyl(918,872,14,ec_n); hoof(930)
    # exhaust vents hind
    for k in range(3): d.line([(1545,540+k*30),(1640,585+k*46)],fill=(60,60,72,150),width=3)
    # ===== RIDER hooded Mikage =====
    rx=1180; 
    d.polygon([(rx-70,360),(rx-160,500),(rx-130,700),(rx+30,724),(rx+150,566),(rx+118,384)],fill=(17,17,24,255))
    d.line([(rx-160,500),(rx-130,700)],fill=(36,36,46,150),width=3)
    d.polygon([(rx-74,300),(rx-96,248),(rx-32,196),(rx+42,192),(rx+100,250),(rx+82,332),(rx-8,346)],fill=(18,18,25,255))
    d.polygon([(rx-32,238),(rx-42,302),(rx+10,326),(rx+54,302),(rx+46,238),(rx+8,214)],fill=(7,7,11,255))
    d.polygon([(rx-16,240),(rx-24,296),(rx+8,312),(rx+40,296),(rx+32,240),(rx+8,224)],fill=(78,77,82,255))
    d.polygon([(rx-16,240),(rx+32,240),(rx+24,253),(rx-8,253)],fill=(150,148,152,220))
    for sy in (258,282):
        if mode=="violet":
            g=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(g).line([(rx-16,sy),(rx+28,sy)],fill=(143,0,255,255),width=8); g=g.filter(ImageFilter.GaussianBlur(5)); glows.append(g)
            d.line([(rx-14,sy),(rx+26,sy)],fill=(220,180,255,255),width=3)
        else:
            d.line([(rx-14,sy),(rx+26,sy)],fill=(210,208,212,255),width=4)
    rc=VIOLET if mode=="violet" else (90,88,96)
    d.line([(rx-60,452),(900,600),(742,584)],fill=rc+(150,),width=3)   # reins
    for g in glows: img=Image.alpha_composite(img.convert("RGBA"),g).convert("RGB")
    d=ImageDraw.Draw(img,"RGBA")
    for _ in range(120):
        x=rng.uniform(0,W); y=rng.uniform(H*0.25,gy); s=rng.uniform(1,4)
        d.ellipse([x-s,y-s,x+s,y+s],fill=POR+(int(rng.uniform(28,110)),))
    vig=Image.new("L",(W,H),0); ImageDraw.Draw(vig).ellipse([-W*0.2,-H*0.2,W*1.2,H*1.2],fill=255); vig=vig.filter(ImageFilter.GaussianBlur(260))
    img=Image.composite(img,Image.new("RGB",(W,H),VOID),vig)
    arr=np.asarray(img).astype(np.int16); g=rng.normal(0,5.0,(H,W,1)).repeat(3,axis=2).astype(np.int16)
    img=Image.fromarray(np.clip(arr+g,0,255).astype(np.uint8))
    ImageDraw.Draw(img,"RGBA").rectangle([20,20,W-20,H-20],outline=(90,86,92,140),width=2)
    return img
m=sys.argv[1] if len(sys.argv)>1 else "violet"
render(m).save(f"/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_STEED_{m.upper()}_V0_2.png")
Image.open(f"/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_STEED_{m.upper()}_V0_2.png").resize((1600,900),Image.LANCZOS).save(f"/sessions/exciting-eloquent-dijkstra/mnt/outputs/STEED_{m}_prev2.png")
print("done",m)
