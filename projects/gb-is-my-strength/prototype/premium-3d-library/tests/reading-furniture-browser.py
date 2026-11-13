"""V5.36 reading-furniture browser evidence: actual public station journey.

Screenshots witness both centre book and project lectern at fixed public stops.
This does NOT inject camera matrices, assert owner art acceptance, or change
private data. Exact physical clearances have an independent Three.js geometry test.
"""
import asyncio
import json
import os
import re
import tempfile
from pathlib import Path
from playwright.async_api import async_playwright
from browser_runtime import launch_kwargs, test_context, capture_evidence

URL=os.getenv("GB_LIBRARY_TEST_URL","http://127.0.0.1:8771/")
OUT=Path(os.getenv("GB_LIBRARY_READING_EVIDENCE_DIR",
                str(Path(tempfile.gettempdir())/"gb-library-reading-v536")))

async def inspect(browser,engine,width,height,touch):
    context=await test_context(browser,viewport={"width":width,"height":height},
        device_scale_factor=1,is_mobile=touch,has_touch=touch,
        reduced_motion="reduce")
    page=await context.new_page()
    errors=[]
    page.on("pageerror",lambda e:errors.append("JS "+str(e)))
    page.on("response",lambda r:errors.append(f"HTTP {r.status}: {r.url}")
        if r.status>=400 else None)
    try:
        response=await page.goto(URL,wait_until="domcontentloaded",timeout=45000)
        assert response and response.status==200
        await page.get_by_role("button",name="Войти в библиотеку").click(timeout=45000)
        await page.locator("div.fixed.inset-0.z-50").wait_for(
            state="detached",timeout=45000)
        await page.wait_for_timeout(1200)
        center=OUT/f"{engine}-{width}x{height}-central.png"
        await capture_evidence(page,center)
        nav=page.locator('[data-gb-toolbar] button[title^="Карта сайта"]:visible').first
        await nav.evaluate("(el)=>el.click()")
        dialog=page.get_by_role("dialog",name="Карта сайта")
        await dialog.wait_for(state="visible",timeout=12000)
        search=dialog.get_by_role("searchbox",name="Поиск по карте сайта")
        await search.fill("Библиотека, где содержание")
        button=dialog.get_by_role("button",
            name=re.compile("Библиотека, где содержание")).first
        await button.wait_for(state="visible",timeout=12000)
        await button.evaluate("(el)=>el.click()")
        await dialog.wait_for(state="detached",timeout=15000)
        await page.wait_for_timeout(4200)
        report=await page.evaluate("""() => ({
            hasWebGL2:[...document.querySelectorAll('canvas')].some(
                c=>!!c.getContext('webgl2')),
            overflow:document.documentElement.scrollWidth>innerWidth+2,
            visibleTitle:document.body.innerText.includes(
                'БИБЛИОТЕКА, ГДЕ СОДЕРЖАНИЕ ВАЖНЕЕ ШУМА')
        })""")
        assert report["hasWebGL2"] and not report["overflow"] and report["visibleTitle"],report
        assert not errors,errors
        lectern=OUT/f"{engine}-{width}x{height}-lectern.png"
        await capture_evidence(page,lectern)

        # Public map arrival must aim at the ACTUAL interactive lectern page
        # rather than the bookshelves over it. Visitors can use the visible
        # 'Открыть' action for full-size readable text on touch and desktop.
        aim=page.locator("[data-gb-aim]")
        await aim.wait_for(state="visible",timeout=12000)
        assert "Библиотека, где содержание важнее шума" in await aim.inner_text()
        await aim.get_by_role("button",name=re.compile("Открыть")).click(timeout=10000)
        detail=page.get_by_role("dialog",name="Библиотека, где содержание важнее шума")
        await detail.wait_for(state="visible",timeout=10000)
        title=detail.get_by_role("heading",name="Библиотека, где содержание важнее шума")
        assert await title.is_visible()
        body=detail.locator("p").first
        assert "Авторские статьи" in await body.inner_text()
        readable=await page.evaluate("""() => {
          const d=document.querySelector('[role="dialog"][aria-labelledby="gb-detail-title"]');
          const p=d?.querySelector('p');
          if (!d || !p) return null;
          const r=p.getBoundingClientRect();
          return {focused:document.activeElement===d,
            fontPx:parseFloat(getComputedStyle(p).fontSize),
            textWidth:r.width, left:r.left, right:r.right,
            overflow:document.documentElement.scrollWidth > innerWidth + 2};
        }""")
        assert readable and readable["focused"] and readable["fontPx"]>=15,readable
        assert readable["textWidth"]>=200 and readable["left"]>=-1 and readable["right"]<=width+1,readable
        assert not readable["overflow"],readable
        detailShot=OUT/f"{engine}-{width}x{height}-readable-detail.png"
        await capture_evidence(page,detailShot)
        await detail.get_by_role("button",name="Вернуться в зал").click(timeout=10000)
        await detail.wait_for(state="detached",timeout=10000)
        assert not errors,errors
        print(json.dumps({"engine":engine,"viewport":f"{width}x{height}",
            "result":"PASS","center":str(center),"lectern":str(lectern),
            "readingScreenshot":str(detailShot),"readingPanelReadable":readable,
            "report":report,"errors":errors},ensure_ascii=True),flush=True)
    finally:
        await context.close()

async def main():
    async with async_playwright() as pw:
        for engine in ("chromium","webkit"):
            browser=await getattr(pw,engine).launch(**launch_kwargs(engine))
            try:
                for w,h,mobile in ((1440,900,False),(390,844,True)):
                    await inspect(browser,engine,w,h,mobile)
            finally:
                await browser.close()

if __name__=="__main__":
    asyncio.run(main())
