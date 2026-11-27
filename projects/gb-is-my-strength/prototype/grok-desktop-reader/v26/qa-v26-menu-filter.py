#!/usr/bin/env python3
"""V26+ read-only menu-filter browser witness (prototype, NOT Product).
Requires installed Playwright browsers; reports skipped engines explicitly.
"""
from pathlib import Path
import re
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
HTML = (ROOT / "REFERENCE-V26.html").read_text(encoding="utf-8")
SIZES = [(1440, 900), (900, 480), (781, 300)]
def parse_rgb(value):
    if value.startswith("color(srgb "):
        return [float(n) * 255 for n in re.findall(r"\d+(?:\.\d+)?", value.split("srgb ", 1)[1])[:3]]
    if value.startswith("rgb"):
        return [float(n) for n in re.findall(r"\d+(?:\.\d+)?", value)[:3]]
    raise AssertionError("unknown computed CSS color: " + value)

def lightness(rgb):
    def to_linear(channel):
        v = channel / 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return sum(c * to_linear(v) for c, v in zip((.2126, .7152, .0722), rgb))

def contrast(a, b):
    bright, dark = sorted((lightness(parse_rgb(a)), lightness(parse_rgb(b))), reverse=True)
    return (bright + .05) / (dark + .05)

checks = 0
engines = []
with sync_playwright() as pw:
    for engine in (pw.chromium, pw.firefox, pw.webkit):
        try:
            browser = engine.launch(headless=True)
        except Exception as exc:
            print(f"SKIP {engine.name}: browser not installed or launch failed: {str(exc)[:160]}")
            continue
        engines.append(engine.name)
        try:
            for width, height in SIZES:
                page = browser.new_page(viewport={"width": width, "height": height}, reduced_motion="reduce")
                errors = []
                page.on("pageerror", lambda exc: errors.append(str(exc)))
                page.set_content(HTML)
                page.locator("#sideMenu").evaluate("(el) => el.click()")
                assert not page.locator("#siteMenuPanel").evaluate("(el) => el.hidden"), (engine.name, width, height, "panel closed")
                assert page.locator("#siteMenuFilter").evaluate("(el) => document.activeElement === el"), (engine.name, width, height, "focus")
                assert page.locator("#siteMenuLinks .menu-entry:not([hidden])").count() == 6
                assert page.locator("#siteMenuFilter").get_attribute("aria-controls") == "siteMenuLinks"
                for theme in ("light", "sepia", "night"):
                    page.evaluate("(theme) => setTheme(theme)", theme)
                    fg, bg = page.evaluate("""() => [
                        getComputedStyle(document.getElementById('siteMenuFilterStatus')).color,
                        getComputedStyle(document.getElementById('siteMenuPanel')).backgroundColor
                    ]""")
                    ratio = contrast(fg, bg)
                    assert ratio >= 4.5, (engine.name, width, height, theme, "insufficient text contrast", ratio)
                    checks += 1
                page.evaluate("setTheme('light')")
                if height <= 300:
                    nav_height = page.locator("#siteMenuLinks").evaluate("(el) => el.getBoundingClientRect().height")
                    assert nav_height >= 55, (engine.name, width, height, "scroll area too small", nav_height)
                checks += 4

                page.locator("#siteMenuFilter").fill("БИОГРАФИИ")
                assert page.locator("#siteMenuLinks .menu-entry:not([hidden])").count() == 1
                assert page.locator("#siteMenuLinks .menu-link-group:not([hidden])").count() == 1
                assert page.locator("#siteMenuLinks .menu-entry:not([hidden])").get_attribute("href").endswith("/biografii/")
                assert page.locator("#siteMenuEmpty").evaluate("(el) => el.hidden")
                checks += 4

                page.locator("#siteMenuFilter").fill("то чего нет на сайте")
                assert page.locator("#siteMenuLinks .menu-entry:not([hidden])").count() == 0
                assert not page.locator("#siteMenuEmpty").evaluate("(el) => el.hidden")
                assert page.locator("#siteMenuFilterStatus").inner_text() == "Совпадений нет"
                checks += 3

                page.locator("#siteMenuFilter").fill("книги циклы")
                assert page.locator("#siteMenuLinks .menu-entry:not([hidden])").count() == 1
                page.locator("#siteMenuClear").click()
                assert page.locator("#siteMenuLinks .menu-entry:not([hidden])").count() == 6
                assert page.locator("#siteMenuFilter").input_value() == ""
                checks += 3

                page.locator("#siteMenuFilter").fill("О ПРОЕКТЕ")
                page.locator("#siteMenuFilter").press("ArrowDown")
                assert page.locator("#siteMenuLinks .menu-entry:focus").count() == 1
                page.locator("#siteMenuLinks .menu-entry:focus").press("ArrowUp")
                assert page.locator("#siteMenuFilter:focus").count() == 1
                page.locator("#siteMenuFilter").press("Escape")
                assert page.locator("#siteMenuPanel").evaluate("(el) => el.hidden")
                assert page.locator("#sideMenu:focus").count() == 1
                assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1")

                assert not errors, (engine.name, width, height, errors)
                checks += 6
                page.close()
        finally:
            browser.close()
assert engines, "No Playwright browser available"
print(f"Menu-filter QA: {checks} assertions passed on {', '.join(engines)}, {len(SIZES)} viewports each. Prototype only.")

