# mp3telegrambot audit — wave 1 baseline

**AuditRepo anchor:** `main@02b8a9ba630ab5e6f62feca1b763965fa599a719`

**Source anchor:** `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`

**Large transaction under review:** Product PR #425, head `b0335eee34775044613162431756715ab7f2030b`, merge `df1d6c675106c50147ed0045dddfbc25c8f546da`

## Scope and collision boundary

This wave establishes a dedicated AuditRepo authority for the MP3 bot and decides whether the recent large refactor shows evidence requiring wholesale rollback. It does not mutate the Product repository. The Product owner census is re-read before every later wave because another agent is still working.

At capture time Product `main` was protected, no human repair PR was open, and five old/dependency PRs remained open: #296, #224, #217, #203 and #199. Twenty-five `arena/*` refs existed, but none was ahead of current `main`; only the five open-PR branches had unique commits and all were materially behind.

## Refactor transaction

PR #425 changed 116 files (`+3046/-922`) across 11 commits. The wider run from pre-wave commit `a05426bb02c293872e442b6eccf4ca67bba74f69` to current `main` contains 385 commits and changed 819 files (`+41117/-17696`). Tests account for 55.4% of changed files.

Independent current-tree measurements:

- collected pytest cases: 4,487;
- branch-aware measured coverage: 71.94%;
- strict declared type slice: 241/241 package modules, zero mypy errors;
- import contract: 241 files, 738 dependencies, zero broken contracts;
- broad `except Exception: pass` in production: 129 at the pre-wave anchor, zero now;
- `pipelines/main_pipeline.py`: 1,993 → 1,238 lines;
- `process_single_video`: 1,552 → 994 lines; approximate branch complexity 180 → 79;
- type-ignore occurrences: 16 → 8;
- postprocess markers: −29; regex markers did not increase.

With exact `requirements-lock.txt`, the complete documented repository verifier passed locally: compileall, 4,487 tests, Ruff check/format, strict types, import layers and diff hygiene. Product exact-head PR checks and all 13 relevant post-merge workflow runs also succeeded on `df1d6c67…`, including Python 3.12/3.13, Windows, packaging, dependency audit, CodeQL, secret scan and media-specific contracts.

**Disposition:** no evidence supports a wholesale rollback. A full rollback would remove reviewed behavior fixes, new tests and stronger guards. Any later proven regression must be localized to its first bad Product transaction and reverted surgically.

## Current admitted roots

### `MP3-BOOTSTRAP-ASSURANCE-001`

The claim “241/241 production modules” excludes the three root entrypoints `main.py`, `bot_new.py` and `bot.py`. `main.py` contains 1,259 lines; `run_bot_async` is approximately 974 lines with 119 branch points. Root modules are omitted from coverage source selection and from the strict mypy slice. Existing tests mostly inspect source/bootstrap ordering; only a narrow singleton-order test executes the orchestration boundary.

This is a verified assurance gap, not proof that runtime is broken. Closure requires executable bootstrap/orchestration tests plus strict typing or an explicit typed facade around the supported `bot_new.py` path, without fake network readiness.

### `MP3-CI-RUNTIME-MAINT-001`

Exact-main check annotations show current maintenance debt:

- Node 20 actions forced onto Node 24: `setup-node@v4`, `checkout@v4`, `setup-python@v5`, `gitleaks-action@v2` and CodeQL v3;
- CodeQL v3 deprecation announced for December 2026;
- Linux jobs use the moving `ubuntu-latest` alias while GitHub migrates it to Ubuntu 26;
- current workflows contain 55 mutable action tag references rather than immutable commit pins.

Closure requires current release verification, immutable pins, an explicit proven runner image and exact-head CI. Do not merge stale PR #203 or #224 wholesale; both are far behind current `main` and their policy does not match this boundary.

### `MP3-DEV-ENV-CONTRACT-001`

`AGENTS.md` instructs contributors to install `requirements-dev.txt` and run `tools/verify_repo.py`. On a clean Linux environment that sequence installs no `colorama`, while `test_every_locked_pin_supports_the_minimum_python` requires metadata for every package in `requirements-lock.txt`; verifier therefore fails. Installing the exact lock makes the same verifier pass completely.

Closure requires one reproducible documented developer install path aligned with CI, or a platform-aware metadata proof that does not false-red after the documented install.

### `MP3-REFACTOR-CANARY-001`

The refactor is strongly green under deterministic tests, but no fresh real-credential end-to-end witness was available for Telegram → Local Bot API → download → conversion → Gemini/Telegraph/LiveDub → delivery and restart recovery. This is a narrowed verification residual, not a reason to revert. It must remain collision-aware while another agent works.

Closure requires an operator-safe canary using legitimate credentials and sanitized evidence, or independent existing production telemetry that proves the same current SHA and boundaries. Secrets and user media must not enter AuditRepo.

## Boundary

This wave does not claim all Product behavior is correct, does not expose secrets, does not execute paid/live provider work and does not reserve Product files. Later waves will inspect security, async/process ownership, media correctness, publication semantics, data durability, CI governance and history in bounded packages against fresh Product heads.