# Реестр статей «Господь Бог» — полный baseline-прогон (2026-11-09)

## Agent

- Agent: arena-agent (coordinator); дата 2026-11-09
- Audited anchor: `ae3669bf7a9b87af06e999c0bb3ef5009c400d43` (AuditRepo main)
- Evidence anchor: Product `main` tarball sha256 `adbf1dc93b5bd70bc8ab6780ec21cf32362f21044f4033276421054f1f119ec2` (codeload.github.com, 113 MB), извлечено 70 `src/content/articles/*.mdx` + 49 `src/components/**/*Body.astro`
- Signal class: Product source tree; live snapshot `https://gospod-bog.ru/baptisty-rossii/`
- Status: `raw`; push/commits не производились

## Периметр

- **Всего файлов: 119** (70 MDX + 49 Body.astro). Группы: A=21, B=33, C=65.
- MDX в этом проекте часто являются **оболочками/черновиками**: 6 Gill-MDX содержат только frontmatter (0 слов), читательский текст живёт в `Body.astro`. Поэтому каждая строка реестра проверяется и по MDX, и по соответствующему Body/live.
- Для baptisty: архивные MDX в AuditRepo (`archive/2026-06-27-resolved-lane-evidence/baptisty-expanded-mdx/`) короче live в 2.4–3.0 раза (см. `REPORT.md` §11).

## Baseline-метрики (автоматический прогон по всем 119)

| Показатель | Значение |
|---|---|
| Слов в MDX | min 0, медиана 2371, max 15830 |
| MDX ниже S19 (1500) | 9 |
| MDX ниже roadmap (2800) | 45 |
| MDX ≥ preferred (4200) | 17 |
| Frontmatter-only MDX | 6 (все Gill) |
| `≤2` предложений в абзаце, среднее | 57 % |
| Коротких предложений, среднее | 26 % |
| Конструкций «не X, а Y» всего | 1944 (сырой regex, сигнал, не дефект) |
| Классических GPT-клише всего | 11 |
| `Именно` всего | 558 |
| Эм-даше всего | 8420 |
| `????` в source tree | 0 (репо фиксирует повреждения на live-release 2026-09-30 — отдельная current-check) |
| Файлы с редакционными ТЗ/TODO/HOLD/внутр. путями | 11 |
| «Коротко» вне 4–6 пунктов (Body) | 8 |

## Распределение по агентам

| Агент | Жанр | Файлов | Матрица |
|---|---|---|---|
| **A (координатор)** | «Баптисты России», историческая серия + справочник | 21 | `MATRIX-A.md` |
| **B (агент 2)** | Богословско-экзегетические, биографии (Gill), апологетика, отступничество, Енох | 33 | `MATRIX-B.md` |
| **C (агент 3)** | «Сердце», пасторско-практические, семейные, подростковые серии | 65 | `MATRIX-C.md` |

Полные пословные метрики по каждому файлу — в таблицах ниже; они уже получены, поэтому «запуск на всех статьях» как baseline выполнен до распределения ручной глубины.


### A — Баптисты России (историческая серия)

