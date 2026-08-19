# Agent Audit Report

## Meta

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-bugverifikator` (Arena.ai Agent Mode)
- Date: 2026-08-19
- Audited branch/ref: `main`
- Audited anchor (SHA / artifact / live snapshot): Product `main` `cb3681e1a85b5f8919c9dc537f812a842bbe9235`; committed source tree from GitHub zipball; live HTTP snapshots of `https://gospod-bog.ru` routes listed below (fetched 2026-08-19 UTC)
- Environment: offline source inspection + live GET fetches (no local Astro build executed in this sandbox)
- Build mode: source + live (+ committed HTML artifacts where present, e.g. `rodosloviye/index.html`, Gill article HTML)
- Browser / device if used: N/A (HTTP body inspection only; no engine layout/runtime interaction)
- Scope:
  1. Independent current-check of all 16 MASTER rows anchored at cb3681e
  2. Fresh bug hunt on surfaces touched by #1725 (Bible App), genealogy, Gill series, CSP/SW/theme ownership, hard-texts/Genesis-6 mobile shell
- Explicit exclusions: no Product mutation; no browser automation; no full `npm` build; TheLegendaryPoet and code-audit only orientation-scanned
- Signal class: Product
- Proof state: mixed — see per-finding results (FAIL / PASS / challenge)
- Claim boundary: Product `main` cb3681e + live `gospod-bog.ru` as of 2026-08-19; does not claim future HEAD
- Preservation boundary: raw evidence only under `incoming/arena-bugverifikator/2026-08-19/`; does not edit MASTER in this pass (Concurrent Edit: matrix edits are exceptional; this is intake)
- Semantic owner: per finding below
- Overlapping active owner/PR/branch check: Product PRs currently active `#1721` (`repair/dist-css-astro-admission-20260819`), `#1722` (`repair/wire-engine-contracts-20260819`) — CI/audit harness lanes; **no collision** with content/OG/genealogy/Gill order/CSP-source findings in this report

> The anchor records what this pass actually inspected. Do not update this report merely because the source repository later moved.

---

## Executive summary

```text
MASTER 16 rows @ cb3681e
→ 7 still current defects / residuals (reconfirmed)
→ 1 defect row is intentional product state (SERIES-ORDER) → challenge to retire as defect
→ 1 residual + 1 owner decision closed-by-fix on current HEAD/live (MOBILE-CHROME-*)
→ 1 pending (ARTICLE-AUTHOR) remains pending — live carriers use correct «Автор-редактор» wording; orphan ArticleLayout still has translation hardcode but zero page importers
→ 2 system lanes still valid as ownership debt
→ NEW: GENEALOGY-CHILDREN-UNRESOLVED (59 dangling children refs; integrity banner overclaims)
→ NEW/confirm class: dead-code dual SSOT (SERIES_ORDER + orphan layouts) feeds METADATA-SSOT lane
```

Highest-value next work (opinionated, not a second matrix):

1. Retire/challenge `SERIES-ORDER-INDEX-MISMATCH` as a **defect** (keep at most a low-priority naming/slug hygiene item in Work Queue).
2. Close `MOBILE-CHROME-REGISTRY-GAPS` + `MOBILECHROME-GENESIS6-BAR-DECISION` as closed-by-fix.
3. Admit `GENEALOGY-CHILDREN-UNRESOLVED` (or fold into a genealogy integrity SYS lane with the space-id row).
4. Small pure fixes still greenlit by MASTER: `RODOSLOVIYE-OG-IMAGE`, `EDITORIAL-LABEL-INCONSISTENCY`, `GENEALOGY-ID-INVALID-SPACE`, `MISSING-BUTTON-TYPE`.

---

## 1. New observations

### Observation `GENEALOGY-CHILDREN-UNRESOLVED`

