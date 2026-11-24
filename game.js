(function(R){
const G=250,D={jab:.3,heavy:.315,power:.7,dodge:.35,hit:.3},A={jab:.1,heavy:.105,power:.35},
ORB=30,BEAM=ORB*1.03,CH=[{n:'Goko',skill:'Kamehamehu',cost:50},{n:'Narutu',skill:'Esfera Azul',cost:40}];
const mk=(x,dir,ch,i)=>({x,dir,ch,i,hp:150,mhp:150,en:0,s:'idle',t:0,done:false,g:false,ph:0,mv:0,orb:0});
function hurt(o,d,src,rng){
 if(o.s==='dodge'&&o.t<.25)return;
 if(o.g&&(src.x-o.x)*o.dir>0){d*=rng?.5:.2;o.en=Math.min(100,o.en+3)}
 else{o.s='hit';o.t=0;o.done=false;o.orb=0;o.x+=src.dir*(d>10?16:7)}
 o.hp=Math.max(0,o.hp-d);src.en=Math.min(100,src.en+d*.6)}
function strike(f,o,S){
 if(f.s==='power'){if(f.ch===1)f.orb=6;else S.pr.push({x:f.x+f.dir*34,dir:f.dir,ow:f.i});return}
 const orb=f.s==='jab'&&f.orb>0,r=orb?76:f.s==='jab'?66:80;
 if(orb)f.orb=0;
 if((o.x-f.x)*f.dir>0&&Math.abs(o.x-f.x)<r)orb?hurt(o,ORB,f,1):hurt(o,f.s==='jab'?4:7,f)}
function step(f,o,i,dt,S){
 f.t+=dt;f.ph+=dt;f.en=Math.min(100,f.en+6*dt);f.mv=0;if(f.orb>0)f.orb-=dt;
 if(f.s!=='idle'&&f.t>=D[f.s]){f.s='idle';f.t=0}
 f.g=false;
 if(f.s==='idle'){
  f.dir=o.x>f.x?1:-1;
  if(i.g)f.g=true;else{const m=(i.r?1:0)-(i.l?1:0);f.x+=m*105*dt;f.mv=m*f.dir}
  const c=CH[f.ch].cost;
  if(i.d){f.s='dodge';f.t=0;f.done=false}
  else if(i.pw&&f.en>=c&&!(f.ch===1&&f.orb>0)){f.en-=c;f.s='power';f.t=0;f.done=false}
  else if(i.hv){f.s='heavy';f.t=0;f.done=false}
  else if(i.jb){f.s='jab';f.t=0;f.done=false}}
 if(f.s==='dodge'&&f.t<.25)f.x-=f.dir*230*dt;
 if(A[f.s]!==undefined&&!f.done&&f.t>=A[f.s]){f.done=true;strike(f,o,S)}
 f.x=Math.max(28,Math.min(452,f.x))}
function ai(f,o,dt){
 const i={},d=Math.abs(f.x-o.x),tw=o.x>f.x?'r':'l',aw=tw==='r'?'l':'r',c=CH[f.ch].cost;
 f.ct=(f.ct||0)-dt;
 if(f.ct<=0){f.ct=.25+Math.random()*.4;const r=Math.random();
  f.plan=d>85?(r<.75?'in':'pw'):d<50?(r<.4?'out':'atk'):(r<.6?'atk':r<.8?'g':'in');
  if(f.en>=c&&f.orb<=0&&(f.ch===1||d>60)&&Math.random()<.35)f.plan='pw'}
 if(['jab','heavy','power'].includes(o.s)){if(!f.seen){f.seen=1;if(d<100&&Math.random()<.45)f.gt=.45}}else f.seen=0;
 if(f.gt>0){f.gt-=dt;i.g=1;return i}
 if(f.ch===1&&f.orb>0){if(d<74)i.jb=1;else i[tw]=1;return i}
 if(f.plan==='in')i[tw]=d>70;
 else if(f.plan==='out')i[aw]=1;
 else if(f.plan==='g')i.g=1;
 else if(f.plan==='atk'&&d<80){i[Math.random()<.5?'jb':'hv']=1;f.ct=.5}
 else if(f.plan==='pw'){if(f.en>=c&&f.orb<=0)i.pw=1;f.plan='in'}
 return i}
function tick(S,a,b,dt){
 const p=S.f[0],e=S.f[1];step(p,e,a,dt,S);step(e,p,b,dt,S);
 const d=e.x-p.x;if(Math.abs(d)<34){const s=Math.sign(d)||1,m=(34-Math.abs(d))/2;p.x-=s*m;e.x+=s*m}
 S.pr=S.pr.filter(q=>{q.x+=q.dir*230*dt;const t=S.f[1-q.ow];if(Math.abs(q.x-t.x)<28){hurt(t,BEAM,S.f[q.ow],1);return false}return q.x>-30&&q.x<510});
 if(p.hp<=0||e.hp<=0){S.over=1;S.win=e.hp<=0?0:1}}
const api={G,D,CH,mk,tick,ai};
if(typeof module!=='undefined')module.exports=api;else R.Game=api;
})(this);
