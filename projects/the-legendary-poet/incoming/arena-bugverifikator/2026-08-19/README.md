# Intake — arena-bugverifikator: static/discovery/delivery pass + COMM-class reachability witness

## Identity

- Project: `the-legendary-poet`
- Source repo: `FedorMilovanov/TheLegendaryPoet`
- Agent: Arena Agent (bugverifikator, arena) — audit-only, **никаких правок в Product не вносилось**
- Date: 2026-08-19 (repo-effective time)
- Audited anchor: Product `main` **d59ccec** (`assets(yesenin): publish approved Part II premium cover (#415)`, 2026-08-10T23:52:42Z) — HEAD на момент прохода
- Artifact identity: production JS bundle `/assets/index-CkIy1PrE.js` + 15 lazy-чанков (868 702 байт суммарно); `Last-Modified: Tue, 11 Aug 2026 00:00:27 GMT`, `Server: GitHub.com` (GitHub Pages)
- Live snapshot: `https://thelegendarypoet.ru` — 29 URL из `sitemap.xml` + `/hall`, `/archive`, 5 legacy-редиректов, 404-путь; снято 2026-08-19
- Branch/event context: `main` @ `d59ccec`; активные Product PR: **#420** `repair/community-cloudflare-authority` (владеет community-authority — в него не вмешивался), **#417**, **#416** (editorial)
- Environment: read-only clone Product + live production fetch; сборка не запускалась (node в песочнице отсутствует), браузерного рантайма нет
- Report type: `verifier-synthesis` (+ `production-like-dist-audit`, `browser-audit`(HTTP-only) witnesses)

## Метод (с учётом урока прошлой волны)

Весь разбор HTML — **порядко-независимый** (атрибуты `<meta>`/`<link>` парсятся в словарь, а не регуляркой с фиксированным порядком). Все ответы читаются целиком, без `read(N)`. Оба ограничения в прошлом проходе по соседнему проекту дали ложные находки, здесь они сняты.

---

## 1. TL;DR

| # | ID | Класс | Что | Состояние |
|---|---|---|---|---|
| 1 | `COMM-REMOTE-DISABLED-PROD` | boundary-witness для 7 строк MASTER | Продовый бандл **не содержит remote-слоя сообщества вообще**: 0 вхождений `supabase`, `apikey`, `rest/v1`, `Bearer`, `tlp_ratings_public`/`tlp_comments_public`/`tlp_feedback_summary_public` на 868 702 байта JS. `remoteEnabled=false` ⇒ публичная поверхность злоупотреблений на текущем live-билде **недостижима**. | NEW witness · переякорить границы, строки не снимать |
| 2 | `TLP-ROUTE-REDIRECT-001` | точный замер существующей строки | Все **5** объявленных legacy-редиректов отдают **HTTP 404**; тело 404 грузит SPA, поэтому человек доезжает клиентским `<Navigate>`, а бот получает 404 + `noindex,follow` без canonical. | CONFIRMED · уточнить формулировку |
| 3 | `RATINGS-PROMISE-VS-CAPABILITY` | narrow observation | `/ratings` проиндексирован с описанием «Сводный читательский рейтинг… оценки, комментарии», тогда как на текущем билде агрегата нет — данные только этого браузера (в самой странице это честно написано). | NEW · в `WORK_QUEUE.md`, не в MASTER |
| 4 | negative results | — | 29/29 sitemap-URL 200, 148/148 ссылок из head/JSON-LD/manifest 200, 0 ошибок JSON-LD, 0 дублей title/canonical, паритет дат sitemap↔feed↔JSON-LD **идеальный**, 14/14 чанков в бюджете, аудио с `Accept-Ranges` и 206, секретов в бандле нет. | §5 |

---

## 2. `COMM-REMOTE-DISABLED-PROD` — главная находка прохода

### Что измерено

Скачаны все JS-артефакты продового билда (entry + 15 lazy-чанков из `import()`-графа) и просканированы на отпечатки remote-слоя:

```text
total shipped JS ................ 867 702 bytes (16 files)
"supabase" ...................... 0
"apikey" ........................ 0
"rest/v1" ....................... 0
"Bearer " ....................... 0
"tlp_ratings_public" ............ 0
"tlp_comments_public" ........... 0
"tlp_feedback_summary_public" ... 0
JWT-подобных строк .............. 0
```

### Механизм (source, W2)

`src/utils/communityRemote.ts:26-39`:

