# SITEWIDE-BTN-TYPE-AUDIT — gb-is-my-strength

## Meta

- Date: 2026-07-17
- Auditor: Arena Agent (arena.ai)
- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Audited anchor (SHA): cb3681e1a85b5f8919c9dc537f812a842bbe9235
- Scope: **all** `src/**/*.astro` and `src/**/*.tsx` / `src/**/*.jsx` — **543 files**, no name-based pre-filter
- Scan method: full blob fetch per file + regex `<button\b([^>]*?)(?:/>|>)` → absent `type=` in captured attributes
- Lane: `SITEWIDE-BTN-TYPE-AUDIT` (system verification lane from MASTER)

---

## Result summary

| Metric | Value |
|---|---|
| Files scanned | **543** |
| Files with ≥1 `<button>` missing `type=` | **20** |
| Total `<button>` instances missing `type=` | **47** |
| Pattern clusters | 5 |

**Compared to prior partial scan (64 files):** 5 additional files found, 12 additional instances — confirming the partial scan was materially incomplete.

---

## Complete instance list (anchor cb3681e)

### 1 · `src/components/about/AboutPageChrome.astro` — 1 instance

| Line | Tag |
|---|---|
| L204 | `<button id="themeToggle" class="theme-toggle" aria-label="Переключить тему">` |

Pattern: **theme-toggle**

---

### 2 · `src/components/article-pilots/gill-series/GillPartTocOverlay.astro` — 1 instance

| Line | Tag |
|---|---|
| L44 | `<button class="back" id="backToSeries" aria-label="Назад к серии">` |

Pattern: **navigation / back** — ⚠️ new, not in partial scan

---

### 3 · `src/components/article-pilots/gill-series/GillSeriesRail.astro` — 3 instances

| Line | Tag |
|---|---|
| L233 | `<button class="gbs-rail-foot__btn" data-action="share" aria-label="Поделиться">` |
| L251 | `<button class="gb-icon gb-theme-toggle" data-fc-action="theme" aria-label="Тема" aria-pressed="false">` |
| L255 | `<button class="gb-icon" data-fc-action="search" aria-label="Поиск">` |

Pattern: **rail actions (share / theme / search)** — ⚠️ new, not in partial scan

---

### 4 · `src/components/article-pilots/hermenevtika/HermenevtikaBody.astro` — 3 instances

| Line | Tag |
|---|---|
| L186 | `<button class="faq-accordion__q" aria-controls="...faq-a1" aria-expanded="false">` |
| L195 | `<button class="faq-accordion__q" aria-controls="...faq-a2" aria-expanded="false">` |
| L204 | `<button class="faq-accordion__q" aria-controls="...faq-a3" aria-expanded="false">` |

Pattern: **FAQ accordion** — ⚠️ new, not in partial scan

---

### 5 · `src/components/article-pilots/hermenevtika/HermenevtikaMobileBar.astro` — 1 instance

| Line | Tag |
|---|---|
| L86 | `<button class="hmbar-btn gb-theme-toggle" data-fc-action="theme" aria-label="Тема">` |

Pattern: **theme-toggle**

---

### 6 · `src/components/article-pilots/kod-da-vinchi/KodDaVinchiSectionFaq.astro` — 8 instances

| Line | Tag |
|---|---|
| L12 | `<button class="faq-accordion__q" aria-controls="...faq-a1" aria-expanded="false">` |
| L20 | `<button class="faq-accordion__q" aria-controls="...faq-a2" aria-expanded="false">` |
| L28 | `<button class="faq-accordion__q" aria-controls="...faq-a3" aria-expanded="false">` |
| L36 | `<button class="faq-accordion__q" aria-controls="...faq-a4" aria-expanded="false">` |
| L44 | `<button class="faq-accordion__q" aria-controls="...faq-a5" aria-expanded="false">` |
| L52 | `<button class="faq-accordion__q" aria-controls="...faq-a6" aria-expanded="false">` |
| L60 | `<button class="faq-accordion__q" aria-controls="...faq-a7" aria-expanded="false">` |
| L68 | `<button class="faq-accordion__q" aria-controls="...faq-a8" aria-expanded="false">` |

