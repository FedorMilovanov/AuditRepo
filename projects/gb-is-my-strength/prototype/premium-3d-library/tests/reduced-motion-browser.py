"""Actual same-camera PNG witnesses for operating-system reduced-motion setting.

This test verifies visible changes, not just CSS media queries. It uses a real
public map journey (no injected renderer objects) and a stationary center crop.
Series is now a deliberately stationary physical bookshelf and must remain
unchanged under BOTH OS settings. The still-animated Biography exhibit must
freeze under reduce and visibly move under no-preference. This protects the
accessibility distinction without forcing decorative motion into Series.
Chromium and WebKit original PNG evidence is preserved for both stations.
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import os
import re
import struct
import tempfile
from pathlib import Path
from playwright.async_api import async_playwright
from browser_runtime import launch_kwargs, test_context

URL = os.getenv("GB_LIBRARY_TEST_URL", "http://127.0.0.1:8771/")
OUT = Path(os.getenv("GB_LIBRARY_MOTION_EVIDENCE_DIR",
                   str(Path(tempfile.gettempdir()) / "gb-library-reduced-motion")))
CLIP = {"x": 310, "y": 160, "width": 820, "height": 590}


async def inspect(browser, engine: str, preference: str):
    reduced = preference == "reduce"
    context = await test_context(
        browser, viewport={"width": 1440, "height": 900},
        device_scale_factor=1, reduced_motion=preference)
    page = await context.new_page()
    errors = []
    page.on("pageerror", lambda err: errors.append("JS " + str(err)))
    page.on("response", lambda response: errors.append(
        f"HTTP {response.status}: {response.url}")
        if response.status >= 400 else None)
    try:
        response = await page.goto(URL, wait_until="domcontentloaded", timeout=45000)
        assert response and response.status == 200
        assert await page.evaluate(
            "window.matchMedia('(prefers-reduced-motion: reduce)').matches"
        ) is reduced, ("Browser reduced-motion setting not applied", engine, preference)
        await page.get_by_role("button", name="Войти в библиотеку").click(timeout=45000)
        await page.locator("div.fixed.inset-0.z-50").wait_for(
            state="detached", timeout=45000)
        await page.wait_for_timeout(650)
        nav = page.locator('[data-gb-toolbar] button[title^="Карта сайта"]:visible').first
        await nav.evaluate("(el) => el.click()")
        panel = page.locator("aside")
        await panel.wait_for(state="visible", timeout=12000)
        await panel.get_by_role("button", name=re.compile("Серии")).first.evaluate(
            "(el) => el.click()")
        await panel.wait_for(state="detached", timeout=12000)
        # Actual movement/landing; do not teleport camera or short-circuit motion.
        await page.wait_for_timeout(4800)

        OUT.mkdir(parents=True, exist_ok=True)
        async def screenshot_pair(station: str):
            images = []
            hashes = []
            for index in range(2):
                if index:
                    await page.wait_for_timeout(1800)
                await page.evaluate(
                    "() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))")
                raw = await page.screenshot(
                    clip=CLIP, animations="disabled",
                    timeout=60000 if os.getenv("GB_LIBRARY_CI_SOFTWARE_GPU") == "1" else 30000)
                assert raw.startswith(bytes.fromhex("89504e470d0a1a0a")) and len(raw) > 5000
                assert struct.unpack(">II", raw[16:24]) == (CLIP["width"], CLIP["height"])
                shot = OUT / f"{engine}-{preference}-{station}-{index}.png"
                shot.write_bytes(raw)
                images.append(raw)
                hashes.append(hashlib.sha256(raw).hexdigest())
            return images, hashes

        # Art direction specifically bans the former flying Series book
        # animation: no-preference must NOT reactivate the neon orbit.
        series_images, series_hashes = await screenshot_pair("series")
        assert series_images[0] == series_images[1], (
            "Grounded Series bookcase must stay still under either motion preference",
            engine, preference, series_hashes)

        # Keep a strict, real visual accessibility witness in the remaining
        # intentionally animated Biography exhibit. This uses the public map,
        # not renderer state injection or a test-only moving visual element.
        await nav.evaluate("(el) => el.click()")
        await panel.wait_for(state="visible", timeout=12000)
        await panel.get_by_role(
            "searchbox", name="Поиск по карте сайта"
        ).fill("Биографии")
        await panel.get_by_role(
            "button", name=re.compile("Биографии")
        ).first.evaluate("(el) => el.click()")
        await panel.wait_for(state="detached", timeout=12000)
        await page.wait_for_timeout(4800)
        aim = page.locator("[data-gb-aim]")
        await aim.wait_for(state="visible", timeout=12000)
        assert "Биографии" in await aim.inner_text(), (
            "Biography animation reference target not reached", engine, preference)
        images, hashes = await screenshot_pair("biography")
        unchanged = images[0] == images[1]
        assert unchanged == reduced, (
            "Animated Biography must freeze under reduce and move without it",
            engine, preference, hashes)
        assert not errors, (engine, preference, errors)
        print(json.dumps({
            "engine": engine, "viewport": "1440x900",
            "preference": preference,
            "station": "bio", "sceneUnchanged": unchanged,
            "sha256": hashes,
            "seriesUnchanged": True, "seriesSha256": series_hashes,
            "result": "PASS", "errors": errors
        }, ensure_ascii=True), flush=True)
    finally:
        await context.close()


async def main():
    async with async_playwright() as playwright:
        for engine in ("chromium", "webkit"):
            browser = await getattr(playwright, engine).launch(**launch_kwargs(engine))
            try:
                for pref in ("reduce", "no-preference"):
                    await inspect(browser, engine, pref)
            finally:
                await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
