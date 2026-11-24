const http=require('http'),fs=require('fs'),path=require('path'),{WebSocketServer}=require('ws'),Game=require('./game.js');
const FILES={'/':'index.html','/index.html':'index.html','/game.js':'game.js','/manifest.json':'manifest.json','/sw.js':'sw.js','/icon-192.png':'icon-192.png','/icon-512.png':'icon-512.png'};
const T={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png'};
const server=http.createServer((req,res)=>{
 const f=FILES[req.url.split('?')[0]];
 if(!f){res.writeHead(404);return res.end('404')}
 fs.readFile(path.join(__dirname,f),(e,d)=>{if(e){res.writeHead(404);return res.end('404')}
  res.writeHead(200,{'Content-Type':T[path.extname(f)]});res.end(d)})});
const wss=new WebSocketServer({server});
let wait=null;const matches=new Set();
function leave(ws,notify){const m=ws.m;if(!m)return;ws.m=null;
 m.p.forEach(w=>{if(w!==ws&&w.m===m){w.m=null;if(notify&&w.readyState===1)w.send('{"t":"left"}')}});matches.delete(m)}
function start(a,b){
 const m={p:[a,b],S:{f:[Game.mk(130,1,a.ch,0),Game.mk(350,-1,b.ch,1)],pr:[],over:0},end:0};
 a.m=b.m=m;a.inp={};b.inp={};matches.add(m);
 [a,b].forEach((w,i)=>w.send(JSON.stringify({t:'start',me:i,S:m.S})))}
wss.on('connection',ws=>{
 ws.inp={};
 ws.on('message',raw=>{let d;try{d=JSON.parse(raw)}catch{return}
  if(d.t==='find'){leave(ws,false);if(wait===ws)wait=null;ws.ch=d.ch===1?1:0;
   if(wait&&wait.readyState===1){const a=wait;wait=null;start(a,ws)}else{wait=ws;ws.send('{"t":"queued"}')}}
  else if(d.t==='cancel'){if(wait===ws)wait=null}
  else if(d.t==='in'&&ws.m&&d.i){const i=d.i;ws.inp.l=!!i.l;ws.inp.r=!!i.r;ws.inp.g=!!i.g;
   for(const k of ['jb','hv','d','pw'])if(i[k])ws.inp[k]=1}});
 ws.on('close',()=>{if(wait===ws)wait=null;leave(ws,true)})});
setInterval(()=>{for(const m of matches){
 const[a,b]=m.p;
 if(!m.S.over){Game.tick(m.S,a.inp,b.inp,1/60);for(const w of m.p)w.inp.jb=w.inp.hv=w.inp.d=w.inp.pw=0}
 const s=JSON.stringify({t:'st',S:m.S});m.p.forEach(w=>w.readyState===1&&w.send(s));
 if(m.S.over&&!m.end)m.end=Date.now();
 if(m.end&&Date.now()-m.end>1500){m.p.forEach(w=>{if(w.m===m)w.m=null});matches.delete(m)}}},1000/60);
server.listen(process.env.PORT||3000,()=>console.log('Duelo Dourado rodando'));