```ts
const URL = (VITE_ENV?.VITE_SUPABASE_URL ?? LOOPBACK_TEST_CONFIG?.url ?? NODE_ENV?.VITE_SUPABASE_URL)?.replace(/\/$/, '');
const KEY = VITE_ENV?.VITE_SUPABASE_ANON_KEY ?? LOOPBACK_TEST_CONFIG?.key ?? NODE_ENV?.VITE_SUPABASE_ANON_KEY;
export const remoteEnabled = Boolean(URL && KEY);
```

`.github/workflows/deploy.yml:136-137` подставляет их из **repo variables** (`vars.SUPABASE_URL`, `vars.SUPABASE_ANON_KEY`). Vite инлайнит `import.meta.env.VITE_*` на этапе сборки: если переменные пустые, `remoteEnabled` сворачивается в `false`, а все ветки с fetch/URL/view-именами удаляются как мёртвый код. Именно это и наблюдается в артефакте — не осталось даже строковых констант имён вью.

### Почему это важно для матрицы

Единственная строка **P1** `TLP-COMM-ABUSE-001` описывает публичную поверхность: «caller-controlled community identity remains public uniqueness/rate-limit authority». Эта поверхность существует **только когда remote включён**. На текущем live-билде:

- запись/чтение сообщества не уходит наружу (нет транспорта);
- «свежие вкладки с разными UUID» не могут повлиять на общие данные — общих данных нет;
- DB-uniqueness/rate-limit нечего обходить.

То же условие распространяется на `TLP-COMM-DELIVERY-001`, `TLP-COMM-ORDER-001`, `TLP-COMM-READSTATE-001`, `TLP-COMM-TARGET-001`, `TLP-COMM-A11Y-001`, `TLP-COMM-TEXT-001` в той части, где они говорят о client↔server drift.

**Строки снимать нельзя** — архитектура сообщества активно перерабатывается в открытом PR #420 (`repair/community-cloudflare-authority`), и как только authority включат, поверхность вернётся. Правильное действие — переякорить границу: «применимо к remote-enabled сборкам; продовый билд `d59ccec` отдаёт local-only».

### Контрольный контраст: другие build-time переменные **подставлены**

Чтобы отделить «переменных вообще нет в сборке» от «именно community-переменные пусты», тот же бандл просканирован на аналитику:

```text
inlined Yandex Metrika ID ... "111079696"   (src/utils/analytics.ts:22 → инлайн в бандле)
inlined GA4 ID .............. "G-6NT4248RKK" (src/utils/analytics.ts:26)
mc.yandex / gtag / dataLayer ... присутствуют в отдаваемом JS
```

То есть пайплайн деплоя **успешно подставляет** свои repo-переменные — просто `SUPABASE_URL`/`SUPABASE_ANON_KEY` на этом билде пусты. Вывод §2 не является артефактом «пустого окружения сборки».

Следствие для матрицы: строки `TLP-ANALYTICS-CONSENT-001` и `TLP-ANALYTICS-ROUTE-001` **остаются полностью current** — аналитика на проде сконфигурирована. Запуск гейтится согласием (`analytics.ts:46,88`: выход, если `getAnalyticsConsent() !== 'granted'`), в начальном HTML сторонних скриптов нет; поведение отзыва согласия без браузера не проверялось.

### Чего здесь **нет** (проверено отдельно)

Продукт не выдаёт локальный режим за общий: `src/components/community/CommunityPanel.tsx:51-56` при `phase === 'local'` рендерит «Локальный режим: ответы сохраняются только в этом браузере», `src/pages/RatingsPage.tsx:188` — «Сейчас показаны данные этого браузера; общий backend не подключён». Дефекта «ложное обещание в UI» нет.

Claim boundary: продовый артефакт от 2026-08-11 (билд main `d59ccec`) + source `d59ccec`.
Preservation boundary: не трогать лану PR #420; вывод — про **достижимость** поверхности, а не про её правильность.
Semantic owner: `src/utils/communityRemote.ts` + `deploy.yml` (build-time config), архитектурно — лана Cloudflare authority.

---

## 3. `TLP-ROUTE-REDIRECT-001` — точный live-замер

`src/routes/route-contract.json` объявляет 5 legacy-редиректов; `src/App.tsx:147-149` реализует их клиентским `<Navigate replace>`. Продовая проверка (GitHub Pages):

| Legacy-путь | Цель по контракту | HTTP на проде |
|---|---|---|
| `/articles/article-1` | `/poets/alexander-pushkin` | **404** |
| `/articles/article-2` | `/essays/yesenin-kutezhi` | **404** |
| `/articles/article-3` | `/poets/anna-akhmatova` | **404** |
| `/articles/article-main-1` | `/articles` | **404** |
| `/articles/article-main-2` | `/music` | **404** |

