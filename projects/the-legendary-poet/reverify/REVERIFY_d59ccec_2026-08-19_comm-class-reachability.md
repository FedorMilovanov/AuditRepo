# COMM-class reachability + hosting redirect contract — reverify at Product `d59ccec`

**Date:** 2026-08-19
**Agent:** Arena Agent (bugverifikator, arena)
**Findings touched:** `TLP-COMM-ABUSE-001` (P1), `TLP-COMM-DELIVERY-001`, `TLP-COMM-ORDER-001`, `TLP-COMM-READSTATE-001`, `TLP-COMM-TARGET-001`, `TLP-COMM-A11Y-001`, `TLP-COMM-TEXT-001`, `TLP-ROUTE-REDIRECT-001`
**Disposition:** `RE-ANCHORED (boundary), NOT CLOSED` + `CONFIRMED-CURRENT (measured)`
**Audited anchor:** Product `main` `d59ccec`
**Artifact identity:** `/assets/index-CkIy1PrE.js` + 15 lazy chunks = 867 702 bytes; `Last-Modified: Tue, 11 Aug 2026 00:00:27 GMT`; `Server: GitHub.com`
**Live snapshot:** `https://thelegendarypoet.ru`, 2026-08-19
**Production claim:** `yes`
**Intake:** `../incoming/arena-bugverifikator/2026-08-19/README.md`
**Product lane not touched:** PR #420 `repair/community-cloudflare-authority`

---

## 1. Original claims

`TLP-COMM-ABUSE-001` (единственный P1): «Caller-controlled community identity remains public uniqueness/rate-limit authority; fresh tabs can bootstrap different UUIDs and target membership is not server-canonical».

Шесть смежных P2-строк описывают client↔server drift: доставку/ACK (`DELIVERY`), серверный порядок (`ORDER`), правду чтения (`READSTATE`), целевое состояние (`TARGET`), live-статусы мутаций (`A11Y`), Unicode/пробелы в тексте комментария (`TEXT`).

`TLP-ROUTE-REDIRECT-001`: «Client-only redirects have no Pages source docs while preview QA assumes successful initial response».

## 2. What was measured

### 2.1 Артефакт: remote-слой отсутствует в продовом билде

Скачаны все JS-файлы продового билда (entry + 15 lazy-чанков из графа `import()`):

```text
total shipped JS ................ 867 702 bytes (16 files)
"supabase" / "apikey" / "rest/v1" / "Bearer " ........ 0 / 0 / 0 / 0
"tlp_ratings_public" / "tlp_comments_public" / "tlp_feedback_summary_public" ... 0 / 0 / 0
JWT-подобные строки ............. 0
```

### 2.2 Source: механизм, объясняющий отсутствие

`src/utils/communityRemote.ts:26-39` вычисляет `remoteEnabled = Boolean(URL && KEY)` из build-time `import.meta.env.VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`; `.github/workflows/deploy.yml:136-137` подставляет их из repo variables. При пустых переменных Vite инлайнит `undefined`, `remoteEnabled` сворачивается в `false`, а ветки с транспортом и строковые константы имён вью удаляются как мёртвый код. Наблюдаемый артефакт этому полностью соответствует.

### 2.3 Контраст: аналитические переменные того же пайплайна подставлены

В том же артефакте инлайнены `"111079696"` (Yandex Metrika) и `"G-6NT4248RKK"` (GA4) из `src/utils/analytics.ts:22,26`, а строки `mc.yandex`/`gtag`/`dataLayer` присутствуют в отдаваемом JS. Значит деплой умеет подставлять repo-переменные, и отсутствие Supabase-конфигурации — состояние именно этих переменных, а не общий сбой окружения сборки. Побочный вывод: `TLP-ANALYTICS-CONSENT-001` и `TLP-ANALYTICS-ROUTE-001` остаются полностью current (запуск гейтится согласием — `analytics.ts:46,88`).

### 2.3 UI не искажает состояние

`CommunityPanel.tsx:51-56` при `phase === 'local'`: «Локальный режим: ответы сохраняются только в этом браузере». `RatingsPage.tsx:188`: «Сейчас показаны данные этого браузера; общий backend не подключён». Ложного обещания в интерфейсе нет.

## 3. Disposition

**P1 `TLP-COMM-ABUSE-001` — не закрывать, но переякорить границу.** Заявленная поверхность (публичная уникальность/rate-limit, ротация UUID, неканоничное членство target) требует включённого общего бэкенда. На билде `d59ccec` транспорта нет, значит на текущем проде поверхность **недостижима**. Строка остаётся валидной как контракт для remote-enabled сборки и как вход в лану PR #420; статус корректнее читать как `CONFIRMED-FOR-REMOTE-ENABLED-BUILDS`, а не «эксплуатируемо прямо сейчас».

Практическое следствие для приоритезации: включение community-authority — это **релизный гейт**, а не «фон». Пока remote выключен, риск равен нулю; в момент включения он становится немедленным, поэтому anti-abuse authority должен приехать в том же релизе, что и включение переменных сборки.

**Шесть P2 COMM-строк** остаются, но их формулировки о client↔server расхождении применимы к remote-enabled конфигурации. Локальная часть (валидация, cooldown, многовкладочность, Unicode-фиделити текста) продолжает действовать и на текущем билде — эти части не переякориваются.

**`TLP-ROUTE-REDIRECT-001` — подтверждена и измерена.** 5 из 5 объявленных legacy-путей отдают HTTP 404 на проде; тело 404 грузит SPA (`<div id="root">` + `/assets/index-CkIy1PrE.js`), поэтому человек доезжает клиентским `<Navigate>`, а краулер получает `404` + `noindex,follow` без canonical. Дополнительно: в репозитории две недействующие для GitHub Pages конфигурации маршрутизации — `vercel.json` и `public/_redirects`.

## 4. Что не проверялось

Браузерного рантайма в этом проходе не было: `TLP-THEME-001`, `TLP-A11Y-RUNTIME-001`, `TLP-A11Y-CONTRAST-001`, `TLP-A11Y-MOTION-001`, `TLP-A11Y-STATUS-001`, `TLP-AUDIO-SESSION-001`, `TLP-AUDIO-COMPLETION-001`, `TLP-ANALYTICS-*`, `TLP-READING-PROGRESS-001`, `TLP-SHELL-NOISE-001` не подтверждались и не оспаривались. Сборка Product локально не запускалась. Repo variables недоступны выданному токену (`403`), поэтому вывод §2 опирается на артефакт + механизм, а не на прямое чтение конфигурации.

## 5. Ledger/queue actions

- MASTER: переякорить границу P1 и уточнить формулировку `TLP-ROUTE-REDIRECT-001` точным замером (5/5 → 404, SPA-boot в теле 404, две мёртвые hosting-конфигурации).
- `WORK_QUEUE.md`: добавить `RATINGS-PROMISE-VS-CAPABILITY` — `/ratings` индексируется с описанием «сводный читательский рейтинг», пока агрегата на билде нет (в самой странице предупреждение есть); и `ESSAY-DEAD-COVER-FIELDS` — 4 несуществующих `.jpg` в базовых `cover`/`cardCover` (`brikCase.ts:13-14`, `mayakovskyGromovoy.ts:13-14`), перекрытых visual-слоем до экспорта, поэтому на проде картинки целы.
- Ни одна строка не снимается: закрывать COMM-класс нельзя, пока лана PR #420 не приехала.