| # | Файл | Тип | Слов | ¶ | ср.предл/¶ | ≤2 ¶ % | кор.предл % | H2 | URL | ТЗ | Коротко | Клише | «не X, а Y» | sha256(12) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `dva-sezda-1884.mdx` | MDX | 887 | 16 | 2.81 | 38 | 2 | 8 | 2 | 0 | 3 | 0 | 7 | `42de737465ef` |
| 2 | `goneniya-i-sovest.mdx` | MDX | 2104 | 39 | 3.62 | 41 | 28 | 14 | 5 | 1 | 3 | 0 | 9 | `9fdb8ea5ee46` |
| 3 | `iniciativnaya-gruppa.mdx` | MDX | 2239 | 44 | 3 | 50 | 22 | 14 | 3 | 0 | 3 | 0 | 6 | `03554a042399` |
| 4 | `noch-na-kure.mdx` | MDX | 1171 | 16 | 3.62 | 44 | 19 | 8 | 1 | 0 | 3 | 0 | 11 | `65fd46592bf7` |
| 5 | `peterburgskaya-liniya.mdx` | MDX | 1838 | 34 | 3.03 | 32 | 12 | 12 | 2 | 1 | 3 | 0 | 5 | `defa4df7744f` |
| 6 | `podpolnaya-pechat.mdx` | MDX | 2396 | 36 | 3.06 | 33 | 20 | 15 | 7 | 0 | 3 | 0 | 11 | `a494af5bac39` |
| 7 | `sovetskaya-noch.mdx` | MDX | 1941 | 39 | 3.85 | 38 | 35 | 14 | 7 | 0 | 3 | 0 | 7 | `c78cfec41f1a` |
| 8 | `spravochnik.mdx` | MDX | 2558 | 10 | 1.5 | 80 | 0 | 11 | 49 | 2 | - | 0 | 6 | `b3e15124026e` |
| 9 | `vsehib-1944.mdx` | MDX | 1776 | 42 | 4.14 | 38 | 53 | 16 | 4 | 0 | 3 | 0 | 5 | `e55c87e310c6` |
| 10 | `yuzhnaya-shtunda.mdx` | MDX | 784 | 13 | 2.62 | 38 | 6 | 7 | 6 | 0 | 3 | 0 | 5 | `66188d3f5f9a` |
| 11 | `BaptistyRossiiBody.astro` | BODY | 491 | 18 | 1 | 100 | 22 | 3 | 0 | 0 | - | 0 | 1 | `4e5cf9214733` |
| 12 | `BaptistyRossiiDvaSezda1884Body.astro` | BODY | 2689 | 38 | 3.18 | 47 | 20 | 12 | 5 | 0 | 6 | 0 | 9 | `87d4b561db4c` |
| 13 | `BaptistyRossiiGoneniyaISovestBody.astro` | BODY | 3106 | 52 | 3.42 | 40 | 23 | 17 | 6 | 1 | 6 | 0 | 13 | `d133c0e1b7c9` |
| 14 | `BaptistyRossiiIniciativnayaGruppaBody.astro` | BODY | 2474 | 49 | 2.94 | 51 | 23 | 14 | 6 | 0 | 3 | 0 | 5 | `2eb30923d63b` |
| 15 | `BaptistyRossiiNochNaKureBody.astro` | BODY | 2718 | 58 | 2.86 | 47 | 20 | 14 | 2 | 0 | 6 | 0 | 13 | `1284f52262fd` |
| 16 | `BaptistyRossiiPeterburgskayaLiniyaBody.astro` | BODY | 3654 | 58 | 3.07 | 33 | 11 | 16 | 6 | 0 | 6 | 0 | 11 | `bee01fb4d566` |
| 17 | `BaptistyRossiiPodpolnayaPechatBody.astro` | BODY | 2167 | 42 | 3.05 | 43 | 23 | 15 | 10 | 0 | 3 | 0 | 10 | `07d87afb28e7` |
| 18 | `BaptistyRossiiSovetskayaNochBody.astro` | BODY | 3085 | 59 | 3.64 | 19 | 21 | 20 | 10 | 0 | 3 | 0 | 7 | `77efa0d7fdb5` |
| 19 | `BaptistyRossiiSpravochnikBody.astro` | BODY | 2448 | 15 | 1.4 | 87 | 10 | 11 | 49 | 2 | - | 0 | 10 | `5d348945f027` |
| 20 | `BaptistyRossiiVsehib1944Body.astro` | BODY | 2204 | 49 | 3.82 | 43 | 52 | 16 | 6 | 0 | 6 | 0 | 6 | `ce8252132032` |
| 21 | `BaptistyRossiiYuzhnayaShtundaBody.astro` | BODY | 3063 | 44 | 2.91 | 39 | 14 | 11 | 9 | 0 | 6 | 0 | 7 | `1e93380be0e5` |

### B — Богословско-экзегетический корпус

