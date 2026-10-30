# Широкая волна 46: системное решение по self-hosted fonts

Дата: **2026-10-30**  
Product anchor: `89bab745790a6a5c1cddf86fd65cb0c692b049d9`.  
Предшествующие font waves: 43 — inventory/custody; 44 — routes/requested/paint; 45 — cold/warm/failed/cache.

## Решение в одном абзаце

Сохранять self-hosting, но не «докачивать всё». Сначала устранить route delivery и ложные declarations, затем добавить только три high-demand normal-700 boundaries (Lora, Source Sans 3, Inter) и нужные Playfair Latin/punctuation subsets после candidate-byte/visual проверки. Greek/Hebrew italic/500 лучше нормализовать к реальным faces, если владелец не требует отдельного рисунка. Удаление duplicate Hebrew 500 и недоказанного Greek TTF даёт более честную поставку без ухудшения current successful paint; long immutable cache допустим только после versioned/content-addressed binary URLs. Всё остаётся в одном действующем font-matrix owner.

## 1. Что улучшит usability без новых binary bytes

### P0 — route registration

Подключить authoritative registry на пяти preload-without-registry routes либо удалить preload/declaration, если route утверждает системную типографику. Для `/karty/` owner явно обещает Playfair/Cormorant/Hebrew, поэтому предпочтителен registry + painted proof.

Это исправляет platform-dependent art direction, не добавляя новый binary в repository. Cold route transfer может вырасти, поскольку browser наконец запросит нужные существующие faces; поэтому route-scoped above-fold acceptance обязателен.

### P0 — token normalization

До добавления файлов:

- arbitrary 650/680/740/750/760/820/850 weights привести к небольшому owner-approved token set;
- Greek/Hebrew technical terms не делать физически italic только потому, что semantic element — `<em>`; сохранить emphasis и задать script face normal, если это редакционно допустимо;
- Hebrew 500 направить на один реальный face либо использовать 400; текущий второй binary не является 500;
- 800/900 использовать только там, где отличие от 700 действительно видно и является частью hierarchy.

Это уменьшает synthesis и число потенциальных faces.

## 2. Какие faces имеют доказанный приоритет

| Candidate | Demand evidence | Решение |
|---|---|---|
| Lora 700 normal, Cyrillic + Latin/punctuation | 2 776 direct-text nodes / 102 routes request 700 normal; current paint resolves to SemiBold 600 | высокий приоритет; candidate bytes + mixed-script CDP |
| Source Sans 3 700 normal, Cyrillic + Latin | 1 206 nodes / 87 routes | высокий приоритет; затем нормализовать часть 800/900 к 700 |
| Inter 700 normal, Cyrillic + Latin | 731 nodes / 25 routes | высокий приоритет; заменить произвольные 680–820 tokens либо обосновать variable face |
| Playfair Latin/punctuation 600/700 | Home/Enoch H1 split custom + platform; 267 uncovered nodes / 34 routes | высокий визуальный приоритет; subset only |
| Cormorant 700/Latin | 128 uncovered nodes / 18 routes | сначала решить, нужен ли отдельный display owner или declarations можно свести к Playfair/Lora |
| Lora/Source/Inter true italic/bold extremes | существенно меньший/разрозненный demand | добавлять только после route-specific editorial need |

Размер новых candidates здесь намеренно не придуман: closure build должен скачать из утверждённого immutable source, зафиксировать exact SHA/bytes/license и показать route cold delta до merge.

## 3. Где новые bytes не нужны

### Hebrew duplicate

`notoserifhebrew-400.woff2` и `-500.woff2` одинаковы: по 18 412 bytes, один SHA, OS/2 weight 400. Home и ordinary article способны запросить оба. Один binary + честная weight policy может убрать **18 412 repository bytes**, один cold response и 18 412 encoded bytes на routes, где сейчас нужны оба.

### Greek TTF fallback

