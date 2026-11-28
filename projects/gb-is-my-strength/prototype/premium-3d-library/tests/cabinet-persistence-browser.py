"""Real-origin IndexedDB durability and multi-tab stale-write protection.

Test only the isolated *lab* DB on a fresh disposable browser context. Public
cabinet UI and synthetic demo records; no direct store injection, no Product
auth, no user profile, and no filesystem modifications outside test evidence.

The synthetic export-import exercise confirms that an already-open stale tab
cannot replace a more recent collection created in another tab. All browser
contexts are destroyed after the test.
"""
from __future__ import annotations

import asyncio
import json
import os
import re
import tempfile
from pathlib import Path

from playwright.async_api import async_playwright
from browser_runtime import launch_kwargs, test_context, capture_evidence

URL = os.getenv("GB_LIBRARY_TEST_URL", "http://127.0.0.1:8771/")
EVIDENCE = Path(os.getenv("GB_LIBRARY_CABINET_EVIDENCE_DIR",
                          str(Path(tempfile.gettempdir()) / "gb-library-cabinet-persistence")))

async def open_cabinet(page, *, via_link=False):
    # Foreground the tab being used. In software WebGL, background animation
    # can be throttled, but cabinet data must remain accessible without it.
    await page.bring_to_front()
    address = (URL + ("&" if "?" in URL else "?") + "panel=cabinet") if via_link else URL
    await page.goto(address, wait_until="domcontentloaded", timeout=45000)
    if not via_link:
        # The first-tab cover-button path remains under full UI test.
        await page.get_by_role("button", name="Моя библиотека", exact=True).click(timeout=45000)
    # The supported ?panel=cabinet route is public, not a test-only bypass
    # or an injected/altered application state.
    box = page.locator("[data-gb-cabinet-modal]")
    await box.wait_for(state="visible", timeout=12000)
    if via_link:
        # The public cabinet deep link must not boot a second software WebGL
        # scene while the reader is accessing purely 2D personal materials.
        assert await page.locator("canvas").count() == 0, (
            "2D cabinet deep link unexpectedly mounted a GPU canvas"
        )
    await box.get_by_role("status").get_by_text(
        re.compile("Данные хранятся только в этом браузере")
    ).wait_for(timeout=15000)
    return box

