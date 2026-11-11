"""Regression contract: browser CI must never count empty or partial evidence as PASS."""
from __future__ import annotations

import importlib.util
import json
from pathlib import Path

LAB = Path(__file__).resolve().parents[1]
SOURCE = LAB / "scripts/run-browser-regression.py"
spec = importlib.util.spec_from_file_location("gb_browser_runner", SOURCE)
assert spec is not None and spec.loader is not None
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

expected = {
    "interaction-regression-browser.py": 12,
    "architectural-art-browser.py": 4,
    "central-book-browser.py": 4,
    "mobile-hud-browser.py": 6,
    "reference-bay-browser.py": 5,
    "photo-transition-browser.py": 4,
    "quality-transition-browser.py": 4,
    "cabinet-persistence-browser.py": 2,
    "webgl-recovery-browser.py": 6,
    "visited-persistence-browser.py": 6,
    "reduced-motion-browser.py": 4,
    "reading-furniture-browser.py": 4,
}
assert dict(module.TESTS) == expected
assert sum(expected.values()) == 61
assert len(set(module.EVIDENCE_VARIABLES.values())) == len(expected)
assert set(module.EVIDENCE_VARIABLES) == set(expected)


def jsonlines(records: list[dict]) -> str:
    return "\n".join(json.dumps(record) for record in records)


