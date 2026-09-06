#!/usr/bin/env python3
"""Retire reviewed AuditRepo refs from an immutable request.

The command is dry-run by default. Destructive execution requires --execute.
It performs a complete live preflight before the first DELETE and writes
machine-readable evidence throughout execution.
"""

from __future__ import annotations

import argparse
import json
import os
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any


class RetirementError(RuntimeError):
    """Fail-closed retirement error."""


class GitHubClient:
    def __init__(self, repository: str, token: str) -> None:
        self.repository = repository
        self.owner = repository.split("/", 1)[0]
        self.headers = {
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "auditrepo-ref-retirement",
        }

    def request(
        self,
        method: str,
        api_path: str,
        *,
        allow: tuple[int, ...] = (200,),
    ) -> tuple[int, Any]:
        request = urllib.request.Request(
            f"https://api.github.com{api_path}",
            method=method,
            headers=self.headers,
        )
        try:
            with urllib.request.urlopen(request) as response:
                raw = response.read()
                payload = json.loads(raw) if raw else None
                if response.status not in allow:
                    raise RetirementError(
                        f"{method} {api_path}: unexpected HTTP {response.status}"
                    )
                return response.status, payload
        except urllib.error.HTTPError as error:
            raw = error.read().decode("utf-8", errors="replace")
            if error.code in allow:
                return error.code, raw
            raise RetirementError(
                f"{method} {api_path}: HTTP {error.code}: {raw[:500]}"
            ) from error

    def list_paged(self, api_path: str) -> list[dict[str, Any]]:
        items: list[dict[str, Any]] = []
        page = 1
        while True:
            separator = "&" if "?" in api_path else "?"
            _, batch = self.request(
                "GET", f"{api_path}{separator}per_page=100&page={page}"
            )
            if not isinstance(batch, list):
                raise RetirementError(f"Expected list from {api_path}")
            items.extend(batch)
            if len(batch) < 100:
                return items
            page += 1

    def ref_path(self, branch: str, *, plural: bool = False) -> str:
        encoded = urllib.parse.quote(f"heads/{branch}", safe="")
        noun = "refs" if plural else "ref"
        return f"/repos/{self.repository}/git/{noun}/{encoded}"

    def get_ref(self, branch: str) -> str | None:
        status, payload = self.request(
            "GET", self.ref_path(branch), allow=(200, 404)
        )
        if status == 404:
            return None
        return payload["object"]["sha"]

    def compare(self, base: str, head: str) -> dict[str, Any]:
        encoded_base = urllib.parse.quote(base, safe="")
        encoded_head = urllib.parse.quote(head, safe="")
        _, payload = self.request(
            "GET",
            f"/repos/{self.repository}/compare/{encoded_base}...{encoded_head}",
        )
        if not isinstance(payload, dict):
            raise RetirementError(f"Invalid compare payload for {base}...{head}")
        return payload

    def merged_pr(self, number: int) -> dict[str, Any]:
        _, pr = self.request("GET", f"/repos/{self.repository}/pulls/{number}")
        if not pr.get("merged_at"):
            raise RetirementError(f"replacement PR #{number} is not merged")
        return {
            "number": number,
            "mergeCommit": pr.get("merge_commit_sha"),
            "mergedAt": pr.get("merged_at"),
        }

    def open_pr_heads(self) -> set[str]:
        pull_requests = self.list_paged(
            f"/repos/{self.repository}/pulls?state=open"
        )
        return {
            pr["head"]["ref"]
            for pr in pull_requests
            if pr.get("head", {}).get("repo", {}).get("full_name")
            == self.repository
        }

    def branch_names(self) -> set[str]:
        return {
            branch["name"]
            for branch in self.list_paged(f"/repos/{self.repository}/branches")
        }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--request", required=True, type=Path)
    parser.add_argument("--current-main", required=True)
    parser.add_argument("--evidence-out", type=Path)
    parser.add_argument(
        "--execute",
        action="store_true",
        help="Perform DELETE calls after the complete preflight.",
    )
    return parser.parse_args()


