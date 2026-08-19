# Evidence — SITEWIDE-BTN-TYPE-AUDIT

## Meta

- Date: 2026-07-17
- Auditor: Arena Agent (arena.ai)
- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Anchor (SHA): cb3681e1a85b5f8919c9dc537f812a842bbe9235
- Scope: all `src/**/*.astro`, `src/**/*.tsx`, `src/**/*.jsx` — 543 files, no name-based pre-filter
- Method: full blob fetch + regex `<button\b([^>]*?)(?:/>|>)` → absent `type=` in captured attributes
- Lane: `SITEWIDE-BTN-TYPE-AUDIT` / `HTML-BTN-TYPE-MISSING`

---

## Summary

| Metric | Value |
|---|---|
| Files scanned | 543 |
| Files with ≥1 `<button>` missing `type=` | **20** |
| Total instances | **47** |

---

## Instance list

### src/components/about/AboutPageChrome.astro (1)
- L204: `<button id="themeToggle" class="theme-toggle" aria-label="Переключить тему">`
- Pattern: theme-toggle

### src/components/article-pilots/gill-series/GillPartTocOverlay.astro (1)
- L44: `<button class="back" id="backToSeries" aria-label="Назад к серии">`
- Pattern: back-navigation

### src/components/article-pilots/gill-series/GillSeriesRail.astro (3)
- L233: `<button class="gbs-rail-foot__btn" data-action="share" aria-label="Поделиться">`
- L251: `<button class="gb-icon gb-theme-toggle" data-fc-action="theme" aria-label="Тема" aria-pressed="false">`
- L255: `<button class="gb-icon" data-fc-action="search" aria-label="Поиск">`
- Pattern: rail actions (share / theme / search)

### src/components/article-pilots/hermenevtika/HermenevtikaBody.astro (3)
- L186: `<button class="faq-accordion__q" aria-controls="...faq-a1" aria-expanded="false">`
- L195: `<button class="faq-accordion__q" aria-controls="...faq-a2" aria-expanded="false">`
- L204: `<button class="faq-accordion__q" aria-controls="...faq-a3" aria-expanded="false">`
- Pattern: FAQ accordion

### src/components/article-pilots/hermenevtika/HermenevtikaMobileBar.astro (1)
- L86: `<button class="hmbar-btn gb-theme-toggle" data-fc-action="theme" aria-label="Тема">`
- Pattern: theme-toggle

### src/components/article-pilots/kod-da-vinchi/KodDaVinchiSectionFaq.astro (8)
- L12: `<button class="faq-accordion__q" aria-controls="...faq-a1" aria-expanded="false">`
- L20: `<button class="faq-accordion__q" aria-controls="...faq-a2" aria-expanded="false">`
- L28: `<button class="faq-accordion__q" aria-controls="...faq-a3" aria-expanded="false">`
- L36: `<button class="faq-accordion__q" aria-controls="...faq-a4" aria-expanded="false">`
- L44: `<button class="faq-accordion__q" aria-controls="...faq-a5" aria-expanded="false">`
- L52: `<button class="faq-accordion__q" aria-controls="...faq-a6" aria-expanded="false">`
- L60: `<button class="faq-accordion__q" aria-controls="...faq-a7" aria-expanded="false">`
- L68: `<button class="faq-accordion__q" aria-controls="...faq-a8" aria-expanded="false">`
- Pattern: FAQ accordion

### src/components/article-pilots/krajne/KrajneBody.astro (3)
- L389: `<button class="faq-accordion__q" aria-controls="...faq-a1" aria-expanded="false">`
- L398: `<button class="faq-accordion__q" aria-controls="...faq-a2" aria-expanded="false">`
- L407: `<button class="faq-accordion__q" aria-controls="...faq-a3" aria-expanded="false">`
- Pattern: FAQ accordion

### src/components/genealogy/GenealogyTree.tsx (9)
- L267: `<button key={l.id} onClick={() => setShowLineage(l.id)} aria-pressed={...}>` (lineage filter, via .map())
- L269: `<button onClick={() => setShowGolden(...)} aria-pressed={showGolden} title="Золотая мессианская нить">`
- L271: `<button onClick={() => setShowSplit(true)} title="Сравнить Мф/Лк">`
- L273: `<button onClick={startTour} title="Тур">`
- L292: `<button onClick={() => { setActiveId(null); setSelected(null); }}>`
- L328: `<button onClick={tourPrev} disabled={tourIndex === 0} aria-label="Предыдущий">`
- L330: `<button onClick={tourNext} disabled={...} aria-label="Следующий">`
- L331: `<button onClick={() => { setTourIndex(-1); setSelected(tourPerson); }}>`
- L332: `<button onClick={() => setTourIndex(-1)} aria-label="Закрыть тур">`
- Pattern: genealogy tree interactive controls (TSX)

