# PremiumControls — Канонический контракт v2.1

**Project:** `gb-is-my-strength`  
**Date:** 2026-06-27  
**Replaces:** `Полный план внедрения PremiumControls по всему проекту.pdf` (14 стр, 2026-06), все скриншоты из чата, все предыдущие `floating-cluster` / `PremiumControls` PDF/MD  
**Status:** Phase 1+2 — MERGED в PR #19 (`e204104`), Phase 3 — COMPLETED (`7cbd184a` atomic iOS & visual pass merged)  
**Source repo:** `FedorMilovanov/gb-is-my-strength`  
**Audit folder:** `AuditRepo/projects/gb-is-my-strength/PremiumControls/`

---

## 1. Что такое PremiumControls

Единая маршрутно-типизированная система article-контролов для всего сайта `gospod-bog.ru`.

Три стабильных примитива, НЕ смешивать:

| Примитив | Отвечает за | Файл |
|---|---|---|
| **PremiumControlAnchor** | размещение, геометрия | `src/components/ui/premium-controls/PremiumControlAnchor.astro` |
| **PremiumControls** | SVG / UI / вариант | `src/components/ui/premium-controls/PremiumControls.astro` |
| **premium-controls-controller.js** | поведение | `js/premium-controls-controller.js` (сейчас: `js/floating-cluster-controller.js`) |

Старое имя `floating-cluster` / `fc-*` — transitional. Контроллер переименовывается в Phase 4.

CSS — **один канонический источник**:
`src/styles/premium-controls.css` → build → `public/css/premium-controls.css`

Никаких `<style is:global>` дублей в Astro-кластерах. Current drift (PC-004) закрывается в Phase 4.

---

## 2. PlayEmber — Speed morph — Канон

Референсы: `screenshots/speed-pill-desktop.png`, `screenshots/speed-pill-mobile-gbs.png`

### Desktop / single-anchor / series-lite
```
[ 0.75×  1×  1.25×  1.5×  1.75×  2× ]  [▶]
 ← speed панель расширяется ВЛЕВО из Play круга
 Play остаётся справа внутри пилюли
 Активная скорость — gold fill
 Gold border + backdrop-blur + layered shadow
 Клик вне / Escape / выбор скорости → схлопывание
 После старта: [❙❙] + progress ring 0..1
```

Анимация:
- `clip-path: circle at right edge → inset(0)`
- speed-кнопки cascade in справа-налево, stagger 25ms
- `transition: 260ms cubic-bezier(.2,.8,.2,1)`

### Mobile / GBS / Gill-rail  (< 900px)
Горизонтальная панель, выдвигается **ВВЕРХ** из Play круга (нет места сбоку).
- `clip-path: circle at bottom → inset(0)`
- backdrop-blur 16px, затемнение фона `rgba(0,0,0,.12)`
- те же 0.75×..2× кнопки, wrap если < 360px

ARIA:
- `aria-haspopup="true" aria-expanded="false" aria-controls="gb-ember-speed-{uid}"`
- speed buttons: `role="radio"`, active `aria-checked="true"`
- keyboard: ←/→ скорость, Enter/Space apply, Esc close

Storage:
- **canonical key: `gb:audio:rate`**
- read legacy alias: `gbx-tts-rate`
- dispatch: `gb:tts-rate-change` { rate }

TTS:
- `window.speechSynthesis`, ru-RU
- chunk ≤ 220 chars (Chrome 32k bug workaround)
- start / pause / resume / stop
- live rate change: cancel current utterance, restart same chunk
- progress ring: `--p: 0..1`, `stroke-dashoffset = 113 * (1 - p)`

Fallback:
- if `window.GBAudio.toggle` exists → delegate to it
- if no speechSynthesis → toast "Браузер не поддерживает озвучку" (единственный допустимый тост, НЕ "Озвучка ещё не подключена")

Это закрывает **PC-005**.

---

## 3. Route archetype matrix

| Archetype | Routes | Controls variant | Anchor |
|---|---|---|---|
| **single-anchor** | `hermenevtika`, `kod-da-vinchi`, `antisovetov` | `PremiumControls single` | breadcrumb-level, NOT viewport-fixed |
| **series-lite** | `krajne`, `rimlyanam7` | `PremiumControls series-lite` | `gbs2-rfoot`, `data-fc-mode="series-lite"` |
| **gill-rail** | `gill context`, `gill part 1/2/3`, `gill spravochnik` | `PremiumControls rail + mobile-bottom` | route chrome |
| **series-rich** | `nagornaya chast 1..5`, `baptisty-rossii/*` (10 статей) | GBS2 sheet controls | `data-fc-root` на `gbs2-rfoot` |
| **app / no-controls** | `karty/*`, `/map/`, `/konfessii/russkij-baptizm/`, `/rodosloviye/` | none | — |
| **landing / catalog** | `/`, `/about/`, `/articles/`, `/biografii/`, `/pastor-series/` | none | — |

Правило: **no PremiumControls unless explicitly approved in this matrix.**

Аудит: `scripts/premium-controls-rollout-audit.js`
- allowed routes have expected root
- forbidden routes have 0× `gb-ember` / `gb-save`
- every visible `[data-fc-action]` inside `[data-fc-root]` / `[data-fc-controls]`
- no stale hardcoded asset hashes

Это закрывает **PC-006**.

---

## 4. Текущее состояние (2026-06-26, PR #19 e204104)

