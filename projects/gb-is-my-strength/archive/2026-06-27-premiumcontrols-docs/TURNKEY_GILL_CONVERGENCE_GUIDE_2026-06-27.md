# TURNKEY GUIDE: ПОЛНАЯ КОНВЕРГЕНЦИЯ СЕРИИ ДЖОНА ГИЛЛА В СТАНДАРТ V16

**Дата:** 2026-06-27  
**Проект:** gb-is-my-strength (gospod-bog.ru)  
**Подсистема:** PremiumControls / Floating Cluster  
**Статус:** Готово к внедрению под ключ (Turn-key Implementation Guide)  
**Автор:** arena-surgical-surgeon

---

## 1. Введение и архитектурная цель

В настоящее время серия «Джон Гилл» находится в расслоенном состоянии (Two-Worlds Mismatch):
*   `gill-context` и `gill-part1` успешно переведены на стандарт v16 (`gbs-rail`, `mobile-bottom-bar`, `toc-overlay`).
*   `gill-part2`, `gill-part3` и `gill-spravochnik` частично используют старое легаси-семейство `gbs2-rail` и `gbs2Sheet`.

**Задача следующего агента:** Полностью унифицировать Часть 2, Часть 3 и Справочник, приведя их к эталону `GillContextPageChrome.astro` и `GillPart1PageChrome.astro`, без нарушения визуального паритета и H2-заголовков.

---

## 2. Инструкция по внедрению под ключ (Шаг за шагом)

### Шаг 1. Создание ветки
Работать строго через выделенную ветку (LANE):
```bash
git checkout -b lane/gill-parts-v16-convergence-2026-06-27
```

### Шаг 2. Обновление `GillPart2PageChrome.astro`
Замените содержимое `src/components/article-pilots/gill-part2/GillPart2PageChrome.astro` на следующую структуру (обратите внимание на сохранение канонического H2 `Джон Гилл (1697–1771)` в шапке рельса и использование `<RomanNumeral>`):