Pattern: **FAQ accordion**

---

### 7 · `src/components/article-pilots/krajne/KrajneBody.astro` — 3 instances

| Line | Tag |
|---|---|
| L389 | `<button class="faq-accordion__q" aria-controls="...faq-a1" aria-expanded="false">` |
| L398 | `<button class="faq-accordion__q" aria-controls="...faq-a2" aria-expanded="false">` |
| L407 | `<button class="faq-accordion__q" aria-controls="...faq-a3" aria-expanded="false">` |

Pattern: **FAQ accordion** — ⚠️ new, not in partial scan

---

### 8 · `src/components/genealogy/GenealogyTree.tsx` — 9 instances

| Line | Tag |
|---|---|
| L267 | `<button key={l.id} onClick={() => setShowLineage(l.id)} aria-pressed={...}>` (lineage filter, rendered via `.map()`) |
| L269 | `<button onClick={() => setShowGolden(...)} aria-pressed={showGolden} title="Золотая мессианская нить">` |
| L271 | `<button onClick={() => setShowSplit(true)} title="Сравнить Мф/Лк">` |
| L273 | `<button onClick={startTour} title="Тур">` |
| L292 | `<button onClick={() => { setActiveId(null); setSelected(null); }}>` |
| L328 | `<button onClick={tourPrev} disabled={tourIndex === 0} aria-label="Предыдущий">` |
| L330 | `<button onClick={tourNext} disabled={...} aria-label="Следующий">` |
| L331 | `<button onClick={() => { setTourIndex(-1); setSelected(tourPerson); }}>` |
| L332 | `<button onClick={() => setTourIndex(-1)} aria-label="Закрыть тур">` |

Pattern: **genealogy tree interactive controls (TSX)**

---

### 9 · `src/components/hard-texts/HardTextsPageChrome.astro` — 3 instances

| Line | Tag |
|---|---|
| L54 | `<button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">` |
| L58 | `<button class="h-mobile-menu-btn" id="hMobileMenuBtn" aria-label="Открыть меню" aria-expanded="false">` |
| L121 | `<button class="h-scroll-top" id="hScrollTop" aria-label="Наверх">` |

Pattern: **theme-toggle + mobile-menu + scroll-top**

---

### 10 · `src/components/nagornaya/chast-1/NagornayaChast1PageChrome.astro` — 1 instance

| Line | Tag |
|---|---|
| L99 | `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg ...">` |

Pattern: **mobile-menu** (copy-paste cluster)

---

### 11 · `src/components/nagornaya/chast-2/NagornayaChast2PageChrome.astro` — 1 instance

| Line | Tag |
|---|---|
| L99 | `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg ...">` |

Pattern: **mobile-menu** (copy-paste cluster)

---

### 12 · `src/components/nagornaya/chast-3/NagornayaChast3PageChrome.astro` — 1 instance

| Line | Tag |
|---|---|
| L99 | `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg ...">` |

Pattern: **mobile-menu** (copy-paste cluster)

---

### 13 · `src/components/nagornaya/chast-4/NagornayaChast4PageChrome.astro` — 1 instance

| Line | Tag |
|---|---|
| L99 | `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg ...">` |

Pattern: **mobile-menu** (copy-paste cluster)

---

### 14 · `src/components/nagornaya/chast-5/NagornayaChast5PageChrome.astro` — 1 instance

| Line | Tag |
|---|---|
| L99 | `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg ...">` |

Pattern: **mobile-menu** (copy-paste cluster)

---

### 15 · `src/components/nagornaya/index/NagornayaIndexPageChrome.astro` — 1 instance

| Line | Tag |
|---|---|
| L99 | `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg ...">` |

Pattern: **mobile-menu** (copy-paste cluster)

---

### 16 · `src/components/nagornaya/istochniki/NagornayaIstochnikiPageChrome.astro` — 1 instance

| Line | Tag |
|---|---|
| L87 | `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg ...">` |

