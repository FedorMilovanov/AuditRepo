"""Real browser witness of fixed editorial viewpoints for the Premium 3D Library.

Execute against HTTP-served production build:
    GB_LIBRARY_TEST_URL=http://127.0.0.1:8771/ python tests/reference-bay-browser.py

Screenshots go to GB_LIBRARY_FOCUS_EVIDENCE_DIR or system temp, never overwrite
historic V5.2 art screenshots. PASS means browser/navigation correctness,
NOT owner approval, photographic resemblance or physical-phone FPS.
"""
import asyncio
import json
import os
import re
import tempfile
from pathlib import Path

from playwright.async_api import async_playwright
from browser_runtime import launch_kwargs, test_context, capture_evidence

URL = os.environ.get("GB_LIBRARY_TEST_URL", "http://127.0.0.1:8771/")
EVIDENCE = Path(os.environ.get("GB_LIBRARY_FOCUS_EVIDENCE_DIR",
                               str(Path(tempfile.gettempdir()) / "gb-library-reference-bay")))


async def inspect(browser, engine, station, station_label, width, height, mobile):
    context = await test_context(browser,
        viewport={"width": width, "height": height},
        device_scale_factor=1, is_mobile=mobile, has_touch=mobile,
        reduced_motion="reduce")
    page = await context.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append("JS " + str(e)))
    page.on("response", lambda r: errors.append(f"HTTP {r.status}: {r.url}") if r.status >= 400 else None)
    try:
        response = await page.goto(URL, wait_until="domcontentloaded", timeout=40000)
        assert response and response.status == 200
        await page.get_by_role("button", name="Войти в библиотеку").click()
        await page.locator("div.fixed.inset-0.z-50").wait_for(
            state="detached", timeout=40000)
        await page.wait_for_timeout(700)
        # Pointer lock can intercept a synthetic physical click. Invoke the
        # same public button handler as a map user; do not inject camera state.
        nav = page.locator('[data-gb-toolbar] button[title^="Карта сайта"]:visible').first
        await nav.evaluate("(el) => el.click()")
        panel = page.locator("aside")
        await panel.wait_for(state="visible", timeout=8000)
        station_button = panel.get_by_role("button", name=re.compile(station_label)).first
        await station_button.evaluate("(el) => el.click()")
        await panel.wait_for(state="detached", timeout=10000)
        await page.wait_for_timeout(3450)

        # A rendered screenshot can conceal fallback-font clipping.
        # Verify *actual* local font faces were loaded in this engine and
        # there exists a readable point size that fits all section titles.
        type_witness = await page.evaluate("""() => {
          const faces = [...document.fonts];
          const actual = faces.filter(f => /Cormorant Garamond|Inter/.test(f.family));
          const serif = actual.filter(f => /Cormorant Garamond/.test(f.family) && f.status==='loaded');
          const sans = actual.filter(f => /Inter/.test(f.family) && f.status==='loaded');
          const ctx = document.createElement('canvas').getContext('2d');
          const names = ['Статьи','Серии','Биографии','Карты','Конфессии'];
          const titles = names.map(name => {
            let px = 142, width = Infinity;
            for (; px>=76; px--) {
              ctx.font = '600 ' + px + 'px "Cormorant Garamond", Georgia, serif';
              width=ctx.measureText(name).width;
              if (width <= 884) break;
            }
            return {name,px,width};
          });
          return {serif:serif.length, sans:sans.length,
            check:document.fonts.check('600 142px "Cormorant Garamond"','Конфессии'),
            titles};
        }""")
        assert type_witness['serif'] and type_witness['sans'] and type_witness['check'], (
            'Local editorial fonts were not loaded before 3D textures', type_witness
        )
        assert all(t['px']>=76 and t['width']<=884.01
                   for t in type_witness['titles']), type_witness

        paused = await page.get_by_text("Нажмите, чтобы продолжить прогулку").is_visible()
        report = await page.evaluate("""() => ({
          hasWebGL2: [...document.querySelectorAll('canvas')].some(
            canvas => Boolean(canvas.getContext('webgl2'))),
          overflow: document.documentElement.scrollWidth > innerWidth + 2,
          transferBytes: performance.getEntriesByType('resource').reduce(
            (sum, r) => sum + (r.transferSize || 0), 0)
        })""")
        assert not paused, f"{engine}/{station}: unexpected pause dialog"
        assert report["hasWebGL2"] and not report["overflow"], report
        assert not errors, f"{engine}/{station}: {errors}"

        EVIDENCE.mkdir(parents=True, exist_ok=True)
        shot = EVIDENCE / f"{engine}-{station}-{width}x{height}.png"
        # A fully rendered frame on the CI CPU-only SwiftShader backend is
        # slower than a physical accelerated GPU. Still require a real lossless
        # screenshot with the correct dimensions; never skip the capture.
        capture = await capture_evidence(page, shot)
        capture_ms = capture["captureMs"]
        archive = None
        detail_shot = None
        lower_shot = None
        if station == "creeds":
            # A physical 3D cover need not have microscopic text enlarged.
            # Visitors must be able to use the REAL public Open action for
            # readable museum metadata sourced from the exact same TS model.
            aim = page.locator("[data-gb-aim]")
            open_button = aim.get_by_role("button", name=re.compile("Открыть"))
            await open_button.wait_for(state="visible", timeout=12000)
            # Pointer Lock routes physical desktop clicks to the WebGL canvas.
            # The documented desktop control is the real E key; a touch user
            # instead activates the visible HTML button with a genuine tap.
            # Neither path injects DOM click handlers or mutates store state.
            if mobile:
                await open_button.click(timeout=15000)
                open_input = "touch-button"
            else:
                await page.keyboard.press("e")
                open_input = "desktop-key-E"
            detail = page.get_by_role("dialog", name="Конфессии")
            await detail.wait_for(state="visible", timeout=12000)
            region = detail.get_by_role("region", name="Исторические документы")
            await region.wait_for(state="visible", timeout=12000)
            entries = region.locator("[data-gb-confession-entry]")
            assert await entries.count() == 4, "Wrong number of archival records"
            historical_dates = ["1530", "1563", "1646", "1677/1689"]
            for i, date in enumerate(historical_dates):
                item = entries.nth(i)
                assert date in await item.inner_text(), (engine, width, date)
                assert await item.locator("[data-gb-confession-title]").count() == 1
            archive = await page.evaluate("""() => {
              const d=document.querySelector('[role="dialog"][aria-labelledby="gb-detail-title"]');
              const r=d?.querySelector('[data-gb-confessions-list]');
              const titles=[...(r?.querySelectorAll('[data-gb-confession-title]') || [])];
              const entries=[...(r?.querySelectorAll('[data-gb-confession-entry]') || [])];
              const width=innerWidth;
              return {focused:document.activeElement===d,
                count:entries.length,
                minFontPx:titles.length ? Math.min(...titles.map(
                  n=>parseFloat(getComputedStyle(n).fontSize))) : 0,
                allInside:entries.every(n=>{
                  const b=n.getBoundingClientRect();
                  return b.left>=-1 && b.right<=width+1;
                }),
                overflow:document.documentElement.scrollWidth>innerWidth+2,
                titleTexts:titles.map(n=>n.innerText.trim())
              };
            }""")
            assert archive["focused"] and archive["count"] == 4 and (
                archive["minFontPx"] >= 16 and archive["allInside"]
                and not archive["overflow"]
            ), (engine, width, archive)
            detail_shot = EVIDENCE / f"{engine}-creeds-{width}x{height}-readable-archive.png"
            await capture_evidence(page, detail_shot)
            await entries.last.scroll_into_view_if_needed(timeout=10000)
            assert await entries.last.is_visible(), "Baptist archive is not reachable by scrolling"
            lower_shot = EVIDENCE / f"{engine}-creeds-{width}x{height}-archive-bottom.png"
            await capture_evidence(page, lower_shot)
            await detail.get_by_role("button", name="Вернуться в зал").click(timeout=12000)
            await detail.wait_for(state="detached", timeout=10000)
        assert not errors, f"{engine}/{station}: errors during screenshot: {errors}"
        print(json.dumps({
            "engine": engine, "station": station, "viewport": f"{width}x{height}",
            "result": "PASS", "evidence": str(shot),
            "screenshotMs": capture_ms, "errors": errors,
            "archive": archive, "detailScreenshot": str(detail_shot) if detail_shot else None,
            "bottomScreenshot": str(lower_shot) if lower_shot else None,
            "typography":type_witness, "openInput": open_input if station == "creeds" else None, **report
        }, ensure_ascii=False), flush=True)
    finally:
        await context.close()


async def main():
    async with async_playwright() as playwright:
        for engine in ("chromium", "webkit"):
            browser = await getattr(playwright, engine).launch(**launch_kwargs(engine))
            try:
                for width, height, mobile in ((1440, 900, False), (390, 844, True)):
                    await inspect(browser, engine, "creeds", "Конфессии", width, height, mobile)
                if engine == "chromium":
                    await inspect(browser, engine, "c-otst", "Отступники: отступничество", 1440, 900, False)
            finally:
                await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
