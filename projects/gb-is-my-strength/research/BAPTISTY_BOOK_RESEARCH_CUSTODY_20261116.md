# «Баптисты России» — акт побайтного переноса исследований Product → Research

**Срез 16 ноября 2026 года.** AuditRepo хранит проверяемый акт и решения; **не копирует** исходные досье/20,69 МБ архивных объектов. Это самостоятельный evidence record, а не новая строка или второй MASTER.

## Независимая цепочка custody

| Поле | Проверенное значение |
| --- | --- |
| Product repository | FedorMilovanov/gb-is-my-strength |
| Product baseline | e71d4ca3d8104c1c3469f8490ace53914b1cc4d5 |
| Product original | baptisty-rossii/research/ |
| Research repository | FedorMilovanov/Research |
| Research base | 3701153bcb5c7439ec07b9698bff3917492398de |
| Research PR | https://github.com/FedorMilovanov/Research/pull/520 |
| Research candidate HEAD | 16c175bc831e8ce5b09e3068cc936a094d8b7138 |
| Research destination | БАПТИСТЫ РОССИИ/BOOK_RESEARCH/ |
| Source files | **248 из 248**, отсутствие коллизий |
| Source bytes | **20 691 314** |
| Git blob parity | **248/248 exact**, original Git SHA-1 = staged Research Git SHA-1 |
| SHA-256 sorted content-set | 6dc68b35b9b346a795e31483022136b049b7771bc302011806699dc6454c1249 |
| Source edits | **0** (byte-preserving copy, no text repair, no rights/evidence upgrades) |
| Retirement of Product originals | **BLOCKED until full chain** |
| Audit status | **VERIFIED ON CANDIDATE; Research CI/merge pending at creation** |

Читать [Research README](https://github.com/FedorMilovanov/Research/blob/16c175bc831e8ce5b09e3068cc936a094d8b7138/%D0%91%D0%90%D0%9F%D0%A2%D0%98%D0%A1%D0%A2%D0%AB%20%D0%A0%D0%9E%D0%A1%D0%A1%D0%98%D0%98/BOOK_RESEARCH/README.md), [машинный манифест 248 файлов](https://github.com/FedorMilovanov/Research/blob/16c175bc831e8ce5b09e3068cc936a094d8b7138/%D0%91%D0%90%D0%9F%D0%A2%D0%98%D0%A1%D0%A2%D0%AB%20%D0%A0%D0%9E%D0%A1%D0%A1%D0%98%D0%98/BOOK_RESEARCH/SOURCE_CUSTODY_MANIFEST.json).

## Научные и публикационные границы

- [Research/БАПТИСТЫ РОССИИ/v120](https://github.com/FedorMilovanov/Research/tree/main/%D0%91%D0%90%D0%9F%D0%A2%D0%98%D0%A1%D0%A2%D0%AB%20%D0%A0%D0%9E%D0%A1%D0%A1%D0%98%D0%98/baptists_v120_TRUE_GROUPED) и RUSSIAN_BAPTISTS_ARCHIVE остаются authority для архивной проверки; перенесённая папка — сохранённый книжный source layer. Не объявлять транскрипцию/цитату верифицированной только по факту переноса.
- Book Authority Product v2: **5 частей / 20 плановых глав**, 90–120 тыс. слов. Текущая читательская поверхность: 9 исторических статей + отдельный справочник; план не означает готовность 20 глав.
- На срезе исходного Research v120 в PROOF_STATUS_LEDGER: **5 quote_ready из 333 строк**. Это внутренний статус исторического среза, не разрешение перепечатать любой источник.
- Ни одна из 248 позиций не получила новых evidenceClass, accessState, locatorState, rightsState, publicationState или снятых HOLD.
- См. действующий root [SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT](https://github.com/FedorMilovanov/AuditRepo/blob/main/projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md). Его одновременно ведёт AuditRepo PR #562; данный акт не редактирует MASTER и не конфликтует с его владельцем.
- Имеются отдельные Product редакционные остатки: 3D источник #2314, система обновлений статей #2301, отдельные reader/metadata issues. Их не считать автоматически закрытыми custody transfer.

## Двухэтапная приёмка и запреты

**Stage A — Research custody:**
1. Exact candidate SHA Research PR #520; 248/248 Git-object identity, SHA-256 content-set, no path collisions.
2. Зеленые Research root/authority/security CI и merge с актуальным Research main; postmerge проверить 248 destination blobs по exact manifest.
3. Обновить этот акт только если реальный факт изменится (merge/release/контракт).

**Stage B — Product retirement and real book integration:**
1. Проверить все actual Product file/code/CI references за пределами baptisty-rossii/research/, включая ссылки из markdown и маршруты 3D.
2. Если обнаружатся runtime/build-потребители, сохранить минимальные нужные публикационные assets или заменить явными источниковыми ссылками без сети в build-time; не удалять source of truth наугад.
3. Только после Research merge и 100% dependency parity — отдельный scoped Product PR удаления ненужных архивных копий; exact-head native CI и audit verification.
4. Книжные главы готовить по source-to-claim + rights + media + full prose edit, а не механической заменой 9 действующих статей большим архивным текстом.

**НЕ ДЕЛАТЬ:** не удалять Product source до Research merge; не архивировать 248 файлов в AuditRepo, не заводить второй active MASTER, не повторно отправлять заявки на архивные копии; не повышать ссылки до «файл доступен» без точного объекта и checksum.
