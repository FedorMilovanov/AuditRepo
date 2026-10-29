# mp3telegrambot audit — wave 7 Telegram HTML and length safety

**Source anchor:** `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`

## Scope

HTML escaping, truncation after entity construction, Telegram message/caption limits and archive-derived content. Product heads/owners were re-read first; exact `main` and the human-owner census were unchanged.

## Verified strengths

- archive record titles, authors, statuses, warnings and URLs are escaped before insertion into Telegram HTML;
- `<pre>` repair reports trim plain source before escaping;
- `safe_trim_caption` tracks visible UTF-16 width, preserves entities and closes Telegram HTML tags;
- LiveDub publication captions escape title, author, description and source URL at their final formatting boundary;
- 29 focused archive, caption, publication and UTF-16 regression tests passed.

The census found 152 explicit Telegram HTML send sites. This wave reviewed shared builders and representative archive/runtime boundaries rather than claiming that call count alone proves every future caller safe.

## `MP3-HTML-UTF16-LIMIT-001`

The shared `_html_message_limit` used by archive/search/status commands budgets with Python `len()`, where an astral emoji counts as one code point. Telegram length/entity offsets use UTF-16 units, where the same emoji counts as two. The repository already handles this correctly in `visible_length`/`safe_trim_caption`, but the message helper implements a second incompatible counter.

A deterministic archive probe used ten records with emoji-heavy but otherwise valid escaped titles/authors. The helper returned the message unchanged because its Python length was below 3900:

```text
python 3560
utf16 6791
```

The resulting HTML substantially exceeds Telegram's 4096-unit message boundary and can be rejected instead of showing archive/search results. Existing `_html_message_limit` coverage uses ASCII/entity input and therefore misses the divergent width.

**Closure boundary:** use one shared UTF-16-aware visible-length/trimming primitive for both messages and captions, preserve whole entities/tags, and add astral-emoji tests for archive records, query titles and closing-tag budget. Do not solve this with an arbitrary lower character constant.

## Disposition

One direct Telegram delivery defect is admitted. Existing escaping and HTML-aware trimming should be unified, not replaced with plain slicing or parse-mode removal.