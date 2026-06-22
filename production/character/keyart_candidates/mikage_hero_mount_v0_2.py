import math, numpy as np
from PIL import Image, ImageDraw, ImageFilter
W,H=2400,1350
VOID=(5,5,8); STEEL=(150,150,158); STEEL_D=(94,94,102); BODY=(17,17,23); HUMP=(24,24,32)
POR=(236,232,228); POR_HI=(250,248,245); GRAPH=(28,28,36); UNDER=(15,15,20); VIOLET=(143,0,255)
rng=np.random.default_rng(808)
gy=int(H*0.80); cx=W*0.50
def render():
    grad=np.zeros((H,W,3),np.uint8)
    for y in range(H): t=y/H; grad[y,:]=(5+int(7*t),5+int(7*t),9+int(11*t))
    img=Image.fromarray(grad); d=ImageDraw.Draw(img,"RGBA")
    fog=Image.new("L",(W,H),0); ImageDraw.Draw(fog).rectangle([0,gy-240,W,gy+60],fill=130); fog=fog.filter(ImageFilter.GaussianBlur(90))
    img=Image.composite(Image.new("RGB",(W,H),(16,16,22)),img,fog); d=ImageDraw.Draw(img,"RGBA")
    d.rectangle([0,gy,W,H],fill=(7,7,11,255)); d.line([(0,gy),(W,gy)],fill=(30,30,40,140),width=2)
    SH=[]; VGL=[]
    def seg(p0,p1,w,c): d.line([p0,p1],fill=c+(255,),width=w)
    def joint(x,y,r,c=STEEL): d.ellipse([x-r,y-r,x+r,y+r],fill=c+(255,)); d.ellipse([x-r*0.4,y-r*0.4,x+r*0.4,y+r*0.4],fill=(34,34,44,255))
    def hoof(fx,big=1.0,near=True,vio=False):
        s=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(s).ellipse([fx-60*big,gy-6,fx+60*big,gy+22],fill=(0,0,0,165 if near else 110)); s=s.filter(ImageFilter.GaussianBlur(13)); SH.append(s)
        w=20*big; d.polygon([(fx-w,gy-42),(fx+w,gy-42),(fx+w*0.62,gy+6),(fx-w*0.62,gy+6)],fill=(20,20,26,255)); d.line([(fx-w,gy-42),(fx-w*0.62,gy+6)],fill=STEEL_D+(200,),width=3)
        if vio:
            g=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(g).ellipse([fx-15,gy-4,fx+15,gy+8],fill=(143,0,255,140)); VGL.append(g.filter(ImageFilter.GaussianBlur(5)))
    def legF(x,col,ec,near,bend=0):
        kx,ky=x-6+bend,878; seg((x,706),(kx,ky),26 if near else 18,col); joint(kx,ky,16 if near else 11,ec); seg((kx,ky),(x-2+bend,gy-42),17 if near else 12,col); d.line([(kx-10,ky+8),(kx-14+bend,gy-52)],fill=STEEL_D+(150,),width=4)
    def legH(x,col,ec,near):
        sx,sy=x+44,852; hx,hy=x-2,956; seg((x,712),(sx,sy),24 if near else 18,col); joint(sx,sy,15 if near else 11,ec); seg((sx,sy),(hx,hy),18 if near else 13,col); joint(hx,hy,13 if near else 10,ec); seg((hx,hy),(hx+20,gy-42),15 if near else 11,col); d.line([(hx+6,hy+6),(hx+24,gy-52)],fill=STEEL_D+(150,),width=4)
    # --- STEED (locked V0.5, unchanged) ---
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
    d.line([(hx-98*sc,hyy+12*sc),(hx-44*sc,hyy+2*sc)],fill=(40,40,50,255),width=9)
    ghd=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(ghd).line([(hx-94*sc,hyy+11*sc),(hx-48*sc,hyy+2*sc)],fill=(143,0,255,230),width=6); VGL.append(ghd.filter(ImageFilter.GaussianBlur(5)))
    legF(cx-170,BODY,STEEL,True,bend=0); legH(cx+330,BODY,STEEL,True); hoof(cx-170,1.5,True,vio=True); hoof(cx+350,1.4,True,vio=True)
    for s in SH: img=Image.alpha_composite(img.convert("RGBA"),s).convert("RGB")
    d=ImageDraw.Draw(img,"RGBA")
    # ===== CONTACT shadow on mount back under rider =====
    cs=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(cs).ellipse([cx-70,498,cx+150,548],fill=(0,0,0,150)); cs=cs.filter(ImageFilter.GaussianBlur(12)); img=Image.alpha_composite(img.convert("RGBA"),cs).convert("RGB"); d=ImageDraw.Draw(img,"RGBA")
    # ===== RIDER = full Mikage V0.4 silhouette, seated (helmet -7%) =====
    sx=cx+30
    # far leg sliver (other side of barrel) -> "ôm hai bên"
    d.polygon([(sx+78,492),(sx+104,500),(sx+92,604),(sx+66,600)],fill=(120,118,124,255))
    # HAIR heavy mass behind, down past back (not over slit which faces LEFT)
    d.polygon([(sx+30,318),(sx+92,352),(sx+150,520),(sx+118,612),(sx+74,560),(sx+44,438)],fill=(9,9,13,255))
    # MANTLE V-taper behind shoulders
    d.polygon([(sx-12,356),(sx+92,368),(sx+74,520),(sx-2,506)],fill=(13,13,19,235))
    # NEAR leg thigh+shin hugging near flank
    d.polygon([(sx-8,486),(sx+36,494),(sx-78,556),(sx-104,542)],fill=GRAPH)          # thigh underlayer
    d.polygon([(sx-4,492),(sx+30,498),(sx-66,548),(sx-92,536)],fill=POR)             # thigh plate
    d.polygon([(sx-92,536),(sx-66,548),(sx-54,648),(sx-88,648)],fill=(150,148,150,255)) # shin
    d.ellipse([sx-98,640,sx-54,672],fill=(20,20,26,255))
    # thigh contact shadow on barrel
    ts=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(ts).ellipse([sx-96,540,sx+10,576],fill=(0,0,0,120)); ts=ts.filter(ImageFilter.GaussianBlur(10)); img=Image.alpha_composite(img.convert("RGBA"),ts).convert("RGB"); d=ImageDraw.Draw(img,"RGBA")
    # TORSO: graphite underlayer + porcelain chest plate + abdomen segs
    d.polygon([(sx-42,372),(sx+50,360),(sx+58,498),(sx-36,500)],fill=UNDER)
    d.polygon([(sx-30,386),(sx+38,376),(sx+44,470),(sx-24,474)],fill=POR)
    d.line([(sx-30,392),(sx+34,384)],fill=POR_HI+(150,),width=2)                     # top highlight
    for k in range(2):
        yy=470+k*16; d.polygon([(sx-24,yy),(sx+40,yy),(sx+34,yy+12),(sx-18,yy+12)],fill=(40,40,50,255))
    # PAULDRONS (near clear white + far hint)
    d.polygon([(sx+44,360),(sx+74,366),(sx+64,408),(sx+30,406)],fill=(150,148,150,255))   # far pauldron hint
    d.polygon([(sx-40,366),(sx+16,356),(sx+8,414),(sx-50,416)],fill=POR)                   # near pauldron
    d.polygon([(sx+16,356),(sx+8,414),(sx-12,408),(sx-2,360)],fill=UNDER)
    d.line([(sx-40,366),(sx+16,356)],fill=POR_HI+(150,),width=2)
    # NEAR arm bent -> gauntlet grip on blade hilt
    seg((sx-26,398),(sx-78,452),17,(150,148,150)); seg((sx-78,452),(sx-118,476),15,(150,148,150))
    d.ellipse([sx-134,462,sx-100,498],fill=POR)                                            # gauntlet
    d.ellipse([sx-128,468,sx-106,492],fill=(150,148,150,255))
    # HELMET (-7%: hs 1.86) + slits
    hcx,hcy=sx+4,312; hs=1.86
    helmP=[(-8,-52),(10,-50),(26,-34),(34,-16),(40,2),(34,18),(20,34),(6,46),(-8,48),(-24,34),(-36,10),(-40,-16),(-30,-42)]
    d.polygon([(hcx+x*hs,hcy+y*hs) for (x,y) in helmP],fill=POR)
    d.polygon([(hcx+x*hs,hcy+y*hs) for (x,y) in helmP if y>2],fill=(214,210,206,150))
    slity=[hcy-12,hcy+18]
    for syv in slity:
        g=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(g).rounded_rectangle([hcx-38,syv-6,hcx+38,syv+6],radius=6,fill=(143,0,255,255)); VGL.append(g.filter(ImageFilter.GaussianBlur(5)))
    # ZENITH BLADE separated LEFT of helmet, base resting on docking bracket, clear grip
    bx=sx-118; bw=24; b_top=176; b_bot=520
    d.rectangle([bx-bw-8,508,bx+bw+8,536],fill=(36,36,46,255))                              # docking bracket/holster
    d.polygon([(bx-bw,b_top),(bx+bw,b_top),(bx+bw,b_bot),(bx-bw,b_bot)],fill=GRAPH)
    d.polygon([(bx-bw,b_top),(bx-bw+9,b_top),(bx-bw+9,b_bot),(bx-bw,b_bot)],fill=POR)
    d.line([(bx,b_top+16),(bx,b_bot-10)],fill=(60,60,72,180),width=2)
    d.line([(bx+bw,b_top),(bx+bw,b_bot)],fill=STEEL_D+(220,),width=3)
    d.rectangle([bx-bw-14,468,bx+bw+6,492],fill=(150,148,150,255))                          # cross-guard at grip
    # docking plate
    d.polygon([(sx-60,500),(sx+108,496),(sx+98,534),(sx-70,538)],fill=(34,34,44,255))
    # ===== LIGHTING PASS (low-key cool) =====
    arr=np.asarray(img).astype(np.float32); yy,xx=np.mgrid[0:H,0:W]
    Lx=1.0-(xx/W-0.32)*0.40-(yy/H-0.20)*0.16; Lx=np.clip(Lx,0.64,1.16)[...,None]; arr=arr*Lx
    shm=np.clip(1.0-arr.mean(2,keepdims=True)/120,0,1); arr[...,2]+=shm[...,0]*7; arr[...,0]-=shm[...,0]*3
    img=Image.fromarray(np.clip(arr,0,255).astype(np.uint8)); d=ImageDraw.Draw(img,"RGBA")
    # RIM (cool) head/hair/withers/croup/chest
    rl=(152,162,196)
    d.line([(cx+340,492),(cx+430,540)],fill=rl+(150,),width=3); d.line([(cx-300,496),(cx-150,440)],fill=rl+(120,),width=3)
    d.line([(sx+92,352),(sx+150,520)],fill=rl+(150,),width=3)                                # hair back rim
    d.line([(hcx+30*hs,hcy-30*hs),(hcx+40*hs,hcy)],fill=rl+(150,),width=2)                   # helmet rim
    d.line([(sx+38,376),(sx+44,470)],fill=rl+(130,),width=2)                                 # chest rim
    # ===== violet on top =====
    for g in VGL: img=Image.alpha_composite(img.convert("RGBA"),g).convert("RGB")
    d=ImageDraw.Draw(img,"RGBA")
    for syv in slity:
        d.rounded_rectangle([hcx-36,syv-4,hcx+36,syv+4],radius=4,fill=(150,0,255,255)); d.rounded_rectangle([hcx-36,syv-2,hcx+36,syv+2],radius=2,fill=(225,185,255,255))
    d.line([(hx-92*sc,hyy+11*sc),(hx-48*sc,hyy+2*sc)],fill=(210,170,255,255),width=2)
    for _ in range(110):
        x=rng.uniform(0,W); y=rng.uniform(H*0.30,gy+90); s=rng.uniform(1,3.0); d.ellipse([x-s,y-s,x+s,y+s],fill=(220,218,222,int(rng.uniform(20,66))))
    vig=Image.new("L",(W,H),0); ImageDraw.Draw(vig).ellipse([-W*0.18,-H*0.18,W*1.18,H*1.18],fill=255); vig=vig.filter(ImageFilter.GaussianBlur(240))
    img=Image.composite(img,Image.new("RGB",(W,H),VOID),vig)
    arr=np.asarray(img).astype(np.int16); g=rng.normal(0,4.4,(H,W,1)).repeat(3,axis=2).astype(np.int16)
    img=Image.fromarray(np.clip(arr+g,0,255).astype(np.uint8))
    ImageDraw.Draw(img,"RGBA").rectangle([22,22,W-22,H-22],outline=(80,78,86,140),width=2)
    return img
render().save("/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_HERO_MOUNT_V0_2.png")
Image.open("/sessions/exciting-eloquent-dijkstra/mnt/outputs/MIKAGE_HERO_MOUNT_V0_2.png").resize((1600,900),Image.LANCZOS).save("/sessions/exciting-eloquent-dijkstra/mnt/outputs/HM2_prev.png")
print("done")
