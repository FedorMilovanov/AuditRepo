# Intake — gb-is-my-strength — arena-dx-ux-audit — 2026-10-06

## Identity

- Project: gb-is-my-strength
- Agent: arena-dx-ux-audit
- Date: 2026-10-06
- Audited branch/ref: `main`
- Audited anchor (SHA / artifact / live snapshot): `350848145ee252a4e6ad8b86c9c8e831e2b4cb12`
  (main, 2026-10-05T21:18:50Z — merge of PR #2170 "Lawson theme rhetoric final").
  Browser evidence was taken on the production-like local build of this exact SHA
  (`npm run strangler:build:production-like` + `npm run pagefind:build:dist`) served over
  `http://127.0.0.1:8080`. No live-host bytes were retrievable (`curl https://gospod-bog.ru/` → exit 35 / code 000),
  so no live claim is made anywhere in this folder.
- Environment: Debian-class sandbox, 2 cores / 3 GB / 20 GB free; node v22.22.3; npm 10.9.8;
  sandbox-local Chromium 153.0.8010.0 (patched NSS, see `evidence/2026-10-06-environment-and-toolchain.txt`);
  axe-core + Playwright 1.62/1.63.
- Build mode: production-like dist (local HTTP server) plus source checkout and GitHub CI/API reads.
- Browser / device if used: Chromium 153 headless at 1440×900, 390×844, 768 and a 19-viewport matrix;
  light and `colorScheme: dark`; `isMobile`/touch contexts for the search and header contracts.

## Scope

- Routes checked: `/`, `/articles/`, `/articles/kod-da-vinchi/`, `/articles/steven-lawson-samoobman-i-publichnyy-golos/`,
  `/articles/dzhon-gill-chast-2-uchenyi/`, `/articles/20-antisovetov-pastoru/`, `/nagornaya/chast-1/`, `/karty/`,
  `/karty/avraam/`, `/map/`, `/hard-texts/`, `10 × /baptisty-rossii/*`, plus the 19-viewport matrix set.
- Owners/files checked: `src/pages/articles/**`, `src/components/article-pilots/**`, `src/components/HermenevtikaMobileBar.astro`,
  `data/route-profiles/**`, `data/route-search-policy.json`, `data/search-manifest.json`, `migration/page-ownership.json`,
  `scripts/*normalizer*`, `scripts/audit-pro.js`, the four browser contracts, `package.json`, `.github/workflows/**` (read-only),
  `docs/refactor-2026/CONTENT_MODEL_AND_AUTHORING_2026.md`, `docs/ARTICLE-STANDARD-CHARTER.md`.
- Systems checked: content pipeline / article engine, discovery surfaces (route policy, search manifest, sitemap, RSS,
  Pagefind), reader chrome (rail, TOC, mobile bar, theme, skip links), search modal, quiz engine, maps, CI/CD release path.
- Explicit exclusions: TTS voices, Pagefind facet behaviour, Lighthouse runs, `/hard-texts/*` reading experience,
  `/biografii/*`, `/konfessii/*`, 404 page. WebKit: **no engine available in this sandbox** — see NOT VERIFIED in REPORT.md.
  Everything in `src/components/article-pilots/**` except the two routes named above was not read line-by-line.
- Product repo was never modified persistently: every probe edit was reverted (`git status --porcelain` → 0 lines).

## Files in this folder

- `REPORT.md` — observations, evidence, root-cause clusters and recommendations;
- `comments/` — comments on other findings;
- `proposals/` — optional classification/priority/root-cause proposals;
- `evidence/` — logs, screenshots and command output;
- `artifacts/` — traces, patches and machine-readable output;
- `commands.log` — commands used during the pass.

## Evidence rule

The anchor records what this pass actually inspected. It may be a Git SHA, an
artifact identity or a concrete live snapshot URL. Do not update this intake
merely because the source repository later moved.

## Allowed intake language

Use `raw`, `candidate`, `reproduced-by-agent` and explicit evidence labels such as
`verified-source`, `verified-build`, `verified-browser` or `verified-live`.

Durable classifications belong to a verifier synthesis or accepted ledger decision.

## Operating model

See [`AUDITREPO_OPERATING_MODEL.md`](../../../../../AUDITREPO_OPERATING_MODEL.md).
