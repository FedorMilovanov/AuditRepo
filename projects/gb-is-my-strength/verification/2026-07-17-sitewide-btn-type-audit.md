# SITEWIDE-BTN-TYPE-AUDIT — gb-is-my-strength

## Meta

- Date: 2026-07-17
- Auditor: Arena Agent (arena.ai)
- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Audited anchor (SHA): cb3681e1a85b5f8919c9dc537f812a842bbe9235
- Scope: all `src/**/*.astro` and `src/**/*.tsx` files (543 files scanned)
- Scan method: full blob fetch + regex `<button\b([^>]*?)(?:/>|>)` → check for absence of `type=` in matched attributes
- Lane: `SITEWIDE-BTN-TYPE-AUDIT` (system verification lane from MASTER)

---

## Result summary

| Metric | Value |
|---|---|
| Files scanned | 543 |
| Files with ≥1 `<button>` missing `type=` | **15** |
| Total `<button>` instances missing `type=` | **35** |
| Pattern clusters | 4 (theme-toggle, mobile-menu-btn, scroll-top, FAQ accordion, genealogy controls) |

---

## Complete instance list (anchor cb3681e)

### FILE 1 — `src/components/about/AboutPageChrome.astro` (1 instance)

| Line | Tag |
|---|---|
| L204 | `<button id="themeToggle" class="theme-toggle" aria-label="Переключить тему">` |

**Pattern:** theme-toggle

---

### FILE 2 — `src/components/article-pilots/hermenevtika/HermenevtikaMobileBar.astro` (1 instance)

| Line | Tag |
|---|---|
| L86 | `<button class="hmbar-btn gb-theme-toggle" data-fc-action="theme" aria-label="Тема">` |

**Pattern:** theme-toggle

---

### FILE 3 — `src/components/article-pilots/kod-da-vinchi/KodDaVinchiSectionFaq.astro` (8 instances)

| Line | Tag (truncated) |
|---|---|
| L12 | `<button aria-expanded="false" class="faq-accordion__q" aria-controls="...faq-a1" id="...faq-q1">` |
| L20 | `<button aria-expanded="false" class="faq-accordion__q" aria-controls="...faq-a2" id="...faq-q2">` |
| L28 | `<button aria-expanded="false" class="faq-accordion__q" aria-controls="...faq-a3" id="...faq-q3">` |
| L36 | `<button aria-expanded="false" class="faq-accordion__q" aria-controls="...faq-a4" id="...faq-q4">` |
| L44 | `<button aria-expanded="false" class="faq-accordion__q" aria-controls="...faq-a5" id="...faq-q5">` |
| L52 | `<button aria-expanded="false" class="faq-accordion__q" aria-controls="...faq-a6" id="...faq-q6">` |
| L60 | `<button aria-expanded="false" class="faq-accordion__q" aria-controls="...faq-a7" id="...faq-q7">` |
| L68 | `<button aria-expanded="false" class="faq-accordion__q" aria-controls="...faq-a8" id="...faq-q8">` |

**Pattern:** FAQ accordion toggle (all 8 are the same pattern — systematic omission in this component)

---

### FILE 4 — `src/components/genealogy/GenealogyTree.tsx` (9 instances)

| Line | Tag (truncated) |
|---|---|
| L267 | `<button key={l.id} onClick={() => setShowLineage(l.id)} aria-pressed={...}>` (lineage filter, rendered via `.map()`) |
| L269 | `<button onClick={() => setShowGolden(...)} aria-pressed={showGolden} title="Золотая мессианская нить">` |
| L271 | `<button onClick={() => setShowSplit(true)} title="Сравнить Мф/Лк">` |
| L273 | `<button onClick={startTour} title="Тур">` |
| L292 | `<button onClick={() => { setActiveId(null); setSelected(null); }}>` (deselect/close) |
| L328 | `<button onClick={tourPrev} disabled={tourIndex === 0} aria-label="Предыдущий">` |
| L330 | `<button onClick={tourNext} disabled={...} aria-label="Следующий">` |
| L331 | `<button onClick={() => { setTourIndex(-1); setSelected(tourPerson); }}>` |
| L332 | `<button onClick={() => setTourIndex(-1)} aria-label="Закрыть тур">` |

**Pattern:** interactive genealogy tree controls — all programmatic action buttons (no form context, but type omission is a conformance defect)

---

### FILE 5 — `src/components/hard-texts/HardTextsPageChrome.astro` (3 instances)

| Line | Tag |
|---|---|
| L54 | `<button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">` |
| L58 | `<button class="h-mobile-menu-btn" id="hMobileMenuBtn" aria-label="Открыть меню" aria-expanded="false">` |
| L121 | `<button class="h-scroll-top" id="hScrollTop" aria-label="Наверх">` |

**Pattern:** theme-toggle + mobile-menu + scroll-top

---

### FILE 6 — `src/components/nagornaya/chast-1/NagornayaChast1PageChrome.astro` (1 instance)

| Line | Tag |
|---|---|
| L99 | `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg ...">` |

**Pattern:** mobile-menu-btn

---

