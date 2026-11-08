"""Lab-only browser smoke. Uses set_content because sandbox blocks localhost/file navigation.
No network, live site, browser profile, or user data touched.
Requires Playwright and a Chromium binary installed by the test environment.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / 'preview/progression.html').read_text(encoding='utf8')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-gpu'])
    for width, height in [(1440, 960), (390, 844), (320, 760)]:
        page = browser.new_page(viewport={'width': width, 'height': height}, device_scale_factor=1)
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.set_content(HTML, wait_until='domcontentloaded')
        assert page.locator('#rank').inner_text() == '01'
        page.locator('#fill').click()
        assert page.locator('#rankName').inner_text() == 'Архивариус'
        assert '1' in page.locator('#xp').inner_text()
        page.screenshot(path=str(ROOT / 'preview' / f'progression-{width}.png'), full_page=True)
        page.locator('[data-tab="activity"]').click()
        page.locator('[data-event="0"]').click()
        assert page.locator('[data-event="0"]').is_disabled()
        page.locator('[data-tab="decor"]').click()
        assert page.locator('.card').count() == 5
        tokens_before = int(page.locator('#tokens').inner_text())
        page.locator('[data-buy="lamp"]').click()
        assert page.locator('[data-buy="lamp"]').is_disabled()
        assert int(page.locator('#tokens').inner_text()) == tokens_before - 1
        page.locator('[data-tab="achievements"]').click()
        assert page.locator('.tier').count() == 9
        page.locator('#reset').click()
        assert page.locator('#rankName').inner_text() == 'Посетитель'
        assert int(page.locator('#tokens').inner_text()) == 0
        overflow = page.evaluate('document.documentElement.scrollWidth > innerWidth + 1')
        assert not overflow, f'horizontal overflow at {width}px'
        badge_rect = page.locator('.demo-flag').bounding_box()
        title_rect = page.locator('.mast h1').bounding_box()
        assert badge_rect and title_rect and badge_rect['y'] >= title_rect['y'] + title_rect['height'] - 1 or width > 750, f'badge overlaps title at {width}px'
        assert not errors, f'browser exceptions at {width}px: {errors}'
        page.close()
        print(f'PASS: {width}x{height} UX tabs, rank, demo actions, wallet, achievements, reset, viewport')
    browser.close()
