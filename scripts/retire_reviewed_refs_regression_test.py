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


class SupersededFakeClient(FakeClient):
    """Fake GitHub state for the superseded (non-ancestor) retirement mode."""

    def __init__(
        self,
        *,
        ahead_by: int = 2,
        extra_changed_path: str | None = None,
        base_behind_by: int = 0,
        replacement_merged: bool = True,
        retirement_error: type[Exception] = RuntimeError,
    ) -> None:
        super().__init__()
        self.ahead_by = ahead_by
        self.extra_changed_path = extra_changed_path
        self.base_behind_by = base_behind_by
        self.replacement_merged = replacement_merged
        self.retirement_error = retirement_error

    def compare(self, base: str, head: str) -> dict[str, object]:
        if (base, head) == ("base-sha", "main-sha"):
            return {
                "status": "ahead",
                "ahead_by": 5,
                "behind_by": self.base_behind_by,
                "files": [],
            }
        if (base, head) == ("base-sha", "old-sha"):
            files = [{"filename": "references/x.md"}, {"filename": "reports/y.md"}]
            if self.extra_changed_path:
                files.append({"filename": self.extra_changed_path})
            return {
                "status": "ahead",
                "ahead_by": self.ahead_by,
                "behind_by": 0,
                "files": files,
            }
        return super().compare(base, head)

    def merged_pr(self, number: int) -> dict[str, object]:
        # Mirror the real client: an unmerged replacement raises the engine's
        # fail-closed retirement error before any destructive call.
        if not self.replacement_merged:
            raise self.retirement_error(f"replacement PR #{number} is not merged")
        return super().merged_pr(number)


class ArchivePreservedFakeClient(FakeClient):
    """Fake state where a required archive ref preserves the target exact head."""

    def __init__(
        self,
        *,
        archive_head: str = "old-sha",
        include_archive: bool = True,
    ) -> None:
        super().__init__()
        if include_archive:
            self.refs["archive/evidence"] = archive_head
        else:
            self.refs.pop("archive/evidence", None)


class MergedSourceFakeClient(FakeClient):
    """Fake state where the source branch head is an exactly merged PR head."""

    def __init__(self) -> None:
        super().__init__()
        self.open_heads = set()

    def list_paged(self, api_path: str) -> list[dict[str, object]]:
        if "/pulls?state=all&head=" in api_path:
            return [
                {
                    "number": 12,
                    "merged_at": "2026-08-06T00:00:00Z",
                    "head": {"sha": "execution-sha", "ref": "execution-branch"},
                }
            ]
        return super().list_paged(api_path)


class MismatchedSourceFakeClient(MergedSourceFakeClient):
    """Fake state where no merged PR has the source branch head as its head."""

    def list_paged(self, api_path: str) -> list[dict[str, object]]:
        if "/pulls?state=all&head=" in api_path:
            return [
                {
                    "number": 12,
                    "merged_at": "2026-08-06T00:00:00Z",
                    "head": {"sha": "a-different-merged-head-sha", "ref": "execution-branch"},
                },
                {
                    "number": 13,
                    "merged_at": None,
                    "head": {"sha": "execution-sha", "ref": "execution-branch"},
                },
            ]
        return super(MergedSourceFakeClient, self).list_paged(api_path)


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


def write_superseded_request(root: Path, *, replacements: list[int] | None = None) -> Path:
    request = root / "superseded-request.json"
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
                        "mode": "superseded",
                        "expectedHead": "old-sha",
                        "comparisonBase": "base-sha",
                        "expectedAhead": 2,
                        "allowedChangedPaths": ["reports/y.md", "references/x.md"],
                        "replacementPullRequests": (
                            [7] if replacements is None else replacements
                        ),
                        "reason": "fixture superseded by merged PR #7",
                    }
                ],
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    return request


