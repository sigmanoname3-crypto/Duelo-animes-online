(function(R){
const G=250,D={jab:.3,heavy:.315,power:.7,throw:.55,ssj3:.8,dodge:.35,hit:.3,rasen:.55,nika:1,raio:.9,tail:.6,fuse:.9,fstrike:.5,rball:.5,torn:.8,acerto:.6},A={jab:.1,heavy:.105,power:.35,throw:.3,rasen:.3,raio:.6,tail:.3,fstrike:.2,rball:.2,torn:.5,acerto:.3},
ORB=30,BEAM=ORB*1.03,SHU=ORB*2,RASEN=ORB*2.4,DRAIN=.5,BAZ=ORB*.85,BAZR=240,NWAIT=10,NIKA_HP=.2,RAIO_COST=Math.round(70*.8),RAIO_DMG=80,TAIL_DMG=50,TAILR=135,DIN_HEAL=.4,MN_T=12,MN_DMG=4,MN_CD=1,MN_SPD=130,SWAPCD=3,BEN_EN=4,JV=520,JG=1500,AIR=45,PETRI_T=2,PETRI_DMG=10,GAZE_SPD=420,RAIO_SPD=340,HAKI_T=10,HAKI_M=1.3,PARAL_T=3.5,PARAL_SPD=320,PARAL_DMG=0,ACE_DMG=30,BALLS=2,BALL_BUFF=.2,BALL_SPD=520,ACE_SPD=330,TORN_T=15,TORN_DPS=2,GI=11,CH=[{n:'Goko',skill:'Kamehamehu',cost:50,sp:60,spName:'SSJ'},{n:'Narutu',skill:'Esfera Azul',cost:40,sp:80,spName:'Shuriken',sp2:70,sp2Name:'Rasen Shuriken'},{n:'Luffo',skill:'Bazuuka',cost:40,pass:'Haki do Armamento · Nika · Raio do Céu'},{n:'Diogo',skill:'Petrificar',cost:25,sp:100,spName:'Dinossauro',sp2:50,sp2Name:'Digos Sauros'},{n:'Vegetal',skill:'Galcku Roo',cost:50,sp:60},{n:'Girino',skill:'Paralisa',cost:30,sp:80,spName:'Tornadua',sp2:40,sp2Name:'Acerto'}];
const FU_T=40,FU_COST=0,FU_HP=2,FU_BASE=1.25,SP3C=25,RB_NORMAL=40,RB_EVIL=60,FZ=c=>c>3&&c<11,frz=f=>f.pt>0||f.pz>0||f.tw>0,evil=o=>o.ch===3||o.ch===6||o.ch===8||o.ch===9,
FCH=[{n:'Narugoko',skill:'Kameha-Rasengan',cost:40,sp:50,spName:'Modo Sábio Supremo',sp2:30,sp2Name:'Rajada Fundida'},
{n:'Gokuffo',skill:'Gomu Gomu Kamehameha',cost:40,sp:50,spName:'Nika Saiyajin',sp2:30,sp2Name:'Rajada Fundida'},
{n:'Diogoko',skill:'Kameha-Dino',cost:40,sp:50,spName:'Dino Super Saiyajin',sp2:30,sp2Name:'Rajada Fundida'},
{n:'Naruffo',skill:'Gomu Rasengan Gigante',cost:40,sp:50,spName:'Gear 5 Ninja',sp2:30,sp2Name:'Rajada Fundida'},
{n:'Narugo',skill:'Shuriken Jurássico',cost:40,sp:50,spName:'Rei Jurássico',sp2:30,sp2Name:'Rajada Fundida'},
{n:'Luffogo',skill:'Trovão Pré-Histórico',cost:40,sp:50,spName:'Gear 5 Dino',sp2:30,sp2Name:'Rajada Fundida'},
{n:'Godenot',skill:'Big Bang Kamehamehu',cost:40,sp:50,spName:'SSJB',sp2:30,sp2Name:'Rajada Fundida',sp3:25,sp3Name:'Bola Arco-Íris'}],
FV=[{buff:8,inv:0,heal:.1},{buff:5,inv:3,heal:0},{buff:6,inv:0,heal:.3},{buff:6,inv:2,heal:0},{buff:6,inv:0,heal:.25},{buff:5,inv:2,heal:.2},{buff:7,inv:2,heal:.2}],
FP=[{dmg:55,spd:270,w:34},{dmg:60,spd:420,w:30},{dmg:38,spd:300,w:32,pet:1.6},{dmg:68,spd:190,w:44},{dmg:42,spd:330,w:30,dr:45},{dmg:48,spd:480,w:28,pet:1.2},{dmg:75,spd:300,w:44}],
FIDX={'0,1':4,'0,2':5,'0,3':6,'1,2':7,'1,3':8,'2,3':9},
canF=(a,b)=>a.ch<4&&b.ch<4&&(!(a.v||b.v)||(a.ch===0&&b.ch===0&&!a.v!==!b.v)),
cof=f=>FZ(f.ch)?FCH[f.ch-4]:f.ch===GI?CH[5]:f.v?CH[4]:CH[f.ch],fuOf=(a,b)=>FIDX[Math.min(a,b)+','+Math.max(a,b)],
sp2c=f=>FZ(f.ch)?FCH[f.ch-4].sp2:f.ch===2?RAIO_COST:f.ch===GI?CH[5].sp2:CH[f.ch].sp2,hasSp2=f=>f.ch===1||f.ch===3||f.ch===GI||FZ(f.ch)||f.ch===2&&f.g5>0;
const mk=(x,dir,ch,i)=>({x,dir,ch,i,hp:250,mhp:250,tr:0,hk:0,haki:0,dy:0,nk1:0,g5:0,en:0,s:'idle',t:0,done:false,g:false,ph:0,mv:0,orb:0,y:0,vy:0,ov:0,inv:0});
const mkP=(x,dir,p,i)=>p===4?Object.assign(mk(x,dir,0,i),{v:1}):p===5?Object.assign(mk(x,dir,GI,i),{balls:BALLS,lost:[]}):mk(x,dir,p,i);
function hurt(o,d,src,rng,ng){
 if(o.s==='dodge'&&o.t<.25||o.s==='nika'||o.s==='fuse'||o.inv>0)return;
 if(frz(o)){o.hp=Math.max(0,o.hp-d);if(!(src.tr>0)&&!ng)src.en=Math.min(100,src.en+d*.6);return}
 if(o.g&&(src.x-o.x)*o.dir>0){d*=rng?.5:.2;if(!(o.tr>0))o.en=Math.min(100,o.en+3)}
 else if(!(o.ch===GI&&(o.s==='power'||o.s==='torn'||o.s==='acerto'))){o.s='hit';o.t=0;o.done=false;o.orb=0;o.x+=src.dir*(d>10?16:7)}
 o.hp=Math.max(0,o.hp-d);if(!(src.tr>0)&&!ng)src.en=Math.min(100,src.en+d*.6)}
function petrify(t,src){
 if(t.s==='dodge'&&t.t<.25||t.s==='nika'||t.s==='fuse'||t.inv>0||frz(t))return;
 if(t.g&&(src.x-t.x)*t.dir>0)return;
 t.pt=PETRI_T;t.s='idle';t.t=0;t.g=false;t.orb=0;t.done=false;
 t.hp=Math.max(0,t.hp-PETRI_DMG);if(!(src.tr>0))src.en=Math.min(100,src.en+PETRI_DMG*.6)}
function lostB(S,q){const o=S.f[q.ow];if(o&&o.ch===GI)(o.lost||(o.lost=[])).push({x:Math.max(20,Math.min(460,q.x)),y:q.y||G-84})}
function paralyze(t,src){
 if(t.s==='dodge'&&t.t<.25||t.s==='nika'||t.s==='fuse'||t.inv>0||frz(t))return;
 if(t.g&&(src.x-t.x)*t.dir>0)return;
 t.pz=PARAL_T;t.s='idle';t.t=0;t.g=false;t.orb=0;t.done=false;
 if(PARAL_DMG>0){t.hp=Math.max(0,t.hp-PARAL_DMG);if(!(src.tr>0))src.en=Math.min(100,src.en+PARAL_DMG*.6)}}
function tornado(t){
 if(t.s==='dodge'&&t.t<.25||t.s==='nika'||t.s==='fuse'||t.inv>0||t.tw>0)return false;
 t.tw=TORN_T;t.pz=0;t.pt=0;t.s='idle';t.t=0;t.g=false;t.orb=0;t.done=false;return true}
function swap(S,i){const a=S.f[i],b=S.bn[i];b.x=a.x;b.dir=a.dir;b.i=i;b.y=0;b.vy=0;b.s='idle';b.t=0;b.done=false;b.g=false;b.pt=0;b.pz=0;b.tw=0;a.pz=0;a.tw=0;a.i=i;a.s='idle';a.t=0;a.g=false;S.f[i]=b;S.bn[i]=a;(S.ex||(S.ex=[])).push({x:b.x,t:0,k:6})}
function mulOf(f){return(f.ch===GI?1+BALL_BUFF*(f.balls||0):1)*(f.tr>0?1.5:1)*(f.haki>0?HAKI_M:1)*(FZ(f.ch)?FU_BASE*(f.ov>0?1.4:1):1)}
function strike(f,o,S){
 const mul=mulOf(f);
 if(o.y>=AIR&&['tail','jab','heavy'].includes(f.s))return;
 if(f.s==='rball'){S.pr.push({x:f.x+f.dir*34,dir:f.dir,ow:f.i,k:6});return}
 if(f.s==='acerto'){S.pr.push({x:f.x+f.dir*30,y:G-128,vx:f.dir*140,vy:-170,dir:f.dir,ow:f.i,k:8,life:5});return}
 if(f.s==='torn'){(f.lost||(f.lost=[])).push({x:o.x,y:G-30});if(tornado(o))(S.ex||(S.ex=[])).push({x:o.x,t:0,k:11});return}
 if(f.s==='fstrike'){if((o.x-f.x)*f.dir>0&&Math.abs(o.x-f.x)<120&&o.y<AIR)hurt(o,38*mul,f);(S.ex||(S.ex=[])).push({x:f.x+f.dir*70,t:0,k:9,c:f.ch});return}
 if(f.s==='tail'){if((o.x-f.x)*f.dir>0&&Math.abs(o.x-f.x)<TAILR)hurt(o,TAIL_DMG*mul,f);return}
 if(f.s==='raio'){S.pr.push({x:f.x,y:20,dir:f.dir,ow:f.i,k:3,m:mul,life:5});return}
 if(f.s==='rasen'){S.pr.push({x:f.x+f.dir*40,dir:f.dir,ow:f.i,k:2,m:mul});return}
 if(f.s==='throw'){S.pr.push({x:f.x+f.dir*30,dir:f.dir,ow:f.i,k:1,m:mul});return}
 if(f.s==='power'){if(f.ch===GI){S.pr.push({x:f.x+f.dir*30,dir:f.dir,ow:f.i,k:7});return}if(FZ(f.ch)){S.pr.push({x:f.x+f.dir*34,dir:f.dir,ow:f.i,k:5,fz:f.ch,m:mul});return}if(f.ch===3){S.pr.push({x:f.x+f.dir*30,dir:f.dir,ow:f.i,k:4});return}if(f.ch===2){if(o.y<AIR&&(o.x-f.x)*f.dir>0&&Math.abs(o.x-f.x)<BAZR)hurt(o,BAZ*mul,f,1);return}if(f.ch===1)f.orb=6;else S.pr.push({x:f.x+f.dir*34,dir:f.dir,ow:f.i,m:mul,v:f.v?1:0});return}
 const orb=f.s==='jab'&&f.orb>0,r=orb?76:f.s==='jab'?66:80;
 if(orb)f.orb=0;
 if((o.x-f.x)*f.dir>0&&Math.abs(o.x-f.x)<r){orb?hurt(o,ORB*mul,f,1,1):hurt(o,(f.s==='jab'?4:7)*mul,f);if(f.ch===2&&f.haki<=0&&++f.hk>=4){f.hk=0;f.haki=HAKI_T}}}
function step(f,o,i,dt,S){
 f.t+=dt;f.ph+=dt;f.mv=0;if(f.y>0||f.vy>0){f.vy-=JG*dt;f.y+=f.vy*dt;if(f.y<=0){f.y=0;f.vy=0}}
 if(f.haki>0)f.haki=Math.max(0,f.haki-dt);if(f.inv>0)f.inv=Math.max(0,f.inv-dt);if(f.ov>0)f.ov=Math.max(0,f.ov-dt);
 if(f.tr>0){f.en=Math.max(0,f.en-DRAIN*dt);if(f.en<=0)f.tr=0}else f.en=Math.min(100,f.en+(FZ(f.ch)?9:6)*dt);if(f.orb>0)f.orb-=dt;
 if(frz(f)){if(f.ch===GI&&!f.done&&(f.s==='power'||f.s==='torn'||f.s==='acerto'))(f.lost||(f.lost=[])).push({x:f.x,y:G-30});f.pt=Math.max(0,(f.pt||0)-dt);f.pz=Math.max(0,(f.pz||0)-dt);f.tw=Math.max(0,(f.tw||0)-dt);f.g=false;f.s='idle';f.t=0;f.done=false;f.dir=o.x>f.x?1:-1;return}
 if(f.s!=='idle'&&f.t>=D[f.s]){f.s='idle';f.t=0}
 f.g=false;
 if(f.s==='idle'||f.s==='hit'){
  if(f.s==='idle'){f.dir=o.x>f.x?1:-1;
  if(i.g)f.g=true;else{const m=(i.r?1:0)-(i.l?1:0);f.x+=m*105*dt;f.mv=m*f.dir}}
  const c=cof(f).cost;
  if(i.ju&&f.s==='idle'&&!(f.y>0)){f.vy=JV;f.y=.01}
  if(i.d&&f.s==='idle'){const m=(i.r?1:0)-(i.l?1:0);f.dx=m||-f.dir;f.s='dodge';f.t=0;f.done=false}
  else if(i.pw&&f.en>=c&&!(f.ch===1&&f.orb>0)&&!(f.ch===GI&&(f.balls<1||o.pz>0||o.tw>0))){f.en-=c;if(f.ch===GI)f.balls--;f.s='power';f.t=0;f.done=false}
  else if(i.sp&&f.ch===0&&!f.v&&f.tr<=0&&f.en>=CH[0].sp){f.en-=CH[0].sp;f.tr=1;f.s='ssj3';f.t=0;f.done=false}
  else if(i.sp&&f.ch===1&&f.en>=CH[1].sp){f.en-=CH[1].sp;f.s='throw';f.t=0;f.done=false}
  else if(i.sp2&&f.ch===1&&f.en>=CH[1].sp2){f.en-=CH[1].sp2;f.s='rasen';f.t=0;f.done=false}
  else if(i.sp&&f.ch===3&&!f.din&&f.en>=CH[3].sp){f.en-=CH[3].sp;f.din=1;f.hp=Math.min(f.mhp,f.hp+f.mhp*DIN_HEAL);f.s='ssj3';f.t=0;f.done=false;const mn=S.mn||(S.mn=[]);for(const k of[-1,1])mn.push({x:f.x-f.dir*(k<0?50:90),dir:f.dir,ow:f.i,t:MN_T,cd:.6,bt:0,mv:0,sd:k<0?34:48})}
  else if(i.sp2&&f.ch===3&&f.en>=CH[3].sp2){f.en-=CH[3].sp2;f.s='tail';f.t=0;f.done=false}
  else if(i.sp2&&f.ch===2&&f.g5&&f.en>=RAIO_COST){f.en-=RAIO_COST;f.s='raio';f.t=0;f.done=false}
  else if(i.sp2&&f.ch===GI&&f.balls>0&&f.en>=CH[5].sp2){f.en-=CH[5].sp2;f.balls--;f.s='acerto';f.t=0;f.done=false}
  else if(i.sp&&f.ch===GI&&f.balls>0&&f.en>=CH[5].sp&&!(o.tw>0)){f.en-=CH[5].sp;f.balls--;f.s='torn';f.t=0;f.done=false}
  else if(i.sp&&FZ(f.ch)&&f.en>=cof(f).sp){const v=FV[f.ch-4];f.en-=cof(f).sp;f.s='ssj3';f.t=0;f.done=false;f.ov=v.buff;f.inv=v.inv;f.hp=Math.min(f.mhp,f.hp+f.mhp*v.heal)}
  else if(i.sp2&&FZ(f.ch)&&f.en>=cof(f).sp2){f.en-=cof(f).sp2;f.s='fstrike';f.t=0;f.done=false}
  else if(i.sp3&&f.ch===10&&f.en>=SP3C){f.en-=SP3C;f.s='rball';f.t=0;f.done=false}
  else if(i.hv){f.s='heavy';f.t=0;f.done=false}
  else if(i.jb){f.s='jab';f.t=0;f.done=false}}
 if(f.s==='dodge'&&f.t<.25)f.x+=(f.dx||-f.dir)*230*dt;
 if(A[f.s]!==undefined&&!f.done&&f.t>=A[f.s]){f.done=true;strike(f,o,S)}
 if(f.ch===GI&&f.g&&f.lost&&f.lost.length){for(const b of f.lost)S.pr.push({x:b.x,y:b.y,dir:f.dir,ow:f.i,k:9,life:3});f.lost=[]}
 f.x=Math.max(28,Math.min(452,f.x))}
function aiF(f,o,dt){
 const i={},d=Math.abs(f.x-o.x),tw=o.x>f.x?'r':'l',aw=tw==='r'?'l':'r',C=cof(f);
 f.ct=(f.ct||0)-dt;
 if(f.ct<=0){f.ct=.25+Math.random()*.35;const r=Math.random();f.plan=d>85?(r<.7?'in':'pw'):d<50?(r<.35?'out':'atk'):(r<.6?'atk':r<.8?'g':'in');
  if(f.en>=C.cost&&d>60&&Math.random()<.45)f.plan='pw';if(f.en>=C.sp&&!(f.ov>0)&&Math.random()<.3)f.plan='sp';if(f.en>=C.sp2&&d<110&&Math.random()<.45)f.plan='q';if(f.ch===10&&f.en>=SP3C&&d>60&&Math.random()<.4)f.plan='r'}
 if(['jab','heavy','power','fstrike'].includes(o.s)){if(!f.seen){f.seen=1;if(d<100&&Math.random()<.4)f.gt=.45}}else f.seen=0;
 if(f.gt>0){f.gt-=dt;i.g=1;return i}
 if(f.plan==='in')i[tw]=d>70;else if(f.plan==='out')i[aw]=1;else if(f.plan==='g')i.g=1;
 else if(f.plan==='atk'&&d<80){i[Math.random()<.5?'jb':'hv']=1;f.ct=.5}
 else if(f.plan==='sp'){i.sp=1;f.plan='in'}else if(f.plan==='pw'){i.pw=1;f.plan='in'}else if(f.plan==='q'){i.sp2=1;f.plan='in'}else if(f.plan==='r'){i.sp3=1;f.plan='in'}
 return i}
function aiG(f,o,dt){
 const i={},d=Math.abs(f.x-o.x),tw=o.x>f.x?'r':'l',aw=tw==='r'?'l':'r',C=CH[5],hold=o.tw>0||o.pz>0;
 f.ct=(f.ct||0)-dt;
 if(f.ct<=0){f.ct=.25+Math.random()*.35;const r=Math.random();
  f.plan=hold?(d>70?'in':'atk'):d>85?(r<.7?'in':'pw'):d<50?(r<.35?'out':'atk'):(r<.6?'atk':r<.8?'g':'in');
  if(!hold&&f.balls>0){if(f.en>=C.sp2&&d>50&&Math.random()<.4)f.plan='q';if(f.en>=C.cost&&d>60&&Math.random()<.5)f.plan='pw';if(f.en>=C.sp&&Math.random()<.5)f.plan='sp'}
  if(f.balls<1&&f.lost&&f.lost.length)f.plan='g'}
 if(!hold&&['jab','heavy','power','fstrike'].includes(o.s)){if(!f.seen){f.seen=1;if(d<100&&Math.random()<.4)f.gt=.45}}else f.seen=0;
 if(f.gt>0){f.gt-=dt;i.g=1;return i}
 if(f.plan==='in')i[tw]=d>70;else if(f.plan==='out')i[aw]=1;else if(f.plan==='g')i.g=1;
 else if(f.plan==='atk'){if(d<80){i[Math.random()<.5?'jb':'hv']=1;f.ct=.5}else i[tw]=1}
 else if(f.plan==='sp'){i.sp=1;f.plan='in'}else if(f.plan==='pw'){i.pw=1;f.plan='in'}else if(f.plan==='q'){i.sp2=1;f.plan='in'}
 return i}
function ai(f,o,dt){
 if(f.ch===GI)return aiG(f,o,dt);
 if(FZ(f.ch))return aiF(f,o,dt);
 const i={},d=Math.abs(f.x-o.x),tw=o.x>f.x?'r':'l',aw=tw==='r'?'l':'r',c=CH[f.ch].cost;
 if(f.dy>0){f.dw=(f.dw||0)+dt;if(f.dw>.8)i.nk=1;return i}f.dw=0;
 f.ct=(f.ct||0)-dt;
 if(f.ct<=0){f.ct=.25+Math.random()*.4;const r=Math.random();
  f.plan=d>85?(r<.75?'in':'pw'):d<50?(r<.4?'out':'atk'):(r<.6?'atk':r<.8?'g':'in');
  if(d>70&&Math.random()<.08)f.plan='j';if(f.en>=c&&f.orb<=0&&(f.ch===1||d>60&&(f.ch!==2||d<230))&&Math.random()<.35)f.plan='pw';if(f.ch===0&&!f.v&&f.tr<=0&&f.en>=CH[0].sp&&d<160&&Math.random()<.5)f.plan='sp';if(f.ch===1&&f.en>=CH[1].sp&&f.orb<=0&&d>60&&Math.random()<.5)f.plan='sp';if(f.ch===1&&f.en>=CH[1].sp2&&f.orb<=0&&d>50&&Math.random()<.4)f.plan='q';if(f.ch===2&&f.g5&&f.en>=RAIO_COST&&Math.random()<.4)f.plan='q';if(f.ch===3&&!f.din&&f.en>=CH[3].sp&&Math.random()<.8)f.plan='sp';if(f.ch===3&&f.en>=CH[3].sp2&&d<TAILR-15&&Math.random()<.6)f.plan='q'}
 if(['jab','heavy','power'].includes(o.s)){if(!f.seen){f.seen=1;if(d<100&&Math.random()<.45)f.gt=.45}}else f.seen=0;
 if(f.gt>0){f.gt-=dt;i.g=1;return i}
 if(f.ch===1&&f.orb>0){if(d<74)i.jb=1;else i[tw]=1;return i}
 if(f.plan==='in')i[tw]=d>70;
 else if(f.plan==='j'){i.ju=1;i[tw]=1;f.plan='in'}
 else if(f.plan==='out')i[aw]=1;
 else if(f.plan==='g')i.g=1;
 else if(f.plan==='atk'&&d<80){i[Math.random()<.5?'jb':'hv']=1;f.ct=.5}
 else if(f.plan==='sp'){if(f.en>=CH[f.ch].sp)i.sp=1;f.plan='in'}
 else if(f.plan==='pw'){if(f.en>=c&&f.orb<=0&&(f.ch!==2||d<235))i.pw=1;f.plan='in'}
 else if(f.plan==='q'){if(f.en>=sp2c(f))i.sp2=1;f.plan='in'}
 return i}
function nika(f){f.dy=0;f.hp=f.mhp*NIKA_HP;f.g5=1;f.s='nika';f.t=0;f.done=false;f.g=false}
function fuse(S,i){
 const a=S.f[i],b=S.bn[i],k=(a.ch===0&&b.ch===0)?10:fuOf(a.ch,b.ch),F=mk(a.x,a.dir,k,i);
 F.y=a.y||0;F.vy=a.vy||0;F.mhp=(a.mhp+b.mhp)*FU_HP;F.hp=Math.min(F.mhp,(a.hp+b.hp)*FU_HP);F.en=Math.min(100,Math.max(0,a.en-FU_COST)+30);F.s='fuse';F.t=0;F.done=false;
 const ph=mk(F.x,F.dir,b.ch,i);ph.hp=0;
 S.fz[i]={a,b,t:FU_T};S.fu1[i]=1;S.f[i]=F;S.bn[i]=ph;(S.ex||(S.ex=[])).push({x:F.x,t:0,k:8,c:k})}
function unfuse(S,i){
 const z=S.fz[i],F=S.f[i],sum=Math.max(1,z.a.hp+z.b.hp),r=Math.max(.01,F.hp/(sum*FU_HP));
 for(const c of[z.a,z.b]){c.hp=Math.max(1,Math.min(c.mhp,c.hp*r));c.x=F.x;c.dir=F.dir;c.y=F.y||0;c.vy=F.vy||0;c.s='idle';c.t=0;c.done=false;c.g=false;c.pt=0;c.pz=0;c.tw=0;c.orb=0;c.i=i}
 z.a.en=Math.min(100,F.en);z.b.en=Math.min(100,F.en*.5);
 S.f[i]=z.a;S.bn[i]=z.b;S.fz[i]=null;(S.sc||(S.sc=[0,0]))[i]=SWAPCD;(S.ex||(S.ex=[])).push({x:F.x,t:0,k:8,c:0})}
function tick(S,a,b,dt){
 let p=S.f[0],e=S.f[1];const dyf=S.f.find(f=>f.dy>0);
 if(dyf){if((dyf.i===0?a:b).nk)nika(dyf);else if((dyf.dy-=dt)<=0){dyf.dy=0;S.over=1;S.win=1-dyf.i}return}
 if(S.bn){S.fz=S.fz||[null,null];S.fu1=S.fu1||[0,0];
  for(const i of[0,1]){const z=S.fz[i],f0=S.f[i];
   if(z){if((z.t-=dt)<=0&&f0.s!=='fuse')unfuse(S,i)}
   else if((i?b:a).fu&&!S.fu1[i]&&canF(f0,S.bn[i])&&f0.s==='idle'&&!frz(f0)&&f0.en>=FU_COST&&S.bn[i].hp>0)fuse(S,i)}
  const sc=S.sc||(S.sc=[0,0]);for(const i of[0,1]){sc[i]=Math.max(0,sc[i]-dt);const f=S.f[i],bn=S.bn[i];bn.en=Math.min(100,bn.en+BEN_EN*dt);if((i?b:a).tg&&sc[i]<=0&&f.s==='idle'&&!frz(f)&&bn.hp>0){swap(S,i);sc[i]=SWAPCD}}p=S.f[0];e=S.f[1]}
 step(p,e,a,dt,S);step(e,p,b,dt,S);
 for(const f of S.f)if(f.tw>0)f.hp=Math.max(0,f.hp-TORN_DPS*dt);
 const d=e.x-p.x;if(Math.abs(d)<34){const s=Math.sign(d)||1,m=(34-Math.abs(d))/2;p.x-=s*m;e.x+=s*m}
 S.mn=(S.mn||[]).filter(m=>{const t=S.f[1-m.ow];if((m.t-=dt)<=0)return false;m.mv=0;if(m.bt>0)m.bt-=dt;if(m.cd>0)m.cd-=dt;if(t.hp<=0)return true;
  const dx=t.x-m.x;m.dir=dx>=0?1:-1;
  if(Math.abs(dx)>m.sd){m.x+=m.dir*MN_SPD*dt;m.mv=1}
  else if(m.cd<=0&&!(t.y>=AIR)){m.cd=MN_CD;m.bt=.3;hurt(t,MN_DMG,{x:m.x,dir:m.dir,en:0,tr:0},0,1);(S.ex||(S.ex=[])).push({x:t.x,t:0,k:5})}
  m.x=Math.max(28,Math.min(452,m.x));return true});
 S.ex=(S.ex||[]).filter(e=>(e.t+=dt)<(e.k===8?1.2:e.k===11?.9:.4));
 S.pr=S.pr.filter(q=>{
  const t=S.f[1-q.ow],air=t.y>=AIR;
  if(q.k===1){q.x+=q.dir*200*dt;
   if((Math.abs(q.x-t.x)<28&&!air)||q.x<20||q.x>460){S.ex.push({x:q.x,t:0});if(Math.abs(q.x-t.x)<50&&!air)hurt(t,SHU*(q.m||1),S.f[q.ow],1,1);return false}
   return true}
  if(q.k===2){q.x+=q.dir*280*dt;if(Math.abs(q.x-t.x)<34&&!air){S.ex.push({x:q.x,t:0});hurt(t,RASEN*(q.m||1),S.f[q.ow],1,1);return false}
   if(q.x<20||q.x>460){S.ex.push({x:q.x,t:0});return false}return true}
  if(q.k===9){const f0=S.f[q.ow],hx=f0.x+f0.dir*16,hy=G-86,dx=hx-q.x,dy=hy-q.y,L=Math.hypot(dx,dy)||1,st=BALL_SPD*dt;
   if(L<=Math.max(14,st)){if(f0.ch===GI)f0.balls=Math.min(BALLS,(f0.balls||0)+1);return false}
   q.x+=dx/L*st;q.y+=dy/L*st;return(q.life-=dt)>0}
  if(q.k===8){const ty=G-84,dx=t.x-q.x,dy=ty-q.y,L=Math.hypot(dx,dy)||1,k=Math.min(1,5*dt);
   q.vx+=(dx/L*ACE_SPD-q.vx)*k;q.vy+=(dy/L*ACE_SPD-q.vy)*k;q.x+=q.vx*dt;q.y+=q.vy*dt;
   if(Math.hypot(t.x-q.x,ty-q.y)<26){S.ex.push({x:q.x,t:0,k:10});hurt(t,ACE_DMG,S.f[q.ow],1,1);lostB(S,q);return false}
   if((q.life-=dt)>0)return true;lostB(S,q);return false}
  if(q.k===7){q.x+=q.dir*PARAL_SPD*dt;
   if(Math.abs(q.x-t.x)<24&&!air){S.ex.push({x:q.x,t:0,k:10});paralyze(t,S.f[q.ow]);lostB(S,q);return false}
   if(q.x>-30&&q.x<510)return true;lostB(S,q);return false}
  if(q.k===6){q.x+=q.dir*260*dt;
   if(Math.abs(q.x-t.x)<24&&!air){S.ex.push({x:q.x,t:0,k:9,c:10});hurt(t,evil(t)?RB_EVIL:RB_NORMAL,S.f[q.ow],1,1);return false}
   return q.x>-30&&q.x<510}
  if(q.k===5){const v=FP[q.fz-4];q.x+=q.dir*v.spd*dt;
   if(Math.abs(q.x-t.x)<v.w&&!air){S.ex.push({x:q.x,t:0,k:9,c:q.fz});hurt(t,v.dmg*(q.m||1),S.f[q.ow],1,1);
    if(v.pet){petrify(t,S.f[q.ow]);if(t.pt>0)t.pt=v.pet}if(v.dr)t.en=Math.max(0,t.en-v.dr);return false}
   return q.x>-30&&q.x<510}
  if(q.k===4){q.x+=q.dir*GAZE_SPD*dt;
   if(Math.abs(q.x-t.x)<30&&!air){S.ex.push({x:q.x,t:0,k:4});petrify(t,S.f[q.ow]);return false}
   return q.x>-30&&q.x<510}
  if(q.k===3){const tx=t.x,ty=G-84,dx=tx-q.x,dy=ty-q.y,L=Math.hypot(dx,dy)||1,st=RAIO_SPD*dt;
   if(L<30){S.ex.push({x:q.x,t:0,k:3});hurt(t,RAIO_DMG,S.f[q.ow],1,1);return false}
   q.x+=dx/L*Math.min(st,L);q.y+=dy/L*Math.min(st,L);return(q.life-=dt)>0}
  q.x+=q.dir*230*dt;
  if(Math.abs(q.x-t.x)<28&&!air){hurt(t,BEAM*(q.m||1),S.f[q.ow],1);return false}
  return q.x>-30&&q.x<510});
 for(const f of S.f)if(f.hp<=0&&f.ch===2&&!f.nk1){f.nk1=1;f.dy=NWAIT;f.s='hit';f.t=0;f.g=false}
 if(!S.f.some(f=>f.dy>0)){if(S.bn)for(const i of[0,1])if(S.f[i].hp<=0&&S.bn[i].hp>0)swap(S,i);
  if(S.f[0].hp<=0||S.f[1].hp<=0){S.over=1;S.win=S.f[1].hp<=0?0:1}}}
const api={FZ,PARAL_T,TORN_T,G,D,CH,mk,mkP,canF,SP3C,tick,ai,BAZR,RAIO_COST,sp2c,hasSp2,TAILR,FCH,FU_T,FU_COST,fuOf,chOf:cof};
if(typeof module!=='undefined')module.exports=api;else R.Game=api;
})(this);
