"""Read-only same-machine WebKit/Chrome performance experiment.

No app source changes. Quality set through the product's own persisted setting,
not monkey-patching the engine. Comparable on identical viewport & station.
Reports browser rAF (NOT hardware GPU frame time), actual canvas state and
WebGL renderer information where permitted.
"""
import asyncio, json, os, tempfile
from pathlib import Path
from playwright.async_api import async_playwright

URL=os.environ.get("GB_LIBRARY_TEST_URL", "http://127.0.0.1:8771/")
OUT=Path(os.environ.get("GB_LIBRARY_GPU_PROFILE_EVIDENCE_DIR",
                        str(Path(tempfile.gettempdir())/"gb-library-gpu-profile")))
OUT.mkdir(exist_ok=True)
RESULTS=[]

async def one(browser,engine,quality,width,height,touch):
    ctx=await browser.new_context(viewport={"width":width,"height":height},
        device_scale_factor=1,is_mobile=touch,has_touch=touch,reduced_motion="reduce")
    page=await ctx.new_page()
    errors=[]
    page.on("pageerror",lambda e:errors.append(str(e)))
    await page.add_init_script(f"localStorage.setItem('gb-hall-quality', {json.dumps(quality)});")
    try:
        response=await page.goto(URL,wait_until="domcontentloaded",timeout=40000)
        assert response and response.status==200
        await page.get_by_role("button",name="Войти в библиотеку").click(timeout=35000)
        await page.locator("div.fixed.inset-0.z-50").wait_for(state="detached",timeout=35000)
        await page.wait_for_timeout(1750)
        info=await page.evaluate("""() => {
          const c=[...document.querySelectorAll('canvas')].find(x=>x.getContext('webgl2'));
          const gl=c?.getContext('webgl2');
          const ext=gl?.getExtension('WEBGL_debug_renderer_info');
          const r=gl?.getParameter(ext?.UNMASKED_RENDERER_WEBGL||gl.RENDERER);
          return {
            renderer:r??null, vendor:gl?.getParameter(ext?.UNMASKED_VENDOR_WEBGL||gl.VENDOR)??null,
            canvasPx:{width:c?.width,height:c?.height},dpr:window.devicePixelRatio,
            backingRatio:c?.clientWidth?+(c.width/c.clientWidth).toFixed(2):null,
            extensionGpuTimer:!!gl?.getExtension('EXT_disjoint_timer_query_webgl2'),
            drawBufferWidth:gl?.drawingBufferWidth,drawBufferHeight:gl?.drawingBufferHeight
          };
        }""")
        sample=await page.evaluate("""() => new Promise(resolve => {
          const intervals=[], start=performance.now();let prev=0;
          function frame(t) {
            if(prev)intervals.push(t-prev);
            prev=t;
            if(t-start<4100)requestAnimationFrame(frame);
            else {
              intervals.sort((a,b)=>a-b);
              const n=intervals.length,seconds=(t-start)/1000;
              resolve({frames:n,seconds:+seconds.toFixed(2),
                rAFps:+(n/seconds).toFixed(2),
                p50:+intervals[Math.floor(n/2)].toFixed(2),
                p95:+intervals[Math.floor(n*0.95)].toFixed(2),
                p99:+intervals[Math.floor(n*0.99)].toFixed(2)});
            }
          }
          requestAnimationFrame(frame);
        })""")
        if width==1440 and quality=="high":
            path=OUT/f"{engine}-high-1440.png"
            await page.screenshot(path=str(path),animations="disabled")
        item={"engine":engine,"quality":quality,"viewport":f"{width}x{height}",**info,**sample,"errors":errors}
        RESULTS.append(item)
        print(json.dumps(item,ensure_ascii=True),flush=True)
    except Exception as e:
        item={"engine":engine,"quality":quality,"viewport":f"{width}x{height}","error":str(e)[:500]}
        RESULTS.append(item)
        print(json.dumps(item,ensure_ascii=True),flush=True)
    finally:await ctx.close()

async def main():
    async with async_playwright() as pw:
        for engine in ("webkit","chromium"):
            browser=await getattr(pw,engine).launch(headless=True,**({"channel":"chrome"} if engine=="chromium" else {}))
            try:
                for size in ((1440,900,False),(390,844,True)):
                    for quality in ("high","low"):
                        await one(browser,engine,quality,*size)
            finally:await browser.close()
    (OUT/"results.json").write_text(json.dumps(RESULTS,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
    assert len(RESULTS)==8 and all(not x.get("error") and not x.get("errors") for x in RESULTS),"Some cases failed"
asyncio.run(main())
