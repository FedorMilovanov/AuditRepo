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
}
assert dict(module.TESTS) == expected
assert sum(expected.values()) == 39
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
    if name == "quality-transition-browser.py":
        for item in records:
            item["switches"] = [{}, {}]
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

# A JSON parsing failure is fatal rather than silently ignored.
try:
    module.verify_case_records("mobile-hud-browser.py", "{nonsense\n", 6)
except (AssertionError, ValueError):
    pass
else:
    raise AssertionError("Malformed JSON was silently ignored")

print("BROWSER_CI_CONTRACT_PASS: seven suites, 39 cases; fails on missing/SKIP/errors/bad quality direction/malformed JSON")