### FILE 7 — `src/components/nagornaya/chast-2/NagornayaChast2PageChrome.astro` (1 instance)

| Line | Tag |
|---|---|
| L99 | `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg ...">` |

**Pattern:** mobile-menu-btn (identical to chast-1, copy-paste)

---

### FILE 8 — `src/components/nagornaya/chast-3/NagornayaChast3PageChrome.astro` (1 instance)

| Line | Tag |
|---|---|
| L99 | `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg ...">` |

**Pattern:** mobile-menu-btn (copy-paste)

---

### FILE 9 — `src/components/nagornaya/chast-4/NagornayaChast4PageChrome.astro` (1 instance)

| Line | Tag |
|---|---|
| L99 | `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg ...">` |

**Pattern:** mobile-menu-btn (copy-paste)

---

### FILE 10 — `src/components/nagornaya/chast-5/NagornayaChast5PageChrome.astro` (1 instance)

| Line | Tag |
|---|---|
| L99 | `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg ...">` |

**Pattern:** mobile-menu-btn (copy-paste)

---

### FILE 11 — `src/components/nagornaya/index/NagornayaIndexPageChrome.astro` (1 instance)

| Line | Tag |
|---|---|
| L99 | `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg ...">` |

**Pattern:** mobile-menu-btn (copy-paste)

---

### FILE 12 — `src/components/nagornaya/istochniki/NagornayaIstochnikiPageChrome.astro` (1 instance)

| Line | Tag |
|---|---|
| L87 | `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg ...">` |

**Pattern:** mobile-menu-btn (copy-paste)

---

### FILE 13 — `src/components/nagornaya/nakhodki/NagornayaNakhodkiPageChrome.astro` (1 instance)

| Line | Tag |
|---|---|
| L94 | `<button id="menuBtn" aria-label="Открыть меню" aria-controls="mobileMenu" aria-expanded="false" class="p-2 rounded-lg ...">` |

**Pattern:** mobile-menu-btn (copy-paste)

---

### FILE 14 — `src/components/nagornaya/seriya/NagornayaSeriyaPageChrome.astro` (2 instances)

| Line | Tag |
|---|---|
| L30 | `<button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">` |
| L34 | `<button class="h-mobile-menu-btn" id="hMobileMenuBtn" aria-label="Открыть меню" aria-expanded="false">` |

**Pattern:** theme-toggle + mobile-menu-btn

---

### FILE 15 — `src/components/pastor-series/PastorSeriesPageChrome.astro` (3 instances)

| Line | Tag |
|---|---|
| L33 | `<button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">` |
| L37 | `<button class="h-mobile-menu-btn" id="hMobileMenuBtn" aria-label="Открыть меню" aria-expanded="false">` |
| L148 | `<button class="h-scroll-top" id="hScrollTop" aria-label="Наверх">` |

**Pattern:** theme-toggle + mobile-menu-btn + scroll-top

---

## Root cause analysis

The 35 instances collapse into **4 distinct root patterns**:

| Root pattern | Files affected | Instances | Fix |
|---|---|---|---|
| **theme-toggle** (`id="themeToggle"`, `class="theme-toggle"`) | AboutPageChrome, HardTextsPageChrome, NagornayaSeriyaPageChrome, PastorSeriesPageChrome, HermenevtikaMobileBar | 5 | Add `type="button"` to each |
| **mobile-menu-btn** (`id="menuBtn"` / `class="h-mobile-menu-btn"`) | HardTextsPageChrome, NagornayaChast1–5PageChrome, NagornayaIndexPageChrome, NagornayaIstochnikiPageChrome, NagornayaNakhodkiPageChrome, NagornayaSeriyaPageChrome, PastorSeriesPageChrome | 10 | Add `type="button"`; the NagornayaChrome family is a copy-paste cluster — one shared component would eliminate recurrence |
| **scroll-top** (`id="hScrollTop"`, `class="h-scroll-top"`) | HardTextsPageChrome, PastorSeriesPageChrome | 2 | Add `type="button"` |
| **FAQ accordion** (`class="faq-accordion__q"`) | KodDaVinchiSectionFaq | 8 | Add `type="button"` to all 8 triggers |
| **GenealogyTree controls** (React TSX) | GenealogyTree.tsx | 9 | Add `type="button"` to all interactive `<button>` elements (none are inside a `<form>`) |

**Systemic cause:** The NagornayaPageChrome family (6 files, identical pattern at the same line number) is a copy-paste of a single chrome shell without a shared component. Each copy propagated the missing `type=`. A refactor to a shared `NagornayaChrome` component would prevent future recurrence.

---

## Closure criteria for `HTML-BTN-TYPE-MISSING`

- `type="button"` added to all 35 instances above.
- No `<button>` without explicit `type=` remains in `src/**/*.astro` and `src/**/*.tsx` (re-run this scan at fix anchor).
- NagornayaChrome copy-paste cluster may be tracked as a separate refactor candidate in `WORK_QUEUE.md`.

---

## Evidence preservation

This report is anchored to `cb3681e`. Do not update merely because Product moves.
Future agents must re-run the scan at their anchor before assuming the list is current.
