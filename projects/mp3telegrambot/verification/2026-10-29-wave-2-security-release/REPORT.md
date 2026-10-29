# mp3telegrambot audit — wave 2 security and release provenance

**Source anchor:** `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`

## Scope

Read-only review of dependency/secret controls, subprocess execution, static security findings, health exposure, workflow permissions and release artifact identity. Product owner census was repeated first: `main` was unchanged; no new human repair PR or branch ahead of `main` existed.

## Existing controls verified

- exact lock installation and dependency-closure validation are mandatory in primary CI;
- resolved dependency audit and VOT npm audit succeeded on exact main;
- CodeQL Python and JavaScript/TypeScript succeeded;
- gitleaks succeeded with full-history checkout and a weekly schedule;
- production subprocess census found no `shell=True`, `os.system`, `eval`, unsafe YAML load or archive `extractall` path;
- dynamic SQLite identifiers reported by Bandit are constrained by fixed lists or explicit allowlists;
- SHA-1 findings are short non-security cache/fingerprint identities, not authentication or integrity proofs;
- bidirectional control characters reported by Bandit are deliberate Unicode-normalization fixtures/rules;
- health binding to `0.0.0.0` is an explicit external monitor surface; current payload exposes state/availability metrics but no secret values or filesystem paths;
- logging has a central secret-redaction contract and Local Bot API diagnostics explicitly redact token/hash/proxy passwords.

An independent Bandit pass over 73,755 production lines produced four HIGH and seven MEDIUM candidates. Manual source review rejected the hash, SQL, bidi, bind and operator-controlled Local Bot API URL candidates as non-security uses or bounded configuration. No direct credential leak, shell injection or unbounded archive extraction root was admitted.

## `MP3-RELEASE-PROVENANCE-001`

The release workflow supports both tag pushes and manual `workflow_dispatch` with a `tag` input. The tag-push path is correctly anchored: release `v4.0.0` ran on exact tag commit `2e819cfb3da6d0ea54ee4ac336b18e12d39d20cb` and completed successfully.

The manual rebuild path is not identity-bound:

1. `INPUT_TAG` is compared only with `core.version.__version__` from the checked-out workflow ref;
2. checkout does not set `ref: ${{ inputs.tag }}`;
3. build performs another default checkout of the workflow run ref;
4. publishing names the release from the input tag but does not prove `HEAD == refs/tags/<input>`.

Because current `main` remains version `4.0.0` hundreds of commits after the released tag, a manual run selected on `main` with input `v4.0.0` passes version and changelog checks while building current-main bytes. Existing release presence usually makes `gh release create` fail, but that is incidental API behavior, not an artifact identity guard; a deleted/recreated release or future same-version state can misbind artifacts to a tag.

**Closure boundary:** resolve and checkout the requested tag, fail unless checked-out HEAD equals its peeled tag commit, carry that SHA into the build job, and prove wheel/sdist/checksums were built from the same commit. Add negative tests for a same-version divergent branch/default-branch run.

## Disposition

Security posture is materially stronger than the raw static findings suggest. No wholesale rollback or emergency security revert is justified. One new release-provenance system root is admitted, while action/runner supply-chain currency remains owned by `MP3-CI-RUNTIME-MAINT-001` from wave 1.