- Title: Genealogy `children[]` lists 59 IDs with no person records; `_status` banner overclaims integrity
- Kind: defect
- Suggested impact: medium (graph incomplete for major biblical persons; UI silently drops links via `byId.has` filters — no crash, but missing nodes/links and false integrity attestation)
- Route(s) / owner(s): `/rodosloviye/`; `data/genealogy/genealogy.json`; `src/components/genealogy/layout.ts` / `GenealogyTree.tsx`
- Observed on anchor: cb3681e source
- Expected: every `children[]` entry either resolves to a `persons[].id` or is explicitly modeled as a non-person stub type; `_status` must not claim «0 orphan references» / full integrity if dangling child IDs remain
- Actual:
  - `persons` count = 156
  - missing child ID count = 59 (58 unique), including high-value names: `ishmael` (parent `abram`), `haran` + `nahor_haran` (parent `terah`), `dinah` (parent `leah`), `joktan` (parent `eber`), `gershom`/`eliezer_moses` (parent `moses`), `nadab`/`abihu`/`ithamar` (parent `aaron`), multiple Jesse sons, full Table-of-Nations stubs under Cush/Mizraim/Canaan/Javan/Aram, etc.
  - `layout.ts` only creates links when parent/child ids exist in the filtered set — missing children never become nodes/links (silent drop)
  - keyboard nav in `GenealogyTree.tsx` also filters with `byId.has(c)`
  - `_status`: `v3-integrity: all parent references fixed, children arrays consistent, deathAM computed. 156 persons, 0 orphan references.` — **parent** orphans are indeed 0; **child** dangling refs are not measured; banner overclaims
- Reproduction or inspection steps:
  1. Load `data/genealogy/genealogy.json`
  2. Build `byId` from `persons[].id`
  3. For each person, for each `children[]` entry, test `id in byId`
  4. Observe 59 misses; confirm `layout.ts` descendant walk / link builder guards
- Evidence type: verified-source
- Evidence:
  - `data/genealogy/genealogy.json` (persons + children arrays)
  - `src/components/genealogy/layout.ts` descendant walk and link construction gated on id membership
  - `src/components/genealogy/GenealogyTree.tsx` ArrowDown handler filters `byId.has(c)`
  - companion file: `EVIDENCE_GENEALOGY-CHILDREN-UNRESOLVED.md`
- Confidence: high
- Limitations of this method: no browser click-through to count visible missing nodes; no claim about product intent to keep Table-of-Nations as name-only stubs
- Possible mechanism: dataset built with aspirational children lists; person records never authored; integrity script checks only parent→existing direction
- Related existing findings: `GENEALOGY-ID-INVALID-SPACE`, `GENEALOGY-NO-ERROR-BOUNDARY`; genealogy integrity class
- Applicability: current Product main source
- What this evidence does **not** prove: that the live UI throws; that every missing ID must become a full person card (owner may accept nation-stubs) — but the **status banner and «children arrays consistent» claim are false as written**

### Observation `GILL-SLUG-DISPLAY-ORDINAL-DRIFT` (Work Queue candidate — not MASTER defect)

- Title: Gill URL slugs `chast-3` / `chast-4` disagree with public roman ordinals III/IV after intentional 2026-07-09 display reorder
- Kind: improvement / hygiene (not a functional defect)
- Suggested impact: low
- Route(s): Gill series URLs + `gillSeriesData.ts`
- Observed: slug `…/chast-4-ekzeget/` publicly titled «Часть III»; slug `…/chast-3-nasledie/` titled «Часть IV»; locked by `scripts/gill-series-data-consistency-audit.js` `expectedOrder = [context,part1,part2,part4,part3,spravochnik]` with explicit comment «display reorder»
- Expected if treated as hygiene: either rename slugs (breaking) or document ordinal↔slug map in one SSOT comment near `GILL_SERIES_ITEMS`
- Actual: product intentionally swapped **display** order/numbering while freezing internal ids/slugs
- Evidence type: verified-source + verified-live
- Confidence: high
- Related: challenges `SERIES-ORDER-INDEX-MISMATCH` below — **do not file as current defect**
- Recommendation: Work Queue / docs only unless owner wants slug migration

### Observation `DEAD-LAYOUT-SSOT-DUAL` (feeds existing system lane)

- Title: `ArticleLayout.astro` / `SeriesArticleLayout.astro` + `SERIES_ORDER` are unreachable from `src/pages/**` but still carry series/author logic and are referenced by consistency scripts
- Kind: system-theme / residual of `METADATA-SSOT-PROLIFERATION` + pending `ARTICLE-AUTHOR-HARDCODED`
- Suggested impact: medium for maintainers (false SSOT, audit confusion); low for end users
- Evidence: full-tree scan — zero `src/pages` importers of either layout; only `scripts/series-reader-facade-regression-test.js` and `scripts/check-data-consistency.js` reference them; live Gill/Heart/Pastor pages use pilot engines (`gill-partN`, `Genesis6ArticlePage`, etc.)
- Recommendation: absorb into `METADATA-SSOT-PROLIFERATION` next check («delete or rewire dead layouts; stop teaching SERIES_ORDER as live Gill owner»)

