// Cartas de la Abuela – prototipo
const VERSION='0.1.0';
const $=id=>document.getElementById(id);
const app=$('app');
const KEY='cartasAbuela.v1';
const SESSION_MAX=7*60*1000; // la sesión cierra sola a los ~7 min
let S=load();
function load(){try{return Object.assign(def(),JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return def();}}
function def(){return{tut:false,dayIdx:0,played:[],nq:3,nd:2,hist:[],off:0,instSeen:false,read:[]};}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
// ---- fechas (con desplazamiento de prueba) ----
function dstr(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function today(){const d=new Date();d.setDate(d.getDate()+S.off);return d;}
function playedOn(d){return S.played.includes(dstr(d));}
function streak(){ // días seguidos, con un día libre permitido por semana
 const d=today();if(!playedOn(d))d.setDate(d.getDate()-1);
 let n=0,free=true,walked=0;
 for(let i=0;i<400;i++){if(walked>0&&walked%7===0)free=true;
  if(playedOn(d))n++;else if(free&&S.played.length){free=false;}else break;
  d.setDate(d.getDate()-1);walked++;}
 return n;}
const esc=s=>s;
function el(html){app.innerHTML='<div class="wrap">'+html+'</div>'+verHTML();app.scrollTop=0;bindVer();}
function verHTML(){return '<div class="ver" id="ver">v'+VERSION+'</div>';}
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
const envSVG='<svg viewBox="0 0 230 160"><rect x="6" y="6" width="218" height="148" rx="12" fill="#fff8ea" stroke="#7a4a24" stroke-width="6"/><path d="M10 12 L115 92 L220 12" fill="none" stroke="#7a4a24" stroke-width="6" stroke-linejoin="round"/><circle cx="115" cy="90" r="22" fill="#b3322b" stroke="#6e1414" stroke-width="4"/><path d="M115 99 c-10-8-14-12-10-17 c3-4 8-3 10 1 c2-4 7-5 10-1 c4 5 0 9-10 17z" fill="#f7b3a4"/></svg>';

// ---- pantalla principal ----
function title(){
 const doneToday=playedOn(today()), days=STORY.days, finished=S.dayIdx>=days.length;
 const wd=['L','M','M','J','V','S','D'],t=today(),mon=new Date(t);mon.setDate(t.getDate()-((t.getDay()+6)%7));
 let week='';for(let i=0;i<7;i++){const d=new Date(mon);d.setDate(mon.getDate()+i);week+='<div>'+wd[i]+'<span class="'+(playedOn(d)?'on ':'')+(dstr(d)===dstr(t)?'today':'')+'">'+(playedOn(d)?'💌':'')+'</span></div>';}
 const st=streak(), dp=S.played.length;
 let main;
 if(finished)main='<p class="center">¡Resolviste el misterio de la abuela! 🌼</p><button class="btn soft" id="rev">📜 Releer las cartas</button>';
 else if(doneToday)main='<p class="center">Ya leíste la carta de hoy.<br>Mañana llega otra 💌</p><button class="btn soft" id="rev">📜 Releer las cartas</button>';
 else main='<div class="env" id="go">'+envSVG+'</div><button class="btn big" id="go2">Abrir la carta de hoy</button>';
 el('<h1>Cartas de la Abuela</h1><p class="sub">Un misterio familiar, una carta a la vez</p>'+
 '<div class="paper">'+main+'</div>'+
 '<div class="paper"><h2 style="font-size:22px">Esta semana</h2><div class="week">'+week+'</div><p class="center small" style="margin:12px 0 0">'+(st>0?'Racha: <b>'+st+' día'+(st>1?'s':'')+'</b> 🔥 · puedes descansar un día por semana':'Juega un ratito cada día para abrir más cartas')+'</p></div>'+
 '<div class="paper chap"><div class="ic">📖</div><div><b>Capítulo 1</b><br>'+STORY.title+'<br><span class="small">'+Math.min(S.dayIdx,days.length)+' de '+days.length+' cartas</span></div></div>'+
 '<div class="paper chap locked"><div class="ic">🔒</div><div><b>Capítulo 2</b><br><span class="small">Se abre al jugar 4 días distintos · llevas '+Math.min(dp,4)+' de 4</span></div></div>');
 [$('go'),$('go2')].forEach(b=>b&&(b.onclick=()=>S.tut?startSession():tutorial()));
 $('rev')&&($('rev').onclick=review);
}
function review(){let h='<h2>Tus cartas</h2>';STORY.days.slice(0,S.dayIdx).forEach(d=>d.letters.forEach(l=>h+='<div class="paper letter">'+l.text+'<div class="from">— '+l.from+'</div></div>'));el(h+'<button class="btn" id="back">Volver</button>');$('back').onclick=title;}

// ---- tutorial sin palabras (no se puede perder) ----
function tutorial(){
 el('<div style="height:40px"></div><div class="env" id="t1">'+envSVG+'</div><div class="hand">👆</div>');
 $('t1').onclick=()=>{el('<div class="paper"><div class="pic">🌻</div></div><button class="btn big glow" id="t2">✓</button>');
  $('t2').onclick=()=>{el('<div class="paper center"><div class="pic" style="font-size:90px">❓</div></div><div class="opts3" id="o"></div>');
   const o=$('o');shuffle(['🌻','🍎','🐟']).forEach(e=>{const b=document.createElement('button');b.className='opt';b.textContent=e;o.appendChild(b);
    b.onclick=()=>{if(e==='🌻'){b.classList.add('ok');setTimeout(()=>{el('<div class="hearts">💛</div><button class="btn big" id="t3">▶</button>');$('t3').onclick=()=>{S.tut=true;save();startSession();};},500);}
     else{b.classList.add('shake','no');[...o.children].find(x=>x.textContent==='🌻').classList.add('glow');}};});};};
}

// ---- sesión diaria ----
let ses=null;
function startSession(){
 const day=STORY.days[S.dayIdx];
 const letters=day.final?[day.letters[0]]:day.letters;
 let qs;
 if(day.final)qs=day.qs.map(q=>({...q}));
 else{qs=shuffle(day.qs).slice(0,Math.max(2,Math.min(S.nq,day.qs.length)));
  if(S.dayIdx>0){const prev=STORY.days[(Math.random()*S.dayIdx)|0];qs.push({...prev.qs[(Math.random()*prev.qs.length)|0],review:true});}}
 ses={day,letters,qs,li:0,qi:0,t0:Date.now(),first:0,total:0};
 showEnvelope();
}
function dots(n,i){let h='<div class="prog">';for(let k=0;k<n;k++)h+='<i class="'+(k<=i?'on':'')+'"></i>';return h+'</div>';}
function showEnvelope(){
 el('<p class="sub">'+ses.day.name+'</p>'+dots(ses.letters.length,ses.li)+'<div style="height:20px"></div><div class="env" id="op">'+envSVG+'</div><button class="btn big" id="op2">Abrir carta</button>');
 $('op').onclick=$('op2').onclick=showLetter;
}
function showLetter(){const l=ses.letters[ses.li];
 el('<p class="sub">'+ses.day.name+'</p><div class="paper letter">'+l.text+'<div class="from">— '+l.from+'</div></div><p class="center small">Fíjate en los nombres, lugares y fechas ✨</p><button class="btn big" id="keep">Guardar la carta ✓</button>');
 $('keep').onclick=()=>{ses.li++;if(ses.li<ses.letters.length)showEnvelope();else{el('<div class="paper center"><div class="pic" style="font-size:70px">🧺</div><p>Guardaste las cartas en el baúl.<br>Ahora, ¿qué recuerdas?</p></div><button class="btn big" id="qq">Recordar</button>');$('qq').onclick=showQ;}};
}
function showQ(){
 const q=ses.qs[ses.qi];let firstTry=true;
 const nd=q.big?3:S.nd;const opts=shuffle([q.a,...shuffle(q.d).slice(0,nd)]);
 el((q.review?'<p class="sub">🕰️ Un recuerdo de otro día</p>':q.big?'<p class="sub">🔎 El misterio</p>':'<p class="sub">¿Qué recuerdas?</p>')+dots(ses.qs.length,ses.qi)+'<div class="paper"><h2 style="font-size:24px">'+q.q+'</h2></div><div id="opts" style="display:flex;flex-direction:column;gap:12px"></div><div id="hint"></div>');
 const box=$('opts');
 opts.forEach(o=>{const b=document.createElement('button');b.className='opt';b.textContent=o;box.appendChild(b);
  b.onclick=()=>{if(b.classList.contains('no')||box.dataset.done)return;
   if(o===q.a){box.dataset.done=1;b.classList.add('ok');record(firstTry);
    $('hint').innerHTML='<div class="hint center">'+(firstTry?['¡Muy bien! 💛','¡Así es! 🌼','¡Qué buena memoria! ✨'][(Math.random()*3)|0]:'¡Eso es! Lo encontraste 💛')+'</div><div style="height:12px"></div><button class="btn big" id="nx">Seguir</button>';
    $('nx').onclick=nextQ;}
   else{firstTry=false;b.classList.add('shake','no');$('hint').innerHTML='<div class="hint">💡 <b>Pista:</b> '+q.h+'</div>';}};});
}
function record(ok){ses.total++;if(ok)ses.first++;S.hist.push(ok?1:0);if(S.hist.length>8)S.hist.shift();
 if(S.hist.length>=6){const r=S.hist.reduce((a,b)=>a+b,0)/S.hist.length;
  if(r>0.85){if(S.nd<=S.nq-2&&S.nd<4)S.nd++;else if(S.nq<5)S.nq++;else if(S.nd<4)S.nd++;S.hist=S.hist.slice(-3);}
  else if(r<0.75){if(S.nd>1)S.nd--;else if(S.nq>2)S.nq--;S.hist=S.hist.slice(-3);}}
 save();}
function nextQ(){ses.qi++;
 if(ses.qi<ses.qs.length&&(Date.now()-ses.t0<SESSION_MAX||ses.day.final))showQ();
 else if(ses.day.final){el('<p class="sub">La última carta</p><div class="paper letter">'+ses.day.letters[1].text+'<div class="from">— '+ses.day.letters[1].from+'</div></div><button class="btn big" id="fin">⌚ Guardar el reloj</button>');$('fin').onclick=closing;}
 else closing();}
function closing(){
 const t=dstr(today());if(!S.played.includes(t))S.played.push(t);S.dayIdx++;save();
 const fin=S.dayIdx>=STORY.days.length,st=streak();
 el('<div class="paper center"><div class="hearts">'+(fin?'⌚💛':'☕💌')+'</div><h2>'+(fin?'¡Resolviste el misterio!':'Gracias por visitar a la abuela')+'</h2><p>'+(fin?'Canela escondió el reloj bajo los geranios, y la abuela lo encontró. Ahora la historia es tuya.':'Hoy guardaste '+ses.letters.length+' cartas y recordaste '+ses.total+' detalles. La abuela Rosa ya está escribiendo la siguiente.')+'</p><p class="small">'+(st>0?'Racha: '+st+' día'+(st>1?'s':'')+' 🔥':'')+'</p><p><i>'+(fin?'Pronto llegará un nuevo capítulo.':'Nos vemos mañana 🌙')+'</i></p></div><button class="btn big" id="home">Volver al inicio</button>');
 $('home').onclick=title;}

// ---- modo de prueba: tocar la versión 5 veces ----
let vt=0,vtT=0;
function bindVer(){const v=$('ver');if(!v)return;v.onclick=()=>{const n=Date.now();vt=n-vtT<1500?vt+1:1;vtT=n;if(vt>=5){vt=0;devPanel();}};}
function devPanel(){const d=document.createElement('div');d.className='dev paper';d.innerHTML='<b>Modo de prueba</b> · día '+dstr(today())+' · preguntas '+S.nq+' · distractores '+S.nd+'<div style="display:flex;flex-direction:column;gap:10px;margin-top:10px"><button class="btn" id="dNext">⏭ Simular día siguiente</button><button class="btn soft" id="dReset">↺ Reiniciar progreso</button><button class="btn soft" id="dClose">Cerrar</button></div>';document.body.appendChild(d);
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
