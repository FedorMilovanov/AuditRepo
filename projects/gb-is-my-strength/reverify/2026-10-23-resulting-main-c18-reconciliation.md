# 2026-10-23 — resulting-main reconciliation после Product #2183

AuditRepo вход: clean `1a09fda0af41655be699c85a80b48e7fb5af6eb2`, локальные гейты 4/4 PASS. Product #2183 слит 2026-10-23T10:26:54Z; новый `main` / merge **`c18cd9621d5d72dd6505bb3b4993533bafa1812c`**. Exact-SHA `npm ci` + `strangler:build:production-like` PASS, Product tree clean. Deploy этого SHA и часть CI ещё queued/in-progress; production claim отсутствует.

## Закрываются три поведенческих finding

Fresh production-like build, Chromium153, desktop1440/mobile390 ×Light/Dark, reduced motion, SW blocked. Полный повтор сохранён, не только source inference.

1. **`GBS-NOTE-MARKER-NUMBER-DRIFT` — FIXED-CURRENT behavior.** Все 5 note routes ×4 profiles: visible number↔published ordinal mismatch **0**; closed label-content mismatch0. В результирующем build числовые marker/endnote labels канонизированы, безномерные explanations остаются без номера. Native descriptions/endnote binding сохранены.
2. **`SYS-FOOTNOTE-MARKER-INTERACTIVITY` — FIXED-CURRENT.** Closed nested-interactive axe rules0 на всех 20 route/profiles; opened tips по-прежнему связаны с trigger и Escape закрывается.
3. **`GBS-TOOLTIP-MOBILE-ESCAPE-REOPEN` — FIXED-CURRENT.** В прежних rich/plain keyed/keyless/note/reference profiles reopened states **0**; все captured popup Escape outcomes closed. Main source получил inert lifecycle и bounded opener-focus repair через #2183.

Это behavioral closure на resulting main, не production/live/реальные AT. Существующий route browser fixture не запускался локально из-за отсутствующего Playwright Firefox binary (delivery boundary), но source core guard PASS и независимый Chromium class sweep выше покрывает фактически найденные owners/routes. Не выдаём отсутствие Firefox за Product failure или невозможность браузера.

## Новая current authority inconsistency

Поведенческий mismatch исправлен, но current owners противоречат друг другу:

- нормативный `docs/REFERENCE-TOOLTIP-CONTRACT.md`: **“Numbered Bible or academic notes preserve their visible number.”**;
- executable `scripts/lib/note-registry.mjs` теперь заменяет manuscript digits на internal ordinal, а тест прямо требует `27/36 → 2/3`, сохраняя authored digits лишь как metadata/report.

Это не возврат старого UI defect и не основание самовольно отменять слитое решение. Новый necessary improvement **`SYS-NOTE-NUMBER-AUTHORITY-CONTRADICTION`** требует выбрать одно правило и синхронизировать normative doc, generator/test и reader/print contract. Human approval/intent не придуманы: merge подтверждает принятое executable behavior, но не молча переписанный policy text.

## Что осталось применимым

- Definition association: **56** gterm/bref states по-прежнему без description relation; A/B controls продолжают доказывать механизм.
- Нагорная: wrong publication/modification slot **20/20** chapter profiles.
- Krajne reduced-motion card/quiz occlusion: оба reduced width controls блокируют native launch; normal-motion controls проходят, reversible layout A/B остаётся.
- Mobile Nagornaya PLAY Dark: **1.869:1**, Light16.091:1 — merge #2183 не закрыл именно этот glyph; paired pixel method повторён.
- TTS owners `vosk-tts-engine.js`, worker, reader runtime, notice CSS, ORT source guard и `package-lock.json` побайтово равны d14; TTS retry/status/guard findings остаются source-current. Native notice race дополнительно повторена на c18 в desktop Light/mobile Dark: Disabled/Enable и active Loading/Cancel исчезают в fade window.

## CI и ограничения

На snapshot у c18 **72 checks:35 success /3 failure /4 in-progress /17 queued /13 skipped**. Названия failure: Chromium WebKit Intro focus lifecycle, source-links, Hermenevtika Chromium WebKit chrome contract; первопричины этой wave не установлены. Deploy queued. Не заявляются all-CI-green, production bytes, WebKit/реальные AT, TTS model/audio/inference или завершённая публикация.

[146 компактных документов](evidence/2026-10-23-resulting-main-c18.json): metadata + owner hashes + все 120 semantic capture objects +6 card motion records +2 PLAY pixels +8 c18 notice records +6 owner hashes. Round-trip exact, строки≤698chars. PNG/build/node_modules/logs вне Git. Предыдущие anchor-bound receipts сохранены.

**Arithmetic: 58 →56 =51 defects +4 necessary improvements +1 system lane.** Три Product fixes закрыты, одна current authority inconsistency добавлена. Это не 56 свежих repro и не PRODUCT ZERO.
