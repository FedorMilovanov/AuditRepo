# Evidence — production-build / artifact verification

bugverifikator · 2026-08-19 · gb-is-my-strength · production-like artifact witness

## Context and limitation

No local Astro build was possible in this agent's sandbox (no node/npm/pnpm/yarn available). Therefore "production build verification" here = inspecting the **committed production-like route artifacts** in the Product repo at `cb3681e` (the legacy/strangler HTML committed under top-level route folders, produced by the project's `strangler:build:production-like` flow) and cross-checking them against the source and live witnesses already recorded. This is an **artifact witness (W3)** on top of the existing source (W2) and live (W4) witnesses; it does not replace a fresh CI build.

## Artifacts inspected at cb3681e

- `articles/dzhon-gill-chast-3-nasledie/index.html` (141,477 B) — `gbs2` engine present, CSP present, next-card present
- `articles/dzhon-gill-chast-4-ekzeget/index.html` (77,058 B) — `gbs2` engine present, CSP present, next-card present
- `rodosloviye/index.html` (8,820 B) — `gbs2` engine present, CSP present
- `articles/20-antisovetov-pastoru/index.html` (246,610 B) — antisovetov article artifact

## Verified `verified-artifact` confirmations

### SERIES-ORDER-INDEX-MISMATCH — confirmed in artifact (matches live + source)

- `chast-3` artifact next-cards: `../dzhon-gill-chast-4-ekzeget/`, `../dzhon-gill-spravochnik/`
- `chast-4` artifact next-cards: `../dzhon-gill-chast-2-uchenyi/` (prev), `../dzhon-gill-chast-3-nasledie/` (next)
- Roman marks in artifacts: **chast-3 artifact renders "Часть IV"; chast-4 artifact renders "Часть III"** — the part-number inversion ships into the production artifact.
- → Three independent angles now agree (source `gillSeriesData.ts` GILL_SERIES_ITEMS order/numerals + live HTTP nav cards + committed artifact). Root confirmed at `gillSeriesData.ts`, not the dead `site.ts` `SERIES_ORDER`.

### RODOSLOVIYE-OG-IMAGE — confirmed in artifact (matches live + source)

- `rodosloviye` artifact: `og:image = https://gospod-bog.ru/images/og-karty-1200x630.webp`, `twitter:image = https://gospod-bog.ru/images/og-karty-1200x630.webp` (alt context = родословие).
- → Three angles agree (source RodosloviyePageHead L28/L38 + live HTTP + committed artifact).

### UI-DUPLICATE-SEARCH-BUTTONS — stale confirmed in artifact

- `antisovetov` artifact: search button ids `[]`; `gb-nav-search-icon` elements: **0**. `gill part4` artifact: search button ids `[]`; `gb-nav-search-icon` count: **0**.
- → No duplicate search icon in the production artifact; corroborates the disjoint-route-sets source census and the live rework. `stale` disposition is safe to apply (removing from MASTER would not drop a live defect).

### ARTICLE-LAYOUT-SERIES-HARDCODE — invalid confirmed in artifact

- `antisovetov` artifact: no `Серия «genesis-6»` / `Серия «pastor-series»` raw-key leak (regex false). The `ArticleLayout.seriesNames` symptom is not rendered.
- → Corroborates the orphaned-carrier source census. `invalid` (dead-code carrier) disposition is safe to apply.

### antisovetov title-suffix (D-19) — still present in artifact (collision-relevant, not a MASTER row)

- `antisovetov` artifact `<title>`: `20 антисоветов пастору: как разрушить служение | Господь Бог` (short form, not `| Господь Бог — Сила Моя`).
- → Symptom still ships; the existing owner lane `agent/antisovetov-title-suffix-20260818` (60ed203) is the correct repair owner. No competing lane.

## Source-vs-artifact CSP divergence (audit-drift, reinforced)

All four inspected artifacts contain a `Content-Security-Policy` meta tag — including `rodosloviye/index.html` and the gill articles — even though the cb3681e *source* for `/rodosloviye/` (`RodosloviyePageHead.astro`) and `/app/` (`app/index.astro` + `ReaderPreferencesHead.astro`) contains no CSP. This reinforces the §0b note in REPORT.md: the committed production artifact (and the live deployment) is ahead of / built differently from the inspected `main` cb3681e source for CSP on these surfaces. Implication for `SECURITY-CSP-GAPS`: the source-confirmed BaseLayout gap (`/hard-texts/genesis-6/`, `/izbrannoe/`) stands, but claiming `/app/`/`/rodosloviye/` as live CSP gaps would be `audit-drift` — they are CSP-less in source yet CSP-present in artifact and live.

## Verification sufficiency note

The artifact angle raises the kept defects (SERIES-ORDER, RODOSLOVIYE-OG) to **three independent angles** (source + live + artifact) — well above the P2 bar and proportionate even for the medium-impact SERIES-ORDER. The stale/invalid dispositions (UI-DUP, ARTICLE-LAYOUT) are now backed by source-usage census + artifact absence + live rework, so dropping them from MASTER is not a risk of removing a live defect. No fresh CI build was run; a true `astro:build` green run remains the owner's closure witness for any repair lane.

## Labels

`verified-artifact`, `verified-source`, `verified-live`, `audit-drift` (source-vs-artifact CSP), `stale` (UI-DUP), `invalid` (ARTICLE-LAYOUT carrier), `current-confirmed-for-work` (SERIES-ORDER, RODOSLOVIYE-OG)
