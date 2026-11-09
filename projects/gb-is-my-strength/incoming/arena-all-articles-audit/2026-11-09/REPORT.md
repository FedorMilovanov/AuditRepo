# Аудит ВСЕХ статей «Господь Бог — Сила Моя» — критерии, прогон, матрицы багов (волны 2–13)

## Meta

- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Agent: arena-all-articles-audit
- Date: 2026-11-09
- Audited branch/ref: `main`
- Audited anchor (SHA / artifact / live snapshot): Product `main` = `5e2db6f0fdd0257818f1a215fca16d4cc884e2d8`; `pushed_at 2026-11-09T06:28:12Z`. Волна 11 зафиксировала более поздний Product `main` = `96455813477dcb85cab71331bf4c466f5c30ce85`; волна 12 подтвердила тот же head, но audited anchor не менялся
- Environment: волна 2 — read-only `gh api` + shallow/sparse `git clone` в `/tmp/gbs-product`, без сборки; волна 3 — полный checkout того же якоря, `npm ci` (377 пакетов), `npm run strangler:build`, parse5-ценз `dist`; волна 4 — headless Chromium 153 из npm-пакета `@sparticuz/chromium@153.0.0` (без `npx playwright install`), локальный static server `dist`, browser-sweep 112 HTML и реальные Product browser-gates; волна 5 — песочница пересоздана с нуля на том же якоре, `npm ci` + `strangler:build` + `pagefind:build:dist`, реальные Chromium runtime/visual-parity gates и кросс-агентная сверка MDX↔`dist`; волна 6 — только bounded read-only `gh api` и канонические страницы W3C; волны 7–8 — bounded API-сверка обновлённых голов чужих веток и Product source, без Product clone/build/browser; волна 9 — bounded `gh api` + shallow Product clone того же anchor, только source-ценз C24/import-chain/индексов, без `npm ci`/build/browser/runtime; волна 10 — bounded reattach + read-only `gh api` по всем 26 remote-головам и каноническим owner/print-документам + shallow Product clone того же anchor для source-ценза, без `npm ci`/build/browser/runtime; волна 11 — bounded reattach + read-only `gh api` compare/tree, повторный ценз 26 AuditRepo + 5 Product деревьев, read-only Google Drive connector (L2 и funnel) и поздние a33-головы, без Product clone/build/browser/runtime; предварительный самоаудит §18 — read-only git/gh/CSV/REPORT/Drive no-new-files check, без Product clone/build/browser/runtime; волна 12 — bounded reattach-free read-only `gh api` compare/tree/contents + `git ls-remote` + Drive no-new-files check, без Product clone/build/browser/runtime; волна 13 — bounded reattach-free read-only `gh api` branches/compare/contents/trees/pulls/checks + `git ls-remote` + Drive no-new-files check, без Product clone/build/browser/runtime
- Build mode: волна 2 `source`; волны 3–5 `dist` (112 `index.html` / 1248 файлов / 101 MB; 111 матричных маршрутов + `/konfessii/russkij-baptizm/_app/`). Волна 5 дополнительно собрала `pagefind` (102 страницы / 29117 слов). Волны 6–13 и §18 не пересобирали `dist` и не создавали новые HTML/скриншоты
- Browser / device if used: волна 3 — без браузера; волны 4–5 — headless Chromium 153 (`chrome-headless-shell`, Linux x64), desktop 1280×900, Product mobile 390×844/360 и desktop matrices; WebKit/Firefox, реальное устройство и TTS voice-switching не проверялись
- Scope: 111 маршрутов, 79 читательских статей, 32 хабов/утилит; один общий прогон. Волна 4 отдельно обошла 112 финальных HTML (включая utility `_app`)
- Explicit exclusions: авторство «ИИ/человек», фактическая истинность каждого исторического/богословского утверждения, внешняя corroboration/rights/edition, WebKit/Firefox/реальное устройство, TTS voice-switching и полный cross-browser runtime quiz-click/owner visual signoff. Волны 4–5 добавляют bounded Chromium painted/AX/runtime/visual-parity witness, но не заменяют внешнюю редакционную проверку; волны 6–12 добавляют только remote/source/docs witness, включая shallow Product source-ценз волн 9–10, 26-branch read-only ценз волны 10, Drive L2/funnel и 26+5 tree-ценз волны 11, движущиеся головы a33/c6 волны 12; волна 13 добавляет только remote/source/docs witness четырнадцатого прохода c6, a33 glossary triage и открытого Product PR #2295
- Signal class: Product
- Proof state: `FAIL` для 17 verified-source дефектов; `FAIL` для их финального-DOM и browser-painted следа в границе проверенных паттернов; `PASS` только для bounded Chromium runtime-gates волны 5; `UNPROVEN` для атрибуции авторства, внешней истинности, WebKit/Firefox/TTS, owner visual acceptance (канонический `OWNER-VISUAL-ACCEPTANCE-2026-11-07.md` на main прямо оставляет приёмку открытой; live Home-снимки волны 11 не являются signoff), полного cross-browser прогона и чужих P0-кандидатов волн 6–12 (`GBS-SATELLITES-DECLARED-NOT-REGISTERED` и `GBS-SERIES-JSON-STALE` отозваны обоими чужими агентами; наш source-only статус — `UNPROVEN`, не подтверждение и не закрытие; `GBS-SHADOW-HTML-STALE` не принят; разногласие a33/c6 по `GBS-SERIES-JSON-STALE` снято десятым проходом c6)
- Claim boundary: исходный reader-facing текст, статический final-HTML `dist`, bounded headless-Chromium отрисовка/AX-дерево, runtime-клики и visual-parity pilots на якоре выше; волны 6–12 — только удалённые исходники/конфиги/docs того же anchor, shallow Product source-ценз волн 9–10, 26-branch canonical-doc ценз волны 10, read-only Google Drive L2-стандарт/funnel и 26+5 tree-ценз волны 11, moving-head/canonical-doc сверка волны 12; волна 13 — только moving-head/c6 pass-14/a33 glossary/Product PR #2295 сверка; внешние нормы W3C и чужие отчёты; §18 — только инвентаризация, branch/PR/коллизии и границы, без нового witness; не WebKit/Firefox, не реальное устройство, не TTS voice-switching, не owner signoff, не авторство, не внешняя проверка источников
- Preservation boundary: не менять Product, не создавать новый универсальный контракт/чек-лист, не авто-переписывать русскую прозу
- Semantic owner: существующие строки `MASTER_BUG_MATRIX.md`; новые строки не допускаются без owner-решения
- Overlapping active owner/PR/branch check: открытые PR в AuditRepo #545, #544, #543, #542, #538, #521, #514 — нашу article-lane не пересекают; PR #546 и Product PR #2294 слиты в новые `main`, открытый список не изменился; полный ценз 26 AuditRepo + 5 Product remote-голов повторён в волне 11 и снова даёт `truncated:false` и 0 path collisions вне нашей ветки; на 21:11 самоаудит зафиксировал c6 `e407be7`, a33 `aad5645`; на 21:41 волна 12 зафиксировала a33 `4e6a3ed8`, c6 `e407be7` и прежние `main`/открытые PR; активные строки MASTER: `GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK`, `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT`, `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT` (admission 2026-10-25), `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN`, `GBS-HERMENEUTIKA-TRANSLATION-AND-COPY-QUALITY`, `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS`. Волна 13 (22:05–22:09Z): c6 `6b0d5e5`, a33 `4e6a3ed8` → `0f78fa12`, оба `main` без изменений, новая Product-ветка/PR #2295 `fix/home-visual-integrity-20261110` не слита; открытый список AuditRepo не изменился, Product открытых PR = 5; полный ценз 26 AuditRepo + 6 Product деревьев снова `truncated:false` и 0 path collisions вне нашей ветки.
- Report type: `source-audit + built-DOM-audit + browser-painted-witness + bounded-runtime/visual-parity-witness + bounded API/source cross-agent reconciliation + external-norm anchors + updated-head cross-agent reconciliation + final withdrawal and discoverability-index census + C24 source/import-chain census and strict llms-subset refinement + 26-branch collision census, canonical owner/print boundary, late a33 source triage, new main heads, Drive L2 standard/funnel, late a33 metric reconciliation and 26+5 tree census + preliminary self-audit + wave-12 bounded moving-head and canonical-doc reconciliation + wave-13 bounded moving-head, c6 pass-14, a33 glossary triage and Product PR #2295 boundary reconciliation`
- Preliminary self-audit: 2026-11-09T21:11Z, §18; read-only inventory, branch/PR/collision census, evidence-boundary review and open-gap list; no new Product evidence, no owner decision, no proof-state change; последующие bounded refresh §19 и §20 также не меняют proof state

> Anchor фиксирует, что именно смотрелось. Не обновлять отчёт только потому, что исходный репозиторий позже сдвинулся. Более поздний Product `main` волны 11 описан в §17 как отдельный head, а не как замена audited anchor.

