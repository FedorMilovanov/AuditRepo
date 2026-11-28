"""Reproducible V5.2 artistic-scene browser witness, not a photorealism claim.

Run after `npm ci && npm run build`, with `dist` served on localhost:
    GB_LIBRARY_TEST_URL=http://127.0.0.1:8771/ python tests/architectural-art-browser.py
Evidence is kept in this experimental lab, never the Product repository.
"""
import asyncio
import json
import os
import re
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
    # One actual CC0 GLB must finish loading; the fallback bench alone does
    # not prove our authored model is present in the built scene.
    await page.wait_for_function("""() => performance.getEntriesByType('resource')
      .some(r => r.name.includes('ArmChair_01_512-') && r.name.endsWith('.glb'))""", timeout=15000)
    report = await page.evaluate('''() => ({
      canvasCount: document.querySelectorAll('canvas').length,
      hasWebGL2: [...document.querySelectorAll('canvas')].some(c => Boolean(c.getContext('webgl2'))),
      overflow: document.documentElement.scrollWidth > innerWidth + 2,
      pbr: ['oak-color','oak-normal','limestone-normal'].map(t => performance.getEntriesByType('resource').some(r => r.name.includes(t))),
      qualityLabel: document.querySelector('[data-gb-toolbar] button[title="Качество графики"]')?.textContent?.trim(),
      qualityTransitionPending: Boolean(document.querySelector('[data-gb-quality-transition]')),
      floorAssets: performance.getEntriesByType('resource')
        .filter(r=>r.name.includes('floor-tiles078-'))
        .map(r=>r.name.split('/').pop()),
      caseworkAssets: performance.getEntriesByType('resource')
        .filter(r=>r.name.includes('wood049-'))
        .map(r=>r.name.split('/').pop()),
      referenceFurniture: performance.getEntriesByType('resource')
        .filter(r=>r.name.includes('ArmChair_01_512-') && r.name.endsWith('.glb'))
        .map(r=>({name:r.name.split('/').pop(), bytes:r.transferSize})),
      transferBytes: performance.getEntriesByType('resource').reduce((n,r)=>n+(r.transferSize||0),0)
    })''')
    assert report['hasWebGL2'], f'{engine} {width}: missing WebGL2 context'
    assert not report['overflow'], f'{engine} {width}: horizontal overflow'
    assert all(report['pbr']), f'{engine} {width}: missing PBR resources {report}'
    furniture = report['referenceFurniture']
    assert len(furniture) == 1 and 0 <= furniture[0]['bytes'] < 400_000, (
        f'{engine} {width}: missing/oversized CC0 furniture GLB', report
    )
    # AutoQuality legitimately switches 1440px Linux/SwiftShader to low
    # after sustained <36 FPS. Device width is NOT the graphics-preset
    # authority; the real user-visible toolbar label is. Test the currently
    # applied material without disabling AutoQuality or injecting store state.
    quality = report['qualityLabel']
    assert quality in ('Ультра', 'Лёгкая'), (
        f'{engine} {width}: graphics preset label missing', report
    )
    assert not report['qualityTransitionPending'], (
        f'{engine} {width}: graphics quality transition did not settle', report
    )
    profile = '1024' if quality == 'Ультра' else '512'
    floor_assets = report['floorAssets']
    assert any(f'floor-tiles078-{profile}-color' in name for name in floor_assets), (
        f'{engine} {width}: active PBR floor albedo missing', report
    )
    # Previously loaded materials may legitimately remain cached after
    # automatic downgrade: an obsolete URL in Resource Timing is not
    # evidence that the current material uses the wrong quality.
    if profile == '1024':
        assert all(any(f'floor-tiles078-1024-{channel}' in name
                       for name in floor_assets)
                   for channel in ('color','normal','roughness')), (
            f'{engine} {width}: high-quality PBR channel missing', report
        )
    # The shared bookcase PBR must load all three channels at the actual
    # quality label (including an automatic downgrade on Linux SwiftShader).
    wood_assets = report['caseworkAssets']
    assert all(any(f'wood049-{profile}-{channel}' in name
                   for name in wood_assets)
               for channel in ('color', 'normal', 'roughness')), (
        f'{engine} {width}: incomplete active casework PBR channels', report
    )
    # The tiny 512px normal and roughness WebPs are inlined by Vite.
    # Their existence, signatures and SHA256 are enforced by lab:check.
    # Both manual transition directions remain mandatory in the dedicated
    # quality-transition suite, independent of this AutoQuality witness.
    assert not errors, f'{engine} {width}: {errors}'
    OUT.mkdir(parents=True, exist_ok=True)
    await capture_evidence(page, OUT/f'{engine}-{width}x{height}.png')
    print(json.dumps({'engine':engine,'viewport':f'{width}x{height}','status':'PASS','result':report},ensure_ascii=False))
    await context.close()

async def optional_furniture_failure(browser):
    """A deliberately missing optional GLB must preserve real 3D navigation."""
    ctx = await test_context(browser, viewport={'width': 390, 'height': 844},
        device_scale_factor=1, is_mobile=True, has_touch=True, reduced_motion='reduce')
    page = await ctx.new_page()
    requests, warnings, failures = [], [], []
    page.on('pageerror', lambda e: failures.append(str(e)))
    page.on('console', lambda m: warnings.append(m.text) if m.type == 'warning' else None)

    async def missing_asset(route):
        requests.append(route.request.url)
        await route.fulfill(status=404, body='deliberately missing optional model')

    await page.route('**/*ArmChair_01_512*.glb', missing_asset)
    try:
        response = await page.goto(URL, wait_until='domcontentloaded', timeout=40000)
        assert response and response.status == 200
        await page.get_by_role('button', name='Войти в библиотеку').click()
        await page.locator('div.fixed.inset-0.z-50').wait_for(
            state='detached', timeout=35000)
        for _ in range(60):
            if requests and any('Optional CC0 armchair unavailable' in w for w in warnings):
                break
            await page.wait_for_timeout(200)
        assert len(requests) == 1, ('GLB denial not exercised', requests)
        assert any('Optional CC0 armchair unavailable' in w for w in warnings), warnings
        assert not failures, ('Optional GLB failure escaped browser boundary', failures)

        # The actual visitor route must work with only the original bench.
        nav = page.locator('[data-gb-toolbar] button[title^="Карта сайта"]:visible').first
        await nav.evaluate('(el) => el.click()')
        panel = page.locator('aside')
        await panel.wait_for(state='visible', timeout=8000)
        await panel.get_by_role('button', name=re.compile('Статьи')).first.evaluate(
            '(el) => el.click()')
        await panel.wait_for(state='detached', timeout=10000)
        await page.wait_for_timeout(3450)
        assert not failures, failures
        OUT.mkdir(parents=True, exist_ok=True)
        await capture_evidence(page, OUT/'chromium-390x844-cc0-armchair-fallback.png')
        print(json.dumps({'fixture': 'cc0-armchair-404', 'result': 'PASS',
            'blocked': len(requests), 'pageErrors': failures}, ensure_ascii=False))
    finally:
        await ctx.close()


async def main():
    async with async_playwright() as p:
        for engine in ('chromium','webkit'):
            browser_type = getattr(p, engine)
            browser = await browser_type.launch(**launch_kwargs(engine))
            try:
                await one(browser, engine, 1440, 900, False)
                await one(browser, engine, 390, 844, True)
                if engine == 'chromium':
                    await optional_furniture_failure(browser)
            finally:
                await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