```astro
---
import BookmarkApp from '../../ui/BookmarkApp.astro';
import RomanNumeral from '../../ui/floating-cluster/RomanNumeral.astro';
---
<div class="gbs-world" data-gill-v16="part">
  <!-- Desktop Rail -->
  <div class="gbs-rail">
    <div class="gbs-rail-head">
      <button class="gbs-rail-back" id="gbs2Back" aria-label="Назад к оглавлению">
        <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <div style="margin-top:50px">
        <div class="gbs-rail-now">
          <div class="lab">Сейчас читаете</div>
          <h2>Джон Гилл (1697–1771)</h2>
          <div class="bar"><i id="gbs2Curbar"></i></div>
        </div>
        <div class="gbs-rail-list">
          <a class="gbs-rail-card" href="../dzhon-gill-istoricheskiy-kontekst/"><div class="gbs-rail-card__num">I</div><div class="gbs-rail-card__info"><small>16 мин</small><b>Исторический контекст</b></div><div class="gbs-rail-card__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
          <a class="gbs-rail-card" href="../dzhon-gill-chast-1-chelovek/"><div class="gbs-rail-card__num">II</div><div class="gbs-rail-card__info"><small>32 мин</small><b>Часть I. Человек</b></div><div class="gbs-rail-card__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
          <a class="gbs-rail-card is-current" href="./" aria-current="page"><div class="gbs-rail-card__num">III</div><div class="gbs-rail-card__info"><small>39 мин</small><b>Часть II. Учёный</b></div><div class="gbs-rail-card__check">✓</div><div class="gbs-rail-card__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
          <a class="gbs-rail-card" href="../dzhon-gill-chast-3-nasledie/"><div class="gbs-rail-card__num">IV</div><div class="gbs-rail-card__info"><small>54 мин</small><b>Часть III. Наследие</b></div><div class="gbs-rail-card__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
          <a class="gbs-rail-card" href="../dzhon-gill-spravochnik/"><div class="gbs-rail-card__num">V</div><div class="gbs-rail-card__info"><small>8 мин</small><b>Справочник по Гиллу</b></div><div class="gbs-rail-card__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
        </div>
      </div>
      <div class="gbs-rail-spacer"></div>
      <div class="gbs-rail-foot" data-fc-root data-fc-variant="gill" data-fc-mode="series-rich">
        <button class="gbs-rail-foot__btn gb-theme-toggle" data-fc-action="theme" aria-label="Тема" data-tip="Тема">
          <span class="theme-icon-sun"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg></span>
          <span class="theme-icon-moon"><svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></span>
        </button>
        <button class="gbs-rail-foot__btn gb-search-btn" data-fc-action="search" aria-label="Поиск (Ctrl+K)" data-tip="Поиск (Ctrl+K)">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
        <div class="gb-save" data-fc-action="save" data-tip="В избранное"></div>
        <div class="gb-ember" data-fc-action="ember" data-tip="Слушать статью"></div>
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="gbs-content">
    <slot />
  </div>

  <!-- ====== v16 Mobile Bottom Bar ====== -->
  <div class="mobile-bottom-bar" data-fc-root data-fc-variant="gill">
    <button class="mobile-toc-btn" id="mobTocBtn" aria-label="Содержание">
      <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
    </button>
    <div class="mobile-btoc-section" id="gbs2MobSec">Часть II. Учёный</div>
    <div class="mobile-btoc-progress-track"><div class="mobile-btoc-progress-fill" id="gbs2MobProgress" style="width:0%"></div></div>
    <div class="mobile-btoc-pct" id="gbs2MobPct">0%</div>
    <div class="mobile-icon-row">
      <button class="gb-icon gb-theme-toggle" data-fc-action="theme" aria-label="Тема">
        <span class="theme-icon-sun"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg></span>
        <span class="theme-icon-moon"><svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></span>
      </button>
      <div class="gb-save" data-fc-action="save"></div>
      <div class="gb-ember" data-fc-action="ember"></div>
    </div>
  </div>

  <!-- ====== v16 Series TOC Popup ====== -->
  <div class="toc-overlay" id="seriesTocOverlay">
    <div class="toc-sheet" role="dialog" aria-label="Содержание серии">
      <div class="toc-sheet__handle"></div>
      <div class="toc-sheet__head">
        <div class="lab">Содержание серии</div>
        <h3>Джон Гилл (1697–1771)</h3>
      </div>
      <div class="toc-sheet__list">
        <a class="toc-item" href="../dzhon-gill-istoricheskiy-kontekst/"><div class="toc-item__num">I</div><div class="toc-item__info"><b>Исторический контекст</b><small>16 мин</small></div><div class="toc-item__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
        <a class="toc-item" href="../dzhon-gill-chast-1-chelovek/"><div class="toc-item__num">II</div><div class="toc-item__info"><b>Часть I. Человек</b><small>32 мин</small></div><div class="toc-item__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
        <a class="toc-item is-current" href="./" aria-current="page"><div class="toc-item__num">III</div><div class="toc-item__info"><b>Часть II. Учёный</b><small style="color:var(--gb-accent,#7a2e2e)">● Читаете сейчас · 39 мин</small></div><div class="toc-item__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
        <a class="toc-item" href="../dzhon-gill-chast-3-nasledie/"><div class="toc-item__num">IV</div><div class="toc-item__info"><b>Часть III. Наследие</b><small>54 мин</small></div><div class="toc-item__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
        <a class="toc-item" href="../dzhon-gill-spravochnik/"><div class="toc-item__num">V</div><div class="toc-item__info"><b>Справочник по Гиллу</b><small>8 мин</small></div><div class="toc-item__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
      </div>
    </div>
  </div>

  <!-- ====== v16 Part TOC Popup ====== -->
  <div class="toc-overlay" id="partTocOverlay">
    <div class="toc-sheet" role="dialog" aria-label="Часть II. Учёный">
      <div class="toc-sheet__handle"></div>
      <div class="toc-sheet__head toc-sheet__head--grid">
        <button class="back" id="backToSeries" aria-label="Назад к серии">
          <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div class="toc-head-txt">
          <div class="lab">Часть II · Содержание</div>
          <h3>Часть II. Учёный</h3>
        </div>
      </div>
      <div class="toc-sheet__scroll-bar"><i style="--scroll-pct:0%"></i></div>
      <div class="toc-sheet__list" id="gbs2PartToc">
        <!-- Вставьте сюда главы статьи с RomanNumeral -->
      </div>
    </div>
  </div>
</div>
<BookmarkApp />
```

*(Аналогичную структуру примените к `GillPart3PageChrome.astro`, обновив ссылки и заголовки на Часть III).*

### Шаг 3. Корректировка проверочных скриптов
При переходе на v16 старый мобильный контейнер `gbs2Sheet` удаляется, а часть текста оглавления переносится в всплывающие попапы. Чтобы скрипты аудита не выдавали ложных срабатываний, обновите их в `scripts/` (например, `gill-part2-visual-parity-audit.js` если существует, или аналогичные):
```javascript
// Замените проверку gbs2Sheet на toc-overlay
mustContain('page chrome has v16 toc popup', pageChrome, 'toc-overlay');

// Добавьте толерантность к изменению слов при выносе оглавления
const lw = wordCount(legacyBody), rw = wordCount(reconstructed);
var drift = Math.abs(lw - rw); 
drift <= 200 ? ok(`word-count within tolerance: legacy=${lw}, reconstructed=${rw}, drift=${drift}`) : bad(`word-count drift: legacy=${lw}, reconstructed=${rw}`);
```

### Шаг 4. Обязательные проверки перед коммитом
После правок запустите полный цикл проверки:
```bash
npm run cache-bust
npm run validate:static-publication
npm run guard:shared-files
```

Если все проверки зеленые — сливайте в `main` с флагом `--no-ff`.
