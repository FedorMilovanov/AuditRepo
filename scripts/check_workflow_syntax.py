#!/usr/bin/env python3
"""Offline GitHub workflow syntax, shape and immutable-action preflight."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import re
import sys
from typing import Iterable


ROOT = Path(__file__).resolve().parent.parent
WORKFLOW_ROOT = ROOT / ".github" / "workflows"
VENDOR_ROOT = ROOT / "scripts" / "vendor" / "pyyaml_6_0_3"
VENDOR_MANIFEST = ROOT / "scripts" / "vendor" / "pyyaml_6_0_3.manifest.json"
FULL_SHA = re.compile(r"^[0-9a-fA-F]{40}$")
ACTION_PATH = re.compile(
    r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)*$"
)
DOCKER_DIGEST = re.compile(r"^docker://[^@\s]+@sha256:[0-9a-fA-F]{64}$")
STRICT_HISTORY_COMMAND = "repository_history_forensic_audit.mjs --strict"
FETCH_DEPTH = re.compile(r"(?m)^\s+fetch-depth:\s*['\"]?([^'\"\s#]+)")


def verify_vendor(
    vendor_root: Path = VENDOR_ROOT,
    manifest_path: Path = VENDOR_MANIFEST,
) -> list[str]:
    errors: list[str] = []
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return [f"{manifest_path}: cannot read vendor manifest: {exc}"]

    if (
        manifest.get("package") != "PyYAML"
        or manifest.get("version") != "6.0.3"
        or manifest.get("license") != "MIT"
    ):
        errors.append(f"{manifest_path}: expected pinned PyYAML 6.0.3 MIT metadata")
    expected = manifest.get("files")
    if not isinstance(expected, dict) or not expected:
        return errors + [f"{manifest_path}: files must be a non-empty mapping"]

    actual_paths = {
        path.relative_to(vendor_root).as_posix()
        for path in vendor_root.rglob("*")
        if path.is_file() and "__pycache__" not in path.parts
    }
    expected_paths = set(expected)
    for missing in sorted(expected_paths - actual_paths):
        errors.append(f"{vendor_root / missing}: pinned vendor file is missing")
    for unexpected in sorted(actual_paths - expected_paths):
        errors.append(f"{vendor_root / unexpected}: unmanifested vendor file")

    for relative, expected_sha in sorted(expected.items()):
        if not isinstance(relative, str) or not isinstance(expected_sha, str):
            errors.append(f"{manifest_path}: vendor paths and digests must be strings")
            continue
        relative_path = Path(relative)
        if relative_path.is_absolute() or ".." in relative_path.parts:
            errors.append(f"{manifest_path}: unsafe vendor path {relative!r}")
            continue
        if not re.fullmatch(r"[0-9a-f]{64}", expected_sha):
            errors.append(f"{manifest_path}: invalid SHA-256 digest for {relative!r}")
            continue
        candidate = vendor_root / relative_path
        if not candidate.is_file():
            continue
        observed = hashlib.sha256(candidate.read_bytes()).hexdigest()
        if observed != expected_sha:
            errors.append(
                f"{candidate}: checksum mismatch; expected {expected_sha}, observed {observed}"
            )
    return errors


VENDOR_ERRORS = verify_vendor()
if not VENDOR_ERRORS:
    sys.path.insert(0, str(VENDOR_ROOT))
    import yaml  # type: ignore[import-not-found]  # noqa: E402
    from yaml.error import MarkedYAMLError  # type: ignore[import-not-found]  # noqa: E402
    from yaml.nodes import MappingNode, ScalarNode  # type: ignore[import-not-found]  # noqa: E402
else:
    yaml = None
    MarkedYAMLError = Exception
    MappingNode = ScalarNode = object


def location(path: Path, node_or_mark: object) -> str:
    mark = getattr(node_or_mark, "start_mark", node_or_mark)
    line = getattr(mark, "line", 0) + 1
    column = getattr(mark, "column", 0) + 1
    return f"{path}:{line}:{column}"


def immutable_uses_error(value: str) -> str | None:
    if value.startswith("./"):
        return None
    if value.startswith("docker://"):
        if DOCKER_DIGEST.fullmatch(value):
            return None
        return "docker uses must be pinned to a full sha256 digest"
    action, separator, revision = value.rpartition("@")
    if separator and ACTION_PATH.fullmatch(action) and FULL_SHA.fullmatch(revision):
        return None
    return "external uses must be pinned to a full 40-hex commit SHA"


def strict_history_checkout_error(text: str) -> str | None:
    """Reject shallow checkouts in workflows that make ancestry claims."""
    if STRICT_HISTORY_COMMAND not in text:
        return None
    depths = FETCH_DEPTH.findall(text)
    if depths and all(depth == "0" for depth in depths):
        return None
    observed = ", ".join(depths) if depths else "missing"
    return (
        "strict repository-history audit requires every checkout fetch-depth to be 0; "
        f"observed {observed}"
    )


def inspect_node(path: Path, node: object, errors: list[str]) -> None:
    if isinstance(node, MappingNode):
        seen: dict[str, object] = {}
        for key, value in node.value:
            if isinstance(key, ScalarNode):
                if key.value in seen:
                    errors.append(
                        f"{location(path, key)}: duplicate mapping key {key.value!r}"
                    )
                else:
                    seen[key.value] = key
                if key.value == "uses":
                    if not isinstance(value, ScalarNode):
                        errors.append(f"{location(path, value)}: uses must be a scalar string")
                    else:
                        problem = immutable_uses_error(value.value)
                        if problem:
                            errors.append(
                                f"{location(path, value)}: {problem}; observed {value.value!r}"
                            )
            inspect_node(path, value, errors)
    else:
        for child in getattr(node, "value", []):
            if not isinstance(child, str):
                inspect_node(path, child, errors)


def check_workflow_file(path: Path) -> list[str]:
    if VENDOR_ERRORS:
        return list(VENDOR_ERRORS)
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        return [f"{path}: cannot read workflow: {exc}"]

    try:
        documents = list(yaml.compose_all(text, Loader=yaml.BaseLoader))
    except MarkedYAMLError as exc:
        mark = getattr(exc, "problem_mark", None) or getattr(exc, "context_mark", None)
        problem = getattr(exc, "problem", None) or str(exc).splitlines()[0]
        return [f"{location(path, mark)}: YAML parse error: {problem}"]

    errors: list[str] = []
    if len(documents) != 1:
        return [f"{path}: expected exactly one YAML document; observed {len(documents)}"]
    root = documents[0]
    if not isinstance(root, MappingNode):
        return [f"{location(path, root)}: workflow root must be a mapping"]

    jobs_values = [
        value
        for key, value in root.value
        if isinstance(key, ScalarNode) and key.value == "jobs"
    ]
    if len(jobs_values) != 1:
        errors.append(f"{path}: workflow must contain exactly one top-level jobs key")
    elif not isinstance(jobs_values[0], MappingNode) or not jobs_values[0].value:
        errors.append(f"{location(path, jobs_values[0])}: jobs must be a non-empty mapping")

    inspect_node(path, root, errors)
    history_problem = strict_history_checkout_error(text)
    if history_problem:
        errors.append(f"{path}: {history_problem}")
    return errors


def workflow_paths(root: Path = WORKFLOW_ROOT) -> Iterable[Path]:
    return sorted({*root.rglob("*.yml"), *root.rglob("*.yaml")})


def main() -> int:
    errors = list(VENDOR_ERRORS)
    paths = list(workflow_paths())
    if not paths:
        errors.append(f"{WORKFLOW_ROOT}: no workflow files found")
    if not errors:
        for path in paths:
            errors.extend(check_workflow_file(path))

    if errors:
        print("AUDITREPO WORKFLOW PREFLIGHT: FAIL", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    print(
        f"AUDITREPO WORKFLOW PREFLIGHT: PASS "
        f"({len(paths)} workflows; PyYAML 6.0.3 checksum verified)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