Pattern: **mobile-menu** (copy-paste cluster)

---

### 17 · `src/components/nagornaya/nakhodki/NagornayaNakhodkiPageChrome.astro` — 1 instance

| Line | Tag |
|---|---|
| L94 | `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg ...">` |

Pattern: **mobile-menu** (copy-paste cluster)

---

### 18 · `src/components/nagornaya/seriya/NagornayaSeriyaBody.astro` — 2 instances

| Line | Tag |
|---|---|
| L33 | `<button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">` |
| L37 | `<button class="h-mobile-menu-btn" id="hMobileMenuBtn" aria-label="Открыть меню" aria-expanded="false">` |

Pattern: **theme-toggle + mobile-menu** — ⚠️ new, not in partial scan (was `NagornayaSeriyaPageChrome` before, this is the Body sibling)

---

### 19 · `src/components/nagornaya/seriya/NagornayaSeriyaPageChrome.astro` — 2 instances

| Line | Tag |
|---|---|
| L30 | `<button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">` |
| L34 | `<button class="h-mobile-menu-btn" id="hMobileMenuBtn" aria-label="Открыть меню" aria-expanded="false">` |

Pattern: **theme-toggle + mobile-menu**

---

### 20 · `src/components/pastor-series/PastorSeriesPageChrome.astro` — 3 instances

| Line | Tag |
|---|---|
| L33 | `<button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">` |
| L37 | `<button class="h-mobile-menu-btn" id="hMobileMenuBtn" aria-label="Открыть меню" aria-expanded="false">` |
| L148 | `<button class="h-scroll-top" id="hScrollTop" aria-label="Наверх">` |

Pattern: **theme-toggle + mobile-menu + scroll-top**

---

## Root cause analysis

| Pattern | Files | Instances | Fix |
|---|---|---|---|
| **theme-toggle** | AboutPageChrome, HardTextsPageChrome, NagornayaSeriyaBody, NagornayaSeriyaPageChrome, PastorSeriesPageChrome, HermenevtikaMobileBar, GillSeriesRail | 7 | Add `type="button"` |
| **mobile-menu-btn** | HardTextsPageChrome, NagornayaChast1–5PageChrome, NagornayaIndexPageChrome, NagornayaIstochnikiPageChrome, NagornayaNakhodkiPageChrome, NagornayaSeriyaBody, NagornayaSeriyaPageChrome, PastorSeriesPageChrome | 11 | Add `type="button"`; NagornayaChrome family is a 7-file copy-paste cluster at the same line — candidate for shared component |
| **scroll-top** | HardTextsPageChrome, PastorSeriesPageChrome | 2 | Add `type="button"` |
| **FAQ accordion** (`faq-accordion__q`) | KodDaVinchiSectionFaq (8), HermenevtikaBody (3), KrajneBody (3) | 14 | Add `type="button"` to all — same class, 3 separate article bodies |
| **Genealogy / other interactive** | GenealogyTree.tsx (9), GillSeriesRail rail actions (share/search), GillPartTocOverlay back-btn | 12 | Add `type="button"` to all |

**Key systemic observation:** The `faq-accordion__q` pattern spans 3 article body components with identical omission. The NagornayaPageChrome mobile-menu button is copy-pasted across 7 files. Both are copy-paste proliferation roots — fixing the source stops recurrence.

---

## Closure criteria for `HTML-BTN-TYPE-MISSING`

- `type="button"` added to all 47 instances listed above.
- Re-run this full 543-file scan at fix anchor; zero hits expected.
- NagornayaChrome consolidation and `faq-accordion__q` component extraction may be tracked as `WORK_QUEUE.md` candidates to prevent re-introduction.

---

## Scope note

Scanned: `src/**/*.astro`, `src/**/*.tsx`, `src/**/*.jsx` — 543 files, no name-based pre-filter.
Not scanned: `js/`, `public/`, `data/`, `_build-tools/`, generated HTML under `articles/`/`baptisty-rossii/` etc. — those are build artifacts or runtime scripts, not source templates.
