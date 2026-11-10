"""V5.10 regression for first-load graphics-quality transitions.

The app must paint a labeled transition *before* replacing GPU resources,
hold it through any blocked frame, then return to the visible 3D hall.
Playwright desktop Chrome/WebKit only, not physical iOS or GPU frame timing.
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
OUT = Path(os.environ.get("GB_LIBRARY_QUALITY_EVIDENCE_DIR",
                          str(Path(tempfile.gettempdir()) / "gb-library-quality-v510")))
CASES = [
    ("chromium", 1440, 900, False),
    ("chromium", 390, 844, True),
    ("webkit", 1440, 900, False),
    ("webkit", 390, 844, True),
]

async def quality_control(page, touch):
    toolbar = page.locator("[data-gb-toolbar]")
    if touch:
        more = toolbar.get_by_role("button", name="Дополнительные действия")
        await more.evaluate("(el) => el.click()")
        control = page.get_by_role("navigation", name="Дополнительные действия").get_by_role(
            "button", name=re.compile(r"^Графика:"))
    else:
        control = toolbar.locator('button[title="Качество графики"]')
    return control

async def measure_once(page, engine, size, touch, attempt):
    control = await quality_control(page, touch)
    old_label = (await page.locator('[data-gb-toolbar] button[title="Качество графики"]').inner_text()).strip()
    assert old_label in ("Ультра", "Лёгкая"), (engine, size, old_label)
    await page.evaluate("""() => {
      window.__qualityCanvasBefore =
        [...document.querySelectorAll('canvas')].find(c => !!c.getContext('webgl2'));
    }""")
    # Software-rendered CI may take longer to compile the first high preset.
    # Still require BOTH actual transitions and no remaining overlay.
    limit_ms = 20000 if os.getenv("GB_LIBRARY_CI_SOFTWARE_GPU") == "1" else 5500
    trace = await control.evaluate("""async (button, options) => {
      const labelButton = document.querySelector('[data-gb-toolbar] button[title="Качество графики"]');
      const first = labelButton.textContent.trim();
      const perf = performance.now();
      const records = [];
      let previousState = "", framesOldQualityCovered = 0, last = 0, maxGap = 0;
      let sawCover = false, settledVisibleFrames = 0;
      return new Promise((resolve) => {
        function frame(timestamp) {
          if (last) maxGap = Math.max(maxGap, timestamp - last);
          last = timestamp;
          const layer = document.querySelector('[data-gb-quality-transition]');
          const current = labelButton.textContent.trim();
          const key = (layer ? "on" : "off") + "/" + current;
          if (key !== previousState) {
            records.push({at: +(performance.now() - perf).toFixed(1), key});
            previousState = key;
          }
          if (layer) sawCover = true;
          if (layer && current === first) framesOldQualityCovered++;
          // A complete transition must have painted the cover, changed the
          // quality label, removed the cover and painted two settled frames.
          settledVisibleFrames = sawCover && current !== first && !layer
            ? settledVisibleFrames + 1 : 0;
          const elapsed = performance.now() - perf;
          if (settledVisibleFrames >= 2 || elapsed > options.limitMs) {
            resolve({first,last:labelButton.textContent.trim(), elapsedMs:+elapsed.toFixed(1),
              timedOut: settledVisibleFrames < 2, settledVisibleFrames,
              records,framesOldQualityCovered,maxRafGapMs:+maxGap.toFixed(1),
              overlayGone:!document.querySelector('[data-gb-quality-transition]'),
              beigeVeilOpacity:document.querySelector('[data-gb-fade-veil]')?.style.opacity});
          } else requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
        button.click();
        // A rapid second input must not queue a stale second expensive build.
        if (!window.__qualityRapidTapProbed) {
          window.__qualityRapidTapProbed = true;
          button.click();
        }
      });
    }""", {"limitMs": limit_ms})
    assert not trace["timedOut"], ("Quality mutation exceeded its strict completion deadline", engine, size, trace)
    assert trace["first"] != trace["last"], (engine, size, trace)
    assert trace["framesOldQualityCovered"] >= 1, ("No prepared cover frame", trace)
    assert trace["overlayGone"], ("Quality overlay stuck", trace)
    assert trace["beigeVeilOpacity"] == "0", ("Beige veil triggered", trace)
    keys = [x["key"] for x in trace["records"]]
    assert any(x.startswith("on/") for x in keys), trace
    assert not keys[-1].startswith("on/"), trace
    canvas_same = await page.evaluate("""() => window.__qualityCanvasBefore ===
        [...document.querySelectorAll('canvas')].find(c=>!!c.getContext('webgl2'))""")
    assert canvas_same, (engine, size, "Canvas was replaced")
    visible = await page.locator("[data-gb-fade-veil]").is_visible()
    assert visible, "Fade host unexpectedly unmounted"
    OUT.mkdir(parents=True, exist_ok=True)
    return {**trace, "canvasIdentityRetained": canvas_same, "attempt": attempt}

async def run_case(browser, engine, width, height, touch):
    size = f"{width}x{height}"
    ctx = await test_context(browser,viewport={"width": width, "height": height},
                                    device_scale_factor=1, is_mobile=touch,
                                    has_touch=touch, reduced_motion="reduce")
    page = await ctx.new_page()
    problems = []
    page.on("pageerror", lambda exc: problems.append("JS " + str(exc)))
    page.on("response", lambda r: problems.append(f"HTTP {r.status}: {r.url}")
            if r.status >= 400 else None)
    try:
        response = await page.goto(URL, wait_until="domcontentloaded", timeout=40000)
        assert response and response.status == 200
        await page.get_by_role("button", name="Войти в библиотеку").click(timeout=40000)
        await page.locator("div.fixed.inset-0.z-50").wait_for(state="detached",
                                                              timeout=45000)
        await page.wait_for_timeout(600)
        original = []
        for i in (1, 2):
            original.append(await measure_once(page, engine, size, touch, i))
            # The mobile menu closes on selection; quality_control opens it
            # again for the next pass, observing the persistent toolbar state.
        # Capture AFTER the round trip: a slow software-GPU screenshot while
        # ultra is active can legitimately trigger AutoQuality's downgrade,
        # corrupting the second manual-transition witness.
        assert original[0]["first"] == original[1]["last"] and (
            original[0]["last"] == original[1]["first"]
        ), ("Manual quality round trip interrupted", engine, size, original)
        await page.screenshot(path=str(OUT / f"{engine}-{size}-after-quality.png"),
                              animations="disabled")
        assert not problems, (engine, size, problems)
        print(json.dumps({"engine": engine, "viewport": size, "result": "PASS",
                          "switches": original, "errors": problems}, ensure_ascii=True), flush=True)
    finally:
        await ctx.close()

async def main():
    async with async_playwright() as playwright:
        for engine in ("chromium", "webkit"):
            browser = await getattr(playwright, engine).launch(**launch_kwargs(engine))
            try:
                for e, w, h, touch in CASES:
                    if e == engine:
                        await run_case(browser, engine, w, h, touch)
            finally:
                await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
