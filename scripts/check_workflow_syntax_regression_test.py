#!/usr/bin/env python3
import hashlib
import json
from pathlib import Path
import tempfile

from check_workflow_syntax import check_workflow_file, immutable_uses_error, verify_vendor


PIN = "1" * 40


def write_fixture(root: Path, name: str, body: str) -> Path:
    path = root / name
    path.write_text(body, encoding="utf-8")
    return path


def expect_pass(path: Path) -> None:
    errors = check_workflow_file(path)
    assert not errors, f"{path.name} should pass: {errors}"


def expect_fail(path: Path, fragment: str) -> None:
    errors = check_workflow_file(path)
    assert errors, f"{path.name} should fail"
    assert any(fragment in error for error in errors), (fragment, errors)


with tempfile.TemporaryDirectory(prefix="auditrepo-workflow-preflight-") as temp:
    root = Path(temp)
    expect_pass(
        write_fixture(
            root,
            "valid.yml",
            f"""name: valid
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@{PIN}
      - uses: ./.github/actions/local
      - uses: docker://example.invalid/tool@sha256:{'2' * 64}
      - run: |
          python3 - <<'PY'
          replacement = '''
          quoted heredoc remains inside the YAML block
          '''
          PY
""",
        )
    )
    expect_fail(
        write_fixture(
            root,
            "deindented-heredoc.yml",
            """name: exact incident shape
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: |
          python3 - <<'PY'
          replacement = '''
this line escaped the run block
'''
          PY
""",
        ),
        "YAML parse error",
    )
    expect_fail(write_fixture(root, "missing-jobs.yml", "name: missing\non: push\n"), "jobs key")
    expect_fail(write_fixture(root, "empty-jobs.yml", "name: empty\non: push\njobs: {}\n"), "non-empty mapping")
    expect_fail(
        write_fixture(root, "two-documents.yml", "name: one\njobs: {a: {}}\n---\nname: two\njobs: {b: {}}\n"),
        "exactly one YAML document",
    )
    expect_fail(
        write_fixture(root, "mutable-action.yml", "name: mutable\non: push\njobs:\n  test:\n    uses: actions/checkout@v4\n"),
        "full 40-hex commit SHA",
    )
    expect_fail(
        write_fixture(root, "duplicate-jobs.yml", "name: duplicate\non: push\njobs: {a: {}}\njobs: {b: {}}\n"),
        "duplicate mapping key 'jobs'",
    )

    vendor = root / "vendor"
    vendor.mkdir()
    vendored_file = vendor / "parser.py"
    vendored_file.write_text("PINNED = True\n", encoding="utf-8")
    digest = hashlib.sha256(vendored_file.read_bytes()).hexdigest()
    manifest = root / "manifest.json"
    manifest.write_text(
        json.dumps(
            {
                "package": "PyYAML",
                "version": "6.0.3",
                "license": "MIT",
                "files": {"parser.py": digest},
            }
        ),
        encoding="utf-8",
    )
    assert verify_vendor(vendor, manifest) == []
    vendored_file.write_text("PINNED = False\n", encoding="utf-8")
    assert any("checksum mismatch" in error for error in verify_vendor(vendor, manifest))

assert immutable_uses_error(f"actions/checkout@{PIN}") is None
assert immutable_uses_error("./.github/actions/local") is None
assert immutable_uses_error("actions/checkout@v4") is not None
assert immutable_uses_error("docker://alpine:latest") is not None

print("AUDITREPO WORKFLOW PREFLIGHT REGRESSION: PASS")
