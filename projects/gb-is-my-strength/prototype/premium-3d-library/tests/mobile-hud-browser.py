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
        minimap = page.locator("[data-gb-minimap]")
        if width >= 640:
            await minimap.wait_for(state="visible", timeout=10000)
        else:
            assert await minimap.count() == 0, (
                f"{engine}/{width}: CSS-hidden minimap still mounted and rendering frames"
            )

        hint = page.locator("[data-gb-help]")
        if await hint.count() and await hint.is_visible():
            h = await hint.bounding_box()
            assert h and not overlap(h, j), f"{engine}/{width}: help overlaps joystick: {h} vs {j}"
            if width <= 390:
                # Portrait help must be an unobtrusive compact chip to the
                # RIGHT of the joystick, not over the in-world reading page.
                assert await hint.get_attribute("data-gb-hint-mode") == "desktop"
                assert h["x"] >= j["x"] + j["width"] + 8, (engine, width, h, j)
                assert h["y"] >= height * 0.77, (engine, width, h)
                assert h["x"] + h["width"] <= width + 1, (engine, width, h)
                assert await hint.locator("[data-gb-help-compact]").is_visible()
                assert not await hint.locator("[data-gb-help-full]").is_visible()
                await capture_evidence(page, EVIDENCE /
                    f"gb-library-touch-{engine}-{width}x{height}-help.png")

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

        # The long-titled Project lectern exposed an actual fixed HUD clipping
        # defect on 320/390px: the page's scrollWidth remained in-bounds,
        # while the flex child grew to 506px and the Open button escaped right.
        # Navigate through the real public map and assert each actionable
        # physical bounding box, not only document horizontal overflow.
        map_button = page.locator(
            '[data-gb-toolbar] button[title^="Карта сайта"]:visible'
        ).first
        await map_button.evaluate("(el) => el.click()")
        map_dialog = page.get_by_role("dialog", name="Карта сайта")
        await map_dialog.wait_for(state="visible")
        await map_dialog.get_by_role(
            "searchbox", name="Поиск по карте сайта"
        ).fill("Библиотека, где содержание важнее шума")
        await map_dialog.get_by_role(
            "button", name="Библиотека, где содержание важнее шума"
        ).first.evaluate("(el) => el.click()")
        await map_dialog.wait_for(state="detached", timeout=12000)
        aim = page.locator("[data-gb-aim]")
        await aim.wait_for(state="visible", timeout=16000)
        open_button = aim.get_by_role("button", name="Открыть")
        await open_button.wait_for(state="visible")
        aim_box = await aim.locator(":scope > div").bounding_box()
        button_box = await open_button.bounding_box()
        assert aim_box and button_box
        assert aim_box["x"] >= 11 and (
            aim_box["x"] + aim_box["width"] <= width - 11
        ), f"{engine}/{width}: lectern HUD content clips viewport: {aim_box}"
        assert button_box["x"] >= 11 and (
            button_box["x"] + button_box["width"] <= width - 11
        ), f"{engine}/{width}: lectern Open button clips viewport: {button_box}"
        assert button_box["width"] >= 75, (
            f"{engine}/{width}: Open button was squeezed until unreadable"
        )
        assert not overlap(aim_box, j), (
            f"{engine}/{width}: lectern HUD overlaps touch joystick"
        )
        EVIDENCE.mkdir(parents=True, exist_ok=True)
        await capture_evidence(page, EVIDENCE /
            f"gb-library-touch-{engine}-{width}x{height}-aim.png")
        # The CTA must still work via real touch after adaptive reflow.
        await open_button.click(timeout=12000)
        detail = page.get_by_role("dialog")
        await detail.wait_for(state="visible", timeout=15000)
        assert "Библиотека, где содержание важнее шума" in (
            await detail.inner_text()
        ), f"{engine}/{width}: Project detail failed to open"
        await detail.get_by_role(
            "button", name="Вернуться в зал"
        ).click(timeout=12000)
        await detail.wait_for(state="detached", timeout=10000)

        # On tour start, touch movement control must disappear rather than
        # conflict with the bottom-aligned multi-step tour card.
        await more.click()
        await page.get_by_role("navigation", name="Дополнительные действия").get_by_role(
            "button", name="Экскурсия").click()
        await joystick.wait_for(state="detached")
        tour = page.locator("[data-gb-tour-card]")
        await tour.wait_for(state="visible", timeout=10000)
        # A guided reading panel is the primary bottom overlay. The
        # navigation minimap must not remain visible underneath it at
        # tablet width or consume frames out of sight.
        minimap = page.locator("[data-gb-minimap]")
        assert not await minimap.is_visible(), (
            f"{engine}/{width}: minimap overlaps a guided tour panel"
        )
        card = await tour.bounding_box()
        assert card and card["x"] >= -1 and (
            card["x"] + card["width"] <= width + 1
        ), (engine, width, card)

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
