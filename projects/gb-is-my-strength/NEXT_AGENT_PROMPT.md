# 🔴 CURRENT HANDOFF ADDENDUM — 2026-07-03 Pass 30 (READ FIRST)

**Current source HEAD:** `dbd0bb55`

**Current CI:** `Deploy to GitHub Pages` is **red** on run `28679684009`.

**Failed step:** `Gill mobile reference layout audit`.

## Verified current blocker

`CI-P0-GILL-RUNTIME-REFS` is the top priority before any P1/P2 cleanup. It remains verified-current after source advanced from `b4b312a8` to `dbd0bb55` (`e2f0ae4e` Gill rail/frame commit did not retire the runtime errors):

- `js/highlights.js` throws `ReferenceError: r is not defined` from a strict IIFE assignment to undeclared `r` while injecting `/css/highlights-runtime.css`.
- `js/site.js` throws `ReferenceError: tt is not defined` at backlink rendering line 484 (`a.innerHTML=tt(n.title)+...`).
- Broader `dist/` smoke: after filtering localhost favicon CSP noise, 33/52 routes have relevant runtime pageerrors (`r` on 32 routes, `tt` on 15 routes).
- Additional current bug: `/nagornaya/` throws `SiteUtils is not defined` because `nagornaya-mobile-toc.js` is loaded before `/js/site-utils.js` but immediately calls `SiteUtils.ready(...)`.
- Reproduced locally after `npm run strangler:build:production-like` + Playwright Chromium/deps: `npm run gill:mobile-layout:audit` → 40 pageerrors (20 + 20).
- Control witnesses pass: `node --check js/*.js`, `npm run css:layer:validate`, `npm run tokens:check`, `npm run gill:mobile-play:smoke`.