async def test_case(browser, engine):
    ctx = await test_context(browser,
        viewport={"width": 1440, "height": 900},
        device_scale_factor=1,
        accept_downloads=True,
        reduced_motion="reduce",
    )
    a = await ctx.new_page()
    errors = []
    a.on("pageerror", lambda err: errors.append("A: " + str(err)))
    a.on("response", lambda r: errors.append(f"A HTTP {r.status}: {r.url}")
         if r.status >= 400 else None)
    try:
        a_box = await open_cabinet(a)
        assert await a_box.get_by_role("button", name="Закладки (0)").count() == 1
        await a_box.get_by_role("button", name="Сохранить закладку").click()
        await a_box.get_by_role("button", name="Закладки (1)").wait_for(timeout=12000)

        # Reload at the same true HTTP origin. IndexedDB must remain durable.
        a_box = await open_cabinet(a)
        assert await a_box.get_by_role("button", name="Закладки (1)").count() == 1

        # Keep A open (stale snapshot), open a second tab sharing the same
        # origin. B uses the public 2D cabinet deep link rather than waiting
        # for a background WebGL intro; all writes use ordinary GUI controls.
        b = await ctx.new_page()
        b.on("pageerror", lambda err: errors.append("B: " + str(err)))
        b.on("response", lambda r: errors.append(f"B HTTP {r.status}: {r.url}")
             if r.status >= 400 else None)
        b_box = await open_cabinet(b, via_link=True)
        assert await b_box.get_by_role("button", name="Закладки (1)").count() == 1

        # A user must foreground the tab before using its controls.
        # Background software-WebGL tabs may be throttled by the browser.
        # Both GUI actions still occur in independent *live* tabs; no reload
        # or direct IndexedDB/store mutation changes the stale A snapshot.
        await a.bring_to_front()
        # Export a known-valid copy before the concurrent B write.
        async with a.expect_download() as download_info:
            await a_box.get_by_role("button", name="Экспорт JSON").click()
        download = await download_info.value
        backup_path = await download.path()
        assert backup_path is not None
        backup = Path(backup_path).read_bytes()
        assert 10 < len(backup) < 350_000
        exported = json.loads(backup.decode("utf8"))
        assert isinstance(exported, dict)

        await b.bring_to_front()
        try:
            # The B modal was already proved visible, populated and
            # independent of WebGL in open_cabinet(). Re-waiting for its
            # parent visibility after a Linux software-GPU focus switch
            # can time out even though the real cabinet remains visible.
            # Click the actual public control instead: Playwright's action
            # requires a visible, enabled, event-receiving button and still
            # fails hard if the user could not open the collections tab.
            await b_box.get_by_role(
                "button", name=re.compile(r"Коллекции \(")
            ).click(timeout=30000)
            assert await b_box.locator(
                "#gb-cabinet-collection"
            ).is_visible(), "Collections tab did not become interactive"
        except Exception:
            # Never reclassify a real concurrency failure as PASS. Keep a
            # diagnostic snapshot of the actual second tab and its visible
            # public controls, then fail with the original exception.
            report = await b.evaluate("""() => ({
                url: location.href, ready: document.readyState,
                modals: document.querySelectorAll('[data-gb-cabinet-modal]').length,
                buttons: [...document.querySelectorAll('[data-gb-cabinet-modal] button')]
                    .map(x => ({text:x.innerText, disabled:x.disabled})).slice(0, 12),
                status: [...document.querySelectorAll('[data-gb-cabinet-modal] [role=status]')]
                    .map(x => x.textContent?.slice(0, 400)),
                gpuCanvas: document.querySelectorAll('canvas').length,
                pageVisible: document.visibilityState,
                modalLayout: (() => {
                  const el=document.querySelector('[data-gb-cabinet-modal]');
                  if (!el) return null;
                  const r=el.getBoundingClientRect();
                  const style=getComputedStyle(el);
                  return {width:r.width,height:r.height,display:style.display,
                    visibility:style.visibility,opacity:style.opacity,
                    pointerEvents:style.pointerEvents};
                })()
            })""")
            print(json.dumps({"engine":engine, "stage":"second-tab-before-write",
                              "ui":report,"errors":errors}, ensure_ascii=False), flush=True)
            EVIDENCE.mkdir(parents=True, exist_ok=True)
            await capture_evidence(b, EVIDENCE / f"{engine}-second-tab-failure.png")
            raise
        await b_box.locator("#gb-cabinet-collection").fill("Контроль многовкладочности")
        await b_box.get_by_role("button", name="Создать коллекцию").click()
        await b_box.get_by_role("button", name="Коллекции (1)").wait_for(timeout=12000)

        await a.bring_to_front()
        # Import is explicitly confirmed in the GUI. A's stale vault must
        # fail atomic compare-and-swap, not erase B's new saved collection.
        a.on("dialog", lambda d: asyncio.create_task(d.accept()))
        await a_box.locator('input[type="file"]').set_input_files(
            {"name": "synthetic-lab-backup.json",
             "mimeType": "application/json", "buffer": backup}
        )
        await a_box.get_by_role("status").get_by_text(
            re.compile("Импорт не записан")
        ).wait_for(timeout=15000)

        # The newer B record must survive a fresh page reload.
        b_box = await open_cabinet(b, via_link=True)
        await b_box.get_by_role("button", name="Коллекции (1)").click()
        assert await b_box.get_by_text("Контроль многовкладочности").count() >= 1
        assert await b_box.get_by_role("button", name="Закладки (1)").count() == 1

        names = await b.evaluate(
            "() => indexedDB.databases().then(xs => xs.map(x => x.name))"
        )
        assert "gb-premium-library-lab-vault-v1" in names, names

        EVIDENCE.mkdir(parents=True, exist_ok=True)
        await capture_evidence(b, EVIDENCE / f"{engine}-same-origin-cabinet.png")

        # All assertions of the concurrent two-tab IndexedDB witness are now
        # complete. Close both foreground tabs before inspecting a fresh
        # independent storage context. Tab A still owns the 3D WebGL scene
        # behind its cabinet: retaining that software-GPU renderer during
        # the unrelated 2D screenshot can exhaust SwiftShader's readback.
        # This is a real page lifecycle boundary, not a mocked screenshot,
        # a retry or a relaxed IndexedDB concurrency requirement.
        await a.close()
        await b.close()
        assert a.is_closed() and b.is_closed(), (
            "The concurrent tabs still own renderer resources at the isolated context boundary"
        )

        # A fresh, separate browser storage context must not inherit records.
        isolated = await test_context(browser,
            viewport={"width": 390, "height": 844},
            device_scale_factor=1, is_mobile=True, has_touch=True,
            reduced_motion="reduce",
        )
        try:
            c = await isolated.new_page()
            c_box = await open_cabinet(c, via_link=True)
            assert await c_box.get_by_role("button", name="Закладки (0)").count() == 1
            assert await c_box.get_by_role("button", name="Коллекции (0)").count() == 1
            await capture_evidence(c, EVIDENCE / f"{engine}-isolated-cabinet.png")
        finally:
            await isolated.close()

        assert not errors, errors
        print(json.dumps({
            "engine": engine, "result": "PASS",
            "realOriginIndexedDB": True,
            "reloadPersistence": True,
            "staleTabImportRejected": True,
            "newerDataPreserved": True,
            "independentContextIsolated": True,
            "errors": errors,
        }, ensure_ascii=False), flush=True)
    finally:
        await ctx.close()

async def main():
    async with async_playwright() as playwright:
        for engine in ("chromium", "webkit"):
            browser = await getattr(playwright, engine).launch(**launch_kwargs(engine))
            try:
                await test_case(browser, engine)
            finally:
                await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
