#!/usr/bin/env python3
"""Emit exact file/line contexts for unresolved matrix evidence IDs."""

from __future__ import annotations

import argparse
import json
import pathlib
import re

from matrix_coverage_lib import build_report

UNREGISTERED_RE = re.compile(
    r"^UNREGISTERED-EVIDENCE: reverify explicitly registers "
    r"(?P<finding>[A-Z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)+) "
)


def collect_contexts(project: pathlib.Path, radius: int = 2) -> dict[str, object]:
    coverage = build_report(project)
    unresolved = []
    for diagnostic in coverage["diagnostics"]:
        match = UNREGISTERED_RE.match(diagnostic)
        if match:
            unresolved.append(match.group("finding"))
    unresolved = sorted(set(unresolved))

    contexts: dict[str, list[dict[str, object]]] = {
        finding_id: [] for finding_id in unresolved
    }
    reverify = project / "reverify"
    if reverify.exists():
        for path in sorted(reverify.rglob("*.md")):
            lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
            for line_no, line in enumerate(lines, 1):
                for finding_id in unresolved:
                    pattern = rf"(?<![A-Za-z0-9-]){re.escape(finding_id)}(?![A-Za-z0-9-])"
                    if not re.search(pattern, line):
                        continue
                    start = max(0, line_no - radius - 1)
                    end = min(len(lines), line_no + radius)
                    contexts[finding_id].append(
                        {
                            "file": str(path.relative_to(project)),
                            "line": line_no,
                            "context": "\n".join(
                                f"{index + 1}: {lines[index]}"
                                for index in range(start, end)
                            ),
                        }
                    )

    return {
        "unresolvedIds": unresolved,
        "contexts": contexts,
        "coverageProblems": coverage["problems"],
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project", default="projects/gb-is-my-strength")
    parser.add_argument("--json-out", required=True)
    parser.add_argument("--markdown-out")
    parser.add_argument("--radius", type=int, default=2)
    args = parser.parse_args()

    root = pathlib.Path(__file__).resolve().parent.parent
    project = root / args.project
    report = collect_contexts(project, max(0, args.radius))

    json_path = pathlib.Path(args.json_out)
    json_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    if args.markdown_out:
        markdown = ["# Unresolved matrix evidence ID contexts", ""]
        for finding_id in report["unresolvedIds"]:
            markdown.extend([f"## {finding_id}", ""])
            entries = report["contexts"].get(finding_id, [])
            if not entries:
                markdown.extend(["No exact reverify context found.", ""])
                continue
            for entry in entries:
                markdown.extend(
                    [
                        f"### {entry['file']}:{entry['line']}",
                        "",
                        "```text",
                        str(entry["context"]),
                        "```",
                        "",
                    ]
                )
        markdown_path = pathlib.Path(args.markdown_out)
        markdown_path.parent.mkdir(parents=True, exist_ok=True)
        markdown_path.write_text("\n".join(markdown), encoding="utf-8")

    print(f"contexts: {len(report['unresolvedIds'])} unresolved IDs")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
