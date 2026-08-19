# Verification Wave Synthesis — Wave 2: gb-is-my-strength

## Meta

- Date: 2026-07-17
- Verifier: Arena Agent (Bug Verifier mode)
- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Wave purpose: Expand audit to Data (Genealogy), UI (Header/Reader), and Security (CSP).
- Selected current-check anchor(s): 485db8c25287fa9bd2f53a5356885f02e4b81f4b
- Scope: genealogy.json, Header.astro, BiografiiPageChrome.astro, HomePageHead.astro, ArticleLayout.astro, app/index.astro
- Signal classes represented: Product, Security, Technical-Debt

---

## Inputs reviewed

| Agent/report | Audited anchor | Scope | Evidence angles | Findings/claims |
|---|---|---|---|---|
| Arena Agent Pass 6 | 485db8c | Data, UI, Security, SEO | verified-source | 7 claims (7 FAIL) |

---

## Executive result

| Input count | Current local | Systemic roots | Duplicate symptoms | Stale | Invalid/audit drift | Parked/risk accepted | Owner decisions |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 7 | 7 | 2 | 0 | 0 | 0 | 0 | 0 |

### What changed in our understanding

1.  **Data Integrity**: Found a literal space in a data ID (` lud_shem`), which is a major P1 risk for any automated processing of the genealogy tree.
2.  **UI Redundancy**: Confirmed that the "Search Injection" logic in `ReaderPreferencesHead` conflicts with static search buttons in `Header.astro`, causing double icons.
3.  **Security Posture**: Identified that CSP is applied inconsistently (missing on articles) and with slight domain variations between routes.
4.  **Temporal Integrity**: Discovered post-dated metadata (claiming future publication) in the app landing page.

---

## 1. Current local findings

| Finding | Signal class | Proof state | Evidence angles | Current-check anchor | Claim boundary | Suggested lane | Minimum closure proof |
|---|---|---|---|---|---|---|---|
| `GENEALOGY-ID-INVALID-SPACE` | Product | **FAIL** | source | 485db8c | HEAD | Data | No leading spaces in JSON IDs |
| `UI-DUPLICATE-SEARCH-BUTTONS` | Product | **FAIL** | source | 485db8c | HEAD | UI | Single search icon per container |
| `METADATA-FUTURE-DATED` | Product | **FAIL** | source | 485db8c | HEAD | SEO/Meta | Realistic publication dates |
| `SECURITY-CSP-GAPS` | Security | **FAIL** | source | 485db8c | HEAD | Security | CSP on all routes (inc. articles) |
| `SECURITY-CSP-INCONSISTENCY` | Security | **FAIL** | source | 485db8c | HEAD | Security | Unified CSP domain list |
| `EDITORIAL-LABEL-INCONSISTENCY`| Product | **FAIL** | source | 485db8c | HEAD | Editorial | Matches site.ts labels |

---

## 2. Systemic root causes

### System root `FRAGMENTED-SECURITY-OWNERSHIP`

- Symptoms: CSP defined in multiple head components with different domain lists; missing CSP on specific layouts.
- Why local patches are insufficient: Adding CSP to articles will fix the gap, but the domain lists will drift again.
- Proposed fix: Centralize CSP generation logic into a single `SecurityHead` or `BaseLayout` component.

### System root `HYBRID-UI-INJECTION-CONFLICT`

- Symptoms: Double search buttons in mobile controls.
- Mechanism: Static Astro components and dynamic JS injection logic both target the same DOM container without a shared lock or consistent check mechanism.
- Proposed fix: Standardize on either static Astro rendering for all nav controls or a strictly dynamic registry.

---

## 3. Highest-value next actions

1.  **Sanitize `genealogy.json`**: Remove leading space from ` lud_shem`.
2.  **Centralize CSP**: Move security headers to `BaseLayout.astro`.
3.  **Deduplicate Search**: Refactor `ReaderPreferencesHead.astro` to avoid injecting duplicate buttons.
4.  **Sync Labels**: Update `Header.astro` to use `SECTION_META` labels.
