"""Actual same-camera PNG witnesses for operating-system reduced-motion setting.

This test verifies visible changes, not just CSS media queries. It uses a real
public map journey (no injected renderer objects) and a stationary center crop.
Decorative content MUST freeze under reduce and MUST move under no-preference,
including in Chromium and WebKit. Screenshots are preserved as PNG evidence.
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

        images = []
        hashes = []
        OUT.mkdir(parents=True, exist_ok=True)
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
            shot = OUT / f"{engine}-{preference}-{index}.png"
            shot.write_bytes(raw)
            images.append(raw)
            hashes.append(hashlib.sha256(raw).hexdigest())

        unchanged = images[0] == images[1]
        assert unchanged == reduced, (
            "Reduced-motion visual scene must be static; normal scene must move",
            engine, preference, hashes)
        assert not errors, (engine, preference, errors)
        print(json.dumps({
            "engine": engine, "viewport": "1440x900",
            "preference": preference, "sceneUnchanged": unchanged,
            "sha256": hashes, "result": "PASS", "errors": errors
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