Full evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-03_ci-red-b4b312a-runtime-reference-errors.md`.

## Fixed-current stale blocker

The older `css:layer:validate` failure on deleted `css/site-layered.css` is already fixed-current by source commit `a65874a0`; current script validates `css/site.css`. Do **not** reopen that as current.

## Role discipline

If operating as **auditor**, do not edit source. Update only AuditRepo evidence/matrix.

If operating as **executor**, use a SYSTEM lane and run at minimum:

```bash
for f in js/*.js; do node --check "$f"; done
npm run strangler:build:production-like
npx playwright install --with-deps chromium
npm run gill:mobile-layout:audit
npm run gill:mobile-play:smoke
npm run validate:static-publication
npm run guard:shared-files
```

---

# 🚀 ПРОМПТ ДЛЯ СЛЕДУЮЩЕГО АГЕНТА: Multi-Agent Execution & Verification (Pass 22+)

## ⚠️ КРИТИЧЕСКОЕ ВНИМАНИЕ (НЕ НАЧИНАЙТЕ С PASS 7, 8 ИЛИ 9!)

Аудит проекта **gospod-bog.ru (`gb-is-my-strength`)** ушёл далеко вперёд. Предыдущие агенты завершили **21 проход аудита** (включая глубокие проверки SEO, безопасности, производительности и архитектуры) и провели генеральную уборку репозитория от мусора и дубликатов матриц.

ЕДИНСТВЕННЫЙ канонический источник правды по багам находится здесь:
👉 `AuditRepo/projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`

Все устаревшие черновики и разрозненные матрицы (`VERIFIED_BUG_MATRIX_FINAL`, `MATRIX_PASS8`, `MASTER_BUG_MATRIX_2026-07-02` и др.) перемещены в архив `archive/2026-07-02-stale-matrices/`. **Не создавайте новых файлов матриц! При любых изменениях обновляйте только единую мастер-матрицу.**

---

## 🎯 ТЕКУЩАЯ МИССИЯ: Режим Исполнителя (Fix & Verify)

Ваша задача в режиме мультиагента — переходить от пассивного поиска к **активному закрытию верифицированных багов** в исходном репозитории (`/home/user/gb-is-my-strength`), проверять исправления автотестами и обновлять статус в `MASTER_BUG_MATRIX.md`.

### 📊 Топ приоритетов для следующего пакета исправлений (Архитектура и производительность P1 / P2):

1. **`BUG-002` [P1] (Architecture): Дедубликация 45 компонентов `*PageHead.astro` / `*PostArticle.astro`**
   - *Файлы в репо:* `src/components/**/PageHead.astro`, `*PostArticle.astro`.
   - *Задача:* Выделить единый базовый компонент `<BaseArticleHead>` и сократить копипаст на 92–93%.

2. **`BUG-006` [P2] (Performance): Монолитный бандл `site.js` (162.8 KB)**
   - *Файл в репо:* `js/site.js`.
   - *Задача:* Вынести неиспользуемые на старте модули в отдельные чанки или завершить переход на модульную декомпозицию.

3. **`NEW-43` [P2] + `NEW-44` [P3] (Image Performance / CLS): Отсутствие атрибутов `width`/`height` и `loading="lazy"`**
   - *Файлы в репо:* `src/components/articles/`, `src/components/home/HomeSections/`.
   - *Задача:* Добавить явные размеры и ленивую загрузку для карточек и миниатюр, не нарушая визуальное сходство (visual parity).

4. **`BUG-010` & `BUG-011` [P2] (CSS Architecture): Хаос с брейкпоинтами и перекрытие на 768px**
   - *Файл в репо:* `css/site.css`.
   - *Задача:* Нормализовать медиа-запросы к стандартным токенам дизайн-системы и устранить 1px коллизии (`max-width: 767.98px` vs `min-width: 768px`).

### ✅ Завершённый и закрытый блок (Пакеты 1, 2, 3 от 2026-07-02/03):
- `P0-FC-REC` (бесконечная рекурсия в `floating-cluster-controller.js`) → ✅ ЗАКРЫТО (коммит `ca6a25a8`).
- `P1-DEPLOY-FAIL` (запуск деплоя при падении indexnow) → ✅ ЗАКРЫТО (коммит `29b49df0`).
- `NEW-50` & `NEW-51` (утечка research-файлов в dist) → ✅ ЗАКРЫТО (коммит `36003b91`).
- `NEW-52` (Pagefind индекс 5 слов на статьях баптистов) → ✅ ЗАКРЫТО (коммит `36003b91`).
- `NEW-53` (преждевременный IndexNow submit в CI) → ✅ ЗАКРЫТО (коммит `36003b91`).
- `NEW-48` (Stored XSS в виджете избранного) → ✅ ЗАКРЫТО (коммит `f284fc60`).
- `NEW-46` (100% покрытие 53 роутов в `llms.txt`) → ✅ ЗАКРЫТО (коммиты `f284fc60`, `bba171af`).
- `BUG-041` (удаление holding pages из sitemap) → ✅ ЗАКРЫТО (коммит `36003b91`).
- `BUG-001` (утечка памяти в `floating-cluster-controller.js`) → ✅ ЗАКРЫТО (коммит `36003b91`).
- `BUG-007` & `BUG-008` (нормализация времени чтения) → ✅ ЗАКРЫТО (коммиты `f284fc60`, `36003b91`).
- `BUG-009` (стандартизация на `assetUrl()`) → ✅ ЗАКРЫТО (коммит `4a367a9c`).
- `NEW-47` (подключение React-древа генеалогии на `/rodosloviye/`) → ✅ ЗАКРЫТО (коммиты `4a367a9c`, `bba171af`).
- `NEW-49` (удаление Google Fonts из 3D-карты баптизма) → ✅ ЗАКРЫТО (коммит `ac132c88`).
- `NEW-28` / `NEW-29` / `NEW-31` / `NEW-32` (добавление `_headers` для HSTS, X-Frame-Options, CSP frame-ancestors) → ✅ ЗАКРЫТО (коммит `bba171af`).

9. **`BUG-002` [P1] (Architecture): Дедубликация 45 компонентов PageHead/PostArticle**
   - *Задача:* Создать базовый компонент `<BasePageHead>` и перевести на него компоненты раздела.

---

## 🛠 ПОРИЯДОК РАБОТЫ (Workflow)

1. **Синхронизация:** Убедитесь, что вы работаете с актуальными ветками `main` в обоих репозиториях:
   ```bash
   cd /home/user/AuditRepo && git pull origin main
   cd /home/user/gb-is-my-strength && git pull origin main
   ```
2. **Исправление в коде:** Внесите точное точечное исправление в `/home/user/gb-is-my-strength`.
3. **Локальная верификация:** Запустите проверки:
   ```bash
   cd /home/user/gb-is-my-strength
   npm run validate:all
   ```
4. **Обновление матрицы:** Откройте `/home/user/AuditRepo/projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`, переведите статус исправленного бага в `✅ Fixed (Pass 22+)` и укажите коммит/доказательство.
5. **Коммит и пуш:** Не плодите лишние отчёты! Закоммитьте изменения в целевой репозиторий и обновите матрицу в AuditRepo. Не возвращайте старую формулировку `BUG-041` как “missing sitemap routes”: Pass 21 показал, что `f284fc60` добавил noindex holding pages в sitemap. Правильная задача — убрать noindex pages из sitemap и развести production-dist/indexable metadata.

---

## 🚫 ЧЕГО НЕ ДЕЛАТЬ (Правила гигиены репозитория)
1. **НЕ плодите новые MD-файлы** матриц, саммари и черновиков в корне или в `verified/`.
2. **НЕ верьте слепо старым отчётам** в `incoming/` — проверяйте факты живым `grep` или запуском скриптов.
3. **НЕ создавайте галлюцинаций:** Баг `SEO-001` (якобы пустой JSON-LD в серии Джон Гилл) был опровергнут ранее и является ложной тревогой — не открывайте его заново! Также не открывайте заново `BUG-041` как простой sitemap gap: Pass 21 re-triage показал проблему noindex pages in sitemap after fix-attempt.

Удачи в закрытии технического долга! 🚀
