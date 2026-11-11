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
    ("cabinet-persistence-browser.py", 2),
    ("webgl-recovery-browser.py", 6),
    ("visited-persistence-browser.py", 6),
    ("reduced-motion-browser.py", 4),
    ("reading-furniture-browser.py", 4),
)
EVIDENCE_VARIABLES = {
    "interaction-regression-browser.py": "GB_LIBRARY_INTERACTION_EVIDENCE_DIR",
    "architectural-art-browser.py": "GB_LIBRARY_ART_EVIDENCE_DIR",
    "central-book-browser.py": "GB_LIBRARY_BOOK_EVIDENCE_DIR",
    "mobile-hud-browser.py": "GB_LIBRARY_HUD_EVIDENCE_DIR",
    "reference-bay-browser.py": "GB_LIBRARY_FOCUS_EVIDENCE_DIR",
    "photo-transition-browser.py": "GB_LIBRARY_PHOTO_EVIDENCE_DIR",
    "quality-transition-browser.py": "GB_LIBRARY_QUALITY_EVIDENCE_DIR",
    "cabinet-persistence-browser.py": "GB_LIBRARY_CABINET_EVIDENCE_DIR",
    "webgl-recovery-browser.py": "GB_LIBRARY_RECOVERY_EVIDENCE_DIR",
    "visited-persistence-browser.py": "GB_LIBRARY_VISITED_EVIDENCE_DIR",
    "reduced-motion-browser.py": "GB_LIBRARY_MOTION_EVIDENCE_DIR",
    "reading-furniture-browser.py": "GB_LIBRARY_READING_EVIDENCE_DIR",
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
    if name == "reduced-motion-browser.py":
        assert {(case.get("engine"), case.get("preference")) for case in cases} == {
            ("chromium", "reduce"), ("chromium", "no-preference"),
            ("webkit", "reduce"), ("webkit", "no-preference"),
        }, f"Motion regression missing an engine/preference: {cases}"
        for case in cases:
            assert case.get("sceneUnchanged") is (case["preference"] == "reduce"), (
                f"Unproven reduced-motion screenshot comparison: {case}"
            )
            hashes = case.get("sha256")
            assert isinstance(hashes, list) and len(hashes) == 2 and (
                (hashes[0] == hashes[1]) is (case["preference"] == "reduce")
            ), f"Motion witness lacks consistent screenshot hashes: {case}"
    if name == "photo-transition-browser.py":
        assert {(case.get("engine"), case.get("viewport")) for case in cases} == {
            ("chromium","1440x900"), ("chromium","390x844"),
            ("webkit","1440x900"), ("webkit","390x844"),
        }, f"Photo screenshots omitted a browser/viewport: {cases}"
        for case in cases:
            assert case.get("sameCanvas") is True and (
                case.get("cleanControlHidden") is True
            ) and case.get("revealAfterInput") is True and (
                bool(case.get("cleanScreenshot"))
            ), f"Photo clean-frame/recovery evidence incomplete: {case}"
    if name == "reading-furniture-browser.py":
        assert {(case.get("engine"), case.get("viewport")) for case in cases} == {
            ("chromium", "1440x900"), ("chromium", "390x844"),
            ("webkit", "1440x900"), ("webkit", "390x844"),
        }, f"Reading regression omitted a browser or viewport: {cases}"
        for case in cases:
            witness = case.get("report")
            readable = case.get("readingPanelReadable")
            assert isinstance(witness, dict) and witness.get("hasWebGL2") is True and (
                witness.get("overflow") is False
            ) and witness.get("visibleTitle") is True and (
                bool(case.get("center")) and bool(case.get("lectern"))
            ), f"Reading furniture lacks actual UI or screenshot evidence: {case}"
            assert bool(case.get("readingScreenshot")) and isinstance(readable, dict) and (
                readable.get("focused") is True
            ) and readable.get("fontPx", 0) >= 15 and (
                readable.get("textWidth", 0) >= 200
            ) and readable.get("overflow") is False and (
                readable.get("left", -10) >= -1
            ), f"Lectern detailed reading view is not legible or focused: {case}"
    if name == "quality-transition-browser.py":
        # A count of two does not prove opposite directions: CI previously
        # reported low→high twice as PASS after an automatic downgrade.
        for case in cases:
            changes = case.get("switches")
            assert isinstance(changes, list) and len(changes) == 2, (
                f"Quality regression requires two real switches: {case}"
            )
            first, second = changes
            for change in changes:
                assert isinstance(change, dict) and (
                    change.get("first"), change.get("last")
                ) in (("Лёгкая", "Ультра"), ("Ультра", "Лёгкая")), (
                    f"Invalid quality mutation: {case}"
                )
                assert change.get("timedOut") is False and (
                    change.get("canvasIdentityRetained") is True
                ) and change.get("overlayGone") is True and (
                    change.get("settledVisibleFrames", 0) >= 2
                ), f"Incomplete quality transition: {case}"
            assert second["first"] == first["last"] and (
                second["last"] == first["first"]
            ), f"Quality transitions did not reverse continuously: {case}"


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
            # Keep each browser case visible in GitHub logs *as it happens*.
            # Buffered subprocess.run() previously swallowed partial witnesses
            # until its timeout, concealing the real Linux failure case.
            process = subprocess.Popen(
                [sys.executable, "-u", str(ROOT / "tests" / name)],
                cwd=ROOT, env=env,
                stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                text=True, encoding="utf8", errors="replace", bufsize=1,
            )
            lines: list[str] = []
            def relay_output() -> None:
                assert process.stdout is not None
                for line in process.stdout:
                    lines.append(line)
                    print(line, end="", flush=True)
            relay = threading.Thread(target=relay_output, daemon=True)
            relay.start()
            try:
                return_code = process.wait(timeout=480)
            except subprocess.TimeoutExpired as exc:
                process.kill()
                process.wait(timeout=10)
                relay.join(timeout=10)
                raise AssertionError(
                    f"{name}: 480s timeout after {len(lines)} output lines; "
                    "see the last successful case above"
                ) from exc
            relay.join(timeout=10)
            assert not relay.is_alive(), f"{name}: output reader stalled"
            assert return_code == 0, f"{name}: exit code {return_code}"
            verify_case_records(name, "".join(lines), expected)
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
