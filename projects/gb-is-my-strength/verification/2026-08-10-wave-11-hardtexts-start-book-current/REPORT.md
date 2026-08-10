# Reverification — prior Wave 11 HardTexts `Начать книгу` CTA

Date: 2026-08-10
Disposition: `CONFIRMED-CURRENT / P2` navigation-semantic defect on current published Product.

## Provenance

Prior raw evidence already exists in AuditRepo commit `360348ef1cac0e9bd5f7224ff1dba4e0db806de0`, report:

`projects/gb-is-my-strength/incoming/chatgpt/2026-08-10/wave-11-shared-runtime-pagefind-editorial-schema.md`.

That wave recorded that the HardTexts book CTA labelled `Начать книгу` linked to Chapter I while the canonical book begins with a Prologue. It remained raw and was not turned into a repair row.

## Current authority

- Product current main: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- Exact published candidate: deploy run `31379283849`, artifact `9059689652`.
- Product open issue/PR deduplication for `Начать книгу` / HardTexts Prologue: no current owner found.
- Product mutation: none.

## V11-HARDTEXTS-START-BOOK — CONFIRMED-CURRENT / P2

### Current visible contradiction

The current `/hard-texts/` landing presents its published book shelf in this order:

1. `Пролог` — `Библейская кардиология: что Библия называет сердцем` → `/articles/chto-bibliya-nazyvaet-serdcem/`;
2. `Глава I · Статья 1` — `Крайне ли испорчено моё сердце — если я уже верующий?` → `/articles/krajne-li-isporcheno-serdce/`;
3. subsequent chapter leads and reference endpaper.

The later CTA is explicitly labelled as the book entry action:

- nav accessible label: `Начать чтение книги`;
- eyebrow: `Начать книгу · Глава I · Статья 1 · ~41 мин`;
- target: `/articles/krajne-li-isporcheno-serdce/`.

So the current user-facing action called “start the book” skips the current first published book item.

### Canonical series authority confirms the Prologue is first

Current `data/series.json` for `hard-texts.parts` orders:

- `n: 0`, slug `chto-bibliya-nazyvaet-serdcem`, published, 39 min;
- `n: 1`, slug `krajne-li-isporcheno-serdce`, published, 41 min;
- then `n: 2..5`.

The current shelf source independently labels that `n=0` item `Пролог` and places it first.

The current series-map component comment states that the map follows the active book-shaped series config, but its CTA remains hardcoded to the `n=1` route. This is therefore projection drift between the canonical book order and a book-start affordance.

### Why this is necessary work rather than optional wording polish

This control determines the reader’s starting position in a sequential book. The current label promises the start of the book while the target skips the published Prologue that the same page and canonical series data identify as the first item.

The repair does not require guessing owner intent. The terminal contract is simply that the action and canonical order agree:

- if the action remains labelled `Начать книгу` / `Начать чтение книги`, it should start at the canonical first published book item;
- if the deliberate editorial intent is to bypass the Prologue, the control must truthfully say it starts from Chapter I rather than claiming to start the book.

Prefer deriving the target/label from the current series authority instead of maintaining another hardcoded book-entry projection.

### Existing coverage false-green boundary

Current HardTexts visual/native guards preserve route markup and parity but do not assert semantic equality between the book-start CTA and the first published item of `data/series.json`.

A visually correct CTA and a green series build can therefore coexist with a wrong sequential start target.

### Required terminal outcome

A bounded HardTexts navigation repair must establish:

- the book-start affordance and the canonical first published series item cannot diverge silently;
- current Prologue → Chapter I ordering is preserved unless explicitly changed in the canonical series authority;
- accessible label, visible eyebrow/title and href describe the same editorial action;
- a permanent data-driven contract derives or compares the CTA against the current series order rather than hardcoding a second book-entry registry;
- mutation witness proves changing only the CTA href to a non-first item while keeping `Начать книгу` makes the contract fail.

## Product mutation

None. This report promotes prior raw evidence using current exact source and published-output confirmation.