def load_request(request_path: Path) -> tuple[dict[str, Any], Path, dict[str, Any]]:
    wrapper = json.loads(request_path.read_text(encoding="utf-8"))
    request_ref = wrapper.get("requestRef")
    if not request_ref:
        return wrapper, request_path, {}

    ref_path = Path(str(request_ref))
    if ref_path.name != str(request_ref) or ref_path.suffix != ".json":
        raise RetirementError("requestRef must be one JSON filename in the same directory")
    resolved = request_path.parent / ref_path.name
    if resolved == request_path or not resolved.is_file():
        raise RetirementError(f"requestRef is missing or self-referential: {request_ref}")
    if wrapper.get("schemaVersion") != 1 or wrapper.get("execute") is not True:
        raise RetirementError("Execution wrapper is unsupported or disabled")
    return json.loads(resolved.read_text(encoding="utf-8")), resolved, wrapper


def main() -> int:
    args = parse_args()
    repository = os.environ.get("GITHUB_REPOSITORY", "")
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN") or ""
    if not repository or "/" not in repository:
        raise RetirementError("GITHUB_REPOSITORY is required")
    if not token:
        raise RetirementError("GH_TOKEN or GITHUB_TOKEN is required")

    request_path = args.request
    evidence_path = args.evidence_out or (
        Path("reports/ref-retirement") / f"{request_path.stem}-evidence.json"
    )
    evidence_path.parent.mkdir(parents=True, exist_ok=True)

    client = GitHubClient(repository, token)
    evidence: dict[str, Any] = {
        "repository": repository,
        "requestPath": str(request_path),
        "resolvedRequestPath": None,
        "runId": os.environ.get("GITHUB_RUN_ID"),
        "runAttempt": os.environ.get("GITHUB_RUN_ATTEMPT"),
        "eventName": os.environ.get("GITHUB_EVENT_NAME"),
        "currentMain": args.current_main,
        "execute": args.execute,
        "preflight": [],
        "deleted": [],
        "alreadyAbsent": [],
        "finalBranches": [],
        "status": "started",
    }

    def write_evidence() -> None:
        evidence_path.write_text(
            json.dumps(evidence, indent=2) + "\n", encoding="utf-8"
        )

    try:
        manifest, resolved_request, wrapper = load_request(request_path)
        evidence["resolvedRequestPath"] = str(resolved_request)
        if wrapper:
            evidence["executionWrapper"] = wrapper

        if manifest.get("schemaVersion") != 1 or manifest.get("execute") is not True:
            raise RetirementError("Retirement request is unsupported or disabled")

        live_main = client.get_ref("main")
        if live_main != args.current_main:
            raise RetirementError(
                f"main moved before execution: expected {args.current_main}, found {live_main}"
            )

        prepared = manifest.get("preparedOnMain")
        if not prepared:
            raise RetirementError("preparedOnMain is required")
        lineage = client.compare(str(prepared), args.current_main)
        if lineage.get("behind_by") != 0 or lineage.get("status") not in {
            "ahead",
            "identical",
        }:
            raise RetirementError(
                f"current main is not a descendant of preparedOnMain {prepared}: "
                f"{lineage.get('status')}"
            )

        targets = manifest.get("targets") or []
        names = [item.get("branch") for item in targets]
        if not targets or len(names) != len(set(names)) or any(not name for name in names):
            raise RetirementError(
                "Target list must be non-empty with unique branch names"
            )
        target_names = set(names)

        retained = manifest.get("retainedRefs") or []
        retained_names = {item["branch"] for item in retained}
        retained_by_name = {item["branch"]: item for item in retained}
        source_branch = manifest.get("sourceBranch")
        if not source_branch:
            raise RetirementError("sourceBranch is required")

        for name in names:
            if name == "main" or name.startswith("archive/"):
                raise RetirementError(f"protected branch entered target list: {name}")
            if name in retained_names or name == source_branch:
                raise RetirementError(f"retained/source branch entered target list: {name}")

        open_heads = client.open_pr_heads()
        overlap = sorted(target_names.intersection(open_heads))
        if overlap:
            raise RetirementError(f"targets still own open PRs: {overlap}")

        initial_branches = client.branch_names()
        required_missing = sorted(
            item["branch"]
            for item in retained
            if item.get("required") and item["branch"] not in initial_branches
        )
        if required_missing:
            raise RetirementError(
                f"required retained refs are already absent: {required_missing}"
            )
        allowed_before = retained_names | open_heads | target_names | {source_branch}
        unexpected_before = sorted(initial_branches - allowed_before)
        if unexpected_before:
            raise RetirementError(
                f"unreviewed remote branches appeared before execution: {unexpected_before}"
            )

        for item in targets:
            branch = item["branch"]
            actual = client.get_ref(branch)
            expected = item.get("expectedHead")
            if actual is None:
                raise RetirementError(
                    f"target branch is absent before reviewed execution: {branch}"
                )
            if actual != expected:
                raise RetirementError(
                    f"head mismatch for {branch}: expected {expected}, found {actual}"
                )

            record: dict[str, Any] = {
                "branch": branch,
                "mode": item.get("mode"),
                "head": actual,
                "reason": item.get("reason"),
            }
            mode = item.get("mode")
            if mode == "ancestor":
                relation = client.compare(args.current_main, actual)
                if relation.get("ahead_by") != 0:
                    raise RetirementError(
                        f"{branch} is no longer a pure ancestor: "
                        f"ahead_by={relation.get('ahead_by')}"
                    )
                record["mainRelation"] = {
                    "status": relation.get("status"),
                    "aheadBy": relation.get("ahead_by"),
                    "behindBy": relation.get("behind_by"),
                }
            elif mode == "superseded":
                base = item.get("comparisonBase")
                if not base:
                    raise RetirementError(f"comparisonBase missing for {branch}")
                base_lineage = client.compare(str(base), args.current_main)
                if base_lineage.get("behind_by") != 0:
                    raise RetirementError(
                        f"comparisonBase {base} is not an ancestor of current main"
                    )
                relation = client.compare(str(base), actual)
                if relation.get("ahead_by") != item.get("expectedAhead"):
                    raise RetirementError(
                        f"{branch} ahead count drifted: "
                        f"expected {item.get('expectedAhead')}, "
                        f"found {relation.get('ahead_by')}"
                    )
                actual_paths = sorted(
                    file["filename"] for file in relation.get("files", [])
                )
                expected_paths = sorted(item.get("allowedChangedPaths") or [])
                if actual_paths != expected_paths:
                    raise RetirementError(
                        f"{branch} changed-path set drifted: "
                        f"expected {expected_paths}, found {actual_paths}"
                    )
                replacements = [
                    client.merged_pr(int(number))
                    for number in item.get("replacementPullRequests") or []
                ]
                if not replacements:
                    raise RetirementError(f"{branch} has no merged replacement PR")
                record["replacementPullRequests"] = replacements
                record["comparison"] = {
                    "base": base,
                    "aheadBy": relation.get("ahead_by"),
                    "behindBy": relation.get("behind_by"),
                    "changedPaths": actual_paths,
                }
            elif mode == "archive-preserved":
                archive_ref = item.get("archiveRef")
                if (
                    not isinstance(archive_ref, str)
                    or not archive_ref.startswith("archive/")
                    or archive_ref == branch
                ):
                    raise RetirementError(
                        f"archive-preserved target {branch} requires one archive/* archiveRef"
                    )
                retained_archive = retained_by_name.get(archive_ref)
                if not retained_archive or retained_archive.get("required") is not True:
                    raise RetirementError(
                        f"archive-preserved ref {archive_ref} must be a required retained ref"
                    )
                archive_head = client.get_ref(archive_ref)
                if archive_head is None:
                    raise RetirementError(
                        f"archive-preserved ref is missing: {archive_ref}"
                    )
                if archive_head != actual:
                    raise RetirementError(
                        f"archive-preserved head mismatch for {branch}: "
                        f"target {actual}, archive {archive_ref} {archive_head}"
                    )
                record["archivePreservation"] = {
                    "archiveRef": archive_ref,
                    "archiveHead": archive_head,
                }
            else:
                raise RetirementError(
                    f"unsupported target mode for {branch}: {mode}"
                )
            evidence["preflight"].append(record)

        evidence["initialBranches"] = sorted(initial_branches)
        evidence["openPullRequestHeads"] = sorted(open_heads)
        evidence["status"] = "preflight-passed"
        write_evidence()

        if not args.execute:
            evidence["status"] = "preflight-passed-dry-run"
            write_evidence()
            return 0

        for record in evidence["preflight"]:
            branch = record["branch"]
            status, _ = client.request(
                "DELETE", client.ref_path(branch, plural=True), allow=(204,)
            )
            if status != 204:
                raise RetirementError(f"deletion returned {status} for {branch}")
            evidence["deleted"].append(
                {"branch": branch, "head": record["head"]}
            )
            write_evidence()

        source_head = client.get_ref(source_branch)
        if source_head is None:
            evidence["alreadyAbsent"].append(source_branch)
        elif source_branch in open_heads:
            evidence["deferredSourceBranch"] = {
                "branch": source_branch,
                "head": source_head,
                "reason": "Source branch still owns an open pull request.",
            }
        else:
            encoded_head = urllib.parse.quote(
                f"{client.owner}:{source_branch}", safe=""
            )
            pull_requests = client.list_paged(
                f"/repos/{repository}/pulls?state=all&head={encoded_head}"
            )
            matching_merged = [
                pr
                for pr in pull_requests
                if pr.get("merged_at")
                and pr.get("head", {}).get("sha") == source_head
            ]
            if not matching_merged:
                raise RetirementError(
                    f"source branch head {source_head} is not the exact head "
                    "of a merged PR"
                )
            client.request(
                "DELETE", client.ref_path(source_branch, plural=True), allow=(204,)
            )
            evidence["deleted"].append(
                {
                    "branch": source_branch,
                    "head": source_head,
                    "mode": "merged-maintenance-source",
                    "pullRequests": [pr["number"] for pr in matching_merged],
                }
            )

        for branch in names:
            if client.get_ref(branch) is not None:
                raise RetirementError(f"absence verification failed for {branch}")
        if source_branch not in open_heads and client.get_ref(source_branch) is not None:
            raise RetirementError(
                f"absence verification failed for source branch {source_branch}"
            )

        final_branches = client.branch_names()
        current_open_heads = client.open_pr_heads()
        allowed_after = retained_names | current_open_heads
        unexpected_after = sorted(final_branches - allowed_after)
        required_missing = sorted(
            item["branch"]
            for item in retained
            if item.get("required") and item["branch"] not in final_branches
        )
        if unexpected_after:
            raise RetirementError(
                f"unreviewed remote branches remain: {unexpected_after}"
            )
        if required_missing:
            raise RetirementError(
                f"required retained refs disappeared: {required_missing}"
            )

        evidence["finalBranches"] = sorted(final_branches)
        evidence["openPullRequestHeads"] = sorted(current_open_heads)
        evidence["status"] = "deleted-and-live-verified"
        write_evidence()
        return 0
    except Exception as error:
        evidence["status"] = "failed"
        evidence["error"] = str(error)
        write_evidence()
        raise


if __name__ == "__main__":
    raise SystemExit(main())
