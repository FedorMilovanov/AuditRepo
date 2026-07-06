# AUDIT — gb-is-my-strength @ `36b815c2` (cycle 4)

> **Режим:** аудитор (наблюдение + отчёт, без правки кода). Отчёт на русском.
> **HEAD:** `36b815c2c2fd60f3acda2481b0186a9200ded241` (tip `origin/main`, 2026-07-06 вечер)
> **Дата аудита:** 2026-07-06 (arena-auditor, Node v22.12.0, `npm ci`)
> **Пред. аудитируемый HEAD:** `14a49be8` (cycle 1–3). HEAD **сдвинулся** — между ними 8 коммитов, включая новый Vosk TTS-движок.

---

## TL;DR

- 🔴 **CRITICAL / P1 — D-23 (NEW, deploy-блокирующая регрессия):** текущий HEAD `36b815c2` **НЕ деплоится**. Падает шаг `Gill mobile TOC and PlayEmber smoke` (`deploy.yml:158-159`, `npm run gill:mobile-play:smoke`) — 8 провалов на state-машине PlayEmber-плеера (`data-state` висит `idle`, двойной `speak` `[1,1.75]`, `cancels:7`). Последний GREEN-деплой — `28794737410` @ `14a49be8` (продакшн заперт на старом HEAD).
- ✅ **Локальные гейты зелёные:** `audit-pro.js` PASSED, `data:consistency` ✅, `gill:series:data:consistency:audit` ✅, `native:runtime:audit:strict` ✅ (51/53), `validate:all` ✅ (2 warning = D-19).
- 🔁 **Перепроверка старых D-:** D-21, D-22 — **RESOLVED** (проверено по исходникам против `365de509`); D-7 — **всё ещё OPEN** (коммит `437c6a33` пофиксил *другой* path-leak в AGENTS.md, мой D-7 в `PremiumControlAnchor.astro:3` не тронут); D-4, D-19, D-2 — OPEN; D-3 **ухудшился** (JS 375041 → 410104 из-за TTS).
- 📚 **Исследование Гилла:** выпущено отдельное досье со структурным предложением серии (`RESEARCH_gill-series-structure-proposal_2026-07-06.md`) — ответ на вопрос владельца «добавить Часть IV / Введение+1-2-3-4+Справочник».

---

## 1. Статус деплоя (главное)

| Run | HEAD | Результат | Шаг-убийца |
|---|---|---|---|
| `28827343079` | `36b815c2` | ❌ FAILURE (workflow_run, 2026-07-06T22:23Z) | `Gill mobile TOC and PlayEmber smoke` (deploy job) |
| `28827195846` | `365de509` | 🟡 cancelled (push) | — |
| `28824812731` | `86bec6ea` | ⏭ skipped (workflow_run) | — |
| `28824781006` | `86bec6ea` | ❌ FAILURE (push) | — |
| `28794737410` | `14a49be8` | ✅ SUCCESS (workflow_dispatch, 2026-07-06T13:22Z) | ← **продакшн** |

Источник: GitHub API `/actions/runs` + `/actions/runs/{id}/jobs` + job logs.
Аннотация шага: `.github:180 :: Process completed with exit code 1.` → шаг `Gill mobile TOC and PlayEmber smoke` (определение шага: `deploy.yml:158-159`).

**Вывод:** между `14a49be8` (GREEN) и `36b815c2` (FAIL) единственные коммиты, трогающие аудио/TTS — это фича **Vosk TTS** (`f7df07bd` feat, `92f27598` fix race/leak/alignment, merge `86bec6ea`). Это регрессия от этой фичи, а не инфра-таймаут как в D-17/D-18.

---

## 2. D-23 — Gill v16 mobile/play smoke: 8 провалов (NEW, P1)

**Симптом.** Тест `gill:mobile-play:smoke` (`scripts/gill-v16-mobile-play-smoke.js`, мокает Web Speech через `__ttsFake`) проверяет `.gb-ember[data-state]` и счётчики `speak`/`cancel`/`spokenRates`. Упало ровно 8 assertion'ов (все — play/speed/stop state-машина плеера; series-mark/flow-rail/TOC-проверки прошли):

