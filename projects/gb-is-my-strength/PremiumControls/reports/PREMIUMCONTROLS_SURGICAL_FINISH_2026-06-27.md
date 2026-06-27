# PremiumControls surgical finish — фактический отчёт по внедрённым правкам

**Дата:** 2026-06-27  
**Source repo:** `github.com/FedorMilovanov/gb-is-my-strength`  
**Audit repo:** `github.com/FedorMilovanov/AuditRepo`  
**Локальный source HEAD после работы:** `b63b9f29` — `merge: PremiumControls surgical finish — TTS race + speed pill geometry`  
**Лейн:** `lane/premiumcontrols-surgical-finish-2026-06-27`  
**Коммит лейна:** `23eac1ca` — `[LANE lane/premiumcontrols-surgical-finish-2026-06-27] fix(premiumcontrols): harden TTS race + speed pill geometry`

---

## 0. Короткий вывод

PremiumControls **не переписан бульдозером**. Сделана узкая хирургическая доводка в местах, где аудит и история показывали реальный рассинхрон:

1. `speechSynthesis.cancel()` мог синхронно/асинхронно вызвать `onend`, из-за чего pause/rate-change иногда перескакивали chunk или стартовали дубль.
2. Speed pill имел CSS-контракт «влево на desktop single/series-lite» и «вверх на Gill/mobile», но runtime guard перезаписывал inline `transform`, стирая CSS-владение геометрией.
3. Speed pill был визуально radio-группой, но DOM-ARIA оставался `role="group"`; начальная active speed не имела `aria-checked`.
4. Rollout-аудит существовал скриптом, но не был подключён как npm script.
5. Save-state sync смешивал две разные правды: PremiumControls Favorites (`gb-favorites`) и BookmarkEngine reading-position.

Исправления внесены минимально в:

```text
js/floating-cluster-controller.js
css/floating-cluster.css
package.json
docs/refactor-2026/lanes/premiumcontrols-surgical-finish-2026-06-27.md
```

Плюс выполнен `npm run cache-bust`, поэтому изменены ссылки на CSS/JS hash в Astro/HTML артефактах.

---

## 1. Что именно было сломано / рискованно

### 1.1 TTS cancel/onend race

Старое поведение было опасно из-за особенности Web Speech API: `speechSynthesis.cancel()` в разных движках может вызвать `utterance.onend`. В старой логике `onend` безусловно делал:

```js
ttsState.spokenChars += chunk.length;
ttsState.chunkIdx += 1;
updateProgress();
if (!ttsState.paused) speakNextChunk();
```

Риск:

- `pauseTts()` вызывает cancel → cancel вызывает `onend` → chunk индекс уезжает вперёд;
- live speed-change вызывает cancel + restart → старый `onend` может стартовать второй utterance;
- start/restart без run guard оставляет старые callback-и валидными.

Это тонкий рассинхрон: локально может «не воспроизводиться» на одном браузере, но ломаться на другом.

### 1.2 JS переписывал CSS transform speed-pill

CSS-контракт PremiumControls:

- desktop single/series-lite: speed pill morph **LEFT** от Play circle;
- Gill rail + mobile: speed pill morph **UP**.

Runtime viewport guard должен был только слегка подвинуть pill, если он вылез за viewport. Но старый код писал `panel.style.transform = ...`, тем самым мог стереть базовую CSS-геометрию.

### 1.3 ARIA desync speed selector

Speed selector по сути radio-selector, но контейнер был `role="group"`, а active кнопка имела только `aria-pressed`. Это не ломало клик, но расходилось с предназначением компонента и усложняло проверку состояния.

### 1.4 BookmarkEngine vs Favorites

PremiumControls Save работает с `gb-favorites`. BookmarkEngine — другая инфраструктура, отвечающая за reading-position/bookmarks. Старый `syncSaveState()` читал BookmarkEngine как будто это источник истины для Save heart/bookmark. Это могло давать ложное состояние сохранения.

---

## 2. Применённые изменения: код

### 2.1 Новый state guard для TTS

В `ttsState` добавлены поля:

```js
runId: 0,
suppressEnd: false,
```

Смысл:

- `runId` инвалидирует callback-и от старого utterance;
- `suppressEnd` гасит synthetic `onend` после `cancel()`.

### 2.2 `speakNextChunk()` теперь защищён от stale callbacks

Ключевой паттерн:

```js
function speakNextChunk() {
  var runId = ttsState.runId;
  if (ttsState.chunkIdx >= ttsState.chunks.length) {
    ttsState.utterance = null;
    setEmberState('complete');
    return;
  }

  var chunk = ttsState.chunks[ttsState.chunkIdx];
  var u = new SpeechSynthesisUtterance(chunk);
  u.rate = getStoredRate();
  u.lang = 'ru-RU';
  if (!ttsState.voice) ttsState.voice = pickRuVoice();
  if (ttsState.voice) u.voice = ttsState.voice;

  u.onend = function () {
    if (runId !== ttsState.runId) return;
    if (ttsState.suppressEnd) { ttsState.suppressEnd = false; return; }
    ttsState.spokenChars += chunk.length;
    ttsState.chunkIdx += 1;
    updateProgress();
    if (!ttsState.paused) speakNextChunk();
  };

  u.onerror = function (e) {
    if (runId !== ttsState.runId || ttsState.suppressEnd) {
      ttsState.suppressEnd = false;
      return;
    }
    console.warn('[gbx-tts] utterance error:', e.error);
    ttsState.utterance = null;
    setEmberState('idle');
  };

  ttsState.utterance = u;
  window.speechSynthesis.speak(u);
}
```

### 2.3 `startTts()` сначала инвалидирует старый run и cancel-ит старый синтез

```js
ttsState.runId += 1;
ttsState.suppressEnd = false;
try { window.speechSynthesis.cancel(); } catch (_) {}
```

Потом состояние собирается заново:

```js
ttsState.text = text;
ttsState.chunks = splitTtsChunks(text);
ttsState.chunkIdx = 0;
ttsState.totalChars = text.length;
ttsState.spokenChars = 0;
ttsState.paused = false;
ttsState.utterance = null;
setEmberState('playing');
speakNextChunk();
```

### 2.4 `pauseTts()` ставит guards ДО cancel

```js
ttsState.paused = true;
ttsState.suppressEnd = true;
window.speechSynthesis.cancel();
ttsState.utterance = null;
setEmberState('paused');
```

Порядок важен: если движок синхронно вызывает `onend` внутри `cancel()`, callback уже увидит `suppressEnd=true`.

### 2.5 `resumeTts()` создаёт новый run

```js
ttsState.paused = false;
ttsState.suppressEnd = false;
ttsState.runId += 1;
setEmberState('playing');
speakNextChunk();
```

### 2.6 `stopTts()` инвалидирует старые callback-и

```js
ttsState.runId += 1;
ttsState.suppressEnd = true;
window.speechSynthesis.cancel();
ttsState.paused = false;
ttsState.utterance = null;
ttsState.chunkIdx = 0;
ttsState.spokenChars = 0;
setEmberState('idle');
```

### 2.7 Live rate-change теперь не может double-advance queue

```js
window.addEventListener('gb:tts-rate-change', function (ev) {
  if (!('speechSynthesis' in window)) return;
  if (!ttsState.utterance || ttsState.chunkIdx >= ttsState.chunks.length) return;

  ttsState.runId += 1;
  ttsState.suppressEnd = true;
  window.speechSynthesis.cancel();
  ttsState.utterance = null;

  if (!ttsState.paused) {
    ttsState.suppressEnd = false;
    speakNextChunk();
  }
});
```

---

## 3. Speed pill: сохранение CSS-владения геометрией

### 3.1 ARIA

Контейнер speed selector теперь:

```js
panel.setAttribute('role', 'radiogroup');
panel.setAttribute('aria-label', 'Скорость воспроизведения');
```

Кнопки создаются с `role="radio"`, `aria-pressed` и `aria-checked`:

```js
return '<button class="gb-ember-expand__btn' + active + '" type="button" role="radio" data-speed="' + s + '" aria-label="Скорость ' + s + '\u00d7" aria-pressed="' + (s === currentRate ? 'true' : 'false') + '" aria-checked="' + (s === currentRate ? 'true' : 'false') + '">' + s + '\u00d7</button>';
```

### 3.2 Runtime viewport guard больше не пишет inline `transform`

Правильный новый паттерн:

```js
if (shift) {
  panel.style.setProperty('--gb-ember-shift', shift + 'px');
}
```

Закрытие панели чистит только custom property:

```js
panel.style.removeProperty('--gb-ember-shift');
```

### 3.3 CSS теперь принимает `--gb-ember-shift`

Desktop left-bloom:

```css
.gb-ember-expand {
  transform: translateY(-50%) translateX(var(--gb-ember-shift, 0px));
}
```

Gill upward:

```css
[data-gill-v16] .gb-ember-expand,
.gbs-rail-foot .gb-ember-expand {
  transform: translateX(calc(-50% + var(--gb-ember-shift, 0px)));
}
```

Mobile upward:

```css
@media (max-width: 899px) {
  .gb-ember-expand {
    transform: translateX(calc(-50% + var(--gb-ember-shift, 0px)));
  }
}
```

### 3.4 CSS hover/focus stagger восстановлен и до JS-hydration

Добавлены nth-child задержки для чистого CSS hover/focus:

```css
.gb-ember-wrap:hover > .gb-ember-expand .gb-ember-expand__btn:nth-child(1),
.gb-ember-wrap:focus-within > .gb-ember-expand .gb-ember-expand__btn:nth-child(1) { transition-delay:.025s,.025s,0s,0s,0s; }
/* ... до nth-child(6) */
```

---

## 4. Save-state sync: убрана ложная зависимость от BookmarkEngine

Новый код:

```js
function syncSaveState() {
  var path = normalizePath(location.pathname);
  var saved = isFavorite(path);
  try { saved = saved || !!localStorage.getItem('fc:saved:' + path); } catch (_) {}
  setSaved(saved);
}
```

Почему так:

- `gb-favorites` — каноническое хранилище PremiumControls Save;
- `fc:saved:<path>` — legacy совместимость;
- BookmarkEngine — не источник истины для этой кнопки.

---

## 5. Добавлен npm script аудита

В `package.json` добавлено:

```json
"audit:premium-controls": "node scripts/premium-controls-rollout-audit.js"
```

Это важно, потому что PremiumControls rollout contract теперь можно запускать стандартной командой:

```bash
npm run audit:premium-controls
```

---

## 6. Проверки, которые были выполнены

Среда:

```text
Node v22.12.0
/tmp/node-v22.12.0-linux-x64/bin/node
```

Команды:

```bash
node --check js/floating-cluster-controller.js
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package json ok')"
git diff --check
npm run cache-bust
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run strangler:build:production-like
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run audit:premium-controls
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run owner:ui-guard
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run data:consistency
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run guard:shared-files
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run validate:static-publication
```

Ключевой результат rollout-аудита:

```text
PremiumControls rollout audit: 28/28 passed

✅ PremiumControls rollout contract OK.
scanned 54 dist pages; 26 carry PremiumControls
no double floating-cluster CSS delivery (PC-004 invariant holds)
```

Targeted browser smoke через Playwright тоже прошёл после установки Chromium deps:

```text
PremiumControls browser smoke OK {
  herm: { open: true, opacity: '1', buttons: 6, role: 'radiogroup', checked: 1 },
  tts: { state: 'playing', cancel: 1 },
  rate: { rate: '1.75', legacy: '1.75', cancel: 2 },
  gill: { open: true, buttons: 6, above: true }
}
```

---

## 7. Преднамеренно НЕ сделано

Чтобы не породить конфликты и визуальные регрессии, НЕ трогалось:

- позиционирование `.gb-floater`, `.gb-floater--hermeneutics`;
- Gill rail geometry;
- mobile bottom pill position;
- размеры Play/Save/icon;
- модульная декомпозиция monolithic `floating-cluster-controller.js`;
- Gill v16 convergence;
- GBS2 legacy template migration;
- remote branches batch-merge.

---

## 8. Что другому агенту можно применять под ключ

Если другой агент восстанавливает эту работу из отчёта, безопасный порядок такой:

```bash
cd gb-is-my-strength
git checkout main
git pull --ff-only origin main
git checkout -b lane/premiumcontrols-surgical-finish-YYYY-MM-DD
```

Применить только эти смысловые изменения:

1. В `js/floating-cluster-controller.js` добавить `runId/suppressEnd` и guards в `speakNextChunk/start/pause/resume/stop/gb:tts-rate-change`.
2. В `initPlayExpand()` заменить `role="group"` на `role="radiogroup"`, добавить начальный `aria-checked` на speed buttons.
3. В viewport guard убрать любые записи `panel.style.transform = ...`; оставить только `--gb-ember-shift`.
4. В `css/floating-cluster.css` включить `var(--gb-ember-shift, 0px)` в desktop/Gill/mobile transforms.
5. В `syncSaveState()` читать `gb-favorites` через `isFavorite(path)` + legacy `fc:saved:<path>`; не читать BookmarkEngine как Save truth.
6. Добавить `audit:premium-controls` script в `package.json`.
7. Запустить cache-bust и gates.

Обязательный commit message для shared files:

```text
[LANE lane/premiumcontrols-surgical-finish-YYYY-MM-DD] fix(premiumcontrols): harden TTS race + speed pill geometry
```

Иначе `guard:shared-files` должен падать — это нормальная защита.

---

## 9. Оставшийся долг после этой операции

1. `origin/lane/floating-cluster-guards-2026-06-27` содержит ценный doc + unscoped Gill roman numeral guard; его стоит перенести отдельным маленьким лейном.
2. Gill convergence не завершён: Context уже v16, Part I/II/III/Spravochnik остаются legacy `gbs2-*` split-world.
3. Remote branch `gill-part1-v16-converge` нельзя raw-merge, но его можно использовать как design evidence.
4. Existing warnings остаются вне scope PremiumControls:
   - нестандартные breakpoints `960/500/420px`;
   - title/og:title drift на нескольких страницах;
   - `/izbrannoe/` missing route matrix/search-manifest entries.
