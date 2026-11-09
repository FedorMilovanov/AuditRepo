# Имена Бога v13 — хирургический визуальный аудит

**2026-11-08 · AuditRepo PR #538 · audited code HEAD `bdfde6f07a7f439e85c49629df6d11e34b74c236` · RESEARCH_HOLD / NOT RELEASE-READY**

Evidence: [successful CI with private screenshot artifact](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42507363629), artifact `imena-v13-visual-audit`, 114 JPG + `visual-report.json` (GitHub Actions retention 7 days). V13 `checks/visual_review.cjs` captures browser state and interactions; it is an audit tool, **not** a proof that all inner widgets are unclipped.

## Scope / positive results

- Two apps: Atlas 36 positions; Constellation 29 names/titles.
- Chromium **320/360/375/390/430/768/1024/1440px**, WebKit **320/390/768/1440px**: **24 browser sessions**, **114 screenshots**; 24/24 scripted interactions PASS, no pageerror/resource failures or document-level horizontal overflow.
- Independent local Windows headless Chrome tested 320/390/768/1440. All **36/36** Atlas mobile dossiers opened with correct modal titles; all **29/29** Constellation grid buttons navigated to a name section.
- Existing AuditRepo Validate, Workflow Preflight, and Browser QA were **3/3 SUCCESS on audited code**. This does not certify visual readability.

## Confirmed visual defects — HISTORICAL BASELINE (see resolution addendum)

### P1 — Atlas mobile drawer: catastrophic inner flex overflow for name #36 (320–768px)

Reproduce: Atlas `320px` → floating «Скрижали» → scroll to `№ 36: То Альфа кай то О · Пантократор`.

**Measured:** at 320px, row `scrollWidth=349`, `clientWidth=278` (**+71px**). At 360px +31px, 375px +16px. At 390px document overflow is nearly zero, but **left Russian title width is 0px**, causing one-glyph-per-line text. At 430px left title width ~27px; at 768px it also collapses. Source: `atlas/src/components/LateralNamePillars.tsx` ~631–677; `flex justify-between` row with left `min-w-0` and unbounded `shrink-0` Greek original. Fix via **semantic responsive flex-wrap**, a reasonable minimum width for meaning/title, constrain right original to available space and wrap full Greek words. Do not hide/clamp text or hardcode item #36.

### P1 — Atlas dossier #36: Greek name clipped on narrow modal

At 320px the original title has `scrollWidth=249`, `clientWidth=204` (**+45px**), at 360px +5px. The visible word `Παντοκράτωρ` is cut. Source `atlas/src/components/DivineNameModal.tsx` ~391–401; large `text-4xl` Greek original lacks safe wrapping/size constraints. Make text fully readable at 320/360 without clipping, do not simply set overflow hidden.

### P1 — Constellation: almost-empty initial screen with normal-motion user setting

Independent current-build Chromium mobile 390px observation: H1 `ИМЕНА БОГА` opacity **0% ~0.5s**, **~5% ~1.0s**, **~95% ~1.7s**, fully stable by ~3s. It looks like a bare Sinai landscape on initial paint. Source `sozvezdie/src/components/Hero.tsx`, `motion.h1` `opacity:0` + `delay:0.75`, `duration:1.5`. Render primary content readable from first paint, preserve cinematic decoration on noncritical layers. Test default and OS reduced motion.

### P2 — Atlas mobile floating ribbon truncates status at 320px

Observed label `ЯВЛЕНО 2 ИЗ 36 ИМЁ` cropped before the final character. Source `LateralNamePillars.tsx` ~514–563, nested `truncate` within space constrained by «Скрижали». Use a complete compact counter (e.g. `Открыто 2/36`) on narrow phones; keep long name discoverable in the open drawer. The ribbon covers ~62px at the bottom while reading; verify safe-area, readability near footer and scrolling.

### P2 — Constellation 29-card grid tiny captions / poor perceived contrast

Source `sozvezdie/src/components/NameGrid.tsx` ~292–339: transliterations `text-[8px]` mobile and `sm:text-[9px]`; other labels 8px. On mobile screenshots 320–390 these are difficult to read. Increase typographic hierarchy/contrast without sacrificing responsive width and RTL Hebrew. **No numerical WCAG contrast assertion yet**; perform real contrast measurement before claiming a standards failure.

### P2 — Atlas lateral desktop action controls too small

At 1024/1440px, measured «Разбор →» and «К тексту» buttons ~**43–47 × 15px**, illuminate-all ~52×21. Increase hit areas and test accessibility/spacing; these may qualify for WCAG 2.5.8 spacing exceptions, so do not claim an automatic compliance failure.

## Regression acceptance

1. For item #36 at 320/360/375/390/430/768, the **button and individual title/original** remain within bounds; Russian title cannot collapse to 0px; no missing Greek characters.
2. Dossier original at 320/360 must wrap and stay readable; focus, close, and Escape still work.
3. Capture **early timeline** screenshots of Hero under normal motion and reduced motion. Heading available at first meaningful render, no blank title window.
4. Mobile counter 320px fully readable; focus targets and footer unobstructed.
5. Improve 29-grid caption readability and desktop side-rail hit areas; verify in Chromium and WebKit with screenshot diffs.
6. 3/3 code CI plus fresh verified screenshots on **final HEAD**, not green CI alone.

## Out of scope / release HOLD

The owner-selected white-background fire-letter cover and earlier black-ink cover remain separate unintegrated editorial assets, not the current prototype hero. Research #379 retains `publicationState=BLOCKED` / **0 Product-approved units**; Sinai image rights, actual iOS/Android devices and Product Astro integration remain outstanding. Do **not** merge Draft PR #538, switch prototype SEO from `noindex`, or publish at gospod-bog.ru based only on this audit.

