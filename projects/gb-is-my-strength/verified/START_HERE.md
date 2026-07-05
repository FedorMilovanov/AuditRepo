# 📋 OWNER ACTION SUMMARY — gospod-bog.ru

> Дата: 2026-07-05 | Source: `82de4f45` | 93+ audit passes consolidated  
> Единственный канон статусов: [`MASTER_BUG_MATRIX.md`](./MASTER_BUG_MATRIX.md)

---

## Общая картина

| | Кол-во |
|---|---|
| ✅ Закрыто | 41 |
| 🟠 P1 (блокеры качества) | 3 |
| 🟡 P2 (важно, не срочно) | 7 |
| 🟢 P3 (minor / cleanup) | 15 |
| 🔵 Рефакторинг | 4 |
| **Всего открыто** | **32** |

---

## ⚡ Требуют решения владельца (2 dispute)

### 1. BUG-SW-BASELINE-DRIFT — какой severity?

Один агент оценил как P0 («CI не фейлится на stale baseline»), другой — как P2 («документационный drift, SW работает корректно»).

**Факт:** `sw.js` CACHE_VERSION = `v187`, baseline JSON = `v182`. Разница 5 версий. CI использует `note()` не `bad()` при проверке. SW runtime работает корректно.

→ **Нужно ваше решение: P0 или P2?**

### 2. SEARCH-SCRIPTURE-BROKEN — P1 или P2?

Scope «Писание» в поиске не работает. 0/20 MDX передают `scripture:true`, layouts не принимают prop.

Один агент поставил P1, верификатор рекомендует P2 (feature gap, не runtime breakage — поиск работает, фильтр нет).

→ **Нужно ваше решение: P1 или P2?**

---

## 🟠 P1 — что починить первым (3)

| # | ID | Что | Оценка трудозатрат |
|---|---|---|---|
| 1 | AUDIT-P1-FC-IMP | `floating-cluster.css` — 490 `!important` без ceiling в audit-pro | Добавить 5 строк в `audit-pro.js`: ceiling для floating-cluster.css |
| 2 | BUG-PERF-001 | 294 addEventListener / 16 removeEventListener | Рефакторинг 5 JS-файлов. MPA смягчает (каждый navigate = новая страница). |
| 3 | SEARCH-SCRIPTURE-BROKEN | Scope «Писание» не работает | Добавить `scripture` field в MDX schema + ArticleLayout + search-manifest |

---

## 🟡 P2 — backlog (7)

| ID | Кратко |
|---|---|
| BUG-SW-BASELINE-DRIFT | SW baseline v182 vs v187 (5 версий drift) |
| AUDIT-P2-SW-PRECACHE-4 | SW precache содержит 4 lazy-loaded ассета |
| AUDIT-P2-WORKFLOWS-CHECK-GAP | check-workflows.js не валидирует deploy if-условия |
| AUDIT-P2-MATRIX-DRIFT | route-migration-matrix (35) ≠ page-ownership (54) ≠ sitemap (43) |
| BUG-SEO-001 | IndexNow submit до CDN propagation |
| NEW-CANONICAL-IZBRANNOE-01-GAP | canonicalSanityGuard не ловит noindex routes |
| BUG-ARCH-001 | = дубликат AUDIT-P2-SW-PRECACHE-4 |

---

## Что уже сделано за этот аудит-цикл

- **5 security фиксов** shipped (XSS innerHTML, safeUrl, CSP form-action, cache-bust Astro, .gitconfig)
- **3 CI фикса** shipped (indexnow push retry, :light gate alignment, actionlint wired)
- **4 cleanup** shipped (dead scripts, stale branches, robots.txt, og:image props)
- **2174→153 строк** — матрица реструктурирована из хаоса в читаемый документ
- **36 incoming pass-папок** архивированы
- **5 false positives** отклонены с evidence

---

## Правила для следующих агентов

1. **MASTER_BUG_MATRIX.md — единственный канон.** Не создавать параллельные truth-документы.
2. **Не плодить passes.** Новый pass оправдан только при: (а) новом source commit, (б) конкретной зоне не покрытой 93+ предыдущими passes.
3. **Аудитор ≠ фиксер.** Аудитор находит и документирует. Фиксит владелец или назначенный им агент.
4. **Incoming → archive после обработки.** Не копить десятки папок в incoming/.
5. **Conflict markers = blocker.** Перед push всегда `grep -c '<<<<<<' MASTER_BUG_MATRIX.md`.
