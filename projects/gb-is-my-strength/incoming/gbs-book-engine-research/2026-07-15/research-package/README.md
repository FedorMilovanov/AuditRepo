# GBS Engine Research Package — 2026-07-15

Отдельный исследовательский пакет по движкам `gb-is-my-strength`.

## Содержимое

```text
prototype/
  book-engine-reference-prototype.html

prototypes/
  index.html
  series-flat.html
  series-book.html
  article-reader.html
  page-engine.html

research/
  ENGINE_DOCUMENTATION_AUDIT.md
  ENGINE_PLATFORM_INTEGRATION.md
  SVG_STATE_ANIMATION_MANIFEST.md
  REFERENCE_TRACEABILITY.md
  RISK_REGISTER.md
  VALIDATION_STATUS.md

contracts/
  enginePlatformContracts.ts
  engineExamples.ts

screenshots/
  final reference-*.png evidence

meta/
  SOURCE_HEADS.txt
  FILE_MANIFEST_SHA256.txt
```

## Статус

- Это research/prototype evidence, не production patch.
- Original source repo не изменён.
- Book трактуется как `series.shape='book'`.
- Runtime engines: `series | article | page`.
- Типизированный reference contract проходит strict TypeScript.
- Browser SVG/state/motion checks — PASS.
- Visual refinement v7: sticky chapter context, staggered nested TOC reveal, reduced-motion fallback and focus-visible states.
- ZIP integrity is published next to the archive as `GBS_ENGINE_RESEARCH_2026-07-15.zip.sha256`.

## Правило использования

Не копировать standalone HTML/CSS/JS в source целиком. Использовать traceability и переносить поведение в существующих владельцев:

```text
GillSeriesChrome
GillSeriesRail
GillPartTocOverlay
GillSeriesMobileBar
GillLearningSheet
GillReaderSettingsSheet
PlayEmber
SaveButton
ReaderRail
ReaderSettings
MobileChromeShell
floating-cluster.css
floating-cluster-controller.js
```
