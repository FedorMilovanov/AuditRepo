# CURRENT_HEAD REVERIFY — 2026-07-14: main `bd8cb9a0` — CSS `!important` gate drift + release-contract break

**Verifier:** claude-auditor (Claude Code multi-agent session)
**Date:** 2026-07-14
**Source HEAD (authoritative):** `bd8cb9a0b14d8a71a51317ec7b954607337b9e78` (`git ls-remote origin main`; last commit 2026-07-13 20:17Z)
**Matrix tracked HEAD (stale):** `b8459bdf` — **does not exist as a git object** on current history (`git cat-file -t b8459bdf` → `fatal: Not a valid object name`)
**Intake verified:** `incoming/gpt-css-important-audit/2026-07-14/REPORT.md` (external GPT auditor, report-only)
**Method:** SHA-first. Independent reproduction (literal counts, in-repo gate execution, git-history root-cause) + **real failing CI logs** on `bd8cb9a0`. Labels per `verification/VERIFICATION_LEVELS.md`. Machine-readable witnesses: `incoming/gpt-css-important-audit/2026-07-14/evidence/verifier-witnesses.md`.

---

## 0. Why this pass (justified per START_HERE rule 2)

Матрица трекала `b8459bdf` и держала шапку «Deploy ✅ GREEN». Пришёл внешний отчёт GPT,
утверждающий, что на текущем `main` `site.css` нарушает `!important`-контракт и деплой красный.
Верификация обязательна: (1) сверить SHA, (2) воспроизвести заявления независимо, (3) отделить
подтверждённое от неподтверждённого, (4) добавить собственный анализ. Результат: **ядро отчёта
подтверждено на current HEAD реальным падающим CI**, HEAD в матрице устарел и вдобавок указывает на
несуществующий SHA — прод фактически КРАСНЫЙ, не зелёный.

---

## 1. HEAD reconciliation

| Что | Значение | Witness |
|---|---|---|
| Authoritative `main` | `bd8cb9a0` | `git ls-remote origin main` |
| Report's stated HEAD | `bd8cb9a0` | совпадает — отчёт на current HEAD |
| Matrix «Source HEAD» | `b8459bdf` | `git cat-file -t b8459bdf` → **not a valid object** |
| Matrix «Deploy GREEN @ b8459bdf run 29065454930» | несуществующий SHA | прод сейчас RED (см. §3) |
| Локальный ложный ref до fetch | `b21f2e6d` (07-07, «chore auto-update [skip ci]») | orphaned; не предок `bd8cb9a0` |

**Урок среды (повтор):** локальные checkout'ы молча откатывались/расходились (`b21f2e6d`).
Всегда `git fetch` + `git ls-remote` перед доверием ref. Здесь сделано.

---

## 2. `!important` contract — CONFIRMED release-blocking (P1)

### 2.1 Counts (`verified-source`)
```
site.css 210 · floating-cluster.css 503 · mobile-hotfix.css 142 · nagornaya-mobile-toc.css 135
home 34 · command-palette 7 · enhancements-runtime 1 · highlights-runtime 0 · sw-toast 0   (Σ9=1032)
```
- `site.css` = **210** (== GPT).
- `floating-cluster.css` = **503** — **отчёт оставил неподтверждённым**; верификатор подтвердил
  тремя способами (grep, node `/!important\b/`, сам гейт audit-pro). 503 ≤ ceiling 524 → ratchet OK,
  но **5× выше goal 100**.
- `mobile-hotfix.css` 142 == ceiling 142 (goal 0, 0 headroom); `nagornaya-mobile-toc.css` 135 == ceiling 135 (goal 50).

### 2.2 Two ceilings for one file (== GPT, `verified-source`)
- `package.json:123`: `css-layer-validator.js css/site.css --ceiling=202`
- `audit-pro.js:85`: `IMPORTANT_CEIL = 200`
- 210 > 202 **и** 210 > 200 → падают ОБА гейта. Понизить до 202 недостаточно — audit-pro всё равно требует ≤200.

### 2.3 Gate execution (`verified-build`)
`css-layer-validator.js` exit 1: «!important count 210 exceeds ceiling 202».
`audit-pro.js` exit 1: «css/site.css has 210 !important — exceeds ratchet ceiling 200».

