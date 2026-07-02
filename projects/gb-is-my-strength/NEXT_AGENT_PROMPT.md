# 🚀 ПРОМПТ ДЛЯ СЛЕДУЮЩЕГО АГЕНТА: Multi-Agent Execution & Verification (Pass 22+)

## ⚠️ КРИТИЧЕСКОЕ ВНИМАНИЕ (НЕ НАЧИНАЙТЕ С PASS 7, 8 ИЛИ 9!)

Аудит проекта **gospod-bog.ru (`gb-is-my-strength`)** ушёл далеко вперёд. Предыдущие агенты завершили **21 проход аудита** (включая глубокие проверки SEO, безопасности, производительности и архитектуры) и провели генеральную уборку репозитория от мусора и дубликатов матриц.

ЕДИНСТВЕННЫЙ канонический источник правды по багам находится здесь:
👉 `AuditRepo/projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`

Все устаревшие черновики и разрозненные матрицы (`VERIFIED_BUG_MATRIX_FINAL`, `MATRIX_PASS8`, `MASTER_BUG_MATRIX_2026-07-02` и др.) перемещены в архив `archive/2026-07-02-stale-matrices/`. **Не создавайте новых файлов матриц! При любых изменениях обновляйте только единую мастер-матрицу.**

---

## 🎯 ТЕКУЩАЯ МИССИЯ: Режим Исполнителя (Fix & Verify)

Ваша задача в режиме мультиагента — переходить от пассивного поиска к **активному закрытию верифицированных багов** в исходном репозитории (`/home/user/gb-is-my-strength`), проверять исправления автотестами и обновлять статус в `MASTER_BUG_MATRIX.md`.

### 📊 Топ приоритетов для немедленного исправления (P1 / P2):

1. **`NEW-50` [P2] + `NEW-51` [P2] (Publication Boundary): Internal `baptisty-rossii/research/**` попадает в production**
   - *Файлы в репо:* `scripts/copy-legacy-to-dist.js`, `scripts/dist-publication-audit.js`.
   - *Задача:* Исключить `baptisty-rossii/research/**` из `dist` и добавить nested/private/public-data whitelist guard, чтобы внутренние research/raw-source файлы и служебные JSON не публиковались.

2. **`NEW-52` [P2] (Pagefind): Baptist pages индексируются как 5–7 слов hidden snippet**
   - *Файлы в репо:* `src/pages/baptisty-rossii/*/index.astro`, `scripts/baptisty-series-shadow-audit.js`.
   - *Задача:* Перенести `data-pagefind-body` на реальный article/main content и добавить word-count guard.

3. **`BUG-041` [P2] (Sitemap/indexability): noindex karty holding pages попали в sitemap после fix-attempt**
   - *Файлы в репо:* `sitemap.xml`, `karty/*/index.html`, `migration/page-ownership.json`.
   - *Задача:* Убрать `noindex, follow` holding pages из sitemap и добавить явный contract/metadata для `indexable: false` production-dist routes.

4. **`NEW-53` [P2] (IndexNow/Deploy): IndexNow submit происходит до deploy**
   - *Файлы в репо:* `.github/workflows/indexnow.yml`, `.github/workflows/deploy.yml`.
   - *Задача:* Перенести отправку IndexNow после successful deploy.

5. **`NEW-46` [P2] (AI/SEO): `llms.txt` частично исправлен, но всё ещё неполный**
   - *Файл в репо:* `llms.txt`.
   - *Задача:* Покрыть `/` и Nagornaya routes или явно зафиксировать scope-фильтр.

6. **`BUG-003` [P2] (CI/CD): Рассинхрон оркестрации SW gate**
   - *Файл в репо:* `package.json`
   - *Задача:* Добавить вызов `sw:dist:audit` в CI-команду `validate:static-publication`.

7. **`BUG-008` [P2] (Data): Консистентность времени чтения в search-manifest**
   - *Файлы в репо:* `data/series.json`, `data/search-manifest.json`
   - *Задача:* `BUG-007` уже нормализован в `f284fc60`; проверить и закрыть оставшийся `BUG-008` — добавить/синхронизировать недостающие поля `readTime`/`readingTime` в `search-manifest.json`.

8. **`BUG-001` [P1] (Runtime): Утечка памяти в `floating-cluster-controller.js`**
   - *Файл в репо:* `js/floating-cluster-controller.js`
   - *Задача:* Добавить механизм очистки слушателей событий (`removeEventListener` или `AbortSignal`) при демонтаже или смене состояния компонентов.

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
