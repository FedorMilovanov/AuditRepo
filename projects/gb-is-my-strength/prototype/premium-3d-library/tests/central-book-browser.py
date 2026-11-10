"""Browser witness of the central book's physical page presentation (V5.12).

Uses normal intro CTA and actual Canvas; never injects a camera pose or
modifies app state. Screenshots are review evidence, NOT automatic proof of
physical accuracy or a substitute for expert art acceptance.
"""
import asyncio
import json
import os
import tempfile
from pathlib import Path
from playwright.async_api import async_playwright
from browser_runtime import launch_kwargs, test_context, capture_evidence

URL = os.environ.get("GB_LIBRARY_TEST_URL", "http://127.0.0.1:8771/")
EVIDENCE = Path(os.environ.get("GB_LIBRARY_BOOK_EVIDENCE_DIR",
                               str(Path(tempfile.gettempdir()) / "gb-library-central-book")))

async def inspect(browser, engine, width, height, mobile):
    context = await test_context(browser,
        viewport={"width": width, "height": height},
        device_scale_factor=1, is_mobile=mobile, has_touch=mobile,
        reduced_motion="reduce")
    page = await context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append("JS " + str(error)))
    page.on("response", lambda r: errors.append(f"HTTP {r.status}: {r.url}")
            if r.status >= 400 else None)
    try:
        response = await page.goto(URL, wait_until="domcontentloaded", timeout=45000)
        assert response and response.status == 200
        await page.get_by_role("button", name="Войти в библиотеку").click(timeout=45000)
        await page.locator("div.fixed.inset-0.z-50").wait_for(
            state="detached", timeout=45000)
        await page.wait_for_timeout(1250)
        report = await page.evaluate("""() => ({
            webgl2: [...document.querySelectorAll('canvas')].some(
                canvas => !!canvas.getContext('webgl2')),
            overflow: document.documentElement.scrollWidth > innerWidth + 2,
            viewport: [innerWidth, innerHeight]
        })""")
        assert report["webgl2"] and not report["overflow"], report
        assert report["viewport"] == [width, height], report
        assert not errors, errors
        EVIDENCE.mkdir(parents=True, exist_ok=True)
        path = EVIDENCE / f"{engine}-{width}x{height}-central-book.png"
        await capture_evidence(page, path)
        print(json.dumps({"engine": engine, "viewport": f"{width}x{height}",
                          "result": "PASS", "report": report,
                          "screenshot": str(path), "errors": errors},
                         ensure_ascii=False), flush=True)
    finally:
        await context.close()

async def main():
    async with async_playwright() as playwright:
        for engine in ("chromium", "webkit"):
            browser = await getattr(playwright, engine).launch(**launch_kwargs(engine))
            try:
                for width, height, mobile in ((1440, 900, False), (390, 844, True)):
                    await inspect(browser, engine, width, height, mobile)
            finally:
                await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
