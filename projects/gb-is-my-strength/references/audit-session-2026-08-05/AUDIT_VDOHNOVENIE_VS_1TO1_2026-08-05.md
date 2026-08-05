# ПРОДОЛЖЕНИЕ АУДИТА — «Агенты переносят референсы по вдохновению, а не 1:1» (доказательства + меры)

**Дата:** 2026-08-05 · **Source main:** `007c2d3c` · **Продолжение:** `AUDIT_TUPNYAKI_I_ZOLOTO_2026-08-05.md`

---

## 1. Как хранятся референсы (что агент должен «повторить 1:1»)

| Место | Содержимое |
|---|---|
| `docs/design-references/` (source) | `contact_sheets/`, `selected/` — 5 папок: genealogy, maps desktop/mobile/state, site map |
| `references/gb-ui-canon-2026-07-13/` (AuditRepo) | **canonical-скриншоты + `mobile-toc-accordion-v5.html`** — эталон мобильного TOC v2.9 |
| `_OWNER_DOWNLOADS/README.md` | 6 требований owner (8.5vw, roman TOC, no mini-img, play-expand, gill-context) |

**Вывод:** референсы существуют и машиночитаемы (HTML-эталон v5 есть). Но **никакого автоматического сравнения «Astro-реализация ↔ canonical-эталон» нет** — агент должен сам глазами сверить. Поэтому «вдохновение» неизбежно.

## 2. ДОКАЗАТЕЛЬСТВО «вдохновения вместо 1:1» — классы-имена

### Гилл (мобильный бар) — legacy vs Astro

| Legacy (в `articles/dzhon-gill-chast-1-chelovek/index.html`) | Astro (`gill-series/*.astro`) | Вердикт |
|---|---|---|
| `mobile-bottom-bar` | `bar-progress-fill` / `bar-series-fill` | переименовано |
| `mobile-toc-btn` | `gbs2-toc` / `gbs2-toch` | переименовано |
| `toc-sheet` / `toc-sheet__head` / `toc-sheet__list` | `gbs2-tocscroll` / `gbs2-curbar` | переименовано |
| `toc-part-item` (римские, требование owner) | `gbs2-tocscroll` (нет `toc-part-item` в части I) | **структурно другой DOM** |
| `mobile-icon-row` | `mobile-playwrap` / `mobile-speedrail` / `mobile-top-slot` | переименовано |

**Суть:** Astro-команда не перенесла legacy-разметку 1:1, а **переписала mobile bar с нуля под новые имена**. При этом:
- контракт v4 (`data-gill-v16`/`__label`) — **0 вхождений в Astro gill-part1**, 2 в legacy;
- статичные римские `toc-part-item` (требование owner из `_OWNER_DOWNLOADS`) — в legacy есть, в Astro заменены на JS-генерируемый список;
- legacy `toc-sheet` (нижний шит с handle) — в Astro `gbs2-tocscroll` (другой паттерн).

### Герменевтика — legacy vs Astro

| Legacy | Astro | Вердикт |
|---|---|---|
| (legacy файл не содержит `hm-*`) | `hm-playwrap` / `hm-speedrail` / `hmbar-*` | **Astro создал новый нейминг** |

То есть и для Гилла, и для Герменевтики агенты **изобрели свои классы**, вместо того чтобы повторить существующие. Это и есть корень: «с чистого листа стиль легче, чем повторить на моём проекте».

## 3. Почему «вдохновение» даёт вирус (механика)

1. Новые имена → старый CSS не применяется → нужен hotfix-слой (`mobile-hotfix.css`) → живёт вечно (NF-STRANGLER-BAR-DRIFT: legacy `#mobTocBtn` без `__label` дрейфует, потому что Astro-бар другой).
2. Новые имена → старые гейты не находят маркеры → вакуумные гейты (`Часть 1 из 5` ×4, `data-gill-v16` — ждут legacy, которого в Astro нет).
3. Новые имена → следующий агент не находит «тот же блок» на другой странице → «нашёл на Gill, забыл на Hermenevtika» (`5c626ea3`).
4. Новые имена → JS-селекторы (`.gbs2-tocscroll`) и legacy-селекторы (`.toc-sheet`) живут параллельно → двойные owners → D-4 magic z-index, NF-GATE-IZ5.
5. Часть фич умирает молча: `#hScriptureBg` (JS/CSS есть, разметки нет), `h-mobile-dock` (13 классов без разметки).