def write_archive_preserved_request(
    root: Path,
    *,
    archive_ref: str = "archive/evidence",
    required: bool = True,
    include_retained: bool = True,
) -> Path:
    safe_ref = archive_ref.replace("/", "-")
    request = root / (
        f"archive-preserved-{safe_ref}-"
        f"{'required' if required else 'optional'}-"
        f"{'retained' if include_retained else 'unretained'}.json"
    )
    retained = [{"branch": "main", "required": True}]
    if include_retained:
        retained.append({"branch": archive_ref, "required": required})
    request.write_text(
        json.dumps(
            {
                "schemaVersion": 1,
                "execute": True,
                "preparedOnMain": "prepared-sha",
                "sourceBranch": "execution-branch",
                "retainedRefs": retained,
                "targets": [
                    {
                        "branch": "old-work",
                        "mode": "archive-preserved",
                        "expectedHead": "old-sha",
                        "archiveRef": archive_ref,
                        "reason": "fixture exact head retained under archive ref",
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

        # Superseded mode: a non-ancestor target may be deleted only while its
        # comparison base is an ancestor of main, the ahead count, the exact
        # changed-path set and a merged replacement PR all still match review.
        superseded_request = write_superseded_request(root)

        superseded_dry = SupersededFakeClient()
        superseded_dry_evidence = root / "superseded-dry.json"
        require(
            run_engine(module, superseded_dry, superseded_request, superseded_dry_evidence, execute=False) == 0,
            "superseded dry-run failed",
        )
        dry = json.loads(superseded_dry_evidence.read_text(encoding="utf-8"))
        require(dry["status"] == "preflight-passed-dry-run", "superseded dry-run status drifted")
        require(superseded_dry.delete_calls == [], "superseded dry-run issued DELETE")
        require("old-work" in superseded_dry.refs, "superseded dry-run mutated target state")

        superseded_execute = SupersededFakeClient()
        superseded_execute_evidence = root / "superseded-execute.json"
        require(
            run_engine(module, superseded_execute, superseded_request, superseded_execute_evidence, execute=True) == 0,
            "superseded execute fixture failed",
        )
        executed = json.loads(superseded_execute_evidence.read_text(encoding="utf-8"))
        require(executed["status"] == "deleted-and-live-verified", "superseded execute status drifted")
        require(superseded_execute.delete_calls == ["old-work"], "superseded engine deleted outside the reviewed target")
        preflight_record = executed["preflight"][0]
        require(preflight_record["replacementPullRequests"] == [{"number": 7, "mergeCommit": "merged-sha", "mergedAt": "2026-08-06T00:00:00Z"}], "replacement PR evidence missing")
        require(preflight_record["comparison"]["changedPaths"] == ["references/x.md", "reports/y.md"], "changed-path set was not normalized and sorted")
        require(preflight_record["comparison"]["aheadBy"] == 2, "superseded ahead-count evidence missing")

        # Every drift shape must fail closed before the first DELETE.
        drift_shapes = (
            (SupersededFakeClient(ahead_by=3), "ahead count drifted"),
            (SupersededFakeClient(extra_changed_path="references/unreviewed.md"), "changed-path set drifted"),
            (SupersededFakeClient(base_behind_by=1), "not an ancestor of current main"),
        )
        for drift_fake, expected_error in drift_shapes:
            drift_evidence = root / "superseded-drift.json"
            try:
                run_engine(module, drift_fake, superseded_request, drift_evidence, execute=True)
            except module.RetirementError as error:
                require(expected_error in str(error), f"drift error drifted: {error}")
            else:
                raise AssertionError(f"superseded drift unexpectedly passed: {expected_error}")
            require(drift_fake.delete_calls == [], f"drift shape deleted before failing: {expected_error}")

        no_replacement_request = write_superseded_request(root, replacements=[])
        no_replacement_fake = SupersededFakeClient()
        no_replacement_evidence = root / "superseded-no-replacement.json"
        try:
            run_engine(module, no_replacement_fake, no_replacement_request, no_replacement_evidence, execute=True)
        except module.RetirementError as error:
            require("no merged replacement PR" in str(error), f"missing-replacement error drifted: {error}")
        else:
            raise AssertionError("superseded target without replacement PR unexpectedly passed")
        require(no_replacement_fake.delete_calls == [], "missing replacement still deleted the target")

        unmerged_replacement_request = write_superseded_request(root, replacements=[8])
        unmerged_replacement_fake = SupersededFakeClient(
            replacement_merged=False, retirement_error=module.RetirementError
        )
        unmerged_replacement_evidence = root / "superseded-unmerged-replacement.json"
        try:
            run_engine(module, unmerged_replacement_fake, unmerged_replacement_request, unmerged_replacement_evidence, execute=True)
        except module.RetirementError as error:
            require("is not merged" in str(error), f"unmerged-replacement error drifted: {error}")
        else:
            raise AssertionError("unmerged replacement PR unexpectedly passed")
        require(unmerged_replacement_fake.delete_calls == [], "unmerged replacement still deleted the target")

        # Archive-preserved mode is allowed only when a required archive/* ref
        # exists at exactly the target head. The archive itself is never a
        # target and must survive execution.
        archive_request = write_archive_preserved_request(root)
        archive_dry_fake = ArchivePreservedFakeClient()
        archive_dry_evidence = root / "archive-preserved-dry.json"
        require(
            run_engine(module, archive_dry_fake, archive_request, archive_dry_evidence, execute=False) == 0,
            "archive-preserved dry-run failed",
        )
        archive_dry = json.loads(archive_dry_evidence.read_text(encoding="utf-8"))
        require(archive_dry["status"] == "preflight-passed-dry-run", "archive dry-run status drifted")
        require(archive_dry_fake.delete_calls == [], "archive dry-run issued DELETE")
        archive_record = archive_dry["preflight"][0]["archivePreservation"]
        require(archive_record == {"archiveRef": "archive/evidence", "archiveHead": "old-sha"}, "archive proof evidence drifted")

        archive_execute_fake = ArchivePreservedFakeClient()
        archive_execute_evidence = root / "archive-preserved-execute.json"
        require(
            run_engine(module, archive_execute_fake, archive_request, archive_execute_evidence, execute=True) == 0,
            "archive-preserved execute fixture failed",
        )
        archive_executed = json.loads(archive_execute_evidence.read_text(encoding="utf-8"))
        require(archive_executed["status"] == "deleted-and-live-verified", "archive execute status drifted")
        require(archive_execute_fake.delete_calls == ["old-work"], "archive mode deleted outside reviewed source target")
        require("archive/evidence" in archive_execute_fake.refs, "required archive authority was deleted")
        require(archive_execute_fake.refs["archive/evidence"] == "old-sha", "archive authority head changed")

        archive_drift_cases = (
            (
                ArchivePreservedFakeClient(archive_head="different-sha"),
                write_archive_preserved_request(root),
                "archive-preserved head mismatch",
            ),
            (
                ArchivePreservedFakeClient(include_archive=False),
                write_archive_preserved_request(root),
                "required retained refs are already absent",
            ),
            (
                ArchivePreservedFakeClient(),
                write_archive_preserved_request(root, required=False),
                "must be a required retained ref",
            ),
            (
                ArchivePreservedFakeClient(include_archive=False),
                write_archive_preserved_request(root, include_retained=False),
                "must be a required retained ref",
            ),
            (
                ArchivePreservedFakeClient(include_archive=False),
                write_archive_preserved_request(
                    root, archive_ref="not-archive", required=False
                ),
                "requires one archive/* archiveRef",
            ),
        )
        for archive_fake, archive_bad_request, expected_error in archive_drift_cases:
            archive_bad_evidence = root / (
                "archive-preserved-drift-"
                + expected_error.replace(" ", "-").replace("/", "-")
                + ".json"
            )
            try:
                run_engine(
                    module,
                    archive_fake,
                    archive_bad_request,
                    archive_bad_evidence,
                    execute=True,
                )
            except module.RetirementError as error:
                require(expected_error in str(error), f"archive-preserved error drifted: {error}")
            else:
                raise AssertionError(
                    f"archive-preserved drift unexpectedly passed: {expected_error}"
                )
            require(
                archive_fake.delete_calls == [],
                f"archive-preserved drift deleted before failing: {expected_error}",
            )

        # A source branch whose exact head is a merged PR head is deleted as
        # merged maintenance source; a non-matching head must refuse.
        merged_source_fake = MergedSourceFakeClient()
        merged_source_evidence = root / "merged-source.json"
        require(
            run_engine(module, merged_source_fake, request, merged_source_evidence, execute=True) == 0,
            "merged-source fixture failed",
        )
        merged_source = json.loads(merged_source_evidence.read_text(encoding="utf-8"))
        require(merged_source["status"] == "deleted-and-live-verified", "merged-source status drifted")
        require(merged_source_fake.delete_calls == ["old-work", "execution-branch"], "merged-source deletion set drifted")
        source_deletion = merged_source["deleted"][-1]
        require(source_deletion["mode"] == "merged-maintenance-source", "merged-source deletion mode missing")
        require(source_deletion["pullRequests"] == [12], "merged-source PR evidence missing")
        require("execution-branch" not in merged_source_fake.refs, "merged source branch survived execution")

        # A source branch whose head is not the exact head of a merged PR
        # (only an older merged head, or an unmerged PR with that head) must
        # be refused, never deleted.
        mismatched_fake = MismatchedSourceFakeClient()
        mismatched_evidence = root / "mismatched-source.json"
        try:
            run_engine(module, mismatched_fake, request, mismatched_evidence, execute=True)
        except module.RetirementError as error:
            require("is not the exact head" in str(error), f"mismatched-source error drifted: {error}")
        else:
            raise AssertionError("mismatched source branch head unexpectedly passed")
        require(
            "execution-branch" in mismatched_fake.refs,
            "mismatched source branch was deleted despite refusing",
        )
        require(mismatched_fake.delete_calls == ["old-work"], "mismatched-source run deleted outside the target")

    print("AUDITREPO REF RETIREMENT REGRESSION: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
