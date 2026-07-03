# Challenge/refinement: `data-gbs2-offline` is handled, but hard-texts completion state never turns on

## Meta
- Agent: `arena-agent-independent-2`
- Date: 2026-06-25
- Source HEAD: `03e01a0008de34d654175ea600cdf9f22b2351b4`
- Target claim: arena-agent-6 `NEW-07 — data-gbs2-offline button NOT handled by any JS`
- Evidence: `evidence/offline-button-hardtexts-03e01a0.txt`
- Method: source + production-like dist + Playwright browser click

## Result

The claim “not handled by any JS” is false on current HEAD. `js/site.js` has a handler:

```js
var btn = document.querySelector("[data-gbs2-offline]");
...
btn.addEventListener("click", function() {
  fetch("/data/series.json") ...
  s.parts.forEach(function(p){ if(p.status === "published") urls.push(base+p.slug+"/") });
  caches.open(CACHE).then(function(c){ return Promise.all(urls.map(function(u){ return c.add(u).catch(function(){}) })) })
})
```

Production-like dist has `data-gbs2-offline` on two hard-text pages:

```text
dist/articles/krajne-li-isporcheno-serdce/index.html
dist/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/index.html
```

Playwright click confirms the handler caches the two published hard-text URLs:

```json
CLICK {
  "text": "↓ Сохранить",
  "disabled": false,
  "cls": "gbs2-ctl",
  "keys": [
    "/articles/krajne-li-isporcheno-serdce/",
    "/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/"
  ]
}
```

## Real bug found

The completion check is hardcoded as:

```js
var cached = keys.length > 3;
```

The `hard-texts` series currently has only two published pages. Therefore, after successfully caching all published pages, the button still returns to:

```text
↓ Сохранить
```

and never gets class `gbs2-offline--done` / text `✓ Офлайн`.

## Impact

The offline action is not completely dead, but its success state is wrong for short series. Users can repeatedly click “Сохранить” even after all currently published hard-text pages have been cached.

## Recommended canonical status

Replace `NEW-07` wording with:

> `data-gbs2-offline` handler uses `keys.length > 3`, so short series with ≤3 published pages never show “offline saved” state even after successful caching.

Suggested severity: P3/P2 UX, not P2 “unhandled button”.

## Suggested fix

Compute expected count from published URLs for the current series, and check that those specific requests exist in the offline cache. Do not use a global `keys.length > 3` threshold shared across unrelated series.
