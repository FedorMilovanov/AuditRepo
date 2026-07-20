# AUDIT PRO — arena-auditor · 2026-07-16

> **Режим:** чистый аудитор (наблюдение + отчёт, **без правки source**).  
> **Проект:** `FedorMilovanov/gb-is-my-strength` → AuditRepo `projects/gb-is-my-strength/`  
> **Аудитор:** arena-auditor (Arena.ai Agent Mode)  
> **Канон:** `verified/MASTER_BUG_MATRIX.md` · `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` · DOC_MAP / Multi-witness  
> **Цель сессии:** (1) reverify HEAD/deploy; (2) gap-анализ **книжного движка «Сердце»** vs polished HTML prototype; (3) truth-surface drift AuditRepo SSOT.

---

## 0. Environment / SHA

| Поле | Значение |
|---|---|
| Source functional HEAD | **`f5e2b4ff5092aecd457cb96e0f30866f1617369d`** (`main`) |
| Merge tip | `Merge pull request #91 from FedorMilovanov/arena/019f675e-gb-is-my-strength` |
| Predecessors | `6e8562d` (SeriesMark arabic + editorial registry) ← `e9faea5` (книжный каркас Сердце) |
| AuditRepo branch | `arena/019f675e-auditrepo` |
| AuditRepo commit (prototype link) | `326e386` (book HTML only) |
| Node (sandbox) | v22.22.3 |
| Production URL | https://gospod-bog.ru/ |
| Pages API | `status: built`, `build_type: workflow` |

**Команды (evidence):**

```bash
git -C gb-is-my-strength fetch origin main && git rev-parse HEAD
# → f5e2b4ff5092aecd457cb96e0f30866f1617369d

gh run list --repo FedorMilovanov/gb-is-my-strength --workflow deploy.yml -L 8
# all conclusion: failure (including HEAD)

gh run view 29452653011 --json jobs
# Static publication gates: success
# Production-like dist publication audit: failure  ← stop point
# Deploy to GitHub Pages: skipped
```

---

## 1. Цель (что аудируем)

Сессия владельца ввела **улучшенный визуал книги** (ZIP GBS → polished HTML) и ожидает работу по правилам AuditRepo.

**Целевая поверхность:**

1. **Release truth** — видят ли читатели main?  
2. **Book engine («Сердце»)** — data + rail + sheet vs prototype `GBS-book-polished.html` (3 уровня: глава → статья → H2/H3).  
3. **Truth-surface** — не врёт ли AuditRepo SSOT (`NEXT_AGENT_PROMPT`, matrix masthead).

**Не в scope repair:** правка `gb-is-my-strength` source, ослабление гейтов, PremiumControls freeze, глоссарий/Bible.

---

## 2. Witness matrix (multi-angle)

