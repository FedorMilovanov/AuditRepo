# Широкая волна 45: cold/warm/failed-font, preload, CLS/LCP и cache boundary

Дата: **2026-10-30**  
Product anchor: `89bab745790a6a5c1cddf86fd65cb0c692b049d9`.  
Метод: isolated Chromium contexts для cold/failed, same-context reload для warm; local production-like static delivery. Все величины ниже — harness evidence, не имитация production CDN latency.

## Итог

Self-hosting уже устраняет внешний font dependency и warm reload честно отдаёт нулевой transfer. Но route cost и delivery contract не минимальны:

- representative cold routes запрашивают 2–19 font files / 21 964–259 592 encoded bytes;
- Karty тратит 21 964 bytes исключительно на unusable preload;
- Home и обычная статья при warm reload получают те же faces из cache с transfer 0;
- failed-font остаётся читаемым благодаря platform fallback;
- все 28 faces используют `swap`, но registry не задаёт fallback metric overrides и не запрещает synthesis;
- repository не задаёт production font cache policy, а font URLs не content-addressed/versioned.

## 1. Cold route cost

| Route/profile | Font responses | Encoded bytes | Font preloads |
|---|---:|---:|---:|
| Home desktop Light | 19 | **259 592** | 3 |
| Home mobile Dark | 18 | 236 836 | 3 |
| Enoch desktop Light | 14 | 185 724 | 1 |
| Enoch mobile Dark | 13 | 176 164 | 1 |
| Lawson desktop Light | 11 | 155 212 | 6 |
| Lawson mobile Dark | 12 | 164 856 | 6 |
| Karty desktop/mobile | 2 | 21 964 | 2 |
| ordinary Lora desktop Light | 14 | 198 796 | 2 |
| ordinary Lora mobile Dark | 13 | 189 236 | 2 |

Это browser-demanded subset, а не полный 488 980-byte WOFF2 inventory. `unicode-range` работает: Greek 147 464-byte Serif WOFF2 и 444 064-byte TTF не загружаются на маршрутах без соответствующего glyph demand.

Однако partitioning не решает неправильную матрицу: отсутствие Latin/Punctuation face создаёт дополнительные platform-font runs, а unsupported weight всё равно загружает ближайший local face.

## 2. Preload census

В 115-document output:

- 72 routes имеют font preload;
- всего 89 preload links;
- Lora Cyrillic 400 preload повторён на 68 routes;
- пять routes preload-ят bytes без registry.

На проверенных registry routes preloaded URL действительно появляется среди resource requests. Но это ещё не доказывает, что каждый preload — critical-path win. Особенно широк Lawson: шесть faces / **86 932 bytes** preload-ятся до того, как browser сам определит glyph demand. LCP element там — Georgia/system heading, поэтому шесть preload нельзя автоматически назвать LCP-critical.

Karty даёт безусловный negative control: два preloads / 21 964 bytes, `document.fonts` содержит 0 faces, custom painting 0 glyphs. Cold, warm и failed-font внешний вид Hebrew sample одинаково остаётся DejaVu; значит эти preloads не только избыточны, но и функционально отсоединены.

## 3. Warm-cache probe

Same-context reload после полного cold `document.fonts.ready`:

| Route | Warm font resources | Encoded body size | Transfer size | CLS |
|---|---:|---:|---:|---:|
| Home | 17 | 229 736 | **0** | 0 |
| Karty | 2 | 21 964 | **0** | 0 |
| ordinary article | 13 | 180 384 | **0** | 0 |

Browser cache работает в harness; custom/platform painted composition не меняется. Warm cache не исправляет неполный glyph/weight matrix: Home H1 остаётся split Playfair + DejaVu, а Karty — полностью DejaVu.

LCP warm/cold в локальном static harness не монотонен (Home 272→400 ms, article 300→220 ms, Karty 116→76 ms), поэтому из этих единичных малых величин не делается ложный вывод об ускорении. Валидный вывод здесь — byte transfer 0 и идентичность face selection.

## 4. Failed-font probe

Маршрутные font requests были нативно abort-нуты до ответа, без forced readiness/click:

| Route | Aborted fonts | `FontFace` status | Painted sample | CLS | LCP |
|---|---:|---|---|---:|---:|
| Home | 18 | 18 error | H1 → DejaVu Serif | 0 | 288 ms |
| Karty | 2 | registry empty | Hebrew → DejaVu Sans | 0 | 100 ms |
| ordinary article | 14 | 13 error | H1/Greek/Hebrew → DejaVu | 0.0000017 | 364 ms |

Content remains readable; no invisible-text interval was observed because `font-display:swap` and fallback stacks operate. Это хороший resilience результат.

Но blocked-before-first-paint — не delayed-swap simulation. Он не отменяет ранее доказанные route-specific cold CLS на Hermenevtika/Nagornaya и Home ambient owner. Текущая волна также не переносит локальные LCP числа на production сеть.

## 5. Metric compatibility и synthesis

Registry содержит:

- 28/28 `font-display:swap`;
- 0 `size-adjust`;
- 0 `ascent-override`;
- 0 `descent-override`;
- 0 `line-gap-override`;
- 0 explicit `font-synthesis` policy.

Поэтому swap использует platform-dependent Georgia/Arial/system metrics, а unsupported weights/styles синтезируются или заменяются ближайшим face. Это объясняет, почему failed-font readable, но не гарантирует одинаковые line breaks/CLS на Linux, Windows, Android и macOS.

Closure не требует механически добавить overrides ко всем faces. Сначала нужен measured per-token fallback: cap-height/x-height/advance/line metrics и реальные mixed-script strings; затем overrides только там, где A/B уменьшает layout movement без clipping.

## 6. Cache/delivery boundary

В repository не найден deploy-level `_headers`, `netlify.toml`, `vercel.json` или иной owner для `Cache-Control` шрифтов. GitHub Pages transport используется, но его фактические response headers в этой sandbox-волне не измерены; выдумывать production TTL нельзя.

Важная source truth:

- `fonts.css` подключается с version query;
- внутренние WOFF2 URLs — стабильные неверсированные paths;
- сам binary manifest знает SHA-256, но URL его не несёт.

Поэтому `immutable` header на текущие paths был бы небезопасен: новый binary может получить старый URL. Правильная последовательность — content-addressed filename либо manifest-derived version query, затем длинный immutable cache; до этого нужен честный revalidation policy.

## 7. Performance decision

Нельзя объявлять «полная локальная матрица всегда быстрее». Она улучшает identity и уменьшает platform variation только для реально используемых tokens, но каждый новый face увеличивает cold bytes/requests. Route-driven решение:

1. удалить/исправить preload-without-registry;
2. preload-ить только owner-approved LCP/first-viewport faces;
3. нормализовать ложные weights/styles до имеющихся faces, если различие не нужно;
4. добавлять face только для частого reader-visible token с доказанным paint demand;
5. исключить byte-identical Hebrew duplicate и недоказанный 444 KB TTF fallback из default cargo после compatibility review.

**Широкая волна 45 завершена.**
