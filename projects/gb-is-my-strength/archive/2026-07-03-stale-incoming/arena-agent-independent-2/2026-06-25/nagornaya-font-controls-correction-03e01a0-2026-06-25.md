# Correction / split: Nagornaya font controls on `03e01a0`

## Meta
- Agent: `arena-agent-independent-2`
- Date: 2026-06-25
- Source HEAD: `03e01a0008de34d654175ea600cdf9f22b2351b4`
- Evidence: `evidence/nagornaya-font-controls-03e01a0.txt`
- Context: cross-check of `CURRENT_HEAD_REVERIFY_2026-06-25_03e01a0.md`, which says V2-2 is still dead on all 5 Nagornaya article pages.

## Finding

The “Nagornaya font controls still dead” finding should be **split by production route layer**:

1. **Root legacy HTML** (`nagornaya/chast-1..5/index.html`) still has old `#nagFontDec/#nagFontInc` markup and no `data-fontsize` attributes.
2. **Astro source / production-like dist for the five article pages** has been fixed: `data-fontsize="down/up"` appears in the five `NagornayaChastNPageChrome.astro` files and in `dist/nagornaya/chast-1..5/index.html`.
3. **Nagornaya index page remains unfixed** in Astro source and production-like dist: `src/components/nagornaya/index/NagornayaIndexPageChrome.astro` and `dist/nagornaya/index.html` still have `#nagFontDec/#nagFontInc` but zero `data-fontsize` attributes.

## Evidence summary

```text
root legacy nagornaya/chast-1..5: data-fontsize=0, nagFontDec=1, nagFontInc=1
src/components/nagornaya/chast-1..5/*PageChrome.astro: data-fontsize=2, nagFontDec=1, nagFontInc=1
dist/nagornaya/chast-1..5/index.html: data-fontsize=2, nagFontDec=1, nagFontInc=1

src/components/nagornaya/index/NagornayaIndexPageChrome.astro: data-fontsize=0, nagFontDec=1, nagFontInc=1
dist/nagornaya/index.html: data-fontsize=0, nagFontDec=1, nagFontInc=1
```

JS still listens only to:

```text
document.querySelector('[data-fontsize="down"], .nag-fontsize-down')
document.querySelector('[data-fontsize="up"],   .nag-fontsize-up')
```

It does **not** listen to `#nagFontDec` / `#nagFontInc` directly.

## Recommended canonical status

- V2-2 for **Nagornaya article pages** (`/nagornaya/chast-1..5/`): `fixed-current-production-like-dist`.
- V2-2 for **root legacy HTML**: stale source layer, not production if deploy path is dist.
- New/narrow residual for **`/nagornaya/` index**: `confirmed-current-production-like-dist`, likely P2/P3 depending on whether the landing font controls are considered as important as article font controls.

## Suggested fix

Either:

```diff
- <button id="nagFontDec" class="nag-fontsize-btn" ...>
+ <button id="nagFontDec" class="nag-fontsize-btn" data-fontsize="down" ...>

- <button id="nagFontInc" class="nag-fontsize-btn" ...>
+ <button id="nagFontInc" class="nag-fontsize-btn" data-fontsize="up" ...>
```

in `src/components/nagornaya/index/NagornayaIndexPageChrome.astro`, or extend JS selectors to include `#nagFontDec/#nagFontInc`.

Because the five part pages already use `data-fontsize`, the least risky fix is to align the index page markup with the same data-attribute contract.
