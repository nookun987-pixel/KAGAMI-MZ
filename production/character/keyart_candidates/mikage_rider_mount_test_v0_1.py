import math, numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
W,H=2400,1350
VOID=(5,5,8); STEEL=(146,146,154); STEEL_D=(92,92,100); BODY=(16,16,22); HUMP=(23,23,31)
POR=(232,228,224); VIOLET=(143,0,255)
rng=np.random.default_rng(808)
gy=int(H*0.80); cx=W*0.50
def render():
    grad=np.zeros((H,W,3),np.uint8)
    for y in range(H): t=y/H; grad[y,:]=(5+int(7*t),5+int(7*t),9+int(11*t))
    img=Image.fromarray(grad); d=ImageDraw.Draw(img,"RGBA")
    fog=Image.new("L",(W,H),0); ImageDraw.Draw(fog).rectangle([0,gy-240,W,gy+60],fill=130); fog=fog.filter(ImageFilter.GaussianBlur(90))
    img=Image.composite(Image.new("RGB",(W,H),(16,16,22)),img,fog); d=ImageDraw.Draw(img,"RGBA")
    d.rectangle([0,gy,W,H],fill=(7,7,11,255)); d.line([(0,gy),(W,gy)],fill=(30,30,40,140),width=2)
    GL=[]
    def seg(p0,p1,w,c): d.line([p0,p1],fill=c+(255,),width=w)
    def joint(x,y,r,c=STEEL): d.ellipse([x-r,y-r,x+r,y+r],fill=c+(255,)); d.ellipse([x-r*0.4,y-r*0.4,x+r*0.4,y+r*0.4],fill=(34,34,44,255))
    def hoof(fx,big=1.0,near=True):
        s=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(s).ellipse([fx-60*big,gy-6,fx+60*big,gy+22],fill=(0,0,0,165 if near else 110)); s=s.filter(ImageFilter.GaussianBlur(13)); GL.append(s)
        w=20*big; d.polygon([(fx-w,gy-42),(fx+w,gy-42),(fx+w*0.62,gy+6),(fx-w*0.62,gy+6)],fill=(20,20,26,255)); d.line([(fx-w,gy-42),(fx-w*0.62,gy+6)],fill=STEEL_D+(200,),width=3)
    def legF(x,col,ec,near,bend=0):
        kx,ky=x-6+bend,878; seg((x,706),(kx,ky),26 if near else 18,col); joint(kx,ky,16 if near else 11,ec); seg((kx,ky),(x-2+bend,gy-42),17 if near else 12,col); d.line([(kx-10,ky+8),(kx-14+bend,gy-52)],fill=STEEL_D+(150,),width=4)
    def legH(x,col,ec,near):
        sx,sy=x+44,852; hx,hy=x-2,956; seg((x,712),(sx,sy),24 if near else 18,col); joint(sx,sy,15 if near else 11,ec); seg((sx,sy),(hx,hy),18 if near else 13,col); joint(hx,hy,13 if near else 10,ec); seg((hx,hy),(hx+20,gy-42),15 if near else 11,col); d.line([(hx+6,hy+6),(hx+24,gy-52)],fill=STEEL_D+(150,),width=4)
    legF(cx-90,(28,28,36),STEEL_D,False,bend=14); legH(cx+250,(28,28,36),STEEL_D,False); hoof(cx-90,1.0,False); hoof(cx+270,1.0,False)
    top=[(cx-486,616),(cx-380,496),(cx-250,470),(cx-110,500),(cx+50,516),(cx+200,498),(cx+340,492),(cx+430,540)]
    bot=[(cx+430,540),(cx+420,700),(cx+300,756),(cx+120,776),(cx-120,770),(cx-330,742),(cx-400,672)]
    d.polygon(top+bot,fill=BODY)
    d.polygon([(cx-300,496),(cx-150,440),(cx-10,470),(cx-20,576),(cx-280,572)],fill=HUMP); d.line([(cx-300,496),(cx-150,440),(cx-10,470)],fill=STEEL_D+(160,),width=3)
    d.polygon([(cx-400,650),(cx-300,690),(cx-250,768),(cx-380,748)],fill=(20,20,28,255)); d.line([(cx-400,650),(cx-300,690),(cx-250,768)],fill=STEEL_D+(140,),width=3)
    d.polygon([(cx+150,470),(cx+280,452),(cx+380,498),(cx+360,580),(cx+150,576)],fill=HUMP); d.line([(cx+150,470),(cx+280,452),(cx+380,498)],fill=STEEL_D+(150,),width=3)
    seg((cx-300,742),(cx+300,748),9,STEEL_D)
    for x in range(int(cx-220),int(cx+240),62): d.line([(x,540),(x,720)],fill=(40,40,52,120),width=3)
    seg((cx-300,512),(cx-300,500),40,BODY); seg((cx-300,512),(cx-440,486),38,BODY); seg((cx-440,486),(cx-548,524),28,BODY); joint(cx-440,486,14,STEEL_D); joint(cx-548,524,13,STEEL_D); seg((cx-548,524),(cx-606,606),22,BODY)
    hx,hyy=cx-628,640; sc=1.44
    head=[(hx+40*sc,hyy-58*sc),(hx-30*sc,hyy-46*sc),(hx-104*sc,hyy-6*sc),(hx-118*sc,hyy+34*sc),(hx-78*sc,hyy+58*sc),(hx-6*sc,hyy+52*sc),(hx+34*sc,hyy+6*sc)]
    d.polygon(head,fill=(26,26,34,255)); d.polygon([(hx+40*sc,hyy-58*sc),(hx-30*sc,hyy-46*sc),(hx-58*sc,hyy-2*sc),(hx+16*sc,hyy-12*sc)],fill=STEEL_D+(255,))
    d.line([(hx-104*sc,hyy-6*sc),(hx-118*sc,hyy+34*sc)],fill=STEEL_D+(190,),width=4); d.line([(hx-30*sc,hyy+42*sc),(hx-86*sc,hyy+58*sc)],fill=(54,54,66,220),width=4)
    seg((hx-6*sc,hyy-52*sc),(hx-22*sc,hyy-110*sc),6,STEEL_D); seg((hx+20*sc,hyy-46*sc),(hx+36*sc,hyy-104*sc),6,STEEL_D)
    d.line([(hx-98*sc,hyy+12*sc),(hx-44*sc,hyy+2*sc)],fill=(40,40,50,255),width=9); d.line([(hx-94*sc,hyy+11*sc),(hx-48*sc,hyy+2*sc)],fill=(172,172,184,255),width=3)
    # ===== RIDER: Mikage V0.4 seated on docking plate (faces left) =====
    rx=cx+40; seat=505
    # hair behind, down flank
    d.polygon([(rx+10,330),(rx+70,360),(rx+120,520),(rx+70,560),(rx+30,470)],fill=(9,9,13,255))
    # mantle small V behind
    d.polygon([(rx-6,360),(rx+96,372),(rx+70,520),(rx-2,500)],fill=(13,13,19,235))
    # near thigh + shin over flank
    d.polygon([(rx-6,486),(rx+34,492),(rx-70,548),(rx-96,536)],fill=POR)             # thigh
    d.polygon([(rx-96,536),(rx-70,548),(rx-58,640),(rx-90,640)],fill=(150,148,150,255))# shin
    d.ellipse([rx-100,632,rx-58,664],fill=(20,20,26,255))                              # foot/stirrup
    # torso armor (rect chest, slight forward lean)
    d.polygon([(rx-40,372),(rx+44,360),(rx+54,500),(rx-34,500)],fill=(15,15,20,255))   # underlayer
    d.polygon([(rx-30,384),(rx+34,374),(rx+40,486),(rx-26,488)],fill=POR)              # chest plate
    d.line([(rx-26,488),(rx+40,486)],fill=(15,15,20,255),width=4)
    # near pauldron
    d.polygon([(rx-34,372),(rx+18,360),(rx+8,418),(rx-44,420)],fill=POR); d.polygon([(rx+18,360),(rx+8,418),(rx-12,410),(rx-2,366)],fill=(15,15,20,255))
    # near arm to blade grip
    seg((rx-30,400),(rx-86,470),18,(150,148,150)); d.ellipse([rx-104,456,rx-66,492],fill=POR)  # gauntlet
    # helmet (oversized) + 2 slits (violet)
    hcx,hcy=rx+2,316; hs=2.0
    helmP=[(-8,-52),(10,-50),(26,-34),(34,-16),(40,2),(34,18),(20,34),(6,46),(-8,48),(-24,34),(-36,10),(-40,-16),(-30,-42)]
    d.polygon([(hcx+x*hs,hcy+y*hs) for (x,y) in helmP],fill=POR)
    for sy in (-12,16):
        gg=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(gg).rounded_rectangle([hcx-40,hcy+sy-6,hcx+40,hcy+sy+6],radius=6,fill=(143,0,255,255)); gg=gg.filter(ImageFilter.GaussianBlur(5)); GL.append(gg)
    # ZENITH BLADE held upright at near side, butt resting on saddle, rising
    bx=rx-92; b_top=150; b_bot=540; bw=24
    d.polygon([(bx-bw,b_top),(bx+bw,b_top),(bx+bw,b_bot),(bx-bw,b_bot)],fill=(30,30,38,255)); d.polygon([(bx-bw,b_top),(bx-bw+8,b_top),(bx-bw+8,b_bot),(bx-bw,b_bot)],fill=POR)
    d.line([(bx+bw,b_top),(bx+bw,b_bot)],fill=STEEL_D+(220,),width=3)
    # docking plate
    d.polygon([(rx-60,500),(rx+108,496),(rx+98,534),(rx-70,538)],fill=(34,34,44,255))
    for g in GL: img=Image.alpha_composite(img.convert("RGBA"),g).convert("RGB")
    d=ImageDraw.Draw(img,"RGBA")
    # slit cores crisp
    for sy in (-12,16): d.rounded_rectangle([hcx-38,hcy+sy-4,hcx+38,hcy+sy+4],radius=4,fill=(150,0,255,255)); d.rounded_rectangle([hcx-38,hcy+sy-2,hcx+38,hcy+sy+2],radius=2,fill=(225,185,255,255))
    # ===== CG TEST annotation =====
    f=ImageFont.truetype("/tmp/spacemono400.ttf",30)
    cgx=cx+24  # combined CoG (mount center + rider over plate)
    for yy in range(330,gy,26): d.line([(cgx,yy),(cgx,yy+13)],fill=(120,200,160,220),width=3)  # dashed CG plumb
    d.ellipse([cgx-9,gy-9,cgx+9,gy+9],fill=(120,220,170,255))
    # support base bracket: front near hoof cx-170 .. hind near hoof cx+350
    fb,hb=cx-170,cx+350
    d.line([(fb,gy+30),(hb,gy+30)],fill=(120,200,160,200),width=3)
    d.line([(fb,gy+20),(fb,gy+40)],fill=(120,200,160,200),width=3); d.line([(hb,gy+20),(hb,gy+40)],fill=(120,200,160,200),width=3)
    d.text((cgx+16,gy-60),"CG", font=f, fill=(150,220,180,255))
    d.text((fb+90,gy+44),"vung do (4 mong)  —  CG nam trong: OK", font=ImageFont.truetype("/tmp/spacemono400.ttf",26), fill=(140,200,170,255))
    for _ in range(110):
        x=rng.uniform(0,W); y=rng.uniform(H*0.30,gy+90); s=rng.uniform(1,3.0); d.ellipse([x-s,y-s,x+s,y+s],fill=(220,218,222,int(rng.uniform(20,70))))
    vig=Image.new("L",(W,H),0); ImageDraw.Draw(vig).ellipse([-W*0.18,-H*0.18,W*1.18,H*1.18],fill=255); vig=vig.filter(ImageFilter.GaussianBlur(240))
    img=Image.composite(img,Image.new("RGB",(W,H),VOID),vig)
    arr=np.asarray(img).astype(np.int16); g=rng.normal(0,4.6,(H,W,1)).repeat(3,axis=2).astype(np.int16)
    img=Image.fromarray(np.clip(arr+g,0,255).astype(np.uint8))
    ImageDraw.Draw(img,"RGBA").rectangle([22,22,W-22,H-22],outline=(80,78,86,140),width=2)
    return img
render().save("/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_RIDER_MOUNT_TEST_V0_1.png")
Image.open("/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_RIDER_MOUNT_TEST_V0_1.png").resize((1600,900),Image.LANCZOS).save("/sessions/exciting-eloquent-dijkstra/mnt/outputs/RM_prev.png")
print("done")
