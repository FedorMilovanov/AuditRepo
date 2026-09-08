# Current-head reverify — `FRAGMENTED-SECURITY-OWNERSHIP` canonical successor

## Disposition

`CURRENT / canonical Product successor proven; live transport blocker remains`

This receipt supersedes the earlier `920869a4` / Product #1856 current-head receipt. It does **not** close `FRAGMENTED-SECURITY-OWNERSHIP`; it binds the active owner to the canonical successor Product PR #1917 after #1856 was closed unmerged.

## Current Product anchors

- Reverify date: 2026-09-08
- Product repository: `FedorMilovanov/gb-is-my-strength`
- Current Product `main`: `b5d89b276a3085161be205f22b56f53ddfc8e6f6`
- Canonical Security PR: #1917 — `fix(security): close document and transport ownership on current main`
- Sync transaction: Product #1920
- Exact Security head: `cd6fc71aa97f83afe5bdbdc0bb563f150a9e79fa`
- PR merge ref observed by Actions: `51ffc1cd9be652889f5559423b870286f7807c9d`
- Current compare: `ahead=2`, `behind=0`, merge base = exact current Product main
- Net diff: exactly five Security-owned paths
- Reviews: 0
- Review threads: 0

## Scope

1. `.github/workflows/security-ownership-contract.yml`
2. `scripts/astro-cache-bust-postbuild.js`
3. `scripts/security-document-policy.js`
4. `scripts/security-ownership-contract.mjs`
5. `scripts/security-transport-policy.js`

The intervening Product #1899 movement touched pastor-series research/MDX only and did not collide with these five owners.

## Fresh exact-head Security proof

Security Ownership Contract:

- run: `34252612680`
- job: `102150464647`
- exact source head: `cd6fc71aa97f83afe5bdbdc0bb563f150a9e79fa`

Repository/document side:

- syntax and source ownership contract: **SUCCESS**;
- production-like build: **SUCCESS**;
- Astro check: 573 files, 0 errors, 0 warnings, 8 hints;
- 89 HTML files scanned;
- 88 governed HTML files canonical-CSP verified;
- 67 obsolete transport meta pragmas removed;
- Metadata v3 remains `56 approved / 0 blocked` with HTML/Search/Sitemap/RSS projection complete.

The job then fails only at the live transport assertion:

```text
AssertionError [ERR_ASSERTION]: /: live x-content-type-options header drift

'' !== 'nosniff'
```

Observed live value on `https://gospod-bog.ru/`: empty/missing.
Required value: `nosniff`.

No document-CSP assertion fails before the transport check.

## Evidence artifact

- artifact id: `10066681780`
- name: `security-ownership-34252612680-1`
- digest: `sha256:6465fc53d523d149eff36244d97f7eae1fcb15909e929c5b765ce972dfd57ef5`

The artifact was uploaded successfully after the live failure, preserving the measured blocker.

## Canonical lineage correction

Product #1856 is historical and closed unmerged. Its five-file implementation evidence remains useful, but it is **not** the active admission lane. Product #1917 is the only canonical current owner and is Draft by design until the live transport layer is repaired.

The previous AuditRepo receipt ending in `920869a4.md` is therefore historical/superseded for current-head identity, not invalidated as evidence of the same transport defect.

## External control boundary

Current production deployment is direct GitHub Pages via the repository Pages workflow and custom domain `gospod-bog.ru`. The repository repair cannot cause GitHub Pages to emit arbitrary response headers, and `X-Content-Type-Options` cannot be emulated by HTML metadata.

The available GitHub integration exposes source, PR, Actions and read-only protection/ruleset surfaces, but no administration write for Pages response headers or branch protection. No connected production CDN/proxy control has been established for this domain. A hosting migration or DNS/proxy insertion is outside this bounded Product repair unless a real provider control plane is explicitly available.

## Closure boundary

Keep `FRAGMENTED-SECURITY-OWNERSHIP` active until all are true:

1. a real transport owner emits `X-Content-Type-Options: nosniff` on `https://gospod-bog.ru/`;
2. fresh exact-head Security Ownership Contract succeeds including the live assertion;
3. all applicable exact-head Product workflows are terminal green;
4. #1917 is synchronized to then-current Product `main` with `behind=0` and the five-file scope remains collision-clean;
5. reviews and threads remain zero;
6. #1917 is merged with expected-head/CAS;
7. AuditRepo performs a separate Security closure reconciliation.

## MASTER consequence

None. Security remains one active SYSTEM lane. `SYS-MAIN-ADMISSION-ENFORCEMENT` remains a separate active Owner decision.