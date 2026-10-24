# Системная проверка: opener semantics нативного article image viewer

Дата: 2026-10-23  
Product anchor: `caeb92c839ff4b4f2838a0ad44a582034c41c8d4`  
AuditRepo input: `944fd72f1b3c7e5003089ef735e430f9e3136382`  
Режим: clean production-like build + Chromium 153; Product не изменялся

## Итог

Добавлена system lane `SYS-ARTICLE-IMAGE-VIEWER-OPENER-SEMANTICS`.

Канонический native owner `src/runtime/article-image-viewer.js` делает обычные `<img>` pointer-openers для modal viewer, но не даёт им интерактивной семантики, tab reachability или keyboard activation. Тот же нефокусируемый `<img>` передаётся в `OverlayRuntime` как `opener` при `restoreFocus:true`, поэтому после Escape focus возвращается не к изображению, а на `<body>`.

Это один interface defect, а не два независимых бага: opener используется и как activation surface, и как focus-return target, но не удовлетворяет ни одному control contract.

## Current source mechanism

Native viewer делегирует один document click handler на:

```text
.article-figure img, .article-img img, .nagornaya-hero-img
```

При pointer click он:

1. вызывает `preventDefault()`;
2. открывает `.img-viewer`;
3. передаёт source image в `OverlayRuntime.open(..., { opener: source })`;
4. запрашивает `trapFocus:true` и `restoreFocus:true`.

Но installer не добавляет:

- native `<button>`/`<a>` activation host;
- `tabindex`;
- button role/name;
- Enter/Space handler.

`OverlayRuntime` вызывает `.focus()` на opener, но не может сделать обычный `<img tabindex=-1>` активным элементом.

## Production-like browser proof

Сборка:

```bash
npm ci --ignore-scripts
npm run strangler:build:production-like
```

Build завершён успешно: 104 Astro pages, затем production-like legacy copy/projection.

Browser:

```text
Chromium 153.0.8010.0
local dist server
```

Проверены четыре независимых route/viewport case:

| Route | Viewport | Source image | Pointer opens | Focus inside viewer | Escape result | Keyboard opens |
|---|---:|---|---|---|---|---|
| `/articles/20-antisovetov-pastoru/` | 1280×800 | `tabIndex=-1`, no role/name | yes | close button | focus → `body` | no |
| `/articles/20-antisovetov-pastoru/` | 390×844 | same | yes | close button | focus → `body` | no |
| `/articles/krajne-li-isporcheno-serdce/` | 1280×800 | same | yes | close button | focus → `body` | no |
| `/nagornaya/chast-1/` | 390×844 | same | yes | close button | focus → `body` | no |

Во всех случаях:

- computed cursor: `zoom-in`;
- image не находится в tab order;
- manual `image.focus()` не меняет `document.activeElement`;
- Enter не открывает viewer;
- pointer click открывает viewer и блокирует scroll;
- Escape закрывает viewer, но не восстанавливает focus к opener.

Единственная console resource error в sandbox была `ERR_CONNECTION_CLOSED`; она не использована как Product claim и не влияет на локальный modal witness.

## Breadth census

Fresh built-dist census нашёл **91 eligible image на 25 routes**, где одновременно присутствует native `ReaderActionsRuntime` и один из viewer selectors.

Примеры breadth:

- Antisovetov — 10;
- Krajne — 15;
- Kod Da Vinci — 10;
- Rimlyanam 7 — 10;
- Lot — 9;
- Gill Context — 7;
- Gill Part I — 6;
- Nagornaya chapters — по одному на пяти routes.

Не каждый candidate обязательно является bare image: часть Gill surfaces может иметь authored link wrapper. Поэтому число 91 — selector breadth, а не утверждение о 91 одинаковых keyboard failures. Browser-confirmed bare-image boundary — четыре cases выше.

## Existing oracle gap

`scripts/interactive-audit.js::checkMediaViewerAndShare()`:

- выполняет `click({ force: true })` по первому image;
- проверяет open + scroll lock;
- нажимает Escape;
- проверяет close + unlock.

Он не проверяет:

- reachability через Tab;
- role/name;
- Enter/Space activation;
- focus target после close.

Forced pointer click поэтому даёт green exact defect state. `overlay-runtime-contract-test.js` проверяет API/owner presence, но не opener focusability.

## Bounded closure

1. Viewer должен иметь явный authored activation host. Предпочтительно native button around image либо эквивалентный компонент, который сохраняет image alternative text и figure semantics.
2. Если route уже использует image link, owner обязан определить один contract: viewer activation или navigation/download; document-level handler не должен молча перехватывать другой authored control.
3. Keyboard path открывает тот же singleton через Enter/Space без synthetic forced click в тесте.
4. Control получает доступное имя, сообщающее действие просмотра, не уничтожая alt/caption semantics.
5. `OverlayRuntime` получает реально focusable opener; Escape, close button и backdrop возвращают focus именно к нему.
6. Negative browser fixture обязана падать при `tabIndex=-1`, отсутствии имени, keyboard no-op или focus → body.
7. Матрица доказывается минимум на Antisovetov, Krajne, Nagornaya и одном authored-link Gill image; desktop/mobile и light/dark visual containment сохраняются.
8. Existing pointer open, scroll lock, trap, close and image/caption rendering не регрессируют.

## Collision / ownership boundary

- Дефект принадлежит `article-image-viewer.js` + его caller contract с `OverlayRuntime`, а не общему focus engine: другие overlays передают настоящие buttons/openers и восстанавливают focus.
- Legacy `site.js` image viewer не поглощён: строгие native article routes исключают legacy site monolith, и duplicate viewer ранее не воспроизводился.
- Direct content-image rows не создаются по одному на route.
- Open Product PR collision требуется повторить перед mutation; этот checkpoint evidence-only.

## Что не заявлено

- Не заявлено, что все 91 images должны открываться в modal.
- Не заявлено, что image link обязан стать modal opener.
- Не заявлена проблема качества/размера изображений.
- Не заявлен duplicate-viewer bug.
- Sandbox resource error не классифицирован как Product defect.
- Product source, lockfile, dist и browser artifacts не коммитились.
