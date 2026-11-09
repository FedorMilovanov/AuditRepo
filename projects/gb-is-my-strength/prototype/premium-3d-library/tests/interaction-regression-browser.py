"""P0/P1 browser regression: real tap-able landscape entry and modal focus isolation.

Usage:
 GB_LIBRARY_TEST_URL=http://127.0.0.1:18773/ python tests/interaction-regression-browser.py

Mobile settings use Playwright desktop GPU emulation. This is browser regression,
not physical Safari/iOS certification. Screenshots are outside the repository
unless GB_LIBRARY_INTERACTION_EVIDENCE_DIR explicitly chooses a path.
"""
import asyncio
import json
import os
import tempfile
from pathlib import Path
from playwright.async_api import async_playwright

URL=os.environ.get("GB_LIBRARY_TEST_URL","http://127.0.0.1:8771/")
OUT=Path(os.environ.get("GB_LIBRARY_INTERACTION_EVIDENCE_DIR",
                        str(Path(tempfile.gettempdir())/"gb-library-interaction-v58")))
CASES=[
    ("chromium",320,568,True),
    ("chromium",390,844,True),
    ("chromium",667,375,True),
    ("chromium",736,414,True),
    ("chromium",844,390,True),
    ("chromium",932,430,True),
    ("chromium",768,1024,True),
    ("chromium",1440,900,False),
    ("webkit",390,844,True),
    ("webkit",667,375,True),
    ("webkit",844,390,True),
    ("webkit",1440,900,False),
]

async def assert_modal(page):
    dialog=page.get_by_role("dialog",name="Карта сайта")
    await dialog.wait_for(state="visible",timeout=9000)
    assert await dialog.get_attribute("aria-modal")=="true"
    assert await dialog.get_by_role("searchbox",name="Поиск по карте сайта").is_visible()
    assert await dialog.get_by_role("button",name="Закрыть карту сайта").is_visible()
    state=await page.evaluate("""() => ({
      activeInDialog:!!document.activeElement?.closest('[data-gb-sitemap-dialog]'),
      rootInert:document.querySelector('#root')?.inert,
      dialogCount:document.querySelectorAll('[data-gb-sitemap-dialog]').length,
      actualFocus:document.activeElement?.tagName
    })""")
    assert state["activeInDialog"] and state["rootInert"] and state["dialogCount"]==1,state
    for _ in range(18):
        await page.keyboard.press("Tab")
        assert await page.evaluate("!!document.activeElement?.closest('[data-gb-sitemap-dialog]')"),"Tab escaped"
    for _ in range(18):
        await page.keyboard.press("Shift+Tab")
        assert await page.evaluate("!!document.activeElement?.closest('[data-gb-sitemap-dialog]')"),"Shift+Tab escaped"
    search=dialog.get_by_role("searchbox",name="Поиск по карте сайта")
    await search.fill("xxxxx-несуществующий-раздел")
    assert await dialog.get_by_text("В зале такого нет.").count()>=1
    await search.fill("")
    return dialog

