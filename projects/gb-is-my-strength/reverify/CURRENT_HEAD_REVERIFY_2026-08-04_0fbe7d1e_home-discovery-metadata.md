# CURRENT HEAD REVERIFY — Home discovery metadata parity

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical findings: `AR-IDX-01`, `AR-IDX-02`
- Current Product anchor: `0fbe7d1ead9ebd1bea867418e254da438ec63329`
- AuditRepo base: `1d8fb7f2e00d76010afab5d5e808bfa4cf687958`
- AuditRepo closure lane: PR #137
- Current production claim: **none**

## Original claims

- `AR-IDX-01`: the Astro homepage omitted the Russian and `x-default` hreflang alternates retained by the legacy discovery source of truth.
- `AR-IDX-02`: the Astro WebSite JSON-LD omitted the legacy `SearchAction`, preventing the canonical homepage query contract from being represented.

## Disposition

### `AR-IDX-01` — fixed-current

### `AR-IDX-02` — fixed-current

Product PR #675 repaired both bounded defects in exactly two owner files:

- exact PR head `404db8d14087d29522e56f190717d6224e8e3bfb`;
- squash merge `0131f8b9d6c717f85a8990700b72b09b575219a4`;
- restored `<link rel="alternate" hreflang="ru">` and `hreflang="x-default"`, both targeting `https://gospod-bog.ru/`;
- restored WebSite `potentialAction` with `@type: SearchAction`;
- restored the canonical `https://gospod-bog.ru/?q={search_term_string}` EntryPoint;
- restored `query-input: required name=search_term_string`;
- extended the production-like Home audit with parsed hreflang assertions and exact SearchAction assertions.

The exact PR head passed nine triggered workflows:

- Visual Parity Guard run `30679376588`;
- Runtime Interactive Audit run `30679376578`;
- Metadata & IndexNow Readiness run `30679376575`;
- Shared Files Guard run `30679376594`;
- Glossary Contract run `30679376591`;
- Deploy Candidate Contract run `30679376626`;
- Editorial Dateline Contract run `30679376566`;
- Native Source Contract run `30679376587`;
- Print Paper Contract run `30679376572`.

## Current-head source witness

At current Product anchor `0fbe7d1ead9ebd1bea867418e254da438ec63329`:

- `src/components/home/HomePageHead.astro` contains both required hreflang links with the canonical homepage URL;
- the same file contains the WebSite `SearchAction`, EntryPoint URL template and query-input contract;
- `scripts/astro-home-pilot-audit.js` still parses alternate links and fail-closes unless both `ru` and `x-default` resolve to the canonical homepage;
- the audit still fail-closes unless the built production-like homepage contains the SearchAction type, exact query target and exact query-input string.

Later Home waves changed the component blob but retained the repaired discovery contract and permanent assertions. The two historical claims are therefore not open on current head.

## Evidence boundary

This closure covers only homepage hreflang parity and the WebSite SearchAction contract. It does not claim Google will display a search box, approve unrelated homepage SEO findings, or establish deployment of current Product `main`.

## Canonical arithmetic applied by this transaction

- Canonical IDs: **358**
- Closed: **192 → 194**
- Open: **166 → 164**
- P1: **78 → 76**
- P0: 0
- P2: 34
- P3: 47
- Refactoring: 4
- AuditRepo: 3

The total remains `358 = 194 + 164`.
