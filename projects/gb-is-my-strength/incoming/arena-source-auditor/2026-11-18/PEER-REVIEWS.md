# Перекрёстное ревью источников и редакционной приёмки — 18–20.11.2026 UTC

К [источниковому проходу XI–XXXII](KESTON-AND-TOKMAK-HOLDINGS.md). Оценки относятся к названным файлам и проверкам, не заменяют решение MASTER и не являются допуском публикации. Изменений в чужих файлах и ветках нет.

| PR и актуальный срез | Предметная оценка | Доставка |
| --- | --- | --- |
| [AuditRepo #562](https://github.com/FedorMilovanov/AuditRepo/pull/562), `0238de9371ee85a09cf177658d8f08af818e458b` | **PASS** для одного повторно проверенного маршрута «Подпольная печать»; системный редакционный root остаётся OPEN. | [Комментарий в PR](https://github.com/FedorMilovanov/AuditRepo/pull/562#issuecomment-6989185046). |
| [Research #584](https://github.com/FedorMilovanov/Research/pull/584), `643c3325` (`§31`, от `54edd7aa` через 18 коммитов) | **PASS** по `render_closures_summary`, `audit_register_claims` (52: 51 `match` / 1 `superseded`), `audit_relative_links` (`2885 / 5966 / 58`), `publication_gate_status` (`PROMOTE 0`) и 43 целевым тестам; открытые остатки — `measuredAt` для исторических чисел в прозе закрытий и `-o` внутри дерева. Hosted: **7/7 success**, `MERGEABLE/BEHIND` (из-за `main` `ac3825b6`). | Зафиксировано в этом intake (`Research` без записи). |
| [Research #585](https://github.com/FedorMilovanov/Research/pull/585), `5ec61f50` (draft) | **PASS** для визуального чтения №44 PDF с. 3–5, квалификации главы 19 и поправки о получателе материалов по делу Моисеева («в Совет» по №9 PDF 3–4); **HOLD / PROBATION** для интеграции: конфликт по `atonement`, **0 check-runs**, `CONFLICTING/DIRTY`. | Зафиксировано в этом intake (`Research` без записи). |

## AuditRepo #562 — что действительно выводит глава

В diff — одна строка `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT` MASTER, без закрытия root. В Product `9edef94ece08012223c1364bec7ddcd561cf5713` сверены байты трёх объектов: [маршрут `index.astro`](https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/pages/baptisty-rossii/podpolnaya-pechat/index.astro#L3) (`dea2a9a…`) монтирует [Body.astro](https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/baptisty-rossii/BaptistyRossiiPodpolnayaPechatBody.astro#L87) (`e39f79a…`); [одноимённый MDX](https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/content/articles/podpolnaya-pechat.mdx) (`6b03463…`) не рендерится. На [live](https://gospod-bog.ru/baptisty-rossii/podpolnaya-pechat/?editorial=source-pass-xi-20261118T1921Z) Pages `44313404255/1` видны прежние строки об «М. Алексеевой» и «1982 — Токмак». Чинить нужно опубликованный Body и проверять на новом release, а не заменять старый MDX.

## Research #585 — визуальная сверка №44 и конфликт производных

**Прочитанный носитель.** Git blob `66f54198e369f836387a18b40c203468c662a4eb`: **1 171 788 байт**, **87 PDF-страниц**, SHA-256 `79e9fab61164ffd2c881ac641402e8b8bd9806bad8cf9b1360aa8b35568ce55c` (совпадает с `SOURCE_CUSTODY_MANIFEST.json`), метаданные PDF — InDesign 2015/2016 (современное переиздание, не оригинал 1977 г.). В рендере PyMuPDF 1.26.6 прочитаны **PDF-страницы 6–8 (с. 3–5 вёрстки)**:

- с. 3, п. 1: Совет просит о медобследовании и восстановлении переписки Винса (подозрение, не диагноз);
- с. 4, п. 4: ходатайство за четырёх работников издательства под следствием; далее «Радостное сообщение»;
- с. 5: после даты и подписи Совета — примечание о письмах конца июля.

**Редактору.** В `14/P18` и абзаце о Токмаке в 159 разграничивать город обыска/арестов и место суда: по [источниковой цепочке XI](evidence/keston-and-tokmak-holdings-evidence.md#токмак-в-бюллетенях-102-и-106) Бюл. №102 (п. 7) даёт арест 13.02.1982, №106 («Осуждены», п. 1) — приговор 08.06.1982 в Токмаке, №139 (п. 4) — освобождение 13.02.1987 (расчётное `Release` в CMU не заменяет справку). Не переносить иссыкский станок/30 000 Библий 1984 г. и статьи УК КазССР на Кинаса. У `14/P20` оставить `ATTRIBUTED ESTIMATE`, уточнить **Л. М. Алексеева**, не складывать её оценку 1983 г. с цифрами ВИ №3–4 (1976).

**Интеграционный конфликт.** На ранних и текущих HEAD `#585` остаётся `CONFLICTING/DIRTY` относительно `main` (первоначальный сухой `diff3` дал конфликтные блоки в `18_SERIES_AUDIT_AND_ARCS_2026-10-26.md` и `data/atonement-corpus-v1.json`); слияние требует совмещения авторских правок и пересчёта производных.

## Дополнение XII — 18.11.2026 UTC

На стартовом HEAD `#584` `54edd7aa` локально воспроизводился сбой `validate_atonement_corpus_integrity.py` (236 строк в реестре против 237 при обходе — пропущена запись `СР@07_DRIVE_LIBRARY_AND_RIGHTS_LEDGER~2`). На следующих коммитах `1a10c8d3` и `7f02d267` сбой был устранён; live-срез Product на `9edef94e…` сохранял прежние формулировки в «Подпольной печати».

## Дополнение XIII — 18.11.2026 UTC

Контрольный срез API по `#584` (`7f02d267`, 7/7 checks), `#585` (`9d0fe59c`, draft `dirty`) и `#562` (`0238de93`). По [колляции XIII](evidence/keston-and-tokmak-holdings-evidence.md#xiii-иссык-и-цепочка-заметки) зафиксировано разграничение токмакского (1982) и иссыкского (1984–1985) сюжетов для `14/P18` и главы 19.

## Дополнение XIV — 18.11.2026 UTC

На `#584` (`5ba4526b`) начато внедрение детерминированной генерации таблиц `twins` и `stamps`; на `#585` (`4697a0a3`) изменения касались только `SUNO_HYMNS/`, блоги баптистских файлов не менялись.

## Дополнение XV — 19.11.2026 UTC

На `#584` (`f1563a3e`) воспроизведена таблица `twins` (44 пары, `identical-text: 3`, `near-identical: 1`, `superset: 2`, `shared-text: 6`). В [свидетельствах XV](evidence/keston-and-tokmak-holdings-evidence.md#xv-список-в-приложении-к-слушаниям) прослежена запись Кинаса в приложении к слушаниям Конгресса 30.07.1986.

## Дополнение XVI — 19.11.2026 UTC

На `#584` (`60d1ef85` → `66296ca7`) зафиксировано замечание к §18 (`external` в 11 строках без `match` по локальной классификации); `#585` (`e2d7f0a0`) оставался `dirty` без check-runs.

## Дополнение XVII — 19.11.2026 UTC

На `#584` (`aa76b6cb` → `33e32959` → `93a0c340`) воспроизведены `audit(root, snapshot)` по 92 строкам Drive-леджера (в т. ч. 4 объекта wave40 только по размеру до исправления в XVIII) и подтверждено расхождение [Иссык 1976–1978](evidence/keston-and-tokmak-holdings-evidence.md#xvii-иссык-19761978) и процесса 1985 г.

## Дополнение XVIII — 19.11.2026 UTC

На `#584` (`4198b502`) четыре объекта wave40 (`CHARNOCK_FULL_BOUNDED_RESEARCH_wave40_2026-10-26.zip` и сопутствующие файлы) дополнены полными SHA-256 и подтверждены по метаданным Google Drive API (0 расхождений по 88 `md5+size` и 4 `sha256+size`). **Незакрытое методологическое замечание:** live `modifiedTime` в снимке не сохраняется и само по себе не доказывает отсутствия более ранних ревизий.

## Дополнение XIX — 19.11.2026 UTC

На `#584` (`78a683aebc4c856842784a4eb5f90bf5bece2191`) введён `audit_register_claims.py` (32/32 `match` по отчёту); при контроле на временных копиях зафиксировано, что `unlabelled-partial` и сводный итог таблицы §14 не проверяются скриптом, а JSON-отчёт в workflow проверяется через `--check` без побайтного сравнения.

## Дополнение XX — 19.11.2026 UTC

### Research #584: ED‑06 и машинный инвентарь

На `349cbc02` выделен вклад `ED‑06` (+2 `PUBLICATION_HOLD`, +1 `RIGHTS_HOLD`, `open`) и исключение управляющих артефактов из подсчёта. На следующем HEAD `97648ad8` (38 утверждений: 36 `match`, 2 `superseded`) в прозе §21 проверена граница проверки `superseded` (`audit_register_claims.py` ищет подстроку после утверждения, не сверяет исторический знаменатель без привязки к исходному снимку). [Архивная часть XX](evidence/keston-and-tokmak-holdings-evidence.md#дополнение-xx--19112026-utc).

## Дополнение XXI — 19.11.2026 UTC

На `#584` (`6c6a9a03`) воспроизведён пересчёт §8 по `audit_relative_links.py --strict` (**2416** Markdown, `2861 resolves / 5984 external / 58 missing`, 0 необъяснённых, SHA-256 JSON `77ba2e80…`); показано, что 58 `missing` — учтённые исключения, а не «58 починено».

## Дополнение XXII

### XXII: Research #584 — перепись якорей

На `5c3a0a12` → `6173b5c2` перепроверен `audit_relative_links` (`unexplained=0`); зафиксировано, что локальный пересчёт `--strict` не проверяет внешние HTTP-ссылки (5984 `external`). На `#585` (`b0a08441` → `1c61c282`) баптистские файлы не менялись.

## XXIII: Research #584 и инвентарь preview

На `959bd083` (`§23`) проверено совпадение дерева PR и merge-preview, а также 17 закреплённых GitHub-локаторов без изменений прозы [архивной части XXIII](evidence/keston-and-tokmak-holdings-evidence.md#дополнение-xxiii).

## XXIV: Research #584 — снимки и триггеры CI

На `0c621d33` воспроизведена проверка 50 trigger-путей в `audit_ci_triggers.py` (14 скриптов); баптистские файлы в [XXIV](evidence/keston-and-tokmak-holdings-evidence.md#дополнение-xxiv) не затронуты.

## XXV: Research #584 — контроль метаданных

На `2eae3eaa` в `#584` исправлена согласованность метаданных реестра и снимка очереди; [архивная часть XXV](evidence/keston-and-tokmak-holdings-evidence.md#дополнение-xxv) велась независимо.

## XXVI: Research #584 — повторная проверка очереди

**По `#584` (`20a635e9` → `292510f6`, §26):** воспроизведён `publication_gate_status.py` (**6 BLOCKED / 4 REFERENCE / 0 PROMOTE**), проверены **17 локаторов / 19 вхождений** и 14 тестовых групп (**235 тестов PASS**). Выявлен дефект: при передаче нестандартного `-o` внутри дерева файл попадает в текстовый обход на следующем прогоне, что переворачивает справочный флаг (`false → true`); кроме того, `verify_pinned_github_locators.py` учитывает множества `(file, line)` без кратности на одной строке.

**По `#585` (комментарий о двух локаторах главы 19 и official core):**
- Toronto (прим. 5 альтернативной рукописи): URL уже присутствует в прим. 4 главы 19 на `main` и `#585` (строка 162) и в досье 14 (строка 199); карточка №44 даёт 88 с. против 87 с. рабочего PDF.
- Baylor/TARO (прим. 6): в `KC.29` Series 2, **box 24 / folder 18 — №44 (1977)** и **folder 19 — Extra copies** — полезно как указатель папок в аппарате.
- Official core: три пары commit + SHA-256 (`STEPBible Data`, `morphhb`, `SBLGNT`) уже построчно зафиксированы в `TOTAL_SOURCE_AUDIT_CLOSEOUT_2026-07-30.md` (строки 60–62).

## XXVII: Research #584 — §27 и hosted-гейт

В [§27][r584-s27-xxvii] владелец подтвердил и устранил самоподтверждение оверлеев и канонического снимка в `identifier_index` (`indexExcluded`, schema 2, `PROMOTE=0`, шесть чисел §10 подключены к снимку очереди); на `292510f6` hosted CI прошёл **7/7 success** (`mergeable: clean`, без check-runs на preview).

**Остаток, не закрытый §27:** передача нестандартного пути `-o`/`--snapshot` внутрь дерева в `indexExcluded` не входит.

[r584-s27-xxvii]: https://github.com/FedorMilovanov/Research/pull/584#issuecomment-7039347586

## XXVIII: Research #584 — §28, новый HEAD и hosted

На `d1ea3519` (+339/−92, 8 файлов; дерево `3195/3195` blob сверено с `git/trees?recursive=1`) проверено:
- заголовки подтверждений переведены на поле `counters` (мутации поля/типа/пути дают exit 2);
- полный `unittest discover -s scripts -p 'test_*.py'` — **1168 OK** (на `292510f` — 1159 OK), причём прямой запуск 4 модулей занижает счёт из-за второго `unittest.main()` в середине файла (`14/18`, `7/13`, `16/21`);
- `audit_relative_links` дал `2861 resolves / 5966 external / 58 missing` (18 внутристраничных якорей переведены из `external`);
- остаток `-o` внутрь дерева подтверждён опытным путём и для `publication_gate_status.py` (`rightsIdsNotRecorded`: `1 → 0`), и для `audit_repository_holds.py` (`filesScanned`: `3118 → 3119`, упоминаний `8957 → 11060 → 11102`);
- по ветке `arena/cf4fa838-research` (`8a8e46c8`): из записей двух общих корпусов по полю `код` в `#584` не потеряно ни одной (`atonement` 237 vs 236, `nt-corpus` 190 vs 191 — лишняя в ветке `11@15_JOHN_11_52_SCATTERED_CHILDREN_EXEGESIS_2026-10-23`).

Детали и таблицы проверок — в [E](evidence/keston-and-tokmak-holdings-evidence.md#xxviii-счётчики-подтверждений-и-контроли).

## XXIX: Research #584 — §29 и генерируемые таблицы

На `1d4f5ffb` (`3195/3195` blob) `--write-twins-table`, `--write-stamps-table` и `--write-all` пересобирают `HOLDS_REGISTER_2026-11-18.md` **побайтно**; `audit_register_claims --summary` даёт 52 утверждения (51 `match` / 1 `superseded`) и 6 табличных срезов `match` (`§2`, `§2.1`, `§8`, `§11`, `§15`, `§16`), полный `unittest discover` — **1170 OK**. (Отмеченное разночтение в прозе §29.2 «четыре… пять» позднее перекрыто следующими правками.)

## XXIX: Research #585 — объём №44 и неизменность рукописи

На `5a0476f5` (3 файла, +46/−2: досье 14, 15, 16) рукопись главы 19 (`8f6922ec19`), `PROOF_STATUS_LEDGER.csv` и `SOURCE_ANCHORS.csv` не менялись (`biulleten_sru_1977_44` сохраняет `88`, две копии Baylor/Keston — по `88`, т. е. 88/87 не сглажено догадкой). Blob рабочего PDF `66f54198` (1 171 788 Б, SHA-256 `79e9fab6…`) содержит **87** маркеров `/Type /Page`; якоря `working-pdf-scope` (досье 16:74), `copy44-catalog-boundary` (досье 14:224) и открытый статус FIG-02 (досье 15:74) присутствуют.

## XXX: Research #584 и #585 — новых материалов нет

На срезе `1d4f5ffb` (`#584`, 7/7 success, `clean`) и `5a0476f5` (`#585`, 0 check-runs, draft `dirty`) новых коммитов, ревью или inline-комментариев не поступало.

## XXXI: Research #584 — §30 (генерация §3) и живые числа против исторических

[§30][r584-s30-xxxi], HEAD `b2b95e43` (+207/−82 в 6 файлах): таблица §3 в `HOLDS_REGISTER_2026-11-18.md` больше не ручная копия — её генерирует `render_detail()` в `scripts/render_closures_summary.py` из `data/hold-closure-registry-v1.json` (26 строк вместо 18). `render_closures_summary.py --write` пересобирает файл **побайтно**; `audit_register_claims.py --summary` — 52 (51 `match`, 1 `superseded`), все 6 таблиц `match`; `audit_relative_links.py --strict` — `2883 / 5966 / 58` (`unexplained=0`); полный `unittest discover` — **1172 OK**. Подтверждён вопрос §30 о смешении времён: у записи №18 в §3 напечатано историческое `resolves 2 861, external 5 984`, тогда как живой срез в §8 на том же HEAD даёт **`2883 / 5966`** (аналогично `2 407` файлов у №07 против `2 416`). Hosted: **7/7 success**, `MERGEABLE/CLEAN`.

## XXXI: Research #585 — квалификация главы 19 и проверка Drive

[7047238629][r585-ch19-xxxi], HEAD `d4ba9347` (+39/−7 в 2 файлах из 3139 — рукопись главы 19 `a1cf053c2d…` и досье 16 `e8054ccb27…`; остальные 3137 файлов неизменны): сильные формулы о «непосредственном подтверждении экземпляром» перенесены под `HISTORICAL / SUPERSEDED` и заменены квалификацией современной рабочей передачи PDF №44 (примечания 1/5/9); в досье 16 добавлен `#historical-copy-request`. Контрольный read-only поиск в Google Drive по условиям `#585` дал ровно 12 записей метаданных без исторического №44. Все 4 профильных валидатора (`validate_research_root_authority.py`, `validate_repository_authority_integrity.py`, `validate_baptist_acquisition_authority.py`, `validate_baptist_derivative_transcriptions.py`) — exit 0.

[r584-s30-xxxi]: https://github.com/FedorMilovanov/Research/pull/584#issuecomment-7047321537
[r585-ch19-xxxi]: https://github.com/FedorMilovanov/Research/pull/585#issuecomment-7047238629

## XXXII: Research #584 — §31 (удаление самосчётов) и main ac3825b6

[§31][r584-s31-xxxii], HEAD `643c3325` (parent `b2b95e43`, 6 файлов, +179/−70). Из `objects` записей `data/hold-closure-registry-v1.json` удалены пять самосчётов инструмента (`claims`, `triggerPaths`, `openItems`, `confirmations`, `closures`), из которых `claims` (46 при 52) и `triggerPaths` (49 при 50) уже разошлись, а из прозы `HOLDS_REGISTER_2026-11-18.md` (§21.2, §24 и запись 17) убраны ручные счётчики утверждений.

**Проверено в локальном клоне на `643c3325` (`--depth=5`):**
- `data/hold-closure-registry-v1.json` содержит **27** записей, блок `closures-detail` в `HOLDS_REGISTER_2026-11-18.md` — **27** строк; в `objects` записей нет ни одного из пяти удалённых ключей;
- `render_closures_summary.py --check`, `audit_register_claims.py --summary` (52 утверждения: 51 `match`, 1 `superseded`, все 6 таблиц `match`), `audit_ci_triggers.py --check` (50 путей, 14 скриптов), `publication_gate_status.py --check` (`PROMOTE 0`) и `validate_repository_authority_integrity.py` — exit 0;
- `audit_relative_links.py --strict` — exit 0 (`resolves=2885`, `external=5966`, `missing=58` объяснены, `unexplained=0`), `-o` пересобирает `data/relative-links-audit-2026-11-18.json` **побайтно** (`cmp` 0);
- целевые тесты `test_hold_closure_registry.py` + `test_audit_register_claims.py` — **43 OK** (полный `unittest discover -s scripts` на `--depth=5`: 1163 OK и 12 ожидаемых падений в `test_atonement_sync.py` из-за неглубокой истории).

**Открытый остаток:** исторические измерения внешних объектов в текстах закрытий (`2 407` файлов у №07, `541` склейка у №08) сохранены без формального поля вроде `measuredAt`, а передача нестандартного `-o` внутрь дерева остаётся за пределами `indexExcluded`.

**Hosted:** `643c3325` — **7/7 success**, `MERGEABLE/BEHIND` (из-за `main` `ac3825b6` после #606).

## XXXII: Research #585 — получатель материалов о Моисееве и аномалия messages5.html

[7049892580][r585-moiseev-xxxii], HEAD `5ec61f50` (parent `d4ba9347`, 2 файла из 3139, +58/−4: рукопись главы 19 и досье 16, якоря `#moiseev-materials-recipient` и `#selected-image-self-review`).

**Что изменено и проверено.** В главе 19 по повторному визуальному чтению №9 PDF 3–4 исправлена фактическая ошибка пересказа: Совет сообщает о материалах, поступивших **в Совет** (а не переданных родственниками и членами Совета редакции); скорректирована также атрибуция обвинения и намерение обращения к молодёжи, прежние формулы перенесены под `HISTORICAL / SUPERSEDED`. На `5ec61f50` все четыре профильных валидатора (`validate_research_root_authority.py`, `validate_repository_authority_integrity.py`, `validate_baptist_acquisition_authority.py`, `validate_baptist_derivative_transcriptions.py`) — exit 0.

**Независимая проверка байтовой аномалии `messages5.html` (`1lq6PUIzUy7OPSYovtkusAmz1tmDTwX-Z`).** Метаданные Google Drive API показывают **2 458 080 байт** (`md5 19ee3a5ef5aeb52097f6d0b267295bdf`, `sha256 540fd2b98e2ca2bc082e0274de6a9666a18eebc006384aa8f6463286f82c59ba`). Повторная выгрузка через Drive-коннектор даёт **ровно 2 459 962 байт** (+1 882 байта, 0 CRLF, 0 символов замены UTF-8), **но с другим MD5** — `0fa5fb110a9aeb26858912115e064bef` (`sha256 95e30932…`) против `c9fef43c0671a192a77afbe1328eb43d` (`sha256 8c9d402f…`) в досье 16. Транспорт невоспроизводим побайтно и непригоден для `ACQUIRED_DURABLE`. Внутри 1000 HTML-узлов `message*` проверено: `message4889` и `message5044` — посты канала «Синичкин рассказывает» 2026 года, единственное `1985` — про 43-й съезд ВСЕХБ, упоминаний Вильчинской, Готман, Бублика и `044-1977` — 0.

**Hosted:** `5ec61f50` — **0 check-runs / 0 Actions**, draft OPEN, `CONFLICTING/DIRTY`.

[r584-s31-xxxii]: https://github.com/FedorMilovanov/Research/pull/584#issuecomment-7049829902
[r585-moiseev-xxxii]: https://github.com/FedorMilovanov/Research/pull/585#issuecomment-7049892580
