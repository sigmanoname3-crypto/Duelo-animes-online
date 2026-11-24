(function(R){
const G=250,D={jab:.3,heavy:.315,power:.7,throw:.55,ssj3:.8,dodge:.35,hit:.3,rasen:.55,nika:1},A={jab:.1,heavy:.105,power:.35,throw:.3,rasen:.3},
ORB=30,BEAM=ORB*1.03,SHU=ORB*2,RASEN=ORB*2.4,DRAIN=.5,BAZ=ORB*.85,BAZR=240,NWAIT=10,NIKA_HP=.2,HAKI_T=10,HAKI_M=1.3,CH=[{n:'Goko',skill:'Kamehamehu',cost:50,sp:60,spName:'SSJ3'},{n:'Narutu',skill:'Esfera Azul',cost:40,sp:80,spName:'Shuriken',sp2:70,sp2Name:'Rasen Shuriken'},{n:'Luffo',skill:'Bazuuka',cost:40,pass:'Haki do Armamento · Nika'}];
const mk=(x,dir,ch,i)=>({x,dir,ch,i,hp:200,mhp:200,tr:0,hk:0,haki:0,dy:0,nk1:0,g5:0,en:0,s:'idle',t:0,done:false,g:false,ph:0,mv:0,orb:0});
function hurt(o,d,src,rng,ng){
 if(o.s==='dodge'&&o.t<.25||o.s==='nika')return;
 if(o.g&&(src.x-o.x)*o.dir>0){d*=rng?.5:.2;if(!(o.tr>0))o.en=Math.min(100,o.en+3)}
 else{o.s='hit';o.t=0;o.done=false;o.orb=0;o.x+=src.dir*(d>10?16:7)}
 o.hp=Math.max(0,o.hp-d);if(!(src.tr>0)&&!ng)src.en=Math.min(100,src.en+d*.6)}
function mulOf(f){return(f.tr>0?1.5:1)*(f.haki>0?HAKI_M:1)}
function strike(f,o,S){
 const mul=mulOf(f);
 if(f.s==='rasen'){S.pr.push({x:f.x+f.dir*40,dir:f.dir,ow:f.i,k:2,m:mul});return}
 if(f.s==='throw'){S.pr.push({x:f.x+f.dir*30,dir:f.dir,ow:f.i,k:1,m:mul});return}
 if(f.s==='power'){if(f.ch===2){if((o.x-f.x)*f.dir>0&&Math.abs(o.x-f.x)<BAZR)hurt(o,BAZ*mul,f,1);return}if(f.ch===1)f.orb=6;else S.pr.push({x:f.x+f.dir*34,dir:f.dir,ow:f.i,m:mul});return}
 const orb=f.s==='jab'&&f.orb>0,r=orb?76:f.s==='jab'?66:80;
 if(orb)f.orb=0;
 if((o.x-f.x)*f.dir>0&&Math.abs(o.x-f.x)<r){orb?hurt(o,ORB*mul,f,1,1):hurt(o,(f.s==='jab'?4:7)*mul,f);if(f.ch===2&&f.haki<=0&&++f.hk>=4){f.hk=0;f.haki=HAKI_T}}}
function step(f,o,i,dt,S){
 f.t+=dt;f.ph+=dt;f.mv=0;if(f.haki>0)f.haki=Math.max(0,f.haki-dt);
 if(f.tr>0){f.en=Math.max(0,f.en-DRAIN*dt);if(f.en<=0)f.tr=0}else f.en=Math.min(100,f.en+6*dt);if(f.orb>0)f.orb-=dt;
 if(f.s!=='idle'&&f.t>=D[f.s]){f.s='idle';f.t=0}
 f.g=false;
 if(f.s==='idle'){
  f.dir=o.x>f.x?1:-1;
  if(i.g)f.g=true;else{const m=(i.r?1:0)-(i.l?1:0);f.x+=m*105*dt;f.mv=m*f.dir}
  const c=CH[f.ch].cost;
  if(i.d){f.s='dodge';f.t=0;f.done=false}
  else if(i.pw&&f.en>=c&&!(f.ch===1&&f.orb>0)){f.en-=c;f.s='power';f.t=0;f.done=false}
  else if(i.sp&&f.ch===0&&f.tr<=0&&f.en>=CH[0].sp){f.en-=CH[0].sp;f.tr=1;f.s='ssj3';f.t=0;f.done=false}
  else if(i.sp&&f.ch===1&&f.en>=CH[1].sp){f.en-=CH[1].sp;f.s='throw';f.t=0;f.done=false}
  else if(i.sp2&&f.ch===1&&f.en>=CH[1].sp2){f.en-=CH[1].sp2;f.s='rasen';f.t=0;f.done=false}
  else if(i.hv){f.s='heavy';f.t=0;f.done=false}
  else if(i.jb){f.s='jab';f.t=0;f.done=false}}
 if(f.s==='dodge'&&f.t<.25)f.x-=f.dir*230*dt;
 if(A[f.s]!==undefined&&!f.done&&f.t>=A[f.s]){f.done=true;strike(f,o,S)}
 f.x=Math.max(28,Math.min(452,f.x))}
function ai(f,o,dt){
 const i={},d=Math.abs(f.x-o.x),tw=o.x>f.x?'r':'l',aw=tw==='r'?'l':'r',c=CH[f.ch].cost;
 if(f.dy>0){f.dw=(f.dw||0)+dt;if(f.dw>.8)i.nk=1;return i}f.dw=0;
 f.ct=(f.ct||0)-dt;
 if(f.ct<=0){f.ct=.25+Math.random()*.4;const r=Math.random();
  f.plan=d>85?(r<.75?'in':'pw'):d<50?(r<.4?'out':'atk'):(r<.6?'atk':r<.8?'g':'in');
  if(f.en>=c&&f.orb<=0&&(f.ch===1||d>60&&(f.ch!==2||d<230))&&Math.random()<.35)f.plan='pw';if(f.ch===0&&f.tr<=0&&f.en>=CH[0].sp&&d<160&&Math.random()<.5)f.plan='sp';if(f.ch===1&&f.en>=CH[1].sp&&f.orb<=0&&d>60&&Math.random()<.5)f.plan='sp';if(f.ch===1&&f.en>=CH[1].sp2&&f.orb<=0&&d>50&&Math.random()<.4)f.plan='q'}
 if(['jab','heavy','power'].includes(o.s)){if(!f.seen){f.seen=1;if(d<100&&Math.random()<.45)f.gt=.45}}else f.seen=0;
 if(f.gt>0){f.gt-=dt;i.g=1;return i}
 if(f.ch===1&&f.orb>0){if(d<74)i.jb=1;else i[tw]=1;return i}
 if(f.plan==='in')i[tw]=d>70;
 else if(f.plan==='out')i[aw]=1;
 else if(f.plan==='g')i.g=1;
 else if(f.plan==='atk'&&d<80){i[Math.random()<.5?'jb':'hv']=1;f.ct=.5}
 else if(f.plan==='sp'){if(f.en>=CH[f.ch].sp)i.sp=1;f.plan='in'}
 else if(f.plan==='pw'){if(f.en>=c&&f.orb<=0&&(f.ch!==2||d<235))i.pw=1;f.plan='in'}
 else if(f.plan==='q'){if(f.en>=CH[f.ch].sp2)i.sp2=1;f.plan='in'}
 return i}
function nika(f){f.dy=0;f.hp=f.mhp*NIKA_HP;f.g5=1;f.s='nika';f.t=0;f.done=false;f.g=false}
function tick(S,a,b,dt){
 const p=S.f[0],e=S.f[1],dyf=S.f.find(f=>f.dy>0);
 if(dyf){if((dyf.i===0?a:b).nk)nika(dyf);else if((dyf.dy-=dt)<=0){dyf.dy=0;S.over=1;S.win=1-dyf.i}return}
 step(p,e,a,dt,S);step(e,p,b,dt,S);
 const d=e.x-p.x;if(Math.abs(d)<34){const s=Math.sign(d)||1,m=(34-Math.abs(d))/2;p.x-=s*m;e.x+=s*m}
 S.ex=(S.ex||[]).filter(e=>(e.t+=dt)<.4);
 S.pr=S.pr.filter(q=>{
  const t=S.f[1-q.ow];
  if(q.k===1){q.x+=q.dir*200*dt;
   if(Math.abs(q.x-t.x)<28||q.x<20||q.x>460){S.ex.push({x:q.x,t:0});if(Math.abs(q.x-t.x)<50)hurt(t,SHU*(q.m||1),S.f[q.ow],1,1);return false}
   return true}
  if(q.k===2){q.x+=q.dir*280*dt;if(Math.abs(q.x-t.x)<34){S.ex.push({x:q.x,t:0});hurt(t,RASEN*(q.m||1),S.f[q.ow],1,1);return false}
   if(q.x<20||q.x>460){S.ex.push({x:q.x,t:0});return false}return true}
  q.x+=q.dir*230*dt;
  if(Math.abs(q.x-t.x)<28){hurt(t,BEAM*(q.m||1),S.f[q.ow],1);return false}
  return q.x>-30&&q.x<510});
 for(const f of S.f)if(f.hp<=0&&f.ch===2&&!f.nk1){f.nk1=1;f.dy=NWAIT;f.s='hit';f.t=0;f.g=false}
 if(!S.f.some(f=>f.dy>0)&&(p.hp<=0||e.hp<=0)){S.over=1;S.win=e.hp<=0?0:1}}
const api={G,D,CH,mk,tick,ai,BAZR};
if(typeof module!=='undefined')module.exports=api;else R.Game=api;
})(this);