async def run_case(browser,engine,w,h,touch):
    size=f"{w}x{h}"
    context=await browser.new_context(viewport={"width":w,"height":h},
        is_mobile=touch,has_touch=touch,device_scale_factor=1,reduced_motion="reduce")
    page=await context.new_page()
    errors=[]
    page.on("pageerror",lambda e:errors.append(str(e)))
    page.on("response",lambda r: errors.append(f"HTTP {r.status}: {r.url}") if r.status>=400 else None)
    try:
        response=await page.goto(URL,wait_until="domcontentloaded",timeout=40000)
        assert response and response.status==200
        button=page.get_by_role("button",name="Войти в библиотеку")
        await button.wait_for(state="visible",timeout=45000)
        await page.locator("div.fixed.inset-0.z-50").wait_for(state="detached",timeout=45000)
        await page.wait_for_timeout(300)
        geometry=await page.evaluate("""() => {
          const p=document.querySelector('[data-gb-intro]');
          const b=[...p.querySelectorAll('button')].find(x=>x.textContent.includes('Войти в библиотеку'));
          return {height:innerHeight,scrollHeight:p.scrollHeight,clientHeight:p.clientHeight,
            buttonTop:b.getBoundingClientRect().top,
            buttonBottom:b.getBoundingClientRect().bottom,
            rootScrollWidth:document.documentElement.scrollWidth}
        }""")
        assert geometry["rootScrollWidth"]<=w+2,geometry
        if h<=430 and geometry["buttonBottom"]>h:
            assert geometry["scrollHeight"]>geometry["clientHeight"],geometry

        # Use actual UI click and keyboard from the introduction.
        opener=page.locator('[data-gb-intro] button[title="Карта сайта"]')
        await opener.click(timeout=10000)
        dialog=await assert_modal(page)
        OUT.mkdir(parents=True,exist_ok=True)
        if size in ("844x390","390x844","1440x900"):
            await page.screenshot(path=str(OUT/f"{engine}-{size}-map.png"),animations="disabled")
        await page.keyboard.press("Escape")
        await dialog.wait_for(state="detached",timeout=10000)
        assert not await page.evaluate("document.querySelector('#root').inert"),"root stayed inert after Escape"
        assert await opener.evaluate("(el)=>document.activeElement===el"),"intro opener focus lost"

        # On 844x390 this was previously impossible with a real click.
        await button.click(timeout=12000)
        await page.locator('[data-gb-intro]').wait_for(state="detached",timeout=10000)
        await page.locator("div.fixed.inset-0.z-50").wait_for(state="detached",timeout=40000)
        assert not await page.evaluate("document.querySelector('#root').inert")
        if size in ("844x390","667x375","390x844","1440x900"):
            await page.screenshot(path=str(OUT/f"{engine}-{size}-hall.png"),animations="disabled")

        # Reopen via the public game keyboard shortcut (desktop), or real
        # toolbar tap (mobile), then ensure modal isolation and restoration.
        toolbar=page.locator('[data-gb-toolbar]')
        if touch:
            opener2=toolbar.locator('button[title="Карта сайта"]:visible').first
            await opener2.click(timeout=10000)
        else:
            await page.keyboard.press("KeyM")
        dialog=await assert_modal(page)
        await page.keyboard.press("Escape")
        await dialog.wait_for(state="detached",timeout=10000)
        assert not await page.evaluate("document.querySelector('#root').inert")
        if touch:
            assert await opener2.evaluate("(el)=>document.activeElement===el"),"toolbar opener focus lost"
        # No inert residue: normal controls can be used after dialog closes.
        assert await page.evaluate("!!document.querySelector('[data-gb-toolbar]')")

        print(json.dumps({"engine":engine,"viewport":size,"result":"PASS",
          "entryBefore":geometry,"errors":errors,"screenshotRoot":str(OUT)},ensure_ascii=True),flush=True)
        assert not errors,(engine,size,errors)
    finally:
        await context.close()

async def main():
    failures=[]
    async with async_playwright() as pw:
        for engine in ("chromium","webkit"):
            browser=await getattr(pw,engine).launch(headless=True,
                 **({"channel":"chrome"} if engine=="chromium" else {}))
            try:
                for e,w,h,touch in CASES:
                    if e!=engine:continue
                    try:
                        await run_case(browser,e,w,h,touch)
                    except Exception as exc:
                        failures.append((e,f"{w}x{h}",str(exc)[:800]))
                        print(json.dumps({"engine":e,"viewport":f"{w}x{h}","result":"FAIL","error":str(exc)[:800]},ensure_ascii=True),flush=True)
            finally:
                await browser.close()
    print(json.dumps({"total":len(CASES),"passed":len(CASES)-len(failures),"failures":failures},ensure_ascii=True),flush=True)
    if failures:raise SystemExit(1)

if __name__=="__main__":asyncio.run(main())
