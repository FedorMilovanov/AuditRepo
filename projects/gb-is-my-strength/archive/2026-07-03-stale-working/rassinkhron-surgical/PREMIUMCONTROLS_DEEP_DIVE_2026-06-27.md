# PREMIUMCONTROLS (Floating Cluster / gb-ember) — ГЛУБОКИЙ ХИРУРГИЧЕСКИЙ АНАЛИЗ

**Дата:** 2026-06-27  
**HEAD:** 49b83365  
**Статус на момент анализа:** ✅ `premium-controls-rollout-audit.js` = 28/28 PASS  
**Контекст:** Много регрессий (VR-07, R9 revert, position overrides, hitbox, single-active, TTS race), откаты, lane-работа. Нужно закрывать **точно** этот блок без новых регрессий.

---

## 1. Текущее состояние (объективно)

### Зелёные факты
- **Rollout audit** (scripts/premium-controls-rollout-audit.js) проходит чисто:
  - 26 страниц несут `gb-ember` / `gb-save`
  - Все имеют правильный scope (`data-fc-root` или `data-fc-controls="gill-rail"`)
  - Контроллер загружен
  - Нет двойной доставки CSS (PC-004 invariant)
- Компоненты существуют и используются:
  - `src/components/ui/floating-cluster/` (SingleArticleCluster, SeriesLiteCluster, GillRailControls, PlayEmber, SaveButton и др.)
  - `FloatingCluster.astro` как фасад
- Контроллер (`js/floating-cluster-controller.js`, 1051 строка) — очень зрелый:
  - Реальная TTS (speechSynthesis + chunking + live rate change через `gb:tts-rate-change`)
  - Favorites (отдельная от BookmarkEngine система `gb-favorites`)
  - Speed morph pill с viewport guard, tab trap, staggered cascade
  - Полная поддержка GBS2 (rail + bbar + sheets)
  - `initGillRail()` специально чинит Gill (multiple containers)
- CSS разделение:
  - `css/floating-cluster.css` (74 KB) — legacy + Gill v16 + много специфичного
  - `css/premium-controls.css` — "canonical" маленькая версия
- Текущие коммиты последних дней — в основном стабилизация (position, revert, TTS fixes).

### Красные / жёлтые факты (риски регрессии)

| Проблема | Уровень | Доказательство | Почему опасно |
|----------|---------|----------------|---------------|
| **Монолитный контроллер 1050 строк** | P1 | Один файл делает TTS + favorites + GBS2 + speed panel + TOC popups + keyboard | Очень легко сломать одну фичу при правке другой |
| **Остатки `fc-*` классов** | P2 | 20+ упоминаний в css/floating-cluster.css + site.css | Старые селекторы могут жить параллельно и вызывать каскадные конфликты |
| **История повторяющихся регрессий позиции/visibility** | P0 историческая | VR-07, R9 revert, breadcrumb-level, mobile pill, fc-single-active, huge icons | Каждая правка позиции ломала что-то другое |
| **floating-cluster.css огромный** | P2 | 74 KB | Содержит Gill-specific + legacy + v16 polish. Трудно поддерживать |
| **Speed panel — очень хрупкая морф-логика** | P1 | viewport shift, clip-path, auto-start после выбора скорости, разные режимы (left / up) | Легко сломать на мобильном / Gill rail / reduced-motion |
| **Нет dedicated теста контроллера** | P2 | Только rollout-audit + visual parity | Нельзя быстро проверить "не сломали ли мы Gill rail клики" |
| **Нагорная и Gill — особые случаи** | P1 | Хирургические добавления, отдельные `data-fc-controls="gill-rail"` | Легко забыть при рефакторинге |

---

## 2. Что уже правильно сделано (не трогать без причины)

1. **Именование** — почти полностью перешли на `gb-*` (gb-ember, gb-save, gb-icon, gb-floater).
2. **Init guards** — контроллер правильно требует `[data-fc-root]` или `[data-fc-controls]`.
3. **Gill rail fix** — `initGillRail()` итерирует **все** контейнеры (была классическая регрессия "только первый").
4. **TTS** — реальная речь + правильная обработка rate + chunking (не просто `speak(text)`).
5. **Rollout audit** — отличный инструмент (должен оставаться blocking gate).
6. **Astro компоненты** — SingleArticleCluster + SeriesLite + GillRailControls — правильная архитектура.
7. **Single-active body class** — механизм сокрытия дублей работает.

---

## 3. Что **НЕ** стоит делать сейчас (риск регрессии очень высокий)

