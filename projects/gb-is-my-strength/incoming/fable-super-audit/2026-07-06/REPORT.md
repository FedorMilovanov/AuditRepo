# ВЕРИФИКАЦИОННЫЙ ОТЧЁТ — fable-super-audit, 2026-07-06

**Source HEAD:** `14a49be83ab57212c0bbd26a8249b75ac026511d` (origin/main == local, fresh clone)
**AuditRepo HEAD:** `cfa6e3da568359879edeba403450b6d1dd0a6247`
**Проверяемые входы:** SEO CANONICAL V3 (Updates I–XVI), CANONICAL AGENT AUDIT (`14a49be8`/`cfa6e3da`), DUAL-REPO FORENSIC V4, CI+SEMANTIC deep audit (`ddadbdcc` — bot-ancestor текущего main).

Ниже — только вердикты с доказательствами. Консолидированные статусы и план — в `verified/SUPER_AUDIT_2026-07-06_14a49be8.md`.

---

## 1. CI / Workflow / Deploy

| Claim | Вердикт | Доказательство |
|---|---|---|
| deploy.yml и indexnow.yml пересекаются по push-path (двойной деплой) | **CONFIRMED** | deploy.yml:11-34 и indexnow.yml:8-31 оба содержат `konfessii/**, karty/**, map/**, biografii/**, hard-texts/**, baptisty-rossii/**, src/**, astro.config.mjs`; deploy.yml:36-39 дополнительно слушает workflow_run |
| workflow_run деплой чекаутит движущийся `main`, не head_sha | **CONFIRMED** | deploy.yml:72-76 `ref: main`; `workflow_run.head_sha` нигде не используется |
| Bot-коммит `[skip ci]` не проходит полную цепочку сам по себе | **CONFIRMED (с нюансом)** | indexnow.yml:80; до коммита — только `:light` гейт (indexnow.yml:71-72); полный гейт бежит потом на движущемся main (см. выше) |
| IndexNow: `continue-on-error` + `curl \|\| true`, коды не ассертятся, два эндпоинта | **CONFIRMED** | deploy.yml:217, 231-239; ни один workflow не проверяет 200/202 |
| Диф URL: `github.event.before/after`, fallback `HEAD~1..HEAD` | **CONFIRMED** | deploy.yml:189-190, 206 |
| cache-bust на прямом деплое глушится | **CONFIRMED** | deploy.yml:92-94 `\|\| echo "Cache bust skipped"`; также deploy.yml:90 глушит fonts:download |
| Push-retry бота без fetch/rebase | **CONFIRMED** | indexnow.yml:82-89 (3×, sleep 5, тот же push) |
| Локальный production-like ≠ deploy-гейт | **CONFIRMED, в обе стороны** | deploy добавляет `visual:parity:production`, `gill:pre-v16-submenu:audit (REQUIRE_LIVE)`, `gill:mobile-layout:audit`, `sw:dist:audit:deploy-switch`; при этом deploy НЕ бежит `dist:css-parity`, который есть в локальной цепочке (package.json:76-79). `postbuild:production-gates` не существует |
| actionlint не закреплён локально | **CONFIRMED** | package.json:137 `npx actionlint`, нет в devDependencies; pinned v1.7.7 только в shared-files-guard.yml:40-46 |
| check-workflows.js — regex, без семантики; institutionalizes overlap | **CONFIRMED + УСИЛЕНО** | строковые must() (check-workflows.js:20-22, 189-198) ТРЕБУЮТ `src/**`/`baptisty-rossii/**` в ОБОИХ workflow — гейт закрепляет гонку. `workflow-path-intersection-audit.js` не существует |
| Нет build-info/SHA в артефакте | **CONFIRMED** | grep по scripts/workflows — 0 упоминаний; deploy.yml:180 `path: dist` без штампа |
| Concurrency | **CONFIRMED** | deploy `group: pages, cancel-in-progress: true` (deploy.yml:50-52); indexnow `group: indexnow-meta-push, cancel-in-progress: false` (indexnow.yml:36-38) — РАЗНЫЕ группы, не сериализуются между собой |
| Actions на мутабельных тегах | **CONFIRMED** | `@v4`/`@v3` везде, SHA-пиннинга нет |
| Семантические контент-гейты / quiz-thesis-contracts.json / OWNER-INVARIANTS.md | **CONFIRMED ОТСУТСТВИЕ** | ни скриптов, ни npm-задач, ни файлов не существует |

