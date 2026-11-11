# «Господь Бог — Сила Моя» — аудит источников, волна 6

**Дата:** 11 ноября 2026 года  
**Режим:** READ ONLY — никаких изменений Product, AuditRepo, Research, веток агентов, PR, CI и стандартов.  
**Product anchor:** `FedorMilovanov/gb-is-my-strength@ccb1e6cfe8a1324fd988260577bd61337f3ca74d`.  
**Статус:** независимый предварительный отчёт, не новая MASTER-матрица, не разрешение на правку.

## 1. Воспроизводимый публикационный слой

- `articles/steven-lawson-samoobman-i-publichnyy-golos/index.astro` действительно импортирует и рендерит соответствующий `.mdx`; поэтому текстовые находки ниже относятся к публикуемому источнику.
- `articles/vzroslaya-doch-otets-brak-soglasie-granitsy-vlasti/index.astro` также непосредственно рендерит MDX.
- `articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.astro` рендерит **HermenevtikaBody.astro**, не контент одноимённого MDX.
- `articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/index.astro` рендерит **Rimlyanam7Body.astro**, не одноимённый MDX.
- Gill III/IV рендерятся `GillPart4MainShell`/`GillPart3MainShell` с главами и названиями из PageHead и `gillSeriesData.ts`.

Вывод: проверка только по списку MDX даёт ошибочные выводы для ряда реальных страниц. Канонический ключ: `route → actual imported owner → exact span → source edition → inferential boundary`.

## 2. Новые находки

### W6-01. Утверждение о начале отношений Стивена Лоусона — **QUALIFY/HOLD**, P1 для источниковой проверки

**Product:** `src/content/articles/steven-lawson-samoobman-i-publichnyy-golos.mdx:173,408` и `src/components/article-pilots/lawson/sourceRegistry.ts:261,340`.

**Утверждение сайта:** Фил Джонсон признал, что женщина училась в The Master’s University **на начало отношений**.

**Первичное высказывание, опубликованное в репортаже:** письмо Фила Джонсона, воспроизведённое 29 октября 2024 года в *The Roys Report*, сообщает, что она училась в The Master’s College/University **«during some of the time»** отношений (в течение части их периода), но не устанавливает точную дату начала.

- https://roysreport.com/steve-lawson-began-his-adulterous-affair-with-woman-when-she-was-a-student-at-the-masters-university-gcc-pastor-admits/comment-page-1/
- https://roysreport.com/steve-lawson-sinned-grievously-post-breaking-six-month-silence/

Сам журналистский заголовок октября 2024 и последующий пересказ марта 2025 говорят сильнее — «в момент начала»; это **одна цепочка сообщений**, а не два независимых свидетельства. В том же октябрьском материале указано окончание учёбы в 2018 году и оспаривается оценка пятилетней продолжительности отношений; эти сведения не дают безусловного календарного подтверждения момента начала.

**Вердикт:** нельзя на данном источниковом основании писать «подтверждено, что на начало». В то же время **не доказано**, что этот момент описан ложно. Публично подтверждённое содержание более узкое: периоды учёбы и отношений частично совпадали. Для дальнейшей редакции — после согласования с владельцем — нужна формулировка с этой границей либо независимое доказательство точного начала. Не выводить вину учреждения из одного пересечения дат; не идентифицировать женщину.

### W6-02. Библиографическая дата `LAW-41` — **VERIFIED**, P2

**Product:** `src/components/article-pilots/lawson/sourceRegistry.ts:336–341`.

В `LAW-41` указано **17 Mar 2025**; соответствующая страница *The Roys Report* датирована **13 марта 2025 года**: https://roysreport.com/steve-lawson-sinned-grievously-post-breaking-six-month-silence/ .

**Вердикт:** подтверждённая локальная ошибка метаданных источника. Не новый системный root. Ремонт только в согласованной owner-lane, без открытия конкурирующих Product PR.

### W6-03. Одно усиленное утверждение продублировано в source registry — **DUPLICATE OF W6-01**

`sourceRegistry.ts:261` и `:340` повторяют формулу «на начало отношений». Поэтому ссылку статьи на карточку `LAW-41` нельзя считать ещё одним независимым подтверждением. Это provenance propagation одного вывода. Не создавать третью проблему.

## 3. Положительные контроли — не галлюцинации

### W6-04. Джон Гилл: родительская власть уменьшается с возрастом детей — **VERIFIED**

**Product:** `src/content/articles/vzroslaya-doch-otets-brak-soglasie-granitsy-vlasti.mdx:112,308`.

**Оригинал:** John Gill, *A Body of Practical Divinity*, Book V, “Of the Respective Duties of Parents and Children”: https://ccel.org/ccel/gill/practical/practical.v.ii.html .

Гилл прямо говорит, что по мере взросления детей власть родителей **уменьшается**, а уважение, почитание и благодарность остаются. Сайт передаёт это корректно. Не обвинять автора в выдуманной атрибуции.

