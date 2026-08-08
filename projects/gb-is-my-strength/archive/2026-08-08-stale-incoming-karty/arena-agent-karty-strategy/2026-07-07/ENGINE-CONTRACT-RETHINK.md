# Engine Contract Rethink — для Phase 2

**Status:** `proposal-open` (дизайн-документ, не код)
**Зависимость:** Phase 2 STRATEGY.md
**Цель:** определить, что engine v2.0 ДОЛЖЕН делать и НЕ ДЕЛАТЬ, **до** написания кода

---

## 0. Зачем переосмыслять

Текущий `map-engine.js` v0.52.0 (2634 строки, 171KB) — это **universal engine для тонких карт**. У него 14 публичных API + `createMap`. Но он:

- Не имеет дизайн-системы (CSS inline-injected, не tokens)
- Не имеет чёткой границы "engine vs route-specific" (Авраам не знает, что именно ему можно)
- Не имеет A11Y contract (A11Y встроена, но не задокументирована как API)
- Не имеет perf budget (растёт свободно)
- Не имеет extension points (Авраам monkey-patches через `window.MapEngine?`)

**Результат:** каждый route.js вынужден "лезть внутрь" engine через optional chain + fallback. Это создало 70 addEventListener без cleanup в avraam-app.js.

**Engine v2.0 должен:** иметь **чёткий contract**, в который route.js **не может** лезть, и **чёткие extension points** для route-specific.

---

## 1. Что engine v2.0 ДЕЛАЕТ (обязательно)

### 1.1. Данные
- `MapEngine.loadRoute(url) → Promise<Route>` (как сейчас, OK)
- `MapEngine.validateRoute(route) → {ok, errors, warnings}` (как сейчас, OK, + добавить в CI)
- `MapEngine.compareRouteData(a, b)` (как сейчас, OK)

### 1.2. Карта (rendering)
- `MapEngine.createMap(container, route, options) → MapInstance` (как сейчас, OK)
- Поддержка SVG (только, не canvas)
- Pinch-zoom, pan, click, double-click, long-press (как сейчас, OK)
- Touch + mouse + keyboard (как сейчас, OK, но см. A11Y §3)

### 1.3. Layers
- `route.layers` — массив слоёв (как сейчас, OK)
- Engine рендерит: маркеры, пути этапов, waypoints, signature, context — **по контракту** (не по hardcoded ID)
- Route может добавить **свой** слой через `opts.layers` (как сейчас, OK)

### 1.4. Panel
- Tabs: story, bible, arch, he, dispute, sci, photos, extra (как сейчас, OK)
- Auto-detection доступных табов (как сейчас, OK)
- Related places (как сейчас, OK)
- Photo modal + swipe + click-to-enlarge (как сейчас, OK)

### 1.5. Tour
- `startTour() / stopTour() / nextPlace() / prevPlace()` (как сейчас, OK)
- Caption bar (как сейчас, OK)
- Speed control (как сейчас, OK)

### 1.6. Story mode
- `setStory(storyId)` (как сейчас, OK)
- Auto-fly + auto-open (как сейчас, OK)
- Story toast (как сейчас, OK)

### 1.7. Search
- `MapEngine.createMap` принимает `opts.enableSearch: true` (default: true)
- Встроенный search в header (как сейчас, OK)

### 1.8. Theme
- `opts.theme = 'dark' | 'light' | 'auto'` (default: 'auto')
- Встроенный toggle (как сейчас, OK)

### 1.9. Share
- `opts.enableShare: true` (default: true)
- Web Share API + clipboard fallback (как сейчас, OK)

### 1.10. Deep-link
- `?story=X&place=Y` (как сейчас, OK)
- `?place=X&zoom=2` (новое — explicit zoom для sharing)
- `?place=X&story=Y&view=panel|map` (новое — explicit view mode)

---

## 2. Что engine v2.0 ДЕЛАЕТ (новое, чего нет сейчас)

### 2.1. Design system tokens
```js
// engine exposes:
MapEngine.tokens = {
  color: { gold: '#e8c879', bg: { dark: '#070a10', light: '#f5f0e8' }, ... },
  font: { serif: 'Georgia, ...', sans: 'system-ui, ...' },
  spacing: { xs: 4, sm: 8, md: 16, ... },
  radius: { sm: 4, md: 8, lg: 16 },
  shadow: { sm: '...', md: '...' },
  motion: { fast: 150, base: 300, slow: 600, ease: 'cubic-bezier(.4,0,.2,1)' },
}
```