- **Не трогать позиционирование** `.gb-floater`, `.gb-floater--hermeneutics`, mobile pill без owner + pixelmatch.
- **Не менять размер** `.gb-ember` (36px / 32px / 34px) — было несколько revert'ов.
- **Не переписывать speed panel** (clip-path, morph, stagger) — это самая сложная часть.
- **Не удалять "лишние" стили в floating-cluster.css** без полной замены на премиум-компоненты.
- **Не трогать Нагорную** (sidebar + nagornaya-mobile-toc.js) — хирургическая зона.
- **Не объединять** BookmarkEngine и Favorites без отдельного плана (они решают разные задачи).

---

## 4. Что **стоит** делать (низкорисковые, высокополезные действия)

### Приоритет 1 (закрыть долги, не ломая поведение)

1. **Очистить fc-* debt в CSS**
   - Заменить/удалить оставшиеся `fc-single-active`, `fc-series-active`, `fc-btn` и т.д. на `gb-*` эквиваленты или удалить совсем.
   - Добавить в `audit-pro.js` или rollout-audit проверку на остатки `fc-` (кроме легаси-комментариев).

2. **Сделать floating-cluster.css тоньше**
   - Вынести Gill v16 специфичный код в отдельный файл или в компонент (сейчас он размывает "canonical").
   - Убедиться, что новые страницы используют только `premium-controls.css` + компонентные стили.

3. **Усилить rollout audit**
   - Добавить проверку, что на Gill rail все видимые `gb-ember` действительно внутри `[data-fc-controls="gill-rail"]`.
   - Добавить проверку keyboard shortcuts только там, где `data-fc-shortcuts="true"`.

4. **Добавить targeted regression smoke**
   - В `interactive-audit.js` или отдельный тест:
     - Hermeneutics: позиция floater относительно breadcrumb
     - Gill Part 1/2/3/Spravochnik: кликабельность rail controls + speed panel
     - Mobile: pill не вылезает за край на 360–390px
     - Speed selection → автостарт TTS

### Приоритет 2 (архитектурная гигиена)

- Разбить контроллер на модули внутри `js/` (theme.js, tts.js, favorites.js, speed-panel.js, gbs2.js) — **только после** того, как будет отдельный lane + все тесты.
- Создать `PremiumControls/README.md` с canonical contract (уже частично есть в AuditRepo).
- Добавить в `AGENTS.md` секцию "PremiumControls — protected subsystem" (как MapEngine и GBS2).

---

## 5. История регрессий — почему всё так сложно

Из коммитов и логов видно паттерн:

1. Делают "улучшение" позиции / размера / анимации.
2. Ломается либо Gill rail, либо Hermeneutics breadcrumb-level, либо mobile pill, либо visibility.
3. Делают revert или "position override".
4. Через 1–2 дня — новая проблема (TTS не стартует, speed panel не открывается, иконки огромные).
5. Откатывают снова.

**Корень:** 
- Один контроллер + один огромный CSS-файл обслуживают **4 разных визуальных мира** (standalone article, series-lite, GBS2 rich rail, Нагорная).
- Нет строгого разделения ответственности по вариантам.
- Каждый раз правят "глобально", а не в scoped компоненте + CSS.

---

## 6. Рекомендуемый хирургический план на ближайшие шаги

**Сейчас (низкий риск):**
1. Очистить `fc-*` остатки + добавить guard в rollout-audit.
2. Добавить 3–4 targeted smoke-проверки в interactive-audit / rollout-audit.
3. Зафиксировать текущий визуал (обновить baseline если нужно) и **заморозить** позиционирование на 1–2 недели.

**Следующий lane (только после owner approve):**
- Разделение контроллера + вынос Gill-специфики.
- Переход на `premium-controls.css` как единственный источник стилей.

**Никогда без отдельного плана:**
- Глобальный рефакторинг позиционирования.
- Изменение размеров ember (36/32/34).
- Объединение Favorites и BookmarkEngine.
- Правка speed panel морф-логики.

---

## 7. Вывод для владельца

**PremiumControls сейчас в лучшем состоянии за последние недели** (audit зелёный, rollout прошёл).

Но **архитектурно** это всё ещё хрупкая система из-за:
- Монолитного контроллера
- Огромного CSS
- Истории многократных правок позиции

**Самое безопасное сейчас** — не добавлять новые фичи и не двигать визуал, а **закрывать долги** (fc- классы, тесты, документация контракта).

Если хочешь закрывать "точно этот блок" — начинаем с очистки fc-debt + усиления аудита. Это даст максимальную защиту от регрессий с минимальным риском.

Готов выполнять точечные низкорисковые правки или готовить следующий lane-план. Скажи направление.