### W6-05. Гилл: добровольное согласие вступающих в брак — **VERIFIED**

**Product:** тот же MDX:296–310.

**Оригинал:** Gill, *A Body of Practical Divinity*, Book V, “Of the Respective Duties of Husband and Wife”: https://ccel.org/ccel/gill/practical/practical.v.i.html .

Гилл говорит и об участии родителей/попечителей, и об **особой необходимости собственного добровольного согласия мужчины и женщины**, отвергая принуждение даже со стороны вышестоящих. Обе составляющие верно сохранены в статье. Это сильный отрицательный контроль против бездумной «галлюцинационной» разметки исторических цитат.

### W6-06. Абнер Чау — библиография оригинала подтверждена — **VERIFIED / PARTIAL TRANSLATION CHECK**

**Реальный Product owner:** `src/components/article-pilots/hermenevtika/HermenevtikaBody.astro:38–42,66`. Не считать MDX полным читательским текстом.

**Издание:** Abner Chou, “A Hermeneutical Evaluation of the Christocentric Hermeneutic,” *The Master’s Seminary Journal* 27/2 (Fall 2016), **с. 113–139**. Оригинальный PDF издателя: https://tms.edu/wp-content/uploads/2021/09/TMSJ-Volume-27-Number-2.pdf . Проверена визуально первая страница статьи 113; автор, заголовок, исходная аннотация и смысл русского вступления соответствуют.

**Граница:** весь перевод не коллирован построчно. В Body есть заявление о разрешении на русский перевод, но само письмо/лицензия издателя не предъявлено в этом проходе: **не утверждать, что права установлены либо опровергнуты**. Стилевые машинные кальки — отдельная старая MASTER-root.

### W6-07. Рим. 7:14 `σάρκινος` / `σαρκικός` — **VALID LEXICAL DISTINCTION, NOT DOGMATIC PROOF**

**Реальный Product owner:** `src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro:74–76`.

**Источник:** Cambridge Greek Testament for Schools and Colleges, комментарий к Рим. 7:14: https://lemma.gebible.app/v/romans/7/14 .

Различие между материалом («плотяной») и качеством/характером («плотской») действительно описывается в комментарии. **Нет выдуманной формы**. Однако это филологический оттенок, а не единственное доказательство того, кто изображён в Рим. 7; семантические поля могут пересекаться.

## 4. Уже известный вопрос о нумерации Джона Гилла

### W6-08. Номер в permalink ≠ номер опубликованной главы — **OWNER DECISION / NOT NEW**

- https://gospod-bog.ru/articles/dzhon-gill-chast-3-nasledie/ — читательская **Часть IV: Наследие**.
- https://gospod-bog.ru/articles/dzhon-gill-chast-4-ekzeget/ — читательская **Часть III: Экзегет**.

Сверены live страницы, `GillPart3PageHead.astro`, `GillPart4PageHead.astro`, `gillSeriesData.ts`. Нумерация **внутри самого reader, заголовки и переходы** показывают порядок I → II → III Экзегет → IV Наследие. Ошибка идентификатора в URL реальна, но неверную последовательность глав утверждать нельзя. Не переименовывать опубликованные адреса без redirect/canonical/sitemap/link-owner решения; это ранее замечалось агентами, в новую активную MASTER строку не переносить.

## 5. Дедупликация и следующий исследовательский приоритет

| Риск | Статус | Что сделать без вмешательства в репо |
|---|---|---|
| Lawson дата начала | **HOLD / P1 verify** | Искать независимый locator на момент начала; отделять «в течение» от «в начале» |
| Lawson дата источника | **VERIFIED / P2** | Зафиксировать для будущего ограниченного исправления 17→13 марта |
| Gill первичный текст | **VERIFIED positive** | Не плодить ложных багов по атрибуции Гилла |
| Chou оригинал и аннотация | **VERIFIED partial** | Позже построчная колляция перевода; отдельно право на публикацию |
| Rom 7 lexical | **VERIFIED bounded** | Проверять употребление в контексте, не превращать глоссу в доктринальный приговор |
| Gill permalink | **OWNER DECISION** | Сопоставить legacy inbound links и SEO, не делать blind rename |

**Ранее найденное, не пересчитывается как новая находка:** несоответствия цитат 1 Пет. 3:18/4:6 из wave5, логический переход в 1 Пет. 4:6 и блоки «Коротко» из wave4, старый `GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK`, вопросы 63 исторических дат из wave2–4.

**Итог:** в этой волне — один репутационно значимый claim, требующий сужения; одна доказанная библиографическая неточность; три положительных первоисточниковых контроля; один подтверждённый, но ранее известный permalink mismatch. Не установлен полный выпускной SHA живого сайта и не выполнена полная browser/AX/print-приёмка. Никаких записей в репозитории.