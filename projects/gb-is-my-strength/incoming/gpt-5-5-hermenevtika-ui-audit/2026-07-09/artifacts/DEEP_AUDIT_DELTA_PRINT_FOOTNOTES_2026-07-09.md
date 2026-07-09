# Deep-audit delta — footnote primitive, print/PDF and shared scroll locks — 2026-07-09

> Read after `DEEP_AUDIT_AND_MAIN_CLOSURE_2026-07-09.md`.

## HERM-UI-015 — Footnote controls are not individually identified

Every numeric note marker uses the same accessible label:

```html
<span aria-label="Показать сноску" class="fn-marker" role="button" tabindex="0">40…</span>
```

The source does not provide a stable note ID, `aria-controls`, or an initial `aria-expanded="false"`. Screen-reader users cannot distinguish footnote 1 from footnote 40 or 107 by the control name.

Required current-route contract:

- unique marker/tooltip IDs;
- label such as `Показать сноску 40`;
- synchronized `aria-expanded`;
- `aria-controls` pointing to the matching note;
- a note/tooltip semantic role;
- no interactive descendants inside note content.

A generated/shared Footnote primitive is preferable to manually maintaining this contract over 100 times. The migration must preserve exact source text and note numbering through an automated ledger.

## HERM-PRINT-001 — Print/PDF removes the academic note apparatus

Global print CSS hides:

```css
.tooltip, .btip, .gtip, button { display:none }
```

The Hermeneutics article stores bibliographic note bodies only inside `.tooltip`. Printed/PDF output therefore retains marker numbers but removes the actual notes and citations.

For an academic translation this is substantive source loss, not a decorative print issue.

The global print cleaning list also does not explicitly hide Hermeneutics-specific fixed chrome:

- `.hrail`;
- `.hmtop`;
- `.hmbar`;
- `.hmsheet`.

Since print page width can activate the mobile media query, partially empty fixed bars/search fields can also enter print layout.

Professional repair:

1. Produce an ordered print-footnotes/endnotes projection from the same canonical note data.
2. Keep screen popovers screen-only.
3. Hide all fixed Hermeneutics chrome/sheets in print.
4. Remove the desktop rail margin/offset in print.
5. Add print text/screenshot assertions: every marker resolves to exactly one printed note body.

A temporary CSS fallback may display tooltip text to prevent source loss, but the final academic PDF should use a real endnote block rather than dumping block notes inside paragraphs.

## HERM-SYS-001 — Two scroll-lock implementations share and overwrite the same global API

`js/site-utils.js` defines a Set-based `SiteUtils.lockScroll/unlockScroll`. Later `js/site.js` merges another source-map-based implementation into the same global method names. They save/restore different CSS properties and keep different internal stores.

Hermeneutics mobile TOC bypasses both and directly writes:

```js
document.body.style.overflow = 'hidden'
```

Required SYSTEM contract:

- one canonical named/reference-counted lock implementation;
- one internal source store;
- no load-order overwrite;
- every overlay owns a unique lock key;
- scroll/body styles restore only after the last owner releases;
- emergency unlock reads the canonical store;
- nested overlay tests cover both close orders.

## HERM-CONTENT-001 — Visible English source citation title is not the journal title

Official TMSJ volume 27/2 identifies the article as:

```text
A Hermeneutical Evaluation of the Christocentric Hermeneutic
```

The visible source notice currently says:

```text
A Hermeneutical Evaluation of Christocentric Hermeneutics
```

The JSON-LD `translationOfWork` already contains the correct official title. The visible citation and canonical metadata should use the same exact title.

## MAIN-plan impact

- `HERM-UI-015` belongs to the route-local footnote pass, with any shared primitive split into a separately owned component change.
- `HERM-PRINT-001` requires route print CSS plus a canonical print-note projection; it must be in final production-like browser/PDF verification.
- `HERM-SYS-001` is a separate SYSTEM lane and must not be mixed into the route-only modal patch.
- `HERM-CONTENT-001` belongs to metadata/source-truth repair and must not auto-bump editorial freshness unless the owner classifies it as a substantive editorial correction.