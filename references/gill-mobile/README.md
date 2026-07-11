# Gill mobile — reference archive

Canonical design references for the **John Gill** mobile reader/chrome on
`gospod-bog.ru` (repo `FedorMilovanov/gb-is-my-strength`). These are the
source-of-truth mockups the live site is reconciled against. Kept here so we
stop losing them between sessions.

## Files

| File | What it is | Status |
|------|------------|--------|
| `gill-mobile-bars-v2.7.html` | Mobile bars + learning sheet + **part-TOC (оглавление частей)** + tests/features. Latest. | ✅ **CANONICAL** — reconcile to this |
| `gill-mobile-bars-v2.6.html` | Prior iteration: search moved to a trailing icon tab; 4 text tabs (Термины/Конспект/Тест/Заметки). | superseded by v2.7 |
| `gill-mobile-bars-v2.5.html` | Earlier: borderless/flush frosted bars, `.hlp-*` learning panel, 5 text tabs. | superseded |
| `gill-quiz-launch-reference.html` | Quiz launch screen mockup (`quiz-launch-hero`, category chips, spaced-repetition note). | reference |
| `gill-quiz-launch-TASK.md` | Task spec for the quiz launch screen. NOTE per owner: do **not** show "how many of each question type / how many authors" — that count-chip idea is a reference error, skip it. | task |
| `gill-reader-v5-AUDIT.md` | Audit of the live reader v5 (Свободный wrap → needs font `clamp`, duplicate-citations bug in `highlights.js`, the "paperclip near Настройки" = browser/webview artifact not our code). | audit |
| `gill-research-3-engines-package.zip` | The "3 mobile engines" agent package (series=Gill / article=Hermenevtika / page). | package |

## How to use

Reconcile **visual 1:1** to the canonical reference (currently v2.7) — same look,
no eyeballed "liberties" — while keeping agreed improvements (search as a trailing
icon, search scoped to the series, no count-chips). When a screen looks off on the
live site, diff it against the canonical reference here rather than guessing.

## Convention going forward

Drop new reference mockups here as `gill-mobile-bars-vX.Y.html`, bump the
**CANONICAL** row above, and mark older ones superseded. One archive, no lost files.
