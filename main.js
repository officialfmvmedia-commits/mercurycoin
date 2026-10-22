(()=>{const RM=/[?&]rm=1/.test(location.search)||matchMedia('(prefers-reduced-motion: reduce)').matches;
const C=Object.assign({CA:'',BUY_URL:'',X_URL:'',COMMIT:'',COMMIT_URL:'',REVEAL:''},window.MERCURY||{});
const hex64=s=>/^[0-9a-f]{64}$/i.test(s||''),b58=s=>/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s||'');
const V={CA:b58(C.CA)?C.CA:'',COMMIT:hex64(C.COMMIT)?C.COMMIT.toLowerCase():'',REVEAL:hex64(C.REVEAL)?C.REVEAL.toLowerCase():'',COMMIT_URL:/^https:\/\//.test(C.COMMIT_URL)?C.COMMIT_URL:''};
// ---- honest AWAITING states, filled from config.js ----
document.querySelectorAll('[data-k]').forEach(el=>{const v=V[el.dataset.k];if(v){el.textContent=v;el.classList.add('ok')}else{el.textContent=el.dataset.empty;el.classList.add('await')}});
document.querySelectorAll('[data-s]').forEach(el=>{if(V[el.dataset.s])el.classList.add('ok')});
document.querySelectorAll('[data-href]').forEach(el=>{const v=V[el.dataset.href];if(v){el.href=v;el.target='_blank';el.rel='noopener';el.textContent='commit post ↗';el.classList.add('ok')}else{el.removeAttribute('href');el.classList.add('await')}});
const buy=document.getElementById('buy'),xb=document.getElementById('xbtn'),cp=document.getElementById('copyca');
if(V.CA){const u=/^https:\/\//.test(C.BUY_URL)?C.BUY_URL:'https://pump.fun/coin/'+V.CA;Object.assign(buy,{href:u,target:'_blank',rel:'noopener',textContent:'Buy on pump.fun ↗'});buy.classList.remove('dis');buy.removeAttribute('aria-disabled');
 cp.hidden=false;cp.onclick=()=>{navigator.clipboard.writeText(V.CA);cp.textContent='Copied'}}
if(/^https:\/\//.test(C.X_URL)){const h=C.X_URL.replace(/\/$/,'').split('/').pop();Object.assign(xb,{href:C.X_URL,target:'_blank',rel:'noopener',textContent:'X · @'+h});xb.classList.remove('dis');xb.removeAttribute('aria-disabled');
 const xl=document.querySelector('.xlink');xl.href=C.X_URL;xl.target='_blank';xl.rel='noopener'}
// ---- hash typing ----
const H='cec65107973de146a0dda7ee9fd30ccfec65554fcafc4f1230ccdb09c4ab7142',he=document.getElementById('hash');
let hashed=false;function typeHash(){if(hashed)return;hashed=true;if(RM){he.textContent=H;return}let i=0;const hx='0123456789abcdef';const t=setInterval(()=>{i++;he.textContent=H.slice(0,i)+Array.from({length:Math.min(8,64-i)},()=>hx[Math.random()*16|0]).join('');if(i>=64){clearInterval(t);he.textContent=H}},28)}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');if(e.target.querySelector('#hash'))typeHash()}}),{threshold:.2});
document.querySelectorAll('.steps li').forEach(l=>io.observe(l));
// ---- final-descent HUD: real label values for the last five MDIS NAC frames ----
const F=[['CN1072716034M_IF_5','11:07:27','23.09','1.22','68.59','220.07','74.3'],['CN1072716038M_IF_5','11:07:31','24.47','1.29','68.93','220.38','74.6'],['CN1072716042M_IF_5','11:07:35','25.89','1.37','69.27','220.70','74.9'],['CN1072716046M_IF_5','11:07:39','27.36','1.44','69.60','221.04','75.3'],['CN1072716050M_IF_5','11:07:43','28.86','1.52','69.94','221.38','75.6']];
const $=id=>document.getElementById(id);let lastF=-1;
function hud(p){const i=Math.min(4,Math.floor(p*5));if(i===lastF)return;lastF=i;const f=F[i];$('hpid').textContent=f[0];$('htime').textContent='2015-04-30 '+f[1];$('hframe').textContent=i+1;$('halt').textContent=f[2];$('hpx').textContent=f[3];$('hlat').textContent=f[4];$('hlon').textContent=f[5];$('hinc').textContent=f[6]}
// ---- parallax + flyover ----
const layers=[...document.querySelectorAll('[data-speed]')],fly=$('descent'),track=document.querySelector('.track'),pct=$('pct'),nav=document.querySelector('.nav');let boost=0;
function onScroll(){const y=scrollY;if(!RM)layers.forEach(l=>l.style.transform=`translate3d(0,${y*l.dataset.speed}px,0)`);nav.classList.toggle('solid',y>innerHeight*.6);
 const r=fly.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));const max=Math.max(0,track.scrollWidth-innerWidth);track.style.transform=`translate3d(${-p*max}px,-50%,0)`;pct.textContent=(p*100|0);hud(p)}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);$('strip').addEventListener('load',onScroll);onScroll();
