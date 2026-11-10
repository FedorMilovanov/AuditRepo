"""Real browser WebGL2 context-loss lifecycle and accessible 2D fallback.

Synthetic *fault injection* uses the standard WEBGL_lose_context extension
in a disposable page. This checks the app's error/recovery UI; it is NOT a
physical GPU driver, VRAM/thermal or iPhone Safari certification. The 2D
fallback case blocks getContext('webgl2') only for the isolated test context.
"""
from __future__ import annotations
import asyncio
import json
import os
import tempfile
from pathlib import Path

from playwright.async_api import async_playwright
from browser_runtime import launch_kwargs, test_context, capture_evidence

URL = os.getenv("GB_LIBRARY_TEST_URL", "http://127.0.0.1:8771/")
OUT = Path(os.getenv("GB_LIBRARY_RECOVERY_EVIDENCE_DIR",
                       str(Path(tempfile.gettempdir()) / "gb-library-gl-recovery")))

async def recovery_case(browser, engine, width, height, mobile):
    context = await test_context(browser,viewport={"width":width,"height":height},
        device_scale_factor=1,is_mobile=mobile,has_touch=mobile,reduced_motion="reduce")
    page = await context.new_page()
    errors=[]
    page.on("pageerror",lambda e:errors.append("JS "+str(e)))
    page.on("response",lambda r:errors.append(f"HTTP {r.status}: {r.url}")
            if r.status >= 400 else None)
    try:
        response=await page.goto(URL,wait_until="domcontentloaded",timeout=45000)
        assert response and response.status==200
        await page.get_by_role("button",name="Войти в библиотеку").click(timeout=45000)
        await page.locator("div.fixed.inset-0.z-50").wait_for(state="detached",timeout=45000)
        await page.wait_for_timeout(350)
        found=await page.evaluate("""() => {
            const canvas=[...document.querySelectorAll('canvas')].find(c=>c.getContext('webgl2'));
            const gl=canvas?.getContext('webgl2');
            const ext=gl?.getExtension('WEBGL_lose_context');
            if(!gl||!ext)return {supported:false};
            window.__testRecovery={canvas,gl,ext,events:[]};
            canvas.addEventListener('webglcontextlost',(event) =>
                window.__testRecovery.events.push({
                    type:'lost',at:performance.now(),
                    defaultPrevented:event.defaultPrevented,cancelable:event.cancelable
                }));
            canvas.addEventListener('webglcontextrestored',(event) =>
                window.__testRecovery.events.push({
                    type:'restored',at:performance.now(),cancelable:event.cancelable
                }));
            ext.loseContext();
            return {supported:true};
        }""")
        assert found["supported"], (engine,width,"WEBGL_lose_context not supported")
        overlay=page.get_by_text("Перезапускаю зал…",exact=True)
        OUT.mkdir(parents=True,exist_ok=True)
        try:
            await page.wait_for_function(
                "() => window.__testRecovery?.events.some(e=>e.type==='lost')",
                polling=100, timeout=12000
            )
            await overlay.wait_for(state="visible",timeout=15000)
        except Exception:
            # Distinguish GPU fault-event delivery, React fatal boundary,
            # and a silently lost overlay. Capture the actual browser;
            # never ignore a failure or invent a recovery event.
            report=await page.evaluate("""() => {
              const p=window.__testRecovery;
              return {
                events:p?.events,contextLost:p?.gl?.isContextLost(),
                canvasConnected:p?.canvas?.isConnected,
                pageText:document.body.innerText.slice(0,1100),
                alerts:[...document.querySelectorAll('[role=alert]')]
                  .map(el=>el.innerText.slice(0,500)),
                has3D:document.querySelectorAll('canvas').length,
                hasOverlay:!![...document.querySelectorAll('div')]
                  .find(el=>el.textContent?.trim()==='Перезапускаю зал…'),
                ready:document.readyState
              };
            }""")
            print(json.dumps({
                "engine":engine,"viewport":f"{width}x{height}",
                "stage":"context-loss-overlay-missing",
                "diagnostics":report,"errors":errors
            },ensure_ascii=False),flush=True)
            await capture_evidence(page, OUT/f"{engine}-{width}x{height}-lost-overlay-failure.png")
            raise
        assert await page.get_by_role("button",name="Моя библиотека · без 3D").is_visible(), (
            "WebGL loss must leave a working public 2D exit"
        )
        if width==1440:
            await capture_evidence(page, OUT/f"{engine}-lost.png")
        restore_request = await page.evaluate("""() => {
          const probe=window.__testRecovery;
          const before=probe.gl.isContextLost();
          probe.ext.restoreContext();
          return {lostBeforeRequest:before, events:probe.events};
        }""")
        assert restore_request["lostBeforeRequest"], (
            "Restore test did not start from genuinely lost WebGL", restore_request
        )
        try:
            await overlay.wait_for(state="detached",timeout=20000)
        except Exception:
            report = await page.evaluate("""() => {
              const p=window.__testRecovery;
              return {
                events:p.events, canvasConnected:p.canvas.isConnected,
                lost:p.gl.isContextLost(), glError:p.gl.getError(),
                webglCanvases:document.querySelectorAll('canvas').length,
                overlay:!![...document.querySelectorAll('*')]
                  .find(e=>e.textContent==='Перезапускаю зал…'),
                fatal:document.body.innerText.includes('Зал закрыт на ремонт')
              };
            }""")
            print(json.dumps({
                "engine":engine, "viewport":f"{width}x{height}",
                "stage":"context-restore-timeout","restoreRequest":restore_request,
                "diagnostics":report,"errors":errors
            },ensure_ascii=False),flush=True)
            await capture_evidence(page, OUT/f"{engine}-{width}x{height}-restore-failure.png")
            raise
        await page.wait_for_timeout(550)
        restored=await page.evaluate("""() => ({
            sameCanvas:window.__testRecovery.canvas.isConnected,
            contextRestored:!window.__testRecovery.gl.isContextLost(),
            webgl2:!!window.__testRecovery.canvas.getContext('webgl2')
        })""")
        assert all(restored.values()), (engine,width,restored)
        events = await page.evaluate("window.__testRecovery.events")
        kinds = [event["type"] for event in events]
        assert "lost" in kinds and "restored" in kinds and (
            kinds.index("lost") < kinds.index("restored")
        ), ("WebGL extension did not deliver actual loss→restore events", events)
        assert any(event["type"] == "lost" and event["defaultPrevented"]
                   for event in events), ("WebGL loss was not cancelable/restorable", events)
        assert not errors, (engine,width,errors)
        await capture_evidence(page, OUT/f"{engine}-{width}x{height}-restored.png")
        print(json.dumps({"engine":engine,"viewport":f"{width}x{height}",
            "result":"PASS","recovery":restored,"errors":errors},
            ensure_ascii=False),flush=True)
    finally:
        await context.close()