### 2.4 Root cause pinpointed (`verified-source` — verifier-new; отвечает на §11 шаг 1 отчёта)
Регрессия **200 → 210** ровно в двух коммитах 2026-07-13:
`26266ee` (+8 → 208) и `e904670` (+2 → 210), оба «Нагорная проповедь». `git diff b2b42ce..bd8cb9a0`:
+126/−116 `!important` (минифицированный diff переписывает длинные строки) → **net +10**.
Добавленные декларации — преимущественно `transform/transition/animation:none!important`
(reduced-motion) и `color:#000!important`/`background:#fff!important` (контраст light/dark).
**Это настоящие WCAG-фиксы контраста и reduced-motion, а не случайный техдолг** → нельзя удалять
механически (категория A отчёта §6). Корректная развязка — архитектурная (выше специфичность / `@layer`),
не удаление.

---

## 3. Real CI on `bd8cb9a0` — production is RED (`verified-browser`/CI ground truth)

| Workflow | Run | Conclusion | Cause |
|---|---|---|---|
| Deploy to GitHub Pages #1568 | 29281815427 | 🔴 failure | `css:layer:validate` → «!important 210 exceeds ceiling 202», exit 1 |
| Metadata & IndexNow Readiness #1330 | 29281815491 | 🔴 failure | editorial-metadata registry: 5 записей отсутствуют (см. §5) |
| Visual Parity Guard — pixel-diff #383 | 29281815419 | 🔴 failure | корень не в захваченном хвосте лога — **не заявляю** |
| Native Source Contract #151 | — | 🟢 success | — |
| Shared Files Guard #950 | — | 🟢 success | — |

**Deploy убивает именно CSS-гейт** — реальный лог подтверждает логический вывод отчёта.
Замечание отчёта «нельзя утверждать, что CSS — единственная причина» — **верно**: Metadata-workflow
падает по независимой причине (§5). GPT назвал 3 workflow; здесь добавлен 4-й (Visual Parity).

**Sequencing (verifier-new):** деплой падает на `css:layer:validate` (в цепочке `validate:static-publication`
раньше `audit-pro.js`). Значит два других барьера **латентны**:
1. `css:layer:validate` ceiling 202 ← падает сейчас.
2. `audit-pro.js` site.css ceiling 200 ← всплывёт после (1).
3. `audit-pro.js` ALLOWED_JS `nagornaya-bar-extras.js` ← всплывёт после (2) (§4).
Даже приведя `site.css` к 202, зелёного не будет: нужно ≤200 **и** регистрация JS.

---

## 4. Second deploy-blocker — `nagornaya-bar-extras.js` unregistered (`verified-source`, verifier-new, P1 latent)

`js/nagornaya-bar-extras.js` добавлен `1c41b15` (та же «Нагорная» сессия), подключён во всех пяти
`NagornayaChastN PageFooter.astro` как `<script src="…/nagornaya-bar-extras.js?v=1" defer is:inline>` —
**реально используется**. Но:
- **нет** в `ALLOWED_JS` (`audit-pro.js:52-67`, 14 файлов) → `audit-pro` hard-fail «Forbidden JS files in js/».
- **нет** в `cache-bust-assets.js ASSETS` → cache-bust не хеширует его, застрял на плейсхолдере `?v=1`
  (нет инвалидации при изменении файла).

Triple-registration miss = конкретный новый инстанс `GATE-MARKER-DATA-DRIFT`. Фикс: добавить файл в
`ALLOWED_JS` **и** в `cache-bust-assets.js` (единый список), затем реальный cache-bust вместо `?v=1`.

---

## 5. Third deploy-blocker (независим от CSS) — editorial-metadata registry gap (`verified-source`, verifier-new, P1)

Workflow «Metadata & IndexNow Readiness» падает: `Eligible routes: 25 / Registry records: 20` → 5 маршрутов
без записи в `data/editorial-metadata.json` (структура `version/policy/sourceCommit/records`):
`dzhon-gill-chast-4-ekzeget`, `chto-bibliya-nazyvaet-serdcem`, `novoe-serdce`, `serdce-i-duh`, `serdce-spravochnik`.
Все 5 — новые статьи из сессий контента 2026-07-11..13 (Gill Ч.4 + серия «Сердце»); editorial-freeze baseline
не досинхронизирован при их добавлении. Проверено: все 5 slug'ов отсутствуют в файле. Фикс: до-сгенерировать/
добавить записи (той же процедурой, что вёл editorial-freeze baseline `native-source-contract-v1`).

---

## 6. CSS grammar defects — CONFIRMED (P2), all pass brace-only validator (== GPT)