## 4. Меры — как заставить «1:1» вместо «вдохновения»

### 4.1. Машиночитаемый контракт референса (новое, главное)

Создать `docs/design-references/CANONICAL_CONTRACTS.md` + `contracts/*.json`:

```json
{
  "id": "gill-mobile-bar-v4",
  "canonicalSource": "references/gb-ui-canon-2026-07-13/mobile-toc-accordion-v5.html",
  "requiredTokens": ["data-gill-v16", "__label", "toc-part-item", "mobile-toc-btn"],
  "requiredOrder": ["toc-sheet__handle", "toc-sheet__head", "toc-sheet__list"],
  "forbiddenTokens": ["hm-playwrap", "gbs2-tocscroll"],
  "routes": ["gill-part1", "gill-part2", "gill-part3", "gill-part4", "gill-spravochnik", "hermenevtika"]
}
```

CI-гейт: любой PR, трогающий `gill-*`/`hermenevtika`/home, обязан **не ломать requiredTokens** и **не вводить новые** (кроме owner-одобренных). Это превращает «вдохновение» в проверяемое действие.

### 4.2. Три режима переноса (правило для агентов)

1. **1:1 REPLICA** — референс существует → обязателен дословный перенос (классы, порядок, имена). Новые имена запрещены.
2. **ADAPTIVE** — референс есть, но контекст другой (mobile vs desktop) → только owner-одобренный маппинг, зафиксированный в контракте.
3. **ORIGINAL** — референса нет → новый дизайн разрешён, но тогда он сам становится эталоном и заносится в canonical.

**Проверка в PR-описании:** «Режим переноса: REPLICA/ADAPTIVE/ORIGINAL; ссылка на canonical-файл; diff классов vs эталон». Без этого PR не ревьюится.

### 4.3. Снять с агента «трудоёмкость 1:1»

Проблема в том, что 1:1 трудно. Помочь:
- **скрипт `diff-canonical`**: сравнивает классы/структуру текущей страницы с эталоном и выдаёт таблицу «совпало / потеряно / новое» — агент просто читает и чинит, не угадывая;
- **семейный parity**: тот же скрипт гоняется по всем 5+ частям Гилла + Герменевтике одним прогоном (ловит «забыл на другой странице»);
- **запрет «вдохновения» в промпте**: «если есть canonical — копируй его, не рисуй своё; если не получается 1:1 — останавливайся и спрашивай owner, не изобретай».

### 4.4. Противовирусные CI-гейты (лёгкие, не тесты-миллионы)

1. **class-diff-gate** (по 4.1) — блокирует новые имена в guarded-зонах.
2. **token-presence-gate** — требует `data-gill-v16`/`__label`/`toc-part-item` на всех gill-роутах (сейчас Astro gill-part1 = 0!).
3. **family-coverage-gate** — «изменение бар-компонента обязано примениться к N роутам семейства», иначе fail.
4. **dead-css-gate** — класс в CSS без разметки (или разметка без CSS) → warning + отчёт, раз в неделю.

### 4.5. Репарация уже сделанных костылей (порядок)

1. Вернуть `#hScriptureBg` (1 строка) — оживёт фича.
2. Привести Astro Gill mobile bar к canonical v5: `data-gill-v16` + `__label` + `toc-part-item` (1:1, по контракту).
3. Перенести `mobile-toc-btn`/`toc-sheet`-структуру или явно зафиксировать ADAPTIVE-маппинг в контракте.
4. Удалить мёртвый CSS `h-mobile-dock*` (13 классов) и `#mobTocBtn`-дрейф после переноса.
5. Прогнать family-parity по 5 частям Гилла + Герменевтике.

---

## 5. Итог

**Твой диагноз точен и подтверждён кодом:**

- Агенты **переписывают референсы под новые имена** (`mobile-bottom-bar`→`bar-progress-*`, `toc-sheet`→`gbs2-tocscroll`, legacy-бар→`hm-*`), потому что «повторить 1:1 трудно, а с нуля легче».
- Это порождает вирус: старый CSS/гейты/JS не находят новую разметку → hotfix-слои, вакуумные гейты, дрейф, «забыл на другой странице», мёртвые фичи.
- **Лекарство не в «ещё больше тестов», а в машиночитаемом контракте референса** (canonical-файлы + requiredTokens + diff-canonical скрипт), который делает «1:1» проверяемым и снимает с агента угадывание.

*Документ — untracked в AuditRepo; коммиты/пуши не выполнялись.*
