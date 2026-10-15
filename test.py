import sys,subprocess,time
from playwright.sync_api import sync_playwright
url=sys.argv[1] if len(sys.argv)>1 else None
srv=None
if not url:
  srv=subprocess.Popen(['python3','-m','http.server','8931'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1);url='http://localhost:8931/'
errs=[]
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
  pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
  pg.on('console',lambda m: m.type=='error' and errs.append(m.text)); pg.on('pageerror',lambda e: errs.append(str(e)))
  pg.goto(url);pg.wait_for_timeout(1200);pg.screenshot(path='shots/01_install.png')
  pg.click('#instX',force=True);pg.wait_for_timeout(300);pg.screenshot(path='shots/02_title.png')
  pg.click('#go2',force=True);pg.wait_for_timeout(300);pg.screenshot(path='shots/03_tut1.png')
  pg.click('#t1',force=True);pg.click('#t2',force=True);pg.wait_for_timeout(200)
  for e in ['🍎','🌻']:
    pg.click(f'.opt:text-is("{e}")',force=True);pg.wait_for_timeout(300)
    if e=='🍎':pg.screenshot(path='shots/04_tut_wrong.png')
  pg.wait_for_timeout(400);pg.click('#t3',force=True);pg.wait_for_timeout(300)
  pg.click('#op2',force=True);pg.wait_for_timeout(700);pg.screenshot(path='shots/05_letter.png')
  while pg.query_selector('#keep'):
    pg.click('#keep',force=True);pg.wait_for_timeout(200)
    if pg.query_selector('#op2'):pg.click('#op2',force=True);pg.wait_for_timeout(200)
  pg.click('#qq',force=True);pg.wait_for_timeout(300);pg.screenshot(path='shots/06_question.png')
  first=True
  while pg.query_selector('.opt'):
    q=pg.inner_text('h2')
    ans=pg.evaluate("q=>{for(const d of STORY.days)for(const x of d.qs)if(x.q===q)return x.a}",q)
    if first:
      wrong=[o for o in pg.query_selector_all('.opt') if o.inner_text()!=ans][0];wrong.click();pg.wait_for_timeout(500);pg.screenshot(path='shots/07_hint.png');first=False
    pg.click(f'.opt:text-is("{ans}")',force=True);pg.wait_for_timeout(200);pg.click('#nx',force=True);pg.wait_for_timeout(300)
  pg.wait_for_timeout(300);pg.screenshot(path='shots/08_closing.png')
  pg.click('#home',force=True);pg.wait_for_timeout(200)
  for i in range(5):pg.click('#ver',force=True)
  pg.wait_for_timeout(200);pg.screenshot(path='shots/09_dev.png');pg.click('#dNext',force=True);pg.wait_for_timeout(300);pg.screenshot(path='shots/10_day2_title.png')
  print('ver:',pg.inner_text('#ver'),'state:',pg.evaluate("localStorage.getItem('cartasAbuela.v1')"))
  b.close()
if srv:srv.kill()
print('ERRORS:',errs)