| ID | Claim | W1 source | W2 CI/artifact | W3 browser/prod | Status |
|---|---|---|---|---|---|
| **AUD-2026-07-16-P0-DEPLOY** | Main не деплоится; prod stale vs HEAD | — | verified-ci: deploy run `29452653011` FAIL step 14 `dist-publication-audit.js --require-pagefind --forbid-dev`; last 30 deploy runs = 0 success | Pages `built` but pipeline never reached Deploy step on HEAD | **confirmed-current** (2+ witnesses CI; browser content-SHA not pinned — see note) |
| **AUD-2026-07-16-P0-SSOT-STALE** | AuditRepo SSOT claims HEAD `2ca2af3b` + DEP-BLOCK-* as current P0 | verified-source: `NEXT_AGENT_PROMPT.md`, matrix masthead | git log main ahead +287… now at `f5e2b4ff` | — | **confirmed-current** (doc drift) |
| **AUD-2026-07-16-P1-STATIC-GATES-GREEN** | Static publication gates on HEAD **green** (old DEP-BLOCK cluster largely unblocked in CI) | — | verified-ci: step «Static publication gates» success on run `29452653011` | — | **confirmed-current** (CI) — **supersedes** matrix wording that still lists DEP-BLOCK-* as open P0 without reverify |
| **AUD-2026-07-16-P1-BOOK-DATA** | «Сердце» is book-shaped in data: 4 chapters + arabic articles + 2 labels | verified-source: `hardTextsSeriesConfig.ts` HEART_CHAPTERS; `defineSeriesConfig` validates chapter/arabic | — | — | **confirmed-current** (source) |
| **AUD-2026-07-16-P1-BOOK-UI-PARTIAL** | Sheet has 3-level TOC; desktop rail **does not** nest article→sections accordion like prototype | verified-source: `GillPartTocOverlay.astro` arts→artSecs; `GillSeriesRail.astro` flat `currentKids` only | — | browser not run in sandbox (no dist build) | **likely-current** (source-only; needs W3) |
| **AUD-2026-07-16-P2-PROGRESS-COPY** | Rail still says «Прогресс **серии**», not «книги» | verified-source: `GillSeriesRail.astro:123` | — | — | **confirmed-current** (source) |
| **AUD-2026-07-16-P2-SHAPE-IMPLICIT** | No declarative `shape:'book'`; detection = `isBookSeries()` via any `tier:'chapter'` | verified-source: `seriesConfig.ts` | research package risk R-01/R-07 | — | **confirmed-current** |
| **AUD-2026-07-16-P2-PROTOTYPE-GAP** | Polished prototype v7 has controls/motion not in source owners | verified-source vs `working/book-visual-prototype-2026-07-15/GBS-book-polished.html` | research RISK_REGISTER R-04…R-24 | htmlpreview only (not prod) | **research-gap** (not production bug until landed) |
| **AUD-2026-07-16-P1-PIXEL-DIFF-RED** | Separate `pixel-diff` check failed on HEAD | — | verified-ci check-run failure | — | **confirmed-current** (CI); root cause not extracted (log EOF) |

**Note on prod content:** live `gospod-bog.ru` responds 200; exact deployed SHA not extracted this pass (no IndexNow/deploy artifact pin). Safe claim: **readers do not get HEAD** because Deploy step is skipped after dist-publication audit failure continuously since at least 2026-07-14.

---

## 3. Deploy / release truth (P0)

### 3.1 What changed since matrix reverify `2ca2af3b`

| Was (matrix 07-14) | Now (`f5e2b4ff`) |
|---|---|
| Static publication gates RED (editorial, maps, avraam, CSS !important) | **Static publication gates GREEN** on deploy run HEAD |
| DEP-BLOCK-* listed as open P0 | Code fixes claimed in matrix CLOSED section; **CI agrees for static gates** |
| Fail at early validate chain | Fail **later**: `Production-like dist publication audit` (`scripts/dist-publication-audit.js --require-pagefind --forbid-dev`) |
| pixel-diff not the stop | **pixel-diff also failure** on same SHA |

### 3.2 Stop-point (exact)

```text
workflow: deploy.yml
run:     29452653011
sha:     f5e2b4ff…
step 7:  Static publication gates          ✅
step 8:  Build Astro + copy legacy         ✅
…
step 14: Production-like dist publication audit  ❌ exit 1
step 28: Deploy to GitHub Pages            skipped
```

Annotation: «Process completed with exit code 1» at deploy.yml ~line 143. Full log download failed (EOF) — **root message inside dist-publication-audit not captured this pass**.  
**Repair-ready condition:** re-run or download logs; reproduce `node scripts/dist-publication-audit.js --require-pagefind --forbid-dev` on production-like dist.

### 3.3 Consequence

- `PROD-STALE-DEPLOY-RED` **remains true** (mechanism updated).  
- Old DEP-BLOCK IDs should be **reclassified FIXED/superseded** only after matrix Session log + reverify doc at `f5e2b4ff` (auditor does not rewrite matrix body in this intake).  
- New candidate ID: **`DEP-BLOCK-DIST-PUBLICATION-AUDIT`** (P0).

