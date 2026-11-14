#!/usr/bin/env python3
"""V24 prototype-only Chromium check (NOT Product Astro certification).
Install playwright; set CHROMIUM_BIN if needed.
Usage: python standalone-smoke.py REFERENCE-V24.html
"""
import os, shutil, sys, json
from pathlib import Path
from playwright.sync_api import sync_playwright

html = Path(sys.argv[1] if len(sys.argv)>1 else Path(__file__).with_name("REFERENCE-V24.html")).read_text(encoding="utf-8")
cases = []
def check(label, ok):
    cases.append((label, bool(ok)))

with sync_playwright() as pw:
    browser_path = os.getenv("CHROMIUM_BIN") or shutil.which("chromium") or shutil.which("google-chrome")
    kwargs = {"headless": True}
    if browser_path: kwargs.update(executable_path=browser_path, args=["--no-sandbox"])
    browser = pw.chromium.launch(**kwargs)
    for w,h in [(320,740),(390,844),(900,300),(900,480),(1024,768),(1480,900),(1920,1080)]:
        page = browser.new_page(viewport={"width":w,"height":h}, reduced_motion="reduce")
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.set_content(html)
        facts = page.evaluate("""() => ({
          over:document.documentElement.scrollWidth>innerWidth+1,
          version:document.querySelector("#sideType").textContent.endsWith("V24"),
          y:document.querySelector("#collapse").getBoundingClientRect().top})""")
        check(f"no-overflow-{w}x{h}", not facts["over"])
        check(f"V24-label-{w}x{h}", facts["version"])
        check(f"no-js-errors-{w}x{h}", not errors)
        if w>780:
            page.evaluate("document.getElementById('collapse').click()")
            m=page.evaluate("""() => ({
              y:document.querySelector('#railExpand').getBoundingClientRect().top,
              inert:document.querySelector('.side-main').inert,
              expanded:document.querySelector('#railExpand').getAttribute('aria-expanded')})""")
            check(f"same-y-{w}",abs(facts["y"]-m["y"])<=1.5)
            check(f"inert-{w}",m["inert"])
            check(f"aria-{w}",m["expanded"]=="false")
        page.close()
    page=browser.new_page(viewport={"width":1480,"height":900},reduced_motion="reduce")
    errors=[]
    page.on("pageerror",lambda e: errors.append(str(e)))
    page.set_content(html)
    state=page.evaluate("""() => {let b=document.querySelector('[data-group][aria-expanded="true"]');
      const id=b.dataset.group;b.click();let x=document.getElementById('group-'+id);
      return {id, inert:x.inert,aria:x.getAttribute('aria-hidden')};}""")
    check("closing-branch-inert",state["inert"] and state["aria"]=="true")
    page.keyboard.press("ArrowDown")
    check("no-inert-focus",page.evaluate("!document.activeElement.closest('[inert],[hidden]')"))
    page.evaluate("""id=>{document.querySelector('[data-group="'+id+'"]').click()}""",state["id"])
    check("reopened-branch",page.evaluate("id=>!document.getElementById('group-'+id).inert",state["id"]))
    for btn,pop in [("sideMenu","siteMenuPanel"),("sidePrefs","prefsPanel"),("sideLibrary","libraryPanel")]:
        x=page.evaluate("""({b,p})=>{document.getElementById(b).click();
          const t=document.getElementById(b).getBoundingClientRect(),o=document.getElementById(p).getBoundingClientRect();
          return {visible:!document.getElementById(p).hidden,
            gap:Math.min(Math.abs(o.bottom-t.top),Math.abs(o.top-t.bottom)),
            inside:o.left>=0&&o.right<=innerWidth+1}}""",{"b":btn,"p":pop})
        check(f"{pop}-anchored",x["visible"] and x["gap"]<=18 and x["inside"])
        page.keyboard.press("Escape")
        check(f"{pop}-Escape",page.evaluate("id=>document.getElementById(id).hidden",pop))
    page.evaluate("document.querySelector('[data-mode=cycle]').click()")
    check("cycle-mode",page.evaluate("document.body.dataset.seriesTheme!==undefined"))
    page.evaluate("document.getElementById('topTheme').click()")
    check("quick-night",page.evaluate("document.body.classList.contains('night')"))
    page.evaluate("document.getElementById('topSave').click()")
    check("save-reflection",page.evaluate("document.getElementById('topSave').getAttribute('aria-pressed')==='true'"))
    check("no-interaction-errors",not errors)
    page.close()
    browser.close()

failures=[label for label,ok in cases if not ok]
print(json.dumps({"total":len(cases),"passed":len(cases)-len(failures),"failures":failures},ensure_ascii=False))
sys.exit(1 if failures else 0)
