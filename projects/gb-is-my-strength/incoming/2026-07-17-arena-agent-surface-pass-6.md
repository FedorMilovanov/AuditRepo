# Agent Audit Report — Surface Pass 6: Future-dated metadata, Genealogy ID spaces, CSP gaps, Duplicate UI elements

## Meta

- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Agent: Arena Agent (arena.ai)
- Date: 2026-07-17
- Audited branch/ref: main
- Audited anchor (SHA): 485db8c25287fa9bd2f53a5356885f02e4b81f4b
- Signal class: Product
- Proof state: FAIL (confirmed defects)
- Claim boundary: HEAD SHA 485db8c

---

## 1. `GENEALOGY-ID-INVALID-SPACE` — Leading space in ID breaks integrity

- Kind: **defect**
- Suggested impact: medium-high
- Route(s) / owner(s): `data/genealogy/genealogy.json`
- Observed on anchor: 485db8c

**Evidence:**

`data/genealogy/genealogy.json`:
```json
{
  "id": " lud_shem",
  "name": { "ru": "Луд" }
}
```
And in children list of `shem`:
```json
"children": ["elam", "asshur", " lud_shem", "aram"]
```
The ID `" lud_shem"` contains a leading space. This violates the implicit `[a-z0-9_-]+` ID contract and will break URL fragment matching, search indexing, and graph node lookups if logic (like `computeFocusLineage`) expects trimmed IDs.

- Fix: Rename `" lud_shem"` to `"lud_shem"` in both definition and all reference points (children/father/mother).

---

## 2. `UI-DUPLICATE-SEARCH-BUTTONS` — Double search icons in mobile controls

- Kind: **defect**
- Suggested impact: medium (UX/UI)
- Route(s) / owner(s): `src/components/ui/Header.astro`, `src/components/reader-platform/ReaderPreferencesHead.astro`
- Observed on anchor: 485db8c

**Evidence:**

1. `Header.astro` (L23) renders a static search button:
   ```html
   <button id="hCpBtnNav" class="gb-nav-search-icon" ...>
   ```
2. `ReaderPreferencesHead.astro` (L30-50) injects a search button via script on specific routes:
   ```javascript
   const searchOpenerRoutes = new Set(['/articles/', '/biografii/', '/pastor-series/']);
   // ...
   if (document.getElementById('gbSearchBtn')) return; // Only checks for 'gbSearchBtn'
   const button = document.createElement('button');
   button.id = 'gbSearchBtn';
   document.querySelector('.mobile-controls').appendChild(button);
   ```

On `/articles/`, both components are active. Since `ReaderPreferencesHead` only checks for the ID `gbSearchBtn` and not the static `hCpBtnNav`, it appends a second button to the same `.mobile-controls` container.

- Fix: Ensure only one component owns the search button, or have the injection script check for the existence of `gb-nav-search-icon` class instead of a specific ID.

---

## 3. `METADATA-FUTURE-DATED` — Pages claim to be published in the future

- Kind: **defect**
- Suggested impact: medium (SEO)
- Route(s) / owner(s): `src/pages/app/index.astro`
- Observed on anchor: 485db8c

**Evidence:**

`src/pages/app/index.astro` L10-11:
```typescript
const publishedTime = '2026-08-17T00:00:00+03:00';
const modifiedTime = '2026-08-17T00:00:00+03:00';
```
Today's date is **2026-07-17**. The page claims a publication date one month in the future. Search engines (Google/Yandex) may flag this as spam or incorrect metadata, potentially affecting ranking or snippet generation.

- Fix: Update dates to current or actual historical publication dates.

---

## 4. `SECURITY-CSP-GAPS` — Missing Content-Security-Policy on articles

- Kind: **risk**
- Suggested impact: high (Security)
- Route(s) / owner(s): `src/layouts/ArticleLayout.astro`
- Observed on anchor: 485db8c

**Evidence:**

`HomePageHead.astro` and `BiografiiPageChrome.astro` contain a strict `<meta http-equiv="Content-Security-Policy" ...>` tag. However, `ArticleLayout.astro` (which wraps all articles) and `RodosloviyePageHead.astro` lack this tag. Articles are the primary content surface and are most vulnerable to injection if any user-generated content or 3rd-party scripts are added later.

- Fix: Move CSP to a shared component (e.g., `BaseLayout.astro`) to ensure it covers all routes consistently.

---

## 5. `SECURITY-CSP-INCONSISTENCY` — Biografii CSP potentially breaks local images

- Kind: **defect**
- Suggested impact: low-medium
- Route(s) / owner(s): `src/components/biografii/BiografiiPageChrome.astro`
- Observed on anchor: 485db8c

**Evidence:**

`HomePageHead.astro` CSP: `img-src 'self' https://gospod-bog.ru ...`
`BiografiiPageChrome.astro` CSP: `img-src 'self' ...` (missing site domain)

If the Biografii page uses absolute URLs for local images (e.g., `https://gospod-bog.ru/images/...`), the CSP will block them because the domain is not explicitly allowed in `img-src` while it IS allowed on the Home page.

- Fix: Align CSP `img-src` policies across all route owners.

---

## 6. `EDITORIAL-LABEL-INCONSISTENCY` — Mismatch in section naming

- Kind: **defect**
- Suggested impact: low
- Route(s) / owner(s): `src/components/ui/Header.astro`, `src/data/site.ts`
- Observed on anchor: 485db8c

**Evidence:**

`site.ts` (Canonical): `hard-texts` -> "Трудные тексты"
`Header.astro` (UI): `hard-texts` -> "Разбор заблуждений"

Users seeing one name in the navigation but another in breadcrumbs or page titles may be confused.

- Fix: Use `SECTION_META['hard-texts'].label` in `Header.astro` instead of hardcoded string.