---

## 4. Book engine — source truth vs prototype

### 4.1 Data layer — PASS (book model landed)

**Witness:** `src/components/article-pilots/_shared/series/hardTextsSeriesConfig.ts` (comment «КНИГА (владелец 2026-07-15)»).

```text
HEART_CHAPTERS:
  I  Диагноз сердца      → krajne + 5 articles
  II Сердце на войне     → rimlyanam + 5
  III Перелом и перемена → novoe + 5
  IV Жизнь Духом         → serdce-duh + 3
+ label Пролог + label Справочник
= 4 chapter groups + 22 article routes + 2 frontmatter
```

- Chapter: `tier:'chapter'`, `mark.kind:'roman'`, **no** `pages[chapterId]`, href → first article.  
- Article: `mark.kind:'arabic'`, `parent: ch.id`, full `pages[id].partToc`.  
- Validator: `defineSeriesConfig` enforces roman/arabic/parent/chapter rules.  
- Helper: `isBookSeries`, `chapterArticles`, `topLevelItems`, `chapterOf`.  
- `SeriesMark` accepts `arabic` since `6e8562d` (was type blocker in research VALIDATION_STATUS).  
- Editorial metadata contains heart routes (same commit bulk rewrite).

### 4.2 Part TOC sheet — PARTIAL PASS (3 levels exist)

**Witness:** `GillPartTocOverlay.astro`

```text
chapter row (roman)
  └─ arts.map → article rows (arabic)
       └─ if current article: artSecs from pages[art.id].partToc (H2/H3)
```

This matches prototype **book sheet** hierarchy at the data/structure level.  
Visual polish (sticky head, stagger, axis ≤0.25px, dual progress fill) = prototype-only until CSS/motion port.

### 4.3 Desktop rail — GAP vs prototype (P1 visual/product)

**Witness:** `GillSeriesRail.astro`

| Prototype book rail | Source rail now |
|---|---|
| «Прогресс **книги**» | «Прогресс **серии**» |
| Nested expandable **article → sections** in current chapter | Flat list «В этой главе» (`gbs2-satrow`) — **no per-article section accordion** |
| Current article open with live section progress rail | Section TOC only as classic `partToc` of **current page** under current card (H2/H3 of one article) |
| Compact chapters II–IV with meta minutes | Compact cards after current (standard rail) |
| Ribbon frontmatter | Leather ribbon for labels (exists) |

**Root product gap:** owner ask «как в книге» is **data-complete**, **sheet-partial**, **rail-incomplete** relative to polished HTML v7.

### 4.4 Implicit shape (P2 architecture)

- Research contract wants `shape?: 'flat' | 'book'`.  
- Source uses **implicit** `isBookSeries(cfg)` (= any chapter).  
- `isBookSeries` is **exported but underused** for chrome copy/geometry (only `countWord` «Глава»/«Часть» and kids label).  
- Risk **R-01** (book as 4th engine) currently avoided — good.  
- Risk **R-07** (flat Gill regression) still active for any visual port without flat snapshots.

### 4.5 Prototype-only surfaces (do not treat as prod bugs)

From `GBS-book-polished.html` / RISK_REGISTER — not claimed broken on prod until lane lands:

- Series queue player in sheet footer  
- Help slot ↔ speed morph (mobile) / desktop speed bloom (may already exist in FC for Gill — not re-audited deeply)  
- Border-only settings sheet treatment  
- Sticky chapter headers + staggered section reveal  
- Nested rail article accordion exclusivity  

**Rule (research + AGENTS):** не копировать standalone HTML; port into `GillSeries*` + `floating-cluster.*` only.

---

## 5. Truth-surface drift (AuditRepo)