| # | Файл | Тип | Слов | ¶ | ср.предл/¶ | ≤2 ¶ % | кор.предл % | H2 | URL | ТЗ | Коротко | Клише | «не X, а Y» | sha256(12) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `anatomiya-padeniya-pyat-stadiy.mdx` | MDX | 2102 | 5 | 1.8 | 100 | 11 | 15 | 5 | 0 | 5 | 0 | 5 | `1fbe81193eec` |
| 2 | `angely-pod-mrakom-iuda-6-7-2-petra-2.mdx` | MDX | 2074 | 113 | 1.65 | 88 | 49 | 19 | 0 | 0 | 0 | 0 | 2 | `555874cca0da` |
| 3 | `blagovestie-mertvym-1-petra-4-5-6.mdx` | MDX | 1996 | 121 | 1.43 | 94 | 50 | 17 | 0 | 0 | 0 | 0 | 2 | `39c4f5ab8c25` |
| 4 | `cerkovnaya-disciplina-vlast-granicy-zashchita.mdx` | MDX | 2409 | 5 | 2.2 | 80 | 36 | 17 | 2 | 0 | 5 | 0 | 4 | `0449e212cb9c` |
| 5 | `duhi-v-temnice-noi-kreshchenie-pobeda.mdx` | MDX | 2552 | 131 | 1.67 | 87 | 45 | 22 | 0 | 0 | 0 | 0 | 7 | `910ea7798446` |
| 6 | `dzhon-gill-chast-1-chelovek.mdx` | MDX | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | `d1670b145ec4` |
| 7 | `dzhon-gill-chast-2-uchenyi.mdx` | MDX | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | `c616d718c4a5` |
| 8 | `dzhon-gill-chast-3-nasledie.mdx` | MDX | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | `a08e88053368` |
| 9 | `dzhon-gill-chast-4-ekzeget.mdx` | MDX | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | `1099d49515e2` |
| 10 | `dzhon-gill-istoricheskiy-kontekst.mdx` | MDX | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | `5820d9226c4d` |
| 11 | `dzhon-gill-spravochnik.mdx` | MDX | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | `90bfea57537b` |
| 12 | `enoh-prorochestvoval-iuda-14-15-4q204.mdx` | MDX | 1697 | 71 | 1.97 | 83 | 36 | 14 | 0 | 1 | 0 | 0 | 3 | `c74f340acfe7` |
| 13 | `hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki.mdx` | MDX | 11031 | 101 | 9.86 | 14 | 33 | 7 | 0 | 0 | 0 | 4 | 17 | `b421e8e1b153` |
| 14 | `kniga-enoha-kotoroy-ne-bylo-kak-raznye-proizvedeniya-stali-korpusom.mdx` | MDX | 5241 | 187 | 2.05 | 79 | 34 | 23 | 0 | 5 | 0 | 0 | 4 | `75f6b6b53843` |
| 15 | `kod-da-vinchi.mdx` | MDX | 7175 | 97 | 4.35 | 48 | 28 | 22 | 40 | 0 | - | 0 | 38 | `d8bd4aa6cfd5` |
| 16 | `kogda-chelovek-uhodit-ot-very.mdx` | MDX | 3017 | 136 | 2.27 | 85 | 49 | 24 | 1 | 0 | 0 | 0 | 6 | `fbc66d1bc2b2` |
| 17 | `kogda-uhodit-kogda-ostavatsya.mdx` | MDX | 2333 | 5 | 1.6 | 100 | 12 | 18 | 0 | 0 | 5 | 0 | 6 | `696e324b3ad6` |
| 18 | `mozhno-li-doveryat-1-enohu-kanonicheskiy-audit.mdx` | MDX | 4956 | 199 | 1.91 | 85 | 44 | 28 | 0 | 10 | 0 | 0 | 3 | `03c9b8b6baf9` |
| 19 | `nesovershennyy-chelovek-v-nesovershennoy-cerkvi.mdx` | MDX | 2427 | 5 | 1.8 | 100 | 11 | 22 | 2 | 0 | 5 | 0 | 5 | `ab7764a69550` |
| 20 | `otreklis-ot-hrista-istoriya-cerkvi.mdx` | MDX | 2450 | 106 | 1.66 | 92 | 23 | 19 | 11 | 0 | 0 | 0 | 2 | `b8e3fec08645` |
| 21 | `otstuplenie-chto-govorit-bibliya.mdx` | MDX | 3203 | 120 | 2.94 | 61 | 47 | 19 | 1 | 0 | 0 | 0 | 5 | `691fe3383624` |
| 22 | `otstuplenie-ot-very-iuda-evreyam-6.mdx` | MDX | 6506 | 122 | 3.97 | 29 | 30 | 28 | 40 | 0 | 0 | 0 | 22 | `fad649e9ad75` |
| 23 | `otstupniki-biblii-iuda-saul-ierovoam-dimas.mdx` | MDX | 2720 | 124 | 2.09 | 82 | 44 | 20 | 0 | 1 | 0 | 0 | 6 | `175984290268` |
| 24 | `petr-i-iuda-padenie-ili-otstuplenie.mdx` | MDX | 3063 | 133 | 2.04 | 81 | 33 | 24 | 0 | 0 | 0 | 0 | 11 | `a376fad5e495` |
| 25 | `priznaki-zdorovoy-cerkvi.mdx` | MDX | 2346 | 5 | 1.4 | 100 | 0 | 22 | 0 | 0 | 5 | 0 | 6 | `f4938477cbc2` |
| 26 | `rimlyanam-7-veruyushchiy-ili-neveruyushchiy.mdx` | MDX | 4410 | 87 | 3.38 | 49 | 35 | 16 | 0 | 0 | 0 | 0 | 40 | `c912fdc4002a` |
| 27 | `sem-tipov-razlichenie-uchiteley.mdx` | MDX | 1964 | 5 | 2 | 80 | 10 | 12 | 2 | 0 | 5 | 0 | 5 | `1c1cf31beff7` |
| 28 | `sovershennoletie-roditelskaya-vlast-chto-menyaetsya.mdx` | MDX | 6067 | 292 | 1.38 | 92 | 42 | 35 | 9 | 0 | 0 | 0 | 6 | `b63f6be58c88` |
| 29 | `steven-lawson-samoobman-i-publichnyy-golos.mdx` | MDX | 15830 | 140 | 2.73 | 49 | 18 | 30 | 5 | 0 | - | 0 | 51 | `87f3831e3bff` |
| 30 | `teksty-pisaniya-kotorymi-manipuliruyut.mdx` | MDX | 2945 | 5 | 1.6 | 100 | 0 | 15 | 13 | 0 | 5 | 0 | 3 | `0840b8787023` |
| 31 | `vernye-i-neizvestnye-zdorovoe-pastyrstvo.mdx` | MDX | 3154 | 5 | 2.4 | 60 | 17 | 22 | 2 | 0 | 5 | 0 | 8 | `d6ea0c83f9ad` |
| 32 | `HermenevtikaBody.astro` | BODY | 11338 | 109 | 9.03 | 17 | 33 | 7 | 5 | 0 | 5 | 4 | 18 | `9d33d2fb944a` |
| 33 | `Rimlyanam7Body.astro` | BODY | 4217 | 66 | 4.03 | 30 | 35 | 15 | 3 | 0 | 6 | 0 | 40 | `2134cc77b5c9` |

