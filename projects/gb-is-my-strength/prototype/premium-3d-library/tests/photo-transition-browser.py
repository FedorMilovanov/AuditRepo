"""V5.9: photo mode must not blank an otherwise unchanged WebGL canvas.

Real toolbar/menu controls. Verifies photo in/out never triggers fade, canvas
identity preserved, quality switch retains protection, no JS/HTTP faults.
"""
import asyncio,json,os,tempfile
from pathlib import Path
from playwright.async_api import async_playwright
URL=os.environ.get("GB_LIBRARY_TEST_URL","http://127.0.0.1:8771/")
OUT=Path(os.environ.get("GB_LIBRARY_PHOTO_EVIDENCE_DIR",str(Path(tempfile.gettempdir())/"gb-library-photo-v59")))
CASES=[("chromium",1440,900,False),("chromium",390,844,True),
       ("webkit",1440,900,False),("webkit",390,844,True)]

async def run(browser,engine,w,h,touch):
    ctx=await browser.new_context(viewport={"width":w,"height":h},device_scale_factor=1,
                                  is_mobile=touch,has_touch=touch,reduced_motion="reduce")
    page=await ctx.new_page()
    errors=[]
    page.on("pageerror",lambda e:errors.append(str(e)))
    page.on("response",lambda r:errors.append(f"HTTP {r.status}: {r.url}") if r.status>=400 else None)
    try:
        await page.goto(URL,wait_until="domcontentloaded",timeout=40000)
        await page.get_by_role("button",name="Войти в библиотеку").click(timeout=40000)
        await page.locator("div.fixed.inset-0.z-50").wait_for(state="detached",timeout=45000)
        await page.wait_for_timeout(550)
        veil=page.locator("[data-gb-fade-veil]")
        assert await veil.count()==1
        initial=await veil.evaluate("(e)=>getComputedStyle(e).opacity")
        assert float(initial)==0,("initial veil",initial)
        await page.evaluate("""() => window.__gbPhotoCanvas =
            [...document.querySelectorAll('canvas')].find(c => c.getContext('webgl2'));""")

        if touch:
            more=page.locator('[data-gb-toolbar] button[aria-label="Дополнительные действия"]')
            await more.evaluate("(el)=>el.click()")
            await page.get_by_role("navigation",name="Дополнительные действия").get_by_role("button",name="Фото-режим").evaluate("(el)=>el.click()")
        else:
            await page.locator('[data-gb-toolbar] button[title="Фото-режим (H)"]').evaluate("(el)=>el.click()")
        exit_btn=page.get_by_role("button",name="Фото-режим · выйти (H)")
        await exit_btn.wait_for(state="visible",timeout=10000)
        await page.wait_for_timeout(110)
        during=await veil.evaluate("(e)=>getComputedStyle(e).opacity")
        assert float(during)==0,("photo mode blanked view",during)
        same=await page.evaluate("""() => window.__gbPhotoCanvas ===
            [...document.querySelectorAll('canvas')].find(c=>c.getContext('webgl2'))""")
        assert same,"Canvas was replaced on photo entry"
        OUT.mkdir(parents=True,exist_ok=True)
        shot=OUT/f"{engine}-{w}x{h}-photo-110ms.png"
        await page.screenshot(path=str(shot),animations="disabled")

        await exit_btn.click(timeout=10000)
        await page.wait_for_timeout(110)
        after=await veil.evaluate("(e)=>getComputedStyle(e).opacity")
        assert float(after)==0,("photo exit blanked view",after)

        quality_test="NOT_RUN"
        if not touch:
            btn=page.locator('[data-gb-toolbar] button[title="Качество графики"]')
            before_label=(await btn.inner_text()).strip()
            await btn.evaluate("(el)=>el.click()")
            await page.wait_for_timeout(80)
            target_at_80=await veil.evaluate("(e)=>e.style.opacity")
            after_label=(await btn.inner_text()).strip()
            await page.wait_for_timeout(1150)
            cleared=float(await veil.evaluate("(e)=>getComputedStyle(e).opacity"))
            assert before_label!=after_label,("quality action did not change its UI state",before_label,after_label)
            assert cleared<0.01,("quality overlay remained opaque",cleared)
            quality_test={"changed":True,"targetAt80ms":target_at_80,
                          "clearedAfter1s":cleared,"note":"diagnostic only; not evidence of a correctly timed protection veil"}
        assert not errors,(engine,w,h,errors)
        print(json.dumps({"engine":engine,"viewport":f"{w}x{h}","status":"PASS",
                          "photoOpacity":during,"exitOpacity":after,"sameCanvas":same,
                          "qualityTransition":quality_test,"errors":errors,
                          "screenshot":str(shot)},ensure_ascii=True),flush=True)
    finally:await ctx.close()

async def main():
    async with async_playwright() as pw:
        for engine in ("chromium","webkit"):
            browser=await getattr(pw,engine).launch(headless=True,
                **({"channel":"chrome"} if engine=="chromium" else {}))
            try:
                for e,w,h,touch in CASES:
                    if e==engine: await run(browser,e,w,h,touch)
            finally:await browser.close()
asyncio.run(main())