444 064-byte TTF не запрашивается при успешном WOFF2. Современный owner должен доказать browser, который поддерживает TTF, но не рабочий WOFF2, либо удалить fallback. Потенциальная экономия artifact: **444 064 bytes**; current normal cold transfer не изменится.

### Karty dead preload

Удаление либо исправление route head убирает **21 964 bytes** бесполезного cold transfer в текущем состоянии. Если custom art direction сохраняется, эти bytes перестают быть мёртвыми, но могут добавиться Hebrew/Cormorant faces; сравнивать нужно с painted result, не только с сетью.

### Noto Serif Greek cargo

Wide/current corpus не дал подтверждённого visible direct-text use Noto Serif Greek, а focused Home selector отсутствовал; WOFF2+TTF занимают 591 528 bytes artifact. Это **кандидат на отдельную usage verification**, а не готовое удаление: wide ambient and print owners должны доказать нулевой demand. Не следует автоматически заменять его Noto Sans, пока art direction не утверждён.

## 4. Preload policy

1. Не preload-ить face без route registration.
2. Не считать каждый visible face critical: preload только для face LCP/first viewport, подтверждённого initiator/paint trace.
3. Lawson шесть preloads / 86 932 bytes сократить после A/B priority proof; его LCP heading системный Georgia.
4. Для article family предпочтителен один body/display critical preload; остальные `unicode-range` faces browser запросит по glyph demand.
5. Permanent contract должен падать на unused preload, duplicate URL/physical face и preload family/weight, отсутствующий в route registry.

## 5. Fallback metrics и failure policy

- сохранить `font-display:swap` как readable failure baseline;
- определить fallback per token, а не один глобальный serif/sans;
- измерить cap-height/x-height/advance/ascent/descent на реальных Cyrillic/Latin/digit strings;
- применять `size-adjust`/metric overrides только после A/B line-break/clipping/CLS proof;
- явно решить `font-synthesis`: `none` там, где точный identity обязателен; разрешить только документированную synthesis там, где это осознанная экономия bytes.

Failed-font acceptance: текст/Greek/Hebrew читаемы, page identity и hit-testing сохраняются, CLS budget выдержан. Delayed failure должен быть отдельным network-throttle test, потому что abort-before-paint не моделирует поздний swap.

## 6. Cache и custody

1. Font URL должен включать manifest-derived version либо content hash.
2. После этого binary получает long `public, max-age=31536000, immutable`; registry/HTML — revalidation/versioned reference.
3. CI проверяет response policy на release artifact/live owner; до реального header witness TTL не заявляется.
4. Каждый binary получает source commit/URL, SHA/bytes, SPDX/license и vendored OFL identity.
5. Three upstream drifts остаются pinned до визуальной acceptance; automatic refresh запрещён.

## 7. Единый системный contract

Один `font-matrix` gate должен объединить:

- inventory + manifest/support manifest + aliases;
- WOFF2/SFNT structure, OS/2/name/cmap и duplicate-content detection;
- final-route registry/preload graph;
- browser-collected requested family/weight/style/scripts;
- exact-face либо owner-approved fallback/synthesis mapping;
- CDP painted-font fixtures для Cyrillic, Latin, punctuation/digits, Hebrew и Greek;
- cold/warm/delayed-failed metrics, broken images/errors/Axe/overflow;
- license/source/cache custody.

Negative fixtures: missing registry with preload; fake 500 pointing to physical 400; unsupported 700 silently matching 600; absent Latin subset; unused preload; unversioned immutable URL; missing OFL record.

## 8. MASTER disposition

`GBS-CUSTOM-FONT-MATRIX-MIXED-FAMILY-RENDERING` остаётся активным и расширен route-delivery, preload, custody и cache evidence. Новый SYSTEM row не создаётся: все проявления сходятся в одном отсутствии route-aware requested→physical→painted font authority. Арифметика MASTER остаётся **57 = 28 + 7 + 1 + 21**.

Product repair lane в этом аудите не открывался; Product не изменён.

**Широкая волна 46 завершена. Font-focused audit scope закрыт доказательствами; repair остаётся активной работой владельца.**
