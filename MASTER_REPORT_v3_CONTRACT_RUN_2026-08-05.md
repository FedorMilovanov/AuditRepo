# МАСТЕР-ОТЧЁТ v3 — ПЕРВЫЙ ПРОГОН КОНТРАКТНОЙ СИСТЕМЫ (результаты)

**Дата:** 2026-08-05 · **Source:** `007c2d3c` · **Ветка:** `arena/019fd2bb-auditrepo` (открыта)

---

## 1. Что сделано

Контрактная система доведена до рабочего состояния и **впервые прогнана против реального source-кода**. Добавлены 3 контракта + обновлён `diff-canonical.mjs` (v2: поиск по компоненту и по `js/`, не только по роутам).

## 2. Результаты прогона (реальные, на `007c2d3c`)

| Контракт | Токены | Результат | Вывод |
|---|---|---|---|
| `gill-mobile-bar` | data-gill-v16, __label, mobile-bottom-bar | **PASS 3/3** | ядро v4 перенесено в Astro ✅ |
| `home-sacred-scripture-bg` | hScriptureBg, h-scripture-bg, h-phrase | **FAIL 0/3** | **фича мертва**: контейнер `#hScriptureBg` отсутствует, JS/CSS живы |
| `search-command-palette-a11y` | role=combobox, aria-activedescendant, cp-close, gb-nav-search-icon | **PASS 4/4** | PR #1039 закрыл, не откатилось ✅ |

## 3. Почему это «золото»

1. **home-sacred FAIL — машина нашла то, что мы находили вручную** (фича умерла молча). Теперь это не «ощущение», а детерминированный вердикт скрипта.
2. **gill PASS + search PASS — защита от регресса**: если агент «вдохновится» и переименует токены — скрипт покажет FAIL до мерджа.
3. **Работает по компоненту** (не по роуту) — честно: shared-компоненты в `GillSeriesMobileBar.astro`, а не в роут-папках.

## 4. Как использовать (для агента)

```bash
# после внедрения фичи, перед PR:
node scripts/diff-canonical.mjs --all
# или по одному:
node scripts/diff-canonical.mjs --component GillSeriesMobileBar
```

Ожидаемый вывод при OK:
```
[gill-mobile-bar] PRESENT 3/3 · ORDER OK · VERDICT PASS
```

## 5. Что осталось (следующие шаги)

1. **Починить `home-sacred-scripture-bg`**: добавить контейнер `#hScriptureBg` в `HomeAmbientPhrases.astro` (1 строка) → контракт станет PASS → фича оживёт.
2. **Решить судьбу TOC-шита Гилла**: вернуть `toc-part-item`/`toc-sheet_*` (1:1) или зафиксировать ADAPTIVE (gbs2-tocscroll) в контракте — решение владельца.
3. **Добавить контракты** для: Нагорная (NG-класс), home-мобильный док (h-mobile-dock), 3D app, karty-minimap.
4. **Интегрировать в AGENTS.md**: правило «Visual contracts» (раздел готов в отчётах).

---

*Документ — untracked; будет добавлен в ветку коммитом.*
