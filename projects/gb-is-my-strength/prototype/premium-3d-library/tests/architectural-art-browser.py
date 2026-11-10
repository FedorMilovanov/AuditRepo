"""Reproducible V5.2 artistic-scene browser witness, not a photorealism claim.

Run after `npm ci && npm run build`, with `dist` served on localhost:
    GB_LIBRARY_TEST_URL=http://127.0.0.1:8771/ python tests/architectural-art-browser.py
Evidence is kept in this experimental lab, never the Product repository.
"""
import asyncio
import json
import os
from pathlib import Path
from playwright.async_api import async_playwright
from browser_runtime import launch_kwargs, test_context, capture_evidence

URL = os.environ.get('GB_LIBRARY_TEST_URL', 'http://127.0.0.1:8771/')
# An external evidence directory preserves the original V5.2 screenshot witnesses.
OUT = Path(os.environ.get('GB_LIBRARY_ART_EVIDENCE_DIR', str(Path(__file__).resolve().parents[1] / 'evidence' / 'art-v52')))

async def one(browser, engine, width, height, mobile):
    context = await test_context(browser,viewport={'width': width, 'height': height},
        device_scale_factor=1, is_mobile=mobile, has_touch=mobile, reduced_motion='reduce')
    page = await context.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append('JS ' + str(e)))
    page.on('response', lambda r: errors.append(f'HTTP {r.status}: {r.url}') if r.status >= 400 else None)
    response = await page.goto(URL, wait_until='domcontentloaded', timeout=40000)
    assert response and response.status == 200, f'{engine}: index failed'
    await page.get_by_role('button', name='Войти в библиотеку').click()
    await page.locator('div.fixed.inset-0.z-50').wait_for(state='detached', timeout=35000)
    # Allow normal material/texture upload after scene readiness, not as a substitute for readiness.
    await page.wait_for_timeout(550)
    report = await page.evaluate('''() => ({
      canvasCount: document.querySelectorAll('canvas').length,
      hasWebGL2: [...document.querySelectorAll('canvas')].some(c => Boolean(c.getContext('webgl2'))),
      overflow: document.documentElement.scrollWidth > innerWidth + 2,
      pbr: ['oak-color','oak-normal','limestone-normal'].map(t => performance.getEntriesByType('resource').some(r => r.name.includes(t))),
      transferBytes: performance.getEntriesByType('resource').reduce((n,r)=>n+(r.transferSize||0),0)
    })''')
    assert report['hasWebGL2'], f'{engine} {width}: missing WebGL2 context'
    assert not report['overflow'], f'{engine} {width}: horizontal overflow'
    assert all(report['pbr']), f'{engine} {width}: missing PBR resources {report}'
    assert not errors, f'{engine} {width}: {errors}'
    OUT.mkdir(parents=True, exist_ok=True)
    await capture_evidence(page, OUT/f'{engine}-{width}x{height}.png')
    print(json.dumps({'engine':engine,'viewport':f'{width}x{height}','status':'PASS','result':report},ensure_ascii=False))
    await context.close()

async def main():
    async with async_playwright() as p:
        for engine in ('chromium','webkit'):
            browser_type = getattr(p, engine)
            browser = await browser_type.launch(**launch_kwargs(engine))
            try:
                await one(browser, engine, 1440, 900, False)
                await one(browser, engine, 390, 844, True)
            finally:
                await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