// ---- solar wind: particles streaming out of the Sun ----
const c=$('wind'),x=c.getContext('2d');let W,Hh,P=[],stars=[];
function sunXY(){const s=document.querySelector('.sun').getBoundingClientRect();return[s.left+s.width/2,s.top+s.height/2]}
function mk(){const [sx,sy]=sunXY(),a=Math.random()*Math.PI*2,d=Math.random()*Math.max(W,Hh)*.9;return{a,d,v:Math.random()*1.4+.35,r:Math.random()*1.3+.25,al:Math.random()*.45+.1,sx,sy}}
function rs(){W=c.width=innerWidth;Hh=c.height=innerHeight;P=Array.from({length:Math.min(150,W/9|0)},mk);stars=Array.from({length:Math.min(220,W/6|0)},()=>({x:Math.random()*W,y:Math.random()*Hh*.75,r:Math.random()*.9+.15,a:Math.random()*.6+.1,t:Math.random()*6}))}
rs();addEventListener('resize',rs);
function draw(t){x.clearRect(0,0,W,Hh);const fade=Math.max(0,1-scrollY/(innerHeight*1.1));const [sx,sy]=sunXY();
 if(fade>0)for(const s of stars){x.globalAlpha=fade*s.a*(.7+.3*Math.sin(t/900+s.t));x.fillStyle='#fff';x.beginPath();x.arc(s.x,s.y,s.r,0,7);x.fill()}
 for(const p of P){if(!RM){p.d+=p.v*(1+boost*14)}const px=sx+Math.cos(p.a)*p.d,py=sy+Math.sin(p.a)*p.d;if(px<-40||px>W+40||py<-40||py>Hh+40){Object.assign(p,mk(),{d:Math.random()*60});continue}
  const L=(2+p.v*5)*(1+boost*10);x.globalAlpha=p.al*fade;x.strokeStyle='rgb(255,222,170)';x.lineWidth=p.r;x.beginPath();x.moveTo(px,py);x.lineTo(px-Math.cos(p.a)*L,py-Math.sin(p.a)*L);x.stroke()}
 x.globalAlpha=1;if(!RM)requestAnimationFrame(draw)}requestAnimationFrame(draw);
// ---- "Enter orbit": glide with a white-hot solar flare ----
const cta=document.querySelector('.cta'),story=$('story'),flare=document.querySelector('.flare');let run=0;
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
cta.addEventListener('click',e=>{e.preventDefault();if(run)return;const y1=story.getBoundingClientRect().top+scrollY;if(RM){scrollTo(0,y1);return}
 cta.classList.add('go');const y0=scrollY,T=1700;let t0=null;run=1;
 const step=ts=>{if(t0===null)t0=ts;const t=Math.min(1,(ts-t0)/T);scrollTo({top:y0+(y1-y0)*ease(t),behavior:'instant'});boost=Math.sin(Math.PI*t);flare.style.opacity=(Math.max(0,Math.sin(Math.PI*Math.min(1,t/.6)))*.85).toFixed(3);onScroll();
  if(t<1)requestAnimationFrame(step);else{run=0;boost=0;flare.style.opacity=0;cta.classList.remove('go')}};requestAnimationFrame(step)});
})();
