"""Repeatable WebGL draw-call/rAF witness for the isolated Premium 3D Library.

Serve 'dist' over HTTP, then run:
  GB_LIBRARY_TEST_URL=http://127.0.0.1:8771/ python tests/render-performance-browser.py

Optional machine-specific draw-call budgets:
  GB_LIBRARY_MAX_DRAW_CALLS_DESKTOP and GB_LIBRARY_MAX_DRAW_CALLS_MOBILE

This does not measure GPU frame time; desktop touch emulation is not real Android.
"""
import asyncio
import json
import os
from playwright.async_api import async_playwright

URL = os.environ.get("GB_LIBRARY_TEST_URL", "http://127.0.0.1:8771/")
INIT = r"""
(() => {
  window.__gbDraws = 0;
  const proto = window.WebGL2RenderingContext?.prototype ||
                window.WebGLRenderingContext?.prototype;
  if (!proto) return;
  for (const name of ["drawElements", "drawArrays", "drawElementsInstanced", "drawArraysInstanced"]) {
    const old = proto[name];
    if (typeof old !== "function") continue;
    Object.defineProperty(proto, name, {
      configurable: true,
      value: function (...args) { window.__gbDraws++; return old.apply(this, args); }
    });
  }
})();
"""


async def measure(browser, engine, width, height, touch):
    context = await browser.new_context(
        viewport={"width": width, "height": height},
        device_scale_factor=1, is_mobile=touch, has_touch=touch,
        reduced_motion="reduce")
    page = await context.new_page()
    await page.add_init_script(INIT)
    errors = []
    page.on("pageerror", lambda e: errors.append("JS " + str(e)))
    page.on("response", lambda r: errors.append(
        f"HTTP {r.status}: {r.url}") if r.status >= 400 else None)
    try:
        response = await page.goto(URL, wait_until="domcontentloaded", timeout=40000)
        assert response and response.status == 200, f"{engine}/{width}: HTTP failure"
        await page.get_by_role("button", name="Войти в библиотеку").click()
        await page.locator("div.fixed.inset-0.z-50").wait_for(
            state="detached", timeout=35000)
        await page.wait_for_timeout(1000)
        report = await page.evaluate("""() => new Promise(resolve => {
          const start = performance.now(), initial = window.__gbDraws, stamps = [];
          function tick(t) {
            stamps.push(t);
            if (t - start < 3500) return requestAnimationFrame(tick);
            const seconds = (stamps.at(-1) - stamps[0]) / 1000;
            const frames = Math.max(1, stamps.length - 1);
            const gaps = stamps.slice(1).map((v,i) => v-stamps[i]).sort((a,b)=>a-b);
            const draws = window.__gbDraws - initial;
            resolve({
              frames, seconds, rafPerSecond: Math.round(frames / seconds * 10) / 10,
              drawCalls: draws, drawCallsPerFrame: Math.round(draws / frames * 10) / 10,
              p95RafIntervalMs: Math.round(gaps[Math.floor(gaps.length * 0.95)] * 10) / 10,
              transferBytes: performance.getEntriesByType("resource").reduce(
                (total,r) => total + (r.transferSize || 0), 0)
            });
          }
          requestAnimationFrame(tick);
        })""")
        report.update(engine=engine, viewport=f"{width}x{height}", errors=errors)
        assert report["drawCalls"] > 0, f"{engine}/{width}: no WebGL calls observed"
        assert not errors, f"{engine}/{width}: {errors}"
        key = ("GB_LIBRARY_MAX_DRAW_CALLS_MOBILE" if touch
               else "GB_LIBRARY_MAX_DRAW_CALLS_DESKTOP")
        budget = os.environ.get(key)
        if budget:
            assert report["drawCallsPerFrame"] <= float(budget), (
                f"{engine}/{width}: {report['drawCallsPerFrame']} > {budget}")
        print(json.dumps(report, ensure_ascii=False), flush=True)
    finally:
        await context.close()


async def main():
    async with async_playwright() as playwright:
        for engine in ("chromium", "webkit"):
            browser = await getattr(playwright, engine).launch(headless=True)
            try:
                for width, height, touch in ((1440, 900, False), (390, 844, True)):
                    await measure(browser, engine, width, height, touch)
            finally:
                await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