```
❌ desktop 1440: first play tap -> playing            — ["idle","idle"]
❌ desktop 1440: second play tap -> paused            — ["idle","idle"]
❌ desktop 1440: speed select from idle starts once    — {"calls":2,"rates":[1,1.75]}
❌ desktop 1440: speed select from idle uses chosen 1.25× — [1,1.75]
❌ mobile 390:  first play tap -> playing             — ["idle","idle"]
❌ mobile 390:  second play tap -> paused             — ["idle","idle"]
❌ mobile 390:  third play tap -> resumed playing     — ["idle","idle"]
❌ mobile 390:  long press stop does not restart speech — {"beforeLong":1,"longPress":{"calls":2,"states":["idle","idle"],"cancels":7}}
```
Итог в логе: `Gill v16 mobile/play smoke failed: 8 issue(s).` → `##[error]Process completed with exit code 1.`

**Что это значит (интерпретация captured-состояний):**
- `data-state` остаётся `"idle"` после тапов Play → переход `idle→playing` не срабатывает (или завязан на async-готовность движка, а не на немедленный Web Speech fallback).
- `speed select from idle` дёргает `speak` **дважды** с `rates:[1,1.75]` (сначала дефолт 1, потом выбранная 1.75) вместо одного старта с выбранной скоростью → двойная привязка обработчиков play и speed.
- `long press stop` даёт `cancels:7` + `calls:2` → утечка/двойное биндингов событий.

**Гипотеза первопричины (наблюдение, не утверждение фикса):** интеграция Vosk TTS переписала play/speed/stop-обработчики v16-плеера. Класс «race/leak» уже чинился в `92f27598` («fix(tts): ... race/leak/alignment bugs from review») — но smoke-тест его всё ещё ловит. Двойной `speak` и «застывший» `idle` прямо указывают на double-invocation + state-transition, завязанный на async-готовность движка.

**Подозрительные файлы (для владельца — куда смотреть):**
- `src/components/ui/floating-cluster/PlayEmber.astro` — декларирует `data-state: idle | playing | paused | complete` (комментарий строка 6).
- `js/floating-cluster-controller.js` — обработчики play/speed/stop и управление `data-state` (строка ~234 «Управляет data-state и --p переменной»); `pickEngine()` (~324) предпочитает Vosk с откатом на Web Speech; rate читается из `gb:audio:rate`/`gbx-tts-rate` (~403); `cancelActiveEngine()` (~293).
- `js/vosk-tts-engine.js`, `js/vosk-tts-core.js` — Vosk-движок (async-загрузка wasm-модели).
- `js/site.js:98` — подавляет legacy `gbx-tts` оверлей, когда присутствует `.gb-ember` (=> v16-плеер «владеет» TTS на Gill-страницах).
- Тест: `scripts/gill-v16-mobile-play-smoke.js` (мок Web Speech через `__ttsFake`, asserts `data-state` + speak/cancel-счётчики + `spokenRates`).

**Отношение к D-15.** D-15 (Gill series-marks smoke, ждал 5 меток) — *другой* тест, уже RESOLVED. D-23 — state-машина Ember-плеера в том же `gill:mobile-play:smoke`, но провалы специфичны для play/speed/stop. То есть D-23 — genuinely new, не реопен D-15.

> Аудитор НЕ запускал браузер/не правил код (режим аудитора + OOM на full build в песочнице). Это наблюдение + точная локализация.

---

## 3. Перепроверка D-1..D-22 на новом HEAD

