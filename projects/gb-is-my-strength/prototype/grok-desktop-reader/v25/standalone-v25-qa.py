#!/usr/bin/env python3
"""Bounded standalone Chromium regression smoke for V25; NOT Product certification.

Usage: python standalone-v25-qa.py REFERENCE-V25.html
Requires playwright and Chromium (CHROMIUM_BIN to override).
Navigation to local server/real reload is NOT covered by set_content.
"""
from pathlib import Path
import os, shutil, sys, json
from playwright.sync_api import sync_playwright

source = Path(sys.argv[1] if len(sys.argv)>1 else Path(__file__).with_name("REFERENCE-V25.html"))
html = source.read_text(encoding="utf-8")
results = []
def check(label, ok):
    results.append((label, bool(ok)))

with sync_playwright() as p:
    binary = os.getenv("CHROMIUM_BIN") or shutil.which("chromium")
    kw = {"headless": True}
    if binary:
        kw.update(executable_path=binary, args=["--no-sandbox"])
    browser = p.chromium.launch(**kw)
    for width,height in [(320,740),(390,844),(781,300),(900,480),(1024,768),(1480,900),(1920,1080)]:
        page = browser.new_page(viewport={"width":width,"height":height},reduced_motion="reduce")
        errors = []
        page.on("pageerror",lambda e:errors.append(str(e)))
        page.set_content(html)
        check(f"{width}x{height} no overflow",
              page.evaluate("document.documentElement.scrollWidth <= innerWidth+1"))
        check(f"{width}x{height} V25 label",
              page.evaluate("document.getElementById('sideType').textContent.includes('V25')"))
        if width>780:
            y=page.locator("#collapse").bounding_box()["y"]
            page.evaluate("document.getElementById('collapse').click()")
            check(f"{width}x{height} aligned expand",abs(page.locator("#railExpand").bounding_box()["y"]-y)<1.5)
            check(f"{width}x{height} inert full",page.evaluate("document.getElementById('tocFull').inert"))
        check(f"{width}x{height} no JS page errors",not errors)
        page.close()
    page=browser.new_page(viewport={"width":1480,"height":900},reduced_motion="reduce")
    errors=[]
    page.on("pageerror",lambda e:errors.append(str(e)))
    page.set_content(html)
    check("collapsed part reopens on direct section",
          page.evaluate("""() => {
             const button=document.querySelector('[data-subtree-toggle][aria-expanded="true"]');
             button.click();chooseSection(2);
             const current=document.getElementById('section-list-'+state.part);
             return !current.inert&&!current.hidden &&
               document.querySelector('a[data-section="2"]').getAttribute('aria-current')==='location';
          }"""))
    check("rerender restores navigation link focus",
          page.evaluate("""() => {
             const a=document.querySelector('a[data-section="1"]');
             a.focus();updateNav();
             return document.activeElement.dataset.section==='1';
          }"""))
    for trigger,panel in [("sideMenu","siteMenuPanel"),("sidePrefs","prefsPanel"),("sideLibrary","libraryPanel")]:
        r=page.evaluate("""({trigger,panel})=>{
           const t=document.getElementById(trigger);t.click();
           const p=document.getElementById(panel),a=t.getBoundingClientRect(),b=p.getBoundingClientRect();
           return !p.hidden && b.left>=0 && b.right<=innerWidth+1 &&
             Math.min(Math.abs(b.bottom-a.top),Math.abs(b.top-a.bottom))<=18;
        }""",{"trigger":trigger,"panel":panel})
        check(f"{panel} anchored to trigger",r)
        page.keyboard.press("Escape")
        check(f"{panel} Escape",page.evaluate("id=>document.getElementById(id).hidden",panel))
    page.evaluate("document.getElementById('topTheme').click()")
    check("quick theme night",page.evaluate("document.body.classList.contains('night')"))
    check("no errors",not errors)
    page.close()
    browser.close()

failed=[name for name,ok in results if not ok]
print(json.dumps({"tested":len(results),"passed":len(results)-len(failed),"failed":failed},ensure_ascii=False))
sys.exit(1 if failed else 0)