### src/components/hard-texts/HardTextsPageChrome.astro (3)
- L54: `<button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">`
- L58: `<button class="h-mobile-menu-btn" id="hMobileMenuBtn" aria-label="Открыть меню" aria-expanded="false">`
- L121: `<button class="h-scroll-top" id="hScrollTop" aria-label="Наверх">`
- Pattern: theme-toggle + mobile-menu + scroll-top

### src/components/nagornaya/chast-1/NagornayaChast1PageChrome.astro (1)
- L99: `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg bg-stone-800 ...">`
- Pattern: mobile-menu (copy-paste cluster)

### src/components/nagornaya/chast-2/NagornayaChast2PageChrome.astro (1)
- L99: `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg bg-stone-800 ...">`
- Pattern: mobile-menu (copy-paste cluster)

### src/components/nagornaya/chast-3/NagornayaChast3PageChrome.astro (1)
- L99: `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg bg-stone-800 ...">`
- Pattern: mobile-menu (copy-paste cluster)

### src/components/nagornaya/chast-4/NagornayaChast4PageChrome.astro (1)
- L99: `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg bg-stone-800 ...">`
- Pattern: mobile-menu (copy-paste cluster)

### src/components/nagornaya/chast-5/NagornayaChast5PageChrome.astro (1)
- L99: `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg bg-stone-800 ...">`
- Pattern: mobile-menu (copy-paste cluster)

### src/components/nagornaya/index/NagornayaIndexPageChrome.astro (1)
- L99: `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg bg-stone-800 ...">`
- Pattern: mobile-menu (copy-paste cluster)

### src/components/nagornaya/istochniki/NagornayaIstochnikiPageChrome.astro (1)
- L87: `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg bg-stone-800 ...">`
- Pattern: mobile-menu (copy-paste cluster)

### src/components/nagornaya/nakhodki/NagornayaNakhodkiPageChrome.astro (1)
- L94: `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg bg-stone-800 ...">`
- Pattern: mobile-menu (copy-paste cluster)

### src/components/nagornaya/seriya/NagornayaSeriyaBody.astro (2)
- L33: `<button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">`
- L37: `<button class="h-mobile-menu-btn" id="hMobileMenuBtn" aria-label="Открыть меню" aria-expanded="false">`
- Pattern: theme-toggle + mobile-menu

### src/components/nagornaya/seriya/NagornayaSeriyaPageChrome.astro (2)
- L30: `<button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">`
- L34: `<button class="h-mobile-menu-btn" id="hMobileMenuBtn" aria-label="Открыть меню" aria-expanded="false">`
- Pattern: theme-toggle + mobile-menu

### src/components/pastor-series/PastorSeriesPageChrome.astro (3)
- L33: `<button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">`
- L37: `<button class="h-mobile-menu-btn" id="hMobileMenuBtn" aria-label="Открыть меню" aria-expanded="false">`
- L148: `<button class="h-scroll-top" id="hScrollTop" aria-label="Наверх">`
- Pattern: theme-toggle + mobile-menu + scroll-top

---

## Pattern breakdown

| Pattern | Files | Instances |
|---|---|---|
| FAQ accordion (`faq-accordion__q`) | 3 | 14 |
| Genealogy controls + rail actions + back-btn | 3 | 12 |
| mobile-menu-btn | 11 | 11 |
| theme-toggle | 7 | 7 |
| scroll-top | 2 | 2 |
| back-navigation | 1 | 1 |
| **Total** | **20** | **47** |

---

## Systemic roots

1. `faq-accordion__q` — same omission in 3 separate article Body components; no shared FAQ component.
2. `NagornayaPageChrome` mobile-menu — copy-pasted across 7 files at the same line number.
3. `GillSeriesRail` + `GillPartTocOverlay` — Gill series rail not caught by name-filter; proof that full scan was necessary.

---

## Closure minimum

Re-run full 543-file scan at fix anchor; zero hits expected.