| File | Stale fact | Live fact |
|---|---|---|
| `NEXT_AGENT_PROMPT.md` | HEAD `2ca2af3b`, priority = DEP-BLOCK-* static gates | HEAD `f5e2b4ff`, static gates green; fail = dist-publication-audit |
| `MASTER_BUG_MATRIX` masthead | Source HEAD `2ca2af3b`, Deploy «FIX-READY» narrative | Deploy still failing; need reverify at `f5e2b4ff` |
| Matrix P0 DEP-BLOCK-* | Some still read as open in older sections | CI step Static publication gates success on HEAD — **reconcile required** |
| `PROD-STALE-DEPLOY-RED` | Open (correct) | Still open; **mechanism updated** |

**Auditor action:** document only. **Verifier/owner action:** Session log + reverify scaffold at `f5e2b4ff` + matrix P0 rewrite (not done in this pass to avoid dual-writer drift).

---

## 6. Candidate ledger (for matrix — NOT applied)

| Proposed ID | Sev | Summary | Witness | Repair owner hint |
|---|---|---|---|---|
| **DEP-BLOCK-DIST-PUBLICATION-AUDIT** | P0 | `dist-publication-audit.js --require-pagefind --forbid-dev` fails after green static gates; blocks Pages deploy | verified-ci run 29452653011 | Download logs; fix dist contract; one subsystem «release-unblock» |
| **PROD-STALE-DEPLOY-RED** | P0 | keep; update mechanism text | verified-ci | same |
| **AUDITREPO-SSOT-HEAD-DRIFT** | P1 | NEXT_AGENT_PROMPT + matrix masthead lag main by days/SHAs | verified-source | reverify ritual + dual-file update |
| **BOOK-RAIL-NESTED-TOC-GAP** | P1 | Desktop rail lacks prototype nested article→section accordion | verified-source | series visual lane after deploy green; recursive SeriesTree |
| **BOOK-PROGRESS-COPY** | P2 | «Прогресс серии» on book series | verified-source | `isBookSeries` → copy «книги» |
| **BOOK-SHAPE-FIELD-MISSING** | P2 | no declarative `shape` | verified-source | optional; implicit works; contracts clearer with field |
| **CI-PIXEL-DIFF-HEAD-RED** | P1 | pixel-diff check fails on HEAD | verified-ci | separate from dist-publication; need log |

**Do NOT re-open** DEP-BLOCK-EDITORIAL/MAPS/CSS/AVRAAM as current without contrary CI evidence — HEAD static gates passed.

---

## 7. Gap map: prototype → source owners

| Prototype concern | Source owner | Landed? |
|---|---|---|
| chapter/arabic data | `hardTextsSeriesConfig` + `defineSeriesConfig` | ✅ |
| SeriesMark arabic type | `SeriesMark.astro` | ✅ `6e8562d` |
| Book sheet accordion | `GillPartTocOverlay` | ✅ structure |
| Rail kids under chapter | `GillSeriesRail` currentKids | ⚠️ flat only |
| Nested section TOC in rail per article | — | ❌ |
| Progress «книги» | rail copy | ❌ |
| `shape:'book'` | SeriesConfig | ❌ (implicit) |
| PlayEmber ring/badge | FC / PlayEmber | ✅ (pre-existing canon) |
| Settings sheet | GillReaderSettingsSheet | ✅ (pre-existing) |
| Queue series player | — | ❌ prototype |
| Engine contracts for book nesting | `check-engine-contracts.js` | partial (chapter helpers exist; no geometry axis contracts) |

---

## 8. Recommended next work (priority order)

> Auditor does not implement. For owner / repair agent.

### Lane A — release-unblock (only)

1. Capture full log of step «Production-like dist publication audit» on `f5e2b4ff`.  
2. Reproduce locally: `strangler:build:production-like` → Pagefind → `node scripts/dist-publication-audit.js --require-pagefind --forbid-dev`.  
3. Fix **one** subsystem; do not mix book visual.  
4. Confirm deploy GREEN + Pages SHA = functional SHA.  
5. Update matrix + NEXT_AGENT_PROMPT atomically (SSOT).