---

## 2. Confirmations and extensions

### Confirm `RODOSLOVIYE-OG-IMAGE` — still FAIL

- Target: MASTER `RODOSLOVIYE-OG-IMAGE`
- Evidence angles: verified-source + verified-live + verified-artifact
- Source: `src/components/rodosloviye/RodosloviyePageHead.astro` L28 `og:image` → `https://gospod-bog.ru/images/og-karty-1200x630.webp` while L31 `og:image:alt` describes родословие
- Live GET `https://gospod-bog.ru/rodosloviye/`: same `og:image` + alt mismatch; CSP present on live
- Result: same symptom, current on cb3681e + live
- What this changes: nothing — keep MASTER row; trivial fix = dedicated OG asset or correct shared preview with matching alt

### Confirm `EDITORIAL-LABEL-INCONSISTENCY` — still FAIL

- Source: `src/components/ui/Header.astro` L18 `<a href="/hard-texts/">Разбор заблуждений</a>`
- SSOT: `src/data/site.ts` `SECTION_META['hard-texts'].label = 'Трудные тексты'`
- Live: Gill article + `/hard-texts/` + Genesis-6 articles all show **«Разбор заблуждений»** in global nav
- Note: `/hard-texts/` landing itself is the Heart book («Тайны человеческого сердца») per page comment — label conflict is real; eyebrow in SECTION_META still says heart series (related metadata smell, not separate P1)
- Keep MASTER row; natural fix under Header reading `SECTION_META` (METADATA-SSOT lane)

### Confirm `GENEALOGY-ID-INVALID-SPACE` — still FAIL

- `data/genealogy/genealogy.json` L1395 `"id": " lud_shem"` and L403 Shem `children` entry `" lud_shem"` — self-consistent space, still violates id invariant
- Keep row; can ship with children-integrity pass

### Confirm `GENEALOGY-NO-ERROR-BOUNDARY` — still FAIL (source-only)

- `GenealogyTree.tsx`: no `ErrorBoundary` / `componentDidCatch`
- No runtime crash reproduced (method limit)
- Keep as low/medium hardening residual

### Confirm `SECURITY-CSP-INCONSISTENCY` / `SECURITY-CSP-GAPS` / `FRAGMENTED-SECURITY-OWNERSHIP` — still valid system class

- `src/layouts/BaseLayout.astro`: **no** CSP meta in source
- Live `/hard-texts/genesis-6/`, `/izbrannoe/`, `/app/`, `/rodosloviye/`: CSP **present** (postbuild injector)
- Mechanism: `scripts/astro-cache-bust-postbuild.js` `DEFAULT_DIST_CSP` + `hardenCsp()` injects/unifies at dist time
- Source heads still hand-author CSP in many pilots → fragmentation risk pre-inject; BaseLayout routes depend entirely on postbuild
- `'self'` covers same-origin images — no proven live image breakage found this pass
- Keep system lane; gaps row correctly narrowed (source-vs-artifact)

### Confirm `AR-IDX-JS-02-MULTIWRITER` — still FAIL

- Canonical owner: `js/reader-preferences.js` `STORAGE_KEY = 'gb:reader-preferences:v1'` (+ legacy bridge)
- Parallel writers: `js/site.js` `themeKey:"theme"` + `localStorage.setItem('theme', …)` / `SiteUtils.themeKey`
- `js/enhancements.js` writes `SiteUtils.themeKey || "theme"`
- Multi-key theme persistence remains
- Keep residual

### Confirm `MISSING-BUTTON-TYPE` — still FAIL

- ≥38 `<button>` without `type=` in `.astro` sources
- Includes `#themeToggle`, `#hMobileMenuBtn`, `#hScrollTop` across HardTexts/About/Pastor shell; FAQ accordion buttons in Kod da Vinci, etc.
- Keep residual (default `submit` risk inside forms; most are outside forms but invariant is clear)

### Confirm `SW-PWA-FRESHNESS` — still FAIL as necessary improvement

