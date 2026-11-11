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
from browser_runtime import launch_kwargs, test_context, capture_evidence

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

async def assert_modal(page, opened_evidence=None):
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
    # Capture the unmodified opening composition (before search focus or
    # keyboard travel can scroll a short landscape dialog).
    initial = await dialog.evaluate("""panel => {
        const title=panel.querySelector('#gb-sitemap-title')?.getBoundingClientRect();
        return {scrollTop:panel.scrollTop, titleTop:title?.top, titleBottom:title?.bottom};
    }""")
    assert initial["scrollTop"] <= 1 and initial["titleTop"] >= -1 and (
        initial["titleBottom"] <= page.viewport_size["height"]
    ), ("Map heading clipped immediately on opening", initial)
    if opened_evidence is not None:
        await capture_evidence(page, opened_evidence)
    # The map intentionally retains a reader's search when closed. Previous
    # assertions tested an empty search result and then reopened the map, so
    # desktop rows could be absent when the geometry probe ran. Clear the
    # actual visible search control and wait for the first real row.
    search = dialog.get_by_role("searchbox", name="Поиск по карте сайта")
    await search.fill("")
    await dialog.locator('button[title="Ссылка на это место"]').first.wait_for(
        state="visible", timeout=10000
    )
    # Real computed-styles / rendered geometry, not a class-name check.
    # The map must conceal the 3D/intro text underneath, and touch targets
    # must remain accessible even in the narrowest supported viewports.
    presentation = await dialog.evaluate("""panel => {
        const style = getComputedStyle(panel);
        const bg = style.backgroundColor;
        const link = panel.querySelector('button[title="Ссылка на это место"]');
        const external = panel.querySelector('a[title="Открыть на сайте"]');
        const close = panel.querySelector('button[aria-label="Закрыть карту сайта"]');
        const heading = panel.querySelector('#gb-sitemap-title')?.getBoundingClientRect();
        const sizes = [link, external, close].map(el => {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return [r.width, r.height];
        });
        return {background:bg, opacity:style.opacity, sizes,
            scrollTop:panel.scrollTop,
            headingTop:heading?.top, headingBottom:heading?.bottom};
    }""")
    assert presentation["background"] == "rgb(25, 33, 29)" and (
        presentation["opacity"] == "1"
    ), presentation
    assert all(s is not None and s[0] >= 43.5 and s[1] >= 43.5
               for s in presentation["sizes"]), presentation
    assert presentation["scrollTop"] <= 1 and (
        presentation["headingTop"] is not None
        and presentation["headingTop"] >= -1
        and presentation["headingBottom"] <= page.viewport_size["height"]
    ), ("Sitemap heading clipped/scrolled on opening", presentation)
    for _ in range(18):
        await page.keyboard.press("Tab")
        assert await page.evaluate("!!document.activeElement?.closest('[data-gb-sitemap-dialog]')"),"Tab escaped"
    for _ in range(18):
        await page.keyboard.press("Shift+Tab")
        assert await page.evaluate("!!document.activeElement?.closest('[data-gb-sitemap-dialog]')"),"Shift+Tab escaped"
    await search.fill("xxxxx-несуществующий-раздел")
    await dialog.get_by_text("В зале такого нет.").wait_for(state="visible", timeout=10000)
    await search.fill("")
    await dialog.locator('button[title="Ссылка на это место"]').first.wait_for(
        state="visible", timeout=10000
    )
    # The heading must remain legible *after* the search input takes focus
    # and rerenders its results. This exposed the old WebKit 844x390 bug,
    # although the as-opened screenshot was correctly framed.
    post_search = await dialog.evaluate("""panel => {
        const title = panel.querySelector('#gb-sitemap-title')?.getBoundingClientRect();
        const scroller = panel.querySelector('[data-gb-sitemap-scroll]');
        const view = panel.getBoundingClientRect();
        const initialScroll = scroller?.scrollTop;
        if (scroller) scroller.scrollTop = scroller.scrollHeight;
        const scrollReach = scroller?.scrollTop;
        const headerWhileResultsScrolled =
          panel.querySelector('#gb-sitemap-title')?.getBoundingClientRect();
        if (scroller) scroller.scrollTop = initialScroll || 0;
        return {
            titleTop:title?.top,titleBottom:title?.bottom,
            dialogTop:view.top,dialogBottom:view.bottom,
            panelScrollTop:panel.scrollTop, scrollReach,
            headerTopAfterScroll:headerWhileResultsScrolled?.top,
            scrollerHeight:scroller?.clientHeight,
            scrollerScrollHeight:scroller?.scrollHeight
        };
    }""")
    assert post_search["titleTop"] is not None and (
        post_search["titleTop"] >= -1
        and post_search["titleBottom"] <= page.viewport_size["height"] + 1
        and post_search["panelScrollTop"] <= 1
        and abs(post_search["headerTopAfterScroll"]-post_search["titleTop"]) <= 1
    ), ("Sitemap heading scrolled behind focused search/results", post_search)
    if post_search["scrollerScrollHeight"] > post_search["scrollerHeight"] + 12:
        assert post_search["scrollReach"] > 10, (
            "Sitemap results do not have a functioning independent scrollport",
            post_search
        )
    return dialog