Тело 404-ответа (5049 байт) содержит `<div id="root">` и `/assets/index-CkIy1PrE.js`, то есть SPA загружается и человек в итоге попадает на цель. Но начальный ответ — `404` с `<meta name="robots" content="noindex,follow">` и **без** canonical: для краулера legacy-URL мёртв, передачи ссылочного веса нет.

Дополнительный факт хостинга: в репозитории лежат **две** конфигурации маршрутизации, ни одна из которых не действует на GitHub Pages — `vercel.json` (`rewrites` на `/index.html`) и `public/_redirects` (`/*  /index.html  200`, формат Netlify/Cloudflare). Прод отвечает `Server: GitHub.com`. Это ровно тот «hosting-contract» разрыв, который описывает строка; теперь он измерен.

---

## 4. `RATINGS-PROMISE-VS-CAPABILITY` — узкое наблюдение (в очередь, не в матрицу)

`/ratings` индексируется с `description` и JSON-LD «Сводный читательский рейтинг русских поэтов: оценки, комментарии и прозрачная методика». На текущем билде агрегата не существует — виден только локальный срез браузера, о чём страница честно предупреждает. Расхождение — между **проиндексированным обещанием** и **отдаваемой возможностью**, а не внутри UI. Пока community-authority не включён, разумнее либо смягчить формулировку description, либо принять как временное состояние. Отдельной строки MASTER не требует.

---

## 5. Negative results (проверено — чисто)

| Проверка | Объём | Результат |
|---|---|---|
| Доступность sitemap-маршрутов | 29 URL | 29 × 200 |
| `canonical` соответствует пути | 29 страниц | 0 расхождений, 0 дублей |
| `<title>` уникальность | 29 страниц | 0 дублей, 0 пустых |
| `description` / `og:title` / `og:description` / `og:image` / `og:url` | 29 страниц | присутствуют везде, `og:url == canonical` |
| JSON-LD парсится | все блоки на 29 страницах | 0 ошибок |
| `robots` meta | 29 страниц | присутствует; `/hall` = `noindex,follow`, `/archive` = `noindex,nofollow` — корректно |
| Все same-origin URL из head/JSON-LD/manifest | 148 адресов | 148 × 200 (иконки, og-картинки, шрифты, hero-webp) |
| Полнота sitemap | 10/10 поэтов, 8/8 эссе, 3/3 трека | пропусков и лишних нет |
| Паритет дат `sitemap lastmod` ↔ `feed updated` ↔ JSON-LD | 29 страниц / 11 записей фида | **0 расхождений** |
| Внутренние ссылки из prerender | 6 уникальных целей | 0 битых |
| 404-семантика | `/nonexistent`, `/poets/does-not-exist`, `/essays/` | настоящий 404 + `noindex` |
| Аудио | 3 трека | 200, `Accept-Ranges: bytes`, Range → 206 (перемотка работает); MIME `audio/mp3` вместо `audio/mpeg` — косметика хостинга |
| Бюджеты маршрутов `budgetBytes` | 14 маршрутов | 14/14 в бюджете (макс. использование 75 % на `/poets/:id`) |
| Секреты в отдаваемом JS | 868 КБ | 0 (нет JWT, ключей, service_role, endpoint-ов) |
| Мёртвые обложки `cover`/`cardCover` (`brikCase.ts:13-14`, `mayakovskyGromovoy.ts:13-14` → 4 несуществующих `.jpg`) | 2 файла данных | **не дефект**: `brikCaseVisual.ts:7-8` и `mayakovskyPartTwoVisual.ts` перекрывают их существующими `.webp` до экспорта; `EssayCard.tsx:26` получает уже перекрытые значения. Мёртвые поля стоит вычистить, но битых картинок на проде нет. |

## 6. Ограничения

- Браузерного рантайма нет: строки про focus/motion/theme/cross-tab/consent/audio-session (`TLP-A11Y-*`, `TLP-THEME-001`, `TLP-AUDIO-*`, `TLP-ANALYTICS-*`) этим проходом не проверялись и не оспариваются.
- Сборка не запускалась (`node` недоступен) — валидаторы Product (`validate:*`, `site-route-integrity-audit`) локально не воспроизводились.
- Repo variables прочитать не удалось (`403` для доступного токена), поэтому вывод о выключенном remote опирается на артефакт + механизм сборки, а не на конфиг напрямую. Это две независимые линии, но подтверждение из настроек репозитория усилило бы вывод до трёх.
- Product не мутировался; лана PR #420 не затрагивалась.
