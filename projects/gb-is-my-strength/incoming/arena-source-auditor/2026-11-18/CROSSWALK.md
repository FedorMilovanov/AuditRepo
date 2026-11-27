# Сводка приёмки и crosswalk пакета `arena-source-auditor` (2026-11-18)

Этот документ фиксирует входную проверку пакета в `projects/gb-is-my-strength/incoming/arena-source-auditor/2026-11-18/` без изменения [активной мастер-матрицы](../../../verified/MASTER_BUG_MATRIX.md), [очереди улучшений](../../../WORK_QUEUE.md), [архива закрытий](../../../legacy/MATRIX_CLEANUP_2026-08-07.md), `Product` или `Research`. Это **не вторая мастер-матрица**: ниже отделены **6 реально актуальных и неснятых пунктов** на действующем Product `main` от уже исправленных, поглощённых существующими строками `MASTER` и исторического/сырого provenance.

---

## 1. Replay, provenance и границы осмотра

- **Закреплённые якоря пакета:** Product `381f8f9613bb968754c2432ed9648cd6e42282a9` ([Pages 44287427833/1](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/44287427833), `REPORT.md`) и `9edef94ece08012223c1364bec7ddcd561cf5713` ([Pages 44313404255/1](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/44313404255), `FOLLOWUP.md`).
- **Сверка с текущим Product `main`:** на 2026-11-21 `main` находится на [`e733dd29f6186801eff9260365eeff8e72d4da0c`](https://github.com/FedorMilovanov/gb-is-my-strength/commit/e733dd29f6186801eff9260365eeff8e72d4da0c) (единственная дельта после `9edef94e` — тестовый PR `#2353`, изменивший только `scripts/interactive-audit.js` и `scripts/search-cold-bootstrap-browser-test.mjs`). Проверено прямое присутствие на `e733dd29` всех нижеперечисленных незакрытых локусов в `GillPart2ArticleBody.astro`, `HermenevtikaBody.astro`, MDX 1 Петра, `KodDaVinchiSection*.astro`, `NagornayaIstochnikiMainShell.astro`, `sourceRegistry.ts` Лоусона, `BaptistyRossii*Body.astro`, `G3Dossier.astro` и `DiotrophesDraft.astro`.
- **Byte / citation provenance и инвентаризация:**
  - [catalog-inventory.tsv](evidence/catalog-inventory.tsv) (80 уникальных карточек / 54 позиций `.parts` в 8 группах) и [followup-browser.json](evidence/followup-browser.json) (`htmlSha256`, замеры 5 ширин viewport, текст цитат и сносок) воспроизводимы от закреплённых сборок; это **evidence-at-anchor**, а не 80 новых дефектов.
  - Проходы III–XXXII (`ARCHIVAL-FOLLOWUP.md` … `KESTON-AND-TOKMAK-HOLDINGS.md`, `evidence/*`) и [PEER-REVIEWS.md](PEER-REVIEWS.md) отделяют фактически прочитанные строки/OCR/IIIF-кадры (включая `messages5.html`, узел `/520` списка Хайнца, «Вестник Истины», слушания CSCE) от непросмотренных фондов и описей. Внесены точечные текстовые поправки (`print-run-tokmak-evidence.md:19`, `keston-and-tokmak-holdings-evidence.md:52,1236,1287`) для сохранения строгих формулировок.
- **Граница осмотра подлинников:** ни один недоступный оригинал или нераскрытый архивный лист в этом пакете не представлен прочитанным. Не просмотрены оригиналы: ГА РФ `Р-5446` (`оп. 105, д. 1375–1377, 1359–1361`) и `Р-6991` (`оп. 6, д. 360–361, 377, 383`), ЦДАВО `ф. 4648, оп. 5, д. 281`, ЛГИА/LVA `д. 166, 356`, ЦГА КР `1-1/16-1`, Чуйское дело Кинаса, «Вестник РХД» № 115 с. 222–223 в рамках текущего повторного чтения (`FOLLOWUP §5`), Крючков с. 480, подлинники OSA/Keston и ноябрьское письмо по делу Лоусона.

---

## 2. Crosswalk к `MASTER_BUG_MATRIX.md`, `WORK_QUEUE.md`, `legacy/` и Product `main` (`e733dd29`)

### А. Ровно 6 реально `current` и неснятых пунктов на Product `main` (`e733dd29`)

| № | Локус пакета | Что подтверждено на `e733dd29` | Связь с `MASTER` / `WORK_QUEUE` / `legacy` | Владелец в Product и пересечения с открытыми PR |
| --- | --- | --- | --- | --- |
| 1 | **`CR-01` · Гилл II** ([REPORT.md](REPORT.md#cr-01-гилл-ii-границы-свода-неверный-локатор-и-противоречие-между-разделами)) | `GillPart2ArticleBody.astro`: `:310` «кн. VII, гл. 14» вместо Book VI, ch. 14; `:469,485–515` счёт глав «156 + Приложение» против фактических `107 + 44 (+ 5)` = `151`/`156` и несоответствующая таблица I–IV; `:609–610` Солтерс-Холл `1719`/`1720` и обобщение о деноминациях. | **Отсутствует** в `MASTER`, `WORK_QUEUE`, `legacy` (`GBS-GILL-PART1-RUSSIAN-COPY-QUALITY` относится к ч. I; print-строки по Гиллу относятся к PDF). | `src/components/article-pilots/gill-part2/GillPart2ArticleBody.astro` (не затронут в `#2348` и `#2346` W57). |
| 2 | **`CR-02` · Чау / Герменевтика** ([REPORT.md](REPORT.md#cr-02-чау-авторский-аргумент-оказался-внутри-всплывающих-сносок)) | `HermenevtikaBody.astro:177,179–180`: основной авторский текст Абнера Чау (*TMSJ* 27/2, с. 135–136: `Longman. Вместо этого… Во-вторых…` и `Напротив, они показывают…`) скрыт внутри `.fn-marker > .tooltip`; `#2318` эти строки не правил. | **Расширяет открытую строку `MASTER`:** [`GBS-HERMENEUTIKA-TRANSLATION-AND-COPY-QUALITY`](../../../verified/MASTER_BUG_MATRIX.md) (требует ручной построчной сверки с *TMSJ* 27/2, pp. 113–139). Новой строки не требует. | `src/components/article-pilots/hermenevtika/HermenevtikaBody.astro` (имеет слот-пересечение в `#2348`; `HermenevtikaPageHead.astro` затронут в `#2346`/`#2348`). |
| 3 | **`CR-03` + `CR-06` + `FOLLOWUP §§1–3` · Библейские цитаты, контекст глоссария «плоть» и шкала «Кода да Винчи»** | `duhi-v-temnice-noi-kreshchenie-pobeda.mdx:49,51,103` (`1 Пет. 3:18`, «Умерщвлённый по плоти»), `blagovestie-mertvym-1-petra-4-5-6.mdx:42` (`1 Пет. 4:6`, «благовествовано… плотью»), `KodDaVinchiSectionChurch.astro:11–17` (`1 Ин. 4:3` «во плоти», `Иуд. 3` «подвизайтесь», сноска Евсевий/Ириней), `KodDaVinchiSectionCanon.astro:12,78,97` + `css/site.css:59` (3 скрытые даты `#canonTimeline` при ≤640 px и деления `.ctw-axis`). `#2308` цитаты и глоссарий не менял. | Вне `MASTER`/`WORK_QUEUE`/`legacy`; по глоссарию соотносится с областью [`GBS-GLOSSARY-CONCEPT-IDENTITY-CONSOLIDATION`](../../../verified/MASTER_BUG_MATRIX.md) без дублирования. | Перечисленные MDX 1 Петра, `KodDaVinchiSection*.astro`, `css/site.css`, `data/glossary.json`. По глоссарию и `css/site.css` учитывать `#2352`/`#2346` и `#2348`. |
| 4 | **`CR-05` + `FOLLOWUP §4` · «Нагорная проповедь»** ([REPORT.md](REPORT.md#cr-05-нагорная-проповедь-обещание-полной-библиографии-не-соответствует-странице-на-которую-оно-ведёт)) | `NagornayaIstochnikiMainShell.astro`: обещание «120+ источников / Полная библиография» при 66 нумерованных записях и дубле Pennington (`№28` L343 = `№64` L738); в строке `[49]` (L575) Chicago Statement 1982 ошибочно указан `Art. XIII` вместо раздела Пакера *Exposition → The Scope of Biblical Interpretation*. | **Отсутствует** в `MASTER`, `WORK_QUEUE`, `legacy` (`NG_DEAD_01` в `legacy/` относится к другому вопросу; исторический `NG-SOURCE-REGISTRY-01` остался в раннем intake 2026-07-22). | `src/components/nagornaya/istochniki/NagornayaIstochnikiMainShell.astro` (не изменён в `#2348`/`#2346`). |
| 5 | **`CR-08` · Лоусон `LAW-41`** ([REPORT.md](REPORT.md#cr-08-law-41-библиография-подтверждает-дату-письмо--только-пересечение-периодов)) | `src/components/article-pilots/lawson/sourceRegistry.ts:337` сохраняет дату `17 Mar 2025` вместо `13.03.2025`; в `.mdx:175,410,896` широкое «на начало отношений» вместо `during some of the time` в письме Джонсона. | Отдельный библиографический остаток **после закрытия** `LAW-\d+` в [`GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK`](../../../verified/MASTER_BUG_MATRIX.md) (по `#2313`); связан только с `verification/2026-11-11-independent-source-audit-wave6.md` (`W6-01–03`). | `sourceRegistry.ts` и `steven-lawson-samoobman-i-publichnyy-golos.mdx` (свободны от пересечений с `#2348`/`#2346`). |
| 6 | **`CR-09` + указ 1905 · «Баптисты России»** ([REPORT.md](REPORT.md#cr-09-баптисты-россии-статус-источника-1971-года-требует-согласования-не-повышения-до-архивного-оригинала)) | `BaptistyRossiiSpravochnikBody.astro:51` («нужен полный текст» от 05.06.1971, «первичку ещё нужно добирать»), `BaptistyRossiiPodpolnayaPechatBody.astro:56`, `BaptistyRossiiGoneniyaISovestBody.astro:38–40` («императорский манифест» вместо указа 17.04.1905). `#2298` **closed unmerged**. | **Отсутствует** в `MASTER`, `WORK_QUEUE`, `legacy` (вне системной строки дат `SYS-EDITORIAL-DATELINE-SLOT-SEMANTICS`, чинимой в `#2348`). См. также §3 ниже. | `src/components/baptisty-rossii/BaptistyRossii*Body.astro` (**пересекаются** с `#2348` по `data-editorial-slot` и с кандидатскими патчами `d608` / `#573`). |

### Б. Что уже поглощено `MASTER`, уже исправлено или является историческим/сырым provenance

- **Поглощены существующими строками `MASTER` (новых багов не открывать):**
  - `CR-04` (текстовые/HTML стыки `доллароввыше`, `Mattersпоявлялась`, «Это позволяют», «21 библиографические записи», а также расхождение `modifiedTime` vs `dateModified` из `FOLLOWUP §6`), `CR-07` (`#buck` привязка `S012`/`S035` без перенесения старого счёта `33/33`) и `CR-10` (`DiotrophesDraft.astro`: 21 основная карточка ведут на общий `#sources`; формулировка `DiotrophesPublishedPage.astro:16`) → относятся к уже открытым [`GBS-JOURNAL-READER-SOURCE-LOCATORS-MISSING`](../../../verified/MASTER_BUG_MATRIX.md) и [`GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK`](../../../verified/MASTER_BUG_MATRIX.md), причём `G3Dossier.astro` перерабатывается в открытом Draft PR `#2338`.
  - Серийные проекции `pastor-series` (`REPORT.md §3`) → относятся к активным [`SYS-SERIES-DISCOVERY-CURRENT-AUTHORITY`](../../../verified/MASTER_BUG_MATRIX.md) и [`SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`](../../../verified/MASTER_BUG_MATRIX.md) (оба в очереди `#2348`).
- **Сверка с `WORK_QUEUE.md` и `legacy/`:** в `WORK_QUEUE.md` находятся только 5 optional улучшений (`GBS-SEARCH-HISTORY-SCHEMA-TOLERANCE`, `GBS-FONT-CACHE-AND-VERSIONING`, `GBS-TYPOGRAPHY-LOCALE-SYNTHESIS`, `GBS-MAP-ARCHAEOLOGY-READABILITY`, `GBS-HERO-IMAGE-HIDPI-SOURCE-CAPACITY`) — `0` пересечений с пунктами 1–6. Пять closure-документов в `legacy/` (август 2026) не затрагивают и не отменяют пункты 1–6.
- **Уже исправлено или устарело (`already fixed / obsolete`):**
  - Заголовок, описание, время чтения (`11 мин`) и обложка G3 в каталоге/манифесте/RSS (`CR-04`) — **закрыто в Product `#2337`** (`9edef94e`, подтверждено и в live).
  - `ED4-01` и служебные формулировки GEN6 по 1 Петра (`CR-06`) — **закрыто в Product `#2308`**.
  - Видимые `LAW-\d+` ключи в прозе Лоусона — **закрыто в Product `#2313`** (`MASTER`: *«The Lawson strand is CLOSED in our remit»*).
  - Точечные правки баптистов и Гилла (Грантам, два МакАртура, дата 29.10.1961, Каргель/1884, оглавление справочника) — **закрыто в `#2328`, `#2331`, `#2334`, `#2335`**.
  - Устаревшая оговорка о пересечении с Product `#2292` — **снято (`#2292` merged как `ba9552dd`)**.
- **Сырой/исторический и архивный слой (`raw/historical`):** `ARCHIVAL-FOLLOWUP.md` … `KESTON-AND-TOKMAK-HOLDINGS.md`, `evidence/*` и `PEER-REVIEWS.md` являются доказательной и поисковой базой с неотправленными черновиками запросов, а не списком новых дефектов `MASTER`.

---

## 3. Статусы источников 1971 года, `#2292` / `#2298` и сопоставление с `d608` (`PR #573`) и `Research #585`

### Состояние PR и строгий статус 1971 года

- Product `#2292` (`ba9552dd`) **merged**; старые отсылки к нему как к блокирующему владельцу неактуальны.
- Product `#2298` (`9807263f`) **closed unmerged**; его текст не является состоянием `Product main`, поэтому формулировки `CR-09` в `BaptistyRossiiSpravochnikBody.astro:51` и `PodpolnayaPechatBody.astro:56` остаются на `main` (`e733dd29`).
- **Разделение доказательности по документам 1971 года** (не повышать перепечатку до подлинника):

| Класс свидетельства | Что подтверждено этим пакетом и `wave2` | Статус / предел |
| --- | --- | --- |
| **Published reproduction / bibliographic witness** | «Вестник РХД» № 1 (115), 1975, печ. с. 222–223 (заявл. 05.06 Косыгину + обращ. 10.06 верующим; в этом проходе повторно проверены обложка и оглавление, не сами листы); «Хроника защиты прав в СССР» № 15, 1975, с. 62 (библиография); Blinken OSA **AS 878** (`HU OSA 300-85-9:21/61`, `05.06.1971`) и **AS 879** (`21/62`, `1971`); фрагмент у Л. М. Алексеевой, прим. 22. | Опубликованная перепечатка и каталожное описание; подтверждает наличие двух разных актов, но **не** вручение заявления, **не** регистрацию издательства и **не** подлинность оригинала. |
| **Original archive / delivery / rights** | Номера дел-кандидатов в ГА РФ (`Р-5446`, `Р-6991`), ЦДАВО (`ф. 4648`), «Мемориал» (`ф. 101, д. 165`) в индексах и описях. | **HOLD (`archival-original-unverified`, `rights-not-adjudicated`)**. До чтения листов и вердикта о правах не снимать оговорки в `Подпольной печати` и не публиковать сканы. |

### Сопоставление с соседним intake `d608` (`AuditRepo PR #573`) и `Research #585`

- **Соседний `AuditRepo PR #573` (`arena/d608fa54-auditrepo`):**
  - **0 пересечений по изменённым файлам** с настоящим пакетом `#572` (44 файла в `incoming/arena-baptisty-1971-witnesses/2026-11-18/` и `incoming/arena-baptisty-editorial-r2/2026-11-18/`).
  - **Предметное согласие и разграничение:** оба пакета независимо разделяют два июньских акта (05.06.1971 на имя Косыгина — `AS 878`, vs 10.06.1971 к верующим — `AS 879`), фиксируют вторичный характер оценки Л. М. Алексеевой [23] (~500 тыс. к 1983 г.), удерживают строгий статус `published-text-found` / `archival-original-unverified` и `HOLD` на права/оригиналы. Дополнительно `d608` приносит визуальную сверку Крючкова с. 466–469 (в т.ч. «карманные Библии» 1966 г. и расхождение «5 июня» vs «5 июля» в OCR «Веры и Жизни» № 4.1975) и два локальных candidate-патча для 6 `Body.astro` (на базе `9edef94e`, без выкладки в Product).
  - Собственный CI-блокер якоря в `d608` (`arena-baptisty-editorial-r2/README.md`) относится только к ветке `d608` и на валидность `#572` не влияет.
- **`Research #585` (голова `35260487d767c38c9709656d343ccf474713128a`, `draft: true`, `mergeable_state: dirty`):**
  - Ревизованные в [PEER-REVIEWS.md](PEER-REVIEWS.md) позиции (включая откат ложной идентификации «тов. Моисеева» с 352-й дивизией в `5ec61f50` и проверку ограничений «рабочего текста» гл. 19) учтены без пересмотра наших `HOLD`.
  - Последующие коммиты `#585` относятся преимущественно к гимнологии (`suno`/`phos`), а последний баптистский коммит `35260487` (уточнение подсчётов гл. 19 по Мадридскому обращению) не снимает наши `HOLD`-границы по 1971 г., Keston и Токмаку.

---

## 4. Границы полномочий, `HOLD` и условия передачи

1. **Evidence-only merge scope:** в `AuditRepo` принимается только этот изолированный пакет в `incoming/arena-source-auditor/2026-11-18/` без автоматического продвижения строк в `MASTER_BUG_MATRIX.md` и без изменения `Product` или `Research`.
2. **Без авто-cherry-pick и снятия `HOLD`:** никакой автоматический перенос правок в `Product` не выполняется; все вопросы безопасности, персональных/архивных рисков (Токмак, дела, «Диотрефы», «Лоусон»), прав на изображения/цитаты (1971, Keston, архивы) и возможного снятия `HOLD` требуют отдельного человеческого **owner verdict**.
3. **Roster:** архивные агенты №7 и №9 к доработке и согласованию не привлекаются; последующая работа по пунктам 1–6 распределяется только между действующими владельцами `Product`/`AuditRepo`/`Research` с учётом пересечений с `#2348`, `#2338`, `#2352` и `#573`.
