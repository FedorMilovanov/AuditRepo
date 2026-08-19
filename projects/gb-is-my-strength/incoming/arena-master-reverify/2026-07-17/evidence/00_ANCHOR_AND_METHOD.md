# Evidence 00 — anchors, method, and collision check

## Exact anchor

| Fact | Recorded value |
|---|---|
| Product repository | `FedorMilovanov/gb-is-my-strength` |
| Selected branch | `main` |
| Selected SHA | `cb3681e1a85b5f8919c9dc537f812a842bbe9235` |
| Parent SHA | `dfbb89eca6b2a31462731488aa8ee18400c5ef04` |
| Product API commit title | `feat(app): premium Bible App integration across site (#1725)` |
| Changed files reported by commit API | `src/components/article-pilots/genesis6/Genesis6BibleAppChapterCta.astro`; `src/pages/app/index.astro`; `src/pages/index.astro` |
| Remote commit timestamp | 2026-08-19T00:30:04Z (recorded only as remote metadata; it conflicts with this auditor platform date of 2026-07-17) |

The source tree used for inspection was downloaded from the GitHub zipball endpoint for the exact SHA, rather than from a mutable branch archive.

## Product collision check

The Product pull-request endpoint reported two open PRs:

| PR | Head | Scope title | Overlap with selected MASTER owners |
|---|---|---|---|
| `#1721` | `repair/dist-css-astro-admission-20260819` / `d4264572…` | admit Astro CSS in dist-parity guard | no selected Rodosloviye/Gill/genealogy/metadata/security/mobile file overlap observed |
| `#1722` | `repair/wire-engine-contracts-20260819` / `475a8f21…` | aggregate engine contracts in PR guard | no selected product-owner overlap observed |

No Product file was changed by this audit.

## Supporting release signal

`GET /repos/FedorMilovanov/gb-is-my-strength/commits/cb3681e…/check-runs` returned 30 check runs. Each conclusion was `success`, `skipped`, or `neutral`; no run had another conclusion. Relevant successful names included:

- `Build and validate immutable release candidate`;
- `Resolve exact successful Pages deployment`;
- `Runtime Interactive Audit`;
- `Home Chromium WebKit contract`;
- `Deterministic source index and dist witness`;
- `native-source-contract`.

This is supporting release identity evidence only. It does not independently establish or clear any finding in the report.

## Evidence methods and limitations

| Witness | Method | What it proves | What it does not prove |
|---|---|---|---|
| W2 source | exact-SHA static source/data scan | current owner paths, literal values, render graph, absence/presence of a source mechanism | emitted output or interactive behavior by itself |
| W3 artifact | checked top-level committed HTML route artifacts | a repository-carried production-like output contains a value | that GitHub Pages currently serves the same bytes |
| W4 live | HTTPS GET plus HTML/meta/anchor parsing | currently returned document status and emitted markup | browser layout, client execution, caches, authenticated or Telegram flow |
| W5 root cause | ownership and duplicate-policy inventory | whether a shared mechanism can cause repeated drift | exploitability or user impact without a targeted test |

No local Node/npm/Astro build or browser fault-injection run was possible in this sandbox.
