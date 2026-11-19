"""Public UI witness of the open stone entrance, no camera/state injection.

The tour's first stop ("Порог") supplies the real view; the photo-mode
capture proves the framed entrance remains visible without the HUD.
Structural clearance is independently verified by entrance-geometry.mjs.
"""
import asyncio
import hashlib
import json
import os
import tempfile
from pathlib import Path

from playwright.async_api import async_playwright
from browser_runtime import launch_kwargs, test_context, capture_evidence

URL = os.environ.get("GB_LIBRARY_TEST_URL", "http://127.0.0.1:8771/")
OUT = Path(os.environ.get(
    "GB_LIBRARY_ENTRANCE_EVIDENCE_DIR",
    str(Path(tempfile.gettempdir())/"gb-library-entrance")))


async def inspect(browser, engine, width, height, mobile):
    context = await test_context(browser,
        viewport={"width":width,"height":height},
        device_scale_factor=1, is_mobile=mobile, has_touch=mobile,
        reduced_motion="reduce")
    page = await context.new_page()
    errors=[]
    page.on("pageerror",lambda err: errors.append("JS "+str(err)))
    page.on("response",lambda res: errors.append(
        f"HTTP {res.status}: {res.url}") if res.status >= 400 else None)
    try:
        res=await page.goto(URL,wait_until="domcontentloaded",timeout=40000)
        assert res and res.status == 200
        await page.get_by_role("button",name="Войти в библиотеку").click(timeout=35000)
        await page.locator("div.fixed.inset-0.z-50").wait_for(
            state="detached",timeout=40000)
        await page.wait_for_timeout(600)
        before=OUT/f"{engine}-{width}x{height}-before.png"
        await capture_evidence(page,before)
        # Start the actual user's guided tour; the first stop is the entrance.
        if mobile:
            await page.get_by_role("button",name="Дополнительные действия").evaluate(
                "(el)=>el.click()")
            await page.get_by_role("navigation",name="Дополнительные действия").get_by_role(
                "button",name="Экскурсия").evaluate("(el)=>el.click()")
        else:
            # The actual pointer lock can cover a synthesized Playwright click;
            # invoke the public toolbar DOM handler, never inject app/camera state.
            await page.locator('[data-gb-toolbar] button[title^="Экскурсия"]:visible').evaluate(
                "(el)=>el.click()")
        card=page.locator("[data-gb-tour-card]")
        await card.wait_for(state="visible",timeout=12000)
        assert "порог" in (await card.inner_text()).casefold(), (
            "Historic first tour stop changed",await card.inner_text())
        await card.get_by_role("button",name="Дальше").click()
        await page.wait_for_function("""() => {
            const c=document.querySelector('[data-gb-tour-card]');
            return !!c && c.innerText.toLowerCase().includes('входной портал');
        }""",timeout=9000)
        await page.wait_for_timeout(1700)
        await card.get_by_role("button",name="Выйти").click()
        await card.wait_for(state="detached",timeout=12000)
        arrival=OUT/f"{engine}-{width}x{height}-portico.png"
        await capture_evidence(page,arrival)
        assert hashlib.sha256(before.read_bytes()).digest() != (
            hashlib.sha256(arrival.read_bytes()).digest()), "Public tour never moved to entrance"
        state=await page.evaluate("""() => ({
          hasWebGL2:[...document.querySelectorAll('canvas')].some(
            c=>Boolean(c.getContext('webgl2'))),
          overflow:document.documentElement.scrollWidth>innerWidth+2,
          tourGone:!document.querySelector('[data-gb-tour-card]'),
          paused:document.body.innerText.includes('Нажмите, чтобы продолжить прогулку')
        })""")
        assert state["hasWebGL2"] and not state["overflow"] and (
            state["tourGone"] and not state["paused"]),state
        assert not errors, errors
        print(json.dumps({
            "engine":engine,"viewport":f"{width}x{height}",
            "result":"PASS","before":str(before),"entrance":str(arrival),
            "tourArrived":True, "report":state,"errors":errors
        },ensure_ascii=True),flush=True)
    finally:
        await context.close()


async def main():
    async with async_playwright() as p:
        for engine in ("chromium","webkit"):
            browser=await getattr(p,engine).launch(**launch_kwargs(engine))
            try:
                for w,h,mobile in ((1440,900,False),(390,844,True)):
                    await inspect(browser,engine,w,h,mobile)
            finally:
                await browser.close()

if __name__=="__main__":
    asyncio.run(main())
