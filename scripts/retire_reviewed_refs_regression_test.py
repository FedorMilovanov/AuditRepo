#!/usr/bin/env python3
"""Black-box regressions for the reviewed-ref retirement engine."""

from __future__ import annotations

import importlib.util
import json
import os
from pathlib import Path
import sys
import tempfile
import urllib.parse


HERE = Path(__file__).resolve().parent
ENGINE_PATH = HERE / "retire_reviewed_refs.py"


def load_engine():
    spec = importlib.util.spec_from_file_location("auditrepo_retirement_engine", ENGINE_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot load {ENGINE_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


class FakeClient:
    def __init__(self, *, unexpected: bool = False) -> None:
        self.owner = "example"
        self.refs = {
            "main": "main-sha",
            "archive/evidence": "archive-sha",
            "old-work": "old-sha",
            "execution-branch": "execution-sha",
        }
        if unexpected:
            self.refs["surprise-work"] = "surprise-sha"
        self.open_heads = {"execution-branch"}
        self.delete_calls: list[str] = []

    def get_ref(self, branch: str) -> str | None:
        return self.refs.get(branch)

    def open_pr_heads(self) -> set[str]:
        return set(self.open_heads)

    def branch_names(self) -> set[str]:
        return set(self.refs)

    def compare(self, base: str, head: str) -> dict[str, object]:
        if (base, head) == ("prepared-sha", "main-sha"):
            return {"status": "ahead", "ahead_by": 1, "behind_by": 0, "files": []}
        if (base, head) == ("main-sha", "old-sha"):
            return {"status": "behind", "ahead_by": 0, "behind_by": 1, "files": []}
        raise AssertionError(f"unexpected compare {base}...{head}")

    def merged_pr(self, number: int) -> dict[str, object]:
        return {"number": number, "mergeCommit": "merged-sha", "mergedAt": "2026-08-06T00:00:00Z"}

    def list_paged(self, api_path: str) -> list[dict[str, object]]:
        if "/pulls?state=all&head=" in api_path:
            return []
        raise AssertionError(f"unexpected paged request: {api_path}")

    def ref_path(self, branch: str, *, plural: bool = False) -> str:
        encoded = urllib.parse.quote(f"heads/{branch}", safe="")
        noun = "refs" if plural else "ref"
        return f"/repos/example/AuditRepo/git/{noun}/{encoded}"

    def request(
        self,
        method: str,
        api_path: str,
        *,
        allow: tuple[int, ...] = (200,),
    ) -> tuple[int, object | None]:
        require(method == "DELETE", f"unexpected method: {method}")
        encoded = api_path.rsplit("/", 1)[-1]
        ref = urllib.parse.unquote(encoded)
        require(ref.startswith("heads/"), f"unexpected ref path: {api_path}")
        branch = ref.removeprefix("heads/")
        require(branch in self.refs, f"delete requested for unknown branch: {branch}")
        self.delete_calls.append(branch)
        del self.refs[branch]
        return 204, None


def write_request(root: Path) -> Path:
    request = root / "request.json"
    request.write_text(
        json.dumps(
            {
                "schemaVersion": 1,
                "execute": True,
                "preparedOnMain": "prepared-sha",
                "sourceBranch": "execution-branch",
                "retainedRefs": [
                    {"branch": "main", "required": True},
                    {"branch": "archive/evidence", "required": True},
                ],
                "targets": [
                    {
                        "branch": "old-work",
                        "mode": "ancestor",
                        "expectedHead": "old-sha",
                        "reason": "fixture ancestor",
                    }
                ],
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    return request


def run_engine(module, fake: FakeClient, request: Path, evidence: Path, *, execute: bool) -> int:
    previous_argv = sys.argv
    previous_repo = os.environ.get("GITHUB_REPOSITORY")
    previous_token = os.environ.get("GH_TOKEN")
    original_client = module.GitHubClient
    try:
        module.GitHubClient = lambda repository, token: fake
        os.environ["GITHUB_REPOSITORY"] = "example/AuditRepo"
        os.environ["GH_TOKEN"] = "fixture-token"
        sys.argv = [
            "retire_reviewed_refs.py",
            "--request",
            str(request),
            "--current-main",
            "main-sha",
            "--evidence-out",
            str(evidence),
            *(["--execute"] if execute else []),
        ]
        return int(module.main())
    finally:
        module.GitHubClient = original_client
        sys.argv = previous_argv
        if previous_repo is None:
            os.environ.pop("GITHUB_REPOSITORY", None)
        else:
            os.environ["GITHUB_REPOSITORY"] = previous_repo
        if previous_token is None:
            os.environ.pop("GH_TOKEN", None)
        else:
            os.environ["GH_TOKEN"] = previous_token


def main() -> int:
    module = load_engine()

    with tempfile.TemporaryDirectory(prefix="auditrepo-ref-retirement-") as raw:
        root = Path(raw)
        request = write_request(root)

        dry_fake = FakeClient()
        dry_evidence = root / "dry.json"
        require(run_engine(module, dry_fake, request, dry_evidence, execute=False) == 0, "dry-run failed")
        dry = json.loads(dry_evidence.read_text(encoding="utf-8"))
        require(dry["status"] == "preflight-passed-dry-run", "dry-run status drifted")
        require(dry_fake.delete_calls == [], "dry-run issued DELETE")
        require("old-work" in dry_fake.refs, "dry-run mutated target state")

        execute_fake = FakeClient()
        execute_evidence = root / "execute.json"
        require(run_engine(module, execute_fake, request, execute_evidence, execute=True) == 0, "execute fixture failed")
        executed = json.loads(execute_evidence.read_text(encoding="utf-8"))
        require(executed["status"] == "deleted-and-live-verified", "execute status drifted")
        require(execute_fake.delete_calls == ["old-work"], "engine deleted outside the reviewed target")
        require("old-work" not in execute_fake.refs, "target remained after execute")
        require("execution-branch" in execute_fake.refs, "open source branch was not deferred")
        require(executed.get("deferredSourceBranch", {}).get("branch") == "execution-branch", "source deferral evidence missing")

        unexpected_fake = FakeClient(unexpected=True)
        unexpected_evidence = root / "unexpected.json"
        try:
            run_engine(module, unexpected_fake, request, unexpected_evidence, execute=True)
        except module.RetirementError as error:
            require("unreviewed remote branches appeared" in str(error), "unexpected-ref error drifted")
        else:
            raise AssertionError("unreviewed branch unexpectedly passed preflight")
        require(unexpected_fake.delete_calls == [], "unexpected branch was detected after DELETE")
        failed = json.loads(unexpected_evidence.read_text(encoding="utf-8"))
        require(failed["status"] == "failed", "failed preflight evidence status drifted")

        wrapper_dir = root / "wrappers"
        wrapper_dir.mkdir()
        original = wrapper_dir / "original.json"
        original.write_text(request.read_text(encoding="utf-8"), encoding="utf-8")
        wrapper = wrapper_dir / "wrapper.json"
        wrapper.write_text(
            json.dumps({"schemaVersion": 1, "execute": True, "requestRef": "original.json"}) + "\n",
            encoding="utf-8",
        )
        manifest, resolved, metadata = module.load_request(wrapper)
        require(resolved == original, "wrapper did not resolve same-directory request")
        require(manifest["targets"][0]["branch"] == "old-work", "wrapper changed target request")
        require(metadata["requestRef"] == "original.json", "wrapper metadata missing")

        for invalid_ref in ("../original.json", "wrapper.json"):
            wrapper.write_text(
                json.dumps({"schemaVersion": 1, "execute": True, "requestRef": invalid_ref}) + "\n",
                encoding="utf-8",
            )
            try:
                module.load_request(wrapper)
            except module.RetirementError:
                pass
            else:
                raise AssertionError(f"invalid wrapper reference passed: {invalid_ref}")

    print("AUDITREPO REF RETIREMENT REGRESSION: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
