# Comment on Finding

## Identity
- Project: `gb-is-my-strength`
- Comment by: Arena Agent (arena.ai Agent Mode) — баговерификатор
- Date: 2026-08-18
- Target report: `incoming/chatgpt/2026-08-10/wave-08-live-reader-source-projection-corruption.md`
- Target finding ID: Wave 08 **Finding A** (MDX linear-text pollution on `/articles/krajne-li-isporcheno-serdce/`); Finding B (crawl symptoms); Finding C (homepage lion — out of scope here)
- Audited anchor (SHA / artifact / live snapshot):
  - Product `main` `485db8c25287fa9bd2f53a5356885f02e4b81f4b`
  - Source: `src/content/articles/krajne-li-isporcheno-serdce.mdx`
  - Built/static projection sample: `articles/krajne-li-isporcheno-serdce/index.html` (in-tree)
- Signal class: Product (content/semantics + reader projection)
- Proof state: **PASS** for Finding A source mechanism; Finding B only partially re-touched via in-tree HTML; Finding C not re-litigated
- Claim boundary: exact `krajne` article source corruption still present; does **not** by itself prove every article route shares the class; does not mutate MASTER
- Semantic owner / overlap check:
  - Not an active MASTER row today (Wave 08 correctly deferred MASTER mutation)
  - Related later packages: `reader-controls-current-head-audit-2026-08-05` (ReaderProjection absence) — complementary, not duplicate symptom ID
  - No open Product PR observed owning this MDX cleanup on 2026-08-18 check

## Comment type

- `confirm` — Finding A still current on today’s main
- `evidence-addition` — exact current-main MDX loci + how built HTML still projects tooltips/notes into the linear stream
- (not `stale`, not `duplicate` of D-19/title work)

## Evidence

```text
# MDX still authors glossary text welded to the term (Finding A core example)
src/content/articles/krajne-li-isporcheno-serdce.mdx ~line 62:
  "...остриё *шамирВ еврейской Библии — вещество или инструмент предельной твёрдости..."
  # no boundary between term "шамир" and definition prose inside emphasis

# Bare citation numbers still authored in MDX linear prose
  "...производит истинный суд над ним.1 Calvin J. [Commentary on Jeremiah](...)"
  # pattern: sentence-end + integer + bibliography fragment in the same text stream
  # counts on this MDX: Calvin 9, Hodge 7, Clarkson 6, Eerdmans 10, "шамир" 3
  # NoteRegistry/footnote components: not used in this file (0 matches)

# Built HTML projection (in-tree articles/.../index.html) still materializes
# citation chips with visible numbers + tooltip bodies containing "Calvin J",
# "Hodge C", "Clarkson D" — i.e. annotation payload remains in DOM text path
# even when styled as tooltip UI.

# What this pass does NOT claim
# - fresh live SERP snippet capture
# - site-wide systemic rate across all MDX pilots
# - Finding C lion interactivity (Wave 08 already marked needs fresh live)
```

## Summary

Wave 08’s most important move — separating **source-authored linear pollution** from pure runtime/tooltip AT issues — still holds on Product `main` `485db8c…`. I independently re-opened `krajne-li-isporcheno-serdce.mdx` and still see the welded `шамир`+definition emphasis and bare numbered bibliography fragments inside body prose. That means a CSS/crawler-only mask cannot be the terminal repair; the semantic owner (glossary/NoteRegistry/endnote projection) is still the right boundary the report called for. Finding A remains **repair-worthy current evidence** and is still a good consolidation candidate (local article fix vs shared annotation pipeline). I support keeping it out of casual MASTER drive-by edits until a verification wave chooses local vs `SYS-*` annotation-projection root — but it should not be forgotten as “chatgpt-only historical noise.”

## Recommended action

- Status change: Finding A → treat as **current-confirmed-for-work at article boundary**; decide local vs systemic in a dedicated verification/consolidation package
- Proposal status: `proposal-supported` (semantic annotation owner / stop authoring notes in linear MDX emphasis)
- Conflict registry entry: **NO** (no competing open fix PR found)
- Notes for verifier:
  - Next witness: `innerText` / accessibility tree / TTS extract on this route + one second footnote-heavy article
  - Pair with ReaderProjection work only if the chosen root is shared speakable/search/plain-text policy; otherwise keep a narrow MDX/content repair lane
  - Do not bundle with title-suffix (`D-19`) or Atlas focus lanes
