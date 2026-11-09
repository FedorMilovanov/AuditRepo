"""Portable, explicit browser launch settings for real lab CI.

Only software-rendering GitHub Linux runners opt into Chromium's documented
SwiftShader backend and app's actual low-quality saved setting. Windows desktop
and physical-device tests retain the normal browser GPU and quality settings.

The app is trusted local production build, not an untrusted internet page.
This is NOT an FPS or visual-art certification and never patches WebGL APIs.
"""
import os
from playwright.async_api import Browser, BrowserContext

SOFTWARE_RENDER = os.getenv("GB_LIBRARY_CI_SOFTWARE_GPU") == "1"


def launch_kwargs(engine: str) -> dict:
    if engine not in ("chromium", "webkit"):
        raise ValueError(f"Unexpected browser engine: {engine}")
    kwargs = {"headless": True}
    if engine == "chromium":
        if SOFTWARE_RENDER:
            # Playwright's pinned Chromium headless shell with software ANGLE;
            # do not depend on whatever Chrome Stable GitHub hosts install.
            kwargs["args"] = [
                "--use-gl=angle",
                "--use-angle=swiftshader",
                "--enable-unsafe-swiftshader",
            ]
        else:
            kwargs["channel"] = "chrome"
    return kwargs


async def test_context(browser: Browser, **kwargs) -> BrowserContext:
    context = await browser.new_context(**kwargs)
    if SOFTWARE_RENDER:
        # Product setting read at startup; no monkey-patched renderer.
        await context.add_init_script(
            "localStorage.setItem('gb-hall-quality', 'low')"
        )
    return context
