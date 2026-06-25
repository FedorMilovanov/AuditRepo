# New finding / confirmation: karty holding routes have matrix contract drift

## Meta
- Agent: `arena-agent-independent-2`
- Date: 2026-06-25
- Source HEAD: `03e01a0008de34d654175ea600cdf9f22b2351b4`
- Evidence: `evidence/karty-holding-matrix-03e01a0.txt`
- Method: source matrix + component contract + production-like dist markers

## AAI2-NEW-5 — `route-migration-matrix.json` marks temporary karty holding pages as strict native apps with `data-pagefind-body`

- Severity: P2 tooling/governance drift
- File: `migration/route-migration-matrix.json`
- Affected routes:
  - `/karty/early-church/`
  - `/karty/maccabim/`
  - `/karty/melachim/`
  - `/karty/pavel/`
  - `/karty/revelation/`
  - `/karty/shoftim/`
  - `/karty/shvatim/`
  - `/karty/yeshua/`

## Evidence

Matrix currently says these routes are `strict-native-app` and require `data-pagefind-body`:

```text
/karty/early-church/ mode=strict-native-app requiredMarkers=['data-pagefind-body']
/karty/maccabim/     mode=strict-native-app requiredMarkers=['data-pagefind-body']
...
```

But the shared component explicitly says the opposite:

```astro
// KartyHoldingPage.astro
// noindex until the map passes visual audit. data-pagefind-ignore — not indexed by search.
<main data-pagefind-ignore data-content-status="temporary-placeholder">
```

Production-like dist confirms the component contract:

```text
early-church    sourceProp=1 dist_pagefind_body=0 dist_pagefind_ignore=1 robots_noindex=1
maccabim        sourceProp=1 dist_pagefind_body=0 dist_pagefind_ignore=1 robots_noindex=1
melachim        sourceProp=1 dist_pagefind_body=0 dist_pagefind_ignore=1 robots_noindex=1
pavel           sourceProp=1 dist_pagefind_body=0 dist_pagefind_ignore=1 robots_noindex=1
revelation      sourceProp=1 dist_pagefind_body=0 dist_pagefind_ignore=1 robots_noindex=1
shoftim         sourceProp=1 dist_pagefind_body=0 dist_pagefind_ignore=1 robots_noindex=1
shvatim         sourceProp=1 dist_pagefind_body=0 dist_pagefind_ignore=1 robots_noindex=1
yeshua          sourceProp=1 dist_pagefind_body=0 dist_pagefind_ignore=1 robots_noindex=1
```

The `sourceProp=1` column means the page files pass a dead Astro prop named `data-pagefind-body="true"` into `KartyHoldingPage`, but the component Props interface does not define it and the rendered HTML ignores it.

## Impact

Current production behavior is correct for temporary holding pages: noindex + `data-pagefind-ignore`. The bug is governance/tooling drift:

- the matrix describes holding placeholders as searchable strict-native apps;
- future audits that enforce `requiredMarkers` strictly will either fail falsely or pressure agents to add `data-pagefind-body` to noindex placeholders;
- page files contain dead `data-pagefind-body="true"` props that imply the wrong indexing contract.

The current `migration:metadata:check` passes because it does not enforce this marker mismatch strongly enough.

## Recommended fix

- Change matrix mode to a holding/noindex-specific mode such as `strict-native-holding-page`.
- Replace `requiredMarkers: ["data-pagefind-body"]` with markers appropriate for holding routes, e.g. `data-pagefind-ignore`, `temporary-placeholder`, and `noindex`.
- Remove dead `data-pagefind-body="true"` props from `src/pages/karty/*/index.astro` holding routes.
- Optionally extend `check-route-migration-matrix.js` to detect contradictions between holding/noindex routes and `data-pagefind-body` requirements.

## Recommended canonical status

`confirmed-current-source-and-dist`, P2 tooling/governance drift. It is not a production SEO bug because dist currently noindexes and ignores these pages correctly.
