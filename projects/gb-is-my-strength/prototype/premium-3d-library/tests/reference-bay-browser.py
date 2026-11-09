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
from browser_runtime import launch_kwargs, test_context

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
        await page.screenshot(path=str(shot))
        print(json.dumps({
            "engine": engine, "station": station, "viewport": f"{width}x{height}",
            "result": "PASS", "evidence": str(shot), **report
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
