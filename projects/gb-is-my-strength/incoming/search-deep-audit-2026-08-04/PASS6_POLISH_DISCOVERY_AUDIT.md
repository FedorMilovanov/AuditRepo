# Search audit pass 6 — premium polish and discovery depth

**Date:** 2026-08-04  
**Product source HEAD:** `f9d0120718569c510833dba7a3abd68ce2f6a003`  
**Parent reports:** pass 1–5 in `incoming/search-deep-audit-2026-08-04/`  
**Machine artifact:** `PASS6_POLISH_DISCOVERY_PROBE.json`

## 1. Scope

This pass focuses on premium polish and discovery depth after the higher-severity route, Scripture, SearchAction, ARIA and modal/touch defects were already promoted.

A bash/Node harness executed **58 checks** across:

- route trigger labels;
- copy-link behavior;
- result depth/show-more behavior;
- hard-coded suggestions;
- CSS premium details;
- manifest metadata;
- interaction code paths;
- Pagefind raw result counts.

Result:

```json
{
  "checks": 58,
  "passed": 43,
  "failed": 11,
  "warnings": 0
}
```

Many failures are already owned by P1/P2 rows. This pass promotes only P3 polish/discovery defects that are independent enough to track without inflating the P1/P2 repair surface.

## 2. Failed checks

```text
L02 fail — search trigger labels are inconsistent
L06 fail — search.js injected trigger title is Cmd-only (`Поиск ⌘K`)
L09 fail — data-action=open-search is not delegated by shared search.js
P01 fail — preview copy link hard-codes production origin
P02 fail — copy button label does not say canonical when hard-coding production origin
D01 fail — Pagefind branch caps at results.slice(0,10) with no show-more
D02 fail — manifest branch caps at slice(0,12) with no show-more
D06 fail — popular suggestions are hard-coded in runtime array
D07 fail — Scripture suggestions are hard-coded in runtime array
D08 fail — placeholder still says “Писанию” despite exact Scripture search defects
M06 fail — only 13/63 article/series manifest items have scripture metadata
```

Already-owned failures:

- `D07`, `D08`, `M06` are owned by `SEARCH-P1-03` / `SEARCH-P1-04` and `SEARCH-P2-07` / `SEARCH-P2-08`.
- `L09` is related to the broader global route/search bootstrap divergence. It is not promoted separately because Home owns a route-specific handler path, and real browser witness is needed before treating it as a shared-runtime defect.
- `D06` hard-coded popular suggestions are a maintainability smell, but not severe enough alone.

## 3. New P3 findings

### SEARCH-P3-01 — Search shortcut/trigger labels are inconsistent across routes

**Severity:** P3  
**Type:** premium polish / cross-route UX consistency

Probe found distinct trigger labels:

```json
[
  "Поиск",
  "Поиск и разделы сайта",
  "Поиск (Ctrl+K)",
  "Открыть поиск по материалам сайта"
]
```

Additionally `js/search.js` still injects `title="Поиск ⌘K"`, which is Mac-centric on Windows/Linux contexts and differs from home’s `Ctrl+K` label.

Impact:

- Search is functionally present in many places, but the cross-route affordance is not premium/cohesive.
- Shortcut labels should be neutral (`Ctrl/⌘ K`) or platform-adaptive after hydration.

Repair direction:

- One shared search trigger label contract.
- One platform-aware shortcut label helper.
- Guard labels in production-like dist for route families.

---

### SEARCH-P3-02 — Search result depth is capped without disclosure or expansion

**Severity:** P3  
**Type:** discovery UX / premium search depth

Evidence:

```text
Pagefind branch: results.slice(0,10)
manifest branch: slice(0,12)
no “Показать ещё” / show-more path
status text only shows rendered `N рез.`
```

Raw Pagefind counts in the probe show the corpus is deeper than the visible list:

```text
сердце    => >20 raw results
благодать => >20 raw results
Бытие 6   => >20 raw results
Павел     => >15 raw results
```

Impact:

- Users cannot tell that many more relevant results exist.
- This makes search feel like a decorative command palette rather than a premium library search.

Repair direction:

- Show raw total or “показано 10 из N”.
- Add “Показать ещё” / incremental loading.
- Keep keyboard semantics intact when expanding.

---

### SEARCH-P3-03 — Preview copy-link hard-codes production origin without canonical wording

**Severity:** P3  
**Type:** polish / staging correctness / trust

Current behavior:

```text
copy target = "https://gospod-bog.ru" + e.url
button label = "Скопировать ссылку"
```

If the intent is canonical sharing, the UI should say so. If the intent is current-origin sharing, it should use `new URL(e.url, location.origin).href`.

Impact:

- In preview/staging/local contexts, copying silently changes origin to production.
- The label does not communicate that this is canonical-production behavior.

Repair direction:

- Either change label to “Скопировать каноническую ссылку”.
- Or copy current-origin URL with `new URL(e.url, location.origin).href`.
- Add a simple source test for whichever behavior is chosen.

## 4. Positive premium polish evidence

Pass 6 also confirmed:

- trigger inventory is non-empty;
- icon-only triggers have labels;
- copy feedback “Скопировано” exists;
- `SiteUtils.copyText` is used when available;
- color-mix / dark highlight / hover / active marker / mobile 100dvh / reduced CSS important use are present;
- manifest images are root-relative;
- article/series readTime is present;
- clear/history/debounce/keyboard navigation paths exist;
- Pagefind raw counts are available and high enough to justify show-more.

## 5. Matrix movement recommendation

Promote:

- `SEARCH-P3-01`
- `SEARCH-P3-02`
- `SEARCH-P3-03`

Do not promote separately:

- hard-coded Scripture suggestions / placeholder / sparse scripture metadata — already owned by P1/P2 Scripture rows;
- `data-action=open-search` shared delegation — requires browser witness and may be route-owned;
- hard-coded popular suggestions — keep as repair-plan note unless owner wants governed suggestions.

## 6. Closure requirements

For `SEARCH-P3-01`:

- one shared/platform-aware shortcut label helper;
- route-family dist guard for trigger labels.

For `SEARCH-P3-02`:

- raw total displayed or show-more available;
- keyboard navigation after expansion tested.

For `SEARCH-P3-03`:

- owner decision: canonical-production copy vs current-origin copy;
- UI label and implementation aligned;
- source test for copy URL construction.