**Артефакты волн 2–13 и предварительного самоаудита:** этот `REPORT.md` (§9 — дельта волны 3, §10 — дельта волны 4, §11 — дельта волны 5, §12 — bounded API/source дельта волны 6, §13 — сверка обновлённых голов волны 7, §14 — финальный отзыв и ценз индексов волны 8, §15 — новые головы a33/c6, C24 source-ценз и строгое подмножество `llms.txt`, §16 — 26-branch ценз, канонические owner/print-границы и поздний a33 source-ценз, §17 — новые `main`-головы, live Home witness, Drive L2/funnel, двенадцатый проход c6, поздние a33-метрики и 26+5 tree-ценз, §18 — предварительный самоаудит, §19 — волна 12: moving-head refresh, канонические blob’ы и Drive no-new-files, §20 — волна 13: c6 pass-14, a33 moving-head/glossary triage, Product PR #2295, канонические blob’ы, 26+6 tree census и Drive no-new-files) + `ALL_ARTICLES_MATRIX.csv` (111 маршрутов, 64 колонки: DOM-, browser-, MDX-, visual-parity, remote-fixture/series-layer/external-norm и 5 source-observation колонок C24; в волнах 10–13 и при самоаудите не менялся) в `projects/gb-is-my-strength/incoming/arena-all-articles-audit/2026-11-09/`. Клон Product, `node_modules`, `dist`, Chromium binary, скриншоты и логи волн 3–5 были runtime-only в `/tmp` / `~/.cache` и в текущей песочнице не сохранились; артефакты волн 6–13 и самоаудита лежат только в `/tmp/aiq-wave6/`, `/tmp/aiq-wave7/`, `/tmp/aiq-wave8/`, `/tmp/aiq-wave9/`, `/tmp/aiq-wave10/`, `/tmp/aiq-wave11/`, `/tmp/aiq-wave12/`, `/tmp/aiq-wave13/` и `/tmp/aiq-self-audit/` вне git и могут не пережить пересоздание песочницы. Ни одного нового файла в AuditRepo не создано.

---

## 0. Что сделано

- Полный корпус: **111 маршрутов**, **79 читательских статей**, **32 хабов/утилит**.
- Состав статей: **70 MDX** (`src/content/articles/`) + **3 нативные `/articles`** без MDX + **5 глав `/nagornaya/chast-*`** + **1 досье `/journal/dossiers/g3`**.
- Парсер рекурсивно идёт по `import` от `index.astro`, собирая прозу из MDX **и** Astro-компонентов с дедупликацией. 6 статей Gill = `metadata-only`, 13 = `rendered`; их проза живёт в компонентах до 154 КБ.
- Объём: мин **944**, медиана **2703**, макс **21498** слов.
- Итог: **81 находок** = **17 жёстких** + **64 триггеров**; **16** маршрутов с жёсткими, **49** с находками, **62** без авто-находок.
- Для **всех 17 жёстких** находок получены точные negative fixtures: `файл:строка` + строка исходника на якоре `5e2db6f0fdd0…` (§4.6).
- **Вывод «ИИ/человек» не делается.** Стилевые маркеры = только триггеры.

### Типы (динамическая модель, не один шаблон)

| Тип | Кол-во | Что это | Свои стандарты |
|---|---:|---|---|
| T1-HISTORY | 16 | «Баптисты России», Gill, Lawson, Код да Винчи | S8/S36 provenance, S19 ≥1500/≥2500, S28/S43, минимум лозунгов |
| T2-EXEGESIS | 35 | hard-texts, «сердце», отступление, Рим 7 | S29/S48/S50/S51, S9 издание, S30 догмат/адиафора |
| T3-PASTORAL | 16 | подросток, семья, пасторство | S25/S26/S27/S40, допустим «Мост» ≥900, больше риторики |
| T4-REFERENCE | 3 | справочники | ≥1500, жирные метки терминов **легитимны**, почти без лозунгов |
| T5-NATIVE | 4 | 3 статьи без MDX + дossier | проза в `.astro`; паритет source→rendered |
| T5-NATIVE-BOOK | 5 | главы Нагорной | книжная иерархия, источники вынесены на отдельный owner |
| T6-HUB/UTIL | 32 | индексы, карты, `karty/*`, about, app | S19 не применяется; только утечки/язык/типографика |

Семейства статей: `articles` 56, `baptisty-rossii` 10, `hard-texts` 7, `nagornaya` 5, `journal` 1.

---

## 1. НЕГАТИВНЫЙ СПИСОК (обновлённый)

### 1.1 ИИ-особенности письма — маркеры, НЕ доказательство

| # | Признак | Откуда | Как читать |
|---|---|---|---|
| N1 | «Не просто X, а Y», «это не X, это Y», «не только… но и» | AI Борщ; Wikipedia Signs | шаблон отрицательного параллелизма; сам по себе не доказательство |
| N2 | Триады, правило трёх, ровный ритм, одинаковые финалы, шаблонные «Коротко» | AI Борщ; Habr; Wikipedia Signs | измерять плотность на 1000 слов |
| N3 | Раздутая значимость: «играет ключевую роль», «в современном мире», «подчёркивает важность», «нельзя недооценить» | AI Борщ; Wikipedia Signs; MOS:WTW | проверять, есть ли факт под оценкой |
| N4 | Канцелярит и пустые знаки: «важно отметить/понимать», «таким образом», «более того», chatbot-хвосты | AI Борщ; S23 | S23 прямо запрещает «искусственную ИИ-важность» |
| N5 | Puffery / peacock: «уникальный», «революционный», «величайший», «знаковый», «прорывной» | [MOS:WTW](https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Words_to_watch); NN/g; Google | заменять фактами и атрибуцией |
| N6 | Hedging про доступность источников, «participated in public discussions», «independent coverage», поверхностный анализ словами источника | [Wikipedia Signs](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) | advice page, не policy |
| N7 | Избыток em dash, Markdown, AI edit summaries, шаблонные дисклеймеры | Wikipedia Signs; AI Борщ | em dash и Markdown могут быть человеческим house style |
| N8 | «Безупречная безавторская проза», синтетическая искренность, сглаженный голос | Habr; критика AI line-edits | качественная претензия, не детектор |
| N9 | Одинаковая анатомия статьи у всех материалов | GitHub Docs content model | **наоборот**: typed anatomy — норма |

### 1.2 Плохие ИИ-галлюцинации и фактические провалы

| # | Дефект | Опора |
|---|---|---|
| H1 | Выдуманные цитаты, даты, числа, тарифы, продублированные заголовки | S1/S4/S5/S10, WP:V, калинкинdev (изобретённая комиссия 0,8%; «1 день») |
| H2 | «Источник сообщает X» → «X произошло» | S3/S6, EDITORIAL-SOURCE-POLICY §1–2, WP:V |
| H3 | Два зависимых пересказа выданы за независимых witnesses | S6, Хартия |
| H4 | Пробел object/locator/rights/corroboration заполнен правдоподобной деталью | S10, §9 |
| H5 | discovery lead / Википедия / агрегатор как установленный факт | S5, [WP:RS](https://en.wikipedia.org/wiki/Wikipedia:Reliable_sources) |
| H6 | Интерпретация не маркирована как вывод | S16/S33/S43, CONTENT-QUALITY §2.1 |
| H7 | Служебный каркас у читателя: SHA, `main`, `Research authority`, `A1/A2/A3`, `HOLD`, `???` | S12/§9; **подтверждено в §4.5** |
| H8 | Фальшивое авторство/квалификация, AI-портреты «эксперта» | Google helpful content, S33 |
| H9 | Массовые страницы без добавленной ценности | [Google scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies) |
| H10 | Гибридный английский / машинные кальки в русском тексте | S23/S44, MASTER Hermeneutika; **подтверждено в §4.5** |

### 1.3 Тонкости ложных срабатываний

- [Wikipedia Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) — **advice page**, descriptive not prescriptive; «Not all text featuring these indicators is AI-generated».
- [WP:LLM](https://en.wikipedia.org/wiki/Wikipedia:Writing_articles_with_large_language_models) — генерация/переписывание статьи запрещены, кроме copyedit после human review; но **«sanctions require evidence beyond basic stylistic or linguistic indications»**.
- [WP:LLMPRV](https://en.wikipedia.org/wiki/Wikipedia:Presumptive_removal_of_AI-generated_content) — даже presumptive removal требует истории/паттерна, не одного маркера.
- [AI Борщ](https://aiborsch.com/blog/shtampy-teksta-neyroseti/) — «ни один признак сам по себе не доказывает, что текст написан ИИ».
- [18F structure-the-content](https://github.com/18F/content-guide/blob/1b1723d3d5b8f91d92c16487c88b56265dc0ec3a/_pages/our-approach/structure-the-content.md) рекомендует «Short, punchy paragraphs»; [NN/g](https://www.nngroup.com/articles/how-users-read-on-the-web/) измерил +58% concise, +47% scannable, +27% objective, +124% вместе.
- [MOS:WTW](https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Words_to_watch) — «should not be applied rigidly», common sense, exceptions.
- Зелёный CI ≠ редакционная пригодность: `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN` печатает `Would change: 6 files` при exit 0.

### 1.4 Объективные претензии

- [WP:V](https://en.wikipedia.org/wiki/Wikipedia:Verifiability): каждый claim attributable to reliable published sources; цитаты/спорное — inline citation; burden на добавляющем.
- [WP:RS](https://en.wikipedia.org/wiki/Wikipedia:Reliable_sources): надёжность — спектр и зависит от конкретного утверждения; «common sense and editorial judgment are indispensable»; значимые меньшинства должны быть покрыты.
- S1–S10 / EDITORIAL-SOURCE-POLICY: сила ≤ evidence; independence важнее числа; «правило одного официального документа»; HOLD = операционный запрет.
- Google [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): originality, effort, accuracy, E-E-A-T, Who/How/Why, раскрытие автоматизации; [spam policies](https://developers.google.com/search/docs/essentials/spam-policies): scaled content abuse.
- 18F, GitHub Docs, NN/g, [GOV.UK A–Z](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/): descriptive headings, one idea per paragraph, active voice, аббревиатура раскрывается при первом употреблении, typed article anatomy.
- [WCAG 2.2 SC 3.1.2](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html) Level AA: язык частей определяем программно, кроме имён/терминов/вернакуляра.
- S24/S33/S38/S40/S43: факт / источник / оппонент / наш вывод различаются; аргумент важнее ярлыка; читатель видит ход рассуждения.

> Внешние стандарты — серьёзный кросс-чек, а не автоматически обязательные для `gospod-bog.ru`. Обязательны документы Product-репо (§2).

---

## 2. ПОЛОЖИТЕЛЬНЫЙ СПИСОК

### 2.1 Стандарты репо ГОСПОДЬ БОГ

Прочитано в `docs/` Product: `ARTICLE-STANDARD-CHARTER.md`, `CONTENT-QUALITY-STANDARD.md`, `EDITORIAL-SOURCE-POLICY.md`, `BAPTISTY-ROSSII-EDITORIAL-ARCHITECTURE.md`, `WORK_MODES.md`, `OWNER-INVARIANTS.md`, `OWNER-REQUIREMENTS.md`, `DOCUMENT_AUTHORITY.md`, `GBS-PATTERN.md`, `LANE_LOCK_POLICY.md`, `GIT_WORKTREE_POLICY.md`, `SEARCH_INDEX_POLICY.md`, `REFERENCE_TRANSFER_POLICY.md`, `SERIES-ENGINE-GUIDE.md`.

**Хартия (обязательный стандарт верхнего уровня, 2026-09-07), 54 стандарта S1–S54:**

> «Академическая проверяемость и пасторское слово работают вместе; ни красивый слог без evidence, ни безжизненный набор ссылок не считается готовой статьёй».  
> «Корроборация определяется claim и риском, а не магическим числом ссылок».

| Группа | Стандарты | Ключевое |
|---|---|---|
| А. Верификация | S1–S10 | S1 факт имеет опору; S3 формулировка ≤ evidence; S4 цитата + edition + locator; S5 без слухов/ложных цитат; S6 корроборация по риску; S8 провенанс; S10 пробел честнее выдумки |
| Б. Аппарат | S11–S16 | **S11 «Источники и сверка» обязательны**; **S12 ссылка ведёт к читателю, не во внутренности**; S13 перевод иноязычной цитаты; S15 транслитерация; S16 голоса разделены |
| В. Архитектура | S17–S22 | **S17 «Коротко» 4–6 только из доказанного**; S18 H2/H3; **S19 Опора ≥2500 · Основная ≥1500 · Мост ≥900 · Справочник ≥1500**; S20 самодостаточность; S21 серия; S22 исправимость |
| Г. Язык | S23–S28 | **S23 без канцелярита и искусственной «ИИ-важности»**; S25 образ/пример, если не подменяют аргумент; S26 тонкая дидактика; S27 милость к оппоненту; S28 держать напряжение |
| Д. Богословие | S29–S43 | S29 контекст; S30 догмат/адиафора; S33 честная атрибуция; S38 не изображать нейтральность; S40 без ярости; **S43 показать ход рассуждения** |
| Е/Ж/З | S34–S37, S44–S54 | голоса героя/о герое, историческая фактура, эпиграф; S44 перевод рядом; S45 пунктуация; S47 переносы; S48 не proof-texting; **S50 плотность по роли**; S51 оригинал по делу; S54 current owner |

**CONTENT-QUALITY-STANDARD.md:** 7 инвариантов («нарушение = не публиковать»), включая **«глубина без воды … не сведена к лозунгу»** и «по тексту и доказательству, не по памяти»; §1 semantic каркас и тон; §3 серия **без generic-усреднения**; §4 квиз с одним semantic owner; §5 provenance/rights отдельно, AI-реконструкция не выдаётся за документ; §6 типографика; **§8 projections не вводят новый факт/дату/цитату/более сильный verdict**; §9 чек-лист с запретом внутренних Research/Drive/TODO/HOLD notes.

**EDITORIAL-SOURCE-POLICY.md:** 6 принципов; таблица «тип claim → что доказать»; правило одного официального документа; правило спорного внешнего claim; 7 evidence dimensions; `Research closure ≠ Product publication approval`; `HOLD` — операционный запрет.

**Архитектура книги:** 4 уровня Книга → Глава → Статья → Раздел; справочник = форзац/аппарат, не пятая глава; 4 главы / 9 статей / 1 справочник / 229 мин; расширение «17–20 статей, а не 17 пустых глав»; новая статья только при самостоятельном первичном корпусе.

**Уже существующие контракты AuditRepo (не изобретать):** `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT` (admission 2026-10-25), `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT` (289/39), `SYS-PUBLICATION-MIXED-SCRIPT-SURFACE-COVERAGE`, `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN` (OPEN-CURRENT, 6 файлов), `GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK`, `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS` (9 маршрутов), `GBS-HERMENEUTIKA-TRANSLATION-AND-COPY-QUALITY` (OPEN-CURRENT). wave23 (64 guides / 13 repos) отвергает policy monolith, ещё один универсальный чек-лист, lint-переписывание русской прозы, один визуальный шаблон и подмену редакционной проверки зелёным CI.

### 2.2 Недостающие стандарты с серьёзных сайтов

| Источник | Статус | Что добавил |
|---|---|---|
| [18F be-concise / structure](https://github.com/18F/content-guide/blob/1b1723d3d5b8f91d92c16487c88b56265dc0ec3a/_pages/our-approach/be-concise.md) | archived guide | ≤25 слов/предложение, vary length, короткие абзацы — норма, «better clear than clever» |
| [GitHub Docs content model](https://github.com/github/docs/blob/6cbe6413ac7177bb692a78c171a74ae8be50d721/content/contributing/style-guide-and-content-model/contents-of-a-github-docs-article.md) | prescriptive | typed anatomy, required/conditional/optional, intro ≈ 1 предложение |
| [GOV.UK A–Z style guide](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/) | guidance | active voice, первое упоминание аббревиатуры раскрывается полностью, UK English, ясный язык, «you» вместо гендерных местоимений |
| [GOV.UK writing guidelines](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/) | guidance | отсылка к A–Z и правилам слов; содержательная часть прочитана через A–Z |
| [NN/g How Users Read on the Web](https://www.nngroup.com/articles/how-users-read-on-the-web/) | исследование | 79% сканируют; +58/+47/+27/+124%; «marketese» ненавидят; исходящие ссылки ↑ доверие |
| [MOS:WTW](https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Words_to_watch) | guideline | puffery, vague/clichéd, «let facts alone do the talking», не ригидно |
| [WP:V](https://en.wikipedia.org/wiki/Wikipedia:Verifiability) | policy | attributable, inline citation, WP:BURDEN |
| [WP:RS](https://en.wikipedia.org/wiki/Wikipedia:Reliable_sources) | content guideline | надёжность как спектр, контекст, значимые меньшинства, редакционное суждение |
| [WP:LLM](https://en.wikipedia.org/wiki/Wikipedia:Writing_articles_with_large_language_models) | content guideline | запрет LLM-генерации; стиль недостаточен для санкций |
| [WP:LLMPRV](https://en.wikipedia.org/wiki/Wikipedia:Presumptive_removal_of_AI-generated_content) | deletion guideline | удаление требует паттерна/истории |
| [Wikipedia Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) | advice page | каталог признаков + AIFAIL/G15/AIDETECTION оговорки |
| [Google helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) | документация | Who/How/Why, E-E-A-T, effort/originality/accuracy, disclosure |
| [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies) | policy | Scaled content abuse, scraping |
| [W3C WCAG 2.2 SC 3.1.2](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html) | Level AA | `lang` для passages, исключения для имён/терминов |
| [AI Борщ](https://aiborsch.com/blog/shtampy-teksta-neyroseti/) / [Habr 959560](https://habr.com/ru/articles/959560/) | критика | 15 штампов + «ни один признак не доказывает ИИ»; однородность и потеря доверия |
| Microsoft `style-guide/top-10/tips-style-voice` | 404 | не доставлен, не используется |

---

## 3. МОЩНЫЙ ДИНАМИЧЕСКИЙ НАБОР C1–C24

**HARD** = объективно проверяемый дефект; **TRIGGER** = повод для редакционной/источниковой проверки, не вердикт и не «доказательство ИИ». **Класс в таблице базовый**: отдельная находка может быть понижена (например `HOLD` без ID, C7 при 3–9 фрагментах) или повышена (C7 при ≥10). Фактическая тяжесть — в §4.4 и CSV.

| Код | Критерий | Класс | Метод | Опора |
|---|---|---|---|---|
| C1 | Калибровка claim/evidence | HARD | manual | S3/S6, EDITORIAL-SOURCE-POLICY, WP:V |
| C2 | Локатор цитаты/документа | HARD | manual | S4/S8, WP:V |
| C3 | Раздел источников у читателя | HARD | source/auto | S11/S12, §9 |
| C4 | «Коротко»: наличие/состав (проекции) | TRIGGER | source/auto | S17, §8, §4.2 |
| C5 | Утечка служебного каркаса | HARD | source+DOM | S12, §9, MASTER scaffold/??? |
| C6 | Малформации русского / смешанный скрипт | HARD | source+DOM | S23/S45, CONTENT-QUALITY §6, MASTER |
| C7 | Язык частей (греч./евр./лат.) | TRIGGER | source+DOM | S13/S44/S51, WCAG 2.2 SC 3.1.2 |
| C8 | Галлюцинационный риск | TRIGGER | source/auto | S1/S5/S10, WP:LLM, AI Борщ |
| C9 | Глубина по роли текста | TRIGGER | auto+owner | S19, §0.3 |
| C10 | Архитектура и описательные заголовки | TRIGGER | auto+editorial | S18, 18F, NN/g, GitHub Docs |
| C11 | Показан ход рассуждения | TRIGGER | manual | S43, §0.3, S28 |
| C12 | Термины объяснены | TRIGGER | manual | S20, §0.1 |
| C13 | Серийная идентичность | TRIGGER | manual | S21, §3 |
| C14 | Короткие абзацы (динамично) | TRIGGER | auto+editorial | 18F structure/be-concise, NN/g |
| C15 | Лозунговые тезисы (динамично) | TRIGGER | auto+editorial | §0.3, S23/S25/S40, MOS:WTW |
| C16 | Отрицательный параллелизм | TRIGGER | auto+editorial | AI Борщ, NYT, Wikipedia Signs |
| C17 | Триады/ровный ритм/шаблонные финалы | TRIGGER | auto+editorial | AI Борщ, Habr, Wikipedia Signs |
| C18 | Puffery / искусственная важность | TRIGGER | auto+editorial | S23, MOS:WTW, NN/g, Google |
| C19 | Канцелярит и chatbot-хвосты | TRIGGER | auto+editorial | S23, AI Борщ |
| C20 | Машинные кальки / гибридный английский | HARD | source/auto | S23, MASTER Hermeneutika |
| C21 | Исходящие ссылки / доверие | TRIGGER | source/auto | S12, NN/g credibility |
| C22 | Паритет readingTime | TRIGGER | auto+owner | MASTER 44/44, §9 |
| C23 | Покрытие MDX ↔ компоненты | HARD | source/auto | SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT |
| C24 | draft/noindex/canonical гигиена | HARD | source/auto | §9 |

### 3.1 Динамические пороги (на 1000 слов)

| Тип | C15 лозунги | C16 «не просто» | C18 puffery | C14 короткие абзацы | C9 минимум |
|---|---:|---:|---:|---:|---:|
| T1-HISTORY | 1.2 | 2.0 | 1.2 | >75% + >75% односоставных + evidence <2/1000 | 1500 / 2500 Опора |
| T2-EXEGESIS | 2.5 | 2.2 | 1.2 | >78% … | 900 Мост / 1500 |
| T3-PASTORAL | **3.5** | 3.2 | 1.8 | >85% … | 900 / 1500 |
| T4-REFERENCE | 2.0 | 1.2 | 0.8 | >70% … | 1500 |
| T5-NATIVE / BOOK | 2.0 | 3.0 | 1.5 | >85% … | 900 |
| T6-HUB/UTIL | n/a | n/a | n/a | **ожидаемо** | n/a |

### 3.2 Редкие исключения с критериями

**Короткие абзацы допустимы** (18F/NN/g/GitHub Docs): «Коротко»/список, навигация/подпись, диалогический пасторский ритм, плотный факт-блок. **Дефект только при одновременном** превышении typed порога по доле коротких И по доле односоставных И доказательной плотности <2/1000. В прогоне **C14 = 0**: короткие абзацы багом не являются.

**Лозунговость допустима**: «Коротко» с опорой в теле, эпиграф/цитата с источником, один якорь на секцию, прямо названная конфессиональная позиция (S33/S38), повторяющийся safety-disclaimer серии. **Дефект только когда** жирная полная фраза-тезис чаще typed порога, их ≥4 и они подменяют S43/§0.3. Жирные метки терминов в T4 не считаются лозунгами.

**Самокоррекция:** сняты «мелкие абзацы = отсутствие абзацности» и «лозунги = ИИ-доказательство».

### 3.3 Ручные lane — протокол для агентов B/C (0 авто-флагов ≠ чисто)

- **C1 Калибровка claim/evidence.** По таблице EDITORIAL-SOURCE-POLICY классифицировать каждый рискованный claim (дата, событие, обвинение, богословский вердикт); сверить, что формулировка не сильнее доказательства; отдельно проверять «N сообщил X» vs «X произошло» и зависимые пересказы. Положительный контроль: `enoh-prorochestvoval…mdx:201,207` (§4.7).
- **C2 Локатор.** Каждая прямая цитата / Писание / архивный объект: edition/version + точный адрес (страница, folio, колонка, plate, timestamp, пункт решения) + контекст + rights отдельно. Опора S4/S8/S9, WP:V, WP:RS. Положительный контроль: сноски `[^3]`–`[^9]` в `enoh…` (Codex Sinaiticus folio 325; Milik p.184, Plate IX; IAA B-359409/B-359410; CC BY-SA 4.0).
- **C11 Ход рассуждения.** S43 + §0.3: читатель видит evidence, альтернативы и путь к выводу. Проверять наличие «Нельзя писать:», «Точный вывод:», различения уровней. Положительный контроль `enoh…:147,169`.
- **C12 Термины.** S20/§0.1 + GOV.UK A–Z: сложный термин/аббревиатура объяснён в прозе или current glossary при первом употреблении; исключение WCAG для technical terms не отменяет русского перевода по S44.
- **C13 Серийная идентичность.** S21/§3: один semantic owner, `baptistSeriesConfig.ts` / `baptistFlatSeriesConfig.ts` / `heartSeriesData.ts` / `gillSeriesData.ts`, согласованные названия/статусы/число частей, но route-specific identity сохранена; без generic-усреднения.

---

## 4. МАТРИЦЫ БАГОВ

### 4.1 Критерий × тип (H/T, 79 статей)

| Код | T1‑HISTORY | T2‑EXEGESIS | T3‑PASTORAL | T4‑REFERENCE | T5‑NATIVE | T5‑NATIVE‑BOOK | Итого |
|---|---:|---:|---:|---:|---:|---:|---:|
| C1 | · | · | · | · | · | · | 0 |
| C2 | · | · | · | · | · | · | 0 |
| C3 | 0/1 | · | 0/2 | · | · | · | 3 |
| C4 | 0/6 | · | · | · | · | · | 6 |
| C5 | 6/0 | 2/3 | · | 0/1 | 1/0 | · | 13 |
| C6 | 0/2 | · | · | · | 0/1 | · | 3 |
| C7 | · | 4/1 | 1/2 | · | 1/0 | 0/1 | 10 |
| C8 | 0/1 | · | 0/2 | · | · | 0/2 | 5 |
| C9 | · | 0/3 | · | 0/1 | · | · | 4 |
| C10 | · | 0/1 | 0/1 | · | · | · | 2 |
| C11 | · | · | · | · | · | · | 0 |
| C12 | · | · | · | · | · | · | 0 |
| C13 | · | · | · | · | · | · | 0 |
| C14 | · | · | · | · | · | · | 0 |
| C15 | 0/1 | 0/1 | 0/4 | 0/1 | 0/1 | · | 8 |
| C16 | 0/2 | 0/6 | · | · | · | 0/1 | 9 |
| C17 | · | · | · | 0/1 | · | · | 1 |
| C18 | 0/2 | · | 0/2 | · | · | 0/2 | 6 |
| C19 | · | · | 0/1 | · | · | · | 1 |
| C20 | · | 1/3 | · | · | 1/0 | · | 5 |
| C21 | · | 0/3 | · | · | · | · | 3 |
| C22 | 0/1 | · | · | · | · | · | 1 |
| C23 | · | · | · | · | · | · | 0 |
| C24 | · | · | · | · | · | · | 0 |

### 4.2 Критерий × семейство

| Код | `articles` | `baptisty-rossii` | `hard-texts` | `nagornaya` | `journal` |
|---|---:|---:|---:|---:|---:|
| C1 | 0 | 0 | 0 | 0 | 0 |
| C2 | 0 | 0 | 0 | 0 | 0 |
| C3 | 3 | 0 | 0 | 0 | 0 |
| C4 | 6 | 0 | 0 | 0 | 0 |
| C5 | 0 | 7 | 5 | 0 | 1 |
| C6 | 2 | 0 | 0 | 0 | 1 |
| C7 | 5 | 0 | 4 | 1 | 0 |
| C8 | 3 | 0 | 0 | 2 | 0 |
| C9 | 1 | 0 | 3 | 0 | 0 |
| C10 | 2 | 0 | 0 | 0 | 0 |
| C11 | 0 | 0 | 0 | 0 | 0 |
| C12 | 0 | 0 | 0 | 0 | 0 |
| C13 | 0 | 0 | 0 | 0 | 0 |
| C14 | 0 | 0 | 0 | 0 | 0 |
| C15 | 7 | 1 | 0 | 0 | 0 |
| C16 | 6 | 2 | 0 | 1 | 0 |
| C17 | 0 | 1 | 0 | 0 | 0 |
| C18 | 3 | 1 | 0 | 2 | 0 |
| C19 | 1 | 0 | 0 | 0 | 0 |
| C20 | 3 | 0 | 1 | 0 | 1 |
| C21 | 0 | 0 | 3 | 0 | 0 |
| C22 | 1 | 0 | 0 | 0 | 0 |
| C23 | 0 | 0 | 0 | 0 | 0 |
| C24 | 0 | 0 | 0 | 0 | 0 |

### 4.3 Топ маршрутов по жёстким дефектам

| Маршрут | HARD | TRIGGER | Коды |
|---|---:|---:|---|
| `journal/dossiers/g3` | 2 | 1 | C5, C20 |
| `hard-texts/kniga-enoha-kotoroy-ne-bylo-kak-raznye-proizvedeniya-stali-korpusom` | 1 | 3 | C5 |
| `hard-texts/mozhno-li-doveryat-1-enohu-kanonicheskiy-audit` | 1 | 2 | C5 |
| `hard-texts/enoh-prorochestvoval-iuda-14-15-4q204` | 1 | 2 | C7 |
| `baptisty-rossii/goneniya-i-sovest` | 1 | 2 | C5 |
| `hard-texts/duhi-v-temnice-noi-kreshchenie-pobeda` | 1 | 1 | C7 |
| `hard-texts/blagovestie-mertvym-1-petra-4-5-6` | 1 | 1 | C7 |
| `hard-texts/angely-pod-mrakom-iuda-6-7-2-petra-2` | 1 | 1 | C7 |
| `baptisty-rossii/podpolnaya-pechat` | 1 | 1 | C5 |
| `baptisty-rossii/yuzhnaya-shtunda` | 1 | 0 | C5 |
| `baptisty-rossii/sovetskaya-noch` | 1 | 0 | C5 |
| `baptisty-rossii/noch-na-kure` | 1 | 0 | C5 |
| `baptisty-rossii/dva-sezda-1884` | 1 | 0 | C5 |
| `articles/teksty-pisaniya-kotorymi-manipuliruyut` | 1 | 0 | C7 |
| `articles/kogda-chelovek-uhodit-ot-very` | 1 | 0 | C20 |
| `articles/20-antisovetov-pastoru` | 1 | 0 | C7 |

### 4.4 Все находки

| Маршрут | Код | Класс | Сообщение |
|---|---|---|---|
| `articles/20-antisovetov-pastoru` | C7 | HARD | греч/евр фрагментов 12, lang-атрибутов 0 (source-level) |
| `articles/anatomiya-padeniya-pyat-stadiy` | C3 | TRIGGER | нет заголовка раздела источников при sourcesRequired (2088 слов); сносок/URL в прозе=5 — проверить аппарат |
| `articles/anatomiya-padeniya-pyat-stadiy` | C8 | TRIGGER | нет читательской библиографии — галлюцинационный риск не закрыт |
| `articles/cerkovnaya-disciplina-vlast-granicy-zashchita` | C7 | TRIGGER | греч/евр фрагментов 4, lang-атрибутов 0 — проверить исключения WCAG |
| `articles/diotrefy-nashego-vremeni` | C15 | TRIGGER | лозунговых тезисов 6 (3.1/1000) при пороге 2.0 |
| `articles/dzhon-gill-chast-1-chelovek` | C4 | TRIGGER | нет «Коротко»/summary при длинной статье — сверить с route-контрактом |
| `articles/dzhon-gill-chast-2-uchenyi` | C18 | TRIGGER | puffery=7 клише=0 — искусственная важность |
| `articles/dzhon-gill-chast-2-uchenyi` | C4 | TRIGGER | нет «Коротко»/summary при длинной статье — сверить с route-контрактом |
| `articles/dzhon-gill-chast-2-uchenyi` | C6 | TRIGGER | склейки в собранной строке парсера (1), в исходнике не воспроизвелись — нужна DOM-проверка |
| `articles/dzhon-gill-chast-3-nasledie` | C4 | TRIGGER | нет «Коротко»/summary при длинной статье — сверить с route-контрактом |
| `articles/dzhon-gill-chast-4-ekzeget` | C15 | TRIGGER | лозунговых тезисов 4 (1.4/1000) при пороге 1.2 |
| `articles/dzhon-gill-chast-4-ekzeget` | C22 | TRIGGER | readingTime=71 против 2830 слов (40 сл/мин) — сверить с контрактом |
| `articles/dzhon-gill-chast-4-ekzeget` | C4 | TRIGGER | нет «Коротко»/summary при длинной статье — сверить с route-контрактом |
| `articles/dzhon-gill-spravochnik` | C9 | TRIGGER | 1479 слов < минимума 1500 для T4-REFERENCE (MDX 0) |
| `articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki` | C18 | TRIGGER | puffery=8 клише=25 — искусственная важность |
| `articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki` | C19 | TRIGGER | канцелярит/сигнальные обороты 25 |
| `articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki` | C3 | TRIGGER | нет заголовка раздела источников при sourcesRequired (10392 слов); сносок/URL в прозе=0 — проверить аппарат |
| `articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki` | C8 | TRIGGER | нет читательской библиографии — галлюцинационный риск не закрыт |
| `articles/kod-da-vinchi` | C3 | TRIGGER | нет заголовка раздела источников при sourcesRequired (4717 слов); сносок/URL в прозе=0 — проверить аппарат |
| `articles/kod-da-vinchi` | C4 | TRIGGER | нет «Коротко»/summary при длинной статье — сверить с route-контрактом |
| `articles/kod-da-vinchi` | C8 | TRIGGER | нет читательской библиографии — галлюцинационный риск не закрыт |
| `articles/kogda-chelovek-uhodit-ot-very` | C20 | HARD | непереведённый редакционный жаргон (3 вхождений, 3 разных): assurance, doctrinal authority, perseverance |
| `articles/kogda-uhodit-kogda-ostavatsya` | C18 | TRIGGER | puffery=4 клише=0 — искусственная важность |
| `articles/krajne-li-isporcheno-serdce` | C16 | TRIGGER | отрицательный параллелизм 27 (2.8/1000) |
| `articles/nesovershennyy-chelovek-v-nesovershennoy-cerkvi` | C10 | TRIGGER | "остроумных" заголовков 17/44 — 18F/NN/g: clear better than clever |
| `articles/osvobozhdennoe-serdce` | C16 | TRIGGER | отрицательный параллелизм 6 (3.4/1000) |
| `articles/otstuplenie-chto-govorit-bibliya` | C20 | TRIGGER | один непереведённый термин «doctrinal authority» — сверить с S44 (перевод рядом) |
| `articles/otstuplenie-chto-govorit-bibliya` | C7 | TRIGGER | греч/евр фрагментов 7, lang-атрибутов 0 — проверить исключения WCAG |
| `articles/otstupniki-biblii-iuda-saul-ierovoam-dimas` | C16 | TRIGGER | отрицательный параллелизм 7 (2.6/1000) |
| `articles/petr-i-iuda-padenie-ili-otstuplenie` | C10 | TRIGGER | "остроумных" заголовков 16/43 — 18F/NN/g: clear better than clever |
| `articles/petr-i-iuda-padenie-ili-otstuplenie` | C20 | TRIGGER | один непереведённый термин «doctrinal authority» — сверить с S44 (перевод рядом) |
| `articles/religioznoe-serdce` | C15 | TRIGGER | лозунговых тезисов 5 (2.7/1000) при пороге 2.5 |
| `articles/sem-tipov-razlichenie-uchiteley` | C7 | TRIGGER | греч/евр фрагментов 3, lang-атрибутов 0 — проверить исключения WCAG |
| `articles/serdce-hrista-k-nemoshchnym` | C16 | TRIGGER | отрицательный параллелизм 13 (2.4/1000) |
| `articles/skrytye-idoly-serdca` | C16 | TRIGGER | отрицательный параллелизм 7 (3.1/1000) |
| `articles/sovershennoletie-roditelskaya-vlast-chto-menyaetsya` | C15 | TRIGGER | лозунговых тезисов 23 (4.7/1000) при пороге 3.5 |
| `articles/starye-dorozhki-serdca` | C16 | TRIGGER | отрицательный параллелизм 6 (2.2/1000) |
| `articles/steven-lawson-samoobman-i-publichnyy-golos` | C4 | TRIGGER | нет «Коротко»/summary при длинной статье — сверить с route-контрактом |
| `articles/steven-lawson-samoobman-i-publichnyy-golos` | C6 | TRIGGER | склейки в собранной строке парсера (6), в исходнике не воспроизвелись — нужна DOM-проверка |
| `articles/teksty-pisaniya-kotorymi-manipuliruyut` | C7 | HARD | греч/евр фрагментов 13, lang-атрибутов 0 (source-level) |
| `articles/vzroslaya-doch-otets-brak-soglasie-granitsy-vlasti` | C15 | TRIGGER | лозунговых тезисов 21 (3.6/1000) при пороге 3.5 |
| `articles/vzroslyy-rebenok-doma-dengi-pomoshch-posledstviya` | C15 | TRIGGER | лозунговых тезисов 28 (6.1/1000) при пороге 3.5 |
| `articles/vzroslyy-rebenok-ushel-kontakt-pokayanie-vozvrashchenie` | C15 | TRIGGER | лозунговых тезисов 22 (4.6/1000) при пороге 3.5 |
| `baptisty-rossii/dva-sezda-1884` | C5 | HARD | внутренние идентификаторы/каркас в прозе: L_sha=1 |
| `baptisty-rossii/goneniya-i-sovest` | C16 | TRIGGER | отрицательный параллелизм 8 (2.7/1000) |
| `baptisty-rossii/goneniya-i-sovest` | C18 | TRIGGER | puffery=4 клише=0 — искусственная важность |
| `baptisty-rossii/goneniya-i-sovest` | C5 | HARD | внутренние идентификаторы/каркас в прозе: L_sha=1 |
| `baptisty-rossii/noch-na-kure` | C5 | HARD | внутренние идентификаторы/каркас в прозе: L_sha=1 |
| `baptisty-rossii/podpolnaya-pechat` | C16 | TRIGGER | отрицательный параллелизм 7 (3.4/1000) |
| `baptisty-rossii/podpolnaya-pechat` | C5 | HARD | внутренние идентификаторы/каркас в прозе: L_sha=2 |
| `baptisty-rossii/sovetskaya-noch` | C5 | HARD | внутренние идентификаторы/каркас в прозе: L_sha=1 |
| `baptisty-rossii/spravochnik` | C15 | TRIGGER | лозунговых тезисов 7 (2.9/1000) при пороге 2.0 |
| `baptisty-rossii/spravochnik` | C17 | TRIGGER | триады 16 + тире 96 — ровный ритм |
| `baptisty-rossii/spravochnik` | C5 | TRIGGER | статус HOLD упомянут в читательском тексте — проверить, объяснён ли он читателю |
| `baptisty-rossii/yuzhnaya-shtunda` | C5 | HARD | внутренние идентификаторы/каркас в прозе: L_sha=1 |
| `hard-texts` | C10 | TRIGGER | "остроумных" заголовков 3/8 — 18F/NN/g: clear better than clever |
| `hard-texts/angely-pod-mrakom-iuda-6-7-2-petra-2` | C7 | HARD | греч/евр фрагментов 56, lang-атрибутов 0 (source-level) |
| `hard-texts/angely-pod-mrakom-iuda-6-7-2-petra-2` | C9 | TRIGGER | 1468 слов < минимума 1500 для T2-EXEGESIS (MDX 1401) |
| `hard-texts/blagovestie-mertvym-1-petra-4-5-6` | C7 | HARD | греч/евр фрагментов 59, lang-атрибутов 0 (source-level) |
| `hard-texts/blagovestie-mertvym-1-petra-4-5-6` | C9 | TRIGGER | 1450 слов < минимума 1500 для T2-EXEGESIS (MDX 1383) |
| `hard-texts/duhi-v-temnice-noi-kreshchenie-pobeda` | C21 | TRIGGER | нет исходящих ссылок (доверие по NN/g) |
| `hard-texts/duhi-v-temnice-noi-kreshchenie-pobeda` | C7 | HARD | греч/евр фрагментов 91, lang-атрибутов 0 (source-level) |
| `hard-texts/enoh-prorochestvoval-iuda-14-15-4q204` | C5 | TRIGGER | статус HOLD упомянут в читательском тексте — проверить, объяснён ли он читателю |
| `hard-texts/enoh-prorochestvoval-iuda-14-15-4q204` | C7 | HARD | греч/евр фрагментов 27, lang-атрибутов 0 (source-level) |
| `hard-texts/enoh-prorochestvoval-iuda-14-15-4q204` | C9 | TRIGGER | 1424 слов < минимума 1500 для T2-EXEGESIS (MDX 1357) |
| `hard-texts/kniga-enoha-kotoroy-ne-bylo-kak-raznye-proizvedeniya-stali-korpusom` | C20 | TRIGGER | один непереведённый термин «authority-формула» — сверить с S44 (перевод рядом) |
| `hard-texts/kniga-enoha-kotoroy-ne-bylo-kak-raznye-proizvedeniya-stali-korpusom` | C21 | TRIGGER | нет исходящих ссылок (доверие по NN/g) |
| `hard-texts/kniga-enoha-kotoroy-ne-bylo-kak-raznye-proizvedeniya-stali-korpusom` | C5 | HARD | внутренние идентификаторы/каркас в прозе: L_authority=3 |
| `hard-texts/kniga-enoha-kotoroy-ne-bylo-kak-raznye-proizvedeniya-stali-korpusom` | C5 | TRIGGER | статус HOLD упомянут в читательском тексте — проверить, объяснён ли он читателю |
| `hard-texts/mozhno-li-doveryat-1-enohu-kanonicheskiy-audit` | C21 | TRIGGER | нет исходящих ссылок (доверие по NN/g) |
| `hard-texts/mozhno-li-doveryat-1-enohu-kanonicheskiy-audit` | C5 | HARD | внутренние идентификаторы/каркас в прозе: L_authority=6 |
| `hard-texts/mozhno-li-doveryat-1-enohu-kanonicheskiy-audit` | C5 | TRIGGER | статус HOLD упомянут в читательском тексте — проверить, объяснён ли он читателю |
| `journal/dossiers/g3` | C20 | HARD | непереведённый редакционный жаргон (5 вхождений, 4 разных): evidence route, evidence set, immutable research, research handoff |
| `journal/dossiers/g3` | C5 | HARD | внутренние идентификаторы/каркас в прозе: L_authority=1 |
| `journal/dossiers/g3` | C6 | TRIGGER | склейки в собранной строке парсера (1), в исходнике не воспроизвелись — нужна DOM-проверка |
| `nagornaya/chast-1` | C16 | TRIGGER | отрицательный параллелизм 12 (5.7/1000) |
| `nagornaya/chast-1` | C18 | TRIGGER | puffery=4 клише=0 — искусственная важность |
| `nagornaya/chast-2` | C7 | TRIGGER | греч/евр фрагментов 5, lang-атрибутов 0 — проверить исключения WCAG |
| `nagornaya/chast-4` | C8 | TRIGGER | нет локального раздела источников — проверить вынесенный owner (напр. /nagornaya/istochniki/) |
| `nagornaya/chast-4` | C8 | TRIGGER | нет читательской библиографии — галлюцинационный риск не закрыт |
| `nagornaya/chast-5` | C18 | TRIGGER | puffery=7 клише=1 — искусственная важность |

### 4.5 Ключевые жёсткие находки

- **9 утечек каркаса.** 6 баптистских маршрутов публикуют `Research \`main\` … authority-контур`, `94f05457c2cfb03560c41414cb6a44cc1fdd4a98`, `A1/A2/A3/B1/C/D`, `SHA256`/`SHA-256`; 2 hard-texts — `Research authority \`GEN6-ENOCH-…-DECISION-LXV/LXVI\``, `VERSION-HOLD`; дossier G3 — `<strong>Research authority:</strong> {G3_PUBLICATION_HANDOFF.researchRepo}`. Это расширение `GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK`, а не стилистика.
- **6 маршрутов с греч/евр без `lang`.** 56 / 59 / 91 / 27 / 13 / 12 фрагментов; на уровне исходника найден только `lang="ru"`. Совпадает с независимым DOM-результатом MASTER 289/39 и `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT`. Пример: `Ἐπροφήτευσεν δὲ καὶ τούτοις` без `lang="grc"`.
- **2 маршрута с непереведённым редакционным жаргоном.** `kogda-chelovek-uhodit-ot-very`: `assurance`, `perseverance`, `doctrinal authority` в русской прозе; `journal/dossiers/g3`: `immutable Research handoff`, `evidence set`, `evidence route`. Одиночные `doctrinal authority` / `authority-формула` оставлены TRIGGER (S44 «перевод рядом»).
- **Не подтвердилось на этом якоре:** известные MASTER-малформации `academическую`, `обеспечредительные`, `обеспредительная`, `самосуверенности`, `установленно виновным`, `телологии`, `Фидельные` — `grep` по `src/` дал 0. Три «склейки» C6 оказались артефактом собранной строки парсера (`яP`, `еT`, `оL` в исходнике отсутствуют) → понижены до DOM-триггера. Сырых `???` в исходнике тоже 0; MASTER-дефект 9 маршрутов остаётся **DOM-only** и требует браузерного witness.

### 4.6 Exact negative fixtures — все 17 жёстких находок

Якорь `5e2db6f0fdd0257818f1a215fca16d4cc884e2d8`. Пути relative to Product root. Строка приведена с контекстом вокруг совпадения.

| Маршрут | Код | Файл:строка | Точная строка |
|---|---|---|---|
| `articles/20-antisovetov-pastoru` | C7 | `src/components/article-pilots/antisovetov/AntisovetovBody.astro:115` | ны нередко формируют свои тайные коалиции. Писание называет это грехом наушничества (евр. נִרְגָּן — нирган — «клеветник, доносчик») и разделений (αἵρεσις — «партия, фракция»). |
| `articles/kogda-chelovek-uhodit-ot-very` | C20 | `src/content/articles/kogda-chelovek-uhodit-ot-very.mdx:100` | Поэтому assurance нельзя строить на формуле: когда-то был опыт, служение, крещение или молитва — значит нынешняя сознательная война проти |
| `articles/teksty-pisaniya-kotorymi-manipuliruyut` | C7 | `src/content/articles/teksty-pisaniya-kotorymi-manipuliruyut.mdx:68` | тавникам вашим и будьте покорны».** Этот стих нельзя обезвредить переводом одного слова. `πείθεσθε` действительно может нести оттенок доверия/убеждения, но автор добавляет `ὑπείκετε` — «уступайте, подчиняйтесь». Текст |
| `baptisty-rossii/dva-sezda-1884` | C5 | `src/components/baptisty-rossii/BaptistyRossiiDvaSezda1884Body.astro:102` | authority-контур для claim-level verification; проверенный snapshot на 11 сентября 2026: `94f05457c2cfb03560c41414cb6a44cc1fdd4a98`. Отдельные A1/A2/A3/B1/C/D и access/locator/rights/publication states не подменяются одн |
| `baptisty-rossii/goneniya-i-sovest` | C5 | `src/components/baptisty-rossii/BaptistyRossiiGoneniyaISovestBody.astro:143` | authority-контур для claim-level verification; проверенный snapshot на 11 сентября 2026: `94f05457c2cfb03560c41414cb6a44cc1fdd4a98`. Отдельные A1/A2/A3/B1/C/D и access/locator/rights/publication states не подменяются одн |
| `baptisty-rossii/noch-na-kure` | C5 | `src/components/baptisty-rossii/BaptistyRossiiNochNaKureBody.astro:137` | authority-контур для claim-level verification; проверенный snapshot на 11 сентября 2026: `94f05457c2cfb03560c41414cb6a44cc1fdd4a98`. Отдельные A1/A2/A3/B1/C/D и access/locator/rights/publication states не подменяются одн |
| `baptisty-rossii/podpolnaya-pechat` | C5 | `src/components/baptisty-rossii/BaptistyRossiiPodpolnayaPechatBody.astro:87` | ме. Точный локальный PDF-файл этого выпуска уже хранится в исследовательском корпусе; его SHA256 проверен и зафиксирован, но визуальная проверка факсимиле ещё не завершена. Каждое раскрытие било по сети, но не остан |
| `baptisty-rossii/sovetskaya-noch` | C5 | `src/components/baptisty-rossii/BaptistyRossiiSovetskayaNochEvidence.astro:27` | копия и SHA-256 сверены по MASTER. |
| `baptisty-rossii/yuzhnaya-shtunda` | C5 | `src/components/baptisty-rossii/BaptistyRossiiYuzhnayaShtundaBody.astro:121` | authority-контур для claim-level verification; проверенный snapshot на 11 сентября 2026: `94f05457c2cfb03560c41414cb6a44cc1fdd4a98`. Отдельные A1/A2/A3/B1/C/D и access/locator/rights/publication states не подменяются одн |
| `hard-texts/angely-pod-mrakom-iuda-6-7-2-petra-2` | C7 | `src/content/articles/angely-pod-mrakom-iuda-6-7-2-petra-2.mdx:34` | 3. Ближайшим референтом `τούτοις` с высокой вероятностью являются ангелы, но эту синтаксическую связь нельзя объявлять математически безальтернативной. |
| `hard-texts/blagovestie-mertvym-1-petra-4-5-6` | C7 | `src/content/articles/blagovestie-mertvym-1-petra-4-5-6.mdx:30` | 1. `Νεκροῖς` в 1 Пет. 4:6 естественно обозначает физически умерших людей, но не сообщает, были ли они мертвы уже в момент благове |
| `hard-texts/duhi-v-temnice-noi-kreshchenie-pobeda` | C7 | `src/content/articles/duhi-v-temnice-noi-kreshchenie-pobeda.mdx:33` | 2. В 1 Пет. 3:18 ECM2/NA28 принимает `ἔπαθεν` — «пострадал»; древнее `ἀπέθανεν` — «умер» — непосредственно засвидетельствовано Синайским кодексом. |
| `hard-texts/enoh-prorochestvoval-iuda-14-15-4q204` | C7 | `src/content/articles/enoh-prorochestvoval-iuda-14-15-4q204.mdx:58` | Ἐπροφήτευσεν δὲ καὶ τούτοις |
| `hard-texts/kniga-enoha-kotoroy-ne-bylo-kak-raznye-proizvedeniya-stali-korpusom` | C5 | `src/content/articles/kniga-enoha-kotoroy-ne-bylo-kak-raznye-proizvedeniya-stali-korpusom.mdx:296` | Research authority `GEN6-ENOCH-ASTRONOMICAL-DECISION-LXVI` закрывает blocking version-plurality HOLD, сохраняя неопределённость `astronomi |
| `hard-texts/mozhno-li-doveryat-1-enohu-kanonicheskiy-audit` | C5 | `src/content/articles/mozhno-li-doveryat-1-enohu-kanonicheskiy-audit.mdx:282` | Текстовая форма locus установлена достаточно, чтобы снять `VERSION-HOLD`: арамейский свидетель частичен и реконструирован, но греческая и геэз-версии сохраняют полную согласующуюся конструкци |
| `journal/dossiers/g3` | C5 | `src/components/journal/G3Dossier.astro:365` | Research authority: {G3_PUBLICATION_HANDOFF.researchRepo} · {snapshot} |
| `journal/dossiers/g3` | C20 | `src/components/journal/G3Dossier.astro:66` | Публикация ограничена immutable Research handoff. Непроверенные, спорные и исключённые утверждения |

### 4.7 Положительные контроли (стандарт соблюдён)

| Стандарт | Файл:строка | Текст |
|---|---|---|
| S3/S43 | `src/content/articles/enoh-prorochestvoval-iuda-14-15-4q204.mdx:201` | > Иуда приписывает оракул Еноху; материально прослеживаемая история соответствующей Еноховой текстовой традиции представлена источниками эпохи Второго храма. |
| S3/S43 | `src/content/articles/enoh-prorochestvoval-iuda-14-15-4q204.mdx:207` | Вторая формула является богословским выводом из принятого авторитета канонического текста. Её нельзя выдавать за результат непрерывно сохранившейся рукописной цепочки. |
| S10/S43 | `src/content/articles/enoh-prorochestvoval-iuda-14-15-4q204.mdx:147` | Нельзя писать: |
| S10 | `src/content/articles/enoh-prorochestvoval-iuda-14-15-4q204.mdx:169` | Точный вывод: |
| S28/S43 | `src/content/articles/enoh-prorochestvoval-iuda-14-15-4q204.mdx:107` | Эти различия важны для точного перевода, но не отменяют общей литературной связи. |

### 4.8 Чего 0 авто-срабатываний НЕ означает

C1/C2/C11/C12/C13 — ручные lane (протокол §3.3). C23 (покрытие MDX↔компоненты) и C24 (draft/noindex) прошли авто-проверку без нарушений: 6 `metadata-only` и 13 `rendered` статей реально имеют прозу в компонентах; `draft:false`/`noindex:false` в порядке. Первый парсер давал им ложные «0 слов» из-за чистого Markdown без `<p>` — исправлено.

---

## 5. РАСПРЕДЕЛЕНИЕ МЕЖДУ 3 АГЕНТАМИ

| Агент | Зона | Критерии | Выход |
|---|---|---|---|
| **A (этот)** | Методология + прогон по **всем 111** + матрицы + 17 fixtures + редакционная риторика | C10, C14–C19, C9, C22; сводка; сверка с MASTER | этот `REPORT.md` + `ALL_ARTICLES_MATRIX.csv` |
| **B** | Evidence/claim/источники: T1 + T4 + `hard-texts` (≈26) | C1, C2, C3, C8, C5, C20; §3.3 | точные negative fixtures по claim/locator/edition/rights |
| **C** | Publication/runtime: T3 + T5 + Nagornaya + остальные `/articles` + хабы | C5, C6, C7, C20, C21, C23, C24, C4; DOM-parity, `???`, typograf, `lang` | source→rendered парность на final head, браузерные проверки |

- Один ключ **`route + criterion_id`**; поля `agent`, `status`, `evidence`, `anchor`, `claim_boundary`, `what_this_evidence_does_not_prove` — по `projects/_templates/AGENT_REPORT_TEMPLATE.md`.
- Не плодить файлы; общая матрица одна. Не создавать новый универсальный чек-лист/контракт (wave23); закрывать существующие строки MASTER и добавлять exact negative fixtures.
- Не делать выводов об авторстве.

### 5.1 Ветки и пуш

- Пуш разрешён пользователем в этом ходе. Пушу **только** в `arena/0b6f34f6-auditrepo`; чужие ветки не переключаю, не создаю, не трогаю. Перед записью сверены `git branch --show-current` и `git status --short`.
- Удалённая ветка `origin/arena/0b6f34f6-auditrepo` до пуша отсутствовала; создаётся этим пушем. Если Arena действительно держит три окна в разных ветках — конфликт имён исключён нашим уникальным `incoming/arena-all-articles-audit/2026-11-09/`.
- Проверены открытые PR в AuditRepo (#545, #544, #543, #542, #538, #521, #514) — нашу article-lane не пересекают. PR отчёта не открывается.

---

## 6. Ограничения и граница доказательства

- **Source-level, не DOM/браузер.** Окончательные verdict-ы по `lang`, `???`, типографике и утечкам требуют final-head/browser witness; часть уже есть в MASTER и `reverify/`.
- `words` = дедуплицированный читательский текст из MDX + рекурсивно импортированных `.astro`; может включать UI-copy; не байт-точный DOM-подсчёт.
- Пороги C14–C19 калибровались по медианам этого корпуса; для другого корпуса пересчитываются.
- Внешние страницы прочитаны выборочно (Wikipedia Signs chunk 0/2 из 31; WP:RS chunk 0; GOV.UK A–Z chunk 0 из 11); Microsoft 404.
- Не проверялась фактическая истинность каждого исторического/богословского утверждения — lane агента B.

### 6.1 What this evidence does **not** prove

- Не доказывает, что какая-либо статья написана ИИ или человеком.
- Не доказывает, что 62 маршрута без авто-находок «чисты»: ручные lane не пройдены, DOM не собран.
- Не доказывает, что строки MASTER устарели: отсутствие `academическую` и `???` в исходнике на новом якоре может означать исправление, другую поверхность или DOM-only проявление.
- Не доказывает need для нового контракта, нового чек-листа или нового визуального шаблона.
- Не заменяет owner-решение по тирам S19 и по `readingTime`.

---

## 7. Приоритеты

1. **P0** — 9 утечек каркаса: добавить exact negative fixtures из §4.6 в существующие gate-ы, strict exit, source→final parity. Не создавать новую строку MASTER.
2. **P0** — `lang="grc"/"he"` на 6 маршрутах с ≥10 фрагментами; сверить с DOM-результатом 289/39 и `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT`.
3. **P1** — 2 маршрута с гибридным английским (C20 HARD) и 3 одиночных термина (C20 TRIGGER) по S44; отделить библиографические названия от прозы.
4. **P1** — DOM-проверка C6/`???`/типографики; `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN` (`Would change: 6 files`, exit 0) и `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS` (9 маршрутов).
5. **P1** — агенту B: C1/C2/C3/§3.3 по T1/T4/hard-texts; 3 маршрута без заголовка источников проверить на сноски/библиографию, не браковать сразу.
6. **P2** — редакционные триггеры: 8 лозунговых, 9 с отрицательным параллелизмом, 6 с puffery; править только где тезис заменяет S43.
7. **P2** — 4 статьи в пороговой зоне S19 (1424–1479 слов) и `dzhon-gill-chast-4-ekzeget` (readingTime 71 vs 2830 слов) отдать owner на решение о роли, не «добивать word count».

---

## 8. Волна 2: что исправлено относительно первого прогона

| Было | Стало | Причина |
|---|---|---|
| 82 находки / 24 HARD | **81 / 17 HARD** | калибровка ниже |
| C6 = 3 HARD «малформации» | C6 = 3 TRIGGER, 0 HARD | `яP/еT/оL` есть только в собранной строке парсера; в исходнике отсутствуют; известные MASTER-формы на якоре не воспроизводятся |
| C20 = 6 HARD | C20 = 2 HARD + 3 TRIGGER | английские названия книг/диссертаций и `(perseverance of the saints)` с русским переводом — легитимны (S44); оставлен только непереведённый редакционный жаргон |
| «нет заголовка источников» = 15 HARD | 3 TRIGGER | после исправления regex заголовков и проверки сносок/вынесенного owner |
| C9 / C4 / C7 частично HARD | динамично: C9/C4 TRIGGER, C7 HARD только при ≥10 фрагментах | S19 «ориентиры», §1 «обычно», WCAG-исключения |
| 17 HARD без адресов | 17 exact `file:line` + строка | добавлены negative fixtures на якоре `5e2db6f0fdd0` |
| только негатив | +5 положительных контролей S3/S10/S28/S43 | чтобы критерии не стали «поиском виноватых» |
| GOV.UK thin, WP:RS не прочитан | A–Z style guide + WP:RS добавлены | закрыта дыра в положительном списке |
| пуш запрещён | пуш в свою ветку разрешён | явная команда пользователя |


---

## 9. Волна 3 — реальные Product gates, built-DOM witness и ручные lane

**Статус:** дополняет §§1–8, не отменяет их. Тот же anchor `5e2db6f0fdd0257818f1a215fca16d4cc884e2d8`; 17 source-HARD fixtures и 5 положительных контролей из §4.6/§4.7 остаются базой. Новое здесь — полный checkout Product, `npm ci`, реальный `dist`, прогон гейтов, статический DOM-ценз и bounded triage ручных C1/C2/C11/C12/C13. На момент волны 3 браузера/AX не было; волна 4 (§10) добавляет bounded Chromium witness, внешней проверки источников по-прежнему нет.

### 9.0 Границы и воспроизводимость

```text
/tmp/gbs-product: git sparse-checkout disable   -> 3363 tracked files, 275 MB, anchor unchanged
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci       -> 377 packages, node_modules 342 MB, exit 0
npm run strangler:build                         -> exit 0, dist 1248 files / 101 MB, 116 HTML
astro:check (внутри build)                     -> 641 files, 0 errors, 0 warnings, 7 hints
parse5 DOM-ценз /tmp/aiq/dom*.js               -> 112 index.html; 111 соответствуют матрице + 1 утилита
                                                  /konfessii/russkij-baptizm/_app/ (вне 111);
                                                  CSV `index.astro` сопоставлен с `/`
```

DOM-ценз: эффективный унаследованный `lang` от `<html lang="ru">`, Text-узлы parse5, пропуск `script/style/template/noscript/svg/math`, фильтр hidden/`sr-only`; греч. `U+0370–03FF/U+1F00–1FFF`, евр. `U+0590–05FF`; отдельно группируются multi-run phrases из ≥2 иноязычных runs, разделённых только пробелом/пунктуацией. Это **статический final-HTML witness**, не painted/AX/browser witness.

**Самокоррекция sparse-выгрузки.** На неполном sparse-checkout те же команды давали ложные ошибки: `content:sources:check` — 20 «legacy source unavailable», `content:parity` — 10 «legacy reference not found», `typograf:dry` — `ENOENT /tmp/gbs-product/articles`, `content:coverage:audit` — `dist not found`. После `git sparse-checkout disable` и `npm ci` они исчезли. Это артефакт среды, не регрессия Product и не зелёный результат гейтов.

### 9.1 Реальные gates на полном якоре

| Команда | Exit | Ключевой вывод | Что НЕ доказывает |
|---|---:|---|---|
| `article:qa` | 0 | 180 article files, 0 errors / 0 warnings; semantic manifest 2 routes / 2 deletion mutations killed | редакционную пригодность; не видит `karty/**/*.json` |
| `content:sources:check` | 0 | 54 published series parts, 112 route profiles, 70 MDX, 28 canonical / 42 reference-only, 0 explicit draft, 53 legacy paths; «every published part … explicit provenance» | само содержание claim, edition, rights, независимую corroboration |
| `content:parity` | 0 | STRICT, 73 routes, 73 strict-native, 57 derived runtime contracts, 0 source-only markers; effective contracts coherent | текстовую parity прозы, фактическую истинность |
| `mdx:structure:audit` | 0 | 70 MDX, 0 errors / 0 warnings | источники/локаторы/язык частей |
| `readable-audit` | 0 | readable/publication layer passed | одиночные homoglyph-малформации |
| `validate` / `validate:strict` | 0 | 0 errors, 2 warnings (`css/highlights-runtime.css`, `css/site.css`: нестандартный брейкпоинт `767px`); Russian quote policy passed | typograf drift, DOM-утечки |
| `seo-audit` | 0 | 0 errors / 0 warnings | редакционный текст |
| `engine:contracts` | 0 | reader/relation/Atlas contracts intact; series façade 46 consumers; Nagornaya bar asset 5 mounts, rev `3c7e0bdd` | browser/runtime клики |
| `content:coverage:audit` | 0 | internal contract 6/6; `expected=0, exercised=0, explicit-skips=111, undeclared=0, warnings=0, passed=1/1` | покрытие контента: **все 111 маршрутов явно пропущены** |
| `maps:validate` | 0 | 11 route files, publication statuses consistent | `Чекy` в `/karty/ishod/` |
| `editorial:lint` / `sources:hygiene` / `data:consistency` / `content:guard` | 0 | pass / «No backstage research scaffolding …» / pass / 43 baseline pages +3 delta | полный охват серийных конфигов и всех типов каркаса |
| `migration:metadata:check:strict` | 0 | все production Astro routes покрыты; `Series shapes: {"flat":46,"book":36}`; public-surface-registry verified | серийную идентичность в прозе |
| `astro:audit:article-mdx:strict` | 0 | 37 routes passed, 27 warnings «no immutable migration baseline found for content floor» | отсутствие редакционных дефектов |
| `typograf:dry` | **0** | `Would change: 6 files` | типографическую чистоту: **fail-open** |

`validate:static-publication`, `engine:guard`, browser visual/parity и `source:links:dist` **не запускались**: нет Chromium (`~/.cache/ms-playwright` пуст, системного binary нет), внешний egress ограничен. Поэтому «весь CI зелёный» не заявляется. `npm ci` и сборка выполнены только в `/tmp`; Product не коммитился. `scripts/typograf.js` один раз применён к временному клону для точного diff (16 изменённых строк), затем `git checkout -- articles` восстановил исходник.

### 9.2 Зелёные gates ≠ редакционная пригодность

На одном и том же якоре одновременно верны:

- 17 source-HARD из §4.6;
- `article:qa`, `content:parity`, `mdx:structure`, `readable-audit`, `validate:strict`, `seo-audit`, `engine:contracts` — exit 0;
- финальный `dist` всё ещё содержит служебный каркас (9/9 source C5-HARD воспроизводятся), 515 видимых иноязычных runs без `lang`, `Чекy`, гибридный английский C20 и 6 файлов типографического drift при exit 0.

Это прямое подтверждение запрета подменять редакционную проверку зелёным CI. Не создаётся новая строка MASTER, не изобретается новый ADMIT/универсальный чек-лист; активные owner-строки остаются: `GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK`, `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT`, `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`, `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN`, `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS`, `SYS-PUBLICATION-MIXED-SCRIPT-SURFACE-COVERAGE`.

### 9.3 DOM-ценз: язык частей

| Метрика | Волна 3, `dist` | Комментарий |
|---|---:|---|
| HTML-документов | 112 | 111 строк матрицы + `/konfessii/russkij-baptizm/_app/` |
| греч. + евр. runs | 1029 | 829 Greek + 200 Hebrew |
| runs с эффективным `ru`/без `lang` | 543 | 38 routes; после hidden-фильтра **515 / 38 routes** |
| корректно размеченных runs | **486 / 34 routes** | платформа умеет `grc`/`he`/`el`/`la`; это не «невозможно» |
| консервативные multi-run phrases без `lang` | **96 / 15 routes** | **89 видимых / 14 routes**; не зависит от исключения для отдельных технических лексем |
| корректно размеченные multi-run phrases | 60 / 15 routes | Home `/` имеет 86 correct runs, 27 correct phrases, 0 missing |
| `/` Home healthy control | 28 Greek + 58 Hebrew, 0 missing | но 9 `aria-label` с ивритом при эффективном `ru` — TRIGGER, не HARD |
| foreign text в атрибутах | 29 / 6 routes | `aria-label`, `id`, `astro-island props`; AX/browser не проверен |
| маршрутов с ≥10 видимыми missing runs | **11** | 5 из 6 source C7-HARD + 6 новых кандидатов |

**Сверка с MASTER без ложной регрессии.** `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT` фиксировал 289/39 routes и 109 multi-run/20 на других якорях/методике. Наш свежий anchor даёт 543/41 raw, 515/38 visible, 96/15 phrases. Это **не объявление регрессии и не закрытие строки**: отличаются anchor, фильтр hidden, группировка runs и порог. Независимо от методики, свежий консервативный набор из 89 видимых фраз на 14 маршрутах достаточно, чтобы не списывать дефект на WCAG-исключение для одиночных терминов.

**11 маршрутов с ≥10 видимыми missing runs** (`domLangMissingVisible` в CSV):

| Route | Visible missing | Correct tagged | Статус относительно §4.6 |
|---|---:|---:|---|
| `articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki` | 15 | 0 | новый DOM-кандидат |
| `articles/novoe-serdce` | 15 | 11 | новый DOM-кандидат |
| `articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy` | 37 | 6 | новый DOM-кандидат |
| `articles/serdce-hrista-k-nemoshchnym` | 42 | 42 | новый DOM-кандидат; смешанная разметка |
| `articles/serdce-i-duh` | 24 | 16 | новый DOM-кандидат |
| `articles/teksty-pisaniya-kotorymi-manipuliruyut` | 15 | 0 | source C7-HARD, воспроизведён |
| `hard-texts/angely-pod-mrakom-iuda-6-7-2-petra-2` | 65 | 0 | source C7-HARD, воспроизведён |
| `hard-texts/blagovestie-mertvym-1-petra-4-5-6` | 69 | 0 | source C7-HARD, воспроизведён |
| `hard-texts/duhi-v-temnice-noi-kreshchenie-pobeda` | 110 | 0 | source C7-HARD, воспроизведён |
| `hard-texts/enoh-prorochestvoval-iuda-14-15-4q204` | 32 | 0 | source C7-HARD, воспроизведён |
| `nagornaya/chast-4` | 18 | 3 | новый DOM-кандидат |

Шестой source C7-HARD `articles/20-antisovetov-pastoru` в финальном DOM имеет **6** видимых runs без `lang` против 12 в исходном скане: часть source-вхождений не дошла до Text-узлов `dist` ( entities/скрытые поверхности/иная проекция). HARD не отзывается: 6 видимых foreign runs без `lang` остаются, но число «12» более не переносить на DOM. 6 новых кандидатов **не записываются автоматически в HARD и не добавляют строки MASTER**: им нужен owner/редакционный разбор исключений WCAG 3.1.2.

**Точные DOM-fixtures консервативных multi-run phrases** (первая видимая фраза на маршруте, `dist/.../index.html:line`):

```text
articles/cerkovnaya-disciplina-vlast-granicy-zashchita/index.html:687        οἰκονόμος θεοῦ
articles/dzhon-gill-chast-4-ekzeget/index.html:410                            εἰς ἡμᾶς
articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html:1261  τὰ περὶ ἑαυτοῦ
articles/novoe-serdce/index.html:711                                           שֵׁם קָדְשִׁי
articles/osvobozhdennoe-serdce/index.html:708                                  σῶμα πνευματικόν
articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/index.html:719           πεπραμένος, θέλω
articles/serdce-hrista-k-nemoshchnym/index.html:714                            κατὰ πάντα
articles/teksty-pisaniya-kotorymi-manipuliruyut/index.html:712                 εἰς σέ
hard-texts/angely-pod-mrakom-iuda-6-7-2-petra-2/index.html:711                ἀγγέλους τε τοὺς μὴ τηρήσαντας
hard-texts/blagovestie-mertvym-1-petra-4-5-6/index.html:739                   οἳ ἀποδώσουσιν λόγον
hard-texts/duhi-v-temnice-noi-kreshchenie-pobeda/index.html:736               θανατωθεὶς μὲν σαρκὶ
hard-texts/enoh-prorochestvoval-iuda-14-15-4q204/index.html:713               Ἐπροφήτευσεν δὲ καὶ τούτοις
nagornaya/chast-2/index.html:300                                               πτωχοὶ τῷ πνεύματι
nagornaya/chast-4/index.html:545                                               πᾶσα γραφή θεόπνευστος
```

### 9.4 DOM-ценз: каркас, C20, `???`, смешанный скрипт, типографика

**C5.** 9/9 source C5-HARD воспроизводятся в финальном HTML (63 marker hits / 11 routes). `domScaffold` в CSV считает именно hits, не новые вердикты:

| Route | Hits | `dist` line | Статус |
|---|---:|---|---|
| `baptisty-rossii/dva-sezda-1884` | 5 | `…/index.html:669` | C5 HARD (`94f05457…`, `Research \`main\``, `A1/A2/A3/B1/C/D`) |
| `baptisty-rossii/goneniya-i-sovest` | 5 | `:669` | C5 HARD |
| `baptisty-rossii/noch-na-kure` | 5 | `:669` | C5 HARD |
| `baptisty-rossii/yuzhnaya-shtunda` | 5 | `:669` | C5 HARD |
| `baptisty-rossii/podpolnaya-pechat` | 2 | `:670` | C5 HARD (`SHA256`, «исследовательский корпус») |
| `baptisty-rossii/sovetskaya-noch` | 1 | `:668` | C5 HARD (`SHA-256 … по MASTER`) |
| `hard-texts/kniga-enoha-kotoroy-ne-bylo-...` | 10 | `:940` | C5 HARD (`Research authority \`GEN6-ENOCH-…-DECISION-LXVI\``) |
| `hard-texts/mozhno-li-doveryat-1-enohu-...` | 24 | `:918` | C5 HARD (`VERSION-HOLD`, 14 authority tokens) |
| `journal/dossiers/g3` | 3 | `:229` | C5 HARD + C20 HARD (`Research authority:`) |
| `baptisty-rossii/spravochnik` | 2 | `:670` | **TRIGGER**: объяснение про `SHA-256` и «HOLD до page-level locator» может быть читательской оговоркой, не утечкой |
| `hard-texts/enoh-prorochestvoval-iuda-14-15-4q204` | 1 | `:840` | **TRIGGER**: `<code>HOLD</code>` в пояснении «какие требуют осторожного HOLD» |

То есть «11 routes» ≠ «11 новых C5-HARD»: 2 пограничных маркера оставлены TRIGGER. `sources:hygiene` при этом законно проходит: его `FORBIDDEN` — узкий список (`raw-sources/`, `research-досье`, `_app/index.html`, …), а не `SHA`/`Research authority`/`GEN6`/`A1/A2/A3`/`VERSION-HOLD`; scan dirs охватывают MDX и pilot bodies, из конфигов явно только `baptistFlatSeriesConfig.ts`. Наш отдельный проход теми же regex по 14 series config/data файлам нашёл лишь один **нерендерящийся** комментарий `src/components/article-pilots/_shared/series/pastorSeriesConfig.ts:10` (`… зафиксирован в research/pastor-series/MASTER-PLAN.md`) — не reader leak и не новый контракт.

**C20.** Оба source-HARD доходят до финального HTML: `dist/articles/kogda-chelovek-uhodit-ot-very/index.html:231` (description/JSON-LD: «… assurance и perseverance») и `dist/journal/dossiers/g3/index.html:229` («immutable Research handoff», «публичный evidence route», «evidence set»). Библиографические названия и переведённые термины по-прежнему исключены.

**`???`.** `grep -rloE '\?{3,}' dist --include='*.html'` = **0 файлов / 0 вхождений** во всех 112 HTML, включая атрибуты и комментарии; parse5 Text-узлы тоже 0. На текущем якоре симптом не воспроизвёлся, но `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS` **не закрывается**: нет браузерной painted/ALT-проверки, нет owner-решения, более ранние MASTER-якоря фиксировали 1385 runs. Это observation current anchor, не реабилитация строки.

**C6 / mixed script.** `/karty/ishod/index.html:286` по-прежнему публикует `Суккот = Чекy` и `крепость Чекy` с латинской `y` (U+0079); `article:qa` = 0/0 на 180 article files, `readable-audit` = pass, `maps:validate` = pass. Это ровно граница `SYS-PUBLICATION-MIXED-SCRIPT-SURFACE-COVERAGE`: map JSON/static projection вне article scope. Склеек `яP/еT/оL/иM/еG` и известных MASTER-форм на якоре нет; C6 остаётся 3 TRIGGER / 0 HARD.

**Typograf.** `npm run typograf:dry` exit **0**, но `Would change: 6 files`; применение к временному клону дало 16 изменённых строк, затем откат:

```text
articles/20-antisovetov-pastoru/index.html
articles/dzhon-gill-chast-2-uchenyi/index.html
articles/dzhon-gill-chast-3-nasledie/index.html
articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html
articles/kod-da-vinchi/index.html
articles/krajne-li-isporcheno-serdce/index.html
```

Типичная правка — неразрывный пробел после короткого слова: `по Гиллу` → `по Гиллу`, `не обвал` → `не обвал`. Это точное воспроизведение `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN` на свежем якоре, не новая строка. Python-эмуляция давала 11 файлов из-за Unicode `\b` вместо JS ASCII `\b`; авторитетен только Node-результат 6/16.

### 9.5 Ручные lane C1/C2/C11/C12/C13 — bounded triage, не «закрыто»

Ноль авто-флагов в §4.8 по-прежнему **не доказательство чистоты**. Волна 3 даёт точные внутренние свидетели, но не внешнюю верификацию:

| Lane | Что проверено на якоре | Граница |
|---|---|---|
| **C1** claim/evidence | 5 положительных контролей §4.7 сохранены; `EDITORIAL-SOURCE-POLICY.md:17–30,36–57` (сила формулировки, independence, «пробел честнее правдоподобной детали», типы claim), 15 явных маркеров осторожного вывода в 10 MDX (`Нельзя писать:`, `Точный вывод:`, «нельзя выдавать за», «Эти различия важны») | каждый рискованный claim, «N сообщил X» vs «X произошло», независимая corroboration и права — вручную у агента B; внешние источники не открывались |
| **C2** locator | 70 MDX: **6** со сносками, **96** определений, **82** со строгим locator-like адресом (page/folio/plate/edition/`4Q204`/`IAA`/`CC BY-SA`/`§`); **64** MDX без `[^n]`, но с ≥5 quote-like spans. Положительные контроли: `enoh…mdx:262` Codex Sinaiticus folio 325, `:266` Milik 183–186 / Plate IX, `:274` 4Q204 / version 2026-02-11 / CC BY-SA 4.0 | 14 определений без строгого локатора не = HARD; 64 файла — triage, а не «64 дефекта»; edition/version/rights/контекст не проверены внешне |
| **C11** ход рассуждения | 15 маркеров в 10 MDX; `enoh…mdx:147` «Нельзя писать:», `:169` «Точный вывод:», `:107` различение уровней, `:207` богословский вывод отделён от рукописной цепочки | отсутствие маркера ≠ отсутствие рассуждения; полный проход по 111 routes вручную не сделан |
| **C12** термины | `data/glossary.json` = 137 терминов, `data/glossary-policy.json` = 6 ключей; GOV.UK A–Z / S20 / S44 остаются нормой | first-use объяснение каждого термина и аббревиатуры не автоматизировано; WCAG-исключение для technical terms не отменяет русского перевода |
| **C13** серийная идентичность | 9 config/data modules + `SeriesReaderChrome` façade; `engine:contracts` = 46 consumers; `migration:metadata:check:strict` = flat 46 / book 36 и public-surface-registry verified; `pastor-series-quizzes.ts` = **64 `sourceRef`**, все 64 разрешаются в `id` соответствующего `dist/articles/.../index.html` (`src/runtime/article-quiz.js:164–167` ставит `href` напрямую) | owner-решение о названиях/статусах/числе частей и route-specific identity не принималось; generic-усреднения не вводилось |

**Топ C2-triage** (quote-like spans без сносок): `steven-lawson-samoobman-i-publichnyy-golos` 528, `krajne-li-isporcheno-serdce` 113, `serdce-hrista-k-nemoshchnym` 78, `hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki` 68, `otstuplenie-ot-very-iuda-evreyam-6` 66, `vzroslaya-doch-otets-brak-soglasie-granitsy-vlasti` 62, `serdce-spravochnik` 60, `priznaki-zdorovoy-cerkvi` 54, `sovershennoletie-roditelskaya-vlast-chto-menyaetsya` 54, `vernye-i-neizvestnye-zdorovoe-pastyrstvo` 54. Это **очередь проверки**, не HARD-вердикты и не «доказательство ИИ».

Самокоррекция C13: первый парсер `PASTOR_SERIES_QUIZZES` не учитывал quoted keys (`'sem-tipov':`, `'kogda-uhodit':`, `'zdorovaya-cerkov':`) и ошибочно приписал 23 `sourceRef` к соседней статье, получив «23 missing anchors». После исправления — **64/64 resolved, 60 distinct href, 0 missing**. Это пример, почему ручной lane требует точного `file:line`, а не агрегата «0/23».

### 9.6 Обновлённая матрица и split 3 агентов

`ALL_ARTICLES_MATRIX.csv` остаётся **одним файлом на 111 маршрутов**; добавлены 8 колонок, старые 31 колонка не изменены:

```text
domHtml                 1 для всех 111 (`index.astro` -> `/`; лишний utility HTML не включён)
domLangMissingVisible   видимые Greek/Hebrew runs с эффективным ru (сумма 515)
domLangPhraseMissing    видимые conservative multi-run phrases (сумма 89)
domLangCorrect          корректно размеченные runs (сумма 486)
domScaffold             hits служебных маркеров в финальном HTML (сумма 63)
domQmarks               `???` в Text-узлах (сумма 0)
domMixed                уникальные смешанно-скриптовые токены (сумма 1)
domAttrLangRisk         foreign text в атрибутах под ru (сумма 29)
```

Split не переписывается: общий ключ `route + criterion_id`, поля `agent,status,evidence,anchor,claim_boundary,what_this_evidence_does_not_prove`, один отчёт + одна CSV, не 13 отчётов.

| Агент | Волна 3 | Что осталось |
|---|---|---|
| **A (этот)** | полный checkout, `npm ci`, build, gates, DOM-ценз, 8 новых колонок, §9, самокоррекции | свести финальный ответ; не закрывать MASTER без owner |
| **B** | C2 footnote/quiz `sourceRef` triage, 5 положительных контролей,series config scan | C1/C2/C3/C8/C5/C20: внешняя corroboration, edition/rights/locator, exact negative fixtures |
| **C** | C5/C7/C20/C6 в `dist`, `???`=0, typograf fail-open, `Чекy` | C4/C21/C23/C24 + browser/AX/painted witness, DOM-parity на final head |

**Ветки/пуш.** Перед записью повторно сверены `git branch --show-current` = `arena/0b6f34f6-auditrepo`, `git status --short` = clean, upstream `origin/arena/0b6f34f6-auditrepo`, remote head `983dad7`. Пуш — обычный `git push` только в эту ветку; `push -u` не повторяется, чужие PR/ветки не трогаются, ветка не переключается/не переименовывается.

### 9.7 Чего волна 3 НЕ доказывает

- Волна 3 не имела browser/AX/painted geometry и скриншотов; волны 4–5 добавляют bounded Chromium painted/AX witness, print-media witness и реальные runtime-клики, но не полный cross-browser/owner PDF/печатный аудит.
- Нет внешней проверки исторических/богословских утверждений, edition/version, прав и независимой corroboration.
- Нет вывода «ИИ/человек»: стилевые маркеры остаются TRIGGER.
- Нет нового универсального контракта/чек-листа, новых строк MASTER и автопереписывания прозы.
- Зелёные gates не заменяют редакционную пригодность; `content:coverage:audit` с `explicit-skips=111` и `typograf:dry` с exit 0 при 6 файлах — отдельные напоминания об этом.
- `???`=0 и 89 видимых lang-phrases — наблюдения текущего anchor, а не решение owner по старым MASTER-строкам.

---

## 10. Волна 4 — настоящий headless Chromium, painted/AX witness и browser-gates

**Статус:** дополняет §9, не отменяет 17 source-HARD, 5 положительных контролей и разделение HARD/TRIGGER. Тот же anchor `5e2db6f0fdd0257818f1a215fca16d4cc884e2d8`, тот же `dist`. Волна 3 честно говорила «браузера нет»; волна 4 снимает **только эту** границу в bounded объёме. Внешней проверки источников, авторства, WebKit/Firefox, реального устройства и TTS по-прежнему нет.

### 10.0 Как получен браузер без `npx playwright install`

Официальный CDN Playwright недоступен в sandboxed egress, но `registry.npmjs.org` разрешён. Поэтому:

```text
/tmp/browser: npm i @sparticuz/chromium@153.0.0   -> chromium.br + al2023.tar.br + fonts + swiftshader
inflate('al2023.tar.br')                           -> /tmp/al2023/lib (libnspr4.so, libnss3.so, …)
LD_LIBRARY_PATH=/tmp/al2023/lib
FONTCONFIG_PATH=/tmp/fonts
symlink /tmp/chromium -> ~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome
symlink /tmp/chromium -> ~/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell
python3 -m http.server 8123 --directory /tmp/gbs-product/dist --bind 0.0.0.0
```

Playwright 1.62 из `node_modules` Product запускал этот `chrome-headless-shell`; внешние запросы в browser-sweep блокировались, локальные `127.0.0.1:8123` разрешались. Один первичный `SIGSEGV` при launch устранён повторной попыткой с урезанными args — это нестабильность headless-shell в песочнице, не дефект Product. Static server после всех проверок остановлен; `git status` клона Product чист, anchor не менялся.

### 10.1 Реальные Product browser-gates

| Команда | Exit | Результат | Граница |
|---|---:|---|---|
| `npm run validate:static-publication:light` | 0 | 4134 строки; `168 passed · 6 warnings · 0 errors · 12 info`; `astro:check` 641 файл 0/0/7 hints; `article:qa` 0/0; MDX 70/70; pastor-series G-1…G-8 pass; SW dist readiness pass | 6 warnings: CSS/JS budget, `deploy.yml` не v4, concurrency, magic z-index, protocol-relative URL; часть visual-parity assertions в source mode явно `skipped` без `--require-dist` |
| `node scripts/dist-smoke-audit.js --no-build --production-like` | 0 | representative desktop 1366×900 + mobile 390×844: **28/28 проверок** (14 route entries × 2 viewport, `/` дважды в списке) status 200, H1/canonical/overflow/robots здоровы; 14 распознанных `mc.yandex.ru/metrika` connection-closed, 0 прочих ошибок | первый запуск **без** `--production-like` дал 10 issues только из-за ожидавшегося build-only `/dev/astro-test/`; это ошибка режима запуска, не Product |
| `npm run overlay:browser:all` | 0 | runtime overlay, map-overlay landscape и special-overlay launcher/fallback прошли в Chromium | несколько `net::ERR_FAILED` от заблокированных внешних ресурсов внутри special-overlay fixtures; script завершился exit 0, эти сообщения не стали ошибкой гейта |
| `npm run nagornaya:bar-asset:browser:test` | 0 | `parts 1–5 @ 360/390 and desktop 1024` | только Nagornaya bar asset |
| `node scripts/visual-parity-screenshots.js --routes /about/ --warn-only` | 0 | Chromium launched OK; desktop diff **0.184%** (1280×3843 vs 3914), mobile **0.301%** (390×5928 vs 5960), 6 PNG в `/tmp/gbs-product/reports/visual-parity/about/` | bounded pilot одного маршрута с `--warn-only`, не полная visual-parity baseline и не закрытие owner-строк |

Даже этот расширенный зелёный прогон не отменяет §9.2: 17 HARD, утечки каркаса, `lang`, `Чекy` и typograf drift остаются. `validate:static-publication:light` не означает «редакционно пригодно».

### 10.2 Browser-sweep всех 112 финальных HTML

Один headless context, `viewport 1280×900`, `waitUntil: load`, внешние запросы abort, `pageerror` слушается на каждой странице. Открыты **111 строк матрицы + `/konfessii/russkij-baptizm/_app/`**; `index.astro` сопоставлен с `/`.

| Метрика | Результат |
|---|---:|
| status 200 / ошибок навигации | **112 / 0** |
| uncaught `pageerror` | **0** |
| `???` runs в `body.innerText` | **0** |
| `??` runs в `body.innerText` | **0** |
| `???` в `outerHTML` / атрибутах | **0 / 0** |
| `?` **внутри** кириллического слова (Text/attrs) | **0 / 0** |
| служебный каркас: painted minimal elements | **19 / 10 routes** |
| C20-лексемы: painted minimal elements | **15 / 6 routes** |
| `Чекy`: painted elements | **1 / 1 route** |
| foreign runs с эффективным `ru` | **558 / 39 routes**; из них **25 sr-only** (`/karty/ishod/` 24, `/karty/avraam/` 1), **533 не-sr-only** |
| корректно размеченные foreign runs | **426 / 36 routes** |

**Самокоррекция эвристики `?`.** Первый счётчик «`?` рядом с кириллицей» дал 1111 — это обычные вопросительные знаки в конце русских предложений (`…?`), не порча. Он отброшен. Авторитетные проверки: `\?{3,}`, `\?{2,}`, `?` между двумя кириллическими буквами, `???` в `alt/title/href/src/aria-label/content/value/placeholder` и в сыром `outerHTML` — все **0** на всех 112 страницах.

**`GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS`.** Все девять исторических Baptist-маршрутов (`spravochnik`, `podpolnaya-pechat`, `iniciativnaya-gruppa`, `peterburgskaya-liniya`, `goneniya-i-sovest`, `yuzhnaya-shtunda`, `noch-na-kure`, `vsehib-1944`, `dva-sezda-1884`) открыты в Chromium: ни `???`, ни `??`, ни внутрисловных `?`, ни `???` в атрибутах. На текущем якоре симптом **не воспроизводится в painted text**. Owner-строка всё равно не закрывается: нет решения владельца, нет сравнения с live-release SHA и нет восстановления исходных строк; это observation, не разрешение старого дефекта.

### 10.3 Точные painted/AX witnesses

После `scrollIntoViewIfNeeded()` + `Range.getBoundingClientRect()` + `document.elementFromPoint()` + CDP `Accessibility.getFullAXTree`:

| Случай | Route | Token | Rect после scroll | Hit | Язык | AX |
|---|---|---|---|---|---|---|
| Healthy control | `/` | `יְהוִה` | `85.7×61 @ (691,164)` | `SPAN`, self/child | **explicit `lang="he"`** | `button`, `StaticText`, `InlineTextBox`, `ignored=false` |
| C7 HARD | `/hard-texts/duhi-v-temnice-noi-kreshchenie-pobeda/` | `θανατωθεὶς μὲν σαρκὶ` | `189×24 @ (272,437.5)` | `SPAN`, self/child | effective **`ru`** (унаследован от `<html>`) | `StaticText`, `InlineTextBox`, `ignored=false`, без `language`-property |
| C5 HARD | `/baptisty-rossii/dva-sezda-1884/` | `94f05457…` | `294×18 @ (431.8,476.4)` | `LI`, self/child | `ru` | 2 AX-узла |
| C5+C20 HARD | `/journal/dossiers/g3/` | `Research authority:` | `131×18 @ (603.9,793.5)` | `STRONG`, self/child | `ru` | 2 AX-узла |
| C6 mixed-script | `/karty/ishod/` | `Чекy` | **print media** `38×20 @ (93,471.9)` | `B`, self/child | `ru` | `StaticText` + `InlineTextBox`, `ignored=false` |

Важное уточнение к §9.4: на обычном **screen** `Чекy` лежит в `.sr-only map-text-fallback` с `overflow:hidden` и `body/html overflow:hidden`; `elementFromPoint` там `null`. Слова «`dist` публикует» были верны для DOM/HTML и AX, но **не для нормальной экранной отрисовки**. В `media: print` после прокрутки токен получает реальную геометрию и попадает в hit-test; AX-дерево видит обе фразы и в screen, и в print. Это ровно та граница `SYS-PUBLICATION-MIXED-SCRIPT-SURFACE-COVERAGE`, которую MASTER описывает как print/AT, а не «обычный видимый текст».

CDP full AX tree не экспортирует `language`-property ни для здорового `lang="he"`, ни для пропущенного `ru`; поэтому браузер доказывает **вхождение текста в AX и painted geometry**, но не доказывает переключение голоса TTS. `article:qa`/Axe-подобные проверки по-прежнему не могут вывести пропущенный язык фразы из одного только отсутствия ошибки.

**C5/C20 без расширения HARD.** 19 painted scaffold-элементов приходятся на **10 маршрутов**: 9 source C5-HARD + `baptisty-rossii/spravochnik` (TRIGGER, читательское объяснение `SHA-256`). Bare `<code>HOLD</code>` на `hard-texts/enoh…` в C5-паттерн не включён. 15 C20-совпадений на 6 маршрутах включают только **2 source-HARD** (`kogda-chelovek-uhodit-ot-very`, `journal/dossiers/g3`); остальные — легитимные библиографические названия, `(assurance)` с русским пояснением и `doctrinal authority` с оговоркой, уже разобранные в §8. Новых HARD и новых строк MASTER не добавлено.

### 10.4 `lang`: почему browser-числа отличаются от parse5

| Метод | Missing | Correct | Причина |
|---|---:|---:|---|
| §9 parse5, hidden-class filter | 515 / 38 routes | 486 / 34 routes | классы `sr-only`/`hidden` исключались эвристически |
| §10 Chromium, computed style + Range geometry | **558 / 39 routes** | **426 / 36 routes** | `.sr-only` имеет `visibility:visible` и client rects, поэтому 25 foreign runs в `karty/*` попали в счёт; без sr-only — **533 missing / 426 correct** |

Это **не регрессия и не исправление**: другой фильтр видимости, другая группировка и другой anchor-метод. Независимо от выбора, консервативные multi-run phrases из §9.3 (89 видимых / 14 routes) и 12 browser-маршрутов с ≥10 missing runs дают один и тот же вывод: платформа умеет `grc/he`, но разметка фрагментирована. 12 маршрутов с ≥10: те же 11 из §9.3 плюс `/karty/ishod/` (46, из них 24 sr-only). Владелец строки `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT` не менялся.

### 10.5 Typograf: fail-open дошёл до `dist`

Канонический `npm run typograf:dry` на root `articles/` по-прежнему **exit 0 / `Would change: 6 files`**. Тот же скрипт с единственной заменой `ARTICLES_DIR` на `dist/articles` (логика `processText` не менялась, dry-run, без записи) даёт **exit 0 / `Would change: 15 files`**:

```text
dist/articles/20-antisovetov-pastoru/index.html
dist/articles/dzhon-gill-chast-2-uchenyi/index.html
dist/articles/dzhon-gill-chast-3-nasledie/index.html
dist/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html
dist/articles/kak-hranit-serdce/index.html
dist/articles/kod-da-vinchi/index.html
dist/articles/krajne-li-isporcheno-serdce/index.html
dist/articles/myslennaya-zhizn-serdca/index.html
dist/articles/serdce-hrista-k-nemoshchnym/index.html
dist/articles/serdce-i-sokrovishche/index.html
dist/articles/serdce-i-telo/index.html
dist/articles/serdce-ne-v-odinochku/index.html
dist/articles/serdce-pod-skorbyu/index.html
dist/articles/sovest-vnutrenniy-sud/index.html
dist/articles/vernye-i-neizvestnye-zdorovoe-pastyrstvo/index.html
```

6 root-файлов сохраняются, ещё 9 поверхностей появляются после postbuild/нативных страниц. Это расширение наблюдения `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN`, а не новый контракт и не автоправка: скрипт применён только в dry-run, Product `git status` чист.

### 10.6 Матрица, split и границы

`ALL_ARTICLES_MATRIX.csv` остаётся **одним файлом на 111 маршрутов**; добавлены 8 browser-колонок (всего 47):

```text
browserPainted               1 для всех 111
browserQmarkRuns             сумма 0
browserLangMissingPainted    сумма 558
browserLangCorrectPainted    сумма 426
browserScaffoldPainted       сумма 19
browserC20Painted            сумма 15
browserMixedPainted          сумма 1
browserPageErrors            сумма 0
```

Суммы по 111 строкам равны суммам по 112 HTML: лишний utility `_app` дал нули по всем метрикам. Split 3 агентов и общий ключ `route + criterion_id` не переписаны: **A** — методология/gates/DOM/browser/матрица; **B** — внешняя corroboration, edition/rights/locator, C1/C2/C3/C8/C5/C20; **C** — WebKit/Firefox/device/TTS, полный cross-browser runtime quiz-click и owner PDF/print/visual parity, если owner решит их закрывать. Волна 5 (§11) выполняет bounded Chromium-часть C, не закрывая владельца. Не создано ни одного нового файла в AuditRepo, ни одного нового универсального чек-листа/ADMIT-контракта; style-only вывод «ИИ/человек» не делался.

**Чего волна 4 всё ещё НЕ доказывает:**
- нет WebKit/Firefox, реального устройства, TTS voice-switching и полного cross-browser runtime quiz-click прогона; волна 5 закрывает только bounded Chromium interactive-audit;
- нет внешней проверки исторических/богословских claims, edition/version, прав и независимой corroboration;
- `visual-parity` волны 4 был только `/about/` с `--warn-only`; волна 5 расширяет его до 11 first-fold landings, 3 full-page routes и неудачной попытки всех 43 baseline routes, но owner signoff по-прежнему нет; `validate:static-publication` и `:light` на этом якоре содержат одни и те же 41 команду и различаются лишь порядком пяти хвостовых гейтов;
- `???`=0 и `Чекy` print/AX witness — наблюдения текущего anchor, а не owner-решение по MASTER-строкам;
- зелёные `validate:static-publication`/`:light`, `interactive-audit` и `engine:guard` не заменяют редакционную пригодность и не снимают 17 HARD; `smoke:konfessii` дополнительно показал fail-open: exit 0 при `ERR_CONNECTION_REFUSED`/`errors=1`.

**Ветки/пуш.** Перед записью повторно сверены `git branch --show-current` = `arena/0b6f34f6-auditrepo`, `git status --short` (до правок — clean), upstream `origin/arena/0b6f34f6-auditrepo`, remote head волны 3 `4dd240e`. Пуш — обычный `git push` только в эту ветку; чужие PR/ветки не трогаются, ветка не переключается и не переименовывается.

---

## 11. Волна 5 — кросс-агентная сверка рендер-слоя, реальные runtime-клики и visual-parity

**Статус:** дополняет §§9–10, не отменяет 17 source-HARD, 64 TRIGGER, 5 положительных контролей и разделение HARD/TRIGGER. Тот же Product anchor `5e2db6f0fdd0257818f1a215fca16d4cc884e2d8`. Волна 5 снимает часть границ «browser/AX был, runtime/visual-parity не было» **только в bounded Chromium-объёме**. Owner visual signoff, WebKit/Firefox, реальное устройство, TTS voice-switching, внешняя corroboration/rights/edition и закрытие MASTER-строк по-прежнему отсутствуют.

### 11.0 Восстановление песочницы, ветки и окружения

В начале волны песочница была пересоздана: локальный `HEAD` AuditRepo снова показывал базовый `ae3669b`, а два наших deliverable лежали untracked; remote `arena/0b6f34f6-auditrepo` оставался на `1cbfa19`. SHA-256 обоих файлов точно совпали с blobs удалённого коммита. Выполнены `git fetch origin '+refs/heads/arena/0b6f34f6-auditrepo:refs/remotes/origin/arena/0b6f34f6-auditrepo'`, настройка upstream и `git reset --mixed origin/arena/0b6f34f6-auditrepo`; отдельного «ремонтного» коммита нет, рабочее дерево стало clean. Это восстановление локальной базы git, а не изменение истории ветки.

Product-окружение собрано заново с нуля: shallow clone `main` дал ровно тот же anchor, 3363 tracked-файла и чистый status; `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci` — 377 пакетов; `npm run strangler:build` — exit 0, 112 `index.html` / 1248 файлов / 101 MB; `npm run pagefind:build:dist` — 102 страницы / 29117 слов. `@sparticuz/chromium@153.0.0` распакован в `/tmp/chromium` с `/tmp/al2023/lib` и `/tmp/fonts`, подключён symlink'ами к registry Playwright 1.62.1. Static-серверы `dist` на портах 8123 и 8090 поднимались для browser-гейтов и остановлены после проверок. `git status` Product в конце — чистый; `main` Product по-прежнему равен аудированному anchor.

### 11.1 Другие arena-ветки и спор «42 MDX из 70»

Проверка пересечений: открытые PR AuditRepo остались #545, #544, #543, #542, #538, #521, #514; дополнительно существуют arena-ветки `01a10d48`, `13fed2e7`, `7f74c768`, `a33be340`, `c6d6c46c`. На **нашей** ветке `arena/0b6f34f6-auditrepo` лежат `REPORT.md` и `ALL_ARTICLES_MATRIX.csv`; ни на одной из пяти других arena-веток этих двух путей нет — конфликта путей и чужой правки нашего пакета не обнаружено. Ветка `arena/a33be340-auditrepo` содержит поправку `CORRECTION_RENDERED_LAYER.md` с утверждением «42 из 70 MDX не подключены ни к одному маршруту», «18 статей Сердца вне навигации» и предлагает новые `G-ORPHAN-MDX` / `G-MDX-ASTRO-PARITY` охраны. Это чужой документ; он не merging, не принимается как новый ADMIT-контракт и не порождает новый универсальный чек-лист.

На том же якоре мы независимо пересчитали оба слоя:

| Проверка | Результат | Что означает |
|---|---:|---|
| `src/content/articles/*.mdx` | **70** | исходная коллекция |
| MDX с прямым `import … @/content/articles/*.mdx` в `src/pages` | **28** | 직접 импортируются маршрутом |
| MDX без прямого импорта в `src/pages` | **42** | **число 42 воспроизводится**, но только как «нет прямого import» |
| `src/layouts/SeriesArticleLayout.astro` использует `getCollection + render()` | да | динамический механизм существует |
| страниц `src/pages`, импортирующих `SeriesArticleLayout` | **0** | механизм на этом якоре не подключён к routes |
| MDX с `sourceMode: "metadata-only"` | **6** | 6 Gill-файлов объявлены metadata-only, это не «потеря прозы» |
| Jaccard по 8-словным шинглам MDX ↔ 112 built HTML, лучший маршрут ≥0.30 | **58 / 70** | у большинства MDX текст представлен в `dist` |
| из 42 без прямого импорта имеют лучший Jaccard ≥0.30 | **30** | рендерятся через Astro-компоненты с перекрывающимся текстом; «сирота» — слишком сильный вывод |
| из 42 без прямого импорта имеют лучший Jaccard <0.30 | **12** | 6 metadata-only + 6 расхождений |
| расхождения среди `sourceMode != metadata-only` | **6** | 5 Baptist-маршрутов и 1 пограничный |

Шингловое сравнение сделано как **диагностический witness**, а не как новая норма: MDX очищался от frontmatter/JSX/разметки, HTML — parse5 Text nodes без script/style/hidden; порог 0.30 взят лишь для сопоставления с формулировкой чужой поправки. 30 «component-similar» маршрутов дают Jaccard **0.438–0.928** (например `chto-bibliya-nazyvaet-serdcem` 0.911, `serdce-hrista-k-nemoshchnym` 0.928, `spravochnik` Baptist 0.633). 6 несовпадающих `rendered`-MDX:

```text
baptisty-rossii/dva-sezda-1884            0.0282
baptisty-rossii/noch-na-kure              0.0080
baptisty-rossii/peterburgskaya-liniya     0.0104
baptisty-rossii/sovetskaya-noch           0.0061
baptisty-rossii/yuzhnaya-shtunda          0.0382
articles/tma-na-serdce                    0.2990  (порогово-чувствителен)
```

**Вывод по C23:** авто-проверка «есть ли компонент/импорт» действительно давала 0 флагов, но отсутствие прямого import не доказывает ни расхождения текстов, ни их паритета. Существующий владелец `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT` уже описывает этот класс; волна 5 **не** переклассифицирует C23, **не** добавляет 6 новых HARD, **не** создаёт новую строку MASTER и **не** вводит предлагаемые чужой веткой универсальные guard'ы. 6 расхождений остаются bounded TRIGGER для owner-решения; 17 HARD / 64 TRIGGER из §4 не меняются.

### 11.2 Настоящие Chromium runtime-гейты

Официальный `npm run interactive-audit` без патчей **не может пройти** в этой песочнице: первому же `reader-share-browser-outcome-contract.cjs` нужен `webkit-2336/pw_run.sh`, которого нет. Это ограничение egress/браузерного набора, не дефект Product. Для bounded Chromium-witness четыре harness-скрипта временно переведены на `['chromium']` / `GB_SHARE_BROWSERS=chromium` / `HOME_DESIGN_BROWSER=chromium`; после прогона все четыре восстановлены `git checkout --`, SHA-256 совпали с оригиналами, Product status чистый. Изменения Product-исходников в репозиторий не попадали.

`interactive-audit` с `AUDIT_BASE=http://127.0.0.1:8123` — **exit 0, 488 строк**:

```text
Reader share/copy outcome contract:        12/12 PASS
Reader share browser outcome contract:     18/18 PASS
Reader print preflight contract:            5/5 PASS
PDF: gill 29/29 · hermenevtika 33/33 · baptists 13/13
Mobile print scroll owner contract:         3/3 PASS
GB INTERACTIVE AUDIT: 56 pages · 10 series · 6 quizzes · glossary 3 · footnotes 1
                      · theme 6 · search 4 · media 2 · chrome labels 7 · header hosts 7
✅ Interactive audit passed
HOMEPAGE RESUME BROWSER CONTRACT: PASS (chromium)
✅ native article quiz browser parity passed (/articles/kod-da-vinchi/)
✅ series quiz source handoff contract passed (53 checks; mobile 390×844 Dark, reduced-motion, native clicks)
Standalone reader layout guards: 184/184 PASS
HOME DESIGN AUDIT PRO chromium: 338/338 named variants PASS
```

Дополнительные Product-гейты после запуска сервера 8090 и регенерации `reports/relation-projection.json` официальным `project-relations-to-dist.mjs`:

| Команда | Exit | Ключевой результат |
|---|---:|---|
| `npm run engine:guard` | 0 | `Unified navigation engine sweep completed`; static relationship panel `9/9`; Atlas state browser console clean |
| `npm run workflows:check` | 0 | CI browser/print stability, 285 pinned declarations, 95 exact Node-toolchain declarations |
| `npm run smoke:maps` | 0 | `/karty/ishod/`: 139 SVG circles, 3/3 routes, 0 overflow/errors; 8 holding-routes честно skipped |
| `npm run smoke:maps:mobile` | 0 | `ishod` + `avraam` 390px, 0 overflow/errors |
| `npm run smoke:content:mobile` | 0 | 11 representative routes, 0 overflow/errors |
| `npm run gill:mobile-play:smoke` | 0 | long-press/rapid-tap/state machine; **не** TTS voice-switching |
| `npm run visual:pixelmatch:contract` | 0 | `PIXELMATCH 7 ESM AND ALPHA CONTRACT: PASS` |
| `npm run validate:static-publication` | 0 | 4134 строки, `168 passed · 6 warnings · 0 errors · 12 info`; `astro:check` 641 файлов / 0 errors |
| `npm run smoke:konfessii` | 0 | **fail-open**: exit 0 и при `ERR_CONNECTION_REFUSED`, и при `errors=1` на desktop/mobile |

Первые запуски `engine:guard` и трёх smoke-гейтов дали exit 1 из-за окружения: не хватало сгенерированного `reports/relation-projection.json`, а smoke-скрипты жестко ждут server на `127.0.0.1:8090`. После регенерации отчёта и запуска сервера все они прошли; эти первые ошибки не записываются как Product-дефекты. `validate:static-publication` и `validate:static-publication:light` на этом якоре содержат **одни и те же 41 команду**, различаясь только порядком пяти хвостовых гейтов; поэтому «non-light» не даёт дополнительной владельческой авторитета по сравнению с волной 4. `baptisty:authentic-media:browser` не запускался: в нём жёсткий цикл `{chromium, webkit}`.

Даже все эти зелёные exit 0 не заменяют редакционную проверку, не снимают 17 HARD и не закрывают строки MASTER.

### 11.3 Visual-parity: три уровня, ни один не owner signoff

1. **Попытка всех 43 baseline routes, full-page.** `visual-parity-screenshots.js` по умолчанию берёт `data/public-content-baseline.json` (43 маршрута). Запуск с `--warn-only` и таймаутом 1500 с дал 10 маршрутов / **20 числовых viewport-пар** до падения Chromium на `/articles/kod-da-vinchi/`; остальные **66 пар** получили `Target page, context or browser has been closed`. Из 20 числовых пар **2 прошли** порог 1% (`/about/` desktop 0.184%, mobile 0.888%) и **18 превысили** его. Это **не авторитетный результат**: браузер умер среди длинных full-page скриншотов, в логах видны заблокированные внешние image/CSP/SSL-запросы, а 7 маршрутов в baseline объявлены `native-contract`, где legacy-diff диагностический. Полная 43-route parity не заявлена.
2. **11 landing-routes, first-fold, `--warn-only`.** `npm run visual:parity:screenshots:landings -- --warn-only --first-fold-only` — exit 0, 22 пары, 14 пар >1%. baseline-check — **exit 1** с 4 проблемами у `legacy-diff` маршрутов: `/karty/` desktop 26.195% >0.500%, mobile 28.797% >2.551%; `/konfessii/` desktop 3.037% >0.500%, mobile 1.940% >0.500%. Остальные 7 маршрутов — `native-contract`, их legacy-diff delegated to named guards. First-fold скриншоты не напрямую сравнимы с full-page baseline, поэтому это диагностика, а не принятие/отклонение владельцем.
3. **Full-page контроль на 3 маршрутах.** `/about/,/karty/,/konfessii/` без `--first-fold-only`: `/about/` desktop 0.184%, mobile **0.888%**; `/karty/` desktop 20.089%, mobile 24.443%; `/konfessii/` desktop 3.234%, mobile 5.856%. baseline-check — **exit 1 уже с 5 проблемами**, включая `/about/` mobile 0.888% > allowed 0.500%. В волне 4 pilot `/about/` mobile давал 0.301%; свежая пересборка с `pagefind` и повторными попытками дала 0.888%. Это наблюдение нестабильности/разницы окружения, **не доказанная регрессия и не owner-accepted parity**. Пилот волны 4 был `--warn-only` без baseline-check.

Ни один из трёх уровней не даёт `visual:parity:production` signoff, не закрывает owner-требование реального screenshot acceptance и не создаёт новую строку MASTER.

### 11.4 Матрица, границы и пуш

`ALL_ARTICLES_MATRIX.csv` остаётся одним файлом на **111 маршрутов**; в волне 5 добавлены 8 колонок (на тот момент всего **55**):

```text
mdxDirectImport             1/0 для 70 MDX-связанных routes; пусто для 41 хаба/утилиты
mdxBestJaccard              лучший Jaccard MDX↔built HTML, 4 знака
mdxLayerClass              direct-import | component-similar | component-divergent | metadata-only
vpFirstFoldDesktopPct      first-fold diff для 11 landings
vpFirstFoldMobilePct       first-fold diff для 11 landings
vpBaselineMode             legacy-diff | native-contract для тех же 11 landings
vpFullPageDesktopPct       full-page diff для 3 выбранных routes
vpFullPageMobilePct        full-page diff для 3 выбранных routes
```

Распределение `mdxLayerClass`: `direct-import 28`, `component-similar 30`, `component-divergent 6`, `metadata-only 6`; у остальных 41 route поля пустые. `vpBaselineMode`: `native-contract 7`, `legacy-diff 4`. 70 suggested MDX-route попали в существующие 111 строк матрицы без дублей. Свежие JSON/логи/screenshot'ы лежат в `/tmp/aiq-wave5` и `/tmp/gbs-product/reports`, вне AuditRepo.

Split 3 агентов и ключ `route + criterion_id` не переписаны: **A** — методология, gates, DOM/browser/AX, матрица и кросс-агентная сверка; **B** — внешняя corroboration, edition/rights/locator, C1/C2/C3/C8/C5/C20; **C** — WebKit/Firefox/device/TTS, полный cross-browser runtime quiz-click, PDF/print/visual owner parity. Волна 5 закрывает только bounded Chromium-часть C, не подменяя владельца. Не создано новых файлов в AuditRepo, новых ADMIT-контрактов, универсальных чек-листов, строк MASTER или style-only выводов «ИИ/человек». Ручные lane C1/C2/C11/C12/C13 остаются bounded triage; зелёный CI ≠ редакционная пригодность.

**Чего волна 5 всё ещё НЕ доказывает:** WebKit/Firefox, реальное устройство, TTS voice-switching, полный cross-browser interactive/visual прогон, owner screenshot signoff, внешняя истинность/права/edition, закрытие `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS`, `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT`, `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT` и других MASTER-строк. `???`=0, `interactive-audit` exit 0 и 28/42/70 MDX-ценз — observations текущего anchor, а не разрешение старых дефектов.

**Ветки/пуш.** Перед записью повторно сверены `git branch --show-current` = `arena/0b6f34f6-auditrepo`, локальный `HEAD`/`origin/arena/0b6f34f6-auditrepo` = `1cbfa19`, `git status --short` после восстановления ветки = clean; чужие arena-ветки не содержат наших двух файлов. Пуш — обычный `git push origin arena/0b6f34f6-auditrepo`; ветка не переключается, не переименовывается, чужие PR/ветки не трогаются.

---

## 12. Волна 6 — bounded API/source сверка чужих веток, книжной серии и внешнего language-of-parts якоря

**Статус:** после коммита `3ad38e7` сделана только read-only сверка на том же Product anchor `5e2db6f0fdd0257818f1a215fca16d4cc884e2d8` и канонических страницах W3C. Product не клонировался, `dist` не пересобирался, браузер/published HTML/runtime не запускались; чужие ветки и PR не изменялись. 17 HARD, 64 TRIGGER, 5 положительных контролей, C23, строки MASTER, split 3 агентов и ключ `route + criterion_id` не переклассифицированы. Новых ADMIT-контрактов, универсальных guard'ов, owner-решений и style-only выводов «ИИ/человек» нет.

### 12.1 Удалённая повторная проверка fixtures и внешний позитивный якорь C7

Повторно запрошены 22 локации §4.6/§4.7 на anchor: **17 exact negative HARD + 5 positive controls**, **16 уникальных Product-файлов**. Совпали **22/22** пары `path:line` с ожидаемым фрагментом: 10 полных ожидаемых подстрок и 12 устойчивых 30-символьных окон (в таблице отчёта часть цитат сокращена). Это повторная фиксация исходного witness, а не новый gate, не DOM/browser-перепроверка и не снятие HARD.

C7 уже опирался на WCAG 2.2 SC 3.1.2 (§2). Волна 6 уточняет внешний позитивный якорь, не превращая его в новый контракт:

- [W3C Understanding SC 3.1.2 Language of Parts](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html), **Level AA**: «The human language of each passage or phrase in the content can be programmatically determined except for proper names, technical terms, words of indeterminate language, and words or phrases that have become part of the vernacular of the immediately surrounding text». Исключения criteria-gated; отдельные заимствованные слова без явного намерения сменить язык не требуют разметки.
- [W3C Technique H58](https://www.w3.org/WAI/WCAG22/Techniques/html/H58.html): sufficient, но не обязательный способ — `lang` на элементе с иноязычным фрагментом, значения по [BCP 47](https://www.rfc-editor.org/info/bcp47), проверка соответствия кода реальному языку содержимого.
- [W3C Quickref WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/) фиксирует 3.1.2 как Level AA; [W3C i18n Group Note, §2 Language](https://www.w3.org/TR/international-specs/) рекомендует метаданные языка на уровне строки/документа, а не эвристики, и возможность размечать inline-смену языка. Это Group Note, **не** нормативный hard requirement и не новый ADMIT.
- Understanding SC 3.1.2 отдельно оговаривает: ограничения screen reader/UA при озвучивании плоских accessible names находятся вне контроля автора и сами по себе не проваливают критерий; аудитор не может опираться только на spoken output и должен проверять исходную разметку. Поэтому painted/AX-дерево волны 4 и отсутствие TTS voice-switching не являются ни доказательством соответствия, ни его опровержением.

`c7WcagAnchor = WCAG-2.2-SC-3.1.2-AA` проставлен только на **6 маршрутов с C7-HARD** как ссылка на норму, **не** verdict соответствия. `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT` остаётся owner-open; зелёные gates, `???`=0 и Chromium-only workaround его не закрывают.

### 12.2 Чужие ветки и спор «42 MDX / 18 спутников / 229 минут»

Коллизионная проверка перед записью: Product `main` и открытые PR AuditRepo #545, #544, #543, #542, #538, #521, #514 не изменились. Read-only просмотрены `arena/a33be340-auditrepo@bf44916` и `arena/c6d6c46c-auditrepo@de3398f`. По `git/trees/<anchor>?recursive=1` (`truncated=false`, 3363 blobs) независимо воспроизведены **70** `src/content/articles/*.mdx`, **49** `*Body.astro`, **111** `src/pages/**/index.astro`; таким образом число **119 = 70 + 49** у агента C6 воспроизводится как ценз файлов, но не как ценз показанного читателю текста.

| Чужой тезис | Статус сверки на source-уровне |
|---|---|
| A33: `Body.astro` — официальная архитектура, MDX — legacy; **42/70** MDX без прямого import = «архив, не критично» | `docs/SERIES-ENGINE-GUIDE.md` §2 действительно предписывает тело статьи `<...>Body.astro` и не упоминает MDX; **42 без прямого import** уже независимо воспроизведено в §11.1. Вывод «архив / не критично / исключить из аудитов» из отсутствия import не следует: 30 из 42 имеют перекрывающийся текст в built HTML, 6 объявлены `metadata-only`, 6 расходятся. C23 и `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT` не переклассифицируются |
| A33: 18 материалов «Сердца» объявлены спутниками, но не зарегистрированы; новый P0 `GBS-SATELLITES-DECLARED-NOT-REGISTERED` | Ниже показано, что активный конфиг регистрирует их в книжной форме как статьи глав. Буквальный тезис «не зарегистрированы» исходниками anchor не подтверждается; автор чужой ветки сам указал, что сборку не запускал. Без build/HTML/rail/accordion witness нельзя ни принять P0, ни закрыть его, ни завести новую строку MASTER |
| C6: SYS-1 split-brain, Jaccard-расхождения, **229 мин** `readingTime` из frontmatter против 28099 живых слов, 6/6 URL witnesses | 229 мин относится к **10 baptisty-MDX** (`17+24+25+18+21+23+28+27+26+20`), а не к серии «Сердце». 6/6 URL — bounded выборка, не внешняя corroboration/rights/edition всего корпуса. Выводы о фактической истинности и editor/owner-решении не принимаются |

Product-источники на том же anchor дают два разных, но сосуществующих слоя:

| Источник | Что содержит | Граница вывода |
|---|---|---|
| `docs/SERIES-ENGINE-GUIDE.md` §1/§2 | Плоская серия: спутник = `letter` + `tier:'satellite'` + `parent`, только аккордеон части, не рельс/счёт, не в `data/series.json`; тело статьи — `Body.astro` | Описывает **flat**-форму, а не всю книжную серию |
| `docs/SERIES-ENGINE-GUIDE.md` §3.5 | `shape:'book'`: главы `tier:'chapter'` с римскими марками, статьи `mark:'arabic'` + `parent` + `pages[id]`; живой пример — «Сердце» | Книжная форма — отдельная ветвь того же движка |
| `src/components/article-pilots/_shared/series/seriesConfig.ts` | `defineSeriesConfig` проверяет `arabic → parent/pages`, `chapter` и `shape:'book'`; спутник обязывает `letter` + `tier:'satellite'` | Валидатор поддерживает оба яруса; это не runtime-witness |
| `.../series/hardTextsSeriesConfig.ts` | 18 `HEART_SATELLITES` defs, 4 `HEART_CHAPTERS` с `extras`, `HEART_BOOK_SEQUENCE` = пролог + 4 lead + 18 extras + справочник = **24 уникальные reader pages**, `shape:'book'`; `items` включает 4 группы-главы, 2 форзаца и **22 статьи с арабскими номерами** (4 lead + 18 extras), для всех 24 reader pages есть `pages[id]`, у статей глав — `parent: ch.id` | 18 зарегистрированы **не как letter-спутники**, а как полноценные арабские статьи глав; комментарий в шапке файла ещё использует старую терминологию «спутники» |
| `heartSeriesData.ts` / `data/series.json` | 6 core items / 6 `hard-texts.parts`, сумма `readingTime` **228 мин** | Ядро реестра `series.json`; guide §2 прямо исключает из него спутники, а 6 строк не являются списком всех 24 книжных страниц |
| `docs/HEART-BOOK-SOURCE-TRUTH-CONTRACT.md` | Существующий Product source-of-truth: **24 unique reader pages**, полная книга **727 мин**; канон — `heartSeriesData.ts` + `hardTextsSeriesConfig.ts` + native Astro article components | 228 мин ядра + 499 мин 18 extras = 727; это не 229 мин baptisty-frontmatter |
| `data/editorial-metadata-review-decisions/heart-satellites-reconciliation-20260908.json` | **17** owner-approved правок editorial dates/reviewStatus; все 17 slug'ов — подмножество 18 extras, `tma-na-serdce` в этом JSON нет | Слой редакционных метаданных, а не доказательство navigation/runtime и не ценз всех 18 |

Все 24 slug'а «Сердца» уже присутствуют в 111 строках `ALL_ARTICLES_MATRIX.csv`: **6 `core`** и **18 `book-article`**. На source-уровне отсутствие `tier:'satellite'` в 6 `HEART_SERIES_ITEMS` и 6 строках `data/series.json` объясняется книжной формой и «core-only» реестром, а не отсутствием конфигурации 18 материалов. Вместе с тем волна 6 не запускала `npm ci`/build/`engine:guard`/browser, не смотрела собранный rail/аккордеон/prev-next и не проверяла реальную доступность всех 24 маршрутов читателю. Поэтому чужой P0 остаётся **UNPROVEN**, а не подтверждённым и не снятым; 17 HARD / 64 TRIGGER и C23 не меняются.

### 12.3 Матрица, границы и пуш

`ALL_ARTICLES_MATRIX.csv` остаётся одним файлом на **111 маршрутов**; добавлены 4 колонки (**59** всего), новые строки не создавались:

```text
hardFixtureRemoteCount       0/1/2 — число удалённо сопоставленных HARD fixture на route; сумма 17, 16 routes, journal/dossiers/g3 = 2
positiveControlRemoteCount   0/5 — все 5 контролей на hard-texts/enoh-prorochestvoval-iuda-14-15-4q204
heartBookSourceLayer         core (6) | book-article (18) | пусто (87); только source-классификация
c7WcagAnchor                 WCAG-2.2-SC-3.1.2-AA на 6 C7-HARD routes; внешняя норма, не verdict
```

**Чего волна 6 НЕ доказывает:** Product build/published HTML, rail/accordion/prev-next для 24 книжных страниц, полный WebKit/Firefox interactive, реальное устройство, TTS voice-switching, PDF/print-parity, owner visual signoff, внешнюю истинность/права/edition, закрытие `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS`, `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT`, `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT` и других MASTER-строк. `OWNER_APPROVED=true`/baseline update не применялись; зелёные прежние gates, `???`=0, partial screenshots, AX-absence и `--warn-only` exit 0 не заменяют редакционную проверку.

**Ветки/пуш.** Работа ведётся только на `arena/0b6f34f6-auditrepo`; ветка не переключалась, не переименовывалась, чужие PR/ветки не трогались. Перед записью повторно сверены `git branch --show-current`, `HEAD`/upstream/`origin/arena/0b6f34f6-auditrepo` = `3ad38e7` и неизменность Product anchor; после правок двух существующих файлов выполняются `git diff --check`, обычный `git push origin arena/0b6f34f6-auditrepo` и `present_file REPORT.md`. Артефакты волн 6–8 остаются вне git.

---

## 13. Волна 7 — обновлённые головы чужих веток и проверка «`series.json` / HTML-тени»

**Статус:** после `0f97da9` — снова только bounded read-only `gh api` на том же Product anchor `5e2db6f0fdd0257818f1a215fca16d4cc884e2d8`; Product не клонировался, `dist`/browser/runtime не запускались. В свежей песочнице локальная git-база снова стартовала с `ae3669b` и двумя untracked deliverable; их SHA-256 точно совпали с blobs remote `0f97da9`, затем `git fetch` + настройка upstream + `git reset --mixed origin/arena/0b6f34f6-auditrepo` восстановили ветку **без repair commit**. Product `main`, открытые PR #545/#544/#543/#542/#538/#521/#514 и наш путь `incoming/arena-all-articles-audit/` на пяти других arena-ветках не изменились: конфликт путей = **0**.

Актуальные головы: `0b6f34f6 0f97da9`, `01a10d48 539d7b8`, `13fed2e7 ec5c059`, `7f74c768 31ef6f0`, `a33be340 bb2cbf3`, `c6d6c46c 2721e67`. Два последних коммита пришли уже после волны 6 и читались только через `gh api repos/.../commits/<sha>` и `contents?ref=<sha>`.

| Чужая ветка | Что изменилось после §12 | Наша bounded оценка |
|---|---|---|
| `a33be340@bb2cbf3` | `FINAL_BUG_MATRIX.md` **отзывает** `GBS-SATELLITES-DECLARED-NOT-REGISTERED` («объявлены и подключены»); новый `BUILD_OWNERSHIP_AND_STALE_SHADOWS.md` признаёт книжную модель: 18 бывших спутников = арабские статьи глав, «всё объявлено и подключено». Взамен предложены P0 `GBS-SERIES-JSON-STALE` (`series.json` = 6 против 24, «хаб показывает 6 из 24»), P0 `GBS-SHADOW-HTML-STALE` и guard'ы `G-SERIES-JSON-PARITY` / `G-SHADOW-HTML-FRESH` / `G-HUB-COUNT` | Отзыв прежнего P0 совпадает с §12.2. Новые P0 и `G-*`-охраны — чужие кандидаты, **не** принимаются в MASTER и не порождают новый универсальный чек-лист. На том же head `BODY_ASTRO_HISTORY.md` всё ещё содержит старые §9.2/§10/§11 с «P0, новый» и планом добавить 18 спутников в `HEART_SERIES_ITEMS`; это внутренняя рассинхронизация чужой ветки, а не два доказательства |
| `c6d6c46c@2721e67` | «Восьмой проход»: `Body.astro` официальная архитектура; ярус мигрировал в книжную модель; живой хаб `/hard-texts/` показывает **4 главы / 22 статьи / 2 форзаца** (24 уникальные reader pages = 22 + 2; главы — группы, не страницы); три статьи из списка «вне навигации» живы; wave-5 деление 28/42 сошлось; `smoke:konfessii` fail-open подтверждён по исходнику; калибровка девяти маркеров оставляет три диагностичных, тире отозвано; авторство не определяется | Source-уровень счётчиков хаба подтверждается ниже независимо. «Живые witness'ы» получены чужим `fetch_page` внешнего сайта, а не нашим build/`dist`/browser; owner visual signoff, painted-аккордеон и live-release SHA по-прежнему отсутствуют. Кандидат `GBS-URL-CANONICAL-COLLISION` и допуск в MASTER остаются за владельцем |

### 13.1 Что говорит Product source про хаб и `data/series.json`

| Product source на anchor | Наблюдение | Следствие |
|---|---|---|
| `src/pages/hard-texts/index.astro:15,21–26,67` | Импортирует `HARD_TEXTS_SERIES`; JSON-LD `publishedPages` берёт `items.filter(tier !== 'chapter')`, то есть **24 reader pages** (2 форзаца + 22 статьи глав), а не 6 строк `data/series.json` | Структурированные данные хаба выводятся из активного конфига |
| `src/components/hard-texts/HardTextsStatsSection.astro` | Комментарий «Counters are derived from the active book-shaped series config. They must not drift back to the historical three-part pilot numbers»; счётчики `chapters=4`, `articles=22`, `endpapers=2` | Source-level дериват: **4 группы-главы, 22 статьи, 2 форзаца**; уникальных reader pages **22 + 2 = 24**. Совпадает с чужим «живым» счётчиком, но не является painted witness |
| `src/components/hard-texts/HardTextsCardsSection.astro` | Ровно **6** карточек `h-article-card`; шапка прямо называет их «published core shelf» (Пролог, lead каждой главы, Справочник) и говорит: «Chapter extras remain available through the book reader navigation» | 6 карточек — **преднамеренное ядро**, а не «18 недоступны». Без build/HTML/prev-next/аккордеона нельзя подтвердить или опровергнуть видимость всех 18 читателю |
| `src/components/hard-texts/HardTextsSeriesMapSection.astro` | Импортирует `data/series.json`, но только для `firstPublished` и CTA «Начать книгу»; карта глав захардкожена как I–IV | `series.json` здесь — реестр старта книги, не полный инвентарь карточек |
| `data/series.json` | `hard-texts.parts` = 6 / 228 мин; `genesis-6.parts` = 6, включая `n: '6A'` и `'6B'` | Guide §2 п.5 говорит «спутники в `series.json` НЕ вносятся», но `genesis-6` их содержит: непоследовательность разных серий/эпох, а не доказательство универсального правила «все 24 обязаны быть в `parts`». Owner-решение не принимается |
| `hard-texts/index.html` (committed legacy shadow) | 6 карточек, устаревшие «3 части (план)», «2 опубликовано», «53 минуты чтения», «Часть 1 из 3» | Это тень старого трёхчастного пилота, а не Astro-built final page |
| `scripts/copy-legacy-to-dist.js:151–153,210–220` + `migration/page-ownership.json` | Скрипт **skips legacy files for Astro-owned routes**; комментарий: «Production deploy is not changed by this script; it is for local/dist parity». В ownership **112** маршрутов: **111 `owner: astro`** + 1 `built-app`; `/hard-texts/` = `owner: astro`, `status: production-dist`, source `src/pages/hard-texts/index.astro` | Legacy `hard-texts/index.html` не перезаписывает Astro-страницу в локальном `dist`. Волны 3–5 смотрели собранные 112 `dist/index.html` и browser-sweep, а не коммитнутые тени. `GBS-SHADOW-HTML-STALE` описывает риск для аудитора, но сам по себе не доказывает stale production |

**Итог по новым чужим P0:** на source-уровне «`series.json` = 6, конфиг = 24» воспроизводится, но активный `/hard-texts/` получает счётчики и JSON-LD из `HARD_TEXTS_SERIES`, а 6 карточек объявлены преднамеренным core-shelf. Поэтому тезис «18 статей книги не видны на хабе» **не выводится** из одних исходников; окончательный reader-facing / built / live ответ требует owner/browser/`dist` witness и нами не выдаётся. Старый `GBS-SATELLITES-DECLARED-NOT-REGISTERED` отозван самим автором; новые `GBS-SERIES-JSON-STALE`, `GBS-SHADOW-HTML-STALE` и `G-*`-охраны в наш пакет не вводятся. 17 HARD / 64 TRIGGER, C23, 5 controls и MASTER-строки не переклассифицированы.

### 13.2 Матрица, границы и пуш

`ALL_ARTICLES_MATRIX.csv` в волне 7 **не менялся**: 111 маршрутов, 59 колонок, `route + criterion_id`; новые колонки/строки не добавлялись. `/tmp/aiq-wave7/` содержит только runtime-копии чужих отчётов и 14 Product source-файлов, вне git.

**Чего волна 7 НЕ доказывает:** Product build/published HTML, painted счётчики хаба и аккордеон для 18 extras, полный WebKit/Firefox interactive, реальное устройство, TTS voice-switching, PDF/print-parity, owner visual signoff, внешнюю истинность/права/edition, закрытие `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS`, `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT`, `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT` и других MASTER-строк. Зелёные прежние gates, `???`=0, partial screenshots, AX-absence, `--warn-only` exit 0 и чужие `fetch_page`-witness'ы не заменяют редакционную проверку.

**Ветки/пуш.** Только `arena/0b6f34f6-auditrepo`; ветка не переключалась/не переименовывалась, чужие PR/ветки не трогались. Перед записью сверены branch, `HEAD`/upstream/remote и SHA-256 локальных файлов против remote `0f97da9`; после правки только `REPORT.md` выполняются `git diff --check`, обычный `git push origin arena/0b6f34f6-auditrepo` и `present_file REPORT.md`.

---

## 14. Волна 8 — финальный отзыв чужих P0 и source-ценз discoverability-индексов

**Статус:** после `cac25a8` песочница не пересоздавалась: `HEAD` = upstream = `origin/arena/0b6f34f6-auditrepo` = `cac25a8`, working tree clean, Product `main` = `5e2db6f0…`, открытые PR #545/#544/#543/#542/#538/#521/#514 без изменений. Снова только bounded read-only `gh api`; Product не клонировался, `dist`/browser/runtime не запускались. На пяти других arena-ветках наш путь `incoming/arena-all-articles-audit/` отсутствует: конфликт путей = **0**.

На remote обнаружились головы `a33be340 9ca98f6` и `c6d6c46c 07731ba`; author dates 19:09/19:13 UTC, то есть коммиты были созданы до пуша волны 7 (19:15), но стали видны после нашей предыдущей проверки. Это race push/commit, а не изменение Product anchor. Читались только `gh api commits/<sha>` и `contents?ref=<sha>`.

| Чужая ветка | Финальная дельта | Наша bounded оценка |
|---|---|---|
| `a33be340@9ca98f6` | `SERIES_JSON_FALSE_ALARM.md` и `FINAL_BUG_MATRIX.md` **снимают** `GBS-SERIES-JSON-STALE`: «хаб показывает ядро намеренно; 24/24 есть в `search-manifest`». Автор сам называет это четвёртой ошибкой подряд. Из своей цепочки пересмотров единственным новым P0 оставляет `GBS-SHADOW-HTML-STALE` как **баг методологии**, не баг продукта; сборку не запускал | Совпадает с независимым source-выводом §13.1. `GBS-SHADOW-HTML-STALE`, `G-SERIES-COVERAGE` и прочие `G-*`-охраны остаются чужими кандидатами, в MASTER/универсальный чек-лист не вводятся. Внутренняя рассинхронизация чужой ветки: старый `BODY_ASTRO_HISTORY.md` по-прежнему содержит отозванные формулировки |
| `c6d6c46c@07731ba` | «Девятый проход»: 13 живых страниц по всем 8 сериям, каталог «80 материалов», живой разброс «Коротко» 0/3/4/5/6, позитивные реализации CQS, `llms.txt` 55 уникальных URL против 102 в sitemap, 0/18 книжных статей «Сердца» и минуты серии 2/3/5 в карточках против 727/170; живой C20 `assurance`. `GBS-SERIES-JSON-STALE` у c6 остаётся **owner-open, P0 не доказан** | Живые witness'ы — внешний `fetch_page`, не наш build/`dist`/browser и не owner signoff. Расхождение с отзывом a33 фиксируется как **незакрытое чужое разногласие**; наша позиция из §13.1 — `UNPROVEN`, без новой строки MASTER. Живой C20 `assurance` не добавляется к 17 HARD / 64 TRIGGER: это не наш source/DOM/browser gate и нет owner-решения |

Разногласие частично объясняется рассинхронизацией самих чужих head: c6 §14.0 ещё указывает a33 `bb2cbf33`, то есть девятый проход не видел отзыва `9ca98f6`. Наша позиция не зависит от того, который из чужих агентов успел обновиться: без owner/browser witness статус остаётся `UNPROVEN`.

### 14.1 Независимый source-ценз индексов и каналов discoverability

Чтобы не принять чужой отзыв на веру, на том же anchor пересчитаны конкретные Product-файлы:

| Источник | Результат волны 8 | Граница |
|---|---|---|
| `data/search-manifest.json` | **103 items**, из них **80 `type:'article'`**; все **24/24** slug'а «Сердца» присутствуют (6 core + 18 extras), в том числе **18/18** extras отдельными item'ами | Source-level реестр; совпадает с «80 материалов» чужого живого каталога, но не является painted witness |
| `sitemap.xml` | **102 уникальных `<loc>`**; **18/18** extras «Сердца» есть в sitemap | Source-level карта сайта, не live-release проверка |
| `llms.txt` | 90 строк; **56** упоминаний `https://gospod-bog.ru…` / **55 уникальных** site-URL; **0** `.mdx` и **0** `src/`; **27/70** MDX-slug'ов; **0/18** книжных extras «Сердца» | Воспроизводит чужой «остаточный SYS-3» для RAG/LLM-поиска; это observation для владельца, не читательский дефект и не новая строка MASTER |
| `seriesConfig.ts:275–276`, `GillPartTocOverlay.astro:55,78`, `GillSeriesRail.astro:93` | `chapterArticles()` фильтрует `mark.kind==='arabic' && parent===chapterId`; оверлей делает `arts.map(...)`, рельс подставляет `chapterArticles()` для глав | Source-уровень подтверждает каналы «оглавление главы / рельс» из чужого отзыва; painted rail/аккордеон/prev-next для всех 24 страниц нами не проверялись |
| `scripts/copy-legacy-to-dist.js` + `migration/page-ownership.json` | **111 `owner: astro`** + 1 `built-app`, `/hard-texts/` = `owner: astro`; `shouldSkipLegacyFile()` = `astroRoutes.has(route)` | Совпадает с §13.1: committed legacy HTML — тень для локального `dist`-parity, а не финальная Astro-страница. `GBS-SHADOW-HTML-STALE` не доказывает stale production |

`llms.txt`, sitemap, `search-manifest` и 111 маршрутов считают **разные объекты**; разница 55 / 102 / 80 / 111 не выдаётся за битые ссылки. Серийные минуты 2/3/5 в карточках каталога против 727/170 в контракте и живой C20 `assurance` остаются чужими observation, не переносятся в нашу матрицу и не переклассифицируют C20/C22/C23.

### 14.2 Матрица, границы и пуш

`ALL_ARTICLES_MATRIX.csv` в волне 8 **не менялся**: 111 маршрутов, 59 колонок, `route + criterion_id`; 17 HARD / 64 TRIGGER / 5 positive controls, C23 и MASTER-строки не переклассифицированы. `/tmp/aiq-wave8/` содержит 7 Product source-файлов и 7 выгрузок чужих отчётов, вне git.

**Чего волна 8 НЕ доказывает:** painted счётчики/аккордеон/prev-next для 24 книжных страниц, полный WebKit/Firefox interactive, реальное устройство, TTS voice-switching, PDF/print-parity, owner visual signoff, внешнюю истинность/права/edition, закрытие `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS`, `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT`, `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT` и других MASTER-строк. Чужие `fetch_page`-witness'ы, зелёные прежние gates, `???`=0, partial screenshots, AX-absence и `--warn-only` exit 0 редакционную проверку не заменяют. `OWNER_APPROVED=true`/baseline update не применялись.

**Ветки/пуш.** Только `arena/0b6f34f6-auditrepo`; ветка не переключалась/не переименовывалась, чужие PR/ветки не трогались. Перед записью сверены branch, `HEAD`/upstream/remote и отсутствие path collisions; после правки только `REPORT.md` выполняются `git diff --check`, обычный `git push origin arena/0b6f34f6-auditrepo` и `present_file REPORT.md`.

---

## 15. Волна 9 — новые головы a33/c6, C24 source-ценз и уточнение discoverability-подмножества

**Статус:** после `9d234a0` сделана только bounded read-only сверка `gh api` и shallow `git clone --depth 1 --branch main` Product на том же anchor `5e2db6f0fdd0257818f1a215fca16d4cc884e2d8` (3389 файлов, 111 `src/pages/**/index.astro`, 49 `*Body.astro`, 70 `src/content/articles/*.mdx`). Не запускались `npm ci`, `strangler:build`, `dist`-сервер, browser, runtime-клики и owner signoff; Product `main` и открытые PR #545/#544/#543/#542/#538/#521/#514 не изменились. При чтении docs remote-головы были `a33be340 807120d6` и `c6d6c46c 108593eb`; к предкоммитному `git ls-remote` c6 сдвинулся на `0289bcff` (19:33:04Z), а a33 — ещё раз на `836d09d8` (19:34:25Z). Bounded-окно сверки остановлено на этих головах: наша `0b6f34f6 9d234a0`, `a33be340 836d09d8`, `c6d6c46c 0289bcff`; `7f74c768/01a10d48/13fed2e7` без изменений, более поздние сдвиги не читались. Для `807120d6`, `108593eb`, `0289bcff` и `836d09d8` tree `truncated:false`, наш путь `incoming/arena-all-articles-audit/` отсутствует: конфликт путей = **0**.

Голова a33 сдвинулась **трижды уже внутри этой bounded проверки**: `ffa7504d` (19:20:51Z) → `807120d6` (19:24:31Z) → `836d09d8` (19:34:25Z). c6 `108593eb` создан в 19:22:40Z, то есть после нашего пуша волны 8 (19:21:55Z), но §15.0 его отчёта всё ещё указывает нашу ветку как `cac25a8` (волна 7), а a33 как `9ca98f6` (отзыв `GBS-SERIES-JSON-STALE`). c6 `0289bcff` в §16.0 уже указывает нашу `9d234a02`, но a33 всё ещё `ffa7504d`. a33 `807120d6` в шапке сам ссылается на предыдущий `ffa7504d`, а `836d09d8` добавляет только новый research-документ. Более того, c6 §16.1 приписывает TSV @ `ffa7504d` значение 80 / 241 774, тогда как `git/trees/ffa7504d…` даёт blob `c7ab6db…` с **82 строками / 248 996 словами**; 80 / 241 774 находится в TSV @ `807120d6`. Это race commit/push чужих веток и их snapshot-матриц, а не смена Product anchor и не содержательный конфликт с §14.

| Чужая голова | Что прочитано | Наша bounded оценка |
|---|---|---|
| `a33be340@ffa7504d` | `PROSE_METRICS_PRODUCT.md`, TSV и tool: **82 статьи / 248 996 слов / 8 535 абзацев**, 54 `Body.astro` + 28 прямых MDX-импортов; сборку не запускал; §5 даёт style-only ответ «по формальным ИИ-маркерам тексты человеческие» | Все 82 пути существуют на Product anchor, TSV внутренне суммируется в 248 996 / 8 535, 82 slug'а точно соответствуют последнему сегменту маршрутов нашей CSV. Это проверка целостности чужой выгрузки, **не** независимый пересчёт прозы. Ответ «ИИ/человек» не принимается: нет calibration/anchor/controls, нет owner-решения, он прямо исключён исходной задачей |
| `a33be340@807120d6` | `GRADED_MATRIX_PRODUCT.md`, `grade_matrix.tsv`, `product_prose_metrics.tsv` и tools: после вырезания `summary-card` и правки `ne_a_na` заявлено **80 статей / 241 774 слова / 8 284 абзаца**, A/B/C-пороги выбраны самим агентом, классы **P0 17 / P1 4 / P2 11 / P3 46**, снова style-only «Похоже на ИИ? Нет» | Финальный TSV действительно содержит 80 уникальных slug'ов, все пути есть на anchor, суммы 241 774 / 8 284 сходятся, все 80 slug'ов сопоставимы с нашими маршрутами. Но `grade_matrix.tsv` содержит **78** строк: `tools/grade_matrix.py:46–49` исключает `genesis-6` и `seriya` как хабы, а распределение 17+4+11+46 тоже равно 78; заголовок «80 статей» и градуировка считают разные объекты. Пороги A/B/C не owner-approved, сборки нет. Классы P0–P3, «человеческие тексты» и новые градуированные критерии в наш C1–C24/MASTER/CSV-verdict не вводятся |
| `a33be340@836d09d8` | `REQUIREMENTS_AND_AI_OBJECTIONS.md`: разбор действующих S1–S54, утверждение «Хартия не регулирует качество прозы на уровне абзаца», каталог AI-objections, замер 861 антитезы / 37,3 на 10 000 слов, и proposal новых **S55–S57** + guard'ов `G-PROSE-RHYTHM`/`G-FIGURE-DENSITY`/`G-COLON-BREAKS`; сам документ оговаривает, что Wikipedia-каталог описательный, а не доказательство авторства | Это чужой research/proposal, не owner-approved standard. В наш пакет не вводятся ни S55–S57, ни `G-*`-охраны, ни новый универсальный чек-лист, ни style-only verdict «ИИ/человек». Внешние источники каталога в волне 9 нами не перепроверялись; 861/37,3 и пороги остаются чужими измерениями без owner-решения и без нашего build/DOM/browser witness |
| `c6d6c46c@108593eb` | «Десятый проход»: `llms.txt` = **строгое подмножество** sitemap (55 ⊂ 102, 0 URL из `llms.txt` вне sitemap, отставание 47); все 5 чанков живого `/articles/` перечисляют 18 extras, **228 + 499 = 727**; `AAQ-A-065`/`GBS-SERIES-JSON-STALE` снята как ложная тревога; 42 внешних объекта / 40 прямых подтверждений / 2 оговорки; W3C SC 3.1.2 не делает одиночный `assurance` автоматическим нарушением; legacy-закрытие сужено до локального `dist` | Уточнение к §14: чужое разногласие a33/c6 по `GBS-SERIES-JSON-STALE` **снято** десятым проходом c6. Наша позиция не становится «подтверждено» и не становится «закрыто»: без owner/painted rail/accordion/live-release witness статус остаётся `UNPROVEN`; новой строки MASTER и `G-*`-охраны нет. «Живой каталог» — внешние `fetch_page`-наблюдения, а не наш build/`dist`/browser; 42 внешних объекта — выборка, не ценз ~530 ссылок и не наша внешняя corroboration/rights/edition. C20 `assurance` остаётся редакционным witness, 17 HARD / 64 TRIGGER и C7/W3C-anchor не переклассифицируются |
| `c6d6c46c@0289bcff` | «Одиннадцатый проход»: независимое воспроизведение прозы по продукту, отвод собственной гипотезы о потере `@/`-импортов, G1-перекалибровка, послойные маркеры; отвергает «ИИ-маркеров нет» и «короткие строки доказывают человеческое авторство», авторство не определяется; G1/допуск в MASTER остаются owner-open | Отказ от style-only атрибуции согласуется с нашим Explicit exclusions. `111 = 80 + 31`, 246 322 слова, G1 `288/387`, послойные частоты клише — вычисления чужого `<p>`-резолвера, не наш build/DOM/browser и не owner witness. В C1–C24/17 HARD/64 TRIGGER/MASTER не переносятся; новых ADMIT-контрактов и универсальных guard'ов нет. Расхождение TSV @ `ffa7504d` против `807120d6` зафиксировано выше как snapshot-ошибка чужой матрицы |

### 15.1 Независимый C24 source-ценз и 5 новых колонок

Чтобы не принять чужие метрики за аудит всех маршрутов, на том же anchor по `migration/page-ownership.json` и исходникам страниц пересчитана гигиена C24 (`draft`/`noindex`/canonical). В `ALL_ARTICLES_MATRIX.csv` добавлены **только source-observation колонки**, без изменения verdict'а C24 (в §3/§4 он по-прежнему 0 HARD / 0 TRIGGER):

| Колонка | Ценз по 111 маршрутам | Граница |
|---|---|---|
| `c24RouteSourcePath` | 111 уникальных `source` из ownership, все файлы существуют в shallow clone | Source-level соответствие `route → index.astro`, не published HTML |
| `c24CanonicalSource` | `explicit` **11**, `component` **100** | Отдельный bounded static import graph по Astro-frontmatter (≤10 уровней) нашёл выражение canonical/`canonical=` для **111/111** маршрутов; 0 неразрешённых. Это граф импортов, не runtime-оценка `href` |
| `c24RobotsSource` | page-level `noindex` **1** (`izbrannoe`), `index` **2** (`otstupniki`, `podrostok-za-kadrom`), `none` **108** | `none` = директива делегирована импортированному head/layout; тот же import graph нашёл `robots`/`robots=` для **111/111**. Не HTTP-заголовок и не live `<meta>` |
| `c24MdxFlagSource` | `explicit-false` **28** (маршруты с прямым `import ... from '@/content/articles/*.mdx'`), `none` **83** | Глобально 70 MDX: **60** явно `draft:false`/`noindex:false`, **10** опускают оба поля, но `src/content.config.ts:19–20` задаёт `z.boolean().default(false)`; **0** `true`. 42 MDX не имеют прямого импорта из `index.astro`; колонка это не отображает |
| `c24MdxCanonicalOverride` | `1` на **18** маршрутах, `0` на остальных; сумма **18** | Глобально `canonicalOverride` есть у **38/70** MDX, но в прямых импортах — 18, и все 18 URL совпадают с путём своего маршрута. Остальные 20 принадлежат MDX без прямого импорта; дефектом не считаются |

Итог: на source-уровне 111/111 маршрутов имеют разрешимый статический путь к canonical и robots, 70/70 MDX не имеют активных `draft:true`/`noindex:true`, а 18 прямых `canonicalOverride` не расходятся со своим route. Это **не** отменяет и не подтверждает DOM/browser witness: без сборки неизвестны финальные значения атрибутов, редиректы и live-release headers. 17 HARD / 64 TRIGGER / 5 positive controls / C23 / MASTER-строки не переклассифицированы; новых ADMIT-контрактов и универсальных guard'ов нет.

### 15.2 `llms.txt` ⊂ sitemap: уточнение §14.1

Независимый пересчёт тех же Product-файлов уточняет формулировку «разные объекты счёта»: `llms.txt` содержит **56** упоминаний site-URL / **55 уникальных**, `sitemap.xml` — **102 `<loc>`**; **0/55** URL из `llms.txt` отсутствуют в sitemap, **47/102** URL sitemap отсутствуют в `llms.txt`. Заголовок `llms.txt`: `Updated: 2026-10-24` при anchor Product `2026-11-07`. Проверены также **18/18** книжных extras «Сердца» в sitemap и **0/18** в `llms.txt`, **5/5** свежих статей в sitemap и **0/5** в `llms.txt`.

Следовательно, для пар URL↔URL отношение действительно **строгое подмножество 55 ⊂ 102** с отставанием 47, как уточнил c6. §14.1 остаётся верным в другой части: **80 `type:'article'`** в `search-manifest.json` и **111 маршрутов** нашей матрицы — другие объекты счёта, их нельзя напрямую вычитать из 102 и выдавать разницу за битые ссылки. Residual `llms.txt` остаётся observation для владельца, не новой строкой MASTER и не читательским дефектом. Живой каталог c6 с арифметикой 228 + 499 = 727 согласуется с source-уровнем `search-manifest` 24/24 и sitemap 18/18, но не заменяет painted rail/аккордеон/prev-next/owner signoff.

### 15.3 Матрица, границы и пуш

`ALL_ARTICLES_MATRIX.csv` обновлён с **59 до 64 колонок**: 111 строк, ключ `route + criterion_id`, LF, 5 колонок `c24*` добавлены к существующим; строки/маршруты и суммы 17 HARD / 64 TRIGGER / 5 controls не менялись. `REPORT.md` получил title/meta «волны 2–9» и §15; §13/§14 сохранены как историческая хроника своих волн. `/tmp/aiq-wave9/` содержит только runtime-копии чужих docs/TSV/tools и shallow Product source вне git; новых файлов в AuditRepo нет.

**Чего волна 9 НЕ доказывает:** Product build/published HTML, финальные значения `canonical`/`robots` в DOM и HTTP, painted счётчики/аккордеон/prev-next для 24 книжных страниц, полный WebKit/Firefox interactive, реальное устройство, TTS voice-switching, PDF/print-parity, owner visual signoff, внешнюю истинность/права/edition, авторство «ИИ/человек», закрытие `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS`, `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT`, `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT` и других MASTER-строк. Зелёные прежние gates, `???`=0, partial screenshots, AX-absence, `--warn-only` exit 0, chromium-only workaround, чужие `fetch_page`-witness'ы и чужая градуировка P0–P3 редакционную проверку не заменяют. `OWNER_APPROVED=true`/baseline update не применялись.

**Ветки/пуш.** Только `arena/0b6f34f6-auditrepo`; ветка не переключалась/не переименовывалась, чужие PR/ветки и Product не трогались. Перед записью повторно сверены branch, `HEAD`/`@{u}`/`origin/...` = `9d234a0`, remote-головы, Product `main`, открытые PR и отсутствие path collisions; после правки двух существующих файлов выполняются `git diff --check`, обычный `git push origin arena/0b6f34f6-auditrepo` и `present_file REPORT.md`.

---

## 16. Волна 10 — reattach, 26-branch ценз и канонические owner/print-границы

**Статус:** после `0892b0f` песочница снова пересоздалась: локально `HEAD` = `ae3669b`, upstream отсутствовал, два deliverable были `??`. Их SHA-256 (`07dcc625…` REPORT, `c4ce75dc…` CSV) совпали с blobs `origin/arena/0b6f34f6-auditrepo@0892b0f`; выполнены `git fetch`, `branch --set-upstream-to`, `reset --mixed` — без repair commit. Теперь branch/`HEAD`/`@{u}`/`origin/...` = `0892b0f`, working tree clean. Product `main` = `5e2db6f0…` (2026-11-07T14:12:16Z), AuditRepo `main` = `ae3669bf7a9b87af06e999c0bb3ef5009c400d43` (2026-11-07T14:14:29Z), открытые PR #545/#544/#543/#542/#538/#521/#514 без изменений.

На 19:56 UTC головы пяти других arena-веток не сдвинулись после bounded-окна §15: `a33be340 836d09d8`, `c6d6c46c 0289bcff`, `01a10d48 539d7b81`, `7f74c768 31ef6f05`, `13fed2e7 ec5c0598`. Уже в 19:57:51Z a33 сдвинулась ещё раз на `6c86f1bb`; финальное bounded-окно волны 10 остановлено на `a33@6c86f1bb`, `c6@0289bcff`, остальные головы без изменений. Три последних — старые не-article lane (2026-10-06 / 2026-11-08): DX/UX-комментарий, Horeb-3D W1/W2 и W15 checkpoints; новых отчётов по 111 маршрутам там нет. Семь `docs/*` / `lane/*`-веток тоже не содержат article-audit docs: `docs/grok-v17-owner-acceptance-20261107@fdf9ac8b`, `docs/milovi-school-closure-truth-20261103@6e1fabe6`, `lane/gb-fixed-current-retire-wave59-print-20261104@6b3b87a6`, `lane/development-department-index-20261108@be9c54b4`, `lane/gb-premium-3d-library-lab-20261108@ebf5bc28`, `lane/horeb-3d-lab-20261108@eaa9b90a` (19:40:27Z, уже после §15, но это 3D-browser journey), `lane/imena-boga-arena-reference-20261107@7e48dce7`. Движение этих голов не меняет Product anchor и не добавляет наш live/browser witness.

### 16.1 Полный path-collision ценз

`git ls-remote --heads origin` → **26** веток; для каждой `git/trees/<sha>?recursive=1` вернул `truncated:false`, включая повторно проверенный поздний `a33@6c86f1bb`. Наш путь `projects/gb-is-my-strength/incoming/arena-all-articles-audit/` встречается **только** в нашей `arena/0b6f34f6-auditrepo@0892b0f` (ровно 2 blob'а: `REPORT.md` и `ALL_ARTICLES_MATRIX.csv`). Во всех остальных 25 ветках, включая 12 `archive/*`, `main`, 5 других `arena/*` и 7 `docs/*` / `lane/*`, совпадений **0**. Это расширяет прежние точечные проверки до полного remote-ценза без переключения веток и без чужих правок.

### 16.2 Каноническая визуальная приёмка остаётся открытой

На AuditRepo `main` лежит `projects/gb-is-my-strength/prototype/grok-desktop-reader/OWNER-VISUAL-ACCEPTANCE-2026-11-07.md` (14 871 B). Документ прямо называет Grok V27 **не прошедшим визуальную приёмку владельца**, даже при зелёном CI/192 функциональных тестах; требует screenshots first, сравнение `reference → candidate → public production`, desktop 1200/1440/1920, short desktop, tablet, mobile 390×844/320×760, Day/Sepia/Night, открытую/закрытую рейку и по возможности Chrome+WebKit; stop-ship без явного owner signoff. Ветка `fdf9ac8b` расширяет файл до 25 217 B (Grok Focus V17), но на main этот вариант не слит. Документ относится к Grok Reader, а не к нашим 111 маршрутам, поэтому **не** является owner signoff для нашего пакета; напротив, он подтверждает нашу границу: chromium-only workaround, `--warn-only` exit 0, partial screenshots, AX-absence и зелёные gates редакционную/визуальную приёмку не заменяют.

### 16.3 Чужое снятие print-строки не переносится в наш MASTER

`lane/gb-fixed-current-retire-wave59-print-20261104@6b3b87a6` удаляет из `verified/MASTER_BUG_MATRIX.md` строку `GBS-PRINT-TERMINAL-REGION-HIDES-CONTENT` и меняет арифметику **46 → 45** active work units / **13 → 12** direct defects. Сверка `contents?ref=main` показывает, что на AuditRepo `main` строка и счёт **46** всё ещё присутствуют; ветка не слита. Это чужая branch-level disposition, не наш PDF/print-parity witness. Мы не редактируем `MASTER_BUG_MATRIX.md`, не принимаем закрытие, не вводим новую строку MASTER/ADMIT и не переклассифицируем 17 HARD / 64 TRIGGER / C23 / 5 controls. `OWNER_APPROVED=true`/baseline update не применялись.

### 16.4 Поздний `a33@6c86f1bb`: новые чужие P0-кандидаты и наш source-ценз

Коммит `6c86f1bb` (19:57:51Z) добавил `CHARTER_VIOLATIONS_AND_PROSE_READING.md` и обновил TSV/tool. A33 заявляет три новых класса: `GBS-DRAFT-CONTRACT-IN-PRODUCT` (7 статей, P0, S12/S17/S18), `GBS-INTERNAL-CODES-READER-VISIBLE` (3 статьи, P0, S12) и `GBS-SUMMARY-THREE-ITEMS` (10 статей, P2, S17); сам документ оговаривает, что блоки `{/* … */}` читателю не рендерятся, а коды статусов проверены только в исходниках MDX, не после сборки.

Независимый shallow Product clone на том же anchor `5e2db6f0…` (70 MDX) подтверждает часть source-фактов, но не verdict'ы:

| Проверка | Наш bounded результат | Граница |
|---|---|---|
| Блоки `{/* … */}` | **7/70** MDX содержат такие комментарии; **5** имеют точную строку `Research authority for drafting:`, **4** — `No route, registry, prev/next…`. Все 7 — семейный/подростковый цикл | Это неотрендеренные комментарии исходника; `docs/ARTICLE-STANDARD-CHARTER.md:94` действительно запрещает repo/workflow notes «в публичном тексте». Является ли невидимый MDX-комментарий «публичным текстом» по S12 — owner-решение, нами не принимается |
| Внутренние статусные токены | В трёх названных MDX по грубому цензу дефисных UPPERCASE-токенов: **106 / 6 / 1** вхождений и **40 / 5 / 1** уникальных; a33 сообщает **40 / 3 / 1** и 14 уникальных кодов | Разница в определении токена и в том, что считать «кодом». Source-level presence воспроизведена, но нет build/HTML/DOM/painted witness, поэтому «видны читателю» не подтверждено |
| S17/S18 | `ARTICLE-STANDARD-CHARTER.md:113` = «Коротко» 4–6 пунктов; `:116` = логичные H2/H3 и дробление длинных разделов | A33 сообщает 10 статей с 3 пунктами «Коротко»; в волне 10 мы не пересчитывали все проекции summary-card и не принимаем этот счёт как наш |

Новые `GBS-*`-классы, P0/P2-приоритеты и предлагаемые правки контента в наш C1–C24/MATRIX/CSV/MASTER не вводятся: 17 HARD / 64 TRIGGER / C23 / 5 controls и активные строки MASTER не переклассифицированы. Style-only вывода «ИИ/человек» нет; новый документ a33, наоборот, отвергает гипотезу «861 антитеза = ИИ-стиль» как смысловую плотность аргумента. Без owner/browser/ALT/live-release witness это остаётся чужим source-level triage.

### 16.5 Матрица, границы и пуш

`ALL_ARTICLES_MATRIX.csv` в волне 10 **не менялся**: 111 маршрутов, 64 колонки, LF, ключ `route + criterion_id`; `REPORT.md` получил title/meta «волны 2–10» и §16. `/tmp/aiq-wave10/` содержит только runtime-копии канонических owner/print/README-документов вне git; новых файлов в AuditRepo нет.

**Чего волна 10 НЕ доказывает:** owner visual signoff для Grok или для 111 маршрутов, канонический Chrome+WebKit визуальный прогон и WebKit/Firefox interactive, реальное устройство, TTS voice-switching, PDF/print-parity, внешнюю corroboration/rights/edition, авторство «ИИ/человек», painted rail/аккордеон/prev-next и live published HTML для 24 книжных страниц, закрытие `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS`, `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT`, `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT` и других MASTER-строк. Зелёный CI, `???`=0, partial screenshots, AX-absence, chromium-only workaround, `--warn-only` exit 0 и чужая невлитая правка MASTER редакционную проверку не заменяют.

**Ветки/пуш.** Только `arena/0b6f34f6-auditrepo`; ветка не переключалась/не переименовывалась, чужие PR/ветки и Product не трогались. Перед записью повторно сверены branch, `HEAD`/`@{u}`/`origin/...` = `0892b0f`, SHA-256 deliverable против remote, Product/AuditRepo `main`, открытые PR и 26 remote-голов; после правки только существующего `REPORT.md` выполняются `git diff --check`, обычный `git push origin arena/0b6f34f6-auditrepo` и `present_file REPORT.md`.

---

## 17. Волна 11 — новые `main`-головы, live Home witness, Drive L2 и двенадцатый проход c6

**Статус:** после `dc4b2a9` песочница снова пересоздалась: `HEAD` = `ae3669b`, upstream отсутствовал, deliverable были `??`; SHA-256 (`383e935e…` REPORT, `c4ce75dc…` CSV) совпали с remote `dc4b2a9`, восстановлено `git fetch` + `set-upstream-to` + `reset --mixed` без repair commit. На 20:42 UTC branch/`HEAD`/`@{u}`/`origin/...` = `dc4b2a9`, working tree clean. Product `main` сдвинулся с audited anchor `5e2db6f0…` на **`96455813477dcb85cab71331bf4c466f5c30ce85`** (20:17:21Z, PR #2294 merged), AuditRepo `main` — с `ae3669b…` на **`6a1115e64e1b8fef36aece415be7a93539e79073`** (20:16:20Z, PR #546 merged). Открытые PR #545/#544/#543/#542/#538/#521/#514 без изменений; наш audited anchor остаётся `5e2db6f0…`.

Головы article-lane на момент bounded-окна 20:42 UTC: `a33be340 6c86f1bb`, `c6d6c46c 5319be4b` (20:18:57Z), `01a10d48/7f74c768/13fed2e7` без изменений; за время волны 11 a33 ушла вперёд ещё на 2 коммита (см. §17.5). Полный ценз **26** AuditRepo-голов на 20:42 и повторный pre-push ценз **26 AuditRepo + 5 Product** голов на 20:51 UTC: все `truncated:false`, наш путь `incoming/arena-all-articles-audit/` только в нашей ветке (2 blob'а), в остальных ветках — **0**.

### 17.1 Product `main` сдвинулся, но источники статей не изменились

`compare/5e2db6f0…...96455813…` = `ahead_by 1`, единственный изменённый файл — `scripts/visual-parity-screenshots.js`. Патч добавляет read-only `captureLiveHomeMatrix(browser)` для `https://gospod-bog.ru/`: 1440×900 / 390×844, Light/Dark, `reducedMotion: reduce`, `ru-RU`, blocked service workers, прогрессивный scroll, `document.fonts.ready`, full-page PNG + SHA-256 receipt. Не изменены ни `src/content/articles/*.mdx`, ни `*Body.astro`, ни `src/pages/**/index.astro`, ни `data/search-manifest.json`, `sitemap.xml`, `llms.txt`, `migration/page-ownership.json`. Следовательно, все source-level выводы волн 2–10 на anchor `5e2db6f0…` остаются привязанными к своему anchor; новый `main` не пересматривает 17 HARD / 64 TRIGGER / C24-ценз и не является нашим build/`dist`/browser witness.

### 17.2 AuditRepo `main`: live Home evidence, но не owner signoff

PR #546 добавил `reverify/2026-11-09-home-production-visual-wave1.md` (6200 B). Документ фиксирует live `https://gospod-bog.ru/` HTTP 200, снимок `2026-11-09T20:01:11Z` в GitHub-hosted isolated Chromium через Product PR #2294 head `c436e411…`; 4 full-page PNG (1440×8548 Light/Dark, 390×7260 Light/Dark) и `live-home-matrix.json` лежат в artifacts `reports/visual-parity/` с 14-дневным retention, бинарники в репозиторий не закоммичены. Измерено: 0 горизонтального document overflow, 21/21 изображений загружено, 0 unhandled page errors, 0 скрытых reveal-секций после warm-scroll, H1 точен во всех 4 профилях.

Сам документ оговаривает границы: production identity — URL/runtime witness, **не** доказанное byte-равенство `main` SHA; снимки не заменяют normal-motion, forced-colors, keyboard и WebKit; «не доказывает отсутствие layout/visual/WCAG/interaction дефектов». Находки `HOME-FEATURED-INTRO-COUNT-DRIFT`, `HOME-REFUTATIONS-CARD-HEIGHT-RISK`, `HOME-ODD-CARD-GRID-RHYTHM` и microtext/carousel остаются candidate/current-confirmed-for-work, MASTER не тронут из-за активного PR #521. Это внешний live Home witness, а не owner visual signoff и не наш проход 111 маршрутов.

### 17.3 c6 двенадцатый проход и самокоррекция SHA

`c6@5319be4b` (20:18:57Z) обновил 5 docs. §17.0 его синтеза всё ещё пишет «Product `main` без изменений» про `5e2db6f0…` — это snapshot-race относительно 20:17:21Z, описанного в §17.1. Полезные уточнения: c6 **отозвал** свой упрёк «отчёт A33 @ `ffa7504d` не воспроизводится», подтвердив по immutable SHA `ffa7504d` = 82 / 248 996 / 8 535, `807120d6` = 80 / 241 774 / 8 284; принял нашу wave-9 поправку. A/B/C-шкала A33 остаётся описанием распределения, не нормой; антитеза сошлась в четырёх замерах 35,6 / 37,3 / 37,7 / 35,53 на 10 000 слов; два исследования 2025 про детектирование не дают style-only вердикта. Новые `GBS-*`-классы A33, S55–S57 и `G-*`-охраны не вводятся.

C6 частично подтверждает пятый коммит A33: 7 служебных блоков `{/* … */}` не рендерятся и по букве S12 это гигиена исходника, а не читательское нарушение; «нет „Коротко“» и «3 раздела» опровергаются сводкой из 6 пунктов и 40 тегами `<h2>`; зато внешние live chunks страницы `mozhno-li-doveryat-1-enohu-kanonicheskiy-audit` показывают `DATING-HOLD`, `Research authority: GEN6-ENOCH-70-71-DECISION-LXV`, `HOLD` в сноске. Это уточняет §16.4: чужой `fetch_page`-witness опубликованного текста существует, но у нас по-прежнему нет собственного build/`dist`/DOM/painted/browser witness и owner-решения; новой строки MASTER нет. C6 отдельно сверил wave-10: 26 веток, owner-acceptance 14 871 B, print-строка на `main`, 7/5/4 блоков и наш грубый токен-ценз.

### 17.4 Независимая read-only проверка Google Drive L2-стандарта

Через подключённый `google_drive` connector (только поиск и чтение, без записи) найдены ровно 2 файла, упомянутых c6: `RICH_EDITOR_ARTICLE_STANDARD.md (v5)` (`1G3vnxp10VeGqrUI-B1XSCUfiYjeUy-SG`, 14 304 B, modified 2026-10-18) и `lordchrist_article_preflight.py (v5)` (`174eF52l2A3qhaouWOfyVCqFOZFQeizV1`, 18 579 B, modified 2026-10-18). Стандарт называет себя **canonical presentation contract for long articles published manually through the Telegram rich editor «Статья» (lane L2)** до 32 768 UTF-8 chars / 500 blocks; один H2 на 1 500–4 000 chars, пункт списка 1–3 предложения, цитата ≤600 chars, запрет `U+2060`/`U+200B`, «no slogan ladder; paragraphs are multi-sentence», «never exegesis or evidence… do not degrade the prose into slogans», ручная публикация без авторизации провайдера. Оба документа затем выгружены `download_file` и перенесены в `/tmp/aiq-wave11/docs/` без появления новых файлов в git; полный стандарт и полный скрипт подтверждают `MAX_CHARS/SOFT_CHARS/MAX_BLOCKS`, `MAX_QUOTE/MAX_ITEM`, `BANNED` (`certainty =`, `source_ids`, `fact-check anchors`, «нейросеть», «как ИИ»…), запрет `U+2060`/`U+200B`, H1/H2/emoji, quote/list и отдельную проверку «лесенки лозунгов» (строки 317–329).

Это **другой канал** (@lordchrist / Telegram), а не Astro-Product и не наш `ARTICLE-STANDARD-CHARTER.md` S1–S54. Пороги L2 на 111 маршрутов не переносятся; документ используется только как внешний положительный прецедент «развёрнутое ядро + запрет slogan ladder», без owner-решения и без новых C1–C24/MASTER/ADMIT-контрактов. Выводов «ИИ/человек» не делается.

### 17.5 Поздние a33-головы, Drive funnel и повторный ценз

После 20:42 UTC `a33be340` ушла с `6c86f1bb` на **`aad5645322faf649f9ca82ffd3e92c8bc180caf2`** (`compare …6c86f1bb…aad5645` = `ahead_by 2`, `behind_by 0`), изменив ровно 2 файла координации:

| Commit / время | Файл | Что важно и чего не хватает |
|---|---|---|
| `9bee64d8669e3067d17a299374ce0fe9069d42bc` / 20:43:25Z | `METRIC2_LISTS_AND_DRIVE_FUNNEL.md` (8 119 B) | A33 отзывает «17 статей написаны лозунгами»: метрика-1 считала пункты `-`/`1.` за короткие абзацы. Пересчёт по 54 статьям: 3 172 пункта списков, медиана 26, 19 статей >50 и 9 >100; после исключения списков медиана коротких прозаических абзацев 54%, 23/54 >80%, `vzroslaya-doch…` = 163 прозы / 97% короче 40 слов / медиана 14. Новый диагноз «жанр заметок/конспекта», но собранный вид не проверен; предложения «дописать S18», «перечень ≤1/3» и «связать Drive с `series.json`» остаются черновиками |
| `aad5645322faf649f9ca82ffd3e92c8bc180caf2` / 20:49:08Z | `GOOD_PARAGRAPH_STANDARD.md` (12 172 B) | A33 предлагает **S58/S59**: медиана абзаца 40–80 слов, ≤2 ударных абзаца короче 20 слов подряд, перечень ≤1/3 объёма, ≥1/3 абзацев с конкретной опорой по типу статьи; корреляции +0,91 / −0,88 / −0,83, гипотеза «два жанра» не подтвердилась. Сам документ оговаривает: прочитаны 3 эталона из 5, корреляции по 53 статьям без типа, regex дважды давал сбой, порог 1/3 — предложение агента, `Body.astro`/MDX в собранном виде не сверены |

S58/S59, план переписывания 17 статей, новые `GBS-*`, S55–S57 и `G-*` в наш C1–C24 / CSV / MASTER не принимаются: это чужие source-level метрики без owner/browser/ALT/live-release witness, а не новый универсальный чек-лист и не style-only вывод «ИИ/человек».

**Независимая проверка Drive funnel.** Тем же read-only connector'ом найдены 5 папок конвейера внутри `06 — SERIES DOSSIERS — ARTICLES & CHRONOLOGY` (`1bDmRcCQKBzhVy9Jn0siXlOCkwSmnTHA6`): `00 — MASTER CHRONOLOGY`, `01 — PLANNED ARTICLE DOSSIERS`, `02 — IN PROGRESS`, `03 — READY FOR SITE`, `90 — THEMATIC BACKLOG`; поиск прямых детей дал **0** во всех пяти, modified 30.07.2026. Рядом найдены 12 папок `01 — РУССКИЕ БАПТИСТЫ — RESEARCH CORPUS` и файл `SINICHKIN — MASTER FILE CATALOG — 5941 FILES.csv` (1 469 442 B); нами прочитан только его 6 000-символьный префикс с колонками `RelativePath/FileName/SizeBytes/SHA256/Category/DirectAccess`, **не** полный ценз 5 941 файла и не проверка прав/изданий/источников. Это подтверждает наблюдение A33 о пустом производственном конвейере и наличии архива, но не даёт внешней corroboration для утверждений 111 маршрутов и не является owner-решением.

**Перед пушем на 20:54 UTC (деревья сняты в 20:51).** AuditRepo `main` = `6a1115e6`, Product `main` = `96455813`, c6 = `5319be4b`, a33 = `aad5645`, наша ветка = `dc4b2a9`; открытые PR #545/#544/#543/#542/#538/#521/#514 без изменений. 26 AuditRepo-деревьев и 5 Product-деревьев: все `truncated:false`; 0 path collisions вне нашей article-lane. Повторного `npm ci`/build/`dist`/browser/runtime прогона не было.

### 17.6 Матрица, границы и пуш

`ALL_ARTICLES_MATRIX.csv` в волне 11 **не менялся**: 111 маршрутов, 64 колонки, LF, ключ `route + criterion_id`; `REPORT.md` получил title/meta «волны 2–11» и §17.1–17.6. `/tmp/aiq-wave11/` содержит только runtime-копии docs и выгрузки connector'а вне git; новых файлов в AuditRepo нет. 17 HARD / 64 TRIGGER / C23 / 5 controls / MASTER-строки и audited anchor не переклассифицированы; `OWNER_APPROVED=true`/baseline update не применялись; новых универсальных guard’ов, style-only атрибуции и Product правок нет.

**Чего волна 11 НЕ доказывает:** равенство live URL и нового `main` SHA, owner visual signoff, normal-motion/forced-colors/keyboard/WebKit, наш собственный build/`dist`/painted witness для внутренних кодов, канонический WebKit/Firefox interactive, TTS, PDF/print-parity, полную внешнюю corroboration/rights/edition (прочитан только префикс Drive-каталога, не все 5 941 файл), painted rail/аккордеон/prev-next для 24 книжных страниц и закрытие активных MASTER-строк. Live Home PNG, зелёный CI, `--warn-only` exit 0, chromium-only workaround и чужой `fetch_page`-witness редакционную проверку не заменяют.

**Ветки/пуш.** Только `arena/0b6f34f6-auditrepo`; ветка не переключалась/не переименовывалась, чужие PR/ветки и Product не трогались. Перед записью сверены branch, `HEAD`/`@{u}`/`origin/...` = `dc4b2a9`, SHA-256 deliverable, новые `main`-головы, 26 AuditRepo + 5 Product remote-голов, открытые PR и path collisions; после правки только существующего `REPORT.md` выполняются `git diff --check`, обычный `git push origin arena/0b6f34f6-auditrepo` и `present_file REPORT.md`.

---

## 18. Предварительный самоаудит накопленного пакета (21:11 UTC)

**Статус.** Это **не** новая волна Product evidence и **не** финальная приёмка. Задача — сверить, что именно мы сделали за всё время, не потерять границы и явно назвать незакрытое. Self-audit не меняет audited anchor `5e2db6f0…`, proof state, 17 HARD / 64 TRIGGER / C23 / 5 controls, активные строки MASTER, C1–C24, split 3 агентов и ключ `route + criterion_id`.

**Метод.** Read-only `git`, `gh api`, текущие `REPORT.md`/`ALL_ARTICLES_MATRIX.csv`, повторный ценз 26 AuditRepo + 5 Product деревьев, поиск новых файлов в подключённом `google_drive` connector'е. Не было `npm ci`, `strangler:build`, `dist`, Chromium/WebKit/Firefox, runtime, owner signoff, записи в Drive/Product/`MASTER_BUG_MATRIX.md`, merge/close PR. Локальный клон **shallow**: `git rev-parse --is-shallow-repository` = `true`, `.git/shallow` содержит `6a1115e…` и `ae3669b…`, поэтому `git diff main...HEAD` даёт «no merge base»; сравнение сделано от явно известного base `ae3669bf7a9b87af06e999c0bb3ef5009c400d43..HEAD`. Это ограничение рабочей копии, а не вывод о rewrite remote-истории.

### 18.1 Что реально лежит в ветке

На момент §18 (до её собственного коммита `e7d33cd`) от base до `afab6f4`: **10 коммитов**, **2 файла**, **+1323 строки / 0 удалений** в итоговом diff. Оба файла находятся только в `projects/gb-is-my-strength/incoming/arena-all-articles-audit/2026-11-09/`. `ALL_ARTICLES_MATRIX.csv` последний раз менялся в `0892b0f` (волна 9), `REPORT.md` — в `afab6f4` (волна 11), затем `e7d33cd` (§18); волна 12 добавляет §19. CSV: **112 строк / 28 275 B / LF / 0 CRLF / 111 уникальных маршрутов / 64 колонки / 5 `c24*`**, sha256 `c4ce75dc9c77d8a374f48d09eef5954f74e66ef072262046b04efb85f567352f`. На момент §18 REPORT содержал **1291 строку**; sha256 не встраивается в сам файл во избежание самоссылки и сверяется отдельно после коммита.

| Commit | UTC | Волна | Файлы | Смысл |
|---|---|---|---|---|
| `983dad7` | 11:30:02 | 2 | CSV + REPORT | исходный компактный пакет: C1–C24, 111-route матрица, 81 = 17 HARD + 64 TRIGGER, 5 controls |
| `4dd240e` | 12:03:35 | 3 | CSV + REPORT | `npm ci` 377, build 112 HTML/1248/101M, gates, built-DOM ценз, +8 колонок |
| `1cbfa19` | 12:33:41 | 4 | CSV + REPORT | headless Chromium 153, 112 painted/AX маршрутов, browser-gates, `???`=0, +8 колонок |
| `3ad38e7` | 18:36:14 | 5 | CSV + REPORT | pagefind, runtime-клики, visual-parity pilots, MDX↔`dist` сверка, +8 колонок |
| `0f97da9` | 19:04:03 | 6 | CSV + REPORT | bounded API/source, W3C SC 3.1.2/H58, книжная серия, +4 колонки; исправлены «55 колонок»/«18 metadata»/«24 arabic» |
| `cac25a8` | 19:15:28 | 7 | REPORT | обновлённые головы a33/c6, hub ownership, чужой `G-*` не принят |
| `9d234a0` | 19:21:55 | 8 | REPORT | финальный отзыв чужих P0, ценз catalog/sitemap/`llms.txt` |
| `0892b0f` | 19:35:56 | 9 | CSV + REPORT | C24 static import graph, 111/111 canonical+robots source, строгое подмножество `llms.txt`, 5 `c24*` колонок |
| `dc4b2a9` | 20:06:24 | 10 | REPORT | 26-branch ценз, канонические owner/print-границы, поздний a33 source-ценз |
| `afab6f4` | 20:54:33 | 11 | REPORT | новые `main`-головы, live Home witness, Drive L2/funnel, c6 §22, поздние a33 S58/S59, 26+5 tree-ценз |

**Исторические reattach.** После `3ad38e7`, `0f97da9`, `0892b0f`, `dc4b2a9` песочница пересоздавалась: deliverable оказывались `??`, `HEAD` = `ae3669b`, upstream отсутствовал. Каждый раз восстановление делалось сверкой SHA-256 локальных REPORT/CSV против remote, затем `git fetch` + `branch --set-upstream-to` + `reset --mixed`; repair commit в истории нет. На момент §18 ветка/`HEAD`/`@{u}`/`origin/...` = `afab6f4`, working tree clean.

### 18.2 Ветки, PR и коллизии на момент самоаудита

| Объект | Голова |
|---|---|
| `arena/0b6f34f6-auditrepo` | `afab6f4454188b3f94bd0cb45444cc305e465760` |
| AuditRepo `main` | `6a1115e64e1b8fef36aece415be7a93539e79073` |
| Product `main` | `96455813477dcb85cab71331bf4c466f5c30ce85` |
| `arena/a33be340-auditrepo` | `aad5645322faf649f9ca82ffd3e92c8bc180caf2` |
| `arena/c6d6c46c-auditrepo` | `e407be777792317d6d5242b613d7a3874a54ff9c` |

Открытые PR AuditRepo #545/#544/#543/#542/#538/#521/#514 без изменений; #546 и Product #2294 уже слиты в новые `main`. Повторный ценз **26 AuditRepo + 5 Product** голов: все рекурсивные деревья `truncated:false`; путь `incoming/arena-all-articles-audit/` встречается **только** в нашей ветке (2 blob'а), в остальных — **0**. Наши коммиты не обнаружены на `main` или чужих article-lane ветках; чужие ветки/PR/Product не редактировались, merge/close не выполнялись.

**Дрейф после wave 11.** C6 ушла с `5319be4b` на `e407be7` (21:01:47Z, «тринадцатый проход»), изменив 5 своих MD. Его §23 независимо подтверждает Product `main`-дрейф, Home witness без owner signoff, пустую Drive-воронку и самокоррекцию A33; при этом координация c6 всё ещё пишет про нашу ветку `dc4b2a9de` / «wave-10 остаётся последним коммитом». Это **внешний snapshot-race**, а не наш откат: фактический наш head `afab6f4`. C6 по-прежнему называет свои «живые чанки» закрытием пробела и вводит свои `AAQ-A-089…094`; для нашего пакета это чужой witness, не наш build/DOM/painted/owner. A33 осталась на `aad5645`; её черновики S58/S59 не приняты.

**Drive.** В волне 11 connector использовался только на чтение/скачивание runtime-копий в `/tmp`. В самоаудите `search_files` по `modifiedTime > '2026-11-09T00:00:00'` дал **0** новых файлов; записи, загрузок, комментариев и правок Drive не было. V5-стандарт L2 и `5941 FILES.csv` не перечитывались и не являются нашим полным цензом источников/прав/изданий.

### 18.3 Слои доказательства и чего в них нет

| Слой | Где зафиксирован | Что даёт / чего не даёт |
|---|---|---|
| Source criteria + CSV | §1–§8, `ALL_ARTICLES_MATRIX.csv` | 111 маршрутов, C1–C24, 17 HARD / 64 TRIGGER / 5 controls; не DOM/HTTP/live `<meta>` и не авторство |
| Built-DOM | §9, волна 3 | 112 `dist` HTML, 829 Greek/200 Hebrew, 543/41 и 515/38; не painted, не TTS, не owner |
| Chromium painted/AX | §10, волна 4 | 112/112 status 200, `???`=0, AX-дерево; не WebKit/Firefox/реальное устройство, не owner signoff |
| Runtime/visual-parity | §11, волна 5 | bounded Chromium-only exit0/488, pagefind, MDX Jaccard; не канонический WebKit, не `--warn-only` как приёмка, не полный quiz-click |
| Bounded API/source/W3C | §12–§15 | чужие головы, owner/print-документы, C24 static graph, `llms.txt` 55⊂102; не build, не live-release, не внешняя corroboration |
| 26-branch / Home / Drive | §16–§17 | 0 path collisions, owner doc 14871 B и print row+46 на `main`, 4 Home PNG, Drive L2/funnel; не равенство deploy SHA, не owner visual signoff, не 111 маршрутов |

**С волн 6–11 не было ни одного нового `npm ci`/build/`dist`/browser/runtime прогона.** Клон Product, `node_modules`, `dist`, Chromium binary, PNG и логи волн 3–5 были runtime-only в `/tmp`/`~/.cache` и в текущей песочнице не сохранились; docs волн 6–11 лежат в `/tmp/aiq-wave6…11/` вне git. Поэтому предварительный аудит не может «перепроверить» painted witness заново — он проверяет целостность уже записанного протокола и границ.

### 18.4 Находки самоаудита

| # | Проверка | Результат | Комментарий |
|---|---|---|---|
| P1 | Состав пакета | `PASS` | ровно 2 файла, ключ `route + criterion_id`, компактность сохранена; новый отчёт-файл не создавался |
| P2 | CSV | `PASS` | 111/64/LF/0 CRLF/111 unique, sha256 неизменен с волны 9; 17 HARD/64 TRIGGER/C23/5 controls не переклассифицированы |
| P3 | Anchor discipline | `PASS` | audited anchor `5e2db6f0…` не подменён новыми `main`-головами; дрейф записан отдельно в §17/§18 |
| P4 | Ветка/PR/коллизии | `PASS` | только активная `arena/0b6f34f6-auditrepo`, 0 collisions, чужие PR/ветки/Product не тронуты |
| P5 | Reattach + shallow | `PASS` с оговоркой | 4 восстановления без потери blob’ов и без repair commit; локальный shallow не позволяет `main...HEAD`, использован явный base |
| P6 | Запрещённые действия | `PASS` | нет новых MASTER/ADMIT/universal guards, `OWNER_APPROVED=true`, baseline update, style-only «ИИ/человек», авто-переписывания прозы, terminal ZERO |
| P7 | Внешние witness’ы | `PASS` с оговоркой | Home PNG, c6 live chunks, Drive v5, A33 S55–S59/`G-*`, чужие P0–P3 оставлены чужими; не owner/browser/ALT/live-release witness |
| P8 | Исторические ошибки | `PASS` | ранние false positives, `StatisticsError`/f-string, CRLF, неверные 125/58/67 и 82/24/58, snapshot-ошибка c6 §16.1 и отзывы чужих P0 сохранены как история, а не задним числом стёрты |
| P9 | Достаточность для финальной приёмки | `PRELIMINARY / PARTIAL` | 17 HARD остаются `FAIL`, остальные owner-open `UNPROVEN`; зелёный CI, `???`=0, partial screenshots, AX-absence, chromium-only, `--warn-only` и чужие отчёты редакционную проверку не заменяют |
| P10 | Актуальность чужих голов | `NOTE` | на момент §18 отчёт — снимок bounded-окна: c6 уже `e407be7`, a33 `aad5645`, его §23 не видел наш `afab6f4`. Последующий дрейф a33 до `4e6a3ed8` зафиксирован в §19; авто-обновление чужих голов не делалось и не объявлялось |

### 18.5 Предварительный вердикт и незакрытое

**Как накопленный рабочий пакет, протокол границ и basis для продолжения — пригоден.** Внутренняя целостность, anchor, ветка, CSV и запреты выдержаны; исторические волны §9–§17 не переписаны. **Как финальный аудит, приёмка в `verified/`, закрытие MASTER или «всё готово» — пока нет.** Статус `PRELIMINARY / PARTIAL`; 17 HARD = `FAIL`, остальное = `UNPROVEN` до owner/browser/ALT/live-release witness.

Остаются непройденными: канонический полный `visual:parity:guard` и WebKit/Firefox interactive, owner visual signoff, PDF/print-parity, TTS voice-switching, реальное устройство, внешняя corroboration/rights/edition, живой published HTML/rail/аккордеон/prev-next для 24 книжных страниц и 111 маршрутов, закрытие `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS`, `SYS-PUBLICATION-LANGUAGE-OF-PARTS-CONTRACT`, `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT` и других активных MASTER-строк. Ручные lane C1/C2/C11/C12/C13 остаются bounded triage. `OWNER_APPROVED=true` не применялся.

**Ветки/пуш.** Self-audit добавляет только §18 и уточнение meta в существующий `REPORT.md`; CSV, audited anchor, proof state и MASTER не меняются. Коммит/пуш — только `arena/0b6f34f6-auditrepo`, без переключения/переименования ветки, без merge/close PR и без правок Product.

---

## 19. Волна 12 — bounded refresh после самоаудита (21:39–21:41 UTC)

**Статус.** После `e7d33cd` песочница **не** пересоздавалась: branch/`HEAD`/`@{u}`/`origin/...` = `e7d33cd`, working tree clean, reattach не потребовался. Это **не** новая степень Product evidence и не продолжение чужого плана правки прозы: только read-only сверка движущихся голов, канонических blob’ов, открытых PR, path collisions и Drive no-new-files. Audited anchor `5e2db6f0…`, proof state, 17 HARD / 64 TRIGGER / C23 / 5 controls, `ALL_ARTICLES_MATRIX.csv`, C1–C24, split 3 агентов и ключ `route + criterion_id` не меняются. Title/meta уточнены до «волны 2–12»; историческая запись §17.6 о «2–11» относится к состоянию на момент волны 11 и не переписывается, §18 остаётся preliminary self-audit, а не волной.

**Метод.** `git ls-remote`, `gh api` compare/tree/contents, `gh pr list`, `google_drive search_files`, разбор чужих TSV/скриптов по immutable SHA. Не было `npm ci`, `strangler:build`, `dist`, Chromium/WebKit/Firefox, runtime, owner signoff, записи в Drive/Product/`MASTER_BUG_MATRIX.md`, merge/close PR. Локальный клон по-прежнему shallow; сравнение с `main` делается от явно известного base `ae3669bf..HEAD`, а не через `main...HEAD`.

### 19.1 Головы, PR и повторный ценз

| Объект | Голова на 21:41:42Z |
|---|---|
| `arena/0b6f34f6-auditrepo` | `e7d33cdb55ef7ddee17e5cacce60a6e3111541dd` (до коммита самой волны 12) |
| AuditRepo `main` | `6a1115e64e1b8fef36aece415be7a93539e79073` |
| Product `main` | `96455813477dcb85cab71331bf4c466f5c30ce85` |
| `arena/a33be340-auditrepo` | `4e6a3ed8b526236501aeb3213cdd3bb6fb9e7bd8` |
| `arena/c6d6c46c-auditrepo` | `e407be777792317d6d5242b613d7a3874a54ff9c` |

Product `main` не сдвинулся с `96455813…`; `compare/5e2db6f0…...96455813…` по-прежнему `ahead_by 1` и меняет только `scripts/visual-parity-screenshots.js`. AuditRepo `main` не сдвинулся с `6a1115e6…`. Открытые PR #545/#544/#543/#542/#538/#521/#514 без изменений; #546 и Product #2294 остаются слитыми. Повторный полный ценз **26 AuditRepo + 5 Product** деревьев: все `truncated:false`, наш путь `incoming/arena-all-articles-audit/` только в нашей ветке (2 blob’а), в остальных — **0**. A33 `4e6a3ed8`: 2899 blobs, 38 coordination-документов, 0 наших путей, `truncated:false`. C6 `e407be7` не двигался с 21:01:47Z.

### 19.2 A33: два дрейфа головы и параллельный «предварительный аудит»

A33 ушла с `aad5645` (§18) на `7baa3d0` (21:18:52Z), затем **во время нашего окна** на `4e6a3ed8` (21:40:07Z). Docs читались по immutable SHA `7baa3d0…` и `4e6a3ed8…`, чтобы не поймать moving-head race. `compare/aad5645…7baa3d0` = 2 коммита; `compare/7baa3d0…4e6a3ed8` = ещё 2; от нашего base `ae3669bf…4e6a3ed8` = `ahead_by 23`.

| Commit / время | Файлы | Содержание |
|---|---|---|
| `1628e48` / 21:17:40Z | `metric3_prose_only.py`, `product_prose_metrics_v3.tsv`, `grade_matrix_v3.py`, `grade_matrix.tsv`, `README.md` | метрика-3: проза ≥25 слов без списков, HTML `<h2>` и «Коротко» учтены; P0 **17 → 1**, P1 4 → 8, P2 11 → 12, P3 46 → 57; `grade_matrix.tsv` 78 строк, `product_prose_metrics_v3.tsv` 80 строк |
| `7baa3d0` / 21:18:52Z | `PRELIMINARY_AUDIT.md` (24 189 B) | чужой параллельный «предварительный аудит»: 36 признаков ИИ, 11 внешних источников, отзыв «эпидемии ИИ-стиля», три отменённые цифры, реестр живых/снятых находок |
| `0e2b909` / 21:39:18Z | `QUALITY_OF_ARGUMENT_AUDIT.md` (11 954 B) | чтение 8 P1-статей, «проза не рассуждает»; 31 перечень-отрицание из 364, 24% пунктов ≤3 слов, 6 статей с перечнем >33% |
| `4e6a3ed8` / 21:40:07Z | `BEFORE_REPAIR.md` (11 120 B) | 15 статей <900 слов прозы, 6 статей с перевесом перечня, пример «до/после» 21 → 85 слов, 5 шагов правки и 3 решения владельца |

Это **чужой** self-audit и чужой repair-plan, а не наш §18 и не owner решение. A33 не ссылается на `0b6f34f6`, `afab6f4`, `e7d33cd` или наш §18. В их собственных документах есть внутренние расхождения, которые мы не исправляем и не принимаем: `PRELIMINARY_AUDIT.md` называет Product anchor `9645581`, а `README.md` — старый `5e2db6f0`; `README.md` пишет «Push не выполняется», хотя ветка имеет 23 коммита и remote head; сводка говорит «22 коммита», а compare от нашего base даёт 23; `README.md` утверждает «галлюцинаций нет», тогда как `PRELIMINARY_AUDIT.md` §6 прямо называет галлюцинации **непроверенными**, а `QUALITY_OF_ARGUMENT_AUDIT.md` §6 повторяет этот пробел. S58/S59, `G-SERIES-COVERAGE`, новый `readingTime`, разворот 31 перечня в прозу и план из 5 шагов остаются предложениями агента без owner signoff; Product-файлы в этих двух compare не менялись, только `_coordination/arena-agent-2026-11-09/`.

`BEFORE_REPAIR.md` отдельно пишет: «владелец просил „продолжай“ после предварительного аудита». Это интерпретация чужого агента, **не** наша инструкция переписывать русскую прозу. Наш preservation boundary («не менять Product», «не авто-переписывать русскую прозу», «не создавать новый универсальный контракт/чек-лист») сохраняется. Метрика-3 и P0 17→1 не переносятся в C1–C24/CSV/MASTER: это source-level пересчёт чужого `<p>`/MDX-резолвера, не наш build/DOM/painted/browser/owner witness.

### 19.3 C6 §23 и канонические документы

C6 `e407be7` остаётся «тринадцатым проходом» из §18. Его `02-COORDINATION.md:183` по-прежнему называет нашу ветку `dc4b2a9de` и «wave-10 остаётся последним коммитом»; ни `afab6f4`, ни `e7d33cd` в пяти обновлённых c6-документах нет. Это внешний snapshot-race, а не наш откат. C6 §23 независимо подтверждает Home evidence без owner signoff, пустую Drive-воронку и самокоррекцию A33; его `AAQ-A-089…094` и «94 строки» в наш пакет не вводятся.

Канонические blob’ы на AuditRepo `main` сверены заново и совпадают с хэшами c6 §23/§17.10:

| Документ | Размер / sha256 | Git blob | Проверка |
|---|---|---|---|
| `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` | 174 311 B / `a714f8e5…` | `d168bc8cd4d6…` | `GBS-PRINT-TERMINAL-REGION-HIDES-CONTENT` = 1, «46 active work units» = 1; строка не снята |
| `projects/gb-is-my-strength/WORK_QUEUE.md` | 20 896 B / `a474fe99…` | `e66b6086ea21…` | без изменений |
| `projects/gb-is-my-strength/prototype/grok-desktop-reader/OWNER-VISUAL-ACCEPTANCE-2026-11-07.md` | 14 871 B / `39cd90c1…` | `202d4362fd5a…` | визуальная приёмка по-прежнему открыта |

### 19.4 Drive, границы и предварительный вердикт

`google_drive` снова только read-only: `search_files` по `modifiedTime > '2026-11-09T21:00:00'` дал **0** файлов; записей, загрузок, комментариев и новых владельческих стандартов нет. A33 `PRELIMINARY_AUDIT.md` §4.4 независимо повторяет наш §17.5: 5 пустых папок конвейера, 12 разделов `RESEARCH CORPUS`, каталог `5941 FILES.csv`; это совпадение чужих read-only наблюдений, не новый owner/browser witness и не полный ценз прав/изданий/источников.

**Чего волна 12 НЕ добавляет:** нового `npm ci`/build/`dist`/browser/runtime прогона, нашего собственного painted DOM для внутренних кодов, owner visual signoff, normal-motion/forced-colors/keyboard/WebKit, канонического WebKit/Firefox interactive, TTS voice-switching, PDF/print-parity, внешней corroboration/rights/edition, живого published HTML/rail/аккордеон/prev-next для 111 маршрутов и 24 книжных страниц, закрытия активных MASTER-строк. `OWNER_APPROVED=true`, baseline update, новые MASTER/ADMIT/универсальные guard’ы, style-only вывод «ИИ/человек», Product-правки и terminal ZERO не применялись. Зелёный CI, `???`=0, Home PNG, Drive L2/funnel, чужие P0–P3/S55–S59/`G-*`, c6 live chunks и a33 «до/после» редакционную проверку не заменяют.

Вердикт §18 остаётся **`PRELIMINARY / PARTIAL`**: как рабочий пакет и протокол границ — пригоден; как финальная приёмка, перенос в `verified/` или закрытие MASTER — нет. 17 HARD = `FAIL`, остальное = `UNPROVEN`; полный список незакрытого см. §18.5. Ручные lane C1/C2/C11/C12/C13 остаются bounded triage.

**Ветки/пуш.** Волна 12 меняет только существующий `REPORT.md`; CSV, audited anchor, proof state и MASTER не меняются. `git diff --check`, обычный commit/push только в `arena/0b6f34f6-auditrepo`, без переключения/переименования ветки, без merge/close PR и без правок Product. A33 может сдвинуться снова после 21:41Z; раздел фиксирует bounded-окно и не объявляет авто-обновление чужих голов.

---

## 20. Волна 13 — bounded refresh: c6 pass-14, a33 glossary triage и Product PR #2295 (22:05–22:09 UTC)

**Статус.** После `ce2d24f` песочница **не** пересоздавалась: branch/`HEAD`/`@{u}`/`origin/...`/`git ls-remote` = `ce2d24fecaf61ab78f6650aac587895f0b3d6bdf`, working tree clean, reattach не потребовался. Как и §19, это **не** новая степень Product evidence и не принятие чужого repair-plan: только read-only сверка движущихся голов, нового четырнадцатого прохода c6, нового открытого Product PR, канонических blob’ов, path collisions и Drive no-new-files. Title/meta уточнены до «волны 2–13»; §18 остаётся preliminary self-audit, §19 — исторической волной 12. Audited anchor `5e2db6f0…`, proof state `PRELIMINARY / PARTIAL`, 17 HARD / 64 TRIGGER / C23 / 5 controls, `ALL_ARTICLES_MATRIX.csv`, C1–C24, split 3 агентов и ключ `route + criterion_id` не меняются.

**Метод.** `git status`/`git ls-remote`, `gh api` branches/compare/commits/contents/git-trees/pulls/check-runs/runs, `gh pr list`, `gh pr checks`, `google_drive search_files`. Все чужие документы читались по immutable SHA. Не было `npm ci`, `strangler:build`, `dist`, Chromium/WebKit/Firefox, runtime, owner signoff, записи в Drive/Product/`MASTER_BUG_MATRIX.md`, merge/close PR. Локальный клон по-прежнему shallow; сравнение с `main` делается от явно известного base `ae3669bf..HEAD`.

### 20.1 Гонка снимков: три состояния за одно окно

| Объект | 22:05:15Z | 22:07:34Z |
|---|---|---|
| `arena/0b6f34f6-auditrepo` | `ce2d24fecaf6…` | `ce2d24fecaf6…` (без изменений) |
| `arena/c6d6c46c-auditrepo` | `6b0d5e5d8416…` | `6b0d5e5d8416…` |
| `arena/a33be340-auditrepo` | `4e6a3ed8b526…` | `0f78fa12f4bb…` (сдвиг в 22:06:50Z) |
| AuditRepo `main` | `6a1115e64e1b…` | `6a1115e64e1b…` |
| Product `main` | `96455813477d…` | `96455813477d…` |
| Product heads | 6 (новая `fix/home-visual-integrity-20261110` = `25a95e1f1c34…`) | 6, `main` не сдвинулся |
| lane `premium-3d` / `imena-boga` / `horeb` | `2ad4cdf085c9` / `35a49fce6eb5` / `91435d577ef3` | `ae63b236c8be` / `a92c138468eb` / `91435d577ef3` |

Два lane-хэша сдвинулись **во время самого ценза деревьев**; a33 сдвинулась между первым и вторым снимком. Поэтому все внешние головы фиксируются полным SHA и временем, а раздел не объявляет «вечное состояние» и не переписывает §19.1 задним числом. Финальная сверка в 22:07:36Z: `git ls-remote` нашей ветки снова `ce2d24f…`; открытые PR AuditRepo `[514,521,538,542,543,544,545]` без изменений, Product `[2268,2269,2292,2293,2295]` (новый только #2295), #546 и Product #2294 остаются MERGED.

Полный ценз **26 AuditRepo + 6 Product** рекурсивных деревьев: 32/32 `truncated:false`, наш префикс `incoming/arena-all-articles-audit/2026-11-09/` только в нашей ветке (каталог + 2 blob’а), в остальных — **0 collisions**. У a33 `0f78fa12` дерево не усечено, 41 coordination-документ, 0 наших путей. Новый Product head не содержит our paths.

### 20.2 C6 `6b0d5e5` — четырнадцатый проход и снятие прежнего stale-упрёка

`compare/e407be77…...6b0d5e5d…` = `ahead 1`, коммит `6b0d5e5` / 21:50:47Z «четырнадцатый проход — гонка снимков, третья метрика A33, чтение 70 MDX, гигиена пакета»: 5 существующих MD (+95 / −1), новых файлов нет. Добавлены §17 критериев и координации, §19 синтеза, §24 отчёта, `AAQ-A-095`…`099` и итог «99 строк» в `MATRIX-A.md`; исторический §16 не переписывается, пропуск номера 8 объяснён без перенумерации.

Содержательные результаты c6, прочитанные по immutable SHA:

- **Метрика-3 A33 воспроизведена независимо.** `metric3_prose_only.py` @ `7baa3d0…` запущен на дереве Product `9645581…`: 28 напрямую импортируемых MDX, TSV SHA-256 `60cfb7f9632e…`, `grade_matrix.tsv` SHA-256 `780c702bf2c1…`, 78 строк, классы `P0/P1/P2/P3 = 1/8/12/57` вместо `17/4/11/46`. C6 сам называет это внешней самокоррекцией парсера, **не** заменой G1 и **не** допуском S58/S59/`G-*`.
- **`readingTime` 70/70.** Прямой ценз 70 MDX на неизменном Product tree дал `^readingTime:` 70/70 и поле внутри frontmatter 70/70; прежние 64/70 — ложное отрицание парсера. A33 последовательно писала «занижено в 3–6 раз», «в 1,5–2,5 раза», «завышено в 1,2–10 раз»; без формулы владельца и разделения тихого чтения/TTS ни один вариант не становится дефектом, порогом или правкой Product.
- **Наш пакет увиден корректно.** C6 §17/§24 на 21:48:28Z уже фиксирует `0b6 = ce2d24fecaf6` (21:45:59Z, +71 / −14) и цитирует наш §19 про чужую трактовку «продолжай». Прежний stale-упрёк из §19.3 (`dc4b2a9de`, «wave-10 последний коммит») внешним агентом снят, но историческая запись §19 не переписывается. C6 явно не принимает трактовку «продолжай» как инструкцию переписывать русскую прозу и не вводит новые строки MASTER.

Для нас это внешняя инвентаризация и самокоррекция счётчика, а не owner/browser/ALT/live-release witness: `AAQ-A-095`…`099`, G1-замена, пересчёт минут чтения и «99 строк» в C1–C24/CSV/MASTER не переносятся.

### 20.3 A33 `0f78fa12` — глоссарий, «Коротко» и ещё один moving-head

`compare/4e6a3ed8…...0f78fa12…` = `ahead 1`, коммит `0f78fa12` / 22:06:50Z, один новый файл `_coordination/arena-agent-2026-11-09/READING_KOROTKO_AND_GLOSSARY.md` (148 строк / 10 431 B, sha256 `e3fbbb28dd8d…`), прочитан по immutable SHA. Это третий дрейф a33 после §19 (`aad5645 → 7baa3d0 → 4e6a3ed8 → 0f78fa12`). C6 §17/§24 на 21:48:28Z ещё называл a33 `4e6a3ed8`: ещё один snapshot race, не конфликт содержимого.

Документ: по S17 «Коротко» из 4 баптистских статей (в трёх формально 3 пункта, содержательно 5; в `spravochnik` резюме описывает страницу, а не содержание — реальный дефект); `gterm`/`gtip` вклинивают определение в середину предложения, **29 файлов / 54 случая**, худший `steven-lawson-samoobman…` — 12; предлагается новая строка `GBS-GLOSSARY-TEXT-INTERLEAVE` с приоритетом P1 и три варианта правки A/B/C (`aria-describedby`, перенос подсказки в конец, отдельный глоссарий).

Ограничения зафиксированы самим a33 в §4: вручную просмотрены **4 из 54** случаев; 12 случаев в `steven-lawson` другого рода; `article:qa` не прогонялся (`node_modules` нет); правила «текст должен читаться без подсказок» в `docs/` нет; утверждение «TTS читает определение вслух» построено на разметке и **не проверено на живом озвучивании**, сборка не запускалась. Поэтому, как и S58/S59/`G-*`, метрика-3 и `BEFORE_REPAIR.md`, новый чужой `GBS-*` и его P1 в MASTER/CSV/C1–C24 не вводятся. Наша открытая граница TTS voice-switching остаётся `UNPROVEN`; source-level разметка и гипотеза об экстракторе ≠ painted DOM, ≠ Accessibility Tree, ≠ реальный TTS witness. Авторство «ИИ/человек» по-прежнему не определяется.

### 20.4 Product PR #2295 — кандидат в правку Home, не приёмка

Новый открытый PR Product **#2295** `fix/home-visual-integrity-20261110`: head `25a95e1f1c34fdcce781baccca749525c3c65206` / 22:01:17Z, base `96455813477dcb…`, создан 21:49:10Z, обновлён 22:03:12Z, 10 коммитов, **4 файла / +151 / −25**, `review_comments = 0`, `comments = 0`, **не слит**. Это новая 6-я Product-ветка; `main` не сдвинулся, audited anchor `5e2db6f0…` не заменяется.

| Файл | Дельта |
|---|---|
| `src/components/home/HomeSections/Publications.astro` | +61 / −12 |
| `src/components/home/HomeSections/Refutations.astro` | +41 / −10 |
| `scripts/visual-parity-home-refutations-box-model-browser-test.js` | +21 / 0 |
| `scripts/visual-parity-screenshots.js` | +28 / −3 |

Source-level правка адресует три находки §17.4: вместо 224px/absolute shell — intrinsic-height карточки и 3-строчные абстракты, контраст light/dark для лейблов и описаний, «Два больших проекта…» → «Биографии, исследование Нагорной проповеди и трудных вопросов веры…», третий featured-проект и три строки mobile-заголовков, усиленный browser-contract для 1440/390/320 px. Shared `css/home.css` в финальном diff не меняется.

PR body сам фиксирует границу: BEFORE-скриншоты — тот же Actions run `#42688110576` из §17.4; временный **branch-only CI handoff** в `scripts/visual-parity-screenshots.js`снимает локальный `dist/` и должен быть удалён перед финальным merge; «built-candidate screenshots do **not** prove deployed production bytes or owner visual signoff». `gh pr checks 2295` на 22:07Z смешанный: pass у `Bible App — chromium deep clicks`, `webkit deep clicks`, `pixel-diff`, `Browser contract`, `Source contract`, `guard` и др.; **pending** у `contract`, `a4-paper`, `Home Chromium WebKit contract`, `Build and audit production-like candidate`, `production-like-contract`, `Chromium + WebKit full-site menu contract`, `Search combobox…`. Ни зелёные, ни ожидающие проверки не дают owner visual signoff, byte equality выкладки, normal-motion/forced-colors/keyboard, канонического WebKit/Firefox full interactive или terminal ZERO.

Решение узкое: PR #2295 фиксируется как чужой открытый кандидат. Он **не** закрывает `HOME-FEATURED-INTRO-COUNT-DRIFT`, `HOME-REFUTATIONS-CARD-HEIGHT-RISK`, `HOME-ODD-CARD-GRID-RHYTHM`, **не** добавляет строки MASTER и **не** меняет 17 HARD / 64 TRIGGER. Правку русской прозы Home делал другой агент; наш preservation boundary («не менять Product», «не авто-переписывать русскую прозу») не нарушался. В §17.4 ничего не переписывается.

### 20.5 Канонические blob’ы, Drive и коллизии

AuditRepo `main` `6a1115e6…` не менялся; повторная сверка канонических путей под `projects/gb-is-my-strength/`:

| Документ | Размер | Git blob | Проверка |
|---|---|---|---|
| `verified/MASTER_BUG_MATRIX.md` | 174 311 B | `d168bc8cd4d6…` | `GBS-PRINT-TERMINAL-REGION-HIDES-CONTENT` и «46 active work units» = 2 маркера; строка не снята |
| `WORK_QUEUE.md` | 20 896 B | `e66b6086ea21…` | без изменений |
| `prototype/grok-desktop-reader/OWNER-VISUAL-ACCEPTANCE-2026-11-07.md` | 14 871 B | `202d4362fd5a…` | визуальная приёмка по-прежнему открыта |

`google_drive` снова только read-only: `search_files` по `modifiedTime > '2026-11-09T21:40:00' and trashed = false` дал **0** файлов; записей, загрузок, комментариев и новых владельческих стандартов нет. Ценз 26+6 деревьев (§20.1) — `truncated:false`, 0 collisions.

### 20.6 Границы и вердикт

**Чего волна 13 НЕ добавляет:** нового `npm ci`/build/`dist`/browser/runtime прогона, нашего собственного painted DOM/AX/TTS witness, owner visual signoff, normal-motion/forced-colors/keyboard/WebKit, канонического WebKit/Firefox interactive, PDF/print-parity, внешней corroboration/rights/edition, живого published HTML/rail/аккордеон/prev-next для 111 маршрутов и 24 книжных страниц, закрытия активных MASTER-строк. `OWNER_APPROVED=true`, baseline update, новые MASTER/ADMIT/универсальные guard’ы, style-only вывод «ИИ/человек», Product-правки и terminal ZERO не применялись. Зелёные/ожидающие checks #2295, `???`=0, Home PNG, `pixel-diff`, `gterm`/`gtip`-разметка, Drive L2/funnel, c6 pass-14, a33 P0–P3/S55–S59/`G-*`/`GBS-GLOSSARY-TEXT-INTERLEAVE` и чужие невлитые owner/print docs редакционную проверку не заменяют.

Вердикт §18 остаётся **`PRELIMINARY / PARTIAL`**: как рабочий пакет и протокол границ — пригоден; как финальная приёмка, перенос в `verified/` или закрытие MASTER — нет. 17 HARD = `FAIL`, остальное = `UNPROVEN` до owner/browser/ALT/live-release witness; полный список незакрытого см. §18.5. Ручные lane C1/C2/C11/C12/C13 остаются bounded triage.

**Ветки/пуш.** Волна 13 меняет только существующий `REPORT.md`; CSV, audited anchor, proof state и MASTER не меняются. `git diff --check`, обычный commit/push только в `arena/0b6f34f6-auditrepo`, без переключения/переименования ветки, без merge/close PR и без правок Product. A33 и lane-ветки могут сдвинуться снова после 22:09Z; раздел фиксирует bounded-окно и не объявляет авто-обновление чужих голов.
