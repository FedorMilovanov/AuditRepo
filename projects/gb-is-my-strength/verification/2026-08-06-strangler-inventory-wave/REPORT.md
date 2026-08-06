# Verification Wave — strangler duplicate inventory and parity authority

**Date:** 2026-08-06  
**Theme:** `ST-STRANGLER` / historical `R-007`, `STRANGLER-HYGIENE`  
**Evidence status:** `verified-at-anchor`  
**Product evidence anchor:** exact head `e15afda5681ce4e2f0a713e6e7f0ca2afbb0efae`, merged by Product PR #1082 as `76737eefe16a0feb2fdf729c805d17b5cdcdc376`

## Question

Which committed public `index.html` files are true legacy/native shadows, which belong to intentional independent applications, and which are currently safe to retire without weakening evidence?

## Evidence angles

### Source ownership

Product PR #1082 added `scripts/strangler-duplicate-inventory.mjs`. The script derives route classification only from canonical `migration/page-ownership.json`; it does not create a second ownership registry.

It records route, repository path, bytes, SHA-256, exact/containing owner and status. Counts are advisory. A self-test covers:

- Astro `native-shadow`;
- explicit built-app ownership;
- a descendant of an independent built app;
- an unowned public index.

### Exact repository inventory

On exact Product head `e15afda5681ce4e2f0a713e6e7f0ca2afbb0efae`:

- public `index.html`: **52**;
- Astro-owned `native-shadow`: **51 files / 4,026,027 bytes**;
- explicit `owned-independent`: **1 file / 2,245,854 bytes**;
- unowned public indexes: **0**.

The independent file is the Baptists 3D application:

- route `/konfessii/russkij-baptizm/_app/`;
- path `konfessii/russkij-baptizm/_app/index.html`;
- owner `built-app`;
- status `copy-as-built-asset`;
- SHA-256 `d2aa17b168b7c10e08497097bc6dc4d4a06866b5077fb05112bdde2b37ab74bd`.

It is not a legacy/native duplicate and must not be removed as strangler cleanup.

### Lifecycle and parity ownership

Current Product `scripts/legacy-shadow-wrapper-audit.js` dynamically discovers every production-dist Astro route that still has a committed legacy `index.html`. Each discovered shadow is actively used to verify:

- canonical URL;
- title, description and H1 presence;
- noindex disposition parity;
- route-specific structural markers;
- a lower bound on retained reader text.

Therefore the 51 Astro shadows are not merely dead copies. They are current evidence inputs for the migration/parity harness.

### CI witness

Exact Product head passed:

- Shared Files Guard run `31064874211`;
- Node Toolchain Contract run `31064874215`;
- Metadata & IndexNow Readiness run `31064874238`.

Artifact `8953474789`, digest `sha256:721c63f3cc545a749c6ce8659a467a346e18342bafcdc9436232daeb9b7163d0`, contains the JSON and Markdown inventory.

## Classification result

- **Systemic root:** legacy content and parity evidence currently share the same committed HTML owner.
- **Independent surface:** the 2.25 MB Baptists 3D app is explicitly built-app-owned, not cleanup debt.
- **Current deletion-ready shadows:** **0**.
- **Historical approximate count:** the former `50/53` description is superseded by this anchor-specific exact inventory of `51/52`.
- **No Product defect closure is claimed:** storage and maintenance duplication remain real, but direct deletion would reduce verification coverage.

## Better-than-local outcome

A useful retirement wave must separate parity authority from the file being retired:

1. choose one small route or tightly related family;
2. identify every current consumer of its legacy shadow;
3. move required canonical/noindex/structure/text evidence to a named immutable replacement;
4. prove equivalent source and production-like dist behavior;
5. add an applicable browser witness when user-visible structure is involved;
6. only then delete the legacy file and rerun the inventory.

Do not weaken `legacy-shadow-wrapper-audit.js`, silently lower text ratios or classify the built app as a duplicate merely to reduce counts.

## Disposition

- `ST-STRANGLER`: `candidate` → `evidence-rich`; reverify one selected route/family before retirement work.
- Historical `R-007`: measured inventory implemented; retirement remains open.
- Historical `STRANGLER-HYGIENE`: narrowed; maintenance/storage debt remains, but all current shadows have an active evidence role.
- Live evidence: not required and not claimed.
