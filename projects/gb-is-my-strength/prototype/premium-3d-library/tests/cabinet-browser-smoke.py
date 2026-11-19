"""Chromium UI checks of the independently compiled cabinet preview.
The sandbox blocks navigation to local/remote origins. set_content has an opaque
origin, thus preview explicitly uses VOLATILE mode. These tests do NOT attest
IndexedDB durability or a Vite/WebGL/React production build.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / 'preview/cabinet.html').read_text(encoding='utf8')
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-gpu'])
    for w,h in [(1440,960),(390,844),(320,760)]:
        page = browser.new_page(viewport={'width':w,'height':h}, accept_downloads=True)
        errors=[]
        page.on('pageerror',lambda e: errors.append(str(e)))
        page.on('dialog',lambda dialog:dialog.accept())
        page.set_content(HTML,wait_until='domcontentloaded')
        assert 'без постоянного хранилища' in page.locator('#status').inner_text()
        assert page.locator('#add-bookmark').is_enabled()
        page.locator('#add-bookmark').click()
        assert page.locator('.entry').count()==1
        page.locator('#add-bookmark').click()
        assert 'уже сохранено' in page.locator('#status').inner_text()
        page.locator('[data-tab="quotes"]').click()
        page.locator('#exact').fill('Точный отрывок <img src=x onerror=alert(1)>')
        page.locator('#attribution').fill('Личный источник, собственная выписка')
        page.locator('#save-quote').click()
        assert page.locator('.entry').count()==1
        assert page.locator('.quote').inner_text()=='Точный отрывок <img src=x onerror=alert(1)>'
        assert page.locator('.quote img').count()==0, 'user input rendered as HTML'
        page.locator('[data-tab="collections"]').click()
        page.locator('#collection-name').fill('Моя коллекция')
        page.locator('#add-collection').click()
        assert page.locator('.entry').count()==1
        page.locator('#collection-choice').select_option(index=1)
        page.locator('#record-choice').select_option(index=1)
        page.locator('#attach').click()
        assert page.locator('.entry').count()==1
        assert '1 материалов' in page.locator('.entry').inner_text()
        with page.expect_download() as info:
            page.locator('#export').click()
        download=info.value
        backup=(ROOT/'preview'/f'cabinet-test-{w}.json')
        download.save_as(backup)
        assert 'records' in backup.read_text(encoding='utf8')
        page.locator('[data-tab="bookmarks"]').click()
        page.locator('.entry button').first.click()
        assert page.locator('.entry').count()==0
        page.locator('#importfile').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':b'{invalid'})
        page.wait_for_function("document.querySelector('#status').textContent.includes('Некорректный JSON')")
        assert page.locator('.entry').count()==0, 'invalid import overwrote existing state'
        page.locator('#importfile').set_input_files(str(backup))
        page.wait_for_function("document.querySelector('#status').textContent.includes('импортированы')")
        assert page.locator('.entry').count()==1
        # Untrusted input cannot write arbitrary markup into the DOM.
        page.locator('[data-tab="quotes"]').click()
        assert page.locator('.entry').count()==1
        assert not page.locator('script[src],img[onerror]').count()
        assert not errors, (w,errors)
        assert not page.evaluate('document.documentElement.scrollWidth > innerWidth+1'), f'Horizontal overflow at {w}px'
        page.screenshot(path=str(ROOT/'preview'/f'cabinet-{w}.png'),full_page=True)
        backup.unlink()
        page.close()
        print(f'PASS: cabinet browser {w}x{h}: bookmark dedup, quote, collection, export/import, deletion, no JS errors/overflow')
    browser.close()
