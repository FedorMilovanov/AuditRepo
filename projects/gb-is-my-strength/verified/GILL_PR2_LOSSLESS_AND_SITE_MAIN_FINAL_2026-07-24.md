# Джон Гилл — lossless PR №2, route-wide site closure и финальная граница production

**Дата:** 2026-07-24  
**Репозитории:** `FedorMilovanov/Research`, `FedorMilovanov/gb-is-my-strength`, `FedorMilovanov/AuditRepo`  
**Тип документа:** post-closure supplement к `GILL_PRIMARY_SOURCE_AND_PRODUCTION_CLOSURE_2026-07-24.md`  
**Принцип:** `Research/main`, `site/main`, exact-head CI и live Pages — четыре разных уровня доказательства.

---

## 1. Почему понадобилось дополнение

После закрытия старого `Research#2` как superseded выяснилось, что поздние тома 43–73 поглотили многие его выводы, но не сохраняли весь provenance. В старой ветке оставались:

1. полный evidence archive `GILL-CONTENT-001…480`;
2. расширенная версия `AGENT_RULES.md`;
3. старая Gill-навигация;
4. старая master map тома 31.

Следовательно, первоначальная формула «PR №2 полностью поглощён» была слишком сильной. Закрытый PR нельзя было просто вливать поверх современного `main`, потому что это откатило бы актуальные тома и навигацию. Был выполнен lossless recovery: исходные blobs сохранены отдельно, а современные владельцы выводов оставлены приоритетными.

---

## 2. Byte-for-byte recovery старого Research PR №2

### Слитый recovery

- `Research#13`;
- merge commit: `39b297d7392343a69b6b9f3532649c89311c77e9`.

### Восстановленные исходные blobs

| Объект | Blob SHA |
|---|---|
| `GILL_SERIES_EVIDENCE_ARCHIVE_V1_V11_001_480_2026-07-09.md` | `baa3fccb6f67cd05117b2c4f0342867662a3fce0` |
| `AGENT_RULES_PR2_2026-07-09.md` | `3c9fc503839335e37a29e5e7bbf46d1738d44a00` |
| `GILL_README_PR2_2026-07-09.md` | `e59a297ee6bcea6c10c5fd34de5f76b8e7cc78b8` |
| `GILL_MASTER_MAP_PR2_2026-07-09.md` | `dc0fc2de8885e85c58122f142ae0a945a36e6b3b` |

Эти SHA совпадают с файлами старой PR2-ветки. Никакой современный Gill-том не был заменён старой редакцией.

---

## 3. Полная reconciliation-карта 001–480

### Слитый финальный Research PR

- `Research#14`;
- exact head: `ae8f4c42a70cea792bbab21c462b5c1cda47a320`;
- merge commit: `66ee3ef5447d8dfde9df7e615018fbfbe8a27209`;
- final diff: 16 постоянных файлов;
- временные generators, write-workflows, patchers и diagnostic-файлы отсутствуют.

### Том 74

`Джон Гилл/74_PR2_001_480_RECONCILIATION_MATRIX.md` содержит:

- ровно 480 последовательных archive headings;
- ровно 480 matrix rows;
- отсутствие пропусков и дублей ID;
- для каждой карточки: cluster, route-scope, современные owner-тома и production boundary;
- явную категорию `GENERAL` для ручной границы вместо скрытого выпадения карточек;
- site merge и exact-head CI markers;
- честный отдельный gate для live Pages witness.

### Постоянный контракт

Workflow `Gill PR2 Lossless Reconciliation` работает read-only и проверяет:

1. последовательность `001…480` в archive;
2. последовательность `001…480` в матрице;
3. размер archive более 400 KB;
4. исходный archive blob SHA;
5. том 74 в Gill-навигации;
6. site merge/exact-head markers;
7. required supersession/evidence-boundary markers;
8. отсутствие подтверждённых stale P0-фраз.

Exact head `ae8f4c42…` прошёл этот контракт зелёным. Последний параллельный commit другого агента перед merge добавлял только новый файл в `ТРУДНЫЕ ТЕКСТЫ`; пересечения с Gill-файлами не было.

---

## 4. Какие дополнительные потери/ошибки нашла матрица

Повторное чтение архива выявило не только site-debt, но и false-green внутри ранних Research-досье. Исправлены или явно ограничены 12 файлов:

| Том | Закрытая проблема |
|---:|---|
| 01 | три печатных тома vs внутренние 7+4 книги; superlatives; неверное отождествление кафедры Gill с New Park Street/Metropolitan Tabernacle |
| 03 | ранняя архитектура помечена как historical/superseded, а не текущий план |
| 04 | covenant: Book II ch. 7; `Cause` Part IV: патристический материал, не Heywood/divine illumination |
| 06 | девять томов относятся к `Exposition`, не `Body`; offer/duty-faith не закрывается одной защитительной школой |
| 20 | singing terminology согласована с томами 29/64; не заявляется безусловное включение любых NT hymns |
| 25 | Witsius не делегат Westminster Assembly; genealogy не равна confessional consensus; `berit`-этимология исторически ограничена |
| 26 | снят false-green: `dissertationconc00gill` оказался Hebrew Dissertation, а не `Good Works`; исправлена опечатка `мистии` |
| 28 | Woolston causation, Cana, Lazarus, guard и witness claims ограничены уровнем источника |
| 32 | Marrow — сравнительная аналогия, не историческая сеть; London Lyceum понижен до secondary transmission; Baxter/Stinton ограничены; удалена mixed-language corruption |
| 39 | CCEL route labels признаны legacy navigation; title/text govern |
| 40 | то же для Christology routes |
| 42 | то же для Creation/Providence routes |

Эти файлы сохраняются как история исследования, но больше не могут быть прочитаны как неограниченный текущий канон.

---

## 5. Route-wide site closure

### Слитый site PR

- `gb-is-my-strength#192`;
- exact head: `433c76ddd4ee37e9efe8fd4f5fc7573aa8e2a736`;
- merge commit: `877508fbfe42883b99922e3dcc717adfa91c33ad`;
- final diff: 22 постоянных файла, один commit;
- временные patchers/workflows/diagnostics отсутствуют.

### Exact-head green

На `433c76ddd…` успешно прошли:

- `Gill Final Source Reconciliation`;
- `Shared Files Guard`;
- `Overlay Runtime Browser`;
- `Glossary Contract`;
- `Native Source Contract`;
- `Route Registry Validators`;
- `Visual Parity Guard — pixel-diff`.

### Содержательные исправления

Закрыты route-wide долги по:

- биографии, рождению, образованию, обращению и рукоположению;
- пасторской преемственности;
- Gill–Whitefield / Ella narrative;
- Goat Yard Declaration;
- Salters’ Hall;
- Judaica/rabbinic chronology;
- D.D./Whiston;
- Eastcheap 1729–1756;
- Hervey/Crisp/Wesley/Spurgeon quotations;
- Masoretic thesis и современной текстологии;
- eschatological prediction и Kennicott superlatives;
- duty-faith/offer/external call;
- Gillites/Fullerites;
- Practical Divinity volume count;
- Particular Baptist Fund, Brown/Rhode Island и американской рецепции;
- reading-time SSOT `28/32/39/71/54/15`.

Постоянный site workflow запрещает возврат старых формул по всей нативной Gill-серии.

---

## 6. Работа других агентов

Во время финализации `Research/main` неоднократно продвигался новыми материалами по Watchers, Genesis 6 и 1 Peter 3. Каждый новый base delta проверялся по списку файлов.

В PR №14 не вошли изменения этих агентов и не были удалены их commits. Финальный merge включил текущий base, а Gill PR менял только 16 собственных постоянных файлов.

AuditRepo PR №35 уже был слит до этого supplement и занимался cache-bust writer policy, счётчиками и переносом основного Gill closure-файла. Настоящий документ не меняет его матрицу, счётчики или reverify evidence.

---

## 7. Что закрыто и что остаётся честно открытым

### CLOSED

- старый PR №2 сохранён losslessly;
- все `GILL-CONTENT-001…480` представлены в проверяемой матрице;
- ранние опасные dossier-formulas исправлены/помечены;
- `Research/main` содержит PR13 + PR14;
- `gb-is-my-strength/main` содержит PR192;
- exact-head Research CI зелёный;
- exact-head site CI зелёный;
- постоянные read-only контракты добавлены.

### PENDING — не содержательный долг

- точный live Pages witness merge SHA `877508fb…`;
- одновременное live-свидетельство canonical Gill reading times, актуального Bible registry и glossary revision;
- push/readiness/deploy run merge-коммита не виден через доступный PR-only Actions endpoint.

### Evidence-triggered backlog — неблокирующий

- Particular Baptist Fund folios;
- Angus church books;
- unpublished Whitefield correspondence;
- оригинал Spiller → Spurgeon;
- закрытые full-text academic materials;
- полный 100+ rabbinic concordance;
- другие A3/X-узлы, пока они не используются как прочитанный факт.

---

## 8. Финальный вердикт

**По доступному публичному корпусу ничего из старого Research PR №2 больше не потеряно.**  
**Gill закрыт в Research/main, site/main и exact-head CI.**  
**Ранние Research false-greens, обнаруженные архивом, исправлены и защищены постоянным контрактом.**  
**Единственная незакрытая граница — внешний live Pages witness точного merge SHA; она не является содержательным или source-level долгом и не разрешает возвращать superseded формулировки.**
