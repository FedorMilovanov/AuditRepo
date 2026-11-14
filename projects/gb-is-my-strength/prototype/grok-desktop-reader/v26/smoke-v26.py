#!/usr/bin/env python3
"""Self-contained V26 Chromium witness. Use in the v26 directory; requires playwright."""
from pathlib import Path
from playwright.sync_api import sync_playwright

html = Path(__file__).with_name("REFERENCE-V26.html").read_text(encoding="utf-8")
checks = 0
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    for width, height in [(781, 300), (900, 300), (900, 480), (1024, 768), (1480, 900)]:
        page = browser.new_page(viewport={"width": width, "height": height}, reduced_motion="reduce")
        errors = []
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        page.set_content(html)
        state = page.evaluate("""() => ({
            nav: document.getElementById('nav').getBoundingClientRect().height,
            overflow: document.documentElement.scrollWidth - innerWidth,
            y: document.getElementById('collapse').getBoundingClientRect().top,
            ids: [...document.querySelectorAll('[id]')].map(n => n.id)
        })""")
        assert state["overflow"] <= 1, (width, height, "horizontal overflow", state)
        assert len(state["ids"]) == len(set(state["ids"])), (width, height, "duplicate DOM IDs")
        if height == 300:
            assert state["nav"] >= 95, (width, height, "TOC squeezed", state)
            for cmd in ("sideMenu", "sidePrefs", "sidePrint", "sideShare", "sideLibrary"):
                assert page.locator("#" + cmd).is_visible(), cmd
        page.evaluate("document.getElementById('collapse').click()")
        after = page.evaluate("""() => ({
            y: document.getElementById('railExpand').getBoundingClientRect().top,
            inert: document.getElementById('tocFull').inert,
            aria: document.getElementById('railExpand').getAttribute('aria-expanded')
        })""")
        assert abs(after["y"] - state["y"]) <= 1.5, (width, height, "collapse/expand moved")
        assert after["inert"] and after["aria"] == "false"
        assert not errors, errors
        checks += 5
        page.close()
    page = browser.new_page(viewport={"width": 1480, "height": 900}, reduced_motion="reduce")
    page.set_content(html)
    page.evaluate("chooseSection(2);chooseSection(4)")
    page.evaluate("history.back()")
    page.wait_for_timeout(180)
    assert page.evaluate("state.section") == 2
    page.evaluate("history.back()")
    page.wait_for_timeout(180)
    assert page.evaluate("state.section") == 0 and page.evaluate("location.hash") == ""
    page.evaluate("history.forward()")
    page.wait_for_timeout(180)
    assert page.evaluate("state.section") == 2
    checks += 3
    browser.close()
print(f"V26 smoke: {checks} checks passed (Chromium only; not Product integration).")
