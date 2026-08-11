# Current Verification — community comment text fidelity

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

Product mutation: **none**.

No competing open Product issue was found for this rendering mechanism.

This wave creates a reader-facing P3 data-presentation root. It is intentionally separate from `TLP-COMM-DELIVERY-001`: the text can be stored/delivered correctly and still be rendered with altered structure.

## 1. CONFIRMED — stored comment line breaks are lost in the rendered card

### Input/storage preserve internal newlines

`CommentComposer` uses a multi-line `<textarea rows={5}>`, so line breaks are part of the ordinary authoring surface.

Client normalization in `communityStore.ts` does:

```ts
value
  .replace(/\r\n?/g, '\n')
  .replace(/[\t ]+/g, ' ')
  .trim()
  .slice(0, maxLength)
```

This deliberately normalizes line endings but **does not remove `\n`**.

The server RPC likewise uses:

```sql
clean_text := trim(coalesce(p_text, ''));
```

and validates `char_length(clean_text)` without replacing internal line breaks.

Therefore an author can submit text such as:

```text
Первая мысль.

Вторая мысль.
```

and the stored/local/remote comment value can retain those line breaks.

### Renderer collapses them visually

`ExpandableText` renders the visible string as:

```tsx
<p className="text-sm leading-relaxed text-cyan-50/68">
  {visibleText}
</p>
```

There is no `white-space: pre-wrap` / `whitespace-pre-wrap` / equivalent line-break conversion.

Under normal HTML white-space processing, internal newlines collapse into ordinary spaces. A deliberately multi-paragraph comment therefore appears as one continuous paragraph even though the data layer preserved the author’s structure.

### Root cause

**The community text model preserves plain-text structure, but the display component treats it as whitespace-normalized prose.**

This is not XSS sanitization and not a remote-delivery failure; it is a presentation fidelity mismatch between producer, persisted value and renderer.

## 2. CONFIRMED — UTF-16 truncation can split an emoji/surrogate pair

`ExpandableText` decides and truncates with:

```ts
const shouldCollapse = text.length > collapsedChars;
const visibleText = ... ? text : `${text.slice(0, collapsedChars).trim()}…`;
```

JavaScript `String.length` / `slice` operate on UTF-16 code units, not user-perceived Unicode characters/graphemes.

A deterministic example with the default `collapsedChars=220`:

- 219 ASCII characters;
- followed by one supplementary-plane emoji such as `😀` (two UTF-16 code units).

The full string length is 221 code units, so it enters the collapsed branch. `slice(0, 220)` includes the first surrogate code unit but not the second, producing a broken trailing character before the ellipsis.

The same code-unit model can also count emoji-heavy comments toward the collapse threshold differently from visible character count.

### Relationship to delivery validation

Client/server length semantics already have Unicode differences under `TLP-COMM-DELIVERY-001` because browser/JS lengths and PostgreSQL `char_length` do not measure all Unicode strings identically.

This current witness is different: even a comment already accepted and correctly persisted can be **visually corrupted only by the collapse renderer**.

## 3. XSS candidate explicitly retracted

Public comment text reaches `ExpandableText` as a React string child. It is not passed through `dangerouslySetInnerHTML` or parsed as markup in the inspected comment path.

Author names likewise render as text children/title values.

Therefore no current stored-comment HTML/script-injection root is established from this path.

Do not “fix” newline fidelity by switching to unsanitized HTML rendering. Plain-text rendering with an appropriate white-space policy preserves both structure and React escaping.

## 4. Disposition

New active root: **`TLP-COMM-TEXT-001` / P3**.

Required terminal outcome:

- preserve author-entered plain-text line breaks in rendered comments, normally with a safe plain-text whitespace policy such as `white-space: pre-wrap`;
- keep React text escaping / no raw HTML;
- make collapse boundaries Unicode-safe so supplementary characters and ideally grapheme clusters are not split;
- define whether the collapse limit is bytes, code points, graphemes, words or visual lines and use that definition consistently;
- preserve the same rendering in optimistic local comments and remote comments.

A pragmatic implementation can use `Intl.Segmenter` where available with a safe code-point fallback, or truncate by words/lines rather than raw UTF-16 offsets. The exact algorithm is an implementation choice; broken surrogate output is not.

## 5. Audit-harness impact

Strengthen **`TLP-AUDIT-004`** with deterministic comment-rendering fixtures:

1. submit/render a comment containing two paragraphs and assert the visual/DOM white-space contract preserves the break;
2. render 219 ASCII characters followed by an emoji and additional text; collapsed output must not contain an unpaired surrogate/replacement glyph;
3. test several emoji/combining-character strings around the collapse boundary;
4. include markup-looking text (`<script>`, `<b>`) and assert it remains literal escaped text;
5. verify expanded/collapsed toggling retains exact plain-text content and does not change the persisted value.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| textarea/store/server preserve line breaks | expected current behavior |
| ordinary `<p>` collapses those stored line breaks | new `TLP-COMM-TEXT-001` / P3 |
| UTF-16 slice can split emoji at collapse boundary | same text-fidelity root |
| client/server Unicode validation-length drift | existing `TLP-COMM-DELIVERY-001` |
| stored-comment raw HTML/XSS | retracted; React text rendering is safe in inspected path |
| missing text-fidelity regression | strengthen `TLP-AUDIT-004` |

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: 1 P3.
- Existing root strengthened: `TLP-AUDIT-004`.
- Security false positive retired: stored comment HTML/XSS through the current React text path.
