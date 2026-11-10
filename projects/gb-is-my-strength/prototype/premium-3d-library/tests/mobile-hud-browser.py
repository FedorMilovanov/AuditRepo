"""Real HTTP-served Vite-build witness for the Premium 3D Library's touch HUD.

Run from the lab root after npm ci && npm run build and serving dist on localhost:
    GB_LIBRARY_TEST_URL=http://127.0.0.1:8771/ python tests/mobile-hud-browser.py

Requires the Playwright Python package and installed Chromium/WebKit binaries.
Desktop-GPU mobile emulation is NOT a physical Android performance test.
Failure is a real blocker; the test does not assert photorealistic art acceptance.
"""
import asyncio
import json
import os
import tempfile
from pathlib import Path

from playwright.async_api import async_playwright
from browser_runtime import launch_kwargs, test_context, capture_evidence

URL = os.environ.get("GB_LIBRARY_TEST_URL", "http://127.0.0.1:8771/")
EVIDENCE = Path(os.environ.get("GB_LIBRARY_HUD_EVIDENCE_DIR", tempfile.gettempdir()))


def overlap(a, b):
    return (a["x"] < b["x"] + b["width"] and
            a["x"] + a["width"] > b["x"] and
            a["y"] < b["y"] + b["height"] and
            a["y"] + a["height"] > b["y"])


async def inspect(browser, engine, width, height):
    context = await test_context(browser,
        viewport={"width": width, "height": height},
        device_scale_factor=1, is_mobile=True, has_touch=True,
        reduced_motion="reduce")
    page = await context.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("response", lambda r: errors.append(f"HTTP {r.status}: {r.url}") if r.status >= 400 else None)
    try:
        response = await page.goto(URL, wait_until="domcontentloaded", timeout=40000)
        assert response and response.status == 200, f"{engine}/{width}: HTML request failed"
        await page.get_by_role("button", name="Войти в библиотеку").click()
        await page.locator("div.fixed.inset-0.z-50").wait_for(state="detached", timeout=35000)

        toolbar = page.locator("[data-gb-toolbar]")
        joystick = page.locator("[data-gb-joystick]")
        await toolbar.wait_for(state="visible")
        await joystick.wait_for(state="visible")

        t = await toolbar.bounding_box()
        j = await joystick.bounding_box()
        assert t and j
        assert t["height"] <= 76, f"{engine}/{width}: toolbar wraps to {t['height']}px"
        assert t["width"] <= width + 1, f"{engine}/{width}: toolbar exceeds viewport"
        assert j["x"] >= 0 and j["x"] + j["width"] <= width + 1
        assert not overlap(t, j), f"{engine}/{width}: toolbar intersects joystick"

        hint = page.locator("[data-gb-help]")
        if await hint.count() and await hint.is_visible():
            h = await hint.bounding_box()
            assert h and not overlap(h, j), f"{engine}/{width}: help overlaps joystick: {h} vs {j}"

        more = page.get_by_role("button", name="Дополнительные действия")
        await more.click()
        menu = page.get_by_role("navigation", name="Дополнительные действия")
        await menu.wait_for(state="visible")
        assert await more.get_attribute("aria-expanded") == "true"
        menu_box = await menu.bounding_box()
        assert menu_box and not overlap(menu_box, j), f"{engine}/{width}: menu blocks joystick"
        assert await menu.get_by_role("button", name="Уровни").is_visible()
        await page.keyboard.press("Escape")
        await menu.wait_for(state="detached")
        assert await more.get_attribute("aria-expanded") == "false"

        # On tour start, touch movement control must disappear rather than
        # conflict with the bottom-aligned multi-step tour card.
        await more.click()
        await page.get_by_role("navigation", name="Дополнительные действия").get_by_role(
            "button", name="Экскурсия").click()
        await joystick.wait_for(state="detached")

        assert not await page.evaluate("document.documentElement.scrollWidth > innerWidth + 2"), (
            f"{engine}/{width}: horizontal overflow")
        assert not errors, f"{engine}/{width}: {errors}"
        EVIDENCE.mkdir(parents=True, exist_ok=True)
        shot = EVIDENCE / f"gb-library-touch-{engine}-{width}x{height}.png"
        await capture_evidence(page, shot)
        print(json.dumps({"engine": engine, "viewport": f"{width}x{height}",
                          "result": "PASS", "evidence": str(shot)}, ensure_ascii=False))
    finally:
        await context.close()


async def main():
    async with async_playwright() as playwright:
        for engine in ("chromium", "webkit"):
            browser_type = getattr(playwright, engine)
            browser = await browser_type.launch(**launch_kwargs(engine))
            try:
                for width, height in ((320, 760), (390, 844), (768, 1024)):
                    await inspect(browser, engine, width, height)
            finally:
                await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
