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


async def capture_evidence(page, path):
    """Save *real* viewport PNG evidence with a bounded deadline and integrity.

    CPU-only SwiftShader makes GPU readback much slower than native Chrome.
    A timeout remains a hard failure: never substitute an image or skip a case.
    A successful page.screenshot alone is insufficient without valid PNG bytes,
    source-file identity and viewport dimensions.
    """
    import json
    import struct
    import time
    from pathlib import Path

    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    timeout_ms = 60000 if SOFTWARE_RENDER else 30000
    viewport = page.viewport_size
    assert viewport and viewport["width"] > 0 and viewport["height"] > 0
    print(f"CAPTURE_BEGIN {target.name} {viewport['width']}x{viewport['height']} limitMs={timeout_ms}", flush=True)
    begin = time.perf_counter()
    encoded = await page.screenshot(
        path=str(target), animations="disabled", timeout=timeout_ms
    )
    duration_ms = round((time.perf_counter() - begin) * 1000)
    assert encoded.startswith(bytes.fromhex("89504e470d0a1a0a")), (
        f"{target}: screenshot is not a PNG"
    )
    assert encoded[12:16] == b"IHDR" and len(encoded) >= 5120, (
        f"{target}: malformed or unexpectedly small screenshot"
    )
    width, height = struct.unpack(">II", encoded[16:24])
    assert (width, height) == (viewport["width"], viewport["height"]), (
        f"{target}: PNG {(width, height)} differs from actual viewport {viewport}"
    )
    assert target.is_file() and target.read_bytes() == encoded, (
        f"{target}: screenshot not preserved on disk"
    )
    result = {"evidenceFile": str(target), "captureMs": duration_ms,
              "pngBytes": len(encoded), "width": width, "height": height}
    print(json.dumps(result, ensure_ascii=False), flush=True)
    return result
