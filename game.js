// Cartas de la Abuela
const VERSION='0.2.0';
const $=id=>document.getElementById(id);
const app=$('app');
const KEY='cartasAbuela.v2',OLD='cartasAbuela.v1';
const SESSION_MAX=15*60*1000;
let S=load();
function def(){return{tut:false,ep:0,pre:0,played:[],nq:3,nd:2,hist:[],off:0,instSeen:false,eager:0,bonusDay:'',bonusN:0,sessions:0,acc:[]};}
function load(){let s=null;try{s=JSON.parse(localStorage.getItem(KEY)||'null');}catch(e){}
 if(!s){try{const o=JSON.parse(localStorage.getItem(OLD)||'null'); // migración desde v0.1
  if(o){s={tut:!!o.tut,played:Array.isArray(o.played)?o.played:[],nq:o.nq||3,nd:o.nd||2,hist:o.hist||[],off:o.off||0,instSeen:!!o.instSeen,ep:[0,2,3,5,6][Math.min(4,o.dayIdx|0)]};}}catch(e){}}
 const r=Object.assign(def(),s||{});r.ep=Math.max(0,Math.min(EPISODES.length,r.ep|0));try{localStorage.setItem(KEY,JSON.stringify(r));}catch(e){}return r;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function dstr(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function today(){const d=new Date();d.setDate(d.getDate()+S.off);return d;}
function playedOn(d){return S.played.includes(dstr(d));}
function streak(){const d=today();if(!playedOn(d))d.setDate(d.getDate()-1);let n=0,free=true,w=0;
 for(let i=0;i<400;i++){if(w>0&&w%7===0)free=true;if(playedOn(d))n++;else if(free&&S.played.length)free=false;else break;d.setDate(d.getDate()-1);w++;}return n;}
// experiencia del jugador: precisión (preguntas y distractores) + ganas de leer más
function exp(){return (S.nq-2)+(S.nd-1)+Math.min(3,S.eager);}
function chUnlocked(c){if(c===0)return true;const first=EPISODES.findIndex(e=>e.ch===c);return S.ep>=first&&S.played.length>=first;}
function el(html){app.innerHTML='<div class="wrap">'+html+'</div><div class="ver" id="ver">v'+VERSION+'</div>';app.scrollTop=0;bindVer();}
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
const pick=a=>a[(Math.random()*a.length)|0];
const envSVG='<svg viewBox="0 0 230 160"><rect x="6" y="6" width="218" height="148" rx="12" fill="#fff8ea" stroke="#7a4a24" stroke-width="6"/><path d="M10 12 L115 92 L220 12" fill="none" stroke="#7a4a24" stroke-width="6" stroke-linejoin="round"/><circle cx="115" cy="90" r="22" fill="#b3322b" stroke="#6e1414" stroke-width="4"/><path d="M115 99 c-10-8-14-12-10-17 c3-4 8-3 10 1 c2-4 7-5 10-1 c4 5 0 9-10 17z" fill="#f7b3a4"/></svg>';
const nextEp=()=>EPISODES[S.ep];

// ---- pantalla principal ----
function title(){
 const doneToday=playedOn(today()),e=nextEp();
 const wd=['L','M','M','J','V','S','D'],t=today(),mon=new Date(t);mon.setDate(t.getDate()-((t.getDay()+6)%7));
 let week='';for(let i=0;i<7;i++){const d=new Date(mon);d.setDate(mon.getDate()+i);week+='<div>'+wd[i]+'<span class="'+(playedOn(d)?'on ':'')+(dstr(d)===dstr(t)?'today':'')+'">'+(playedOn(d)?'💌':'')+'</span></div>';}
 const st=streak();let main;
 if(!e)main='<p class="center">¡Resolviste todos los misterios! 🌼<br>Pronto llegarán más cartas.</p>';
 else if(doneToday)main='<p class="center">Ya leíste las cartas de hoy.<br>Mañana llega otra 💌</p>'+(canBonus()?'<button class="btn soft" id="bonus">💌 Leer una carta más</button>':'');
 else if(!chUnlocked(e.ch))main='<p class="center">Vuelve mañana para abrir el próximo capítulo 💌</p>';
 else main='<div class="env" id="go">'+envSVG+'</div><button class="btn big" id="go2">Abrir las cartas de hoy</button>';
 let chaps='';CHAPTERS.forEach((c,i)=>{const eps=EPISODES.filter(x=>x.ch===i),first=EPISODES.indexOf(eps[0]),done=Math.max(0,Math.min(eps.length,S.ep-first));
  chaps+=chUnlocked(i)||done?'<div class="paper chap"><div class="ic">'+(done>=eps.length?'✅':c.icon)+'</div><div><b>Capítulo '+(i+1)+'</b><br>'+c.title+'<br><span class="small">'+done+' de '+eps.length+' días</span></div></div>'
  :'<div class="paper chap locked"><div class="ic">🔒</div><div><b>Capítulo '+(i+1)+'</b><br><span class="small">Se abre al jugar '+first+' días distintos · llevas '+Math.min(S.played.length,first)+' de '+first+'</span></div></div>';});
 el('<h1>Cartas de la Abuela</h1><p class="sub">Un misterio familiar, una carta a la vez</p><div class="paper">'+main+'</div>'+
 (S.ep>0?'<button class="btn soft" id="nbk">📒 Cuaderno de pistas</button>':'')+
 '<div class="paper"><h2 style="font-size:22px">Esta semana</h2><div class="week">'+week+'</div><p class="center small" style="margin:12px 0 0">'+(st>0?'Racha: <b>'+st+' día'+(st>1?'s':'')+'</b> 🔥 · puedes descansar un día por semana':'Juega un ratito cada día para abrir más cartas')+'</p></div>'+chaps+
 (S.ep>0?'<button class="btn soft" id="rev">📜 Releer las cartas</button>':''));
 [$('go'),$('go2')].forEach(b=>b&&(b.onclick=()=>S.tut?startSession():tutorial()));
 $('rev')&&($('rev').onclick=review);$('nbk')&&($('nbk').onclick=notebook);$('bonus')&&($('bonus').onclick=bonus);
}
function review(){let h='<h2>Tus cartas</h2>';EPISODES.slice(0,S.ep).forEach(e=>{h+='<p class="sub">'+CHAPTERS[e.ch].title+' · '+e.name+'</p>';e.letters.forEach(l=>h+='<div class="paper letter">'+l.t+'<div class="from">— '+l.f+'</div></div>');if(e.reveal)h+='<div class="paper letter">'+e.reveal.t+'<div class="from">— '+e.reveal.f+'</div></div>';});el(h+'<button class="btn" id="back">Volver</button>');$('back').onclick=title;}
function notebook(){let h='<h2>📒 Cuaderno de pistas</h2><p class="sub">Lo que has descubierto, día a día</p>';let lc=-1;
 EPISODES.slice(0,S.ep).forEach(e=>{if(e.ch!==lc){lc=e.ch;h+='<h2 style="font-size:22px;margin-top:8px">'+CHAPTERS[e.ch].icon+' '+CHAPTERS[e.ch].title+'</h2>';}
  h+='<div class="paper nb"><b>'+e.name+'</b>'+e.nb.map(n=>'<div class="nbi"><span>'+n[0]+'</span>'+n[1]+'</div>').join('')+'</div>';});
 const e=nextEp();if(e&&!e.final)h+='<div class="paper nb center"><i>Misterio abierto:</i><br><b>'+CHAPTERS[e.ch].mystery+'</b></div>';
 el(h+'<button class="btn" id="back">Volver</button>');$('back').onclick=title;}

// ---- tutorial sin palabras (no se puede perder) ----
function tutorial(){
 el('<div style="height:40px"></div><div class="env" id="t1">'+envSVG+'</div><div class="hand">👆</div>');
 $('t1').onclick=()=>{el('<div class="paper"><div class="pic">🌻</div></div><button class="btn big glow" id="t2">✓</button>');
  $('t2').onclick=()=>{el('<div class="paper center"><div class="pic" style="font-size:90px">❓</div></div><div class="opts3" id="o"></div>');
   const o=$('o');shuffle(['🌻','🍎','🐟']).forEach(e=>{const b=document.createElement('button');b.className='opt';b.textContent=e;o.appendChild(b);
    b.onclick=()=>{if(e==='🌻'){b.classList.add('ok');setTimeout(()=>{el('<div class="hearts">💛</div><button class="btn big" id="t3">▶</button>');$('t3').onclick=()=>{S.tut=true;save();startSession();};},500);}
     else{b.classList.add('shake','no');[...o.children].find(x=>x.textContent==='🌻').classList.add('glow');}};});};};
}

// ---- sesión: cadena de pasos ----
let ses=null;
function crossQs(n){const pool=[];EPISODES.slice(0,S.ep).forEach(e=>(e.qs||[]).concat(e.letters.filter(l=>l.q).map(l=>l.q)).forEach(q=>pool.push(q)));return shuffle(pool).slice(0,n);}
function timeQs(n){const out=[];if(S.ep<2)return out;for(let i=0;i<n;i++){let a=(Math.random()*S.ep)|0,b=(Math.random()*S.ep)|0;if(a===b)b=(a+1)%S.ep;if(a>b)[a,b]=[b,a];
 const A=pick(EPISODES[a].nb)[1],B=pick(EPISODES[b].nb)[1];out.push(['¿Qué descubriste primero?',A,B,'Piensa qué cartas llegaron antes: las de «'+EPISODES[a].name+'» o las de «'+EPISODES[b].name+'».']);}return out;}
function startSession(){
 const e=nextEp(),x=exp(),steps=[];
 const lets=e.letters.slice(S.pre).filter(l=>!l.x||x>=3||S.eager>=1);
 const pre=S.pre;const warm=S.ep>0?crossQs(2+(x>=3)+(x>=5)+(x>=7)):[];
 warm.forEach(q=>steps.push({k:'q',q,tag:'🕰️ ¿Te acuerdas?'}));
 timeQs(1+(x>=4)+(x>=7)).forEach(q=>steps.push({k:'q',q,tag:'🕰️ Línea del tiempo'}));
 lets.forEach(l=>{steps.push({k:'env',l});if(l.q)steps.push({k:'q',q:l.q,tag:'✉️ Sobre esta carta'});});
 if(e.final){steps.push({k:'msg',ic:'🔎',t:'Antes de resolver el misterio, repasemos el caso.'});crossQs(5+(x>=4)+(x>=7)).forEach(q=>steps.push({k:'q',q,tag:'🔎 Repaso del caso'}));timeQs(2).forEach(q=>steps.push({k:'q',q,tag:'🔎 Repaso del caso'}));
  e.final.forEach(q=>steps.push({k:'q',q,tag:'🔎 El misterio',big:1}));steps.push({k:'reveal'});}
 else{steps.push({k:'msg',ic:'🧺',t:'Guardaste las cartas en el baúl.<br>Ahora, ¿qué recuerdas?'});
  shuffle(e.qs).slice(0,Math.min(S.nq+(x>=5)+pre,e.qs.length)).forEach(q=>steps.push({k:'q',q,tag:'¿Qué recuerdas?',rec:1}));}
 ses={e,steps,i:-1,t0:Date.now(),first:0,total:0,read:lets.length,bonus:false};S.pre=0;save();next();
}
function next(){ses.i++;const s=ses.steps[ses.i];
 if(!s)return ses.bonus?bonusEnd():closing();
 if(s.rec&&Date.now()-ses.t0>SESSION_MAX){ses.i=ses.steps.length;return next();}
 const n=ses.steps.length,p='<div class="bar"><i style="width:'+Math.round(ses.i/n*100)+'%"></i></div>';
 if(s.k==='env'){el('<p class="sub">'+(ses.bonus?'Una carta más':ses.e.name)+'</p>'+p+'<div style="height:20px"></div><div class="env" id="op">'+envSVG+'</div><p class="center">Carta de <b>'+s.l.f+'</b></p><button class="btn big" id="op2">Abrir carta</button>');
  $('op').onclick=$('op2').onclick=()=>{el('<p class="sub">'+ses.e.name+'</p>'+p+'<div class="paper letter">'+s.l.t+'<div class="from">— '+s.l.f+'</div></div><p class="center small">Fíjate en los nombres, lugares y fechas ✨</p><button class="btn big" id="keep">Guardar la carta ✓</button>');$('keep').onclick=next;};}
 else if(s.k==='msg'){el(p+'<div class="paper center"><div class="pic" style="font-size:70px">'+s.ic+'</div><p>'+s.t+'</p></div><button class="btn big" id="nx">Seguir</button>');$('nx').onclick=next;}
 else if(s.k==='reveal'){const r=ses.e.reveal;el('<p class="sub">La última carta</p><div class="paper letter">'+r.t+'<div class="from">— '+r.f+'</div></div><button class="btn big" id="nx">💛 Guardar esta carta</button>');$('nx').onclick=next;}
 else showQ(s,p);
}
function showQ(s,p){const q=s.q;let firstTry=true;
 const nd=s.big?3:S.nd;const opts=shuffle([q[1],...shuffle(q[2].split('|')).slice(0,nd)]);
 el('<p class="sub">'+s.tag+'</p>'+p+'<div class="paper"><h2 style="font-size:24px">'+q[0]+'</h2></div><div id="opts" style="display:flex;flex-direction:column;gap:12px"></div><div id="hint"></div>');
 const box=$('opts');
 opts.forEach(o=>{const b=document.createElement('button');b.className='opt';b.textContent=o;box.appendChild(b);
  b.onclick=()=>{if(b.classList.contains('no')||box.dataset.done)return;
   if(o===q[1]){box.dataset.done=1;b.classList.add('ok');record(firstTry);
    $('hint').innerHTML='<div class="hint center">'+(firstTry?pick(['¡Muy bien! 💛','¡Así es! 🌼','¡Qué buena memoria! ✨']):'¡Eso es! Lo encontraste 💛')+'</div><div style="height:12px"></div><button class="btn big" id="nx">Seguir</button>';
    $('nx').onclick=next;}
   else{firstTry=false;b.classList.add('shake','no');$('hint').innerHTML='<div class="hint">💡 <b>Pista:</b> '+q[3]+'</div>';}};});
}
function record(ok){ses.total++;if(ok)ses.first++;S.hist.push(ok?1:0);if(S.hist.length>8)S.hist.shift();
 if(S.hist.length>=6){const r=S.hist.reduce((a,b)=>a+b,0)/S.hist.length;
  if(r>0.85){if(S.nd<=S.nq-2&&S.nd<4)S.nd++;else if(S.nq<5)S.nq++;else if(S.nd<4)S.nd++;S.hist=S.hist.slice(-3);}
  else if(r<0.75){if(S.nd>1)S.nd--;else if(S.nq>2)S.nq--;S.hist=S.hist.slice(-3);}}
 save();}
function closing(){
 const t=dstr(today());if(!S.played.includes(t))S.played.push(t);const e=ses.e;S.ep++;S.sessions++;
 S.acc.push(ses.total?Math.round(ses.first/ses.total*100):100);if(S.acc.length>10)S.acc.shift();
 if(S.bonusDay!==t&&S.eager>0)S.eager=Math.max(0,S.eager-0.5);save();
 const st=streak(),mins=Math.max(1,Math.round((Date.now()-ses.t0)/60000));
 el('<div class="paper center"><div class="hearts">'+(e.final?'💛✨':'☕💌')+'</div><h2>'+(e.final?'¡Resolviste el misterio!':'Gracias por visitar a la abuela')+'</h2><p>Hoy leíste '+ses.read+' carta'+(ses.read>1?'s':'')+' y recordaste '+ses.total+' detalles. Todo quedó anotado en tu cuaderno 📒</p><p class="small">'+(st>0?'Racha: '+st+' día'+(st>1?'s':'')+' 🔥 · ':'')+'unos '+mins+' min</p></div>'+
 '<div class="paper hook center"><div style="font-size:40px">✉️</div><p><i>'+e.hook+'</i></p></div>'+
 (canBonus()?'<button class="btn soft" id="bonus">💌 Leer una carta más</button>':'')+'<button class="btn big" id="home">Volver al inicio</button>');
 $('home').onclick=title;$('bonus')&&($('bonus').onclick=bonus);}
// ---- "Leer una carta más": opcional, adelanta cartas del próximo día (máx. por día) ----
function bonusCap(){return 1+(S.eager>=2||exp()>=6);}
function canBonus(){const e=nextEp(),t=dstr(today());if(!e||e.final||!chUnlocked(e.ch)||!playedOn(today()))return false;
 const used=S.bonusDay===t?S.bonusN:0;const story=e.letters.filter(l=>!l.x).length;return used<bonusCap()&&S.pre<story-1;}
function bonus(){const e=nextEp(),t=dstr(today());if(S.bonusDay!==t){S.bonusDay=t;S.bonusN=0;}S.bonusN++;S.eager=Math.min(4,S.eager+1);
 const l=e.letters[S.pre];S.pre++;save();
 ses={e,steps:[{k:'env',l}].concat(l.q?[{k:'q',q:l.q,tag:'✉️ Sobre esta carta'}]:[]),i:-1,t0:Date.now(),first:0,total:0,read:1,bonus:true};next();}
function bonusEnd(){el('<div class="paper center"><div class="hearts">🌙</div><h2>Una carta más, guardada</h2><p>La abuela sonríe: te gusta su historia. El resto de las cartas llegará mañana.</p></div>'+(canBonus()?'<button class="btn soft" id="bonus">💌 Leer otra más</button>':'')+'<button class="btn big" id="home">Volver al inicio</button>');$('home').onclick=title;$('bonus')&&($('bonus').onclick=bonus);}

// ---- modo de prueba: tocar la versión 5 veces ----
let vt=0,vtT=0;
function bindVer(){const v=$('ver');if(!v)return;v.onclick=()=>{const n=Date.now();vt=n-vtT<1500?vt+1:1;vtT=n;if(vt>=5){vt=0;devPanel();}};}
function devPanel(){const d=document.createElement('div');d.className='dev paper';d.innerHTML='<b>Modo de prueba</b> · día '+dstr(today())+' · cartas '+S.ep+'/'+EPISODES.length+' · preguntas '+S.nq+' · distractores '+S.nd+' · ganas '+S.eager+' · exp '+exp()+'<div style="display:flex;flex-direction:column;gap:10px;margin-top:10px"><button class="btn" id="dNext">⏭ Simular día siguiente</button><button class="btn soft" id="dReset">↺ Reiniciar progreso</button><button class="btn soft" id="dClose">Cerrar</button></div>';document.body.appendChild(d);
 $('dNext').onclick=()=>{S.off++;save();d.remove();title();};$('dReset').onclick=()=>{localStorage.removeItem(KEY);S=load();d.remove();title();};$('dClose').onclick=()=>d.remove();}

// ---- instalación (PWA) ----
let deferred=null;const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone;
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
function refreshInstall(){if(deferred){$('instBtn').classList.remove('hidden');$('instWait').classList.add('hidden');}if(isIOS){$('instIos').classList.remove('hidden');$('instWait').classList.add('hidden');}}
function maybeInstallCard(){if(S.instSeen||standalone())return;$('install').classList.remove('hidden');refreshInstall();}
function closeInstall(){S.instSeen=true;save();$('install').classList.add('hidden');}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;refreshInstall();});
addEventListener('appinstalled',closeInstall);
$('instX').onclick=closeInstall;
$('instBtn').onclick=async()=>{if(!deferred)return;deferred.prompt();try{await deferred.userChoice;}catch(e){}deferred=null;closeInstall();};
function showUpdating(){const v=$('ver');if(v)v.textContent='Actualizando…';}
if('serviceWorker' in navigator){let rl=false;const had=!!navigator.serviceWorker.controller;
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(rl||!had)return;rl=true;showUpdating();location.reload();});
 addEventListener('load',()=>navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(reg=>{reg.addEventListener('updatefound',()=>{if(navigator.serviceWorker.controller)showUpdating();});reg.update();document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')reg.update();});}).catch(()=>{}));}

// ---- arranque ----
function boot(){try{title();}catch(e){console.error(e);}setTimeout(()=>{$('loading').classList.remove('show');maybeInstallCard();},700);}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',boot);else boot();