### C — Практико-пасторский корпус

| # | Файл | Тип | Слов | ¶ | ср.предл/¶ | ≤2 ¶ % | кор.предл % | H2 | URL | ТЗ | Коротко | Клише | «не X, а Y» | sha256(12) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `chto-bibliya-nazyvaet-serdcem.mdx` | MDX | 4033 | 57 | 5.11 | 49 | 27 | 24 | 0 | 0 | 0 | 0 | 32 | `50657f3473c0` |
| 2 | `kak-hranit-serdce.mdx` | MDX | 1983 | 35 | 3.2 | 49 | 15 | 15 | 0 | 0 | 0 | 0 | 24 | `4b7167c256e8` |
| 3 | `kak-menyaetsya-serdce.mdx` | MDX | 2280 | 39 | 3.74 | 51 | 21 | 14 | 0 | 0 | 0 | 0 | 18 | `e2c96ac18f8e` |
| 4 | `krajne-li-isporcheno-serdce.mdx` | MDX | 10341 | 148 | 6.65 | 40 | 46 | 19 | 17 | 0 | 0 | 0 | 71 | `73ce71713df9` |
| 5 | `myslennaya-zhizn-serdca.mdx` | MDX | 2398 | 39 | 3.15 | 59 | 20 | 15 | 0 | 0 | 0 | 0 | 25 | `d42a2fcf7d23` |
| 6 | `novoe-serdce.mdx` | MDX | 3194 | 43 | 4.16 | 51 | 22 | 16 | 0 | 0 | 0 | 0 | 33 | `f676b940fbb1` |
| 7 | `osvobozhdennoe-serdce.mdx` | MDX | 1805 | 33 | 4.06 | 39 | 25 | 13 | 0 | 0 | 0 | 0 | 29 | `621c0ab9af7a` |
| 8 | `podrostok-za-kadrom-chto-delat-tserkvi.mdx` | MDX | 5763 | 241 | 1.53 | 88 | 38 | 25 | 12 | 0 | 0 | 0 | 9 | `f75fbe607cf8` |
| 9 | `podrostok-za-kadrom-dvoynaya-zhizn.mdx` | MDX | 4970 | 145 | 2.64 | 66 | 39 | 19 | 11 | 0 | 0 | 0 | 11 | `e6a472444f86` |
| 10 | `podrostok-za-kadrom-roditelyam-posle-razoblacheniya.mdx` | MDX | 7069 | 256 | 1.95 | 80 | 38 | 27 | 14 | 0 | 0 | 0 | 18 | `defc9de6d465` |
| 11 | `religioznoe-serdce.mdx` | MDX | 1870 | 28 | 4.21 | 46 | 23 | 12 | 0 | 0 | 0 | 0 | 17 | `7a944c874da8` |
| 12 | `serdce-hrista-k-nemoshchnym.mdx` | MDX | 5833 | 66 | 4.74 | 42 | 23 | 19 | 0 | 0 | 0 | 0 | 56 | `9405dd0a0647` |
| 13 | `serdce-i-duh.mdx` | MDX | 4211 | 55 | 3.55 | 60 | 19 | 17 | 0 | 0 | 0 | 0 | 45 | `8d64654fe79f` |
| 14 | `serdce-i-iskushenie.mdx` | MDX | 2288 | 40 | 3.65 | 45 | 22 | 14 | 0 | 0 | 0 | 0 | 16 | `d416e1ded33f` |
| 15 | `serdce-i-sokrovishche.mdx` | MDX | 1906 | 31 | 3.9 | 39 | 26 | 14 | 0 | 0 | 0 | 0 | 28 | `5f53a6edf8fe` |
| 16 | `serdce-i-telo.mdx` | MDX | 1992 | 34 | 3.26 | 56 | 17 | 15 | 0 | 0 | 0 | 0 | 17 | `79a1ce46206e` |
| 17 | `serdce-i-yazyk.mdx` | MDX | 2288 | 38 | 3.63 | 53 | 24 | 15 | 0 | 0 | 0 | 1 | 18 | `f99e08b2c8c2` |
| 18 | `serdce-ne-v-odinochku.mdx` | MDX | 1956 | 33 | 3.48 | 52 | 20 | 15 | 0 | 0 | 0 | 0 | 21 | `ced56fe8e88c` |
| 19 | `serdce-pod-skorbyu.mdx` | MDX | 2223 | 33 | 3.97 | 45 | 23 | 14 | 0 | 0 | 0 | 0 | 27 | `7dc0b646a2b8` |
| 20 | `serdce-spravochnik.mdx` | MDX | 2304 | 37 | 2.19 | 81 | 44 | 14 | 0 | 0 | 0 | 0 | 11 | `a0db5c81c780` |
| 21 | `skrytye-idoly-serdca.mdx` | MDX | 2331 | 39 | 3.72 | 44 | 25 | 14 | 0 | 0 | 0 | 0 | 16 | `27d7c982bd7d` |
| 22 | `sovest-vnutrenniy-sud.mdx` | MDX | 2906 | 48 | 3.17 | 48 | 20 | 15 | 0 | 0 | 0 | 0 | 35 | `2fd7afd765b9` |
| 23 | `starye-dorozhki-serdca.mdx` | MDX | 2700 | 43 | 3.26 | 49 | 14 | 16 | 0 | 0 | 0 | 0 | 23 | `2364cddd274d` |
| 24 | `strah-bozhij-rabskij-ili-synovnij.mdx` | MDX | 1769 | 31 | 3.9 | 52 | 22 | 12 | 0 | 0 | 0 | 0 | 25 | `1c2910bc54c9` |
| 25 | `svoboda-vo-hriste.mdx` | MDX | 1869 | 36 | 3.58 | 50 | 17 | 14 | 0 | 0 | 0 | 0 | 20 | `13e9bbdd97e8` |
| 26 | `tma-na-serdce.mdx` | MDX | 2562 | 42 | 3.74 | 45 | 20 | 14 | 0 | 0 | 0 | 0 | 17 | `76b0ce7ba8a6` |
| 27 | `vzroslaya-doch-otets-brak-soglasie-granitsy-vlasti.mdx` | MDX | 6240 | 372 | 1.36 | 97 | 42 | 42 | 0 | 1 | 0 | 0 | 14 | `058e04fa0509` |
| 28 | `vzroslyy-rebenok-doma-dengi-pomoshch-posledstviya.mdx` | MDX | 5479 | 274 | 1.51 | 93 | 42 | 29 | 7 | 2 | 0 | 0 | 11 | `f085dfc70ff3` |
| 29 | `vzroslyy-rebenok-ushel-kontakt-pokayanie-vozvrashchenie.mdx` | MDX | 5668 | 298 | 1.46 | 90 | 47 | 25 | 11 | 0 | 0 | 0 | 8 | `11b9659cc988` |
| 30 | `AntisovetovBody.astro` | BODY | 17656 | 216 | 4.36 | 29 | 25 | 18 | 36 | 0 | 8 | 0 | 85 | `fa39057ac8da` |
| 31 | `ChtoBibliyaBody.astro` | BODY | 4028 | 49 | 6.49 | 31 | 33 | 23 | 3 | 0 | 5 | 0 | 32 | `901fa918400f` |
| 32 | `GillContextArticleBody.astro` | BODY | 0 | 1 | 1 | 100 | 0 | 0 | 0 | 0 | - | 0 | 0 | `15981d58e7cf` |
| 33 | `GillPart1ArticleBody.astro` | BODY | 0 | 1 | 1 | 100 | 0 | 0 | 0 | 0 | - | 0 | 0 | `9babe84d9bc0` |
| 34 | `GillPart2ArticleBody.astro` | BODY | 7451 | 114 | 2.81 | 58 | 17 | 4 | 1 | 0 | - | 1 | 20 | `38d7e9b3e665` |
| 35 | `GillPart3ArticleBody.astro` | BODY | 9975 | 137 | 3.04 | 42 | 11 | 3 | 4 | 0 | - | 0 | 8 | `9b601d69c695` |
| 36 | `GillPart4ArticleBody.astro` | BODY | 4096 | 55 | 2.44 | 64 | 16 | 10 | 8 | 0 | - | 0 | 17 | `ffd97addbb70` |
| 37 | `GillSpravochnikArticleBody.astro` | BODY | 0 | 1 | 1 | 100 | 0 | 0 | 0 | 0 | - | 0 | 0 | `0d012f865407` |
| 38 | `KakHranitBody.astro` | BODY | 2028 | 37 | 3.51 | 35 | 24 | 14 | 3 | 0 | 5 | 0 | 25 | `087ca8cb4a2f` |
| 39 | `KakMenyaetsyaBody.astro` | BODY | 2318 | 41 | 3.78 | 37 | 28 | 13 | 3 | 0 | 5 | 0 | 19 | `ae83a6e7b883` |
| 40 | `KodDaVinchiArticleBody.astro` | BODY | 0 | 1 | 1 | 100 | 0 | 0 | 0 | 0 | - | 0 | 0 | `6a432a134ec0` |
| 41 | `KrajneBody.astro` | BODY | 10110 | 117 | 6.94 | 26 | 42 | 18 | 20 | 0 | 5 | 0 | 73 | `53ec669e36d9` |
| 42 | `LotArticleBody.astro` | BODY | 0 | 1 | 1 | 100 | 0 | 0 | 0 | 0 | - | 0 | 0 | `72cf79033021` |
| 43 | `MyslennayaBody.astro` | BODY | 2435 | 40 | 3.25 | 45 | 26 | 14 | 3 | 0 | 5 | 0 | 25 | `dc175cd89d51` |
| 44 | `NeVOdinochkuBody.astro` | BODY | 1998 | 35 | 3.66 | 29 | 29 | 14 | 3 | 0 | 5 | 0 | 21 | `2e55115997f2` |
| 45 | `NovoeSerdceBody.astro` | BODY | 3200 | 45 | 4.4 | 36 | 27 | 15 | 3 | 0 | 7 | 0 | 33 | `ae672704bec5` |
| 46 | `OsvobozhdennoeBody.astro` | BODY | 1833 | 37 | 3.86 | 35 | 31 | 12 | 3 | 0 | 6 | 0 | 29 | `f369fae482c5` |
| 47 | `ReligioznoeBody.astro` | BODY | 1918 | 34 | 4 | 44 | 32 | 11 | 3 | 0 | 5 | 0 | 17 | `56a4a1e6a164` |
| 48 | `SerdceHristaBody.astro` | BODY | 5848 | 70 | 5.04 | 27 | 27 | 18 | 3 | 0 | 10 | 0 | 56 | `26cc25d28a83` |
| 49 | `SerdceIDuhBody.astro` | BODY | 4216 | 57 | 3.91 | 46 | 26 | 16 | 3 | 0 | 8 | 0 | 45 | `197ec331f3b7` |
| 50 | `SerdceIskushenieBody.astro` | BODY | 2320 | 42 | 3.33 | 40 | 26 | 13 | 3 | 0 | 5 | 0 | 17 | `c7b39d3b60be` |
| 51 | `SerdceSkorbBody.astro` | BODY | 2284 | 36 | 4.28 | 28 | 32 | 13 | 3 | 0 | 5 | 0 | 27 | `900e4732e01b` |
| 52 | `SerdceSokrovishcheBody.astro` | BODY | 1961 | 34 | 4.09 | 32 | 31 | 13 | 3 | 0 | 5 | 0 | 28 | `bdf55f5856e6` |
| 53 | `SerdceSpravochnikBody.astro` | BODY | 2224 | 40 | 1.75 | 82 | 50 | 13 | 3 | 0 | 7 | 0 | 11 | `aeac86dcc258` |
| 54 | `SerdceTeloBody.astro` | BODY | 2043 | 35 | 3.57 | 43 | 26 | 14 | 3 | 0 | 5 | 0 | 17 | `ea246d186d3c` |
| 55 | `SerdceYazykBody.astro` | BODY | 2345 | 39 | 4.1 | 33 | 32 | 14 | 3 | 0 | 5 | 1 | 18 | `7df224481363` |
| 56 | `SkrytyeIdolyBody.astro` | BODY | 2385 | 42 | 3.79 | 36 | 33 | 13 | 3 | 0 | 5 | 0 | 16 | `7cc121b7e960` |
| 57 | `SovestBody.astro` | BODY | 2950 | 51 | 3.35 | 39 | 29 | 14 | 3 | 0 | 5 | 0 | 35 | `8127bbff49a7` |
| 58 | `StaryeDorozhkiBody.astro` | BODY | 2737 | 44 | 3.5 | 34 | 22 | 15 | 3 | 0 | 6 | 0 | 23 | `9dbc9f3d6f2f` |
| 59 | `StrahBozhijBody.astro` | BODY | 1809 | 35 | 3.69 | 40 | 31 | 11 | 3 | 0 | 5 | 0 | 26 | `e1327e7705b5` |
| 60 | `SvobodaVoHristeBody.astro` | BODY | 1913 | 38 | 3.58 | 47 | 23 | 13 | 3 | 0 | 5 | 0 | 20 | `e9a8c1300d52` |
| 61 | `TmaNaSerdceBody.astro` | BODY | 4228 | 66 | 3.91 | 33 | 27 | 15 | 15 | 0 | 5 | 0 | 16 | `8bca6b259f79` |
| 62 | `Baptizm3DBody.astro` | BODY | 404 | 1 | 4 | 0 | 25 | 1 | 2 | 0 | - | 0 | 0 | `009f1ad99c94` |
| 63 | `AtlasBody.astro` | BODY | 138 | 3 | 2 | 100 | 0 | 4 | 0 | 0 | - | 0 | 0 | `a4bd6b89f919` |
| 64 | `NagornayaSeriyaBody.astro` | BODY | 600 | 23 | 1.74 | 83 | 50 | 2 | 3 | 0 | 6 | 0 | 1 | `1f9afa2c672c` |
| 65 | `RodosloviyeBody.astro` | BODY | 757 | 12 | 1.17 | 100 | 29 | 2 | 1 | 0 | - | 0 | 0 | `ce08ddce18ca` |
