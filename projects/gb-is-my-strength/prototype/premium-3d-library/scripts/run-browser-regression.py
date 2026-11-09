"""Source-owned fail-closed browser gate for the Premium 3D Library lab.

Run after `npm ci && npm run build` and `python -m playwright install ...`.
Serves the current built dist on an ephemeral loopback port, invokes actual
public-UI Playwright tests, verifies exact case counts and stops its server.
No browser injection, source mutation, internet requests or Product credentials.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import threading
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
TESTS = (
    ("interaction-regression-browser.py", 12),
    ("architectural-art-browser.py", 4),
    ("central-book-browser.py", 4),
    ("mobile-hud-browser.py", 6),
    ("reference-bay-browser.py", 5),
    ("photo-transition-browser.py", 4),
    ("quality-transition-browser.py", 4),
)
EVIDENCE_VARIABLES = {
    "interaction-regression-browser.py": "GB_LIBRARY_INTERACTION_EVIDENCE_DIR",
    "architectural-art-browser.py": "GB_LIBRARY_ART_EVIDENCE_DIR",
    "central-book-browser.py": "GB_LIBRARY_BOOK_EVIDENCE_DIR",
    "mobile-hud-browser.py": "GB_LIBRARY_HUD_EVIDENCE_DIR",
    "reference-bay-browser.py": "GB_LIBRARY_FOCUS_EVIDENCE_DIR",
    "photo-transition-browser.py": "GB_LIBRARY_PHOTO_EVIDENCE_DIR",
    "quality-transition-browser.py": "GB_LIBRARY_QUALITY_EVIDENCE_DIR",
}


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args: object) -> None:
        pass


def verify_case_records(name: str, stdout: str, expected: int) -> None:
    records = []
    for line in stdout.splitlines():
        if not line.lstrip().startswith("{"):
            continue
        try:
            records.append(json.loads(line))
        except json.JSONDecodeError as exc:
            raise AssertionError(f"{name}: malformed JSON witness: {line[:200]}") from exc

    cases = [r for r in records if isinstance(r, dict) and "engine" in r]
    assert len(cases) == expected, (
        f"{name}: expected {expected} real browser cases, got {len(cases)}"
    )
    for case in cases:
        actual = case["status"] if "status" in case else case.get("result")
        assert actual == "PASS", f"{name}: non-PASS case {case}"
        assert not case.get("errors"), f"{name}: browser errors {case['errors']}"

    if name == "interaction-regression-browser.py":
        summaries = [r for r in records if r.get("passed") is not None]
        assert len(summaries) == 1 and summaries[0]["passed"] == expected, (
            f"{name}: missing or mismatched summary"
        )
        assert not summaries[0].get("failures"), summaries[0]
    if name == "quality-transition-browser.py":
        assert all(len(r.get("switches", [])) == 2 for r in cases), (
            "Quality regression did not test both switching directions"
        )


def run_all(evidence_root: Path) -> None:
    assert (DIST / "index.html").is_file(), (
        "Production dist/index.html missing: run npm run build first"
    )
    handler = partial(QuietHandler, directory=str(DIST))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    server.daemon_threads = True
    server.timeout = 1
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    url = f"http://127.0.0.1:{server.server_port}/"
    try:
        with urlopen(url, timeout=8) as response:
            assert response.status == 200, f"HTTP {response.status}"
        print(f"Built app HTTP witness: {url}", flush=True)
        for name, expected in TESTS:
            evidence_dir = evidence_root / name.removesuffix(".py")
            evidence_dir.mkdir(parents=True, exist_ok=True)
            env = os.environ.copy()
            env["GB_LIBRARY_TEST_URL"] = url
            env[EVIDENCE_VARIABLES[name]] = str(evidence_dir)
            print(f"RUN {name} (expected {expected} cases)", flush=True)
            start = time.monotonic()
            try:
                result = subprocess.run(
                    [sys.executable, str(ROOT / "tests" / name)],
                    cwd=ROOT, env=env, capture_output=True, text=True,
                    encoding="utf8", errors="replace", timeout=480,
                    check=False,
                )
            except subprocess.TimeoutExpired as exc:
                raise AssertionError(f"{name}: 480s timeout") from exc
            print(result.stdout, end="", flush=True)
            if result.stderr:
                print(result.stderr, file=sys.stderr, flush=True)
            assert result.returncode == 0, (
                f"{name}: exit code {result.returncode}"
            )
            verify_case_records(name, result.stdout, expected)
            print(
                json.dumps({
                    "suite": name, "result": "PASS", "cases": expected,
                    "elapsed_seconds": round(time.monotonic() - start, 2)
                }), flush=True
            )
        total = sum(n for _, n in TESTS)
        print(
            json.dumps({"result": "PASS", "browser_suites": len(TESTS),
                        "browser_cases": total}),
            flush=True
        )
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)


def main() -> int:
    output = os.getenv("GB_LIBRARY_CI_EVIDENCE_DIR")
    if output:
        evidence_root = Path(output).resolve()
        evidence_root.mkdir(parents=True, exist_ok=True)
        run_all(evidence_root)
    else:
        with tempfile.TemporaryDirectory(prefix="gb-library-ci-") as tmp:
            run_all(Path(tmp))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
