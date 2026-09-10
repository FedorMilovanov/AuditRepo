# TLP-SEARCH-001 — pre-merge witness

Date: 2026-09-10
Audit issue: #430
Product issue: FedorMilovanov/TheLegendaryPoet#484
Product PR: FedorMilovanov/TheLegendaryPoet#485

## Product candidate identity

- protected Product base observed at PR creation: `2f238ed68419bad849841479408d243142f6ddc5`
- candidate branch: `repair/tlp-search-484`
- candidate exact head: `9fa678073c139a152f127e55f43902021b88d9c1`
- candidate diff at staging time: 6 files, `behind=0`
- independent analytics branch `repair/tlp-analytics-route-477` is not merged, rebased, cherry-picked, deleted, or modified by this transaction

## Candidate repair scope

The Product candidate derives command-search records from canonical poet/poem data, generated essay metadata, and canonical music data; adds exact poem anchors of the form `/poets/{poetId}#poem-{poemId}`; centralizes Russian matching with `ё == е` while preserving `й != и`; adds a mutation-style source-derived inventory validator to CI; and extends the already-required deep-route browser suite.

The Product candidate does not modify the analytics-owned `src/App.tsx`, `src/components/AnalyticsConsent.tsx`, `src/utils/analytics.ts`, `.github/workflows/manual-browser-qa.yml`, `.github/workflows/project-contracts.yml`, or analytics proof files.

## Non-closure boundary

This file is only a staging witness. At the time it was written, Product exact-head workflows had been started and at least one was not yet terminal. Running, queued, skipped-when-substantive, stale-head, or failed checks are not closure evidence.

Before terminal Product closure, this Audit branch MUST NOT modify:

- `projects/the-legendary-poet/verified/MASTER_BUG_MATRIX.md`
- `projects/the-legendary-poet/verified/CLOSURE_LEDGER.md`

`TLP-SEARCH-001` remains active in the authoritative matrix until all of the following are true on one exact Product head: required workflows terminal-success, Product `main` current with candidate `behind=0`, bounded diff, reviews and unresolved threads clear, CAS squash succeeds with the expected head SHA, the resulting Product tree equals the certified candidate tree, and Product issue #484 is completed.

Only after those conditions are proved may this Audit lane add a terminal reverify, remove exactly the Search root, update authoritative counts, append exactly one ledger closure block, run fresh exact-head Audit `validate` + `preflight`, and CAS merge.
