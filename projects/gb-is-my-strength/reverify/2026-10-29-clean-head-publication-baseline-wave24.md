# Clean-head publication baseline — broad wave 24

**Date:** 2026-10-29  
**Product anchor:** `54877be73a590b1e29f4d701724b39ed41c17e14` (`HEAD == main == origin/main`)  
**Tree before gates:** clean  
**Product mutation:** none

## Environment

- Node `v22.22.3`
- npm `10.9.8`
- dependency install: `npm ci --ignore-scripts`, 490 packages

## Exact gates

| Gate | Result |
|---|---|
| `npm run validate:static-publication:light` | **PASS**, exit 0; full `&&` chain completed in 374.5 s |
| `node scripts/document-authority-audit.mjs` | **PASS**; 31 managed documents, one operational root |
| `npm run control-plane:audit` | **PASS**; 77 workflows, 158 npm scripts, 1,800 local references, 18 required governance documents, seven privileged jobs |
| `npm run engine:contracts` | **PASS**; shared reader/relation/Atlas contracts, 45 series facade consumers and guide presence |
| `npm audit --json` | **RED as known pre-existing security lifecycle evidence**; exit 1, one direct moderate `astro` record carrying `GHSA-98hj-9722-w3j8` (moderate) and `GHSA-mpr7-6m5w-76rw` (low) |

The static publication chain included source validation, SEO, owner UI, route-family visual parity, map/page ownership, CSS/tokens, `audit-pro`, content parity, source hygiene, article QA, readable/editorial lint, Gill data/claim consistency, baseline/MDX structure, metadata strictness, article-MDX audits and service-worker dist readiness. Green generic publication remains a control, not proof that the known semantic/editorial/system matrix rows are closed.

## Interpretation

1. The audit began from a healthy publication/control-plane baseline; documentation and authoring findings are not artifacts of a generally broken build.
2. The document-authority validator proving registry/lifecycle consistency does not contradict the newly admitted semantic precedence conflict: it has no cross-document order-equivalence fixture.
3. The engine gate proving guide presence and facade isolation does not prove an atomic author transaction; controlled orphan/config-only probes and PR #2217 demonstrate the uncovered boundary.
4. The `npm audit` red is already owned by `SYS-DEPENDENCY-ADVISORY-LIFECYCLE`; no duplicate row or dependency mutation is warranted.

## Adjacent live owner refresh

Product draft PR #2217 remained at `ffdd9b2…`, open and `UNSTABLE`: 33 checks successful, four intentionally skipped and three pending (`Build and audit production-like candidate`, `interactive-audit`, WebKit public-surface touch/scroll). No failure was present at this observation, but pending checks prevent a final-head conclusion.

**Broad wave 24 complete.**
