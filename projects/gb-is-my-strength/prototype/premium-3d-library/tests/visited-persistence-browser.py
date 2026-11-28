"""Negative browser witnesses for corrupt lab history: no blank map, no silent data wipe.

Actual UI journey in both Chromium and WebKit at 390x844, with persisted
localStorage seeded *before* application initialization. The 2D cabinet's
separate IndexedDB vault is not modified or mocked.
"""
import asyncio
import json
import os
import tempfile
from pathlib import Path
from playwright.async_api import async_playwright
from browser_runtime import launch_kwargs, test_context, capture_evidence

URL = os.getenv("GB_LIBRARY_TEST_URL", "http://127.0.0.1:8771/")
OUT = Path(os.getenv("GB_LIBRARY_VISITED_EVIDENCE_DIR",
                   str(Path(tempfile.gettempdir()) / "gb-library-visited-v534")))
BROKEN = (
    ("wrong-object", '{"legacy":true}'),
    ("json-null", "null"),
    ("mixed-array", '["articles", 123]'),
)

async def run_case(browser, engine: str, label: str, raw: str) -> None:
    context = await test_context(browser, viewport={"width":390,"height":844},
                                 device_scale_factor=1, is_mobile=True,
                                 has_touch=True, reduced_motion="reduce")
    page = await context.new_page()
    errors = []
    page.on("pageerror", lambda exc: errors.append("JS " + str(exc)))
    page.on("response", lambda r: errors.append(f"HTTP {r.status}: {r.url}")
            if r.status >= 400 else None)
    try:
        await page.add_init_script(
            'localStorage.setItem("gb-hall-seen", ' + json.dumps(raw) + ');')
        response = await page.goto(URL, wait_until="domcontentloaded", timeout=45000)
        assert response and response.status == 200
        await page.get_by_role("button", name="Войти в библиотеку").wait_for(
            state="visible", timeout=45000)
        intro_opener = page.locator('[data-gb-intro] button[title="Карта сайта"]')
        await intro_opener.click(timeout=15000)
        intro_dialog = page.get_by_role("dialog", name="Карта сайта")
        await intro_dialog.wait_for(state="visible", timeout=15000)
        assert await intro_dialog.get_by_role("searchbox", name="Поиск по карте сайта").is_visible()
        assert await intro_dialog.locator('button[title="Ссылка на это место"]').count() > 0
        assert await page.evaluate(
            'localStorage.getItem("gb-hall-seen")') == raw, "Corrupt raw history was erased or rewritten"
        await capture_evidence(page, OUT / f"{engine}-390x844-{label}-map.png")
        await page.keyboard.press("Escape")
        await intro_dialog.wait_for(state="detached", timeout=10000)
        assert not await page.evaluate("document.querySelector('#root').inert")
        await page.get_by_role("button", name="Войти в библиотеку").click(timeout=15000)
        await page.locator('[data-gb-intro]').wait_for(state="detached", timeout=20000)
        toolbar = page.locator('[data-gb-toolbar]')
        await toolbar.locator('button[title="Карта сайта"]:visible').first.click(timeout=12000)
        active_dialog = page.get_by_role("dialog", name="Карта сайта")
        await active_dialog.wait_for(state="visible", timeout=12000)
        assert await active_dialog.get_by_role("searchbox", name="Поиск по карте сайта").is_visible()
        assert await page.evaluate('localStorage.getItem("gb-hall-seen")') == raw
        assert not errors, (engine,label,errors)
        print(json.dumps({"engine":engine,"viewport":"390x844-"+label,
            "result":"PASS","errors":errors,"originalCorruptValuePreserved":True},
            ensure_ascii=True), flush=True)
    finally:
        await context.close()

async def main():
    async with async_playwright() as pw:
        for engine in ("chromium", "webkit"):
            browser = await getattr(pw, engine).launch(**launch_kwargs(engine))
            try:
                for label,raw in BROKEN:
                    await run_case(browser,engine,label,raw)
            finally:
                await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
