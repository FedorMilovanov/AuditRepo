# Audit marathon R5 — convergence residuals after production evidence import

## Meta

- **Severity:** P1/P2 mixed forensic intake
- **Observed source SHA:** `be78785b601aa167c8e5efbc98a4582645b5191c`
- **Imported deployed authority:** `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320`
- **AuditRepo base:** `2edfe200b3b9a67da671fb40461ccf8cc091e355`
- **Research authority observed:** `b654c5375a7b212ff9b42c08bb0193eeaad70746`
- **Date:** 2026-07-25

This report extends R4. It preserves exact residuals that appeared after notifier lifecycle, series capability and production-evidence work converged. It does not replace the current SSOT files.

---

## 1. CI lifecycle is broadly fixed, but global transition ordering is not yet monotonic

### Finding `CI-ALERT-POST-RECOVERY-ORDERING`

**Severity:** P1

Merged notifier work correctly added:

- workflow + PR/branch machine keys;
- factual failed jobs/steps/artifacts;
- open and closed issue lookup;
- ambiguity rejection;
- label preservation;
- recovery comments and closure;
- `latestSeen` and `recoveredBy` state.

Residual source defect on `be78785b`:

`handleFailure()` compares an incoming failure only with `previousState.latestFailure`, while a newer successful transition is stored in `latestSeen`.

False-reopen sequence:

1. failure run `200/1` opens the issue;
2. success run `201/1` closes it and stores `latestSeen=201/1`;
3. delayed failure event `200/2` arrives;
4. `200/2` is newer than `latestFailure=200/1` but older than `latestSeen=201/1`;
5. the closed issue is incorrectly reopened.

Source issue #318 owns the correction. Required rule: every terminal event is ordered against one monotonic `latestSeen` cursor; `latestFailure` remains diagnostic data only.

Required adversarial fixtures:

- `200/1 failure → 201/1 success → 200/2 failure` = ignored;
- same-run older attempt after recovery = ignored;
- exact duplicate of `latestSeen` = ignored;
- `202/1 failure` after `201/1 success` = deterministic reopen;
- state marker stays monotonic across repeated close/reopen cycles.

The closed matrix row `CI-ALERT-NO-RECOVERY-STATE` may remain closed for the broad architecture, but the next canonical reconciliation must register this residual as an open P1 row rather than claiming all stale-run ordering is complete.

---

## 2. Series interface converged; temporary validation ownership removed

### Closure `SERIES-CAPABILITY-INTERFACE`

PR #319 merged as `be78785b601aa167c8e5efbc98a4582645b5191c` after exact Shared Files Guard run `30170548516` succeeded.

The permanent contract now proves:

- every reading series resolves the canonical `SeriesReaderChrome` façade with an actually bound `defineSeriesConfig(...)` flat/book config, or has one explicit capability exception;
- a route-specific component locally named `SeriesReaderChrome` cannot impersonate the shared façade;
- importing an unrelated human-heart/Gill config cannot satisfy another series' shape;
- existing native Nagornaya chapters are explicit governed exceptions;
- missing ReaderState/navigation/settings/TTS/print/accessibility/publication evidence fails.

Temporary PR #316 was closed without merge as superseded. No comment-only validation carrier remains an active owner.

---

## 3. Font pipeline: fail-closed architecture is valid; current red is a fixture-authority defect

### Finding `FONT-CONTRACT-FIXTURE-AUTHORITY-DRIFT`

**Severity:** P1 for PR #309 acceptance; not a production regression

PR #309 correctly moves toward:

- offline pinned production verification;
- exact WOFF2/SFNT bytes and SHA-256;
- a reviewed support manifest;
- no opportunistic production downloads;
- transactional maintainer-only generation.

Two exact Shared Files Guard failures were diagnosed from artifacts/source:

1. after support-manifest hardening, `writeFixture()` still omitted the support manifest and support assets, so even the nominal fixture could not satisfy the new production contract;
2. after that was repaired, the metadata-drift mutation changed only `css/fonts.css` while the canonical support registry `fonts/fonts.css` still contained a correct matching face. The verifier legitimately found one correct candidate, so `assert.throws` failed.

Exact current artifact evidence for head `8c159105`:

```text
AssertionError: Missing expected exception
font-assets-contract-test.mjs:241
expected: /metadata does not match manifest/
```

Required test repair:

- mutate the canonical support registry;
- update its support-manifest bytes/hash so semantic metadata validation is reached;
- remove or mutate any duplicate correct registry in that fixture;
- explicitly define whether compatibility duplicate registries are forbidden, ignored, or byte-identical;
- validate `fontFaceOverrides` schema and deterministic authority.

Do not make support-manifest optional or weaken real-repository verification to turn CI green.

---

## 4. Downstream deployment witness repair is valid, but privileged dependencies remain mutable

### Finding `DEPLOY-LEDGER-PR-WRITE-ACTION-PIN-GAP`

**Severity:** P1 / shared with source issue #301

Production for `f5e29998` is independently healthy and already imported:

- readiness `30169126149` — success;
- deploy `30169443420` — success;
- Pages artifact `8622641548` — `sha256:38a3a138d9f062e43c0e3ed52666113759d310cb0231e2ee388fc522b25e2b2c`;
- TTS witness artifact `8622642553` — `sha256:bacb0330c7a2201289eeeb7d2b9b9dc832106eec292cd890afc1c5819e1eec7f`;
- live pointer and run-addressed provenance — PASS.

Ledger run `30169981463` failed only when posting to merged PR #286 because the workflow had `pull-requests: read` rather than write. PR #312's manual recovery design is correct: dispatch current trusted code with exact historical deploy run `30169443420`; do not rerun the old workflow definition or rebuild/redeploy Pages.

However the privileged job holds `issues: write` and `pull-requests: write` while executing mutable major tags. The exact old run resolved:

- `actions/checkout@v4` → `11d5960a326750d5838078e36cf38b85af677262`;
- `actions/download-artifact@v4` → `d3f86a106a0bac45b974a628896c90dbdf5c8093`;
- `actions/github-script@v7` → `f28e40c7f34bde8b3046d885e986cb6290c5673b`.

PR #312 should pin full action SHAs with version comments and mutation-test any downgrade to mutable tags before merge. This is the exact privileged surface governed by source issue #301.

---

## 5. Production/source authority remains intentionally split

Current AuditRepo source boundary `be78785b` is correct for this intake. Exact imported deployed Pages/live/TTS authority remains `f5e29998`.

Do not advance production authority to notifier/series/font/deploy-ledger source commits without exact readiness, deployed artifact and live evidence for the same SHA. Whole-release artifact identity and build-once promotion remain source issues #292/#295.

Temporary evidence PR #307 must close without merge after the downstream ledger witness is successfully projected and its report imported.

---

## Required next reconciliation

1. Add open P1 `CI-ALERT-POST-RECOVERY-ORDERING` linked to source #318.
2. Keep broad notifier architecture row closed, but remove any wording that claims all stale-event ordering is complete.
3. Close the series interface row at `be78785b` and ensure #316 is recorded as superseded without merge.
4. Keep font issue open until exact current head passes synthetic contracts, all 28 real fonts, workflow policy and production-like build.
5. Keep production evidence import partially open until PR #312 projects the exact ledger witness and PR #307 closes without merge.
6. Preserve #292/#295 as the whole-release/build-once authority boundary.

## Evidence boundary

This intake is based on exact GitHub source files, PR heads, workflow jobs, downloaded control-plane artifacts and issue state. No product UI/content/runtime file is changed by this report.