Прямой pattern-search (не по byte-offset, т.к. offset'ы дрейфуют):

| ID | Дефект | Impact | Sev |
|---|---|---|---|
| CSS-SYNTAX-001 | `@media (prefers-reduced-motion:reduce){.bottom-bar,.btoc-link,.flip-card-inner,.h-article-card,.quiz-option}` — селекторный список без блока деклараций | reduced-motion защита не применяется | P2 a11y |
| CSS-SYNTAX-002 | `.ehrman-block,.info-box,.quote-box}` — висячий список, закрыт `}` без деклараций | контраст/оформление блоков не применяется | P2 a11y |
| CSS-SYNTAX-003 | `…,.resume-reading-title,@supports (animation-timeline:scroll())` — at-rule как член selector list | правило с этим prelude невалидно; reveal может отброситься | P2 |
| CSS-DEAD-004 | `@media (hover:hover) and (pointer:fine){html.dark }` — пустое правило | текущего эффекта нет | P3 |
| CSS-SYNTAX-005 | `.gbx-backlinks__maplink:rgba(122,46,46,0.08);gbx-backlinks__maplink:hover{…}` — `:rgba(…)` как псевдокласс, `;` в prelude, отсутствует `.` перед вторым селектором | hover-правило не применяется | P2 |

Все проходят действующие валидаторы, т.к. `css-layer-validator.js` и `audit-pro.js` считают только
**баланс скобок** (лог: «Brace balance: OK»), а не грамматику. Это делает открытый пункт **D-2** уже
не теоретическим — есть реальные witnesses. Восстанавливать потерянные декларации/повреждённый селектор —
по git history/blame, не по догадке (первые появления: `a426e1a`, 2026-07-11, серия «Сердце»).

---

## 7. Safe mechanical cleanup — CONFIRMED (P3, == GPT)

| Правка | Δ`!important` | Файл |
|---|---|---|
| дубль `html{scroll-behavior:smooth}` (×2 → ×1) | 0 | site.css |
| дубль `html.dark …summary-card{…!important}` (×2 → ×1) | **−1 (135→134)** | nagornaya-mobile-toc.css |
| nested `var()` self-fallback (×3 + ×2 → simplify) | 0 | nagornaya-mobile-toc.css |
| пустой `html.dark` fragment (blame first) | 0 | site.css |

Единственное независимо подтверждённое механически-безопасное снижение `!important` = **1**
(nagornaya 135→134, после чего можно опустить ceiling 135→134). Проблему `site.css 210>200` это не решает.

---

## 8. Carry-over rechecks on `bd8cb9a0`

- **BUG-011** (P3): **57** уникальных `px`-брейкпоинтов в `css/*.css` (матрица: 23) — вырос; 760/761/768 near-collision. `confirmed-current (worse)`.
- **D-2** (P2): layered = **21.2%** (матрица: 21.9%); только `site.css`; dup-selector skip ≥250k; порядок @layer не сверяется. `confirmed-current`, расширить witnesses.
- **D-3** (P3): JS total 14+sw = **469101** > 365000 (матрица: 375041) — `R.warn`, non-blocking. `confirmed-current (worse)`.
- **D-4** (P3): 8 magic z-index (mobile-hotfix ×1 `2102`; floating-cluster ×7 `2102/9999/3000/2147483000×3/2147483100`); строки в матрице устарели. `confirmed-current`, re-attribution needed.

---

## 9. NOT confirmed (оставлено честно)

- Первопричина падения «Visual Parity — pixel-diff» (хвост лога не показал корень).
- Точный авторский замысел повреждённого backlinks-селектора и потерянных accessibility-деклараций
  (восстанавливать по history, не по догадке).
- «CSS — единственная причина всех красных workflow» — **опровергнуто**: Metadata-workflow независим (§5).

---

## 10. Handoff (repair order, owner-gated где отмечено)

**P1 — вернуть publish contract (release транзакция, SUPER_AUDIT W1 — координировать с владельцем):**
1. `site.css` 210 → **≤200**: не трогать исторические a11y/legacy overrides; развязать именно +10 новых
   «Нагорная» директив архитектурно (scoped parent selector / `@layer` / выше специфичность), не удалением.
2. Зарегистрировать `js/nagornaya-bar-extras.js` в `ALLOWED_JS` + `cache-bust-assets.js`; реальный cache-bust вместо `?v=1`.
3. Добавить 5 отсутствующих editorial-metadata записей.
4. Унифицировать ceiling 202/200 в один источник конфигурации.
5. Прогнать `validate:static-publication` + перезапустить деплой; сверить, что все 3 барьера зелёные.

**P2 — грамматическая валидность + усиление CI:** восстановить SYNTAX-001/002/005 и @supports (SYNTAX-003)
по history; решить судьбу DEAD-004; добавить настоящий CSS-parser в валидатор, валидировать все core-stylesheets,
не пропускать большие файлы, проверять selector grammar (расширяет D-2).

**P3 — безопасный cleanup:** 2 дубля + nested `var()`; ratchet-down nagornaya 135→134.