async def run_case(browser,engine,w,h,touch):
    size=f"{w}x{h}"
    context=await test_context(browser,viewport={"width":w,"height":h},
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
        witness = OUT/f"{engine}-{size}-map-open.png" if size in (
            "844x390","390x844","1440x900"
        ) else None
        dialog=await assert_modal(page, opened_evidence=witness)
        OUT.mkdir(parents=True,exist_ok=True)
        if size in ("844x390","390x844","1440x900"):
            await capture_evidence(page, OUT/f"{engine}-{size}-map-after-search.png")
        await page.keyboard.press("Escape")
        await dialog.wait_for(state="detached",timeout=10000)
        assert not await page.evaluate("document.querySelector('#root').inert"),"root stayed inert after Escape"
        assert await opener.evaluate("(el)=>document.activeElement===el"),"intro opener focus lost"

        # On 844x390 this was previously impossible with a real click.
        await button.click(timeout=12000)
        await page.locator('[data-gb-intro]').wait_for(state="detached",timeout=10000)
        await page.locator("div.fixed.inset-0.z-50").wait_for(state="detached",timeout=40000)
        assert not await page.evaluate("document.querySelector('#root').inert")
        if touch and h <= 430:
            # Real computed geometry: short landscape must retain the 128px
            # joystick and site-map toolbar while clearing the scene's
            # central reading zone. Hints may expire after 9s on slow GPUs.
            hud = await page.evaluate("""() => {
              const rect = el => { const r=el.getBoundingClientRect(); return {
                left:r.left,right:r.right,top:r.top,bottom:r.bottom}; };
              const joystick=document.querySelector('[data-gb-joystick]');
              const minimap=document.querySelector('[data-gb-minimap]');
              const help=document.querySelector('[data-gb-help]');
              const nav=document.querySelector('[data-gb-toolbar] button[title="Карта сайта"]');
              const visible=el=>!!el && getComputedStyle(el).display!=='none';
              return {
                joystick:joystick && rect(joystick), visibleJoystick:visible(joystick),
                minimapHidden:!visible(minimap), minimapDetached:!minimap,
                mapAccessible:visible(nav),
                help:visible(help) ? rect(help) : null,
                compact:visible(help) && visible(help.querySelector('[data-gb-help-compact]')),
                fullHidden:!visible(help) || !visible(help.querySelector('[data-gb-help-full]')),
              };
            }""")
            assert hud["visibleJoystick"] and hud["minimapHidden"] and hud["minimapDetached"] and hud["mapAccessible"], hud
            if hud["help"]:
                assert hud["compact"] and hud["fullHidden"], hud
                assert hud["help"]["top"] > h * .75, hud
                assert hud["help"]["left"] > hud["joystick"]["right"] + 2, hud
                assert hud["help"]["bottom"] <= h + 1, hud
        if size in ("844x390","667x375","390x844","1440x900"):
            await capture_evidence(page, OUT/f"{engine}-{size}-hall.png")
        if touch and size == "667x375":
            # Regression for very narrow landscape: the old 19rem subtraction
            # produced a nearly zero-width multi-line hint. The optional
            # hint must disappear, not the functional movement/map controls.
            await page.set_viewport_size({"width":480,"height":320})
            await page.wait_for_function("innerWidth === 480 && innerHeight === 320")
            narrow = await page.evaluate("""() => {
              const shown = selector => {
                const el=document.querySelector(selector);
                return !!el && getComputedStyle(el).display!=='none';
              };
              return {
                help:shown('[data-gb-help]'),
                joystick:shown('[data-gb-joystick]'),
                map:shown('[data-gb-toolbar] button[title="Карта сайта"]'),
                minimap:shown('[data-gb-minimap]'),
                minimapDetached:!document.querySelector('[data-gb-minimap]'),
                overflow:document.documentElement.scrollWidth>innerWidth+2,
              };
            }""")
            assert not narrow["help"] and narrow["joystick"] and narrow["map"], narrow
            assert not narrow["minimap"] and narrow["minimapDetached"] and not narrow["overflow"], narrow
            await capture_evidence(page, OUT/f"{engine}-480x320-narrow-hall.png")
            await page.set_viewport_size({"width":w,"height":h})
            await page.wait_for_function(
                "([width,height]) => innerWidth === width && innerHeight === height",
                arg=[w,h])

        if touch and size == "844x390":
            # Responsive lifecycle: a large portrait tablet may show the map,
            # but returning to short landscape MUST unmount its canvas and
            # stop the requestAnimationFrame loop, not merely CSS-hide it.
            await page.set_viewport_size({"width":768,"height":1024})
            await page.locator('[data-gb-minimap]').wait_for(state="visible", timeout=12000)
            await page.set_viewport_size({"width":w,"height":h})
            await page.locator('[data-gb-minimap]').wait_for(state="detached", timeout=12000)

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
            browser = await getattr(pw,engine).launch(**launch_kwargs(engine))
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