### Lane B — AuditRepo truth reconciliation (docs only)

1. `scaffold_reverify.py` → `CURRENT_HEAD_REVERIFY_2026-07-16_f5e2b4ff.md`.  
2. Close/supersede DEP-BLOCK-* with CI evidence; open DEP-BLOCK-DIST-PUBLICATION-AUDIT.  
3. Refresh NEXT_AGENT_PROMPT masthead.

### Lane C — book visual (after A green)

1. Port **rail nested article TOC** only (no new engine).  
2. `isBookSeries` copy: «Прогресс книги», dual progress labels.  
3. Contracts + engine:sweep book fixtures; **Gill flat golden screenshots first** (R-07).  
4. Do not wholesale-paste `GBS-book-polished.html`.

### Explicit non-goals now

- Mass Nagornaya dark fix mixed with book  
- PremiumControls polish  
- Weakening dist-publication-audit to force deploy  

---

## 9. Positive claims discipline (GATE-29)

| Positive claim | Allowed? | Basis |
|---|---|---|
| «Static publication gates green on HEAD» | ✅ | CI step success on run 29452653011 |
| «Deploy green / readers see book» | ❌ | Deploy step skipped; no green run in last 30 |
| «Book data model complete for Heart» | ✅ | source config + validator |
| «Book UI matches polished prototype» | ❌ | rail nested gap + copy + motion |
| «SeriesMark arabic fixed» | ✅ | commit `6e8562d` diff |
| «dist-publication root cause is X» | ❌ | log not retrieved |

---

## 10. Artifacts in this intake

```text
incoming/arena-auditor/2026-07-16/
  REPORT.md                 ← this file
  README.md                 ← scaffold
  evidence/                 ← (commands echoed in §0; screenshots not captured)
  commands.log              ← optional append
```

Related (not this intake):

- `working/book-visual-prototype-2026-07-15/GBS-book-polished.html` — visual reference  
- `incoming/gbs-design-zip-2026-07-15/` — ZIP provenance  
- Preview: https://htmlpreview.github.io/?https://github.com/FedorMilovanov/AuditRepo/blob/arena/019f675e-auditrepo/projects/gb-is-my-strength/working/book-visual-prototype-2026-07-15/GBS-book-polished.html  

---

## 11. Bottom line

1. **Auditor mode ON** — no source repairs performed.  
2. **P0 goal remains deploy:** mechanism shifted from static gates → **`dist-publication-audit` after build**.  
3. **Book series data is real** on main (`e9faea5`…`f5e2b4ff`); **polished 3-level rail visual is not fully ported**.  
4. **AuditRepo SSOT is stale** relative to HEAD — next verifier pass should reconcile before more feature work.  
5. Correct sequence: **unblock deploy → reconcile matrix → book visual lane**.

---

## 12. Deep pass (cycle 2) — pointer

**Root cause of deploy RED is now repair-ready.**

- Evidence: [`evidence/DEP-BLOCK-DIST-PUBLICATION-ROOTCAUSE_2026-07-16.md`](./evidence/DEP-BLOCK-DIST-PUBLICATION-ROOTCAUSE_2026-07-16.md)
- Addendum: [`ADDENDUM_DEEP_2026-07-16.md`](./ADDENDUM_DEEP_2026-07-16.md)
- Book gap: [`evidence/BOOK_ENGINE_DEEP_GAP_2026-07-16.md`](./evidence/BOOK_ENGINE_DEEP_GAP_2026-07-16.md)

**Mechanism (one line):** `dist-publication-audit.js` still requires Heart markers `gbs2-rail`, while `GillSeriesRail` emits `gbs-rail` (Gill markers in the same file already use `gbs-rail`; `audit-pro` dual-accepts both → static gates green).

*Prepared under AUDIT PRO / Multi-witness / Single-Writer-Per-Fact. Raw intake only — not `verified/`.*