Route.js может использовать (но не обязан):
```js
instance.element.style.background = MapEngine.tokens.color.bg.dark;
```

### 2.2. A11Y contract
- Engine обеспечивает: keyboard nav, focus trap, ARIA labels, screen reader announcements, reduced motion respect
- Engine **НЕ** делает: визуальный текст (это контент route)
- Engine **НЕ** делает: расшифровку фото (это alt text в route.json)

### 2.3. Performance contract
- Engine bundle budget: **< 30KB gzipped** (сейчас 171KB raw = ~50KB gzipped — нужно сократить)
- Engine CSS: **< 5KB gzipped**, отдельным файлом
- FCP: < 1s на 4G mobile
- LCP: < 2.5s
- INP: < 200ms
- TBT: < 200ms
- Lighthouse Performance: 95+ mobile + desktop

### 2.4. Extension points (а не monkey-patches)
Engine **не** позволяет route.js делать `window.MapEngine?`. Вместо этого:

```js
// engine v2.0: explicit extension
const instance = MapEngine.createMap(container, route, {
  hooks: {
    beforeRenderPlace: (place, ctx) => { /* return modified place */ },
    afterRenderPanel: (panel, place) => { /* append custom content */ },
    onStoryChange: (storyId) => { /* telemetry */ },
    onTourStep: (step) => { /* custom step logic */ },
  },
  components: {
    placeMarker: MyCustomMarker,   // route-specific marker
    panelHeader: MyCustomHeader,  // route-specific header
    ambientPlayer: MyWalker,      // route-specific (Авраам's караван)
  },
});
```

Это **6 hooks + 6 components** — фиксированный, задокументированный, типобезопасный. Никаких monkey-patches.

### 2.5. Cleanup contract
- `instance.destroy()` — полная очистка: listeners, timers, DOM, CSS, RAF
- Engine **гарантирует**, что после `destroy()` нет утечек (Lighthouse + memory heap snapshot)
- Route.js **не** добавляет listener'ы вне `hooks` (невозможно технически)

### 2.6. SSR-safe
- Engine не падает, если DOM ещё не готов (`document.readyState === 'loading'`)
- Engine не падает, если загружен в Node.js (для build-time валидации route.json)
- Engine не падает, если SVG API недоступен (для text-only fallback)

---

## 3. Что engine v2.0 НЕ ДЕЛАЕТ (anti-engine manifesto)

Зафиксировано в `STRATEGY.md` §4.2.6. Краткий список:

1. **Не строит SPA shell.** Авраам = одна страница. Не часть app.
2. **Не строит reactivity.** Vanilla DOM. Не Preact, не Vue, не Alpine.
3. **Не строит canvas-based рендеринг.** Только SVG.
4. **Не строит 3D.** Никакого WebGL, Three.js.
5. **Не строит service worker.** SW = ответственность владельца, не engine.
6. **Не строит offline-first.** Это future work, не сейчас.
7. **Не строит analytics / telemetry.** Если нужно — отдельный layer.
8. **Не строит auth / comments / social.** Это future work.
9. **Не строит i18n.** Только русский. (i18n = future, после v2.0.)
10. **Не строит print stylesheet.** (Future.)

---

## 4. Что route-specific (НЕ в engine)

Сейчас в avraam-app.js есть функции, которые **не** должны быть в engine:

### 4.1. Abraham-specific
- `createAbrahamWalker` — анимация каравана (Авраам + Сара + Лот идут по пути)
- `clearCaravanArtifacts` — очистка каравана при смене этапа
- `spawnCaravan` — спавн каравана
- `changeAmbientChord` — музыка по этапу (Desert / Egypt / Mountain)
- `buildAmbient` — инициализация аудио
- `getCurrentPlaceOrder` — Авраам-specific order (отличается от engine's getPlaceOrder)
- `lifeGo` / `showLife` — life timeline
- `setDim` — затемнение по этапу

**В engine v2.0:** `components.ambientPlayer` и `components.placeMarker` — route.js реализует.

### 4.2. Generic (должны быть в engine)
- `applyLayers` → engine встроенный
- `applyStory` → engine встроенный
- `applyView` → engine встроенный
- `flyTo` → engine встроенный (но, как `instance.flyTo(...)`)
- `haptic` → engine встроенный
- `drawMeasure` / `endMeasure` / `measureClick` / `startMeasure` → engine встроенный
- `setTab` / `closePanel` / `openPhotoModal` → engine встроенный
- `openSearch` / `closeSearch` / `renderSearch` → engine встроенный
- `showCaption` → engine встроенный
- `dismissIntro` → engine встроенный (через `opts.showIntro`)
- `buildMinimap` → engine встроенный (через `opts.showMinimap`)

---

## 5. Bundle budget (конкретно)

| Resource | Current (v0.52.0 + avraam-app.js) | Target v2.0 | Reduction |
|----------|----------------------------------|-------------|-----------|
| Engine JS | 171KB raw / ~50KB gz | 30KB gz | -40% |
| Engine CSS | 8KB inline (in JS) | 5KB gz external | -37% (but cacheable) |
| Avraam JS | 247KB raw | 5-10KB gz | -96% |
| Avraam CSS | inline | 0 (use engine tokens) | -100% |
| **Total karty/avraam/** | **~430KB** | **~50KB** | **-88%** |
| GSAP + plugins | ~200KB | 0 (native) | -100% |
| **Total with deps** | **~630KB** | **~50KB** | **-92%** |

**Ожидаемый Lighthouse:**
- Current: 60-70 (hypothesis, не измерял)
- Target: 95+

---

## 6. Schema v2.0 (route.json)

Текущая `karty/_shared/route.schema.json` описывает 8 полей. Нужно расширить (см. KARTY-09 из предыдущего intake). Schema v2.0 должна:

```json
{
  "required": ["meta", "places", "stages", "stories"],
  "properties": {
    "meta": {
      "required": ["id", "title"],
      "properties": {
        "id": "string (kebab-case, unique)",
        "title": "string (human-readable, ru)",
        "title_he": "string? (Hebrew, RTL)",
        "subtitle": "string?",
        "era": "string? (chronological scope)",
        "version": "string? (semver of this route.json)",
        "generated": "string? (ISO date)",
        "stats": {
          "places": "number?",
          "stages": "number?",
          "stories": "number?"
        },
        "viewport_init": {
          "cx": "number",
          "cy": "number",
          "w": "number"
        },
        "coord_system": {
          "viewBox": "string? (e.g. '0 0 1900 1430')"
        }
      }
    },
    "places": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["id", "name", "x", "y"],
        "properties": {
          "id": "string (kebab-case, unique within route)",
          "name": "string (ru)",
          "name_he": "string? (Hebrew, RTL)",
          "x": "number",
          "y": "number",
          "type": "enum: settlement | journey | battle | event | marker | cand",
          "stage": "number (0-indexed)",
          "story": "string? (story id)",
          "arch_category": "string? (id из route.arch_references)",
          "kick": "string? (краткое описание для marker label)",
          "id1": "string? (например, «Телль эль-Мукайяр»)",
          "id2": "string? (например, «Ирак, Нижняя Месопотамия»)",
          "ep1": "string? (библ. ссылка)",
          "ep2": "string? (краткая библ. фраза)",
          "side": "enum: l | r | t | b (сторона label)",
          "story_content": "string? (HTML)",
          "bible": "string? (HTML, дословно Синодальный)",
          "arch": "string? (HTML, 2024-2026 archaeology)",
          "he_deep": "string? (HTML, иврит + транслитерация + этимология)",
          "dispute": "string? (HTML, богословский/исторический спор)",
          "bible_extra": "string? (HTML)",
          "sci": "string? (variant)",
          "photos": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["src"],
              "properties": {
                "src": "string (URL)",
                "thumb": "string? (URL)",
                "label": "string?",
                "credit": "string?",
                "alt": "string? (a11y, required if not label)"
              }
            }
          },
          "related": {
            "type": "array",
            "items": "string (place id)"
          }
        }
      }
    },
    "stages": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["n", "t"],
        "properties": {
          "n": "string (short label, e.g. 'I')",
          "t": "string (full title, e.g. 'Ур → Харран')",
          "r": "string? (description)",
          "km": "string? (e.g. '~1000 км')",
          "age": "string? (e.g. 'АВРАМУ ~70 ЛЕТ')",
          "d": "string? (detailed description)",
          "cam": {
            "type": "array",
            "items": "number",
            "minItems": 3,
            "maxItems": 3
          },
          "paths": {
            "type": "array",
            "items": { "type": "object" }
          }
        }
      }
    },
    "stories": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["id", "label"],
        "properties": {
          "id": "string (kebab-case, unique within route)",
          "label": "string (human-readable)",
          "desc": "string?",
          "place_ids": "string[]?",
          "stage_ids": "number[]?",
          "cam": { "type": "array", "items": "number" }
        }
      }
    },
    "ctx": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["x", "y"],
        "properties": {
          "x": "number",
          "y": "number",
          "name": "string?",
          "label": "string?",
          "src": "string? (image URL)"
        }
      }
    },
    "layers": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id"],
        "properties": {
          "id": "string (kebab-case)",
          "label": "string?",
          "color": "string? (hex or CSS)",
          "on": "boolean? (default: true)",
          "selector": "string? (CSS selector for this layer's elements)",
          "pathSelector": "string? (CSS selector for path)"
        }
      }
    },
    "signature": {
      "type": "object",
      "properties": {
        "type": "enum: lampstands | water-split | sea-voyage | hanukkah-lights | split-kingdom | judge-cycles | tribe-stars | ministry-light | gospel-waves",
        "label": "string?",
        "description": "string?",
        "place_ids": "string[]?",
        "north_ids": "string[]?",
        "south_ids": "string[]?",
        "origin": "string? (place id)",
        "origin_id": "string? (deprecated alias)",
        "divide": "string? (path data for split-kingdom)"
      }
    },
    "timeline": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["era", "label"],
        "properties": {
          "era": "string",
          "label": "string",
          "stage": "number?",
          "color": "string? (hex)"
        }
      }
    },
    "verified_waypoints": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["x", "y"],
        "properties": {
          "x": "number",
          "y": "number",
          "name": "string?"
        }
      }
    },
    "scientific_variants": {
      "type": "object",
      "additionalProperties": {
        "type": "array",
        "items": { "type": "object" }
      }
    },
    "arch_references": {
      "type": "object",
      "description": "Археологические реестры (источники 2024-2026) для place.arch_category",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "title": "string",
          "items": {
            "type": "array",
            "items": { "type": "object" }
          }
        }
      }
    },
    "sources": {
      "type": "object",
      "description": "Машиночитаемый реестр внешних референсов-атласов (BiblePlaces, ANET, NPAPH, и т.д.)",
      "properties": {
        "primary": "string[]",
        "field": "string[]",
        "academic": "string[]",
        "conservative": "string[]",
        "heritage": "string[]"
      }
    }
  }
}
```

**Изменения vs schema v1.0:**
- 8 полей → 13 полей
- `signature`, `timeline`, `layers`, `verified_waypoints`, `scientific_variants` — описаны подробно (были placeholder)
- Новые: `arch_references`, `sources`
- `place.arch_category` (новое) — contract для archaeology
- `place.bible_extra` уже был

**Валидация:** ajv-компилируемая schema, прогоняется в `scripts/check-karty-routes.js` (KARTY-10).

---

## 7. API v2.0 (signature)

```typescript
// engine v2.0 public API

interface MapEngineStatic {
  loadRoute(url: string, opts?: { credentials?, headers? }): Promise<Route>;
  validateRoute(route: object): { ok: boolean; errors: string[]; warnings: string[]; stats: object };
  compareRouteData(a: object, b: object): { ok: boolean; errors: string[] };
  normalizeRouteData(data: object): Route;
  collectPhotoHosts(route: object): string[];
  
  tokens: DesignTokens;
  
  createMap(container: HTMLElement, route: Route, options: CreateMapOptions): MapInstance;
  destroyAll(): void; // for testing
}

interface CreateMapOptions {
  theme?: 'dark' | 'light' | 'auto';
  backUrl?: string;
  showIntro?: boolean;
  showCompass?: boolean;
  showMinimap?: boolean;
  showHints?: boolean;
  showSearch?: boolean;
  showShare?: boolean;
  showLayers?: boolean;
  showTimeline?: boolean;
  showLifeTimeline?: boolean;
  enableTour?: boolean;
  enableMeasure?: boolean;
  enableKeyboard?: boolean; // default true
  baseGeoUrl?: string;
  
  hooks?: {
    beforeRenderPlace?: (place: Place, ctx: RenderContext) => Place | void;
    afterRenderPanel?: (panel: HTMLElement, place: Place) => void;
    beforeShowPlace?: (place: Place) => boolean | void; // return false to cancel
    onStoryChange?: (storyId: string) => void;
    onTourStep?: (step: TourStep) => void;
    onPanelTabChange?: (place: Place, tab: string) => void;
  };
  
  components?: {
    placeMarker?: (place: Place, ctx: RenderContext) => SVGGElement;
    panelHeader?: (place: Place) => HTMLElement;
    ambientPlayer?: (stage: Stage) => void;  // Abraham uses for caravan
    tourCaption?: (stage: Stage) => string;
  };
}

interface MapInstance {
  // state
  getState(): { place: string | null; story: string; view: View };
  setState(s: Partial<State>): void;
  
  // navigation
  openPlace(id: string): void;
  closePanel(): void;
  setStory(storyId: string): void;
  flyTo(cx: number, cy: number, w: number, duration?: number): void;
  resetView(): void;
  
  // tour
  startTour(): void;
  stopTour(): void;
  nextPlace(): void;
  prevPlace(): void;
  setTourSpeed(ms: number): void;
  
  // layers
  toggleLayer(id: string, on?: boolean): void;
  
  // lifecycle
  destroy(): void;
  
  // read-only
  readonly route: Route;
  readonly container: HTMLElement;
}
```

**Что исчезло из v0.52.0:**
- `getPlaceIndex`, `getPlaceById`, `getStageForPlace`, `getRelatedPlaceIds`, `getTabContentKey`, `getPanelModel`, `getPanelSections`, `getStoryViewport`, `getStoryState`, `getPlaceOrder`, `auditStoryDefinitions` — **внутренние helpers**, не часть public API. (Они переезжают в `engine.internal` namespace, доступный только engine'у.)
- `window.MapEngine` — **больше не global**. ES module export.

**Что добавлено:**
- `MapEngine.tokens` (design system)
- `hooks` (5 событий)
- `components` (4 точки расширения)
- `getState` / `setState`
- `toggleLayer`
- `setTourSpeed`
- `destroyAll` (для testing)

---

## 8. Migration plan из v0.52.0

| v0.52.0 | v2.0 | Сложность |
|---------|------|-----------|
| `karty/_engine/map-engine.js` (2634 строки) | `karty/_engine/map-engine.js` (~800 строк) | REWRITE |
| Inline CSS (8KB) | `karty/_engine/map-engine.css` (5KB) | EXTRACT |
| `window.MapEngine` global | ES module export | BREAK (Авраам переписывается) |
| `karty/avraam/avraam-app.js` (2407 строк) | `karty/avraam/avraam.js` (~400 строк) | REWRITE |
| GSAP + DrawSVG + MotionPath (~200KB) | 0 | DELETE |
| `karty/avraam/base.svg` (72KB) | `karty/_engine/base-geo.svg` (34KB) | REUSE |
| `karty/ishod/index.html` (68 строк) | `karty/ishod/index.html` (78 строк, +opts) | UPDATE |
| 8 placeholder karty-маршрутов | UNCHANGED (frozen) | NONE |
| `karty/_shared/route.schema.json` (108 строк, 8 полей) | `karty/_shared/route.schema.json` (~300 строк, 13 полей) | EXTEND |
| `scripts/check-karty-routes.js` (отсутствует) | `scripts/check-karty-routes.js` (новый) | CREATE |
| `scripts/audit-pro.js` | UPDATE (добавить map-engine.css в allowlist) | UPDATE |

**Net result:**
- ~−3500 строк удалено
- ~+800 строк добавлено
- ~−200KB JS bundle
- Lighthouse 60-70 → 95+

---

## 9. Когда этот документ становится кодом

**НЕ в Phase 0.** В Phase 0 владелец принимает 5 решений.

**НЕ в Phase 1.** В Phase 1 мы только audit'им, не пишем.

**В Phase 2.** В Phase 2 этот документ становится **финальной spec'ой** для Phase 3. Владелец одобряет spec. Потом Phase 3 пишет код.

Если в Phase 2 spec окажется неполной (забыли что-то), **не** дописываем на ходу в Phase 3 — возвращаемся в Phase 2.

---

**Подпись:** arena-agent-karty-strategy, 2026-07-07
**Status:** `proposal-open` (дизайн-документ, не код)
**Зависит от:** Phase 2 STRATEGY.md, после 5 owner decisions
