#!/usr/bin/env python3
"""Emit exact file/line contexts for unresolved matrix evidence IDs."""

from __future__ import annotations

import argparse
import json
import pathlib

from matrix_coverage_lib import build_report


def collect_contexts(project: pathlib.Path, radius: int = 2) -> dict[str, object]:
    coverage = build_report(project)
    unresolved_entries = coverage.get("unregisteredEvidence", [])
    unresolved = [entry["id"] for entry in unresolved_entries]

    contexts: dict[str, list[dict[str, object]]] = {
        finding_id: [] for finding_id in unresolved
    }
    for entry in unresolved_entries:
        finding_id = entry["id"]
        for occurrence in entry.get("occurrences", []):
            path = project / str(occurrence["file"])
            lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
            for line_no in occurrence.get("lines", []):
                start = max(0, int(line_no) - radius - 1)
                end = min(len(lines), int(line_no) + radius)
                contexts[finding_id].append(
                    {
                        "file": str(occurrence["file"]),
                        "line": int(line_no),
                        "structuralContexts": occurrence.get("contexts", []),
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
                structural = ", ".join(entry.get("structuralContexts", [])) or "unknown"
                markdown.extend(
                    [
                        f"### {entry['file']}:{entry['line']}",
                        "",
                        f"Structural contexts: `{structural}`",
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
