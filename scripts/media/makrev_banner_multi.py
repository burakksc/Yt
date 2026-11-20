import cv2, numpy as np, runpy
D='/tmp/claude-0/-home-user-Yt/c0ed126b-6344-535b-9708-226fcfc689ac/scratchpad/'
TW,TH,VIS=2016,430,366
g=runpy.run_path(D+'makrev_base.py'); ext,P=g['ext'],g['P']
BEIGE=np.median(cv2.imread(D+'makrev/orig.jpg')[0:300,0:300].reshape(-1,3),0).astype(np.float32)
def cutout(path):
    im=cv2.imread(path).astype(np.float32)
    bg=np.median(np.concatenate([im[:20].reshape(-1,3),im[-20:].reshape(-1,3)]),0)
    n=np.clip(im/bg,0,1.3)
    diff=(np.abs(n-1).max(2)>0.06).astype(np.uint8)
    diff=cv2.morphologyEx(diff,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
    ys,xs=np.where(diff>0); y0,y1,x0,x1=ys.min(),ys.max(),xs.min(),xs.max()
    pad=15; y0=max(0,y0-pad);x0=max(0,x0-pad);y1=min(im.shape[0],y1+pad);x1=min(im.shape[1],x1+pad)
    return n[y0:y1,x0:x1]
def mainline(ang=18):
    M=cv2.getRotationMatrix2D((2500+P,1500+P),ang,1.0)
    tr=lambda p: cv2.transform((np.float32(p)*4+P)[None],M)[0]
    v=tr([[245,88],[400,80],[1195,505],[1185,585],[680,630],[185,395],[125,155],[205,150]])
    x0,y0=v.min(0)-180; x1,y1=v.max(0)+180
    s=1.0
    T=M.copy(); T[0,2]-=x0; T[1,2]-=y0
    w,h=int(x1-x0),int(y1-y0)
    o=cv2.warpAffine(ext,T,(w,h),flags=cv2.INTER_AREA,borderMode=cv2.BORDER_REPLICATE)
    n=np.clip(o/BEIGE,0,1.3)
    f=np.ones((h,w),np.float32); b=170
    r=np.linspace(0,1,b); f[:b]*=r[:,None]; f[-b:]*=r[::-1,None]; f[:,:b]*=r[None]; f[:,-b:]*=r[None,::-1]
    floor=np.median(n.reshape(-1,3),0)
    n=n/floor
    return n*f[...,None]+(1-f[...,None])
A=cutout(D+'mk2/automation.png'); B=cutout(D+'mk2/mrcw.png'); C=mainline()
def fit(n,h):
    s=h/n.shape[0]; return cv2.resize(n,(int(n.shape[1]*s),h),interpolation=cv2.INTER_AREA)
def place(canvas,n,x,y):
    h,w=n.shape[:2]; x=int(x); y=int(y)
    xa,ya=max(0,x),max(0,y); xb,yb=min(TW,x+w),min(TH,y+h)
    canvas[ya:yb,xa:xb]*=n[ya-y:yb-y,xa-x:xb-x]   # multiply: white/floor=1 -> keeps canvas
def fin(c):
    o=c*BEIGE
    o=cv2.addWeighted(o,1.5,cv2.GaussianBlur(o,(0,0),1.0),-0.5,0)
    return np.clip(o+np.random.default_rng(1).normal(0,0.6,o.shape),0,255).astype(np.uint8)
out={}
# 1 trio seamless
H=352
a,c,b=fit(A,int(H*0.92)),fit(C,H),fit(B,int(H*0.95))
tot=a.shape[1]+c.shape[1]+b.shape[1]; gap=(TW-tot)/4
cv=np.ones((TH,TW,3),np.float32); x=gap
for n,yo in ((a,(H-a.shape[0])/2+6),(c,5),(b,(H-b.shape[0])/2+6)):
    place(cv,n,x,yo); x+=n.shape[1]+gap
out['uclu']=fin(cv)
# 2 hero: main line large left-centre, two smaller systems stacked/staggered right
cv=np.ones((TH,TW,3),np.float32)
c2=fit(C,358); place(cv,c2,40,3)
a2=fit(A,190); b2=fit(B,205)
xr=40+c2.shape[1]+30
place(cv,a2,xr,8); place(cv,b2,TW-b2.shape[1]-30,150)
out['ana-hat-ve-sistemler']=fin(cv)
# 3 cards
cv=np.ones((TH,TW,3),np.float32)
cards=[a,c,b]; widths=[n.shape[1] for n in cards]
ch=340; scale=min(1,(TW-4*24)/sum(int(wd*ch/H) for wd in widths))
cw=[int(wd*ch/H*scale) for wd in widths]; gap=(TW-sum(cw))/4; x=gap
res=cv*BEIGE
for n,w_ in zip(cards,cw):
    nn=fit(n,int(ch*0.92))
    if nn.shape[1]>w_-24: nn=cv2.resize(nn,(w_-24,int(nn.shape[0]*(w_-24)/nn.shape[1])),interpolation=cv2.INTER_AREA)
    h_=nn.shape[0]
    card=np.ones((ch+10,w_,3),np.float32)*np.float32([246,246,244])
    yy=(ch+10-h_)//2; xx=(w_-nn.shape[1])//2
    card[yy:yy+h_,xx:xx+nn.shape[1]]*=nn*(BEIGE/BEIGE.mean())**0  # neutral card
    y0=8
    sh=np.zeros((TH,TW),np.float32); cv2.rectangle(sh,(int(x)+6,y0+10),(int(x)+w_+6,y0+ch+20),1,-1); sh=cv2.GaussianBlur(sh,(0,0),10)[...,None]
    res*=1-0.25*sh
    m=np.zeros((ch+10,w_),np.uint8); r=16
    cv2.rectangle(m,(r,0),(w_-r,ch+10),1,-1); cv2.rectangle(m,(0,r),(w_,ch+10-r),1,-1)
    for p in ((r,r),(w_-r,r),(r,ch+10-r),(w_-r,ch+10-r)): cv2.circle(m,p,r,1,-1)
    m=cv2.GaussianBlur(m.astype(np.float32),(0,0),0.8)[...,None]
    reg=res[y0:y0+ch+10,int(x):int(x)+w_]; reg[:]=reg*(1-m)+card*m
    x+=w_+gap
r_=cv2.addWeighted(res,1.5,cv2.GaussianBlur(res,(0,0),1.0),-0.5,0)
out['kartlar']=np.clip(r_,0,255).astype(np.uint8)
im4=cv2.imread(D+'../images/4.jpg').astype(np.float32)
sc=TW/im4.shape[1]
y1b=im4.shape[0]; y0b=int(y1b-TH/sc)-1
band=im4[y0b:y1b]
band=cv2.resize(band,(int(band.shape[1]*sc),int(band.shape[0]*sc)),interpolation=cv2.INTER_LANCZOS4)
cvb=np.zeros((TH,TW,3),np.float32)+np.median(band[:30].reshape(-1,3),0)
x0b=(TW-band.shape[1])//2
cvb[:]=cv2.resize(band,(TW,TH),interpolation=cv2.INTER_LANCZOS4)
cvb=cv2.addWeighted(cvb,1.4,cv2.GaussianBlur(cvb,(0,0),1.0),-0.4,0)
out['dev-harfler']=np.clip(cvb,0,255).astype(np.uint8)
sheet=[]
for k,v in out.items():
    cv2.imwrite(D+f'mk2/makrev-banner-2016x430-{k}.png',v)
    c_=v.copy(); cv2.line(c_,(0,366),(TW,366),(0,255,255),2); cv2.putText(c_,k,(20,420),0,1.0,(0,0,200),2); sheet+=[c_,np.zeros((16,TW,3),np.uint8)]
cv2.imwrite(D+'mk2/chk.jpg',np.vstack(sheet))