Новое: INDEXNOW ключ пишется в dist из секрета без гейта на пустой секрет (deploy.yml:112-119); notify-on-failure не слушает deploy.yml.

## 2. Metadata / даты / SEO

| Claim | Вердикт | Доказательство |
|---|---|---|
| Петля свежести: gitDate(last) + bot-коммит | **CONFIRMED** | update-meta.js:93-101, 426; `%cI` последнего коммита файла |
| Early return до Nagornaya | **CONFIRMED (актуально)** | update-meta.js:415-416 `if (!slugs.length) return;` до блока 444-464 |
| CSS/JS/index.html → все статьи «изменены» | **CONFIRMED** | update-meta.js:119-120; fan-out только на articles/ (nagornaya не задет — асимметрия) |
| Нативные Astro-роуты не покрыты | **CONFIRMED** | только articles + ASTRO_PAGE_HEAD_MAP (9 записей, update-meta.js:51-62) + nagornaya |
| cache-bust мутирует source (HTML+.astro), regex-риск одинарных кавычек | **CONFIRMED** | cache-bust.js:129 value-class `(?:\?v=[^\s"&]+)?` не исключает `'`; .astro-путь строже |
| Sitemap generate-then-delete | **CONFIRMED** | astro.config.mjs:3,12-16 + copy-legacy-to-dist.js:159-170 |
| IndexNow: baseline-allowlist, addAllPublic на css/js/data/src-глобалы, INCLUDE_HOME | **CONFIRMED** | build-indexnow-urls.js:103-109, 174-183, 29, 204-208 |
| robots.txt `Disallow: /*?*` | **CONFIRMED** | robots.txt:16 (с точечными Allow для ассетов) |
| SearchAction `/?q=` | **CONFIRMED В SOURCE, 0 в артефакте** | index.html:47, about, map, baptisty-rossii legacy HTML; Astro-версии этих роутов без SearchAction → в dist его нет (артефакт-аудит: 0 узлов). Спящий残 в legacy-зеркалах; цель к тому же под robots Disallow |
| FAQPage 4 роута / Speakable ~29 (факт: 31 файл) / acquireLicensePage→/about/ | **CONFIRMED** | легаси + PageHead-зеркала; hard-texts/index.astro:112 |
| llms.txt устарел, «Римлянам 8» | **PARTIAL** | Updated: 2026-06-25; мёртвых URL нет; «Римлянам 8» — прозой в описании серии (llms.txt:23), маршрута нет; Gill-серия слинкована на /biografii/ вместо /articles/ |
| feed.xml: технический lastBuildDate, несортированные item, старые item не обновляются | **CONFIRMED** | feed.xml:12 = 2026-07-06T02:10:54+03:00 (bot); нарушения порядка pubDate; update-meta.js:373 вставляет только новые; смешанные TZ (+0300/+0000) |
| Требуемые аудиты (audit-route-lifecycle и др. 6 шт.) | **ОТСУТСТВУЮТ** | scripts/ не содержит |
| page-ownership без indexability; 8 карт «production-dist» при noindex | **CONFIRMED** | page-ownership.json (owner/source/risk/status, 51 роут); karty/*/route.json publication.* — второй, несогласованный словарь статусов; check-map-publication-status.js существует и энфорсит noindex-набор |

## 3. Runtime / Security

| Claim | Вердикт | Доказательство |
|---|---|---|
| glossary.js: innerHTML из JSON (55 `<em>` в data), abbr+role=button+tabindex, first-wins алиасы, dual renderer (innerHTML vs textContent), fetch без версии + SW cacheFirst, перманентное отключение после 1 fail, TreeWalker искл. .gterm, интервал 40 | **CONFIRMED (всё)** | js/glossary.js `o()`/`l()`/`a()`; data/glossary.json |
| izbrannoe: esc() только HTML, image в `url()` без CSS-энкодинга, path без проверки схемы, storage без схемы/капа, re-render без фокуса/aria-live, пустое состояние hidden без JS, tilt теряется после render() | **CONFIRMED (всё)** | src/pages/izbrannoe/index.astro:34,56-60,91-106,114-127; js/site.js:577 |
| Favorites.astro: f.path → card.href без валидации | **CONFIRMED** | Favorites.astro:34-36; image-regex `/^(https?:)?\//i` пропускает `//evil.example/x` |
| gb-favorites не-массив → .some() валит глобальный init | **CONFIRMED, шире** | floating-cluster-controller.js:162,172,681-688,765; та же схема падает в Favorites.astro и izbrannoe |
| Два TTS-движка; pause/rate = cancel+restart чанка; speed pill Tab-trap; стрелки достают Stop внутри radiogroup | **CONFIRMED** | site.js player + FCC ttsState; FCC:426-474, 1058-1211 |
| Gill collapsed links фокусируемы | **CONFIRMED** | floating-cluster.css:973 (opacity/max-height/pointer-events, без inert/tabindex=-1) |
| FCC layout thrashing + railKick rAF | **CONFIRMED** | FCC:1389-1442, 1556, 1674 |
| Quiz: nested interactive / хоткеи 1-4/А-Г / клавиатура после ответа | **REFUTED (эффект)** | TreeWalker отвергает `.quiz-wrapper`; в данных квизов нет gterm; хоткеев не существует; кнопки `disabled=!0` после ответа. Осталась дуальность данных (PageHead ↔ legacy HTML) — CONFIRMED |
| Quiz options — innerHTML без экранирования | **NEW CONFIRMED** | site.js `et()`: `o.innerHTML=...+e` мимо `tt()` |
| _app: инлайн-бандл ~2.1MB, loader по load+6s, «wheel forwarding» мёртв, iframe без sandbox | **CONFIRMED** | _app/index.html (2 197 441 B, крупнейший inline script 2 114 629 B); parent index.html |
| baptisty-rossii research .md битая ссылка | **CONFIRMED ДЛЯ PROD** (уточнено) | файл ЕСТЬ в source (`baptisty-rossii/research/00-master-source-index-glossary-map.md`), но `research` ∈ NEVER_COPY_DIRS (copy-legacy-to-dist.js:69) → в dist отсутствует; в артефакте битый href подтверждён артефакт-краулом |
| CSP: unsafe-inline на всех, _app + unsafe-eval/blob, ~8 вариантов, 37 фейковых XCTO-meta | **CONFIRMED (вариантов 12, не 8)** | 53 страницы CSP, все с 'unsafe-inline'; 12 уникальных политик; 37 × meta X-Content-Type-Options |
| Bible store: 45 файлов; circular provenance; orphan (0 потребителей); не-синодальный текст; ключи `4:2б`/`4:5а`; встроенные суффиксы `(Рим. 5:19)` | **CONFIRMED** | 45 файлов / 260 записей по пересчёту (ранее заявлялось 215 — зафиксировать метод счёта); `_meta.source` = «выверено в статье…» во всех 45; grep по src/js/scripts — 0 импортов; Рим 5:12 в store: «Поэтому, как чрез одного человека…» ≠ Синодальный «Посему, как одним человеком…» |
| CONTENT-QUALITY-STANDARD.md не энфорсится | **CONFIRMED** | 20KB документ; 0 скриптов/CI-ссылок |
| SW v189 = baseline | **CONFIRMED (совпадают)** | sw.js:1 и migration/sw-cache-version-baseline.json оба `gb-v189-lazy-precache-20260705` |
| sw.js: precache без ?v, SWR для HTML, allSettled+skipWaiting, in-memory LRU, glossary.json cacheFirst | **CONFIRMED** | sw.js (см. SUPER_AUDIT C-блок) |

## 4. AuditRepo governance

| Claim | Вердикт | Доказательство |
|---|---|---|
| Матрица: двойной HEAD | **CONFIRMED** | MASTER_BUG_MATRIX.md:5 (`de71fb3d`) vs :7 и :206 (`14a49be8`) |
| Счётчики не включают D-строки; внутренние расхождения | **CONFIRMED** | Статистика (188-200) до секции ARENA (204+); «Всего открыто 40» без 10 открытых D-строк; «P1 — ОТКРЫТО (2)» при 1 строке и «4» в статистике; «P2 (5)» при 4 строках |
| Append-only D-namespace | **CONFIRMED** | D-1..D-22 живут только в приложенной секции |
| Битые ссылки на архив | **CONFIRMED** | :6,183 `archive/2026-07-05-matrix-pre-restructure/` и :184 `archive/2026-07-05-pass-evidence/` не существуют; реальный монолит: `archive/2026-07-04-stale-matrix/MASTER_BUG_MATRIX_FULL_2026-07-03.md` |
| Устаревшая рекомендация «перезапустить деплой» при RESOLVED D-17/18 | **CONFIRMED** | :242 vs :219-220 |
| NEXT_AGENT_PROMPT устарел | **CONFIRMED** | ссылается на `8c318010` (Pass 71); часть требуемых работ уже в ЗАКРЫТО |
| «5 разных текущих SHA» по каноническим докам | **CONFIRMED** | README `e458581`, NEXT_AGENT_PROMPT+REGISTRY `8c318010`, START_HERE `82de4f45`, verified/README `932af3f3`/`01ff5ce3`, матрица `de71fb3d`+`14a49be8` |
| README AuditRepo «64 bugs, repair-ready» | **REFUTED** | корневой README счётчики не хардкодит; строка отсутствует |
| Валидаторы не видят D-строки/противоречия | **CONFIRMED** | check_matrix_coverage.py парсит только секции «ОТКРЫТО/РЕФАКТОРИНГ/AUDITREPO» |
| Arena cycle3 «izbrannoe чист» / «TTS надёжен» | **CONFIRMED FALSE-GREEN** | противоречит подтверждённым дефектам izbrannoe (CSS url, схема href, no-JS, tilt) и TTS (dual engine, pause/rate restart) |

## 5. Source docs / scripts

| Claim | Вердикт | Доказательство |
|---|---|---|
| lane/* ветки висят (V4: branch hygiene noise) | **REFUTED** | `git branch -r`: только main + 2 claude/* (обе слиты; D-20 актуален для них) |
| gill-pre-v16-submenu / mobile-play-smoke «не видны» (V4) | **REFUTED** | оба существуют: `gill-pre-v16-submenu-regression-audit.js`, `gill-v16-mobile-play-smoke.js`, `gill-mobile-layout-audit.js`; включены в deploy.yml. Реальный остаток: их нет в локальном production-like |
| OWNER-INVARIANTS.md нет; инварианты размазаны | **CONFIRMED** | OWNER-REQUIREMENTS.md + AGENTS §9 + CONTENT-QUALITY-STANDARD §0 + owner-ui-regression-guard.js |
| AGENTS.md актуален? | **PARTIAL** | verification-секция 2026-07-05 актуальна; внутренние противоречия: «11 JS» vs «РОВНО 12» (факт: 11); changelog r321 2026-07-03 |
| README v11 | **PARTIAL** | §1.1 «shadow-wrap current» противоречит page-ownership («HISTORICAL pre-2026-06-25»); §9 «7 CSS» устарел; строка v11 отсутствует в таблице истории |
| AUDIT_HISTORY.md | **STALE ~2 недели** | последняя запись 2026-06-22 |
| npm scripts → несуществующие файлы | **REFUTED** | все ссылки валидны; 4 скрипта не подключены к npm (build-indexnow-urls, cache-bust-assets, extract-gill-pre-v16, resize_og.py) |
| article-mdx-pilot-audit: 0.72, legacy-as-authority, early return | **CONFIRMED** | строки 382-386, 394, 396-422 |
| Doc sprawl: 9 Maps-доков, дублирующие deploy-runbooks | **CONFIRMED** | docs/ инвентарь |

## 6. Внешние факты (web)

- **FAQ rich results**: подтверждено — Google прекратил показ 2026-05-07; Search Console отчёт/Rich Results Test — июнь, API — август 2026. FAQPage как schema.org-тип остаётся валидным, фича мертва.
- Официальный снапшот V3 §19/§24.7/§25.7 (даты/сайтмапы/IndexNow 200-202/concurrency) — согласуется с документацией, принят без изменений.