async def fallback_case(browser,engine):
    ctx=await test_context(browser,viewport={"width":390,"height":844},
        device_scale_factor=1,is_mobile=True,has_touch=True,reduced_motion="reduce")
    # A deliberate test-only denial of WebGL2 before the application loads.
    await ctx.add_init_script("""(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(kind, ...args) {
        if(kind === 'webgl2')return null;
        return original.call(this,kind,...args);
      };
    })();""")
    page=await ctx.new_page()
    errors=[]
    page.on("pageerror",lambda e:errors.append(str(e)))
    try:
        response=await page.goto(URL,wait_until="domcontentloaded",timeout=45000)
        assert response and response.status==200
        await page.get_by_text("Зал закрыт на ремонт",exact=True).wait_for(timeout=15000)
        await page.get_by_role("button",name="Моя библиотека · без 3D").click(timeout=15000)
        cabinet=page.locator("[data-gb-cabinet-modal]")
        await cabinet.wait_for(state="visible",timeout=12000)
        await cabinet.get_by_role("button",name="Закладки (0)").wait_for(timeout=15000)
        OUT.mkdir(parents=True,exist_ok=True)
        await capture_evidence(page, OUT/f"{engine}-no-webgl-cabinet.png")
        assert not errors,errors
        print(json.dumps({"engine":engine,"viewport":"390x844","result":"PASS",
            "noWebGL2Fallback":True,"cabinetAvailable":True,"errors":errors},
            ensure_ascii=False),flush=True)
    finally:
        await ctx.close()

async def main():
    async with async_playwright() as playwright:
        for engine in ("chromium","webkit"):
            browser = await getattr(playwright,engine).launch(**launch_kwargs(engine))
            try:
                for w,h,mobile in ((1440,900,False),(390,844,True)):
                    await recovery_case(browser,engine,w,h,mobile)
                await fallback_case(browser,engine)
            finally:
                await browser.close()

if __name__=="__main__":
    asyncio.run(main())