- `sw.js` `CACHE_VERSION = 'gb-v197-bible-legacy-authority-20260804'` (stale label vs #1725 era)
- `isStaticAsset` matches `.js`; non-revisioned static assets use `cacheFirst`
- `canonicalRuntimeRequest` strips query string — revisioned `?v=` URLs collapse to path for some runtime paths
- Precache lists `/js/reader-preferences.js` without requiring bump discipline beyond CACHE_VERSION
- Keep improvement row

### Confirm `SEARCH-LAZY-LOADER-DRIFT` — still plausible residual

- BaseLayout vs pilot heads still use divergent search wiring patterns (not re-deep-dived beyond structural confirmation that BaseLayout remains a separate loader owner from AppSearch/command palette paths)
- Keep as low residual unless a current functional search break is shown (not shown this pass)

### Confirm `METADATA-SSOT-PROLIFERATION` — still valid system lane

- Live label/order/author metadata still split across Header hardcode, `site.ts`, `gillSeriesData.ts`, dead layouts, pilot heads
- Extend next-check note: **delete or quarantine dead ArticleLayout/SeriesArticleLayout** so SERIES_ORDER stops being mistaken for Gill runtime owner

---

## 3. Challenges and negative findings

### Challenge `SERIES-ORDER-INDEX-MISMATCH` → recommended `invalid` as defect / `accepted-product-state`

- Target: MASTER CURRENT DEFECTS `SERIES-ORDER-INDEX-MISMATCH`
- Reason: The «inversion» of Part 3/Part 4 is an **intentional 2026-07-09 display reorder**, not a regression.
- Contradictory evidence angles:
  1. **Source (product lock):** `scripts/gill-series-data-consistency-audit.js` L174–177:
     ```text
     // Reading order (2026-07-09 display reorder): exegete (part4) now displays as
     // «Часть III» and precedes legacy (part3) which displays as «Часть IV».
     // Internal ids/slugs unchanged; only display order/numbering swapped.
     const expectedOrder = ['context','part1','part2','part4','part3','spravochnik'];
     ```
     The audit **fails the build** if order drifts away from part4→part3.
  2. **Source (live engine):** `gillSeriesData.ts` `GILL_SERIES_ITEMS` matches that order; titles/marks are internally consistent (`part4` mark III «Экзегет», `part3` mark IV «Наследие»).
  3. **Live:** `/articles/dzhon-gill-chast-4-ekzeget/` title/H1 «Часть III: Экзегет»; `/articles/dzhon-gill-chast-3-nasledie/` «Часть IV: Наследие»; in-series nav shows Экзегет before Наследие with matching next/prev semantics.
  4. **Dead carrier in older filings:** `site.ts` `SERIES_ORDER['dzhon-gill']` has the same order but is only imported by orphan layouts — not the live engine (agree with 2026-08-19 bugverifikator pass5 comment on dead carrier).
- Recommended result: **remove from MASTER as a defect**. Optional Work Queue item: slug/ordinal documentation or future slug rename (`GILL-SLUG-DISPLAY-ORDINAL-DRIFT`).
- See also: `COMMENT_SERIES-ORDER-INDEX-MISMATCH.md`

### Challenge `MOBILE-CHROME-REGISTRY-GAPS` → recommended `closed-by-fix` / stale residual

- Target: MASTER NARROWED RESIDUALS `MOBILE-CHROME-REGISTRY-GAPS` + OWNER DECISION `MOBILECHROME-GENESIS6-BAR-DECISION`
- Reason: Genesis-6 article pages **already** mount mobile bottom bar via the Gill series shell stack.
- Evidence:
  1. `src/components/article-pilots/genesis6/Genesis6ArticlePage.astro` imports `SeriesReaderChrome` and wraps content with `GENESIS6_SERIES` config
  2. `SeriesReaderChrome.astro` → `GillSeriesChrome` → **`GillSeriesMobileBar`** (static mount)
  3. Live GET 200 on:
     - `/hard-texts/enoh-prorochestvoval-iuda-14-15-4q204/`
     - `/hard-texts/kniga-enoha-kotoroy-ne-bylo-kak-raznye-proizvedeniya-stali-korpusom/`
     - `/hard-texts/mozhno-li-doveryat-1-enohu-kanonicheskiy-audit/`
     Bodies contain `mobile-bottom` / `bottombar` / `data-mobile-chrome` markers
  4. Registry gap is only documentary: `mobileChromeRegistry.ts` has no explicit Genesis-6 article routes (mount is static inside shell, same pattern as Gill — registry comment says static mounts need not re-list for connection). Not a user-visible gap.
- Recommended result: **remove residual + owner decision** from MASTER as closed-by-fix / decision no longer blocking.
- See: `COMMENT_MOBILE-CHROME-REGISTRY-GAPS.md`

### Challenge `ARTICLE-AUTHOR-HARDCODED` → leans `invalid` / dead-carrier; keep only if a live pilot still hardcodes wrong byline role

- Live bylines checked:
  - Gill part1: `Автор-редактор: Фёдор Милованов` (correct role wording)
  - lot-i-sodom / kak-hranit-serdce: same
  - hard-texts cards: `Редактор: Фёдор Милованов` on shelf cards
- Orphan `ArticleLayout.astro` still contains `isTranslation = data.author === 'abner-chou'` hardcode — **zero page importers**
- Recommended: mark invalid as current defect unless a live pilot head is shown violating AGENTS-REFERENCE byline rules; fold translation-policy into METADATA-SSOT if still desired

---

## 4. Root-cause / system notes

| Theme | Current take |
|---|---|
| Metadata SSOT | Header label, SECTION_META, gillSeriesData, dead layouts, pilot heads — one lane remains correct |
| Security ownership | Dist postbuild unifies CSP; source still fragmented; BaseLayout has no source CSP |
| Genealogy integrity | Space-id + dangling children + overclaiming `_status` + no ErrorBoundary = one integrity package |
| Reader prefs ownership | `gb:reader-preferences:v1` vs legacy `theme` key multi-writer |
| Gill ordinals | Not a bug — product display reorder; do not «fix» order back |

---

## 5. Suggested MASTER deltas (for a future consolidation wave — not applied here)

**Remove / retire**

| ID | Disposition |
|---|---|
| `SERIES-ORDER-INDEX-MISMATCH` | `invalid` as defect / accepted-product-state (optional WQ slug hygiene) |
| `MOBILE-CHROME-REGISTRY-GAPS` | `closed-by-fix` |
| `MOBILECHROME-GENESIS6-BAR-DECISION` | decision unnecessary — drop |
| `ARTICLE-AUTHOR-HARDCODED` | likely `invalid` (dead carrier); re-check only if live pilot violation found |

**Keep (reconfirmed)**

| ID | Notes |
|---|---|
| `RODOSLOVIYE-OG-IMAGE` | 3 angles |
| `EDITORIAL-LABEL-INCONSISTENCY` | source + live |
| `GENEALOGY-ID-INVALID-SPACE` | source |
| `GENEALOGY-NO-ERROR-BOUNDARY` | source-only |
| `SECURITY-CSP-*` + `FRAGMENTED-SECURITY-OWNERSHIP` | system |
| `SW-PWA-FRESHNESS` | improvement |
| `AR-IDX-JS-02-MULTIWRITER` | residual |
| `MISSING-BUTTON-TYPE` | residual |
| `SEARCH-LAZY-LOADER-DRIFT` | residual low |
| `METADATA-SSOT-PROLIFERATION` | system; extend with dead-layout cleanup |

**Add**

| ID | Notes |
|---|---|
| `GENEALOGY-CHILDREN-UNRESOLVED` | new defect / fold into genealogy integrity SYS |

Arithmetic if applied: 16 − 4 retires + 1 new ≈ **13** active units (still compact).

---

## 6. Product PR collision note

| PR | Head | Relevance |
|---|---|---|
| #1721 | `repair/dist-css-astro-admission-20260819` | audit harness CSS admission — no overlap with this intake's Product content findings |
| #1722 | `repair/wire-engine-contracts-20260819` | CI engine contracts — no overlap |

No competing content fix lane observed for OG image, Header label, genealogy JSON, or Gill order.

---

## 7. Method limitations

- No Playwright/browser runtime; interaction, focus, and visual layout not witnessed
- No local `astro build`; dist CSP behavior inferred from live HTML + postbuild source
- Live fetches are point-in-time 2026-08-19
- Did not exhaust every article pilot for byline policy
- TheLegendaryPoet MASTER noted P1 `TLP-COMM-ABUSE-001` but not re-verified this pass

---

## 8. Minimum useful contribution checklist

- [x] Strong multi-angle evidence on MASTER claims
- [x] Disproved noise (SERIES-ORDER as defect; MOBILE-CHROME residual)
- [x] New necessary integrity finding (genealogy children)
- [x] Collapse guidance into system lanes
- [x] No Product mutation; intake-only paths
- [x] Collision check on PRs currently active
