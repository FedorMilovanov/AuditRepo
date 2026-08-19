# Verification Wave Synthesis

## Meta

- Date: 2026-08-19
- Verifier: bugverifikator (acting as verifier for this wave)
- Project: gb-is-my-strength (gospod-bog.ru)
- Source repo: FedorMilovanov/gb-is-my-strength
- Wave purpose: current-check + deduplication / root-cause of the active MASTER rows after Product `main` advanced 14 commits (485db8c → cb3681e); admit/drop/reword rows for the next consolidation.
- Selected current-check anchor(s): Product `main` HEAD `cb3681e` (committed 2026-08-19T00:30Z); live production HTTP fetch of `/app/`, `/rodosloviye/`, `/articles/lot-i-sodom/`, `/articles/dzhon-gill-chast-3-nasledie/`, `/articles/dzhon-gill-chast-4-ekzeget/` on 2026-08-19; open Product branch census.
- Scope: all 13 current defects + 1 improvement + 2 system lanes in `verified/MASTER_BUG_MATRIX.md`.
- Explicit exclusions: the-legendary-poet; local build/runtime regression; Research authority surfaces; a 485db8c importer census for the dead-code findings (confirmed dead only on cb3681e).
- Signal classes represented: Product; one harness/temporal-boundary finding.
- Exact Product / artifact / event anchors: cb3681e source tree (GitHub git trees API, recursive); live HTML of the five routes above; Product branch SHAs 60ed203 / c942deb / d426457 / 475a8f2.
- Semantic owners and overlap check: per-file Product owners; collision check performed — open lane `agent/antisovetov-title-suffix-20260818` (60ed203) already owns the antisovetov title-suffix symptom; no competing lane created.

> This document classifies a selected package. It is not a promise to keep the whole AuditRepo synchronized with every future source commit.

---

## Inputs reviewed

