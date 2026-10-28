# Широкая перепроверка системного admission/control plane — волна 20

**Product:** `1aff67560d56d8521aaeab81bdc361f33dbd6af6`  
**Дата:** 2026-10-29  
**Охват:** все 18 system verification lanes, общий статический admission, dependency lifecycle и нативный no-JS FAQ residual.

## 1. Полный лёгкий admission chain

На exact-current production-like dist выполнен `npm run validate:static-publication:light`. Вся цепочка завершилась exit 0. Она включает strict validation и SEO, owner/UI и visual-parity contracts всех route families, map/publication/ownership checks, token/CSS checks, `audit-pro`, content/source/article/readable/editorial gates, Gill data/claims/pagefind contracts, MDX structure, URL contract, migration metadata, Astro article/Baptist audits и SW readiness.

Результат важен именно как control: текущие active rows не означают общий red build. Напротив, широкая цепочка зелёная и тем самым подтверждает известные coverage gaps: malformed copy, projection semantics, typograf fail-open, advisory CSS governance и runtime interaction owners не должны закрываться только потому, что admission проходит.

Build hints Shiki `greek`→plaintext и 21 informational article-contract warnings не являются failure. Product workspace не менялся.

## 2. Dependency advisory lifecycle

Fresh `npm audit --json` завершился non-zero и сообщает один direct package `astro` severity `moderate`, объединяющий **две advisories**:

1. reflected/stored XSS через unescaped `<script>/<style>` в JSX/MDX rendering;
2. arbitrary CSS injection в Astro View Transitions.

Metadata: 0 critical, 0 high, 1 moderate package, 0 low; 578 total dependencies. Это согласуется с текущим `SYS-DEPENDENCY-ADVISORY-LIFECYCLE`: advisory scan существует, но owner-approved schedule/disposition не появляется. Строка остаётся active; dependency не обновлялась в audit lane.

## 3. Native no-JS FAQ witness

Для четырёх FAQ routes (Krajne, Kod, Hermenevtika, Antisovetov) выполнены desktop 1280 и mobile 390 с `javaScriptEnabled=false`: **8/8 profiles**. В каждом route `.faq-accordion__body` содержит реальный текст (первые ответы 638/672/647/1097 символов), но имеет `display:grid`, `getBoundingClientRect().height=0` и `scrollHeight=0`.

Итак, `SYS-FAQ-COLLAPSED-FOCUS-EXPOSURE` остаётся active именно по progressive-enhancement boundary: данные в DOM/`body.innerText` не означают читабельный no-JS output. Никаких forced clicks или post-load style mutation не применялось.

## 4. Reconciliation остальных системных lanes

Все 18 rows сопоставлены с exact-current owner diff и результатами волн 17–20:

- tooltip/glossary, projection/speakable/head assets, dateline, TTS/share outcomes и FAQ parity сохраняют прежние узкие residuals;
- language-of-parts, mixed-script и typography fail-open не покрываются зелёными generic gates;
- discovery authority и content-authoring transaction остаются governance gaps, несмотря на зелёные route/content contracts;
- reading tables, strategic-map trigger geometry и reversible-card nesting требуют нативных interaction closures; зелёный static admission их не заменяет;
- CSS validator всё ещё проходит в advisory режиме;
- dependency lane подтверждена fresh audit выше.

Новых causal roots не обнаружено. Ни одна system row не получила достаточного universal closure proof; дробить их на point rows не требуется.

## 5. Итог requested sequence

Broad waves **16, 17, 18, 19 и 20 завершены**. В волне 20: 18 system lanes refreshed, 0 закрыто, 0 добавлено, 0 поглощено. Итоговая матрица остаётся **53 = 27 direct + 7 improvements + 1 residual + 18 systems**.

Машинная квитанция: `evidence/2026-10-29-system-admission-wide-refresh.jsonl`.