def cases_for(name: str) -> list[dict]:
    records = [
        {"engine": "chromium", "viewport": f"{i}x800",
         "result": "PASS", "errors": []}
        for i in range(expected[name])
    ]
    if name == "reduced-motion-browser.py":
        for index, item in enumerate(records):
            pref = ("reduce", "no-preference")[index % 2]
            item["engine"] = ("chromium", "webkit")[index // 2]
            item["preference"] = pref
            item["sceneUnchanged"] = pref == "reduce"
            item["sha256"] = ["a", "a"] if pref == "reduce" else ["a", "b"]
    if name == "photo-transition-browser.py":
        for index, item in enumerate(records):
            item["engine"] = ("chromium", "webkit")[index // 2]
            item["viewport"] = ("1440x900", "390x844")[index % 2]
            item["sameCanvas"] = True
            item["cleanControlHidden"] = True
            item["revealAfterInput"] = True
            item["cleanScreenshot"] = "actual-clean-frame.png"
    if name == "reading-furniture-browser.py":
        for index, item in enumerate(records):
            item["engine"] = ("chromium", "webkit")[index // 2]
            item["viewport"] = ("1440x900", "390x844")[index % 2]
            item["center"] = "actual-center.png"
            item["lectern"] = "actual-lectern.png"
            item["report"] = {"hasWebGL2": True, "overflow": False, "visibleTitle": True}
            item["readingScreenshot"] = "actual-readable-detail.png"
            item["readingPanelReadable"] = {
                "focused": True, "fontPx": 15, "textWidth": 310,
                "left": 24, "right": 334, "overflow": False,
            }
    if name == "quality-transition-browser.py":
        for item in records:
            item["switches"] = [
                {"first": "Лёгкая", "last": "Ультра", "timedOut": False,
                 "canvasIdentityRetained": True, "overlayGone": True,
                 "settledVisibleFrames": 2},
                {"first": "Ультра", "last": "Лёгкая", "timedOut": False,
                 "canvasIdentityRetained": True, "overlayGone": True,
                 "settledVisibleFrames": 2},
            ]
    if name == "interaction-regression-browser.py":
        records.append({"passed": 12, "failures": []})
    return records


for name, count in expected.items():
    valid = cases_for(name)
    module.verify_case_records(name, jsonlines(valid), count)
    broken = valid[:-1]
    # Drop one *case*, not the interaction summary.
    if name == "interaction-regression-browser.py":
        broken = valid[:-2] + valid[-1:]
    try:
        module.verify_case_records(name, jsonlines(broken), count)
    except AssertionError:
        pass
    else:
        raise AssertionError(f"{name}: accepted missing browser case")

    invalid = [dict(item) for item in valid]
    invalid[0]["result"] = "SKIP"
    try:
        module.verify_case_records(name, jsonlines(invalid), count)
    except AssertionError:
        pass
    else:
        raise AssertionError(f"{name}: accepted SKIP as PASS")

    invalid = [dict(item) for item in valid]
    invalid[0]["errors"] = ["JS failure"]
    try:
        module.verify_case_records(name, jsonlines(invalid), count)
    except AssertionError:
        pass
    else:
        raise AssertionError(f"{name}: accepted JS page error")

# Photo fixtures must carry actual engine/viewport and clean-frame
# witnesses. Reject an unproven clean frame instead of weakening the runner.
missing_photo = cases_for("photo-transition-browser.py")
missing_photo[0]["cleanScreenshot"] = ""
try:
    module.verify_case_records("photo-transition-browser.py", jsonlines(missing_photo), 4)
except AssertionError:
    pass
else:
    raise AssertionError("Missing photo clean-frame screenshot was accepted")

hidden_control = cases_for("photo-transition-browser.py")
hidden_control[2]["cleanControlHidden"] = False
try:
    module.verify_case_records("photo-transition-browser.py", jsonlines(hidden_control), 4)
except AssertionError:
    pass
else:
    raise AssertionError("Visible photo exit chip was marked clean")

unusable_exit = cases_for("photo-transition-browser.py")
unusable_exit[3]["revealAfterInput"] = False
try:
    module.verify_case_records("photo-transition-browser.py", jsonlines(unusable_exit), 4)
except AssertionError:
    pass
else:
    raise AssertionError("Photo exit button that cannot be restored was accepted")

# Architectural art intentionally carries technical measurements in "result"
# and the test verdict in "status"; a truthy result dict is not a PASS.
architecture = cases_for("architectural-art-browser.py")
architecture[0] = {
    "engine": "chromium",
    "viewport": "1440x900",
    "status": "PASS",
    "result": {"hasWebGL2": True, "pbr": [True, True, True]},
    "errors": [],
}
module.verify_case_records("architectural-art-browser.py", jsonlines(architecture), 4)
architecture[0]["status"] = "FAIL"
try:
    module.verify_case_records("architectural-art-browser.py", jsonlines(architecture), 4)
except AssertionError:
    pass
else:
    raise AssertionError("Truthy architecture metrics were mistaken for a PASS")

# Quality must witness *both* directions per configuration.
invalid = cases_for("quality-transition-browser.py")
invalid[0]["switches"] = [{}]
try:
    module.verify_case_records("quality-transition-browser.py", jsonlines(invalid), 4)
except AssertionError:
    pass
else:
    raise AssertionError("Quality switching accepted one direction only")

# Reproduce the formerly accepted Linux false green: an automatic
# downgrade caused two independent low→high transitions, not a round trip.
double_forward = cases_for("quality-transition-browser.py")
double_forward[0]["switches"] = [
    {**double_forward[0]["switches"][0]},
    {**double_forward[0]["switches"][0]},
]
try:
    module.verify_case_records("quality-transition-browser.py", jsonlines(double_forward), 4)
except AssertionError:
    pass
else:
    raise AssertionError("Accepted two low-to-high quality transitions")

# Likewise an unsupported/empty witness must not count as a real transition.
empty_switch = cases_for("quality-transition-browser.py")
empty_switch[0]["switches"] = [{}, {}]
try:
    module.verify_case_records("quality-transition-browser.py", jsonlines(empty_switch), 4)
except AssertionError:
    pass
else:
    raise AssertionError("Accepted two empty quality transition records")

# Do not count a pair missing settled frames or having replaced the canvas.
incomplete = cases_for("quality-transition-browser.py")
incomplete[0]["switches"][1]["canvasIdentityRetained"] = False
try:
    module.verify_case_records("quality-transition-browser.py", jsonlines(incomplete), 4)
except AssertionError:
    pass
else:
    raise AssertionError("Accepted a replaced WebGL canvas during quality change")

# A JSON parsing failure is fatal rather than silently ignored.
try:
    module.verify_case_records("mobile-hud-browser.py", "{nonsense\n", 6)
except (AssertionError, ValueError):
    pass
else:
    raise AssertionError("Malformed JSON was silently ignored")

# Reading acceptance must not silently admit an invisible text plane.
missing_reading = cases_for("reading-furniture-browser.py")
missing_reading[0]["report"]["visibleTitle"] = False
try:
    module.verify_case_records("reading-furniture-browser.py", jsonlines(missing_reading), 4)
except AssertionError:
    pass
else:
    raise AssertionError("Missing readable lectern evidence was marked PASS")

# The physical lectern is not proven readable by an existing 3D screenshot
# or a title elsewhere in the document. Missing the focusable text view
# must fail even when the WebGL canvas and geometry both exist.
missing_detail = cases_for("reading-furniture-browser.py")
missing_detail[0]["readingScreenshot"] = ""
try:
    module.verify_case_records("reading-furniture-browser.py", jsonlines(missing_detail), 4)
except AssertionError:
    pass
else:
    raise AssertionError("Reading furniture accepted missing accessible detail evidence")

unfocused_detail = cases_for("reading-furniture-browser.py")
unfocused_detail[1]["readingPanelReadable"]["focused"] = False
try:
    module.verify_case_records("reading-furniture-browser.py", jsonlines(unfocused_detail), 4)
except AssertionError:
    pass
else:
    raise AssertionError("Reading furniture accepted unfocusable detail modal")

# A falsely-green static scene must not satisfy the normal-motion control.
broken_motion = cases_for("reduced-motion-browser.py")
broken_motion[1]["sha256"] = ["a", "a"]
try:
    module.verify_case_records("reduced-motion-browser.py", jsonlines(broken_motion), 4)
except AssertionError:
    pass
else:
    raise AssertionError("Normal-motion control accepted two identical screenshots")

print("BROWSER_CI_CONTRACT_PASS: twelve suites, 61 cases; fails on missing/SKIP/errors/bad quality/motion directions/malformed JSON")
