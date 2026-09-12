# Current-head reverify — security and main owner boundaries — 2026-09-13

## Classification

This receipt refreshes the two pre-existing owner-controlled Product boundaries without changing MASTER arithmetic:

- `FRAGMENTED-SECURITY-OWNERSHIP` — system verification lane;
- `SYS-MAIN-ADMISSION-ENFORCEMENT` — governance owner decision.

Neither is a newly admitted Product page-code defect.

Product current `main` during this reverify:

`81b3cb63013da25cdaa096730b17fbca61023da8`

## 1. FRAGMENTED-SECURITY-OWNERSHIP

### Live transport witness

Read-only HEAD requests were taken from the production origin.

#### `https://gospod-bog.ru/`

- HTTP: **200**
- `X-Content-Type-Options`: **ABSENT**
- transport `Content-Security-Policy`: **ABSENT**
- `Strict-Transport-Security`: `max-age=31556952`
- transport `Referrer-Policy`: **ABSENT**

#### `https://gospod-bog.ru/articles/`

- HTTP: **200**
- `X-Content-Type-Options`: **ABSENT**

#### `https://gospod-bog.ru/baptisty-rossii/noch-na-kure/`

- HTTP: **200**
- `X-Content-Type-Options`: **ABSENT**

### Disposition

The existing root remains current.

Repository/page-head CSP/meta work cannot emit a transport response header. Therefore no repository-only repair should be accepted as closure for the `nosniff` boundary.

Closure still requires:

1. a real transport response-header owner;
2. live `X-Content-Type-Options: nosniff`;
3. exact-head Security contract success;
4. current-main synchronization and CAS merge with zero review debt.

Product tracking issue: `#1928`.

Fresh current-head evidence was added to the tracking issue as comment `5648893005`.

No competing security Product lane was created by this reverify.

## 2. SYS-MAIN-ADMISSION-ENFORCEMENT

### GitHub server-side witness

Current branch API for Product `main@81b3cb63013da25cdaa096730b17fbca61023da8` reports:

- `protected=false`
- protection `enabled=false`
- required-status-check enforcement: `off`
- required contexts: `[]`
- required checks: `[]`

Repository CI and repair-lane process continue to use exact-head checks and expected-head/CAS merges, but that workflow discipline is not server-side admission enforcement.

### Disposition

The owner decision remains current.

Closure requires one of:

1. enable native GitHub branch protection/ruleset for Product `main`, deliberately choosing always-created required PR checks and an explicit admin/emergency bypass policy, then re-read the live settings; or
2. explicitly document owner acceptance of unprotected-main/post-push-red risk.

Product tracking issue: `#1927`.

Fresh current-head evidence was added as comment `5648892669`.

No repository-code workaround is counted as closure.

## MASTER consequence

No arithmetic change:

- direct current defects: 0
- verified necessary improvements: 0
- narrowed residuals: 0
- system verification lanes: 1
- owner decisions: 2
- **active work units: 3**

The third active owner is the separately refreshed `GBS-SEARCH-CONTROL-PLANE-001`, whose remaining boundary is authenticated Google Search Console/DNS ownership action rather than Product code.

## Negative boundary

This receipt intentionally does not:

- modify security Product code;
- enable/disable GitHub branch protection;
- alter repository rulesets;
- infer closure from HTML meta;
- infer admission enforcement from CI workflow presence alone.

It is a current-state reverify only.