| Agent/report | Audited anchor | Scope | Evidence angles | Findings/claims |
|---|---|---|---|---|
| arena-agent surface-pass-4 (`incoming/2026-08-19-arena-agent-surface-pass-4.md`) | 485db8c | rodosloviye OG, ArticleLayout series map, GenealogyTree boundary, sitemap, mobile registry | source | RODOSLOVIYE-OG-IMAGE, ARTICLE-LAYOUT-SERIES-NAMES-HARDCODE, GENEALOGY-NO-ERROR-BOUNDARY, MOBILECHROME-REGISTRY-GAPS, … |
| arena-agent surface-pass-5 (`…surface-pass-5.md`) | 485db8c | series order, ancestor tracing, golden-path perf, author hardcode | source | SERIES-ORDER-INDEX-MISMATCH, ANCESTOR-TRACING-INCOMPLETE, TRACE-GOLDEN-PATH-INEFFICIENT, ARTICLE-AUTHOR-HARDCODED |
| arena-agent surface-pass-6 (`…surface-pass-6.md`) | 485db8c | genealogy ID space, duplicate search, future-dated meta, CSP gaps | source | GENEALOGY-ID-INVALID-SPACE, UI-DUPLICATE-SEARCH-BUTTONS, METADATA-FUTURE-DATED, SECURITY-CSP-GAPS, SECURITY-CSP-INCONSISTENCY |
| existing comment-* corpus (`incoming/2026-08-19-comment-*.md`, incl. bugverifikator's own) | 485db8c | confirmations of the above | source | confirms/extends the pass-4/5/6 claims |
| bugverifikator 2026-08-19 first pass (`incoming/bugverifikator/2026-08-19/REPORT.md`) | a2ef67da5 (then 485db8c framing) | title suffix D-19 + candidates | source | D-19 re-verified, D-20/D-21 candidates |
| bugverifikator 2026-08-19 reverify (`incoming/bugverifikator/2026-08-19/REPORT.md` + EVIDENCE_* + COMMENT_*) | cb3681e + live | all active MASTER rows | source + live + lifecycle | reverify + corrections (this wave) |

---

## Executive result

| Input count | Current local | Systemic roots | Duplicate symptoms | Stale | Invalid/audit drift | Parked/risk accepted | Owner decisions |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 6 | 8 | 2 | 1 | 2 | 3 | 2 | 1 |

---

## 1. Current local defects — keep

| Finding | Result | Decisive evidence | Owner / next |
|---|---|---|---|
| `RODOSLOVIYE-OG-IMAGE` | keep current-local | source RodosloviyePageHead L28/L38 + live og/twitter image = `og-karty` on `/rodosloviye/` (alt = "Родословие…") | rodosloviye head owner; add route-contextual OG asset |
| `SERIES-ORDER-INDEX-MISMATCH` | keep, **root relocated** + impact low→medium | active carrier = `gillSeriesData.ts` `GILL_SERIES_ITEMS` (part4 before part3; part4="III", part3="IV"); live Gill nav distorted (part4→next part3). `site.ts` `SERIES_ORDER` is dead code. | Gill series engine owner; swap part3/part4 in `gillSeriesData.ts`; owner-sanity-check on intended order |
| `ARTICLE-AUTHOR-HARDCODED` | keep **only if** carrier re-checked live | filed against `ArticleLayout.astro`, which is orphaned on cb3681e. Same dead-code risk as ARTICLE-LAYOUT-SERIES-NAMES-HARDCODE. Needs a live importer check before staying. | layout refactor owner; re-check or move to invalid |
| `GENEALOGY-NO-ERROR-BOUNDARY` | keep current-local | no `ErrorBoundary` around `GenealogyTree.tsx` island on cb3681e (source-only; no runtime crash reproduced) | genealogy island owner; add ErrorBoundary |
| `GENEALOGY-ID-INVALID-SPACE` | keep current-local (impact medium-low/latent) | `data/genealogy/genealogy.json` `" lud_shem"` (L1395) + same-space ref in Shem children (L403); `byId` Map keyed by exact id; space currently self-consistent so latent | genealogy data owner; trim id + ref together; add ID-canonicalization guard |
| `EDITORIAL-LABEL-INCONSISTENCY` | keep current-local | `Header.astro` L18 "Разбор заблуждений" vs `site.ts` `SECTION_META['hard-texts']` "Трудные тексты" | nav metadata owner; reconcile to SECTION_META.label |
| `SECURITY-CSP-GAPS` | keep, **reword/narrow** | article pilots now have CSP; source gap = `/hard-texts/genesis-6/` + `/izbrannoe/` (BaseLayout). `/app/` + `/rodosloviye/` are CSP-less in cb3681e source but CSP-present live (audit-drift: source under-reports). | unified security head owner |
| `SECURITY-CSP-INCONSISTENCY` | keep, **reframe as absorbed symptom** of `FRAGMENTED-SECURITY-OWNERSHIP` | 4 `img-src` variants across 61 CSP heads; `'self'` already covers same-origin so no proven image breakage — defect is fragmentation, not a functional break | absorbed into FRAGMENTED-SECURITY-OWNERSHIP |

## 2. Systemic roots — keep

| Finding | Result | Decisive evidence | Owner / next |
|---|---|---|---|
| `METADATA-SSOT-PROLIFERATION` | keep systemic root | series labels / author roles / nav labels hand-coded in `ArticleLayout`/`Header` + duplicated in `site.ts`; drifts. Feeds ARTICLE-LAYOUT-SERIES-NAMES-HARDCODE (now invalid via dead code — but the SSOT split itself is real), ARTICLE-AUTHOR-HARDCODED, SERIES-ORDER-INDEX-MISMATCH, EDITORIAL-LABEL-INCONSISTENCY | metadata SSOT owner; single `site.ts` owner consumed by all layouts/nav |
| `FRAGMENTED-SECURITY-OWNERSHIP` | keep systemic root | CSP hand-written per head; divergent `img-src`; missing CSP on BaseLayout surfaces (source) while live diverges; absorbs SECURITY-CSP-INCONSISTENCY | unified security head owner |

## 3. Duplicate symptoms

| Finding | Result | Decisive evidence | Owner / next |
|---|---|---|---|
| `SECURITY-CSP-INCONSISTENCY` | duplicate-symptom of `FRAGMENTED-SECURITY-OWNERSHIP` | one mechanism (per-head hand-written CSP) explains the 4 `img-src` variants and the gaps; `'self'` already authorizes same-origin so no independent functional break | drop as separate row once the root is addressed; keep referenced under the root |

## 4. Stale, invalid and audit-drift

| Finding | Result | Decisive evidence | Historical value retained |
|---|---|---|---|
| `ANCESTOR-TRACING-INCOMPLETE` | stale (closed-by-fix) | `computeFocusLineage` on cb3681e walks `father ?? mother` + BFS queue (the report's own proposed fix is now live); multiparent lane `b84aa56` | one-line legacy note: closed by multiparent lane; not reproducible on cb3681e |
| `UI-DUPLICATE-SEARCH-BUTTONS` | stale | `ui/Header` only on BaseLayout pages; `ReaderPreferencesHead` only on {/articles/,/biografii/,/pastor-series/}; disjoint on cb3681e; search lane reworked (e6972ea) | one-line legacy note; mark bugverifikator's 485db8c confirmation stale too |
| `ARTICLE-LAYOUT-SERIES-NAMES-HARDCODE` | invalid (dead-code carrier) | `ArticleLayout.astro` zero `src/` importers on cb3681e (only docs/**); symptom not in production | retain as caution: verify carrier *usage*, not just contents; same carrier as ARTICLE-AUTHOR-HARDCODED |
| `METADATA-FUTURE-DATED` | invalid as framed (audit-drift: clock vs repository time) | repo effective today ≈2026-08-19 (cb3681e date); `2026-08-17` is 2 days in the past, not future; the report's "today 2026-08-19" contradicts repo timestamps | retain as rule: freshness dispositions use repo material timestamps, not a contradictory shell clock. Literal-date concern → Work Queue |
| `MOBILECHROME-REGISTRY-GAPS` (original wording) | invalid-as-worded → narrowed (see §1) | pastor-series covered via SeriesReaderChrome; narrowed residual = Genesis-6 article pages | retain the registry-is-not-SSOT-for-static-mounts note |

## 5. Parked, accepted risk and not worth fixing

| Finding/theme | Result | Impact | Cost/risk | Revisit trigger |
|---|---|---|---|---|
| `TRACE-GOLDEN-PATH-PERF` (=`TRACE-GOLDEN-PATH-INEFFICIENT`) | parked (Work Queue) | none current (O(N) find in a small biblical graph) | low value until a measurable scale need | genealogy corpus grows materially / measured jank |
| `/app/` literal publication date | parked (Work Queue) | low (date is historic now; risk is a future release shipping another misaligned literal) | trivial to derive from build time | next release that hard-codes a date |
| ReaderPreferencesHead guard ("bail if any `.gb-nav-search-icon` exists") | parked (Work Queue) | hardening against future regression of the now-stale duplicate | low | if Header is re-wired onto a searchOpenerRoutes page |

## 6. Owner decisions

| Decision | Options | Trade-offs | Recommended default |
|---|---|---|---|
| Genesis-6 article pages: require a mobile bottom bar? | (a) wire `Genesis6ArticlePage` to a mobile bar; (b) leave as plain long-form reader pages | (a) consistent nav across series; (b) less chrome on long reads | confirm intent; if (a), convert MOBILECHROME-REGISTRY-GAPS to a repair lane; if (b), drop the row as accepted |
| Gill part3/part4 intended reading order | (a) part3 before part4 (canonical numbering); (b) part4 before part3 (intentional) | (a) fixes both order + numerals; (b) only the roman numerals are wrong (part4 must not be "III") | (a) — roman numerals strongly indicate an inversion |
| `ArticleLayout`/`SeriesArticleLayout` orphans | (a) delete; (b) re-wire as future unified layout | (a) stops audit-drift from dead code; (b) revives the SSOT plan | (a) delete, unless the unified-layout plan is active |

## 7. Repair lane options

| Lane | Findings/themes | Expected benefit | Scope | Required witnesses | Live required? |
|---|---|---|---|---|---|
| A. Rodosloviye OG asset | RODOSLOVIYE-OG-IMAGE | correct social previews for `/rodosloviye/` | add `og-rodosloviye-1200x630.webp`, reference in RodosloviyePageHead | source + live share-preview validator | yes |
| B. Gill series order | SERIES-ORDER-INDEX-MISMATCH | correct in-series nav + part numbering | swap part3/part4 in `gillSeriesData.ts` (+ roman III/IV); clean dead `site.ts` entry | source + live Gill nav cards | yes |
| C. Genealogy ID canonicalization | GENEALOGY-ID-INVALID-SPACE | graph integrity invariant restored | trim `" lud_shem"`→`"lud_shem"` (id + ref together); add ID guard in `check-data-consistency` | source + data-consistency check green | no |
| D. Genealogy ErrorBoundary | GENEALOGY-NO-ERROR-BOUNDARY | graceful island failure | wrap `GenealogyTree` in React ErrorBoundary | source + runtime crash reproduction | yes (runtime) |
| E. Metadata SSOT | METADATA-SSOT-PROLIFERATION + EDITORIAL-LABEL-INCONSISTENCY (+ ARTICLE-AUTHOR-HARDCODED if kept) | one owner, no drift | move series labels / author roles / nav labels to `site.ts`; reconcile Header to `SECTION_META.label`; remove local `seriesNames`/`author==='abner-chou'` literals | source + render parity | no |
| F. Unified security head | FRAGMENTED-SECURITY-OWNERSHIP + SECURITY-CSP-GAPS (+ absorbs SECURITY-CSP-INCONSISTENCY) | consistent CSP across all surfaces | one security head emitting CSP + `X-Content-Type-Options`; shared `img-src` allowlist; cover BaseLayout pages | source + live CSP census | yes |
| (existing) antisovetov title | D-19 / brand-consistency | canonical title suffix | already owned by branch `agent/antisovetov-title-suffix-20260818` (60ed203) | exact-head + live | yes |

The owner may choose one lane, several lanes or none. This synthesis does not create an automatic obligation to repair every verified finding.

---

## 8. Verification sufficiency

- Critical/high-risk conclusions: none promoted to critical here. The `SECURITY-CSP-GAPS` "high (Security)" rating from the original filing is **downgraded** — article pilots now have CSP and the live deployment already covers `/app/`+`/rodosloviye/`; the residual BaseLayout gap is medium. No security/data-loss conclusion rests on a single angle.
- Ordinary local findings: each kept current-local defect has ≥1 strong current direct witness on cb3681e (RODOSLOVIYE-OG-IMAGE has source+live = 2 angles; SERIES-ORDER has source+live; the rest source+lifecycle). Proportionate for P2.
- Visual/P3 findings: none.
- Systemic roots: each root has multiple manifestations sharing one mechanism (METADATA-SSOT: 4 symptoms; FRAGMENTED-SECURITY: CSP gaps + 4 img-src variants) + a class-level remedy. Meets the systemic-root bar.
- Negative findings (stale/invalid): each is backed by a current-check that contradicts the original on the *current* boundary (ANCESTOR: live code matches the proposed fix; UI-DUP: disjoint route census; ARTICLE-LAYOUT: zero importers; METADATA-FUTURE: repo-time vs clock; MOBILECHROME: static-mount coverage). These are the strongest dispositions in the wave because they correct prior claims.
- Do not count repeated agents as independent: the pass-4/5/6 confirmations and the comment-* corpus are all the same method (source grep on 485db8c) — they count as one angle (source @ 485db8c). This wave's independent angles are: source @ cb3681e, live @ 2026-08-19, lifecycle (commit/branch history). The corrections stand on the cb3681e/live angles, not on re-counting the 485db8c source pass.

---

## 9. Canonical updates

Update only materially affected facts:

- Active backlog changes (MASTER `verified/MASTER_BUG_MATRIX.md`):
  - **Remove** (closure wave): `ANCESTOR-TRACING-INCOMPLETE` (stale), `UI-DUPLICATE-SEARCH-BUTTONS` (stale), `ARTICLE-LAYOUT-SERIES-HARDCODE` (invalid/dead carrier), `METADATA-FUTURE-DATED` (invalid as framed).
  - **Reword/narrow**: `MOBILE-CHROME-REGISTRY-GAPS` → "Genesis-6 article pages lack a mobile bottom bar; pastor-series covered via SeriesReaderChrome" (consider owner-decision); `SECURITY-CSP-GAPS` → "BaseLayout pages (`/hard-texts/genesis-6/`, `/izbrannoe/`) lack CSP in source; `/app/`+`/rodosloviye/` already CSP in live" (+ audit-drift note).
  - **Reframe as absorbed symptom**: `SECURITY-CSP-INCONSISTENCY` → reference under `FRAGMENTED-SECURITY-OWNERSHIP`.
  - **Re-anchor root + impact**: `SERIES-ORDER-INDEX-MISMATCH` → root `gillSeriesData.ts` (not `site.ts`), impact medium.
  - **Re-anchor HEAD**: all kept rows `HEAD 485db8c` → `cb3681e`.
  - **Re-check before keeping**: `ARTICLE-AUTHOR-HARDCODED` (shares the dead `ArticleLayout` carrier) — confirm a live importer or move to invalid.
  - Net active defects: 13 → 8 current-local (+1 reframe as symptom) ; 2 system lanes unchanged; 1 improvement parked.
- System themes changes (`verified/SYSTEM_THEMES.md`): re-anchor `METADATA-SSOT-PROLIFERATION` (note the `ArticleLayout` carrier is dead — the SSOT split is still real but the live symptom carrier moved to active series engine + Header); re-anchor `FRAGMENTED-SECURITY-OWNERSHIP` (note source-vs-live CSP divergence).
- Work queue changes (`WORK_QUEUE.md`): add (a) `/app/` literal publication date → release-derived; (b) ReaderPreferencesHead guard hardening; keep `TRACE-GOLDEN-PATH-PERF`.
- Closure ledger entries (`verified/CLOSURE_LEDGER.md`): append `ANCESTOR-TRACING-INCOMPLETE` (closed-by-fix, multiparent lane), `UI-DUPLICATE-SEARCH-BUTTONS` (stale, search-lane rework), `ARTICLE-LAYOUT-SERIES-HARDCODE` (invalid, dead carrier), `METADATA-FUTURE-DATED` (invalid-as-framed, temporal-boundary audit-drift).
- Significant reverify document needed? **yes** — this wave itself (`incoming/bugverifikator/2026-08-19/`) is the reverify evidence; a compact `verification/2026-08-19-post-advance-reverify/REPORT.md` summarizing these dispositions is warranted when the owner runs the consolidation.

No global Product HEAD sync is required unless the project explicitly selects a new current-check anchor for an active wave. Only current defects, verified necessary improvements, narrowed residuals, system verification lanes and owner decisions may enter MASTER. A signal or historical finding alone is not admission.

---

## 10. Closure summary

- Closed by local fix: `ANCESTOR-TRACING-INCOMPLETE` (multiparent lane b84aa56, already on main).
- Absorbed by system fix: `SECURITY-CSP-INCONSISTENCY` (into `FRAGMENTED-SECURITY-OWNERSHIP`, pending the unified security head).
- Stale/invalid: `ANCESTOR-TRACING-INCOMPLETE`, `UI-DUPLICATE-SEARCH-BUTTONS`, `ARTICLE-LAYOUT-SERIES-HARDCODE`, `METADATA-FUTURE-DATED` (as framed); original `MOBILECHROME-REGISTRY-GAPS` wording.
- Parked/accepted risk: `TRACE-GOLDEN-PATH-PERF`; `/app/` literal date; ReaderPreferencesHead guard.
- Still independent and active: `RODOSLOVIYE-OG-IMAGE`, `SERIES-ORDER-INDEX-MISMATCH` (re-rooted), `GENEALOGY-NO-ERROR-BOUNDARY`, `GENEALOGY-ID-INVALID-SPACE`, `EDITORIAL-LABEL-INCONSISTENCY`, `SECURITY-CSP-GAPS` (narrowed), `ARTICLE-AUTHOR-HARDCODED` (pending carrier re-check); roots `METADATA-SSOT-PROLIFERATION`, `FRAGMENTED-SECURITY-OWNERSHIP`.
- Regression witnesses added: none new (no Product mutation by this agent). Witness angles recorded: source @ cb3681e, live @ 2026-08-19, lifecycle.
- Live evidence obtained or explicitly unnecessary: obtained for RODOSLOVIYE-OG-IMAGE and SERIES-ORDER-INDEX-MISMATCH; explicitly unnecessary for GENEALOGY-ID-INVALID-SPACE (data/source claim) and the dead-carrier invalidations (a usage census suffices); not obtained for GENEALOGY-NO-ERROR-BOUNDARY (flagged needs runtime) and `SECURITY-CSP-GAPS` on `/hard-texts/genesis-6/`+`/izbrannoe/` (flagged needs live fetch).