| ID | Было | Сейчас (cycle 4, `36b815c2`) | Доказательство |
|---|---|---|---|
| D-1 | OPEN | OPEN | `deploy.yml:50-52` concurrency cancel-in-progress (не менялось) |
| D-2 | OPEN | OPEN | `css:layer:validate` → **21.9%** layered (62404/222363), цель ≥80% |
| D-3 | OPEN (JS 375041) | OPEN, **ухудшено** | audit-pro: JS total **410104** > 365000 (TTS добавил ~35 КБ) |
| D-4 | OPEN | OPEN (6 вхождений, те же строки) | `floating-cluster.css:2372/2447/2504/2697/2882`, `mobile-hotfix.css:129`; токены `--z-*` (24 шт.) есть |
| D-7 | OPEN | **OPEN** (коммит `437c6a33` пофиксил *другой* leak в AGENTS.md, этот не тронут) | `src/components/ui/premium-controls/PremiumControlAnchor.astro:3` → `// See: AuditRepo/projects/gb-is-my-strength/PremiumControls/README.md §1` |
| D-8 | OPEN | OPEN | `deploy.yml` `paths:` не включает `*.md` |
| D-9 / D-20 | OPEN (ветки на origin) | OPEN | `git branch -r` всё ещё показывает `origin/claude/image-generation-query-3e8rd5`, `origin/claude/website-text-image-audit-9ep5z9` |
| D-19 | OPEN (2 warnings) | OPEN (те же 2) | `validate:all`: `20-antisovetov-pastoru`, `rimlyanam-7-veruyushchiy-ili-neveruyushchiy` (`<title>`≠`og:title`) |
| D-21 | RESOLVED (`365de50`) | **RESOLVED (подтверждено по исходникам)** | `js/glossary.js`: апгрейд-путь `l()` теперь `host.querySelector(".gtip-papyrus").innerHTML=detail` (был `textContent`) |
| D-22 | RESOLVED (`365de50`) | **RESOLVED (подтверждено по исходникам)** | `Favorites.astro`: `var safePath = /^\/(?!\/)/.test(rawPath) ? rawPath : '/';` — отсекает `javascript:`/`//host`; `safeImg` через `/^(https?:)?\/\//i` |
| D-14..D-18 | RESOLVED | RESOLVED | без изменений к этому HEAD |

**Локальные гейты (все зелёные, кроме известных warning):**
- `node scripts/audit-pro.js` → ✅ AUDIT PASSED (3 warning: CSS 464636>425000, JS 410104>365000, magic z-index ×6).
- `npm run data:consistency` → ✅.
- `npm run gill:series:data:consistency:audit` → ✅ (метки: context=Введение, part1=I, part2=II, part3=III, spravochnik=Справ.).
- `npm run native:runtime:audit:strict` → ✅ (51/53 strict-native; `/izbrannoe/` native-with-legacy-head 1.9%).
- `npm run validate:all` → 0 errors, 2 warnings (D-19).

---

## 4. Методика

- Node v22.12.0 (системный v20 ломает Astro ≥22.12); `npm ci` (~7 с, 477 пакетов).
- Статические гейты: `audit-pro.js`, `validate:all`, `data:consistency`, `gill:series:data:consistency:audit`, `native:runtime:audit:strict`.
- CI: GitHub API (`/actions/runs`, `/actions/runs/{id}/jobs`, job logs) — run `28827343079` и `28794737410`.
- Перепроверка D-21/D-22/D-7/D-4 — прямым чтением исходников на `36b815c2`.
- Full browser build НЕ запускался (OOM ~1 ГБ RAM в песочнице) — поэтому D-23 локализован по CI-логам + чтению кода, без локального воспроизведения.

---

## 5. Перекрёстные ссылки

- Матрица: `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` (блок «Re-audit cycle 4»).
- Пред. циклы: `AUDIT_gb-main_14a49be8_2026-07-06.md`, `..._cycle2.md`, `..._cycle3.md`.
- Гилл (исследование): `RESEARCH_gill-series-gaps-primary-sources_2026-07-06.md`, `RESEARCH_gill-theology-deep-dive_2026-07-06.md`, `RESEARCH_gill-series-structure-proposal_2026-07-06.md`.
- D-23 в матрице: см. cycle-4 блок.
