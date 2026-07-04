# TURNKEY GUIDE: ДЕКОМПОЗИЦИЯ GOD-OBJECT КОНТРОЛЛЕРА БЕЗ НОВЫХ ФАЙЛОВ

**Дата:** 2026-06-27  
**Проект:** gb-is-my-strength (gospod-bog.ru)  
**Подсистема:** PremiumControls / Floating Cluster  
**Статус:** Готово к внедрению под ключ (Turn-key Implementation Guide)  
**Автор:** arena-surgical-surgeon

---

## 1. Введение и жесткое правило AGENTS §2

Файл `js/floating-cluster-controller.js` разросся до 1051 строки и 53 функций (God-Object). Он управляет темами, поиском, закладками, анимацией PlayEmber, озвучкой TTS (разбивка на чанки, скорость, пауза) и рельсом Гилла.

**⚠️ ЖЕСТКОЕ ПРАВИЛО AGENTS.md §2:** В папке `js/` запрещено создавать новые файлы. Допускается ровно 12 файлов + папка `modules/`.

**Задача следующего агента:** Выполнить рефакторинг `floating-cluster-controller.js` через **внутреннее секционирование (Internal Sectional Domains)** или сборку модулей в `js/modules/`, а также создать smoke-тест `scripts/floating-cluster-controller-smoke.js` для защиты от будущих регрессий.

---

## 2. Инструкция по внедрению под ключ

### Шаг 1. Создание ветки
Работать строго через выделенную ветку (SYSTEM LANE):
```bash
git checkout -b lane/system-premiumcontrols-controller-split-2026-06-27
```

### Шаг 2. Внутреннее секционирование `js/floating-cluster-controller.js`
Реорганизуйте код внутри `js/floating-cluster-controller.js`, разбив его на 6 четких, документированных доменных блоков с использованием IIFE или пространств имен `window.gbPremium = {}`:

```javascript
/**
 * floating-cluster-controller.js — PremiumControls Runtime Controller
 * Canonical source of truth for floating controls (TTS, speed morph, theme, save).
 * 
 * STRUCTURE (6 Strict Internal Domains):
 * 1. THEME DOMAIN
 * 2. SEARCH DOMAIN (Command Palette delegation)
 * 3. BOOKMARK DOMAIN (Sync with bookmark-engine.js)
 * 4. AUDIO / TTS DOMAIN (SpeechSynthesis chunking & state)
 * 5. PLAYEMBER / SPEED-MORPH DOMAIN (Hover-bloom & UI morph)
 * 6. SERIES WIRING DOMAIN (Gill & GBS2 rail initialization)
 */

(function() {
  'use strict';

  window.gbPremium = window.gbPremium || {};

  // ===================================================================
  // 1. THEME DOMAIN
  // ===================================================================
  window.gbPremium.Theme = {
    init: function() { /* existing theme init */ },
    toggle: function() { /* existing toggleTheme */ }
  };

  // ===================================================================
  // 2. SEARCH DOMAIN
  // ===================================================================
  window.gbPremium.Search = {
    open: function() {
      if (window.CommandPalette) window.CommandPalette.open();
    }
  };

  // ===================================================================
  // 3. BOOKMARK DOMAIN
  // ===================================================================
  window.gbPremium.Bookmark = {
    toggle: function(id) { /* existing toggleFavorite */ }
  };

  // ===================================================================
  // 4. AUDIO / TTS DOMAIN (SpeechSynthesis chunking & state)
  // ===================================================================
  window.gbPremium.Audio = {
    rate: localStorage.getItem('gb:audio:rate') || localStorage.getItem('gbx-tts-rate') || '1',
    chunkSize: 220,
    pickRuVoice: function() { /* existing pickRuVoice */ },
    speak: function(text) { /* existing TTS logic */ },
    pause: function() { /* existing pause logic */ }
  };

  // ===================================================================
  // 5. PLAYEMBER / SPEED-MORPH DOMAIN
  // ===================================================================
  window.gbPremium.PlayEmber = {
    init: function() { /* existing hover-bloom and speed pill logic */ }
  };

  // ===================================================================
  // 6. SERIES WIRING DOMAIN
  // ===================================================================
  window.gbPremium.Series = {
    initGillRail: function() { /* existing initGillRail */ }
  };

  // --- Master Init ---
  document.addEventListener('DOMContentLoaded', function() {
    window.gbPremium.Theme.init();
    window.gbPremium.PlayEmber.init();
    window.gbPremium.Series.initGillRail();
  });
})();
```

### Шаг 3. Создание Smoke-теста `scripts/floating-cluster-controller-smoke.js`
Создайте скрипт автоматической проверки целостности контроллера (в `scripts/` создавать файлы разрешено):

```javascript
/**
 * floating-cluster-controller-smoke.js
 * Enforces internal sectional domains and global API contracts for PremiumControls.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../js/floating-cluster-controller.js');
if (!fs.existsSync(filePath)) {
  console.error('❌ floating-cluster-controller.js missing!');
  process.exit(1);
}

const code = fs.readFileSync(filePath, 'utf8');

function assertContains(label, str) {
  if (!code.includes(str)) {
    console.error(`❌ Controller missing contract: ${label} (${str})`);
    process.exit(1);
  }
}

console.log('=== Floating Cluster Controller Smoke Audit ===');

// Check 6 strict domains
assertContains('THEME DOMAIN', '1. THEME DOMAIN');
assertContains('SEARCH DOMAIN', '2. SEARCH DOMAIN');
assertContains('BOOKMARK DOMAIN', '3. BOOKMARK DOMAIN');
assertContains('AUDIO / TTS DOMAIN', '4. AUDIO / TTS DOMAIN');
assertContains('PLAYEMBER / SPEED-MORPH DOMAIN', '5. PLAYEMBER / SPEED-MORPH DOMAIN');
assertContains('SERIES WIRING DOMAIN', '6. SERIES WIRING DOMAIN');

// Check canonical storage and chunking rules
assertContains('Canonical rate storage', "localStorage.getItem('gb:audio:rate')");
assertContains('Legacy rate fallback', "localStorage.getItem('gbx-tts-rate')");
assertContains('TTS chunking limit', '220');

console.log('✅ Floating Cluster Controller smoke audit PASSED.');
```

### Шаг 4. Регистрация теста в `package.json`
Добавьте вызов скрипта в `package.json` в секцию `scripts`:
```json
"audit:controller": "node scripts/floating-cluster-controller-smoke.js",
```
И включите `"npm run audit:controller"` в цепочку `validate:static-publication`.

### Шаг 5. Обязательные проверки перед коммитом
После правок запустите полный цикл проверки:
```bash
npm run cache-bust
npm run validate:static-publication
npm run guard:shared-files
```

Если все проверки зеленые — сливайте в `main` с флагом `--no-ff`.
