import sys,subprocess,time,json
from playwright.sync_api import sync_playwright
url=sys.argv[1] if len(sys.argv)>1 else None;srv=None
if not url:
  srv=subprocess.Popen(['python3','-m','http.server','8931'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1);url='http://localhost:8931/'
errs=[];out=sys.argv[2] if len(sys.argv)>2 else 'shots'
def C(pg,s):pg.click(s,force=True);pg.wait_for_timeout(120)
def play(pg,tag,wrong_every=0,shots=False):
  words=0;nq=0;wrong=0;letters=0;k=0
  while True:
    if pg.query_selector('#op2'):C(pg,'#op2');letters+=1;words+=len(pg.inner_text('.letter').split());C(pg,'#keep');continue
    if pg.query_selector('.opt'):
      q=pg.inner_text('h2');k+=1;nq+=1
      ans=pg.evaluate("ses.steps[ses.i].q[1]")
      if wrong_every and k%wrong_every==1:
        [o for o in pg.query_selector_all('.opt') if o.inner_text()!=ans][0].click(force=True);wrong+=1;pg.wait_for_timeout(150)
        if shots and k==1:pg.screenshot(path=out+'/v2_hint.png')
      C(pg,f'.opt:text-is("{ans}")');C(pg,'#nx');continue
    if pg.query_selector('.letter') and pg.query_selector('#nx'):words+=len(pg.inner_text('.letter').split());C(pg,'#nx');continue
    if pg.query_selector('#nx'):C(pg,'#nx');continue
    break
  est=words/120*60+nq*25+wrong*10+letters*6
  print(f'{tag}: cartas={letters} palabras={words} preguntas={nq} errores={wrong} estimado={est/60:.1f} min');return est
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
  ctx=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
  pg=ctx.new_page();pg.on('console',lambda m: m.type=='error' and errs.append(m.text));pg.on('pageerror',lambda e: errs.append(str(e)))
  # migración desde v0.1
  pg.goto(url);pg.evaluate("localStorage.clear();localStorage.setItem('cartasAbuela.v1',JSON.stringify({tut:true,dayIdx:2,played:['2026-10-13','2026-10-14'],nq:3,nd:2,hist:[],off:0,instSeen:true}))")
  pg.reload();pg.wait_for_timeout(1200);print('migrado:',pg.evaluate("JSON.parse(localStorage.getItem('cartasAbuela.v2')).ep"),'(esperado 3)')
  # jugador nuevo (novato: falla 1 de cada 3)
  pg.evaluate("localStorage.clear()");pg.reload();pg.wait_for_timeout(1200);C(pg,'#instX');C(pg,'#go2')
  C(pg,'#t1');C(pg,'#t2');C(pg,'.opt:text-is("🌻")');pg.wait_for_timeout(600);C(pg,'#t3')
  play(pg,'Novato día 1',3,True);pg.screenshot(path=out+'/v2_hook_closing.png',full_page=True)
  C(pg,'#bonus');C(pg,'#op2');pg.screenshot(path=out+'/v2_bonus_letter.png');C(pg,'#keep')
  play(pg,'  carta extra',0);pg.screenshot(path=out+'/v2_bonus_end.png');C(pg,'#home')
  for d in range(2,8):
    for i in range(5):C(pg,'#ver')
    C(pg,'#dNext');C(pg,'#go2');play(pg,f'Novato día {d}',3)
    if d==3:C(pg,'#home');C(pg,'#nbk');pg.screenshot(path=out+'/v2_notebook.png');pg.screenshot(path=out+'/v2_notebook_full.png',full_page=True);C(pg,'#back');continue
    if d==7:pg.screenshot(path=out+'/v2_final_closing.png')
    C(pg,'#home')
  pg.screenshot(path=out+'/v2_title_ch2.png',full_page=True)
  # jugador experimentado: todo bien + carta extra cada día
  pg.evaluate("localStorage.setItem('cartasAbuela.v2',JSON.stringify({tut:true,ep:0,played:[],instSeen:true,off:0}))");pg.reload();pg.wait_for_timeout(1200)
  for d in range(1,8):
    if d>1:
      for i in range(5):C(pg,'#ver')
      C(pg,'#dNext')
    C(pg,'#go2');play(pg,f'Experto día {d}',0)
    while pg.query_selector('#bonus'):C(pg,'#bonus');play(pg,'  extra',0)
    C(pg,'#home')
  print('estado experto:',pg.evaluate("(({nq,nd,eager,ep})=>({nq,nd,eager,ep}))(JSON.parse(localStorage.getItem('cartasAbuela.v2')))"))
  b.close()
if srv:srv.kill()
print('ERRORS:',errs)