Only the screenshot audit harness and report were committed here; **none of the listed visual source defects has been concealed or waived**.

## Контрольное дополнение 2026-11-09 — разрешение прежних P1/P2 на exact HEAD

**Это дополнение не переписывает исходный отчёт:** значения «NOT CLOSED» выше относятся к прежнему зафиксированному `bdfde6f`. Текущий проверенный исходный коммит — [`c5d12b8d73ef76d62ad6fd27bf75b6ff8f70f70d`](https://github.com/FedorMilovanov/AuditRepo/commit/c5d12b8d73ef76d62ad6fd27bf75b6ff8f70f70d); он прошёл [Browser QA #42524124908](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42524124908), [Validate #42524124927](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42524124927) и [Preflight #42524124909](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42524124909) — **3/3 SUCCESS**.

Разобран точный artifact `imena-v13-visual-audit` [#13635290913](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42524124908/artifacts/13635290913): **24 сессии / 138 JPG / 162 диагностических записи / 0 findings**; `visual-report.json.head` совпадает с `c5d12b8`, а `checkoutMergeSha` относится к отдельному merge-checkout и **не** подменяет HEAD PR. Функциональный набор Созвездия: **133/133 PASS**. Архив GitHub имеет ограниченное время хранения: ссылки — не вечное хранилище свидетельств.

| Исходная находка старого SHA | Подтверждение на `c5d12b8` | Статус |
| --- | --- | --- |
| Atlas #36: схлопывание заголовка в скрижалях | Исправлена общая переносимая компоновка; геометрический контракт всех 36 карточек и ручной просмотр выбранных кадров | **CLOSED — browser-contract scope** |
| Atlas #36: обрезка греческого имени в досье | Проверены длинные оригинальные формы на 320/390 и адаптивные досье; кадры Chromium/WebKit | **CLOSED — browser-contract scope** |
| Sozvezdie: невидимый H1 при первом показе | В текущем `Hero.tsx` H1 задан с `initial={false}`; последние hero-кадры видимы, без старого отложенного скрытия заголовка | **CLOSED — source + captured render** |
| Atlas: обрезанный мобильный счётчик | Постоянная нижняя панель теперь компактна; длинное полное имя доступно в «Скрижалях»; проверки имени №32 и высоты панели выполнены | **CLOSED — browser-contract scope** |
| Sozvezdie: мелкий текст каталога | Подписи увеличены; проверены все 29 оригинальных/транслитерированных подписей на четырёх ширинах | **CLOSED — browser-contract scope** |
| Atlas: небольшие зоны ссылок/управления | Увеличены и проверены геометрические цели; скрытые элементы не считаются видимыми кликабельными ссылками | **CLOSED — browser-contract scope** |

**Что это не доказывает:** реальный Safari/iOS или Android, полную экспертную оценку WCAG, права и точность научных формулировок, production LCP/INP. Не переносить статус `CLOSED` на эти независимые гейты и не объявлять весь проект завершённым.

### Sinai asset: фиксированный состав, но не подтверждённые права

- Активный прототип содержит `sinai-dawn-CyetHa7v.jpg` (**1672×941**, **216480 байт**, SHA-256 `e3fc3113302f78d89ae9d1998bca0474ec2f300e4cfa140c75e6240aa56e9fec`) и производный `sinai-dawn-DMmukO0D.webp` (**1672×941**, **140842 байт**, SHA-256 `738437c0e6a36c406144660d5ff60eff6a01965fc4fd8b7f1bf00ce73025958b`). Извлечены из exact-head preview-артефакта #42524124908; эти хэши относятся к собранным байтам.
- У проверенных файлов нет EXIF, XMP и встроенного поля авторства/лицензии. **Отсутствие метаданных не является доказательством, что снимок свободен от прав.** Текущий provenance: Arena export; исходный автор, URL, license grant и разрешение на производные **не подтверждены**.
- Возможный открытый резерв для отдельной художественной примерки: [`'SUNRISE' over Mt Sinai Mountains(Egypt).JPG`](https://commons.wikimedia.org/wiki/File:%27SUNRISE%27_over_Mt_Sinai_Mountains(Egypt).JPG), автор Rudolph.A.furtado, заявлен public-domain release на странице Commons. Альтернативный [Sunrise on Mount Sinai - Egypt](https://commons.wikimedia.org/wiki/File:Sunrise_on_Mount_Sinai_-_Egypt.jpg), Ibrahim El-Mezayen, CC BY-SA 4.0 с атрибуцией/share-alike. Это **не** доказательства прав на текущий Arena JPEG и **не** решение заменить визуал без отдельной дизайн-приёмки. Изображения не импортировались.

### Независимый Research и реальное устройство — по-прежнему HOLD

[Research #379](https://github.com/FedorMilovanov/Research/pull/379) на `ba6c3c1d913ca088cc6b9190587e27db56e22b3e`: **6/6** GitHub workflow SUCCESS; **105/105** исследовательских употреблений имеют структурные claim-связи, но **0** завершённых критических колляций, **0** независимых научных публикационных допусков и **0** Product approvals. Research остаётся Draft / `RESEARCH_HOLD`. Windows preview `DESKTOP-O3FDOA4` недоступен на момент проверки 2026-11-09 (Offline); физическая iOS/Android приёмка **не выполнялась**. Ни один из этих блокеров не снят.

**Правило дальнейшей работы:** только один кандидат `candidates/v13` в том же Draft PR; никаких новых веток/версий и никакого изменения Product/`main`. Документационный коммит после `c5d12b8` требует собственного CI при проверке нового HEAD, даже если не меняет исходники приложения.