### Закрыто в PR #19
- BUG-A1..A4 (P0): кириллица, Ishod JSON-LD, SeriesLite dual-prefix, baptisty/nagornaya `data-fc-root` в **dist**
- BUG-A5/A6/A8/S1 (P1): migration matrix, BreadcrumbList, gtip id, deploy.yml JSON-LD guard
- BUG-B3/B5/S3 (P2): AGENTS rev, series.json, .gitconfig
- BUG-A7/A9/B6/S6: baptisty OG webp, avraam map contract, cleanup dead JS modules
- **TTS Phase 1+2**: реальный `speechSynthesis`, chunk 220, progress ring 0..1 fix, mobile viewport guard, Safari z-index fix

### Открыто — PremiumControls PC-001..PC-006

| ID | Severity | Title | Status in PR #19 |
|---|---|---|---|
| **PC-001** | P1 | `PremiumControlAnchor` отсутствует; controls = `position:fixed` | ❌ OPEN |
| **PC-002** | P0 | Heart-series `Krajne` / `Rimlyanam7`: `gb-ember`+`gb-save` без `[data-fc-root]` | ❌ OPEN — src 0× root, dist-патч в PR #19 не попал в src |
| **PC-003** | P1 | Source hash drift: `ba4a4019` / `efd81d3a` / `58c2ea90` | ❌ OPEN |
| **PC-004** | P1 | CSS дубль: 3× Astro `<style is:global>` + `css/floating-cluster.css` 69KB | ❌ OPEN |
| **PC-005** | P2 | PlayEmber semantics: ключ `gbx-tts-rate` ≠ `gb:audio:rate`, был тост «Озвучка ещё не подключена» | ⚠️ PARTIAL — TTS реальный, тост убран, **ключ остался `gbx-tts-rate`** |
| **PC-006** | P2 | Нет route-archetype lock / audit | ❌ OPEN |

Speed-morph UI с референс-скринов (золотая пилюля, Play справа, pause+ring) — **не реализован**. В PR #19 — старый v16 popover + mobile guard.

---

## 5. Phase 3 — repair order (current)

Branch: `lane/premiumcontrols-phase3-2026-06-26`  
Base: PR #19 `e204104`

1. **PC-002 — Heart-series wiring** — P0
   - `src/components/article-pilots/krajne/KrajneBody.astro`
   - `src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro`
   - Wrap `gbs2-rfoot` control cluster: `data-fc-root data-fc-mode="series-lite" data-fc-variant="heart"`
   - Verify: Play opens speed panel, Save toggles

2. **PC-005 — PlayEmber semantics**
   - `js/floating-cluster-controller.js`
   - storage: `gb:audio:rate` canonical, read `gbx-tts-rate` alias
   - dispatch: `gb:tts-rate-change`
   - remove any remaining "Озвучка ещё не подключена" idle toast
   - ARIA: `aria-haspopup/aria-expanded/aria-controls` coherent

3. **PC-003 — Asset hash unification**
   - Create `src/lib/asset-version.js` or Astro component helper
   - Remove hardcoded `?v=xxx` from 36 Astro PageHead components
   - `cache-bust.js` remains safety net, NOT primary truth

4. **Speed-morph UI — reference implementation**
   - `css/floating-cluster.css` / `src/styles/premium-controls.css`
   - Desktop: pill expands LEFT from Play circle
   - Mobile/GBS: pill expands UP, blur backdrop
   - Pause + progress ring
   - Matches `screenshots/speed-pill-desktop.png` + `speed-pill-mobile-gbs.png`

5. **PC-001 / PC-004 — Anchor + canonical CSS**
   - `PremiumControlAnchor.astro`
   - `src/styles/premium-controls.css` — single source
   - Remove `.gb-*` duplicates from `SingleArticleCluster`, `SeriesLiteCluster`, `GillRailControls`
   - Desktop single-anchor: control at breadcrumb-level, top delta ≤ 8px

6. **PC-006 — Route audit**
   - `scripts/premium-controls-rollout-audit.js`
   - CI gate: `npm run audit:premium-controls`

7. **Workflows**
   - `.github/workflows/deploy.yml`: `permissions: contents: write`, `checkout token: ${{ secrets.ARENA_AGENT }}`
   - `.github/workflows/indexnow.yml`: same
   - Close stale branches, green CI

---

## 6. Файлы в этом каталоге

```
PremiumControls/
├── README.md                      # этот файл — канон
├── ROADMAP.md                     # PC-001..PC-006 чеклист
├── spec/
│   └── playember-speed-morph.md  # детальная спека UI по скриншотам
├── screenshots/
│   ├── speed-pill-desktop.png    # 0.75×..2×, Play справа, gold pill
│   └── speed-pill-mobile-gbs.png # mobile / GBS blur-up variant
├── references/
│   ├── plan-premiumcontrols-full.pdf      # исходный PDF
│   ├── plan-premiumcontrols-full.txt      # extracted text
│   └── gb-floating-cluster-probe-v16.html # v16 probe
└── patches/
    └── APPLIED-2026-06-26.md     # что вошло в PR #19
```

Новые агенты: читайте **только** `README.md` + `spec/playember-speed-morph.md`. Старый PDF — архив.

---

## 7. Acceptance — site-wide

- Hermeneutics / Kod da Vinci / Antisovetov desktop+mobile: PlayEmber → speed pill, Save toggles, theme/search click
- Krajne / Rimlyanam7 desktop+mobile: same, controls alive (PC-002)
- Gill context / part 1/2/3 desktop+mobile: rail + bottom bar, no duplicate IDs
- Nagornaya 1..5 / Baptisty 10 статей: GBS2 controls wired, TOC populated
- All `[data-fc-action]` clickable, no dead controls
- No duplicate old TTS / FAB
- `npm run validate:all` green
- `npm run audit:premium-controls` green
- Visual parity: speed pill matches reference screenshots

---

**Canonical source of truth for PremiumControls. Do not use chat screenshots or old PDF. Link agents here: `AuditRepo/projects/gb-is-my-strength/PremiumControls/README.md`**
